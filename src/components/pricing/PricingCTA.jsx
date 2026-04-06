import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CTA_TEXT, CTA_ROUTE, ASTERISK_CLAUSE, GST_NOTE } from '@/data/pricing';

const ease = [0.22, 1, 0.36, 1];

export default function PricingCTA({ showClauses = true }) {
  return (
    <section className="pt-14 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="h-px mb-14" style={{ backgroundColor: 'var(--c4-border)' }} />

        {showClauses && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mb-10 max-w-[640px]"
          >
            <p className="text-[12px] leading-[1.7] mb-3" style={{ color: 'var(--c4-text-subtle)' }}>
              {ASTERISK_CLAUSE}
            </p>
            <p className="text-[11px] leading-[1.6]" style={{ color: 'var(--c4-text-faint)' }}>
              {GST_NOTE}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="max-w-[540px]"
        >
          <h2
            className="text-[1.6rem] md:text-[2rem] font-semibold tracking-[-0.025em] leading-[1.1]"
            style={{ color: 'var(--c4-text)' }}
          >
            Ready to get started?
          </h2>
          <p className="mt-4 text-[14px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
            Book a free discovery call and we&apos;ll scope your project together.
          </p>
          <Link
            to={CTA_ROUTE}
            className="group inline-flex items-center gap-2 mt-7 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
            style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            {CTA_TEXT}
            <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
