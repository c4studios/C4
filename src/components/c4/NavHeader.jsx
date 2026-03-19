import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { createPageUrl } from '@/utils';
import C4Logo from './C4Logo';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'Home', page: 'Home' },
  { label: 'About', page: 'About' },
  { label: 'Services', page: 'Services' },
  { label: 'Portfolio', page: 'Portfolio' },
  { label: 'Ventures', page: 'Ventures' },
];

export default function NavHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious();
    setScrolled(latest > 30);
    setHidden(latest > prev && latest > 120);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !mobileOpen ? -80 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-500"
        style={{
          backgroundColor: scrolled ? 'var(--c4-nav-scrolled)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--c4-border-light)' : '1px solid transparent',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <div className="flex items-center justify-between h-[60px] md:h-[72px]">
            {/* Header logo with subtle backing for contrast */}
            <Link
              to={createPageUrl('Home')}
              className="c4-header-logo-link relative flex items-center justify-center py-1"
            >
              <C4Logo size={48} variant="full" context="header" className="c4-header-logo-lockup" />
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map(link => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="text-[11px] uppercase tracking-[0.13em] transition-colors duration-300 font-medium"
                  style={{ color: 'var(--c4-text-subtle)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--c4-link-hover)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--c4-text-subtle)'}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              <Link
                to={createPageUrl('StartProject')}
                className="hidden md:block text-[11px] uppercase tracking-[0.13em] px-5 py-[7px] font-medium transition-colors duration-300 rounded-full"
                style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
              >
                Start a Project
              </Link>

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
            <nav className="flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.page}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Link
                    to={createPageUrl(link.page)}
                    onClick={() => setMobileOpen(false)}
                    className="text-[1.35rem] font-medium tracking-[-0.01em]"
                    style={{ color: 'var(--c4-text)' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-8 flex items-center gap-4"
            >
              <Link
                to={createPageUrl('StartProject')}
                onClick={() => setMobileOpen(false)}
                className="inline-block text-[11px] uppercase tracking-[0.13em] px-6 py-3 font-medium"
                style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
              >
                Start a Project
              </Link>
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}