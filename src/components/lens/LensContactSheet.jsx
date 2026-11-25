/* The contact sheet at the head of the work section on /Lens (23 Nov 2026).
 *
 * One frame for each project in the reel (reelProjects.js), so a visitor sees
 * real pictures on the first scroll without pressing anything. It is set like
 * a 35 mm contact sheet marked up with a grease pencil: a thin black rebate
 * between frames, the edge number over each frame, and an amber ring drawn
 * round a frame under the pointer or the keyboard. Pressing a frame opens the
 * reel on that project, at the picture the frame shows (LensWork.jsx passes
 * it to LensReel.jsx).
 *
 * Each frame shows the project's first picture of C4's own where it has one,
 * else its first picture. A client's picture says so under its frame, and the
 * full CLIENT_PHOTO line appears once under the sheet. The pictures are the
 * reel's files, in the reel's way: AVIF with WebP behind it, every cut width,
 * the real size, the picture's own alt, cropped here to 3:2 at the picture's
 * own focus. A film frame with a wide and a tall cut uses the wide one.
 */
import React from 'react';
import { REEL_PROJECTS, CLIENT_PHOTO, CLIENT_PHOTOS } from './reelProjects';
import './lens-sheet.css';

const FRAMES = REEL_PROJECTS.map((proj, p) => {
  const own = proj.images.findIndex((im) => !im.client);
  const j = own >= 0 ? own : 0;
  const im = proj.images[j];
  const art = im.picture.type === 'art-stills';
  const pic = art ? im.picture.wide : im.picture;
  /* A picture's focus is set for the reel's full screen. Where that crop
     doesn't suit a 3:2 frame, the picture carries its own `sheet` focus
     (reelProjects.js). */
  const focus = im.sheet || im.focus || '50% 50%';
  return { p, j, proj, im, pic, focus };
});
/* One client's frame takes the reel's line as it is; more than one takes
   the same line in the plural. */
const CLIENT_FRAMES = FRAMES.filter((f) => f.im.client).length;

/* The section pads 40 px a side (20 on a phone) and stops at 1400 px. */
const SIZES = '(min-width: 1480px) 462px, (min-width: 900px) calc((100vw - 96px) / 3), (min-width: 641px) calc((100vw - 88px) / 2), calc((100vw - 46px) / 2)';
const setFor = (s, ext) => s.widths.filter((w) => w <= s.width).map((w) => `${s.base}-${w}.${ext} ${w}w`).join(', ');

/* A grease-pencil loop in a 3:2 box: not quite an ellipse, a little tilted,
   and carried on past where it started, the way a hand closes a ring. */
const RING = 'M44 36 C 98 4, 232 4, 278 44 C 310 72, 300 152, 248 178 C 190 204, 84 198, 36 164 C 0 138, 4 66, 54 30 C 74 18, 100 12, 124 10';

export default function LensContactSheet({ onOpen }) {
  return (
    <div className="lcs">
      {/* The pencil's wax: a little roughness on the ring's edges. */}
      <svg className="lcs-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="lcs-wax" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="2.4" />
        </filter>
      </svg>
      <ol className="lcs-sheet">
        {FRAMES.map(({ p, j, proj, im, pic, focus }) => (
          <li key={proj.id} className="lcs-frame">
            <button
              type="button"
              className="lcs-hit"
              aria-haspopup="dialog"
              onClick={(e) => onOpen(p, j, e.currentTarget)}
            >
              <span className="lcs-edge" aria-hidden="true">{p + 1}A</span>
              <span className="lcs-shot" style={{ '--lcs-focus': focus }}>
                <picture>
                  <source type="image/avif" srcSet={setFor(pic, 'avif')} sizes={SIZES} />
                  <source type="image/webp" srcSet={setFor(pic, 'webp')} sizes={SIZES} />
                  <img
                    src={`${pic.base}-${pic.widths[0]}.webp`}
                    width={pic.width}
                    height={pic.height}
                    alt={pic.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <svg className="lcs-ring" viewBox="0 0 300 200" aria-hidden="true" focusable="false">
                  <path d={RING} pathLength="1" />
                </svg>
              </span>
              <span className="lcs-cap">
                <span className="lcs-client">{proj.study.client}</span>
                <span className="lcs-kind">{proj.kind}</span>
                {im.client && <span className="lcs-theirs">Client&rsquo;s photo</span>}
              </span>
            </button>
          </li>
        ))}
      </ol>
      {CLIENT_FRAMES > 0 && <p className="lcs-note">{CLIENT_FRAMES > 1 ? CLIENT_PHOTOS : CLIENT_PHOTO}</p>}
    </div>
  );
}
