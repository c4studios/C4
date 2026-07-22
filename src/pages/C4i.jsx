/**
 * C4i — the AI pillar's front door.
 *
 * Deliberately sleek and near-empty: one question, two answers. "Local" sends
 * you to the private, on-your-own-hardware system (the Private AI page). "Cloud"
 * sends you to cloud-based automations, agents and custom software (the AI &
 * Software page). Both destinations keep their own bespoke design; this page is
 * just the fork.
 *
 * Identity: "two material samples on the C4 bench". The shell stays quiet,
 * theme-following C4; each door is a committed, theme-independent sample of
 * its destination's world — a sheet of the /private-ai print collateral
 * (paper white, ink top bar, hairline rules, Geist Mono console line) and an
 * off-cut of the /ServiceAI FR-4 board (solder-mask blue, copper traces,
 * B612 Mono silkscreen). The C4 red repeats as one small constant on hero and
 * both doors: a registration mark on paper, a power LED on the board.
 * Static mode (prefers-reduced-motion or the prerenderer) renders final
 * state; hover feedback keeps non-motion equivalents.
 */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import C4iWordmark from '@/components/c4/C4iWordmark';
import '@/components/c4i-arm/c4i-arm.css';

const EASE = [0.22, 1, 0.36, 1];

const OPTIONS = [
  {
    key: 'local',
    kicker: 'On your own hardware',
    title: 'Local',
    body: 'A private AI system installed on a dedicated machine inside your office. Your documents are indexed and answered locally. Nothing leaves the building.',
    to: '/private-ai',
    cta: 'See the private system',
  },
  {
    key: 'cloud',
    kicker: 'Automations, agents & software',
    title: 'Cloud based',
    body: 'Workflow automations, AI agents and custom internal tools built on the strongest cloud models, integrated into the software you already use.',
    to: '/ServiceAI',
    cta: 'See cloud AI & software',
  },
];

// Stable module-level ref so the head hook doesn't re-run each render.
const C4I_JSONLD = [
  serviceSchema({
    name: 'C4i — AI Systems & Automation',
    description:
      'Private on-premise AI, cloud automations, AI agents and custom software for Perth businesses.',
    url: '/c4i',
    serviceType: 'AI systems and automation',
  }),
  breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'C4i', path: '/c4i' },
  ]),
];

/* Miniature of the /ServiceAI hero trace map: one core, three nets,
   copper pads. Decorative; draws in on load, static in staticMode. */
function TraceMotif({ staticMode }) {
  const draw = (i) =>
    staticMode
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: { duration: 0.8, delay: 0.7 + i * 0.14, ease: 'easeInOut' },
            opacity: { duration: 0.2, delay: 0.7 + i * 0.14 },
          },
        };
  const fade = (d) =>
    staticMode
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5, delay: d, ease: EASE },
        };

  return (
    <svg className="fk-trace" viewBox="0 0 260 46" aria-hidden="true" focusable="false">
      <motion.g {...fade(0.55)}>
        <text x="1" y="5.5" className="fk-trace-ref">
          U1
        </text>
        <rect x="0.75" y="8" width="64" height="30" rx="4" className="fk-trace-chip" />
        <text x="33" y="26.5" textAnchor="middle" className="fk-trace-name">
          CORE
        </text>
        {[13.5, 21.5, 29.5].map((y) => (
          <rect key={y} x="65" y={y} width="6" height="3" style={{ fill: 'var(--fk-copper)' }} />
        ))}
      </motion.g>
      <g fill="none" stroke="var(--fk-copper)" strokeWidth="1.5">
        <motion.path {...draw(0)} d="M71 15 H150 L158 7 H232" />
        <motion.path {...draw(1)} d="M71 23 H232" />
        <motion.path {...draw(2)} d="M71 31 H150 L158 39 H232" />
      </g>
      <motion.g {...fade(1.3)}>
        <circle cx="238" cy="7" r="3.5" fill="none" stroke="var(--fk-copper)" strokeWidth="1.5" />
        <circle cx="238" cy="23" r="3.5" fill="none" stroke="var(--fk-copper)" strokeWidth="1.5" />
        <circle cx="238" cy="39" r="3.5" fill="none" stroke="var(--fk-copper)" strokeWidth="1.5" />
        <circle cx="130" cy="23" r="1.8" style={{ fill: 'var(--fk-copper)' }} />
      </motion.g>
    </svg>
  );
}

export default function C4i() {
  const prerender = useMemo(
    () => typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent),
    [],
  );
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const staticMode = reduced || prerender;

  useDocumentHead({
    title: 'C4i — AI, local or cloud | C4 Studios',
    description:
      'C4i is C4 Studios’ AI practice. Choose a private AI system on your own hardware, or cloud-based automations, agents and custom software. Perth-built.',
    path: '/c4i',
    jsonLd: C4I_JSONLD,
  });

  /* Fonts, house link-injection pattern: the two destination monos only.
     Geist Mono quotes /private-ai's consoles, B612 Mono quotes
     /ServiceAI's silkscreen. The shell keeps the site family. */
  /* Fonts (B612 Mono + Geist Mono) are self-hosted globally
     (src/styles/fonts.css, loaded in main.jsx); no runtime Google Fonts. */

  /* Entrance helpers. In staticMode everything renders in final state. */
  const rise = (delay = 0) => ({
    initial: staticMode ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: EASE },
  });

  const barDraw = staticMode
    ? {}
    : {
        initial: { scaleX: 0 },
        animate: { scaleX: 1 },
        transition: { duration: 0.7, delay: 0.6, ease: EASE },
      };

  const [local, cloud] = OPTIONS;

  return (
    <div
      className="fk-root min-h-screen flex items-center justify-center px-6 py-28 md:py-36"
      style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}
    >
      <div className="w-full max-w-[1060px]">
        {/* Header — a single question, quietly stated */}
        <motion.div {...rise(0)} className="text-center mb-12 md:mb-16">
          <p className="fk-mark mb-6">
            <span className="fk-reg" aria-hidden="true" />
            <span className="fk-mark-code">C2</span>
            <span className="fk-mark-code" aria-hidden="true">
              ·
            </span>
            <C4iWordmark />
          </p>
          <h1
            className="text-[clamp(2rem,5vw,3.4rem)] font-semibold tracking-[-0.035em] leading-[1.05]"
            style={{ color: 'var(--c4-text)', textWrap: 'balance' }}
          >
            AI, on your terms.
          </h1>
          <p
            className="mt-5 text-[15px] md:text-[16px] leading-[1.6] max-w-[46ch] mx-auto"
            style={{ color: 'var(--c4-text-muted)' }}
          >
            Two ways to put capable AI to work in your business. Pick the one that fits.
          </p>
        </motion.div>

        {/* Two doors — each a sample of the world it opens onto */}
        <div className="relative grid gap-5 md:gap-6 sm:grid-cols-2">
          <span className="fk-or" aria-hidden="true">
            or
          </span>

          {/* Door 1 — the paper sample (/private-ai) */}
          <motion.div {...rise(0.16)} className="h-full">
            <Link to={local.to} className="fk-door fk-paper-door">
              <motion.span className="fk-inkbar" aria-hidden="true" {...barDraw} />
              <span className="fk-door-top">
                <span className="fk-meta-pa">{local.kicker}</span>
                <span className="fk-reg" aria-hidden="true" />
              </span>
              <h2 className="fk-title-pa">{local.title}</h2>
              <p className="fk-body-pa">{local.body}</p>
              <span className="fk-console">
                <span className="fk-console-prompt" aria-hidden="true">
                  &gt;
                </span>
                answered locally · nothing leaves the building
              </span>
              <span className="fk-cta fk-cta-pa">
                <span className="fk-cta-label">{local.cta}</span>
                <ArrowUpRight className="fk-arrow" size={13} strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          </motion.div>

          {/* Door 2 — the board sample (/ServiceAI) */}
          <motion.div {...rise(0.26)} className="h-full">
            <Link to={cloud.to} className="fk-door fk-board-door">
              <span className="fk-silkframe" aria-hidden="true" />
              <span className="fk-door-top">
                <span className="fk-meta-cw">{cloud.kicker}</span>
                <span className="fk-led" aria-hidden="true" />
              </span>
              <TraceMotif staticMode={staticMode} />
              <h2 className="fk-title-cw">{cloud.title}</h2>
              <p className="fk-body-cw">{cloud.body}</p>
              <span className="fk-cta fk-cta-cw">
                <span className="fk-cta-label">{cloud.cta}</span>
                <ArrowUpRight className="fk-arrow" size={13} strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          </motion.div>
        </div>

        <motion.p
          initial={staticMode ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="mt-12 text-center text-[13px]"
          style={{ color: 'var(--c4-text-muted)' }}
        >
          Not sure which fits?{' '}
          <Link to={createPageUrl('StartProject') + '?service=automation'} className="fk-fallback-link">
            Tell us what you need
          </Link>{' '}
          and we will point you the right way.
        </motion.p>
      </div>
    </div>
  );
}
