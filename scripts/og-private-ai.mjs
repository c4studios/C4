/**
 * One-off generator for public/og/private-ai.png (1200x630).
 * Print style: ink bar top, headline, mono footer line.
 * Run from the C4-main repo root: node <path>/og-private-ai.mjs
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const OUT = path.resolve(process.cwd(), 'public', 'og', 'private-ai.png');

const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;700&family=Geist+Mono:wght@400;700&display=block" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; }
  body {
    background: #FFFFFF;
    color: #2B3036;
    font-family: 'Instrument Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow: hidden;
  }
  .bar { position: absolute; top: 0; left: 0; right: 0; height: 14px; background: #14171B; }
  .inner { position: absolute; inset: 14px 0 0 0; padding: 74px 88px 56px; display: flex; flex-direction: column; }
  .kicker { font-family: 'Geist Mono', monospace; font-size: 17px; letter-spacing: 0.14em; color: #14171B; }
  h1 { font-family: 'Instrument Sans', sans-serif; font-weight: 700; font-size: 96px; line-height: 1.02;
    letter-spacing: -0.02em; color: #14171B; margin-top: 44px; max-width: 950px; }
  .sub { font-size: 27px; line-height: 1.5; color: #2B3036; margin-top: 32px; max-width: 820px; }
  .rule { width: 430px; height: 3px; background: #14171B; margin-top: 36px; }
  .footer { margin-top: auto; display: flex; gap: 64px;
    font-family: 'Geist Mono', monospace; font-size: 15px; letter-spacing: 0.14em;
    text-transform: uppercase; color: #6C737B; }
</style></head><body>
  <div class="bar"></div>
  <div class="inner">
    <div class="kicker">C4 STUDIOS · PRIVATE AI SYSTEMS</div>
    <h1>Private AI for your practice.</h1>
    <p class="sub">Capable AI running entirely on your own hardware, in your own office. Nothing leaves the building.</p>
    <div class="rule"></div>
    <div class="footer">
      <span>CALEB@C4STUDIOS.COM.AU</span>
      <span>C4STUDIOS.COM.AU</span>
      <span>PERTH, WESTERN AUSTRALIA</span>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await mkdir(path.dirname(OUT), { recursive: true });
await page.screenshot({ path: OUT, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log('Wrote', OUT);
