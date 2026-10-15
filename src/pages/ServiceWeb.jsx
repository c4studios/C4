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
 * Below the fold, GSAP (ScrollTrigger + CustomEase) drives the five
 * portfolio pieces (each a laptop and a phone whose screens scroll the
 * live site top to bottom on the piece's own transit), focus-in
 * entrances, the odometer rate card, and the magnetic primaries.
 * Everything arms inside gsap.matchMedia(); nothing arms under
 * prefers-reduced-motion or the Prerender UA (staticMode) — the DOM
 * default IS the finished state everywhere, so the prerender ships the
 * built page for free.
 *
 * The portfolio section, 15 Oct 2026. Caleb: only his best work, each
 * shown the way DS Racing was (the laptop and the phone), no mixed
 * tiles. DS Racing Karts, Evidence Advisory, Aqua-Safe Plumbing, HVN
 * CrossFit and Sharp Bricklaying, in his order. Every line about a site
 * comes from its caseStudyData.jsx entry. Four of them carry a print of
 * C4 Lens work from lensStudies.js; the credit says "with C4 Lens"
 * because Caleb doesn't want to take all the credit.
 *
 * Chrome: forced LIGHT page. `.lv-on-stage` (same marker class) pins
 * the page ground, the menu sheet and the footer to the light set for
 * the life of the page (guarded MutationObserver, cleanup restore —
 * house pattern). The nav bar stays ink, as on every page.
 * Styles: src/components/web-arm/web-arm.css (.lv-root).
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import useStaticMode from '@/hooks/useStaticMode';
import { useWasPrerendered } from '@/lib/hydration';
import { entitySchemas, serviceSchema, breadcrumbSchema } from '@/lib/schema';
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
import { getCaseStudy } from '../components/portfolio/caseStudyData';
import { tightFigure } from '@/components/c4/figure';
import '../components/web-arm/web-arm.css';

/* The device screens. Each is a scroll strip of the live home page, shot
   on 15 Oct 2026 by scripts/capture-motion.mjs (installed Chrome, cookie
   banners declined, floating widgets hidden; DS Racing stitched so its
   history photos stay in), then reduced for the screens: desktop 1440 ->
   960 wide (six screens of the page), phone 390 @2x -> 400 wide (seven
   screens). AVIF first, WebP behind it. */
import dsrDAvif from '../components/web-arm/assets/wk-dsr-d.avif';
import dsrD from '../components/web-arm/assets/wk-dsr-d.webp';
import dsrMAvif from '../components/web-arm/assets/wk-dsr-m.avif';
import dsrM from '../components/web-arm/assets/wk-dsr-m.webp';
import eaDAvif from '../components/web-arm/assets/wk-ea-d.avif';
import eaD from '../components/web-arm/assets/wk-ea-d.webp';
import eaMAvif from '../components/web-arm/assets/wk-ea-m.avif';
import eaM from '../components/web-arm/assets/wk-ea-m.webp';
import aquaDAvif from '../components/web-arm/assets/wk-aqua-d.avif';
import aquaD from '../components/web-arm/assets/wk-aqua-d.webp';
import aquaMAvif from '../components/web-arm/assets/wk-aqua-m.avif';
import aquaM from '../components/web-arm/assets/wk-aqua-m.webp';
import hvnDAvif from '../components/web-arm/assets/wk-hvn-d.avif';
import hvnD from '../components/web-arm/assets/wk-hvn-d.webp';
import hvnMAvif from '../components/web-arm/assets/wk-hvn-m.avif';
import hvnM from '../components/web-arm/assets/wk-hvn-m.webp';
import sharpDAvif from '../components/web-arm/assets/wk-sharp-d.avif';
import sharpD from '../components/web-arm/assets/wk-sharp-d.webp';
import sharpMAvif from '../components/web-arm/assets/wk-sharp-m.avif';
import sharpM from '../components/web-arm/assets/wk-sharp-m.webp';

gsap.registerPlugin(ScrollTrigger, CustomEase);

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

/* ── The work ──────────────────────────────────────────────────────
   Caleb's five, in his order (15 Oct 2026). The name, the one-line
   scope, the year and the live address come from each site's
   caseStudyData.jsx entry, so the copy can't drift from the portfolio.
   `place` is the short form of the entry's location. `lens` is a print
   of C4 Lens work for that client, from lensStudies.js and the files
   it lists under public/; Evidence Advisory has none. */
const LENS_CREDIT = 'Photography and videography with';

const WORK = [
  {
    slug: 'ds-racing-karts',
    key: 'dsr',
    place: 'Woodbine, NSW',
    desktop: { avif: dsrDAvif, webp: dsrD, w: 960, h: 3600 },
    mobile: { avif: dsrMAvif, webp: dsrM, w: 400, h: 6059 },
    lens: {
      src: '/lens-motion/dsr-header-desktop.webp',
      w: 1280,
      h: 720,
      alt: 'The DSR logo over red and blue streaks of light, a frame from the film at the top of their home page.',
      caption: 'A frame from the film at the top of their home page.',
    },
  },
  {
    slug: 'evidence-advisory',
    key: 'ea',
    place: 'Perth, WA',
    desktop: { avif: eaDAvif, webp: eaD, w: 960, h: 3600 },
    mobile: { avif: eaMAvif, webp: eaM, w: 400, h: 6059 },
    lens: null,
  },
  {
    slug: 'aqua-safe-plumbing',
    key: 'aqua',
    place: 'Perth, WA',
    /* Shot on the plumbing panel of the hero and ended where the page's
       water filtration section starts: filtration is NextGen Water Systems'
       until that launches (Caleb, 15 Oct 2026: "should just be the plumbing
       until next gen launches"). */
    desktop: { avif: aquaDAvif, webp: aquaD, w: 960, h: 2216 },
    mobile: { avif: aquaMAvif, webp: aquaM, w: 400, h: 4388 },
    lens: {
      src: '/lens-motion/aquasafe-promo-16x9.webp',
      w: 1920,
      h: 1080,
      alt: 'A chrome pipe on a dark tiled wall with one drop falling, beside the words “It always starts small.”',
      caption: 'A frame from their promo film, which is made from their own site.',
    },
  },
  {
    slug: 'hvn-gym',
    key: 'hvn',
    place: 'Port Kennedy & South Fremantle, WA',
    desktop: { avif: hvnDAvif, webp: hvnD, w: 960, h: 3411 },
    mobile: { avif: hvnMAvif, webp: hvnM, w: 400, h: 6059 },
    lens: {
      base: '/lens-work/hvn/coach-b',
      widths: [360, 720],
      w: 1250,
      h: 1563,
      focus: '50% 22%',
      alt: 'An HVN coach smiling, arms folded, in the black team shirt.',
      caption: 'One of the coach portraits on their About page.',
    },
  },
  {
    slug: 'sharp-bricklaying',
    key: 'sharp',
    place: 'Perth, WA',
    desktop: { avif: sharpDAvif, webp: sharpD, w: 960, h: 3600 },
    mobile: { avif: sharpMAvif, webp: sharpM, w: 400, h: 6059 },
    lens: {
      base: '/lens-work/sharp/aerial-oblique',
      widths: [640, 1280],
      w: 2048,
      h: 1152,
      alt: 'A brick house shell from the air, walls up, late sun throwing long shadows.',
      caption: 'One of the aerials of their jobs in the site’s gallery.',
    },
  },
].map((w) => {
  const study = getCaseStudy(w.slug);
  return {
    ...w,
    name: study.name,
    scope: study.oneLiner,
    year: study.year,
    live: study.liveUrl,
    host: study.liveUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
    caseStudy: `/CaseStudy/${w.slug}`,
  };
});

/* A print of C4 Lens work: one still, srcset where the Lens page keeps
   several widths, a plain WebP where it keeps one (the film frames). */
function LensPrint({ lens, client }) {
  const img = lens.base ? (
    <picture>
      <source
        type="image/avif"
        srcSet={lens.widths.map((x) => `${lens.base}-${x}.avif ${x}w`).join(', ')}
        sizes="(min-width: 900px) 300px, 60vw"
      />
      <img
        src={`${lens.base}-${lens.widths[0]}.webp`}
        srcSet={lens.widths.map((x) => `${lens.base}-${x}.webp ${x}w`).join(', ')}
        sizes="(min-width: 900px) 300px, 60vw"
        width={lens.w}
        height={lens.h}
        loading="lazy"
        decoding="async"
        alt={lens.alt}
        style={lens.focus ? { objectPosition: lens.focus } : undefined}
      />
    </picture>
  ) : (
    <img src={lens.src} width={lens.w} height={lens.h} loading="lazy" decoding="async" alt={lens.alt} />
  );
  return (
    <figure className="lv-print">
      <div className="lv-print-photo">{img}</div>
      <figcaption>
        {lens.caption}{' '}
        <span className="lv-print-credit">
          {LENS_CREDIT}{' '}
          <Link to="/Lens" aria-label={`C4 Lens, which worked on ${client}’s photography and videography`}>
            C4 Lens
          </Link>
          .
        </span>
      </figcaption>
    </figure>
  );
}

/* Sections zipped with their pricing guides (parallel arrays in
   pricing.js — base / ecommerce / apps). */
const SECTIONS = webPackageSections.map((section, i) => ({
  ...section,
  guide: webPricingGuides[i],
}));

/* Stable module-level ref so the head hook doesn't re-run each render. The
   service names its provider by @id, so the business ships with it. */
const WEB_JSONLD = [
  ...entitySchemas(),
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

  if (!m) return <span className="lv-price-text">{tightFigure(label)}</span>;
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
            /* B612 gives the comma a full cell, so "$1,500" read as
               "$1, 500"; .c4-comma (marks.css) pulls it in. */
            <span className={ch === ',' ? 'lv-odo-fix c4-comma' : 'lv-odo-fix'} key={i}>
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
   `.lv-on-stage` (marker class unchanged) pins the --c4-* set LIGHT
   (web-arm.css) for the life of the page, all but the nav bar, which
   stays ink. ThemeProvider
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

  const [billing, setBilling] = useState('once');
  const isMonthly = billing === 'monthly';

  /* Static for the prerenderer, reduced motion, and a prerendered page while
     it hydrates (useStaticMode). The page arms a moment after that, over
     content already on screen, so nothing the visitor can see is hidden to
     play its arrival (onScreen below). */
  const staticMode = useStaticMode();
  const prerendered = useWasPrerendered();

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
        /* Pointer-listener cleanups (magnetic CTAs, the EA torch). */
        const magnetCleanups = [];

        /* Already in view on a page that arrived prerendered: leave it be. */
        const seen = (el) => prerendered && Boolean(el) && el.getBoundingClientRect().top < window.innerHeight;

        /* Quiet one-shot arrival: a short rise, nothing theatrical. */
        const rise = (el, vars = {}) => {
          if (seen(vars.trigger || el)) return;
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

        /* ── The work — each piece arrives, then its two screens scroll
           the live site top to bottom across the piece's own transit.
           No pin: five pinned drives would be thirteen screens of
           scrolling. The phone starts a beat later than the laptop, so
           the two reads feel like two people browsing, not one. */
        q('.lv-work').forEach((work) => {
          const stage = work.querySelector('.lv-work-stage');
          if (stage && !seen(work)) {
            gsap.fromTo(
              stage,
              { scale: 0.975, filter: 'blur(3px)' },
              {
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: 'power2.out',
                clearProps: 'filter,transform',
                scrollTrigger: { trigger: work, start: 'top 88%', once: true },
              },
            );
          }
          const id = work.querySelector('.lv-work-id');
          if (id) rise(id, { trigger: work, start: 'top 80%' });
          [
            ['.lv-mac-view', desk ? 'top 82%' : 'top 88%'],
            ['.lv-cell-view', desk ? 'top 70%' : 'top 80%'],
          ].forEach(([viewSel, start]) => {
            const view = work.querySelector(viewSel);
            const img = view && view.querySelector('img');
            if (!img) return;
            gsap.to(img, {
              y: () => -Math.max(0, img.offsetHeight - view.clientHeight),
              ease: 'none',
              scrollTrigger: {
                trigger: work,
                start,
                end: 'bottom 12%',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            });
          });
        });

        /* Decode the screens just ahead of their entrance so the first
           scrubbed frame never janks. */
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
        q('.lv-work-stage').forEach((el) => decodeIO.observe(el));

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

  /* Smooth-jump to the rate card (Lenis owns scroll when armed). */
  const skipToPricing = () => {
    const target = document.getElementById('lv-pricing');
    if (!target) return;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(target, { offset: -12 });
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
            <button type="button" className="lv-skip" onClick={skipToPricing}>
              Skip to pricing &amp; packages
              <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" style={{ transform: 'rotate(90deg)' }} />
            </button>
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

      {/* ══ The work — five sites, one way of showing them ═════════ */}
      <section className="lv-reel" aria-labelledby="lv-reel-h">
        <div className="lv-frame">
          <div className="lv-reel-head">
            <div>
              <h2 className="lv-h2" id="lv-reel-h">Live sites, browsing themselves.</h2>
              <p className="lv-sub">
                Five client sites as they stand today. Each one scrolls itself, top to
                bottom, as you go past.
              </p>
            </div>
            <Link className="lv-link" to={PORTFOLIO}>
              Full portfolio
              <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="lv-frame lv-works">
          {WORK.map((w) => (
            <article className={`lv-work lv-work--${w.key}`} key={w.key} aria-labelledby={`lv-work-${w.key}`}>
              <div className="lv-work-stage lv-real-stage">
                <div className="lv-mac">
                  <div className="lv-mac-lid">
                    <span className="lv-mac-cam" aria-hidden="true" />
                    <div className="lv-mac-view">
                      <picture>
                        <source type="image/avif" srcSet={w.desktop.avif} />
                        <img
                          src={w.desktop.webp}
                          width={w.desktop.w}
                          height={w.desktop.h}
                          loading="lazy"
                          decoding="async"
                          alt={`${w.name}, the live home page on a laptop, top to bottom.`}
                        />
                      </picture>
                    </div>
                  </div>
                  <div className="lv-mac-base" aria-hidden="true">
                    <span className="lv-mac-notch" />
                  </div>
                </div>
                <div className="lv-cell">
                  <span className="lv-cell-island" aria-hidden="true" />
                  <div className="lv-cell-view">
                    <picture>
                      <source type="image/avif" srcSet={w.mobile.avif} />
                      <img
                        src={w.mobile.webp}
                        width={w.mobile.w}
                        height={w.mobile.h}
                        loading="lazy"
                        decoding="async"
                        alt={`${w.name} on a phone, the same build laid out for a small screen.`}
                      />
                    </picture>
                  </div>
                </div>
              </div>

              <div className="lv-work-id">
                <h3 className="lv-client" id={`lv-work-${w.key}`}>
                  {w.name}
                </h3>
                <p className="lv-scope">{w.scope}</p>
                <p className="lv-cap">
                  {w.place} · {w.year} · {w.host}
                </p>
                <div className="lv-work-links">
                  <Link className="lv-link lv-link--small" to={w.caseStudy}>
                    Case study
                    <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
                  </Link>
                  <a
                    className="lv-link lv-link--small"
                    href={w.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open the live ${w.name} site in a new tab`}
                  >
                    Live site
                    <ArrowUpRight size={12} strokeWidth={2.5} aria-hidden="true" />
                  </a>
                </div>
                {w.lens && <LensPrint lens={w.lens} client={w.name} />}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ══ Concepts — built before any brief existed ═══════════════ */}
      <section className="lv-concepts" aria-labelledby="lv-concepts-h">
        <div className="lv-frame">
          <div className="lv-concepts-head">
            <div>
              <h2 className="lv-h2" id="lv-concepts-h">Concepts. Built before any brief existed.</h2>
              <p className="lv-sub">
                Five self-initiated builds, each one live. Nobody asked for these, so they
                show what we make when we set the brief. Drag the shelf to turn it.
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
          <p className="lv-concepts-note">
            None of these was commissioned by the business it imagines. Each one is live
            at its own address.
          </p>
        </div>
      </section>

      {/* ══ The rate card ═══════════════════════════════════════════ */}
      <section className="lv-rate" id="lv-pricing">
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

          {/* The two ways to pay — always visible, honestly compared.
              The switch and these cards mirror each other. */}
          <div className="lv-paywise" data-mode={isMonthly ? 'monthly' : 'once'}>
            <button
              type="button"
              className="lv-payway lv-payway--once"
              aria-pressed={!isMonthly}
              onClick={() => setBilling('once')}
            >
              <span className="lv-payway-head">
                <b>Pay once</b>
                <span className="lv-payway-badge" aria-hidden="true">{isMonthly ? '' : 'Selected'}</span>
              </span>
              <ul>
                <li>One payment — the lowest total cost of the two.</li>
                <li>Full code and account handover at launch. You own it all from day one.</li>
                <li>No ongoing commitment — hosting and support plans are optional add-ons.</li>
              </ul>
            </button>
            <button
              type="button"
              className="lv-payway lv-payway--monthly"
              aria-pressed={isMonthly}
              onClick={() => setBilling('monthly')}
            >
              <span className="lv-payway-head">
                <b>Monthly</b>
                <span className="lv-payway-badge" aria-hidden="true">{isMonthly ? 'Selected' : ''}</span>
              </span>
              <ul>
                <li>{subscriptionInfo.howItWorks}</li>
                <li>Included while you pay: {subscriptionInfo.whatsIncluded}</li>
                <li>{subscriptionInfo.ownership}</li>
                <li>{subscriptionInfo.cancellation}</li>
              </ul>
            </button>
          </div>

          {SECTIONS.map((section) => (
            <div className="lv-group" key={section.heading}>
              <header className="lv-group-head">
                <div className="lv-group-title">
                  <h3>{section.heading}</h3>
                  {section.guide && <span className="lv-range">{tightFigure(section.guide.range)}</span>}
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
