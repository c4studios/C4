/*
 * Month by month: six months of one monthly plan, laid out as a ruled board
 * with a lane for each line on the plan's list. Articles land as sheets,
 * the report as one sheet a month, the quarterly work as a bracket over
 * each quarter, and everything ongoing as a rule that runs the whole way.
 *
 * It's read from pricing.js and nothing else. A plan that says "Everything
 * in Growth" takes Growth's monthly lines too (marked as Growth's), and its
 * own article count stands in place of Growth's. A plan that takes in a
 * one-off package lists that package's work above the board, since it's
 * done once rather than monthly, and the board doesn't guess when. Lines
 * with no stated frequency are drawn as ongoing, with their own words.
 * The minimum term is bracketed from the plan's own term.
 *
 * The board is a picture of the list beside it: the lanes' labels are real
 * text and each says how often in words; the sheets and rules are hidden
 * from screen readers. The sheets only drop in after the visitor switches
 * plan, and never under reduced motion.
 */
import { useState } from 'react';
import { includes, isMonthly, MONTHLY, minMonths, word, list } from './plans';

const MONTHS = 6;
/* B612 gives the comma a full cell; tuck it in, as the price ledger does */
const tight = (figure) => figure.split(',').map((part, i) => (
  i === 0 ? part : <span key={part}><span className="sc-comma">,</span>{part}</span>
));
const POSTS = /^(\d+)\b[^/]*\b(?:posts?|articles?)\b.*month/i;

function classify(p, from = null) {
  return (p.features || []).flatMap((f) => {
    if (/^everything in /i.test(f)) return [];
    const posts = POSTS.exec(f);
    if (posts) return [{ kind: 'articles', n: Number(posts[1]), label: f, from }];
    if (/performance report/i.test(f)) return [{ kind: 'report', label: f, from }];
    if (/quarterly/i.test(f)) return [{ kind: 'quarterly', label: f, from }];
    if (/monthly|\/month/i.test(f)) return [{ kind: 'monthly', label: f, from }];
    return [{ kind: 'ongoing', label: f, from }];
  });
}

function boardFor(p) {
  const own = classify(p);
  let inherited = [];
  let base = null;
  let parent = includes(p);
  while (parent) {
    if (isMonthly(parent)) inherited = inherited.concat(classify(parent, parent.name));
    else { base = parent; break; }
    parent = includes(parent);
  }
  const single = ['articles', 'report'];
  const ownKinds = new Set(own.map((l) => l.kind));
  const lanes = [...own, ...inherited.filter((l) => !single.includes(l.kind) || !ownKinds.has(l.kind))];
  const order = { articles: 0, report: 1, monthly: 2, quarterly: 3, ongoing: 4 };
  lanes.sort((a, b) => order[a.kind] - order[b.kind] || (a.from ? 1 : 0) - (b.from ? 1 : 0));
  return { lanes, base };
}

const how = (l) => {
  if (l.kind === 'articles') return `${word(l.n)} a month`;
  if (l.kind === 'report') return 'one a month';
  if (l.kind === 'monthly') return 'every month';
  if (l.kind === 'quarterly') return 'once a quarter';
  return 'ongoing';
};

function Cells({ lane }) {
  if (lane.kind === 'ongoing') {
    return <span className="sc-lane-rule" aria-hidden="true" />;
  }
  if (lane.kind === 'quarterly') {
    return (
      <span className="sc-lane-quarters" aria-hidden="true">
        {Array.from({ length: MONTHS / 3 }, (_, q) => <span key={q} className="sc-lane-quarter" />)}
      </span>
    );
  }
  return Array.from({ length: MONTHS }, (_, m) => (
    <span key={m} className="sc-lane-cell" aria-hidden="true" style={{ '--m': m }}>
      {lane.kind === 'monthly' ? <span className="sc-lane-tick" /> : Array.from({ length: lane.kind === 'articles' ? lane.n : 1 }, (_, i) => (
        <span key={i} className={`sc-sheet${lane.kind === 'report' ? ' sc-sheet--report' : ''}`} style={{ '--i': i }} />
      ))}
      {lane.kind === 'articles' ? <span className="sc-lane-count">{lane.n * (m + 1)}</span> : null}
    </span>
  ));
}

export default function Months() {
  const start = (MONTHLY.find((p) => p.popular) || MONTHLY[0] || {}).key;
  const [key, setKey] = useState(start);
  const [switched, setSwitched] = useState(false);
  if (!MONTHLY.length) return null;
  const plan = MONTHLY.find((p) => p.key === key) || MONTHLY[0];
  const { lanes, base } = boardFor(plan);
  const term = minMonths(plan);
  const articles = lanes.find((l) => l.kind === 'articles');
  const reports = lanes.some((l) => l.kind === 'report');
  const tally = [
    articles ? `${articles.n * MONTHS} articles` : null,
    reports ? `${MONTHS} reports` : null,
  ].filter(Boolean);

  return (
    <section className="sc-sec sc-months" aria-labelledby="sc-months-h">
      <div className="sc-frame">
        <div className="sc-months-head">
          <h2 className="sc-h2" id="sc-months-h">What lands each month</h2>
          <p className="sc-say">
            Pick a plan to see six months of it. Every lane is a line from the plan&rsquo;s own list, drawn as often as
            the plan says it happens.
          </p>
        </div>

        <div className="sc-chips sc-months-chips" role="group" aria-label="Show a plan">
          {MONTHLY.map((p) => (
            <button
              key={p.key}
              type="button"
              className="sc-chip"
              aria-pressed={p.key === plan.key}
              onClick={() => { setKey(p.key); setSwitched(true); }}
            >
              {p.name} <span className="sc-chip-fig" data-fig="">{tight(p.priceLabel)}</span>
            </button>
          ))}
        </div>

        <div className={`sc-board${switched ? ' is-switched' : ''}`} key={plan.key} data-nosnippet="">
          <p className="sc-board-sum" aria-live="polite">
            <b>{plan.name}</b>
            {term ? `, ${plan.priceSuffix}` : ''}.
            {tally.length ? ` Over ${word(MONTHS)} months: ${list(tally)}.` : ''}
          </p>
          {base ? (
            <p className="sc-board-base">
              <span className="sc-board-base-h">Also includes everything in {base.name}, done once:</span>
              {(base.features || []).map((f) => <span key={f} className="sc-board-base-item">{f}</span>)}
            </p>
          ) : null}

          <div className="sc-board-grid" style={{ '--months': MONTHS, '--term': term }}>
            <div className="sc-board-months" aria-hidden="true">
              <span className="sc-board-corner">Month</span>
              {Array.from({ length: MONTHS }, (_, m) => <span key={m} className="sc-board-month">{m + 1}</span>)}
              {term ? <span className="sc-board-term"><span>Minimum term</span></span> : null}
            </div>
            <ul className="sc-lanes">
              {lanes.map((l) => (
                <li key={`${l.kind}-${l.label}`} className={`sc-lane sc-lane--${l.kind}`}>
                  <p className="sc-lane-label">
                    <span className="sc-lane-name">{l.label}</span>
                    <span className="sc-lane-how">
                      {how(l)}{l.from ? `, from ${l.from}` : ''}
                    </span>
                  </p>
                  <div className="sc-lane-cells"><Cells lane={l} /></div>
                </li>
              ))}
            </ul>
          </div>
          <p className="sc-fine sc-board-note">
            Read from the plans&rsquo; feature lists. Where a line doesn&rsquo;t say how often, it&rsquo;s drawn as
            ongoing. <a href="#prices">Every plan and price</a>
          </p>
        </div>
      </div>
    </section>
  );
}
