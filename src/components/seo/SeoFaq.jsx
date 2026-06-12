import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SectionLabel from '@/components/c4/SectionLabel';

const ease = [0.22, 1, 0.36, 1];

// Same accordion idiom as the Support page FAQ — kept visually identical
// so SEO pages read as part of the same site.
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b transition-colors duration-300" style={{ borderColor: 'var(--c4-border)' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
      >
        <span
          className="text-[14px] md:text-[15px] font-medium leading-[1.5] transition-colors duration-300"
          style={{ color: open ? 'var(--c4-text)' : 'var(--c4-text-muted)' }}
        >
          {question}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className="shrink-0 transition-transform duration-300"
          style={{ color: 'var(--c4-text-subtle)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <p className="pb-5 text-[13.5px] leading-[1.7] max-w-[560px]" style={{ color: 'var(--c4-text-muted)' }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * FAQ block for SEO pages. Questions and answers also ship as FAQPage
 * JSON-LD (built in SeoPage) — the on-page text and the schema must match,
 * which they do because both read the same content module.
 */
export default function SeoFaq({ faqs = [], heading = 'Common questions' }) {
  if (!faqs.length) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="mb-6">
          <div className="mb-3">
            <SectionLabel text="FAQ" />
          </div>
          <h2 className="text-[1.45rem] md:text-[1.85rem] font-semibold tracking-[-0.025em] leading-[1.15]" style={{ color: 'var(--c4-text)' }}>
            {heading}
          </h2>
        </div>
        <div className="max-w-[760px] border-t" style={{ borderColor: 'var(--c4-border)' }}>
          {faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
