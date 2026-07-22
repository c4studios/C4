/* ─────────────────────────────────────────────────────────────────
   FOLD 4b — CONVERGENCE (FinalCTA)

   Everything the page has argued lands on one button: the tally of
   proof you scrolled past drains into the /start verdict — the only
   large red object on the page. The four choices render as the door
   materials in miniature; every label and destination is verbatim
   from the baseline. Static end-state: the verdict rests full red.
   ───────────────────────────────────────────────────────────────── */
import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { revealHeading, useStaticMode } from './homeMotion';

const choices = [
  { key: 'web', label: 'Build a website', to: '/start?service=web_design', chip: 'hm-chip--web' },
  { key: 'c4i', label: 'Put AI to work', to: '/c4i', chip: 'hm-chip--c4i' },
  { key: 'lens', label: 'Brand & visual', to: '/Lens', chip: 'hm-chip--lens' },
  { key: 'sight', label: 'Train your team', to: '/ai-training-enquiry', chip: 'hm-chip--sight' },
];

export default function FinalCTA() {
  const h2Ref = useRef(null);
  const staticMode = useStaticMode();

  useLayoutEffect(() => {
    if (staticMode) return undefined;
    const reveal = revealHeading(h2Ref.current);
    return () => {
      reveal?.tween?.scrollTrigger?.kill();
      reveal?.tween?.kill();
    };
  }, [staticMode]);

  return (
    <section id="hm-final" className="pb-24 pt-8 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-16 h-px md:mb-24" style={{ backgroundColor: 'var(--c4-border)' }} />

        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end md:gap-14">
          {/* Left — headline + the verdict */}
          <div className="max-w-[560px]">
            <p className="hm-label mb-3">Pick a starting point</p>
            <h2 ref={h2Ref} className="hm-h2 text-[clamp(1.7rem,3.2vw,2.5rem)]">
              Tell us what you’re building. We’ll come back with a clear next step.
            </h2>
            <p className="hm-sub mt-4 text-[14px]">
              Each link takes you to the right starting point. Founder-led reply, usually within a business day.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link id="hm-start-verdict" to={createPageUrl('StartProject')} className="hm-verdict group">
                Start a project
                <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to={createPageUrl('StartProject')}
                className="hm-textlink group"
              >
                Or send a general brief
                <ArrowRight size={12} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right — the four doors in miniature */}
          <ul role="list" className="flex flex-col" style={{ borderTop: '1px solid var(--c4-border)' }}>
            {choices.map((c) => (
              <li key={c.key} style={{ borderBottom: '1px solid var(--c4-border)' }}>
                <Link to={c.to} className="hm-choice group">
                  <span className="flex min-w-0 items-center gap-4">
                    <span className={`hm-chip ${c.chip}`} aria-hidden="true" />
                    <span className="truncate text-[1.05rem] font-semibold tracking-[-0.015em] md:text-[1.15rem]" style={{ color: 'var(--c4-text)' }}>
                      {c.label}
                    </span>
                  </span>
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    className="opacity-30 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    style={{ color: 'var(--c4-text)' }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
