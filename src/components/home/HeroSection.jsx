import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { createPageUrl } from '@/utils';
import TypedHeading from '../c4/TypedHeading';
import CraftHeatmap from './CraftHeatmap';
import { trackEvent } from '@/lib/track';
import { useTheme } from '../c4/ThemeContext';
import { buildQuotrSrc, postQuotrTheme, preconnectQuotr } from './quotrTheme';

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
   Visual 1 — C4 logo mark drawing in
   ───────────────────────────────────────────────────────────── */
function VisualWelcome({ duration }) {
  const drawDur = Math.round(duration * 0.55);
  const monoStart = Math.round(duration * 0.45);
  const tagStart = Math.round(duration * 0.7);

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <style>{`
          .v1-stroke {
            stroke: var(--c4-accent);
            stroke-width: 1.6;
            fill: none;
            stroke-linecap: square;
            stroke-dasharray: 60;
            stroke-dashoffset: 60;
            animation: v1-draw ${drawDur}ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          .v1-mono {
            opacity: 0;
            animation: v1-fade 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
            animation-delay: ${monoStart}ms;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-weight: 600;
            font-size: 38px;
            fill: var(--c4-text);
            letter-spacing: -0.05em;
          }
          .v1-tag {
            opacity: 0;
            animation: v1-fade 360ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
            animation-delay: ${tagStart}ms;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 7px;
            letter-spacing: 0.22em;
            fill: var(--c4-text-faint);
          }
          @keyframes v1-draw { to { stroke-dashoffset: 0; } }
          @keyframes v1-fade { to { opacity: 1; } }
        `}</style>
      </defs>

      {[
        { x: 26, y: 26, dx: 1, dy: 1 },
        { x: 174, y: 26, dx: -1, dy: 1 },
        { x: 26, y: 174, dx: 1, dy: -1 },
        { x: 174, y: 174, dx: -1, dy: -1 },
      ].map((c, i) => {
        const L = 16;
        return (
          <g key={i}>
            <line className="v1-stroke" x1={c.x} y1={c.y} x2={c.x + c.dx * L} y2={c.y} />
            <line className="v1-stroke" x1={c.x} y1={c.y} x2={c.x} y2={c.y + c.dy * L} />
          </g>
        );
      })}

      <text x="100" y="112" textAnchor="middle" className="v1-mono">C4</text>
      <text x="100" y="138" textAnchor="middle" className="v1-tag">C4 STUDIOS · EST. 2022</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   REMOVED: Visuals 2–6 (VisualSplit, VisualFloorPlan,
   VisualNodeMap, VisualReceipt, VisualBars)
   Panel is now a static Quotr launcher using VisualWelcome.
   ─────────────────────────────────────────────────────────────

   Quotr panel — animated corner brackets + "press to start" CTA
   ───────────────────────────────────────────────────────────── */

const CORNER_DEFS = [
  { key: 'tl', top: 0, left: 0, borderTop: true, borderLeft: true, dx: 1, dy: 1 },
  { key: 'tr', top: 0, right: 0, borderTop: true, borderRight: true, dx: -1, dy: 1 },
  { key: 'bl', bottom: 0, left: 0, borderBottom: true, borderLeft: true, dx: 1, dy: -1 },
  { key: 'br', bottom: 0, right: 0, borderBottom: true, borderRight: true, dx: -1, dy: -1 },
];

function AnimatedCorner({ def, hovered, index }) {
  const borderStyle = {
    borderTopWidth: def.borderTop ? '1.8px' : 0,
    borderBottomWidth: def.borderBottom ? '1.8px' : 0,
    borderLeftWidth: def.borderLeft ? '1.8px' : 0,
    borderRightWidth: def.borderRight ? '1.8px' : 0,
    borderStyle: 'solid',
    borderColor: 'var(--c4-accent)',
    position: 'absolute',
    width: 22,
    height: 22,
    top: def.top !== undefined ? 14 : undefined,
    bottom: def.bottom !== undefined ? 14 : undefined,
    left: def.left !== undefined ? 14 : undefined,
    right: def.right !== undefined ? 14 : undefined,
    pointerEvents: 'none',
  };

  const amp = hovered ? 7 : 3.5;
  return (
    <motion.div
      style={borderStyle}
      animate={{
        x: [0, def.dx * amp, 0],
        y: [0, def.dy * amp, 0],
      }}
      transition={{
        duration: hovered ? 0.7 : 2.6,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: index * 0.18,
      }}
    />
  );
}

const QUOTR_SLUG = 'fixm4qeq';
const PANEL_IDLE_H = 412;   // square-ish launcher box
const PANEL_LIVE_H = 648;   // tall enough for the calculator form

function QuotrPanel() {
  const [hovered, setHovered] = useState(false);
  const [launched, setLaunched] = useState(false);
  const iframeRef = useRef(null);
  const { isDark } = useTheme();

  // Warm DNS+TLS to quotr.us before the visitor launches the calculator.
  useEffect(() => {
    preconnectQuotr();
  }, []);

  // Bake the theme into the src once so the iframe never reloads mid-form.
  const [src] = useState(() => buildQuotrSrc(QUOTR_SLUG, isDark));

  const pushTheme = useCallback(() => {
    postQuotrTheme(iframeRef.current, isDark);
  }, [isDark]);

  // Forward the site theme whenever the visitor toggles light/dark.
  useEffect(() => {
    if (launched) pushTheme();
  }, [pushTheme, launched]);

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-[3px]"
      animate={{
        height: launched ? PANEL_LIVE_H : PANEL_IDLE_H,
        scale: hovered && !launched ? 1.015 : 1,
        boxShadow:
          hovered && !launched
            ? '0 28px 70px -24px rgba(0,0,0,0.5)'
            : '0 1px 2px rgba(26,26,26,0.04)',
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {launched ? (
          /* ── Embedded Quotr calculator ── */
          <motion.div
            key="quotr-live"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full w-full flex-col"
          >
            {/* Chrome bar */}
            <div
              className="flex shrink-0 items-center justify-between border-b px-4"
              style={{ height: 44, borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }} />
                <span className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--c4-text-subtle)' }}>
                  Project Estimate
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://quotr.us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.13em] transition-colors duration-200"
                  style={{ color: 'var(--c4-text-faint)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c4-text)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c4-text-faint)')}
                >
                  Full page
                  <ArrowRight size={9} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setLaunched(false)}
                  aria-label="Close calculator"
                  className="inline-flex items-center justify-center transition-colors duration-200"
                  style={{ color: 'var(--c4-text-faint)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c4-text)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c4-text-faint)')}
                >
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Live Quotr iframe */}
            <iframe
              ref={iframeRef}
              src={src}
              onLoad={pushTheme}
              title="Lock in your price now"
              width="100%"
              style={{ display: 'block', border: 'none', flex: '1 1 auto' }}
            />
          </motion.div>
        ) : (
          /* ── Launcher box ── */
          <motion.button
            key="quotr-box"
            type="button"
            onClick={() => setLaunched(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-label="Open the Quotr instant quote calculator"
            className="relative flex h-full w-full flex-col items-stretch"
            style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
          >
            {/* Animated corner brackets */}
            {CORNER_DEFS.map((def, i) => (
              <AnimatedCorner key={def.key} def={def} hovered={hovered} index={i} />
            ))}

            {/* Top label — always visible, sits over the card backdrop */}
            <div className="relative z-10 flex items-center justify-center gap-2 pt-7">
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: 'var(--c4-accent)' }}
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span
                className="text-[11px] uppercase tracking-[0.28em] font-semibold"
                style={{ color: 'var(--c4-accent)' }}
              >
                Press here to begin
              </span>
              <motion.div
                animate={{ x: hovered ? [0, 5, 0] : 0 }}
                transition={{ duration: 1.1, repeat: hovered ? Infinity : 0, ease: 'easeInOut' }}
              >
                <ArrowRight size={13} strokeWidth={2} style={{ color: 'var(--c4-accent)' }} />
              </motion.div>
            </div>

            {/* Centred C4 mark */}
            <div className="relative z-10 flex flex-1 items-center justify-center">
              <svg viewBox="0 0 200 120" className="w-full" preserveAspectRatio="xMidYMid meet" style={{ maxHeight: '70%' }}>
                <text
                  x="100" y="64" textAnchor="middle"
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontWeight: 600,
                    fontSize: '40px',
                    fill: 'var(--c4-text)',
                    letterSpacing: '-0.04em',
                  }}
                >C4</text>
                <text
                  x="100" y="90" textAnchor="middle"
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: '7px',
                    letterSpacing: '0.22em',
                    fill: 'var(--c4-text-faint)',
                  }}
                >STUDIOS · EST. 2022</text>
              </svg>
            </div>

            {/* Bottom caption */}
            <div
              className="relative z-10 pb-6 text-center text-[9px] tracking-[0.22em]"
              style={{ color: 'var(--c4-text-faint)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}
            >
              QUOTR · INSTANT QUOTE · ~2 MIN
            </div>

            {/* Hover wash */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ backgroundColor: 'color-mix(in srgb, var(--c4-accent) 6%, transparent)' }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Mobile Quotr — full-screen sheet opened by a tap on phones
   ───────────────────────────────────────────────────────────── */
function MobileQuotrModal({ open, onClose }) {
  const iframeRef = useRef(null);
  const { isDark } = useTheme();
  const [src] = useState(() => buildQuotrSrc(QUOTR_SLUG, isDark));

  // Warm DNS+TLS to quotr.us before the visitor opens the calculator.
  useEffect(() => {
    preconnectQuotr();
  }, []);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ backgroundColor: 'var(--c4-bg)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Instant quote calculator"
        >
          <div
            className="flex shrink-0 items-center justify-between border-b px-5"
            style={{ height: 52, borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }} />
              <span className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--c4-text-subtle)' }}>
                Project Estimate
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close calculator"
              className="inline-flex items-center justify-center"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src={src}
            onLoad={() => postQuotrTheme(iframeRef.current, isDark)}
            title="Lock in your price now"
            className="flex-1 w-full"
            style={{ display: 'block', border: 'none' }}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* eslint-disable no-unused-vars */
// Visuals 2–6 removed — panel is now a static Quotr launcher.
function VisualSplit({ duration }) {
  const rows = ['Intake', 'CRM', 'Automation', 'Portal', 'Dashboard', 'AI Drafting'];
  const stagger = 60;
  const rowStart = Math.round(duration * 0.25);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <style>{`
        @keyframes v2-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes v2-slide-in { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes v2-block-draw { from { opacity: 0; transform: scaleY(0.2); transform-origin: top; } to { opacity: 1; transform: scaleY(1); } }
        .v2-left, .v2-right { animation: v2-fade-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .v2-block { animation: v2-block-draw 380ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .v2-row { animation: v2-slide-in 360ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .v2-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
      `}</style>

      <div className="grid h-full grid-cols-[3fr_7fr]">
        {/* LEFT — WEBSITE 30% */}
        <div
          className="v2-left relative flex flex-col gap-2 p-4"
          style={{ backgroundColor: 'var(--c4-bg-alt)', borderRight: '1px solid var(--c4-border)' }}
        >
          <div className="v2-mono mb-1" style={{ color: 'var(--c4-text-faint)' }}>
            WEBSITE · 30%
          </div>
          <div
            className="v2-block h-3 rounded-[1px]"
            style={{ backgroundColor: 'var(--c4-text)', animationDelay: `${Math.round(duration * 0.1)}ms` }}
          />
          <div
            className="v2-block h-1.5 w-4/5 rounded-[1px]"
            style={{ backgroundColor: 'var(--c4-border)', animationDelay: `${Math.round(duration * 0.15)}ms` }}
          />
          <div
            className="v2-block h-1.5 w-3/5 rounded-[1px]"
            style={{ backgroundColor: 'var(--c4-border)', animationDelay: `${Math.round(duration * 0.18)}ms` }}
          />
          <div
            className="v2-block mt-auto h-5 w-16 rounded-[1px]"
            style={{ backgroundColor: 'var(--c4-accent)', animationDelay: `${Math.round(duration * 0.25)}ms` }}
          />
        </div>

        {/* RIGHT — SYSTEMS 70% */}
        <div
          className="v2-right relative flex flex-col gap-1.5 p-4"
          style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
        >
          <div className="v2-mono mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
            SYSTEMS · 70%
          </div>
          {rows.map((label, i) => (
            <div
              key={label}
              className="v2-row flex items-center gap-2 py-1"
              style={{
                animationDelay: `${rowStart + i * stagger}ms`,
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="v2-mono" style={{ color: 'rgba(255,255,255,0.42)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-medium tracking-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
                {label}
              </span>
              <span className="ml-auto h-px flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Visual 3 — Architectural floor plan (building elevation)
   ───────────────────────────────────────────────────────────── */
function VisualFloorPlan({ duration }) {
  const left = 36, right = 164, top = 28, bottom = 168;
  const rows = 6;
  const cols = 4;
  const rowStep = (bottom - top) / rows;
  const colStep = (right - left) / cols;

  const horizontals = Array.from({ length: rows + 1 }, (_, i) => ({
    x1: left, y1: top + i * rowStep, x2: right, y2: top + i * rowStep,
  }));
  const verticals = Array.from({ length: cols + 1 }, (_, i) => ({
    x1: left + i * colStep, y1: top, x2: left + i * colStep, y2: bottom,
  }));

  const rectDur = Math.round(duration * 0.3);
  const linesStart = rectDur;
  const linesDur = Math.round(duration * 0.5);
  const interior = [...horizontals.slice(1, -1), ...verticals.slice(1, -1)];
  const lineStagger = Math.round(linesDur / Math.max(1, interior.length));
  const squareStart = linesStart + linesDur - 40;
  const labelStart = squareStart + 160;

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <style>{`
        .v3-rect, .v3-line {
          stroke: var(--c4-text);
          fill: none;
          stroke-linecap: square;
        }
        .v3-rect {
          stroke-width: 1.4;
          stroke-dasharray: 560;
          stroke-dashoffset: 560;
          animation: v3-draw ${rectDur}ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .v3-line {
          stroke-width: 0.7;
          opacity: 0.42;
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: v3-draw ${Math.round(linesDur * 0.5)}ms ${ease} forwards;
        }
        .v3-square {
          opacity: 0;
          animation: v3-pop 320ms ${ease} forwards;
          animation-delay: ${squareStart}ms;
        }
        .v3-label, .v3-corner {
          opacity: 0;
          animation: v3-fade 340ms ${ease} forwards;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          fill: var(--c4-text-faint);
        }
        .v3-label {
          animation-delay: ${labelStart}ms;
          font-size: 7px;
          letter-spacing: 0.22em;
        }
        .v3-corner {
          animation-delay: ${labelStart - 80}ms;
          font-size: 6px;
          letter-spacing: 0.16em;
        }
        @keyframes v3-draw { to { stroke-dashoffset: 0; } }
        @keyframes v3-pop {
          0% { opacity: 0; transform: scale(0.3); transform-origin: 100px 156px; }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes v3-fade { to { opacity: 1; } }
      `}</style>

      <rect className="v3-rect" x={left} y={top} width={right - left} height={bottom - top} />
      {interior.map((l, i) => (
        <line
          key={i}
          className="v3-line"
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          style={{ animationDelay: `${linesStart + i * lineStagger}ms` }}
        />
      ))}

      {/* entrance / red marker at ground floor centre */}
      <rect
        className="v3-square"
        x={left + colStep * 1.5 + 2}
        y={bottom - rowStep + 4}
        width={colStep - 4}
        height={rowStep - 8}
        fill="var(--c4-accent)"
        opacity="0.85"
      />

      <text className="v3-corner" x={left} y={top - 6}>SHEET · 01</text>
      <text className="v3-label" x="100" y="188" textAnchor="middle">SECTION A · 1:200</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Visual 4 — System node map (Hero3 layout)
   ───────────────────────────────────────────────────────────── */
function VisualNodeMap({ duration }) {
  const w = 46, h = 16;
  const nodes = [
    { id: 'Website',    cx: 50,  cy: 40 },
    { id: 'Intake',     cx: 110, cy: 28 },
    { id: 'CRM',        cx: 165, cy: 60 },
    { id: 'Automation', cx: 105, cy: 100, accent: true },
    { id: 'Portal',     cx: 165, cy: 138 },
    { id: 'Dashboard',  cx: 45,  cy: 160 },
    { id: 'Database',   cx: 110, cy: 174 },
  ];
  const edges = [
    ['Website', 'Intake'],
    ['Intake', 'CRM'],
    ['Website', 'Automation'],
    ['CRM', 'Automation'],
    ['Automation', 'Portal'],
    ['Automation', 'Dashboard'],
    ['Automation', 'Database'],
    ['Database', 'Portal'],
  ];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const linesDur = Math.round(duration * 0.5);
  const lineStagger = Math.round(linesDur / edges.length);
  const nodesStart = Math.round(duration * 0.22);
  const nodeStagger = Math.round((duration * 0.6) / nodes.length);

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <style>{`
        .v4-edge {
          stroke: var(--c4-text-subtle);
          stroke-width: 0.65;
          fill: none;
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: v4-draw ${Math.round(linesDur * 0.7)}ms ${ease} forwards;
          opacity: 0.55;
        }
        .v4-node {
          opacity: 0;
          animation: v4-fade 320ms ${ease} forwards;
        }
        .v4-rect {
          stroke: var(--c4-text);
          stroke-width: 0.9;
          fill: var(--c4-card-bg);
        }
        .v4-rect.accent {
          stroke: var(--c4-accent);
          fill: var(--c4-accent);
        }
        .v4-text {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 6.5px;
          letter-spacing: 0.04em;
          fill: var(--c4-text);
          text-anchor: middle;
          font-weight: 600;
        }
        .v4-text.accent { fill: var(--c4-bg); }
        .v4-corner {
          opacity: 0;
          animation: v4-fade 360ms ${ease} forwards;
          animation-delay: ${nodesStart + nodes.length * nodeStagger}ms;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 6px;
          letter-spacing: 0.18em;
          fill: var(--c4-text-faint);
        }
        @keyframes v4-draw { to { stroke-dashoffset: 0; } }
        @keyframes v4-fade { to { opacity: 1; } }
      `}</style>

      {edges.map(([from, to], i) => {
        const a = byId[from], b = byId[to];
        return (
          <line
            key={i}
            className="v4-edge"
            x1={a.cx}
            y1={a.cy}
            x2={b.cx}
            y2={b.cy}
            style={{ animationDelay: `${i * lineStagger}ms` }}
          />
        );
      })}

      {nodes.map((n, i) => (
        <g key={n.id} className="v4-node" style={{ animationDelay: `${nodesStart + i * nodeStagger}ms` }}>
          <rect
            className={`v4-rect ${n.accent ? 'accent' : ''}`}
            x={n.cx - w / 2}
            y={n.cy - h / 2}
            width={w}
            height={h}
            rx="1"
          />
          <text className={`v4-text ${n.accent ? 'accent' : ''}`} x={n.cx} y={n.cy + 2.2}>
            {n.id}
          </text>
        </g>
      ))}

      <text className="v4-corner" x="10" y="14">SHEET · SYS-001</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Visual 5 — Subscription receipt stack
   ───────────────────────────────────────────────────────────── */
function VisualReceipt({ duration }) {
  const items = [
    ['CRM', '$149/mo'],
    ['Booking app', '$89/mo'],
    ['E-sign', '$45/mo'],
    ['Portal', '$120/mo'],
    ['Forms', '$39/mo'],
    ['Workflow', '$199/mo'],
    ['Reporting', '$79/mo'],
  ];
  const itemsDur = Math.round(duration * 0.7);
  const stagger = Math.round(itemsDur / items.length);
  const finalStart = items.length * stagger + 100;

  return (
    <div className="relative flex h-full w-full flex-col p-3.5">
      <style>{`
        @keyframes v5-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes v5-strike { from { width: 0; } to { width: 100%; } }
        @keyframes v5-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .v5-row { animation: v5-fade 320ms ${ease} both; position: relative; }
        .v5-strike {
          position: absolute;
          left: 0;
          top: 50%;
          height: 1px;
          background-color: var(--c4-text-faint);
          animation: v5-strike 220ms ${ease} both;
        }
        .v5-final { animation: v5-slide-up 360ms ${ease} both; animation-delay: ${finalStart}ms; }
        .v5-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 10px;
          letter-spacing: 0.02em;
        }
      `}</style>

      <div
        className="v5-mono mb-2 flex items-center justify-between pb-1.5"
        style={{ color: 'var(--c4-text-faint)', borderBottom: '1px dashed var(--c4-border)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}
      >
        <span>Stack invoice</span>
        <span>QTY · MO</span>
      </div>

      <div className="flex flex-col gap-[2px]">
        {items.map(([label, price], i) => (
          <div
            key={label}
            className="v5-row v5-mono flex items-center justify-between px-2 py-1"
            style={{
              animationDelay: `${i * stagger}ms`,
              color: 'var(--c4-text-muted)',
              backgroundColor: 'var(--c4-card-bg)',
              border: '1px solid var(--c4-border)',
              transform: `translateX(${i * 4}px)`,
            }}
          >
            <span>{label}</span>
            <span style={{ color: 'var(--c4-accent)' }}>{price}</span>
            <span className="v5-strike" style={{ animationDelay: `${i * stagger + 180}ms` }} />
          </div>
        ))}
      </div>

      <div
        className="v5-final v5-mono mt-auto flex items-center justify-between px-2.5 py-2"
        style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)', fontWeight: 600 }}
      >
        <span>C4 Operations System</span>
        <span style={{ color: 'var(--c4-accent)' }}>$0/mo</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Visual 6 — Bar chart of admin hours
   ───────────────────────────────────────────────────────────── */
function VisualBars({ duration }) {
  const values = [28, 35, 42, 48, 51, 58, 63, 67];
  const stagger = 80;
  const labelsStart = Math.round(duration * 0.1);

  return (
    <div className="relative flex h-full w-full flex-col p-3.5">
      <style>{`
        @keyframes v6-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes v6-fade { from { opacity: 0; } to { opacity: 1; } }
        .v6-bar { transform-origin: bottom; animation: v6-grow 420ms ${ease} both; }
        .v6-label { animation: v6-fade 380ms ${ease} both; animation-delay: ${labelsStart}ms; }
        .v6-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
      `}</style>

      <div className="v6-label v6-mono mb-2 flex items-center justify-between" style={{ color: 'var(--c4-text-faint)' }}>
        <span>HRS SAVED</span>
        <span>14h / wk</span>
      </div>

      <div className="relative flex flex-1 items-end gap-[6px]" style={{ borderBottom: '1px solid var(--c4-border)', borderLeft: '1px solid var(--c4-border)', paddingLeft: 4 }}>
        {values.map((v, i) => {
          const isLast = i === values.length - 1;
          return (
            <div
              key={i}
              className="v6-bar relative flex-1"
              style={{
                height: `${v}%`,
                backgroundColor: isLast ? 'var(--c4-accent)' : 'var(--c4-text)',
                animationDelay: `${i * stagger}ms`,
              }}
            />
          );
        })}
      </div>

      <div className="v6-label v6-mono mt-2 text-center" style={{ color: 'var(--c4-text-faint)' }}>
        LAST 8 WEEKS
      </div>
    </div>
  );
}

/* eslint-enable no-unused-vars */

/* ─────────────────────────────────────────────────────────────
   Hero
   ───────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const ref = useRef(null);
  const [quotrModalOpen, setQuotrModalOpen] = useState(false);
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
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-center lg:gap-16">
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
                  className="max-w-[14ch] text-[clamp(2.65rem,6vw,5.4rem)] font-semibold tracking-[-0.06em] leading-[0.96]"
                  style={{ color: 'var(--c4-text)', textWrap: 'balance' }}
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

              {/* Mobile-only Quotr launcher — desktop uses the side panel */}
              <motion.button
                type="button"
                onClick={() => { trackEvent('hero_cta_click', { target: 'quotr' }); setQuotrModalOpen(true); }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 1.3 }}
                className="lg:hidden mt-5 inline-flex items-center gap-2.5 self-start rounded-full px-5 py-2.5"
                style={{
                  border: '1px solid var(--c4-border)',
                  backgroundColor: 'var(--c4-card-bg)',
                  color: 'var(--c4-text)',
                }}
                aria-label="Open the instant quote calculator"
              >
                <motion.span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--c4-accent)' }}
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="text-[11px] uppercase tracking-[0.16em] font-semibold">
                  Get an instant quote
                </span>
                <ArrowRight size={13} strokeWidth={2} style={{ color: 'var(--c4-accent)' }} />
              </motion.button>
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.9, ease }}
              className="hidden w-full lg:block"
            >
              <QuotrPanel />
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

      <MobileQuotrModal open={quotrModalOpen} onClose={() => setQuotrModalOpen(false)} />
    </section>
  );
}
