#!/usr/bin/env node
/**
 * Curated portfolio capture for RocksStream (The Rocks Church).
 *
 * Renders the self-contained demo (live-demo-reference.html) and drives its
 * global flow functions to capture the streaming-style screens:
 *   login → profiles → browse (billboard + rows) → detail modal → per-campus.
 *
 * Point DEMO at the extracted demo HTML. Videos are not embedded, so tiles
 * show poster art (which is embedded as base64) — perfect for stills.
 *
 * Usage:  DEMO="/abs/path/live-demo-reference.html" node scripts/portfolio-capture/capture-rocksstream.mjs
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const DEMO = process.env.DEMO;
const SLUG = 'rocksstream';
const OUT_ROOT = path.resolve('public', 'captures', SLUG);

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 430, height: 932, isMobile: true, hasTouch: true };

const wait = (page, ms) => page.waitForTimeout(ms);

async function shoot(page, dir, id) {
  await page.screenshot({ path: path.join(dir, `${id}.png`) });
  console.log(`  ✓ ${id}.png`);
}

// Stop the scripted intro from replaying and hijacking forced navigation.
const neutralizeIntro = (page) => page.evaluate(() => {
  window.showIntro = () => window.ss('profs');
});

async function captureDesktop(ctx, dir) {
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(DEMO).href, { waitUntil: 'load', timeout: 30000 });

  // 01 — scripted sign-in (capture mid-sequence)
  await wait(page, 3200);
  await shoot(page, dir, '01-login');
  await neutralizeIntro(page);

  // Let the scripted login finish, then force to profiles
  await wait(page, 9000);
  await page.evaluate(() => window.ss && window.ss('profs'));
  await wait(page, 800);
  await shoot(page, dir, '02-profiles');

  // 03 — browse (Cannington): billboard + rows
  await page.evaluate(() => { window.pick('Cannington'); if (window.setBB) window.setBB(0); });
  await wait(page, 1600);
  await shoot(page, dir, '03-browse-cannington');

  // 04 — detail modal
  await page.evaluate(() => { if (window.openM) window.openM(1); });
  await wait(page, 1000);
  await shoot(page, dir, '04-detail-modal');
  await page.evaluate(() => { if (window.closeM) window.closeM(); });
  await wait(page, 500);

  // 05 — category rows (scroll the browse content down)
  await page.evaluate(() => {
    const b = document.getElementById('browse');
    if (b) b.scrollTop = 560;
    const rows = document.getElementById('cr') || document.getElementById('rws');
    if (rows) rows.scrollTop = 560;
    window.scrollTo(0, 560);
  });
  await wait(page, 900);
  await shoot(page, dir, '05-browse-rows');

  // 06 — campus-aware: Baldivis line-up
  await page.evaluate(() => { window.pick('Baldivis'); if (window.setBB) window.setBB(0); if (document.getElementById('browse')) document.getElementById('browse').scrollTop = 0; });
  await wait(page, 1500);
  await shoot(page, dir, '06-browse-baldivis');

  await page.close();
}

async function captureMobile(ctx, dir) {
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(DEMO).href, { waitUntil: 'load', timeout: 30000 });

  await wait(page, 3200);
  await shoot(page, dir, '01-login');
  await neutralizeIntro(page);

  await wait(page, 9000);
  await page.evaluate(() => window.ss && window.ss('profs'));
  await wait(page, 800);
  await shoot(page, dir, '02-profiles');

  await page.evaluate(() => { window.pick('Cannington'); if (window.setBB) window.setBB(0); });
  await wait(page, 1600);
  await shoot(page, dir, '03-browse');

  await page.close();
}

async function main() {
  if (!DEMO) { console.error('Set DEMO=/abs/path/to/live-demo-reference.html'); process.exit(1); }
  const desktopOut = path.join(OUT_ROOT, 'desktop');
  const mobileOut = path.join(OUT_ROOT, 'mobile');
  await fs.mkdir(desktopOut, { recursive: true });
  await fs.mkdir(mobileOut, { recursive: true });

  let browser;
  try {
    browser = await chromium.launch({ headless: false, channel: 'chrome', args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  console.log('\n── Desktop pass ──');
  const dt = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  await captureDesktop(dt, desktopOut);
  await dt.close();

  console.log('\n── Mobile pass ──');
  const mb = await browser.newContext({ ...MOBILE, viewport: { width: MOBILE.width, height: MOBILE.height }, deviceScaleFactor: 2 });
  await captureMobile(mb, mobileOut);
  await mb.close();

  await browser.close();
  console.log(`\n✓ done → ${OUT_ROOT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
