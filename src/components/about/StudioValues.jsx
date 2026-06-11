import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Layers, MessageSquare, ShieldCheck } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const values = [
  {
    icon: Compass,
    title: 'Engineering, not decoration',
    short: 'We build things that work, then make them beautiful.',
    detail: 'Every site and system is built on real engineering — clean code, sensible architecture, and performance you can measure. Polish comes after the foundation is right, never instead of it.',
  },
  {
    icon: MessageSquare,
    title: 'Direct, always',
    short: 'You talk to the person doing the work.',
    detail: 'No account managers, no handoff, no telephone game. From the first call to the final deploy, you work directly with the founder building your project.',
  },
  {
    icon: Layers,
    title: 'Systems over band-aids',
    short: 'Fix the process, not just the symptom.',
    detail: 'A website is 30% of the job. We look at the whole operation — where time leaks, what repeats, what could run itself — and build systems that compound instead of patches that rot.',
  },
  {
    icon: ShieldCheck,
    title: 'Owned, not rented',
    short: 'You keep the keys to everything we build.',
    detail: 'Full code handover, your own accounts, your own data. We build things you own outright — no lock-in, no hostage situations, no surprise monthly fees for access to your own work.',
  },
];

function ValueCard({ value, index }) {
  const [hovered, setHovered] = useState(false);
  const Icon = value.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col p-7 md:p-8 rounded-[3px] cursor-default transition-[transform,box-shadow,border-color] duration-400"
      style={{
        backgroundColor: 'var(--c4-bg)',
        border: '1px solid var(--c4-border)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 60px -28px rgba(0,0,0,0.45)' : 'none',
        borderColor: hovered ? 'color-mix(in srgb, var(--c4-accent) 40%, var(--c4-border))' : 'var(--c4-border)',
      }}
    >
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center mb-6 transition-transform duration-400"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--c4-accent) 12%, transparent)',
          transform: hovered ? 'rotate(-6deg) scale(1.06)' : 'none',
        }}
      >
        <Icon size={20} strokeWidth={1.5} style={{ color: 'var(--c4-accent)' }} />
      </div>

      <h4 className="text-[1.1rem] font-semibold tracking-[-0.02em] mb-2" style={{ color: 'var(--c4-text)' }}>
        {value.title}
      </h4>
      <p className="text-[13.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
        {value.short}
      </p>

      {/* Detail reveals on hover */}
      <AnimatePresence initial={false}>
        {hovered && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease }}
            className="text-[12.5px] leading-[1.7] overflow-hidden"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            {value.detail}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Accent corner cue */}
      <motion.span
        className="absolute top-5 right-5 text-[10px] tabular-nums font-medium"
        animate={{ opacity: hovered ? 1 : 0.3 }}
        style={{ color: 'var(--c4-accent)' }}
      >
        0{index + 1}
      </motion.span>
    </motion.div>
  );
}

export default function StudioValues() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-10 md:mb-14"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] font-medium mb-3" style={{ color: 'var(--c4-text-subtle)' }}>
            What we stand on
          </p>
          <h3 className="text-[1.4rem] md:text-[1.9rem] font-semibold tracking-[-0.025em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            Four principles, every project.
          </h3>
          <p className="mt-3 text-[13.5px] leading-[1.65] max-w-[480px]" style={{ color: 'var(--c4-text-muted)' }}>
            Hover any principle to see what it means in practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {values.map((v, i) => (
            <ValueCard key={v.title} value={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
