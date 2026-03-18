import { clamp, round } from './utils.mjs';

/**
 * Detect the height of any sticky/fixed header on the page.
 * Used to offset crop regions so captures don't include the sticky header.
 */
export async function detectStickyHeaderHeight(page) {
  return page.evaluate(() => {
    const candidates = document.querySelectorAll('header, nav, [role="banner"]');
    let maxHeight = 0;
    for (const el of candidates) {
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'sticky') {
        const rect = el.getBoundingClientRect();
        if (rect.height > maxHeight && rect.height < 200) {
          maxHeight = rect.height;
        }
      }
    }
    return Math.round(maxHeight);
  }).catch(() => 0);
}

/**
 * Plan a crop region for a candidate section.
 *
 * Improvements over v4:
 * - Accounts for sticky header height (avoids capturing header in every crop)
 * - Padding is applied before clamping
 * - Height clamping preserves the top of the section (never cuts the heading)
 */
export function planCrop(candidate, viewport, kind, stickyHeaderHeight = 0) {
  const padX = kind === 'mobile' ? 12 : 24;
  const padY = kind === 'mobile' ? 16 : 28;

  let x = candidate.rect.x - padX;
  let y = candidate.rect.y - padY;
  let width = candidate.rect.width + padX * 2;
  let height = candidate.rect.height + padY * 2;

  const maxWidth = viewport.fullWidth;
  const maxHeight = viewport.fullHeight;

  // Avoid including sticky header in crop unless this IS the hero
  if (candidate.label !== 'hero' && y > 0 && y < stickyHeaderHeight + 20) {
    y = stickyHeaderHeight;
    height = candidate.rect.height + padY;
  }

  // Clamp to page bounds
  x = clamp(x, 0, Math.max(0, maxWidth - 1));
  y = clamp(y, 0, Math.max(0, maxHeight - 1));
  width = clamp(width, 1, maxWidth - x);
  height = clamp(height, 1, maxHeight - y);

  // Height cap: keep section top visible, trim overflow from bottom
  const targetMax = kind === 'mobile' ? viewport.height * 2.0 : viewport.height * 1.5;
  if (height > targetMax) {
    height = targetMax;
  }

  return {
    x: round(x, 0),
    y: round(y, 0),
    width: round(width, 0),
    height: round(height, 0),
  };
}
