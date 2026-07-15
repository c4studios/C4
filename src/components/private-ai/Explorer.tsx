/**
 * Explorer — systems and pricing, the centrepiece of /private-ai.
 *
 * A proper radiogroup of four tiers (arrow keys, roving tabindex, ink
 * focus rings). The ink underline slides between segments via GSAP Flip.
 * Selected tier syncs to the URL as ?tier=… (replaceState, read on load).
 * Each switch: outgoing console fades 0.15s, hardware morphs via Flip,
 * badge crossfades, price digits roll, includes restagger. Under 0.5s,
 * transform and opacity only. Reduced motion: crossfade only.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { recordPrivateAiEvent } from '@/api/submissions';
import { tiers, tierScripts, tierConsoleSummaries, isTierId, DEFAULT_TIER } from './tiers';
import type { TierId } from './tiers';
import ConsoleWindow from './ConsoleWindow';
import HardwareUnit from './HardwareUnit';

gsap.registerPlugin(Flip);

const UNIT_WIDTH: Record<TierId, number> = {
  lite: 180,
  solo: 190,
  foundations: 205,
  practice: 220,
  enterprise: 185,
};

const MAILTO = 'mailto:caleb@c4studios.com.au?subject=Private%20AI%2C%2015%20minutes';

const FINE_PRINT =
  'Pricing in AUD, quoted to fit each practice. Upfront covers the hardware (yours to keep), installation, configuration, team training and a 30-day tuning period. Monthly care covers monitoring, updates, model upgrades and support. Cancel anytime: your system keeps working, you simply stop receiving updates and support.';

function initialTier(): TierId {
  if (typeof window === 'undefined') return DEFAULT_TIER;
  const param = new URLSearchParams(window.location.search).get('tier');
  return isTierId(param) ? param : DEFAULT_TIER;
}

function syncUrl(id: TierId) {
  const url = new URL(window.location.href);
  url.searchParams.set('tier', id);
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
}

function PriceChars({ value }: { value: string }) {
  return (
    <>
      {value.split('').map((ch, i) => (
        <span className="pa-ch" key={`${i}-${ch}`}>
          {ch}
        </span>
      ))}
    </>
  );
}

export default function Explorer({ staticMode }: { staticMode: boolean }) {
  const [tierId, setTierId] = useState<TierId>(initialTier);
  const tier = tiers.find((t) => t.id === tierId) ?? tiers[0];

  const rootRef = useRef<HTMLElement>(null);
  const segRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const indicatorStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const firstRender = useRef(true);
  const switching = useRef(false);

  /* Position the underline indicator on the selected segment. */
  const placeIndicator = () => {
    const seg = segRef.current;
    const indicator = indicatorRef.current;
    if (!seg || !indicator) return;
    const btn = seg.querySelector<HTMLElement>(`[data-tier="${tierId}"]`);
    if (!btn) return;
    indicator.style.left = `${btn.offsetLeft}px`;
    indicator.style.width = `${btn.offsetWidth}px`;
  };

  useLayoutEffect(() => {
    placeIndicator();
    const onResize = () => placeIndicator();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* One pa_scroll_pricing event when the explorer is half in view. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent)) return undefined;
    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (fired || !entry) return;
        const halfViewport = entry.intersectionRect.height > window.innerHeight * 0.5;
        if (entry.intersectionRatio >= 0.5 || halfViewport) {
          fired = true;
          recordPrivateAiEvent('pa_scroll_pricing');
          io.disconnect();
        }
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const select = (id: TierId) => {
    if (id === tierId || switching.current) return;
    recordPrivateAiEvent('pa_tier_select', { tier: id });
    syncUrl(id);

    if (staticMode) {
      setTierId(id);
      return;
    }

    // Capture Flip states before the DOM changes.
    flipStateRef.current = Flip.getState('[data-flip-id]');
    indicatorStateRef.current = indicatorRef.current ? Flip.getState(indicatorRef.current) : null;

    switching.current = true;
    gsap.to(fadeRef.current, {
      opacity: 0,
      duration: 0.15,
      ease: 'power1.in',
      onComplete: () => {
        switching.current = false;
        setTierId(id);
      },
    });
  };

  /* Entrance animations after a tier switch. */
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    placeIndicator();
    if (staticMode) return;

    const root = rootRef.current;
    if (!root) return;

    // Flip end states must be the clean natural layout: an interrupted flip
    // leaves a stale transform behind, and Flip.getState would bake it into
    // every later capture. Kill in-flight flips and clear before animating.
    if (indicatorStateRef.current && indicatorRef.current) {
      gsap.killTweensOf(indicatorRef.current);
      gsap.set(indicatorRef.current, { clearProps: 'transform' });
      Flip.from(indicatorStateRef.current, {
        targets: indicatorRef.current,
        duration: 0.4,
        ease: 'power3.inOut',
        scale: true,
      });
      indicatorStateRef.current = null;
    }
    if (flipStateRef.current) {
      const units = root.querySelectorAll('[data-flip-id]');
      gsap.killTweensOf(units);
      gsap.set(units, { clearProps: 'transform' });
      Flip.from(flipStateRef.current, {
        targets: units,
        duration: 0.4,
        ease: 'power3.inOut',
        scale: true,
      });
      flipStateRef.current = null;
    }

    const ctx = gsap.context(() => {
      gsap.to(fadeRef.current, { opacity: 1, duration: 0.2, ease: 'power1.out' });
      gsap.fromTo(
        '[data-pa-price] .pa-ch',
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power2.out', stagger: 0.03 },
      );
      gsap.fromTo(
        '[data-pa-includes] li',
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.05 },
      );
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierId, staticMode]);

  const order = tiers.map((t) => t.id);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = order.indexOf(tierId);
    let next: TierId | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = order[(idx + 1) % order.length];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = order[(idx - 1 + order.length) % order.length];
    else if (e.key === 'Home') next = order[0];
    else if (e.key === 'End') next = order[order.length - 1];
    if (!next) return;
    e.preventDefault();
    select(next);
    segRef.current?.querySelector<HTMLElement>(`[data-tier="${next}"]`)?.focus();
  };

  return (
    <section ref={rootRef} id="pricing" className="pa-section" aria-labelledby="pa-pricing-h2">
      <div className="pa-container">
        <div className="pa-label">Systems and pricing</div>
        <h2 id="pa-pricing-h2" className="pa-h2" style={{ marginTop: 34 }}>
          Choose the shape of the system.
        </h2>

        {/* Tier selector */}
        <div
          ref={segRef}
          className="pa-seg"
          role="radiogroup"
          aria-label="System tier"
          onKeyDown={onKeyDown}
        >
          {tiers.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={t.id === tierId}
              tabIndex={t.id === tierId ? 0 : -1}
              data-tier={t.id}
              className="pa-seg-btn"
              onClick={() => select(t.id)}
            >
              {t.name}
            </button>
          ))}
          <div ref={indicatorRef} className="pa-seg-indicator" aria-hidden="true" />
        </div>

        {/* Stage */}
        <div ref={fadeRef}>
          <div className="pa-stage">
            <div className="pa-stage-panel pa-stage-hw">
              <div className="pa-stage-panel-head">Supplied hardware</div>
              <HardwareUnit
                badge={tier.unitBadge}
                unitCount={tier.unitCount}
                widthPx={UNIT_WIDTH[tier.id]}
                sweepKey={tier.id}
                staticMode={staticMode}
              />
              <p className="pa-hwline">{tier.hardwareLine}</p>
            </div>
            <div className="pa-stage-panel pa-stage-console">
              <div className="pa-stage-panel-head">The software, live</div>
              <ConsoleWindow
                key={tier.id}
                exchanges={[tierScripts[tier.id]]}
                title="C4 CONSOLE"
                srSummary={tierConsoleSummaries[tier.id]}
                staticMode={staticMode}
              />
            </div>
          </div>

          {/* Details row */}
          <div className="pa-details" aria-live="polite">
            <div>
              <div className="pa-price" data-pa-price>
                <PriceChars value={tier.upfront} />
              </div>
              <div className="pa-price-sub">Upfront, installed</div>
              <div className="pa-price-monthly" data-pa-price style={{ marginTop: 20 }}>
                <PriceChars value={tier.monthly} />
              </div>
              <div className="pa-price-sub">Monthly care</div>
            </div>
            <div>
              <p className="pa-suited">{tier.suitedTo}</p>
              <p className="pa-golive">{tier.goLive}</p>
            </div>
            <div>
              <ul className="pa-list" data-pa-includes>
                {tier.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="pa-fineprint">{FINE_PRINT}</p>

        <div style={{ marginTop: 36 }}>
          <a
            className="pa-btn"
            href={MAILTO}
            onClick={() => recordPrivateAiEvent('pa_cta_click', { location: 'explorer' })}
          >
            Talk through the right fit
          </a>
        </div>
      </div>
    </section>
  );
}
