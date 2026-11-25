/* The engraved eye: the hero's second look, picked with its Colour / Engraved
   switch. The drawing is ported unchanged from the approved mock-up
   (docs/lens-hero-ideas/engraved-eye.html); its page furniture is left behind.

   startEngraved(section) draws into a 2D canvas in .lh-layer-eng and returns
   a stop function, the same shape as startEye: stop(true) freezes the last
   frame while the hero fades it out, stop() removes the canvas. It needs no
   WebGL. The canvas spans the room the hero leaves between the lede and the
   buttons (--lh-top to --lh-bot), centred on --lh-cx, and the iris is never
   drawn bigger than the colour eye's (--lh-iris).

   It looks where the colour eye looks: at a keyboard-focused control, at a
   finger, at the pointer while it moves, and straight ahead after 2.5 s
   without one. A press inside the opening closes the aperture and takes a
   frame (shutter.js). With reduced motion it is drawn once and keeps still.
   Loaded by dynamic import only when chosen. */
import { fireShutter, frameCount, watchPresses, REST_L, restR } from './shutter.js';

const INK = '#f5f5f0';
const AMBER = '#e8a658';
const INTERACTIVE = 'a,button,[role="button"],summary,label,input,select,textarea';
const STOPS = ['1.4', '2', '2.8', '4', '5.6', '8', '11', '16', '22']; // the scale on the iris barrel

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const rng = (seed) => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* ───────────── The drawing (from the mock-up, unchanged) ─────────────
   Everything is line. Light #f5f5f0 lines on black read the way a
   scratchboard or a white-line wood engraving does: where lines crowd and
   thicken the form is lit, where they thin out and stop the black takes
   over. Amber is kept for the aperture and the catchlight. */

/* Variable-width strokes, bucketed by width so a whole layer is a handful
   of stroke() calls. */
class Ink {
  constructor(maxW, n = 12) { this.maxW = maxW; this.n = n; this.p = Array.from({ length: n }, () => new Path2D()); }
  k(w) { const k = Math.round((w / this.maxW) * this.n) - 1; return k < 0 ? -1 : Math.min(this.n - 1, k); }
  poly(pts, ws) {
    let cur = -1;
    for (let i = 0; i < ws.length - 1; i++) {
      const k = this.k((ws[i] + ws[i + 1]) / 2);
      if (k < 0) { cur = -1; continue; }
      if (k !== cur) { this.p[k].moveTo(pts[2 * i], pts[2 * i + 1]); cur = k; }
      this.p[k].lineTo(pts[2 * i + 2], pts[2 * i + 3]);
    }
  }
  stroke(g, color) {
    g.strokeStyle = color; g.lineCap = 'round'; g.lineJoin = 'round';
    for (let k = 0; k < this.n; k++) { g.lineWidth = ((k + 1) / this.n) * this.maxW; g.stroke(this.p[k]); }
  }
}

/* Geometry in eye units: half the eye's width is 1, y runs down.
   Inner corner on the left, outer on the right. */
const IC = { x: -1, y: 0.05 }, OC = { x: 1, y: -0.04 };
const IRIS_R = 0.42, IRIS_Y = 0.02;
const baseY = (x) => lerp(IC.y, OC.y, (x + 1) / 2);
const upperM = (x, sh) => { const q = Math.max(0, 1 - x * x); return baseY(x) - 0.385 * Math.pow(q, 0.8) * (1 - 0.1 * x) + sh * q; };
const lowerM = (x, sh) => { const q = Math.max(0, 1 - x * x); return baseY(x) + 0.27 * Math.pow(q, 1.05) * (1 + 0.14 * x) + sh * q; };
const BOX = { top: -1.0, bottom: 0.56 };
const MAX_DX = IRIS_R * 1.0, MAX_DY = IRIS_R * 0.62;
const OMEGA = 40, ZETA = 0.78; // settles in about 120 ms

/* Each band of the lid has its own spacing and weight. Near the margin the
   lines hug it and run into the corners; further out they open into arches
   that pass the corners and fade out with staggered ends. */
const UPPER_BANDS = [
  { t0: 0.0, t1: 0.04, sp: () => 0.011, w: () => 0.95 },                                        // lid rim
  { t0: 0.065, t1: 0.3, sp: () => 0.0135, w: (t) => 0.45 + 0.95 * Math.sin(Math.PI * (t - 0.065) / 0.235) }, // the lid's lit fold
  { t0: 0.41, t1: 0.62, sp: () => 0.03, w: () => 0.42 },                                        // the hollow under the brow bone
  { t0: 0.62, t1: 1.0, sp: (t) => 0.019 + 0.018 * (t - 0.62) / 0.38, w: (t) => (0.22 + 0.42 * Math.pow(Math.sin(Math.PI * (t - 0.62) / 0.38), 0.8)) * (1 - 0.6 * (t - 0.62) / 0.38) },
];
const LOWER_BANDS = [
  { t0: 0.0, t1: 0.03, sp: () => 0.011, w: () => 0.7 },
  { t0: 0.075, t1: 0.4, sp: (t) => 0.016 + 0.008 * (t - 0.075) / 0.325, w: (t) => 0.75 * (1 - 0.6 * (t - 0.075) / 0.325) },
  { t0: 0.4, t1: 0.75, sp: () => 0.03, w: (t) => 0.4 * (1 - 0.5 * (t - 0.4) / 0.35) },
  { t0: 0.75, t1: 1.0, sp: () => 0.042, w: (t) => 0.28 * (1 - (t - 0.75) / 0.3) },
];

/* One engraving: its own sizes (S) and gaze, so two can never share state. */
function createEngraving() {
  const S = { dpr: 1, w: 0, h: 0, u: 0, cx: 0, cy: 0, rpx: 0, iris: null, k: 1 };
  const gaze = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
  const ap = { c: 0, target: 0, held: false };

  /* ── Iris: guilloché rosette, fibres, the barrel scales, the catchlight ── */
  function buildIris() {
    const R = S.rpx, k = S.k;
    const ink = new Ink(2.2 * k + 0.6, 14);
    const lit = (th) => 0.8 + 0.3 * Math.cos(th - Math.PI / 4); // light through the cornea falls lower right
    const curve = (fr, w, N) => {
      const pts = new Array((N + 1) * 2), ws = new Array(N + 1);
      for (let j = 0; j <= N; j++) {
        const th = (j / N) * Math.PI * 2, r = fr(th) * R;
        pts[2 * j] = Math.cos(th) * r; pts[2 * j + 1] = Math.sin(th) * r;
        ws[j] = w * k * lit(th);
      }
      ink.poly(pts, ws);
    };
    // A guilloché band: one sine-wave ring repeated M times, each turned a
    // fraction of a lobe, so the copies plait into a band of lens-shaped cells.
    const band = (rc, A, n, M, w) => {
      const N = Math.max(240, Math.round(rc * R * Math.PI * 1.4));
      for (let m = 0; m < M; m++) {
        const d = ((m / M) * Math.PI * 2) / n;
        curve((th) => rc + A * Math.sin(n * (th - d)), w, N);
      }
    };
    band(0.245, 0.14, 26, 6, 0.5);     // pupillary zone, seen in full when the aperture closes
    band(0.52, 0.058, 18, 9, 0.6);     // beyond the collarette
    band(0.70, 0.093, 14, 12, 0.5);    // ciliary zone
    curve((th) => 0.432 + 0.024 * Math.sin(9 * th) + 0.009 * Math.sin(23 * th + 1), 1.0, 400); // the collarette line
    curve(() => 0.597, 0.6, 360);

    // Fibres: short radial strokes, spindle-shaped, a little curved.
    const r = rng(11);
    const FIB = Math.round(300 * clamp(R / 130, 0.55, 1.3));
    for (let i = 0; i < FIB; i++) {
      const th0 = ((i + r()) / FIB) * Math.PI * 2;
      const s0 = 0.1 + r() * 0.34;
      const len = 0.07 + Math.pow(r(), 1.4) * 0.3;
      const s1 = Math.min(0.785, s0 + len);
      const bend = (r() - 0.5) * 0.12, wmax = (0.45 + r() * 0.75) * k;
      const N = 14, pts = [], ws = [];
      for (let j = 0; j <= N; j++) {
        const v = j / N, rr = lerp(s0, s1, v) * R, th = th0 + bend * v;
        pts.push(Math.cos(th) * rr, Math.sin(th) * rr);
        ws.push(wmax * Math.pow(Math.sin(Math.PI * v), 0.7) * lit(th0));
      }
      ink.poly(pts, ws);
    }

    // Barrel rings and minute ticks.
    const circle = (rr, w) => { const N = 360, pts = [], ws = []; for (let j = 0; j <= N; j++) { const th = (j / N) * Math.PI * 2; pts.push(Math.cos(th) * rr * R, Math.sin(th) * rr * R); ws.push(w * k); } ink.poly(pts, ws); };
    circle(1.0, 1.15); circle(0.81, 0.8);
    const showDist = R >= 58, showStops = R >= 96;
    if (showStops) circle(0.903, 0.5);
    for (let d = 0; d < 360; d += 3) {
      const th = (d * Math.PI) / 180, long = d % 15 === 0;
      const a = long ? 0.962 : 0.976;
      ink.poly([Math.cos(th) * a * R, Math.sin(th) * a * R, Math.cos(th) * R, Math.sin(th) * R], [0.55 * k, 0.55 * k]);
    }
    const DIST = [['∞', 0], ['30', 1], ['10', 2], ['5', 3], ['3', 4], ['1.5', 5], ['1', 6], ['0.7', 7], ['0.5', 8]];
    const START = -150;
    if (showStops) STOPS.forEach((_, i) => {
      const th = ((START + (i / 8) * 210) * Math.PI) / 180;
      ink.poly([Math.cos(th) * 0.81 * R, Math.sin(th) * 0.81 * R, Math.cos(th) * 0.828 * R, Math.sin(th) * 0.828 * R], [0.7 * k, 0.7 * k]);
    });
    const labels = [];
    const fpx = Math.max(7, R * 0.066);
    if (showDist) {
      DIST.forEach(([t, i]) => labels.push([t, START + i * 33, showStops ? 0.94 : 0.9, fpx]));
      labels.push(['m', START + 9 * 33, showStops ? 0.94 : 0.9, fpx * 0.8]);
    }
    if (showStops) STOPS.forEach((t, i) => labels.push([t, START + (i / 8) * 210, 0.858, fpx * 0.92]));
    return { ink, labels };
  }

  /* Drawn every frame as vectors, inside the iris transform, so the lines stay
     crisp when the iris foreshortens. */
  function drawIris(g) {
    const R = S.rpx, k = S.k;
    S.iris.ink.stroke(g, INK);
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle';
    if ('letterSpacing' in g) g.letterSpacing = '0.04em';
    for (const [txt, deg, rr, px] of S.iris.labels) {
      const th = (deg * Math.PI) / 180;
      g.save(); g.translate(Math.cos(th) * rr * R, Math.sin(th) * rr * R); g.rotate(th + Math.PI / 2);
      g.font = `500 ${px}px "Geist Mono", monospace`; g.fillText(txt, 0, 0); g.restore();
    }
    if ('letterSpacing' in g) g.letterSpacing = '0px';
    // Catchlight: a clean window cut out of the engraving, a softbox with a pane cross.
    const cw = 0.2 * R, chh = 0.27 * R, cx0 = -0.5 * R - cw / 2, cy0 = -0.46 * R - chh / 2, m = 2.2;
    g.globalCompositeOperation = 'destination-out';
    g.fillRect(cx0 - m, cy0 - m, cw + 2 * m, chh + 2 * m);
    g.globalCompositeOperation = 'source-over';
    g.strokeStyle = AMBER; g.lineWidth = Math.max(0.9, 1.0 * k);
    g.strokeRect(cx0, cy0, cw, chh);
    g.lineWidth = Math.max(0.7, 0.75 * k);
    g.beginPath(); g.moveTo(cx0 + cw / 2, cy0); g.lineTo(cx0 + cw / 2, cy0 + chh); g.moveTo(cx0, cy0 + chh / 2); g.lineTo(cx0 + cw, cy0 + chh / 2); g.stroke();
  }

  /* ── Lid hatching ── */
  function lidLines(ink, upper, sh) {
    const U = S.u, ox = S.cx, oy = S.cy, k = S.k;
    const bands = upper ? UPPER_BANDS : LOWER_BANDS;
    const reach = upper ? 0.62 : 0.32;
    const peakX = upper ? -0.06 : 0.1;
    let line = 0;
    for (const b of bands) {
      let t = b.t0;
      while (t <= b.t1 + 1e-6) {
        const r = rng(1000 + line * 7 + (upper ? 0 : 500));
        const off = 0.012 + reach * t;
        const beta = sstep(0.16, 0.55, t);
        const lineSh = sh * Math.pow(1 - t, 1.6);
        const a = 1.02 + (upper ? 0.32 : 0.2) * beta * t;
        const ccx = (upper ? 0.05 : 0.04) * t;
        const margin = upper ? upperM : lowerM;
        const sign = upper ? -1 : 1;
        const peakM = margin(peakX, lineSh);
        const endI = upper ? IC.y - 0.06 - 0.1 * t : IC.y + 0.02 + 0.05 * t;
        const endO = upper ? OC.y + 0.02 + 0.08 * t : OC.y + 0.04 + 0.04 * t;
        // staggered, tapered ends; outer lines fade sooner
        const taper = 0.22 + 0.3 * t;
        const uS = -1 + r() * 0.14 + (1 - beta) * 0.04;
        const uE = 1 - r() * 0.14 - (1 - beta) * 0.03;
        const jit = 0.85 + r() * 0.3;
        const N = 120, pts = new Array((N + 1) * 2), ws = new Array(N + 1);
        for (let j = 0; j <= N; j++) {
          const u = -1 + (2 * j) / N;
          // hugging the margin
          const hx = u * 0.985;
          const hy = margin(hx, lineSh) + sign * off * Math.pow(Math.max(0, 1 - hx * hx), 0.35);
          // free arch
          const ax = ccx + a * u;
          const base = lerp(endI, endO, (u + 1) / 2);
          const mid = lerp(endI, endO, 0.5 + (peakX - ccx) / (2 * a));
          const peak = peakM + sign * off;
          const prof = Math.pow(Math.max(0, 1 - u * u), 0.62) * (1 - 0.08 * u);
          const ay = base + (peak - mid) * prof;
          const x = lerp(hx, ax, beta), y = lerp(hy, ay, beta);
          pts[2 * j] = ox + x * U; pts[2 * j + 1] = oy + y * U;
          const env = sstep(uS, uS + taper, u) * (1 - sstep(uE - taper, uE, u));
          const light = upper ? clamp(0.82 - 0.3 * u, 0.45, 1.12) : clamp(0.86 - 0.16 * u, 0.6, 1.05);
          ws[j] = b.w(t) * env * light * jit * k;
        }
        ink.poly(pts, ws);
        t += b.sp(t) / reach;
        line++;
      }
    }
  }

  function sclera(ink, shU) {
    const U = S.u, ox = S.cx, oy = S.cy, k = S.k;
    // Rings round the cornea, drawn on the eyeball. The ball turns with the
    // gaze, so the rings travel with the iris and flatten toward the corners;
    // tone comes from how squarely each part faces the light.
    const Rb = 1.06, CY = IRIS_Y;
    const yaw = Math.asin(clamp((gaze.x * MAX_DX) / Rb, -0.9, 0.9));
    const pitch = Math.asin(clamp((gaze.y * MAX_DY) / Rb, -0.9, 0.9));
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const Lx = -0.48, Ly = -0.5, Lz = 0.72;
    for (let psi = 27.5; psi <= 96; psi += 3.6) {
      const P = (psi * Math.PI) / 180, s = Math.sin(P), c = Math.cos(P);
      const N = 120, pts = new Array((N + 1) * 2), ws = new Array(N + 1);
      for (let j = 0; j <= N; j++) {
        const al = (j / N) * Math.PI * 2;
        let x = s * Math.cos(al), y = s * Math.sin(al), z = c;
        // yaw about y, then pitch about x
        const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
        const y2 = y * cp + z1 * sp, z2 = -y * sp + z1 * cp;
        x = x1; y = y2; z = z2;
        const px = x * Rb, py = CY + y * Rb;
        pts[2 * j] = ox + px * U; pts[2 * j + 1] = oy + py * U;
        if (z <= 0.05) { ws[j] = 0; continue; }
        const lam = Math.max(0, x * Lx + y * Ly + z * Lz);
        const shadow = sstep(0.02, 0.14, py - upperM(px, shU));       // the upper lid shades the ball
        const corner = 1 - sstep(0.62, 0.98, Math.abs(px));
        ws[j] = (0.06 + 0.5 * lam) * k * shadow * corner * sstep(0.05, 0.3, z);
      }
      ink.poly(pts, ws);
    }
  }

  function lashes(ink, sh, upper) {
    const U = S.u, ox = S.cx, oy = S.cy, k = S.k;
    const r = rng(upper ? 99 : 199);
    const n = upper ? 76 : 36;
    const margin = upper ? upperM : lowerM;
    for (let i = 0; i < n; i++) {
      const s = clamp((i + r() * 0.7) / n, 0, 1);
      const x = upper ? -0.8 + 1.78 * Math.pow(s, 0.9) : -0.52 + 1.48 * Math.pow(s, 0.85);
      const y0 = margin(x, sh) + (upper ? -0.002 : 0.046);
      const d = (margin(x + 0.002, sh) - margin(x - 0.002, sh)) / 0.004;
      let nx = upper ? d : -d, ny = upper ? -1 : 1;
      const nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;
      const tilt = upper ? 0.12 + 0.8 * s + (r() - 0.5) * 0.2 : -(0.25 + 0.7 * s + (r() - 0.5) * 0.2);
      const rot = (vx, vy, a) => [vx * Math.cos(a) - vy * Math.sin(a), vx * Math.sin(a) + vy * Math.cos(a)];
      const [d0x, d0y] = rot(nx, ny, tilt);
      const [d1x, d1y] = rot(nx, ny, tilt + (upper ? 0.42 : -0.3));
      const L = upper ? (0.06 + 0.14 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 1.12)), 1.2)) * (0.78 + r() * 0.44)
                      : (0.028 + 0.05 * Math.sin(Math.PI * Math.min(1, s * 1.05))) * (0.75 + r() * 0.5);
      const p0x = x, p0y = y0, p1x = x + d0x * L * 0.55, p1y = y0 + d0y * L * 0.55, p2x = x + d1x * L, p2y = y0 + d1y * L;
      const N = 12, pts = [], ws = [];
      const wr = (upper ? 1.75 : 0.95) * k;
      for (let j = 0; j <= N; j++) {
        const v = j / N, a = (1 - v) * (1 - v), b = 2 * v * (1 - v), c = v * v;
        pts.push(ox + (a * p0x + b * p1x + c * p2x) * U, oy + (a * p0y + b * p1y + c * p2y) * U);
        ws.push(wr * (1 - 0.9 * Math.pow(v, 0.8)));
      }
      ink.poly(pts, ws);
    }
  }

  function draw(ctx) {
    const U = S.u, R = S.rpx, dpr = S.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gx = gaze.x, gy = gaze.y;
    const shU = gy * (gy < 0 ? 0.1 : 0.13), shL = gy * 0.03;

    // the opening
    const open = new Path2D();
    for (let j = 0; j <= 96; j++) { const x = -1 + (2 * j) / 96; const px = S.cx + x * U, py = S.cy + upperM(x, shU) * U; if (j) open.lineTo(px, py); else open.moveTo(px, py); }
    for (let j = 96; j >= 0; j--) { const x = -1 + (2 * j) / 96; open.lineTo(S.cx + x * U, S.cy + lowerM(x, shL) * U); }
    open.closePath();

    ctx.save();
    ctx.clip(open);
    const inkS = new Ink(1.2 * S.k + 0.3, 8);
    sclera(inkS, shU);
    inkS.stroke(ctx, INK);

    // the iris turns on the ball: it moves and foreshortens toward the edges
    const ix = S.cx + gx * MAX_DX * U, iy = S.cy + (IRIS_Y + gy * MAX_DY) * U;
    const mag = Math.min(1, Math.hypot(gx, gy)), ang = Math.atan2(gy, gx);
    const squash = 1 - 0.17 * mag * mag;
    ctx.translate(ix, iy); ctx.rotate(ang); ctx.scale(squash, 1); ctx.rotate(-ang);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(0, 0, R * 1.04, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    drawIris(ctx);

    // the pupil: black, edged by a nine-bladed aperture
    const rp = lerp(0.33, 0.05, ap.c) * R, rot = -Math.PI / 2 + ap.c * 0.6;
    const nona = new Path2D();
    for (let i = 0; i < 9; i++) { const a = rot + (i / 9) * Math.PI * 2; if (i) nona.lineTo(Math.cos(a) * rp, Math.sin(a) * rp); else nona.moveTo(Math.cos(a) * rp, Math.sin(a) * rp); }
    nona.closePath();
    ctx.globalCompositeOperation = 'destination-out'; ctx.fill(nona);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = AMBER; ctx.lineWidth = Math.max(1, 1.35 * S.k); ctx.lineJoin = 'miter'; ctx.stroke(nona);
    ctx.restore();

    // lids and lashes
    const inkL = new Ink(2.6 * S.k + 0.4, 14);
    lidLines(inkL, true, shU);
    lidLines(inkL, false, shL);
    lashes(inkL, shU, true);
    lashes(inkL, shL, false);
    inkL.stroke(ctx, INK);
  }

  /* Fit the engraving into a w x h canvas, as the mock-up fitted its room:
     wide windows show the whole engraving, narrower ones let the outer
     hatching run off the edges. cx is the eye's centre across the canvas;
     uMax caps the size so the iris is never wider than irisMax. */
  function layout(w, h, dpr, cx, irisMax) {
    S.dpr = dpr; S.w = w; S.h = h;
    const spanX = w >= 1000 ? 3.0 : w >= 720 ? 2.5 : 2.05;
    S.u = Math.min(w / spanX, h / (BOX.bottom - BOX.top), irisMax / IRIS_R);
    S.cx = cx;
    S.cy = h / 2 - ((BOX.top + BOX.bottom) / 2) * S.u;
    S.rpx = IRIS_R * S.u;
    S.k = clamp(S.u / 310, 0.55, 1.6);
    S.iris = buildIris();
  }

  /* The spring and the aperture, from the mock-up. Returns true while moving. */
  function step(dt) {
    const steps = Math.ceil(dt / (1 / 240)), h = dt / steps;
    for (let i = 0; i < steps; i++) {
      gaze.vx += (-OMEGA * OMEGA * (gaze.x - gaze.tx) - 2 * ZETA * OMEGA * gaze.vx) * h;
      gaze.vy += (-OMEGA * OMEGA * (gaze.y - gaze.ty) - 2 * ZETA * OMEGA * gaze.vy) * h;
      gaze.x += gaze.vx * h; gaze.y += gaze.vy * h;
    }
    const rate = ap.target > ap.c ? 24 : 9;
    ap.c += (ap.target - ap.c) * (1 - Math.exp(-rate * dt));
    if (ap.target === 1 && ap.c > 0.97 && !ap.held) ap.target = 0;
    return Math.abs(gaze.x - gaze.tx) + Math.abs(gaze.y - gaze.ty) + Math.abs(gaze.vx) + Math.abs(gaze.vy) > 1e-4 || Math.abs(ap.c - ap.target) > 1e-3;
  }

  /* Where the iris centre sits in the canvas, and whether a canvas point
     falls inside the opening. */
  const irisAt = () => ({ x: S.cx, y: S.cy + IRIS_Y * S.u });
  function inOpening(x, y) {
    const ex = (x - S.cx) / S.u, ey = (y - S.cy) / S.u;
    const shU = gaze.y * (gaze.y < 0 ? 0.1 : 0.13);
    return Math.abs(ex) < 1 && ey > upperM(ex, shU) && ey < lowerM(ex, gaze.y * 0.03);
  }
  /* The mock-up's lookAt: the target is a plane 1.1 eye-widths in front. */
  function aim(vx, vy) {
    const F = 1.1 * S.u;
    const d = Math.sqrt(vx * vx + vy * vy + F * F);
    gaze.tx = vx / d; gaze.ty = vy / d;
  }

  return { S, gaze, ap, draw, layout, step, irisAt, inOpening, aim };
}

export function startEngraved(section, { still = false } = {}) {
  const eyeEl = section.querySelector('.lh-eye');
  const layer = section.querySelector('.lh-layer-eng') || eyeEl;
  const probe = section.querySelector('.lh-probe');
  const outL = section.querySelector('.lh-readout-l');
  const outR = section.querySelector('.lh-readout-r');
  if (!layer || !probe) return () => {};

  const canvas = document.createElement('canvas');
  canvas.className = 'lh-eng';
  layer.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return () => {};
  }
  const eng = createEngraving();

  function layout() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const cs = getComputedStyle(probe);
    const cx = parseFloat(cs.left);
    const iris = parseFloat(cs.width);
    const dpr = Math.min(2, window.devicePixelRatio || 1, Math.sqrt(4e6 / (w * h)));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    eng.layout(w, h, dpr, Number.isFinite(cx) ? cx - canvas.offsetLeft : w / 2, iris > 0 ? iris : Infinity);
  }

  // Dev only: frame timing and a handle for the still scripts.
  const dbg = import.meta.env && import.meta.env.DEV ? { draws: 0, ms: 0, eng } : null;
  if (dbg) window.__lhEng = dbg;
  function paint() {
    const t0 = dbg ? performance.now() : 0;
    eng.draw(ctx);
    if (dbg) { dbg.draws++; dbg.ms += performance.now() - t0; }
  }

  // ---- readouts: this eye's real state ----
  let mode = 'AUTO';
  let lastL = '';
  let lastR = '';
  function readouts() {
    const l = `f/${STOPS[clamp(Math.round(eng.ap.c * 8), 0, 8)]} · 1/250 · ISO 400`;
    const r = `FOCUS  ${mode} · FRAME ${String(frameCount(section)).padStart(3, '0')}`;
    if (outL && l !== lastL) outL.textContent = lastL = l;
    if (outR && r !== lastR) outR.textContent = lastR = r;
  }

  const ac = new AbortController();
  const opt = { passive: true, signal: ac.signal };
  let stopped = false;
  let raf = 0;
  let last = 0;
  let inView = true;
  let idleT = 0;
  let touchT = 0;

  const ro = new ResizeObserver(() => {
    layout();
    paint();
  });
  layout();
  paint();
  readouts();
  ro.observe(section);
  // The iris labels are set in Geist Mono; draw again once it is certainly in.
  if (document.fonts && document.fonts.load) {
    document.fonts.load('500 10px "Geist Mono"').then(() => { if (!stopped) paint(); }, () => {});
  }

  let io = null;
  if (!still) {
    // ---- input, as the colour eye reads it ----
    let px = 0;
    let py = 0;
    let pointerIn = false;
    let lastMove = -1e9;
    let over = false;
    let touchDown = false;
    let touchUpAt = -1e9;
    let focusEl = null;
    let focusX = 0;
    let focusY = 0;

    const target = (now) => {
      const followTouch = touchDown || now - touchUpAt < 1000;
      const followPtr = pointerIn && now - lastMove < 2500;
      const r = canvas.getBoundingClientRect();
      const c = eng.irisAt();
      if (focusEl) eng.aim(focusX - window.scrollX - r.left - c.x, focusY - window.scrollY - r.top - c.y);
      else if (followTouch || followPtr) eng.aim(px - r.left - c.x, py - r.top - c.y);
      else { eng.gaze.tx = 0; eng.gaze.ty = 0; }
      mode = focusEl || (over && followPtr) ? 'LOCKED' : followPtr || followTouch ? 'TRACKING' : 'AUTO';
    };

    const tick = (now) => {
      raf = 0;
      if (stopped) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      target(now);
      const moving = eng.step(dt);
      paint();
      readouts();
      if (moving && inView) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf && !stopped && inView) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      px = e.clientX;
      py = e.clientY;
      pointerIn = true;
      lastMove = performance.now();
      focusEl = null;
      clearTimeout(idleT);
      idleT = setTimeout(kick, 2550); // look ahead again once the pointer rests
      kick();
    };
    const onOver = (e) => {
      const t = e.target;
      over = !!(t && t.closest && t.closest(INTERACTIVE));
      kick();
    };
    const onOut = (e) => {
      if (!e.relatedTarget && e.pointerType !== 'touch') {
        pointerIn = false;
        over = false;
        kick();
      }
    };
    const onBlur = () => {
      pointerIn = false;
      kick();
    };
    const onEye = (x, y) => {
      const r = canvas.getBoundingClientRect();
      return eng.inOpening(x - r.left, y - r.top);
    };
    // A mouse holds the aperture shut while its button is down. A tap closes
    // it all the way and lets it reopen (step(), ap.held false).
    const onPress = (held) => {
      eng.ap.held = held;
      eng.ap.target = 1;
      fireShutter(section);
      kick();
    };
    const onUp = () => {
      if (!eng.ap.held) return;
      eng.ap.held = false;
      if (eng.ap.c > 0.9) eng.ap.target = 0; // a quick tap still closes all the way, then reopens
      kick();
    };
    const onTouch = (e) => {
      const t = e.touches && e.touches[0];
      if (t) {
        px = t.clientX;
        py = t.clientY;
        touchDown = true;
        lastMove = performance.now();
        focusEl = null;
      } else if (e.type === 'touchend' || e.type === 'touchcancel') {
        touchDown = false;
        touchUpAt = performance.now();
        clearTimeout(touchT);
        touchT = setTimeout(kick, 1050);
      }
      kick();
    };
    const onFocusIn = (e) => {
      const t = e.target;
      if (!t || t === document.body || !t.getBoundingClientRect) return;
      let visible = false;
      try {
        visible = t.matches(':focus-visible');
      } catch {
        visible = false;
      }
      if (!visible) return;
      const r = t.getBoundingClientRect();
      focusEl = t;
      focusX = r.left + r.width / 2 + window.scrollX;
      focusY = r.top + r.height / 2 + window.scrollY;
      kick();
    };
    const onFocusOut = (e) => {
      if (e.target === focusEl) focusEl = null;
      kick();
    };

    document.addEventListener('pointermove', onMove, opt);
    document.addEventListener('pointerover', onOver, opt);
    document.addEventListener('pointerout', onOut, opt);
    watchPresses(section, ac.signal, { hit: onEye, press: onPress, release: onUp });
    window.addEventListener('blur', onBlur, opt);
    document.addEventListener('touchstart', onTouch, opt);
    document.addEventListener('touchmove', onTouch, opt);
    document.addEventListener('touchend', onTouch, opt);
    document.addEventListener('touchcancel', onTouch, opt);
    document.addEventListener('focusin', onFocusIn, opt);
    document.addEventListener('focusout', onFocusOut, opt);

    io = new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting;
      kick();
    });
    io.observe(section);
    // If the visitor is already pointing somewhere, the eye finds it on the first move.
    kick();
  }

  return function stop(freeze) {
    if (!stopped) {
      stopped = true;
      cancelAnimationFrame(raf);
      raf = 0;
      clearTimeout(idleT);
      clearTimeout(touchT);
      ac.abort();
      ro.disconnect();
      if (io) io.disconnect();
      if (dbg && window.__lhEng === dbg) delete window.__lhEng;
      // hand the readouts back at rest, for the colour eye or its poster
      if (outL) outL.textContent = REST_L;
      if (outR) outR.textContent = restR(frameCount(section));
    }
    if (!freeze) canvas.remove();
  };
}
