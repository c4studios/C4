/*
 * Satin stitch for the stitched version of the /logo-design stand-in,
 * computed from its own outlines (src/components/logo-design/mark-data.js)
 * and written to src/components/logo-design/satin-data.js. No image model
 * is involved. Run it after scripts/logo-design-mark.py redraws the mark:
 *
 *   node scripts/logo-design-satin.mjs
 *
 * Satin is a column of threads, each laid straight across the column from
 * one edge to the other, so the threads turn with the stroke: flat across a
 * stem, fanning round a bowl or the ring of the roundel. To get that from the
 * outlines, every edge of every letter is walked, and at each step a thread
 * is laid along the inward normal until it meets the far edge of the same
 * letter. A column would get threads from both of its edges, so only the
 * edge whose inward normal faces down and to the right lays them (both do
 * where a column runs close to that diagonal). A thread that runs along its
 * column instead of across it, as one from the cut end of a stem would, is
 * dropped: it's kept only if the shape is at least as long, across the
 * thread at its middle, as the thread itself (with a little slack). So is
 * one from a corner, where the edge has no single direction. Threads are
 * then sorted into three tones by angle, because satin catches the light by
 * direction, so a stem, a diagonal and a curve read differently.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { MARK } from '../src/components/logo-design/mark-data.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'src', 'components', 'logo-design', 'satin-data.js');

const THREAD = 8; // one thread's width, in the mark's units (cap height 100)
const FACE = [0.6, 0.8];
const LIGHT = Math.PI / 4; // threads at this angle catch the most light
const SLACK = 1.3;
const CORNER = Math.cos((35 * Math.PI) / 180);

/* An absolute M/L/Q/Z path as closed polygons, the curves flattened. */
function contours(d) {
  const tok = d.match(/[MLQZ]|-?\d*\.?\d+/g) || [];
  const out = [];
  let cur = null;
  let at = [0, 0];
  for (let i = 0; i < tok.length;) {
    const c = tok[i];
    if (c === 'M') {
      cur = [];
      out.push(cur);
      at = [Number(tok[i + 1]), Number(tok[i + 2])];
      cur.push(at);
      i += 3;
    } else if (c === 'L') {
      at = [Number(tok[i + 1]), Number(tok[i + 2])];
      cur.push(at);
      i += 3;
    } else if (c === 'Q') {
      const q = [Number(tok[i + 1]), Number(tok[i + 2])];
      const e = [Number(tok[i + 3]), Number(tok[i + 4])];
      for (let k = 1; k <= 6; k += 1) {
        const t = k / 6;
        const u = 1 - t;
        cur.push([u * u * at[0] + 2 * u * t * q[0] + t * t * e[0], u * u * at[1] + 2 * u * t * q[1] + t * t * e[1]]);
      }
      at = e;
      i += 5;
    } else {
      if (cur && cur.length > 1) {
        const a = cur[0];
        const b = cur[cur.length - 1];
        if (Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6) cur.pop();
      }
      i += 1;
    }
  }
  return out.filter((p) => p.length > 2);
}

function circle(cx, cy, r, n = 144) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
}

/* Even-odd: inside the shape, counters and the Y being holes. */
function inside(shape, [x, y]) {
  let odd = false;
  for (const poly of shape) {
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) odd = !odd;
    }
  }
  return odd;
}

/* How far a ray from p along n travels before it meets an edge. */
function reach(shape, p, n, from = 0.6) {
  let best = Infinity;
  for (const poly of shape) {
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
      const a = poly[j];
      const ex = poly[i][0] - a[0];
      const ey = poly[i][1] - a[1];
      const den = n[0] * ey - n[1] * ex;
      if (Math.abs(den) < 1e-9) continue;
      const wx = a[0] - p[0];
      const wy = a[1] - p[1];
      const t = (wx * ey - wy * ex) / den;
      const u = (wx * n[1] - wy * n[0]) / den;
      if (t > from && u >= 0 && u <= 1 && t < best) best = t;
    }
  }
  return best;
}

/* The point `d` along a closed polygon. */
function walker(poly) {
  const cum = [0];
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    cum.push(cum[i] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const total = cum[cum.length - 1];
  const pointAt = (d) => {
    const s = ((d % total) + total) % total;
    let lo = 0;
    let hi = poly.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid - 1; }
    const a = poly[lo];
    const b = poly[(lo + 1) % poly.length];
    const len = cum[lo + 1] - cum[lo] || 1;
    const t = (s - cum[lo]) / len;
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };
  return { total, pointAt };
}

/* Candidates are tried every quarter thread along each edge, and one is laid
   whenever either of its ends has moved a full thread from the last one laid.
   On a straight column that's every fourth candidate. Round the outside of a
   curve, where threads from the inner edge fan apart, it's more, so the outer
   edge stays covered the way a digitiser keeps the density up. */
function threadsFor(shape) {
  const out = [];
  for (const poly of shape) {
    const { total, pointAt } = walker(poly);
    let last = null;
    for (let d = 0; d < total; d += THREAD / 4) {
      const p = pointAt(d);
      const a = pointAt(d - THREAD / 2);
      const b = pointAt(d + THREAD / 2);
      const tl = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (tl < 1e-6) continue;
      const ia = [p[0] - a[0], p[1] - a[1]];
      const ib = [b[0] - p[0], b[1] - p[1]];
      const turn = (ia[0] * ib[0] + ia[1] * ib[1]) / ((Math.hypot(ia[0], ia[1]) * Math.hypot(ib[0], ib[1])) || 1);
      if (turn < CORNER) continue;
      const t = [(b[0] - a[0]) / tl, (b[1] - a[1]) / tl];
      let n = [-t[1], t[0]];
      if (!inside(shape, [p[0] + n[0] * 0.75, p[1] + n[1] * 0.75])) n = [-n[0], -n[1]];
      if (!inside(shape, [p[0] + n[0] * 0.75, p[1] + n[1] * 0.75])) continue;
      if (n[0] * FACE[0] + n[1] * FACE[1] < -0.15) continue;
      const len = reach(shape, p, n);
      if (!Number.isFinite(len)) continue;
      const m = [p[0] + n[0] * (len / 2), p[1] + n[1] * (len / 2)];
      const across = reach(shape, m, t, 0) + reach(shape, m, [-t[0], -t[1]], 0);
      if (len > SLACK * across) continue;
      const end = [p[0] + n[0] * len, p[1] + n[1] * len];
      if (last
        && Math.hypot(p[0] - last.p[0], p[1] - last.p[1]) < THREAD
        && Math.hypot(end[0] - last.end[0], end[1] - last.end[1]) < THREAD) continue;
      last = { p, n, len, end };
      out.push(last);
    }
  }
  return out;
}

/* Three path strings of threads (dark, mid and light), "M x y l dx dy" per
   thread, in the version's own units. */
function satin(version) {
  const v = MARK[version];
  const rd = v.roundel;
  const shapes = [
    [circle(rd.cx, rd.cy, rd.r), ...rd.y.flatMap(contours)],
    ...v.letters.map((g) => [...g.outer, ...g.inner].flatMap(contours)),
  ];
  const tones = { dark: [], mid: [], light: [] };
  let count = 0;
  for (const shape of shapes) {
    for (const { p, n, len } of threadsFor(shape)) {
      const glow = 0.5 + 0.5 * Math.cos(2 * (Math.atan2(n[1], n[0]) - LIGHT));
      const key = glow > 0.66 ? 'light' : glow > 0.33 ? 'mid' : 'dark';
      const e = len + 1; // a hair past the edge; the clip trims it
      tones[key].push(`M${Math.round(p[0])} ${Math.round(p[1])}l${Math.round(n[0] * e)} ${Math.round(n[1] * e)}`);
      count += 1;
    }
  }
  return { thread: THREAD, count, dark: tones.dark.join(''), mid: tones.mid.join(''), light: tones.light.join('') };
}

const versions = ['compact'];
const data = Object.fromEntries(versions.map((name) => [name, satin(name)]));
const body = `/* GENERATED by scripts/logo-design-satin.mjs from mark-data.js. Do not
   edit by hand; run \`node scripts/logo-design-satin.mjs\` after the mark is
   redrawn.

   Satin threads for the stitched version of the stand-in: per version, the
   thread width in the mark's units and three path strings (dark, mid and
   light threads, sorted by angle), each thread one "M x y l dx dy" laid
   across its column. Drawn under a clip of the mark's own shape. */
export const SATIN = ${JSON.stringify(data, null, 1)};
`;
writeFileSync(OUT, body);
for (const [name, s] of Object.entries(data)) {
  console.log(`  ${name}: ${s.count} threads, ${s.dark.length + s.mid.length + s.light.length} bytes`);
}
