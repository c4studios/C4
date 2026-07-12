import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCaseStudy } from '../components/portfolio/caseStudyData';
import { getTestimonialForCaseStudy } from '../components/testimonials/testimonialData';
import CaseStudyHero from '../components/portfolio/CaseStudyHero';
import CaseStudySection from '../components/portfolio/CaseStudySection';
import CaseStudyBullets from '../components/portfolio/CaseStudyBullets';
import CaseStudyGallery from '../components/portfolio/CaseStudyGallery';
import CaseStudyCTA from '../components/portfolio/CaseStudyCTA';
import CaseStudyTOC from '../components/portfolio/CaseStudyTOC';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, caseStudyArticleSchema } from '@/lib/schema';

export default function CaseStudy() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const study = getCaseStudy(slug);

  const studyJsonLd = useMemo(() => {
    if (!study) return null;
    return [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/Portfolio' },
        { name: study.name, path: `/CaseStudy?slug=${study.slug}` },
      ]),
      caseStudyArticleSchema(study, getTestimonialForCaseStudy(study.slug)),
    ];
  }, [study]);

  useDocumentHead(
    study
      ? {
          title: `${study.name} — ${study.tags?.[0] || 'Case Study'} Case Study`,
          description: study.oneLiner,
          path: `/CaseStudy?slug=${study.slug}`,
          image: study.cover,
          type: 'article',
          jsonLd: studyJsonLd,
        }
      : {
          title: 'Case Study Not Found',
          description: 'The requested case study could not be found.',
          path: '/CaseStudy',
          noIndex: true,
        }
  );

  if (!study) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <p className="text-[14px]" style={{ color: 'var(--c4-text-subtle)' }}>Case study not found.</p>
      </div>
    );
  }

  const hasScreenshots = (study.screenshots?.length || 0) > 0
    || (study.desktopScreenshots?.length || 0) > 0
    || (study.mobileScreenshots?.length || 0) > 0;

  // Build the visible sections once — skipping those with no content — so the
  // numbering, the rendered body and the sticky table of contents all read from
  // a single source of truth and can never drift out of sync.
  const sections = [
    {
      id: 'overview',
      navLabel: 'Overview',
      title: 'Overview',
      className: 'mt-8',
      content: (
        <p className="text-[15px] leading-[1.8] max-w-[700px]" style={{ color: 'var(--c4-text-muted)' }}>
          {study.overview}
        </p>
      ),
    },
    hasScreenshots && {
      id: 'screenshots',
      navLabel: 'Screenshots',
      title: 'Screenshots',
      content: (
        <CaseStudyGallery
          screenshots={study.screenshots}
          desktopScreenshots={study.desktopScreenshots}
          mobileScreenshots={study.mobileScreenshots}
        />
      ),
    },
    study.delivered?.length > 0 && {
      id: 'delivered',
      navLabel: 'Delivered',
      title: 'What I Delivered',
      content: <CaseStudyBullets items={study.delivered} />,
    },
    study.features?.length > 0 && {
      id: 'features',
      navLabel: 'Features',
      title: 'Key Features',
      content: <CaseStudyBullets items={study.features} />,
    },
    study.stack?.length > 0 && {
      id: 'stack',
      navLabel: 'Stack',
      title: 'Stack & Tooling',
      content: <CaseStudyBullets items={study.stack} columns={1} />,
    },
    study.integrations?.length > 0 && {
      id: 'integrations',
      navLabel: 'Integrations',
      title: 'Integrations & Backend',
      content: <CaseStudyBullets items={study.integrations} columns={1} />,
    },
    study.performance?.length > 0 && {
      id: 'performance',
      navLabel: 'Performance',
      title: 'Performance / SEO / Accessibility',
      content: <CaseStudyBullets items={study.performance} />,
    },
    study.challenges?.length > 0 && {
      id: 'challenges',
      navLabel: 'Challenges',
      title: 'Challenges & Constraints',
      content: <CaseStudyBullets items={study.challenges} />,
    },
    study.improvements?.length > 0 && {
      id: 'improvements',
      navLabel: 'Improvements',
      title: "What I'd Improve Next",
      content: <CaseStudyBullets items={study.improvements} columns={1} />,
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <CaseStudyHero study={study} />

      {sections.map((section, index) => (
        <CaseStudySection
          key={section.id}
          id={section.id}
          title={section.title}
          number={String(index + 1).padStart(2, '0')}
          className={section.className}
          style={{ borderTop: '1px solid var(--c4-border-light)' }}
        >
          {section.content}
        </CaseStudySection>
      ))}

      {/* CTA */}
      <div style={{ borderTop: '1px solid var(--c4-border-light)' }}>
        <CaseStudyCTA />
      </div>

      {/* Sticky, proximity-reactive section index — desktop only, portaled to body */}
      <CaseStudyTOC sections={sections.map(({ id, navLabel }) => ({ id, label: navLabel }))} />
    </div>
  );
}
