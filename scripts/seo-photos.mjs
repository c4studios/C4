/* The photographs on /seo-and-copywriting (src/components/seo-copy/).

     node scripts/seo-photos.mjs --masters <seo-masters>

   --masters  the folder the downloaded originals live in. They're kept
              outside the repo and never committed. On Caleb's PC:
              C4-Internal/seo-masters/ (made 10 Oct 2026). Each one was
              downloaded from the photo's own page; the page, photographer
              and licence are in src/components/seo-copy/photos.js and in
              PHOTOS below, and go into every cut's EXIF ImageDescription.

   What it writes, into src/components/seo-copy/assets/photos/:
     phone-<w>       hands holding a phone over a table. The phone's screen
                     was a green screen; it's keyed out to transparency here,
                     so the page can show its own example results through
                     the hole (OnPhone.jsx). The thumb stays in front.
     markup-<w>      a typed page being marked up in red pen. The typewriter
                     at the top of the original is cropped off.
     switchboard-<w> gloved hands testing a switchboard with a multimeter.
     ute-<w>         a tray-back ute on a building site. The number plate is
                     blurred.
   Each in AVIF and WebP. No image model is involved anywhere. Nothing is
   drawn into a photo; any words shown with one are HTML on the page.

   Crops are in the original's pixels. The phone crop's screen corners are
   measured from the green, and OnPhone.jsx's --scr-* values come from them:
   if the crop moves, run with --measure and move those too. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'components', 'seo-copy', 'assets', 'photos');

export const PHOTOS = [
  {
    key: 'phone',
    master: 'unsplash-RsVfsE3wOvw-gariev-phone.jpg',
    page: 'https://unsplash.com/photos/person-holding-a-smartphone-with-a-green-screen-RsVfsE3wOvw',
    by: 'Vitaly Gariev',
    licence: 'Unsplash License',
    crop: { left: 900, top: 0, width: 1940, height: 2160 },
    widths: [480, 720, 1080],
    key_green: true,
  },
  {
    key: 'markup',
    master: 'pexels-7968067-lach-markup.jpg',
    page: 'https://www.pexels.com/photo/a-person-marking-a-composition-7968067/',
    by: 'Ron Lach',
    licence: 'Pexels License',
    crop: { left: 0, top: 1120, width: 4480, height: 5600 },
    widths: [480, 720, 960],
  },
  {
    key: 'switchboard',
    master: 'unsplash-PkHf7BUWbtk-toolmash-switchboard.png',
    page: 'https://unsplash.com/photos/electrician-testing-electrical-panel-with-multimeter-PkHf7BUWbtk',
    by: 'Toolmash Expo',
    licence: 'Unsplash License',
    crop: { left: 0, top: 0, width: 4000, height: 3000 },
    widths: [480, 800, 1200],
  },
  {
    key: 'ute',
    master: 'unsplash-3Ayc2Mwv07U-mortier-ute.jpg',
    page: 'https://unsplash.com/photos/a-white-pick-up-truck-parked-on-a-dirt-road-3Ayc2Mwv07U',
    by: 'Troy Mortier',
    licence: 'Unsplash License',
    crop: { left: 0, top: 900, width: 5760, height: 2880 },
    widths: [480, 800],
    /* the number plate and the maker's badge, in the original's pixels */
    blur: [{ left: 560, top: 2580, width: 280, height: 200 }, { left: 610, top: 2280, width: 150, height: 130 }],
  },
];

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const MASTERS = opt('--masters');
if (!MASTERS) {
  console.error('Pass --masters <seo-masters>.');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });
const kb = (f) => `${Math.round(fs.statSync(f).size / 1024)} KB`;

/* Key the green screen out: green-dominant pixels go transparent, with a
   soft ramp at the edge, and the green that spills onto the bezel and the
   thumb is pulled back to neutral. */
async function keyGreen(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i]; const g = out[i + 1]; const b = out[i + 2];
    const lead = g - Math.max(r, b);
    if (lead > 22) {
      /* 22 to 70 ramps from opaque to clear */
      const a = Math.max(0, Math.min(1, 1 - (lead - 22) / 48));
      out[i + 3] = Math.round(255 * a);
      out[i + 1] = Math.max(r, b);
    } else if (lead > 4) {
      out[i + 1] = Math.max(r, b) + 4;
    }
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

/* The four corners of the transparent screen, in the cut's pixels. */
async function measure(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let tl = [Infinity]; let tr = [-Infinity]; let bl = [Infinity];
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 20) continue;
      if (x + y < tl[0]) tl = [x + y, x, y];
      if (x - y > tr[0]) tr = [x - y, x, y];
      if (x - y < bl[0]) bl = [x - y, x, y];
    }
  }
  const pct = (p) => `(${(p[1] / info.width * 100).toFixed(2)}%, ${(p[2] / info.height * 100).toFixed(2)}%)`;
  console.log(`screen corners: top left ${pct(tl)}, top right ${pct(tr)}, bottom left ${pct(bl)}`);
}

for (const p of PHOTOS) {
  const master = path.join(MASTERS, p.master);
  if (!fs.existsSync(master)) { console.error(`missing ${master}`); process.exit(1); }
  let base = sharp(master).rotate();
  if (p.blur) {
    const whole = await base.toBuffer();
    const patches = await Promise.all(p.blur.map(async (r) => ({
      input: await sharp(whole).extract(r).blur(18).toBuffer(), left: r.left, top: r.top,
    })));
    base = sharp(await sharp(whole).composite(patches).toBuffer());
  }
  let buf = await base.extract(p.crop).toBuffer();
  if (p.key_green) {
    buf = await keyGreen(buf);
    if (args.includes('--measure')) await measure(buf);
  }
  const about = `${p.by}, ${p.licence} (${p.page}). Downloaded 10 October 2026. Cut for /seo-and-copywriting by scripts/seo-photos.mjs${p.key_green ? '; the green screen keyed out' : ''}${p.blur ? '; the number plate blurred' : ''}.`;
  const exif = { IFD0: { ImageDescription: about } };
  const made = [];
  for (const w of p.widths) {
    const file = path.join(OUT, `${p.key}-${w}`);
    const img = sharp(buf).resize({ width: w, kernel: 'lanczos3' });
    await img.clone().withExif(exif).avif({ quality: 50, effort: 6 }).toFile(`${file}.avif`);
    await img.clone().withExif(exif).webp({ quality: 76, effort: 6, alphaQuality: 90 }).toFile(`${file}.webp`);
    made.push(`${w} (${kb(`${file}.avif`)} avif, ${kb(`${file}.webp`)} webp)`);
  }
  console.log(`${p.key}: ${made.join(', ')}`);
}
