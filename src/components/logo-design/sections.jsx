/*
 * /logo-design after the opening: the family of sizes, the redraw, the
 * prices, how a job runs, who owns the result, and the close.
 *
 * Every price, package name and feature line is read from src/data/pricing.js
 * (the logo packages and the Branding add-on); nothing is typed in here. The
 * ownership answer is imported from the guide it's published in
 * (src/content/seo/pages/branding-perth.js), so it can't drift from it. The
 * mark shown everywhere is the page's stand-in (mark-data.js), labelled as one.
 */
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/components/c4/SiteLink';
import { brandingPackages, webDesignAddOns, GST_NOTE, logoTimeline } from '@/data/pricing';
import { createPageUrl } from '@/utils';
import guide from '@/content/seo/pages/branding-perth';
import Mark, { roundelPath, lettersPath } from './Mark';
import { MARK, FAVICON_PNG } from './mark-data';
import { SATIN } from './satin-data';

const START = createPageUrl('StartProject');
const money = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const word = (n) => WORDS[n] || String(n);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const PRICED = brandingPackages.filter((p) => typeof p.price === 'number');
export const FROM = Math.min(...PRICED.map((p) => p.price));
const byKey = (k) => brandingPackages.find((p) => p.key === k);
export const REBUILD = byKey('logo-rebuild');
export const FULL = byKey('full-brand');
export const ADDON = webDesignAddOns.find((a) => a.name === 'Branding add-on');
const OWN = (guide.faqs || []).find((f) => f.q === 'Do I own the logo outright?');

/* "2 initial concepts", "Logo design (5 concepts, 4 revisions)" → 2 and 5. */
const CONCEPTS = PRICED
  .flatMap((p) => (p.features || []).map((f) => /(\d+)\s+(?:initial\s+)?concepts?\b/i.exec(f)))
  .filter(Boolean)
  .map((m) => Number(m[1]));
export const CONCEPT_RANGE = CONCEPTS.length ? [Math.min(...CONCEPTS), Math.max(...CONCEPTS)] : null;

/* B612 is monospaced, so its comma takes a full cell and "$1,200" reads as
   "$1, 200" at display size. The comma is tucked in, as on the SEO page. */
const tight = (figure) => figure.split(',').map((part, i) => (
  i === 0 ? part : <span key={i}><span className="lg-comma">,</span>{part}</span>
));

/* ── The family: one logo at every size it's used ────────────────────── */

/* The tiny cut as the 16 x 16 PNG the generator writes: once at its real
   size in the tab, once blown up with every pixel square. */
function Pixels() {
  return (
    <span className="lg-pixels" aria-hidden="true">
      <img src={FAVICON_PNG} width="16" height="16" alt="" />
    </span>
  );
}

/* The short version stitched in white satin: threads laid across each column
   of each letter and turning with it (satin-data.js, generated from the
   mark's outlines), over a darker groove, clipped to the mark's own shape,
   and raised off the cloth by MarkDefs' #lg-thread. */
function Stitched({ version = 'compact' }) {
  const v = MARK[version];
  const s = SATIN[version];
  const id = `lg-satin-${version}`;
  /* the outline is in the page once, and the groove, the clip and the edge
     all point at it */
  return (
    <svg className="lg-stitched" viewBox={`0 0 ${v.w} ${v.h}`} aria-hidden="true" focusable="false">
      <defs>
        <path id={`${id}-shape`} d={`${roundelPath(v.roundel)} ${lettersPath(v)}`} />
        <clipPath id={id} clipPathUnits="userSpaceOnUse"><use href={`#${id}-shape`} clipRule="evenodd" /></clipPath>
      </defs>
      <g filter="url(#lg-thread)">
        <use href={`#${id}-shape`} fillRule="evenodd" fill="#a29e90" />
        <g clipPath={`url(#${id})`} fill="none" strokeWidth={s.thread * 0.86}>
          <path d={s.dark} stroke="#cfcabd" />
          <path d={s.mid} stroke="#e6e2d7" />
          <path d={s.light} stroke="#fbf9f4" />
        </g>
        <use href={`#${id}-shape`} fillRule="evenodd" fill="none" stroke="rgba(10, 14, 26, 0.38)" strokeWidth="2.4" />
      </g>
    </svg>
  );
}

export function Family() {
  return (
    <section className="lg-sec lg-family" aria-labelledby="lg-family-h">
      <div className="lg-frame">
        <div className="lg-split-head">
          <h2 className="lg-h2" id="lg-family-h">From the sign out front to a browser tab</h2>
          <p className="lg-say">
            A logo gets used far smaller than it&rsquo;s drawn, so a good one comes as a small family that steps
            down in size. By the time it&rsquo;s in a browser tab, sixteen pixels across, only the symbol is left,
            and it still has to read.
          </p>
        </div>

        <ol className="lg-sizes">
          <li className="lg-size lg-size--full">
            <div className="lg-cut-piece"><Mark version="horizontal" ink="#151515" className="lg-size-mark" shared /></div>
            <p className="lg-size-say"><b>The full logo.</b> Signs and the top of your website.</p>
          </li>
          <li className="lg-size lg-size--short">
            <div className="lg-cut-piece"><Mark version="compact" ink="#151515" className="lg-size-mark" shared /></div>
            <p className="lg-size-say"><b>The short version.</b> Shirts and business cards.</p>
          </li>
          <li className="lg-size lg-size--tab">
            <div className="lg-tabview">
              <span className="lg-tab" aria-hidden="true">
                <img className="lg-tab-icon" src={FAVICON_PNG} width="16" height="16" alt="" />
                <span className="lg-tab-title">Your Business</span>
                <span className="lg-tab-x" />
              </span>
              <Pixels />
            </div>
            <p className="lg-size-say"><b>The symbol, 16 pixels across.</b> A browser tab, shown actual size and then with every pixel blown up.</p>
          </li>
        </ol>

        <div className="lg-ways" role="list" aria-label="The short version three ways">
          <figure className="lg-way" role="listitem">
            <div className="lg-way-plate"><Mark version="compact" ink="#151515" roundelInk="#f2b705" shared /></div>
            <figcaption>In colour</figcaption>
          </figure>
          <figure className="lg-way" role="listitem">
            <div className="lg-way-plate"><Mark version="compact" ink="#151515" shared /></div>
            <figcaption>In one colour</figcaption>
          </figure>
          <figure className="lg-way" role="listitem">
            <div className="lg-way-plate lg-way-plate--dark lg-way-plate--stitch"><Stitched /></div>
            <figcaption>Reversed out, stitched on a navy work shirt</figcaption>
          </figure>
        </div>
        <p className="lg-fine-print">The mark on this page is a stand-in, drawn for it. It isn&rsquo;t a client&rsquo;s logo.</p>
      </div>
    </section>
  );
}

/* ── The redraw: a logo that's only an image, and the same logo as vector ── */

export function Redraw() {
  const [pos, setPos] = useState(50);
  if (!REBUILD) return null;
  return (
    <section className="lg-sec lg-redraw" aria-labelledby="lg-redraw-h">
      <div className="lg-frame lg-redraw-grid">
        <div className="lg-redraw-text">
          <h2 className="lg-h2" id="lg-redraw-h">Already have a logo?</h2>
          <p className="lg-say">
            If it only exists as a small image file, a signwriter can&rsquo;t cut it and an embroiderer can&rsquo;t
            stitch it. Both need vector artwork. {REBUILD.name} redraws the logo you have as true vector, so it stays
            sharp at any size.
          </p>
          <div className="lg-rebuild">
            <p className="lg-rebuild-price" data-fig="">
              <span className="sr-only">{`${REBUILD.name}, ${REBUILD.priceLabel}`}</span>
              <span aria-hidden="true">{tight(REBUILD.priceLabel)}</span>
            </p>
            <ul className="lg-list">
              {(REBUILD.features || []).map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Link to={`${START}?service=logo_design&package=${REBUILD.key}`} className="lg-row-go">
              Start with {REBUILD.name}<ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <figure className="lg-ba">
          <div className="lg-ba-frame" style={{ '--pos': `${pos}%` }}>
            <div className="lg-ba-after"><Mark version="horizontal" ink="#151515" pad={40} shared /></div>
            <div className="lg-ba-before">
              <img src="/logo-art/as-an-image.jpg" width="200" height="31" alt="" decoding="async" loading="lazy" />
            </div>
            <span className="lg-ba-tag lg-ba-tag--before" aria-hidden="true">An image file</span>
            <span className="lg-ba-tag lg-ba-tag--after" aria-hidden="true">Redrawn as vector</span>
            <input
              className="lg-ba-range"
              type="range"
              min="0"
              max="100"
              step="1"
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Drag between the logo as a small image file and the same logo redrawn as vector"
              aria-valuetext={`${pos}% image file, ${100 - pos}% vector`}
            />
            <span className="lg-ba-seam" aria-hidden="true"><span className="lg-ba-grip" /></span>
          </div>
          <figcaption className="lg-ba-cap">
            The stand-in again. On the left it&rsquo;s a 200-pixel image blown up to this size; on the right, the
            same logo drawn as vector.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ── What it costs: the ledger, on proof stock ───────────────────────── */

const GROUPS = [
  { key: 'new', title: 'A new logo', keys: ['brand-core', 'logo-only'] },
  { key: 'have', title: 'A logo you already have', keys: ['logo-rebuild'] },
  { key: 'kit', title: 'The logo and the kit around it', keys: ['brand-essentials', 'full-brand'] },
];

function PriceRow({ p }) {
  return (
    <article className="lg-row" id={`price-${p.key}`} aria-labelledby={`price-${p.key}-h`}>
      <div className="lg-row-head">
        <h4 className="lg-row-name" id={`price-${p.key}-h`}>{p.name}</h4>
        <p className="lg-row-price" data-fig="">
          <span className="sr-only">{/\+$/.test(p.priceLabel) ? `From ${p.priceLabel.replace(/\+$/, '')}` : p.priceLabel}</span>
          <span aria-hidden="true">{tight(p.priceLabel)}</span>
        </p>
      </div>
      <div className="lg-row-body">
        {p.description ? <p className="lg-row-desc">{p.description}</p> : null}
        <ul className="lg-list">
          {(p.features || []).map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
      <Link to={`${START}?service=logo_design&package=${p.key}`} className="lg-row-go">
        Start with {p.name}<ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
      </Link>
    </article>
  );
}

export function Prices() {
  const placed = new Set(GROUPS.flatMap((g) => g.keys));
  const groups = GROUPS
    .map((g) => ({ ...g, items: g.keys.map(byKey).filter((p) => p && typeof p.price === 'number') }))
    .filter((g) => g.items.length);
  /* a package added to pricing.js later still shows, at the end */
  const rest = PRICED.filter((p) => !placed.has(p.key));
  if (rest.length) groups.push({ key: 'more', title: 'Also available', items: rest });
  const concepts = CONCEPT_RANGE
    ? ` Each new logo comes with a set number of concepts, from ${word(CONCEPT_RANGE[0])} to ${word(CONCEPT_RANGE[1])}, and set revision rounds, so feedback has a clear place to land.`
    : '';
  return (
    <section className="lg-sec lg-prices" id="prices" aria-labelledby="lg-prices-h">
      <div className="lg-frame">
        <div className="lg-split-head">
          <h2 className="lg-h2" id="lg-prices-h">What it costs</h2>
          <p className="lg-say">
            {`${cap(word(PRICED.length))} packages, from a single logo at ${money(FROM)}${FULL && typeof FULL.price === 'number' ? ` to a full identity from ${money(FULL.price)}` : ''}.${concepts}`}
          </p>
        </div>
        <div className="lg-ledger">
          {groups.map((g) => (
            <div className="lg-ledger-group" key={g.key} aria-labelledby={`lg-g-${g.key}`}>
              <h3 className="lg-ledger-h" id={`lg-g-${g.key}`}>{g.title}</h3>
              {g.items.map((p) => <PriceRow key={p.key} p={p} />)}
            </div>
          ))}
          {ADDON ? (
            <div className="lg-ledger-group lg-ledger-addon">
              <h3 className="lg-ledger-h">With a website</h3>
              <p className="lg-addon">
                Having a website built as well? Branding can be added to the build for{' '}
                <b className="lg-addon-fig" data-fig="">{money(ADDON.price)}</b>.{' '}
                {ADDON.detail ? <>{ADDON.detail}{' '}</> : null}
                <Link to="/ServiceWeb">See the web packages</Link>
              </p>
            </div>
          ) : null}
        </div>
        <p className="lg-fine-print">{GST_NOTE}</p>
      </div>
    </section>
  );
}

/* ── How a job runs, and who owns the result ─────────────────────────── */

export function Process() {
  const range = CONCEPT_RANGE ? `${cap(word(CONCEPT_RANGE[0]))} to ${word(CONCEPT_RANGE[1])} directions, depending on the package, and each one is its own idea.` : 'Different directions, each its own idea.';
  const steps = [
    { title: 'The brief', text: 'A short questionnaire and a call about who you serve and who you’re up against.' },
    { title: 'Concepts', text: range },
    { title: 'Refining', text: 'You choose one, and we work your feedback through the revision rounds in your package.' },
    { title: 'The hand-over', text: `Every file arrives together, with your colours, and the type and guidelines in the bigger packages. Most logo jobs take ${logoTimeline} from the brief to here.` },
  ];
  return (
    <section className="lg-sec lg-process" aria-labelledby="lg-process-h">
      <div className="lg-frame lg-process-grid">
        <div>
          <h2 className="lg-h2" id="lg-process-h">How a logo job runs</h2>
          <ol className="lg-steps">
            {steps.map((s, i) => (
              <li key={s.title} className="lg-step">
                <span className="lg-step-n" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="lg-step-h">{s.title}</h3>
                  <p className="lg-step-say">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="lg-more">
            The long version, including when a {money(FROM)} logo is enough:{' '}
            <Link to="/branding-perth/">Logo Design Perth</Link>.
          </p>
        </div>
        {OWN ? (
          <figure className="lg-proof">
            <span className="lg-proof-rule" aria-hidden="true" />
            <p className="lg-proof-q">{OWN.q}</p>
            <blockquote className="lg-proof-a"><p>{OWN.a}</p></blockquote>
            <figcaption className="lg-proof-src">
              Word for word from <Link to="/branding-perth/">Logo Design Perth</Link>, our guide to how we price and run logo work.
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}

/* ── The close: the page's one red field ─────────────────────────────── */

export function Close() {
  return (
    <section className="lg-close" aria-labelledby="lg-close-h">
      <div className="lg-frame">
        <h2 className="lg-close-h" id="lg-close-h">Start with the name.</h2>
        <p className="lg-close-say">
          Tell us what you do and where the logo will be used. We&rsquo;ll come back with the package that fits.
        </p>
        <Link to={`${START}?service=logo_design`} className="lg-start">Start a logo brief</Link>
        <p className="lg-fine">{GST_NOTE}</p>
      </div>
    </section>
  );
}
