import React from 'react';
import { motion } from 'framer-motion';

const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 1.8,
    repeat: Infinity,
    ease: 'linear',
  },
};

function Bone({ className }) {
  return (
    <motion.div
      className={`rounded-[3px] ${className}`}
      style={{
        backgroundColor: 'var(--c4-bg-alt)',
        backgroundImage: 'linear-gradient(90deg, transparent 0%, var(--c4-border-light) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
      }}
      animate={shimmer.animate}
      transition={shimmer.transition}
    />
  );
}

export default function GallerySkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <Bone key={i} className="aspect-[16/10]" />
      ))}
    </div>
  );
}