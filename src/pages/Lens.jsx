/**
 * C4 Lens — Immersive landing page
 *
 * Force-dark cinematic experience with:
 * - High-density scroll-driven 3D morph (camera → glasses → eye)
 * - GSAP ScrollTrigger + Lenis smooth scroll
 * - Physics-based custom cursor
 * - Spotlight tracking, background beams, grain overlay
 * - Split-text reveals with staggered word animation
 * - Creative asymmetric layouts — NOT a template
 */
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Camera, Film, Scissors, Play, ChevronDown, Clock, MapPin, Users, Eye } from 'lucide-react';
import { createPageUrl } from '@/utils';

import '../components/lens/lens.css';
import SplitTextReveal from '../components/lens/SplitTextReveal';
import ScrollReveal from '../components/lens/ScrollReveal';
import MagneticCursor from '../components/lens/MagneticCursor';
import GrainOverlay from '../components/lens/GrainOverlay';
import SpotlightEffect from '../components/lens/SpotlightEffect';
import BackgroundBeams from '../components/lens/BackgroundBeams';

gsap.registerPlugin(ScrollTrigger);

/* ── Force dark mode ── */
function useForceDark() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.className;
    root.classList.add('dark-mode');
    root.classList.remove('light-mode', 'vivid');
    return () => { root.className = prev; };
  }, []);
}

/* ── Lenis smooth scroll ── */
function useLenis() {
  useEffect(() => {
    let lenis;
    let rafId;

    async function init() {
      const { default: Lenis } = await import('lenis');
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });

      // Connect Lenis to GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      // Refresh ScrollTrigger after Lenis is ready
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }

    init();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);
}

/* ── Horizontal scroll counter ── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}

/* ── Data ── */
const services = [
  {
    icon: Camera,
    title: 'Photography',
    tagline: 'Replace stock with proof.',
    description: 'Team portraits, workspace environments, product imagery, and headshots that show your clients you\'re the real deal.',
    tags: ['Headshots', 'Workspace', 'Product', 'Brand lifestyle'],
  },
  {
    icon: Film,
    title: 'Videography',
    tagline: 'Motion that earns attention.',
    description: 'Brand films, social content, event coverage and founder pieces. Every frame planned around where it actually lives.',
    tags: ['Brand films', 'Social content', 'Events', 'Founder stories'],
  },
  {
    icon: Scissors,
    title: 'Video Editing',
    tagline: 'Cut for the platform.',
    description: 'Short-form reels, brand cutdowns, event highlights. Crafted for feeds, pages, pitches — not generic timelines.',
    tags: ['Reels', 'Sizzles', 'Highlights', 'Launch trailers'],
  },
];

const process = [
  { num: '01', title: 'Discovery', time: '30 min call', body: 'We learn your brand, audit your current visual presence, and identify the specific footage that will move the needle.' },
  { num: '02', title: 'Direction', time: '2–3 days', body: 'Shot list, mood references, location scouting. Every frame planned around its deployment surface — hero, feed, or pitch.' },
  { num: '03', title: 'Capture', time: 'Half or full day', body: 'Focused, efficient, zero wasted time. We arrive with a tight brief and leave with everything we need.' },
  { num: '04', title: 'Deliver', time: '5–7 days', body: 'Colour graded, platform-formatted, and delivered with usage guidance. Assets ready to deploy the moment they land.' },
];

const stats = [
  { value: '50+', label: 'Australian businesses', icon: Users },
  { value: '200+', label: 'Assets delivered', icon: Eye },
  { value: '<7', label: 'Days turnaround', icon: Clock },
  { value: '100%', label: 'Australian-based', icon: MapPin },
];

const portfolio = [
  { id: 1, type: 'Brand Film', w: 'col-span-2 row-span-2' },
  { id: 2, type: 'Photography', w: '' },
  { id: 3, type: 'Social Content', w: '' },
  { id: 4, type: 'Videography', w: 'col-span-2' },
  { id: 5, type: 'Photography', w: '' },
  { id: 6, type: 'Headshots', w: '' },
];

/* ══════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function Lens() {
  useForceDark();
  useLenis();
  const scrollProgress = useScrollProgress();
  // heroRef removed — 3D scroll animation outsourced
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const col = {
    bg: '#0F1115',
    surface: '#161A21',
    surfaceHover: '#1C2029',
    text: '#ECE7DE',
    muted: 'rgba(236, 231, 222, 0.5)',
    faint: 'rgba(236, 231, 222, 0.25)',
    ghost: 'rgba(236, 231, 222, 0.08)',
    accent: '#B33A3A',
    accentGlow: 'rgba(179, 58, 58, 0.12)',
    border: 'rgba(236, 231, 222, 0.06)',
  };

  return (
    <div className="lens-page relative overflow-x-hidden" style={{ backgroundColor: col.bg, color: col.text }}>
      <MagneticCursor />
      <GrainOverlay opacity={0.03} />

      {/* Progress bar — thin line at top */}
      <div className="fixed top-0 left-0 z-[100] h-[2px]" style={{ width: `${scrollProgress * 100}%`, backgroundColor: col.accent, transition: 'width 0.05s linear' }} />

      {/* ════════════════════════════════════════════════════
          HERO — Cinematic title (single viewport)
          ════════════════════════════════════════════════════ */}
      <div className="relative h-screen w-full overflow-hidden">
        <BackgroundBeams />

        {/* Hero copy — positioned bottom-left for asymmetry */}
        <div className="absolute inset-0 z-[2] flex flex-col justify-end pb-12 md:pb-20 px-6 md:px-14">
          <div className="max-w-[1440px] mx-auto w-full">
            {/* Overline badge */}
            {mounted && (
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
                style={{
                  border: `1px solid ${col.ghost}`,
                  backgroundColor: 'rgba(15, 17, 21, 0.5)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: col.accent }} />
                <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: col.faint }}>
                  Photography &middot; Videography &middot; Editing
                </span>
              </div>
            )}

            {/* Title — massive, left-aligned */}
            <SplitTextReveal
              as="h1"
              splitBy="char"
              stagger={0.025}
              duration={1.2}
              y={100}
              trigger="immediate"
              delay={0.2}
              className="font-semibold tracking-[-0.06em] leading-[0.85] max-w-[900px]"
              style={{ fontSize: 'clamp(3.2rem, 11vw, 10rem)', color: col.text }}
            >
              C4 Lens
            </SplitTextReveal>

            {/* Subline — staggered below */}
            <div className="mt-5 flex flex-col md:flex-row md:items-end md:gap-12">
              <SplitTextReveal
                as="p"
                splitBy="word"
                stagger={0.06}
                duration={0.9}
                y={30}
                trigger="immediate"
                delay={0.8}
                className="max-w-[420px] text-[16px] leading-[1.7] md:text-[18px]"
                style={{ color: col.muted }}
              >
                See your business the way your clients should.
              </SplitTextReveal>

              {/* CTA — appears alongside subtitle on desktop */}
              <ScrollReveal delay={1.2} y={20}>
                <Link
                  to={createPageUrl('C4LensPricing')}
                  className="group mt-6 md:mt-0 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-medium"
                  style={{ color: col.text }}
                  data-cursor-hover
                >
                  <span className="relative">
                    Book a shoot
                    <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px transition-all duration-500" style={{ backgroundColor: col.accent }} />
                  </span>
                  <ArrowUpRight size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </ScrollReveal>
            </div>
          </div>

          {/* Scroll hint — bottom center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[8px] uppercase tracking-[0.4em]" style={{ color: col.faint }}>Scroll</span>
            <div className="w-px h-8 overflow-hidden">
              <div className="w-px h-8 animate-pulse" style={{ backgroundColor: col.faint }} />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          INTERSTITIAL — Large text statement
          ════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-14">
        <div className="max-w-[1440px] mx-auto">
          <SplitTextReveal
            as="p"
            splitBy="word"
            stagger={0.07}
            duration={0.9}
            y={50}
            className="text-[1.8rem] md:text-[3rem] lg:text-[3.8rem] font-semibold tracking-[-0.04em] leading-[1.1] max-w-[18ch]"
            style={{ color: col.text }}
          >
            Most businesses don&rsquo;t have a content problem. They have a visual proof problem.
          </SplitTextReveal>
          <ScrollReveal delay={0.3}>
            <p className="mt-6 text-[14px] md:text-[15px] leading-[1.7] max-w-[48ch]" style={{ color: col.faint }}>
              Stock photos tell your audience you haven&rsquo;t invested in your own story. C4 Lens fixes that.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          WHAT WE DO — Asymmetric card grid
          ════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-32 px-6 md:px-14">
        <SpotlightEffect className="max-w-[1440px] mx-auto">
          {/* Header — spanning with accent rule */}
          <div className="flex items-start gap-4 mb-16">
            <div className="w-12 h-px mt-3 flex-shrink-0" style={{ backgroundColor: col.accent }} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] mb-3" style={{ color: col.accent }}>Services</p>
              <SplitTextReveal
                as="h2"
                splitBy="word"
                stagger={0.06}
                className="text-[2rem] md:text-[3rem] font-semibold tracking-[-0.04em] leading-[0.95]"
                style={{ color: col.text }}
              >
                Three services.{'\n'}One visual standard.
              </SplitTextReveal>
            </div>
          </div>

          {/* Service cards — creative staggered layout */}
          <div className="grid gap-4 md:gap-5 md:grid-cols-3">
            {services.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 0.1}>
                <div
                  className="group relative rounded-2xl p-7 md:p-8 h-full transition-colors duration-500"
                  style={{
                    backgroundColor: col.surface,
                    border: `1px solid ${col.border}`,
                  }}
                  data-cursor-hover
                >
                  {/* Number + icon row */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[11px] font-mono tracking-wider" style={{ color: col.faint }}>
                      0{i + 1}
                    </span>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: col.accentGlow }}
                    >
                      <s.icon size={18} strokeWidth={1.5} style={{ color: col.accent }} />
                    </div>
                  </div>

                  <h3 className="text-[1.4rem] font-semibold tracking-[-0.03em] mb-1" style={{ color: col.text }}>
                    {s.title}
                  </h3>
                  <p className="text-[13px] font-medium mb-4" style={{ color: col.accent }}>
                    {s.tagline}
                  </p>
                  <p className="text-[13px] leading-[1.72] mb-6" style={{ color: col.muted }}>
                    {s.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-3 py-1.5 text-[9px] uppercase tracking-[0.14em]"
                        style={{ border: `1px solid ${col.border}`, color: col.faint }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Hover accent bar */}
                  <div
                    className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: col.accent }}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </SpotlightEffect>
      </section>

      {/* ════════════════════════════════════════════════════
          OUR APPROACH — Numbered timeline
          ════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-32 px-6 md:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
            {/* Left — sticky header */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-px mt-3 flex-shrink-0" style={{ backgroundColor: col.accent }} />
                <p className="text-[10px] uppercase tracking-[0.26em]" style={{ color: col.accent }}>Process</p>
              </div>
              <SplitTextReveal
                as="h2"
                splitBy="word"
                stagger={0.06}
                className="text-[2rem] md:text-[3.2rem] font-semibold tracking-[-0.04em] leading-[0.94]"
                style={{ color: col.text }}
              >
                From brief to deployed assets.
              </SplitTextReveal>
              <ScrollReveal delay={0.15}>
                <p className="mt-5 text-[14px] leading-[1.78] max-w-[38ch]" style={{ color: col.muted }}>
                  A focused production workflow that respects your time and delivers assets optimised for where they actually live.
                </p>
              </ScrollReveal>

              {/* Stats row */}
              <ScrollReveal delay={0.25}>
                <div className="mt-10 grid grid-cols-2 gap-6">
                  {stats.map((s) => (
                    <div key={s.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0" style={{ backgroundColor: col.accentGlow }}>
                        <s.icon size={14} strokeWidth={1.5} style={{ color: col.accent }} />
                      </div>
                      <div>
                        <p className="text-[1.3rem] font-semibold tracking-[-0.03em]" style={{ color: col.text }}>
                          {s.value}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.12em]" style={{ color: col.faint }}>
                          {s.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right — process steps */}
            <div>
              {process.map((step, i) => (
                <ScrollReveal key={step.num} delay={i * 0.08}>
                  <div
                    className="relative pl-10 pb-12 last:pb-0"
                    style={{ borderLeft: `1px solid ${col.border}` }}
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute left-0 top-1 -translate-x-1/2 w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: col.bg,
                        border: `2px solid ${col.accent}`,
                        boxShadow: `0 0 12px ${col.accentGlow}`,
                      }}
                    />

                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-[10px] font-mono tracking-wider" style={{ color: col.accent }}>{step.num}</span>
                      <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em]" style={{ color: col.text }}>
                        {step.title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-[0.16em] ml-auto" style={{ color: col.faint }}>
                        {step.time}
                      </span>
                    </div>
                    <p className="text-[14px] leading-[1.74] max-w-[52ch]" style={{ color: col.muted }}>
                      {step.body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PORTFOLIO — Bento grid
          ════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-32 px-6 md:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div className="flex items-start gap-4">
              <div className="w-12 h-px mt-3 flex-shrink-0" style={{ backgroundColor: col.accent }} />
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] mb-3" style={{ color: col.accent }}>Portfolio</p>
                <SplitTextReveal
                  as="h2"
                  splitBy="word"
                  stagger={0.06}
                  className="text-[2rem] md:text-[3rem] font-semibold tracking-[-0.04em] leading-[0.95]"
                  style={{ color: col.text }}
                >
                  Work in progress
                </SplitTextReveal>
              </div>
            </div>
          </div>

          {/* Bento grid — empty slots ready for portfolio entries */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
            {portfolio.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 0.05} className={item.w}>
                <div
                  className="group relative rounded-xl overflow-hidden h-full"
                  style={{ backgroundColor: col.surface, border: `1px solid ${col.border}` }}
                  data-cursor-hover
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center opacity-40">
                      {item.type.includes('Film') || item.type.includes('Video') ? (
                        <Play size={20} style={{ color: col.faint }} className="mx-auto mb-2" />
                      ) : (
                        <Camera size={20} style={{ color: col.faint }} className="mx-auto mb-2" />
                      )}
                      <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: col.faint }}>
                        Coming soon
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ABOUT CALEB — Split layout with large type
          ════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-32 px-6 md:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 lg:grid-cols-[0.5fr_1fr] lg:gap-16 items-start">
            {/* Photo column */}
            <ScrollReveal>
              <div className="relative">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    aspectRatio: '3/4',
                    backgroundColor: col.surface,
                    border: `1px solid ${col.border}`,
                  }}
                >
                  <img
                    src="/Caleb Walker - C4 Lens Profile.jpeg"
                    alt="Caleb Walker — C4 Lens photographer and videographer"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Floating detail card */}
                <div
                  className="absolute -bottom-4 -right-4 md:-right-6 rounded-xl p-4 backdrop-blur-xl"
                  style={{
                    backgroundColor: 'rgba(22, 26, 33, 0.85)',
                    border: `1px solid ${col.border}`,
                  }}
                >
                  <p className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: col.accent }}>Role</p>
                  <p className="text-[13px] font-medium" style={{ color: col.text }}>Lead Photographer<br />& Videographer</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Bio column */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-px mt-3 flex-shrink-0" style={{ backgroundColor: col.accent }} />
                <p className="text-[10px] uppercase tracking-[0.26em]" style={{ color: col.accent }}>Behind the lens</p>
              </div>

              <SplitTextReveal
                as="h2"
                splitBy="word"
                stagger={0.05}
                className="text-[2.4rem] md:text-[3.6rem] font-semibold tracking-[-0.05em] leading-[0.92] mb-8"
                style={{ color: col.text }}
              >
                Caleb Walker
              </SplitTextReveal>

              <ScrollReveal delay={0.1}>
                <p className="text-[15px] leading-[1.82] max-w-[56ch] mb-4" style={{ color: col.muted }}>
                  Caleb leads C4 Lens — the photography, videography, and editing arm of C4 Studios. From weddings and events to commercial brand shoots and corporate headshots, he brings a considered, story-first approach to every frame.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <p className="text-[15px] leading-[1.82] max-w-[56ch] mb-4" style={{ color: col.muted }}>
                  His drone work captures perspectives most businesses never think to show, and his video editing transforms raw footage into polished brand films, social reels, and launch content that actually converts. Caleb doesn&rsquo;t just photograph a business — he extracts its character and puts it on screen.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-[15px] leading-[1.82] max-w-[56ch] mb-10" style={{ color: col.muted }}>
                  Australian businesses trust Caleb to replace stock imagery with visual proof — the kind of content that makes clients feel like they already know you before the first conversation.
                </p>
              </ScrollReveal>

              {/* Horizontal rule quote */}
              <ScrollReveal delay={0.25}>
                <div className="py-6" style={{ borderTop: `1px solid ${col.border}`, borderBottom: `1px solid ${col.border}` }}>
                  <p className="text-[1.1rem] md:text-[1.3rem] font-semibold tracking-[-0.02em] leading-[1.3] italic max-w-[38ch]" style={{ color: col.text }}>
                    &ldquo;If the brand has weight, the visuals should too.&rdquo;
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA — Full-bleed with accent glow
          ════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-14 overflow-hidden">
        {/* Accent glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: 'rgba(179, 58, 58, 0.08)' }}
        />

        <div className="relative max-w-[1440px] mx-auto">
          <div className="max-w-[820px]">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-px mt-3 flex-shrink-0" style={{ backgroundColor: col.accent }} />
              <p className="text-[10px] uppercase tracking-[0.26em]" style={{ color: col.accent }}>Start here</p>
            </div>

            <SplitTextReveal
              as="h2"
              splitBy="word"
              stagger={0.07}
              className="text-[2.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-semibold tracking-[-0.05em] leading-[0.9]"
              style={{ color: col.text }}
            >
              Your brand deserves better than stock.
            </SplitTextReveal>

            <ScrollReveal delay={0.2}>
              <p className="mt-6 max-w-[480px] text-[15px] leading-[1.78]" style={{ color: col.muted }}>
                Tell us about your business, and we&rsquo;ll show you exactly how C4 Lens can upgrade your visual presence. No commitment, no fluff.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link
                  to={createPageUrl('C4LensPricing')}
                  className="group inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.16em] font-medium rounded-full transition-all duration-300 hover:gap-4"
                  style={{ backgroundColor: col.text, color: col.bg }}
                  data-cursor-accent
                >
                  Book a shoot
                  <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to={createPageUrl('Support')}
                  className="group inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.16em] font-medium rounded-full transition-all duration-300"
                  style={{ border: `1px solid rgba(236, 231, 222, 0.12)`, color: col.text }}
                  data-cursor-hover
                >
                  Ask a question
                  <ArrowUpRight size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Footer attribution */}
          <ScrollReveal delay={0.4}>
            <div className="mt-24 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={{ borderTop: `1px solid ${col.border}` }}>
              <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: col.faint }}>
                C4 Lens is a service of{' '}
                <a
                  href="https://c4studios.com.au"
                  className="underline decoration-[rgba(236,231,222,0.12)] underline-offset-4 hover:decoration-[rgba(236,231,222,0.4)] transition-colors duration-300"
                  style={{ color: col.muted }}
                  data-cursor-hover
                >
                  C4 Studios
                </a>
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: col.faint }}>
                Perth, Western Australia
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
