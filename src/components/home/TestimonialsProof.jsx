import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import TestimonialSlider from '../testimonials/TestimonialSlider';
import { getFeaturedTestimonials } from '../testimonials/testimonialData';

const ease = [0.22, 1, 0.36, 1];

export default function TestimonialsProof() {
  const featured = getFeaturedTestimonials();

  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--c4-proof-bg)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--c4-proof-surface) 70%, transparent) 0%, rgba(0, 0, 0, 0) 100%)' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 pt-20 md:px-12 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="max-w-[620px]"
        >
          <span
            className="text-[10px] uppercase tracking-[0.24em] font-medium"
            style={{ color: 'var(--c4-proof-faint)' }}
          >
            Testimonials
          </span>
          <h2
            className="mt-4 text-[1.6rem] font-semibold tracking-[-0.035em] leading-[1.08] md:text-[2.15rem]"
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

      <TestimonialSlider
        testimonials={featured}
        label="Client feedback"
        variant="proof"
        sectionClassName="pt-8 pb-8 md:pt-10 md:pb-10"
      />

      <div className="relative pb-16 md:pb-24" style={{ backgroundColor: 'var(--c4-proof-bg)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6 pt-6 md:flex-row md:items-end md:justify-between"
            style={{ borderTop: '1px solid var(--c4-proof-border)' }}
          >
            <div className="max-w-[520px]">
              <p
                className="text-[10px] font-medium uppercase tracking-[0.22em]"
                style={{ color: 'var(--c4-proof-accent)' }}
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
              className="text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
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
