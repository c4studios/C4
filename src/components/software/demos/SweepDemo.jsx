import React, { useEffect, useMemo, useRef, useState } from 'react';
import { buildDeck, human } from './sweepGrouping';
import { buildSampleScan } from './sweepSampleData';

const KEEP = 'var(--c4-accent)';
const ARCHIVE = '#b4452f';
const conf = { high: 'var(--c4-accent)', medium: '#d99a4e', low: 'var(--c4-text-subtle)' };

/* default archive marks: dedup cards pre-mark non-survivors, web bundles
   pre-mark all, everything else starts all-kept (the visitor opts in). */
function initialMarks(card) {
  return card.members.map((m) =>
    card.keepHint ? m.path !== card.keepHint.path : card.heuristic === 'web-bundle');
}

export default function SweepDemo() {
  const deck = useMemo(() => buildDeck(buildSampleScan(Date.now())), []);
  const cards = deck.cards;

  const [idx, setIdx] = useState(0);
  const [marks, setMarks] = useState(() => cards.map(initialMarks));
  const [decided, setDecided] = useState(() => new Set());
  const [reclaimed, setReclaimed] = useState(0);
  const [archived, setArchived] = useState(0);
  const active = useRef(false);

  const reset = () => {
    setIdx(0); setMarks(cards.map(initialMarks)); setDecided(new Set());
    setReclaimed(0); setArchived(0);
  };
  const next = () => setIdx((i) => Math.min(i + 1, cards.length));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  const archiveMarked = () => {
    const card = cards[idx];
    if (!card) return;
    const m = marks[idx];
    const chosen = card.members.filter((_, i) => m[i]);
    if (!chosen.length) return;
    setReclaimed((r) => r + chosen.reduce((a, x) => a + x.bytes, 0));
    setArchived((a) => a + chosen.length);
    setDecided((d) => new Set(d).add(card.id ?? idx));
    next();
  };
  const keepAll = () => { setDecided((d) => new Set(d).add(idx)); next(); };
  const toggle = (mi) => setMarks((all) => all.map((arr, ci) =>
    ci === idx ? arr.map((v, i) => (i === mi ? !v : v)) : arr));

  useEffect(() => {
    const onKey = (e) => {
      if (!active.current) return;
      if (e.key === 'a' || e.key === 'A') archiveMarked();
      else if (e.key === 'k' || e.key === 'K') keepAll();
      else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, marks]); // eslint-disable-line react-hooks/exhaustive-deps

  const done = idx >= cards.length;
  const card = cards[idx];
  const markedCount = card ? marks[idx].filter(Boolean).length : 0;
  const markedBytes = card ? card.members.reduce((a, m, i) => a + (marks[idx][i] ? m.bytes : 0), 0) : 0;
  const pct = Math.round((decided.size / cards.length) * 100);

  return (
    <div
      tabIndex={0}
      onMouseEnter={() => { active.current = true; }}
      onMouseLeave={() => { active.current = false; }}
      onFocus={() => { active.current = true; }}
      onBlur={() => { active.current = false; }}
      className="rounded-[6px] overflow-hidden outline-none"
      style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
    >
      {/* top bar */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--c4-border)' }}>
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center rounded-[5px] text-[11px] font-bold" style={{ width: 22, height: 22, backgroundColor: 'var(--c4-accent)', color: 'var(--c4-bg)' }}>S</span>
          <span className="text-[12.5px] font-semibold" style={{ color: 'var(--c4-text)' }}>Sweep</span>
          <span className="text-[11px]" style={{ color: 'var(--c4-text-subtle)' }}>· Downloads · sample folder</span>
        </div>
        <div className="flex items-center gap-5 text-[11px]" style={{ color: 'var(--c4-text-subtle)' }}>
          <span>Decision <b style={{ color: 'var(--c4-text)' }}>{Math.min(idx + 1, cards.length)}/{cards.length}</b></span>
          <span>Reclaimed <b style={{ color: 'var(--c4-accent)' }}>{human(reclaimed)}</b></span>
        </div>
      </div>
      <div style={{ height: 4, backgroundColor: 'var(--c4-border)' }}>
        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: 'var(--c4-accent)', transition: 'width .25s ease' }} />
      </div>

      {/* body */}
      <div className="p-5 md:p-6" style={{ minHeight: 340 }}>
        {done ? (
          <div className="flex flex-col items-center justify-center text-center gap-3" style={{ minHeight: 300 }}>
            <p className="text-[2rem]" style={{ color: 'var(--c4-accent)' }}>✓</p>
            <p className="text-[1.4rem] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>Swept</p>
            <p className="text-[13.5px] leading-[1.6] max-w-[420px]" style={{ color: 'var(--c4-text-muted)' }}>
              You reviewed {cards.length} groups and reclaimed <b style={{ color: 'var(--c4-text)' }}>{human(reclaimed)}</b> across {archived} item{archived === 1 ? '' : 's'}.
              In the real app these move to a recoverable Holding Pen — nothing is ever deleted.
            </p>
            <button onClick={reset} className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium rounded-[3px] transition-opacity hover:opacity-85" style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}>
              Run it again
            </button>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] mb-3" style={{ border: `1px solid ${conf[card.confidence]}` }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: conf[card.confidence] }} />
              <span className="text-[9px] uppercase tracking-[0.13em] font-medium" style={{ color: conf[card.confidence] }}>{card.confidence} confidence</span>
            </div>
            <h4 className="text-[1.15rem] md:text-[1.3rem] font-semibold tracking-[-0.02em] leading-[1.25]" style={{ color: 'var(--c4-text)' }}>{card.title}</h4>
            <p className="mt-1 text-[12.5px]" style={{ color: 'var(--c4-text-subtle)' }}>
              {human(card.bytes)} · {card.meta.ageRange}{card.reclaimable > 0 ? ` · ~${human(card.reclaimable)} reclaimable` : ''}
            </p>
            <div className="mt-3 flex gap-2 rounded-[5px] px-3.5 py-2.5 text-[12.5px] leading-[1.5]" style={{ backgroundColor: 'var(--c4-bg-alt)', color: 'var(--c4-text-muted)' }}>
              <span style={{ color: 'var(--c4-accent)' }}>✦</span><span>{card.suggestion}</span>
            </div>

            <div className="mt-3 flex flex-col gap-1.5">
              {card.members.slice(0, 6).map((m, i) => {
                const isArchive = marks[idx][i];
                return (
                  <button
                    key={m.path}
                    onClick={() => toggle(i)}
                    className="flex items-center gap-3 px-3 py-2 rounded-[5px] text-left transition-colors"
                    style={{
                      border: `1px solid ${isArchive ? '#e6c6bd' : 'var(--c4-border)'}`,
                      backgroundColor: isArchive ? 'rgba(180,69,47,0.07)' : 'var(--c4-bg)',
                    }}
                  >
                    <span className="text-[11.5px] tabular-nums shrink-0" style={{ minWidth: 58, color: 'var(--c4-text-subtle)' }}>{human(m.bytes)}</span>
                    <span className="flex-1 text-[12.5px] truncate" style={{ color: isArchive ? ARCHIVE : 'var(--c4-text)' }}>{m.name}</span>
                    <span className="text-[9.5px] font-bold tracking-[0.05em] px-2 py-[3px] rounded-[4px]" style={{
                      minWidth: 64, textAlign: 'center',
                      color: isArchive ? 'var(--c4-bg)' : 'var(--c4-accent)',
                      backgroundColor: isArchive ? ARCHIVE : 'rgba(0,0,0,0.04)',
                    }}>{isArchive ? 'ARCHIVE' : 'KEEP'}</span>
                  </button>
                );
              })}
              {card.members.length > 6 && (
                <p className="text-[11.5px] pl-1" style={{ color: 'var(--c4-text-subtle)' }}>+ {card.members.length - 6} more in this group</p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                onClick={archiveMarked}
                disabled={!markedCount}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] font-semibold rounded-[3px] transition-opacity"
                style={{ backgroundColor: 'var(--c4-accent)', color: 'var(--c4-bg)', opacity: markedCount ? 1 : 0.4, cursor: markedCount ? 'pointer' : 'not-allowed' }}
              >
                Archive {markedCount}{markedCount ? ` · ${human(markedBytes)}` : ''}
              </button>
              <button onClick={keepAll} className="inline-flex items-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] font-medium rounded-[3px] transition-colors" style={{ border: '1px solid var(--c4-border)', color: 'var(--c4-text)' }}>
                Keep all
              </button>
              <span className="ml-auto text-[10.5px]" style={{ color: 'var(--c4-text-subtle)' }}>
                click a row to toggle · <kbd>A</kbd> archive · <kbd>K</kbd> keep
              </span>
            </div>
          </>
        )}
      </div>

      <div className="px-5 py-2.5 text-[10.5px]" style={{ borderTop: '1px solid var(--c4-border)', color: 'var(--c4-text-subtle)' }}>
        Live demo on a sample folder — the real Sweep runs on your own computer, scanning is read-only, and archived items are always recoverable.
      </div>
    </div>
  );
}
