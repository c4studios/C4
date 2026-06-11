import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const steps = [
  { n: '01', label: 'Conversation', text: 'A real call, not a form reply. We learn the business, the bottleneck, and the outcome you actually need.' },
  { n: '02', label: 'Scope & quote', text: 'A clear, fixed scope with transparent pricing — you know exactly what you get and what it costs before anything starts.' },
  { n: '03', label: 'Design & build', text: 'You see progress as it happens, with checkpoints to approve direction. No black boxes, no month-long silences.' },
  { n: '04', label: 'Launch & handover', text: 'Deployment, documentation, and full ownership transferred to you — plus a window of support to settle in.' },
];

export default function StudioProcess() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-10 md:mb-14"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] font-medium mb-3" style={{ color: 'var(--c4-text-subtle)' }}>
            How we work
          </p>
          <h3 className="text-[1.4rem] md:text-[1.9rem] font-semibold tracking-[-0.025em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            Four steps, start to finish.
          </h3>
        </motion.div>

        {/* Interactive stepper */}
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          {/* Step rail */}
          <div className="flex flex-col">
            {steps.map((s, i) => {
              const isActive = active === i;
              return (
                <button
                  key={s.n}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group relative flex items-center gap-5 py-5 pl-5 md:pl-6 text-left transition-colors duration-300"
                  style={{ borderTop: i === 0 ? 'none' : '1px solid var(--c4-border)' }}
                >
                  <span
                    className="text-[13px] tabular-nums font-semibold transition-colors duration-300"
                    style={{ color: isActive ? 'var(--c4-accent)' : 'var(--c4-text-faint)' }}
                  >
                    {s.n}
                  </span>
                  <span
                    className="text-[1.05rem] md:text-[1.25rem] font-semibold tracking-[-0.02em] transition-all duration-300"
                    style={{
                      color: isActive ? 'var(--c4-text)' : 'var(--c4-text-subtle)',
                      transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                    }}
                  >
                    {s.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="process-active"
                      className="absolute left-0 top-0 bottom-0 w-[2px]"
                      style={{ backgroundColor: 'var(--c4-accent)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div
            className="relative rounded-[3px] p-8 md:p-10 min-h-[220px] flex flex-col justify-center"
            style={{ backgroundColor: 'var(--c4-bg-alt)', border: '1px solid var(--c4-border)' }}
          >
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <span className="text-[clamp(2.4rem,6vw,4rem)] font-semibold tracking-[-0.05em] leading-[0.9] block mb-5 tabular-nums" style={{ color: 'color-mix(in srgb, var(--c4-accent) 22%, transparent)' }}>
                {steps[active].n}
              </span>
              <h4 className="text-[1.3rem] font-semibold tracking-[-0.02em] mb-3" style={{ color: 'var(--c4-text)' }}>
                {steps[active].label}
              </h4>
              <p className="text-[14px] leading-[1.75] max-w-[46ch]" style={{ color: 'var(--c4-text-muted)' }}>
                {steps[active].text}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
