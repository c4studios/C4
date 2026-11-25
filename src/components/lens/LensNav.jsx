/* The bar across the top of /Lens (23 Nov 2026).
 *
 * One fixed bar, 64 px tall (56 on a phone). It is clear over the very top of
 * the page and solid from 8 px of scroll, so nothing shows through it. Left,
 * the way back to C4 Studios. Centre, the name, whose dot is a small eye that
 * looks toward the pointer. Right, the sections in page order and a button
 * that goes straight to the start page. The link for the section on screen
 * is marked (aria-current). On a phone the links fold into a menu that
 * Escape closes, handing focus back to its button.
 *
 * Everything that depends on the window (the solid bar, the marked link, the
 * eye) is written to the DOM by effects, so the first render matches the
 * prerendered HTML.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import { createPageUrl } from '@/utils';

const BOOK = `${createPageUrl('StartProject')}?service=lens`;
const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'packages', label: 'Packages' },
];

/* The brand's dot as an eye: an amber iris and a black pupil that shifts up
   to 2.5 px toward the pointer, wherever it is on the page. Transform only,
   at most one frame per pointer move, fine pointers only, and still under
   reduced motion. */
function NavEye() {
  const eyeRef = useRef(null);
  const pupilRef = useRef(null);
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || still) return undefined;
    let raf = 0;
    let px = 0;
    let py = 0;
    let box = null;
    const draw = () => {
      raf = 0;
      const eye = eyeRef.current;
      const pupil = pupilRef.current;
      if (!eye || !pupil) return;
      if (!box) box = eye.getBoundingClientRect();
      const dx = px - (box.left + box.width / 2);
      const dy = py - (box.top + box.height / 2);
      const d = Math.hypot(dx, dy);
      /* full travel once the pointer is a little way off, less right over it */
      const k = d > 0.5 ? Math.min(2.5, d / 24) / d : 0;
      pupil.style.transform = `translate(${(dx * k).toFixed(2)}px, ${(dy * k).toFixed(2)}px)`;
    };
    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onResize = () => { box = null; };
    document.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return (
    <svg ref={eyeRef} className="nav-eye" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" focusable="false">
      <circle cx="7" cy="7" r="7" fill="#e8a658" />
      <g ref={pupilRef} className="nav-eye-pupil">
        <circle cx="7" cy="7" r="3.2" fill="#000" />
        <circle cx="8.15" cy="5.85" r=".85" fill="#f5f5f0" />
      </g>
    </svg>
  );
}

export default function LensNav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const menuRef = useRef(null);

  /* Clear over the top of the page, solid from 8 px down. */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    let raf = 0;
    const set = () => {
      raf = 0;
      nav.classList.toggle('is-solid', window.scrollY >= 8);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(set); };
    set();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* The section on screen: whichever crosses a thin band just above the
     middle of the window. The statement between Work and Services has no
     link, so nothing is marked while it's there. */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof IntersectionObserver === 'undefined') return undefined;
    const ids = LINKS.map((l) => l.id);
    const showing = new Set();
    const mark = () => {
      const current = ids.filter((id) => showing.has(id)).pop() || null;
      nav.querySelectorAll('a[data-section]').forEach((a) => {
        if (a.dataset.section === current) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) showing.add(en.target.id);
        else showing.delete(en.target.id);
      });
      mark();
    }, { rootMargin: '-40% 0px -55% 0px' });
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const close = useCallback((handBack) => {
    setOpen(false);
    if (handBack && burgerRef.current) burgerRef.current.focus();
  }, []);

  /* The phone menu: focus goes to its first link, Escape closes it, and Tab
     stays between the menu and its button while it's open. */
  useEffect(() => {
    if (!open) return undefined;
    const menu = menuRef.current;
    const first = menu && menu.querySelector('a');
    if (first) first.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== 'Tab' || !menu) return;
      const stops = [burgerRef.current, ...menu.querySelectorAll('a')].filter(Boolean);
      const at = stops.indexOf(document.activeElement);
      if (at === -1) return;
      const next = (at + (e.shiftKey ? -1 : 1) + stops.length) % stops.length;
      e.preventDefault();
      stops[next].focus();
    };
    document.addEventListener('keydown', onKey);
    // The page behind holds still while the menu is open, so closing it
    // leaves the visitor where they were (review, 25 Nov 2026).
    const root = document.documentElement;
    const before = [root.style.overflow, document.body.style.overflow];
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      [root.style.overflow, document.body.style.overflow] = before;
    };
  }, [open, close]);

  return (
    <>
      <nav className="lens-nav" ref={navRef} aria-label="C4 Lens">
        <div className="nav-left">
          <Link to="/" className="site-back">← C4<span className="site-back-tail"> Studios</span></Link>
        </div>
        <div className="brand"><NavEye />C4 LENS</div>
        <div className="nav-links">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} data-section={l.id}>{l.label}</a>
          ))}
          <Link to={BOOK} className="btn primary nav-book">Start a project</Link>
        </div>
        <button
          ref={burgerRef}
          type="button"
          className="lens-hamburger"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="lens-menu"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 4l12 12M16 4L4 16" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 5h16M2 10h16M2 15h16" /></svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="lens-mobile-menu" id="lens-menu" ref={menuRef}>
          <Link to="/" className="lens-mobile-back" onClick={() => setOpen(false)}>← C4 Studios</Link>
          <div className="lens-mobile-sep" />
          {/* Shut a tick later: a link taken out of the page before the
              browser follows it goes nowhere. */}
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={() => window.setTimeout(() => setOpen(false), 0)}>{l.label}</a>
          ))}
          <Link to={BOOK} className="book" onClick={() => setOpen(false)}>Start a project</Link>
        </div>
      )}
    </>
  );
}
