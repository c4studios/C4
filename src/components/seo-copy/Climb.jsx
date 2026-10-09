/*
 * The opening of /seo-and-copywriting and the page's one authored moment:
 * the climb. The results page (Results.jsx) holds an example search; your
 * listing starts at the top of page two, and each piece of work in the
 * column beside it moves it up, until it's first.
 *
 * Armed (motion allowed, and a window at least 560px tall), the page pins
 * beside the steps from 1024px wide, or as a band across the top below
 * that, and the scroll drives it directly. Each step holds a position while
 * its words are read; between two steps the listing travels, overtaking the
 * results it passes one at a time, and it moves with a little weight (the
 * value it draws follows the scroll through a short damping). Nothing is
 * re-rendered while it moves: positions are written straight to the page.
 *
 * Flat (the prerenderer, reduced motion, or a window too short to pin), the
 * page doesn't move at all: the opening shows the starting point, and every
 * step carries its own still of the results. The words never depend on the
 * motion; each step says where the listing sits in plain text, so the climb
 * is never announced as it moves. The one thing announced, politely, is a
 * change of example search, because the visitor asked for it.
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import useStaticMode from '@/hooks/useStaticMode';
import { seoPackages } from '@/data/pricing';
import { createPageUrl } from '@/utils';
import Results, { ordinal } from './Results';
import { EXAMPLES, RANKS } from './examples';

const PRERENDER = typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent);
const TALL_ENOUGH = '(min-height: 560px)';
const WIDE = '(min-width: 1024px)';
const COMPACT = '(max-width: 639.98px)';
const START = createPageUrl('StartProject');

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10); // smootherstep

const STEPS = [
  {
    key: 'stand',
    title: 'Where you stand',
    body: 'First we find out where you actually sit for the searches that bring in work, and why. Usually a handful of faults does most of the damage, like a page title that just says Home, or nothing that says where you work.',
    where: 'at the top of page two',
  },
  {
    key: 'read',
    title: 'Google can read it',
    body: 'Before anything ranks, Google has to be able to find the page and make sense of it. That means Search Console, a sitemap, clean page addresses and structured data. It’s plumbing, and technical fixes can lift a site within weeks.',
    where: 'onto page one',
  },
  {
    key: 'say',
    title: 'It says what you do, and where',
    body: 'This is where SEO and copywriting meet. A result’s title and description are the first words anyone reads, so we write them the way people search, with the job and the suburb up front, and give people a reason to click.',
    where: '',
  },
  {
    key: 'ask',
    title: 'Pages for what people ask',
    body: 'People search with questions too, like what a job costs or how long it takes. A page that answers one plainly, near the top, keeps answering that search for years. The monthly plans add new ones every month.',
    where: '',
  },
  {
    key: 'point',
    title: 'Other sites point to you',
    body: 'Google trusts a business that relevant sites mention, like a supplier or an industry body. For local searches, a complete Google Business Profile can do more than the website. Bought links get sites burned, so we don’t buy them.',
    where: '',
  },
];

const byKey = Object.fromEntries(seoPackages.map((p) => [p.key, p]));
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
const list = (xs) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/* The first feature line of a package matching a pattern, or null. */
const has = (key, re) => {
  for (const f of (byKey[key] && byKey[key].features) || []) {
    const m = re.exec(f);
    if (m) return m;
  }
  return null;
};

/* The plans that take in a package's work: "Everything in Foundation". */
function heirsOf(key) {
  const out = [];
  let from = byKey[key];
  while (from) {
    const next = seoPackages.find((p) => (p.features || []).some((f) => f.toLowerCase() === `everything in ${from.name.toLowerCase()}`));
    if (!next) break;
    out.push(next.name);
    from = next;
  }
  return out;
}

/* Which plans do each step's work, said exactly as the feature lists say it.
   A clause whose feature line has gone simply drops out. */
const WHO = {
  stand: () => {
    const audit = has('foundation', /technical seo audit/i);
    const words = has('foundation', /keyword research report \((\d+) keywords\)/i);
    return [
      has('seo-core', /technical seo health check/i) && 'Core runs a technical health check.',
      audit && `Foundation runs a full audit${words ? ` and researches ${words[1]} keywords` : ''}.`,
    ];
  },
  read: () => {
    const watchers = seoPackages.filter((p) => has(p.key, /ongoing technical seo monitoring/i)).map((p) => p.key);
    const watching = [...new Set(watchers.flatMap((k) => [byKey[k].name, ...heirsOf(k)]))];
    return [
      has('seo-core', /search console/i) && has('seo-core', /sitemap/i) && 'Core sets up Search Console and submits the sitemap.',
      has('foundation', /schema markup/i) && has('foundation', /robots\.txt/i) && 'Foundation adds schema markup and robots.txt.',
      watching.length ? `${list(watching)} keep watching it every month.` : null,
    ];
  },
  say: () => {
    const core = has('seo-core', /meta titles .*\(up to (\d+) pages\)/i);
    const fdn = has('foundation', /on-page optimisation \(up to (\d+) pages\)/i);
    return [
      core && `Core rewrites the titles and descriptions on up to ${core[1]} pages.`,
      fdn && `Foundation optimises up to ${fdn[1]} pages${heirsOf('foundation').length ? `, and ${list(heirsOf('foundation'))} include all of Foundation` : ''}.`,
    ];
  },
  ask: () => {
    const writes = seoPackages
      .map((p) => [p.name, (has(p.key, /^(\d+)\b[^/]*\b(?:posts?|articles?)\b.*month/i) || [])[1]])
      .filter(([, n]) => n);
    if (!writes.length) return [];
    const parts = writes.map(([name, n], i) => (i === 0 ? `${name} writes ${WORDS[n] || n} a month` : `${name} ${WORDS[n] || n}`));
    return [`${list(parts)}.`];
  },
  point: () => [
    has('growth', /backlink opportunit/i) && 'Growth finds the link opportunities.',
    has('dominate', /active backlink building/i) && has('dominate', /gbp|business profile/i)
      && 'Dominate builds the links and manages your Google Business Profile.',
  ],
};

/* Worked out once: pricing.js doesn't change while the page is open. */
const SAID = Object.fromEntries(STEPS.map((s) => [s.key, (WHO[s.key] ? WHO[s.key]() : []).filter(Boolean)]));

function WhoDoesIt({ step }) {
  const said = SAID[step] || [];
  if (!said.length) return null;
  return <p className="sc-step-who">{said.join(' ')}</p>;
}

/* A media query as state, read synchronously on the first render so the
   page lays out right before it paints. */
function useMedia(query, enabled = true) {
  const read = () => enabled && typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia(query).matches;
  const [on, setOn] = useState(read);
  useEffect(() => {
    if (!enabled || typeof window.matchMedia !== 'function') { setOn(false); return undefined; }
    const mq = window.matchMedia(query);
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, [query, enabled]);
  return on;
}

export default function Climb() {
  const staticMode = useStaticMode();
  const armed = useMedia(TALL_ENOUGH, !staticMode);
  const wide = useMedia(WIDE);
  const compact = useMedia(COMPACT);
  const [exKey, setExKey] = useState(EXAMPLES[0].key);
  const ex = EXAMPLES.find((e) => e.key === exKey) || EXAMPLES[0];
  const [step, setStep] = useState(0);
  const [said, setSaid] = useState('');
  const stageApi = useRef(null);
  const stageRef = useRef(null);
  const stepRefs = useRef([]);
  const stepNow = useRef(0);

  /* The scroll drives the climb. Each step's words hold a position; the
     listing travels between two of them while the next step's heading rises
     to the reading line (56% down the screen beside the steps, or 42% of the
     way down the room under the band). */
  useEffect(() => {
    if (!armed) { stepNow.current = 0; setStep(0); return undefined; }
    const wideMq = window.matchMedia(WIDE);
    let raf = 0;
    let last = 0;
    let drawn = RANKS[0];
    let placed = NaN; // what the page was last drawn at; a hold redraws nothing

    const progress = () => {
      const vh = window.innerHeight;
      let line = vh * 0.56;
      let travel = vh * 0.32;
      if (!wideMq.matches && stageRef.current) {
        const b = stageRef.current.getBoundingClientRect().bottom;
        line = b + (vh - b) * 0.42;
        travel = Math.max(90, (vh - b) * 0.5);
      }
      let p = 0;
      stepRefs.current.forEach((el) => {
        if (!el) return;
        p += smooth(clamp01((line + travel - el.getBoundingClientRect().top) / travel));
      });
      return p;
    };

    const frame = (t) => {
      raf = 0;
      const p = progress();
      const i = Math.min(RANKS.length - 2, Math.floor(p));
      const target = RANKS[i] + (RANKS[i + 1] - RANKS[i]) * (p - i);
      const dt = last ? Math.min(48, t - last) : 16;
      drawn += (target - drawn) * (1 - Math.exp(-dt / 85));
      if (Math.abs(target - drawn) < 0.002) drawn = target;
      if (stageApi.current && drawn !== placed) { stageApi.current.place(drawn); placed = drawn; }
      const s = Math.min(STEPS.length, Math.floor(p + 0.5));
      if (s !== stepNow.current) { stepNow.current = s; setStep(s); }
      if (drawn !== target) { last = t; raf = requestAnimationFrame(frame); } else { last = 0; }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    /* a resize can change the scale, so the next frame redraws whatever it is */
    const resized = () => { placed = NaN; kick(); };

    /* the first frame lands where the scroll already is, with no travel */
    const p0 = progress();
    const i0 = Math.min(RANKS.length - 2, Math.floor(p0));
    drawn = RANKS[i0] + (RANKS[i0 + 1] - RANKS[i0]) * (p0 - i0);
    kick();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', resized);
    const fonts = typeof document !== 'undefined' && document.fonts && document.fonts.ready;
    if (fonts) fonts.then(resized, () => {});
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', resized);
    };
  }, [armed, wide]);

  const choose = (e) => {
    setExKey(e.key);
    setSaid(`Showing the example search “${e.query}”.`);
  };

  return (
    <section className={`sc-climb ${armed ? 'is-armed' : 'is-flat'}`} aria-labelledby="sc-h1">
      <div className="sc-frame sc-climb-grid">
        <header className="sc-intro">
          <h1 className="sc-h1" id="sc-h1">SEO and copywriting in Perth</h1>
          <p className="sc-lede">
            When someone searches Google for what you do, the first few results get the call. We do the work that moves
            your business up that page, and we write what people read when they get there.
          </p>
          <div className="sc-actions">
            <Link to={`${START}?service=seo`} className="sc-btn-start">Start a project</Link>
            <a href="#prices" className="sc-btn-ghost">See the prices</a>
          </div>
        </header>

        <div className="sc-stage-col">
          <figure className="sc-stage" ref={stageRef}>
            {armed ? (
              <Results ref={stageApi} ex={ex} step={step} compact={compact} foot={wide} typing />
            ) : (
              <Results ex={ex} step={0} still skeleton={PRERENDER} compact={compact} />
            )}
            <figcaption className="sr-only">
              {`An example search for “${ex.query}”. Your business starts ${ordinal(RANKS[0])}, at the top of page two, and each step below moves it up.`}
            </figcaption>
          </figure>
        </div>

        <div className="sc-try">
          <p className="sc-try-label" id="sc-try-label">Try another example search</p>
          <div className="sc-chips" role="group" aria-labelledby="sc-try-label">
            {EXAMPLES.map((e) => (
              <button
                key={e.key}
                type="button"
                className="sc-chip"
                aria-pressed={e.key === ex.key}
                onClick={() => choose(e)}
              >
                {e.query}
              </button>
            ))}
          </div>
          <p className="sc-try-note">
            The search is an example. The other results are stand-ins, and in real life the climb takes months.
            {armed ? ' Scroll down and watch what each piece of work does to your listing.' : ' Each step below shows where your listing sits once that work is done.'}
          </p>
          <p className="sr-only" aria-live="polite">{said}</p>
        </div>

        <ol className="sc-steps">
          {STEPS.map((s, i) => {
            const rank = RANKS[i + 1];
            const on = armed && step === i + 1;
            return (
              <li key={s.key} className={`sc-step${on ? ' is-on' : ''}`}>
                <div className="sc-step-text" ref={(el) => { stepRefs.current[i] = el; }}>
                  <h2 className="sc-step-h">{s.title}</h2>
                  <p className="sc-step-body">{s.body}</p>
                  <p className="sc-step-where">
                    In the example: <b className="sc-where">{ordinal(rank)}</b>
                    {s.where ? `, ${s.where}` : ''}.
                  </p>
                  <WhoDoesIt step={s.key} />
                </div>
                {!armed ? (
                  <div className="sc-still">
                    <Results ex={ex} step={i + 1} still skeleton={PRERENDER} compact={compact} windowH={compact ? 380 : 400} query={false} foot={false} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
