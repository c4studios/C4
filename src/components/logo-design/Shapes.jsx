/*
 * Three shapes, and none of them touch.
 *
 * One plate, the family registered: the 4, the mark and the lockup drawn at
 * the same scale and standing on one line, the foot of the green T, so the
 * eye can check that nothing changes between them except what's added.
 * Everything on the plate is measured in x, the width of the green T's stem:
 *  - the gaps: the C's top cut runs alongside the 4's diagonal, 1.26x off
 *    it, and the two pieces of the 4 are 0.31x apart at the cut (worked out
 *    from the points in geometry.js, FACTS);
 *  - the slant: the 4's diagonal and the C's top cut drawn on up out of the
 *    mark side by side;
 *  - the lockup: two guides at the top of the T and at its foot, which the
 *    word Studios fills;
 *  - clear space: x on every side of the lockup.
 * The notes under the plate say the same in words, one subject each.
 *
 * The plate is dark because the C is nearly white. It keeps its colours in
 * both themes, like every material on the site. A wide and a stacked
 * version are both in the markup and CSS shows one; both are aria-hidden,
 * since the notes say everything they show.
 */
import { BOX, DEEP, FACTS, GAPS } from './geometry';
import { FourG, MarkG, LockupG, widthAt } from './Pieces';

const WORD = '#E8E6E3'; // the word on a dark ground, as the nav draws it (C4Logo.jsx, header context)
const T_TOP = { mark: 308.72, lockup: 405.86 }; // the top of the green T's crossbar, in each source's units

/* Lay the family out in plate units, the mark H tall. */
function family(H, stacked) {
  const four = { h: (BOX.four.h / BOX.mark.h) * H };
  four.w = widthAt.four(four.h);
  const wM = widthAt.mark(H);
  const wL = widthAt.lockup(H);
  const x = FACTS.tStem * (H / BOX.lockup.h); // x, in plate units
  const pad = H * 0.42;
  const top = H * 0.4;
  if (!stacked) {
    const gap = H * 0.66;
    const foot = top + H;
    const x4 = pad;
    const xM = x4 + four.w + gap;
    const xL = xM + wM + gap + x;
    return {
      W: xL + wL + x + pad,
      Hh: foot + H * 0.62,
      x,
      items: [
        { kind: 'four', x: x4, y: foot - four.h, h: four.h, w: four.w, name: 'The 4' },
        { kind: 'mark', x: xM, y: foot - H, h: H, w: wM, name: 'The mark' },
        { kind: 'lockup', x: xL, y: foot - H, h: H, w: wL, name: 'The lockup' },
      ],
    };
  }
  const left = pad + x;
  const row = H * 2.05;
  const foot0 = top + H;
  return {
    W: left + wL + x + pad,
    Hh: foot0 + 2 * row + H * 0.62,
    x,
    stacked: true,
    items: [
      { kind: 'four', x: left, y: foot0 - four.h, h: four.h, w: four.w, name: 'The 4' },
      { kind: 'mark', x: left, y: foot0 + row - H, h: H, w: wM, name: 'The mark' },
      { kind: 'lockup', x: left, y: foot0 + 2 * row - H, h: H, w: wL, name: 'The lockup' },
    ],
  };
}

/* a point in the logo's own units, placed on an item of the plate */
const onItem = (it) => {
  const box = it.kind === 'four' ? BOX.four : BOX.mark;
  const s = it.h / box.h;
  return ([px, py]) => [it.x + (px - box.x) * s, it.y + (py - box.y) * s];
};

/* where the top of the green T falls on a placed item */
const tTopOf = (it) => {
  if (it.kind === 'lockup') return it.y + ((T_TOP.lockup - BOX.lockup.y) / BOX.lockup.h) * it.h;
  return onItem(it)([0, T_TOP.mark])[1];
};

/* An edge from its lower end a, drawn on up through its upper end b to the
   height toY, all in the logo's units, returned on the item. */
function ray(it, a, b, toY) {
  const p = onItem(it);
  const t = (toY - a[1]) / (b[1] - a[1]);
  const [x1, y1] = p(a);
  const [x2, y2] = p([a[0] + (b[0] - a[0]) * t, toY]);
  return { x1, y1, x2, y2 };
}

/* The shortest line from a point to the line through a and b: a measure of
   a gap, returned on the item with its midpoint. */
function across(it, { from, a, b }) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = ((from[0] - a[0]) * dx + (from[1] - a[1]) * dy) / (dx * dx + dy * dy);
  const foot = [a[0] + dx * t, a[1] + dy * t];
  const p = onItem(it);
  const [x1, y1] = p(from);
  const [x2, y2] = p(foot);
  return { x1, y1, x2, y2, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
}

/* B612 Mono sets its point at the left of a full cell, so "1.26" reads as
   "1. 26"; the figures after the point are pulled back by the gap it leaves
   (measured on the font, 9 Oct 2026: ink 0.06 to 0.24em in a 0.65em cell). */
function Fig({ value }) {
  const [whole, part] = String(value).split('.');
  if (part === undefined) return whole;
  return <>{`${whole}.`}<tspan dx="-0.33em">{part}</tspan></>;
}

/* On the wide plate a gap's figure sits at the end of a leader; on the
   stacked one (phones) the plate is small, so the figure goes in the item's
   caption instead and only the measure stays on the shape. */
function Measure({ m, value, lx, ly, anchor = 'start', H, bare }) {
  return (
    <g className="ld-measure">
      <line className="ld-measure-line" x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} />
      <circle cx={m.x1} cy={m.y1} r={H * 0.016} />
      <circle cx={m.x2} cy={m.y2} r={H * 0.016} />
      {bare ? null : (
        <>
          <line className="ld-measure-lead" x1={m.mx} y1={m.my} x2={lx} y2={ly} />
          <text className="ld-plate-fig" x={lx + (anchor === 'end' ? -H * 0.03 : H * 0.03)} y={ly + H * 0.04} textAnchor={anchor}><Fig value={value} /></text>
        </>
      )}
    </g>
  );
}

function Plate({ H, stacked, className }) {
  const F = family(H, stacked);
  const [four, mark, lock] = F.items;
  const diag = ray(mark, [304.78, 323.95], [470.27, 94.43], 22);
  const ccut = ray(mark, [343.2, 161.19], [380.55, 109.15], 22);
  const cGap = across(mark, GAPS.cToFour);
  const cut = across(four, GAPS.cut);
  const guides = F.stacked ? F.items : [F.items[0]];
  const cs = F.x;
  const pFour = onItem(four);
  const pMark = onItem(mark);
  /* label spots, in the logo's units: under the red crossbar for the cut,
     and inside the C's bowl, clear of the C and the 4, for the C's gap */
  const [cutLx, cutLy] = pFour([400, 432]);
  const [cLx, cLy] = pMark([300, 236]);
  return (
    <svg className={className} viewBox={`0 0 ${F.W.toFixed(1)} ${F.Hh.toFixed(1)}`} aria-hidden="true" focusable="false">
      {/* the top of the T and its foot, run through the family */}
      {guides.map((it) => {
        const a = F.stacked ? it.x - H * 0.18 : H * 0.18;
        const b = F.W - H * 0.18;
        const t = tTopOf(it);
        const f = it.y + it.h;
        return (
          <g key={`g-${it.kind}`} className="ld-guide">
            <line x1={a} x2={b} y1={t} y2={t} />
            <line x1={a} x2={b} y1={f} y2={f} />
          </g>
        );
      })}

      {/* clear space round the lockup, one T-stem wide, and the unit itself */}
      <rect className="ld-clear" x={lock.x - cs} y={lock.y - cs} width={lock.w + 2 * cs} height={lock.h + 2 * cs} />
      <rect className="ld-clear-x" x={lock.x - cs} y={lock.y - cs} width={cs} height={cs} />
      <text className="ld-plate-fig" x={lock.x - cs / 2} y={lock.y - cs - H * 0.07} textAnchor="middle">x</text>

      <FourG x={four.x} y={four.y} h={four.h} pair={DEEP} />
      <MarkG x={mark.x} y={mark.y} h={mark.h} pair={DEEP} />
      <LockupG x={lock.x} y={lock.y} h={lock.h} pair={DEEP} word={WORD} />

      {/* the slant: two edges run up out of the mark side by side */}
      <line className="ld-slant" x1={diag.x1} y1={diag.y1} x2={diag.x2} y2={diag.y2} />
      <line className="ld-slant" x1={ccut.x1} y1={ccut.y1} x2={ccut.x2} y2={ccut.y2} />
      <text className="ld-plate-fig" x={diag.x2 + H * 0.07} y={diag.y2 + H * 0.1}>{`${FACTS.slantLow}°`}</text>

      {/* the gaps, in x */}
      <Measure m={cGap} value={`${FACTS.cToFour}x`} lx={cLx} ly={cLy} anchor="end" H={H} bare={F.stacked} />
      <Measure m={cut} value={`${FACTS.cutGap}x`} lx={cutLx} ly={cutLy} anchor="end" H={H} bare={F.stacked} />

      {F.items.map((it) => (
        <text key={`n-${it.kind}`} className="ld-plate-name" x={it.x} y={it.y + it.h + H * 0.34}>{it.name}</text>
      ))}
      {F.stacked ? (
        <>
          <text className="ld-plate-fig" x={four.x} y={four.y + four.h + H * 0.58}>{'Cut: '}<Fig value={`${FACTS.cutGap}x`} /></text>
          <text className="ld-plate-fig" x={mark.x} y={mark.y + mark.h + H * 0.58}>{'C to 4: '}<Fig value={`${FACTS.cToFour}x`} /></text>
        </>
      ) : null}
    </svg>
  );
}

export default function Shapes() {
  const edges = FACTS.fourEdges === 18 ? 'eighteen' : FACTS.fourEdges;
  return (
    <section className="ld-sec ld-shapes" aria-labelledby="ld-shapes-h">
      <div className="ld-frame">
        <h2 className="ld-h2 ld-shapes-h" id="ld-shapes-h">Three shapes, and none of them touch</h2>

        <figure className="ld-plate">
          <Plate H={200} className="ld-plate-svg ld-plate-svg--wide" />
          <Plate H={200} stacked className="ld-plate-svg ld-plate-svg--stacked" />
        </figure>

        <div className="ld-notes">
          <div className="ld-note">
            <h3 className="ld-h3">Three shapes</h3>
            <p className="ld-say">
              Our whole logo is a C and a 4, and the 4 is cut in two. The 4 has {edges} edges and every one is
              straight. The C is all curve, cut off straight at each end.
            </p>
          </div>
          <div className="ld-note">
            <h3 className="ld-h3">The gaps</h3>
            <p className="ld-say">
              On the plate, x is the width of the green T&rsquo;s stem. The C sits {FACTS.cToFour}x off the
              4&rsquo;s diagonal, and the two pieces of the 4 are {FACTS.cutGap}x apart at the cut. With nothing
              touching, the logo works in one colour without anything being redrawn.
            </p>
          </div>
          <div className="ld-note">
            <h3 className="ld-h3">The slants</h3>
            <p className="ld-say">
              The 4&rsquo;s diagonal and the cut ends of its crossbar lean at {FACTS.slantLow} to {FACTS.slantHigh} degrees,
              and the top of the C is cut on the same slant.
            </p>
          </div>
          <div className="ld-note">
            <h3 className="ld-h3">Where there&rsquo;s room for a word</h3>
            <p className="ld-say">
              The lockup puts Studios beside the 4. The word is drawn the height of the green T and stands on its
              foot. In the bar at the top of this page it stays tucked away until you hover over the logo or tap it.
            </p>
          </div>
          <div className="ld-note">
            <h3 className="ld-h3">Clear space</h3>
            <p className="ld-say">
              Clear space is the room a logo keeps to itself. On the plate it&rsquo;s x on every side, so it grows
              and shrinks with the logo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
