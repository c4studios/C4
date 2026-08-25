import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';

const Inner = lazy(() => import('./C4FooterCredit.jsx'));

const SIZES = { small: 28, default: 36, large: 48, xl: 72 };

/**
 * Defers the badge — and the ~40 KB gzip of GSAP it pulls in — out of the
 * initial bundle, without ever risking the badge not appearing.
 *
 * Two triggers, whichever comes first:
 *
 *   1. An idle callback (or a short timer where that is unavailable). This is
 *      the guaranteed path. An earlier version gated purely on
 *      IntersectionObserver and the badge silently never rendered anywhere the
 *      observer is inert — headless captures and some privacy contexts among
 *      them. A credit that sometimes vanishes is a worse trade than a chunk
 *      fetched a second after load.
 *   2. IntersectionObserver, purely as an accelerator when the footer is
 *      already close to the viewport.
 *
 * The wrapper reserves the badge's resting box so its arrival shifts nothing.
 * The width reservation is not cosmetic: this usually sits in a
 * `flex justify-center` footer row, where an empty child collapses to 0px wide,
 * and IntersectionObserver never reports a zero-area element as intersecting.
 */
export default function C4FooterCreditLazy({ size = 36, showText = true, ...props }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let settled = false;
    const trigger = () => {
      if (settled) return;
      settled = true;
      setShow(true);
    };

    const hasIdle = typeof requestIdleCallback === 'function';
    const idleId = hasIdle ? requestIdleCallback(trigger, { timeout: 3000 }) : setTimeout(trigger, 1500);

    let io;
    const el = ref.current;
    if (el && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) trigger();
        },
        { rootMargin: '400px' },
      );
      io.observe(el);
    }

    return () => {
      settled = true;
      if (io) io.disconnect();
      if (hasIdle) cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    };
  }, []);

  const px = typeof size === 'number' ? size : (SIZES[size] ?? SIZES.default);

  return (
    <div
      ref={ref}
      style={{ minHeight: showText ? px + 22 : px, minWidth: Math.round(px * 2.2) }}
    >
      {show && (
        <Suspense fallback={null}>
          <Inner size={size} showText={showText} {...props} />
        </Suspense>
      )}
    </div>
  );
}
