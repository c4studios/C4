import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PageHero from '../components/c4/PageHero';

const ease = [0.22, 1, 0.36, 1];

const capabilities = [
  {
    number: '01',
    title: 'Brand Films',
    description: 'Short-form narrative pieces that communicate who you are, not just what you sell.',
  },
  {
    number: '02',
    title: 'Product & Service Captures',
    description: 'Clean, considered footage that shows your work at the level it deserves.',
  },
  {
    number: '03',
    title: 'Event & Environment',
    description: 'Documenting real moments with cinematic sensibility — openings, launches, spaces.',
  },
  {
    number: '04',
    title: 'Web-Ready Content',
    description: 'Video optimised for hero sections, case studies, and digital portfolios. Built to load fast and look sharp.',
  },
];

export default function Lens() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <PageHero
        label="C4 Lens"
        titleLines={[
          'Every frame,',
          'considered.',
        ]}
        description="C4 Lens extends the studio's design discipline into motion. Video production for brands that care about how they're seen."
      />

      <section className="pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mb-16 md:mb-24"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full" style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }} />
              <span className="text-[11px] uppercase tracking-[0.16em] font-medium" style={{ color: 'var(--c4-text-muted)' }}>
                Launching soon
              </span>
            </div>
          </motion.div>

          {/* Capabilities */}
          <div className="mb-16 md:mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="text-[11px] uppercase tracking-[0.2em] font-medium mb-10 md:mb-14"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              Capabilities
            </motion.h2>

            <div role="list">
              {capabilities.map((item, i) => (
                <motion.div
                  key={item.number}
                  role="listitem"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease }}
                >
                  <div className="border-t py-7 md:py-9 grid grid-cols-12 gap-4 items-baseline" style={{ borderColor: 'var(--c4-border)' }}>
                    <span className="col-span-2 md:col-span-1 text-[11px] tabular-nums font-medium" style={{ color: 'var(--c4-text-faint)' }}>
                      {item.number}
                    </span>
                    <h3 className="col-span-10 md:col-span-3 text-[1.05rem] md:text-[1.15rem] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                      {item.title}
                    </h3>
                    <p className="col-span-10 col-start-3 md:col-span-6 md:col-start-5 mt-1 md:mt-0 text-[13.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease }}
                className="h-px origin-left"
                style={{ backgroundColor: 'var(--c4-border)' }}
              />
            </div>
          </div>

          {/* Approach note */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="grid md:grid-cols-12 gap-8 md:gap-6 mb-16 md:mb-24"
          >
            <div className="md:col-span-5">
              <h3 className="text-[1.25rem] md:text-[1.5rem] font-semibold tracking-[-0.025em] leading-[1.15]" style={{ color: 'var(--c4-text)' }}>
                Same discipline, different medium.
              </h3>
            </div>
            <div className="md:col-span-5 md:col-start-7">
              <p className="text-[14px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
                Every frame is treated with the same restraint and intention we bring to
                interfaces. No filler reels. No stock-footage padding. Just considered
                work that represents your brand honestly.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="h-px mb-12" style={{ backgroundColor: 'var(--c4-border)' }} />
            <h3 className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.15]" style={{ color: 'var(--c4-text)' }}>
              Interested in working with C4 Lens?
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65] max-w-[440px]" style={{ color: 'var(--c4-text-muted)' }}>
              We are currently accepting early enquiries. Reach out to discuss your project.
            </p>
            <Link
              to={createPageUrl('Contact')}
              className="group mt-7 inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              Get in touch
              <ArrowRight size={13} strokeWidth={2} className="opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
