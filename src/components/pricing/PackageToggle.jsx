import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function PackageToggle({ activeTrack, onToggle }) {
  const options = [
    { key: 'outright', label: 'Outright Purchase' },
    { key: 'subscription', label: 'Monthly Subscription' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      className="inline-flex items-center rounded-sm border p-1"
      style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}
    >
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onToggle(opt.key)}
          className="relative px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium rounded-sm transition-colors duration-200"
          style={{
            color: activeTrack === opt.key ? 'var(--c4-bg)' : 'var(--c4-text-muted)',
          }}
        >
          {activeTrack === opt.key && (
            <motion.div
              layoutId="toggle-bg"
              className="absolute inset-0 rounded-sm"
              style={{ backgroundColor: 'var(--c4-text)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </motion.div>
  );
}
