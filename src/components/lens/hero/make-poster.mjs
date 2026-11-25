// Renders the two poster stills for the /Lens hero from the live shader:
// the eye looking straight ahead on black, saved as WebP next to this file.
// Needs the Vite dev server running and Playwright's Chromium installed.
//   node src/components/lens/hero/make-poster.mjs [dev server origin]
// It loads harness.html?poster, which draws one frame per size and calls
// canvas.toBlob('image/webp', q). q starts at 0.86 and steps down only if a
// file is over its budget (1600 px: 120 KB, 800 px: 45 KB).
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const origin = process.argv[2] || 'http://localhost:5173';
const url = `${origin}/src/components/lens/hero/harness.html?poster`;
const budget = { 1600: 120 * 1024, 800: 45 * 1024 };
const args = ['--enable-gpu', '--ignore-gpu-blocklist'];

let browser;
try {
  browser = await chromium.launch({ headless: true, channel: 'chromium', args });
} catch {
  browser = await chromium.launch({ headless: true, args });
}
const page = await browser.newPage();
const done = {};
for (const q of [0.86, 0.82, 0.78, 0.74, 0.7]) {
  await page.goto(`${url}&q=${q}`);
  await page.waitForFunction(() => window.__posters || window.__posterError, null, { timeout: 120000 });
  const err = await page.evaluate(() => window.__posterError);
  if (err) throw new Error(err);
  const out = await page.evaluate(() => window.__posters);
  for (const w of [1600, 800]) {
    if (done[w]) continue;
    const buf = Buffer.from(out[w], 'base64');
    if (buf.length <= budget[w] || q === 0.7) {
      writeFileSync(path.join(here, `eye-poster-${w}.webp`), buf);
      done[w] = { q, kb: Math.round(buf.length / 1024) };
    }
  }
  if (done[1600] && done[800]) break;
}
await browser.close();
console.log(JSON.stringify(done));
