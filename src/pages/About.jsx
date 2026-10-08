/*
 * /About — the bench tour. Rebuilt 29 September 2026 (impeccable surface round,
 * seed 85d9931f; Caleb locked "The bench tour").
 *
 * THESIS: the page is Caleb's bench, and scrolling walks a camera across it;
 * each part of the story is an object you read. It refuses the
 * portrait-plus-values-grid About page.
 * OWN-WORLD: the site's bench (warm ground, ink, one red that means start).
 * Real objects lie on it: his portrait print, an open notebook, proof prints
 * of real client sites and one labelled concept, a pile of promise cards, a
 * folded run sheet, and a Bible open at Daniel 3. Paper is drawn as raster plates
 * (scripts/bench-plates.mjs); every word on it is set in HTML.
 * STORY: a first-time visitor learns who does the work, sees the work itself,
 * reads what they can hold him to, then starts a conversation.
 * FIRST VIEWPORT: h1 and lede on the left; in the free space, the bench from
 * above: the portrait print, lit, with the notebook and a stack of real site
 * captures beside it. On a phone the bench is a band pinned under the nav
 * and the words scroll beneath it.
 * FORM: the bench tour, third of my seven, dealt second. Seed 85d9931f.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the
 * finish review, the verdict, DESIGN.md, and every shipping raster carrying
 * its provenance.
 *
 * Static first: the prerender and reduced motion get a composed flat page,
 * every word in the column and each object as a still beside its own
 * section. Motion arms only outside both, and never hides content that the
 * static page shows. Armed and wide, the objects carry what they show at
 * reading size (the notes, each promise, each step, the verse), so the
 * column keeps those for screen readers only; in the band the column keeps
 * everything except the verse, which the band reads close.
 *
 * Copy: the facts of the previous page, rewritten to the house voice. Caleb's
 * rulings of 29 Sep 2026 bind: C4 Studios is just Caleb (sole operator), and
 * this page keeps "completing a Juris Doctor (JD) in Law" although every other
 * page says "partway through a law degree". "A website is 30% of the job" had
 * no source and is gone. Scripture comes only from
 * src/components/about/daniel.js, which is generated and verified.
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import gsap from 'gsap';
import Lenis from 'lenis';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import useStaticMode from '@/hooks/useStaticMode';
import { breadcrumbSchema, organizationSchema, personSchema } from '@/lib/schema';
import { NOTEBOOK, CARD, SHEET, BIBLE } from '../components/about/plates';
import { DANIEL_3, DANIEL_4 } from '../components/about/daniel';
import '../components/about/bench-tour.css';

/* ── The words ─────────────────────────────────────────────────────── */

const GLANCE = [
  { k: 'Work', v: 'Websites, web apps and the systems behind them. The whole arc: strategy, design, build, hosting, security and upkeep.' },
  { k: 'Study', v: 'Juris Doctor (JD) in Law, in progress.' },
  { k: 'Service', v: 'Children’s ministry leader at Barnabas Christian Fellowship. Camp Kids Jam, remote community work in Leonora and outreach in Manila. Founder of tutoring initiatives including The Learning Frontier.' },
  { k: 'Approach', v: 'Direct collaboration and careful architecture, with finance and data modelling for churches and community groups.' },
];

const YEARS = [
  { y: '2022', t: 'C4 Studios begins', d: 'Founded in Perth as a one-person studio with one rule: the person you brief is the person who builds.' },
  /* Private AI went to C4Site with C4i on 9 Oct 2026. */
  { y: 'Today', t: 'Three services, still one person', d: 'Websites and apps, photography and video, SEO and copywriting.' },
];

/* The work on the bench: client sites from
   src/components/portfolio/caseStudyData.jsx, and one unofficial concept,
   labelled as one everywhere it appears and linked to its own live site
   (which carries its own disclaimer), never to a case study. Caleb chose
   these on 29 Sep 2026. */
const WORK = [
  { name: 'Evidence Advisory', year: '2026', slug: 'evidence-advisory', img: '/captures/evidenceadvisory-com-au/desktop/01-hero-800.webp' },
  { name: 'Transform Fremantle', year: '2026', slug: 'transform-fremantle', img: '/captures/transformfreo-com/desktop/01-hero-800.webp' },
  { name: 'WA Police Force', year: 'Unofficial concept', slug: 'wapf-concept', href: 'https://wapf-concept.vercel.app', img: '/captures/wapf-concept-vercel-app/desktop/01-hero-800.webp' },
  { name: 'Aqua-Safe Plumbing', year: '2026', slug: 'aqua-safe-plumbing', img: '/captures/aquasafeplumbing-com-au/desktop/01-hero-800.webp' },
  { name: 'Sharp Bricklaying', year: '2026', slug: 'sharp-bricklaying', img: '/captures/sharpbricklaying-com-au/desktop/01-hero-800.webp' },
  { name: 'DS Racing Karts', year: '2025–26', slug: 'ds-racing-karts', img: '/captures/dsracingkarts-com-au/desktop/01-hero-800.webp' },
];

const PROMISES = [
  { t: 'Engineering first', s: 'It works first, then it looks good.', d: 'Every site and system is built on solid engineering, with performance you can measure. Polish comes once that foundation is right.' },
  { t: 'Direct, always', s: 'You talk to the person doing the work.', d: 'No account managers and no handoff. From the first call to the final deploy, you work with me.' },
  { t: 'Look past the symptom', s: 'Fix the process that causes it.', d: 'I look at the whole operation: where time leaks and what repeats. Then I build a system that keeps paying off, so the same problem stops coming back.' },
  { t: 'You keep the keys', s: 'You own everything I build.', d: 'You get the full code handed over, and the accounts and the data stay yours. There’s no lock-in, and no monthly fee to reach your own work.' },
];

const STEPS = [
  { t: 'Conversation', d: 'A real call, where I learn how the business runs and what you need from it.' },
  { t: 'Scope and quote', d: 'A fixed scope with a clear price, agreed before anything starts.' },
  { t: 'Design and build', d: 'You see progress as it happens, with checkpoints to approve direction.' },
  { t: 'Launch and handover', d: 'Deployment and documentation, then full ownership handed to you, with support while you settle in.' },
];

const VERSE = `“${DANIEL_3[24]}”`;

/* ── The bench: where things lie (world px) and where the camera goes ─ */

/* At or above this width the words take a column and the camera works the
   free space beside it; below it the bench is a band pinned over the words. */
const WIDE_MIN = 1180;

const PRINT_W = 640;
const PRINT_H = 454;
const PORTRAIT = { x: -310, y: -406, w: 620, h: 812, r: -3 };
const NOTE_AT = { x: 460, y: -770, r: 3 };
/* Three client proofs dropped beside the portrait, bottom to top: the
   establishing shot's stack. */
const STACK = [
  { i: 3, x: 600, y: 330, r: -7 },
  { i: 1, x: 668, y: 372, r: 4.5 },
  { i: 0, x: 612, y: 432, r: -1.5 },
];
/* The six laid out to be looked at, top-left corners, in WORK's order.
   Evidence Advisory and Aqua-Safe take the middle column, which both work
   stops frame. */
const SPREAD = [
  { x: 2650, y: -500, r: 2.5 },
  { x: 1950, y: -480, r: -4 },
  { x: 3450, y: -470, r: -2 },
  { x: 2690, y: 80, r: -3.5 },
  { x: 1990, y: 60, r: 3 },
  { x: 3470, y: 50, r: 1.5 },
];
const SPREAD_C = SPREAD.map((p) => ({ x: p.x + PRINT_W / 2, y: p.y + PRINT_H / 2 }));
/* The promise cards: centres. The open one is dealt forward; the rest lie in
   a pile, the card last put down on top. PILE runs from the top down. */
const CARD_ON = { x: 1500, y: 1900, r: -1 };
const PILE = [
  { x: 2000, y: 1880, r: -4 },
  { x: 2028, y: 1860, r: 3 },
  { x: 1992, y: 1896, r: -1 },
  { x: 2022, y: 1872, r: 6 },
];
const SHEET_AT = { x: 2980, y: 1650, r: -1 };
const BIBLE_AT = { x: 4300, y: 700, r: 1.2 };

/* Poses are framed for a reference view (the 692x900 clear space right of
   the column's fade at 1440 wide; 375 x 46svh for the band) and scaled to
   the real one in measure(). The run-sheet rows and verse 25 are found on
   the page at measure time. */
const POSES = {
  wide: {
    open: { x: 595, y: 57, z: 0.36, tilt: 8, rot: -2 },
    who: { x: 980, y: -420, z: 0.64, tilt: 20, rot: 1.5 },
    workA: { x: 2620, y: 17, z: 0.5, tilt: 22, rot: -2 },
    workB: { x: 3420, y: 17, z: 0.5, tilt: 22, rot: 1.5 },
    promise: { x: 1765, y: 1890, z: 0.66, tilt: 16, rot: -1 },
    step: { x: 3420, y: 1900, z: 0.74, tilt: 18, rot: 0.6 },
    verse: { x: 5500, y: 1000, z: 1.02, tilt: 12, rot: -0.8 },
    out: { x: 5100, y: 1290, z: 0.42, tilt: 6, rot: 0 },
  },
  band: {
    open: { x: 595, y: 57, z: 0.19, tilt: 6, rot: -2 },
    who: { x: 980, y: -420, z: 0.34, tilt: 14, rot: 1.5 },
    workA: { x: 2620, y: 17, z: 0.26, tilt: 16, rot: -2 },
    workB: { x: 3370, y: 17, z: 0.25, tilt: 16, rot: 1.5 },
    promise: { x: 1770, y: 1890, z: 0.35, tilt: 12, rot: -1 },
    step: { x: 3420, y: 1900, z: 0.4, tilt: 12, rot: 0.6 },
    verse: { x: 5500, y: 1000, z: 1.0, tilt: 8, rot: -0.8 },
    out: { x: 5100, y: 1290, z: 0.21, tilt: 4, rot: 0 },
  },
};

/* Where each pose is reached: [element, point within it]. Wide holds a pose
   while that point sits mid-screen; the band arrives as the element's top
   reaches the reading area. */
const STOPS = [
  { pose: 'open', wide: ['[data-ch="0"]', 0], band: ['[data-ch="0"]', 0] },
  { pose: 'who', wide: ['[data-ch="1"]', 0.5], band: ['#bt-who', 0] },
  { pose: 'workA', wide: ['[data-ch="2"]', 0.3], band: ['#bt-where', 0] },
  { pose: 'workB', wide: ['[data-ch="2"]', 0.76], band: ['.bt-worklist', 0] },
  { pose: 'promise', wide: ['[data-ch="3"]', 0.5], band: ['#bt-promise', 0] },
  ...STEPS.map((_, i) => ({ pose: `step${i}`, wide: [`.bt-steps > li:nth-child(${i + 1})`, 0.5], band: [`.bt-steps > li:nth-child(${i + 1})`, 0] })),
  { pose: 'verse', wide: ['[data-ch="5"]', 0.5], band: ['#bt-name', 0] },
  { pose: 'out', wide: ['.bt-close', 0.25], band: ['.bt-close', 0] },
];
const FOCUS = { wide: 0.5, band: 0.8 };
/* The share of each leg the camera spends travelling: wide moves between
   chapters, the band waits until the words it is showing are read. Down the
   run sheet the band's steps sit close together, so it glides instead. */
const TRAVEL = { wide: [0.12, 0.88], band: [0.4, 1], bandSteps: [0, 1] };

/* The flat page's stills: which objects, and the patch of bench to frame. */
/* Each frame leaves room round its object for the shadow to fade out. */
const STILLS = [
  { show: ['portrait', 'notebook', 'stack'], x: 595, y: 57, fw: 2020, fh: 1880, tilt: 8, rot: -2 },
  { show: ['notebook'], x: 980, y: -420, fw: 1240, fh: 920, tilt: 14, rot: 1.5 },
  { show: ['spread'], x: 3020, y: 17, fw: 2420, fh: 1320, tilt: 14, rot: -1 },
  { show: ['cards'], x: 1770, y: 1920, fw: 1260, fh: 1000, tilt: 12, rot: -1 },
  { show: ['sheet'], x: 3420, y: 2285, fw: 1060, fh: 1460, tilt: 10, rot: 0.6 },
  /* the right-hand page: however wide the frame, its left edge stays in the gutter */
  { show: ['bible'], x: 5500, y: 1290, fw: 900, fh: 1300, tilt: 10, rot: -0.8, minLeft: 5070 },
];

/* Soft hyphens at dictionary syllable breaks for the long words of Daniel 3
   and 4, so the Bible's narrow justified columns break the same way in every
   browser (Chromium on Windows has no English hyphenation dictionary).
   Applied as the page is drawn; daniel.js stays word for word. */
const BREAKS = 'accord·ing aston·ied astrol·ogers bab·ylon bel·teshaz·zar burn·ing cap·tains care·ful cer·tain chal·de·ans com·manded com·mand·ment coun·sel·lors dedi·ca·tion deliv·ered domin·ion dul·ci·mer dung·hill ever·last·ing exceed·ing fall·eth flour·ish·ing fur·nace gar·ments gath·ered gen·era·tion gov·er·nors inter·pre·ta·tion king·dom lan·guage lan·guages magi·cians mul·ti·plied nebu·chad·nez·zar nei·ther prin·ces pro·moted prov·ince prov·inces psal·tery sack·but ser·vants sha·drach sher·iffs sooth·say·ers there·fore trea·sur·ers trou·bled trou·bleth walk·ing where·fore won·ders wor·ship wor·shipped wor·ship·peth';
const BREAK_MAP = new Map(BREAKS.split(' ').map((w) => [w.replace(/·/g, ''), w]));
const BREAK_RE = new RegExp(`\\b(${[...BREAK_MAP.keys()].sort((a, b) => b.length - a.length).join('|')})\\b`, 'gi');
const hyph = (text) => text.replace(BREAK_RE, (m) => {
  let out = '';
  let j = 0;
  for (const ch of BREAK_MAP.get(m.toLowerCase())) {
    if (ch === '·') out += '­';
    else {
      out += m[j];
      j += 1;
    }
  }
  return out;
});

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const clamp01 = (t) => clamp(t, 0, 1);
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;
const toTransform = (p) => `rotateX(${p.tilt.toFixed(3)}deg) rotateZ(${p.rot.toFixed(3)}deg) scale(${p.z.toFixed(4)}) translate(${(-p.x).toFixed(2)}px, ${(-p.y).toFixed(2)}px)`;

/* Where a point inside an object lies on the bench, rotation included. */
function worldPoint(el) {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  let n = el;
  while (n && !n.classList.contains('bt-obj')) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent;
  }
  if (!n) return null;
  const r = ((parseFloat(n.dataset.r) || 0) * Math.PI) / 180;
  const cx = n.offsetWidth / 2;
  const cy = n.offsetHeight / 2;
  const dx = x - cx;
  const dy = y - cy;
  return { x: n.offsetLeft + cx + dx * Math.cos(r) - dy * Math.sin(r), y: n.offsetTop + cy + dx * Math.sin(r) + dy * Math.cos(r) };
}

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ── The bench, drawn ──────────────────────────────────────────────── */

const plate = (p) => ({ backgroundImage: `url(${p.file})` });

function Print({ w, at, hot }) {
  return (
    <div
      className={`bt-obj bt-work${hot ? ' is-hot' : ''}`}
      data-b={`${at.x},${at.y},${PRINT_W},${PRINT_H}`}
      style={{
        left: at.x,
        top: at.y,
        transform: hot ? 'translateZ(70px) rotateZ(0deg) scale(1.05)' : `translateZ(0px) rotateZ(${at.r}deg) scale(1)`,
      }}
    >
      <img src={w.img} alt="" width="608" height="380" loading="eager" decoding="async" />
      <div className="bt-work-cap">{w.name}<span>{w.year}</span></div>
    </div>
  );
}

/* The pencil mark beside verse 25: two passes of graphite, the second a
   little lighter and off the first, the way a pencil bracket is drawn. */
const PencilMark = () => (
  <svg className="bt-mark" viewBox="0 0 14 100" preserveAspectRatio="none" aria-hidden="true">
    <path d="M12 2 C5 2 4 4 4 10 L4.6 90 C4.6 96 6 98 12.5 98" />
    <path className="bt-mark-2" d="M11.4 3.2 C5.6 3 4.9 5.5 5 11 L5.3 89 C5.4 95.5 7 97.2 12 97.4" />
  </svg>
);

/* The pile, bottom to top, with the open card out of it. */
const freshPile = (open) => PROMISES.map((_, i) => i).filter((i) => i !== open).reverse();

function Bench({ open, hot, only, pile = freshPile(open) }) {
  const has = (k) => !only || only.includes(k);
  return (
    <>
      {has('portrait') && (
        <div className="bt-obj bt-print" data-b={`${PORTRAIT.x},${PORTRAIT.y},${PORTRAIT.w},${PORTRAIT.h}`} style={{ left: PORTRAIT.x, top: PORTRAIT.y, width: PORTRAIT.w, transform: `rotateZ(${PORTRAIT.r}deg)` }}>
          <picture>
            <source type="image/webp" srcSet="/founder-headshot-800.webp 800w, /founder-headshot.webp 1024w" sizes="576px" />
            <img src="/founder-headshot.png" alt="" width="576" height="720" loading="eager" decoding="async" />
          </picture>
          <div className="bt-print-cap"><b>Caleb Scott</b>, Perth</div>
        </div>
      )}

      {has('notebook') && (
        <div className="bt-obj bt-note" data-r={NOTE_AT.r} data-b={`${NOTE_AT.x},${NOTE_AT.y},${NOTEBOOK.w},${NOTEBOOK.h}`} style={{ left: NOTE_AT.x, top: NOTE_AT.y, transform: `rotateZ(${NOTE_AT.r}deg)`, ...plate(NOTEBOOK) }}>
          {[GLANCE.slice(0, 2), GLANCE.slice(2)].map((page, n) => (
            <dl className={`bt-note-page bt-note-page--${n ? 'r' : 'l'}`} key={n}>
              {page.map((g) => (<React.Fragment key={g.k}><dt>{g.k}</dt><dd>{g.v}</dd></React.Fragment>))}
            </dl>
          ))}
        </div>
      )}

      {/* Paper that lies on paper sits in one flat group, stacked in paint
          order the way sheets are. Left loose in the 3D bench, sheets a few
          pixels apart get re-sorted every frame as the camera moves, and
          flicker where they overlap. */}
      {has('stack') && (
        <div className="bt-heap">
          {STACK.map((s) => <Print key={`stack-${s.i}`} w={WORK[s.i]} at={s} hot={false} />)}
        </div>
      )}

      {has('spread') && WORK.map((w, i) => <Print key={w.slug} w={w} at={SPREAD[i]} hot={hot === i} />)}

      {has('cards') && (
        <div className="bt-heap">
          {PROMISES.map((p, i) => {
            const on = open === i;
            const pos = pile.indexOf(i);
            const at = on ? CARD_ON : PILE[Math.max(0, pile.length - 1 - pos)];
            return (
              <div
                key={p.t}
                className={`bt-obj bt-card${on ? ' is-on' : ''}`}
                data-b={`${at.x - CARD.w / 2},${at.y - CARD.h / 2},${CARD.w},${CARD.h}`}
                style={{
                  zIndex: on ? 20 : pos + 1,
                  transform: `translate(${at.x - CARD.w / 2}px, ${at.y - CARD.h / 2}px) rotate(${at.r}deg) scale(${on ? 1.035 : 1})`,
                  ...plate(CARD),
                }}
              >
                <div className="bt-card-rule" />
                <h4>{p.t}</h4>
                <p className="bt-card-line">{p.s}</p>
                <p className="bt-card-detail">{p.d}</p>
              </div>
            );
          })}
        </div>
      )}

      {has('sheet') && (
        <div className="bt-obj bt-sheet" data-r={SHEET_AT.r} data-b={`${SHEET_AT.x},${SHEET_AT.y},${SHEET.w},${SHEET.h}`} style={{ left: SHEET_AT.x, top: SHEET_AT.y, transform: `rotateZ(${SHEET_AT.r}deg)`, ...plate(SHEET) }}>
          <div className="bt-sheet-head"><b>Run sheet</b><span>C4 Studios</span></div>
          {STEPS.map((s, i) => (
            <div className="bt-sheet-row" data-row={i} key={s.t}>
              <b>{i + 1}</b>
              <div><h4>{s.t}</h4><p>{s.d}</p></div>
            </div>
          ))}
        </div>
      )}

      {has('bible') && (
        <div className="bt-obj bt-bible" data-r={BIBLE_AT.r} data-b={`${BIBLE_AT.x},${BIBLE_AT.y},${BIBLE.w},${BIBLE.h}`} style={{ left: BIBLE_AT.x, top: BIBLE_AT.y, transform: `rotateZ(${BIBLE_AT.r}deg)`, ...plate(BIBLE) }} lang="en">
          {/* the far leaf keeps its own focus: close on verse 25 it falls soft */}
          <div className="bt-bible-page bt-bible-page--l" data-b={`${BIBLE_AT.x + BIBLE.cover},${BIBLE_AT.y + BIBLE.cover},${BIBLE.fold - BIBLE.cover},${BIBLE.h - 2 * BIBLE.cover}`}>
            <div className="bt-bible-head">Daniel</div>
            <div className="bt-bible-text">
              <h5>Chapter 3</h5>
              {DANIEL_3.slice(0, 15).map((v, i) => <p key={i}><b>{i + 1}</b> {hyph(v)}</p>)}
            </div>
          </div>
          <div className="bt-bible-page bt-bible-page--r">
            <div className="bt-bible-head">Daniel 3</div>
            <div className="bt-bible-text">
              {DANIEL_3.slice(15).map((v, i) => {
                const n = i + 16;
                return (
                  <p key={n} data-v={n} className={n === 25 ? 'is-marked' : undefined}>
                    <b>{n}</b> {hyph(v)}
                    {n === 25 && <PencilMark />}
                  </p>
                );
              })}
              <h5>Chapter 4</h5>
              {DANIEL_4.map((v, i) => <p key={`4-${i}`}><b>{i + 1}</b> {hyph(v)}</p>)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* One object as a still, for the flat page (prerender and reduced motion). */
function Still({ still, open }) {
  const frameRef = useRef(null);
  const worldRef = useRef(null);
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const world = worldRef.current;
    if (!frame || !world) return undefined;
    const fit = () => {
      const z = Math.min(frame.clientWidth / still.fw, frame.clientHeight / still.fh);
      const x = still.minLeft == null ? still.x : Math.max(still.x, still.minLeft + frame.clientWidth / (2 * z));
      world.style.transform = toTransform({ x, y: still.y, z, tilt: still.tilt, rot: still.rot });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(frame);
    return () => ro.disconnect();
  }, [still]);
  return (
    <div className="bt-still" ref={frameRef} aria-hidden="true">
      <div className="bt-lens">
        <div className="bt-world" ref={worldRef}>
          <Bench open={open} hot={-1} only={still.show} />
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const jsonLd = useMemo(() => [
    organizationSchema(),
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/About' },
    ]),
  ], []);

  useDocumentHead({
    title: 'About — Caleb Scott, founder of C4 Studios, Perth',
    description:
      'C4 Studios is Caleb Scott, founder and sole operator, building websites and software in Perth since 2022. The person you brief is the person who builds.',
    path: '/About',
    jsonLd,
  });

  const staticMode = useStaticMode();
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const worldRef = useRef(null);
  const ctaRef = useRef(null);
  const hotRef = useRef(-1);
  const objsRef = useRef([]);
  const [open, setOpen] = useState(staticMode ? -1 : 0);
  const [hot, setHot] = useState(-1);
  const [step, setStep] = useState(-1);
  const toggle = (i) => setOpen((o) => (o === i ? -1 : i));
  hotRef.current = hot;
  /* the pile keeps its own order: the card put back goes on top */
  const deckRef = useRef(null);
  if (!deckRef.current) deckRef.current = { open, pile: freshPile(open) };
  if (deckRef.current.open !== open) {
    const prev = deckRef.current.open;
    const pile = deckRef.current.pile.filter((i) => i !== open && i !== prev);
    if (prev >= 0) pile.push(prev);
    deckRef.current = { open, pile };
  }

  /* Smooth scroll, shared with the rest of the site (ServiceWeb pattern). */
  useEffect(() => {
    if (staticMode) return undefined;
    const w = window;
    if (w.__c4Lenis) return undefined;
    const lenis = new Lenis({ lerp: 0.1 });
    w.__c4Lenis = lenis;
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      delete w.__c4Lenis;
    };
  }, [staticMode]);

  /* Every object's patch of bench, for the depth of field. Cards move when a
     promise opens, so this re-reads after each change. */
  useLayoutEffect(() => {
    const world = worldRef.current;
    if (!world) return;
    objsRef.current = Array.from(world.querySelectorAll('[data-b]')).map((el) => {
      const [x, y, w, h] = el.dataset.b.split(',').map(Number);
      return { el, x, y, w, h, blur: -1, dim: null, op: -1 };
    });
  }, [open, staticMode]);

  /* The camera. Every stop names the pose it holds and the words it holds it
     for; between two stops the camera waits, then travels, pulling back a
     little on long journeys the way a crane would. The world follows the
     scroll position directly, so the words and the bench never drift apart.
     Whatever is far from where the camera looks falls out of focus. */
  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const world = worldRef.current;
    if (staticMode || !root || !stage || !world) return undefined;
    root.classList.add('bt-armed');

    let anchors = [];
    let layout = 'wide';
    let verseY = 0;
    let stepRange = [0, 0];
    let vh = window.innerHeight;
    let frameW = 812;
    let colPx = -1;
    let lxPx = 0;
    const measure = () => {
      vh = window.innerHeight;
      const vw = window.innerWidth;
      layout = vw >= WIDE_MIN ? 'wide' : 'band';
      let k;
      if (layout === 'wide') {
        const col = root.querySelector('.bt-chapters');
        const cs = getComputedStyle(col);
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const colRight = col.getBoundingClientRect().left + parseFloat(cs.paddingLeft) + 34 * rem;
        /* the camera frames the clear space past the column's fade */
        const clear = vw - colRight - 120;
        stage.style.setProperty('--col', `${Math.round(colRight)}px`);
        stage.style.setProperty('--lx', `${Math.round(colRight + 120 + clear / 2)}px`);
        k = clamp(Math.min(clear / 692, vh / 900), 0.62, 1.25);
        frameW = clear;
        colPx = colRight;
        lxPx = colRight + 120 + clear / 2;
      } else {
        stage.style.removeProperty('--col');
        stage.style.removeProperty('--lx');
        k = clamp(Math.min(vw / 375, stage.offsetHeight / 373), 0.45, 1.6);
        /* a tablet's band is wide and short: focus by what it can hold */
        frameW = Math.min(vw, stage.offsetHeight * 1.2);
        colPx = -1;
      }
      /* the run sheet's rows and verse 25, found where they actually set */
      const set = { ...POSES[layout] };
      root.querySelectorAll('.bt-stage .bt-sheet-row').forEach((row, i) => {
        const p = worldPoint(row);
        if (p) set[`step${i}`] = { ...set.step, x: set.step.x, y: p.y };
      });
      const v25 = root.querySelector('.bt-stage [data-v="25"]');
      const vp = v25 && worldPoint(v25);
      /* wide keeps the left page under the column's fade: verse 25 sits left of centre */
      if (vp) set.verse = { ...set.verse, x: vp.x + (layout === 'wide' ? 170 : 0), y: vp.y };
      anchors = STOPS.map((s) => {
        const [sel, at] = s[layout];
        const el = root.querySelector(sel);
        const r = el.getBoundingClientRect();
        const y = Math.max(0, r.top + window.scrollY + at * r.height - vh * FOCUS[layout]);
        const base = set[s.pose] || set.step;
        return { y, name: s.pose, pose: { ...base, z: base.z * k } };
      });
      /* every move gets room to happen, even where two stops' words arrive
         together (a tall tablet shows the first two chapters at once);
         down the run sheet the steps sit close, so there it may be short */
      for (let i = 1; i < anchors.length; i++) {
        const stepLeg = anchors[i - 1].name.startsWith('step') && anchors[i].name.startsWith('step');
        anchors[i].y = Math.max(anchors[i].y, anchors[i - 1].y + (stepLeg ? 60 : vh * 0.3));
      }
      verseY = anchors.find((a) => a.name === 'verse').y;
      const s0 = anchors.find((a) => a.name === 'step0').y;
      const s3 = anchors.find((a) => a.name === `step${STEPS.length - 1}`).y;
      stepRange = [s0 - vh * 0.45, s3 + vh * 0.45];
    };
    measure();

    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    const glance = { x: 0, y: 0, z: 1 };
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });

    let lastStep = -1;
    const tick = () => {
      const y = window.__c4Lenis ? window.__c4Lenis.scroll : window.scrollY;
      const last = anchors[anchors.length - 1];
      let pose = anchors[0].pose;
      if (y >= last.y) pose = last.pose;
      else {
        for (let i = 0; i < anchors.length - 1; i++) {
          const a = anchors[i];
          const b = anchors[i + 1];
          if (y >= a.y && y < b.y) {
            const glide = layout === 'band' && a.name.startsWith('step') && b.name.startsWith('step');
            const [lo, hi] = TRAVEL[glide ? 'bandSteps' : layout];
            const u = (y - a.y) / Math.max(1, b.y - a.y);
            const e = smoother(clamp01((u - lo) / (hi - lo)));
            const dist = Math.hypot(b.pose.x - a.pose.x, b.pose.y - a.pose.y);
            const arc = 1 - Math.min(0.28, dist / 9000) * Math.sin(Math.PI * e);
            pose = {
              x: lerp(a.pose.x, b.pose.x, e),
              y: lerp(a.pose.y, b.pose.y, e),
              z: lerp(a.pose.z, b.pose.z, e) * arc,
              tilt: lerp(a.pose.tilt, b.pose.tilt, e),
              rot: lerp(a.pose.rot, b.pose.rot, e),
            };
            break;
          }
        }
      }

      /* the run sheet: which step the camera is on */
      let s = -1;
      if (y >= stepRange[0] && y <= stepRange[1]) {
        let best = Infinity;
        anchors.forEach((a) => {
          if (a.name.startsWith('step') && Math.abs(y - a.y) < best) {
            best = Math.abs(y - a.y);
            s = Number(a.name.slice(4));
          }
        });
      }
      if (s !== lastStep) {
        lastStep = s;
        setStep(s);
      }

      /* naming a project glances the camera toward its print, and closer */
      const h = hotRef.current;
      const gx = h >= 0 ? (SPREAD_C[h].x - pose.x) * 0.55 : 0;
      const gy = h >= 0 ? (SPREAD_C[h].y - pose.y) * 0.45 : 0;
      const gz = h >= 0 ? 1.18 : 1;
      glance.x += (gx - glance.x) * 0.07;
      glance.y += (gy - glance.y) * 0.07;
      glance.z += (gz - glance.z) * 0.07;

      pointer.sx += (pointer.x - pointer.sx) * 0.06;
      pointer.sy += (pointer.y - pointer.sy) * 0.06;
      const cam = {
        x: pose.x + glance.x,
        y: pose.y + glance.y,
        z: pose.z * glance.z,
        rot: pose.rot + pointer.sx * 1.2,
        tilt: pose.tilt - pointer.sy * 1.6,
      };
      world.style.transform = toTransform(cam);

      /* depth of field: sharp where the camera looks, softer with distance */
      const span = frameW / cam.z;
      const r0 = span * 0.2;
      const r1 = span * 0.35;
      const maxBlur = layout === 'wide' ? 6 : 5;
      /* dark mode dims paper with a CSS filter; the blur has to carry it too */
      const dim = document.documentElement.classList.contains('dark-mode');
      objsRef.current.forEach((o) => {
        const dx = Math.max(o.x - cam.x, 0, cam.x - (o.x + o.w));
        const dy = Math.max(o.y - cam.y, 0, cam.y - (o.y + o.h));
        const b = Math.round(clamp01((Math.hypot(dx, dy) - r0) / r1) * maxBlur * 2) / 2;
        if (b !== o.blur || dim !== o.dim) {
          o.blur = b;
          o.dim = dim;
          o.el.style.filter = b ? `blur(${b}px)${dim ? ' brightness(0.93)' : ''}` : '';
        }
        /* on wide, whatever slides under the words goes with the fade */
        let op = 1;
        if (colPx > 0) {
          const right = lxPx + (o.x + o.w - cam.x) * cam.z;
          op = Math.round(clamp01((right - (colPx + 100)) / 80) * 20) / 20;
        }
        if (op !== o.op) {
          o.op = op;
          o.el.style.opacity = op < 1 ? String(op) : '';
        }
      });

      const lamp = 1 - clamp01(Math.abs(y - verseY) / (vh * 0.9));
      stage.style.setProperty('--lamp', (smoother(lamp) * 0.7).toFixed(3));
    };
    gsap.ticker.add(tick);

    /* Keyboard focus never lands off screen or under the pinned band. */
    const onFocus = (e) => {
      const el = e.target;
      const lenis = window.__c4Lenis;
      if (!lenis || !(el instanceof HTMLElement) || !el.getBoundingClientRect) return;
      const r = el.getBoundingClientRect();
      const top = layout === 'band' ? stage.getBoundingClientRect().bottom + 16 : 96;
      const bottom = window.innerHeight - 96;
      if (r.top < top || r.bottom > bottom) lenis.scrollTo(el, { immediate: true, offset: -(top + 24) });
    };
    document.addEventListener('focusin', onFocus);

    const chapters = Array.from(root.querySelectorAll('[data-ch]'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) en.target.classList.add('is-in'); });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    chapters.forEach((c) => io.observe(c));

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure).catch(() => {});

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener('focusin', onFocus);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('resize', measure);
      if (fine) window.removeEventListener('pointermove', onMove);
      root.classList.remove('bt-armed');
      stage.style.removeProperty('--col');
      stage.style.removeProperty('--lx');
    };
  }, [staticMode]);

  /* The start button leans toward the cursor, as on /ServiceWeb. */
  useEffect(() => {
    const btn = ctaRef.current;
    if (staticMode || !btn) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
    const onMove = (e) => {
      const r = btn.getBoundingClientRect();
      xTo(gsap.utils.clamp(-12, 12, (e.clientX - (r.left + r.width / 2)) * 0.24));
      yTo(gsap.utils.clamp(-8, 8, (e.clientY - (r.top + r.height / 2)) * 0.32));
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    btn.addEventListener('pointermove', onMove);
    btn.addEventListener('pointerleave', onLeave);
    return () => {
      btn.removeEventListener('pointermove', onMove);
      btn.removeEventListener('pointerleave', onLeave);
      gsap.set(btn, { clearProps: 'transform' });
    };
  }, [staticMode]);

  const startUrl = createPageUrl('StartProject');
  const contactUrl = createPageUrl('Contact');
  const still = (n) => (staticMode ? <Still still={STILLS[n]} open={n === 3 ? 0 : -1} /> : null);

  return (
    <div className="bt-root" ref={rootRef}>
      <div className="bt-track">
        {!staticMode && (
          <div className="bt-stage" ref={stageRef} aria-hidden="true">
            <div className="bt-lens">
              <div className="bt-world" ref={worldRef}>
                <Bench open={open} hot={hot} pile={deckRef.current.pile} />
              </div>
            </div>
            <div className="bt-veil" />
            <div className="bt-light" />
          </div>
        )}

        <div className="bt-chapters">
          <header className="bt-ch bt-ch--open" data-ch="0">
            <div className="bt-ch-in">
              <h1 className="bt-h1">The person you brief is the person who builds.</h1>
              <p className="bt-lede">
                C4 Studios is Caleb Scott, founder and sole operator, in Perth since 2022. I do every part of the work myself.
              </p>
            </div>
            {still(0)}
          </header>

          <section className="bt-ch" data-ch="1" aria-labelledby="bt-who">
            <div className="bt-ch-in">
              <h2 className="bt-h2" id="bt-who">Who you’re talking to</h2>
              <p className="bt-p">My background runs across web development, product design, data modelling and education.</p>
              <p className="bt-p">Outside client work I volunteer with children and communities, here and overseas. It shapes how I work: patiently, and with the person on the other side of the screen in mind.</p>
              <p className="bt-p">I’m also completing a Juris Doctor (JD) in Law. Legal study asks for structured thinking and close attention to detail, and I bring the same standard to every project.</p>
              <dl className="bt-notes">
                {GLANCE.map((g) => (<div key={g.k}><dt>{g.k}</dt><dd>{g.v}</dd></div>))}
              </dl>
            </div>
            {still(1)}
          </section>

          <section className="bt-ch bt-ch--long" data-ch="2" aria-labelledby="bt-where">
            <div className="bt-ch-in">
              <h2 className="bt-h2" id="bt-where">Where it’s come from</h2>
              <ol className="bt-years">
                {YEARS.map((y) => (
                  <li key={y.y}>
                    <b>{y.y}</b>
                    <div><h3>{y.t}</h3><p>{y.d}</p></div>
                  </li>
                ))}
              </ol>
              <ul className="bt-worklist" aria-label="Some of the work">
                {WORK.map((w, i) => {
                  const glance = {
                    onMouseEnter: () => setHot(i),
                    onMouseLeave: () => setHot(-1),
                    onFocus: () => setHot(i),
                    onBlur: () => setHot(-1),
                  };
                  return (
                    <li key={w.slug}>
                      {w.href ? (
                        <a href={w.href} target="_blank" rel="noopener noreferrer" aria-label={`${w.name}, ${w.year.toLowerCase()}, opens the concept site in a new tab`} {...glance}>
                          {w.name}<span>{w.year}</span>
                        </a>
                      ) : (
                        <Link to={`/CaseStudy/${w.slug}`} {...glance}>
                          {w.name}<span>{w.year}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            {still(2)}
          </section>

          <section className="bt-ch" data-ch="3" aria-labelledby="bt-promise">
            <div className="bt-ch-in">
              <h2 className="bt-h2" id="bt-promise">What you can hold me to</h2>
              <ul className="bt-promises">
                {PROMISES.map((p, i) => {
                  const isOpen = staticMode || open === i;
                  return (
                    <li key={p.t}>
                      <button type="button" className="bt-promise-btn" aria-expanded={isOpen} aria-controls={`bt-pr-${i}`} onClick={() => toggle(i)}>
                        <strong>{p.t}</strong>
                        <span>{p.s}</span>
                        <i className="bt-promise-x" aria-hidden="true" />
                      </button>
                      <div className="bt-promise-body" id={`bt-pr-${i}`} data-open={isOpen ? 'true' : 'false'}>
                        <div><p>{p.d}</p></div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            {still(3)}
          </section>

          <section className="bt-ch bt-ch--steps" data-ch="4" aria-labelledby="bt-run">
            <div className="bt-ch-in">
              <h2 className="bt-h2" id="bt-run">How a project runs</h2>
              <ol className="bt-steps" data-active={step >= 0 ? step : undefined}>
                {STEPS.map((s, i) => (
                  <li key={s.t} className={step === i ? 'is-on' : undefined}>
                    <b>{i + 1}</b>
                    <div><h3>{s.t}</h3><p>{s.d}</p></div>
                  </li>
                ))}
              </ol>
            </div>
            {still(4)}
          </section>

          <section className="bt-ch" data-ch="5" aria-labelledby="bt-name">
            <div className="bt-ch-in">
              <h2 className="bt-h2" id="bt-name">Why “C4”</h2>
              <blockquote className="bt-quote">
                <p>{VERSE}</p>
                <cite>Daniel 3:25</cite>
              </blockquote>
              <p className="bt-p">C4, “See Four”, comes from Daniel 3. Three men were thrown into a furnace, and a fourth appeared with them: a picture of God’s presence with His people under pressure.</p>
              <p className="bt-p">I follow Yahweh. That shapes the standards I hold to and how I treat clients, whatever they believe. It’s personal, and it asks nothing of you.</p>
            </div>
            {still(5)}
          </section>
        </div>
      </div>

      <section className="bt-close" data-ch="6" aria-labelledby="bt-start">
        <div className="bt-close-in">
          <h2 id="bt-start">Start with a conversation.</h2>
          <p>Send me a short brief and I’ll book in a call.</p>
          <div className="bt-close-actions">
            <Link ref={ctaRef} to={startUrl} className="bt-btn">Start a project <ArrowIcon /></Link>
            <Link to={contactUrl} className="bt-close-link">Or just say hello</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
