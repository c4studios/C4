/**
 * CountUpStat — animates a numeric stat up from zero when it scrolls into
 * view, reusing the IntersectionObserver + rAF easing pattern from
 * Welcome.jsx (~lines 169-189).
 *
 * Progressive enhancement only:
 * - The final text is rendered on the server / first paint, so the stat is
 *   fully readable with JS or motion off (important for SSG prerender).
 * - Only stats that are a pure number (optionally with a leading/trailing
 *   symbol like "$", "%", "+") count up; anything else (e.g. "< 5 min",
 *   "★★★★★", "Day 1") is shown verbatim with no animation.
 * - Respects prefers-reduced-motion.
 */
import React, { useEffect, useRef, useState } from 'react';

// Parse a stat string like "100%", "$690", "30" into { prefix, value, suffix }.
// Returns null when there is no single clean integer to animate.
function parseStat(raw) {
  if (typeof raw !== 'string') return null;
  const m = raw.match(/^(\D*?)(\d+)(\D*)$/);
  if (!m) return null;
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return null;
  return { prefix: m[1] || '', value, suffix: m[3] || '' };
}

export default function CountUpStat({ children, className, style, duration = 1400 }) {
  const raw = typeof children === 'string' ? children : String(children ?? '');
  const parsed = parseStat(raw);
  const ref = useRef(null);
  const [display, setDisplay] = useState(raw);

  useEffect(() => {
    // Nothing to animate, or environment can't support it → leave final text.
    if (!parsed) return undefined;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    const { prefix, value, suffix } = parsed;
    let done = false;
    setDisplay(`${prefix}0${suffix}`);

    const io = new IntersectionObserver((entries) => {
      if (done || !entries.some((e) => e.isIntersecting)) return;
      done = true;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(`${prefix}${Math.round(value * eased)}${suffix}`);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });

    io.observe(el);
    return () => io.disconnect();
  }, [parsed, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
