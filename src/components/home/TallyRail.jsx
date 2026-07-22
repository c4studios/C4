/* ─────────────────────────────────────────────────────────────────
   THE TALLY — the relentless-but-elegant path to /start, embodied.

   A thin fixed rail on the right edge (clear of the top-left nav
   keep-out) accrues one red tick for every piece of evidence the
   visitor actually scrolls past ([data-proof] artifacts only). At
   the final fold the ticks drain toward the verdict button while it
   settles to full scale. Scroll-driven only — dead still at rest.

   Never mounts under staticMode (the verdict rests full red without
   it) and never on small screens (CSS hides it below 1024px too).
   ───────────────────────────────────────────────────────────────── */
import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useStaticMode } from './homeMotion';

const MAX_TICKS = 22;

export default function TallyRail() {
  const railRef = useRef(null);
  const staticMode = useStaticMode();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (staticMode) return undefined;
    if (typeof window === 'undefined') return undefined;
    if (!window.matchMedia('(min-width: 1024px)').matches) return undefined;

    const proofs = Array.from(document.querySelectorAll('[data-proof]'));
    const triggers = proofs.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => setCount((c) => Math.min(c + 1, MAX_TICKS)),
      }),
    );

    /* Convergence: the tally drains into the verdict as it arrives. */
    let tl;
    const finalSection = document.getElementById('hm-final');
    const verdict = document.getElementById('hm-start-verdict');
    if (finalSection && railRef.current) {
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: finalSection,
          start: 'top 78%',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });
      tl.to(railRef.current, { yPercent: 48, autoAlpha: 0, ease: 'none' }, 0);
      if (verdict) {
        tl.from(verdict, { scale: 0.96, transformOrigin: '50% 50%', ease: 'none' }, 0);
      }
    }

    return () => {
      triggers.forEach((t) => t.kill());
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  }, [staticMode]);

  if (staticMode) return null;

  return (
    <div ref={railRef} className="hm-tally" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="hm-tick" />
      ))}
    </div>
  );
}
