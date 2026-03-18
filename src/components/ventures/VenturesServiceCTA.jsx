import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

export default function VenturesServiceCTA() {
  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="w-full h-px mb-10" style={{ backgroundColor: 'var(--c4-border)' }} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-5"
        >
          <div>
            <p className="text-[15px] md:text-[17px] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>
              Need this built for your business now?
            </p>
            <p className="mt-1.5 text-[13.5px] leading-[1.6] max-w-[400px]" style={{ color: 'var(--c4-text-muted)' }}>
              Ventures is for ideas we explore together. If you need a website, app, or platform built on your timeline — start a project instead.
            </p>
          </div>
          <Link
            to={createPageUrl('Contact')}
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300 shrink-0"
            style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            Start a Project
            <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}