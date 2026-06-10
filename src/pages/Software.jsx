import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Copy, CheckCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';
import WaitlistModal from '../components/WaitlistModal';
import StripeCheckoutModal from '../components/StripeCheckoutModal';

// The C4 suite app — ReviewLoop, Complia, FirmFlow (and ReturnDesk accounts)
// live here. Paid plans are managed in-app so purchases grant access directly.
const SUITE_APP_URL = 'https://c4-saas-suite.vercel.app';

// ─── Stripe price IDs (live) ────────────────────────────────────────────────
// Payment links are the fallback when VITE_STRIPE_PUBLISHABLE_KEY is not set.
// Embedded checkout is preferred — add the env var to enable it.
const PRODUCTS = [
  {
    slug: 'quotr',
    name: 'Quotr',
    status: 'Live',
    logoUrl: '/Software/quotr-icon.jpeg',
    oneLiner: 'Instant quote calculators for service businesses.',
    features: [
      'Embed on any website in 5 minutes',
      'Stripe billing built in',
      'Email notification on every lead',
    ],
    promoCode: 'C4HALF',
    promoNote: '50% off your first 3 months — enter at checkout on quotr.us',
    tiers: [
      {
        label: 'Starter',
        price: 29,
        image: '/Software/quotr-starter.jpeg',
        href: 'https://quotr.us',
        ctaLabel: 'Get started',
      },
      {
        label: 'Pro',
        price: 59,
        image: '/Software/quotr-pro.jpeg',
        href: 'https://quotr.us',
        ctaLabel: 'Get started',
      },
      {
        label: 'Agency',
        price: 99,
        image: '/Software/quotr-agency.jpeg',
        href: 'https://quotr.us',
        ctaLabel: 'Get started',
      },
    ],
  },
  {
    slug: 'returndesk',
    name: 'ReturnDesk',
    status: 'Beta',
    logoUrl: '/Software/ReturnDesk.png',
    logoUrlMinimal: '/Software/returndesk-minimal.png',
    oneLiner: 'Priority inbox for service businesses.',
    features: [
      'Manual-first, works on day one',
      'Explainable priority scoring',
      'Reply templates for every category',
    ],
    tiers: [
      {
        label: 'Beta',
        badge: 'Early bird',
        price: 49,
        highlight: true,
        note: 'Locks in at $49/mo forever — start free, upgrade in the app',
        href: SUITE_APP_URL,
        ctaLabel: 'Start free',
        tierFeatures: [
          'Priority scoring engine',
          'Reply template library',
          'Locked at $49/mo forever',
        ],
      },
      {
        label: 'Pro',
        price: 99,
        note: 'Price at full launch',
        href: SUITE_APP_URL,
        ctaLabel: 'Start free',
        tierFeatures: [
          'Priority scoring engine',
          'Reply template library',
          'Priority support',
        ],
      },
    ],
  },
  {
    slug: 'reviewloop',
    name: 'ReviewLoop',
    status: 'Live',
    logoUrl: '/Software/ReviewLoop.png',
    logoUrlMinimal: '/Software/reviewloop-minimal.png',
    oneLiner: 'Turn happy jobs into Google reviews.',
    features: [
      'Templated review request emails',
      'Click-tracked review links',
      'Follow-up reminders built in',
    ],
    tiers: [
      {
        label: 'Starter',
        price: 29,
        href: SUITE_APP_URL,
        ctaLabel: 'Start free',
        tierFeatures: [
          '500 review requests/month',
          'Review request templates',
          'Click tracking on review links',
        ],
      },
      {
        label: 'Pro',
        price: 79,
        href: SUITE_APP_URL,
        ctaLabel: 'Start free',
        tierFeatures: [
          'Unlimited review requests',
          'Unlimited templates',
          'Follow-up queue + tracking',
        ],
      },
    ],
  },
  {
    slug: 'complia',
    name: 'Complia',
    status: 'Live',
    logoUrl: '/Software/Complia.png',
    oneLiner: 'Australian compliance calendar and assistant.',
    features: [
      'BAS, super, and ASIC annual review tracking',
      'Preparation checklists per obligation',
      'Email reminder delivery built in',
    ],
    tiers: [
      {
        label: 'Pro',
        price: 49,
        href: SUITE_APP_URL,
        ctaLabel: 'Start free',
        tierFeatures: [
          'BAS and super tracking',
          'Preparation checklists',
          'Email reminders before due dates',
        ],
      },
      {
        label: 'Business',
        price: 99,
        href: SUITE_APP_URL,
        ctaLabel: 'Start free',
        tierFeatures: [
          'Everything in Pro',
          'Unlimited business profiles',
          'Priority support',
        ],
      },
    ],
  },
  {
    slug: 'firmflow',
    name: 'FirmFlow',
    status: 'Live',
    logoUrl: '/Software/FirmFlow.png',
    oneLiner: 'AI content engine for professional services.',
    features: [
      'LinkedIn posts, newsletters, client emails',
      'Source-first AI generation (no invented facts)',
      'Built-in disclaimer and risk controls',
    ],
    tiers: [
      {
        label: 'Pro',
        price: 79,
        href: SUITE_APP_URL,
        ctaLabel: 'Start free',
        tierFeatures: [
          'Unlimited content packs',
          'All five output formats',
          'Per-industry AI prompts',
        ],
      },
      {
        label: 'Agency',
        price: 199,
        href: SUITE_APP_URL,
        ctaLabel: 'Start free',
        tierFeatures: [
          'Everything in Pro',
          'Built for multi-client firms',
          'Priority support',
        ],
      },
    ],
  },
  {
    slug: 'c4-command',
    name: 'C4 Command',
    status: 'Studio',
    logoUrl: '/Software/C4Command.png',
    oneLiner: 'Operational hub for the C4 Studio.',
    features: [
      'Lead pipeline and outreach monitoring',
      'Automation health dashboard',
      'Projects, invoices, and client notes',
    ],
    tiers: [
      {
        label: 'Studio',
        price: null,
        note: 'Available to C4 Studios clients and partners',
        cta: 'mailto',
        href: 'mailto:caleb@c4studios.com.au?subject=C4 Command',
        ctaLabel: 'Get in touch',
        tierFeatures: [
          'Full C4 Command access',
          'Onboarding and setup',
          'Ongoing studio support',
        ],
      },
    ],
  },
];

// Lifetime one-time payment links (live).
const LIFETIME_LINKS = {
  quotr: "https://buy.stripe.com/4gM5kDbdm1sU2stcmQ3ZK0f",
  returndesk: "https://buy.stripe.com/dRmbJ16X68Vmfff4Uo3ZK0h",
  reviewloop: "https://buy.stripe.com/00w28r6X60oQaYZeuY3ZK0i",
  complia: "https://buy.stripe.com/cNibJ1a9i7Ri1op72w3ZK0j",
  firmflow: "https://buy.stripe.com/00w4gz1CMdbC4ABgD63ZK0k",
};

// Lifetime one-time prices (AUD) shown on the card.
const LIFETIME_PRICES = {
  quotr: 1899,
  returndesk: 1199,
  reviewloop: 699,
  complia: 1199,
  firmflow: 1899,
};

// Annual = 10× the monthly rate (two months free) — display only; these
// products don't have dedicated annual Stripe SKUs yet.
const ANNUAL_MONTHS = 10;

const ease = [0.22, 1, 0.36, 1];

function statusColor(status) {
  if (status === 'Live') return 'var(--c4-brand-success, #22c55e)';
  if (status === 'Beta') return 'var(--c4-accent)';
  return 'var(--c4-text-faint)';
}

function ProductLogo({ logoUrl, logoUrlMinimal, name }) {
  if (!logoUrl) return null;
  return (
    <div className="group relative inline-flex shrink-0 h-9">
      <img
        src={logoUrl}
        alt={name}
        className={`h-9 w-auto object-contain transition-opacity duration-500${logoUrlMinimal ? ' group-hover:opacity-0' : ''}`}
      />
      {logoUrlMinimal && (
        <img
          src={logoUrlMinimal}
          alt={name}
          className="absolute left-0 top-0 h-9 w-auto object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
    </div>
  );
}

function PromoStrip({ code, note }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="mt-6 flex flex-col gap-3 rounded-[3px] px-5 py-4 sm:flex-row sm:items-center sm:gap-5"
      style={{ border: '1px solid var(--c4-border-light)', backgroundColor: 'var(--c4-bg-alt)' }}
    >
      <button
        onClick={handleCopy}
        className="flex items-center gap-2.5 rounded-[3px] self-start px-3 py-2 transition-colors duration-200"
        style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}
      >
        <span className="font-mono text-[13px] font-bold tracking-[0.08em]" style={{ color: 'var(--c4-text)' }}>
          {code}
        </span>
        <span
          className="flex items-center gap-1 text-[9.5px] uppercase tracking-[0.1em] font-medium transition-colors duration-200"
          style={{ color: copied ? 'var(--c4-brand-success, #22c55e)' : 'var(--c4-text-faint)' }}
        >
          {copied ? <><Check size={10} strokeWidth={2.5} /> Copied</> : <><Copy size={10} strokeWidth={2} /> Copy</>}
        </span>
      </button>
      <p className="text-[12.5px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>
        {note}
      </p>
    </div>
  );
}

function TierCard({ tier, product, period = 'monthly', onCheckout, onWaitlist }) {
  const hasEmbedded = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const isCheckout = tier.cta === 'checkout';
  const isAnnual = period === 'annual';
  const borderColor = tier.highlight ? 'var(--c4-accent)' : 'var(--c4-border)';

  const handleCta = () => {
    if (isCheckout) {
      // No dedicated annual SKU — never charge monthly while showing an annual
      // price. Route annual interest to the waitlist instead.
      if (isAnnual) {
        onWaitlist(product.name);
      } else if (hasEmbedded && tier.priceId) {
        onCheckout(tier.priceId, `${product.name} — ${tier.label}`);
      } else if (tier.paymentLink) {
        window.open(tier.paymentLink, '_blank', 'noopener noreferrer');
      } else {
        onWaitlist(product.name);
      }
    } else if (tier.cta === 'waitlist') {
      onWaitlist(product.name);
    }
  };

  return (
    <div
      className="flex flex-col rounded-[3px] overflow-hidden"
      style={{ border: `1px solid ${borderColor}`, backgroundColor: 'var(--c4-card-bg)' }}
    >
      {/* Plan image — Quotr only */}
      {tier.image && (
        <div className="aspect-[4/3] w-full overflow-hidden bg-white">
          <img src={tier.image} alt={`${product.name} ${tier.label}`} className="h-full w-full object-contain p-4" />
        </div>
      )}

      {/* Tier body */}
      <div className="flex flex-1 flex-col p-6">
        {/* Label + badge */}
        <div className="mb-4 flex items-center gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: 'var(--c4-text-subtle)' }}>
            {tier.label}
          </span>
          {tier.badge && (
            <span
              className="rounded-full px-2 py-[2px] text-[8.5px] uppercase tracking-[0.12em] font-semibold"
              style={{ backgroundColor: 'var(--c4-accent)', color: 'var(--c4-bg)' }}
            >
              {tier.badge}
            </span>
          )}
        </div>

        {/* Price */}
        {tier.price !== null && tier.price !== undefined ? (
          <div className="mb-1 flex items-baseline gap-1.5">
            <span className="text-[2.4rem] font-bold tracking-[-0.04em] leading-none" style={{ color: 'var(--c4-text)' }}>
              ${isAnnual ? tier.price * ANNUAL_MONTHS : tier.price}
            </span>
            <span className="text-[12px]" style={{ color: 'var(--c4-text-muted)' }}>
              {isAnnual ? '/yr · AUD' : '/mo · AUD'}
            </span>
          </div>
        ) : (
          <div className="mb-1">
            <span className="text-[1.1rem] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>
              Contact for pricing
            </span>
          </div>
        )}

        {tier.note && (
          <p className="mb-4 text-[11.5px]" style={{ color: 'var(--c4-text-faint)' }}>
            {tier.note}
          </p>
        )}

        {/* Tier feature list */}
        {tier.tierFeatures && tier.tierFeatures.length > 0 && (
          <ul className="mt-4 mb-5 space-y-2.5 border-t pt-4" style={{ borderColor: 'var(--c4-border-light)' }}>
            {tier.tierFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[12.5px] leading-[1.45]" style={{ color: 'var(--c4-text-subtle)' }}>
                <Check size={12} strokeWidth={2.5} className="mt-[2px] shrink-0" style={{ color: 'var(--c4-accent)' }} />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2">
          {tier.href && tier.cta !== 'checkout' ? (
            <a
              href={tier.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-[3px] py-3 text-[10.5px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
              style={{
                backgroundColor: tier.highlight ? 'var(--c4-accent)' : 'var(--c4-text)',
                color: 'var(--c4-bg)',
              }}
            >
              {tier.ctaLabel}
              <ArrowUpRight size={12} strokeWidth={2.5} />
            </a>
          ) : tier.cta === 'mailto' ? (
            <a
              href={tier.href}
              className="flex w-full items-center justify-center gap-2 rounded-[3px] py-3 text-[10.5px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              {tier.ctaLabel}
              <ArrowRight size={12} strokeWidth={2.5} />
            </a>
          ) : (
            <button
              onClick={handleCta}
              className="flex w-full items-center justify-center gap-2 rounded-[3px] py-3 text-[10.5px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
              style={{
                backgroundColor: tier.highlight ? 'var(--c4-accent)' : 'var(--c4-text)',
                color: 'var(--c4-bg)',
              }}
            >
              {tier.ctaLabel}
              <ArrowRight size={12} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BillingToggle({ period, setPeriod, hasLifetime }) {
  const opts = hasLifetime ? ['monthly', 'annual', 'lifetime'] : ['monthly', 'annual'];
  return (
    <div
      className="mb-7 inline-flex rounded-full p-0.5"
      style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}
    >
      {opts.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={period === o}
          onClick={() => setPeriod(o)}
          className="rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.12em] font-semibold capitalize transition-colors duration-200"
          style={period === o
            ? { backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }
            : { color: 'var(--c4-text-muted)' }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

const SUITE_SLUGS = ['returndesk', 'reviewloop', 'complia', 'firmflow'];

function LifetimeCard({ product }) {
  const price = LIFETIME_PRICES[product.slug];
  const isSuiteProduct = SUITE_SLUGS.includes(product.slug);
  const link = isSuiteProduct ? SUITE_APP_URL : LIFETIME_LINKS[product.slug];
  return (
    <div
      className="flex flex-col rounded-[3px] overflow-hidden"
      style={{ border: '1px solid var(--c4-accent)', backgroundColor: 'var(--c4-card-bg)' }}
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: 'var(--c4-text-subtle)' }}>
            Lifetime
          </span>
          <span
            className="rounded-full px-2 py-[2px] text-[8.5px] uppercase tracking-[0.12em] font-semibold"
            style={{ backgroundColor: 'var(--c4-accent)', color: 'var(--c4-bg)' }}
          >
            Best value
          </span>
        </div>
        <div className="mb-1 flex items-baseline gap-1.5">
          <span className="text-[2.4rem] font-bold tracking-[-0.04em] leading-none" style={{ color: 'var(--c4-text)' }}>
            ${price.toLocaleString()}
          </span>
          <span className="text-[12px]" style={{ color: 'var(--c4-text-muted)' }}>one-time · AUD</span>
        </div>
        <p className="mb-4 text-[11.5px]" style={{ color: 'var(--c4-text-faint)' }}>
          One-time payment. Yours forever. Purchased inside the app so access
          is linked to your account.
        </p>
        {product.features?.length > 0 && (
          <ul className="mt-4 mb-5 space-y-2.5 border-t pt-4" style={{ borderColor: 'var(--c4-border-light)' }}>
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[12.5px] leading-[1.45]" style={{ color: 'var(--c4-text-subtle)' }}>
                <Check size={12} strokeWidth={2.5} className="mt-[2px] shrink-0" style={{ color: 'var(--c4-accent)' }} />
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-[3px] py-3 text-[10.5px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
            style={{ backgroundColor: 'var(--c4-accent)', color: 'var(--c4-bg)' }}
          >
            Get lifetime access
            <ArrowUpRight size={12} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  );
}

function ProductBlock({ product, onCheckout, onWaitlist }) {
  const [period, setPeriod] = useState('monthly');
  const color = statusColor(product.status);
  const hasLifetime = !!LIFETIME_LINKS[product.slug];
  const tierCount = product.tiers.length;
  const tierGridCols =
    tierCount === 1 ? 'grid-cols-1' :
    tierCount === 2 ? 'grid-cols-1 md:grid-cols-2' :
    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  const showLifetime = hasLifetime && period === 'lifetime';

  return (
    <motion.div
      id={product.slug}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: 0.04, ease }}
      className="border-t py-14 scroll-mt-24 md:py-18"
      style={{ borderColor: 'var(--c4-border-light)' }}
    >
      {/* Product header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 md:gap-8">
        <ProductLogo logoUrl={product.logoUrl} logoUrlMinimal={product.logoUrlMinimal} name={product.name} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1.5">
            <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] leading-[1.1] md:text-[1.8rem]" style={{ color: 'var(--c4-text)' }}>
              {product.name}
            </h2>
            <div
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-[3px]"
              style={{ border: `1px solid ${color}` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[9px] uppercase tracking-[0.14em] font-semibold" style={{ color }}>
                {product.status}
              </span>
            </div>
          </div>
          <p className="text-[14px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
            {product.oneLiner}
          </p>
        </div>
      </div>

      {/* Feature list */}
      <ul className="mb-9 flex flex-wrap items-center gap-x-6 gap-y-2">
        {product.features.map((feat) => (
          <li key={feat} className="flex items-center gap-2 text-[12.5px]" style={{ color: 'var(--c4-text-subtle)' }}>
            <Check size={11} strokeWidth={2.5} style={{ color: 'var(--c4-accent)' }} />
            {feat}
          </li>
        ))}
      </ul>

      {/* Billing period selector — only when a lifetime option exists */}
      {hasLifetime && <BillingToggle period={period} setPeriod={setPeriod} hasLifetime={hasLifetime} />}

      {/* Tiers, or the single lifetime card */}
      {showLifetime ? (
        <div className="max-w-[360px]">
          <LifetimeCard product={product} />
        </div>
      ) : (
        <div className={`grid gap-4 ${tierGridCols} ${tierCount === 1 ? 'max-w-[360px]' : ''}`}>
          {product.tiers.map((tier) => (
            <TierCard
              key={tier.label}
              tier={tier}
              product={product}
              period={period}
              onCheckout={onCheckout}
              onWaitlist={onWaitlist}
            />
          ))}
        </div>
      )}

      {/* Promo strip — Quotr */}
      {product.promoCode && <PromoStrip code={product.promoCode} note={product.promoNote} />}
    </motion.div>
  );
}

function CheckoutSuccess() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="mx-auto mb-10 flex max-w-[640px] items-start gap-3 rounded-[3px] px-5 py-4"
      style={{ border: '1px solid var(--c4-brand-success, #22c55e)', backgroundColor: 'var(--c4-bg-alt)' }}
    >
      <CheckCircle size={16} strokeWidth={2} className="mt-[1px] shrink-0" style={{ color: 'var(--c4-brand-success, #22c55e)' }} />
      <div>
        <p className="text-[13px] font-semibold" style={{ color: 'var(--c4-text)' }}>
          You&apos;re in — welcome aboard.
        </p>
        <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c4-text-muted)' }}>
          Check your email for access details. Caleb will be in touch shortly.
        </p>
      </div>
    </motion.div>
  );
}

export default function Software() {
  const [searchParams] = useSearchParams();
  const checkoutComplete = searchParams.get('checkout') === 'complete';

  const [modalProduct, setModalProduct] = useState(null);
  const [checkout, setCheckout] = useState({ open: false, priceId: null, title: null });

  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, []);

  const openCheckout = (priceId, title) => setCheckout({ open: true, priceId, title });
  const closeCheckout = () => setCheckout((s) => ({ ...s, open: false }));

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
            <a
              href={SUITE_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 mt-5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
              style={{ color: 'var(--c4-text-subtle)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c4-text)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--c4-text-subtle)'; }}
            >
              Already a customer? Open the app
              <ArrowUpRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>

            <nav aria-label="Jump to product" className="mt-8 flex flex-wrap gap-2">
              {PRODUCTS.map((p) => (
                <a
                  key={p.slug}
                  href={`#${p.slug}`}
                  className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] uppercase tracking-[0.12em] font-semibold transition-colors duration-200"
                  style={{ borderColor: 'var(--c4-border)', color: 'var(--c4-text-subtle)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--c4-accent)'; e.currentTarget.style.color = 'var(--c4-text)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--c4-border)'; e.currentTarget.style.color = 'var(--c4-text-subtle)'; }}
                >
                  <span
                    aria-hidden="true"
                    className="size-[6px] rounded-full"
                    style={{ backgroundColor: statusColor(p.status) }}
                  />
                  {p.name}
                </a>
              ))}
            </nav>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          {checkoutComplete && <CheckoutSuccess />}

          {PRODUCTS.map((product) => (
            <ProductBlock
              key={product.slug}
              product={product}
              onCheckout={openCheckout}
              onWaitlist={setModalProduct}
            />
          ))}
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

      <StripeCheckoutModal
        isOpen={checkout.open}
        onClose={closeCheckout}
        priceId={checkout.priceId}
        title={checkout.title}
      />
    </div>
  );
}
