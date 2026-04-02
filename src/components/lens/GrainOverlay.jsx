/**
 * GrainOverlay — GPU-accelerated film grain
 * Uses a tiny SVG noise filter with CSS animation for zero-impact grain.
 * Much more performant than canvas-based alternatives.
 */
import React, { useId } from 'react';

export default function GrainOverlay({ opacity = 0.035 }) {
  const id = useId();
  const filterId = `grain-${id}`;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[9990]"
        style={{
          opacity,
          mixBlendMode: 'overlay',
        }}
      >
        <svg
          className="absolute inset-0 w-[calc(100%+4px)] h-[calc(100%+4px)] -left-[2px] -top-[2px]"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animation: 'grainDrift 0.3s steps(4) infinite' }}
        >
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${filterId})`} />
        </svg>
      </div>
      <style>{`
        @keyframes grainDrift {
          0% { transform: translate3d(0, 0, 0); }
          25% { transform: translate3d(-1px, 1px, 0); }
          50% { transform: translate3d(1px, -1px, 0); }
          75% { transform: translate3d(-1px, -1px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pointer-events-none { animation: none !important; }
        }
      `}</style>
    </>
  );
}
