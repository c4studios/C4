/**
 * BackgroundBeams — Animated SVG light beams
 * Creates cinematic light streaks that drift slowly behind content.
 */
import React, { useMemo } from 'react';

export default function BackgroundBeams({ className = '' }) {
  const beams = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x1: 10 + i * 12,
      x2: 20 + i * 10 + (i % 2 ? 15 : -5),
      delay: i * 0.8,
      duration: 6 + i * 0.5,
      opacity: 0.03 + (i % 3) * 0.015,
      width: 0.5 + (i % 2) * 0.3,
    }));
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(179, 58, 58, 0)" />
            <stop offset="30%" stopColor="rgba(179, 58, 58, 1)" />
            <stop offset="70%" stopColor="rgba(236, 231, 222, 0.5)" />
            <stop offset="100%" stopColor="rgba(236, 231, 222, 0)" />
          </linearGradient>
        </defs>
        {beams.map((beam) => (
          <line
            key={beam.id}
            x1={beam.x1}
            y1="-10"
            x2={beam.x2}
            y2="110"
            stroke="url(#beam-grad)"
            strokeWidth={beam.width}
            opacity={beam.opacity}
          >
            <animate
              attributeName="x1"
              values={`${beam.x1};${beam.x1 + 8};${beam.x1}`}
              dur={`${beam.duration}s`}
              begin={`${beam.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values={`${beam.x2};${beam.x2 - 5};${beam.x2}`}
              dur={`${beam.duration}s`}
              begin={`${beam.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values={`${beam.opacity};${beam.opacity * 2};${beam.opacity}`}
              dur={`${beam.duration}s`}
              begin={`${beam.delay}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>
    </div>
  );
}
