/*
 * The SEO and copywriting door's face, for the home page's four doors.
 *
 * Position one, said with type and space. One search line, the result at 1,
 * and that result's title set big enough to run off the face, the way the
 * C4Site banners run their mark off the frame: the first result owns the
 * page. The title is in the board's non-repro blue (#2a6c8a, 5.66:1 on
 * white), so it reads as the result and the door's black title stays the
 * action. The 1 is set in B612 Mono, the site's face for figures, as the
 * positions are on the board at /seo-and-copywriting. A huge 1 was tried
 * first; beside the Logo face's 4 it read as numbering.
 *
 * It's an example and says so: the door's note reads "Example search". The
 * query and the listing are the first example on that page's board
 * (examples.js), so the face follows the page, and the listing belongs to
 * "Your Business", which is the visitor. No client and no figure appear.
 *
 * It fills FourDoors' art layer and keeps clear of the door's label (top
 * left) and title (the foot). On short, wide faces (phones) it moves to the
 * right half. Decorative, so aria-hidden and data-nosnippet.
 */
import { EXAMPLES, YOU } from './examples';
import './door.css';

const EX = EXAMPLES[0];
const TITLE = EX.after.title.replace(` | ${YOU}`, '');

export default function SeoDoorFace() {
  return (
    <span className="sc-door" aria-hidden="true" data-nosnippet="">
      <span className="sc-door-q">
        <svg className="sc-door-glass" viewBox="0 0 16 16" focusable="false">
          <circle cx="7" cy="7" r="4.6" />
          <path d="M10.4 10.4 L14 14" />
        </svg>
        <span className="sc-door-query">{EX.query}</span>
        <span className="sc-door-caret" />
      </span>
      <span className="sc-door-hit">
        <span className="sc-door-n">1</span>
        <span className="sc-door-site"><span className="sc-door-fav">Y</span>{YOU}</span>
      </span>
      <span className="sc-door-title">{TITLE}</span>
    </span>
  );
}
