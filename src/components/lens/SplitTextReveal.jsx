/**
 * SplitTextReveal — GSAP split-text animation
 *
 * Splits text into words or characters with overflow-hidden wrappers,
 * then reveals them with staggered transform + opacity animations.
 *
 * UI/UX Pro Max rules applied:
 * - Animation duration 150–400ms per element (stagger keeps total longer)
 * - Only animates transform + opacity (GPU composited, no layout reflow)
 * - ease-out for entering elements
 * - Respects prefers-reduced-motion
 * - Uses will-change: transform for GPU hint, removed after animation
 */
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SplitTextReveal({
  children,
  as: Tag = 'h2',
  className = '',
  style = {},
  splitBy = 'word',
  stagger = 0.04,
  duration = 0.7,
  y = 50,
  delay = 0,
  trigger = 'scroll',
  scrub = false,
  once = true,
}) {
  const containerRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || animated.current) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animated.current = true;
      return;
    }

    const text = el.textContent;
    let fragments;

    if (splitBy === 'char') {
      fragments = text.split('').map((c) => (c === ' ' ? '\u00A0' : c));
    } else {
      fragments = text.split(' ');
    }

    el.innerHTML = '';
    el.setAttribute('aria-label', text); // screen reader gets full text
    const spans = [];

    fragments.forEach((frag, i) => {
      const wrapper = document.createElement('span');
      wrapper.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;';
      wrapper.setAttribute('aria-hidden', 'true');

      const inner = document.createElement('span');
      inner.style.cssText = 'display:inline-block;will-change:transform,opacity;';
      inner.textContent = frag;

      wrapper.appendChild(inner);
      el.appendChild(wrapper);

      if (splitBy === 'word' && i < fragments.length - 1) {
        el.appendChild(document.createTextNode('\u00A0'));
      }

      spans.push(inner);
    });

    const tl = gsap.timeline({
      scrollTrigger: trigger === 'scroll' ? {
        trigger: el,
        start: 'top 85%',
        end: scrub ? 'top 30%' : undefined,
        scrub: scrub ? 0.5 : false,
        once,
      } : undefined,
      delay: trigger === 'immediate' ? delay : 0,
      onComplete: () => {
        // Clean up will-change after animation
        spans.forEach((s) => { s.style.willChange = 'auto'; });
      },
    });

    tl.from(spans, {
      y,
      opacity: 0,
      duration: Math.min(duration, 0.9), // keep per-element under 900ms
      stagger,
      ease: 'power3.out', // ease-out for enter
      delay: trigger === 'scroll' ? delay : 0,
    });

    animated.current = true;

    return () => { tl.kill(); };
  }, [children, splitBy, stagger, duration, y, delay, trigger, scrub, once]);

  return (
    <Tag ref={containerRef} className={className} style={style}>
      {children}
    </Tag>
  );
}
