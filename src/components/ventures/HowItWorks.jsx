import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const steps = [
  {
    num: '01',
    title: 'Submit your idea',
    description: 'Fill out the structured form below. The more detail you provide, the stronger your submission.',
  },
  {
    num: '02',
    title: 'Review & score',
    description: 'We evaluate every submission on feasibility, market clarity, build scope, and differentiation.',
  },
  {
    num: '03',
    title: 'Follow-up if selected',
    description: "If your idea stands out, we'll reach out to discuss it further — no obligations on either side.",
  },
  {
    num: '04',
    title: 'Build path',
    description: "Selected ideas may proceed as a client project, a potential partnership, or receive honest feedback on why it's not the right fit.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.1] mb-10 md:mb-14"
          style={{ color: 'var(--c4-text)' }}
        >
          How It Works
        </motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.07 * i, ease }}
              className="border-t pt-5"
              style={{ borderColor: 'var(--c4-border)' }}
            >
              <span className="text-[11px] font-semibold tabular-nums tracking-[0.1em]" style={{ color: 'var(--c4-accent)' }}>
                {step.num}
              </span>
              <h4 className="mt-2.5 text-[14px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                {step.title}
              </h4>
              <p className="mt-1.5 text-[12.5px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}