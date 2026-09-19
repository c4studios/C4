import { useEffect, useRef, useState } from 'react';
import { createSiteMosaic } from './mosaicEngine';

/*
 * The C4Site hero stage: the chalk-letter board and its camera journey
 * (mosaicEngine.js). Decorative: the canvas is aria-hidden and the page's real
 * H1 sits below it in the DOM.
 *
 * - Prerender: nothing is mounted, the stage is an empty board.
 * - Reduced motion: the finished frame, drawn once, no movement.
 * - Otherwise: plays once when the stage is on screen, pauses when it is not,
 *   and offers to play again at the end.
 * - ?mosaic=record: no autoplay, and the engine is exposed as
 *   window.__siteMosaic so a script can seek frame by frame for the video.
 */
export default function SiteMosaic({ reduced = false, prerender = false }) {
  const hostRef = useRef(null);
  const engineRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || prerender) return undefined;
    const record = /[?&]mosaic=record\b/.test(window.location.search);
    const engine = createSiteMosaic(host, {
      autoplay: false,
      onDone: () => setDone(true),
    });
    engineRef.current = engine;
    let io = null;
    if (record) {
      window.__siteMosaic = engine;
    } else if (reduced) {
      engine.finish();
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) engine.play();
          else engine.pause();
        },
        { threshold: 0.25 },
      );
      io.observe(host);
    }
    return () => {
      if (io) io.disconnect();
      engine.destroy();
      if (window.__siteMosaic === engine) delete window.__siteMosaic;
    };
  }, [reduced, prerender]);

  return (
    <div className="sg-mosaic" ref={hostRef}>
      {done && !reduced && (
        <button
          type="button"
          className="sg-mosaic-replay"
          onClick={() => {
            setDone(false);
            if (engineRef.current) engineRef.current.replay();
          }}
        >
          Play it again
        </button>
      )}
    </div>
  );
}
