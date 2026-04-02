/**
 * SpotlightEffect — Mouse-following radial gradient spotlight
 * Aceternity-inspired. Follows cursor with eased tracking.
 */
import React, { useRef, useEffect, useState } from 'react';

export default function SpotlightEffect({
  className = '',
  size = 600,
  color = 'rgba(179, 58, 58, 0.07)',
  children,
}) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      targetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.08;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.08;
      setPos({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };

    el.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-700"
        style={{
          opacity: pos.x || pos.y ? 1 : 0,
          background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
