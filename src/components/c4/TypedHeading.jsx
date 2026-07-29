import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_TYPE_SPEED = 78;
const DEFAULT_DELETE_SPEED = 44;
const DEFAULT_HOLD_TIME = 1850;
const DEFAULT_PAUSE_TIME = 420;
const DEFAULT_START_DELAY = 0;

/* staticMode — the house pattern (see homeMotion.js, ServiceWeb.jsx): the
   Prerender UA or an OS reduced-motion preference, resolved SYNCHRONOUSLY in a
   useMemo so it is correct on the very first render.

   This must not be an effect-based hook. An effect returns false on first
   render, so the prerenderer captured this heading mid-animation and the
   homepage shipped its <h1> as a partially typed string with a trailing cursor
   glyph, followed by all six measure phrases. That string was the indexed
   heading of the site's priority-1.0 page. Resolving it synchronously means the
   static HTML now carries one complete phrase and nothing else. */
function useStaticMode() {
  return useMemo(() => {
    if (typeof window === 'undefined') return true;
    const prerender =
      typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent);
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prerender || reduced;
  }, []);
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
  onLineChange,
}) {
  const safeLines = useMemo(() => lines.filter(Boolean), [lines]);
  const firstLine = safeLines[0] || '';
  const reducedMotion = useStaticMode();
  const measureRef = useRef(null);
  const [lineIndex, setLineIndex] = useState(0);
  /* Seed with the complete first line so the very first paint (and therefore
     the prerendered HTML) is a whole, readable phrase rather than an empty
     string that fills in later. */
  const [displayed, setDisplayed] = useState(firstLine);
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

  useEffect(() => {
    if (typeof onLineChange === 'function') onLineChange(lineIndex);
  }, [lineIndex, onLineChange]);

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

  /* The measure block exists only to reserve height so the cycling text cannot
     reflow the page. Under staticMode nothing cycles, so rendering it would add
     every phrase to the heading's text for no layout benefit. Omitting it is
     what leaves the prerendered <h1> as one clean line. */
  return (
    <span
      className="relative block w-full"
      style={reservedHeight && !reducedMotion ? { minHeight: `${reservedHeight}px` } : undefined}
    >
      <span className={`${className}`.trim()}>
        {displayed || '\u00A0'}
        {renderCursor()}
      </span>

      {!reducedMotion && (
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
      )}
    </span>
  );
}
