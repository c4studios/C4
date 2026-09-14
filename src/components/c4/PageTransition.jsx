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
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  useEffect(() => {
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