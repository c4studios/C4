import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { submitProjectInquiry } from '@/api/submissions';
import { useToast } from '@/components/ui/use-toast';

const ease = [0.22, 1, 0.36, 1];

const SERVICE_MAP = {
  web: { label: 'Websites & Applications', type: 'web_design' },
  brand: { label: 'Brand Platforms', type: 'brand_platform' },
  growth: { label: 'Growth & Automation', type: 'web_app' },
  rebuild: { label: 'Software Rebuilds', type: 'rebuild' },
};

const SERVICE_OPTIONS = [
  { key: 'web', label: 'Website or Application' },
  { key: 'brand', label: 'Brand Platform' },
  { key: 'growth', label: 'Growth & Automation' },
  { key: 'rebuild', label: 'Software Rebuild' },
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const prefilledService = searchParams.get('service') || '';
  const loadedAt = useRef(Date.now());
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service: prefilledService,
    description: '',
    _gotcha: '', // honeypot
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const mapped = SERVICE_MAP[form.service];
    try {
      await submitProjectInquiry({
        name: form.name,
        email: form.email,
        company: form.company,
        service_type: mapped?.type || 'other',
        description: form.description,
        _gotcha: form._gotcha,
        _loaded: loadedAt.current,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: err.message || 'Please try again in a moment.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-28 md:pt-36 pb-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <div className="max-w-[560px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-center"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--c4-text)' }}>
              <Check size={20} strokeWidth={2.5} style={{ color: 'var(--c4-bg)' }} />
            </div>
            <h1 className="text-[1.6rem] md:text-[2rem] font-semibold tracking-[-0.03em]" style={{ color: 'var(--c4-text)' }}>
              Message sent
            </h1>
            <p className="mt-3 text-[14px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
              We&apos;ll reply within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const serviceLabel = SERVICE_MAP[form.service]?.label;

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[620px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            className="mb-5"
            style={{ color: 'var(--c4-accent)' }}
          >
            <span className="block max-w-[28rem] text-[13px] font-medium leading-[1.45] tracking-[-0.01em] md:text-[15px]">
              Ready to build a website?
            </span>
          </motion.div>
          <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-[-0.035em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            Tell us what needs building.
          </h1>
          {serviceLabel && (
            <p className="mt-3 text-[14px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
              You&apos;re enquiring about <span className="font-medium" style={{ color: 'var(--c4-text)' }}>{serviceLabel}</span>. Share the basics and the timing below.
            </p>
          )}
          {!serviceLabel && (
            <p className="mt-3 text-[14px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
              Share the basics. We&apos;ll reply within 24 hours.
            </p>
          )}
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mt-10 space-y-6"
        >
          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] font-medium mb-2" style={{ color: 'var(--c4-text-subtle)' }}>
                Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full rounded-sm px-4 py-3 text-[14px] focus:outline-none transition-colors duration-300"
                style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] font-medium mb-2" style={{ color: 'var(--c4-text-subtle)' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full rounded-sm px-4 py-3 text-[14px] focus:outline-none transition-colors duration-300"
                style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
                placeholder="you@company.com"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] font-medium mb-2" style={{ color: 'var(--c4-text-subtle)' }}>
              Company / Brand
            </label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              className="w-full rounded-sm px-4 py-3 text-[14px] focus:outline-none transition-colors duration-300"
              style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
              placeholder="Optional"
            />
          </div>

          {/* Service selection */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] font-medium mb-3" style={{ color: 'var(--c4-text-subtle)' }}>
              Service
            </label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => update('service', form.service === opt.key ? '' : opt.key)}
                  className="px-4 py-2 text-[12.5px] font-medium border rounded-sm transition-all duration-300"
                  style={form.service === opt.key
                    ? { backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)', borderColor: 'var(--c4-text)' }
                    : { backgroundColor: 'var(--c4-card-bg)', color: 'var(--c4-text-muted)', borderColor: 'var(--c4-border)' }
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] font-medium mb-2" style={{ color: 'var(--c4-text-subtle)' }}>
              Tell us about your project
            </label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="w-full rounded-sm px-4 py-3 text-[14px] focus:outline-none transition-colors duration-300 resize-none"
              style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
              placeholder="What are you building? What problem are you solving?"
            />
          </div>

          {/* Honeypot – hidden from real users */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', tabIndex: -1 }}>
            <input
              type="text"
              name="_gotcha"
              value={form._gotcha}
              onChange={(e) => update('_gotcha', e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Submit */}
          <button
          type="submit"
          disabled={submitting}
          className="group inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300 disabled:opacity-50"
          style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            {submitting ? 'Sending...' : 'Send details'}
            <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </button>
        </motion.form>
      </div>
    </div>
  );
}
