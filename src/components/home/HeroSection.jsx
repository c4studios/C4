import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import TypedHeading from '../c4/TypedHeading';
import CraftHeatmap from './CraftHeatmap';

const ease = [0.22, 1, 0.36, 1];

const guidanceItems = [
  { text: 'View selected work', to: '/Portfolio' },
  { text: 'What we build', to: '/Services' },
  { text: 'About the studio', to: '/About' },
  { text: 'Start a project brief', to: '/StartProject' },
  { text: 'The ventures program', to: '/Ventures' },
];

function GuidanceRail() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reducedMotion || paused) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % guidanceItems.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [reducedMotion, paused]);

  const current = guidanceItems[activeIndex];

  return (
    <div
      className="max-w-[340px] p-5 rounded-lg c4-support-rail"
      role="navigation"
      aria-label="Guided exploration"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-4 h-px" style={{ backgroundColor: 'var(--c4-accent)' }} />
        <span
          className="text-[10px] font-medium uppercase tracking-[0.2em]"
          style={{ color: 'var(--c4-text-faint)' }}
        >
          Explore
        </span>
      </div>

      <div className="mt-3 min-h-[96px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.button
            key={current.text}
            onClick={() => navigate(current.to)}
            className="group text-left cursor-pointer"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 6, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -4, filter: 'blur(1px)' }}
            transition={{ duration: reducedMotion ? 0.2 : 0.42, ease }}
          >
            <p
              className="text-[18px] font-medium tracking-[-0.02em] leading-[1.25] md:text-[20px] group-hover:opacity-80 transition-opacity duration-200"
              style={{ color: 'var(--c4-text)' }}
            >
              {current.text}
            </p>
            <span className="mt-2.5 inline-flex opacity-[0.2] group-hover:opacity-50 transition-opacity duration-300" style={{ color: 'var(--c4-text-subtle)' }}>
              <ArrowRight size={11} strokeWidth={1.5} />
            </span>
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="mt-3 flex gap-1.5">
        {guidanceItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to suggestion ${i + 1}`}
            className="h-[3.5px] rounded-full transition-all duration-500"
            style={{
              width: i === activeIndex ? 16 : 6,
              backgroundColor: i === activeIndex ? 'var(--c4-text-subtle)' : 'var(--c4-border)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const ruleWidth = useTransform(scrollYProgress, [0, 0.3], ['100%', '40%']);

  return (
    <section ref={ref} className="relative flex h-[100svh] flex-col overflow-hidden">
      <CraftHeatmap />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[42svh]"
        style={{ background: 'linear-gradient(180deg, var(--c4-bg) 0%, rgba(0, 0, 0, 0) 100%)', opacity: 0.34 }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-1 items-center py-24 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-end lg:gap-12">
            <div className="max-w-[860px]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.16, ease }}
                className="mb-5 md:mb-6"
                style={{ color: 'var(--c4-accent)' }}
              >
                <span className="block max-w-[20rem] font-mono text-[11px] font-medium uppercase tracking-[0.11em] md:text-[12px]">
                  C4 Studios
                </span>
              </motion.div>

              <div className="max-w-[760px]">
                <h1
                  className="max-w-[12.5ch] text-[clamp(2.85rem,6.5vw,5.7rem)] font-semibold tracking-[-0.06em] leading-[0.93]"
                  style={{ color: 'var(--c4-text)', textWrap: 'balance' }}
                >
                  <TypedHeading
                    lines={[
                      'Welcome to C4',
                      'Designed to be felt.',
                      'Where craft meets code.',
                      'Ready for something custom?',
                      'Outgrew the old site?',
                      'Craft, not convenience.',
                      'Not a template. Never will be.',
                      'Built to perform. Built to last.',
                      'Still looking? Take your time.',
                    ]}
                    className="block w-full"
                    cursorClassName="font-semibold"
                    typeSpeed={76}
                    deleteSpeed={34}
                    holdTime={3600}
                    pauseTime={800}
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
                className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7 md:mt-12"
              >
                <Link
                  to={createPageUrl('StartProject')}
                  className="group inline-flex items-center gap-2 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300"
                  style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                >
                  Start a project
                  <ArrowRight size={13} strokeWidth={2} className="opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
                <Link
                  to={createPageUrl('Portfolio')}
                  className="text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300"
                  style={{ color: 'var(--c4-text-subtle)' }}
                >
                  View recent work
                </Link>
              </motion.div>
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.9, ease }}
              className="w-full lg:pl-6"
            >
              <div className="lg:sticky lg:top-[28vh]">
                <GuidanceRail />
              </div>
            </motion.aside>
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
              <span className="c4-next-section-label" style={{ color: 'var(--c4-text-faint)' }}>
                Scroll
              </span>
              <motion.span
                className="c4-next-section-chevron"
                aria-hidden="true"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--c4-text-subtle)' }}>
                  <path d="M1 1l6 6 6-6" />
                </svg>
              </motion.span>
            </button>
          </div>

          <motion.div style={{ width: ruleWidth, backgroundColor: 'var(--c4-border)' }} className="mx-auto mb-4 h-px transition-[width]" />
          <div className="mx-auto grid max-w-[720px] grid-cols-3 items-center text-center text-[10px] font-medium uppercase tracking-[0.22em]" style={{ color: 'var(--c4-text-faint)' }}>
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
