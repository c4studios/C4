/**
 * BookingSheet — the primary "Book a call" action for /welcome.
 *
 * Two paths, both shippable today on existing infra (no calendar backend yet):
 *   1. Request a call — a focused form that posts to the existing
 *      /api/inquiries Resend pipeline (service_type: "call"), so Caleb gets
 *      an email the moment someone asks. A real booking calendar can replace
 *      this view later without touching the rest of the page.
 *   2. Lock in a price now — embeds the live Quotr calculator (the same
 *      `fixm4qeq` slug + theme handshake used on the home hero), so a prospect
 *      can self-serve an instant, budget-attached quote.
 *
 * Mobile-first: full-screen sheet on phones, centred card on larger screens.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calculator, X, ArrowLeft } from 'lucide-react';
import { submitProjectInquiry } from '@/api/submissions';
import { buildQuotrSrc, postQuotrTheme } from '@/components/home/quotrTheme';
import TurnstileWidget from '@/components/c4/TurnstileWidget';
import SubmitButton from '@/components/c4/SubmitButton';
import SubmissionSuccess from '@/components/c4/SubmissionSuccess';

const ease = [0.22, 1, 0.36, 1];
const QUOTR_SLUG = 'fixm4qeq';

const INK = '#414243';
const INK_SOFT = '#6C6D6D';
const ACCENT = '#A30000';
const LINE = 'rgba(65,66,67,0.16)';

const TIMES = [
  { key: 'asap', label: 'ASAP' },
  { key: 'this_week', label: 'This week' },
  { key: 'next_week', label: 'Next week' },
  { key: 'email_first', label: 'Just email me' },
];

function ChoiceButton({ icon: Icon, title, sub, onClick, primary }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 rounded-lg px-5 py-4 text-left transition-transform duration-300 active:scale-[0.98]"
      style={
        primary
          ? { backgroundColor: INK, color: '#F3F2F3' }
          : { backgroundColor: '#FFFFFF', color: INK, border: `1px solid ${LINE}` }
      }
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: primary ? 'rgba(255,255,255,0.12)' : 'rgba(163,0,0,0.08)',
          color: primary ? '#F3F2F3' : ACCENT,
        }}
      >
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold tracking-[-0.01em]">{title}</span>
        <span
          className="block text-[12.5px] leading-[1.45] mt-0.5"
          style={{ color: primary ? 'rgba(243,242,243,0.7)' : INK_SOFT }}
        >
          {sub}
        </span>
      </span>
    </button>
  );
}

function CallForm({ onBack }) {
  const loadedAt = useRef(Date.now());
  const turnstileToken = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', time: 'asap', note: '', _gotcha: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const timeLabel = TIMES.find((t) => t.key === form.time)?.label || form.time;
      await submitProjectInquiry({
        name: form.name,
        email: form.email,
        service_type: 'call',
        budget: 'not_sure',
        description: [
          'Call request from the C4 networking card (/welcome).',
          `Preferred timing: ${timeLabel}.`,
          form.note && `Note: ${form.note}`,
        ]
          .filter(Boolean)
          .join('\n'),
        timeline: timeLabel,
        _gotcha: form._gotcha,
        _loaded: loadedAt.current,
        turnstileToken: turnstileToken.current,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting || submitted || error) {
    return (
      <SubmissionSuccess
        submitting={submitting}
        submitted={submitted}
        error={error}
        onRetry={() => setError(null)}
        retryLabel="Back to form"
        accentLabel="Call request"
        headline="Let's talk soon"
        message="Caleb will email you to lock in a time. Usually within a few hours."
      />
    );
  }

  const fieldStyle = {
    backgroundColor: '#FFFFFF',
    border: `1px solid ${LINE}`,
    color: INK,
  };
  const fieldClass = 'w-full rounded-md px-4 py-3 text-[14px] focus:outline-none';
  const labelClass = 'block text-[11px] uppercase tracking-[0.14em] font-medium mb-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium"
        style={{ color: INK_SOFT }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div>
        <label className={labelClass} style={{ color: INK_SOFT }}>Name</label>
        <input
          className={fieldClass}
          style={fieldStyle}
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div>
        <label className={labelClass} style={{ color: INK_SOFT }}>Email</label>
        <input
          className={fieldClass}
          style={fieldStyle}
          type="email"
          required
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label className={labelClass} style={{ color: INK_SOFT }}>When suits?</label>
        <div className="flex flex-wrap gap-2">
          {TIMES.map((t) => {
            const on = form.time === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => update('time', t.key)}
                className="px-3.5 py-2 text-[12.5px] font-medium rounded-md transition-colors duration-200"
                style={
                  on
                    ? { backgroundColor: INK, color: '#F3F2F3', border: `1px solid ${INK}` }
                    : { backgroundColor: '#FFFFFF', color: INK_SOFT, border: `1px solid ${LINE}` }
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className={labelClass} style={{ color: INK_SOFT }}>
          Anything to add? <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
        </label>
        <textarea
          className={fieldClass + ' resize-none'}
          style={{ ...fieldStyle, minHeight: 84 }}
          value={form.note}
          onChange={(e) => update('note', e.target.value)}
          placeholder="What's the project? Even a sentence helps."
        />
      </div>

      {/* Honeypot */}
      <div aria-hidden="true" tabIndex={-1} style={{ position: 'absolute', left: '-9999px' }}>
        <input
          type="text"
          name="_gotcha"
          value={form._gotcha}
          onChange={(e) => update('_gotcha', e.target.value)}
          autoComplete="off"
        />
      </div>

      <TurnstileWidget
        onToken={(t) => { turnstileToken.current = t; }}
        onExpire={() => { turnstileToken.current = null; }}
      />

      <SubmitButton submitting={submitting} label="Request call" loadingLabel="Sending" />
    </form>
  );
}

function QuoteView({ onBack }) {
  const iframeRef = useRef(null);
  const [src] = useState(() => buildQuotrSrc(QUOTR_SLUG, false));

  return (
    <div className="flex flex-col h-full">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium mb-3"
        style={{ color: INK_SOFT }}
      >
        <ArrowLeft size={14} /> Back
      </button>
      <div
        className="flex-1 min-h-[60vh] overflow-hidden rounded-lg"
        style={{ border: `1px solid ${LINE}`, backgroundColor: '#FFFFFF' }}
      >
        <iframe
          ref={iframeRef}
          title="C4 instant quote — Quotr"
          src={src}
          className="w-full h-full"
          style={{ border: 0, minHeight: '60vh' }}
          loading="lazy"
          onLoad={() => postQuotrTheme(iframeRef.current, false)}
        />
      </div>
    </div>
  );
}

export default function BookingSheet({ open, onClose }) {
  const [view, setView] = useState('choose'); // choose | call | quote

  // Reset to the chooser each time the sheet is opened.
  useEffect(() => {
    if (open) setView('choose');
  }, [open]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Escape to close.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="flex items-end justify-center sm:items-center"
          // Inline position so a host page's stacking rules can never clobber it.
          style={{ position: 'fixed', inset: 0, zIndex: 100 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(26,26,26,0.45)', backdropFilter: 'blur(2px)' }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Book a call with C4 Studios"
            className="relative w-full sm:max-w-[460px] max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl px-6 pt-6 pb-8 sm:pb-6"
            style={{ backgroundColor: '#E8E4DB' }}
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.6 }}
            transition={{ duration: 0.34, ease }}
          >
            {/* Grab handle (mobile) */}
            <div
              className="sm:hidden mx-auto mb-4 h-1 w-10 rounded-full"
              style={{ backgroundColor: 'rgba(65,66,67,0.22)' }}
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
              style={{ color: INK_SOFT, backgroundColor: 'rgba(255,255,255,0.5)' }}
            >
              <X size={16} />
            </button>

            <AnimatePresence mode="wait">
              {view === 'choose' && (
                <motion.div
                  key="choose"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease }}
                >
                  <h2
                    className="text-[1.4rem] font-semibold tracking-[-0.03em] leading-[1.1] pr-8"
                    style={{ color: INK }}
                  >
                    Let&apos;s make something.
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-[1.55]" style={{ color: INK_SOFT }}>
                    Book a quick call, or get an instant ballpark price in about two minutes.
                  </p>
                  <div className="mt-6 space-y-3">
                    <ChoiceButton
                      icon={Phone}
                      title="Book a call"
                      sub="A 15-min chat about your project. Caleb replies fast."
                      onClick={() => setView('call')}
                      primary
                    />
                    <ChoiceButton
                      icon={Calculator}
                      title="Lock in a price now"
                      sub="Answer a few questions, see a transparent range instantly."
                      onClick={() => setView('quote')}
                    />
                  </div>
                </motion.div>
              )}

              {view === 'call' && (
                <motion.div
                  key="call"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease }}
                >
                  <CallForm onBack={() => setView('choose')} />
                </motion.div>
              )}

              {view === 'quote' && (
                <motion.div
                  key="quote"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease }}
                  className="h-[78vh]"
                >
                  <QuoteView onBack={() => setView('choose')} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
