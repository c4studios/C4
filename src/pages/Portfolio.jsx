import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PortfolioHero from '../components/portfolio/PortfolioHero';
import PortfolioSortMenu from '../components/portfolio/PortfolioSortMenu';
import { getAllCaseStudies } from '../components/portfolio/caseStudyData';
import { FeaturedCardSkeleton } from '../components/portfolio/PortfolioCardSkeleton';
import PortfolioMedia from '../components/portfolio/PortfolioMedia';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';

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
  // When there's no dedicated cover, the thumbnail (screenshots[0]) becomes the
  // hero — so start previews at the next shot to avoid showing it twice.
  const previewStart = study.cover ? 0 : 1;
  const previews = (study.screenshots || []).slice(previewStart, previewStart + 3);

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
            className={`relative aspect-[16/9] overflow-hidden rounded-[2px] flex items-center justify-center ${study.backdropClassName || ''}`}
            style={study.backdropStyle || { backgroundColor: study.brandColor || 'var(--c4-bg-alt)' }}
          >
            {study.cover ? (
              <img
                src={study.cover}
                alt={`${study.name} logo`}
                className={study.backdropStyle
                  ? "max-h-[60%] max-w-[60%] object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                  : "w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                }
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
            {study.concept && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full px-2.5 py-[3px]" style={{ backgroundColor: 'var(--c4-bg)', border: '1px solid var(--c4-border)' }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }} />
                <span className="text-[9px] uppercase tracking-[0.12em] font-medium" style={{ color: 'var(--c4-accent)' }}>Concept</span>
              </div>
            )}
            <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full opacity-0 scale-75 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 md:bottom-5 md:right-5" style={{ backgroundColor: 'var(--c4-text)' }}>
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
          className={`relative aspect-[16/10] overflow-hidden rounded-[2px] flex items-center justify-center ${study.backdropClassName || ''}`}
          style={study.backdropStyle || { backgroundColor: study.brandColor || 'var(--c4-bg-alt)' }}
        >
          {study.cover ? (
            <img
              src={study.cover}
              alt={`${study.name} logo`}
              className={study.backdropStyle
                ? "max-h-[55%] max-w-[55%] object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                : "w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              }
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
          {study.concept && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full px-2.5 py-[3px]" style={{ backgroundColor: 'var(--c4-bg)', border: '1px solid var(--c4-border)' }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }} />
              <span className="text-[9px] uppercase tracking-[0.12em] font-medium" style={{ color: 'var(--c4-accent)' }}>Concept</span>
            </div>
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

function softwareStatusColor(status) {
  if (status === 'Live') return 'var(--c4-brand-success, #22c55e)';
  if (status === 'Beta') return 'var(--c4-accent)';
  return 'var(--c4-text-faint)';
}

function SoftwareCard({ study, index }) {
  const color = softwareStatusColor(study.status);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
    >
      <div className="group relative block">
        <div
          className="relative aspect-[16/10] overflow-hidden rounded-[2px] flex items-center justify-center"
          style={{ backgroundColor: 'var(--c4-bg-alt)' }}
        >
          <span
            className="text-[4.5rem] font-black tracking-[-0.06em] select-none leading-none"
            style={{ color: 'var(--c4-border)' }}
          >
            {study.name[0]}
          </span>
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full px-2.5 py-[3px]" style={{ border: `1px solid ${color}` }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] uppercase tracking-[0.12em] font-medium" style={{ color }}>{study.status}</span>
          </div>
          {study.liveUrl && (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 z-20 flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ color: 'var(--c4-text-faint)' }}
            >
              Live site <ArrowUpRight size={10} strokeWidth={2} />
            </a>
          )}
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
          <div className="mt-3 flex items-center gap-4">
            <span className="text-[10.5px] font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ color: 'var(--c4-accent)' }}>
              View & Purchase {'->'}
            </span>
          </div>
        </div>
        {/* Card-wide click target — kept as a sibling overlay so the live-site
            link is not nested inside another anchor (invalid DOM nesting). */}
        <Link to="/software" aria-label={`View ${study.name}`} className="absolute inset-0 z-10" />
      </div>
    </motion.div>
  );
}

// Three top-level buckets used by the category chooser and the section layout.
const BROWSE = [
  { key: 'all', label: 'All Work' },
  { key: 'web', label: 'Web & Apps' },
  { key: 'software', label: 'Software' },
  { key: 'concept', label: 'Concepts' },
];

const SECTION_META = {
  web: {
    label: 'Web & Apps',
    blurb: 'Custom websites, web apps and e-commerce — designed and built for clients.',
    accent: false,
  },
  software: {
    label: 'Software',
    blurb: 'C4 Originals — live SaaS products we design, build, and sell.',
    accent: false,
  },
  concept: {
    label: 'Concepts',
    blurb: 'Self-initiated showcase builds — not client commissions. Each is a fully deployed concept, available to license or commission.',
    accent: true,
  },
};

function matchCategory(study, key) {
  if (key === 'concept') return Boolean(study.concept);
  if (key === 'software') return study.category === 'saas' && !study.concept;
  if (key === 'web') return !study.concept && study.category !== 'saas';
  return true;
}

function CategoryChooser({ active, onChange, counts }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
      {BROWSE.map((cat) => {
        const isActive = active === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className="group flex flex-col items-start gap-1.5 rounded-[3px] border px-4 py-3.5 text-left transition-colors duration-300 md:px-5 md:py-4"
            style={{
              borderColor: isActive ? 'var(--c4-text)' : 'var(--c4-border-light)',
              backgroundColor: isActive ? 'var(--c4-text)' : 'transparent',
            }}
          >
            <span
              className="text-[13.5px] font-semibold tracking-[-0.01em] md:text-[15px]"
              style={{ color: isActive ? 'var(--c4-bg)' : 'var(--c4-text)' }}
            >
              {cat.label}
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.13em] font-medium"
              style={{ color: isActive ? 'var(--c4-bg-alt)' : 'var(--c4-text-subtle)' }}
            >
              {counts[cat.key]} {counts[cat.key] === 1 ? 'project' : 'projects'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CategoryGroup({ groupKey, studies, showHeader }) {
  if (!studies.length) return null;
  const meta = SECTION_META[groupKey];
  const feat = studies.filter((study) => study.featured);
  const rest = studies.filter((study) => !study.featured);
  return (
    <div>
      {showHeader && meta && (
        <div className="mb-8 md:mb-10">
          <span
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold"
            style={{ color: meta.accent ? 'var(--c4-accent)' : 'var(--c4-text)' }}
          >
            {meta.accent && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }} />}
            {meta.label}
          </span>
          <p className="mt-2.5 max-w-[600px] text-[13px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
            {meta.blurb}
          </p>
        </div>
      )}
      {feat.length > 0 && (
        <div className="mb-12 space-y-12 md:mb-16 md:space-y-16">
          {feat.map((study, index) => (
            <FeaturedCard key={study.slug} study={study} index={index} />
          ))}
        </div>
      )}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-16">
          {rest.map((study, index) => (
            study.category === 'saas' && !(study.screenshots?.length)
              ? <SoftwareCard key={study.slug} study={study} index={index} />
              : <ProjectCard key={study.slug} study={study} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Portfolio() {
  const [searchParams] = useSearchParams();
  const rawFilter = searchParams.get('filter') || 'all';
  const initialFilter = rawFilter === 'ai'
    ? 'software'
    : (['all', 'web', 'software', 'concept'].includes(rawFilter) ? rawFilter : 'all');
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);
  const allStudies = getAllCaseStudies();

  const portfolioJsonLd = useMemo(() => [
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Portfolio', path: '/Portfolio' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'C4 Studios Portfolio — Selected Work',
      description:
        'Selected case studies from C4 Studios — Perth-based web design, AI and software, brand and photography projects.',
      url: 'https://c4studios.com.au/Portfolio',
    },
  ], []);

  useDocumentHead({
    title: 'Portfolio — Selected Web, AI & Brand Case Studies',
    description:
      'Selected case studies from C4 Studios. Custom websites, AI automations, brand systems and photography projects, with scope, stack and outcomes for each.',
    path: '/Portfolio',
    jsonLd: portfolioJsonLd,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeoutId);
  }, []);

  const sorted = useMemo(() => sortStudies(allStudies, sort), [allStudies, sort]);
  const counts = useMemo(() => ({
    all: allStudies.length,
    web: allStudies.filter((study) => matchCategory(study, 'web')).length,
    software: allStudies.filter((study) => matchCategory(study, 'software')).length,
    concept: allStudies.filter((study) => matchCategory(study, 'concept')).length,
  }), [allStudies]);
  // 'all' lays out three distinct sections; a specific filter shows just that bucket.
  const groups = filter === 'all' ? ['web', 'software', 'concept'] : [filter];
  const visibleCount = groups.reduce(
    (total, groupKey) => total + sorted.filter((study) => matchCategory(study, groupKey)).length,
    0,
  );
  const showSort = allStudies.length > 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <PortfolioHero />

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease }}
            className="mb-12 border-b pb-8 md:mb-16 md:pb-10"
            style={{ borderColor: 'var(--c4-border-light)' }}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
                Browse by category
              </span>
              {showSort && <PortfolioSortMenu value={sort} onChange={setSort} />}
            </div>
            <CategoryChooser active={filter} onChange={setFilter} counts={counts} />
          </motion.div>

          {loading ? (
            <div className="space-y-14 md:space-y-20">
              <FeaturedCardSkeleton />
            </div>
          ) : visibleCount === 0 ? (
            <p className="py-20 text-center text-[13px]" style={{ color: 'var(--c4-text-subtle)' }}>
              No projects in this category yet.
            </p>
          ) : (
            <div className="space-y-16 md:space-y-24">
              {groups.map((groupKey) => (
                <CategoryGroup
                  key={groupKey}
                  groupKey={groupKey}
                  studies={sorted.filter((study) => matchCategory(study, groupKey))}
                  showHeader={filter === 'all'}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
