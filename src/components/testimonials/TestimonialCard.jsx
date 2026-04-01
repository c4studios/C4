import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TestimonialCard({ testimonial, variant = 'light' }) {
  const proof = variant === 'proof';
  const dark = variant === 'dark';
  const caseStudyPath = testimonial.caseStudySlug
    ? createPageUrl(`CaseStudy?slug=${testimonial.caseStudySlug}`)
    : null;
  const websiteUrl = caseStudyPath ? null : testimonial.websiteUrl;
  const CardTag = caseStudyPath ? Link : 'div';

  const cardBg = proof
    ? 'var(--c4-proof-surface)'
    : dark
      ? 'rgba(255,255,255,0.05)'
      : 'var(--c4-card-bg)';

  const cardBorder = proof
    ? 'var(--c4-proof-border)'
    : dark
      ? 'var(--c4-inverted-border)'
      : 'var(--c4-border)';

  const textPrimary = proof
    ? 'var(--c4-proof-text)'
    : dark
      ? 'var(--c4-inverted-text)'
      : 'var(--c4-text)';

  const textSecondary = proof
    ? 'var(--c4-proof-muted)'
    : dark
      ? 'var(--c4-inverted-text-muted)'
      : 'var(--c4-text-muted)';

  const textTertiary = proof
    ? 'var(--c4-proof-faint)'
    : dark
      ? 'var(--c4-inverted-text-faint)'
      : 'var(--c4-text-subtle)';

  const quoteAccent = proof
    ? 'var(--c4-proof-accent)'
    : dark
      ? 'var(--c4-accent)'
      : 'var(--c4-accent)';

  const cardProps = caseStudyPath
    ? {
        to: caseStudyPath,
        'aria-label': `View ${testimonial.role || testimonial.name} case study`,
      }
    : {};

  const secondaryLine = websiteUrl ? (
    <a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-75 focus-visible:opacity-75 focus-visible:outline-none"
      style={{ color: textSecondary }}
      aria-label={`Visit ${testimonial.role || testimonial.name} website`}
      onClick={(event) => event.stopPropagation()}
    >
      <span>{testimonial.role}</span>
      <span
        className="text-[10px] uppercase tracking-[0.14em]"
        style={{ color: textTertiary }}
      >
        Take me there
      </span>
    </a>
  ) : (
    testimonial.role
  );

  return (
    <CardTag
      className={`h-full select-none rounded-[3px] px-8 py-8 md:px-10 md:py-9 ${caseStudyPath ? 'group block cursor-pointer focus-visible:outline-none' : ''}`}
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: proof
          ? '0 18px 34px rgba(36, 27, 24, 0.08)'
          : dark
            ? '0 2px 8px rgba(0,0,0,0.2)'
            : '0 1px 3px rgba(0,0,0,0.03)',
      }}
      {...cardProps}
    >
      <div
        className="mb-6 h-px w-10"
        style={{ backgroundColor: quoteAccent }}
      />

      <div>
        <p
          className="text-[15px] leading-[1.82] md:text-[16px]"
          style={{ color: textPrimary }}
        >
          "{testimonial.quote}"
        </p>
      </div>

      <div
        className="mt-8 border-t pt-5"
        style={{ borderColor: cardBorder }}
      >
        <p
          className="text-[13.5px] font-semibold tracking-[-0.01em]"
          style={{ color: textPrimary }}
        >
          {testimonial.name}
        </p>
        <p
          className="mt-0.5 text-[12px]"
          style={{ color: textSecondary }}
        >
          {secondaryLine}
          {testimonial.location && (
            <span style={{ color: textTertiary }}> | {testimonial.location}</span>
          )}
        </p>
      </div>
    </CardTag>
  );
}
