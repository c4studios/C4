/*
 * /About — the marked manuscript.
 *
 * Redrawn 14 September 2026. The founder's own words are the page, set as
 * one long draft that a hand has been over: a highlighter sweeps the lines
 * that matter as you reach them, a red pen runs down the margin and loops
 * where each part begins, the headings sit as stacked cut-outs, the
 * undertakings are folded boxes you open, and the opening plane is raked
 * away from the eye and straightens as you scroll. The copy is unchanged
 * from the previous page except that a duplicated four-step list and three
 * unsourced figures were dropped.
 *
 * Motion contract: everything ships finished. `.ab-armed` is added only
 * outside the prerender UA and reduced motion; without it the plane is flat,
 * every highlight is down, the pen is fully drawn and every box is open.
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, organizationSchema, personSchema } from '@/lib/schema';
import '../components/about/about.css';

gsap.registerPlugin(ScrollTrigger);

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
    year: 'Today',
    title: 'Loud websites. Quiet systems.',
    text: 'Four services, still founder-led, still direct from first call to launch.',
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


/* The highlighter. Marks the phrases it finds in a sentence, in order; a
   phrase that is not there is simply not marked. */
const HI = ['lime', 'yellow', 'pink'];
function Hi({ text, marks = [], start = 0 }) {
  const parts = [];
  let rest = text;
  let k = start;
  for (const phrase of marks) {
    const i = rest.indexOf(phrase);
    if (i === -1) continue;
    if (i > 0) parts.push(rest.slice(0, i));
    parts.push(<mark className={`ab2-hi ab2-hi--${HI[k % HI.length]}`} style={{ '--d': `${(k - start) * 140}ms` }} key={`${phrase}-${k}`}>{phrase}</mark>);
    rest = rest.slice(i + phrase.length);
    k += 1;
  }
  if (rest) parts.push(rest);
  return <>{parts}</>;
}

/* The red pen's path down the margin: a wobbling line that loops once where
   each part of the manuscript begins. Built from measured layout. */
function buildPen(height, tops, x) {
  let d = `M ${x} 0`;
  let y = 0;
  const queue = [...tops].filter((t) => t > 24).sort((a, b) => a - b);
  const wob = (yy) => x + Math.sin(yy / 61) * 5 + Math.sin(yy / 19) * 1.6;
  while (y < height) {
    const next = Math.min(height, y + 30);
    if (queue.length && next >= queue[0] - 18) {
      const ty = queue.shift();
      d += ` C ${wob(y + 10).toFixed(1)} ${(y + 12).toFixed(1)}, ${(x + 30).toFixed(1)} ${(ty - 22).toFixed(1)}, ${(x + 26).toFixed(1)} ${(ty - 2).toFixed(1)}`;
      d += ` C ${(x + 22).toFixed(1)} ${(ty + 16).toFixed(1)}, ${(x - 16).toFixed(1)} ${(ty + 14).toFixed(1)}, ${(x - 12).toFixed(1)} ${(ty - 4).toFixed(1)}`;
      d += ` C ${(x - 8).toFixed(1)} ${(ty - 20).toFixed(1)}, ${(x + 14).toFixed(1)} ${(ty - 10).toFixed(1)}, ${wob(ty + 18).toFixed(1)} ${(ty + 18).toFixed(1)}`;
      y = ty + 18;
    } else {
      d += ` Q ${wob(y + 15).toFixed(1)} ${(y + 15).toFixed(1)} ${wob(next).toFixed(1)} ${next.toFixed(1)}`;
      y = next;
    }
  }
  return d;
}

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

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

  const staticMode = useMemo(
    () => typeof window !== 'undefined' && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || /Prerender/i.test(navigator.userAgent)),
    [],
  );
  const rootRef = useRef(null);
  const planeRef = useRef(null);
  const scriptRef = useRef(null);
  const penRef = useRef(null);
  const penPathRef = useRef(null);
  const penGhostRef = useRef(null);
  const [open, setOpen] = useState(() => new Set(staticMode ? UNDERTAKINGS.map((u) => u.title) : [UNDERTAKINGS[0].title]));
  const toggle = (title) => setOpen((s) => { const n = new Set(s); if (n.has(title)) n.delete(title); else n.add(title); return n; });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || staticMode) return undefined;
    root.classList.add('ab-armed');

    /* One-shot reveals: highlights sweep, headings stack, boxes settle. */
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

    /* The opening plane is raked away and straightens over the first screen. */
    const plane = planeRef.current;
    const rake = plane ? gsap.fromTo(plane, { rotateX: 17, y: 8, transformPerspective: 1000, transformOrigin: '50% 100%' }, {
      rotateX: 0, y: 0, ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: '+=52%', scrub: 0.6 },
    }) : null;

    /* The red pen: built from the layout, drawn with the scroll. */
    const script = scriptRef.current;
    const svg = penRef.current;
    const path = penPathRef.current;
    const ghost = penGhostRef.current;
    let draw = null;
    const layout = () => {
      if (!script || !svg || !path) return;
      const H = script.offsetHeight;
      const sTop = script.getBoundingClientRect().top;
      const tops = Array.from(script.querySelectorAll('[data-sec]')).map((s) => s.getBoundingClientRect().top - sTop + 26);
      svg.setAttribute('viewBox', `0 0 64 ${H}`);
      svg.setAttribute('height', String(H));
      const d = buildPen(H, tops, 30);
      path.setAttribute('d', d);
      if (ghost) ghost.setAttribute('d', d);
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      if (ghost) ghost.style.strokeDasharray = `${len}`;
      if (draw) draw.kill();
      draw = gsap.fromTo([path, ghost].filter(Boolean), { strokeDashoffset: len }, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: script, start: 'top 62%', end: 'bottom 88%', scrub: 0.4 },
      });
    };
    layout();
    const ro = new ResizeObserver(() => { layout(); ScrollTrigger.refresh(); });
    if (script) ro.observe(script);

    return () => {
      root.classList.remove('ab-armed');
      io.disconnect();
      ro.disconnect();
      if (rake) { rake.scrollTrigger?.kill(); rake.kill(); }
      if (draw) { draw.scrollTrigger?.kill(); draw.kill(); }
    };
  }, [staticMode]);

  /* Static: the pen is one complete line. */
  useEffect(() => {
    if (!staticMode) return;
    const script = scriptRef.current, svg = penRef.current, path = penPathRef.current, ghost = penGhostRef.current;
    if (!script || !svg || !path) return;
    const H = script.offsetHeight;
    const sTop = script.getBoundingClientRect().top;
    const tops = Array.from(script.querySelectorAll('[data-sec]')).map((s) => s.getBoundingClientRect().top - sTop + 26);
    svg.setAttribute('viewBox', `0 0 64 ${H}`); svg.setAttribute('height', String(H));
    const d = buildPen(H, tops, 30); path.setAttribute('d', d); if (ghost) ghost.setAttribute('d', d);
  }, [staticMode]);

  const startUrl = createPageUrl('StartProject');
  const contactUrl = createPageUrl('Contact');

  return (
    <div className="ab2-root" ref={rootRef}>
      {/* ── The opening: a raked plane that straightens ── */}
      <header className="ab2-open">
        <div className="ab2-open-grid">
          <div className="ab2-plane" ref={planeRef}>
            <p className="ab2-kick">C4 Studios, Perth. Founder-led since 2022.</p>
            <h1 className="ab2-h1">Small studio. High standards. Direct contact.</h1>
            <p className="ab2-lede">
              C4 Studios is run directly from first call to launch. No handoff, no account layer, and no gap between the brief and the work.
            </p>
          </div>
          <figure className="ab2-photo" data-reveal>
            <img src="/founder-headshot.png" alt="Founder of C4 Studios" width="300" height="375" loading="eager" decoding="async" />
            <figcaption>Founder &amp; Web Solutions Architect · Perth, Australia</figcaption>
          </figure>
        </div>
      </header>

      {/* ── The manuscript: the pen in the margin, the words in the column ── */}
      <div className="ab2-script" ref={scriptRef}>
        <svg className="ab2-pen" ref={penRef} viewBox="0 0 64 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path ref={penGhostRef} className="ab2-pen-ghost" d="" />
          <path ref={penPathRef} className="ab2-pen-line" d="" />
        </svg>

        {/* Who's writing */}
        <section className="ab2-part" data-sec>
          <h2 className="ab2-h2 ab2-stack" data-reveal>Who you&rsquo;re talking to</h2>
          <div className="ab2-cols">
            <div className="ab2-prose">
              <p data-reveal><Hi text={BIO[0]} marks={['founder and sole operator', 'the person you talk to is the person doing the work']} /></p>
              <p data-reveal><Hi text={BIO[1]} marks={['volunteer regularly with children and communities']} start={2} /></p>
              <p data-reveal><Hi text={BIO[2]} marks={['Juris Doctor (JD) in Law']} start={1} /></p>
            </div>
            <aside className="ab2-margin" aria-label="At a glance">
              {GLANCE.map((g, i) => (
                <div className="ab2-note" data-reveal style={{ '--d': `${i * 90}ms` }} key={g.label}>
                  <span className="ab2-note-label">{g.label}</span>
                  <p>{g.text}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>

        {/* Chronology, as cut-out years */}
        <section className="ab2-part" data-sec>
          <h2 className="ab2-h2 ab2-stack" data-reveal>Where it&rsquo;s come from</h2>
          <ol className="ab2-years">
            {CHRONOLOGY.map((c, i) => (
              <li className="ab2-year-row" data-reveal style={{ '--d': `${i * 120}ms` }} key={c.year}>
                <span className="ab2-year ab2-stack" aria-hidden="true">{c.year}</span>
                <div className="ab2-year-body">
                  <span className="sr-only">{c.year}. </span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Undertakings, as folded boxes */}
        <section className="ab2-part" data-sec>
          <h2 className="ab2-h2 ab2-stack" data-reveal>What you can hold me to</h2>
          <p className="ab2-sub" data-reveal>Four undertakings. Open any of them.</p>
          <div className="ab2-folds">
            {UNDERTAKINGS.map((u, i) => {
              const isOpen = open.has(u.title);
              return (
                <div className={`ab2-fold${isOpen ? ' is-open' : ''}`} data-reveal style={{ '--d': `${i * 90}ms`, '--tilt': `${[-0.7, 0.5, -0.4, 0.6][i % 4]}deg` }} key={u.title}>
                  <button type="button" className="ab2-fold-btn" aria-expanded={isOpen} onClick={() => toggle(u.title)}>
                    <span className="ab2-fold-title">{u.title}</span>
                    <span className="ab2-fold-short">{u.short}</span>
                    <span className="ab2-fold-x" aria-hidden="true" />
                  </button>
                  <div className="ab2-fold-body">
                    <div><p>{u.detail}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Terms, highlighted */}
        <section className="ab2-part" data-sec>
          <h2 className="ab2-h2 ab2-stack" data-reveal>How the work is done</h2>
          <ul className="ab2-terms">
            {TERMS.map((t, i) => (
              <li data-reveal style={{ '--d': `${i * 80}ms` }} key={t.title}>
                <mark className={`ab2-hi ab2-hi--${HI[i % HI.length]}`}>{t.title}.</mark> {t.text}
              </li>
            ))}
          </ul>
        </section>

        {/* Procedure, four stops */}
        <section className="ab2-part" data-sec>
          <h2 className="ab2-h2 ab2-stack" data-reveal>How a project runs</h2>
          <ol className="ab2-steps">
            {PROCEDURE.map((p, i) => (
              <li className="ab2-step" data-reveal style={{ '--d': `${i * 100}ms` }} key={p.no}>
                <span className="ab2-step-dot" aria-hidden="true" />
                <h3>{p.label}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* The name, and why */}
        <section className="ab2-part ab2-part--faith" data-sec>
          <h2 className="ab2-h2 ab2-stack" data-reveal>Why &ldquo;C4&rdquo;</h2>
          <blockquote className="ab2-verse" data-reveal>
            <p>{VERSE}</p>
            <cite>Daniel 3:25</cite>
          </blockquote>
          <div className="ab2-prose ab2-prose--faith">
            {FAITH.map((f, i) => <p data-reveal style={{ '--d': `${i * 90}ms` }} key={f.slice(0, 20)}>{f}</p>)}
          </div>
        </section>
      </div>

      {/* ── The close ── */}
      <section className="ab2-close">
        <div className="ab2-close-inner">
          <h2 className="ab2-h2 ab2-stack" data-reveal>Start with a conversation.</h2>
          <p data-reveal>{PROCEDURE[0].text}</p>
          <div className="ab2-close-actions" data-reveal>
            <Link to={startUrl} className="ab2-btn">Start a project <ArrowIcon /></Link>
            <Link to={contactUrl} className="ab2-link">Or just say hello</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
