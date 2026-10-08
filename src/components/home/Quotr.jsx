/*
 * Quotr — the studio's own project estimator, on the bench.
 *
 * Every figure here is read from src/data/pricing.js, the published price
 * authority; nothing is typed into this file. The visitor picks a lane (the
 * arm), slides along the price rail to a package, ticks extras from the
 * tray, and watches the till roll. The estimate is a starting price and
 * says so; the fixed quote comes after a call, which is what the red button
 * starts.
 *
 * Built after the hosted quotr.us embed was retired from the home page on
 * 14 September 2026 (it loaded slowly and the software line is gone). This
 * one is static markup with a little state: it prerenders fully in its
 * default lane, needs no network, and the motion is the till's digits
 * rolling and the extras drawer sliding out (transform and grid rows only;
 * instant under reduced motion).
 */
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import {
  webDesignPackages, webDesignAddOns, brandingPackages, c4LensPackages, seoPackages,
  socialMediaPackages, supportPlans, subscriptionInfo,
  GST_NOTE, ASTERISK_CLAUSE,
} from '@/data/pricing';
import { createPageUrl } from '@/utils';
import './quotr.css';

const isMonthly = (pkg) => /\/mo/.test(pkg.priceLabel || '');
const money = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;
/* A package whose price isn't set yet (price: null, priceLabel 'TBC') has no
   place on a price rail or in a till. It joins its lane once it's priced. */
const priced = (list) => list.filter((p) => typeof p.price === 'number');

/* The lanes are the arms, in the order the site sells them. `service` is the
   key /start already understands. The Automation lane went to C4Site with
   C4i on 9 Oct 2026, and its packages left pricing.js with it. */
const LANES = [
  { key: 'web', label: 'Website', packages: priced(webDesignPackages), addOns: webDesignAddOns, service: 'web_design', payMonthly: true },
  { key: 'lens', label: 'Photography', packages: priced(c4LensPackages), service: 'lens' },
  { key: 'brand', label: 'Brand', packages: priced(brandingPackages), service: 'brand_platform' },
  { key: 'seo', label: 'SEO', packages: priced(seoPackages), service: 'seo' },
  { key: 'social', label: 'Social', packages: priced(socialMediaPackages), service: 'social' },
  { key: 'care', label: 'Care plan', packages: priced(supportPlans), service: 'support' },
];

/* The extras tray. The website lane has forty extras, and as one list they
   filled the page (Caleb, 2 Oct 2026). Six broadly useful ones stay out on
   the tray; the rest fold into a drawer, sorted by kind. The sorting is
   presentation only: names match pricing.js exactly, and anything added
   there that no group names still shows, under "Everything else". */
const EXTRAS_OUT = [
  'Additional page', 'Copywriting package', 'Online booking / appointments',
  'SEO foundations', 'Google Business Profile setup', 'AI chatbot',
];
const EXTRA_GROUPS = [
  ['Pages and words', ['Additional page', '3-page pack', '5-page pack', 'Copywriting package', 'Branding add-on', 'Photography + videography add-on', 'Blog/CMS']],
  ['Bookings and tools', ['Online booking / appointments', 'AI chatbot', 'Client portal / login area', 'Advanced form', 'Newsletter integration', 'Live chat', 'Custom API integration', 'Admin dashboard']],
  ['Selling online', ['Product catalogue setup', 'Extra product batch (up to 25)', 'Shipping/tax rules', 'Payment gateway setup', 'Inventory or POS sync']],
  ['Page sections', ['Image gallery', 'Testimonials section', 'FAQ section', 'Google Maps', 'Social feed', 'Video background', 'Custom 404']],
  ['Motion', ['Basic animation pass', 'GSAP page transitions', 'Parallax effect', 'Logo animation']],
  ['Search and setup', ['SEO foundations', 'Google Business Profile setup', 'Accessibility (WCAG)', 'Multi-language', 'Speed optimisation', 'Cookie consent', 'SSL setup', 'Domain + DNS', 'Business email setup']],
];

function trayFor(addOns) {
  const byName = new Map(addOns.map((a) => [a.name, a]));
  const out = EXTRAS_OUT.map((n) => byName.get(n)).filter(Boolean);
  const placed = new Set(out.map((a) => a.name));
  const groups = [];
  for (const [label, names] of EXTRA_GROUPS) {
    const items = names.map((n) => byName.get(n)).filter((a) => a && !placed.has(a.name));
    items.forEach((a) => placed.add(a.name));
    if (items.length) groups.push({ label, items });
  }
  const rest = addOns.filter((a) => !placed.has(a.name));
  if (rest.length) groups.push({ label: 'Everything else', items: rest });
  return { out, groups, folded: groups.reduce((t, g) => t + g.items.length, 0) };
}

/* The prerenderer gets the drawer open, so the static HTML carries every
   price; a visitor's browser starts with it shut. The app renders with
   createRoot, so the two never have to match. */
const PRERENDER = typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent);

/* Where a package sits on the rail: log scale, so $200 and $5,000 both get room. */
function railPositions(packages) {
  const prices = packages.map((p) => p.price);
  const lo = Math.log(Math.min(...prices)), hi = Math.log(Math.max(...prices));
  const span = Math.max(hi - lo, 0.0001);
  return packages.map((p) => 6 + ((Math.log(p.price) - lo) / span) * 88);
}

/* The till: each digit is a strip of 0–9 that rolls to the value. */
function Till({ value, suffix }) {
  const str = money(value);
  return (
    <span className="qt-till" aria-hidden="true">
      {str.split('').map((ch, i) => (
        /\d/.test(ch) ? (
          <span className="qt-digit" key={`${i}-${str.length}`}>
            <span className="qt-strip" style={{ transform: `translateY(${-Number(ch) * 10}%)` }}>
              {'0123456789'.split('').map((d) => <span key={d}>{d}</span>)}
            </span>
          </span>
        ) : (
          <span className="qt-glyph" key={`${i}-${ch}`}>{ch}</span>
        )
      ))}
      {suffix ? <span className="qt-suffix">{suffix}</span> : null}
    </span>
  );
}

export default function Quotr({ compact = false, heading = 'Price it yourself.' }) {
  const uid = useId();
  const [laneKey, setLaneKey] = useState('web');
  const lane = LANES.find((l) => l.key === laneKey) || LANES[0];
  const defaultPkg = (l) => (l.packages.find((p) => p.popular) || l.packages[0]).key;
  const [pkgKey, setPkgKey] = useState(() => defaultPkg(lane));
  const [extras, setExtras] = useState(() => new Set());
  const [monthlyPlan, setMonthlyPlan] = useState(false);
  const [copied, setCopied] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(PRERENDER);
  const liveRef = useRef(null);
  const moreRef = useRef(null);

  const pkg = lane.packages.find((p) => p.key === pkgKey) || lane.packages[0];
  const positions = useMemo(() => railPositions(lane.packages), [lane]);
  const tray = useMemo(() => (lane.addOns ? trayFor(lane.addOns) : null), [lane]);
  const foldedTicked = tray ? tray.groups.reduce((t, g) => t + g.items.filter((a) => extras.has(a.name)).length, 0) : 0;

  /* Shutting the drawer from its foot: focus goes back to the toggle above,
     and the page brings it into view if the long list had scrolled it off. */
  const foldAway = () => {
    setDrawerOpen(false);
    const btn = moreRef.current;
    if (!btn) return;
    btn.focus({ preventScroll: true });
    const r = btn.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight) {
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      btn.scrollIntoView({ block: 'center', behavior: still ? 'auto' : 'smooth' });
    }
  };

  const chooseLane = (key) => {
    const next = LANES.find((l) => l.key === key);
    setLaneKey(key);
    setPkgKey(defaultPkg(next));
    setExtras(new Set());
    setMonthlyPlan(false);
  };
  const toggleExtra = (name) => setExtras((s) => { const n = new Set(s); if (n.has(name)) n.delete(name); else n.add(name); return n; });

  /* Sums, split the way an invoice would split them. */
  const extraItems = (lane.addOns || []).filter((a) => extras.has(a.name));
  const pkgMonthly = isMonthly(pkg);
  const oneOff = (pkgMonthly ? 0 : (monthlyPlan ? 0 : pkg.price)) + extraItems.reduce((t, a) => t + a.price, 0);
  const monthly = (pkgMonthly ? pkg.price : 0) + (monthlyPlan && lane.payMonthly && pkg.monthlyPrice ? pkg.monthlyPrice : 0);
  const months = monthlyPlan && subscriptionInfo.monthsToOwnership[pkg.key];
  /* Open-ended: a "+" package, a $0 one, or any ticked extra priced "from". */
  const open = /\+$/.test(pkg.priceLabel || '') || pkg.price === 0 || extraItems.some((a) => a.suffix);

  const summary = [
    `${lane.label} · ${pkg.name} · ${pkg.priceLabel}${monthlyPlan && pkg.monthlyLabel ? ` (paying ${pkg.monthlyLabel})` : ''}`,
    ...extraItems.map((a) => `+ ${a.name} · ${money(a.price)}${a.suffix || ''}`),
    `Estimate: ${oneOff ? money(oneOff) : ''}${oneOff && monthly ? ' + ' : ''}${monthly ? `${money(monthly)}/mo` : ''}${open ? ' (starting price)' : ''} · no GST added`,
  ].join('\n');

  useEffect(() => {
    if (liveRef.current) liveRef.current.textContent = `Estimate ${oneOff ? money(oneOff) : ''}${oneOff && monthly ? ' plus ' : ''}${monthly ? `${money(monthly)} a month` : ''}`;
  }, [oneOff, monthly]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard unavailable: the summary is on screen */ }
  };
  const startUrl = `${createPageUrl('StartProject')}?service=${lane.service}&package=${pkg.key}`;

  const extraRow = (a) => (
    <li key={a.name}>
      <label className={`qt-extra${extras.has(a.name) ? ' is-on' : ''}`}>
        <input type="checkbox" checked={extras.has(a.name)} onChange={() => toggleExtra(a.name)} />
        <span className="qt-extra-box" aria-hidden="true" />
        <span className="qt-extra-name">{a.name}</span>
        <span className="qt-extra-price">{money(a.price)}{a.suffix || ''}</span>
      </label>
    </li>
  );

  return (
    <section className={`qt${compact ? ' qt--compact' : ''}`} aria-labelledby={`${uid}-h`}>
      <div className="qt-frame">
        <header className="qt-head">
          <div>
            <p className="qt-name"><span className="qt-name-mark" aria-hidden="true" />Quotr</p>
            <h2 className="qt-h2" id={`${uid}-h`}>{heading}</h2>
            <p className="qt-sub">Every number is the published starting price. Move along the rail, tick what you need, and the till adds it up. A fixed quote comes after a call.</p>
          </div>
          <div className="qt-till-wrap" aria-hidden="true">
            <span className="qt-till-label">{monthly && !oneOff ? 'per month' : 'estimate'}</span>
            <Till value={oneOff || monthly} suffix={monthly && !oneOff ? '/mo' : (open ? '+' : '')} />
            {oneOff && monthly ? <span className="qt-till-second">+ {money(monthly)}/mo</span> : null}
            <span className="qt-till-note">starting price · no GST added</span>
          </div>
          <p className="sr-only" aria-live="polite" ref={liveRef} />
        </header>

        {/* The lanes */}
        <div className="qt-lanes" role="tablist" aria-label="What are you pricing?">
          {LANES.map((l) => (
            <button key={l.key} type="button" role="tab" aria-selected={l.key === lane.key} className={`qt-lane${l.key === lane.key ? ' is-on' : ''}`} onClick={() => chooseLane(l.key)}>
              {l.label}
            </button>
          ))}
        </div>

        {/* The rail */}
        <div className="qt-rail-wrap">
          <div className="qt-rail" role="radiogroup" aria-label={`${lane.label} packages by starting price`}>
            <span className="qt-rail-line" aria-hidden="true" />
            {lane.packages.map((p, i) => {
              const on = p.key === pkg.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  className={`qt-stop${on ? ' is-on' : ''}${i % 2 ? ' qt-stop--below' : ''}`}
                  style={{ '--x': `${positions[i]}%` }}
                  onClick={() => { setPkgKey(p.key); setMonthlyPlan(false); }}
                >
                  <span className="qt-stop-tick" aria-hidden="true" />
                  <span className="qt-stop-label">
                    <b>{p.name}</b>
                    <i>{p.priceLabel}</i>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="qt-body">
          {/* The chosen package, in full */}
          <div className="qt-pick">
            <div className="qt-pick-head">
              <h3 className="qt-pick-name">{pkg.name}</h3>
              <span className="qt-pick-price">{pkg.priceLabel}{pkg.popular ? <em>most chosen</em> : null}</span>
            </div>
            {pkg.description ? <p className="qt-pick-desc">{pkg.description}</p> : null}
            <ul className="qt-pick-list">
              {(pkg.features || []).map((f) => <li key={f}>{f}</li>)}
            </ul>
            {lane.payMonthly && pkg.monthlyPrice ? (
              <label className="qt-monthly">
                <input type="checkbox" checked={monthlyPlan} onChange={(e) => setMonthlyPlan(e.target.checked)} />
                <span className="qt-monthly-box" aria-hidden="true" />
                <span>
                  Pay {pkg.monthlyLabel} instead{months ? `, and own it after about ${months} months` : ''}.
                  <small> {subscriptionInfo.whatsIncluded}</small>
                </span>
              </label>
            ) : null}
          </div>

          {/* The tray of extras: six out, the rest in the drawer */}
          {tray ? (
            <div className="qt-tray">
              <p className="qt-tray-label">Extras</p>
              <ul className="qt-tray-list">{tray.out.map(extraRow)}</ul>
              {tray.folded ? (
                <>
                  <button
                    ref={moreRef}
                    type="button"
                    className={`qt-more${drawerOpen ? ' is-open' : ''}`}
                    aria-expanded={drawerOpen}
                    aria-controls={`${uid}-drawer`}
                    onClick={() => setDrawerOpen((o) => !o)}
                  >
                    <span className="qt-more-label">{drawerOpen ? 'Fewer extras' : `${tray.folded} more extras`}</span>
                    {!drawerOpen && foldedTicked ? <span className="qt-more-count">{foldedTicked} ticked</span> : null}
                    <span className="qt-more-chev" aria-hidden="true" />
                  </button>
                  <div id={`${uid}-drawer`} className={`qt-drawer${drawerOpen ? ' is-open' : ''}`} inert={drawerOpen ? undefined : ''}>
                    <div className="qt-drawer-inner">
                      {tray.groups.map((g, gi) => (
                        <div className="qt-group" key={g.label} style={{ '--i': gi }}>
                          <p className="qt-group-label" id={`${uid}-g${gi}`}>{g.label}</p>
                          <ul className="qt-tray-list" aria-labelledby={`${uid}-g${gi}`}>{g.items.map(extraRow)}</ul>
                        </div>
                      ))}
                      <button type="button" className="qt-more qt-more--foot is-open" onClick={foldAway}>
                        <span className="qt-more-label">Fewer extras</span>
                        <span className="qt-more-chev" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <div className="qt-tray qt-tray--note">
              <p className="qt-tray-label">Scope</p>
              <p className="qt-tray-copy">{lane.key === 'training' ? 'Group size, location and format set the fixed figure.' : 'Anything beyond the package is scoped and priced on the call.'}</p>
            </div>
          )}
        </div>

        <footer className="qt-foot">
          <pre className="qt-summary" aria-label="Your estimate">{summary}</pre>
          <div className="qt-actions">
            <Link to={startUrl} className="qt-start">Start with this scope</Link>
            <button type="button" className="qt-copy" onClick={copy}>{copied ? 'Copied' : 'Copy the scope'}</button>
          </div>
          <p className="qt-fine">{GST_NOTE} {lane.key === 'web' ? ASTERISK_CLAUSE : ''}</p>
        </footer>
      </div>
    </section>
  );
}
