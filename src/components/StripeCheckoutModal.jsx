import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const ease = [0.22, 1, 0.36, 1];

export default function StripeCheckoutModal({ isOpen, onClose, priceId, title }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSecret = useCallback(() => {
    return fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
      .then((r) => r.json())
      .then((d) => d.clientSecret);
  }, [priceId]);

  useEffect(() => {
    if (!isOpen || !priceId) return;
    setLoading(true);
    setError(null);
    fetchSecret()
      .then((secret) => { setClientSecret(secret); setLoading(false); })
      .catch(() => { setError('Could not load checkout. Please try again.'); setLoading(false); });
  }, [isOpen, priceId, fetchSecret]);

  const handleClose = () => {
    onClose();
    setTimeout(() => { setClientSecret(null); setError(null); }, 350);
  };

  const retry = () => {
    setError(null);
    setLoading(true);
    fetchSecret()
      .then((s) => { setClientSecret(s); setLoading(false); })
      .catch(() => { setError('Could not load checkout. Please try again.'); setLoading(false); });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={handleClose}
          />
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: 0.3, ease }}
            className="fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[calc(100vw-2rem)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[3px]"
            style={{ border: '1px solid var(--c4-border)', backgroundColor: '#ffffff' }}
          >
            {/* Header */}
            <div
              className="flex shrink-0 items-center justify-between border-b px-5 py-4"
              style={{ borderColor: '#e5e7eb' }}
            >
              <div>
                <span className="block text-[9px] uppercase tracking-[0.2em] font-medium" style={{ color: '#9ca3af' }}>
                  Secure checkout · Stripe
                </span>
                {title && (
                  <p className="mt-0.5 text-[13px] font-semibold tracking-[-0.01em]" style={{ color: '#111827' }}>
                    {title}
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100"
              >
                <X size={14} strokeWidth={2} color="#6b7280" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <span className="text-[10.5px] uppercase tracking-[0.15em]" style={{ color: '#9ca3af' }}>
                    Preparing checkout…
                  </span>
                </div>
              )}
              {error && (
                <div className="p-6">
                  <p className="text-[13px]" style={{ color: '#ef4444' }}>{error}</p>
                  <button
                    onClick={retry}
                    className="mt-3 text-[11px] uppercase tracking-[0.12em] underline"
                    style={{ color: '#6b7280' }}
                  >
                    Try again
                  </button>
                </div>
              )}
              {!stripePromise && !loading && !error && (
                <div className="p-6">
                  <p className="text-[12px]" style={{ color: '#ef4444' }}>
                    Checkout is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to your environment.
                  </p>
                </div>
              )}
              {clientSecret && stripePromise && (
                <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
