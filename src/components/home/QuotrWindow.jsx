import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { animate, motion, useMotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTheme } from '../c4/ThemeContext';
import useHeatmapCanvas from './useHeatmapCanvas';
import { buildQuotrSrc, postQuotrTheme } from './quotrTheme';

const QUOTR_SLUG = 'fixm4qeq';
const CHROME_H = 44; // chrome bar height (px)

const INITIAL_W = 340;
const INITIAL_H = 680;
const MIN_W = 280;
const MIN_H = 420;
const MAX_W = 680;
const MAX_H = 900;
const EDGE_GAP = 24; // gap kept between window and the hero text column
const spring = { type: 'spring', stiffness: 520, damping: 38, mass: 0.9 };

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* The shared card chrome + iframe, used by both the mobile static
   card and the desktop floating window. */
function CardShell({ iframeRef, iframeHeight, interacting, dragHandleProps, src, onIframeLoad }) {
  const heatmapRef = useRef(null);
  useHeatmapCanvas(heatmapRef, {
    accentColor: '#5B7FA6',
    cellSize: 8,
    opacity: 0.4,
  });

  return (
    <div
      className="flex h-full flex-col rounded-2xl"
      style={{
        backgroundColor: 'var(--c4-card-bg)',
        border: '1px solid var(--c4-border)',
        boxShadow:
          '0 2px 4px rgba(0,0,0,0.04), 0 12px 32px -6px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.55) inset',
      }}
    >
      {/* Chrome bar — drag handle + mini heatmap */}
      <div
        {...dragHandleProps}
        className="relative flex shrink-0 items-center justify-between overflow-hidden border-b px-4"
        style={{
          height: CHROME_H,
          borderColor: 'var(--c4-border)',
          backgroundColor: 'var(--c4-bg)',
          borderRadius: '16px 16px 0 0',
          cursor: dragHandleProps ? 'grab' : 'default',
          touchAction: 'none',
        }}
      >
        <canvas
          ref={heatmapRef}
          className="pointer-events-none absolute inset-0"
          style={{ display: 'block' }}
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: 'var(--c4-accent)' }}
          />
          <span
            className="text-[10px] font-medium uppercase tracking-[0.18em]"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            Instant Estimate
          </span>
        </div>
        <Link
          to={createPageUrl('quote')}
          className="group relative inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.13em] transition-colors duration-200"
          style={{ color: 'var(--c4-text-faint)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c4-text)')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'var(--c4-text-faint)')
          }
          // Don't let a click that starts a drag navigate.
          onClick={(e) => e.stopPropagation()}
        >
          Full page
          <ArrowRight
            size={9}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Live Quotr iframe — fills remaining space */}
      <iframe
        ref={iframeRef}
        src={src}
        onLoad={onIframeLoad}
        title="Lock in your price now"
        width="100%"
        style={{
          display: 'block',
          border: 'none',
          flex: '1 1 auto',
          height: iframeHeight,
          borderRadius: '0 0 16px 16px',
          // Block pointer capture by the iframe while dragging/resizing.
          pointerEvents: interacting ? 'none' : 'auto',
        }}
      />
    </div>
  );
}

const RESIZE_DIRS = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

const HANDLE_STYLE = {
  n: { top: -3, left: 10, right: 10, height: 6, cursor: 'ns-resize' },
  s: { bottom: -3, left: 10, right: 10, height: 6, cursor: 'ns-resize' },
  e: { right: -3, top: 10, bottom: 10, width: 6, cursor: 'ew-resize' },
  w: { left: -3, top: 10, bottom: 10, width: 6, cursor: 'ew-resize' },
  ne: { top: -5, right: -5, width: 12, height: 12, cursor: 'nesw-resize' },
  nw: { top: -5, left: -5, width: 12, height: 12, cursor: 'nwse-resize' },
  se: { bottom: -5, right: -5, width: 12, height: 12, cursor: 'nwse-resize' },
  sw: { bottom: -5, left: -5, width: 12, height: 12, cursor: 'nesw-resize' },
};

export default function QuotrWindow({ boundsRef, textRef }) {
  const iframeRef = useRef(null);
  const windowRef = useRef(null);
  const { isDark } = useTheme();

  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );
  const [size, setSize] = useState({ w: INITIAL_W, h: INITIAL_H });
  const [interacting, setInteracting] = useState(false);
  const [ready, setReady] = useState(false);

  // Stable src (theme baked in once to avoid a flash) — live theme
  // changes are pushed via postMessage so the iframe never reloads.
  const [src] = useState(() => buildQuotrSrc(QUOTR_SLUG, isDark));

  const pushTheme = useCallback(() => {
    postQuotrTheme(iframeRef.current, isDark);
  }, [isDark]);

  // Forward the site theme whenever the visitor toggles light/dark.
  useEffect(() => {
    pushTheme();
  }, [pushTheme]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scaleX = useMotionValue(1);

  // Listen to the Quotr iframe's resize messages (mobile/static only —
  // the desktop window controls its own height via resize handles).
  useEffect(() => {
    const handler = (e) => {
      if (e.origin !== 'https://quotr.us') return;
      if (e.data?.type === 'quotr-resize' && iframeRef.current && !isDesktop) {
        iframeRef.current.style.height = e.data.height + 'px';
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [isDesktop]);

  // Track desktop breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* ── Geometry helpers (all in bounds-container coordinates) ── */
  const getBounds = useCallback(() => {
    const el = boundsRef?.current;
    if (!el) return { w: 0, h: 0, left: 0, top: 0 };
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height, left: r.left, top: r.top };
  }, [boundsRef]);

  // Left boundary the window may not cross (right edge of hero text + gap).
  const getBoundary = useCallback(() => {
    const bounds = getBounds();
    const t = textRef?.current;
    if (!t) return 0;
    const tr = t.getBoundingClientRect();
    return clamp(tr.right - bounds.left + EDGE_GAP, 0, bounds.w);
  }, [getBounds, textRef]);

  // Place the window initially on the right side of the bounds box.
  const place = useCallback(() => {
    if (!isDesktop) return;
    const bounds = getBounds();
    if (bounds.w === 0) return;
    const w = clamp(size.w, MIN_W, Math.min(MAX_W, bounds.w));
    const initX = clamp(bounds.w - w - 8, getBoundary(), bounds.w - w);
    const initY = clamp((bounds.h - size.h) / 2, 0, Math.max(0, bounds.h - size.h));
    x.set(initX);
    y.set(initY);
    setReady(true);
  }, [isDesktop, getBounds, getBoundary, size.w, size.h, x, y]);

  useEffect(() => {
    if (!isDesktop) {
      setReady(false);
      return undefined;
    }
    place();
    const onResize = () => {
      const bounds = getBounds();
      const boundary = getBoundary();
      // Re-clamp into the (possibly) new bounds.
      x.set(clamp(x.get(), boundary, Math.max(boundary, bounds.w - size.w)));
      y.set(clamp(y.get(), 0, Math.max(0, bounds.h - size.h)));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  /* ── Dragging (chrome bar) with spring "squeeze" repulsion ── */
  const onDragPointerDown = useCallback(
    (e) => {
      if (!isDesktop) return;
      // Ignore drags initiated on the "Full page" link.
      if (e.target.closest('a')) return;
      e.preventDefault();
      setInteracting(true);

      const startPX = e.clientX;
      const startPY = e.clientY;
      const x0 = x.get();
      const y0 = y.get();
      const bounds = getBounds();
      const boundary = getBoundary();
      const maxX = Math.max(boundary, bounds.w - size.w);
      const maxY = Math.max(0, bounds.h - size.h);

      const onMove = (ev) => {
        const dx = ev.clientX - startPX;
        const dy = ev.clientY - startPY;
        let nx = x0 + dx;
        const ny = clamp(y0 + dy, 0, maxY);

        // Spring "squeeze" when pushing left past the boundary.
        if (nx < boundary) {
          const over = boundary - nx;
          // Rubber-band: only allow a fraction of the incursion.
          nx = boundary - over * 0.28;
          // Compress horizontally — origin pinned to the left edge so
          // the window looks pressed against the text wall.
          const squeeze = clamp(over / 220, 0, 1);
          scaleX.set(1 - squeeze * 0.12);
        } else {
          nx = Math.min(nx, maxX);
          scaleX.set(1);
        }

        x.set(nx);
        y.set(ny);
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        setInteracting(false);
        // Spring everything back into the legal zone.
        const settledX = clamp(x.get(), boundary, maxX);
        animate(x, settledX, spring);
        animate(scaleX, 1, spring);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [isDesktop, getBounds, getBoundary, size.w, size.h, x, y, scaleX],
  );

  /* ── Resizing (8 handles) ── */
  const onResizePointerDown = useCallback(
    (e, dir) => {
      if (!isDesktop) return;
      e.preventDefault();
      e.stopPropagation();
      setInteracting(true);

      const startPX = e.clientX;
      const startPY = e.clientY;
      const x0 = x.get();
      const y0 = y.get();
      const w0 = size.w;
      const h0 = size.h;
      const bounds = getBounds();
      const boundary = getBoundary();

      const onMove = (ev) => {
        const dx = ev.clientX - startPX;
        const dy = ev.clientY - startPY;

        let left = x0;
        let top = y0;
        let right = x0 + w0;
        let bottom = y0 + h0;

        if (dir.includes('w')) left = x0 + dx;
        if (dir.includes('e')) right = x0 + w0 + dx;
        if (dir.includes('n')) top = y0 + dy;
        if (dir.includes('s')) bottom = y0 + h0 + dy;

        // Clamp edges to the bounds + text boundary.
        left = Math.max(left, boundary);
        top = Math.max(top, 0);
        right = Math.min(right, bounds.w);
        bottom = Math.min(bottom, bounds.h);

        // Enforce min/max by deriving the moving edge from the anchored one.
        let nw = clamp(right - left, MIN_W, MAX_W);
        let nh = clamp(bottom - top, MIN_H, MAX_H);

        if (dir.includes('w')) left = right - nw;
        else right = left + nw;
        if (dir.includes('n')) top = bottom - nh;
        else bottom = top + nh;

        // Final safety clamp on the moving (left/top) edges.
        left = Math.max(left, boundary);
        top = Math.max(top, 0);
        nw = right - left;
        nh = bottom - top;

        x.set(left);
        y.set(top);
        setSize({ w: nw, h: nh });
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        setInteracting(false);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [isDesktop, getBounds, getBoundary, size.w, size.h, x, y],
  );

  const iframeHeight = isDesktop ? size.h - CHROME_H : 640;

  /* ── Mobile / tablet: original static in-flow card ── */
  if (!isDesktop) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 16, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full lg:pl-4"
      >
        <div style={{ height: 684 }}>
          <CardShell
            iframeRef={iframeRef}
            iframeHeight={640}
            interacting={false}
            dragHandleProps={null}
            src={src}
            onIframeLoad={pushTheme}
          />
        </div>
        <p
          className="mt-3 text-center text-[10.5px]"
          style={{ color: 'var(--c4-text-faint)' }}
        >
          No calls · No commitment · ~2 min
        </p>
      </motion.div>
    );
  }

  /* ── Desktop: spacer (reserves grid column) + floating window ── */
  return (
    <>
      {/* Reserve the grid column footprint so the text column keeps its
          size and the bounds box reserves vertical room for the window. */}
      <div aria-hidden="true" style={{ width: INITIAL_W, height: INITIAL_H }} />

      <motion.div
        ref={windowRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute left-0 top-0 z-20"
        style={{
          x,
          y,
          scaleX,
          width: size.w,
          height: size.h,
          transformOrigin: 'left center',
          willChange: 'transform',
        }}
      >
        <CardShell
          iframeRef={iframeRef}
          iframeHeight={iframeHeight}
          interacting={interacting}
          dragHandleProps={{ onPointerDown: onDragPointerDown }}
          src={src}
          onIframeLoad={pushTheme}
        />

        {/* Resize handles */}
        {RESIZE_DIRS.map((dir) => (
          <div
            key={dir}
            onPointerDown={(e) => onResizePointerDown(e, dir)}
            style={{
              position: 'absolute',
              zIndex: 30,
              touchAction: 'none',
              ...HANDLE_STYLE[dir],
            }}
          />
        ))}

        <p
          className="absolute left-0 right-0 text-center text-[10.5px]"
          style={{ bottom: -22, color: 'var(--c4-text-faint)' }}
        >
          Drag · resize · or open full page
        </p>
      </motion.div>
    </>
  );
}
