/**
 * ConsoleWindow — the scripted software demo.
 *
 * One tiny renderer plays every script on the page (hero and all four
 * tiers). Scripts are data (see tiers.ts): arrays of typed steps. Each
 * exchange plays out, holds, soft-wipes, and the whole thing loops.
 *
 * Behaviour rules:
 * - Animates transform and opacity only. Plain DOM, no canvas.
 * - Pauses when the tab is hidden and when scrolled off screen.
 * - In static mode (prefers-reduced-motion or the prerenderer) the first
 *   exchange renders fully, no loop, no typewriter.
 * - The whole window is decorative (aria-hidden); srSummary carries the
 *   story for screen readers as real text.
 */
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { ConsoleStep } from './tiers';

const TYPE_SPEED = 0.028; // seconds per character, per the brief
const HOLD = 3; // seconds an exchange stays on screen once complete
const WIPE = 0.5;

/** Default pause (s) before a step begins, unless the script says otherwise. */
const DEFAULT_DELAY: Record<ConsoleStep['type'], number> = {
  status: 0.35,
  user: 0.55,
  stream: 0.35,
  chip: 0.2,
  tick: 0.5,
  queue: 0.45,
  audit: 0.35,
  metric: 0.45,
};

/* Consecutive chips render on one wrapping row. */
type RenderItem =
  | { kind: 'chips'; chips: ConsoleStep[] }
  | { kind: 'step'; step: ConsoleStep };

function toRenderItems(steps: ConsoleStep[]): RenderItem[] {
  const items: RenderItem[] = [];
  for (const step of steps) {
    const last = items[items.length - 1];
    if (step.type === 'chip') {
      if (last && last.kind === 'chips') last.chips.push(step);
      else items.push({ kind: 'chips', chips: [step] });
    } else {
      items.push({ kind: 'step', step });
    }
  }
  return items;
}

interface ConsoleWindowProps {
  exchanges: ConsoleStep[][];
  title: string;
  srSummary: string;
  staticMode: boolean;
  className?: string;
}

export default function ConsoleWindow({
  exchanges,
  title,
  srSummary,
  staticMode,
  className = '',
}: ConsoleWindowProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const exchangeEls = Array.from(
      root.querySelectorAll<HTMLElement>('[data-pa-exchange]'),
    );

    if (staticMode) {
      // First exchange fully rendered, others hidden, carets off.
      exchangeEls.forEach((ex, i) => {
        ex.style.opacity = i === 0 ? '1' : '0';
        ex.style.visibility = i === 0 ? 'visible' : 'hidden';
      });
      root.querySelectorAll<HTMLElement>('[data-pa-caret]').forEach((c) => {
        c.style.display = 'none';
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, paused: true });

      exchangeEls.forEach((exEl, exIndex) => {
        const items = Array.from(exEl.querySelectorAll<HTMLElement>('[data-pa-item]'));

        // Hide everything for this exchange before it plays (re-applied on loop).
        gsap.set(exEl, { autoAlpha: exIndex === 0 ? 1 : 0 });
        gsap.set(items, { autoAlpha: 0, y: 6 });

        tl.set(exEl, { autoAlpha: 1 });
        tl.set(items, { autoAlpha: 0, y: 6 });

        items.forEach((el) => {
          const type = el.dataset.paType as ConsoleStep['type'] | 'chips';
          const delayMs = el.dataset.paDelay;
          const baseDelay =
            delayMs != null
              ? Number(delayMs) / 1000
              : DEFAULT_DELAY[(type === 'chips' ? 'chip' : type) as ConsoleStep['type']];

          if (type === 'user') {
            const txt = el.querySelector<HTMLElement>('[data-pa-usertext]');
            const caret = el.querySelector<HTMLElement>('[data-pa-caret]');
            const full = el.dataset.paText || '';
            const proxy = { n: 0 };
            // Empty the text before the row becomes visible; the static render
            // (and every completed loop) leaves the full prompt in the DOM.
            tl.call(() => {
              if (txt) txt.textContent = '';
            }, undefined, `+=${baseDelay}`);
            tl.set(el, { autoAlpha: 1, y: 0 });
            if (caret) tl.set(caret, { display: 'inline-block' });
            tl.fromTo(
              proxy,
              { n: 0 },
              {
                n: full.length,
                duration: full.length * TYPE_SPEED,
                ease: 'none',
                onUpdate() {
                  if (txt) txt.textContent = full.slice(0, Math.round(proxy.n));
                },
              },
            );
            if (caret) tl.set(caret, { display: 'none' }, '+=0.25');
          } else if (type === 'stream') {
            const words = el.querySelectorAll<HTMLElement>('.pa-w');
            const stagger = Math.min(Math.max(2.4 / Math.max(words.length, 1), 0.05), 0.18);
            tl.set(el, { autoAlpha: 1, y: 0 }, `+=${baseDelay}`);
            tl.fromTo(
              words,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.22, ease: 'none', stagger },
            );
          } else if (type === 'chips') {
            const chips = el.querySelectorAll<HTMLElement>('.pa-c-chip');
            tl.set(el, { autoAlpha: 1, y: 0 }, `+=${baseDelay}`);
            tl.fromTo(
              chips,
              { autoAlpha: 0, y: 4, scale: 0.96 },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out', stagger: 0.15 },
            );
          } else {
            tl.to(el, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, `+=${baseDelay}`);
          }
        });

        // Hold, then soft-wipe the exchange away.
        tl.to(exEl, { autoAlpha: 0, duration: WIPE, ease: 'power2.inOut' }, `+=${HOLD}`);
      });

      // Pause when the tab is hidden or the console is off screen.
      const state = { hidden: document.hidden, offscreen: false };
      const sync = () => {
        if (state.hidden || state.offscreen) tl.pause();
        else tl.play();
      };
      const onVis = () => {
        state.hidden = document.hidden;
        sync();
      };
      document.addEventListener('visibilitychange', onVis);
      const io = new IntersectionObserver(
        ([entry]) => {
          state.offscreen = !entry.isIntersecting;
          sync();
        },
        { threshold: 0.05 },
      );
      io.observe(root);
      sync();

      return () => {
        document.removeEventListener('visibilitychange', onVis);
        io.disconnect();
      };
    }, root);

    return () => ctx.revert();
  }, [exchanges, staticMode]);

  return (
    <div ref={rootRef} className={`pa-console ${className}`.trim()}>
      <div className="pa-console-bar" aria-hidden="true">
        <span className="pa-console-dot" />
        <span className="pa-console-dot" />
        <span className="pa-console-dot" />
        <span className="pa-console-title">{title}</span>
      </div>
      <div className="pa-console-body" aria-hidden="true">
        {exchanges.map((steps, exIndex) => (
          <div className="pa-console-exchange" data-pa-exchange key={exIndex}>
            {toRenderItems(steps).map((item, i) => {
              if (item.kind === 'chips') {
                return (
                  <div
                    key={i}
                    className="pa-c-chips"
                    data-pa-item
                    data-pa-type="chips"
                    data-pa-delay={item.chips[0].delay}
                  >
                    {item.chips.map((chip, ci) => (
                      <span key={ci} className="pa-c-chip">
                        {chip.text}
                      </span>
                    ))}
                  </div>
                );
              }
              const { step } = item;
              if (step.type === 'user') {
                return (
                  <div
                    key={i}
                    className="pa-c-user"
                    data-pa-item
                    data-pa-type="user"
                    data-pa-text={step.text}
                    data-pa-delay={step.delay}
                  >
                    <span className="pa-c-prompt">›</span>
                    <span>
                      {/* Static render carries the full text; the typewriter overwrites it. */}
                      <span data-pa-usertext>{step.text}</span>
                      <span className="pa-c-caret" data-pa-caret style={{ display: 'none' }} />
                    </span>
                  </div>
                );
              }
              if (step.type === 'stream') {
                return (
                  <p key={i} className="pa-c-stream" data-pa-item data-pa-type="stream" data-pa-delay={step.delay}>
                    {step.text.split(' ').map((w, wi, arr) => (
                      <span key={wi} className="pa-w">
                        {w}
                        {wi < arr.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                  </p>
                );
              }
              if (step.type === 'status') {
                return (
                  <div key={i} className="pa-c-status" data-pa-item data-pa-type="status" data-pa-delay={step.delay}>
                    <span className="pa-c-statusdot" />
                    {step.text}
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className={`pa-c-${step.type}`}
                  data-pa-item
                  data-pa-type={step.type}
                  data-pa-delay={step.delay}
                >
                  {step.text}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <span className="pa-vh">{srSummary}</span>
    </div>
  );
}
