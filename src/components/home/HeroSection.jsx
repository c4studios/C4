import React, { useEffect, useRef } from 'react';
import { Link } from '@/components/c4/SiteLink';
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
   breaches the studio's own rule. Restore it only with a citation.

   'Websites and AI systems, built in Perth.' became websites and software on
   9 Oct 2026, when AI systems went to C4Site with C4i.

   20 Nov 2026, the touch-up Caleb picked (option C of three; "go C"). He kept
   this hero and its heatmap ("keep the hero for now, or at least touch it up
   but maintain the heat map"). Gone from the typed lines: "Your website is
   30% of the job" (no source; PRODUCT.md says it doesn't come back),
   "Engineering, not decoration" (an X-not-Y line), the mirror pair "Loud
   websites. Quiet systems." and "Stop renting your operations" (written for
   the automation work that moved to C4Site). The second line is the site's
   own About headline, shortened. */
const PHRASES = [
  'Websites and software, built in Perth.',
  'You brief the person who builds it.',
];

/* ─────────────────────────────────────────────────────────────
   "View recent work": black, and white floods in from wherever the pointer
   or a finger first touches it, then drains back out where it leaves (Caleb,
   20 Nov 2026: "make the 'view recent work' button black, and make it
   reactive to touch so it becomes white from where the cursor touches it in
   an animated fashion"). The white is a copy of the label on white, clipped
   to a circle that grows from that point, so its edge passes through the
   letters. Keyboard focus fills it from the middle. Under reduced motion it
   snaps. Styles: .hh-fill in home.css.
   ───────────────────────────────────────────────────────────── */
function FillLink({ to, onClick, children }) {
  const ref = useRef(null);
  const place = (e) => {
    const el = ref.current;
    if (!el || typeof e?.clientX !== 'number') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--hv-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--hv-y', `${e.clientY - r.top}px`);
  };
  const fill = (e) => {
    place(e);
    ref.current?.classList.add('is-lit');
  };
  const drain = (e) => {
    place(e);
    ref.current?.classList.remove('is-lit');
  };
  return (
    <Link
      ref={ref}
      to={to}
      onClick={onClick}
      onPointerEnter={fill}
      onPointerDown={fill}
      onPointerLeave={drain}
      onPointerCancel={drain}
      onFocus={(e) => {
        // the keyboard fills it from the middle; a mouse click's focus mustn't move the circle
        if (!e.currentTarget.matches(':focus-visible')) return;
        e.currentTarget.style.setProperty('--hv-x', '50%');
        e.currentTarget.style.setProperty('--hv-y', '50%');
        e.currentTarget.classList.add('is-lit');
      }}
      onBlur={(e) => {
        if (!e.currentTarget.matches(':hover')) e.currentTarget.classList.remove('is-lit');
      }}
      className="hh-fill group inline-flex items-center justify-center px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] rounded-full"
    >
      <span className="hh-fill__label">{children}</span>
      <span className="hh-fill__ink" aria-hidden="true">
        <span className="hh-fill__label">{children}</span>
      </span>
    </Link>
  );
}

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
  const startRef = useRef(null);
  const heatTimer = useRef(0);

  /* While the start button is hovered or focused, the heatmap warms under it,
     towards the start red (CraftHeatmap listens for 'c4:heat'; it ignores it
     under reduced motion). */
  const heatOn = () => {
    if (heatTimer.current) return;
    const send = () => {
      const r = startRef.current?.getBoundingClientRect();
      if (!r) return;
      window.dispatchEvent(new CustomEvent('c4:heat', {
        detail: { left: r.left - 26, right: r.right + 26, top: r.top - 22, bottom: r.bottom + 22 },
      }));
    };
    send();
    heatTimer.current = window.setInterval(send, 140);
  };
  const heatOff = () => {
    window.clearInterval(heatTimer.current);
    heatTimer.current = 0;
  };
  useEffect(() => heatOff, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const ruleWidth = useTransform(scrollYProgress, [0, 0.3], ['100%', '40%']);

  /* The cover fills the first screen and grows past it rather than clip what
     it holds. It was h-[100svh] with overflow hidden, and on a short window
     (1280x720, 1366x768, 1024x640, 900x600, a 375x667 phone) that cut off
     the "Perth, Australia" row and, shorter still, the Scroll invite. The
     padding now tightens with the screen's height (svh), reaching the old
     112px at 800px tall and up, so a tall screen looks as it did. */
  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden" style={{ isolation: 'isolate' }}>
      <div className="absolute inset-0 z-0" style={{ position: 'absolute' }}>
        <CraftHeatmap />
      </div>

      <motion.div
        style={{ y, opacity, paddingTop: 'clamp(84px, 14svh, 112px)', paddingBottom: 'clamp(24px, calc(28svh - 140px), 112px)' }}
        className="relative z-10 flex flex-1 items-center"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
          <div className="max-w-[860px]">
            <div className="max-w-[760px]">
              {/* tracking at DESIGN.md's floor of -0.04em (it was -0.06em) */}
              <h1
                className="max-w-[14ch] text-[clamp(2.65rem,6vw,5.4rem)] font-semibold tracking-[-0.04em] leading-[0.96]"
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
                className="mt-7 max-w-[34rem] text-[17px] leading-[1.6] md:mt-9 md:text-[18px]"
                style={{ color: 'var(--prose, var(--c4-text))', textWrap: 'pretty' }}
              >
                You deal with the person doing the work, from the first call to
                long after launch.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 1.18 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-12"
            >
              <Link
                ref={startRef}
                to={START_PROJECT_PATH}
                onClick={() => trackEvent('hero_cta_click', { target: 'start' })}
                onMouseEnter={heatOn}
                onMouseLeave={heatOff}
                onFocus={heatOn}
                onBlur={heatOff}
                className="c4-cta-primary group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] rounded-full"
                style={{ backgroundColor: 'var(--c4-accent)', color: '#fff' }}
              >
                Start a project
                <ArrowRight size={13} strokeWidth={2} className="opacity-80 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
              <FillLink
                to={createPageUrl('Portfolio')}
                onClick={() => trackEvent('hero_cta_click', { target: 'portfolio' })}
              >
                View recent work
                <ArrowRight size={13} strokeWidth={2} className="opacity-80 transition-transform duration-300 group-hover:translate-x-0.5" />
              </FillLink>
            </motion.div>

            {/* The thesis line: the ONLY place the first fold names all four
                trades (hero audit: no arm vocabulary was visible before
                scrolling). Quiet on purpose — the doors below do the selling.
                Private AI came out on 9 Oct 2026; it's C4Site's now. Logo
                design came in the same day as the fourth arm. */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 1.42 }}
              className="mt-6 text-[14px] leading-relaxed md:mt-7"
              style={{ color: 'var(--c4-text-muted)' }}
            >
              Websites and apps, photography, SEO and copywriting, and logo design.
              Perth-built, all four doors below.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* On phones the Support pill (fixed, bottom right) sat on "Est. Dec 2025" in the first screen, so the row clears its 60px there. */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-[76px] sm:pb-[clamp(16px,4svh,36px)] md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.42 }}
        >
          <div className="flex justify-center" style={{ marginBottom: 'clamp(16px, 4svh, 36px)' }}>
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
              <span className="c4-next-section-label" style={{ color: 'var(--c4-text-muted)' }}>
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
          {/* The strip in B612, mixed case, in the muted ink (it was 10px tracked
              capitals in the subtle ink, which DESIGN.md keeps off words). On
              phones the two items sit together on the left, out of the Support
              pill's column at any screen height; from 640px, three centred columns. */}
          <div className="mx-auto flex max-w-[720px] flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[12.5px] tracking-[0.02em] sm:grid sm:grid-cols-3 sm:text-center" style={{ color: 'var(--c4-text-muted)' }}>
            <span className="whitespace-nowrap">Perth, Australia</span>
            <span className="hidden sm:inline">Founder-led studio</span>
            <span className="whitespace-nowrap">Est. Dec 2025</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
