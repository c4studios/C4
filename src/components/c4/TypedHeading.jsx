import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_TYPE_SPEED = 78;
const DEFAULT_DELETE_SPEED = 44;
const DEFAULT_HOLD_TIME = 1850;
const DEFAULT_PAUSE_TIME = 420;
const DEFAULT_START_DELAY = 0;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);

    const handleChange = (event) => setReduced(event.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}

export default function TypedHeading({
  lines = [],
  className = '',
  cursorClassName = '',
  typeSpeed = DEFAULT_TYPE_SPEED,
  deleteSpeed = DEFAULT_DELETE_SPEED,
  holdTime = DEFAULT_HOLD_TIME,
  pauseTime = DEFAULT_PAUSE_TIME,
  startDelay = DEFAULT_START_DELAY,
  stopAtLastLine = false,
}) {
  const safeLines = useMemo(() => lines.filter(Boolean), [lines]);
  const firstLine = safeLines[0] || '';
  const reducedMotion = usePrefersReducedMotion();
  const measureRef = useRef(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing');
  const [reservedHeight, setReservedHeight] = useState(null);
  const animateTyping = !reducedMotion && safeLines.length > 0;
  const shouldLoop = !reducedMotion && safeLines.length > 1;
  const shouldStopAtLastLine = shouldLoop && stopAtLastLine;
  const showCursor = !reducedMotion && safeLines.length > 0;

  useEffect(() => {
    setLineIndex(0);
    setDisplayed(animateTyping ? '' : firstLine);
    setPhase(animateTyping ? 'typing' : 'idle');
  }, [animateTyping, firstLine]);

  useLayoutEffect(() => {
    const root = measureRef.current;
    if (!root) return undefined;

    const measure = () => {
      const nodes = root.querySelectorAll('[data-c4-typed-measure]');
      let maxHeight = 0;

      nodes.forEach((node) => {
        maxHeight = Math.max(maxHeight, node.getBoundingClientRect().height);
      });

      setReservedHeight(maxHeight ? Math.ceil(maxHeight) : null);
    };

    measure();

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(measure)
      : null;

    if (resizeObserver) {
      resizeObserver.observe(root);
      root.querySelectorAll('[data-c4-typed-measure]').forEach((node) => resizeObserver.observe(node));
    }

    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);
      resizeObserver?.disconnect();
    };
  }, [className, cursorClassName, safeLines]);

  useEffect(() => {
    if (!animateTyping) {
      setDisplayed(firstLine);
      setPhase('idle');
      return undefined;
    }

    const currentLine = safeLines[lineIndex] || '';
    let timeoutId;

    if (phase === 'typing') {
      if (displayed.length < currentLine.length) {
        timeoutId = window.setTimeout(() => {
          setDisplayed(currentLine.slice(0, displayed.length + 1));
        }, displayed.length === 0 ? startDelay + typeSpeed : typeSpeed);
      } else {
        timeoutId = window.setTimeout(() => {
          if (shouldStopAtLastLine && lineIndex === safeLines.length - 1) {
            setPhase('idle');
            return;
          }

          setPhase(shouldLoop ? 'holding' : 'idle');
        }, holdTime);
      }
    } else if (phase === 'holding') {
      timeoutId = window.setTimeout(() => {
        setPhase('deleting');
      }, pauseTime);
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timeoutId = window.setTimeout(() => {
          setDisplayed(currentLine.slice(0, displayed.length - 1));
        }, deleteSpeed);
      } else {
        timeoutId = window.setTimeout(() => {
          setLineIndex((prev) => (prev + 1) % safeLines.length);
          setPhase('typing');
        }, pauseTime);
      }
    }

    return () => window.clearTimeout(timeoutId);
  }, [
    animateTyping,
    deleteSpeed,
    displayed,
    firstLine,
    holdTime,
    lineIndex,
    pauseTime,
    phase,
    safeLines,
    shouldStopAtLastLine,
    shouldLoop,
    startDelay,
    typeSpeed,
  ]);

  const renderCursor = () => (
    showCursor ? (
      <span
        className={`c4-typed-cursor ${cursorClassName}`.trim()}
        aria-hidden="true"
      >
        _
      </span>
    ) : null
  );

  return (
    <span
      className="relative block w-full"
      style={reservedHeight ? { minHeight: `${reservedHeight}px` } : undefined}
    >
      <span className={`${className}`.trim()}>
        {displayed || '\u00A0'}
        {renderCursor()}
      </span>

      <span
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        {safeLines.map((line) => (
          <span
            key={line}
            data-c4-typed-measure
            className={`${className} block w-full`.trim()}
          >
            {line}
            {renderCursor()}
          </span>
        ))}
      </span>
    </span>
  );
}
