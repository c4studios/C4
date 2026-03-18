import React from 'react';
import { motion } from 'framer-motion';

export default function SectionLabel({ text, color = "neutral" }) {
  const colorMap = {
    neutral: 'var(--c4-text-subtle)',
    red: 'var(--c4-accent)',
    green: 'var(--c4-brand-success)',
  };

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="inline-block text-[11px] uppercase tracking-[0.2em] font-medium"
      style={{ color: colorMap[color] || colorMap.neutral }}
    >
      {text}
    </motion.span>
  );
}