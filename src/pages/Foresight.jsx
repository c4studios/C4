/*
 * /Foresight — C4Sight, the training arm. "The Good Room."
 *
 * Identity: chalkboard-green drench (Exploratorium Tinkering Studio ×
 * School of Life colour-block covers). The page is the board, headings
 * are the chalk, marker-yellow carries emphasis, and the C4 red turns
 * up as the red pen on the take-home worksheet. Typeset voice:
 * Bricolage Grotesque. The teacher's hand: Caveat — margin arithmetic
 * and the two "Most value" annotations only, never headings or body.
 * Forces dark-mode (Lens pattern) so the site chrome sits correctly.
 *
 * Fable-pass elevation (per the chair's decision memo, §1.4):
 *  - Every chalk Stroke is layered dry media (ghost pass + primary +
 *    dry tail) revealed by ONE travelling mask wipe, so marks
 *    materialise as pressed chalk rather than a clean vector drawing
 *    over a static ghost. Safari falls back to the primary-path draw
 *    on stretched (preserveAspectRatio="none") marks.
 *  - The board remembers: eraser bloom + legible palimpsest fragments
 *    (a safe/not-safe tally, an agenda arc) at ≤4.5% chalk, all
 *    multiplied by the single `--sg-age` governor in sight-arm.css.
 *    Text columns are a no-haze zone by placement.
 *  - The walk-in: on load (desktop, motion allowed) a felt eraser
 *    wipes the last class's notes off the hero and settles on the
 *    chalk tray. It appears exactly once; every other erasure on the
 *    page is an abstract smear band.
 *  - Exactly two scrubbed smear passes: one at the Governance boundary
 *    whose mask visibly deflects around the rules frame ("never rubbed
 *    out", proven), one leading into Pricing.
 *  - Teaching order, sequenced inside the existing reveal infra:
 *    formats cards land before the "Most value" ring; the outcomes
 *    tally accrues per row and the ring closes around "Five" last;
 *    worksheet ticks draw before the red-pen correction.
 *  - The margin hand does only arithmetic the page already states:
 *    clock and hour sums derived from FORMATS, the price difference
 *    derived from c4SightPackages at render. Nothing is hardcoded.
 *
 * All pricing facts render from src/data/pricing.js. Reveals are GSAP
 * and enhancement-only: content is visible by default, staticMode
 * (prefers-reduced-motion or the prerenderer) skips animation entirely
 * and never mounts the walk-in, eraser or smear layers. Every trigger
 * additionally sits inside one gsap.matchMedia() wrapper, so enabling
 * OS reduced-motion mid-session reverts all tweens to the DOM default
 * — which is the finished end state.
 */
import { Fragment, useEffect, useId, useLayoutEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import { c4SightPackages, C4SIGHT_PRICING_NOTE } from '@/data/pricing';
import '../components/sight-arm/sight-arm.css';

gsap.registerPlugin(ScrollTrigger);

/* Safari renders stroke-dashoffset inside a mask incorrectly on
   non-uniformly stretched paths (preserveAspectRatio="none"), so those
   marks revert to the shipped primary-path draw there — they keep the
   dry-tail layer, they just draw the old way. Everything else gets the
   full layered wipe. That confinement is unverified on real Safari
   (none exists on the build box): if the pre-merge Safari pass shows
   draw-in artifacts on uniformly-scaled marks too, widen the fallback
   to `IS_SAFARI` alone (`plain` in Stroke, below). Rest state is safe
   either way — masks rest fully painted. */
const IS_SAFARI =
  typeof navigator !== 'undefined' &&
  /safari/i.test(navigator.userAgent) &&
  !/chrome|chromium|crios|fxios|edg|android/i.test(navigator.userAgent);

/* ── Content (facts preserved from the previous page) ─────────────── */
/* `hours` mirrors the duration already stated in each format's copy —
   it exists so the margin hand can derive its arithmetic from data
   instead of hardcoding figures (decision memo §1.4.4). */

const FORMATS = [
  {
    label: 'Half day',
    duration: 'About 3.5 hours',
    hours: 3.5,
    popular: false,
    body: 'Foundations, hands-on work, prompting that produces useful output, and the data-safety module. One sector focus per session. The team leaves having done real work, with a prompt pack they keep.',
  },
  {
    label: 'Full day',
    duration: 'About 6 hours',
    hours: 6,
    popular: true,
    body: 'The half-day morning, plus an afternoon where attendees bring their own recurring tasks and build repeatable workflows they keep. The deeper option, and it closes with a short automation-readiness map.',
  },
];

const OUTCOMES = [
  'What these tools really are, and where they confidently get things wrong.',
  'Hands-on with your own real work inside the first hour.',
  'Prompting that actually produces useful output.',
  'What is and is not safe to put into AI tools.',
  'How to embed it so the team still uses it next month.',
];

const GOVERNANCE_POINTS = [
  'What stays out: confidential, personal, and privileged information never goes into these tools.',
  'The verification habit: no fact, number, name, or citation is trusted without checking it against a real source.',
  'Your policy wins: if your workplace restricts or bans a tool, that overrides anything taught in the room.',
];

const KEEP_ITEMS = [
  'A prompt pack relevant to your sector.',
  'The data-safety one-pager.',
  'For the full day, workflows documented in your own words.',
  'One clear next step, not a vague go use AI more.',
];

const SECTORS = [
  {
    page: 'ForesightBusiness',
    title: 'Office and business',
    body: 'Practical productivity. Emails, documents, summaries, spreadsheets, and the repetitive parts of the week, done faster. With company and client information kept safe.',
  },
  {
    page: 'ForesightSchools',
    title: 'Schools and teachers',
    body: 'Lesson planning, differentiated materials, feedback, and time back on the weekend. Careful and ethics-forward, with student privacy and academic integrity front and centre.',
  },
  {
    page: 'ForesightLaw',
    title: 'Law firms',
    body: 'Faster drafting, summarising, and research starting points, with verification built in. Led by someone who understands the conduct obligations and the risk of AI inventing citations.',
  },
];

/* Streak geometry for the two scrubbed smear bands (exactly two on the
   page, per the memo). x/w are percentages of the band width, y/h are
   px within the band. Opacities sit in the shipped seam register. */
const GOV_STREAKS = [
  { x: -4, y: 8, w: 34, h: 16, o: 0.07 },
  { x: 33, y: 4, w: 24, h: 22, o: 0.05 },
  { x: 62, y: 10, w: 32, h: 15, o: 0.08 },
  { x: 2, y: 52, w: 27, h: 20, o: 0.06 },
  { x: 42, y: 46, w: 34, h: 16, o: 0.05 },
  { x: 80, y: 55, w: 26, h: 18, o: 0.07 },
  { x: -6, y: 104, w: 30, h: 17, o: 0.05 },
  { x: 30, y: 112, w: 26, h: 14, o: 0.075 },
  { x: 60, y: 100, w: 37, h: 19, o: 0.05 },
  { x: 6, y: 156, w: 33, h: 16, o: 0.06 },
  { x: 48, y: 162, w: 27, h: 14, o: 0.05 },
  { x: 82, y: 150, w: 26, h: 18, o: 0.065 },
  { x: 14, y: 200, w: 38, h: 13, o: 0.045 },
  { x: 58, y: 206, w: 30, h: 15, o: 0.055 },
];

const PRICE_STREAKS = [
  { x: -5, y: 6, w: 30, h: 14, o: 0.06 },
  { x: 28, y: 12, w: 26, h: 18, o: 0.05 },
  { x: 57, y: 4, w: 30, h: 15, o: 0.07 },
  { x: 12, y: 34, w: 34, h: 13, o: 0.05 },
  { x: 52, y: 32, w: 28, h: 16, o: 0.06 },
  { x: 84, y: 28, w: 22, h: 14, o: 0.05 },
];

/* ── The drawn chalk marks — layered dry-media strokes ────────────── */
/* Every mark is three passes on the same line of travel: a faint,
   broken "ghost" laid slightly off-register (the dry skips a real
   chalk stick leaves), the crisp primary, and a short dry tail of
   broken dashes past the end where the stick lifted. All three group
   under one SVG <mask> holding a fat round-cap copy of the same path;
   the draw-in tweens the MASK path's stroke-dashoffset, so the whole
   layered mark materialises under a single travelling wipe — pressed
   chalk, never a clean vector rule drawing over a static ghost. At
   rest the mask is fully painted, so the static and prerendered states
   are always the complete mark. No live SVG filters on moving paths. */

function Stroke({ d, w = 2.4, ghostDash, tail, tailDash = '3 6', stretched = false }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const plain = IS_SAFARI && stretched;
  const layers = (
    <>
      <path
        className="sg-ghost"
        d={d}
        strokeWidth={w * 1.2}
        strokeDasharray={ghostDash}
        transform="translate(0.9 1.1)"
      />
      <path {...(plain ? { 'data-sg-draw': '' } : {})} d={d} strokeWidth={w} />
      {tail ? (
        <path className="sg-tail" d={tail} strokeWidth={w * 0.9} strokeDasharray={tailDash} />
      ) : null}
    </>
  );
  if (plain) return layers;
  const maskId = `sgm-${uid}`;
  return (
    <>
      {/* Region is a generous fixed user-space box (every mark viewBox
          sits well inside it), so fat wipe strokes never clip. */}
      <mask id={maskId} maskUnits="userSpaceOnUse" x="-100" y="-100" width="700" height="700">
        <path
          className="sg-wipe"
          data-sg-draw=""
          d={tail ? `${d} ${tail}` : d}
          strokeWidth={w * 3 + 3}
        />
      </mask>
      <g mask={`url(#${maskId})`}>{layers}</g>
    </>
  );
}

/* A settling puff of chalk dust. Rendered as plain elements beside the
   mark (not inside its stretched viewBox, so the dots stay round), kept
   invisible until the mark finishes drawing, then animated out once. */
function PuffDots() {
  return (
    <span className="sg-puff" aria-hidden="true">
      <i className="sg-puff-dot" />
      <i className="sg-puff-dot" />
      <i className="sg-puff-dot" />
    </span>
  );
}

function MarkUnderline() {
  return (
    <svg className="sg-mark" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
      <Stroke
        d="M3 8.5 C 36 4, 80 10, 119 6.5 C 149 4.2, 179 6.8, 197 5.4"
        w={5}
        ghostDash="46 8 64 7 48"
        tail="M199 5.2 C 204 5, 209.5 5.4, 216 4.9"
        tailDash="6 7"
        stretched
      />
    </svg>
  );
}

function MarkSquiggle() {
  /* Red pen on paper — pens don't leave dry chalk tails, so none here. */
  return (
    <svg className="sg-mark" viewBox="0 0 120 10" preserveAspectRatio="none" aria-hidden="true">
      <Stroke
        d="M2 6 Q 8 1.5 14 6 T 26 6 T 38 6 T 50 6 T 62 6 T 74 6 T 86 6 T 98 6 T 110 6 T 118 6"
        w={2.4}
        ghostDash="16 4 22 3 18"
        stretched
      />
    </svg>
  );
}

function MarkTick() {
  return (
    <svg className="sg-mark" viewBox="0 0 22 22" aria-hidden="true">
      <Stroke
        d="M3.5 12.5 C 5.5 14.2, 7.2 16.2, 8.8 18.2 C 11.5 13.4, 14.8 8.6, 19 4.5"
        w={2.5}
        ghostDash="8 2 26"
        tail="M19.9 3.5 C 20.8 2.6, 21.7 1.8, 22.8 1"
        tailDash="1.8 2.4"
      />
    </svg>
  );
}

function MarkArrow() {
  /* Too small for a legible tail at its rendered 26×11px. */
  return (
    <svg className="sg-mark" viewBox="0 0 30 12" aria-hidden="true">
      <Stroke d="M1.5 6.4 C 9 5.5, 18 6.7, 27 5.9" w={2.2} ghostDash="8 2 16 2 6" />
      <Stroke d="M21 1.6 C 23.5 3.3, 25.6 4.9, 28.2 6 C 25.4 7.5, 23 9.2, 21.2 10.8" w={2.2} />
    </svg>
  );
}

function MarkRing() {
  return (
    <svg className="sg-mark" viewBox="0 0 120 46" preserveAspectRatio="none" aria-hidden="true">
      <Stroke
        d="M17 24 C 15 12.5, 40 5.5, 63 5.8 C 91 6.2, 107 13, 106 23.5 C 105 34.5, 82 41, 56 40.4 C 32 39.8, 18 33.6, 17 22.5 C 16.5 17.8, 21.5 12.6, 28 10.4"
        w={2.6}
        ghostDash="34 6 52 6 40 5 30"
        tail="M29.6 9.9 C 33.5 8.7, 38 7.9, 42.5 7.5"
        tailDash="5 5.5"
        stretched
      />
    </svg>
  );
}

function MarkLoop() {
  return (
    <svg className="sg-mark" viewBox="0 0 46 46" aria-hidden="true">
      <Stroke
        d="M23.5 4.6 C 12 4.2, 4.6 12, 4.6 23 C 4.6 34.4, 12.5 41.8, 23.5 41.4 C 35 41, 41.4 33.4, 41.4 22.6 C 41.4 12.2, 34 5, 25.6 5.2 C 21.2 5.3, 17.2 7, 14.6 9.6"
        w={2.2}
        ghostDash="22 4 40 5 28"
        tail="M13.5 10.7 C 12.3 12.1, 11.3 13.6, 10.5 15.3"
        tailDash="2.2 3"
      />
    </svg>
  );
}

/* The formats divider, truth-fixed: a crisp 1px CSS rule is a
   materially false line on a chalkboard, so the seam between the two
   formats is now a drawn chalk vertical — ghost pass and all — that
   draws in with its section (same non-scaling-stroke + dashoffset
   pattern as the shipped governance frame). */
function VRule() {
  return (
    <svg className="sg-vrule" viewBox="0 0 12 100" preserveAspectRatio="none" aria-hidden="true">
      <path
        className="sg-ghost"
        d="M6.8 1.5 C 5.6 22, 7 44, 5.8 66 C 5.2 80, 6.4 92, 6 98.5"
        strokeDasharray="10 4 16 5 12"
        vectorEffect="non-scaling-stroke"
        transform="translate(0.7 0.6)"
      />
      <path
        data-sg-draw=""
        d="M6 1.5 C 5 22, 6.6 44, 5.4 66 C 4.8 80, 6.2 92, 5.8 98.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* The outcomes tally: one stroke per outcome, the fifth closing the
   gate. Count comes from OUTCOMES.length — nothing hardcoded. Each
   stroke draws with its row (teaching order: count first, circle the
   total last). */
const TALLY_GHOSTS = ['7 3 14', '9 4 12', '6 3 15', '8 4 11', '20 6 30'];

function TallyGate({ count }) {
  const capped = Math.min(count, 5);
  const uprights = capped - (capped >= 5 ? 1 : 0);
  const paths = [];
  for (let i = 0; i < uprights; i += 1) {
    const x = 7 + i * 13;
    paths.push(`M${x} 5.5 C ${x - 1} 14, ${x + 1.2} 24, ${x - 0.4} 33.5`);
  }
  if (capped >= 5) paths.push('M1.5 27 C 16 21.5, 36 12.5, 57.5 6');
  return (
    <svg className="sg-mark sg-tally" viewBox="0 0 60 40" aria-hidden="true">
      {paths.map((d, i) => (
        <Stroke key={d} d={d} w={2.6} ghostDash={TALLY_GHOSTS[i % TALLY_GHOSTS.length]} />
      ))}
    </svg>
  );
}

/* One scrubbed smear band. The governance instance carries an SVG mask
   whose black hole tracks the rules frame's box (ResizeObserver in the
   page component), so the wipe visibly deflects AROUND the framed
   corner — "never rubbed out", performed. The mask sits on a static
   outer group; only the inner track translates, so the exclusion stays
   pinned to the frame while the smear sweeps. */
function SmearBand({ variant, streaks, excludeId }) {
  return (
    <div className={`sg-smear sg-smear--${variant}`} aria-hidden="true">
      <svg className="sg-smear-svg" width="100%" height="100%">
        {excludeId ? (
          <defs>
            <mask id={excludeId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
              <rect x="-2%" y="-5%" width="104%" height="110%" fill="#fff" />
              <rect className="sg-smear-hole" x="0" y="0" width="0" height="0" rx="18" fill="#000" />
            </mask>
          </defs>
        ) : null}
        <g mask={excludeId ? `url(#${excludeId})` : undefined}>
          <g className="sg-smear-track">
            {streaks.map((s) => (
              <rect
                key={`${s.x}:${s.y}`}
                x={`${s.x}%`}
                y={s.y}
                width={`${s.w}%`}
                height={s.h}
                rx={s.h / 2}
                fill="#f2f0e9"
                fillOpacity={s.o}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ── Force dark-mode while mounted (Lens pattern) ─────────────────── */

function useForceDark() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.className;
    const apply = () => {
      root.classList.add('dark-mode', 'sg-on-board');
      root.classList.remove('light-mode', 'vivid');
    };
    apply();
    /* On a direct page load ThemeProvider's mount effect runs after this
       one and re-applies the stored theme class AND its inline --c4-*
       tokens (inline styles outrank the .dark-mode class block). One
       deferred re-apply wins the class ordering, and the .sg-on-board
       block in sight-arm.css pins the chrome tokens with !important so
       the nav and footer read dark whatever theme the visitor stored. */
    const id = window.setTimeout(apply, 0);
    return () => {
      window.clearTimeout(id);
      root.className = prev;
      root.classList.remove('sg-on-board');
    };
  }, []);
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function Foresight() {
  useForceDark();
  const rootRef = useRef(null);
  /* The felt eraser's walk-in is a load-time beat that plays at most
     once per visit. The ref survives the matchMedia wrapper re-running
     its setup (OS reduced-motion toggled off and back on mid-session),
     so the sweep can never replay — "appears exactly once" holds. */
  const walkinPlayed = useRef(false);
  const enquiryUrl = createPageUrl('TrainingEnquiry');

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
    title: 'C4Sight: workplace AI training for Perth teams',
    description:
      'In-person AI training for Perth workplaces. Your team learns to use AI on real work, safely, in half a day. Office, schools and law firm formats.',
    path: '/Foresight',
    jsonLd: [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'C4Sight', path: '/Foresight' },
      ]),
      serviceSchema({
        name: 'C4Sight workplace AI training',
        description:
          'In-person AI literacy workshops for Australian workplaces. Half-day and full-day formats with a data-safety module in every session.',
        url: '/Foresight',
        serviceType: 'AI literacy training',
        offers: c4SightPackages
          .filter((p) => p.price > 0)
          .map((p) => ({ name: p.name, price: p.price, url: '/Foresight' })),
      }),
    ],
  });

  /* Bricolage Grotesque and Caveat are self-hosted globally
     (src/styles/fonts.css, loaded in main.jsx); no runtime Google
     Fonts request. */

  /* The margin hand does only arithmetic the page already states.
     Clock and hour figures derive from FORMATS; the price working
     derives from c4SightPackages at render. If the data ever stops
     supporting a sum, the note simply doesn't render. */
  const handNotes = useMemo(() => {
    const am = FORMATS[0] && FORMATS[0].hours;
    const total = FORMATS[1] && FORMATS[1].hours;
    if (!am || !total || total <= am) return null;
    const pm = Math.round((total - am) * 10) / 10;
    const end = 9 + am;
    const endH = Math.floor(end);
    const endM = Math.round((end - endH) * 60);
    const trim = (n) => String(n).replace(/\.0$/, '');
    return {
      halfClock: { start: '9:00', end: `${endH}:${String(endM).padStart(2, '0')}` },
      fullSum: `${trim(am)} + ${trim(pm)} ≈ ${trim(total)} hrs`,
    };
  }, []);

  const priceSum = useMemo(() => {
    const half = c4SightPackages.find((p) => p.key === 'sight-half-day');
    const full = c4SightPackages.find((p) => p.key === 'sight-full-day');
    if (!half || !full || half.price <= 0 || full.price <= half.price) return null;
    const money = (n) => `$${n.toLocaleString('en-AU')}`;
    return { full: money(full.price), half: money(half.price), diff: money(full.price - half.price) };
  }, []);

  /* Entrances. Everything renders visible first; GSAP animates FROM.
     Teaching order lives in delays appended to the existing reveal
     system — the section infra itself is unchanged (memo §1.4.3).
     One gsap.matchMedia() wrapper sits around every trigger (quality
     floor §4.9): if the OS reduced-motion preference flips ON
     mid-session, GSAP reverts every tween and ScrollTrigger it
     created — and because the DOM default IS the finished end state,
     the board simply stands fully drawn. staticMode still decides at
     mount; the wrapper covers the flip that happens after. */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || staticMode) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        /* Settling dust: 3-4 particles beside a mark, animated out once as
           the stroke lands. Entry-only, never ambient (Lens owns the beam).*/
        const puff = (p) => {
          const host = p.ownerSVGElement && p.ownerSVGElement.parentElement;
          if (!host) return;
          const dots = host.querySelectorAll('.sg-puff-dot');
          if (!dots.length) return;
          gsap.fromTo(
            dots,
            { autoAlpha: 0.9, scale: 0.5, y: 0 },
            {
              autoAlpha: 0,
              scale: 1.35,
              y: -8,
              duration: 0.55,
              ease: 'power2.out',
              stagger: 0.06,
              transformOrigin: '50% 50%',
            },
          );
        };

        /* Chalk strokes draw in; default DOM has no dash, so the static
           and prerendered states are always fully drawn. In mask mode the
           [data-sg-draw] path is the mask's wipe stroke, so one tween
           reveals the whole layered mark. `step` staggers per-path delay
           (the outcomes tally accrues with it). */
        const drawIn = (paths, trigger, delay = 0.2, step = 0) => {
          paths.forEach((p, idx) => {
            let len = 0;
            try {
              len = p.getTotalLength();
            } catch {
              return;
            }
            if (!len) return;
            gsap.fromTo(
              p,
              { strokeDasharray: len, strokeDashoffset: len },
              {
                strokeDashoffset: 0,
                duration: 0.7,
                ease: 'power2.out',
                delay: delay + idx * step,
                onComplete: () => puff(p),
                ...(trigger
                  ? { scrollTrigger: { trigger, start: 'top 80%', once: true } }
                  : {}),
              },
            );
          });
        };

        gsap
          .timeline()
          .from('[data-sg-hero]', {
            y: 26,
            autoAlpha: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.12,
          })
          .from(
            '[data-sg-tray]',
            { scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: 'power2.inOut' },
            '-=0.35',
          )
          .from(
            ['.sg-tray-chalk', '.sg-tray-marker'],
            { autoAlpha: 0, y: 6, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
            '-=0.28',
          );
        drawIn(Array.from(root.querySelectorAll('.sg-hero [data-sg-draw]')), null, 0.85);

        /* The walk-in: the felt eraser's single appearance. It wipes the
           last class's notes off the hero display region, then settles on
           the chalk tray for the life of the page. A load-time beat, so
           it plays at most ONCE per visit: desktop with motion allowed
           plays it; anything else — a later resize, or the matchMedia
           setup re-running after a reduced-motion round-trip — parks the
           residue hidden so unwiped notes never show and the sweep never
           replays. (Below 1024px the residue field would sit behind
           running text — same rule as the palimpsest hides.) */
        {
          const eraser = root.querySelector('.sg-eraser');
          const residue = root.querySelector('.sg-walkin-residue');
          if (eraser && residue) {
            const eb = eraser.getBoundingClientRect();
            const rb = residue.getBoundingClientRect();
            const desktop =
              window.matchMedia('(min-width: 1024px)').matches && eb.width > 0 && rb.width > 0;
            if (desktop && !walkinPlayed.current) {
              walkinPlayed.current = true;
              /* The prop must never be glimpsed at its destination before
                 the sweep: the timeline leads in with a 0.2s delay, and
                 until it plays the eraser would render at its CSS rest
                 pose on the tray. Hide it synchronously (we are pre-paint,
                 inside useLayoutEffect) so its first visible frame is the
                 walk-in itself. */
              gsap.set(eraser, { autoAlpha: 0 });
              gsap
                .timeline({ delay: 0.2 })
                .set(eraser, {
                  x: rb.left - eb.left - 14,
                  y: rb.top - eb.top + rb.height * 0.32,
                  rotate: -5,
                  autoAlpha: 0,
                })
                .to(eraser, { autoAlpha: 1, duration: 0.18, ease: 'power1.out' })
                .to(
                  eraser,
                  {
                    x: rb.right - eb.left - eb.width + 30,
                    rotate: 3,
                    duration: 0.85,
                    ease: 'power2.inOut',
                  },
                  0.06,
                )
                .fromTo(
                  residue,
                  { clipPath: 'inset(0% 0% 0% 0%)' },
                  { clipPath: 'inset(0% 0% 0% 101%)', duration: 0.85, ease: 'power2.inOut' },
                  0.06,
                )
                .to(eraser, { x: 0, y: 0, rotate: 0, duration: 0.55, ease: 'power2.in' }, '>-0.02');
            } else {
              gsap.set(residue, { autoAlpha: 0 });
            }
          }
        }

        /* The two scrubbed smear passes (governance + pricing) — the only
           scroll-scrubbed motion on the page. Bound to the user's hand,
           dead-still at rest, and never mounted under staticMode. */
        root.querySelectorAll('.sg-smear').forEach((smear) => {
          const track = smear.querySelector('.sg-smear-track');
          const section = smear.closest('section');
          if (!track || !section) return;
          gsap.fromTo(
            track,
            { x: () => -smear.clientWidth * 0.9 },
            {
              x: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 84%',
                end: 'top 30%',
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        root.querySelectorAll('[data-sg-rise]').forEach((section) => {
          const items = section.querySelectorAll('[data-sg-item]');
          if (items.length) {
            gsap.from(items, {
              y: 22,
              autoAlpha: 0,
              duration: 0.65,
              ease: 'power3.out',
              stagger: 0.09,
              scrollTrigger: { trigger: section, start: 'top 76%', once: true },
            });
          }
          /* Teaching order: the writing lands first, the teacher's
             emphasis follows. Marks flagged [data-sg-late] (the formats
             "Most value" ring, the governance frame, the worksheet's red
             correction) and marks inside the margin hand draw on a second
             beat after the section's own marks. */
          const all = Array.from(section.querySelectorAll('[data-sg-draw]'));
          const late = all.filter((p) => p.closest('[data-sg-late], [data-sg-hand]'));
          const normal = all.filter((p) => !late.includes(p));
          drawIn(normal, section, 0.5);
          drawIn(late, section, 1.2);
          const hands = section.querySelectorAll('[data-sg-hand]');
          if (hands.length) {
            gsap.from(hands, {
              autoAlpha: 0,
              y: 6,
              duration: 0.5,
              ease: 'power2.out',
              delay: 0.95,
              stagger: 0.12,
              scrollTrigger: { trigger: section, start: 'top 76%', once: true },
            });
          }
        });

        /* Board list rows slide in from the margin, like lines written.
           Then the tally accrues one stroke per row, and only after the
           count is done does the ring close around "Five" — counting
           before circling the total. */
        const rows = root.querySelectorAll('[data-sg-row]');
        if (rows.length) {
          gsap.from(rows, {
            x: -20,
            autoAlpha: 0,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: '.sg-outcomes', start: 'top 74%', once: true },
          });
        }
        const tally = Array.from(root.querySelectorAll('.sg-tally [data-sg-draw]'));
        drawIn(tally, '.sg-outcomes', 0.7, 0.14);
        const ring = Array.from(
          root.querySelectorAll('.sg-outcomes-head .sg-ringed [data-sg-draw]'),
        );
        drawIn(ring, '.sg-outcomes', 0.75 + tally.length * 0.14 + 0.3);

        /* The day-plan bars stretch to their real duration. */
        const bars = root.querySelectorAll('[data-sg-bar]');
        if (bars.length) {
          gsap.from(bars, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: { trigger: '.sg-formats', start: 'top 72%', once: true },
          });
        }

        /* Pricing figures are pressed onto the board — a short scale + tilt
           settle, transform-only so it never fights the card's own rise. */
        const figures = root.querySelectorAll('[data-sg-press]');
        if (figures.length) {
          gsap.from(figures, {
            scale: 1.045,
            rotate: 0.8,
            transformOrigin: 'left center',
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.09,
            scrollTrigger: { trigger: '.sg-pricing', start: 'top 70%', once: true },
          });
        }
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [staticMode]);

  /* Keep the governance smear's exclusion hole glued to the rules
     frame's box across breakpoints and content reflow. Both rects are
     read in the same scroll context, so the offset is scroll-stable. */
  useEffect(() => {
    if (staticMode) return undefined;
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return undefined;
    const svg = root.querySelector('.sg-smear--gov .sg-smear-svg');
    const hole = root.querySelector('.sg-smear--gov .sg-smear-hole');
    const panel = root.querySelector('.sg-rules');
    if (!svg || !hole || !panel) return undefined;
    const update = () => {
      const sr = svg.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();
      hole.setAttribute('x', String(pr.left - sr.left - 6));
      hole.setAttribute('y', String(pr.top - sr.top - 6));
      hole.setAttribute('width', String(Math.max(pr.width + 12, 0)));
      hole.setAttribute('height', String(Math.max(pr.height + 12, 0)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(panel);
    ro.observe(svg);
    window.addEventListener('resize', update);
    /* Fonts and images settling shift the panel without resizing the
       window — ride ScrollTrigger's refresh (it already listens for
       those) so the exclusion never drifts off the frame. */
    ScrollTrigger.addEventListener('refresh', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      ScrollTrigger.removeEventListener('refresh', update);
    };
  }, [staticMode]);

  return (
    <div ref={rootRef} className="sg-root">
      {/* Static chalk-edge filter — feTurbulence displacement, never
          animated, applied to the hero h1 text only (§5 no live filters).*/}
      <svg className="sg-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter
          id="sg-chalk-edge"
          x="-6%"
          y="-30%"
          width="112%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.86 0.62"
            numOctaves="1"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* ── Hero: the arm statement. The C-code appears here, once. ── */}
      <header className="sg-hero">
        {/* Last class's notes, about to be wiped. Decorative, desktop
            only, never mounted for prerender/reduced-motion. The
            fainter palimpsest tally underneath (CSS ::before) is what
            the eraser can never fully remove. */}
        {!staticMode && (
          <div className="sg-walkin" aria-hidden="true">
            <div className="sg-walkin-residue">
              <span className="sg-walkin-note sg-walkin-note--a">verify it</span>
              <span className="sg-walkin-note sg-walkin-note--b">…not sure? ask.</span>
              <svg className="sg-walkin-scribble" viewBox="0 0 220 120" aria-hidden="true">
                <path d="M12 96 C 60 60, 120 44, 204 30" />
                <path d="M180 18 C 188 24, 198 28, 208 31 C 197 37, 188 44, 181 52" />
              </svg>
            </div>
          </div>
        )}
        <div className="sg-wrap">
          <p className="sg-chip" data-sg-hero="">
            <span className="sg-chip-code">C4</span>
            <span>C4Sight — the training arm</span>
          </p>
          <h1 className="sg-chalk-edge" data-sg-hero="">
            The fourth C stands for{' '}
            <span className="sg-underlined">
              foresight.
              <MarkUnderline />
              <PuffDots />
            </span>
          </h1>
          <p className="sg-lede" data-sg-hero="">
            C4Sight runs hands-on AI workshops in the rooms where your team already works. They
            learn to use AI tools on their real work, safely, in about half a day. On-site across
            Perth, remote on request.
          </p>
          <div className="sg-hero-cta" data-sg-hero="">
            <Link to={enquiryUrl} className="sg-btn">
              Request a workshop
              <MarkArrow />
            </Link>
          </div>
          <div className="sg-tray" aria-hidden="true">
            <span className="sg-tray-ledge" data-sg-tray="" />
            <span className="sg-tray-chalk" />
            <span className="sg-tray-marker" />
            {!staticMode && <span className="sg-eraser" />}
          </div>
        </div>
      </header>

      {/* ── Formats: the day plan ──────────────────────────────────── */}
      <section className="sg-section sg-formats" data-sg-rise="">
        <div className="sg-wrap">
          <div className="sg-formats-head" data-sg-item="">
            <h2 className="sg-h2">Two ways to run it.</h2>
            <p className="sg-sub">
              Both formats are hands-on from the first hour and built around the real work your
              team already does.
            </p>
          </div>
          <div className="sg-formats-grid">
            {FORMATS.map((fmt, i) => (
              <Fragment key={fmt.label}>
                <div className="sg-format" data-sg-item="">
                  <div className="sg-format-top">
                    <h3>{fmt.label}</h3>
                    <span className="sg-format-duration">{fmt.duration}</span>
                  </div>
                  {fmt.popular && (
                    <div className="sg-format-annot">
                      <span className="sg-annot" data-sg-late="">
                        Most value
                        <MarkRing />
                        <PuffDots />
                      </span>
                    </div>
                  )}
                  <div className="sg-sched" aria-hidden="true">
                    <span className="sg-sched-block sg-sched-block--am" data-sg-bar="">
                      am
                    </span>
                    {fmt.popular && (
                      <span className="sg-sched-block sg-sched-block--pm" data-sg-bar="">
                        pm
                      </span>
                    )}
                  </div>
                  {handNotes && (
                    <p className="sg-hand sg-format-hand" data-sg-hand="" aria-hidden="true">
                      {i === 0 ? (
                        <>
                          {handNotes.halfClock.start}
                          <MarkArrow />
                          {handNotes.halfClock.end}
                        </>
                      ) : (
                        handNotes.fullSum
                      )}
                    </p>
                  )}
                  <p className="sg-format-body">{fmt.body}</p>
                </div>
                {i === 0 && <VRule />}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcomes: the board list. A real enumeration, so numbered. */}
      <section className="sg-section sg-outcomes">
        <div className="sg-wrap">
          <div className="sg-outcomes-head" data-sg-row="">
            <h2 className="sg-h2">
              <span className="sg-ringed">
                Five
                <MarkRing />
                <PuffDots />
              </span>{' '}
              things your team walks out with.
            </h2>
            <TallyGate count={OUTCOMES.length} />
          </div>
          <ol className="sg-outcome-list">
            {OUTCOMES.map((item, i) => (
              <li key={item} className="sg-outcome" data-sg-row="">
                <span className="sg-outcome-num" aria-hidden="true">
                  {i + 1}
                  <MarkLoop />
                </span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Governance: the framed rules that never get rubbed out ─── */}
      <section className="sg-section sg-govern" data-sg-rise="">
        {!staticMode && <SmearBand variant="gov" streaks={GOV_STREAKS} excludeId="sg-smear-exclude" />}
        <div className="sg-wrap">
          <div className="sg-rules" data-sg-item="">
            {/* The frame that never gets rubbed out — drawn twice, chalk
                doubled and deliberately off, the one crisp thing on a
                board of smudges. It finishes drawing after the smear
                pass has deflected around it. */}
            <svg
              className="sg-rules-frame"
              data-sg-late=""
              viewBox="0 0 100 62"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                data-sg-draw=""
                vectorEffect="non-scaling-stroke"
                d="M2 4.4 C 2 2.7 3.1 1.7 5 1.7 L 95.4 2.2 C 97.6 2.2 98.4 3.3 98.3 5.2 L 97.9 57.2 C 97.9 59.4 96.8 60.3 94.8 60.3 L 4.8 59.8 C 2.6 59.8 1.7 58.7 1.8 56.8 Z"
              />
              <path
                data-sg-draw=""
                vectorEffect="non-scaling-stroke"
                d="M4.6 6.4 C 4.6 4.8 5.6 3.9 7.4 4 L 92.8 4.4 C 94.8 4.5 95.6 5.6 95.5 7.3 L 95.1 54.9 C 95.1 57 94 57.8 92.1 57.7 L 7 57.3 C 5 57.2 4.2 56.2 4.3 54.5 Z"
              />
            </svg>
            <div className="sg-rules-grid">
              <div>
                <p className="sg-rules-lead">Written in the corner of the board, never rubbed out —</p>
                <h2 className="sg-h2">Every session includes a data-safety module.</h2>
                <p className="sg-rules-copy">
                  Safe and responsible use is part of the curriculum, not the fine print. We treat
                  it as the standard C4Sight stands behind.
                </p>
              </div>
              <div>
                {GOVERNANCE_POINTS.map((point) => {
                  const [lead, rest] = point.split(/:\s(.+)/);
                  return (
                    <div key={point} className="sg-rule-item">
                      <MarkTick />
                      <div>
                        <strong>{lead}.</strong>
                        <span>{rest.charAt(0).toUpperCase() + rest.slice(1)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What you keep: the take-home sheet, marked in red pen ──── */}
      <section className="sg-section" data-sg-rise="">
        <div className="sg-wrap">
          <div className="sg-paper" data-sg-item="">
            <div className="sg-paper-head">
              <span className="sg-paper-brand">C4Sight — take-home</span>
              <span className="sg-paper-note">Kept by every attendee</span>
            </div>
            <h2 className="sg-h2">Nobody leaves with just notes.</h2>
            <ul className="sg-keep-list">
              {KEEP_ITEMS.map((item) => {
                const marked = 'go use AI more';
                const at = item.indexOf(marked);
                return (
                  <li key={item}>
                    <MarkTick />
                    <span>
                      {at === -1 ? (
                        item
                      ) : (
                        <>
                          {item.slice(0, at)}
                          <em className="sg-corrected" data-sg-late="">
                            “{marked}”
                            <MarkSquiggle />
                          </em>
                          {item.slice(at + marked.length)}
                        </>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Sectors: three rooms, three doors ──────────────────────── */}
      <section className="sg-section sg-sectors" data-sg-rise="">
        <div className="sg-wrap">
          <div className="sg-sectors-head" data-sg-item="">
            <h2 className="sg-h2">Framed for your sector.</h2>
            <p className="sg-sub">
              The core is constant. The examples, the risks, and the wins change to fit the room.
            </p>
          </div>
          <div>
            {SECTORS.map((sector) => (
              <Link
                key={sector.page}
                to={createPageUrl(sector.page)}
                className="sg-sector"
                data-sg-item=""
              >
                <h3>{sector.title}</h3>
                <p>{sector.body}</p>
                <span className="sg-sector-go">
                  View {sector.title.toLowerCase()} training
                  <MarkArrow />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing: straight from src/data/pricing.js ─────────────── */}
      <section className="sg-section sg-pricing" data-sg-rise="">
        {!staticMode && <SmearBand variant="price" streaks={PRICE_STREAKS} />}
        <div className="sg-wrap">
          <div className="sg-pricing-head" data-sg-item="">
            <h2 className="sg-h2">Indicative pricing.</h2>
            {priceSum && (
              <p className="sg-hand sg-price-hand" data-sg-hand="" aria-hidden="true">
                from {priceSum.full} − from {priceSum.half} ={' '}
                <span className="sg-hand-em">
                  {priceSum.diff}
                  <MarkUnderline />
                </span>{' '}
                → the whole afternoon
              </p>
            )}
          </div>
          <div className="sg-price-grid">
            {c4SightPackages.map((pkg) => (
              <div key={pkg.key} className="sg-price" data-sg-item="">
                {pkg.popular && (
                  <span className="sg-price-annot sg-annot">
                    Most value
                    <MarkRing />
                    <PuffDots />
                  </span>
                )}
                <h3>{pkg.name}</h3>
                <p className="sg-price-figure" data-sg-press="">
                  {pkg.priceLabel}
                </p>
                <p className="sg-price-desc">{pkg.description}</p>
                <div className="sg-price-rule" aria-hidden="true" />
                <ul>
                  {pkg.features.map((f) => (
                    <li key={f}>
                      <MarkTick />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="sg-pricing-note" data-sg-item="">
            {C4SIGHT_PRICING_NOTE}
          </p>
          <div className="sg-pricing-cta" data-sg-item="">
            <Link to={enquiryUrl} className="sg-btn sg-btn--ghost">
              Request a quote
              <MarkArrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Closing ────────────────────────────────────────────────── */}
      <section className="sg-close" data-sg-rise="">
        <div className="sg-wrap">
          <h2 className="sg-h2" data-sg-item="">
            Bring AI into your workplace,{' '}
            <span className="sg-underlined">
              safely.
              <MarkUnderline />
              <PuffDots />
            </span>
          </h2>
          <p className="sg-sub" data-sg-item="">
            Tell us about your team and we will put together the right session.
          </p>
          <div className="sg-close-cta" data-sg-item="">
            <Link to={enquiryUrl} className="sg-btn">
              Request a workshop
              <MarkArrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
