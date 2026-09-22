/*
 * /Foresight — C4Site, the training arm. "The Good Room."
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
 *    clock and hour sums derived from FORMATS, and the quote sum built
 *    from C4SITE_QUOTE_FACTORS. Nothing is hardcoded.
 *  - Each format lists its own blocks, in order, with minutes (19 Sep
 *    2026), from c4sight-workshop-curriculum.md. A to-scale track with
 *    brackets was tried first and Caleb found it confusing: a plain
 *    list is the honest form of a run sheet.
 *  - Workplace prices came off the page the same day (quoted per team);
 *    "What it costs" states the one published price, the school
 *    incursion, and how a quote is set.
 *
 * All pricing facts render from src/data/pricing.js. Reveals are GSAP
 * and enhancement-only: content is visible by default, staticMode
 * (prefers-reduced-motion or the prerenderer) skips animation entirely
 * and never mounts the walk-in, eraser or smear layers. Every trigger
 * additionally sits inside one gsap.matchMedia() wrapper, so enabling
 * OS reduced-motion mid-session reverts all tweens to the DOM default
 * — which is the finished end state.
 */
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Link } from '@/components/c4/SiteLink';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import { c4SightPackages, c4SiteIncursion, C4SITE_QUOTE_FACTORS, C4SIGHT_PRICING_NOTE } from '@/data/pricing';
import SiteMosaic from '../components/sight-arm/SiteMosaic';
import {
  Stroke, PuffDots, MarkUnderline, MarkTick, MarkArrow, MarkRing, MarkLoop, VRule, ChalkDefs, useForceDark,
} from '../components/sight-arm/kit';
import '../components/sight-arm/sight-arm.css';

gsap.registerPlugin(ScrollTrigger);


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

/* The run of a day, block by block, in minutes. Verbatim from the delivery
   document (c4sight-workshop-curriculum.md): blocks 0 to 5 are the half day,
   6 to 8 and the close are the full-day afternoon. `rest` blocks are breaks.
   Lunch has no stated length there, so it is not listed. */
const RUN_OF_DAY = [
  { part: 'am', label: 'Setup', min: 15 },
  { part: 'am', label: 'What these tools are', min: 30 },
  { part: 'am', label: 'First hands-on', min: 45 },
  { part: 'am', label: 'Break', min: 15, rest: true },
  { part: 'am', label: 'Prompting that works', min: 45 },
  { part: 'am', label: 'Data safety', min: 30 },
  { part: 'am', label: 'Making it stick', min: 20 },
  { part: 'pm', label: 'Your own tasks', min: 60 },
  { part: 'pm', label: 'Break', min: 15, rest: true },
  { part: 'pm', label: 'Build a workflow you keep', min: 45 },
  { part: 'pm', label: 'Your questions', min: 30 },
  { part: 'pm', label: 'The pack', min: 15 },
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
    body: 'Emails, documents, summaries, spreadsheets and the repetitive parts of the week, done faster, with company and client information kept safe.',
  },
  {
    page: 'ForesightSchools',
    title: 'Schools and teachers',
    body: 'A 90-minute incursion for every year level from Pre-primary to Year 12, and staff PD that starts with time back on the weekend. No student devices and no student data.',
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

export default function Foresight() {
  useForceDark();
  const rootRef = useRef(null);
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
    title: 'C4Site: workplace AI training for Perth teams',
    description:
      'In-person AI training for Perth workplaces. Your team learns to use AI on real work, safely, in half a day. Office, schools and law firm formats.',
    path: '/Foresight',
    jsonLd: [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'C4Site', path: '/Foresight' },
      ]),
      serviceSchema({
        name: 'C4Site workplace AI training',
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
      <ChalkDefs />

      {/* ── Hero: the stage, then the arm statement. ── */}
      <header className="sg-hero sg-hero--stage">
        {/* The stage: a camera journey across a board of chalk letters, from
            FORESIGHT to the name (mosaicEngine.js). Decorative; the H1 below
            is the page's heading. It replaced the eraser walk-in as the
            page's one authored moment. */}
        <SiteMosaic reduced={reduced} prerender={prerender} />
        <div className="sg-wrap">
          <div className="sg-hero-grid">
            <h1 className="sg-chalk-edge" data-sg-hero="">
              We train your team{' '}
              <span className="sg-underlined">
                on site.
                <MarkUnderline />
                <PuffDots />
              </span>
            </h1>
            <div className="sg-hero-do">
              <p className="sg-lede" data-sg-hero="">
                C4Site runs hands-on AI workshops in the rooms where your team already works. They
                learn to use AI tools on their real work, safely, in about half a day. On-site
                across Perth, remote on request.
              </p>
              <div className="sg-hero-cta" data-sg-hero="">
                <Link to={enquiryUrl} className="sg-btn">
                  Request a workshop
                  <MarkArrow />
                </Link>
              </div>
              <p className="sg-hero-by" data-sg-hero="">
                C4Site is the training arm of <Link to="/">C4 Studios</Link>, Perth.
              </p>
            </div>
          </div>
          <div className="sg-tray" aria-hidden="true">
            <span className="sg-tray-ledge" data-sg-tray="" />
            <span className="sg-tray-chalk" />
            <span className="sg-tray-marker" />
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
                  <p className="sg-plan-lead">
                    {i === 0 ? 'The morning, in order' : 'The same morning, then after lunch'}
                  </p>
                  <ol className={i === 0 ? 'sg-plan' : 'sg-plan sg-plan--pm'}>
                    {RUN_OF_DAY.filter((b) => b.part === (i === 0 ? 'am' : 'pm')).map((b, k) => (
                      <li key={`${b.label}-${k}`} className={b.rest ? 'sg-plan-row sg-plan-row--rest' : 'sg-plan-row'}>
                        <span className="sg-plan-name">{b.label}</span>
                        <span className="sg-plan-min">{b.min} min</span>
                      </li>
                    ))}
                  </ol>
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
                <p className="sg-rules-lead">In the corner of the board, where it never gets rubbed out.</p>
                <h2 className="sg-h2">Every session includes a data-safety module.</h2>
                <p className="sg-rules-copy">
                  Safe use is taught in the room, on the day, as part of the course. It is the
                  standard C4Site stands behind.
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
              <span className="sg-paper-brand">Take-home sheet</span>
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
                          <em>“{marked}”</em>
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
              The core stays the same. The examples and the risks change to fit the room.
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
            <h2 className="sg-h2">What it costs.</h2>
          </div>
          {/* The teacher's working: what goes into a quote. Spoken to a
              screen reader as a sentence, drawn as a sum. */}
          <p className="sg-hand sg-cost-sum" data-sg-hand="">
            <span className="sg-sr">
              A workplace quote depends on {C4SITE_QUOTE_FACTORS.join(', ')}. It comes to one fixed
              price.
            </span>
            <span aria-hidden="true">
              {C4SITE_QUOTE_FACTORS.map((factor, i) => (
                <Fragment key={factor}>
                  {i > 0 && <span className="sg-cost-op"> + </span>}
                  <span className="sg-cost-term">{factor}</span>
                </Fragment>
              ))}
              <span className="sg-cost-op"> = </span>
              <span className="sg-hand-em">
                one fixed price
                <MarkUnderline />
              </span>
            </span>
          </p>
          <div className="sg-cost-grid">
            <div className="sg-cost" data-sg-item="">
              <h3>Workplaces</h3>
              <p className="sg-cost-figure sg-cost-figure--words" data-sg-press="">
                Quoted per team
              </p>
              <p className="sg-cost-body">
                A morning for six people down the road is a different job from a full day for forty
                across two sites, so there is no list price. Tell us about your team and you will
                have one fixed price after a short call.
              </p>
            </div>
            <VRule />
            <div className="sg-cost" data-sg-item="">
              <h3>Schools</h3>
              <p className="sg-cost-figure" data-sg-press="">
                {c4SiteIncursion.priceLabel}
                <span className="sg-cost-unit">for a {c4SiteIncursion.minutes}-minute incursion</span>
              </p>
              <ul className="sg-cost-facts">
                {c4SiteIncursion.facts.map((fact) => (
                  <li key={fact}>
                    <MarkTick />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
              <p className="sg-cost-more">
                <Link to={createPageUrl('ForesightSchools')} className="sg-cost-link">
                  See training for schools
                  <MarkArrow />
                </Link>
              </p>
            </div>
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
