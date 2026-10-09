/*
 * The stand-in mark (mark-data.js) as SVG. One component draws every
 * version and colourway the page shows, so the family can't drift apart:
 *
 *   <Mark version="horizontal" ink="#151515" />
 *   <Mark version="compact" ink="#151515" roundelInk="#F2B705" />
 *
 * The roundel is a disc with the Y cut out of it, so whatever sits behind the
 * mark shows through the Y, the way it would through vinyl or embroidery.
 * Decorative wherever it's used: the words around it say what it is.
 *
 * A page that shows one version several times renders <MarkDefs /> once, and
 * each <Mark shared /> then points at it with <use>, so the outlines are in
 * the HTML once rather than once per copy. The inks travel in as custom
 * properties, which carry into the <use> copy.
 */
import { MARK } from './mark-data';

/* A disc with the Y as a hole (evenodd), drawn as two arcs. */
export function roundelPath(rd) {
  const { cx, cy, r } = rd;
  return `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z ${rd.y.join(' ')}`;
}

/* Every letter with its counters as holes. */
export function lettersPath(v) {
  return v.letters.map((g) => [...g.outer, ...g.inner].join(' ')).join(' ');
}

function Paths({ v }) {
  return (
    <>
      <path fillRule="evenodd" style={{ fill: 'var(--mk-roundel, currentColor)' }} d={roundelPath(v.roundel)} />
      {v.letters.length ? <path fillRule="evenodd" style={{ fill: 'var(--mk-ink, currentColor)' }} d={lettersPath(v)} /> : null}
    </>
  );
}

/* With `stitch`, MarkDefs also carries the filter that raises the stitched
   version (sections.jsx, Stitched) off the cloth, in the mark's own units. */
export function MarkDefs({ versions = ['horizontal', 'compact'], stitch = false }) {
  return (
    <svg className="lg-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        {versions.map((name) => (
          <g key={name} id={`lg-mark-${name}`}><Paths v={MARK[name]} /></g>
        ))}
        {stitch ? (
          <filter id="lg-thread" x="-4%" y="-30%" width="108%" height="170%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feOffset in="blur" dy="5" result="drop" />
            <feFlood floodColor="#070b16" floodOpacity="0.75" />
            <feComposite in2="drop" operator="in" result="shade" />
            <feMerge>
              <feMergeNode in="shade" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ) : null}
      </defs>
    </svg>
  );
}

export default function Mark({
  version = 'horizontal',
  ink = 'currentColor',
  roundelInk,
  pad = 0,
  shared = false,
  className = '',
}) {
  const v = MARK[version];
  return (
    <svg
      className={className}
      viewBox={`${-pad} ${-pad} ${v.w + pad * 2} ${v.h + pad * 2}`}
      style={{ '--mk-ink': ink, '--mk-roundel': roundelInk || ink }}
      aria-hidden="true"
      focusable="false"
    >
      {shared ? <use href={`#lg-mark-${version}`} /> : <Paths v={v} />}
    </svg>
  );
}
