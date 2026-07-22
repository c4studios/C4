/*
 * /Contact — "The Direct Line" (Fable pass — CONTACT-1 as amended by the
 * binding decision memo).
 *
 * Every other page on the site is a world; this is the moment the theatre
 * stops and you talk to the person. One fold, no scroll of its own: a single
 * wire with exactly two ends — YOU at the top, CALEB at the bottom — and the
 * three fields hanging off it. Completing a field flips its downstream wire
 * segment to C4 red; send closes the last gap and the page writes a receipt
 * back. No departments, no ticket tiers, no queue.
 *
 * Memo rulings honoured here:
 *   - Wire = straight segments anchored to layout slots, recomputed ONLY on
 *     ResizeObserver. Textarea caps at ~8 rows then inner-scrolls.
 *   - NO load-time draw-in (Web owns the drawn line); the wire rests fully
 *     drawn in ink-alpha. Red enters only as state signal.
 *   - NO Caveat signature (Sight's hand), NO H1 variable-font breath (Web's
 *     axis choreography) — H1 renders statically at wdth 120 / wght 750.
 *   - Magnetic send button STAYS (the one magnetic element on the site,
 *     ≤6px, pointer:fine). Read-time odometer stays as garnish.
 *   - Native theme, NO chrome pin — existing --c4-* tokens only.
 *   - Head byte-identical to the redirect-stub baseline, incl. noIndex.
 *   - Success DOM commits before the send theatre plays; Turnstile/security
 *     failure degrades honestly to mailto.
 *
 * DEPENDENCY (chair-owned): public/_redirects still 301s /Contact → /Support.
 * The chair deletes that line at commit/merge; until then this page is only
 * reachable via client-side navigation.
 *
 * Endpoint: the proven submitSupportRequest → POST /api/support pipeline,
 * category "general", priority "medium", subject prefixed "[Direct line]",
 * honeypot + _loaded + Turnstile — identical field contract to /Support.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import useDocumentHead from '@/hooks/useDocumentHead';
import { submitSupportRequest, SubmissionError } from '@/api/submissions';
import TurnstileWidget from '@/components/c4/TurnstileWidget';
import '../components/contact/contact.css';

const EMAIL = 'caleb@c4studios.com.au';
const READ_WPM = 200; // honest reading speed for the odometer garnish

/* ── Perth time (fact + standing promise; never fake presence) ───────── */
function perthParts(date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Perth',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      weekday: 'short',
    }).formatToParts(date);
    const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
    return {
      hh: get('hour'),
      mm: get('minute'),
      hour: parseInt(get('hour'), 10) || 0,
      weekday: get('weekday'),
    };
  } catch {
    return null;
  }
}

function isBusinessHours(clock) {
  if (!clock) return false;
  const weekend = clock.weekday === 'Sat' || clock.weekday === 'Sun';
  return !weekend && clock.hour >= 8 && clock.hour < 18;
}

/* ── Send-failure copy — keep the page's voice, never raw fetch jargon.
      SubmissionError carries a human server/HTTP message; anything else
      (network drop → browser TypeError "Failed to fetch") gets a voiced
      line instead of spliced jargon. ── */
function sendErrorLine(err) {
  if (!(err instanceof SubmissionError)) return 'The wire dropped — nothing was sent.';
  if (err.status === 403) return 'The send couldn’t be verified.';
  return err.message;
}

/* ── Read-time odometer (mono garnish, 3-digit scale) ────────────────── */
function OdoDigit({ digit }) {
  return (
    <span className="ct-odo-digit">
      <span className="ct-odo-reel" style={{ transform: `translateY(-${digit}em)` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  );
}

function ReadOdometer({ seconds, on }) {
  const clamped = Math.min(999, Math.max(1, seconds));
  const digits = String(clamped).split('');
  return (
    <span className={`ct-odo${on ? ' is-on' : ''}`} aria-hidden="true">
      <span>~</span>
      {digits.map((d, i) => (
        <OdoDigit key={digits.length - i} digit={Number(d)} />
      ))}
      <span>s read</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   The page
   ═══════════════════════════════════════════════════════════════════════ */
export default function Contact() {
  useDocumentHead({
    title: 'Contact — C4 Studios',
    description: 'Contact C4 Studios. Redirecting to support and project enquiries.',
    path: '/Contact',
    noIndex: true,
  });

  /* staticMode — house pattern: prerenderer UA or reduced motion means the
     at-rest DOM is the finished page and no animation ever arms. */
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
  const finePointer = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: fine)').matches,
    [],
  );

  /* ── form state ── */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [gotcha, setGotcha] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sent, setSent] = useState(false);
  const [receiptTime, setReceiptTime] = useState('');
  const [copied, setCopied] = useState(false);

  const loadedAt = useRef(Date.now());
  const turnstileToken = useRef(null);
  const copyTimer = useRef(null);

  const nameOk = name.trim().length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const msgOk = message.trim().length > 0;
  const allOk = nameOk && emailOk && msgOk;
  const touched = name.length > 0 || email.length > 0 || message.length > 0;

  /* ── Perth clock — the page's ONE continuous thing: one interval/min,
        a text swap, not an animation (memo §2.3) — so it is gated on
        PRERENDER only, not reduced motion: reduced-motion humans keep the
        telemetry and the after-hours line. Prerender gets the static label
        (no frozen snapshot time). ── */
  const [clock, setClock] = useState(() => (prerender ? null : perthParts()));
  useEffect(() => {
    if (prerender) return undefined;
    const id = setInterval(() => setClock(perthParts()), 60000);
    return () => clearInterval(id);
  }, [prerender]);

  /* ── wire geometry — measured from layout slots, ResizeObserver only ── */
  const instrumentRef = useRef(null);
  const youRef = useRef(null);
  const calebRef = useRef(null);
  const nameRowRef = useRef(null);
  const emailRowRef = useRef(null);
  const msgRowRef = useRef(null);
  const sendRowRef = useRef(null);
  const sentLineRef = useRef(null);
  const pulseRef = useRef(null);
  const calebDotRef = useRef(null);
  const calebFlareRef = useRef(null);
  const receiptRef = useRef(null);
  const sendBtnRef = useRef(null);

  const [geom, setGeom] = useState(null);
  const geomRef = useRef(null);

  const measure = useCallback(() => {
    const col = instrumentRef.current;
    const you = youRef.current;
    const caleb = calebRef.current;
    if (!col || !you || !caleb) return;
    const cr = col.getBoundingClientRect();
    if (cr.width === 0) return;
    const mid = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return r.top - cr.top + r.height / 2;
    };
    const youDot = you.querySelector('.ct-node-dot') || you;
    const dotRect = youDot.getBoundingClientRect();
    const next = {
      w: Math.max(1, Math.round(cr.width)),
      h: Math.max(1, Math.round(cr.height)),
      x: dotRect.left - cr.left + dotRect.width / 2,
      you: mid(you),
      name: mid(nameRowRef.current),
      email: mid(emailRowRef.current),
      msg: mid(msgRowRef.current),
      send: mid(sendRowRef.current),
      caleb: mid(caleb),
    };
    geomRef.current = next;
    setGeom(next);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, sent]);

  useLayoutEffect(() => {
    const col = instrumentRef.current;
    if (!col || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => measure());
    ro.observe(col);
    return () => ro.disconnect();
  }, [measure]);

  /* ── send theatre — plays only AFTER the 2xx and AFTER the receipt DOM
        has committed (truth before theatre). Reduced motion: instant. ── */
  const theatrePlayed = useRef(false);
  useLayoutEffect(() => {
    if (!sent || staticMode || theatrePlayed.current) return undefined;
    theatrePlayed.current = true;
    const g = geomRef.current;
    const wire = sentLineRef.current;
    const pulse = pulseRef.current;
    const dot = calebDotRef.current;
    const flare = calebFlareRef.current;
    const receipt = receiptRef.current;
    if (!g || g.you == null || g.caleb == null) return undefined;
    const dist = Math.max(1, g.caleb - g.you);
    /* Truth before theatre, defensively: everything below initialises on
       the FIRST ticker tick (immediateRender:false tweens at 0, plus one
       set() at position 0), which in a live browser lands before the first
       paint. If the ticker never ticks, nothing applies — the receipt and
       the red wire simply rest complete. */
    const tl = gsap.timeline();
    if (wire) {
      tl.fromTo(
        wire,
        { strokeDasharray: dist, strokeDashoffset: dist },
        { strokeDashoffset: 0, duration: 0.5, ease: 'power2.in', immediateRender: false },
        0,
      );
    }
    if (pulse) {
      tl.fromTo(
        pulse,
        { attr: { cy: g.you }, opacity: 1 },
        { attr: { cy: g.caleb }, opacity: 1, duration: 0.5, ease: 'power2.in', immediateRender: false },
        0,
      );
      tl.to(pulse, { opacity: 0, duration: 0.18, ease: 'power1.out' }, 0.52);
    }
    if (dot) {
      tl.fromTo(
        dot,
        { scale: 1 },
        {
          scale: 1.55,
          duration: 0.13,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
          immediateRender: false,
        },
        0.46,
      );
    }
    if (flare) {
      tl.fromTo(
        flare,
        { scale: 0.4, opacity: 0.9 },
        { scale: 2.4, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false },
        0.5,
      );
    }
    if (receipt && receipt.children.length) {
      /* NOT a from() at 0.55s — a from with immediateRender:false applies
         its start values only when the playhead REACHES it, so the painted
         receipt would blink out at the theatre beat and re-enter. The
         zero-duration set() at position 0 hides it on the first tick,
         pre-paint; a dead ticker never applies it. */
      tl.set(receipt.children, { y: 14, autoAlpha: 0 }, 0);
      tl.to(
        receipt.children,
        { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.07, ease: 'power3.out' },
        0.55,
      );
    }
    return () => tl.kill();
  }, [sent, staticMode]);

  /* ── keyboard/AT: the focused send button unmounts on success, which
        would drop focus to <body> and restart Tab from the nav. Land it on
        the receipt instead (staticMode and animated paths alike) so the
        next Tab continues into the /start and /Support re-offers. ── */
  useLayoutEffect(() => {
    if (!sent) return;
    receiptRef.current?.focus({ preventScroll: true });
  }, [sent]);

  /* ── magnetic send — the single magnetic element on the site (≤6px,
        pointer:fine only, dead under staticMode). Listeners are scoped to
        the instrument column, not window: idle pointer traffic over the
        left column never forces a layout read, and pointerleave settles
        the button home. ── */
  useEffect(() => {
    if (staticMode || !finePointer || sent) return undefined;
    const btn = sendBtnRef.current;
    const col = instrumentRef.current;
    if (!btn || !col) return undefined;
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
    const onMove = (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const RADIUS = 130;
      if (dist < RADIUS && dist > 0) {
        const pull = (1 - dist / RADIUS) * 6; // hard cap 6px
        xTo((dx / dist) * pull);
        yTo((dy / dist) * pull);
      } else {
        xTo(0);
        yTo(0);
      }
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    col.addEventListener('pointermove', onMove, { passive: true });
    col.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      col.removeEventListener('pointermove', onMove);
      col.removeEventListener('pointerleave', onLeave);
      gsap.set(btn, { x: 0, y: 0 });
    };
  }, [staticMode, finePointer, sent]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  /* ── helpers ── */
  const wiggle = (el) => {
    if (!el || staticMode || !finePointer) return;
    gsap.fromTo(
      el,
      { x: 0 },
      { x: 2, duration: 0.04, repeat: 3, yoyo: true, ease: 'none', clearProps: 'x' },
    );
  };

  const deriveSubject = () => {
    const snippet = message.trim().split(/\s+/).slice(0, 8).join(' ');
    const snip = snippet.length > 60 ? `${snippet.slice(0, 57)}…` : snippet;
    return `[Direct line] ${name.trim()}${snip ? ` — ${snip}` : ''}`.slice(0, 120);
  };

  const readSeconds = useMemo(() => {
    const words = message.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.round((words / READ_WPM) * 60));
  }, [message]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 900);
    } catch {
      /* clipboard unavailable — the mailto link is right beside it */
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || sent) return;

    const nextErrors = {};
    if (!nameOk) nextErrors.name = 'Your name, so the reply has one.';
    if (!emailOk) nextErrors.email = 'Check the address — the reply lands there.';
    if (!msgOk) nextErrors.message = 'Write something for the wire to carry.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      if (nextErrors.name) wiggle(nameRowRef.current);
      if (nextErrors.email) wiggle(emailRowRef.current);
      if (nextErrors.message) wiggle(msgRowRef.current);
      return;
    }

    setSubmitting(true);
    setSendError(null);
    try {
      await submitSupportRequest({
        name: name.trim(),
        email: email.trim(),
        category: 'general',
        priority: 'medium',
        order_number: '',
        subject: deriveSubject(),
        message,
        _gotcha: gotcha,
        _loaded: loadedAt.current,
        turnstileToken: turnstileToken.current,
      });
      const t = perthParts();
      setReceiptTime(t ? `${t.hh}:${t.mm}` : '');
      setSent(true); // receipt DOM commits here — theatre follows the truth
    } catch (err) {
      setSendError(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── derived UI bits ── */
  const business = isBusinessHours(clock);
  const mailtoFallback = `mailto:${EMAIL}?subject=${encodeURIComponent(
    deriveSubject(),
  )}&body=${encodeURIComponent(message)}`;

  const segments =
    geom && !sent
      ? [
          { key: 's1', from: geom.you, to: geom.name, live: name.trim().length > 0 },
          { key: 's2', from: geom.name, to: geom.email, live: nameOk },
          { key: 's3', from: geom.email, to: geom.msg, live: emailOk },
          { key: 's4', from: geom.msg, to: geom.send, live: msgOk },
        ].filter((s) => s.from != null && s.to != null)
      : [];

  return (
    <div className="ct-page">
      <section className="ct-fold">
        {/* ── Left: the promise ─────────────────────────────────────── */}
        <div className="ct-intro">
          <h1 className="ct-h1">The direct line.</h1>
          <p className="ct-lede">
            No account managers, no ticket queue. Messages sent here land in
            Caleb&rsquo;s inbox, and he replies — himself — within one business day.
          </p>

          <p className="ct-telemetry">
            {clock ? (
              <>
                PERTH {clock.hh}:{clock.mm} AWST ·{' '}
                {business
                  ? 'sent now, read today'
                  : 'send it anyway — it’ll be waiting at the top of the inbox'}
              </>
            ) : (
              'PERTH · AWST'
            )}
          </p>

          <nav className="ct-reroutes" aria-label="Other ways in">
            <Link className="ct-reroute" to="/start">
              <span className="ct-reroute-q">Scoping a build?</span>
              <span className="ct-reroute-d">
                The full brief form <span className="ct-arrow" aria-hidden="true">→</span>
              </span>
            </Link>
            <Link className="ct-reroute" to="/Support">
              <span className="ct-reroute-q">
                Existing client, or here about ReBook, CrewCheck, SafeDraft or
                Nudge?
              </span>
              <span className="ct-reroute-d">
                Support desk <span className="ct-arrow" aria-hidden="true">→</span>
              </span>
            </Link>
          </nav>
        </div>

        {/* ── Right: the wire ───────────────────────────────────────── */}
        <div className="ct-instrument" ref={instrumentRef}>
          {geom && (
            <svg
              className="ct-wire"
              viewBox={`0 0 ${geom.w} ${geom.h}`}
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              {/* the line rests fully drawn, ink-alpha — no draw-in beat */}
              <line
                className="ct-wire-base"
                x1={geom.x}
                y1="0"
                x2={geom.x}
                y2={geom.caleb ?? geom.h}
              />
              {segments.map((s) => (
                <line
                  key={s.key}
                  className={`ct-wire-seg${s.live ? ' is-live' : ''}`}
                  x1={geom.x}
                  y1={s.from}
                  x2={geom.x}
                  y2={s.to}
                />
              ))}
              {sent && geom.you != null && geom.caleb != null && (
                <line
                  ref={sentLineRef}
                  className="ct-wire-sent"
                  x1={geom.x}
                  y1={geom.you}
                  x2={geom.x}
                  y2={geom.caleb}
                />
              )}
              {!staticMode && (
                <circle className="ct-pulse" ref={pulseRef} cx={geom.x} cy={geom.you ?? 0} r="4" />
              )}
            </svg>
          )}

          <div className={`ct-node ct-node--you${touched || sent ? ' is-live' : ''}`} ref={youRef}>
            <span className="ct-node-dot" aria-hidden="true" />
            <span className="ct-node-label">YOU</span>
          </div>

          {sent ? (
            <div className="ct-receipt" ref={receiptRef} role="status" tabIndex={-1}>
              <p className="ct-receipt-stamp">RECEIVED {receiptTime ? `${receiptTime} ` : ''}AWST</p>
              <p className="ct-receipt-line">
                reply from {EMAIL} within one business day
              </p>
              <p className="ct-receipt-body">
                Your message is on the wire — no queue, no ticket number. It lands
                at the top of Caleb&rsquo;s inbox.
              </p>
              <div className="ct-receipt-links">
                <Link to="/start">Start a project brief →</Link>
                <Link to="/Support">Support desk →</Link>
              </div>
            </div>
          ) : (
            <form className="ct-form" onSubmit={handleSubmit} noValidate>
              <div
                className={`ct-field${name ? ' has-value' : ''}${errors.name ? ' is-error' : ''}`}
                ref={nameRowRef}
              >
                <label className="ct-label" htmlFor="ct-name">
                  Name
                </label>
                <input
                  className="ct-input"
                  id="ct-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  aria-invalid={errors.name ? 'true' : undefined}
                  aria-describedby={errors.name ? 'ct-err-name' : undefined}
                />
                <span className="ct-underline" aria-hidden="true" />
                {errors.name && (
                  <p className="ct-error" id="ct-err-name">
                    {errors.name}
                  </p>
                )}
              </div>

              <div
                className={`ct-field${email ? ' has-value' : ''}${emailOk ? ' is-ok' : ''}${
                  errors.email ? ' is-error' : ''
                }`}
                ref={emailRowRef}
              >
                <label className="ct-label" htmlFor="ct-email">
                  Email
                </label>
                <input
                  className="ct-input"
                  id="ct-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={errors.email ? 'ct-err-email' : undefined}
                />
                <svg className="ct-tick" viewBox="0 0 15 12" aria-hidden="true" focusable="false">
                  <path d="M1.5 6.4 5.4 10.3 13.5 1.7" />
                </svg>
                <span className="ct-underline" aria-hidden="true" />
                {errors.email && (
                  <p className="ct-error" id="ct-err-email">
                    {errors.email}
                  </p>
                )}
              </div>

              <div
                className={`ct-field${message ? ' has-value' : ''}${
                  errors.message ? ' is-error' : ''
                }`}
                ref={msgRowRef}
              >
                <label className="ct-label" htmlFor="ct-message">
                  Message
                </label>
                <textarea
                  className="ct-input"
                  id="ct-message"
                  name="message"
                  rows={3}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                    /* auto-grow to ~8 rows, then the textarea scrolls inside
                       itself; the wire only ever re-measures via the
                       ResizeObserver picking up the column's height change. */
                    const el = e.target;
                    el.style.height = 'auto';
                    el.style.height = `${el.scrollHeight}px`;
                  }}
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'ct-err-message' : undefined}
                />
                <span className="ct-underline" aria-hidden="true" />
                {errors.message && (
                  <p className="ct-error" id="ct-err-message">
                    {errors.message}
                  </p>
                )}
                <div className="ct-msgmeta">
                  <ReadOdometer seconds={readSeconds} on={msgOk} />
                </div>
              </div>

              {/* honeypot — humans never see it, bots love it */}
              <div className="ct-hp" aria-hidden="true">
                <label htmlFor="ct-gotcha">Leave this field empty</label>
                <input
                  id="ct-gotcha"
                  name="_gotcha"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={gotcha}
                  onChange={(e) => setGotcha(e.target.value)}
                />
              </div>

              <div className="ct-turnstile">
                <TurnstileWidget
                  onToken={(token) => {
                    turnstileToken.current = token;
                  }}
                  onExpire={() => {
                    turnstileToken.current = null;
                  }}
                />
              </div>

              <div className="ct-sendrow" ref={sendRowRef}>
                <button
                  className={`ct-send${allOk ? ' is-ready' : ''}`}
                  type="submit"
                  ref={sendBtnRef}
                  disabled={submitting}
                  aria-busy={submitting || undefined}
                >
                  {submitting ? 'Sending…' : 'Send to Caleb'}
                </button>
                {sendError && (
                  <p className="ct-senderr" role="alert">
                    {sendErrorLine(sendError)} The other end of the wire is still
                    open: <a href={mailtoFallback}>email {EMAIL}</a> — your
                    message goes with you.
                  </p>
                )}
              </div>
            </form>
          )}

          <div className={`ct-node ct-node--caleb${sent ? ' is-live' : ''}`} ref={calebRef}>
            <span className="ct-node-dot" ref={calebDotRef} aria-hidden="true">
              <span className="ct-node-flare" ref={calebFlareRef} aria-hidden="true" />
            </span>
            <span className="ct-node-label">CALEB</span>
            <a className="ct-node-mail" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <button
              type="button"
              className={`ct-copy${copied ? ' is-copied' : ''}`}
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
