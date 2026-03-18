import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { submitProjectInquiry } from '@/api/submissions';
import FileUpload from '../components/c4/FileUpload';
import { useToast } from '@/components/ui/use-toast';

const ease = [0.22, 1, 0.36, 1];

const SERVICES = [
  { key: 'web_design', label: 'Website Design' },
  { key: 'web_app', label: 'Web Application' },
  { key: 'brand_platform', label: 'Brand Platform' },
  { key: 'rebuild', label: 'Software Rebuild' },
  { key: 'other', label: 'Something Else' },
];

const BUDGETS = [
  { key: 'under_1k', label: 'Under $1k' },
  { key: '1k_5k', label: '$1k – $5k' },
  { key: '5k_15k', label: '$5k – $15k' },
  { key: '15k_50k', label: '$15k – $50k' },
  { key: '50k_plus', label: '$50k +' },
  { key: 'not_sure', label: 'Not sure yet' },
];

const TIMELINES = [
  { key: 'asap', label: 'As soon as possible' },
  { key: '1_3_months', label: '1 – 3 months' },
  { key: '3_6_months', label: '3 – 6 months' },
  { key: 'flexible', label: 'Flexible' },
];

const fieldClass = "w-full rounded-sm px-4 py-3 text-[14px] focus:outline-none transition-colors duration-300";
const labelClass = "block text-[11px] uppercase tracking-[0.15em] font-medium mb-2";

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

export default function StartProject() {
  const [searchParams] = useSearchParams();
  const preService = searchParams.get('service') || '';
  const loadedAt = useRef(Date.now());
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service: preService,
    budget: '',
    timeline: '',
    description: '',
    attachments: [],
    _gotcha: '', // honeypot
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitProjectInquiry({
        name: form.name,
        email: form.email,
        company: form.company,
        service_type: form.service || 'other',
        budget: form.budget || 'not_sure',
        description: [
          form.description,
          form.timeline && `Timeline: ${TIMELINES.find(t => t.key === form.timeline)?.label || form.timeline}`,
        ].filter(Boolean).join('\n\n'),
        timeline: TIMELINES.find(t => t.key === form.timeline)?.label || '',
        attachments: form.attachments.map(f => f.url),
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
              Brief received
            </h1>
            <p className="mt-3 text-[14px] leading-[1.6] max-w-[400px] mx-auto" style={{ color: 'var(--c4-text-muted)' }}>
              We&apos;ll review it and reply within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[680px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center gap-3 mb-8 md:mb-10">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="w-8 h-px origin-left"
              style={{ backgroundColor: 'var(--c4-accent)' }}
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-[10px] uppercase tracking-[0.25em] font-medium"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              Project Brief
            </motion.span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.58, ease }}
            className="mb-5"
            style={{ color: 'var(--c4-accent)' }}
          >
            <span className="block max-w-[30rem] text-[13px] font-medium leading-[1.45] tracking-[-0.01em] md:text-[15px]">
              Let&apos;s build something worth launching.
            </span>
          </motion.div>
          <h1 className="text-[clamp(1.8rem,4.5vw,2.8rem)] font-semibold tracking-[-0.035em] leading-[1.08]" style={{ color: 'var(--c4-text)' }}>
            Send the brief.
          </h1>
          <p className="mt-4 text-[14px] md:text-[15px] leading-[1.7] max-w-[480px]" style={{ color: 'var(--c4-text-muted)' }}>
            Give us the outline, the context, and what good looks like. We&apos;ll take it from there.
          </p>
        </motion.div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 md:mt-14 space-y-7"
        >
          {/* Name + Email */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Name *</label>
              <input
                className={fieldClass}
                style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
                required
                value={form.name}
                onChange={e => update('name', e.target.value)}
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
                onChange={e => update('email', e.target.value)}
                placeholder="you@company.com"
              />
            </div>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28, ease }}
          >
            <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Company / Brand</label>
            <input
              className={fieldClass}
              style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
              value={form.company}
              onChange={e => update('company', e.target.value)}
              placeholder="Optional"
            />
          </motion.div>

          {/* Service */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.36, ease }}
          >
            <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>What do you need? *</label>
            <PillSelect options={SERVICES} value={form.service} onChange={v => update('service', v)} />
          </motion.div>

          {/* Budget */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.44, ease }}
          >
            <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Budget range</label>
            <PillSelect options={BUDGETS} value={form.budget} onChange={v => update('budget', v)} />
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.52, ease }}
          >
            <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Timeline</label>
            <PillSelect options={TIMELINES} value={form.timeline} onChange={v => update('timeline', v)} />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.60, ease }}
          >
            <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Project details *</label>
            <textarea
              className={fieldClass + ' h-32 resize-none'}
              style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
              required
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe your project — the problem, your audience, what success looks like. Include any reference sites or inspiration."
            />
          </motion.div>

          {/* Attachments */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.68, ease }}
          >
            <label className={labelClass} style={{ color: 'var(--c4-text-subtle)' }}>Attachments</label>
            <FileUpload
              files={form.attachments}
              onChange={files => update('attachments', files)}
              onUploadingChange={setFileUploading}
            />
          </motion.div>

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
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.76, ease }}
            className="pt-2"
          >
            <button
              type="submit"
              disabled={submitting || fileUploading}
              className="group inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300 disabled:opacity-50"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              {submitting ? 'Sending...' : 'Send brief'}
              <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
