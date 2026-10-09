/* The rasters behind two of the home page's four door faces
   (src/components/home/FourDoors.jsx). The SEO and Logo Design faces are
   drawn in code and carry none.

     node scripts/door-faces.mjs --masters <door-masters> --sharp "<Sharp Bricklaying/images>" [--capture]

   --masters  where the hero captures of the three client sites live. They're
              kept outside the repo and never committed. On Caleb's PC:
              C4-Internal/door-masters/ (made 9 Oct 2026).
   --capture  takes those captures again first, from the live sites: 1440 x 900
              at 2x in headless Chromium, the site's own Decline button clicked
              if a cookie banner offers one (never Accept), and floating widgets
              hidden. The same rules as scripts/capture-motion.mjs.
   --sharp    the Sharp Bricklaying site repo's images/ folder, as for
              scripts/lens-work.mjs. The Lens face is the "number 4" corner
              photo, the same April 2026 file /Lens shows as corner-*.

   What it writes, into src/components/home/assets/doors/:
     strip-<site>-<w>.avif and .webp
                A slice of each client's home page hero, nearly its full width:
                the headline, its intro and whatever image sits beside them,
                with no panel cut off at the side. FourDoors stacks the three
                slices edge to edge at the face's width, and their headlines
                start on the same margin as the door's label and title.
     lens-corner-<w>.avif and .webp
                The corner photo at about 0.9 to 1, the shape of the face below
                its ink band.
   Every file carries its origin in its EXIF ImageDescription. No image model
   is involved anywhere.

   Crops are in the 2x capture's pixels (2880 x 1800). If a client changes
   their hero, re-capture, measure the hero's eyebrow, h1, intro and buttons
   in the live page, and move the box so it still ends on a whole block and
   the h1 still starts 7.2% of the width in. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'components', 'home', 'assets', 'doors');

/* Each slice runs from just under the hero's eyebrow to just above its
   buttons, so it holds the whole headline and its intro and never cuts a
   line of text. All three are 2756 wide, the widest cut that lets every
   headline start 7.2% in (the face's own margin, where the door's label
   and title start) while Brady's map card and switch stay whole: Aqua-Safe
   and Tidy Gardens set their h1 at x 160 and Brady at x 112 (site px), so
   the lefts differ. Boxes measured from the live DOM at 1440 x 900 on
   9 Oct 2026, doubled here for the 2x capture. */
const SITES = [
  {
    key: 'aquasafe', url: 'https://aquasafeplumbing.com.au/', master: 'aquasafeplumbing-com-au.png',
    crop: { left: 122, top: 376, width: 2756, height: 816 },
    about: 'Aqua-Safe Plumbing home page hero (aquasafeplumbing.com.au), a site C4 Studios built.',
  },
  {
    key: 'brady', url: 'https://bradyelectrical.com.au', master: 'bradyelectrical-com-au.png',
    crop: { left: 26, top: 452, width: 2756, height: 876 },
    about: 'Brady Electrical home page hero (bradyelectrical.com.au), a site C4 Studios built.',
  },
  {
    key: 'tidy', url: 'https://tidygardens.com.au', master: 'tidygardens-com-au.png',
    crop: { left: 122, top: 470, width: 2756, height: 668 },
    about: 'Tidy Gardens Australia home page hero (tidygardens.com.au), a site C4 Studios built.',
  },
];
const STRIP_WIDTHS = [480, 720, 960];

const LENS = {
  src: 'number 4/WhatsApp Image 2026-04-26 at 1.41.25 AM.jpeg',
  /* the full height, 1388 wide from 79 in: the corner sits a little left of
     centre and the shadowed slab runs along the foot, where the title sits */
  crop: { left: 79, top: 0, width: 1388, height: 1536 },
  widths: [360, 540, 720, 960],
  about: 'Sharp Bricklaying brickwork in late light, April 2026. C4 Lens.',
};

/* ── arguments ─────────────────────────────────────────────────────── */
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const MASTERS = opt('--masters');
const SHARP = opt('--sharp');
if (!MASTERS && !SHARP) {
  console.error('Pass --masters <door-masters> and/or --sharp "<Sharp Bricklaying/images>".');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });
const kb = (f) => `${Math.round(fs.statSync(f).size / 1024)} KB`;
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Perth', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

/* ── capture ───────────────────────────────────────────────────────── */
async function capture() {
  const { chromium } = await import('playwright');
  fs.mkdirSync(MASTERS, { recursive: true });
  const browser = await chromium.launch({ args: ['--hide-scrollbars', '--mute-audio', '--force-color-profile=srgb'] });
  for (const site of SITES) {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'en-AU',
      timezoneId: 'Australia/Perth', colorScheme: 'light', bypassCSP: true,
    });
    const page = await ctx.newPage();
    await page.goto(site.url, { waitUntil: 'load', timeout: 90000 }).catch((e) => console.log(site.key, e.message.split('\n')[0]));
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3500);
    await page.addStyleTag({ content: '* { caret-color: transparent !important; } [data-df-hide] { display: none !important; }' });
    await page.evaluate(() => {
      const rx = /^(decline|decline all|reject|reject all|deny|refuse|no thanks|necessary only|only necessary|essential only)$/i;
      const hit = [...document.querySelectorAll('button, [role="button"]')].find((b) => rx.test((b.innerText || '').trim()) && b.getClientRects().length);
      if (hit) hit.click();
      for (const el of document.querySelectorAll('body *')) {
        const s = getComputedStyle(el);
        if (s.position !== 'fixed') continue;
        const r = el.getBoundingClientRect();
        const topBar = r.top <= 4 && r.height < innerHeight * 0.5;
        const full = r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.9;
        if (!topBar && !full && r.width > 8 && r.height > 8) el.setAttribute('data-df-hide', '');
      }
    });
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(MASTERS, site.master) });
    console.log(`captured ${site.url} -> ${site.master}`);
    await ctx.close();
  }
  await browser.close();
}

/* ── cuts ──────────────────────────────────────────────────────────── */
async function cut(input, crop, widths, name, about) {
  const buf = await sharp(input).rotate().extract(crop).toBuffer();
  const exif = { IFD0: { ImageDescription: about } };
  const made = [];
  for (const w of widths) {
    if (w > crop.width) continue;
    const base = path.join(OUT, `${name}-${w}`);
    const img = sharp(buf).resize({ width: w, kernel: 'lanczos3' });
    await img.clone().withExif(exif).avif({ quality: 52, effort: 6 }).toFile(`${base}.avif`);
    await img.clone().withExif(exif).webp({ quality: 78, effort: 6 }).toFile(`${base}.webp`);
    made.push(`${w} (${kb(`${base}.avif`)} avif, ${kb(`${base}.webp`)} webp)`);
  }
  console.log(`${name}: ${made.join(', ')}`);
}

if (MASTERS) {
  if (args.includes('--capture')) await capture();
  for (const site of SITES) {
    const master = path.join(MASTERS, site.master);
    if (!fs.existsSync(master)) { console.error(`missing ${master}; run with --capture`); process.exit(1); }
    const taken = fs.statSync(master).mtime;
    const when = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Perth', day: 'numeric', month: 'long', year: 'numeric' }).format(taken);
    await cut(master, site.crop, STRIP_WIDTHS, `strip-${site.key}`,
      `${site.about} Captured from the live site at 1440 x 900 at 2x on ${when}. Cut by scripts/door-faces.mjs.`);
  }
}
if (SHARP) {
  await cut(path.join(SHARP, LENS.src), LENS.crop, LENS.widths, 'lens-corner', `${LENS.about} Home page door cut by scripts/door-faces.mjs.`);
}
console.log(`done ${today}`);
