/* ─────────────────────────────────────────────────────────────────
   FOLD 4a — TESTIMONY (clients speak in full)

   Restaged on the gallery surface for the fable pass: the tracked
   micro-eyebrows are retired (labels set in plain Geist), while every
   substantive line survives verbatim — including the full-display
   commitment copy, which IS the proof-engine ethos.
   ───────────────────────────────────────────────────────────────── */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import TestimonialReel from './TestimonialReel';
import { getFeaturedTestimonials } from '../testimonials/testimonialData';
import { useStaticMode } from './homeMotion';

const ease = [0.22, 1, 0.36, 1];

export default function TestimonialsProof() {
  const featured = getFeaturedTestimonials();
  const staticMode = useStaticMode();

  /* Reveals enhance, never gate: under staticMode (Prerender UA /
     reduced motion) the wrappers carry no initial styles at all, so
     the DOM default IS the finished end-state — no IntersectionObserver
     needs to fire for this text to be readable. */
  const headReveal = staticMode
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease },
      };
  const commitReveal = staticMode
    ? {}
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { duration: 0.5, delay: 0.1 },
      };

  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--c4-proof-bg)' }}
      data-proof
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--c4-proof-surface) 70%, transparent) 0%, rgba(0, 0, 0, 0) 100%)' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 pt-20 md:px-12 md:pt-28">
        <motion.div {...headReveal} className="max-w-[620px]">
          <p className="text-[13px] font-medium" style={{ color: 'var(--c4-proof-muted)' }}>
            Testimonials
          </p>
          <h2
            className="hm-h2 mt-3 text-[clamp(1.6rem,3vw,2.15rem)]"
            style={{ color: 'var(--c4-proof-text)' }}
          >
            Client notes
          </h2>
          <p
            className="mt-4 max-w-[520px] text-[14px] leading-[1.7] md:text-[15px]"
            style={{ color: 'var(--c4-proof-muted)' }}
          >
            Recent feedback, reproduced in full.
          </p>
        </motion.div>
      </div>

      <TestimonialReel testimonials={featured} />

      <div className="relative pb-16 md:pb-24" style={{ backgroundColor: 'var(--c4-proof-bg)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            {...commitReveal}
            className="flex flex-col gap-6 pt-6 md:flex-row md:items-end md:justify-between"
            style={{ borderTop: '1px solid var(--c4-proof-border)' }}
          >
            <div className="max-w-[520px]">
              <p
                className="text-[14px] font-semibold"
                style={{ color: 'var(--c4-proof-text)' }}
              >
                Our commitment
              </p>
              <p
                className="mt-3 text-[14px] leading-[1.75] md:text-[15px]"
                style={{ color: 'var(--c4-proof-muted)' }}
              >
                All testimonials received from clients are displayed in full. We believe in accountability within our practice and do not curate feedback to present a false image of our standards.
              </p>
            </div>

            <Link
              to={createPageUrl('StartProject')}
              className="inline-flex min-h-[44px] items-center text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300"
              style={{ color: 'var(--c4-proof-muted)' }}
              onMouseEnter={(event) => {
                event.currentTarget.style.color = 'var(--c4-proof-text)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = 'var(--c4-proof-muted)';
              }}
            >
              Start a project
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
