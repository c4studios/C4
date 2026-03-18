import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

function AnimatedLetters({ text = '', baseDelay = 0 }) {
  return (
    <span className="inline-block whitespace-pre-wrap">
      {[...text].map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          initial={{ y: '6%', opacity: 0, filter: 'blur(1.5px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.44, delay: baseDelay + index * 0.013, ease: [0.22, 0.9, 0.22, 0.98] }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

function RevealLine({ children, delay = 0, className = '' }) {
  const isString = typeof children === 'string';

  return (
    <span className={`block overflow-visible pb-[0.08em] ${className}`}>
      {isString ? (
        <AnimatedLetters text={children} baseDelay={delay} />
      ) : (
        <motion.span
          className="block"
          initial={{ y: '10%', opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.66, delay, ease: [0.26, 0.9, 0.2, 0.98] }}
        >
          {children}
        </motion.span>
      )}
    </span>
  );
}

export default function PageHero({ pretitle, label, titleLines = [], description, children }) {
  return (
    <section className="pt-28 md:pt-36 pb-12 md:pb-16" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {pretitle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            className="mb-5 md:mb-6"
          >
            {pretitle}
          </motion.div>
        )}

        {/* Overline with accent line */}
        {label && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 mb-8 md:mb-10"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="w-8 h-px origin-left" style={{ backgroundColor: 'var(--c4-accent)' }}
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-[10px] uppercase tracking-[0.25em] font-medium"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              {label}
            </motion.span>
          </motion.div>
        )}

        {/* Title — cinematic line-by-line reveal */}
        <h1 className="text-[clamp(2rem,5.5vw,3.8rem)] font-semibold tracking-[-0.035em] leading-[1.08] max-w-[800px]" style={{ color: 'var(--c4-text)' }}>
          {titleLines.map((line, i) => (
            <RevealLine key={i} delay={0.25 + i * 0.12}>
              {typeof line === 'string' ? line : line}
            </RevealLine>
          ))}
        </h1>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 + titleLines.length * 0.12 + 0.2, ease }}
            className="mt-6 text-[14px] md:text-[15px] leading-[1.7] max-w-[520px]"
            style={{ color: 'var(--c4-text-muted)' }}
          >
            {description}
          </motion.p>
        )}

        {/* Optional extra content (CTAs etc.) */}
        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 + titleLines.length * 0.12 + 0.5 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
