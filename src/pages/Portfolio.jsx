import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PortfolioHero from '../components/portfolio/PortfolioHero';
import PortfolioFilters from '../components/portfolio/PortfolioFilters';
import PortfolioSortMenu from '../components/portfolio/PortfolioSortMenu';
import { getAllCaseStudies } from '../components/portfolio/caseStudyData';
import { FeaturedCardSkeleton } from '../components/portfolio/PortfolioCardSkeleton';
import PortfolioMedia from '../components/portfolio/PortfolioMedia';

const ease = [0.22, 1, 0.36, 1];

function sortStudies(studies, sortKey) {
  const sorted = [...studies];

  switch (sortKey) {
    case 'newest':
      return sorted.sort((a, b) => (b.year || '0').localeCompare(a.year || '0'));
    case 'oldest':
      return sorted.sort((a, b) => (a.year || '9999').localeCompare(b.year || '9999'));
    case 'budget_high':
      return sorted.sort((a, b) => (b.budgetOrder || 0) - (a.budgetOrder || 0));
    case 'budget_low':
      return sorted.sort((a, b) => (a.budgetOrder || 0) - (b.budgetOrder || 0));
    case 'name_az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'featured':
    default:
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}

function FeaturedCard({ study, index }) {
  const previews = (study.screenshots || []).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
    >
      <Link to={createPageUrl(`CaseStudy?slug=${study.slug}`)} className="group block">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-3 md:gap-4">
          {/* Cover — logo wallpaper */}
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-[2px] flex items-center justify-center"
            style={{ backgroundColor: study.brandColor || 'var(--c4-bg-alt)' }}
          >
            {study.cover ? (
              <img
                src={study.cover}
                alt={`${study.name} logo`}
                className="max-h-[60%] max-w-[60%] object-contain transition-transform duration-700 group-hover:scale-[1.05]"
              />
            ) : (
              <PortfolioMedia
                src={study.thumbnail}
                alt={study.name}
                title={study.name}
                message="Visuals pending upload"
                meta={[...study.tags.slice(0, 2), ...(study.year ? [study.year] : [])]}
                imageClassName="transition-transform duration-700 group-hover:scale-[1.03]"
              />
            )}
            <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full opacity-0 scale-75 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 md:bottom-5 md:right-5" style={{ backgroundColor: 'var(--c4-text)' }}>
              <ArrowUpRight size={15} strokeWidth={2} style={{ color: 'var(--c4-bg)' }} />
            </div>
          </div>

          {/* Screenshot previews sidebar — desktop only */}
          {previews.length > 0 && (
            <div className="hidden md:flex flex-col gap-3">
              {previews.map((shot, i) => (
                <div key={i} className="flex-1 overflow-hidden rounded-[2px]" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
                  <img
                    src={shot.url}
                    alt={shot.caption || `${study.name} preview ${i + 1}`}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
          <div>
            <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em] transition-colors duration-300 md:text-[1.2rem]" style={{ color: 'var(--c4-text)' }}>
              {study.name}
            </h3>
            <p className="mt-1 max-w-[520px] text-[13px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>
              {study.oneLiner}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            {study.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-text-faint)' }}>
                {tag}
              </span>
            ))}
            {study.year && (
              <>
                <span className="h-2.5 w-px" style={{ backgroundColor: 'var(--c4-border)' }} />
                <span className="text-[10px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-text-faint)' }}>
                  {study.year}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4">
          <span className="text-[10.5px]" style={{ color: 'var(--c4-text-subtle)' }}>
            {study.role}
          </span>
          <span className="text-[10.5px] font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ color: 'var(--c4-accent)' }}>
            View case study {'->'}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function ProjectCard({ study, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
    >
      <Link to={createPageUrl(`CaseStudy?slug=${study.slug}`)} className="group block">
        <div
          className="relative aspect-[16/10] overflow-hidden rounded-[2px] flex items-center justify-center"
          style={{ backgroundColor: study.brandColor || 'var(--c4-bg-alt)' }}
        >
          {study.cover ? (
            <img
              src={study.cover}
              alt={`${study.name} logo`}
              className="max-h-[55%] max-w-[55%] object-contain transition-transform duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <PortfolioMedia
              src={study.thumbnail}
              alt={study.name}
              title={study.name}
              message="Visuals pending upload"
              meta={[...study.tags.slice(0, 1), ...(study.year ? [study.year] : [])]}
              compact
              imageClassName="transition-transform duration-700 group-hover:scale-[1.03]"
            />
          )}
          <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full opacity-0 scale-75 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" style={{ backgroundColor: 'var(--c4-text)' }}>
            <ArrowUpRight size={13} strokeWidth={2} style={{ color: 'var(--c4-bg)' }} />
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex items-center gap-2">
            {study.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[9.5px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-text-faint)' }}>
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-300" style={{ color: 'var(--c4-text)' }}>
            {study.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-[1.5]" style={{ color: 'var(--c4-text-subtle)' }}>
            {study.oneLiner}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);
  const allStudies = getAllCaseStudies();

  useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeoutId);
  }, []);

  const filtered = useMemo(() => {
    let list = allStudies;

    if (filter !== 'all') {
      list = list.filter((study) => study.category === filter || study.tags.map((tag) => tag.toLowerCase()).includes(filter));
    }

    return sortStudies(list, sort);
  }, [allStudies, filter, sort]);

  const featured = sort === 'featured' ? filtered.filter((study) => study.featured) : [];
  const rest = sort === 'featured' ? filtered.filter((study) => !study.featured) : filtered;
  const showSort = allStudies.length > 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <PortfolioHero />

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          {(showSort || allStudies.length > 1) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
              className="mb-10 flex items-center justify-between gap-4 border-b pb-5 md:mb-14"
              style={{ borderColor: 'var(--c4-border-light)' }}
            >
              <PortfolioFilters active={filter} onChange={setFilter} />
              {showSort && <PortfolioSortMenu value={sort} onChange={setSort} />}
            </motion.div>
          )}

          {loading ? (
            <div className="space-y-14 md:space-y-20">
              <FeaturedCardSkeleton />
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <div className="mb-14 space-y-14 md:mb-20 md:space-y-20">
                  {featured.map((study, index) => (
                    <FeaturedCard key={study.slug} study={study} index={index} />
                  ))}
                </div>
              )}

              {rest.length > 0 && (
                <>
                  {featured.length > 0 && (
                    <div className="mb-10 border-t pt-10 md:mb-14 md:pt-14" style={{ borderColor: 'var(--c4-border-light)' }}>
                      <span className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
                        More projects
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-16">
                    {rest.map((study, index) => (
                      <ProjectCard key={study.slug} study={study} index={index} />
                    ))}
                  </div>
                </>
              )}

              {filtered.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                  <p className="text-[13px]" style={{ color: 'var(--c4-text-subtle)' }}>
                    No projects in this category yet.
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
