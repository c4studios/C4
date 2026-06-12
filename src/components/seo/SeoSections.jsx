import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionLabel from '@/components/c4/SectionLabel';
import { webPricingGuides, ASTERISK_CLAUSE } from '@/data/pricing';
import { resolveLiveSlugs } from '@/content/seo/registry';

const ease = [0.22, 1, 0.36, 1];

/* ── Shared shells ─────────────────────────────────────────────────── */

function SectionShell({ children }) {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">{children}</div>
    </section>
  );
}

function Reveal({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ label, heading }) {
  return (
    <div className="mb-7 md:mb-9">
      {label && (
        <div className="mb-3">
          <SectionLabel text={label} />
        </div>
      )}
      {heading && (
        <h2
          className="text-[1.45rem] md:text-[1.85rem] font-semibold tracking-[-0.025em] leading-[1.15] max-w-[720px]"
          style={{ color: 'var(--c4-text)' }}
        >
          {heading}
        </h2>
      )}
    </div>
  );
}

function Paragraphs({ body = [], size = 'base' }) {
  const cls = size === 'lg'
    ? 'text-[15px] md:text-[16px] leading-[1.75]'
    : 'text-[14px] leading-[1.75]';
  return (
    <div className="space-y-4 max-w-[680px]">
      {body.map((p, i) => (
        <p key={i} className={cls} style={{ color: 'var(--c4-text-muted)' }}>{p}</p>
      ))}
    </div>
  );
}

/* ── Section kinds ─────────────────────────────────────────────────── */

function AnswerSection({ section }) {
  return (
    <SectionShell>
      <Reveal>
        <div
          className="max-w-[760px] border-l-2 pl-6 md:pl-8 py-1"
          style={{ borderColor: 'var(--c4-accent)' }}
        >
          <span className="block text-[10px] uppercase tracking-[0.25em] font-medium mb-3" style={{ color: 'var(--c4-text-subtle)' }}>
            The short answer
          </span>
          <div className="space-y-4">
            {(section.body || []).map((p, i) => (
              <p key={i} className="text-[15px] md:text-[17px] leading-[1.7] font-medium" style={{ color: 'var(--c4-text)' }}>{p}</p>
            ))}
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}

function ProseSection({ section }) {
  return (
    <SectionShell>
      <Reveal>
        <SectionHeading label={section.label} heading={section.heading} />
        <Paragraphs body={section.body} />
      </Reveal>
    </SectionShell>
  );
}

function ListSection({ section }) {
  return (
    <SectionShell>
      <Reveal>
        <SectionHeading label={section.label} heading={section.heading} />
        {section.intro && <div className="mb-8"><Paragraphs body={[section.intro]} /></div>}
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(section.items || []).map((item, i) => (
          <Reveal key={i}>
            <div
              className="h-full p-6 border transition-colors duration-300"
              style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
            >
              <h3 className="text-[14px] font-medium mb-2" style={{ color: 'var(--c4-text)' }}>{item.title}</h3>
              <p className="text-[13px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ProcessSection({ section }) {
  return (
    <SectionShell>
      <Reveal>
        <SectionHeading label={section.label} heading={section.heading} />
      </Reveal>
      <div className="max-w-[760px]">
        {(section.steps || []).map((step, i) => (
          <Reveal key={i}>
            <div className="flex gap-6 py-5 border-t" style={{ borderColor: 'var(--c4-border)' }}>
              <span
                className="shrink-0 text-[12px] font-medium tabular-nums pt-0.5"
                style={{ color: 'var(--c4-accent)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[14px] font-medium mb-1.5" style={{ color: 'var(--c4-text)' }}>{step.title}</h3>
                <p className="text-[13.5px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>{step.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ProofSection({ section }) {
  return (
    <SectionShell>
      <Reveal>
        <SectionHeading label={section.label || 'Proof'} heading={section.heading} />
      </Reveal>
      <div className="grid sm:grid-cols-2 gap-4 max-w-[920px]">
        {(section.cases || []).map((c, i) => (
          <Reveal key={i}>
            <div
              className="h-full p-6 md:p-7 border"
              style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
            >
              {c.tag && (
                <span className="inline-block text-[9.5px] uppercase tracking-[0.2em] font-medium mb-3 px-2 py-1" style={{ color: 'var(--c4-text-subtle)', backgroundColor: 'var(--c4-tag-bg)' }}>
                  {c.tag}
                </span>
              )}
              <h3 className="text-[15px] font-semibold mb-2" style={{ color: 'var(--c4-text)' }}>{c.name}</h3>
              <p className="text-[13.5px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>{c.summary}</p>
              {c.href && (
                <Link
                  to={c.href}
                  className="group inline-flex items-center gap-1.5 mt-4 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
                  style={{ color: 'var(--c4-text)' }}
                >
                  View the work
                  <ArrowRight size={12} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function PricingSection({ section }) {
  const [costGuide] = resolveLiveSlugs(['how-much-does-a-website-cost-perth']);

  return (
    <SectionShell>
      <Reveal>
        <SectionHeading label={section.label || 'Pricing'} heading={section.heading} />
      </Reveal>

      {section.mode === 'range' ? (
        <div className="grid sm:grid-cols-3 gap-4 max-w-[920px]">
          {webPricingGuides.map((guide) => (
            <Reveal key={guide.key}>
              <div className="h-full p-6 border" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
                <span className="block text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: 'var(--c4-text-subtle)' }}>{guide.label}</span>
                <span className="block text-[1.5rem] font-semibold tracking-[-0.02em] mb-3" style={{ color: 'var(--c4-text)' }}>{guide.range}</span>
                <p className="text-[12.5px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>{guide.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="max-w-[760px] p-7 md:p-9 border" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[2.2rem] md:text-[2.6rem] font-semibold tracking-[-0.03em] leading-none" style={{ color: 'var(--c4-text)' }}>$1,500</span>
              <span className="text-[13px]" style={{ color: 'var(--c4-text-muted)' }}>is where most business websites start.</span>
            </div>
            <p className="mt-4 text-[13.5px] leading-[1.7] max-w-[560px]" style={{ color: 'var(--c4-text-muted)' }}>
              {section.note || 'Simpler landing pages start lower, and ecommerce or web apps scale up from there — the price follows the scope, not the other way around.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link
                to="/ServiceWeb"
                className="group inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-medium"
                style={{ color: 'var(--c4-text)' }}
              >
                See every package
                <ArrowRight size={12} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
              </Link>
              {costGuide && (
                <Link
                  to={`/${costGuide.slug}`}
                  className="text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300 hover:brightness-125"
                  style={{ color: 'var(--c4-text-subtle)' }}
                >
                  Read the full cost guide
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      )}

      {section.mode === 'range' && (
        <Reveal>
          <p className="mt-5 text-[11.5px] leading-[1.6] max-w-[760px]" style={{ color: 'var(--c4-text-faint)' }}>{ASTERISK_CLAUSE}</p>
        </Reveal>
      )}
    </SectionShell>
  );
}

function TableSection({ section }) {
  return (
    <SectionShell>
      <Reveal>
        <SectionHeading label={section.label} heading={section.heading} />
        <div className="overflow-x-auto max-w-[920px]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--c4-border)' }}>
                {(section.head || []).map((h, i) => (
                  <th key={i} className="py-3 pr-6 text-[10.5px] uppercase tracking-[0.18em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(section.rows || []).map((row, i) => (
                <tr key={i} className="border-b align-top" style={{ borderColor: 'var(--c4-border)' }}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`py-3.5 pr-6 text-[13px] leading-[1.6] ${j === 0 ? 'font-medium' : ''}`}
                      style={{ color: j === 0 ? 'var(--c4-text)' : 'var(--c4-text-muted)' }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </SectionShell>
  );
}

/* ── Renderer ──────────────────────────────────────────────────────── */

const KIND_COMPONENTS = {
  answer: AnswerSection,
  prose: ProseSection,
  list: ListSection,
  process: ProcessSection,
  proof: ProofSection,
  pricing: PricingSection,
  table: TableSection,
};

export default function SeoSections({ sections = [] }) {
  return (
    <>
      {sections.map((section, i) => {
        const Kind = KIND_COMPONENTS[section.kind];
        return Kind ? <Kind key={i} section={section} /> : null;
      })}
    </>
  );
}
