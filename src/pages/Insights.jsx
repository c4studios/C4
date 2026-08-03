import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/c4/PageHero';
import useDocumentHead from '@/hooks/useDocumentHead';
import useStaticMode from '@/hooks/useStaticMode';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/schema';
import { liveArticles } from '@/content/seo/registry';
import { SITE_URL } from '@/lib/seo';

const ease = [0.22, 1, 0.36, 1];

function formatDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${d} ${months[m - 1]} ${y}`;
}

/**
 * /insights — the index for editorial articles.
 *
 * Reads straight from the SEO registry, so an article appearing here and an
 * article having a route, a prerendered file and a sitemap entry are the same
 * fact. There is no second list to fall out of sync.
 *
 * The articles themselves live at flat root slugs, not under /insights/, so
 * this page is a hub rather than a path segment. See the ARTICLES block in
 * registry.js for why.
 */
export default function Insights() {
  const staticMode = useStaticMode();
  const articles = liveArticles();

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
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <PageHero
        label="Insights"
        titleLines={[<span key="a">Things worth</span>, <span key="b">writing down.</span>]}
      >
        <div className="max-w-[620px]">
          <p className="text-[15px] md:text-[16px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
            What we end up explaining to clients often enough that it may as well
            be written down. Mostly about AI, websites and what things actually
            cost. Everything here is free to read and free to disagree with.
          </p>
        </div>
      </PageHero>

      <section className="pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {articles.length === 0 ? (
            <p className="text-[14px]" style={{ color: 'var(--c4-text-muted)' }}>
              First pieces are being written. Check back shortly.
            </p>
          ) : (
            <ul className="max-w-[840px]">
              {articles.map((a, i) => (
                <motion.li
                  key={a.slug}
                  {...(staticMode ? {} : {
                    initial: { opacity: 0, y: 12 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: '-60px' },
                    transition: { duration: 0.55, delay: i * 0.04, ease },
                  })}
                >
                  <Link
                    to={`/${a.slug}`}
                    className="group block py-8 border-t transition-colors duration-300"
                    style={{ borderColor: 'var(--c4-border)' }}
                  >
                    <div
                      className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-[11px] uppercase tracking-[0.16em]"
                      style={{ color: 'var(--c4-text-subtle)' }}
                    >
                      <time dateTime={a.published}>{formatDate(a.published)}</time>
                      {a.readMinutes && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{a.readMinutes} min read</span>
                        </>
                      )}
                    </div>

                    <h2
                      className="text-[1.35rem] md:text-[1.7rem] font-semibold tracking-[-0.025em] leading-[1.2] mb-2 inline-flex items-start gap-2"
                      style={{ color: 'var(--c4-text)' }}
                    >
                      {a.name}
                      <ArrowUpRight
                        size={18}
                        strokeWidth={2}
                        className="mt-1.5 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-300"
                      />
                    </h2>

                    <p className="text-[14px] leading-[1.7] max-w-[620px]" style={{ color: 'var(--c4-text-muted)' }}>
                      {a.dek}
                    </p>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
