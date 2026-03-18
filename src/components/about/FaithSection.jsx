import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function FaithSection() {
  const [verseRevealed, setVerseRevealed] = useState(false);

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-[660px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            {/* Motif heading */}
            <h3 className="text-[1.3rem] md:text-[1.5rem] font-semibold tracking-[-0.025em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
              See Four.
            </h3>
            <p className="mt-2 text-[12.5px] leading-[1.6] mb-6" style={{ color: 'var(--c4-text-subtle)' }}>
              The story behind the name.
            </p>

            {/* Body — warm, clear, respectful */}
            <div className="space-y-4">
              <p className="text-[14px] md:text-[15px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                {"C4 — \"See Four\" — comes from Daniel 3. Three men were thrown into a furnace and a fourth appeared with them — a picture of God’s presence with His people under pressure (Daniel 3:25)."}
              </p>
              <p className="text-[14px] md:text-[15px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                {"I follow Yahweh. That conviction quietly shapes my integrity, the standards I hold to, and the way I treat clients — with honesty, patience and respect, whatever their beliefs."}
              </p>
              <p className="text-[14px] md:text-[15px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                {"This is personal, not prescriptive. It informs the work without asking anything of visitors or clients."}
              </p>
            </div>

            {/* Verse reveal */}
            <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--c4-border)' }}>
              <button
                onClick={() => setVerseRevealed(!verseRevealed)}
                aria-expanded={verseRevealed}
                aria-controls="see-four-verse"
                className="group flex items-center gap-2 outline-none rounded-sm hover:underline underline-offset-4"
                style={{ textDecorationColor: 'var(--c4-border)' }}
              >
                <motion.span
                  animate={{ rotate: verseRevealed ? 45 : 0 }}
                  transition={{ duration: 0.25, ease }}
                  style={{ color: 'var(--c4-text-faint)' }}
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="6" y1="1.5" x2="6" y2="10.5" />
                    <line x1="1.5" y1="6" x2="10.5" y2="6" />
                  </svg>
                </motion.span>
                <span className="text-[12px] font-medium transition-colors duration-300" style={{ color: 'var(--c4-text-muted)' }}>
                  Read the verse
                </span>
              </button>

              <AnimatePresence>
                {verseRevealed && (
                  <motion.div
                    id="see-four-verse"
                    role="region"
                    aria-label="Daniel 3:25 verse"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 pb-1 max-w-[540px]">
                      <blockquote className="text-[13.5px] leading-[1.75] italic border-l-2 pl-4" style={{ color: 'var(--c4-text-muted)', borderColor: 'color-mix(in srgb, var(--c4-accent) 30%, transparent)' }}>
                        {"\"He answered and said, Lo, I see four men loose, walking in the midst of the fire, and they have no hurt; and the form of the fourth is like the Son of God.\""}
                      </blockquote>
                      <p className="mt-1.5 text-[11px] tracking-[0.02em]" style={{ color: 'var(--c4-text-faint)' }}>
                        — Daniel 3:25, KJV
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}