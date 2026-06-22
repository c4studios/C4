#!/usr/bin/env node
/**
 * DS Racing — capture a REAL cart + checkout by adding a product to the cart,
 * rather than the misleading empty-state the static route capture produced.
 */
import path from 'node:path';
import { chromium } from 'playwright';

const SITE = 'https://www.dsracingkarts.com.au';
const DIR = path.resolve('public', 'captures', 'dsracingkarts-com-au', 'desktop');

async function killCookie(page) {
  for (const label of ['ACCEPT', 'Accept']) {
    try {
      const b = page.locator('button', { hasText: label }).first();
      if (await b.isVisible({ timeout: 400 }).catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(400); break; }
    } catch (_) {}
  }
  await page.evaluate(() => document.querySelectorAll('*').forEach((el) => { try { const s = getComputedStyle(el); if ((s.position === 'fixed' || s.position === 'sticky') && (el.textContent || '').toLowerCase().includes('cookie')) el.style.setProperty('display', 'none', 'important'); } catch (_) {} }));
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => { try { localStorage.setItem('dsr-cookie-consent', 'true'); } catch (_) {} });
const page = await ctx.newPage();

console.log('Opening shop...');
await page.goto(`${SITE}/shop`, { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(2500);
await killCookie(page);

// Click first product
const product = page.locator('a[href*="/product/"]').first();
await product.waitFor({ timeout: 15000 });
const href = await product.getAttribute('href');
console.log('Product:', href);
await product.click();
await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(2500);
await killCookie(page);

// Add to cart
let added = false;
for (const label of ['Add to Cart', 'ADD TO CART', 'Add To Cart', 'Add to cart']) {
  const btn = page.locator('button', { hasText: label }).first();
  if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) { await btn.click().catch(() => {}); added = true; console.log('Clicked:', label); break; }
}
if (!added) console.log('WARN: add-to-cart button not found');
await page.waitForTimeout(2000);

// Cart
console.log('Capturing cart...');
await page.goto(`${SITE}/cart`, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2500);
await killCookie(page);
await page.evaluate(() => scrollTo(0, 0));
await page.screenshot({ path: path.join(DIR, '13-cart.png'), type: 'png' });
console.log('Saved 13-cart.png');

// Checkout
console.log('Capturing checkout...');
await page.goto(`${SITE}/checkout`, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);
await killCookie(page);
await page.evaluate(() => scrollTo(0, 0));
await page.screenshot({ path: path.join(DIR, '14-checkout.png'), type: 'png' });
console.log('Saved 14-checkout.png');

await browser.close();
console.log('Done.');
