import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCaseStudy } from '../components/portfolio/caseStudyData';
import CaseStudyHero from '../components/portfolio/CaseStudyHero';
import CaseStudySection from '../components/portfolio/CaseStudySection';
import CaseStudyBullets from '../components/portfolio/CaseStudyBullets';
import CaseStudyGallery from '../components/portfolio/CaseStudyGallery';
import CaseStudyCTA from '../components/portfolio/CaseStudyCTA';

export default function CaseStudy() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const study = getCaseStudy(slug);

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

  // Dynamic section numbering — skips sections that have no content
  let sectionNum = 0;
  const nextNum = () => String(++sectionNum).padStart(2, '0');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <CaseStudyHero study={study} />

      {/* Overview */}
      <CaseStudySection title="Overview" number={nextNum()} className="mt-8" style={{ borderTop: '1px solid var(--c4-border-light)' }}>
        <p className="text-[15px] leading-[1.8] max-w-[700px]" style={{ color: 'var(--c4-text-muted)' }}>
          {study.overview}
        </p>
      </CaseStudySection>

      {/* Gallery — only if real screenshots exist */}
      {hasScreenshots && (
        <CaseStudySection title="Screenshots" number={nextNum()} style={{ borderTop: '1px solid var(--c4-border-light)' }}>
          <CaseStudyGallery
            screenshots={study.screenshots}
            desktopScreenshots={study.desktopScreenshots}
            mobileScreenshots={study.mobileScreenshots}
          />
        </CaseStudySection>
      )}

      {/* Delivered */}
      {study.delivered?.length > 0 && (
        <CaseStudySection title="What I Delivered" number={nextNum()} style={{ borderTop: '1px solid var(--c4-border-light)' }}>
          <CaseStudyBullets items={study.delivered} />
        </CaseStudySection>
      )}

      {/* Features */}
      {study.features?.length > 0 && (
        <CaseStudySection title="Key Features" number={nextNum()} style={{ borderTop: '1px solid var(--c4-border-light)' }}>
          <CaseStudyBullets items={study.features} />
        </CaseStudySection>
      )}

      {/* Stack */}
      {study.stack?.length > 0 && (
        <CaseStudySection title="Stack & Tooling" number={nextNum()} style={{ borderTop: '1px solid var(--c4-border-light)' }}>
          <CaseStudyBullets items={study.stack} columns={1} />
        </CaseStudySection>
      )}

      {/* Integrations */}
      {study.integrations?.length > 0 && (
        <CaseStudySection title="Integrations & Backend" number={nextNum()} style={{ borderTop: '1px solid var(--c4-border-light)' }}>
          <CaseStudyBullets items={study.integrations} columns={1} />
        </CaseStudySection>
      )}

      {/* Performance */}
      {study.performance?.length > 0 && (
        <CaseStudySection title="Performance / SEO / Accessibility" number={nextNum()} style={{ borderTop: '1px solid var(--c4-border-light)' }}>
          <CaseStudyBullets items={study.performance} />
        </CaseStudySection>
      )}

      {/* Challenges */}
      {study.challenges?.length > 0 && (
        <CaseStudySection title="Challenges & Constraints" number={nextNum()} style={{ borderTop: '1px solid var(--c4-border-light)' }}>
          <CaseStudyBullets items={study.challenges} />
        </CaseStudySection>
      )}

      {/* Improvements */}
      {study.improvements?.length > 0 && (
        <CaseStudySection title="What I'd Improve Next" number={nextNum()} style={{ borderTop: '1px solid var(--c4-border-light)' }}>
          <CaseStudyBullets items={study.improvements} columns={1} />
        </CaseStudySection>
      )}

      {/* CTA */}
      <div style={{ borderTop: '1px solid var(--c4-border-light)' }}>
        <CaseStudyCTA />
      </div>
    </div>
  );
}
