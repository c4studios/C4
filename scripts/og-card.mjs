/**
 * og-card.mjs — og-image.png, the 1200×630 share card for every page that has
 * no card of its own. scripts/prerender.mjs calls it after the pages, while
 * its static server is still serving dist/.
 *
 * Redesigned 4 Nov 2026. Caleb wanted the tile that shows when he shares a
 * link "lighter, more minimalistic, better designed, less ai looking", and
 * chose option B of three. It's the bench's own paper (#F7F5F2), the real C4
 * mark on the left, and the line the old card led with, stacked in Archivo,
 * with the address under it in B612 Mono. The old card's dark ground, red
 * glow, dot grain, hairline frame, small tracked label and paragraph are gone.
 *
 * The mark is the site's own: the C, the 4 and the T come straight from
 * src/components/c4/markBuild.js (trued 17 Oct 2026), so a redraw there
 * reaches the card too. The C is the printed card's pale "ghost" C, set as a
 * blind emboss on the paper (a white edge up and left, a shade down and
 * right) so it still reads at link-preview size.
 *
 * Kept from the 15 Oct 2026 repair (SEO audit H5): the type loads from the
 * build's own /fonts/, because the GitHub Actions runner has none of the
 * system faces; the card is served from the prerender's origin so /fonts/
 * resolves; the shot waits for document.fonts.ready; and the words sit in
 * normal flow, so no fallback face can stack one line on another. If a wider
 * face ever lands and the words run past the right margin, the headline, then
 * the address, steps down until they fit, and the build log says so.
 *
 * To look at it without a full build: serve dist/ and call generateOgImage().
 */

import { MARK_BODY, MARK_ARM, MARK_C } from '../src/components/c4/markBuild.js';

const FRAME = { width: 1200, height: 630, right: 64 };

/** The sizes the card is drawn at. prerender.mjs warns if they had to step down. */
export const SIZES = { h1: 60, addr: 22 };

/* The mark's own bounds (getBBox of the C, the 4 and the T), 4 units clear. */
const VIEWBOX = { x: 40.36, y: 88.3, w: 603.0, h: 385.28 };
const MARK_HEIGHT = 232;
const MARK_WIDTH = Math.round((MARK_HEIGHT * VIEWBOX.w) / VIEWBOX.h);
const points = (pts) => pts.map(([x, y]) => `${x},${y}`).join(' ');

const MARK = `<svg class="mark" viewBox="${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}" width="${MARK_WIDTH}" height="${MARK_HEIGHT}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" role="img" aria-label="C4 Studios">
    <path d="${MARK_C}" fill="#FFFFFF" transform="translate(-2.2 -2.2)"/>
    <path d="${MARK_C}" fill="#C9C3BA" transform="translate(2.2 2.4)"/>
    <path d="${MARK_C}" fill="#E7E3DC"/>
    <polygon points="${points(MARK_BODY)}" fill="#A30000"/>
    <polygon points="${points(MARK_ARM)}" fill="#22632F"/>
  </svg>`;

const HTML = `<!doctype html>
<html><head><meta charset="utf-8" /><style>
  @font-face { font-family: 'Archivo'; font-style: normal; font-weight: 100 900; font-stretch: 62% 125%;
    font-display: block; src: url(/fonts/archivo-latin-3.woff2) format('woff2'); }
  @font-face { font-family: 'B612 Mono'; font-style: normal; font-weight: 400;
    font-display: block; src: url(/fonts/b612-mono-latin-1.woff2) format('woff2'); }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${FRAME.width}px; height: ${FRAME.height}px; }
  body {
    background: #F7F5F2;
    color: #1A1A1A;
    font-family: 'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow: hidden;
  }
  /* The mark and the words side by side, centred on the card's height. */
  .card { position: absolute; inset: 0; display: flex; align-items: center; padding-left: 100px; gap: 76px; }
  .mark { flex: none; display: block; }
  h1 { font-size: ${SIZES.h1}px; font-weight: 660; font-variation-settings: 'wdth' 97;
    letter-spacing: -0.035em; line-height: 1; white-space: nowrap; }
  .addr { margin-top: 30px; font-family: 'B612 Mono', ui-monospace, Menlo, monospace;
    font-size: ${SIZES.addr}px; font-feature-settings: 'tnum', 'zero'; letter-spacing: 0.02em;
    color: #6B6A64; white-space: nowrap; }
</style></head><body>
  <main class="card">
    ${MARK}
    <div class="words">
      <h1>Websites,<br />photography,<br />SEO &amp; logos.</h1>
      <p class="addr">c4studios.com.au · Perth</p>
    </div>
  </main>
</body></html>`;

/**
 * Render the card to `outputPath`. `baseUrl` is the origin serving dist/ (the
 * prerender's static server). Returns what the card was drawn with, for the
 * build log.
 */
export async function generateOgImage(browser, baseUrl, outputPath) {
  const page = await browser.newPage();
  try {
    await page.setViewportSize({ width: FRAME.width, height: FRAME.height });
    // Served at an address on the same origin as /fonts/, without writing a
    // file into dist/.
    const cardUrl = `${baseUrl}/__og-card__`;
    await page.route(cardUrl, (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: HTML }));
    await page.goto(cardUrl, { waitUntil: 'load' });

    const result = await page.evaluate(async ({ rightLimit, sizes }) => {
      await Promise.all([`660 ${sizes.h1}px Archivo`, `400 ${sizes.addr}px "B612 Mono"`].map((f) => document.fonts.load(f))).catch(() => {});
      await document.fonts.ready;
      const loaded = (family) => [...document.fonts].some((f) => f.family.replace(/["']/g, '') === family && f.status === 'loaded');

      // A safety net for a face the layout wasn't drawn for. With Archivo and
      // B612 Mono loaded it never moves anything.
      const words = document.querySelector('.words');
      const h1 = document.querySelector('h1');
      const addr = document.querySelector('.addr');
      const over = () => words.getBoundingClientRect().right > rightLimit + 0.5;
      let h1Size = sizes.h1;
      while (over() && h1Size > 40) { h1Size -= 2; h1.style.fontSize = `${h1Size}px`; }
      let addrSize = sizes.addr;
      while (over() && addrSize > 16) { addrSize -= 1; addr.style.fontSize = `${addrSize}px`; }

      const box = (el) => {
        const r = el.getBoundingClientRect();
        return { left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom) };
      };
      return {
        archivo: loaded('Archivo'),
        b612: loaded('B612 Mono'),
        h1Size,
        subSize: addrSize,
        fits: !over(),
        text: { mark: box(document.querySelector('.mark')), h1: box(h1), addr: box(addr) },
      };
    }, { rightLimit: FRAME.width - FRAME.right, sizes: SIZES });

    await page.screenshot({ path: outputPath, type: 'png', clip: { x: 0, y: 0, width: FRAME.width, height: FRAME.height } });
    return result;
  } finally {
    await page.close();
  }
}
