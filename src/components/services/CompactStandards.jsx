import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const standards = [
  {
    title: 'Bespoke',
    brief: 'No templates. No themes.',
    detail: 'Every project starts from zero. No reskins, no shortcuts. The result is unmistakably yours.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="3" width="14" height="14" rx="1" />
        <path d="M7 10h6M10 7v6" />
      </svg>
    ),
  },
  {
    title: 'Craft',
    brief: 'Premium design judgment.',
    detail: 'Typography, spacing, colour and motion are engineering decisions. Every pixel is deliberate.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="10" cy="10" r="7" />
        <circle cx="10" cy="10" r="3" />
        <circle cx="10" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Performance',
    brief: 'Speed as a feature.',
    detail: 'Lean code, optimised assets, perfect Core Web Vitals. Fast is the baseline, not a bonus.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
        <polyline points="3,14 7,8 11,11 17,4" />
        <polyline points="14,4 17,4 17,7" />
      </svg>
    ),
  },
  {
    title: 'Intentional',
    brief: 'Purposeful, never decorative.',
    detail: 'Every interaction guides attention and serves the brand. Nothing exists without a reason.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M10 3v14M3 10h14" />
        <path d="M6 6l8 8M14 6l-8 8" opacity="0.3" />
      </svg>
    ),
  },
];

function StandardCard({ standard, index, isActive, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      onClick={onToggle}
      className="group relative cursor-pointer select-none"
    >
      <motion.div
        className="relative p-5 md:p-6 border rounded-sm overflow-hidden h-full"
        animate={{
          borderColor: isActive ? 'var(--c4-border)' : 'var(--c4-border-light)',
          backgroundColor: isActive ? 'var(--c4-card-bg)' : 'var(--c4-bg)',
          boxShadow: 'none',
        }}
        transition={{ duration: 0.35, ease }}
      >
        {/* Icon + Number row */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            animate={{ color: isActive ? 'var(--c4-text)' : 'var(--c4-text-faint)' }}
            transition={{ duration: 0.3 }}
          >
            {standard.icon}
          </motion.div>
          <span className="text-[10px] tabular-nums font-medium tracking-[0.15em] transition-colors duration-300"
            style={{ color: isActive ? 'var(--c4-accent)' : 'var(--c4-border)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-[15px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
          {standard.title}
        </h4>

        {/* Brief */}
        <p className="mt-1.5 text-[13px] leading-[1.5]" style={{ color: 'var(--c4-text-muted)' }}>
          {standard.brief}
        </p>

        {/* Expanded detail */}
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ height: { duration: 0.35, ease }, opacity: { duration: 0.25, delay: 0.05 } }}
              className="overflow-hidden"
            >
              <p className="pt-3 text-[12.5px] leading-[1.6] border-t mt-3" style={{ color: 'var(--c4-text-muted)', borderColor: 'var(--c4-border-light)' }}>
                {standard.detail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute top-0 right-0 w-full h-px" style={{ backgroundColor: 'var(--c4-accent)' }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundColor: 'var(--c4-accent)' }} />
        </motion.div>

        {/* Expand indicator */}
        <motion.div
          className="absolute bottom-3 right-4 pointer-events-none"
          animate={{ rotate: isActive ? 45 : 0, opacity: isActive ? 0.5 : 0.2 }}
          transition={{ duration: 0.3, ease }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: 'var(--c4-text-faint)' }}>
            <line x1="5" y1="1" x2="5" y2="9" />
            <line x1="1" y1="5" x2="9" y2="5" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function CompactStandards() {
  const [expanded, setExpanded] = useState(new Set());

  const allExpanded = expanded.size === standards.length;

  const toggleCard = useCallback((index) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (allExpanded) {
      setExpanded(new Set());
    } else {
      setExpanded(new Set(standards.map((_, i) => i)));
    }
  }, [allExpanded]);

  return (
    <section className="py-14 md:py-20 border-t" style={{ borderColor: 'var(--c4-border)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10 md:mb-14"
        >
          <div>
            <h3 className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>Standards</h3>
            <p className="mt-2 text-[14px] leading-[1.6] max-w-[400px]" style={{ color: 'var(--c4-text-muted)' }}>
              Four principles applied to every project. Non-negotiable.
            </p>
          </div>
          <button
            onClick={toggleAll}
            className="hidden md:block text-[10px] uppercase tracking-[0.18em] font-medium transition-colors duration-300 pb-0.5"
            style={{ color: 'var(--c4-text-faint)' }}
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {standards.map((s, i) => (
            <StandardCard
              key={s.title}
              standard={s}
              index={i}
              isActive={expanded.has(i)}
              onToggle={() => toggleCard(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}