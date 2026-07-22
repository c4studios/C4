/**
 * /ServiceWeb — C1 · Web & Applications. "The Red Thread."
 *
 * Arm identity (fable pass, decision memo §1.1): one red line — drawn
 * like a pen stroke, pressure and overshoot in the geometry — runs the
 * whole page, and the page builds itself along it. Refinement pass:
 * every stroke now DEPICTS something (no decorative wandering) — the
 * hero pen travels the copy rail, underlines the finished headline,
 * draws the browser frame's outline before the chrome assembles, runs
 * a proof-reader's margin pass down the spec list (station dots fill
 * as each line typesets), forks a branch per rate group, morphs
 * Brief (annotated underlines) → Design (wireframe) → Build (truss) →
 * Launch (climb-out arc), and finally SIGNS OFF beneath the closing
 * CTA — a three-layer pen-pressure signature that tapers as the pen
 * lifts. The hero ignites from a silver wireframe skeleton (Archivo
 * wdth 62/wght 300 → 100/800, word-level boxes locked to final built
 * metrics so the axes animate with zero reflow), real client sites
 * browse themselves inside browser frames (DSR desktop→phone handoff,
 * Groverz light set), the rate card rolls its prices on an odometer,
 * and a self-reporting vitals strip (real Performance-API numbers)
 * sits in the hero corner and is reprised before the close.
 *
 * Motion: GSAP is the engine; every trigger lives inside
 * gsap.matchMedia() and nothing arms under prefers-reduced-motion or
 * the Prerender UA (staticMode). The DOM default IS the finished end
 * state everywhere — timelines only disassemble away from it, so the
 * prerender ships the built page for free. No WebGL (memo §2.2), no
 * continuous motion below the fold except the 1Hz vitals readout while
 * visible (memo §2.3.4). Flip is click-time only (case morphs), never
 * inside a pin. Styles: src/components/web-arm/web-arm.css (.lv-root).
 *
 * Chrome: forced DARK. `.wa-on-sheet` is retired; `.lv-on-stage` pins
 * the full --c4-* token set dark for the life of the page (guarded
 * MutationObserver, cleanup restore — house pattern).
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import {
  webPackageSections,
  webPricingGuides,
  webScopeNotes,
  subscriptionInfo,
  ASTERISK_CLAUSE,
  GST_NOTE,
  INDUSTRY_SURCHARGE_NOTE,
} from '@/data/pricing';
import '../components/web-arm/web-arm.css';

/* Derived capture assets — generated from public/captures (read-only)
   via the memo §3 sharp pipeline; ≤900px desktop / ≤480px mobile WebP,
   363KB for the entire page's imagery. */
import sharpHero from '../components/web-arm/assets/sharp-hero.webp';
import dsrD1 from '../components/web-arm/assets/dsr-d1.webp';
import dsrD2 from '../components/web-arm/assets/dsr-d2.webp';
import dsrD3 from '../components/web-arm/assets/dsr-d3.webp';
import dsrD4 from '../components/web-arm/assets/dsr-d4.webp';
import dsrM1 from '../components/web-arm/assets/dsr-m1.webp';
import dsrM2 from '../components/web-arm/assets/dsr-m2.webp';
import dsrM3 from '../components/web-arm/assets/dsr-m3.webp';
import dsrM4 from '../components/web-arm/assets/dsr-m4.webp';
import gzD1 from '../components/web-arm/assets/gz-d1.webp';
import gzD2 from '../components/web-arm/assets/gz-d2.webp';
import gzD3 from '../components/web-arm/assets/gz-d3.webp';
import gzD4 from '../components/web-arm/assets/gz-d4.webp';
import gzD5 from '../components/web-arm/assets/gz-d5.webp';
import gzD6 from '../components/web-arm/assets/gz-d6.webp';
import eaHero from '../components/web-arm/assets/ea-hero.webp';
import hvnHero from '../components/web-arm/assets/hvn-hero.webp';
import tidyHero from '../components/web-arm/assets/tidy-hero.webp';
import jptHero from '../components/web-arm/assets/jpt-hero.webp';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin, SplitText, Flip, CustomEase);

/* One shared house ease for every non-scrub tween on the page. */
if (!CustomEase.get('c4')) CustomEase.create('c4', 'M0,0 C0.2,0 0.1,1 1,1');

const START = createPageUrl('StartProject');
const PORTFOLIO = createPageUrl('Portfolio');

/* Delivery windows are page metadata (they don't exist in pricing.js).
   The six original windows preserved verbatim; proposal-scoped tiers
   say so instead of inventing a number. */
const TIMELINES = {
  starter: '1–2 weeks',
  brochure: '2–3 weeks',
  business: '3–4 weeks',
  custom: '4–6 weeks',
  'commerce-starter': '4–6 weeks',
  'web-application': '5–8 weeks',
  growth: 'By proposal',
  platform: 'By proposal',
};

const INCLUDED = [
  'Mobile-first responsive layout',
  'Basic SEO setup',
  'Performance optimised',
  'Cross-browser tested',
  'Founder reply within 1 business day',
  'Full code handover — you own it',
];

/* Brief → Design → Build → Launch. The thread IS the sequence, so the
   stage numbers are gone; the four descriptions are preserved verbatim. */
const PROCESS = [
  { label: 'Brief', desc: 'You describe the outcome you need. We ask the right questions.' },
  { label: 'Design', desc: 'Wireframes and visual designs — reviewed and approved before build.' },
  { label: 'Build', desc: 'Clean code, responsive layout, tested across devices.' },
  { label: 'Launch', desc: 'Deployment, DNS, analytics, and a handover guide.' },
];

/* ── The proof reel ────────────────────────────────────────────────
   All six pass-1 clients preserved (scope lines + alt text are SEO
   contract copy), plus DS Racing Karts as the featured live drive
   (memo graft 1 — its mobile capture set powers the phone handoff).
   Groverz is the second (light) live set; the rest are static frames
   with the click-time FLIP case morph. */
const DSR = {
  key: 'dsr',
  name: 'DS Racing Karts',
  url: 'dsracingkarts.com.au',
  place: 'Perth, WA',
  year: '2026',
  scope:
    'Ecommerce platform for a WA karting supplier — full shop and checkout, race results, team pages and a custom admin.',
  desktop: [
    { src: dsrD1, w: 900, h: 563, alt: 'DS Racing Karts home page — a dark motorsport hero with the DSR wordmark.' },
    { src: dsrD2, w: 900, h: 563, alt: 'DS Racing Karts kart category range on a dark grid.' },
    { src: dsrD3, w: 900, h: 563, alt: 'DS Racing Karts online shop — parts and racewear catalogue.' },
    { src: dsrD4, w: 900, h: 563, alt: 'DS Racing Karts contact page with workshop details.' },
  ],
  mobile: [
    { src: dsrM1, w: 480, h: 1040, alt: 'DS Racing Karts mobile home screen.' },
    { src: dsrM2, w: 480, h: 1040, alt: 'DS Racing Karts mobile shop view.' },
    { src: dsrM3, w: 480, h: 1040, alt: 'DS Racing Karts mobile services view.' },
    { src: dsrM4, w: 480, h: 1040, alt: 'DS Racing Karts mobile contact view.' },
  ],
};

const GROVERZ = {
  key: 'groverz',
  name: 'Groverz Tax & Accounting',
  url: 'groverztax.com.au',
  place: 'East Cannington, WA',
  year: '2026',
  scope: 'Tax-practice site with an interactive refund estimator and a physics-driven hero.',
  frames: [
    { src: gzD1, w: 900, h: 434, alt: 'Groverz Tax & Accounting home page — a professional accounting-practice website hero.' },
    { src: gzD2, w: 900, h: 465, alt: 'Groverz Tax & Accounting — benefits section.' },
    { src: gzD3, w: 900, h: 426, alt: 'Groverz Tax & Accounting — client testimonials.' },
    { src: gzD4, w: 900, h: 509, alt: 'Groverz Tax & Accounting — interactive refund calculator.' },
    { src: gzD5, w: 900, h: 633, alt: 'Groverz Tax & Accounting — services overview.' },
    { src: gzD6, w: 900, h: 317, alt: 'Groverz Tax & Accounting — booking call-to-action.' },
  ],
};

const CASES = [
  {
    key: 'evidence',
    name: 'Evidence Advisory',
    place: 'Perth, WA',
    year: '2026',
    scope: 'Digital-forensics brand site anchored by a scroll-solved 3D crime-scene reconstruction.',
    img: eaHero,
    w: 900,
    h: 563,
    alt: 'Evidence Advisory home page — a shattered, evidence-tagged smartphone suspended in zero gravity with yellow forensic markers.',
  },
  {
    key: 'sharp',
    name: 'Sharp Bricklaying',
    place: 'Perth, WA',
    year: '2026',
    scope: 'Premium bricklayer’s site built from licensed drone aerials and a multi-job gallery.',
    img: sharpHero,
    w: 900,
    h: 563,
    alt: 'Sharp Bricklaying home page — a drone aerial of finished brickwork behind the studio wordmark.',
  },
  {
    key: 'hvn',
    name: 'HVN CrossFit',
    place: 'Port Kennedy, WA',
    year: '2026',
    scope: 'Cinematic Next.js gym site with live class booking and a scroll-driven mini-game.',
    img: hvnHero,
    w: 900,
    h: 563,
    alt: 'HVN CrossFit home page — a dark, cinematic hero for a Port Kennedy gym.',
  },
  {
    key: 'tidy',
    name: 'Tidy Gardens Australia',
    place: 'Perth, WA',
    year: '2026',
    scope: 'Motion-led site for a garden & reticulation business, with a living scroll motif.',
    img: tidyHero,
    w: 900,
    h: 563,
    alt: 'Tidy Gardens Australia home page — a green, motion-led hero for a Perth garden-care business.',
  },
  {
    key: 'jurassic',
    name: 'Jurassic PT',
    place: 'Cannington, WA',
    year: '2026',
    scope: 'Conversion-focused fitness studio site — memberships, timetable and direct booking.',
    img: jptHero,
    w: 900,
    h: 563,
    alt: 'Jurassic PT home page — a dark, lime-accented hero for a Cannington personal-training studio.',
  },
];

/* Sections zipped with their pricing guides (parallel arrays in
   pricing.js — base / ecommerce / apps). */
const SECTIONS = webPackageSections.map((section, i) => ({
  ...section,
  guide: webPricingGuides[i],
}));

/* Stable module-level ref so the head hook doesn't re-run each render. */
const WEB_JSONLD = [
  serviceSchema({
    name: 'Web Design & Development',
    description:
      'Custom websites, web apps, SaaS platforms and ecommerce stores for Perth businesses — built to convert and designed to last.',
    url: '/ServiceWeb',
    serviceType: 'Web design and development',
  }),
  breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Web & Applications', path: '/ServiceWeb' },
  ]),
];

/* ── Thread geometry ───────────────────────────────────────────────
   Refined so every stroke DEPICTS something a visitor can read — no
   decorative wandering. Hand-weighted curvature, pressure ghosts and
   overshoot hooks at direction changes; all decorative, aria-hidden;
   the fully-drawn state is the DOM/CSS default (or, where a stroke is
   scaffolding, its dissolved end-state is the default). */

/* Hero connector (desktop only — hidden when the grid stacks): the
   pen's journey through the fold. Each leg is labelled. */
const THREAD_HERO_D = [
  'M 128 176', /* enters at the left rail, below the nav keep-out */
  'C 116 258, 140 328, 128 402', /* runs the rail beside the copy */
  'C 122 450, 134 470, 176 486', /* flattens under the headline zone */
  'C 322 528, 522 540, 668 512', /* crosses the column gap — approved words flow toward the build */
  'C 706 502, 722 470, 726 436', /* rises to the frame's left edge (hand-off) */
  'C 728 416, 716 410, 710 424', /* overshoot hook — pen pressure at the turn */
  'C 758 556, 898 678, 1078 758', /* dives under the frame toward the vitals corner */
  'C 1148 790, 1206 810, 1252 818', /* terminal flick, settling at the caption line */
].join(' ');

/* The pen's approval underline beneath the built H1 — drawn only once
   the letterforms have solidified. Ends in a lift-off hook. */
const H1_UNDER_D = [
  'M 6 24', /* pen touches down at the first word */
  'C 120 28, 300 26, 448 18', /* one confident sweep under the line */
  'C 492 15, 520 12, 534 10', /* rises as the pen speeds up */
  'C 545 8, 549 14, 541 18', /* overshoot hook — the pen lifts */
].join(' ');

/* Scaffold stroke: the pen DRAWS the browser frame's outline (rounded
   rect, then the chrome divider) before the real frame assembles over
   it — then dissolves. Its end-state (invisible) is the CSS default. */
const FRAME_DRAW_D = [
  'M 46 8', /* pen touches down past the top-left corner */
  'C 300 4, 620 4, 872 10', /* top edge */
  'C 906 12, 914 22, 913 52', /* top-right corner */
  'C 916 200, 914 400, 908 548', /* right edge */
  'C 906 578, 894 590, 862 589', /* bottom-right corner */
  'C 620 596, 300 594, 60 588', /* bottom edge */
  'C 28 586, 16 574, 17 544', /* bottom-left corner */
  'C 12 400, 14 190, 18 64', /* left edge, back up */
  'C 19 26, 28 9, 46 8', /* top-left corner — the rectangle closes */
  'C 62 22, 62 40, 86 47', /* pen turns inward */
  'C 300 60, 620 58, 886 52', /* rules the browser-bar divider */
].join(' ');

/* Spec pass: a proof-reader's margin line. Near-vertical rail with a
   hand waver; at each included line's row the pen LEANS toward the
   text (uneven amplitudes — never metronomic), then exits bottom-right
   toward the velocity rail. Station dots on the items themselves fill
   as each line typesets. */
const THREAD_SPEC_D = [
  'M 96 -4', /* enters from the fold above */
  'C 84 64, 106 128, 94 206', /* passes the heading zone */
  'C 90 254, 92 296, 96 328', /* settles to reading pace */
  'C 122 340, 124 366, 100 382', /* lean 1 — toward the first included line */
  'C 88 396, 90 416, 94 442', /* return to the rail */
  'C 112 452, 114 476, 96 490', /* lean 2 (shallower) */
  'C 86 506, 88 528, 94 552', /* return */
  'C 126 566, 128 596, 102 612', /* lean 3 (deepest — the long line) */
  'C 90 626, 90 644, 94 664', /* return */
  'C 110 674, 112 696, 96 710', /* lean 4 (glancing) */
  'C 86 726, 88 748, 94 772', /* return */
  'C 120 784, 122 810, 100 826', /* lean 5 */
  'C 88 840, 90 862, 94 884', /* return */
  'C 114 894, 116 916, 98 930', /* lean 6 — the last line checked */
  'C 92 944, 96 958, 108 968', /* the pass is done — pen accelerates */
  'C 134 984, 176 992, 228 996', /* exits right, toward the velocity rail */
].join(' ');

/* Rate card: the main thread FORKS a branch off itself for each
   package group — flat entry (the through-line), then the branch
   climbs away with a flick. */
const BRANCH_D = 'M 4 30 C 44 22, 64 34, 96 24 C 120 17, 142 20, 156 12';

/* Row hover: the pen underlines the exact line you're considering
   (CSS dashoffset pull — fine pointers only). */
const ROW_LINE_D = 'M 3 10 C 130 14, 330 6, 540 10 C 680 13, 780 8, 836 10';

/* The finale: the thread signs off beneath the closing headline — an
   underline sweep that rises into a small loop flourish and exits with
   a pen-lift. Rendered as three layered strokes (press/mid/tip) drawn
   to different lengths, so the line visibly TAPERS as pressure comes
   off the nib: a signature on the finished build. */
const SIG_D = [
  'M 10 52', /* pen touches down under the first word */
  'C 150 62, 380 58, 552 44', /* the long sweep beneath the closing line */
  'C 600 40, 634 32, 648 24', /* rises — the pen accelerates into the flourish */
  'C 656 18, 648 12, 638 18', /* loop, top half */
  'C 628 25, 638 34, 658 32', /* loop closes over itself */
  'C 692 28, 718 18, 738 8', /* exit flick up-right — the pen leaves the page */
].join(' ');

/* The pipeline morph — one stroke living four lives, each a legible
   picture of its stage. The DOM default is the final Launch arc;
   arming rewinds it to the Brief state. */
const PIPE_STATES = [
  /* BRIEF — the pen annotates the brief: three connected underline
     strokes beneath imagined lines of text, ending in a lift hook. */
  'M 46 118 C 108 110, 182 108, 240 114 C 262 117, 264 128, 240 134 C 180 146, 110 142, 64 150 C 46 153, 44 164, 62 170 C 112 180, 188 176, 246 182 C 270 185, 276 176, 266 168',
  /* DESIGN — one stroke draws the wireframe: the page rectangle
     closes, then the pen turns inward and rules the header bar. */
  'M 76 84 C 140 78, 210 78, 246 84 C 256 110, 256 168, 250 222 C 192 230, 120 230, 78 224 C 70 180, 70 130, 74 94 C 82 100, 92 106, 108 108 C 158 112, 208 112, 244 108',
  /* BUILD — a structural truss: bottom chord laid first, then the
     web members triangulate up to the top chord. Scaffolding, not
     glyph cosplay. */
  'M 46 224 C 118 219, 196 219, 272 224 C 252 214, 226 182, 214 148 C 166 141, 112 141, 68 148 C 86 166, 118 196, 144 214 C 166 196, 192 170, 208 150',
  /* LAUNCH — ground roll, rotation, climb-out: the terminal points
     skyward. This is the state the static page ships. */
  'M 44 254 C 98 252, 152 242, 196 212 C 244 180, 270 130, 282 74 C 286 56, 288 40, 287 26',
];

function ThreadPath({ d, ghost = true }) {
  return (
    <>
      {ghost && <path className="lv-tghost" d={d} pathLength="1" />}
      <path className="lv-tmain" d={d} pathLength="1" />
    </>
  );
}

/* ── Price odometer (memo graft 3) ─────────────────────────────────
   Rolling digits on the Pay once / Monthly toggle. Labels that don't
   decompose into digits fall back to an instant swap; Geist Mono keeps
   every numeral the same width and the price cell is fixed-width, so
   the roll causes zero layout shift. Static mode renders plain text. */
const PRICE_RE = /^([^0-9]*)([0-9][0-9,]*)(.*)$/;

function PriceOdometer({ label, animate }) {
  const hostRef = useRef(null);
  const prevLabelRef = useRef(label);
  const m = animate ? PRICE_RE.exec(label) : null;

  useLayoutEffect(() => {
    const prevLabel = prevLabelRef.current;
    prevLabelRef.current = label;
    if (!animate || prevLabel === label) return;
    const host = hostRef.current;
    if (!host) return;
    const pm = PRICE_RE.exec(prevLabel);
    const nm = PRICE_RE.exec(label);
    if (!pm || !nm) return; /* defensive: instant swap already rendered */
    const prevChars = pm[2].split('');
    const nextChars = nm[2].split('');
    const offset = prevChars.length - nextChars.length;
    host.querySelectorAll('.lv-odo-slot').forEach((slot) => {
      const idx = Number(slot.dataset.idx);
      const target = Number(slot.dataset.digit);
      const strip = slot.firstElementChild;
      const h = slot.clientHeight;
      const prevChar = prevChars[idx + offset];
      const from = prevChar != null && /[0-9]/.test(prevChar) ? Number(prevChar) : null;
      if (from == null) {
        gsap.fromTo(strip, { y: -target * h, opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' });
      } else if (from !== target) {
        gsap.fromTo(
          strip,
          { y: -from * h, opacity: 1 },
          { y: -target * h, duration: 0.55, ease: 'power3.inOut', delay: idx * 0.035 },
        );
      } else {
        gsap.set(strip, { y: -target * h, opacity: 1 });
      }
    });
    if (pm[3] !== nm[3]) {
      const suffix = host.querySelector('.lv-odo-suffix');
      if (suffix) gsap.fromTo(suffix, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' });
    }
  }, [label, animate]);

  if (!m) return <span className="lv-price-text">{label}</span>;
  const [, prefix, digits, suffix] = m;
  return (
    <span className="lv-odo" ref={hostRef}>
      <span className="lv-odo-live" aria-hidden="true">
        {prefix && <span className="lv-odo-fix">{prefix}</span>}
        {digits.split('').map((ch, i) =>
          /[0-9]/.test(ch) ? (
            <span className="lv-odo-slot" key={i} data-idx={i} data-digit={ch}>
              <span
                className="lv-odo-strip"
                style={{ transform: `translateY(${-Number(ch) * 1.18}em)` }}
              >
                {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ) : (
            <span className="lv-odo-fix" key={i}>
              {ch}
            </span>
          ),
        )}
        {suffix && <span className="lv-odo-fix lv-odo-suffix">{suffix}</span>}
      </span>
      <span className="lv-sr">{label}</span>
    </span>
  );
}

/* ── Vitals strip (memo graft 2) ───────────────────────────────────
   Real fps / transferred kB / LCP from the Performance APIs, updated
   at 1Hz only while a strip is on screen and the tab is visible
   (memo §2.3.4). Prerender/reduced-motion rests on em-dashes. */
function VitalsStrip({ id }) {
  return (
    <p className="lv-vitals" id={id} aria-hidden="true">
      <span className="lv-vit-label">live vitals</span>
      <span className="lv-vit" data-vit="fps">— fps</span>
      <span className="lv-vit" data-vit="kb">— kb</span>
      <span className="lv-vit" data-vit="lcp">lcp —</span>
    </p>
  );
}

/* ── Chrome pin — forced dark stage ────────────────────────────────
   `.lv-on-stage` pins the full --c4-* set dark (web-arm.css) for the
   life of the page. ThemeProvider re-applies its own tokens from a
   parent effect, so a guarded MutationObserver re-asserts (house
   pattern: ServiceAI/Foresight). `.wa-on-sheet` is retired. */
function useForceDark() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.className;
    const assertDark = () => {
      if (
        !root.classList.contains('dark-mode') ||
        !root.classList.contains('lv-on-stage') ||
        root.classList.contains('light-mode') ||
        root.classList.contains('vivid')
      ) {
        root.classList.add('dark-mode', 'lv-on-stage');
        root.classList.remove('light-mode', 'vivid');
      }
    };
    assertDark();
    const observer = new MutationObserver(assertDark);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer.disconnect();
      root.className = prev;
      root.classList.remove('lv-on-stage');
    };
  }, []);
}

export default function ServiceWeb() {
  useForceDark();
  const rootRef = useRef(null);
  const h1Ref = useRef(null);
  const ledeRef = useRef(null);
  const lenisRef = useRef(null);
  const openerRef = useRef(null);
  const flipStateRef = useRef(null);
  const panelRef = useRef(null);

  const [billing, setBilling] = useState('once');
  const isMonthly = billing === 'monthly';
  const [openCase, setOpenCase] = useState(null);

  const prerender = useMemo(
    () => typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent),
    [],
  );
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const staticMode = reduced || prerender;

  useDocumentHead({
    title: 'Web & Applications — C4 Studios Perth',
    description:
      'Custom websites, web apps, SaaS platforms and ecommerce stores. Built to convert, designed to last. Perth-based, working Australia-wide.',
    path: '/ServiceWeb',
    jsonLd: WEB_JSONLD,
  });

  /* Lenis owns scroll on this route (shared instance if another page
     already made one — PrivateAI pattern). Never in static mode. */
  useEffect(() => {
    if (staticMode) return undefined;
    const w = window;
    if (w.__c4Lenis) {
      lenisRef.current = w.__c4Lenis;
      return undefined;
    }
    /* lerp (not duration) — a constant-rate catch-up reads calmer under
       scrub than an eased fixed-duration glide, and 0.1 keeps Lenis and
       the ScrollTrigger scrub smoothing (0.8–1) in the same register. */
    const lenis = new Lenis({ lerp: 0.1 });
    w.__c4Lenis = lenis;
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); /* restore the GSAP default */
      lenis.destroy();
      delete w.__c4Lenis;
      lenisRef.current = null;
    };
  }, [staticMode]);

  /* ── The whole motion system ──────────────────────────────────────
     One matchMedia block; every trigger created inside it. The armed
     class only marks the root (sticky-stage heights); GSAP owns all
     pre-animation states via fromTo, so the static DOM stays final. */
  useLayoutEffect(() => {
    if (staticMode) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;
    root.classList.add('lv-armed');
    const mm = gsap.matchMedia(root);
    const splits = [];

    mm.add(
      {
        desk: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        mob: '(max-width: 899.98px) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { desk } = ctx.conditions;
        const q = gsap.utils.selector(root);

        /* ── Title prep: the raw→built telling, rebuilt for smoothness.
           SplitText at WORD level (6 targets — cheap enough to
           re-rasterize continuously, unlike ~35 chars), and every
           word's box is LOCKED to its final built width. The DOM
           default IS wght 800/wdth 100, so the measurement is exact:
           the axes then animate inside fixed slots — skeleton glyphs
           sit light and narrow in loose tracking, then inflate to
           fill their line — with zero layout shift, zero rewrap. */
        let h1Words = null;
        const lockH1 = () => {
          if (!h1Words) return;
          h1Words.forEach((w) => {
            /* Clearing the vars drops each word to the @property
               initial values (800/100 — the built state) before
               measuring, so a mid-scrub refresh still locks to the
               FINAL metrics, never a half-inflated snapshot. */
            w.style.removeProperty('--lv-wght');
            w.style.removeProperty('--lv-wdth');
            w.style.width = 'auto';
          });
          const widths = h1Words.map((w) => w.getBoundingClientRect().width);
          h1Words.forEach((w, i) => {
            w.style.width = `${widths[i]}px`;
          });
        };
        if (h1Ref.current) {
          const split = SplitText.create(h1Ref.current, { type: 'words', wordsClass: 'lv-w' });
          splits.push(split);
          h1Words = split.words;
          lockH1();
        }

        /* ── Fold 0: ignition. The hero disassembles to raw (skeleton
           type, scattered wireframe, undrawn thread) and rebuilds as
           you scrub — performing the job on itself. Desktop pins;
           mobile plays the same beats once as a 1.2s load pass. */
        const buildHero = (tl) => {
          /* The pen's journey (legs labelled in THREAD_HERO_D): left
             rail → under the headline → across the gap → hand-off at
             the frame's edge → out to the vitals corner. */
          tl.fromTo(
            q('.lv-thread--hero path'),
            { drawSVG: '0%' },
            { drawSVG: '100%', ease: 'none', duration: 0.66 },
            0,
          );
          tl.fromTo(
            q('.lv-kicker'),
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.1, ease: 'c4' },
            0.02,
          );
          if (h1Words) {
            tl.fromTo(
              h1Words,
              { '--lv-wght': 300, '--lv-wdth': 62, color: '#8a8f98' },
              {
                '--lv-wght': 800,
                '--lv-wdth': 100,
                color: '#f4f3f1',
                duration: 0.38,
                stagger: { each: 0.045 },
                ease: 'power2.out',
              },
              0.05,
            );
          } else {
            tl.fromTo(
              q('.lv-h1'),
              { '--lv-wght': 300, '--lv-wdth': 62, color: '#8a8f98' },
              { '--lv-wght': 800, '--lv-wdth': 100, color: '#f4f3f1', duration: 0.45, ease: 'power2.out' },
              0.05,
            );
          }
          /* The pen approves the finished words — the underline draws
             as the last word settles (word ripple ends ~0.66). */
          tl.fromTo(
            q('.lv-h1-under path'),
            { drawSVG: '0%' },
            { drawSVG: '100%', duration: 0.16, ease: 'power2.inOut' },
            0.56,
          );
          if (desk && ledeRef.current) {
            const ledeSplit = SplitText.create(ledeRef.current, { type: 'lines', mask: 'lines' });
            splits.push(ledeSplit);
            tl.fromTo(
              ledeSplit.lines,
              { yPercent: 115 },
              { yPercent: 0, duration: 0.2, stagger: 0.05, ease: 'power3.out' },
              0.18,
            );
          } else {
            tl.fromTo(
              q('.lv-lede'),
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.2, ease: 'c4' },
              0.18,
            );
          }
          /* autoAlpha on the CONTAINER (not the children): the buttons
             stay free of y-transforms so the magnetic hover can own
             them, and visibility:hidden still keeps the invisible CTAs
             out of clicks and tab order at scrub rest. */
          tl.fromTo(
            q('.lv-hero-cta'),
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.2, ease: 'c4' },
            0.3,
          );
          /* Parallax layer: the whole figure rises at its own rate
             while the copy column sits still — two depths, one scrub. */
          tl.fromTo(
            q('.lv-hero-fig'),
            { y: 34 },
            { y: 0, duration: 0.3, ease: 'power2.out' },
            0.3,
          );
          /* The pen DRAWS the frame before the frame exists: scaffold
             outline + chrome divider (FRAME_DRAW_D), which dissolves
             once the real browser has assembled over it. Its CSS
             default is opacity 0, so static mode ships the finished
             frame with no scaffold. */
          tl.set(q('.lv-frame-draw'), { opacity: 1 }, 0.36);
          tl.fromTo(
            q('.lv-frame-draw path'),
            { drawSVG: '0%' },
            { drawSVG: '100%', duration: 0.18, ease: 'power2.inOut' },
            0.38,
          );
          /* Browser frame assembles out of the silver wireframe; the
             capture arrives ALREADY GRADED behind a clip wipe (the
             mono→colour grade belongs to Home — memo §2.1.3). */
          tl.fromTo(
            q('.lv-wire-piece'),
            {
              opacity: 1,
              x: (i) => [-46, 60, -28][i % 3],
              y: (i) => [38, -30, 52][i % 3],
              rotation: (i) => [-7, 5, -3][i % 3],
            },
            { opacity: 0, x: 0, y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' },
            0.3,
          );
          tl.fromTo(
            q('.lv-hero-browser'),
            { opacity: 0 },
            { opacity: 1, duration: 0.18, ease: 'power1.inOut' },
            0.46,
          );
          tl.fromTo(
            q('.lv-hero-browser .lv-browser-view img'),
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0% 0 0% 0)', duration: 0.22, ease: 'power2.inOut' },
            0.56,
          );
          /* Scaffold removed — the drawn outline dissolves under the
             finished build (end-state: invisible, = the CSS default). */
          tl.to(
            q('.lv-frame-draw'),
            { opacity: 0, duration: 0.08, ease: 'power1.out' },
            0.74,
          );
          tl.fromTo(
            q('.lv-hero-cap'),
            { opacity: 0 },
            { opacity: 1, duration: 0.12, ease: 'power1.out' },
            0.78,
          );
          tl.fromTo(
            q('#lv-vitals-hero'),
            { opacity: 0 },
            { opacity: 1, duration: 0.12, ease: 'power1.out' },
            0.12,
          );
        };

        if (desk) {
          const heroTl = gsap.timeline({
            scrollTrigger: {
              trigger: q('.lv-hero')[0],
              start: 'top top',
              end: '+=180%',
              pin: q('.lv-stagebox')[0],
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              /* Re-lock the word boxes at every refresh (resize, font
                 arrival) so the locked widths always match the final
                 metrics at the CURRENT viewport. */
              onRefreshInit: lockH1,
            },
          });
          buildHero(heroTl);
          /* Final beat: the built capture starts to pan — momentum
             handed to the page. */
          heroTl.to(
            q('.lv-hero-browser .lv-browser-view img'),
            { yPercent: -7, duration: 0.2, ease: 'none' },
            0.8,
          );
        } else {
          const loadTl = gsap.timeline({ defaults: { ease: 'c4' } });
          buildHero(loadTl);
          loadTl.duration(1.2);
          /* Once the load pass lands, unlock the word boxes so the
             built headline reflows naturally on later resizes. */
          loadTl.eventCallback('onComplete', () => {
            if (h1Words) {
              h1Words.forEach((w) => {
                w.style.width = '';
              });
            }
          });
        }

        /* ── Fold 1: the spec pass. The margin line runs a proof-
           reader's pass down the list (leans labelled in
           THREAD_SPEC_D); each included line typesets with a width-
           settle and its station dot fills as the pen passes. */
        gsap.fromTo(
          q('.lv-thread--spec path'),
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: q('.lv-spec')[0],
              start: 'top 78%',
              end: 'bottom 55%',
              scrub: 1,
            },
          },
        );
        q('.lv-spec-item').forEach((li) => {
          gsap.fromTo(
            li,
            { opacity: 0, x: -20, fontStretch: '75%' },
            {
              opacity: 1,
              x: 0,
              fontStretch: '100%',
              duration: 0.7,
              ease: 'c4',
              scrollTrigger: { trigger: li, start: 'top 88%', once: true },
            },
          );
          /* Progress cue: the station fills (scales in) as its line is
             checked off. Filled is the DOM default — static mode ships
             every station lit. */
          const dot = li.querySelector('.lv-station');
          if (dot) {
            gsap.fromTo(
              dot,
              { scale: 0 },
              {
                scale: 1,
                duration: 0.5,
                ease: 'c4',
                scrollTrigger: { trigger: li, start: 'top 88%', once: true },
              },
            );
          }
        });

        /* ── Velocity rail: moves only with YOUR scroll energy —
           diagonal shear reveal, then skew/translate fed by scroll
           velocity, decaying dead-still at rest. */
        const rail = q('.lv-rail')[0];
        if (rail) {
          gsap.fromTo(
            rail,
            { clipPath: 'polygon(0 100%, 100% 62%, 100% 100%, 0 100%)' },
            {
              clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
              ease: 'none',
              scrollTrigger: { trigger: rail, start: 'top 96%', end: 'top 55%', scrub: 0.8 },
            },
          );
          const track = q('.lv-rail-track')[0];
          const xTo = gsap.quickTo(track, 'xPercent', { duration: 0.6, ease: 'power2.out' });
          const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.45, ease: 'power2.out' });
          const settle = gsap.delayedCall(0.15, () => skewTo(0)).pause();
          ScrollTrigger.create({
            trigger: rail,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
              const v = gsap.utils.clamp(-2600, 2600, self.getVelocity());
              xTo(-6 - self.progress * 22);
              skewTo((v / 2600) * 5);
              settle.restart(true);
            },
          });
        }

        /* ── Fold 2: proof reel. DSR featured drive — the desktop
           capture browses itself, then hands off to the pre-positioned
           phone via clip/transform crossfade on the same scrub (memo
           amendment: no Flip inside an active scene). */
        const dsr = q('.lv-drive--dsr')[0];
        if (dsr && desk) {
          const dCol = dsr.querySelector('.lv-dsr-dcol');
          const dView = dsr.querySelector('.lv-dsr-desktop .lv-browser-view');
          const mCol = dsr.querySelector('.lv-dsr-mcol');
          const mView = dsr.querySelector('.lv-phone-view');
          /* Entrance: the stage focuses in (soft blur + scale) before
             the pin engages — one short pass, filter cleared after. */
          gsap.fromTo(
            dsr.querySelector('.lv-drive-stage'),
            { scale: 0.975, filter: 'blur(3px)' },
            {
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.8,
              ease: 'power2.out',
              clearProps: 'filter',
              scrollTrigger: { trigger: dsr, start: 'top 85%', once: true },
            },
          );
          const driveTl = gsap.timeline({
            scrollTrigger: {
              trigger: dsr,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          /* Counter-rate parallax: the copy column drifts slowly
             against the browsing captures — two depths in the pin. */
          driveTl.fromTo(
            dsr.querySelector('.lv-drive-id'),
            { y: 30 },
            { y: -30, ease: 'none', duration: 1 },
            0,
          );
          driveTl.to(dCol, {
            y: () => -(dCol.scrollHeight - dView.clientHeight),
            ease: 'none',
            duration: 0.45,
          }, 0);
          driveTl.to(
            dsr.querySelector('.lv-dsr-desktop'),
            { opacity: 0.35, scale: 0.965, duration: 0.13, ease: 'power1.inOut' },
            0.47,
          );
          driveTl.fromTo(
            dsr.querySelector('.lv-phone'),
            { opacity: 0.3, scale: 0.94, clipPath: 'inset(56% 0% 0% 0% round 26px)' },
            {
              opacity: 1,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0% round 26px)',
              duration: 0.15,
              ease: 'power2.out',
              immediateRender: true,
            },
            0.46,
          );
          driveTl.to(mCol, {
            y: () => -(mCol.scrollHeight - mView.clientHeight),
            ease: 'none',
            duration: 0.38,
          }, 0.62);
        }

        /* Groverz — the light set pans through its whole site as the
           frame crosses the viewport. */
        const gz = q('.lv-drive--gz')[0];
        if (gz) {
          const col = gz.querySelector('.lv-gz-col');
          const view = gz.querySelector('.lv-browser-view');
          /* Frame focuses in as it enters (blur ≤3px, short), then the
             capture pans under a clean filterless frame. */
          gsap.fromTo(
            gz.querySelector('.lv-browser'),
            { scale: 0.97, filter: 'blur(3px)', opacity: 0.4 },
            {
              scale: 1,
              filter: 'blur(0px)',
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              clearProps: 'filter',
              scrollTrigger: { trigger: gz, start: 'top 88%', once: true },
            },
          );
          gsap.to(col, {
            y: () => -(col.scrollHeight - view.clientHeight),
            ease: 'none',
            scrollTrigger: {
              trigger: gz,
              start: 'top 85%',
              end: 'bottom 15%',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          /* Counter-rate copy drift — same depth grammar as the DSR
             pin, running on the section's own transit. */
          gsap.fromTo(
            gz.querySelector('.lv-drive-id'),
            { y: 26 },
            {
              y: -26,
              ease: 'none',
              scrollTrigger: {
                trigger: gz,
                start: 'top 85%',
                end: 'bottom 15%',
                scrub: 1,
              },
            },
          );
        }

        /* Reel head + static case frames: staggered arrivals. */
        gsap.fromTo(
          q('.lv-reel-head'),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'c4',
            scrollTrigger: { trigger: q('.lv-reel')[0], start: 'top 80%', once: true },
          },
        );
        q('.lv-case').forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 44, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              delay: (i % 2) * 0.08,
              ease: 'c4',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            },
          );
          const fig = el.querySelector('.lv-case-fig');
          if (!fig) return;
          /* Frame focuses in — short soft blur/scale. Transform AND
             filter cleared on completion: nothing keeps compositing,
             and the CSS hover lift gets its transform slot back. */
          gsap.fromTo(
            fig,
            { scale: 0.97, filter: 'blur(3px)' },
            {
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.7,
              delay: (i % 2) * 0.08,
              ease: 'power2.out',
              clearProps: 'transform,filter',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            },
          );
          /* Depth: the capture drifts inside its cropped frame at an
             alternating counter-rate to the scroll — transform-only,
             scrubbed, dead still at rest. */
          const img = fig.querySelector('img');
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: i % 2 ? 3.2 : -3.2, scale: 1.07 },
              {
                yPercent: i % 2 ? -3.2 : 3.2,
                scale: 1.07,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
              },
            );
          }
        });

        /* Decode capture sets just ahead of their entrance so drive
           swaps never jank (memo §3). */
        const decodeIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.querySelectorAll('img').forEach((img) => {
                if (img.decode) img.decode().catch(() => {});
              });
              decodeIO.unobserve(entry.target);
            });
          },
          { rootMargin: '140% 0px' },
        );
        q('.lv-drive, .lv-cases').forEach((el) => decodeIO.observe(el));

        /* ── Fold 3: rate card — group branches draw once; rows rise. */
        q('.lv-branch path').forEach((p) => {
          gsap.fromTo(
            p,
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: { trigger: p.closest('.lv-group'), start: 'top 82%', once: true },
            },
          );
        });
        q('.lv-line').forEach((row) => {
          gsap.fromTo(
            row,
            { y: 26, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'c4',
              scrollTrigger: { trigger: row, start: 'top 92%', once: true },
            },
          );
        });

        /* ── Fold 4: the pipeline morph — the thread's four legible
           lives (each state labelled in PIPE_STATES):
             Brief  = annotated underlines on the brief's lines,
             Design = one stroke draws the wireframe + header bar,
             Build  = the structural truss triangulates,
             Launch = ground roll → climb-out arc (the DOM default).
           Arming rewinds the stroke to Brief; station dots stay lit
           once their stage has been passed. */
        const morphPaths = q('.lv-morph path');
        if (morphPaths.length) {
          gsap.set(morphPaths, { attr: { d: PIPE_STATES[0] } });
          /* 0.72 dim floor: the 15px stage <p> (--lv-body over the
             stage) blends to ~4.8:1 computed — above the 4.5:1 body
             floor. (0.55 only cleared for the h3, not the body copy.) */
          gsap.set(q('.lv-stage-item'), { opacity: 0.72 });
          gsap.set(q('.lv-stage-dot'), { scale: 0.42, opacity: 0.4 });
          const pipeTl = gsap.timeline({
            scrollTrigger: {
              trigger: q('.lv-pipe')[0],
              start: 'top 62%',
              end: 'bottom 55%',
              scrub: 1,
            },
          });
          const stages = q('.lv-stage-item');
          const dots = q('.lv-stage-dot');
          /* A stage "goes live": its copy lifts to full ink and its
             station dot fills — and the dot STAYS filled afterwards
             (progress already made), while the copy dims back. */
          const liveStage = (i, at) => {
            pipeTl.to(stages[i], { opacity: 1, duration: 0.5, ease: 'none' }, at);
            if (dots[i]) {
              pipeTl.to(dots[i], { scale: 1, opacity: 1, duration: 0.35, ease: 'none' }, at);
            }
          };
          liveStage(0, 0); /* Brief goes live as the underlines settle */
          PIPE_STATES.slice(1).forEach((state, i) => {
            /* i=0: Brief→Design (underlines become the wireframe)
               i=1: Design→Build (wireframe becomes the truss)
               i=2: Build→Launch (truss becomes the climb-out) */
            pipeTl.to(
              morphPaths,
              { morphSVG: state, duration: 1, ease: 'power1.inOut' },
              0.5 + i,
            );
            liveStage(i + 1, 1 + i);
            if (i > 0) pipeTl.to(stages[i - 1], { opacity: 0.72, duration: 0.5, ease: 'none' }, 1 + i);
          });
          pipeTl.to(stages[2], { opacity: 0.72, duration: 0.5, ease: 'none' }, 3.4);
        }

        /* ── Fold 5: the drench wipes up, its content settling at a
           slower rate (depth under the clip), and the thread SIGNS
           OFF — the finale. Three layered strokes of one signature
           (SIG_D) draw with the tip running ahead of the pressure
           layers, so the line visibly tapers as the pen lifts: the
           studio's signature on the finished build. The tapered,
           fully-signed state is the CSS default (dasharray floors),
           so static mode ships it complete. */
        gsap.fromTo(
          q('.lv-drench')[0],
          { clipPath: 'inset(16% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: q('.lv-drench')[0], start: 'top 95%', end: 'top 55%', scrub: 0.9 },
          },
        );
        gsap.fromTo(
          q('.lv-drench-in'),
          { y: 44 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: q('.lv-drench')[0], start: 'top 95%', end: 'top 45%', scrub: 0.9 },
          },
        );
        const sigTl = gsap.timeline({
          scrollTrigger: { trigger: q('.lv-drench')[0], start: 'top 60%', once: true },
        });
        /* Tip leads (full length), the mid and press layers trail and
           stop short — composite = a stroke that thins to a point. */
        sigTl.fromTo(
          q('.lv-sig--tip'),
          { drawSVG: '0%' },
          { drawSVG: '0% 100%', duration: 1.05, ease: 'power2.inOut' },
          0,
        );
        sigTl.fromTo(
          q('.lv-sig--mid'),
          { drawSVG: '0%' },
          { drawSVG: '0% 88%', duration: 1, ease: 'power2.inOut' },
          0.05,
        );
        sigTl.fromTo(
          q('.lv-sig--press'),
          { drawSVG: '0%' },
          { drawSVG: '0% 72%', duration: 0.95, ease: 'power2.inOut' },
          0.1,
        );
        /* Signed → sealed: the CTA settles under the fresh signature. */
        sigTl.fromTo(
          q('.lv-drench .lv-btn'),
          { scale: 0.965 },
          { scale: 1, duration: 0.45, ease: 'c4' },
          0.9,
        );

        /* ── Magnetic primaries (fine pointers, desktop): the two red
           CTAs lean toward the cursor inside their own hitbox and
           glide back on leave. Transform-only; capped ±12/±8px. */
        const magnetCleanups = [];
        if (desk && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          q('.lv-btn').forEach((btn) => {
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
            magnetCleanups.push(() => {
              btn.removeEventListener('pointermove', onMove);
              btn.removeEventListener('pointerleave', onLeave);
            });
          });
        }

        return () => {
          magnetCleanups.forEach((fn) => fn());
          magnetCleanups.length = 0;
          splits.forEach((s) => s.revert());
          splits.length = 0;
          decodeIO.disconnect();
        };
      },
    );

    /* Cold-load safety: if Archivo lands after arming, the locked
       word boxes were measured against the fallback face — one
       refresh re-locks them (onRefreshInit) against the real
       metrics and re-renders every scrubbed timeline in place. */
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => {
      mm.revert();
      root.classList.remove('lv-armed');
    };
  }, [staticMode]);

  /* ── Vitals sampling: 1Hz, only while a strip is visible AND the
     tab is foreground. Writes straight to the DOM (no re-renders). */
  useEffect(() => {
    if (staticMode) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;
    let rafId = 0;
    let frames = 0;
    let last = performance.now();
    let running = false;
    let anyVisible = false;
    let lcpSec = null;
    let po = null;
    try {
      po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const latest = entries[entries.length - 1];
        if (latest) lcpSec = (latest.renderTime || latest.loadTime) / 1000;
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      po = null;
    }
    const count = () => {
      frames += 1;
      rafId = requestAnimationFrame(count);
    };
    const setRunning = () => {
      const should = anyVisible && !document.hidden;
      if (should && !running) {
        running = true;
        frames = 0;
        last = performance.now();
        rafId = requestAnimationFrame(count);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(rafId);
      }
    };
    const tick = window.setInterval(() => {
      if (!running) return;
      const now = performance.now();
      const fps = Math.min(120, Math.round((frames * 1000) / Math.max(1, now - last)));
      frames = 0;
      last = now;
      let bytes = 0;
      try {
        const nav = performance.getEntriesByType('navigation')[0];
        if (nav) bytes += nav.transferSize || 0;
        performance.getEntriesByType('resource').forEach((r) => {
          bytes += r.transferSize || 0;
        });
      } catch {
        bytes = 0;
      }
      const kb = Math.round(bytes / 1024);
      root.querySelectorAll('[data-vit="fps"]').forEach((el) => {
        el.textContent = `${fps} fps`;
      });
      root.querySelectorAll('[data-vit="kb"]').forEach((el) => {
        el.textContent = kb > 0 ? `${kb} kb` : '— kb';
      });
      root.querySelectorAll('[data-vit="lcp"]').forEach((el) => {
        el.textContent = lcpSec ? `lcp ${lcpSec.toFixed(2)}s` : 'lcp —';
      });
    }, 1000);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.dataset.vitOn = entry.isIntersecting ? '1' : '';
      });
      anyVisible = Array.from(root.querySelectorAll('.lv-vitals')).some((el) => el.dataset.vitOn === '1');
      setRunning();
    });
    root.querySelectorAll('.lv-vitals').forEach((el) => io.observe(el));
    const onVis = () => setRunning();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(tick);
      cancelAnimationFrame(rafId);
      io.disconnect();
      if (po) po.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [staticMode]);

  /* ── Case morph: click-time Flip (the one place Flip is allowed).
     The overlay is an enhancement over the always-rendered captions
     and links; static mode gets a plain conditional render. */
  const activeCase = openCase ? CASES.find((c) => c.key === openCase) : null;

  const handleOpenCase = (key, event) => {
    openerRef.current = event.currentTarget;
    if (!staticMode) {
      const img = event.currentTarget.querySelector('img');
      if (img) flipStateRef.current = Flip.getState(img);
    }
    setOpenCase(key);
  };

  const handleCloseCase = () => {
    const panel = panelRef.current;
    const finish = () => {
      setOpenCase(null);
      if (openerRef.current) openerRef.current.focus();
    };
    if (!staticMode && panel) {
      gsap.to(panel, { opacity: 0, scale: 0.985, duration: 0.24, ease: 'power1.in', onComplete: finish });
    } else {
      finish();
    }
  };

  useLayoutEffect(() => {
    if (!openCase) return undefined;
    const panel = panelRef.current;
    if (panel && !staticMode && flipStateRef.current) {
      const img = panel.querySelector('img');
      if (img) {
        Flip.from(flipStateRef.current, {
          targets: img,
          absolute: true,
          duration: 0.65,
          ease: 'c4',
        });
      }
      flipStateRef.current = null;
      gsap.fromTo(
        panel.querySelectorAll('.lv-panel-copy > *'),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.3, ease: 'c4' },
      );
    }
    const closeBtn = panel ? panel.querySelector('.lv-panel-close') : null;
    if (closeBtn) closeBtn.focus();
    const lenis = lenisRef.current;
    if (lenis) lenis.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        handleCloseCase();
        return;
      }
      /* Contain Tab inside the dialog: aria-modal announces the page
         as hidden to AT, so sighted keyboard focus must not walk into
         the scroll-locked background either. */
      if (e.key === 'Tab' && panel) {
        const focusables = panel.querySelectorAll('a[href], button:not([disabled])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const inside = panel.contains(document.activeElement);
        if (e.shiftKey && (!inside || document.activeElement === first)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (lenis) lenis.start();
    };
  }, [openCase, staticMode]);

  const monthlyNote = `${subscriptionInfo.howItWorks} ${subscriptionInfo.whatsIncluded} ${subscriptionInfo.ownership} ${subscriptionInfo.cancellation}`;

  return (
    <div className="lv-root" ref={rootRef}>
      {/* ══ Fold 0 — IGNITION ═══════════════════════════════════════ */}
      <section className="lv-hero">
        <div className="lv-stagebox">
          <svg
            className="lv-thread lv-thread--hero"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            focusable="false"
          >
            <ThreadPath d={THREAD_HERO_D} />
          </svg>

          <div className="lv-frame lv-hero-grid">
            <div className="lv-hero-copy">
              <p className="lv-kicker">C1 · Web &amp; Applications — arm of C4 Studios · Perth, WA</p>
              <h1 className="lv-h1" ref={h1Ref}>
                Websites built to convert and scale.
              </h1>
              {/* The pen's approval underline — anchored to the H1 so
                  it registers at every viewport. Fully drawn is the
                  DOM default. */}
              <svg
                className="lv-h1-under"
                viewBox="0 0 560 34"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <ThreadPath d={H1_UNDER_D} />
              </svg>
              <p className="lv-lede" ref={ledeRef}>
                From a crisp landing page to a full web application — every project is
                scoped clearly, designed carefully, and delivered on time.
              </p>
              <div className="lv-hero-cta">
                <Link className="lv-btn" to={`${START}?service=web_design`}>
                  Start a brief
                  <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
                </Link>
                <Link className="lv-link" to={PORTFOLIO}>
                  See the work
                  <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <figure className="lv-hero-fig">
              {/* Scaffold stroke: the pen draws the frame's outline +
                  chrome divider before the real browser assembles,
                  then dissolves. Invisible (dissolved) is the DOM
                  default — static mode ships the finished frame. */}
              <svg
                className="lv-frame-draw"
                viewBox="0 0 920 600"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <ThreadPath d={FRAME_DRAW_D} ghost={false} />
              </svg>
              <span className="lv-wire-piece lv-wire-piece--bar" aria-hidden="true" />
              <span className="lv-wire-piece lv-wire-piece--body" aria-hidden="true" />
              <span className="lv-wire-piece lv-wire-piece--side" aria-hidden="true" />
              <div className="lv-browser lv-hero-browser">
                <div className="lv-browser-bar" aria-hidden="true">
                  <span className="lv-dot" />
                  <span className="lv-dot" />
                  <span className="lv-dot" />
                  <span className="lv-browser-url">sharpbricklaying.com.au</span>
                </div>
                <div className="lv-browser-view">
                  <img
                    src={sharpHero}
                    width={900}
                    height={563}
                    loading="eager"
                    decoding="async"
                    alt="Sharp Bricklaying home page — a drone aerial of finished brickwork behind the studio wordmark."
                  />
                </div>
              </div>
              <figcaption className="lv-cap lv-hero-cap">
                sharp bricklaying · shipped 2026
              </figcaption>
            </figure>
          </div>

          <VitalsStrip id="lv-vitals-hero" />
        </div>
      </section>

      {/* ══ Fold 1 — THE SPEC PASS ══════════════════════════════════ */}
      <section className="lv-spec">
        <svg
          className="lv-thread lv-thread--spec"
          viewBox="0 0 320 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <ThreadPath d={THREAD_SPEC_D} />
        </svg>
        <div className="lv-frame">
          <h2 className="lv-h2">Every project includes</h2>
          <ul className="lv-spec-list">
            {INCLUDED.map((item) => (
              <li className="lv-spec-item" key={item}>
                <span className="lv-station" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ Divider — the velocity rail ═════════════════════════════ */}
      <div className="lv-rail">
        <div className="lv-rail-track">
          <span className="lv-rail-text">Design · Build · Ship · Perth&ensp;·&ensp;</span>
          <span className="lv-rail-text" aria-hidden="true">
            Design · Build · Ship · Perth&ensp;·&ensp;
          </span>
        </div>
      </div>

      {/* ══ Fold 2 — THE PROOF REEL ═════════════════════════════════ */}
      <section className="lv-reel">
        <div className="lv-frame">
          <div className="lv-reel-head">
            <div>
              <h2 className="lv-h2">Live sites, browsing themselves.</h2>
              <p className="lv-sub">
                Real client work, driving itself as you scroll. Every frame opens the
                wider record.
              </p>
            </div>
            <Link className="lv-link" to={PORTFOLIO}>
              Full portfolio
              <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Featured drive — DSR with the desktop→phone handoff. */}
        <div className="lv-drive lv-drive--dsr">
          <div className="lv-drive-sticky">
            <div className="lv-frame lv-drive-grid">
              <div className="lv-drive-stage">
                <div className="lv-browser lv-dsr-desktop">
                  <div className="lv-browser-bar" aria-hidden="true">
                    <span className="lv-dot" />
                    <span className="lv-dot" />
                    <span className="lv-dot" />
                    <span className="lv-browser-url">{DSR.url}</span>
                  </div>
                  <div className="lv-browser-view">
                    <div className="lv-col lv-dsr-dcol">
                      {DSR.desktop.map((f) => (
                        <img
                          key={f.src}
                          src={f.src}
                          width={f.w}
                          height={f.h}
                          loading="lazy"
                          decoding="async"
                          alt={f.alt}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="lv-phone" aria-label="The same site, responsive on mobile">
                  <span className="lv-phone-notch" aria-hidden="true" />
                  <div className="lv-phone-view">
                    <div className="lv-col lv-dsr-mcol">
                      {DSR.mobile.map((f) => (
                        <img
                          key={f.src}
                          src={f.src}
                          width={f.w}
                          height={f.h}
                          loading="lazy"
                          decoding="async"
                          alt={f.alt}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="lv-drive-id">
                <p className="lv-client">{DSR.name}</p>
                <p className="lv-scope">{DSR.scope}</p>
                <p className="lv-cap">
                  {DSR.place} · {DSR.year} · one build, every screen
                </p>
                <Link className="lv-link lv-link--small" to={PORTFOLIO}>
                  View in portfolio
                  <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Light drive — Groverz pans its whole site in one frame. */}
        <div className="lv-drive lv-drive--gz">
          <div className="lv-frame lv-drive-grid lv-drive-grid--flip">
            <div className="lv-drive-id">
              <p className="lv-client">{GROVERZ.name}</p>
              <p className="lv-scope">{GROVERZ.scope}</p>
              <p className="lv-cap">
                {GROVERZ.place} · {GROVERZ.year}
              </p>
              <Link className="lv-link lv-link--small" to={PORTFOLIO}>
                View in portfolio
                <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>
            <div className="lv-drive-stage">
              <div className="lv-browser">
                <div className="lv-browser-bar" aria-hidden="true">
                  <span className="lv-dot" />
                  <span className="lv-dot" />
                  <span className="lv-dot" />
                  <span className="lv-browser-url">{GROVERZ.url}</span>
                </div>
                <div className="lv-browser-view lv-browser-view--tall">
                  <div className="lv-col lv-gz-col">
                    {GROVERZ.frames.map((f) => (
                      <img
                        key={f.src}
                        src={f.src}
                        width={f.w}
                        height={f.h}
                        loading="lazy"
                        decoding="async"
                        alt={f.alt}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The record — static frames, click-time FLIP case morphs. */}
        <div className="lv-frame">
          <div className="lv-cases">
            {CASES.map((c) => (
              <div className={`lv-case lv-case--${c.key}`} key={c.key} data-open={openCase === c.key || undefined}>
                <button
                  type="button"
                  className="lv-case-fig"
                  onClick={(e) => handleOpenCase(c.key, e)}
                  aria-haspopup="dialog"
                  aria-label={`Open the ${c.name} case panel`}
                >
                  <img
                    src={c.img}
                    width={c.w}
                    height={c.h}
                    loading="lazy"
                    decoding="async"
                    alt={c.alt}
                    data-flip-id={`case-${c.key}`}
                  />
                </button>
                <div className="lv-case-tb">
                  <span className="lv-cap">
                    {c.name} · {c.year}
                  </span>
                  <span className="lv-case-scope">{c.scope}</span>
                  <Link className="lv-link lv-link--small" to={PORTFOLIO}>
                    View in portfolio
                    <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case panel — the FLIP destination. */}
      {activeCase && (
        <div className="lv-panel-backdrop" onClick={handleCloseCase} role="presentation">
          <div
            className="lv-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeCase.name} — case detail`}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="lv-panel-close" onClick={handleCloseCase} aria-label="Close case panel">
              <X size={18} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <div className="lv-browser lv-panel-browser">
              <div className="lv-browser-bar" aria-hidden="true">
                <span className="lv-dot" />
                <span className="lv-dot" />
                <span className="lv-dot" />
              </div>
              <div className="lv-browser-view">
                <img
                  src={activeCase.img}
                  width={activeCase.w}
                  height={activeCase.h}
                  alt={activeCase.alt}
                  data-flip-id={`case-${activeCase.key}`}
                />
              </div>
            </div>
            <div className="lv-panel-copy">
              <p className="lv-client">{activeCase.name}</p>
              <p className="lv-scope">{activeCase.scope}</p>
              <p className="lv-cap">
                {activeCase.place} · {activeCase.year}
              </p>
              <Link className="lv-btn lv-btn--ghostline" to={PORTFOLIO}>
                View in portfolio
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ══ Fold 3 — THE RATE CARD ══════════════════════════════════ */}
      <section className="lv-rate">
        <div className="lv-frame">
          <div className="lv-rate-head">
            <div>
              <h2 className="lv-h2">Pick a starting point.</h2>
              <p className="lv-sub">Clear scope at every tier — pay once, or spread it monthly.</p>
            </div>
            <div className="lv-switch" role="group" aria-label="Billing option">
              <span className="lv-switch-thumb" data-pos={isMonthly ? 'b' : 'a'} aria-hidden="true" />
              <button type="button" aria-pressed={!isMonthly} onClick={() => setBilling('once')}>
                Pay once
              </button>
              <button type="button" aria-pressed={isMonthly} onClick={() => setBilling('monthly')}>
                Monthly
              </button>
            </div>
          </div>

          <div className={`lv-subnote${isMonthly ? ' is-open' : ''}`} aria-hidden={!isMonthly}>
            <div>
              <p>{monthlyNote}</p>
            </div>
          </div>

          {SECTIONS.map((section) => (
            <div className="lv-group" key={section.heading}>
              <header className="lv-group-head">
                <svg className="lv-branch" viewBox="0 0 160 40" aria-hidden="true" focusable="false">
                  <path d={BRANCH_D} pathLength="1" />
                </svg>
                <div className="lv-group-title">
                  <h3>{section.heading}</h3>
                  {section.guide && <span className="lv-range">{section.guide.range}</span>}
                </div>
                <p className="lv-group-desc">{section.description}</p>
                {section.guide && <p className="lv-group-guide">{section.guide.description}</p>}
              </header>

              <div className="lv-rows">
                {section.packages.map((pkg) => (
                  <article className="lv-line" key={pkg.key}>
                    <svg
                      className="lv-line-under"
                      viewBox="0 0 840 16"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d={ROW_LINE_D} pathLength="1" />
                    </svg>
                    <div className="lv-line-id">
                      <h4 className="lv-line-name">
                        {pkg.name}
                        {pkg.popular && <span className="lv-tag">Most specified</span>}
                      </h4>
                      <p className="lv-line-desc">{pkg.description}</p>
                    </div>
                    <ul className="lv-line-spec">
                      {pkg.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <div className="lv-line-buy">
                      <p className="lv-price">
                        <PriceOdometer
                          label={isMonthly && pkg.monthlyLabel ? pkg.monthlyLabel : pkg.priceLabel}
                          animate={!staticMode}
                        />
                      </p>
                      {pkg.monthlyLabel && (
                        <p className="lv-alt">
                          {isMonthly ? `or ${pkg.priceLabel} outright` : `or ${pkg.monthlyLabel}`}
                        </p>
                      )}
                      <p className="lv-tl">{TIMELINES[pkg.key]}</p>
                      <Link
                        className="lv-row-cta"
                        to={`${START}?service=web_design&package=${pkg.key}${
                          isMonthly ? '&pricing=subscription' : ''
                        }`}
                      >
                        Start this
                        <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}

          <aside className="lv-notes">
            <h3 className="lv-notes-h">General notes</h3>
            <div className="lv-notes-cols">
              {webScopeNotes.map((note) => (
                <div className="lv-note" key={note.title}>
                  <h4>{note.title}</h4>
                  <ul>
                    {note.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          <div className="lv-fine">
            <p>{ASTERISK_CLAUSE}</p>
            <p>{GST_NOTE}</p>
            <p>{INDUSTRY_SURCHARGE_NOTE}</p>
          </div>
        </div>
      </section>

      {/* ══ Fold 4 — THE PIPELINE ═══════════════════════════════════ */}
      <section className="lv-pipe">
        <div className="lv-frame lv-pipe-grid">
          <div className="lv-pipe-figwrap">
            <h2 className="lv-h2">Brief to launch, one pipeline.</h2>
            <p className="lv-sub">One line carries the job from first call to live site.</p>
            <svg className="lv-morph" viewBox="0 0 320 320" aria-hidden="true" focusable="false">
              <path className="lv-tghost" d={PIPE_STATES[3]} />
              <path className="lv-tmain" d={PIPE_STATES[3]} />
            </svg>
          </div>
          <div className="lv-stages">
            {PROCESS.map((stage) => (
              <div className="lv-stage-item" key={stage.label}>
                <h3>
                  <span className="lv-stage-dot" aria-hidden="true" />
                  {stage.label}
                </h3>
                <p>{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lv-frame lv-close-vitals">
          <VitalsStrip id="lv-vitals-close" />
        </div>
      </section>

      {/* ══ Fold 5 — THE DRENCH ═════════════════════════════════════ */}
      <section className="lv-drench">
        <div className="lv-frame lv-drench-in">
          <h2 className="lv-h2 lv-drench-h">Ready to build something worth showing?</h2>
          {/* The sign-off: one signature in three pressure layers.
              CSS dasharray floors (0.72 / 0.88 / full) are the static
              default, so the tapered, fully-signed stroke ships in
              prerender; arming only re-draws it. */}
          <svg
            className="lv-drench-line"
            viewBox="0 0 760 80"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path className="lv-sig lv-sig--press" d={SIG_D} pathLength="1" />
            <path className="lv-sig lv-sig--mid" d={SIG_D} pathLength="1" />
            <path className="lv-sig lv-sig--tip" d={SIG_D} pathLength="1" />
          </svg>
          <p className="lv-drench-sub">
            Send us a brief — we&rsquo;ll scope it, price it, and come back with a clear plan.
          </p>
          <Link className="lv-btn lv-btn--onred" to={`${START}?service=web_design`}>
            Start a project
            <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
