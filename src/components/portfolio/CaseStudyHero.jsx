import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

export default function CaseStudyHero({ study }) {
  return (
    <section className="pt-24 md:pt-32 pb-0" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Link
            to={createPageUrl('Portfolio')}
            className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] font-medium transition-colors duration-300 mb-10 md:mb-14 group"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            <ArrowLeft size={13} strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
            Portfolio
          </Link>
        </motion.div>

        {/* Tags row */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease }}
          className="flex flex-wrap items-center gap-2 mb-4"
        >
          {study.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-[3px] text-[9.5px] uppercase tracking-[0.16em] font-medium rounded-[2px]" style={{ color: 'var(--c4-text-muted)', backgroundColor: 'var(--c4-tag-bg)' }}>
              {tag}
            </span>
          ))}
          {study.year && (
            <span className="px-2.5 py-[3px] text-[9.5px] uppercase tracking-[0.16em] font-medium rounded-[2px]" style={{ color: 'var(--c4-text-faint)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--c4-border)' }}>
              {study.year}
            </span>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="text-[clamp(1.8rem,4.5vw,3rem)] font-semibold tracking-[-0.04em] leading-[1.06] max-w-[800px]"
          style={{ color: 'var(--c4-text)' }}
        >
          {study.name}
        </motion.h1>

        {/* One-liner */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease }}
          className="mt-4 text-[15px] leading-[1.7] max-w-[600px]"
          style={{ color: 'var(--c4-text-muted)' }}
        >
          {study.oneLiner}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease }}
          className="mt-7 flex flex-wrap gap-3"
        >
          {study.liveUrl && (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-[9px] text-[11px] uppercase tracking-[0.13em] font-medium transition-colors duration-300 rounded-[2px]"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              Visit Live Site
              <ExternalLink size={12} strokeWidth={2} />
            </a>
          )}
          <Link
            to={createPageUrl('StartProject')}
            className="inline-flex items-center gap-2 px-5 py-[9px] text-[11px] uppercase tracking-[0.13em] font-medium transition-colors duration-300 rounded-[2px]"
            style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--c4-border)', color: 'var(--c4-text)' }}
          >
            Start a Project
            <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </motion.div>

        {/* Cover banner */}
        {study.cover && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease }}
            className="mt-10 aspect-[21/9] overflow-hidden rounded-[3px] flex items-center justify-center"
            style={{ backgroundColor: study.brandColor || 'var(--c4-bg-alt)' }}
          >
            <img
              src={study.cover}
              alt={`${study.name} logo`}
              className="max-h-[50%] max-w-[50%] object-contain"
            />
          </motion.div>
        )}

        {/* Metadata strip — only confirmed facts */}
        {(() => {
          const items = [
            { label: 'Client', value: study.client },
            { label: 'Location', value: study.location },
            { label: 'Timeline', value: study.timeline },
            { label: 'Budget', value: study.budget },
            { label: 'Role', value: study.role },
          ].filter(item => item.value && item.value !== '—' && item.value.trim() !== '');

          if (items.length === 0) return null;

          // Responsive grid: auto-fit to the number of items present
          const colClass = items.length <= 3
            ? `grid-cols-2 sm:grid-cols-${items.length}`
            : `grid-cols-2 sm:grid-cols-3 md:grid-cols-${items.length}`;

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease }}
              className={`mt-12 pt-8 grid ${colClass} gap-y-5 gap-x-6`}
              style={{ borderTop: '1px solid var(--c4-border-light)' }}
            >
              {items.map((item) => (
                <div key={item.label}>
                  <span className="block text-[9px] uppercase tracking-[0.2em] font-medium mb-1" style={{ color: 'var(--c4-text-faint)' }}>
                    {item.label}
                  </span>
                  <span className="text-[13px] font-medium leading-[1.4]" style={{ color: 'var(--c4-text)' }}>
                    {item.value}
                  </span>
            </div>
              ))}
            </motion.div>
          );
        })()}
      </div>
    </section>
  );
}