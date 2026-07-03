import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * LegalDocument — shared layout for policy pages (Privacy Policy, Terms of
 * Service). Ink-on-brand, single measured column, matching the studio's
 * existing legal aesthetic. Content is data-driven (see the `sections` prop);
 * each section supports intro copy, paragraphs, ordered/unordered lists,
 * definition items, an outro, and an optional inline link.
 */

const ease = [0.22, 1, 0.36, 1];

function Paragraphs({ value }) {
  const paragraphs = Array.isArray(value) ? value : [value];
  return (
    <div className="space-y-2">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-[13.5px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
          {p}
        </p>
      ))}
    </div>
  );
}

function SectionBlock({ section, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: 0.02 * index, ease }}
    >
      <h2 className="text-[14px] font-semibold tracking-[-0.01em] mb-3" style={{ color: 'var(--c4-text)' }}>
        {section.title}
      </h2>

      {section.intro && (
        <p className="text-[13.5px] leading-[1.75] mb-2" style={{ color: 'var(--c4-text-muted)' }}>
          {section.intro}
        </p>
      )}

      {section.content && <Paragraphs value={section.content} />}

      {section.items && (
        <dl className="space-y-2 mt-1">
          {section.items.map((item, i) => (
            <div key={i} className="flex flex-col">
              <dt className="text-[13px] font-medium" style={{ color: 'var(--c4-text)' }}>{item.term}</dt>
              <dd className="text-[13.5px] leading-[1.75] ml-4" style={{ color: 'var(--c4-text-muted)' }}>{item.def}</dd>
            </div>
          ))}
        </dl>
      )}

      {section.list && (
        <ul className={`space-y-1.5 ml-4 mt-1 ${section.numbered ? 'list-decimal' : 'list-disc'}`}>
          {section.list.map((item, i) => (
            <li key={i} className="text-[13.5px] leading-[1.75] pl-1" style={{ color: 'var(--c4-text-muted)' }}>{item}</li>
          ))}
        </ul>
      )}

      {section.outro && (
        <div className="mt-3 space-y-2">
          {section.outro.split('\n\n').map((p, i) => (
            <p key={i} className="text-[13.5px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>{p}</p>
          ))}
        </div>
      )}

      {section.link && (
        <p className="text-[13.5px] leading-[1.75] mt-2" style={{ color: 'var(--c4-text-muted)' }}>
          {section.link.before}
          <Link
            to={section.link.to}
            className="underline underline-offset-2 transition-colors duration-300"
            style={{ color: 'var(--c4-text)', textDecorationColor: 'var(--c4-border)' }}
          >
            {section.link.label}
          </Link>
          {section.link.after}
        </p>
      )}

      {section.email && (
        <p className="text-[13.5px] leading-[1.75] mt-1" style={{ color: 'var(--c4-text-muted)' }}>
          {section.email.before}
          <a
            href={`mailto:${section.email.address}`}
            className="underline underline-offset-2 transition-colors duration-300"
            style={{ color: 'var(--c4-text)', textDecorationColor: 'var(--c4-border)' }}
          >
            {section.email.address}
          </a>
          {section.email.after}
        </p>
      )}
    </motion.div>
  );
}

export default function LegalDocument({ label = 'Legal', title, intro, effectiveDate, sections }) {
  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[720px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--c4-accent)' }} />
            <span className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
              {label}
            </span>
          </div>
          <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-[-0.035em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            {title}
          </h1>
          {intro && (
            <p className="mt-4 text-[14px] leading-[1.7] max-w-[560px]" style={{ color: 'var(--c4-text-muted)' }}>
              {intro}
            </p>
          )}
          {effectiveDate && (
            <p className="mt-2 text-[11px]" style={{ color: 'var(--c4-text-faint)' }}>
              Effective date: {effectiveDate}
            </p>
          )}
        </motion.div>

        {/* Sections */}
        <div className="mt-12 space-y-8">
          {sections.map((s, i) => (
            <SectionBlock key={i} section={s} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
