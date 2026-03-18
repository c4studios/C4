const suppressionCss = `
*, *::before, *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  scroll-behavior: auto !important;
}
html:focus-within { scroll-behavior: auto !important; }
video, audio { animation: none !important; }
`;

/**
 * Inject CSS and JS to freeze all motion on the page.
 * Pauses videos, disables autoplay, kills CSS animations.
 */
export async function injectMotionSuppression(page) {
  await page.addStyleTag({ content: suppressionCss }).catch(() => {});
  await page.evaluate(() => {
    document.querySelectorAll('video').forEach(v => {
      try {
        v.pause();
        v.currentTime = 0;
        v.removeAttribute('autoplay');
      } catch { /* non-critical */ }
    });
  }).catch(() => {});
}

/**
 * Protected elements that should never be hidden, even if heuristics match.
 */
const PROTECTED_TAGS = new Set(['MAIN', 'ARTICLE', 'SECTION', 'NAV', 'HEADER', 'FOOTER']);

const OVERLAY_KEYWORDS = [
  'cookie', 'consent', 'privacy', 'newsletter', 'subscribe',
  'chat', 'intercom', 'crisp', 'zendesk', 'hubspot',
  'popup', 'modal', 'announcement', 'promo', 'offer', 'discount',
  'gdpr', 'onetrust', 'cookiebot',
];

/**
 * Detect and hide blocking overlays (cookie banners, chat widgets, modals, etc).
 *
 * Safety improvements over v4:
 * - Skips landmark elements (main, section, article, nav, header, footer)
 * - Tighter thresholds for "too big" (prevents hiding main content)
 * - Keywords checked against id/className/aria-label only (not full textContent)
 *   to avoid false positives from page body text
 * - Limits iteration to fixed/sticky/high-z elements for performance
 */
export async function hideBlockingElements(page) {
  return page.evaluate(({ keywords, protectedTags }) => {
    const hiddenItems = [];

    function matchesKeyword(el) {
      const haystack = `${el.id || ''} ${el.className || ''} ${el.getAttribute('aria-label') || ''}`.toLowerCase();
      return keywords.some(k => haystack.includes(k));
    }

    // Only consider elements that are positioned or have high z-index
    const candidates = Array.from(document.querySelectorAll('body *'));

    for (const el of candidates) {
      // Never hide protected landmark elements
      if (protectedTags.includes(el.tagName)) continue;

      // Never hide elements inside the main content flow with the main tag
      if (el.closest('main > section') || el.closest('article')) continue;

      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      const isFixedish = style.position === 'fixed' || style.position === 'sticky';
      const zIndex = parseInt(style.zIndex, 10) || 0;
      const highZ = zIndex > 50 || style.zIndex === '9999' || style.zIndex === '99999';

      // Skip elements that aren't positioned overlay-like
      if (!isFixedish && !highZ) continue;

      const tooSmall = rect.width < 120 || rect.height < 36;
      if (tooSmall) continue;

      // Off-screen check
      if (rect.bottom <= 0 || rect.right <= 0) continue;

      const obstructive = rect.width > window.innerWidth * 0.2 && rect.height > 40;
      const likelyOverlay = isFixedish && highZ && obstructive;
      const likelyBanner = isFixedish && matchesKeyword(el);

      // Modal check: only if it's a high-z overlay covering significant screen area
      const likelyModal = highZ && matchesKeyword(el) && rect.height > window.innerHeight * 0.3;

      if (likelyOverlay || likelyBanner || likelyModal) {
        el.setAttribute('data-portfolio-capture-hidden', 'true');
        el.style.setProperty('display', 'none', 'important');
        hiddenItems.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: typeof el.className === 'string' ? el.className.slice(0, 120) : null,
          reason: likelyModal ? 'modal-like' : likelyBanner ? 'banner-like' : 'overlay-like',
          rect: {
            x: Math.round(rect.x), y: Math.round(rect.y),
            width: Math.round(rect.width), height: Math.round(rect.height),
          },
        });
      }
    }

    return hiddenItems;
  }, {
    keywords: OVERLAY_KEYWORDS,
    protectedTags: Array.from(PROTECTED_TAGS),
  }).catch(() => []);
}
