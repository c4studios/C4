import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

/**
 * Closing CTA band for SEO pages, visually in line with ServicesCTA.
 * Always carries the entity line — every SEO page must state plainly who
 * and where C4 Studios is, for both Google and AI-assistant search.
 */
export default function SeoCta({ cta = {} }) {
  return (
    <section className="pt-10 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="h-px mb-12" style={{ backgroundColor: 'var(--c4-border)' }} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[560px]"
        >
          <h2 className="text-[1.6rem] md:text-[2rem] font-semibold tracking-[-0.025em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            {cta.heading || 'Tell me what needs building.'}
          </h2>
          <p className="mt-4 text-[14px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
            {cta.text || 'A short outline is enough. I reply within a business day.'}
          </p>
          <Link
            to={createPageUrl('StartProject')}
            className="group inline-flex items-center gap-2 mt-7 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
            style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            Start a project
            <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>
          <p className="mt-8 text-[12px] leading-[1.6]" style={{ color: 'var(--c4-text-subtle)' }}>
            C4 Studios is a web design and automation studio based in Perth, Western Australia, working with businesses across WA and Australia-wide.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
