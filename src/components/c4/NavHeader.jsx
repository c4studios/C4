import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from '@/components/c4/SiteLink';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { createPageUrl } from '@/utils';
import C4Logo from './C4Logo';
import ThemeToggle from './ThemeToggle';
import { trackEvent } from '@/lib/track';

const ease = [0.22, 1, 0.36, 1];

const serviceDropdown = [
  {
    label: 'Web & Applications',
    code: 'C1',
    page: 'ServiceWeb',
    brief: 'Custom websites, web apps & SaaS platforms',
  },
  /* C4i went to C4Site with private AI and automation on 9 Oct 2026, so
     the codes close up and run in menu order. */
  {
    label: 'C4 Lens',
    code: 'C2',
    page: 'Lens',
    // "& brand identity" came off on 9 Oct 2026: Logo Design does that now.
    brief: 'Photography & video',
  },
  /* C4Site is its own business now, so C4 Studios no longer lists it here
     (Caleb, 8 Oct 2026). SEO & Copywriting took its slot (D2). */
  {
    label: 'SEO & Copywriting',
    code: 'C3',
    page: 'SeoCopy',
    brief: 'Found in search, worth reading once found',
  },
  /* The fourth arm from 9 Oct 2026 (Caleb: "we've been getting a lot of
     enquiries regarding logo design"). */
  {
    label: 'Logo Design',
    code: 'C4',
    page: 'LogoDesign',
    brief: 'Logos, from one mark to a full identity',
  },
];

const navLinks = [
  // Home routes to the canonical '/', not the duplicate '/Home'.
  { label: 'Home', page: 'Home', to: '/' },
  { label: 'About', page: 'About' },
  { label: 'Services', page: 'Services', hasDropdown: true },
  { label: 'Articles', page: 'Insights', to: '/insights' },
  { label: 'Portfolio', page: 'Portfolio' },
  { label: 'Contact', page: 'Contact' },
];

/* Injected once by NavHeader (nav owns NavHeader.jsx + Footer.jsx, no CSS
   file). Defines the dark bar's tokens, the crawlable index-sheet reveal
   and the start button. The red back ribbon that hung top-left on every
   sub-page was removed on 12 Oct 2026 (Caleb: "no ribbon"); the logo and
   the Home link take people home. */
const NAV_CSS = `
/* The bar is ink in both themes (14 Sep 2026): re-point the text and surface
   tokens inside it so everything it contains reads on dark. */
header[data-c4-chrome="header"] {
  --c4-bg: #141518;
  --c4-bg-alt: #1b1d21;
  --c4-card-bg: #1b1d21;
  --c4-tag-bg: #202329;
  /* The bar's own ground, set here and not inherited (15 Oct 2026). A page
     pin used to re-point --c4-nav-idle and --c4-nav-scrolled on :root, so on
     /ServiceWeb the bar and the Services sheet turned pale and see-through
     while the words inside stayed light: the titles all but vanished over
     the white page. Declared on the header, these beat any :root pin. The
     sheet is solid, so nothing behind it can show through its words. */
  --c4-nav-idle: rgba(20, 21, 24, 0.92);
  --c4-nav-idle-border: rgba(255, 255, 255, 0.08);
  --c4-nav-scrolled: rgba(20, 21, 24, 0.97);
  --c4-nav-panel: #17181b;
  --c4-switch-track: rgba(236, 231, 222, 0.18);
  --c4-text: #ECE7DE;
  --c4-text-muted: #B9BCC3;
  /* Lifted from #8f93a0, which held only 4.5:1 on the idle bar over a white
     page. It carries the theme switch's resting label. */
  --c4-text-subtle: #A3A7B2;
  --c4-border: rgba(236, 231, 222, 0.14);
  --c4-border-light: rgba(236, 231, 222, 0.08);
  --c4-link-hover: #ffffff;
  --c4-ring: rgba(236, 231, 222, 0.4);
  /* Focus too (9 Oct 2026): the site's ring is ink in the light theme, so
     the links, the Services button and the start button showed no ring at
     all on the dark bar. */
  --c4-focus: #ECE7DE;
  --c4-cta-ring: rgba(236, 231, 222, 0.85);
  color-scheme: dark;
}
/* The service codes (C1 to C4) are red text. The start red reads at 5:1
   on the light page, but measured 3.2:1 on the dark page and under 3:1 on
   the ink sheet (15 Oct 2026), so on dark grounds they take the lighter
   red DESIGN.md keeps for the dark caret: 5.4:1 on the sheet. */
:root {
  --c4-accent-text: var(--c4-accent);
}
:root.dark-mode,
header[data-c4-chrome="header"] {
  --c4-accent-text: #E06A5F;
}
@media (prefers-color-scheme: dark) {
  :root:not(.light-mode):not(.dark-mode) {
    --c4-accent-text: #E06A5F;
  }
}
/* The dark theme's bar is a shade deeper, as globals.css had it. */
:root.dark-mode header[data-c4-chrome="header"] {
  --c4-nav-idle: rgba(12, 13, 16, 0.92);
  --c4-nav-scrolled: rgba(12, 13, 16, 0.97);
  --c4-nav-panel: #121317;
}
/* The start button's label and ring. These were the back ribbon's tokens
   until it went (12 Oct 2026), kept at the values the button already had. */
:root {
  --c4-cta-ink: #F7F5F2;
  --c4-cta-ring: rgba(26, 26, 26, 0.55);
}
:root.cw-on-board,
:root.sg-on-board {
  --c4-cta-ring: rgba(236, 231, 222, 0.7);
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
  background: var(--c4-nav-panel);
  border: 1px solid var(--c4-border);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18), 0 22px 48px -12px rgba(0, 0, 0, 0.4);
  clip-path: inset(0 0 100% 0);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: clip-path 0.34s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.2s ease,
              visibility 0s linear 0.34s;
}
/* The bridge: while the sheet is open, the 14px gap between the trigger
   and the panel is part of the hover area, so the pointer can cross it
   at any speed without the sheet folding away. */
.c4-svc-wrap.is-open::after {
  content: '';
  position: absolute;
  left: -24px;
  right: -24px;
  top: 100%;
  height: 18px;
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
  outline: 2px solid var(--c4-focus);
  outline-offset: -2px;
  background-color: var(--c4-tag-bg);
}
/* The clip-path unfold honours reduced-motion (memo §6): open/close is
   instant, anchors stay present and crawlable either way. The framer-motion
   pieces (mobile sheet, chevrons) are already reduced via App's MotionConfig
   reducedMotion="user"; these CSS transitions are the remaining surface. */
@media (prefers-reduced-motion: reduce) {
  .c4-svc-panel,
  .c4-svc-item { transition: none !important; }
}

/* Start-a-Project header CTA — the one red object on the right edge.
   No display here: the header instance is hidden below lg by its
   Tailwind classes, and this injected sheet sits later in the document
   at equal specificity, so a display value here used to win and show
   the CTA on phones, pushing the menu button past the right edge on
   every sub-page (measured 8 Sep 2026: button
   at x 373 to 402 on a 375px viewport). The mobile-menu instance sets
   its own display class. */
.c4-nav-cta {
  align-items: center;
  white-space: nowrap;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--c4-cta-ink);
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
  outline: 2px solid var(--c4-cta-ring);
  outline-offset: 3px;
}
`;

export default function NavHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const triggerRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const closeTimer = useRef(null);
  // True while the sheet is open because the pointer is over it. A click on
  // the trigger then keeps it open: it used to toggle it shut, so the items
  // vanished under the cursor, and a touch tap (which fires mouseenter first)
  // could never open it at all.
  const hoverOpened = useRef(false);
  // On desktop widths the bar stays put; only below lg (logo and menu button)
  // does it slide away on scroll. It used to vanish on any downward scroll,
  // which read as the nav disappearing in a windowed browser.
  const desktopRef = useRef(false);

  /* Cloudflare 308-normalises prerendered paths to their slash form (/Lens
     becomes /Lens/), so every route test here compares without it. */
  const pathLower = (location.pathname.replace(/\/+$/, '') || '/').toLowerCase();
  const isLens = pathLower === '/lens';

  // Lens locks the header visible (moot — the header is not rendered there —
  // but kept for parity with any case-variant path).
  const lockVisible = isLens;

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => {
      desktopRef.current = mq.matches;
      if (mq.matches) setHidden(false);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious();
    setScrolled(latest > 30);
    setHidden(!lockVisible && !desktopRef.current && latest > prev && latest > 120);
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
    // Track only the closed->open transition, not every hover re-entry.
    if (!servicesOpen) {
      trackEvent('nav_services_open', {});
      hoverOpened.current = true;
    }
    setServicesOpen(true);
  };

  const handleDropdownLeave = () => {
    // Long enough to cross the bridge below the trigger or drift off the
    // panel's edge and back; short enough that the sheet still folds away.
    closeTimer.current = setTimeout(() => {
      hoverOpened.current = false;
      setServicesOpen(false);
    }, 260);
  };

  const handleTriggerClick = () => {
    // The first click after a hover-open keeps the sheet open (see
    // hoverOpened). Keyboard and later clicks toggle as before.
    if (hoverOpened.current && servicesOpen) {
      hoverOpened.current = false;
      return;
    }
    hoverOpened.current = false;
    setServicesOpen((o) => !o);
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
  // header must not appear there. Exact route check.
  if (isLens) return null;

  return (
    <>
      <style>{NAV_CSS}</style>

      {/* Below lg the bar slides away while you scroll down. Focus coming
          into it brings it back: Tab round from the footer used to land on
          the logo and the menu button while they were still off screen. */}
      <motion.header
        animate={{ y: hidden && !mobileOpen ? -80 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onFocusCapture={() => setHidden(false)}
        data-c4-chrome="header"
        className="fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-500"
        style={{
          backgroundColor: scrolled ? 'var(--c4-nav-scrolled)' : 'var(--c4-nav-idle)',
          backdropFilter: scrolled ? 'blur(12px) saturate(126%)' : 'blur(8px) saturate(118%)',
          borderBottom: scrolled ? '1px solid var(--c4-border-light)' : '1px solid var(--c4-nav-idle-border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <div className="flex items-center justify-between h-[60px] md:h-[72px]">
            <Link
              to="/"
              className="c4-header-logo-link relative flex items-center justify-center py-1"
            >
              <C4Logo size={48} variant="full" context="header" className="c4-header-logo-lockup" />
            </Link>

            {/* The full bar needs about 940px with the compact switch, 1,100 with
                the labelled one, so it starts at lg and the labels at xl; below
                lg the menu sheet carries everything (Caleb, 2 Oct 2026: the
                items crowded and the start button wrapped on tablets). */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
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
                      onClick={handleTriggerClick}
                      onKeyDown={onTriggerKeyDown}
                      aria-haspopup="true"
                      aria-expanded={servicesOpen}
                      aria-controls="c4-services-panel"
                      className="flex items-center gap-1 whitespace-nowrap text-[11px] uppercase tracking-[0.13em] transition-colors duration-300 font-medium bg-transparent border-0 p-0"
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
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--c4-tag-bg)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <span
                              className="mt-0.5 text-[10px] tabular-nums font-semibold w-6 shrink-0"
                              style={{ color: 'var(--c4-accent-text)' }}
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
                    className="whitespace-nowrap text-[11px] uppercase tracking-[0.13em] transition-colors duration-300 font-medium"
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
              <Link to={createPageUrl('StartProject')} className="c4-nav-cta hidden lg:inline-flex">
                Start a Project
              </Link>
              <div className="hidden lg:block xl:hidden">
                <ThemeToggle compact />
              </div>
              <div className="hidden xl:block">
                <ThemeToggle />
              </div>

              <button
                onClick={() => setMobileOpen(o => !o)}
                className="lg:hidden w-11 h-11 flex items-center justify-center"
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
                                    <span className="text-[10px] font-semibold tabular-nums w-5" style={{ color: 'var(--c4-accent-text)' }}>{s.code}</span>
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
                className="c4-nav-cta inline-flex"
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
