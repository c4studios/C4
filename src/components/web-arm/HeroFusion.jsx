/**
 * HeroFusion — the ContainerScroll tilt-card and the HeroParallax
 * (both 21st.dev references, client-supplied) fused into one continuous
 * camera move:
 *
 *   1 · An iPad floats tilted back (rotateX 24° under perspective),
 *       and its screen is ALIVE — a miniature of the studio's entire
 *       portfolio drifting in three parallax rows. No stepped stills:
 *       the screen content is live DOM, so every scroll position is a
 *       unique frame (the old capture-stepping is retired).
 *   2 · Scrolling straightens the device to upright — the original
 *       ContainerScroll move, kept.
 *   3 · The POV then travels INTO the screen: the screen's clip mask
 *       expands to the full viewport while the mini rows scale to
 *       life-size and the bezel flies past the camera.
 *   4 · Inside, the rows settle (HeroParallax's rotateX easing) and the
 *       page continues — everything after lives "inside the iPad".
 *
 * Implementation notes:
 *   · One spring-smoothed scroll progress drives every transform.
 *   · The screen rect is measured (ResizeObserver) and expressed as
 *     inset percentages of the sticky viewport, so the clip-path and
 *     the bezel stay registered at every viewport size.
 *   · clip-path lives on an UNtransformed layer (viewport-registered);
 *     the content scale lives on an inner layer — clip applies before
 *     transform, so they must be separated to stay aligned.
 *   · staticMode (prerender / prefers-reduced-motion): no motion styles
 *     at all; CSS [data-static] lays the rows out full-bleed and hides
 *     the bezel — the DOM default IS the end state.
 */
import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

import plxDsr from './assets/plx-dsr.webp';
import plxEvidence from './assets/plx-evidence.webp';
import plxTidy from './assets/plx-tidy.webp';
import plxHvn from './assets/plx-hvn.webp';
import plxSharp from './assets/plx-sharp.webp';
import plxGroverz from './assets/plx-groverz.webp';
import plxRocks from './assets/plx-rocks.webp';
import plxJurassic from './assets/plx-jurassic.webp';
import plxGocc from './assets/plx-gocc.webp';
import plxFreo from './assets/plx-freo.webp';
import plxHakea from './assets/plx-hakea.webp';
import plxPeople from './assets/plx-people.webp';
import plxQuotr from './assets/plx-quotr.webp';
import plxReturndesk from './assets/plx-returndesk.webp';
import plxBarrys from './assets/plx-barrys.webp';

/* The entire shipped record, three rows of five. Row order puts the
   flagship builds on the marquee row. */
const ROWS = [
  [
    { slug: 'ds-racing-karts', name: 'DS Racing Karts', img: plxDsr, alt: 'DS Racing Karts — ecommerce platform' },
    { slug: 'evidence-advisory', name: 'Evidence Advisory', img: plxEvidence, alt: 'Evidence Advisory — digital forensics brand site' },
    { slug: 'tidy-gardens-australia', name: 'Tidy Gardens Australia', img: plxTidy, alt: 'Tidy Gardens Australia — garden care website' },
    { slug: 'hvn-gym', name: 'HVN CrossFit', img: plxHvn, alt: 'HVN CrossFit — cinematic gym website' },
    { slug: 'sharp-bricklaying', name: 'Sharp Bricklaying', img: plxSharp, alt: 'Sharp Bricklaying — premium trade website' },
  ],
  [
    { slug: 'groverz-tax', name: 'Groverz Tax & Accounting', img: plxGroverz, alt: 'Groverz Tax & Accounting — practice website' },
    { slug: 'rocksstream', name: 'The Rocks: At the Movies', img: plxRocks, alt: 'The Rocks: At the Movies Series — streaming-style pre-service experience' },
    { slug: 'jurassic-pt', name: 'Jurassic PT', img: plxJurassic, alt: 'Jurassic PT — fitness studio website' },
    { slug: 'gocc', name: 'GoCC', img: plxGocc, alt: 'GoCC — coaching practice platform' },
    { slug: 'transform-fremantle', name: 'Transform Fremantle', img: plxFreo, alt: 'Transform Fremantle — movement website' },
  ],
  [
    { slug: 'transform-hakea', name: 'Transform Hakea', img: plxHakea, alt: 'Transform Hakea — outreach website' },
    { slug: 'people-power', name: 'People Power', img: plxPeople, alt: 'People Power — social platform web app' },
    { slug: 'quotr', name: 'Quotr', img: plxQuotr, alt: 'Quotr — SaaS quoting product' },
    { slug: 'returndesk', name: 'ReturnDesk', img: plxReturndesk, alt: 'ReturnDesk — priority inbox SaaS' },
    { slug: 'barrys-drink', name: "Barry's Drink", img: plxBarrys, alt: "Barry's Drink — concept brand site" },
  ],
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const seg = (v, a, b) => clamp01((v - a) / (b - a));
const smooth = (t) => t * t * (3 - 2 * t);

export default function HeroFusion({ header, staticMode = false }) {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const bezelRef = useRef(null);
  /* Screen rect as % insets of the sticky viewport; sane defaults until
     the first measure lands. `mini` is the content scale that makes the
     full-viewport rows read as a screenful inside the bezel. */
  const rectRef = useRef({ t: 20, r: 16, b: 20, l: 16, rad: 22, cx: 50, cy: 50, mini: 0.44 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 150, damping: 30, mass: 0.35 });
  /* Bumped after every measure so rect-dependent transforms re-fire
     even before the first scroll tick (clip must match the measured
     bezel from frame one). */
  const measured = useMotionValue(0);

  useLayoutEffect(() => {
    if (staticMode) return undefined;
    const measure = () => {
      const sticky = stickyRef.current;
      const bezel = bezelRef.current;
      if (!sticky || !bezel) return;
      const sr = sticky.getBoundingClientRect();
      if (!sr.width || !sr.height) return;
      /* The chassis ring is a border (so the bezel never paints over the
         live screen); the screen rect is the bezel's content box. */
      const cs = getComputedStyle(bezel);
      const pt = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.paddingTop) || 0);
      const pl = (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.paddingLeft) || 0);
      const pr = (parseFloat(cs.borderRightWidth) || 0) + (parseFloat(cs.paddingRight) || 0);
      const pb = (parseFloat(cs.borderBottomWidth) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const br = bezel.getBoundingClientRect();
      const sx = br.left - sr.left + pl;
      const sy = br.top - sr.top + pt;
      const sw = br.width - pl - pr;
      const sh = br.height - pt - pb;
      if (sw <= 0 || sh <= 0) return;
      rectRef.current = {
        t: (sy / sr.height) * 100,
        l: (sx / sr.width) * 100,
        b: ((sr.height - (sy + sh)) / sr.height) * 100,
        r: ((sr.width - (sx + sw)) / sr.width) * 100,
        rad: Math.max(12, Math.min(26, sw * 0.018)),
        cx: ((sx + sw / 2) / sr.width) * 100,
        cy: ((sy + sh / 2) / sr.height) * 100,
        mini: Math.max(0.3, Math.min(0.52, (sw / sr.width) * 0.94)),
      };
      measured.set(measured.get() + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stickyRef.current) ro.observe(stickyRef.current);
    if (bezelRef.current) ro.observe(bezelRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [staticMode]);

  /* ── The camera move ─────────────────────────────────────────────
     0.00–0.46  device straightens 24° → 0 and settles to scale 1
     0.50–0.84  the dive: clip mask → viewport, mini rows → life-size
     0.62–0.88  bezel fades + flies past
     0.84–1.00  rows' own plane settles 8° → 0; caption arrives     */
  const rotateX = useTransform(p, (v) => 24 * (1 - smooth(seg(v, 0.04, 0.46))));
  const stageScale = useTransform(p, (v) => 0.965 + 0.035 * smooth(seg(v, 0, 0.46)));
  const stageY = useTransform(p, (v) => 16 * (1 - smooth(seg(v, 0, 0.46))));
  const clipPath = useTransform([p, measured], ([v]) => {
    const r0 = rectRef.current;
    const d = smooth(seg(v, 0.5, 0.84));
    return `inset(${(r0.t * (1 - d)).toFixed(3)}% ${(r0.r * (1 - d)).toFixed(3)}% ${(r0.b * (1 - d)).toFixed(3)}% ${(r0.l * (1 - d)).toFixed(3)}% round ${(r0.rad * (1 - d)).toFixed(2)}px)`;
  });
  const rowsScale = useTransform([p, measured], ([v]) => {
    const { mini } = rectRef.current;
    return mini + (1 - mini) * smooth(seg(v, 0.5, 0.84));
  });
  const rowsOrigin = useTransform([p, measured], ([v]) => {
    const r0 = rectRef.current;
    const d = smooth(seg(v, 0.5, 0.84));
    return `${(r0.cx + (50 - r0.cx) * d).toFixed(2)}% ${(r0.cy + (50 - r0.cy) * d).toFixed(2)}%`;
  });
  const rowsTilt = useTransform(p, (v) => 8 * (1 - smooth(seg(v, 0.84, 1))));
  const bezelOpacity = useTransform(p, (v) => 1 - smooth(seg(v, 0.62, 0.88)));
  const bezelScale = useTransform(p, (v) => 1 + 0.18 * smooth(seg(v, 0.5, 0.9)));
  const capOpacity = useTransform(p, (v) => smooth(seg(v, 0.88, 0.98)));

  /* Continuous row drift — every scroll position is a unique frame. */
  const row0X = useTransform(p, [0, 1], ['5%', '-11%']);
  const row1X = useTransform(p, [0, 1], ['-9%', '8%']);
  const row2X = useTransform(p, [0, 1], ['4%', '-8%']);
  const rowX = [row0X, row1X, row2X];

  return (
    <section className="lv-fusion" ref={sectionRef} data-static={staticMode || undefined}>
      <div className="lv-fusion-head lv-frame">{header}</div>

      <div className="lv-fusion-pin">
        <div className="lv-fusion-sticky" ref={stickyRef}>
          <motion.div
            className="lv-fusion-stage"
            style={staticMode ? undefined : { rotateX, scale: stageScale, y: stageY }}
          >
            {/* Clip layer — viewport-registered, never transformed. */}
            <motion.div className="lv-fusion-view" style={staticMode ? undefined : { clipPath }}>
              <motion.div
                className="lv-fusion-rows"
                style={
                  staticMode
                    ? undefined
                    : { scale: rowsScale, transformOrigin: rowsOrigin, rotateX: rowsTilt }
                }
              >
                {ROWS.map((row, ri) => (
                  <motion.div
                    className={`lv-plx-row${ri === 1 ? ' lv-plx-row--rev' : ''}`}
                    key={ri}
                    style={staticMode ? undefined : { x: rowX[ri] }}
                  >
                    {row.map((card) => (
                      <Link
                        className="lv-plx-card"
                        key={card.slug}
                        to={`/CaseStudy?slug=${card.slug}`}
                        aria-label={`${card.name} — open the case study`}
                      >
                        <img
                          src={card.img}
                          width={800}
                          height={500}
                          loading={ri === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          alt={card.alt}
                        />
                        <span className="lv-plx-name" aria-hidden="true">
                          {card.name}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* The device — chassis only; the screen is the view above. */}
            <motion.div
              className="lv-fusion-bezel"
              ref={bezelRef}
              aria-hidden="true"
              style={staticMode ? undefined : { opacity: bezelOpacity, scale: bezelScale }}
            >
              <span className="lv-fusion-cam" />
              <span className="lv-fusion-homebar" />
            </motion.div>
          </motion.div>

          <motion.p className="lv-fusion-cap" style={staticMode ? undefined : { opacity: capOpacity }}>
            You&rsquo;re inside the portfolio now — every frame is a shipped build. Keep scrolling.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
