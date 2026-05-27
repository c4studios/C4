import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import PricingCard from '../components/pricing/PricingCard';
import PackageToggle from '../components/pricing/PackageToggle';
import SubscriptionExplainer from '../components/pricing/SubscriptionExplainer';
import AddOnGrid from '../components/pricing/AddOnGrid';
import IndustrySurchargeNote from '../components/pricing/IndustrySurchargeNote';
import PricingCTA from '../components/pricing/PricingCTA';
import { webDesignAddOns, webPackageSections, webPricingGuides, webScopeNotes, CTA_ROUTE } from '../data/pricing';

const ease = [0.22, 1, 0.36, 1];

const pricingHighlights = [
  { label: 'Landing Page', price: '$500' },
  { label: 'Brochure Site', price: '$800' },
  { label: 'Ecommerce Store', price: '$3,500' },
  { label: 'Web App Starter', price: '$4,500' },
];

function FeatureStrip() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-sm border overflow-hidden"
      style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-border)' }}
    >
      {webPricingGuides.map((guide) => (
        <div key={guide.key} className="p-4" style={{ backgroundColor: 'var(--c4-card-bg)' }}>
          <div className="text-[9px] uppercase tracking-[0.18em] font-medium mb-1" style={{ color: 'var(--c4-text-subtle)' }}>
            {guide.label}
          </div>
          <div className="text-[1.05rem] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>
            {guide.range}
          </div>
        </div>
      ))}
    </div>
  );
}

function PricingHeroShell() {
  return (
    <section className="pt-20 md:pt-24 pb-6 md:pb-8" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 lg:gap-12 items-end"
        >
          <div>
            <Link
              to="/ServicesPricing"
              className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300 mb-5"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              <ArrowLeft size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-all duration-300" />
              All Services
            </Link>

            <h1 className="text-[clamp(2rem,5vw,3.55rem)] font-semibold tracking-[-0.04em] leading-[1.03] max-w-[780px]" style={{ color: 'var(--c4-text)' }}>
              Pricing & packages for websites, stores, and web apps.
            </h1>
            <p className="mt-4 text-[14px] md:text-[15px] leading-[1.65] max-w-[660px]" style={{ color: 'var(--c4-text-muted)' }}>
              Landing pages start at $500, brochure sites at $800, ecommerce stores at $3,500, and web app starters at $4,500.
            </p>
          </div>

          <div
            className="hidden md:block rounded-sm border overflow-hidden"
            style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
          >
            <div className="px-5 py-4 border-b flex items-center justify-between gap-4" style={{ borderColor: 'var(--c4-border-light)' }}>
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
                  Starting points
                </div>
                <div className="mt-1 text-[13px] leading-[1.45]" style={{ color: 'var(--c4-text-muted)' }}>
                  Lower tiers stay lean. Larger work scales by scope.
                </div>
              </div>
              <CheckCircle2 size={18} strokeWidth={1.8} className="shrink-0" style={{ color: 'var(--c4-accent)' }} />
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--c4-border-light)' }}>
              {pricingHighlights.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <span className="text-[13px] font-medium" style={{ color: 'var(--c4-text)' }}>
                    {item.label}
                  </span>
                  <span className="text-[13px] font-semibold tabular-nums" style={{ color: 'var(--c4-text)' }}>
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="#pricing-packages"
              className="group flex items-center justify-between gap-3 px-5 py-3.5 text-[10px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              View Packages
              <ChevronRight size={13} strokeWidth={2} className="opacity-70 group-hover:translate-x-0.5 transition-transform duration-300" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function PricingGuideBand() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="mb-5">
          <FeatureStrip />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {webPricingGuides.map((guide) => (
            <div
              key={guide.key}
              className="rounded-sm border p-5 md:p-6"
              style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
            >
              <div className="text-[10px] uppercase tracking-[0.18em] font-medium mb-2" style={{ color: 'var(--c4-text-subtle)' }}>
                {guide.label}
              </div>
              <h2 className="text-[1.05rem] font-semibold tracking-[-0.02em] mb-3" style={{ color: 'var(--c4-text)' }}>
                {guide.range}
              </h2>
              <p className="text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
                {guide.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ScopeNotesBand() {
  return (
    <section className="pb-12 md:pb-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="mb-6">
            <h2 className="text-[1.15rem] md:text-[1.35rem] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>
              Scope Guardrails
            </h2>
            <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
              The lower entry prices work because the scope is clear before build starts.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {webScopeNotes.map((note) => (
              <div
                key={note.title}
                className="rounded-sm border p-5"
                style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
              >
                <div className="text-[10px] uppercase tracking-[0.18em] font-medium mb-3" style={{ color: 'var(--c4-text-subtle)' }}>
                  {note.title}
                </div>
                <ul className="space-y-2">
                  {note.points.map((point) => (
                    <li key={point} className="text-[13px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function gridColsFor(count) {
  if (count <= 1) return 'grid-cols-1 lg:grid-cols-1';
  if (count <= 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  if (count === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
}

function PricingPackagesSection({ track, setTrack }) {
  return (
    <section id="pricing-packages" className="pt-2 pb-12 md:pt-3 md:pb-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7">
          <div>
            <h2 className="text-[1.45rem] md:text-[1.8rem] font-semibold tracking-[-0.03em] leading-[1.08]" style={{ color: 'var(--c4-text)' }}>
              Pricing & Packages
            </h2>
            <p className="mt-2 text-[13px] md:text-[14px] leading-[1.6] max-w-[680px]" style={{ color: 'var(--c4-text-muted)' }}>
              Pick the closest starting point, then add only the pages, content, integrations, and custom functionality you need.
            </p>
          </div>
          <PackageToggle activeTrack={track} onToggle={setTrack} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={track}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease }}
          >
            {webPackageSections.map((section, sectionIndex) => (
              <div
                key={section.heading}
                className={sectionIndex > 0 ? 'mt-10 pt-8 border-t' : ''}
                style={sectionIndex > 0 ? { borderColor: 'var(--c4-border-light)' } : {}}
              >
                <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <div>
                    <h3 className="text-[1.05rem] md:text-[1.25rem] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>
                      {section.heading}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-[1.55] max-w-[720px]" style={{ color: 'var(--c4-text-muted)' }}>
                      {section.description}
                    </p>
                  </div>
                </div>
                <div className={`grid ${gridColsFor(section.packages.length)} gap-5`}>
                  {section.packages.map((pkg, i) => (
                    <PricingCard
                      key={pkg.key}
                      name={pkg.name}
                      priceLabel={track === 'outright' ? pkg.priceLabel : pkg.monthlyLabel}
                      priceSuffix={track === 'subscription' && pkg.monthlyPrice ? '/month' : undefined}
                      description={pkg.description}
                      features={pkg.features}
                      popular={pkg.popular}
                      index={i}
                    >
                      <Link
                        to={CTA_ROUTE}
                        className="group inline-flex items-center justify-center gap-2 w-full py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium rounded-sm transition-colors duration-300"
                        style={{
                          backgroundColor: pkg.popular ? 'var(--c4-bg)' : 'var(--c4-text)',
                          color: pkg.popular ? 'var(--c4-text)' : 'var(--c4-bg)',
                        }}
                      >
                        {pkg.price ? 'Get Started' : 'Contact Us'}
                        <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                      </Link>
                    </PricingCard>
                  ))}
                </div>
              </div>
            ))}

            {track === 'subscription' && <SubscriptionExplainer />}
          </motion.div>
        </AnimatePresence>

        <IndustrySurchargeNote />
      </div>
    </section>
  );
}

export default function WebDesignPricing() {
  const [track, setTrack] = useState('outright');

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <PricingHeroShell />
      <PricingPackagesSection track={track} setTrack={setTrack} />
      <PricingGuideBand />
      <ScopeNotesBand />
      <AddOnGrid addOns={webDesignAddOns} title="Scope Add-Ons" />
      <PricingCTA />
    </div>
  );
}
