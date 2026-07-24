#!/usr/bin/env node
/**
 * DSR mobile home — STITCHED scroll-through capture.
 *
 * Playwright's fullPage screenshot breaks on this page two ways:
 *   · the fixed header re-paints mid-capture (page appears to repeat), and
 *   · the scroll-video / history section rasterises black.
 *
 * So instead: walk the real page one viewport at a time, give each step time
 * to paint (nudging any <video> to a real frame), screenshot the viewport,
 * and stitch the frames into one tall image with sharp. The fixed header and
 * cookie banner are hidden after the first frame so the page reads as one
 * continuous scroll — exactly what a visitor sees.
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(path.resolve('package.json'));
const sharp = require('sharp');

const OUT = path.resolve('public', 'captures', 'dsracingkarts-com-au', 'mobile', '00-fullpage.png');
const TMP = path.resolve('public', 'captures', 'dsracingkarts-com-au', 'mobile', '.stitch-tmp');
const VP = { width: 430, height: 932 };

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

const browser = await launch();
const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();

console.log('loading…');
await page.goto('https://www.dsracingkarts.com.au/', { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.warn('nav:', e.message));
await page.waitForTimeout(7500); // outlast the hero video load

/* Kill the cookie banner. */
for (const label of ['Decline', 'Accept']) {
  const btn = page.getByRole('button', { name: new RegExp(`^\\s*${label}\\s*$`, 'i') });
  if (await btn.count()) { await btn.first().click({ timeout: 1200 }).catch(() => {}); break; }
}

/* Pre-scroll the whole page once so every lazy section mounts and videos start. */
await page.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 130)); }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(2000);

/* Disable smooth scrolling + animations settling weirdness for clean frames. */
await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });

const totalH = await page.evaluate(() => Math.ceil(document.body.scrollHeight));
const steps = Math.ceil(totalH / VP.height);
console.log(`page ${totalH}px → ${steps} frames of ${VP.height}px`);

await fs.rm(TMP, { recursive: true, force: true });
await fs.mkdir(TMP, { recursive: true });

const frames = [];
for (let i = 0; i < steps; i++) {
  const y = Math.min(i * VP.height, totalH - VP.height);
  await page.evaluate((top) => window.scrollTo(0, top), y);
  /* After the first frame, hide fixed/sticky chrome so it never repeats. */
  if (i === 1) {
    await page.evaluate(() => {
      document.querySelectorAll('*').forEach((el) => {
        const cs = getComputedStyle(el);
        if ((cs.position === 'fixed' || cs.position === 'sticky') && el.offsetHeight < window.innerHeight * 0.4) {
          el.style.setProperty('visibility', 'hidden', 'important');
        }
      });
    });
  }
  /* Give lazy media a real chance: nudge videos to a painted frame. */
  await page.evaluate(async () => {
    const vids = [...document.querySelectorAll('video')];
    await Promise.all(vids.map(async (v) => {
      try {
        v.muted = true;
        if (v.paused) await v.play().catch(() => {});
        if (v.readyState < 2) await new Promise((r) => { const t = setTimeout(r, 1800); v.addEventListener('loadeddata', () => { clearTimeout(t); r(); }, { once: true }); });
        if (v.currentTime === 0 && v.duration > 1) v.currentTime = Math.min(1.5, v.duration / 3);
      } catch { /* keep going */ }
    }));
  });
  await page.waitForTimeout(900);
  const file = path.join(TMP, `f${String(i).padStart(2, '0')}.png`);
  await page.screenshot({ path: file, type: 'png' });
  frames.push(file);
  process.stdout.write(`  frame ${i + 1}/${steps}\r`);
}
console.log('\nstitching…');

/* The last frame overlaps (page clamps at the bottom) — compute its offset. */
const frameH = VP.height * 2; /* deviceScaleFactor 2 */
const fullH = totalH * 2;
const composites = frames.map((file, i) => {
  const top = i < steps - 1 ? i * frameH : fullH - frameH;
  return { input: file, top, left: 0 };
});
await sharp({ create: { width: VP.width * 2, height: fullH, channels: 3, background: '#0b0b0c' } })
  .composite(composites)
  .png()
  .toFile(OUT);
const st = await fs.stat(OUT);
console.log(`✓ stitched ${VP.width * 2}×${fullH} (${Math.round(st.size / 1024)}KB) → ${OUT}`);
await fs.rm(TMP, { recursive: true, force: true });
await browser.close();

/* Re-derive the page asset. */
const dest = path.resolve('src', 'components', 'web-arm', 'assets', 'dsr-home-m.webp');
const info = await sharp(OUT).resize({ width: 480 }).webp({ quality: 66 }).toFile(dest);
console.log(`✓ dsr-home-m.webp ${info.width}×${info.height} (${Math.round(info.size / 1024)}KB)`);
