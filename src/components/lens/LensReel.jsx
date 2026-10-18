/**
 * The Lens reel: "Flick through the pictures" (17 Oct 2026, redesigned
 * 18 Oct 2026).
 *
 * Caleb, 17 Oct 2026, on a 21st.dev slider: "thinking about using the above
 * for c4 lens projects. think there's a cool opportunity for a scroll-based
 * component. Can have the project details in the white section." And on the
 * first build, 18 Oct: "look at these photos btw. that's what it's supposed
 * to look like. and for the love of all thats holy, put effort into the white
 * informational bit." It opens from the head of the work section
 * (LensWork.jsx), beside "See our case studies", and its code and its type
 * load only when that button is pressed.
 *
 * The card. Pure white with black ink, laid over the frame in its lower part
 * and in the same place on every frame: the plate number and the caption on
 * the left, a window onto the picture in the middle, and who it was for, the
 * kind of work, where and when on the right. Set as "a wall label, set by an
 * architecture studio" in Mona Sans, the client expanded, the plate number
 * expanded and very light (Caleb chose it over a Petrona setting, 18 Oct
 * 2026: "go A"). As frames pass the card changes in step with them, and a
 * line whose value doesn't change holds still, the way a counter turns only
 * the wheels that move: the plate number's figures roll like a counter's
 * wheels, the words that change fade across, and the client's name stays put
 * while the reel is inside one job. lens-reel.css has the grid and how it's
 * measured.
 *
 * The number is set as type: the face's proportional figures with its own
 * kerning, so 01, 10 and 11 read as numbers, not spaced letters. Each figure
 * has a box of its own, placed where set type would put it (measured from
 * the face once its file has loaded), so during a roll only the figure that
 * changes moves, and the count beside the number slides as its width
 * changes.
 *
 * Mechanics, from the reference (the "argent loop" slider): a virtualised,
 * endless column of full-screen frames moved by lerped wheel, drag and keys,
 * snapping to the nearest frame; the picture drifts inside its frame while it
 * moves; the plate and the card's lines move in step with the frames.
 * Listeners sit on the overlay, never on window (Back's popstate is the one
 * exception). Sizes come from ResizeObservers, so the animation loop only
 * writes transforms and, when a frame is crossed, text. It stops once a frame
 * has settled. Reduced motion: frames and the plate crossfade, the lines
 * change with a short fade, and nothing drifts or rolls.
 *
 * Accessibility: a modal dialog portalled to <body>, with #root inert and the
 * page's scroll locked while it's open. Arrow keys, Page Up and Down, Space
 * and Shift+Space step; Home and End go to the first and last frames; Escape
 * closes; Tab stays inside; Back closes it too (one history entry while it's
 * open). The moving lines are hidden from screen readers, and a polite status
 * line reads each frame once it settles. The card's lines grow with their
 * words under a reader's own text spacing, and at 400% zoom the card turns to
 * one scrolling column (lens-reel.css). Over the reel the page's reticle
 * cursor gives way to the system pointer.
 *
 * Content rules: reelFrames.js (what's in, what's out, and why).
 */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowRight, ArrowUp, ChevronDown, ChevronUp, X } from 'lucide-react';
import useStaticMode from '@/hooks/useStaticMode';
import { REEL_FRAMES } from './reelFrames';
import './lens-reel.css';

const N = REEL_FRAMES.length;
const BUFFER = 3;      // frames rendered either side of the one nearest the centre
const AHEAD = 2;       // how far the scroll may run ahead of what's on screen
const LERP = 0.12;     // per 60 Hz frame
const SNAP_MS = 560;
const WHEEL_GAIN = 0.75;
const WHEEL_MAX = 150;
const IDLE_MS = 120;   // no input for this long and the reel snaps
const NUDGE = 0.06;    // a scroll this far past a frame carries on to the next,
const NUDGE_PX = 30;   //   or this many pixels, whichever is less, so one notch
                       //   of a wheel moves on even on a tall screen
const PULL = 0.2;      // a drag this far does, even let go slowly
const FLICK = 0.45;    // px per ms
const DRIFT = 10;      // % of its height a picture drifts at one frame from centre

const wrap = (i) => ((i % N) + N) % N;
const pad = (n) => String(n).padStart(2, '0');
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
/* Facts run together with a dot between them. If a line has to wrap, it may
   only break after a dot: never inside "Port Kennedy, WA", and never leaving
   a dot at the start of a line. */
const run = (parts) => parts.filter(Boolean).map((p) => p.replace(/ /g, '\u00a0')).join('\u00a0· ');
const smooth = (x) => x * x * (3 - 2 * x);

/* Where the reel opens: where it was left, if it was open earlier on this
   visit (Escape, Back or a job's case study, then the button again). */
let resumeAt = 0;

/* What each line on the card shows for frame k. A line whose value is the
   same for two neighbouring frames doesn't move between them. Each layout
   shows some of them: a wide screen has the kind of work, the place and the
   year each in its own window, so a place holds while only the year
   changes; a phone, upright or on its side, has the kind over the place and
   year run together on one line, so the kind can change while the place
   holds. A frame's own place, where it has one, is narrower than its
   study's (reelFrames.js). */
const placeOf = (f) => f.place || f.study.place;
const LINES = {
  tens: (f, k) => pad(k + 1)[0],
  units: (f, k) => pad(k + 1)[1],
  kind: (f) => f.kind,
  note: (f) => f.note,
  client: (f) => f.study.client,
  place: placeOf,
  year: (f) => f.year || '',
  where: (f) => run([placeOf(f), f.year]),
};
/* Only the plate number's figures roll. Every line of words fades across: a
   word rolled through a one-line window leaves specks of its letters on the
   way, half a caption would sit legible beside half of the next job's name,
   and two windows rolling against each other read as one garbled line. */
const FADES = new Set(['kind', 'client', 'note', 'place', 'year', 'where']);

/* Size hints for the browser's pick from a srcset. A frame covers the screen,
   so it's as wide as the screen, or wider when the screen is taller than the
   picture. The window on the card is given the same hint, so it shows the
   file the frame already fetched rather than fetching a smaller one. */
const sizesFor = (s) => `(min-aspect-ratio: ${s.width}/${s.height}) 100vw, calc(100vh * ${(s.width / s.height).toFixed(3)})`;
const setFor = (s, ext) => s.widths.filter((w) => w <= s.width).map((w) => `${s.base}-${w}.${ext} ${w}w`).join(', ');

/* While a picture loads, its frame and the window show a grey of the
   picture's own brightness: the frame's tone (reelFrames.js, the picture
   averaged to one colour) with its colour taken out, so nothing opens on
   black and nothing flashes a block of colour. */
const grey = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const v = Math.round(255 * (y <= 0.0031308 ? 12.92 * y : 1.055 * y ** (1 / 2.4) - 0.055));
  return `rgb(${v} ${v} ${v})`;
};

function developed(e) { e.currentTarget.classList.add('is-loaded'); }
function failed(e) { e.currentTarget.classList.add('is-failed'); }
/* An image already in the cache still gets its focus pull, a frame later. */
function settleImg(el) {
  if (el && el.complete && el.naturalWidth) requestAnimationFrame(() => el.classList.add('is-loaded'));
}

/* A still at several widths, AVIF first; a frame with a wide and a tall cut
   picks by the window's orientation, the same switch the film players make.
   Its focal points go to the stylesheet, which picks the short-screen one on
   a phone held sideways. */
function Picture({ pic, imgRef, priority, focus, focusShort }) {
  const setRef = useCallback((el) => {
    settleImg(el);
    if (imgRef) imgRef(el);
  }, [imgRef]);
  const common = {
    alt: '', decoding: 'async', draggable: false, ref: setRef, onLoad: developed, onError: failed,
    fetchpriority: priority,
    style: focus ? { '--focus': focus, '--focus-short': focusShort || focus } : undefined,
  };
  const fallback = (s) => `${s.base}-${s.widths[Math.min(1, s.widths.length - 1)]}.webp`;
  if (pic.type === 'art-stills') {
    const { wide, tall } = pic;
    return (
      <picture>
        <source media="(orientation: landscape)" type="image/avif" srcSet={setFor(wide, 'avif')} sizes={sizesFor(wide)} width={wide.width} height={wide.height} />
        <source media="(orientation: landscape)" type="image/webp" srcSet={setFor(wide, 'webp')} sizes={sizesFor(wide)} width={wide.width} height={wide.height} />
        <source type="image/avif" srcSet={setFor(tall, 'avif')} sizes={sizesFor(tall)} />
        <source type="image/webp" srcSet={setFor(tall, 'webp')} sizes={sizesFor(tall)} />
        <img src={fallback(tall)} width={tall.width} height={tall.height} {...common} />
      </picture>
    );
  }
  return (
    <picture>
      <source type="image/avif" srcSet={setFor(pic, 'avif')} sizes={sizesFor(pic)} />
      <source type="image/webp" srcSet={setFor(pic, 'webp')} sizes={sizesFor(pic)} />
      <img src={fallback(pic)} width={pic.width} height={pic.height} {...common} />
    </picture>
  );
}

/* What a screen reader hears when a frame settles. */
function describe(idx) {
  const f = REEL_FRAMES[wrap(idx)];
  const where = [f.kind, placeOf(f), f.year].filter(Boolean).join(', ');
  const alt = f.picture.alt && f.picture.alt !== f.note ? ` ${f.picture.alt}` : '';
  return `${wrap(idx) + 1} of ${N}. ${f.study.client}. ${where}. ${f.note}${alt}`;
}

/* A line on the card: two copies stacked in a window, the value at this
   frame and the value at the next, rolled between by the loop. */
function Line({ name, lineRef }) {
  return (
    <span className={`reel-line reel-line--${name}`} ref={lineRef} aria-hidden="true">
      <span className="reel-line-a" />
      <span className="reel-line-b" />
    </span>
  );
}

export default function LensReel({ onClose }) {
  const still = useStaticMode();
  const rootRef = useRef(null);
  const plateRef = useRef(null);
  const liveRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [nearest, setNearest] = useState(() => resumeAt);

  /* Everything the loop and the listeners share, made once. P is the frames'
     step (the overlay's height) and ph the plate's. */
  const engine = useRef(null);
  if (!engine.current) {
    const els = { box: new Map(), img: new Map(), print: new Map() };
    const refs = new Map();
    const lines = new Map();
    const s = {
      still, P: 0, ph: 0, currentY: 0, targetY: 0, vel: 0, snapV0: 0, raf: 0, last: 0,
      lastInput: 0, dir: 0, snapping: false, snapFrom: 0, snapTo: 0, snapT0: 0,
      pointer: null, dragging: false, dragY0: 0, dragTarget0: 0, samples: [],
      wheelT: 0, wheelAcc: 0, wheelSpent: false, lineBase: null,
      nearest: resumeAt, settledIdx: null, moved: false, popped: false, landing: null,
    };
    const e = { els, s };

    e.refFor = (kind, i) => {
      const key = `${kind}:${i}`;
      let fn = refs.get(key);
      if (!fn) {
        fn = (el) => {
          if (el) els[kind].set(i, el);
          else { els[kind].delete(i); refs.delete(key); }
        };
        refs.set(key, fn);
      }
      return fn;
    };

    e.lineRef = (name) => {
      const key = `line:${name}`;
      let fn = refs.get(key);
      if (!fn) {
        fn = (el) => {
          if (el) {
            lines.set(name, { el, a: el.firstChild, b: el.lastChild, fade: FADES.has(name), still: true, value: null, t: null });
            s.lineBase = null;
          } else lines.delete(name);
        };
        refs.set(key, fn);
      }
      return fn;
    };

    /* The plate number set as type. `adv` is each figure's advance and
       `pair` each number's width, in ems of the number, measured from the
       face once its file has loaded (until then, a tabular guess). The units
       figure starts where set type would put it: the pair's width less its
       own advance, which keeps the face's kerning. The figures' box takes the
       number's width at each frame, and the count beside it is slid by the
       difference while the reel moves between two frames. */
    const fig = { adv: {}, pair: {}, px: 0, box: null, of: null, shift: 0, at: null };
    e.fig = fig;
    e.figBoxRef = (el) => { fig.box = el; s.lineBase = null; };
    e.figOfRef = (el) => { fig.of = el; };
    e.geo = (k) => {
      const label = pad(k + 1);
      const W = fig.pair[label] ?? 1.44;
      return { W, x: W - (fig.adv[label[1]] ?? 0.72) };
    };
    e.measureFigures = () => {
      const host = fig.box?.parentElement;
      if (!host) return;
      const px = parseFloat(getComputedStyle(host).fontSize);
      if (!px) return;
      const probe = document.createElement('span');
      probe.className = 'reel-measure';
      host.appendChild(probe);
      const width = (text) => { probe.textContent = text; return probe.getBoundingClientRect().width / px; };
      for (const d of '0123456789') fig.adv[d] = width(d);
      for (let k = 0; k < N; k += 1) fig.pair[pad(k + 1)] = width(pad(k + 1));
      probe.remove();
      fig.px = px;
      s.lineBase = null;
    };

    /* The lines: when a frame is crossed, each window gets the values either
       side of it; between frames, the ones that differ roll or fade. A fade
       lets the old value go by the time the frames are 45% across and brings
       the new one in from 55%, so two values are never legible at once. */
    e.writeLines = (pos) => {
      let base = Math.floor(pos);
      let t = pos - base;
      if (t > 0.9995) { base += 1; t = 0; }
      if (base !== s.lineBase) {
        const fA = REEL_FRAMES[wrap(base)];
        const fB = REEL_FRAMES[wrap(base + 1)];
        lines.forEach((ln, name) => {
          const A = LINES[name](fA, wrap(base));
          const B = LINES[name](fB, wrap(base + 1));
          if (s.still && ln.value !== null && ln.value !== A && ln.a.animate) {
            ln.a.animate([{ opacity: 0.15 }, { opacity: 1 }], { duration: 160, easing: 'linear' });
          }
          ln.a.textContent = A;
          ln.b.textContent = B;
          ln.value = A;
          ln.still = A === B;
        });
        /* The figures where set type puts them, either side of the move. */
        const gA = e.geo(wrap(base));
        const gB = e.geo(wrap(base + 1));
        const units = lines.get('units');
        if (units) {
          units.a.style.left = `${gA.x.toFixed(4)}em`;
          units.b.style.left = `${gB.x.toFixed(4)}em`;
          /* The same figure at a new place (the wrap from 21 or 11 to 01)
             rolls over itself rather than sliding. */
          if (units.still && Math.abs(gA.x - gB.x) > 1e-3) units.still = false;
        }
        if (fig.box) fig.box.style.width = `${gA.W.toFixed(4)}em`;
        fig.shift = (gB.W - gA.W) * fig.px;
        fig.at = null;
        s.lineBase = base;
      }
      /* The count slides with the number's width. */
      const ofAt = s.still ? 0 : t;
      if (fig.of && ofAt !== fig.at) {
        fig.at = ofAt;
        fig.of.style.transform = ofAt && fig.shift ? `translate3d(${(fig.shift * ofAt).toFixed(2)}px,0,0)` : '';
      }
      /* Only lines whose place changed are written. */
      lines.forEach((ln) => {
        const at = ln.still || s.still ? 0 : t;
        if (at === ln.t) return;
        ln.t = at;
        if (ln.fade) {
          const out = Math.min(1, at / 0.45);
          const inn = Math.max(0, (at - 0.55) / 0.45);
          ln.a.style.opacity = at ? (1 - smooth(out)).toFixed(3) : '';
          ln.a.style.transform = at ? `translate3d(0,${(-6 * out).toFixed(2)}px,0)` : '';
          ln.b.style.opacity = smooth(inn).toFixed(3);
          ln.b.style.transform = `translate3d(0,${(6 * (1 - inn)).toFixed(2)}px,0)`;
          return;
        }
        ln.a.style.transform = at ? `translate3d(0,${(-at * 101).toFixed(3)}%,0)` : '';
        ln.b.style.transform = `translate3d(0,${((1 - at) * 101).toFixed(3)}%,0)`;
      });
    };

    /* Transforms only, and text when a frame is crossed. Reads nothing from
       the layout. Under reduced motion the frames and the plate crossfade in
       CSS, and only the lines are written. */
    e.write = () => {
      const { P, ph, currentY } = s;
      if (!P) return;
      const pos = -currentY / P;
      e.writeLines(s.still ? s.nearest : pos);
      if (s.still) return;
      els.box.forEach((el, i) => {
        const off = i * P + currentY;
        el.style.transform = `translate3d(0,${off.toFixed(2)}px,0)`;
        const img = els.img.get(i);
        if (!img) return;
        const p = clamp(off / P, -1, 1);
        img.style.transform = Math.abs(p) < 1e-4
          ? ''
          : `translate3d(0,${(-DRIFT * p).toFixed(3)}%,0) scale(${(1 + (DRIFT * 2.1 * Math.abs(p)) / 100).toFixed(4)})`;
      });
      if (!ph) return;
      els.print.forEach((el, i) => { el.style.transform = `translate3d(0,${((i - pos) * ph).toFixed(2)}px,0)`; });
    };

    e.setNear = (idx) => {
      if (idx === s.nearest) return;
      s.nearest = idx;
      e.onNear?.(idx);
    };

    e.announce = (idx) => {
      if (liveRef.current) liveRef.current.textContent = describe(idx);
    };

    /* A frame has landed: say which. (is-settled styles nothing; it marks
       the state for anyone inspecting the reel.) */
    e.settle = (idx) => {
      rootRef.current?.classList.add('is-settled');
      if (idx === s.settledIdx) return;
      s.settledIdx = idx;
      e.announce(idx);
    };

    /* The first move retires the line of help. */
    e.moved = () => {
      if (s.moved) return;
      s.moved = true;
      rootRef.current?.classList.add('has-moved');
    };

    e.stir = () => {
      e.moved();
      rootRef.current?.classList.remove('is-settled');
      e.kick();
    };

    e.kick = () => {
      if (s.still || s.raf) return;
      s.last = 0;
      s.raf = requestAnimationFrame(e.tick);
    };

    /* Where a scroll or a drag comes to rest: on to the next frame in the
       direction it was going, unless it barely moved. */
    e.goal = (pos, nudge = NUDGE) => {
      const lo = Math.floor(pos);
      const frac = pos - lo;
      if (frac < 1e-4) return lo;
      if (frac > 1 - 1e-4) return lo + 1;
      if (s.dir > 0) return frac > nudge ? lo + 1 : lo;
      if (s.dir < 0) return frac < 1 - nudge ? lo : lo + 1;
      return Math.round(pos);
    };

    /* A snap runs from where the reel is on screen, with no smoothing on top,
       so it lands in SNAP_MS rather than creeping in. A step from a key or a
       button starts on an ease-out. A snap that follows the wheel or a drag
       (carry) starts at the speed the reel is already moving towards the
       frame, never faster than that ease-out would start, so it eases on
       without a jolt. (A cubic from the start speed to rest; at the
       ease-out's own start speed it is that ease-out.) */
    e.snap = (idx, now = performance.now(), carry = false) => {
      s.snapping = true;
      s.snapFrom = s.currentY;
      s.snapTo = -idx * s.P;
      s.snapT0 = now;
      const dist = s.snapTo - s.snapFrom;
      const launch = (3 * dist) / SNAP_MS;
      const along = Math.sign(s.vel) === Math.sign(dist) ? s.vel : 0;
      s.snapV0 = carry ? (Math.abs(along) < Math.abs(launch) ? along : launch) : launch;
    };

    e.clampTarget = (y) => {
      const near = Math.round(-s.currentY / s.P);
      return clamp(y, -(near + AHEAD) * s.P, -(near - AHEAD) * s.P);
    };

    e.tick = (now) => {
      s.raf = 0;
      const { P } = s;
      if (!P) return;
      const dt = s.last ? Math.min(64, now - s.last) : 16.7;
      s.last = now;
      const idle = !s.dragging && now - s.lastInput > IDLE_MS;
      if (idle && !s.snapping) {
        const pos = -s.targetY / P;
        const goal = e.goal(pos, Math.min(NUDGE, NUDGE_PX / P));
        if (Math.abs(pos - goal) * P > 0.5) e.snap(goal, now, true);
      }
      const was = s.currentY;
      if (s.snapping) {
        /* A key can land after this frame's timestamp was taken; never let
           the curve run backwards from that. */
        const t = clamp((now - s.snapT0) / SNAP_MS, 0, 1);
        const d = s.snapTo - s.snapFrom;
        const v = s.snapV0 * SNAP_MS;
        s.targetY = s.snapFrom + v * (t ** 3 - 2 * t ** 2 + t) + d * (3 * t ** 2 - 2 * t ** 3);
        if (t >= 1) { s.snapping = false; s.targetY = s.snapTo; }
        s.currentY = s.targetY;
      } else if (s.dragging) s.currentY = s.targetY;
      else s.currentY += (s.targetY - s.currentY) * (1 - (1 - LERP) ** (dt / 16.7));
      s.vel = (s.currentY - was) / dt;
      e.setNear(Math.round(-s.currentY / P));
      const rest = Math.round(-s.targetY / P);
      if (idle && !s.snapping && Math.abs(s.targetY - s.currentY) < 0.4 && Math.abs(s.targetY + rest * P) < 0.5) {
        s.targetY = -rest * P;
        s.currentY = s.targetY;
        s.vel = 0;
        e.write();
        e.settle(rest);
        return;
      }
      e.write();
      s.raf = requestAnimationFrame(e.tick);
    };

    /* Straight to a frame: no travel. Reduced motion, Home and End use it. */
    e.cut = (idx) => {
      s.snapping = false;
      s.targetY = -idx * s.P;
      s.currentY = s.targetY;
      s.vel = 0;
      s.lastInput = performance.now();
      e.setNear(idx);
      if (s.still) { e.moved(); e.write(); e.settle(idx); return; }
      e.stir();
    };

    e.goTo = (idx) => {
      if (s.still) { e.cut(idx); return; }
      const near = Math.round(-s.currentY / s.P);
      s.dir = Math.sign(idx - near);
      s.lastInput = performance.now();
      e.snap(clamp(idx, near - AHEAD, near + AHEAD));
      e.stir();
    };

    e.anchor = () => (s.snapping ? Math.round(-s.snapTo / s.P) : Math.round(-s.targetY / s.P));

    e.step = (d) => e.goTo(e.anchor() + d);

    /* The nearest showing of frame k: Home from the last frame is one step on. */
    e.jump = (k) => {
      const anchor = e.anchor();
      let d = k - wrap(anchor);
      if (d > N / 2) d -= N;
      else if (d < -N / 2) d += N;
      if (Math.abs(d) > AHEAD) e.cut(anchor + d);
      else e.goTo(anchor + d);
    };

    /* Sizes, read outside the loop. A change keeps the frame on screen. */
    e.measure = () => {
      const root = rootRef.current;
      const plate = plateRef.current;
      if (!root) return;
      const P = root.clientHeight;
      const ph = plate ? plate.clientHeight : 0;
      if (P === s.P && ph === s.ph) return;
      const idx = s.P ? e.anchor() : s.nearest;
      s.P = P;
      s.ph = ph;
      s.snapping = false;
      s.dragging = false;
      s.targetY = -idx * P;
      s.currentY = s.targetY;
      s.vel = 0;
      e.write();
    };

    engine.current = e;
  }
  const e = engine.current;
  e.onNear = setNearest;

  /* Lock the page while open: no scroll behind, nothing behind focusable. */
  useLayoutEffect(() => {
    const html = document.documentElement;
    const app = document.getElementById('root');
    const gutter = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    const wasInert = app ? app.hasAttribute('inert') : true;
    html.style.overflow = 'hidden';
    if (gutter > 0) html.style.paddingRight = `${gutter}px`;
    if (!wasInert) app.setAttribute('inert', '');
    return () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.paddingRight;
      if (!wasInert) app.removeAttribute('inert');
    };
  }, []);

  /* Measure once on open, place everything, take focus. The number's figures
     are measured again once the face has loaded (until then the text is
     hidden, font-display: block, and set on a tabular guess). */
  useLayoutEffect(() => {
    const { s } = e;
    let alive = true;
    e.measureFigures();
    e.measure();
    e.write();
    rootRef.current.focus({ preventScroll: true });
    const again = () => { if (alive) { e.measureFigures(); e.write(); } };
    if (document.fonts?.load) document.fonts.load('200 100px "Mona Sans"').then(again, again);
    return () => {
      alive = false;
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [e]);

  /* New frames come into the rendered window as the reel moves: place them
     before they paint. */
  useLayoutEffect(() => { e.write(); }, [e, nearest]);

  useEffect(() => {
    /* A resize can change the number's size with the screen's width, so the
       figures are measured again too. */
    const ro = new ResizeObserver(() => { e.measure(); e.measureFigures(); e.write(); });
    if (rootRef.current) ro.observe(rootRef.current);
    if (plateRef.current) ro.observe(plateRef.current);
    return () => ro.disconnect();
  }, [e]);

  /* Back closes the reel, as it closes a phone's full-screen viewer: one
     history entry while it's open, taken back off when it closes. The frame
     link instead turns that entry into its #work- address and hands over to
     LensWork's own hash handling, which opens the studies at that job. */
  useEffect(() => {
    const { s } = e;
    let base = null;
    try {
      base = window.history.state;
      window.history.pushState({ ...(base && typeof base === 'object' ? base : {}), lensReel: true }, '');
    } catch { /* no history API: Back simply leaves the page */ }
    const onPop = () => { s.popped = true; onCloseRef.current(); };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      if (s.popped || !window.history.state?.lensReel) return;
      try {
        if (s.landing) {
          const oldURL = window.location.href;
          window.history.replaceState(base, '', s.landing);
          window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL, newURL: window.location.href }));
        } else {
          window.history.back();
        }
      } catch { /* leave history as it is */ }
    };
  }, [e]);

  /* The first frame is read out after the dialog's own name. On the way out
     the reel remembers where it was, for the next time it opens. */
  useEffect(() => {
    const { s } = e;
    const first = window.setTimeout(() => { if (!s.moved) e.settle(s.nearest); }, 420);
    return () => {
      window.clearTimeout(first);
      resumeAt = wrap(s.nearest);
    };
  }, [e]);

  /* Input: wheel, drag, touch and keys, all on the overlay itself. */
  useEffect(() => {
    const { s } = e;
    const root = rootRef.current;

    /* At the smallest sizes (a phone at 400% zoom) the card scrolls its own
       words (lens-reel.css). A wheel or a finger on it scrolls them first. */
    const scrollingCard = (target) => {
      const card = target instanceof Element ? target.closest('.reel-card') : null;
      return card && card.scrollHeight > card.clientHeight + 1 ? card : null;
    };

    const onWheel = (ev) => {
      if (ev.ctrlKey) return; // a trackpad pinch: let the browser zoom
      let dy = ev.deltaY;
      if (ev.deltaMode === 1) dy *= 16;
      else if (ev.deltaMode === 2) dy *= s.P;
      const card = scrollingCard(ev.target);
      if (card && dy && (dy > 0 ? card.scrollTop + card.clientHeight < card.scrollHeight - 1 : card.scrollTop > 0)) return;
      ev.preventDefault();
      if (!dy) return;
      const now = performance.now();
      if (s.still) {
        /* One step per gesture: a run of wheel events, however long. */
        if (now - s.wheelT > 240) { s.wheelAcc = 0; s.wheelSpent = false; }
        s.wheelT = now;
        if (s.wheelSpent) return;
        s.wheelAcc += dy;
        if (Math.abs(s.wheelAcc) >= 24) { s.wheelSpent = true; e.step(Math.sign(s.wheelAcc)); }
        return;
      }
      s.snapping = false;
      s.lastInput = now;
      s.dir = Math.sign(dy);
      s.targetY = e.clampTarget(s.targetY - clamp(dy * WHEEL_GAIN, -WHEEL_MAX, WHEEL_MAX));
      e.stir();
    };

    const onPointerDown = (ev) => {
      if (s.pointer !== null) { // a second finger: drop the drag and let it pinch
        s.pointer = null;
        s.dragging = false;
        s.lastInput = performance.now();
        e.kick();
        return;
      }
      if (ev.button !== 0 || (ev.target instanceof Element && ev.target.closest('a, button')) || scrollingCard(ev.target)) return;
      s.pointer = ev.pointerId;
      s.dragY0 = ev.clientY;
      s.samples = [[ev.timeStamp, ev.clientY]];
      if (!s.still) {
        /* Take hold of what's on screen, even mid-glide. */
        s.dragging = true;
        s.snapping = false;
        s.targetY = s.currentY;
        e.stir();
      }
      s.dragTarget0 = s.targetY;
      try { root.setPointerCapture(ev.pointerId); } catch { /* not capturable */ }
    };

    const onPointerMove = (ev) => {
      if (ev.pointerId !== s.pointer) return;
      s.samples.push([ev.timeStamp, ev.clientY]);
      while (s.samples.length > 2 && ev.timeStamp - s.samples[0][0] > 100) s.samples.shift();
      if (!s.dragging) return;
      s.lastInput = performance.now();
      s.targetY = e.clampTarget(s.dragTarget0 + (ev.clientY - s.dragY0));
      e.kick();
    };

    const onPointerUp = (ev) => {
      if (ev.pointerId !== s.pointer) return;
      s.pointer = null;
      const dy = ev.clientY - s.dragY0;
      const [t0, y0] = s.samples[0];
      const [t1, y1] = s.samples[s.samples.length - 1];
      /* A flick is a finger still moving when it lets go; one that stopped
         first has no speed, however fast it got there. */
      const v = t1 > t0 && ev.timeStamp - t1 < 80 ? (y1 - y0) / (t1 - t0) : 0;
      if (s.still) {
        if (Math.abs(dy) > 40) e.step(dy < 0 ? 1 : -1);
        return;
      }
      s.dragging = false;
      s.lastInput = performance.now();
      const pos = -s.targetY / s.P;
      s.dir = -Math.sign(dy);
      let goal = e.goal(pos, PULL);
      if (Math.abs(v) > FLICK && Math.abs(dy) > 10) goal = v < 0 ? Math.floor(pos + 1e-4) + 1 : Math.ceil(pos - 1e-4) - 1;
      s.dir = Math.sign(goal - pos);
      /* The snap carries on at the finger's own speed as it let go. */
      s.vel = v;
      e.snap(goal, performance.now(), true);
      e.kick();
    };

    const onPointerCancel = (ev) => {
      if (ev.pointerId !== s.pointer) return;
      s.pointer = null;
      s.dragging = false;
      s.lastInput = performance.now();
      e.kick();
    };

    /* iOS can still scroll what's behind on a drag; a pinch stays a pinch,
       and a card that scrolls its words keeps its own swipe. */
    const onTouchMove = (ev) => {
      if (ev.touches.length === 1 && ev.cancelable && !scrollingCard(ev.target)) ev.preventDefault();
    };

    const focusables = () => [...root.querySelectorAll('a[href], button:not([disabled])')]
      .filter((el) => !el.closest('[aria-hidden="true"]'));

    const onKeyDown = (ev) => {
      if (ev.defaultPrevented || ev.altKey || ev.ctrlKey || ev.metaKey) return;
      const k = ev.key;
      if (k === 'Escape') { ev.preventDefault(); onCloseRef.current(); return; }
      if (k === 'Tab') {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const at = document.activeElement;
        if (ev.shiftKey && (at === first || at === root)) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && at === last) { ev.preventDefault(); first.focus(); }
        return;
      }
      const onControl = ev.target instanceof Element && ev.target.closest('a, button');
      /* Each press steps at once. A held key's repeats wait until the step
         under way is most of the way there, so holding a key moves through
         the pictures at a pace that still shows each one. */
      const pacing = ev.repeat && s.snapping && performance.now() - s.snapT0 < SNAP_MS * 0.6;
      if (pacing && /^(Arrow|Page)|^ $|^Spacebar$/.test(k) && !(onControl && (k === ' ' || k === 'Spacebar'))) { ev.preventDefault(); return; }
      if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown') { ev.preventDefault(); e.step(1); }
      else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp') { ev.preventDefault(); e.step(-1); }
      else if ((k === ' ' || k === 'Spacebar') && !onControl) { ev.preventDefault(); e.step(ev.shiftKey ? -1 : 1); }
      else if (k === 'Home') { ev.preventDefault(); e.jump(0); }
      else if (k === 'End') { ev.preventDefault(); e.jump(N - 1); }
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerup', onPointerUp);
    root.addEventListener('pointercancel', onPointerCancel);
    root.addEventListener('touchmove', onTouchMove, { passive: false });
    root.addEventListener('keydown', onKeyDown);
    return () => {
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointercancel', onPointerCancel);
      root.removeEventListener('touchmove', onTouchMove);
      root.removeEventListener('keydown', onKeyDown);
    };
  }, [e]);

  const indices = [];
  for (let i = nearest - BUFFER; i <= nearest + BUFFER; i += 1) indices.push(i);
  const current = REEL_FRAMES[wrap(nearest)];
  const studyHash = `#work-${current.study.id}`;

  /* "Read about this job": a plain left click closes the reel and lands on
     the study; a modified click opens the address the browser's own way. */
  const toStudy = (ev) => {
    if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    ev.preventDefault();
    e.s.landing = studyHash;
    onCloseRef.current(studyHash);
  };

  return createPortal(
    <div
      ref={rootRef}
      className={`reel${still ? ' is-still' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reel-title"
      aria-describedby="reel-help"
      tabIndex={-1}
    >
      <h2 id="reel-title" className="reel-sr">Photos and film stills from C4 Lens</h2>
      <p id="reel-help" className="reel-sr">Move between pictures with the Previous and Next picture buttons, the arrow keys, or by scrolling. Escape closes.</p>

      <div className="reel-stage" aria-hidden="true">
        {indices.map((i) => {
          const f = REEL_FRAMES[wrap(i)];
          return (
            <div key={i} ref={e.refFor('box', i)} className={`reel-box${i === nearest ? ' is-current' : ''}`}>
              <div className="reel-img" style={{ '--tone': grey(f.tone) }}>
                <Picture
                  pic={f.picture}
                  imgRef={e.refFor('img', i)}
                  priority={Math.abs(i - nearest) <= 1 ? 'high' : 'low'}
                  focus={f.focus}
                  focusShort={f.focusShort}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="reel-hint" aria-hidden="true">
        <span className="reel-hint-fine"><span>Scroll<span className="reel-hint-more"> for the next picture</span></span><ArrowDown size={15} strokeWidth={1.5} /></span>
        <span className="reel-hint-touch"><span>Swipe up<span className="reel-hint-more"> for the next picture</span></span><ArrowUp size={15} strokeWidth={1.5} /></span>
      </p>

      <button type="button" className="reel-close" onClick={() => onCloseRef.current()}>
        Close
        <X aria-hidden="true" size={16} strokeWidth={1.5} />
      </button>

      {/* The card, one grid so every row lines up across it. Left: the plate
          number and the caption. Centre: the window onto the picture, cropped
          as the screen behind it is. Right: who it was for, the kind of work,
          where, and when. Each layout in the CSS is the same pieces in
          different grid areas. */}
      <div className="reel-card">
        <p className="reel-number" aria-hidden="true">
          <span className="reel-figures" ref={e.figBoxRef}>
            <Line name="tens" lineRef={e.lineRef('tens')} />
            <Line name="units" lineRef={e.lineRef('units')} />
          </span>
          <span className="reel-of" ref={e.figOfRef}>/{pad(N)}</span>
        </p>
        <Line name="kind" lineRef={e.lineRef('kind')} />
        <Line name="note" lineRef={e.lineRef('note')} />
        <a className="reel-case" href={studyHash} onClick={toStudy} aria-label={`Read about this job: ${current.study.client}`}>
          Read about this job
          <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
        </a>

        <div className="reel-plate" ref={plateRef} aria-hidden="true">
          {indices.map((i) => {
            const f = REEL_FRAMES[wrap(i)];
            return (
              <div key={i} ref={e.refFor('print', i)} className={`reel-print${i === nearest ? ' is-current' : ''}`} style={{ background: grey(f.tone) }}>
                <Picture pic={f.picture} priority="low" focus={f.focus} focusShort={f.focusShort} />
              </div>
            );
          })}
        </div>

        <Line name="client" lineRef={e.lineRef('client')} />
        <Line name="place" lineRef={e.lineRef('place')} />
        <Line name="year" lineRef={e.lineRef('year')} />
        <Line name="where" lineRef={e.lineRef('where')} />
        <div className="reel-steps">
          <button type="button" className="reel-step" aria-label="Previous picture" onClick={() => e.step(-1)}>
            <ChevronUp aria-hidden="true" size={20} strokeWidth={1.5} />
          </button>
          <button type="button" className="reel-step" aria-label="Next picture" onClick={() => e.step(1)}>
            <ChevronDown aria-hidden="true" size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <p ref={liveRef} className="reel-sr" role="status" aria-live="polite" aria-atomic="true" />
    </div>,
    document.body,
  );
}
