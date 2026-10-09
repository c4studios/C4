/*
 * The C4 Studios mark, as /logo-design draws it.
 *
 * Every shape here is the real logo. MARK_SOURCE, FULL_UPRIGHT and
 * LOCKUP_TRANSFORM are copied number for number from
 * src/components/c4/C4Logo.jsx (the nav and footer logo), which doesn't
 * export them; src/components/welcome/C4Mark.jsx lifts MARK_SOURCE the same
 * way. MARK_SOURCE also matches source-logo-svg/"original logo -
 * transparent.svg" point for point. If the logo is ever redrawn, change it
 * in C4Logo.jsx first and copy it here.
 *
 * The word "Studios" is imported, not copied, from the wordmark's own source.
 *
 * Colours:
 *  - DEEP: the lockup's red and green (C4Logo.jsx COLOURS.colour, the source
 *    SVGs, and the printed card, per the comment in welcome/C4Mark.jsx).
 *    public/favicon.png is the 4 alone in this pair, with no C.
 *  - SCREEN: the brighter pair on the profile picture (brain work_log 602,
 *    7 Oct 2026: "#da2527, #248b2f, #f3f2f3 as on the current avatar").
 *  - The C is #F3F2F3 in both.
 *
 * The boxes below were measured with getBBox in Chromium on 9 Oct 2026
 * (scratchpad geometry-facts.mjs). The facts the page states are worked out
 * from the points themselves in FACTS, so the copy can't drift from the
 * drawing.
 */
import { C4_WORDMARK_UPRIGHT_PATHS } from '@/components/c4/c4WordmarkMorphSource';

/* C4Logo.jsx, MARK_SOURCE */
export const MARK_SOURCE = {
  fourBody: '554.78 94.43 554.76 300.21 485.93 300.21 485.93 177.58 395.65 308.72 485.93 308.72 453.55 357.3 304.78 357.3 304.78 323.95 470.27 94.43 554.78 94.43',
  fourArm: '639.36 308.72 606.98 357.3 554.78 357.3 554.78 469.58 503.71 469.58 503.71 357.3 472.55 357.3 504.93 308.72 639.36 308.72',
  cArc: 'M393.33,381.58l46.14.22c-37.51,42.67-88.07,71.58-143.72,82.18-89.37,18.53-180.59-21.95-227.2-100.84-38.21-64.03-30.59-145.6,18.81-201.36,33.03-37.88,79.33-61.47,129.25-65.83,54.95-7.69,110.91-3.19,163.94,13.2l-37.35,52.04c-31.06-6.51-62.95-8.01-94.47-4.41-43.91,2.38-84.08,25.62-108.21,62.59-14,27.78-16.89,59.9-8.08,89.75,13.18,47.07,49.8,83.83,96.63,97.01,55.92,11.27,114.01,2.59,164.26-24.56Z',
};

/* C4Logo.jsx, FULL_UPRIGHT: the same mark at the lockup's scale */
export const FULL_UPRIGHT = {
  fourBody: '303.88 303.92 303.87 401.82 271.12 401.82 271.12 343.47 228.18 405.86 271.12 405.86 255.72 428.97 184.95 428.97 184.95 413.1 263.67 303.92 303.88 303.92',
  fourArm: '344.11 405.86 328.71 428.97 303.88 428.97 303.88 482.39 279.58 482.39 279.58 428.97 264.76 428.97 280.17 405.86 344.11 405.86',
  cArc: 'M227.07,440.52l21.95.11c-17.85,20.3-41.9,34.05-68.37,39.1-42.51,8.81-85.9-10.45-108.08-47.97-18.17-30.46-14.55-69.27,8.95-95.79,15.71-18.02,37.74-29.24,61.48-31.32,26.14-3.66,52.76-1.51,77.99,6.28l-17.77,24.76c-14.77-3.1-29.94-3.81-44.94-2.11-20.89,1.13-40,12.19-51.48,29.78-6.66,13.21-8.03,28.49-3.84,42.69,6.27,22.39,23.69,39.88,45.96,46.15,26.61,5.37,54.24,1.23,78.14-11.68Z',
};

/* C4Logo.jsx: the full lockup's viewBox and the transform it draws through */
export const FULL_VIEWBOX = [50, 100, 880, 400];
export const LOCKUP_SCALE = 1.5; // LOCKUP_TRANSFORM = 'translate(18 -273) scale(1.5)'
export const NAV_LOGO_SIZE = 48; // NavHeader.jsx: <C4Logo size={48} variant="full" />

export const STUDIOS = C4_WORDMARK_UPRIGHT_PATHS;

export const DEEP = { red: '#A30000', green: '#22632F', c: '#F3F2F3' };
export const SCREEN = { red: '#DA2527', green: '#248B2F', c: '#F3F2F3' };

/* Measured boxes, in each shape's own units */
export const BOX = {
  mark: { x: 44.36, y: 92.3, w: 595, h: 377.28 },  // C left to the T's right; C top to the T's foot
  four: { x: 304.78, y: 94.43, w: 334.58, h: 375.15 },
  c: { x: 44.36, y: 92.3, w: 395.11, h: 376.13 },
  body: { x: 304.78, y: 94.43, w: 250, h: 262.87 },
  arm: { x: 472.55, y: 308.72, w: 166.81, h: 160.86 },
  /* the upright lockup, in FULL_UPRIGHT units: C to the end of "Studios" */
  lockup: { x: 61.06, y: 302.92, w: 527.27, h: 179.47 },
  lockupT: { x: 264.76, y: 405.86, w: 79.35, h: 76.53 },
  studios: { x: 347.12, y: 404.79, w: 241.21, h: 77.58 },
};

/* The loading screen (index.html): the mark at width clamp(84px, 8vw, 108px)
   in a 636-unit viewBox, so its drawn height is width x 377.28 / 636. */
export const bootMarkHeight = (vw) => Math.min(108, Math.max(84, vw * 0.08)) * (BOX.mark.h / 636);

/* The nav logo: C4Logo full at size 48 draws the mark (C to T, in lockup
   units 302.92 to 482.39, times 1.5) in a 400-unit-high viewBox. */
export const NAV_MARK_HEIGHT = ((482.39 - 302.92) * LOCKUP_SCALE / FULL_VIEWBOX[3]) * NAV_LOGO_SIZE;

/* ── facts worked out from the points ─────────────────────────────── */

const pts = (s) => {
  const n = s.trim().split(/\s+/).map(Number);
  const out = [];
  for (let i = 0; i < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
};
const BODY = pts(MARK_SOURCE.fourBody);
const ARM = pts(MARK_SOURCE.fourArm);
/* how far an edge leans from the horizontal, in degrees, 0 to 90 */
const lean = (a, b) => {
  const d = Math.abs((Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI) % 180;
  return d > 90 ? 180 - d : d;
};
/* the C's top cut is its second straight: l-37.35,52.04 */
const C_TOP_CUT = lean([0, 0], [-37.35, 52.04]);
const SLANTS = [
  lean(BODY[9], BODY[8]), // the 4's diagonal, outside edge
  lean(BODY[3], BODY[4]), // the 4's diagonal, inside edge
  lean(BODY[5], BODY[6]), // the red crossbar's cut end
  lean(ARM[7], ARM[6]),   // the green crossbar's cut ends
  lean(ARM[0], ARM[1]),
  C_TOP_CUT,
];

const markScale16 = 16 / Math.max(BOX.mark.w, BOX.mark.h);
const fourScale16 = 16 / Math.max(BOX.four.w, BOX.four.h);

/* distance from point p to the line through a and b */
const offLine = (p, a, b) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / Math.hypot(dx, dy);
};
/* x, the measuring unit on the plate: the width of the green T's stem */
const X = ARM[2][0] - ARM[4][0]; // 554.78 - 503.71 = 51.07
/* the C's top cut runs alongside the 4's diagonal; how far apart, at the
   cut's outer corner (the inner corner gives the same to a tenth) */
const C_TO_FOUR = offLine([380.55, 109.15], BODY[9], BODY[8]); // 64.2
/* the two pieces of the 4: the red crossbar's cut end and the green one run
   parallel, 19 units apart across the bar */
const CUT_GAP = offLine(ARM[7], BODY[5], BODY[6]); // 15.8

export const FACTS = {
  shapes: 3,
  fourEdges: BODY.length - 1 + ARM.length - 1, // 18, all straight
  slantLow: Math.round(Math.min(...SLANTS)),   // 54
  slantHigh: Math.round(Math.max(...SLANTS)),  // 56
  /* in a 16-pixel square: how tall the 4 is with the C beside it, and alone */
  fourTallWithC: Math.round(BOX.four.h * markScale16),  // 10
  fourTallAlone: Math.round(BOX.four.h * fourScale16),  // 16
  /* the green T's stem, the unit for clear space, in lockup units */
  tStem: 303.88 - 279.58,
  /* the gaps, in x */
  cToFour: Math.round((C_TO_FOUR / X) * 100) / 100, // 1.26
  cutGap: Math.round((CUT_GAP / X) * 100) / 100,    // 0.31
};

/* where the plate draws its gap measures, in mark units: from the middle of
   one edge straight across to the edge it runs alongside */
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
export const GAPS = {
  cToFour: { from: mid([380.55, 109.15], [343.2, 161.19]), a: BODY[9], b: BODY[8] },
  cut: { from: mid(ARM[7], ARM[6]), a: BODY[5], b: BODY[6] },
};

/* ── drawing helpers ─────────────────────────────────────────────────
   A shape fitted into a box: returns the transform that puts the given
   source box at (x, y) with the given height. */
export const fit = (box, x, y, h) => {
  const s = h / box.h;
  return { s, w: box.w * s, transform: `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(5)}) translate(${-box.x} ${-box.y})` };
};
