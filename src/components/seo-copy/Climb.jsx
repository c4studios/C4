/*
 * The opening of /seo-and-copywriting and the page's one authored moment:
 * the climb. The board (Board.jsx) holds an example search; the visitor's
 * listing starts at the top of page two, and each piece of work in the
 * column moves it up, until it's first.
 *
 * Armed (a browser with motion allowed and room to pin), the board pins
 * beside the steps from 1024px, or as a band across the top below that, and
 * the step under the reading line sets where the listing sits. Static (the
 * prerenderer, reduced motion, or a screen too short to pin), the page is
 * flat: the board sits beside the heading at its starting point, and every
 * step carries its own still of the board. The words never depend on the
 * motion; each step says where the listing sits in plain text.
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import useStaticMode from '@/hooks/useStaticMode';
import { seoPackages } from '@/data/pricing';
import { createPageUrl } from '@/utils';
import Board from './Board';
import { EXAMPLES, RANKS } from './examples';
import { GRAPHITE, Graphite, ringPath } from './pencil';

const PRERENDER = typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent);
const TALL_ENOUGH = '(min-height: 520px)';

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

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

function WhoDoesIt({ step }) {
  const said = (WHO[step] ? WHO[step]() : []).filter(Boolean);
  if (!said.length) return null;
  return <p className="sc-step-in">{said.join(' ')}</p>;
}

function useArmed(staticMode) {
  const [armed, setArmed] = useState(() => (
    !staticMode && typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      && window.matchMedia(TALL_ENOUGH).matches
  ));
  useEffect(() => {
    if (staticMode || typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia(TALL_ENOUGH);
    const on = () => setArmed(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [staticMode]);
  return armed;
}

export default function Climb() {
  const staticMode = useStaticMode();
  const armed = useArmed(staticMode);
  const [exKey, setExKey] = useState(EXAMPLES[0].key);
  const ex = EXAMPLES.find((e) => e.key === exKey) || EXAMPLES[0];
  const [step, setStep] = useState(0);
  const [stuck, setStuck] = useState(false);
  const stageRef = useRef(null);
  const colRef = useRef(null);
  const stepRefs = useRef([]);

  /* The step whose heading has crossed the reading line sets the board.
     Beside the steps the line sits a little below the middle of the
     screen; under the band it sits in the space left below the band. */
  useEffect(() => {
    if (!armed) { setStep(0); return undefined; }
    let raf = 0;
    const narrow = window.matchMedia('(max-width: 1023px)');
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      let line = vh * 0.56;
      if (narrow.matches && stageRef.current) {
        const b = stageRef.current.getBoundingClientRect().bottom;
        line = b + (vh - b) * 0.42;
      }
      let next = 0;
      stepRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < line) next = i + 1;
      });
      setStep(next);
      /* The band is pinned once it reaches its sticky top. */
      const col = colRef.current;
      if (col && narrow.matches) {
        const top = parseFloat(window.getComputedStyle(col).top) || 0;
        setStuck(col.getBoundingClientRect().top <= top + 1);
      } else {
        setStuck(false);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [armed]);

  return (
    <section className={`sc-climb ${armed ? 'is-armed' : 'is-flat'}${stuck ? ' is-stuck' : ''}`} aria-labelledby="sc-h1">
      <div className="sc-frame sc-climb-grid">
        <header className="sc-intro">
          <h1 className="sc-h1" id="sc-h1">SEO and copywriting in Perth</h1>
          <p className="sc-lede">
            When someone searches Google for what you do, the first few results get the call. We do the work
            that moves your business up that page, and we write what people read when they get there.
          </p>
          <div className="sc-actions">
            <Link to={`${createPageUrl('StartProject')}?service=seo`} className="sc-btn-start">Start a project</Link>
            <a href="#prices" className="sc-btn-ghost">See the prices</a>
          </div>
        </header>

        <div className="sc-stage-col" ref={colRef}>
          <figure className="sc-stage" ref={stageRef}>
            <Board ex={ex} step={armed ? step : 0} still={!armed} skeleton={PRERENDER} focus={armed ? 0.5 : 0.62} />
            <figcaption className="sr-only">
              {`An example page of search results for “${ex.query}”, with invented listings. Your business is ${ordinal(RANKS[armed ? step : 0])}${(armed ? step : 0) <= 1 ? ', at the top of page two' : ''}.`}
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
                className={`sc-chip${e.key === ex.key ? ' is-on' : ''}`}
                aria-pressed={e.key === ex.key}
                onClick={() => setExKey(e.key)}
              >
                {e.query}
              </button>
            ))}
          </div>
          <p className="sc-try-note">
            The board is an example. The other listings are made up, and in real life the climb takes months.
            {armed ? ' Scroll down and watch what each piece of work does to your listing.' : ' Each step below shows where your listing sits once that work is done.'}
          </p>
        </div>

        <ol className="sc-steps">
          {STEPS.map((s, i) => {
            const rank = RANKS[i + 1];
            const on = armed && step === i + 1;
            return (
              <li key={s.key} className={`sc-step${on ? ' is-on' : ''}`}>
                <div className="sc-step-text" ref={(el) => { stepRefs.current[i] = el; }}>
                  <h2 className="sc-step-h"><span>{s.title}</span></h2>
                  <p className="sc-step-body">{s.body}</p>
                  <p className="sc-step-where">
                    In the example:{' '}
                    <b>
                      {ordinal(rank)}
                      {armed ? (
                        <svg className="sc-where-ring" viewBox="0 0 60 30" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                          <g filter={`url(#${GRAPHITE})`}><Graphite d={ringPath(5, 5, 50, 20, 40 + i)} pass={[0.4, 0.3]} /></g>
                        </svg>
                      ) : null}
                    </b>
                    {s.where ? `, ${s.where}` : ''}.
                  </p>
                  <WhoDoesIt step={s.key} />
                </div>
                {!armed ? (
                  <div className="sc-step-still" aria-hidden="true">
                    <Board ex={ex} step={i + 1} still skeleton={PRERENDER} />
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
