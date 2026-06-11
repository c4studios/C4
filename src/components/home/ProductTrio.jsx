/**
 * ProductTrio — three product calls-to-action below the home hero.
 *
 * Each card surfaces what someone actually buys (a website, an AI
 * automation, professional photography), the entry price, the
 * typical timeframe, and a one-click path to the brief form with
 * the right service preselected. A small "See details" link sends
 * users who want to compare to the relevant service / Lens page.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Globe, Sparkles, Camera, Palette, Users, Eye, Clock, MapPin } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const products = [
  {
    key: 'web',
    code: 'C1',
    eyebrow: 'Web design & development',
    headline: 'Build a website',
    outcome:
      'Custom marketing sites, web apps and SaaS platforms — fast, refined, and built to convert. You own the codebase end-to-end.',
    fromPrice: 'From $500',
    timeframe: '2–3 weeks',
    icon: Globe,
    primaryCta: { label: 'Start a website brief', to: '/start?service=web_design' },
    secondary: { label: 'See web packages', to: '/ServiceWeb' },
  },
  {
    key: 'brand',
    code: 'C2',
    eyebrow: 'Brand & growth',
    headline: 'Build your brand',
    outcome:
      'Logo, identity systems, SEO and content strategy — everything your brand needs to look right, rank well, and stay visible.',
    fromPrice: 'From $800',
    timeframe: '2–4 weeks',
    icon: Palette,
    primaryCta: { label: 'Start a brand brief', to: '/start?service=brand_platform' },
    secondary: { label: 'See brand packages', to: '/ServiceBrand' },
  },
  {
    key: 'ai',
    code: 'C3',
    eyebrow: 'AI & automation',
    headline: 'Automate your work',
    outcome:
      'Workflow automations, AI agents and custom internal tools that replace manual work and compound over time.',
    fromPrice: 'From $750',
    timeframe: '1–4 weeks',
    icon: Sparkles,
    primaryCta: { label: 'Brief an automation', to: '/start?service=automation' },
    secondary: { label: 'See AI packages', to: '/ServiceAI' },
  },
  {
    key: 'lens',
    code: 'C4',
    eyebrow: 'C4 Lens',
    headline: 'Professional photography',
    outcome:
      'Brand photography, headshots, product imagery and short-form video for Perth businesses ready to retire stock.',
    fromPrice: 'From $200',
    timeframe: 'Half / full-day shoots',
    icon: Camera,
    primaryCta: { label: 'Book a shoot', to: '/start?service=lens' },
    secondary: { label: 'Visit C4 Lens', to: '/Lens' },
  },
];

const proofPoints = [
  { icon: Users, value: '50+', label: 'Perth businesses served' },
  { icon: Eye, value: '200+', label: 'Assets delivered' },
  { icon: Clock, value: '<7', label: 'Day turnaround' },
  { icon: MapPin, value: '100%', label: 'Founder-led' },
];

export default function ProductTrio() {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <section
      aria-labelledby="home-products-heading"
      className="relative py-20 md:py-28"
      style={{ backgroundColor: 'var(--c4-bg)' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease }}
          className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.2em] font-medium mb-3"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              C4 Services
            </p>
            <h2
              id="home-products-heading"
              className="text-[1.6rem] md:text-[2.2rem] font-semibold tracking-[-0.03em] leading-[1.05] max-w-[24ch]"
              style={{ color: 'var(--c4-text)' }}
            >
              Four services. One studio. Pick a starting point.
            </h2>
          </div>
          <p className="text-[13.5px] leading-[1.65] max-w-[34ch]" style={{ color: 'var(--c4-text-muted)' }}>
            Most clients start with one of these. Each card opens a short brief — fixed scope, transparent pricing, founder reply within a business day.
          </p>
        </motion.div>

        {/* Product cards */}
        <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => {
            const Icon = p.icon;
            const isActive = hoverIndex === i;
            return (
              <motion.article
                key={p.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.07, ease }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="group relative flex h-full flex-col rounded-2xl p-7 md:p-8 transition-[transform,border-color,box-shadow] duration-500"
                style={{
                  backgroundColor: 'var(--c4-bg-alt)',
                  border: '1px solid var(--c4-border)',
                  transform: isActive ? 'translateY(-3px)' : 'translateY(0)',
                  boxShadow: isActive ? '0 24px 60px -28px rgba(0,0,0,0.45)' : 'none',
                }}
              >
                {/* Numerical + icon header */}
                <div className="flex items-center justify-between mb-7 md:mb-8">
                  <span
                    className="text-[11px] font-mono tracking-wider"
                    style={{ color: 'var(--c4-accent)' }}
                  >
                    {p.code}
                  </span>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-500"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--c4-accent) 14%, transparent)',
                      transform: isActive ? 'rotate(-6deg) scale(1.05)' : 'rotate(0) scale(1)',
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} style={{ color: 'var(--c4-accent)' }} />
                  </div>
                </div>

                <p
                  className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3"
                  style={{ color: 'var(--c4-accent)' }}
                >
                  {p.eyebrow}
                </p>
                <h3
                  className="text-[1.5rem] md:text-[1.7rem] font-semibold tracking-[-0.025em] leading-[1.05] mb-3"
                  style={{ color: 'var(--c4-text)' }}
                >
                  {p.headline}
                </h3>
                <p
                  className="text-[13.5px] leading-[1.65] mb-5"
                  style={{ color: 'var(--c4-text-muted)' }}
                >
                  {p.outcome}
                </p>

                {/* Price + timeframe row */}
                <div
                  className="flex items-center gap-3 mb-6 pb-6 text-[11px] uppercase tracking-[0.16em] font-medium"
                  style={{ borderBottom: '1px solid var(--c4-border)' }}
                >
                  <span style={{ color: 'var(--c4-text)' }}>{p.fromPrice}</span>
                  <span aria-hidden="true" style={{ color: 'var(--c4-border)' }}>/</span>
                  <span style={{ color: 'var(--c4-text-subtle)' }}>{p.timeframe}</span>
                </div>

                {/* CTAs — primary direct-to-brief, secondary to detail */}
                <div className="mt-auto flex items-center justify-between gap-4">
                  <Link
                    to={p.primaryCta.to}
                    className="group/cta inline-flex items-center gap-2 px-5 py-3 text-[11px] uppercase tracking-[0.16em] font-medium rounded-full transition-transform duration-300"
                    style={{
                      backgroundColor: 'var(--c4-text)',
                      color: 'var(--c4-bg)',
                      transform: isActive ? 'translateX(2px)' : 'translateX(0)',
                    }}
                  >
                    {p.primaryCta.label}
                    <ArrowRight
                      size={13}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover/cta:translate-x-0.5"
                    />
                  </Link>
                  <Link
                    to={p.secondary.to}
                    className="group/sec inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] font-medium transition-opacity duration-300"
                    style={{ color: 'var(--c4-text-subtle)' }}
                  >
                    {p.secondary.label}
                    <ArrowUpRight
                      size={12}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover/sec:translate-x-0.5 group-hover/sec:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Trust strip — quiet but concrete proof under the trio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="mt-14 md:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 pt-10"
          style={{ borderTop: '1px solid var(--c4-border)' }}
        >
          {proofPoints.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.label} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--c4-accent) 12%, transparent)' }}
                >
                  <Icon size={14} strokeWidth={1.5} style={{ color: 'var(--c4-accent)' }} />
                </div>
                <div>
                  <p
                    className="text-[1.2rem] font-semibold tracking-[-0.03em] leading-[1.1]"
                    style={{ color: 'var(--c4-text)' }}
                  >
                    {p.value}
                  </p>
                  <p
                    className="mt-0.5 text-[10.5px] uppercase tracking-[0.16em]"
                    style={{ color: 'var(--c4-text-subtle)' }}
                  >
                    {p.label}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
