import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ShieldCheck, Download, Loader2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PageHero from '@/components/c4/PageHero';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';
import { submitPreviewDownload } from '@/api/submissions';

const ease = [0.22, 1, 0.36, 1];

/* The five C4Sight series, in age order — the copy mirrors the ungated section
   on /ai-training-for-schools so the two surfaces never drift. `group` maps the
   email deep-links (#primary → S1+S2, #secondary → S3+S4, #staff → S5) onto a
   pre-selection, so a principal who clicks "download both" in a cold email lands
   with exactly those packs already ticked. */
const SERIES = [
  { key: 'S1', group: 'primary', band: 'Pre-primary – Year 2', name: 'The Computer Puppy',
    line: 'A computer starts out knowing nothing. We teach it, it gets things wrong, and the class works out who is really in charge.',
    file: '/downloads/c4sight/Series-1-The-Computer-Puppy-Preview.pdf' },
  { key: 'S2', group: 'primary', band: 'Years 3 – 6', name: 'Who Taught the Machine?',
    line: 'How a machine learns from the examples people give it, why it can be confidently wrong, and why that is on the people, not the machine.',
    file: '/downloads/c4sight/Series-2-Who-Taught-The-Machine-Preview.pdf' },
  { key: 'S3', group: 'secondary', band: 'Years 7 – 9', name: 'Can You Trust It?',
    line: 'Hallucinations, deepfakes, and what counts as evidence now — the half a free how-AI-works hour never reaches.',
    file: '/downloads/c4sight/Series-3-Can-You-Trust-It-Preview.pdf' },
  { key: 'S4', group: 'secondary', band: 'Years 10 – 12', name: 'Your Move',
    line: 'Study, integrity and the future of work. Using AI to think, not to cheat — and why detectors do not work.',
    file: '/downloads/c4sight/Series-4-Your-Move-Preview.pdf' },
  { key: 'S5', group: 'staff', band: 'Staff PD', name: 'Monday Morning AI',
    line: 'Real time-savers your staff use that week, then the honest conversation about assessment integrity and a whole-school position.',
    file: '/downloads/c4sight/Series-5-Monday-Morning-AI-Preview.pdf' },
];

const GROUP_FROM_HASH = { primary: ['S1', 'S2'], secondary: ['S3', 'S4'], staff: ['S5'], all: [] };

const SAFETY = [
  'No student devices, and no student data entered anywhere — ever.',
  'No student images captured, generated or uploaded.',
  'Every activity runs unplugged, or is driven by us on our own device.',
  'Curriculum-mapped to v9 Digital Technologies.',
];

function deliverPack(file) {
  const a = document.createElement('a');
  a.href = file;
  a.download = file.split('/').pop() || '';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function C4SightPreviews() {
  const [selected, setSelected] = useState(() => new Set());
  const [form, setForm] = useState({ first_name: '', school_name: '', email: '', _gotcha: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | done
  const [error, setError] = useState('');
  const loadedAt = useRef(Date.now());
  const sourceRef = useRef('website-organic');

  useDocumentHead({
    title: 'Free C4Sight classroom AI previews | C4 Studios',
    description:
      'Download the free C4Sight preview packs — a real, runnable AI lesson for every age group, from Pre-primary to Staff PD. No devices, no student data, curriculum-mapped.',
    path: '/c4sight-previews',
    jsonLd: [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'C4Sight', path: '/Foresight' },
        { name: 'Free previews', path: '/c4sight-previews' },
      ]),
    ],
  });

  // Honour the email deep-links + a ?src= attribution, once on mount.
  useEffect(() => {
    const hash = (window.location.hash || '').replace('#', '').toLowerCase();
    if (GROUP_FROM_HASH[hash]?.length) setSelected(new Set(GROUP_FROM_HASH[hash]));
    const src = new URLSearchParams(window.location.search).get('src');
    if (src === 'cold' || src === 'email') sourceRef.current = 'cold-touch';
    else if (src === 'warm') sourceRef.current = 'warm';
  }, []);

  const toggle = (key) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const allSelected = selected.size === SERIES.length;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const canSubmit = selected.size > 0 && emailValid && status !== 'submitting';

  const chosen = useMemo(() => SERIES.filter((s) => selected.has(s.key)), [selected]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (selected.size === 0) return setError('Pick at least one preview to download.');
    if (!emailValid) return setError('Enter a valid email so we can note who has it.');

    setStatus('submitting');
    // Fire the capture, but never let it stand between a teacher and their pack.
    try {
      await submitPreviewDownload({
        first_name: form.first_name.trim(),
        school_name: form.school_name.trim(),
        email: form.email.trim(),
        series: [...selected],
        source: sourceRef.current,
        _gotcha: form._gotcha,
        _loaded: loadedAt.current,
      });
    } catch (err) {
      // A 400 is a real client problem; anything else, deliver anyway (the
      // packs are public files — a capture hiccup must not cost them the lesson).
      if (err?.status === 400) {
        setStatus('idle');
        return setError(err.message || 'Please check your details and try again.');
      }
    }
    chosen.forEach((s, i) => setTimeout(() => deliverPack(s.file), i * 350));
    setStatus('done');
  }

  const field =
    'w-full rounded-[3px] px-3.5 py-2.5 text-[14px] transition-colors duration-200 outline-none';
  const fieldStyle = {
    backgroundColor: 'var(--c4-bg)',
    border: '1px solid var(--c4-border)',
    color: 'var(--c4-text)',
  };

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <PageHero
        label="C4Sight · Free previews"
        titleLines={['Take a real lesson', 'for a test drive.']}
        description="Every C4Sight incursion runs as five series, one per age group. Each preview is a complete, runnable classroom activity — no devices, no student data, curriculum-mapped — plus a look at what the live incursion adds. Choose what fits your school and they download on the spot."
      />

      <section className="pb-20 md:pb-28" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_0.85fr] lg:gap-14">
            {/* ── The five series — a real age progression, selectable ── */}
            <div>
              <div className="flex items-baseline justify-between gap-4 mb-6">
                <h2 className="text-[clamp(1.2rem,2.6vw,1.7rem)] font-semibold tracking-[-0.025em]">
                  Choose your previews
                </h2>
                <button
                  type="button"
                  onClick={() => setSelected(allSelected ? new Set() : new Set(SERIES.map((s) => s.key)))}
                  className="shrink-0 text-[11px] uppercase tracking-[0.14em] font-medium transition-opacity hover:opacity-70"
                  style={{ color: 'var(--c4-accent)' }}
                >
                  {allSelected ? 'Clear all' : 'Select all five'}
                </button>
              </div>

              <ul role="list" className="flex flex-col gap-2.5">
                {SERIES.map((s, i) => {
                  const on = selected.has(s.key);
                  return (
                    <motion.li
                      key={s.key}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-20px' }}
                      transition={{ duration: 0.4, delay: i * 0.05, ease }}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(s.key)}
                        aria-pressed={on}
                        className="group flex w-full items-start gap-4 rounded-[3px] p-5 md:p-6 text-left transition-all duration-200"
                        style={{
                          border: `1px solid ${on ? 'var(--c4-accent)' : 'var(--c4-border)'}`,
                          backgroundColor: on ? 'var(--c4-card-bg)' : 'var(--c4-bg)',
                        }}
                      >
                        {/* selection box */}
                        <span
                          className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[3px] transition-colors duration-200"
                          style={{
                            border: `1.5px solid ${on ? 'var(--c4-accent)' : 'var(--c4-text-faint)'}`,
                            backgroundColor: on ? 'var(--c4-accent)' : 'transparent',
                          }}
                        >
                          {on && <Check size={13} strokeWidth={3} style={{ color: 'var(--c4-bg)' }} />}
                        </span>

                        <div className="min-w-0 flex-1">
                          <span
                            className="inline-block text-[10px] uppercase tracking-[0.18em] font-semibold"
                            style={{ color: 'var(--c4-accent)' }}
                          >
                            {s.band}
                          </span>
                          <h3 className="mt-1.5 text-[15px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                            {s.name}
                          </h3>
                          <p className="mt-1.5 text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
                            {s.line}
                          </p>
                        </div>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* ── The capture panel — sticky companion on desktop ── */}
            <div>
              <div className="lg:sticky lg:top-24">
                {status === 'done' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="rounded-[4px] p-6 md:p-7"
                    style={{ border: '1px solid var(--c4-accent)', backgroundColor: 'var(--c4-card-bg)' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full" style={{ backgroundColor: 'var(--c4-accent)' }}>
                        <Check size={16} strokeWidth={2.5} style={{ color: 'var(--c4-bg)' }} />
                      </span>
                      <h3 className="text-[16px] font-semibold tracking-[-0.01em]">Your previews are downloading</h3>
                    </div>
                    <p className="mt-4 text-[13px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
                      If a download did not start, open them here:
                    </p>
                    <ul className="mt-3 flex flex-col gap-2">
                      {chosen.map((s) => (
                        <li key={s.key}>
                          <a
                            href={s.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 rounded-[3px] px-3.5 py-2.5 text-[13px] font-medium transition-colors duration-200"
                            style={{ border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}
                          >
                            <Download size={14} strokeWidth={2} style={{ color: 'var(--c4-accent)' }} />
                            {s.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-[12px] leading-[1.65]" style={{ color: 'var(--c4-text-faint)' }}>
                      We have noted your details and may send one or two short notes about the full incursion. Reply STOP to any and we will leave it there.
                    </p>
                    <Link
                      to={createPageUrl('TrainingEnquiry') + '?sector=school'}
                      className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold transition-opacity hover:opacity-70"
                      style={{ color: 'var(--c4-text)' }}
                    >
                      Talk to us about a visit
                      <ArrowRight size={12} strokeWidth={2} />
                    </Link>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={onSubmit}
                    className="rounded-[4px] p-6 md:p-7"
                    style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
                  >
                    <h3 className="text-[16px] font-semibold tracking-[-0.01em]">Where should we send them?</h3>
                    <p className="mt-2 text-[12.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
                      They download instantly on this page. We note who has them so we can be useful, not a nuisance.
                    </p>

                    <div className="mt-5 flex flex-col gap-3">
                      <input
                        type="text" name="first_name" autoComplete="given-name" placeholder="First name"
                        value={form.first_name}
                        onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                        className={field} style={fieldStyle}
                      />
                      <input
                        type="text" name="organization" autoComplete="organization" placeholder="School"
                        value={form.school_name}
                        onChange={(e) => setForm((f) => ({ ...f, school_name: e.target.value }))}
                        className={field} style={fieldStyle}
                      />
                      <input
                        type="email" name="email" autoComplete="email" placeholder="School email *" required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className={field} style={fieldStyle}
                      />
                      {/* honeypot */}
                      <input
                        type="text" name="_gotcha" tabIndex={-1} autoComplete="off"
                        value={form._gotcha}
                        onChange={(e) => setForm((f) => ({ ...f, _gotcha: e.target.value }))}
                        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                        aria-hidden="true"
                      />
                    </div>

                    <div
                      className="mt-4 flex items-center justify-between rounded-[3px] px-3.5 py-2.5 text-[12px]"
                      style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text-muted)' }}
                    >
                      <span>Selected</span>
                      <span style={{ color: selected.size ? 'var(--c4-accent)' : 'var(--c4-text-faint)' }}>
                        {selected.size} of {SERIES.length}
                      </span>
                    </div>

                    {error && (
                      <p className="mt-3 text-[12.5px] leading-[1.5]" style={{ color: 'var(--c4-accent)' }}>{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-[3px] px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200"
                      style={{
                        backgroundColor: 'var(--c4-text)',
                        color: 'var(--c4-bg)',
                        opacity: canSubmit ? 1 : 0.4,
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {status === 'submitting'
                        ? <><Loader2 size={13} strokeWidth={2.5} className="animate-spin" /> One moment…</>
                        : <>Download {selected.size > 0 ? `${selected.size} preview${selected.size > 1 ? 's' : ''}` : 'previews'} <Download size={13} strokeWidth={2.5} /></>}
                    </button>

                    <p className="mt-4 text-[11.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
                      Enter your details and your previews download right here. We may also send one or two short notes about the full incursion — reply STOP to any and we will leave it there.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The safety promise — the reason a cautious school reads on ── */}
      <section className="py-16 md:py-20 border-t" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} strokeWidth={1.75} style={{ color: 'var(--c4-accent)' }} />
                <span className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
                  The promise, in every session
                </span>
              </div>
              <h2 className="mt-4 text-[clamp(1.3rem,2.8vw,1.85rem)] font-semibold tracking-[-0.025em] leading-[1.12]">
                Built around a teacher&rsquo;s caution, not against it.
              </h2>
            </motion.div>
            <div className="flex flex-col gap-3">
              {SAFETY.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease }}
                  className="flex items-start gap-4 rounded-[3px] p-5"
                  style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}
                >
                  <Check size={15} strokeWidth={2.25} className="mt-0.5 shrink-0" style={{ color: 'var(--c4-accent)' }} />
                  <p className="text-[13.5px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 border-t" style={{ borderColor: 'var(--c4-border)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <h2 className="text-[clamp(1.4rem,3.2vw,2rem)] font-semibold tracking-[-0.03em] max-w-[560px]">
              Ran the activity? See what the live incursion adds.
            </h2>
            <Link
              to={createPageUrl('Foresight')}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-[11px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              The C4Sight overview
              <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
