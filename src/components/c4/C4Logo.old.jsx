import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useTheme } from './ThemeContext';

/**
 * C4 Logo — uses the original PNG asset (/public/logo-mark.png) as the
 * source of truth.  Shape is NEVER redrawn.
 *
 * Hover: a diagonal mask-sweep "scribes" the mark into view (~1.6 s),
 *        then "Studios" is scribed in letter-by-letter (~0.4 s).
 *        If the cursor leaves early the animation reverses.
 *        If it completes, the logo stays revealed ("reward" state)
 *        until the cursor leaves, at which point it gracefully resets.
 *
 * Props:
 *  - size:      'small' | 'default' | 'large' | 'xl'
 *  - variant:   'mark' (C4 only) | 'full' (C4 + "Studios" scribe)
 *  - context:   'header' | 'footer'
 *  - className: extra CSS classes
 */

/* ── Size map (height in px) ───────────────────────── */
const SIZES = { small: 28, default: 36, large: 48, xl: 72 };

/* Original transparent PNG aspect ratio (400 × 273) */
const ASPECT = 400 / 273;

/* ── CSS filter presets per theme × context ────────── */
const FILTERS = {
  light: {
    header: 'brightness(0.60) contrast(1.15)',
    footer: 'brightness(2.2) contrast(0.85)',
  },
  dark: {
    header: 'brightness(1.85) contrast(0.9)',
    footer: 'brightness(2.0) contrast(0.85)',
  },
};

/* ── Timing ────────────────────────────────────────── */
const MARK_DURATION = 1.6;   // seconds — logo scribe
const TEXT_DURATION = 0.4;   // seconds — "Studios" scribe
const EASE = [0.25, 0.1, 0.25, 1]; // smooth cubic

/* Letters for the per-character scribe */
const STUDIO_LETTERS = 'Studios'.split('');

/* ── Mask-reveal helper ──────────────────────────────
 * Subscribes to a MotionValue (0–100) and imperatively
 * sets a diagonal CSS gradient mask on the img element.   */
function MaskRevealImg({ maskPct, filter, enhancedFilter }) {
  const imgRef = useRef(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const unsub = maskPct.on('change', (v) => {
      const grad = `linear-gradient(115deg, #000 0%, #000 ${v}%, transparent ${v + 8}%)`;
      el.style.maskImage = grad;
      el.style.webkitMaskImage = grad;
    });
    // Set initial
    const v = maskPct.get();
    const grad = `linear-gradient(115deg, #000 0%, #000 ${v}%, transparent ${v + 8}%)`;
    el.style.maskImage = grad;
    el.style.webkitMaskImage = grad;
    return unsub;
  }, [maskPct]);

  return (
    <img
      ref={imgRef}
      src="/logo-mark.png"
      alt=""
      draggable={false}
      className="absolute inset-0 w-full h-full object-contain"
      style={{ filter: enhancedFilter }}
    />
  );
}

export default function C4Logo({
  size = 'default',
  variant = 'mark',
  context = 'header',
  className = '',
}) {
  const { isDark } = useTheme();
  const h = SIZES[size] || SIZES.default;
  const w = Math.round(h * ASPECT);
  const filter = FILTERS[isDark ? 'dark' : 'light'][context];
  const showStudio = variant === 'full';

  /* Enhanced filter for the scribe overlay — slightly brighter/sharper */
  const enhancedFilter = context === 'footer'
    ? `${filter} brightness(1.25)`
    : `${filter} brightness(1.3) contrast(1.1)`;

  /*
   * progress: 0 → 1 drives the entire animation.
   *   0.00–0.80  = logo mark scribe (diagonal mask sweep)
   *   0.80–1.00  = "Studios" text scribe (letter-by-letter reveal)
   */
  const progress = useMotionValue(0);
  const animRef = useRef(null);
  const [completed, setCompleted] = useState(false);
  const hoveredRef = useRef(false);

  /* Derived: mask sweep % for the logo (maps 0–0.8 → 0%–100%) */
  const maskPct = useTransform(progress, [0, 0.8], [0, 100]);

  /* Derived: how many "Studios" letters are visible (maps 0.8–1.0 → 0–7) */
  const lettersVisible = useTransform(progress, [0.8, 1], [0, STUDIO_LETTERS.length]);

  /* Derived: container width for "Studios" text area */
  const studioWidth = useTransform(progress, [0.78, 1], [0, h * 1.7]);

  /* Subscribe to progress to detect completion */
  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      if (v >= 0.995 && hoveredRef.current) {
        setCompleted(true);
      }
    });
    return unsub;
  }, [progress]);

  const handleHoverStart = useCallback(() => {
    hoveredRef.current = true;
    if (animRef.current) animRef.current.stop();
    if (completed) return;

    animRef.current = animate(progress, 1, {
      duration: (1 - progress.get()) * (MARK_DURATION + TEXT_DURATION),
      ease: EASE,
    });
  }, [progress, completed]);

  const handleHoverEnd = useCallback(() => {
    hoveredRef.current = false;
    if (animRef.current) animRef.current.stop();

    const dur = completed
      ? 0.8
      : progress.get() * (MARK_DURATION + TEXT_DURATION);

    setCompleted(false);

    animRef.current = animate(progress, 0, {
      duration: Math.max(dur, 0.2),
      ease: EASE,
    });
  }, [progress, completed]);

  useEffect(() => {
    return () => { if (animRef.current) animRef.current.stop(); };
  }, []);

  const studioColor = context === 'footer'
    ? 'var(--c4-footer-text)'
    : 'var(--c4-text-subtle)';

  return (
    <motion.span
      className={`inline-flex items-center select-none ${className}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      style={{ height: h }}
      role="img"
      aria-label="C4 Studios"
    >
      {/* ── Logo mark (PNG with diagonal mask scribe) ── */}
      <span
        className="relative flex-shrink-0"
        style={{ width: w, height: h }}
      >
        {/* Resting state — always visible */}
        <img
          src="/logo-mark.png"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain"
          style={{ filter }}
        />

        {/* Scribe overlay — diagonal gradient mask driven by progress.
            A brighter copy is revealed via a 115° gradient sweep,
            simulating the mark being drawn/scribed left-to-right. */}
        <MaskRevealImg
          maskPct={maskPct}
          filter={filter}
          enhancedFilter={enhancedFilter}
        />
      </span>

      {/* ── "Studios" scribe (letter-by-letter reveal) ── */}
      {showStudio && (
        <motion.span
          className="overflow-hidden whitespace-nowrap flex items-center"
          style={{ height: h, width: studioWidth }}
        >
          <span
            className="font-medium tracking-[0.18em] uppercase flex"
            style={{
              fontSize: h * 0.27,
              paddingLeft: h * 0.18,
            }}
          >
            {STUDIO_LETTERS.map((letter, i) => (
              <StudioLetter
                key={i}
                letter={letter}
                index={i}
                lettersVisible={lettersVisible}
                color={studioColor}
              />
            ))}
          </span>
        </motion.span>
      )}
    </motion.span>
  );
}

/* ── Individual letter with scribe-in opacity + lift ── */
function StudioLetter({ letter, index, lettersVisible, color }) {
  const opacity = useTransform(
    lettersVisible,
    [index, index + 0.6],
    [0, 1],
  );

  const y = useTransform(
    lettersVisible,
    [index, index + 0.6],
    [3, 0],
  );

  return (
    <motion.span style={{ opacity, y, color, display: 'inline-block' }}>
      {letter}
    </motion.span>
  );
}
