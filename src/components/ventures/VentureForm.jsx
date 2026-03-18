import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { submitVentureIdea } from '@/api/submissions';
import { Send, CheckCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';
import IdeaScorePreview from './IdeaScorePreview';
import FileUpload from '../c4/FileUpload';
import { useToast } from '@/components/ui/use-toast';

const ease = [0.22, 1, 0.36, 1];

const CATEGORIES = ['App', 'Website', 'SaaS', 'Marketplace', 'Tool', 'Other'];

const fieldClass = "w-full rounded-[3px] px-4 py-3 text-[13.5px] focus:outline-none transition-colors duration-200";
const labelClass = "block text-[12px] font-semibold tracking-[-0.01em] mb-1.5";
const hintClass = "text-[11px] mt-0.5 mb-2";

export default function VentureForm() {
  const loadedAt = useRef(Date.now());
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '', email: '', idea_title: '', idea_type: '',
    problem: '', target: '', solution: '', features: '',
    comparables: '', why_now: '', monetisation: '', links: '',
    nda: false,
    attachments: [],
    _gotcha: '', // honeypot
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // Compute live scores based on form completeness
  const scores = useMemo(() => {
    const clarity = Math.min(100,
      (form.problem.length > 20 ? 40 : form.problem.length > 5 ? 20 : 0) +
      (form.solution.length > 20 ? 35 : form.solution.length > 5 ? 15 : 0) +
      (form.idea_title.length > 2 ? 25 : 0)
    );
    const feasibility = Math.min(100,
      (form.features.length > 10 ? 40 : form.features.length > 3 ? 20 : 0) +
      (form.idea_type ? 20 : 0) +
      (form.monetisation.length > 5 ? 20 : 0) +
      (form.target.length > 5 ? 20 : 0)
    );
    const differentiation = Math.min(100,
      (form.comparables.length > 10 ? 45 : form.comparables.length > 3 ? 20 : 0) +
      (form.why_now.length > 15 ? 55 : form.why_now.length > 5 ? 25 : 0)
    );
    const audience = Math.min(100,
      (form.target.length > 20 ? 60 : form.target.length > 5 ? 30 : 0) +
      (form.problem.length > 10 ? 25 : 0) +
      (form.why_now.length > 5 ? 15 : 0)
    );
    return { clarity, feasibility, differentiation, audience };
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitVentureIdea({
        name: form.name,
        email: form.email,
        idea_title: form.idea_title,
        idea_type: form.idea_type.toLowerCase() || 'other',
        problem: form.problem,
        solution: form.solution,
        target_audience: form.target,
        features: form.features,
        comparables: form.comparables,
        why_now: form.why_now,
        monetisation: form.monetisation,
        links: form.links,
        nda: form.nda,
        attachments: form.attachments.map(f => f.url),
        _gotcha: form._gotcha,
        _loaded: loadedAt.current,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Venture submission failed:', err);
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: err.message || 'Please try again in a moment.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-16 md:py-24" id="submit" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <div className="max-w-[680px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'color-mix(in srgb, var(--c4-accent) 10%, transparent)' }}
            >
              <CheckCircle size={28} strokeWidth={1.5} style={{ color: 'var(--c4-accent)' }} />
            </motion.div>
            <h3 className="text-[1.3rem] md:text-[1.5rem] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>
              Submission received.
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65] max-w-[400px] mx-auto" style={{ color: 'var(--c4-text-muted)' }}>
              {"We'll review your idea and get back to you if there's a fit. Here's what happens next:"}
            </p>

            <div className="mt-8 text-left max-w-[360px] mx-auto space-y-4">
              {[
                { num: '01', text: 'We review your submission within 5–10 business days.' },
                { num: '02', text: "If it scores well, we'll reach out for a conversation." },
                { num: '03', text: "If it's not the right fit, you'll hear from us too." },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-3">
                  <span className="text-[11px] font-semibold tabular-nums tracking-[0.1em] mt-0.5" style={{ color: 'var(--c4-accent)' }}>{step.num}</span>
                  <span className="text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>{step.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24" id="submit" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.1] mb-3"
          style={{ color: 'var(--c4-text)' }}
        >
          Submit Your Idea
        </motion.h3>
        <p className="text-[14px] leading-[1.6] max-w-[500px] mb-10 md:mb-14" style={{ color: 'var(--c4-text-muted)' }}>
          Be as detailed as you can. Stronger submissions get priority.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
            {/* Row: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Your name *</label>
                <input className={fieldClass} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Email *</label>
                <input className={fieldClass} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@email.com" />
              </div>
            </div>

            {/* Row: Idea name + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Idea name *</label>
                <input className={fieldClass} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} required value={form.idea_title} onChange={(e) => update('idea_title', e.target.value)} placeholder="Working title for the idea" />
              </div>
              <div>
                <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Category *</label>
                <select className={fieldClass + ' appearance-none'} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} required value={form.idea_type} onChange={(e) => update('idea_type', e.target.value)}>
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Problem */}
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Problem statement *</label>
              <p className={hintClass} style={{ color: 'var(--c4-text-faint)' }}>What pain does this solve? Who currently suffers from it?</p>
              <textarea className={fieldClass + ' h-24 resize-none'} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} required value={form.problem} onChange={(e) => update('problem', e.target.value)} placeholder="Describe the problem clearly..." />
            </div>

            {/* Target user */}
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Target user *</label>
              <p className={hintClass} style={{ color: 'var(--c4-text-faint)' }}>Who specifically is this for?</p>
              <input className={fieldClass} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} required value={form.target} onChange={(e) => update('target', e.target.value)} placeholder="e.g. Freelance designers with 5+ clients" />
            </div>

            {/* Solution */}
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Proposed solution *</label>
              <p className={hintClass} style={{ color: 'var(--c4-text-faint)' }}>What does the product do? How does it solve the problem?</p>
              <textarea className={fieldClass + ' h-24 resize-none'} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} required value={form.solution} onChange={(e) => update('solution', e.target.value)} placeholder="Describe your proposed solution..." />
            </div>

            {/* Features */}
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Key features</label>
              <p className={hintClass} style={{ color: 'var(--c4-text-faint)' }}>List 3–7 core features or capabilities.</p>
              <textarea className={fieldClass + ' h-20 resize-none'} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} value={form.features} onChange={(e) => update('features', e.target.value)} placeholder="• Feature one&#10;• Feature two&#10;• Feature three" />
            </div>

            {/* Comparables */}
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Comparable products</label>
              <p className={hintClass} style={{ color: 'var(--c4-text-faint)' }}>{"Any existing solutions or competitors? What's different about yours?"}</p>
              <textarea className={fieldClass + ' h-20 resize-none'} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} value={form.comparables} onChange={(e) => update('comparables', e.target.value)} placeholder="e.g. Similar to X, but focused on Y..." />
            </div>

            {/* Why now */}
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Why you / why now</label>
              <textarea className={fieldClass + ' h-20 resize-none'} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} value={form.why_now} onChange={(e) => update('why_now', e.target.value)} placeholder="What makes this the right time? What do you bring to it?" />
            </div>

            {/* Monetisation */}
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Monetisation idea <span style={{ color: 'var(--c4-text-faint)' }} className="font-normal">(optional)</span></label>
              <input className={fieldClass} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} value={form.monetisation} onChange={(e) => update('monetisation', e.target.value)} placeholder="e.g. SaaS subscription, freemium, marketplace fees..." />
            </div>

            {/* Links */}
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Links / screenshots <span style={{ color: 'var(--c4-text-faint)' }} className="font-normal">(optional)</span></label>
              <input className={fieldClass} style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }} value={form.links} onChange={(e) => update('links', e.target.value)} placeholder="Paste any relevant URLs" />
            </div>

            {/* Attachments */}
            <div>
              <label className={labelClass} style={{ color: 'var(--c4-text)' }}>Supporting files <span style={{ color: 'var(--c4-text-faint)' }} className="font-normal">(optional)</span></label>
              <p className={hintClass} style={{ color: 'var(--c4-text-faint)' }}>Upload mockups, pitch decks, screenshots, or reference material.</p>
              <FileUpload
                files={form.attachments}
                onChange={files => update('attachments', files)}
                onUploadingChange={setFileUploading}
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

            {/* NDA checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                checked={form.nda}
                onChange={(e) => update('nda', e.target.checked)}
                className="mt-1 w-4 h-4 rounded-[2px]"
                style={{ borderColor: 'var(--c4-border)', accentColor: 'var(--c4-accent)' }}
              />
              <div>
                <span className="text-[12.5px] font-medium" style={{ color: 'var(--c4-text)' }}>Request NDA discussion</span>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--c4-text-faint)' }}>
                  NDAs are not automatic — we can discuss confidentiality terms if your idea progresses.
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || fileUploading}
                className="group inline-flex items-center gap-2.5 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300 disabled:opacity-50"
                style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
              >
                {submitting ? 'Submitting...' : 'Submit Idea'}
                <Send size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <p className="mt-3 text-[11px] leading-[1.5]" style={{ color: 'var(--c4-text-faint)' }}>
                By submitting, you agree to our{' '}
                <Link to={createPageUrl('Terms')} className="underline underline-offset-2 transition-colors duration-300" style={{ color: 'var(--c4-text-muted)', textDecorationColor: 'var(--c4-border)' }}>
                  Terms & Conditions
                </Link>.
              </p>
            </div>
          </form>

          {/* Score preview sidebar */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <IdeaScorePreview scores={scores} />
              <p className="mt-3 text-[10px] leading-[1.5] max-w-[320px]" style={{ color: 'var(--c4-text-faint)' }}>
                {"This preview updates as you fill the form. It's a rough guide — not a binding evaluation."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}