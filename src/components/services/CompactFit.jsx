import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

const profiles = [
  {
    label: 'Ambitious brand',
    description: 'You care about how you\'re perceived online and want a digital presence that matches your standards.',
    services: ['Websites', 'Brand Platforms'],
  },
  {
    label: 'Launching a product',
    description: 'You\'re building something new and need design and engineering that can move fast without cutting corners.',
    services: ['Web Applications', 'Websites'],
  },
  {
    label: 'Replacing a template',
    description: 'You\'ve outgrown your off‑the‑shelf site and need something custom‑built that actually reflects your business.',
    services: ['Websites', 'Brand Platforms'],
  },
  {
    label: 'Scaling operations',
    description: 'You need automation, tooling, or smarter workflows to reduce manual work and move faster.',
    services: ['Automation & AI', 'Web Applications'],
  },
  {
    label: 'Cutting software costs',
    description: 'You\'re paying too much for bloated tools and want lean alternatives that do exactly what you need.',
    services: ['Software Rebuilds', 'Automation & AI'],
  },
  {
    label: 'Growing revenue',
    description: 'Your site exists but isn\'t performing. You need better conversion, SEO, or user flow optimisation.',
    services: ['Growth & Optimisation', 'Websites'],
  },
];

function ProfileChip({ profile, isSelected, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative px-4 py-2.5 text-[13px] font-medium rounded-sm border transition-all duration-300 text-left"
      style={isSelected
        ? { backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)', borderColor: 'var(--c4-text)' }
        : { backgroundColor: 'color-mix(in srgb, var(--c4-card-bg) 60%, transparent)', color: 'var(--c4-text-muted)', borderColor: 'var(--c4-border-light)' }
      }
      whileTap={{ scale: 0.97 }}
    >
      {profile.label}
    </motion.button>
  );
}

export default function CompactFit() {
  const [selected, setSelected] = useState(null);
  const activeProfile = selected !== null ? profiles[selected] : null;

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.2em] font-medium mb-3"
          style={{ color: 'var(--c4-text-subtle)' }}
        >
          Who We Work Best With
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-[14px] leading-[1.6] mb-8 max-w-[420px]"
          style={{ color: 'var(--c4-text-muted)' }}
        >
          Select what describes you best. We'll show you the most relevant services.
        </motion.p>

        <div className="flex flex-wrap gap-2.5 mb-8">
          {profiles.map((p, i) => (
            <ProfileChip
              key={p.label}
              profile={p}
              isSelected={selected === i}
              onClick={() => setSelected(selected === i ? null : i)}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeProfile && (
            <motion.div
              key={activeProfile.label}
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.35, ease }}
              className="overflow-hidden"
            >
              <div className="border rounded-sm p-6 md:p-8" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
                <div className="grid md:grid-cols-12 gap-6 md:gap-10">
                  <div className="md:col-span-7">
                    <p className="text-[15px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
                      {activeProfile.description}
                    </p>
                  </div>
                  <div className="md:col-span-5">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3" style={{ color: 'var(--c4-text-subtle)' }}>
                      Recommended services
                    </div>
                    <div className="space-y-2">
                      {activeProfile.services.map((s) => (
                        <div key={s} className="flex items-center gap-2.5 text-[14px] font-medium" style={{ color: 'var(--c4-text)' }}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }} />
                          {s}
                        </div>
                      ))}
                    </div>
                    <Link
                      to={createPageUrl('StartProject')}
                      className="group inline-flex items-center gap-2 mt-5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
                      style={{ color: 'var(--c4-text)' }}
                    >
                      Start a conversation
                      <ArrowRight size={12} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}