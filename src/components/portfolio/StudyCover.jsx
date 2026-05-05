import React from 'react';
import { motion } from 'framer-motion';
import PortfolioMedia from './PortfolioMedia';

const containSizes = {
  preview: 'max-h-[55%] max-w-[55%]',
  featured: 'max-h-[60%] max-w-[60%]',
  grid: 'max-h-[55%] max-w-[55%]',
  hero: 'max-h-[50%] max-w-[50%]',
};

function getImageClasses(study, variant) {
  const fitMode = study.coverMode || (study.backdropStyle ? 'contain' : 'cover');

  if (fitMode === 'cover') {
    return 'h-full w-full object-cover';
  }

  return `${study.coverSizes?.[variant] || containSizes[variant] || containSizes.grid} object-contain`;
}

export default function StudyCover({
  study,
  variant = 'grid',
  className = '',
  imageClassName = '',
  compact = false,
  children,
  ...props
}) {
  return (
    <motion.div
      className={`relative flex items-center justify-center overflow-hidden ${study.backdropClassName || ''} ${className}`.trim()}
      style={study.backdropStyle || { backgroundColor: study.brandColor || 'var(--c4-bg-alt)' }}
      {...props}
    >
      {study.cover ? (
        <img
          src={study.cover}
          alt={`${study.name} logo`}
          className={`${getImageClasses(study, variant)} ${imageClassName}`.trim()}
        />
      ) : (
        <PortfolioMedia
          src={study.thumbnail}
          alt={study.name}
          title={study.name}
          message="Visuals pending upload"
          meta={compact
            ? [...study.tags.slice(0, 1), ...(study.year ? [study.year] : [])]
            : [...study.tags.slice(0, 2), ...(study.year ? [study.year] : [])]}
          compact={compact}
          imageClassName={imageClassName}
        />
      )}

      {children}
    </motion.div>
  );
}