/**
 * The Lens reel: "Flick through the pictures" (17 Oct 2026, rebuilt
 * 18 Oct 2026 as one slide per project).
 *
 * Caleb, 17 Oct 2026, on a 21st.dev slider: "thinking about using the above
 * for c4 lens projects. think there's a cool opportunity for a scroll-based
 * component. Can have the project details in the white section." And on
 * 18 Oct: "one slide per project, and find a fancy way to trickle through
 * multiple images within each slide." It opens from the head of the work
 * section (LensWork.jsx), beside "See our case studies", and its code and its
 * type load only when that button is pressed.
 *
 * The slides. Each is one project, full screen, with the card laid over its
 * lower part: the plate number and the caption on the left, a window in the
 * middle, and who it was for, the kind of work, where and when on the right.
 * Set as "a wall label, set by an architecture studio" in Mona Sans (Caleb
 * chose it, 18 Oct 2026: "go A"). Moving between projects works as before:
 * the plate number's figures roll like a counter's wheels, the words that
 * change fade across, and a line whose value doesn't change holds still.
 *
 * The trickle. The window is a strip of the project's pictures, side by side
 * like frames on a contact sheet with paper between them, each frame's
 * number printed under it, and the next and last frames showing at its
 * edges. Every few seconds the strip is drawn one frame along, like film
 * pulled through a viewer, and the picture behind crossfades to the frame
 * now in the window on the same clock, then settles with a slow drift. A
 * hairline under the frame fills while it waits. Only the picture, the frame
 * and the fine print change; the client, the number and the details hold
 * still. ArrowLeft and ArrowRight step through a project's pictures, as do a
 * swipe or a tap on the window. The strip pauses while the pointer is on the
 * window, while keyboard focus is in the card, while the tab is hidden, and
 * whenever the reader presses Pause; Play starts it again. Under reduced
 * motion nothing moves on its own and there's no Pause: a picture changes
 * only when asked, in a 160 ms crossfade.
 *
 * The fine print. While a picture the client supplied is on screen, the card
 * says so in one line (reelProjects.js CLIENT_PHOTO); C4's own pictures carry
 * none.
 *
 * The number is set as type: the face's proportional figures with its own
 * kerning, so 01, 10 and 11 read as numbers, not spaced letters. Each figure
 * has a box of its own, placed where set type would put it (measured from
 * the face once its file has loaded), so during a roll only the figure that
 * changes moves, and the count beside the number slides as its width
 * changes. The number counts projects.
 *
 * Mechanics, from the reference (the "argent loop" slider): a virtualised,
 * endless column of full-screen slides moved by lerped wheel, drag and keys,
 * snapping to the nearest; the picture drifts inside its slide while it
 * moves; the window and the card's lines move in step. Listeners sit on the
 * overlay, never on window (Back's popstate and the document's
 * visibilitychange are the exceptions). Sizes come from ResizeObservers, so
 * the animation loop only writes transforms and, when a slide is crossed,
 * text. It stops once a slide has settled. The trickle runs on the Web
 * Animations API and one pausable timer.
 *
 * Loading. The picture on show in the project on screen loads, and so does
 * the next project's, so the move on shows a picture rather than a grey. The
 * rest of a project's pictures load once it has landed, while its first
 * picture holds, so nothing extra loads while the reel is moving. A picture
 * once loaded stays, so moving back costs nothing.
 *
 * Accessibility: a modal dialog portalled to <body>, with #root inert and the
 * page's scroll locked while it's open. Up and down arrows, Page Up and Down,
 * Space and Shift+Space move between projects; left and right arrows move
 * through a project's pictures; Home and End go to the first and last
 * projects; Escape closes; Tab stays inside; Back closes it too (one history
 * entry while it's open). The moving lines are hidden from screen readers,
 * and a polite status line reads the project and its picture once a slide
 * settles, and the picture when a reader steps to it (not when the strip
 * moves on by itself, which would talk over them). The card's lines grow
 * with their words under a reader's own text spacing, and at 400% zoom the
 * card turns to one scrolling column (lens-reel.css). Over the reel the
 * page's reticle cursor gives way to the system pointer.
 *
 * Content rules: reelProjects.js (what's in, whose it is, and why).
 */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowRight, ArrowUp, ChevronDown, ChevronUp, Pause, Play, X } from 'lucide-react';
import useStaticMode from '@/hooks/useStaticMode';
import { REEL_PROJECTS, CLIENT_PHOTO } from './reelProjects';
import './lens-reel.css';

const N = REEL_PROJECTS.length;
const BUFFER = 3;      // slides rendered either side of the one nearest the centre
const AHEAD = 2;       // how far the scroll may run ahead of what's on screen
const LERP = 0.12;     // per 60 Hz frame
const SNAP_MS = 560;
const WHEEL_GAIN = 0.75;
const WHEEL_MAX = 150;
const IDLE_MS = 120;   // no input for this long and the reel snaps
const NUDGE = 0.06;    // a scroll this far past a slide carries on to the next,
const NUDGE_PX = 30;   //   or this many pixels, whichever is less, so one notch
                       //   of a wheel moves on even on a tall screen
const PULL = 0.2;      // a drag this far does, even let go slowly
const FLICK = 0.45;    // px per ms
const DRIFT = 10;      // % of its height a picture drifts at one slide from centre

/* The trickle. */
const DWELL_MS = 4600;   // a picture holds this long before the strip moves on
const DRAW_MS = 1300;    // the strip drawn one frame along, on its own
const STEP_MS = 560;     // and when a reader asks for the next
const FADE_MS = 160;     // reduced motion: a crossfade, and nothing slides
const SETTLE_MS = 6400;  // a picture's drift from 1.06 to 1, from when it arrives
const SETTLE_FROM = 1.06;
const PEEK = 0.07;       // of the window's width, each neighbour shows at its edge
const GAP = 4;           // px of paper between frames
const SWIPE = 0.18;      // of a frame, a swipe on the window has to travel to move on
const TAP_PX = 8;        // a press that moves less than this is a tap
const DRAW_EASE = 'cubic-bezier(.62, .02, .32, 1)';
const STEP_EASE = 'cubic-bezier(.16, 1, .3, 1)';

const wrap = (i) => ((i % N) + N) % N;
const pad = (n) => String(n).padStart(2, '0');
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
/* Facts run together with a dot between them. If a line has to wrap, it may
   only break after a dot: never inside "Port Kennedy, WA", and never leaving
   a dot at the start of a line. */
const run = (parts) => parts.filter(Boolean).map((p) => p.replace(/ /g, ' ')).join(' · ');
const smooth = (x) => x * x * (3 - 2 * x);

/* Where the reel opens: the project it was left on, and each project's
   picture, if it was open earlier on this visit. */
let resumeAt = 0;
const resumeImage = REEL_PROJECTS.map(() => 0);

/* What each line on the card shows for project k. A line whose value is the
   same for two neighbouring projects doesn't move between them. Each layout
   shows some of them: a wide screen has the kind of work, the place and the
   year each in its own window, so a place holds while only the year
   changes; a phone, upright or on its side, has the kind over the place and
   year run together on one line, so the kind can change while the place
   holds. A project's own place, where it has one, is narrower than its
   study's. */
const placeOf = (p) => p.place || p.study.place;
const LINES = {
  tens: (p, k) => pad(k + 1)[0],
  units: (p, k) => pad(k + 1)[1],
  kind: (p) => p.kind,
  note: (p) => p.note,
  client: (p) => p.study.client,
  place: placeOf,
  year: (p) => p.year || '',
  where: (p) => run([placeOf(p), p.year]),
};
/* Only the plate number's figures roll. Every line of words fades across: a
   word rolled through a one-line window leaves specks of its letters on the
   way, half a caption would sit legible beside half of the next job's name,
   and two windows rolling against each other read as one garbled line. */
const FADES = new Set(['kind', 'client', 'note', 'place', 'year', 'where']);

/* Size hints for the browser's pick from a srcset. A picture covers the
   screen, so it's as wide as the screen, or wider when the screen is taller
   than the picture. The window's strip is given the same hint, so it shows
   the file the slide already fetched rather than fetching a smaller one. */
const sizesFor = (s) => `(min-aspect-ratio: ${s.width}/${s.height}) 100vw, calc(100vh * ${(s.width / s.height).toFixed(3)})`;
const setFor = (s, ext) => s.widths.filter((w) => w <= s.width).map((w) => `${s.base}-${w}.${ext} ${w}w`).join(', ');

/* While a picture loads, its layer and its frame show a grey of the
   picture's own brightness: its tone (reelProjects.js, the picture averaged
   to one colour) with the colour taken out, so nothing opens on black and
   nothing flashes a block of colour. */
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
   Its focal points come from the layer around it (CSS custom properties),
   and the stylesheet picks the short-screen one on a phone held sideways. */
function Picture({ pic, priority }) {
  const setRef = useCallback((el) => { settleImg(el); }, []);
  const common = {
    alt: '', decoding: 'async', draggable: false, ref: setRef, onLoad: developed, onError: failed,
    fetchpriority: priority,
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

const focusVars = (im) => ({ '--focus': im.focus || '50% 50%', '--focus-short': im.focusShort || im.focus || '50% 50%' });

/* What a screen reader hears: the project and its picture when a slide
   settles, and the picture alone when a reader steps to it. */
function describeImage(idx, j) {
  const proj = REEL_PROJECTS[wrap(idx)];
  const im = proj.images[j];
  return `Picture ${j + 1} of ${proj.images.length}. ${im.picture.alt}${im.client ? ` ${CLIENT_PHOTO}` : ''}`;
}
function describe(idx, j) {
  const proj = REEL_PROJECTS[wrap(idx)];
  const where = [proj.kind, placeOf(proj), proj.year].filter(Boolean).join(', ');
  return `Project ${wrap(idx) + 1} of ${N}. ${proj.study.client}. ${where}. ${proj.note} ${describeImage(idx, j)}`;
}

/* A line on the card: two copies stacked in a window, the value at this
   project and the value at the next, moved between by the loop. */
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
  const cardRef = useRef(null);
  const liveRef = useRef(null);
  const fineRef = useRef(null);
  const countRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [nearest, setNearest] = useState(() => resumeAt);
  const [landed, setLanded] = useState(null);
  const [paused, setPaused] = useState(false);
  /* Which pictures may load: the picture on show in the project on screen
     and in the next one, and, once a project has landed, the rest of its
     pictures, which are offscreen until the strip moves on. Nothing more
     loads while the reel is moving. Once in, a picture stays. */
  const mountedRef = useRef(new Set());

  /* Everything the loop and the listeners share, made once. P is the slides'
     step (the overlay's height), ph the window's height and pw its width. */
  const engine = useRef(null);
  if (!engine.current) {
    const els = { box: new Map(), drift: new Map(), print: new Map(), strip: new Map() };
    const layers = new Map();   // `${i}:${j}` -> the picture layer for image j in slide i
    const frames = new Map();   // `${i}:${s}` -> the strip's frame s in slide i
    const refs = new Map();
    const lines = new Map();
    const s = {
      still, P: 0, ph: 0, pw: 0, currentY: 0, targetY: 0, vel: 0, snapV0: 0, raf: 0, last: 0,
      lastInput: 0, dir: 0, snapping: false, snapFrom: 0, snapTo: 0, snapT0: 0,
      pointer: null, dragging: false, dragY0: 0, dragTarget0: 0, samples: [], press: null,
      wheelT: 0, wheelAcc: 0, wheelSpent: false, lineBase: null,
      nearest: resumeAt, settledIdx: null, moved: false, popped: false, landing: null,
    };
    /* The trickle: each project's picture, the timer that moves the current
       project on, and what's holding it. */
    const t = {
      at: resumeImage.slice(), settled: false, paused: false, hover: false, focus: false,
      hidden: typeof document !== 'undefined' && document.hidden,
      timer: 0, due: 0, left: DWELL_MS, clockFor: null,
      drift: null, line: null, pulls: new Map(), drag: null, fineAt: 0,
    };
    const e = { els, layers, frames, s, t };

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

    /* A picture layer arrives showing its project's current picture, or not. */
    e.layerRef = (i, j) => {
      const key = `layer:${i}:${j}`;
      let fn = refs.get(key);
      if (!fn) {
        fn = (el) => {
          if (el) {
            layers.set(`${i}:${j}`, el);
            el.dataset.on = t.at[wrap(i)] === j ? '1' : '';
          } else { layers.delete(`${i}:${j}`); refs.delete(key); }
        };
        refs.set(key, fn);
      }
      return fn;
    };

    /* A strip arrives drawn to its project's current picture, that frame's
       number showing. (Its frames' refs have run by then: React attaches a
       child's ref before its parent's.) */
    e.stripRef = (i) => {
      const key = `strip:${i}`;
      let fn = refs.get(key);
      if (!fn) {
        fn = (el) => {
          if (el) {
            els.strip.set(i, el);
            const k = t.at[wrap(i)] + 1;
            if (s.pw) el.style.transform = `translate3d(${e.stripX(k).toFixed(2)}px,0,0)`;
            e.markFrame(i, k);
          } else { els.strip.delete(i); refs.delete(key); }
        };
        refs.set(key, fn);
      }
      return fn;
    };

    /* Which frame of a strip shows its number: the one in the window. The
       number fades in as its frame arrives and out as it leaves; `instant`
       swaps it where the strip is put back on the same picture. */
    e.markFrame = (i, k, instant = false) => {
      const strip = els.strip.get(i);
      const count = REEL_PROJECTS[wrap(i)].images.length + 2;
      if (instant && strip) strip.classList.add('no-fade');
      for (let f = 0; f < count; f += 1) frames.get(`${i}:${f}`)?.classList.toggle('is-on', f === k);
      if (instant && strip) {
        void strip.offsetWidth; // the swap lands before the fade comes back
        strip.classList.remove('no-fade');
      }
    };

    e.frameRef = (i, k) => {
      const key = `frame:${i}:${k}`;
      let fn = refs.get(key);
      if (!fn) {
        fn = (el) => {
          if (el) frames.set(`${i}:${k}`, el);
          else { frames.delete(`${i}:${k}`); refs.delete(key); }
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
       number's width at each project, and the count beside it is slid by the
       difference while the reel moves between two projects. */
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

    /* The lines: when a project is crossed, each window gets the values
       either side of it; between projects, the ones that differ roll or
       fade. A fade lets the old value go by the time the slides are 45%
       across and brings the new one in from 55%, so two values are never
       legible at once. */
    e.writeLines = (pos) => {
      let base = Math.floor(pos);
      let t2 = pos - base;
      if (t2 > 0.9995) { base += 1; t2 = 0; }
      if (base !== s.lineBase) {
        const fA = REEL_PROJECTS[wrap(base)];
        const fB = REEL_PROJECTS[wrap(base + 1)];
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
      const ofAt = s.still ? 0 : t2;
      if (fig.of && ofAt !== fig.at) {
        fig.at = ofAt;
        fig.of.style.transform = ofAt && fig.shift ? `translate3d(${(fig.shift * ofAt).toFixed(2)}px,0,0)` : '';
      }
      /* Only lines whose place changed are written. */
      lines.forEach((ln) => {
        const at = ln.still || s.still ? 0 : t2;
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

    /* Transforms only, and text when a project is crossed. Reads nothing from
       the layout. Under reduced motion the slides and the window crossfade in
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
        const drift = els.drift.get(i);
        if (!drift) return;
        const p = clamp(off / P, -1, 1);
        drift.style.transform = Math.abs(p) < 1e-4
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

    e.announce = (text) => {
      if (liveRef.current) liveRef.current.textContent = text;
    };

    /* ── The trickle ─────────────────────────────────────────────────────
       The strip holds the project's frames with one more at each end: the
       last picture before the first, and the first after the last, so the
       strip can always be drawn on in the direction it's going and then put
       back where the same picture sits, without a jump. Frame s shows
       picture s - 1. */
    e.frameW = () => s.pw * (1 - 2 * PEEK);
    e.stripX = (k) => s.pw * PEEK - k * (e.frameW() + GAP);
    e.copies = (p) => [...els.strip.keys()].filter((i) => wrap(i) === p);
    e.boxes = (p) => [...els.drift.keys()].filter((i) => wrap(i) === p);
    e.placeStrip = (p, k) => {
      const x = `translate3d(${e.stripX(k).toFixed(2)}px,0,0)`;
      e.copies(p).forEach((i) => { const el = els.strip.get(i); if (el) el.style.transform = x; });
    };
    e.placeAll = () => { for (let p = 0; p < N; p += 1) e.placeStrip(p, t.at[p] + 1); };

    /* A pull under way finishes at once: its pictures and its frame land. */
    e.land = (p) => {
      const pull = t.pulls.get(p);
      if (!pull) return;
      t.pulls.delete(p);
      pull.anims.forEach((a) => { try { a.finish(); } catch { /* gone */ } });
      pull.done();
    };

    e.fine = (on) => {
      const el = fineRef.current;
      if (el) el.classList.toggle('is-on', !!on);
    };
    e.count = (p) => {
      const el = countRef.current;
      if (el) el.textContent = `${t.at[p] + 1}/${REEL_PROJECTS[p].images.length}`;
    };

    /* The picture's slow drift, on the slide on screen: from a little closer
       to exactly cropped, over its time in the window. */
    e.driftOn = (p, j) => {
      /* The picture going out keeps the scale it had, so nothing jumps under
         the crossfade; its drift goes when the crossfade lands (showImage),
         or now if it belongs to another project, already off screen. */
      if (t.drift) {
        try { if (t.driftFor === p) t.drift.pause(); else t.drift.cancel(); } catch { /* gone */ }
        t.drift = null;
      }
      if (s.still) return;
      t.driftFor = p;
      const el = layers.get(`${s.nearest}:${j}`);
      if (!el || wrap(s.nearest) !== p || !el.animate) return;
      t.drift = el.animate([{ transform: `scale(${SETTLE_FROM})` }, { transform: 'scale(1)' }],
        { duration: SETTLE_MS, easing: 'cubic-bezier(.2, .6, .3, 1)', fill: 'both' });
      if (e.blocked()) t.drift.pause();
    };

    /* The hairline under the frame in the window, filling while the picture
       waits for the strip to move on. */
    e.lineOn = (p, ms) => {
      if (t.line) { try { t.line.cancel(); } catch { /* gone */ } t.line = null; }
      if (s.still || wrap(s.nearest) !== p) return;
      const el = frames.get(`${s.nearest}:${t.at[p] + 1}`)?.querySelector('.reel-frame-time');
      if (!el || !el.animate) return;
      t.line = el.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: ms, easing: 'linear', fill: 'both' });
      if (e.blocked()) t.line.pause();
    };

    e.blocked = () => s.still || !t.settled || t.paused || t.hover || t.focus || t.hidden || !!t.drag;

    /* One timer moves the current project on. It pauses with time left and
       picks up from there. */
    e.clockRestart = (p, extra = 0) => {
      if (t.timer) { clearTimeout(t.timer); t.timer = 0; }
      t.clockFor = p;
      t.left = DWELL_MS + extra;
      e.lineOn(p, t.left);
      e.clockGo();
    };
    e.clockGo = () => {
      if (t.timer || e.blocked() || t.clockFor !== wrap(s.nearest)) return;
      t.due = performance.now() + t.left;
      t.timer = window.setTimeout(e.clockFire, t.left);
      try { t.drift?.play(); t.line?.play(); } catch { /* gone */ }
    };
    e.clockStop = () => {
      if (t.timer) {
        clearTimeout(t.timer);
        t.timer = 0;
        t.left = Math.max(0, t.due - performance.now());
      }
      try { t.drift?.pause(); t.line?.pause(); } catch { /* gone */ }
    };
    e.clockFire = () => {
      t.timer = 0;
      const p = wrap(s.nearest);
      if (p !== t.clockFor || e.blocked()) return;
      e.showImage(p, (t.at[p] + 1) % REEL_PROJECTS[p].images.length, 'draw');
    };
    e.trickleUpdate = () => { if (e.blocked()) e.clockStop(); else e.clockGo(); };

    /* To picture j of project p: 'draw' is the strip moving on by itself,
       'step' a reader asking. The strip slides and the slide behind
       crossfades on the same clock; under reduced motion both change in a
       quick crossfade instead. A swipe hands over where the finger left the
       strip. */
    e.showImage = (p, j, how, from = null) => {
      const imgs = REEL_PROJECTS[p].images;
      const n = imgs.length;
      const was = t.at[p];
      if (j === was && !from) return;
      e.land(p);
      const fwd = from ? from.dir > 0 : (j === (was + 1) % n || (j > was && !(was === 0 && j === n - 1)));
      let kFrom = was + 1;
      let kTo = j + 1;
      if (fwd && was === n - 1 && j === 0) kTo = n + 1;
      if (!fwd && was === 0 && j === n - 1) kTo = 0;
      const kEnd = j + 1;
      const quick = s.still;
      const ms = quick ? FADE_MS : how === 'draw' ? DRAW_MS : STEP_MS;
      const ease = how === 'draw' ? DRAW_EASE : STEP_EASE;
      t.at[p] = j;
      resumeImage[p] = j;
      const anims = [];
      e.copies(p).forEach((i) => {
        const strip = els.strip.get(i);
        if (!strip?.animate) return;
        if (quick) {
          strip.style.transform = `translate3d(${e.stripX(kEnd).toFixed(2)}px,0,0)`;
          e.markFrame(i, kEnd, true);
          anims.push(strip.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: ms, easing: 'linear' }));
          return;
        }
        e.markFrame(i, kTo);
        const x0 = from ? from.x : e.stripX(kFrom);
        anims.push(strip.animate(
          [{ transform: `translate3d(${x0.toFixed(2)}px,0,0)` }, { transform: `translate3d(${e.stripX(kTo).toFixed(2)}px,0,0)` }],
          { duration: ms, easing: ease, fill: 'forwards' },
        ));
      });
      /* The picture behind dissolves while the frame crosses the middle of
         the window, so the two pictures are seen together only briefly. A
         swipe hands over where the finger left it. */
      const fadeDelay = quick || from ? 0 : ms * 0.18;
      const fadeMs = quick || from ? ms : ms * 0.64;
      e.boxes(p).forEach((i) => {
        const inn = layers.get(`${i}:${j}`);
        if (!inn?.animate) return;
        inn.dataset.top = '1';
        const o0 = from && i === s.nearest ? from.fade : 0;
        anims.push(inn.animate([{ opacity: o0 }, { opacity: 1 }],
          { duration: fadeMs, delay: fadeDelay, easing: quick ? 'linear' : 'cubic-bezier(.45, 0, .55, 1)', fill: 'both' }));
      });
      const done = () => {
        e.placeStrip(p, kEnd);
        e.copies(p).forEach((i) => {
          els.strip.get(i)?.getAnimations?.().forEach((a) => a.cancel());
          if (kTo !== kEnd) e.markFrame(i, kEnd, true);
        });
        e.boxes(p).forEach((i) => {
          imgs.forEach((_, jj) => {
            const el = layers.get(`${i}:${jj}`);
            if (!el) return;
            el.dataset.on = jj === j ? '1' : '';
            el.dataset.top = '';
            el.style.opacity = '';
            el.getAnimations?.().forEach((a) => { if (a !== t.drift) a.cancel(); });
          });
        });
      };
      /* Done when every part of the move is: the strip and the dissolve end at
         different times. A pull cut short lands at once (land). */
      const pull = { anims, done };
      t.pulls.set(p, pull);
      const finish = () => { if (t.pulls.get(p) === pull) { t.pulls.delete(p); done(); } };
      if (anims.length) Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(finish);
      else finish();
      if (p === wrap(s.nearest)) {
        e.count(p);
        e.driftOn(p, j);
        /* The fine print changes halfway, as the pictures cross. */
        window.clearTimeout(t.fineAt);
        if (quick) e.fine(imgs[j].client);
        else t.fineAt = window.setTimeout(() => { if (wrap(s.nearest) === p && t.settled) e.fine(imgs[j].client); }, ms / 2);
        if (how !== 'draw') e.announce(describeImage(p, j));
        e.clockRestart(p, ms);
      }
    };

    /* A step from a key, a tap or a swipe, through the project on screen. */
    e.imageStep = (d) => {
      const p = wrap(s.nearest);
      const n = REEL_PROJECTS[p].images.length;
      e.moved();
      e.showImage(p, (t.at[p] + d + n) % n, 'step');
    };

    /* A finger or a mouse dragging the strip sideways: the strip follows, and
       the picture it's being drawn to fades in behind as it comes. */
    e.dragStart = () => {
      const p = wrap(s.nearest);
      e.land(p);
      t.drag = { p, k: t.at[p] + 1, dir: 0, fade: 0, x: e.stripX(t.at[p] + 1) };
      e.clockStop();
      e.moved();
    };
    e.dragMove = (dx) => {
      const d = t.drag;
      if (!d || s.still) return; // reduced motion: the strip waits for the swipe to finish
      const span = e.frameW() + GAP;
      const off = clamp(dx, -span, span);
      const n = REEL_PROJECTS[d.p].images.length;
      const dir = off < 0 ? 1 : off > 0 ? -1 : 0;
      const next = (t.at[d.p] + (dir || 1) + n) % n;
      d.x = e.stripX(d.k) + off;
      d.dir = dir;
      d.fade = Math.abs(off) / span;
      e.copies(d.p).forEach((i) => { const el = els.strip.get(i); if (el) el.style.transform = `translate3d(${d.x.toFixed(2)}px,0,0)`; });
      const show = layers.get(`${s.nearest}:${next}`);
      if (d.shown && d.shown !== show) { d.shown.dataset.top = ''; d.shown.style.opacity = ''; }
      if (show && dir) { show.dataset.top = '1'; show.style.opacity = d.fade.toFixed(3); d.shown = show; }
    };
    e.dragEnd = (dx, v) => {
      const d = t.drag;
      if (!d) return;
      t.drag = null;
      const span = e.frameW() + GAP;
      const n = REEL_PROJECTS[d.p].images.length;
      if (s.still) {
        if (Math.abs(dx) > TAP_PX * 3) e.showImage(d.p, (t.at[d.p] + (dx < 0 ? 1 : -1) + n) % n, 'step');
        return;
      }
      const go = d.dir && (Math.abs(dx) > SWIPE * span || (Math.abs(v) > FLICK && Math.sign(v) === -d.dir));
      if (go) {
        if (d.shown) d.shown.style.opacity = '';
        e.showImage(d.p, (t.at[d.p] + d.dir + n) % n, 'step', { x: d.x, fade: d.fade, dir: d.dir });
        return;
      }
      /* Not far enough: the strip goes back, and so does the picture. */
      const anims = [];
      e.copies(d.p).forEach((i) => {
        const el = els.strip.get(i);
        if (el?.animate) anims.push(el.animate([{ transform: `translate3d(${d.x.toFixed(2)}px,0,0)` }, { transform: `translate3d(${e.stripX(d.k).toFixed(2)}px,0,0)` }], { duration: STEP_MS, easing: STEP_EASE }));
      });
      e.placeStrip(d.p, d.k);
      if (d.shown?.animate) {
        const el = d.shown;
        el.style.opacity = '';
        el.animate([{ opacity: d.fade }, { opacity: 0 }], { duration: STEP_MS, easing: 'ease-out' }).onfinish = () => { el.dataset.top = ''; };
      }
      e.trickleUpdate();
    };

    /* A slide has landed: say which, and start its strip, its picture held
       for a full turn. (The picture that arrives with a slide has already
       settled on the move itself, so its drift starts with the next one.
       is-settled styles nothing; it marks the state for anyone inspecting
       the reel.) */
    e.settle = (idx) => {
      rootRef.current?.classList.add('is-settled');
      const p = wrap(idx);
      const first = !t.settled || idx !== s.settledIdx;
      t.settled = true;
      if (idx !== s.settledIdx) {
        s.settledIdx = idx;
        e.announce(describe(idx, t.at[p]));
      }
      e.count(p);
      e.fine(REEL_PROJECTS[p].images[t.at[p]].client);
      e.onLanded?.(p);
      if (first) e.clockRestart(p);
      else e.trickleUpdate();
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
      if (t.settled) {
        t.settled = false;
        e.clockStop();
        window.clearTimeout(t.fineAt);
        e.fine(false);
      }
      e.kick();
    };

    e.kick = () => {
      if (s.still || s.raf) return;
      s.last = 0;
      s.raf = requestAnimationFrame(e.tick);
    };

    /* Where a scroll or a drag comes to rest: on to the next project in the
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
       slide, never faster than that ease-out would start, so it eases on
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
        const k = clamp((now - s.snapT0) / SNAP_MS, 0, 1);
        const d = s.snapTo - s.snapFrom;
        const v = s.snapV0 * SNAP_MS;
        s.targetY = s.snapFrom + v * (k ** 3 - 2 * k ** 2 + k) + d * (3 * k ** 2 - 2 * k ** 3);
        if (k >= 1) { s.snapping = false; s.targetY = s.snapTo; }
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

    /* Straight to a project: no travel. Reduced motion, Home and End use it. */
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

    /* The nearest showing of project k: Home from the last is one step on. */
    e.jump = (k) => {
      const anchor = e.anchor();
      let d = k - wrap(anchor);
      if (d > N / 2) d -= N;
      else if (d < -N / 2) d += N;
      if (Math.abs(d) > AHEAD) e.cut(anchor + d);
      else e.goTo(anchor + d);
    };

    /* Sizes, read outside the loop. A change keeps the slide on screen and
       puts every strip back on its picture. */
    e.measure = () => {
      const root = rootRef.current;
      const plate = plateRef.current;
      if (!root) return;
      const P = root.clientHeight;
      const ph = plate ? plate.clientHeight : 0;
      const pw = plate ? plate.clientWidth : 0;
      if (pw !== s.pw) {
        s.pw = pw;
        for (let p = 0; p < N; p += 1) e.land(p);
        e.placeAll();
      }
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
  e.onLanded = setLanded;

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
    const { s, t } = e;
    let alive = true;
    e.measureFigures();
    e.measure();
    e.write();
    e.count(wrap(s.nearest));
    rootRef.current.focus({ preventScroll: true });
    const again = () => { if (alive) { e.measureFigures(); e.write(); } };
    if (document.fonts?.load) document.fonts.load('200 100px "Mona Sans"').then(again, again);
    return () => {
      alive = false;
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = 0;
      if (t.timer) clearTimeout(t.timer);
      t.timer = 0;
      window.clearTimeout(t.fineAt);
    };
  }, [e]);

  /* New slides come into the rendered window as the reel moves: place them
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

  /* Pause and Play. Play also lifts the pause that keyboard focus in the card
     puts on the strip, since pressing it is the reader asking for motion. */
  useEffect(() => {
    e.t.paused = paused;
    if (!paused) e.t.focus = false;
    e.trickleUpdate();
  }, [e, paused]);

  /* The strip holds while the pointer is on the card, while keyboard focus
     is in it, and while the tab is hidden. */
  useEffect(() => {
    const { t } = e;
    const card = cardRef.current;
    const onEnter = (ev) => { if (ev.pointerType === 'mouse') { t.hover = true; e.trickleUpdate(); } };
    const onLeave = (ev) => { if (ev.pointerType === 'mouse') { t.hover = false; e.trickleUpdate(); } };
    const onFocusIn = (ev) => {
      const el = ev.target;
      t.focus = el instanceof Element && el.matches(':focus-visible');
      e.trickleUpdate();
    };
    const onFocusOut = (ev) => {
      if (card.contains(ev.relatedTarget)) return;
      t.focus = false;
      e.trickleUpdate();
    };
    const onVisible = () => { t.hidden = document.hidden; e.trickleUpdate(); };
    card?.addEventListener('pointerenter', onEnter);
    card?.addEventListener('pointerleave', onLeave);
    card?.addEventListener('focusin', onFocusIn);
    card?.addEventListener('focusout', onFocusOut);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      card?.removeEventListener('pointerenter', onEnter);
      card?.removeEventListener('pointerleave', onLeave);
      card?.removeEventListener('focusin', onFocusIn);
      card?.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [e]);

  /* Back closes the reel, as it closes a phone's full-screen viewer: one
     history entry while it's open, taken back off when it closes. The study
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

  /* The first slide is read out after the dialog's own name, and its strip
     starts. On the way out the reel remembers where it was, for the next time
     it opens. */
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
    /* The window, where a sideways swipe or a tap moves through pictures. */
    const onWindow = (target) => target instanceof Element && !!target.closest('.reel-plate')
      && getComputedStyle(plateRef.current).display !== 'none';

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

    /* Take hold for an up-and-down drag through the projects. */
    const holdReel = (ev) => {
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
    };

    const onPointerDown = (ev) => {
      if (s.pointer !== null) { // a second finger: drop the drag and let it pinch
        s.pointer = null;
        s.dragging = false;
        s.press = null;
        if (e.t.drag) e.dragEnd(0, 0);
        s.lastInput = performance.now();
        e.kick();
        return;
      }
      if (ev.button !== 0 || (ev.target instanceof Element && ev.target.closest('a, button')) || scrollingCard(ev.target)) return;
      s.pointer = ev.pointerId;
      if (onWindow(ev.target)) {
        /* On the window: wait to see which way it goes. */
        s.press = { x0: ev.clientX, y0: ev.clientY, mode: null, samples: [[ev.timeStamp, ev.clientX]] };
      } else {
        s.press = null;
        holdReel(ev);
      }
      try { root.setPointerCapture(ev.pointerId); } catch { /* not capturable */ }
    };

    const onPointerMove = (ev) => {
      if (ev.pointerId !== s.pointer) return;
      const pr = s.press;
      if (pr) {
        const dx = ev.clientX - pr.x0;
        const dy = ev.clientY - pr.y0;
        if (!pr.mode && Math.max(Math.abs(dx), Math.abs(dy)) > TAP_PX) {
          if (Math.abs(dx) > Math.abs(dy)) { pr.mode = 'x'; e.dragStart(); } else { pr.mode = 'y'; holdReel(ev); }
        }
        if (pr.mode === 'x') {
          pr.samples.push([ev.timeStamp, ev.clientX]);
          while (pr.samples.length > 2 && ev.timeStamp - pr.samples[0][0] > 100) pr.samples.shift();
          e.dragMove(dx);
          return;
        }
        if (pr.mode !== 'y') return;
      }
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
      const pr = s.press;
      s.press = null;
      if (pr && pr.mode !== 'y') {
        if (pr.mode === 'x') {
          const [t0, x0] = pr.samples[0];
          const [t1, x1] = pr.samples[pr.samples.length - 1];
          const v = t1 > t0 && ev.timeStamp - t1 < 80 ? (x1 - x0) / (t1 - t0) : 0;
          e.dragEnd(ev.clientX - pr.x0, v);
        } else e.imageStep(1); // a tap on the window: the next picture
        return;
      }
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
      if (s.press?.mode === 'x') e.dragEnd(0, 0);
      s.press = null;
      s.dragging = false;
      s.lastInput = performance.now();
      e.kick();
    };

    /* iOS can still scroll what's behind on a drag; a pinch stays a pinch,
       and a card that scrolls its words keeps its own swipe. */
    const onTouchMove = (ev) => {
      if (ev.touches.length === 1 && ev.cancelable && !scrollingCard(ev.target)) ev.preventDefault();
    };

    const focusables = () => [...root.querySelectorAll('a[href], button:not([disabled]), [role="button"][tabindex="0"]')]
      .filter((el) => !el.closest('[aria-hidden="true"]') && el.getClientRects().length);

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
      const onControl = ev.target instanceof Element && ev.target.closest('a, button, [role="button"]');
      /* Enter or Space on the window: the next picture. */
      if ((k === 'Enter' || k === ' ' || k === 'Spacebar') && ev.target === plateRef.current) {
        ev.preventDefault();
        if (!ev.repeat) e.imageStep(1);
        return;
      }
      /* Each press steps at once. A held key's repeats wait until the step
         under way is most of the way there, so holding a key moves through
         the projects at a pace that still shows each one. */
      const pacing = ev.repeat && s.snapping && performance.now() - s.snapT0 < SNAP_MS * 0.6;
      if (pacing && /^(Arrow(Up|Down)|Page)|^ $|^Spacebar$/.test(k) && !(onControl && (k === ' ' || k === 'Spacebar'))) { ev.preventDefault(); return; }
      if (k === 'ArrowDown' || k === 'PageDown') { ev.preventDefault(); e.step(1); }
      else if (k === 'ArrowUp' || k === 'PageUp') { ev.preventDefault(); e.step(-1); }
      else if (k === 'ArrowRight' || k === 'ArrowLeft') {
        ev.preventDefault();
        /* Held, the pictures go by one per step's length. */
        if (ev.repeat && performance.now() - (e.t.lastStep || 0) < STEP_MS * 0.8) return;
        e.t.lastStep = performance.now();
        e.imageStep(k === 'ArrowRight' ? 1 : -1);
      } else if ((k === ' ' || k === 'Spacebar') && !onControl) { ev.preventDefault(); e.step(ev.shiftKey ? -1 : 1); }
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
  const pNow = wrap(nearest);
  const current = REEL_PROJECTS[pNow];
  const studyHash = `#work-${current.study.id}`;
  /* What may load now: every picture of the project on screen, and the
     picture the next one shows first. */
  const mounted = mountedRef.current;
  mounted.add(`${pNow}:${e.t.at[pNow]}`);
  mounted.add(`${wrap(nearest + 1)}:${e.t.at[wrap(nearest + 1)]}`);
  if (landed !== null) REEL_PROJECTS[wrap(landed)].images.forEach((_, j) => mounted.add(`${wrap(landed)}:${j}`));

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
      <h2 id="reel-title" className="reel-sr">Pictures from our projects</h2>
      <p id="reel-help" className="reel-sr">
        {`Move between projects with the up and down arrow keys or by scrolling. The left and right arrow keys, or the Next picture button, move through a project’s pictures${still ? '' : ', which also move on by themselves until you press Pause'}. Escape closes.`}
      </p>

      <div className="reel-stage" aria-hidden="true">
        {indices.map((i) => {
          const p = wrap(i);
          const proj = REEL_PROJECTS[p];
          return (
            <div key={i} ref={e.refFor('box', i)} className={`reel-box${i === nearest ? ' is-current' : ''}`}>
              <div className="reel-img">
                <div className="reel-drift" ref={e.refFor('drift', i)}>
                  {proj.images.map((im, j) => (
                    <div key={im.id} ref={e.layerRef(i, j)} className="reel-layer" style={{ '--tone': grey(im.tone), ...focusVars(im) }}>
                      {mounted.has(`${p}:${j}`) && <Picture pic={im.picture} priority={p === pNow ? 'high' : 'low'} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="reel-hint" aria-hidden="true">
        <span className="reel-hint-fine"><span>Scroll<span className="reel-hint-more"> for the next project</span></span><ArrowDown size={15} strokeWidth={1.5} /></span>
        <span className="reel-hint-touch"><span>Swipe up<span className="reel-hint-more"> for the next project</span></span><ArrowUp size={15} strokeWidth={1.5} /></span>
      </p>

      <button type="button" className="reel-close" onClick={() => onCloseRef.current()}>
        Close
        <X aria-hidden="true" size={16} strokeWidth={1.5} />
      </button>

      {/* The card, one grid so every row lines up across it. Left: the plate
          number and the caption. Centre: the window, a strip of the project's
          pictures. Right: who it was for, the kind of work, where, and when,
          with the fine print under them while a client's picture shows. Each
          layout in the CSS is the same pieces in different grid areas. */}
      <div className="reel-card" ref={cardRef}>
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

        {/* The window is also the way to the next picture: a click, a tap,
            Enter or Space on it, or a swipe across it. */}
        <div
          className="reel-plate"
          ref={plateRef}
          role="button"
          tabIndex={0}
          aria-label="Next picture"
          style={{ '--peek': PEEK, '--frame-gap': `${GAP}px` }}
        >
          {indices.map((i) => {
            const p = wrap(i);
            const imgs = REEL_PROJECTS[p].images;
            const n = imgs.length;
            const order = [n - 1, ...imgs.map((_, j) => j), 0];
            return (
              <div key={i} ref={e.refFor('print', i)} className={`reel-print${i === nearest ? ' is-current' : ''}`} aria-hidden="true">
                <div className="reel-strip" ref={e.stripRef(i)}>
                  {order.map((j, k) => (
                    <div key={k} ref={e.frameRef(i, k)} className="reel-frame">
                      <div className="reel-frame-pic" style={{ background: grey(imgs[j].tone), ...focusVars(imgs[j]) }}>
                        {mounted.has(`${p}:${j}`) && <Picture pic={imgs[j].picture} priority="low" />}
                      </div>
                      <span className="reel-frame-no">{j + 1}/{n}</span>
                      <span className="reel-frame-time" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <Line name="client" lineRef={e.lineRef('client')} />
        <Line name="place" lineRef={e.lineRef('place')} />
        <Line name="year" lineRef={e.lineRef('year')} />
        <Line name="where" lineRef={e.lineRef('where')} />
        <p className="reel-fine" ref={fineRef} aria-hidden="true">{CLIENT_PHOTO}</p>
        <div className="reel-steps">
          <span className="reel-count" ref={countRef} aria-hidden="true" />
          {!still && (
            <button type="button" className="reel-step reel-play" aria-label={paused ? 'Play the pictures' : 'Pause the pictures'} onClick={() => setPaused((v) => !v)}>
              {paused ? <Play aria-hidden="true" size={17} strokeWidth={1.5} /> : <Pause aria-hidden="true" size={17} strokeWidth={1.5} />}
            </button>
          )}
          <button type="button" className="reel-step" aria-label="Previous project" onClick={() => e.step(-1)}>
            <ChevronUp aria-hidden="true" size={20} strokeWidth={1.5} />
          </button>
          <button type="button" className="reel-step" aria-label="Next project" onClick={() => e.step(1)}>
            <ChevronDown aria-hidden="true" size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <p ref={liveRef} className="reel-sr" role="status" aria-live="polite" aria-atomic="true" />
    </div>,
    document.body,
  );
}
