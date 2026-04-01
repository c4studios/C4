import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

const heroSignals = [
  'Brand films',
  'Launch visuals',
  'Web-ready motion',
  'Campaign edits',
];

const pillars = [
  {
    number: '01',
    title: 'Cinematic restraint',
    description: 'No overcutting, no fake hype, no generic sizzle. The visual language stays sharp, composed and intentional.',
  },
  {
    number: '02',
    title: 'Designed for conversion',
    description: 'Every sequence is planned around where the footage actually lives: landing pages, paid ads, case studies, reels and launch assets.',
  },
  {
    number: '03',
    title: 'Built into the brand system',
    description: 'C4 Lens is not separate from the studio. The footage, edit direction and rollout all connect back to the wider brand and site strategy.',
  },
];

const deliverables = [
  'Hero video systems for premium landing pages',
  'Short-form content suites for product drops and social cutdowns',
  'Founder-led brand pieces with interview, environment and detail coverage',
  'Location and service captures that make the business feel tangible',
];

const process = [
  {
    step: 'Direction',
    detail: 'We shape the angle first: audience, tone, distribution, and the emotional job the footage needs to do.',
  },
  {
    step: 'Capture',
    detail: 'A focused shoot with a tight brief, decisive coverage, and enough flexibility to catch the moments that actually matter.',
  },
  {
    step: 'Cut + rollout',
    detail: 'Edits are prepared for the real deployment surface, whether that is a homepage hero, an offer page, or a campaign asset stack.',
  },
];

export default function Lens() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <section className="relative pt-28 pb-18 md:pt-36 md:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 14% 18%, color-mix(in srgb, var(--c4-accent) 24%, transparent) 0%, transparent 34%), radial-gradient(circle at 84% 20%, rgba(255,255,255,0.12) 0%, transparent 28%), linear-gradient(180deg, color-mix(in srgb, var(--c4-card-bg) 84%, transparent) 0%, transparent 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10rem] top-20 h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{ backgroundColor: 'color-mix(in srgb, var(--c4-accent) 18%, transparent)' }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <div
                className="inline-flex items-center gap-3 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.22em]"
                style={{
                  border: '1px solid var(--c4-border)',
                  backgroundColor: 'color-mix(in srgb, var(--c4-card-bg) 90%, transparent)',
                  color: 'var(--c4-text-muted)',
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }} />
                Motion direction for ambitious brands
              </div>

              <h1
                className="mt-8 max-w-[10ch] font-semibold uppercase tracking-[-0.055em] leading-[0.9] text-[4.2rem] sm:text-[5.6rem] md:text-[7.6rem] lg:text-[9rem]"
                style={{ color: 'var(--c4-text)' }}
              >
                C4 Lens
              </h1>

              <p
                className="mt-6 max-w-[620px] text-[15px] leading-[1.8] md:text-[18px]"
                style={{ color: 'var(--c4-text-muted)' }}
              >
                A sharper motion offering for businesses that want presence, atmosphere and proof, not throwaway video. Built for premium launches, high-trust websites and brand moments that need to feel expensive before a word is read.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {heroSignals.map((item) => (
                  <span
                    key={item}
                    className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em]"
                    style={{
                      border: '1px solid var(--c4-border)',
                      backgroundColor: 'color-mix(in srgb, var(--c4-card-bg) 94%, transparent)',
                      color: 'var(--c4-text-subtle)',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={createPageUrl('StartProject')}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-opacity duration-300"
                  style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                >
                  Start a Lens project
                  <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to={createPageUrl('Support')}
                  className="inline-flex items-center justify-center px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
                  style={{ border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
                >
                  Ask about availability
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease }}
              className="relative"
            >
              <div
                className="relative overflow-hidden rounded-[28px] p-6 md:p-8"
                style={{
                  border: '1px solid var(--c4-border)',
                  background: 'linear-gradient(160deg, color-mix(in srgb, var(--c4-card-bg) 90%, transparent) 0%, color-mix(in srgb, var(--c4-accent) 10%, var(--c4-card-bg)) 100%)',
                  boxShadow: '0 18px 50px rgba(0,0,0,0.08)',
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-[22px] p-5 sm:col-span-2" style={{ backgroundColor: 'color-mix(in srgb, var(--c4-bg) 58%, transparent)' }}>
                    <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--c4-text-subtle)' }}>
                      Positioning statement
                    </p>
                    <p className="mt-4 max-w-[24ch] text-[1.55rem] font-semibold tracking-[-0.04em] leading-[1.02]" style={{ color: 'var(--c4-text)' }}>
                      Film language, edited for the web instead of forced onto it.
                    </p>
                  </div>

                  <div className="rounded-[22px] p-5 min-h-[11rem]" style={{ backgroundColor: 'color-mix(in srgb, var(--c4-card-bg) 78%, transparent)' }}>
                    <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--c4-text-subtle)' }}>
                      Built for
                    </p>
                    <p className="mt-3 text-[1.05rem] leading-[1.45]" style={{ color: 'var(--c4-text)' }}>
                      Launches, premium service businesses, founder brands and website experiences that need more than static presentation.
                    </p>
                  </div>

                  <div className="rounded-[22px] p-5 min-h-[11rem]" style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}>
                    <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">
                      Engagement model
                    </p>
                    <p className="mt-3 text-[1.35rem] font-semibold tracking-[-0.03em] leading-[1.08]">
                      Focused, high-attention productions shaped around where the final assets need to perform.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="grid gap-10 border-t pt-10 md:grid-cols-[0.7fr_1.3fr] md:pt-14"
            style={{ borderColor: 'var(--c4-border)' }}
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: 'var(--c4-text-subtle)' }}>
                The proposition
              </p>
              <h2 className="mt-4 max-w-[10ch] text-[2rem] font-semibold tracking-[-0.05em] leading-[0.95] md:text-[3.2rem]" style={{ color: 'var(--c4-text)' }}>
                This is not a generic production service.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.number}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.5, delay: index * 0.06, ease }}
                  className="rounded-[24px] p-6"
                  style={{
                    border: '1px solid var(--c4-border)',
                    backgroundColor: 'var(--c4-card-bg)',
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--c4-text-faint)' }}>
                    {pillar.number}
                  </p>
                  <h3 className="mt-5 text-[1.15rem] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.72]" style={{ color: 'var(--c4-text-muted)' }}>
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="rounded-[28px] p-7 md:p-9"
              style={{
                backgroundColor: 'var(--c4-text)',
                color: 'var(--c4-bg)',
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Outcome</p>
              <h2 className="mt-5 max-w-[12ch] text-[2rem] font-semibold tracking-[-0.05em] leading-[0.96] md:text-[3rem]">
                Motion assets designed to carry trust.
              </h2>
              <p className="mt-5 max-w-[46ch] text-[14px] leading-[1.78] opacity-80 md:text-[15px]">
                The goal is not just footage that looks good in isolation. The goal is footage that upgrades the whole brand experience: clearer launches, richer pages, stronger first impressions and better visual proof.
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {deliverables.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease }}
                  className="rounded-[24px] p-6"
                  style={{
                    border: '1px solid var(--c4-border)',
                    backgroundColor: 'color-mix(in srgb, var(--c4-card-bg) 96%, transparent)',
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--c4-text-faint)' }}>
                    Deliverable {index + 1}
                  </p>
                  <p className="mt-4 text-[15px] leading-[1.68]" style={{ color: 'var(--c4-text)' }}>
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="rounded-[30px] border px-6 py-8 md:px-10 md:py-12"
            style={{
              borderColor: 'var(--c4-border)',
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--c4-card-bg) 94%, transparent) 0%, color-mix(in srgb, var(--c4-accent) 8%, var(--c4-bg)) 100%)',
            }}
          >
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: 'var(--c4-text-subtle)' }}>
                  Process
                </p>
                <h2 className="mt-4 max-w-[9ch] text-[2rem] font-semibold tracking-[-0.05em] leading-[0.95] md:text-[3rem]" style={{ color: 'var(--c4-text)' }}>
                  Small intake. High control.
                </h2>
              </div>

              <div role="list">
                {process.map((item, index) => (
                  <motion.div
                    key={item.step}
                    role="listitem"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.5, delay: index * 0.05, ease }}
                    className="grid gap-3 border-t py-6 md:grid-cols-[120px_1fr]"
                    style={{ borderColor: 'var(--c4-border)' }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--c4-text-faint)' }}>
                      {item.step}
                    </p>
                    <p className="max-w-[58ch] text-[15px] leading-[1.74]" style={{ color: 'var(--c4-text)' }}>
                      {item.detail}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="grid gap-8 border-t pt-10 md:grid-cols-[1fr_auto] md:items-end md:pt-14"
            style={{ borderColor: 'var(--c4-border)' }}
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--c4-text-subtle)' }}>
                Availability
              </p>
              <h2 className="mt-4 max-w-[14ch] text-[2rem] font-semibold tracking-[-0.05em] leading-[0.96] md:text-[3.1rem]" style={{ color: 'var(--c4-text)' }}>
                If the brand has weight, the visuals should too.
              </h2>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.78]" style={{ color: 'var(--c4-text-muted)' }}>
                If you need launch visuals, founder-led motion, or website-ready footage that feels deliberate instead of disposable, send the brief and we will tell you quickly how it can be shaped.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch">
              <Link
                to={createPageUrl('StartProject')}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-opacity duration-300"
                style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
              >
                Start a project
                <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to={createPageUrl('Portfolio')}
                className="inline-flex items-center justify-center px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
                style={{ border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
              >
                View portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
