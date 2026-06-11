import React from 'react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

/**
 * Infinite proof marquee. Every item is a truthful signal — no
 * fabricated live counters. Pauses on hover; freezes (and wraps)
 * when the visitor prefers reduced motion.
 */
const ITEMS = [
  '50+ Perth businesses served',
  '6 software products shipped',
  'Founder-led — you brief the builder',
  'Full code ownership, always',
  'Reply within 1 business day',
  'Quotr · live & in production',
  'DS Racing Karts · brand films',
  'HVN · drone & full-show edit',
  'Transform Fremantle · website',
  'Est. 2022 · Perth, W.A.',
];

function Track({ ariaHidden }) {
  return (
    <ul
      className="c4-marquee-track flex shrink-0 items-center"
      aria-hidden={ariaHidden ? 'true' : undefined}
    >
      {ITEMS.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center whitespace-nowrap">
          <span
            className="text-[12px] md:text-[12.5px] font-medium tracking-[-0.005em]"
            style={{ color: 'var(--c4-text-muted)' }}
          >
            {item}
          </span>
          <span
            aria-hidden="true"
            className="mx-6 md:mx-8 h-1 w-1 rounded-full"
            style={{ backgroundColor: 'var(--c4-accent)' }}
          />
        </li>
      ))}
    </ul>
  );
}

export default function SocialProof() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      aria-label="What clients can rely on"
      className="relative overflow-hidden border-y py-4 md:py-5"
      style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}
    >
      <style>{`
        @keyframes c4-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .c4-marquee {
          display: flex;
          width: max-content;
          animation: c4-marquee 38s linear infinite;
        }
        .c4-marquee:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .c4-marquee { animation: none; }
        }
      `}</style>

      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 md:w-24" style={{ background: 'linear-gradient(to right, var(--c4-bg-alt), transparent)' }} />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 md:w-24" style={{ background: 'linear-gradient(to left, var(--c4-bg-alt), transparent)' }} />

      {reduced ? (
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-2 gap-y-2 px-6 md:px-12">
          <Track />
        </div>
      ) : (
        <div className="c4-marquee">
          <Track />
          <Track ariaHidden />
        </div>
      )}
    </section>
  );
}
