import React, { useCallback, useId, useMemo, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { C4_WORDMARK_MORPH_PAIRS } from './c4WordmarkData';

gsap.registerPlugin(useGSAP);

/* =================================================================
   CONSTANTS — faithfully preserved from C4Logo.jsx
   ================================================================= */

const SIZES = { small: 28, default: 36, large: 48, xl: 72 };

const FULL_VIEWBOX = '50 100 880 400';
const FULL_ASPECT = 880 / 400;

/* Horizontal shift (as a fraction of the rendered SVG width) that optically
   centres the RESTING C4 mark. The SVG box always reserves the full lockup width
   (mark + "Studios" wordmark), but at rest only the mark shows and it sits
   left-of-centre in that box. Shifting the SVG right by this fraction centres the
   mark; it slides back to 0 as the wordmark expands so the full lockup stays
   centred. Derived from the fixed lockup geometry, so it is size-independent. */
const MARK_CENTER_SHIFT = 0.187;

const LOCKUP_TRANSFORM = 'translate(18 -273) scale(1.5)';

/* Light-footer values; the isDark branch of useFooterColours replaces them.
   NOTE the resting arc is painted with mono.cArc (cBaseRef sits at opacity 1
   from rest), not dormant.cArc — dormant.cArc is unused. Tune mono.cArc to
   change the arc at rest.

   The light tuning comes from Brady Electrical's copy (9 and 10 Sep 2026),
   taken into the master on 17 Oct 2026 after NextGen's light footer showed
   the same fault. On white the C at rest is 8.52:1 and the 4 sits a step back
   at 3.26:1 (body) and 3.98:1 (arm), the way the C leads on dark. The values
   before put the C at 1.27:1 and the 4 at 1.97:1 and 1.71:1, so the mark read
   as a pale smudge and the C all but vanished. (WCAG ratios, recomputed
   17 Oct.) */
const COLOURS = {
  dormant: {
    fourBody: '#8b8f92',
    fourArm: '#7c8083',
    cArc: '#4a4d4f',
  },
  mono: {
    fourBody: '#414243',
    fourArm: '#6c6d6d',
    cArc: '#4a4d4f',
    text: '#1a1a1b',
  },
  colour: {
    fourBody: '#a30000',
    fourArm: '#22632f',
    cArc: '#f3f2f3',
    text: '#1a1a1b',
  },
};

/* The mark at the lockup's scale (C4Logo.jsx FULL_UPRIGHT), trued on
   17 Oct 2026 to "Cuts 15.81, stem lines up" (Caleb): the stem's foot rises
   from y 401.82 to 398.34 and its right edge goes vertical, so the channel
   under the stem is as wide as the slanted cut, and the T's stem widens to
   the upper stem's left edge, x 271.12 (it was 279.58). The C is unchanged. */
const FULL_UPRIGHT = {
  fourBody: '303.88 303.92 303.88 398.34 271.12 398.34 271.12 343.47 228.18 405.86 271.12 405.86 255.72 428.97 184.95 428.97 184.95 413.1 263.67 303.92 303.88 303.92',
  fourArm: '344.11 405.86 328.71 428.97 303.88 428.97 303.88 482.39 271.12 482.39 271.12 428.97 264.76 428.97 280.17 405.86 344.11 405.86',
  cArc: 'M227.07,440.52l21.95.11c-17.85,20.3-41.9,34.05-68.37,39.1-42.51,8.81-85.9-10.45-108.08-47.97-18.17-30.46-14.55-69.27,8.95-95.79,15.71-18.02,37.74-29.24,61.48-31.32,26.14-3.66,52.76-1.51,77.99,6.28l-17.77,24.76c-14.77-3.1-29.94-3.81-44.94-2.11-20.89,1.13-40,12.19-51.48,29.78-6.66,13.21-8.03,28.49-3.84,42.69,6.27,22.39,23.69,39.88,45.96,46.15,26.61,5.37,54.24,1.23,78.14-11.68Z',
};

/* =================================================================
   BUILD B, "STROKE" — a copy of the C4 site's
   src/components/c4/markBuild.js (17 Oct 2026), kept in this file so the
   badge stays one file. Change the two together.

   The C is wiped on by a straight front at its top cut's angle. The 4 is
   drawn as one stroke: the stem and the diagonal leave the apex together,
   the diagonal turns into the crossbar, the crossbar runs right through the
   cut into the green, and the T's stem drops last. Each stroke is its piece
   clipped by one straight front lying parallel to the edge the stroke ends
   on, so every frame is straight-edged polygons with their true ends: no
   iris, no blob, no pivot, no wedge. Each colour is one path whose subpaths
   are the strokes, wound the same way, so no seam shows where two meet.
   Units are the logo file's own (MARK_SOURCE); LOCKUP_MATRIX takes them
   into the lockup's.
   ================================================================= */

const MARK_C =
  'M393.33,381.58l46.14.22c-37.51,42.67-88.07,71.58-143.72,82.18-89.37,18.53-180.59-21.95-227.2-100.84-38.21-64.03-30.59-145.6,18.81-201.36,33.03-37.88,79.33-61.47,129.25-65.83,54.95-7.69,110.91-3.19,163.94,13.2l-37.35,52.04c-31.06-6.51-62.95-8.01-94.47-4.41-43.91,2.38-84.08,25.62-108.21,62.59-14,27.78-16.89,59.9-8.08,89.75,13.18,47.07,49.8,83.83,96.63,97.01,55.92,11.27,114.01,2.59,164.26-24.56Z';
const LOCKUP_MATRIX = 'matrix(0.4757183 0 0 0.4757183 39.958331 258.997324)';

/* the beats, in seconds */
const BUILD = {
  c: [0, 0.48],
  stem: [0.08, 0.4],
  diagonal: [0.08, 0.52],
  bar: [0.43, 0.77],
  tee: [0.68, 0.96],
  end: 0.96,
};
/* the crossbar landing on the T's right end knocks the first letter */
const IMPACT_AT = 0.74;
/* reduced motion: the finished mark fades in over 0.2 s */
const REDUCED_FADE = 0.2;

/* CSS cubic-bezier(), exactly */
const cubicBezier = (x1, y1, x2, y2) => {
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
/* pen: the strokes' curve. site: the C4 site's ease, for hand-overs and fades */
const pen = cubicBezier(0.4, 0, 0.18, 1);
const siteEase = cubicBezier(0.22, 1, 0.36, 1);

const span = (t, a, b) => (t <= a ? 0 : t >= b ? 1 : (t - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const rightNormal = (d) => {
  const l = Math.hypot(d[0], d[1]);
  const n = [d[1] / l, -d[0] / l];
  return n[0] >= 0 ? n : [-n[0], -n[1]];
};
/* the part of a polygon where a*x + b*y <= c (Sutherland-Hodgman) */
const clipPoly = (poly, a, b, c) => {
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
/* the C flattened, only to find how far its wipe travels */
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

const B3 = [485.93, 177.58];
const B4 = [395.65, 308.72];
const B9 = [470.27, 94.43];
const CUT_DIR = [-32.38, 48.58];
const Q = [B4[0] + CUT_DIR[0], 357.3];
/* the five strokes' pieces, all wound clockwise on screen; their union is the 4 */
const PIECES = {
  stem: [[485.93, 94.43], [554.78, 94.43], [554.78, 292.91], [485.93, 292.91]],
  diagonal: [B9, [485.93, 94.43], B3, B4, Q, [304.78, 357.3], [304.78, 323.95]],
  crossRed: [B4, [485.93, 308.72], [453.55, 357.3], Q],
  crossGreen: [[504.93, 308.72], [639.36, 308.72], [606.98, 357.3], [472.55, 357.3]],
  stemGreen: [[485.93, 357.3], [554.78, 357.3], [554.78, 469.58], [485.93, 469.58]],
};
const N_CUT = rightNormal(CUT_DIR);
const N_C = rightNormal([-37.35, 52.04]);
const U_SEAM = dot(B4, N_CUT);
const U_END = dot([639.36, 308.72], N_CUT);
const C_WIDTHS = flattenC(MARK_C, 64).map((p) => dot(p, N_C));
const CW0 = Math.min(...C_WIDTHS);
const CW1 = Math.max(...C_WIDTHS);
const C_BOX = [[30, 80], [460, 80], [460, 480], [30, 480]];

const f3 = (v) => String(Math.round(v * 1000) / 1000);
const pathOf = (polys) => polys.map((p) => `M${p.map((q) => `${f3(q[0])} ${f3(q[1])}`).join('L')}Z`).join('');
const pointsOf = (poly) => poly.map((q) => `${f3(q[0])},${f3(q[1])}`).join(' ');

/* draw the build at t seconds into the C's clip polygon and the two paths */
function drawBuildFrame(t, { cClip, red, green }) {
  const e = (beat) => pen(span(t, beat[0], beat[1]));
  const ec = e(BUILD.c);
  const es = e(BUILD.stem);
  const ed = e(BUILD.diagonal);
  const ex = e(BUILD.bar);
  const et = e(BUILD.tee);
  if (cClip) {
    let pts = '';
    if (ec >= 1) pts = pointsOf(C_BOX);
    else if (ec > 0) pts = pointsOf(clipPoly(C_BOX, N_C[0], N_C[1], lerp(CW0, CW1, ec)));
    if (cClip.getAttribute('points') !== pts) cClip.setAttribute('points', pts);
  }
  const reds = [];
  const greens = [];
  const add = (list, poly) => { if (poly.length >= 3) list.push(poly); };
  const uX = lerp(U_SEAM, U_END, ex);
  if (es > 0) add(reds, clipPoly(PIECES.stem, 0, 1, lerp(94.43, 292.91, es)));
  if (ed > 0) add(reds, clipPoly(PIECES.diagonal, 0, 1, lerp(94.43, 357.3, ed)));
  if (ex > 0) add(reds, clipPoly(PIECES.crossRed, N_CUT[0], N_CUT[1], uX));
  if (ex > 0) add(greens, clipPoly(PIECES.crossGreen, N_CUT[0], N_CUT[1], uX));
  if (et > 0) add(greens, clipPoly(PIECES.stemGreen, 0, 1, lerp(357.3, 469.58, et)));
  if (red) red.setAttribute('d', pathOf(reds));
  if (green) green.setAttribute('d', pathOf(greens));
}

const TENSION_DURATION = 0.035;

const LETTER_SPRINGS = [
  { peakAngle: -18.0, dampingRatio: 0.26, naturalFreq: 13.0, totalDuration: 0.95, tensionAngle: 2.5 },
  { peakAngle: -14.0, dampingRatio: 0.27, naturalFreq: 13.5, totalDuration: 0.82, tensionAngle: 2.0 },
  { peakAngle: -10.5, dampingRatio: 0.28, naturalFreq: 14.0, totalDuration: 0.70, tensionAngle: 1.5 },
  { peakAngle: -7.5,  dampingRatio: 0.29, naturalFreq: 14.5, totalDuration: 0.60, tensionAngle: 1.1 },
  { peakAngle: -5.0,  dampingRatio: 0.30, naturalFreq: 15.0, totalDuration: 0.50, tensionAngle: 0.8 },
  { peakAngle: -3.2,  dampingRatio: 0.31, naturalFreq: 15.5, totalDuration: 0.42, tensionAngle: 0.5 },
  { peakAngle: -2.0,  dampingRatio: 0.32, naturalFreq: 16.0, totalDuration: 0.35, tensionAngle: 0.3 },
];

/* =================================================================
   SPRING TRAJECTORY CALCULATOR — exact reproduction
   ================================================================= */

function computeSpringTrajectory(spring) {
  const { peakAngle, dampingRatio, naturalFreq, totalDuration, tensionAngle } = spring;
  const wd = naturalFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
  const zetaOmega = dampingRatio * naturalFreq;

  const alpha = Math.atan2(wd, zetaOmega);
  const tPeakSpring = alpha / wd;
  const peakDecay = Math.exp(-zetaOmega * tPeakSpring);
  let impulseV = peakAngle * wd / (peakDecay * Math.sin(alpha));

  let B2 = (impulseV + zetaOmega * tensionAngle) / wd;
  let actualPeak = 0;
  for (let s = 0; s <= 500; s++) {
    const t = (s / 500) * tPeakSpring * 2.5;
    const d = Math.exp(-zetaOmega * t);
    const val = d * (tensionAngle * Math.cos(wd * t) + B2 * Math.sin(wd * t));
    if (val < actualPeak) actualPeak = val;
  }
  if (Math.abs(actualPeak) > 0.1) {
    impulseV *= peakAngle / actualPeak;
    B2 = (impulseV + zetaOmega * tensionAngle) / wd;
  }

  const numRaw = Math.max(30, Math.round(totalDuration * 60));
  const stepDur = totalDuration / numRaw;
  const allRotations = [];

  for (let i = 0; i <= numRaw; i++) {
    const t = i * stepDur;
    let rotation;
    if (t <= TENSION_DURATION) {
      const frac = t / TENSION_DURATION;
      rotation = tensionAngle * (1 - (1 - frac) * (1 - frac));
    } else {
      const springT = t - TENSION_DURATION;
      const decay = Math.exp(-zetaOmega * springT);
      rotation = decay * (tensionAngle * Math.cos(wd * springT) + B2 * Math.sin(wd * springT));
    }
    allRotations.push(rotation);
  }

  const resolveThreshold = Math.max(0.4, Math.abs(peakAngle) * 0.12);
  let resolveIdx = numRaw;
  for (let i = Math.floor(numRaw * 0.4); i <= numRaw; i++) {
    if (Math.abs(allRotations[i]) < 0.3) {
      let maxAfter = 0;
      for (let j = i; j <= numRaw; j++) {
        if (Math.abs(allRotations[j]) > maxAfter) maxAfter = Math.abs(allRotations[j]);
      }
      if (maxAfter < resolveThreshold) {
        resolveIdx = i;
        break;
      }
    }
  }

  const keyframes = [];
  for (let i = 0; i <= resolveIdx; i++) {
    keyframes.push({ rotation: allRotations[i] });
  }
  keyframes[resolveIdx].rotation = 0;

  const resolveDuration = resolveIdx * stepDur;
  return { keyframes, stepDur, numKeyframes: resolveIdx, tPeak: TENSION_DURATION + tPeakSpring, resolveDuration };
}

/* =================================================================
   UTILITY FUNCTIONS
   ================================================================= */

function hingeTranslationY(rotationDeg, hingeHeightRatio) {
  const rad = (rotationDeg * Math.PI) / 180;
  return hingeHeightRatio * (1 - Math.cos(rad)) * 0.50;
}

function computeImpactChain(baseImpactAt) {
  const times = [baseImpactAt];
  for (let i = 1; i < LETTER_SPRINGS.length; i++) {
    const prev = LETTER_SPRINGS[i - 1];
    const wd = prev.naturalFreq * Math.sqrt(1 - prev.dampingRatio * prev.dampingRatio);
    const prevAlpha = Math.atan2(wd, prev.dampingRatio * prev.naturalFreq);
    const prevToPeak = TENSION_DURATION + prevAlpha / wd;
    times.push(times[i - 1] + prevToPeak * 0.68);
  }
  return times;
}

function parseOriginPair(origin) {
  const [x = '0%', y = '100%'] = origin.split(' ');
  return {
    x: Number.parseFloat(x) / 100,
    y: Number.parseFloat(y) / 100,
  };
}

function getFixedLetterHinge(letterNode, hingeOrigin) {
  const box = letterNode.getBBox();
  const { x, y } = parseOriginPair(hingeOrigin);
  return {
    x: box.x + (box.width * x),
    y: box.y + (box.height * y),
  };
}

/* =================================================================
   INTERNAL HOOKS — replaces site-wide ThemeContext dependency
   ================================================================= */

/* A computed background colour as sRGB 0 to 255, or null when it's
   transparent or can't be read. Browsers report legacy colours as rgb(), but
   a colour set in a newer space comes back in that space: oklch(), lab(),
   color(). Tailwind v4's whole palette is oklch. So anything that isn't rgb()
   is painted onto a 1 x 1 canvas and read back as sRGB.
   Before 17 Oct 2026 only rgb() was read. An oklch footer was skipped as if
   it were transparent, the badge fell back to the visitor's OS theme, and
   "Studios" came out near-black on a dark footer (brain site_issues 177). */
let colourProbe;

function parseCssColour(value) {
  if (!value || value === 'transparent') return null;

  const legacy = value.match(/^rgba?\(([^)]+)\)$/i);
  if (legacy) {
    const [r, g, b, a = 1] = legacy[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map((part) => Number.parseFloat(part));

    if (![r, g, b].every(Number.isFinite) || !Number.isFinite(a) || a === 0) {
      return null;
    }

    return { r, g, b };
  }

  if (typeof document === 'undefined') return null;
  if (typeof CSS !== 'undefined' && CSS.supports && !CSS.supports('color', value)) return null;

  try {
    if (colourProbe === undefined) {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      colourProbe = canvas.getContext('2d', { willReadFrequently: true }) || null;
    }
    if (!colourProbe) return null;

    colourProbe.clearRect(0, 0, 1, 1);
    /* a value the canvas can't take leaves fillStyle as it was, so start
       from transparent: an unreadable colour then reads as no colour */
    colourProbe.fillStyle = 'rgba(0, 0, 0, 0)';
    colourProbe.fillStyle = value;
    colourProbe.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = colourProbe.getImageData(0, 0, 1, 1).data;
    if (a === 0) return null;

    return { r, g, b };
  } catch {
    return null;
  }
}

function isDarkBackground(element) {
  if (typeof window === 'undefined') return true;

  let node = element?.parentElement || document.body;
  while (node && node !== document.documentElement) {
    const rgb = parseCssColour(window.getComputedStyle(node).backgroundColor);
    if (rgb) {
      const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
      return luminance < 0.45;
    }
    node = node.parentElement;
  }

  const bodyRgb = parseCssColour(window.getComputedStyle(document.body).backgroundColor);
  if (bodyRgb) {
    const luminance = (0.2126 * bodyRgb.r + 0.7152 * bodyRgb.g + 0.0722 * bodyRgb.b) / 255;
    return luminance < 0.45;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function useFooterColours(colorScheme, rootRef) {
  const [isDark, setIsDark] = useState(() => {
    if (colorScheme === 'light') return false;
    if (colorScheme === 'dark') return true;
    return true;
  });

  useEffect(() => {
    if (colorScheme !== 'auto') {
      setIsDark(colorScheme === 'dark');
      return;
    }

    if (typeof window === 'undefined') return;

    const update = () => setIsDark(isDarkBackground(rootRef.current));
    update();

    window.addEventListener('resize', update);

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
      subtree: true,
    });

    return () => {
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, [colorScheme, rootRef]);

  return useMemo(() => {
    const dormant = { ...COLOURS.dormant };
    const mono = { ...COLOURS.mono };
    const colour = { ...COLOURS.colour };

    if (isDark) {
      dormant.fourBody = '#606264';
      dormant.fourArm = '#707274';
      dormant.cArc = '#d0cecc';
      mono.fourBody = '#9a9b9c';
      mono.fourArm = '#8a8b8c';
      mono.cArc = '#d0cecc';
      mono.text = '#e8e6e3';
    } else {
      // The near-white colour-state arc is 1.12:1 on white, so hovering used
      // to delete the C and leave "4 Studios". Hold the arc dark (9.38:1); the
      // red and green 4 still leads the colour state.
      colour.cArc = '#43474a';
    }

    // The soft #555 bubble behind the mark reads as a glow on a dark footer and
    // as a dirty smudge on a light one, where it sits behind the C and eats the
    // local contrast that makes the letterform legible. Dark only.
    return { dormant, mono, colour, haze: isDark ? 0.15 : 0 };
  }, [isDark]);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/* =================================================================
   SUB-COMPONENTS
   ================================================================= */

function MorphWordPaths({ pairs, fill, refs }) {
  return (
    <>
      {pairs.map((pair, index) => (
        <path
          key={`${pair.letter}-${index}`}
          d={pair.normalized.normalizedPaths?.uprightPath || pair.raw.uprightPath}
          fill={fill}
          ref={(node) => {
            refs.current[index] = node;
          }}
        />
      ))}
    </>
  );
}

/* =================================================================
   COMPONENT
   ================================================================= */

/**
 * C4FooterCredit — Portable animated C4 Studios footer-credit badge.
 *
 * Preserves the full 3-stage GSAP animation from the C4 Studios site:
 *   Stage 0 (dormant) → Stage 1 (mono) → Stage 2 (colour) → Stage 0
 * Stage 2 is build B, "Stroke" (17 Oct 2026), on the trued mark.
 *
 * @param {Object}  props
 * @param {string}  [props.href='https://c4studios.com.au']  Link destination
 * @param {string}  [props.label='Designed by C4 Studios'] Credit text / aria-label
 * @param {number|string} [props.size=36]  Height in px or named size (small|default|large|xl)
 * @param {string}  [props.className='']   Additional classes on the root <a>
 * @param {boolean} [props.openInNewTab=true]  Open link in new tab
 * @param {boolean} [props.showText=true]  Show credit text below logo
 * @param {string}  [props.colorScheme='auto']  'dark' | 'light' | 'auto'
 */
export default function C4FooterCredit({
  href = 'https://c4studios.com.au',
  label = 'Designed by C4 Studios',
  size = 36,
  className = '',
  openInNewTab = true,
  showText = true,
  colorScheme = 'auto',
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  /* Drives the resting→expanded centring slide (see MARK_CENTER_SHIFT). */
  const [expanded, setExpanded] = useState(false);

  const rootRef = useRef(null);
  const monoTlRef = useRef(null);
  const colourTlRef = useRef(null);
  const dormantTlRef = useRef(null);
  const stageRef = useRef(0);
  const inFlightTlRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchConsumedRef = useRef(false);

  /* Element refs */
  const cBaseRef = useRef(null);
  const bodyDormantRef = useRef(null);
  const armDormantRef = useRef(null);
  const bodyBaseRef = useRef(null);
  const armBaseRef = useRef(null);
  const bodySealRef = useRef(null);
  const armSealRef = useRef(null);
  const cSealRef = useRef(null);
  /* build B: the C's wipe (the polygon inside its clipPath) and the 4's two
     colours, each one path whose subpaths are the strokes so far */
  const cBuildRef = useRef(null);
  const buildRef = useRef(null);
  const cWipeRef = useRef(null);
  const buildRedRef = useRef(null);
  const buildGreenRef = useRef(null);
  const morphLetterRefs = useRef([]);
  const wordGroupRef = useRef(null);
  const backdropRef = useRef(null);

  const h = typeof size === 'number' ? size : (SIZES[size] || SIZES.default);
  const { dormant, mono, colour, haze } = useFooterColours(colorScheme, rootRef);
  const uid = useId();

  const w = Math.round(h * FULL_ASPECT);
  const restShift = expanded ? 0 : w * MARK_CENTER_SHIFT;

  const cWipeId = `c4-c-wipe-${uid}`;
  const cPresenceId = `c4-c-presence-${uid}`;
  const backdropBlurId = `c4-backdrop-blur-${uid}`;

  /* =================================================================
     INITIALISATION — set dormant state, pre-compute, build timelines
     ================================================================= */

  useGSAP(() => {
    if (monoTlRef.current) { monoTlRef.current.kill(); monoTlRef.current = null; }
    if (colourTlRef.current) { colourTlRef.current.kill(); colourTlRef.current = null; }
    if (dormantTlRef.current) { dormantTlRef.current.kill(); dormantTlRef.current = null; }
    stageRef.current = 0;

    const wordLetters = morphLetterRefs.current.filter(Boolean);
    const impactTimes = computeImpactChain(IMPACT_AT);
    const buildEls = { cClip: cWipeRef.current, red: buildRedRef.current, green: buildGreenRef.current };

    /* -- Set dormant initial state -- */

    gsap.set(cBaseRef.current, { opacity: 1 });
    gsap.set(bodyDormantRef.current, { opacity: 1 });
    gsap.set(armDormantRef.current, { opacity: 1 });

    gsap.set(bodyBaseRef.current, { opacity: 0 });
    gsap.set(armBaseRef.current, { opacity: 0 });

    gsap.set(cSealRef.current, { opacity: 0 });
    gsap.set(bodySealRef.current, { opacity: 0 });
    gsap.set(armSealRef.current, { opacity: 0 });

    gsap.set([cBuildRef.current, buildRef.current], { autoAlpha: 0 });
    drawBuildFrame(0, buildEls);

    gsap.set(wordLetters, { x: 0, y: 0, opacity: 0, rotation: 0, scaleY: 1, force3D: false });
    wordLetters.forEach((letter, index) => {
      const pair = C4_WORDMARK_MORPH_PAIRS[index];
      const uprightPath = pair.normalized.normalizedPaths?.uprightPath || pair.raw.uprightPath;
      const hinge = getFixedLetterHinge(letter, pair.hingeOrigin || '7% 98%');
      gsap.set(letter, {
        attr: { d: uprightPath },
        svgOrigin: `${hinge.x} ${hinge.y}`,
        transformOrigin: `${hinge.x}px ${hinge.y}px`,
      });
    });

    gsap.set(wordGroupRef.current, { y: 0, opacity: 1 });
    if (backdropRef.current) {
      // opacity deliberately left to the JSX attribute (haze): the auto
      // light/dark probe resolves after mount, and an inline style written here
      // would freeze the initial value.
      gsap.set(backdropRef.current, { attr: { cx: 206, cy: 389, rx: 165, ry: 120 } });
    }

    /* Reduced motion keeps every stage, with the movement taken out: the
       stages fade, the finished mark fades in over 0.2 s instead of being
       drawn, and the word fades where it stands. */
    const reduced = prefersReducedMotion;

    /* ================================================================
       STAGE 1 TIMELINE — Dormant → Mono
       ================================================================ */

    const monoTl = gsap.timeline({
      paused: true,
      onComplete: () => { stageRef.current = 1; },
      onReverseComplete: () => { stageRef.current = 0; },
    });

    if (backdropRef.current) {
      const room = { attr: { cx: 255, cy: 398, rx: 215, ry: 132 } };
      if (reduced) monoTl.set(backdropRef.current, room, 0);
      else monoTl.to(backdropRef.current, { ...room, duration: 0.5, ease: 'power2.out' }, 0);
    }

    monoTl.to(bodyDormantRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 0.05);
    monoTl.to(armDormantRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 0.05);
    monoTl.to(bodyBaseRef.current, { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 0.05);
    monoTl.to(armBaseRef.current, { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 0.05);

    wordLetters.forEach((letter, i) => {
      const delay = 0.18 + i * 0.04;
      monoTl.fromTo(letter,
        { opacity: 0, y: reduced ? 0 : 8 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' },
        delay,
      );
    });

    monoTlRef.current = monoTl;

    /* ================================================================
       STAGE 2 TIMELINE — Mono → Colour
       ================================================================ */

    const colourTl = gsap.timeline({
      paused: true,
      onComplete: () => { stageRef.current = 2; },
      onReverseComplete: () => { stageRef.current = 1; },
    });

    if (reduced) {
      colourTl.to([cSealRef.current, bodySealRef.current, armSealRef.current], { opacity: 1, duration: REDUCED_FADE, ease: siteEase }, 0);
      colourTl.to([cBaseRef.current, bodyBaseRef.current, armBaseRef.current], { opacity: 0, duration: REDUCED_FADE, ease: siteEase }, REDUCED_FADE);
    } else {
      colourTl.to(cBaseRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0);
      colourTl.to(bodyBaseRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0);
      colourTl.to(armBaseRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0);

      /* -- Build B: the timeline is the build's clock, so a hover that ends
         early runs the stroke backwards -- */
      const build = { t: 0 };
      colourTl.set([cBuildRef.current, buildRef.current], { autoAlpha: 1 }, 0);
      colourTl.fromTo(build, { t: 0 }, {
        t: BUILD.end,
        duration: BUILD.end,
        ease: 'none',
        onUpdate: () => { drawBuildFrame(build.t, buildEls); },
      }, 0);

      /* each part hands over to the finished mark as it lands: the C at
         0.48 s, the 4 at 0.96 s */
      colourTl.set(cSealRef.current, { opacity: 1 }, BUILD.c[1]);
      colourTl.set(cBuildRef.current, { autoAlpha: 0 }, BUILD.c[1]);
      colourTl.set([bodySealRef.current, armSealRef.current], { opacity: 1 }, BUILD.end);
      colourTl.set(buildRef.current, { autoAlpha: 0 }, BUILD.end);

      /* -- Per-letter spring domino chain -- */

      LETTER_SPRINGS.forEach((spring, index) => {
        const letter = wordLetters[index];
        const pair = C4_WORDMARK_MORPH_PAIRS[index];
        if (!letter || !pair.normalized.normalizedPaths) return;

        const impactAt = impactTimes[index];
        const letterBox = letter.getBBox();
        const hingeHeight = letterBox.height;
        const { keyframes, stepDur, numKeyframes, tPeak, resolveDuration } = computeSpringTrajectory(spring);

        for (let ki = 0; ki <= numKeyframes; ki++) {
          const kf = keyframes[ki];
          const kfTime = impactAt + ki * stepDur;
          if (ki === 0) {
            colourTl.set(letter, { rotation: kf.rotation, y: hingeTranslationY(kf.rotation, hingeHeight) }, kfTime);
          } else {
            colourTl.to(letter, {
              rotation: kf.rotation, y: hingeTranslationY(kf.rotation, hingeHeight),
              duration: stepDur, ease: 'none',
            }, kfTime);
          }
        }

        const springToPeak = tPeak - TENSION_DURATION;
        const morphStart = impactAt + TENSION_DURATION + springToPeak * 0.25;
        const morphDuration = Math.max(0.05, springToPeak * 0.60);
        colourTl.to(letter, { attr: { d: pair.normalized.normalizedPaths.italicPath }, duration: morphDuration, ease: 'sine.inOut' }, morphStart);

        const settleStart = impactAt + resolveDuration;
        colourTl.to(letter, { rotation: 0, y: 0, duration: 0.08, ease: 'power2.out' }, settleStart);
      });

      const lockTime = Math.max(
        ...LETTER_SPRINGS.map((sp, i) => {
          const { resolveDuration: rd } = computeSpringTrajectory(sp);
          return impactTimes[i] + rd + 0.08;
        })
      );
      wordLetters.forEach((letter) => {
        if (letter) colourTl.set(letter, { rotation: 0, y: 0, x: 0 }, lockTime);
      });
    }

    colourTlRef.current = colourTl;

    /* ================================================================
       STAGE 3 TIMELINE — Colour → Dormant
       ================================================================ */

    const dormantTl = gsap.timeline({
      paused: true,
      onComplete: () => { stageRef.current = 0; },
      onReverseComplete: () => { stageRef.current = 2; },
    });

    wordLetters.forEach((letter, i) => {
      const pair = C4_WORDMARK_MORPH_PAIRS[i];
      if (!pair.normalized.normalizedPaths) return;
      const uprightPath = pair.normalized.normalizedPaths.uprightPath || pair.raw.uprightPath;
      const delay = i * 0.025;
      dormantTl.to(letter, { attr: { d: uprightPath }, duration: 0.28, ease: 'power2.inOut' }, delay);
    });

    wordLetters.forEach((letter, i) => {
      const delay = 0.26 + i * 0.02;
      dormantTl.to(letter, { opacity: 0.5, duration: 0.16, ease: 'power2.in' }, delay);
    });

    wordLetters.forEach((letter, i) => {
      const delay = 0.38 + i * 0.035;
      if (reduced) dormantTl.to(letter, { opacity: 0, duration: 0.34, ease: 'power3.in' }, delay);
      else dormantTl.to(letter, { scaleY: 0, y: 1.5, opacity: 0, duration: 0.34, ease: 'power3.in' }, delay);
    });

    /* The mark doesn't un-draw: the dormant greys come up under the colour
       and the colour fades off them, so the whole mark settles in one
       motion without dimming halfway (17 Oct 2026; the C's iris close and
       the strokes shrinking back went with the old build). */
    dormantTl.to([cBaseRef.current, bodyDormantRef.current, armDormantRef.current], { opacity: 1, duration: 0.36, ease: 'power2.inOut' }, 0.4);
    dormantTl.to([bodyBaseRef.current, armBaseRef.current], { opacity: 0, duration: 0.3, ease: 'power2.inOut' }, 0.4);
    dormantTl.to([cSealRef.current, bodySealRef.current, armSealRef.current], { opacity: 0, duration: 0.42, ease: 'power2.inOut' }, 0.52);

    if (backdropRef.current) {
      const rest = { attr: { cx: 206, cy: 389, rx: 165, ry: 120 } };
      if (reduced) dormantTl.set(backdropRef.current, rest, 0.8);
      else dormantTl.to(backdropRef.current, { ...rest, duration: 0.45, ease: 'power2.inOut' }, 0.80);
    }

    dormantTl.set(wordLetters, { y: 0, rotation: 0, x: 0, scaleY: 1, opacity: 0 }, 1.30);

    dormantTlRef.current = dormantTl;

    return () => {
      if (monoTlRef.current) { monoTlRef.current.kill(); monoTlRef.current = null; }
      if (colourTlRef.current) { colourTlRef.current.kill(); colourTlRef.current = null; }
      if (dormantTlRef.current) { dormantTlRef.current.kill(); dormantTlRef.current = null; }
    };
  }, { scope: rootRef, dependencies: [prefersReducedMotion] });

  /* =================================================================
     HOVER + TOUCH HANDLERS — staged progressive animation
     ================================================================= */

  const getActiveTl = useCallback(() => {
    const stage = stageRef.current;
    if (stage === 0) return monoTlRef.current;
    if (stage === 1) return colourTlRef.current;
    if (stage === 2) return dormantTlRef.current;
    return null;
  }, []);

  const playTl = useCallback((tl) => {
    if (tl.progress() >= 1) {
      tl.restart();
    } else {
      tl.play();
    }
  }, []);

  const handleHoverStart = useCallback(() => {
    const tl = getActiveTl();
    if (!tl) return;
    inFlightTlRef.current = tl;
    setExpanded(true);
    playTl(tl);
  }, [getActiveTl, playTl]);

  const handleHoverEnd = useCallback(() => {
    setExpanded(false);
    const tl = inFlightTlRef.current;
    inFlightTlRef.current = null;
    if (!tl || tl.progress() >= 1) return;
    tl.reverse();
  }, []);

  const handleTouchStart = useCallback(() => {
    const tl = getActiveTl();
    if (!tl) return;
    touchStartRef.current = Date.now();
    inFlightTlRef.current = tl;
    setExpanded(true);
    playTl(tl);
  }, [getActiveTl, playTl]);

  const handleTouchEnd = useCallback((e) => {
    const elapsed = Date.now() - (touchStartRef.current || 0);
    touchStartRef.current = null;
    setExpanded(false);

    const tl = inFlightTlRef.current;
    inFlightTlRef.current = null;

    if (!tl || tl.progress() >= 1) {
      if (elapsed >= 300) {
        e.preventDefault();
        touchConsumedRef.current = true;
      }
      return;
    }

    if (elapsed >= 300) {
      e.preventDefault();
      touchConsumedRef.current = true;
    }

    tl.reverse();
  }, []);

  const handleClick = useCallback((e) => {
    if (touchConsumedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      touchConsumedRef.current = false;
    }
  }, []);

  /* =================================================================
     RENDER
     ================================================================= */

  const linkProps = openInNewTab
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <a
      ref={rootRef}
      href={href}
      {...linkProps}
      className={className}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        textDecoration: 'none',
        color: 'inherit',
        userSelect: 'none',
      }}
      aria-label={label}
    >
      <svg
        viewBox={FULL_VIEWBOX}
        width={w}
        height={h}
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        style={{
          overflow: 'visible',
          transform: `translateX(${restShift}px)`,
          transition: prefersReducedMotion ? 'none' : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        <defs>
          <filter id={cPresenceId} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.22"/>
          </filter>
          <filter id={backdropBlurId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" />
          </filter>
          <clipPath id={cWipeId} clipPathUnits="userSpaceOnUse">
            <polygon ref={cWipeRef} points="" />
          </clipPath>
        </defs>

        <g transform={LOCKUP_TRANSFORM}>
          {/* Backdrop — soft translucent bubble */}
          <ellipse
            ref={backdropRef}
            cx="206" cy="389"
            rx="165" ry="120"
            fill="#555"
            opacity={haze}
            filter={`url(#${backdropBlurId})`}
          />

          {/* C — dormant/mono base */}
          <path ref={cBaseRef} d={FULL_UPRIGHT.cArc} fill={mono.cArc} filter={`url(#${cPresenceId})`} />

          {/* C — the build's straight wipe, in the mark's own units. Empty
              until stage 2 starts; the finished C takes over at 0.48 s. */}
          <g ref={cBuildRef} transform={LOCKUP_MATRIX}>
            <path d={MARK_C} fill={colour.cArc} clipPath={`url(#${cWipeId})`} />
          </g>

          {/* C — colour, finished */}
          <path ref={cSealRef} d={FULL_UPRIGHT.cArc} fill={colour.cArc} />

          {/* 4 body — dormant palette */}
          <polygon ref={bodyDormantRef} points={FULL_UPRIGHT.fourBody} fill={dormant.fourBody} />

          {/* 4 body — mono base */}
          <polygon ref={bodyBaseRef} points={FULL_UPRIGHT.fourBody} fill={mono.fourBody} />

          {/* 4 body — colour seal */}
          <polygon ref={bodySealRef} points={FULL_UPRIGHT.fourBody} fill={colour.fourBody} />

          {/* Arm group */}
          <g>
            <g ref={armDormantRef}>
              <polygon points={FULL_UPRIGHT.fourArm} fill={dormant.fourArm} />
            </g>
            <g ref={armBaseRef}>
              <polygon points={FULL_UPRIGHT.fourArm} fill={mono.fourArm} />
            </g>
            <polygon ref={armSealRef} points={FULL_UPRIGHT.fourArm} fill={colour.fourArm} />
          </g>

          {/* 4 — the build's strokes, one path per colour whose subpaths are
              the strokes so far, so no seam shows where two meet. Empty
              until stage 2 starts; the finished 4 takes over at 0.96 s. */}
          <g ref={buildRef} transform={LOCKUP_MATRIX}>
            <path ref={buildRedRef} d="" fill={colour.fourBody} />
            <path ref={buildGreenRef} d="" fill={colour.fourArm} />
          </g>

          {/* Word "Studios" — letters individually animated */}
          <g ref={wordGroupRef}>
            <MorphWordPaths pairs={C4_WORDMARK_MORPH_PAIRS} fill={mono.text} refs={morphLetterRefs} />
          </g>
        </g>
      </svg>

      {showText && (
        <span
          style={{
            fontSize: '11px',
            opacity: 0.5,
            lineHeight: 1.4,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      )}
    </a>
  );
}
