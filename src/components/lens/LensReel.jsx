/**
 * The Lens reel: "Flick through the pictures" (17 Oct 2026, a prototype).
 *
 * Caleb, 17 Oct 2026, on a 21st.dev slider: "thinking about using the above
 * for c4 lens projects. think there's a cool opportunity for a scroll-based
 * component. Can have the project details in the white section." It opens
 * from the head of the work section (LensWork.jsx), beside "See our case
 * studies", and its code loads only when that button is pressed.
 *
 * Direction, as built (an extension of the /Lens world):
 *   THESIS. Playback. The camera's review screen: one frame at a time, whole,
 *   on black, stepped by the scroll the way a control dial clicks through a
 *   card. It refuses the lightbox grid of thumbnails behind arrows.
 *   OWN-WORLD. The page's camera as it is: a black field, Bebas names, Geist
 *   words, Geist Mono for anything counted, amber viewfinder corners that lock
 *   when a frame settles. The one light object is the white card, a slip of
 *   contact sheet in the page's own ink white: a strip of black film inset in
 *   its margin, the frame's print centred with its neighbours cut off at the
 *   strip's ends, the details beside it, and the reel's twelve frames averaged
 *   to a strip of colour, the films' own scrubber turned readout.
 *   STORY. A visitor flicks through C4 Lens's own photos and film stills,
 *   reads on the card who each was made for, where and when, and can go to
 *   that job's case study on the page.
 *   FIRST VIEWPORT. The HVN film's opening frame, whole, coming into focus in
 *   the room the card leaves; the corners lock; the card in the bottom-left
 *   corner, beside the frame on a wide screen and under it on a tall one;
 *   Close top right; one line of help top left.
 *   FORM. Extension of the existing Lens world, no new faces. A local
 *   extension, so no concept roll and no seed.
 *   FINISH. unreviewed and undocumented is unfinished; this build ends with
 *   the finish review, the verdict, DESIGN.md, and every shipping raster
 *   carrying its provenance
 *
 * Mechanics, taken from the reference (the "argent loop" slider) and scoped:
 * a virtualised, endless column of frames moved by lerped wheel, drag and
 * keys, snapping to the nearest frame; the picture drifts inside its frame
 * while it moves and sits whole once it lands; the card's window holds a print
 * track and a details track that move in step with the frames. The frames
 * travel through a gate (the stage, clipped to the frame's room) with a thin
 * line between them, so nothing passes under the card. Listeners sit on the
 * overlay, never on window (Back's popstate is the one exception). Sizes come
 * from ResizeObservers, so the animation loop only writes transforms, and it
 * stops once a frame has settled. Reduced motion: every step crossfades in
 * 160 ms, and nothing drifts.
 *
 * Accessibility: a modal dialog portalled to <body>, with #root inert and the
 * page's scroll locked while it's open. Arrow keys, Page Up and Down, Space
 * and Shift+Space step; Home and End go to the first and last frames; Escape
 * closes; Tab stays inside; Back closes it too (one history entry while it's
 * open). The moving tracks are hidden from screen readers, and a polite status
 * line reads each frame once it settles.
 *
 * Content rules: reelFrames.js (what's in, what's out, and why).
 */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, X } from 'lucide-react';
import useStaticMode from '@/hooks/useStaticMode';
import { REEL_FRAMES } from './reelFrames';
import './lens-reel.css';

const N = REEL_FRAMES.length;
const BUFFER = 3;      // frames rendered either side of the one nearest the centre
const AHEAD = 2;       // how far the scroll may run ahead of what's on screen
const LERP = 0.12;     // per 60 Hz frame
const SNAP_MS = 520;
const WHEEL_GAIN = 0.75;
const WHEEL_MAX = 150;
const IDLE_MS = 120;   // no input for this long and the reel snaps
const NUDGE = 0.06;    // a scroll this far past a frame carries on to the next
const PULL = 0.2;      // a drag this far does, even let go slowly
const FLICK = 0.45;    // px per ms
const DRIFT = 12;      // % of its height a picture drifts at one frame from centre
const PRINT_PITCH = 0.62; // the print strip's step, as a share of the card's window

const wrap = (i) => ((i % N) + N) % N;
const pad = (n) => String(n).padStart(2, '0');
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* Size hints for the browser's pick from a srcset: the frame is as large as
   its room allows at its own aspect (lens-reel.css sizes the room). */
const frameSizes = (r) => (r >= 1
  ? `(orientation: portrait) 100vw, calc((100vh - 152px) * ${r.toFixed(3)})`
  : `(orientation: portrait) calc((100vh - 310px) * ${r.toFixed(3)}), calc((100vh - 152px) * ${r.toFixed(3)})`);
const PRINT_SIZES = '(orientation: portrait) 64px, 88px';

function developed(e) { e.currentTarget.classList.add('is-loaded'); }
function failed(e) { e.currentTarget.classList.add('is-failed'); }
/* An image already in the cache still gets its focus pull, a frame later. */
function settleImg(el) {
  if (el && el.complete && el.naturalWidth) requestAnimationFrame(() => el.classList.add('is-loaded'));
}

function Picture({ pic, sizes, imgRef, priority }) {
  const setRef = useCallback((el) => {
    settleImg(el);
    if (imgRef) imgRef(el);
  }, [imgRef]);
  const common = { alt: '', decoding: 'async', draggable: false, ref: setRef, onLoad: developed, onError: failed, fetchpriority: priority };
  if (pic.type === 'still') {
    const set = (ext) => pic.widths.filter((w) => w <= pic.width).map((w) => `${pic.base}-${w}.${ext} ${w}w`).join(', ');
    const mid = pic.widths[Math.min(1, pic.widths.length - 1)];
    return (
      <picture>
        <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
        <img src={`${pic.base}-${mid}.webp`} width={pic.width} height={pic.height} {...common} />
      </picture>
    );
  }
  if (pic.type === 'art') {
    return (
      <picture>
        <source media="(orientation: landscape)" srcSet={pic.wide.src} width={pic.wide.width} height={pic.wide.height} />
        <img src={pic.tall.src} width={pic.tall.width} height={pic.tall.height} {...common} />
      </picture>
    );
  }
  const largest = pic.files.reduce((a, b) => (b.width > a.width ? b : a));
  const srcSet = pic.files.length > 1 ? pic.files.map((f) => `${f.src} ${f.width}w`).join(', ') : undefined;
  return <img src={largest.src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} width={largest.width} height={largest.height} {...common} />;
}

/* What a screen reader hears when a frame settles. */
function describe(idx) {
  const f = REEL_FRAMES[wrap(idx)];
  const where = [f.kind, f.study.place, f.year].filter(Boolean).join(', ');
  const alt = f.picture.alt && f.picture.alt !== f.note ? ` ${f.picture.alt}` : '';
  return `${wrap(idx) + 1} of ${N}. ${f.study.client}. ${where}. ${f.note}${alt}`;
}

export default function LensReel({ onClose }) {
  const still = useStaticMode();
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const windowRef = useRef(null);
  const liveRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [nearest, setNearest] = useState(0);

  /* Everything the loop and the listeners share, made once. P is the frames'
     step (the stage's height: the frame's room plus the line between frames),
     mh the card window's height and pp the print strip's step. */
  const engine = useRef(null);
  if (!engine.current) {
    const els = { box: new Map(), img: new Map(), print: new Map(), note: new Map() };
    const refs = new Map();
    const s = {
      still, P: 0, mh: 0, pp: 0, currentY: 0, targetY: 0, raf: 0, last: 0,
      lastInput: 0, dir: 0, snapping: false, snapFrom: 0, snapTo: 0, snapT0: 0,
      pointer: null, dragging: false, dragY0: 0, dragTarget0: 0, samples: [],
      wheelT: 0, wheelAcc: 0, wheelSpent: false,
      nearest: 0, settledIdx: null, moved: false, popped: false, landing: null,
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

    /* Transforms only. Reads nothing from the layout. Under reduced motion
       only the strip of film is placed, so it still shows the frames either
       side; it jumps from step to step, and the rest crossfades in CSS. */
    e.write = () => {
      const { P, mh, pp, currentY } = s;
      if (!P) return;
      if (s.still) {
        if (!mh) return;
        const lead = (mh - pp) / 2;
        els.print.forEach((el, i) => { el.style.transform = `translate3d(0,${((i - s.nearest) * pp + lead).toFixed(2)}px,0)`; });
        return;
      }
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
      if (!mh) return;
      const at = currentY / P;
      const lead = (mh - pp) / 2;
      els.print.forEach((el, i) => { el.style.transform = `translate3d(0,${((i + at) * pp + lead).toFixed(2)}px,0)`; });
      els.note.forEach((el, i) => { el.style.transform = `translate3d(0,${((i + at) * mh).toFixed(2)}px,0)`; });
    };

    e.setNear = (idx) => {
      if (idx === s.nearest) return;
      s.nearest = idx;
      e.onNear?.(idx);
    };

    e.announce = (idx) => {
      if (liveRef.current) liveRef.current.textContent = describe(idx);
    };

    e.settle = (idx) => {
      rootRef.current?.classList.add('is-locked');
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
      if (!s.still) rootRef.current?.classList.remove('is-locked');
      e.moved();
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

    e.snap = (idx, now = performance.now()) => {
      s.snapping = true;
      s.snapFrom = s.targetY;
      s.snapTo = -idx * s.P;
      s.snapT0 = now;
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
        const goal = e.goal(pos);
        if (Math.abs(pos - goal) * P > 0.5) e.snap(goal, now);
      }
      if (s.snapping) {
        const t = Math.min(1, (now - s.snapT0) / SNAP_MS);
        s.targetY = s.snapFrom + (s.snapTo - s.snapFrom) * (1 - (1 - t) ** 3);
        if (t >= 1) { s.snapping = false; s.targetY = s.snapTo; }
      }
      if (s.dragging) s.currentY = s.targetY;
      else s.currentY += (s.targetY - s.currentY) * (1 - (1 - LERP) ** (dt / 16.7));
      e.setNear(Math.round(-s.currentY / P));
      const rest = Math.round(-s.targetY / P);
      if (idle && !s.snapping && Math.abs(s.targetY - s.currentY) < 0.4 && Math.abs(s.targetY + rest * P) < 0.5) {
        s.targetY = -rest * P;
        s.currentY = s.targetY;
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
      s.lastInput = performance.now();
      e.setNear(idx);
      if (s.still) { e.moved(); e.settle(idx); return; }
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
      const stage = stageRef.current;
      const win = windowRef.current;
      if (!stage) return;
      const P = stage.clientHeight;
      const mh = win ? win.clientHeight : 0;
      if (P === s.P && mh === s.mh) return;
      const idx = s.P ? e.anchor() : 0;
      s.P = P;
      s.mh = mh;
      s.pp = Math.round(mh * PRINT_PITCH);
      cardRef.current?.style.setProperty('--pp', `${s.pp}px`);
      s.snapping = false;
      s.dragging = false;
      s.targetY = -idx * P;
      s.currentY = s.targetY;
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

  /* Measure once on open, place the frames, take focus. */
  useLayoutEffect(() => {
    const { s } = e;
    e.measure();
    rootRef.current.focus({ preventScroll: true });
    return () => {
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [e]);

  /* New frames come into the rendered window as the reel moves: place them
     before they paint. */
  useLayoutEffect(() => { e.write(); }, [e, nearest]);

  useEffect(() => {
    const ro = new ResizeObserver(() => e.measure());
    if (stageRef.current) ro.observe(stageRef.current);
    if (windowRef.current) ro.observe(windowRef.current);
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

  /* The first frame locks on once it's had a moment to come into focus, and
     is read out after the dialog's own name. */
  useEffect(() => {
    const { s } = e;
    const lock = window.setTimeout(() => { if (!s.moved) e.settle(0); }, 420);
    return () => window.clearTimeout(lock);
  }, [e]);

  /* Input: wheel, drag, touch and keys, all on the overlay itself. */
  useEffect(() => {
    const { s } = e;
    const root = rootRef.current;

    const onWheel = (ev) => {
      if (ev.ctrlKey) return; // a trackpad pinch: let the browser zoom
      ev.preventDefault();
      let dy = ev.deltaY;
      if (ev.deltaMode === 1) dy *= 16;
      else if (ev.deltaMode === 2) dy *= s.P;
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
      if (ev.button !== 0 || (ev.target instanceof Element && ev.target.closest('a, button'))) return;
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
      e.snap(goal);
      e.kick();
    };

    const onPointerCancel = (ev) => {
      if (ev.pointerId !== s.pointer) return;
      s.pointer = null;
      s.dragging = false;
      s.lastInput = performance.now();
      e.kick();
    };

    /* iOS can still scroll what's behind on a drag; a pinch stays a pinch. */
    const onTouchMove = (ev) => {
      if (ev.touches.length === 1 && ev.cancelable) ev.preventDefault();
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
  const here = wrap(nearest);
  const current = REEL_FRAMES[here];
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
      <p id="reel-help" className="reel-sr">Move between pictures with the arrow keys or by scrolling. Escape closes.</p>

      <p className="reel-hint" aria-hidden="true">
        <span className="reel-hint-fine"><ArrowDown size={13} strokeWidth={1.6} />Scroll for the next picture</span>
        <span className="reel-hint-touch"><ArrowUp size={13} strokeWidth={1.6} />Swipe up for the next picture</span>
      </p>

      <button type="button" className="reel-close" onClick={() => onCloseRef.current()}>
        Close
        <X aria-hidden="true" size={15} strokeWidth={1.6} />
      </button>

      <div className="reel-stage" ref={stageRef} aria-hidden="true">
        {indices.map((i) => {
          const f = REEL_FRAMES[wrap(i)];
          const pic = f.picture;
          return (
            <div
              key={i}
              ref={e.refFor('box', i)}
              className={`reel-box${i === nearest ? ' is-current' : ''}`}
              data-art={pic.type === 'art' ? '' : undefined}
              style={{ '--r': pic.ratio, '--r-wide': pic.ratioWide }}
            >
              <div className="reel-img">
                <Picture
                  pic={pic}
                  sizes={frameSizes(pic.type === 'art' ? pic.ratioWide : pic.ratio)}
                  imgRef={e.refFor('img', i)}
                  priority={Math.abs(i - nearest) <= 1 ? 'high' : 'low'}
                />
              </div>
              <span className="reel-corner reel-corner--tl" />
              <span className="reel-corner reel-corner--tr" />
              <span className="reel-corner reel-corner--bl" />
              <span className="reel-corner reel-corner--br" />
            </div>
          );
        })}
      </div>

      {/* The white card: a slip of contact sheet. The strip of film and the
          details move in step with the frames; the colour strip and the foot
          stay put. */}
      <div className="reel-card" ref={cardRef}>
        <div className="reel-window" ref={windowRef} aria-hidden="true">
          <div className="reel-film">
            {indices.map((i) => {
              const f = REEL_FRAMES[wrap(i)];
              return (
                <div key={i} ref={e.refFor('print', i)} className={`reel-print${i === nearest ? ' is-current' : ''}`}>
                  <div className="reel-print-img">
                    <Picture pic={f.picture} sizes={PRINT_SIZES} priority="low" />
                  </div>
                  <span className="reel-print-no">{pad(wrap(i) + 1)}</span>
                </div>
              );
            })}
          </div>
          <div className="reel-info">
            {indices.map((i) => {
              const f = REEL_FRAMES[wrap(i)];
              return (
                <div key={i} ref={e.refFor('note', i)} className={`reel-note${i === nearest ? ' is-current' : ''}`}>
                  <p className="reel-client">{f.study.client}</p>
                  <p className="reel-facts">
                    <span>{f.kind}</span>
                    <span>{[f.study.place, f.year].filter(Boolean).join(' · ')}</span>
                  </p>
                  <p className="reel-text">{f.note}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="reel-tones" aria-hidden="true">
          <ol>
            {REEL_FRAMES.map((f, k) => (
              <li key={f.id} className={k === here ? 'is-current' : undefined} style={{ '--tone': f.tone }} />
            ))}
          </ol>
          <p className="reel-count"><b>{pad(here + 1)}</b> / {pad(N)}</p>
        </div>
        <div className="reel-foot">
          <a className="reel-case" href={studyHash} onClick={toStudy}>
            Read about this job<span className="reel-sr">: {current.study.client}</span>
            <span className="reel-case-arrow" aria-hidden="true">→</span>
          </a>
          <div className="reel-steps">
            <button type="button" className="reel-step" aria-label="Previous picture" onClick={() => e.step(-1)}>
              <ChevronUp aria-hidden="true" size={18} strokeWidth={1.6} />
            </button>
            <button type="button" className="reel-step" aria-label="Next picture" onClick={() => e.step(1)}>
              <ChevronDown aria-hidden="true" size={18} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </div>

      <p ref={liveRef} className="reel-sr" role="status" aria-live="polite" aria-atomic="true" />
    </div>,
    document.body,
  );
}
