#!/usr/bin/env node
/**
 * Route recon — loads each site's homepage in a real browser and reports
 * every internal link (href) the SPA exposes, plus page height. Used to
 * build accurate, route-based capture targets (no brittle scroll crops).
 */
import { chromium } from 'playwright';

const SITES = process.argv.slice(2);
if (SITES.length === 0) {
  console.error('Usage: node recon-routes.mjs <url> [url...]');
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });

for (const site of SITES) {
  const origin = new URL(site).origin;
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  console.log(`\n=== ${site} ===`);
  try {
    await page.goto(site, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(2500);

    const links = await page.evaluate((origin) => {
      const set = new Set();
      document.querySelectorAll('a[href]').forEach((a) => {
        try {
          const u = new URL(a.getAttribute('href'), location.href);
          if (u.origin === origin) set.add(u.pathname + (u.hash || ''));
        } catch (_) {}
      });
      return [...set].sort();
    }, origin);

    const meta = await page.evaluate(() => ({
      height: document.body.scrollHeight,
      title: document.title,
    }));

    console.log(`title: ${meta.title}`);
    console.log(`bodyHeight: ${meta.height}`);
    console.log('internal links:');
    links.forEach((l) => console.log('  ' + l));
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
  }
  await context.close();
}

await browser.close();
