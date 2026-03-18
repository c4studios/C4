import fs from 'node:fs/promises';
import path from 'node:path';
import { escapeHtml } from './utils.mjs';

/**
 * Generate an HTML contact/review sheet for visual QA of captures.
 * All dynamic values are HTML-escaped to prevent XSS in generated files.
 */
export async function writeContactSheet(rootOut, manifest) {
  const slug = escapeHtml(manifest.slug);
  const sourceUrl = escapeHtml(manifest.sourceUrl);
  const timestamp = escapeHtml(manifest.timestamp);

  const rows = [];
  for (const [device, data] of Object.entries(manifest.devices)) {
    if (data?.error) {
      rows.push(`
        <article class="card error-card">
          <div class="meta">
            <strong>${escapeHtml(device)}</strong>
            <span class="warn">Error: ${escapeHtml(data.error.split('\n')[0])}</span>
          </div>
        </article>
      `);
      continue;
    }

    for (const capture of (data?.captures || [])) {
      if (!capture.fileName) {
        rows.push(`
          <article class="card error-card">
            <div class="meta">
              <strong>${escapeHtml(device)}</strong>
              <span>${escapeHtml(capture.label)}</span>
              <span class="warn">Capture failed: ${escapeHtml(capture.error || 'unknown')}</span>
            </div>
          </article>
        `);
        continue;
      }

      rows.push(`
        <article class="card">
          <div class="meta">
            <strong>${escapeHtml(device)}</strong>
            <span>${escapeHtml(capture.label)}</span>
            <span>score: ${capture.score ?? ''}</span>
            <span>${capture.bytes ? Math.round(capture.bytes / 1024) + ' KB' : ''}</span>
            ${capture.usedFallback ? '<span class="warn">fallback</span>' : ''}
            ${(capture.warnings || []).map(w => `<span class="warn">${escapeHtml(w)}</span>`).join('')}
          </div>
          <img src="./${escapeHtml(capture.filePath)}" alt="${escapeHtml(capture.label)}" loading="lazy" />
        </article>
      `);
    }
  }

  const warningSection = manifest.warnings.length > 0
    ? `<div class="warnings"><h2>Warnings</h2><ul>${manifest.warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul></div>`
    : '';

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${slug} — capture review</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; margin: 24px; background: #f7f7f8; color: #111; }
    h1 { margin: 0 0 4px; font-size: 20px; }
    .subtitle { margin: 0 0 16px; color: #444; font-size: 12px; }
    .subtitle a { color: #2563eb; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; }
    .card { background: white; border: 1px solid #e3e3e6; border-radius: 14px; padding: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.05); }
    .error-card { border-color: #fca5a5; background: #fef2f2; }
    .meta { display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; color: #444; margin-bottom: 10px; }
    .warn { color: #a53; }
    img { width: 100%; height: auto; border-radius: 10px; border: 1px solid #eee; }
    .warnings { margin-bottom: 20px; padding: 12px 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; }
    .warnings h2 { font-size: 14px; margin: 0 0 8px; color: #92400e; }
    .warnings ul { margin: 0; padding-left: 20px; font-size: 12px; color: #92400e; }
  </style>
</head>
<body>
  <h1>${slug}</h1>
  <p class="subtitle">
    <a href="${sourceUrl}">${sourceUrl}</a>
    &nbsp;&middot;&nbsp; ${timestamp}
  </p>
  ${warningSection}
  <div class="grid">
    ${rows.join('\n')}
  </div>
</body>
</html>`;

  await fs.writeFile(path.join(rootOut, 'contact-sheet.html'), html, 'utf8');
}
