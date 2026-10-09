/*
 * The opening of /logo-design and the page's one authored moment: the weed.
 *
 * An offcut of black sign vinyl lies on a cutting mat. The stand-in mark
 * (mark-data.js) has already been cut into it, so its outline shows as a fine
 * line in the gloss, and the top right corner of the spare is lifted, waiting
 * for a hand. Pull it and the spare vinyl inside the weeding box folds back
 * and comes away. Then the weeding hook picks the counters and the Y out one
 * by one, carries them off the mat on its point, and is laid back down. The
 * mark is left standing on the white backing paper, with the frame of vinyl
 * outside the box still on the sheet the way a signwriter leaves it.
 *
 * The peel is a fold (peel.js): one number, how far the fold has travelled,
 * moves every piece, so a pull on the corner can drive it as easily as the
 * clock. Past the far corner the same number carries the folded spare off
 * the edge of the mat, so the vinyl never fades: it stays opaque until it has
 * gone. Three layers share one viewBox. The mat, the backing paper, the frame
 * and the letters never change, so they sit in a still layer; the spare, the
 * flap and the islands move in the layer above it; the hook has its own layer
 * on top.
 *
 * Timing: the corner waits for the visitor. The clock only takes it after
 * three seconds with the stage on screen and no pointer moving over it, and
 * never once the visitor has pulled it themselves. "Peel it" runs it from the
 * keyboard. Reduced motion keeps the lifted corner and the pull (the sheet
 * follows the hand and nothing else moves), and "Peel it" then finishes the
 * sheet in one step. The prerenderer gets the finished sheet and no controls.
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useStaticMode from '@/hooks/useStaticMode';
import { MARK } from './mark-data';
import { roundelPath, lettersPath } from './Mark';
import { makePeel } from './peel';

const V = MARK.stacked;

/* The stage, in mat units: forty to the centimetre. */
const W = 1000;
const H = 760;
const CM = 40;
const CX = 500; // the sheet's centre on the mat
const CY = 350;
const ROT = -2.4;
const K = 560 / V.w; // the lockup is cut 14 cm wide

/* Everything on the sheet is drawn in the mark's own units (cap height 100),
   inside one transform, so the cut lines and the letters can't disagree. */
const MU = 38 / K; // weeding box margin
const FU = 26 / K; // the frame of vinyl left outside the box
const BOX = { x0: -MU, y0: -MU, x1: V.w + MU, y1: V.h + MU };
const SHEET = { x: BOX.x0 - FU, y: BOX.y0 - FU, w: BOX.x1 - BOX.x0 + 2 * FU, h: BOX.y1 - BOX.y0 + 2 * FU };
const LOCAL = `translate(${CX} ${CY}) rotate(${ROT}) scale(${K}) translate(${-V.w / 2} ${-V.h / 2})`;

/* Between the sheet's units and the stage's. */
const RAD = (ROT * Math.PI) / 180;
const toStage = ([x, y]) => {
  const dx = (x - V.w / 2) * K;
  const dy = (y - V.h / 2) * K;
  return [CX + dx * Math.cos(RAD) - dy * Math.sin(RAD), CY + dx * Math.sin(RAD) + dy * Math.cos(RAD)];
};
const toLocal = ([x, y]) => {
  const dx = x - CX;
  const dy = y - CY;
  return [(dx * Math.cos(RAD) + dy * Math.sin(RAD)) / K + V.w / 2, (-dx * Math.sin(RAD) + dy * Math.cos(RAD)) / K + V.h / 2];
};

const P = makePeel(BOX);
const S_START = P.L * 0.05; // the corner already lifted, waiting for a hand
/* The flap is the lifted vinyl reflected across the fold, so once the fold
   is past the box the flap's nearest edge sits 2s - L down the diagonal.
   S_END is where that edge, shadow and all, has cleared the farthest corner
   of the stage: the spare has been pulled right off the mat. */
const STAGE_FAR = Math.max(...[[0, 0], [W, 0], [W, H], [0, H]].map((p) => P.proj(toLocal(p))));
const S_END = (STAGE_FAR + P.L) / 2 + 60;

/* The pieces. */
const ROUND = V.roundel;
const DISC_D = `M${ROUND.cx - ROUND.r} ${ROUND.cy} A${ROUND.r} ${ROUND.r} 0 1 0 ${ROUND.cx + ROUND.r} ${ROUND.cy} A${ROUND.r} ${ROUND.r} 0 1 0 ${ROUND.cx - ROUND.r} ${ROUND.cy} Z`;
const OUTERS_D = V.letters.map((g) => g.outer.join(' ')).join(' ');
const SPARE_D = `${P.boxD} ${OUTERS_D} ${DISC_D}`; // the box less every letter and the disc
const CUT_D = SPARE_D; // the blade ran round the same lines

/* What the hook picks out once the spare is off: the Y, and each counter,
   with its centre in sheet units and on the stage. The paths are absolute
   M/L/Q/Z, so their numbers pair up as points. */
const ISLANDS = [
  ...ROUND.y.map((d, i) => ({ d, key: `y${i}` })),
  ...V.letters.flatMap((g, gi) => g.inner.map((d, ii) => ({ d, key: `${g.ch}${gi}-${ii}` }))),
].map((isl) => {
  const n = isl.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  for (let i = 0; i + 1 < n.length; i += 2) {
    x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]);
    y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]);
  }
  const c = [(x0 + x1) / 2, (y0 + y1) / 2];
  return { ...isl, c, at: toStage(c) };
});

/* The weeding hook is drawn pointing right, its point at HOOK_TIP, and lies
   on the mat mirrored: handle bottom right, point towards the sheet. A pose
   is where its handle end sits and how far it's turned. */
const HOOK_TIP = [284, 4];
const HOOK_REST = { x: 948, y: 672, a: 12 };
const hookAt = ({ x, y, a }) => `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(2)}) scale(-1 1)`;
const tipOf = ({ x, y, a }) => {
  const r = (a * Math.PI) / 180;
  const u = -HOOK_TIP[0];
  const v = HOOK_TIP[1];
  return [x + u * Math.cos(r) - v * Math.sin(r), y + u * Math.sin(r) + v * Math.cos(r)];
};
const poseFor = ([tx, ty], a) => {
  const r = (a * Math.PI) / 180;
  const u = -HOOK_TIP[0];
  const v = HOOK_TIP[1];
  return { x: tx - (u * Math.cos(r) - v * Math.sin(r)), y: ty - (u * Math.sin(r) + v * Math.cos(r)), a };
};

/* The hook works from the piece nearest its point to the next nearest. Each
   piece sticks to the point a little off centre and turned, as weeded bits
   do, and they ride there together until the hook wipes them off the mat. */
const ORDER = (() => {
  const left = ISLANDS.map((_, i) => i);
  const out = [];
  let at = tipOf(HOOK_REST);
  const far = (i) => Math.hypot(ISLANDS[i].at[0] - at[0], ISLANDS[i].at[1] - at[1]);
  while (left.length) {
    let best = 0;
    for (let j = 1; j < left.length; j += 1) if (far(left[j]) < far(left[best])) best = j;
    const i = left.splice(best, 1)[0];
    out.push(i);
    at = ISLANDS[i].at;
  }
  return out;
})();
const STUCK = ORDER.map((_, n) => ({ dx: ((n * 29) % 46) - 23, dy: ((n * 17) % 34) - 17, spin: ((n * 53) % 70) - 35 }));

/* Timing, in milliseconds. */
const IDLE_MS = 3000;
const PEEL_MS = 1750;
const AWAY_MS = 440;
const FIRST_MS = 360;
const HOP_MS = 150;
const DWELL_MS = 60;
const EXIT_MS = 320;
const RETURN_MS = 460;

/* Where the lifted corner sits on the stage, for the pull handle. */
const CORNER = (() => {
  const [x, y] = toStage([BOX.x1, BOX.y0]);
  return { left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` };
})();

const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outCubic = (t) => 1 - Math.pow(1 - t, 3);
const inQuad = (t) => t * t;
const lerp = (a, b, t) => a + (b - a) * t;

/* Wait for the boot sheet in index.html to lift before playing. */
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

/* ── The still layer: mat, paper, frame, letters ───────────────────── */

function Mat() {
  const cols = Math.floor(W / CM);
  const rows = Math.floor(H / CM);
  return (
    <g className="lg-mat">
      {/* the mat itself is the stage's own background, grain and all */}
      {/* the printed grid in centimetres, every fifth line heavier */}
      {Array.from({ length: cols - 1 }, (_, i) => (i + 1) * CM).map((x, i) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2={H} className={(i + 1) % 5 === 0 ? 'lg-grid-major' : 'lg-grid'} />
      ))}
      {Array.from({ length: rows - 1 }, (_, i) => (i + 1) * CM).map((y, i) => (
        <line key={`h${y}`} x1="0" y1={y} x2={W} y2={y} className={(i + 1) % 5 === 0 ? 'lg-grid-major' : 'lg-grid'} />
      ))}
      {/* the angle guides every mat carries from one corner */}
      <path className="lg-angle" d={`M0 ${H} L${(H * 0.577).toFixed(1)} 0 M0 ${H} L${H} 0 M0 ${H} L${W} ${(H - W * 0.577).toFixed(1)}`} />
      {/* rulers down two edges */}
      {Array.from({ length: cols - 1 }, (_, i) => i + 1).map((n) => (
        <text key={`t${n}`} className="lg-rule" x={n * CM} y="22" textAnchor="middle">{n}</text>
      ))}
      {/* the left ruler stops short of the bottom corner, where the note sits */}
      {Array.from({ length: rows - 2 }, (_, i) => i + 1).map((n) => (
        <text key={`l${n}`} className="lg-rule" x="15" y={n * CM + 5} textAnchor="middle">{n}</text>
      ))}
      {/* old knife scores: the mat has been used */}
      <path className="lg-score" d="M88 548 L404 512 M612 690 L938 702 M132 128 L118 402 M702 96 L958 140 M540 640 L566 742 M846 300 L866 520" />
    </g>
  );
}

const Still = memo(function Still() {
  return (
    <svg className="lg-sheet-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <defs>
        <filter id="lg-soft" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id="lg-room" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="22" /></filter>
        {/* gloss: black vinyl with one broad, soft highlight across it */}
        <linearGradient id="lg-gloss" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="1400" y2="700">
          <stop offset="0" stopColor="#222222" />
          <stop offset="0.43" stopColor="#151515" />
          <stop offset="0.5" stopColor="#2e2e2e" />
          <stop offset="0.58" stopColor="#151515" />
          <stop offset="1" stopColor="#0d0d0d" />
        </linearGradient>
        <linearGradient id="lg-liner" gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="1300" y2="800">
          <stop offset="0" stopColor="#fbfaf6" />
          <stop offset="0.6" stopColor="#f3f2ec" />
          <stop offset="1" stopColor="#eae8e1" />
        </linearGradient>
        <linearGradient id="lg-under" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1400" y2="600">
          <stop offset="0" stopColor="#4b4a46" />
          <stop offset="1" stopColor="#353430" />
        </linearGradient>
      </defs>
      <Mat />
      <g transform={LOCAL}>
        {/* the bench's two shadows, room and contact, under the offcut */}
        <rect x={SHEET.x + 40} y={SHEET.y + 70} width={SHEET.w - 30} height={SHEET.h} fill="rgba(0,0,0,0.42)" filter="url(#lg-room)" />
        <rect x={SHEET.x + 2} y={SHEET.y + 7} width={SHEET.w} height={SHEET.h} fill="rgba(0,0,0,0.36)" filter="url(#lg-soft)" />
        <rect x={SHEET.x} y={SHEET.y} width={SHEET.w} height={SHEET.h} fill="url(#lg-liner)" />
        {/* the frame of vinyl outside the weeding box stays on the sheet */}
        <path fillRule="evenodd" fill="url(#lg-gloss)" d={`M${SHEET.x} ${SHEET.y} h${SHEET.w} v${SHEET.h} h${-SHEET.w} Z ${P.boxD}`} />
        {/* the mark, counters open: what's left when the job's done */}
        <path fillRule="evenodd" fill="url(#lg-gloss)" d={`${roundelPath(ROUND)} ${lettersPath(V)}`} />
      </g>
    </svg>
  );
});

/* The weeding hook, in its own units, pointing right. */
function HookArt() {
  return (
    <>
      <ellipse className="lg-hook-shadow" cx="128" cy="30" rx="156" ry="11" fill="rgba(0,0,0,0.3)" filter="url(#lg-soft)" />
      <rect x="0" y="0" width="148" height="30" rx="14" fill="var(--lg-handle)" />
      <rect x="6" y="3" width="136" height="9" rx="4.5" fill="rgba(255,255,255,0.28)" />
      <rect x="0" y="20" width="148" height="10" rx="5" fill="rgba(0,0,0,0.1)" />
      <rect x="146" y="5" width="24" height="20" rx="3" fill="#a9adb1" />
      <rect x="146" y="6" width="24" height="6" rx="3" fill="#e6e8ea" />
      <path d="M170 15 H268 Q281 15 284 4" fill="none" stroke="#bfc3c6" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M170 13.6 H266" fill="none" stroke="#f3f4f5" strokeWidth="1.3" strokeLinecap="round" />
    </>
  );
}

/* ── The moving layers ─────────────────────────────────────────────── */

export default function Sheet() {
  const staticMode = useStaticMode();
  const prerender = useMemo(
    () => typeof window === 'undefined' || (typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent)),
    [],
  );
  const reduced = staticMode && !prerender;

  const [phase, setPhaseState] = useState(prerender ? 'done' : 'cut'); // cut | peel | pick | done
  const [dragging, setDragging] = useState(false);
  const phaseRef = useRef(phase);
  const rootRef = useRef(null);
  const localRef = useRef(null);
  const downRef = useRef(null);
  const upRef = useRef(null);
  const mirrorRef = useRef(null);
  const shadowRef = useRef(null);
  const foldRef = useRef(null);
  const lightRef = useRef(null);
  const hookRef = useRef(null);
  const islandRefs = useRef([]);
  const rafRef = useRef(0);
  const timersRef = useRef([]);
  const sRef = useRef(prerender ? S_END : S_START);
  const dragRef = useRef(null);
  const playedRef = useRef(false); // the clock has run once, or the visitor took over

  const setPhase = useCallback((p) => { phaseRef.current = p; setPhaseState(p); }, []);

  /* Put the fold at s. */
  const draw = useCallback((s) => {
    sRef.current = s;
    downRef.current?.setAttribute('points', P.halfPlane(s, false));
    upRef.current?.setAttribute('points', P.halfPlane(s, true));
    mirrorRef.current?.setAttribute('transform', P.mirror(s));
    shadowRef.current?.setAttribute('points', P.shadow(s, 14, 26));
    foldRef.current?.setAttribute('d', P.foldPath(s));
    lightRef.current?.setAttribute('d', P.foldPath(s, 8));
  }, []);

  const clearTimers = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  /* Reduced motion: the finished sheet in one step. */
  const finishNow = useCallback(() => {
    clearTimers();
    draw(S_END);
    setPhase('done');
  }, [clearTimers, draw, setPhase]);

  /* The hook picks each piece out and carries them all off the mat on its
     point, then comes back and is laid down where it was. */
  const pick = useCallback(() => {
    setPhase('pick');
    const hook = hookRef.current;
    hook?.classList.add('is-lifted');
    const timeline = [];
    let at = 0;
    const push = (seg) => { timeline.push({ ...seg, start: at }); at += seg.ms; };
    let pose = HOOK_REST;
    ORDER.forEach((i, n) => {
      const to = poseFor(ISLANDS[i].at, 9 + ((n * 37) % 14));
      push({ from: pose, to, ms: n === 0 ? FIRST_MS : HOP_MS, ease: inOut });
      push({ from: to, to, ms: DWELL_MS, grab: n });
      pose = to;
    });
    const out = poseFor([W + 80, 320], 6);
    push({ from: pose, to: out, ms: EXIT_MS, ease: inQuad });
    const offAt = at; // the pieces are off the mat; they stay there
    push({ from: out, to: HOOK_REST, ms: RETURN_MS, ease: outCubic });
    const total = at;
    const grabAt = ORDER.map((_, n) => timeline.find((s) => s.grab === n).start);
    const poseAtTime = (e) => {
      const seg = timeline.find((s) => e < s.start + s.ms) || timeline[timeline.length - 1];
      const t = seg.ease ? seg.ease(Math.min(1, (e - seg.start) / seg.ms)) : 1;
      return { x: lerp(seg.from.x, seg.to.x, t), y: lerp(seg.from.y, seg.to.y, t), a: lerp(seg.from.a, seg.to.a, t) };
    };
    let carrying = true;
    const t0 = performance.now();
    const step = (now) => {
      const e = Math.min(total, now - t0);
      const p = poseAtTime(e);
      hookRef.current?.setAttribute('transform', hookAt(p));
      if (carrying) {
        const tip = toLocal(tipOf(e < offAt ? p : out));
        ORDER.forEach((i, n) => {
          const el = islandRefs.current[i];
          if (!el || e < grabAt[n]) return;
          const { c } = ISLANDS[i];
          const st = STUCK[n];
          /* over the dwell the piece comes up off the paper onto the point;
             lifted, it's a loose bit of vinyl, so the cut line goes */
          if (!el.classList.contains('is-carried')) el.classList.add('is-carried');
          const f = Math.min(1, (e - grabAt[n]) / DWELL_MS);
          const cx = c[0].toFixed(1);
          const cy = c[1].toFixed(1);
          el.setAttribute(
            'transform',
            `translate(${(tip[0] + st.dx * f - c[0]).toFixed(1)} ${(tip[1] + st.dy * f - c[1]).toFixed(1)}) `
              + `rotate(${(st.spin * f).toFixed(1)} ${cx} ${cy}) translate(${cx} ${cy}) scale(${(1 + 0.06 * f).toFixed(3)}) translate(${-c[0]} ${-c[1]})`,
          );
        });
        if (e >= offAt) carrying = false;
      }
      if (e < total) { rafRef.current = requestAnimationFrame(step); return; }
      hookRef.current?.classList.remove('is-lifted');
      setPhase('done');
    };
    rafRef.current = requestAnimationFrame(step);
  }, [setPhase]);

  /* Run the fold from wherever it is to the far corner, easing in and out,
     then pull the folded spare off the mat, gathering speed. */
  const peelFrom = useCallback((from) => {
    clearTimers();
    playedRef.current = true;
    setPhase('peel');
    const fold = from < P.L ? PEEL_MS * ((P.L - from) / (P.L - S_START)) : 0;
    const a = Math.max(from, P.L);
    const t0 = performance.now();
    const step = (now) => {
      const e = now - t0;
      if (e < fold) {
        draw(from + (P.L - from) * inOut(e / fold));
      } else {
        const t = Math.min(1, (e - fold) / AWAY_MS);
        draw(a + (S_END - a) * inQuad(t));
        if (t >= 1) { pick(); return; }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [clearTimers, draw, pick, setPhase]);

  /* The clock takes the corner only after a real idle: the stage on screen,
     the boot lifted, three seconds with no pointer moving over it, and the
     visitor not having pulled it themselves. */
  useEffect(() => {
    if (staticMode) return undefined;
    const el = rootRef.current;
    if (!el) return undefined;
    let visible = false;
    let booted = false;
    let alive = true;
    let timer = 0;
    const arm = () => {
      clearTimeout(timer);
      if (!visible || !booted || playedRef.current || phaseRef.current !== 'cut') return;
      timer = setTimeout(() => {
        if (alive && !playedRef.current && phaseRef.current === 'cut' && !dragRef.current) peelFrom(sRef.current);
      }, IDLE_MS);
    };
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => { visible = entries.some((en) => en.isIntersecting); arm(); }, { threshold: 0.45 })
      : null;
    io?.observe(el);
    bootClear().then(() => { if (alive) { booted = true; arm(); } });
    el.addEventListener('pointermove', arm);
    return () => {
      alive = false;
      clearTimeout(timer);
      io?.disconnect();
      el.removeEventListener('pointermove', arm);
      clearTimers();
    };
  }, [staticMode, peelFrom, clearTimers]);

  /* Back to a freshly cut sheet. With motion, it peels again on its own. */
  const again = () => {
    clearTimers();
    sRef.current = S_START;
    setPhase('cut');
    if (!reduced) timersRef.current.push(setTimeout(() => peelFrom(S_START), 520));
  };

  const busy = phase === 'peel' || phase === 'pick';
  const onButton = () => {
    if (busy) return;
    if (phase === 'done') { again(); return; }
    if (reduced) { playedRef.current = true; finishNow(); return; }
    peelFrom(sRef.current);
  };

  /* A pull on the corner drives the fold directly. The corner follows the
     hand, so the fold sits halfway between where it started and the hand. */
  const foldAt = (e) => {
    const m = localRef.current?.getScreenCTM();
    if (!m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return Math.max(S_START, Math.min(S_END, P.proj([p.x, p.y]) / 2));
  };
  const onDown = (e) => {
    if (phaseRef.current !== 'cut') return;
    clearTimers();
    playedRef.current = true;
    setPhase('peel');
    setDragging(true);
    dragRef.current = { id: e.pointerId };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const s = foldAt(e);
    if (s != null) draw(s);
  };
  const onMove = (e) => {
    if (!dragRef.current || dragRef.current.id !== e.pointerId) return;
    const s = foldAt(e);
    if (s != null) draw(s);
  };
  const onUp = (e) => {
    if (!dragRef.current || dragRef.current.id !== e.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    const s = sRef.current;
    if (s > P.L * 0.22) {
      if (reduced) finishNow();
      else peelFrom(s);
      return;
    }
    if (reduced) { draw(S_START); setPhase('cut'); return; }
    const t0 = performance.now();
    const back = (now) => {
      const t = Math.min(1, (now - t0) / 320);
      draw(s + (S_START - s) * inOut(t));
      if (t < 1) rafRef.current = requestAnimationFrame(back);
      else setPhase('cut');
    };
    rafRef.current = requestAnimationFrame(back);
  };

  const s0 = sRef.current;
  const label = phase === 'done' ? (reduced ? 'Reset the sheet' : 'Peel it again') : 'Peel it';
  return (
    <div className={`lg-stage is-${phase}${dragging ? ' is-dragging' : ''}`} ref={rootRef}>
      <Still />
      {!prerender && phase !== 'done' ? (
        <svg className="lg-sheet-svg lg-sheet-svg--live" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
          <defs>
            <clipPath id="lg-down" clipPathUnits="userSpaceOnUse"><polygon ref={downRef} points={P.halfPlane(s0, false)} /></clipPath>
            <clipPath id="lg-up" clipPathUnits="userSpaceOnUse"><polygon ref={upRef} points={P.halfPlane(s0, true)} /></clipPath>
            <filter id="lg-flapshadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
          </defs>
          <g ref={localRef} transform={LOCAL}>
            {/* where the fold hasn't reached, the box is still one sheet of
                vinyl (letters, spare and islands alike), with the cut showing */}
            <g clipPath="url(#lg-down)">
              <path fill="url(#lg-gloss)" d={P.boxD} />
              <path className="lg-cut" d={CUT_D} />
            </g>
            {/* the islands: each stays on the paper until the hook takes it */}
            {ISLANDS.map((isl, i) => (
              <g key={isl.key} ref={(el) => { islandRefs.current[i] = el; }}>
                <path fill="url(#lg-gloss)" d={isl.d} />
                <path className="lg-cut" d={isl.d} />
              </g>
            ))}
            {/* the lifted vinyl, dark side up, and its shadow */}
            <polygon ref={shadowRef} fill="rgba(0,0,0,0.34)" filter="url(#lg-flapshadow)" points={P.shadow(s0, 14, 26)} />
            <g ref={mirrorRef} transform={P.mirror(s0)}>
              <g clipPath="url(#lg-up)">
                <path fillRule="evenodd" fill="url(#lg-under)" d={SPARE_D} />
              </g>
            </g>
            <path ref={foldRef} className="lg-fold" d={P.foldPath(s0)} />
            <path ref={lightRef} className="lg-fold-light" d={P.foldPath(s0, 8)} />
          </g>
        </svg>
      ) : null}
      <svg className="lg-sheet-svg lg-sheet-svg--hook" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        <g ref={hookRef} className="lg-hook" transform={hookAt(HOOK_REST)}><HookArt /></g>
      </svg>
      {!prerender && (phase === 'cut' || dragging) ? (
        <span
          className="lg-corner"
          style={CORNER}
          aria-hidden="true"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      ) : null}
      <p className="lg-mat-note" aria-hidden="true">Stand-in mark, drawn for this page.</p>
      {!prerender ? (
        <button type="button" className="lg-again" onClick={onButton} aria-disabled={busy ? 'true' : undefined}>
          {label}
        </button>
      ) : null}
    </div>
  );
}
