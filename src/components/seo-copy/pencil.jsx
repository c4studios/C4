/*
 * Graphite: the pencil marks on /seo-and-copywriting's board, drawn as paths
 * rather than CSS shapes. A ring is an open loop that overshoots where it
 * started; a wave wanders; a strike bows a little and hooks at the end. Each
 * mark is two passes over the same line at different weights, the way a
 * pencil goes over a mark twice, and the graphite filter roughens the edge
 * and lets the paper show through the stroke.
 *
 * Paths are seeded, so a mark is the same on every render and in the
 * prerendered HTML.
 */

export const GRAPHITE = 'sc-graphite';

/* The filter, once per page. `id` lets the home page's door carry its own. */
export function GraphiteDefs({ id = GRAPHITE }) {
  return (
    <svg className="sc-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter id={id} x="-15%" y="-40%" width="130%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.05" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.62" result="grain" />
          <feComposite in="rough" in2="grain" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

/* A small seeded generator, so marks don't change between renders. */
function rng(seed) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => n.toFixed(1);

/* Catmull-Rom through the points, as cubic Béziers. */
function smooth(p) {
  let d = `M ${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i += 1) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    d += ` C ${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)}, ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)}, ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/* An open loop round a box (x, y, w, h), starting low on the left and
   running on past its start, a little wider each time round. */
export function ringPath(x, y, w, h, seed = 1) {
  const r = rng(seed);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const tilt = ((r() - 0.5) * 8 * Math.PI) / 180;
  const start = ((196 + r() * 18) * Math.PI) / 180;
  const sweep = ((392 + r() * 22) * Math.PI) / 180;
  const n = 26;
  const pts = [];
  for (let i = 0; i <= n; i += 1) {
    const k = i / n;
    const t = start + sweep * k;
    const grow = 1 + k * 0.09 + (r() - 0.5) * 0.05;
    const ex = Math.cos(t) * (w / 2) * grow;
    const ey = Math.sin(t) * (h / 2) * grow;
    pts.push([cx + ex * Math.cos(tilt) - ey * Math.sin(tilt), cy + ex * Math.sin(tilt) + ey * Math.cos(tilt)]);
  }
  return smooth(pts);
}

/* A wandering wave under a line of text, from x0 to x1 at y. */
export function wavePath(x0, x1, y, seed = 1) {
  const r = rng(seed);
  const pts = [];
  const step = 3.4;
  let k = 0;
  for (let x = x0; x <= x1 + 0.1; x += step) {
    const amp = 1.5 + r() * 0.7;
    pts.push([x, y + (k % 2 ? amp : -amp) + (r() - 0.5) * 0.6]);
    k += 1;
  }
  if (pts.length < 2) pts.push([x1, y]);
  return smooth(pts);
}

/* A strike through a line of text: a slight bow, a lift at the end. */
export function strikePath(x0, x1, y, seed = 1) {
  const r = rng(seed);
  const bow = (r() - 0.5) * 2.4;
  const pts = [
    [x0 - 2, y + 0.8],
    [x0 + (x1 - x0) * 0.3, y + bow * 0.6],
    [x0 + (x1 - x0) * 0.7, y + bow],
    [x1 + 2, y - 0.6],
    [x1 + 5, y - 2.6],
  ];
  return smooth(pts);
}

/* One mark: the line twice, heavier then lighter, slightly apart. */
export function Graphite({ d, className = '', style, pass = [0.55, 0.35] }) {
  return (
    <g className={`sc-g ${className}`} style={style}>
      <path d={d} pathLength="1" className="sc-g-main" />
      <path d={d} pathLength="1" className="sc-g-pass" transform={`translate(${pass[0]} ${pass[1]})`} />
    </g>
  );
}
