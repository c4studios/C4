import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const stats = [
  { value: 3, suffix: ' yrs', label: 'Founder-led since 2022' },
  { value: 50, suffix: '+', label: 'Perth businesses served' },
  { value: 200, suffix: '+', label: 'Assets shipped' },
  { value: 6, suffix: '', label: 'Software products built' },
];

function CountUp({ to, suffix }) {
  const [n, setN] = useState(0);

  const run = () => {
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(eased * to));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <motion.span
      onViewportEnter={run}
      viewport={{ once: true, margin: '-60px' }}
      className="tabular-nums"
    >
      {n}{suffix}
    </motion.span>
  );
}

export default function StudioStats() {
  return (
    <section className="py-12 md:py-16 border-y" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
            >
              <p
                className="text-[clamp(1.9rem,4.5vw,3rem)] font-semibold tracking-[-0.04em] leading-[1]"
                style={{ color: 'var(--c4-text)' }}
              >
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[12px] leading-[1.5] uppercase tracking-[0.12em]" style={{ color: 'var(--c4-text-subtle)' }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
