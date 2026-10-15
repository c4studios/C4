/* The photographs on /insights and the articles, and each article's share card.

     node scripts/article-photos.mjs --masters <article-masters> [--no-og] [--only <key>]

   --masters  where the original downloads live. They're kept outside the repo
              and never committed. On Caleb's PC: C4-Internal/article-masters/
              (downloaded 15 Oct 2026), named as in src/content/seo/photos.js.
   --no-og    cut the photos only; leave the share cards alone.
   --only     cut one photo (by key), and only the cards that use it.

   Every photo is a real photograph from Unsplash (Unsplash License) or Pexels
   (Pexels License), checked on its own page on 15 Oct 2026. The list, with
   each photographer, page, crop and blur, is src/content/seo/photos.js; this
   script reads it, so the two can't disagree. No image model is involved
   anywhere.

   What it writes:
     src/components/seo/assets/photos/<key>-<w>.avif and .webp
                Each crop at the widths in photos.js, after any blur. Every
                file carries the photo's page, photographer, licence and
                download date in its EXIF ImageDescription.
     public/insights/<slug>-og.jpg
                The 1200x630 share card (og:image) for every live article whose
                registry entry names a `photo` and an `image`. The photo fills
                the right-hand panel and the title is set beside it in Archivo,
                as HTML, then screenshotted by Playwright. Type is never part of
                any photo and is never generated.

   Crops and blurs are in the original's pixels. The blurs cover the business
   names that were legible: the maker's name on an excavator boom, the brand
   stickers on steel props, the brand on a power board. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PHOTOS, photo as photoByKey } from '../src/content/seo/photos.js';
import { liveArticles } from '../src/content/seo/registry.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'components', 'seo', 'assets', 'photos');
const OG_DIR = path.join(ROOT, 'public', 'insights');
const FONTS = path.join(ROOT, 'public', 'fonts');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const MASTERS = opt('--masters');
const ONLY = opt('--only');
const OG = !args.includes('--no-og');
if (!MASTERS) {
  console.error('Pass --masters <article-masters>.');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });
const kb = (f) => Math.round(fs.statSync(f).size / 1024);

const credit = (p) => `Photo: ${p.photographer} (${p.profile}) on ${p.source}, ${p.page}. ${p.licence}, ${p.licenceUrl}. Downloaded ${p.downloaded}.`;

/* One blur: the polygon's bounding box is blurred, then cut back to the
   polygon with a slightly feathered edge, so the blur stays on the label it
   covers instead of showing as a box over the background. */
async function blurPatch(whole, meta, { poly, sigma = 8 }) {
  const pad = Math.ceil(sigma * 3);
  const xs = poly.map(([x]) => x);
  const ys = poly.map(([, y]) => y);
  const left = Math.max(0, Math.min(...xs) - pad);
  const top = Math.max(0, Math.min(...ys) - pad);
  const width = Math.min(meta.width, Math.max(...xs) + pad) - left;
  const height = Math.min(meta.height, Math.max(...ys) + pad) - top;
  const points = poly.map(([x, y]) => `${x - left},${y - top}`).join(' ');
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`
    + '<filter id="f"><feGaussianBlur stdDeviation="2"/></filter>'
    + `<polygon points="${points}" fill="#fff" filter="url(#f)"/></svg>`,
  );
  const blurred = await sharp(whole).extract({ left, top, width, height }).blur(sigma).toBuffer();
  const input = await sharp(blurred).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  return { input, left, top };
}

/* The crop, with its blurs applied first, as a buffer. */
async function cropped(p) {
  const master = path.join(MASTERS, p.master);
  if (!fs.existsSync(master)) throw new Error(`missing ${master}`);
  const whole = await sharp(master).rotate().toBuffer();
  const meta = await sharp(whole).metadata();
  let base = sharp(whole);
  if (p.blur && p.blur.length) {
    const patches = await Promise.all(p.blur.map((b) => blurPatch(whole, meta, b)));
    base = sharp(await sharp(whole).composite(patches).toBuffer());
  }
  return base.extract(p.crop).toBuffer();
}

const cuts = new Map();
let total = 0;
for (const p of PHOTOS) {
  if (ONLY && p.key !== ONLY) continue;
  const buf = await cropped(p);
  cuts.set(p.key, buf);
  const about = `${p.subject} ${credit(p)} Used on c4studios.com.au for ${p.use}. Cut by scripts/article-photos.mjs${p.blur ? '; legible business names blurred' : ''}.`;
  const exif = { IFD0: { ImageDescription: about } };
  const made = [];
  for (const w of p.widths) {
    const file = path.join(OUT, `${p.key}-${w}`);
    const r = sharp(buf).resize({ width: w, kernel: 'lanczos3' });
    await r.clone().withExif(exif).avif({ quality: 50, effort: 6 }).toFile(`${file}.avif`);
    await r.clone().withExif(exif).webp({ quality: 76, effort: 6 }).toFile(`${file}.webp`);
    total += kb(`${file}.avif`) + kb(`${file}.webp`);
    made.push(`${w} (${kb(`${file}.avif`)}/${kb(`${file}.webp`)} KB)`);
  }
  console.log(`${p.key}: ${made.join(', ')}`);
}
console.log(`photos: ${total} KB written`);

/* ── share cards ─────────────────────────────────────────────────── */
if (OG) {
  const { chromium } = await import('playwright');
  const font = (f) => `data:font/woff2;base64,${fs.readFileSync(path.join(FONTS, f)).toString('base64')}`;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const PANEL = 540;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

  for (const entry of liveArticles()) {
    if (!entry.photo || !entry.image) continue;
    if (ONLY && entry.photo !== ONLY) continue;
    const p = photoByKey(entry.photo);
    if (!p) throw new Error(`/${entry.slug}: no photo '${entry.photo}' in photos.js`);
    const buf = cuts.get(p.key) || await cropped(p);
    const panel = await sharp(buf)
      .resize(PANEL, 630, { fit: 'cover', position: p.ogPosition || 'centre', kernel: 'lanczos3' })
      .jpeg({ quality: 90 })
      .toBuffer();

    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
      @font-face { font-family: 'Archivo'; font-weight: 100 900; font-stretch: 62% 125%; src: url(${font('archivo-latin-3.woff2')}) format('woff2'); }
      @font-face { font-family: 'B612 Mono'; font-weight: 400; src: url(${font('b612-mono-latin-1.woff2')}) format('woff2'); }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: 1200px; height: 630px; overflow: hidden; }
      body { background: #F7F5F2; color: #1A1A1A; font-family: 'Archivo', sans-serif; -webkit-font-smoothing: antialiased; position: relative; }
      .photo { position: absolute; top: 0; right: 0; width: ${PANEL}px; height: 630px; display: block; }
      .text { position: absolute; left: 64px; top: 64px; bottom: 56px; width: ${1200 - PANEL - 64 - 56}px; display: flex; flex-direction: column; }
      .mark { width: 44px; height: 3px; background: #C23030; }
      h1 { margin-top: 30px; font-weight: 680; font-stretch: 94%; font-size: 62px; line-height: 1.03; letter-spacing: -0.032em; text-wrap: balance; }
      .dek { margin-top: 22px; font-size: 24px; line-height: 1.36; letter-spacing: -0.012em; color: #575650; text-wrap: pretty; }
      .meta { margin-top: auto; display: flex; justify-content: space-between; align-items: baseline; font-family: 'B612 Mono', monospace; font-size: 17px; letter-spacing: 0.04em; color: #6B6A64; }
      .meta b { font-family: 'Archivo', sans-serif; font-weight: 700; font-size: 21px; letter-spacing: -0.01em; color: #1A1A1A; }
    </style></head><body>
      <img class="photo" src="data:image/jpeg;base64,${panel.toString('base64')}" alt="">
      <div class="text">
        <div class="mark"></div>
        <h1 id="t">${esc(entry.name)}</h1>
        <p class="dek" id="d">${esc(entry.dek)}</p>
        <p class="meta"><b>C4 Studios</b><span>${entry.readMinutes ? `${entry.readMinutes} min read` : 'c4studios.com.au'}</span></p>
      </div>
    </body></html>`;

    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    /* Fit: step the title down, then the dek, until both clear the meta line. */
    const fits = await page.evaluate(() => {
      const t = document.getElementById('t');
      const d = document.getElementById('d');
      const over = () => d.getBoundingClientRect().bottom > 500;
      let size = 62;
      while (size > 44 && over()) { size -= 2; t.style.fontSize = `${size}px`; }
      let dsize = 24;
      while (dsize > 20 && over()) { dsize -= 1; d.style.fontSize = `${dsize}px`; }
      return !over();
    });
    if (!fits) throw new Error(`/${entry.slug}: title and dek don't fit the share card`);
    const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
    const file = path.join(OG_DIR, `${entry.slug}-og.jpg`);
    if (path.join(ROOT, 'public', entry.image) !== file) {
      throw new Error(`/${entry.slug}: image is ${entry.image}, expected /insights/${entry.slug}-og.jpg`);
    }
    const about = `Share card for c4studios.com.au/${entry.slug}/. The title is set in HTML (Archivo) and screenshotted by Playwright in scripts/article-photos.mjs; no type is generated. ${credit(p)}`;
    await sharp(png).withExif({ IFD0: { ImageDescription: about } }).jpeg({ quality: 86, mozjpeg: true }).toFile(file);
    console.log(`card: /${entry.slug}/ (${kb(file)} KB)`);
  }
  await browser.close();
}
