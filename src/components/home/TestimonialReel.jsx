import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight, Pause } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { getCaseStudy } from '../portfolio/caseStudyData';

const AUTOPLAY_INTERVAL = 7000;
const RING_SLOTS = 5;
const RING_RADIUS = 37; // percent of stage
const ease = [0.22, 1, 0.36, 1];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);
    const handler = (event) => setReduced(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reduced;
}

// Pre-computed ring slot coordinates (percent), starting at top, going clockwise.
const SLOT_POSITIONS = Array.from({ length: RING_SLOTS }, (_, k) => {
  const angle = (-90 + k * (360 / RING_SLOTS)) * (Math.PI / 180);
  return {
    left: 50 + RING_RADIUS * Math.cos(angle),
    top: 50 + RING_RADIUS * Math.sin(angle),
  };
});

/** Resolves a testimonial to the project imagery shown in the reel. */
function useReelMedia(testimonial) {
  const study = getCaseStudy(testimonial?.caseStudySlug);
  const shots = (study?.desktopScreenshots?.length ? study.desktopScreenshots : study?.screenshots || [])
    .map((s) => s?.url)
    .filter(Boolean);

  return {
    centerSrc: study?.cover || study?.thumbnail || shots[0] || '',
    centerIsLogo: Boolean(study?.cover),
    centerBg: study?.brandColor || 'var(--c4-proof-surface)',
    shots,
    name: study?.name || testimonial?.role,
  };
}

/** Cross-fades whenever `src` changes, keeping the frame size fixed. */
function CrossfadeImage({ src, alt, className = '', imgClassName = '', reduced }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence initial={false}>
        <motion.img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.001 : 0.7, ease }}
          className={`absolute inset-0 h-full w-full select-none ${imgClassName}`}
        />
      </AnimatePresence>
    </div>
  );
}

export default function TestimonialReel({ testimonials = [] }) {
  const reduced = usePrefersReducedMotion();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const total = testimonials.length;

  const active = testimonials[current];
  const media = useReelMedia(active);

  const goTo = useCallback((index, dir) => {
    setDirection(dir);
    setCurrent(index);
    setProgress(0);
    startRef.current = null;
  }, []);

  const next = useCallback(() => goTo((current + 1) % total, 1), [current, goTo, total]);
  const prev = useCallback(() => goTo((current - 1 + total) % total, -1), [current, goTo, total]);

  // Autoplay with a progress ring
  useEffect(() => {
    if (reduced || paused || total <= 1) {
      cancelAnimationFrame(rafRef.current);
      return undefined;
    }
    startRef.current = null;
    setProgress(0);

    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const pct = Math.min((now - startRef.current) / AUTOPLAY_INTERVAL, 1);
      setProgress(pct);
      if (pct >= 1) next();
      else rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [current, next, paused, reduced, total]);

  if (total === 0 || !active) return null;

  const casePath = active.caseStudySlug ? createPageUrl(`CaseStudy?slug=${active.caseStudySlug}`) : null;

  return (
    <section
      className="relative"
      style={{ backgroundColor: 'var(--c4-proof-bg)' }}
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 pb-8 pt-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:gap-14 md:px-12 md:pb-10 md:pt-8">
        {/* ── Reel stage: centre project mark + orbiting screenshots ── */}
        <div
          className="order-1 flex justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative aspect-square w-[min(86vw,430px)]">
            {/* soft radial glow behind the reel */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[8%] rounded-full"
              style={{
                background: 'radial-gradient(circle, color-mix(in srgb, var(--c4-proof-accent) 12%, transparent) 0%, transparent 62%)',
              }}
            />

            {/* dashed orbit guide */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute rounded-full"
              style={{
                inset: `${50 - RING_RADIUS - 11}%`,
                border: '1px dashed color-mix(in srgb, var(--c4-proof-accent) 26%, transparent)',
                opacity: 0.5,
              }}
            />

            {/* rotating ring of project screenshots (CSS-driven orbit) */}
            <div className="c4-reel-ring absolute inset-0">
              {SLOT_POSITIONS.map((pos, k) => {
                const src = media.shots.length ? media.shots[k % media.shots.length] : '';
                if (!src) return null;
                return (
                  <div
                    key={k}
                    className="absolute"
                    style={{ left: `${pos.left}%`, top: `${pos.top}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    {/* counter-rotate so screenshots stay upright while orbiting */}
                    <div className="c4-reel-counter relative">
                      <CrossfadeImage
                        src={src}
                        alt=""
                        reduced={reduced}
                        className="h-[clamp(58px,17vw,84px)] w-[clamp(88px,25vw,128px)] rounded-[6px]"
                        imgClassName="object-cover"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-[6px]"
                        style={{ boxShadow: '0 10px 22px rgba(36,27,24,0.16)', border: '1px solid var(--c4-proof-border)' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* centre project mark */}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                key={active.caseStudySlug}
                initial={{ scale: reduced ? 1 : 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: reduced ? 0.001 : 0.55, ease }}
                className="flex h-[clamp(116px,32vw,158px)] w-[clamp(116px,32vw,158px)] items-center justify-center overflow-hidden rounded-full"
                style={{
                  backgroundColor: media.centerBg,
                  boxShadow: '0 22px 48px rgba(36,27,24,0.28)',
                  border: '3px solid var(--c4-proof-surface)',
                }}
              >
                {media.centerSrc && (
                  media.centerIsLogo ? (
                    <img
                      src={media.centerSrc}
                      alt={`${media.name} logo`}
                      className="max-h-[62%] max-w-[68%] select-none object-contain"
                      draggable={false}
                    />
                  ) : (
                    <CrossfadeImage
                      src={media.centerSrc}
                      alt={`${media.name}`}
                      reduced={reduced}
                      className="h-full w-full"
                      imgClassName="object-cover"
                    />
                  )
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Quote column ── */}
        <div className="order-2">
          <div className="min-h-[280px] md:min-h-[300px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.id}
                custom={direction}
                initial={{ opacity: 0, y: reduced ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                transition={{ duration: reduced ? 0.05 : 0.5, ease }}
              >
                <span
                  className="text-[10px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: 'var(--c4-proof-faint)' }}
                >
                  {media.name}
                </span>

                <div className="mt-4 mb-5 h-px w-10" style={{ backgroundColor: 'var(--c4-proof-accent)' }} />

                <blockquote
                  className="text-[16px] font-medium leading-[1.72] tracking-[-0.01em] md:text-[18.5px]"
                  style={{ color: 'var(--c4-proof-text)' }}
                >
                  &ldquo;{active.quote}&rdquo;
                </blockquote>

                <div className="mt-7 flex items-center gap-4">
                  <div>
                    <p className="text-[13.5px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-proof-text)' }}>
                      {active.name}
                    </p>
                    <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c4-proof-muted)' }}>
                      {active.role}
                    </p>
                  </div>

                  {casePath && (
                    <Link
                      to={casePath}
                      className="group ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300"
                      style={{ color: 'var(--c4-proof-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c4-proof-text)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--c4-proof-muted)'; }}
                    >
                      View case study
                      <ArrowUpRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* controls */}
          {total > 1 && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 hover:opacity-80"
                  style={{ border: '1px solid var(--c4-proof-border)', color: 'var(--c4-proof-muted)', backgroundColor: 'var(--c4-proof-surface)' }}
                >
                  <ChevronLeft size={15} strokeWidth={2} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 hover:opacity-80"
                  style={{ border: '1px solid var(--c4-proof-border)', color: 'var(--c4-proof-muted)', backgroundColor: 'var(--c4-proof-surface)' }}
                >
                  <ChevronRight size={15} strokeWidth={2} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {testimonials.map((t, index) => (
                  <button
                    key={t.id}
                    onClick={() => goTo(index, index > current ? 1 : -1)}
                    aria-label={`Go to testimonial ${index + 1}`}
                    aria-current={index === current}
                    className="relative h-[3px] overflow-hidden rounded-full transition-all duration-500"
                    style={{
                      width: index === current ? 30 : 10,
                      backgroundColor: index === current ? 'var(--c4-proof-border)' : 'color-mix(in srgb, var(--c4-proof-border) 55%, transparent)',
                    }}
                  >
                    {index === current && !reduced && (
                      <span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: `${progress * 100}%`, backgroundColor: 'var(--c4-proof-accent)' }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {paused && !reduced && (
                  <motion.span
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="ml-1 hidden items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] sm:inline-flex"
                    style={{ color: 'var(--c4-proof-faint)' }}
                  >
                    <Pause size={9} strokeWidth={2.5} />
                    Paused
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
