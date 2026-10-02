#!/usr/bin/env node
/**
 * capture-motion.mjs — the moving portfolio: scroll strips, hover clips and before/after heroes.
 *
 * For each case-study slug in SITES this writes, into public/captures/<folder>/motion/:
 *   scroll-desktop.webp   the page from the top at 1440 px wide, up to 6 viewports of 900 px
 *   scroll-mobile.webp    the same at 390x844 @2x, up to 7 viewports, then resized to 560 px wide
 *   play.mp4, play.webm   7 s at 960x600 (rendered at 1280x800): a one-second hold on the hero,
 *                         then an eased scroll of 2.5 viewports. Silent, 30 fps.
 *   play-poster.webp      the clip's first frame
 *   before-desktop.webp,  top viewport at 1440x900 of a Wayback Machine snapshot of the client's
 *   after-desktop.webp    earlier site, and of the live site; only where SITES[slug].before is set
 * then merges one entry per slug into src/data/portfolioMotion.json. An existing entry's
 * before.approved is kept, so a re-run never un-approves a slider Caleb has signed off.
 *
 * Run:  node scripts/capture-motion.mjs [slug ...] [--only scroll,play,before,frame] [--tmp dir]
 *       [--jobs 2] [--method full|stitch]
 * No slugs means every site in SITES. To add a site, give it an entry below (url, folder) and run
 * it alone. Needs Google Chrome installed (Playwright's own Chromium cannot play H.264 hero
 * videos) and ffmpeg on PATH.
 *
 * How the captures stay honest:
 * - Cookie banners are declined by clicking the site's own Decline/Reject button, then any banner
 *   left over is hidden for the capture. Nothing is ever accepted on the owner's behalf.
 * - Floating widgets (chat bubbles, WhatsApp, back-to-top, call bars, toasts) are hidden.
 * - Every capture first scrolls the page in steps so reveal animations and lazy images fire.
 * - Strips use one of two methods, set per site:
 *     'full'   one beyond-the-viewport screenshot. Exact geometry, no seams; fixed headers appear
 *              once at the top. 100vh heroes do not stretch in current Chrome (checked Oct 2026).
 *     'stitch' bands taken from 10-55% down the viewport as the page scrolls, with the header
 *              hidden after the first band and background video held still. For content that
 *              fades out again once it leaves the screen, and lines drawn by scrolling. Not for
 *              parallax heroes (the copy doubles at the joins) or screen-fixed textures (use
 *              stretchFixed with 'full').
 * - The clip runs on Playwright's paused clock: each frame advances page time, CSS and Web
 *   Animations by exactly 1/30 s and seeks each video to its exact frame, so it is smooth whatever
 *   the machine speed, and it starts only once the page has fully loaded. Scrolling is relative,
 *   like a wheel, so Chrome's scroll anchoring can absorb a slider changing height above the fold.
 *   A hero video that plays once and has already ended is rewound for the clip (DS Racing).
 *
 * Not in SITES on purpose (2 Oct 2026): jurassic-pt (until its redesign), wooster-core, barrys-drink,
 * jk-plumbing-solutions and sgr-prestige (being redesigned), people-power (hidden), rocksstream
 * (behind a login). Add them once they are ready.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const MANIFEST = path.join(ROOT, 'src', 'data', 'portfolioMotion.json');

const DESKTOP = { name: 'desktop', width: 1440, height: 900, scale: 1, viewports: 6 };
const MOBILE = { name: 'mobile', width: 390, height: 844, scale: 2, viewports: 7, outWidth: 560, mobile: true };
const CLIP = { name: 'clip', width: 1280, height: 800, scale: 1, outW: 960, outH: 600, fps: 30, seconds: 7, hold: 1, endHold: 0.8, travel: 2.5 };
const STRIP_Q = 72;
const HERO_Q = 80;
const CLIP_BUDGET = 1_000_000; /* bytes; CRF steps up until each encode fits */
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';

/*
 * Per-site settings. Only url and folder are required.
 *   method / mobileMethod   'full' (default) or 'stitch', see the header
 *   settle                  ms to wait after load (preloaders, late hero images); default 2500
 *   stepWait                ms between the priming scroll steps; default 260
 *   ready                   a JS expression to wait for before settling (e.g. preloader gone)
 *   hide                    extra selectors to hide in every capture
 *   keepInClip              selectors the floating-widget sweep must leave alone in the clip
 *   css                     extra CSS for captures only
 *   stretchFixed            selectors of fixed full-screen textures to spread down the whole page
 *                           in 'full' strips (otherwise they stop after the first screen)
 *   freeze                  pause page time before strip screenshots, for idle animations that
 *                           run per frame (headless Chrome renders far above 60 fps)
 *   before                  { ts, url, settle?, css? } of a Wayback snapshot of the client's earlier
 *                           site, or omitted. Only a snapshot that clearly shows a different, older
 *                           site and renders properly qualifies; say why in a comment when none does.
 *   skip                    assets not to produce (e.g. ['play']), with the reason in a comment
 */
const SITES = {
  'evidence-advisory': {
    url: 'https://evidenceadvisory.com.au',
    folder: 'evidenceadvisory-com-au',
    /* The WebGL phone in the hero turntables after 2.5 s idle, by a fixed step per frame. */
    freeze: true,
    before: { ts: '20260610215446', url: 'https://evidenceadvisory.com.au/' }, /* the old WordPress site, last capture before C4 */
  },
  'cia-solutions': {
    url: 'https://ciasolutions.com.au',
    folder: 'ciasolutions-com-au',
    before: { ts: '20251130080838', url: 'http://ciasolutions.com.au/' },
  },
  /* No before for Fremantle, Hakea, Sharp or HVN: the archive holds no 200 captures of those domains. */
  'transform-fremantle': { url: 'https://transformfreo.com/', folder: 'transformfreo-com' },
  /* No before: the 2017-23 captures are a Caringbah (NSW) plumber, apparently not this business,
     and render with broken CSS. */
  'aqua-safe-plumbing': { url: 'https://aquasafeplumbing.com.au/', folder: 'aquasafeplumbing-com-au' },
  'transform-hakea': { url: 'https://transformhakea.com', folder: 'transformhakea-com' },
  gocc: {
    url: 'https://gocc.com.au/',
    folder: 'gocc-com-au',
    /* Jul-Dec 2025 captures are a plainer WordPress build whose hero never renders in the archive. */
    before: { ts: '20250305000846', url: 'https://gocc.com.au/' },
  },
  'ds-racing-karts': {
    url: 'https://www.dsracingkarts.com.au/',
    folder: 'dsracingkarts-com-au',
    /* The History timeline fades each photo out again once it leaves the screen. */
    method: 'stitch',
    /* No before: the old Weebly/Square Online site (2024-25 captures) never renders in the archive. */
  },
  'sharp-bricklaying': { url: 'https://www.sharpbricklaying.com.au/', folder: 'sharpbricklaying-com-au' },
  'hvn-gym': { url: 'https://thehvncrossfit.com', folder: 'thehvncrossfit-com' },
  /* No before: the only capture (Dec 2024) is an unstyled WordPress placeholder. */
  'groverz-tax': { url: 'https://groverztax.com.au', folder: 'groverztax-com-au' },
  'tidy-gardens-australia': {
    url: 'https://tidygardens.com.au',
    folder: 'tidygardens-com-au',
    /* The vine in the left gutter is fixed to the screen and grows with scroll progress, so the strip
       shows only its first sprig. Stitching was tried: it invents a page-long vine, with breaks. */
    before: { ts: '20251105164937', url: 'http://tidygardens.com.au/' },
  },
  'brady-electrical': {
    url: 'https://bradyelectrical.com.au',
    folder: 'bradyelectrical-com-au',
    before: { ts: '20251111070704', url: 'https://bradyelectrical.com.au/' },
  },
  quotr: { url: 'https://quotr.us', folder: 'quotr-us' },
  iopa: {
    url: 'https://iopa-apparel.vercel.app',
    folder: 'iopa-apparel-vercel-app',
    /* The fixed full-screen grain only covers the first screen of a one-shot capture. (Stitching was
       tried: the hero's parallax doubles its copy at the band joins.) */
    stretchFixed: ['.grain'],
    keepInClip: ['.tuner'], /* THE TUNER, the radio-dial scrubber fixed to the bottom, is the site's signature */
  },
  'cmc-lawns': { url: 'https://cmc-lawns-concept.vercel.app', folder: 'cmc-lawns-concept-vercel-app' },
  eurochem: { url: 'https://eurochem-concept.vercel.app', folder: 'eurochem-concept-vercel-app' },
};

/* ---------- arguments ---------- */
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); if (i < 0) return null; const v = argv[i + 1]; argv.splice(i, 2); return v; };
const ONLY = new Set((flag('--only') || 'scroll,play,before,frame').split(','));
const TMP = path.resolve(flag('--tmp') || path.join(os.tmpdir(), 'c4-capture-motion'));
const CONCURRENCY = Number(flag('--jobs') || 2);
const METHOD = flag('--method'); /* force 'full' or 'stitch' for this run, to compare */
const slugs = argv.length ? argv : Object.keys(SITES);
for (const s of slugs) if (!SITES[s]) { console.error(`Unknown slug: ${s}\nKnown: ${Object.keys(SITES).join(', ')}`); process.exit(1); }
mkdirSync(TMP, { recursive: true });

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Perth', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const log = (slug, ...m) => console.log(`[${slug}]`, ...m);
const webPath = (abs) => `/${path.relative(PUBLIC, abs).split(path.sep).join('/')}`;

/* ---------- page helpers ---------- */
const CAPTURE_CSS = `
  html, body { scroll-behavior: auto !important; scroll-snap-type: none !important; }
  * { caret-color: transparent !important; }
  [data-cm-float]:not([data-cm-keep]), [data-cm-cookie] { display: none !important; }
  html[data-cm-hide-top] [data-cm-top] { visibility: hidden !important; opacity: 0 !important; }
`;

async function newPage(browser, device, { clock = false } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: device.width, height: device.height },
    deviceScaleFactor: device.scale,
    isMobile: !!device.mobile,
    hasTouch: !!device.mobile,
    userAgent: device.mobile ? MOBILE_UA : undefined,
    locale: 'en-AU',
    timezoneId: 'Australia/Perth',
    reducedMotion: 'no-preference',
    colorScheme: 'light',
  });
  /* An embedded form that grabs focus on load must not scroll the page under the camera (quotr). */
  await ctx.addInitScript(() => {
    const focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function f(opts) { return focus.call(this, { ...(opts || {}), preventScroll: true }); };
  });
  if (clock) await ctx.clock.install();
  const page = await ctx.newPage();
  return { ctx, page };
}

async function load(page, site, slug) {
  try {
    await page.goto(site.url, { waitUntil: 'load', timeout: 90000 });
  } catch (e) {
    log(slug, 'load did not finish:', e.message.split('\n')[0]);
  }
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  if (site.ready) await page.waitForFunction(site.ready, null, { timeout: 30000, polling: 250 }).catch(() => log(slug, 'ready condition timed out'));
  await page.waitForTimeout(site.settle ?? 2500);
  await page.addStyleTag({ content: CAPTURE_CSS + (site.css || '') });
  for (const sel of site.hide || []) await page.locator(sel).evaluateAll((els) => els.forEach((el) => el.setAttribute('data-cm-float', 'site'))).catch(() => {});
}

/** Click the site's own Decline/Reject button if a cookie banner offers one, then hide any banner left. */
async function declineCookies(page, slug) {
  const clicked = await page.evaluate(() => {
    const rx = /^(decline|decline all|reject|reject all|deny|refuse|no thanks|no, thanks|necessary only|only necessary|essential only|use necessary cookies only|accept necessary only|continue without accepting)$/i;
    const btns = [...document.querySelectorAll('button, [role="button"]')].filter((b) => rx.test((b.innerText || b.textContent || '').trim()) && b.getClientRects().length);
    const hit = btns.find((b) => {
      let n = b;
      for (let i = 0; i < 6 && n; i++, n = n.parentElement) if (/cookie|consent|tracking|analytics/i.test(n.innerText || '')) return true;
      return false;
    });
    if (!hit) return null;
    hit.click();
    return (hit.innerText || hit.textContent || '').trim();
  }).catch(() => null);
  if (clicked) { log(slug, `cookie banner: clicked "${clicked}"`); await page.waitForTimeout(700); }
  const hidden = await page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('body *')) {
      const s = getComputedStyle(el);
      if (s.position !== 'fixed' && s.position !== 'sticky') continue;
      const t = (el.innerText || '').toLowerCase();
      if (t.length && t.length < 900 && /\bcookies?\b|consent/.test(t) && el.getClientRects().length) { el.setAttribute('data-cm-cookie', ''); n++; }
    }
    return n;
  }).catch(() => 0);
  if (hidden) log(slug, `cookie banner: hid ${hidden} leftover element(s)`);
}

/**
 * Mark floating widgets: fixed elements that are neither a top bar nor full-screen, plus
 * bottom-anchored sticky bars. Run at several scroll positions, since some only appear later.
 */
async function markFloating(page, keep = []) {
  return page.evaluate((keepSel) => {
    const vw = innerWidth; const vh = innerHeight; const found = [];
    for (const sel of keepSel) document.querySelectorAll(sel).forEach((el) => el.setAttribute('data-cm-keep', ''));
    for (const el of document.querySelectorAll('body *')) {
      if (el.hasAttribute('data-cm-float') || el.closest('[data-cm-float],[data-cm-cookie]')) continue;
      const s = getComputedStyle(el);
      const fixed = s.position === 'fixed';
      const bottomSticky = s.position === 'sticky' && s.top === 'auto' && s.bottom !== 'auto';
      if (!fixed && !bottomSticky) continue;
      if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) < 0.05) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8 || r.right <= 0 || r.left >= vw || r.bottom <= 0 || r.top >= vh) continue;
      const topBar = r.top <= 4 && r.height < vh * 0.5;
      const fullScreen = r.width >= vw * 0.9 && r.height >= vh * 0.9;
      if (fixed && (topBar || fullScreen)) continue;
      el.setAttribute('data-cm-float', 'auto');
      found.push(`${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/).slice(0, 3).join('.')}` : ''} @${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}${el.hasAttribute('data-cm-keep') ? ' (kept)' : ''}`);
    }
    return found;
  }, keep).catch(() => []);
}

/** Mark bars that stick to the top of the viewport mid-page, so stitched bands after the first can hide them. */
async function markTopBars(page) {
  return page.evaluate(() => {
    const vw = innerWidth; const vh = innerHeight; const found = [];
    for (const el of document.querySelectorAll('body *')) {
      const s = getComputedStyle(el);
      if (s.position !== 'fixed' && s.position !== 'sticky') continue;
      if (el.closest('[data-cm-top]')) continue;
      const r = el.getBoundingClientRect();
      if (r.width < vw * 0.5 || r.height < 8 || r.height > vh * 0.5) continue;
      if (r.top > 4 || r.bottom <= 0) continue;
      el.setAttribute('data-cm-top', '');
      found.push(`${el.tagName.toLowerCase()} ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
    return found;
  }).catch(() => []);
}

async function scrollTo(page, y) {
  await page.evaluate((top) => {
    window.scrollTo({ top, left: 0, behavior: 'instant' });
    if (Math.abs(window.scrollY - top) > 2) { document.documentElement.scrollTop = top; document.body.scrollTop = top; }
  }, y);
}

async function docHeight(page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0));
}

/** Step down the page so reveals and lazy images fire, sweeping for floating widgets on the way. */
async function primePage(page, slug, site, limit, { keep = [], sweep = true } = {}) {
  const vh = await page.evaluate(() => innerHeight);
  const floating = new Set();
  const note = (arr) => arr.forEach((f) => floating.add(f));
  if (sweep) note(await markFloating(page, keep));
  const end = Math.min((await docHeight(page)) - vh, limit + vh);
  for (let y = 0; y < end;) {
    y = Math.min(end, y + Math.round(vh * 0.6));
    await scrollTo(page, y);
    await page.waitForTimeout(site.stepWait ?? 260);
    if (sweep) note(await markFloating(page, keep));
  }
  await page.waitForTimeout(700);
  await scrollTo(page, 0);
  await page.waitForTimeout(1400);
  if (sweep) note(await markFloating(page, keep));
  if (floating.size) log(slug, `hid floating: ${[...floating].join(' | ')}`);
}

/**
 * Pause Playwright's clock. It pauses every frame, and an iframe's clock (an embedded widget,
 * Stripe) can run a little ahead of the page's, so aim just past the latest of them.
 */
async function pauseClock(page) {
  const nows = await Promise.all(page.frames().map((f) => f.evaluate(() => Date.now()).catch(() => 0)));
  await page.clock.pauseAt(Math.max(...nows) + 50);
}

/** Wait until the scroll position holds still and the images on screen have decoded. */
async function settleView(page, min = 650) {
  await page.waitForTimeout(min);
  await page.evaluate(async () => {
    /* Real timers: the page's own may be paused by the clock. */
    const real = window.__playwright_builtins__ || window;
    const onScreen = () => [...document.images].filter((i) => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0; });
    for (let n = 0; n < 30 && onScreen().some((i) => !i.complete); n++) await new Promise((r) => real.setTimeout(r, 100));
    await Promise.all(onScreen().map((i) => (i.decode ? i.decode().catch(() => {}) : null)));
  }).catch(() => {});
}

/** Text or images between the first screen and the capture limit that are effectively invisible. */
async function fadedBelowFold(page, limit) {
  return page.evaluate((lim) => {
    const out = [];
    const opacity = (el) => { let o = 1; for (let n = el, i = 0; n && n.nodeType === 1 && i < 40; n = n.parentElement, i++) o *= Number(getComputedStyle(n).opacity); return o; };
    for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,img,figure,button,blockquote')) {
      const r = el.getBoundingClientRect();
      const y = r.top + window.scrollY;
      if (y < innerHeight || y > lim || r.width < 4 || r.height < 4) continue;
      if (el.tagName !== 'IMG' && !(el.innerText || '').trim()) continue;
      /* Closed accordions and tabs are meant to be hidden; skip anything inside a collapsed box. */
      let collapsed = false;
      for (let n = el.parentElement, i = 0; n && i < 12 && !collapsed; n = n.parentElement, i++) {
        const s = getComputedStyle(n);
        if (s.overflow !== 'visible' && n.getBoundingClientRect().height < 2) collapsed = true;
        if (n.getAttribute('aria-hidden') === 'true' || n.getAttribute('data-state') === 'closed' || n.hidden) collapsed = true;
      }
      if (collapsed) continue;
      if (opacity(el) < 0.1) out.push(`${el.tagName.toLowerCase()}@${Math.round(y)} "${(el.innerText || el.alt || '').trim().slice(0, 30)}"`);
    }
    return out;
  }, limit).catch(() => []);
}

/* ---------- strips ---------- */
async function captureStrip(browser, slug, site, device, outFile) {
  const { ctx, page } = await newPage(browser, device, { clock: !!site.freeze });
  try {
    await load(page, site, slug);
    await declineCookies(page, slug);
    const limit = device.height * device.viewports;
    await primePage(page, slug, site, limit);
    /* Stop page time at rest, before idle animations kick in (headless renders far above 60 fps). */
    if (site.freeze) await pauseClock(page);
    await declineCookies(page, slug);
    const H = await docHeight(page);
    const h = Math.min(H, limit);
    const method = METHOD || (device.mobile ? site.mobileMethod : null) || site.method || 'full';
    let png;
    let after = null;
    if (method === 'full') {
      await scrollTo(page, 0);
      await settleView(page, 900);
      const faded = await fadedBelowFold(page, h);
      if (faded.length) log(slug, `${device.name}: WARNING ${faded.length} element(s) below the fold are still faded out (reveals that reset?); try method 'stitch': ${faded.slice(0, 4).join(' | ')}`);
      /* A fixed full-screen texture only covers the first screen of a one-shot capture; spread it over the page. */
      for (const sel of site.stretchFixed || []) {
        await page.evaluate(({ s, docH }) => document.querySelectorAll(s).forEach((el) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty('position', 'absolute', 'important');
          el.style.setProperty('top', `${r.top}px`, 'important');
          el.style.setProperty('bottom', 'auto', 'important');
          el.style.setProperty('height', `${docH - 2 * r.top}px`, 'important');
        }), { s: sel, docH: H });
      }
      if (!device.mobile) after = await page.screenshot({ type: 'png' });
      png = await page.screenshot({ type: 'png', fullPage: true, clip: { x: 0, y: 0, width: device.width, height: h } });
    } else {
      ({ png, after } = await stitch(page, slug, device, H, h, !!site.freeze));
    }
    let img = sharp(png, { limitInputPixels: false });
    if (device.outWidth) img = sharp(await img.resize({ width: device.outWidth, kernel: 'lanczos3' }).png().toBuffer(), { limitInputPixels: false });
    const meta = await img.metadata();
    await img.webp({ quality: STRIP_Q, effort: 6, smartSubsample: true }).toFile(outFile);
    log(slug, `${device.name} strip (${method}): ${meta.width}x${meta.height}, page ${H}px, ${Math.round(statSync(outFile).size / 1024)} KB`);
    return { w: meta.width, h: meta.height, after, method };
  } finally {
    await ctx.close();
  }
}

/**
 * Stitched strip: the first band is the top 55% of the first screen (header included); every later
 * band is taken from 10% to 55% down the viewport. Content there has already crossed the reveal
 * triggers on its way up the screen, and lines that draw themselves to mid-screen as you scroll
 * (timelines, vines) are fully drawn through it.
 */
const BAND_TOP = 0.1;
const BAND_H = 0.45;
async function stitch(page, slug, device, H, h, freeze = false) {
  const vh = device.height;
  const k = device.scale;
  const bands = [{ s: 0, top: 0, height: Math.min(h, Math.round(vh * (BAND_TOP + BAND_H))), doc: 0 }];
  let b = bands[0].height;
  const maxScroll = Math.max(0, H - vh);
  while (b < h) {
    const height = Math.min(Math.round(vh * BAND_H), h - b);
    const s = Math.min(maxScroll, Math.max(0, b - Math.round(vh * BAND_TOP)));
    bands.push({ s, top: b - s, height, doc: b });
    b += height;
  }
  /*
   * Hold background video and endless loops (tickers, pulses) still, or neighbouring bands catch
   * different frames and the join shows. Finite animations (reveals) are left to run.
   */
  await page.evaluate(() => {
    document.querySelectorAll('video').forEach((v) => v.pause());
    for (const a of document.getAnimations()) {
      const t = a.effect && a.effect.getComputedTiming();
      if (t && t.iterations === Infinity) a.pause();
    }
  }).catch(() => {});
  await scrollTo(page, Math.round(vh * 1.5));
  await page.waitForTimeout(700);
  const tops = await markTopBars(page);
  if (tops.length) log(slug, `${device.name}: top bars hidden after band 1: ${tops.join(', ')}`);
  const pieces = [];
  let after = null;
  for (const [i, band] of bands.entries()) {
    if (freeze) await page.clock.resume();
    await page.evaluate((hide) => { if (hide) document.documentElement.setAttribute('data-cm-hide-top', ''); else document.documentElement.removeAttribute('data-cm-hide-top'); }, i > 0);
    await scrollTo(page, band.s);
    await settleView(page, i === 0 ? 900 : 650);
    if (freeze) await pauseClock(page);
    const shot = await page.screenshot({ type: 'png' });
    if (i === 0 && !device.mobile) after = shot;
    const piece = await sharp(shot).extract({ left: 0, top: band.top * k, width: device.width * k, height: band.height * k }).png().toBuffer();
    pieces.push({ input: piece, left: 0, top: band.doc * k });
  }
  await page.evaluate(() => document.documentElement.removeAttribute('data-cm-hide-top'));
  const png = await sharp({ create: { width: device.width * k, height: h * k, channels: 3, background: '#ffffff' }, limitInputPixels: false })
    .composite(pieces).png().toBuffer();
  return { png, after };
}

/* ---------- clip ---------- */
const easeInOutSine = (t) => (1 - Math.cos(Math.PI * t)) / 2;

async function captureClip(browser, slug, site, dir, tmp) {
  const { ctx, page } = await newPage(browser, CLIP, { clock: true });
  const frames = path.join(tmp, 'frames');
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  try {
    await load(page, site, slug);
    await declineCookies(page, slug);
    const travelMax = Math.round(CLIP.height * CLIP.travel);
    await primePage(page, slug, site, travelMax + CLIP.height, { keep: site.keepInClip || [] });
    await declineCookies(page, slug);
    const H = await docHeight(page);
    const travel = Math.min(travelMax, H - CLIP.height);
    await page.waitForTimeout(800);

    /* From here page time only moves when we move it. */
    await pauseClock(page);
    await page.evaluate(() => {
      const real = window.__playwright_builtins__ || window;
      window.__cmRealFrame = () => new Promise((r) => real.requestAnimationFrame(() => real.requestAnimationFrame(r)));
      const docTimeline = (a) => !a.timeline || a.timeline === document.timeline;
      window.__cmFreeze = () => { for (const a of document.getAnimations()) if (docTimeline(a) && a.playState === 'running') a.pause(); };
      window.__cmStep = async (dt, seconds) => {
        for (const a of document.getAnimations()) {
          if (!docTimeline(a)) continue;
          if (a.playState === 'running') a.pause();
          if (a.playState !== 'paused') continue;
          const t = (Number(a.currentTime) || 0) + dt * (a.playbackRate || 1);
          const end = a.effect ? a.effect.getComputedTiming().endTime : Infinity;
          if (Number.isFinite(end) && t >= end) a.finish(); else a.currentTime = t;
        }
        const seeks = [];
        for (const v of document.querySelectorAll('video')) {
          if (!v.__cm) { v.__cm = true; v.pause(); }
          if (!(v.readyState >= 1) || !Number.isFinite(v.duration) || v.duration <= 0) continue;
          if (v.__cmT0 === undefined) v.__cmT0 = v.currentTime - seconds;
          /*
           * Seek to the exact clip time, just past the frame boundary. Adding whole milliseconds
           * lands a hair before boundaries at 30 fps and repeats one frame while skipping the next.
           */
          let t = v.__cmT0 + seconds + 0.002;
          if (t >= v.duration) t = v.loop ? t % v.duration : v.duration - 0.001;
          /* 'seeked' fires before the new frame reaches the screen; wait for it to be presented. */
          seeks.push(new Promise((res) => {
            let fin = false;
            const done = () => { if (!fin) { fin = true; res(); } };
            v.addEventListener('seeked', () => (v.requestVideoFrameCallback ? v.requestVideoFrameCallback(() => done()) : done()), { once: true });
            v.currentTime = t;
            real.setTimeout(done, 250);
          }));
        }
        await Promise.all(seeks);
      };
      window.__cmFreeze();
      document.querySelectorAll('video').forEach((v) => { v.__cm = true; v.pause(); });
    });
    /*
     * A hero video that plays once (DS Racing's 7 s intro) has finished by now. Rewind it, so the
     * clip shows what a visitor sees on arrival rather than its last frame.
     */
    const rewound = await page.evaluate(async () => {
      let n = 0;
      for (const v of document.querySelectorAll('video')) {
        const r = v.getBoundingClientRect();
        if (v.loop || r.top >= innerHeight || r.bottom <= 0 || !(v.duration > 0) || v.currentTime < v.duration - 0.25) continue;
        await new Promise((res) => { v.addEventListener('seeked', res, { once: true }); v.currentTime = 0; (window.__playwright_builtins__ || window).setTimeout(res, 1500); });
        /* Sites often fade the video out when it ends (DS Racing does); on arrival it is showing. */
        if (Number(getComputedStyle(v).opacity) < 0.5) {
          v.style.setProperty('transition', 'none', 'important');
          v.style.setProperty('opacity', '1', 'important');
        }
        n++;
      }
      return n;
    });
    if (rewound) log(slug, `clip: rewound ${rewound} finished hero video(s) to the start`);
    /* Each video's time at clip frame 0; later frames seek to this plus i/30 s exactly. */
    await page.evaluate(() => document.querySelectorAll('video').forEach((v) => { v.__cmT0 = v.currentTime; }));
    const cdp = await ctx.newCDPSession(page);
    const total = CLIP.fps * CLIP.seconds;
    const holdF = Math.round(CLIP.hold * CLIP.fps);
    const moveF = total - holdF - Math.round(CLIP.endHold * CLIP.fps);
    let ticks = 0;
    let last = 0;
    const nudges = [];
    for (let i = 0; i < total; i++) {
      const p = i < holdF ? 0 : Math.min(1, (i - holdF) / moveF);
      const target = Math.round(travel * easeInOutSine(p));
      /*
       * Relative steps, the way a wheel scrolls. When a slider changes height above the fold,
       * Chrome's scroll anchoring holds the visible content still; an absolute scrollTo would
       * undo that and make the page jump.
       */
      const delta = target - last;
      last = target;
      const expected = await page.evaluate((d) => {
        const y0 = window.scrollY;
        if (d) window.scrollBy({ top: d, left: 0, behavior: 'instant' });
        const max = document.documentElement.scrollHeight - innerHeight;
        return Math.min(max, Math.max(0, y0 + d));
      }, delta);
      if (i > 0) {
        const next = Math.round((i * 1000) / CLIP.fps);
        const dt = next - ticks;
        ticks = next;
        await page.clock.runFor(dt);
        await page.evaluate(([d, sec]) => window.__cmStep(d, sec), [dt, i / CLIP.fps]);
      }
      await page.evaluate(() => window.__cmRealFrame());
      await page.evaluate(() => window.__cmFreeze());
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
      writeFileSync(path.join(frames, `${String(i).padStart(4, '0')}.png`), Buffer.from(data, 'base64'));
      /* Anchoring nudges are normal; a smooth-scroll library fighting the camera shows up as many. */
      const actual = await page.evaluate(() => window.scrollY);
      if (Math.abs(actual - expected) > 1) nudges.push(Math.round(actual - expected));
    }
    const nudgeNote = nudges.length ? `, page moved itself on ${nudges.length} frame(s) (${nudges.slice(0, 6).join(', ')} px)${nudges.length > 8 ? ' WARNING: check the clip for judder' : ''}` : '';
    log(slug, `clip: ${total} frames, travel ${travel}px of ${H}px${nudgeNote}`);
  } finally {
    await ctx.close();
  }
  return encodeClip(slug, frames, dir);
}

function ffmpeg(args) {
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr}`);
}

async function encodeClip(slug, frames, dir) {
  const input = ['-framerate', String(CLIP.fps), '-i', path.join(frames, '%04d.png')];
  const vf = ['-vf', `scale=${CLIP.outW}:${CLIP.outH}:flags=lanczos,format=yuv420p`];
  const mp4 = path.join(dir, 'play.mp4');
  const webm = path.join(dir, 'play.webm');
  let crf = 28;
  for (;;) {
    ffmpeg([...input, ...vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-profile:v', 'high', '-movflags', '+faststart', '-an', '-r', String(CLIP.fps), mp4]);
    if (statSync(mp4).size <= CLIP_BUDGET || crf >= 34) break;
    crf += 2;
  }
  let vcrf = 38;
  for (;;) {
    ffmpeg([...input, ...vf, '-c:v', 'libvpx-vp9', '-crf', String(vcrf), '-b:v', '0', '-deadline', 'good', '-cpu-used', '1', '-row-mt', '1', '-an', '-r', String(CLIP.fps), webm]);
    if (statSync(webm).size <= CLIP_BUDGET || vcrf >= 46) break;
    vcrf += 3;
  }
  const poster = path.join(dir, 'play-poster.webp');
  await sharp(path.join(frames, '0000.png')).resize(CLIP.outW, CLIP.outH, { kernel: 'lanczos3' }).webp({ quality: HERO_Q, effort: 6 }).toFile(poster);
  log(slug, `clip: mp4 ${Math.round(statSync(mp4).size / 1024)} KB (crf ${crf}), webm ${Math.round(statSync(webm).size / 1024)} KB (crf ${vcrf}), poster ${Math.round(statSync(poster).size / 1024)} KB`);
  return { mp4, webm, poster, crf, vcrf };
}

/* ---------- before / after ---------- */
async function captureBefore(browser, slug, site, outFile) {
  const { ctx, page } = await newPage(browser, DESKTOP);
  try {
    const url = `https://web.archive.org/web/${site.before.ts}if_/${site.before.url}`;
    await page.goto(url, { waitUntil: 'load', timeout: 120000 }).catch((e) => log(slug, 'wayback load:', e.message.split('\n')[0]));
    /* A redirect to a neighbouring capture drops if_ and brings the toolbar back; go round again. */
    const landed = page.url();
    const m = landed.match(/web\.archive\.org\/web\/(\d+)\/(.+)$/);
    if (m) await page.goto(`https://web.archive.org/web/${m[1]}if_/${m[2]}`, { waitUntil: 'load', timeout: 120000 }).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(site.before.settle ?? 4000);
    await page.addStyleTag({ content: CAPTURE_CSS + (site.before.css || '') });
    await declineCookies(page, slug);
    await markFloating(page);
    await scrollTo(page, 0);
    await settleView(page, 800);
    await sharp(await page.screenshot({ type: 'png' })).webp({ quality: HERO_Q, effort: 6 }).toFile(outFile);
    log(slug, `before: ${site.before.ts} -> ${Math.round(statSync(outFile).size / 1024)} KB`);
  } finally {
    await ctx.close();
  }
}

/* ---------- framing check ---------- */
function frameCheck(url) {
  const r = spawnSync('curl', ['-sIL', '--max-time', '30', '-w', '\nFINAL_URL:%{url_effective}', url], { encoding: 'utf8' });
  const out = r.stdout || '';
  const finalUrl = (out.match(/FINAL_URL:(\S+)/) || [])[1] || url;
  const blocks = out.split(/\r?\n\r?\n/).filter((x) => /^HTTP\//.test(x.trim()));
  const last = (blocks[blocks.length - 1] || '').trim().split(/\r?\n/).slice(1);
  const headers = last.map((l) => { const i = l.indexOf(':'); return [l.slice(0, i).trim().toLowerCase(), l.slice(i + 1).trim()]; }).filter(([k]) => k);
  for (const [k, v] of headers.filter(([name]) => name === 'content-security-policy')) {
    const fa = v.split(';').map((d) => d.trim()).find((d) => /^frame-ancestors\b/i.test(d));
    if (fa) {
      const sources = fa.split(/\s+/).slice(1);
      const ok = sources.some((src) => src === '*' || src === 'https:' || /c4studios\.com\.au/.test(src));
      return { finalUrl, frameable: ok, frameHeader: `${k}: ${fa}` };
    }
  }
  const xfo = headers.find(([k]) => k === 'x-frame-options');
  if (xfo && /deny|sameorigin/i.test(xfo[1])) return { finalUrl, frameable: false, frameHeader: `x-frame-options: ${xfo[1]}` };
  return { finalUrl, frameable: true, frameHeader: null };
}

/* ---------- per site ---------- */
async function runSite(browser, slug) {
  const site = SITES[slug];
  const dir = path.join(PUBLIC, 'captures', site.folder, 'motion');
  if (!existsSync(path.dirname(dir))) throw new Error(`no capture folder public/captures/${site.folder}`);
  mkdirSync(dir, { recursive: true });
  const tmp = path.join(TMP, slug);
  mkdirSync(tmp, { recursive: true });
  const skip = new Set(site.skip || []);
  const prev = readManifest()[slug] || {};
  const entry = {
    liveUrl: prev.liveUrl || site.url,
    capturedOn: today,
    scroll: prev.scroll || { desktop: null, mobile: null },
    play: prev.play ?? null,
    frameable: prev.frameable ?? null,
    frameHeader: prev.frameHeader ?? null,
    before: prev.before ?? null,
  };
  if (ONLY.has('frame')) {
    const f = frameCheck(site.url);
    Object.assign(entry, { liveUrl: f.finalUrl, frameable: f.frameable, frameHeader: f.frameHeader });
    log(slug, `frame: ${f.frameable ? 'frameable' : 'blocked'} ${f.frameHeader || '(no blocking header)'}`);
    writeEntry(slug, entry);
  }
  let afterPng = null;
  if (ONLY.has('scroll')) {
    for (const device of [DESKTOP, MOBILE]) {
      const file = path.join(dir, `scroll-${device.name}.webp`);
      if (skip.has(`scroll-${device.name}`)) { entry.scroll[device.name] = null; rmSync(file, { force: true }); continue; }
      const r = await captureStrip(browser, slug, site, device, file);
      entry.scroll[device.name] = { src: webPath(file), w: r.w, h: r.h };
      if (r.after) afterPng = r.after;
      writeEntry(slug, entry); /* after every asset, so a later failure leaves the manifest true */
    }
  }
  if (ONLY.has('play')) {
    if (skip.has('play')) {
      entry.play = null;
      for (const f of ['play.mp4', 'play.webm', 'play-poster.webp']) rmSync(path.join(dir, f), { force: true });
    } else {
      const c = await captureClip(browser, slug, site, dir, tmp);
      entry.play = { mp4: webPath(c.mp4), webm: webPath(c.webm), poster: webPath(c.poster), w: CLIP.outW, h: CLIP.outH, seconds: CLIP.seconds };
    }
    writeEntry(slug, entry);
  }
  if (ONLY.has('before')) {
    const beforeFile = path.join(dir, 'before-desktop.webp');
    const afterFile = path.join(dir, 'after-desktop.webp');
    if (!site.before) {
      entry.before = null;
      rmSync(beforeFile, { force: true });
      rmSync(afterFile, { force: true });
    } else {
      await captureBefore(browser, slug, site, beforeFile);
      if (!afterPng) {
        /* No strip this run: shoot the live top screen the same way the desktop strip would. */
        const { ctx, page } = await newPage(browser, DESKTOP, { clock: !!site.freeze });
        try {
          await load(page, site, slug);
          await declineCookies(page, slug);
          await primePage(page, slug, site, DESKTOP.height * 2);
          if (site.freeze) await pauseClock(page);
          await declineCookies(page, slug);
          await scrollTo(page, 0);
          await settleView(page, 900);
          afterPng = await page.screenshot({ type: 'png' });
        } finally { await ctx.close(); }
      }
      await sharp(afterPng).webp({ quality: HERO_Q, effort: 6 }).toFile(afterFile);
      const [, y, mo, d] = site.before.ts.match(/^(\d{4})(\d{2})(\d{2})/);
      entry.before = {
        src: webPath(beforeFile),
        after: webPath(afterFile),
        w: DESKTOP.width,
        h: DESKTOP.height,
        archivedOn: `${y}-${mo}-${d}`,
        archiveUrl: `https://web.archive.org/web/${site.before.ts}/${site.before.url}`,
        approved: prev.before && prev.before.archivedOn === `${y}-${mo}-${d}` ? !!prev.before.approved : false,
      };
    }
  }
  writeEntry(slug, entry);
  return entry;
}

/* ---------- manifest ---------- */
function readManifest() {
  try { return JSON.parse(readFileSync(MANIFEST, 'utf8')); } catch { return {}; }
}
function writeEntry(slug, entry) {
  const all = readManifest();
  all[slug] = entry;
  const ordered = {};
  for (const s of Object.keys(SITES)) if (all[s]) ordered[s] = all[s];
  for (const s of Object.keys(all)) if (!ordered[s]) ordered[s] = all[s];
  writeFileSync(MANIFEST, `${JSON.stringify(ordered, null, 2)}\n`);
}

/* ---------- main ---------- */
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--headless=new', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--force-color-profile=srgb'],
});
const queue = [...slugs];
const failures = [];
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
  while (queue.length) {
    const slug = queue.shift();
    const t0 = Date.now();
    try {
      await runSite(browser, slug);
      log(slug, `done in ${Math.round((Date.now() - t0) / 1000)} s`);
    } catch (e) {
      failures.push(slug);
      log(slug, 'FAILED:', e.stack || e.message);
    }
  }
}));
await browser.close();
if (failures.length) { console.error(`Failed: ${failures.join(', ')}`); process.exit(1); }
