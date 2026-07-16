/**
 * C4i — the AI pillar's front door.
 *
 * Deliberately sleek and near-empty: one question, two answers. "Local" sends
 * you to the private, on-your-own-hardware system (the Private AI page). "Cloud"
 * sends you to cloud-based automations, agents and custom software (the AI &
 * Software page). Both destinations keep their own bespoke design; this page is
 * just the fork.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ServerCog, Cloud } from 'lucide-react';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';

const ease = [0.22, 1, 0.36, 1];

const OPTIONS = [
  {
    key: 'local',
    kicker: 'On your own hardware',
    title: 'Local',
    body: 'A private AI system installed on a dedicated machine inside your office. Your documents are indexed and answered locally. Nothing leaves the building.',
    to: '/private-ai',
    icon: ServerCog,
  },
  {
    key: 'cloud',
    kicker: 'Automations, agents & software',
    title: 'Cloud based',
    body: 'Workflow automations, AI agents and custom internal tools built on the strongest cloud models, integrated into the software you already use.',
    to: '/ServiceAI',
    icon: Cloud,
  },
];

// Stable module-level ref so the head hook doesn't re-run each render.
const C4I_JSONLD = [
  serviceSchema({
    name: 'C4i — AI Systems & Automation',
    description:
      'Private on-premise AI, cloud automations, AI agents and custom software for Perth businesses.',
    url: '/c4i',
    serviceType: 'AI systems and automation',
  }),
  breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'C4i', path: '/c4i' },
  ]),
];

export default function C4i() {
  const [hover, setHover] = useState(null);

  useDocumentHead({
    title: 'C4i — AI, local or cloud | C4 Studios',
    description:
      'C4i is C4 Studios’ AI practice. Choose a private AI system on your own hardware, or cloud-based automations, agents and custom software. Perth-built.',
    path: '/c4i',
    jsonLd: C4I_JSONLD,
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-28 md:py-36"
      style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}
    >
      <div className="w-full max-w-[1000px]">
        {/* Header — a single question, quietly stated */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-14 md:mb-20"
        >
          <p
            className="text-[15px] tracking-[0.02em] font-semibold mb-6 italic"
            style={{ color: 'var(--c4-accent)' }}
          >
            C4i
          </p>
          <h1
            className="text-[clamp(2rem,5vw,3.4rem)] font-semibold tracking-[-0.035em] leading-[1.05]"
            style={{ color: 'var(--c4-text)' }}
          >
            AI, on your terms.
          </h1>
          <p
            className="mt-5 text-[15px] md:text-[16px] leading-[1.6] max-w-[46ch] mx-auto"
            style={{ color: 'var(--c4-text-muted)' }}
          >
            Two ways to put capable AI to work in your business. Pick the one that fits.
          </p>
        </motion.div>

        {/* Two options */}
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
          {OPTIONS.map((opt, i) => {
            const Icon = opt.icon;
            const active = hover === i;
            return (
              <motion.div
                key={opt.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease }}
              >
                <Link
                  to={opt.to}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className="group relative flex h-full flex-col rounded-2xl p-8 md:p-10 transition-[transform,border-color,box-shadow] duration-500"
                  style={{
                    backgroundColor: 'var(--c4-bg-alt)',
                    border: '1px solid var(--c4-border)',
                    transform: active ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: active ? '0 30px 70px -30px rgba(0,0,0,0.5)' : 'none',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-8 transition-transform duration-500"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--c4-accent) 14%, transparent)',
                      transform: active ? 'scale(1.06) rotate(-4deg)' : 'scale(1) rotate(0)',
                    }}
                  >
                    <Icon size={22} strokeWidth={1.5} style={{ color: 'var(--c4-accent)' }} />
                  </div>

                  <p
                    className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3"
                    style={{ color: 'var(--c4-accent)' }}
                  >
                    {opt.kicker}
                  </p>
                  <h2
                    className="text-[1.7rem] md:text-[2rem] font-semibold tracking-[-0.03em] leading-[1.05] mb-4"
                    style={{ color: 'var(--c4-text)' }}
                  >
                    {opt.title}
                  </h2>
                  <p
                    className="text-[13.5px] leading-[1.7] mb-8 flex-1"
                    style={{ color: 'var(--c4-text-muted)' }}
                  >
                    {opt.body}
                  </p>

                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-medium"
                    style={{ color: 'var(--c4-text)' }}
                  >
                    {opt.title === 'Local' ? 'See the private system' : 'See cloud AI & software'}
                    <ArrowUpRight
                      size={13}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="mt-12 text-center text-[12px]"
          style={{ color: 'var(--c4-text-subtle)' }}
        >
          Not sure which fits?{' '}
          <Link
            to={createPageUrl('StartProject') + '?service=automation'}
            className="underline underline-offset-2"
            style={{ color: 'var(--c4-text-muted)' }}
          >
            Tell us what you need
          </Link>{' '}
          and we will point you the right way.
        </motion.p>
      </div>
    </div>
  );
}
