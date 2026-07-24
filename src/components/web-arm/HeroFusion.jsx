/**
 * HeroFusion v3 — the two client-supplied 21st.dev references fused into
 * one continuous camera move, faithful to the HeroParallax reference
 * footage frame-for-frame:
 *
 *   Inside the iPad's screen, the real Aceternity sequence plays on a
 *   WHITE stage: a bold header top-left, then three rows of work that
 *   start dim (opacity 0.2), tilted rotateX 15° and skewed rotateZ 20°,
 *   swooping down OVER the header while they spring flat and bright —
 *   and the rows keep translating ±X for the entire scroll. The springs
 *   read the RAW scroll position (stiffness 300 / damping 30), so the
 *   signature catch-up wobble at the start — then the smooth glide — is
 *   preserved exactly.
 *
 *   Meanwhile the device (ContainerScroll's move) straightens 26° → 0
 *   and drifts down; once it settles, the POV travels INTO the screen —
 *   the clip mask opens to the viewport, the mini scene scales to
 *   life-size, a glare sweeps the glass, the bezel flies past. The page
 *   after this point reads as "inside the iPad".
 *
 * Every tile is a live link to its case study. The row data derives
 * from the portfolio itself (BUILD_ORDER + getCaseStudy), newest first —
 * ALL entries, always in sync with the portfolio.
 *
 *   ── Adding a new portfolio entry to the hero ──────────────────────
 *   1. Add its slug to BUILD_ORDER in caseStudyData.jsx (you do this
 *      for the portfolio anyway).
 *   2. Add one derive line in scripts/portfolio-capture/
 *      derive-web-arm.mjs (plx-<key> at 1200w) and run it.
 *   3. Import the webp below and add one `slug: img` line to PLX_IMG.
 *
 * Registration: the screen rect is measured from UNTRANSFORMED layout
 * offsets (offsetLeft/Top + border widths) — never from a mid-tilt
 * getBoundingClientRect — so the mask and the chassis stay glued.
 *
 * staticMode (prerender / prefers-reduced-motion): no motion styles;
 * CSS [data-static] lays the scene flat and full-bleed.
 */
import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { BUILD_ORDER, getCaseStudy } from '../portfolio/caseStudyData';

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
import plxWooster from './assets/plx-wooster.webp';
import plxJk from './assets/plx-jk.webp';

/* slug → derived 1200w webp. One line per portfolio entry. */
const PLX_IMG = {
  'ds-racing-karts': plxDsr,
  'evidence-advisory': plxEvidence,
  'tidy-gardens-australia': plxTidy,
  'hvn-gym': plxHvn,
  'sharp-bricklaying': plxSharp,
  'groverz-tax': plxGroverz,
  rocksstream: plxRocks,
  'jurassic-pt': plxJurassic,
  gocc: plxGocc,
  'transform-fremantle': plxFreo,
  'transform-hakea': plxHakea,
  'people-power': plxPeople,
  quotr: plxQuotr,
  returndesk: plxReturndesk,
  'barrys-drink': plxBarrys,
  'wooster-core': plxWooster,
  'jk-plumbing-solutions': plxJk,
};

/* Every portfolio entry, newest build first, split into three rows.
   An entry without a derived image is skipped (never a broken tile). */
const ENTRIES = [...BUILD_ORDER]
  .reverse()
  .map((slug) => {
    const study = getCaseStudy(slug);
    const img = PLX_IMG[slug];
    return study && img ? { slug, name: study.name, img } : null;
  })
  .filter(Boolean);
const PER_ROW = Math.ceil(ENTRIES.length / 3);
const ROWS = [ENTRIES.slice(0, PER_ROW), ENTRIES.slice(PER_ROW, PER_ROW * 2), ENTRIES.slice(PER_ROW * 2)];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const seg = (v, a, b) => clamp01((v - a) / (b - a));
const smooth = (t) => t * t * (3 - 2 * t);

/* The reference component's spring, verbatim. */
const SPRING = { stiffness: 300, damping: 30 };

export default function HeroFusion({ header, staticMode = false }) {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const bezelRef = useRef(null);
  const rectRef = useRef({ t: 20, r: 16, b: 20, l: 16, rad: 22, cx: 50, cy: 50, mini: 0.44, shift: 560 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  /* Device + dive run on a smoothed progress; the SCENE springs feed on
     the raw progress so the reference's catch-up wobble survives. */
  const p = useSpring(scrollYProgress, { stiffness: 150, damping: 30, mass: 0.35 });
  const measured = useMotionValue(0);

  useLayoutEffect(() => {
    if (staticMode) return undefined;
    const measure = () => {
      const sticky = stickyRef.current;
      const bezel = bezelRef.current;
      if (!sticky || !bezel) return;
      const sw = sticky.clientWidth;
      const sh = sticky.clientHeight;
      if (!sw || !sh) return;
      /* offsetLeft/Top ignore transforms (`translate: -50% -50%` is a
         transform) — pure layout maths, valid at any tilt. */
      const bw = bezel.offsetWidth;
      const bh = bezel.offsetHeight;
      const cs = getComputedStyle(bezel);
      const bt = parseFloat(cs.borderTopWidth) || 0;
      const bl = parseFloat(cs.borderLeftWidth) || 0;
      const brw = parseFloat(cs.borderRightWidth) || 0;
      const bb = parseFloat(cs.borderBottomWidth) || 0;
      const x = bezel.offsetLeft - bw / 2 + bl;
      const y = bezel.offsetTop - bh / 2 + bt;
      const w = bw - bl - brw;
      const h = bh - bt - bb;
      if (w <= 0 || h <= 0) return;
      const radOuter = parseFloat(cs.borderTopLeftRadius) || 32;
      rectRef.current = {
        t: (y / sh) * 100,
        l: (x / sw) * 100,
        b: ((sh - (y + h)) / sh) * 100,
        r: ((sw - (x + w)) / sw) * 100,
        rad: Math.max(10, radOuter - bt),
        cx: ((x + w / 2) / sw) * 100,
        cy: ((y + h / 2) / sh) * 100,
        mini: Math.max(0.3, Math.min(0.54, (w / sw) * 0.96)),
        shift: Math.round(sw * 0.55),
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
  }, [staticMode, measured]);

  /* ── The device: straighten 26° → 0, drift down, settle ─────────── */
  const rotateX = useTransform(p, (v) => 26 * (1 - smooth(seg(v, 0.06, 0.5))));
  const stageScale = useTransform(p, (v) => 0.96 + 0.04 * smooth(seg(v, 0, 0.5)));
  const stageYPct = useTransform(p, (v) => {
    const d = smooth(seg(v, 0, 0.55));
    return `${-5.5 * (1 - d) + 1.2 * d}%`;
  });

  /* ── The dive ────────────────────────────────────────────────────── */
  const clipPath = useTransform([p, measured], ([v]) => {
    const r0 = rectRef.current;
    const d = smooth(seg(v, 0.62, 0.9));
    return `inset(${(r0.t * (1 - d)).toFixed(3)}% ${(r0.r * (1 - d)).toFixed(3)}% ${(r0.b * (1 - d)).toFixed(3)}% ${(r0.l * (1 - d)).toFixed(3)}% round ${(r0.rad * (1 - d)).toFixed(2)}px)`;
  });
  const sceneScale = useTransform([p, measured], ([v]) => {
    const { mini } = rectRef.current;
    return mini + (1 - mini) * smooth(seg(v, 0.62, 0.9));
  });
  const sceneOrigin = useTransform([p, measured], ([v]) => {
    const r0 = rectRef.current;
    const d = smooth(seg(v, 0.62, 0.9));
    return `${(r0.cx + (50 - r0.cx) * d).toFixed(2)}% ${(r0.cy + (50 - r0.cy) * d).toFixed(2)}%`;
  });
  /* The chassis does NOT fade away — the camera passes THROUGH it. Its
     scale tracks the opening mask exactly (the ring hugs the expanding
     screen edge), then overshoots so the frame flies past the viewport
     edges. Only a terminal fade clears the last corner arcs. */
  const bezelScale = useTransform([p, measured], ([v]) => {
    const r0 = rectRef.current;
    const d = smooth(seg(v, 0.62, 0.9));
    const track = (50 - r0.l * (1 - d)) / (50 - r0.l);
    return track * (1 + 0.55 * d * d);
  });
  const bezelOpacity = useTransform(p, (v) => 1 - smooth(seg(v, 0.9, 0.985)));
  const groundOpacity = useTransform(p, (v) => (0.5 + 0.5 * smooth(seg(v, 0, 0.5))) * (1 - smooth(seg(v, 0.62, 0.84))));
  const glareX = useTransform(p, (v) => `${-130 + 260 * smooth(seg(v, 0.6, 0.9))}%`);
  const glareOpacity = useTransform(p, (v) => {
    const d = seg(v, 0.6, 0.9);
    return d <= 0 || d >= 1 ? 0 : 0.4 * Math.sin(d * Math.PI);
  });
  const capOpacity = useTransform(p, (v) => smooth(seg(v, 0.9, 0.99)));

  /* ── The HeroParallax scene — the prompt's physics, raw-scroll fed ─
     Flatten (rotateX 15→0, rotateZ 20→0, translateY sweep, opacity
     0.2→1) over the opening stretch; row X runs the WHOLE scroll. */
  const sceneP = useTransform(scrollYProgress, (v) => seg(v, 0.04, 0.62));
  const flat = useTransform(sceneP, (v) => seg(v, 0, 0.34));
  /* The scene title steps aside BEFORE the rows arrive — a quiet rise
     and dissolve, never a collision. */
  const headOpacity = useTransform(flat, (v) => 1 - seg(v, 0.32, 0.68));
  const headY = useTransform(flat, (v) => `${-24 * smooth(seg(v, 0.32, 0.75))}%`);
  const groupRotateX = useSpring(useTransform(flat, [0, 1], [15, 0]), SPRING);
  const groupRotateZ = useSpring(useTransform(flat, [0, 1], [20, 0]), SPRING);
  const groupY = useSpring(useTransform(flat, (v) => `${-48 + 62 * v}%`), SPRING);
  const groupOpacity = useSpring(useTransform(flat, [0, 1], [0.2, 1]), SPRING);
  const rowShift = useTransform([scrollYProgress, measured], ([v]) => rectRef.current.shift * v);
  const rowPos = useSpring(rowShift, SPRING);
  const rowNeg = useSpring(useTransform(rowShift, (v) => -v), SPRING);
  /* Rows 1 & 3 are row-reversed and travel +X; row 2 travels −X —
     exactly the reference. Static offsets keep each row off-centre. */
  const row0X = useTransform([rowPos, measured], ([v]) => v - rectRef.current.shift * 0.5);
  const row1X = useTransform([rowNeg, measured], ([v]) => v + rectRef.current.shift * 0.42);
  const row2X = useTransform([rowPos, measured], ([v]) => v * 0.8 - rectRef.current.shift * 0.46);
  const rowXs = [row0X, row1X, row2X];

  return (
    <section className="lv-fusion" ref={sectionRef} data-static={staticMode || undefined}>
      <div className="lv-fusion-head lv-frame">{header}</div>

      <div className="lv-fusion-pin">
        <div className="lv-fusion-sticky" ref={stickyRef}>
          <motion.div
            className="lv-fusion-stage"
            style={staticMode ? undefined : { rotateX, scale: stageScale, y: stageYPct }}
          >
            {/* Clip layer — viewport-registered, never transformed. */}
            <motion.div className="lv-fusion-view" style={staticMode ? undefined : { clipPath }}>
              <motion.div
                className="lv-fusion-scene"
                style={staticMode ? undefined : { scale: sceneScale, transformOrigin: sceneOrigin }}
              >
                {/* The scene header — rises and dissolves as the rows
                    sweep in (never simply run over). */}
                <motion.div
                  className="lv-scene-head"
                  aria-hidden="true"
                  style={staticMode ? undefined : { opacity: headOpacity, y: headY }}
                >
                  <p className="lv-scene-kick">The shipped record</p>
                  <p className="lv-scene-line">Every build below is live, and yours to open.</p>
                </motion.div>
                <motion.div
                  className="lv-plx-group"
                  style={
                    staticMode
                      ? undefined
                      : { rotateX: groupRotateX, rotateZ: groupRotateZ, y: groupY, opacity: groupOpacity }
                  }
                >
                  {ROWS.map((row, ri) => (
                    <motion.div
                      className={`lv-plx-row${ri !== 1 ? ' lv-plx-row--rev' : ''}`}
                      key={ri}
                      style={staticMode ? undefined : { x: rowXs[ri] }}
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
                            width={1200}
                            height={750}
                            loading={ri === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            alt={`${card.name} — a C4 Studios build`}
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
              {/* Glass glare — sweeps once as the POV passes through. */}
              <motion.div
                className="lv-fusion-glare"
                aria-hidden="true"
                style={staticMode ? undefined : { x: glareX, opacity: glareOpacity }}
              />
            </motion.div>

            {/* The chassis — aluminium band, camera, buttons. */}
            <motion.div
              className="lv-fusion-bezel"
              ref={bezelRef}
              aria-hidden="true"
              style={staticMode ? undefined : { opacity: bezelOpacity, scale: bezelScale }}
            >
              <span className="lv-fusion-cam" />
              <span className="lv-fusion-btnbar lv-fusion-btnbar--vol" />
              <span className="lv-fusion-btnbar lv-fusion-btnbar--pwr" />
              <span className="lv-fusion-homebar" />
            </motion.div>

            {/* Grounding shadow; the dive dissolves it. */}
            <motion.div
              className="lv-fusion-ground"
              aria-hidden="true"
              style={staticMode ? undefined : { opacity: groundOpacity }}
            />
          </motion.div>

          <motion.p className="lv-fusion-cap" style={staticMode ? undefined : { opacity: capOpacity }}>
            You&rsquo;re inside the portfolio now — every frame is a shipped build. Keep scrolling.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
