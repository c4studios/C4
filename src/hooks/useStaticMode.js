import { PRERENDER, prefersReducedMotion, useHydrated } from '@/lib/hydration';

/**
 * useStaticMode — true when motion must not run: the Playwright prerenderer, an
 * OS reduced-motion preference, or the moment the browser hydrates a
 * prerendered page.
 *
 * Resolved SYNCHRONOUSLY so it is correct on the very first render. This is
 * deliberate and must not be "simplified" into an effect or into
 * framer-motion's useReducedMotion(): both report false on the first render, so
 * a reveal that hides its content in `initial` gets captured by the prerenderer
 * in its hidden state and ships as `style="opacity: 0"` in the static HTML.
 *
 * Hydration (15 Oct 2026, src/lib/hydration.js): the browser now keeps the
 * prerendered page instead of drawing it again, so its first render has to be
 * the prerenderer's, and the prerenderer always ran static. While React
 * hydrates, this is true for everyone; once hydration commits it re-renders
 * with the visitor's own answer. framer-motion only reads `initial` when a
 * component mounts, so a reveal that arrives with the prerendered page stays
 * visible and simply doesn't replay. Effects keyed on staticMode arm a moment
 * later than they used to, on content already on screen: guard anything that
 * would hide it first (see useWasPrerendered).
 *
 * Use it to drop the hidden initial state entirely rather than to swap the
 * animation. A reveal should enhance content that is already visible, never
 * gate it, because transitions and IntersectionObservers do not run in headless
 * renderers or for crawlers that skip JavaScript.
 *
 *   const staticMode = useStaticMode();
 *   <motion.div {...(staticMode ? {} : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 } })}>
 */
export default function useStaticMode() {
  const hydrated = useHydrated();
  return !hydrated || PRERENDER || prefersReducedMotion();
}
