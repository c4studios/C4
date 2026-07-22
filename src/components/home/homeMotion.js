/* Shared motion kit for the Home surface (and only Home).
   GSAP is the house engine; every trigger is wrapped in
   gsap.matchMedia() with a reduced-motion guard, and nothing here
   runs at all under staticMode (Prerender UA / reduced motion) —
   the DOM default is always the finished end-state. */
import { useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase);

/* One bespoke ease for the whole page — the craft floor. */
if (!gsap.parseEase('c4home')) {
  CustomEase.create('c4home', 'M0,0 C0.19,0 0.09,1 1,1');
}

/* DEV-only verification handle: the review harness executes JS
   without a paint pipeline (no rAF), so probes drive the ticker
   manually via window.__hmGsap.ticker.tick(). Stripped from builds. */
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__hmGsap = gsap;
  window.__hmScrollTrigger = ScrollTrigger;
}

export const EASE = 'c4home';

/* staticMode: the Prerender UA or an OS reduced-motion preference.
   Computed once, synchronously, before any animation wiring. */
export function useStaticMode() {
  return useMemo(() => {
    if (typeof window === 'undefined') return true;
    const prerender =
      typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent);
    const reduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prerender || reduced;
  }, []);
}

/* Masked line reveal for a heading — enhancement only; the text is
   fully visible by default and SplitText reverts after play. */
export function revealHeading(el, scrollerOpts = {}) {
  if (!el) return null;
  const split = SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true });
  const tween = gsap.from(split.lines, {
    yPercent: 110,
    duration: 0.9,
    stagger: 0.08,
    ease: EASE,
    scrollTrigger: {
      trigger: el,
      start: 'top 86%',
      once: true,
      ...scrollerOpts,
    },
    onComplete: () => split.revert(),
  });
  return { split, tween };
}

export { gsap, ScrollTrigger, SplitText };
