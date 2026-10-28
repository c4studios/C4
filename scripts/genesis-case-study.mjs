#!/usr/bin/env node
/**
 * genesis-case-study.mjs: the pictures on /CaseStudy/genesis-realty-group.
 *
 * Every one is rendered here from the logo's own SVG masters and from the
 * client's Canva file. No image model is involved anywhere.
 *
 *   node scripts/genesis-case-study.mjs --client "<path>/Clients/Genesis Realty Group"
 *   node scripts/make-webp.mjs     (WebP copies and manifest entries for the PNGs)
 *
 * The client folder is never committed. On Caleb's PC it's
 * Projects/Clients/Genesis Realty Group, and this reads from it:
 *   work/masters/genesis-{stacked,horizontal,icon}.svg and geometry.json:
 *     the redraw (build_masters.py, 21 Oct 2026)
 *   work/lib/logo.mjs: the four colourways exactly as the final files use them
 *   work/ref/measurements.json and canva-{g,halo,r}.png: the G, the R and the
 *     white copy of the R behind it, as pictures cut out of the Canva PDF
 *     (Vertical Logos (2).pdf) by measure_canva_art.py, with where the PDF
 *     draws each one
 *
 * It writes:
 *   public/covers/genesis-realty-group.png
 *     the cover: the stacked logo in white and light blue on transparent, for
 *     the navy backdrop the case study gives it
 *   public/covers/genesis-realty-group-share.jpg
 *     the 1200 x 630 share card: the same logo on the agency's navy
 *   public/captures/genesis-realty-group/redraw/{canva,redrawn}.webp
 *     the before and after: one close-up of the mark, the Canva file and then
 *     the redraw, on the same grey so the white outline shows
 *   public/captures/genesis-realty-group/versions/NN-<layout>-<colourway>.png
 *     twelve plates, three layouts in four colourways, each on the ground the
 *     pack's read-me gives it: white for full colour and navy, the agency's
 *     navy for the two white versions
 *
 * Every file carries its origin in its EXIF ImageDescription.
 */
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const opt = (name) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : null; };
const CLIENT = opt('--client');
if (!CLIENT) {
  console.error('Usage: node scripts/genesis-case-study.mjs --client "<path to Clients/Genesis Realty Group>"');
  process.exit(1);
}
const WORK = path.join(CLIENT, 'work');
const { loadMaster, svgFor, RGB } = await import(pathToFileURL(path.join(WORK, 'lib', 'logo.mjs')).href);
const geo = JSON.parse(await readFile(path.join(WORK, 'masters', 'geometry.json'), 'utf8'));
const her = JSON.parse(await readFile(path.join(WORK, 'ref', 'measurements.json'), 'utf8'));
const M = { stacked: loadMaster('stacked'), horizontal: loadMaster('horizontal'), icon: loadMaster('icon') };

const TODAY = '28 October 2026';
const FROM_MASTERS = `Rendered by C4 Studios on ${TODAY} from the Genesis Realty Group SVG masters (the redraw), with scripts/genesis-case-study.mjs. No image model involved.`;
const exif = (about) => ({ IFD0: { ImageDescription: about } });
const out = (...p) => path.join(PUBLIC, ...p);

/* One piece of the logo in one colourway, on transparent, `width` px wide. */
async function logo(piece, colourway, width) {
  const m = M[piece];
  const svg = svgFor(m, colourway, { title: false });
  return sharp(Buffer.from(svg), { density: (72 * width) / m.width }).png().toBuffer({ resolveWithObject: true });
}

/* The paths of a master, placed back where they sit in the Canva file's
   2000 px design space (geometry.json), so the redraw and the Canva art line
   up in one viewBox. */
function inHerSpace(piece, colourway) {
  const m = M[piece];
  const box = geo.boxes[piece];
  const inner = svgFor(m, colourway, { inline: true, title: false, noSize: true })
    .replace(/^<svg[^>]*>\n/, '')
    .replace(/<\/svg>\n?$/, '');
  return `<g transform="translate(${box[0] - m.viewBox[0]} ${box[1] - m.viewBox[1]})">${inner}</g>`;
}

await mkdir(out('covers'), { recursive: true });
await mkdir(out('captures', 'genesis-realty-group', 'redraw'), { recursive: true });
await mkdir(out('captures', 'genesis-realty-group', 'versions'), { recursive: true });

/* ── the cover ─────────────────────────────────────────────────────────── */
{
  const { data, info } = await logo('stacked', 'white-blue', 1120);
  const file = out('covers', 'genesis-realty-group.png');
  await sharp(data)
    .extend({ top: 40, bottom: 40, left: 40, right: 40, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .withExif(exif(`Genesis Realty Group logo, stacked, white and light blue, on transparent. ${FROM_MASTERS}`))
    .png({ compressionLevel: 9 })
    .toFile(file);
  console.log('cover', `${info.width + 80}x${info.height + 80}`);
}

/* ── the share card ────────────────────────────────────────────────────── */
{
  const W = 1200, H = 630;
  const m = M.stacked;
  const h = 404;
  const { data, info } = await logo('stacked', 'white-blue', Math.round((h * m.width) / m.height));
  await sharp({ create: { width: W, height: H, channels: 3, background: RGB.navy } })
    .composite([{ input: data, left: Math.round((W - info.width) / 2), top: Math.round((H - info.height) / 2) }])
    .withExif(exif(`Share card: Genesis Realty Group logo, stacked, white and light blue, on the agency's navy ${RGB.navy}. ${FROM_MASTERS}`))
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(out('covers', 'genesis-realty-group-share.jpg'));
  console.log('share', `${W}x${H}`);
}

/* ── the before and after ──────────────────────────────────────────────────
   One region of the Canva file's 2000 px design space, around the R: the
   white outline round its bowl, the crossbar's join with the curve, and all
   three gaps between the R and the G. The Canva side is the PDF's own
   pictures, drawn in the PDF's order (the G, the navy patch over the
   crossbar's step, the white copy of the R, the R) at the PDF's positions,
   so it enlarges exactly as the file does. The redraw is the stacked master
   in full colour. Both sit on one grey: on white, the white outline can't be
   seen. */
const REGION = [660, 636, 880, 550];
const SIDE = { w: 2000, h: 1250 };
const GREY = '#C3C8CE';
const frame = (body) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${REGION.join(' ')}" width="${SIDE.w}" height="${SIDE.h}">` +
  `<rect x="${REGION[0]}" y="${REGION[1]}" width="${REGION[2]}" height="${REGION[3]}" fill="${GREY}"/>${body}</svg>`;
{
  const im = her.images;
  const p = her.patch;
  const pic = async (n) => `data:image/png;base64,${(await readFile(path.join(WORK, 'ref', `canva-${n}.png`))).toString('base64')}`;
  const clip = (id, c) => `<clipPath id="${id}"><rect x="${c[0]}" y="${c[1]}" width="${c[2]}" height="${c[3]}"/></clipPath>`;
  const canva = frame(
    `<defs>${clip('hc', im.halo.clip)}${clip('rc', im.r.clip)}</defs>` +
    `<image xlink:href="${await pic('g')}" x="${im.g.x}" y="${im.g.y}" width="${im.g.size}" height="${im.g.size}"/>` +
    `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="${p.colour}"/>` +
    `<image xlink:href="${await pic('halo')}" x="${im.halo.x}" y="${im.halo.y}" width="${im.halo.size}" height="${im.halo.size}" clip-path="url(#hc)"/>` +
    `<image xlink:href="${await pic('r')}" x="${im.r.x}" y="${im.r.y}" width="${im.r.size}" height="${im.r.size}" clip-path="url(#rc)"/>`,
  );
  const redrawn = frame(inHerSpace('stacked', 'full-colour'));
  const where = `the region x ${REGION[0]}, y ${REGION[1]}, ${REGION[2]} by ${REGION[3]} of the Canva file's 2000 px design space, on grey ${GREY}`;
  await sharp(Buffer.from(canva))
    .withExif(exif(`Before: Genesis Realty Group's Canva logo, close up. Drawn from the pictures of the G, the R and the white copy of the R inside the client's Canva PDF (Vertical Logos (2).pdf), at the PDF's own positions; ${where}. Rendered by C4 Studios on ${TODAY} with scripts/genesis-case-study.mjs. No image model involved.`))
    .webp({ quality: 88, effort: 6 })
    .toFile(out('captures', 'genesis-realty-group', 'redraw', 'canva.webp'));
  await sharp(Buffer.from(redrawn))
    .withExif(exif(`After: the redrawn Genesis Realty Group logo, close up; ${where}. ${FROM_MASTERS}`))
    .webp({ quality: 90, effort: 6 })
    .toFile(out('captures', 'genesis-realty-group', 'redraw', 'redrawn.webp'));
  console.log('before/after', `${SIDE.w}x${SIDE.h}`);
}

/* ── the twelve plates ─────────────────────────────────────────────────── */
const PLATE = { w: 1600, h: 1000 };
const ORDER = ['full-colour', 'navy', 'white', 'white-blue'];
const PIECES = ['stacked', 'horizontal', 'icon'];
const GROUND = { 'full-colour': '#FFFFFF', navy: '#FFFFFF', white: RGB.navy, 'white-blue': RGB.navy };
const NAME = { 'full-colour': 'full colour', navy: 'navy', white: 'white', 'white-blue': 'white and light blue' };
/* The stacked logo and the icon stand 56% of the plate's height; the
   horizontal logo runs 65% of its width. */
const widthOf = (piece) => {
  const m = M[piece];
  if (piece === 'horizontal') return Math.round(PLATE.w * 0.65);
  return Math.round((PLATE.h * 0.56 * m.width) / m.height);
};
let n = 0;
for (const cw of ORDER) {
  for (const piece of PIECES) {
    n += 1;
    const { data, info } = await logo(piece, cw, widthOf(piece));
    const file = out('captures', 'genesis-realty-group', 'versions', `${String(n).padStart(2, '0')}-${piece}-${cw}.png`);
    await sharp({ create: { width: PLATE.w, height: PLATE.h, channels: 3, background: GROUND[cw] } })
      .composite([{ input: data, left: Math.round((PLATE.w - info.width) / 2), top: Math.round((PLATE.h - info.height) / 2) }])
      .withExif(exif(`Genesis Realty Group logo, ${piece}, ${NAME[cw]}, on ${GROUND[cw]}. ${FROM_MASTERS}`))
      .png({ compressionLevel: 9 })
      .toFile(file);
    console.log(path.relative(ROOT, file), `${info.width}x${info.height} on ${GROUND[cw]}`);
  }
}
