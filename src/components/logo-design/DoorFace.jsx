/*
 * The Logo Design door's face, for the home page's four doors.
 *
 * Like the other faces it's a doorway-scale sample of the destination's own
 * world: the offcut of sign vinyl on the green cutting mat from /logo-design,
 * caught halfway through the weed. The roundel and most of the wordmark
 * stand clear on the backing paper, and the spare vinyl is folded back over
 * the bottom left corner, dark side up, with the letters' holes showing in it
 * mirrored. The mark is the page's stand-in (mark-data.js), never a client's.
 *
 * It fills its parent (the door's face link, position: relative) and sits
 * behind the door's own tag and title, which keep the top left corner and
 * the foot of the face. Decorative, so aria-hidden and data-nosnippet, and
 * it carries no words: the letters are paths. Nothing is hidden at rest;
 * hover or keyboard focus lifts the flap a little further, and reduced
 * motion keeps it still. On a short, wide face (the one-column phone layout)
 * the drawing sits smaller in the top right corner, so the flap stays clear
 * of the tag and the title.
 */
import { MARK } from './mark-data';
import { roundelPath, lettersPath } from './Mark';
import { makePeel } from './peel';
import './door.css';

const V = MARK.stacked;
const K = 206 / V.w; // the lockup at door scale, in a 300 x 400 face
const MU = 13 / K;
const FU = 9 / K;
const BOX = { x0: -MU, y0: -MU, x1: V.w + MU, y1: V.h + MU };
const SHEET = { x: BOX.x0 - FU, y: BOX.y0 - FU, w: BOX.x1 - BOX.x0 + 2 * FU, h: BOX.y1 - BOX.y0 + 2 * FU };
const LOCAL = `translate(150 182) rotate(-6) scale(${K}) translate(${-V.w / 2} ${-V.h / 2})`;

const P = makePeel(BOX);
const S = P.L * 0.6; // where the door catches the weed
const ROUND = V.roundel;
const DISC_D = `M${ROUND.cx - ROUND.r} ${ROUND.cy} A${ROUND.r} ${ROUND.r} 0 1 0 ${ROUND.cx + ROUND.r} ${ROUND.cy} A${ROUND.r} ${ROUND.r} 0 1 0 ${ROUND.cx - ROUND.r} ${ROUND.cy} Z`;
const SPARE_D = `${P.boxD} ${V.letters.map((g) => g.outer.join(' ')).join(' ')} ${DISC_D}`;

export default function LogoDoorFace() {
  return (
    <span className="lg-door" aria-hidden="true" data-nosnippet="">
      <svg className="lg-door-art" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="lg-door-gloss" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="1400" y2="700">
            <stop offset="0" stopColor="#242424" />
            <stop offset="0.44" stopColor="#151515" />
            <stop offset="0.5" stopColor="#303030" />
            <stop offset="0.58" stopColor="#151515" />
            <stop offset="1" stopColor="#0d0d0d" />
          </linearGradient>
          <linearGradient id="lg-door-under" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1400" y2="600">
            <stop offset="0" stopColor="#53524d" />
            <stop offset="1" stopColor="#3a3935" />
          </linearGradient>
          <clipPath id="lg-door-down" clipPathUnits="userSpaceOnUse"><polygon points={P.halfPlane(S, false)} /></clipPath>
          <clipPath id="lg-door-up" clipPathUnits="userSpaceOnUse"><polygon points={P.halfPlane(S, true)} /></clipPath>
          <filter id="lg-door-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22" /></filter>
        </defs>

        {/* the mat: centimetre ruling, every fifth line, and the ruler down one side */}
        <g className="lg-door-mat">
          {[75, 150, 225].map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="400" />)}
          {[75, 150, 225, 300, 375].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} />)}
          {Array.from({ length: 26 }, (_, i) => (i + 1) * 15).map((y, i) => (
            <line key={`t${y}`} className="lg-door-tick" x1={(i + 1) % 5 === 0 ? 284 : 290} y1={y} x2="300" y2={y} />
          ))}
          <path className="lg-door-angle" d="M300 400 L69 0" />
        </g>

        <g transform={LOCAL}>
          {/* the offcut and its two shadows */}
          <rect x={SHEET.x + 60} y={SHEET.y + 120} width={SHEET.w - 60} height={SHEET.h} fill="rgba(0,0,0,0.4)" filter="url(#lg-door-blur)" />
          <rect x={SHEET.x} y={SHEET.y} width={SHEET.w} height={SHEET.h} fill="#f6f5ef" />
          <path fillRule="evenodd" fill="url(#lg-door-gloss)" d={`M${SHEET.x} ${SHEET.y} h${SHEET.w} v${SHEET.h} h${-SHEET.w} Z ${P.boxD}`} />
          <path fillRule="evenodd" fill="url(#lg-door-gloss)" d={`${roundelPath(ROUND)} ${lettersPath(V)}`} />
          {/* where the fold hasn't reached, the box is still one sheet of
              vinyl: letters, spare and islands alike */}
          <g clipPath="url(#lg-door-down)">
            <path fill="url(#lg-door-gloss)" d={P.boxD} />
          </g>
          {/* the flap, dark side up, and its shadow */}
          <g className="lg-door-flap">
            <polygon className="lg-door-flapshadow" points={P.shadow(S, 30, 60)} fill="rgba(0,0,0,0.42)" filter="url(#lg-door-blur)" />
            <g transform={P.mirror(S)}>
              <g clipPath="url(#lg-door-up)">
                <path fillRule="evenodd" fill="url(#lg-door-under)" d={SPARE_D} />
              </g>
            </g>
            <path className="lg-door-fold" d={P.foldPath(S)} />
            <path className="lg-door-fold-light" d={P.foldPath(S, 26)} />
          </g>
        </g>
      </svg>
    </span>
  );
}
