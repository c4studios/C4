import path from 'node:path';
import { ensureDir, manifestRelativePath, safeLabel, validatePng } from './utils.mjs';
import { planCrop, detectStickyHeaderHeight } from './crops.mjs';

/**
 * Hide sticky/fixed headers before capturing non-hero sections.
 * Returns a restore function to re-show them.
 */
async function hideStickyHeaders(page) {
  return page.evaluate(() => {
    const hidden = [];
    document.querySelectorAll('header, nav, [role="banner"]').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'sticky') {
        hidden.push({ el, prev: el.style.cssText });
        el.style.setProperty('visibility', 'hidden', 'important');
      }
    });
    return hidden.length;
  });
}

async function restoreStickyHeaders(page) {
  return page.evaluate(() => {
    document.querySelectorAll('header, nav, [role="banner"]').forEach(el => {
      el.style.removeProperty('visibility');
    });
  });
}

/**
 * Capture a single screenshot for a candidate section.
 * Falls back to a full-viewport capture if the clip fails.
 */
async function captureOne(page, candidate, options, ordinal) {
  const deviceDir = path.join(options.rootOut, options.kind);
  await ensureDir(deviceDir);

  const viewportSize = page.viewportSize() || options.viewport;
  const fullHeight = await page.evaluate(() =>
    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
  );

  const stickyHeaderHeight = await detectStickyHeaderHeight(page);
  const crop = planCrop(
    candidate,
    { width: viewportSize.width, height: viewportSize.height, fullWidth: viewportSize.width, fullHeight },
    options.kind,
    stickyHeaderHeight,
  );

  // Scroll to section with a small offset for context
  await page.evaluate(y => window.scrollTo(0, y), Math.max(0, crop.y - 20));
  await page.waitForTimeout(250);

  // Use heading text for filename when label is generic 'section'
  const labelForFile = candidate.label === 'section' && candidate.headingText
    ? safeLabel(candidate.headingText.slice(0, 40), 'section')
    : safeLabel(candidate.label);
  const fileName = `${String(ordinal).padStart(2, '0')}-${labelForFile}.png`;
  const filePath = path.join(deviceDir, fileName);
  const clip = {
    x: Math.max(0, crop.x),
    y: Math.max(0, crop.y),
    width: Math.max(1, crop.width),
    height: Math.max(1, crop.height),
  };

  // Hide sticky header for non-hero captures to prevent it appearing in every screenshot
  const shouldHideHeader = candidate.label !== 'hero';
  if (shouldHideHeader) await hideStickyHeaders(page);

  try {
    await page.screenshot({ path: filePath, clip, fullPage: true, type: 'png', animations: 'disabled' });
    const validation = await validatePng(filePath);
    return {
      fileName,
      filePath: manifestRelativePath(options.rootOut, filePath),
      clip,
      bytes: validation.size,
      dimensions: { width: validation.width, height: validation.height },
      usedFallback: false,
    };
  } catch (error) {
    if (!options.config.fullPageFallback) throw error;

    const fallbackLabelForFile = candidate.label === 'section' && candidate.headingText
      ? safeLabel(candidate.headingText.slice(0, 40), 'section')
      : safeLabel(candidate.label);
    const fallbackName = `${String(ordinal).padStart(2, '0')}-${fallbackLabelForFile}-fallback.png`;
    const fallbackPath = path.join(deviceDir, fallbackName);

    await page.screenshot({ path: fallbackPath, fullPage: false, type: 'png', animations: 'disabled' });
    const validation = await validatePng(fallbackPath);
    return {
      fileName: fallbackName,
      filePath: manifestRelativePath(options.rootOut, fallbackPath),
      clip: null,
      bytes: validation.size,
      dimensions: { width: validation.width, height: validation.height },
      usedFallback: true,
      warning: `clip-failed: ${error.message}`,
    };
  } finally {
    if (shouldHideHeader) await restoreStickyHeaders(page);
  }
}

/**
 * Capture screenshots for all selected candidates on a device.
 */
export async function captureDeviceSet(page, selected, options) {
  const captures = [];
  let ordinal = 1;

  for (const candidate of selected) {
    try {
      const result = await captureOne(page, candidate, options, ordinal);
      captures.push({
        candidateId: candidate.id,
        label: candidate.label,
        headingText: candidate.headingText,
        score: candidate.score,
        warnings: candidate.warnings,
        ...result,
      });
    } catch (error) {
      captures.push({
        candidateId: candidate.id,
        label: candidate.label,
        headingText: candidate.headingText,
        score: candidate.score,
        warnings: [...(candidate.warnings || []), `capture-failed: ${error.message}`],
        fileName: null,
        error: error.message,
      });
    }
    ordinal += 1;
  }

  return captures;
}
