import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import TypedHeading from '../c4/TypedHeading';
import CraftHeatmap from './CraftHeatmap';
import { trackEvent } from '@/lib/track';
import useStaticMode from '@/hooks/useStaticMode';

const START_PROJECT_PATH = '/start';

const ease = [0.22, 1, 0.36, 1];

const TYPE_SPEED = 72;
const HOLD_TIME = 20000;
const PAUSE_TIME = 700;
const DELETE_SPEED = 32;

/* PHRASES[0] is the indexed <h1>. TypedHeading resolves static mode
   synchronously, so whatever sits first here is what the prerenderer writes
   into the priority-1.0 page and what a crawler reads. It has to describe the
   business, not greet the visitor.

   'Your team spends 14h a week being a database.' was removed on 2 Sep: the
   14h figure has no traceable source, and an unsourced number on the homepage
   breaches the studio's own rule. Restore it only with a citation. */
const PHRASES = [
  'Websites and AI systems, built in Perth.',
  'Your website is 30% of the job.',
  'Loud websites. Quiet systems.',
  'Engineering, not decoration.',
  'Stop renting your operations.',
];

/* ─────────────────────────────────────────────────────────────
   Hero

   One column of copy over the craft backdrop. The Quotr launcher that
   used to fill the right column, and the phone-only "instant quote"
   button under the CTAs, went with the software section on
   9 September 2026 (site-wide clearance of the product line).
   ───────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const staticMode = useStaticMode();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const ruleWidth = useTransform(scrollYProgress, [0, 0.3], ['100%', '40%']);

  return (
    <section ref={ref} className="relative flex h-[100svh] flex-col overflow-hidden" style={{ isolation: 'isolate' }}>
      <div className="absolute inset-0 z-0" style={{ position: 'absolute' }}>
        <CraftHeatmap />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-1 items-center py-24 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
          <div className="max-w-[860px]">
            <div className="max-w-[760px]">
              <h1
                className="max-w-[14ch] text-[clamp(2.65rem,6vw,5.4rem)] font-semibold tracking-[-0.06em] leading-[0.96]"
                style={{ color: 'var(--c4-text)', fontFamily: 'var(--hm-disp)', fontStretch: '97%', textWrap: 'stable' }}
              >
                <TypedHeading
                  lines={PHRASES}
                  className="block w-full"
                  cursorClassName="font-semibold"
                  typeSpeed={TYPE_SPEED}
                  deleteSpeed={DELETE_SPEED}
                  holdTime={HOLD_TIME}
                  pauseTime={PAUSE_TIME}
                  startDelay={500}
                />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.02, ease }}
                className="mt-7 max-w-[37rem] text-[15px] leading-[1.82] md:mt-9 md:text-[16px]"
                style={{ color: 'var(--c4-text-muted)', textWrap: 'pretty' }}
              >
                We design and build with clear direction, refined execution,
                and quality that holds up after launch.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 1.18 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-12"
            >
              <Link
                to={START_PROJECT_PATH}
                onClick={() => trackEvent('hero_cta_click', { target: 'start' })}
                className="c4-cta-primary group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] rounded-full"
                style={{ backgroundColor: 'var(--c4-accent)', color: '#fff' }}
              >
                Start a project
                <ArrowRight size={13} strokeWidth={2} className="opacity-80 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
              <Link
                to={createPageUrl('Portfolio')}
                onClick={() => trackEvent('hero_cta_click', { target: 'portfolio' })}
                className="c4-cta-ghost group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] rounded-full"
                style={{
                  color: 'var(--c4-text)',
                  border: '1px solid var(--c4-text)',
                  backgroundColor: 'transparent',
                }}
              >
                View recent work
                <ArrowRight size={13} strokeWidth={2} className="opacity-60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </motion.div>

            {/* The thesis line: the ONLY place the first fold names all four
                trades (hero audit: no arm vocabulary was visible before
                scrolling). Quiet on purpose — the doors below do the selling. */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 1.42 }}
              className="mt-6 text-[13px] leading-relaxed md:mt-7"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              Websites and apps, private AI, photography, and hands-on AI training.
              Perth-built, all four doors below.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-7 md:px-12 md:pb-9">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.42 }}
        >
          <div className="mb-8 flex justify-center md:mb-9">
            <button
              onClick={() => {
                if (ref?.current?.nextElementSibling) {
                  ref.current.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
                }
              }}
              aria-label="Scroll to continue"
              className="c4-next-section-invite group"
              style={{ background: 'transparent', border: 'none' }}
            >
              <span className="c4-next-section-label" style={{ color: 'var(--c4-text-subtle)' }}>
                Scroll
              </span>
              <motion.span
                className="c4-next-section-chevron"
                aria-hidden="true"
                animate={staticMode ? { y: 0 } : { y: [0, 4, 0] }}
                transition={staticMode ? { duration: 0 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--c4-text-subtle)' }}>
                  <path d="M1 1l6 6 6-6" />
                </svg>
              </motion.span>
            </button>
          </div>

          <motion.div style={{ width: ruleWidth, backgroundColor: 'var(--c4-border)' }} className="mx-auto mb-4 h-px transition-[width]" />
          <div className="mx-auto grid max-w-[720px] grid-cols-3 items-center text-center text-[10px] font-medium uppercase tracking-[0.22em]" style={{ color: 'var(--c4-text-subtle)' }}>
            <span>Perth, Australia</span>
            <span className="hidden sm:inline">Founder-led studio</span>
            <span className="sm:hidden" aria-hidden="true" />
            <span>Est. 2022</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
