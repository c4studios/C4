/*
 * The sections every layout of /seo-and-copywriting shares: SEO with its
 * rate card, copywriting with what it costs and how it's written, a short
 * reading list (the room layout has the shelf in its place), and the close.
 *
 * Prices come only from src/data/pricing.js: the four SEO packages and the
 * $500 copywriting add-on. Articles are counted from the SEO plans' own
 * feature lists. Anything else is quoted, and the page says so (Caleb,
 * 2 Oct 2026: publish only what's published).
 */
import { Link } from '@/components/c4/SiteLink';
import { seoPackages, webDesignAddOns, GST_NOTE } from '@/data/pricing';
import { createPageUrl } from '@/utils';

const money = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;
const COPY_ADDON = webDesignAddOns.find((a) => a.name === 'Copywriting package');
const GROWTH = seoPackages.find((p) => p.key === 'growth');
const DOMINATE = seoPackages.find((p) => p.key === 'dominate');

export function Found() {
  return (
    <section className="sc-sec sc-found" aria-labelledby="sc-found-h">
      <div className="sc-frame sc-split">
        <div className="sc-split-text">
          <h2 className="sc-h2" id="sc-found-h">Getting found</h2>
          <p>
            Google, and the AI tools people now ask instead, start with the same two checks: can they read
            your site, and can they trust what it says. That&rsquo;s the technical half. The other half is
            pages for the things people actually search, with the answer near the top.
          </p>
          <p>The one-off packages are just that. The monthly plans have a minimum term, shown with each price.</p>
          <p className="sc-more">
            The long versions: <Link to="/seo-perth/">SEO in Perth</Link> and{' '}
            <Link to="/ai-search-optimisation-perth/">AI search optimisation</Link>.
          </p>
        </div>
        <div className="sc-rate" role="list" aria-label="SEO packages">
          {seoPackages.map((p) => (
            <article className="sc-rate-row" role="listitem" key={p.key}>
              <div className="sc-rate-head">
                <h3 className="sc-rate-name">{p.name}</h3>
                <p className="sc-rate-price">
                  {p.priceLabel}
                  {p.priceSuffix ? <span className="sc-rate-term">{p.priceSuffix}</span> : null}
                </p>
              </div>
              <div className="sc-rate-body">
                {p.description ? <p className="sc-rate-desc">{p.description}</p> : null}
                <ul className="sc-rate-list">
                  {(p.features || []).map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Read() {
  return (
    <section className="sc-sec sc-read" aria-labelledby="sc-read-h">
      <div className="sc-frame sc-split">
        <div className="sc-split-text">
          <h2 className="sc-h2" id="sc-read-h">Worth reading</h2>
          <p>
            Most small-business sites lose people in the first paragraph, on words like &ldquo;leading&rdquo;
            and &ldquo;quality&rdquo; that every competitor uses too. We write plainly and lead with what you
            do and where. A claim stays in only if it&rsquo;s true.
          </p>
          <dl className="sc-offers">
            <div className="sc-offer">
              <dt>Website copy</dt>
              <dd>{COPY_ADDON ? `${money(COPY_ADDON.price)}, added to any website build.` : 'Added to any website build.'}</dd>
            </div>
            <div className="sc-offer">
              <dt>Articles</dt>
              <dd>
                Two a month on SEO {GROWTH?.name} ({GROWTH?.priceLabel}). Four a month on {DOMINATE?.name} ({DOMINATE?.priceLabel}).
              </dd>
            </div>
            <div className="sc-offer">
              <dt>Anything else</dt>
              <dd>Rewrites, service pages and one-off articles are quoted on the call.</dd>
            </div>
          </dl>
        </div>
        <div className="sc-rules-wrap">
          <h3 className="sc-h3">How the writing works</h3>
          <ul className="sc-rules">
            <li><b>The answer goes first.</b> If someone asks what it costs, the price is in the opening lines.</li>
            <li><b>Every figure has a source.</b> If a number can&rsquo;t be traced, it comes out.</li>
            <li><b>Plain words.</b> No &ldquo;leading&rdquo;, no &ldquo;solutions&rdquo;, nothing a reader has seen on ten other sites.</li>
            <li><b>Australian English.</b> Written for the person on the other end of the search.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

const READING = [
  ['how-much-does-a-website-cost-perth', 'How much does a website cost in Perth?'],
  ['do-small-businesses-need-seo', 'Do small businesses actually need SEO?'],
  ['how-long-does-a-website-take', 'How long does a website take to build?'],
  ['why-web-designers-hide-their-prices', 'Why web designers hide their prices'],
  ['wordpress-vs-nextjs', 'WordPress vs Next.js for business websites'],
  ['ai-detectors-dont-work', 'AI detectors don’t work'],
];

export function ProofList() {
  return (
    <section className="sc-sec sc-proof" aria-labelledby="sc-proof-h">
      <div className="sc-frame">
        <h2 className="sc-h2" id="sc-proof-h">Read what we&rsquo;ve written</h2>
        <p className="sc-proof-say">Every guide and article on this site is ours. A few to start with:</p>
        <ul className="sc-proof-list">
          {READING.map(([slug, title]) => (
            <li key={slug}><Link to={`/${slug}`}>{title}</Link></li>
          ))}
        </ul>
        <p className="sc-more"><Link to="/insights">All of them, in Articles</Link></p>
      </div>
    </section>
  );
}

export function Close() {
  return (
    <section className="sc-close" aria-labelledby="sc-close-h">
      <div className="sc-frame">
        <h2 className="sc-close-h" id="sc-close-h">Start with what you&rsquo;ve got.</h2>
        <p className="sc-close-say">
          Send the address of your site, or describe the page you wish you had. We&rsquo;ll tell you what&rsquo;s
          worth fixing first, and what it costs.
        </p>
        <Link to={`${createPageUrl('StartProject')}?service=seo`} className="sc-start">Start a project</Link>
        <p className="sc-fine">{GST_NOTE}</p>
      </div>
    </section>
  );
}
