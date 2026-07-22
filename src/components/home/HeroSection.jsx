/* ─────────────────────────────────────────────────────────────────
   FOLD 1 — THE SUMMONS ("Evidence on Call")

   The SEO-locked TypedHeading is the ignition clock: each phrase it
   types summons the matching piece of real shipped work on the
   Evidence Wall behind it — the frame grades from monochrome to full
   colour (lit / live / shipped), captioned with the client's actual
   name in the page's one mono grammar. The previous frame relaxes
   back to mono. Zero shared-component changes: the wall listens via
   TypedHeading's existing onLineChange prop.

   Static end-state (Prerender UA / reduced motion): TypedHeading
   rests on phrase 0, the wall rests lit on pairing 0, every frame,
   caption and link is plain DOM. No GSAP runs at all.
   ───────────────────────────────────────────────────────────────── */
import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { createPageUrl } from '@/utils';
import TypedHeading from '../c4/TypedHeading';
import { useTheme } from '../c4/ThemeContext';
import { buildQuotrSrc, postQuotrTheme, preconnectQuotr } from './quotrTheme';
import { gsap, EASE, useStaticMode } from './homeMotion';

import wallLogo from './assets/wall-c4-logo.webp';
import wallCoverDsr from './assets/wall-cover-dsr.webp';
import wallCoverHvn from './assets/wall-cover-hvn.webp';
import wallCoverSharp from './assets/wall-cover-sharp.webp';
import wallSharp from './assets/wall-sharp.webp';
import wallDsr from './assets/wall-dsr.webp';
import wallRocks from './assets/wall-rocks.webp';
import wallQuotr from './assets/wall-quotr.webp';
import wallSuite from './assets/wall-suite.webp';
import wallPeople from './assets/wall-people.webp';

const START_PROJECT_PATH = '/start';

/* SEO-locked H1 material — phrases and timings are contract items. */
const TYPE_SPEED = 72;
const HOLD_TIME = 20000;
const PAUSE_TIME = 700;
const DELETE_SPEED = 32;

const PHRASES = [
  'Welcome to C4',
  'Your website is 30% of the job.',
  'Loud websites. Quiet systems.',
  'Engineering, not decoration.',
  'Stop renting your operations.',
  'Your team spends 14h a week being a database.',
];

/* Evidence Wall — every image is a shipped artifact (downscaled WebP
   derivatives; sources in public/captures + public/covers stay
   untouched). pairing = the PHRASES index that summons the frame. */
const WALL_FRAMES = [
  {
    id: 'montage',
    pairing: 0,
    pos: 'p0',
    caption: 'C4 STUDIOS · PERTH W.A. · EST. 2022',
    montage: [
      { src: wallLogo, alt: 'C4 Studios logo mark', priority: true },
      { src: wallCoverDsr, alt: 'DS Racing Karts brand cover plate' },
      { src: wallCoverHvn, alt: 'HVN CrossFit brand cover plate' },
      { src: wallCoverSharp, alt: 'Sharp Bricklaying brand cover plate' },
    ],
  },
  {
    id: 'sharp',
    pairing: 1,
    pos: 'p1',
    src: wallSharp,
    alt: 'Sharp Bricklaying website hero — licensed drone aerial over a Perth job site',
    caption: 'SHARP BRICKLAYING · SHIPPED · sharpbricklaying.com.au',
  },
  {
    id: 'dsr',
    pairing: 2,
    pos: 'p2a',
    src: wallDsr,
    alt: 'DS Racing Karts ecommerce site hero — the loud one',
    caption: 'DS RACING KARTS · SHIPPED · dsracingkarts.com.au',
  },
  {
    id: 'rocks',
    pairing: 2,
    pos: 'p2b',
    src: wallRocks,
    alt: 'RocksStream pre-service show system login — the quiet one',
    caption: 'ROCKSSTREAM · SHIPPED · PRIVATE DEPLOY',
  },
  {
    id: 'quotr',
    pairing: 3,
    pos: 'p3',
    src: wallQuotr,
    alt: 'Quotr instant-quote calculator product site',
    caption: 'QUOTR · LIVE · quotr.us',
  },
  {
    id: 'suite',
    pairing: 4,
    pos: 'p4',
    src: wallSuite,
    alt: 'C4 software suite — tools built and run in-house',
    caption: 'C4 SUITE · LIVE · /software',
  },
  {
    id: 'people',
    pairing: 5,
    pos: 'p5',
    src: wallPeople,
    alt: 'People Power community platform intro screen',
    caption: 'PEOPLE POWER · LIVE · peoplepower.app',
  },
];

function EvidenceFrame({ frame, lit, capRef }) {
  return (
    <figure
      className={`hm-frame hm-frame--${frame.pos}${frame.montage ? ' hm-frame--montage' : ''}${lit ? ' is-lit' : ''}`}
      data-proof
    >
      {frame.montage ? (
        <span className="hm-montage">
          {frame.montage.map((m) => (
            <img
              key={m.src}
              src={m.src}
              alt={m.alt}
              width="480"
              height="360"
              /* React 18 passes unknown attrs through lowercase only
                 (camelCase fetchPriority is React 19); lint disagrees. */
              // eslint-disable-next-line react/no-unknown-property
              fetchpriority={m.priority ? 'high' : undefined}
              loading={m.priority ? 'eager' : 'lazy'}
              decoding="async"
            />
          ))}
        </span>
      ) : (
        <img src={frame.src} alt={frame.alt} loading="lazy" decoding="async" />
      )}
      <span className="hm-grain" aria-hidden="true" />
      <figcaption className="hm-cap" ref={capRef}>
        {frame.caption}
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────────────────────────────
   The front desk — Quotr, live on the counter, actually quoting.
   ───────────────────────────────────────────────────────────────── */
const QUOTR_SLUG = 'fixm4qeq';
const PANEL_IDLE_H = 412; // square-ish launcher box
const PANEL_LIVE_H = 648; // tall enough for the calculator form

function QuotrDesk() {
  const [launched, setLaunched] = useState(false);
  const iframeRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    preconnectQuotr();
  }, []);

  // Bake the theme into the src once so the iframe never reloads mid-form.
  const [src] = useState(() => buildQuotrSrc(QUOTR_SLUG, isDark));

  const pushTheme = useCallback(() => {
    postQuotrTheme(iframeRef.current, isDark);
  }, [isDark]);

  useEffect(() => {
    if (launched) pushTheme();
  }, [pushTheme, launched]);

  return (
    <div className="hm-desk">
      {/* Front-desk plate — LIVE — QUOTR (instrument caption grammar) */}
      <div className="hm-desk-plate">
        <span className="flex min-w-0 items-center gap-2">
          <span className="hm-live-dot" aria-hidden="true" />
          <span className="hm-cap">LIVE — QUOTR · REAL NUMBERS</span>
        </span>
        <a
          className="hm-desk-link"
          href="https://quotr.us"
          target="_blank"
          rel="noopener noreferrer"
        >
          quotr.us ↗
        </a>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-b-[3px]"
        style={{
          border: '1px solid var(--c4-border)',
          borderTop: 'none',
          backgroundColor: 'var(--c4-card-bg)',
          height: launched ? PANEL_LIVE_H : PANEL_IDLE_H,
          transition: 'height 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {launched ? (
          <div className="flex h-full w-full flex-col">
            {/* Chrome bar */}
            <div
              className="flex shrink-0 items-center justify-between border-b px-4"
              style={{ height: 44, borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--hm-ink2)' }}>
                Project Estimate
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://quotr.us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[44px] items-center gap-1 text-[10px] font-medium uppercase tracking-[0.13em] transition-colors duration-200"
                  style={{ color: 'var(--hm-ink2)' }}
                >
                  Full page
                  <ArrowUpRight size={10} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setLaunched(false)}
                  aria-label="Close calculator"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-colors duration-200"
                  style={{ color: 'var(--c4-text-muted)' }}
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            </div>

            <iframe
              ref={iframeRef}
              src={src}
              onLoad={pushTheme}
              title="Lock in your price now"
              width="100%"
              style={{ display: 'block', border: 'none', flex: '1 1 auto' }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setLaunched(true)}
            aria-label="Open the Quotr instant quote calculator"
            className="group relative flex h-full w-full flex-col items-stretch"
            style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
          >
            {/* Corner brackets — settle outward on hover, still at rest */}
            {[
              'left-3.5 top-3.5 border-l-[1.8px] border-t-[1.8px] group-hover:-translate-x-1 group-hover:-translate-y-1',
              'right-3.5 top-3.5 border-r-[1.8px] border-t-[1.8px] group-hover:translate-x-1 group-hover:-translate-y-1',
              'left-3.5 bottom-3.5 border-l-[1.8px] border-b-[1.8px] group-hover:-translate-x-1 group-hover:translate-y-1',
              'right-3.5 bottom-3.5 border-r-[1.8px] border-b-[1.8px] group-hover:translate-x-1 group-hover:translate-y-1',
            ].map((cls) => (
              <span
                key={cls}
                aria-hidden="true"
                className={`pointer-events-none absolute h-[22px] w-[22px] transition-transform duration-500 ${cls}`}
                style={{ borderColor: 'var(--c4-accent)', borderStyle: 'solid', borderWidth: 0 }}
              />
            ))}

            <span className="relative z-10 flex items-center justify-center gap-2 pt-7">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.28em]"
                style={{ color: 'var(--c4-accent)' }}
              >
                Press here to begin
              </span>
              <ArrowRight
                size={13}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: 'var(--c4-accent)' }}
              />
            </span>

            <span className="relative z-10 flex flex-1 items-center justify-center">
              <svg viewBox="0 0 200 120" className="w-full" preserveAspectRatio="xMidYMid meet" style={{ maxHeight: '70%' }}>
                <text
                  x="100" y="64" textAnchor="middle"
                  style={{
                    fontFamily: "'Archivo', 'Helvetica Neue', sans-serif",
                    fontWeight: 700,
                    fontSize: '40px',
                    fill: 'var(--c4-text)',
                    letterSpacing: '-0.04em',
                  }}
                >C4</text>
                <text
                  x="100" y="90" textAnchor="middle"
                  style={{
                    fontFamily: "'Geist', system-ui, sans-serif",
                    fontSize: '8px',
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    fill: 'var(--c4-text-muted)',
                  }}
                >STUDIOS · EST. 2022</text>
              </svg>
            </span>

            <span className="hm-cap relative z-10 pb-6 text-center">
              QUOTR · INSTANT QUOTE · ~2 MIN
            </span>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ backgroundColor: 'color-mix(in srgb, var(--c4-accent) 6%, transparent)' }}
            />
          </button>
        )}
      </div>
    </div>
  );
}

/* Mobile Quotr — full-screen sheet opened by a tap on phones. */
function MobileQuotrModal({ open, onClose }) {
  const iframeRef = useRef(null);
  const { isDark } = useTheme();
  const [src] = useState(() => buildQuotrSrc(QUOTR_SLUG, isDark));

  useEffect(() => {
    preconnectQuotr();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (typeof document === 'undefined' || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col lg:hidden"
      style={{ backgroundColor: 'var(--c4-bg)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Instant quote calculator"
    >
      <div
        className="flex shrink-0 items-center justify-between border-b px-5"
        style={{ height: 52, borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}
      >
        <div className="flex items-center gap-2">
          <span className="hm-live-dot" aria-hidden="true" />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--hm-ink2)' }}>
            Project Estimate
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close calculator"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center"
          style={{ color: 'var(--c4-text-subtle)' }}
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>
      <iframe
        ref={iframeRef}
        src={src}
        onLoad={() => postQuotrTheme(iframeRef.current, isDark)}
        title="Lock in your price now"
        className="w-full flex-1"
        style={{ display: 'block', border: 'none' }}
      />
    </div>,
    document.body,
  );
}

/* ─────────────────────────────────────────────────────────────────
   Hero
   ───────────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef(null);
  const wallRef = useRef(null);
  const bodyRef = useRef(null);
  const capRefs = useRef({});
  const scrambledOnce = useRef(false);
  const staticMode = useStaticMode();
  const [quotrModalOpen, setQuotrModalOpen] = useState(false);
  const [activePairing, setActivePairing] = useState(0);

  const handleLineChange = useCallback((idx) => {
    setActivePairing(idx);
  }, []);

  /* The one ScrambleText instance on the whole site: the caption of
     the newly lit frame resolves as the phrase commits (≤0.6s). */
  useEffect(() => {
    if (staticMode) return;
    if (!scrambledOnce.current) {
      // skip the mount call — pairing 0 rests already-resolved
      scrambledOnce.current = true;
      return;
    }
    const frames = WALL_FRAMES.filter((f) => f.pairing === activePairing);
    frames.forEach((f) => {
      const el = capRefs.current[f.id];
      if (!el) return;
      gsap.to(el, {
        duration: 0.55,
        scrambleText: { text: f.caption, chars: 'upperCase', speed: 0.9 },
        ease: 'none',
      });
      const img = el.parentElement?.querySelector('img');
      if (img) gsap.fromTo(img, { scale: 1.025 }, { scale: 1, duration: 1.1, ease: EASE });
    });
  }, [activePairing, staticMode]);

  /* Entrances + scroll grade — GSAP only (hero is framer-free), and
     none of it exists under staticMode: the default DOM is final. */
  useLayoutEffect(() => {
    if (staticMode) return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: EASE } })
          .from('[data-rise]', {
            y: 16,
            autoAlpha: 0,
            duration: 0.85,
            stagger: 0.09,
            clearProps: 'opacity,visibility,transform',
          }, 0.15)
          .from('.hm-frame', {
            y: 14,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.07,
            clearProps: 'opacity,visibility,transform',
          }, 0.35);
      });

      /* Leaving the hero: copy settles up and out; the wall lags a
         beat behind. Desktop only — on mobile the wall is in-flow.
         Scroll-driven only, dead still at rest. */
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to(bodyRef.current, {
          y: 64,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '58% top',
            scrub: 0.6,
          },
        });
        gsap.to(wallRef.current, {
          y: -46,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.9,
          },
        });
      });
      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, [staticMode]);

  return (
    <section
      ref={sectionRef}
      className={`hm-hero${staticMode ? ' hm-static' : ''}`}
    >
      {/* THE EVIDENCE WALL */}
      <div ref={wallRef} className="hm-wall">
        {WALL_FRAMES.map((frame) => (
          <EvidenceFrame
            key={frame.id}
            frame={frame}
            lit={frame.pairing === activePairing}
            capRef={(el) => { capRefs.current[frame.id] = el; }}
          />
        ))}
      </div>

      <div ref={bodyRef} className="hm-hero-body relative flex flex-1 items-center py-24 md:py-28">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-center lg:gap-16">
            <div className="max-w-[860px]">
              <p className="hm-kicker mb-5 md:mb-6" data-rise>
                C4 Studios
              </p>

              <div className="max-w-[760px]">
                <h1 className="hm-hero-h1 max-w-[14ch] text-[clamp(2.65rem,6vw,5.4rem)]">
                  <TypedHeading
                    lines={PHRASES}
                    className="block w-full"
                    cursorClassName="font-semibold"
                    typeSpeed={TYPE_SPEED}
                    deleteSpeed={DELETE_SPEED}
                    holdTime={HOLD_TIME}
                    pauseTime={PAUSE_TIME}
                    startDelay={500}
                    onLineChange={handleLineChange}
                  />
                </h1>

                <p
                  className="mt-7 max-w-[37rem] text-[15px] leading-[1.82] md:mt-9 md:text-[16px]"
                  style={{ color: 'var(--hm-ink2)', textWrap: 'pretty' }}
                  data-rise
                >
                  We design and build with clear direction, refined execution,
                  and quality that holds up after launch.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-12" data-rise>
                <Link
                  to={START_PROJECT_PATH}
                  className="c4-cta-primary hm-cta group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.14em]"
                  style={{ backgroundColor: 'var(--c4-accent)', color: '#fff' }}
                >
                  Start a project
                  <ArrowRight size={13} strokeWidth={2} className="opacity-80 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
                <Link
                  to={createPageUrl('Portfolio')}
                  className="c4-cta-ghost hm-cta group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.14em]"
                  style={{
                    color: 'var(--c4-text)',
                    border: '1px solid var(--c4-text)',
                    backgroundColor: 'transparent',
                  }}
                >
                  View recent work
                  <ArrowRight size={13} strokeWidth={2} className="opacity-60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              </div>

              {/* Mobile-only Quotr launcher — desktop uses the desk */}
              <button
                type="button"
                onClick={() => setQuotrModalOpen(true)}
                className="hm-cta mt-5 inline-flex items-center gap-2.5 self-start rounded-full px-5 py-2.5 lg:hidden"
                style={{
                  border: '1px solid var(--c4-border)',
                  backgroundColor: 'var(--c4-card-bg)',
                  color: 'var(--c4-text)',
                }}
                aria-label="Open the instant quote calculator"
                data-rise
              >
                <span className="hm-live-dot" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                  Get an instant quote
                </span>
                <ArrowRight size={13} strokeWidth={2} style={{ color: 'var(--c4-text-muted)' }} />
              </button>
            </div>

            <aside className="hidden w-full lg:block" data-rise>
              <QuotrDesk />
            </aside>
          </div>
        </div>
      </div>

      <div className="hm-hero-foot mx-auto w-full max-w-[1400px] px-6 pb-7 md:px-12 md:pb-9">
        <div data-rise>
          <div className="mb-8 flex justify-center md:mb-9">
            <button
              onClick={() => {
                if (sectionRef?.current?.nextElementSibling) {
                  sectionRef.current.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
                }
              }}
              aria-label="Scroll to continue"
              className="c4-next-section-invite group"
              style={{ background: 'transparent', border: 'none' }}
            >
              <span className="c4-next-section-label" style={{ color: 'var(--hm-ink2)' }}>
                Scroll
              </span>
              <span className="c4-next-section-chevron" aria-hidden="true">
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--c4-text-subtle)' }}>
                  <path d="M1 1l6 6 6-6" />
                </svg>
              </span>
            </button>
          </div>

          <div className="mx-auto mb-4 h-px max-w-[720px]" style={{ backgroundColor: 'var(--c4-border)' }} />
          <div className="mx-auto grid max-w-[720px] grid-cols-3 items-center text-center text-[10px] font-medium uppercase tracking-[0.22em]" style={{ color: 'var(--hm-ink2)' }}>
            <span>Perth, Australia</span>
            <span className="hidden sm:inline">Founder-led studio</span>
            <span className="sm:hidden" aria-hidden="true" />
            <span>Est. 2022</span>
          </div>
        </div>
      </div>

      <MobileQuotrModal open={quotrModalOpen} onClose={() => setQuotrModalOpen(false)} />
    </section>
  );
}
