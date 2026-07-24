import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, organizationSchema, personSchema } from '@/lib/schema';
import '../components/about/about.css';

gsap.registerPlugin(ScrollTrigger);

/*
 * /About — "The Founder's Brief".
 * One continuous typeset legal instrument: a barrister's brief bound in
 * red ribbon, crossed with a statutory declaration. Testimony, particulars,
 * chronology, undertakings, a cited authority (Daniel 3:25) and terms of
 * engagement — the content already reads as a document. The old
 * eyebrow+card-grid template is replaced by document apparatus: a margin
 * rail, a single ruled Particulars table, an Exhibit A mount, a blind-
 * embossed seal and one red binding thread that is DRAWN (never travelled)
 * down the spine as you scroll. Parent-brand tokens, theme-neutral.
 * Every sentence of the prior copy is preserved verbatim.
 */

/* ── Content (verbatim) ──────────────────────────────────────────────── */

const PARTICULARS = [
  { label: 'Founder-led since 2022', value: '3 yrs' },
  { label: 'Perth businesses served', value: '50+' },
  { label: 'Assets shipped', value: '200+' },
  { label: 'Software products built', value: '6' },
];

const BIO = [
  "I'm the founder and sole operator of C4 Studios. Every conversation, every design decision, and every line of code comes directly from me. That's not a limitation — it's the model. It means the person you talk to is the person doing the work.",
  'My background spans web development, product design, data modelling, and education. Outside of client work, I volunteer regularly with children and communities — locally and internationally. These experiences shape how I work: with patience, with care, and with a deep respect for the people on the other side of the screen.',
  "I'm currently completing a Juris Doctor (JD) in Law — the same structured thinking and attention to detail that legal study demands is the same standard I bring to every project.",
];

const GLANCE = [
  {
    label: 'Work',
    text: 'Building full-stack web applications, marketing websites, AI-powered tools, and SaaS-style products. Responsible for the full arc — technical strategy, architecture, design, engineering, hosting, security, and ongoing maintenance.',
  },
  {
    label: 'Study',
    text: 'Currently studying a Juris Doctor (JD) in Law — sharpening the same discipline, precision, and structured thinking that shapes every project.',
  },
  {
    label: 'Service',
    text: "Regular children's ministry leader at Barnabas Christian Fellowship. Volunteering with Camp Kids Jam, remote community work in Leonora, and international outreach in Manila. Founded tutoring initiatives including The Learning Frontier.",
  },
  {
    label: 'Approach',
    text: 'Direct collaboration, thoughtful architecture, and genuine care for the outcome. Strong finance and data modelling experience supporting churches and community organisations with dashboards and reporting.',
  },
];

const CHRONOLOGY = [
  {
    year: '2022',
    title: 'C4 Studios begins',
    text: 'Founded in Perth as a one-person studio with a simple rule: the person you brief is the person who builds.',
  },
  {
    year: '2023',
    title: 'First systems clients',
    text: 'Moved beyond websites into automations and internal tools — replacing manual admin for local service businesses.',
  },
  {
    year: '2024',
    title: 'Quotr goes live',
    text: 'Shipped our first product to the public: instant quote calculators that any service business can embed in minutes.',
  },
  {
    year: '2025',
    title: 'The C4 Originals suite',
    text: 'ReturnDesk, ReviewLoop, Complia and FirmFlow join the lineup — software built from problems we kept seeing.',
  },
  {
    year: 'Today',
    title: 'Loud websites. Quiet systems.',
    text: 'Four services and a growing software shelf, still founder-led, still direct from first call to launch.',
  },
];

const UNDERTAKINGS = [
  {
    title: 'Engineering, not decoration',
    short: 'We build things that work, then make them beautiful.',
    detail:
      'Every site and system is built on real engineering — clean code, sensible architecture, and performance you can measure. Polish comes after the foundation is right, never instead of it.',
  },
  {
    title: 'Direct, always',
    short: 'You talk to the person doing the work.',
    detail:
      'No account managers, no handoff, no telephone game. From the first call to the final deploy, you work directly with the founder building your project.',
  },
  {
    title: 'Systems over band-aids',
    short: 'Fix the process, not just the symptom.',
    detail:
      'A website is 30% of the job. We look at the whole operation — where time leaks, what repeats, what could run itself — and build systems that compound instead of patches that rot.',
  },
  {
    title: 'Owned, not rented',
    short: 'You keep the keys to everything we build.',
    detail:
      'Full code handover, your own accounts, your own data. We build things you own outright — no lock-in, no hostage situations, no surprise monthly fees for access to your own work.',
  },
];

const FAITH = [
  'C4 — "See Four" — comes from Daniel 3. Three men were thrown into a furnace and a fourth appeared with them — a picture of God’s presence with His people under pressure (Daniel 3:25).',
  'I follow Yahweh. That conviction quietly shapes my integrity, the standards I hold to, and the way I treat clients — with honesty, patience and respect, whatever their beliefs.',
  'This is personal, not prescriptive. It informs the work without asking anything of visitors or clients.',
];

const VERSE =
  '"He answered and said, Lo, I see four men loose, walking in the midst of the fire, and they have no hurt; and the form of the fourth is like the Son of God."';

const PROCEDURE = [
  {
    no: '01',
    label: 'Conversation',
    text: 'A real call, not a form reply. We learn the business, the bottleneck, and the outcome you actually need.',
  },
  {
    no: '02',
    label: 'Scope & quote',
    text: 'A clear, fixed scope with transparent pricing — you know exactly what you get and what it costs before anything starts.',
  },
  {
    no: '03',
    label: 'Design & build',
    text: 'You see progress as it happens, with checkpoints to approve direction. No black boxes, no month-long silences.',
  },
  {
    no: '04',
    label: 'Launch & handover',
    text: 'Deployment, documentation, and full ownership transferred to you — plus a window of support to settle in.',
  },
];

const TERMS = [
  {
    title: 'Clear communication',
    text: "You'll always know where your project stands — timelines, progress, and decisions are shared openly and honestly.",
  },
  {
    title: 'Considered design',
    text: 'Every visual choice is made with intention. Typography, spacing, layout, and interaction quality that reflects the care behind your brand.',
  },
  {
    title: 'Solid engineering',
    text: 'Clean, well-structured code built for real-world performance — fast, responsive, and designed to last well beyond launch.',
  },
  {
    title: 'Direct collaboration',
    text: "You work with the person building your project. There are no layers between us — just straightforward, productive partnership.",
  },
  {
    title: 'Thoughtful handover',
    text: 'Every project includes proper documentation, deployment support, and a transition window so you feel confident going forward.',
  },
];

const NEXT = [
  {
    num: '01',
    label: 'Reach out',
    description: "Start a conversation about what you're looking to build. There's no pressure — just an open discussion.",
  },
  {
    num: '02',
    label: 'Scope & plan',
    description: 'You receive a clear proposal with defined deliverables, realistic timelines, and transparent pricing.',
  },
  {
    num: '03',
    label: 'Design & build',
    description: 'The work progresses with regular updates and check-ins, so you always know where things are at.',
  },
  {
    num: '04',
    label: 'Launch & handover',
    description: 'Your project goes live with proper documentation and a support window to make sure everything lands well.',
  },
];

/* ── The blind-emboss seal (inkless, pressed into the paper) ─────────── */

function SealArt() {
  const groups = ['ab-seal-lo', 'ab-seal-hi'];
  return (
    <svg viewBox="0 0 160 160" role="img" aria-label="C4 · See Four seal">
      <defs>
        <path id="ab-seal-top" d="M 26 80 A 54 54 0 0 1 134 80" />
        <path id="ab-seal-bot" d="M 26 80 A 54 54 0 0 0 134 80" />
      </defs>
      {groups.map((cls) => (
        <g className={cls} key={cls}>
          <circle cx="80" cy="80" r="74" fill="none" strokeWidth="1.4" />
          <circle cx="80" cy="80" r="65" fill="none" strokeWidth="1" />
          <text
            fontFamily="var(--ab-mono)"
            fontSize="9.5"
            letterSpacing="2.6"
            stroke="none"
          >
            <textPath href="#ab-seal-top" startOffset="50%" textAnchor="middle">
              SEE FOUR · STUDIOS
            </textPath>
          </text>
          <text
            fontFamily="var(--ab-mono)"
            fontSize="9"
            letterSpacing="2.4"
            stroke="none"
          >
            <textPath href="#ab-seal-bot" startOffset="50%" textAnchor="middle">
              PERTH · AUSTRALIA
            </textPath>
          </text>
          <text
            x="80"
            y="94"
            textAnchor="middle"
            fontFamily="var(--ab-mono)"
            fontSize="34"
            fontWeight="700"
            letterSpacing="1"
            stroke="none"
          >
            C4
          </text>
        </g>
      ))}
    </svg>
  );
}

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ── Page ────────────────────────────────────────────────────────────── */

export default function About() {
  const jsonLd = useMemo(() => [
    organizationSchema(),
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/About' },
    ]),
  ], []);

  useDocumentHead({
    title: 'About — Small Studio, High Standards, Direct Contact',
    description:
      'C4 Studios is a small founder-led design and development studio in Perth. Direct contact with the people doing the work, and a high bar for craft.',
    path: '/About',
    jsonLd,
  });

  const prerender = useMemo(
    () => typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent),
    [],
  );
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const staticMode = reduced || prerender;

  const rootRef = useRef(null);
  const boundRef = useRef(null);
  const threadRef = useRef(null);

  const [activeClause, setActiveClause] = useState(0);
  const [verseOpen, setVerseOpen] = useState(false);
  const [openNotes, setOpenNotes] = useState({});

  const toggleNote = (i) =>
    setOpenNotes((prev) => ({ ...prev, [i]: !prev[i] }));

  /* Arm reveals + draw the thread. Never under reduced-motion / Prerender:
     the un-armed default already renders every reveal visible, the thread
     fully sewn, undertaking details shown and the seal at rest.
     useLayoutEffect so `.ab-armed` lands before paint (no flash). */
  useLayoutEffect(() => {
    if (staticMode) return undefined;
    if (typeof window === 'undefined') return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    root.classList.add('ab-armed');

    const nodes = Array.from(root.querySelectorAll('[data-reveal]'));
    const reveal = (el) => el.classList.add('ab-in');

    // One-shot reveals as sections enter view.
    let io;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      nodes.forEach((el) => io.observe(el));
    } else {
      nodes.forEach(reveal);
    }

    // A reveal must never *gate* content (brief: headless renderers can
    // skip observers/transitions and ship a section blank). Reveal whatever
    // is in view on the first frame, and unconditionally reveal everything
    // shortly after — so no section can stay hidden if the observer is slow
    // or dead. The scroll entrance still plays for anyone who scrolls first.
    const raf = requestAnimationFrame(() => {
      const vh = window.innerHeight || 0;
      nodes.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > 0) reveal(el);
      });
    });
    const failsafe = window.setTimeout(() => nodes.forEach(reveal), 1600);

    return () => {
      root.classList.remove('ab-armed');
      if (io) io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
    };
  }, [staticMode]);

  /* Exhibit A tilts in the hand — the founder photo leans a few degrees
     toward the cursor like a plate being picked up (fine pointers only;
     transform-only, cleared on leave). */
  useEffect(() => {
    if (staticMode) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const root = rootRef.current;
    const plate = root?.querySelector('.ab-exhibit-plate');
    if (!plate) return undefined;
    const onMove = (e) => {
      const r = plate.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      plate.style.setProperty('--ab-rx', `${(-dy * 5).toFixed(2)}deg`);
      plate.style.setProperty('--ab-ry', `${(dx * 6).toFixed(2)}deg`);
    };
    const onLeave = () => {
      plate.style.setProperty('--ab-rx', '0deg');
      plate.style.setProperty('--ab-ry', '0deg');
    };
    plate.addEventListener('pointermove', onMove);
    plate.addEventListener('pointerleave', onLeave);
    return () => {
      plate.removeEventListener('pointermove', onMove);
      plate.removeEventListener('pointerleave', onLeave);
    };
  }, [staticMode]);

  useEffect(() => {
    if (staticMode) return undefined;
    const bound = boundRef.current;
    const line = threadRef.current;
    if (!bound || !line) return undefined;

    // Start un-sewn, then scrub the stitch top→down with scroll. Transform-
    // free: only the clip inset moves, on a 2px line (negligible paint).
    line.style.setProperty('--ab-draw', '0');
    const set = (p) => line.style.setProperty('--ab-draw', p.toFixed(4));

    const st = ScrollTrigger.create({
      trigger: bound,
      start: 'top 64%',
      end: 'bottom 82%',
      onUpdate: (self) => set(self.progress),
      onRefresh: (self) => set(self.progress),
    });

    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(bound);

    return () => {
      st.kill();
      ro.disconnect();
      line.style.removeProperty('--ab-draw');
    };
  }, [staticMode]);

  const startUrl = createPageUrl('StartProject');

  return (
    <div className="ab-root" ref={rootRef}>
      <div className="ab-doc">
        {/* ═══ Masthead — head of the instrument ═══ */}
        <header className="ab-masthead">
          <div className="ab-caption" data-reveal>
            <span>In the matter of C4 Studios</span>
            <span className="ab-cap-seal">· See Four ·</span>
            <span className="ab-cap-file">File · C4 / About</span>
          </div>

          <div className="ab-mast-grid">
            <div>
              <h1 className="ab-h1" data-reveal>
                Small studio. High standards. Direct contact.
              </h1>
              <p className="ab-lede" data-reveal style={{ '--d': '90ms' }}>
                C4 Studios is run directly from first call to launch. No handoff, no account layer, and no gap between the brief and the work.
              </p>
            </div>

            <figure className="ab-exhibit" data-reveal style={{ '--d': '150ms' }}>
              <div className="ab-exhibit-plate">
                <div className="ab-exhibit-photo">
                  <span className="ab-corner tl" aria-hidden="true" />
                  <span className="ab-corner tr" aria-hidden="true" />
                  <span className="ab-corner br" aria-hidden="true" />
                  <span className="ab-corner bl" aria-hidden="true" />
                  <img
                    src="/founder-headshot.png"
                    alt="Founder of C4 Studios"
                    width="300"
                    height="375"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
              <figcaption className="ab-exhibit-tag">
                <span className="ab-tag-ref">Exhibit A</span>
                <span className="ab-tag-role">Founder &amp; Web Solutions Architect</span>
                <span className="ab-tag-loc">C4 Studios | Perth, Australia</span>
              </figcaption>
            </figure>
          </div>
        </header>

        {/* ═══ The bound brief — the thread runs its spine ═══ */}
        <div className="ab-bound" ref={boundRef}>
          <div className="ab-thread" aria-hidden="true">
            <div className="ab-thread-line" ref={threadRef}>
              <span className="ab-knot" style={{ top: '4%' }} />
              <span className="ab-knot" style={{ top: '34%' }} />
              <span className="ab-knot" style={{ top: '66%' }} />
              <span className="ab-knot" style={{ top: '96%' }} />
            </div>
          </div>

          {/* Particulars — the single ruled table */}
          <section className="ab-part" data-part>
            <div className="ab-rail" aria-hidden="true" />
            <div className="ab-body">
              <h2 className="ab-h2" data-reveal>Particulars</h2>
              <dl className="ab-particulars ab-lead-in" data-reveal>
                {PARTICULARS.map((p) => (
                  <div className="ab-particular" key={p.label}>
                    <dt className="ab-particular-label">{p.label}</dt>
                    <dd className="ab-particular-value ab-num">{p.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Testimony */}
          <section className="ab-part" data-part>
            <div className="ab-rail">
              <span className="ab-rail-sub" data-reveal>Testimony of the founder</span>
            </div>
            <div className="ab-body">
              <h2 className="ab-h2" data-reveal>Who I Am</h2>
              <div className="ab-lead-in">
                {BIO.map((para, i) => (
                  <p className="ab-prose" data-reveal style={{ '--d': `${i * 60}ms` }} key={para.slice(0, 24)}>
                    {para}
                  </p>
                ))}
              </div>

              <div className="ab-glance" data-reveal>
                <p className="ab-runins-cap">At a Glance</p>
                <div className="ab-runins">
                  {GLANCE.map((g) => (
                    <p className="ab-runin ab-runin--label" key={g.label}>
                      <span className="ab-runin-lead">{g.label}</span>
                      <span className="ab-runin-sep"> — </span>
                      {g.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Chronology — a real sequence, so numbered by year */}
          <section className="ab-part" data-part>
            <div className="ab-rail">
              <span className="ab-rail-sub" data-reveal>The story so far</span>
            </div>
            <div className="ab-body">
              <h2 className="ab-h2" data-reveal>How we got here.</h2>
              <ol className="ab-chrono ab-lead-in">
                {CHRONOLOGY.map((m, i) => (
                  <li className="ab-chrono-item" data-reveal style={{ '--d': `${i * 50}ms` }} key={m.year}>
                    <span className="ab-chrono-year ab-num">{m.year}</span>
                    <div className="ab-chrono-body">
                      <span className="ab-chrono-title">{m.title}</span>
                      <p className="ab-chrono-text">{m.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Undertakings — indented, detail as marginalia */}
          <section className="ab-part" data-part>
            <div className="ab-rail">
              <span className="ab-rail-sub" data-reveal>What we stand on</span>
            </div>
            <div className="ab-body">
              <h2 className="ab-h2" data-reveal>Four principles, every project.</h2>
              <p className="ab-sub ab-lead-in" data-reveal>
                Hover any principle to see what it means in practice.
              </p>
              <ul className="ab-undertakings">
                {UNDERTAKINGS.map((u, i) => {
                  const open = Boolean(openNotes[i]);
                  return (
                    <li className="ab-undertaking" data-reveal style={{ '--d': `${i * 50}ms` }} key={u.title}>
                      <div className="ab-undertaking-head">
                        <span className="ab-undertaking-mark" aria-hidden="true" />
                        <div>
                          <h3 className="ab-undertaking-title">{u.title}</h3>
                          <p className="ab-undertaking-short">{u.short}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ab-undertaking-trigger"
                        aria-expanded={open}
                        aria-controls={`ab-note-${i}`}
                        onClick={() => toggleNote(i)}
                      >
                        <span aria-hidden="true" />
                        In practice
                      </button>
                      <div
                        className="ab-undertaking-detail"
                        id={`ab-note-${i}`}
                        data-open={open ? 'true' : undefined}
                      >
                        <span>{u.detail}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* See Four — the cited authority + blind-emboss seal */}
          <section className="ab-part" data-part>
            <div className="ab-rail">
              <span className="ab-rail-sub" data-reveal>The story behind the name.</span>
            </div>
            <div className="ab-body">
              <div className="ab-authority">
                <div>
                  <h2 className="ab-h2" data-reveal>See Four.</h2>
                  <div className="ab-lead-in">
                    {FAITH.map((para, i) => (
                      <p className="ab-prose" data-reveal style={{ '--d': `${i * 60}ms` }} key={para.slice(0, 24)}>
                        {para}
                      </p>
                    ))}
                  </div>

                  <div className="ab-verse">
                    <button
                      type="button"
                      className="ab-verse-toggle"
                      aria-expanded={verseOpen}
                      aria-controls="ab-verse-panel"
                      onClick={() => setVerseOpen((v) => !v)}
                    >
                      <span className="ab-verse-plus" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <line x1="6" y1="1.5" x2="6" y2="10.5" />
                          <line x1="1.5" y1="6" x2="10.5" y2="6" />
                        </svg>
                      </span>
                      Read the verse
                    </button>
                    <div className="ab-verse-panel" id="ab-verse-panel" data-open={verseOpen ? 'true' : undefined}>
                      <div>
                        <div className="ab-verse-inner">
                          <blockquote className="ab-verse-quote">{VERSE}</blockquote>
                          <p className="ab-verse-cite">— Daniel 3:25, KJV</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ab-seal" data-reveal aria-hidden="true">
                  <SealArt />
                </div>
              </div>
            </div>
          </section>

          {/* Procedure — a real procedure, so numbered clauses */}
          <section className="ab-part" data-part>
            <div className="ab-rail">
              <span className="ab-rail-sub" data-reveal>How we work</span>
            </div>
            <div className="ab-body">
              <h2 className="ab-h2" data-reveal>Four steps, start to finish.</h2>
              <ol className="ab-procedure ab-lead-in" data-reveal>
                {PROCEDURE.map((s, i) => (
                  <li
                    className="ab-clause"
                    key={s.no}
                    data-active={activeClause === i ? 'true' : undefined}
                    onMouseEnter={() => setActiveClause(i)}
                  >
                    <span className="ab-clause-no ab-num">{s.no}</span>
                    <span className="ab-clause-title">{s.label}</span>
                    <p className="ab-clause-text">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Terms of engagement */}
          <section className="ab-part" data-part>
            <div className="ab-rail" aria-hidden="true" />
            <div className="ab-body">
              <h2 className="ab-h2" data-reveal>What You Can Expect</h2>
              <p className="ab-sub ab-lead-in" data-reveal>
                Working with C4 Studios is a straightforward, personal experience. Here is what that looks like in practice.
              </p>
              <div className="ab-runins ab-lead-in" data-reveal>
                {TERMS.map((t) => (
                  <p className="ab-runin" key={t.title}>
                    <span className="ab-runin-lead">{t.title}</span>
                    <span className="ab-runin-sep"> — </span>
                    {t.text}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* Execution — what happens next + sign-off */}
          <section className="ab-part" data-part>
            <div className="ab-rail" aria-hidden="true" />
            <div className="ab-body">
              <div className="ab-execution">
                <h2 className="ab-h2" data-reveal>What Happens Next</h2>
                <p className="ab-sub ab-lead-in" data-reveal>
                  A simple, transparent process from first conversation to finished product.
                </p>
                <ol className="ab-next" data-reveal>
                  {NEXT.map((n) => (
                    <li className="ab-next-item" key={n.num}>
                      <span className="ab-next-no ab-num">{n.num}</span>
                      <span className="ab-next-label">{n.label}</span>
                      <span className="ab-next-text">{n.description}</span>
                    </li>
                  ))}
                </ol>

                <div className="ab-signoff">
                  <p className="ab-signoff-head" data-reveal>Ready to start?</p>
                  <p className="ab-signoff-sub" data-reveal>
                    I&apos;d love to hear about your project. Let&apos;s start with a conversation.
                  </p>
                  <Link to={startUrl} className="ab-cta" data-reveal>
                    Start a Project
                    <ArrowIcon />
                  </Link>
                  <p className="ab-signoff-line" aria-hidden="true">
                    Executed at Perth · Western Australia
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
