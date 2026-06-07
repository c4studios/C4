import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

function statusColor(status) {
  if (status === 'Live') return 'var(--c4-brand-success, #22c55e)';
  if (status === 'Beta') return 'var(--c4-accent)';
  return 'var(--c4-text-faint)';
}

const SOFTWARE_PRODUCTS = [
  {
    name: 'Quotr',
    status: 'Live',
    oneLiner: 'Instant quote calculators for service businesses.',
    href: 'https://quotr.us',
    external: true,
  },
  {
    name: 'ReturnDesk',
    status: 'Beta',
    oneLiner: 'Priority inbox — know who to call back first, and why.',
    href: '/software#returndesk',
  },
  {
    name: 'ReviewLoop',
    status: 'Coming Soon',
    oneLiner: 'Turn happy jobs into Google reviews automatically.',
    href: '/software#reviewloop',
  },
  {
    name: 'Complia',
    status: 'Coming Soon',
    oneLiner: 'Australian compliance calendar for small businesses.',
    href: '/software#complia',
  },
  {
    name: 'FirmFlow',
    status: 'Coming Soon',
    oneLiner: 'AI content engine for professional services firms.',
    href: '/software#firmflow',
  },
];

const SERVICES = [
  {
    slug: 'web',
    name: 'Web Design & Development',
    labelColor: 'var(--c4-accent)',
    oneLiner: 'Modern websites and web apps, built to convert.',
    description:
      'From landing pages to full-stack applications, C4 Studios builds sites with Next.js, React, and Supabase — custom-coded, not templated. Every project includes design, development, deployment, and handover.',
    features: [
      'Custom design (no templates, no page builders)',
      'Next.js / React / TypeScript stack',
      'Mobile-first and performance-optimised',
      'Supabase, Stripe, and third-party integrations',
      'DNS, hosting, and deployment included',
    ],
    pricing: 'From $2,500 one-off or $149/mo ongoing',
    cta: { label: 'Start a project', to: createPageUrl('Contact') },
  },
  {
    slug: 'automation',
    name: 'AI Automation',
    labelColor: 'var(--c4-brand-success, #22c55e)',
    oneLiner: 'Autonomous systems that replace repetitive work.',
    description:
      'C4 Studios builds production-grade AI pipelines — lead generation engines, document automation, email drafting systems, and workflow orchestration. Using Claude API, n8n, Supabase, and Microsoft Graph, we connect your existing tools and automate the work in between.',
    features: [
      'AI-powered lead research and outreach pipelines',
      'Document processing and email drafting automation',
      'CRM and inbox automation with Microsoft 365',
      'n8n workflow design and deployment',
      'Ongoing monitoring and optimisation',
    ],
    pricing: 'From $1,500 — scoped per project',
    cta: { label: 'Discuss your workflow', to: createPageUrl('Contact') },
  },
  {
    slug: 'software',
    name: 'Software Products',
    labelColor: 'var(--c4-brand-success, #22c55e)',
    oneLiner: 'Off-the-shelf tools built for Australian service businesses.',
    description:
      'The C4 software suite is a collection of SaaS products built in-house and available to purchase directly. C4 Studios visitors get studio pricing — early access at below-market rates.',
    softwareProducts: true,
    cta: { label: 'See all products and pricing', to: createPageUrl('Software') },
  },
  {
    slug: 'branding',
    name: 'Branding',
    labelColor: 'var(--c4-accent)',
    oneLiner: 'Brand identity for businesses that mean business.',
    description:
      'Logo design, brand systems, style guides, and visual identity — built to work across web, print, and social. C4 Studios approaches branding as a system, not just a logo.',
    features: [
      'Logo design and refinement',
      'Colour palette, typography, and brand tokens',
      'Style guide document',
      'Social media and digital asset templates',
      'Brand rollout across web and collateral',
    ],
    pricing: 'From $800 standalone',
    cta: { label: 'Start your brand', to: createPageUrl('Contact') },
  },
  {
    slug: 'seo',
    name: 'SEO',
    labelColor: 'var(--c4-text-muted)',
    oneLiner: 'Rank for the searches that bring real clients.',
    description:
      'Technical SEO, content strategy, and local search optimisation for Perth and Australian businesses. C4 Studios focuses on the work that moves rankings — not monthly reports that don\'t.',
    features: [
      'Technical SEO audit and implementation',
      'Google Business Profile setup and optimisation',
      'Local SEO for Perth and WA service areas',
      'Content brief and blog strategy',
      'Schema markup and structured data',
    ],
    pricing: 'From $500/mo ongoing',
    cta: { label: 'Get an audit', to: createPageUrl('Contact') },
  },
  {
    slug: 'lens',
    name: 'C4 Lens — Photo & Video',
    labelColor: 'var(--c4-text-muted)',
    oneLiner: 'Commercial photography and videography for brands that care.',
    description:
      'C4 Lens delivers commercial photography and videography for Perth businesses, social media content, product shoots, and brand films. The same design discipline that goes into the studio\'s web work goes into every shoot.',
    features: [
      'Commercial product and brand photography',
      'Social media content creation and series',
      'Brand film and videography',
      'Event and behind-the-scenes coverage',
      'Post-production and editing included',
    ],
    pricing: 'From $600/half-day',
    cta: { label: 'Enquire about a shoot', to: createPageUrl('Lens') },
  },
  {
    slug: 'c4sight',
    name: 'C4Sight — AI Training & Consulting',
    labelColor: 'var(--c4-brand-success, #22c55e)',
    oneLiner: 'AI literacy for teams, delivered in your workplace.',
    description:
      'C4Sight is the training and consulting arm of C4 Studios. We go into workplaces and teach employees how to work alongside AI — practically, not theoretically. From half-day workshops to ongoing implementation support, C4Sight helps teams move faster without replacing people.',
    features: [
      'AI literacy workshops (half-day or full-day)',
      'Hands-on training with ChatGPT, Claude, and relevant AI tools for your industry',
      'Automation readiness assessment',
      'Executive AI briefings for leadership teams',
      'Ongoing implementation support and check-ins',
    ],
    pricing: 'From $800/half-day workshop — custom packages available',
    cta: { label: 'Book a workplace session', to: createPageUrl('Foresight') },
  },
];

function ServiceBlock({ service, isOpen, onToggle, index }) {
  return (
    <motion.div
      id={service.slug}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: index * 0.04, ease }}
      className="scroll-mt-24 border-t"
      style={{ borderColor: 'var(--c4-border-light)' }}
    >
      {/* Header row — always visible */}
      <button
        onClick={onToggle}
        className="group w-full text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between gap-6 py-7 md:py-8">
          <div className="flex items-start gap-4 md:items-center">
            <span
              className="mt-[3px] shrink-0 text-[9px] uppercase tracking-[0.18em] font-semibold md:mt-0"
              style={{ color: service.labelColor, minWidth: '2.5rem' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h2 className="text-[1.05rem] font-semibold tracking-[-0.015em] transition-colors duration-300 md:text-[1.2rem]" style={{ color: 'var(--c4-text)' }}>
                {service.name}
              </h2>
              <p className="mt-0.5 text-[13px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>
                {service.oneLiner}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease }}
            className="shrink-0"
          >
            <ChevronDown size={16} strokeWidth={1.5} style={{ color: 'var(--c4-text-faint)' }} />
          </motion.div>
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-10 md:pb-12">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px] lg:gap-14">
                {/* Left — description + features / products */}
                <div>
                  <p className="text-[14px] leading-[1.75] mb-6" style={{ color: 'var(--c4-text-subtle)' }}>
                    {service.description}
                  </p>

                  {service.features && (
                    <ul className="space-y-2.5">
                      {service.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 text-[13px] leading-[1.5]"
                          style={{ color: 'var(--c4-text-subtle)' }}
                        >
                          <Check size={12} strokeWidth={2.5} className="mt-[3px] shrink-0" style={{ color: 'var(--c4-accent)' }} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  )}

                  {service.softwareProducts && (
                    <div className="space-y-2.5">
                      {SOFTWARE_PRODUCTS.map((p) => {
                        const color = statusColor(p.status);
                        const inner = (
                          <div
                            className="group flex items-center gap-3 rounded-[3px] px-4 py-3 transition-colors duration-200"
                            style={{ border: '1px solid var(--c4-border-light)', backgroundColor: 'var(--c4-card-bg)' }}
                          >
                            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                              <span className="text-[13px] font-semibold tracking-[-0.01em] shrink-0" style={{ color: 'var(--c4-text)' }}>
                                {p.name}
                              </span>
                              <div className="inline-flex items-center gap-1 rounded-full px-2 py-[2px]" style={{ border: `1px solid ${color}` }}>
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-[8.5px] uppercase tracking-[0.12em] font-semibold" style={{ color }}>{p.status}</span>
                              </div>
                              <span className="text-[12.5px] leading-[1.45]" style={{ color: 'var(--c4-text-muted)' }}>{p.oneLiner}</span>
                            </div>
                            <span className="shrink-0 text-[10px] uppercase tracking-[0.1em] font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ color: 'var(--c4-accent)' }}>
                              View →
                            </span>
                          </div>
                        );
                        return p.external ? (
                          <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>
                        ) : (
                          <Link key={p.name} to={p.href} className="block">{inner}</Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right — pricing + CTA */}
                <div className="self-start rounded-[3px] p-5 md:p-6" style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
                  {service.pricing && (
                    <>
                      <span className="block text-[9.5px] uppercase tracking-[0.18em] font-medium mb-1.5" style={{ color: 'var(--c4-text-faint)' }}>
                        Pricing
                      </span>
                      <p className="text-[13.5px] font-semibold mb-5 leading-[1.5]" style={{ color: 'var(--c4-text)' }}>
                        {service.pricing}
                      </p>
                    </>
                  )}
                  {service.cta && (
                    <Link
                      to={service.cta.to}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[3px] py-3 text-[10.5px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
                      style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                    >
                      {service.cta.label}
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </Link>
                  )}
                  {service.softwareProducts && (
                    <Link
                      to={service.cta.to}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[3px] py-3 text-[10.5px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
                      style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                    >
                      {service.cta.label}
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Services() {
  const [openSlug, setOpenSlug] = useState(null);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setOpenSlug(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, []);

  const toggle = (slug) => setOpenSlug((prev) => (prev === slug ? null : slug));

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      {/* HERO */}
      <section className="pt-28 pb-14 md:pt-36 md:pb-18">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
              Services
            </span>
            <h1
              className="mt-4 text-[2.2rem] font-semibold tracking-[-0.04em] leading-[1.05] md:text-[3.2rem]"
              style={{ color: 'var(--c4-text)' }}
            >
              What we build,<br className="hidden md:block" /> and how.
            </h1>
            <p
              className="mt-5 max-w-[500px] text-[14px] leading-[1.7] md:text-[15px]"
              style={{ color: 'var(--c4-text-muted)' }}
            >
              Every engagement starts with understanding the problem. Here's what that looks like across each of our service lines.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SERVICE ACCORDION */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          {SERVICES.map((service, i) => (
            <ServiceBlock
              key={service.slug}
              service={service}
              isOpen={openSlug === service.slug}
              onToggle={() => toggle(service.slug)}
              index={i}
            />
          ))}
          {/* Closing rule */}
          <div className="border-t" style={{ borderColor: 'var(--c4-border-light)' }} />
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
            className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="max-w-[480px] text-[14px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
              Not sure which service fits? Tell us the problem you're trying to solve and we'll figure it out together.
            </p>
            <Link
              to={createPageUrl('Contact')}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-opacity duration-200 hover:opacity-75"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              Start a conversation
              <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
