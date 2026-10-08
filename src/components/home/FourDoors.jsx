/* ─────────────────────────────────────────────────────────────────
   FOLD 3 — FOUR DOORS (ProductTrio reborn; the identical card grid dies)

   Four material doorways, each an honest sample of the destination
   arm's own shipped identity, at doorway scale only (memo §1.2):
     C1 · a weave of real client captures on studio dark
     C2 · the solder-mask board — sampled ai-arm tokens + copper traces
     C3 · black behind a hairline 9-gon aperture arc (no amber here —
          the tungsten glow belongs to /Lens itself)
     C4 · the paste-up board from /seo-and-copywriting, your listing
          ringed at first (SEO & Copywriting took C4Site's place, D2)
   Every ProductTrio destination, label, outcome line, price and
   timeframe survives verbatim; both links per door sit in the DOM at
   rest. The proof-strip stats are letterpressed into the lintel.
   ───────────────────────────────────────────────────────────────── */
import React, { useLayoutEffect, useRef } from 'react';
import { Link } from '@/components/c4/SiteLink';
import { ArrowRight } from 'lucide-react';
import C4iWordmark from '@/components/c4/C4iWordmark';
import { trackEvent } from '@/lib/track';
import SeoDoorFace from '@/components/seo-copy/DoorFace';
import { seoPackages } from '@/data/pricing';
import { gsap, EASE, revealHeading, useStaticMode } from './homeMotion';

// The SEO door quotes the published card, so it follows pricing.js.
const SEO_ONE_OFF_FROM = Math.min(...seoPackages.filter((p) => p.priceSuffix === 'one-off').map((p) => p.price));
const SEO_MONTHLY_FROM = Math.min(...seoPackages.filter((p) => /\/mo$/.test(p.priceLabel) && typeof p.price === 'number').map((p) => p.price));

import weaveGocc from './assets/weave-gocc.webp';
import weaveJk from './assets/weave-jk.webp';
import weaveBarrys from './assets/weave-barrys.webp';
import weaveHakea from './assets/weave-hakea.webp';

const STATS = [
  { value: '50+', label: 'Perth businesses served' },
  { value: '200+', label: 'Assets delivered' },
  { value: '<7', label: 'Day turnaround' },
  { value: '100%', label: 'Founder-led' },
];

const WEAVE = [
  { src: weaveGocc, alt: 'GoCC coaching practice website capture' },
  { src: weaveJk, alt: 'JK Plumbing Solutions website capture' },
  { src: weaveBarrys, alt: "Barry's Drink concept site capture" },
  { src: weaveHakea, alt: 'Transform Hakea website capture' },
];

/* Hairline 9-gon arc for the C3 face — six of nine edges, off-centre. */
/* A miniature of the /Lens hero: the 9-blade aperture iris inside its
   barrel, f-stop ticks, HUD corner brackets and the REC lamp. The blade
   group rotates on hover (CSS) like the lens being focused. */
function ApertureIris() {
  const CX = 50;
  const CY = 54;
  const R = 38;
  const SWEEP = 112; // chord sweep — sets the inner opening (~0.56R)
  const pt = (deg, r = R) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  };
  const chord = (k, offset = 0) => {
    const [x1, y1] = pt(k * 40 + offset);
    const [x2, y2] = pt(k * 40 + offset + SWEEP);
    return `M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };
  const blades = Array.from({ length: 9 }, (_, k) => chord(k));
  const bladesGhost = Array.from({ length: 9 }, (_, k) => chord(k, 4));
  const ticks = Array.from({ length: 36 }, (_, k) => {
    const major = k % 4 === 0;
    const [x1, y1] = pt(k * 10, R + 2);
    const [x2, y2] = pt(k * 10, R + (major ? 5.4 : 3.6));
    return { d: `M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`, major };
  });
  return (
    <svg className="hm-ninegon" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {/* barrel */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
      <circle cx={CX} cy={CY} r={R - 3.2} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {/* f-stop ticks */}
      {ticks.map((t, i) => (
        <path key={i} d={t.d} stroke={`rgba(255,255,255,${t.major ? 0.36 : 0.18})`} strokeWidth={t.major ? 1.2 : 1} strokeLinecap="round" vectorEffect="non-scaling-stroke" fill="none" />
      ))}
      {/* iris blades — rotates on hover via CSS */}
      <g className="hm-iris-blades">
        {bladesGhost.map((d, i) => (
          <path key={`g${i}`} d={d} stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeLinecap="round" vectorEffect="non-scaling-stroke" fill="none" />
        ))}
        {blades.map((d, i) => (
          <path key={i} d={d} stroke="rgba(255,255,255,0.56)" strokeWidth="1.25" strokeLinecap="round" vectorEffect="non-scaling-stroke" fill="none" />
        ))}
      </g>
      {/* the opening */}
      <circle cx={CX} cy={CY} r={R * 0.5} fill="rgba(255,255,255,0.045)" />
      {/* HUD whispers: corner brackets + REC lamp */}
      <path d="M8 10 L8 4 L14 4 M92 130 L92 136 L86 136" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="88" cy="8" r="1.7" fill="#ff3b30" fillOpacity="0.85" />
      <circle cx="88" cy="8" r="3.4" fill="none" stroke="#ff3b30" strokeOpacity="0.28" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* Copper trace routing for the C2 face — sampled ai-arm values
   (board #0e2f4e / module #134634 / copper #dd9e63 / gold #e8c56c). */
function BoardTraces() {
  return (
    <svg className="hm-traces" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="#dd9e63" strokeWidth="1" strokeOpacity="0.55" vectorEffect="non-scaling-stroke">
        <path d="M-2 22 H 34 L 44 32 V 58" vectorEffect="non-scaling-stroke" />
        <path d="M-2 30 H 28 L 38 40 V 96 L 48 106 H 70" vectorEffect="non-scaling-stroke" />
        <path d="M102 12 H 74 L 64 22 V 42" vectorEffect="non-scaling-stroke" />
        <path d="M102 84 H 84 L 76 76 V 30" vectorEffect="non-scaling-stroke" />
      </g>
      <g fill="#dd9e63" fillOpacity="0.8">
        <circle cx="44" cy="58" r="1.7" />
        <circle cx="64" cy="42" r="1.7" />
        <circle cx="70" cy="106" r="1.7" />
        <circle cx="76" cy="30" r="1.7" />
      </g>
      <rect x="50" y="46" width="22" height="16" rx="1.4" fill="#134634" stroke="#e8c56c" strokeWidth="0.8" strokeOpacity="0.85" />
      <g fill="#e8c56c" fillOpacity="0.75">
        <rect x="52.5" y="43.4" width="2.2" height="2.6" />
        <rect x="57.5" y="43.4" width="2.2" height="2.6" />
        <rect x="62.5" y="43.4" width="2.2" height="2.6" />
        <rect x="67.5" y="43.4" width="2.2" height="2.6" />
      </g>
    </svg>
  );
}

const DOORS = [
  {
    key: 'web',
    face: 'web',
    faceTo: '/ServiceWeb',
    faceAria: 'Enter Web & Applications',
    tag: 'Web design & development',
    word: 'Build a website',
    outcome:
      'Custom marketing sites, web apps and SaaS platforms that are fast, refined and built to convert. You own the codebase end-to-end.',
    fromPrice: 'From $500',
    timeframe: '2 to 3 weeks',
    primary: { label: 'See the web work', to: '/ServiceWeb' },
    secondary: { label: 'or start a web brief', to: '/start?service=web_design' },
  },
  {
    key: 'c4i',
    face: 'c4i',
    faceTo: '/c4i',
    faceAria: 'Enter C4i',
    tag: (
      <>
        <C4iWordmark /> · AI
      </>
    ),
    word: 'Private AI & automations',
    outcome:
      'A private AI system on your own hardware, or cloud-based automations, agents and custom tools. Choose the setup that fits.',
    fromPrice: 'Local or cloud',
    timeframe: 'Scoped to you',
    primary: {
      label: (
        <>
          Explore <C4iWordmark />
        </>
      ),
      to: '/c4i',
    },
    secondary: { label: 'or scope an AI build', to: '/start?service=automation' },
  },
  {
    key: 'lens',
    face: 'lens',
    faceTo: '/Lens',
    faceAria: 'Enter C4 Lens',
    tag: 'C4 Lens',
    word: 'Photography, video & brand',
    outcome:
      'Photography, short-form video and brand identity, a coherent visual system for Perth businesses ready to retire stock.',
    fromPrice: 'From $200',
    timeframe: 'Half / full-day shoots',
    primary: { label: 'Visit C4 Lens', to: '/Lens' },
    secondary: { label: 'or book a shoot', to: '/start?service=lens' },
  },
  {
    key: 'seo',
    face: 'seo',
    faceTo: '/seo-and-copywriting',
    faceAria: 'Enter SEO & Copywriting',
    tag: 'SEO & Copywriting',
    word: 'Get found on Google',
    outcome:
      'Technical fixes up front, then new articles every month, so you’re easier to find on Google. Website copy too, written plainly.',
    fromPrice: `From $${SEO_ONE_OFF_FROM}`,
    timeframe: `Or $${SEO_MONTHLY_FROM}/mo`,
    primary: { label: 'See SEO & copywriting', to: '/seo-and-copywriting' },
    secondary: { label: 'or start an SEO brief', to: '/start?service=seo' },
  },
];

function DoorFaceArt({ kind }) {
  if (kind === 'web') {
    return (
      <span className="hm-weave" aria-hidden="true">
        {WEAVE.map((w) => (
          <img key={w.src} src={w.src} alt="" loading="lazy" decoding="async" />
        ))}
      </span>
    );
  }
  if (kind === 'c4i') return <BoardTraces />;
  if (kind === 'lens') return <ApertureIris />;
  return <SeoDoorFace />;
}

export default function FourDoors() {
  const sectionRef = useRef(null);
  const h2Ref = useRef(null);
  const staticMode = useStaticMode();

  useLayoutEffect(() => {
    if (staticMode) return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        revealHeading(h2Ref.current);
        const doors = gsap.utils.toArray('.hm-door', section);
        const tween = gsap.from(doors, {
          y: 26,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: EASE,
          clearProps: 'opacity,visibility,transform',
          scrollTrigger: {
            trigger: section.querySelector('.hm-doors'),
            start: 'top 82%',
            once: true,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    }, section);

    return () => ctx.revert();
  }, [staticMode]);

  return (
    <section ref={sectionRef} aria-labelledby="home-products-heading" className="relative py-20 md:py-28" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <h2
            id="home-products-heading"
            ref={h2Ref}
            className="hm-h2 max-w-[24ch] text-[clamp(1.7rem,3.4vw,2.7rem)]"
          >
            Four services. One studio. Pick a starting point.
          </h2>
          <p className="hm-sub max-w-[36ch] text-[13.5px]">
            Most clients start with one of these. Each card opens a short brief: fixed scope, transparent pricing, founder reply within a business day.
          </p>
        </div>
      </div>

      {/* The lintel — proof letterpressed above the doors */}
      <div className="hm-lintel">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="hm-lintel-inner">
            <span className="hm-label">C4 Services</span>
            {STATS.map((s) => (
              <span key={s.label} className="hm-lintel-stat">
                <b>{s.value}</b>
                <span>{s.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pt-10 md:px-12 md:pt-12">
        <div className="hm-doors">
          {DOORS.map((door) => (
            <article key={door.key} className="hm-door" data-proof>
              <Link
                to={door.faceTo}
                onClick={() => trackEvent('door_click', { target: door.key, detail: 'face' })}
                className={`hm-doorface hm-doorface--${door.face}`}
                aria-label={door.faceAria}
              >
                <DoorFaceArt kind={door.face} />
                <span className="hm-door-tag">{door.tag}</span>
                <h3 className="hm-door-word">
                  {door.word}
                  <span className="hm-door-arrow" aria-hidden="true"> →</span>
                </h3>
              </Link>

              <div className="hm-doorinfo">
                <p>{door.outcome}</p>
                <div className="hm-door-meta">
                  <b>{door.fromPrice}</b>
                  <i aria-hidden="true">/</i>
                  <span>{door.timeframe}</span>
                </div>
                <div className="hm-door-ctas">
                  <Link to={door.primary.to} onClick={() => trackEvent('door_click', { target: door.key, detail: 'primary' })} className="hm-door-cta group">
                    {door.primary.label}
                    <ArrowRight size={12} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                  <Link to={door.secondary.to} onClick={() => trackEvent('door_click', { target: door.key, detail: 'secondary' })} className="hm-door-sec group">
                    {door.secondary.label}
                    <ArrowRight size={11} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
