/*
 * The opening of /logo-design: our own logo read down an eye chart.
 *
 * The chart is one SVG. Its top line is the 4 on its own; under it the whole
 * mark at the size of our loading screen, the mark at the size of our nav
 * bar, and last a browser tab with the 4 in it, the way public/favicon.png
 * draws it. The rows under the top line are drawn at their real size in CSS
 * pixels, so the figures in the margin are true on whatever screen reads
 * them. Rows are spaced by the size of the row below, the way an eye chart
 * spaces its lines.
 *
 * The camera is the SVG's viewBox. It opens close on the 4, so the first
 * screen is the 4 at full height beside the h1, and steps back as the first
 * caption comes up, until the whole chart is in view. Then each caption
 * that reaches the reading line lights its row, puts a band of light behind
 * it and dims the rest, the way an examiner isolates one line. The chart is
 * the one lit thing in the room. Its margin figures wait until the camera
 * has settled, and the top line's figure is the 4's height on that screen.
 *
 * Three layouts, picked by the window, not the device:
 *  - wide (1024px across and 600px tall or more): the chart pinned full
 *    height beside the words;
 *  - band (narrower, and 560px tall or more): the chart pinned as a band
 *    under the nav, with the words scrolling underneath it;
 *  - flat (anything shorter, reduced motion, and the prerender): nothing
 *    pins or moves, the whole chart sits beside or above the captions, and
 *    every row is lit. useStaticMode decides on the first render.
 * The chart is aria-hidden; the captions carry every word of it.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import useStaticMode from '@/hooks/useStaticMode';
import { SCREEN, DEEP, bootMarkHeight, NAV_MARK_HEIGHT } from './geometry';
import { FourG, MarkG, widthAt } from './Pieces';

const WIDE = '(min-width: 1024px) and (min-height: 600px)';
const BAND = '(max-width: 1023.98px) and (min-height: 560px)';

function readMode(staticMode) {
  if (staticMode || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'flat';
  if (window.matchMedia(WIDE).matches) return 'wide';
  if (window.matchMedia(BAND).matches) return 'band';
  return 'flat';
}

function useMode(staticMode) {
  const [mode, setMode] = useState(() => readMode(staticMode));
  useEffect(() => {
    if (staticMode || typeof window.matchMedia !== 'function') return undefined;
    const qs = [window.matchMedia(WIDE), window.matchMedia(BAND)];
    const on = () => setMode(readMode(false));
    qs.forEach((q) => q.addEventListener?.('change', on));
    return () => qs.forEach((q) => q.removeEventListener?.('change', on));
  }, [staticMode]);
  return mode;
}

const TAB_H = 28;
const LABEL_ROOM = 64;

/* Lay the chart out in CSS pixels for a stage w x h. The top line takes
   whatever height the real-size rows leave. */
function layoutChart(w, h, vw) {
  const compact = w < 560 || h < 500;
  const padT = Math.max(16, h * 0.055);
  const padB = Math.max(16, h * 0.05);
  const r2 = bootMarkHeight(vw);
  const r3 = NAV_MARK_HEIGHT;
  /* an eye chart spaces each line by the size of the line below it */
  const k = compact ? 0.6 : 1;
  const g12 = r2 * k;
  const g23 = r3 * k;
  const g34 = Math.max(12, 16 * k);
  const rest = r2 + g12 + r3 + g23 + TAB_H + g34;
  let r1 = h - padT - padB - rest;
  /* the top line stays about half the chart, so stepping back reads as a
     step back, and the lines under it get room */
  r1 = Math.min(r1, h * (compact ? 0.56 : 0.5));
  r1 = Math.min(r1, (w - 2 * LABEL_ROOM) / (widthAt.four(1)));
  r1 = Math.max(56, r1);
  const total = r1 + rest;
  let y = Math.max(padT, (h - total) / 2);
  const rows = [];
  rows.push({ y, h: r1 }); y += r1 + g12;
  rows.push({ y, h: r2 }); y += r2 + g23;
  rows.push({ y, h: r3 }); y += r3 + g34;
  rows.push({ y, h: TAB_H });
  return {
    w, h, cx: w / 2, rows,
    tabW: Math.max(150, Math.min(236, w - 2 * LABEL_ROOM)),
    labelX: w - 18,
  };
}

/* The flat layout has no screen to fill, so its height follows its width. */
const flatHeight = (w) => Math.round(Math.min(640, Math.max(380, w * 1.02)));

const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function Chart({ L, svgRef, liveRef, lit, tabTitle }) {
  const [r1, r2, r3, r4] = L.rows;
  const row = (i) => `ld-row${lit === 0 || lit === i ? '' : ' is-dim'}`;
  const tabX = L.cx - L.tabW / 2;
  const midY = (r) => r.y + r.h / 2;
  const xs = { x: tabX + L.tabW - 19, y: midY(r4) };
  /* the examiner's window: a band of light behind the line being read */
  const on = lit > 0 ? L.rows[lit - 1] : null;
  const pad = on ? Math.max(12, on.h * 0.2) : 0;
  return (
    <svg
      ref={svgRef}
      className="ld-chart"
      viewBox={`0 0 ${L.w} ${L.h}`}
      width={L.w}
      height={L.h}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="ld-tab-clip"><rect x={tabX + 30} y={r4.y} width={L.tabW - 58} height={r4.h} /></clipPath>
        <linearGradient id="ld-tab-fade" x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
        {/* the chart is the one lit thing in the room: brightest where the
            lines are, falling off to the edges like a backlit panel */}
        <radialGradient id="ld-chart-light" cx="50%" cy="44%" r="72%">
          <stop offset="0" stopColor="#272a31" />
          <stop offset="0.62" stopColor="#1e2126" />
          <stop offset="1" stopColor="#17191d" />
        </radialGradient>
        <linearGradient id="ld-window-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.22" stopColor="#ffffff" stopOpacity="0.075" />
          <stop offset="0.78" stopColor="#ffffff" stopOpacity="0.075" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect className="ld-chart-panel" x="0.5" y="0.5" width={L.w - 1} height={L.h - 1} rx="4" fill="url(#ld-chart-light)" />
      {on ? (
        <rect
          className="ld-window"
          x="10"
          y="0"
          width={L.w - 20}
          height="1"
          fill="url(#ld-window-light)"
          style={{ transform: `translate(0px, ${(on.y - pad).toFixed(1)}px) scale(1, ${(on.h + 2 * pad).toFixed(1)})` }}
        />
      ) : null}

      <g className={row(1)}>
        <FourG x={L.cx - widthAt.four(r1.h) / 2} y={r1.y} h={r1.h} pair={SCREEN} />
        <text ref={liveRef} className="ld-fig" x={L.labelX} y={midY(r1)} textAnchor="end" dominantBaseline="middle" />
      </g>
      <g className={row(2)}>
        <MarkG x={L.cx - widthAt.mark(r2.h) / 2} y={r2.y} h={r2.h} pair={SCREEN} />
        <text className="ld-fig" x={L.labelX} y={midY(r2)} textAnchor="end" dominantBaseline="middle">{`${Math.round(r2.h)} px`}</text>
      </g>
      <g className={row(3)}>
        <MarkG x={L.cx - widthAt.mark(r3.h) / 2} y={r3.y} h={r3.h} pair={SCREEN} />
        <text className="ld-fig" x={L.labelX} y={midY(r3)} textAnchor="end" dominantBaseline="middle">{`${Math.round(r3.h)} px`}</text>
      </g>
      <g className={row(4)}>
        <rect className="ld-tab" x={tabX} y={r4.y} width={L.tabW} height={r4.h} rx="8" />
        <FourG x={tabX + 11} y={r4.y + (r4.h - 16) / 2} h={16} pair={DEEP} />
        <text className="ld-tab-title" x={tabX + 34} y={midY(r4)} dominantBaseline="middle" clipPath="url(#ld-tab-clip)">{tabTitle}</text>
        <rect x={tabX + L.tabW - 52} y={r4.y + 2} width="24" height={r4.h - 4} fill="url(#ld-tab-fade)" />
        <path className="ld-tab-x" d={`M${xs.x - 3.5} ${xs.y - 3.5} L${xs.x + 3.5} ${xs.y + 3.5} M${xs.x + 3.5} ${xs.y - 3.5} L${xs.x - 3.5} ${xs.y + 3.5}`} />
        <text className="ld-fig" x={L.labelX} y={midY(r4)} textAnchor="end" dominantBaseline="middle">16 px</text>
      </g>
    </svg>
  );
}

export default function Exam({ from, startHref, tabTitle, steps }) {
  const staticMode = useStaticMode();
  const mode = useMode(staticMode);
  const armed = mode !== 'flat';

  const stageRef = useRef(null);
  const innerRef = useRef(null);
  const svgRef = useRef(null);
  const liveRef = useRef(null);
  const stepRefs = useRef([]);
  const zRef = useRef(armed ? 1 : 0);

  const [size, setSize] = useState({ w: 600, h: 640, vw: 1280 });
  const [lit, setLit] = useState(0);

  /* Measure the box the chart is drawn in. It's the stage's content box,
     with the stage's padding outside it, so one unit of the viewBox is one
     CSS pixel at rest and every figure in the margin is the size on screen.
     The flat layout sets its own height from its width. */
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return undefined;
    const measure = () => {
      const w = Math.round(el.clientWidth);
      const h = mode === 'flat' ? flatHeight(w) : Math.round(el.clientHeight);
      if (!w || !h) return;
      setSize((s) => (s.w === w && s.h === h && s.vw === window.innerWidth ? s : { w, h, vw: window.innerWidth }));
    };
    measure();
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [mode]);

  const L = useMemo(() => layoutChart(size.w, size.h, size.vw), [size]);
  const layoutRef = useRef(L);
  layoutRef.current = L;

  /* the camera: z = 1 is close on the 4, z = 0 the whole chart */
  const applyCamera = useCallback((z) => {
    const svg = svgRef.current;
    const live = liveRef.current;
    const lay = layoutRef.current;
    if (!svg || !lay) return;
    const r1 = lay.rows[0];
    const k = Math.min(0.999, (r1.h / 0.84) / lay.h);
    const zc = { x: lay.cx, y: r1.y + r1.h / 2 };
    /* the point that stays put while the view scales from rest to close */
    const P = { x: (zc.x - (k * lay.w) / 2) / (1 - k), y: (zc.y - (k * lay.h) / 2) / (1 - k) };
    const kz = k ** z;
    const vx = P.x * (1 - kz);
    const vy = P.y * (1 - kz);
    svg.setAttribute('viewBox', `${vx.toFixed(2)} ${vy.toFixed(2)} ${(lay.w * kz).toFixed(2)} ${(lay.h * kz).toFixed(2)}`);
    /* The margin figures only show once the camera has settled: while it
       moves they'd be scaled up with the chart and cut off at the edge. At
       rest the top line's figure is the 4's height on this screen. */
    svg.classList.toggle('is-moving', z > 0.01);
    if (live) live.textContent = `${Math.round(r1.h)} px`;
  }, []);

  /* scroll: the first caption's rise steps the camera back; the caption at
     the reading line picks the row */
  useLayoutEffect(() => {
    if (!armed) {
      zRef.current = 0;
      applyCamera(0);
      setLit(0);
      return undefined;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const stage = stageRef.current;
      /* The reading line. A caption lights its row when its top crosses it,
         and the line sits low enough that the next caption crosses it
         before this one's heading reaches the nav or the band. */
      let line = vh * 0.7;
      if (mode === 'band' && stage) {
        const pinnedBottom = (parseFloat(getComputedStyle(stage).top) || 0) + stage.offsetHeight;
        line = pinnedBottom + (vh - pinnedBottom) * 0.8;
      }
      const first = stepRefs.current[0];
      if (first) {
        const sy = window.scrollY;
        const docTop = first.getBoundingClientRect().top + sy;
        /* the camera steps back from the top of the page until the first
           caption reaches the line */
        const s1 = docTop - line;
        const t = s1 > 0 ? clamp01(sy / s1) : 1;
        const z = 1 - smoother(t);
        if (Math.abs(z - zRef.current) > 0.0005 || z === 0 || z === 1) {
          zRef.current = z;
          applyCamera(z);
        }
      }
      let next = 0;
      stepRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < line) next = i + 1;
      });
      setLit(next);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (document.fonts?.ready) document.fonts.ready.then(onScroll).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [armed, mode, applyCamera]);

  /* a new layout resets the viewBox to rest, so put the camera back */
  useLayoutEffect(() => { applyCamera(armed ? zRef.current : 0); }, [L, armed, applyCamera]);

  return (
    <section className={`ld-exam is-${mode}`} aria-labelledby="ld-h1">
      <div className="ld-frame ld-exam-grid">
        <header className="ld-copy">
          <h1 className="ld-h1" id="ld-h1">Logo design in Perth</h1>
          <p className="ld-lede">
            That&rsquo;s the 4 from our own logo. A logo gets used at every size, from a sign out front to a browser
            tab sixteen pixels wide, and it has to read at all of them. Below, we put ours through that test. Prices
            start at {from}, fixed before the work begins.
          </p>
          <div className="ld-actions">
            <Link to={startHref} className="ld-btn-start">Start a logo brief</Link>
            <a href="#prices" className="ld-btn-ghost">See the prices</a>
          </div>
        </header>

        <div className="ld-stage" ref={stageRef}>
          <div className="ld-stage-in" ref={innerRef} style={mode === 'flat' ? { height: `${L.h}px` } : undefined}>
            <Chart L={L} svgRef={svgRef} liveRef={liveRef} lit={armed ? lit : 0} tabTitle={tabTitle} />
          </div>
        </div>

        <div className="ld-steps">
          {steps.map((s, i) => {
            const H = i === 0 ? 'h2' : 'h3';
            return (
              <div
                key={s.key}
                className={`ld-step${armed && lit !== i + 1 ? ' is-quiet' : ''}`}
                ref={(el) => { stepRefs.current[i] = el; }}
              >
                <H className="ld-step-h">{s.title}</H>
                <p className="ld-step-say">{s.say}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
