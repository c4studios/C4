import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';

const ease = [0.22, 1, 0.36, 1];

const PRODUCTS = [
  {
    slug: 'quotr',
    name: 'Quotr',
    status: 'Live',
    oneLiner: 'Instant quote calculators for service businesses.',
    features: [
      'Embed on any website in 5 minutes',
      'Stripe billing built in',
      'Email notification on every lead',
    ],
    pricing: 'From $29/mo — use code C4HALF for 50% off your first 3 months at quotr.us',
    ctaLabel: 'Start free at quotr.us',
    ctaHref: 'https://quotr.us',
    ctaExternal: true,
  },
  {
    slug: 'returndesk',
    name: 'ReturnDesk',
    status: 'Beta',
    oneLiner: 'Priority inbox for service businesses.',
    features: [
      'Manual-first, works on day one',
      'Explainable priority scoring',
      'Reply templates for every category',
    ],
    pricing: '$49/mo early bird (normally $99/mo at launch)',
    ctaLabel: 'Request beta access',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=ReturnDesk beta access',
    ctaExternal: false,
  },
  {
    slug: 'reviewloop',
    name: 'ReviewLoop',
    status: 'Coming Soon',
    oneLiner: 'Turn happy jobs into Google reviews.',
    features: [
      'Templated review request emails',
      'Automated follow-up sequences',
      'Google Business Profile integration',
    ],
    pricing: 'First month free for waitlist members',
    ctaLabel: 'Join the waitlist',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=ReviewLoop waitlist',
    ctaExternal: false,
  },
  {
    slug: 'complia',
    name: 'Complia',
    status: 'Coming Soon',
    oneLiner: 'Australian compliance calendar and assistant.',
    features: [
      'BAS, super, and ASIC annual review tracking',
      'Preparation checklists per obligation',
      'Reminder system built in',
    ],
    pricing: 'First month free for waitlist members',
    ctaLabel: 'Join the waitlist',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=Complia waitlist',
    ctaExternal: false,
  },
  {
    slug: 'firmflow',
    name: 'FirmFlow',
    status: 'Coming Soon',
    oneLiner: 'AI content engine for professional services.',
    features: [
      'LinkedIn posts, newsletters, client emails',
      'Source-first content generation',
      'Built-in disclaimer and risk controls',
    ],
    pricing: 'First month free for waitlist members',
    ctaLabel: 'Join the waitlist',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=FirmFlow waitlist',
    ctaExternal: false,
  },
  {
    slug: 'c4-command',
    name: 'C4 Command',
    status: 'Studio',
    oneLiner: 'Operational hub for the C4 Studio.',
    features: [
      'Lead pipeline and outreach monitoring',
      'Automation health dashboard',
      'Projects, invoices, and client notes',
    ],
    pricing: 'Available to C4 Studios clients and partners',
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=C4 Command',
    ctaExternal: false,
  },
];

function statusColor(status) {
  if (status === 'Live') return 'var(--c4-brand-success, #22c55e)';
  if (status === 'Beta') return 'var(--c4-accent)';
  return 'var(--c4-text-muted)';
}

export default function Software() {
  useDocumentHead({
    title: 'C4 Software — Tools for Service Businesses',
    description:
      'Every product in the C4 suite started as something we needed ourselves or built for a client. Studio pricing for C4 Studios visitors — early access at below-market rates.',
    path: '/software',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Software', path: '/software' },
    ]),
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      {/* HERO */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-medium"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              C4 Software
            </span>
            <h1
              className="mt-4 text-[2.2rem] font-semibold tracking-[-0.04em] leading-[1.05] md:text-[3.2rem]"
              style={{ color: 'var(--c4-text)' }}
            >
              Tools built for the<br className="hidden md:block" /> businesses we serve.
            </h1>
            <p
              className="mt-5 max-w-[520px] text-[14px] leading-[1.7] md:text-[15px]"
              style={{ color: 'var(--c4-text-muted)' }}
            >
              Every product in the C4 suite started as something we needed ourselves or built for a client.
              C4 Studios visitors get studio pricing — early access at below-market rates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          {PRODUCTS.map((product, index) => {
            const color = statusColor(product.status);
            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.05, ease }}
                className="border-t py-12 md:py-16"
                style={{ borderColor: 'var(--c4-border-light)' }}
              >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px] lg:gap-16">
                  {/* Left — identity + features */}
                  <div>
                    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px]" style={{ border: `1px solid ${color}` }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                      <span
                        className="text-[9.5px] uppercase tracking-[0.14em] font-medium"
                        style={{ color }}
                      >
                        {product.status}
                      </span>
                    </div>
                    <h2
                      className="text-[1.6rem] font-semibold tracking-[-0.03em] leading-[1.1] md:text-[2rem]"
                      style={{ color: 'var(--c4-text)' }}
                    >
                      {product.name}
                    </h2>
                    <p
                      className="mt-2 text-[14px] leading-[1.65]"
                      style={{ color: 'var(--c4-text-muted)' }}
                    >
                      {product.oneLiner}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {product.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 text-[13px] leading-[1.5]"
                          style={{ color: 'var(--c4-text-subtle)' }}
                        >
                          <Check
                            size={13}
                            strokeWidth={2.5}
                            className="mt-[2px] shrink-0"
                            style={{ color: 'var(--c4-accent)' }}
                          />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right — pricing + CTA */}
                  <div
                    className="rounded-[3px] p-6 md:p-7 self-start"
                    style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
                  >
                    <p
                      className="text-[12.5px] leading-[1.65] mb-5"
                      style={{ color: 'var(--c4-text-muted)' }}
                    >
                      {product.pricing}
                    </p>
                    {product.ctaExternal ? (
                      <a
                        href={product.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium rounded-[3px] transition-opacity duration-300 hover:opacity-80"
                        style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                      >
                        {product.ctaLabel}
                        <ArrowUpRight size={13} strokeWidth={2} />
                      </a>
                    ) : (
                      <a
                        href={product.ctaHref}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium rounded-[3px] transition-opacity duration-300 hover:opacity-80"
                        style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                      >
                        {product.ctaLabel}
                        <ArrowRight size={13} strokeWidth={2} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CLOSING STRIP */}
      <section
        className="py-16 md:py-20"
        style={{ borderTop: '1px solid var(--c4-border-light)', backgroundColor: 'var(--c4-bg-alt)' }}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="max-w-[640px]"
          >
            <p
              className="text-[14px] leading-[1.7] md:text-[15px]"
              style={{ color: 'var(--c4-text-muted)' }}
            >
              All C4 software is built on the same stack used for client work — Next.js, Supabase, TypeScript.
              No vendor lock-in. No inflated SaaS markups.
            </p>
            <Link
              to={createPageUrl('Contact')}
              className="group inline-flex items-center gap-2 mt-5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
              style={{ color: 'var(--c4-text-subtle)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c4-text)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--c4-text-subtle)'; }}
            >
              Work with C4 Studios
              <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
