/**
 * C4 Lens — v4: Proper polygon-based aperture system
 *
 * CORE FIX: Replaced individual blade-path rotation (which overflowed the barrel)
 * with a proper camera iris polygon system:
 *   - 9 blade wedge segments, each bounded by inner polygon edge + barrel arc
 *   - Pinwheel rotation as blades close (realistic cam mechanism)
 *   - ClipPath constrains everything to barrel inner circle
 *   - When open: blades are paper-thin at barrel edge = invisible
 *   - When closed: blades cover the aperture with tiny center hole
 *
 * Also fixed:
 *   - F-stop numbers evenly spaced on 210° arc at r=432
 *   - Iris much more subtle (starts at opacity 0.05, max 0.35)
 *   - Slower scroll (200vh, lerp 0.06)
 *   - Blades don't start closing until 12% scroll
 *   - Premium interactivity preserved
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { c4LensPackages } from '@/data/pricing';
import { createPaintStage } from '../components/lens/paintWord';
import GlyphPortal from '../components/ui/glyph-portal';

import { reassertStoredTheme } from '../components/c4/ThemeContext';
import '../components/lens/lens.css';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema, videoObjectSchema } from '@/lib/schema';

// Stable module-level ref so the head hook doesn't re-run each render.
const LENS_JSONLD = [
  serviceSchema({
    name: 'C4 Lens — Photography & Videography',
    description:
      'Brand photography, videography, drone and aerial work, and motion graphics for Perth founders and businesses.',
    url: '/Lens',
    serviceType: 'Photography and videography',
  }),
  breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'C4 Lens', path: '/Lens' },
  ]),
  videoObjectSchema({
    name: 'DS Racing Karts — site header & logo animation',
    description:
      'Animated website header and logo animation produced for DS Racing Karts by C4 Studios.',
    thumbnailUrl: '/lens-posters/dsr.jpg',
    contentUrl: '/DSR%20header.mp4',
    uploadDate: '2026-06-09',
    duration: 'PT7S',
  }),
  videoObjectSchema({
    name: 'HVN — brand film & aerial drone work',
    description:
      'Full brand show reel with aerial drone videography for HVN, produced by C4 Studios.',
    thumbnailUrl: '/lens-posters/hvn.jpg',
    contentUrl: '/hvn.mp4',
    uploadDate: '2026-06-09',
    duration: 'PT30S',
  }),
  videoObjectSchema({
    name: 'Sharp Bricklaying — aerial & on-site videography',
    description:
      'Aerial drone and on-site videography for Sharp Bricklaying, captured across active Perth job sites by C4 Studios.',
    thumbnailUrl: '/lens-posters/sharp.jpg',
    contentUrl: '/sharp-bricklaying-drone.mp4',
    uploadDate: '2026-06-09',
    duration: 'PT45S',
  }),
];

/* ── Force dark mode ── */
function useForceDark() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark-mode');
    root.classList.remove('light-mode', 'vivid');
    return () => { reassertStoredTheme(); };
  }, []);
}

/* ── Data ── */
const WORDS = [
  { text: 'character', col: '#d6ff3a' },
  { text: 'essence',   col: '#ff3fa3' },
  { text: 'nature',    col: '#3ff8ff' },
  { text: 'truth',     col: '#ff8a1c' },
  { text: 'soul',      col: '#f7ff00' },
  { text: 'voice',     col: '#b388ff' },
  { text: 'story',     col: '#3ff8ff' },
];

/* Package cards render from c4LensPackages (src/data/pricing.js) — the same
   source StartProject quotes from — so names, prices, order and the popular
   flag can't drift. The lines below are this page's abbreviated display copy
   for each package's canonical feature list; packages without an entry fall
   back to the pricing.js strings. Update both when inclusions change. */
const PKG_FEATURE_DISPLAY = {
  'mini-session': [
    <><strong>30-min</strong> shoot</>,
    '1 location',
    <><strong>5</strong> edited digital images</>,
    'Online gallery delivery',
  ],
  'portrait': [
    <><strong>1-hour</strong> shoot</>,
    '1 location',
    <><strong>15</strong> edited digital images</>,
    'Online gallery delivery',
  ],
  'business-branding': [
    <><strong>2-hour</strong> shoot</>,
    <>Up to <strong>2 locations</strong></>,
    <><strong>30</strong> edited digital images</>,
    'Headshots + workspace/lifestyle',
    'Online gallery delivery',
  ],
  'content-creation': [
    <><strong>Half-day</strong> shoot (4 hrs)</>,
    'Photo + video',
    <><strong>40</strong> edited photos</>,
    <><strong>2</strong> short-form videos (30–60s)</>,
    'Gallery + video delivery',
  ],
  'full-production': [
    <><strong>Full-day</strong> shoot (8 hrs)</>,
    'Photo + video',
    <><strong>60+</strong> edited photos</>,
    <><strong>4</strong> short-form + 1 long-form (3 min)</>,
    'Grade, sound, motion graphics',
    'Gallery + video delivery',
  ],
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   COMPONENT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function Lens() {
  useForceDark();
  useDocumentHead({
    title: 'C4 Lens — Photography, Videography & Brand Content in Perth',
    description:
      'C4 Lens is the visual arm of C4 Studios — brand photography, videography, drone work and motion graphics for Perth founders and businesses.',
    path: '/Lens',
    jsonLd: LENS_JSONLD,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);

  /* The ending is a Glyph Portal through the word LENS: a scroll-driven
     camera that dives through one letter into the call to action. It needs
     the display face frozen before it mounts, so it waits for Bebas Neue;
     the prerenderer and reduced-motion visitors get the plain section. */
  const staticRender = useMemo(
    () => typeof window !== 'undefined' && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || /Prerender/i.test(navigator.userAgent)),
    [],
  );
  const [portalReady, setPortalReady] = useState(false);
  useEffect(() => {
    if (staticRender) return undefined;
    let on = true;
    const done = () => { if (on) setPortalReady(true); };
    if (document.fonts && document.fonts.load) document.fonts.load('400 100px "Bebas Neue"').then(done, done); else done();
    return () => { on = false; };
  }, [staticRender]);

  useEffect(() => {
    /* â•â•â•â•â•â•â•â•â•â•â• FONTS â•â•â•â•â•â•â•â•â•â•â• */
    /* All five families (Bebas Neue, Geist, Geist Mono, Instrument Serif, Caveat)
       are self-hosted in src/styles/fonts.css and loaded globally via main.jsx —
       no runtime Google Fonts injection. */

    /* â•â•â•â•â•â•â•â•â•â•â• BODY â•â•â•â•â•â•â•â•â•â•â• */
    const prevBodyBg = document.body.style.background;
    document.body.style.background = '#000';

    /* Hide shared NavHeader on Lens page */
    const siteHeader = document.querySelector('header.fixed');
    if (siteHeader) siteHeader.style.display = 'none';

    /* â•â•â•â•â•â•â•â•â•â•â• UTILS â•â•â•â•â•â•â•â•â•â•â• */
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function eio(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; }
    function eoc(t) { return 1 - Math.pow(1-t, 3); }

    /* Hero visibility flag — the clutch (IntersectionObserver below) flips it. */
    let heroVisible = true;

    /* â•â•â•â•â•â•â•â•â•â•â• QUOTES â•â•â•â•â•â•â•â•â•â•â• */

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       APERTURE SYSTEM — Polygon-based iris (v4)

       Each blade is a wedge bounded by:
         Inner edge:  straight line between two consecutive aperture polygon vertices
         Outer edge:  arc along the barrel circle (radius BARREL_R)

       The inner polygon is a regular 9-gon whose radius shrinks from
       OPEN_R (≈ barrel = blades invisible) to CLOSED_R (tiny hole = fully closed).

       A pinwheel rotation + cam offset creates the overlapping-blade look
       characteristic of real camera irises.

       Everything is clipped to BARREL_R so nothing can escape the barrel.
       â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    const N = 9;           // blade count
    const BARREL_R = 395;  // inner barrel radius (clip boundary)
    const OPEN_R = 394;    // open: blades are a hair-thin ring at barrel edge
    const CLOSED_R = 18;   // closed: tiny hole at center

    const bladeSegs = document.querySelectorAll('.blade-seg');
    const bladeEdges = document.querySelectorAll('.blade-edge');
    const shadowEls = document.querySelectorAll('.aperture-shadow');
    const SHADOW = [[1, 0.55], [3.5, 0.3], [7, 0.14]];

    function updateAperture(progress) {
      /* progress: 0 = fully open (blades hidden), 1 = fully closed */
      const r = lerp(OPEN_R, CLOSED_R, progress);

      /* ── REAL IRIS MECHANISM ──
       *
       * In a real camera iris, each blade pivots around a PIN on the barrel.
       * An actuator ring rotates, causing each blade to swing inward.
       *
       * The key visual effect: the OUTER barrel anchor stays FIXED while
       * the INNER aperture edge ROTATES. This angular offset between
       * barrel and aperture creates the characteristic "wrapping" look
       * where blades appear to fan/sweep in from their pivot points.
       *
       * pinwheel = angular offset of inner edge relative to barrel anchor.
       * Applied ONLY to inner points, NOT outer points.
       */
      const pinwheel = progress * 0.65;  // ~37° of sweep — visible wrap

      /* Blade visibility: invisible when open, snap to solid when any closing starts */
      const bladeAlpha = progress < 0.005 ? 0 : 1;

      for (let i = 0; i < N; i++) {
        const sector = (Math.PI * 2) / N;

        /* OUTER barrel angles — FIXED, no rotation (blade anchor on barrel) */
        const outerA0 = i * sector - Math.PI / 2;
        const outerA1 = (i + 1) * sector - Math.PI / 2;

        /* INNER aperture angles — ROTATED by pinwheel (actuator ring turns) */
        const innerA0 = i * sector - Math.PI / 2 + pinwheel;
        const innerA1 = (i + 1) * sector - Math.PI / 2 + pinwheel;

        /* Inner aperture points — on the shrinking circle, rotated */
        const ix0 = 500 + Math.cos(innerA0) * r;
        const iy0 = 500 + Math.sin(innerA0) * r;
        const ix1 = 500 + Math.cos(innerA1) * r;
        const iy1 = 500 + Math.sin(innerA1) * r;

        /* Outer barrel points — fixed, with overlap spread */
        const spread = 0.10 + progress * 0.05;
        const oa = outerA0 - spread;
        const ob = outerA1 + spread;
        const ox0 = 500 + Math.cos(oa) * BARREL_R;
        const oy0 = 500 + Math.sin(oa) * BARREL_R;
        const ox1 = 500 + Math.cos(ob) * BARREL_R;
        const oy1 = 500 + Math.sin(ob) * BARREL_R;

        /* Build path:
         * barrel0 → inner0 (angled side edge — the "wrap" is visible here)
         * inner0 → inner1 (circular ARC at radius r — perfect circle hole)
         * inner1 → barrel1 (angled side edge)
         * barrel1 → barrel0 (arc along barrel) */
        const outerLargeArc = (ob - oa > Math.PI) ? 1 : 0;
        const d =
          `M${ox0.toFixed(1)},${oy0.toFixed(1)} ` +
          `L${ix0.toFixed(1)},${iy0.toFixed(1)} ` +
          `A${r.toFixed(1)},${r.toFixed(1)},0,0,1,${ix1.toFixed(1)},${iy1.toFixed(1)} ` +
          `L${ox1.toFixed(1)},${oy1.toFixed(1)} ` +
          `A${BARREL_R},${BARREL_R},0,${outerLargeArc},0,${ox0.toFixed(1)},${oy0.toFixed(1)}Z`;

        if (bladeSegs[i]) {
          bladeSegs[i].setAttribute('d', d);
          bladeSegs[i].style.opacity = bladeAlpha;
        }
        /* The machined inner edge of each blade catches the light. */
        if (bladeEdges[i]) {
          bladeEdges[i].setAttribute('d',
            `M${ix0.toFixed(1)},${iy0.toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)},0,0,1,${ix1.toFixed(1)},${iy1.toFixed(1)}`);
          bladeEdges[i].style.opacity = bladeAlpha;
        }
      }

      /* A soft shadow falls from the blade edge onto the glass: three rings,
         no filter. */
      shadowEls.forEach((el, k) => {
        const [inset, alpha] = SHADOW[k] || SHADOW[SHADOW.length - 1];
        el.setAttribute('r', Math.max(0, r - inset));
        el.style.opacity = bladeAlpha * alpha;
      });
    }

    /* Start fully open — blades invisible */
    updateAperture(0);

    /* â•â•â•â•â•â•â•â•â•â•â• FOCUS TICKS â•â•â•â•â•â•â•â•â•â•â• */
    const NS = 'http://www.w3.org/2000/svg';
    const ticksContainer = document.getElementById('focusTicks');
    if (ticksContainer) {
      for (let i = 0; i < 180; i++) {
        const a = (i / 180) * Math.PI * 2 - Math.PI / 2;
        const maj = i % 15 === 0, mid = i % 5 === 0;
        const Ro = 478, Ri = 452;
        const r1 = maj ? Ri - 9 : (mid ? Ri - 3 : Ri);
        const x1 = 500 + Math.cos(a) * r1, y1 = 500 + Math.sin(a) * r1;
        const x2 = 500 + Math.cos(a) * Ro, y2 = 500 + Math.sin(a) * Ro;
        const ln = document.createElementNS(NS, 'line');
        ln.setAttribute('x1', x1); ln.setAttribute('y1', y1);
        ln.setAttribute('x2', x2); ln.setAttribute('y2', y2);
        ln.setAttribute('stroke', maj ? '#9a9a98' : (mid ? '#5a5a58' : '#2a2a2c'));
        ln.setAttribute('stroke-width', maj ? 1.8 : (mid ? 1.1 : 0.7));
        ticksContainer.appendChild(ln);
      }
    }

    /* â•â•â•â•â•â•â•â•â•â•â• HERO SCROLL ENGINE â•â•â•â•â•â•â•â•â•â•â• */
    const heroScroll = document.getElementById('heroScroll');
    const lensWrap = document.getElementById('lensWrap');
    const lensLayer = document.getElementById('lensLayer');
    const lensEye = document.getElementById('lensEye');
    const eyePupil = document.getElementById('eyePupil');
    const focusRing = document.getElementById('focusRing');
    const quoteBlock = document.getElementById('quoteBlock');
    const heroBottom = document.getElementById('heroBottom');
    const scrollInd = document.getElementById('scrollInd');
    const tickFlash = document.getElementById('tickFlash');
    const shutterFlash = document.getElementById('shutterFlash');
    const gridOverlay = document.getElementById('gridOverlay');
    const lensFlare = document.getElementById('lensFlare');
    const hudF = document.getElementById('hudF');
    const hudShutter = document.getElementById('hudShutter');
    const hudIso = document.getElementById('hudIso');
    const hudFocal = document.getElementById('hudFocal');
    const hudFocus = document.getElementById('hudFocus');
    const hudFrame = document.getElementById('hudFrame');
    const hudWb = document.getElementById('hudWb');
    const hudTc = document.getElementById('hudTc');

    /* The iris rests dim and soft behind the glass; the focus pull brings it up. */
    if (lensEye) lensEye.style.opacity = '0.55';

    let audioCtx = null;
    function playShutter() {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const b = audioCtx.createBufferSource();
        const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.08, audioCtx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
          const env = Math.exp(-i / (audioCtx.sampleRate * 0.015));
          ch[i] = (Math.random() * 2 - 1) * env * 0.3;
        }
        b.buffer = buf;
        const gn = audioCtx.createGain(); gn.gain.value = 0.15;
        b.connect(gn); gn.connect(audioCtx.destination); b.start();
      } catch (e) { /* ignore */ }
    }

    let rawT = 0, smoothT = 0;
    const onHeroScroll = () => {
      if (!heroScroll) return;
      const rect = heroScroll.getBoundingClientRect();
      const total = heroScroll.offsetHeight - window.innerHeight;
      rawT = total > 0 ? clamp(-rect.top, 0, total) / total : 0;
    };
    window.addEventListener('scroll', onHeroScroll, { passive: true });

    /* Mouse parallax — subtle lens tilt, fine pointers only */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* staticMode: prerender UA + reduced-motion both rest at the finished end state */
    const staticMode = prefersReduced || /Prerender/i.test(navigator.userAgent);
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    let plxX = 0, plxY = 0, plxTX = 0, plxTY = 0;
    const onLensParallax = (e) => {
      plxTX = e.clientX / window.innerWidth - 0.5;
      plxTY = e.clientY / window.innerHeight - 0.5;
    };
    if (finePointer && !staticMode) document.addEventListener('mousemove', onLensParallax, { passive: true });

    let lastTickStep = -1, lastMs = performance.now();
    let lastBlur = -1, lastVf = -1;
    const heroSticky = heroScroll ? heroScroll.querySelector('.hero-sticky') : null;
    let shutterFired = false;
    let heroRafId;


    function heroFrame(now) {
      const dt = Math.min(0.1, (now - lastMs) / 1000);
      lastMs = now;

      /* Slower smoothing for more deliberate feel */
      smoothT = lerp(smoothT, rawT, 0.06);
      const t = smoothT;

      /* ── SCROLL PHASES (the hero is 240vh; t runs over its 140vh of travel) ──
       *   t = 0.00–0.04  rest: the glass breathes, the ring drifts
       *   t = 0.04–0.44  focus pull: the ring turns and the iris behind the glass sharpens
       *   t = 0.42–0.90  aperture: the blades close over the focused iris
       *   t = 0.90–1.00  hold: shutter
       */
      const focusRaw = clamp((t - 0.04) / 0.40, 0, 1);
      const focusP = staticMode ? 1 : eio(focusRaw);
      const bladeRawT = clamp((t - 0.42) / 0.48, 0, 1);
      const bladeProgress = eio(bladeRawT);

      /* Focus ring: a real pull is a good part-turn of the barrel; the idle
         drift dies as the hand takes over. */
      const idleDrift = now * 0.00012;
      const rot = focusP * 64 + bladeProgress * 8 + idleDrift * (1 - focusP);
      if (focusRing) focusRing.setAttribute('transform', `rotate(${rot.toFixed(2)} 500 500)`);

      /* The iris sharpens as the ring turns: a blur and a slight breathing
         scale, the blur quantised so the style only changes when the eye would. */
      const blurPx = Math.round((1 - focusP) * 7 * 4) / 4;
      if (blurPx !== lastBlur) {
        lastBlur = blurPx;
        if (lensEye) lensEye.style.filter = blurPx > 0.1 ? `blur(${blurPx}px)` : 'none';
      }
      if (lensEye) lensEye.style.transform = `translateZ(0) scale(${(1.05 - focusP * 0.05).toFixed(4)})`;
      /* The viewfinder brackets tighten as focus locks. */
      const vf = Math.round((14 - focusP * 2.5) * 10) / 10;
      if (vf !== lastVf) {
        lastVf = vf;
        if (heroSticky) heroSticky.style.setProperty('--vf', `${vf}%`);
      }

      /* Tick sounds */
      if (rawT > 0.01 && rawT < 0.85) {
        const step = Math.floor(rot / 6);
        if (step !== lastTickStep) {
          lastTickStep = step;
          if (tickFlash) {
            tickFlash.style.transition = 'none';
            tickFlash.style.opacity = '.4';
            requestAnimationFrame(() => {
              tickFlash.style.transition = 'opacity .25s';
              tickFlash.style.opacity = '0';
            });
          }
        }
      }

      /* ── APERTURE: update polygon-based blade system ── */
      updateAperture(bladeProgress);

      /* Lens dolly — very subtle zoom as it "focuses" + mouse-parallax tilt */
      const breath = Math.sin(now / 3000) * 0.002;
      const lensScale = 1 + focusP * 0.015 + bladeProgress * 0.035;
      plxX = lerp(plxX, plxTX, 0.05);
      plxY = lerp(plxY, plxTY, 0.05);
      const tiltX = (-plxY * 3.4).toFixed(3);
      const tiltY = (plxX * 3.8).toFixed(3);
      if (lensWrap) lensWrap.style.transform = `scale(${(lensScale + breath).toFixed(5)}) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;

      /* Anamorphic flare — bright while the aperture is open, dies as it closes */
      if (lensFlare) {
        const flareO = Math.max(0, (0.07 + focusP * 0.11) * (1 - bladeProgress) + Math.sin(now / 2400) * 0.02);
        lensFlare.style.opacity = flareO.toFixed(3);
        lensFlare.style.transform = `translate(calc(-50% + ${(plxX * -30).toFixed(1)}px), -50%)`;
      }

      /* Glass layer: NO opacity change — blades must stay fully opaque */

      /* ── EYE / IRIS ──
       * Hidden behind solid blades — only visible through the aperture opening.
       * Becomes more visible as blades close and the eye peers through the small hole.
       */
      const eyeOpacity = lerp(0.55, 0.85, focusP);
      if (lensEye) lensEye.style.opacity = eyeOpacity;

      if (eyePupil) {
        const pupilR = lerp(56, 68, eoc(clamp(bladeProgress * 1.05, 0, 1)));
        eyePupil.setAttribute('r', pupilR);
      }

      /* Rule-of-thirds grid: disabled — was showing as visible pattern */
      /* if (gridOverlay) gridOverlay.classList.toggle('on', t > 0.20); */

      /* UI fades */
      const uiFade = clamp(1 - t * 3.2, 0, 1);
      if (quoteBlock) {
        quoteBlock.style.opacity = uiFade;
        quoteBlock.style.transform = `translateY(${lerp(0, -10, 1 - uiFade)}px)`;
      }
      if (heroBottom) {
        heroBottom.style.opacity = clamp(1 - t * 4, 0, 1);
        heroBottom.style.pointerEvents = t > 0.06 ? 'none' : 'auto';
      }
      if (scrollInd) scrollInd.style.opacity = clamp(0.85 - rawT * 5, 0, 0.85);

      /* HUD camera readouts */
      if (hudF) hudF.textContent = (1.4 + bladeProgress * 14.6).toFixed(1).replace(/\.0$/, '');
      if (hudShutter) hudShutter.textContent = Math.round(250 - bladeProgress * 160);
      if (hudIso) hudIso.textContent = Math.round(400 + bladeProgress * 800);
      if (hudWb) hudWb.textContent = `${Math.round(5600 - bladeProgress * 400)}K`;
      if (hudFocal) hudFocal.textContent = ['35mm', '50mm', '85mm', '105mm', '135mm'][Math.min(4, Math.floor(bladeProgress * 5))];
      if (hudFocus) hudFocus.textContent = focusP > 0.995 ? 'LOCKED · ●' : `MANUAL · ${(0.5 + focusP * 1.9).toFixed(1)}M`;
      if (hudFrame) hudFrame.textContent = `${String(Math.round(1 + rawT * 419)).padStart(3, '0')} / 420`;
      if (hudTc) {
        const tcS = Math.floor(now / 1000);
        hudTc.textContent = `${String(Math.floor(tcS / 3600) % 24).padStart(2, '0')}:${String(Math.floor(tcS / 60) % 60).padStart(2, '0')}:${String(tcS % 60).padStart(2, '0')}:${String(Math.floor((now / 41.6) % 24)).padStart(2, '0')}`;
      }


      /* Shutter-click flash near full close (~93%) */
      if (bladeProgress > 0.93 && !shutterFired) {
        shutterFired = true;
        playShutter();
        if (shutterFlash) {
          shutterFlash.style.transition = 'none';
          shutterFlash.style.opacity = '0.55';
          requestAnimationFrame(() => {
            shutterFlash.style.transition = 'opacity .45s ease-out';
            shutterFlash.style.opacity = '0';
          });
        }
        /* Shutter button press animation */
        const shutterBtn = document.getElementById('shutterBtn');
        if (shutterBtn) {
          shutterBtn.classList.add('pressed');
          setTimeout(() => shutterBtn.classList.remove('pressed'), 350);
        }
      }
      if (bladeProgress < 0.85) shutterFired = false;

      /* Guarded tail — the loop cannot self-resurrect while the hero is offscreen */
      heroRafId = heroVisible ? requestAnimationFrame(heroFrame) : 0;
    }
    heroRafId = requestAnimationFrame(heroFrame);

    /* The motor stops between takes: 0 fps once the hero scroll stage leaves view. */
    let heroIO = null;
    if (heroScroll) {
      heroIO = new IntersectionObserver((entries) => {
        const vis = entries[0].isIntersecting;
        if (vis === heroVisible) return;
        heroVisible = vis;
        if (!vis) {
          cancelAnimationFrame(heroRafId);
          heroRafId = 0;
        } else if (!heroRafId) {
          lastMs = performance.now();
          onHeroScroll();
          /* Snap only on real drift — a fast anchor jump must not whip the aperture */
          if (Math.abs(rawT - smoothT) > 0.2) smoothT = rawT;
          heroRafId = requestAnimationFrame(heroFrame);
        }
      }, { rootMargin: '15% 0px' });
      heroIO.observe(heroScroll);
    }

    /* ═══ THE PAINT STAGE — "We exist to capture the [word] of your brand." ═══
       Live visitors get high-vis paint thrown onto the black (paintWord.js): the
       word is painted in behind a brush front, drops fly, drips run, and the
       cursor is a knife. Prerender and reduced motion get the SVG word below,
       fully drawn, so the sentence is always complete in the static HTML. */
    function renderStaticWord() {
      const svgEl = document.getElementById('wordSvg');
      if (!svgEl) return;
      const word = WORDS[0];
      svgEl.setAttribute('viewBox', '0 -200 2000 400');
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', '0');
      t.setAttribute('class', 'svg-word-letter');
      t.textContent = word.text;
      t.style.fill = word.col;
      svgEl.appendChild(t);
      const box = t.getBBox();
      const padX = 20, padY = 15;
      svgEl.setAttribute('viewBox', `${box.x - padX} ${box.y - padY} ${box.width + padX * 2} ${box.height + padY * 2}`);
    }

    let stage = null;
    let capIO = null;
    const wordStage = document.getElementById('wordStage');
    if (staticMode || !wordStage) {
      renderStaticWord();
    } else {
      wordStage.classList.add('is-live');
      stage = createPaintStage(wordStage, { words: WORDS });
      /* Same clutch as the hero motor: the paint only runs while §01 is on screen. */
      capIO = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) stage.start(); else stage.stop();
      }, { threshold: 0.3 });
      const captureEl = document.getElementById('capture');
      if (captureEl) capIO.observe(captureEl);
    }


    /* â•â•â•â•â•â•â•â•â•â•â• PORTFOLIO SCROLL â•â•â•â•â•â•â•â•â•â•â• */
    const pfOuter = document.getElementById('portfolioOuter');
    const pfTrack = document.getElementById('pfTrack');
    const pfBar = document.getElementById('pfBar');
    const pfCount = document.getElementById('pfCount');
    function sizePortfolio() {
      if (!pfTrack || !pfOuter) return;
      const travel = Math.max(0, pfTrack.scrollWidth - window.innerWidth);
      pfOuter.style.setProperty('--pf-travel', travel + 'px');
    }
    function onPfScroll() {
      if (!pfOuter || !pfTrack || !pfBar) return;
      const rect = pfOuter.getBoundingClientRect();
      const total = pfOuter.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, total);
      const t2 = total > 0 ? scrolled / total : 0;
      pfTrack.style.transform = `translateX(${-t2 * Math.max(0, pfTrack.scrollWidth - window.innerWidth)}px)`;
      pfBar.style.transform = `scaleX(${t2.toFixed(4)})`;
      if (pfCount) {
        const nCards = pfTrack.querySelectorAll('.pf-card').length;
        const cur = 1 + Math.round(t2 * (nCards - 1));
        pfCount.textContent = `Frame ${String(cur).padStart(2, '0')} / ${String(nCards).padStart(2, '0')}`;
      }
    }
    window.addEventListener('scroll', onPfScroll, { passive: true });
    const onResize = () => { sizePortfolio(); onPfScroll(); };
    window.addEventListener('resize', onResize);
    requestAnimationFrame(() => { sizePortfolio(); onPfScroll(); });

    /* â•â•â•â•â•â•â•â•â•â•â• SCROLL REVEALS + STAT COUNT-UP â•â•â•â•â•â•â•â•â•â•â• */
    const revealEls = document.querySelectorAll('.lens-page .lr');
    let revealIO = null;
    if (staticMode) {
      revealEls.forEach(el => el.classList.add('in'));
    } else {
      revealIO = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            revealIO.unobserve(en.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -7% 0px' });
      revealEls.forEach(el => revealIO.observe(el));
    }

    /* Static mode: strip video autoplay so the posters stand (honest end state) */
    if (staticMode) {
      document.querySelectorAll('.lens-page video.pf-img').forEach(v => {
        v.autoplay = false;
        v.removeAttribute('autoplay');
        try { v.pause(); } catch { /* ignore */ }
      });
    }


    /* â•â•â•â•â•â•â•â•â•â•â• CURSOR â•â•â•â•â•â•â•â•â•â•â• */
    const reticle = document.getElementById('reticle');
    let rx = window.innerWidth / 2, ry = window.innerHeight / 2, tx = rx, ty = ry;
    let cursorRafId = 0;
    function animR() {
      rx = lerp(rx, tx, 0.22); ry = lerp(ry, ty, 0.22);
      if (reticle) reticle.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      /* Self-suspending: once settled within a quarter-pixel the loop parks itself */
      if (Math.hypot(tx - rx, ty - ry) < 0.25) { cursorRafId = 0; return; }
      cursorRafId = requestAnimationFrame(animR);
    }
    const onMouseMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!cursorRafId) cursorRafId = requestAnimationFrame(animR);
    };
    /* The reticle is a fine-pointer instrument — never a stuck crosshair on touch */
    if (finePointer) {
      document.body.classList.add('cursor-on');
      if (reticle) reticle.style.display = 'block';
      document.addEventListener('mousemove', onMouseMove);
      cursorRafId = requestAnimationFrame(animR);
    }

    /* â•â•â•â•â•â•â•â•â•â•â• AUDIO â•â•â•â•â•â•â•â•â•â•â• */
    const onAudioInit = () => { if (!audioCtx) try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} };
    document.addEventListener('click', onAudioInit, { once: true });

    /* â•â•â•â•â•â•â•â•â•â•â• CLEANUP â•â•â•â•â•â•â•â•â•â•â• */
    return () => {
      cancelAnimationFrame(heroRafId);
      cancelAnimationFrame(cursorRafId);
      if (stage) stage.destroy();
      window.removeEventListener('scroll', onHeroScroll);
      window.removeEventListener('scroll', onPfScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousemove', onLensParallax);
      if (revealIO) revealIO.disconnect();
      if (heroIO) heroIO.disconnect();
      document.removeEventListener('click', onAudioInit);
      if (capIO) capIO.disconnect();
      document.body.style.background = prevBodyBg;
      document.body.classList.remove('cursor-on');
      if (siteHeader) siteHeader.style.display = '';
      if (audioCtx) try { audioCtx.close(); } catch (e) {}
    };
  }, []);

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     JSX
     â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  return (
    <div className="lens-page">
      <h1 className="lens-sr-only">C4 Lens — Photography, Videography &amp; Brand Content in Perth</h1>

      {/* Reticle cursor */}
      <svg className="reticle" id="reticle" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke="#fff" strokeWidth=".75" opacity=".5" />
        <circle cx="20" cy="20" r="1" fill="#fff" />
        <line x1="20" y1="0" x2="20" y2="7" stroke="#fff" strokeWidth=".75" />
        <line x1="20" y1="33" x2="20" y2="40" stroke="#fff" strokeWidth=".75" />
        <line x1="0" y1="20" x2="7" y2="20" stroke="#fff" strokeWidth=".75" />
        <line x1="33" y1="20" x2="40" y2="20" stroke="#fff" strokeWidth=".75" />
        <path d="M2 6L2 2L6 2" stroke="#fff" strokeWidth=".75" />
        <path d="M38 6L38 2L34 2" stroke="#fff" strokeWidth=".75" />
        <path d="M2 34L2 38L6 38" stroke="#fff" strokeWidth=".75" />
        <path d="M38 34L38 38L34 38" stroke="#fff" strokeWidth=".75" />
      </svg>

      {/* Nav */}
      <nav>
        <div className="nav-left-wrap">
          <Link to="/" className="site-back">← C4<span className="site-back-tail"> Studios</span></Link>
          <button
            className="site-nav-btn"
            onClick={() => setSiteMenuOpen(o => !o)}
            aria-label="C4 Studios navigation"
            aria-expanded={siteMenuOpen}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.1">
              <rect x=".5" y=".5" width="5.5" height="5.5" rx=".4"/>
              <rect x="9" y=".5" width="5.5" height="5.5" rx=".4"/>
              <rect x=".5" y="9" width="5.5" height="5.5" rx=".4"/>
              <rect x="9" y="9" width="5.5" height="5.5" rx=".4"/>
            </svg>
          </button>
        </div>
        <div className="brand"><span className="logo-dot"></span>C4 LENS</div>
        <div className="nav-links">
          <a href="#capture">Our Work</a>
          <a href="#services">Services</a>
          <a href="#packages">Packages</a>
          <a href="#caleb">About</a>
          <a href="#contact" className="book">Book <span className="btn-arrow">→</span></a>
        </div>
        <button
          className="lens-hamburger"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l12 12M16 4L4 16" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 5h16M2 10h16M2 15h16" /></svg>
          )}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lens-mobile-menu">
          <Link to="/" className="lens-mobile-back" onClick={() => setMobileMenuOpen(false)}>← C4 Studios</Link>
          <div className="lens-mobile-sep" />
          <a href="#capture" onClick={() => setMobileMenuOpen(false)}>Our Work</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#packages" onClick={() => setMobileMenuOpen(false)}>Packages</a>
          <a href="#caleb" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="book">Book a Call</a>
        </div>
      )}

      {/* Site nav dropdown */}
      {siteMenuOpen && (
        <>
          <div className="site-nav-overlay" onClick={() => setSiteMenuOpen(false)} />
          <div className="site-nav-drop">
            <Link to={createPageUrl('Home')} onClick={() => setSiteMenuOpen(false)}>Home</Link>
            <Link to={createPageUrl('Portfolio')} onClick={() => setSiteMenuOpen(false)}>Portfolio</Link>
            <Link to={createPageUrl('ServiceWeb')} onClick={() => setSiteMenuOpen(false)}>Services</Link>
            <Link to={createPageUrl('About')} onClick={() => setSiteMenuOpen(false)}>About</Link>
            <Link to={createPageUrl('StartProject')} className="site-nav-cta" onClick={() => setSiteMenuOpen(false)}>Start a Project →</Link>
          </div>
        </>
      )}

      {/* â•â•â•â•â•â•â•â• HERO â•â•â•â•â•â•â•â• */}
      <div className="hero-scroll" id="heroScroll">
        <div className="hero-sticky">
          <div className="studio-light"></div>

          {/* Viewfinder corner brackets */}
          <div className="vf-bracket tl">
            <svg width="28" height="28" viewBox="0 0 28 28" stroke="rgba(245,245,240,.18)" strokeWidth="1" fill="none"><path d="M1 10V1h9" /></svg>
          </div>
          <div className="vf-bracket tr">
            <svg width="28" height="28" viewBox="0 0 28 28" stroke="rgba(245,245,240,.18)" strokeWidth="1" fill="none"><path d="M27 10V1h-9" /></svg>
          </div>
          <div className="vf-bracket bl">
            <svg width="28" height="28" viewBox="0 0 28 28" stroke="rgba(245,245,240,.18)" strokeWidth="1" fill="none"><path d="M1 18v9h9" /></svg>
          </div>
          <div className="vf-bracket br">
            <svg width="28" height="28" viewBox="0 0 28 28" stroke="rgba(245,245,240,.18)" strokeWidth="1" fill="none"><path d="M27 18v9h-9" /></svg>
          </div>

          {/* Rule-of-thirds grid */}
          <div className="hud-grid-overlay" id="gridOverlay"></div>

          {/* HUD */}
          <div className="hud">
            <div className="hud-c tl">
              <span className="rec-wrap">
                <span className="rec-dot"></span>
                <span className="v">REC · <span id="hudTc">00:00:00:00</span></span>
              </span>
            </div>
            <div className="hud-c tr">
              <span className="v">f/<span id="hudF">1.4</span> · 1/<span id="hudShutter">250</span> · ISO <span id="hudIso">400</span></span>
              <span className="k" style={{ marginTop: '5px' }}><span id="hudFocal">35mm</span> · RAW · <span id="hudWb">5600K</span></span>
            </div>
            <div className="hud-c bl">
              <span className="k">FOCUS</span>
              <span className="v" id="hudFocus">MANUAL · ∞</span>
            </div>
            <div className="hud-c br">
              <span className="k">FRAME</span>
              <span className="v" id="hudFrame">001 / 420</span>
            </div>

          </div>

          <div className="hero-stage">
            <div className="lens-wrap" id="lensWrap">
              <div className="barrel-anchor"></div>

              {/* EYE — visible iris behind the lens glass */}
              <div className="lens-eye" id="lensEye">
                <svg className="eye-svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                  <defs>
                  </defs>
                  {/* The iris: rendered once from procedural SVG (public/lens-tex/iris.webp) */}
                  <image href="/lens-tex/iris.webp" x="0" y="0" width="400" height="400"/>
                  {/* Pupil */}
                  <circle id="eyePupil" cx="200" cy="200" r="56" fill="#050302"/>
                  {/* Specular highlights — bright catchlights */}
                  <ellipse cx="165" cy="162" rx="18" ry="14" fill="rgba(255,255,250,.65)" transform="rotate(-20 165 162)"/>
                  <ellipse cx="228" cy="225" rx="8" ry="5" fill="rgba(255,255,250,.25)" transform="rotate(15 228 225)"/>
                </svg>
              </div>

              {/* LENS SVG — barrel, focus ring, f-stops, glass, aperture */}
              <div className="lens-layer" id="lensLayer">
                <svg className="lens-svg" viewBox="0 0 1000 1000">
                  <defs>
                    <radialGradient id="gBladeA" gradientUnits="userSpaceOnUse" cx="500" cy="500" r="395">
                      <stop offset="0%" stopColor="#0f0f13"/>
                      <stop offset="55%" stopColor="#1f1f25"/>
                      <stop offset="100%" stopColor="#3a3a42"/>
                    </radialGradient>
                    <radialGradient id="gBladeB" gradientUnits="userSpaceOnUse" cx="500" cy="500" r="395">
                      <stop offset="0%" stopColor="#0b0b0f"/>
                      <stop offset="55%" stopColor="#1a1a20"/>
                      <stop offset="100%" stopColor="#30303a"/>
                    </radialGradient>
                    <linearGradient id="gEdge" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,.34)"/>
                      <stop offset="50%" stopColor="rgba(255,255,255,.10)"/>
                      <stop offset="100%" stopColor="rgba(255,255,255,.24)"/>
                    </linearGradient>
                    {/* Clip: nothing escapes the barrel inner circle */}
                    <clipPath id="apertureClip">
                      <circle cx="500" cy="500" r="395"/>
                    </clipPath>
                  </defs>

                  {/* Barrel: turned metal, knurl, engraving and sheen, rendered once (public/lens-tex/barrel.webp) */}
                  <image href="/lens-tex/barrel.webp" x="0" y="0" width="1000" height="1000"/>

                  {/* Focus ring (rotates on scroll) */}
                  <g id="focusRing">
                    <g id="focusTicks"></g>
                    {/* Distance markings — computed on arc at r=468, tangent-rotated */}
                    {[['∞',-90],['30',-57],['10',-24],['5',9],['3',42],['1.5',75],['1',108],['0.7',141],['0.5',174]].map(([label, deg]) => {
                      const rad = deg * Math.PI / 180;
                      const R = 468;
                      const x = (500 + Math.cos(rad) * R).toFixed(1);
                      const y = (500 + Math.sin(rad) * R).toFixed(1);
                      return (
                        <text
                          key={label}
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontFamily="Geist Mono,monospace"
                          fontSize="9"
                          fill="#8a8a85"
                          letterSpacing="0.8"
                          fontWeight="500"
                          transform={`rotate(${deg + 90} ${x} ${y})`}
                        >{label}</text>
                      );
                    })}
                    {/* Ft/m label */}
                    {(() => {
                      const rad = 207 * Math.PI / 180;
                      const R = 468;
                      const x = (500 + Math.cos(rad) * R).toFixed(1);
                      const y = (500 + Math.sin(rad) * R).toFixed(1);
                      return (
                        <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                          fontFamily="Geist Mono,monospace" fontSize="7" fill="#5a5a55"
                          letterSpacing="1.5" transform={`rotate(${207 + 90} ${x} ${y})`}>m</text>
                      );
                    })()}
                    <line x1="500" y1="28" x2="500" y2="48" stroke="#e8a658" strokeWidth="2.5" opacity=".9"/>
                  </g>


                  {/* F-stop numbers — computed on 210° arc at r=432, tangent-rotated */}
                  <g fontFamily="Geist Mono,monospace" fontSize="9.5" fill="#5a5a58" letterSpacing="1">
                    {['1.4','2','2.8','4','5.6','8','11','16','22'].map((label, i) => {
                      const deg = -90 + (i / 8) * 210;
                      const rad = deg * Math.PI / 180;
                      const R = 432;
                      const x = (500 + Math.cos(rad) * R).toFixed(1);
                      const y = (500 + Math.sin(rad) * R).toFixed(1);
                      return (
                        <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                          transform={`rotate(${deg + 90} ${x} ${y})`}>{label}</text>
                      );
                    })}
                  </g>

                  {/* F-stop tick marks — computed at same angles, r=420→428 */}
                  <g stroke="#5a5a58" strokeWidth="1">
                    {[0,1,2,3,4,5,6,7,8].map(i => {
                      const deg = -90 + (i / 8) * 210;
                      const rad = deg * Math.PI / 180;
                      return (
                        <line key={i}
                          x1={(500 + Math.cos(rad) * 420).toFixed(1)} y1={(500 + Math.sin(rad) * 420).toFixed(1)}
                          x2={(500 + Math.cos(rad) * 428).toFixed(1)} y2={(500 + Math.sin(rad) * 428).toFixed(1)}/>
                      );
                    })}
                  </g>

                  {/* APERTURE BLADES — opaque metal over the iris, under the front element */}
                  <g id="apertureBlades" clipPath="url(#apertureClip)">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <path key={i} className="blade-seg" fill={i % 2 ? 'url(#gBladeB)' : 'url(#gBladeA)'} stroke="#3c3c46" strokeWidth="0.8"/>
                    ))}
                    {Array.from({ length: 9 }).map((_, i) => (
                      <path key={`e${i}`} className="blade-edge" fill="none" stroke="url(#gEdge)" strokeWidth="1.5" strokeLinecap="round"/>
                    ))}
                    <circle className="aperture-shadow" cx="500" cy="500" r="392" fill="none" stroke="#000" strokeWidth="2.5"/>
                    <circle className="aperture-shadow" cx="500" cy="500" r="392" fill="none" stroke="#000" strokeWidth="5"/>
                    <circle className="aperture-shadow" cx="500" cy="500" r="392" fill="none" stroke="#000" strokeWidth="9"/>
                  </g>

                  {/* The front element: well, coating, softbox reflections, dust, bezel edge (public/lens-tex/glass.webp) */}
                  <image href="/lens-tex/glass.webp" x="0" y="0" width="1000" height="1000" pointerEvents="none"/>
                </svg>
              </div>

              <div className="tick-flash" id="tickFlash"></div>
            </div>

            {/* Anamorphic glass flare — driven by scroll engine */}
            <div className="lens-flare" id="lensFlare" aria-hidden="true"></div>
          </div>

          {/* Shutter flash overlay */}
          <div className="shutter-flash" id="shutterFlash"></div>

          <div className="vignette"></div>
          <div className="grain"></div>

          {/* Shutter release button — top right, like a real camera body */}
          <div className="shutter-btn" id="shutterBtn">
            <div className="shutter-btn-outer">
              <div className="shutter-btn-inner"></div>
            </div>
            <span className="shutter-btn-label">SHUTTER</span>
          </div>

          <div className="hero-copy" id="quoteBlock">
            <p className="hero-kick">Photography, film and drone work for Perth businesses.</p>
            <h2 className="hero-title">Stock is <em>someone else&rsquo;s</em> business.</h2>
          </div>

          <div className="hero-bottom" id="heroBottom">
            <div className="h-cta">
              <a href="#packages" className="btn primary"><span className="d"></span>View packages</a>
              <a href="#contact" className="btn">Book a call <span className="btn-arrow">→</span></a>
            </div>
            <div className="scroll-ind" id="scrollInd"><span className="arr">↓</span>Scroll to focus</div>
          </div>
        </div>
      </div>


      {/* â•â•â•â•â•â•â•â• WHAT WE CAPTURE — full-viewport paint canvas â•â•â•â•â•â•â•â• */}
      <section className="capture" id="capture">
        <div className="cap-inner">
          <div className="cap-header lr">
            <div className="cap-kicker">We don&rsquo;t photograph<br /><em>businesses.</em></div>
          </div>

          <div className="cap-stmt lr" style={{ '--lr-delay': '120ms' }}>
            <div className="cap-stmt-fixed">
              <span className="cap-stmt-label">We exist to capture the</span>
              <div className="word-stage" id="wordStage">
                <svg id="wordSvg" className="word-svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg>
              </div>
              <span className="cap-stmt-label">of your brand.</span>
            </div>
          </div>

        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• SERVICES â•â•â•â•â•â•â•â• */}
      <section className="slab dark" id="services">
        <h2 className="lr" style={{ '--lr-delay': '80ms' }}>FIVE WAYS<br />TO BE <em>unforgettable.</em></h2>
        <div className="svc-grid">
          <div className="svc-card lr lr-fade">
            <div className="svc-tag">Photography</div>
            <h3>REPLACE STOCK<br />WITH PROOF.</h3>
            <div className="desc">Team portraits, the workspace as it actually is, product shots, and headshots that look like the person a client will meet.</div>
          </div>
          <div className="svc-card lr lr-fade" style={{ '--lr-delay': '90ms' }}>
            <div className="svc-tag">Videography</div>
            <h3>MOTION THAT<br />EARNS ATTENTION.</h3>
            <div className="desc">Brand films, social cuts, event coverage and founder pieces where the person behind the business does the talking.</div>
          </div>
          <div className="svc-card lr lr-fade" style={{ '--lr-delay': '180ms' }}>
            <div className="svc-tag">Drone &amp; Aerial</div>
            <h3>THE PERSPECTIVE<br />THEY&rsquo;VE NEVER SEEN.</h3>
            <div className="desc">Licensed drone work for sites, events and construction, for the moments when a ground-level shot can&rsquo;t show the scale.</div>
          </div>
          <div className="svc-card lr lr-fade" style={{ '--lr-delay': '270ms' }}>
            <div className="svc-tag">Post-Production</div>
            <h3>CUT FOR THE<br />PLATFORM.</h3>
            <div className="desc">Reels, cutdowns and event highlights, graded and mixed in-house. Bring your own footage if you have it.</div>
          </div>
          <div className="svc-card lr lr-fade" style={{ '--lr-delay': '360ms' }}>
            <div className="svc-tag">Branding</div>
            <h3>A LOOK THAT<br />HOLDS TOGETHER.</h3>
            <div className="desc">Logo, colour and type, built so the photography, the website and the socials look like they came from the same place.</div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• PACKAGES â•â•â•â•â•â•â•â• */}
      <section className="slab mid" id="packages">
        <h2 className="lr" style={{ '--lr-delay': '80ms' }}>CLEAR SCOPE.<br /><em>No surprises.</em></h2>
        <div className="pkg-grid">
          {c4LensPackages.map((pkg, i) => {
            const lines = PKG_FEATURE_DISPLAY[pkg.key] ?? pkg.features;
            const amount = pkg.priceLabel.replace(/^\$/, '').replace(/\+$/, '');
            const plus = pkg.priceLabel.endsWith('+');
            return (
              <div
                key={pkg.key}
                className={`pkg-card${pkg.popular ? ' pop' : ''} lr lr-fade`}
                style={i ? { '--lr-delay': `${i * 80}ms` } : undefined}
              >
                {pkg.popular && <div className="pop-badge">Most popular</div>}
                <h3>{pkg.name.toUpperCase()}</h3>
                <div className="pkg-price">
                  <span className="cur">$</span>{amount}
                  {plus && <span style={{ fontSize: '.38em', color: 'var(--ink-3)', fontFamily: "'Geist Mono', monospace" }}>+</span>}
                </div>
                <div className="pkg-div"></div>
                <ul className="pkg-ul">
                  {lines.map((line, li) => <li key={li}>{line}</li>)}
                </ul>
                <div className="pkg-cta">
                  <Link to={`${createPageUrl('StartProject')}?service=lens&package=${pkg.key}`} className={pkg.popular ? 'btn primary' : 'btn'}>
                    Select <span className="btn-arrow">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pkg-note lr">
          <strong>All prices exclude GST.</strong> Starting prices are based on the scope we agree. If the scope changes, we tell you straight away and pause until the revised price is agreed.<br />
          Professional services (legal, financial, medical) may carry a 15–20% surcharge, which we go through on the discovery call.
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• CALEB — WITH PHOTO â•â•â•â•â•â•â•â• */}
      <section className="slab dark caleb" id="caleb">
        <div className="caleb-inner">
          <div className="caleb-left lr lr-wipe">
            <div className="caleb-photo-wrap">
              <img
                src="/Caleb%20Walker%20-%20C4%20Lens%20Profile.jpeg"
                alt="Caleb Walker — Lead Photographer & Videographer at C4 Lens"
                loading="lazy"
              />
              <div className="caleb-photo-meta">
                <span className="role">Lead Photographer &amp; Videographer</span>
                <span className="loc">Perth, W.A.</span>
              </div>
            </div>
          </div>
          <div className="caleb-right">
            <h2 className="lr" style={{ '--lr-delay': '70ms' }}>CALEB<br /><em>Walker.</em></h2>
            <blockquote className="caleb-quote lr" style={{ '--lr-delay': '140ms' }}>&ldquo;If the brand has weight,<br />the visuals should too.&rdquo;</blockquote>
            <p className="lr" style={{ '--lr-delay': '200ms' }}>Caleb leads C4 Lens, the photography, videography and editing arm of C4 Studios. Commercial brand shoots, corporate headshots, events and social content, <strong>shot and edited by the same person</strong>.</p>
            <p className="lr" style={{ '--lr-delay': '250ms' }}>His drone work shows the site, the building or the event from the angle nobody on the ground gets. His editing turns the raw footage into <strong>brand films, reels and launch content</strong>.</p>
            <p className="lr" style={{ '--lr-delay': '300ms' }}>Businesses bring Caleb in to replace stock imagery with pictures of their own people and premises, so a client feels they know the place before the first meeting.</p>
            <p className="lr caleb-base" style={{ '--lr-delay': '350ms' }}>
              Based in Perth, Western Australia. Available nationally.
            </p>
            <div className="lr" style={{ '--lr-delay': '400ms', marginTop: '24px' }}>
              <a href="#contact" className="btn primary"><span className="d"></span>Work with Caleb <span className="btn-arrow">→</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• PORTFOLIO â•â•â•â•â•â•â•â• */}
      <div className="portfolio-outer" id="portfolioOuter">
        <div className="portfolio-sticky">
          <div className="pf-top-row">
            <span className="t">Selected work</span>
            <span>PERTH, W.A. · 2024–2026</span>
          </div>
          <div className="pf-hint">Scroll to pan</div>
          <div className="pf-count" id="pfCount">Frame 01 / 03</div>
          <div className="pf-track" id="pfTrack">
            <div className="pf-card wide"><video src="/DSR%20header.mp4" poster="/lens-posters/dsr.jpg" preload="none" autoPlay muted loop playsInline className="pf-img" /><div className="pf-corner">01 · DSR</div><div className="pf-mask"></div><div className="pf-cap"><div className="name">DS RACING KARTS</div><div className="cat">SITE HEADERS / LOGO ANIMATION</div></div></div>
            <div className="pf-card wide"><video src="/hvn.mp4" poster="/lens-posters/hvn.jpg" preload="none" autoPlay muted loop playsInline className="pf-img" /><div className="pf-corner">02 · HVN</div><div className="pf-mask"></div><div className="pf-cap"><div className="name">HVN</div><div className="cat">FULL SHOW / DRONE WORK</div></div></div>
            <div className="pf-card wide"><video src="/sharp-bricklaying-drone.mp4" poster="/lens-posters/sharp.jpg" preload="none" autoPlay muted loop playsInline className="pf-img" /><div className="pf-corner">03 · SHARP</div><div className="pf-mask"></div><div className="pf-cap"><div className="name">SHARP BRICKLAYING</div><div className="cat">AERIAL / ON-SITE PHOTOGRAPHY</div></div></div>
            <div className="pf-slate">
              <div className="pf-slate-reel">END OF REEL · 03 PRODUCTIONS</div>
              <div className="pf-slate-next">NEXT SLOT — <a href="#contact">YOURS? →</a></div>
            </div>
          </div>
          <div className="pf-bar-wrap"><div className="pf-bar" id="pfBar"></div></div>
        </div>
      </div>

      {/* The ending: the word LENS, and a camera that goes through it. */}
      <div id="contact" className="lens-ending">
        {!staticRender && portalReady ? (
          <GlyphPortal
            word="LENS"
            fontFamily="'Bebas Neue', 'Arial Black', Arial, sans-serif"
            fontWeight={400}
            scrollLength={2.2}
            interactive
            enterLabel="Skip to the end"
            className="lens-portal"
            style={{ '--gp-paper': '#000', '--gp-ink': '#f5f5f0', '--gp-field': '#e8a658', '--gp-foreground': '#0a0805' }}
            background={<div className="lens-portal-field" />}
            front={<p className="lens-portal-kick">Pick a letter, then scroll through it.</p>}
          >
            <div className="lens-portal-content">
              <h2>READY TO BE<br /><em>seen</em>?</h2>
              <p className="sub">Tell Caleb what you&rsquo;re making and where the pictures need to end up.</p>
              <Link to={createPageUrl('StartProject') + '?service=lens'} className="btn lens-portal-btn">
                <span className="d"></span>Get in touch <span className="btn-arrow">→</span>
              </Link>
            </div>
          </GlyphPortal>
        ) : (
          <section className="cta-section">
            <h2 className="lr" style={{ '--lr-delay': '80ms' }}>READY TO BE<br /><em>seen</em>?</h2>
            <div className="sub lr" style={{ '--lr-delay': '150ms' }}>Tell Caleb what you&rsquo;re making and where the pictures need to end up.</div>
            <div className="cta-btns lr" style={{ '--lr-delay': '220ms' }}>
              <Link to={createPageUrl('StartProject') + '?service=lens'} className="btn primary">
                <span className="d"></span>Get in touch <span className="btn-arrow">→</span>
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer>
        <div>
          <div className="foot-logo">C4 LENS</div>
          <div style={{ marginTop: '6px', color: 'var(--ink-2)' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>C4 Studios</Link> · Perth W.A. · © {new Date().getFullYear()}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>ABN AVAILABLE ON REQUEST</div>
          <div style={{ marginTop: '6px', color: 'var(--ink-2)' }}>Perth, Western Australia</div>
        </div>
      </footer>

    </div>
  );
}
