/*
 * The SEO and copywriting door's face, for the home page's four doors.
 *
 * Like the other faces it's a doorway-scale sample of the destination's own
 * look, here the paste-up board from /seo-and-copywriting: white board ruled
 * in non-repro blue, register marks, the search pasted at the head, the
 * visitor's listing at first with its position ringed in pencil and the
 * trail it climbed, and the results it passed below it. The other strips
 * carry only the kind of result they are (a trade directory, a quote site),
 * never a title, so the home page's static HTML holds no invented listing.
 *
 * It fills its parent (the door's face link, position: relative) and sits
 * behind the door's own tag and title, which keep the top-left corner and
 * the lower part of the face. Decorative, so aria-hidden. Nothing in it is
 * hidden at rest, so the prerendered HTML shows it whole; hover only lifts
 * the listing and redraws the trail, and reduced motion keeps it still.
 *
 * The door's own tag and title are styled by FourDoors' `.hm-doorface--seo`
 * rules in home.css; ink on this paper holds well over 4.5:1.
 */
import { EXAMPLES, YOU } from './examples';
import { GraphiteDefs, Graphite, ringPath } from './pencil';
import './door.css';

const FILTER_ID = 'sc-door-graphite';
const EX = EXAMPLES[0];

export default function SeoDoorFace() {
  return (
    <span className="sc-door" aria-hidden="true" data-nosnippet="">
      <GraphiteDefs id={FILTER_ID} />
      <span className="sc-door-reg sc-door-reg--tl" />
      <span className="sc-door-reg sc-door-reg--tr" />
      <span className="sc-door-reg sc-door-reg--bl" />
      <span className="sc-door-reg sc-door-reg--br" />

      <span className="sc-door-stack">
        <span className="sc-door-query">
          <svg className="sc-door-glass" viewBox="0 0 16 16" focusable="false">
            <circle cx="7" cy="7" r="4.6" />
            <path d="M10.4 10.4 L14 14" />
          </svg>
          <span className="sc-door-q">{EX.query}</span>
          <span className="sc-door-caret" />
        </span>

        <span className="sc-door-you">
          <span className="sc-door-n" data-n="1">
            <svg className="sc-door-ring" viewBox="0 0 26 20" focusable="false">
              <g filter={`url(#${FILTER_ID})`}><Graphite d={ringPath(2.5, 2.5, 21, 15, 5)} pass={[0.4, 0.3]} /></g>
            </svg>
          </span>
          <span className="sc-door-site"><span className="sc-door-fav">Y</span>{YOU}</span>
          <span className="sc-door-title">{EX.after.title.replace(` | ${YOU}`, '')}</span>
          <svg className="sc-door-trail" viewBox="0 0 40 140" focusable="false">
            <g filter={`url(#${FILTER_ID})`}>
              <Graphite d="M 6 134 C 40 112, 42 40, 4 14 M 13 12 L 4 14 L 7 23" className="sc-door-trail-g" />
            </g>
          </svg>
        </span>

        {EX.others.slice(0, 4).map((o, i) => (
          <span key={o.title} className="sc-door-strip" data-n={i + 2}>
            <span className="sc-door-fav" />
            <span className="sc-door-kind">{o.kind}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
