#!/usr/bin/env node
/**
 * Curated portfolio capture for Transform Fremantle.
 *
 * Instead of generic auto-detection on a single homepage URL, this script
 * navigates to each page and captures specific, visually strong sections
 * chosen for portfolio storytelling quality.
 *
 * Target set (curated from site recon):
 *
 * DESKTOP:
 *  1. Home hero      — header + title + subtitle + harbour photo (above fold)
 *  2. Prayer schedule — five-day card grid with church details
 *  3. Vision & Aim   — four numbered aim pillars with icons
 *  4. Connect        — contact form + ways-to-connect side panel
 *  5. Resources      — PDF resource library with download cards
 *
 * MOBILE:
 *  1. Home hero      — header + title + subtitle (above fold)
 *  2. Prayer schedule — stacked day cards
 *  3. Vision & Aim   — aim pillars stacked vertically
 *  4. Connect form   — contact form
 *  5. Resources      — resource cards stacked
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const SITE = 'https://transformfreo.com';
const SLUG = 'transformfreo-com';
const OUT_ROOT = path.resolve('public', 'captures', SLUG);

// ── Target definitions ──────────────────────────────────────────────

const TARGETS = [
  {
    id: '01-hero',
    label: 'hero',
    page: '/',
    caption: 'Hero — harbour backdrop with mission statement and navigation',
    // Desktop: top of page through intro paragraph (~900px above fold)
    // Mobile: full first screen
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 900 },
      mobile: { x: 0, y: 0, w: 430, h: 932 },
    },
  },
  {
    id: '02-schedule',
    label: 'schedule',
    page: '/',
    caption: 'Prayer Meetings — five-day weekly schedule across Fremantle churches',
    // Desktop recon: section at y=874 h=1142 w=896 (all 5 day cards)
    // Mobile recon: section at y=913 h=1501 w=430
    crop: {
      desktop: { x: 248, y: 860, w: 944, h: 1120 },
      mobile: { x: 0, y: 900, w: 430, h: 1520 },
    },
  },
  {
    id: '03-vision',
    label: 'vision',
    page: '/VisionAndAim',
    caption: 'Vision & Aim — four numbered pillars of the movement',
    // Desktop recon: "Our Vision" y=579 + "Our Aims" y=866 h=1106
    // Mobile recon: "Our Vision" section y=437 h=384, "Our Aims" section y=821 h=1680
    // Mobile: capture vision heading through aim cards (cap at ~2050px)
    crop: {
      desktop: { x: 248, y: 550, w: 944, h: 1450 },
      mobile: { x: 0, y: 424, w: 430, h: 2050 },
    },
  },
  {
    id: '04-connect',
    label: 'connect',
    page: '/Connect',
    caption: 'Connect — contact form with validation and ways to reach us',
    // Desktop recon: form+sidebar at y=579 in 2-column layout
    // Mobile recon: "Get In Touch" section y=469 h=1342
    crop: {
      desktop: { x: 200, y: 460, w: 1040, h: 760 },
      mobile: { x: 0, y: 456, w: 430, h: 1360 },
    },
  },
  {
    id: '05-resources',
    label: 'resources',
    page: '/Resources',
    caption: 'Resources — downloadable PDF library with branded cards',
    // Desktop recon: "Available Resources" y=579, cards y=802 h=704
    // Mobile recon: section at y=469 h=1053
    crop: {
      desktop: { x: 248, y: 540, w: 944, h: 1010 },
      mobile: { x: 0, y: 456, w: 430, h: 1070 },
    },
  },
];

// ── Helpers ──────────────────────────────────────────────────────────

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function validatePng(filePath) {
  const buf = await fs.readFile(filePath);
  if (buf.length < 24 || buf[0] !== 0x89 || buf[1] !== 0x50) {
    throw new Error(`Invalid PNG: ${filePath}`);
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { size: buf.length, width, height };
}

// ── Capture logic ────────────────────────────────────────────────────

async function captureTarget(page, target, kind, viewport) {
  const deviceDir = path.join(OUT_ROOT, kind);
  await ensureDir(deviceDir);
  const filePath = path.join(deviceDir, `${target.id}.png`);

  // Navigate if needed
  const targetUrl = `${SITE}${target.page}`;
  const currentUrl = page.url();
  if (!currentUrl.startsWith(targetUrl)) {
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
  }

  // Suppress animations
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = '*, *::before, *::after { animation: none !important; transition: none !important; }';
    document.head.appendChild(style);
  });

  let clip;
  const predefined = target.crop[kind];

  if (predefined) {
    // Use predefined crop coordinates (from recon data)
    clip = {
      x: predefined.x,
      y: predefined.y,
      width: predefined.w,
      height: predefined.h,
    };
  } else {
    // Auto-detect via selector for mobile (different layout)
    const els = await page.$$(target.selector || 'section');
    const idx = target.selectorIndex || 0;
    const el = els[idx];
    if (!el) {
      console.warn(`  [${kind}] No element found for ${target.id} with selector "${target.selector}"`);
      return null;
    }

    const box = await el.boundingBox();
    if (!box) {
      console.warn(`  [${kind}] No bounding box for ${target.id}`);
      return null;
    }

    // Add small padding
    const padX = kind === 'mobile' ? 0 : 16;
    const padY = kind === 'mobile' ? 8 : 20;

    clip = {
      x: Math.max(0, Math.round(box.x - padX)),
      y: Math.max(0, Math.round(box.y - padY)),
      width: Math.round(box.width + padX * 2),
      height: Math.round(box.height + padY * 2),
    };

    // Clamp width to viewport
    if (clip.x + clip.width > viewport.width) {
      clip.width = viewport.width - clip.x;
    }

    // Height cap for mobile: 2x viewport
    const maxH = viewport.height * 2.2;
    if (clip.height > maxH) {
      clip.height = Math.round(maxH);
    }
  }

  // Scroll to region for lazy-load triggering
  await page.evaluate(y => window.scrollTo(0, Math.max(0, y - 100)), clip.y);
  await page.waitForTimeout(600);

  // Capture
  await page.screenshot({
    path: filePath,
    clip,
    fullPage: true,
    type: 'png',
    animations: 'disabled',
  });

  const validation = await validatePng(filePath);
  return {
    id: target.id,
    label: target.label,
    caption: target.caption,
    page: target.page,
    clip,
    bytes: validation.size,
    dimensions: { width: validation.width, height: validation.height },
    filePath: `${kind}/${target.id}.png`,
  };
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('Curated capture: Transform Fremantle\n');

  const browser = await chromium.launch({ headless: true });
  const manifest = {
    version: 2,
    sourceUrl: SITE,
    slug: SLUG,
    timestamp: new Date().toISOString(),
    curated: true,
    devices: {},
  };

  const devices = [
    { kind: 'desktop', width: 1440, height: 900 },
    { kind: 'mobile', width: 430, height: 932 },
  ];

  for (const device of devices) {
    console.log(`=== ${device.kind.toUpperCase()} (${device.width}×${device.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    const captures = [];
    let lastPage = null;

    for (const target of TARGETS) {
      const targetUrl = `${SITE}${target.page}`;

      // Navigate only when switching pages
      if (targetUrl !== lastPage) {
        console.log(`  Navigating to ${target.page}...`);
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1500);

        // Inject animation suppression once per page
        await page.evaluate(() => {
          const style = document.createElement('style');
          style.id = 'capture-freeze';
          style.textContent = `
            *, *::before, *::after {
              animation-duration: 0s !important;
              animation-delay: 0s !important;
              transition-duration: 0s !important;
              transition-delay: 0s !important;
              scroll-behavior: auto !important;
            }
          `;
          if (!document.getElementById('capture-freeze')) {
            document.head.appendChild(style);
          }
        });

        lastPage = targetUrl;
      }

      try {
        const result = await captureTarget(page, target, device.kind, {
          width: device.width,
          height: device.height,
        });

        if (result) {
          captures.push(result);
          const kb = Math.round(result.bytes / 1024);
          console.log(`  ✓ ${result.id} — ${result.dimensions.width}×${result.dimensions.height} (${kb}KB)`);
        }
      } catch (err) {
        console.error(`  ✗ ${target.id} — ${err.message}`);
      }
    }

    manifest.devices[device.kind] = {
      viewport: { width: device.width, height: device.height },
      captureCount: captures.length,
      captures,
    };

    await context.close();
    console.log(`  Total: ${captures.length} captures\n`);
  }

  // Write manifest
  const manifestPath = path.join(OUT_ROOT, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest: ${manifestPath}`);

  // Write contact sheet
  const sheetPath = path.join(OUT_ROOT, 'contact-sheet.html');
  const allCaptures = [
    ...(manifest.devices.desktop?.captures || []),
    ...(manifest.devices.mobile?.captures || []),
  ];
  const sheetHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Transform Fremantle — Curated Captures</title>
<style>body{font-family:system-ui;background:#111;color:#eee;padding:2rem}
h1{font-size:1.5rem;margin-bottom:1rem}
.grid{display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fill,minmax(320px,1fr))}
.card{background:#1a1a1a;border-radius:8px;overflow:hidden;border:1px solid #333}
.card img{width:100%;display:block;max-height:600px;object-fit:contain;background:#0a0a0a}
.card .info{padding:0.75rem 1rem;font-size:0.85rem}
.card .caption{color:#aaa;margin-top:0.25rem}
.card .dims{color:#666;font-size:0.75rem}
</style></head><body>
<h1>Transform Fremantle — Curated Portfolio Captures</h1>
<div class="grid">${allCaptures.map(c => `
<div class="card">
<img src="${c.filePath}" alt="${c.label}" loading="lazy">
<div class="info">
<strong>${c.id}</strong> (${c.label})
<div class="caption">${c.caption}</div>
<div class="dims">${c.dimensions.width}×${c.dimensions.height} · ${Math.round(c.bytes / 1024)}KB</div>
</div></div>`).join('')}
</div></body></html>`;
  await fs.writeFile(sheetPath, sheetHtml);
  console.log(`Contact sheet: ${sheetPath}`);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
