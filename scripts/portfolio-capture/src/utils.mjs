import fs from 'node:fs/promises';
import path from 'node:path';

export function nowIso() {
  return new Date().toISOString();
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Convert a URL to a filesystem-safe slug.
 * Deterministic: same URL always produces the same slug.
 */
export function slugifyUrl(url) {
  return String(url)
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function round(n, precision = 2) {
  const f = 10 ** precision;
  return Math.round(n * f) / f;
}

/**
 * Calculate the overlapping area of two rects {x, y, width, height}.
 */
export function overlapArea(a, b) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
}

export function area(r) {
  return Math.max(0, r.width) * Math.max(0, r.height);
}

/**
 * Intersection over Union for two rects.
 */
export function iou(a, b) {
  const inter = overlapArea(a, b);
  const union = area(a) + area(b) - inter;
  return union > 0 ? inter / union : 0;
}

/**
 * Sanitise a label into a filename-safe slug.
 */
export function safeLabel(label, fallback = 'section') {
  const result = String(label || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return result || fallback;
}

export function manifestRelativePath(rootOut, filePath) {
  return path.relative(rootOut, filePath).split(path.sep).join('/');
}

/**
 * Escape HTML special characters to prevent XSS in generated HTML files.
 */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** PNG magic bytes: 137 80 78 71 13 10 26 10 */
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * Validate that a file is a real PNG with minimum dimensions.
 * Checks magic bytes, file size, and reads IHDR for width/height.
 */
export async function validatePng(filePath, minBytes = 2000, minDim = 40) {
  const stats = await fs.stat(filePath);
  if (!stats.size || stats.size < minBytes) {
    throw new Error(`Capture too small (${stats.size} bytes): ${filePath}`);
  }

  const fd = await fs.open(filePath, 'r');
  try {
    // Read first 24 bytes: 8 magic + 4 chunk-length + 4 chunk-type + 4 width + 4 height
    const buf = Buffer.alloc(24);
    await fd.read(buf, 0, 24, 0);

    if (!buf.subarray(0, 8).equals(PNG_MAGIC)) {
      throw new Error(`Not a valid PNG (bad magic bytes): ${filePath}`);
    }

    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);

    if (width < minDim || height < minDim) {
      throw new Error(`PNG too small (${width}x${height}): ${filePath}`);
    }

    return { size: stats.size, width, height };
  } finally {
    await fd.close();
  }
}
