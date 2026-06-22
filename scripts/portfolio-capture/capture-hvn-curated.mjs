#!/usr/bin/env node
/**
 * Curated portfolio capture for HVN CrossFit (The HVN).
 *
 * Captures desktop + mobile screenshots from https://www.thehvncrossfit.com/
 * Viewport shots are 1440x900 (desktop) / 430x932 (mobile) to match the
 * portfolio gallery's 16:10 tiles.
 *
 * Usage:  node scripts/portfolio-capture/capture-hvn-curated.mjs
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const SITE = 'https://www.thehvncrossfit.com';
const SLUG = 'thehvncrossfit-com';
const OUT_ROOT = path.resolve('public', 'captures', SLUG);

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 430, height: 932, isMobile: true, hasTouch: true };

async function settle(page, ms = 2600) {
  try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch { /* noop */ }
  await page.waitForTimeout(ms);
}

async function scrollTop(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

async function scrollToText(page, text) {
  const ok = await page.evaluate((t) => {
    const needle = t.toLowerCase();
    const els = [...document.querySelectorAll('h1,h2,h3,h4,section,[class*="section"]')];
    const el = els.find((e) => e.offsetHeight > 40 && (e.textContent || '').toLowerCase().includes(needle));
    if (el) { el.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy(0, -24); return true; }
    return false;
  }, text);
  await page.waitForTimeout(900);
  return ok;
}

// Desktop targets — { id, route, caption, anchor? (text to scroll to) }
const DESKTOP_TARGETS = [
  { id: '01-hero', route: '/', caption: 'Home — full-bleed video hero, "Welcome to the HVN"' },
  { id: '02-value-props', route: '/', anchor: 'Community', caption: 'Home — Every Level Welcome / Community Driven / Expert Coaching' },
  { id: '03-chinup-game', route: '/', anchor: 'Chin Up', caption: 'Home — bespoke "Chin Up Championship" scroll mini-game' },
  { id: '04-home-cta', route: '/', anchor: 'Ready to', caption: 'Home — timetable snippet and "Ready to Start?" CTA' },
  { id: '05-about-story', route: '/about', caption: 'About — "Our Story" with the founders' },
  { id: '06-about-coaches', route: '/about', anchor: 'Coaches', caption: 'About — "Meet the Coaches" spotlight and grid' },
  { id: '07-classes-timetable', route: '/classes', anchor: 'Monday', caption: 'Classes — colour-coded weekly timetable' },
  { id: '08-classes-programs', route: '/classes', anchor: 'Endure', caption: 'Classes — program descriptions' },
  { id: '09-memberships', route: '/memberships', caption: 'Memberships — HVN Base & Flexi plans with add-ons' },
  { id: '10-book', route: '/book', caption: 'Book — HVN-branded Fitbox live booking embed' },
  { id: '11-contact', route: '/contact', caption: 'Contact — details, Google Maps embed, and contact form' },
  { id: '12-gallery', route: '/gallery', caption: 'Gallery — masonry grid of community & training photos' },
  { id: '13-shop', route: '/shop', caption: 'Shop — HVN merch grid' },
];

const MOBILE_TARGETS = [
  { id: '01-hero', route: '/', caption: 'Mobile — hero with stacked CTAs' },
  { id: '03-chinup-game', route: '/', anchor: 'Chin Up', caption: 'Mobile — touch-driven "Chin Up Championship" mini-game' },
  { id: '04-timetable', route: '/classes', anchor: 'Monday', caption: 'Mobile — timetable as stacked cards' },
  { id: '05-memberships', route: '/memberships', caption: 'Mobile — membership plans' },
  { id: '06-book', route: '/book', caption: 'Mobile — Fitbox booking embed + QR sign-up' },
  { id: '07-gallery', route: '/gallery', caption: 'Mobile — single-column gallery' },
  { id: '08-contact', route: '/contact', caption: 'Mobile — contact details and form' },
];

async function run(ctx, targets, outDir, label) {
  const page = await ctx.newPage();
  let lastRoute = null;
  for (const t of targets) {
    try {
      if (t.route !== lastRoute) {
        await page.goto(`${SITE}${t.route}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await settle(page);
        lastRoute = t.route;
      }
      if (t.anchor) {
        const found = await scrollToText(page, t.anchor);
        if (!found) console.warn(`     ! anchor "${t.anchor}" not found for ${t.id}`);
      } else {
        await scrollTop(page);
      }
      const outFile = path.join(outDir, `${t.id}.png`);
      await page.screenshot({ path: outFile });
      console.log(`  [${label}] ✓ ${t.id}.png`);
    } catch (err) {
      console.warn(`  [${label}] ✗ ${t.id}: ${err.message}`);
    }
  }
  await page.close();
}

async function main() {
  const desktopOut = path.join(OUT_ROOT, 'desktop');
  const mobileOut = path.join(OUT_ROOT, 'mobile');
  await fs.mkdir(desktopOut, { recursive: true });
  await fs.mkdir(mobileOut, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  console.log('\n── Desktop pass ──');
  const dt = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  await run(dt, DESKTOP_TARGETS, desktopOut, 'desktop');
  await dt.close();

  console.log('\n── Mobile pass ──');
  const mb = await browser.newContext({ ...MOBILE, viewport: { width: MOBILE.width, height: MOBILE.height }, deviceScaleFactor: 2 });
  await run(mb, MOBILE_TARGETS, mobileOut, 'mobile');
  await mb.close();

  await browser.close();
  console.log(`\n✓ done → ${OUT_ROOT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
