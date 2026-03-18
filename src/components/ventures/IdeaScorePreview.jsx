import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const dimensions = [
  { key: 'clarity', label: 'Clarity', description: 'Problem & solution defined' },
  { key: 'feasibility', label: 'Feasibility', description: 'Realistic MVP scope' },
  { key: 'differentiation', label: 'Differentiation', description: 'Distinct from existing solutions' },
  { key: 'audience', label: 'Audience', description: 'Target user identified' },
];

function ScoreBar({ label, description, score }) {
  const width = `${Math.max(score, 4)}%`;
  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[12px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>{label}</span>
        <span className="text-[10px] font-medium" style={{ color: 'var(--c4-text-faint)' }}>{description}</span>
      </div>
      <div className="h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: 'var(--c4-border)' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: '4%' }}
          animate={{ width, backgroundColor: score > 60 ? 'var(--c4-accent)' : score > 30 ? 'var(--c4-text-muted)' : 'var(--c4-border)' }}
          transition={{ duration: 0.6, ease }}
        />
      </div>
    </div>
  );
}

export default function IdeaScorePreview({ scores = {} }) {
  const total = dimensions.reduce((sum, d) => sum + (scores[d.key] || 0), 0);
  const avg = dimensions.length > 0 ? Math.round(total / dimensions.length) : 0;

  return (
    <div className="backdrop-blur-sm rounded-[3px] p-5 md:p-6" style={{ backgroundColor: 'color-mix(in srgb, var(--c4-card-bg) 60%, transparent)', border: '1px solid var(--c4-border)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: 'var(--c4-text-subtle)' }}>
            Submission Strength
          </span>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--c4-text-faint)' }}>Preview only — not a final score</p>
        </div>
        <div className="text-right">
          <motion.span
            key={avg}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[1.3rem] font-semibold tabular-nums tracking-[-0.02em]"
            style={{ color: 'var(--c4-text)' }}
          >
            {avg}
          </motion.span>
          <span className="text-[11px] font-medium" style={{ color: 'var(--c4-text-faint)' }}>/100</span>
        </div>
      </div>

      {dimensions.map((d) => (
        <ScoreBar
          key={d.key}
          label={d.label}
          description={d.description}
          score={scores[d.key] || 0}
        />
      ))}
    </div>
  );
}