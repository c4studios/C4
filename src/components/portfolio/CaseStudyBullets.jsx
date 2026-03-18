import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function CaseStudyBullets({ items, columns = 2 }) {
  return (
    <ul className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2 gap-x-12' : ''} gap-y-3`}>
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -4 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.025, ease }}
          className="flex items-start gap-3"
        >
          <span className="w-[5px] h-[5px] rounded-full mt-[8px] shrink-0" style={{ backgroundColor: 'var(--c4-accent)' }} />
          <span className="text-[13.5px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}