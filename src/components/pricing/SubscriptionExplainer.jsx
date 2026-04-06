import React from 'react';
import { motion } from 'framer-motion';
import { subscriptionInfo } from '@/data/pricing';

const ease = [0.22, 1, 0.36, 1];

const items = [
  { label: 'How it works', content: subscriptionInfo.howItWorks },
  { label: "What's included", content: subscriptionInfo.whatsIncluded },
  { label: 'Ownership', content: subscriptionInfo.ownership },
  { label: 'Cancel anytime', content: subscriptionInfo.cancellation },
];

export default function SubscriptionExplainer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      className="mt-14 rounded-sm border p-6 md:p-8"
      style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
    >
      <h3
        className="text-[1.1rem] md:text-[1.25rem] font-semibold tracking-[-0.02em] mb-6"
        style={{ color: 'var(--c4-text)' }}
      >
        How the subscription model works
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <div key={item.label}>
            <div
              className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              {item.label}
            </div>
            <p className="text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
