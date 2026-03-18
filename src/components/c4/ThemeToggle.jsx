import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

const focusRingStyle = /** @type {import('react').CSSProperties} */ ({
  '--tw-ring-color': 'var(--c4-ring)',
});

export default function ThemeToggle({ compact = false }) {
  const { isDark, toggle } = useTheme();

  if (compact) {
    return (
      <button
        onClick={toggle}
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="relative flex items-center rounded-full transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{
          ...focusRingStyle,
          width: 44,
          height: 24,
          backgroundColor: isDark ? 'rgba(236,231,222,0.14)' : 'rgba(26,26,26,0.08)',
        }}
      >
        <motion.div
          className="absolute rounded-full flex items-center justify-center"
          initial={false}
          animate={{ left: isDark ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            width: 20,
            height: 20,
            backgroundColor: 'var(--c4-text)',
          }}
        >
          <motion.span
            initial={false}
            animate={{ rotate: isDark ? 0 : 180 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-[9px] font-bold leading-none select-none"
            style={{ color: 'var(--c4-bg)' }}
          >
            {isDark ? 'D' : 'L'}
          </motion.span>
        </motion.div>
      </button>
    );
  }

  // Full labeled toggle
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="text-[10px] uppercase tracking-[0.12em] select-none transition-all duration-300"
        style={{
          color: !isDark ? 'var(--c4-text)' : 'var(--c4-text-faint)',
          fontWeight: !isDark ? 600 : 400,
        }}
      >
        Light
      </span>
      <button
        onClick={toggle}
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
        className="relative flex items-center rounded-full transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2"
        style={{
          ...focusRingStyle,
          width: 44,
          height: 24,
          backgroundColor: isDark ? 'rgba(236,231,222,0.14)' : 'rgba(26,26,26,0.08)',
        }}
      >
        <motion.div
          className="absolute rounded-full"
          initial={false}
          animate={{ left: isDark ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            width: 20,
            height: 20,
            backgroundColor: 'var(--c4-text)',
          }}
        />
      </button>
      <span
        className="text-[10px] uppercase tracking-[0.12em] select-none transition-all duration-300"
        style={{
          color: isDark ? 'var(--c4-text)' : 'var(--c4-text-faint)',
          fontWeight: isDark ? 600 : 400,
        }}
      >
        Dark
      </span>
    </div>
  );
}