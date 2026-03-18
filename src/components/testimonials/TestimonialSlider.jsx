import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause } from 'lucide-react';
import TestimonialCard from './TestimonialCard';

const AUTOPLAY_INTERVAL = 8000;
const ease = [0.22, 1, 0.36, 1];

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 6 : -6 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -6 : 6 }),
};

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

export default function TestimonialSlider({
  testimonials,
  label = 'What clients say',
  variant = 'light',
  sectionClassName = '',
}) {
  const proof = variant === 'proof';
  const dark = variant === 'dark';
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const total = testimonials?.length ?? 0;

  const goTo = useCallback((index, dir) => {
    setDirection(dir);
    setCurrent(index);
    setProgress(0);
    startTimeRef.current = null;
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % total, 1);
  }, [current, goTo, total]);

  const prev = useCallback(() => {
    goTo((current - 1 + total) % total, -1);
  }, [current, goTo, total]);

  useEffect(() => {
    if (reducedMotion || paused || total <= 1) {
      cancelAnimationFrame(progressRef.current);
      return undefined;
    }

    startTimeRef.current = performance.now();
    setProgress(0);

    const tick = (now) => {
      if (!startTimeRef.current) startTimeRef.current = now;

      const elapsed = now - startTimeRef.current;
      const percentage = Math.min(elapsed / AUTOPLAY_INTERVAL, 1);
      setProgress(percentage);

      if (percentage >= 1) {
        next();
      } else {
        progressRef.current = requestAnimationFrame(tick);
      }
    };

    progressRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(progressRef.current);
  }, [current, next, paused, reducedMotion, total]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') next();
    if (event.key === 'ArrowLeft') prev();
  }, [next, prev]);

  const transitionConfig = reducedMotion
    ? { duration: 0.05 }
    : { duration: 0.5, ease };

  const background = proof
    ? 'var(--c4-proof-bg)'
    : dark
      ? 'var(--c4-inverted-bg)'
      : 'var(--c4-bg)';

  const textSubtle = proof
    ? 'var(--c4-proof-faint)'
    : dark
      ? 'var(--c4-inverted-text-faint)'
      : 'var(--c4-text-subtle)';

  const textMuted = proof
    ? 'var(--c4-proof-muted)'
    : dark
      ? 'var(--c4-inverted-text-muted)'
      : 'var(--c4-text-muted)';

  const border = proof
    ? 'var(--c4-proof-border)'
    : dark
      ? 'var(--c4-inverted-border)'
      : 'var(--c4-border)';

  const borderLight = proof
    ? 'var(--c4-proof-border)'
    : dark
      ? 'var(--c4-inverted-border)'
      : 'var(--c4-border-light)';

  const surface = proof
    ? 'var(--c4-proof-surface)'
    : dark
      ? 'var(--c4-inverted-bg)'
      : 'var(--c4-bg-alt)';

  const controlBackground = proof
    ? 'color-mix(in srgb, var(--c4-proof-surface) 88%, white)'
    : dark
      ? 'rgba(255,255,255,0.03)'
      : 'var(--c4-card-bg)';

  if (total === 0) return null;

  return (
    <section
      className={`py-16 md:py-24 ${sectionClassName}`.trim()}
      style={{ backgroundColor: background }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-10 flex items-end justify-between md:mb-14">
          <div className="flex items-center gap-4">
            <span
              className="text-[10px] uppercase tracking-[0.22em] font-medium"
              style={{ color: textSubtle }}
            >
              {label}
            </span>

            <AnimatePresence>
              {!paused && !reducedMotion && total > 1 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hidden text-[9px] uppercase tracking-[0.1em] md:inline"
                  style={{ color: textSubtle }}
                >
                  Hover to pause
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {paused && !reducedMotion && (
                <motion.span
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="mr-2 flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-medium"
                  style={{
                    color: textSubtle,
                    border: `1px solid ${border}`,
                    backgroundColor: surface,
                  }}
                >
                  <Pause size={9} strokeWidth={2.5} />
                  Paused
                </motion.span>
              )}
            </AnimatePresence>

            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300"
              style={{ border: `1px solid ${border}`, color: textMuted, backgroundColor: controlBackground }}
            >
              <ChevronLeft size={15} strokeWidth={2} />
            </button>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300"
              style={{ border: `1px solid ${border}`, color: textMuted, backgroundColor: controlBackground }}
            >
              <ChevronRight size={15} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div
          className="relative"
          tabIndex={0}
          role="region"
          aria-label="Testimonials"
          aria-roledescription="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={handleKeyDown}
          style={{ outline: 'none' }}
        >
          <div className="mx-auto min-h-[360px] max-w-[760px] md:min-h-[320px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transitionConfig}
                aria-live="polite"
              >
                <TestimonialCard
                  testimonial={testimonials[current]}
                  variant={variant}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {total > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index, index > current ? 1 : -1)}
                aria-label={`Go to testimonial ${index + 1}`}
                className="relative h-[3px] overflow-hidden rounded-full transition-all duration-500"
                style={{
                  width: index === current ? 32 : 12,
                  backgroundColor: index === current ? border : borderLight,
                }}
              >
                {index === current && !reducedMotion && (
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${progress * 100}%`,
                      backgroundColor: proof
                        ? 'var(--c4-proof-accent)'
                        : textMuted,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
