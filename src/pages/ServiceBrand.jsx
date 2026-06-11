import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PageHero from '../components/c4/PageHero';
import useDocumentHead from '@/hooks/useDocumentHead';

const ease = [0.22, 1, 0.36, 1];
const serif = "Georgia, 'Times New Roman', serif";

/*
 * Page motif: the printed specimen sheet. Brand work is editorial by
 * nature — so the page borrows from print: serif italics, oversized
 * quotation marks, type specimens and colour swatches in the margins.
 */

const offerings = [
  {
    code: 'B1',
    glyph: 'identity',
    title: 'Logo & Identity',
    price: 'From $800',
    timeline: '1–2 weeks',
    desc: 'A complete brand mark — logo, colour palette, typography, and usage guidelines. Built to work across every surface.',
    features: ['Primary logo + variants', 'Colour system', 'Typography pairing', 'Brand guidelines PDF'],
    param: 'brand_platform&package=brand-identity',
  },
  {
    code: 'B2',
    glyph: 'palette',
    title: 'Brand Platform',
    price: 'From $1,500',
    timeline: '2–4 weeks',
    desc: 'Full identity system with messaging, visual language, and everything your team needs to stay on-brand.',
    features: ['Logo & identity', 'Messaging framework', 'Social templates', 'Asset library'],
    param: 'brand_platform&package=brand-platform',
  },
  {
    code: 'B3',
    glyph: 'serp',
    title: 'SEO & Content',
    price: 'From $800/mo',
    timeline: 'Ongoing retainer',
    desc: 'Strategic SEO that earns rankings, and content that earns trust. Monthly strategy, execution, and reporting.',
    features: ['Keyword strategy', 'On-page SEO', 'Content calendar', 'Monthly reporting'],
    param: 'brand_platform&package=seo',
  },
  {
    code: 'B4',
    glyph: 'growth',
    title: 'Growth Strategy',
    price: 'From $1,200',
    timeline: '2–3 weeks',
    desc: 'Funnel design, growth experiments, and conversion optimisation for businesses ready to scale.',
    features: ['Funnel audit', 'CRO recommendations', 'Campaign setup', 'Analytics review'],
    param: 'brand_platform&package=growth',
  },
];

const process = [
  { step: '01', label: 'Discovery', desc: 'We learn your market, competitors, and what your brand needs to say.' },
  { step: '02', label: 'Direction', desc: 'Mood boards, naming frameworks, and strategic positioning.' },
  { step: '03', label: 'Design', desc: 'Visual identity crafted with purpose — every element deliberate.' },
  { step: '04', label: 'Deploy', desc: 'Files delivered, templates built, team briefed.' },
];

/* ── Margin glyphs — one tiny specimen per offering ── */

function GlyphIdentity({ active }) {
  return (
    <div className="flex items-baseline gap-1 select-none" aria-hidden="true">
      <span
        className="leading-none transition-colors duration-300"
        style={{ fontFamily: serif, fontSize: '34px', color: active ? 'var(--c4-accent)' : 'var(--c4-text)' }}
      >
        A
      </span>
      <span
        className="leading-none font-medium transition-colors duration-300"
        style={{ fontSize: '24px', color: active ? 'var(--c4-text)' : 'var(--c4-text-faint)' }}
      >
        a
      </span>
    </div>
  );
}

function GlyphPalette({ active }) {
  const swatches = [
    { c: 'var(--c4-accent)', r: -10, x: -7 },
    { c: 'var(--c4-text)', r: 0, x: 0 },
    { c: 'var(--c4-text-faint)', r: 10, x: 7 },
  ];
  return (
    <div className="relative h-9 w-12" aria-hidden="true">
      {swatches.map((s, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 w-5 h-8 rounded-[2px]"
          style={{
            backgroundColor: s.c,
            border: '1px solid var(--c4-bg)',
            transform: active
              ? `translate(calc(-50% + ${s.x * 1.8}px), -50%) rotate(${s.r * 1.6}deg)`
              : `translate(calc(-50% + ${s.x}px), -50%) rotate(${s.r}deg)`,
            transformOrigin: '50% 90%',
            transition: 'transform .45s cubic-bezier(.22,1,.36,1)',
            zIndex: i,
          }}
        />
      ))}
    </div>
  );
}

function GlyphSerp({ active }) {
  return (
    <div className="flex flex-col gap-[5px] w-12" aria-hidden="true">
      <span
        className="h-[4px] rounded-full"
        style={{
          backgroundColor: 'var(--c4-accent)',
          width: active ? '100%' : '70%',
          transition: 'width .45s cubic-bezier(.22,1,.36,1)',
        }}
      />
      <span className="h-[3px] rounded-full" style={{ backgroundColor: 'var(--c4-border)', width: '100%' }} />
      <span className="h-[3px] rounded-full" style={{ backgroundColor: 'var(--c4-border)', width: '55%' }} />
    </div>
  );
}

function GlyphGrowth({ active }) {
  const bars = [8, 13, 19, 26];
  return (
    <div className="flex items-end gap-[4px] h-9" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[6px] rounded-[1px]"
          style={{
            height: `${h}px`,
            backgroundColor: i === bars.length - 1 ? 'var(--c4-accent)' : 'var(--c4-text-faint)',
            transform: active ? 'scaleY(1)' : 'scaleY(0.55)',
            transformOrigin: 'bottom',
            transition: `transform .5s cubic-bezier(.22,1,.36,1) ${i * 60}ms`,
          }}
        />
      ))}
    </div>
  );
}

const GLYPHS = { identity: GlyphIdentity, palette: GlyphPalette, serp: GlyphSerp, growth: GlyphGrowth };

export default function ServiceBrand() {
  const [activeIndex, setActiveIndex] = useState(null);

  useDocumentHead({
    title: 'Brand & Growth — C4 Studios Perth',
    description:
      'Logo design, identity systems, SEO strategy and growth consulting for ambitious Perth brands. From first impression to sustained growth.',
    path: '/ServiceBrand',
  });

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <PageHero
        label="C2 — Brand & Growth"
        titleLines={[
          <span key="l1">Identity that earns</span>,
          <span key="l2">
            attention{' '}
            <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 400 }}>and trust.</em>
          </span>,
        ]}
        description="Branding, strategy, and growth systems — everything your brand needs to look right, rank well, and compound over time."
      >
        <div className="flex items-center gap-5">
          <Link
            to={createPageUrl('StartProject') + '?service=brand_platform'}
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
            See brand work
          </Link>
        </div>
      </PageHero>

      {/* Packages — editorial index rows with margin specimens */}
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
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.025em]">
              Four ways to build a{' '}
              <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 400 }}>better brand.</em>
            </h2>
          </motion.div>

          <div className="flex flex-col" style={{ borderTop: '1px solid var(--c4-border)' }}>
            {offerings.map((o, i) => {
              const isActive = activeIndex === i;
              const Glyph = GLYPHS[o.glyph];
              return (
                <motion.div
                  key={o.code}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.09, ease }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className="group relative grid grid-cols-1 md:grid-cols-[110px_1fr_auto] gap-6 md:gap-10 py-8 md:py-10 cursor-default transition-colors duration-300"
                  style={{
                    borderBottom: '1px solid var(--c4-border)',
                    backgroundColor: isActive ? 'var(--c4-bg-alt)' : 'transparent',
                    paddingLeft: isActive ? '12px' : '0px',
                    paddingRight: isActive ? '12px' : '0px',
                    marginLeft: isActive ? '-12px' : '0px',
                    marginRight: isActive ? '-12px' : '0px',
                  }}
                >
                  {/* Margin: code + specimen glyph */}
                  <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 pt-1">
                    <span
                      className="text-[10px] uppercase tracking-[0.2em] font-medium tabular-nums transition-colors duration-300"
                      style={{ color: isActive ? 'var(--c4-accent)' : 'var(--c4-text-faint)' }}
                    >
                      {o.code}
                    </span>
                    <Glyph active={isActive} />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-[1.1rem] font-semibold tracking-[-0.02em] mb-2">{o.title}</h3>
                    <p className="text-[13.5px] leading-[1.65] mb-5 max-w-[52ch]" style={{ color: 'var(--c4-text-muted)' }}>{o.desc}</p>
                    <ul className="flex flex-wrap gap-x-5 gap-y-2">
                      {o.features.map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--c4-text-muted)' }}>
                          <Check size={10} strokeWidth={2.5} style={{ color: 'var(--c4-accent)', flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing + CTA */}
                  <div className="flex flex-col items-start md:items-end justify-between gap-4 min-w-[130px]">
                    <div className="text-left md:text-right">
                      <p className="text-[1.1rem] font-semibold tabular-nums" style={{ color: 'var(--c4-text)' }}>{o.price}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--c4-text-faint)' }}>{o.timeline}</p>
                    </div>
                    <Link
                      to={`/start?service=${o.param}`}
                      className="group/cta inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.13em] font-medium transition-colors duration-200"
                      style={{ color: isActive ? 'var(--c4-text)' : 'var(--c4-text-subtle)' }}
                    >
                      Get started
                      <ArrowRight size={11} strokeWidth={2} className="group-hover/cta:translate-x-0.5 transition-transform duration-200" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pull quote — editorial, oversized mark */}
      <section className="py-16 md:py-24 border-t" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.blockquote
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="max-w-[760px] mx-auto text-center"
          >
            <span
              aria-hidden="true"
              className="block leading-[0.6] select-none mb-2"
              style={{ fontFamily: serif, fontSize: 'clamp(64px, 9vw, 110px)', color: 'var(--c4-accent)' }}
            >
              &ldquo;
            </span>
            <p
              className="leading-[1.45] tracking-[-0.01em]"
              style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(1.3rem,3vw,1.9rem)', color: 'var(--c4-text)' }}
            >
              A brand isn't a logo. It's the sum of every impression your business makes.
            </p>
            <div className="flex items-center justify-center gap-4 mt-7">
              <span className="w-8 h-px" style={{ backgroundColor: 'var(--c4-border)' }} />
              <cite className="text-[11px] uppercase tracking-[0.2em] not-italic" style={{ color: 'var(--c4-text-subtle)' }}>
                C4 Studios, Brand philosophy
              </cite>
              <span className="w-8 h-px" style={{ backgroundColor: 'var(--c4-border)' }} />
            </div>
          </motion.blockquote>
        </div>
      </section>

      {/* Process — editorial columns with serif numerals */}
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
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.025em]">
              From blank canvas to{' '}
              <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 400 }}>brand system.</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.09, ease }}
                className="pt-5"
                style={{ borderTop: '1px solid var(--c4-border)' }}
              >
                <p
                  className="mb-3 leading-none"
                  style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '2rem', color: 'var(--c4-text-faint)' }}
                >
                  {p.step}
                </p>
                <h3 className="text-[1rem] font-semibold mb-2 tracking-[-0.01em]">{p.label}</h3>
                <p className="text-[13px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>{p.desc}</p>
              </motion.div>
            ))}
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
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-semibold tracking-[-0.03em] mb-4 max-w-[600px] mx-auto">
              Your brand is doing the talking. Make sure it says{' '}
              <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 400 }}>the right thing.</em>
            </h2>
            <p className="text-[14px] mb-10" style={{ color: 'var(--c4-text-muted)' }}>
              Tell us where you are and where you're headed. We'll map the rest.
            </p>
            <Link
              to={createPageUrl('StartProject') + '?service=brand_platform'}
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
