/*
 * Where the climb ends up: the example listing, first, on a phone in
 * someone's hands. The photograph is real (photos.jsx). Its screen was a
 * green screen, keyed out by scripts/seo-photos.mjs, so the results page
 * here is HTML drawn behind the photo and seen through the hole, and the
 * thumb stays in front of it.
 *
 * The screen is placed by the four corners measured off the green:
 * top left (33.81%, 13.66%), top right (68.66%, 15.23%), bottom left
 * (31.19%, 78.47%) of the photo. That's a slight parallelogram, so it's a
 * rotate and a skew from the top-left corner, with the screen's own colour
 * running a little past every edge so no green-shaped gap can show.
 * Everything on the screen is sized in its own container units, so it lays
 * out the same at any width and the keys stay on the words they mark.
 *
 * The screen is an illustration: aria-hidden and data-nosnippet, and in the
 * prerender its words are bars, as on the climb's results page. What it
 * shows is said in the text beside it.
 */
import { Search } from 'lucide-react';
import { PHOTOS, Photo, Credit } from './photos';
import { EXAMPLES, YOU, YOU_SITE } from './examples';

const PRERENDER = typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent);
const EX = EXAMPLES[0];

function Screen({ skeleton }) {
  const bar = (w) => <span className="sc-bar" style={{ width: w }} />;
  return (
    <div className="sc-scr" aria-hidden="true" data-nosnippet="">
      <div className="sc-scr-in">
        <div className="sc-scr-q">
          <Search className="sc-scr-glass" strokeWidth={2} aria-hidden="true" focusable="false" />
          <span>{skeleton ? bar('62%') : EX.query}</span>
        </div>
        <p className="sc-scr-tag">Example</p>
        <div className="sc-scr-you">
          <span className="sc-scr-site">
            <span className="sc-scr-key">a</span>
            <span className="sc-scr-fav">Y</span>
            {skeleton ? bar('58%') : (
              <span className="sc-scr-names">
                <span className="sc-scr-name">{YOU}</span>
                <span className="sc-scr-url">{YOU_SITE} › {EX.after.path}</span>
              </span>
            )}
          </span>
          <span className="sc-scr-title"><span className="sc-scr-key">b</span>{skeleton ? bar('86%') : EX.after.title}</span>
          <span className="sc-scr-desc"><span className="sc-scr-key">c</span>{skeleton ? <>{bar('100%')}{bar('92%')}{bar('64%')}</> : EX.after.desc}</span>
        </div>
        {EX.others.slice(0, 3).map((o, i) => (
          <div className="sc-scr-other" key={`${o.kind}-${i}`}>
            <span className="sc-scr-other-line" />
            <span className="sc-scr-other-kind">{o.kind}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OnPhone() {
  return (
    <section className="sc-sec sc-phone" aria-labelledby="sc-phone-h">
      <div className="sc-frame sc-phone-grid">
        <div className="sc-phone-text">
          <h2 className="sc-h2" id="sc-phone-h">Two lines on a phone</h2>
          <p className="sc-say">
            Whoever searches &ldquo;{EX.query}&rdquo; has a job that needs doing and a phone in their hand.
            They&rsquo;ll read a title and maybe half a description before they tap something.
          </p>
          <p className="sc-say">
            Getting your business to the top of that screen is the SEO. Making those two lines worth tapping is the
            copywriting, so we do the two together.
          </p>
          <dl className="sc-keys">
            <div className="sc-key">
              <dt><span className="sc-key-mark" aria-hidden="true">a</span>The address</dt>
              <dd>Words in it, not a page number. The job and the suburb, if the page is about them.</dd>
            </div>
            <div className="sc-key">
              <dt><span className="sc-key-mark" aria-hidden="true">b</span>The title</dt>
              <dd>The job and the place, in the words people search with, next to your name.</dd>
            </div>
            <div className="sc-key">
              <dt><span className="sc-key-mark" aria-hidden="true">c</span>The description</dt>
              <dd>What you do and where, then the next step, in a sentence or two.</dd>
            </div>
          </dl>
        </div>

        <figure className="sc-phone-fig">
          <div className="sc-phone-plate">
            <Screen skeleton={PRERENDER} />
            <Photo photo={PHOTOS.phone} sizes="(min-width: 1024px) 46vw, (min-width: 640px) 80vw, 100vw" className="sc-phone-photo" />
          </div>
          <figcaption className="sc-cap">
            <span>
              The example listing from the climb, first, on a phone. The search and the listing are made up; the
              phone and the hands are a real photograph.
            </span>
            <Credit photo={PHOTOS.phone} className="sc-credit" />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
