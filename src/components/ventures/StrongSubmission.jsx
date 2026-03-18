import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const criteria = [
  { label: 'Clear problem', description: 'A real pain point, not a "nice to have."' },
  { label: 'Defined audience', description: 'You know exactly who this is for.' },
  { label: 'Realistic MVP scope', description: 'Can be built and tested without a 12-month roadmap.' },
  { label: 'Why now', description: 'There\'s a reason this matters today.' },
  { label: 'What makes it different', description: "Not just 'better' — structurally distinct." },
];

export default function StrongSubmission() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <motion.div
            className="md:col-span-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <h3 className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
              What Makes a Strong Submission
            </h3>
            <p className="mt-3 text-[14px] leading-[1.6] max-w-[320px]" style={{ color: 'var(--c4-text-muted)' }}>
              We don't expect a pitch deck. But we do look for these signals.
            </p>
          </motion.div>

          <div className="md:col-span-8">
            <div className="border-t" style={{ borderColor: 'var(--c4-border)' }}>
              {criteria.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.05 * i, ease }}
                  className="py-4 border-b flex items-start gap-4"
                  style={{ borderColor: 'var(--c4-border)' }}
                >
                  <div className="mt-1.5 w-5 h-5 rounded-[2px] flex items-center justify-center shrink-0" style={{ border: '1px solid color-mix(in srgb, var(--c4-accent) 30%, transparent)' }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="var(--c4-accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[13.5px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>{item.label}</span>
                    <span className="text-[13px] ml-2" style={{ color: 'var(--c4-text-muted)' }}>{item.description}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}