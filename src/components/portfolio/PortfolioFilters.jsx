import React from 'react';
import { motion } from 'framer-motion';
import { getAllCaseStudies } from './caseStudyData';

// The 4 C4 service categories — always shown
const SERVICE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web & Apps', categories: ['web_design', 'web_app', 'ecommerce'] },
  { key: 'brand', label: 'Brand & Growth', categories: ['brand_platform'] },
  { key: 'ai', label: 'AI & Software', categories: ['automation', 'rebuild'] },
  { key: 'lens', label: 'C4 Lens', categories: ['lens'] },
];

export function getServiceFilterCategories(filterKey) {
  const entry = SERVICE_FILTERS.find(f => f.key === filterKey);
  return entry?.categories || null;
}

export function hasProjectsForFilter(filterKey) {
  if (filterKey === 'all') return true;
  const cats = getServiceFilterCategories(filterKey);
  if (!cats) return false;
  const studies = getAllCaseStudies();
  return studies.some(s => cats.includes(s.category));
}

export default function PortfolioFilters({ active, onChange }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
      {SERVICE_FILTERS.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className="relative px-4 py-[6px] text-[11px] uppercase tracking-[0.12em] font-medium whitespace-nowrap transition-colors duration-300 rounded-full"
          style={{ color: active === cat.key ? 'var(--c4-bg)' : 'var(--c4-text-subtle)' }}
        >
          {active === cat.key && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: 'var(--c4-text)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}
          <span className="relative z-10">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}