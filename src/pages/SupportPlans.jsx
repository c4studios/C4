import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ServicePageHero from '../components/pricing/ServicePageHero';
import PricingCard from '../components/pricing/PricingCard';
import PricingCTA from '../components/pricing/PricingCTA';
import { supportPlans, supportTickets, boosterPacks, CTA_ROUTE } from '../data/pricing';

const ease = [0.22, 1, 0.36, 1];

function TicketTable() {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mb-8"
        >
          <h2
            className="text-[1.3rem] md:text-[1.6rem] font-semibold tracking-[-0.025em] leading-[1.1]"
            style={{ color: 'var(--c4-text)' }}
          >
            One-off support tickets
          </h2>
          <p className="mt-3 text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
            No ongoing plan? No problem. Pay per request.
          </p>
        </motion.div>

        <div
          className="rounded-sm border overflow-hidden"
          style={{ borderColor: 'var(--c4-border)' }}
        >
          {supportTickets.map((ticket, i) => (
            <motion.div
              key={ticket.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03, ease }}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200"
              style={{
                backgroundColor: i % 2 === 0 ? 'var(--c4-card-bg)' : 'var(--c4-bg-alt)',
              }}
            >
              <span className="text-[13px] leading-[1.4]" style={{ color: 'var(--c4-text-muted)' }}>
                {ticket.name}
              </span>
              <span className="text-[13px] font-semibold tabular-nums shrink-0" style={{ color: 'var(--c4-text)' }}>
                ${ticket.price}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BoosterPacks() {
  return (
    <section className="pb-14 md:pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="h-px mb-14" style={{ backgroundColor: 'var(--c4-border)' }} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mb-8"
        >
          <h2
            className="text-[1.3rem] md:text-[1.6rem] font-semibold tracking-[-0.025em] leading-[1.1]"
            style={{ color: 'var(--c4-text)' }}
          >
            Booster packs
          </h2>
          <p className="mt-3 text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
            For subscription clients who need additional work beyond their monthly plan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {boosterPacks.map((pack, i) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05, ease }}
              className="rounded-sm border p-5 transition-all duration-300"
              style={{ backgroundColor: 'var(--c4-card-bg)', borderColor: 'var(--c4-border)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--c4-text-faint)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--c4-border)'; }}
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3 className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                  {pack.name}
                </h3>
                <span className="text-[14px] font-semibold tabular-nums shrink-0" style={{ color: 'var(--c4-text)' }}>
                  ${pack.price}{pack.suffix || ''}
                </span>
              </div>
              <p className="text-[12px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>
                {pack.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatsCovered() {
  return (
    <section className="pb-14 md:pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="h-px mb-14" style={{ backgroundColor: 'var(--c4-border)' }} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--c4-text-subtle)' }}>
              3-month complimentary support includes
            </div>
            <ul className="space-y-2">
              {[
                'Bug fixes related to original build',
                'Minor text/image updates (up to 2 requests)',
                'Hosting/domain/DNS troubleshooting',
                'Email support (48-hour response)',
                '1 brief phone/video call if needed',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] leading-[1.5]" style={{ color: 'var(--c4-text-muted)' }}>
                  <div className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--c4-accent)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--c4-text-subtle)' }}>
              Not covered in complimentary support
            </div>
            <ul className="space-y-2">
              {[
                'New features or pages',
                'Design overhauls',
                'SEO work',
                'Third-party tool issues not part of original build',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] leading-[1.5]" style={{ color: 'var(--c4-text-muted)' }}>
                  <div className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--c4-border)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function SupportPlans() {
  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <ServicePageHero
        label="Support & Maintenance"
        titleLines={[
          'We don\u2019t disappear',
          'after launch.',
        ]}
        description="Ongoing support plans, one-off tickets, and booster packs for subscription clients."
      />

      {/* Ongoing Plans */}
      <section className="pb-14 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mb-8"
          >
            <h2
              className="text-[1.3rem] md:text-[1.6rem] font-semibold tracking-[-0.025em] leading-[1.1]"
              style={{ color: 'var(--c4-text)' }}
            >
              Ongoing support plans
            </h2>
            <p className="mt-3 text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
              For clients who need continued maintenance after the 3-month complimentary window.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {supportPlans.map((plan, i) => (
              <PricingCard
                key={plan.key}
                name={plan.name}
                priceLabel={plan.priceLabel}
                description={plan.description}
                features={plan.features}
                popular={plan.popular}
                index={i}
              >
                <Link
                  to={CTA_ROUTE}
                  className="group inline-flex items-center justify-center gap-2 w-full py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium rounded-sm transition-colors duration-300"
                  style={{
                    backgroundColor: plan.popular ? 'var(--c4-bg)' : 'var(--c4-text)',
                    color: plan.popular ? 'var(--c4-text)' : 'var(--c4-bg)',
                  }}
                >
                  Get Started
                  <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                </Link>
              </PricingCard>
            ))}
          </div>
        </div>
      </section>

      <WhatsCovered />
      <TicketTable />
      <BoosterPacks />
      <PricingCTA />
    </div>
  );
}
