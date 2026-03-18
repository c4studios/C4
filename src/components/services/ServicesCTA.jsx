import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

export default function ServicesCTA({ onStartProject }) {
  return (
    <section className="pt-14 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="h-px mb-14" style={{ backgroundColor: 'var(--c4-border)' }} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[540px]"
        >
          <h2 className="text-[1.6rem] md:text-[2rem] font-semibold tracking-[-0.025em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            Tell us what needs building.
          </h2>
          <p className="mt-4 text-[14px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
            A short outline is enough. We&apos;ll reply within 24 hours.
          </p>
          <button
            onClick={onStartProject}
            className="group inline-flex items-center gap-2 mt-7 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
            style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            Start here
            <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
