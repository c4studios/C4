import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import { automationPackages, GST_NOTE } from '@/data/pricing';
import C4iWordmark from '@/components/c4/C4iWordmark';
import '../components/ai-arm/ai-arm.css';

/*
 * /ServiceAI — the C4i cloud arm. Identity: "solder-mask & silkscreen".
 * The page is a live circuit board — deep green solder mask, copper
 * traces, gold pads, white silkscreen. Business processes are nets
 * routed through one C4i core; packages are the BOM; the process is
 * the assembly line. Reference: bare FR-4 boards from vintage
 * HP / Tektronix service equipment.
 */

const EASE = [0.22, 1, 0.36, 1];

/* ── Hero trace map geometry (SVG user units) ── */
const NETS = [
  { label: 'ENQUIRIES', d: 'M210 176 H288 L368 96 H466', bends: [[288, 176], [368, 96]], padY: 96, pulse: { dur: '5.4s', begin: '0.9s' } },
  { label: 'QUOTES', d: 'M210 200 H320 L360 160 H466', bends: [[320, 200], [360, 160]], padY: 160, pulse: null },
  { label: 'INVOICING', d: 'M210 224 H466', bends: [], padY: 224, pulse: { dur: '4.6s', begin: '1.7s' } },
  { label: 'REPORTING', d: 'M210 248 H320 L360 288 H466', bends: [[320, 248], [360, 288]], padY: 288, pulse: null },
  { label: 'ONBOARDING', d: 'M210 272 H288 L368 352 H466', bends: [[288, 272], [368, 352]], padY: 352, pulse: { dur: '6.1s', begin: '2.5s' } },
];

const PIN_YS = [176, 200, 224, 248, 272];

/* ── What gets wired out — the netlist ── */
const NET_ROWS = [
  { net: 'ENQUIRIES', copy: 'Captured, qualified and logged in your CRM with a reply drafted — before you’ve opened the inbox.' },
  { net: 'QUOTES', copy: 'Generated from your templates, sent, and followed up on a schedule. Nothing falls through.' },
  { net: 'INVOICING', copy: 'Raised from job data, reconciled against payments, and chased politely when overdue.' },
  { net: 'REPORTING', copy: 'Numbers pulled from every tool you run, compiled into the one report that lands each Monday.' },
  { net: 'ONBOARDING', copy: 'New clients walked through welcome, forms, folders and a first booking — by a checklist that runs itself.' },
];

const STEPS = [
  { no: '01', label: 'Map', copy: 'We document your current workflow and identify exactly where time is being lost.' },
  { no: '02', label: 'Design', copy: 'The automation logic is designed before a line of code is written.' },
  { no: '03', label: 'Build', copy: 'Integrated, tested, and edge-case covered.' },
  { no: '04', label: 'Hand over', copy: 'You get full documentation and a walkthrough — no black boxes.' },
];

const TOOLS = ['Make', 'Zapier', 'n8n', 'Airtable', 'Notion', 'Slack', 'HubSpot', 'Stripe', 'OpenAI', 'Google Workspace'];

// Stable module-level ref so the head hook doesn't re-run each render.
const AI_JSONLD = [
  serviceSchema({
    name: 'AI & Workflow Automation',
    description:
      'Workflow automation, AI agents, custom integrations and lean software replacements for Perth businesses.',
    url: '/ServiceAI',
    serviceType: 'AI and workflow automation',
  }),
  breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'AI & Software', path: '/ServiceAI' },
  ]),
];

/* Force dark chrome while on the board, Lens-style. The .cw-on-board
   marker drives !important token overrides in ai-arm.css so the nav and
   footer read dark even though ThemeProvider re-applies its own inline
   tokens after this child effect runs. The dark-mode class is asserted
   twice (immediately + next frame) to outlast that parent effect. */
function useForceDark() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.className;
    const apply = () => {
      root.classList.add('dark-mode', 'cw-on-board');
      root.classList.remove('light-mode', 'vivid');
    };
    apply();
    const raf = requestAnimationFrame(apply);
    return () => {
      cancelAnimationFrame(raf);
      root.className = prev;
      root.classList.remove('cw-on-board');
    };
  }, []);
}

/* ── The hero trace map: one C4i core, five admin nets ── */
function TraceMap({ staticMode }) {
  const draw = (i) =>
    staticMode
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: { duration: 0.9, delay: 0.55 + i * 0.12, ease: 'easeInOut' },
            opacity: { duration: 0.2, delay: 0.55 + i * 0.12 },
          },
        };
  const fade = (d) =>
    staticMode
      ? {}
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay: d, ease: EASE } };

  return (
    <svg
      viewBox="0 0 560 440"
      role="img"
      aria-label="Circuit diagram: the C4i cloud core routing five business processes — enquiries, quotes, invoicing, reporting and onboarding."
    >
      {/* Silkscreen frame + fiducials */}
      <motion.g {...fade(0.35)}>
        <rect x="6" y="6" width="548" height="428" rx="10" className="cw-silk-frame" />
        <g stroke="var(--cw-copper-dim)" strokeWidth="1.5" fill="none">
          <circle cx="532" cy="34" r="5" />
          <path d="M524 34 H540 M532 26 V42" />
          <circle cx="28" cy="404" r="5" />
          <path d="M20 404 H36 M28 396 V412" />
        </g>
      </motion.g>

      {/* The core */}
      <motion.g {...fade(0.4)}>
        <rect x="28" y="198" width="16" height="4" style={{ fill: 'var(--cw-copper)' }} />
        <rect x="28" y="246" width="16" height="4" style={{ fill: 'var(--cw-copper)' }} />
        {PIN_YS.map((y) => (
          <rect key={y} x="194" y={y - 2} width="16" height="4" style={{ fill: 'var(--cw-copper)' }} />
        ))}
        <rect x="44" y="150" width="150" height="150" rx="8" className="cw-chip-body" />
        <circle cx="64" cy="170" r="3.5" style={{ fill: 'var(--cw-mute)' }} />
        <text x="119" y="228" textAnchor="middle" className="cw-chip-name">C4i</text>
        <text x="119" y="256" textAnchor="middle" className="cw-chip-sub">CLOUD CORE</text>
      </motion.g>

      {/* Nets */}
      {NETS.map((net, i) => (
        <g key={net.label}>
          <motion.path d={net.d} className="cw-trace" {...draw(i)} />
          <motion.g {...fade(0.8 + i * 0.12)}>
            {net.bends.map(([bx, by]) => (
              <circle key={`${bx}-${by}`} cx={bx} cy={by} r="3.5" className="cw-via" />
            ))}
            <rect x="466" y={net.padY - 8} width="16" height="16" rx="3" className="cw-pad" />
            <text x="458" y={net.padY - 12} textAnchor="end" className="cw-netlabel">{net.label}</text>
          </motion.g>
          {!staticMode && net.pulse && (
            <circle r="3.2" className="cw-pulse">
              <animateMotion dur={net.pulse.dur} begin={net.pulse.begin} repeatCount="indefinite" path={net.d} />
            </circle>
          )}
        </g>
      ))}
    </svg>
  );
}

export default function ServiceAI() {
  useForceDark();

  useDocumentHead({
    title: 'AI & Software — C4 Studios Perth',
    description:
      'Workflow automation, AI agents, custom integrations and lean software replacements. Replace hours of manual work with systems that run themselves.',
    path: '/ServiceAI',
    jsonLd: AI_JSONLD,
  });

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

  /* Fonts: Archivo (variable width) + B612 Mono, house link-injection pattern. */
  useEffect(() => {
    const els = [];
    const pc1 = document.createElement('link');
    pc1.rel = 'preconnect';
    pc1.href = 'https://fonts.googleapis.com';
    const pc2 = document.createElement('link');
    pc2.rel = 'preconnect';
    pc2.href = 'https://fonts.gstatic.com';
    pc2.crossOrigin = 'anonymous';
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href =
      'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62.5..125,400..900&family=B612+Mono:ital,wght@0,400;0,700;1,700&display=swap';
    [pc1, pc2, font].forEach((el) => {
      document.head.appendChild(el);
      els.push(el);
    });
    return () => els.forEach((el) => el.remove());
  }, []);

  /* Entrance helpers — no-ops in static mode so the final state renders
     immediately for the prerenderer and reduced-motion visitors. */
  const heroIn = (d = 0) =>
    staticMode
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: d, ease: EASE },
        };
  const inView = (i = 0) =>
    staticMode
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-70px 0px' },
          transition: { duration: 0.6, delay: i * 0.06, ease: EASE },
        };

  const startUrl = createPageUrl('StartProject') + '?service=automation';

  return (
    <div className={`cw-root${staticMode ? ' cw-static' : ''}`}>
      {/* ═══ Hero — the board corner ═══ */}
      <header className="cw-hero">
        <span className="cw-hole cw-hole--l" aria-hidden="true" />
        <span className="cw-hole cw-hole--r" aria-hidden="true" />

        <div className="cw-container">
          <motion.div className="cw-hero-legend" {...heroIn(0.05)}>
            <span className="cw-legend cw-arm">
              <strong>C2</strong> — <C4iWordmark /> · cloud automation
            </span>
            <span className="cw-pwr" aria-hidden="true">
              <span className="cw-led" />
              <span className="cw-legend">PWR</span>
            </span>
          </motion.div>

          <div className="cw-hero-grid">
            <div>
              <motion.h1 className="cw-h1" {...heroIn(0.12)}>
                Your business, hard&#8209;wired to run itself.
              </motion.h1>
              <motion.p className="cw-sub" {...heroIn(0.22)}>
                Workflow automation, AI agents and custom integrations that compound
                over time — repetitive tasks become quiet systems that run themselves.
              </motion.p>
              <motion.div className="cw-hero-ctas" {...heroIn(0.32)}>
                <Link to={startUrl} className="cw-btn">
                  Start a brief
                  <ArrowRight size={14} strokeWidth={2.25} />
                </Link>
                <Link to={createPageUrl('Portfolio')} className="cw-btn cw-btn--ghost">
                  See the work
                </Link>
              </motion.div>

              {/* Mobile-only micro board */}
              <div className="cw-microboard" aria-hidden="true">
                <span className="cw-chip-mini">C4i</span>
                <span className="cw-mini-trace" />
              </div>
            </div>

            <motion.figure className="cw-heromap" style={{ margin: 0 }} {...heroIn(0.2)}>
              <TraceMap staticMode={staticMode} />
              <figcaption className="cw-mapcaption">
                fig. 01 — five admin nets, one core. The pulses are your paperwork, moving on its own.
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </header>

      <hr className="cw-rail" aria-hidden="true" />

      {/* ═══ Netlist — what gets wired out ═══ */}
      <section className="cw-nets">
        <div className="cw-container">
          <motion.div className="cw-nets-head" {...inView()}>
            <h2 className="cw-h2">What gets wired out of your week.</h2>
            <p className="cw-lead">
              If it happens in software more than twice a week, it's a candidate.
              These five come up in almost every scoping call.
            </p>
          </motion.div>

          <div>
            {NET_ROWS.map((row, i) => (
              <motion.div className="cw-net-row" key={row.net} {...inView(i)}>
                <span className="cw-net-name">{row.net}</span>
                <p>{row.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="cw-rail" aria-hidden="true" />

      {/* ═══ BOM — packages, straight from the central pricing list ═══ */}
      <section className="cw-bom">
        <div className="cw-container">
          <motion.div className="cw-bom-head" {...inView()}>
            <div>
              <h2 className="cw-h2">Start where the pain is.</h2>
              <p className="cw-lead">
                Four builds, priced from the studio's central list — the same
                numbers wherever you find them.
              </p>
            </div>
            <span className="cw-bom-meta">BOM · Automation · 04 lines</span>
          </motion.div>

          <div>
            {automationPackages.map((pkg, i) => (
              <motion.article
                key={pkg.key}
                className={`cw-bom-row${pkg.popular ? ' is-popular' : ''}`}
                {...inView(i)}
              >
                <div>
                  <h3 className="cw-bom-name">
                    {pkg.name}
                    {pkg.popular && <span className="cw-tag">Most specified</span>}
                  </h3>
                  <p className="cw-bom-desc">{pkg.description}</p>
                </div>
                <ul className="cw-bom-feats">
                  {pkg.features.map((f) => (
                    <li key={f}>
                      <span className="cw-pin" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="cw-bom-buy">
                  <p className="cw-price">{pkg.priceLabel}</p>
                  <Link
                    to={createPageUrl('StartProject') + `?service=automation&package=${pkg.key}`}
                    className="cw-textlink"
                  >
                    Start this build
                    <ArrowRight size={13} strokeWidth={2.25} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.p className="cw-fineprint" {...inView(1)}>{GST_NOTE}</motion.p>
        </div>
      </section>

      {/* ═══ Compatible parts — the tool conveyor ═══ */}
      <section className="cw-tools">
        <div className="cw-container">
          <motion.div {...inView()}>
            <h2 className="cw-h2">Plays nicely with what you already run.</h2>
            <p className="cw-tools-note">
              …and most things with an API. If a tool can talk, we can wire it in.
            </p>
          </motion.div>

          {staticMode ? (
            <ul className="cw-toolgrid">
              {TOOLS.map((tool) => (
                <li key={tool} className="cw-toolchip">{tool}</li>
              ))}
            </ul>
          ) : (
            <motion.div className="cw-belt" {...inView(1)}>
              <div className="cw-belt-track">
                <ul>
                  {TOOLS.map((tool) => (
                    <li key={tool} className="cw-toolchip">{tool}</li>
                  ))}
                </ul>
                <ul aria-hidden="true">
                  {TOOLS.map((tool) => (
                    <li key={tool} className="cw-toolchip">{tool}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ Process — the assembly line ═══ */}
      <section className="cw-proc">
        <div className="cw-container">
          <motion.div className="cw-proc-head" {...inView()}>
            <h2 className="cw-h2">From mapped to humming.</h2>
            <p className="cw-lead">
              Four steps, documented as we go — you can see the whole board at any point.
            </p>
          </motion.div>

          <div className="cw-proc-track" aria-hidden="true">
            <motion.div
              className="cw-proc-fill"
              {...(staticMode
                ? {}
                : {
                    initial: { scaleX: 0 },
                    whileInView: { scaleX: 1 },
                    viewport: { once: true, margin: '-70px 0px' },
                    transition: { duration: 1.1, ease: EASE },
                  })}
            />
            <span className="cw-proc-via" style={{ left: 0 }} />
            <span className="cw-proc-via" style={{ left: 'calc(33.333% - 5px)' }} />
            <span className="cw-proc-via" style={{ left: 'calc(66.666% - 5px)' }} />
            <span className="cw-proc-via" style={{ right: 0 }} />
          </div>

          <ol className="cw-proc-steps" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {STEPS.map((s, i) => (
              <motion.li className="cw-step" key={s.no} {...inView(i)}>
                <span className="cw-step-no">{s.no}</span>
                <h3 className="cw-step-label">{s.label}</h3>
                <p>{s.copy}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ The sibling system — private, on your own hardware ═══ */}
      <section className="cw-sibling">
        <div className="cw-container">
          <motion.div className="cw-sibling-inner" {...inView()}>
            <div className="cw-sibling-copy">
              <span className="cw-sibling-tagline">Alt. configuration</span>
              <p>
                Prefer AI that never leaves the building? <C4iWordmark /> also installs
                private systems on your own hardware — documents indexed, questions
                answered and logged locally.
              </p>
            </div>
            <Link to={createPageUrl('PrivateAI')} className="cw-textlink">
              See the private system
              <ArrowUpRight size={14} strokeWidth={2.25} />
            </Link>
          </motion.div>
        </div>
      </section>

      <hr className="cw-rail" aria-hidden="true" />

      {/* ═══ Power header — closing CTA ═══ */}
      <section className="cw-cta">
        <div className="cw-container">
          <motion.div {...inView()}>
            <span className="cw-cta-ready">
              <span className="cw-led" aria-hidden="true" />
              Systems ready
            </span>
            <h2 className="cw-h2">Your team isn't middleware.</h2>
            <p className="cw-cta-sub">
              Tell us which process is the biggest drain. We'll scope the fix,
              price it, and wire it in.
            </p>
            <Link to={startUrl} className="cw-btn">
              Start a project
              <ArrowRight size={14} strokeWidth={2.25} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
