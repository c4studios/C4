/**
 * GradientText — port of the client-supplied 21st.dev component.
 *
 * Mechanism (kept faithful): a relative inline-flex container with a
 * LIGHT background and near-black text; an absolutely-inset overlay in
 * mix-blend-lighten holds four huge (30vw) colour blobs, each blurred
 * 1rem, each mix-blend-overlay, each running two infinite keyframe
 * sets — `lv-gradient-border` (border-radius morph, 6s) and its own
 * `lv-gradient-1..4` position drift (12s, alternate). Over white the
 * lighten blend leaves white alone; over the dark glyphs the colours
 * show through — so the TEXT carries a living gradient while the box
 * stays invisible on the white page.
 *
 * Keyframes + the exact --color-1..5 palette live in web-arm.css
 * (scoped under .lv-root). Under prefers-reduced-motion the blobs
 * stop (animation: none) and rest as a static tint.
 */
import React from 'react';

export default function GradientText({ children, className = '' }) {
  return (
    <span className={`lv-gt${className ? ` ${className}` : ''}`}>
      {children}
      <span className="lv-gt-overlay" aria-hidden="true">
        <span className="lv-gt-blob lv-gt-blob--1" />
        <span className="lv-gt-blob lv-gt-blob--2" />
        <span className="lv-gt-blob lv-gt-blob--3" />
        <span className="lv-gt-blob lv-gt-blob--4" />
      </span>
    </span>
  );
}
