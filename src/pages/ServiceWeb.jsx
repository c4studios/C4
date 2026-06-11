import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PageHero from '../components/c4/PageHero';
import useDocumentHead from '@/hooks/useDocumentHead';

const ease = [0.22, 1, 0.36, 1];

/*
 * Page motif: the browser viewport. Every package is shown as a tiny
 * site wireframe inside browser chrome — the silhouette tells you what
 * you're buying before you read a word.
 */

const packages = [
  {
    name: 'Landing Page',
    path: '/launch',
    price: '$500',
    timeline: '1–2 weeks',
    desc: 'Single-page site for campaigns, product launches, or lead capture.',
    features: ['Responsive design', 'SEO setup', 'Contact form', 'Analytics'],
    param: 'web_design&package=starter',
    popular: false,
    wire: [
      { x: 4, y: 6, w: 14, h: 4, t: 'soft' },
      { x: 70, y: 6.5, w: 26, h: 3, t: 'line' },
      { x: 22, y: 16, w: 56, h: 6, t: 'soft' },
      { x: 30, y: 25, w: 40, h: 3, t: 'line' },
      { x: 41, y: 32, w: 18, h: 6, t: 'accent' },
    ],
  },
  {
    name: 'Brochure Site',
    path: '/about',
    price: '$800',
    timeline: '2–3 weeks',
    desc: 'Multi-page site covering your full business story.',
    features: ['Up to 5 pages', 'CMS integration', 'SEO structure', 'Mobile-first'],
    param: 'web_design&package=brochure',
    popular: false,
    wire: [
      { x: 4, y: 5, w: 92, h: 4, t: 'soft' },
      { x: 4, y: 13, w: 16, h: 25, t: 'accent' },
      { x: 23, y: 13, w: 16, h: 25, t: 'soft' },
      { x: 42, y: 13, w: 16, h: 25, t: 'soft' },
      { x: 61, y: 13, w: 16, h: 25, t: 'soft' },
      { x: 80, y: 13, w: 16, h: 25, t: 'soft' },
    ],
  },
  {
    name: 'Business Website',
    path: '/grow',
    price: '$1,500',
    timeline: '3–4 weeks',
    desc: 'A polished, conversion-focused site that does the selling for you.',
    features: ['Up to 10 pages', 'Blog / content hub', 'Lead tracking', 'Performance optimised'],
    param: 'web_design&package=business',
    popular: true,
    wire: [
      { x: 4, y: 5, w: 92, h: 4, t: 'soft' },
      { x: 4, y: 14, w: 40, h: 5, t: 'soft' },
      { x: 4, y: 21, w: 32, h: 3, t: 'line' },
      { x: 4, y: 27, w: 14, h: 5, t: 'accent' },
      { x: 52, y: 13, w: 44, h: 20, t: 'soft' },
      { x: 4, y: 37, w: 28, h: 4, t: 'line' },
      { x: 36, y: 37, w: 28, h: 4, t: 'line' },
      { x: 68, y: 37, w: 28, h: 4, t: 'line' },
    ],
  },
  {
    name: 'Custom Website',
    path: '/bespoke',
    price: '$2,500',
    timeline: '4–6 weeks',
    desc: 'Fully tailored design and build for brands with exacting standards.',
    features: ['Bespoke design system', 'Advanced animations', 'Full CMS', 'Priority support'],
    param: 'web_design&package=custom',
    popular: false,
    wire: [
      { x: 4, y: 6, w: 52, h: 26, t: 'soft' },
      { x: 60, y: 10, w: 36, h: 12, t: 'line' },
      { x: 60, y: 26, w: 28, h: 8, t: 'soft' },
      { x: 44, y: 34, w: 20, h: 6, t: 'accent' },
      { x: 92, y: 6, w: 4, h: 4, t: 'accent' },
    ],
  },
  {
    name: 'Ecommerce Store',
    path: '/shop',
    price: '$3,500',
    timeline: '4–6 weeks',
    desc: 'A store built to convert — designed around your products and customers.',
    features: ['Product catalogue', 'Payment integration', 'Inventory management', 'Abandoned cart flows'],
    param: 'web_design&package=commerce-starter',
    popular: false,
    wire: [
      { x: 4, y: 5, w: 70, h: 4, t: 'soft' },
      { x: 88, y: 5, w: 8, h: 4, t: 'accent' },
      { x: 4, y: 13, w: 28, h: 11, t: 'soft' },
      { x: 36, y: 13, w: 28, h: 11, t: 'soft' },
      { x: 68, y: 13, w: 28, h: 11, t: 'soft' },
      { x: 4, y: 28, w: 28, h: 11, t: 'soft' },
      { x: 36, y: 28, w: 28, h: 11, t: 'soft' },
      { x: 68, y: 28, w: 28, h: 11, t: 'soft' },
    ],
  },
  {
    name: 'Web App Starter',
    path: '/app',
    price: '$4,500',
    timeline: '5–8 weeks',
    desc: 'Your SaaS or internal tool — fully designed, fully functional.',
    features: ['Auth & user accounts', 'Database design', 'Admin dashboard', 'API integrations'],
    param: 'web_design&package=web-application',
    popular: false,
    wire: [
      { x: 4, y: 5, w: 16, h: 35, t: 'soft' },
      { x: 24, y: 5, w: 72, h: 5, t: 'soft' },
      { x: 24, y: 14, w: 72, h: 4, t: 'line' },
      { x: 24, y: 21, w: 72, h: 4, t: 'line' },
      { x: 24, y: 28, w: 72, h: 4, t: 'line' },
      { x: 24, y: 35, w: 46, h: 5, t: 'accent' },
    ],
  },
];

const process = [
  { step: '01', label: 'Brief', desc: 'You describe the outcome you need. We ask the right questions.' },
  { step: '02', label: 'Design', desc: 'Wireframes and visual designs — reviewed and approved before build.' },
  { step: '03', label: 'Build', desc: 'Clean code, responsive layout, tested across devices.' },
  { step: '04', label: 'Launch', desc: 'Deployment, DNS, analytics, and a handover guide.' },
];

const included = [
  'Mobile-first responsive layout',
  'Basic SEO setup',
  'Performance optimised',
  'Cross-browser tested',
  'Founder reply within 1 business day',
  'Full code handover — you own it',
];

const wireFill = {
  soft: 'color-mix(in srgb, var(--c4-text) 9%, transparent)',
  line: 'color-mix(in srgb, var(--c4-text) 5%, transparent)',
  accent: 'color-mix(in srgb, var(--c4-accent) 75%, transparent)',
};

function WireframePreview({ blocks, active }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: '100 / 46', backgroundColor: 'var(--c4-bg-alt)' }}
      aria-hidden="true"
    >
      {blocks.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-[1.5px]"
          style={{
            left: `${b.x}%`,
            top: `${b.y * (100 / 46)}%`,
            width: `${b.w}%`,
            height: `${b.h * (100 / 46)}%`,
            backgroundColor: wireFill[b.t],
            opacity: active ? 1 : b.t === 'accent' ? 0.85 : 0.55,
            transform: active ? 'translateY(0)' : 'translateY(2.5px)',
            transition: `opacity .45s ease ${i * 40}ms, transform .45s cubic-bezier(.22,1,.36,1) ${i * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}

function BrowserChrome({ path, popular }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5"
      style={{ backgroundColor: 'var(--c4-bg-alt)', borderBottom: '1px solid var(--c4-border)' }}
    >
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {[0, 1, 2].map(i => (
          <span key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--c4-border)' }} />
        ))}
      </div>
      <div
        className="flex-1 min-w-0 px-3 py-1 rounded-full text-[10px] truncate"
        style={{
          backgroundColor: 'var(--c4-bg)',
          border: '1px solid var(--c4-border-light)',
          color: 'var(--c4-text-subtle)',
          fontFamily: 'monospace',
        }}
      >
        yourbrand.com.au<span style={{ color: 'var(--c4-accent)' }}>{path}</span>
      </div>
      {popular && (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] font-medium flex-shrink-0 rounded-[2px]"
          style={{ backgroundColor: 'var(--c4-accent)', color: '#fff' }}
        >
          <Star size={8} strokeWidth={2} />
          Popular
        </span>
      )}
    </div>
  );
}

export default function ServiceWeb() {
  const [hoverIndex, setHoverIndex] = useState(null);

  useDocumentHead({
    title: 'Web & Applications — C4 Studios Perth',
    description:
      'Custom websites, web apps, SaaS platforms and ecommerce stores. Built to convert, designed to last. Perth-based, working Australia-wide.',
    path: '/ServiceWeb',
  });

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <PageHero
        label="C1 — Web & Applications"
        titleLines={['Websites built to', 'convert and scale.']}
        description="From a crisp landing page to a full web application — every project is scoped clearly, designed carefully, and delivered on time."
      >
        <div className="flex items-center gap-5">
          <Link
            to={createPageUrl('StartProject') + '?service=web_design'}
            className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
            style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            Start a brief
            <ArrowRight size={12} strokeWidth={2} />
          </Link>
          <Link
            to={createPageUrl('Portfolio')}
            className="text-[11px] uppercase tracking-[0.14em] font-medium"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            See the work
          </Link>
        </div>
      </PageHero>

      {/* Included in every project */}
      <section className="py-10 md:py-12 border-b" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium flex-shrink-0" style={{ color: 'var(--c4-text-subtle)' }}>
              Every project includes
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {included.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease }}
                  className="inline-flex items-center gap-1.5 text-[12px]"
                  style={{ color: 'var(--c4-text-muted)' }}
                >
                  <Check size={10} strokeWidth={2.5} style={{ color: 'var(--c4-accent)' }} />
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packages — every tier rendered as a browser-framed wireframe */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mb-10 md:mb-14"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-1" style={{ color: 'var(--c4-text-subtle)' }}>Packages & Pricing</p>
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.025em]">Pick a starting point.</h2>
            <p className="mt-2 text-[13px]" style={{ color: 'var(--c4-text-muted)' }}>
              Each tier sketched to scale — what you see is the shape of what we build.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg, i) => {
              const isHovered = hoverIndex === i;
              return (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className="relative flex flex-col rounded-[4px] overflow-hidden transition-[box-shadow,transform] duration-300"
                  style={{
                    backgroundColor: 'var(--c4-bg)',
                    border: pkg.popular ? '1px solid var(--c4-accent)' : '1px solid var(--c4-border)',
                    transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow: isHovered ? '0 20px 50px -20px rgba(0,0,0,0.4)' : 'none',
                  }}
                >
                  <BrowserChrome path={pkg.path} popular={pkg.popular} />
                  <WireframePreview blocks={pkg.wire} active={isHovered} />

                  <div className="flex flex-col flex-1 p-7 md:p-8" style={{ borderTop: '1px solid var(--c4-border)' }}>
                    {/* Price — visual hero */}
                    <div className="mb-5 flex items-baseline justify-between">
                      <p
                        className="text-[1.8rem] md:text-[2.1rem] font-semibold tracking-[-0.04em] tabular-nums leading-[1]"
                        style={{ color: 'var(--c4-text)' }}
                      >
                        {pkg.price}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: 'var(--c4-text-faint)' }}>{pkg.timeline}</p>
                    </div>

                    <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] mb-2">{pkg.name}</h3>
                    <p className="text-[13px] leading-[1.65] mb-6" style={{ color: 'var(--c4-text-muted)' }}>{pkg.desc}</p>

                    <ul className="space-y-2 mb-8 flex-1">
                      {pkg.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-[12.5px]" style={{ color: 'var(--c4-text-muted)' }}>
                          <Check size={11} strokeWidth={2.5} style={{ color: 'var(--c4-accent)', flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={`/start?service=${pkg.param}`}
                      className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.13em] font-medium transition-colors duration-200"
                      style={{ color: isHovered ? 'var(--c4-text)' : 'var(--c4-text-subtle)' }}
                    >
                      Start this
                      <ArrowRight size={11} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process — build pipeline with connecting line */}
      <section className="py-16 md:py-20 border-t" style={{ borderColor: 'var(--c4-border)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mb-10 md:mb-14"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-1" style={{ color: 'var(--c4-text-subtle)' }}>Process</p>
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.025em]">Brief to launch, one pipeline.</h2>
          </motion.div>

          <div className="relative">
            {/* Track + animated progress line connecting the steps */}
            <div className="hidden sm:block absolute left-0 right-0 top-[14px] h-px" style={{ backgroundColor: 'var(--c4-border)' }} />
            <motion.div
              className="hidden sm:block absolute left-0 right-0 top-[14px] h-px origin-left"
              style={{ backgroundColor: 'var(--c4-accent)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.2, ease }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {process.map((p, i) => (
                <motion.div
                  key={p.step}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.18, ease }}
                  className="relative"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center mb-4 text-[10px] font-medium tabular-nums relative z-10"
                    style={{
                      backgroundColor: 'var(--c4-bg)',
                      border: '1px solid var(--c4-accent)',
                      color: 'var(--c4-accent)',
                    }}
                  >
                    {p.step}
                  </div>
                  <h3 className="text-[1rem] font-semibold mb-2 tracking-[-0.01em]">{p.label}</h3>
                  <p className="text-[13px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t" style={{ borderColor: 'var(--c4-border)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex items-center justify-center gap-1.5 mb-6" aria-hidden="true">
              {[0, 1, 2].map(i => (
                <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: i === 0 ? 'var(--c4-accent)' : 'var(--c4-border)' }} />
              ))}
            </div>
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-semibold tracking-[-0.03em] mb-4 max-w-[560px] mx-auto">
              Ready to build something worth showing?
            </h2>
            <p className="text-[14px] mb-10" style={{ color: 'var(--c4-text-muted)' }}>
              Send us a brief — we'll scope it, price it, and come back with a clear plan.
            </p>
            <Link
              to={createPageUrl('StartProject') + '?service=web_design'}
              className="inline-flex items-center gap-2 px-8 py-4 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              Start a project
              <ArrowRight size={12} strokeWidth={2} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
