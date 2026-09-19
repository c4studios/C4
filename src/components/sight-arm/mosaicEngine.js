/*
 * The C4Site hero: a camera journey across a board of chalk letters.
 *
 * The board is a word search that never ends, a labyrinth of letters with real
 * words from the training lying in it. The camera opens tight on LOOK, passes
 * AHEAD, and finds HINDSIGHT. From there the phrase is rebuilt in three places
 * across the board. Letters leave the board and travel the gutters between the
 * rows to their places, letters that are no longer needed walk back into the
 * board, and the letters a phrase keeps are carried to the next place as a
 * caravan. Every journey leaves a thin chalk trail, so by the end the trails
 * have drawn the route.
 *
 *   L1  HINDSIGHT          found lying in the board
 *       FORESIGHT          HIND walks off behind, FORE arrives from ahead;
 *                          the definition is written under it
 *   L2  SEE FORWARD        written down a column, on its side: it only reads
 *                          once the camera has rolled a quarter turn
 *   L3  SEE FOR YOURSELF   the hands-on promise, and a real idiom
 *       SEE FOR YOUR SITE  SELF becomes SITE: L and F fall out, I and T arrive
 *       SEE 4 YOUR SITE    F, O, R fold into the 4
 *       C 4 YOUR SITE      S, E, E fold into the C
 *       C4SITE             YOUR leaves; the C and the 4 lock into the mark
 *
 * Then the camera pulls back over the whole board. Every word it found on the
 * way is lit, the way a finished word search looks, and the trails show the
 * journey. It pushes back in to the name and its entry.
 *
 * The name is three homophones: see = C, for = 4, sight = site. The piece
 * spells that out rather than explaining it.
 *
 * The camera is a spline through poses (x, y, log zoom, roll), one move at a
 * time and never two at once: two tweens on the same camera is what made the
 * first cut halt for a tenth of a second at 1.1s. Everything is derived from
 * the timeline's time, so the same engine renders the live hero and, via
 * seek(), the frames of the exported video. The board is seeded, so every run
 * is the same board.
 */
import gsap from 'gsap';

/* ── The C4 mark, from the site's own logo geometry (C4Logo.jsx) ───────── */
const MARK_C = 'M227.07,440.52l21.95.11c-17.85,20.3-41.9,34.05-68.37,39.1-42.51,8.81-85.9-10.45-108.08-47.97-18.17-30.46-14.55-69.27,8.95-95.79,15.71-18.02,37.74-29.24,61.48-31.32,26.14-3.66,52.76-1.51,77.99,6.28l-17.77,24.76c-14.77-3.1-29.94-3.81-44.94-2.11-20.89,1.13-40,12.19-51.48,29.78-6.66,13.21-8.03,28.49-3.84,42.69,6.27,22.39,23.69,39.88,45.96,46.15,26.61,5.37,54.24,1.23,78.14-11.68Z';
const MARK_BODY = '303.88 303.92 303.87 401.82 271.12 401.82 271.12 343.47 228.18 405.86 271.12 405.86 255.72 428.97 184.95 428.97 184.95 413.1 263.67 303.92 303.88 303.92';
const MARK_ARM = '344.11 405.86 328.71 428.97 303.88 428.97 303.88 482.39 279.58 482.39 279.58 428.97 264.76 428.97 280.17 405.86 344.11 405.86';
const polyPath = (pts) => {
  const n = pts.trim().split(/\s+/).map(Number);
  let d = `M${n[0]} ${n[1]}`;
  for (let i = 2; i < n.length; i += 2) d += `L${n[i]} ${n[i + 1]}`;
  return `${d}Z`;
};
/* Bounds in mark units (measured from a render of the paths). */
const MARK_BOX = { x0: 61, y0: 302.5, x1: 344.2, y1: 482.5 };
const C_BOX = { x0: 61, y0: 302.5, x1: 249.1, y1: 482.5 };
const FOUR_BOX = { x0: 184.9, y0: 303.9, x1: 344.2, y1: 482.4 };

/* ── Palette: the board's own (sight-arm.css) ─────────────────────────── */
const BOARD = '#0e2a22';
const CHALK = '#f2f0e9';
const DIM = '#b9c6bc';
const YELLOW = '#f0ce4a';
const RED = '#e0584c';
const FONT = "'Bricolage Grotesque', 'Segoe UI', sans-serif";

/* ── The board ────────────────────────────────────────────────────────── */
const GW = 124;
const GH = 76;
const GLYPH = 0.62; /* board letters: font size, in cells */
const WORD_GLYPH = 0.84; /* letters once they are part of the phrase */
const FILL = 'EEEEEEEEEEEETTTTTTTTTAAAAAAAAOOOOOOOIIIIIIINNNNNNNSSSSSSHHHHHHRRRRRRDDDDLLLLCCCUUUMMMWWFFGGYYPPBVK';
const VOCAB = [
  'VERIFY', 'CHECK', 'SOURCE', 'PROMPT', 'DRAFT', 'SAFE', 'POLICY', 'TEAM', 'LEARN', 'PLAN',
  'CONTEXT', 'NOTES', 'TRAIN', 'CITE', 'SIGHT', 'SITE', 'FORE', 'SEE', 'FOUR', 'READY',
  'CLASS', 'ASK', 'REVIEW', 'HUMAN', 'DATA', 'PRIVACY', 'WORKFLOW', 'PRACTICE', 'QUESTION',
  'EVIDENCE', 'LESSON', 'BOARD', 'CHALK', 'TEST', 'WHY', 'FORWARD', 'FORESEE',
];
const DEF = {
  head: 'fore·sight',
  tail: '   /ˈfɔː.saɪt/   noun',
  sense: 'Seeing what is coming, and getting ready for it.',
};
const END = {
  head: 'c4·site',
  tail: '   /siː fɔː saɪt/   noun',
  sense: 'Insight, on site. Hands-on AI training where your team works.',
};

/* Where each phrase lies. `ang` is the reading direction: 0 reads across,
   a quarter turn reads down the column with the letters on their side. The
   clearing is `alongHalf` either way along the phrase and from c0 to c1
   across it (c grows below the phrase, where a definition sits). */
const FRAMES = {
  L1: { x: 40, y: 29, ang: 0, alongHalf: 6.6, c0: -1.1, c1: 3.5 },
  L2: { x: 68, y: 22, ang: Math.PI / 2, alongHalf: 5.6, c0: -1.1, c1: 1.1 },
  L3: { x: 82, y: 45, ang: 0, alongHalf: 8.2, c0: -1.1, c1: 3.9 },
};
const frameToWorld = (f, a, c = 0) => [f.x + Math.cos(f.ang) * a - Math.sin(f.ang) * c, f.y + Math.sin(f.ang) * a + Math.cos(f.ang) * c];
const worldToFrame = (f, x, y) => {
  const dx = x - f.x;
  const dy = y - f.y;
  return [Math.cos(f.ang) * dx + Math.sin(f.ang) * dy, -Math.sin(f.ang) * dx + Math.cos(f.ang) * dy];
};
const reserved = (x, y) => Object.values(FRAMES).some((f) => {
  const [a, c] = worldToFrame(f, x, y);
  return Math.abs(a) <= f.alongHalf && c >= f.c0 && c <= f.c1;
});

/* Words the camera finds on its way. A `cue` names the moment it passes
   them; the rest are only lit at the pull-back, when the whole puzzle is
   shown solved. */
const FOUND = [
  { w: 'LOOK', x: 25, y: 19, d: 'h', cue: 'look' },
  { w: 'AHEAD', x: 30, y: 22, d: 'h', cue: 'ahead' },
  { w: 'INSIGHT', x: 51, y: 26, d: 'h', cue: 'transit1' },
  { w: 'HANDS', x: 71, y: 33, d: 'h', cue: 'transit2' },
  { w: 'ON', x: 77, y: 33, d: 'h', cue: 'transit2b' },
  { w: 'VERIFY', x: 46, y: 38, d: 'h' },
  { w: 'SOURCE', x: 58, y: 31, d: 'v' },
  { w: 'ASK', x: 31, y: 36, d: 'h' },
  { w: 'WHY', x: 35, y: 36, d: 'h' },
  { w: 'PRACTICE', x: 76, y: 15, d: 'h' },
  { w: 'TEAM', x: 55, y: 46, d: 'h' },
  { w: 'ONSITE', x: 94, y: 41, d: 'h' },
  { w: 'READY', x: 62, y: 53, d: 'h' },
  { w: 'CHECK', x: 93, y: 27, d: 'v' },
];

function rngFrom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildBoard() {
  const rng = rngFrom(20260919);
  const cells = [];
  for (let y = 0; y < GH; y++) {
    const row = [];
    for (let x = 0; x < GW; x++) row.push({ ch: FILL[Math.floor(rng() * FILL.length)], a: 0.08 + rng() * 0.09, hideAt: Infinity });
    cells.push(row);
  }
  const put = (word, x, y, dir) => {
    for (let i = 0; i < word.length; i++) {
      const cx = dir === 'h' ? x + i : x;
      const cy = dir === 'h' ? y : y + i;
      if (cx < 0 || cy < 0 || cx >= GW || cy >= GH) return;
    }
    for (let i = 0; i < word.length; i++) {
      const cx = dir === 'h' ? x + i : x;
      const cy = dir === 'h' ? y : y + i;
      if (reserved(cx, cy)) continue;
      cells[cy][cx].ch = word[i];
      cells[cy][cx].a = 0.12 + rng() * 0.08;
    }
  };
  for (let k = 0; k < 170; k++) {
    const w = VOCAB[Math.floor(rng() * VOCAB.length)];
    put(w, Math.floor(rng() * GW), Math.floor(rng() * GH), rng() < 0.72 ? 'h' : 'v');
  }
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (reserved(x, y)) cells[y][x].ch = '';
  return cells;
}

/* ── Geometry helpers ─────────────────────────────────────────────────── */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
function polyLen(pts) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return l;
}
function along(pts, len, u) {
  let d = clamp(u, 0, 1) * len;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= seg || i === pts.length - 1) {
      const k = seg ? Math.min(1, d / seg) : 1;
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k, i];
    }
    d -= seg;
  }
  return [pts[pts.length - 1][0], pts[pts.length - 1][1], pts.length - 1];
}

/* A way through the gutters, the half-cell lines between letters. It leaves
   the source square-on, turns `corners` extra times on the way (sometimes
   overshooting, the way a maze makes you), and comes in square-on to the
   target: `endAxis` 'v' arrives from the row gutter above or below, 'h' from
   the column gutter beside it. `leave` forces which side it sets off from,
   so letters leaving together fan out instead of queueing in one gutter. */
function mazeRoute(sx, sy, tx, ty, rng, { corners = 1, startAxis = 'v', endAxis = 'v', leave = 0 } = {}) {
  const sgn = (v) => (v > 0 ? 1 : v < 0 ? -1 : (rng() < 0.5 ? 1 : -1));
  const snap = (v) => Math.floor(v) + 0.5;
  const pts = [[sx, sy]];
  let x = sx;
  let y = sy;
  const ax = endAxis === 'h' ? tx + 0.5 * sgn(sx - tx) : tx;
  const ay = endAxis === 'v' ? ty + 0.5 * sgn(sy - ty) : ty;
  if (startAxis === 'v') y = Math.round(sy) + 0.5 * (leave || sgn(ay - sy));
  else x = Math.round(sx) + 0.5 * (leave || sgn(ax - sx));
  pts.push([x, y]);
  let axis = startAxis === 'v' ? 'h' : 'v';
  const lastAxis = endAxis === 'v' ? 'h' : 'v';
  const n = (axis === lastAxis ? 3 : 2) + 2 * corners;
  for (let k = 0; k < n; k++) {
    const last = Math.floor((n - 1 - k) / 2) === 0;
    const f = corners && rng() < 0.22 ? 1.12 + rng() * 0.2 : 0.3 + rng() * 0.5;
    if (axis === 'h') {
      let nx = ax;
      if (!last) {
        nx = snap(x + (ax - x) * f);
        if (Math.abs(nx - x) < 1) nx = snap(x + sgn(ax - x) * 1.2);
      }
      x = nx;
    } else {
      let ny = ay;
      if (!last) {
        ny = snap(y + (ay - y) * f);
        if (Math.abs(ny - y) < 1) ny = snap(y + sgn(ay - y) * 1.2);
      }
      y = ny;
    }
    pts.push([x, y]);
    axis = axis === 'h' ? 'v' : 'h';
  }
  pts.push([tx, ty]);
  return pts;
}

/* ── The camera path ──────────────────────────────────────────────────── */
/* A chordal Catmull-Rom spline (Barry and Goldman's form) through poses, in
   (x, y, log zoom, roll). Chordal knots keep the velocity continuous through
   every pose, so a multi-pose move is one unbroken glide. */
function camSpline(pts, u) {
  const P = pts.map((p) => [p.x, p.y, Math.log(p.z) * 16, p.r * 40]);
  const out = (v) => ({ x: v[0], y: v[1], z: Math.exp(v[2] / 16), r: v[3] / 40 });
  const n = P.length;
  if (u <= 0) return out(P[0]);
  if (u >= 1) return out(P[n - 1]);
  const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
  if (n === 2) return out(mix(P[0], P[1], u));
  const dist = (a, b) => Math.max(1e-4, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]));
  const Q = [P[0].map((v, i) => 2 * v - P[1][i]), ...P, P[n - 1].map((v, i) => 2 * v - P[n - 2][i])];
  const T = [0];
  for (let i = 1; i < Q.length; i++) T.push(T[i - 1] + dist(Q[i - 1], Q[i]));
  const t = T[1] + u * (T[n] - T[1]);
  let i = 1;
  while (i < n - 1 && t > T[i + 1]) i++;
  const [p0, p1, p2, p3] = [Q[i - 1], Q[i], Q[i + 1], Q[i + 2]];
  const [t0, t1, t2, t3] = [T[i - 1], T[i], T[i + 1], T[i + 2]];
  const A1 = mix(p0, p1, (t - t0) / (t1 - t0));
  const A2 = mix(p1, p2, (t - t1) / (t2 - t1));
  const A3 = mix(p2, p3, (t - t2) / (t3 - t2));
  const B1 = mix(A1, A2, (t - t0) / (t2 - t0));
  const B2 = mix(A2, A3, (t - t1) / (t3 - t1));
  return out(mix(B1, B2, (t - t1) / (t2 - t1)));
}

/* ── Chalk grain ──────────────────────────────────────────────────────── */
function grainPattern(ctx, colour, seed) {
  const size = 96;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  const rng = rngFrom(seed);
  const [r, gg, b] = [1, 3, 5].map((i) => parseInt(colour.slice(i, i + 2), 16));
  for (let i = 0; i < size * size; i++) {
    const v = rng();
    img.data[i * 4] = r;
    img.data[i * 4 + 1] = gg;
    img.data[i * 4 + 2] = b;
    img.data[i * 4 + 3] = v < 0.1 ? 40 : 170 + Math.floor(rng() * 85);
  }
  g.putImageData(img, 0, 0);
  return ctx.createPattern(c, 'repeat');
}

/* The board as a surface: eraser swipes and cleaner patches, in world space so
   it travels under the camera. The clearings are wiped harder, which is why
   they are clear. Low frequency on purpose; it is scaled up a long way. */
const SM = 8; /* material px per cell */
function boardMaterial() {
  const c = document.createElement('canvas');
  c.width = GW * SM;
  c.height = GH * SM;
  const g = c.getContext('2d');
  const rng = rngFrom(4041);
  const blob = (x, y, len, wid, ang, rgb, a) => {
    g.save();
    g.translate(x, y);
    g.rotate(ang);
    g.scale(len, wid);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    gr.addColorStop(0, `rgba(${rgb},${a})`);
    gr.addColorStop(0.55, `rgba(${rgb},${a * 0.55})`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr;
    g.beginPath();
    g.arc(0, 0, 1, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };
  for (let k = 0; k < 46; k++) blob(rng() * c.width, rng() * c.height, 50 + rng() * 190, 12 + rng() * 38, (rng() - 0.5) * 0.7, '242,240,233', 0.02 + rng() * 0.045);
  for (let k = 0; k < 22; k++) blob(rng() * c.width, rng() * c.height, 70 + rng() * 200, 30 + rng() * 70, (rng() - 0.5) * 1.2, '3,12,9', 0.1 + rng() * 0.16);
  Object.values(FRAMES).forEach((fr) => {
    for (let k = 0; k < 7; k++) {
      const a = (rng() - 0.5) * 2 * fr.alongHalf;
      const cMid = (fr.c0 + fr.c1) / 2 + (rng() - 0.5) * (fr.c1 - fr.c0) * 0.7;
      const [wx, wy] = frameToWorld(fr, a, cMid);
      blob((wx + 0.5) * SM, (wy + 0.5) * SM, (3 + rng() * 5) * SM, (0.7 + rng() * 1.1) * SM, fr.ang + (rng() - 0.5) * 0.25, '242,240,233', 0.025 + rng() * 0.03);
    }
  });
  return c;
}

/* Film grain: a small tile of light and dark specks, shifted every frame. */
function grainTile() {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  const rng = rngFrom(909);
  for (let i = 0; i < size * size; i++) {
    const v = rng() < 0.5 ? 255 : 0;
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = Math.floor(rng() * rng() * 34);
  }
  g.putImageData(img, 0, 0);
  return c;
}

/* A ring the way a hand draws one round a found word: a capsule that wobbles,
   overshoots its start and does not quite close. */
function ringPoints(cx, cy, halfLen, halfWid, ang, seed) {
  const rng = rngFrom(seed);
  const pts = [];
  const N = 72;
  const straight = Math.max(0, halfLen - halfWid);
  const per = 4 * straight + 2 * Math.PI * halfWid;
  const phase = rng() * 6;
  const start = rng() * 0.2;
  for (let k = 0; k <= N; k++) {
    const u = start + (k / N) * 1.07;
    let d = (u % 1) * per;
    let x;
    let y;
    if (d < 2 * straight) { x = -straight + d; y = -halfWid; } else {
      d -= 2 * straight;
      if (d < Math.PI * halfWid) { const th = -Math.PI / 2 + d / halfWid; x = straight + Math.cos(th) * halfWid; y = Math.sin(th) * halfWid; } else {
        d -= Math.PI * halfWid;
        if (d < 2 * straight) { x = straight - d; y = halfWid; } else {
          d -= 2 * straight;
          const th = Math.PI / 2 + d / halfWid;
          x = -straight + Math.cos(th) * halfWid;
          y = Math.sin(th) * halfWid;
        }
      }
    }
    const grow = 1 + 0.035 * Math.sin(k * 0.55 + phase) + (rng() - 0.5) * 0.02 + (k / N) * 0.05;
    x *= grow;
    y *= grow;
    pts.push([cx + Math.cos(ang) * x - Math.sin(ang) * y, cy + Math.sin(ang) * x + Math.cos(ang) * y]);
  }
  return pts;
}
const hash = (a, b) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };

/* ── The engine ───────────────────────────────────────────────────────── */
export function createSiteMosaic(host, { autoplay = true, onDone } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'sg-mosaic-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: false });
  const paths = { c: new Path2D(MARK_C), body: new Path2D(polyPath(MARK_BODY)), arm: new Path2D(polyPath(MARK_ARM)) };
  const grain = { chalk: grainPattern(ctx, CHALK, 11), yellow: grainPattern(ctx, YELLOW, 12), red: grainPattern(ctx, RED, 13) };
  const material = boardMaterial();
  const film = ctx.createPattern(grainTile(), 'repeat');
  let vignette = null;
  let keyLight = null;

  let W = 1;
  let H = 1;
  let dpr = 1;
  let S = null; /* the planned scene: board, tiles, moves, camera, timeline */
  let bitmap = null;
  let running = false;
  let destroyed = false;
  const BMP = 24; /* bitmap px per cell */

  function buildBitmap(cells) {
    const c = document.createElement('canvas');
    c.width = GW * BMP;
    c.height = GH * BMP;
    const g = c.getContext('2d');
    g.font = `600 ${GLYPH * BMP}px ${FONT}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = CHALK;
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
      const cell = cells[y][x];
      if (!cell.ch) continue;
      g.globalAlpha = cell.a;
      g.fillText(cell.ch, (x + 0.5) * BMP, (y + 0.54) * BMP);
    }
    return c;
  }

  /* ── Plan: every tile, move and camera beat, as one paused timeline ── */
  function plan() {
    const cells = buildBoard();
    const rng = rngFrom(77);
    const tiles = [];
    const moves = [];
    const camMoves = [];
    const marks = []; /* chalk gestures: rings round found words, a strike-through */
    const cues = []; /* what happens when, for the video's sound */
    const cue = (t, k, extra = {}) => cues.push({ t: +t.toFixed(3), k, ...extra });
    const used = new Set();
    const key = (x, y) => `${x},${y}`;
    const tl = gsap.timeline({ paused: true });
    const txt = { defA: 0, defN: 0, endA: 0, endN: 0, dim: 1, trail: 1 };
    const view = { w: W, h: H };
    const zMax = Math.min(view.w / 6.2, view.h / 2.1);
    const zRead = Math.max(26, Math.min(view.w / 10, 48));
    const zWide = Math.max(20, Math.min(view.w / 30, view.h / 14));
    const zFar = Math.max(13, Math.min(view.w / 70, view.h / 30));
    const { L1, L2, L3 } = FRAMES;

    /* Phrase layout from the face's real advance widths, so a phrase sets as
       type rather than as a grid. The C and the 4 take the mark's proportions.
       Offsets are along the phrase, from its centre. */
    const measure = document.createElement('canvas').getContext('2d');
    measure.font = `720 100px ${FONT}`;
    const TRACK = 0.03;
    const widthOf = (ch) => {
      if (ch === ' ') return 0.3;
      if (ch === 'C') return 0.6 * (C_BOX.x1 - C_BOX.x0) / (C_BOX.y1 - C_BOX.y0);
      if (ch === '4') return 0.6 * (FOUR_BOX.x1 - FOUR_BOX.x0) / (FOUR_BOX.y1 - FOUR_BOX.y0);
      return (measure.measureText(ch).width / 100) * WORD_GLYPH;
    };
    const layouts = new Map();
    const layout = (phrase) => {
      if (layouts.has(phrase)) return layouts.get(phrase);
      const ws = [...phrase].map(widthOf);
      const total = ws.reduce((s, w) => s + w, 0) + TRACK * (ws.length - 1);
      let x = -total / 2;
      const xs = ws.map((w) => { const c = x + w / 2; x += w + TRACK; return c; });
      const out = { xs, ws, total };
      layouts.set(phrase, out);
      return out;
    };
    const slotW = (f, phrase, i) => frameToWorld(f, layout(phrase).xs[i], 0);
    const phraseBox = (phrase, extraBelow = 0) => ({ a0: -layout(phrase).total / 2 - 0.5, a1: layout(phrase).total / 2 + 0.5, c0: -0.9, c1: 0.9 + extraBelow });
    const fit = (f, b, padX = 0.12, padY = 0.2) => {
      const z = Math.min(zMax, view.w * (1 - 2 * padX) / (b.a1 - b.a0), view.h * (1 - 2 * padY) / (b.c1 - b.c0));
      const [x, y] = frameToWorld(f, (b.a0 + b.a1) / 2, (b.c0 + b.c1) / 2);
      return { x, y, z, r: -f.ang };
    };

    /* A wide pose is pushed in until its (rolled) view sits inside the board,
       so no shot ever sees past the edge of it. */
    const safe = (p) => {
      const cr = Math.abs(Math.cos(p.r));
      const sr = Math.abs(Math.sin(p.r));
      const ex = view.w / 2 * cr + view.h / 2 * sr;
      const ey = view.w / 2 * sr + view.h / 2 * cr;
      const z = Math.max(p.z, ex / (p.x - 0.5), ex / (GW - 1.5 - p.x), ey / (p.y - 0.5), ey / (GH - 1.5 - p.y));
      return { ...p, z };
    };

    /* ── Camera: one move at a time, each starting where the last ended ── */
    const cam0 = { x: 26.5, y: 19, z: zMax * 1.35, r: -0.07 };
    let camEnd = cam0;
    let camFree = 0;
    const camTo = (at, dur, poses, ease = 'power2.inOut') => {
      const start = Math.max(at, camFree);
      const m = { pts: [camEnd, ...poses], u: 0 };
      camMoves.push(m);
      tl.to(m, { u: 1, duration: dur, ease }, start);
      {
        const a = camEnd;
        const b = poses[poses.length - 1];
        cue(start, 'whoosh', { d: dur, v: Math.min(1, Math.hypot(b.x - a.x, b.y - a.y) / 30 + Math.abs(Math.log(b.z / a.z)) / 2.5 + Math.abs(b.r - a.r) / 1.6) });
      }
      camEnd = poses[poses.length - 1];
      camFree = start + dur;
      return camFree;
    };
    /* Settle on a phrase. Where it fits, arrive a touch tight on its first
       words and ease out to the whole of it while it is read. On a narrow
       stage a long phrase is read by panning along it instead of shrinking it
       past legibility. */
    const settle = (at, f, box, dur, hold, { via = [], read = false, padX, padY } = {}) => {
      const tight = fit(f, box, padX, padY);
      if (tight.z >= zRead) {
        if (!read) return camTo(at, dur, [...via, tight]);
        const [sx, sy] = frameToWorld(f, (box.a0 + box.a1) / 2 - (box.a1 - box.a0) * 0.16, (box.c0 + box.c1) / 2);
        const end = camTo(at, dur, [...via, { x: sx, y: sy, z: Math.min(zMax, tight.z * 1.2), r: tight.r }]);
        return camTo(end, Math.max(0.8, hold), [tight], 'sine.inOut');
      }
      const half = (view.w * 0.44) / zRead;
      const mid = (box.a0 + box.a1) / 2;
      const cMid = (box.c0 + box.c1) / 2;
      const [lx, ly] = frameToWorld(f, Math.min(box.a0 + half, mid), cMid);
      const [rx, ry] = frameToWorld(f, Math.max(box.a1 - half, mid), cMid);
      const end = camTo(at, dur, [...via, { x: lx, y: ly, z: zRead, r: tight.r }]);
      return camTo(end, Math.max(0.6, hold), [{ x: rx, y: ry, z: zRead, r: tight.r }], 'sine.inOut');
    };

    /* ── Tiles and their journeys ── */
    const tile = (ch, x, y, a, extra = {}) => {
      const t = { ch, x0: x, y0: y, cx: x, cy: y, a, g: WORD_GLYPH, hl: 0, s: 1, rot: 0, lock: 0, glyph: 'text', frame: null, moves: [], ...extra };
      tiles.push(t);
      return t;
    };
    const move = (t, pts, at, dur, ease = 'power2.inOut', trail = true, dust = false) => {
      const m = { t, pts, len: polyLen(pts), u: 0, trail, ta: trail ? 0.3 : 0, dust, end: at + dur, seed: moves.length + 1 };
      if (dust) cue(at + dur, 'land', { x: pts[pts.length - 1][0] });
      t.moves.push(m);
      moves.push(m);
      tl.to(m, { u: 1, duration: dur, ease }, at);
      if (trail) tl.to(m, { ta: 0.13, duration: 1.4, ease: 'power1.out' }, at + dur);
      t.cx = pts[pts.length - 1][0];
      t.cy = pts[pts.length - 1][1];
      return m;
    };
    const flash = (t, at, hold = 0.5) => {
      tl.to(t, { hl: 1, duration: 0.18, ease: 'power1.out' }, at);
      tl.to(t, { hl: 0, duration: 0.7, ease: 'power1.inOut' }, at + hold);
    };
    const pick = (test, tx, ty, band) => {
      for (let b = 0; b < 6; b++) {
        const cands = [];
        const hi = band[1] + b * 5;
        for (let y = 1; y < GH - 1; y++) for (let x = 1; x < GW - 1; x++) {
          const c = cells[y][x];
          if (!c.ch || c.hideAt !== Infinity || used.has(key(x, y))) continue;
          const d = Math.abs(x - tx) + Math.abs(y - ty);
          if (d < band[0] || d > hi) continue;
          if (test(c, x, y, b)) cands.push([x, y]);
        }
        if (cands.length) return cands[Math.floor(rng() * cands.length)];
      }
      throw new Error('mosaic: no cell to pick');
    };
    /* A letter leaves the board for slot i of a phrase. `side` picks which
       side of the phrase it comes from, `ahead` whether from further along
       the reading direction or from behind it. */
    const recruit = (ch, f, phrase, i, at, { band = [5, 11], side = 0, ahead = 0, corners = 1, speed = 12, maxDur = 2.0 } = {}) => {
      const [tx, ty] = slotW(f, phrase, i);
      const [sx, sy] = pick((c, x, y, b) => {
        if (c.ch !== ch) return false;
        const [fa, fc] = worldToFrame(f, x, y);
        if (Math.abs(fc) < 1.6) return false;
        if (b < 3 && side && Math.sign(fc) !== side) return false;
        if (b < 2 && ahead && Math.sign(fa - layout(phrase).xs[i]) !== ahead) return false;
        return true;
      }, tx, ty, band);
      used.add(key(sx, sy));
      const cell = cells[sy][sx];
      cell.hideAt = at;
      const t = tile(ch, sx, sy, 0, { g: GLYPH, frame: f });
      const pts = mazeRoute(sx, sy, tx, ty, rng, { corners, startAxis: rng() < 0.5 ? 'v' : 'h', endAxis: f.ang ? 'h' : 'v' });
      const dur = clamp(0.4 + polyLen(pts) / speed, 0.8, maxDur);
      tl.set(t, { a: cell.a }, at);
      tl.to(t, { a: 1, duration: 0.35, ease: 'power1.out' }, at + 0.02);
      tl.to(t, { g: WORD_GLYPH, duration: dur * 0.8, ease: 'power2.inOut' }, at + dur * 0.2);
      if (f.ang) tl.to(t, { rot: f.ang, duration: dur * 0.6, ease: 'power2.inOut' }, at + dur * 0.3);
      flash(t, at, Math.max(0.3, dur - 0.25));
      move(t, pts, at, dur, 'power2.inOut', true, true);
      cue(at, 'leave');
      t.landAt = at + dur;
      return t;
    };
    /* A letter the next phrase keeps is carried to it, the long way. */
    const carry = (t, f, phrase, i, at, { corners = 2, speed = 18, maxDur = 3.3, leave = 0 } = {}) => {
      const [tx, ty] = slotW(f, phrase, i);
      const from = t.frame;
      const pts = mazeRoute(t.cx, t.cy, tx, ty, rng, { corners, leave, startAxis: from && from.ang ? 'h' : 'v', endAxis: f.ang ? 'h' : 'v' });
      const dur = clamp(0.4 + polyLen(pts) / speed, 0.9, maxDur);
      move(t, pts, at, dur, 'power2.inOut', true, true);
      tl.to(t, { rot: f.ang, duration: dur * 0.6, ease: 'power2.inOut' }, at + dur * 0.2);
      flash(t, at + dur - 0.3, 0.35);
      t.frame = f;
      t.landAt = at + dur;
      return t;
    };
    /* A letter the phrase no longer needs walks back into the board. */
    const depart = (t, at, { band = [4, 10], side = 0, ahead = 0, corners = 1, speed = 12, maxDur = 1.7 } = {}) => {
      const f = t.frame;
      const [fa0] = worldToFrame(f, t.cx, t.cy);
      const [px, py] = pick((c, x, y, b) => {
        const [fa, fc] = worldToFrame(f, x, y);
        if (Math.abs(fc) < 2) return false;
        if (b < 3 && side && Math.sign(fc) !== side) return false;
        if (b < 2 && ahead && Math.sign(fa - fa0) !== ahead) return false;
        return true;
      }, t.cx, t.cy, band);
      used.add(key(px, py));
      const cell = cells[py][px];
      const pts = mazeRoute(t.cx, t.cy, px, py, rng, { corners, startAxis: f.ang ? 'h' : 'v', endAxis: rng() < 0.5 ? 'v' : 'h' });
      const dur = clamp(0.4 + polyLen(pts) / speed, 0.8, maxDur);
      cell.hideAt = at + dur * 0.9;
      move(t, pts, at, dur);
      cue(at, 'leave');
      tl.to(t, { a: Math.min(0.3, cell.a * 1.8), duration: dur * 0.55, ease: 'power1.in' }, at + dur * 0.45);
      tl.to(t, { g: GLYPH, duration: dur * 0.7, ease: 'power2.inOut' }, at + dur * 0.3);
      if (t.rot) tl.to(t, { rot: 0, duration: dur * 0.6, ease: 'power2.inOut' }, at + dur * 0.2);
      return [px, py];
    };
    /* Along the phrase. A letter crossing others takes its own lane. */
    const slide = (t, f, phrase, i, at, dur = 0.75, lane = 0) => {
      const a1 = layout(phrase).xs[i];
      const [a0] = worldToFrame(f, t.cx, t.cy);
      if (Math.abs(a1 - a0) < 0.01) return;
      const pts = lane
        ? [frameToWorld(f, a0), frameToWorld(f, a0, lane), frameToWorld(f, a1, lane), frameToWorld(f, a1)]
        : [frameToWorld(f, a0), frameToWorld(f, a1)];
      move(t, pts, at, dur, 'power3.inOut', Boolean(lane));
    };
    /* Letters fold into a glyph of the mark: they spin in and the glyph lands. */
    const fold = (ts, f, phrase, i, glyph, at) => {
      const [gx, gy] = slotW(f, phrase, i);
      ts.forEach((t, k) => {
        move(t, [[t.cx, t.cy], [gx, gy]], at, 0.42, 'power3.in', false);
        tl.to(t, { rot: (k - 1) * 1.4 || 0.9, duration: 0.42, ease: 'power2.in' }, at);
        tl.to(t, { a: 0, s: 0.55, duration: 0.25, ease: 'power1.in' }, at + 0.22);
      });
      const g = tile(glyph, gx, gy, 0, { glyph, frame: f });
      cue(at + 0.38, 'fold');
      tl.to(g, { a: 1, duration: 0.15 }, at + 0.36);
      tl.fromTo(g, { s: 1.8, rot: -0.35 }, { s: 1, rot: 0, duration: 0.7, ease: 'back.out(2.4)' }, at + 0.36);
      return g;
    };
    const landed = (ts) => Math.max(...ts.map((t) => t.landAt || 0));
    const ring = (cx, cy, halfLen, halfWid, ang, at, dur = 0.55, colour = 'yellow') => {
      const m = { pts: ringPoints(cx, cy, halfLen, halfWid, ang, marks.length * 31 + 7), p: 0, a: 0.9, colour, w: 0.075 };
      marks.push(m);
      tl.to(m, { p: 1, duration: dur, ease: 'power1.inOut' }, at);
      cue(at, 'scrape', { d: dur });
      return m;
    };

    /* Words the camera finds on the way. Each is a row of tiles over blanked
       cells, so it can be lit as the camera passes and again at the end. */
    const found = FOUND.map(({ w, x, y, d, cue }) => ({
      cue,
      ts: w.split('').map((ch, i) => {
        const cx = d === 'h' ? x + i : x;
        const cy = d === 'h' ? y : y + i;
        cells[cy][cx].ch = '';
        return tile(ch, cx, cy, 0.19, { g: GLYPH });
      }),
    }));
    const ringWord = (fw, at) => {
      const a = fw.ts[0];
      const b = fw.ts[fw.ts.length - 1];
      fw.ringed = true;
      return ring((a.x0 + b.x0) / 2, (a.y0 + b.y0) / 2, Math.hypot(b.x0 - a.x0, b.y0 - a.y0) / 2 + 0.66, 0.6, Math.atan2(b.y0 - a.y0, b.x0 - a.x0), at);
    };
    const light = (name, at) => found.filter((fw) => fw.cue === name).forEach((fw) => {
      fw.ts.forEach((t, i) => {
        tl.to(t, { a: 0.95, duration: 0.25, ease: 'power1.out' }, at + i * 0.06);
        flash(t, at + i * 0.06, 0.45);
        tl.to(t, { a: 0.62, duration: 0.9, ease: 'power1.inOut' }, at + i * 0.06 + 1.0);
      });
      cue(at, 'found');
      ringWord(fw, at + 0.18);
    });

    const P0 = 'HINDSIGHT';
    const P1 = 'FORESIGHT';
    const P2 = 'SEE FORWARD';
    const P3 = 'SEE FOR YOURSELF';
    const P4 = 'SEE FOR YOUR SITE';
    const P5 = 'SEE 4 YOUR SITE';
    const P6 = 'C 4 YOUR SITE';

    /* ── Beat 1: LOOK, AHEAD, and HINDSIGHT lying in the board ── */
    const hs = P0.split('').map((ch, i) => tile(ch, L1.x - 4 + i, L1.y, 0.17, { g: GLYPH, frame: L1 }));
    camTo(0, 3.2, [
      { x: 32, y: 22.2, z: zMax * 0.84, r: -0.04 },
      fit(L1, phraseBox(P1, 2.2), 0.1, 0.16),
    ], 'sine.inOut');
    light('look', 0.1);
    light('ahead', 0.95);
    hs.forEach((t, i) => {
      tl.to(t, { a: 1, duration: 0.3, ease: 'power1.out' }, 2.2 + i * 0.08);
      flash(t, 2.2 + i * 0.08, 0.35);
    });

    cue(2.2, 'found');
    const hindRing = ring(L1.x, L1.y, 4.75, 0.62, 0, 2.85, 0.6);
    /* HIND is struck through, and walks off behind; FORE arrives from ahead. */
    let T = 3.75;
    const strike = { pts: [[L1.x - 4.55, L1.y + 0.07], [L1.x - 3.2, L1.y - 0.02], [L1.x - 1.9, L1.y + 0.03], [L1.x - 0.5, L1.y - 0.08]], p: 0, a: 0.95, colour: 'chalk', w: 0.085 };
    marks.push(strike);
    tl.to(strike, { p: 1, duration: 0.22, ease: 'power2.out' }, T - 0.3);
    cue(T - 0.3, 'scrape', { d: 0.22 });
    tl.to([strike, hindRing], { a: 0, duration: 0.5, ease: 'power1.in' }, T + 0.05);
    const [H0, I0, N0, D0, S1, I, G, Hh, Tt] = hs;
    [H0, I0, N0, D0].forEach((t, i) => depart(t, T + i * 0.09, { band: [5, 10], side: i % 2 ? -1 : 1, ahead: -1 }));
    [S1, I, G, Hh, Tt].forEach((t, i) => {
      slide(t, L1, P1, 4 + i, T + 0.5, 0.75);
      tl.to(t, { g: WORD_GLYPH, duration: 0.75, ease: 'power3.inOut' }, T + 0.5);
    });
    const fore = 'FORE'.split('').map((ch, i) => recruit(ch, L1, P1, i, T + 0.2 + i * 0.12, { band: [5, 10], side: i % 2 ? 1 : -1, ahead: 1, maxDur: 1.4 }));
    const [F, O, R, E1] = fore;
    let done = landed(fore);
    const defLen = DEF.head.length + DEF.tail.length + DEF.sense.length;
    tl.to(txt, { defA: 1, duration: 0.5, ease: 'power1.out' }, done + 0.05);
    tl.to(txt, { defN: defLen, duration: 1.2, ease: 'none' }, done + 0.05);
    cue(done + 0.05, 'type', { d: 1.2, n: defLen });

    /* ── Beat 2: SEE FORWARD, down a column. The camera rolls to read it. ── */
    T = Math.max(8.0, done + 2.3);
    tl.to(txt, { defA: 0, duration: 0.4, ease: 'power1.in' }, T - 0.1);
    light('transit1', T + 1.5);
    [I, G, Hh, Tt].forEach((t, i) => depart(t, T + 0.05 + i * 0.08, { band: [4, 9], side: i % 2 ? 1 : -1 }));
    const caravan2 = [[S1, 0], [E1, 1], [F, 4], [O, 5], [R, 6]].map(([t, i], k) => carry(t, L2, P2, i, T + 0.25 + k * 0.2, { leave: k % 2 ? 1 : -1, corners: 1 + (k % 2) }));
    const E2 = recruit('E', L2, P2, 2, T + 1.7, { band: [5, 10], side: 1 });
    const ward = 'WARD'.split('').map((ch, i) => recruit(ch, L2, P2, 7 + i, T + 1.85 + i * 0.13, { band: [5, 11], side: i % 2 ? -1 : 1 }));
    done = Math.max(landed(caravan2), landed(ward), E2.landAt);
    settle(T + 0.55, L2, phraseBox(P2), 2.5, done - (T + 3.05) + 0.5, {
      via: [safe({ x: (L1.x + L2.x) / 2, y: (L1.y + L2.y) / 2 + 0.5, z: zWide, r: -L2.ang * 0.42 })],
      read: true,
    });

    /* ── Beat 3: SEE FOR YOURSELF, across the board again ── */
    T = done + 0.9;
    light('transit2', T + 1.45);
    light('transit2b', T + 1.7);
    ward.forEach((t, i) => depart(t, T + 0.05 + i * 0.08, { band: [4, 10], side: i % 2 ? -1 : 1 }));
    const caravan3 = [[S1, 0], [E1, 1], [E2, 2], [F, 4], [O, 5], [R, 6]].map(([t, i], k) => carry(t, L3, P3, i, T + 0.25 + k * 0.18, { leave: k % 2 ? -1 : 1, corners: 1 + ((k + 1) % 2) }));
    const self = 'YOURSELF'.split('').map((ch, i) => recruit(ch, L3, P3, 8 + i, T + 1.6 + i * 0.1, { band: [5, 12], side: i % 2 ? -1 : 1, ahead: i % 3 === 0 ? 1 : 0 }));
    const [Y, O2, U, R2, S2, E3, Ll, F2] = self;
    done = Math.max(landed(caravan3), landed(self));
    settle(T + 0.55, L3, phraseBox(P3), 2.5, done - (T + 3.05) + 0.6, {
      via: [safe({ x: (L2.x + L3.x) / 2 - 1, y: (L2.y + L3.y) / 2, z: zWide, r: -L2.ang * 0.5 })],
      read: true,
    });

    /* ── Beat 4: SELF becomes SITE. The L and the F fall out. ── */
    T = done + 1.0;
    [[Ll, -0.3, 2.3, -0.5], [F2, 0.35, 2.55, 0.42]].forEach(([t, dx, dy, rot], i) => {
      move(t, [[t.cx, t.cy], [t.cx + dx, t.cy + dy]], T + i * 0.1, 0.95, 'bounce.out', false);
      cue(T + i * 0.1 + 0.36, 'drop');
      tl.to(t, { rot, duration: 0.9, ease: 'power2.out' }, T + i * 0.1);
      tl.to(t, { a: 0.3, duration: 0.9, ease: 'power1.in' }, T + 0.3 + i * 0.1);
      tl.to(t, { a: 0, duration: 1.1, ease: 'power1.inOut' }, T + 1.9 + i * 0.1);
    });
    [[S1, 0], [E1, 1], [E2, 2], [F, 4], [O, 5], [R, 6], [Y, 8], [O2, 9], [U, 10], [R2, 11], [S2, 13]].forEach(([t, i]) => slide(t, L3, P4, i, T + 0.45, 0.75));
    slide(E3, L3, P4, 16, T + 0.45, 0.85, -0.62);
    const I2 = recruit('I', L3, P4, 14, T + 0.3, { band: [4, 9], side: -1, corners: 0, maxDur: 1.2 });
    const T2 = recruit('T', L3, P4, 15, T + 0.4, { band: [4, 9], side: -1, corners: 0, maxDur: 1.2 });
    const site = [S2, I2, T2, E3];
    done = Math.max(I2.landAt, T2.landAt, T + 1.3);
    site.forEach((t, i) => flash(t, done + 0.05 + i * 0.06, 0.6));
    settle(T + 0.2, L3, phraseBox(P4), 1.1, 0.7);

    /* ── Beat 5: F, O, R fold into the 4 ── */
    T = done + 1.15;
    const four = fold([F, O, R], L3, P5, 4, '4', T);
    [[S1, 0], [E1, 1], [E2, 2], [Y, 6], [O2, 7], [U, 8], [R2, 9], [S2, 11], [I2, 12], [T2, 13], [E3, 14]].forEach(([t, i]) => slide(t, L3, P5, i, T + 0.3, 0.6));
    settle(T + 0.2, L3, phraseBox(P5), 0.9, 0.6);

    /* ── Beat 6: S, E, E fold into the C ── */
    T += 1.7;
    const cee = fold([S1, E1, E2], L3, P6, 0, 'C', T);
    slide(four, L3, P6, 2, T + 0.3, 0.6);
    [[Y, 4], [O2, 5], [U, 6], [R2, 7], [S2, 9], [I2, 10], [T2, 11], [E3, 12]].forEach(([t, i]) => slide(t, L3, P6, i, T + 0.3, 0.6));
    settle(T + 0.2, L3, phraseBox(P6), 0.9, 0.6);

    /* ── Beat 7: YOUR leaves, the C and the 4 lock into the mark ── */
    T += 1.7;
    [Y, O2, U, R2].forEach((t, i) => depart(t, T + 0.05 + i * 0.07, { band: [5, 13], side: i % 2 ? 1 : -1 }));
    const markH = 0.8;
    const markW = markH * (MARK_BOX.x1 - MARK_BOX.x0) / (MARK_BOX.y1 - MARK_BOX.y0);
    const gap = 0.16;
    const siteW = layout('SITE');
    const lockW = markW + gap + siteW.total;
    const left = L3.x - lockW / 2;
    const lock = { x: left + markW / 2, y: L3.y - 0.1, h: markH };
    [cee, four].forEach((t) => {
      t.lockFrame = lock;
      tl.to(t, { lock: 1, duration: 0.95, ease: 'power3.inOut' }, T + 0.55);
    });
    cue(T + 1.42, 'lock');
    site.forEach((t, i) => move(t, [[t.cx, t.cy], [left + markW + gap + siteW.xs[i] + siteW.total / 2, L3.y]], T + 0.55, 0.95, 'power3.inOut', false));
    camTo(T + 0.3, 1.1, [fit(L3, { a0: -lockW / 2 - 0.4, a1: lockW / 2 + 0.4, c0: -0.8, c1: 0.7 }, 0.2, 0.3)]);

    /* Pull back over the board: the puzzle is solved and the trails show the
       way it was walked. The wide shot travels the route, start to finish. */
    T += 1.9;
    camTo(T, 3.5, [
      safe({ x: (L1.x + L2.x) / 2, y: (L1.y + L2.y) / 2 + 6.5, z: zFar, r: -0.03 }),
      safe({ x: L3.x - 12, y: L3.y - 5, z: zFar * 1.06, r: -0.012 }),
    ], 'power2.inOut');
    tl.to(txt, { dim: 0.62, trail: 3.6, duration: 1.4, ease: 'power1.inOut' }, T + 0.2);
    found.forEach((fw, k) => {
      fw.ts.forEach((t, i) => {
        tl.to(t, { a: 0.92, duration: 0.4, ease: 'power1.out' }, T + 0.7 + k * 0.09 + i * 0.03);
        tl.to(t, { hl: 0.85, duration: 0.4, ease: 'power1.out' }, T + 0.7 + k * 0.09 + i * 0.03);
        tl.to(t, { a: 0.6, hl: 0, duration: 1.2, ease: 'power1.inOut' }, T + 3.3);
      });
      if (!fw.ringed) ringWord(fw, T + 0.8 + k * 0.11);
    });
    /* The name is the last word found. */
    const nameRing = ring(L3.x, L3.y - 0.05, lockW / 2 + 0.85, 0.98, 0, T + 2.1, 0.8);
    nameRing.w = 0.09;
    tl.to(nameRing, { a: 0.7, duration: 1.4, ease: 'power1.inOut' }, T + 3.6);
    tl.to(txt, { dim: 0.9, trail: 0.5, duration: 1.8, ease: 'power1.inOut' }, T + 3.0);
    /* And back in, to the name and its entry. */
    const endHalf = Math.max(lockW / 2 + 0.9, Math.min(5.6, (view.w / view.h) * 1.9));
    T = camTo(T + 3.5, 2.0, [fit(L3, { a0: -endHalf, a1: endHalf, c0: -1.1, c1: view.w < 640 ? 3.1 : 2.5 }, 0.08, 0.12)], 'power3.inOut');
    const endLen = END.head.length + END.tail.length + END.sense.length;
    tl.to(txt, { endA: 1, duration: 0.6, ease: 'power1.out' }, T - 1.0);
    tl.to(txt, { endN: endLen, duration: 1.4, ease: 'none' }, T - 1.0);
    cue(T - 1.0, 'type', { d: 1.4, n: endLen });
    tl.to({}, { duration: 0.8 }, T + 0.5);

    cues.sort((a, b) => a.t - b.t);
    return { cells, tiles, moves, camMoves, marks, cues, cam0, tl, txt, view };
  }

  /* ── Drawing ── */
  function tilePos(t) {
    for (let i = t.moves.length - 1; i >= 0; i--) {
      const m = t.moves[i];
      if (m.u > 0) return along(m.pts, m.len, m.u);
    }
    return [t.x0, t.y0];
  }

  /* The pose of the latest move under way, plus a breath of drift so that a
     held shot is never quite still. */
  function camPose() {
    let c = S.cam0;
    for (let i = S.camMoves.length - 1; i >= 0; i--) {
      const m = S.camMoves[i];
      if (m.u > 0) { c = camSpline(m.pts, m.u); break; }
    }
    const t = S.tl.time();
    return {
      x: c.x + (2.2 * Math.sin(t * 0.61) + 1.1 * Math.sin(t * 1.37 + 0.8)) / c.z,
      y: c.y + (1.8 * Math.sin(t * 0.83 + 1.7)) / c.z,
      z: c.z * (1 + 0.005 * Math.sin(t * 0.47)),
      r: c.r + 0.002 * Math.sin(t * 0.29 + 0.4),
    };
  }

  function drawGlyph(t, sx, sy, z) {
    const which = t.glyph;
    const box = which === 'C' ? C_BOX : FOUR_BOX;
    /* Its own cell frame, or the shared mark frame once locked. */
    const cellH = 0.6;
    const kCell = (cellH * z) / (box.y1 - box.y0);
    const cellCx = (box.x0 + box.x1) / 2;
    const cellCy = (box.y0 + box.y1) / 2;
    let k = kCell;
    let ox = sx;
    let oy = sy;
    let gx = cellCx;
    let gy = cellCy;
    if (t.lockFrame && t.lock > 0) {
      const f = t.lockFrame;
      const kLock = (f.h * z) / (MARK_BOX.y1 - MARK_BOX.y0);
      const [fx, fy] = worldToLocal(f.x, f.y, z);
      const u = t.lock;
      k = kCell + (kLock - kCell) * u;
      ox = sx + (fx - sx) * u;
      oy = sy + (fy - sy) * u;
      gx = cellCx + ((MARK_BOX.x0 + MARK_BOX.x1) / 2 - cellCx) * u;
      gy = cellCy + ((MARK_BOX.y0 + MARK_BOX.y1) / 2 - cellCy) * u;
    }
    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(t.rot);
    ctx.scale(k * t.s, k * t.s);
    ctx.translate(-gx, -gy);
    const gscale = 1 / Math.max(0.35, k * t.s);
    if (which === 'C') {
      grain.chalk.setTransform(new DOMMatrix().scale(gscale));
      ctx.fillStyle = grain.chalk;
      ctx.fill(paths.c);
    } else {
      grain.red.setTransform(new DOMMatrix().scale(gscale));
      ctx.fillStyle = grain.red;
      ctx.fill(paths.body);
      grain.yellow.setTransform(new DOMMatrix().scale(gscale));
      ctx.fillStyle = grain.yellow;
      ctx.fill(paths.arm);
    }
    ctx.restore();
  }

  let camNow = null;
  function worldToLocal(wx, wy, z) {
    return [(wx - camNow.x) * z, (wy - camNow.y) * z];
  }

  /* A dictionary entry, set in the clearing under a phrase, in its frame. */
  function drawEntry(e, a, n, z, f, below) {
    if (a <= 0.001) return;
    const parts = [
      { s: e.head, font: `700 ${0.44 * z}px ${FONT}`, col: CHALK, line: 0 },
      { s: e.tail, font: `400 ${0.3 * z}px ${FONT}`, col: DIM, line: 0 },
      { s: e.sense, font: `400 ${0.34 * z}px ${FONT}`, col: DIM, line: 1 },
    ];
    /* Narrow stage: the sense line breaks at the word nearest its middle. */
    const avail = W * 0.86;
    ctx.font = parts[2].font;
    if (ctx.measureText(parts[2].s).width > avail) {
      const words = parts[2].s.split(' ');
      let best = 1;
      let bestDiff = Infinity;
      for (let k = 1; k < words.length; k++) {
        const wa = ctx.measureText(words.slice(0, k).join(' ')).width;
        const wb = ctx.measureText(words.slice(k).join(' ')).width;
        if (Math.abs(wa - wb) < bestDiff) { bestDiff = Math.abs(wa - wb); best = k; }
      }
      const first = words.slice(0, best).join(' ');
      parts.splice(2, 1, { ...parts[2], s: first }, { ...parts[2], s: words.slice(best).join(' '), line: 2 });
    }
    let left = n;
    const lines = [[], [], []];
    parts.forEach((p, idx) => {
      ctx.font = p.font;
      lines[p.line].push({ ...p, w: ctx.measureText(p.s).width, show: p.s.slice(0, Math.max(0, Math.min(p.s.length, Math.floor(left)))) });
      /* the space eaten by the line break still costs one character of typing */
      left -= p.s.length + (idx === 3 ? 1 : 0);
    });
    const [ox, oy] = worldToLocal(f.x, f.y, z);
    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(f.ang);
    ctx.globalAlpha = a;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    lines.forEach((ln, li) => {
      const total = ln.reduce((s, p) => s + p.w, 0);
      let x = -total / 2;
      const yy = (below + li * 0.56) * z;
      ln.forEach((p) => {
        ctx.font = p.font;
        ctx.fillStyle = p.col;
        ctx.fillText(p.show, x, yy);
        x += p.w;
      });
    });
    ctx.restore();
  }

  function render() {
    if (!S || destroyed) return;
    const t = S.tl.time();
    const { cells, tiles, moves, marks, txt } = S;
    const cam = camPose();
    camNow = cam;
    const z = cam.z;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = BOARD;
    ctx.fillRect(0, 0, W, H);
    ctx.translate(W / 2, H / 2);
    ctx.rotate(cam.r);

    /* The board: a baked bitmap when far, live letters when close. */
    const liveA = clamp((z - 26) / 10, 0, 1);
    const bmpA = 1 - liveA;
    const cr = Math.abs(Math.cos(cam.r));
    const sr = Math.abs(Math.sin(cam.r));
    const hx = (W / 2 * cr + H / 2 * sr) / z + 1;
    const hy = (W / 2 * sr + H / 2 * cr) / z + 1;
    const x0 = Math.max(0, Math.floor(cam.x - hx));
    const x1 = Math.min(GW - 1, Math.ceil(cam.x + hx));
    const y0 = Math.max(0, Math.floor(cam.y - hy));
    const y1 = Math.min(GH - 1, Math.ceil(cam.y + hy));
    /* The surface first: only the part of it in view. */
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(material, x0 * SM, y0 * SM, (x1 - x0 + 1) * SM, (y1 - y0 + 1) * SM, (x0 - 0.5 - cam.x) * z, (y0 - 0.5 - cam.y) * z, (x1 - x0 + 1) * z, (y1 - y0 + 1) * z);
    if (bmpA > 0.001) {
      ctx.globalAlpha = bmpA * txt.dim;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bitmap, (-0.5 - cam.x) * z, (-0.5 - cam.y) * z, GW * z, GH * z);
      ctx.globalAlpha = 1;
      ctx.fillStyle = BOARD;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (cells[y][x].hideAt <= t) ctx.fillRect((x - 0.46 - cam.x) * z, (y - 0.46 - cam.y) * z, z * 0.92, z * 0.92);
      }
    }
    if (liveA > 0.001) {
      ctx.font = `600 ${GLYPH * z}px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = CHALK;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const c = cells[y][x];
        if (!c.ch || c.hideAt <= t) continue;
        ctx.globalAlpha = c.a * liveA * txt.dim;
        ctx.fillText(c.ch, (x - cam.x) * z, (y + 0.04 - cam.y) * z);
      }
      ctx.globalAlpha = 1;
    }

    /* Trails through the gutters (the half-cell lines between letters). */
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = CHALK;
    ctx.lineWidth = Math.max(1.5, 0.05 * z);
    ctx.setLineDash([0.32 * z, 0.12 * z]);
    for (const m of moves) {
      if (!m.trail || m.u <= 0) continue;
      const [ex, ey, idx] = along(m.pts, m.len, m.u);
      ctx.globalAlpha = Math.min(0.85, m.ta * txt.trail);
      ctx.beginPath();
      ctx.moveTo((m.pts[0][0] - cam.x) * z, (m.pts[0][1] - cam.y) * z);
      for (let i = 1; i < idx; i++) ctx.lineTo((m.pts[i][0] - cam.x) * z, (m.pts[i][1] - cam.y) * z);
      ctx.lineTo((ex - cam.x) * z, (ey - cam.y) * z);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    /* Chalk gestures: rings round the found words, the strike through HIND. */
    for (const m of marks) {
      if (m.p <= 0 || m.a <= 0.005) continue;
      const n = m.pts.length - 1;
      const upto = m.p * n;
      const pat = m.colour === 'yellow' ? grain.yellow : grain.chalk;
      pat.setTransform(new DOMMatrix().scale(Math.max(0.5, z / 70)));
      ctx.strokeStyle = pat;
      ctx.globalAlpha = m.a;
      ctx.lineWidth = Math.max(1.4, m.w * z);
      ctx.beginPath();
      ctx.moveTo((m.pts[0][0] - cam.x) * z, (m.pts[0][1] - cam.y) * z);
      for (let i = 1; i <= Math.floor(upto); i++) ctx.lineTo((m.pts[i][0] - cam.x) * z, (m.pts[i][1] - cam.y) * z);
      const i0 = Math.floor(upto);
      if (i0 < n) {
        const k = upto - i0;
        ctx.lineTo((m.pts[i0][0] + (m.pts[i0 + 1][0] - m.pts[i0][0]) * k - cam.x) * z, (m.pts[i0][1] + (m.pts[i0 + 1][1] - m.pts[i0][1]) * k - cam.y) * z);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* Chalk dust where a letter has just landed. */
    ctx.fillStyle = CHALK;
    for (const m of moves) {
      if (!m.dust) continue;
      const dt = t - m.end;
      if (dt <= 0 || dt >= 0.7) continue;
      const [ex, ey] = m.pts[m.pts.length - 1];
      const e = 1 - (1 - dt / 0.7) ** 2;
      for (let k = 0; k < 10; k++) {
        const ang = hash(m.seed, k) * Math.PI * 2;
        const reach = (0.18 + 0.5 * hash(m.seed, k + 40)) * e;
        ctx.globalAlpha = (1 - dt / 0.7) * (0.25 + 0.4 * hash(m.seed, k + 80));
        ctx.beginPath();
        ctx.arc((ex + Math.cos(ang) * reach - cam.x) * z, (ey + Math.sin(ang) * reach * 0.8 + 0.3 * dt * dt - cam.y) * z, Math.max(0.7, (0.018 + 0.03 * hash(m.seed, k + 120)) * z), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    /* Definitions, in the clearing under the phrase. */
    drawEntry(DEF, txt.defA, txt.defN, z, FRAMES.L1, 1.62);
    drawEntry(END, txt.endA, txt.endN, z, FRAMES.L3, 1.72);

    /* The travelling letters. */
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const tile of tiles) {
      if (tile.a <= 0.005) continue;
      const [wx, wy] = tilePos(tile);
      const sx = (wx - cam.x) * z;
      const sy = (wy - cam.y) * z;
      ctx.globalAlpha = Math.min(1, tile.a);
      ctx.shadowColor = 'rgba(242, 240, 233, 0.28)';
      ctx.shadowBlur = tile.a > 0.6 ? 0.1 * z : 0;
      if (tile.glyph !== 'text') {
        drawGlyph(tile, sx, sy, z);
        continue;
      }
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(tile.rot);
      ctx.scale(tile.s, tile.s);
      ctx.font = `${tile.g > (GLYPH + WORD_GLYPH) / 2 ? 720 : 600} ${tile.g * z}px ${FONT}`;
      const gs = Math.max(0.5, z / 70);
      grain.chalk.setTransform(new DOMMatrix().scale(gs));
      ctx.fillStyle = grain.chalk;
      ctx.fillText(tile.ch, 0, 0.04 * z);
      if (tile.hl > 0.01) {
        ctx.globalAlpha = Math.min(1, tile.a) * tile.hl;
        grain.yellow.setTransform(new DOMMatrix().scale(gs));
        ctx.fillStyle = grain.yellow;
        ctx.fillText(tile.ch, 0, 0.04 * z);
      }
      ctx.restore();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    /* The room: light from up and to the left, falling off to the corners,
       and a little film grain that changes thirty times a second. */
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = keyLight;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    const gf = Math.floor(t * 30);
    film.setTransform(new DOMMatrix().translate(Math.floor(hash(gf, 1) * 128), Math.floor(hash(gf, 2) * 128)));
    ctx.fillStyle = film;
    ctx.fillRect(0, 0, W, H);
  }

  /* ── Lifecycle ── */
  function size() {
    const r = host.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const far = Math.hypot(W, H) / 2;
    vignette = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, far);
    vignette.addColorStop(0, 'rgba(4, 14, 11, 0)');
    vignette.addColorStop(0.7, 'rgba(4, 14, 11, 0.2)');
    vignette.addColorStop(1, 'rgba(4, 14, 11, 0.5)');
    keyLight = ctx.createRadialGradient(W * 0.2, -H * 0.15, 0, W * 0.2, -H * 0.15, far * 1.7);
    keyLight.addColorStop(0, 'rgba(255, 246, 220, 0.075)');
    keyLight.addColorStop(1, 'rgba(255, 246, 220, 0)');
  }
  function rebuild() {
    const at = S ? S.tl.time() : 0;
    const wasPlaying = running;
    if (S) S.tl.kill();
    size();
    S = plan();
    bitmap = buildBitmap(S.cells);
    S.tl.eventCallback('onComplete', () => {
      stopLoop();
      render();
      if (onDone) onDone();
    });
    S.tl.seek(at, false);
    render();
    if (wasPlaying && at < S.tl.duration()) startLoop();
  }
  const tick = () => render();
  function bootClear() {
    const boot = document.getElementById('c4-boot');
    if (!boot || boot.classList.contains('is-done')) return Promise.resolve();
    return new Promise((resolve) => {
      const mo = new MutationObserver(() => {
        if (!document.getElementById('c4-boot') || boot.classList.contains('is-done')) { mo.disconnect(); setTimeout(resolve, 280); }
      });
      mo.observe(boot, { attributes: true, attributeFilter: ['class'] });
      mo.observe(document.body, { childList: true });
      setTimeout(() => { mo.disconnect(); resolve(); }, 6000);
    });
  }
  function startLoop() {
    if (running) return;
    running = true;
    gsap.ticker.add(tick);
    S.tl.play();
  }
  function stopLoop() {
    running = false;
    gsap.ticker.remove(tick);
    if (S) S.tl.pause();
  }

  let ro = null;
  const ready = (document.fonts && document.fonts.load
    ? Promise.all([
      document.fonts.load(`600 40px ${FONT}`),
      document.fonts.load(`700 40px ${FONT}`),
      document.fonts.load(`400 40px ${FONT}`),
    ]).catch(() => null)
    : Promise.resolve()
  ).then(() => {
    if (destroyed) return;
    rebuild();
    let lastW = W;
    let lastH = H;
    ro = new ResizeObserver(() => {
      const r = host.getBoundingClientRect();
      if (Math.abs(r.width - lastW) < 2 && Math.abs(r.height - lastH) < 2) return;
      lastW = r.width;
      lastH = r.height;
      rebuild();
    });
    ro.observe(host);
    if (autoplay) startLoop();
  });

  return {
    ready,
    get duration() { return S ? S.tl.duration() : 0; },
    /* The camera pose at the current time, for checking the path is smooth. */
    get pose() { return S ? camPose() : null; },
    /* Timed events (landings, rings, camera moves), for the video's sound. */
    get cues() { return S ? S.cues : []; },
    play() { ready.then(bootClear).then(() => { if (!destroyed && S && S.tl.time() < S.tl.duration()) startLoop(); }); },
    pause() { stopLoop(); },
    replay() { ready.then(() => { stopLoop(); S.tl.seek(0, false); startLoop(); }); },
    seek(t) { if (!S) return; stopLoop(); S.tl.seek(t, false); render(); },
    finish() { ready.then(() => { stopLoop(); S.tl.seek(S.tl.duration(), false); render(); }); },
    destroy() {
      destroyed = true;
      stopLoop();
      if (ro) ro.disconnect();
      if (S) S.tl.kill();
      canvas.remove();
    },
  };
}
