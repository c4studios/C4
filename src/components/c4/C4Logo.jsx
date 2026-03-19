import React, { useCallback, useId, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  C4_WORDMARK_MORPH_PAIRS,
} from './c4WordmarkMorphData';
import { useTheme } from './ThemeContext';

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

const MARK_SOURCE = {
  fourBody: '554.78 94.43 554.76 300.21 485.93 300.21 485.93 177.58 395.65 308.72 485.93 308.72 453.55 357.3 304.78 357.3 304.78 323.95 470.27 94.43 554.78 94.43',
  fourArm: '639.36 308.72 606.98 357.3 554.78 357.3 554.78 469.58 503.71 469.58 503.71 357.3 472.55 357.3 504.93 308.72 639.36 308.72',
  cArc: 'M393.33,381.58l46.14.22c-37.51,42.67-88.07,71.58-143.72,82.18-89.37,18.53-180.59-21.95-227.2-100.84-38.21-64.03-30.59-145.6,18.81-201.36,33.03-37.88,79.33-61.47,129.25-65.83,54.95-7.69,110.91-3.19,163.94,13.2l-37.35,52.04c-31.06-6.51-62.95-8.01-94.47-4.41-43.91,2.38-84.08,25.62-108.21,62.59-14,27.78-16.89,59.9-8.08,89.75,13.18,47.07,49.8,83.83,96.63,97.01,55.92,11.27,114.01,2.59,164.26-24.56Z',
};

const FULL_UPRIGHT = {
  fourBody: '303.88 303.92 303.87 401.82 271.12 401.82 271.12 343.47 228.18 405.86 271.12 405.86 255.72 428.97 184.95 428.97 184.95 413.1 263.67 303.92 303.88 303.92',
  fourArm: '344.11 405.86 328.71 428.97 303.88 428.97 303.88 482.39 279.58 482.39 279.58 428.97 264.76 428.97 280.17 405.86 344.11 405.86',
  cArc: 'M227.07,440.52l21.95.11c-17.85,20.3-41.9,34.05-68.37,39.1-42.51,8.81-85.9-10.45-108.08-47.97-18.17-30.46-14.55-69.27,8.95-95.79,15.71-18.02,37.74-29.24,61.48-31.32,26.14-3.66,52.76-1.51,77.99,6.28l-17.77,24.76c-14.77-3.1-29.94-3.81-44.94-2.11-20.89,1.13-40,12.19-51.48,29.78-6.66,13.21-8.03,28.49-3.84,42.69,6.27,22.39,23.69,39.88,45.96,46.15,26.61,5.37,54.24,1.23,78.14-11.68Z',
};

const FOUR_SEGMENTS = {
  stemUpper: '303.88 303.92 303.87 401.82 271.12 401.82 271.12 343.47 263.67 303.92',
  diagonal: '263.67 303.92 271.12 343.47 228.18 405.86 271.12 405.86 255.72 428.97 184.95 428.97 184.95 413.1',
  stemLower: '303.88 428.97 303.88 482.39 279.58 482.39 279.58 428.97',
  crossArm: '344.11 405.86 328.71 428.97 264.76 428.97 280.17 405.86',
};

const FOUR_BUILD = {
  stemLower: { at: 0.18, duration: 0.26, origin: '291.73px 482.39px' },
  stemUpper: { at: 0.44, duration: 0.28, origin: '287.5px 401.82px' },
  diagonal: { at: 0.74, duration: 0.32, junctionX: 263.67, junctionY: 303.92, angle: 32.2 },
  bodySealAt: 1.06,
  crossArm: { at: 1.07, duration: 0.15, origin: '264.76px 417.42px' },
  impactAt: 1.22,
  armSealAt: 1.52,
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

function useLogoColours(context) {
  const { isDark } = useTheme();

  return useMemo(() => {
    const dormant = { ...COLOURS.dormant };
    const mono = { ...COLOURS.mono };

    if (isDark || context === 'footer') {
      dormant.fourBody = '#606264';
      dormant.fourArm = '#707274';
      dormant.cArc = '#d0cecc';
      mono.fourBody = '#9a9b9c';
      mono.fourArm = '#8a8b8c';
      mono.cArc = '#d0cecc';
      mono.text = '#e8e6e3';
    }

    return { dormant, mono, colour: COLOURS.colour };
  }, [context, isDark]);
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
  const cColourRef = useRef(null);
  const bodyDormantRef = useRef(null);
  const armDormantRef = useRef(null);
  const bodyBaseRef = useRef(null);
  const armBaseRef = useRef(null);
  const bodySealRef = useRef(null);
  const armSealRef = useRef(null);
  const stemUpperRef = useRef(null);
  const diagonalGrowthRef = useRef(null);
  const stemLowerRef = useRef(null);
  const crossArmRef = useRef(null);
  const cClipRectRef = useRef(null);
  const morphLetterRefs = useRef([]);
  const wordGroupRef = useRef(null);
  const backdropRef = useRef(null);

  /* Stable computed values (set once in useGSAP) */
  const computedRef = useRef(null);

  const h = typeof size === 'number' ? size : (SIZES[size] || SIZES.default);
  const full = variant === 'full';
  const showBackdrop = full;
  const { dormant, mono, colour } = useLogoColours(context);
  const uid = useId();

  const viewBox = full ? FULL_VIEWBOX : MARK_VIEWBOX;
  const aspect = full ? FULL_ASPECT : MARK_ASPECT;
  const w = Math.round(h * aspect);

  const cClipId = `c4-c-clip-${uid}`;
  const stemUpperClipId = `c4-four-stem-upper-${uid}`;
  const diagonalClipId = `c4-four-diagonal-${uid}`;
  const stemLowerClipId = `c4-four-stem-lower-${uid}`;
  const crossArmClipId = `c4-four-cross-arm-${uid}`;
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

    if (!full) {
      computedRef.current = null;
      return undefined;
    }

    const cBox = cBaseRef.current.getBBox();
    const wordLetters = morphLetterRefs.current.filter(Boolean);
    const impactTimes = computeImpactChain(FOUR_BUILD.impactAt);
    const cCenter = { x: cBox.x + cBox.width * 0.38, y: cBox.y + cBox.height * 0.5 };
    const cFullRadius = Math.sqrt(cBox.width ** 2 + cBox.height ** 2) * 0.65;

    computedRef.current = { cCenter, cFullRadius, wordLetters, impactTimes };

    /* -- Set dormant initial state -- */

    gsap.set(cBaseRef.current, { opacity: 1 });
    gsap.set(bodyDormantRef.current, { opacity: 1 });
    gsap.set(armDormantRef.current, { opacity: 1 });

    gsap.set(bodyBaseRef.current, { opacity: 0 });
    gsap.set(armBaseRef.current, { opacity: 0 });

    gsap.set(cColourRef.current, { opacity: 0 });
    gsap.set(bodySealRef.current, { opacity: 0 });
    gsap.set(armSealRef.current, { opacity: 0 });

    gsap.set(stemLowerRef.current, {
      opacity: 0, scaleY: 0,
      transformOrigin: FOUR_BUILD.stemLower.origin,
      svgOrigin: FOUR_BUILD.stemLower.origin.replaceAll('px', ''),
    });
    gsap.set(stemUpperRef.current, {
      opacity: 0, scaleY: 0,
      transformOrigin: FOUR_BUILD.stemUpper.origin,
      svgOrigin: FOUR_BUILD.stemUpper.origin.replaceAll('px', ''),
    });
    const diagJunction = `${FOUR_BUILD.diagonal.junctionX} ${FOUR_BUILD.diagonal.junctionY}`;
    gsap.set(diagonalGrowthRef.current, { opacity: 0, scaleY: 0, svgOrigin: diagJunction });
    gsap.set(crossArmRef.current, {
      opacity: 0, scaleX: 0,
      transformOrigin: FOUR_BUILD.crossArm.origin,
      svgOrigin: FOUR_BUILD.crossArm.origin.replaceAll('px', ''),
    });

    gsap.set(cClipRectRef.current, { attr: { cx: cCenter.x, cy: cCenter.y, r: 0 } });

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
      monoTl.to(backdropRef.current, {
        attr: { cx: 255, cy: 398, rx: 215, ry: 132 },
        duration: 0.5, ease: 'power2.out',
      }, 0);
    }

    monoTl.to(bodyDormantRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 0.05);
    monoTl.to(armDormantRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 0.05);
    monoTl.to(bodyBaseRef.current, { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 0.05);
    monoTl.to(armBaseRef.current, { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 0.05);

    wordLetters.forEach((letter, i) => {
      const delay = 0.18 + i * 0.04;
      monoTl.fromTo(letter,
        { opacity: 0, y: 8 },
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

    colourTl.to(cBaseRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0);
    colourTl.to(bodyBaseRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0);
    colourTl.to(armBaseRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0);

    colourTl.set(cClipRectRef.current, { attr: { cx: cCenter.x, cy: cCenter.y, r: 0 } }, 0);
    colourTl.to(cColourRef.current, { opacity: 1, duration: 0.01 }, 0);
    colourTl.to(cClipRectRef.current, { attr: { r: cFullRadius }, duration: 0.65, ease: 'power2.out' }, 0.02);

    /* -- 4 structural build -- */

    colourTl.set(stemLowerRef.current, { opacity: 1, scaleY: 0 }, FOUR_BUILD.stemLower.at);
    colourTl.set(stemUpperRef.current, { opacity: 1, scaleY: 0 }, FOUR_BUILD.stemUpper.at);
    colourTl.set(diagonalGrowthRef.current, { opacity: 1, scaleY: 0 }, FOUR_BUILD.diagonal.at);
    colourTl.set(crossArmRef.current, { opacity: 1, scaleX: 0 }, FOUR_BUILD.crossArm.at);

    colourTl.to(stemLowerRef.current, { scaleY: 1, duration: FOUR_BUILD.stemLower.duration, ease: 'none' }, FOUR_BUILD.stemLower.at);
    colourTl.to(stemUpperRef.current, { scaleY: 1, duration: FOUR_BUILD.stemUpper.duration, ease: 'none' }, FOUR_BUILD.stemUpper.at);
    colourTl.to(diagonalGrowthRef.current, { scaleY: 1, duration: FOUR_BUILD.diagonal.duration, ease: 'none' }, FOUR_BUILD.diagonal.at);

    colourTl.to(bodySealRef.current, { opacity: 1, duration: 0.06, ease: 'none' }, FOUR_BUILD.bodySealAt);
    colourTl.to(stemUpperRef.current, { opacity: 0, duration: 0.06, ease: 'none' }, FOUR_BUILD.bodySealAt);
    colourTl.to(diagonalGrowthRef.current, { opacity: 0, duration: 0.06, ease: 'none' }, FOUR_BUILD.bodySealAt);

    colourTl.to(crossArmRef.current, { scaleX: 1, duration: FOUR_BUILD.crossArm.duration, ease: 'power2.in' }, FOUR_BUILD.crossArm.at);

    colourTl.to(armSealRef.current, { opacity: 1, duration: 0.06, ease: 'none' }, FOUR_BUILD.armSealAt);
    colourTl.to(stemLowerRef.current, { opacity: 0, duration: 0.06, ease: 'none' }, FOUR_BUILD.armSealAt);
    colourTl.to(crossArmRef.current, { opacity: 0, duration: 0.06, ease: 'none' }, FOUR_BUILD.armSealAt);

    /* -- Per-letter spring domino chain -- */

    LETTER_SPRINGS.forEach((spring, index) => {
      const letter = wordLetters[index];
      const pair = C4_WORDMARK_MORPH_PAIRS[index];
      if (!letter || !pair.normalized.normalizedPaths) return;

      const impactAt = impactTimes[index];
      const letterBox = letter.getBBox();
      const hingeHeight = letterBox.height;
      const { keyframes, stepDur, numKeyframes, tPeak, resolveDuration } = computeSpringTrajectory(spring);

      for (let ki = 0; ki <= numKeyframes; ki++) {
        const kf = keyframes[ki];
        const kfTime = impactAt + ki * stepDur;
        if (ki === 0) {
          colourTl.set(letter, { rotation: kf.rotation, y: hingeTranslationY(kf.rotation, hingeHeight) }, kfTime);
        } else {
          colourTl.to(letter, {
            rotation: kf.rotation, y: hingeTranslationY(kf.rotation, hingeHeight),
            duration: stepDur, ease: 'none',
          }, kfTime);
        }
      }

      const springToPeak = tPeak - TENSION_DURATION;
      const morphStart = impactAt + TENSION_DURATION + springToPeak * 0.25;
      const morphDuration = Math.max(0.05, springToPeak * 0.60);
      colourTl.to(letter, { attr: { d: pair.normalized.normalizedPaths.italicPath }, duration: morphDuration, ease: 'sine.inOut' }, morphStart);

      const settleStart = impactAt + resolveDuration;
      colourTl.to(letter, { rotation: 0, y: 0, duration: 0.08, ease: 'power2.out' }, settleStart);
    });

    const lockTime = Math.max(
      ...LETTER_SPRINGS.map((sp, i) => {
        const { resolveDuration: rd } = computeSpringTrajectory(sp);
        return impactTimes[i] + rd + 0.08;
      })
    );
    wordLetters.forEach((letter) => {
      if (letter) colourTl.set(letter, { rotation: 0, y: 0, x: 0 }, lockTime);
    });

    colourTlRef.current = colourTl;

    /* ================================================================
       STAGE 3 TIMELINE — Colour → Dormant (paused, hover-driven)
       ================================================================ */

    const dormantTl = gsap.timeline({
      paused: true,
      onComplete: () => { stageRef.current = 0; },
      onReverseComplete: () => { stageRef.current = 2; },
    });

    wordLetters.forEach((letter, i) => {
      const pair = C4_WORDMARK_MORPH_PAIRS[i];
      if (!pair.normalized.normalizedPaths) return;
      const uprightPath = pair.normalized.normalizedPaths.uprightPath || pair.raw.uprightPath;
      const delay = i * 0.025;
      dormantTl.to(letter, { attr: { d: uprightPath }, duration: 0.28, ease: 'power2.inOut' }, delay);
    });

    wordLetters.forEach((letter, i) => {
      const delay = 0.26 + i * 0.02;
      dormantTl.to(letter, { opacity: 0.5, duration: 0.16, ease: 'power2.in' }, delay);
    });

    wordLetters.forEach((letter, i) => {
      const delay = 0.38 + i * 0.035;
      dormantTl.to(letter, { scaleY: 0, y: 1.5, opacity: 0, duration: 0.34, ease: 'power3.in' }, delay);
    });

    dormantTl.set(stemLowerRef.current, { opacity: 1 }, 0.4);
    dormantTl.set(crossArmRef.current, { opacity: 1 }, 0.4);
    dormantTl.to(armSealRef.current, { opacity: 0, duration: 0.06, ease: 'none' }, 0.4);

    dormantTl.to(crossArmRef.current, { scaleX: 0, duration: 0.18, ease: 'power2.out' }, 0.44);

    dormantTl.set(stemUpperRef.current, { opacity: 1 }, 0.5);
    dormantTl.set(diagonalGrowthRef.current, { opacity: 1 }, 0.5);
    dormantTl.to(bodySealRef.current, { opacity: 0, duration: 0.06, ease: 'none' }, 0.5);

    dormantTl.to(diagonalGrowthRef.current, { scaleY: 0, duration: 0.28, ease: 'power2.inOut' }, 0.54);
    dormantTl.to(stemUpperRef.current, { scaleY: 0, duration: 0.24, ease: 'power2.inOut' }, 0.62);
    dormantTl.to(stemLowerRef.current, { scaleY: 0, duration: 0.22, ease: 'power2.inOut' }, 0.72);

    dormantTl.to(stemUpperRef.current, { opacity: 0, duration: 0.08 }, 0.84);
    dormantTl.to(diagonalGrowthRef.current, { opacity: 0, duration: 0.08 }, 0.80);
    dormantTl.to(stemLowerRef.current, { opacity: 0, duration: 0.08 }, 0.92);
    dormantTl.to(crossArmRef.current, { opacity: 0, duration: 0.08 }, 0.60);

    dormantTl.to(cClipRectRef.current, { attr: { r: 0 }, duration: 0.58, ease: 'power2.inOut' }, 0.48);
    dormantTl.to(cColourRef.current, { opacity: 0, duration: 0.05 }, 1.04);

    dormantTl.to(cBaseRef.current, { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 0.65);
    dormantTl.to(bodyDormantRef.current, { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 0.70);
    dormantTl.to(armDormantRef.current, { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 0.70);

    dormantTl.to(bodyBaseRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' }, 0.70);
    dormantTl.to(armBaseRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' }, 0.70);

    if (showBackdrop && backdropRef.current) {
      dormantTl.to(backdropRef.current, {
        attr: { cx: 206, cy: 389, rx: 165, ry: 120 },
        duration: 0.45, ease: 'power2.inOut',
      }, 0.80);
    }

    dormantTl.set(wordLetters, { y: 0, rotation: 0, x: 0, scaleY: 1, opacity: 0 }, 1.30);

    dormantTlRef.current = dormantTl;

    return () => {
      if (monoTlRef.current) { monoTlRef.current.kill(); monoTlRef.current = null; }
      if (colourTlRef.current) { colourTlRef.current.kill(); colourTlRef.current = null; }
      if (dormantTlRef.current) { dormantTlRef.current.kill(); dormantTlRef.current = null; }
    };
  }, { scope: rootRef, dependencies: [full, showBackdrop] });

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
      className={`inline-flex items-center select-none ${className}`}
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
            <feDropShadow dx="0" dy="1" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.22"/>
          </filter>
          <filter id={backdropBlurId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" />
          </filter>
        </defs>
        {full ? (
          <>
            <defs>
              <clipPath id={cClipId} clipPathUnits="userSpaceOnUse">
                <circle ref={cClipRectRef} />
              </clipPath>
              <clipPath id={stemUpperClipId} clipPathUnits="userSpaceOnUse">
                <polygon points={FOUR_SEGMENTS.stemUpper} />
              </clipPath>
              <clipPath id={diagonalClipId} clipPathUnits="userSpaceOnUse">
                <polygon points={FOUR_SEGMENTS.diagonal} />
              </clipPath>
              <clipPath id={stemLowerClipId} clipPathUnits="userSpaceOnUse">
                <polygon points={FOUR_SEGMENTS.stemLower} />
              </clipPath>
              <clipPath id={crossArmClipId} clipPathUnits="userSpaceOnUse">
                <polygon points={FOUR_SEGMENTS.crossArm} />
              </clipPath>
            </defs>

            <g transform={LOCKUP_TRANSFORM}>
              {/* Backdrop — soft dark-grey translucent bubble */}
              {showBackdrop ? (
                <ellipse
                  ref={backdropRef}
                  cx="206" cy="389"
                  rx="165" ry="120"
                  fill="#555"
                  opacity="0.15"
                  filter={`url(#${backdropBlurId})`}
                />
              ) : null}

              {/* C — dormant/mono base (always rendered, opacity-controlled) */}
              <path ref={cBaseRef} d={FULL_UPRIGHT.cArc} fill={mono.cArc} filter={`url(#${cPresenceId})`} />

              {/* C — colour layer (clipped by iris bloom) */}
              <g ref={cColourRef}>
                <path d={FULL_UPRIGHT.cArc} fill={colour.cArc} clipPath={`url(#${cClipId})`} />
              </g>

              {/* 4 body — dormant palette */}
              <polygon ref={bodyDormantRef} points={FULL_UPRIGHT.fourBody} fill={dormant.fourBody} />

              {/* 4 body — mono base (hidden in dormant state) */}
              <polygon ref={bodyBaseRef} points={FULL_UPRIGHT.fourBody} fill={mono.fourBody} />

              {/* 4 body — colour seal */}
              <polygon ref={bodySealRef} points={FULL_UPRIGHT.fourBody} fill={colour.fourBody} />

              {/* Colour build segments */}
              <g ref={stemUpperRef} clipPath={`url(#${stemUpperClipId})`}>
                <polygon points={FULL_UPRIGHT.fourBody} fill={colour.fourBody} />
              </g>
              <g ref={diagonalGrowthRef} transform={`rotate(${FOUR_BUILD.diagonal.angle} ${FOUR_BUILD.diagonal.junctionX} ${FOUR_BUILD.diagonal.junctionY})`}>
                <g transform={`rotate(${-FOUR_BUILD.diagonal.angle} ${FOUR_BUILD.diagonal.junctionX} ${FOUR_BUILD.diagonal.junctionY})`} clipPath={`url(#${diagonalClipId})`}>
                  <polygon points={FULL_UPRIGHT.fourBody} fill={colour.fourBody} />
                </g>
              </g>

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
                {/* Colour build segments */}
                <g ref={stemLowerRef} clipPath={`url(#${stemLowerClipId})`}>
                  <polygon points={FULL_UPRIGHT.fourArm} fill={colour.fourArm} />
                </g>
                <g ref={crossArmRef} clipPath={`url(#${crossArmClipId})`}>
                  <polygon points={FULL_UPRIGHT.fourArm} fill={colour.fourArm} />
                </g>
                <polygon ref={armSealRef} points={FULL_UPRIGHT.fourArm} fill={colour.fourArm} />
              </g>

              {/* Word "Studios" — letters individually animated */}
              <g ref={wordGroupRef}>
                <MorphWordPaths pairs={C4_WORDMARK_MORPH_PAIRS} fill={mono.text} refs={morphLetterRefs} />
              </g>
            </g>
          </>
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
