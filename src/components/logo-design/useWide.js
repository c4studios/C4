/*
 * 'wide' when the window has room to pin a scene beside the words (1024px
 * across and 600px tall, as the exam uses), otherwise 'flat'. Always 'flat'
 * under useStaticMode, decided on the first render, so the prerendered HTML
 * is the flat layout with every word in it.
 */
import { useEffect, useState } from 'react';
import useStaticMode from '@/hooks/useStaticMode';

const WIDE = '(min-width: 1024px) and (min-height: 600px)';

function read(staticMode) {
  if (staticMode || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'flat';
  return window.matchMedia(WIDE).matches ? 'wide' : 'flat';
}

export default function useWide() {
  const staticMode = useStaticMode();
  const [mode, setMode] = useState(() => read(staticMode));
  useEffect(() => {
    if (staticMode || typeof window.matchMedia !== 'function') return undefined;
    const q = window.matchMedia(WIDE);
    const on = () => setMode(read(false));
    q.addEventListener?.('change', on);
    return () => q.removeEventListener?.('change', on);
  }, [staticMode]);
  return mode;
}

/* Which of a list of elements has reached the reading line (a fraction of the
   window's height down from the top): the last one whose top is above it. */
export function useReadingLine(active, refs, at) {
  const [on, setOn] = useState(0);
  useEffect(() => {
    if (!active) { setOn(0); return undefined; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * at;
      let next = 0;
      refs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < line) next = i;
      });
      setOn(next);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [active, refs, at]);
  return on;
}
