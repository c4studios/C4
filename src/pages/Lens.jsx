/**
 * C4 Lens (/Lens).
 *
 * Rebuilt for getting around on 23 Nov 2026. Caleb: "it's currently a very
 * awkward page to navigate for a customer." The scroll-pinned aperture hero,
 * its camera readouts, the shutter sound and the reticle cursor are gone. In
 * page order:
 *   - the bar across the top (LensNav.jsx): the sections, and a button
 *     straight to the start page
 *   - the hero (components/lens/hero/LensHero.jsx)
 *   - the work (LensWork.jsx), with a contact sheet of six projects, so the
 *     first photographs sit under the hero
 *   - the painted statement, "We exist to capture the [word] of your brand."
 *   - services, then packages
 *   - the ending, the Glyph Portal through the word LENS (#contact)
 * Every "Book" control goes to the start page. #contact stays for links
 * from elsewhere.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';
import { createPageUrl } from '@/utils';
import { usePrerendered } from '@/lib/hydration';
import { c4LensPackages } from '@/data/pricing';
import { createPaintStage } from '../components/lens/paintWord';
import GlyphPortal from '../components/ui/glyph-portal';
import LensNav from '../components/lens/LensNav';
import LensHero from '../components/lens/hero/LensHero';
import LensWork from '../components/lens/LensWork';
import { DSR, WORK_VIDEOS } from '../components/lens/lensStudies';
import { MOTION_FILMS } from '../components/lens/motionFilms';

import { reassertStoredTheme } from '../components/c4/ThemeContext';
import '../components/lens/lens.css';
import useDocumentHead from '@/hooks/useDocumentHead';
import { entitySchemas, serviceSchema, breadcrumbSchema, videoObjectSchema } from '@/lib/schema';
import { ORG_INFO } from '@/lib/seo';

const BOOK = `${createPageUrl('StartProject')}?service=lens`;

// Stable module-level ref so the head hook doesn't re-run each render. The
// service and every video name the business by @id, so it ships with them.
const LENS_JSONLD = [
  ...entitySchemas(),
  serviceSchema({
    name: 'C4 Lens — Photography & Videography',
    description:
      'Brand photography, videography, drone and aerial work, and motion graphics for Perth founders and businesses.',
    url: '/Lens',
    serviceType: 'Photography and videography',
  }),
  breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'C4 Lens', path: '/Lens' },
  ]),
  /* Every video in the case studies, from the same entries LensWork renders
     (lensStudies.js), so the schema can't name a file the page doesn't show. No
     person is named as the maker. */
  ...WORK_VIDEOS.map((v) => videoObjectSchema(v)),
  /* The two films from motionFilms.js: Aqua-Safe, and the DS Racing reel while
     it's in its study (DSR.reel in lensStudies.js). */
  ...MOTION_FILMS.filter((film) => film.id !== 'dsr' || DSR.reel).map((film) => {
    const lead = film.cuts[0];
    return videoObjectSchema({ ...film.schema, thumbnailUrl: lead.poster, contentUrl: lead.src });
  }),
];

/* ── Force dark mode ── */
function useForceDark() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark-mode');
    root.classList.remove('light-mode', 'vivid');
    return () => { reassertStoredTheme(); };
  }, []);
}

/* ── Data ── */
/* Each word is painted with a split-loaded brush: `col` over `col2`, turning
   through the middle of every stroke. Neon on the black (Caleb, 2 Oct 2026);
   `voice` was a lilac and is now a red-orange, so no violet is left. */
const WORDS = [
  { text: 'character', col: '#d6ff3a', col2: '#3ff8ff' },
  { text: 'essence',   col: '#ff3fa3', col2: '#ff8a1c' },
  { text: 'nature',    col: '#3ff8ff', col2: '#39ff6e' },
  { text: 'truth',     col: '#ff8a1c', col2: '#f7ff00' },
  { text: 'soul',      col: '#f7ff00', col2: '#ff3fa3' },
  { text: 'voice',     col: '#ff5a36', col2: '#ff3fa3' },
  { text: 'story',     col: '#3ff8ff', col2: '#ff3fa3' },
];

/* The pin threshold for the Glyph Portal ending: a shorter window gets the
   plain call to action. */
const PORTAL_ROOM = '(min-height: 461px)';

/* Package cards render from c4LensPackages (src/data/pricing.js) — the same
   source StartProject quotes from — so names, prices, order and the popular
   flag can't drift. The lines below are this page's abbreviated display copy
   for each package's canonical feature list; packages without an entry fall
   back to the pricing.js strings. Update both when inclusions change. */
const PKG_FEATURE_DISPLAY = {
  'mini-session': [
    <><strong>30-min</strong> shoot</>,
    '1 location',
    <><strong>5</strong> edited digital images</>,
    'Online gallery delivery',
  ],
  'portrait': [
    <><strong>1-hour</strong> shoot</>,
    '1 location',
    <><strong>15</strong> edited digital images</>,
    'Online gallery delivery',
  ],
  'business-branding': [
    <><strong>2-hour</strong> shoot</>,
    <>Up to <strong>2 locations</strong></>,
    <><strong>30</strong> edited digital images</>,
    'Headshots + workspace/lifestyle',
    'Online gallery delivery',
  ],
  'content-creation': [
    <><strong>Half-day</strong> shoot (4 hrs)</>,
    'Photo + video',
    <><strong>40</strong> edited photos</>,
    <><strong>2</strong> short-form videos (30–60s)</>,
    'Gallery + video delivery',
  ],
  'full-production': [
    <><strong>Full-day</strong> shoot (8 hrs)</>,
    'Photo + video',
    <><strong>60+</strong> edited photos</>,
    <><strong>4</strong> short-form + 1 long-form (3 min)</>,
    'Grade, sound, motion graphics',
    'Gallery + video delivery',
  ],
};

/* The static word is drawn into this by the effect below, so React leaves
   its inside alone: a prerendered page keeps the one it was captured with
   when it hydrates (15 Oct 2026), and a page the app draws itself starts it
   empty. */
const FILLED_BY_EFFECT = { __html: '' };

export default function Lens() {
  useForceDark();
  const year = usePrerendered('year', new Date().getFullYear());
  useDocumentHead({
    title: 'C4 Lens — Photography, Videography & Brand Content in Perth',
    description:
      'C4 Lens is the visual arm of C4 Studios — brand photography, videography, drone work and motion graphics for Perth founders and businesses.',
    path: '/Lens',
    jsonLd: LENS_JSONLD,
  });

  /* The ending is a Glyph Portal through the word LENS: a scroll-driven
     camera that dives through one letter into the call to action. It needs
     the display face frozen before it mounts, so it waits for Bebas Neue;
     the prerenderer and reduced-motion visitors get the plain section. */
  const staticRender = useMemo(
    () => typeof window !== 'undefined' && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || /Prerender/i.test(navigator.userAgent)),
    [],
  );
  const [portalReady, setPortalReady] = useState(false);
  useEffect(() => {
    if (staticRender) return undefined;
    let on = true;
    const done = () => { if (on) setPortalReady(true); };
    if (document.fonts && document.fonts.load) document.fonts.load('400 100px "Bebas Neue"').then(done, done); else done();
    return () => { on = false; };
  }, [staticRender]);
  /* The portal's camera needs a screen's height to travel through the letter;
     a window shorter than its pin threshold gets the plain call to action. */
  const [portalFits, setPortalFits] = useState(() => typeof window === 'undefined' || window.matchMedia(PORTAL_ROOM).matches);
  useEffect(() => {
    const mq = window.matchMedia(PORTAL_ROOM);
    const on = () => setPortalFits(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    /* Fonts: all four families (Bebas Neue, Geist, Geist Mono, Caveat) are
       self-hosted in src/styles/fonts.css and loaded globally via main.jsx. */

    /* The page's own black under everything, and the shared site header
       out of the way: this page has its own bar (LensNav.jsx). */
    const prevBodyBg = document.body.style.background;
    document.body.style.background = '#000';
    const siteHeader = document.querySelector('header.fixed');
    if (siteHeader) siteHeader.style.display = 'none';

    /* staticMode: the prerenderer and reduced motion both rest at the
       finished state. */
    const staticMode = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /Prerender/i.test(navigator.userAgent);
    const NS = 'http://www.w3.org/2000/svg';

    /* ═══ THE PAINT STAGE — "We exist to capture the [word] of your brand." ═══
       Live visitors get neon paint in a fluid (paintWord.js): each word is
       brushed in fast with a split-loaded brush, flecks fly, and a cursor or
       finger pushes the paint around. Prerender, reduced motion and devices
       without WebGL2 get the SVG word below, fully drawn in the same two
       colours, so the sentence is always complete in the static HTML. */
    function renderStaticWord() {
      const svgEl = document.getElementById('wordSvg');
      if (!svgEl || svgEl.childNodes.length) return;
      const word = WORDS[0];
      svgEl.setAttribute('viewBox', '0 -200 2000 400');
      const defs = document.createElementNS(NS, 'defs');
      const grad = document.createElementNS(NS, 'linearGradient');
      grad.setAttribute('id', 'wordSplit');
      grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
      grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
      for (const [off, col] of [['0.36', word.col], ['0.64', word.col2 || word.col]]) {
        const stop = document.createElementNS(NS, 'stop');
        stop.setAttribute('offset', off);
        stop.setAttribute('stop-color', col);
        grad.appendChild(stop);
      }
      defs.appendChild(grad);
      svgEl.appendChild(defs);
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', '0');
      t.setAttribute('class', 'svg-word-letter');
      t.textContent = word.text;
      t.style.fill = 'url(#wordSplit)';
      svgEl.appendChild(t);
      /* Fit the box to the ink, and again once Caveat is in: measured on the
         fallback face, the box came out wider than the word and the word sat
         left of centre. */
      const fit = () => {
        if (!svgEl.isConnected) return;
        const box = t.getBBox();
        const padX = 20, padY = 15;
        svgEl.setAttribute('viewBox', `${box.x - padX} ${box.y - padY} ${box.width + padX * 2} ${box.height + padY * 2}`);
      };
      fit();
      if (document.fonts && document.fonts.load) document.fonts.load("700 160px 'Caveat'").then(fit, () => {});
    }

    let stage = null;
    let capIO = null;
    const wordStage = document.getElementById('wordStage');
    /* The paint's field is the whole section, edge to edge: the canvas fills
       it, the pointer works anywhere in it, and the word stays in its stage. */
    const captureEl = document.getElementById('capture');
    const fallBack = () => {
      if (capIO) { capIO.disconnect(); capIO = null; }
      stage = null;
      if (wordStage) wordStage.classList.remove('is-live');
      if (captureEl) captureEl.classList.remove('is-live');
      renderStaticWord();
    };
    if (staticMode || !wordStage || !captureEl) {
      renderStaticWord();
    } else {
      wordStage.classList.add('is-live');
      captureEl.classList.add('is-live');
      stage = createPaintStage(wordStage, { words: WORDS, field: captureEl, onFail: fallBack });
      if (!stage) {
        fallBack();
      } else {
        /* The paint runs only while any of its section is on screen. */
        capIO = new IntersectionObserver((entries) => {
          if (!stage) return;
          if (entries[0].isIntersecting) stage.start(); else stage.stop();
        }, { threshold: 0 });
        capIO.observe(captureEl);
      }
    }

    /* ═══ SCROLL REVEALS ═══ */
    const revealEls = document.querySelectorAll('.lens-page .lr');
    let revealIO = null;
    if (staticMode) {
      revealEls.forEach(el => el.classList.add('in'));
    } else {
      revealIO = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            revealIO.unobserve(en.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -7% 0px' });
      revealEls.forEach(el => revealIO.observe(el));
    }

    return () => {
      if (stage) stage.destroy();
      if (revealIO) revealIO.disconnect();
      if (capIO) capIO.disconnect();
      document.body.style.background = prevBodyBg;
      if (siteHeader) siteHeader.style.display = '';
    };
  }, []);

  return (
    <div className="lens-page">
      <h1 className="lens-sr-only">C4 Lens — Photography, Videography &amp; Brand Content in Perth</h1>

      <LensNav />

      <LensHero />

      {/* THE WORK: a contact sheet of six projects, then nine case studies
          behind a button, film and photography first, then the motion built
          into client sites (LensWork.jsx, data in lensStudies.js). */}
      <LensWork />

      {/* ════════ WHAT WE CAPTURE — full-viewport paint canvas ════════ */}
      <section className="capture" id="capture">
        <div className="cap-inner">
          <div className="cap-header lr">
            <div className="cap-kicker">We don&rsquo;t photograph<br /><em>businesses.</em></div>
          </div>

          <div className="cap-stmt lr" style={{ '--lr-delay': '120ms' }}>
            <div className="cap-stmt-fixed">
              <span className="cap-stmt-label">We exist to capture the</span>
              <div className="word-stage" id="wordStage">
                {/* The painted word is drawn, so a screen reader would hear the
                    sentence with a hole in it; this fills the hole. */}
                <span className="lens-sr-only">{WORDS[0].text}</span>
                <svg id="wordSvg" className="word-svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true" dangerouslySetInnerHTML={FILLED_BY_EFFECT} suppressHydrationWarning />
              </div>
              <span className="cap-stmt-label">of your brand.</span>
            </div>
          </div>

        </div>
      </section>

      {/* ════════ SERVICES ════════ */}
      <section className="slab dark" id="services">
        <h2 className="lr" style={{ '--lr-delay': '80ms' }}>FIVE WAYS<br />TO BE <em>unforgettable.</em></h2>
        <div className="svc-grid">
          <div className="svc-card lr lr-fade">
            <div className="svc-tag">Photography</div>
            <h3>REPLACE STOCK<br />WITH PROOF.</h3>
            <div className="desc">Team portraits, the workspace as it actually is, product shots, and headshots that look like the person a client will meet.</div>
          </div>
          <div className="svc-card lr lr-fade" style={{ '--lr-delay': '90ms' }}>
            <div className="svc-tag">Videography</div>
            <h3>MOTION THAT<br />EARNS ATTENTION.</h3>
            <div className="desc">Brand films, social cuts, event coverage and founder pieces where the person behind the business does the talking.</div>
          </div>
          <div className="svc-card lr lr-fade" style={{ '--lr-delay': '180ms' }}>
            <div className="svc-tag">Drone &amp; Aerial</div>
            <h3>THE PERSPECTIVE<br />THEY&rsquo;VE NEVER SEEN.</h3>
            <div className="desc">Drone work for sites, events and construction, for the moments when a ground-level shot can&rsquo;t show the scale.</div>
          </div>
          <div className="svc-card lr lr-fade" style={{ '--lr-delay': '270ms' }}>
            <div className="svc-tag">Post-Production</div>
            <h3>CUT FOR THE<br />PLATFORM.</h3>
            <div className="desc">Reels, cutdowns and event highlights, graded and mixed in-house. Bring your own footage if you have it.</div>
          </div>
          <div className="svc-card lr lr-fade" style={{ '--lr-delay': '360ms' }}>
            <div className="svc-tag">Motion</div>
            <h3>MAKE THE SITE<br />MOVE.</h3>
            <div className="desc">Motion graphics for films and socials, and animation built into the website itself, drawn in code and running in the visitor&rsquo;s browser.</div>
          </div>
        </div>
      </section>

      {/* ════════ PACKAGES ════════
          On a phone (lens.css, under 641 px) each card is a compact row: the
          name and price, the first three lines run together, Select, and the
          full list behind "What's included". Both forms are in the markup and
          the stylesheet shows one, so nothing depends on the window size. */}
      <section className="slab mid" id="packages">
        <h2 className="lr" style={{ '--lr-delay': '80ms' }}>CLEAR SCOPE.<br /><em>No surprises.</em></h2>
        <div className="pkg-grid">
          {c4LensPackages.map((pkg, i) => {
            const lines = PKG_FEATURE_DISPLAY[pkg.key] ?? pkg.features;
            const amount = pkg.priceLabel.replace(/^\$/, '').replace(/\+$/, '');
            const plus = pkg.priceLabel.endsWith('+');
            return (
              <div
                key={pkg.key}
                className={`pkg-card${pkg.popular ? ' pop' : ''} lr lr-fade`}
                style={i ? { '--lr-delay': `${i * 80}ms` } : undefined}
              >
                {pkg.popular && <div className="pop-badge">Most popular</div>}
                <div className="pkg-top">
                  <h3>{pkg.name.toUpperCase()}</h3>
                  <div className="pkg-price">
                    <span className="cur">$</span>{amount}
                    {plus && <span className="pkg-plus">+</span>}
                  </div>
                </div>
                <div className="pkg-div"></div>
                <ul className="pkg-ul">
                  {lines.map((line, li) => <li key={li}>{line}</li>)}
                </ul>
                <p className="pkg-sum">
                  {lines.slice(0, 3).map((line, li) => (
                    <React.Fragment key={li}>{li ? ' · ' : null}{line}</React.Fragment>
                  ))}
                </p>
                <div className="pkg-cta">
                  <Link to={`${createPageUrl('StartProject')}?service=lens&package=${pkg.key}`} className={pkg.popular ? 'btn primary' : 'btn'}>
                    Select <span className="btn-arrow">→</span>
                  </Link>
                </div>
                <details className="pkg-more">
                  <summary>What&rsquo;s included</summary>
                  <ul className="pkg-ul">
                    {lines.map((line, li) => <li key={li}>{line}</li>)}
                  </ul>
                </details>
              </div>
            );
          })}
        </div>
        <p className="pkg-help lr">Not sure which one fits? <Link to={BOOK}>Tell us what you&rsquo;re making.</Link></p>
        <div className="pkg-note lr">
          <strong>All prices in AUD. No GST is added, as C4 Studios isn&rsquo;t registered for GST.</strong> Starting prices are based on the scope we agree. If the scope changes, we tell you straight away and pause until the revised price is agreed.<br />
          Professional services (legal, financial, medical) may carry a 15–20% surcharge, which we go through on the discovery call.
        </div>
      </section>

      {/* A profile section stood here until 15 Oct 2026. It came off at
          Caleb's call with no profile in its place, so the page names no
          one; the studio's About page says who does the work. Its About
          links in the nav and its styles went with it, and the ending below
          says "Tell us" where it said "Tell Caleb". */}

      {/* The ending: the word LENS, and a camera that goes through it. */}
      <div id="contact" className="lens-ending">
        {!staticRender && portalReady && portalFits ? (
          <GlyphPortal
            word="LENS"
            fontFamily="'Bebas Neue', 'Arial Black', Arial, sans-serif"
            fontWeight={400}
            scrollLength={1.5}
            interactive
            enterLabel="Skip to the end"
            className="lens-portal"
            style={{ '--gp-paper': '#000', '--gp-ink': '#f5f5f0', '--gp-field': '#e8a658', '--gp-foreground': '#0a0805' }}
            background={<div className="lens-portal-field" />}
            front={<p className="lens-portal-kick">Pick a letter, then scroll through it.</p>}
          >
            <div className="lens-portal-content">
              <h2>READY TO BE<br /><em>seen</em>?</h2>
              <p className="sub">Tell us what you&rsquo;re making and where the pictures need to end up.</p>
              <Link to={BOOK} className="btn lens-portal-btn">
                <span className="d"></span>Get in touch <span className="btn-arrow">→</span>
              </Link>
            </div>
          </GlyphPortal>
        ) : (
          <section className="cta-section">
            <h2 className="lr" style={{ '--lr-delay': '80ms' }}>READY TO BE<br /><em>seen</em>?</h2>
            <div className="sub lr" style={{ '--lr-delay': '150ms' }}>Tell us what you&rsquo;re making and where the pictures need to end up.</div>
            <div className="cta-btns lr" style={{ '--lr-delay': '220ms' }}>
              <Link to={BOOK} className="btn primary">
                <span className="d"></span>Get in touch <span className="btn-arrow">→</span>
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer>
        <div>
          <div className="foot-logo">C4 LENS</div>
          <div style={{ marginTop: '6px', color: 'var(--ink-2)' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>C4 Studios</Link> · Perth W.A. · © {year}
          </div>
        </div>
        {/* Right-aligned in lens.css, so the phone rule there can centre it.
            It was an inline style, which beat that rule. That didn't show
            while both lines were 24 characters; the ABN line is shorter. */}
        <div>
          {/* Published 15 Oct 2026, at Caleb's say-so (src/lib/seo.js). */}
          <div>ABN {ORG_INFO.abn}</div>
          <div style={{ marginTop: '6px', color: 'var(--ink-2)' }}>Perth, Western Australia</div>
        </div>
      </footer>

    </div>
  );
}
