/* Paper plates for the /About bench, rendered once from SVG authored here and
   stored as JPEG. No image model is involved: every fibre, rule, crease and
   page edge is drawn in this file, the same way scripts/lens-textures.mjs
   makes the /Lens metal. The plates carry no words; the page sets its own
   type on them, and the geometry both sides share lives in
   src/components/about/plates.js.
   Run: node scripts/bench-plates.mjs   (playwright and sharp are already present)
   Output: public/bench/notebook-spread.jpg, card-stock.jpg, run-sheet.jpg and
   bible-spread.jpg, each with its origin written into a JPEG comment. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { NOTEBOOK, CARD, SHEET, BIBLE } from '../src/components/about/plates.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'bench');
fs.mkdirSync(OUT, { recursive: true });

let seed = 29;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const R = (a, b) => a + rnd() * (b - a);
const f = (n) => Number(n).toFixed(2);

/* Paper fibre: a fine lit relief multiplied into the stock, then a slow
   mottle so no two areas of a sheet are quite the same value. */
const paperFilter = (id, { freq = 1.1, relief = 0.35, mottle = 0.035, fseed = 3 } = {}) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${fseed}" result="fine"/>
    <feDiffuseLighting in="fine" lighting-color="#ffffff" surfaceScale="${relief}" diffuseConstant="1.17" result="lit">
      <feDistantLight azimuth="225" elevation="58"/>
    </feDiffuseLighting>
    <feComposite in="lit" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="fibre"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="${fseed + 4}" result="slow"/>
    <feColorMatrix in="slow" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 ${mottle * 2} ${-mottle * 0.6}" result="mott"/>
    <feComposite in="mott" in2="SourceAlpha" operator="in" result="mottIn"/>
    <feMerge><feMergeNode in="fibre"/><feMergeNode in="mottIn"/></feMerge>
  </filter>`;

/* Leather grain for the covers. */
const leatherFilter = (id) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.42" numOctaves="3" seed="17" result="g"/>
    <feDiffuseLighting in="g" lighting-color="#ffffff" surfaceScale="2.6" diffuseConstant="1.25" result="lit">
      <feDistantLight azimuth="225" elevation="50"/>
    </feDiffuseLighting>
    <feComposite in="lit" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0"/>
  </filter>`;

/* A soft top-left light over the whole object. */
const lightOver = (w, h, id) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.10"/>
    <stop offset="0.55" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="1" stop-color="#3a2f22" stop-opacity="0.05"/>
  </linearGradient>`;

/* A gutter is a valley lit from the top left: the left leaf darkens as it
   falls away from the light into the fold, the right leaf climbs back into
   it and catches a soft highlight on its shoulder. */
const valley = (id, depth) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#3d2f20" stop-opacity="0"/>
    <stop offset="0.28" stop-color="#3d2f20" stop-opacity="${f(depth * 0.1)}"/>
    <stop offset="0.43" stop-color="#3d2f20" stop-opacity="${f(depth * 0.32)}"/>
    <stop offset="0.49" stop-color="#2a2016" stop-opacity="${f(depth * 0.78)}"/>
    <stop offset="0.5" stop-color="#1f170f" stop-opacity="${f(depth)}"/>
    <stop offset="0.512" stop-color="#3d2f20" stop-opacity="${f(depth * 0.4)}"/>
    <stop offset="0.535" stop-color="#ffffff" stop-opacity="0.1"/>
    <stop offset="0.6" stop-color="#ffffff" stop-opacity="0.13"/>
    <stop offset="0.74" stop-color="#ffffff" stop-opacity="0.04"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>`;

/* Page-block edges: the stacked leaves seen at the fore-edge. */
function pageBlock(x, y, h, dir, count, gap, tones) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const xi = x + dir * i * gap;
    const tone = tones[i % tones.length];
    out.push(`<line x1="${f(xi)}" y1="${f(y + R(0, 1.2))}" x2="${f(xi)}" y2="${f(y + h - R(0, 1.2))}" stroke="${tone}" stroke-width="${f(R(0.5, 0.9))}"/>`);
  }
  return out.join('');
}

function notebookSvg() {
  const { w, h, cover: c, fold, ruleTop, pitch, ruleEnd, scale } = NOTEBOOK;
  const rules = [];
  for (let y = ruleTop; y <= h - ruleEnd; y += pitch) {
    const a = R(0.78, 0.95);
    rules.push(`<line x1="${c + 2}" y1="${y}" x2="${fold - 3}" y2="${y + R(-0.25, 0.25)}" stroke="#cfc8b8" stroke-opacity="${f(a)}" stroke-width="1.15"/>`);
    rules.push(`<line x1="${fold + 3}" y1="${y}" x2="${w - c - 2}" y2="${y + R(-0.25, 0.25)}" stroke="#cfc8b8" stroke-opacity="${f(a)}" stroke-width="1.15"/>`);
  }
  const pageL = `M${c + 7} ${c} H${fold} V${h - c} H${c + 7} Q${c} ${h - c} ${c} ${h - c - 7} V${c + 7} Q${c} ${c} ${c + 7} ${c} Z`;
  const pageR = `M${fold} ${c} H${w - c - 7} Q${w - c} ${c} ${w - c} ${c + 7} V${h - c - 7} Q${w - c} ${h - c} ${w - c - 7} ${h - c} H${fold} Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}">
  <defs>
    ${paperFilter('paper', { freq: 1.25, relief: 0.3, mottle: 0.03, fseed: 5 })}
    ${leatherFilter('leather')}
    ${lightOver(w, h, 'light')}
    ${valley('gutter', 0.34)}
    <linearGradient id="foreL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3b2f22" stop-opacity="0.14"/><stop offset="1" stop-color="#3b2f22" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="foreR" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#3b2f22" stop-opacity="0.14"/><stop offset="1" stop-color="#3b2f22" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="14" fill="#2c2926" filter="url(#leather)"/>
  <path d="${pageL}" fill="#fbf9f2" filter="url(#paper)"/>
  <path d="${pageR}" fill="#fbf9f2" filter="url(#paper)"/>
  <g>${rules.join('')}</g>
  <g>${pageBlock(c + 1.2, c + 3, h - 2 * c - 6, 1, 6, 1.35, ['#ddd6c7', '#f4f0e6', '#cfc7b6'])}</g>
  <g>${pageBlock(w - c - 1.2, c + 3, h - 2 * c - 6, -1, 6, 1.35, ['#ddd6c7', '#f4f0e6', '#cfc7b6'])}</g>
  <rect x="${c}" y="${c}" width="16" height="${h - 2 * c}" fill="url(#foreL)"/>
  <rect x="${w - c - 16}" y="${c}" width="16" height="${h - 2 * c}" fill="url(#foreR)"/>
  <rect x="${fold - 90}" y="${c}" width="180" height="${h - 2 * c}" fill="url(#gutter)"/>
  <rect width="${w}" height="${h}" rx="14" fill="url(#light)"/>
</svg>`;
}

function cardSvg() {
  const { w, h, scale } = CARD;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}">
  <defs>
    ${paperFilter('stock', { freq: 0.95, relief: 0.6, mottle: 0.028, fseed: 9 })}
    ${lightOver(w, h, 'light')}
  </defs>
  <rect width="${w}" height="${h}" fill="#fcfaf4" filter="url(#stock)"/>
  <rect x="0.6" y="0.6" width="${w - 1.2}" height="${h - 1.2}" fill="none" stroke="#5a4c3a" stroke-opacity="0.2" stroke-width="1.2"/>
  <path d="M1.8 ${h - 2} V1.8 H${w - 2}" fill="none" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.1"/>
  <rect width="${w}" height="${h}" fill="url(#light)"/>
</svg>`;
}

function sheetSvg() {
  const { w, h, folds, scale } = SHEET;
  const creases = folds.map((t) => {
    const y = h * t;
    return `
    <rect x="0" y="${y - 38}" width="${w}" height="38" fill="url(#creaseUp)"/>
    <rect x="0" y="${y}" width="${w}" height="30" fill="url(#creaseDown)"/>
    <line x1="0" y1="${y}" x2="${w}" y2="${y + R(-0.6, 0.6)}" stroke="#6e6252" stroke-opacity="0.16" stroke-width="1"/>
    <line x1="0" y1="${y + 1.3}" x2="${w}" y2="${y + 1.3}" stroke="#ffffff" stroke-opacity="0.7" stroke-width="1"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}">
  <defs>
    ${paperFilter('sheet', { freq: 1.3, relief: 0.25, mottle: 0.018, fseed: 13 })}
    ${lightOver(w, h, 'light')}
    <linearGradient id="creaseUp" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a3c2c" stop-opacity="0"/><stop offset="1" stop-color="#4a3c2c" stop-opacity="0.045"/>
    </linearGradient>
    <linearGradient id="creaseDown" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#fdfcf9" filter="url(#sheet)"/>
  ${creases}
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="#5a4c3a" stroke-opacity="0.12" stroke-width="1"/>
  <rect width="${w}" height="${h}" fill="url(#light)"/>
</svg>`;
}

function bibleSvg() {
  const { w, h, cover: c, fold, scale } = BIBLE;
  const pageL = `M${c + 6} ${c} H${fold} V${h - c} H${c + 6} Q${c} ${h - c} ${c} ${h - c - 6} V${c + 6} Q${c} ${c} ${c + 6} ${c} Z`;
  const pageR = `M${fold} ${c} H${w - c - 6} Q${w - c} ${c} ${w - c} ${c + 6} V${h - c - 6} Q${w - c} ${h - c} ${w - c - 6} ${h - c} H${fold} Z`;
  const tones = ['#e6dcc4', '#f3ecda', '#d9cdb1', '#efe6d0'];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}">
  <defs>
    ${paperFilter('thin', { freq: 1.35, relief: 0.22, mottle: 0.022, fseed: 21 })}
    ${leatherFilter('leather')}
    ${lightOver(w, h, 'light')}
    ${valley('curl', 0.48)}
    <linearGradient id="liftL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3d2f20" stop-opacity="0.16"/><stop offset="1" stop-color="#3d2f20" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="liftR" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#3d2f20" stop-opacity="0.16"/><stop offset="1" stop-color="#3d2f20" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="18" fill="#221d19" filter="url(#leather)"/>
  <path d="${pageL}" fill="#f6f0e0" filter="url(#thin)"/>
  <path d="${pageR}" fill="#f6f0e0" filter="url(#thin)"/>
  <g>${pageBlock(c + 1, c + 2, h - 2 * c - 4, 1, 12, 0.95, tones)}</g>
  <g>${pageBlock(w - c - 1, c + 2, h - 2 * c - 4, -1, 12, 0.95, tones)}</g>
  <rect x="${c}" y="${c}" width="28" height="${h - 2 * c}" fill="url(#liftL)"/>
  <rect x="${w - c - 28}" y="${c}" width="28" height="${h - 2 * c}" fill="url(#liftR)"/>
  <rect x="${fold - 190}" y="${c}" width="380" height="${h - 2 * c}" fill="url(#curl)"/>
  <rect width="${w}" height="${h}" rx="18" fill="url(#light)"/>
</svg>`;
}

const PLATES = [
  { name: 'notebook-spread', svg: notebookSvg, spec: NOTEBOOK, what: 'an open notebook spread: charcoal cover edge, ruled pages at the pitch in plates.js, page block and gutter' },
  { name: 'card-stock', svg: cardSvg, spec: CARD, what: 'one sheet of heavy card stock with a cut edge' },
  { name: 'run-sheet', svg: sheetSvg, spec: SHEET, what: 'a sheet of printer paper, letter-folded twice' },
  { name: 'bible-spread', svg: bibleSvg, spec: BIBLE, what: 'an open Bible spread: thin cream leaves, dark leather cover edge, page block and gutter curl' },
];

/* The origin travels inside the file as a JPEG comment, in the form the
   impeccable skill's provenance scan reads ("impeccable:prompt" + NUL + text). */
const withComment = (jpg, text) => {
  const body = Buffer.from(`impeccable:prompt\0${text}`, 'utf8');
  const head = Buffer.from([0xff, 0xfe, 0, 0]);
  head.writeUInt16BE(body.length + 2, 2);
  return Buffer.concat([jpg.subarray(0, 2), head, body, jpg.subarray(2)]);
};

const only = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const p of PLATES) {
  if (only.length && !only.includes(p.name)) continue;
  const svg = p.svg();
  await page.setViewportSize({ width: Math.round(p.spec.w * p.spec.scale), height: Math.round(p.spec.h * p.spec.scale) });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#000">${svg}</body></html>`);
  const png = await page.locator('svg').screenshot({ type: 'png' });
  const file = path.join(OUT, `${p.name}.jpg`);
  const jpg = await sharp(png).jpeg({ quality: 80, mozjpeg: true, progressive: true }).toBuffer();
  const origin = `origin: procedural plate drawn in C4-main/scripts/bench-plates.mjs (SVG rendered in Chromium, no image model): ${p.what}. No words; /About sets its own type on it.`;
  fs.writeFileSync(file, withComment(jpg, origin));
  console.log(p.name, `${Math.round(fs.statSync(file).size / 1024)} KB`);
}
await browser.close();
