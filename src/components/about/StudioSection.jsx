import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const principles = [
  {
    title: 'Bespoke work only',
    summary: 'Every project is purpose-built. No templates, no themes, no recycled layouts.',
  },
  {
    title: 'Maintainable code',
    summary: 'Clean architecture and modular systems that your team can understand and extend long after handover.',
  },
  {
    title: 'Performance-first',
    summary: "Speed isn't a feature — it's the baseline. Every decision is weighed against load time and responsiveness.",
  },
  {
    title: 'Accessible & responsive',
    summary: 'Builds that work across devices and meet accessibility standards — not as an afterthought, but by design.',
  },
  {
    title: 'Measured motion',
    summary: 'Animation serves purpose. Every transition earns its place — nothing decorative, nothing gratuitous.',
  },
  {
    title: 'Thoughtful handover',
    summary: 'Deployment, documentation, and a support window. The work holds up long after launch.',
  },
];

function PrincipleRow({ principle, isOpen, onToggle }) {
  return (
    <div className="border-b" style={{ borderColor: 'var(--c4-border-light)' }}>
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between gap-4 group text-left outline-none rounded-sm"
      >
        <span className="text-[13.5px] font-semibold tracking-[-0.01em] transition-colors duration-300" style={{ color: 'var(--c4-text)' }}>
          {principle.title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease }}
        >
          <ChevronDown size={14} style={{ color: 'var(--c4-text-faint)' }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-[13px] leading-[1.65] max-w-[480px]" style={{ color: 'var(--c4-text-muted)' }}>
              {principle.summary}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StudioSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <h3 className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
              What We Build
            </h3>
            <div className="mt-5 space-y-4">
              <p className="text-[14px] md:text-[15px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                C4 Studios builds full-stack web applications, marketing websites, digital platforms, and AI-powered tools for businesses that take their digital presence seriously. We handle the full arc — from technical strategy and architecture through to design, engineering, hosting, security, and ongoing maintenance.
              </p>
              <p className="text-[14px] md:text-[15px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                The approach is systems thinking: performance-obsessed, maintainable, and built to hold up under real-world use. No outsourcing, no filler, no compromise.
              </p>
            </div>
          </motion.div>

          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-5" style={{ color: 'var(--c4-text-subtle)' }}>
                How I Work
              </div>
              <div className="border-t" style={{ borderColor: 'var(--c4-border-light)' }}>
                {principles.map((p, i) => (
                  <PrincipleRow
                    key={p.title}
                    principle={p}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}