import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, animate, useInView } from 'framer-motion';
import { ArrowRight, Check, Terminal, Zap, Bot, Wrench } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PageHero from '../components/c4/PageHero';
import useDocumentHead from '@/hooks/useDocumentHead';

const ease = [0.22, 1, 0.36, 1];

/*
 * Page motif: the terminal. The whole page reads like a runtime —
 * a live audit types itself in the hero, packages are commands,
 * the process is a log file, integrations stream past like stdout.
 */

const offerings = [
  {
    code: 'A1',
    cmd: 'automate --scope=single',
    title: 'Automation Core',
    price: '$750',
    timeline: '1–2 weeks',
    icon: Zap,
    desc: 'Eliminate a single painful manual process. One workflow, fully automated, tested and handed over.',
    features: ['One workflow automated', 'Integration setup', 'Testing & QA', 'Documentation'],
    param: 'automation&package=automation-core',
  },
  {
    code: 'A2',
    cmd: 'automate --scope=suite',
    title: 'Workflow Starter',
    price: '$1,500',
    timeline: '2–3 weeks',
    icon: Terminal,
    desc: 'A connected system of automations that works across your tools without you lifting a finger.',
    features: ['Up to 3 workflows', 'Multi-tool integration', 'Error handling', 'Training session'],
    param: 'automation&package=workflow-starter',
  },
  {
    code: 'A3',
    cmd: 'deploy --type=ai-agent',
    title: 'AI Agent Build',
    price: 'From $2,500',
    timeline: '3–5 weeks',
    icon: Bot,
    desc: 'A custom AI agent trained on your data and processes — built to handle tasks your team handles today.',
    features: ['Custom LLM integration', 'Knowledge base setup', 'Prompt engineering', 'Monitoring dashboard'],
    param: 'automation&package=ai-agent',
  },
  {
    code: 'A4',
    cmd: 'build --type=internal-tool',
    title: 'Software Replacement',
    price: 'From $4,000',
    timeline: '5–8 weeks',
    icon: Wrench,
    desc: 'Replace expensive off-the-shelf software with lean, purpose-built internal tools.',
    features: ['Requirements audit', 'Custom build', 'Data migration', 'Ongoing support option'],
    param: 'automation&package=software-replacement',
  },
];

const process = [
  { step: '01', label: 'Map', desc: 'We document your current workflow and identify exactly where time is being lost.' },
  { step: '02', label: 'Design', desc: 'The automation logic is designed before a line of code is written.' },
  { step: '03', label: 'Build', desc: 'Integrated, tested, and edge-case covered.' },
  { step: '04', label: 'Hand Over', desc: 'You get full documentation and a walkthrough — no black boxes.' },
];

const stats = [
  { value: '14h', label: 'avg. saved per team member per week' },
  { value: '3×', label: 'faster client onboarding after automation' },
  { value: '100%', label: 'of projects delivered with full documentation' },
];

const integrations = ['Make', 'Zapier', 'n8n', 'Airtable', 'Notion', 'Slack', 'HubSpot', 'Stripe', 'OpenAI', 'Google Workspace'];

/* Terminal panel colours — the panel is always dark, independent of site theme */
const term = {
  bg: 'var(--c4-inverted-bg)',
  text: 'var(--c4-inverted-text)',
  muted: 'var(--c4-inverted-text-muted)',
  faint: 'var(--c4-inverted-text-faint)',
  border: 'var(--c4-inverted-border)',
  green: '#6FBF8E',
  prompt: '#D98E85',
};

const HERO_CMD = 'c4 audit --workflows';
const HERO_LINES = [
  { color: term.muted, text: '→ scanning sales, ops and admin workflows …' },
  { color: term.muted, text: '→ found 23 manual steps · 14h/week recoverable' },
  { color: term.green, text: '✓ automation plan ready — 4 quick wins flagged' },
];

function HeroTerminal() {
  const [typed, setTyped] = useState('');
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(HERO_CMD);
      setLineCount(HERO_LINES.length);
      return;
    }
    const timers = [];
    let interval = null;
    timers.push(setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setTyped(HERO_CMD.slice(0, i));
        if (i >= HERO_CMD.length) {
          clearInterval(interval);
          HERO_LINES.forEach((_, k) => {
            timers.push(setTimeout(() => setLineCount(k + 1), 500 + k * 450));
          });
        }
      }, 42);
    }, 1100));
    return () => {
      timers.forEach(clearTimeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="mt-10 w-full max-w-[480px] rounded-[5px] overflow-hidden"
      style={{ border: '1px solid var(--c4-border)', boxShadow: '0 24px 60px -30px rgba(0,0,0,0.45)' }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: 'var(--c4-bg-alt)', borderBottom: '1px solid var(--c4-border)' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(255,90,90,0.7)' }} />
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(255,185,50,0.7)' }} />
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(40,200,100,0.7)' }} />
        </div>
        <span className="text-[10px]" style={{ fontFamily: 'monospace', color: 'var(--c4-text-subtle)' }}>c4 — audit</span>
      </div>
      <div
        className="px-5 py-4 text-[12px] leading-[1.9]"
        style={{ fontFamily: 'monospace', backgroundColor: term.bg, minHeight: '128px' }}
      >
        <div>
          <span style={{ color: term.prompt }}>$ </span>
          <span style={{ color: term.text }}>{typed}</span>
          <span className="c4-caret" style={{ color: term.text }}>▌</span>
        </div>
        {HERO_LINES.slice(0, lineCount).map((line, i) => (
          <div key={i} style={{ color: line.color }}>{line.text}</div>
        ))}
      </div>
    </div>
  );
}

function CountUp({ value, className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  useEffect(() => {
    if (!inView || !ref.current) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const m = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return undefined;
    const target = parseFloat(m[1]);
    const suffix = m[2] || '';
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref} className={className} style={style}>{value}</span>;
}

export default function ServiceAI() {
  const [hoverIndex, setHoverIndex] = useState(null);

  useDocumentHead({
    title: 'AI & Software — C4 Studios Perth',
    description:
      'Workflow automation, AI agents, custom integrations and lean software replacements. Replace hours of manual work with systems that run themselves.',
    path: '/ServiceAI',
  });

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <style>{`
        @keyframes c4-caret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .c4-caret { animation: c4-caret 1.1s step-end infinite; }
        @keyframes c4-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .c4-marquee { animation: c4-marquee 30s linear infinite; }
        .c4-marquee:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .c4-caret { animation: none; }
          .c4-marquee { animation: none; }
        }
      `}</style>

      <PageHero
        label="C3 — AI & Software"
        titleLines={['Software that replaces', 'hours, not headcount.']}
        description="Workflow automation, AI agents, and custom integrations that compound over time — turning repetitive tasks into systems that run themselves."
      >
        <div className="flex items-center gap-5">
          <Link
            to={createPageUrl('StartProject') + '?service=automation'}
            className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
            style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            Start a brief
            <ArrowRight size={12} strokeWidth={2} />
          </Link>
          <Link
            to={createPageUrl('Portfolio')}
            className="text-[11px] uppercase tracking-[0.14em] font-medium"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            See the work
          </Link>
        </div>
        <HeroTerminal />
      </PageHero>

      {/* Stats — counted up live */}
      <section className="py-12 md:py-16 border-y" style={{ borderColor: 'var(--c4-border)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease }}
              >
                <CountUp
                  value={s.value}
                  className="block text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-[-0.04em] tabular-nums"
                  style={{ color: 'var(--c4-text)' }}
                />
                <p className="mt-1 text-[12.5px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings — terminal-style cards */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mb-10 md:mb-14"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-1" style={{ color: 'var(--c4-text-subtle)' }}>Packages & Pricing</p>
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.025em]">Start where the pain is.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {offerings.map((o, i) => {
              const Icon = o.icon;
              const isHovered = hoverIndex === i;
              return (
                <motion.div
                  key={o.code}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className="flex flex-col rounded-[3px] overflow-hidden transition-[box-shadow,transform] duration-300"
                  style={{
                    border: '1px solid var(--c4-border)',
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: isHovered ? '0 20px 50px -20px rgba(0,0,0,0.4)' : 'none',
                  }}
                >
                  {/* Terminal header bar */}
                  <div
                    className="flex items-center justify-between px-4 py-2.5"
                    style={{
                      backgroundColor: 'var(--c4-bg-alt)',
                      borderBottom: '1px solid var(--c4-border)',
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(255,90,90,0.7)' }} />
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(255,185,50,0.7)' }} />
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(40,200,100,0.7)' }} />
                    </div>
                    <code
                      className="text-[10px] tracking-[0.06em]"
                      style={{ fontFamily: 'monospace', color: isHovered ? 'var(--c4-text)' : 'var(--c4-text-subtle)', transition: 'color .25s ease' }}
                    >
                      c4 {o.cmd}<span className="c4-caret" style={{ color: 'var(--c4-accent)' }}>▌</span>
                    </code>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col p-7 md:p-8 flex-1" style={{ backgroundColor: 'var(--c4-bg)' }}>
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded flex items-center justify-center"
                          style={{ backgroundColor: 'color-mix(in srgb, var(--c4-accent) 12%, transparent)' }}
                        >
                          <Icon size={16} strokeWidth={1.5} style={{ color: 'var(--c4-accent)' }} />
                        </div>
                        <span
                          className="text-[10px] font-mono tracking-wider"
                          style={{ color: 'var(--c4-accent)' }}
                        >{o.code}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[1.2rem] font-semibold tabular-nums tracking-[-0.025em]" style={{ color: 'var(--c4-text)' }}>{o.price}</p>
                        <p className="text-[11px]" style={{ color: 'var(--c4-text-faint)' }}>{o.timeline}</p>
                      </div>
                    </div>

                    <h3 className="text-[1.05rem] font-semibold tracking-[-0.01em] mb-3">{o.title}</h3>
                    <p className="text-[13px] leading-[1.65] mb-6 flex-1" style={{ color: 'var(--c4-text-muted)' }}>{o.desc}</p>

                    <ul className="space-y-2 mb-8">
                      {o.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-[12.5px]" style={{ color: 'var(--c4-text-muted)' }}>
                          <Check size={11} strokeWidth={2.5} style={{ color: 'var(--c4-accent)', flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={`/start?service=${o.param}`}
                      className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.13em] font-medium transition-colors duration-200"
                      style={{ color: isHovered ? 'var(--c4-text)' : 'var(--c4-text-subtle)' }}
                    >
                      Start this
                      <ArrowRight size={11} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations — streaming marquee */}
      <section className="py-12 md:py-16 border-t" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-col md:flex-row md:items-center gap-5 md:gap-10"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium flex-shrink-0" style={{ color: 'var(--c4-text-subtle)' }}>
              Tools we work with
            </p>
            <div
              className="relative flex-1 overflow-hidden"
              style={{
                maskImage: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
                WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
              }}
            >
              <div className="c4-marquee flex w-max">
                {[...integrations, ...integrations].map((tool, i) => (
                  <span
                    key={`${tool}-${i}`}
                    className="mr-2 px-3 py-1.5 text-[11px] font-medium rounded-[2px] whitespace-nowrap"
                    style={{
                      backgroundColor: 'var(--c4-bg)',
                      border: '1px solid var(--c4-border)',
                      color: 'var(--c4-text-muted)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process — rendered as a log file */}
      <section className="py-16 md:py-20 border-t" style={{ borderColor: 'var(--c4-border)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mb-10 md:mb-14"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-1" style={{ color: 'var(--c4-text-subtle)' }}>Process</p>
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.025em]">No guesswork. Just systems.</h2>
          </motion.div>

          <div className="rounded-[5px] overflow-hidden" style={{ border: '1px solid var(--c4-border)' }}>
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ backgroundColor: 'var(--c4-bg-alt)', borderBottom: '1px solid var(--c4-border)' }}
            >
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--c4-border)' }} />
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--c4-border)' }} />
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--c4-border)' }} />
              </div>
              <span className="text-[10px]" style={{ fontFamily: 'monospace', color: 'var(--c4-text-subtle)' }}>process.log</span>
            </div>
            <div className="px-5 md:px-8 py-4 md:py-6" style={{ backgroundColor: term.bg, fontFamily: 'monospace' }}>
              {process.map((p, i) => (
                <motion.div
                  key={p.step}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.14, ease }}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-1 py-3.5"
                  style={{ borderBottom: i < process.length - 1 ? `1px solid ${'var(--c4-inverted-border)'}` : 'none' }}
                >
                  <span className="text-[10px] flex-shrink-0 tabular-nums" style={{ color: term.faint }}>[{p.step}]</span>
                  <span className="text-[12px] uppercase tracking-[0.12em] font-semibold flex-shrink-0 sm:w-24" style={{ color: term.text }}>{p.label}</span>
                  <span className="text-[12.5px] leading-[1.7] flex-1" style={{ color: term.muted }}>{p.desc}</span>
                  <span className="text-[12px] flex-shrink-0 hidden sm:block" style={{ color: term.green }}>✓</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t" style={{ borderColor: 'var(--c4-border)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <code
              className="inline-block mb-7 px-4 py-2 rounded-[3px] text-[11px]"
              style={{
                fontFamily: 'monospace',
                backgroundColor: 'var(--c4-bg-alt)',
                border: '1px solid var(--c4-border)',
                color: 'var(--c4-text-muted)',
              }}
            >
              <span style={{ color: 'var(--c4-accent)' }}>$ </span>
              c4 start --project=automation<span className="c4-caret" style={{ color: 'var(--c4-accent)' }}>▌</span>
            </code>
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-semibold tracking-[-0.03em] mb-4 max-w-[560px] mx-auto">
              Your team spends 14h a week being a database. Stop that.
            </h2>
            <p className="text-[14px] mb-10" style={{ color: 'var(--c4-text-muted)' }}>
              Tell us which process is the biggest drain. We'll scope the fix.
            </p>
            <Link
              to={createPageUrl('StartProject') + '?service=automation'}
              className="inline-flex items-center gap-2 px-8 py-4 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              Start a project
              <ArrowRight size={12} strokeWidth={2} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
