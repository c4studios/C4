import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedHeading({ children, className = "", delay = 0, as = "h2" }) {
  const Tag = motion[as] || motion.h2;
  return (
    <Tag
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{ color: 'var(--c4-text)' }}
    >
      {children}
    </Tag>
  );
}