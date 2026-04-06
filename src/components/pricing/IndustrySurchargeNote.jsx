import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { INDUSTRY_SURCHARGE_NOTE } from '@/data/pricing';

const ease = [0.22, 1, 0.36, 1];

export default function IndustrySurchargeNote() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      className="mt-10 rounded-sm border"
      style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[12px] font-medium" style={{ color: 'var(--c4-text-muted)' }}>
          Industry surcharges &mdash; do they apply to me?
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease }}
          className="shrink-0"
          style={{ color: 'var(--c4-text-faint)' }}
        >
          <ChevronDown size={16} strokeWidth={1.5} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="h-px mb-4" style={{ backgroundColor: 'var(--c4-border-light)' }} />
              <p className="text-[12px] leading-[1.7]" style={{ color: 'var(--c4-text-subtle)' }}>
                {INDUSTRY_SURCHARGE_NOTE}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
