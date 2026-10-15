/*
 * framer-motion, safe for hydration (15 Oct 2026).
 *
 * vite.config.js resolves every `import … from 'framer-motion'` in the app to
 * this file, so components import framer-motion exactly as they always have.
 * It re-exports the library unchanged except for `motion`.
 *
 * A motion component with an entrance (initial → animate) renders its
 * `initial` state first and animates out of it. On a prerendered page that is
 * wrong twice over. The prerenderer captures whatever frame the entrance had
 * reached, sometimes the hidden start (words at opacity 0 on a case study
 * whose stagger ran long). And when the browser hydrates, the first render
 * puts the element back to `initial`: React keeps the HTML's styles, so
 * framer-motion's own state no longer matches the page, and the entrance
 * then plays over content that was already on screen.
 *
 * So a motion component that renders in the prerenderer, or mounts while a
 * prerendered page hydrates, starts at its `animate` state (initial={false}):
 * the finished end state, in the HTML and in the first render alike.
 * Everything that mounts later (a route change, an opened menu, the next
 * slide) animates in as before. An endless loop (repeat: Infinity) still
 * starts in the browser; the prerenderer writes its resting frame.
 */
import { createElement, forwardRef, useState } from 'react';
import { motion as baseMotion } from 'framer-motion';
import { PRERENDER, isHydrating } from './hydration';

export * from 'framer-motion';

const endless = (t) => Boolean(t) && typeof t === 'object'
  && (t.repeat === Infinity || Object.values(t).some((v) => Boolean(v) && typeof v === 'object' && v.repeat === Infinity));

function loops(props) {
  if (endless(props.transition)) return true;
  const target = typeof props.animate === 'string' ? props.variants?.[props.animate] : props.animate;
  return Boolean(target) && typeof target === 'object' && !Array.isArray(target) && endless(target.transition);
}

const settled = new Map();

function settle(Component) {
  if (!Component || (typeof Component !== 'object' && typeof Component !== 'function')) return Component;
  let Safe = settled.get(Component);
  if (Safe) return Safe;
  Safe = forwardRef(function HydrationSafeMotion(props, ref) {
    const [atRest] = useState(() => (PRERENDER || (isHydrating() && !loops(props))));
    const next = atRest && props.initial !== false ? { ...props, initial: false, ref } : { ...props, ref };
    return createElement(Component, next);
  });
  Safe.displayName = `Settled(${Component.displayName || Component.name || 'motion'})`;
  settled.set(Component, Safe);
  return Safe;
}

export const motion = new Proxy(baseMotion, {
  get(target, key, receiver) {
    const value = Reflect.get(target, key, receiver);
    if (key === 'create') return (Component, options) => settle(value(Component, options));
    if (typeof key === 'string' && value && value.$$typeof) return settle(value);
    return value;
  },
  apply(target, thisArg, args) {
    return settle(Reflect.apply(target, thisArg, args));
  },
});
