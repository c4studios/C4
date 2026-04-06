/**
 * MagneticCursor — Physics-based custom cursor with spring dynamics
 *
 * - Dot tracks instantly
 * - Ring follows with spring physics (not linear lerp)
 * - Scales + morphs on hover states
 * - Blends with page via mix-blend-difference
 * - Auto-hides on touch devices
 */
import React, { useRef, useEffect, useState } from 'react';

export default function MagneticCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100, vx: 0, vy: 0 });
  const [visible, setVisible] = useState(false);
  const [hoverState, setHoverState] = useState('default'); // 'default' | 'link' | 'accent'
  const isTouch = useRef(false);

  useEffect(() => {
    if ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) {
      isTouch.current = true;
      return;
    }

    // Hide default cursor only within the lens page
    const lensPage = document.querySelector('.lens-page');
    if (lensPage) {
      lensPage.style.cursor = 'none';
      const links = lensPage.querySelectorAll('a, button, [data-cursor-hover]');
      links.forEach(el => { el.style.cursor = 'none'; });
    }

    const observer = new MutationObserver(() => {
      const lp = document.querySelector('.lens-page');
      if (lp) {
        lp.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
          el.style.cursor = 'none';
        });
      }
    });
    if (lensPage) observer.observe(lensPage, { childList: true, subtree: true });

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e) => {
      const link = e.target.closest('a, button, [data-cursor-hover]');
      const accent = e.target.closest('[data-cursor-accent]');
      if (accent) setHoverState('accent');
      else if (link) setHoverState('link');
      else setHoverState('default');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver, { passive: true });

    // Spring physics animation
    let raf;
    const stiffness = 0.12;
    const damping = 0.78;

    const animate = () => {
      const dot = dotRef.current;
      const ringEl = ringRef.current;
      if (!dot || !ringEl) { raf = requestAnimationFrame(animate); return; }

      // Dot — instant
      dot.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;

      // Ring — spring physics
      const dx = mouse.current.x - ring.current.x;
      const dy = mouse.current.y - ring.current.y;
      ring.current.vx += dx * stiffness;
      ring.current.vy += dy * stiffness;
      ring.current.vx *= damping;
      ring.current.vy *= damping;
      ring.current.x += ring.current.vx;
      ring.current.y += ring.current.vy;

      // Calculate velocity for ring stretch
      const vel = Math.sqrt(ring.current.vx ** 2 + ring.current.vy ** 2);
      const stretch = Math.min(vel * 0.015, 0.3);
      const angle = Math.atan2(ring.current.vy, ring.current.vx);

      let scale = 1;
      let borderColor = 'rgba(236, 231, 222, 0.35)';
      let bgColor = 'transparent';
      let size = 40;

      if (hoverState === 'link') {
        scale = 1.8;
        borderColor = 'rgba(179, 58, 58, 0.5)';
        bgColor = 'rgba(179, 58, 58, 0.06)';
      } else if (hoverState === 'accent') {
        scale = 2.2;
        borderColor = 'rgba(236, 231, 222, 0.5)';
        bgColor = 'rgba(236, 231, 222, 0.04)';
      }

      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) rotate(${angle}rad) scale(${(scale + stretch) }, ${scale - stretch * 0.5}) `;
      ringEl.style.borderColor = borderColor;
      ringEl.style.backgroundColor = bgColor;

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      observer.disconnect();
      const lp = document.querySelector('.lens-page');
      if (lp) {
        lp.style.cursor = '';
        lp.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
          el.style.cursor = '';
        });
      }
    };
  }, [visible, hoverState]);

  if (isTouch.current) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          borderRadius: '50%',
          backgroundColor: '#ECE7DE',
          mixBlendMode: 'difference',
          willChange: 'transform',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          width: 40,
          height: 40,
          marginLeft: -20,
          marginTop: -20,
          borderRadius: '50%',
          border: '1px solid rgba(236, 231, 222, 0.35)',
          backgroundColor: 'transparent',
          mixBlendMode: 'difference',
          willChange: 'transform',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s, border-color 0.3s, background-color 0.3s, width 0.3s, height 0.3s',
        }}
      />
    </>
  );
}
