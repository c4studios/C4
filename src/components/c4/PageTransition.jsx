import React, { useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const ease = [0.22, 1, 0.36, 1];

const fullVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.25, ease } },
};

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease } },
  exit: { opacity: 0, transition: { duration: 0.12, ease } },
};

const fragmentTarget = (hash) => {
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    /* a malformed escape: look the raw id up instead */
  }
  return id ? document.getElementById(id) : null;
};

/* Puts the page on the fragment's element and keeps it there while the page
   settles: a page can mount after this runs, and images, fonts and pinned
   scenes above the target move it after the first jump. The site's smooth
   scrolling (html { scroll-behavior: smooth }) would animate every
   correction, so it's held instant for the landing. It lets go the moment
   the visitor scrolls, taps or types, or after 2.5 seconds. A fragment with
   no element behind it lands on the top, as any other route change does. */
function landOnFragment(hash) {
  const root = document.documentElement;
  const before = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  let done = false;
  let raf = 0;
  let landed = false;

  const offBy = (el) => el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
  const land = () => {
    raf = 0;
    if (done) return;
    const el = fragmentTarget(hash);
    if (!el) return;
    landed = true;
    if (Math.abs(offBy(el)) > 2) el.scrollIntoView({ block: 'start', behavior: 'auto' });
  };
  const onScroll = () => {
    if (done || raf) return;
    const el = fragmentTarget(hash);
    if (el && Math.abs(offBy(el)) > 2) raf = window.requestAnimationFrame(land);
  };
  const interactions = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
  const finish = () => {
    if (done) return;
    done = true;
    window.cancelAnimationFrame(raf);
    root.style.scrollBehavior = before;
    window.removeEventListener('scroll', onScroll);
    interactions.forEach((t) => window.removeEventListener(t, finish));
  };

  land();
  if (!landed) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  window.addEventListener('scroll', onScroll, { passive: true });
  interactions.forEach((t) => window.addEventListener(t, finish, { passive: true }));
  const timers = [0, 90, 160, 400, 650, 1200].map((ms) => window.setTimeout(land, ms));
  timers.push(window.setTimeout(finish, 2500));

  return () => {
    timers.forEach((t) => window.clearTimeout(t));
    finish();
  };
}

export default function PageTransition({ children, pageKey }) {
  const { pathname, search } = useLocation();
  const prefersReduced = usePrefersReducedMotion();
  const variants = prefersReduced ? reducedVariants : fullVariants;

  useEffect(() => {
    if (!window.history || !('scrollRestoration' in window.history)) {
      return undefined;
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    /* The mobile menu locks body overflow while open; a link tapped inside
       it changes the route before that lock lifts, and a locked viewport
       ignores scrollTo. Lift it here, then scroll. */
    document.body.style.overflow = '';
    if (window.location.hash.length > 1) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  useEffect(() => {
    /* Arriving on a URL with a #fragment (a shared /Lens#work, a typed
       /seo-and-copywriting#prices, back or forward to one) lands on that
       element instead of the top. Same-page # links don't change pathname
       or search, so they never reach here and the browser jumps as usual. */
    if (window.location.hash.length > 1) return landOnFragment(window.location.hash);

    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    const late = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 90);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(late);
    };
  }, [pathname, search]);

  return (
    <motion.div
      key={pageKey + search}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}