import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

const PRODUCTS = [
  {
    label: 'Live',
    labelColor: 'var(--c4-brand-success)',
    name: 'Quotr',
    description: 'Instant quote calculators for service businesses. Embed on any website in under 5 minutes.',
    linkText: 'Visit quotr.us',
    href: 'https://quotr.us',
    external: true,
  },
  {
    label: 'Beta',
    labelColor: 'var(--c4-accent)',
    name: 'ReturnDesk',
    description: 'Priority inbox for service businesses. Know who to call back first, and why.',
    linkText: 'Try ReturnDesk',
    href: 'https://c4-saas-suite.vercel.app',
    external: true,
  },
  {
    label: 'Coming Soon',
    labelColor: 'var(--c4-text-muted)',
    name: 'ReviewLoop',
    description: 'Turn happy jobs into Google reviews. Send templated review requests to past customers at the right moment.',
    linkText: 'Join waitlist',
    href: 'Software',
    external: false,
  },
  {
    label: 'Coming Soon',
    labelColor: 'var(--c4-text-muted)',
    name: 'Complia',
    description: 'Australian compliance calendar. BAS, super, ASIC — tracked and prepared.',
    linkText: 'Join waitlist',
    href: 'Software',
    external: false,
  },
  {
    label: 'Coming Soon',
    labelColor: 'var(--c4-text-muted)',
    name: 'FirmFlow',
    description: 'AI content engine for law firms, accountants, and professional services.',
    linkText: 'Join waitlist',
    href: 'Software',
    external: false,
  },
  {
    label: 'Studio',
    labelColor: 'var(--c4-text-muted)',
    name: 'C4 Command',
    description: 'Internal operations hub. Pipeline, automations, clients, and invoices in one place.',
    linkText: 'Learn more',
    href: 'Contact',
    external: false,
  },
];

function ProductCard({ label, labelColor, name, description,
                       linkText, href, external, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay, ease }}
    >
      <div className="h-px mb-7 md:mb-9"
           style={{ backgroundColor: 'var(--c4-border)' }} />
      <span className="text-[10px] uppercase tracking-[0.22em] font-medium"
            style={{ color: labelColor }}>{label}</span>
      <h3 className="mt-4 text-[1.15rem] md:text-[1.3rem] font-semibold
                     tracking-[-0.015em] leading-snug"
          style={{ color: 'var(--c4-text)' }}>
        {name}
      </h3>
      <p className="mt-2.5 text-[13.5px] leading-[1.65] max-w-[360px]"
         style={{ color: 'var(--c4-text-muted)' }}>
        {description}
      </p>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 mt-5
                     text-[11px] uppercase tracking-[0.14em] font-medium"
          style={{ color: 'var(--c4-text)' }}
        >
          {linkText}
          <ArrowUpRight size={12} strokeWidth={2}
                        className="opacity-30 group-hover:opacity-100
                                   transition-all duration-300" />
        </a>
      ) : (
        <Link
          to={createPageUrl(href)}
          className="group inline-flex items-center gap-1.5 mt-5
                     text-[11px] uppercase tracking-[0.14em] font-medium"
          style={{ color: 'var(--c4-text)' }}
        >
          {linkText}
          <ArrowRight size={12} strokeWidth={2}
                      className="opacity-30 group-hover:opacity-100
                                 group-hover:translate-x-0.5
                                 transition-all duration-300" />
        </Link>
      )}
    </motion.div>
  );
}

export default function SoftwarePreview() {
  return (
    <section className="py-20 md:py-28"
             style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mb-4"
        >
          <h2 className="text-[11px] uppercase tracking-[0.2em] font-medium"
              style={{ color: 'var(--c4-text-subtle)' }}>Software</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease }}
          className="mb-12 md:mb-16 flex items-end justify-between"
        >
          <div className="max-w-[480px]">
            <p className="text-[13.5px] leading-[1.65]"
               style={{ color: 'var(--c4-text-muted)' }}>
              Products built in-house and available to C4 clients
              at studio pricing.
            </p>
          </div>
          <Link
            to={createPageUrl('Software')}
            className="group hidden md:inline-flex items-center gap-1.5
                       text-[11px] uppercase tracking-[0.14em] font-medium"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            See pricing
            <ArrowRight size={12} strokeWidth={2}
                        className="opacity-30 group-hover:opacity-100
                                   group-hover:translate-x-0.5
                                   transition-all duration-300" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.name}
              {...product}
              delay={i * 0.06}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
