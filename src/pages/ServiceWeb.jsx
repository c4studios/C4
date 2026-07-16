/**
 * /ServiceWeb — C1 · Web & Applications.
 *
 * Arm identity: "Issued for Construction" — structural documentation
 * in daylight. Reference: Centre Pompidou's expressed structure ×
 * USM Haller / tower-crane gantry yellow. Every package is drawn as a
 * scaled structure elevation: the silhouette tells you the scope
 * before you read a word. All package facts render from
 * src/data/pricing.js (single source of truth — fixes the audited
 * data drift), with only delivery timelines kept as page metadata.
 *
 * Motion: CSS-only. Content is fully visible by default; the .wa-armed
 * class (added on mount, never under prefers-reduced-motion or the
 * Prerender UA) arms hero keyframes, an SVG line-draw, and
 * IntersectionObserver scroll reveals. Styles live in
 * src/components/web-arm/web-arm.css, scoped under .wa-root.
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import {
  webPackageSections,
  webPricingGuides,
  webScopeNotes,
  subscriptionInfo,
  ASTERISK_CLAUSE,
  GST_NOTE,
  INDUSTRY_SURCHARGE_NOTE,
} from '@/data/pricing';
import '../components/web-arm/web-arm.css';

const START = createPageUrl('StartProject');

/* Delivery windows are page metadata (they don't exist in pricing.js).
   The six original windows are preserved verbatim; proposal-scoped
   tiers say so instead of inventing a number. */
const TIMELINES = {
  starter: '1–2 weeks',
  brochure: '2–3 weeks',
  business: '3–4 weeks',
  custom: '4–6 weeks',
  'commerce-starter': '4–6 weeks',
  'web-application': '5–8 weeks',
  growth: 'By proposal',
  platform: 'By proposal',
};

const INCLUDED = [
  'Mobile-first responsive layout',
  'Basic SEO setup',
  'Performance optimised',
  'Cross-browser tested',
  'Founder reply within 1 business day',
  'Full code handover — you own it',
];

/* Four real stages — the one sequence on the page that earns its
   numbers. Bar spans are relative programme positions, not promises. */
const PROCESS = [
  { num: '01', label: 'Brief', desc: 'You describe the outcome you need. We ask the right questions.', bar: [0, 14] },
  { num: '02', label: 'Design', desc: 'Wireframes and visual designs — reviewed and approved before build.', bar: [11, 26] },
  { num: '03', label: 'Build', desc: 'Clean code, responsive layout, tested across devices.', bar: [34, 44] },
  { num: '04', label: 'Launch', desc: 'Deployment, DNS, analytics, and a handover guide.', bar: [76, 24] },
];

/* Sections with a running schedule reference (W·01…W·08) across
   groups. webPricingGuides is parallel to webPackageSections
   (base / ecommerce / apps) — zipped by index. */
const SECTIONS = (() => {
  let n = 0;
  return webPackageSections.map((section, i) => ({
    ...section,
    guide: webPricingGuides[i],
    packages: section.packages.map((pkg) => {
      n += 1;
      return { ...pkg, ref: `W·${String(n).padStart(2, '0')}` };
    }),
  }));
})();

/* Stable module-level ref so the head hook doesn't re-run each render. */
const WEB_JSONLD = [
  serviceSchema({
    name: 'Web Design & Development',
    description:
      'Custom websites, web apps, SaaS platforms and ecommerce stores for Perth businesses — built to convert and designed to last.',
    url: '/ServiceWeb',
    serviceType: 'Web design and development',
  }),
  breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Web & Applications', path: '/ServiceWeb' },
  ]),
];

/* ── Structure elevations ─────────────────────────────────────────
   Each package drawn as a scaled elevation: more storeys and bays as
   the scope grows. Ink linework, one gantry-yellow element each. */

function Ground() {
  return (
    <g>
      <line x1="6" y1="76" x2="114" y2="76" strokeWidth="2" />
      {[18, 34, 50, 66, 82, 98].map((x) => (
        <line key={x} x1={x} y1="76" x2={x - 7} y2="83" strokeWidth="1" />
      ))}
    </g>
  );
}

const ELEVATIONS = {
  /* Landing Page — a single-bay pavilion. */
  starter: (
    <>
      <line x1="38" y1="76" x2="38" y2="48" />
      <line x1="82" y1="76" x2="82" y2="48" />
      <line x1="32" y1="48" x2="88" y2="48" strokeWidth="2" />
      <line x1="32" y1="48" x2="32" y2="53" />
      <line x1="88" y1="48" x2="88" y2="53" />
      <rect x="55" y="60" width="11" height="16" fill="var(--wa-yellow)" stroke="none" />
    </>
  ),
  /* Brochure Site — one long storey, five bays. */
  brochure: (
    <>
      <line x1="10" y1="52" x2="110" y2="52" strokeWidth="2" />
      {[12, 36, 60, 84, 108].map((x) => (
        <line key={x} x1={x} y1="76" x2={x} y2="52" />
      ))}
      <line x1="10" y1="57" x2="110" y2="57" strokeWidth="1" />
      <rect x="61.5" y="58" width="21" height="18" fill="var(--wa-yellow)" stroke="none" />
    </>
  ),
  /* Business Website — two storeys, three bays, entry canopy. */
  business: (
    <>
      {[24, 52, 80, 108].map((x) => (
        <line key={x} x1={x} y1="76" x2={x} y2="28" />
      ))}
      <line x1="20" y1="28" x2="112" y2="28" strokeWidth="2" />
      <line x1="20" y1="52" x2="112" y2="52" />
      <line x1="59" y1="30" x2="59" y2="50" strokeWidth="1" />
      <line x1="66" y1="30" x2="66" y2="50" strokeWidth="1" />
      <line x1="73" y1="30" x2="73" y2="50" strokeWidth="1" />
      <rect x="10" y="59" width="15" height="4" fill="var(--wa-yellow)" stroke="none" />
      <line x1="24" y1="63" x2="24" y2="67" strokeWidth="1" />
    </>
  ),
  /* Custom Website — asymmetric volumes with a cantilever. */
  custom: (
    <>
      <line x1="22" y1="76" x2="22" y2="22" />
      <line x1="22" y1="22" x2="60" y2="22" strokeWidth="2" />
      <line x1="60" y1="76" x2="60" y2="22" />
      <line x1="32" y1="24" x2="32" y2="74" strokeWidth="1" />
      <line x1="42" y1="24" x2="42" y2="74" strokeWidth="1" />
      <line x1="52" y1="24" x2="52" y2="74" strokeWidth="1" />
      <line x1="60" y1="50" x2="104" y2="50" strokeWidth="2" />
      <line x1="104" y1="76" x2="104" y2="50" />
      <line x1="60" y1="34" x2="116" y2="34" strokeWidth="2" />
      <line x1="84" y1="50" x2="60" y2="34" strokeWidth="1" />
      <rect x="103" y="29" width="13" height="5" fill="var(--wa-yellow)" stroke="none" />
    </>
  ),
  /* Ecommerce Store — a gabled warehouse with roller doors. */
  'commerce-starter': (
    <>
      <polyline points="14,76 14,46 60,30 106,46 106,76" />
      <line x1="60" y1="30" x2="60" y2="37" strokeWidth="1" />
      <rect x="24" y="56" width="16" height="20" />
      <line x1="24" y1="62" x2="40" y2="62" strokeWidth="1" />
      <line x1="24" y1="68" x2="40" y2="68" strokeWidth="1" />
      <rect x="52" y="56" width="16" height="20" fill="var(--wa-yellow)" stroke="none" />
      <rect x="80" y="56" width="16" height="20" />
    </>
  ),
  /* Web App Starter — a three-storey block with a service core. */
  'web-application': (
    <>
      <line x1="32" y1="76" x2="32" y2="18" />
      <line x1="76" y1="76" x2="76" y2="18" />
      <line x1="32" y1="18" x2="76" y2="18" strokeWidth="2" />
      <line x1="32" y1="33" x2="76" y2="33" />
      <line x1="32" y1="48" x2="76" y2="48" />
      <line x1="32" y1="63" x2="76" y2="63" />
      <rect x="84" y="28" width="14" height="48" />
      {[36, 44, 52, 60, 68].map((y) => (
        <line key={y} x1="84" y1={y} x2="98" y2={y} strokeWidth="1" />
      ))}
      <rect x="85" y="29" width="12" height="7" fill="var(--wa-yellow)" stroke="none" />
      <line x1="54" y1="18" x2="54" y2="8" strokeWidth="1" />
      <line x1="51" y1="8" x2="57" y2="8" strokeWidth="1" />
    </>
  ),
  /* Growth Build — a four-storey frame with a roof hoist. */
  growth: (
    <>
      {[20, 48, 76, 104].map((x) => (
        <line key={x} x1={x} y1="76" x2={x} y2="20" />
      ))}
      <line x1="16" y1="20" x2="108" y2="20" strokeWidth="2" />
      <line x1="16" y1="34" x2="108" y2="34" />
      <line x1="16" y1="48" x2="108" y2="48" />
      <line x1="16" y1="62" x2="108" y2="62" />
      <line x1="20" y1="76" x2="48" y2="62" strokeWidth="1" />
      <line x1="48" y1="76" x2="20" y2="62" strokeWidth="1" />
      <rect x="49" y="21" width="26" height="12" fill="var(--wa-yellow)" stroke="none" />
      <line x1="104" y1="20" x2="115" y2="20" strokeWidth="1" />
      <line x1="112" y1="20" x2="112" y2="40" strokeWidth="1" />
      <rect x="107" y="40" width="10" height="6" fill="var(--wa-yellow)" stroke="none" />
    </>
  ),
  /* Custom Platform — podium, tower, and a tower crane. */
  platform: (
    <>
      <line x1="12" y1="76" x2="12" y2="60" />
      <line x1="12" y1="60" x2="64" y2="60" strokeWidth="2" />
      <line x1="64" y1="76" x2="64" y2="60" />
      <line x1="38" y1="76" x2="38" y2="60" strokeWidth="1" />
      <line x1="20" y1="60" x2="20" y2="10" />
      <line x1="52" y1="60" x2="52" y2="10" />
      <line x1="20" y1="10" x2="52" y2="10" strokeWidth="2" />
      <line x1="20" y1="22" x2="52" y2="22" />
      <line x1="20" y1="34" x2="52" y2="34" />
      <line x1="20" y1="46" x2="52" y2="46" />
      <rect x="21" y="11" width="30" height="6" fill="var(--wa-yellow)" stroke="none" />
      <line x1="86" y1="76" x2="86" y2="12" />
      <line x1="70" y1="12" x2="118" y2="12" strokeWidth="1" />
      <line x1="86" y1="12" x2="86" y2="4" strokeWidth="1" />
      <line x1="86" y1="4" x2="106" y2="12" strokeWidth="1" />
      <line x1="86" y1="4" x2="74" y2="12" strokeWidth="1" />
      <rect x="70" y="12" width="7" height="5" fill="currentColor" stroke="none" />
      <line x1="108" y1="12" x2="108" y2="26" strokeWidth="1" />
      <rect x="103" y="26" width="10" height="6" fill="var(--wa-yellow)" stroke="none" />
    </>
  ),
};

function Elevation({ kind }) {
  return (
    <svg
      className="wa-el"
      viewBox="0 0 120 84"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <Ground />
      {ELEVATIONS[kind] || null}
    </svg>
  );
}

/* ── Hero drawing — a frame going up in daylight ─────────────────
   Tower crane lowering a gantry-yellow beam into an expressed
   structural frame. Strokes line-draw on load (pathLength="1");
   static mode renders it complete. */

const CRANE_BRACES = Array.from({ length: 8 }, (_, i) => ({
  x1: i % 2 === 0 ? 166 : 174,
  y1: 300 - i * 28,
  x2: i % 2 === 0 ? 174 : 166,
  y2: 300 - (i + 1) * 28,
}));

const SUN_RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 * Math.PI) / 180;
  return {
    x1: (70 + Math.cos(a) * 32).toFixed(1),
    y1: (66 + Math.sin(a) * 32).toFixed(1),
    x2: (70 + Math.cos(a) * 43).toFixed(1),
    y2: (66 + Math.sin(a) * 43).toFixed(1),
  };
});

function HeroDrawing() {
  const draw = { className: 'wa-draw', pathLength: 1 };
  return (
    <svg
      viewBox="0 0 560 330"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      {/* Ground plane with survey hatching — present from frame one. */}
      <g>
        <line x1="8" y1="300" x2="552" y2="300" strokeWidth="2" />
        {Array.from({ length: 14 }, (_, i) => 22 + i * 39).map((x) => (
          <line key={x} x1={x} y1="300" x2={x - 14} y2="316" strokeWidth="1" />
        ))}
      </g>

      {/* Daylight. */}
      <g style={{ '--d': '0.1s' }}>
        <circle cx="70" cy="66" r="24" strokeWidth="2" {...draw} />
        {SUN_RAYS.map((r) => (
          <line key={r.x1 + r.y1} {...r} strokeWidth="1.5" className="wa-draw" pathLength={1} />
        ))}
      </g>

      {/* Tower crane. */}
      <g style={{ '--d': '0.25s' }}>
        <line x1="166" y1="300" x2="166" y2="70" {...draw} />
        <line x1="174" y1="300" x2="174" y2="70" {...draw} />
        {CRANE_BRACES.map((b) => (
          <line key={b.y1} {...b} strokeWidth="1" className="wa-draw" pathLength={1} />
        ))}
        <rect x="158" y="56" width="24" height="16" {...draw} />
        <line x1="174" y1="66" x2="470" y2="66" {...draw} />
        <line x1="166" y1="66" x2="84" y2="66" {...draw} />
        <line x1="170" y1="56" x2="170" y2="48" strokeWidth="1" {...draw} />
        <line x1="170" y1="48" x2="300" y2="66" strokeWidth="1" {...draw} />
        <line x1="170" y1="48" x2="430" y2="66" strokeWidth="1" {...draw} />
        <line x1="170" y1="48" x2="100" y2="66" strokeWidth="1" {...draw} />
        <rect x="84" y="66" width="20" height="14" fill="currentColor" stroke="none" className="wa-fill" style={{ '--d': '0.9s' }} />
        <rect x="294" y="66" width="12" height="7" fill="currentColor" stroke="none" className="wa-fill" style={{ '--d': '0.9s' }} />
        <line x1="300" y1="73" x2="300" y2="120" strokeWidth="1" {...draw} />
        {/* The beam being lowered into place. */}
        <rect x="270" y="120" width="60" height="13" fill="var(--wa-yellow)" stroke="none" className="wa-fill" style={{ '--d': '1.1s' }} />
        {/* Aviation light — a C4-red datum point. */}
        <circle cx="170" cy="42" r="3.5" fill="var(--wa-red)" stroke="none" className="wa-fill" style={{ '--d': '1.2s' }} />
      </g>

      {/* The frame under construction. */}
      <g style={{ '--d': '0.5s' }}>
        {[250, 320, 390, 460, 530].map((x) => (
          <line key={x} x1={x} y1="300" x2={x} y2="140" className="wa-draw" pathLength={1} />
        ))}
        <line x1="250" y1="140" x2="530" y2="140" strokeWidth="2" {...draw} />
        <line x1="250" y1="193" x2="530" y2="193" {...draw} />
        <line x1="250" y1="246" x2="530" y2="246" {...draw} />
        <line x1="252" y1="298" x2="318" y2="248" strokeWidth="1" {...draw} />
        <line x1="318" y1="298" x2="252" y2="248" strokeWidth="1" {...draw} />
        <rect x="322" y="248" width="66" height="50" fill="var(--wa-yellow)" stroke="none" className="wa-fill" style={{ '--d': '1s' }} />
        <rect x="462" y="195" width="66" height="49" fill="var(--wa-yellow)" stroke="none" className="wa-fill" style={{ '--d': '1.15s' }} />
      </g>

      {/* Dimension line with oblique ticks, and the survey benchmark. */}
      <g style={{ '--d': '0.85s' }}>
        <line x1="250" y1="140" x2="250" y2="100" strokeWidth="1" {...draw} />
        <line x1="530" y1="140" x2="530" y2="100" strokeWidth="1" {...draw} />
        <line x1="250" y1="104" x2="530" y2="104" strokeWidth="1" {...draw} />
        <line x1="245" y1="109" x2="255" y2="99" strokeWidth="1" {...draw} />
        <line x1="525" y1="109" x2="535" y2="99" strokeWidth="1" {...draw} />
        <path d="M536 300 L552 300 L544 288 Z" fill="var(--wa-red)" stroke="none" className="wa-fill" style={{ '--d': '1.25s' }} />
      </g>
    </svg>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

/* The sheet is light-committed ("structural documentation in daylight"),
   so pin the site chrome to its light tokens even for OS-dark visitors —
   the mirror of the sibling boards' force-dark. ThemeProvider re-applies
   its own tokens from a parent effect, so a guarded MutationObserver
   re-asserts for the life of the page (same pattern as ServiceAI). */
function useForceLight() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.className;
    const assertLight = () => {
      if (
        !root.classList.contains('light-mode') ||
        !root.classList.contains('wa-on-sheet') ||
        root.classList.contains('dark-mode') ||
        root.classList.contains('vivid')
      ) {
        root.classList.add('light-mode', 'wa-on-sheet');
        root.classList.remove('dark-mode', 'vivid');
      }
    };
    assertLight();
    const observer = new MutationObserver(assertLight);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer.disconnect();
      root.className = prev;
      root.classList.remove('wa-on-sheet');
    };
  }, []);
}

export default function ServiceWeb() {
  useForceLight();
  const rootRef = useRef(null);
  // 'once' = outright build price, 'monthly' = subscription alternative.
  const [billing, setBilling] = useState('once');
  const isMonthly = billing === 'monthly';

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
    title: 'Web & Applications — C4 Studios Perth',
    description:
      'Custom websites, web apps, SaaS platforms and ecommerce stores. Built to convert, designed to last. Perth-based, working Australia-wide.',
    path: '/ServiceWeb',
    jsonLd: WEB_JSONLD,
  });

  /* Fonts — Archivo variable (one profile, three extrusions), house
     pattern: injected link with cleanup. */
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
      'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900&display=swap';
    [pc1, pc2, font].forEach((el) => {
      document.head.appendChild(el);
      els.push(el);
    });
    return () => els.forEach((el) => el.remove());
  }, []);

  /* Arm entrance motion + scroll reveals. Never armed in static mode,
     so reduced-motion users and the prerenderer get the final state.
     Layout effect (the PrivateAI house pattern) arms before first
     paint, so the finished page never flashes ahead of its entrance. */
  useLayoutEffect(() => {
    if (staticMode) return undefined;
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return undefined;

    root.classList.add('wa-armed');
    const targets = root.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('wa-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    );
    const raf = requestAnimationFrame(() => targets.forEach((el) => io.observe(el)));
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      root.classList.remove('wa-armed');
    };
  }, [staticMode]);

  const monthlyNote = `${subscriptionInfo.howItWorks} ${subscriptionInfo.whatsIncluded} ${subscriptionInfo.ownership} ${subscriptionInfo.cancellation}`;

  return (
    <div className="wa-root" ref={rootRef}>
      {/* ── Hero — the drawing sheet ─────────────────────────────── */}
      <section className="wa-hero">
        <div className="wa-frame">
          <div className="wa-hero-grid">
            <div>
              {/* The single arm plate: C1, named once, as a title block. */}
              <p className="wa-titleblock wa-h-item" style={{ '--d': '0ms' }}>
                <span className="wa-tb-cell">
                  <span className="wa-tb-code">C1</span>
                  Web &amp; Applications
                </span>
                <span className="wa-tb-cell">Arm of C4 Studios</span>
                <span className="wa-tb-cell">Perth, WA — issued for construction</span>
              </p>
              <h1 className="wa-h1 wa-h-item" style={{ '--d': '80ms' }}>
                Websites built to <span className="wa-mark">convert and scale.</span>
              </h1>
              <p className="wa-lede wa-h-item" style={{ '--d': '160ms' }}>
                From a crisp landing page to a full web application — every project is
                scoped clearly, designed carefully, and delivered on time.
              </p>
              <div className="wa-hero-cta wa-h-item" style={{ '--d': '240ms' }}>
                <Link className="wa-btn" to={`${START}?service=web_design`}>
                  Start a brief
                  <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                </Link>
                <Link className="wa-link" to={createPageUrl('Portfolio')}>
                  See the work
                  <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="wa-hero-fig wa-h-item" style={{ '--d': '180ms' }}>
              <HeroDrawing />
            </div>
          </div>
        </div>
        <div className="wa-rule" aria-hidden="true" />
      </section>

      {/* ── Standard specification — included in every project ──── */}
      <section className="wa-band" data-reveal>
        <div className="wa-frame wa-band-in">
          <h2 className="wa-band-h">
            Every project
            <br />
            includes
          </h2>
          <ul className="wa-band-list">
            {INCLUDED.map((item) => (
              <li key={item}>
                <span className="wa-band-tick" aria-hidden="true">
                  <Check size={11} strokeWidth={3.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── The schedule — packages from pricing.js ─────────────── */}
      <section className="wa-sched">
        <div className="wa-frame">
          <div className="wa-sched-head" data-reveal>
            <div>
              <h2 className="wa-h2">Pick a starting point.</h2>
              <p className="wa-sub">
                Each tier drawn to scale — the silhouette is the shape of what we build.
              </p>
            </div>
            <div className="wa-switch" role="group" aria-label="Billing option">
              <span
                className="wa-switch-thumb"
                data-pos={isMonthly ? 'b' : 'a'}
                aria-hidden="true"
              />
              <button
                type="button"
                aria-pressed={!isMonthly}
                onClick={() => setBilling('once')}
              >
                Pay once
              </button>
              <button
                type="button"
                aria-pressed={isMonthly}
                onClick={() => setBilling('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* What monthly means — straight from subscriptionInfo. */}
          <div className={`wa-subnote${isMonthly ? ' is-open' : ''}`} aria-hidden={!isMonthly}>
            <div>
              <p>{monthlyNote}</p>
            </div>
          </div>

          {SECTIONS.map((section) => (
            <div className="wa-group" key={section.heading}>
              <header className="wa-plate" data-reveal>
                <div className="wa-plate-top">
                  <h3>{section.heading}</h3>
                  {section.guide && <span className="wa-range">{section.guide.range}</span>}
                </div>
                <p className="wa-plate-desc">{section.description}</p>
                {section.guide && <p className="wa-plate-guide">{section.guide.description}</p>}
              </header>

              <div className="wa-rows">
                {section.packages.map((pkg, pi) => (
                  <article
                    className="wa-row"
                    key={pkg.key}
                    data-reveal
                    style={{ '--rd': `${pi * 70}ms` }}
                  >
                    <div className="wa-row-fig" data-popular={pkg.popular ? 'true' : undefined}>
                      <Elevation kind={pkg.key} />
                      {pkg.popular && <span className="wa-tag">Most specified</span>}
                    </div>

                    <div className="wa-row-id">
                      <p className="wa-ref">{pkg.ref}</p>
                      <h4 className="wa-row-name">{pkg.name}</h4>
                      <p className="wa-row-desc">{pkg.description}</p>
                    </div>

                    <div className="wa-row-specwrap">
                      <ul className="wa-row-spec">
                        {pkg.features.map((feature) => (
                          <li key={feature}>
                            <Check size={12} strokeWidth={3} aria-hidden="true" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="wa-row-buy">
                      <p className="wa-price">
                        {isMonthly && pkg.monthlyLabel ? pkg.monthlyLabel : pkg.priceLabel}
                      </p>
                      {pkg.monthlyLabel && (
                        <p className="wa-alt">
                          {isMonthly ? `or ${pkg.priceLabel} outright` : `or ${pkg.monthlyLabel}`}
                        </p>
                      )}
                      <p className="wa-tl">{TIMELINES[pkg.key]}</p>
                      <Link
                        className="wa-row-cta"
                        to={`${START}?service=web_design&package=${pkg.key}${
                          isMonthly ? '&pricing=subscription' : ''
                        }`}
                      >
                        Start this
                        <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}

          {/* General notes — scope boundaries, like any good drawing. */}
          <aside className="wa-notes" data-reveal>
            <h3 className="wa-notes-h">General notes</h3>
            <div className="wa-notes-cols">
              {webScopeNotes.map((note) => (
                <div className="wa-note" key={note.title}>
                  <h4>{note.title}</h4>
                  <ul>
                    {note.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          <div className="wa-fine" data-reveal>
            <p>
              <span className="wa-star" aria-hidden="true">
                *
              </span>
              {ASTERISK_CLAUSE}
            </p>
            <p>{GST_NOTE}</p>
            <p>{INDUSTRY_SURCHARGE_NOTE}</p>
          </div>
        </div>
      </section>

      {/* ── The programme — brief to launch ─────────────────────── */}
      <section className="wa-prog">
        <div className="wa-frame">
          <div data-reveal>
            <h2 className="wa-h2">Brief to launch, one pipeline.</h2>
            <p className="wa-sub">Four stages on one board.</p>
          </div>

          <div className="wa-gantt">
            {PROCESS.map((stage, i) => (
              <div className="wa-stage" key={stage.num} data-reveal style={{ '--rd': `${i * 90}ms` }}>
                <div className="wa-stage-id">
                  <span className="wa-stage-num" aria-hidden="true">
                    {stage.num}
                  </span>
                  <div>
                    <h3>{stage.label}</h3>
                    <p>{stage.desc}</p>
                  </div>
                </div>
                <div className="wa-lane" aria-hidden="true">
                  <span
                    className="wa-bar"
                    style={{ left: `${stage.bar[0]}%`, width: `${stage.bar[1]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA — the yellow drench ─────────────────────── */}
      <section className="wa-cta" data-reveal>
        <div className="wa-frame wa-cta-in">
          <h2 className="wa-cta-h">Ready to build something worth showing?</h2>
          <p className="wa-cta-sub">
            Send us a brief — we&rsquo;ll scope it, price it, and come back with a clear plan.
          </p>
          <Link className="wa-btn wa-btn--onyellow" to={`${START}?service=web_design`}>
            Start a project
            <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </div>
        <div className="wa-hatch" aria-hidden="true" />
      </section>
    </div>
  );
}
