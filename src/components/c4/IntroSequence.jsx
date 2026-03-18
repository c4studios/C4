import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import C4Logo from './C4Logo';

const ease = [0.22, 1, 0.36, 1];

export default function IntroSequence({ onComplete }) {
  const [phase, setPhase] = useState('mark');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('name'), 900);
    const t2 = setTimeout(() => setPhase('exit'), 2200);
    const t3 = setTimeout(() => {
      localStorage.setItem('c4_intro_seen', 'true');
      onComplete();
    }, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'var(--c4-bg)' }}
      animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="flex flex-col items-center">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease }}
        >
          <C4Logo size="large" context="header" />
        </motion.div>

        {/* Studio name */}
        <motion.span
          className="mt-3 text-[10px] uppercase tracking-[0.3em] font-medium"
          style={{ color: 'var(--c4-text-subtle)' }}
          initial={{ opacity: 0, y: 4 }}
          animate={phase === 'mark' ? { opacity: 0, y: 4 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          Studios
        </motion.span>
      </div>
    </motion.div>
  );
}