import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const milestones = [
  {
    year: '2022',
    title: 'C4 Studios begins',
    text: 'Founded in Perth as a one-person studio with a simple rule: the person you brief is the person who builds.',
  },
  {
    year: '2023',
    title: 'First systems clients',
    text: 'Moved beyond websites into automations and internal tools — replacing manual admin for local service businesses.',
  },
  {
    year: '2024',
    title: 'Quotr goes live',
    text: 'Shipped our first product to the public: instant quote calculators that any service business can embed in minutes.',
  },
  {
    year: '2025',
    title: 'The C4 Originals suite',
    text: 'ReturnDesk, ReviewLoop, Complia and FirmFlow join the lineup — software built from problems we kept seeing.',
  },
  {
    year: 'Today',
    title: 'Loud websites. Quiet systems.',
    text: 'Four services and a growing software shelf, still founder-led, still direct from first call to launch.',
  },
];

export default function StudioTimeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 70%'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-12 md:mb-16"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] font-medium mb-3" style={{ color: 'var(--c4-text-subtle)' }}>
            The story so far
          </p>
          <h3 className="text-[1.4rem] md:text-[1.9rem] font-semibold tracking-[-0.025em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            How we got here.
          </h3>
        </motion.div>

        <div ref={ref} className="relative pl-8 md:pl-0">
          {/* Track (desktop: centered-left rail) */}
          <div
            className="absolute left-[7px] md:left-[120px] top-1 bottom-1 w-px"
            style={{ backgroundColor: 'var(--c4-border)' }}
          />
          {/* Progress fill */}
          <motion.div
            className="absolute left-[7px] md:left-[120px] top-1 w-px origin-top"
            style={{
              backgroundColor: 'var(--c4-accent)',
              scaleY: lineScale,
              bottom: 4,
            }}
          />

          <div className="flex flex-col gap-10 md:gap-14">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: 0.05, ease }}
                className="relative grid md:grid-cols-[120px_1fr] md:gap-10 items-start"
              >
                {/* Year */}
                <div className="hidden md:block text-right pr-8">
                  <span className="text-[13px] font-semibold tracking-[-0.01em] tabular-nums" style={{ color: 'var(--c4-accent)' }}>
                    {m.year}
                  </span>
                </div>

                {/* Node */}
                <span
                  className="absolute left-[-29px] md:left-[114px] top-1.5 h-3.5 w-3.5 rounded-full border-2"
                  style={{ backgroundColor: 'var(--c4-bg)', borderColor: 'var(--c4-accent)' }}
                />

                {/* Content */}
                <div>
                  <span className="md:hidden block text-[12px] font-semibold mb-1 tabular-nums" style={{ color: 'var(--c4-accent)' }}>
                    {m.year}
                  </span>
                  <h4 className="text-[1.05rem] font-semibold tracking-[-0.02em] mb-2" style={{ color: 'var(--c4-text)' }}>
                    {m.title}
                  </h4>
                  <p className="text-[13.5px] leading-[1.7] max-w-[52ch]" style={{ color: 'var(--c4-text-muted)' }}>
                    {m.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
