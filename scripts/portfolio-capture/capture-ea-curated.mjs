#!/usr/bin/env node
/**
 * Curated portfolio capture for Evidence Advisory (https://evidenceadvisory.com.au).
 *
 * The home page is an interactive WebGL "evidence reconstruction" hero that
 * crashes under headless Chromium (no real GPU), so it is captured in a HEADED
 * browser. The content pages (service lines, insights) render fine headless.
 *
 * Viewport shots are 1440x900 (desktop) / 430x932 (mobile) to match the
 * portfolio gallery's 16:10 tiles.
 *
 * Usage:  node scripts/portfolio-capture/capture-ea-curated.mjs
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const SITE = 'https://evidenceadvisory.com.au';
const SLUG = 'evidenceadvisory-com-au';
const OUT_ROOT = path.resolve('public', 'captures', SLUG);

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 430, height: 932, isMobile: true, hasTouch: true };

async function settle(page, ms = 2600) {
  try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch { /* noop */ }
  await page.waitForTimeout(ms);
}

// ── Content pages (render fine headless) ──
const DESKTOP_CONTENT = [
  { id: '03-digital-forensics', route: '/services/digital-forensics', caption: 'Service — the Digital Forensics landing page (one of four individually-indexable service lines)' },
  { id: '04-ediscovery', route: '/services/ediscovery', caption: 'Service — the eDiscovery landing page' },
  { id: '05-expert-witness', route: '/services/expert-witness', caption: 'Service — the Expert Witness landing page' },
  { id: '06-mobile-cloud', route: '/services/mobile-cloud', caption: 'Service — the Mobile & Cloud landing page' },
  { id: '07-insights', route: '/insights', caption: 'Insights — the articles index, showing the content and SEO depth' },
  { id: '08-insight-article', route: '/insights/anton-piller-orders-in-the-digital-age', caption: 'Insight — a full long-form article page' },
];

const MOBILE_CONTENT = [
  { id: '02-digital-forensics', route: '/services/digital-forensics', caption: 'Mobile — a service landing page' },
  { id: '03-insights', route: '/insights', caption: 'Mobile — the insights index' },
  { id: '04-insight-article', route: '/insights/anton-piller-orders-in-the-digital-age', caption: 'Mobile — a long-form article' },
];

// ── Home hero (needs a real GPU → headed) ──
const DESKTOP_HERO = [
  { id: '01-hero', scrollY: 0, settleMs: 6500, caption: 'Hero — the shattered, evidence-tagged smartphone suspended in zero gravity with yellow forensic markers' },
  { id: '02-hero-reconstruct', scrollY: 1100, settleMs: 2600, caption: 'Mid-reconstruction — the phone partly reassembles as the shards fly back into place on scroll' },
];
const MOBILE_HERO = [
  { id: '01-hero', scrollY: 0, settleMs: 6500, caption: 'Mobile — hero with the evidence-reconstruction scene' },
];

async function captureContent(ctx, targets, outDir, label) {
  const page = await ctx.newPage();
  for (const t of targets) {
    try {
      await page.goto(`${SITE}${t.route}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await settle(page, t.settleMs ?? 2600);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      const outFile = path.join(outDir, `${t.id}.png`);
      await page.screenshot({ path: outFile });
      console.log(`  [${label}] ✓ ${t.id}.png`);
    } catch (err) {
      console.warn(`  [${label}] ✗ ${t.id}: ${err.message}`);
    }
  }
  await page.close();
}

async function captureHero(ctx, targets, outDir, label) {
  const page = await ctx.newPage();
  await page.goto(`${SITE}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await settle(page, 3000);
  for (const t of targets) {
    try {
      await page.evaluate((y) => window.scrollTo(0, y), t.scrollY);
      await page.waitForTimeout(t.settleMs ?? 3000);
      // Guard against the WebGL error boundary
      const crashed = await page.evaluate(() => /This page couldn.t load/i.test(document.body.innerText));
      if (crashed) { console.warn(`  [${label}] ✗ ${t.id}: WebGL error boundary`); continue; }
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

  const HERO_ONLY = process.env.HERO_ONLY === '1';

  // 1) Content pages — headless
  if (!HERO_ONLY) {
    console.log('\n── Content pass (headless) ──');
    const headless = await chromium.launch({ headless: true });
    const dtc = await headless.newContext({ viewport: DESKTOP, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    await captureContent(dtc, DESKTOP_CONTENT, desktopOut, 'desktop');
    await dtc.close();
    const mbc = await headless.newContext({ ...MOBILE, viewport: { width: MOBILE.width, height: MOBILE.height }, deviceScaleFactor: 2 });
    await captureContent(mbc, MOBILE_CONTENT, mobileOut, 'mobile');
    await mbc.close();
    await headless.close();
  }

  // 2) Home hero — real installed Chrome (full GPU for WebGL), fall back to bundled Chromium
  console.log('\n── Hero pass (headed / GPU) ──');
  let headed;
  try {
    try {
      headed = await chromium.launch({ headless: false, channel: 'chrome', args: ['--hide-scrollbars'] });
      console.log('  [hero] using installed Chrome');
    } catch {
      headed = await chromium.launch({ headless: false, args: ['--ignore-gpu-blocklist', '--enable-gpu', '--hide-scrollbars'] });
      console.log('  [hero] using bundled Chromium');
    }
    const dth = await headed.newContext({ viewport: DESKTOP, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    await captureHero(dth, DESKTOP_HERO, desktopOut, 'desktop-hero');
    await dth.close();
    const mbh = await headed.newContext({ ...MOBILE, viewport: { width: MOBILE.width, height: MOBILE.height }, deviceScaleFactor: 2 });
    await captureHero(mbh, MOBILE_HERO, mobileOut, 'mobile-hero');
    await mbh.close();
  } catch (err) {
    console.warn(`  [hero] headed browser unavailable: ${err.message}`);
  } finally {
    if (headed) await headed.close();
  }

  console.log(`\n✓ done → ${OUT_ROOT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
