import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ServicePageHero from '../components/pricing/ServicePageHero';
import PricingCard from '../components/pricing/PricingCard';
import PricingCTA from '../components/pricing/PricingCTA';
import { brandingPackages, CTA_ROUTE } from '../data/pricing';

export default function BrandingPricing() {
  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <ServicePageHero
        label="Branding & Identity"
        titleLines={[
          'A brand that means',
          'something.',
        ]}
        description="From a standalone logo to a complete identity system. Built to scale."
      />

      <section className="pb-14 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {brandingPackages.map((pkg, i) => (
              <PricingCard
                key={pkg.key}
                name={pkg.name}
                priceLabel={pkg.priceLabel}
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
                  Get Started
                  <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                </Link>
              </PricingCard>
            ))}
          </div>
        </div>
      </section>

      <PricingCTA />
    </div>
  );
}
