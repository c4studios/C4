/*
 * Quotr — the studio's own project estimator, on the bench.
 *
 * Every figure here is read from src/data/pricing.js, the published price
 * authority; nothing is typed into this file. Since 15 October 2026 it asks
 * one question at a time (Caleb: the tabs, rail, panel, tray and checkbox
 * all at once were "still too convoluted"). What do you need, which size,
 * any extras, how you'd like to pay, then the estimate. The lanes with no
 * extras and no monthly option skip those two questions.
 *
 * Beside the questions sits the docket, on proof stock because every line on
 * it is a published price. It lists exactly what the total sums, so the
 * total can be checked against it line by line; tap a line to go back to
 * that question. On a narrow screen the docket waits for the last step and
 * the total rides in the bar at the foot with Back and Next.
 *
 * Motion: the incoming question slides in from the side it came from, a
 * changed docket line writes itself in, the till's digits roll. Haptics: a
 * short pulse on a choice, a step and the finish, where the browser has
 * navigator.vibrate (Android Chrome; iOS has none and nothing happens).
 * Under the prerenderer or reduced motion none of it runs and every change
 * is instant (useStaticMode, resolved on the first render). The prerendered
 * page is the first question with every service and its starting price.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import { tightFigure, money } from '@/components/c4/figure';
import useStaticMode from '@/hooks/useStaticMode';
import {
  webDesignPackages, webDesignAddOns, brandingPackages, c4LensPackages, seoPackages,
  socialMediaPackages, supportPlans, subscriptionInfo, webScopeNotes,
  GST_NOTE, ASTERISK_CLAUSE,
} from '@/data/pricing';
import { createPageUrl } from '@/utils';
import './quotr.css';

const isMonthly = (pkg) => /\/mo/.test(pkg.priceLabel || '');
/* A package whose price isn't set yet (price: null, priceLabel 'TBC') has no
   place in a till. It joins its lane once it's priced. */
const priced = (list) => list.filter((p) => typeof p.price === 'number');

/* The lanes, in the order the site sells them. `service` is the key /start
   already understands. AI and automation are C4Site's since 9 Oct 2026 and
   have no lane here. The blurbs paraphrase the packages' own descriptions
   in pricing.js; they make no claim the price list doesn't. */
const LANES = [
  { key: 'web', label: 'Website', blurb: 'A new site, from one landing page up to a custom platform.', ask: 'Which size of site fits?', packages: priced(webDesignPackages), addOns: webDesignAddOns, service: 'web_design', payMonthly: true },
  { key: 'lens', label: 'Photography', blurb: 'C4 Lens shoots, from a quick headshot to a full production.', ask: 'Which shoot fits?', packages: priced(c4LensPackages), service: 'lens' },
  { key: 'seo', label: 'SEO', blurb: 'One-off SEO work, or a monthly plan.', ask: 'Which SEO package fits?', packages: priced(seoPackages), service: 'seo' },
  { key: 'logo', label: 'Logo Design', blurb: 'A logo on its own, or the kit around it.', ask: 'Which logo package fits?', packages: priced(brandingPackages), service: 'logo_design' },
  { key: 'social', label: 'Social', blurb: 'Posts designed and managed for you each month.', ask: 'Which plan fits?', packages: priced(socialMediaPackages), service: 'social' },
  { key: 'care', label: 'Care plan', blurb: 'Looking after your site once it’s live.', ask: 'Which plan fits?', packages: priced(supportPlans), service: 'support' },
];

/* "from $500", or "from $400, or $249/mo" for a lane that sells both. */
function fromPrice(lane) {
  const once = lane.packages.filter((p) => !isMonthly(p)).map((p) => p.price);
  const mo = lane.packages.filter(isMonthly).map((p) => p.price);
  const parts = [];
  if (once.length) parts.push(money(Math.min(...once)));
  if (mo.length) parts.push(`${money(Math.min(...mo))}/mo`);
  return parts;
}

/* The handful of extras that suit each website package. Presentation only:
   names match pricing.js exactly and any that go missing there drop out.
   Nothing a package already includes is offered back to it. */
const EXTRAS_FOR = {
  starter: ['Copywriting package', 'Branding add-on', 'Additional page', 'SEO foundations', 'Google Business Profile setup'],
  brochure: ['Copywriting package', 'Branding add-on', 'Online booking / appointments', 'SEO foundations', 'Google Business Profile setup'],
  business: ['Copywriting package', 'Branding add-on', 'Online booking / appointments', 'Blog/CMS', 'SEO foundations'],
  custom: ['Copywriting package', 'Online booking / appointments', 'Photography + videography add-on', 'Basic animation pass', 'Accessibility (WCAG)'],
  'commerce-starter': ['Extra product batch (up to 25)', 'Inventory or POS sync', 'Copywriting package', 'Photography + videography add-on', 'SEO foundations'],
  'web-application': ['Custom API integration', 'Admin dashboard', 'Advanced form', 'Accessibility (WCAG)', 'Multi-language'],
  growth: ['Inventory or POS sync', 'Multi-language', 'Accessibility (WCAG)', 'Copywriting package', 'Photography + videography add-on'],
  platform: ['Multi-language', 'Accessibility (WCAG)', 'Speed optimisation', 'Copywriting package', 'Photography + videography add-on'],
};
const EXTRA_GROUPS = [
  ['Pages and words', ['Additional page', '3-page pack', '5-page pack', 'Copywriting package', 'Branding add-on', 'Photography + videography add-on', 'Blog/CMS']],
  ['Bookings and tools', ['Online booking / appointments', 'Client portal / login area', 'Advanced form', 'Newsletter integration', 'Live chat', 'Custom API integration', 'Admin dashboard']],
  ['Selling online', ['Product catalogue setup', 'Extra product batch (up to 25)', 'Shipping/tax rules', 'Payment gateway setup', 'Inventory or POS sync']],
  ['Page sections', ['Image gallery', 'Testimonials section', 'FAQ section', 'Google Maps', 'Social feed', 'Video background', 'Custom 404']],
  ['Motion', ['Basic animation pass', 'GSAP page transitions', 'Parallax effect', 'Logo animation']],
  ['Search and setup', ['SEO foundations', 'Google Business Profile setup', 'Accessibility (WCAG)', 'Multi-language', 'Speed optimisation', 'Cookie consent', 'SSL setup', 'Domain + DNS', 'Business email setup']],
];

function trayFor(addOns, pkgKey) {
  const byName = new Map(addOns.map((a) => [a.name, a]));
  const out = (EXTRAS_FOR[pkgKey] || EXTRAS_FOR.business).map((n) => byName.get(n)).filter(Boolean);
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

const PROJECT_TERMS = (webScopeNotes.find((n) => /terms/i.test(n.title)) || { points: [] }).points[0] || '';

const ASK = {
  what: 'What do you need?',
  extras: 'Anything extra?',
  pay: 'How would you like to pay?',
  total: 'Your estimate',
};

/* A short pulse where the browser can. Never under reduced motion or the
   prerenderer, and never a failure if the call is refused. */
function useBuzz(still) {
  return (pattern) => {
    if (still || typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    try { navigator.vibrate(pattern); } catch { /* not allowed here; silence is fine */ }
  };
}

/* The till: each digit is a strip of 0 to 9 that rolls to its value. Digits
   are keyed by their place from the right, so $1,500 to $12,000 rolls the
   ones, tens and hundreds and adds a new place on the left. */
function Till({ value, suffix, className = '' }) {
  const str = money(value);
  const len = str.length;
  return (
    <span className={`qt-till ${className}`} aria-hidden="true">
      {str.split('').map((ch, i) => {
        const place = len - i;
        if (/\d/.test(ch)) {
          return (
            <span className="qt-digit" key={`d${place}`}>
              <span className="qt-strip" style={{ transform: `translateY(${-Number(ch) * 10}%)` }}>
                {'0123456789'.split('').map((d) => <span key={d}>{d}</span>)}
              </span>
            </span>
          );
        }
        return <span className={ch === ',' ? 'qt-glyph c4-comma' : 'qt-glyph'} key={`g${place}`}>{ch}</span>;
      })}
      {suffix ? <span className="qt-suffix">{suffix}</span> : null}
    </span>
  );
}

/* One question's answers as a radio group. Arrow keys move through the
   answers and choose as they go (the total follows); Enter, Space or a tap
   chooses and moves on to the next question. */
function Choices({ labelledBy, items, value, onSelect, onCommit, render, className = '' }) {
  const refs = useRef([]);
  const onKeyDown = (e) => {
    const n = items.length;
    const at = refs.current.indexOf(document.activeElement);
    const cur = at >= 0 ? at : Math.max(0, items.findIndex((it) => it.key === value));
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (cur + 1) % n;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (cur - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next == null) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onSelect(items[next].key);
  };
  return (
    <div className={`qt-choices ${className}`} role="radiogroup" aria-labelledby={labelledBy} onKeyDown={onKeyDown}>
      {items.map((it, i) => {
        const on = it.key === value;
        return (
          <button
            key={it.key}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            className={`qt-opt${on ? ' is-on' : ''}`}
            onClick={() => onCommit(it.key)}
          >
            <span className="qt-opt-mark" aria-hidden="true" />
            {render(it, on)}
          </button>
        );
      })}
    </div>
  );
}

export default function Quotr({ compact = false, heading = 'Price it yourself.' }) {
  /* Named, not useId(): the prerendered HTML keeps the ids its own render
     made, which aren't the ones a hydrating page makes, and every question
     after the first mounts later and points back at them (15 Oct 2026). One
     Quotr per page: the full one on the home page, the compact one on
     /welcome. */
  const uid = compact ? 'qt-compact' : 'qt';
  const still = useStaticMode();
  const buzz = useBuzz(still);

  const defaultPkg = (l) => (l.packages.find((p) => p.popular) || l.packages[0]).key;
  const [laneKey, setLaneKey] = useState('web');
  const lane = LANES.find((l) => l.key === laneKey) || LANES[0];
  const [pkgKey, setPkgKey] = useState(() => defaultPkg(LANES[0]));
  const [extras, setExtras] = useState(() => new Set());
  const [monthlyPlan, setMonthlyPlan] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [dir, setDir] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [announce, setAnnounce] = useState('');
  const [live, setLive] = useState(false);

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const headRef = useRef(null);
  const moreRef = useRef(null);
  const advanceTimer = useRef(null);
  const moved = useRef(false);
  const touched = useRef(false);
  const firstLines = useRef(null);

  const pkg = lane.packages.find((p) => p.key === pkgKey) || lane.packages[0];
  const steps = useMemo(() => (lane.addOns ? ['what', 'size', 'extras', 'pay', 'total'] : ['what', 'size', 'total']), [lane]);
  const step = steps[Math.min(stepIdx, steps.length - 1)];
  const questions = steps.length - 1;
  const tray = useMemo(() => (lane.addOns ? trayFor(lane.addOns, pkg.key) : null), [lane, pkg.key]);
  const foldedTicked = tray ? tray.groups.reduce((t, g) => t + g.items.filter((a) => extras.has(a.name)).length, 0) : 0;

  /* Sums, split the way an invoice would split them. Extras stay one-off
     when the build is paid monthly, as they did before this redesign. */
  const extraItems = (lane.addOns || []).filter((a) => extras.has(a.name));
  const pkgMonthly = isMonthly(pkg);
  const paidMonthly = monthlyPlan && lane.payMonthly && pkg.monthlyPrice;
  const oneOff = (pkgMonthly || paidMonthly ? 0 : pkg.price) + extraItems.reduce((t, a) => t + a.price, 0);
  const monthly = (pkgMonthly ? pkg.price : 0) + (paidMonthly ? pkg.monthlyPrice : 0);
  /* Open-ended: a "+" package, a $0 one, or any ticked extra priced "from". */
  const open = /\+$/.test(pkg.priceLabel || '') || pkg.price === 0 || extraItems.some((a) => a.suffix);

  const spoken = `${oneOff ? money(oneOff) : ''}${oneOff && monthly ? ' plus ' : ''}${monthly ? `${money(monthly)} a month` : ''}`;

  const summary = [
    `${lane.label} · ${pkg.name} · ${pkg.priceLabel}${paidMonthly && pkg.monthlyLabel ? ` (paying ${pkg.monthlyLabel})` : ''}`,
    ...extraItems.map((a) => `+ ${a.name} · ${money(a.price)}${a.suffix || ''}`),
    `Estimate: ${oneOff ? money(oneOff) : ''}${oneOff && monthly ? ' + ' : ''}${monthly ? `${money(monthly)}/mo` : ''}${open ? ' (starting price)' : ''} · no GST added`,
  ].join('\n');

  const startUrl = `${createPageUrl('StartProject')}?service=${lane.service}&package=${pkg.key}${paidMonthly ? '&pricing=subscription' : ''}`;

  /* The docket: every line the total sums, and nothing else. */
  const lines = [
    { id: `what:${lane.key}`, step: 'what', label: lane.label, kind: 'service' },
    { id: `size:${pkg.key}:${paidMonthly ? 'mo' : 'once'}`, step: 'size', label: pkg.name, value: paidMonthly ? pkg.monthlyLabel : pkg.priceLabel, note: paidMonthly ? null : pkg.priceSuffix },
    ...extraItems.map((a) => ({ id: `x:${a.name}`, step: 'extras', label: a.name, value: `+${money(a.price)}${a.suffix || ''}` })),
    ...(lane.addOns && !extraItems.length ? [{ id: 'x:none', step: 'extras', label: 'No extras', dim: true }] : []),
    ...(lane.payMonthly ? [{ id: `pay:${paidMonthly ? 'mo' : 'once'}`, step: 'pay', label: 'Paying', value: paidMonthly ? 'monthly' : 'up front', word: true }] : []),
  ];
  if (firstLines.current === null) firstLines.current = new Set(lines.map((l) => l.id));

  /* Moving between questions. */
  const go = (idx, direction) => {
    clearTimeout(advanceTimer.current);
    const next = Math.max(0, Math.min(idx, steps.length - 1));
    if (next === stepIdx) return;
    moved.current = true;
    setDir(direction || (next > stepIdx ? 'fwd' : 'back'));
    setStepIdx(next);
    buzz(steps[next] === 'total' ? [12, 60, 12] : 8);
  };
  const jump = (name) => { const i = steps.indexOf(name); if (i >= 0) go(i); };
  const later = (fn) => { clearTimeout(advanceTimer.current); advanceTimer.current = setTimeout(fn, still ? 140 : 260); };
  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const pickLane = (key) => {
    touched.current = true; setLive(true);
    if (key === laneKey) return;
    const next = LANES.find((l) => l.key === key);
    setLaneKey(key);
    setPkgKey(defaultPkg(next));
    setExtras(new Set());
    setMonthlyPlan(false);
    setDrawerOpen(false);
    buzz(10);
  };
  const pickPkg = (key) => { touched.current = true; setLive(true); if (key !== pkgKey) { setPkgKey(key); buzz(10); } };
  const pickPay = (key) => { touched.current = true; setLive(true); const m = key === 'monthly'; if (m !== monthlyPlan) { setMonthlyPlan(m); buzz(10); } };
  const toggleExtra = (name) => {
    touched.current = true; setLive(true);
    buzz(10);
    setExtras((s) => { const n = new Set(s); if (n.has(name)) n.delete(name); else n.add(name); return n; });
  };
  const startOver = () => {
    touched.current = true; setLive(true);
    setLaneKey('web');
    setPkgKey(defaultPkg(LANES[0]));
    setExtras(new Set());
    setMonthlyPlan(false);
    setDrawerOpen(false);
    go(0, 'back');
  };

  /* A new question takes focus at its heading, so a screen reader hears the
     question and how far along it is; if the step above has scrolled the
     frame off the top, bring the frame back into view. Never on mount. */
  useEffect(() => {
    if (!moved.current) return;
    const h = headRef.current;
    if (h) h.focus({ preventScroll: true });
    const stage = stageRef.current;
    if (stage && stage.getBoundingClientRect().top < 64) {
      stage.scrollIntoView({ block: 'start', behavior: still ? 'auto' : 'smooth' });
    }
  }, [stepIdx, still]);

  /* The total, said once it settles, never per digit. */
  useEffect(() => {
    if (!touched.current) return undefined;
    const t = setTimeout(() => setAnnounce(`Estimate now ${spoken}${open ? ', starting price' : ''}.`), 650);
    return () => clearTimeout(t);
  }, [spoken, open]);

  /* Shutting the drawer from its foot hands focus back to the toggle. */
  const foldAway = () => {
    setDrawerOpen(false);
    const btn = moreRef.current;
    if (!btn) return;
    btn.focus({ preventScroll: true });
    const r = btn.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight) btn.scrollIntoView({ block: 'center', behavior: still ? 'auto' : 'smooth' });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setAnnounce('Scope copied.');
      buzz(10);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable: the docket is on screen */ }
  };

  /* Arrow keys through a list of checkboxes, as in the radio groups. */
  const extrasKeys = (e) => {
    if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
    const boxes = [...e.currentTarget.querySelectorAll('input[type="checkbox"]')].filter((b) => !b.closest('[inert]'));
    const at = boxes.indexOf(document.activeElement);
    if (at < 0) return;
    e.preventDefault();
    boxes[(at + (e.key === 'ArrowDown' ? 1 : -1) + boxes.length) % boxes.length].focus();
  };

  const extraRow = (a) => (
    <li key={a.name}>
      <label className={`qt-extra${extras.has(a.name) ? ' is-on' : ''}`}>
        <input type="checkbox" checked={extras.has(a.name)} onChange={() => toggleExtra(a.name)} />
        <span className="qt-extra-box" aria-hidden="true" />
        <span className="qt-extra-name">{a.name}</span>
        <span className="qt-extra-price">+{tightFigure(money(a.price))}{a.suffix || ''}</span>
      </label>
    </li>
  );

  const progressId = `${uid}-progress`;
  const qId = `${uid}-q`;
  const stepCount = step === 'total' ? `All ${questions} answered` : `Question ${stepIdx + 1} of ${questions}`;
  const animClass = !still && dir ? ` qt-step--${dir}` : '';
  const isFinal = step === 'total';

  const totalBlock = (size) => (
    <>
      <Till value={oneOff || monthly} suffix={monthly && !oneOff ? '/mo' : (open ? '+' : '')} className={size} />
      {oneOff && monthly ? <span className="qt-till-second" aria-hidden="true">+ {tightFigure(money(monthly))}/mo</span> : null}
    </>
  );

  /* The docket, on proof stock: what the total is made of. It sits beside
     the questions on a wide frame and inside the last step on a narrow one;
     CSS shows one or the other, never both. */
  const docket = (where) => (
    <aside className={`qt-docket ${where}`} aria-label="Your estimate so far">
      <ul className="qt-lines">
        {lines.map((l) => (
          <li key={l.id} className={`qt-line qt-line--${l.kind || 'item'}${l.dim ? ' is-dim' : ''}${firstLines.current.has(l.id) ? '' : ' is-new'}`}>
            <button type="button" className="qt-line-btn" onClick={() => jump(l.step)} aria-label={`${l.label}${l.value ? `, ${l.value}` : ''}. Change this answer`}>
              <span className="qt-line-label">
                {l.label}
                {l.note ? <span className="qt-line-note">{l.note}</span> : null}
              </span>
              {l.value ? <span className="qt-line-lead" aria-hidden="true" /> : null}
              {l.value ? <span className={`qt-line-fig${l.word ? ' is-word' : ''}`} data-fig="">{tightFigure(l.value)}</span> : null}
            </button>
          </li>
        ))}
      </ul>
      <div className="qt-total">
        <span className="qt-total-label">Estimate</span>
        <span className="qt-total-fig">{totalBlock('qt-till--docket')}</span>
        <span className="sr-only">{spoken}</span>
        <span className="qt-total-note">starting price · no GST added</span>
      </div>
    </aside>
  );

  /* ── the questions ── */
  let body = null;
  if (step === 'what') {
    body = (
      <Choices
        labelledBy={qId}
        className="qt-choices--lanes"
        items={LANES}
        value={lane.key}
        onSelect={pickLane}
        onCommit={(k) => { pickLane(k); later(() => go(1, 'fwd')); }}
        render={(l) => (
          <span className="qt-opt-body">
            <span className="qt-opt-top">
              <span className="qt-opt-name">{l.label}</span>
              <span className="qt-opt-fig" data-fig="">
                <span className="qt-opt-from">from</span>{' '}
                {fromPrice(l).map((f, i) => <span key={f}>{i ? <span className="qt-opt-or"> or </span> : null}{tightFigure(f)}</span>)}
              </span>
            </span>
            <span className="qt-opt-desc">{l.blurb}</span>
          </span>
        )}
      />
    );
  } else if (step === 'size') {
    body = (
      <Choices
        labelledBy={qId}
        className="qt-choices--pkgs"
        items={lane.packages}
        value={pkg.key}
        onSelect={pickPkg}
        onCommit={(k) => { pickPkg(k); later(() => go(stepIdx + 1, 'fwd')); }}
        render={(p) => (
          <span className="qt-opt-body">
            <span className="qt-opt-top">
              <span className="qt-opt-name">{p.name}{p.popular ? <em className="qt-opt-pop">most chosen</em> : null}</span>
              <span className="qt-opt-fig" data-fig="">{tightFigure(p.priceLabel)}</span>
            </span>
            {p.priceSuffix || (lane.payMonthly && p.monthlyLabel) ? (
              <span className="qt-opt-terms" data-fig="">
                {p.priceSuffix || <>or {tightFigure(p.monthlyLabel)}</>}
              </span>
            ) : null}
            {p.description ? <span className="qt-opt-desc">{p.description}</span> : null}
            <span className="qt-opt-incl">
              {(p.features || []).slice(0, 3).map((f) => <span key={f}>{f}</span>)}
            </span>
          </span>
        )}
      />
    );
  } else if (step === 'extras' && tray) {
    body = (
      <div className="qt-extras" onKeyDown={extrasKeys}>
        <ul className="qt-tray-list" aria-labelledby={qId}>{tray.out.map(extraRow)}</ul>
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
              <span className="qt-more-label">{drawerOpen ? 'Show fewer extras' : `Show all ${tray.folded} other extras`}</span>
              {!drawerOpen && foldedTicked ? <span className="qt-more-count" data-fig="">{foldedTicked} ticked</span> : null}
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
                  <span className="qt-more-label">Show fewer extras</span>
                  <span className="qt-more-chev" aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  } else if (step === 'pay') {
    const payItems = [
      { key: 'once', name: 'Up front', fig: pkg.priceLabel, notes: [PROJECT_TERMS] },
      {
        key: 'monthly',
        name: 'Monthly',
        fig: pkg.monthlyLabel,
        notes: [
          subscriptionInfo.monthsToOwnership[pkg.key] ? `Own it after about ${subscriptionInfo.monthsToOwnership[pkg.key]} months.` : null,
          `Included while you pay: ${subscriptionInfo.whatsIncluded}`,
          subscriptionInfo.cancellation,
        ],
      },
    ].filter((it) => it.fig);
    body = (
      <Choices
        labelledBy={qId}
        className="qt-choices--pay"
        items={payItems}
        value={paidMonthly ? 'monthly' : 'once'}
        onSelect={pickPay}
        onCommit={(k) => { pickPay(k); later(() => go(stepIdx + 1, 'fwd')); }}
        render={(it) => (
          <span className="qt-opt-body">
            <span className="qt-opt-top">
              <span className="qt-opt-name">{it.name}</span>
              <span className="qt-opt-fig" data-fig="">{tightFigure(it.fig)}</span>
            </span>
            <span className="qt-opt-notes">
              {it.notes.filter(Boolean).map((n) => <span key={n}>{n}</span>)}
            </span>
          </span>
        )}
      />
    );
  } else if (step === 'total') {
    body = (
      <div className="qt-final">
        {docket('qt-docket--inline')}
        <div className="qt-actions">
          <Link to={startUrl} className="qt-start">Start with this scope</Link>
          <button type="button" className="qt-copy" onClick={copy}>{copied ? 'Copied' : 'Copy the scope'}</button>
        </div>
        <p className="qt-fine">{GST_NOTE}{lane.key === 'web' ? ` ${ASTERISK_CLAUSE}` : ''}</p>
      </div>
    );
  }

  const sub = {
    what: 'Pick one. You can change any answer later.',
    size: 'Each price is the published starting price.',
    extras: `A few that suit a ${pkg.name}. Skip this if you don’t need any.`,
    pay: 'Pay for the build up front, or monthly while we host and look after it.',
    total: 'It’s a starting price. The fixed quote comes after a call.',
  }[step];

  return (
    <section
      ref={rootRef}
      className={`qt${compact ? ' qt--compact' : ''}${isFinal ? ' is-final' : ''}${still ? ' is-still' : ''}${live && !still ? ' is-live' : ''}`}
      aria-labelledby={`${uid}-h`}
    >
      <div className="qt-frame">
        <header className="qt-head">
          <h2 className="qt-h2" id={`${uid}-h`}>{heading}</h2>
          <p className="qt-sub">Answer a few questions and the total adds up as you go. Every number is a published starting price, and a fixed quote comes after a call.</p>
        </header>

        <div className="qt-desk">
          <div className="qt-stage" ref={stageRef}>
            <div className="qt-progress">
              <p className="qt-count" id={progressId} data-fig="">{stepCount}</p>
              <ol className="qt-ticks" aria-hidden="true">
                {Array.from({ length: questions }, (_, i) => (
                  <li key={i} className={i < stepIdx ? 'is-done' : (i === stepIdx ? 'is-now' : '')} />
                ))}
              </ol>
              {stepIdx > 0 ? <button type="button" className="qt-over" onClick={startOver}>Start over</button> : null}
            </div>

            {/* Answers so far, as chips (narrow screens; the docket does this wide). */}
            {stepIdx > 0 ? (
              <ul className="qt-chips" aria-label="Your answers so far">
                {steps.slice(0, stepIdx).filter((s) => s !== 'total').map((s) => {
                  const text = s === 'what' ? lane.label
                    : s === 'size' ? pkg.name
                      : s === 'extras' ? (extraItems.length ? `${extraItems.length} extra${extraItems.length > 1 ? 's' : ''}` : 'No extras')
                        : (paidMonthly ? 'Monthly' : 'Up front');
                  return (
                    <li key={s}>
                      <button type="button" className="qt-chip" onClick={() => jump(s)} aria-label={`${text}. Change this answer`}>{text}</button>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            <div key={step} className={`qt-step${animClass}`}>
              <h3 className="qt-q" id={qId} ref={headRef} tabIndex={-1} aria-describedby={progressId}>
                {step === 'size' ? lane.ask : ASK[step]}
              </h3>
              <p className="qt-q-sub">{sub}</p>
              {body}
            </div>

            <div className="qt-nav">
              <button type="button" className="qt-back" onClick={() => go(stepIdx - 1, 'back')} disabled={stepIdx === 0} aria-hidden={stepIdx === 0 ? 'true' : undefined} tabIndex={stepIdx === 0 ? -1 : undefined} aria-label="Back">
                <span className="qt-back-chev" aria-hidden="true" /><span className="qt-back-label">Back</span>
              </button>
              <span className="qt-bar-total">
                <span className="qt-bar-label">Estimate</span>
                <span className="qt-bar-fig">{totalBlock('qt-till--bar')}</span>
                <span className="sr-only">{spoken}</span>
              </span>
              {!isFinal ? (
                <button type="button" className="qt-next" onClick={() => go(stepIdx + 1, 'fwd')}>
                  {steps[stepIdx + 1] === 'total' ? 'See the estimate' : 'Next'}
                  <span className="qt-next-chev" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          {docket('qt-docket--side')}
        </div>
        <p className="sr-only" aria-live="polite">{announce}</p>
      </div>
    </section>
  );
}
