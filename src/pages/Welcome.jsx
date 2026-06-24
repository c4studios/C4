/**
 * /welcome — networking-card landing (dark "helix takeover").
 *
 * A scanned QR or tapped NFC card opens this page. The hero is an interactive
 * particle double-helix in C4's red + green; run the cursor through it and it
 * scatters and reforms. The three ranked actions (book / save / portfolio),
 * the vCard, scan tracking, and the tap-vs-scan headline branching all carry
 * over from the original build.
 *
 * Performance (this loads on mobile data in front of a prospect): the text +
 * a brand-glow placeholder paint instantly; the heavy 3D chunk (HelixCanvas)
 * is lazy-loaded after first paint via requestIdleCallback. WebGL-unavailable
 * or prefers-reduced-motion → the static glow placeholder stays (never blank).
 */
import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useDocumentHead from '@/hooks/useDocumentHead';
import { recordScan } from '@/api/submissions';
import { createPageUrl } from '@/utils';
import '../components/hero/welcome-dark.css';

const HelixCanvas = lazy(() => import('@/components/hero/HelixCanvas'));
const BookingSheet = lazy(() => import('@/components/welcome/BookingSheet'));

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function getEntryVariant(ref) {
  if (!ref) return 'neutral';
  if (ref.endsWith('-nfc') || ref === 'phone-tap') return 'tap';
  if (ref.endsWith('-qr')) return 'scan';
  return 'neutral';
}
const HEADLINE = {
  tap: 'That tap was just the beginning.',
  scan: 'So you found the card.',
  neutral: "Welcome — glad you're here.",
};
const SUBLINE = {
  idle: 'Perth web design & development. This is what we’re built from — run your cursor through it.',
  call: 'A call? Let’s build something.',
  save: 'Take the studio with you.',
  folio: 'See what we’ve made.',
};

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; }
}

/* Fire the scan event exactly once per page load. */
let scanFired = false;

export default function Welcome() {
  const [params] = useSearchParams();
  const variant = useMemo(() => getEntryVariant(params.get('ref')), [params]);

  const [sub, setSub] = useState('idle');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [inView, setInView] = useState(true);
  const [show3D, setShow3D] = useState(false);
  const agitate = useRef(0);
  const gestured = useRef(false);
  const stageRef = useRef(null);
  const webgl = useMemo(hasWebGL, []);
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useDocumentHead({
    title: 'You found the card — C4 Studios',
    description: 'You scanned the C4 Studios card. Perth web design & development. Book a call, save the contact, or see the work.',
    path: '/welcome',
    noIndex: true,
  });

  /* Force the dark palette + browser chrome; restore on unmount. */
  useEffect(() => {
    const root = document.documentElement;
    const prevClass = root.className;
    root.classList.add('dark-mode'); root.classList.remove('light-mode', 'vivid');
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#07080a';
    let meta = document.querySelector('meta[name="theme-color"]');
    const created = !meta; const prevColor = meta?.getAttribute('content');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'theme-color'); document.head.appendChild(meta); }
    meta.setAttribute('content', '#07080a');
    return () => {
      root.className = prevClass; document.body.style.backgroundColor = prevBg;
      if (created) meta.remove(); else if (prevColor != null) meta.setAttribute('content', prevColor);
    };
  }, []);

  /* One scan event on mount (full raw ref, server-side only). */
  useEffect(() => {
    if (scanFired) return;
    if (typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent)) return;
    scanFired = true;
    recordScan({ ref: params.get('ref') || '', user_agent: navigator.userAgent });
  }, [params]);

  /* Defer the heavy 3D until after first paint, so the page is alive instantly. */
  useEffect(() => {
    if (!webgl || reduced) return undefined;
    const ric = window.requestIdleCallback || ((f) => setTimeout(f, 300));
    const id = ric(() => setShow3D(true));
    return () => { if (window.cancelIdleCallback && typeof id === 'number') try { window.cancelIdleCallback(id); } catch (e) { /* */ } };
  }, [webgl, reduced]);

  /* Pause the render loop when scrolled out of view. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.02 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const buzz = (p) => { try { if (gestured.current && navigator.vibrate) navigator.vibrate(p); } catch (e) { /* */ } };
  const enter = (m) => () => { setSub(m); agitate.current = clamp(agitate.current + 0.5, 0, 1); buzz(5); };
  const leave = () => setSub('idle');

  const ctaStyle = {
    p1: { background: '#f3f2ef', color: '#15161a' },
    p2: { background: 'rgba(255,255,255,0.04)', color: '#f4f2ef', border: '0.5px solid rgba(255,255,255,0.18)' },
    p3: { background: 'transparent', color: 'rgba(243,242,239,0.62)', fontSize: 14 },
  };

  return (
    <div className="cwd" onPointerDown={() => { gestured.current = true; }}>
      <div className="cwd__stage" ref={stageRef}>
        <div className="cwd__ph" aria-hidden="true" />
        {show3D && webgl && !reduced && (
          <Suspense fallback={null}>
            <HelixCanvas agitate={agitate} reduced={reduced} inView={inView} />
          </Suspense>
        )}
      </div>

      <div className="cwd__copy">
        <div className="cwd__kick">c4 studios · perth</div>
        <h1 className="cwd__h1">{HEADLINE[variant]}</h1>
        <p className="cwd__sub" aria-live="polite">{SUBLINE[sub]}</p>

        <div className="cwd__acts">
          <button type="button" className="cwd__cta" style={ctaStyle.p1}
            onClick={() => { setBookingOpen(true); buzz([14]); }}
            onMouseEnter={enter('call')} onMouseLeave={leave} onFocus={enter('call')} onBlur={leave}>
            Book a call
          </button>
          <a className="cwd__cta" style={ctaStyle.p2} href="/caleb.vcf" download="Caleb Scott - C4 Studios.vcf"
            onClick={() => buzz([10, 30, 10])}
            onMouseEnter={enter('save')} onMouseLeave={leave} onFocus={enter('save')} onBlur={leave}>
            Save my contact
          </a>
          <Link className="cwd__cta" style={ctaStyle.p3} to={createPageUrl('Portfolio')}
            onMouseEnter={enter('folio')} onMouseLeave={leave} onFocus={enter('folio')} onBlur={leave}>
            See the portfolio
          </Link>
        </div>

        <div className="cwd__strip">
          <a href="mailto:caleb@c4studios.com.au">caleb@c4studios.com.au</a>
          <span> · </span>
          <a href="https://c4studios.com.au">c4studios.com.au</a>
          <span> · Perth WA</span>
        </div>
      </div>

      {bookingOpen && (
        <Suspense fallback={null}>
          <BookingSheet open={bookingOpen} onClose={() => setBookingOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
