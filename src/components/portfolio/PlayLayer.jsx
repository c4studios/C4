/*
 * A portfolio tile that plays (Caleb, 2 Oct 2026): a short silent clip of the
 * live site laid over the tile, which fades in once it is actually playing.
 * With a mouse it plays while the pointer or keyboard focus is on the card;
 * on touch it plays while the card is most of the way into view. Only one
 * tile plays at a time. Nothing loads until the first play (preload none).
 *
 * Reduced motion, Save-Data and the prerenderer get no clip at all, and the
 * tile stays its usual self.
 */
import { useEffect, useRef, useState } from 'react';
import useStaticMode from '@/hooks/useStaticMode';
import './motion.css';

let current = null;

export default function PlayLayer({ clip }) {
  const staticMode = useStaticMode();
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (staticMode) return undefined;
    const video = ref.current;
    const card = video && video.closest('a');
    if (!video || !card) return undefined;
    const saveData = typeof navigator !== 'undefined' && navigator.connection && navigator.connection.saveData;
    if (saveData) return undefined;

    const stop = () => {
      setOn(false);
      video.pause();
      if (current && current.video === video) current = null;
    };
    const start = () => {
      if (current && current.video !== video) current.stop();
      current = { video, stop };
      video.preload = 'auto';
      try { video.currentTime = 0; } catch { /* not seekable yet */ }
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    };
    const onPlaying = () => { if (current && current.video === video) setOn(true); };
    video.addEventListener('playing', onPlaying);

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) {
      card.addEventListener('pointerenter', start);
      card.addEventListener('pointerleave', stop);
      card.addEventListener('focus', start);
      card.addEventListener('blur', stop);
      return () => {
        video.removeEventListener('playing', onPlaying);
        card.removeEventListener('pointerenter', start);
        card.removeEventListener('pointerleave', stop);
        card.removeEventListener('focus', start);
        card.removeEventListener('blur', stop);
        stop();
      };
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.65) start(); else if (current && current.video === video) stop();
    }, { threshold: [0, 0.65, 1] });
    io.observe(card);
    return () => {
      video.removeEventListener('playing', onPlaying);
      io.disconnect();
      stop();
    };
  }, [staticMode]);

  if (staticMode) return null;
  return (
    <video
      ref={ref}
      className={`pf-play${on ? ' is-on' : ''}`}
      muted
      playsInline
      loop
      preload="none"
      poster={clip.poster}
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
    >
      {clip.webm ? <source src={clip.webm} type="video/webm" /> : null}
      {clip.mp4 ? <source src={clip.mp4} type="video/mp4" /> : null}
    </video>
  );
}
