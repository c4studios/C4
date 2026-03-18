import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const pillars = [
  { word: 'See', meaning: 'Clarity of vision. Understanding what your brand truly needs before a single pixel is placed.' },
  { word: 'Strategy', meaning: 'Every decision grounded in purpose. Design that converts, code that scales.' },
  { word: 'Craft', meaning: 'Obsessive attention to detail. Typography, spacing, motion — nothing is accidental.' },
  { word: 'Standards', meaning: 'Work delivered to a level most agencies won\'t attempt. No shortcuts, no compromises.' },
];

export default function VisionSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const lineWidth = useTransform(scrollYProgress, [0, 0.8], ['0%', '100%']);

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mb-12 md:mb-20"
        >
          <h2 className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>Approach</h2>
        </motion.div>

        {/* "See Four" conceptual intro */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-6 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="md:col-span-5"
          >
            <h3 className="text-[1.5rem] md:text-[1.85rem] font-semibold tracking-[-0.025em] leading-[1.15]" style={{ color: 'var(--c4-text)' }}>
              See four steps ahead.
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="md:col-span-5 md:col-start-7"
          >
            <p className="text-[14px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
              C4 is built on the idea that great digital work requires seeing further
              than what's in front of you — anticipating how design, technology, and
              business intersect to create something that lasts.
            </p>
          </motion.div>
        </div>

        {/* Animated divider */}
        <motion.div style={{ width: lineWidth, backgroundColor: 'var(--c4-border)' }} className="h-px mb-0" />

        {/* Four pillars */}
        <div className="grid md:grid-cols-4 gap-0">
          {pillars.map((p, i) => (
            <motion.div
              key={p.word}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className="py-8 md:py-10 md:pr-8 border-t md:border-t-0 md:border-l md:pl-6 first:border-l-0 first:pl-0 first:border-t-0"
              style={{ borderColor: 'var(--c4-border)' }}
            >
              <span className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: 'var(--c4-accent)' }}>
                0{i + 1}
              </span>
              <h4 className="mt-3 text-[1rem] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                {p.word}
              </h4>
              <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
                {p.meaning}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}