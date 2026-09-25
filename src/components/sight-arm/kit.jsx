/*
 * The C4Site chalkboard kit: the drawn chalk marks, the chalk-edge filter and
 * the force-dark hook, shared by /Foresight and the pages around it (the
 * sector pages, the free packs page, the enquiry form). Moved here unchanged
 * from Foresight.jsx on 21 Sep 2026 so every board page draws from one source.
 *
 * Marks render fully drawn by default. A page that wants the draw-in tweens
 * each [data-sg-draw] path's stroke-dashoffset itself (Foresight does, with
 * GSAP, under staticMode). A page that does nothing gets the finished marks.
 */
import { useEffect, useId } from 'react';
import { reassertStoredTheme } from '../c4/ThemeContext';
import './sight-arm.css';

/* Safari renders stroke-dashoffset inside a mask incorrectly on
   non-uniformly stretched paths (preserveAspectRatio="none"), so those
   marks revert to the shipped primary-path draw there — they keep the
   dry-tail layer, they just draw the old way. Everything else gets the
   full layered wipe. That confinement is unverified on real Safari
   (none exists on the build box): if the pre-merge Safari pass shows
   draw-in artifacts on uniformly-scaled marks too, widen the fallback
   to `IS_SAFARI` alone (`plain` in Stroke, below). Rest state is safe
   either way — masks rest fully painted. */
const IS_SAFARI =
  typeof navigator !== 'undefined' &&
  /safari/i.test(navigator.userAgent) &&
  !/chrome|chromium|crios|fxios|edg|android/i.test(navigator.userAgent);

/* ── The drawn chalk marks — layered dry-media strokes ────────────── */
/* Every mark is three passes on the same line of travel: a faint,
   broken "ghost" laid slightly off-register (the dry skips a real
   chalk stick leaves), the crisp primary, and a short dry tail of
   broken dashes past the end where the stick lifted. All three group
   under one SVG <mask> holding a fat round-cap copy of the same path;
   the draw-in tweens the MASK path's stroke-dashoffset, so the whole
   layered mark materialises under a single travelling wipe — pressed
   chalk, never a clean vector rule drawing over a static ghost. At
   rest the mask is fully painted, so the static and prerendered states
   are always the complete mark. No live SVG filters on moving paths. */

export function Stroke({ d, w = 2.4, ghostDash, tail, tailDash = '3 6', stretched = false }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const plain = IS_SAFARI && stretched;
  const layers = (
    <>
      <path
        className="sg-ghost"
        d={d}
        strokeWidth={w * 1.2}
        strokeDasharray={ghostDash}
        transform="translate(0.9 1.1)"
      />
      <path {...(plain ? { 'data-sg-draw': '' } : {})} d={d} strokeWidth={w} />
      {tail ? (
        <path className="sg-tail" d={tail} strokeWidth={w * 0.9} strokeDasharray={tailDash} />
      ) : null}
    </>
  );
  if (plain) return layers;
  const maskId = `sgm-${uid}`;
  return (
    <>
      {/* Region is a generous fixed user-space box (every mark viewBox
          sits well inside it), so fat wipe strokes never clip. */}
      <mask id={maskId} maskUnits="userSpaceOnUse" x="-100" y="-100" width="700" height="700">
        <path
          className="sg-wipe"
          data-sg-draw=""
          d={tail ? `${d} ${tail}` : d}
          strokeWidth={w * 3 + 3}
        />
      </mask>
      <g mask={`url(#${maskId})`}>{layers}</g>
    </>
  );
}

/* A settling puff of chalk dust. Rendered as plain elements beside the
   mark (not inside its stretched viewBox, so the dots stay round), kept
   invisible until the mark finishes drawing, then animated out once. */
export function PuffDots() {
  return (
    <span className="sg-puff" aria-hidden="true">
      <i className="sg-puff-dot" />
      <i className="sg-puff-dot" />
      <i className="sg-puff-dot" />
    </span>
  );
}

export function MarkUnderline() {
  return (
    <svg className="sg-mark" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
      <Stroke
        d="M3 8.5 C 36 4, 80 10, 119 6.5 C 149 4.2, 179 6.8, 197 5.4"
        w={5}
        ghostDash="46 8 64 7 48"
        tail="M199 5.2 C 204 5, 209.5 5.4, 216 4.9"
        tailDash="6 7"
        stretched
      />
    </svg>
  );
}

export function MarkTick() {
  return (
    <svg className="sg-mark" viewBox="0 0 22 22" aria-hidden="true">
      <Stroke
        d="M3.5 12.5 C 5.5 14.2, 7.2 16.2, 8.8 18.2 C 11.5 13.4, 14.8 8.6, 19 4.5"
        w={2.5}
        ghostDash="8 2 26"
        tail="M19.9 3.5 C 20.8 2.6, 21.7 1.8, 22.8 1"
        tailDash="1.8 2.4"
      />
    </svg>
  );
}

/* A cross, for what stays out of the tool and for a line the red pen rejects.
   Added 24 Sep 2026 so a list of things to keep out is not ticked. */
export function MarkCross() {
  return (
    <svg className="sg-mark" viewBox="0 0 22 22" aria-hidden="true">
      <Stroke d="M4.6 4.9 C 8.8 9.2, 13 13.4, 17.4 17.9" w={2.4} ghostDash="9 2 14" />
      <Stroke
        d="M17.3 4.3 C 13 8.8, 8.9 13.2, 4.5 17.5"
        w={2.4}
        ghostDash="7 2 16"
        tail="M3.8 18.3 C 3.2 18.9, 2.6 19.5, 2 20.1"
        tailDash="1.6 2.2"
      />
    </svg>
  );
}

export function MarkArrow() {
  /* Too small for a legible tail at its rendered 26×11px. */
  return (
    <svg className="sg-mark" viewBox="0 0 30 12" aria-hidden="true">
      <Stroke d="M1.5 6.4 C 9 5.5, 18 6.7, 27 5.9" w={2.2} ghostDash="8 2 16 2 6" />
      <Stroke d="M21 1.6 C 23.5 3.3, 25.6 4.9, 28.2 6 C 25.4 7.5, 23 9.2, 21.2 10.8" w={2.2} />
    </svg>
  );
}

/* Redrawn 24 Sep 2026 to run edge to edge of its box. The old path only
   spanned x 16 to 107 of 120, so every ring sat inside its own svg and cut
   through the first and last letters of the word it circled ("Five" on the
   hub, "We break it" on the schools page). Now the box is the ring. */
export function MarkRing() {
  return (
    <svg className="sg-mark" viewBox="0 0 120 46" preserveAspectRatio="none" aria-hidden="true">
      <Stroke
        d="M6 24 C 4.5 11.5, 33 3.6, 61 3.9 C 92 4.3, 116 11.2, 115.4 23.2 C 114.8 35.6, 88 42.6, 58 42.2 C 30 41.8, 5.2 35.2, 5.2 22.6 C 5.2 16.6, 11.2 11.6, 19 8.7"
        w={2.6}
        ghostDash="38 6 58 6 44 5 34"
        tail="M20.8 8.1 C 25.2 6.8, 30.2 5.9, 35.4 5.4"
        tailDash="5 5.5"
        stretched
      />
    </svg>
  );
}

export function MarkLoop() {
  return (
    <svg className="sg-mark" viewBox="0 0 46 46" aria-hidden="true">
      <Stroke
        d="M23.5 4.6 C 12 4.2, 4.6 12, 4.6 23 C 4.6 34.4, 12.5 41.8, 23.5 41.4 C 35 41, 41.4 33.4, 41.4 22.6 C 41.4 12.2, 34 5, 25.6 5.2 C 21.2 5.3, 17.2 7, 14.6 9.6"
        w={2.2}
        ghostDash="22 4 40 5 28"
        tail="M13.5 10.7 C 12.3 12.1, 11.3 13.6, 10.5 15.3"
        tailDash="2.2 3"
      />
    </svg>
  );
}

/* The formats divider, truth-fixed: a crisp 1px CSS rule is a
   materially false line on a chalkboard, so the seam between the two
   formats is now a drawn chalk vertical — ghost pass and all — that
   draws in with its section (same non-scaling-stroke + dashoffset
   pattern as the shipped governance frame). */
export function VRule() {
  return (
    <svg className="sg-vrule" viewBox="0 0 12 100" preserveAspectRatio="none" aria-hidden="true">
      <path
        className="sg-ghost"
        d="M6.8 1.5 C 5.6 22, 7 44, 5.8 66 C 5.2 80, 6.4 92, 6 98.5"
        strokeDasharray="10 4 16 5 12"
        vectorEffect="non-scaling-stroke"
        transform="translate(0.7 0.6)"
      />
      <path
        data-sg-draw=""
        d="M6 1.5 C 5 22, 6.6 44, 5.4 66 C 4.8 80, 6.2 92, 5.8 98.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* The chalk-edge filter for a board page's h1. Render once near the top.
   Static feTurbulence displacement, never animated, applied to hero h1 text
   only (no live filters on moving things). */
export function ChalkDefs() {
  return (
    <svg className="sg-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <filter
        id="sg-chalk-edge"
        x="-6%"
        y="-30%"
        width="112%"
        height="160%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.86 0.62"
          numOctaves="1"
          seed="7"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="1.6"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

/* ── Force dark-mode while mounted (Lens pattern) ─────────────────── */

export function useForceDark() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      root.classList.add('dark-mode', 'sg-on-board');
      root.classList.remove('light-mode', 'vivid');
    };
    apply();
    /* On a direct page load ThemeProvider's mount effect runs after this
       one and re-applies the stored theme class AND its inline --c4-*
       tokens (inline styles outrank the .dark-mode class block). One
       deferred re-apply wins the class ordering, and the .sg-on-board
       block in sight-arm.css pins the chrome tokens with !important so
       the nav and footer read dark whatever theme the visitor stored. */
    const id = window.setTimeout(apply, 0);
    return () => {
      window.clearTimeout(id);
      reassertStoredTheme();
    };
  }, []);
}

/* ── Page ─────────────────────────────────────────────────────────── */

/* The frame that never gets rubbed out: two off-register chalk rectangles
   around a block of rules. Place it first inside a .sg-rules box.
   Rebuilt 24 Sep 2026: it was ONE svg stretched over the whole box, so the
   inner rectangle's inset grew with the box's height (about 70px on a tall
   phone layout) while the padding stayed at 28px, and the rules spilled out
   of the frame on five pages. Now each rectangle is its own svg, drawn edge
   to edge, pinned at a fixed pixel inset in CSS (.sg-rules-frame--outer /
   --inner), and the box's padding always clears the inner one. */
const FRAME_OUTER = 'M0.9 2.2 C 0.9 1.2 1.6 0.6 2.8 0.6 L 97.3 1.0 C 98.7 1.0 99.3 1.7 99.2 2.9 L 98.9 97.3 C 98.9 98.7 98.2 99.3 96.9 99.3 L 2.7 99.0 C 1.3 99.0 0.7 98.3 0.8 97.1 Z';
const FRAME_INNER = 'M1.4 1.9 C 1.4 0.9 2.1 0.5 3.3 0.6 L 96.8 0.9 C 98.3 1.0 99.0 1.6 98.9 2.8 L 99.2 97.6 C 99.2 98.9 98.4 99.4 97.1 99.3 L 2.4 98.7 C 1.0 98.6 0.5 97.9 0.6 96.7 Z';
export function RulesFrame({ late = false }) {
  const lateAttr = late ? { 'data-sg-late': '' } : {};
  return (
    <>
      <svg className="sg-rules-frame sg-rules-frame--outer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" {...lateAttr}>
        <path data-sg-draw="" vectorEffect="non-scaling-stroke" d={FRAME_OUTER} />
      </svg>
      <svg className="sg-rules-frame sg-rules-frame--inner" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" {...lateAttr}>
        <path data-sg-draw="" vectorEffect="non-scaling-stroke" d={FRAME_INNER} />
      </svg>
    </>
  );
}

/* A heading with one phrase underlined in chalk. `mark` must appear in `text`. */
export function ChalkHeading({ as: Tag = 'h1', text, mark, className = '' }) {
  const at = mark ? text.indexOf(mark) : -1;
  if (at < 0) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag className={className}>
      {text.slice(0, at)}
      <span className="sg-underlined">
        {mark}
        <MarkUnderline />
      </span>
      {text.slice(at + mark.length)}
    </Tag>
  );
}
