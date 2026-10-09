/*
 * /logo-design after the identity: the prices, how a job runs, who owns the
 * result, and the close.
 *
 * Every price, package name and feature line is read from src/data/pricing.js
 * (the logo packages, the Branding add-on and logoTimeline); nothing is typed
 * in here. The ownership answer is imported from the guide it's published in
 * (src/content/seo/pages/branding-perth.js), so it can't drift from it.
 */
import { ArrowRight } from 'lucide-react';
import { Link } from '@/components/c4/SiteLink';
import { brandingPackages, webDesignAddOns, GST_NOTE, logoTimeline } from '@/data/pricing';
import { createPageUrl } from '@/utils';
import guide from '@/content/seo/pages/branding-perth';

export const START = createPageUrl('StartProject');
export const money = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;
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
const CONCEPT_RANGE = CONCEPTS.length ? [Math.min(...CONCEPTS), Math.max(...CONCEPTS)] : null;

/* B612 is monospaced, so its comma takes a full cell and "$1,200" reads as
   "$1, 200" at display size. The comma is tucked in, as on the SEO page. */
const tight = (figure) => figure.split(',').map((part, i) => (
  i === 0 ? part : <span key={i}><span className="ld-comma">,</span>{part}</span>
));

/* ── What it costs: the ledger, on proof stock ───────────────────────── */

const GROUPS = [
  { key: 'new', title: 'A new logo', keys: ['brand-core', 'logo-only'] },
  { key: 'have', title: 'A logo you already have', keys: ['logo-rebuild'] },
  { key: 'kit', title: 'The logo and the kit around it', keys: ['brand-essentials', 'full-brand'] },
];

function PriceRow({ p }) {
  const spoken = /\+$/.test(p.priceLabel) ? `From ${p.priceLabel.replace(/\+$/, '')}` : p.priceLabel;
  return (
    <article className="ld-row" id={`price-${p.key}`} aria-labelledby={`price-${p.key}-h`}>
      <div className="ld-row-head">
        <h4 className="ld-row-name" id={`price-${p.key}-h`}>{p.name}</h4>
        <p className="ld-row-price" data-fig="">
          <span className="sr-only">{spoken}</span>
          <span aria-hidden="true">{tight(p.priceLabel)}</span>
        </p>
      </div>
      <div className="ld-row-body">
        {p.description ? <p className="ld-row-desc">{p.description}</p> : null}
        <ul className="ld-list">
          {(p.features || []).map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
      <Link to={`${START}?service=logo_design&package=${p.key}`} className="ld-row-go">
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
    <section className="ld-sec ld-prices" id="prices" aria-labelledby="ld-prices-h">
      <div className="ld-frame">
        <div className="ld-prices-head">
          <h2 className="ld-h2" id="ld-prices-h">What it costs</h2>
          <p className="ld-say">
            {`${cap(word(PRICED.length))} packages, from a single logo at ${money(FROM)}${FULL && typeof FULL.price === 'number' ? ` to a full identity from ${money(FULL.price)}` : ''}.${concepts}`}
          </p>
        </div>
        <div className="ld-ledger">
          {groups.map((g) => (
            <div className="ld-ledger-group" key={g.key} role="group" aria-labelledby={`ld-g-${g.key}`}>
              <h3 className="ld-ledger-h" id={`ld-g-${g.key}`}>{g.title}</h3>
              {g.items.map((p) => <PriceRow key={p.key} p={p} />)}
            </div>
          ))}
          {ADDON ? (
            <div className="ld-ledger-group ld-ledger-addon" role="group" aria-labelledby="ld-g-web">
              <h3 className="ld-ledger-h" id="ld-g-web">With a website</h3>
              <p className="ld-addon">
                Having a website built as well? Branding can be added to the build for{' '}
                <b className="ld-addon-fig" data-fig="">{money(ADDON.price)}</b>.{' '}
                {ADDON.detail ? <>{ADDON.detail}{' '}</> : null}
                <Link to="/ServiceWeb">See the web packages</Link>
              </p>
            </div>
          ) : null}
        </div>
        <p className="ld-fine-print">{GST_NOTE}</p>
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
    <section className="ld-sec ld-process" aria-labelledby="ld-process-h">
      <div className="ld-frame ld-process-grid">
        <div>
          <h2 className="ld-h2" id="ld-process-h">How a logo job runs</h2>
          <ol className="ld-steps-list">
            {steps.map((s, i) => (
              <li key={s.title} className="ld-runstep">
                <span className="ld-runstep-n" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="ld-runstep-h">{s.title}</h3>
                  <p className="ld-runstep-say">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="ld-more">
            The long version, including when a {money(FROM)} logo is enough:{' '}
            <Link to="/branding-perth/">Logo Design Perth</Link>.
          </p>
        </div>
        {OWN ? (
          <figure className="ld-proof">
            <span className="ld-proof-rule" aria-hidden="true" />
            <p className="ld-proof-q">{OWN.q}</p>
            <blockquote className="ld-proof-a"><p>{OWN.a}</p></blockquote>
            <figcaption className="ld-proof-src">
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
    <section className="ld-close" aria-labelledby="ld-close-h">
      <div className="ld-frame">
        <h2 className="ld-close-h" id="ld-close-h">Where will your logo be used?</h2>
        <p className="ld-close-say">
          Tell us what you do and where the logo has to work. We&rsquo;ll come back with the package that fits.
        </p>
        <Link to={`${START}?service=logo_design`} className="ld-start">Start a logo brief</Link>
        <p className="ld-fine">{GST_NOTE}</p>
      </div>
    </section>
  );
}
