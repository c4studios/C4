/**
 * ScrollReveal — GSAP scroll-triggered reveal
 *
 * UI/UX Pro Max rules:
 * - Only animates transform + opacity (composited, no CLS)
 * - Duration 150–400ms range
 * - ease-out for entering
 * - Respects prefers-reduced-motion
 * - Cleans up will-change after animation
 */
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  className = '',
  style = {},
  y = 30,
  opacity = 0,
  duration = 0.7,
  delay = 0,
  ease = 'power3.out',
  once = true,
  as: Tag = 'div',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.style.willChange = 'transform, opacity';

    const anim = gsap.from(el, {
      y,
      opacity,
      duration: Math.min(duration, 0.9),
      delay,
      ease,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once,
      },
      onComplete: () => { el.style.willChange = 'auto'; },
    });

    return () => anim.kill();
  }, [y, opacity, duration, delay, ease, once]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
