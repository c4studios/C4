import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function FinalCTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section ref={ref} className="pb-20 pt-8 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-16 h-px md:mb-24" style={{ backgroundColor: 'var(--c4-border)' }} />

        <motion.div style={{ y, opacity }} className="max-w-[520px]">
          <h2 className="text-[1.4rem] font-semibold tracking-[-0.025em] leading-[1.15] md:text-[1.85rem]" style={{ color: 'var(--c4-text)' }}>
            Need something better than a template?
          </h2>
          <p className="mt-3.5 text-[14px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
            Tell us what you&apos;re building. We&apos;ll come back with a clear next step.
          </p>
          <Link
            to={createPageUrl('StartProject')}
            className="group mt-7 inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
            style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            Start here
            <ArrowRight size={13} strokeWidth={2} className="opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
