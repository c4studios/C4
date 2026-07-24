/**
 * /ServiceWeb — C1 · Web & Applications. "The White Gallery."
 *
 * Rebuilt to the client's brief: a white, high-production page (Apple
 * product-page register) where the craft itself is the show. The
 * red-thread SVG system is retired in full — no drawn paths, no
 * morphs, no signature; C4 red survives as the accent (CTAs, links,
 * the closing drench band).
 *
 * The hero fuses the two components the client supplied:
 *   · GradientText — "Design without Limits", with "without" carrying
 *     a living gradient (blurred colour blobs in a mix-blend-lighten
 *     overlay over near-black glyphs; pure CSS, infinite, the page's
 *     only continuously-animating element).
 *   · ContainerScroll — the Aceternity scroll-tilt device card: the
 *     title drifts up while the tilted bezel (rotateX 20° → 0, scale
 *     1.05 → 1) straightens INTO a real client capture (DSR), which
 *     then gently steps through two more frames as the scroll
 *     continues past the straighten point. framer-motion v11
 *     useScroll/useTransform drives it; GSAP never touches the hero.
 *
 * SEO contract: the display line is a <p>; the document h1 remains
 * "Websites built to convert and scale." verbatim, styled as the
 * refined supporting claim beneath the display line. One h1 only.
 *
 * Below the fold, GSAP (ScrollTrigger + Flip + CustomEase) keeps the
 * proof drives (DSR desktop→phone handoff, Groverz pan), the case
 * grid with click-time FLIP morph dialogs, focus-in frame entrances,
 * subtle capture parallax, the odometer rate card, and the magnetic
 * primaries. Everything arms inside gsap.matchMedia(); nothing arms
 * under prefers-reduced-motion or the Prerender UA (staticMode) — the
 * DOM default IS the finished state everywhere, so the prerender
 * ships the built page for free.
 *
 * Chrome: forced LIGHT. `.lv-on-stage` (same marker class) now pins
 * the --c4-* token set to the light chrome for the life of the page
 * (guarded MutationObserver, cleanup restore — house pattern).
 * Styles: src/components/web-arm/web-arm.css (.lv-root).
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import {
  webPackageSections,
  webPricingGuides,
  webScopeNotes,
  subscriptionInfo,
  ASTERISK_CLAUSE,
  GST_NOTE,
  INDUSTRY_SURCHARGE_NOTE,
} from '@/data/pricing';
import GradientText from '../components/web-arm/GradientText';
import HeroFusion from '../components/web-arm/HeroFusion';
import ConceptCarousel from '../components/web-arm/ConceptCarousel';
import { reassertStoredTheme } from '../components/c4/ThemeContext';
import '../components/web-arm/web-arm.css';

/* Derived capture assets — generated from public/captures (read-only)
   via scripts/portfolio-capture/derive-web-arm.mjs; webp throughout.
   The DSR pair is the REAL full-page home capture (900×7808 desktop,
   480×14200 mobile) — the device drive scrubs the actual page. */
import sharpHero from '../components/web-arm/assets/sharp-hero.webp';
import dsrHomeD from '../components/web-arm/assets/dsr-home-d.webp';
import dsrHomeM from '../components/web-arm/assets/dsr-home-m.webp';
import gzD1 from '../components/web-arm/assets/gz-d1.webp';
import hvnF1 from '../components/web-arm/assets/hvn-f1.webp';
import hvnF2 from '../components/web-arm/assets/hvn-f2.webp';
import hvnF3 from '../components/web-arm/assets/hvn-f3.webp';
import hvnF4 from '../components/web-arm/assets/hvn-f4.webp';
import hvnF5 from '../components/web-arm/assets/hvn-f5.webp';
import hvnF6 from '../components/web-arm/assets/hvn-f6.webp';
import eaHero from '../components/web-arm/assets/ea-hero.webp';
import tidyHero from '../components/web-arm/assets/tidy-hero.webp';
import tidyF2 from '../components/web-arm/assets/tidy-f2.webp';
import tidyF3 from '../components/web-arm/assets/tidy-f3.webp';
import jptHero from '../components/web-arm/assets/jpt-hero.webp';

gsap.registerPlugin(ScrollTrigger, Flip, CustomEase);

/* One shared house ease for every non-scrub tween on the page. */
if (!CustomEase.get('c4')) CustomEase.create('c4', 'M0,0 C0.2,0 0.1,1 1,1');

const START = createPageUrl('StartProject');
const PORTFOLIO = createPageUrl('Portfolio');

/* Delivery windows are page metadata (they don't exist in pricing.js).
   The six original windows preserved verbatim; proposal-scoped tiers
   say so instead of inventing a number. */
const TIMELINES = {
  starter: '1–2 weeks',
  brochure: '2–3 weeks',
  business: '3–4 weeks',
  custom: '4–6 weeks',
  'commerce-starter': '4–6 weeks',
  'web-application': '5–8 weeks',
  growth: 'By proposal',
  platform: 'By proposal',
};

const INCLUDED = [
  'Mobile-first responsive layout',
  'Basic SEO setup',
  'Performance optimised',
  'Cross-browser tested',
  'Founder reply within 1 business day',
  'Full code handover — you own it',
];

/* Brief → Design → Build → Launch — a real sequence; the four
   descriptions are preserved verbatim. */
const PROCESS = [
  { label: 'Brief', desc: 'You describe the outcome you need. We ask the right questions.' },
  { label: 'Design', desc: 'Wireframes and visual designs — reviewed and approved before build.' },
  { label: 'Build', desc: 'Clean code, responsive layout, tested across devices.' },
  { label: 'Launch', desc: 'Deployment, DNS, analytics, and a handover guide.' },
];

/* ── The proof reel ────────────────────────────────────────────────
   All six pass-1 clients preserved (scope lines + alt text are SEO
   contract copy). DS Racing Karts is the featured drive — now the
   REAL full-page home capture driven end to end inside drawn devices.
   HVN, Tidy Gardens and Evidence Advisory each hold their own display;
   Sharp, Groverz and Jurassic sit in the record grid with the
   click-time FLIP morph. */
const DSR = {
  key: 'dsr',
  name: 'DS Racing Karts',
  url: 'dsracingkarts.com.au',
  place: 'Perth, WA',
  year: '2026',
  scope:
    'Ecommerce platform for a WA karting supplier — full shop and checkout, race results, team pages and a custom admin.',
  home: {
    desktop: {
      src: dsrHomeD,
      w: 900,
      h: 7808,
      alt: 'DS Racing Karts home page, end to end — dark motorsport hero, kart categories, latest products and newsletter.',
    },
    mobile: {
      src: dsrHomeM,
      w: 480,
      h: 14200,
      alt: 'DS Racing Karts mobile home page — the same build, phone-first, hero to footer.',
    },
  },
};

/* The three feature displays — each client staged in its own world. */
const HVN_SHOW = {
  key: 'hvn',
  name: 'HVN CrossFit',
  place: 'Port Kennedy, WA',
  year: '2026',
  scope: 'Cinematic Next.js gym site with live class booking and a scroll-driven mini-game.',
  frames: [
    { src: hvnF1, alt: 'HVN CrossFit home page — a dark, cinematic hero for a Port Kennedy gym.' },
    { src: hvnF2, alt: 'HVN CrossFit — training value props over dark photography.' },
    { src: hvnF3, alt: 'HVN CrossFit — the scroll-driven chin-up mini-game.' },
    { src: hvnF4, alt: 'HVN CrossFit — live class timetable.' },
    { src: hvnF5, alt: 'HVN CrossFit — gym gallery.' },
    { src: hvnF6, alt: 'HVN CrossFit — pro shop.' },
  ],
};

const TIDY_SHOW = {
  key: 'tidy',
  name: 'Tidy Gardens Australia',
  place: 'Perth, WA',
  year: '2026',
  scope: 'Motion-led site for a garden & reticulation business, with a living scroll motif.',
  frames: [
    { src: tidyHero, w: 900, h: 563, alt: 'Tidy Gardens Australia home page — a green, motion-led hero for a Perth garden-care business.' },
    { src: tidyF2, w: 900, h: 563, alt: 'Tidy Gardens — the scroll-driven lawnmower motif cutting tall grass into a striped lawn.' },
    { src: tidyF3, w: 900, h: 563, alt: 'Tidy Gardens — reticulation repairs, installations and controller replacement.' },
  ],
};

const EA_SHOW = {
  key: 'evidence',
  name: 'Evidence Advisory',
  place: 'Perth, WA',
  year: '2026',
  scope: 'Digital-forensics brand site anchored by a scroll-solved 3D crime-scene reconstruction.',
  img: eaHero,
  w: 900,
  h: 563,
  alt: 'Evidence Advisory home page — a shattered, evidence-tagged smartphone suspended in zero gravity with yellow forensic markers.',
  tags: [
    'The evidence-tagged smartphone, suspended mid-shatter',
    'Yellow forensic markers pacing the scroll',
    'A scroll-solved 3D reconstruction as the hero',
  ],
};

const GROVERZ = {
  key: 'groverz',
  name: 'Groverz Tax & Accounting',
  url: 'groverztax.com.au',
  place: 'East Cannington, WA',
  year: '2026',
  scope: 'Tax-practice site with an interactive refund estimator and a physics-driven hero.',
  frame: { src: gzD1, w: 900, h: 434, alt: 'Groverz Tax & Accounting home page — a professional accounting-practice website hero.' },
};

const CASES = [
  {
    key: 'sharp',
    name: 'Sharp Bricklaying',
    place: 'Perth, WA',
    year: '2026',
    scope: 'Premium bricklayer’s site built from licensed drone aerials and a multi-job gallery.',
    img: sharpHero,
    w: 900,
    h: 563,
    alt: 'Sharp Bricklaying home page — a drone aerial of finished brickwork behind the studio wordmark.',
  },
  {
    key: 'groverz',
    name: GROVERZ.name,
    place: GROVERZ.place,
    year: GROVERZ.year,
    scope: GROVERZ.scope,
    img: GROVERZ.frame.src,
    w: GROVERZ.frame.w,
    h: GROVERZ.frame.h,
    alt: GROVERZ.frame.alt,
  },
  {
    key: 'jurassic',
    name: 'Jurassic PT',
    place: 'Cannington, WA',
    year: '2026',
    scope: 'Conversion-focused fitness studio site — memberships, timetable and direct booking.',
    img: jptHero,
    w: 900,
    h: 563,
    alt: 'Jurassic PT home page — a dark, lime-accented hero for a Cannington personal-training studio.',
  },
];

/* Sections zipped with their pricing guides (parallel arrays in
   pricing.js — base / ecommerce / apps). */
const SECTIONS = webPackageSections.map((section, i) => ({
  ...section,
  guide: webPricingGuides[i],
}));

/* Stable module-level ref so the head hook doesn't re-run each render. */
const WEB_JSONLD = [
  serviceSchema({
    name: 'Web Design & Development',
    description:
      'Custom websites, web apps, SaaS platforms and ecommerce stores for Perth businesses — built to convert and designed to last.',
    url: '/ServiceWeb',
    serviceType: 'Web design and development',
  }),
  breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Web & Applications', path: '/ServiceWeb' },
  ]),
];

/* The old HeroPan (three stepped stills inside the tilt card) is
   retired — HeroFusion's screen is live DOM, so every scroll position
   is its own frame. */

/* ── Price odometer ────────────────────────────────────────────────
   Rolling digits on the Pay once / Monthly toggle. Labels that don't
   decompose into digits fall back to an instant swap; Geist Mono keeps
   every numeral the same width and the price cell is fixed-width, so
   the roll causes zero layout shift. Static mode renders plain text. */
const PRICE_RE = /^([^0-9]*)([0-9][0-9,]*)(.*)$/;

function PriceOdometer({ label, animate }) {
  const hostRef = useRef(null);
  const prevLabelRef = useRef(label);
  const m = animate ? PRICE_RE.exec(label) : null;

  useLayoutEffect(() => {
    const prevLabel = prevLabelRef.current;
    prevLabelRef.current = label;
    if (!animate || prevLabel === label) return;
    const host = hostRef.current;
    if (!host) return;
    const pm = PRICE_RE.exec(prevLabel);
    const nm = PRICE_RE.exec(label);
    if (!pm || !nm) return; /* defensive: instant swap already rendered */
    const prevChars = pm[2].split('');
    const nextChars = nm[2].split('');
    const offset = prevChars.length - nextChars.length;
    host.querySelectorAll('.lv-odo-slot').forEach((slot) => {
      const idx = Number(slot.dataset.idx);
      const target = Number(slot.dataset.digit);
      const strip = slot.firstElementChild;
      const h = slot.clientHeight;
      const prevChar = prevChars[idx + offset];
      const from = prevChar != null && /[0-9]/.test(prevChar) ? Number(prevChar) : null;
      if (from == null) {
        gsap.fromTo(strip, { y: -target * h, opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' });
      } else if (from !== target) {
        gsap.fromTo(
          strip,
          { y: -from * h, opacity: 1 },
          { y: -target * h, duration: 0.55, ease: 'power3.inOut', delay: idx * 0.035 },
        );
      } else {
        gsap.set(strip, { y: -target * h, opacity: 1 });
      }
    });
    if (pm[3] !== nm[3]) {
      const suffix = host.querySelector('.lv-odo-suffix');
      if (suffix) gsap.fromTo(suffix, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' });
    }
  }, [label, animate]);

  if (!m) return <span className="lv-price-text">{label}</span>;
  const [, prefix, digits, suffix] = m;
  return (
    <span className="lv-odo" ref={hostRef}>
      <span className="lv-odo-live" aria-hidden="true">
        {prefix && <span className="lv-odo-fix">{prefix}</span>}
        {digits.split('').map((ch, i) =>
          /[0-9]/.test(ch) ? (
            <span className="lv-odo-slot" key={i} data-idx={i} data-digit={ch}>
              <span
                className="lv-odo-strip"
                style={{ transform: `translateY(${-Number(ch) * 1.18}em)` }}
              >
                {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ) : (
            <span className="lv-odo-fix" key={i}>
              {ch}
            </span>
          ),
        )}
        {suffix && <span className="lv-odo-fix lv-odo-suffix">{suffix}</span>}
      </span>
      <span className="lv-sr">{label}</span>
    </span>
  );
}

/* ── Chrome pin — forced light gallery ─────────────────────────────
   `.lv-on-stage` (marker class unchanged) pins the full --c4-* set
   LIGHT (web-arm.css) for the life of the page. ThemeProvider
   re-applies its own tokens from a parent effect, so a guarded
   MutationObserver re-asserts (house pattern: ServiceAI/Foresight). */
function useForceLight() {
  useEffect(() => {
    const root = document.documentElement;
    const assertLight = () => {
      if (
        !root.classList.contains('light-mode') ||
        !root.classList.contains('lv-on-stage') ||
        root.classList.contains('dark-mode') ||
        root.classList.contains('vivid')
      ) {
        root.classList.add('light-mode', 'lv-on-stage');
        root.classList.remove('dark-mode', 'vivid');
      }
    };
    assertLight();
    const observer = new MutationObserver(assertLight);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer.disconnect();
      reassertStoredTheme();
    };
  }, []);
}

export default function ServiceWeb() {
  useForceLight();
  const rootRef = useRef(null);
  const lenisRef = useRef(null);
  const openerRef = useRef(null);
  const flipStateRef = useRef(null);
  const panelRef = useRef(null);

  const [billing, setBilling] = useState('once');
  const isMonthly = billing === 'monthly';
  const [openCase, setOpenCase] = useState(null);

  const prerender = useMemo(
    () => typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent),
    [],
  );
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const staticMode = reduced || prerender;

  useDocumentHead({
    title: 'Web & Applications — C4 Studios Perth',
    description:
      'Custom websites, web apps, SaaS platforms and ecommerce stores. Built to convert, designed to last. Perth-based, working Australia-wide.',
    path: '/ServiceWeb',
    jsonLd: WEB_JSONLD,
  });

  /* Lenis owns scroll on this route (shared instance if another page
     already made one — PrivateAI pattern). Never in static mode. */
  useEffect(() => {
    if (staticMode) return undefined;
    const w = window;
    if (w.__c4Lenis) {
      lenisRef.current = w.__c4Lenis;
      return undefined;
    }
    /* lerp (not duration) — a constant-rate catch-up reads calmer under
       scrub than an eased fixed-duration glide, and 0.1 keeps Lenis and
       the ScrollTrigger scrub smoothing (0.8–1) in the same register. */
    const lenis = new Lenis({ lerp: 0.1 });
    w.__c4Lenis = lenis;
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); /* restore the GSAP default */
      lenis.destroy();
      delete w.__c4Lenis;
      lenisRef.current = null;
    };
  }, [staticMode]);

  /* ── Below-the-fold motion ────────────────────────────────────────
     One matchMedia block; every trigger created inside it. The armed
     class only marks the root (DSR sticky-drive height); GSAP owns all
     pre-animation states via fromTo, so the static DOM stays final.
     The hero is framer-motion's alone — no GSAP touches it. */
  useLayoutEffect(() => {
    if (staticMode) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;
    root.classList.add('lv-armed');
    const mm = gsap.matchMedia(root);

    mm.add(
      {
        desk: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        mob: '(max-width: 899.98px) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { desk } = ctx.conditions;
        const q = gsap.utils.selector(root);

        /* Quiet one-shot arrival: a short rise, nothing theatrical. */
        const rise = (el, vars = {}) => {
          gsap.fromTo(
            el,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'c4',
              delay: vars.delay || 0,
              scrollTrigger: {
                trigger: vars.trigger || el,
                start: vars.start || 'top 88%',
                once: true,
              },
            },
          );
        };

        /* Included list — line by line, alternating a beat. */
        q('.lv-spec-item').forEach((li, i) => rise(li, { delay: (i % 2) * 0.06 }));

        /* Reel head. */
        q('.lv-reel-head').forEach((el) => rise(el, { start: 'top 82%' }));

        /* ── DSR featured drive — the REAL home page, driven end to end
           inside the drawn laptop and phone. Both devices scrub the
           full-page capture; the phone leads slightly so the two reads
           feel independent, like a desk with both screens alive. */
        const real = q('.lv-drive--real')[0];
        if (real && desk) {
          const dImg = real.querySelector('.lv-mac-view img');
          const dView = real.querySelector('.lv-mac-view');
          const mImg = real.querySelector('.lv-cell-view img');
          const mView = real.querySelector('.lv-cell-view');
          /* Entrance: the stage focuses in (soft blur + scale) before
             the pin engages — one short pass, filter cleared after. */
          gsap.fromTo(
            real.querySelector('.lv-drive-stage'),
            { scale: 0.975, filter: 'blur(3px)' },
            {
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.8,
              ease: 'power2.out',
              clearProps: 'filter',
              scrollTrigger: { trigger: real, start: 'top 85%', once: true },
            },
          );
          const driveTl = gsap.timeline({
            scrollTrigger: {
              trigger: real,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          driveTl.fromTo(
            real.querySelector('.lv-drive-id'),
            { y: 30 },
            { y: -30, ease: 'none', duration: 1 },
            0,
          );
          /* The whole page, hero to footer — a genuine walkthrough. */
          driveTl.to(dImg, {
            y: () => -Math.max(0, dImg.offsetHeight - dView.clientHeight),
            ease: 'none',
            duration: 0.92,
          }, 0.04);
          driveTl.to(mImg, {
            y: () => -Math.max(0, mImg.offsetHeight - mView.clientHeight),
            ease: 'none',
            duration: 0.88,
          }, 0);
        }
        /* Mobile: the same walkthrough on the section's own transit —
           no pin, both devices still drive the real page. */
        if (real && !desk) {
          [
            ['.lv-mac-view', '.lv-mac-view img'],
            ['.lv-cell-view', '.lv-cell-view img'],
          ].forEach(([viewSel, imgSel]) => {
            const view = real.querySelector(viewSel);
            const img = real.querySelector(imgSel);
            if (!view || !img) return;
            gsap.to(img, {
              y: () => -Math.max(0, img.offsetHeight - view.clientHeight),
              ease: 'none',
              scrollTrigger: {
                trigger: real,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            });
          });
        }

        /* ── HVN — the dark cinema strip pans horizontally across its
           own transit; the film keeps a slow constant burn. */
        const hvn = q('.lv-show--hvn')[0];
        if (hvn) {
          const strip = hvn.querySelector('.lv-hvn-strip');
          const viewport = hvn.querySelector('.lv-hvn-viewport');
          if (strip && viewport) {
            gsap.to(strip, {
              x: () => -Math.max(0, strip.scrollWidth - viewport.clientWidth),
              ease: 'none',
              scrollTrigger: {
                trigger: hvn,
                start: 'top 80%',
                end: 'bottom 12%',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            });
          }
        }

        /* ── Tidy — the vine draws itself as the plot crosses the
           viewport; leaves unfurl at their nodes. Static default is the
           fully-drawn vine (GSAP owns the pre-state at arm time). */
        const tidy = q('.lv-show--tidy')[0];
        if (tidy) {
          const stem = tidy.querySelector('.lv-tidy-stem');
          if (stem && typeof stem.getTotalLength === 'function') {
            const len = stem.getTotalLength();
            gsap.fromTo(
              stem,
              { strokeDasharray: len, strokeDashoffset: len },
              {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: tidy,
                  start: 'top 78%',
                  end: 'bottom 30%',
                  scrub: 1,
                },
              },
            );
          }
          tidy.querySelectorAll('.lv-tidy-leaf').forEach((leaf, i) => {
            gsap.fromTo(
              leaf,
              { opacity: 0, scale: 0.6, transformOrigin: 'left center' },
              {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'c4',
                scrollTrigger: { trigger: tidy, start: `top ${72 - i * 14}%`, once: true },
              },
            );
          });
          tidy.querySelectorAll('.lv-tidy-frames figure').forEach((fig, i) => {
            rise(fig, { delay: i * 0.08, start: 'top 88%' });
          });
        }

        /* ── Evidence Advisory — the wall assembles: photo focuses in,
           the three evidence chips land one by one. */
        const ea = q('.lv-show--ea')[0];
        if (ea) {
          gsap.fromTo(
            ea.querySelector('.lv-ea-fig'),
            { scale: 0.97, filter: 'blur(3px)', opacity: 0.4 },
            {
              scale: 1,
              filter: 'blur(0px)',
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              clearProps: 'filter',
              scrollTrigger: { trigger: ea, start: 'top 82%', once: true },
            },
          );
          gsap.fromTo(
            ea.querySelectorAll('.lv-ea-tag'),
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              stagger: 0.14,
              ease: 'c4',
              scrollTrigger: { trigger: ea, start: 'top 70%', once: true },
            },
          );
        }

        /* Static case frames: staggered arrivals, focus-in, and a
           subtle counter-rate drift inside each cropped frame. */
        q('.lv-case').forEach((el, i) => {
          rise(el, { start: 'top 90%', delay: (i % 2) * 0.08 });
          const fig = el.querySelector('.lv-case-fig');
          if (!fig) return;
          /* Frame focuses in — short soft blur/scale. Transform AND
             filter cleared on completion: nothing keeps compositing,
             and the CSS hover lift gets its transform slot back. */
          gsap.fromTo(
            fig,
            { scale: 0.97, filter: 'blur(3px)' },
            {
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.7,
              delay: (i % 2) * 0.08,
              ease: 'power2.out',
              clearProps: 'transform,filter',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            },
          );
          const img = fig.querySelector('img');
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: i % 2 ? 3.2 : -3.2, scale: 1.07 },
              {
                yPercent: i % 2 ? -3.2 : 3.2,
                scale: 1.07,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
              },
            );
          }
        });

        /* Decode capture sets just ahead of their entrance so drive
           swaps never jank. */
        const decodeIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.querySelectorAll('img').forEach((img) => {
                if (img.decode) img.decode().catch(() => {});
              });
              decodeIO.unobserve(entry.target);
            });
          },
          { rootMargin: '140% 0px' },
        );
        q('.lv-drive, .lv-cases').forEach((el) => decodeIO.observe(el));

        /* Rate card rows rise in. */
        q('.lv-line').forEach((row) => rise(row, { start: 'top 92%' }));

        /* Process — the four steps arrive as one quiet row. */
        const stages = q('.lv-stage-item');
        if (stages.length) {
          stages.forEach((el, i) =>
            rise(el, { trigger: q('.lv-stages')[0], start: 'top 85%', delay: i * 0.07 }),
          );
        }

        /* Closing band content. */
        q('.lv-drench-in').forEach((el) => rise(el, { start: 'top 80%' }));

        /* ── Magnetic primaries (fine pointers, desktop): the red CTAs
           lean toward the cursor inside their own hitbox and glide
           back on leave. Transform-only; capped ±12/±8px. */
        const magnetCleanups = [];
        if (desk && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          q('.lv-btn').forEach((btn) => {
            const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
            const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
            const onMove = (e) => {
              const r = btn.getBoundingClientRect();
              xTo(gsap.utils.clamp(-12, 12, (e.clientX - (r.left + r.width / 2)) * 0.24));
              yTo(gsap.utils.clamp(-8, 8, (e.clientY - (r.top + r.height / 2)) * 0.32));
            };
            const onLeave = () => {
              xTo(0);
              yTo(0);
            };
            btn.addEventListener('pointermove', onMove);
            btn.addEventListener('pointerleave', onLeave);
            magnetCleanups.push(() => {
              btn.removeEventListener('pointermove', onMove);
              btn.removeEventListener('pointerleave', onLeave);
            });
          });
        }

        return () => {
          magnetCleanups.forEach((fn) => fn());
          magnetCleanups.length = 0;
          decodeIO.disconnect();
        };
      },
    );

    /* Cold-load safety: if Archivo lands after arming, one refresh
       re-measures every scrubbed timeline against the real metrics. */
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => {
      mm.revert();
      root.classList.remove('lv-armed');
    };
  }, [staticMode]);

  /* ── Case morph: click-time Flip (the one place Flip is allowed).
     The overlay is an enhancement over the always-rendered captions
     and links; static mode gets a plain conditional render. */
  const activeCase = openCase ? CASES.find((c) => c.key === openCase) : null;

  const handleOpenCase = (key, event) => {
    openerRef.current = event.currentTarget;
    if (!staticMode) {
      const img = event.currentTarget.querySelector('img');
      if (img) flipStateRef.current = Flip.getState(img);
    }
    setOpenCase(key);
  };

  const handleCloseCase = () => {
    const panel = panelRef.current;
    const finish = () => {
      setOpenCase(null);
      if (openerRef.current) openerRef.current.focus();
    };
    if (!staticMode && panel) {
      gsap.to(panel, { opacity: 0, scale: 0.985, duration: 0.24, ease: 'power1.in', onComplete: finish });
    } else {
      finish();
    }
  };

  useLayoutEffect(() => {
    if (!openCase) return undefined;
    const panel = panelRef.current;
    if (panel && !staticMode && flipStateRef.current) {
      const img = panel.querySelector('img');
      if (img) {
        Flip.from(flipStateRef.current, {
          targets: img,
          absolute: true,
          duration: 0.65,
          ease: 'c4',
        });
      }
      flipStateRef.current = null;
      gsap.fromTo(
        panel.querySelectorAll('.lv-panel-copy > *'),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.3, ease: 'c4' },
      );
    }
    const closeBtn = panel ? panel.querySelector('.lv-panel-close') : null;
    if (closeBtn) closeBtn.focus();
    const lenis = lenisRef.current;
    if (lenis) lenis.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        handleCloseCase();
        return;
      }
      /* Contain Tab inside the dialog: aria-modal announces the page
         as hidden to AT, so sighted keyboard focus must not walk into
         the scroll-locked background either. */
      if (e.key === 'Tab' && panel) {
        const focusables = panel.querySelectorAll('a[href], button:not([disabled])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const inside = panel.contains(document.activeElement);
        if (e.shiftKey && (!inside || document.activeElement === first)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (lenis) lenis.start();
    };
  }, [openCase, staticMode]);

  const monthlyNote = `${subscriptionInfo.howItWorks} ${subscriptionInfo.whatsIncluded} ${subscriptionInfo.ownership} ${subscriptionInfo.cancellation}`;

  return (
    <div className="lv-root" ref={rootRef}>
      {/* ══ Hero — "Design without Limits" dives INTO the portfolio ═ */}
      <HeroFusion
        staticMode={staticMode}
        header={
          <>
            <p className="lv-kicker">C1 · Web &amp; Applications — arm of C4 Studios · Perth, WA</p>
            <p className="lv-display">
              Design <GradientText>without</GradientText> Limits
            </p>
            <h1 className="lv-h1">Websites built to convert and scale.</h1>
            <p className="lv-lede">
              From a crisp landing page to a full web application — every project is
              scoped clearly, designed carefully, and delivered on time.
            </p>
            <div className="lv-hero-cta">
              <Link className="lv-btn" to={`${START}?service=web_design`}>
                Start a brief
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
              </Link>
              <Link className="lv-link" to={PORTFOLIO}>
                See the work
                <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>
          </>
        }
      />

      {/* ══ Every project includes ══════════════════════════════════ */}
      <section className="lv-spec">
        <div className="lv-frame">
          <h2 className="lv-h2">Every project includes</h2>
          <ul className="lv-spec-list">
            {INCLUDED.map((item) => (
              <li className="lv-spec-item" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ The proof reel ══════════════════════════════════════════ */}
      <section className="lv-reel">
        <div className="lv-frame">
          <div className="lv-reel-head">
            <div>
              <h2 className="lv-h2">Live sites, browsing themselves.</h2>
              <p className="lv-sub">
                Real client work, driving itself as you scroll. Every frame opens the
                wider record.
              </p>
            </div>
            <Link className="lv-link" to={PORTFOLIO}>
              Full portfolio
              <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Featured drive — DSR's REAL home page inside real devices:
            a laptop and a phone, both driven hero → footer. */}
        <div className="lv-drive lv-drive--real">
          <div className="lv-drive-sticky">
            <div className="lv-frame lv-drive-grid">
              <div className="lv-drive-stage lv-real-stage">
                <div className="lv-mac">
                  <div className="lv-mac-lid">
                    <span className="lv-mac-cam" aria-hidden="true" />
                    <div className="lv-mac-view">
                      <img
                        src={DSR.home.desktop.src}
                        width={DSR.home.desktop.w}
                        height={DSR.home.desktop.h}
                        loading="lazy"
                        decoding="async"
                        alt={DSR.home.desktop.alt}
                      />
                    </div>
                  </div>
                  <div className="lv-mac-base" aria-hidden="true">
                    <span className="lv-mac-notch" />
                  </div>
                </div>
                <div className="lv-cell">
                  <span className="lv-cell-island" aria-hidden="true" />
                  <div className="lv-cell-view">
                    <img
                      src={DSR.home.mobile.src}
                      width={DSR.home.mobile.w}
                      height={DSR.home.mobile.h}
                      loading="lazy"
                      decoding="async"
                      alt={DSR.home.mobile.alt}
                    />
                  </div>
                </div>
              </div>
              <div className="lv-drive-id">
                <p className="lv-client">{DSR.name}</p>
                <p className="lv-scope">{DSR.scope}</p>
                <p className="lv-cap">
                  {DSR.place} · {DSR.year} · {DSR.url} — the live home page, driven end to end
                </p>
                <Link className="lv-link lv-link--small" to={PORTFOLIO}>
                  View in portfolio
                  <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── HVN CrossFit — the dark cinema strip. ─────────────────── */}
        <div className="lv-show lv-show--hvn">
          <div className="lv-frame">
            <div className="lv-hvn-head">
              <div>
                <div className="lv-hvn-rule" aria-hidden="true" />
                <p className="lv-client">{HVN_SHOW.name}</p>
                <p className="lv-scope">{HVN_SHOW.scope}</p>
                <p className="lv-cap">
                  {HVN_SHOW.place} · {HVN_SHOW.year}
                </p>
              </div>
              <Link className="lv-link lv-link--small" to={PORTFOLIO}>
                View in portfolio
                <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="lv-hvn-viewport">
            <div className="lv-hvn-strip">
              {HVN_SHOW.frames.map((f) => (
                <div className="lv-hvn-frame" key={f.src}>
                  <img src={f.src} width={900} height={563} loading="lazy" decoding="async" alt={f.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tidy Gardens — its own vine, drawn by the scroll. ─────── */}
        <div className="lv-show lv-show--tidy">
          <div className="lv-frame lv-tidy-grid">
            <div className="lv-tidy-copy">
              <svg className="lv-tidy-vine" viewBox="0 0 40 600" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
                <path
                  className="lv-tidy-stem"
                  d="M20 592 C 13 528, 27 476, 20 408 C 14 350, 26 300, 20 236 C 15 180, 25 122, 19 58 C 17 38, 19 22, 21 8"
                />
                <path className="lv-tidy-leaf" d="M20 470 C 8 462, 4 448, 7 438 C 18 442, 22 456, 20 470 Z" fill="#4a7c43" stroke="none" />
                <path className="lv-tidy-leaf" d="M20 300 C 32 292, 36 278, 33 268 C 22 272, 18 286, 20 300 Z" fill="#4a7c43" stroke="none" />
                <path className="lv-tidy-leaf" d="M19 130 C 7 122, 3 108, 6 98 C 17 102, 21 116, 19 130 Z" fill="#4a7c43" stroke="none" />
              </svg>
              <p className="lv-client">{TIDY_SHOW.name}</p>
              <p className="lv-scope">{TIDY_SHOW.scope}</p>
              <p className="lv-cap">
                {TIDY_SHOW.place} · {TIDY_SHOW.year} · the vine is theirs — it grows down their site too
              </p>
              <Link className="lv-link lv-link--small" to={PORTFOLIO}>
                View in portfolio
                <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>
            <div className="lv-tidy-frames">
              {TIDY_SHOW.frames.map((f) => (
                <figure key={f.src}>
                  <img src={f.src} width={f.w} height={f.h} loading="lazy" decoding="async" alt={f.alt} />
                </figure>
              ))}
            </div>
          </div>
        </div>

        {/* ── Evidence Advisory — the evidence wall. ────────────────── */}
        <div className="lv-show lv-show--ea">
          <div className="lv-frame lv-ea-grid">
            <figure className="lv-ea-fig">
              <img src={EA_SHOW.img} width={EA_SHOW.w} height={EA_SHOW.h} loading="lazy" decoding="async" alt={EA_SHOW.alt} />
            </figure>
            <div>
              <p className="lv-client">{EA_SHOW.name}</p>
              <p className="lv-scope">{EA_SHOW.scope}</p>
              <p className="lv-cap">
                {EA_SHOW.place} · {EA_SHOW.year}
              </p>
              <ul className="lv-ea-tags">
                {EA_SHOW.tags.map((tag, i) => (
                  <li className="lv-ea-tag" key={tag}>
                    <span className="lv-ea-chip" aria-hidden="true">0{i + 1}</span>
                    {tag}
                  </li>
                ))}
              </ul>
              <Link className="lv-link lv-link--small" to={PORTFOLIO} style={{ marginTop: 22 }}>
                View in portfolio
                <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* The record — static frames, click-time FLIP case morphs. */}
        <div className="lv-frame">
          <div className="lv-cases">
            {CASES.map((c) => (
              <div className={`lv-case lv-case--${c.key}`} key={c.key} data-open={openCase === c.key || undefined}>
                <button
                  type="button"
                  className="lv-case-fig"
                  onClick={(e) => handleOpenCase(c.key, e)}
                  aria-haspopup="dialog"
                  aria-label={`Open the ${c.name} case panel`}
                >
                  <img
                    src={c.img}
                    width={c.w}
                    height={c.h}
                    loading="lazy"
                    decoding="async"
                    alt={c.alt}
                    data-flip-id={`case-${c.key}`}
                  />
                </button>
                <div className="lv-case-tb">
                  <span className="lv-cap">
                    {c.name} · {c.year}
                  </span>
                  <span className="lv-case-scope">{c.scope}</span>
                  <Link className="lv-link lv-link--small" to={PORTFOLIO}>
                    View in portfolio
                    <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case panel — the FLIP destination. */}
      {activeCase && (
        <div className="lv-panel-backdrop" onClick={handleCloseCase} role="presentation">
          <div
            className="lv-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeCase.name} — case detail`}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="lv-panel-close" onClick={handleCloseCase} aria-label="Close case panel">
              <X size={18} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <div className="lv-browser lv-panel-browser">
              <div className="lv-browser-bar" aria-hidden="true">
                <span className="lv-dot" />
                <span className="lv-dot" />
                <span className="lv-dot" />
              </div>
              <div className="lv-browser-view">
                <img
                  src={activeCase.img}
                  width={activeCase.w}
                  height={activeCase.h}
                  alt={activeCase.alt}
                  data-flip-id={`case-${activeCase.key}`}
                />
              </div>
            </div>
            <div className="lv-panel-copy">
              <p className="lv-client">{activeCase.name}</p>
              <p className="lv-scope">{activeCase.scope}</p>
              <p className="lv-cap">
                {activeCase.place} · {activeCase.year}
              </p>
              <Link className="lv-btn lv-btn--ghostline" to={PORTFOLIO}>
                View in portfolio
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ══ Concepts — built before any brief existed ═══════════════ */}
      <section className="lv-concepts" aria-labelledby="lv-concepts-h">
        <div className="lv-frame">
          <div className="lv-concepts-head">
            <div>
              <h2 className="lv-h2" id="lv-concepts-h">Concepts. Built before any brief existed.</h2>
              <p className="lv-sub">
                Five self-initiated builds, fully deployed — what the studio ships when
                nobody&rsquo;s asking. Drag the shelf; every face opens the real thing.
              </p>
            </div>
            <Link className="lv-link" to="/Portfolio?filter=concept">
              Browse all concepts
              <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <ConceptCarousel staticMode={staticMode} />
        <div className="lv-frame lv-concepts-foot">
          <p className="lv-cap">
            Barry&rsquo;s Drink · Wooster Core · JK Plumbing · VEER · IOPA Apparel — every one
            a live deployment, available to license or commission.
          </p>
        </div>
      </section>

      {/* ══ The rate card ═══════════════════════════════════════════ */}
      <section className="lv-rate">
        <div className="lv-frame">
          <div className="lv-rate-head">
            <div>
              <h2 className="lv-h2">Pick a starting point.</h2>
              <p className="lv-sub">Clear scope at every tier — pay once, or spread it monthly.</p>
            </div>
            <div className="lv-switch" role="group" aria-label="Billing option">
              <span className="lv-switch-thumb" data-pos={isMonthly ? 'b' : 'a'} aria-hidden="true" />
              <button type="button" aria-pressed={!isMonthly} onClick={() => setBilling('once')}>
                Pay once
              </button>
              <button type="button" aria-pressed={isMonthly} onClick={() => setBilling('monthly')}>
                Monthly
              </button>
            </div>
          </div>

          <div className={`lv-subnote${isMonthly ? ' is-open' : ''}`} aria-hidden={!isMonthly}>
            <div>
              <p>{monthlyNote}</p>
            </div>
          </div>

          {SECTIONS.map((section) => (
            <div className="lv-group" key={section.heading}>
              <header className="lv-group-head">
                <div className="lv-group-title">
                  <h3>{section.heading}</h3>
                  {section.guide && <span className="lv-range">{section.guide.range}</span>}
                </div>
                <p className="lv-group-desc">{section.description}</p>
                {section.guide && <p className="lv-group-guide">{section.guide.description}</p>}
              </header>

              <div className="lv-rows">
                {section.packages.map((pkg) => (
                  <article className="lv-line" key={pkg.key}>
                    <div className="lv-line-id">
                      <h4 className="lv-line-name">
                        {pkg.name}
                        {pkg.popular && <span className="lv-tag">Most specified</span>}
                      </h4>
                      <p className="lv-line-desc">{pkg.description}</p>
                    </div>
                    <ul className="lv-line-spec">
                      {pkg.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <div className="lv-line-buy">
                      <p className="lv-price">
                        <PriceOdometer
                          label={isMonthly && pkg.monthlyLabel ? pkg.monthlyLabel : pkg.priceLabel}
                          animate={!staticMode}
                        />
                      </p>
                      {pkg.monthlyLabel && (
                        <p className="lv-alt">
                          {isMonthly ? `or ${pkg.priceLabel} outright` : `or ${pkg.monthlyLabel}`}
                        </p>
                      )}
                      <p className="lv-tl">{TIMELINES[pkg.key]}</p>
                      <Link
                        className="lv-row-cta"
                        to={`${START}?service=web_design&package=${pkg.key}${
                          isMonthly ? '&pricing=subscription' : ''
                        }`}
                      >
                        Start this
                        <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}

          <aside className="lv-notes">
            <h3 className="lv-notes-h">General notes</h3>
            <div className="lv-notes-cols">
              {webScopeNotes.map((note) => (
                <div className="lv-note" key={note.title}>
                  <h4>{note.title}</h4>
                  <ul>
                    {note.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          <div className="lv-fine">
            <p>{ASTERISK_CLAUSE}</p>
            <p>{GST_NOTE}</p>
            <p>{INDUSTRY_SURCHARGE_NOTE}</p>
          </div>
        </div>
      </section>

      {/* ══ The process — four steps, one quiet row ═════════════════ */}
      <section className="lv-pipe">
        <div className="lv-frame">
          <h2 className="lv-h2">Brief to launch, one pipeline.</h2>
          <div className="lv-stages">
            {PROCESS.map((stage) => (
              <div className="lv-stage-item" key={stage.label}>
                <h3>{stage.label}</h3>
                <p>{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ The close — one committed red block ═════════════════════ */}
      <section className="lv-drench">
        <div className="lv-frame lv-drench-in">
          <h2 className="lv-h2 lv-drench-h">Ready to build something worth showing?</h2>
          <p className="lv-drench-sub">
            Send us a brief — we&rsquo;ll scope it, price it, and come back with a clear plan.
          </p>
          <Link className="lv-btn lv-btn--onred" to={`${START}?service=web_design`}>
            Start a project
            <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
