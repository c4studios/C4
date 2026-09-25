/*
 * /c4sight-previews — the free C4Site packs, on the board.
 *
 * Pick any of the five series, leave a name and a school email, and the PDFs
 * download on the page. The capture never stands between a teacher and the
 * pack: only a 400 stops delivery. Email deep links pre-tick a group
 * (#primary → S1 and S2, #secondary → S3 and S4, #staff → S5), and ?src=
 * tags where the visitor came from. The look moved onto the board on 21 Sep
 * 2026, and the button stopped greying out: a press with nothing ticked or no
 * email now says what is missing instead of doing nothing.
 *
 * 24 Sep 2026: each row shows the pack's real cover (rendered from the
 * published PDF into public/c4site-art/series-N.webp), and the rules frame
 * that repeated the schools page word for word is now a short crossed list of
 * what the packs never need. The curriculum line no longer says "every
 * pack": Series 5, the staff pack, has no curriculum codes.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';
import { c4SiteIncursion } from '@/data/pricing';
import { submitPreviewDownload } from '@/api/submissions';
import { C4SITE_SERIES as SERIES } from '@/data/c4siteSeries';
import { BoardClose, BoardHero, CrossList } from '@/components/sight/SectorPage';
import { ChalkDefs, MarkArrow, MarkTick, useForceDark } from '@/components/sight-arm/kit';

const GROUP_FROM_HASH = { primary: ['S1', 'S2'], secondary: ['S3', 'S4'], staff: ['S5'], all: [] };

const NEVER_NEEDED = [
  'Student devices',
  'Student data, entered anywhere',
  'Photos of students, or images of them made or uploaded',
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

export default function C4SitePreviews() {
  useForceDark();
  const [selected, setSelected] = useState(() => new Set());
  const [form, setForm] = useState({ first_name: '', school_name: '', email: '', _gotcha: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | done
  const [error, setError] = useState('');
  const loadedAt = useRef(Date.now());
  const sourceRef = useRef('website-organic');

  useDocumentHead({
    title: 'Free C4Site classroom AI packs | C4 Studios',
    description:
      'Download the free C4Site packs: a real, runnable AI lesson for every age group, from Pre-primary to Staff PD. No devices and no student data, mapped to the WA curriculum.',
    path: '/c4sight-previews',
    jsonLd: [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'C4Site', path: '/Foresight' },
        { name: 'Free packs', path: '/c4sight-previews' },
      ]),
    ],
  });

  // Honour the email deep links and a ?src= attribution, once on mount.
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
  const chosen = useMemo(() => SERIES.filter((s) => selected.has(s.key)), [selected]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (selected.size === 0) return setError('Pick at least one pack to download.');
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
      // packs are public files, and a capture hiccup must not cost them the lesson).
      if (err?.status === 400) {
        setStatus('idle');
        return setError(err.message || 'Please check your details and try again.');
      }
    }
    chosen.forEach((s, i) => setTimeout(() => deliverPack(s.file), i * 350));
    setStatus('done');
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const count = selected.size;

  return (
    <div className="sg-root">
      <ChalkDefs />

      <BoardHero
        crumb="Free packs"
        heading="Take a real lesson for a test drive."
        mark="test drive."
        intro="There is a free pack for every C4Site series, each with a complete activity you can run without us and a plain safety note. Pick the ones that fit your school and they download right here."
      />

      <section className="sg-section">
        <div className="sg-wrap">
          <div className="sg-two">
            {/* ── The five series, ticked on the board ── */}
            <div>
              <div className="sg-two-head">
                <h2 className="sg-h2" id="sg-pick-head">Choose your packs</h2>
                <button
                  type="button"
                  className="sg-pick-all"
                  onClick={() => setSelected(allSelected ? new Set() : new Set(SERIES.map((s) => s.key)))}
                >
                  {allSelected ? 'Clear all' : 'Select all five'}
                </button>
              </div>
              <ul className="sg-pick" aria-labelledby="sg-pick-head">
                {SERIES.map((s) => {
                  const on = selected.has(s.key);
                  return (
                    <li key={s.key}>
                      <button type="button" onClick={() => toggle(s.key)} aria-pressed={on}>
                        <span className="sg-pick-box" aria-hidden="true">
                          {on && <MarkTick />}
                        </span>
                        <img
                          className="sg-pick-cover"
                          src={`/c4site-art/series-${s.key.slice(1)}.webp`}
                          alt=""
                          width="160"
                          height="227"
                          loading="lazy"
                          decoding="async"
                        />
                        <span>
                          <span className="sg-pick-band">{s.band}</span>
                          <span className="sg-pick-name">{s.name}</span>
                          <span className="sg-pick-line">{s.line}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ── The slip: details in, packs out ── */}
            <div>
              <div className="sg-sticky">
                {status === 'done' ? (
                  <div className="sg-paper sg-slip" role="status">
                    <h2>Your packs are downloading</h2>
                    <p className="sg-slip-intro">If a download did not start, open it here:</p>
                    <ul className="sg-slip-links">
                      {chosen.map((s) => (
                        <li key={s.key}>
                          <a href={s.file} target="_blank" rel="noopener noreferrer">
                            {s.name}
                            <span className="sg-sr"> (PDF, opens in a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p className="sg-slip-small">
                      We have noted your details and may send one or two short notes about the
                      incursion. Reply STOP to any of them and we will leave it there.
                    </p>
                    <Link to={createPageUrl('TrainingEnquiry') + '?sector=school'} className="sg-paper-link">
                      Talk to us about a visit
                      <MarkArrow />
                    </Link>
                  </div>
                ) : (
                  <form className="sg-paper sg-slip" onSubmit={onSubmit} noValidate>
                    <h2>Get your packs</h2>
                    <p className="sg-slip-intro">
                      They download on this page as soon as you press the button. We keep a note of
                      who has them.
                    </p>

                    <label className="sg-field">
                      <span className="sg-field-label">First name</span>
                      <input
                        className="sg-input" type="text" name="first_name" autoComplete="given-name"
                        value={form.first_name} onChange={set('first_name')}
                      />
                    </label>
                    <label className="sg-field">
                      <span className="sg-field-label">School</span>
                      <input
                        className="sg-input" type="text" name="organization" autoComplete="organization"
                        value={form.school_name} onChange={set('school_name')}
                      />
                    </label>
                    <label className="sg-field">
                      <span className="sg-field-label">
                        School email <em>(required)</em>
                      </span>
                      <input
                        className="sg-input" type="email" name="email" autoComplete="email" required
                        aria-invalid={error && !emailValid ? 'true' : undefined}
                        value={form.email} onChange={set('email')}
                      />
                    </label>
                    {/* honeypot */}
                    <input
                      type="text" name="_gotcha" tabIndex={-1} autoComplete="off"
                      value={form._gotcha} onChange={set('_gotcha')}
                      style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                      aria-hidden="true"
                    />

                    <p className="sg-count" aria-live="polite">
                      <span>Selected</span>
                      <b>{count} of {SERIES.length}</b>
                    </p>

                    {error && <p className="sg-slip-error" role="alert">{error}</p>}

                    <button type="submit" className="sg-btn" disabled={status === 'submitting'}>
                      {status === 'submitting'
                        ? 'One moment…'
                        : `Download ${count > 0 ? `${count} pack${count > 1 ? 's' : ''}` : 'packs'}`}
                      {status !== 'submitting' && <MarkArrow />}
                    </button>

                    <p className="sg-slip-small">
                      We may also send one or two short notes about the incursion. Reply STOP to any
                      of them and we will leave it there.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sg-section">
        <div className="sg-wrap">
          <div className="sg-split">
            <div>
              <h2 className="sg-h2">What the packs never need.</h2>
              <p className="sg-sub">
                Every activity runs unplugged, or on one device at the front of the room. The four
                classroom series are mapped to SCSA&rsquo;s WA curriculum in its own codes, and to the
                Australian Curriculum v9.
              </p>
            </div>
            <CrossList items={NEVER_NEEDED} className="sg-crosslist--big" />
          </div>
        </div>
      </section>

      <BoardClose
        heading="Ran the activity? See what the live incursion adds."
        mark="live incursion"
        sub={`${c4SiteIncursion.priceLabel} for ${c4SiteIncursion.minutes} minutes, with up to ${c4SiteIncursion.maxStudents} students and your own teacher in the room.`}
        cta="The 90-minute incursion"
        to={createPageUrl('ForesightSchools')}
      />
    </div>
  );
}
