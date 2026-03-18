import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];
const STORAGE_KEY = 'c4_checklist_complete';

const requirements = [
  {
    label: 'You value quality over speed',
    detail: 'Good work takes time. We prioritise craft and won\'t cut corners to hit an artificial deadline.',
  },
  {
    label: 'You\'re ready to collaborate',
    detail: 'We work closely with our clients. Timely feedback and open communication are essential.',
  },
  {
    label: 'You have a clear goal',
    detail: 'You don\'t need all the answers — but you need to know what success looks like.',
  },
  {
    label: 'You respect the process',
    detail: 'Discovery, strategy, design, build. We follow a proven path and ask that you trust it.',
  },
];

function CheckItem({ item, index, isChecked, onToggle }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      onClick={onToggle}
      className="group w-full text-left"
    >
      <div className="flex items-start gap-4 p-4 md:p-5 border rounded-sm transition-all duration-300"
        style={isChecked
          ? { backgroundColor: 'var(--c4-card-bg)', borderColor: 'var(--c4-text)' }
          : { backgroundColor: 'color-mix(in srgb, var(--c4-card-bg) 40%, transparent)', borderColor: 'var(--c4-border-light)' }
        }
      >
        <div className="mt-0.5 w-5 h-5 rounded-sm border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-300"
          style={isChecked
            ? { backgroundColor: 'var(--c4-text)', borderColor: 'var(--c4-text)' }
            : { borderColor: 'var(--c4-border)' }
          }
        >
          <motion.div
            initial={false}
            animate={{ scale: isChecked ? 1 : 0, opacity: isChecked ? 1 : 0 }}
            transition={{ duration: 0.2, ease }}
          >
            <Check size={12} strokeWidth={3} style={{ color: 'var(--c4-bg)' }} />
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium transition-colors duration-300"
            style={{ color: isChecked ? 'var(--c4-text)' : 'var(--c4-text-muted)' }}
          >
            {item.label}
          </div>
          <AnimatePresence>
            {isChecked && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                className="text-[12.5px] leading-[1.55] mt-1.5 overflow-hidden"
                style={{ color: 'var(--c4-text-muted)' }}
              >
                {item.detail}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <span className="text-[10px] tabular-nums font-medium tracking-[0.15em] transition-colors duration-300 mt-0.5"
          style={{ color: isChecked ? 'var(--c4-accent)' : 'var(--c4-border)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </motion.button>
  );
}

export default function ClientChecklist({ onUnlock, checklistRef }) {
  // Check sessionStorage on mount
  const alreadyComplete = typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === 'true';
  const [checked, setChecked] = useState(
    alreadyComplete ? [true, true, true, true] : [false, false, false, false]
  );
  const allChecked = checked.every(Boolean);
  const checkedCount = checked.filter(Boolean).length;

  useEffect(() => {
    onUnlock(allChecked);
    if (allChecked) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  }, [allChecked, onUnlock]);

  const toggle = (i) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  // If already completed from session, show a compact confirmed state
  if (alreadyComplete) {
    return (
      <section ref={checklistRef} className="py-10 md:py-14" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--c4-text)' }}>
              <Check size={12} strokeWidth={3} style={{ color: 'var(--c4-bg)' }} />
            </div>
            <span className="text-[14px] font-medium" style={{ color: 'var(--c4-text)' }}>Values confirmed</span>
            <span className="text-[12px]" style={{ color: 'var(--c4-text-subtle)' }}>— you're ready to start a project.</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={checklistRef} className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <h2 className="text-[1.3rem] md:text-[1.6rem] font-semibold tracking-[-0.025em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            Before We Begin
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] max-w-[440px]" style={{ color: 'var(--c4-text-muted)' }}>
            We work best with clients who share these values. Confirm each to continue.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[900px]">
          {requirements.map((r, i) => (
            <CheckItem
              key={r.label}
              item={r}
              index={i}
              isChecked={checked[i]}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        <motion.div
          className="mt-8 flex items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="w-32 h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: 'var(--c4-border-light)' }}>
            <motion.div
              className="h-full rounded-full"
              animate={{
                width: `${(checkedCount / requirements.length) * 100}%`,
                backgroundColor: allChecked ? 'var(--c4-text)' : 'var(--c4-text-faint)',
              }}
              transition={{ duration: 0.4, ease }}
            />
          </div>
          <span className="text-[11px] font-medium tracking-[0.05em] transition-colors duration-300"
            style={{ color: allChecked ? 'var(--c4-text)' : 'var(--c4-text-faint)' }}
          >
            {allChecked ? 'Ready to go' : `${checkedCount} of ${requirements.length}`}
          </span>
        </motion.div>
      </div>
    </section>
  );
}