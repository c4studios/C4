import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  C4_WORDMARK_MORPH_PAIRS,
} from './c4WordmarkMorphData';
import { useTheme } from './ThemeContext';
import {
  BUILD, IMPACT_AT, LOCKUP_MATRIX, MARK_C, REDUCED_FADE, drawBuildFrame, site,
} from './markBuild';

gsap.registerPlugin(useGSAP);

/* =================================================================
   CONSTANTS
   ================================================================= */

const SIZES = { small: 28, default: 36, large: 48, xl: 72 };

const FULL_VIEWBOX = '50 100 880 400';
const FULL_ASPECT = 880 / 400;
const MARK_VIEWBOX = '265 55 395 420';
const MARK_ASPECT = 395 / 420;

const LOCKUP_TRANSFORM = 'translate(18 -273) scale(1.5)';

/* --- Three colour palettes: dormant, mono (grey active), colour --- */
const COLOURS = {
  dormant: {
    fourBody: '#b8b9ba',
    fourArm: '#c5c6c7',
    cArc: '#e6e4e2',
  },
  mono: {
    fourBody: '#414243',
    fourArm: '#6c6d6d',
    cArc: '#e6e4e2',
    text: '#1a1a1b',
  },
  colour: {
    fourBody: '#a30000',
    fourArm: '#22632f',
    cArc: '#f3f2f3',
    text: '#1a1a1b',
  },
};

/* The mark, trued on 17 Oct 2026 to "Cuts 15.81, stem lines up" (Caleb):
   the stem's foot (points 1 and 2) rises from y 300.21 to 292.91 and its
   right edge goes vertical (x 554.76 to 554.78), and the T's stem (arm
   points 4 and 5) widens from x 503.71 to the upper stem's 485.93. The C is
   unchanged. markBuild.js carries the same points and the build. */
const MARK_SOURCE = {
  fourBody: '554.78 94.43 554.78 292.91 485.93 292.91 485.93 177.58 395.65 308.72 485.93 308.72 453.55 357.3 304.78 357.3 304.78 323.95 470.27 94.43 554.78 94.43',
  fourArm: '639.36 308.72 606.98 357.3 554.78 357.3 554.78 469.58 485.93 469.58 485.93 357.3 472.55 357.3 504.93 308.72 639.36 308.72',
  cArc: MARK_C,
};

/* The same mark at the lockup's scale. The trued points went through the
   transform the two copies share (markBuild.js LOCKUP_MATRIX: x 0.4757183
   + 39.958, y 0.4757183 + 258.997, fitted to their 18 common corners):
   292.91 lands on 398.34, 554.78 on 303.88 and 485.93 on 271.12. */
const FULL_UPRIGHT = {
  fourBody: '303.88 303.92 303.88 398.34 271.12 398.34 271.12 343.47 228.18 405.86 271.12 405.86 255.72 428.97 184.95 428.97 184.95 413.1 263.67 303.92 303.88 303.92',
  fourArm: '344.11 405.86 328.71 428.97 303.88 428.97 303.88 482.39 271.12 482.39 271.12 428.97 264.76 428.97 280.17 405.86 344.11 405.86',
  cArc: 'M227.07,440.52l21.95.11c-17.85,20.3-41.9,34.05-68.37,39.1-42.51,8.81-85.9-10.45-108.08-47.97-18.17-30.46-14.55-69.27,8.95-95.79,15.71-18.02,37.74-29.24,61.48-31.32,26.14-3.66,52.76-1.51,77.99,6.28l-17.77,24.76c-14.77-3.1-29.94-3.81-44.94-2.11-20.89,1.13-40,12.19-51.48,29.78-6.66,13.21-8.03,28.49-3.84,42.69,6.27,22.39,23.69,39.88,45.96,46.15,26.61,5.37,54.24,1.23,78.14-11.68Z',
};

/* --- Spring model for letter dynamics --- */
const TENSION_DURATION = 0.035;

const LETTER_SPRINGS = [
  { peakAngle: -18.0, dampingRatio: 0.26, naturalFreq: 13.0, totalDuration: 0.95, tensionAngle: 2.5 },
  { peakAngle: -14.0, dampingRatio: 0.27, naturalFreq: 13.5, totalDuration: 0.82, tensionAngle: 2.0 },
  { peakAngle: -10.5, dampingRatio: 0.28, naturalFreq: 14.0, totalDuration: 0.70, tensionAngle: 1.5 },
  { peakAngle: -7.5,  dampingRatio: 0.29, naturalFreq: 14.5, totalDuration: 0.60, tensionAngle: 1.1 },
  { peakAngle: -5.0,  dampingRatio: 0.30, naturalFreq: 15.0, totalDuration: 0.50, tensionAngle: 0.8 },
  { peakAngle: -3.2,  dampingRatio: 0.31, naturalFreq: 15.5, totalDuration: 0.42, tensionAngle: 0.5 },
  { peakAngle: -2.0,  dampingRatio: 0.32, naturalFreq: 16.0, totalDuration: 0.35, tensionAngle: 0.3 },
];

/* =================================================================
   SPRING TRAJECTORY CALCULATOR
   ================================================================= */

function computeSpringTrajectory(spring) {
  const { peakAngle, dampingRatio, naturalFreq, totalDuration, tensionAngle } = spring;
  const wd = naturalFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
  const zetaOmega = dampingRatio * naturalFreq;

  const alpha = Math.atan2(wd, zetaOmega);
  const tPeakSpring = alpha / wd;
  const peakDecay = Math.exp(-zetaOmega * tPeakSpring);
  let impulseV = peakAngle * wd / (peakDecay * Math.sin(alpha));

  let B2 = (impulseV + zetaOmega * tensionAngle) / wd;
  let actualPeak = 0;
  for (let s = 0; s <= 500; s++) {
    const t = (s / 500) * tPeakSpring * 2.5;
    const d = Math.exp(-zetaOmega * t);
    const val = d * (tensionAngle * Math.cos(wd * t) + B2 * Math.sin(wd * t));
    if (val < actualPeak) actualPeak = val;
  }
  if (Math.abs(actualPeak) > 0.1) {
    impulseV *= peakAngle / actualPeak;
    B2 = (impulseV + zetaOmega * tensionAngle) / wd;
  }

  const numRaw = Math.max(30, Math.round(totalDuration * 60));
  const stepDur = totalDuration / numRaw;
  const allRotations = [];

  for (let i = 0; i <= numRaw; i++) {
    const t = i * stepDur;
    let rotation;
    if (t <= TENSION_DURATION) {
      const frac = t / TENSION_DURATION;
      rotation = tensionAngle * (1 - (1 - frac) * (1 - frac));
    } else {
      const springT = t - TENSION_DURATION;
      const decay = Math.exp(-zetaOmega * springT);
      rotation = decay * (tensionAngle * Math.cos(wd * springT) + B2 * Math.sin(wd * springT));
    }
    allRotations.push(rotation);
  }

  const resolveThreshold = Math.max(0.4, Math.abs(peakAngle) * 0.12);
  let resolveIdx = numRaw;
  for (let i = Math.floor(numRaw * 0.4); i <= numRaw; i++) {
    if (Math.abs(allRotations[i]) < 0.3) {
      let maxAfter = 0;
      for (let j = i; j <= numRaw; j++) {
        if (Math.abs(allRotations[j]) > maxAfter) maxAfter = Math.abs(allRotations[j]);
      }
      if (maxAfter < resolveThreshold) {
        resolveIdx = i;
        break;
      }
    }
  }

  const keyframes = [];
  for (let i = 0; i <= resolveIdx; i++) {
    keyframes.push({ rotation: allRotations[i] });
  }
  keyframes[resolveIdx].rotation = 0;

  const resolveDuration = resolveIdx * stepDur;
  return { keyframes, stepDur, numKeyframes: resolveIdx, tPeak: TENSION_DURATION + tPeakSpring, resolveDuration };
}

/* =================================================================
   UTILITY FUNCTIONS
   ================================================================= */

function hingeTranslationY(rotationDeg, hingeHeightRatio) {
  const rad = (rotationDeg * Math.PI) / 180;
  return hingeHeightRatio * (1 - Math.cos(rad)) * 0.50;
}

function computeImpactChain(baseImpactAt) {
  const times = [baseImpactAt];
  for (let i = 1; i < LETTER_SPRINGS.length; i++) {
    const prev = LETTER_SPRINGS[i - 1];
    const wd = prev.naturalFreq * Math.sqrt(1 - prev.dampingRatio * prev.dampingRatio);
    const prevAlpha = Math.atan2(wd, prev.dampingRatio * prev.naturalFreq);
    const prevToPeak = TENSION_DURATION + prevAlpha / wd;
    times.push(times[i - 1] + prevToPeak * 0.68);
  }
  return times;
}

/* The RENDERED chrome, not the theme preference. Board pages (ServiceAI,
   Foresight, Lens) force dark chrome for light-theme visitors and the
   daylight sheet (ServiceWeb) forces light chrome for dark-theme visitors
   by asserting/removing the dark-mode class on <html> — ThemeContext state
   doesn't know. The class is the truth, so the wordmark follows it;
   otherwise "Studios" renders near-black on a dark board (invisible). */
function useRenderedDark() {
  const { isDark } = useTheme();
  const [renderedDark, setRenderedDark] = useState(isDark);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setRenderedDark(root.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return renderedDark;
}

function useLogoColours(context) {
  const isDark = useRenderedDark();

  return useMemo(() => {
    const dormant = { ...COLOURS.dormant };
    const mono = { ...COLOURS.mono };

    /* Dark / footer overrides */
    if (isDark || context === 'footer' || context === 'header') {
      dormant.fourBody = '#606264';
      dormant.fourArm = '#707274';
      dormant.cArc = '#d0cecc';
      mono.fourBody = '#9a9b9c';
      mono.fourArm = '#8a8b8c';
      mono.cArc = '#d0cecc';
      mono.text = '#e8e6e3';
    }

    /*
     * Backdrop bubble & drop-shadow intensity —
     * Light mode gets a more pronounced bubble so the pale C is legible;
     * dark mode keeps the existing subtle treatment.
     */
    const backdrop = (isDark || context === 'footer' || context === 'header')
      ? { fill: '#555', opacity: 0.15 }
      : { fill: '#3a3a3c', opacity: 0.28 };

    const cShadow = (isDark || context === 'footer' || context === 'header')
      ? { floodOpacity: 0.22 }
      : { floodOpacity: 0.34 };

    return { dormant, mono, colour: COLOURS.colour, backdrop, cShadow };
  }, [context, isDark]);
}

/* Read for the timelines only, never for what renders, so a hydrating page
   draws exactly what was prerendered whatever the visitor's setting. */
function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia(query);
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

function MorphWordPaths({ pairs, fill, refs }) {
  return (
    <>
      {pairs.map((pair, index) => (
        <path
          key={`${pair.letter}-${index}`}
          d={pair.normalized.normalizedPaths?.uprightPath || pair.raw.uprightPath}
          fill={fill}
          ref={(node) => {
            refs.current[index] = node;
          }}
        />
      ))}
    </>
  );
}

function parseOriginPair(origin) {
  const [x = '0%', y = '100%'] = origin.split(' ');
  return {
    x: Number.parseFloat(x) / 100,
    y: Number.parseFloat(y) / 100,
  };
}

function getFixedLetterHinge(letterNode, hingeOrigin) {
  const box = letterNode.getBBox();
  const { x, y } = parseOriginPair(hingeOrigin);
  return {
    x: box.x + (box.width * x),
    y: box.y + (box.height * y),
  };
}

/* =================================================================
   COMPONENT
   ================================================================= */

export default function C4Logo({
  size = 'default',
  variant = 'mark',
  context = 'header',
  className = '',
}) {
  const rootRef = useRef(null);
  const monoTlRef = useRef(null);
  const colourTlRef = useRef(null);
  const dormantTlRef = useRef(null);
  const stageRef = useRef(0); /* 0 = dormant, 1 = mono locked, 2 = colour locked */
  const inFlightTlRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchConsumedRef = useRef(false);

  /* Element refs */
  const cBaseRef = useRef(null);
  const cSealRef = useRef(null);
  const bodyDormantRef = useRef(null);
  const armDormantRef = useRef(null);
  const bodyBaseRef = useRef(null);
  const armBaseRef = useRef(null);
  const bodySealRef = useRef(null);
  const armSealRef = useRef(null);
  /* build B: the C's wipe (the polygon inside its clipPath) and the 4's two
     colours, each one path whose subpaths are the strokes so far */
  const cBuildRef = useRef(null);
  const buildRef = useRef(null);
  const cWipeRef = useRef(null);
  const buildRedRef = useRef(null);
  const buildGreenRef = useRef(null);
  const morphLetterRefs = useRef([]);
  const wordGroupRef = useRef(null);
  const backdropRef = useRef(null);

  const h = typeof size === 'number' ? size : (SIZES[size] || SIZES.default);
  const full = variant === 'full';
  const showBackdrop = full;
  const { dormant, mono, colour, backdrop, cShadow } = useLogoColours(context);
  const reducedMotion = usePrefersReducedMotion();
  /* Named from where the logo sits, not useId(): the prerendered HTML keeps
     the ids its own render made, and a hydrating page's differ (15 Oct
     2026). One logo per context and size on a page: the nav's, the
     footer's, the sent-message mark. */
  const uid = `${context}-${variant}-${h}`;

  const viewBox = full ? FULL_VIEWBOX : MARK_VIEWBOX;
  const aspect = full ? FULL_ASPECT : MARK_ASPECT;
  const w = Math.round(h * aspect);

  const cWipeId = `c4-c-wipe-${uid}`;
  const cPresenceId = `c4-c-presence-${uid}`;
  const backdropBlurId = `c4-backdrop-blur-${uid}`;



  /* =================================================================
     INITIALISATION — set dormant state, pre-compute, build stage timelines
     ================================================================= */

  useGSAP(() => {
    if (monoTlRef.current) { monoTlRef.current.kill(); monoTlRef.current = null; }
    if (colourTlRef.current) { colourTlRef.current.kill(); colourTlRef.current = null; }
    if (dormantTlRef.current) { dormantTlRef.current.kill(); dormantTlRef.current = null; }
    stageRef.current = 0;

    if (!full) return undefined;

    const wordLetters = morphLetterRefs.current.filter(Boolean);
    const impactTimes = computeImpactChain(IMPACT_AT);
    /* the site's ease, for the hand-overs and the reduced-motion fades */
    const siteEase = site;
    const buildEls = { cClip: cWipeRef.current, red: buildRedRef.current, green: buildGreenRef.current };

    /* -- Set dormant initial state -- */

    gsap.set(cBaseRef.current, { opacity: 1 });
    gsap.set(bodyDormantRef.current, { opacity: 1 });
    gsap.set(armDormantRef.current, { opacity: 1 });

    gsap.set(bodyBaseRef.current, { opacity: 0 });
    gsap.set(armBaseRef.current, { opacity: 0 });

    gsap.set(cSealRef.current, { opacity: 0 });
    gsap.set(bodySealRef.current, { opacity: 0 });
    gsap.set(armSealRef.current, { opacity: 0 });

    gsap.set([cBuildRef.current, buildRef.current], { autoAlpha: 0 });
    drawBuildFrame(0, buildEls);

    gsap.set(wordLetters, { x: 0, y: 0, opacity: 0, rotation: 0, scaleY: 1, force3D: false });
    wordLetters.forEach((letter, index) => {
      const pair = C4_WORDMARK_MORPH_PAIRS[index];
      const uprightPath = pair.normalized.normalizedPaths?.uprightPath || pair.raw.uprightPath;
      const hinge = getFixedLetterHinge(letter, pair.hingeOrigin || '7% 98%');
      gsap.set(letter, {
        attr: { d: uprightPath },
        svgOrigin: `${hinge.x} ${hinge.y}`,
        transformOrigin: `${hinge.x}px ${hinge.y}px`,
      });
    });

    gsap.set(wordGroupRef.current, { y: 0, opacity: 1 });
    if (showBackdrop && backdropRef.current) {
      gsap.set(backdropRef.current, { attr: { cx: 206, cy: 389, rx: 165, ry: 120 }, opacity: 0.15 });
    }

    /* ================================================================
       STAGE 1 TIMELINE — Dormant → Mono (paused, hover-driven)
       ================================================================ */

    const monoTl = gsap.timeline({
      paused: true,
      onComplete: () => { stageRef.current = 1; },
      onReverseComplete: () => { stageRef.current = 0; },
    });

    if (showBackdrop && backdropRef.current) {
      const room = { attr: { cx: 255, cy: 398, rx: 215, ry: 132 } };
      /* reduced motion: the halo takes its new size at once */
      if (reducedMotion) monoTl.set(backdropRef.current, room, 0);
      else monoTl.to(backdropRef.current, { ...room, duration: 0.5, ease: 'power2.out' }, 0);
    }

    monoTl.to(bodyDormantRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 0.05);
    monoTl.to(armDormantRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 0.05);
    monoTl.to(bodyBaseRef.current, { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 0.05);
    monoTl.to(armBaseRef.current, { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 0.05);

    wordLetters.forEach((letter, i) => {
      const delay = 0.18 + i * 0.04;
      monoTl.fromTo(letter,
        { opacity: 0, y: reducedMotion ? 0 : 8 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' },
        delay,
      );
    });

    monoTlRef.current = monoTl;

    /* ================================================================
       STAGE 2 TIMELINE — Mono → Colour (paused, hover-driven)
       ================================================================ */

    const colourTl = gsap.timeline({
      paused: true,
      onComplete: () => { stageRef.current = 2; },
      onReverseComplete: () => { stageRef.current = 1; },
    });

    if (reducedMotion) {
      /* Reduced motion (Caleb, 17 Oct 2026): no build. The finished colour
         mark fades in over the grey one in 0.2 s, and the grey goes once it
         is covered. The word stays upright where it is. */
      colourTl.to([cSealRef.current, bodySealRef.current, armSealRef.current], { opacity: 1, duration: REDUCED_FADE, ease: siteEase }, 0);
      colourTl.to([cBaseRef.current, bodyBaseRef.current, armBaseRef.current], { opacity: 0, duration: REDUCED_FADE, ease: siteEase }, REDUCED_FADE);
    } else {
      /* ── Mono "ghost scaffold" ─────────────────────────────────────
         Instead of letting the mono mark vanish before the colour build
         has materialised, hold it at low opacity throughout construction
         so the eye keeps its anchor on the silhouette. */
      const GHOST_OPACITY = 0.32;

      colourTl.to(cBaseRef.current, { opacity: GHOST_OPACITY, duration: 0.30, ease: 'power2.out' }, 0);
      colourTl.to(bodyBaseRef.current, { opacity: GHOST_OPACITY, duration: 0.30, ease: 'power2.out' }, 0);
      colourTl.to(armBaseRef.current, { opacity: GHOST_OPACITY, duration: 0.30, ease: 'power2.out' }, 0);

      /* -- Build B, "Stroke" (Caleb, 17 Oct 2026) --
         The C is wiped on by a straight front at its top cut's angle. The 4
         is drawn as one stroke: the stem and the diagonal leave the apex
         together, the diagonal turns into the crossbar, the crossbar runs
         right through the cut into the green, and the T's stem drops last.
         Every front lies parallel to the edge its stroke ends on, so each
         frame is straight-edged polygons with their true ends: no iris, no
         pivot, no wedge. markBuild.js draws the frames; this tween is only
         their clock, so a hover that ends early runs the stroke backwards. */
      const build = { t: 0 };
      colourTl.set([cBuildRef.current, buildRef.current], { autoAlpha: 1 }, 0);
      colourTl.fromTo(build, { t: 0 }, {
        t: BUILD.end,
        duration: BUILD.end,
        ease: 'none',
        onUpdate: () => { drawBuildFrame(build.t, buildEls); },
      }, 0);

      /* Each part hands over to the finished mark as it lands, the C at
         0.48 s and the 4 at 0.96 s, and its ghost fades after it (the C's
         takes its soft shadow with it). The build's last frame covers
         exactly what the finished mark covers, and the ghost under both is
         the same, so the hand-over can't be seen. */
      colourTl.set(cSealRef.current, { opacity: 1 }, BUILD.c[1]);
      colourTl.set(cBuildRef.current, { autoAlpha: 0 }, BUILD.c[1]);
      colourTl.to(cBaseRef.current, { opacity: 0, duration: 0.24, ease: siteEase }, BUILD.c[1]);
      colourTl.set([bodySealRef.current, armSealRef.current], { opacity: 1 }, BUILD.end);
      colourTl.set(buildRef.current, { autoAlpha: 0 }, BUILD.end);
      colourTl.to([bodyBaseRef.current, armBaseRef.current], { opacity: 0, duration: 0.24, ease: siteEase }, BUILD.end);

      /* -- Per-letter domino chain --
         Rebuilt 9 September 2026. The old chain sampled a spring into sixty
         linear keyframes per letter, which read as jitter. Each letter now
         has three continuous tweens: a hair of tension as the push arrives,
         the knock over to its peak angle on a decelerating fall, and one
         elastic recovery back to upright whose period lengthens down the
         word, so the wobble softens as the energy runs out. The italic morph
         rides the swing. The timing of each impact still comes from the
         spring model, so the chain keeps its cadence. The first knock is the
         crossbar landing on the T's right end (IMPACT_AT, 17 Oct 2026). */
      const KNOCK = 0.16;
      LETTER_SPRINGS.forEach((spring, index) => {
        const letter = wordLetters[index];
        const pair = C4_WORDMARK_MORPH_PAIRS[index];
        if (!letter || !pair.normalized.normalizedPaths) return;

        const impactAt = impactTimes[index];
        const hingeHeight = letter.getBBox().height;
        const swing = Math.abs(spring.peakAngle);
        const fall = KNOCK + swing * 0.004;
        const dip = hingeTranslationY(spring.peakAngle, hingeHeight);
        const period = (0.34 + index * 0.05).toFixed(2);

        colourTl.to(letter, { rotation: spring.tensionAngle, duration: 0.05, ease: 'power1.in' }, impactAt);
        colourTl.to(letter, { rotation: -swing, y: dip, duration: fall, ease: 'power2.out' }, impactAt + 0.05);
        colourTl.to(letter, { rotation: 0, y: 0, duration: spring.totalDuration, ease: `elastic.out(1, ${period})` }, impactAt + 0.05 + fall);
        colourTl.to(letter, { attr: { d: pair.normalized.normalizedPaths.italicPath }, duration: 0.3, ease: 'sine.inOut' }, impactAt + 0.06);
      });

      const lockTime = Math.max(
        ...LETTER_SPRINGS.map((sp, i) => impactTimes[i] + 0.05 + KNOCK + Math.abs(sp.peakAngle) * 0.004 + sp.totalDuration)
      );
      wordLetters.forEach((letter) => {
        if (letter) colourTl.set(letter, { rotation: 0, y: 0, x: 0 }, lockTime);
      });
    }

    colourTlRef.current = colourTl;

    /* ================================================================
       STAGE 3 TIMELINE — Colour → Dormant (paused, hover-driven)
       ================================================================ */

    const dormantTl = gsap.timeline({
      paused: true,
      onComplete: () => { stageRef.current = 0; },
      onReverseComplete: () => { stageRef.current = 2; },
    });

    /* The reset, rebuilt 9 September 2026. The word straightens back to
       upright letter by letter, then lifts off the baseline and fades, the
       way type is picked up off a bench; it no longer crushes to zero
       height. The 4 and the C do not un-draw themselves stroke by stroke:
       the dormant greys come up under the colour and the colour fades off
       them, so the whole mark settles in one motion without dimming
       halfway. Since 17 Oct 2026 the C does the same; its iris close went
       with the round reveal. Reduced motion: the word fades where it is. */
    wordLetters.forEach((letter, i) => {
      const pair = C4_WORDMARK_MORPH_PAIRS[i];
      if (!pair.normalized.normalizedPaths) return;
      const uprightPath = pair.normalized.normalizedPaths.uprightPath || pair.raw.uprightPath;
      dormantTl.to(letter, { attr: { d: uprightPath }, duration: 0.26, ease: 'power2.inOut' }, i * 0.02);
    });
    wordLetters.forEach((letter, i) => {
      dormantTl.to(letter, { y: reducedMotion ? 0 : -7, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.16 + i * 0.03);
    });

    dormantTl.to([bodyDormantRef.current, armDormantRef.current], { opacity: 1, duration: 0.36, ease: 'power2.inOut' }, 0.3);
    dormantTl.to(cBaseRef.current, { opacity: 1, duration: 0.36, ease: 'power2.inOut' }, 0.3);
    dormantTl.to([bodyBaseRef.current, armBaseRef.current], { opacity: 0, duration: 0.3, ease: 'power2.inOut' }, 0.3);
    dormantTl.to([cSealRef.current, bodySealRef.current, armSealRef.current], { opacity: 0, duration: 0.42, ease: 'power2.inOut' }, 0.42);

    if (showBackdrop && backdropRef.current) {
      const rest = { attr: { cx: 206, cy: 389, rx: 165, ry: 120 } };
      if (reducedMotion) dormantTl.set(backdropRef.current, rest, 0.5);
      else dormantTl.to(backdropRef.current, { ...rest, duration: 0.45, ease: 'power2.inOut' }, 0.5);
    }

    dormantTl.set(wordLetters, { y: 0, rotation: 0, x: 0, scaleY: 1, opacity: 0 }, 0.95);

    dormantTlRef.current = dormantTl;

    return () => {
      if (monoTlRef.current) { monoTlRef.current.kill(); monoTlRef.current = null; }
      if (colourTlRef.current) { colourTlRef.current.kill(); colourTlRef.current = null; }
      if (dormantTlRef.current) { dormantTlRef.current.kill(); dormantTlRef.current = null; }
    };
  }, { scope: rootRef, dependencies: [full, showBackdrop, reducedMotion] });

  /* =================================================================
     HOVER + TOUCH HANDLERS — staged progressive animation
     ================================================================= */

  const getActiveTl = useCallback(() => {
    const stage = stageRef.current;
    if (stage === 0) return monoTlRef.current;
    if (stage === 1) return colourTlRef.current;
    if (stage === 2) return dormantTlRef.current;
    return null;
  }, []);

  const playTl = useCallback((tl) => {
    if (tl.progress() >= 1) {
      tl.restart();
    } else {
      tl.play();
    }
  }, []);

  const handleHoverStart = useCallback(() => {
    if (!full) return;
    const tl = getActiveTl();
    if (!tl) return;
    inFlightTlRef.current = tl;
    playTl(tl);
  }, [full, getActiveTl, playTl]);

  const handleHoverEnd = useCallback(() => {
    if (!full) return;
    const tl = inFlightTlRef.current;
    inFlightTlRef.current = null;
    if (!tl || tl.progress() >= 1) return;
    tl.reverse();
  }, [full]);

  const handleTouchStart = useCallback(() => {
    if (!full) return;
    const tl = getActiveTl();
    if (!tl) return;
    touchStartRef.current = Date.now();
    inFlightTlRef.current = tl;
    playTl(tl);
  }, [full, getActiveTl, playTl]);

  const handleTouchEnd = useCallback((e) => {
    if (!full) return;
    const elapsed = Date.now() - (touchStartRef.current || 0);
    touchStartRef.current = null;

    const tl = inFlightTlRef.current;
    inFlightTlRef.current = null;

    if (!tl || tl.progress() >= 1) {
      if (elapsed >= 300) {
        e.preventDefault();
        touchConsumedRef.current = true;
      }
      return;
    }

    if (elapsed >= 300) {
      e.preventDefault();
      touchConsumedRef.current = true;
    }

    tl.reverse();
  }, [full]);

  const handleClick = useCallback((e) => {
    if (touchConsumedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      touchConsumedRef.current = false;
    }
  }, []);

  /* =================================================================
     RENDER
     ================================================================= */

  return (
    <span
      ref={rootRef}
      className={`c4-logo inline-flex items-center select-none ${className}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      style={{ height: h }}
      role="img"
      aria-label="C4 Studios"
    >
      <svg
        viewBox={viewBox}
        width={w}
        height={h}
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id={cPresenceId} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1" stdDeviation="3.5" floodColor="#000000" floodOpacity={cShadow.floodOpacity}/>
          </filter>
          <filter id={backdropBlurId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" />
          </filter>
        </defs>
        {full ? (
          <g transform={LOCKUP_TRANSFORM}>
            {/* Backdrop — soft dark-grey translucent bubble */}
            {showBackdrop ? (
              <ellipse
                ref={backdropRef}
                cx="206" cy="389"
                rx="165" ry="120"
                fill={backdrop.fill}
                opacity={backdrop.opacity}
                filter={`url(#${backdropBlurId})`}
              />
            ) : null}

            {/* C — dormant/mono base (always rendered, opacity-controlled) */}
            <path ref={cBaseRef} d={FULL_UPRIGHT.cArc} fill={mono.cArc} filter={`url(#${cPresenceId})`} />

            {/* C — the build's straight wipe, in the mark's own units (markBuild.js).
                Empty until stage 2 starts; the finished C takes over at 0.48 s. */}
            <g ref={cBuildRef} transform={LOCKUP_MATRIX}>
              <defs>
                <clipPath id={cWipeId} clipPathUnits="userSpaceOnUse">
                  <polygon ref={cWipeRef} points="" />
                </clipPath>
              </defs>
              <path d={MARK_C} fill={colour.cArc} clipPath={`url(#${cWipeId})`} />
            </g>

            {/* C — colour, finished */}
            <path ref={cSealRef} d={FULL_UPRIGHT.cArc} fill={colour.cArc} />

            {/* 4 body — dormant palette */}
            <polygon ref={bodyDormantRef} points={FULL_UPRIGHT.fourBody} fill={dormant.fourBody} />

            {/* 4 body — mono base (hidden in dormant state) */}
            <polygon ref={bodyBaseRef} points={FULL_UPRIGHT.fourBody} fill={mono.fourBody} />

            {/* 4 body — colour seal */}
            <polygon ref={bodySealRef} points={FULL_UPRIGHT.fourBody} fill={colour.fourBody} />

            {/* Arm group */}
            <g>
              {/* Arm — dormant palette */}
              <g ref={armDormantRef}>
                <polygon points={FULL_UPRIGHT.fourArm} fill={dormant.fourArm} />
              </g>
              {/* Arm — mono base */}
              <g ref={armBaseRef}>
                <polygon points={FULL_UPRIGHT.fourArm} fill={mono.fourArm} />
              </g>
              <polygon ref={armSealRef} points={FULL_UPRIGHT.fourArm} fill={colour.fourArm} />
            </g>

            {/* 4 — the build's strokes, one path per colour whose subpaths are
                the strokes so far, so no seam shows where two meet. Empty
                until stage 2 starts; the finished 4 takes over at 0.96 s. */}
            <g ref={buildRef} transform={LOCKUP_MATRIX}>
              <path ref={buildRedRef} d="" fill={colour.fourBody} />
              <path ref={buildGreenRef} d="" fill={colour.fourArm} />
            </g>

            {/* Word "Studios" — letters individually animated */}
            <g ref={wordGroupRef}>
              <MorphWordPaths pairs={C4_WORDMARK_MORPH_PAIRS} fill={mono.text} refs={morphLetterRefs} />
            </g>
          </g>
        ) : (
          <>
            <path d={MARK_SOURCE.cArc} fill={mono.cArc} filter={`url(#${cPresenceId})`} />
            <polygon points={MARK_SOURCE.fourBody} fill={mono.fourBody} />
            <g>
              <polygon points={MARK_SOURCE.fourArm} fill={mono.fourArm} />
            </g>
          </>
        )}
      </svg>
    </span>
  );
}
