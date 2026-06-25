/**
 * /welcome — the networking-card landing (dark "helix takeover").
 *
 * A scanned QR or tapped NFC card opens this page. It's a full immersive scroll
 * journey: a procedural red+green particle double-helix (HelixCanvas) fills the
 * screen, spins on its own axis, scatters where the cursor slices it and springs
 * back, and the camera glides DOWN the helix as you scroll. The copy sits inside
 * the helix — strands pass behind AND in front of the text.
 *
 * Performance (this loads on mobile data in front of a prospect): the copy + a
 * brand-glow placeholder paint instantly; the heavy 3D chunk is lazy-loaded
 * after first paint via requestIdleCallback. WebGL-unavailable or
 * prefers-reduced-motion → the static glow stays (never blank).
 *
 * The three ranked actions (book / save / portfolio), the premium vCard (with
 * photo + phone, saved natively), tap-vs-scan headline branching, and the
 * fire-once scan tracking (full raw ref, server-side only — never leaked into
 * the vCard or booking links) all carry over.
 */
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useDocumentHead from '@/hooks/useDocumentHead';
import { recordScan } from '@/api/submissions';
import { createPageUrl } from '@/utils';
import '../components/hero/welcome-dark.css';

const HelixCanvas = lazy(() => import('@/components/hero/HelixCanvas'));
const BookingSheet = lazy(() => import('@/components/welcome/BookingSheet'));

function getEntryVariant(ref) {
  if (!ref) return 'neutral';
  if (ref.endsWith('-nfc') || ref === 'phone-tap') return 'tap';
  if (ref.endsWith('-qr')) return 'scan';
  return 'neutral';
}
const HEADLINE = {
  tap: 'Thanks for the tap.',
  scan: 'You scanned the card — nice.',
  neutral: 'Hey, glad you’re here.',
};
const LINES = {
  idle: 'Perth web design & development — run your cursor through the helix.',
  book: 'Sounds good — let’s find a time that works.',
  save: 'Saved straight to your phone — no typing.',
  folio: 'Opening the work →',
};

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch { return false; }
}

/* Fire the scan event exactly once per page load. */
let scanFired = false;

export default function Welcome() {
  const [params] = useSearchParams();
  const variant = useMemo(() => getEntryVariant(params.get('ref')), [params]);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [active3D, setActive3D] = useState(true);
  const [typed, setTyped] = useState('');
  const [barOn, setBarOn] = useState(false);
  const [cueHidden, setCueHidden] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const rootRef = useRef(null);
  const gestured = useRef(false);
  const interacted = useRef(false);
  const iosTap = useRef(() => {});
  const typeTok = useRef(0);

  const webgl = useMemo(hasWebGL, []);
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const hasVibe = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

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
    return () => { if (window.cancelIdleCallback && typeof id === 'number') try { window.cancelIdleCallback(id); } catch { /* */ } };
  }, [webgl, reduced]);

  /* Pause the render loop when the tab is hidden. */
  useEffect(() => {
    const onVis = () => setActive3D(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  /* iOS Safari has NO Vibration API — the only web haptic is the <input switch>
     trick (Safari 17.4+): a single subtle tap on a user gesture. */
  useEffect(() => {
    if (hasVibe) return undefined;
    const l = document.createElement('label');
    l.style.cssText = 'position:fixed;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none';
    const sw = document.createElement('input'); sw.type = 'checkbox'; sw.setAttribute('switch', '');
    l.appendChild(sw); document.body.appendChild(l);
    iosTap.current = () => { try { l.click(); } catch { /* */ } };
    return () => { try { l.remove(); } catch { /* */ } };
  }, [hasVibe]);

  const buzz = useCallback((p) => {
    try { if (!gestured.current) return; if (hasVibe) navigator.vibrate(p); else iosTap.current(); } catch { /* */ }
  }, [hasVibe]);

  /* Cursor struck particles → a tiny buzz (Android; iOS has no continuous haptic). */
  const onKnock = useCallback((speed) => {
    try { if (gestured.current && hasVibe) navigator.vibrate(Math.max(2, Math.min(15, speed * 0.45))); } catch { /* */ }
  }, [hasVibe]);

  /* Conversational microcopy: phrases TYPE IN depending on the next step. */
  const typeOut = useCallback((text) => {
    const my = ++typeTok.current; let i = 0;
    const tick = () => { if (my !== typeTok.current) return; setTyped(text.slice(0, i)); if (i++ < text.length) setTimeout(tick, 15 + Math.random() * 30); };
    tick();
  }, []);
  useEffect(() => { typeOut(LINES.idle); }, [typeOut]);

  /* Section reveal + a tap on each, sticky bar + scroll cue, first-touch hint. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) return undefined;
    const secs = [...root.querySelectorAll('.sec')];
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting && !e.target.classList.contains('on')) { e.target.classList.add('on'); buzz(9); } });
    }, { threshold: 0.45 });
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [buzz]);

  const markInteract = useCallback(() => { if (!interacted.current) { interacted.current = true; setShowHint(false); } }, []);

  useEffect(() => {
    const onScroll = () => {
      setCueHidden(window.scrollY > 40);
      setBarOn(window.scrollY > window.innerHeight * 0.85);
      markInteract();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [markInteract]);

  useEffect(() => {
    const t = setTimeout(() => { if (!interacted.current) setShowHint(true); }, 4000);
    return () => clearTimeout(t);
  }, []);

  const openBooking = () => { setBookingOpen(true); buzz([14]); };
  const onSave = () => { buzz([10, 30, 10]); setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1200); };
  const saveLabel = savedFlash ? 'Saved ✓' : 'Save my contact';

  return (
    <div
      className="cwd"
      ref={rootRef}
      onPointerDown={() => { gestured.current = true; markInteract(); }}
    >
      <div className="ph" aria-hidden="true" />
      <div className="scrim" aria-hidden="true" />

      {show3D && webgl && !reduced && (
        <Suspense fallback={null}>
          <HelixCanvas reduced={reduced} inView={active3D} onKnock={onKnock} />
        </Suspense>
      )}

      <div className="grain" aria-hidden="true" />

      {/* liquid-glass refraction (Chromium); Safari falls back to plain blur */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <filter id="lg" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves="2" seed="7" result="n" />
            <feGaussianBlur in="n" stdDeviation="1.6" result="nb" />
            <feDisplacementMap in="SourceGraphic" in2="nb" scale="34" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <main>
        {/* Hero */}
        <section className="sec on">
          <div className="inner">
            <div className="kick">c4 studios · perth</div>
            <h1>{HEADLINE[variant]}</h1>
            <p className="sub" aria-live="polite">{typed}<span className="car">▏</span></p>
            <div className="acts">
              <button type="button" className="cta p1"
                onClick={openBooking}
                onMouseEnter={() => typeOut(LINES.book)} onMouseLeave={() => typeOut(LINES.idle)}
                onFocus={() => typeOut(LINES.book)} onBlur={() => typeOut(LINES.idle)}>
                Book a call
              </button>
              <a className="cta p2" href="/caleb.vcf"
                onClick={onSave}
                onMouseEnter={() => typeOut(LINES.save)} onMouseLeave={() => typeOut(LINES.idle)}
                onFocus={() => typeOut(LINES.save)} onBlur={() => typeOut(LINES.idle)}>
                {saveLabel}
              </a>
              <Link className="cta p3" to={createPageUrl('Portfolio')}
                onMouseEnter={() => typeOut(LINES.folio)} onMouseLeave={() => typeOut(LINES.idle)}
                onFocus={() => typeOut(LINES.folio)} onBlur={() => typeOut(LINES.idle)}>
                See the portfolio
              </Link>
            </div>
            <div className="strip">
              <a href="mailto:caleb@c4studios.com.au">caleb@c4studios.com.au</a>
              <span> · </span>
              <a href="https://c4studios.com.au">c4studios.com.au</a>
              <span> · Perth WA</span>
            </div>
          </div>
        </section>

        {/* What this is */}
        <section className="sec">
          <div className="inner">
            <div className="kick">what this is</div>
            <h2>Websites and the systems behind them</h2>
            <p className="body">{`C4 is a Perth web studio. I build websites, and the automations that handle the repetitive work behind them. A site on its own only does part of the job. Most of the difference comes from looking at how your business actually runs, then building to fit it.`}</p>
            <div className="tags">
              <span className="tag">Web &amp; Applications</span>
              <span className="tag">Brand &amp; Growth</span>
              <span className="tag">AI &amp; Software</span>
              <span className="tag">C4 Lens</span>
            </div>
          </div>
        </section>

        {/* Who you're talking to */}
        <section className="sec">
          <div className="inner">
            <div className="kick">who you’re talking to</div>
            <h2>It’s just me, Caleb</h2>
            <p className="body">{`C4 Studios is Caleb Scott — founder and sole operator, here in Perth. Every conversation, every design call, every line of code comes from me. The person you talk to is the person doing the work, start to finish, and I like keeping it that way.`}</p>
          </div>
        </section>

        {/* Recent builds */}
        <section className="sec">
          <div className="inner">
            <div className="kick">recent work</div>
            <h2>A few recent builds</h2>
            <div className="rows">
              <div className="row"><b>DS Racing Karts</b><span>{`Moved 499+ products off Square, wrote the product descriptions with AI, set up a PCI-compliant checkout, and built them a custom Canvas racing mini-game.`}</span></div>
              <div className="row"><b>Evidence Advisory</b><span>{`Brand site for a Perth digital-forensics firm, built around a 3D WebGL hero — a shattered, evidence-tagged phone that reassembles as you scroll — over a full, SEO-ready multi-page platform.`}</span></div>
              <div className="row"><b>Tidy Gardens</b><span>{`A motion-led site for a Perth garden & reticulation business — a vine that grows, a poly-pipe that fills, and a mower that lays down stripes as you scroll. Four service pages, a before/after gallery, and a quote form straight to the owner.`}</span></div>
            </div>
            <Link className="folio" to={createPageUrl('Portfolio')}>See the full portfolio →</Link>
          </div>
        </section>

        {/* Flat facts */}
        <section className="sec">
          <div className="inner">
            <div className="kick">the basics</div>
            <h2>Running this since 2022</h2>
            <div className="stats">
              <div className="stat"><b>2022</b><span>founded</span></div>
              <div className="stat"><b>50+</b><span>Perth businesses</span></div>
              <div className="stat"><b>200+</b><span>assets shipped</span></div>
              <div className="stat"><b>6</b><span>own products</span></div>
            </div>
            <p className="body">{`You own everything I build — code, accounts, domains, all of it. If you ever move on, you take the lot with you.`}</p>
          </div>
        </section>

        {/* Close */}
        <section className="sec">
          <div className="inner">
            <div className="kick">no pressure</div>
            <h2>Here whenever you’re ready</h2>
            <p className="body">{`Easiest way in is a quick call — no pressure, just a chat about what you’re building. If tonight’s not the night, save my contact and reach out whenever. Either way, glad you tapped.`}</p>
            <div className="acts">
              <button type="button" className="cta p1" onClick={openBooking}>Book a call</button>
              <a className="cta p2" href="/caleb.vcf" onClick={onSave}>{saveLabel}</a>
            </div>
            <div className="strip">
              <a href="mailto:caleb@c4studios.com.au">caleb@c4studios.com.au</a>
              <span> · </span>
              <a href="https://c4studios.com.au">c4studios.com.au</a>
              <span> · Perth WA</span>
            </div>
          </div>
        </section>
      </main>

      <div className={`cue${cueHidden ? ' hide' : ''}`} aria-hidden="true">
        <span>scroll</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
      </div>

      <div className={`hint${showHint ? ' show' : ''}`} aria-hidden="true">go on — run your cursor through it</div>

      <div className={`bar${barOn ? ' on' : ''}`}>
        <button type="button" className="cta p1" onClick={openBooking}>Book a call</button>
        <a className="cta p2" href="/caleb.vcf" onClick={onSave}>{saveLabel}</a>
      </div>

      {bookingOpen && (
        <Suspense fallback={null}>
          <BookingSheet open={bookingOpen} onClose={() => setBookingOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
