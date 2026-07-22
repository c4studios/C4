/* ─────────────────────────────────────────────────────────────────
   FOLD 2 — THE SHIPPING WALL

   Claim: "Shipped, live, and in production." Artifact: a rail of
   framed client sites — static hero captures only (the self-browsing
   inner pan and the FLIP morph belong to /ServiceWeb, by memo law).
   Vertical scroll scrubs the rail sideways (single-mapped); Lenis-free
   velocity skew rides the plates and is provably dead-still at rest.
   The ten truthful SocialProof items survive verbatim as manifest
   stamps between the frames, set in plain Geist. The featured case
   (crossfade/scale on hover, never FLIP) leads at double width.

   Static end-state / mobile: the same DOM stacks vertically — every
   frame, stamp and link visible with zero pins, zero ScrollTriggers.
   ───────────────────────────────────────────────────────────────── */
import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { getAllCaseStudies } from '../portfolio/caseStudyData';
import { gsap, revealHeading, useStaticMode } from './homeMotion';

import railEvidence from './assets/rail-evidence.webp';
import railHvn from './assets/rail-hvn.webp';
import railTidy from './assets/rail-tidy.webp';
import railJurassic from './assets/rail-jurassic.webp';
import railGroverz from './assets/rail-groverz.webp';
import railFreo from './assets/rail-freo.webp';

/* The ten truthful signals — verbatim from the retired marquee.
   No autoplay survives; they sit dead-still unless you scroll. */
const ITEMS = [
  '50+ Perth businesses served',
  '6 software products shipped',
  'Founder-led — you brief the builder',
  'Full code ownership, always',
  'Reply within 1 business day',
  'Quotr · live & in production',
  'DS Racing Karts · brand films',
  'HVN · drone & full-show edit',
  'Transform Fremantle · website',
  'Est. 2022 · Perth, W.A.',
];

const PLATES = [
  {
    id: 'hvn',
    src: railHvn,
    alt: 'HVN CrossFit website hero — cinematic gym site for Port Kennedy',
    caption: 'HVN CROSSFIT · SHIPPED · thehvncrossfit.com',
  },
  {
    id: 'tidy',
    src: railTidy,
    alt: 'Tidy Gardens Australia website hero — motion-led site for a Perth garden business',
    caption: 'TIDY GARDENS · SHIPPED · tidygardens.com.au',
  },
  {
    id: 'jurassic',
    src: railJurassic,
    alt: 'Jurassic PT website hero — conversion-focused fitness studio site',
    caption: 'JURASSIC PT · SHIPPED · jurassicpt.com',
  },
  {
    id: 'groverz',
    src: railGroverz,
    alt: 'Groverz Tax & Accounting website hero with interactive refund estimator',
    caption: 'GROVERZ TAX · SHIPPED · groverztax.com.au',
  },
  {
    id: 'freo',
    src: railFreo,
    alt: 'Transform Fremantle community platform hero',
    caption: 'TRANSFORM FREMANTLE · SHIPPED · transformfreo.com',
  },
];

function StampCol({ items }) {
  return (
    <div className="hm-stampcol">
      {items.map((item) => (
        <p key={item} className="hm-stamp">{item}</p>
      ))}
    </div>
  );
}

function Plate({ plate }) {
  return (
    <Link to={createPageUrl('Portfolio')} className="hm-plate" data-proof data-visit>
      <img src={plate.src} alt={plate.alt} loading="lazy" decoding="async" width="900" height="563" />
      <span className="hm-cap">{plate.caption}</span>
    </Link>
  );
}

export default function ShippingWall() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const railRef = useRef(null);
  const h2Ref = useRef(null);
  const visitRef = useRef(null);
  const staticMode = useStaticMode();

  const studies = getAllCaseStudies();
  // Pinned to the study whose capture ships as rail-evidence.webp — the
  // image, alt and case link must never diverge if another study gains
  // the `featured` flag later.
  const featured =
    studies.find((study) => study.slug === 'evidence-advisory') ||
    studies.find((study) => study.featured) ||
    studies[0];

  useLayoutEffect(() => {
    if (staticMode) return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* Desktop: pin + scrub the rail; velocity skew on plates only. */
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const wrap = wrapRef.current;
        const rail = railRef.current;
        if (!wrap || !rail) return undefined;

        rail.style.setProperty('--hm-skew', '0deg');
        const skewTo = gsap.quickTo(rail, '--hm-skew', { duration: 0.35, ease: 'power3.out' });
        let idleTimer = 0;

        const getDist = () => Math.max(0, rail.scrollWidth - wrap.clientWidth);

        const tween = gsap.to(rail, {
          x: () => -getDist(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDist()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              skewTo(gsap.utils.clamp(-3.5, 3.5, self.getVelocity() / -280));
              window.clearTimeout(idleTimer);
              idleTimer = window.setTimeout(() => skewTo(0), 140);
            },
          },
        });

        return () => {
          window.clearTimeout(idleTimer);
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      /* VISIT → affordance: a chip that follows the pointer over the
         plates. The native cursor stays visible (memo #14). */
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const chip = visitRef.current;
        if (!chip) return undefined;
        gsap.set(chip, { xPercent: -50, yPercent: -160, autoAlpha: 0, scale: 0.85 });
        const xTo = gsap.quickTo(chip, 'x', { duration: 0.28, ease: 'power3.out' });
        const yTo = gsap.quickTo(chip, 'y', { duration: 0.28, ease: 'power3.out' });
        const move = (e) => { xTo(e.clientX); yTo(e.clientY); };
        const show = () => gsap.to(chip, { autoAlpha: 1, scale: 1, duration: 0.25, overwrite: 'auto' });
        const hide = () => gsap.to(chip, { autoAlpha: 0, scale: 0.85, duration: 0.25, overwrite: 'auto' });

        const targets = section.querySelectorAll('[data-visit]');
        section.addEventListener('pointermove', move);
        targets.forEach((t) => {
          t.addEventListener('pointerenter', show);
          t.addEventListener('pointerleave', hide);
        });
        return () => {
          section.removeEventListener('pointermove', move);
          targets.forEach((t) => {
            t.removeEventListener('pointerenter', show);
            t.removeEventListener('pointerleave', hide);
          });
        };
      });

      revealHeading(h2Ref.current);
    }, section);

    return () => ctx.revert();
  }, [staticMode]);

  return (
    <section
      ref={sectionRef}
      className={`hm-ship${staticMode ? ' hm-static' : ''}`}
      aria-labelledby="hm-ship-heading"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 pt-16 md:px-12 md:pt-20">
        <div className="flex flex-col gap-4 pb-10 md:flex-row md:items-end md:justify-between md:pb-12">
          <div className="max-w-[640px]">
            <h2 id="hm-ship-heading" ref={h2Ref} className="hm-h2 text-[clamp(1.7rem,3.4vw,2.7rem)]">
              Shipped, live, and in production.
            </h2>
            <p className="hm-sub mt-4 max-w-[520px]">
              A closer look at the work and the decisions behind it.
            </p>
          </div>
          <Link
            to={createPageUrl('Portfolio')}
            className="hm-textlink group hidden md:inline-flex"
          >
            See all work
            <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div ref={wrapRef} className="hm-railwrap pb-16 md:pb-20">
        <div ref={railRef} className="hm-rail">
          {/* Featured case — expands via crossfade/scale, never FLIP */}
          {featured && (
            <Link
              to={createPageUrl(`CaseStudy?slug=${featured.slug}`)}
              className="hm-plate hm-plate--featured"
              data-proof
              data-visit
            >
              <div className="hm-feat-media">
                <img
                  src={railEvidence}
                  alt={`${featured.name} website hero — live site capture`}
                  loading="lazy"
                  decoding="async"
                  width="1080"
                  height="675"
                />
              </div>
              <div className="hm-feat-info">
                <p className="hm-label">Recent work</p>
                <p className="hm-cap mt-2">Featured</p>
                <h3 className="hm-feat-name mt-2">{featured.name}</h3>
                <p className="hm-feat-line">{featured.oneLiner}</p>
                <p className="mt-3 flex flex-wrap items-center gap-2">
                  {featured.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[2px] px-2 py-[3px] text-[9px] font-medium uppercase tracking-[0.1em]"
                      style={{ color: 'var(--hm-ink2)', backgroundColor: 'var(--c4-tag-bg)' }}
                    >
                      {tag}
                    </span>
                  ))}
                  {featured.year && (
                    <span className="text-[9px] font-medium uppercase tracking-[0.1em]" style={{ color: 'var(--hm-ink2)' }}>
                      | {featured.year}
                    </span>
                  )}
                </p>
                <p className="mt-auto flex items-center gap-4 pt-4">
                  <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: 'var(--c4-text)' }}>
                    View case study
                    <ArrowRight size={12} strokeWidth={2} />
                  </span>
                  {featured.liveUrl && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.1em]" style={{ color: 'var(--hm-ink2)' }}>
                      Live site
                      <ArrowUpRight size={11} strokeWidth={2} />
                    </span>
                  )}
                </p>
              </div>
            </Link>
          )}

          <StampCol items={ITEMS.slice(0, 3)} />
          <Plate plate={PLATES[0]} />
          <Plate plate={PLATES[1]} />
          <StampCol items={ITEMS.slice(3, 6)} />
          <Plate plate={PLATES[2]} />
          <StampCol items={ITEMS.slice(6, 8)} />
          <Plate plate={PLATES[3]} />
          <Plate plate={PLATES[4]} />
          <StampCol items={ITEMS.slice(8, 10)} />

          {/* Rail end — the paths out, plus the fold's one red object */}
          <div className="hm-endcap">
            <p className="hm-label">Portfolio</p>
            <Link to={createPageUrl('Portfolio')} className="hm-textlink group">
              See all work
              <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link to={`${createPageUrl('Portfolio')}?filter=ai`} className="hm-textlink group">
              View AI &amp; Software
              <ArrowRight size={12} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link to="/start" className="hm-startchip mt-3 self-start">
              Start yours
              <ArrowRight size={12} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>

      {/* VISIT → pointer chip (decorative; native cursor untouched) */}
      <div ref={visitRef} className="hm-visit" aria-hidden="true">
        Visit →
      </div>
    </section>
  );
}
