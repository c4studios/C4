/* ─────────────────────────────────────────────────────────────────
   FOLD 3 — THE DOORS (ProductTrio reborn; the identical card grid dies)

   Four material doorways again since 9 Oct 2026, when Logo Design
   became the fourth arm (Caleb: "we've been getting a lot of enquiries
   regarding logo design"). There were three for a day, after the C4i
   door went to C4Site. Each is an honest sample of the destination
   arm's own world, at doorway scale only (memo §1.2):
     C1 · a weave of real client captures on studio dark
     C2 · black behind a hairline 9-gon aperture arc (no amber here —
          the tungsten glow belongs to /Lens itself)
     C3 · the paste-up board from /seo-and-copywriting, your listing
          ringed at first (SEO & Copywriting took C4Site's place, D2)
     C4 · the vinyl offcut from /logo-design on its cutting mat, the
          stand-in mark halfway through the weed (logo-design/DoorFace)
   The codes match the Services menu. Four across from 1024px, two by
   two from 640, one column on phones: home.css has the reasons. Both
   links per door sit in the DOM at rest. Lens dropped "brand identity"
   from its copy on 9 Oct 2026, since logos and identities have their
   own arm now. The lintel of figures above the doors (50+, 200+, <7,
   100%) came off on 9 Oct 2026 at Caleb's word: none had a source, and
   "<7 day turnaround" sat right above a web door saying 2 to 3 weeks.
   ───────────────────────────────────────────────────────────────── */
import React, { useLayoutEffect, useRef } from 'react';
import { Link } from '@/components/c4/SiteLink';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/track';
import SeoDoorFace from '@/components/seo-copy/DoorFace';
import LogoDoorFace from '@/components/logo-design/DoorFace';
import { seoPackages, brandingPackages, logoTimeline } from '@/data/pricing';
import { gsap, EASE, revealHeading, useStaticMode } from './homeMotion';

// The SEO door quotes the published card, so it follows pricing.js.
const SEO_ONE_OFF_FROM = Math.min(...seoPackages.filter((p) => p.priceSuffix === 'one-off').map((p) => p.price));
const SEO_MONTHLY_FROM = Math.min(...seoPackages.filter((p) => /\/mo$/.test(p.priceLabel) && typeof p.price === 'number').map((p) => p.price));

/* So does the logo door: the lowest logo price, and the range of concepts
   the packages offer ("2 initial concepts", "Logo design (5 concepts, 4
   revisions)"). A rebuild redraws a logo you already have, so it offers no
   concepts and doesn't count. */
const LOGO_FROM = Math.min(...brandingPackages.filter((p) => typeof p.price === 'number').map((p) => p.price));

import weaveGocc from './assets/weave-gocc.webp';
import weaveJk from './assets/weave-jk.webp';
import weaveBarrys from './assets/weave-barrys.webp';
import weaveHakea from './assets/weave-hakea.webp';

const WEAVE = [
  { src: weaveGocc, alt: 'GoCC coaching practice website capture' },
  { src: weaveJk, alt: 'JK Plumbing Solutions website capture' },
  { src: weaveBarrys, alt: "Barry's Drink concept site capture" },
  { src: weaveHakea, alt: 'Transform Hakea website capture' },
];

/* Hairline 9-gon arc for the C2 face — six of nine edges, off-centre. */
/* A miniature of the /Lens hero: the 9-blade aperture iris inside its
   barrel, f-stop ticks, HUD corner brackets and the REC lamp. The blade
   group rotates on hover (CSS) like the lens being focused. The plate is
   100 x 140 cut with `slice`, so the face has to stay at least 3:4 tall
   or the REC lamp and the top brackets fall off the edge. */
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
    key: 'lens',
    face: 'lens',
    faceTo: '/Lens',
    faceAria: 'Enter C4 Lens',
    tag: 'C4 Lens',
    word: 'Photography & video',
    outcome:
      'Photography and short-form video, a coherent visual system for Perth businesses ready to retire stock.',
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
  {
    key: 'logo',
    face: 'logo',
    faceTo: '/logo-design',
    faceAria: 'Enter Logo Design',
    tag: 'Logo Design',
    word: 'Design a logo',
    outcome:
      'A logo that holds up from the sign out front to a 16-pixel browser tab, in colour and in one. Every file is yours once it’s paid.',
    fromPrice: `From $${LOGO_FROM}`,
    timeframe: logoTimeline,
    primary: { label: 'See logo design', to: '/logo-design' },
    secondary: { label: 'or start a logo brief', to: '/start?service=logo_design' },
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
  if (kind === 'lens') return <ApertureIris />;
  if (kind === 'logo') return <LogoDoorFace />;
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
        /* Opacity, not autoAlpha: autoAlpha hides the doors with
           visibility, and a hidden link can't take focus, so Tab from the
           hero skipped all four doors until a scroll had revealed them
           (found 9 Oct 2026). Focus landing in a door also finishes the
           reveal at once. */
        const tween = gsap.from(doors, {
          y: 26,
          opacity: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: EASE,
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: section.querySelector('.hm-doors'),
            start: 'top 82%',
            once: true,
          },
        });
        const finish = () => { if (tween.progress() < 1) tween.progress(1); };
        section.addEventListener('focusin', finish);
        return () => {
          section.removeEventListener('focusin', finish);
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
            Four services from one studio. Pick where to start.
          </h2>
          <p className="hm-sub max-w-[36ch] text-[13.5px]">
            Most clients start with one of these. Each card opens a short brief: fixed scope, transparent pricing, founder reply within a business day.
          </p>
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
                {/* The arrow is the same lucide icon the buttons use (it was a
                    text glyph until 9 Oct 2026), held to the last word by a
                    no-break space so it never wraps on its own. */}
                <h3 className="hm-door-word">
                  {door.word}{' '}<ArrowRight className="hm-door-arrow" strokeWidth={2.4} aria-hidden="true" />
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
