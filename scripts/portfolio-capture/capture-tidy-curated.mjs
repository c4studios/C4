#!/usr/bin/env node
/**
 * Curated portfolio capture for Tidy Gardens Australia.
 *
 * Refreshes the exact shot set the portfolio entry references
 * (public/captures/tidygardens-com-au/{desktop,mobile}/*.png) after the site's
 * redesign. Route + anchor based, so it survives minor layout shifts.
 *
 * Uses the real Chrome channel for parity with the live site (and codec safety),
 * dismisses any cookie/consent overlay, and settles for lazy media before each
 * shot. Run from the repo root:  node scripts/portfolio-capture/capture-tidy-curated.mjs
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const SITE = 'https://tidygardens.com.au';
const OUT = path.resolve('public', 'captures', 'tidygardens-com-au');

const DESKTOP = [
  { id: '01-hero', route: '/' },
  { id: '02-home-vine', route: '/', anchor: 'Four services, one trusted team' },
  { id: '03-home-services', route: '/', anchor: 'Trusted across Perth' },
  { id: '04-reticulation', route: '/reticulation' },
  { id: '05-reticulation-pipe', route: '/reticulation', scrollTo: 1100 },
  { id: '06-lawn-care', route: '/lawn-care' },
  { id: '07-garden-maintenance', route: '/garden-maintenance' },
  { id: '08-gallery', route: '/gallery' },
  { id: '09-why-choose-us', route: '/why-choose-us' },
  { id: '10-contact', route: '/contact' },
];

const MOBILE = [
  { id: '01-hero', route: '/' },
  { id: '02-reticulation', route: '/reticulation' },
  { id: '03-lawn-care', route: '/lawn-care' },
  { id: '04-gallery', route: '/gallery' },
  { id: '05-contact', route: '/contact' },
];

async function launch() {
  try {
    return await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'],
    });
  } catch (e) {
    console.error('chrome channel failed → bundled chromium:', e.message);
    return chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
  }
}

async function dismissConsent(page) {
  for (const label of ['Decline', 'Accept all', 'Accept', 'Got it', 'OK', 'I agree', 'Allow']) {
    try {
      const btn = page.getByRole('button', { name: new RegExp(`^\\s*${label}\\s*$`, 'i') });
      if (await btn.count()) { await btn.first().click({ timeout: 1200 }).catch(() => {}); break; }
    } catch { /* ignore */ }
  }
}

async function shoot(page, item, kind) {
  await page.goto(SITE + item.route, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.warn(`  nav ${item.id}: ${e.message}`));
  await page.waitForTimeout(1400);
  await dismissConsent(page);
  await page.waitForTimeout(400);

  if (item.anchor) {
    await page.evaluate((text) => {
      const el = [...document.querySelectorAll('h1,h2,h3')].find((e) => e.textContent.includes(text));
      if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' });
    }, item.anchor);
    await page.waitForTimeout(1000);
  } else if (item.scrollTo) {
    await page.evaluate((y) => window.scrollTo(0, y), item.scrollTo);
    await page.waitForTimeout(1000);
  } else {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(1000); // let lazy media paint

  const file = path.join(OUT, kind, `${item.id}.png`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, type: 'png' });
  const st = await fs.stat(file);
  console.log(`  ✓ ${kind}/${item.id} (${Math.round(st.size / 1024)}KB)`);
}

const browser = await launch();

console.log('=== DESKTOP (1440×900) ===');
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const item of DESKTOP) await shoot(page, item, 'desktop');
  await ctx.close();
}

console.log('=== MOBILE (430×932) ===');
{
  const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  for (const item of MOBILE) await shoot(page, item, 'mobile');
  await ctx.close();
}

await browser.close();
console.log('done');
