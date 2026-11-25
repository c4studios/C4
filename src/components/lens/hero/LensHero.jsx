/* The /Lens hero: one human eye, lit like a low-key studio portrait, that
   looks at the visitor's pointer. Its pupil is a nine-blade aperture.
   A switch in the hero offers a second look of the same eye, engraved in
   white line on black (engravedEye.js); colour is the default.
   The markup is the same on the server pass and the first client pass, and
   always in the colour state. The live canvas, the gaze, the readouts and a
   stored or linked choice of look are applied by effects, never for the
   prerenderer. Each eye's code loads by dynamic import only when it shows. */
import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import { createPageUrl } from '@/utils';
import { PRERENDER, prefersReducedMotion } from '@/lib/hydration';
import { REST_L, restR } from './shutter.js';
import poster1600 from './eye-poster-1600.webp';
import poster800 from './eye-poster-800.webp';
import './lens-hero.css';

const KEY = 'c4-lens-eye';
const FADE = 300; // the crossfade in lens-hero.css (.lh-layer)

/* Stop every eye that has faded out: frees its context and removes its canvas. */
function sweep(list) {
  const stops = list.current;
  list.current = [];
  stops.forEach((stop) => stop());
}

export default function LensHero() {
  const ref = useRef(null);
  const [look, setLook] = useState('colour'); // the switch
  const [shown, setShown] = useState('colour'); // the layer on screen
  const picked = useRef(null); // a look chosen at mount, applied on the next render
  const leaving = useRef([]); // eyes frozen and fading out
  const timer = useRef(0);

  // A ?eye= link wins for this visit; otherwise the last choice made here.
  useEffect(() => {
    if (PRERENDER) return;
    let pick = null;
    try {
      pick = new URLSearchParams(window.location.search).get('eye');
    } catch {
      pick = null;
    }
    if (pick !== 'engraved' && pick !== 'colour') {
      try {
        pick = window.localStorage.getItem(KEY);
      } catch {
        pick = null;
      }
    }
    if (pick === 'engraved') {
      picked.current = pick;
      setLook(pick);
    }
  }, []);

  // Run the chosen eye. The one leaving is frozen at once, faded out over the
  // new one, then stopped: one eye runs at a time.
  useEffect(() => {
    const section = ref.current;
    if (!section || PRERENDER) return undefined;
    if (picked.current && picked.current !== look) return undefined; // the picked look is a render away
    picked.current = null;
    const reduce = prefersReducedMotion();
    const leavingList = leaving;
    const timerRef = timer;
    let cancelled = false;
    let stop = null;
    const reveal = () => {
      if (cancelled) return;
      setShown(look);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => sweep(leavingList), reduce ? 0 : FADE + 40);
    };
    if (look === 'engraved') {
      import('./engravedEye.js')
        .then(({ startEngraved }) => {
          if (cancelled) return;
          stop = startEngraved(section, { still: reduce });
          reveal();
        })
        .catch(() => {
          if (!cancelled) setLook('colour');
        });
    } else if (reduce) {
      reveal(); // the poster is the colour eye
    } else {
      import('./eyeDirector.js')
        .then(({ startEye }) => {
          if (cancelled) return;
          stop = startEye(section);
          reveal();
        })
        .catch(reveal);
    }
    return () => {
      cancelled = true;
      // Only the eye leaving now fades. Any still fading from an earlier
      // switch goes at once, so quick switching never piles up graphics
      // contexts (29 canvases in review, 25 Nov 2026).
      clearTimeout(timerRef.current);
      sweep(leavingList);
      if (stop) {
        stop(true);
        leavingList.current.push(stop);
      }
    };
  }, [look]);

  // Leaving the page: stop whatever is still fading.
  useEffect(() => {
    const leavingList = leaving;
    const timerRef = timer;
    return () => {
      clearTimeout(timerRef.current);
      sweep(leavingList);
    };
  }, []);

  const choose = (e) => {
    const v = e.target.value === 'engraved' ? 'engraved' : 'colour';
    setLook(v);
    try {
      window.localStorage.setItem(KEY, v);
    } catch {
      /* storage blocked: the choice lasts this visit */
    }
  };

  return (
    <section className="lh" id="top" aria-labelledby="lh-title" ref={ref}>
      <div className="lh-eye" aria-hidden="true">
        <div className={`lh-layer lh-layer-colour${shown === 'colour' ? '' : ' is-off'}`}>
          {/* The poster is the shader's own still (make-poster.mjs), placed from
              --lh-cx, --lh-cy and --lh-iris so the live canvas lands on it. */}
          <img
            className="lh-poster"
            src={poster1600}
            srcSet={`${poster800} 800w, ${poster1600} 1600w`}
            sizes="(max-width: 600px) 216vw, 1600px"
            width="1600"
            height="1000"
            alt=""
            // React 18 has no fetchPriority prop; the lowercase attribute passes through (as in ArticlePhoto)
            {...{ fetchpriority: 'high' }}
            draggable="false"
          />
          <span className="lh-mark lh-mark-tl" />
          <span className="lh-mark lh-mark-tr" />
          <span className="lh-mark lh-mark-bl" />
          <span className="lh-mark lh-mark-br" />
        </div>
        <div className={`lh-layer lh-layer-eng${shown === 'engraved' ? '' : ' is-off'}`} />
        <span className="lh-probe" />
      </div>
      <div className="lh-copy">
        <h2 className="lh-title" id="lh-title">Stock is <em>someone else&rsquo;s</em> business.</h2>
        <p className="lh-lede">Photography, film and drone work for Perth businesses.</p>
      </div>
      <div className="lh-actions">
        <a href="#packages" className="btn primary"><span className="d"></span>View packages</a>
        <Link to={`${createPageUrl('StartProject')}?service=lens`} className="btn">Start a project <span className="btn-arrow">→</span></Link>
      </div>
      <div className="lh-sw" role="radiogroup" aria-label="Eye style">
        <label className="lh-sw-opt">
          <input className="lh-sw-input" type="radio" name="lh-eye" value="colour" checked={look === 'colour'} onChange={choose} />
          <span className="lh-sw-face">
            <svg className="lh-sw-glyph" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <circle className="lh-sw-disc" cx="8" cy="8" r="8" />
              <circle cx="8" cy="8" r="3.2" fill="#000" />
            </svg>
            Colour
          </span>
        </label>
        <label className="lh-sw-opt">
          <input className="lh-sw-input" type="radio" name="lh-eye" value="engraved" checked={look === 'engraved'} onChange={choose} />
          <span className="lh-sw-face">
            <svg className="lh-sw-glyph lh-sw-line" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <circle cx="8" cy="8" r="7.4" strokeWidth="1" />
              <path strokeWidth="0.7" d="M12.6 8L14.1 8M12.32 9.57L13.73 10.09M11.52 10.96L12.67 11.92M10.3 11.98L11.05 13.28M8.8 12.53L9.06 14.01M7.2 12.53L6.94 14.01M5.7 11.98L4.95 13.28M4.48 10.96L3.33 11.92M3.68 9.57L2.27 10.09M3.4 8L1.9 8M3.68 6.43L2.27 5.91M4.48 5.04L3.33 4.08M5.7 4.02L4.95 2.72M7.2 3.47L6.94 1.99M8.8 3.47L9.06 1.99M10.3 4.02L11.05 2.72M11.52 5.04L12.67 4.08M12.32 6.43L13.73 5.91" />
              <path strokeWidth="1" strokeLinejoin="miter" d="M8 5.1L9.86 5.78L10.86 7.5L10.51 9.45L8.99 10.73L7.01 10.73L5.49 9.45L5.14 7.5L6.14 5.78Z" />
            </svg>
            Engraved
          </span>
        </label>
      </div>
      <p className="lh-readout lh-readout-l" aria-hidden="true">{REST_L}</p>
      <p className="lh-readout lh-readout-r" aria-hidden="true">{restR(0)}</p>
      <div className="lh-flash" aria-hidden="true" />
    </section>
  );
}
