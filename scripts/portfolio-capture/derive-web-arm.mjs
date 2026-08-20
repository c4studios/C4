/**
 * derive-web-arm.mjs — capture PNG  ->  plx-<key>.webp for the HeroFusion
 * parallax rows on /ServiceWeb.
 *
 * HeroFusion.jsx's header has always told you to "add one derive line in
 * scripts/portfolio-capture/derive-web-arm.mjs and run it" — but the script
 * did not exist, so the eighteen existing tiles were derived by hand and the
 * recipe lived nowhere. This is that script.
 *
 * House spec, matched to the tiles already shipping: 1200x750, top-anchored
 * crop (the hero is the point of the tile), WebP under ~72KB. Quality steps
 * down until it fits so a heavy photographic hero cannot bloat the page.
 *
 * Run:  node scripts/portfolio-capture/derive-web-arm.mjs
 *       node scripts/portfolio-capture/derive-web-arm.mjs aqua-safe-plumbing
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';

/** slug -> source capture. One line per portfolio entry that appears in the hero. */
export const DERIVE = {
  'ds-racing-karts': 'dsracingkarts-com-au/desktop/01-hero.png',
  'evidence-advisory': 'evidenceadvisory-com-au/desktop/01-hero.png',
  'tidy-gardens-australia': 'tidygardens-com-au/desktop/01-hero.png',
  'hvn-gym': 'thehvncrossfit-com/desktop/01-hero.png',
  'sharp-bricklaying': 'sharpbricklaying-com-au/desktop/01-hero.png',
  'groverz-tax': 'groverztax-com-au/desktop/01-hero.png',
  rocksstream: 'rocksstream/desktop/01-login.png',
  'jurassic-pt': 'jurassic-pt-vercel-app/desktop/01-hero.png',
  gocc: 'gocc-com-au/desktop/01-hero.png',
  'transform-fremantle': 'transformfreo-com/desktop/01-hero.png',
  'transform-hakea': 'transformhakea-com/desktop/01-hero.png',
  'people-power': 'peoplepower-app/desktop/01-intro.png',
  quotr: 'quotr-us/desktop/01.png',
  returndesk: 'c4-saas-suite-vercel-app/desktop/01.png',
  'barrys-drink': 'barrys-drink-concept-vercel-app/desktop/01-hero.png',
  'wooster-core': 'wooster-core-vercel-app/desktop/01.png',
  'jk-plumbing-solutions': 'jk-plumbing-tau-vercel-app/desktop/01.png',
  iopa: 'iopa-apparel-vercel-app/desktop/01-hero.png',
  'aqua-safe-plumbing': 'aquasafeplumbing-com-au/desktop/01-hero.png',
  'brady-electrical': 'bradyelectrical-com-au/desktop/01-hero.png',
};

/** slug -> the import name used in HeroFusion.jsx (file is plx-<key>.webp). */
export const KEY = {
  'ds-racing-karts': 'dsr',
  'evidence-advisory': 'evidence',
  'tidy-gardens-australia': 'tidy',
  'hvn-gym': 'hvn',
  'sharp-bricklaying': 'sharp',
  'groverz-tax': 'groverz',
  rocksstream: 'rocks',
  'jurassic-pt': 'jurassic',
  gocc: 'gocc',
  'transform-fremantle': 'freo',
  'transform-hakea': 'hakea',
  'people-power': 'people',
  quotr: 'quotr',
  returndesk: 'returndesk',
  'barrys-drink': 'barrys',
  'wooster-core': 'wooster',
  'jk-plumbing-solutions': 'jk',
  iopa: 'iopa',
  'aqua-safe-plumbing': 'aquasafe',
  'brady-electrical': 'brady',
};

const CAPTURES = path.resolve('public/captures');
const OUT = path.resolve('src/components/web-arm/assets');
const W = 1200;
const H = 750;
const MAX_KB = 72;

const PY = `
import sys, os
from PIL import Image
src, out, W, H, MAX_KB = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
im = Image.open(src).convert('RGB')
scale = W / im.width
im = im.resize((W, max(H, round(im.height * scale))), Image.LANCZOS).crop((0, 0, W, H))
q = 82
while q >= 60:
    im.save(out, 'WEBP', quality=q, method=6)
    if os.path.getsize(out) / 1024 <= MAX_KB: break
    q -= 6
print(round(os.path.getsize(out) / 1024), q)
`;

const only = process.argv[2];
mkdirSync(OUT, { recursive: true });

let made = 0;
let skipped = 0;
for (const [slug, rel] of Object.entries(DERIVE)) {
  if (only && slug !== only) continue;
  const src = path.join(CAPTURES, rel);
  const out = path.join(OUT, `plx-${KEY[slug]}.webp`);
  if (!existsSync(src)) {
    console.warn(`  !! ${slug}: source missing -> ${rel}`);
    skipped++;
    continue;
  }
  // Skip anything already current, so a full run is cheap and idempotent.
  if (!only && existsSync(out) && statSync(out).mtimeMs > statSync(src).mtimeMs) {
    skipped++;
    continue;
  }
  const res = execFileSync('python', ['-c', PY, src, out, String(W), String(H), String(MAX_KB)], {
    encoding: 'utf8',
  }).trim().split(/\s+/);
  console.log(`  ok plx-${KEY[slug]}.webp  ${res[0]}KB  q=${res[1]}  <- ${rel}`);
  made++;
}
console.log(`\nDerived ${made}, up to date ${skipped}.`);
