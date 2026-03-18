import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function AboutHero() {
  return (
    <section className="pt-28 md:pt-36 pb-14 md:pb-20" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex items-center gap-3 md:mb-10"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="h-px w-8 origin-left"
            style={{ backgroundColor: 'var(--c4-accent)' }}
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-[10px] uppercase tracking-[0.25em] font-medium"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            About
          </motion.span>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="text-[clamp(2rem,5vw,3.4rem)] font-semibold tracking-[-0.035em] leading-[1.08]"
              style={{ color: 'var(--c4-text)' }}
            >
              Small studio. High standards. Direct contact.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
              className="mt-6 max-w-[540px] text-[14px] leading-[1.75] md:text-[15px]"
              style={{ color: 'var(--c4-text-muted)' }}
            >
              C4 Studios is run directly from first call to launch. No handoff, no account layer, and no gap between the brief and the work.
            </motion.p>
          </div>

          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
          >
            <div className="aspect-[4/5] max-w-[320px] md:ml-auto rounded-[3px] overflow-hidden" style={{ border: '1px solid var(--c4-border)' }}>
              <img
                src="/founder-headshot.png"
                alt="Founder of C4 Studios"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="mt-4 max-w-[320px] md:ml-auto">
              <p className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                Founder & Web Solutions Architect
              </p>
              <p className="mt-0.5 text-[12.5px]" style={{ color: 'var(--c4-text-muted)' }}>
                C4 Studios | Perth, Australia
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
