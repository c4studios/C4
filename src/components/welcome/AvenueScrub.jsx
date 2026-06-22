/**
 * AvenueScrub — scroll-scrubbed frame sequence for the /welcome proof section.
 *
 * This is the "proof of capability" piece (handoff §5). It consumes a WebP
 * frame sequence rendered by Caleb's pipeline and draws it to a SINGLE canvas,
 * advancing the frame index on scroll via GSAP ScrollTrigger.
 *
 * Performance rules baked in (these are the bits that bite at events):
 *   - One <canvas>, frame index updated on scroll — never 90 swapped <img> tags.
 *   - Preload AND decode() every frame behind a loading gate; the scrub does
 *     not start until all frames are decoded, so it can never stall mid-scrub.
 *   - DPR capped (2 desktop / 1.5 mobile) and a coarser scrub threshold on
 *     phones to hold 60fps on a mid-range Android.
 *   - prefers-reduced-motion or WebGL/canvas-unavailable or no-frames-yet →
 *     the static `poster` is shown instead (passed as children).
 *
 * Until the Avenue A frames are dropped into /public/welcome/frames/, pass
 * frameCount={0} and the component renders the poster — the page ships today
 * and lights up the moment the asset lands (see that folder's README).
 *
 * Modelled on components/lens/ImageSequenceCanvas.jsx (same battle-tested
 * ScrollTrigger + native-scroll-fallback approach already shipping on /Lens).
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function AvenueScrub({
  scrollContainerRef,
  frameCount = 0,
  framePath = '/welcome/frames/avenue-',
  ext = 'webp',
  pad = 3,
  children, // poster / fallback content
}) {
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const progressRef = useRef(0);
  const rafRef = useRef(null);
  const liteRef = useRef(false);

  const reduced = prefersReducedMotion();
  const wantsSequence = frameCount > 0 && !reduced;

  const [status, setStatus] = useState(wantsSequence ? 'loading' : 'poster'); // loading | ready | poster
  const [progressPct, setProgressPct] = useState(0);

  /* ── Preload + DECODE every frame behind the loading gate ── */
  useEffect(() => {
    if (!wantsSequence) {
      setStatus('poster');
      return undefined;
    }

    let cancelled = false;
    const images = new Array(frameCount);
    let done = 0;

    const bump = () => {
      done += 1;
      if (cancelled) return;
      setProgressPct(Math.round((done / frameCount) * 100));
      if (done === frameCount) {
        framesRef.current = images;
        // Need at least one usable frame, otherwise fall back to the poster.
        const anyUsable = images.some((im) => im && im.complete && im.naturalWidth > 0);
        setStatus(anyUsable ? 'ready' : 'poster');
      }
    };

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.decoding = 'async';
      const num = String(i).padStart(pad, '0');
      img.src = `${framePath}${num}.${ext}`;
      images[i - 1] = img;

      const settle = () => bump();
      // decode() guarantees the bitmap is ready before we ever scrub to it.
      if (typeof img.decode === 'function') {
        img.decode().then(settle, settle);
      } else {
        img.onload = settle;
        img.onerror = settle;
      }
    }

    return () => {
      cancelled = true;
    };
  }, [wantsSequence, frameCount, framePath, ext, pad]);

  /* ── Draw the current frame (cover-fit, DPR-capped) ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const frames = framesRef.current;
    if (!frames.length) return;

    const ctx = canvas.getContext('2d');
    const dprCap = liteRef.current ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const idx = clamp(
      Math.floor(progressRef.current * (frames.length - 1)),
      0,
      frames.length - 1,
    );
    const img = frames[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const scale = Math.max(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
    const sw = img.naturalWidth * scale;
    const sh = img.naturalHeight * scale;
    ctx.drawImage(img, (rect.width - sw) / 2, (rect.height - sh) / 2, sw, sh);
    ctx.restore();
  }, []);

  /* ── Wire ScrollTrigger → frame index once frames are decoded ── */
  useEffect(() => {
    if (status !== 'ready') return undefined;
    const container = scrollContainerRef?.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const liteMq = window.matchMedia('(max-width: 768px), (hover: none) and (pointer: coarse)');
    const updateLite = () => {
      const was = liteRef.current;
      liteRef.current = liteMq.matches;
      if (was !== liteRef.current) draw();
    };
    updateLite();
    liteMq.addEventListener?.('change', updateLite);

    draw(); // first frame

    const threshold = () => (liteRef.current ? 0.0025 : 0.0006);
    const schedule = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0,
      onUpdate: (self) => {
        const p = clamp(self.progress, 0, 1);
        if (Math.abs(p - progressRef.current) > threshold()) {
          progressRef.current = p;
          schedule();
        }
      },
    });

    // Native-scroll fallback (in case ScrollTrigger is refreshing).
    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const p = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
      if (Math.abs(p - progressRef.current) > threshold() * 2) {
        progressRef.current = p;
        schedule();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const resizeObs = new ResizeObserver(() => {
      ScrollTrigger.refresh();
      draw();
    });
    resizeObs.observe(canvas);

    return () => {
      st.kill();
      window.removeEventListener('scroll', onScroll);
      resizeObs.disconnect();
      liteMq.removeEventListener?.('change', updateLite);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [status, draw, scrollContainerRef]);

  /* ── Render ── */
  if (status === 'ready') {
    return (
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-hidden="true"
        style={{ display: 'block' }}
      />
    );
  }

  // poster / loading
  return (
    <div className="relative w-full h-full">
      {children}
      {status === 'loading' && (
        <div
          className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2"
          aria-live="polite"
        >
          <div
            className="h-px w-28 overflow-hidden"
            style={{ backgroundColor: 'rgba(65,66,67,0.18)' }}
          >
            <div
              className="h-full transition-[width] duration-200 ease-out"
              style={{ width: `${progressPct}%`, backgroundColor: '#A30000' }}
            />
          </div>
          <span
            className="text-[10px] uppercase tracking-[0.24em]"
            style={{ color: 'rgba(65,66,67,0.55)' }}
          >
            Loading {progressPct}%
          </span>
        </div>
      )}
    </div>
  );
}
