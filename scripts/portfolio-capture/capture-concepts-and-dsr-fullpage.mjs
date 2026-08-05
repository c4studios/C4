#!/usr/bin/env node
/**
 * One-shot capture for the ServiceWeb rebuild:
 *   1. IOPA concept cover      — 1600×1000 under prefers-reduced-motion
 *      (freezes the finished hero: no preloader, orb at seeded t=0).
 *   2. DSR full-page home      — desktop 1440 + mobile 430, fullPage:true,
 *      Chrome channel (h.264 hero video) + 7.5s settle past the ~5s hero load.
 *
 * Outputs land in public/captures/<slug>/desktop|mobile/ so the normal
 * derivation pipeline can pick them up.
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const CAPS = path.resolve('public', 'captures');

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

async function save(page, file, opts = {}) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, type: 'png', ...opts });
  const st = await fs.stat(file);
  console.log(`  ✓ ${path.relative(CAPS, file)} (${Math.round(st.size / 1024)}KB)`);
}

const browser = await launch();

/* 1 · IOPA — reduced-motion freeze (the key: preloader skips, orb frozen). */
{
  console.log('IOPA cover…');
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto('https://iopa-apparel.vercel.app', { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.warn('  nav:', e.message));
  await page.waitForTimeout(2500);
  await save(page, path.join(CAPS, 'iopa-apparel-vercel-app', 'desktop', '01-hero.png'));
  await ctx.close();
}

/* 2 · DSR full-page home — desktop + mobile, past the hero video load. */
{
  console.log('DSR full-page (desktop)…');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('https://www.dsracingkarts.com.au/', { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.warn('  nav:', e.message));
  await page.waitForTimeout(7500);
  /* Dismiss the cookie banner for a clean sheet. */
  for (const label of ['Decline', 'Accept']) {
    const btn = page.getByRole('button', { name: new RegExp(`^\\s*${label}\\s*$`, 'i') });
    if (await btn.count()) { await btn.first().click({ timeout: 1200 }).catch(() => {}); break; }
  }
  /* Pre-scroll the whole page so lazy sections mount, then return. */
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2500);
  await save(page, path.join(CAPS, 'dsracingkarts-com-au', 'desktop', '00-fullpage.png'), { fullPage: true });
  await ctx.close();
}
{
  console.log('DSR full-page (mobile)…');
  const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto('https://www.dsracingkarts.com.au/', { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.warn('  nav:', e.message));
  await page.waitForTimeout(7500);
  for (const label of ['Decline', 'Accept']) {
    const btn = page.getByRole('button', { name: new RegExp(`^\\s*${label}\\s*$`, 'i') });
    if (await btn.count()) { await btn.first().click({ timeout: 1200 }).catch(() => {}); break; }
  }
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2500);
  await save(page, path.join(CAPS, 'dsracingkarts-com-au', 'mobile', '00-fullpage.png'), { fullPage: true });
  await ctx.close();
}

await browser.close();
console.log('done');
