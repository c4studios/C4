import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import { automationPackages, GST_NOTE } from '@/data/pricing';
import C4iWordmark from '@/components/c4/C4iWordmark';
import { reassertStoredTheme } from '../components/c4/ThemeContext';
import '../components/ai-arm/ai-arm.css';

gsap.registerPlugin(ScrollTrigger);

/*
 * /ServiceAI — the C4i cloud arm. Identity: "solder-mask & silkscreen",
 * now under power. The page is a circuit board mid bring-up: rails
 * energise, the ratsnest routes, channels read, the assembly line
 * fills. Scroll is the clock — a gold pulse rides the copper bus down
 * the whole board. Business processes are nets routed through one C4i
 * core; packages are the BOM; the process is the assembly line.
 * Reference: Ben Eater's breadboard bring-up × KiCad's routed nets.
 * (Blue, not green, so the board and C4Sight's chalkboard stay
 * unmistakably different worlds.)
 */

const EASE = [0.22, 1, 0.36, 1];

/* ── Hero trace map geometry (SVG user units) ── */
const NETS = [
  { label: 'ENQUIRIES', d: 'M210 176 H288 L368 96 H466', bends: [[288, 176], [368, 96]], padY: 96 },
  { label: 'QUOTES', d: 'M210 200 H320 L360 160 H466', bends: [[320, 200], [360, 160]], padY: 160 },
  { label: 'INVOICING', d: 'M210 224 H466', bends: [], padY: 224 },
  { label: 'REPORTING', d: 'M210 248 H320 L360 288 H466', bends: [[320, 248], [360, 288]], padY: 288 },
  { label: 'ONBOARDING', d: 'M210 272 H288 L368 352 H466', bends: [[288, 272], [368, 352]], padY: 352 },
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

const PROC_VIAS = [
  { left: 0 },
  { left: 'calc(33.333% - 5px)' },
  { left: 'calc(66.666% - 5px)' },
  { right: 0 },
];

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
   tokens after this child effect runs. ThemeProvider strips the class
   from a parent effect (and a one-shot rAF re-assert never fires in a
   backgrounded tab), so a MutationObserver re-asserts for the life of
   the page — it runs as a microtask even while hidden. The guard means
   our own corrective write settles in one pass instead of looping. */
function useForceDark() {
  useEffect(() => {
    const root = document.documentElement;
    const assertDark = () => {
      if (
        !root.classList.contains('dark-mode') ||
        !root.classList.contains('cw-on-board') ||
        root.classList.contains('light-mode') ||
        root.classList.contains('vivid')
      ) {
        root.classList.add('dark-mode', 'cw-on-board');
        root.classList.remove('light-mode', 'vivid');
      }
    };
    assertDark();
    const observer = new MutationObserver(assertDark);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer.disconnect();
      reassertStoredTheme();
    };
  }, []);
}

/* ── The hero trace map: one C4i core, five admin nets, under bring-up.
   Airwires flash as the ratsnest first, traces route in over them, the
   core POSTs, then everything sits routed and steady. pathLength +
   opacity only; staticMode renders the finished, routed board. ── */
function TraceMap({ staticMode }) {
  const draw = (i) =>
    staticMode
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: { duration: 0.9, delay: 0.7 + i * 0.12, ease: 'easeInOut' },
            opacity: { duration: 0.2, delay: 0.7 + i * 0.12 },
          },
        };
  const fade = (d) =>
    staticMode
      ? {}
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay: d, ease: EASE } };
  const airwire = (i) => ({
    initial: { opacity: 0 },
    animate: { opacity: [0, 0.5, 0.5, 0] },
    transition: { duration: 1.5, delay: 0.2 + i * 0.1, times: [0, 0.16, 0.4, 1], ease: 'linear' },
  });

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

      {/* Ratsnest — transient straight airwires before the router runs */}
      {!staticMode && (
        <g>
          {NETS.map((net, i) => (
            <motion.path
              key={net.label}
              className="cw-airwire"
              d={`M210 ${PIN_YS[i]} L466 ${net.padY}`}
              {...airwire(i)}
            />
          ))}
        </g>
      )}

      {/* The core */}
      <motion.g {...fade(0.4)}>
        <rect x="28" y="198" width="16" height="4" style={{ fill: 'var(--cw-copper)' }} />
        <rect x="28" y="246" width="16" height="4" style={{ fill: 'var(--cw-copper)' }} />
        {PIN_YS.map((y) => (
          <rect key={y} x="194" y={y - 2} width="16" height="4" style={{ fill: 'var(--cw-copper)' }} />
        ))}
        <rect x="44" y="150" width="150" height="150" rx="8" className="cw-chip-body" />
        <motion.circle
          cx="64"
          cy="170"
          r="3.5"
          className="cw-post"
          {...(staticMode
            ? {}
            : {
                initial: { opacity: 0.35 },
                animate: { opacity: [0.35, 1, 0.3, 1, 0.4, 1] },
                transition: { duration: 1.0, delay: 0.28, times: [0, 0.18, 0.36, 0.54, 0.72, 1] },
              })}
        />
        <text x="119" y="228" textAnchor="middle" className="cw-chip-name">C4i</text>
        <text x="119" y="256" textAnchor="middle" className="cw-chip-sub">CLOUD CORE</text>
      </motion.g>

      {/* Nets — routed traces, pads, solder glints, labels */}
      {NETS.map((net, i) => (
        <g key={net.label}>
          <motion.path d={net.d} className="cw-trace" {...draw(i)} />
          <motion.g {...fade(1.05 + i * 0.12)}>
            {net.bends.map(([bx, by]) => (
              <g key={`${bx}-${by}`}>
                <circle cx={bx} cy={by} r="3.5" className="cw-via" />
                <circle cx={bx - 1.1} cy={by - 1.1} r="1" className="cw-glint" />
              </g>
            ))}
            <rect x="466" y={net.padY - 8} width="16" height="16" rx="3" className="cw-pad" />
            <circle cx="470.5" cy={net.padY - 3.5} r="1.4" className="cw-glint" />
            <text x="458" y={net.padY - 12} textAnchor="end" className="cw-netlabel">{net.label}</text>
          </motion.g>
        </g>
      ))}
    </svg>
  );
}

/* ── Logic-analyzer channel: one square wave per netlist row. Draws on
   entry; a grease-bright cursor sweeps it only while the row is hovered
   or focused, then stops. Decorative — the copy carries the meaning. ── */
function NetChannel({ i, staticMode }) {
  const wave = 'M0 16 H11 V5 H25 V16 H39 V5 H53 V16 H67 V5 H81 V16 H94';
  return (
    <span className="cw-chan" aria-hidden="true">
      <svg className="cw-wave" viewBox="0 0 94 21" preserveAspectRatio="none" focusable="false">
        <motion.path
          className="cw-wave-path"
          d={wave}
          {...(staticMode
            ? {}
            : {
                initial: { pathLength: 0 },
                whileInView: { pathLength: 1 },
                viewport: { once: true, margin: '-40px 0px' },
                transition: { duration: 0.7, delay: 0.05 + i * 0.05, ease: 'easeInOut' },
              })}
        />
      </svg>
      <span className="cw-wave-scan" />
    </span>
  );
}

export default function ServiceAI() {
  useForceDark();
  const [beltPaused, setBeltPaused] = useState(false);
  const [beltOffscreen, setBeltOffscreen] = useState(false);

  const rootRef = useRef(null);
  const busRef = useRef(null);
  const pulseRef = useRef(null);
  const beltRef = useRef(null);

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

  /* Fonts (Archivo variable + B612 Mono) are self-hosted globally
     (src/styles/fonts.css, loaded in main.jsx); no runtime Google Fonts. */

  /* The bus — a gold pulse rides the copper spine down the whole board,
     its position scrubbed by scroll (transform-only, so it moves only
     while you scroll — no idle drift). In staticMode the effect never
     runs and CSS parks the pulse at a via. */
  useEffect(() => {
    if (staticMode) return undefined;
    const root = rootRef.current;
    const bus = busRef.current;
    const pulse = pulseRef.current;
    if (!root || !bus || !pulse) return undefined;

    const PULSE = 14;
    let range = Math.max(0, bus.clientHeight - PULSE);
    const measure = () => {
      range = Math.max(0, bus.clientHeight - PULSE);
    };
    const apply = (p) => {
      const y = Math.min(1, Math.max(0, p)) * range;
      pulse.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => {
        measure();
        apply(self.progress);
      },
    });

    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(root);

    return () => {
      st.kill();
      ro.disconnect();
    };
  }, [staticMode]);

  /* Perf whitelist (memo §5): the tools belt is the site's one marquee —
     it must stop when it scrolls out of view, not just on hover. */
  useEffect(() => {
    if (staticMode) return undefined;
    const el = beltRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setBeltOffscreen(!entry.isIntersecting),
      { rootMargin: '120px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [staticMode]);

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
    <div className={`cw-root${staticMode ? ' cw-static' : ''}`} ref={rootRef}>
      {/* The copper bus — full-board spine with a scroll-scrubbed pulse */}
      <div className="cw-bus" aria-hidden="true" ref={busRef}>
        <span className="cw-bus-line" />
        <span className="cw-bus-node" style={{ top: '19%' }} />
        <span className="cw-bus-node" style={{ top: '47%' }} />
        <span className="cw-bus-node" style={{ top: '78%' }} />
        <span className="cw-bus-pulse" ref={pulseRef} />
      </div>

      {/* ═══ Hero — the board corner ═══ */}
      <header className="cw-hero">
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
              If it happens in software more than twice a week, it’s a candidate.
              These five come up in almost every scoping call.
            </p>
          </motion.div>

          <div>
            {NET_ROWS.map((row, i) => (
              <motion.div className="cw-net-row" key={row.net} {...inView(i)}>
                <div className="cw-net-head">
                  <span className="cw-net-name">{row.net}</span>
                  <NetChannel i={i} staticMode={staticMode} />
                </div>
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
                Four builds, priced from the studio’s central list — the same
                numbers wherever you find them.
              </p>
            </div>
            <span className="cw-bom-meta">
              BOM · Automation · {String(automationPackages.length).padStart(2, '0')} lines
            </span>
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
            <>
              <motion.div
                className="cw-belt"
                data-paused={beltPaused || beltOffscreen || undefined}
                ref={beltRef}
                {...inView(1)}
              >
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
              {/* WCAG 2.2.2 — a real mechanism to stop the moving ticker. */}
              <button
                type="button"
                className="cw-belt-pause"
                aria-pressed={beltPaused}
                onClick={() => setBeltPaused((p) => !p)}
              >
                {beltPaused ? '▶ run ticker' : '❚❚ pause ticker'}
              </button>
            </>
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
            {PROC_VIAS.map((pos, n) => (
              <motion.span
                key={n}
                className="cw-proc-via"
                style={pos}
                {...(staticMode
                  ? {}
                  : {
                      initial: { opacity: 0.32 },
                      whileInView: { opacity: 1 },
                      viewport: { once: true, margin: '-70px 0px' },
                      transition: { duration: 0.3, delay: 0.12 + n * 0.28, ease: EASE },
                    })}
              />
            ))}
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
            <h2 className="cw-h2">Your team isn’t middleware.</h2>
            <p className="cw-cta-sub">
              Tell us which process is the biggest drain. We’ll scope the fix,
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
