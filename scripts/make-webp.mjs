#!/usr/bin/env node
/**
 * make-webp.mjs — WebP copies of the portfolio's PNG screenshots and covers.
 *
 * The PNG captures are the originals (and what og:image and the capture
 * scripts use), but they cost the Portfolio page about 34 MB on a phone. This
 * writes, beside each PNG under public/captures and public/covers:
 *   name.webp       same pixel size
 *   name-800.webp   800 px wide, for grid tiles and phones (only when wider)
 * and src/data/imageManifest.json with each PNG's width and height, which
 * PortfolioMedia uses for <picture> sources and for width/height attributes.
 *
 * Run it after adding captures:  node scripts/make-webp.mjs
 * Existing WebP files newer than their PNG are skipped.
 */
import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const DIRS = ['captures', 'covers'];
const EXTRA = ['founder-headshot.png'];
const SMALL = 800;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (/\.png$/i.test(entry.name)) out.push(p);
  }
  return out;
}
const newer = async (a, b) => {
  try { return (await stat(a)).mtimeMs >= (await stat(b)).mtimeMs; } catch { return false; }
};

const pngs = [];
for (const d of DIRS) pngs.push(...(await walk(path.join(PUBLIC, d))));
for (const f of EXTRA) pngs.push(path.join(PUBLIC, f));

const manifest = {};
let before = 0;
let after = 0;
let made = 0;
for (const png of pngs) {
  const meta = await sharp(png, { limitInputPixels: false }).metadata();
  const url = `/${path.relative(PUBLIC, png).split(path.sep).join('/')}`;
  const base = png.replace(/\.png$/i, '');
  const small = meta.width > SMALL * 1.25;
  manifest[url] = { w: meta.width, h: meta.height, small };
  before += (await stat(png)).size;
  if (!(await newer(`${base}.webp`, png))) {
    /* WebP tops out at 16383 px a side; very tall full-page captures are scaled to fit. */
    const fit = Math.max(meta.width, meta.height) > 16000 ? { width: Math.floor(meta.width * 16000 / Math.max(meta.width, meta.height)) } : null;
    const img = sharp(png, { limitInputPixels: false });
    await (fit ? img.resize(fit) : img).webp({ quality: 80, effort: 5 }).toFile(`${base}.webp`);
    made++;
  }
  if (small && !(await newer(`${base}-${SMALL}.webp`, png))) {
    await sharp(png, { limitInputPixels: false }).resize({ width: SMALL }).webp({ quality: 78, effort: 5 }).toFile(`${base}-${SMALL}.webp`);
  }
  after += (await stat(`${base}.webp`)).size;
}
await writeFile(path.join(ROOT, 'src', 'data', 'imageManifest.json'), `${JSON.stringify(manifest, null, 0)}\n`);
console.log(`${pngs.length} PNGs, ${made} converted. Full-size PNG ${(before / 1048576).toFixed(1)} MB -> WebP ${(after / 1048576).toFixed(1)} MB.`);
