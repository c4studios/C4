/*
 * The three shapes of the C4 mark as SVG groups, for drawing inside a
 * parent <svg>. Geometry and colours from ./geometry (the real logo).
 * Each shape carries data-part, so a figure can pick one out.
 */
import { MARK_SOURCE, FULL_UPRIGHT, STUDIOS, BOX, fit } from './geometry';

/* The 4 on its own: the red body and the green T. Placed with its top-left
   at (x, y), h tall. */
export function FourG({ x = 0, y = 0, h, pair, className }) {
  const f = fit(BOX.four, x, y, h);
  return (
    <g transform={f.transform} className={className}>
      <polygon data-part="body" points={MARK_SOURCE.fourBody} fill={pair.red} />
      <polygon data-part="arm" points={MARK_SOURCE.fourArm} fill={pair.green} />
    </g>
  );
}

/* The whole mark: the C, the red body and the green T. */
export function MarkG({ x = 0, y = 0, h, pair, cFill, className }) {
  const f = fit(BOX.mark, x, y, h);
  return (
    <g transform={f.transform} className={className}>
      <path data-part="c" d={MARK_SOURCE.cArc} fill={cFill || pair.c} />
      <polygon data-part="body" points={MARK_SOURCE.fourBody} fill={pair.red} />
      <polygon data-part="arm" points={MARK_SOURCE.fourArm} fill={pair.green} />
    </g>
  );
}

/* The upright lockup: the mark at the lockup's scale and the word Studios
   (C4Logo.jsx's FULL_UPRIGHT and the wordmark's upright paths). */
export function LockupG({ x = 0, y = 0, h, pair, cFill, word, className }) {
  const f = fit(BOX.lockup, x, y, h);
  return (
    <g transform={f.transform} className={className}>
      <path data-part="c" d={FULL_UPRIGHT.cArc} fill={cFill || pair.c} />
      <polygon data-part="body" points={FULL_UPRIGHT.fourBody} fill={pair.red} />
      <polygon data-part="arm" points={FULL_UPRIGHT.fourArm} fill={pair.green} />
      <g data-part="word" fill={word}>
        {STUDIOS.map((d) => <path key={d.slice(0, 24)} d={d} />)}
      </g>
    </g>
  );
}

/* Width of each shape at a given height, for laying figures out. */
export const widthAt = {
  four: (h) => (BOX.four.w / BOX.four.h) * h,
  mark: (h) => (BOX.mark.w / BOX.mark.h) * h,
  lockup: (h) => (BOX.lockup.w / BOX.lockup.h) * h,
};
