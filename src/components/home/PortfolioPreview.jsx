import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { getAllCaseStudies } from '../portfolio/caseStudyData';
import PortfolioMedia from '../portfolio/PortfolioMedia';

const ease = [0.22, 1, 0.36, 1];

export default function PortfolioPreview() {
  const studies = getAllCaseStudies();
  const featured = studies.find((study) => study.featured) || studies[0];

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-12 flex items-end justify-between md:mb-16"
        >
          <div className="max-w-[540px]">
            <span className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
              Portfolio
            </span>
            <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.035em] leading-[1.1] md:text-[2.2rem]" style={{ color: 'var(--c4-text)' }}>
              Recent work
            </h2>
            <p className="mt-4 text-[13.5px] leading-[1.65] md:text-[14px]" style={{ color: 'var(--c4-text-muted)' }}>
              A closer look at the work and the decisions behind it.
            </p>
          </div>

          <Link
            to={createPageUrl('Portfolio')}
            className="group hidden items-center gap-2 text-[11px] uppercase tracking-[0.13em] font-medium transition-colors duration-300 md:inline-flex"
            style={{ color: 'var(--c4-text-subtle)' }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = 'var(--c4-link-hover)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = 'var(--c4-text-subtle)';
            }}
          >
            See all work
            <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <Link
              to={createPageUrl(`CaseStudy?slug=${featured.slug}`)}
              className="group block overflow-hidden rounded-[3px] transition-shadow duration-500 hover:shadow-lg"
              style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div
                  className="aspect-[16/10] overflow-hidden md:aspect-auto flex items-center justify-center"
                  style={featured.backdropStyle || { backgroundColor: featured.brandColor || 'var(--c4-bg)' }}
                >
                  {featured.cover ? (
                    <img
                      src={featured.cover}
                      alt={`${featured.name} logo`}
                      className="max-h-[55%] max-w-[55%] object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <PortfolioMedia
                      src={featured.thumbnail}
                      alt={featured.name}
                      title={featured.name}
                      message="Visuals pending upload"
                      meta={[...featured.tags.slice(0, 2), ...(featured.year ? [featured.year] : [])]}
                      imageClassName="transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  )}
                </div>

                <div className="flex flex-col justify-between p-7 md:p-10">
                  <div>
                    <span className="text-[9.5px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--c4-text-faint)' }}>
                      Featured
                    </span>
                    <h3 className="mt-2 text-[1.15rem] font-semibold tracking-[-0.02em] leading-[1.15] md:text-[1.35rem]" style={{ color: 'var(--c4-text)' }}>
                      {featured.name}
                    </h3>
                    <p className="mt-3 text-[13px] leading-[1.65] md:text-[13.5px]" style={{ color: 'var(--c4-text-muted)' }}>
                      {featured.oneLiner}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {featured.tags.map((tag) => (
                        <span key={tag} className="rounded-[2px] px-2.5 py-[3px] text-[9px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-text-faint)', backgroundColor: 'var(--c4-tag-bg)' }}>
                          {tag}
                        </span>
                      ))}
                      {featured.year && (
                        <span className="text-[9px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-text-faint)' }}>
                          | {featured.year}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <span
                      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.13em] font-medium transition-colors duration-300"
                      style={{ color: 'var(--c4-text)' }}
                    >
                      View case study
                      <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    {featured.liveUrl && (
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] font-medium"
                        style={{ color: 'var(--c4-text-faint)' }}
                      >
                        Live site
                        <ArrowUpRight size={11} strokeWidth={2} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        <div className="mt-8 md:hidden">
          <Link
            to={createPageUrl('Portfolio')}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.13em] font-medium"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            See all work
            <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
