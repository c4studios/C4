/**
 * og-card.mjs — og-image.png, the 1200×630 share card for every page that has
 * no card of its own. scripts/prerender.mjs calls it after the pages, while
 * its static server is still serving dist/.
 *
 * Repaired 15 Oct 2026 (SEO audit H5), with the design kept as it was:
 *
 *  - The type is Archivo, the site's own face, loaded from the build's /fonts/.
 *    The card used to ask for system fonts (-apple-system, Segoe UI, Inter).
 *    The GitHub Actions runner appears to have none of them: production drew
 *    the card in a much wider face (it looks like DejaVu Sans), the headline
 *    ran to three lines and printed over the paragraph. On Windows, in Segoe
 *    UI, it had fitted.
 *  - The card is served from the prerender's own origin, so /fonts/ resolves
 *    there, and the shot waits for document.fonts.ready.
 *  - The text sits in normal flow, one block under the next, so no face can put
 *    one line of it on top of another. The old layout pinned the headline to
 *    the top and the paragraph to the bottom with absolute positions. If a
 *    fallback face ever lands anyway and the stack runs out of room, the
 *    headline, then the paragraph, steps down until it fits, and the build log
 *    says so.
 *  - The footer says Est. 2025. It said 2022 until Caleb's call on 9 Oct 2026
 *    that every founding date reads December 2025.
 *
 * To look at it without a full build: serve dist/ and call generateOgImage().
 */

const FRAME = { width: 1200, height: 630, inset: 88 };

const HTML = `<!doctype html>
<html><head><meta charset="utf-8" /><style>
  @font-face { font-family: 'Archivo'; font-style: normal; font-weight: 100 900; font-stretch: 62% 125%;
    font-display: block; src: url(/fonts/archivo-latin-3.woff2) format('woff2'); }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${FRAME.width}px; height: ${FRAME.height}px; }
  body {
    background: #0F1115;
    color: #ECE7DE;
    font-family: 'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow: hidden;
  }
  .grain { position: absolute; inset: 0; opacity: 0.06; pointer-events: none;
    background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px);
    background-size: 3px 3px; }
  .glow { position: absolute; bottom: -200px; left: 50%; transform: translateX(-50%);
    width: 900px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(179,58,58,0.18), transparent 60%);
    filter: blur(60px); }
  .frame { position: absolute; inset: 56px; border: 1px solid rgba(236,231,222,0.08); border-radius: 14px; }
  /* Everything with words in it, in flow. The measures below put each block
     where the pinned layout had it: the label at 88px, the headline at 178px,
     the paragraph ending at 450px and the footer ending at 542px. */
  .card { position: absolute; inset: ${FRAME.inset}px; display: flex; flex-direction: column; }
  .label { font-size: 14px; line-height: 20px; letter-spacing: 0.32em; text-transform: uppercase;
    color: rgba(236,231,222,0.45); font-weight: 500; }
  .label::before { content: ""; display: inline-block; width: 36px; height: 1px;
    background: #B33A3A; margin-right: 14px; transform: translateY(-4px); }
  h1 { margin-top: 70px;
    font-size: 92px; font-weight: 600; letter-spacing: -0.045em; line-height: 0.98;
    max-width: 980px; }
  .accent { color: #B33A3A; }
  /* margin-top: auto takes up the slack above the paragraph, and the padding
     keeps 28px clear under the headline's descenders when there is none. */
  .sub { margin-top: auto; padding-top: 28px;
    font-size: 22px; line-height: 1.45; color: rgba(236,231,222,0.65);
    font-weight: 400; max-width: 820px; letter-spacing: -0.005em; }
  .footer { margin-top: 64px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 16px; line-height: 28px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(236,231,222,0.5); font-weight: 500; }
  .brand { font-size: 22px; letter-spacing: -0.02em; text-transform: none; color: #ECE7DE; font-weight: 600; }
</style></head><body>
  <div class="glow"></div>
  <div class="grain"></div>
  <div class="frame"></div>
  <main class="card">
    <div class="label">C4 Studios — Perth</div>
    <h1>Websites, photography, SEO <span class="accent">&amp;</span> logos.</h1>
    <p class="sub">A Perth design and development studio building flagship websites and software, with brand-led photography, SEO and logo design, for ambitious founders.</p>
    <div class="footer">
      <span class="brand">c4studios.com.au</span>
      <span>Founder-led · Est. 2025</span>
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

    const result = await page.evaluate(async (bottomLimit) => {
      await Promise.all(['500 14px', '600 92px', '400 22px', '600 22px'].map((f) => document.fonts.load(`${f} Archivo`))).catch(() => {});
      await document.fonts.ready;
      const archivo = [...document.fonts].some((f) => f.family.replace(/["']/g, '') === 'Archivo' && f.status === 'loaded');

      // A safety net for a face the layout wasn't drawn for. With Archivo
      // loaded it never moves anything.
      const h1 = document.querySelector('h1');
      const sub = document.querySelector('.sub');
      const footer = document.querySelector('.footer');
      const over = () => footer.getBoundingClientRect().bottom > bottomLimit + 0.5;
      let h1Size = 92;
      while (over() && h1Size > 60) { h1Size -= 2; h1.style.fontSize = `${h1Size}px`; }
      let subSize = 22;
      while (over() && subSize > 18) { subSize -= 1; sub.style.fontSize = `${subSize}px`; }

      // Where the words themselves sit (a range, so the paragraph's padding
      // isn't counted as text).
      const ink = (el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const r = range.getBoundingClientRect();
        return { top: Math.round(r.top), bottom: Math.round(r.bottom) };
      };
      return {
        archivo,
        h1Size,
        subSize,
        fits: !over(),
        headlineLines: Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)),
        text: { h1: ink(h1), sub: ink(sub), footer: ink(footer) },
      };
    }, FRAME.height - FRAME.inset);

    await page.screenshot({ path: outputPath, type: 'png', clip: { x: 0, y: 0, width: FRAME.width, height: FRAME.height } });
    return result;
  } finally {
    await page.close();
  }
}
