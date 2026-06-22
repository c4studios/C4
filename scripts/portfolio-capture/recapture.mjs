#!/usr/bin/env node
/**
 * Robust route-based recapture.
 *
 * Unlike the older coordinate-crop scripts, this captures clean FULL-VIEWPORT
 * frames after navigating to a real route and (optionally) scrolling a named
 * section to the top via text anchor. Route-per-shot guarantees distinct pages;
 * full-viewport guarantees no empty/clamped crops.
 *
 * Usage: node recapture.mjs <slug>
 * Configs live in ./recapture.config.mjs
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { CONFIGS } from './recapture.config.mjs';

const slug = process.argv[2];
if (!slug || !CONFIGS[slug]) {
  console.error(`Usage: node recapture.mjs <slug>\nKnown slugs: ${Object.keys(CONFIGS).join(', ')}`);
  process.exit(1);
}

const cfg = CONFIGS[slug];
const OUT_ROOT = path.resolve('public', 'captures', cfg.outSlug || slug);

async function ensureDir(dir) { await fs.mkdir(dir, { recursive: true }); }

async function validatePng(filePath) {
  const buf = await fs.readFile(filePath);
  if (buf.length < 24 || buf[0] !== 0x89 || buf[1] !== 0x50) throw new Error(`Invalid PNG: ${filePath}`);
  return { size: buf.length, width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function preConsent(context) {
  return context.addInitScript(() => {
    const keys = ['cookie-consent','cookieConsent','cookie_consent','cookies-accepted','ga-consent','analytics-consent','dsr-cookie-consent'];
    keys.forEach(k => { try { localStorage.setItem(k, 'accepted'); localStorage.setItem(k, 'true'); } catch (_) {} });
  });
}

async function dismissOverlays(page) {
  // Click common accept buttons so React updates its own state
  for (const label of ['ACCEPT', 'Accept', 'Accept all', 'Got it', 'I Agree', 'Agree']) {
    try {
      const btn = page.locator('button', { hasText: label }).first();
      if (await btn.isVisible({ timeout: 300 }).catch(() => false)) {
        await btn.click({ timeout: 1000 }).catch(() => {});
        await page.waitForTimeout(400);
        break;
      }
    } catch (_) {}
  }
  // Force-hide any lingering fixed cookie/consent bars
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach((el) => {
      try {
        const s = getComputedStyle(el);
        if (s.position === 'fixed' || s.position === 'sticky') {
          const t = (el.textContent || '').toLowerCase();
          if (t.includes('cookie') || t.includes('privacy policy') || t.includes('we use cookies')) {
            el.style.setProperty('display', 'none', 'important');
          }
        }
      } catch (_) {}
    });
  });
}

async function freezeMotion(page) {
  await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important;scroll-behavior:auto!important}` }).catch(() => {});
}

async function preScroll(page) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  const vh = await page.evaluate(() => innerHeight);
  for (let y = 0; y <= h; y += Math.floor(vh * 0.7)) {
    await page.evaluate((sy) => scrollTo(0, sy), y);
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);
}

async function anchorScroll(page, text) {
  return page.evaluate((needle) => {
    const lc = needle.toLowerCase();
    const els = [...document.querySelectorAll('h1,h2,h3,h4,section,[class*="section"],p,span,div')];
    const hit = els.find((e) => (e.textContent || '').trim().toLowerCase().includes(lc) && e.getBoundingClientRect().height < 1200);
    if (hit) {
      const y = window.scrollY + hit.getBoundingClientRect().top - 80;
      window.scrollTo(0, Math.max(0, y));
      return true;
    }
    return false;
  }, text);
}

async function runDevice(browser, kind, vp) {
  console.log(`\n=== ${kind.toUpperCase()} (${vp.width}x${vp.height}) ===`);
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: kind === 'mobile' ? 2 : 1,
    isMobile: kind === 'mobile',
    hasTouch: kind === 'mobile',
  });
  await preConsent(context);
  const page = await context.newPage();
  const deviceDir = path.join(OUT_ROOT, kind);
  await ensureDir(deviceDir);

  const captures = [];
  let lastUrl = null;
  const targets = cfg.targets.filter((t) => !(kind === 'mobile' ? t.desktopOnly : t.mobileOnly));

  for (const t of targets) {
    const url = `${cfg.site}${t.route}`;
    try {
      if (url !== lastUrl) {
        console.log(`  -> ${t.route}`);
        try { await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); }
        catch { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); }
        await page.waitForTimeout(t.settle ?? 2500);
        await dismissOverlays(page);
        await freezeMotion(page);
        await preScroll(page);
        await dismissOverlays(page);
        lastUrl = url;
      }

      // Position
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(300);
      if (t.anchor) {
        const ok = await anchorScroll(page, t.anchor);
        if (!ok && t.scrollTo != null) await page.evaluate((y) => scrollTo(0, y), t.scrollTo);
      } else if (t.scrollTo != null) {
        await page.evaluate((y) => scrollTo(0, y), t.scrollTo);
      }
      await page.waitForTimeout(900);

      if (t.action) await t.action(page).catch((e) => console.warn(`    action: ${e.message}`));
      await dismissOverlays(page);

      const filePath = path.join(deviceDir, `${t.id}.png`);
      await page.screenshot({ path: filePath, type: 'png' });
      const v = await validatePng(filePath);
      captures.push({ id: t.id, caption: t.caption, route: t.route, bytes: v.size, dimensions: { width: v.width, height: v.height }, filePath: `${kind}/${t.id}.png` });
      console.log(`     ok ${t.id} ${v.width}x${v.height} ${Math.round(v.size / 1024)}KB`);
    } catch (err) {
      console.error(`     FAIL ${t.id}: ${err.message}`);
    }
  }

  await context.close();
  return { viewport: vp, captureCount: captures.length, captures };
}

async function main() {
  console.log(`Recapture: ${slug} (${cfg.site})`);
  const browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const manifest = { version: 3, sourceUrl: cfg.site, slug: cfg.outSlug || slug, curated: true, devices: {} };

  manifest.devices.desktop = await runDevice(browser, 'desktop', { width: 1440, height: 900 });
  manifest.devices.mobile = await runDevice(browser, 'mobile', { width: 430, height: 932 });

  await fs.writeFile(path.join(OUT_ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  await browser.close();
  console.log(`\nDone. Desktop ${manifest.devices.desktop.captureCount}, Mobile ${manifest.devices.mobile.captureCount}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
