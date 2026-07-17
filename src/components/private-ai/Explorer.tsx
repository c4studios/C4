/**
 * Explorer — systems and pricing, the centrepiece of /private-ai.
 *
 * Two axes over the tier radiogroup:
 *   supply — "Your hardware" (BYO install) or "We supply it" (hardware
 *   choice per tier, Windows first). The switch is the page's hero
 *   control: an ink pill slides between the two worlds, the slab morphs
 *   solid ⇄ dashed via GSAP Flip, price digits roll, includes restagger.
 *   payment — own outright / managed monthly (supplied only; managed
 *   needs C4-owned hardware, so the track hides under BYO).
 *
 * Selected tier and supply sync to the URL (?tier=…&supply=…). Each
 * switch: outgoing content fades 0.15s, hardware morphs via Flip, price
 * digits roll, includes restagger. Under 0.5s, transform and opacity
 * only. Reduced motion: crossfade only.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { recordPrivateAiEvent } from '@/api/submissions';
import {
  tiers,
  tierScripts,
  tierConsoleSummaries,
  isTierId,
  isSupplyMode,
  DEFAULT_TIER,
  DEFAULT_SUPPLY,
  BYO_SPEC,
  FINE_PRINT_BYO,
  FINE_PRINT_SUPPLIED,
  FINE_PRINT_MANAGED,
} from './tiers';
import type { TierId, SupplyMode } from './tiers';
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

function initialTier(): TierId {
  if (typeof window === 'undefined') return DEFAULT_TIER;
  const param = new URLSearchParams(window.location.search).get('tier');
  return isTierId(param) ? param : DEFAULT_TIER;
}

function initialSupply(): SupplyMode {
  if (typeof window === 'undefined') return DEFAULT_SUPPLY;
  const param = new URLSearchParams(window.location.search).get('supply');
  return isSupplyMode(param) ? param : DEFAULT_SUPPLY;
}

function syncUrl(id: TierId, supply: SupplyMode) {
  const url = new URL(window.location.href);
  url.searchParams.set('tier', id);
  url.searchParams.set('supply', supply);
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
  const [supply, setSupply] = useState<SupplyMode>(initialSupply);
  const [track, setTrack] = useState<'outright' | 'managed'>('outright');
  const tier = tiers.find((t) => t.id === tierId) ?? tiers[0];
  const [hwKey, setHwKey] = useState<string>(tier.supplied.hardware[0].key);

  const hw =
    tier.supplied.hardware.find((h) => h.key === hwKey) ?? tier.supplied.hardware[0];
  const byoMode = supply === 'byo';

  const rootRef = useRef<HTMLElement>(null);
  const segRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const indicatorStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const firstRender = useRef(true);

  /* Position the underline indicator on the selected tier segment. */
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

  /* Shared switch mechanic: capture Flip states, then apply state
     IMMEDIATELY. The dip-to-fade is pure decoration (the entrance effect
     fades back in) so a throttled or backgrounded tab can never wedge the
     control waiting on a tween's onComplete. */
  const transition = (apply: () => void) => {
    if (staticMode) {
      apply();
      return;
    }
    flipStateRef.current = Flip.getState('[data-flip-id]');
    indicatorStateRef.current = indicatorRef.current ? Flip.getState(indicatorRef.current) : null;
    gsap.set(fadeRef.current, { opacity: 0.25 });
    apply();
  };

  const selectTier = (id: TierId) => {
    if (id === tierId) return;
    recordPrivateAiEvent('pa_tier_select', { tier: id });
    const next = tiers.find((t) => t.id === id) ?? tiers[0];
    syncUrl(id, supply);
    transition(() => {
      setTierId(id);
      setHwKey(next.supplied.hardware[0].key);
    });
  };

  const selectSupply = (mode: SupplyMode) => {
    if (mode === supply) return;
    recordPrivateAiEvent('pa_supply_select', { supply: mode, tier: tierId });
    syncUrl(tierId, mode);
    transition(() => {
      setSupply(mode);
      if (mode === 'byo') setTrack('outright');
    });
  };

  const selectHw = (key: string) => {
    if (key === hwKey) return;
    recordPrivateAiEvent('pa_hw_select', { tier: tierId, hardware: key });
    transition(() => setHwKey(key));
  };

  /* Entrance animations after any switch. */
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
      gsap.to(fadeRef.current, { opacity: 1, duration: 0.3, ease: 'power1.out' });
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
  }, [tierId, supply, track, hwKey, staticMode]);

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
    selectTier(next);
    segRef.current?.querySelector<HTMLElement>(`[data-tier="${next}"]`)?.focus();
  };

  const finePrint = byoMode
    ? FINE_PRINT_BYO
    : track === 'managed'
      ? FINE_PRINT_MANAGED
      : FINE_PRINT_SUPPLIED;

  const goLive = byoMode ? tier.byo.goLive : tier.supplied.goLive;

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
              onClick={() => selectTier(t.id)}
            >
              {t.name}
            </button>
          ))}
          <div ref={indicatorRef} className="pa-seg-indicator" aria-hidden="true" />
        </div>

        {/* The supply switch: whose machine does it run on? */}
        <div className="pa-supply-row">
          <span className="pa-supply-label" id="pa-supply-label">
            The machine
          </span>
          <div
            className="pa-supply"
            role="radiogroup"
            aria-labelledby="pa-supply-label"
            data-supply={supply}
          >
            <span className="pa-supply-thumb" aria-hidden="true" />
            <button
              type="button"
              role="radio"
              aria-checked={byoMode}
              className="pa-supply-cell"
              onClick={() => selectSupply('byo')}
            >
              Your hardware
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={!byoMode}
              className="pa-supply-cell"
              onClick={() => selectSupply('supplied')}
            >
              We supply it
            </button>
          </div>
        </div>

        {/* Stage */}
        <div ref={fadeRef}>
          <div className="pa-stage">
            <div className="pa-stage-panel pa-stage-hw">
              <div className="pa-stage-panel-head">
                {byoMode ? 'Your hardware' : 'Supplied hardware'}
              </div>
              <HardwareUnit
                badge={byoMode ? 'YOURS' : hw.badge}
                unitCount={byoMode ? 1 : hw.unitCount}
                widthPx={UNIT_WIDTH[tier.id]}
                sweepKey={`${tier.id}-${supply}-${hw.key}`}
                staticMode={staticMode}
                variant={byoMode ? 'byo' : 'solid'}
              />
              {byoMode ? (
                <div className="pa-spec">
                  <p className="pa-spec-h">{BYO_SPEC.heading}</p>
                  <p className="pa-hwline">{BYO_SPEC.minimum}</p>
                  <p className="pa-hwline">{BYO_SPEC.recommended}</p>
                  <p className="pa-spec-note">{BYO_SPEC.note}</p>
                </div>
              ) : (
                <>
                  {tier.supplied.hardware.length > 1 && (
                    <div className="pa-hwpick" role="radiogroup" aria-label="Supplied hardware option">
                      {tier.supplied.hardware.map((option) => (
                        <button
                          key={option.key}
                          type="button"
                          role="radio"
                          aria-checked={option.key === hw.key}
                          className="pa-hwpick-chip"
                          onClick={() => selectHw(option.key)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="pa-hwline">{hw.line}</p>
                </>
              )}
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

          {/* Payment toggle: own outright vs managed monthly (supplied only —
              managed means C4 owns the machine, so it has no BYO form). */}
          {!byoMode && (
            <div className="pa-track" role="group" aria-label="Payment option">
              <button
                type="button"
                className="pa-track-btn"
                aria-pressed={track === 'outright'}
                onClick={() => setTrack('outright')}
              >
                Own outright
              </button>
              <button
                type="button"
                className="pa-track-btn"
                aria-pressed={track === 'managed'}
                onClick={() => setTrack('managed')}
              >
                Managed monthly
              </button>
            </div>
          )}

          {/* Details row */}
          <div className="pa-details" aria-live="polite">
            <div>
              {byoMode ? (
                <>
                  <div className="pa-price" data-pa-price>
                    <PriceChars value={tier.byo.upfront} />
                  </div>
                  <div className="pa-price-sub">Installed on your machine</div>
                  <div className="pa-price-monthly" data-pa-price style={{ marginTop: 20 }}>
                    <PriceChars value={tier.byo.monthly} />
                  </div>
                  <div className="pa-price-sub">Monthly care, software only</div>
                </>
              ) : track === 'managed' ? (
                <>
                  <div className="pa-price" data-pa-price>
                    <PriceChars value={tier.supplied.managedMonthly} />
                  </div>
                  <div className="pa-price-sub">Per month, 36-month term</div>
                  <div className="pa-price-monthly" data-pa-price style={{ marginTop: 20 }}>
                    <PriceChars value={tier.supplied.managedSetup} />
                  </div>
                  <div className="pa-price-sub">One-off setup</div>
                </>
              ) : (
                <>
                  <div className="pa-price" data-pa-price>
                    <PriceChars value={tier.supplied.upfront} />
                  </div>
                  <div className="pa-price-sub">Upfront, installed</div>
                  <div className="pa-price-monthly" data-pa-price style={{ marginTop: 20 }}>
                    <PriceChars value={tier.supplied.monthly} />
                  </div>
                  <div className="pa-price-sub">Monthly care</div>
                </>
              )}
            </div>
            <div>
              <p className="pa-suited">{tier.suitedTo}</p>
              <p className="pa-golive">{goLive}</p>
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

        <p className="pa-fineprint">{finePrint}</p>

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
