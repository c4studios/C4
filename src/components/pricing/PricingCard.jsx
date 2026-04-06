import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

export default function PricingCard({ name, priceLabel, priceSuffix, description, features, popular, index = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
      className="relative group flex flex-col h-full rounded-sm border transition-all duration-300"
      style={{
        backgroundColor: popular ? 'var(--c4-text)' : 'var(--c4-card-bg)',
        borderColor: popular ? 'var(--c4-text)' : 'var(--c4-border)',
      }}
      onMouseEnter={(e) => {
        if (!popular) e.currentTarget.style.borderColor = 'var(--c4-text-faint)';
      }}
      onMouseLeave={(e) => {
        if (!popular) e.currentTarget.style.borderColor = 'var(--c4-border)';
      }}
    >
      {popular && (
        <div
          className="absolute -top-3 left-6 px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-semibold rounded-sm"
          style={{ backgroundColor: 'var(--c4-accent)', color: '#fff' }}
        >
          Most Popular
        </div>
      )}

      <div className="p-6 md:p-7 flex flex-col h-full">
        {/* Header */}
        <div className="mb-5">
          <h3
            className="text-[13px] uppercase tracking-[0.14em] font-semibold mb-3"
            style={{ color: popular ? 'color-mix(in srgb, var(--c4-bg) 60%, transparent)' : 'var(--c4-text-subtle)' }}
          >
            {name}
          </h3>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[1.8rem] md:text-[2rem] font-semibold tracking-[-0.03em] leading-none"
              style={{ color: popular ? 'var(--c4-bg)' : 'var(--c4-text)' }}
            >
              {priceLabel}
            </span>
            {priceSuffix && (
              <span
                className="text-[12px] font-medium"
                style={{ color: popular ? 'color-mix(in srgb, var(--c4-bg) 50%, transparent)' : 'var(--c4-text-faint)' }}
              >
                {priceSuffix}
              </span>
            )}
          </div>
          {description && (
            <p
              className="mt-3 text-[13px] leading-[1.55]"
              style={{ color: popular ? 'color-mix(in srgb, var(--c4-bg) 65%, transparent)' : 'var(--c4-text-muted)' }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Divider */}
        <div
          className="h-px mb-5"
          style={{ backgroundColor: popular ? 'color-mix(in srgb, var(--c4-bg) 15%, transparent)' : 'var(--c4-border-light)' }}
        />

        {/* Features */}
        <ul className="space-y-2.5 flex-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check
                size={14}
                strokeWidth={2}
                className="mt-[3px] shrink-0"
                style={{ color: popular ? 'var(--c4-bg)' : 'var(--c4-accent)' }}
              />
              <span
                className="text-[13px] leading-[1.5]"
                style={{ color: popular ? 'color-mix(in srgb, var(--c4-bg) 80%, transparent)' : 'var(--c4-text-muted)' }}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* Optional extra content (CTA, etc.) */}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </motion.div>
  );
}
