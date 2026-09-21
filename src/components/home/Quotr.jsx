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
 * default lane, needs no network, and the only motion is the till's digits
 * rolling (transform only; instant under reduced motion).
 */
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import {
  webDesignPackages, webDesignAddOns, brandingPackages, c4LensPackages, seoPackages,
  automationPackages, socialMediaPackages, supportPlans, subscriptionInfo,
  GST_NOTE, ASTERISK_CLAUSE,
} from '@/data/pricing';
import { createPageUrl } from '@/utils';
import './quotr.css';

const isMonthly = (pkg) => /\/mo/.test(pkg.priceLabel || '');
const money = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;

/* The lanes are the arms, in the order the site sells them. `service` is the
   key /start already understands. */
const LANES = [
  { key: 'web', label: 'Website', packages: webDesignPackages, addOns: webDesignAddOns, service: 'web_design', payMonthly: true },
  { key: 'automation', label: 'Automation', packages: automationPackages, service: 'automation' },
  { key: 'lens', label: 'Photography', packages: c4LensPackages, service: 'lens' },
  { key: 'brand', label: 'Brand', packages: brandingPackages, service: 'brand_platform' },
  { key: 'seo', label: 'SEO', packages: seoPackages, service: 'seo' },
  { key: 'social', label: 'Social', packages: socialMediaPackages, service: 'social' },
  { key: 'care', label: 'Care plan', packages: supportPlans, service: 'support' },
];

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
  const liveRef = useRef(null);

  const pkg = lane.packages.find((p) => p.key === pkgKey) || lane.packages[0];
  const positions = useMemo(() => railPositions(lane.packages), [lane]);

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
  const open = /\+$/.test(pkg.priceLabel || '') || pkg.price === 0;

  const summary = [
    `${lane.label} · ${pkg.name} · ${pkg.priceLabel}${monthlyPlan && pkg.monthlyLabel ? ` (paying ${pkg.monthlyLabel})` : ''}`,
    ...extraItems.map((a) => `+ ${a.name} · ${money(a.price)}`),
    `Estimate: ${oneOff ? money(oneOff) : ''}${oneOff && monthly ? ' + ' : ''}${monthly ? `${money(monthly)}/mo` : ''}${open ? ' (starting price)' : ''} · ex GST`,
  ].join('\n');

  useEffect(() => {
    if (liveRef.current) liveRef.current.textContent = `Estimate ${oneOff ? money(oneOff) : ''}${oneOff && monthly ? ' plus ' : ''}${monthly ? `${money(monthly)} a month` : ''}`;
  }, [oneOff, monthly]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard unavailable: the summary is on screen */ }
  };
  const startUrl = `${createPageUrl('StartProject')}?service=${lane.service}&package=${pkg.key}`;

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
            <span className="qt-till-note">ex GST · starting price</span>
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

          {/* The tray of extras */}
          {lane.addOns ? (
            <div className="qt-tray">
              <p className="qt-tray-label">Extras</p>
              <ul className="qt-tray-list">
                {lane.addOns.map((a) => (
                  <li key={a.name}>
                    <label className={`qt-extra${extras.has(a.name) ? ' is-on' : ''}`}>
                      <input type="checkbox" checked={extras.has(a.name)} onChange={() => toggleExtra(a.name)} />
                      <span className="qt-extra-box" aria-hidden="true" />
                      <span className="qt-extra-name">{a.name}</span>
                      <span className="qt-extra-price">{money(a.price)}</span>
                    </label>
                  </li>
                ))}
              </ul>
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
