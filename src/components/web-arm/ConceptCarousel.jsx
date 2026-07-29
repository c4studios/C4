/**
 * ConceptCarousel — the client-supplied 21st.dev 3D photo cylinder,
 * rebuilt for the gallery: five concept builds on a turning drum.
 *
 *   · Idles at a slow spin (3°/s), pauses under the pointer, and
 *     hands over to drag — pointer velocity carries through release
 *     with inertia, then the idle drift resumes.
 *   · Every face offers TWO links — the live deployment and its place
 *     in the portfolio (a case study, or the Concepts filter for the
 *     two without their own entry yet). A drag past 6px suppresses the
 *     click so spinning never misfires a navigation; a gentle release
 *     holds the drum still so both links are tappable on a phone.
 *   · Arrow keys rotate one face per press (the wrap is focusable).
 *   · staticMode / prefers-reduced-motion: the five render as a flat
 *     shelf — no cylinder, no rAF, nothing moves.
 *
 * Plain rAF drives the rotation (one transform write per frame on one
 * element) — no motion library needed at this size.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import cptBarrys from './assets/cpt-barrys.webp';
import cptWooster from './assets/cpt-wooster.webp';
import cptJk from './assets/cpt-jk.webp';
import cptVeer from './assets/cpt-veer.webp';
import cptIopa from './assets/cpt-iopa.webp';

/* Every concept offers TWO ways in: the live deployment, and its own
   case study in the portfolio. */
const CONCEPTS = [
  {
    key: 'barrys',
    name: "Barry's Drink",
    line: 'An RTD brand world with a physics-driven hero — grabbable, throwable 3D cans.',
    img: cptBarrys,
    live: 'https://barrys-drink-concept.vercel.app',
    portfolio: '/CaseStudy/barrys-drink',
    alt: "Barry's Drink concept site — floating drink cans over the brand hero.",
  },
  {
    key: 'wooster',
    name: 'Wooster Core',
    line: 'A storefront whose product 3D-prints itself in front of you, layer by layer.',
    img: cptWooster,
    live: 'https://wooster-henna.vercel.app',
    portfolio: '/CaseStudy/wooster-core',
    alt: 'Wooster Core concept storefront — WebGL FDM print hero.',
  },
  {
    key: 'jk',
    name: 'JK Plumbing',
    line: 'A lead-gen trade site built before any brief existed — and ready to book jobs.',
    img: cptJk,
    live: 'https://jk-plumbing-tau.vercel.app',
    portfolio: '/CaseStudy/jk-plumbing-solutions',
    alt: 'JK Plumbing concept site — licensed-trade lead generation hero.',
  },
  {
    key: 'veer',
    name: 'VEER',
    line: 'A bike turn-indicator you demo yourself — grab the 3D handlebar and steer to fire it.',
    img: cptVeer,
    live: 'https://veer-demo.netlify.app',
    portfolio: '/CaseStudy/veer',
    alt: 'VEER concept site — "Be seen from the side." over a 3D handlebar.',
  },
  {
    key: 'iopa',
    name: 'IOPA Apparel',
    line: 'Streetwear staged as a live broadcast — scroll-tune the whole site like a radio.',
    img: cptIopa,
    live: 'https://iopa-apparel.vercel.app',
    portfolio: '/CaseStudy/iopa',
    alt: 'IOPA Apparel concept site — CHOP LIFE hero over a dithered transmission orb.',
  },
];

const FACES = CONCEPTS.length;
const STEP = 360 / FACES;

const ExtIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function FaceCard({ item }) {
  const caseStudy = item.portfolio.startsWith('/CaseStudy');
  return (
    <div className="lv-cpt-card">
      <span className="lv-cpt-shot">
        <img src={item.img} width={800} height={500} loading="lazy" decoding="async" alt={item.alt} />
      </span>
      <span className="lv-cpt-meta">
        <span className="lv-cpt-name">{item.name}</span>
        <span className="lv-cpt-line">{item.line}</span>
        <span className="lv-cpt-actions">
          <a
            className="lv-cpt-act lv-cpt-act--live"
            href={item.live}
            target="_blank"
            rel="noopener noreferrer"
            draggable="false"
            data-cpt-link
            aria-label={`Open the live ${item.name} site in a new tab`}
          >
            Live site
            <ExtIcon />
          </a>
          <Link
            className="lv-cpt-act lv-cpt-act--folio"
            to={item.portfolio}
            draggable="false"
            data-cpt-link
            aria-label={caseStudy ? `Read the ${item.name} case study` : `See ${item.name} in the portfolio`}
          >
            {caseStudy ? 'Case study' : 'Portfolio'}
            <ArrowIcon />
          </Link>
        </span>
      </span>
    </div>
  );
}

export default function ConceptCarousel({ staticMode = false }) {
  const wrapRef = useRef(null);
  const cylRef = useRef(null);
  const [hinted, setHinted] = useState(false);
  /* On phones the drum can't work — five 78vw faces on a ~110px radius
     intersect each other. Mobile gets a native scroll-snap rail instead:
     one card per swipe, momentum and snapping owned by the OS. */
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 899.98px)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899.98px)');
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (staticMode || mobile) return undefined;
    const wrap = wrapRef.current;
    const cyl = cylRef.current;
    if (!wrap || !cyl) return undefined;
    const faces = [...cyl.querySelectorAll('.lv-cyl-face')];

    /* Geometry: faces sit on a drum whose radius comes from the wrap
       width, re-measured on resize. */
    let radius = 300;
    const measure = () => {
      const w = wrap.clientWidth || 1200;
      const circumference = Math.min(w * 1.85, 1780);
      radius = circumference / (2 * Math.PI);
      faces.forEach((face, i) => {
        face.style.transform = `translate(-50%, -50%) rotateY(${i * STEP}deg) translateZ(${radius}px)`;
      });
    };
    measure();

    let rot = 0;
    let vel = 0;
    let dragging = false;
    let hovering = false;
    let dragMoved = 0;
    let lastX = 0;
    let lastT = 0;
    let raf = 0;
    let prev = 0;
    /* After any touch the drum holds still for a beat, so the two action
       links are easy to hit on a phone (no hover to pause the drift). */
    let holdUntil = 0;

    const tick = (t) => {
      const dt = prev ? Math.min(0.05, (t - prev) / 1000) : 0.016;
      prev = t;
      if (!dragging) {
        if (Math.abs(vel) > 0.02) {
          rot += vel;
          vel *= 0.945; /* inertia decay */
        } else if (!hovering && t > holdUntil) {
          rot += 3 * dt; /* idle drift, °/s */
        }
      }
      cyl.style.transform = `rotate3d(0, 1, 0, ${rot}deg)`;
      /* Depth grading: the face turned toward the camera brightens and
         steps forward; the ones turning away dim — 5 style writes/frame. */
      faces.forEach((face, i) => {
        const facing = Math.cos(((rot + i * STEP) * Math.PI) / 180);
        face.style.setProperty('--facing', ((facing + 1) / 2).toFixed(3));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onDown = (e) => {
      dragging = true;
      dragMoved = 0;
      lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
      wrap.setAttribute('data-dragging', '');
      wrap.setPointerCapture?.(e.pointerId);
      setHinted(true); /* first touch retires the drag hint */
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const now = performance.now();
      rot += dx * 0.22;
      dragMoved += Math.abs(dx);
      /* Per-frame velocity in degrees, for release inertia. */
      const dtms = Math.max(8, now - lastT);
      vel = ((dx * 0.22) / dtms) * 16.7;
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = () => {
      dragging = false;
      wrap.removeAttribute('data-dragging');
      /* Hold the drum for a beat so the just-fronted card is tappable;
         a flung release keeps its inertia (vel) and overrides the hold. */
      if (Math.abs(vel) < 0.6) holdUntil = performance.now() + 2600;
    };
    /* A real drag must not fire the face link it ended on. */
    const onClickCapture = (e) => {
      if (dragMoved > 6 && e.target.closest('[data-cpt-link]')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        vel = 0;
        rot += STEP;
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        vel = 0;
        rot -= STEP;
        e.preventDefault();
      }
    };

    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerup', onUp);
    wrap.addEventListener('pointercancel', onUp);
    wrap.addEventListener('click', onClickCapture, true);
    wrap.addEventListener('pointerenter', onEnter);
    wrap.addEventListener('pointerleave', onLeave);
    wrap.addEventListener('keydown', onKey);
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerup', onUp);
      wrap.removeEventListener('pointercancel', onUp);
      wrap.removeEventListener('click', onClickCapture, true);
      wrap.removeEventListener('pointerenter', onEnter);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', measure);
    };
  }, [staticMode, mobile]);

  if (staticMode) {
    return (
      <div className="lv-cyl-flat">
        {CONCEPTS.map((item) => (
          <FaceCard item={item} key={item.key} />
        ))}
      </div>
    );
  }

  if (mobile) {
    return (
      <div className="lv-rail" role="group" aria-label="Concept builds — swipe through the shelf">
        <div className="lv-rail-track">
          {CONCEPTS.map((item) => (
            <div className="lv-rail-slide" key={item.key}>
              <FaceCard item={item} />
            </div>
          ))}
        </div>
        <p className="lv-rail-hint" aria-hidden="true">swipe · {CONCEPTS.length} concepts</p>
      </div>
    );
  }

  return (
    <div
      className="lv-cyl-wrap"
      ref={wrapRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Concept builds — drag to spin, arrow keys to rotate"
    >
      <div className="lv-cyl" ref={cylRef}>
        {CONCEPTS.map((item) => (
          <div className="lv-cyl-face" key={item.key}>
            <FaceCard item={item} />
          </div>
        ))}
      </div>
      <span className={`lv-cyl-hint${hinted ? ' is-done' : ''}`} aria-hidden="true">
        ↔ drag to spin
      </span>
    </div>
  );
}
