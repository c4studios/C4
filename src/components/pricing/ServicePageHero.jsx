import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../c4/PageHero';

export default function ServicePageHero({ label, titleLines, description, backLabel = 'All Services', backTo = '/services/pricing' }) {
  return (
    <PageHero
      label={label}
      titleLines={titleLines}
      description={description}
      pretitle={
        <Link
          to={backTo}
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
          style={{ color: 'var(--c4-text-subtle)' }}
        >
          <ArrowLeft size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-all duration-300" />
          {backLabel}
        </Link>
      }
    />
  );
}
