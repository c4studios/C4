/* Shared motion kit for the Home surface (and only Home).
   GSAP is the house engine; every trigger is wrapped in
   gsap.matchMedia() with a reduced-motion guard, and nothing here
   runs at all under staticMode (Prerender UA / reduced motion) —
   the DOM default is always the finished end-state. */
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

/* staticMode: the Prerender UA, an OS reduced-motion preference, or a
   prerendered page while it hydrates. The site's one hook since hydration
   (15 Oct 2026); this copy computed it on its own and would have armed the
   home page's motion during the hydration render. */
export { default as useStaticMode } from '@/hooks/useStaticMode';
export { useWasPrerendered } from '@/lib/hydration';

/* Whether any of an element is on screen (or already scrolled past). A
   prerendered page arms its reveals once it has hydrated, by which time the
   visitor may be looking at what a reveal would hide first; those skip
   their entrance. Below the fold they play as they always did. */
export function onScreen(el) {
  return Boolean(el) && el.getBoundingClientRect().top < window.innerHeight;
}

/* Masked line reveal for a heading — enhancement only; the text is
   fully visible by default and SplitText reverts after play. `prerendered`
   (useWasPrerendered) leaves a heading that is already on screen alone. */
export function revealHeading(el, scrollerOpts = {}, { prerendered = false } = {}) {
  if (!el) return null;
  if (prerendered && onScreen(el)) return null;
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
