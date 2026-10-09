/*
 * Our 4, drawn the way each process in the run would carry it.
 *
 * These are drawings, made in code from the logo's own points (geometry.js),
 * and the page says so beside them. They aren't photographs and aren't
 * mock-ups of anything we've made: they show what each process does to a
 * mark, using the one mark we're free to show.
 *
 *  - engrave: cut into copper, one depth, no colour. A light lip on the lower
 *    edge, the upper inside wall in shadow, and the floor hatched the way a
 *    graver leaves it.
 *  - foil: one gold for both pieces, pressed into dark card.
 *  - screen: the red and the green as two separate screens of ink on cotton,
 *    each with its own registration marks. While the step is being read the
 *    green screen drops into register over the red.
 *  - stitch: satin stitch, the body and the arm stitched at different angles
 *    on a dark twill, raised off it.
 *  - sign: sign-painter's enamel on a window, with a yellow shade line.
 *  - van: the 4 across a door gap. The two doors are separate panels, so the
 *    half on the right sits a fraction lower, the way doors never quite line
 *    up.
 *  - seal: pressed into red wax, one colour.
 *
 * Each plate is 360 units square. Decorative: the caption beside it says
 * what it shows, so the SVG is aria-hidden.
 */
import { BOX, DEEP, SCREEN, MARK_SOURCE, fit } from './geometry';

const V = 360;
const four = (h, cx = V / 2, cy = V / 2) => {
  const w = (BOX.four.w / BOX.four.h) * h;
  return fit(BOX.four, cx - w / 2, cy - h / 2, h);
};

/* the 4 as two polygons, through a fit transform */
function Four({ f, body, arm, bodyFill, armFill, ...rest }) {
  return (
    <g transform={f.transform} {...rest}>
      <polygon points={MARK_SOURCE.fourBody} fill={bodyFill || body} />
      <polygon points={MARK_SOURCE.fourArm} fill={armFill || arm} />
    </g>
  );
}

function Engrave({ id }) {
  const f = four(232);
  return (
    <>
      <defs>
        <linearGradient id={`${id}-cu`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c98a62" />
          <stop offset="0.45" stopColor="#a8643f" />
          <stop offset="0.7" stopColor="#c58360" />
          <stop offset="1" stopColor="#8d5134" />
        </linearGradient>
        <filter id={`${id}-brush`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.003 0.7" numOctaves="2" seed="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.86  0 0 0 0 0.72  0 0 0 0.5 -0.12" />
        </filter>
        <pattern id={`${id}-hatch`} width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-36)">
          <rect width="3.2" height="3.2" fill="#7e432a" />
          <rect width="3.2" height="1.1" fill="#9a5737" />
        </pattern>
        <clipPath id={`${id}-cut`}>
          <polygon points={MARK_SOURCE.fourBody} transform={f.transform} />
          <polygon points={MARK_SOURCE.fourArm} transform={f.transform} />
        </clipPath>
      </defs>
      <rect width={V} height={V} fill={`url(#${id}-cu)`} />
      <rect width={V} height={V} filter={`url(#${id}-brush)`} opacity="0.55" />
      {/* the lip that catches the light, the wall in shadow, then the floor */}
      <g transform="translate(1.6 1.6)"><Four f={f} body="#efc29f" arm="#efc29f" /></g>
      <Four f={f} body="#4f2513" arm="#4f2513" />
      <g clipPath={`url(#${id}-cut)`}>
        <g transform="translate(2.6 2.6)"><Four f={f} body={`url(#${id}-hatch)`} arm={`url(#${id}-hatch)`} /></g>
      </g>
    </>
  );
}

function Foil({ id }) {
  const f = four(226);
  return (
    <>
      <defs>
        <filter id={`${id}-paper`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.62  0 0 0 0 0.75  0 0 0 0.35 -0.08" />
        </filter>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c5a22" />
          <stop offset="0.28" stopColor="#e8cd8a" />
          <stop offset="0.46" stopColor="#a47d38" />
          <stop offset="0.66" stopColor="#f6e6b0" />
          <stop offset="0.84" stopColor="#9a7432" />
          <stop offset="1" stopColor="#d9b96e" />
        </linearGradient>
        <filter id={`${id}-press`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>
      <rect width={V} height={V} fill="#18202d" />
      <rect width={V} height={V} filter={`url(#${id}-paper)`} />
      <g transform="translate(-1 -1.2)" filter={`url(#${id}-press)`} opacity="0.85">
        <Four f={f} body="#05080d" arm="#05080d" />
      </g>
      <g transform="translate(0.8 1)" opacity="0.5"><Four f={f} body="#3a465a" arm="#3a465a" /></g>
      <Four f={f} body={`url(#${id}-gold)`} arm={`url(#${id}-gold)`} />
    </>
  );
}

/* registration marks, in a screen's own ink */
function Marks({ colour }) {
  const at = [[34, 34], [V - 34, 34], [34, V - 34], [V - 34, V - 34]];
  return (
    <g fill="none" stroke={colour} strokeWidth="1.3">
      {at.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="7" />
          <line x1={x - 12} y1={y} x2={x + 12} y2={y} />
          <line x1={x} y1={y - 12} x2={x} y2={y + 12} />
        </g>
      ))}
    </g>
  );
}

function Screen({ id }) {
  const f = four(214);
  return (
    <>
      <defs>
        <filter id={`${id}-cotton`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75 0.55" numOctaves="2" seed="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.38  0 0 0 0.3 -0.05" />
        </filter>
        <filter id={`${id}-ink`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4 3.3" result="holes" />
          <feComposite in="SourceGraphic" in2="holes" operator="in" />
        </filter>
      </defs>
      <rect width={V} height={V} fill="#ede9e1" />
      <rect width={V} height={V} filter={`url(#${id}-cotton)`} />
      <g filter={`url(#${id}-ink)`} style={{ mixBlendMode: 'multiply' }}>
        <Marks colour={DEEP.red} />
        <g transform={f.transform}><polygon points={MARK_SOURCE.fourBody} fill={SCREEN.red} /></g>
      </g>
      <g className="ld-screen-green" filter={`url(#${id}-ink)`} style={{ mixBlendMode: 'multiply' }}>
        <Marks colour={DEEP.green} />
        <g transform={f.transform}><polygon points={MARK_SOURCE.fourArm} fill={SCREEN.green} /></g>
      </g>
    </>
  );
}

function Stitch({ id }) {
  const f = four(222);
  const satin = (key, a, b, angle) => (
    <pattern id={`${id}-${key}`} width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <rect width="3.4" height="3.4" fill={a} />
      <rect y="0.5" width="3.4" height="1.7" fill={b} />
      <rect y="0.9" width="3.4" height="0.55" fill="#ffffff" opacity="0.22" />
    </pattern>
  );
  return (
    <>
      <defs>
        <pattern id={`${id}-twill`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill="#1d2127" />
          <rect width="5" height="1.6" fill="#262b33" />
        </pattern>
        {satin('red', '#6f0b0f', '#d0453d', -36)}
        {satin('green', '#123f1c', '#44a352', 36)}
        <filter id={`${id}-raise`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="1.8" stdDeviation="1.3" floodColor="#000" floodOpacity="0.7" />
        </filter>
      </defs>
      <rect width={V} height={V} fill={`url(#${id}-twill)`} />
      <g filter={`url(#${id}-raise)`}>
        <g transform={f.transform}>
          <polygon points={MARK_SOURCE.fourBody} fill={`url(#${id}-red)`} stroke="#6e0b0e" strokeWidth={2.2 / f.s} strokeLinejoin="round" />
          <polygon points={MARK_SOURCE.fourArm} fill={`url(#${id}-green)`} stroke="#123f1c" strokeWidth={2.2 / f.s} strokeLinejoin="round" />
        </g>
      </g>
    </>
  );
}

function Sign({ id }) {
  const f = four(222, V / 2 - 4, V / 2 - 3);
  return (
    <>
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.62" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="0.8" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-brush`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <rect width={V} height={V} fill="#c7b08d" />
      <rect x={V - 46} width="30" height={V} fill="#b8331f" />
      <g filter={`url(#${id}-brush)`}>
        <g transform="translate(6 5)"><Four f={f} body="#f2c230" arm="#f2c230" /></g>
        <Four f={f} body={SCREEN.red} arm={SCREEN.green} />
      </g>
      <rect width={V} height={V} fill={`url(#${id}-glass)`} />
    </>
  );
}

function Van({ id }) {
  const f = four(226, V / 2 + 6, V / 2 - 6);
  const seam = 196;
  return (
    <>
      <defs>
        <linearGradient id={`${id}-panel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbfbf9" />
          <stop offset="0.55" stopColor="#e9e9e5" />
          <stop offset="0.62" stopColor="#f7f7f4" />
          <stop offset="1" stopColor="#d9d9d3" />
        </linearGradient>
        <clipPath id={`${id}-l`}><rect width={seam} height={V} /></clipPath>
        <clipPath id={`${id}-r`}><rect x={seam} width={V - seam} height={V} /></clipPath>
      </defs>
      <rect width={V} height={V} fill={`url(#${id}-panel)`} />
      <g clipPath={`url(#${id}-l)`}><Four f={f} body={DEEP.red} arm={DEEP.green} /></g>
      <g clipPath={`url(#${id}-r)`} transform="translate(0 1.8)"><Four f={f} body={DEEP.red} arm={DEEP.green} /></g>
      {/* the door gap, and the handle on the left door */}
      <rect x={seam - 1.4} width="2.8" height={V} fill="#2b2b2b" />
      <rect x={seam + 1.4} width="1.2" height={V} fill="#ffffff" opacity="0.55" />
      <rect x="64" y="282" width="78" height="15" rx="7.5" fill="#cfcfca" stroke="#9a9a94" strokeWidth="1" />
      <rect x="70" y="288" width="66" height="3" rx="1.5" fill="#55554f" />
    </>
  );
}

function Seal({ id }) {
  const f = four(138);
  /* an irregular blob of wax, by hand */
  const blob = 'M180 46c28 0 41 14 62 18 24 5 40 24 46 46 6 20 22 33 20 58-2 23-17 34-21 55-5 24-17 44-41 55-21 9-38 22-64 21-27-1-41-13-62-24-22-11-38-27-45-51-7-22-17-38-13-63 3-24 21-37 30-58 10-23 31-37 54-46 12-5 22-11 34-11z';
  return (
    <>
      <defs>
        <radialGradient id={`${id}-wax`} cx="42%" cy="38%" r="70%">
          <stop offset="0" stopColor="#b52a27" />
          <stop offset="0.6" stopColor="#8e1a1a" />
          <stop offset="1" stopColor="#5e0f10" />
        </radialGradient>
        <filter id={`${id}-sit`} x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#3b1a12" floodOpacity="0.35" />
        </filter>
        <clipPath id={`${id}-cut`}>
          <polygon points={MARK_SOURCE.fourBody} transform={f.transform} />
          <polygon points={MARK_SOURCE.fourArm} transform={f.transform} />
        </clipPath>
      </defs>
      <rect width={V} height={V} fill="#efe8de" />
      <path d={blob} fill={`url(#${id}-wax)`} filter={`url(#${id}-sit)`} />
      {/* the die's ring, pressed in */}
      <circle cx="181" cy="182" r="93" fill="none" stroke="#5c0e0f" strokeWidth="3" />
      <circle cx="182.5" cy="183.5" r="93" fill="none" stroke="#c9504a" strokeWidth="1.2" opacity="0.6" />
      <circle cx="181" cy="182" r="91" fill="#86181a" />
      <g transform="translate(1.8 1.8)"><Four f={f} body="#de6b62" arm="#de6b62" /></g>
      <Four f={f} body="#3a0506" arm="#3a0506" />
      <g clipPath={`url(#${id}-cut)`}>
        <g transform="translate(2.8 2.8)"><Four f={f} body="#741315" arm="#741315" /></g>
      </g>
    </>
  );
}

const KINDS = { engrave: Engrave, foil: Foil, screen: Screen, stitch: Stitch, sign: Sign, van: Van, seal: Seal };

export default function Treatment({ kind, className }) {
  const Kind = KINDS[kind];
  if (!Kind) return null;
  return (
    <svg className={className} viewBox={`0 0 ${V} ${V}`} aria-hidden="true" focusable="false">
      <Kind id={`ld-t-${kind}`} />
    </svg>
  );
}
