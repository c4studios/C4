import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

export default function WaitlistModal({ isOpen, onClose, productName }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setName('');
      setEmail('');
      setLoading(false);
      setSuccess(false);
      setError('');
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, product: productName }),
      });
      if (!res.ok) throw new Error('Server error');
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
            style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
            onClick={handleClose}
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[3px] p-7"
            style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <span className="text-[9.5px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--c4-text-faint)' }}>
                  Waitlist
                </span>
                <h3 className="mt-1 text-[1.1rem] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>
                  {productName}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200"
                style={{ color: 'var(--c4-text-subtle)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c4-text)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--c4-text-subtle)'; }}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>

            {success ? (
              <div className="py-2">
                <p className="text-[13.5px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
                  You&apos;re on the list for{' '}
                  <strong style={{ color: 'var(--c4-text)', fontWeight: 600 }}>{productName}</strong>.
                  We&apos;ll be in touch at{' '}
                  <span style={{ color: 'var(--c4-text)' }}>{email}</span>{' '}
                  when early access opens.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] font-medium"
                    style={{ color: 'var(--c4-text-subtle)' }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-[3px] px-3.5 py-2.5 text-[13px] outline-none transition-colors duration-200 placeholder:opacity-30"
                    style={{
                      border: '1px solid var(--c4-border)',
                      backgroundColor: 'var(--c4-bg-alt)',
                      color: 'var(--c4-text)',
                    }}
                  />
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] font-medium"
                    style={{ color: 'var(--c4-text-subtle)' }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[3px] px-3.5 py-2.5 text-[13px] outline-none transition-colors duration-200 placeholder:opacity-30"
                    style={{
                      border: '1px solid var(--c4-border)',
                      backgroundColor: 'var(--c4-bg-alt)',
                      color: 'var(--c4-text)',
                    }}
                  />
                </div>

                {error && (
                  <p className="text-[12px]" style={{ color: '#ef4444' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[3px] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-opacity duration-200 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                >
                  {loading ? 'Joining…' : 'Join waitlist'}
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
