import React from 'react';
import PageHero from '../c4/PageHero';

export default function VenturesHero() {
  return (
    <PageHero
      label="Ventures"
      titleLines={[
        'Ideas worth building.',
      ]}
      description="C4 Studios selectively reviews idea submissions from founders, builders, and problem-solvers. If the concept is strong and the fit is right, we explore building it together."
    >
      <p className="text-[12.5px] leading-[1.6] max-w-[440px]" style={{ color: 'var(--c4-text-faint)' }}>
        Submission does not guarantee a build. Every idea is evaluated on merit, feasibility, and alignment.
      </p>
    </PageHero>
  );
}