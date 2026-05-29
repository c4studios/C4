import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];
const QUOTR_SLUG = 'fixm4qeq';

export default function Quote() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const prevTitle = document.title;
    const descTag = document.querySelector('meta[name="description"]');
    const prevDesc = descTag?.getAttribute('content');
    document.title = 'Lock In Your Price | C4 Studios';
    descTag?.setAttribute('content', 'Lock in your price with C4 Studios. Tell us about your project and get a ballpark estimate in under two minutes.');
    return () => {
      document.title = prevTitle;
      if (descTag && prevDesc) descTag.setAttribute('content', prevDesc);
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.origin !== 'https://quotr.us') return;
      if (e.data?.type === 'quotr-resize' && iframeRef.current) {
        iframeRef.current.style.height = e.data.height + 'px';
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[860px] mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <div className="flex items-center gap-3 mb-7">
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--c4-accent)' }} />
            <span className="text-[10.5px] uppercase tracking-[0.22em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
              Instant Estimate
            </span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3.4rem)] font-semibold tracking-[-0.035em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            Lock in your price now
          </h1>
          <p className="mt-5 text-[15px] leading-[1.65] max-w-[560px]" style={{ color: 'var(--c4-text-muted)' }}>
            Tell us about your project and we'll give you a ballpark figure in under two minutes. No calls, no commitment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="mt-12 md:mt-16"
        >
          <div
            className="p-2 md:p-3"
            style={{ backgroundColor: 'var(--c4-card-bg)', border: '1px solid var(--c4-border)', borderRadius: '14px' }}
          >
            <iframe
              ref={iframeRef}
              id="quotr-widget"
              title="C4 Studios quote calculator"
              src={`https://quotr.us/q/${QUOTR_SLUG}`}
              width="100%"
              style={{ border: 'none', borderRadius: '12px', minHeight: '650px', display: 'block' }}
              scrolling="no"
            />
          </div>
          <p className="mt-5 text-[12px] leading-[1.6]" style={{ color: 'var(--c4-text-faint)' }}>
            Estimates are indicative. Final scoping happens after a short discovery call.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
