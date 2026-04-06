import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Palette, Camera, Search, Zap, Share2 } from 'lucide-react';
import PageHero from '../components/c4/PageHero';
import PricingCTA from '../components/pricing/PricingCTA';
import { serviceCategories, bundlePackages, CTA_ROUTE } from '../data/pricing';

const ease = [0.22, 1, 0.36, 1];

const iconMap = {
  globe: Globe,
  palette: Palette,
  camera: Camera,
  search: Search,
  zap: Zap,
  share2: Share2,
};

function ServiceCard({ category, index }) {
  const Icon = iconMap[category.icon] || Globe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
    >
      <Link
        to={category.route}
        className="group flex flex-col h-full rounded-sm border p-6 md:p-7 transition-all duration-300"
        style={{ backgroundColor: 'var(--c4-card-bg)', borderColor: 'var(--c4-border)' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--c4-text-faint)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--c4-border)'; }}
      >
        <div className="mb-5">
          <div
            className="w-10 h-10 rounded-sm flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--c4-bg-alt)' }}
          >
            <Icon size={18} strokeWidth={1.5} style={{ color: 'var(--c4-text-muted)' }} />
          </div>
          <h3
            className="text-[1.05rem] font-semibold tracking-[-0.01em] leading-[1.2] mb-2"
            style={{ color: 'var(--c4-text)' }}
          >
            {category.title}
          </h3>
          <p className="text-[13px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>
            {category.description}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--c4-border-light)' }}>
          <span className="text-[12px] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
            From {category.startingFrom}
          </span>
          <ArrowRight
            size={14}
            strokeWidth={2}
            className="opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all duration-300"
            style={{ color: 'var(--c4-text)' }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

function BundlePreview() {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="h-px mb-14" style={{ backgroundColor: 'var(--c4-border)' }} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
        >
          <div>
            <h2
              className="text-[1.3rem] md:text-[1.6rem] font-semibold tracking-[-0.025em] leading-[1.1]"
              style={{ color: 'var(--c4-text)' }}
            >
              Bundle & save
            </h2>
            <p className="mt-3 text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
              Combine services for a better price. Everything your business needs in one package.
            </p>
          </div>
          <Link
            to="/services/bundles"
            className="text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300 shrink-0"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            View all bundles
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bundlePackages.map((bundle, i) => (
            <motion.div
              key={bundle.key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="rounded-sm border p-6 transition-all duration-300"
              style={{ backgroundColor: 'var(--c4-card-bg)', borderColor: 'var(--c4-border)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--c4-text-faint)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--c4-border)'; }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                  {bundle.name}
                </h3>
                {bundle.savings && (
                  <span className="text-[10px] uppercase tracking-[0.1em] font-semibold" style={{ color: 'var(--c4-accent)' }}>
                    {bundle.savings}
                  </span>
                )}
              </div>
              <p className="text-[1.4rem] font-semibold tracking-[-0.02em] mb-3" style={{ color: 'var(--c4-text)' }}>
                {bundle.priceLabel}
              </p>
              <p className="text-[12px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>
                {bundle.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportPreview() {
  return (
    <section className="pb-6">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-sm border p-6 md:p-8"
          style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
        >
          <div>
            <h3
              className="text-[1.05rem] font-semibold tracking-[-0.01em] mb-1"
              style={{ color: 'var(--c4-text)' }}
            >
              Ongoing support plans
            </h3>
            <p className="text-[13px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>
              Post-launch maintenance, updates, and priority support from $99/mo.
            </p>
          </div>
          <Link
            to="/services/support"
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300 shrink-0"
            style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            View plans
            <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function ServicesPricing() {
  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <PageHero
        label="Services & Pricing"
        titleLines={[
          'Solutions built for',
          'your business.',
        ]}
        description="Transparent pricing. No hidden fees. Pick a package or get a custom quote."
      >
        <Link
          to={CTA_ROUTE}
          className="group inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
          style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
        >
          Book a discovery call
          <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
        </Link>
      </PageHero>

      {/* Service Category Grid */}
      <section className="pb-14 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceCategories.map((cat, i) => (
              <ServiceCard key={cat.key} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      <BundlePreview />
      <SupportPreview />
      <PricingCTA showClauses={false} />
    </div>
  );
}
