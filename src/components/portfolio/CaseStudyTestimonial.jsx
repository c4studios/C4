import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

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

/**
 * A pinned "client note" panel for a case study page. The quote draws itself
 * in word-by-word (with a trailing caret) the first time it scrolls into view.
 * All words are always in the DOM (only opacity/transform animate), so the
 * quote is present for prerender / SEO / no-JS and never reflows as it types.
 */
export default function CaseStudyTestimonial({ testimonial, className = '' }) {
  const reduced = usePrefersReducedMotion();

  const words = useMemo(
    () => (testimonial?.quote || '').trim().split(/\s+/).filter(Boolean),
    [testimonial]
  );

  if (!testimonial || words.length === 0) return null;

  // Keep the whole draw-in short and snappy regardless of quote length.
  const stagger = reduced ? 0 : Math.min(0.05, Math.max(0.012, 1.4 / words.length));
  const delayChildren = reduced ? 0 : 0.12;
  const typeDuration = delayChildren + words.length * stagger;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };

  const wordVariant = {
    hidden: { opacity: 0, y: reduced ? 0 : 6, filter: reduced ? 'blur(0px)' : 'blur(3px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: reduced ? 0.001 : 0.34, ease },
    },
  };

  const caretVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { delay: typeDuration } },
  };

  return (
    <motion.figure
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2, ease }}
      className={`relative rounded-[4px] px-6 py-6 md:px-7 md:py-7 ${className}`}
      style={{
        backgroundColor: 'var(--c4-card-bg)',
        border: '1px solid var(--c4-border)',
        boxShadow: '0 18px 40px rgba(20, 20, 20, 0.07)',
      }}
    >
      {/* label */}
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className="text-[9px] font-medium uppercase tracking-[0.22em]"
          style={{ color: 'var(--c4-text-faint)' }}
        >
          Client note
        </span>
        <span className="h-px flex-1" style={{ backgroundColor: 'var(--c4-border-light)' }} />
      </div>

      {/* the drawing-in quote */}
      <blockquote>
        <motion.p
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-8% 0px' }}
          className="text-[13.5px] leading-[1.72] tracking-[-0.005em] md:text-[14px]"
          style={{ color: 'var(--c4-text)' }}
        >
          <span aria-hidden="true" style={{ color: 'var(--c4-accent)' }}>&ldquo;</span>
          {words.map((word, i) => (
            <React.Fragment key={`${word}-${i}`}>
              <motion.span variants={wordVariant} className="inline-block">
                {word}
              </motion.span>
              {' '}
            </React.Fragment>
          ))}
          <span aria-hidden="true" style={{ color: 'var(--c4-accent)' }}>&rdquo;</span>
          <motion.span
            variants={caretVariant}
            aria-hidden="true"
            className="ml-0.5 inline-block align-baseline"
          >
            <span className="c4-typed-cursor" style={{ color: 'var(--c4-accent)' }}>_</span>
          </motion.span>
        </motion.p>
      </blockquote>

      {/* attribution */}
      <figcaption
        className="mt-5 border-t pt-4"
        style={{ borderColor: 'var(--c4-border-light)' }}
      >
        <p className="text-[13px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
          {testimonial.name}
        </p>
        <p className="mt-0.5 text-[11.5px]" style={{ color: 'var(--c4-text-muted)' }}>
          {testimonial.role}
        </p>
      </figcaption>
    </motion.figure>
  );
}
