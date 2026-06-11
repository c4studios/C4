import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Accessible before/after comparison slider.
 *
 * Pass either image URLs (`beforeSrc`/`afterSrc`) or arbitrary nodes
 * (`before`/`after`) to render inside each pane. Drag the handle, click
 * anywhere on the track, or focus the handle and use the arrow keys.
 */
export default function BeforeAfterSlider({
  before,
  after,
  beforeSrc,
  afterSrc,
  beforeLabel = 'Before',
  afterLabel = 'After',
  aspect = '16 / 10',
  className = '',
}) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50);
  const draggingRef = useRef(false);

  const setFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setFromClientX(clientX);
    };
    const onUp = () => { draggingRef.current = false; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [setFromClientX]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { setPos((p) => Math.max(0, p - 4)); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPos((p) => Math.min(100, p + 4)); e.preventDefault(); }
    if (e.key === 'Home') { setPos(0); e.preventDefault(); }
    if (e.key === 'End') { setPos(100); e.preventDefault(); }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-[4px] select-none ${className}`}
      style={{ aspectRatio: aspect, border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)', touchAction: 'pan-y' }}
      onPointerDown={(e) => { draggingRef.current = true; setFromClientX(e.clientX); }}
    >
      {/* AFTER (full, underneath) */}
      <div className="absolute inset-0">
        {afterSrc ? (
          <img src={afterSrc} alt={afterLabel} className="h-full w-full object-cover" draggable="false" />
        ) : after}
        <span className="absolute bottom-3 right-3 z-20 rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(4px)' }}>
          {afterLabel}
        </span>
      </div>

      {/* BEFORE (clipped to the left of the handle) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {beforeSrc ? (
          <img src={beforeSrc} alt={beforeLabel} className="h-full w-full object-cover" draggable="false" />
        ) : before}
        <span className="absolute bottom-3 left-3 z-20 rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(4px)' }}>
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div className="absolute top-0 bottom-0 z-30" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px]" style={{ backgroundColor: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.15)' }} />
        <button
          type="button"
          role="slider"
          aria-label="Drag to compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKeyDown}
          onPointerDown={(e) => { e.stopPropagation(); draggingRef.current = true; }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full cursor-ew-resize focus:outline-none focus-visible:ring-2"
          style={{ backgroundColor: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.25)', color: '#1a1a1a' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
