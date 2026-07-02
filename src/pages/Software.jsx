import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';
import { PRODUCTS, statusColor as productStatusColor } from '../components/software/productData';

const ease = [0.22, 1, 0.36, 1];

const statusColor = productStatusColor;

// A small, truthful reassurance cue shown under each card's CTA.
function reassuranceFor(product) {
  if (/start free/i.test(product.ctaLabel)) return 'Free to start · no card required';
  if (product.status === 'Early access') return 'No obligation · early access';
  return 'No pressure · just a chat';
}

// One product card: value first (logo + name + one-liner), then the price/CTA.
function ProductCard({ product, index }) {
  const color = statusColor(product.status);
  const reassurance = reassuranceFor(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.06, ease }}
      className="group flex flex-col rounded-[4px] overflow-hidden h-full"
      style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
    >
      {/* VALUE — logo, status, name, one-liner (lead with what it does) */}
      <Link
        to={`${createPageUrl('SoftwareProduct')}?slug=${product.slug}`}
        className="flex flex-col gap-4 p-6 md:p-7"
      >
        <div className="flex items-center justify-between gap-4">
          <div
            className="flex items-center justify-center rounded-[8px] overflow-hidden shrink-0"
            style={{ width: 56, height: 56, backgroundColor: product.logoBg, border: '1px solid var(--c4-border)' }}
          >
            <img
              src={product.logo}
              alt={`${product.name} logo`}
              className="h-full w-full"
              style={{ objectFit: 'contain', padding: 10 }}
              draggable="false"
              loading="lazy"
            />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px]" style={{ border: `1px solid ${color}` }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9.5px] uppercase tracking-[0.14em] font-medium" style={{ color }}>
              {product.status}
            </span>
          </span>
        </div>

        <div>
          <h3
            className="text-[1.35rem] font-semibold tracking-[-0.02em] leading-[1.1] flex items-center gap-1.5"
            style={{ color: 'var(--c4-text)' }}
          >
            {product.name}
            <ArrowRight
              size={15}
              strokeWidth={2}
              className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
              style={{ color: 'var(--c4-accent)' }}
            />
          </h3>
          <p className="mt-2 text-[13.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
            {product.oneLiner}
          </p>
        </div>
      </Link>

      {/* PRICE + CTA */}
      <div
        className="mt-auto flex flex-col gap-4 p-6 md:p-7 pt-5"
        style={{ borderTop: '1px solid var(--c4-border-light)' }}
      >
        {product.tiers && (
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            {product.tiers.map((tier) => (
              <span key={tier.label} className="text-[12px]" style={{ color: 'var(--c4-text-subtle)' }}>
                {tier.label}{' '}
                <span className="font-semibold tabular-nums" style={{ color: 'var(--c4-text)' }}>
                  ${tier.price}
                </span>
                <span className="text-[10.5px]" style={{ color: 'var(--c4-text-faint)' }}>/mo</span>
              </span>
            ))}
          </div>
        )}
        <p className="text-[12px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
          {product.pricing}
        </p>

        <div className="flex flex-col gap-2">
          {product.ctaExternal ? (
            <a
              href={product.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium rounded-[3px] transition-opacity duration-300 hover:opacity-80"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              {product.ctaLabel}
              <ArrowUpRight size={13} strokeWidth={2} />
            </a>
          ) : (
            <a
              href={product.ctaHref}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium rounded-[3px] transition-opacity duration-300 hover:opacity-80"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              {product.ctaLabel}
              <ArrowRight size={13} strokeWidth={2} />
            </a>
          )}
          <p className="text-center text-[10.5px] leading-[1.4]" style={{ color: 'var(--c4-text-subtle)' }}>
            {reassurance}
          </p>
        </div>

        {product.lifetime && (
          <a
            href={product.lifetime.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/lt flex items-center justify-between text-[11.5px] pt-3"
            style={{ borderTop: '1px solid var(--c4-border-light)', color: 'var(--c4-text-subtle)' }}
          >
            <span>
              or own it forever — <span className="font-semibold tabular-nums" style={{ color: 'var(--c4-text)' }}>${product.lifetime.price}</span> lifetime
            </span>
            <ArrowUpRight size={12} strokeWidth={2} className="transition-transform duration-300 group-hover/lt:translate-x-0.5 group-hover/lt:-translate-y-0.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

function ProductGroup({ eyebrow, title, blurb, products }) {
  if (!products.length) return null;
  return (
    <div className="mb-16 md:mb-24 last:mb-0">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease }}
        className="mb-8"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--c4-accent)' }}>
          {eyebrow}
        </p>
        <h2 className="mt-2 text-[1.5rem] md:text-[1.8rem] font-semibold tracking-[-0.03em]" style={{ color: 'var(--c4-text)' }}>
          {title}
        </h2>
        {blurb && (
          <p className="mt-2 max-w-[560px] text-[13.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
            {blurb}
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <ProductCard key={product.slug} product={product} index={i} />
        ))}
      </div>
    </div>
  );
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

  // Group the catalogue. Hide the internal Studio tool (C4 Command) from the
  // public buying list; split the rest into Live, Early access and Preview.
  const publicProducts = PRODUCTS.filter((p) => p.status !== 'Studio');
  const live = publicProducts.filter((p) => p.status === 'Live');
  const earlyAccess = publicProducts.filter((p) => p.status === 'Early access');
  const preview = publicProducts.filter((p) => p.status === 'Preview');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      {/* HERO */}
      <section className="pt-28 pb-14 md:pt-36 md:pb-16">
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
              Most are free to start — pick one, try it, and only pay when it earns its place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          {/* C4 Suite — bundle banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease }}
            className="mb-16 md:mb-24 flex flex-col gap-4 rounded-[3px] border p-6 md:flex-row md:items-center md:justify-between"
            style={{ borderColor: 'var(--c4-accent)', backgroundColor: 'var(--c4-card-bg)' }}
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: 'var(--c4-accent)' }}>
                C4 Suite
              </p>
              <h2 className="mt-1 text-[1.25rem] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>
                Everything. One subscription.
              </h2>
              <p className="mt-1 max-w-[560px] text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
                All eight C4 modules at Pro level — ReturnDesk, ReviewLoop, Rebook, CrewCheck,
                SafeDraft, Nudge, Complia, and FirmFlow — for under half the price of buying them separately.
              </p>
            </div>
            <div className="flex items-center gap-5">
              <p className="text-[2rem] font-bold tracking-[-0.04em] leading-none" style={{ color: 'var(--c4-text)' }}>
                $149<span className="text-[12px] font-normal" style={{ color: 'var(--c4-text-muted)' }}>/mo · AUD</span>
              </p>
              <a
                href="/Contact"
                className="flex items-center justify-center gap-2 rounded-[3px] px-5 py-3 text-[10.5px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
                style={{ backgroundColor: 'var(--c4-accent)', color: 'var(--c4-bg)' }}
              >
                Talk to us
                <ArrowUpRight size={12} strokeWidth={2.5} />
              </a>
            </div>
          </motion.div>

          <ProductGroup
            eyebrow="Live now"
            title="Ready to use today"
            blurb="Standalone apps you can start free right now — no sales call, no setup fee."
            products={live}
          />

          <ProductGroup
            eyebrow="Early access"
            title="Coming soon — get in first"
            blurb="Relaunching as standalone apps. Register interest and we onboard you personally at early-bird pricing."
            products={earlyAccess}
          />

          <ProductGroup
            eyebrow="Preview"
            title="In the workshop"
            blurb="Tools we are actively building and using on live C4 work. Take a look, or try the interactive demos on each page."
            products={preview}
          />
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
