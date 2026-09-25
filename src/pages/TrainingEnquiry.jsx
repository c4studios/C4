/*
 * /ai-training-enquiry — the C4Site enquiry, on the board.
 *
 * One paper slip. The format and group-size choices follow the sector: a
 * school picks between the 90-minute incursion and staff PD, a workplace
 * between the half and full day. ?sector= and ?format= pre-fill it, so the
 * schools page can send a visitor straight to "90-minute incursion". The
 * backend (functions/api/training.js) stores the labels as free text, so the
 * school labels need no server change. Honeypot, load time and Turnstile are
 * unchanged. Moved onto the board on 21 Sep 2026; sending and the result now
 * happen on the slip instead of a separate full-page state.
 *
 * 24 Sep 2026: a "what happens next" column beside the slip, which changes
 * with the sector (sources: the hub's "one fixed price after a short call",
 * the curriculum's pre-session checklist, the schools page's projector and
 * floor, and c4SiteIncursion for the price). A failed send now offers the
 * studio's email, so a teacher is never left with only "try again".
 */
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from '@/components/c4/SiteLink';
import { createPageUrl } from '@/utils';
import { submitTrainingEnquiry } from '@/api/submissions';
import TurnstileWidget from '@/components/c4/TurnstileWidget';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';
import { c4SiteIncursion } from '@/data/pricing';
import { ChalkDefs, ChalkHeading, MarkArrow, useForceDark } from '@/components/sight-arm/kit';

const SECTORS = [
  { key: 'business', label: 'Office or business' },
  { key: 'school', label: 'School' },
  { key: 'law', label: 'Law firm' },
  { key: 'other', label: 'Something else' },
];

const WORK_FORMATS = [
  { key: 'half-day', label: 'Half day' },
  { key: 'full-day', label: 'Full day' },
  { key: 'not-sure', label: 'Not sure yet' },
];

const SCHOOL_FORMATS = [
  { key: 'incursion-90', label: '90-minute incursion' },
  { key: 'staff-pd', label: 'Staff PD' },
  { key: 'not-sure', label: 'Not sure yet' },
];

const WORK_SIZES = [
  { key: 'under-10', label: 'Under 10' },
  { key: '10-20', label: '10 to 20' },
  { key: '20-40', label: '20 to 40' },
  { key: '40-plus', label: 'More than 40' },
];

const SCHOOL_SIZES = [
  { key: 'one-class', label: 'One class' },
  { key: 'up-to-60', label: 'Up to 60' },
  { key: 'over-60', label: 'More than 60' },
];

const STUDIO_EMAIL = 'caleb@c4studios.com.au';

const NEXT_WORK = [
  'We reply within one business day, by email.',
  'A short call about the team, the tools they already use and the work they want help with.',
  'One fixed price for the session, set by the people in the room, half day or full, and where you are.',
  'Before the day, a short checklist so everyone arrives with a device, wifi and access to the tool.',
];

const NEXT_SCHOOL = [
  'We reply within one business day, by email.',
  'We settle the year levels, a date and the room. We need a projector and some clear floor.',
  `The 90-minute incursion is ${c4SiteIncursion.priceLabel}, with up to ${c4SiteIncursion.maxStudents} students. Staff PD is quoted separately.`,
  'On the day, one presenter and your own teacher in the room. Students need no devices.',
];

const labelFor = (options, key) => options.find((o) => o.key === key)?.label || '';
const has = (options, key) => options.some((o) => o.key === key);

function Choices({ id, label, options, value, onChange }) {
  return (
    <div className="sg-field" role="group" aria-labelledby={id}>
      <span className="sg-field-label" id={id}>{label}</span>
      <div className="sg-choices">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className="sg-choice"
            aria-pressed={value === opt.key}
            onClick={() => onChange(value === opt.key ? '' : opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TrainingEnquiry() {
  useForceDark();
  const [searchParams] = useSearchParams();
  const loadedAt = useRef(Date.now());
  const turnstileToken = useRef(null);
  const resultRef = useRef(null);

  const preSector = has(SECTORS, searchParams.get('sector')) ? searchParams.get('sector') : '';
  const preFormats = preSector === 'school' ? SCHOOL_FORMATS : WORK_FORMATS;
  const preFormat = has(preFormats, searchParams.get('format')) ? searchParams.get('format') : '';

  useDocumentHead({
    title: 'Request a C4Site workshop',
    description:
      'Enquire about a C4Site AI workshop or a school incursion. Tell us your sector, the format and a rough group size, and the studio replies directly.',
    path: '/ai-training-enquiry',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'C4Site', path: '/Foresight' },
      { name: 'Request a workshop', path: '/ai-training-enquiry' },
    ]),
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    organisation: '',
    sector: preSector,
    format: preFormat,
    groupSize: '',
    message: '',
    _gotcha: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');

  const isSchool = form.sector === 'school';
  const formats = isSchool ? SCHOOL_FORMATS : WORK_FORMATS;
  const sizes = isSchool ? SCHOOL_SIZES : WORK_SIZES;

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  /* Switching between a school and a workplace swaps the choices; drop any
     pick that no longer exists rather than send a label from the other list. */
  const setSector = (sector) =>
    setForm((prev) => {
      const nextFormats = sector === 'school' ? SCHOOL_FORMATS : WORK_FORMATS;
      const nextSizes = sector === 'school' ? SCHOOL_SIZES : WORK_SIZES;
      return {
        ...prev,
        sector,
        format: has(nextFormats, prev.format) ? prev.format : '',
        groupSize: has(nextSizes, prev.groupSize) ? prev.groupSize : '',
      };
    });

  useEffect(() => {
    if (status === 'sent') resultRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await submitTrainingEnquiry({
        name: form.name,
        email: form.email,
        organisation: form.organisation,
        sector: labelFor(SECTORS, form.sector),
        format: labelFor(formats, form.format),
        group_size: labelFor(sizes, form.groupSize),
        message: form.message,
        _gotcha: form._gotcha,
        _loaded: loadedAt.current,
        turnstileToken: turnstileToken.current,
      });
      setStatus('sent');
    } catch (err) {
      console.error('Enquiry failed:', err);
      setError(err?.message || 'It did not send. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="sg-root">
      <ChalkDefs />

      <header className="sg-hero sg-sp-hero sg-hero--form">
        <div className="sg-wrap">
          <nav aria-label="Breadcrumb">
            <ol className="sg-crumb">
              <li>
                <Link to={createPageUrl('Foresight')}>C4Site</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Request a workshop</li>
            </ol>
          </nav>
          <ChalkHeading
            text={isSchool ? 'Tell us about your school.' : 'Tell us about your team.'}
            mark={isSchool ? 'your school.' : 'your team.'}
            className="sg-chalk-edge"
          />
          <p className="sg-lede">
            We reply within one business day with options. You don&rsquo;t need to book a call to
            start.
          </p>
        </div>
      </header>

      <section className="sg-form-page">
        <div className="sg-wrap sg-enquiry">
          <div className="sg-enquiry-slip">
          {status === 'sent' ? (
            <div className="sg-paper sg-slip" role="status">
              <h2 ref={resultRef} tabIndex={-1}>Enquiry received</h2>
              <p className="sg-slip-intro">
                Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}. We will reply within one
                business day with options for your {isSchool ? 'school' : 'team'}.
              </p>
              <Link
                to={createPageUrl(isSchool ? 'ForesightSchools' : 'Foresight')}
                className="sg-paper-link"
              >
                Back to C4Site
                <MarkArrow />
              </Link>
            </div>
          ) : (
            <form className="sg-paper sg-slip" onSubmit={handleSubmit}>
              <div className="sg-slip-row">
                <label className="sg-field">
                  <span className="sg-field-label">
                    Name <em>(required)</em>
                  </span>
                  <input
                    className="sg-input" required autoComplete="name"
                    value={form.name} onChange={(e) => update('name', e.target.value)}
                  />
                </label>
                <label className="sg-field">
                  <span className="sg-field-label">
                    Email <em>(required)</em>
                  </span>
                  <input
                    className="sg-input" type="email" required autoComplete="email"
                    value={form.email} onChange={(e) => update('email', e.target.value)}
                  />
                </label>
              </div>

              <label className="sg-field">
                <span className="sg-field-label">{isSchool ? 'School' : 'Organisation'}</span>
                <input
                  className="sg-input" autoComplete="organization"
                  value={form.organisation} onChange={(e) => update('organisation', e.target.value)}
                />
              </label>

              <Choices id="enq-sector" label="Sector" options={SECTORS} value={form.sector} onChange={setSector} />
              <Choices
                id="enq-format"
                label={isSchool ? 'What you are after' : 'Preferred format'}
                options={formats}
                value={form.format}
                onChange={(v) => update('format', v)}
              />
              <Choices
                id="enq-size"
                label={isSchool ? 'How many students or staff' : 'Rough group size'}
                options={sizes}
                value={form.groupSize}
                onChange={(v) => update('groupSize', v)}
              />

              <label className="sg-field">
                <span className="sg-field-label">
                  {isSchool ? 'Year levels, and roughly when' : 'What would you like to cover?'}{' '}
                  <em>(required)</em>
                </span>
                <textarea
                  className="sg-textarea" required
                  value={form.message} onChange={(e) => update('message', e.target.value)}
                  placeholder={
                    isSchool
                      ? 'Which year levels, how many classes, and a term or week that suits.'
                      : 'The team, the tools they use, and what you want them to get out of it.'
                  }
                />
              </label>

              {/* Honeypot */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
                <input
                  type="text" name="_gotcha" tabIndex={-1} autoComplete="off"
                  value={form._gotcha} onChange={(e) => update('_gotcha', e.target.value)}
                />
              </div>

              <div className="sg-field">
                <TurnstileWidget
                  theme="light"
                  onToken={(t) => { turnstileToken.current = t; }}
                  onExpire={() => { turnstileToken.current = null; }}
                />
              </div>

              {error && (
                <p className="sg-slip-error" role="alert">
                  {error} If it keeps failing, email{' '}
                  <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a> and we will pick it up from there.
                </p>
              )}

              <button type="submit" className="sg-btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send enquiry'}
                {status !== 'sending' && <MarkArrow />}
              </button>
            </form>
          )}
          </div>

          <aside className="sg-next" aria-labelledby="sg-next-head">
            <h2 className="sg-next-head" id="sg-next-head">What happens next</h2>
            <ol className="sg-next-list">
              {(isSchool ? NEXT_SCHOOL : NEXT_WORK).map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="sg-next-mail">
              Rather write it yourself? <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
