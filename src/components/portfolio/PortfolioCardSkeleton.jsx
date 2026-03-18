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
      className={`rounded-[2px] ${className}`}
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

export function FeaturedCardSkeleton() {
  return (
    <div className="space-y-5">
      <Bone className="w-full aspect-[16/9]" />
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
        <div className="space-y-2.5">
          <Bone className="h-5 w-48" />
          <Bone className="h-3.5 w-72" />
        </div>
        <div className="flex gap-2.5">
          <Bone className="h-3 w-14" />
          <Bone className="h-3 w-14" />
          <Bone className="h-3 w-10" />
        </div>
      </div>
      <Bone className="h-3 w-24" />
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="space-y-4">
      <Bone className="w-full aspect-[16/10]" />
      <div className="space-y-2">
        <div className="flex gap-2">
          <Bone className="h-2.5 w-12" />
          <Bone className="h-2.5 w-12" />
        </div>
        <Bone className="h-4 w-40" />
        <Bone className="h-3 w-64" />
      </div>
    </div>
  );
}