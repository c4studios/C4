/*
 * The three openings of /seo-and-copywriting, built side by side so Caleb
 * can choose (2 Oct 2026: "try all of these"). ?layout=room | answer | edit
 * picks one; the prerender gets the default. Whichever he keeps stays and
 * the other two come out.
 *
 *   room    The reading room: the shelf of long-form pieces written for this
 *           site. Pull one out and read what it's about. The proof leads.
 *   answer  Question and answer: a real question a Perth owner types, and
 *           C4's own answer to it, word for word from the article it lives
 *           in, with notes on how it's built.
 *   edit    The edit: an invented draft (labelled as one) marked up in pencil
 *           into a line that does its job.
 *
 * Every opening carries the same h1 and lede, so the page's subject never
 * moves with the layout.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import useStaticMode from '@/hooks/useStaticMode';
import { SEO_PAGES } from '@/content/seo/registry';
import costGuide from '@/content/seo/pages/how-much-does-a-website-cost-perth';
import timeGuide from '@/content/seo/pages/how-long-does-a-website-take';
import seoQuestion from '@/content/seo/pages/do-small-businesses-need-seo';

export function Heading() {
  return (
    <>
      <h1 className="sc-h1">SEO and copywriting in Perth</h1>
      <p className="sc-lede">
        Search gets a page found. The writing decides whether anyone acts on it. We do both, at prices
        published below, from $400.
      </p>
    </>
  );
}

/* ── room ─────────────────────────────────────────────────────────────── */

const KIND = { pillar: 'Guide', comparison: 'Question', article: 'Article' };
const SHELF = SEO_PAGES.filter((p) => p.status === 'live' && KIND[p.type]);

export function Shelf() {
  const [pulled, setPulled] = useState(SHELF.findIndex((p) => p.slug === 'how-much-does-a-website-cost-perth'));
  const at = SHELF[pulled] || SHELF[0];
  return (
    <section className="sc-open sc-room" aria-labelledby="sc-h1-room">
      <div className="sc-frame">
        <div className="sc-room-head" id="sc-h1-room">
          <Heading />
        </div>
        <p className="sc-room-say">
          Everything on this shelf was written for this site: {SHELF.length} guides, questions and articles,
          each one answering something a Perth business owner actually asks. Pull one out.
        </p>
        <div className="sc-room-desk">
          <div className="sc-shelf" role="list" aria-label="Guides and articles written for this site">
            {SHELF.map((p, i) => (
              <Link
                key={p.slug}
                role="listitem"
                to={`/${p.slug}`}
                className={`sc-spine sc-spine--${p.type}${i === pulled ? ' is-out' : ''}`}
                onPointerEnter={() => setPulled(i)}
                onFocus={() => setPulled(i)}
              >
                <span className="sc-spine-kind" aria-hidden="true">{KIND[p.type]}</span>
                <span className="sc-spine-title">{p.name}</span>
              </Link>
            ))}
          </div>
          <article className="sc-card" aria-live="polite">
            <p className="sc-card-kind">{KIND[at.type]}</p>
            <h2 className="sc-card-title">{at.name}</h2>
            <p className="sc-card-body">{at.description}</p>
            <Link to={`/${at.slug}`} className="sc-card-go">Read it<span aria-hidden="true"> →</span></Link>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ── answer ───────────────────────────────────────────────────────────── */

const answerOf = (page) => (page.sections.find((s) => s.kind === 'answer') || { body: [''] }).body[0];
const QUESTIONS = [
  {
    q: 'how much does a website cost in perth',
    a: answerOf(costGuide),
    slug: 'how-much-does-a-website-cost-perth',
    notes: ['The number is in the first line.', 'Every price is from our own published list.', 'It says when the cheaper option is fine.'],
  },
  {
    q: 'how long does a website take to build',
    a: answerOf(timeGuide),
    slug: 'how-long-does-a-website-take',
    notes: ['The answer is the first sentence.', 'Then where the time actually goes.', 'Then how to land at the fast end.'],
  },
  {
    q: 'do small businesses need seo',
    a: answerOf(seoQuestion),
    slug: 'do-small-businesses-need-seo',
    notes: ['A test you can run, in place of a pitch.', 'It tells some readers not to buy.', 'It ends on when to come back.'],
  },
];

export function AnswerDesk() {
  const staticMode = useStaticMode();
  const [pick, setPick] = useState(0);
  const [typed, setTyped] = useState(staticMode ? QUESTIONS[0].q.length : 0);
  const item = QUESTIONS[pick];
  const done = typed >= item.q.length;

  useEffect(() => {
    if (staticMode) { setTyped(item.q.length); return undefined; }
    setTyped(0);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= item.q.length) clearInterval(id);
    }, 34);
    return () => clearInterval(id);
  }, [pick, staticMode, item.q.length]);

  return (
    <section className="sc-open sc-answer" aria-labelledby="sc-h1-answer">
      <div className="sc-frame">
        <div className="sc-answer-head" id="sc-h1-answer">
          <Heading />
        </div>
        <div className="sc-desk">
          <div className="sc-ask">
            <p className="sc-ask-label" id="sc-ask-label">What a Perth owner types</p>
            <div className="sc-field" aria-labelledby="sc-ask-label">
              <span className="sc-field-text">{item.q.slice(0, typed)}</span>
              <span className={`sc-field-caret${done ? ' is-idle' : ''}`} aria-hidden="true" />
            </div>
            <div className="sc-chips" role="group" aria-label="Try another question">
              {QUESTIONS.map((x, i) => (
                <button key={x.q} type="button" className={`sc-chip${i === pick ? ' is-on' : ''}`} aria-pressed={i === pick} onClick={() => setPick(i)}>
                  {x.q}
                </button>
              ))}
            </div>
          </div>
          <figure className={`sc-reply${done ? ' is-in' : ''}`}>
            <blockquote className="sc-reply-text">
              <p>{item.a}</p>
            </blockquote>
            <figcaption className="sc-reply-src">
              Our answer, word for word, from{' '}
              <Link to={`/${item.slug}`}>the page it lives on</Link>
            </figcaption>
            <ol className="sc-notes" aria-label="How the answer is built">
              {item.notes.map((n) => <li key={n}>{n}</li>)}
            </ol>
          </figure>
        </div>
        <p className="sc-answer-say">
          That&rsquo;s the whole method. Write the page people are actually searching for, and put the answer
          where a reader, or an AI tool summarising the page, can lift it whole.
        </p>
      </div>
    </section>
  );
}

/* ── edit ─────────────────────────────────────────────────────────────── */

/* An invented business, said so on the page. The draft is the line most
   small-business sites open with; each struck piece carries the note that
   explains the cut, and the insert that replaces it where there is one. */
const DRAFT = [
  { text: 'We are a leading tiling company', cut: true, insert: 'Bathroom and kitchen tiling in Midland.', note: 'Name the job the way people search for it, and put the suburb in.' },
  { text: ' ' },
  { text: 'offering quality services and solutions', cut: true, note: '“Quality” and “solutions” are on every competitor’s site. They say nothing.' },
  { text: ' ' },
  { text: 'to meet all your tiling needs.', cut: true, insert: 'Send a photo and we’ll quote it.', note: 'End on the next step.' },
];
const AFTER = 'Bathroom and kitchen tiling in Midland. Send a photo and we’ll quote it.';

export function TheEdit() {
  const staticMode = useStaticMode();
  const wrap = useRef(null);
  const spans = useRef([]);
  const [rects, setRects] = useState([]);
  const [run, setRun] = useState(staticMode ? 99 : 0);
  const cuts = useMemo(() => DRAFT.map((d, i) => ({ ...d, i })).filter((d) => d.cut), []);

  /* Where each struck piece sits, line by line, so the pencil follows the wrap. */
  useLayoutEffect(() => {
    const box = wrap.current;
    if (!box) return undefined;
    const measure = () => {
      const b = box.getBoundingClientRect();
      setRects(cuts.map((c) => {
        const el = spans.current[c.i];
        if (!el) return [];
        return [...el.getClientRects()].map((r) => ({ x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height }));
      }));
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(box);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure, () => {});
    return () => ro && ro.disconnect();
  }, [cuts, run]);

  /* The edit plays once when it comes into view; it can be run again. */
  useEffect(() => {
    if (staticMode || run !== 0) return undefined;
    const box = wrap.current;
    if (!box) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRun(1); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(box);
    return () => io.disconnect();
  }, [staticMode, run]);

  const marked = run > 0;
  return (
    <section className="sc-open sc-edit" aria-labelledby="sc-h1-edit">
      <div className="sc-frame">
        <div className="sc-edit-head" id="sc-h1-edit">
          <Heading />
        </div>
        <div className="sc-sheet">
          <p className="sc-sheet-label">Example: an invented tiling business, to show the method</p>
          <div className={`sc-draft${marked ? ' is-marked' : ''}`} ref={wrap} key={run}>
            <p className="sc-draft-text">
              {DRAFT.map((d, i) => (
                <span key={i} ref={(el) => { spans.current[i] = el; }} className={d.cut ? 'sc-cut' : undefined}>{d.text}</span>
              ))}
            </p>
            <svg className="sc-pencil" aria-hidden="true" focusable="false">
              {rects.map((lines, k) => lines.map((r, j) => (
                <line
                  key={`${k}-${j}`}
                  x1={r.x - 2}
                  y1={r.y + r.h * 0.56}
                  x2={r.x + r.w + 2}
                  y2={r.y + r.h * 0.5}
                  pathLength="1"
                  style={{ '--d': `${0.25 + k * 0.85 + j * 0.18}s` }}
                />
              )))}
            </svg>
            {rects.map((lines, k) => {
              if (!cuts[k].insert || !lines.length) return null;
              /* Anchor over the struck piece's leftmost line, so an insert
                 never squeezes into the last word of a line. */
              const at = lines.reduce((best, r) => (r.x < best.x ? r : best), lines[0]);
              return (
                <span
                  key={`ins-${k}`}
                  className="sc-insert"
                  style={{ left: `${at.x}px`, top: `${at.y}px`, '--d': `${0.55 + k * 0.85}s` }}
                >
                  <span className="sc-caret" aria-hidden="true" />{cuts[k].insert}
                </span>
              );
            })}
          </div>
          <ol className="sc-edit-notes">
            {cuts.map((c, k) => (
              <li key={c.i} style={{ '--d': `${0.6 + k * 0.85}s` }} className={marked ? 'is-in' : undefined}>{c.note}</li>
            ))}
          </ol>
          <div className={`sc-after${marked ? ' is-in' : ''}`}>
            <p className="sc-after-label">After</p>
            <p className="sc-after-text">{AFTER}</p>
          </div>
          {!staticMode && run > 0 ? (
            <button type="button" className="sc-again" onClick={() => setRun((n) => n + 1)}>Run the edit again</button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
