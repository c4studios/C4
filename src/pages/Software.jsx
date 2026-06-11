import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';
import { PRODUCTS, statusColor as productStatusColor } from '../components/software/productData';

const ease = [0.22, 1, 0.36, 1];

const statusColor = productStatusColor;

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
                    <Link
                      to={`${createPageUrl('SoftwareProduct')}?slug=${product.slug}`}
                      className="group inline-flex items-center gap-2 mt-6 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
                      style={{ color: 'var(--c4-text-subtle)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c4-text)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--c4-text-subtle)'; }}
                    >
                      Full details
                      <ArrowRight size={12} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </div>

                  {/* Right — pricing + CTA */}
                  <div
                    className="rounded-[3px] p-6 md:p-7 self-start"
                    style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
                  >
                    {product.tiers && (
                      <div className="flex flex-col gap-2 mb-4">
                        {product.tiers.map((tier) => (
                          <div key={tier.label} className="flex items-baseline justify-between gap-3">
                            <span className="text-[12px]" style={{ color: 'var(--c4-text-subtle)' }}>
                              {tier.label}
                              {tier.note ? <span style={{ color: 'var(--c4-text-faint)' }}> — {tier.note}</span> : null}
                            </span>
                            <span className="text-[14px] font-semibold tabular-nums" style={{ color: 'var(--c4-text)' }}>
                              ${tier.price}<span className="text-[11px] font-normal" style={{ color: 'var(--c4-text-faint)' }}>/mo</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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
                    {product.lifetime && (
                      <a
                        href={product.lifetime.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/lt mt-4 flex items-center justify-between text-[11.5px] pt-4"
                        style={{ borderTop: '1px solid var(--c4-border-light)', color: 'var(--c4-text-subtle)' }}
                      >
                        <span>
                          or own it forever — <span className="font-semibold tabular-nums" style={{ color: 'var(--c4-text)' }}>${product.lifetime.price}</span> lifetime
                        </span>
                        <ArrowUpRight size={12} strokeWidth={2} className="transition-transform duration-300 group-hover/lt:translate-x-0.5 group-hover/lt:-translate-y-0.5" />
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
