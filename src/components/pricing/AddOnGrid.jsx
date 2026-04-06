import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function AddOnGrid({ addOns, title = 'Add-Ons' }) {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mb-8 md:mb-10"
        >
          <h2
            className="text-[1.3rem] md:text-[1.6rem] font-semibold tracking-[-0.025em] leading-[1.1]"
            style={{ color: 'var(--c4-text)' }}
          >
            {title}
          </h2>
          <p className="mt-3 text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
            Enhance your project with any of the following.
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-sm border overflow-hidden"
          style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-border)' }}
        >
          {addOns.map((addon, i) => (
            <motion.div
              key={addon.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.02, ease }}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200"
              style={{ backgroundColor: 'var(--c4-card-bg)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--c4-bg-alt)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--c4-card-bg)'; }}
            >
              <span className="text-[13px] leading-[1.4]" style={{ color: 'var(--c4-text-muted)' }}>
                {addon.name}
              </span>
              <span className="text-[13px] font-semibold tabular-nums shrink-0" style={{ color: 'var(--c4-text)' }}>
                ${addon.price.toLocaleString()}{addon.suffix || ''}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
