import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PageHero from '../components/c4/PageHero';

const ease = [0.22, 1, 0.36, 1];

const examples = [
  {
    number: '01',
    category: 'Internal Tools',
    description: 'CRMs, dashboards, and admin panels you\'re overpaying for — rebuilt around what your team actually uses.',
  },
  {
    number: '02',
    category: 'Scheduling & Booking',
    description: 'Replace SaaS booking platforms with a custom solution that matches your workflow exactly.',
  },
  {
    number: '03',
    category: 'Form & Data Collection',
    description: 'Complex form tools and survey platforms simplified into something purpose-built and fast.',
  },
  {
    number: '04',
    category: 'Content & Communication',
    description: 'Newsletters, client portals, and communication tools — stripped of bloat, built to perform.',
  },
];

export default function Rebuild() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <PageHero
        label="Rebuilds"
        titleLines={[
          'Replace bloated software.',
          'Keep what matters.',
        ]}
        description="If a tool is expensive, awkward, or full of things you don't need, we scope a simpler replacement around the parts your team actually uses."
      />

      <section className="pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="grid md:grid-cols-12 gap-8 md:gap-6 mb-16 md:mb-24"
          >
            <div className="md:col-span-5">
              <h2 className="text-[1.25rem] md:text-[1.5rem] font-semibold tracking-[-0.025em] leading-[1.15]" style={{ color: 'var(--c4-text)' }}>
                Tell us what you're paying for that isn't worth it.
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-7">
              <p className="text-[14px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
                Send us the tool, the cost, and what you actually use it for. If a leaner
                alternative is technically viable and makes financial sense, we'll build it.
                You own it outright — no monthly seat fees, no feature creep.
              </p>
            </div>
          </motion.div>

          {/* What we replace */}
          <div className="mb-16 md:mb-24">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="text-[11px] uppercase tracking-[0.2em] font-medium mb-10 md:mb-14"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              Common replacements
            </motion.h3>

            <div role="list">
              {examples.map((item, i) => (
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
                    <h4 className="col-span-10 md:col-span-3 text-[1.05rem] md:text-[1.15rem] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                      {item.category}
                    </h4>
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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="max-w-[520px]"
          >
            <h3 className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.15]" style={{ color: 'var(--c4-text)' }}>
              Have something worth replacing?
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
              Tell us about the tool and what it costs. We'll evaluate whether a rebuild makes sense.
            </p>
            <Link
              to={createPageUrl('Contact')}
              className="group mt-7 inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              Submit a tool
              <ArrowRight size={13} strokeWidth={2} className="opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
