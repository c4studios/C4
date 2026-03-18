import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import C4Logo from './C4Logo';

const ease = [0.22, 1, 0.36, 1];

/* ── Haptic pulse — subtle double-tap feel ── */
function triggerHaptic() {
  try {
    if (navigator?.vibrate) {
      navigator.vibrate([12, 40, 12]);
    }
  } catch (_) {
    /* Haptic API unavailable — silent */
  }
}

/* ── Animated SVG Checkmark — draws itself on mount ── */
function AnimatedCheckmark() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="mx-auto"
    >
      <motion.circle
        cx="22"
        cy="22"
        r="20.5"
        stroke="var(--c4-text)"
        strokeWidth="0.8"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
      />
      <motion.path
        d="M14 22.5L19.5 28L30 17"
        stroke="var(--c4-text)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.7, ease }}
      />
    </svg>
  );
}

/* ── Animated SVG Cross — draws itself for error state ── */
function AnimatedCross() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="mx-auto"
    >
      <motion.circle
        cx="22"
        cy="22"
        r="20.5"
        stroke="var(--c4-accent)"
        strokeWidth="0.8"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 0.8, ease }}
      />
      <motion.path
        d="M16 16L28 28"
        stroke="var(--c4-accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6, ease }}
      />
      <motion.path
        d="M28 16L16 28"
        stroke="var(--c4-accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.75, ease }}
      />
    </svg>
  );
}

/* ── Rotating orbit ring around the logo during loading ── */
function OrbitRing() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      className="absolute inset-0 m-auto pointer-events-none"
    >
      <motion.circle
        cx="40"
        cy="40"
        r="38"
        stroke="var(--c4-border)"
        strokeWidth="0.6"
        fill="none"
        strokeDasharray="5 6"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  );
}

/* ── Styled navigation button ── */
function NavButton({ icon: Icon, label, onClick, primary = false }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-all duration-300 rounded-sm"
      style={
        primary
          ? {
              backgroundColor: 'var(--c4-text)',
              color: 'var(--c4-bg)',
            }
          : {
              backgroundColor: 'transparent',
              color: 'var(--c4-text-muted)',
              border: '1px solid var(--c4-border)',
            }
      }
    >
      <Icon size={13} strokeWidth={1.8} />
      {label}
    </motion.button>
  );
}

/**
 * SubmissionSuccess — Premium loading → success / error transition
 *
 * Renders a C4 logo breathing animation while submitting,
 * then morphs into either a checkmark success state or a
 * cross error state with navigation buttons.
 *
 * @param {Object}   props
 * @param {boolean}  props.submitting     Currently sending data
 * @param {boolean}  props.submitted      Submission completed successfully
 * @param {Error}    [props.error]        Error object (triggers error phase)
 * @param {Function} [props.onRetry]      Called when user clicks "Try again"
 * @param {string}   [props.retryLabel]   Label for retry button (e.g. "Back to Support")
 * @param {string}   props.headline       Success message headline
 * @param {string}   props.message        Success message body
 * @param {string}   [props.accentLabel]  Small uppercase label above headline
 * @param {Array}    [props.steps]        Array of { num: string, text: string }
 */
export default function SubmissionSuccess({
  submitting = false,
  submitted = false,
  error = null,
  onRetry,
  retryLabel = 'Try again',
  headline = 'Received',
  message = '',
  accentLabel = null,
  steps = null,
}) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('loading'); // 'loading' | 'success' | 'error'
  const prefersReducedMotion = useReducedMotion();
  const refId = useRef(
    Math.random().toString(36).slice(2, 8).toUpperCase()
  );
  const timestampRef = useRef(new Date());

  /* Transition from loading → success */
  useEffect(() => {
    if (submitted && phase === 'loading') {
      const delay = prefersReducedMotion ? 100 : 600;
      const t = setTimeout(() => {
        setPhase('success');
        triggerHaptic();
      }, delay);
      return () => clearTimeout(t);
    }
  }, [submitted, phase, prefersReducedMotion]);

  /* Transition from loading → error */
  useEffect(() => {
    if (error && phase === 'loading') {
      const delay = prefersReducedMotion ? 100 : 600;
      const t = setTimeout(() => {
        setPhase('error');
      }, delay);
      return () => clearTimeout(t);
    }
  }, [error, phase, prefersReducedMotion]);

  const formattedDate = useMemo(
    () =>
      timestampRef.current.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    []
  );

  /* Reduced-motion: skip all animation durations to 0 */
  const dur = (d) => (prefersReducedMotion ? 0 : d);

  return (
    <div
      className="flex items-center justify-center min-h-[55vh]"
      role="status"
      aria-live="polite"
      aria-label={
        phase === 'loading'
          ? 'Sending your message'
          : phase === 'error'
            ? 'Something went wrong'
            : headline
      }
    >
      <AnimatePresence mode="wait">
        {/* ━━━ Loading phase ━━━ */}
        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: dur(0.4), ease }}
            className="flex flex-col items-center relative"
          >
            <div className="relative w-[80px] h-[80px] flex items-center justify-center">
              <OrbitRing />
              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                  opacity: [0.65, 1, 0.65],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <C4Logo size={44} variant="mark" context="header" />
              </motion.div>
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-7 text-[10px] uppercase tracking-[0.22em] font-medium"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              Sending
              <span className="c4-typed-cursor">|</span>
            </motion.span>
          </motion.div>
        )}

        {/* ━━━ Success phase ━━━ */}
        {phase === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur(0.5), ease }}
            className="max-w-[480px] mx-auto px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease }}
              className="mb-8"
            >
              <AnimatedCheckmark />
            </motion.div>

            {accentLabel && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="block text-[10px] uppercase tracking-[0.25em] font-medium mb-4"
                style={{ color: 'var(--c4-text-subtle)' }}
              >
                {accentLabel}
              </motion.span>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              className="text-[1.6rem] md:text-[2.2rem] font-semibold tracking-[-0.035em] leading-[1.1]"
              style={{ color: 'var(--c4-text)' }}
            >
              {headline}
            </motion.h1>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65, ease }}
                className="mt-4 text-[14px] leading-[1.65] max-w-[400px] mx-auto"
                style={{ color: 'var(--c4-text-muted)' }}
              >
                {message}
              </motion.p>
            )}

            {steps && steps.length > 0 && (
              <div className="mt-10 text-left max-w-[360px] mx-auto space-y-4">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.95 + i * 0.12,
                      duration: 0.4,
                      ease,
                    }}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="text-[11px] font-semibold tabular-nums tracking-[0.1em] mt-0.5"
                      style={{ color: 'var(--c4-accent)' }}
                    >
                      {step.num}
                    </span>
                    <span
                      className="text-[13px] leading-[1.6]"
                      style={{ color: 'var(--c4-text-muted)' }}
                    >
                      {step.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.3, duration: 0.6, ease }}
              className="mt-10 h-px w-16 mx-auto origin-center"
              style={{ backgroundColor: 'var(--c4-border)' }}
            />

            {/* Timestamp + reference */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-4 text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--c4-text-faint)' }}
            >
              {formattedDate} · Ref #{refId.current}
            </motion.p>

            {/* Back to home */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.4, ease }}
              className="mt-8"
            >
              <NavButton
                icon={Home}
                label="Back to home"
                onClick={() => navigate('/')}
              />
            </motion.div>
          </motion.div>
        )}

        {/* ━━━ Error phase ━━━ */}
        {phase === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur(0.5), ease }}
            className="max-w-[480px] mx-auto px-6 text-center"
          >
            {/* Animated cross */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease }}
              className="mb-8"
            >
              <AnimatedCross />
            </motion.div>

            {/* Accent label */}
            {accentLabel && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="block text-[10px] uppercase tracking-[0.25em] font-medium mb-4"
                style={{ color: 'var(--c4-text-subtle)' }}
              >
                {accentLabel}
              </motion.span>
            )}

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              className="text-[1.6rem] md:text-[2.2rem] font-semibold tracking-[-0.035em] leading-[1.1]"
              style={{ color: 'var(--c4-text)' }}
            >
              Something went wrong
            </motion.h1>

            {/* Error detail */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65, ease }}
              className="mt-4 text-[14px] leading-[1.65] max-w-[400px] mx-auto"
              style={{ color: 'var(--c4-text-muted)' }}
            >
              {error?.message || 'We couldn\'t process your request. Please try again.'}
            </motion.p>

            {/* Apology note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="mt-3 text-[12.5px] leading-[1.55]"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              We&apos;re sorry for the inconvenience. Your form data has been
              preserved — you can go back and try again.
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.0, duration: 0.6, ease }}
              className="mt-8 h-px w-16 mx-auto origin-center"
              style={{ backgroundColor: 'var(--c4-border)' }}
            />

            {/* Timestamp + reference */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15 }}
              className="mt-4 text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--c4-text-faint)' }}
            >
              {formattedDate} · Ref #{refId.current}
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.45, ease }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              {onRetry && (
                <NavButton
                  icon={ArrowLeft}
                  label={retryLabel}
                  onClick={onRetry}
                  primary
                />
              )}
              <NavButton
                icon={Home}
                label="Back to home"
                onClick={() => navigate('/')}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
