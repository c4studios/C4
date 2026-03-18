import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

/**
 * SubmitButton — Premium animated submit control
 *
 * - Idle:      label + arrow icon
 * - Loading:   animated underline sweep + "Sending…" with cursor blink
 * - Disabled:  reduced opacity, pointer-events none
 *
 * The button maintains its exact dimensions across states to prevent layout shifts.
 */
export default function SubmitButton({
  submitting = false,
  disabled = false,
  label = 'Send brief',
  loadingLabel = 'Sending',
  icon: IconComponent = ArrowRight,
}) {
  return (
    <button
      type="submit"
      disabled={submitting || disabled}
      className="group relative inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-all duration-300 disabled:pointer-events-none overflow-hidden"
      style={{
        backgroundColor: 'var(--c4-text)',
        color: 'var(--c4-bg)',
        opacity: disabled && !submitting ? 0.45 : 1,
      }}
    >
      {/* Animated underline sweep during loading */}
      {submitting && (
        <motion.span
          className="absolute bottom-0 left-0 h-[1.5px]"
          style={{ backgroundColor: 'var(--c4-bg)', opacity: 0.35 }}
          initial={{ width: '0%', left: '0%' }}
          animate={{
            width: ['0%', '100%', '0%'],
            left: ['0%', '0%', '100%'],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Text content — crossfade between states */}
      <AnimatePresence mode="wait" initial={false}>
        {submitting ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease }}
            className="inline-flex items-center gap-1"
          >
            {loadingLabel}
            <span className="c4-typed-cursor" style={{ color: 'var(--c4-bg)' }}>|</span>
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Icon — slides right on hover, fades out during loading */}
      <motion.span
        animate={{ opacity: submitting ? 0 : 0.6 }}
        transition={{ duration: 0.2 }}
        className="group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300"
      >
        <IconComponent size={13} strokeWidth={2} />
      </motion.span>
    </button>
  );
}
