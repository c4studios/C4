import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ServicePageHero from '../components/pricing/ServicePageHero';
import PricingCard from '../components/pricing/PricingCard';
import PackageToggle from '../components/pricing/PackageToggle';
import SubscriptionExplainer from '../components/pricing/SubscriptionExplainer';
import AddOnGrid from '../components/pricing/AddOnGrid';
import IndustrySurchargeNote from '../components/pricing/IndustrySurchargeNote';
import PricingCTA from '../components/pricing/PricingCTA';
import { webDesignPackages, webDesignAddOns, CTA_ROUTE } from '../data/pricing';

const ease = [0.22, 1, 0.36, 1];

export default function WebDesignPricing() {
  const [track, setTrack] = useState('outright');

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <ServicePageHero
        label="Web Design & Development"
        titleLines={[
          'Websites that work',
          'as hard as you do.',
        ]}
        description="Custom-coded, high-performance websites. Choose a package or subscribe monthly."
      />

      {/* Toggle + Packages */}
      <section className="pb-14 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="mb-10">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {webDesignPackages.map((pkg, i) => (
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

              {track === 'subscription' && <SubscriptionExplainer />}
            </motion.div>
          </AnimatePresence>

          <IndustrySurchargeNote />
        </div>
      </section>

      <AddOnGrid addOns={webDesignAddOns} />
      <PricingCTA />
    </div>
  );
}
