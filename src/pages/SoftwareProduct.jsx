import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ArrowLeft, Check, Plus } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { getProduct, PRODUCTS, statusColor } from '../components/software/productData';
import SweepDemo from '../components/software/demos/SweepDemo';
import PulseDemo from '../components/software/demos/PulseDemo';
import HandoverDemo from '../components/software/demos/HandoverDemo';
import CountUpStat from '../components/software/CountUpStat';
import HowItWorks from '../components/software/HowItWorks';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';

const ease = [0.22, 1, 0.36, 1];

export default function SoftwareProduct() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const product = getProduct(slug);

  const jsonLd = useMemo(() => {
    if (!product) return null;
    const crumbs = breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'C4 Originals', path: '/software' },
      { name: product.name, path: `/SoftwareProduct?slug=${product.slug}` },
    ]);
    return product.faqs?.length ? [crumbs, faqSchema(product.faqs)] : crumbs;
  }, [product]);

  useDocumentHead(
    product
      ? {
          title: `${product.name} — ${product.oneLiner}`,
          description: product.summary,
          path: `/SoftwareProduct?slug=${product.slug}`,
          jsonLd,
        }
      : {
          title: 'Product Not Found — C4 Originals',
          description: 'The requested product could not be found.',
          path: '/SoftwareProduct',
          noIndex: true,
        }
  );

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <p className="text-[14px]" style={{ color: 'var(--c4-text-subtle)' }}>Product not found.</p>
        <Link to={createPageUrl('Software')} className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-accent)' }}>
          Back to C4 Originals
        </Link>
      </div>
    );
  }

  const color = statusColor(product.status);
  const others = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);
  const CtaIcon = product.ctaExternal ? ArrowUpRight : ArrowRight;

  // A small, truthful reassurance cue shown under the primary CTA. Kept honest
  // per product: "Start free" apps really do start free with no card; early
  // access and preview products route to a friendly, no-obligation chat.
  const reassurance = /start free/i.test(product.ctaLabel)
    ? 'Free to start · no card required · cancel anytime'
    : product.status === 'Early access'
      ? 'No obligation · we onboard you personally'
      : 'No pressure · just a friendly chat';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      {/* HERO */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="mx-auto max-w-[1100px] px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <Link
              to={createPageUrl('Software')}
              className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-medium mb-10"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              <ArrowLeft size={12} strokeWidth={2} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              C4 Originals
            </Link>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              className="flex items-center justify-center rounded-[10px] overflow-hidden"
              style={{ width: 88, height: 88, backgroundColor: product.logoBg, border: '1px solid var(--c4-border)' }}
            >
              <img src={product.logo} alt={`${product.name} logo`} className="h-full w-full" style={{ objectFit: 'contain', padding: 14 }} draggable="false" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease }}>
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px]" style={{ border: `1px solid ${color}` }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[9.5px] uppercase tracking-[0.14em] font-medium" style={{ color }}>{product.status}</span>
              </div>
              <h1 className="text-[2.4rem] md:text-[3.4rem] font-semibold tracking-[-0.04em] leading-[1]" style={{ color: 'var(--c4-text)' }}>
                {product.name}
              </h1>
              <p className="mt-3 text-[15px] md:text-[17px] leading-[1.6] max-w-[46ch]" style={{ color: 'var(--c4-text-muted)' }}>
                {product.oneLiner}
              </p>
              {product.siteUrl && (
                <a
                  href={product.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex items-center gap-2 rounded-[3px] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-opacity duration-300 hover:opacity-85"
                  style={{ backgroundColor: 'var(--c4-accent)', color: '#fff' }}
                >
                  Visit the {product.name} site
                  <ArrowUpRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-10 border-y" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}>
        <div className="mx-auto max-w-[1100px] px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {product.highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease }}
              >
                <CountUpStat className="block text-[1.9rem] font-semibold tracking-[-0.03em] leading-[1]" style={{ color: 'var(--c4-text)' }}>{h.stat}</CountUpStat>
                <p className="mt-2 text-[12px] leading-[1.5] uppercase tracking-[0.1em]" style={{ color: 'var(--c4-text-subtle)' }}>{h.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1100px] px-6 md:px-12">
          <p className="text-[15px] md:text-[17px] leading-[1.8] max-w-[60ch] mb-12" style={{ color: 'var(--c4-text-muted)' }}>
            {product.summary}
          </p>
          <div className="grid md:grid-cols-2 gap-px rounded-[3px] overflow-hidden" style={{ backgroundColor: 'var(--c4-border)' }}>
            <div className="p-8 md:p-10" style={{ backgroundColor: 'var(--c4-bg)' }}>
              <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-4" style={{ color: 'var(--c4-text-subtle)' }}>The problem</p>
              <p className="text-[14px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>{product.problem}</p>
            </div>
            <div className="p-8 md:p-10" style={{ backgroundColor: 'var(--c4-bg)' }}>
              <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-4" style={{ color: 'var(--c4-accent)' }}>How {product.name} fixes it</p>
              <p className="text-[14px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>{product.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — scroll-driven, step by step */}
      <HowItWorks steps={product.howItWorks} accent={color} />

      {/* INTERACTIVE DEMO */}
      {product.slug === 'sweep' ? (
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-[1100px] px-6 md:px-12">
            <div className="flex items-baseline justify-between mb-6">
              <p className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>Try it</p>
              <p className="text-[11px]" style={{ color: 'var(--c4-text-subtle)' }}>runs in your browser · sample files · nothing leaves this page</p>
            </div>
            <p className="text-[14px] leading-[1.7] max-w-[60ch] mb-6" style={{ color: 'var(--c4-text-muted)' }}>
              This is the real grouping engine, running live on a sample messy Downloads folder. Triage a few cards
              the way you would in the app — keep what matters, archive the rest, and watch the space add up.
            </p>
            <SweepDemo />
          </div>
        </section>
      ) : null}

      {/* INTERACTIVE DEMO — Pulse */}
      {product.slug === 'pulse' ? (
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-[1100px] px-6 md:px-12">
            <div className="flex items-baseline justify-between mb-6">
              <p className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>Try it</p>
              <p className="text-[11px]" style={{ color: 'var(--c4-text-subtle)' }}>runs in your browser · edit the commits live</p>
            </div>
            <p className="text-[14px] leading-[1.7] max-w-[60ch] mb-6" style={{ color: 'var(--c4-text-muted)' }}>
              On the left is a week of developer commits — the raw, jargon-filled history. On the right is what Pulse
              turns it into for your client. Edit the commits and watch the update rewrite itself.
            </p>
            <PulseDemo />
          </div>
        </section>
      ) : null}

      {/* INTERACTIVE DEMO — Handover */}
      {product.slug === 'handover' ? (
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-[1100px] px-6 md:px-12">
            <div className="flex items-baseline justify-between mb-6">
              <p className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>See it</p>
              <p className="text-[11px]" style={{ color: 'var(--c4-text-subtle)' }}>sample project · toggle the secret to see the gate</p>
            </div>
            <p className="text-[14px] leading-[1.7] max-w-[60ch] mb-6" style={{ color: 'var(--c4-text-muted)' }}>
              Here’s what Handover makes from a finished project — the pack on the right, the accounts it hands over,
              and the safety gate that refuses to ship a live secret to a client. Flip the toggle to watch it block.
            </p>
            <HandoverDemo />
          </div>
        </section>
      ) : null}

      {/* FEATURES + CTA */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-[1100px] px-6 md:px-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-6" style={{ color: 'var(--c4-text-subtle)' }}>What you get</p>
              <ul className="space-y-4">
                {product.features.map((feat, i) => (
                  <motion.li
                    key={feat}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease }}
                    className="flex items-start gap-3 text-[14.5px] leading-[1.5]"
                    style={{ color: 'var(--c4-text)', borderBottom: '1px solid var(--c4-border)', paddingBottom: 16 }}
                  >
                    <Check size={15} strokeWidth={2.5} className="mt-[3px] shrink-0" style={{ color: 'var(--c4-accent)' }} />
                    {feat}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="rounded-[3px] p-7 self-start" style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3" style={{ color: 'var(--c4-text-subtle)' }}>Pricing</p>
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
              <p className="text-[13px] leading-[1.65] mb-6" style={{ color: 'var(--c4-text-muted)' }}>{product.pricing}</p>
              {product.ctaExternal ? (
                <a
                  href={product.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-medium rounded-[3px] transition-opacity duration-300 hover:opacity-85"
                  style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                >
                  {product.ctaLabel}
                  <CtaIcon size={13} strokeWidth={2} />
                </a>
              ) : (
                <a
                  href={product.ctaHref}
                  className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-medium rounded-[3px] transition-opacity duration-300 hover:opacity-85"
                  style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                >
                  {product.ctaLabel}
                  <CtaIcon size={13} strokeWidth={2} />
                </a>
              )}
              <p className="mt-3 text-center text-[11px] leading-[1.5]" style={{ color: 'var(--c4-text-subtle)' }}>
                {reassurance}
              </p>
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
        </div>
      </section>

      {/* FAQ */}
      {product.faqs?.length ? (
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-[760px] px-6 md:px-12">
            <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-8" style={{ color: 'var(--c4-text-subtle)' }}>Common questions</p>
            <div className="rounded-[3px] overflow-hidden" style={{ border: '1px solid var(--c4-border)' }}>
              {product.faqs.map((f, i) => (
                <details
                  key={f.q}
                  className="group"
                  style={i === 0 ? undefined : { borderTop: '1px solid var(--c4-border)' }}
                >
                  <summary
                    className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-[14.5px] font-medium list-none [&::-webkit-details-marker]:hidden"
                    style={{ color: 'var(--c4-text)' }}
                  >
                    {f.q}
                    <Plus size={15} strokeWidth={2} className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: 'var(--c4-text-subtle)' }} />
                  </summary>
                  <p className="px-6 pb-5 text-[13.5px] leading-[1.75] max-w-[62ch]" style={{ color: 'var(--c4-text-muted)' }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* OTHER PRODUCTS */}
      <section className="py-14 md:py-20 border-t" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}>
        <div className="mx-auto max-w-[1100px] px-6 md:px-12">
          <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-8" style={{ color: 'var(--c4-text-subtle)' }}>More from C4 Originals</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {others.map((p) => (
              <Link
                key={p.slug}
                to={`${createPageUrl('SoftwareProduct')}?slug=${p.slug}`}
                className="group flex items-center gap-4 p-5 rounded-[3px] transition-colors duration-300"
                style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}
              >
                <div className="flex items-center justify-center rounded-[4px] overflow-hidden shrink-0" style={{ width: 44, height: 44, backgroundColor: p.logoBg, border: '1px solid var(--c4-border)' }}>
                  <img src={p.logo} alt={`${p.name} logo`} className="h-full w-full" style={{ objectFit: 'contain', padding: 6 }} draggable="false" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold tracking-[-0.01em] flex items-center gap-1" style={{ color: 'var(--c4-text)' }}>
                    {p.name}
                    <ArrowRight size={12} strokeWidth={2} className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" style={{ color: 'var(--c4-accent)' }} />
                  </p>
                  <p className="text-[11.5px] leading-[1.4] truncate" style={{ color: 'var(--c4-text-subtle)' }}>{p.oneLiner}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
