/**
 * HardwareUnit — the supplied machine, drawn in pure CSS. No product
 * photography, no logos, no trade dress. A premium compact slab that is
 * deliberately generic: gradient face, hinted ports, a vent circle, a
 * spec badge, a sheen that sweeps on tier switch and every 7 seconds.
 *
 * unitCount 2 shows a second slab behind the first (Enterprise pairing)
 * with a small mono link glyph between them.
 */
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface HardwareUnitProps {
  badge: string;
  unitCount: number;
  /** Front slab width in px on desktop; scales down inside its card. */
  widthPx?: number;
  /** Retriggers the sheen sweep; pass the tier id. */
  sweepKey: string;
  staticMode: boolean;
}

function SlabFace({ badge }: { badge?: string }) {
  return (
    <>
      <span className="pa-hw-vent" />
      <span className="pa-hw-slots">
        <span className="pa-hw-port" />
        <span className="pa-hw-port" />
        <span className="pa-hw-port" />
      </span>
      {badge ? (
        <span className="pa-hw-badge" data-pa-badge>
          {badge}
        </span>
      ) : null}
    </>
  );
}

export default function HardwareUnit({
  badge,
  unitCount,
  widthPx = 220,
  sweepKey,
  staticMode,
}: HardwareUnitProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const paired = unitCount >= 2;

  // Idle float, running for the life of the component.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || staticMode) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-pa-float]',
        { y: -4 },
        { y: 4, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 },
      );
    }, root);
    return () => ctx.revert();
  }, [staticMode]);

  // Sheen: one sweep on tier switch, then every 7s while active.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const ctx = gsap.context(() => {
      if (staticMode) {
        gsap.set('[data-pa-sheen]', { autoAlpha: 0 });
        return;
      }
      gsap.fromTo(
        '[data-pa-sheen]',
        { xPercent: -130, skewX: -18 },
        {
          xPercent: 330,
          skewX: -18,
          duration: 1.1,
          ease: 'power2.inOut',
          repeat: -1,
          repeatDelay: 5.9,
        },
      );
    }, root);
    return () => ctx.revert();
  }, [sweepKey, staticMode]);

  // Second unit slides in from 12px right with a fade when paired.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const ctx = gsap.context(() => {
      const targets = ['[data-pa-back]', '[data-pa-link]'];
      if (staticMode) {
        gsap.set('[data-pa-back]', { autoAlpha: paired ? 0.9 : 0 });
        gsap.set('[data-pa-link]', { autoAlpha: paired ? 1 : 0 });
        return;
      }
      if (paired) {
        gsap.fromTo(
          '[data-pa-back]',
          { autoAlpha: 0, x: 12 },
          { autoAlpha: 0.9, x: 0, duration: 0.35, ease: 'power2.out', delay: 0.1 },
        );
        gsap.fromTo(
          '[data-pa-link]',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3, delay: 0.25 },
        );
      } else {
        gsap.to(targets, { autoAlpha: 0, x: 8, duration: 0.2, ease: 'power2.in' });
      }
    }, root);
    return () => ctx.revert();
  }, [paired, staticMode]);

  // Badge crossfade on change.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || staticMode) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-pa-badge]',
        { autoAlpha: 0, y: 4 },
        { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power2.out' },
      );
    }, root);
    return () => ctx.revert();
  }, [badge, staticMode]);

  return (
    <div ref={rootRef} className="pa-hw-scene" aria-hidden="true">
      <div className="pa-hw-cluster" data-paired={paired} style={{ marginRight: paired ? '18%' : 0 }}>
        <div className="pa-hw-float" data-pa-float>
          {/* Back unit (Enterprise pairing), behind and offset right. */}
          <div
            className="pa-hw-slab pa-hw-back"
            data-pa-back
            data-flip-id="pa-unit-2"
            style={{ width: widthPx, opacity: 0 }}
          >
            <SlabFace />
          </div>
          <span className="pa-hw-link" data-pa-link style={{ opacity: 0 }}>
            ⇄
          </span>
          <div className="pa-hw-slab" data-flip-id="pa-unit-1" style={{ width: widthPx }}>
            <SlabFace badge={badge} />
            <span className="pa-hw-sheen" data-pa-sheen />
          </div>
        </div>
      </div>
      <span className="pa-hw-shadow" />
      <span className="pa-hw-desk" />
    </div>
  );
}
