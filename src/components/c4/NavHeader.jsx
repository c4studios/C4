import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { createPageUrl } from '@/utils';
import C4Logo from './C4Logo';
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
    label: 'Brand & Growth',
    code: 'C2',
    page: 'ServiceBrand',
    brief: 'Branding, identity, SEO & growth strategy',
  },
  {
    label: 'AI & Software',
    code: 'C3',
    page: 'ServiceAI',
    brief: 'Workflow automation, AI agents & custom software',
  },
  {
    label: 'C4 Lens',
    code: 'C4',
    page: 'Lens',
    brief: 'Professional photography & videography',
  },
  {
    label: 'C4Sight',
    code: 'C5',
    page: 'Foresight',
    brief: 'Workplace AI training & workshops',
  },
];

const navLinks = [
  { label: 'Home', page: 'Home' },
  { label: 'About', page: 'About' },
  { label: 'Services', page: 'Services', hasDropdown: true },
  { label: 'Portfolio', page: 'Portfolio' },
];

export default function NavHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);

  const lockVisible = location.pathname === '/Lens' || location.pathname === '/lens';

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious();
    setScrolled(latest > 30);
    setHidden(!lockVisible && latest > prev && latest > 120);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close dropdown when navigating
  useEffect(() => {
    setServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  const handleDropdownEnter = () => {
    clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };

  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden && !mobileOpen ? -80 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
              to={createPageUrl('Home')}
              className="c4-header-logo-link relative flex items-center justify-center py-1"
            >
              <C4Logo size={48} variant="full" context="header" className="c4-header-logo-lockup" />
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map(link => (
                link.hasDropdown ? (
                  <div
                    key={link.page}
                    className="relative"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                    ref={triggerRef}
                  >
                    <Link
                      to={createPageUrl(link.page)}
                      className="flex items-center gap-1 text-[11px] uppercase tracking-[0.13em] transition-colors duration-300 font-medium"
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
                    </Link>

                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          ref={dropdownRef}
                          initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
                          animate={{ opacity: 1, y: 0, scaleY: 1 }}
                          exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
                          transition={{ duration: 0.22, ease }}
                          style={{
                            transformOrigin: 'top center',
                            backgroundColor: 'var(--c4-nav-scrolled)',
                            backdropFilter: 'blur(16px) saturate(130%)',
                            border: '1px solid var(--c4-border-light)',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
                          }}
                          className="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-[340px] rounded-sm overflow-hidden"
                        >
                          {serviceDropdown.map((s, i) => (
                            <motion.div
                              key={s.page}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: i * 0.04, ease }}
                            >
                              <Link
                                to={createPageUrl(s.page)}
                                className="group flex items-start gap-4 px-5 py-4 transition-colors duration-200"
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
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
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
            className="fixed inset-0 z-40 flex flex-col justify-center px-8"
            style={{ backgroundColor: 'var(--c4-bg)' }}
          >
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
                      to={createPageUrl(link.page)}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-8 flex items-center gap-4"
            >
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
