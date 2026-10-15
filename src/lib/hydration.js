/*
 * Hydration (15 Oct 2026).
 *
 * Every page is prerendered: scripts/prerender.mjs runs the app in a headless
 * browser and writes the finished page into dist/. Since 15 Oct 2026 the
 * browser hydrates that HTML in place (src/main.jsx) instead of throwing it
 * away and drawing the page again behind the boot overlay, so a visitor sees
 * the page at first paint.
 *
 * Hydration only works when the app's first render in the visitor's browser
 * produces exactly the markup the prerenderer wrote: the same elements, the
 * same text, the same attributes. Anything that would render differently in
 * a visitor's browser (their screen size, their theme, the clock, the user
 * agent) has to render the prerenderer's answer first and change once
 * hydration is done. The tools for that live here:
 *
 *   useHydrated()             false while React hydrates the prerendered
 *                             page, true afterwards (and from the start on a
 *                             page React draws itself)
 *   useWasPrerendered()       true for a component whose content was in the
 *                             prerendered HTML, so it was already on screen:
 *                             it must not hide that content to play an
 *                             entrance over it
 *   useMediaQuery(query)      a media query, answered with what the
 *                             prerenderer's own window said while hydrating
 *   usePrerendered(key, v)    the same for any other value the page shows
 *                             (the year, a switch's state)
 *   prerenderValue(key, fn)   the same, for a useState initialiser
 *
 * The prerenderer records every answer it gives in window.__c4Prerender, and
 * prerender.mjs writes them into the page as <script id="c4-prerender">,
 * together with the route the page was rendered for. main.jsx hydrates only
 * when that route is the one being opened.
 */
import { useCallback, useState, useSyncExternalStore } from 'react';

export const PRERENDER = typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent);

/* What the prerenderer saw. Recorded while prerendering, read back while hydrating. */
const recorded = { media: {}, values: {} };
if (PRERENDER && typeof window !== 'undefined') window.__c4Prerender = recorded;

let state;
/** The prerender record embedded in this page, or null on a page the prerenderer didn't write. */
export function prerenderState() {
  if (state !== undefined) return state;
  state = null;
  try {
    const el = typeof document !== 'undefined' && document.getElementById('c4-prerender');
    if (el) state = JSON.parse(el.textContent);
  } catch {
    state = null;
  }
  return state;
}

/** A path as the router sees it: no trailing slash, '/' for the root. */
export function routeKey(pathname) {
  return (pathname || '/').replace(/\/+$/, '') || '/';
}

/**
 * Whether the HTML in #root was prerendered for the page being opened. It
 * isn't on a 404 (404.html serves any unknown path), on /welcome (_redirects
 * serves the home page there) or in the dev server (no prerendered HTML).
 */
export function canHydrate(root, pathname) {
  const pre = prerenderState();
  return Boolean(root && root.firstElementChild && pre && pre.route && routeKey(pre.route) === routeKey(pathname));
}

let hydrating = false;
export function beginHydration() { hydrating = true; }
export function endHydration() { hydrating = false; }
/** True only while React renders the prerendered page for the first time. */
export function isHydrating() { return hydrating; }

const never = () => () => {};
const yes = () => true;
const no = () => false;

/**
 * False during the hydration render, true from the next render on. React
 * re-renders every component that reads it as soon as hydration commits.
 */
export function useHydrated() {
  return useSyncExternalStore(never, yes, no);
}

/**
 * True for the lifetime of a component whose first render hydrated the
 * prerendered HTML: its content was already painted when the app started.
 * Read once, at mount.
 */
export function useWasPrerendered() {
  const [was] = useState(isHydrating);
  return was;
}

const canMatch = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function';

function matchNow(query) {
  const on = canMatch() ? window.matchMedia(query).matches : false;
  if (PRERENDER) recorded.media[query] = on;
  return on;
}

/**
 * window.matchMedia(query).matches for code outside a hook (a useState
 * initialiser): the prerenderer's answer while hydrating, otherwise the
 * window's own (recorded under the prerenderer). Pair it with an effect that
 * reads the visitor's own answer once mounted.
 */
export function mediaMatches(query) {
  return hydrating ? prerenderMedia(query, matchNow(query)) : matchNow(query);
}

/** What the prerenderer's window answered for a media query. */
export function prerenderMedia(query, fallback = false) {
  const media = prerenderState()?.media;
  if (media && Object.prototype.hasOwnProperty.call(media, query)) return media[query];
  if (import.meta.env.DEV && prerenderState()) console.warn(`[hydration] no prerender answer for ${query}`);
  return fallback;
}

/**
 * A media query as state. While hydrating it answers with the prerenderer's
 * window (1280×800, light, a mouse, no motion preference) so the first
 * render matches the HTML, then with the visitor's, and it follows changes.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback((onChange) => {
    if (!canMatch()) return () => {};
    const mq = window.matchMedia(query);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [query]);
  return useSyncExternalStore(subscribe, () => matchNow(query), () => prerenderMedia(query, matchNow(query)));
}

const recordedValue = (key) => {
  const values = prerenderState()?.values;
  return values && Object.prototype.hasOwnProperty.call(values, key) ? { value: values[key] } : null;
};

/**
 * Any other value the first render shows (JSON: the year, a switch's state).
 * The prerenderer records it on every render, so the record holds what the
 * captured page showed; hydration renders that; the next render shows the
 * visitor's own. One key per value: two components may share a key only if
 * they always show the same value.
 */
export function usePrerendered(key, value) {
  const hydrated = useHydrated();
  if (PRERENDER) recorded.values[key] = value;
  if (!hydrated) {
    const hit = recordedValue(key);
    if (hit) return hit.value;
  }
  return value;
}

/**
 * useState for a value the page settles on after mounting (a fetch, a
 * measurement). The prerenderer records the value its page settled on, and a
 * hydrating page starts from that, so its first render matches the HTML;
 * the page's own effects then move it on as before. JSON values only.
 */
export function usePrerenderedState(key, initial) {
  const [value, setValue] = useState(() => {
    if (hydrating) {
      const hit = recordedValue(key);
      if (hit) return hit.value;
    }
    return typeof initial === 'function' ? initial() : initial;
  });
  if (PRERENDER) recorded.values[key] = value;
  return [value, setValue];
}

/**
 * For a useState initialiser: the recorded value while hydrating, otherwise
 * read() (recorded under the prerenderer). Pair it with an effect that sets
 * the visitor's own value once mounted.
 */
export function prerenderValue(key, read) {
  if (hydrating) {
    const hit = recordedValue(key);
    if (hit) return hit.value;
  }
  const value = read();
  if (PRERENDER) recorded.values[key] = value;
  return value;
}

let reduced;
/** The visitor's reduced-motion preference, read once per page load. */
export function prefersReducedMotion() {
  if (reduced === undefined) reduced = canMatch() && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return reduced;
}
