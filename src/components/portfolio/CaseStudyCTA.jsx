import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

export default function CaseStudyCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease }}
      className="py-20 md:py-28"
    >
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center">
        <div className="w-8 h-px mx-auto mb-7" style={{ backgroundColor: 'var(--c4-accent)' }} />
        <h2 className="text-[1.15rem] md:text-[1.45rem] font-semibold tracking-[-0.02em] leading-[1.15]" style={{ color: 'var(--c4-text)' }}>
          Like what you see?
        </h2>
        <p className="mt-3 text-[14px] leading-[1.65] max-w-[380px] mx-auto" style={{ color: 'var(--c4-text-muted)' }}>
          Every project starts with a conversation.
        </p>
        <Link
          to={createPageUrl('StartProject')}
          className="mt-7 inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300 rounded-[2px]"
          style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
        >
          Start a Project
          <ArrowRight size={13} strokeWidth={2} />
        </Link>
      </div>
    </motion.section>
  );
}