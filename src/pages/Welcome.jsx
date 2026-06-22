/**
 * /welcome — networking-card landing.
 *
 * A scanned QR or tapped NFC card opens this page. It is phone-first, loads in
 * front of a prospect on mobile data, and is itself a portfolio piece — so the
 * headline must paint instantly and nothing may stall (handoff §1, §5).
 *
 * Build order (handoff §8): static hero + 3 ranked actions + vCard ship first;
 * the Avenue A frame-scrub layers in once Caleb renders the asset (set
 * AVENUE_FRAME_COUNT below). Until then the "proof" slot shows the live,
 * tap-to-build C4 logo — capability on display with zero new assets.
 *
 * Routing note: this page is mounted as an explicit, chrome-free route in
 * App.jsx (no NavHeader/Footer) so the landing stays focused and fast.
 */
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, Phone, Download, ArrowUpRight } from 'lucide-react';
import C4Mark from '@/components/welcome/C4Mark';
import useDocumentHead from '@/hooks/useDocumentHead';
import { recordScan } from '@/api/submissions';
import { createPageUrl } from '@/utils';
import '../components/welcome/welcome.css';

/* Heavy/animation bundles are split out so the hero paints immediately. */
const AvenueScrub = lazy(() => import('@/components/welcome/AvenueScrub'));
const C4Logo = lazy(() => import('@/components/c4/C4Logo'));
const BookingSheet = lazy(() => import('@/components/welcome/BookingSheet'));

/* ── Avenue A frame sequence ──────────────────────────────────────────
   Set this to the rendered frame count once WebP frames are dropped into
   /public/welcome/frames/ (named avenue-001.webp …). While it is 0, the
   proof section shows the interactive logo instead of the scrub. */
const AVENUE_FRAME_COUNT = 0;

const ease = [0.22, 1, 0.36, 1];

/* Fire the scan event exactly once per page load (survives StrictMode's
   double-mount in dev via this module-level flag). */
let scanFired = false;

export default function Welcome() {
  const [params] = useSearchParams();
  const [bookingOpen, setBookingOpen] = useState(false);
  const scrubRef = useRef(null);
  const hasFrames = AVENUE_FRAME_COUNT > 0;

  useDocumentHead({
    title: 'You found the card — C4 Studios',
    description:
      'You scanned the C4 Studios card. Perth web design & development. Book a call, save the contact, or see the work.',
    path: '/welcome',
    noIndex: true,
  });

  /* Force the greige card palette regardless of the visitor's theme, and
     paint the browser chrome to match. Restored on unmount. */
  useEffect(() => {
    const root = document.documentElement;
    const prevClass = root.className;
    root.classList.add('light-mode');
    root.classList.remove('dark-mode', 'vivid');

    const prevBodyBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#E8E4DB';

    let themeMeta = document.querySelector('meta[name="theme-color"]');
    const createdMeta = !themeMeta;
    const prevThemeColor = themeMeta?.getAttribute('content');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', '#E8E4DB');

    return () => {
      root.className = prevClass;
      document.body.style.backgroundColor = prevBodyBg;
      if (createdMeta) themeMeta.remove();
      else if (prevThemeColor != null) themeMeta.setAttribute('content', prevThemeColor);
    };
  }, []);

  /* One scan event on mount. Attribution (`ref`) stays server-side. */
  useEffect(() => {
    if (scanFired) return;
    // Skip the build-time prerenderer (see scripts/prerender.mjs).
    if (typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent)) return;
    scanFired = true;
    recordScan({ ref: params.get('ref') || '', user_agent: navigator.userAgent });
  }, [params]);

  return (
    <div className="c4-welcome">
      {/* ─── Section 1 — Acknowledgement (above the fold) ─── */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="h-px w-7" style={{ backgroundColor: 'var(--w-red)' }} />
          <span
            className="text-[10px] uppercase tracking-[0.28em] font-medium"
            style={{ color: 'var(--w-ink-soft)' }}
          >
            C4 Studios · Perth
          </span>
          <span className="h-px w-7" style={{ backgroundColor: 'var(--w-red)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
          style={{ height: 'clamp(86px, 21vw, 128px)' }}
          className="mb-9"
        >
          <C4Mark size={128} className="h-full w-auto" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease }}
          className="text-[clamp(2rem,9vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.04em]"
          style={{ color: 'var(--w-ink)' }}
        >
          You found the card.
          <br />
          <span style={{ color: 'var(--w-red)' }}>Nice.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32, ease }}
          className="mt-5 max-w-[20rem] text-[14.5px] leading-[1.6]"
          style={{ color: 'var(--w-ink-soft)' }}
        >
          Perth web design &amp; development — C4 Studios.
        </motion.p>

        <motion.a
          href="#actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="c4-scroll-cue absolute bottom-8 flex flex-col items-center gap-1.5"
          style={{ color: 'var(--w-ink-soft)' }}
          aria-label="Scroll down"
        >
          <span className="text-[9.5px] uppercase tracking-[0.24em]">Scroll</span>
          <ArrowDown size={16} strokeWidth={1.6} />
        </motion.a>
      </section>

      {/* ─── Section 2 — The proof (frame-scrub, or live logo until rendered) ─── */}
      <section
        ref={scrubRef}
        className="relative"
        style={{ height: hasFrames ? '260vh' : 'auto' }}
      >
        <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Suspense fallback={<div className="h-full w-full" />}>
              <AvenueScrub
                scrollContainerRef={scrubRef}
                frameCount={AVENUE_FRAME_COUNT}
                framePath="/welcome/frames/avenue-"
                ext="webp"
              >
                {/* Poster / fallback: the live, tap-to-build C4 lockup. */}
                <div className="flex h-full w-full flex-col items-center justify-center gap-7">
                  <Suspense fallback={<C4Mark size={120} />}>
                    <C4Logo size={132} variant="full" context="header" />
                  </Suspense>
                  <span
                    className="text-[10px] uppercase tracking-[0.26em]"
                    style={{ color: 'var(--w-ink-soft)' }}
                  >
                    Tap the mark
                  </span>
                </div>
              </AvenueScrub>
            </Suspense>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease }}
            className="pointer-events-none absolute left-0 right-0 top-12 px-6 text-center"
          >
            <span
              className="text-[10px] uppercase tracking-[0.28em] font-medium"
              style={{ color: 'var(--w-ink-soft)' }}
            >
              Built live
            </span>
            <p
              className="mx-auto mt-3 max-w-[18rem] text-[clamp(1.15rem,5vw,1.5rem)] font-semibold leading-[1.2] tracking-[-0.03em]"
              style={{ color: 'var(--w-ink)' }}
            >
              The card was the teaser. This page is the studio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Section 3 — Three ranked actions ─── */}
      <section
        id="actions"
        className="relative flex min-h-[100svh] flex-col justify-center px-6 py-20"
      >
        <div className="mx-auto w-full max-w-[26rem]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.28em] font-medium"
              style={{ color: 'var(--w-ink-soft)' }}
            >
              What now
            </span>
            <h2
              className="mt-3 text-[clamp(1.6rem,7vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.035em]"
              style={{ color: 'var(--w-ink)' }}
            >
              Three ways to keep this going.
            </h2>
          </motion.div>

          <div className="mt-9 space-y-3">
            {/* 1 — Book a call (primary, highest contrast) */}
            <motion.button
              type="button"
              onClick={() => setBookingOpen(true)}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.05, ease }}
              whileTap={{ scale: 0.985 }}
              className="group flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left transition-transform duration-300"
              style={{ backgroundColor: 'var(--w-ink)', color: '#F3F2F3' }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <Phone size={18} strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15.5px] font-semibold tracking-[-0.01em]">
                  Book a call
                </span>
                <span className="block text-[12.5px] mt-0.5" style={{ color: 'rgba(243,242,243,0.72)' }}>
                  15-min chat · or lock in a price now
                </span>
              </span>
              <ArrowUpRight
                size={18}
                strokeWidth={1.8}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: 'rgba(243,242,243,0.7)' }}
              />
            </motion.button>

            {/* 2 — Save my contact (vCard download) */}
            <motion.a
              href="/caleb.vcf"
              download="Caleb Scott - C4 Studios.vcf"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.12, ease }}
              className="group flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left transition-transform duration-300 active:scale-[0.985]"
              style={{ backgroundColor: '#FFFFFF', color: 'var(--w-ink)', border: '1px solid var(--w-line)' }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(34,99,47,0.10)', color: 'var(--w-green)' }}
              >
                <Download size={18} strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15.5px] font-semibold tracking-[-0.01em]">
                  Save my contact
                </span>
                <span className="block text-[12.5px] mt-0.5" style={{ color: 'var(--w-ink-soft)' }}>
                  One tap — adds Caleb to your phone
                </span>
              </span>
            </motion.a>

            {/* 3 — See portfolio (ghost link) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.19, ease }}
              className="pt-1"
            >
              <Link
                to={createPageUrl('Portfolio')}
                className="group inline-flex items-center gap-2 px-1 py-2 text-[14px] font-medium"
                style={{ color: 'var(--w-ink-soft)' }}
              >
                See the portfolio
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.div>
          </div>

          {/* Contact strip — mirrors the card back */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="mt-12 border-t pt-6 text-[12px] leading-[1.8]"
            style={{ borderColor: 'var(--w-line)', color: 'var(--w-ink-soft)' }}
          >
            <a href="mailto:caleb@c4studios.com.au" className="hover:underline">
              caleb@c4studios.com.au
            </a>
            <span className="mx-2" style={{ color: 'var(--w-line)' }}>·</span>
            <a href="https://c4studios.com.au" className="hover:underline">
              c4studios.com.au
            </a>
            <span className="mx-2" style={{ color: 'var(--w-line)' }}>·</span>
            <span>Perth WA</span>
          </motion.div>
        </div>
      </section>

      {/* Booking sheet — lazy, only mounts when opened */}
      {bookingOpen && (
        <Suspense fallback={null}>
          <BookingSheet open={bookingOpen} onClose={() => setBookingOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
