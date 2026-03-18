import React from 'react';
import { motion } from 'framer-motion';
import { getAllCaseStudies } from './caseStudyData';

// Build category list dynamically from actual case studies.
// Only shows filters that have at least one project behind them.
const CATEGORY_META = {
  all:              'All',
  web_design:       'Website',
  web_app:          'Web App',
  brand_platform:   'Brand Platform',
  rebuild:          'Rebuild',
};

function getActiveCategories() {
  const studies = getAllCaseStudies();
  const usedCats = new Set(studies.map(s => s.category));
  const cats = [{ key: 'all', label: 'All' }];

  for (const [key, label] of Object.entries(CATEGORY_META)) {
    if (key !== 'all' && usedCats.has(key)) {
      cats.push({ key, label });
    }
  }
  return cats;
}

export default function PortfolioFilters({ active, onChange }) {
  const categories = getActiveCategories();

  // If only "All" + one category exist, filters add no value — hide them
  if (categories.length <= 2) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
      {categories.map((cat) => (
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