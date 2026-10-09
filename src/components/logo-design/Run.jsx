/*
 * "Most logos spend their life on things": the run.
 *
 * After the eye test, the page leaves the screen. Seven real processes, each
 * a photograph of the craft itself (photos.js has every source), and beside
 * each one our own 4 drawn in code the way that process would carry it
 * (Treatments.jsx). The photos are other people's, of other people's work,
 * and the captions say plainly what's in them. The drawings are ours and the
 * intro says they're drawings.
 *
 * Three layouts, picked by the window, as in the exam:
 *  - wide (1024px across and 600px tall or more): the photograph fills a
 *    pinned stage from the left edge of the window to past the middle, and
 *    the plate with our 4 hangs off its lower right corner into the words.
 *    As each step's words reach the reading line, its photograph comes up
 *    over the last one with a slow push in, like a camera settling, and its
 *    plate takes over. On the screen-print step the green screen drops into
 *    register over the red.
 *  - flat (anything narrower or shorter, reduced motion and the prerender):
 *    nothing pins. Every step is its photograph with its plate on the corner,
 *    then its words. useStaticMode decides on the first render, so the static
 *    HTML is this layout, complete.
 * Every word is in the steps in both layouts.
 */
import { useRef } from 'react';
import { brandingPackages } from '@/data/pricing';
import Photo, { Credit } from './Photo';
import Treatment from './Treatments';
import useWide, { useReadingLine } from './useWide';

/* The package that promises a version for embroidery, read from pricing.js so
   the sentence goes if the promise does. */
const STITCH_PKG = brandingPackages.find((p) => (p.features || []).some((f) => /embroidery/i.test(f)));
const STITCH_LINE = STITCH_PKG
  ? (STITCH_PKG.features.find((f) => /embroidery/i.test(f)) || '').replace(/^./, (c) => c.toLowerCase())
  : '';

const STEPS = [
  {
    key: 'engrave',
    title: 'Cut into metal',
    say: 'An engraver cuts the shape into the plate. There’s no colour, only what’s cut and what isn’t, so the logo has to hold up as a shape on its own. The two pieces of our 4 don’t touch, so even cut into bare copper they read as two.',
    pictured: 'A copper plate engraved by hand, with a hammer and chisel, in Mostar.',
    alt: 'Hands engraving a copper plate with a hammer and a small chisel.',
    focus: '58% 62%',
  },
  {
    key: 'foil',
    title: 'Pressed in foil',
    say: 'Foil is one metal at a time. Our red and green would both come out gold, and the gap between the two pieces is what tells them apart.',
    pictured: 'Gold foil on dark card.',
    alt: 'A gold foil pattern printed on a dark blue card.',
    focus: '45% 50%',
  },
  {
    key: 'screen',
    title: 'Pulled through a screen',
    say: 'Screen printing lays down one colour per screen, one pass after another. Our 4 is two colours, so it’s two screens, and the green has to land exactly against the red.',
    pictured: 'Yellow ink pulled through a screen with a squeegee.',
    alt: 'Gloved hands pulling a squeegee across a screen printing frame.',
    focus: '30% 60%',
  },
  {
    key: 'stitch',
    title: 'Stitched',
    say: `Thread has thickness, so a hairline won’t stitch and tight gaps can close up. A detailed logo often needs a simpler version for shirts and caps.${STITCH_PKG ? ` ${STITCH_PKG.name} includes a ${STITCH_LINE}.` : ''}`,
    pictured: 'A sewing machine running a green decorative stitch.',
    alt: 'A sewing machine needle stitching a green pattern into white fabric.',
    focus: '62% 55%',
  },
  {
    key: 'sign',
    title: 'Painted on glass',
    say: 'A signwriter paints the letters by hand, often with a shade line in a second colour. On a shopfront the logo is read from across the street, usually at an angle.',
    pictured: 'Hand-painted lettering on a shop window in Nashville.',
    alt: 'Red script lettering with a yellow shade line, painted on a shop window.',
    focus: '38% 50%',
  },
  {
    key: 'van',
    title: 'Wrapped round a van',
    say: 'On a vehicle the logo runs across door gaps, handles and curved panels. Big, simple shapes come through being cut up like that, and fine detail gets lost in the seams.',
    pictured: 'Stripes along the side of a van, across the door gap.',
    alt: 'Orange and black stripes on a yellow van, crossing the door and its handle.',
    focus: '40% 50%',
  },
  {
    key: 'seal',
    title: 'Stamped and sealed',
    say: 'A stamp or a seal is small, pressed by hand, in one colour of ink or wax. The shape has to read when it’s tiny and a little uneven.',
    pictured: 'A brass seal stamp with the letter T.',
    alt: 'A brass seal stamp with a wooden handle, its face cut with a letter T and leaves.',
    focus: '50% 52%',
  },
];

const STAGE_SIZES = '(min-width: 1024px) 60vw, 100vw';
const FLAT_SIZES = '(min-width: 900px) 55vw, 100vw';

function Caption({ s }) {
  return (
    <p className="ld-run-cap">
      {s.pictured} <Credit k={s.key} />
    </p>
  );
}

export default function Run() {
  const mode = useWide();
  const wide = mode === 'wide';
  const stepRefs = useRef([]);
  /* a step is on once its top passes 58% of the way down the window */
  const on = useReadingLine(wide, stepRefs, 0.58);

  return (
    <section className={`ld-run is-${mode}`} aria-labelledby="ld-run-h">
      <div className="ld-frame ld-run-intro">
        <div className="ld-run-intro-text">
          <h2 className="ld-h2" id="ld-run-h">Most logos spend their life on things</h2>
          <p className="ld-say">
            Screens are the easy part. A logo also gets cut, stitched, painted and pressed, and each process
            does something to it. Below are photos of seven of them. Beside each one is our own 4, drawn in code
            the way that process would carry it.
          </p>
          <p className="ld-run-note">
            The photos are other people&rsquo;s, from Unsplash, and none of it is our work. The drawings of the 4
            are ours.
          </p>
        </div>
        <figure className="ld-run-enamel">
          <Photo k="enamel" alt="A weathered enamel house number plate with a black 4, screwed to a rendered wall." sizes="(min-width: 900px) 34vw, 100vw" />
          <figcaption className="ld-run-cap">
            Someone else&rsquo;s 4: a house number on an enamel plate, made to read from the footpath. <Credit k="enamel" />
          </figcaption>
        </figure>
      </div>

      <div className="ld-run-body">
        {wide ? (
          <div className="ld-run-stage" aria-hidden="true">
            <div className="ld-run-shots">
              {STEPS.map((s, i) => (
                <div key={s.key} className={`ld-run-shot${i === on ? ' is-on' : ''}${i < on ? ' is-past' : ''}`} style={{ '--focus': s.focus }}>
                  <Photo k={s.key} alt="" sizes={STAGE_SIZES} />
                </div>
              ))}
            </div>
            <div className="ld-run-plates">
              {STEPS.map((s, i) => (
                <div key={s.key} className={`ld-run-plate ld-run-plate--${s.key}${i === on ? ' is-on' : ''}`}>
                  <Treatment kind={s.key} />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <ol className="ld-run-steps">
          {STEPS.map((s, i) => (
            <li
              key={s.key}
              className={`ld-run-step${wide && i !== on ? ' is-quiet' : ''}`}
              ref={(el) => { stepRefs.current[i] = el; }}
            >
              {wide ? null : (
                <div className="ld-run-fig">
                  <div className="ld-run-photo" style={{ '--focus': s.focus }}>
                    <Photo k={s.key} alt={s.alt} sizes={FLAT_SIZES} />
                  </div>
                  <div className={`ld-run-plate ld-run-plate--${s.key} is-on`}>
                    <Treatment kind={s.key} />
                  </div>
                </div>
              )}
              <div className="ld-run-text">
                <h3 className="ld-run-h">{s.title}</h3>
                <p className="ld-run-say">{s.say}</p>
                <Caption s={s} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
