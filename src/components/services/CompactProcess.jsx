import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProcessCard from '../services/ProcessCard';

const focusRingStyle = /** @type {import('react').CSSProperties} */ ({
  '--tw-ring-color': 'var(--c4-ring)',
});

const steps = [
  {
    label: 'Discovery',
    description: 'We map the business, the audience, and the constraints before anything else moves.',
    deliverables: ['Stakeholder alignment', 'Competitive landscape', 'Scope brief'],
    duration: 'Typical: 1–2 wk',
  },
  {
    label: 'Strategy',
    description: 'Architecture, content structure, and technical approach — locked before design begins.',
    deliverables: ['Information architecture', 'Content schema', 'Technical blueprint'],
    duration: 'Typical: 1 wk',
  },
  {
    label: 'Design',
    description: 'Visual systems and interface design, iterated against real content and real feedback.',
    deliverables: ['Wireframes', 'Design system', 'Interaction spec'],
    duration: 'Typical: 2–3 wk',
  },
  {
    label: 'Build',
    description: 'Production-grade code — every component engineered for speed and long-term maintainability.',
    deliverables: ['Front-end engineering', 'CMS integration', 'Performance audit'],
    duration: 'Typical: 2–4 wk',
  },
  {
    label: 'Refine',
    description: 'Final polish pass: motion, accessibility, and cross-device quality assurance.',
    deliverables: ['Motion detail', 'Accessibility review', 'Device matrix'],
    duration: 'Typical: 1 wk',
  },
  {
    label: 'Launch',
    description: 'Deployment, documentation, and a support window to ensure everything lands clean.',
    deliverables: ['Production deploy', 'Handover docs', 'Post-launch support'],
    duration: 'Typical: 1 wk',
  },
];

export default function CompactProcess() {
  const [active, setActive] = useState(0);
  const [slideStyles, setSlideStyles] = useState([]);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const slideRefs = useRef([]);
  const rafRef = useRef(null);
  const snapTimerRef = useRef(null);
  const isSnappingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragRef = useRef({ startX: 0, startScroll: 0, hasMoved: false });

  // Arrow navigation controller refs
  const targetIndexRef = useRef(0);
  const arrowRafRef = useRef(null);
  const arrowAnimatingRef = useRef(false);
  const [arrowAnimating, setArrowAnimating] = useState(false);

  // Compute per-slide styles based on distance from container centre
  const computeStyles = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    let closestIdx = 0;
    let closestDist = Infinity;
    const newStyles = [];

    slideRefs.current.forEach((el, i) => {
      if (!el) { newStyles.push({ scale: 0.94, opacity: 0.5 }); return; }
      const rect = el.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const dist = Math.abs(slideCenter - containerCenter);
      const maxDist = containerRect.width * 0.6;

      // Normalised 0..1 where 0 = centred, 1 = far away
      const t = Math.min(dist / maxDist, 1);

      // Smooth interpolation
      const scale = 1 - t * 0.06;       // 1.0 → 0.94
      const opacity = 1 - t * 0.45;     // 1.0 → 0.55

      newStyles.push({ scale: Math.max(0.92, scale), opacity: Math.max(0.45, opacity) });

      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    setSlideStyles(newStyles);
    targetIndexRef.current = closestIdx;
    setActive((current) => {
      if (current === closestIdx) return current;
      return closestIdx;
    });
  }, []);

  // Compute target scrollLeft to centre a slide
  const getTargetScrollLeft = useCallback((idx) => {
    const container = scrollRef.current;
    const slide = slideRefs.current[idx];
    if (!container || !slide) return null;
    return slide.offsetLeft + slide.offsetWidth / 2 - container.offsetWidth / 2;
  }, []);

  // Cancellable RAF scroll animation — easeOutCubic
  const animateScrollTo = useCallback((targetLeft, onComplete) => {
    // Cancel any in-flight arrow animation
    if (arrowRafRef.current) {
      cancelAnimationFrame(arrowRafRef.current);
      arrowRafRef.current = null;
    }

    const container = scrollRef.current;
    if (!container) return;

    const start = container.scrollLeft;
    const delta = targetLeft - start;
    const duration = 300; // ms — fast & premium
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      container.scrollLeft = start + delta * eased;

      if (progress < 1) {
        arrowRafRef.current = requestAnimationFrame(step);
      } else {
        arrowRafRef.current = null;
        arrowAnimatingRef.current = false;
        setArrowAnimating(false);
        if (onComplete) onComplete();
      }
    };

    arrowAnimatingRef.current = true;
    setArrowAnimating(true);
    arrowRafRef.current = requestAnimationFrame(step);
  }, []);

  // Smooth-scroll to centre a specific slide (for non-arrow contexts: snap, dot click, init)
  const scrollToSlide = useCallback((idx) => {
    const targetLeft = getTargetScrollLeft(idx);
    if (targetLeft === null) return;

    isSnappingRef.current = true;
    animateScrollTo(targetLeft, () => {
      isSnappingRef.current = false;
    });
  }, [getTargetScrollLeft, animateScrollTo]);

  const snapToNearest = useCallback(() => {
    // Don't snap if arrow animation is in flight
    if (arrowAnimatingRef.current) return;

    const container = scrollRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;

    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const slideCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(slideCenter - containerCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    scrollToSlide(closestIdx);
    setActive(closestIdx);
    targetIndexRef.current = closestIdx;
  }, [scrollToSlide]);

  // RAF-driven style updates on scroll
  const onScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(computeStyles);

    // Reset snap timer — snap after idle (but not during arrow animation or drag)
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    if (!isSnappingRef.current && !isDragging && !arrowAnimatingRef.current) {
      snapTimerRef.current = setTimeout(() => {
        snapToNearest();
      }, 160);
    }
  }, [computeStyles, isDragging, snapToNearest]);

  // Arrow navigation: goTo, goNext, goPrev — uses targetIndexRef as authoritative source
  const goTo = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, idx));

    // Cancel any pending snap timer
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);

    // Update authoritative target
    targetIndexRef.current = clamped;

    // Immediately update active state for instant UI feedback (dots, arrows)
    setActive(clamped);

    // Compute target and start cancellable animation
    const targetLeft = getTargetScrollLeft(clamped);
    if (targetLeft === null) return;

    isSnappingRef.current = true;
    animateScrollTo(targetLeft, () => {
      isSnappingRef.current = false;
    });
  }, [getTargetScrollLeft, animateScrollTo]);

  // goNext/goPrev read from targetIndexRef (not active state) so rapid clicks stack correctly
  const goNext = useCallback(() => {
    goTo(targetIndexRef.current + 1);
  }, [goTo]);

  const goPrev = useCallback(() => {
    goTo(targetIndexRef.current - 1);
  }, [goTo]);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', onScroll, { passive: true });
    // Initial computation
    computeStyles();
    return () => {
      container.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      if (arrowRafRef.current) cancelAnimationFrame(arrowRafRef.current);
    };
  }, [onScroll, computeStyles]);

  // Wheel handler: fluid pass-through for trackpad, prevent browser back/forward
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!isHorizontal || Math.abs(e.deltaX) < 1) return;

      // Prevent browser back/forward navigation
      e.preventDefault();
      // Apply delta directly — fluid 1:1 motion
      container.scrollLeft += e.deltaX;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Pointer drag
  const handlePointerDown = useCallback((e) => {
    if (e.pointerType === 'touch') return;
    const container = scrollRef.current;
    if (!container) return;
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    if (arrowRafRef.current) {
      cancelAnimationFrame(arrowRafRef.current);
      arrowRafRef.current = null;
      arrowAnimatingRef.current = false;
      setArrowAnimating(false);
    }
    isSnappingRef.current = false;

    dragRef.current = { startX: e.clientX, startScroll: container.scrollLeft, hasMoved: false };
    setIsDragging(true);
    container.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || e.pointerType === 'touch') return;
    const container = scrollRef.current;
    if (!container) return;

    const diff = e.clientX - dragRef.current.startX;
    if (Math.abs(diff) > 4) dragRef.current.hasMoved = true;
    container.scrollLeft = dragRef.current.startScroll - diff;
  }, [isDragging]);

  const handlePointerUp = useCallback((e) => {
    if (!isDragging || e.pointerType === 'touch') return;
    const container = scrollRef.current;
    setIsDragging(false);
    if (container?.hasPointerCapture(e.pointerId)) {
      container.releasePointerCapture(e.pointerId);
    }
    if (dragRef.current.hasMoved) {
      snapToNearest();
    }
  }, [isDragging, snapToNearest]);

  // Keyboard: works when focused OR hovered
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const section = sectionRef.current;
      const isFocused = section && section.contains(document.activeElement);
      if (!isFocused && !isHovered) return;

      e.preventDefault();
      if (e.key === 'ArrowRight') goNext();
      else goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, isHovered]);

  // Initial scroll to first slide on mount
  useEffect(() => {
    const t = setTimeout(() => { targetIndexRef.current = 0; scrollToSlide(0); }, 50);
    return () => clearTimeout(t);
  }, [scrollToSlide]);

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      className="py-16 md:py-28 outline-none"
      style={{ backgroundColor: 'var(--c4-bg-alt)' }}
      aria-label="Project process stages"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <div>
            <h3 className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>Process</h3>
            <p className="mt-2.5 text-[14px] leading-[1.6] max-w-[380px]" style={{ color: 'var(--c4-text-muted)' }}>
              Six stages. One standard. Every project follows the same disciplined path.
            </p>
          </div>

          {/* Desktop arrows */}
          <div className="hidden md:flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={goPrev}
              disabled={active === 0}
              aria-label="Previous stage"
              className="w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none"
              style={{ borderColor: active === 0 ? 'var(--c4-border)' : 'var(--c4-text-faint)', color: active === 0 ? 'var(--c4-border)' : 'var(--c4-text-muted)', cursor: active === 0 ? 'default' : 'pointer' }}
            >
              <ChevronLeft size={13} strokeWidth={1.6} />
            </button>
            <button
              onClick={goNext}
              disabled={active === steps.length - 1}
              aria-label="Next stage"
              className="w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none"
              style={{ borderColor: active === steps.length - 1 ? 'var(--c4-border)' : 'var(--c4-text-faint)', color: active === steps.length - 1 ? 'var(--c4-border)' : 'var(--c4-text-muted)', cursor: active === steps.length - 1 ? 'default' : 'pointer' }}
            >
              <ChevronRight size={13} strokeWidth={1.6} />
            </button>
          </div>
        </motion.div>

        {/* Fluid scroll carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className={`flex gap-6 overflow-x-auto overflow-y-hidden pb-2 process-scroll-container select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              overscrollBehaviorX: 'contain',
              touchAction: 'pan-y',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              minHeight: 310,
              scrollSnapType: (isDragging || arrowAnimating) ? 'none' : 'x proximity',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Left spacer */}
            <div className="flex-shrink-0" style={{ width: 'max(24px, calc((100% - min(85vw, 580px)) / 2 - 12px))' }} aria-hidden="true" />

            {steps.map((step, i) => {
              const s = slideStyles[i] || { scale: 1, opacity: 1 };
              const isActive = i === active;
              return (
                <div
                  key={step.label}
                  ref={el => slideRefs.current[i] = el}
                  className="flex-shrink-0 w-[85vw] max-w-[580px] snap-center"
                  style={{
                    transform: `scale(${s.scale})`,
                    opacity: s.opacity,
                    transition: isDragging ? 'transform 0.05s linear, opacity 0.05s linear' : 'transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s cubic-bezier(0.22,1,0.36,1)',
                    transformOrigin: 'center center',
                  }}
                >
                  <ProcessCard step={step} index={i} total={steps.length} isActive={isActive} />
                </div>
              );
            })}

            {/* Right spacer */}
            <div className="flex-shrink-0" style={{ width: 'max(24px, calc((100% - min(85vw, 580px)) / 2 - 12px))' }} aria-hidden="true" />
          </div>
        </div>

        {/* Dots */}
        <div className="mt-8 flex items-center justify-between md:justify-center gap-4">
          <button
            onClick={goPrev}
            disabled={active === 0}
            aria-label="Previous stage"
            className="md:hidden w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300"
            style={{ borderColor: active === 0 ? 'var(--c4-border)' : 'var(--c4-text-faint)', color: active === 0 ? 'var(--c4-border)' : 'var(--c4-text-muted)' }}
          >
            <ChevronLeft size={13} strokeWidth={1.8} />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Process stages">
            {steps.map((s, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={active === i}
                aria-label={`Stage ${i + 1}: ${s.label}`}
                onClick={() => goTo(i)}
                className="group p-1 focus:outline-none focus-visible:ring-1 rounded-full"
                style={focusRingStyle}
              >
                <div
                  className="rounded-full h-[6px]"
                  style={{
                    width: active === i ? 20 : 6,
                    backgroundColor: active === i ? 'var(--c4-accent)' : 'var(--c4-border)',
                    transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1), background-color 0.4s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              </button>
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={active === steps.length - 1}
            aria-label="Next stage"
            className="md:hidden w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300"
            style={{ borderColor: active === steps.length - 1 ? 'var(--c4-border)' : 'var(--c4-text-faint)', color: active === steps.length - 1 ? 'var(--c4-border)' : 'var(--c4-text-muted)' }}
          >
            <ChevronRight size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <style>{`
        .process-scroll-container::-webkit-scrollbar { display: none; }
        .process-scroll-container { -ms-overflow-style: none; }
        @media (prefers-reduced-motion: reduce) {
          .process-scroll-container { scroll-behavior: auto !important; }
        }
      `}</style>
    </section>
  );
}