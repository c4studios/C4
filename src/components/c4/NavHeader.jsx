import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { createPageUrl } from '@/utils';
import C4Logo from './C4Logo';
import C4iWordmark from './C4iWordmark';
import ThemeToggle from './ThemeToggle';

const ease = [0.22, 1, 0.36, 1];

const serviceDropdown = [
  {
    label: 'Web & Applications',
    code: 'C1',
    page: 'ServiceWeb',
    brief: 'Custom websites, web apps & SaaS platforms',
  },
  {
    label: <C4iWordmark />,
    code: 'C2',
    page: 'C4i',
    brief: 'AI, local or cloud — private systems & automations',
  },
  {
    label: 'C4 Lens',
    code: 'C3',
    page: 'Lens',
    brief: 'Photography, video & brand identity',
  },
  {
    label: 'C4Sight',
    code: 'C4',
    page: 'Foresight',
    brief: 'Workplace AI training & workshops',
  },
];

const navLinks = [
  // Home routes to the canonical '/', not the duplicate '/Home'.
  { label: 'Home', page: 'Home', to: '/' },
  { label: 'About', page: 'About' },
  { label: 'Services', page: 'Services', hasDropdown: true },
  { label: 'Software', page: 'Software' },
  { label: 'Portfolio', page: 'Portfolio' },
];

/* ── The back ribbon: hierarchical parent map ─────────────────────────
   Keys are lowercased pathnames (React Router matches case-insensitively,
   so /Lens and /lens both resolve here). The label always tells the truth
   about where the ribbon leads. Everything unlisted falls through to the
   home fallback — the "ALWAYS-back, never a dead end" guarantee. */
const RIBBON_PARENTS = {
  '/ai-training-for-business': { to: '/Foresight', label: 'C4Sight' },
  '/ai-training-for-schools': { to: '/Foresight', label: 'C4Sight' },
  '/ai-training-for-law-firms': { to: '/Foresight', label: 'C4Sight' },
};
const RIBBON_SOFTWARE_PARENT = { to: '/software', label: 'Software' };
const RIBBON_DEFAULT = { to: '/', label: 'C4' };

/* Resolve the ribbon's hierarchical parent from the lowercased pathname.
   SoftwareProduct ships in two URL shapes: the SPA settles on the ?slug=
   query form (/softwareproduct), but the sitemap + prerenderer publish the
   path form (/SoftwareProduct/<slug>). Match the /softwareproduct PREFIX so
   the crawlable back-link resolves to /software in BOTH shapes — per memo §3,
   "SoftwareProduct (any slug/param) → /software" — instead of falling through
   to the home default under the crawler / on a no-JS deep link. */
function resolveBackParent(pathLower) {
  if (RIBBON_PARENTS[pathLower]) return RIBBON_PARENTS[pathLower];
  if (pathLower.startsWith('/softwareproduct')) return RIBBON_SOFTWARE_PARENT;
  return RIBBON_DEFAULT;
}

/* Injected once by NavHeader (nav owns NavHeader.jsx + Footer.jsx, no CSS
   file). Defines the back-ribbon and the crawlable index-sheet reveal.
   Tokens --c4-back-surface / --c4-back-ink are the ONLY handles arms may
   re-point under their marker class; the edge/elevation treatment per
   chrome mode is nav's to own. Computed red/white pair: #C23030 on
   #F7F5F2 → 5.13:1 (label legibility is internal to the ribbon). */
const NAV_CSS = `
:root {
  --c4-back-surface: #C23030;
  --c4-back-ink: #F7F5F2;
  --c4-back-elev:
    drop-shadow(0 1px 1px rgba(0, 0, 0, 0.16))
    drop-shadow(0 0 0.6px rgba(0, 0, 0, 0.42));
  --c4-back-ring: rgba(26, 26, 26, 0.55);
}
:root.cw-on-board,
:root.sg-on-board {
  --c4-back-elev:
    drop-shadow(0 9px 18px rgba(0, 0, 0, 0.55))
    drop-shadow(0 0 0.7px rgba(236, 231, 222, 0.32));
  --c4-back-ring: rgba(236, 231, 222, 0.7);
}

/* Back ribbon — fixed inside the top-left keep-out zone, above the header,
   persists when the header hides on scroll. A real crawlable <Link>. */
.c4-back-ribbon {
  position: fixed;
  top: 0;
  left: clamp(16px, 4vw, 40px);
  z-index: 60;
  display: inline-flex;
  text-decoration: none;
  outline: none;
  border-radius: 2px;
  -webkit-tap-highlight-color: transparent;
  animation: c4-ribbon-reveal 0.25s cubic-bezier(0.23, 1, 0.32, 1);
}
.c4-back-ribbon.is-static {
  animation: none;
}
.c4-back-ribbon-body {
  display: inline-flex;
  align-items: flex-start;
  gap: 9px;
  min-width: 84px;
  min-height: 84px;
  padding: 22px 20px 26px;
  color: var(--c4-back-ink);
  /* grosgrain — fine 2px transverse ribs across the woven band */
  background:
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.11) 0px,
      rgba(0, 0, 0, 0.11) 1px,
      rgba(255, 255, 255, 0.055) 1px,
      rgba(255, 255, 255, 0.055) 2px
    ),
    var(--c4-back-surface);
  filter: var(--c4-back-elev);
  /* swallowtail: forked tail dipping below the header line */
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 11px), 0 100%);
  transform-origin: top center;
  animation: c4-ribbon-settle 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}
.c4-back-ribbon.is-static .c4-back-ribbon-body {
  animation: none;
}
.c4-back-ribbon-arrow {
  font-size: 15px;
  line-height: 1;
  font-weight: 500;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.c4-back-ribbon-label {
  font-size: 14px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-feature-settings: "tnum" 1;
}
@media (hover: hover) {
  .c4-back-ribbon:hover .c4-back-ribbon-arrow { transform: translateX(-3px); }
  .c4-back-ribbon:hover .c4-back-ribbon-body { filter: var(--c4-back-elev) brightness(1.05); }
}
.c4-back-ribbon:focus-visible {
  outline: 2px solid var(--c4-back-ring);
  outline-offset: 3px;
}
@keyframes c4-ribbon-reveal {
  from { clip-path: inset(0 0 100% 0); }
  to   { clip-path: inset(0 -40px -40px -40px); }
}
@keyframes c4-ribbon-settle {
  0%   { transform: rotate(0.8deg); }
  60%  { transform: rotate(-0.35deg); }
  100% { transform: rotate(0deg); }
}
@media (max-width: 640px) {
  .c4-back-ribbon-body {
    min-height: 76px;
    padding: 19px 14px 22px;
    gap: 7px;
  }
  .c4-back-ribbon-label { letter-spacing: 0.08em; }
}
@media (prefers-reduced-motion: reduce) {
  .c4-back-ribbon,
  .c4-back-ribbon-body { animation: none !important; }
  .c4-back-ribbon-arrow { transition: none !important; }
}

/* Header logo clears the top-left keep-out zone so it never sits beneath the
   fixed back-ribbon (§3 — the ribbon owns that corner). Below md the header
   row is just the logo + menu button, so a flat clear works. From md up the
   row also carries the nav + Start-a-Project CTA, so the reserve is bounded
   two ways: it tapers UP from zero at the md breakpoint (so it never eats the
   tightly-packed narrow-desktop row and shoves the nav off), and tapers DOWN
   again once the centred max-w container has itself carried the logo clear of
   the ribbon on wide screens (no pointless mid-canvas drift). The reserve
   always stays smaller than the width gained past 768px, so the nav/CTA are
   never pushed off-canvas. Applied only while the ribbon is shown (sub-pages);
   Home keeps its far-left logo. Padding, not transform — the nav must reflow
   around the reserve — and left static (no layout animation) per the motion
   budget. Two-class selector so it wins over the base .c4-header-logo-link. */
.c4-header-logo-link.c4-logo-cleared { padding-left: 120px; }
@media (min-width: 768px) {
  .c4-header-logo-link.c4-logo-cleared {
    padding-left: clamp(
      0px,
      min(calc((100vw - 768px) * 0.3), calc(176px - max(0px, (100vw - 1400px) / 2))),
      176px
    );
  }
}

/* Index-sheet (Services) — the panel is ALWAYS in the DOM so its anchors
   stay crawlable and prerender-visible; open state is a clip-path unfold,
   never a conditional unmount. */
.c4-svc-panel {
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  width: 340px;
  transform: translateX(-50%);
  border-radius: 3px;
  overflow: hidden;
  background: var(--c4-nav-scrolled);
  backdrop-filter: blur(16px) saturate(130%);
  border: 1px solid var(--c4-border-light);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
  clip-path: inset(0 0 100% 0);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: clip-path 0.34s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.2s ease,
              visibility 0s linear 0.34s;
}
.c4-svc-wrap.is-open .c4-svc-panel {
  clip-path: inset(0 0 0 0);
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition: clip-path 0.34s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.2s ease,
              visibility 0s;
}
.c4-svc-item {
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.24s ease, transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}
.c4-svc-wrap.is-open .c4-svc-item { opacity: 1; transform: none; }
.c4-svc-wrap.is-open .c4-svc-item:nth-child(1) { transition-delay: 0.04s; }
.c4-svc-wrap.is-open .c4-svc-item:nth-child(2) { transition-delay: 0.08s; }
.c4-svc-wrap.is-open .c4-svc-item:nth-child(3) { transition-delay: 0.12s; }
.c4-svc-wrap.is-open .c4-svc-item:nth-child(4) { transition-delay: 0.16s; }
.c4-svc-item-link:focus-visible {
  outline: 2px solid var(--c4-ring);
  outline-offset: -2px;
}
/* The clip-path unfold honours reduced-motion (memo §6): open/close is
   instant, anchors stay present and crawlable either way. The framer-motion
   pieces (mobile sheet, chevrons) are already reduced via App's MotionConfig
   reducedMotion="user"; these CSS transitions are the remaining surface. */
@media (prefers-reduced-motion: reduce) {
  .c4-svc-panel,
  .c4-svc-item { transition: none !important; }
}

/* Start-a-Project header CTA — the one red object on the right edge. */
.c4-nav-cta {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--c4-back-ink);
  background: var(--c4-accent);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              background-color 0.3s ease, box-shadow 0.3s ease;
}
@media (hover: hover) {
  .c4-nav-cta:hover {
    background: var(--c4-accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 12px 26px -14px rgba(194, 48, 48, 0.7);
  }
}
.c4-nav-cta:active { transform: translateY(0) scale(0.98); }
.c4-nav-cta:focus-visible {
  outline: 2px solid var(--c4-back-ring);
  outline-offset: 3px;
}
`;

export default function NavHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  // Prerender crawler + reduced-motion users get the ribbon fully rendered,
  // no reveal animation. Computed once; the ribbon's default state is already
  // fully visible, so this only suppresses the entrance wipe.
  const [staticMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    const ua = window.navigator?.userAgent || '';
    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return /Prerender/i.test(ua) || reduced;
  });
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();
  const triggerRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const closeTimer = useRef(null);
  const prevPathRef = useRef(null);

  const pathLower = location.pathname.toLowerCase();
  const isLens = pathLower === '/lens';
  const isHome = location.pathname === '/';
  const backParent = resolveBackParent(pathLower);

  // Lens locks the header visible (moot — the header is not rendered there —
  // but kept for parity with any case-variant path).
  const lockVisible = isLens;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious();
    setScrolled(latest > 30);
    setHidden(!lockVisible && latest > prev && latest > 120);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close menus when navigating.
  useEffect(() => {
    setServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  // Track the previous in-app pathname so the ribbon can offer a history
  // shortcut (navigate(-1) preserves scroll) when the mapped parent is
  // exactly where the visitor just came from. The cleanup closure captures
  // the path being LEFT, so during the next page's life this ref holds the
  // prior location — exactly what the shortcut compares against at click time.
  useEffect(() => {
    return () => { prevPathRef.current = location.pathname; };
  }, [location.pathname]);

  // Dismiss the services index-sheet on Escape or a click/tap outside it.
  useEffect(() => {
    if (!servicesOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) setServicesOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [servicesOpen]);

  const handleDropdownEnter = () => {
    clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };

  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  // History shortcut: if the visitor arrived from the mapped parent, go back
  // (preserving scroll); otherwise let the <Link> navigate to the parent.
  const handleBack = (e) => {
    const prev = prevPathRef.current;
    if (prev && prev.toLowerCase() === backParent.to.toLowerCase()) {
      e.preventDefault();
      navigate(-1);
    }
  };

  const svcItems = () => (panelRef.current
    ? Array.from(panelRef.current.querySelectorAll('a[data-svc-item]'))
    : []);

  const onTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setServicesOpen(true);
      requestAnimationFrame(() => svcItems()[0]?.focus());
    }
  };

  const onPanelKeyDown = (e) => {
    const items = svcItems();
    if (!items.length) return;
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      (items[idx + 1] || items[0]).focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      (items[idx - 1] || items[items.length - 1]).focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1].focus();
    } else if (e.key === 'Escape') {
      setServicesOpen(false);
      buttonRef.current?.focus();
    }
  };

  // Lens owns bespoke chrome and renders its own leader tab; the shared
  // header (and its ribbon) must not appear there. Exact route check.
  if (isLens) return null;

  const showRibbon = !isHome && !mobileOpen;

  return (
    <>
      <style>{NAV_CSS}</style>

      {showRibbon && (
        <Link
          key={location.pathname}
          to={backParent.to}
          onClick={handleBack}
          data-c4-chrome="back-ribbon"
          className={`c4-back-ribbon${staticMode ? ' is-static' : ''}`}
          aria-label={`Back to ${backParent.label}`}
        >
          <span className="c4-back-ribbon-body">
            <span className="c4-back-ribbon-arrow" aria-hidden="true">←</span>
            <span className="c4-back-ribbon-label">{backParent.label}</span>
          </span>
        </Link>
      )}

      <motion.header
        animate={{ y: hidden && !mobileOpen ? -80 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        data-c4-chrome="header"
        className="fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-500"
        style={{
          backgroundColor: scrolled ? 'var(--c4-nav-scrolled)' : 'var(--c4-nav-idle)',
          backdropFilter: scrolled ? 'blur(12px) saturate(126%)' : 'blur(8px) saturate(118%)',
          borderBottom: scrolled ? '1px solid var(--c4-border-light)' : '1px solid var(--c4-nav-idle-border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          {/* Header content clears the top-left keep-out zone: the ribbon owns
              that corner, so on sub-pages the logo reserves clearance via
              .c4-logo-cleared (see NAV_CSS) rather than sitting under it. */}
          <div className="flex items-center justify-between h-[60px] md:h-[72px]">
            <Link
              to="/"
              className={`c4-header-logo-link relative flex items-center justify-center py-1${showRibbon ? ' c4-logo-cleared' : ''}`}
            >
              <C4Logo size={48} variant="full" context="header" className="c4-header-logo-lockup" />
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map(link => (
                link.hasDropdown ? (
                  <div
                    key={link.page}
                    className={`c4-svc-wrap relative${servicesOpen ? ' is-open' : ''}`}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                    ref={triggerRef}
                  >
                    {/* Services is a menu, not a page: clicking opens the
                        index sheet rather than routing to a standalone
                        overview. The panel below stays mounted (crawlable)
                        and is revealed with a clip-path unfold. */}
                    <button
                      type="button"
                      ref={buttonRef}
                      onClick={() => setServicesOpen(o => !o)}
                      onKeyDown={onTriggerKeyDown}
                      aria-haspopup="true"
                      aria-expanded={servicesOpen}
                      aria-controls="c4-services-panel"
                      className="flex items-center gap-1 text-[11px] uppercase tracking-[0.13em] transition-colors duration-300 font-medium bg-transparent border-0 p-0"
                      style={{ color: servicesOpen ? 'var(--c4-link-hover)' : 'var(--c4-text-muted)', cursor: 'pointer' }}
                    >
                      {link.label}
                      <motion.span
                        animate={{ rotate: servicesOpen ? 180 : 0 }}
                        transition={{ duration: 0.25, ease }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <ChevronDown size={11} strokeWidth={2} />
                      </motion.span>
                    </button>

                    <div
                      id="c4-services-panel"
                      ref={panelRef}
                      role="group"
                      aria-label="Services"
                      onKeyDown={onPanelKeyDown}
                      className="c4-svc-panel"
                    >
                      {serviceDropdown.map((s, i) => (
                        <div key={s.page} className="c4-svc-item">
                          <Link
                            to={createPageUrl(s.page)}
                            data-svc-item=""
                            tabIndex={servicesOpen ? 0 : -1}
                            className="c4-svc-item-link group flex items-start gap-4 px-5 py-4 transition-colors duration-200"
                            style={{ borderBottom: i < serviceDropdown.length - 1 ? '1px solid var(--c4-border)' : 'none' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--c4-bg-alt)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <span
                              className="mt-0.5 text-[10px] tabular-nums font-semibold w-6 shrink-0"
                              style={{ color: 'var(--c4-accent)' }}
                            >
                              {s.code}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-[12px] font-semibold tracking-[-0.005em] mb-0.5 transition-colors duration-200"
                                style={{ color: 'var(--c4-text)' }}
                              >
                                {s.label}
                              </p>
                              <p
                                className="text-[11.5px] leading-[1.5]"
                                style={{ color: 'var(--c4-text-muted)' }}
                              >
                                {s.brief}
                              </p>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.page}
                    to={link.to || createPageUrl(link.page)}
                    className="text-[11px] uppercase tracking-[0.13em] transition-colors duration-300 font-medium"
                    style={{ color: 'var(--c4-text-muted)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--c4-link-hover)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--c4-text-muted)'}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link to={createPageUrl('StartProject')} className="c4-nav-cta hidden md:inline-flex">
                Start a Project
              </Link>
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              <button
                onClick={() => setMobileOpen(o => !o)}
                className="md:hidden w-11 h-11 flex items-center justify-center"
                style={{ color: 'var(--c4-text)' }}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex overflow-y-auto px-8"
            style={{ backgroundColor: 'var(--c4-bg)' }}
          >
            {/* m-auto centres when content is short and lets it scroll when tall
                (justify-center on the scroll container clips the top items). */}
            <div className="m-auto w-full py-24">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.page}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setMobileServicesOpen(o => !o)}
                        className="flex items-center gap-2 text-[1.35rem] font-medium tracking-[-0.01em] w-full text-left"
                        style={{ color: 'var(--c4-text)' }}
                        aria-expanded={mobileServicesOpen}
                      >
                        {link.label}
                        <motion.span
                          animate={{ rotate: mobileServicesOpen ? 180 : 0 }}
                          transition={{ duration: 0.25, ease }}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <ChevronDown size={18} strokeWidth={1.5} />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 pl-4 flex flex-col gap-3">
                              {serviceDropdown.map((s, si) => (
                                <motion.div
                                  key={s.page}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: si * 0.05, duration: 0.25 }}
                                >
                                  <Link
                                    to={createPageUrl(s.page)}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3"
                                  >
                                    <span className="text-[10px] font-semibold tabular-nums w-5" style={{ color: 'var(--c4-accent)' }}>{s.code}</span>
                                    <span className="text-[1rem] font-medium" style={{ color: 'var(--c4-text-muted)' }}>{s.label}</span>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={link.to || createPageUrl(link.page)}
                      onClick={() => setMobileOpen(false)}
                      className="text-[1.35rem] font-medium tracking-[-0.01em]"
                      style={{ color: 'var(--c4-text)' }}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.3 }}
              className="mt-8"
            >
              <Link
                to={createPageUrl('StartProject')}
                onClick={() => setMobileOpen(false)}
                className="c4-nav-cta"
              >
                Start a Project
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex items-center gap-4"
            >
              <ThemeToggle />
            </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
