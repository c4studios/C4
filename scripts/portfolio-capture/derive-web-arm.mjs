#!/usr/bin/env node
/**
 * Derive the /ServiceWeb page's bundled webp set from public/captures
 * (read-only source of truth). Re-run any time captures refresh.
 *
 *   plx-*        15 portfolio thumbs — the hero fusion's parallax rows
 *   dsr-home-*   DSR real full-page home (desktop + mobile) — device drive
 *   hvn-f*       HVN cinematic film-strip frames
 *   tidy-f*      Tidy Gardens display frames (+ tidy-hero refresh)
 *   cpt-*        Concept carousel faces (Barry's, Wooster, JK, VEER, IOPA)
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('package.json'));
const sharp = require('sharp');

const CAPS = path.resolve('public', 'captures');
const OUT = path.resolve('src', 'components', 'web-arm', 'assets');

const JOBS = [
  /* ── Fusion parallax thumbs (800w, q72) ─────────────────────────── */
  ['plx-dsr', 'dsracingkarts-com-au/desktop/01-hero.png', 800, 72],
  ['plx-evidence', 'evidenceadvisory-com-au/desktop/01-hero.png', 800, 72],
  ['plx-tidy', 'tidygardens-com-au/desktop/01-hero.png', 800, 72],
  ['plx-hvn', 'thehvncrossfit-com/desktop/01-hero.png', 800, 72],
  ['plx-sharp', 'sharpbricklaying-com-au/desktop/01-hero.png', 800, 72],
  ['plx-groverz', 'groverztax-com-au/desktop/01-hero.png', 800, 72],
  ['plx-rocks', 'rocksstream/desktop/03-browse-cannington.png', 800, 72],
  ['plx-jurassic', 'jurassic-pt-vercel-app/desktop/01-hero.png', 800, 72],
  ['plx-gocc', 'gocc-com-au/desktop/01-hero.png', 800, 72],
  ['plx-freo', 'transformfreo-com/desktop/01-hero.png', 800, 72],
  ['plx-hakea', 'transformhakea-com/desktop/01-hero.png', 800, 72],
  ['plx-people', 'peoplepower-app/desktop/01-intro.png', 800, 72],
  ['plx-quotr', 'quotr-us/desktop/01.png', 800, 72],
  ['plx-returndesk', 'c4-saas-suite-vercel-app/desktop/01.png', 800, 72],
  ['plx-barrys', 'barrys-drink-concept-vercel-app/desktop/01-hero.png', 800, 72],
  /* ── DSR real homepage, full page (device drive) ────────────────── */
  ['dsr-home-d', 'dsracingkarts-com-au/desktop/00-fullpage.png', 900, 66],
  ['dsr-home-m', 'dsracingkarts-com-au/mobile/00-fullpage.png', 480, 66],
  /* ── HVN film strip (900w) ──────────────────────────────────────── */
  ['hvn-f1', 'thehvncrossfit-com/desktop/01-hero.png', 900, 70],
  ['hvn-f2', 'thehvncrossfit-com/desktop/02-value-props.png', 900, 70],
  ['hvn-f3', 'thehvncrossfit-com/desktop/03-chinup-game.png', 900, 70],
  ['hvn-f4', 'thehvncrossfit-com/desktop/07-classes-timetable.png', 900, 70],
  ['hvn-f5', 'thehvncrossfit-com/desktop/12-gallery.png', 900, 70],
  ['hvn-f6', 'thehvncrossfit-com/desktop/13-shop.png', 900, 70],
  /* ── Tidy display frames + hero refresh ─────────────────────────── */
  ['tidy-hero', 'tidygardens-com-au/desktop/01-hero.png', 900, 70],
  ['tidy-f2', 'tidygardens-com-au/desktop/06-lawn-care.png', 900, 70],
  ['tidy-f3', 'tidygardens-com-au/desktop/04-reticulation.png', 900, 70],
  /* ── Concept faces (800w) ───────────────────────────────────────── */
  ['cpt-barrys', 'barrys-drink-concept-vercel-app/desktop/01-hero.png', 800, 72],
  ['cpt-wooster', 'wooster-core-vercel-app/desktop/01.png', 800, 72],
  ['cpt-jk', 'jk-plumbing-tau-vercel-app/desktop/01.png', 800, 72],
  ['cpt-veer', 'veer-demo-netlify-app/desktop/01-hero.png', 800, 72],
  ['cpt-iopa', 'iopa-apparel-vercel-app/desktop/01-hero.png', 800, 72],
];

await fs.mkdir(OUT, { recursive: true });
const manifest = {};
let total = 0;

for (const [name, rel, width, quality] of JOBS) {
  const src = path.join(CAPS, rel);
  const dest = path.join(OUT, `${name}.webp`);
  const img = sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality });
  const info = await img.toFile(dest);
  manifest[name] = { w: info.width, h: info.height };
  total += info.size;
  console.log(`  ✓ ${name}.webp ${info.width}×${info.height} (${Math.round(info.size / 1024)}KB)`);
}

console.log(`\nTotal: ${Math.round(total / 1024)}KB across ${JOBS.length} files`);
console.log('\nDIMS = ' + JSON.stringify(manifest));
