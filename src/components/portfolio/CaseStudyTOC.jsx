import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import LineSidebar from '@/components/ui/LineSidebar';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

// Distance (px) from the top of the viewport that counts as "you are here" —
// clears the fixed 72px NavHeader with a little breathing room. Kept in sync
// with the `scroll-mt-28` (7rem) applied to each CaseStudySection.
const HEADER_OFFSET = 112;

/**
 * Sticky, proximity-reactive table of contents for the Case Study page.
 *
 * Rendered through a portal onto <body> so it escapes the page-transition
 * <motion.div> (whose transform would otherwise trap position:fixed). It is a
 * pure navigation aid: hidden on narrow viewports and only shown once there are
 * enough sections to be worth it, so it never interferes with the reading column.
 *
 * @param {{ sections: { id: string, label: string }[] }} props
 */
export default function CaseStudyTOC({ sections }) {
  const prefersReduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setMounted(true), []);

  // Scroll-spy: the active item is the last section whose top has scrolled
  // above the header line. rAF-throttled so scrolling stays cheap.
  useEffect(() => {
    if (sections.length === 0) return undefined;

    let ticking = false;
    const measure = () => {
      ticking = false;
      let next = 0;
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top - HEADER_OFFSET <= 1) next = i;
      }
      setActiveIndex(next);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections]);

  const handleItemClick = useCallback(
    index => {
      const el = document.getElementById(sections[index]?.id);
      if (!el) return;
      setActiveIndex(index); // optimistic; scroll-spy keeps it honest afterwards
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    },
    [sections, prefersReduced]
  );

  // A TOC for one or two sections is just noise. Client-only (needs document).
  if (!mounted || sections.length < 3) return null;

  return createPortal(
    <div className="fixed left-6 top-1/2 z-40 hidden w-fit -translate-y-1/2 select-none min-[1400px]:block">
      <LineSidebar
        items={sections.map(s => s.label)}
        activeIndex={activeIndex}
        onItemClick={handleItemClick}
        accentColor="var(--c4-accent)"
        textColor="var(--c4-text-subtle)"
        markerColor="var(--c4-border)"
        showIndex
        showMarker
        markerLength={34}
        markerGap={0}
        itemGap={15}
        fontSize={0.82}
        proximityRadius={90}
        falloff="smooth"
        // Reduced motion: kill the horizontal slide and tick-scale so the rail
        // is static, but keep the colour highlight of the current section.
        maxShift={prefersReduced ? 0 : 22}
        scaleTick={!prefersReduced}
        smoothing={prefersReduced ? 1 : 90}
      />
    </div>,
    document.body
  );
}
