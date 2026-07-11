import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function CaseStudySection({ id, title, number, children, className = '' }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease }}
      // scroll-mt clears the fixed header when the TOC anchors to a section.
      className={`py-14 md:py-20 scroll-mt-28 ${className}`}
    >
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="flex items-baseline gap-3 mb-6 md:mb-8">
          {number && (
            <span className="text-[10px] tabular-nums tracking-[0.1em] font-semibold" style={{ color: 'var(--c4-accent)' }}>
              {number}
            </span>
          )}
          <h2 className="text-[11.5px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </motion.section>
  );
}