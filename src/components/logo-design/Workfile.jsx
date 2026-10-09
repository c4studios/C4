/*
 * Our own mark in a drawing app's window, built up the way a logo is.
 *
 * The window is generic and drawn here: no real app's chrome, name or icons.
 * What's on its artboard is the real logo: the C is parsed from its path in
 * geometry.js into anchor points and the bezier handles that shape each
 * curve, and the 4 is its two polygons. Nothing is made up; the counts in the
 * status bar are counted from the path.
 *
 * It has four states, one for each step of "How a logo job runs":
 *   brief     an empty artboard with its guides
 *   concepts  the mark as bare outline, the way a drawing app shows paths
 *   refining  every anchor point, and the handles on the C's curves
 *   handover  filled in, with the export panel listing the file types the
 *             packages in pricing.js name
 * Process (Commerce.jsx) picks the state from the step being read. In the
 * static layout it shows everything at once ('all').
 */
import { MARK_SOURCE, BOX, DEEP } from './geometry';

/* ── the C, parsed: M, l, c and Z, relative after the first move ── */
function parseC(d) {
  const tokens = d.match(/[MlcZ]|-?\d*\.?\d+(?:e-?\d+)?/g);
  let i = 0;
  let cx = 0;
  let cy = 0;
  let cmd = null;
  const anchors = [];
  const handles = [];
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[MlcZ]/.test(tokens[i])) cmd = tokens[i++];
    if (cmd === 'M') { cx = num(); cy = num(); anchors.push([cx, cy]); cmd = 'l'; }
    else if (cmd === 'l') { cx += num(); cy += num(); anchors.push([cx, cy]); }
    else if (cmd === 'c') {
      const x1 = cx + num(); const y1 = cy + num();
      const x2 = cx + num(); const y2 = cy + num();
      const x = cx + num(); const y = cy + num();
      handles.push([[cx, cy], [x1, y1]], [[x, y], [x2, y2]]);
      cx = x; cy = y;
      anchors.push([cx, cy]);
    } else if (cmd === 'Z') { cmd = null; }
  }
  /* the path closes on its start, so the last anchor is the first again */
  const last = anchors[anchors.length - 1];
  if (last && Math.hypot(last[0] - anchors[0][0], last[1] - anchors[0][1]) < 0.01) anchors.pop();
  return { anchors, handles };
}

const pts = (s) => {
  const n = s.trim().split(/\s+/).map(Number);
  const out = [];
  for (let k = 0; k < n.length; k += 2) out.push([n[k], n[k + 1]]);
  /* polygons repeat their first point to close */
  const a = out[0]; const z = out[out.length - 1];
  if (a && z && a[0] === z[0] && a[1] === z[1]) out.pop();
  return out;
};

const C = parseC(MARK_SOURCE.cArc);
const BODY = pts(MARK_SOURCE.fourBody);
const ARM = pts(MARK_SOURCE.fourArm);
export const ANCHOR_COUNT = C.anchors.length + BODY.length + ARM.length;
export const HANDLE_COUNT = C.handles.length;

/* window layout, in its own units */
const W = 640;
const H = 452;
const BAR = 30;
const TOOLS = 44;
const PANEL = 150;
const FOOT = 26;
const ART = { x: TOOLS + 22, y: BAR + 22, w: W - TOOLS - PANEL - 44, h: H - BAR - FOOT - 44 };

/* the mark fitted into the artboard */
const pad = 34;
const s = Math.min((ART.w - 2 * pad) / BOX.mark.w, (ART.h - 2 * pad) / BOX.mark.h);
const ox = ART.x + (ART.w - BOX.mark.w * s) / 2 - BOX.mark.x * s;
const oy = ART.y + (ART.h - BOX.mark.h * s) / 2 - BOX.mark.y * s;
const P = ([x, y]) => [ox + x * s, oy + y * s];
const T = `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(5)})`;

function Tool({ y, active, children }) {
  return (
    <g transform={`translate(${TOOLS / 2} ${y})`} className={active ? 'ld-wf-tool is-active' : 'ld-wf-tool'}>
      <rect x="-14" y="-14" width="28" height="28" rx="4" />
      {children}
    </g>
  );
}

export default function Workfile({ state = 'all', formats = [] }) {
  const show = (...states) => state === 'all' || states.includes(state);
  const anchors = [...C.anchors, ...BODY, ...ARM];
  const filled = show('handover');
  const pen = state === 'refining' || state === 'concepts';
  return (
    <svg className={`ld-wf is-${state}`} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      {/* the window */}
      <rect className="ld-wf-win" x="0.5" y="0.5" width={W - 1} height={H - 1} rx="8" />
      <path className="ld-wf-bar" d={`M0.5 ${BAR} V8.5 a8 8 0 0 1 8 -8 H${W - 8.5} a8 8 0 0 1 8 8 V${BAR} Z`} />
      {[18, 34, 50].map((x) => <circle key={x} className="ld-wf-dot" cx={x} cy={BAR / 2} r="4.5" />)}
      <text className="ld-wf-title" x={W / 2} y={BAR / 2 + 0.5} textAnchor="middle" dominantBaseline="middle">c4-mark.svg</text>

      {/* tools: select, direct select, pen, shape, type */}
      <rect className="ld-wf-side" x="0.5" y={BAR} width={TOOLS} height={H - BAR - FOOT} />
      <Tool y={BAR + 26} active={state === 'brief'}><path d="M-5 -7 L5 2 L0.5 2.6 L3 8 L1 9 L-1.5 3.6 L-5 6 Z" className="ld-wf-ico-fill" /></Tool>
      <Tool y={BAR + 60} active={state === 'handover' || state === 'all'}><path d="M-5 -7 L5 2 L0.5 2.6 L3 8 L1 9 L-1.5 3.6 L-5 6 Z" className="ld-wf-ico-line" /></Tool>
      <Tool y={BAR + 94} active={pen}><path d="M0 -8 L5 2 L2 7 H-2 L-5 2 Z M0 -8 V1" className="ld-wf-ico-line" /><circle cx="0" cy="2" r="1.4" className="ld-wf-ico-fill" /></Tool>
      <Tool y={BAR + 128}><rect x="-6" y="-6" width="12" height="12" className="ld-wf-ico-line" /></Tool>
      <Tool y={BAR + 162}><path d="M-5 -6 H5 M0 -6 V7" className="ld-wf-ico-line" /></Tool>

      {/* the layers panel */}
      <rect className="ld-wf-side" x={W - PANEL - 0.5} y={BAR} width={PANEL} height={H - BAR - FOOT} />
      <text className="ld-wf-label" x={W - PANEL + 14} y={BAR + 22}>Layers</text>
      {[['C', DEEP.c], ['4, body', DEEP.red], ['4, arm', DEEP.green]].map(([name, c], k) => (
        <g key={name} transform={`translate(${W - PANEL + 14} ${BAR + 44 + k * 28})`}>
          <rect className="ld-wf-row" x="-6" y="-11" width={PANEL - 16} height="24" rx="3" />
          <rect x="0" y="-5" width="10" height="10" rx="1.5" fill={c} />
          <text className="ld-wf-item" x="18" y="1" dominantBaseline="middle">{name}</text>
        </g>
      ))}

      {/* export, at the hand-over */}
      {/* placed by the outer group's attribute; CSS moves only the inner one */}
      <g transform={`translate(${W - PANEL + 8} ${BAR + 150})`}>
      <g className={`ld-wf-export${show('handover') ? ' is-shown' : ''}`}>
        <rect className="ld-wf-sheet" x="0" y="0" width={PANEL - 16} height={34 + formats.length * 26} rx="5" />
        <text className="ld-wf-label" x="12" y="21">Export</text>
        {formats.map((f, k) => (
          <g key={f} transform={`translate(12 ${44 + k * 26})`}>
            <path d="M0 0 L3.5 3.5 L10 -3.5" className="ld-wf-tick" />
            <text className="ld-wf-item" x="18" y="1" dominantBaseline="middle">{`c4-mark.${f.toLowerCase()}`}</text>
          </g>
        ))}
      </g>
      </g>

      {/* the artboard */}
      <rect className="ld-wf-paste" x={TOOLS + 0.5} y={BAR} width={W - TOOLS - PANEL - 1} height={H - BAR - FOOT} />
      <rect className="ld-wf-art" x={ART.x} y={ART.y} width={ART.w} height={ART.h} />
      <g className="ld-wf-guides">
        <line x1={ART.x} x2={ART.x + ART.w} y1={P([0, 308.72])[1]} y2={P([0, 308.72])[1]} />
        <line x1={ART.x} x2={ART.x + ART.w} y1={P([0, 469.58])[1]} y2={P([0, 469.58])[1]} />
        <line y1={ART.y} y2={ART.y + ART.h} x1={P([503.71, 0])[0]} x2={P([503.71, 0])[0]} />
      </g>

      <g className={`ld-wf-fill${filled ? ' is-shown' : ''}`} transform={T}>
        <path d={MARK_SOURCE.cArc} fill={DEEP.c} />
        <polygon points={MARK_SOURCE.fourBody} fill={DEEP.red} />
        <polygon points={MARK_SOURCE.fourArm} fill={DEEP.green} />
      </g>
      <g className={`ld-wf-paths${show('concepts', 'refining', 'handover') ? ' is-shown' : ''}`} transform={T}>
        <path d={MARK_SOURCE.cArc} pathLength="1" />
        <polygon points={MARK_SOURCE.fourBody} pathLength="1" />
        <polygon points={MARK_SOURCE.fourArm} pathLength="1" />
      </g>
      <g className={`ld-wf-handles${show('refining') ? ' is-shown' : ''}`}>
        {C.handles.map(([a, b], k) => {
          const [x1, y1] = P(a);
          const [x2, y2] = P(b);
          return (
            <g key={`h${a}${b}`} style={{ '--i': k }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} />
              <circle cx={x2} cy={y2} r="2.6" />
            </g>
          );
        })}
      </g>
      <g className={`ld-wf-anchors${show('refining') ? ' is-shown' : ''}`}>
        {anchors.map((a, k) => {
          const [x, y] = P(a);
          return <rect key={`a${a}`} x={x - 2.8} y={y - 2.8} width="5.6" height="5.6" style={{ '--i': k }} />;
        })}
      </g>

      {/* status */}
      <path className="ld-wf-foot" d={`M0.5 ${H - FOOT} H${W - 0.5} V${H - 8.5} a8 8 0 0 1 -8 8 H8.5 a8 8 0 0 1 -8 -8 Z`} />
      <text className="ld-wf-status" x={TOOLS + 10} y={H - FOOT / 2 + 0.5} dominantBaseline="middle">
        {`${ANCHOR_COUNT} anchor points · ${HANDLE_COUNT} handles · 3 paths`}
      </text>
    </svg>
  );
}
