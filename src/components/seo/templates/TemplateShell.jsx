import React from 'react';
import PageHero from '@/components/c4/PageHero';
import SeoBreadcrumbs from '@/components/seo/SeoBreadcrumbs';
import SeoSections from '@/components/seo/SeoSections';
import SeoLinkHub from '@/components/seo/SeoLinkHub';
import SeoFaq from '@/components/seo/SeoFaq';
import SeoCta from '@/components/seo/SeoCta';

/** Map registry entries to link-hub items. */
export function toLinks(entries, { short = false } = {}) {
  return entries.map((e) => ({ label: short ? e.shortName || e.name : e.name, to: `/${e.slug}` }));
}

/**
 * Common skeleton shared by the four SEO templates: hero (with breadcrumbs
 * and answer-first intro), content sections, template-specific link hub,
 * FAQ, closing CTA. Templates differ in how they compose the link hub and
 * any extras they slot in — keep this shell boring.
 */
export default function TemplateShell({ content, crumbs, linkHub, linkHubLabel, faqHeading }) {
  const { hero = {}, sections = [], faqs = [], cta = {} } = content;
  // Wrap title lines in JSX so PageHero uses its whole-line reveal instead
  // of the per-letter split — keeps the H1 text contiguous for crawlers.
  const titleLines = (Array.isArray(hero.title) ? hero.title : [hero.title].filter(Boolean))
    .map((line, i) => <span key={i}>{line}</span>);

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <PageHero
        pretitle={<SeoBreadcrumbs crumbs={crumbs} />}
        label={hero.label}
        titleLines={titleLines}
      >
        {hero.intro && hero.intro.length > 0 && (
          <div className="space-y-4 max-w-[640px]">
            {hero.intro.map((p, i) => (
              <p key={i} className="text-[15px] md:text-[16px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                {p}
              </p>
            ))}
          </div>
        )}
      </PageHero>

      <SeoSections sections={sections} />
      {linkHub && <SeoLinkHub groups={linkHub} label={linkHubLabel} />}
      <SeoFaq faqs={faqs} heading={faqHeading} />
      <SeoCta cta={cta} />
    </div>
  );
}
