#!/usr/bin/env node
/**
 * Generate favicon PNGs from the C4 Studios SVG logo.
 * Produces 32x32 and 192x192 versions for favicon and PWA icon.
 */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const SVG_PATH = path.resolve('..', 'source-logo-svg', 'Caleb Logo SVG', 'Logo studio as 4 - colour.svg');
const OUT_DIR = path.resolve('public');

async function main() {
  const svgContent = await fs.readFile(SVG_PATH, 'utf-8');

  const browser = await chromium.launch({ headless: true });

  const sizes = [
    { name: 'favicon-32.png', size: 32 },
    { name: 'favicon-192.png', size: 192 },
    { name: 'logo.png', size: 512 },
  ];

  for (const { name, size } of sizes) {
    const context = await browser.newContext({
      viewport: { width: size, height: size },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Render SVG centered on white background
    const html = `<!DOCTYPE html>
<html><head><style>
  body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center;
         width: ${size}px; height: ${size}px; background: white; overflow: hidden; }
  svg { width: ${Math.round(size * 0.82)}px; height: ${Math.round(size * 0.82)}px; }
</style></head><body>${svgContent}</body></html>`;

    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(OUT_DIR, name),
      type: 'png',
      clip: { x: 0, y: 0, width: size, height: size },
    });

    console.log(`  ✓ ${name} (${size}×${size})`);
    await context.close();
  }

  await browser.close();
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
