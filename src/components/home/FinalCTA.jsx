/* ─────────────────────────────────────────────────────────────────
   FOLD 4b — CONVERGENCE (FinalCTA)

   Everything the page has argued lands on one button: the tally of
   proof you scrolled past drains into the /start verdict — the only
   large red object on the page. The four choices render as the door
   materials in miniature. Static end-state: the verdict rests full red.
   ───────────────────────────────────────────────────────────────── */
import React, { useLayoutEffect, useRef } from 'react';
import { Link } from '@/components/c4/SiteLink';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { revealHeading, useStaticMode } from './homeMotion';
import { BODY, ARM } from '@/components/logo-design/DoorFace';
import lensCorner from './assets/doors/lens-corner-360.webp';

const choices = [
  { key: 'web', label: 'Build a website', to: '/start?service=web_design' },
  // "Put AI to work" (to /c4i) went to C4Site with C4i on 9 Oct 2026.
  // Lens was "Brand & visual" until 9 Oct 2026, when logos and brand
  // identity got their own arm, Logo Design.
  { key: 'lens', label: 'Photography & video', to: '/Lens' },
  // "Train your team" came out with C4Site on 8 Oct 2026 (D2).
  { key: 'seo', label: 'Get found on Google', to: '/seo-and-copywriting' },
  { key: 'logo', label: 'Design a logo', to: '/logo-design' },
];

const points = (list) => list.map((p) => p.join(',')).join(' ');

/* The four doors in miniature, redrawn with the faces on 9 Oct 2026: three
   client home pages stacked under the ink band, the Lens photograph, the
   search with its result at 1 running off the edge, and our own 4 cropped
   off the top and right. Decorative; the label beside each says it all. */
function Chip({ kind }) {
  if (kind === 'lens') {
    return (
      <span className="hm-chip hm-chip--lens" aria-hidden="true">
        <img src={lensCorner} alt="" width={360} height={398} loading="lazy" decoding="async" />
      </span>
    );
  }
  if (kind === 'logo') {
    return (
      <span className="hm-chip hm-chip--logo" aria-hidden="true">
        <svg viewBox="280 120 330 440" preserveAspectRatio="xMidYMid slice" focusable="false">
          <polygon points={points(BODY)} fill="#414243" />
          <polygon points={points(ARM)} fill="#6c6d6d" />
        </svg>
      </span>
    );
  }
  return <span className={`hm-chip hm-chip--${kind}`} aria-hidden="true" />;
}

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
                to={createPageUrl('Contact')}
                className="hm-textlink group"
              >
                Or just send a message
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
                    <Chip kind={c.key} />
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
