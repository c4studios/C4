import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/schema';
import { liveArticles } from '@/content/seo/registry';
import { SITE_URL } from '@/lib/seo';
import '@/components/seo/insights.css';

function formatDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${d} ${months[m - 1]} ${y}`;
}

/* The ledger line: date, length and, where the registry carries one, the
   verification stamp. The instrument face, sentence case, tabular. */
function Meta({ a }) {
  return (
    <p className="ins-meta">
      <time dateTime={a.published}>{formatDate(a.published)}</time>
      {a.readMinutes && (
        <>
          <span className="sep" aria-hidden="true">·</span>
          <span>{a.readMinutes} min read</span>
        </>
      )}
      {a.verified && (
        <span className="ins-stamp">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.5 8.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Figures verified <b>{formatDate(a.verified)}</b></span>
        </span>
      )}
    </p>
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
 * Redrawn 9 September 2026 as a wall of claims: each piece's dek is its one
 * checkable statement, so the dek is what the index sets large. The newest
 * piece leads. A Read surface: no reveals, no cards, nothing that gates the
 * text behind scrolling or hydration.
 */
export default function Insights() {
  const articles = liveArticles();
  const [lead, ...rest] = articles;

  useDocumentHead({
    title: 'Insights — Writing on AI, Web and Design | C4 Studios',
    description:
      'Practical writing from a working Perth studio: what we tell clients about AI, what websites really cost, and the things the industry would rather not say.',
    path: '/insights',
    jsonLd: [
      localBusinessSchema(),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Insights', path: '/insights' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Insights',
        url: `${SITE_URL}/insights`,
        description: 'Articles from C4 Studios on AI, web and design.',
      },
    ],
  });

  return (
    <div className="ins" style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <header className="ins__head">
        <div className="ins__col ins__col--wide">
          <h1 className="ins__title">Things worth writing down.</h1>
          <p className="ins__intro">
            What we end up explaining to clients often enough that it may as well
            be written down. Mostly about AI, websites and what things actually
            cost. Everything here is free to read and free to disagree with.
          </p>
          <p className="ins__key">
            <span>{articles.length} {articles.length === 1 ? 'article' : 'articles'}</span>
            <span className="sep" aria-hidden="true">·</span>
            <span>Newest first</span>
            <span className="sep" aria-hidden="true">·</span>
            <span>Free to read</span>
          </p>
        </div>
      </header>

      {!lead && (
        <div className="ins__col" style={{ paddingBlock: '3rem 6rem' }}>
          <p className="ins__empty">First pieces are being written. Check back shortly.</p>
        </div>
      )}

      {lead && (
        <section className="ins__lead" aria-labelledby="ins-lead-title">
          <div className="ins__col ins__col--wide">
            <p className="ins__lead-dek">{lead.dek}</p>
            <h2 id="ins-lead-title" className="ins__lead-title">
              <Link to={`/${lead.slug}`}>{lead.name}</Link>
            </h2>
            <Meta a={lead} />
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="ins__list-wrap" aria-label="Earlier articles">
          <div className="ins__col ins__col--wide">
            <ol className="ins__list">
              {rest.map((a) => (
                <li key={a.slug} className="ins__item">
                  <p className="ins__dek">{a.dek}</p>
                  <h2 className="ins__name">
                    <Link to={`/${a.slug}`}>{a.name}</Link>
                  </h2>
                  <Meta a={a} />
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </div>
  );
}
