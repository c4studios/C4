import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ServicePageHero from '../components/pricing/ServicePageHero';
import BundleCard from '../components/pricing/BundleCard';
import PricingCTA from '../components/pricing/PricingCTA';
import { bundlePackages, CTA_ROUTE } from '../data/pricing';

export default function BundlesPricing() {
  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <ServicePageHero
        label="Bundles"
        titleLines={[
          'Everything together.',
          'Better price.',
        ]}
        description="Combine web, branding, SEO, and content into one streamlined package."
      />

      <section className="pb-14 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {bundlePackages.map((bundle, i) => (
              <BundleCard
                key={bundle.key}
                name={bundle.name}
                priceLabel={bundle.priceLabel}
                savings={bundle.savings}
                description={bundle.description}
                includes={bundle.includes}
                popular={bundle.popular}
                index={i}
              />
            ))}
          </div>

          {/* CTA per bundle */}
          <div className="mt-8 flex justify-center">
            <Link
              to={CTA_ROUTE}
              className="group inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              Book a Discovery Call
              <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </section>

      <PricingCTA />
    </div>
  );
}
