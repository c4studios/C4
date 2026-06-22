#!/usr/bin/env node
/**
 * Curated portfolio capture for Sharp Bricklaying.
 *
 * Captures 17 desktop + 8 mobile screenshots from https://www.sharpbricklaying.com.au/
 *
 * NOTE: The site has an animated brick canvas loader on first visit.
 * We wait for it to complete before capturing. If sessionStorage flag is set,
 * the loader is skipped automatically.
 *
 * Screenshots that may need manual attention:
 *   - 14-lightbox-open: Requires clicking a gallery image to open the lightbox
 *   - 15-loader: Best captured on a fresh session before sessionStorage is set
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const SITE = 'https://www.sharpbricklaying.com.au';
const SLUG = 'sharpbricklaying-com-au';
const OUT_ROOT = path.resolve('public', 'captures', SLUG);

const DESKTOP = { width: 1440, height: 900 };
const MOBILE  = { width: 430,  height: 932,  isMobile: true, hasTouch: true };

// ── Helper: wait for loader to finish ───────────────────────────────
async function waitForLoader(page, timeout = 8000) {
  try {
    // The loader sets a sessionStorage key when done; also watch for body class removal
    await page.waitForFunction(
      () => document.readyState === 'complete',
      { timeout }
    );
    // Extra settle after loader animation completes (~3s)
    await page.waitForTimeout(4000);
  } catch {
    await page.waitForTimeout(2000);
  }
}

// ── Target definitions ──────────────────────────────────────────────
const TARGETS = [
  // ── HOMEPAGE SECTIONS ──
  {
    id: '01-hero',
    label: 'hero',
    page: '/',
    caption: 'Hero section — full-viewport aerial drone carousel, "Built to a Higher Standard" headline, dual CTAs',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 900 },
      mobile:  { x: 0, y: 0, w: 430,  h: 932 },
    },
    waitForLoader: true,
  },
  {
    id: '02-services',
    label: 'services',
    page: '/',
    caption: 'Services section — Residential New Builds + Renovations & Extensions cards with enquiry CTAs',
    scrollTo: 'services',
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 900 },
      mobile:  { x: 0, y: null, w: 430,  h: 932 },
    },
  },
  {
    id: '03-about',
    label: 'about',
    page: '/',
    caption: "About / Luke's Story — on-site portrait, 15+ years badge, founding story, pullquote",
    scrollTo: 'about',
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 900 },
      mobile:  { x: 0, y: null, w: 430,  h: 932 },
    },
  },
  {
    id: '04-gallery-custom-window',
    label: 'gallery-custom-window',
    page: '/',
    caption: 'Gallery — Custom Window Design progression (Stage 1 → 2 → 3, Cottesloe circular window)',
    scrollTo: '.gallery-section, #gallery, [id*="gallery"]',
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '05-gallery-stairs',
    label: 'gallery-stairs',
    page: '/',
    caption: 'Gallery — Stairs & Steps (Nedlands retaining mass brick stairs, 3-col grid)',
    scrollFactor: 0.55,
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '06-gallery-feature-wall',
    label: 'gallery-feature-wall',
    page: '/',
    caption: 'Gallery — Feature Brickwork (Subiaco hit-and-miss boundary wall, 2-col)',
    scrollFactor: 0.62,
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '07-gallery-jobs-rhonda',
    label: 'gallery-jobs-rhonda',
    page: '/',
    caption: 'Job Galleries — Rhonda Ave Willeton tab active (12 photos + 2 drone videos)',
    scrollTo: '[role="tablist"], .job-gallery, [class*="job"]',
    clickTab: 0,
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 900 },
      mobile:  { x: 0, y: null, w: 430,  h: 932 },
    },
  },
  {
    id: '08-gallery-jobs-huon',
    label: 'gallery-jobs-huon',
    page: '/',
    caption: 'Job Galleries — Huon St Willeton tab (4 photos + 2 POV videos)',
    scrollTo: '[role="tablist"], .job-gallery, [class*="job"]',
    clickTab: 1,
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '09-gallery-jobs-avonmore',
    label: 'gallery-jobs-avonmore',
    page: '/',
    caption: 'Job Galleries — Avonmore Terrace Cottesloe tab (2 photos + 2 videos, 3-storey triple build)',
    scrollTo: '[role="tablist"], .job-gallery, [class*="job"]',
    clickTab: 4,
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '10-before-after-branksome',
    label: 'before-after-branksome',
    page: '/',
    caption: 'Before & After — Branksome Gardens City Beach (brick to render transformation)',
    scrollTo: '[class*="before"], [class*="after"], [id*="transform"]',
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 900 },
      mobile:  { x: 0, y: null, w: 430,  h: 932 },
    },
  },
  {
    id: '11-before-after-broome',
    label: 'before-after-broome',
    page: '/',
    caption: 'Before & After — Broome St Cottesloe (curved brickwork, 3+3 stacked pairs)',
    scrollFactor: 0.83,
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '12-contact-form',
    label: 'contact-form',
    page: '/',
    caption: 'Contact section — enquiry form, project type selector, social links, dark green background',
    scrollTo: '#contact, [id*="contact"], form',
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 900 },
      mobile:  { x: 0, y: null, w: 430,  h: 932 },
    },
  },
  {
    id: '13-footer',
    label: 'footer',
    page: '/',
    caption: 'Footer — logo, tagline, navigate col, connect col, legal strip, C4 Studios credit',
    scrollTo: 'footer',
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 400 },
      mobile:  { x: 0, y: null, w: 430,  h: 600 },
    },
  },
  {
    id: '14-lightbox-open',
    label: 'lightbox-open',
    page: '/',
    caption: 'Gallery lightbox — full-screen image expand (accessible modal, keyboard close)',
    scrollTo: '.gallery-grid img, [class*="gallery"] img',
    clickFirst: '.gallery-grid img, [class*="gallery"] img',
    waitAfterClick: 800,
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '15-loader',
    label: 'loader',
    page: '/',
    caption: 'Animated brick canvas loader — brick-by-brick Canvas build animation with percentage counter',
    captureImmediately: true, // Capture before loader finishes
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '16-nav-scrolled',
    label: 'nav-scrolled',
    page: '/',
    caption: 'Navigation — scrolled state (white background, green border, dark text links)',
    scrollTo: 600,
    waitAfterScroll: 600,
    cropTop: true,
    crop: {
      desktop: { x: 0, y: null, w: 1440, h: 90 },
    },
    desktopOnly: true,
  },
  {
    id: '17-privacy',
    label: 'privacy',
    page: '/privacy.html',
    caption: 'Privacy Policy page — full content, green header, clean typeset body',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },

  // ── MOBILE-SPECIFIC ──
  {
    id: '02-mobile-menu',
    label: 'mobile-menu',
    page: '/',
    caption: 'Mobile menu — full-screen forest green overlay',
    clickFirst: '.hamburger, [class*="menu-toggle"], [aria-label*="menu"], button[class*="nav"]',
    waitAfterClick: 600,
    crop: {
      mobile: { x: 0, y: 0, w: 430, h: 932 },
    },
    mobileOnly: true,
  },
  {
    id: '05-gallery-tabs',
    label: 'gallery-tabs',
    page: '/',
    caption: 'Mobile job gallery tabs — horizontal scroll tab list',
    scrollTo: '[role="tablist"]',
    crop: {
      mobile: { x: 0, y: null, w: 430, h: 600 },
    },
    mobileOnly: true,
  },
  {
    id: '06-before-after',
    label: 'before-after',
    page: '/',
    caption: 'Mobile Before & After — vertically stacked pairs',
    scrollTo: '[class*="before"], [class*="after"]',
    crop: {
      mobile: { x: 0, y: null, w: 430, h: 932 },
    },
    mobileOnly: true,
  },
  {
    id: '07-contact',
    label: 'contact',
    page: '/',
    caption: 'Mobile contact form',
    scrollTo: '#contact, form',
    crop: {
      mobile: { x: 0, y: null, w: 430, h: 932 },
    },
    mobileOnly: true,
  },
  {
    id: '08-footer',
    label: 'footer',
    page: '/',
    caption: 'Mobile footer',
    scrollTo: 'footer',
    crop: {
      mobile: { x: 0, y: null, w: 430, h: 600 },
    },
    mobileOnly: true,
  },
];

// ── Core helpers ────────────────────────────────────────────────────
async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function scrollToSelector(page, selector) {
  if (!selector) return;
  if (typeof selector === 'number') {
    await page.evaluate((y) => window.scrollTo(0, y), selector);
    await page.waitForTimeout(700);
    return;
  }
  const selectors = selector.split(',').map(s => s.trim());
  for (const sel of selectors) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(700);
        return;
      }
    } catch { /* try next */ }
  }
}

async function captureTarget(page, target, device, outDir) {
  const isMobile = device === 'mobile';
  if (target.desktopOnly && isMobile) return null;
  if (target.mobileOnly && !isMobile) return null;
  if (!target.crop[device]) return null;

  console.log(`  [${device}] ${target.id} — ${target.label}`);

  try {
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);

    // Scroll
    if (target.scrollTo) {
      await scrollToSelector(page, target.scrollTo);
    } else if (target.scrollFactor) {
      // Pass as single object to avoid Playwright "too many arguments" error
      await page.evaluate(({ f, h }) => window.scrollTo(0, h * f), { f: target.scrollFactor, h: pageHeight });
      await page.waitForTimeout(700);
    }

    if (target.waitAfterScroll) {
      await page.waitForTimeout(target.waitAfterScroll);
    }

    // Click tab
    if (typeof target.clickTab === 'number') {
      const tabs = await page.$$('[role="tab"]');
      if (tabs[target.clickTab]) {
        await tabs[target.clickTab].click();
        await page.waitForTimeout(600);
      }
    }

    // Click first matching element
    if (target.clickFirst) {
      const selectors = target.clickFirst.split(',').map(s => s.trim());
      for (const sel of selectors) {
        try {
          const el = await page.$(sel);
          if (el) {
            await el.click();
            await page.waitForTimeout(target.waitAfterClick || 600);
            break;
          }
        } catch { /* try next */ }
      }
    }

    const outFile = path.join(outDir, `${target.id}.png`);

    // For the nav bar we want just the top strip — scroll to y=600 then clip viewport top
    if (target.cropTop) {
      const clip = { x: 0, y: 0, width: 1440, height: target.crop[device].h };
      await page.screenshot({ path: outFile, clip });
    } else {
      // Standard: take a full viewport screenshot at the current scroll position.
      // Playwright screenshots use viewport coords (0,0 = top-left of current view).
      await page.screenshot({ path: outFile });
    }

    console.log(`     ✓ ${path.basename(outFile)}`);
    return { id: target.id, caption: target.caption, file: outFile };
  } catch (err) {
    console.warn(`     ✗ ${target.id} (${device}): ${err.message}`);
    // Fallback: plain viewport shot
    try {
      const outFile = path.join(outDir, `${target.id}.png`);
      await page.screenshot({ path: outFile });
      console.log(`     ✓ ${path.basename(outFile)} (fallback)`);
      return { id: target.id, caption: target.caption, file: outFile };
    } catch { return null; }
  }
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  const desktopOut = path.join(OUT_ROOT, 'desktop');
  const mobileOut  = path.join(OUT_ROOT, 'mobile');
  await ensureDir(desktopOut);
  await ensureDir(mobileOut);

  const browser = await chromium.launch({ headless: true });
  const results = { desktop: [], mobile: [] };

  // ── Desktop pass ────────────────────────────────────────────────
  console.log('\n── Desktop pass ──────────────────────────────────');
  const dtCtx = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1 });
  const dtPage = await dtCtx.newPage();

  // 15-loader: capture before loader finishes (fresh page, immediate)
  {
    const loaderTarget = TARGETS.find(t => t.id === '15-loader');
    if (loaderTarget) {
      console.log('  [desktop] 15-loader — capturing during load...');
      await dtPage.goto(`${SITE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dtPage.waitForTimeout(800); // Catch mid-animation
      try {
        const outFile = path.join(desktopOut, '15-loader.png');
        await dtPage.screenshot({ path: outFile, clip: { x: 0, y: 0, width: 1440, height: 900 } });
        console.log('     ✓ 15-loader.png');
      } catch (e) {
        console.warn('     ✗ 15-loader:', e.message);
      }
    }
  }

  // Reload and wait for full load for remaining desktop shots
  await dtPage.goto(`${SITE}/`, { waitUntil: 'networkidle', timeout: 45000 });
  await waitForLoader(dtPage);

  for (const target of TARGETS) {
    if (target.id === '15-loader') continue; // Already captured
    if (target.mobileOnly) continue;
    const result = await captureTarget(dtPage, target, 'desktop', desktopOut);
    if (result) results.desktop.push(result);
    // Re-navigate after lightbox to reset state
    if (target.clickFirst && target.id === '14-lightbox-open') {
      await dtPage.keyboard.press('Escape');
      await dtPage.waitForTimeout(300);
    }
  }
  await dtCtx.close();

  // ── Mobile pass ─────────────────────────────────────────────────
  console.log('\n── Mobile pass ───────────────────────────────────');
  const mbCtx = await browser.newContext({ ...MOBILE, viewport: { width: MOBILE.width, height: MOBILE.height } });
  const mbPage = await mbCtx.newPage();
  await mbPage.goto(`${SITE}/`, { waitUntil: 'networkidle', timeout: 45000 });
  await waitForLoader(mbPage);

  for (const target of TARGETS) {
    if (target.desktopOnly) continue;
    const result = await captureTarget(mbPage, target, 'mobile', mobileOut);
    if (result) results.mobile.push(result);
    // Re-navigate after menu open to reset state
    if (target.id === '02-mobile-menu') {
      await mbPage.goto(`${SITE}/`, { waitUntil: 'networkidle', timeout: 30000 });
      await waitForLoader(mbPage, 4000);
    }
  }
  await mbCtx.close();

  await browser.close();

  // ── Summary ──────────────────────────────────────────────────────
  const total = results.desktop.length + results.mobile.length;
  console.log(`\n✓ ${total} screenshots captured`);
  console.log(`  Desktop: ${results.desktop.length} → ${desktopOut}`);
  console.log(`  Mobile:  ${results.mobile.length} → ${mobileOut}`);
  console.log('\nManual captures still needed:');
  console.log('  14-lightbox-open — if auto-click did not open lightbox, click a gallery image and screenshot manually');
  console.log('  15-loader — if captured too late (site already loaded), use incognito + DevTools throttling');
}

main().catch(err => { console.error(err); process.exit(1); });
