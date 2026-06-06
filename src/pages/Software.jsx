import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Copy } from 'lucide-react';
import { createPageUrl } from '@/utils';
import WaitlistModal from '../components/WaitlistModal';

// Stripe Payment Links (live) — created 2026-06-06
// To add a new tier: dashboard.stripe.com/payment-links
const RETURNDESK_PAYMENT_LINK  = 'https://buy.stripe.com/eVqbJ1epy8Vm2st4Uo3ZK00'; // $49/mo AUD beta
const RETURNDESK_PRO_LINK      = 'https://buy.stripe.com/00wcN50yIc7y0klbiM3ZK01'; // $99/mo AUD pro
const REVIEWLOOP_STARTER_LINK  = null; // 'https://buy.stripe.com/7sY8wP95e6Negjj86A3ZK02' — enable at launch
const REVIEWLOOP_PRO_LINK      = null; // 'https://buy.stripe.com/8x2aEXdlu5Ja1opbiM3ZK03' — enable at launch
const COMPLIA_PRO_LINK         = null; // 'https://buy.stripe.com/5kQ00jgxG3B2d7772w3ZK04' — enable at launch
const COMPLIA_BUSINESS_LINK    = null; // 'https://buy.stripe.com/eVqfZh5T2b3u6IJ4Uo3ZK05' — enable at launch
const FIRMFLOW_PRO_LINK        = null; // 'https://buy.stripe.com/14A7sL6X65Ja3wx1Ic3ZK06' — enable at launch
const FIRMFLOW_AGENCY_LINK     = null; // 'https://buy.stripe.com/bJe28r95efjK5EF9aE3ZK07' — enable at launch

const ease = [0.22, 1, 0.36, 1];

const QUOTR_PLANS = [
  { src: '/Software/quotr-starter.jpeg', label: 'Starter' },
  { src: '/Software/quotr-pro.jpeg',     label: 'Pro' },
  { src: '/Software/quotr-agency.jpeg',  label: 'Agency' },
];

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
    pricing: 'From $29/mo — 50% off your first 3 months with code C4HALF',
    ctaType: 'quotr',
    logoUrl: '/Software/quotr-icon.jpeg',
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
    pricing: 'Beta access — $49/mo AUD',
    ctaType: 'stripe',
    ctaLabel: 'Get access — $49/mo',
    logoUrl: '/Software/ReturnDesk.png',
    logoUrlMinimal: '/Software/returndesk-minimal.png',
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
    ctaType: 'modal',
    ctaLabel: 'Join the waitlist',
    logoUrl: '/Software/ReviewLoop.png',
    logoUrlMinimal: '/Software/reviewloop-minimal.png',
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
    ctaType: 'modal',
    ctaLabel: 'Join the waitlist',
    logoUrl: '/Software/Complia.png',
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
    ctaType: 'modal',
    ctaLabel: 'Join the waitlist',
    logoUrl: '/Software/FirmFlow.png',
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
    ctaType: 'mailto',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=C4 Command',
    ctaLabel: 'Get in touch',
    logoUrl: '/Software/C4Command.png',
  },
];

function statusColor(status) {
  if (status === 'Live') return 'var(--c4-brand-success, #22c55e)';
  if (status === 'Beta') return 'var(--c4-accent)';
  return 'var(--c4-text-muted)';
}

function ProductLogo({ logoUrl, logoUrlMinimal, name }) {
  if (!logoUrl) return null;
  return (
    <div className="group relative mb-5 inline-block h-10">
      <img
        src={logoUrl}
        alt={name}
        className={`h-10 w-auto object-contain transition-opacity duration-500${logoUrlMinimal ? ' group-hover:opacity-0' : ''}`}
      />
      {logoUrlMinimal && (
        <img
          src={logoUrlMinimal}
          alt={name}
          className="absolute left-0 top-0 h-10 w-auto object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
    </div>
  );
}

function QuotrPricingBlock() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('C4HALF').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={handleCopy}
          className="group flex items-center gap-2 rounded-[3px] px-3 py-2 transition-colors duration-200"
          style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}
        >
          <span className="font-mono text-[14px] font-semibold tracking-[0.06em]" style={{ color: 'var(--c4-text)' }}>
            C4HALF
          </span>
          <span
            className="flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] font-medium transition-colors duration-200"
            style={{ color: copied ? 'var(--c4-brand-success, #22c55e)' : 'var(--c4-text-faint)' }}
          >
            {copied ? (
              <><Check size={11} strokeWidth={2.5} /> Copied</>
            ) : (
              <><Copy size={11} strokeWidth={2} /> Copy</>
            )}
          </span>
        </button>
      </div>
      <p className="mb-5 text-[12.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
        50% off your first 3 months — enter at checkout
      </p>
      <a
        href="https://quotr.us"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-[3px] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-opacity duration-300 hover:opacity-80"
        style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
      >
        Go to quotr.us
        <ArrowUpRight size={13} strokeWidth={2} />
      </a>
    </div>
  );
}

function ReturnDeskPricingBlock({ onOpenModal }) {
  const handleClick = () => {
    if (RETURNDESK_PAYMENT_LINK) {
      window.open(RETURNDESK_PAYMENT_LINK, '_blank', 'noopener noreferrer');
    } else {
      onOpenModal('ReturnDesk Beta');
    }
  };

  return (
    <div>
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px]" style={{ border: '1px solid var(--c4-accent)' }}>
        <span className="text-[9.5px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-accent)' }}>
          Early bird pricing
        </span>
      </div>
      <p className="mb-1 text-[13.5px] font-semibold" style={{ color: 'var(--c4-text)' }}>
        Beta access — $49/mo AUD
      </p>
      <p className="mb-5 text-[12px] leading-[1.5]" style={{ color: 'var(--c4-text-muted)' }}>
        Normally $99/mo at full launch
      </p>
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-[3px] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-opacity duration-300 hover:opacity-80"
        style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
      >
        Get access — $49/mo
        <ArrowRight size={13} strokeWidth={2} />
      </button>
    </div>
  );
}

export default function Software() {
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, []);

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
          {PRODUCTS.map((product) => {
            const color = statusColor(product.status);
            return (
              <motion.div
                key={product.slug}
                id={product.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.05, ease }}
                className="border-t py-12 md:py-16 scroll-mt-24"
                style={{ borderColor: 'var(--c4-border-light)' }}
              >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px] lg:gap-16">
                  {/* Left — identity + features */}
                  <div>
                    <ProductLogo logoUrl={product.logoUrl} logoUrlMinimal={product.logoUrlMinimal} name={product.name} />

                    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px]" style={{ border: `1px solid ${color}` }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[9.5px] uppercase tracking-[0.14em] font-medium" style={{ color }}>
                        {product.status}
                      </span>
                    </div>
                    <h2
                      className="text-[1.6rem] font-semibold tracking-[-0.03em] leading-[1.1] md:text-[2rem]"
                      style={{ color: 'var(--c4-text)' }}
                    >
                      {product.name}
                    </h2>
                    <p className="mt-2 text-[14px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
                      {product.oneLiner}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {product.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 text-[13px] leading-[1.5]"
                          style={{ color: 'var(--c4-text-subtle)' }}
                        >
                          <Check size={13} strokeWidth={2.5} className="mt-[2px] shrink-0" style={{ color: 'var(--c4-accent)' }} />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {/* Quotr plan showcase */}
                    {product.slug === 'quotr' && (
                      <div className="mt-8">
                        <span className="mb-3 block text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: 'var(--c4-text-faint)' }}>
                          Available plans
                        </span>
                        <div className="grid grid-cols-3 gap-3">
                          {QUOTR_PLANS.map((plan) => (
                            <a
                              key={plan.label}
                              href="https://quotr.us"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group overflow-hidden rounded-[3px] transition-opacity duration-300 hover:opacity-80"
                              style={{ border: '1px solid var(--c4-border)' }}
                            >
                              <div className="flex aspect-[4/3] items-center justify-center bg-white p-3">
                                <img
                                  src={plan.src}
                                  alt={`Quotr ${plan.label}`}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                              <div
                                className="flex items-center justify-between px-3 py-2"
                                style={{ backgroundColor: 'var(--c4-bg-alt)' }}
                              >
                                <span className="text-[10px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
                                  {plan.label}
                                </span>
                                <ArrowUpRight
                                  size={10}
                                  strokeWidth={2}
                                  style={{ color: 'var(--c4-text-faint)' }}
                                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right — pricing + CTA */}
                  <div
                    className="rounded-[3px] p-6 md:p-7 self-start"
                    style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
                  >
                    {product.ctaType !== 'stripe' && (
                      <p className="mb-5 text-[12.5px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
                        {product.pricing}
                      </p>
                    )}

                    {product.ctaType === 'quotr' && <QuotrPricingBlock />}

                    {product.ctaType === 'stripe' && (
                      <ReturnDeskPricingBlock onOpenModal={setModalProduct} />
                    )}

                    {product.ctaType === 'modal' && (
                      <button
                        onClick={() => setModalProduct(product.name)}
                        className="inline-flex items-center gap-2 rounded-[3px] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-opacity duration-300 hover:opacity-80"
                        style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                      >
                        {product.ctaLabel}
                        <ArrowRight size={13} strokeWidth={2} />
                      </button>
                    )}

                    {product.ctaType === 'mailto' && (
                      <a
                        href={product.ctaHref}
                        className="inline-flex items-center gap-2 rounded-[3px] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-opacity duration-300 hover:opacity-80"
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
            <p className="text-[14px] leading-[1.7] md:text-[15px]" style={{ color: 'var(--c4-text-muted)' }}>
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

      <WaitlistModal
        isOpen={!!modalProduct}
        onClose={() => setModalProduct(null)}
        productName={modalProduct || ''}
      />
    </div>
  );
}
