async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wait for web fonts with a hard timeout to prevent hangs.
 */
export async function waitForFonts(page, timeoutMs = 5000) {
  try {
    await page.evaluate((timeout) => {
      return Promise.race([
        document.fonts?.ready || Promise.resolve(),
        new Promise(resolve => setTimeout(resolve, timeout)),
      ]);
    }, timeoutMs);
  } catch { /* non-critical */ }
}

/**
 * Scroll the page incrementally to trigger lazy-loaded content.
 * Re-measures page height during scroll to account for dynamically added content.
 */
export async function triggerLazyLoad(page, settleMs = 120) {
  const viewport = page.viewportSize() || { height: 1000 };
  const step = Math.max(360, Math.floor(viewport.height * 0.65));
  let scrolled = 0;
  const maxScrolls = 80; // safety cap
  let scrollCount = 0;

  while (scrollCount < maxScrolls) {
    const pageHeight = await page.evaluate(() =>
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
      ),
    );

    if (scrolled >= pageHeight) break;

    scrolled += step;
    await page.evaluate(y => window.scrollTo(0, y), scrolled);
    await wait(settleMs);
    scrollCount += 1;
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(settleMs);
}

/**
 * Wait for <img> elements to finish loading, with per-image timeout.
 */
export async function waitForImages(page) {
  try {
    await page.evaluate(async () => {
      const images = Array.from(document.images || []);
      await Promise.all(images.map(async img => {
        try {
          if (!(img.complete && img.naturalWidth > 0)) {
            await new Promise(resolve => {
              const done = () => resolve();
              img.addEventListener('load', done, { once: true });
              img.addEventListener('error', done, { once: true });
              setTimeout(done, 3000);
            });
          }
          if (img.decode) await img.decode().catch(() => {});
        } catch { /* non-critical */ }
      }));
    });
  } catch { /* non-critical */ }
}

/**
 * Capture a layout fingerprint of the page for stability comparison.
 * Uses main element dimensions + heading positions.
 */
async function captureLayoutFingerprint(page) {
  return page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const rect = main.getBoundingClientRect();
    const headings = Array.from(document.querySelectorAll('h1,h2,h3')).slice(0, 12).map(el => {
      const r = el.getBoundingClientRect();
      return {
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
        t: (el.textContent || '').trim().slice(0, 40),
      };
    });
    return {
      bodyH: Math.round(document.body.scrollHeight),
      docH: Math.round(document.documentElement.scrollHeight),
      mainX: Math.round(rect.x), mainY: Math.round(rect.y),
      mainW: Math.round(rect.width), mainH: Math.round(rect.height),
      headings,
    };
  });
}

function sameFingerprint(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Check layout stability by comparing successive fingerprints.
 * Returns true if layout is stable within the retry window.
 */
export async function waitForLayoutStable(page, manifest, kind, retries = 5) {
  let previous = await captureLayoutFingerprint(page);
  for (let i = 0; i < retries; i += 1) {
    await wait(400);
    const next = await captureLayoutFingerprint(page);
    if (sameFingerprint(previous, next)) return true;
    previous = next;
  }
  manifest.warnings.push(`${kind}: layout never fully stabilised after ${retries} checks`);
  return false;
}

/**
 * Full page preparation pipeline:
 * 1. Wait for load + network idle
 * 2. Wait for fonts (with timeout)
 * 3. Scroll to trigger lazy content
 * 4. Wait for images
 * 5. Settle delay
 * 6. Verify layout stability
 */
export async function preparePageForCapture(page, config, manifest, kind) {
  await page.waitForLoadState('load', { timeout: config.browserTimeout }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: Math.min(config.browserTimeout, 15000) }).catch(() => {});
  await waitForFonts(page);
  await triggerLazyLoad(page, Math.min(config.settleMs, 200));
  await waitForImages(page);
  await wait(config.settleMs);
  await waitForLayoutStable(page, manifest, kind);
}
