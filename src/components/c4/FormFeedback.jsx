import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldX, RefreshCw } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

/**
 * Classify a SubmissionError into a feedback category.
 *   400 → validation  |  403/429 → security  |  5xx → server
 */
function classifyStatus(status) {
  if (status === 400) return 'validation';
  if (status === 403 || status === 429) return 'security';
  return 'server';
}

const ICONS = {
  validation: AlertCircle,
  security: ShieldX,
  server: RefreshCw,
};

/**
 * FormFeedback — premium inline error panel
 *
 * Appears below the submit button when something goes wrong.
 * Smoothly enters with a slide-fade, and auto-classifies errors
 * from SubmissionError status codes.
 *
 * @param {{ error: Error | null, onDismiss?: () => void }} props
 */
export default function FormFeedback({ error, onDismiss }) {
  const category = error?.status ? classifyStatus(error.status) : 'server';
  const Icon = ICONS[category];

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          key="form-feedback"
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.35, ease }}
          className="overflow-hidden"
          role="alert"
          aria-live="assertive"
        >
          <div
            className="flex items-start gap-3 px-4 py-3.5 rounded-[3px] border"
            style={{
              backgroundColor: 'var(--c4-card-bg)',
              borderColor: 'var(--c4-border)',
            }}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.3, ease }}
              className="shrink-0 mt-px"
            >
              <Icon
                size={14}
                strokeWidth={1.8}
                style={{ color: 'var(--c4-text-muted)' }}
              />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.3, ease }}
                className="text-[13px] leading-[1.55]"
                style={{ color: 'var(--c4-text)' }}
              >
                {error.message}
              </motion.p>
            </div>

            {/* Dismiss */}
            {onDismiss && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                type="button"
                onClick={onDismiss}
                className="shrink-0 mt-px p-0.5 transition-opacity duration-200 hover:opacity-70"
                style={{ color: 'var(--c4-text-faint)' }}
                aria-label="Dismiss error"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
