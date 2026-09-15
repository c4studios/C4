import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resolveLiveSlugs } from '@/content/seo/registry';
import useStaticMode from '@/hooks/useStaticMode';
import ArticleSections, { SourceList } from '@/components/seo/ArticleSections';
import SeoBreadcrumbs from '@/components/seo/SeoBreadcrumbs';
import '@/components/seo/article.css';

/** "3 August 2026" — en-AU, spelled out, no ordinal. */
function formatDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${d} ${months[m - 1]} ${y}`;
}

/**
 * Editorial articles.
 *
 * Deliberately does NOT use TemplateShell. That shell is built around
 * PageHero (a per-letter animated masthead sized for service pages) plus
 * full-width sections, a link hub and a CTA — the furniture of a landing
 * page. An essay needs a reading column, and mixing the two is what made
 * the first version read like marketing.
 *
 * The title is a single string rather than hand-broken lines. PageHero
 * splits titles into separate block spans, which renders visually fine but
 * extracts as "designershide their prices" with no word boundary — bad on
 * a page whose headline is the ranking signal. `text-wrap: balance` gives
 * even lines at every viewport without hard-coding the break.
 *
 * Motion is one entrance on the masthead and nothing below it. Scroll
 * reveals on an article hide the next paragraph until you have scrolled to
 * it, which is precisely wrong for a reading surface — and it keeps the
 * prose out of any opacity:0 state a crawler could capture.
 */
export default function ArticleTemplate({ entry, content }) {
  const staticMode = useStaticMode();
  const { hero = {}, sections = [], faqs = [], cta = {} } = content;

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Insights', path: '/insights' },
    { name: entry.name, path: `/${entry.slug}` },
  ];

  const related = resolveLiveSlugs(entry.links?.pillars);
  const published = formatDate(entry.published);
  const updated = entry.updated && entry.updated !== entry.published
    ? formatDate(entry.updated) : null;

  const verified = entry.verified ? formatDate(entry.verified) : null;

  /* "Show working". Any article with a sources ledger gets a control in
     the byline; where the registry also carries a verified date, the
     verification stamp IS that control. Pressed, it lifts the ledger beside
     the prose (a sticky rail from 1280px, a panel under the byline below
     that) so a reader can check a figure as they pass it instead of
     scrolling to the foot and back. The default state is unpressed, which
     is what the prerenderer captures, and the ledger at the foot never
     moves: the control is enhancement, never a gate. */
  const sourceItems = (sections.find((s) => s.kind === 'sources') || {}).items || [];
  const canWork = sourceItems.length > 0;
  const sourceCount = sourceItems.length === 1 ? 'One source' : `${sourceItems.length} sources`;
  const [working, setWorking] = useState(false);
  const stampRef = useRef(null);

  useEffect(() => {
    if (!working) return undefined;
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      setWorking(false);
      stampRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [working]);

  useEffect(() => { setWorking(false); }, [entry.slug]);

  const title = Array.isArray(hero.title) ? hero.title.join(' ') : hero.title;
  const dek = hero.intro && hero.intro.length ? hero.intro[0] : entry.dek;

  const enter = staticMode ? {} : {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <article className="article" data-working={working ? '' : undefined} style={{ backgroundColor: 'var(--c4-bg)' }}>
      <header className="article__head">
        <motion.div className="article__col" {...enter}>
          <SeoBreadcrumbs crumbs={crumbs} />
          <h1 className="article__title">{title}</h1>
          {dek && <p className="article__dek">{dek}</p>}

          <div className="article__byline">
            <span>Caleb Scott</span>
            {published && (
              <>
                <span className="sep" aria-hidden="true">·</span>
                <time dateTime={entry.published}>{published}</time>
              </>
            )}
            {updated && (
              <>
                <span className="sep" aria-hidden="true">·</span>
                <span>Updated {updated}</span>
              </>
            )}
            {entry.readMinutes && (
              <>
                <span className="sep" aria-hidden="true">·</span>
                <span>{entry.readMinutes} min read</span>
              </>
            )}
            {/* Opt-in per article. Only renders where the registry carries a
                `verified` date, so the stamp can never appear on a page whose
                figures nobody has actually re-checked at the source. That
                restraint is the only thing that makes it worth printing. */}
            {canWork ? (
              <button
                type="button"
                ref={stampRef}
                className={verified
                  ? 'article__verified article__verified--btn'
                  : 'article__verified article__verified--btn article__verified--plain'}
                aria-pressed={working}
                aria-controls={working ? 'article-working' : undefined}
                aria-describedby="article-working-hint"
                onClick={() => setWorking((w) => !w)}
              >
                {verified ? (
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2.5 8.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2.5 3.5h11M2.5 8h11M2.5 12.5h7" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" />
                  </svg>
                )}
                <span>
                  {verified
                    ? <>Figures verified <b>{verified}</b></>
                    : <>{sourceCount}, <b>read at the document</b></>}
                </span>
                <span className="article__verified-act" aria-hidden="true">
                  {working ? 'Hide working' : 'Show working'}
                </span>
              </button>
            ) : verified ? (
              <span className="article__verified">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2.5 8.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Figures verified <b>{verified}</b></span>
              </span>
            ) : null}
            {canWork && (
              <span id="article-working-hint" className="article__sr">
                Shows the sources this article was checked against, beside the text.
              </span>
            )}
          </div>
        </motion.div>
      </header>

      <div className="article__body">
        {/* Rendered only while open, so the prerendered HTML carries the
            ledger once (at the foot) and the rail is never hidden markup. */}
        {canWork && working && (
          <aside
            id="article-working"
            className="article__working"
            aria-label="The working: sources for this article"
          >
            <div className="article__working-in">
              <p className="article__working-head">The working</p>
              <p className="article__working-note">
                {sourceCount}, each read at the document.
                {verified ? ` Figures verified ${verified}.` : ''}
              </p>
              <SourceList items={sourceItems} compact />
              <a className="article__working-jump" href="#article-sources">
                The full ledger sits at the foot of the article
              </a>
            </div>
          </aside>
        )}
        <ArticleSections sections={sections} />

        {faqs.length > 0 && (
          <div className="article__col">
            <h2>Common questions</h2>
            {/* Open, not an accordion. The answers are short and a reader
                mid-article should not have to click to keep reading. */}
            <dl className="article__faq">
              {faqs.map((f, i) => (
                <React.Fragment key={i}>
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        )}
      </div>

      <footer className="article__foot">
        <div className="article__col">
          {related.length > 0 && (
            <>
              <h2 className="article__blockhead">Related reading</h2>
              <div className="article__next">
                {related.map((r) => (
                  <Link key={r.slug} to={`/${r.slug}`}>{r.name}</Link>
                ))}
              </div>
            </>
          )}

          {cta.heading && (
            <div style={{ marginTop: 'calc(var(--rhythm) * 1.6)' }}>
              <h2>{cta.heading}</h2>
              {cta.text && <p>{cta.text}</p>}
              <div className="article__next" style={{ marginTop: '1.2rem' }}>
                <Link to="/start">Start a project</Link>
              </div>
            </div>
          )}
        </div>
      </footer>
    </article>
  );
}
