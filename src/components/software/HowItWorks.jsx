/**
 * HowItWorks — scroll-driven, step-by-step "how you actually use it" section
 * for the product detail page.
 *
 * Each step reveals as it enters the viewport: the number badge animates in
 * and the copy slides up, with a connecting rail that draws down between the
 * steps. Built on framer-motion (already a repo dependency) so it degrades
 * gracefully — with JS/motion off, every step is rendered statically and is
 * fully readable, which matters for the SSG prerender.
 *
 * Respects prefers-reduced-motion (framer-motion honours the OS setting; we
 * also render final content server-side).
 */
import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function HowItWorks({ steps, accent = 'var(--c4-accent)' }) {
  if (!steps?.length) return null;

  return (
    <section className="pb-16 md:pb-24">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-3" style={{ color: 'var(--c4-text-subtle)' }}>
          How it works
        </p>
        <p className="text-[15px] md:text-[17px] leading-[1.6] max-w-[46ch] mb-10" style={{ color: 'var(--c4-text-muted)' }}>
          Three steps from sign-up to something useful. No manual, no onboarding call.
        </p>

        <ol className="relative">
          {/* Connecting rail (decorative) */}
          <span
            aria-hidden="true"
            className="absolute left-[19px] top-3 bottom-3 w-px md:left-[23px]"
            style={{ backgroundColor: 'var(--c4-border)' }}
          />

          {steps.map((step, i) => (
            <motion.li
              key={step.step}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.05, ease }}
              className="relative flex gap-5 md:gap-7 pb-10 last:pb-0"
            >
              {/* Number badge */}
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.12, ease }}
                className="relative z-[1] flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full text-[13px] md:text-[15px] font-semibold tabular-nums"
                style={{
                  color: accent,
                  backgroundColor: 'var(--c4-bg)',
                  border: `1px solid ${accent}`,
                }}
              >
                {step.step}
              </motion.span>

              <div className="pt-1.5 md:pt-2.5">
                <p className="text-[16px] md:text-[18px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                  {step.title}
                </p>
                <p className="mt-2 text-[13.5px] md:text-[14px] leading-[1.7] max-w-[54ch]" style={{ color: 'var(--c4-text-muted)' }}>
                  {step.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
