import React from 'react';
import { ArrowUpRight, Instagram } from 'lucide-react';
import PageHero from '../c4/PageHero';

export default function PortfolioHero() {
  return (
    <PageHero
      label="Selected Work"
      titleLines={['Recent work,', 'in detail.']}
      description="Case studies with the thinking, structure, and craft behind each project."
    >
      <a
        href="https://www.instagram.com/c4.studio/"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex max-w-[560px] overflow-hidden rounded-[3px]"
        style={{
          backgroundColor: 'var(--c4-inverted-bg)',
          border: '1px solid var(--c4-inverted-border)',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.12)',
        }}
      >
        <div
          className="flex items-center justify-center px-5 py-5 md:px-6"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0))',
            borderRight: '1px solid var(--c4-inverted-border)',
          }}
        >
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.16), rgba(255,255,255,0.05))',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <Instagram size={18} strokeWidth={1.8} style={{ color: 'var(--c4-inverted-text)' }} />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between gap-6 px-5 py-4 md:px-6 md:py-5">
          <div>
            <div className="text-[9.5px] uppercase tracking-[0.22em] font-medium" style={{ color: 'var(--c4-inverted-text-faint)' }}>
              For regular updates
            </div>
            <div className="mt-1 text-[14px] font-medium tracking-[-0.02em] md:text-[15px]" style={{ color: 'var(--c4-inverted-text)' }}>
              Follow C4 Studios on Instagram
            </div>
            <div className="mt-1 text-[12px] leading-[1.6] md:text-[12.5px]" style={{ color: 'var(--c4-inverted-text-muted)' }}>
              New launches, design details, in-progress work, and studio notes.
            </div>
          </div>

          <span
            className="hidden shrink-0 items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] font-medium transition-transform duration-300 group-hover:translate-x-0.5 md:inline-flex"
            style={{ color: 'var(--c4-inverted-text)' }}
          >
            Follow C4 Studios
            <ArrowUpRight size={13} strokeWidth={1.8} />
          </span>
        </div>
      </a>
    </PageHero>
  );
}
