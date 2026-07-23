/**
 * ContainerScroll — port of the client-supplied Aceternity scroll-tilt
 * card (21st.dev), JSX + plain CSS classes (styles in web-arm.css).
 *
 * A tall (~60rem mobile / ~80rem desktop) section in which a large
 * rounded device card starts tilted back in 3D (rotateX 20deg under a
 * 1000px perspective) and straightens + settles as the user scrolls —
 * rotateX 20→0, scale 1.05→1 desktop / 0.7→0.9 mobile — while the
 * title block drifts up (translateY 0→-100), all driven by
 * framer-motion useScroll({ target }) / useTransform (v11 API).
 *
 * Bezel kept from the original: rounded-[30px], 4px #6C6C6C border,
 * #222 body, layered shadow, inner rounded-2xl surface.
 *
 * staticMode (prerender / prefers-reduced-motion): no scroll
 * transforms are applied — the DOM default IS the finished state, so
 * the card renders flat (rotateX 0, scale 1) with the title at rest
 * and the capture visible.
 *
 * `scrollRef` (optional): lets the page own the scroll-target ref so
 * sibling content (e.g. the capture pan inside the card) can derive
 * its own transforms from the same section's progress.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ContainerScroll({ titleComponent, children, staticMode = false, scrollRef }) {
  const internalRef = useRef(null);
  const containerRef = scrollRef || internalRef;
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scaleDimensions = isMobile ? [0.7, 0.9] : [1.05, 1];
  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="lv-cs" ref={containerRef}>
      <div className="lv-cs-inner">
        <motion.div
          className="lv-cs-header"
          style={staticMode ? undefined : { translateY: translate }}
        >
          {titleComponent}
        </motion.div>
        <motion.div
          className="lv-cs-card"
          style={staticMode ? undefined : { rotateX: rotate, scale }}
        >
          <div className="lv-cs-surface">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
