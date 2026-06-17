import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { submitTrainingEnquiry } from '@/api/submissions';
import SubmissionSuccess from '@/components/c4/SubmissionSuccess';
import TurnstileWidget from '@/components/c4/TurnstileWidget';
import SubmitButton from '@/components/c4/SubmitButton';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';

const ease = [0.22, 1, 0.36, 1];

const SECTORS = [
  { key: 'business', label: 'Office / business' },
  { key: 'school', label: 'School' },
  { key: 'law', label: 'Law firm' },
  { key: 'other', label: 'Other' },
];

const FORMATS = [
  { key: 'half-day', label: 'Half-day' },
  { key: 'full-day', label: 'Full-day' },
  { key: 'not-sure', label: 'Not sure yet' },
];

const GROUP_SIZES = [
  { key: 'under-10', label: 'Under 10' },
  { key: '10-20', label: '10–20' },
  { key: '20-40', label: '20–40' },
  { key: '40-plus', label: '40+' },
];

const fieldClass = 'w-full rounded-sm px-4 py-3 text-[14px] focus:outline-none transition-colors duration-300';
const labelClass = 'block text-[11px] uppercase tracking-[0.15em] font-medium mb-2';

function PillSelect({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(value === opt.key ? '' : opt.key)}
          className="px-4 py-2 text-[12.5px] font-medium border rounded-sm transition-all duration-300"
          style={value === opt.key
            ? { backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)', borderColor: 'var(--c4-text)' }
            : { backgroundColor: 'var(--c4-card-bg)', color: 'var(--c4-text-muted)', borderColor: 'var(--c4-border)' }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const labelFor = (options, key) => options.find((o) => o.key === key)?.label || '';

export default function TrainingEnquiry() {
  const [searchParams] = useSearchParams();
  const preSector = SECTORS.some((s) => s.key === searchParams.get('sector')) ? searchParams.get('sector') : '';
  const loadedAt = useRef(Date.now());
  const turnstileToken = useRef(null);

  useDocumentHead({
    title: 'Request a C4Sight workshop',
    description:
      'Enquire about a C4Sight workplace AI workshop. Tell us your sector, preferred format and rough group size, and the studio replies directly.',
    path: '/ai-training-enquiry',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'C4Sight', path: '/Foresight' },
      { name: 'Request a workshop', path: '/ai-training-enquiry' },
    ]),
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    organisation: '',
    sector: preSector,
    format: '',
    groupSize: '',
    message: '',
    _gotcha: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      await submitTrainingEnquiry({
        name: form.name,
        email: form.email,
        organisation: form.organisation,
        sector: labelFor(SECTORS, form.sector),
        format: labelFor(FORMATS, form.format),
        group_size: labelFor(GROUP_SIZES, form.groupSize),
        message: form.message,
        _gotcha: form._gotcha,
        _loaded: loadedAt.current,
        turnstileToken: turnstileToken.current,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Enquiry failed:', err);
      setFormError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting || submitted || formError) {
    return (
      <div className="min-h-screen pt-28 md:pt-36 pb-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <SubmissionSuccess
          submitting={submitting}
          submitted={submitted}
          error={formError}
          onRetry={() => setFormError(null)}
          retryLabel="Back to form"
          accentLabel="C4Sight enquiry"
          headline="Enquiry received"
          message="We will reply within one business day with options for your team."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[680px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <div className="flex items-center gap-3 mb-8 md:mb-10">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="w-8 h-px origin-left"
              style={{ backgroundColor: 'var(--c4-accent)' }}
            />
            <span className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
              C4Sight enquiry
            </span>
          </div>
          <h1 className="text-[clamp(1.8rem,4.5vw,2.8rem)] font-semibold tracking-[-0.035em] leading-[1.08]" style={{ color: 'var(--c4-text)' }}>
            Request a workshop.
          </h1>
          <p className="mt-4 text-[14px] md:text-[15px] leading-[1.7] max-w-[480px]" style={{ color: 'var(--c4-text-muted)' }}>
            Tell us about your team and we will put together the right session. No calls required to start.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-10 md:mt-14 space-y-7">
          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Name *</label>
              <input
                className={fieldClass}
                style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Email *</label>
              <input
                className={fieldClass}
                style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@organisation.com"
              />
            </div>
          </div>

          {/* Organisation */}
          <div>
            <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Organisation</label>
            <input
              className={fieldClass}
              style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
              value={form.organisation}
              onChange={(e) => update('organisation', e.target.value)}
              placeholder="Company, school or firm"
            />
          </div>

          {/* Sector */}
          <div>
            <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Sector</label>
            <PillSelect options={SECTORS} value={form.sector} onChange={(v) => update('sector', v)} />
          </div>

          {/* Format */}
          <div>
            <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Preferred format</label>
            <PillSelect options={FORMATS} value={form.format} onChange={(v) => update('format', v)} />
          </div>

          {/* Group size */}
          <div>
            <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Rough group size</label>
            <PillSelect options={GROUP_SIZES} value={form.groupSize} onChange={(v) => update('groupSize', v)} />
          </div>

          {/* Message */}
          <div>
            <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>What would you like to cover? *</label>
            <textarea
              className={fieldClass + ' resize-none'}
              style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)', minHeight: '128px' }}
              required
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              placeholder="The team, the tools they use, and what you want them to get out of it."
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

          {/* Turnstile */}
          <div className="pt-2">
            <TurnstileWidget
              onToken={(t) => { turnstileToken.current = t; }}
              onExpire={() => { turnstileToken.current = null; }}
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <SubmitButton submitting={submitting} label="Send enquiry" loadingLabel="Sending" />
          </div>
        </form>
      </div>
    </div>
  );
}
