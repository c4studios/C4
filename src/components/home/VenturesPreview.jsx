import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

function InitiativeBlock({ label, color, heading, description, linkText, linkPage, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay, ease }}
    >
      <div className="h-px mb-7 md:mb-9" style={{ backgroundColor: 'var(--c4-border)' }} />
      <span className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color }}>{label}</span>
      <h3 className="mt-4 text-[1.15rem] md:text-[1.3rem] font-semibold tracking-[-0.015em] leading-snug" style={{ color: 'var(--c4-text)' }}>
        {heading}
      </h3>
      <p className="mt-2.5 text-[13.5px] leading-[1.65] max-w-[360px]" style={{ color: 'var(--c4-text-muted)' }}>
        {description}
      </p>
      <Link
        to={createPageUrl(linkPage)}
        className="group inline-flex items-center gap-1.5 mt-5 text-[11px] uppercase tracking-[0.14em] font-medium"
        style={{ color: 'var(--c4-text)' }}
      >
        {linkText}
        <ArrowRight size={12} strokeWidth={2} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
      </Link>
    </motion.div>
  );
}

export default function VenturesPreview() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mb-12 md:mb-16"
        >
          <h2 className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>Initiatives</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          <InitiativeBlock
            label="Ventures"
            color="var(--c4-accent)"
            heading="Got an idea worth building?"
            description="We selectively partner with founders who have compelling ideas for apps, platforms, or digital products."
            linkText="Learn More"
            linkPage="Ventures"
            delay={0}
          />
          <InitiativeBlock
            label="Rebuild"
            color="var(--c4-brand-success)"
            heading="Paying too much for software?"
            description="Submit overpriced SaaS tools or subscriptions. If we can build a leaner alternative — we will."
            linkText="Learn More"
            linkPage="Rebuild"
            delay={0.06}
          />
          <InitiativeBlock
            label="C4 Lens"
            color="var(--c4-text-subtle)"
            heading="Video with the same standard."
            description="Videography for brands that care how they're seen, shaped with the same design discipline as the rest of the studio."
            linkText="Learn More"
            linkPage="Lens"
            delay={0.12}
          />
        </div>
      </div>
    </section>
  );
}