import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

const focusRingStyle = /** @type {import('react').CSSProperties} */ ({
  '--tw-ring-color': 'var(--c4-ring)',
});

/* Arm pages that pin their own chrome add one of these markers to <html>
   and force the theme class regardless of the visitor's setting. Until
   9 September 2026 the switch kept reporting the stored preference on
   those pages, so a dark-preference visitor on /ServiceWeb saw a white page
   and a switch claiming dark. The switch now reads the real state of <html>
   and disables itself where the page owns the light. */
const FORCED_MARKERS = ['cw-on-board', 'sg-on-board', 'lv-on-stage', 'wa-on-sheet'];

function readChrome() {
  if (typeof document === 'undefined') return { forced: false, dark: false };
  const cl = document.documentElement.classList;
  return { forced: FORCED_MARKERS.some((c) => cl.contains(c)), dark: cl.contains('dark-mode') };
}

function useChromeState() {
  const [state, setState] = useState(readChrome);
  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return undefined;
    const observer = new MutationObserver(() => setState(readChrome()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setState(readChrome());
    return () => observer.disconnect();
  }, []);
  return state;
}

export default function ThemeToggle({ compact = false }) {
  const { isDark, toggle } = useTheme();
  const chrome = useChromeState();
  const shownDark = chrome.forced ? chrome.dark : isDark;
  const label = chrome.forced
    ? 'This page sets its own light. The theme switch is unavailable here.'
    : (shownDark ? 'Switch to light mode' : 'Switch to dark mode');
  const disabledStyle = chrome.forced ? { opacity: 0.5, cursor: 'not-allowed' } : null;

  if (compact) {
    return (
      <button
        onClick={chrome.forced ? undefined : toggle}
        role="switch"
        aria-checked={shownDark}
        aria-label={label}
        aria-disabled={chrome.forced || undefined}
        title={chrome.forced ? label : undefined}
        className="relative flex items-center rounded-full transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{
          ...focusRingStyle,
          ...disabledStyle,
          width: 44,
          height: 24,
          backgroundColor: shownDark ? 'rgba(236,231,222,0.14)' : 'rgba(26,26,26,0.08)',
        }}
      >
        <motion.div
          className="absolute rounded-full flex items-center justify-center"
          initial={false}
          animate={{ left: shownDark ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            width: 20,
            height: 20,
            backgroundColor: 'var(--c4-text)',
          }}
        >
          <motion.span
            initial={false}
            animate={{ rotate: shownDark ? 0 : 180 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-[9px] font-bold leading-none select-none"
            style={{ color: 'var(--c4-bg)' }}
          >
            {shownDark ? 'D' : 'L'}
          </motion.span>
        </motion.div>
      </button>
    );
  }

  // Full labeled toggle
  return (
    <div className="flex items-center gap-2.5" style={disabledStyle || undefined}>
      <span
        className="text-[10px] uppercase tracking-[0.12em] select-none transition-all duration-300"
        style={{
          color: !shownDark ? 'var(--c4-text)' : 'var(--c4-text-subtle)',
          fontWeight: !shownDark ? 600 : 400,
        }}
      >
        Light
      </span>
      <button
        onClick={chrome.forced ? undefined : toggle}
        role="switch"
        aria-checked={shownDark}
        aria-label={label}
        aria-disabled={chrome.forced || undefined}
        title={chrome.forced ? label : undefined}
        tabIndex={0}
        onKeyDown={(e) => {
          if (chrome.forced) return;
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        }}
        className="relative flex items-center rounded-full transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2"
        style={{
          ...focusRingStyle,
          width: 44,
          height: 24,
          backgroundColor: shownDark ? 'rgba(236,231,222,0.14)' : 'rgba(26,26,26,0.08)',
        }}
      >
        <motion.div
          className="absolute rounded-full"
          initial={false}
          animate={{ left: shownDark ? 22 : 2 }}
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
          color: shownDark ? 'var(--c4-text)' : 'var(--c4-text-subtle)',
          fontWeight: shownDark ? 600 : 400,
        }}
      >
        Dark
      </span>
    </div>
  );
}
