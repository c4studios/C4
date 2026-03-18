import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const SORT_OPTIONS = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'budget_high', label: 'Budget: High → Low' },
  { key: 'budget_low', label: 'Budget: Low → High' },
  { key: 'name_az', label: 'Name: A → Z' },
];

export default function PortfolioSortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.key === value) || SORT_OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-[6px] rounded-full transition-colors duration-300"
        style={{ border: '1px solid var(--c4-border-light)', backgroundColor: 'var(--c4-card-bg)' }}
      >
        <span className="text-[10.5px] uppercase tracking-[0.12em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
          Sort
        </span>
        <span className="text-[10.5px] uppercase tracking-[0.12em] font-medium" style={{ color: 'var(--c4-text)' }}>
          {current.label}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease }}
        >
          <ChevronDown size={12} strokeWidth={2} style={{ color: 'var(--c4-text-subtle)' }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.35, ease }}
            className="absolute right-0 top-full mt-2 z-30 overflow-hidden"
          >
            <div className="rounded-[4px] min-w-[200px]" style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border-light)', boxShadow: '0 4px 16px color-mix(in srgb, var(--c4-text) 8%, transparent)' }}>
              {SORT_OPTIONS.map((opt, i) => (
                <motion.button
                  key={opt.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.035, ease }}
                  onClick={() => { onChange(opt.key); setOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-[12px] tracking-[0.01em] transition-colors duration-200 flex items-center justify-between"
                  style={{
                    color: value === opt.key ? 'var(--c4-text)' : 'var(--c4-text-muted)',
                    fontWeight: value === opt.key ? 500 : 400,
                    backgroundColor: value === opt.key ? 'var(--c4-bg-alt)' : 'transparent',
                  }}
                >
                  {opt.label}
                  {value === opt.key && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }} />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}