import React from 'react';

/**
 * C4Mark — static, full-colour C4 monogram (ghost C + red 4 + green T stem).
 *
 * Geometry is lifted verbatim from the canonical animated logo
 * (`components/c4/C4Logo.jsx`, MARK_SOURCE + the "colour" palette) so the
 * welcome landing renders the exact mark printed on the physical card with
 * zero new assets and no theme/hover dependency. Paints instantly — this is
 * the first thing a prospect sees after a scan, so it must never wait on JS.
 */

const MARK_VIEWBOX = '265 55 395 420';

/* Colour palette — matches the printed card (deep red, forest green, ghost C). */
const COLOUR = {
  fourBody: '#A30000',
  fourArm: '#22632F',
  cArc: '#F3F2F3',
};

const MARK = {
  fourBody:
    '554.78 94.43 554.76 300.21 485.93 300.21 485.93 177.58 395.65 308.72 485.93 308.72 453.55 357.3 304.78 357.3 304.78 323.95 470.27 94.43 554.78 94.43',
  fourArm:
    '639.36 308.72 606.98 357.3 554.78 357.3 554.78 469.58 503.71 469.58 503.71 357.3 472.55 357.3 504.93 308.72 639.36 308.72',
  cArc: 'M393.33,381.58l46.14.22c-37.51,42.67-88.07,71.58-143.72,82.18-89.37,18.53-180.59-21.95-227.2-100.84-38.21-64.03-30.59-145.6,18.81-201.36,33.03-37.88,79.33-61.47,129.25-65.83,54.95-7.69,110.91-3.19,163.94,13.2l-37.35,52.04c-31.06-6.51-62.95-8.01-94.47-4.41-43.91,2.38-84.08,25.62-108.21,62.59-14,27.78-16.89,59.9-8.08,89.75,13.18,47.07,49.8,83.83,96.63,97.01,55.92,11.27,114.01,2.59,164.26-24.56Z',
};

export default function C4Mark({ size = 96, className = '', title = 'C4 Studios' }) {
  const aspect = 395 / 420;
  const w = Math.round(size * aspect);
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      width={w}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label={title}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <title>{title}</title>
      <defs>
        <filter id="c4mark-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#000" floodOpacity="0.18" />
        </filter>
      </defs>
      <path d={MARK.cArc} fill={COLOUR.cArc} filter="url(#c4mark-shadow)" />
      <polygon points={MARK.fourBody} fill={COLOUR.fourBody} />
      <polygon points={MARK.fourArm} fill={COLOUR.fourArm} />
    </svg>
  );
}
