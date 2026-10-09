/* The photographs on /logo-design (src/components/logo-design/Run.jsx,
   Colours.jsx), cut from their masters.

     node scripts/logo-photos.mjs --masters <logo-masters>

   --masters  where the original downloads live. They're kept outside the repo
              and never committed. On Caleb's PC: C4-Internal/logo-masters/
              (downloaded 10 Oct 2026), one file per photo, named
              unsplash-<photo id>.jpg.

   Every photo is from Unsplash under the Unsplash License
   (https://unsplash.com/license), checked on each photo's own page on
   10 Oct 2026, and downloaded as the original file. The list, with each
   photographer and page, is src/components/logo-design/photos.js; this
   script reads it, so the two can't disagree.

   What it writes, into src/components/logo-design/assets/photos/:
     <key>-<w>.avif and .webp
                Each crop at the widths in photos.js. Every file carries the
                photo's page, photographer, licence and download date in its
                EXIF ImageDescription. No image model is involved anywhere.

   Crops are in the original's pixels. They take out anything that isn't the
   craft: a reflected street name at the top of the window, the printer's chin
   and the sewing machine's plate marking. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PHOTOS } from '../src/components/logo-design/photos.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'components', 'logo-design', 'assets', 'photos');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const MASTERS = opt('--masters');
if (!MASTERS) {
  console.error('Pass --masters <logo-masters>.');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });
const kb = (f) => Math.round(fs.statSync(f).size / 1024);
let total = 0;

for (const p of PHOTOS) {
  const master = path.join(MASTERS, `unsplash-${p.id}.jpg`);
  if (!fs.existsSync(master)) { console.error(`missing ${master}`); process.exit(1); }
  const about = `${p.subject} Photo: ${p.photographer} (${p.profile}) on Unsplash, ${p.page}. ${p.licence}, ${p.licenceUrl}. Downloaded ${p.downloaded}. Used on /logo-design for: ${p.use} Cut by scripts/logo-photos.mjs.`;
  const exif = { IFD0: { ImageDescription: about } };
  let img = sharp(master).rotate();
  if (p.crop) img = img.extract(p.crop);
  const buf = await img.toBuffer();
  const made = [];
  for (const w of p.widths) {
    const base = path.join(OUT, `${p.key}-${w}`);
    const r = sharp(buf).resize({ width: w, kernel: 'lanczos3' });
    await r.clone().withExif(exif).avif({ quality: 50, effort: 6 }).toFile(`${base}.avif`);
    await r.clone().withExif(exif).webp({ quality: 76, effort: 6 }).toFile(`${base}.webp`);
    made.push(`${w} (${kb(`${base}.avif`)} / ${kb(`${base}.webp`)} KB)`);
    total += kb(`${base}.avif`);
  }
  console.log(`${p.key}: ${made.join(', ')}`);
}
console.log(`avif total across every width: ${total} KB`);
