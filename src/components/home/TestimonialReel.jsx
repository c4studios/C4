/* Fable-pass note: the reel is manual-advance only. The continuous
   CSS orbit and the autoplay/progress loop were retired — the
   site-wide continuous-animation budget permits neither (motion here
   is state-change or scroll only). */
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { getCaseStudy } from '../portfolio/caseStudyData';
import { useStaticMode } from './homeMotion';

const RING_SLOTS = 5;
const RING_RADIUS = 37; // percent of stage
const ease = [0.22, 1, 0.36, 1];

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

/** Cross-fades whenever `src` changes, keeping the frame size fixed.
    Under staticMode (`reduced`) no initial styles apply at all — the
    image rests at the CSS default, fully visible, with no rAF needed. */
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
          initial={reduced ? false : { opacity: 0 }}
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
  /* staticMode = Prerender UA OR prefers-reduced-motion (the shared
     page-wide pattern): all mount reveals render at their end-state. */
  const reduced = useStaticMode();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = testimonials.length;

  const active = testimonials[current];
  const media = useReelMedia(active);

  const goTo = useCallback((index, dir) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => goTo((current + 1) % total, 1), [current, goTo, total]);
  const prev = useCallback(() => goTo((current - 1 + total) % total, -1), [current, goTo, total]);

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
        {/* ── Reel stage: centre project mark + ring of screenshots ── */}
        <div className="order-1 flex justify-center">
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

            {/* still ring of project screenshots (crossfades on change) */}
            <div className="absolute inset-0">
              {SLOT_POSITIONS.map((pos, k) => {
                const src = media.shots.length ? media.shots[k % media.shots.length] : '';
                if (!src) return null;
                return (
                  <div
                    key={k}
                    className="absolute"
                    style={{ left: `${pos.left}%`, top: `${pos.top}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="relative">
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
                initial={reduced ? false : { scale: 0.9, opacity: 0 }}
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
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                transition={{ duration: reduced ? 0.05 : 0.5, ease }}
              >
                <span
                  className="text-[10px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: 'var(--c4-proof-muted)' }}
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
                      className="group ml-auto inline-flex min-h-[44px] items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300"
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

          {/* controls — manual advance only (44px touch floor) */}
          {total > 1 && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 hover:opacity-80"
                  style={{ border: '1px solid var(--c4-proof-border)', color: 'var(--c4-proof-muted)', backgroundColor: 'var(--c4-proof-surface)' }}
                >
                  <ChevronLeft size={15} strokeWidth={2} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 hover:opacity-80"
                  style={{ border: '1px solid var(--c4-proof-border)', color: 'var(--c4-proof-muted)', backgroundColor: 'var(--c4-proof-surface)' }}
                >
                  <ChevronRight size={15} strokeWidth={2} />
                </button>
              </div>

              <div className="flex items-center">
                {testimonials.map((t, index) => (
                  <button
                    key={t.id}
                    onClick={() => goTo(index, index > current ? 1 : -1)}
                    aria-label={`Go to testimonial ${index + 1}`}
                    aria-current={index === current}
                    className="flex h-11 items-center px-1.5"
                  >
                    <span
                      className="block h-[3px] rounded-full transition-all duration-500"
                      style={{
                        width: index === current ? 30 : 10,
                        backgroundColor: index === current ? 'var(--c4-proof-text)' : 'color-mix(in srgb, var(--c4-proof-border) 75%, transparent)',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
