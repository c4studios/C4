import React from 'react';
import { Link } from '@/components/c4/SiteLink';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, entitySchemas } from '@/lib/schema';
import { liveArticles } from '@/content/seo/registry';
import ArticlePhoto from '@/components/seo/ArticlePhoto';
import { SITE_URL } from '@/lib/seo';
import '@/components/seo/insights.css';

function formatDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${d} ${months[m - 1]} ${y}`;
}

/* The ledger line: date and length, then, where the registry carries one,
   the verification stamp on a line of its own. The instrument face, sentence
   case, tabular. The dots between items are drawn by the stylesheet so a
   wrapped line never starts or ends on one. */
function Meta({ a, className = '' }) {
  return (
    <div className={`ins-meta ${className}`}>
      <p className="ins-dots">
        <time dateTime={a.published}>{formatDate(a.published)}</time>
        {a.readMinutes && <span>{a.readMinutes} min read</span>}
      </p>
      {a.verified && (
        <p className="ins-stamp">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.5 8.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Figures verified <b>{formatDate(a.verified)}</b></span>
        </p>
      )}
    </div>
  );
}

/* The photo as a print on the bench, with the same alt text it carries in
   the article (it shows something the title doesn't say). The whole block is
   one click target through the title's link. */
function Print({ a, sizes, eager = false, className = '' }) {
  if (!a.photo) return null;
  return (
    <div className={`ins-print ${className}`}>
      <ArticlePhoto k={a.photo} sizes={sizes} eager={eager} />
    </div>
  );
}

/**
 * /insights — the articles index.
 *
 * Reads straight from the SEO registry, so an article appearing here and an
 * article having a route, a prerendered file and a sitemap entry are the
 * same fact. The articles live at flat root slugs, not under /insights/, so
 * this page is a hub rather than a path segment.
 *
 * 9 September 2026: a wall of claims, each piece's dek set large.
 *
 * 15 October 2026: the claims got pictures and the page got a rhythm. Until
 * then it listed only `type: 'article'`, which was one piece, while seven
 * question-led pieces (type 'comparison') sat outside it; liveArticles() now
 * returns both. The newest piece leads as a spread, its photograph beside its
 * dek at display size. The next two sit as an uneven pair, the second set
 * lower and narrower, so they read as two prints laid on the bench rather
 * than a row of cards. Everything older runs as a ruled ledger with a small
 * print at the end of each line. The dek is still the line set large; it now
 * states one specific, checkable thing from the piece, and the title under it
 * carries the phrase people search for.
 *
 * A Read surface: no reveals, nothing gated behind scrolling or hydration.
 * The lead photo loads eagerly; every other one is lazy and its frame is
 * sized before it arrives.
 */
export default function Insights() {
  const articles = liveArticles();
  const [lead, ...others] = articles;
  const pair = others.slice(0, 2);
  const rest = others.slice(2);

  useDocumentHead({
    title: 'Insights — Writing on Web and Design | C4 Studios',
    description:
      'Practical writing from a working Perth studio: what websites really cost, and the things the industry would rather not say.',
    path: '/insights',
    jsonLd: [
      ...entitySchemas(),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Insights', path: '/insights' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Insights',
        url: `${SITE_URL}/insights/`,
        description: 'Articles from C4 Studios on web and design.',
        hasPart: articles.map((a) => ({
          '@type': 'Article',
          headline: a.name,
          url: `${SITE_URL}/${a.slug}/`,
          datePublished: a.published,
        })),
      },
    ],
  });

  return (
    <div className="ins" style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <header className="ins__head">
        <div className="ins__wrap">
          <h1 className="ins__title">Things worth writing down.</h1>
          <p className="ins__intro">
            What we end up explaining to clients often enough that it may as well
            be written down. Mostly about websites and what things actually
            cost. Everything here is free to read and free to disagree with.
          </p>
          <div className="ins__key">
            <p className="ins-dots">
              <span>{articles.length} {articles.length === 1 ? 'article' : 'articles'}</span>
              <span>Newest first</span>
              <span>Free to read</span>
            </p>
          </div>
        </div>
      </header>

      {!lead && (
        <div className="ins__wrap" style={{ paddingBlock: '3rem 6rem' }}>
          <p className="ins__empty">First pieces are being written. Check back shortly.</p>
        </div>
      )}

      {lead && (
        <section className="ins__lead" aria-labelledby="ins-lead-title">
          <article className="ins__wrap ins-spread ins-item">
            <Print a={lead} eager sizes="(min-width: 60rem) 44rem, calc(100vw - 3rem)" className="ins-spread__print" />
            <div className="ins-spread__text">
              <p className="ins-spread__dek">{lead.dek}</p>
              <h2 id="ins-lead-title" className="ins-spread__title">
                <Link className="ins-link" to={`/${lead.slug}`}>{lead.name}</Link>
              </h2>
              <Meta a={lead} />
            </div>
          </article>
        </section>
      )}

      {pair.length > 0 && (
        <section className="ins__pair" aria-label="Recent articles">
          <div className="ins__wrap ins-pair">
            {pair.map((a, i) => (
              <article key={a.slug} className={`ins-pair__item ins-item ins-pair__item--${i === 0 ? 'wide' : 'narrow'}`}>
                <Print
                  a={a}
                  sizes={i === 0
                    ? '(min-width: 60rem) 40rem, calc(100vw - 3rem)'
                    : '(min-width: 60rem) 28rem, calc(100vw - 3rem)'}
                />
                <p className="ins-pair__dek">{a.dek}</p>
                <h2 className="ins-pair__title">
                  <Link className="ins-link" to={`/${a.slug}`}>{a.name}</Link>
                </h2>
                <Meta a={a} />
              </article>
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="ins__ledger" aria-label="Earlier articles">
          <div className="ins__wrap">
            <ol className="ins-ledger">
              {rest.map((a) => (
                <li key={a.slug} className="ins-ledger__row ins-item">
                  <div className="ins-ledger__text">
                    <p className="ins-ledger__dek">{a.dek}</p>
                    <h2 className="ins-ledger__title">
                      <Link className="ins-link" to={`/${a.slug}`}>{a.name}</Link>
                    </h2>
                  </div>
                  <Print a={a} sizes="(min-width: 48rem) 12rem, 6.5rem" className="ins-ledger__print" />
                  <Meta a={a} className="ins-ledger__meta" />
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </div>
  );
}
