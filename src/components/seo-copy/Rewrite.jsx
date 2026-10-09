/*
 * The rewrite, on a page rather than a listing: the example business's home
 * page as it was and as we'd write it. Same layout, same photograph; only
 * the words change. The margin beside the page says what changed and why.
 *
 * The page and its words are an example (examples.js, the same business the
 * climb follows), and it says so in its address bar. The photograph is real
 * (photos.jsx). Both versions are in the HTML; the switch shows one, and
 * the change is a strike and a reprint, like the listing's in the climb.
 * Under reduced motion it simply swaps.
 */
import { useEffect, useRef, useState } from 'react';
import useStaticMode from '@/hooks/useStaticMode';
import { PHOTOS, Photo, Credit } from './photos';
import { EXAMPLES, YOU, YOU_SITE } from './examples';

const EX = EXAMPLES[0];
const firstSentence = (s) => (s.match(/^[^.!?]+[.!?]/) || [s])[0];

const BEFORE = {
  h: firstSentence(EX.before.desc).replace(/[.!]$/, ''),
  p: EX.before.desc.slice(firstSentence(EX.before.desc).length).trim(),
  cta: 'Learn more',
  nav: ['Home', 'About us', 'Services', 'Contact'],
};
const AFTER = {
  h: EX.after.title.split(' | ')[0],
  p: EX.after.desc,
  cta: 'Send a photo of the job',
  nav: ['Switchboards', 'Lighting', 'Safety switches', 'Get a quote'],
};

const NOTES = [
  { k: 'h', label: 'The heading', was: BEFORE.h, why: 'The job and the suburb, where the eye lands first.' },
  { k: 'p', label: 'The first lines', was: BEFORE.p, why: 'What you actually do and where you go, instead of how good you are.' },
  { k: 'cta', label: 'The button', was: BEFORE.cta, why: 'The next step, said as the thing you’d do.' },
  { k: 'nav', label: 'The menu', was: BEFORE.nav.join(', '), why: 'The jobs people come for. Each one is a page that can rank on its own.' },
];

function Page({ v, marked }) {
  const m = (children) => <span className="sc-rw-ink">{marked ? <mark className="sc-sel is-on">{children}</mark> : children}</span>;
  return (
    <div className="sc-rw-page">
      <div className="sc-rw-nav">
        <span className="sc-rw-logo"><span className="sc-rw-fav">Y</span>{YOU}</span>
        <span className="sc-rw-links">
          {v.nav.map((n) => <span key={n}>{marked ? <mark className="sc-sel is-on">{n}</mark> : n}</span>)}
        </span>
      </div>
      <div className="sc-rw-hero">
        <div className="sc-rw-copy">
          <p className="sc-rw-h">{m(v.h)}</p>
          <p className="sc-rw-p"><span className="sc-rw-ink">{v.p}</span></p>
          <span className="sc-rw-cta">{v.cta}</span>
        </div>
        <Photo photo={PHOTOS.switchboard} sizes="(min-width: 1024px) 30vw, 60vw" className="sc-rw-photo" alt="" />
      </div>
    </div>
  );
}

export default function Rewrite() {
  const staticMode = useStaticMode();
  const [after, setAfter] = useState(true);
  const [striking, setStriking] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const show = (next) => {
    if (next === after) return;
    clearTimeout(timer.current);
    if (staticMode) { setAfter(next); return; }
    setStriking(true);
    timer.current = setTimeout(() => { setAfter(next); setStriking(false); }, 520);
  };

  return (
    <section className="sc-sec sc-rewrite" aria-labelledby="sc-rewrite-h">
      <div className="sc-frame">
        <div className="sc-rewrite-head">
          <h2 className="sc-h2" id="sc-rewrite-h">Same page, new words</h2>
          <p className="sc-say">
            Here&rsquo;s the example business&rsquo;s home page before and after a rewrite. The layout and the photo
            haven&rsquo;t moved. What changed is what a stranger learns in the first few seconds.
          </p>
        </div>

        <div className="sc-rewrite-grid">
          <figure className="sc-rw" data-nosnippet="">
            <div className="sc-rw-bar">
              <span className="sc-rw-url">{YOU_SITE}</span>
              <span className="sc-rw-tag">Example</span>
            </div>
            <div className={`sc-rw-stage${after ? ' is-after' : ' is-before'}${striking ? ' is-striking' : ''}`}>
              <div className="sc-rw-v sc-rw-v--before" aria-hidden={after}>
                <Page v={BEFORE} />
              </div>
              <div className="sc-rw-v sc-rw-v--after" aria-hidden={!after}>
                <Page v={AFTER} marked />
              </div>
            </div>
            <figcaption className="sc-cap">
              <span>An example home page. The business and its words are made up; the photo is real.</span>
              <Credit photo={PHOTOS.switchboard} />
            </figcaption>
          </figure>

          <div className="sc-rw-side">
            <div className="sc-switch sc-switch--light" role="group" aria-label="Show the page">
              <button type="button" aria-pressed={!after} onClick={() => show(false)}>As it was</button>
              <button type="button" aria-pressed={after} onClick={() => show(true)}>Rewritten</button>
            </div>
            <ul className="sc-notes">
              {NOTES.map((n) => (
                <li key={n.k} className="sc-note">
                  <p className="sc-note-label">{n.label}</p>
                  <p className="sc-note-was"><span className="sr-only">It was: </span><s>{n.was}</s></p>
                  <p className="sc-note-why">{n.why}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
