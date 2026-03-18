import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function ProcessCard({ step, index, total, isActive }) {
  return (
    <div
      className="rounded-[3px] relative overflow-hidden h-full transition-shadow duration-300"
      style={{
        backgroundColor: 'var(--c4-card-bg)',
        border: `1px solid ${isActive ? 'var(--c4-text-faint)' : 'var(--c4-border)'}`,
        boxShadow: isActive
          ? '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'
          : '0 1px 4px rgba(0,0,0,0.03)',
      }}
    >
      <div className="absolute inset-y-0 right-0 w-[42%] pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute right-[-4%] top-1/2 -translate-y-1/2 text-[10.5rem] md:text-[13rem] font-semibold tabular-nums tracking-[-0.09em] leading-none"
          style={{
            color: isActive ? 'color-mix(in srgb, var(--c4-accent) 15%, transparent)' : 'color-mix(in srgb, var(--c4-text) 5%, transparent)',
            transform: 'translateY(-50%) rotate(-7deg)',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
        <div
          className="absolute right-[8%] top-1/2 -translate-y-1/2 text-[9rem] md:text-[11.5rem] font-semibold tabular-nums tracking-[-0.09em] leading-none"
          style={{
            color: 'color-mix(in srgb, var(--c4-text) 4%, transparent)',
            transform: 'translateY(-50%) rotate(8deg)',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Top bar */}
      <div className="px-7 md:px-8 pt-6 pb-0 flex items-center justify-between border-b" style={{ borderColor: 'var(--c4-border-light)' }}>
        <div className="flex items-center gap-3 pb-5">
          <span className="text-[10px] font-semibold tabular-nums tracking-[0.12em] uppercase" style={{ color: 'var(--c4-accent)' }}>
            Stage {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-2.5 pb-5">
          <span className="text-[10px] font-medium tracking-[0.02em]" style={{ color: 'var(--c4-text-faint)' }}>{step.duration}</span>
          <span className="text-[10px]" style={{ color: 'var(--c4-border)' }}>·</span>
          <span className="text-[10px] font-medium tabular-nums" style={{ color: 'var(--c4-border)' }}>
            {index + 1} / {total}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-[1] px-7 md:px-8 py-6">
        <h4 className="text-[1.2rem] md:text-[1.35rem] font-semibold tracking-[-0.025em] leading-[1.15]" style={{ color: 'var(--c4-text)' }}>
          {step.label}
        </h4>
        <p className="mt-3 text-[13.5px] leading-[1.7] max-w-[440px]" style={{ color: 'var(--c4-text-muted)' }}>
          {step.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {step.deliverables.map((d) => (
            <span
              key={d}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-[2px] tracking-[0.01em]"
              style={{ backgroundColor: 'var(--c4-tag-bg)', color: 'var(--c4-text-muted)' }}
            >
              <div className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }} />
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-[1] px-7 md:px-8 pb-5">
        <div className="h-[2px] rounded-full overflow-hidden" style={{ backgroundColor: 'var(--c4-border-light)' }}>
          <motion.div
            className="h-full rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }}
            initial={false}
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.6, ease }}
          />
        </div>
        <p className="mt-2 text-[9px] tracking-[0.05em] text-right" style={{ color: 'var(--c4-text-faint)' }}>
          Varies by scope
        </p>
      </div>
    </div>
  );
}