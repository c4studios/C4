import path from 'node:path';
import { ensureDir, manifestRelativePath, safeLabel, validatePng } from './utils.mjs';
import { planCrop, detectStickyHeaderHeight } from './crops.mjs';

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

  const fileName = `${String(ordinal).padStart(2, '0')}-${safeLabel(candidate.label)}.png`;
  const filePath = path.join(deviceDir, fileName);
  const clip = {
    x: Math.max(0, crop.x),
    y: Math.max(0, crop.y),
    width: Math.max(1, crop.width),
    height: Math.max(1, crop.height),
  };

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

    const fallbackName = `${String(ordinal).padStart(2, '0')}-${safeLabel(candidate.label)}-fallback.png`;
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
