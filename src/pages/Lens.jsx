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
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import gsap from 'gsap';

import '../components/lens/lens.css';

/* ── Force dark mode ── */
function useForceDark() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.className;
    root.classList.add('dark-mode');
    root.classList.remove('light-mode', 'vivid');
    return () => { root.className = prev; };
  }, []);
}

/* ── Data ── */
const QUOTES = [
  { lead: 'THE LENS —', body: 'that swallows the sun to feed the fire of the mind.' },
  { lead: 'THE LENS —', body: 'refusing to be filled by anything less than the whole of existence.' },
  { lead: 'THE LENS —', body: 'forged in the dark to prove the light has somewhere to go.' },
  { lead: 'THE LENS —', body: "the soul's only hunter." },
  { lead: 'THE LENS —', body: 'where chaos and dust become the gold of a thought.' },
];

const WORDS = [
  { text: 'character', col: '#d6ff3a' },
  { text: 'essence',   col: '#ff3fa3' },
  { text: 'nature',    col: '#3ff8ff' },
  { text: 'truth',     col: '#ff8a1c' },
  { text: 'soul',      col: '#f7ff00' },
  { text: 'voice',     col: '#b388ff' },
  { text: 'story',     col: '#3ff8ff' },
];

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   COMPONENT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function Lens() {
  useForceDark();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    /* â•â•â•â•â•â•â•â•â•â•â• FONTS â•â•â•â•â•â•â•â•â•â•â• */
    const fontElements = [];
    const pc1 = document.createElement('link');
    pc1.rel = 'preconnect'; pc1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pc1); fontElements.push(pc1);
    const pc2 = document.createElement('link');
    pc2.rel = 'preconnect'; pc2.href = 'https://fonts.gstatic.com'; pc2.crossOrigin = 'anonymous';
    document.head.appendChild(pc2); fontElements.push(pc2);
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Caveat:wght@500;700&display=swap';
    document.head.appendChild(fontLink); fontElements.push(fontLink);

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

    const TWEAKS = { cursor: true, ticks: false, motion: 65 };

    /* â•â•â•â•â•â•â•â•â•â•â• QUOTES â•â•â•â•â•â•â•â•â•â•â• */
    let qIdx = 0;
    const quoteInterval = setInterval(() => {
      const all = document.querySelectorAll('.q-item');
      if (!all.length) return;
      all[qIdx].classList.remove('on');
      qIdx = (qIdx + 1) % all.length;
      all[qIdx].classList.add('on');
    }, 6200);

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
    const innerShadowEl = document.getElementById('apertureInnerShadow2');

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
      }

      /* Inner shadow ring follows aperture edge */
      if (innerShadowEl) {
        innerShadowEl.setAttribute('r', Math.max(0, r - 1));
        innerShadowEl.style.opacity = bladeAlpha * 0.6;
      }
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
    const hudF = document.getElementById('hudF');
    const hudShutter = document.getElementById('hudShutter');
    const hudIso = document.getElementById('hudIso');
    const hudFocal = document.getElementById('hudFocal');
    const hudFocus = document.getElementById('hudFocus');
    const hudFrame = document.getElementById('hudFrame');
    const hudWb = document.getElementById('hudWb');
    const hudTc = document.getElementById('hudTc');
    const hudExp = document.getElementById('hudExp');
    const hudMeter = document.getElementById('hudMeter');

    /* Iris clearly visible behind the glass */
    if (lensEye) lensEye.style.opacity = '0.65';

    let audioCtx = null;
    function playTick() {
      if (!TWEAKS.ticks) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = 'square'; o.frequency.value = 1700 + Math.random() * 350;
        g.gain.value = 0.04; o.connect(g); g.connect(audioCtx.destination);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
        o.start(); o.stop(audioCtx.currentTime + 0.035);
      } catch (e) { /* ignore */ }
    }
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

    let lastTickStep = -1, lastMs = performance.now();
    let shutterFired = false;
    let heroRafId;

    const histBars = document.querySelectorAll('.hud-histogram-bar');
    const evTicks = document.querySelectorAll('.hud-ev-tick');

    function heroFrame(now) {
      const dt = Math.min(0.1, (now - lastMs) / 1000);
      lastMs = now;

      /* Slower smoothing for more deliberate feel */
      smoothT = lerp(smoothT, rawT, 0.06);
      const t = smoothT;
      const mScale = TWEAKS.motion / 65;

      /* ── SCROLL PHASES ──
       *
       * t = 0.00–0.12:  Idle/zoom phase — lens breathes, focus ring drifts, no blade movement
       * t = 0.12–0.88:  Blade close — aperture polygon shrinks from open to closed
       * t = 0.88–1.00:  Hold closed — shutter flash, eye fully revealed
       */
      const bladeRawT = clamp((t - 0.12) / 0.76, 0, 1);
      const bladeProgress = eio(bladeRawT);

      /* Focus ring rotation: slow idle drift + scroll-driven turn — capped for readable numbers */
      const idleDrift = now * 0.00012;
      const rot = bladeProgress * 22 * mScale + idleDrift * (1 - bladeProgress * 0.9);
      if (focusRing) focusRing.setAttribute('transform', `rotate(${rot.toFixed(2)} 500 500)`);

      /* Tick sounds */
      if (rawT > 0.01 && rawT < 0.85) {
        const step = Math.floor(rot / 8);
        if (step !== lastTickStep) {
          lastTickStep = step;
          playTick();
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

      /* Lens dolly — very subtle zoom as it "focuses" */
      const breath = Math.sin(now / 3000) * 0.002;
      const lensScale = 1 + bladeProgress * 0.04;
      if (lensWrap) lensWrap.style.transform = `scale(${(lensScale + breath).toFixed(5)}) translateZ(0)`;

      /* Glass layer: NO opacity change — blades must stay fully opaque */

      /* ── EYE / IRIS ──
       * Hidden behind solid blades — only visible through the aperture opening.
       * Becomes more visible as blades close and the eye peers through the small hole.
       */
      const eyeOpacity = lerp(0.65, 1.0, eoc(clamp(bladeProgress * 1.1, 0, 1)));
      if (lensEye) lensEye.style.opacity = eyeOpacity;

      if (eyePupil) {
        const pupilR = lerp(56, 68, eoc(clamp(bladeProgress * 1.05, 0, 1)));
        eyePupil.setAttribute('r', pupilR);
      }

      /* Rule-of-thirds grid: disabled — was showing as visible pattern */
      /* if (gridOverlay) gridOverlay.classList.toggle('on', t > 0.20); */

      /* UI fades */
      const uiFade = clamp(1 - t * 2.5, 0, 1);
      if (quoteBlock) {
        quoteBlock.style.opacity = uiFade;
        quoteBlock.style.transform = `translateY(${lerp(0, -10, 1 - uiFade)}px)`;
      }
      if (heroBottom) {
        heroBottom.style.opacity = clamp(1 - t * 3, 0, 1);
        heroBottom.style.pointerEvents = t > 0.08 ? 'none' : 'auto';
      }
      if (scrollInd) scrollInd.style.opacity = clamp(0.6 - rawT * 4, 0, 0.6);

      /* HUD camera readouts */
      if (hudF) hudF.textContent = (1.4 + bladeProgress * 14.6).toFixed(1).replace(/\.0$/, '');
      if (hudShutter) hudShutter.textContent = Math.round(250 - bladeProgress * 160);
      if (hudIso) hudIso.textContent = Math.round(400 + bladeProgress * 800);
      if (hudWb) hudWb.textContent = `${Math.round(5600 - bladeProgress * 400)}K`;
      if (hudFocal) hudFocal.textContent = ['35mm', '50mm', '85mm', '105mm', '135mm'][Math.min(4, Math.floor(bladeProgress * 5))];
      if (hudFocus) hudFocus.textContent = t > 0.94 ? 'LOCKED · â—' : `MANUAL · ${(0.5 + bladeProgress * 4.5).toFixed(1)}M`;
      if (hudFrame) hudFrame.textContent = `${String(Math.round(1 + rawT * 419)).padStart(3, '0')} / 420`;
      if (hudTc) {
        const tcS = Math.floor(now / 1000);
        hudTc.textContent = `${String(Math.floor(tcS / 3600) % 24).padStart(2, '0')}:${String(Math.floor(tcS / 60) % 60).padStart(2, '0')}:${String(tcS % 60).padStart(2, '0')}:${String(Math.floor((now / 41.6) % 24)).padStart(2, '0')}`;
      }

      /* Extra HUD: EV meter */
      if (hudExp) hudExp.textContent = bladeProgress < 0.5 ? '+' + (2 - bladeProgress * 4).toFixed(1) : (bladeProgress > 0.5 ? (-(bladeProgress - 0.5) * 4).toFixed(1) : '0.0');
      if (hudMeter) {
        const fill = hudMeter.querySelector('.hud-meter-bar-fill');
        if (fill) fill.style.width = `${clamp(bladeProgress * 110, 0, 100)}%`;
      }

      /* Histogram */
      histBars.forEach((bar, i) => {
        const h = 4 + Math.sin(now * 0.002 + i * 0.7 + bladeProgress * 3) * 12 + bladeProgress * 8;
        bar.style.height = `${clamp(h, 2, 28)}px`;
      });

      /* EV scale */
      evTicks.forEach((tick, i) => {
        const center = Math.floor(bladeProgress * (evTicks.length - 1));
        tick.classList.toggle('active', Math.abs(i - center) <= 1);
      });

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

      heroRafId = requestAnimationFrame(heroFrame);
    }
    heroRafId = requestAnimationFrame(heroFrame);

    /* â•â•â•â•â•â•â•â•â•â•â• WORD DRAW-IN — SVG stroke animation via GSAP â•â•â•â•â•â•â•â•â•â•â• */
    /* ═══ WORD DRAW-IN — per-letter SVG stroke via GSAP ═══ */
    let wIdx = 0;
    let wordTl = null;

    /* ---- Crayon scribble generator ---- */
    const SCRIBBLE_SHAPES = [
      'star', 'heart', 'flower', 'spiral', 'lightning',
      'cloud', 'squiggle', 'circle', 'crown', 'sparkles'
    ];
    let shapePool = [];
    function nextShape() {
      if (!shapePool.length) {
        shapePool = [...SCRIBBLE_SHAPES];
        for (let i = shapePool.length - 1; i > 0; i--) {
          const k = Math.floor(Math.random() * (i + 1));
          [shapePool[i], shapePool[k]] = [shapePool[k], shapePool[i]];
        }
      }
      return shapePool.pop();
    }

    function wb(x, y, a) {
      return [x + (Math.random() - 0.5) * a, y + (Math.random() - 0.5) * a];
    }

    function makeScribble(cx, cy, w, h, type) {
      const p = [];
      const j = 6;
      /* Use half-extents so shapes fill the space properly */
      const hw = w * 0.5, hh = h * 0.5;

      if (type === 'star') {
        const pts = 5, R = hh * 0.95, r = R * 0.38;
        const verts = [];
        const rot = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
        for (let i = 0; i < pts * 2; i++) {
          const a = (Math.PI / pts) * i + rot;
          const rad = i % 2 === 0 ? R : r;
          /* Stretch horizontally to fill wide viewBox */
          verts.push(wb(cx + Math.cos(a) * rad * (hw / hh) * 0.7, cy + Math.sin(a) * rad, j));
        }
        verts.push(verts[0]);
        let d = '';
        verts.forEach(([x, y], i) => { d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`; });
        p.push(d);
      }

      else if (type === 'heart') {
        const sx = hw * 0.75, sy = hh * 0.85;
        const ty = cy - sy * 0.3, by = cy + sy * 0.6;
        for (let pass = 0; pass < 2; pass++) {
          const off = pass * 3;
          const [mx, my] = wb(cx, ty, j + off);
          const [bx, bby] = wb(cx, by, j + off);
          p.push(`M ${mx} ${my} C ${cx - sx * 0.95 + (Math.random() - 0.5) * j} ${ty - sy * 0.7 + (Math.random() - 0.5) * j} ${cx - sx * 1.1 + (Math.random() - 0.5) * j} ${ty + sy * 0.45 + (Math.random() - 0.5) * j} ${bx} ${bby}`);
          p.push(`M ${bx} ${bby} C ${cx + sx * 1.1 + (Math.random() - 0.5) * j} ${ty + sy * 0.45 + (Math.random() - 0.5) * j} ${cx + sx * 0.95 + (Math.random() - 0.5) * j} ${ty - sy * 0.7 + (Math.random() - 0.5) * j} ${mx} ${my}`);
        }
      }

      else if (type === 'flower') {
        /* Doodle flower: closed oval/leaf petals with pointed tips, center circle */
        const petals = 7;
        const petalLen = hh * 0.85;
        const petalW = hw * 0.22;
        for (let pass = 0; pass < 2; pass++) {
          const drift = pass * 3;
          for (let i = 0; i < petals; i++) {
            const a = (Math.PI * 2 / petals) * i + (Math.random() - 0.5) * 0.12;
            const tipX = cx + Math.cos(a) * petalLen * (hw / hh) * 0.6 + drift;
            const tipY = cy + Math.sin(a) * petalLen + drift;
            const perpA = a + Math.PI / 2;
            const bulge = petalW * 1.1;
            /* Closed oval petal: center → tip via left bulge, tip → center via right bulge */
            const [cx0, cy0] = wb(cx + drift, cy + drift, j * 0.3);
            const [tx, ty] = wb(tipX, tipY, j * 0.7);
            const midLen = petalLen * 0.5;
            const cL1x = cx + Math.cos(a) * midLen * (hw/hh) * 0.6 + Math.cos(perpA) * bulge + drift + (Math.random()-0.5)*j;
            const cL1y = cy + Math.sin(a) * midLen + Math.sin(perpA) * bulge + drift + (Math.random()-0.5)*j;
            const cL2x = tipX + Math.cos(perpA) * bulge * 0.3 + (Math.random()-0.5)*j;
            const cL2y = tipY + Math.sin(perpA) * bulge * 0.3 + (Math.random()-0.5)*j;
            const cR1x = tipX - Math.cos(perpA) * bulge * 0.3 + (Math.random()-0.5)*j;
            const cR1y = tipY - Math.sin(perpA) * bulge * 0.3 + (Math.random()-0.5)*j;
            const cR2x = cx + Math.cos(a) * midLen * (hw/hh) * 0.6 - Math.cos(perpA) * bulge + drift + (Math.random()-0.5)*j;
            const cR2y = cy + Math.sin(a) * midLen - Math.sin(perpA) * bulge + drift + (Math.random()-0.5)*j;
            p.push(`M ${cx0} ${cy0} C ${cL1x} ${cL1y} ${cL2x} ${cL2y} ${tx} ${ty} C ${cR1x} ${cR1y} ${cR2x} ${cR2y} ${cx0} ${cy0}`);
          }
        }
        /* Center circle */
        const cr = hh * 0.16;
        for (let pass = 0; pass < 2; pass++) {
          let cd = '';
          const segs = 12;
          for (let s = 0; s <= segs; s++) {
            const a = (Math.PI * 2 / segs) * s;
            const [fx, fy] = wb(cx + Math.cos(a) * cr * (hw/hh) * 0.5 + pass*2, cy + Math.sin(a) * cr + pass*2, 2.5);
            cd += s === 0 ? `M ${fx} ${fy}` : ` L ${fx} ${fy}`;
          }
          p.push(cd);
        }
      }

      else if (type === 'spiral') {
        const turns = 2.5;
        const steps = 55;
        let d = '';
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const a = t * turns * Math.PI * 2;
          const rx = t * hw * 0.9;
          const ry = t * hh * 0.9;
          const [px, py] = wb(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, j * t * 0.6);
          d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
        }
        p.push(d);
      }

      else if (type === 'lightning') {
        /* Classic ⚡ bolt outline — angular Z-shape with horizontal notch through center */
        const bw = hw * 0.65, bh = hh * 0.95;
        /*
         * Traces the outline of a classic bolt:
         *   1 (top) → 2 (left-of-center) → 3 (notch sticks out right) →
         *   4 (bottom) → 5 (right-of-center) → 6 (notch sticks out left) → close
         *
         * The key is the horizontal notch across the middle is WIDE
         * and the bolt leans slightly left-to-right top-to-bottom
         */
        const bolt = [
          [cx + bw * 0.15, cy - bh],              /* 1: top point (slightly right) */
          [cx - bw * 0.65, cy - bh * 0.05],       /* 2: left edge at mid-height */
          [cx + bw * 0.1,  cy - bh * 0.15],       /* 3: notch juts RIGHT past center */
          [cx - bw * 0.15, cy + bh],              /* 4: bottom point (slightly left) */
          [cx + bw * 0.65, cy + bh * 0.05],       /* 5: right edge at mid-height */
          [cx - bw * 0.1,  cy + bh * 0.15],       /* 6: notch juts LEFT past center */
        ];
        for (let pass = 0; pass < 2; pass++) {
          let d = '';
          bolt.forEach(([x, y], i) => {
            const [wx, wy] = wb(x + pass * 4, y + pass * 3, j);
            d += i === 0 ? `M ${wx} ${wy}` : ` L ${wx} ${wy}`;
          });
          d += ' Z';
          p.push(d);
        }
      }

      else if (type === 'cloud') {
        /* Extra puffy cloud — big semicircle bumps using arcs */
        const cw2 = hw * 1.5, ch2 = hh * 1.0;
        const baseY = cy + ch2 * 0.2;
        /* 5 bumps with individual radii for puffiness */
        const bumps = [
          { x: -0.42, r: 0.38 }, { x: -0.2, r: 0.55 },
          { x: 0.02, r: 0.65 }, { x: 0.22, r: 0.5 }, { x: 0.42, r: 0.35 },
        ];
        for (let pass = 0; pass < 2; pass++) {
          const yo = pass * 4;
          let d = `M ${cx - cw2 * 0.55 + (Math.random()-0.5)*j} ${baseY + yo}`;
          bumps.forEach(b => {
            const bcx = cx + cw2 * b.x;
            const br = ch2 * b.r;
            /* Big puffy arc over each bump */
            const arcR = cw2 * 0.14;
            const left = bcx - arcR;
            const right = bcx + arcR;
            const peakY = baseY - br * 2.2 + yo;
            /* Two control points pushed high for rounder arc */
            const [c1x, c1y] = wb(left - arcR * 0.3, peakY - br * 0.5, j);
            const [c2x, c2y] = wb(right + arcR * 0.3, peakY - br * 0.5, j);
            d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${right + (Math.random()-0.5)*j} ${baseY + yo + (Math.random()-0.5)*3}`;
          });
          /* Flat bottom close */
          d += ` L ${cx - cw2 * 0.55 + (Math.random()-0.5)*j} ${baseY + yo}`;
          p.push(d);
        }
      }

      else if (type === 'squiggle') {
        const y0 = cy + hh * 0.6;
        const amp = hh * 0.25;
        const freq = 3 + Math.floor(Math.random() * 2);
        const lx = cx - hw * 0.95, rx = cx + hw * 0.95;
        for (let pass = 0; pass < 3; pass++) {
          const steps = 28;
          let d = '';
          const yOff = pass * 5;
          const phaseOff = pass * 0.7;
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const px = lx + (rx - lx) * t + (Math.random() - 0.5) * 3;
            const py = y0 + yOff + Math.sin(t * Math.PI * 2 * freq + phaseOff) * amp + (Math.random() - 0.5) * j;
            d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
          }
          p.push(d);
        }
      }

      else if (type === 'circle') {
        for (let pass = 0; pass < 2; pass++) {
          const rx = hw * 0.85 + pass * 5;
          const ry = hh * 0.85 + pass * 5;
          const segs = 18;
          let d = '';
          const off = pass * 0.4;
          for (let i = 0; i <= segs + 2; i++) {
            const a = (Math.PI * 2 / segs) * i + off;
            const [px, py] = wb(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, j * 1.5);
            d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
          }
          p.push(d);
        }
      }

      else if (type === 'crown') {
        /* Crown matching reference: 3 pointed peaks, smooth concave U-valleys, flared base, ball tips */
        const cw2 = hw * 1.5, ch2 = hh * 1.0;
        const baseY = cy + ch2 * 0.4;
        const topY = cy - ch2 * 0.55;
        const valleyY = cy + ch2 * 0.12;  /* valleys dip well below center */
        /* Peak X positions */
        const lPeak = cx - cw2 * 0.36;
        const cPeak = cx;
        const rPeak = cx + cw2 * 0.36;
        /* Outer edges — wider than peaks (flared) */
        const lEdge = cx - cw2 * 0.56;
        const rEdge = cx + cw2 * 0.56;
        for (let pass = 0; pass < 2; pass++) {
          const d0 = pass * 3;
          const [bLx, bLy] = wb(lEdge + d0, baseY + d0, j);
          const [bRx, bRy] = wb(rEdge + d0, baseY + d0, j);
          /* Left side: base-left curves up to left peak */
          const [lPkx, lPky] = wb(lPeak + d0, topY + ch2 * 0.12 + d0, j);
          /* Valley 1: between left and center peaks — control point at bottom of valley */
          const v1x = (lPeak + cPeak) / 2 + d0 + (Math.random()-0.5)*j;
          const v1y = valleyY + d0 + (Math.random()-0.5)*j;
          /* Center peak */
          const [cPkx, cPky] = wb(cPeak + d0, topY + d0, j);
          /* Valley 2: between center and right peaks */
          const v2x = (cPeak + rPeak) / 2 + d0 + (Math.random()-0.5)*j;
          const v2y = valleyY + d0 + (Math.random()-0.5)*j;
          /* Right peak */
          const [rPkx, rPky] = wb(rPeak + d0, topY + ch2 * 0.12 + d0, j);

          /* Build with cubic beziers for smoother U-valleys */
          let d = `M ${bLx} ${bLy}`;
          /* Left edge curves inward then up to left peak */
          const lCtrl1x = lEdge - cw2*0.02 + d0 + (Math.random()-0.5)*j;
          const lCtrl1y = valleyY - ch2*0.1 + d0 + (Math.random()-0.5)*j;
          d += ` Q ${lCtrl1x} ${lCtrl1y} ${lPkx} ${lPky}`;
          /* Left peak → valley → center peak (cubic for smooth U) */
          d += ` C ${lPkx + (Math.random()-0.5)*j} ${valleyY - ch2*0.15 + d0} ${v1x - cw2*0.06} ${v1y} ${v1x} ${v1y}`;
          d += ` C ${v1x + cw2*0.06} ${v1y} ${cPkx + (Math.random()-0.5)*j} ${valleyY - ch2*0.15 + d0} ${cPkx} ${cPky}`;
          /* Center peak → valley → right peak */
          d += ` C ${cPkx + (Math.random()-0.5)*j} ${valleyY - ch2*0.15 + d0} ${v2x - cw2*0.06} ${v2y} ${v2x} ${v2y}`;
          d += ` C ${v2x + cw2*0.06} ${v2y} ${rPkx + (Math.random()-0.5)*j} ${valleyY - ch2*0.15 + d0} ${rPkx} ${rPky}`;
          /* Right peak down to base-right */
          const rCtrl1x = rEdge + cw2*0.02 + d0 + (Math.random()-0.5)*j;
          const rCtrl1y = valleyY - ch2*0.1 + d0 + (Math.random()-0.5)*j;
          d += ` Q ${rCtrl1x} ${rCtrl1y} ${bRx} ${bRy}`;
          /* Flat-ish base back to start */
          const [bMx, bMy] = wb(cx + d0, baseY + ch2 * 0.06 + d0, j * 0.3);
          d += ` Q ${bMx} ${bMy} ${bLx} ${bLy}`;
          p.push(d);
        }
        /* Circles on each peak tip */
        const peakXs = [lPeak, cPeak, rPeak];
        const peakYs = [topY + ch2*0.12, topY, topY + ch2*0.12];
        for (let i = 0; i < 3; i++) {
          const dr = ch2 * 0.09;
          let dd = '';
          for (let s = 0; s <= 12; s++) {
            const a = (Math.PI * 2 / 12) * s;
            const [fx, fy] = wb(peakXs[i] + Math.cos(a) * dr * (hw/hh) * 0.5, peakYs[i] - dr * 1.5 + Math.sin(a) * dr, 2);
            dd += s === 0 ? `M ${fx} ${fy}` : ` L ${fx} ${fy}`;
          }
          p.push(dd);
        }
        /* Band stripe near base */
        const bandY = baseY - ch2 * 0.07;
        for (let pass = 0; pass < 2; pass++) {
          const by = bandY + pass * (ch2 * 0.06);
          const [blx2, bly2] = wb(lEdge + cw2*0.03, by, 3);
          const [brx2, bry2] = wb(rEdge - cw2*0.03, by, 3);
          p.push(`M ${blx2} ${bly2} L ${brx2} ${bry2}`);
        }
      }

      else if (type === 'sparkles') {
        /* Random scatter of 4-6 sparkles across the word area */
        const count = 4 + Math.floor(Math.random() * 3); /* 4-6 */
        for (let i = 0; i < count; i++) {
          const sx = cx + (Math.random() - 0.5) * hw * 1.8;
          const sy = cy + (Math.random() - 0.5) * hh * 1.6;
          const sz = hh * (0.14 + Math.random() * 0.22);
          const szx = sz * (hw / hh) * 0.5;
          /* Vertical spike */
          p.push(`M ${sx} ${sy - sz} Q ${sx + (Math.random()-0.5)*5} ${sy} ${sx} ${sy + sz}`);
          /* Horizontal spike */
          p.push(`M ${sx - szx} ${sy} Q ${sx} ${sy + (Math.random()-0.5)*5} ${sx + szx} ${sy}`);
          /* Diagonal ticks */
          const d1 = sz * 0.4;
          const d1x = d1 * (hw / hh) * 0.4;
          p.push(`M ${sx - d1x} ${sy - d1} Q ${sx + (Math.random()-0.5)*3} ${sy + (Math.random()-0.5)*3} ${sx + d1x} ${sy + d1}`);
          p.push(`M ${sx + d1x} ${sy - d1} Q ${sx + (Math.random()-0.5)*3} ${sy + (Math.random()-0.5)*3} ${sx - d1x} ${sy + d1}`);
        }
      }

      return p;
    }

    function spawnScribbles(viewBox, color) {
      const scribbleSvg = document.getElementById('scribbleSvg');
      if (!scribbleSvg) return [];
      while (scribbleSvg.firstChild) scribbleSvg.removeChild(scribbleSvg.firstChild);
      scribbleSvg.setAttribute('viewBox', viewBox);

      const NS = 'http://www.w3.org/2000/svg';
      const [vx, vy, vw, vh] = viewBox.split(' ').map(Number);
      const vcx = vx + vw / 2;
      const vcy = vy + vh / 2;

      /* Crayon-texture SVG filter: rough waxy edges */
      const defs = document.createElementNS(NS, 'defs');
      const filter = document.createElementNS(NS, 'filter');
      filter.setAttribute('id', 'crayonTex');
      filter.setAttribute('x', '-10%');
      filter.setAttribute('y', '-10%');
      filter.setAttribute('width', '120%');
      filter.setAttribute('height', '120%');
      const turb = document.createElementNS(NS, 'feTurbulence');
      turb.setAttribute('type', 'turbulence');
      turb.setAttribute('baseFrequency', '0.035');
      turb.setAttribute('numOctaves', '4');
      turb.setAttribute('seed', String(Math.floor(Math.random() * 999)));
      turb.setAttribute('result', 'noise');
      filter.appendChild(turb);
      const disp = document.createElementNS(NS, 'feDisplacementMap');
      disp.setAttribute('in', 'SourceGraphic');
      disp.setAttribute('in2', 'noise');
      disp.setAttribute('scale', '3');
      disp.setAttribute('xChannelSelector', 'R');
      disp.setAttribute('yChannelSelector', 'G');
      filter.appendChild(disp);
      defs.appendChild(filter);
      scribbleSvg.appendChild(defs);

      const shape = nextShape();
      const allPaths = [];
      const scribs = makeScribble(vcx, vcy, vw * 1.35, vh * 1.35, shape);
      scribs.forEach(d => {
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', 'scribble-line');
        path.setAttribute('filter', 'url(#crayonTex)');
        path.style.stroke = color;
        path.style.strokeWidth = String(4 + Math.random() * 5);
        scribbleSvg.appendChild(path);
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        allPaths.push(path);
      });
      return allPaths;
    }

    function animateWord() {
      const svgEl = document.getElementById('wordSvg');
      if (!svgEl) return;

      /* Kill previous timeline & clear old letters */
      if (wordTl) { wordTl.kill(); wordTl = null; }
      while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

      const word = WORDS[wIdx];
      const letters = word.text.split('');
      const NS = 'http://www.w3.org/2000/svg';
      const dashLen = 800;

      /* Set a temporary large viewBox so text renders for measurement */
      svgEl.setAttribute('viewBox', '0 -200 2000 400');

      /* Create a hidden measurer text to get per-letter x offsets */
      const measurer = document.createElementNS(NS, 'text');
      measurer.setAttribute('x', '0');
      measurer.setAttribute('y', '0');
      measurer.setAttribute('class', 'svg-word-letter');
      measurer.textContent = word.text;
      svgEl.appendChild(measurer);

      /* Measure full word bbox */
      const fullBox = measurer.getBBox();

      /* Get each letter's start x using getSubStringLength */
      const offsets = [];
      for (let i = 0; i < letters.length; i++) {
        offsets.push(i === 0 ? 0 : measurer.getSubStringLength(0, i));
      }
      svgEl.removeChild(measurer);

      /* Set viewBox centered on the word */
      const padX = 20, padY = 15;
      const vb = `${fullBox.x - padX} ${fullBox.y - padY} ${fullBox.width + padX * 2} ${fullBox.height + padY * 2}`;
      svgEl.setAttribute('viewBox', vb);

      /* Spawn crayon scribbles behind the word */
      const scribblePaths = spawnScribbles(vb, word.col);

      /* Create individual letter <text> elements */
      const letterEls = letters.map((ch, i) => {
        const t = document.createElementNS(NS, 'text');
        t.setAttribute('x', String(offsets[i]));
        t.setAttribute('y', '0');
        t.setAttribute('class', 'svg-word-letter');
        t.textContent = ch;
        svgEl.appendChild(t);
        return t;
      });

      /* Build GSAP timeline */
      wordTl = gsap.timeline();

      /* Phase 1: Reset all letters */
      wordTl.set(letterEls, {
        stroke: word.col,
        strokeWidth: 2.5,
        fill: word.col,
        fillOpacity: 0,
        strokeOpacity: 1,
        strokeDasharray: dashLen,
        strokeDashoffset: dashLen,
      });

      /* Phase 1b: Animate scribbles drawing in — starts slightly before letters */
      if (scribblePaths.length) {
        scribblePaths.forEach((p, i) => {
          const delay = i * 0.08;
          wordTl.to(p, {
            strokeDashoffset: 0,
            duration: 0.5 + Math.random() * 0.3,
            ease: 'power1.out',
          }, delay);
        });
      }

      /* Phase 2: Draw each letter sequentially */
      const drawDur = 0.45;
      const staggerGap = 0.12;
      letterEls.forEach((el, i) => {
        const offset = i * staggerGap;
        wordTl.to(el, {
          strokeDashoffset: 0,
          duration: drawDur,
          ease: 'power2.out',
        }, offset);
        wordTl.to(el, {
          fillOpacity: 1,
          duration: 0.3,
          ease: 'power1.in',
        }, offset + drawDur * 0.5);
      });

      const drawEnd = (letterEls.length - 1) * staggerGap + drawDur;

      /* Phase 3: Glow pulse */
      wordTl.to(letterEls, {
        filter: `drop-shadow(0 0 18px ${word.col}88) drop-shadow(0 0 5px ${word.col}cc)`,
        duration: 0.4,
        ease: 'power2.out',
      }, drawEnd + 0.1);

      /* Phase 4: Hold, then fade out */
      wordTl.to(letterEls, {
        fillOpacity: 0,
        strokeOpacity: 0,
        filter: 'none',
        duration: 0.5,
        ease: 'power2.in',
      }, drawEnd + 1.6);

      /* Fade out scribbles too */
      if (scribblePaths.length) {
        wordTl.to(scribblePaths, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
        }, drawEnd + 1.6);
      }

      /* Next word */
      wordTl.call(() => {
        wIdx = (wIdx + 1) % WORDS.length;
        animateWord();
      });
    }

    let captureStarted = false;
    const capIO = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !captureStarted) {
        captureStarted = true;
        /* Small delay before first word */
        setTimeout(animateWord, 400);
      }
    }, { threshold: 0.3 });
    const captureEl = document.getElementById('capture');
    if (captureEl) capIO.observe(captureEl);


    /* â•â•â•â•â•â•â•â•â•â•â• PORTFOLIO SCROLL â•â•â•â•â•â•â•â•â•â•â• */
    const pfOuter = document.getElementById('portfolioOuter');
    const pfTrack = document.getElementById('pfTrack');
    const pfBar = document.getElementById('pfBar');
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
      pfBar.style.width = `${t2 * 100}%`;
    }
    window.addEventListener('scroll', onPfScroll, { passive: true });
    const onResize = () => { sizePortfolio(); onPfScroll(); };
    window.addEventListener('resize', onResize);
    requestAnimationFrame(() => { sizePortfolio(); onPfScroll(); });

    /* â•â•â•â•â•â•â•â•â•â•â• CURSOR â•â•â•â•â•â•â•â•â•â•â• */
    const reticle = document.getElementById('reticle');
    let rx = window.innerWidth / 2, ry = window.innerHeight / 2, tx = rx, ty = ry;
    const onMouseMove = (e) => { tx = e.clientX; ty = e.clientY; };
    document.addEventListener('mousemove', onMouseMove);
    let cursorRafId;
    function animR() {
      rx = lerp(rx, tx, 0.22); ry = lerp(ry, ty, 0.22);
      if (reticle) reticle.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      cursorRafId = requestAnimationFrame(animR);
    }
    cursorRafId = requestAnimationFrame(animR);

    /* â•â•â•â•â•â•â•â•â•â•â• TWEAKS â•â•â•â•â•â•â•â•â•â•â• */
    function applyTweaks() {
      document.body.classList.toggle('cursor-on', TWEAKS.cursor);
      if (reticle) reticle.style.display = TWEAKS.cursor ? 'block' : 'none';
      const tc = document.getElementById('togCursor'), tt = document.getElementById('togTicks'), mr = document.getElementById('motionRange');
      if (tc) tc.classList.toggle('on', TWEAKS.cursor);
      if (tt) tt.classList.toggle('on', TWEAKS.ticks);
      if (mr) mr.value = TWEAKS.motion;
    }
    applyTweaks();
    const togCursor = document.getElementById('togCursor');
    const togTicks = document.getElementById('togTicks');
    const motionRange = document.getElementById('motionRange');
    const onTogC = () => { TWEAKS.cursor = !TWEAKS.cursor; applyTweaks(); };
    const onTogT = () => { TWEAKS.ticks = !TWEAKS.ticks; applyTweaks(); };
    const onMotion = (e) => { TWEAKS.motion = +e.target.value; };
    if (togCursor) togCursor.addEventListener('click', onTogC);
    if (togTicks) togTicks.addEventListener('click', onTogT);
    if (motionRange) motionRange.addEventListener('input', onMotion);
    const onAudioInit = () => { if (!audioCtx) try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} };
    document.addEventListener('click', onAudioInit, { once: true });

    /* â•â•â•â•â•â•â•â•â•â•â• CLEANUP â•â•â•â•â•â•â•â•â•â•â• */
    return () => {
      cancelAnimationFrame(heroRafId);
      cancelAnimationFrame(cursorRafId);
      clearInterval(quoteInterval);
      if (wordTl) { wordTl.kill(); wordTl = null; }
      window.removeEventListener('scroll', onHeroScroll);
      window.removeEventListener('scroll', onPfScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onAudioInit);
      if (togCursor) togCursor.removeEventListener('click', onTogC);
      if (togTicks) togTicks.removeEventListener('click', onTogT);
      if (motionRange) motionRange.removeEventListener('input', onMotion);
      capIO.disconnect();
      document.body.style.background = prevBodyBg;
      document.body.classList.remove('cursor-on');
      if (siteHeader) siteHeader.style.display = '';
      fontElements.forEach(el => { if (el.parentNode) el.parentNode.removeChild(el); });
      if (audioCtx) try { audioCtx.close(); } catch (e) {}
    };
  }, []);

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     JSX
     â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  return (
    <div className="lens-page">
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
          <a href="#capture" onClick={() => setMobileMenuOpen(false)}>Our Work</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#packages" onClick={() => setMobileMenuOpen(false)}>Packages</a>
          <a href="#caleb" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="book">Book a Call</a>
        </div>
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
              <span className="k" style={{ marginTop: '5px' }}>C4 LENS / CALEB WALKER / PERTH W.A.</span>
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

            {/* EV meter — top center */}
            <div className="hud-meter" id="hudMeter" style={{ position: 'absolute', top: '90px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
              <span>EV <span id="hudExp">+2.0</span></span>
              <div className="hud-meter-bar"><div className="hud-meter-bar-fill" style={{ width: '0%' }}></div></div>
            </div>

            {/* Histogram — bottom center */}
            <div className="hud-histogram">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="hud-histogram-bar" style={{ height: '4px' }}></div>
              ))}
            </div>

            {/* EV scale — right edge */}
            <div className="hud-ev-scale" style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)' }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={`hud-ev-tick${i === 4 ? ' active' : ''}`}></div>
              ))}
            </div>
          </div>

          <div className="hero-stage">
            <div className="lens-wrap" id="lensWrap">
              <div className="barrel-anchor"></div>

              {/* EYE — visible iris behind the lens glass */}
              <div className="lens-eye" id="lensEye">
                <svg className="eye-svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <radialGradient id="irisBody" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0a0804"/>
                      <stop offset="14%" stopColor="#0a0804"/>
                      <stop offset="18%" stopColor="#3d2a10"/>
                      <stop offset="28%" stopColor="#8b6830"/>
                      <stop offset="42%" stopColor="#b08840"/>
                      <stop offset="55%" stopColor="#9a7432"/>
                      <stop offset="68%" stopColor="#c49a48"/>
                      <stop offset="78%" stopColor="#8a6428"/>
                      <stop offset="88%" stopColor="#4a3018"/>
                      <stop offset="100%" stopColor="#1a0e06"/>
                    </radialGradient>
                    <radialGradient id="irisRing" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="transparent"/>
                      <stop offset="14%" stopColor="transparent"/>
                      <stop offset="16%" stopColor="rgba(180,140,60,.4)"/>
                      <stop offset="18%" stopColor="transparent"/>
                      <stop offset="65%" stopColor="transparent"/>
                      <stop offset="68%" stopColor="rgba(140,100,40,.25)"/>
                      <stop offset="71%" stopColor="transparent"/>
                      <stop offset="100%" stopColor="transparent"/>
                    </radialGradient>
                    <filter id="irisGrain" x="-5%" y="-5%" width="110%" height="110%">
                      <feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="4"/>
                      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .18 0"/>
                      <feComposite in2="SourceGraphic" operator="in"/>
                    </filter>
                  </defs>
                  {/* Sclera (white of eye) */}
                  <circle cx="200" cy="200" r="200" fill="#e8e0d8"/>
                  {/* Iris */}
                  <circle cx="200" cy="200" r="145" fill="url(#irisBody)"/>
                  <circle cx="200" cy="200" r="145" fill="url(#irisRing)"/>
                  <circle cx="200" cy="200" r="145" filter="url(#irisGrain)"/>
                  {/* Iris fiber lines — radial streaks */}
                  {Array.from({ length: 36 }).map((_, i) => {
                    const a = (i / 36) * Math.PI * 2;
                    const x1 = 200 + Math.cos(a) * 42;
                    const y1 = 200 + Math.sin(a) * 42;
                    const x2 = 200 + Math.cos(a) * 138;
                    const y2 = 200 + Math.sin(a) * 138;
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(160,120,50,.12)" strokeWidth={i % 3 === 0 ? "1.5" : "0.6"}/>;
                  })}
                  {/* Limbal ring — dark ring around iris edge */}
                  <circle cx="200" cy="200" r="145" fill="none" stroke="#1a0e04" strokeWidth="4"/>
                  {/* Pupil */}
                  <circle id="eyePupil" cx="200" cy="200" r="56" fill="#050302"/>
                  {/* Pupil edge highlight */}
                  <circle cx="200" cy="200" r="56" fill="none" stroke="rgba(120,90,40,.3)" strokeWidth="1"/>
                  {/* Specular highlights — bright catchlights */}
                  <ellipse cx="165" cy="162" rx="18" ry="14" fill="rgba(255,255,250,.65)" transform="rotate(-20 165 162)"/>
                  <ellipse cx="228" cy="225" rx="8" ry="5" fill="rgba(255,255,250,.25)" transform="rotate(15 228 225)"/>
                </svg>
              </div>

              {/* LENS SVG — barrel, focus ring, f-stops, glass, aperture */}
              <div className="lens-layer" id="lensLayer">
                <svg className="lens-svg" viewBox="0 0 1000 1000">
                  <defs>
                    <radialGradient id="gBarrel" cx="50%" cy="50%" r="50%">
                      <stop offset="58%" stopColor="#0a0a0c"/>
                      <stop offset="74%" stopColor="#1c1c1f"/>
                      <stop offset="82%" stopColor="#3a3a3c"/>
                      <stop offset="87%" stopColor="#626266"/>
                      <stop offset="91%" stopColor="#2c2c2f"/>
                      <stop offset="96%" stopColor="#0c0c0e"/>
                      <stop offset="100%" stopColor="#020202"/>
                    </radialGradient>
                    <radialGradient id="gRim" cx="48%" cy="36%" r="55%">
                      <stop offset="85%" stopColor="rgba(255,255,255,0)"/>
                      <stop offset="91%" stopColor="rgba(255,255,255,.24)"/>
                      <stop offset="96%" stopColor="rgba(255,255,255,.06)"/>
                      <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                    </radialGradient>
                    <radialGradient id="gAR" cx="33%" cy="28%" r="32%">
                      <stop offset="0%" stopColor="rgba(100,165,220,.18)"/>
                      <stop offset="28%" stopColor="rgba(70,195,155,.08)"/>
                      <stop offset="62%" stopColor="rgba(55,95,210,.03)"/>
                      <stop offset="100%" stopColor="rgba(55,95,210,0)"/>
                    </radialGradient>
                    <radialGradient id="gARw" cx="73%" cy="76%" r="28%">
                      <stop offset="0%" stopColor="rgba(232,166,88,.22)"/>
                      <stop offset="55%" stopColor="rgba(200,70,70,.06)"/>
                      <stop offset="100%" stopColor="rgba(200,70,70,0)"/>
                    </radialGradient>
                    <radialGradient id="gSpec" cx="35%" cy="28%" r="9%">
                      <stop offset="0%" stopColor="rgba(255,255,255,.28)"/>
                      <stop offset="45%" stopColor="rgba(255,255,255,.05)"/>
                      <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                    </radialGradient>
                    <radialGradient id="gWell" cx="50%" cy="50%" r="50%">
                      <stop offset="52%" stopColor="rgba(0,0,0,0)"/>
                      <stop offset="72%" stopColor="rgba(0,0,0,.35)"/>
                      <stop offset="100%" stopColor="rgba(0,0,0,.88)"/>
                    </radialGradient>
                    <pattern id="pKnurl" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
                      <rect width="5" height="5" fill="#0d0d0f"/>
                      <line x1="0" y1="0" x2="5" y2="5" stroke="#252528" strokeWidth=".8"/>
                      <line x1="5" y1="0" x2="0" y2="5" stroke="#0a0a0c" strokeWidth=".3"/>
                    </pattern>
                    <linearGradient id="gRed" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4a1212"/>
                      <stop offset="48%" stopColor="#b53038"/>
                      <stop offset="100%" stopColor="#3a1010"/>
                    </linearGradient>
                    {/* Blade gradients — dark blued-steel with subtle brushed-metal variation */}
                    <linearGradient id="gBladeA" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2e2e34"/>
                      <stop offset="40%" stopColor="#222228"/>
                      <stop offset="100%" stopColor="#18181e"/>
                    </linearGradient>
                    <linearGradient id="gBladeB" x1="1" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2a2a30"/>
                      <stop offset="40%" stopColor="#1e1e24"/>
                      <stop offset="100%" stopColor="#141418"/>
                    </linearGradient>
                    {/* Clip: nothing escapes the barrel inner circle */}
                    <clipPath id="apertureClip">
                      <circle cx="500" cy="500" r="395"/>
                    </clipPath>
                  </defs>

                  {/* Barrel housing */}
                  <circle cx="500" cy="500" r="498" fill="#020202"/>
                  <circle cx="500" cy="500" r="490" fill="url(#gBarrel)"/>
                  <circle cx="500" cy="500" r="490" fill="url(#gRim)" style={{ mixBlendMode: 'screen' }}/>
                  {/* Filter thread ring — fine grooves at outer edge */}
                  <circle cx="500" cy="500" r="496" fill="none" stroke="#111114" strokeWidth="0.5"/>
                  <circle cx="500" cy="500" r="493" fill="none" stroke="#1a1a1c" strokeWidth="1"/>
                  <circle cx="500" cy="500" r="490" fill="none" stroke="#0e0e10" strokeWidth="0.5"/>
                  <circle cx="500" cy="500" r="487" fill="none" stroke="#1a1a1c" strokeWidth="0.5"/>
                  <circle cx="500" cy="500" r="484" fill="none" stroke="#0e0e10" strokeWidth="0.5"/>
                  {/* Knurl grip texture */}
                  <circle cx="500" cy="500" r="466" fill="none" stroke="url(#pKnurl)" strokeWidth="32"/>
                  {/* Barrel machining highlight — subtle upper arc reflection */}
                  <path d="M228 332A296 296 0 0 1 772 332" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="28"/>
                  <path d="M260 300A280 280 0 0 1 740 300" fill="none" stroke="rgba(255,255,255,.015)" strokeWidth="12"/>
                  {/* Inner barrel detail rings — stepped elements */}
                  <circle cx="500" cy="500" r="448" fill="none" stroke="#111114" strokeWidth="1.5"/>
                  <circle cx="500" cy="500" r="444" fill="none" stroke="#0a0a0d" strokeWidth="0.5"/>
                  <circle cx="500" cy="500" r="416" fill="none" stroke="#0c0c0f" strokeWidth="1"/>
                  <circle cx="500" cy="500" r="412" fill="none" stroke="#080810" strokeWidth="0.5"/>
                  <circle cx="500" cy="500" r="398" fill="none" stroke="#111116" strokeWidth="0.8"/>
                  <circle cx="500" cy="500" r="396" fill="none" stroke="#0a0a0e" strokeWidth="0.5"/>

                  {/* Brand text on barrel — "C4 LENS" carved into metal */}
                  <text x="500" y="62" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7" fill="#3a3a3a" letterSpacing="4" fontWeight="500">C4 LENS</text>
                  {/* Focal length marking */}
                  <text x="500" y="938" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6.5" fill="#2a2a2a" letterSpacing="3" fontWeight="400">50mm  1:1.4  Ø72</text>
                  {/* Serial number — tiny, subtle */}
                  {(() => {
                    const rad = 135 * Math.PI / 180;
                    const R = 480;
                    const x = (500 + Math.cos(rad) * R).toFixed(1);
                    const y = (500 + Math.sin(rad) * R).toFixed(1);
                    return (
                      <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                        fontFamily="Geist Mono,monospace" fontSize="5" fill="#1e1e1e"
                        letterSpacing="2" transform={`rotate(${135 + 90} ${x} ${y})`}>№ 840072</text>
                    );
                  })()}

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

                  {/* Barrel housing rings */}
                  <circle cx="500" cy="500" r="418" fill="none" stroke="url(#gRed)" strokeWidth="2.5" opacity=".9"/>
                  <circle cx="500" cy="500" r="404" fill="none" stroke="#030305" strokeWidth="8"/>

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

                  {/* Glass rings behind blades */}
                  <circle cx="500" cy="500" r="385" fill="none" stroke="rgba(180,205,230,.05)" strokeWidth="1"/>
                  <circle cx="500" cy="500" r="370" fill="none" stroke="rgba(140,160,200,.04)" strokeWidth="0.5"/>
                  <circle cx="500" cy="500" r="335" fill="none" stroke="rgba(180,200,230,.08)" strokeWidth="1"/>
                  <circle cx="500" cy="500" r="310" fill="none" stroke="rgba(160,180,210,.03)" strokeWidth="0.5"/>
                  <circle cx="500" cy="500" r="280" fill="none" stroke="rgba(140,170,220,.04)" strokeWidth="0.8"/>

                  {/* Lens element coating reflections — multi-color AR coating */}
                  <circle cx="500" cy="500" r="360" fill="none" stroke="rgba(80,200,120,.04)" strokeWidth="12" strokeDasharray="80 200"/>
                  <circle cx="500" cy="500" r="340" fill="none" stroke="rgba(120,80,200,.03)" strokeWidth="8" strokeDasharray="60 240"/>
                  <circle cx="500" cy="500" r="300" fill="none" stroke="rgba(80,160,220,.03)" strokeWidth="6" strokeDasharray="40 280"/>

                  {/* Glass sheen BEHIND blades */}
                  <circle cx="500" cy="500" r="385" fill="url(#gAR)" style={{ mixBlendMode: 'screen' }} pointerEvents="none"/>
                  <circle cx="500" cy="500" r="385" fill="url(#gARw)" style={{ mixBlendMode: 'screen' }} opacity=".4" pointerEvents="none"/>
                  <circle cx="500" cy="500" r="385" fill="url(#gWell)" style={{ mixBlendMode: 'multiply' }} pointerEvents="none"/>

                  {/* â•â•â•â•â•â•â• APERTURE BLADES — fully opaque metal, on top of all glass â•â•â•â•â•â•â• */}
                  <g id="apertureBlades" clipPath="url(#apertureClip)">
                    <path className="blade-seg" fill="url(#gBladeA)" fillOpacity="1" stroke="#3a3a40" strokeWidth="0.8"/>
                    <path className="blade-seg" fill="url(#gBladeB)" fillOpacity="1" stroke="#3a3a40" strokeWidth="0.8"/>
                    <path className="blade-seg" fill="url(#gBladeA)" fillOpacity="1" stroke="#3a3a40" strokeWidth="0.8"/>
                    <path className="blade-seg" fill="url(#gBladeB)" fillOpacity="1" stroke="#3a3a40" strokeWidth="0.8"/>
                    <path className="blade-seg" fill="url(#gBladeA)" fillOpacity="1" stroke="#3a3a40" strokeWidth="0.8"/>
                    <path className="blade-seg" fill="url(#gBladeB)" fillOpacity="1" stroke="#3a3a40" strokeWidth="0.8"/>
                    <path className="blade-seg" fill="url(#gBladeA)" fillOpacity="1" stroke="#3a3a40" strokeWidth="0.8"/>
                    <path className="blade-seg" fill="url(#gBladeB)" fillOpacity="1" stroke="#3a3a40" strokeWidth="0.8"/>
                    <path className="blade-seg" fill="url(#gBladeA)" fillOpacity="1" stroke="#3a3a40" strokeWidth="0.8"/>
                    <circle id="apertureInnerShadow2" cx="500" cy="500" r="392" fill="none" stroke="rgba(0,0,0,.5)" strokeWidth="4"/>
                  </g>

                  {/* Glass highlight — specular reflections from lens elements */}
                  <ellipse cx="396" cy="352" rx="80" ry="28" fill="url(#gSpec)" transform="rotate(-28 396 352)" pointerEvents="none"/>
                  <ellipse cx="358" cy="322" rx="32" ry="10" fill="rgba(255,255,255,.12)" transform="rotate(-30 358 322)" pointerEvents="none"/>
                  {/* Secondary coating reflection — opposite side, warmer */}
                  <ellipse cx="620" cy="640" rx="50" ry="18" fill="rgba(232,180,100,.04)" transform="rotate(25 620 640)" pointerEvents="none"/>
                  <ellipse cx="590" cy="620" rx="22" ry="7" fill="rgba(255,220,160,.06)" transform="rotate(20 590 620)" pointerEvents="none"/>
                </svg>
              </div>

              <div className="tick-flash" id="tickFlash"></div>
            </div>
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

          <div className="hero-quote" id="quoteBlock">
            <div className="q-eyebrow"><span className="bar"></span>C4 LENS · CALEB WALKER · PERTH<span className="bar"></span></div>
            <div className="q-stack" id="quoteStack">
              {QUOTES.map((q, i) => (
                <div key={i} className={`q-item${i === 0 ? ' on' : ''}`}>
                  <span className="q-lead">{q.lead}</span>{q.body}
                </div>
              ))}
            </div>
          </div>

          <div className="hero-bottom" id="heroBottom">
            <div className="tagline-sub">Photography · Videography · Post-Production</div>
            <div className="h-cta">
              <a href="#packages" className="btn primary"><span className="d"></span>View packages</a>
              <a href="#contact" className="btn">Book a call <span className="btn-arrow">→</span></a>
            </div>
            <div className="scroll-ind" id="scrollInd"><span className="arr">↓</span>SCROLL TO FOCUS</div>
          </div>
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â• WHAT WE CAPTURE — full-viewport paint canvas â•â•â•â•â•â•â•â• */}
      <section className="capture" id="capture">
        <div className="cap-inner">
          <div className="cap-header">
            <div className="sec-num"><span className="bar"></span>§ 01 — WHAT WE CAPTURE</div>
            <div className="cap-kicker">We don&rsquo;t photograph<br /><em>businesses.</em></div>
          </div>

          <div className="cap-stmt">
            <div className="cap-stmt-fixed">
              <span className="cap-stmt-label">We exist to capture the</span>
              <div className="word-stage" id="wordStage">
                <svg id="scribbleSvg" className="scribble-svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg>
                <svg id="wordSvg" className="word-svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg>
              </div>
              <span className="cap-stmt-label">of your brand.</span>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat"><div className="num">50<em>+</em></div><div className="lbl">Australian Businesses</div></div>
            <div className="stat"><div className="num">200<em>+</em></div><div className="lbl">Assets Delivered</div></div>
            <div className="stat"><div className="num">&lt;7</div><div className="lbl">Days Turnaround</div></div>
            <div className="stat"><div className="num">100<em>%</em></div><div className="lbl">Australian-Based</div></div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• SERVICES â•â•â•â•â•â•â•â• */}
      <section className="slab dark" id="services">
        <div className="sec-num"><span className="bar"></span>§ 02 — HOW WE WORK</div>
        <h2>FOUR WAYS<br />TO BE <em>unforgettable.</em></h2>
        <div className="svc-grid">
          <div className="svc-card">
            <div className="svc-tag">Photography</div>
            <h3>REPLACE STOCK<br />WITH PROOF.</h3>
            <div className="svc-tagline">&ldquo;Real beats perfect.&rdquo;</div>
            <div className="desc">Team portraits that carry weight. Workspace environments that tell your story. Product imagery that converts. Headshots that feel like you — not a LinkedIn template.</div>
            <div className="svc-foot">f/1.4 · STILLS · RAW + EDITED</div>
          </div>
          <div className="svc-card">
            <div className="svc-tag">Videography</div>
            <h3>MOTION THAT<br />EARNS ATTENTION.</h3>
            <div className="svc-tagline">&ldquo;Every second must earn its place.&rdquo;</div>
            <div className="desc">Brand films that stop the scroll. Social content that converts. Event coverage that endures. Founder pieces that humanise the person behind the business.</div>
            <div className="svc-foot">4K · 24P · CINEMATIC</div>
          </div>
          <div className="svc-card">
            <div className="svc-tag">Drone &amp; Aerial</div>
            <h3>THE PERSPECTIVE<br />THEY&rsquo;VE NEVER SEEN.</h3>
            <div className="svc-tagline">&ldquo;Scale that no phone can fake.&rdquo;</div>
            <div className="desc">Licensed drone work capturing locations, events, and construction that demand context. A perspective most brands never think to show — until they see it.</div>
            <div className="svc-foot">LICENSED · 4K · AERIAL</div>
          </div>
          <div className="svc-card">
            <div className="svc-tag">Post-Production</div>
            <h3>CUT FOR THE<br />PLATFORM.</h3>
            <div className="svc-tagline">&ldquo;Footage is a rough draft.&rdquo;</div>
            <div className="desc">Short-form reels. Brand cutdowns. Event highlights. Colour grading, sound design, motion graphics. Bring your raw footage — we&rsquo;ll bring it to life.</div>
            <div className="svc-foot">EDIT · GRADE · DELIVER</div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• PACKAGES â•â•â•â•â•â•â•â• */}
      <section className="slab mid" id="packages">
        <div className="sec-num"><span className="bar"></span>§ 03 — PACKAGES &amp; PRICING</div>
        <h2>CLEAR SCOPE.<br /><em>No surprises.</em></h2>
        <div className="pkg-grid">
          <div className="pkg-card">
            <div className="pkg-id">PKG — 01</div>
            <h3>CORE</h3>
            <div className="pkg-price"><span className="cur">$</span>200</div>
            <div className="pkg-div"></div>
            <ul className="pkg-ul">
              <li><strong>30-min</strong> shoot</li>
              <li>1 location</li>
              <li><strong>5</strong> edited digital images</li>
              <li>Online gallery delivery</li>
            </ul>
            <div className="pkg-cta">
              <Link to={createPageUrl('StartProject') + '?service=lens&package=mini-session'} className="btn">Select <span className="btn-arrow">→</span></Link>
            </div>
          </div>
          <div className="pkg-card">
            <div className="pkg-id">PKG — 02</div>
            <h3>PORTRAIT SESSION</h3>
            <div className="pkg-price"><span className="cur">$</span>350</div>
            <div className="pkg-div"></div>
            <ul className="pkg-ul">
              <li><strong>1-hour</strong> shoot</li>
              <li>1 location</li>
              <li><strong>15</strong> edited digital images</li>
              <li>Online gallery delivery</li>
            </ul>
            <div className="pkg-cta">
              <Link to={createPageUrl('StartProject') + '?service=lens&package=portrait'} className="btn">Select <span className="btn-arrow">→</span></Link>
            </div>
          </div>
          <div className="pkg-card pop">
            <div className="pop-badge">★ Most Popular</div>
            <div className="pkg-id">PKG — 03</div>
            <h3>BUSINESS BRANDING</h3>
            <div className="pkg-price"><span className="cur">$</span>650</div>
            <div className="pkg-div"></div>
            <ul className="pkg-ul">
              <li><strong>2-hour</strong> shoot</li>
              <li>Up to <strong>2 locations</strong></li>
              <li><strong>30</strong> edited digital images</li>
              <li>Headshots + workspace/lifestyle</li>
              <li>Online gallery delivery</li>
            </ul>
            <div className="pkg-cta">
              <Link to={createPageUrl('StartProject') + '?service=lens&package=business-branding'} className="btn primary">Select <span className="btn-arrow">→</span></Link>
            </div>
          </div>
          <div className="pkg-card">
            <div className="pkg-id">PKG — 04</div>
            <h3>CONTENT CREATION</h3>
            <div className="pkg-price"><span className="cur">$</span>1,200</div>
            <div className="pkg-div"></div>
            <ul className="pkg-ul">
              <li><strong>Half-day</strong> shoot (4 hrs)</li>
              <li>Photo + video</li>
              <li><strong>40</strong> edited photos</li>
              <li><strong>2</strong> short-form videos (30–60s)</li>
              <li>Gallery + video delivery</li>
            </ul>
            <div className="pkg-cta">
              <Link to={createPageUrl('StartProject') + '?service=lens&package=content-creation'} className="btn">Select <span className="btn-arrow">→</span></Link>
            </div>
          </div>
          <div className="pkg-card">
            <div className="pkg-id">PKG — 05</div>
            <h3>FULL PRODUCTION</h3>
            <div className="pkg-price"><span className="cur">$</span>2,500<span style={{ fontSize: '.38em', color: 'var(--ink-3)', fontFamily: "'Geist Mono', monospace" }}>+</span></div>
            <div className="pkg-div"></div>
            <ul className="pkg-ul">
              <li><strong>Full-day</strong> shoot (8 hrs)</li>
              <li>Photo + video</li>
              <li><strong>60+</strong> edited photos</li>
              <li><strong>4</strong> short-form + 1 long-form (3 min)</li>
              <li>Grade, sound, motion graphics</li>
              <li>Gallery + video delivery</li>
            </ul>
            <div className="pkg-cta">
              <Link to={createPageUrl('StartProject') + '?service=lens&package=full-production'} className="btn">Select <span className="btn-arrow">→</span></Link>
            </div>
          </div>
        </div>
        <div className="pkg-note">
          <strong>All prices exclude GST.</strong> Starting prices based on defined scope — if scope changes, we communicate immediately and pause until revised pricing is agreed. No surprises.<br />
          Professional services (legal, financial, medical) may incur a 15–20% surcharge — discussed during your discovery call.
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• CALEB — WITH PHOTO â•â•â•â•â•â•â•â• */}
      <section className="slab dark caleb" id="caleb">
        <div className="caleb-inner">
          <div className="caleb-left">
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
            <div className="sec-num"><span className="bar"></span>§ 04 — THE PHOTOGRAPHER</div>
            <h2>CALEB<br /><em>Walker.</em></h2>
            <blockquote className="caleb-quote">&ldquo;If the brand has weight,<br />the visuals should too.&rdquo;</blockquote>
            <p>Caleb leads C4 Lens — the photography, videography, and editing arm of C4 Studios. From commercial brand shoots and corporate headshots to events and social content, he brings a <strong>considered, story-first approach</strong> to every frame.</p>
            <p>His drone work captures perspectives most businesses never think to show. His editing transforms raw footage into polished brand films, reels, and launch content that <strong>actually converts</strong>.</p>
            <p>Australian businesses trust Caleb to replace stock imagery with visual proof — the kind of content that makes clients feel like they already know you before the first conversation.</p>
            <p style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--line)', fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
              Based in Perth, W.A. · Available nationally
            </p>
            <div style={{ marginTop: '24px' }}>
              <a href="#contact" className="btn primary"><span className="d"></span>Work with Caleb <span className="btn-arrow">→</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• PORTFOLIO â•â•â•â•â•â•â•â• */}
      <div className="portfolio-outer" id="portfolioOuter">
        <div className="portfolio-sticky">
          <div className="pf-top-row">
            <span className="t">§ 05 — SELECTED WORK</span>
            <span>PERTH, W.A. · 2024–2026</span>
          </div>
          <div className="pf-hint">↑ SCROLL TO PAN →</div>
          <div className="pf-track" id="pfTrack">
            <div className="pf-card wide"><video src="/DSR%20header.mp4" autoPlay muted loop playsInline className="pf-img" /><div className="pf-corner">01 · DSR</div><div className="pf-mask"></div><div className="pf-cap"><div className="name">DS RACING KARTS</div><div className="cat">SITE HEADERS / LOGO ANIMATION</div></div></div>
            <div className="pf-card wide"><video src="/hvn.mp4" autoPlay muted loop playsInline className="pf-img" /><div className="pf-corner">02 · HVN</div><div className="pf-mask"></div><div className="pf-cap"><div className="name">HVN</div><div className="cat">FULL SHOW / DRONE WORK</div></div></div>
            <div className="pf-card tall"><div className="pf-ph"></div><div className="pf-corner">03</div><div className="pf-mask"></div><div className="pf-cap"><div className="name">TO BE ANNOUNCED</div><div className="cat">—</div></div></div>
            <div className="pf-card sq"><div className="pf-ph"></div><div className="pf-corner">04</div><div className="pf-mask"></div><div className="pf-cap"><div className="name">TO BE ANNOUNCED</div><div className="cat">—</div></div></div>
            <div className="pf-card wide"><div className="pf-ph"></div><div className="pf-corner">05</div><div className="pf-mask"></div><div className="pf-cap"><div className="name">TO BE ANNOUNCED</div><div className="cat">—</div></div></div>
            <div className="pf-card tall"><div className="pf-ph"></div><div className="pf-corner">06</div><div className="pf-mask"></div><div className="pf-cap"><div className="name">TO BE ANNOUNCED</div><div className="cat">—</div></div></div>
            <div className="pf-card sq"><div className="pf-ph"></div><div className="pf-corner">07</div><div className="pf-mask"></div><div className="pf-cap"><div className="name">TO BE ANNOUNCED</div><div className="cat">—</div></div></div>
          </div>
          <div className="pf-bar-wrap"><div className="pf-bar" id="pfBar"></div></div>
        </div>
      </div>

      <section className="cta-section" id="contact">
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '24px' }}>
          § 06 — LET&rsquo;S MAKE SOMETHING
        </div>
        <h2>READY TO BE<br /><em>seen</em>?</h2>
        <div className="sub">We take on a limited number of clients each quarter. Tell Caleb about your project — he&rsquo;ll reply within 48 hours.</div>
        <div className="cta-btns">
          <Link to={createPageUrl('StartProject') + '?service=lens'} className="btn primary">
            <span className="d"></span>Get in touch <span className="btn-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>
          <div className="foot-logo">C4 LENS</div>
          <div style={{ marginTop: '6px', color: 'var(--ink-3)' }}>
            <a href="https://c4studios.com.au" style={{ color: 'inherit', textDecoration: 'none' }}>C4 Studios</a> · Perth W.A. · © {new Date().getFullYear()}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>ABN AVAILABLE ON REQUEST</div>
          <div style={{ marginTop: '6px', color: 'var(--ink-3)' }}>TRACKING · FOCUS · FRAME</div>
        </div>
      </footer>

      {/* Tweaks */}
      <div className="tweaks" id="tweaks">
        <h4>TWEAKS — C4 LENS</h4>
        <label>Cursor reticle <span className="tog" id="togCursor"></span></label>
        <label>Tick sounds <span className="tog" id="togTicks"></span></label>
        <label>Motion <input type="range" id="motionRange" min="0" max="100" step="5" /></label>
      </div>
    </div>
  );
}
