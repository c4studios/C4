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
import C4iWordmark from '@/components/c4/C4iWordmark';
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
/* built per-device: "finger" on touch, "cursor" with a mouse */
const makeLines = (coarse) => ({
  idle: `Perth studio — web, AI, brand & training. Run your ${coarse ? 'finger' : 'cursor'} through the helix.`,
  book: 'Sounds good — let’s find a time that works.',
  save: 'Saved straight to your phone — no typing.',
  folio: 'Opening the work →',
});

/* The four arms, each a button through to its own page. The mark carries
   a hint of that arm's identity (window / chip / iris / chalk tick), tinted
   in the arm's accent via --arm. Names + destinations match the site. */
const ARMS = [
  {
    to: '/ServiceWeb',
    name: 'Web & Applications',
    line: 'Sites, apps and platforms — built to convert, yours to keep.',
    color: '#e8e6e0',
    mark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 8.5h18" />
        <circle cx="6" cy="6.25" r="0.7" fill="currentColor" stroke="none" />
        <circle cx="8.4" cy="6.25" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: '/c4i',
    name: (
      <>
        <C4iWordmark /> · AI
      </>
    ),
    line: 'Private AI on your own hardware, or automations in the cloud.',
    color: '#5a9bd8',
    mark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" rx="1.4" />
        <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
      </svg>
    ),
  },
  {
    to: '/Lens',
    name: 'C4 Lens',
    line: 'Photography, short-form video and brand identity.',
    color: '#e0a23a',
    mark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="8.4" />
        <circle cx="12" cy="12" r="3.1" />
        <path d="M12 3.6v3.3M12 17.1v3.3M3.6 12h3.3M17.1 12h3.3" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    to: '/Foresight',
    name: 'C4Sight',
    line: 'Hands-on AI training that leaves your team genuinely capable.',
    color: '#54b06a',
    mark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 12.5l5 5L20 6.5" />
      </svg>
    ),
  },
];

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
  const progRef = useRef(null);
  const gestured = useRef(false);
  const interacted = useRef(false);
  const iosTap = useRef(() => {});
  const typeTok = useRef(0);

  const webgl = useMemo(hasWebGL, []);
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const coarse = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: none)').matches, []);
  const LINES = useMemo(() => makeLines(coarse), [coarse]);
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
    // Hold the page firm on mobile — vertical scroll only; no horizontal drag,
    // overscroll, or edge-swipe-back while playing with the helix.
    const rs = root.style, bs = document.body.style;
    const prevScroll = { rob: rs.overscrollBehavior, bob: bs.overscrollBehavior, box: bs.overflowX, bta: bs.touchAction };
    rs.overscrollBehavior = 'none';
    bs.overscrollBehavior = 'none';
    bs.overflowX = 'hidden';
    bs.touchAction = 'pan-y';
    let meta = document.querySelector('meta[name="theme-color"]');
    const created = !meta; const prevColor = meta?.getAttribute('content');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'theme-color'); document.head.appendChild(meta); }
    meta.setAttribute('content', '#07080a');
    return () => {
      root.className = prevClass; document.body.style.backgroundColor = prevBg;
      rs.overscrollBehavior = prevScroll.rob; bs.overscrollBehavior = prevScroll.bob;
      bs.overflowX = prevScroll.box; bs.touchAction = prevScroll.bta;
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
  useEffect(() => { typeOut(LINES.idle); }, [typeOut, LINES]);

  /* Stats roll up from zero when their section reveals. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced || !('IntersectionObserver' in window)) return undefined;
    const stats = root.querySelector('.stats');
    const els = [...root.querySelectorAll('.stat b[data-n]')];
    if (!stats || !els.length) return undefined;
    let done = false;
    const io = new IntersectionObserver((es) => {
      if (done || !es.some((e) => e.isIntersecting)) return;
      done = true; io.disconnect();
      const t0 = performance.now(), D = 1400;
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 3);
        els.forEach((el) => { el.textContent = Math.round(Number(el.dataset.n) * e) + (el.dataset.s || ''); });
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(stats);
    return () => io.disconnect();
  }, [reduced]);

  /* Desktop: CTAs lean a few px toward the cursor (magnetic hover). */
  useEffect(() => {
    if (!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches)) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;
    const btns = [...root.querySelectorAll('.acts .cta')];
    const move = (e) => {
      const b = e.currentTarget.getBoundingClientRect();
      const dx = (e.clientX - b.left - b.width / 2) / b.width, dy = (e.clientY - b.top - b.height / 2) / b.height;
      e.currentTarget.style.setProperty('--mx', `${(dx * 7).toFixed(1)}px`);
      e.currentTarget.style.setProperty('--my', `${(dy * 5).toFixed(1)}px`);
    };
    const leave = (e) => { e.currentTarget.style.setProperty('--mx', '0px'); e.currentTarget.style.setProperty('--my', '0px'); };
    btns.forEach((b) => { b.addEventListener('mousemove', move); b.addEventListener('mouseleave', leave); });
    return () => btns.forEach((b) => { b.removeEventListener('mousemove', move); b.removeEventListener('mouseleave', leave); });
  }, []);

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
      if (progRef.current) {
        const max = document.body.scrollHeight - window.innerHeight;
        const t = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        progRef.current.style.transform = `scaleY(${t.toFixed(4)})`;
      }
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

  /* Arm the app-wide "back to the card" button: whenever an internal link on
     this page is followed to another PAGE (not a file, mailto, or off-site),
     remember where to return so the destination can offer a way back. */
  const armReturn = useCallback((e) => {
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    const raw = a.getAttribute('href') || '';
    if (/^(mailto:|tel:|sms:)/i.test(raw) || a.hasAttribute('download')) return;
    try {
      const url = new URL(a.href, window.location.origin);
      if (url.origin !== window.location.origin) return;    // off-site
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;        // a file (e.g. /caleb.vcf), not a page
      if (url.pathname === window.location.pathname) return; // same page
      sessionStorage.setItem('c4:welcomeReturn', window.location.pathname + window.location.search);
    } catch { /* */ }
  }, []);

  const openBooking = () => { setBookingOpen(true); buzz([14]); };
  const onSave = () => { buzz([10, 30, 10]); setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1200); };
  const saveLabel = savedFlash ? 'Saved ✓' : 'Save my contact';

  return (
    <div
      className="cwd"
      ref={rootRef}
      onClickCapture={armReturn}
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

        {/* What C4 does now — the four arms, each a button through */}
        <section className="sec">
          <div className="inner">
            <div className="kick">what c4 does now</div>
            <h2>One studio, four arms.</h2>
            <p className="body">{`It began with websites and grew. Today each side of C4 is its own craft — all built and run by me, here in Perth. Tap through to whichever fits, or book a call and I’ll point you the right way.`}</p>
            <nav className="arms" aria-label="The four arms of C4 Studios">
              {ARMS.map((arm) => (
                <Link className="arm" key={arm.to} to={arm.to} style={{ '--arm': arm.color }}>
                  <span className="arm-mark">{arm.mark}</span>
                  <span className="arm-txt">
                    <b>{arm.name}</b>
                    <span>{arm.line}</span>
                  </span>
                  <svg className="arm-go" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {/* Who you're talking to */}
        <section className="sec">
          <div className="inner">
            <div className="kick">who you’re talking to</div>
            <h2>Straight to the founder.</h2>
            <p className="body">{`C4 Studios is Caleb Scott — founder and sole operator, here in Perth. Every conversation, every design call, every line of code comes from me. The person you talk to is the person doing the work, start to finish, and I like keeping it that way.`}</p>
          </div>
        </section>

        {/* Recent builds */}
        <section className="sec">
          <div className="inner">
            <div className="kick">recent work</div>
            <h2>A few recent builds</h2>
            <div className="rows">
              <Link className="row" to={createPageUrl('CaseStudy?slug=ds-racing-karts')}><b>DS Racing Karts</b><span>{`Moved 499+ products off Square, wrote the product descriptions with AI, set up a PCI-compliant checkout, and built them a custom Canvas racing mini-game.`}</span></Link>
              <Link className="row" to={createPageUrl('CaseStudy?slug=evidence-advisory')}><b>Evidence Advisory</b><span>{`Brand site for a Perth digital-forensics firm, built around a 3D WebGL hero — a shattered, evidence-tagged phone that reassembles as you scroll — over a full, SEO-ready multi-page platform.`}</span></Link>
              <Link className="row" to={createPageUrl('CaseStudy?slug=tidy-gardens-australia')}><b>Tidy Gardens</b><span>{`A motion-led site for a Perth garden & reticulation business — a vine that grows, a poly-pipe that fills, and a mower that lays down stripes as you scroll. Four service pages, a before/after gallery, and a quote form straight to the owner.`}</span></Link>
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
              <div className="stat"><b data-n="2022">2022</b><span>founded</span></div>
              <div className="stat"><b data-n="50" data-s="+">50+</b><span>Perth businesses</span></div>
              <div className="stat"><b data-n="200" data-s="+">200+</b><span>assets shipped</span></div>
              <div className="stat"><b data-n="6">6</b><span>own products</span></div>
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

      <div className={`hint${showHint ? ' show' : ''}`} aria-hidden="true">{`go on — run your ${coarse ? 'finger' : 'cursor'} through it`}</div>

      <div className="prog" aria-hidden="true"><i ref={progRef} /></div>

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
