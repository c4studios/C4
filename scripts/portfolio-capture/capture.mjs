#!/usr/bin/env node
import path from 'node:path';
import { parseCli } from './src/cli.mjs';
import { ensureDir, nowIso, slugifyUrl } from './src/utils.mjs';
import { closeBrowser, createBrowser, createContexts } from './src/browser.mjs';
import { preparePageForCapture } from './src/stability.mjs';
import { hideBlockingElements, injectMotionSuppression } from './src/overlays.mjs';
import { collectCandidates } from './src/candidates.mjs';
import { scoreAndSelectCandidates } from './src/scoring.mjs';
import { captureDeviceSet } from './src/capture.mjs';
import { writeManifest } from './src/manifest.mjs';
import { writeContactSheet } from './src/contactSheet.mjs';

const MAX_NAV_RETRIES = 2;

/**
 * Navigate to a URL with retry on failure.
 */
async function navigateWithRetry(page, url, timeout) {
  let lastError;
  for (let attempt = 0; attempt < MAX_NAV_RETRIES; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
      return;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_NAV_RETRIES - 1) {
        console.warn(`  [retry] Navigation attempt ${attempt + 1} failed, retrying...`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
  throw lastError;
}

async function processUrl(browser, config, url) {
  const slug = slugifyUrl(url);
  const rootOut = path.join(config.out, slug);
  await ensureDir(rootOut);

  const manifest = {
    sourceUrl: url,
    slug,
    timestamp: nowIso(),
    overlays: [],
    devices: {},
    warnings: [],
  };

  const contexts = await createContexts(browser, config);

  for (const device of contexts) {
    const { kind, context, page, viewport } = device;
    try {
      console.log(`  [${kind}] Navigating...`);
      await navigateWithRetry(page, url, config.browserTimeout);

      console.log(`  [${kind}] Preparing page...`);
      await preparePageForCapture(page, config, manifest, kind);
      await injectMotionSuppression(page);

      const hidden = await hideBlockingElements(page);
      manifest.overlays.push(...hidden.map(item => ({ ...item, device: kind })));
      if (hidden.length > 0 && config.verbose) {
        console.log(`  [${kind}] Hid ${hidden.length} overlay(s)`);
      }

      console.log(`  [${kind}] Collecting candidates...`);
      const rawCandidates = await collectCandidates(page, config, kind);
      const selected = scoreAndSelectCandidates(rawCandidates, config, kind);

      console.log(`  [${kind}] Capturing ${selected.length} of ${rawCandidates.length} candidates...`);
      const captures = await captureDeviceSet(page, selected, {
        rootOut,
        kind,
        viewport,
        config,
      });

      const successCount = captures.filter(c => c.fileName).length;
      const failCount = captures.length - successCount;
      console.log(`  [${kind}] Done: ${successCount} captured${failCount ? `, ${failCount} failed` : ''}`);

      manifest.devices[kind] = {
        viewport,
        rawCandidateCount: rawCandidates.length,
        selectedCandidateCount: selected.length,
        selected,
        captures,
      };
    } catch (error) {
      manifest.devices[kind] = {
        error: error?.stack || String(error),
        captures: [],
      };
      manifest.warnings.push(`${kind}: ${error?.message || error}`);
      console.error(`  [${kind}] Error: ${error?.message || error}`);
    } finally {
      await context.close();
    }
  }

  await writeManifest(rootOut, manifest);
  await writeContactSheet(rootOut, manifest);
  return manifest;
}

async function main() {
  const config = parseCli(process.argv.slice(2));
  await ensureDir(config.out);

  if (config.dryRun) {
    console.log('[portfolio-capture] Dry run — config validated:');
    console.log(JSON.stringify(config, null, 2));
    return;
  }

  const browser = await createBrowser(config);
  const manifests = [];

  try {
    for (const url of config.urls) {
      console.log(`\n[portfolio-capture] Processing ${url}`);
      const manifest = await processUrl(browser, config, url);
      manifests.push(manifest);

      const totalCaptures = Object.values(manifest.devices)
        .reduce((sum, d) => sum + (d.captures?.filter(c => c.fileName)?.length || 0), 0);
      const totalWarnings = manifest.warnings.length;
      console.log(`[portfolio-capture] Done: ${totalCaptures} captures, ${totalWarnings} warning(s)`);
    }
  } finally {
    await closeBrowser(browser);
  }

  console.log(`\n[portfolio-capture] Complete. Output: ${path.resolve(config.out)}`);
  for (const m of manifests) {
    const warnSuffix = m.warnings.length ? ` (${m.warnings.length} warning(s))` : '';
    console.log(`  - ${m.slug}${warnSuffix}`);
  }
}

main().catch((error) => {
  console.error('[portfolio-capture] Fatal error');
  console.error(error?.stack || String(error));
  process.exit(1);
});
