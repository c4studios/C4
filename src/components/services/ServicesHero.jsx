import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PageHero from '../c4/PageHero';

export default function ServicesHero({ onStartProject }) {
  return (
    <PageHero
      label="Services"
      titleLines={[
        'Websites, apps,',
        'and rebuilds.',
      ]}
      description="Clear thinking, careful design, and solid build work."
    >
      <div className="flex items-center gap-6">
        <button
          onClick={onStartProject}
          className="group inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
          style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
        >
          Start here
          <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
        </button>
        <Link
          to={createPageUrl('Portfolio')}
          className="text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
          style={{ color: 'var(--c4-text-subtle)' }}
        >
          See the work
        </Link>
      </div>
    </PageHero>
  );
}
