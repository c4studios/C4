/*
 * The rest of /seo-and-copywriting, after the climb: the straight answer
 * about guarantees, the price list, the writing, the questions people ask,
 * and the close.
 *
 * Prices come only from src/data/pricing.js: the SEO packages and the
 * copywriting add-on. Article counts are read from the plans' own feature
 * lists. The guarantee answer, the questions and the cost answer are
 * imported from the article files they live in, so they can't drift from
 * them. Anything else is quoted, and the page says so.
 *
 * Each section owns its screen in its own way: the guarantee is the answer
 * itself, set large across the measure; the prices are a ledger; the
 * writing is a ruled list beside the answer it practises; the close is the
 * red field with your listing lying on it, first.
 */
import { ArrowRight } from 'lucide-react';
import { Link } from '@/components/c4/SiteLink';
import { seoPackages, webDesignAddOns, GST_NOTE } from '@/data/pricing';
import { createPageUrl } from '@/utils';
import seoGuide from '@/content/seo/pages/seo-perth';
import costGuide from '@/content/seo/pages/how-much-does-a-website-cost-perth';
import { FirstSheet } from './Results';
import { EXAMPLES } from './examples';
import { PHOTOS, Photo, Credit } from './photos';

const START = createPageUrl('StartProject');
const money = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
const word = (n) => WORDS[n] || String(n);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const list = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

export const isMonthly = (p) => /\/mo/.test(p.priceLabel || '') || /month/.test(p.priceSuffix || '');
const ONE_OFF = seoPackages.filter((p) => !isMonthly(p));
const MONTHLY = seoPackages.filter(isMonthly);
const priced = (ps) => ps.map((p) => p.price).filter((n) => typeof n === 'number');
export const FROM_ONE_OFF = Math.min(...priced(ONE_OFF));
export const FROM_MONTHLY = Math.min(...priced(MONTHLY));
export const COPY_ADDON = webDesignAddOns.find((a) => a.name === 'Copywriting package');

/* "1 new optimised blog post/month" → 1 */
const postsPerMonth = (p) => {
  for (const f of p.features || []) {
    const m = /^(\d+)\b[^/]*\b(?:posts?|articles?)\b.*month/i.exec(f);
    if (m) return Number(m[1]);
  }
  return 0;
};

const faq = (q) => (seoGuide.faqs || []).find((f) => f.q === q);
const answerOf = (page) => (page.sections.find((s) => s.kind === 'answer') || { body: [] }).body[0];

/* "$249/mo" → { figure: '$249', unit: 'a month' }; a price still to be set
   reads TBC, spelled out for screen readers. */
function priceParts(p) {
  const label = p.priceLabel || '';
  if (p.price == null) return { figure: label || 'TBC', unit: isMonthly(p) ? 'a month' : '', tbc: true };
  if (/\/mo$/.test(label)) return { figure: label.replace(/\/mo$/, ''), unit: 'a month' };
  return { figure: label, unit: '' };
}

/* B612 is monospaced, so its comma takes a full cell and "$1,000" reads as
   "$1, 000" at display size. The comma is tucked in rather than the face
   swapped. */
const tight = (figure) => figure.split(',').map((part, i) => (
  i === 0 ? part : <span key={i}><span className="sc-comma">,</span>{part}</span>
));

/* ── The straight answer ─────────────────────────────────────────────── */

export function Guarantee() {
  const g = faq('Do you guarantee first place on Google?');
  return (
    <section className="sc-sec sc-promise" aria-labelledby="sc-promise-h">
      <div className="sc-frame">
        <div className="sc-promise-head">
          <h2 className="sc-promise-h" id="sc-promise-h">Nobody can promise you first&nbsp;place</h2>
          <p className="sc-promise-say">
            What you just scrolled through takes months in real life, and some searches are much harder to win
            than others. So when people ask us for a guarantee, this is the answer, word for word from our SEO
            guide.
          </p>
        </div>
        {g ? (
          <figure className="sc-proof sc-proof--wide">
            <span className="sc-proof-rule" aria-hidden="true" />
            <p className="sc-proof-q">{g.q}</p>
            <blockquote className="sc-proof-a"><p>{g.a}</p></blockquote>
            <figcaption className="sc-proof-src">
              From <Link to="/seo-perth/">SEO in Perth</Link>, our guide to how we do it
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}

/* ── What it costs ───────────────────────────────────────────────────── */

function PriceRow({ p }) {
  const { figure, unit, tbc } = priceParts(p);
  return (
    <article className="sc-row" id={`price-${p.key}`} aria-labelledby={`price-${p.key}-h`}>
      <div className="sc-row-id">
        <h4 className="sc-row-name" id={`price-${p.key}-h`}>{p.name}</h4>
        {p.description ? <p className="sc-row-desc">{p.description}</p> : null}
      </div>
      <ul className="sc-row-list">
        {(p.features || []).map((f) => <li key={f}>{f}</li>)}
      </ul>
      <div className="sc-row-buy">
        <p className="sc-row-price" data-fig="">
          <span className="sr-only">{tbc ? 'Price to be confirmed' : `${figure}${unit ? ` ${unit}` : ''}`}</span>
          <span aria-hidden="true">
            {tbc ? figure : tight(figure)}
            {unit ? <span className="sc-row-unit"> {unit}</span> : null}
          </span>
        </p>
        {p.priceSuffix ? <p className="sc-row-term">{p.priceSuffix}</p> : null}
        <Link to={`${START}?service=seo&package=${p.key}`} className="sc-row-go">
          Start with {p.name}<ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function Prices() {
  const intro = `${cap(word(ONE_OFF.length))} one-off packages fix the foundations. ${cap(word(MONTHLY.length))} monthly plans keep the work going, from ${money(FROM_MONTHLY)} a month, and none of them locks you in past its minimum term.`;
  return (
    <section className="sc-sec sc-prices" id="prices" aria-labelledby="sc-prices-h">
      <div className="sc-frame sc-prices-grid">
        <div className="sc-prices-head">
          <h2 className="sc-h2" id="sc-prices-h">What it costs</h2>
          <p className="sc-prices-say">{intro}</p>
          <p className="sc-fine">{GST_NOTE}</p>
        </div>
        <div className="sc-ledger">
          <div className="sc-ledger-group" aria-labelledby="sc-once-h">
            <h3 className="sc-ledger-h" id="sc-once-h">Once</h3>
            {ONE_OFF.map((p) => <PriceRow key={p.key} p={p} />)}
          </div>
          <div className="sc-ledger-group" aria-labelledby="sc-monthly-h">
            <h3 className="sc-ledger-h" id="sc-monthly-h">Every month</h3>
            {MONTHLY.map((p) => <PriceRow key={p.key} p={p} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── The writing ─────────────────────────────────────────────────────── */

export function Writing() {
  const withPosts = MONTHLY.map((p) => [p, postsPerMonth(p)]).filter(([, n]) => n > 0);
  const articles = withPosts.length
    ? `${list(withPosts.map(([p, n], i) => (i === 0 ? `${cap(word(n))} a month on ${p.name}` : `${word(n)} on ${p.name}`)))}.`
    : 'Included in the monthly plans.';
  const answer = answerOf(costGuide);
  return (
    <section className="sc-sec sc-writing" aria-labelledby="sc-writing-h">
      <div className="sc-frame sc-writing-grid">
        <div className="sc-writing-text">
          <h2 className="sc-h2" id="sc-writing-h">Worth reading</h2>
          <p>
            Words like &ldquo;leading&rdquo; and &ldquo;quality&rdquo; don&rsquo;t tell a reader anything they
            can check, so we leave them out. We write plainly and lead with what you do and where. A claim stays
            in only if it&rsquo;s true.
          </p>
          <ul className="sc-rules">
            <li><b>The answer goes first.</b> <span>If someone asks what it costs, the price is in the opening lines.</span></li>
            <li><b>Every figure has a source.</b> <span>If a number can&rsquo;t be traced, it comes out.</span></li>
            <li><b>Plain words.</b> <span>If a reader has seen a phrase on ten other sites, it comes out.</span></li>
            <li><b>Australian English.</b> <span>Written for the person on the other end of the search.</span></li>
          </ul>
        </div>
        <figure className="sc-markup">
          <div className="sc-markup-plate">
            <Photo photo={PHOTOS.markup} sizes="(min-width: 900px) 40vw, 92vw" />
          </div>
          <figcaption className="sc-cap">
            <Credit photo={PHOTOS.markup} />
          </figcaption>
        </figure>
      </div>
      <div className="sc-frame sc-writing-grid sc-writing-foot">
        <div className="sc-writing-answer">
          {answer ? (
            <figure className="sc-proof sc-proof--answer">
              <span className="sc-proof-rule" aria-hidden="true" />
              <p className="sc-proof-q">How much does a website cost in Perth?</p>
              <blockquote className="sc-proof-a"><p>{answer}</p></blockquote>
              <figcaption className="sc-proof-src">
                Our answer, word for word, from{' '}
                <Link to="/how-much-does-a-website-cost-perth/">the page it lives on</Link>, where the number is the first thing you read.
              </figcaption>
            </figure>
          ) : null}
        </div>
        <div className="sc-writing-side">
          <h3 className="sc-h3">What the writing costs</h3>
          <dl className="sc-offers">
            <div className="sc-offer">
              <dt>Website copy</dt>
              <dd>{COPY_ADDON ? `${money(COPY_ADDON.price)}, added to any website build.` : 'Added to any website build.'}</dd>
            </div>
            <div className="sc-offer">
              <dt>Articles</dt>
              <dd>{articles}</dd>
            </div>
            <div className="sc-offer">
              <dt>Anything else</dt>
              <dd>Rewrites, service pages and one-off articles are quoted on the call.</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ── Questions ───────────────────────────────────────────────────────── */

const ASKED = [
  'How long before SEO shows results?',
  'What’s local SEO, and do I need it?',
  'Can I just do SEO myself?',
  'Do you do SEO for sites you didn’t build?',
];

export function Questions() {
  const items = ASKED.map(faq).filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="sc-sec sc-questions" aria-labelledby="sc-questions-h">
      <div className="sc-frame sc-questions-grid">
        <div>
          <h2 className="sc-h2" id="sc-questions-h">Questions people ask us</h2>
          <p className="sc-more">
            The long versions: <Link to="/seo-perth/">SEO in Perth</Link>,{' '}
            <Link to="/ai-search-optimisation-perth/">AI search optimisation</Link> and{' '}
            <Link to="/do-small-businesses-need-seo/">do small businesses need SEO?</Link>{' '}
            Or <Link to="/insights">every article we&rsquo;ve written</Link>.
          </p>
        </div>
        <div className="sc-qa">
          {items.map((f) => (
            <details key={f.q} className="sc-qa-item">
              <summary>
                <span>{f.q}</span>
                <span className="sc-qa-mark" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── The close ───────────────────────────────────────────────────────── */

const PRERENDER = typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent);

export function Close() {
  return (
    <section className="sc-close" aria-labelledby="sc-close-h">
      <div className="sc-frame sc-close-grid">
        <div className="sc-close-text">
          <h2 className="sc-close-h" id="sc-close-h">Start with what you&rsquo;ve got.</h2>
          <p className="sc-close-say">
            Send the address of your site, or describe the page you wish you had. We&rsquo;ll tell you what&rsquo;s
            worth fixing first, and what it costs.
          </p>
          <Link to={`${START}?service=seo`} className="sc-start">Start a project</Link>
          <p className="sc-fine sc-fine--onred">{GST_NOTE}</p>
        </div>
        {/* the climb, finished: the example listing alone, first */}
        <div className="sc-close-sheet">
          <FirstSheet ex={EXAMPLES[0]} skeleton={PRERENDER} />
        </div>
      </div>
    </section>
  );
}
