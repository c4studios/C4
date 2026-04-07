import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, X } from 'lucide-react';
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  webDesignPackages,
  webDesignAddOns,
  brandingPackages,
  c4LensPackages,
  seoPackages,
  automationPackages,
  socialMediaPackages,
  subscriptionInfo,
  ASTERISK_CLAUSE,
  GST_NOTE,
  INDUSTRY_SURCHARGE_NOTE,
  CTA_ROUTE,
} from '@/data/pricing';

const ease = [0.22, 1, 0.36, 1];

/* ── Mapping service keys → pricing data ── */
const SERVICE_PRICING_MAP = {
  websites: {
    title: 'Web Design & Development',
    subtitle: 'Custom-coded, high-performance websites.',
    packages: webDesignPackages,
    addOns: webDesignAddOns,
    hasToggle: true,
    hasSurcharge: true,
  },
  apps: {
    title: 'Web Applications',
    subtitle: 'Production-grade web apps — SaaS, portals, dashboards.',
    packages: webDesignPackages,
    addOns: webDesignAddOns,
    hasToggle: true,
    hasSurcharge: true,
  },
  brand: {
    title: 'Branding & Identity',
    subtitle: 'From a standalone logo to a complete identity system.',
    packages: brandingPackages,
    addOns: null,
    hasToggle: false,
    hasSurcharge: false,
  },
  growth: {
    title: 'SEO & Search',
    subtitle: 'Technical SEO, content strategy, and search dominance.',
    packages: seoPackages,
    addOns: null,
    hasToggle: false,
    hasSurcharge: false,
  },
  automation: {
    title: 'Automation & AI',
    subtitle: 'Workflow automation, AI agents, and custom integrations.',
    packages: automationPackages,
    addOns: null,
    hasToggle: false,
    hasSurcharge: false,
  },
  rebuild: {
    title: 'Software Rebuilds',
    subtitle: 'Every rebuild is scoped individually based on complexity.',
    packages: null,
    addOns: null,
    hasToggle: false,
    hasSurcharge: false,
  },
  lens: {
    title: 'C4 Lens',
    subtitle: 'Professional photography and videography.',
    packages: c4LensPackages,
    addOns: null,
    hasToggle: false,
    hasSurcharge: false,
  },
};

/* ── Mini pricing card for inside the dialog ── */
function MiniPricingCard({ pkg, isSubscription, popular }) {
  const priceLabel = isSubscription ? pkg.monthlyLabel : pkg.priceLabel;
  const suffix = isSubscription && pkg.monthlyPrice ? '/month' : (pkg.priceSuffix || undefined);

  return (
    <div
      className="relative flex flex-col h-full rounded-sm border p-5 transition-all duration-200"
      style={{
        backgroundColor: popular ? 'var(--c4-text)' : 'var(--c4-card-bg)',
        borderColor: popular ? 'var(--c4-text)' : 'var(--c4-border)',
      }}
    >
      {popular && (
        <div
          className="absolute -top-2.5 left-5 px-2.5 py-0.5 text-[8px] uppercase tracking-[0.2em] font-semibold rounded-sm"
          style={{ backgroundColor: 'var(--c4-accent)', color: '#fff' }}
        >
          Most Popular
        </div>
      )}

      <h4
        className="text-[11px] uppercase tracking-[0.12em] font-semibold mb-2"
        style={{ color: popular ? 'color-mix(in srgb, var(--c4-bg) 60%, transparent)' : 'var(--c4-text-subtle)' }}
      >
        {pkg.name}
      </h4>
      <div className="flex items-baseline gap-1 mb-2">
        <span
          className="text-[1.4rem] font-semibold tracking-[-0.03em] leading-none"
          style={{ color: popular ? 'var(--c4-bg)' : 'var(--c4-text)' }}
        >
          {priceLabel}
        </span>
        {suffix && (
          <span
            className="text-[10px] font-medium"
            style={{ color: popular ? 'color-mix(in srgb, var(--c4-bg) 50%, transparent)' : 'var(--c4-text-faint)' }}
          >
            {suffix}
          </span>
        )}
      </div>

      <div
        className="h-px my-3"
        style={{ backgroundColor: popular ? 'color-mix(in srgb, var(--c4-bg) 15%, transparent)' : 'var(--c4-border-light)' }}
      />

      <ul className="space-y-1.5 flex-1">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check
              size={12}
              strokeWidth={2}
              className="mt-[3px] shrink-0"
              style={{ color: popular ? 'var(--c4-bg)' : 'var(--c4-accent)' }}
            />
            <span
              className="text-[11.5px] leading-[1.45]"
              style={{ color: popular ? 'color-mix(in srgb, var(--c4-bg) 80%, transparent)' : 'var(--c4-text-muted)' }}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to={CTA_ROUTE}
        className="group inline-flex items-center justify-center gap-2 w-full mt-4 py-2 text-[10px] uppercase tracking-[0.12em] font-medium rounded-sm transition-colors duration-300"
        style={{
          backgroundColor: popular ? 'var(--c4-bg)' : 'var(--c4-text)',
          color: popular ? 'var(--c4-text)' : 'var(--c4-bg)',
        }}
      >
        {pkg.price ? 'Get Started' : 'Contact Us'}
        <ArrowRight size={11} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
      </Link>
    </div>
  );
}

/* ── Toggle ── */
function Toggle({ active, onToggle }) {
  return (
    <div
      className="inline-flex items-center rounded-sm border p-0.5 mb-6"
      style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}
    >
      {[
        { key: 'outright', label: 'Outright Purchase' },
        { key: 'subscription', label: 'Monthly Subscription' },
      ].map((opt) => (
        <button
          key={opt.key}
          onClick={() => onToggle(opt.key)}
          className="relative px-4 py-2 text-[10px] uppercase tracking-[0.12em] font-medium rounded-sm transition-colors duration-200"
          style={{ color: active === opt.key ? 'var(--c4-bg)' : 'var(--c4-text-muted)' }}
        >
          {active === opt.key && (
            <motion.div
              layoutId="dialog-toggle-bg"
              className="absolute inset-0 rounded-sm"
              style={{ backgroundColor: 'var(--c4-text)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Subscription explainer ── */
function MiniSubscriptionExplainer() {
  const items = [
    { label: 'How it works', text: subscriptionInfo.howItWorks },
    { label: "What's included", text: subscriptionInfo.whatsIncluded },
    { label: 'Ownership', text: subscriptionInfo.ownership },
    { label: 'Cancel anytime', text: subscriptionInfo.cancellation },
  ];

  return (
    <div
      className="mt-6 rounded-sm border p-5"
      style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
    >
      <h4 className="text-[12px] font-semibold tracking-[-0.01em] mb-4" style={{ color: 'var(--c4-text)' }}>
        How the subscription model works
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="text-[9px] uppercase tracking-[0.18em] font-medium mb-1" style={{ color: 'var(--c4-text-subtle)' }}>
              {item.label}
            </div>
            <p className="text-[11.5px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Add-ons section ── */
function MiniAddOnGrid({ addOns }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? addOns : addOns.slice(0, 9);

  return (
    <div className="mt-8">
      <h4 className="text-[12px] font-semibold tracking-[-0.01em] mb-3" style={{ color: 'var(--c4-text)' }}>
        Add-Ons
      </h4>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-sm border overflow-hidden"
        style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-border)' }}
      >
        {visible.map((a) => (
          <div
            key={a.name}
            className="flex items-center justify-between gap-3 px-4 py-2.5"
            style={{ backgroundColor: 'var(--c4-card-bg)' }}
          >
            <span className="text-[11.5px] leading-[1.35]" style={{ color: 'var(--c4-text-muted)' }}>
              {a.name}
            </span>
            <span className="text-[11.5px] font-semibold tabular-nums shrink-0" style={{ color: 'var(--c4-text)' }}>
              ${a.price.toLocaleString()}{a.suffix || ''}
            </span>
          </div>
        ))}
      </div>
      {addOns.length > 9 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-[10px] uppercase tracking-[0.12em] font-medium transition-colors duration-200"
          style={{ color: 'var(--c4-text-subtle)' }}
        >
          {showAll ? 'Show less' : `Show all ${addOns.length} add-ons`}
        </button>
      )}
    </div>
  );
}

/* ── Industry surcharge ── */
function MiniSurchargeNote() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="mt-6 rounded-sm border"
      style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left">
        <span className="text-[11px] font-medium" style={{ color: 'var(--c4-text-muted)' }}>
          Industry surcharges — do they apply to me?
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease }}
          className="shrink-0"
          style={{ color: 'var(--c4-text-faint)' }}
        >
          <ChevronDown size={14} strokeWidth={1.5} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="h-px mb-3" style={{ backgroundColor: 'var(--c4-border-light)' }} />
              <p className="text-[11px] leading-[1.6]" style={{ color: 'var(--c4-text-subtle)' }}>
                {INDUSTRY_SURCHARGE_NOTE}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Custom quote panel (for rebuilds) ── */
function CustomQuotePanel() {
  return (
    <div
      className="rounded-sm border p-6 text-center"
      style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
    >
      <h4 className="text-[1.1rem] font-semibold tracking-[-0.02em] mb-2" style={{ color: 'var(--c4-text)' }}>
        Custom Quote
      </h4>
      <p className="text-[13px] leading-[1.6] mb-5 max-w-[400px] mx-auto" style={{ color: 'var(--c4-text-muted)' }}>
        Every rebuild is scoped individually based on system complexity, migration requirements, and desired outcome. Book a discovery call and we&apos;ll scope it together.
      </p>
      <Link
        to={CTA_ROUTE}
        className="group inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
        style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
      >
        Book a Discovery Call
        <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
      </Link>
    </div>
  );
}

/* ── Main Dialog Component ── */
export default function PricingDialog({ serviceKey, open, onOpenChange }) {
  const [track, setTrack] = useState('outright');
  const config = SERVICE_PRICING_MAP[serviceKey];

  if (!config) return null;

  const isSubscription = track === 'subscription';
  const gridCols = config.packages
    ? config.packages.length <= 3
      ? 'grid-cols-1 md:grid-cols-3'
      : config.packages.length === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
          style={{ backgroundColor: 'transparent' }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Backdrop click to close */}
          <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

          {/* Dialog body */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease }}
            className="relative z-10 w-full max-w-[1100px] mx-4 my-8 md:my-12 rounded-sm border"
            style={{
              backgroundColor: 'var(--c4-bg)',
              borderColor: 'var(--c4-border)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 z-20 rounded-sm p-1.5 transition-colors duration-200"
              style={{ color: 'var(--c4-text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c4-text)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--c4-text-muted)'; }}
            >
              <X size={18} strokeWidth={1.5} />
              <span className="sr-only">Close</span>
            </button>

            {/* Header */}
            <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-px" style={{ backgroundColor: 'var(--c4-accent)' }} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
                  Pricing & Packages
                </span>
              </div>
              <DialogPrimitive.Title
                className="text-[1.4rem] md:text-[1.7rem] font-semibold tracking-[-0.03em] leading-[1.1]"
                style={{ color: 'var(--c4-text)' }}
              >
                {config.title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description
                className="mt-2 text-[13px] leading-[1.55]"
                style={{ color: 'var(--c4-text-muted)' }}
              >
                {config.subtitle}
              </DialogPrimitive.Description>
            </div>

            {/* Content */}
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              {/* Toggle for web design / apps */}
              {config.hasToggle && (
                <Toggle active={track} onToggle={setTrack} />
              )}

              {/* Package cards or custom quote */}
              {config.packages ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isSubscription ? 'sub' : 'out'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease }}
                  >
                    <div className={`grid ${gridCols} gap-4`}>
                      {config.packages.map((pkg) => (
                        <MiniPricingCard
                          key={pkg.key}
                          pkg={pkg}
                          isSubscription={config.hasToggle && isSubscription}
                          popular={pkg.popular}
                        />
                      ))}
                    </div>

                    {config.hasToggle && isSubscription && <MiniSubscriptionExplainer />}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <CustomQuotePanel />
              )}

              {/* Surcharge note */}
              {config.hasSurcharge && <MiniSurchargeNote />}

              {/* Add-ons */}
              {config.addOns && <MiniAddOnGrid addOns={config.addOns} />}

              {/* Clauses */}
              <div className="mt-8 pt-5" style={{ borderTop: '1px solid var(--c4-border-light)' }}>
                <p className="text-[10.5px] leading-[1.65] mb-2" style={{ color: 'var(--c4-text-subtle)' }}>
                  {ASTERISK_CLAUSE}
                </p>
                <p className="text-[10px] leading-[1.5]" style={{ color: 'var(--c4-text-faint)' }}>
                  {GST_NOTE}
                </p>
              </div>
            </div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
