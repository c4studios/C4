import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Globe, Palette, Sparkles, Camera } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

const choices = [
  { key: 'web', label: 'Build a website', to: '/start?service=web_design', icon: Globe },
  { key: 'brand', label: 'Build your brand', to: '/start?service=brand_platform', icon: Palette },
  { key: 'ai', label: 'Request AI automations', to: '/start?service=automation', icon: Sparkles },
  { key: 'lens', label: 'Book photography', to: '/start?service=lens', icon: Camera },
];

export default function FinalCTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section ref={ref} className="pb-24 pt-8 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-16 h-px md:mb-24" style={{ backgroundColor: 'var(--c4-border)' }} />

        <motion.div style={{ y, opacity }} className="grid gap-10 md:gap-14 md:grid-cols-[1.1fr_1fr] md:items-end">
          {/* Left — headline + general brief */}
          <div className="max-w-[560px]">
            <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-3" style={{ color: 'var(--c4-text-subtle)' }}>
              Pick a starting point
            </p>
            <h2 className="text-[1.6rem] md:text-[2.4rem] font-semibold tracking-[-0.035em] leading-[1.05]" style={{ color: 'var(--c4-text)' }}>
              Tell us what you’re building. We’ll come back with a clear next step.
            </h2>
            <p className="mt-4 text-[14px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
              Each link below opens a short brief with the right service preselected. Founder-led reply, usually within a business day.
            </p>
            <Link
              to={createPageUrl('StartProject')}
              className="group mt-7 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-medium"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              Or send a general brief
              <ArrowRight size={12} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Right — the three direct paths, stacked */}
          <ul role="list" className="flex flex-col" style={{ borderTop: '1px solid var(--c4-border)' }}>
            {choices.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.li
                  key={c.key}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease }}
                  style={{ borderBottom: '1px solid var(--c4-border)' }}
                >
                  <Link
                    to={c.to}
                    className="group flex items-center justify-between py-5 md:py-6 transition-colors duration-300 hover:bg-[var(--c4-bg-alt)] px-3 -mx-3 rounded-sm"
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--c4-accent) 14%, transparent)' }}
                      >
                        <Icon size={16} strokeWidth={1.5} style={{ color: 'var(--c4-accent)' }} />
                      </span>
                      <span className="text-[1.05rem] md:text-[1.15rem] font-semibold tracking-[-0.015em]" style={{ color: 'var(--c4-text)' }}>
                        {c.label}
                      </span>
                    </span>
                    <ArrowRight
                      size={15}
                      strokeWidth={2}
                      className="opacity-30 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                      style={{ color: 'var(--c4-text)' }}
                    />
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
