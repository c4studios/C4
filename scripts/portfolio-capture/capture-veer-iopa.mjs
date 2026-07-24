#!/usr/bin/env node
/**
 * Gallery captures for the VEER + IOPA concept case studies.
 *   VEER  — real routes (/, /product, /tech); hero settles ~2.5s, capture-safe.
 *   IOPA  — single scroll-tuned page; captured under prefers-reduced-motion
 *           (the build's deterministic path: preloader skips, orb frozen at
 *           its seeded frame) at a few scroll depths.
 * Chrome channel throughout (h.264 / WebGL parity), desktop + a mobile hero.
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const CAPS = path.resolve('public', 'captures');

async function launch() {
  try {
    return await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
  } catch (e) {
    console.error('chrome channel failed → bundled chromium:', e.message);
    return chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
  }
}

async function shot(page, file, { scrollTo = 0, settle = 2500 } = {}) {
  if (scrollTo) { await page.evaluate((y) => window.scrollTo(0, y), scrollTo); }
  await page.waitForTimeout(settle);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, type: 'png' });
  const st = await fs.stat(file);
  console.log(`  ✓ ${path.relative(CAPS, file)} (${Math.round(st.size / 1024)}KB)`);
}

const browser = await launch();

/* ── VEER ──────────────────────────────────────────────────────────── */
{
  const dir = path.join(CAPS, 'veer-demo-netlify-app', 'desktop');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  console.log('VEER…');
  for (const [route, name] of [['/', '01-hero'], ['/product', '02-product'], ['/tech', '03-tech']]) {
    await page.goto('https://veer-demo.netlify.app' + route, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.warn('  nav', route, e.message));
    await shot(page, path.join(dir, `${name}.png`), { settle: 3000 });
  }
  await ctx.close();
  // mobile hero
  const mctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mpage = await mctx.newPage();
  await mpage.goto('https://veer-demo.netlify.app/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await shot(mpage, path.join(CAPS, 'veer-demo-netlify-app', 'mobile', '01-hero.png'), { settle: 3000 });
  await mctx.close();
}

/* ── IOPA ──────────────────────────────────────────────────────────── */
{
  const dir = path.join(CAPS, 'iopa-apparel-vercel-app', 'desktop');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  console.log('IOPA…');
  await page.goto('https://iopa-apparel.vercel.app', { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.warn('  nav', e.message));
  await shot(page, path.join(dir, '01-hero.png'), { settle: 3000 });
  const vh = await page.evaluate(() => window.innerHeight);
  await shot(page, path.join(dir, '02-decode.png'), { scrollTo: Math.round(vh * 1.6), settle: 1600 });
  await shot(page, path.join(dir, '03-corridor.png'), { scrollTo: Math.round(vh * 3.2), settle: 1600 });
  await shot(page, path.join(dir, '04-shop.png'), { scrollTo: Math.round(vh * 5.0), settle: 1600 });
  await ctx.close();
  const mctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const mpage = await mctx.newPage();
  await mpage.goto('https://iopa-apparel.vercel.app', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await shot(mpage, path.join(CAPS, 'iopa-apparel-vercel-app', 'mobile', '01-hero.png'), { settle: 3000 });
  await mctx.close();
}

await browser.close();
console.log('done');
