/**
 * useRegisterMotion — the "armed" one-shot reveal controller for the C4 Works
 * Register surfaces (Software list, product datasheet, home register).
 *
 * House motion grammar: content ships in its finished, visible state. Only
 * when motion is permitted AND the renderer is a real interactive browser do
 * we add `.sw-armed` to the surface root, which hides `[data-reveal]` elements
 * until an IntersectionObserver reveals them, arms the ink-bleed status stamps,
 * collapses the register drawers (opening on hover / focus / toggle), and fires
 * the single barcode scanline (`.sw-scan`).
 *
 * Reveals ENHANCE, never gate:
 * - Prerender UA (/Prerender/i) → never armed → everything visible, every
 *   drawer OPEN, stamps at rest. The crawler sees the end state.
 * - prefers-reduced-motion → never armed (+ a CSS safety net) → same end state.
 * - No IntersectionObserver → never armed → same end state.
 *
 * Returns a ref to attach to the `.sw-root` element. Pass a `key` that changes
 * when the observed content changes (e.g. the product slug) so the observer is
 * rebuilt for the new elements.
 */
import { useEffect, useLayoutEffect, useRef } from 'react';

// Arm before the browser paints so the register never flashes open drawers /
// visible-then-hidden reveals on load. Falls back to useEffect on the server
// (prerender) where layout effects don't run — there the surface is armless and
// ships its finished, fully-visible end state anyway.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function useRegisterMotion(key) {
  const rootRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === 'undefined') return undefined;

    const isPrerender =
      typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent || '');
    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Not a real interactive render, or motion is unwanted, or the API is
    // missing → leave the finished end state untouched.
    if (isPrerender || prefersReduced || !('IntersectionObserver' in window)) {
      return undefined;
    }

    root.classList.add('sw-armed');

    const targets = Array.from(root.querySelectorAll('[data-reveal], .sw-scan'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sw-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    targets.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      root.classList.remove('sw-armed');
      targets.forEach((el) => el.classList.remove('sw-in'));
    };
  }, [key]);

  return rootRef;
}
