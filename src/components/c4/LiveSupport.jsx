import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Headphones, X } from 'lucide-react';
import { submitSupportRequest } from '@/api/submissions';
import TurnstileWidget from './TurnstileWidget';
import useStaticMode from '@/hooks/useStaticMode';
import './livesupport.css';

/**
 * Live support — a request drawer available on every page.
 *
 * A small fixed button opens a sheet with four fields. The request posts to
 * the existing /api/support function (category "live_support", priority
 * "high"), so it lands in the same inbox as the support form, and the copy
 * promises only what the site already promises elsewhere: Caleb replies
 * himself within one business day. The Perth clock is fact, not a promise.
 *
 * Any component can open it with
 *   window.dispatchEvent(new CustomEvent('c4:live-support'))
 * which the Support page's "Live support" card does.
 *
 * Hidden on /Lens, which is a sealed world with its own chrome, and on the
 * prerenderer, which should capture the page without a modal in the tree.
 */
const OPEN_EVENT = 'c4:live-support';

function perthTime() {
  try {
    return new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Perth', hour: 'numeric', minute: '2-digit', hour12: true,
    }).format(new Date()).replace(/\s?(am|pm)/i, ' $1').trim();
  } catch {
    return null;
  }
}

export default function LiveSupport() {
  const location = useLocation();
  const staticMode = useStaticMode();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', _gotcha: '' });
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState(null);
  const [clock, setClock] = useState(() => perthTime());
  const triggerRef = useRef(null);
  const firstFieldRef = useRef(null);
  const loadedAt = useRef(Date.now());
  const turnstileToken = useRef(null);

  /* Cloudflare 308-normalises prerendered paths to their slash form, so compare without it. */
  const hiddenHere = location.pathname.replace(/\/+$/, '').toLowerCase() === '/lens';

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => firstFieldRef.current?.focus(), staticMode ? 0 : 340);
    const tick = setInterval(() => setClock(perthTime()), 30000);
    setClock(perthTime());
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
      clearInterval(tick);
    };
  }, [open, close, staticMode]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState('sending');
    setError(null);
    try {
      const phoneLine = form.phone.trim() ? `Phone: ${form.phone.trim()}\n\n` : '';
      await submitSupportRequest({
        name: form.name,
        email: form.email,
        category: 'live_support',
        priority: 'high',
        subject: 'Live support request',
        message: `${phoneLine}${form.message}`,
        _gotcha: form._gotcha,
        _loaded: loadedAt.current,
        turnstileToken: turnstileToken.current,
      });
      setState('sent');
    } catch (err) {
      setState('error');
      setError(err?.message || 'The request did not send. Email caleb@c4studios.com.au instead.');
    }
  };

  if (staticMode || hiddenHere) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="ls-trigger"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        hidden={open}
      >
        <Headphones size={15} strokeWidth={2} aria-hidden="true" />
        <span>Support</span>
      </button>

      {open && (
        <div className="ls-root">
          <div className="ls-scrim" onClick={close} aria-hidden="true" />
          <section
            className="ls-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ls-title"
          >
            <div className="ls-head">
              <h2 id="ls-title" className="ls-title">Live support</h2>
              <button type="button" className="ls-close" onClick={close} aria-label="Close">
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            {state === 'sent' ? (
              <div className="ls-sent">
                <p className="ls-sent-line">Sent. Caleb has it.</p>
                <p className="ls-lede">
                  He replies himself, within one business day. If it cannot wait, email{' '}
                  <a href="mailto:caleb@c4studios.com.au">caleb@c4studios.com.au</a>.
                </p>
                <button type="button" className="ls-submit" onClick={close}>Done</button>
              </div>
            ) : (
              <form className="ls-form" onSubmit={handleSubmit}>
                <p className="ls-lede">
                  A short request that goes straight to Caleb, who replies himself
                  within one business day. Leave a number if you would rather a call.
                </p>
                {clock && <p className="ls-clock">It is {clock} in Perth.</p>}

                <div className="ls-grid">
                  <div className="ls-field">
                    <label htmlFor="ls-name">Name</label>
                    <input id="ls-name" ref={firstFieldRef} required autoComplete="name" value={form.name} onChange={update('name')} />
                  </div>
                  <div className="ls-field">
                    <label htmlFor="ls-email">Email</label>
                    <input id="ls-email" type="email" required autoComplete="email" value={form.email} onChange={update('email')} />
                  </div>
                </div>
                <div className="ls-field">
                  <label htmlFor="ls-phone">Phone <span className="ls-opt">if you would rather a call</span></label>
                  <input id="ls-phone" type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} />
                </div>
                <div className="ls-field">
                  <label htmlFor="ls-message">What is happening</label>
                  <textarea id="ls-message" required minLength={5} rows={4} value={form.message} onChange={update('message')} />
                </div>

                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
                  <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" value={form._gotcha} onChange={update('_gotcha')} />
                </div>

                <TurnstileWidget
                  onToken={(t) => { turnstileToken.current = t; }}
                  onExpire={() => { turnstileToken.current = null; }}
                />

                {state === 'error' && (
                  <p className="ls-error" role="alert">{error}</p>
                )}

                <div className="ls-actions">
                  <button type="submit" className="ls-submit" disabled={state === 'sending'}>
                    {state === 'sending' ? 'Sending' : 'Send request'}
                  </button>
                  <a className="ls-alt" href="mailto:caleb@c4studios.com.au">or email Caleb directly</a>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
