/*
 * /Foresight — C4Sight, the training arm. "The Good Room."
 *
 * Identity: chalkboard-green drench (Exploratorium Tinkering Studio ×
 * School of Life colour-block covers). The page is the board, headings
 * are the chalk, marker-yellow carries emphasis, and the C4 red turns
 * up as the red pen on the take-home worksheet. One family throughout:
 * Bricolage Grotesque. Forces dark-mode (Lens pattern) so the site
 * chrome sits correctly on the dark surface.
 *
 * All pricing facts render from src/data/pricing.js. Reveals are GSAP
 * and enhancement-only: content is visible by default, staticMode
 * (prefers-reduced-motion or the prerenderer) skips animation entirely.
 */
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import { c4SightPackages, C4SIGHT_PRICING_NOTE } from '@/data/pricing';
import '../components/sight-arm/sight-arm.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Content (facts preserved from the previous page) ─────────────── */

const FORMATS = [
  {
    label: 'Half day',
    duration: 'About 3.5 hours',
    popular: false,
    body: 'Foundations, hands-on work, prompting that produces useful output, and the data-safety module. One sector focus per session. The team leaves having done real work, with a prompt pack they keep.',
  },
  {
    label: 'Full day',
    duration: 'About 6 hours',
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

/* ── The drawn chalk marks — layered dry-media strokes ────────────── */
/* Every mark is two passes on the same path. A faint, broken "ghost"
   is laid down first and slightly off-register (the dry skips a real
   chalk stick leaves), then a crisp primary draws in on top. The pair
   reads as pressed chalk, never a clean vector rule. Only the primary
   carries data-sg-draw, so the ghost stays static and the draw-in stays
   a cheap stroke-dashoffset tween — no live SVG filters on moving paths.*/

function Stroke({ d, w = 2.4, ghostDash }) {
  return (
    <>
      <path
        className="sg-ghost"
        d={d}
        strokeWidth={w * 1.2}
        strokeDasharray={ghostDash}
        transform="translate(0.9 1.1)"
      />
      <path data-sg-draw="" d={d} strokeWidth={w} />
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
      />
    </svg>
  );
}

function MarkSquiggle() {
  return (
    <svg className="sg-mark" viewBox="0 0 120 10" preserveAspectRatio="none" aria-hidden="true">
      <Stroke
        d="M2 6 Q 8 1.5 14 6 T 26 6 T 38 6 T 50 6 T 62 6 T 74 6 T 86 6 T 98 6 T 110 6 T 118 6"
        w={2.4}
        ghostDash="16 4 22 3 18"
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
      />
    </svg>
  );
}

function MarkArrow() {
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
      />
    </svg>
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

  /* Bricolage Grotesque is self-hosted globally (src/styles/fonts.css,
     loaded in main.jsx); no runtime Google Fonts request. */

  /* Entrances. Everything renders visible first; GSAP animates FROM. */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || staticMode) return undefined;

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
         and prerendered states are always fully drawn. */
      const drawIn = (paths, trigger, delay = 0.2) => {
        paths.forEach((p) => {
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
              delay,
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
        drawIn(Array.from(section.querySelectorAll('[data-sg-draw]')), section, 0.5);
      });

      /* Board list rows slide in from the margin, like lines written. */
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
                      <span className="sg-annot">
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
                  <p className="sg-format-body">{fmt.body}</p>
                </div>
                {i === 0 && <div className="sg-vrule" aria-hidden="true" />}
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
      <section className="sg-section" data-sg-rise="">
        <div className="sg-wrap">
          <div className="sg-rules" data-sg-item="">
            {/* The frame that never gets rubbed out — drawn twice, chalk
                doubled and deliberately off, the one crisp thing on a
                board of smudges. */}
            <svg
              className="sg-rules-frame"
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
                          <em className="sg-corrected">
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
        <div className="sg-wrap">
          <div className="sg-pricing-head" data-sg-item="">
            <h2 className="sg-h2">Indicative pricing.</h2>
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
