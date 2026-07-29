import { useMemo } from 'react';

/**
 * useStaticMode — true when motion must not run: the Playwright prerenderer, or
 * an OS reduced-motion preference.
 *
 * Resolved SYNCHRONOUSLY in a useMemo so it is correct on the very first render.
 * This is deliberate and must not be "simplified" into an effect or into
 * framer-motion's useReducedMotion(): both report false on the first render, so
 * a reveal that hides its content in `initial` gets captured by the prerenderer
 * in its hidden state and ships as `style="opacity: 0"` in the static HTML.
 *
 * Use it to drop the hidden initial state entirely rather than to swap the
 * animation. A reveal should enhance content that is already visible, never
 * gate it, because transitions and IntersectionObservers do not run in headless
 * renderers or for crawlers that skip JavaScript.
 *
 *   const staticMode = useStaticMode();
 *   <motion.div {...(staticMode ? {} : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 } })}>
 *
 * Mirrors the inline pattern already used in homeMotion.js, ServiceWeb.jsx,
 * ServiceAI.jsx and Foresight.jsx.
 */
export default function useStaticMode() {
  return useMemo(() => {
    if (typeof window === 'undefined') return true;
    const prerender =
      typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent);
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prerender || reduced;
  }, []);
}
