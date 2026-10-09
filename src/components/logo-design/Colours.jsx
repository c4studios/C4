/*
 * Red and green: the eye chart's duochrome, run with our own colours.
 *
 * On a real chart the red and green test sets black letters on both halves.
 * Here the halves are the logo's deep red and green (the lockup and the
 * printed card), edge to edge, with the same mark in one colour on each,
 * and the brighter pair the profile picture uses noted beside them. Under
 * the halves, the same two with the colour taken out: #4F4F4F and #575757,
 * worked out from each colour's relative luminance (0.078 and 0.095,
 * scratchpad geometry-facts.mjs), so they're the greys a greyscale print
 * would give.
 *
 * Two strips of the mark follow on the bench. The colour test shows it in
 * colour, with the colour taken out, and as red-green colour blindness
 * approximately sees it (Machado, Oliveira and Fernandes 2009, deuteranopia
 * at full severity, applied in linear light). The grounds show why the C
 * needs the dark: in colour on paper the C (#F3F2F3, 1.03:1 on the bench)
 * disappears, while one colour and reversed hold. Every specimen is the
 * same three shapes.
 */
import { DEEP, SCREEN } from './geometry';
import { MarkG, widthAt } from './Pieces';

const H = 120;
const W = widthAt.mark(H) + 120;
const VB = `0 0 ${W.toFixed(1)} ${(H + 84).toFixed(1)}`;
const ONE = (c) => ({ red: c, green: c, c });
const INK = ONE('#1A1A1A');
const WHITE = ONE('#FFFFFF');
const DUO_INK = ONE('#121316'); // the duochrome's black

function Specimen({ ground, pair, filter, caption, tone = 'dark' }) {
  return (
    <figure className={`ld-spec ld-spec--${tone}`} style={{ background: ground }}>
      <svg viewBox={VB} aria-hidden="true" focusable="false">
        <g filter={filter ? `url(#${filter})` : undefined}>
          <MarkG x={60} y={42} h={H} pair={pair} />
        </g>
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function DuoMark() {
  const h = 100;
  const w = widthAt.mark(h);
  return (
    <svg className="ld-duo-mark" viewBox={`0 0 ${w.toFixed(1)} ${h}`} aria-hidden="true" focusable="false">
      <MarkG x={0} y={0} h={h} pair={DUO_INK} />
    </svg>
  );
}

export default function Colours() {
  return (
    <section className="ld-colours" aria-labelledby="ld-colours-h">
      {/* the two views, in linear light */}
      <svg className="ld-defs" aria-hidden="true" focusable="false">
        <filter id="ld-f-grey" colorInterpolationFilters="linearRGB">
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id="ld-f-deut" colorInterpolationFilters="linearRGB">
          <feColorMatrix
            type="matrix"
            values="0.367322 0.860646 -0.227968 0 0  0.280085 0.672501 0.047413 0 0  -0.011820 0.042940 0.968881 0 0  0 0 0 1 0"
          />
        </filter>
      </svg>

      <figure className="ld-duo">
        <div className="ld-duo-halves">
          <div className="ld-duo-half ld-duo-half--red">
            <h2 className="ld-h2 ld-duo-h" id="ld-colours-h">Red and green</h2>
            <DuoMark />
            <p className="ld-duo-spec">
              <span className="ld-duo-name">Red</span>
              <span data-fig="">{DEEP.red}</span>
              <span className="ld-duo-alt">
                <span className="ld-duo-chip" style={{ background: SCREEN.red }} aria-hidden="true" />
                <span><span data-fig="">{SCREEN.red}</span> on the profile picture</span>
              </span>
            </p>
          </div>
          <div className="ld-duo-half ld-duo-half--green">
            <DuoMark />
            <p className="ld-duo-spec">
              <span className="ld-duo-name">Green</span>
              <span data-fig="">{DEEP.green}</span>
              <span className="ld-duo-alt">
                <span className="ld-duo-chip" style={{ background: SCREEN.green }} aria-hidden="true" />
                <span><span data-fig="">{SCREEN.green}</span> on the profile picture</span>
              </span>
            </p>
          </div>
        </div>
        <div className="ld-duo-grey" aria-hidden="true">
          <span style={{ background: '#4F4F4F' }} />
          <span style={{ background: '#575757' }} />
        </div>
        <figcaption className="ld-frame ld-duo-cap">
          <span className="ld-duo-cap-text">
            An eye chart&rsquo;s red and green test sets black letters on both colours. Here it&rsquo;s our mark in
            one colour on our own red and green. The strip under them is the same two with the colour taken
            out: <span data-fig="">#4F4F4F</span> and <span data-fig="">#575757</span>.
          </span>
        </figcaption>
      </figure>

      <div className="ld-frame ld-colours-body">
        <div className="ld-colours-say">
          <p className="ld-say">
            Our red and green are almost the same lightness. Take the colour out and they&rsquo;re nearly the same
            grey, and to someone with red-green colour blindness they look much alike too. The 4 still reads,
            because the gap between its two pieces does the work.
          </p>
          <p className="ld-say">
            They come in two strengths. The printed card uses the deep pair. Our profile picture uses a brighter
            pair, which holds up better on a dark screen.
          </p>
        </div>

        <div className="ld-strip ld-strip--3">
          <Specimen ground="#141518" pair={DEEP} caption="In colour" />
          <Specimen ground="#141518" pair={DEEP} filter="ld-f-grey" caption="No colour" />
          <Specimen ground="#141518" pair={DEEP} filter="ld-f-deut" caption="Red-green colour blind, simulated" />
        </div>

        <div className="ld-pair">
          <div>
            <h3 className="ld-h3">A C that needs the dark</h3>
            <p className="ld-say">
              The C is nearly white, so it needs a dark ground. When the bar at the top of our site was pale, the
              logo looked wrong on it, so the bar went dark.
            </p>
          </div>
          <div>
            <h3 className="ld-h3">One colour, and reversed</h3>
            <p className="ld-say">
              On a light ground it works in one colour, and it reverses out of a colour just as cleanly. Neither
              needs anything redrawn.
            </p>
          </div>
        </div>

        <div className="ld-strip ld-strip--4">
          <Specimen ground="#141518" pair={DEEP} caption="In colour, on dark" />
          <Specimen ground="#F7F5F2" pair={DEEP} tone="light" caption="In colour, on paper: the C disappears" />
          <Specimen ground="#F7F5F2" pair={INK} tone="light" caption="One colour, on paper" />
          <Specimen ground={DEEP.red} pair={WHITE} tone="red" caption="Reversed out of the red" />
        </div>
      </div>
    </section>
  );
}
