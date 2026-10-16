/*
 * The C4 mark, trued, and build B ("Stroke"): the mark drawing itself.
 *
 * Caleb's decisions, 17 Oct 2026 ("1. B 2. Yes 3. yeah fix it up"):
 *  1. The build is option B. The 4 is drawn as one stroke and every stroke
 *     shows its true straight end. The stem and the diagonal leave the apex
 *     together, the diagonal turns into the crossbar, the crossbar runs right
 *     through the cut into the green, and the T's stem drops last. The C is
 *     wiped on by a straight front at its top cut's angle (54.3 degrees, the
 *     4's diagonal's), so the wipe arrives on the C's own terminal edge.
 *  2. Nothing round in the build: no iris, no blob, no pivot, no wedge.
 *  3. The 4 is trued to "Cuts 15.81, stem lines up": the stem's right edge
 *     is vertical, its foot rises 7.30 so the channel under it is as wide as
 *     the slanted cut (15.81), and the T's stem is as wide as the upper stem
 *     (68.85), its left edge on x 485.93. The C doesn't change.
 *
 * The reference is the Remotion build in
 * C4-Internal/c4-social/motion/src/unfold/ (options.ts, strokeFrame, and
 * TrueUp.tsx for the trued points). This file is that build on the trued
 * points: the same pieces, the same fronts, the same beats and the same
 * curve, so every frame is the reference's frame. Each stroke is its piece
 * clipped by one straight front lying parallel to the edge the stroke ends
 * on: horizontal for the stems and the diagonal, the cut's 56.3 degrees for
 * the crossbar. A frame is a list of straight-edged polygons, nothing else.
 *
 * Seams. The reference covers each seam between two same-colour pieces with
 * a 1-unit line, which is enough at its 1080-pixel size and nowhere near a
 * pixel at the nav's. Here each colour is drawn as ONE path whose subpaths
 * are the pieces, all wound the same way, so a shared edge is crossed twice
 * in opposite directions and cancels in the rasteriser. No seam can show at
 * any size, and the finished frame covers exactly what BODY and ARM cover.
 *
 * Units are MARK_SOURCE's (C4Logo.jsx), the logo file's own. LOCKUP_MATRIX
 * takes them into the lockup's FULL_UPRIGHT units.
 *
 * Used by C4Logo.jsx (the nav and footer hover build). index.html's boot
 * overlay draws the same build in CSS, and c4-footer-credit/C4FooterCredit.jsx
 * (the master copy client sites take) carries its own copy of this file's
 * logic so it stays one file. Change the three together.
 */

/* ── the trued mark ────────────────────────────────────────────────── */

export const MARK_BODY = [
  [554.78, 94.43], [554.78, 292.91], [485.93, 292.91], [485.93, 177.58], [395.65, 308.72],
  [485.93, 308.72], [453.55, 357.3], [304.78, 357.3], [304.78, 323.95], [470.27, 94.43],
];
export const MARK_ARM = [
  [639.36, 308.72], [606.98, 357.3], [554.78, 357.3], [554.78, 469.58],
  [485.93, 469.58], [485.93, 357.3], [472.55, 357.3], [504.93, 308.72],
];
export const MARK_C =
  'M393.33,381.58l46.14.22c-37.51,42.67-88.07,71.58-143.72,82.18-89.37,18.53-180.59-21.95-227.2-100.84-38.21-64.03-30.59-145.6,18.81-201.36,33.03-37.88,79.33-61.47,129.25-65.83,54.95-7.69,110.91-3.19,163.94,13.2l-37.35,52.04c-31.06-6.51-62.95-8.01-94.47-4.41-43.91,2.38-84.08,25.62-108.21,62.59-14,27.78-16.89,59.9-8.08,89.75,13.18,47.07,49.8,83.83,96.63,97.01,55.92,11.27,114.01,2.59,164.26-24.56Z';

/* MARK_SOURCE units to FULL_UPRIGHT units: one uniform scale and a shift,
   least-squares fitted to the 18 corners the two copies share (worst
   residual 0.0073, which is their two-decimal rounding). */
export const LOCKUP_MATRIX = 'matrix(0.4757183 0 0 0.4757183 39.958331 258.997324)';

/* ── the beats (seconds) and the curve ─────────────────────────────── */

export const BUILD = {
  c: [0, 0.48],
  stem: [0.08, 0.4],
  diagonal: [0.08, 0.52],
  bar: [0.43, 0.77],
  tee: [0.68, 0.96],
  end: 0.96,
};
/* The word's first letter is knocked when the crossbar lands on the T's
   right end: at 0.74 s the bar is 99.6% of the way there. */
export const IMPACT_AT = 0.74;
/* Reduced motion: the finished mark fades in over 0.2 s on the site's ease. */
export const REDUCED_FADE = 0.2;

/* CSS cubic-bezier(), exactly, so GSAP and the boot's CSS run one curve. */
export const cubicBezier = (x1, y1, x2, y2) => {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  const solve = (x) => {
    let t = x;
    for (let k = 0; k < 8; k++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-7) return t;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    for (let k = 0; k < 60; k++) {
      const v = sx(t);
      if (Math.abs(v - x) < 1e-7) break;
      if (x > v) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return t;
  };
  return (x) => (x <= 0 ? 0 : x >= 1 ? 1 : sy(solve(x)));
};

/* pen: leaves its start smoothly and lands slowly, so the overlapping
   strokes read as one hand. site: the house arrival (DESIGN.md). */
export const PEN_CSS = 'cubic-bezier(0.4, 0, 0.18, 1)';
export const SITE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const pen = cubicBezier(0.4, 0, 0.18, 1);
export const site = cubicBezier(0.22, 1, 0.36, 1);

/* ── geometry helpers ──────────────────────────────────────────────── */

const span = (t, a, b) => (t <= a ? 0 : t >= b ? 1 : (t - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
/* the unit normal to a direction, pointing right (positive x) */
const rightNormal = (d) => {
  const l = Math.hypot(d[0], d[1]);
  const n = [d[1] / l, -d[0] / l];
  return n[0] >= 0 ? n : [-n[0], -n[1]];
};

/* Keep the part of a polygon where a*x + b*y <= c (Sutherland-Hodgman, one
   plane). The result keeps the input's winding. */
export const clip = (poly, a, b, c) => {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const fp = a * p[0] + b * p[1] - c;
    const fq = a * q[0] + b * q[1] - c;
    if (fp <= 0) out.push(p);
    if ((fp <= 0) !== (fq <= 0)) {
      const t = fp / (fp - fq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  }
  return out;
};

/* The C flattened to a dense polygon, only to find how far its straight
   wipe has to travel. The C itself is always drawn from MARK_C. */
const flattenC = (d, perCubic) => {
  const tk = d.match(/[MlcZ]|-?(?:\d+\.?\d*|\.\d+)/g);
  const out = [];
  let i = 0;
  let cmd = '';
  let x = 0;
  let y = 0;
  const num = () => Number(tk[i++]);
  while (i < tk.length) {
    if (/[MlcZ]/.test(tk[i])) cmd = tk[i++];
    if (cmd === 'Z') continue;
    if (cmd === 'M') { x = num(); y = num(); out.push([x, y]); cmd = 'l'; }
    else if (cmd === 'l') { x += num(); y += num(); out.push([x, y]); }
    else if (cmd === 'c') {
      const x1 = x + num(); const y1 = y + num();
      const x2 = x + num(); const y2 = y + num();
      const x3 = x + num(); const y3 = y + num();
      for (let s = 1; s <= perCubic; s++) {
        const t = s / perCubic;
        const u = 1 - t;
        out.push([
          u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
          u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
        ]);
      }
      x = x3;
      y = y3;
    }
  }
  return out;
};

/* ── the pieces ────────────────────────────────────────────────────── */

const B3 = [485.93, 177.58]; // top of the counter
const B4 = [395.65, 308.72]; // counter floor, left
const B9 = [470.27, 94.43]; // the apex
const CUT_DIR = [-32.38, 48.58]; // both cuts and the T's right end, 56.3 deg
const C_TOP_DIR = [-37.35, 52.04]; // the C's top cut, 54.3 deg
/* where a line at the cut's angle from the counter's corner meets the foot:
   the diagonal ends on it and the crossbar starts from it */
const Q = [B4[0] + CUT_DIR[0], 357.3];

/* All five are wound the same way (clockwise on screen), so the edges two
   pieces share are crossed in opposite directions. Their union is BODY and
   ARM exactly. */
export const PIECES = {
  stem: [[485.93, 94.43], [554.78, 94.43], [554.78, 292.91], [485.93, 292.91]],
  diagonal: [B9, [485.93, 94.43], B3, B4, Q, [304.78, 357.3], [304.78, 323.95]],
  crossRed: [B4, [485.93, 308.72], [453.55, 357.3], Q],
  crossGreen: [[504.93, 308.72], [639.36, 308.72], [606.98, 357.3], [472.55, 357.3]],
  stemGreen: [[485.93, 357.3], [554.78, 357.3], [554.78, 469.58], [485.93, 469.58]],
};

const TOP = 94.43;
const STEM_FOOT = 292.91;
const FOOT = 357.3;
const T_FOOT = 469.58;
const N_CUT = rightNormal(CUT_DIR);
const N_C = rightNormal(C_TOP_DIR);
const U_SEAM = dot(B4, N_CUT); // the foot's slanted end
const U_END = dot([639.36, 308.72], N_CUT); // the T's right end
const C_FLAT = flattenC(MARK_C, 64);
const CW = C_FLAT.map((p) => dot(p, N_C));
const CW0 = Math.min(...CW);
const CW1 = Math.max(...CW);
/* a box round the C for its wipe to cut down */
const C_BOX = [[30, 80], [460, 80], [460, 480], [30, 480]];

/* ── a frame ───────────────────────────────────────────────────────── */

/* The build at t seconds. c: 'none', 'rest' (the whole C, drawn from
   MARK_C), or the polygon its wipe has uncovered so far, to clip MARK_C
   with. red and green: the polygons drawn so far, one subpath each. */
export function buildFrame(t) {
  const e = (beat) => pen(span(t, beat[0], beat[1]));
  const ec = e(BUILD.c);
  const es = e(BUILD.stem);
  const ed = e(BUILD.diagonal);
  const ex = e(BUILD.bar);
  const et = e(BUILD.tee);

  let c;
  if (ec <= 0) c = 'none';
  else if (ec >= 1) c = 'rest';
  else c = clip(C_BOX, N_C[0], N_C[1], lerp(CW0, CW1, ec));

  const yS = lerp(TOP, STEM_FOOT, es);
  const yD = lerp(TOP, FOOT, ed);
  const uX = lerp(U_SEAM, U_END, ex);
  const yT = lerp(FOOT, T_FOOT, et);
  const red = [];
  const green = [];
  const add = (list, poly) => { if (poly.length >= 3) list.push(poly); };
  if (es > 0) add(red, clip(PIECES.stem, 0, 1, yS));
  if (ed > 0) add(red, clip(PIECES.diagonal, 0, 1, yD));
  if (ex > 0) add(red, clip(PIECES.crossRed, N_CUT[0], N_CUT[1], uX));
  if (ex > 0) add(green, clip(PIECES.crossGreen, N_CUT[0], N_CUT[1], uX));
  if (et > 0) add(green, clip(PIECES.stemGreen, 0, 1, yT));
  return { c, red, green, done: t >= BUILD.end };
}

const f3 = (v) => String(Math.round(v * 1000) / 1000);
/* polygons as one path's subpaths */
export const pathOf = (polys) =>
  polys.map((p) => `M${p.map((q) => `${f3(q[0])} ${f3(q[1])}`).join('L')}Z`).join('');
export const pointsOf = (poly) => poly.map((q) => `${f3(q[0])},${f3(q[1])}`).join(' ');

/* Draw frame t into three elements: the polygon inside the C's clipPath,
   and the red and green paths. Any of them may be missing. */
export function drawBuildFrame(t, { cClip, red, green }) {
  const f = buildFrame(t);
  if (cClip) {
    const pts = f.c === 'none' ? '' : f.c === 'rest' ? pointsOf(C_BOX) : pointsOf(f.c);
    if (cClip.getAttribute('points') !== pts) cClip.setAttribute('points', pts);
  }
  if (red) red.setAttribute('d', pathOf(f.red));
  if (green) green.setAttribute('d', pathOf(f.green));
  return f;
}

/* For the checks in scripts and tests: the constants the boot's CSS uses. */
export const BUILD_FACTS = {
  N_CUT, N_C, U_SEAM, U_END, CW0, CW1,
  /* how far each front travels, as a translation of a straight-edged ink */
  stemTravel: STEM_FOOT - TOP,
  diagonalTravel: FOOT - TOP,
  teeTravel: T_FOOT - FOOT,
  barTravelX: (U_END - U_SEAM) / N_CUT[0],
  cTravelX: (CW1 - CW0) / N_C[0],
};
