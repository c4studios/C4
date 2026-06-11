import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PageHero from '../components/c4/PageHero';
import BeforeAfterSlider from '../components/c4/BeforeAfterSlider';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';

const ease = [0.22, 1, 0.36, 1];

/* Illustrative, schematic UI mockups — not real client screenshots. */
function WindowChrome({ children, tint }) {
  return (
    <div className="flex h-full w-full flex-col" style={{ backgroundColor: tint || 'var(--c4-card-bg)' }}>
      <div className="flex shrink-0 items-center gap-1.5 px-3" style={{ height: 28, borderBottom: '1px solid var(--c4-border)' }}>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(255,90,90,0.6)' }} />
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(255,185,50,0.6)' }} />
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(40,200,100,0.6)' }} />
      </div>
      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

function BloatedMockup() {
  return (
    <WindowChrome>
      <div className="flex h-full">
        {/* Crowded sidebar */}
        <div className="flex flex-col gap-1.5 p-2.5" style={{ width: '34%', borderRight: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: 'var(--c4-border)' }} />
              <span className="h-1.5 flex-1 rounded-[1px]" style={{ backgroundColor: 'var(--c4-border)' }} />
              {i % 3 === 1 && <Lock size={8} style={{ color: 'var(--c4-accent)' }} />}
            </div>
          ))}
        </div>
        {/* Cluttered main */}
        <div className="relative flex-1 p-2.5">
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-[2px]" style={{ height: 22, backgroundColor: 'var(--c4-bg-alt)', border: '1px solid var(--c4-border)' }} />
            ))}
          </div>
          {/* Nagging upgrade modal */}
          <div className="absolute bottom-2 right-2 left-6 rounded-[3px] p-2 shadow-lg" style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-accent)' }}>
            <div className="mb-1 h-1.5 w-2/3 rounded-[1px]" style={{ backgroundColor: 'var(--c4-accent)' }} />
            <div className="h-1.5 w-full rounded-[1px]" style={{ backgroundColor: 'var(--c4-border)' }} />
          </div>
          <span className="absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wider" style={{ backgroundColor: 'color-mix(in srgb, var(--c4-accent) 18%, transparent)', color: 'var(--c4-accent)' }}>
            $249/mo · 14 seats
          </span>
        </div>
      </div>
    </WindowChrome>
  );
}

function LeanMockup() {
  return (
    <WindowChrome>
      <div className="flex h-full">
        {/* Minimal sidebar */}
        <div className="flex flex-col gap-2.5 p-3" style={{ width: '26%', borderRight: '1px solid var(--c4-border)' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: i === 0 ? 'var(--c4-accent)' : 'var(--c4-border)' }} />
              <span className="h-1.5 flex-1 rounded-[1px]" style={{ backgroundColor: 'var(--c4-border)' }} />
            </div>
          ))}
        </div>
        {/* Focused main */}
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 h-2 w-1/3 rounded-[1px]" style={{ backgroundColor: 'var(--c4-text-subtle)' }} />
          <div className="mb-4 h-1.5 w-1/2 rounded-[1px]" style={{ backgroundColor: 'var(--c4-border)' }} />
          <div className="flex-1 rounded-[3px]" style={{ backgroundColor: 'var(--c4-bg-alt)', border: '1px solid var(--c4-border)' }} />
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wider" style={{ backgroundColor: 'color-mix(in srgb, #22c55e 18%, transparent)', color: '#16a34a' }}>
              $0/mo · you own it
            </span>
            <span className="h-4 w-12 rounded-[3px]" style={{ backgroundColor: 'var(--c4-text)' }} />
          </div>
        </div>
      </div>
    </WindowChrome>
  );
}

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
  useDocumentHead({
    title: 'Software Rebuilds — Replace Bloated SaaS with Custom Tools',
    description:
      'If your tools are expensive, awkward, or full of features you don’t use, C4 Studios scopes a simpler replacement around the parts your team actually uses.',
    path: '/Rebuild',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Rebuilds', path: '/Rebuild' },
    ]),
  });

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

          {/* Before / after — illustrative comparison */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mb-16 md:mb-24"
          >
            <div className="flex items-end justify-between mb-5 md:mb-7">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
                The difference, dragged
              </h3>
              <span className="text-[10.5px]" style={{ color: 'var(--c4-text-faint)' }}>
                Drag to compare · illustrative
              </span>
            </div>
            <BeforeAfterSlider
              beforeLabel="Off-the-shelf SaaS"
              afterLabel="Purpose-built"
              aspect="16 / 9"
              before={<BloatedMockup />}
              after={<LeanMockup />}
            />
            <p className="mt-4 text-[12.5px] leading-[1.6] max-w-[60ch]" style={{ color: 'var(--c4-text-muted)' }}>
              Generic platforms charge per seat for features you never touch — and nag you to upgrade.
              A purpose-built tool keeps only what your team uses, runs faster, and is yours to own.
            </p>
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
              to={createPageUrl('Support')}
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
