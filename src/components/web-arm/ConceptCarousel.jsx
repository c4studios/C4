/**
 * ConceptCarousel — the client-supplied 21st.dev 3D photo cylinder,
 * rebuilt for the gallery: concept builds on a turning drum.
 *
 * Which concepts, 15 Oct 2026. Caleb picked the five he thinks are his
 * best: the WA Police Force concept, Barry's Drink, Wooster Core, S1XTEEN
 * and IOPA. A sixth face, "And more…", hands over to the full list on
 * /Portfolio. JK Plumbing, SGR Prestige, EuroChem and CMC Lawns stay on
 * the portfolio and are not shown here.
 *
 * What the faces may say. Every face has a Live site link. Only a concept
 * with a real case study entry (caseStudyData.jsx) gets a Case study link:
 * the WA Police and S1XTEEN concepts have none. Every face carries the
 * same notice: "Unofficial concept. Not affiliated with…" (S1XTEEN's own
 * site says "not made with or for", and its face keeps those words). Caleb
 * asked for the notice on all five on 15 Oct 2026. The Wooster and IOPA
 * concept sites don't carry one themselves yet; those are separate repos.
 * The police face shows the concept's header with the force's crest, which
 * Caleb asked for the same day ("yes crest can appear and should").
 *
 * Captures. Fresh 1440x900 screenshots of each live concept on
 * 15 Oct 2026, with installed Chrome (headless), cookie banners declined
 * and floating widgets hidden, reduced to 800x500 AVIF and WebP. The
 * police face is the content column from the top of the page: the
 * concept banner, the crest and name, the hero panel and the photo's
 * CC BY 2.0 credit line.
 *
 *   · Idles at a slow spin (3°/s), pauses under the pointer, and
 *     hands over to drag — pointer velocity carries through release
 *     with inertia, then the idle drift resumes.
 *   · A drag past 6px suppresses the click so spinning never misfires a
 *     navigation; a gentle release holds the drum still so the links are
 *     tappable on a phone.
 *   · Arrow keys rotate one face per press (the wrap is focusable), and
 *     tabbing into a face turns that face to the front, so focus never
 *     lands on a link turned away from the viewer.
 *   · staticMode / prefers-reduced-motion: a flat shelf — no cylinder,
 *     no rAF, nothing moves. Phones get a native scroll-snap rail.
 *
 * Plain rAF drives the rotation (one transform write per frame on one
 * element) — no motion library needed at this size.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@/components/c4/SiteLink';

import cptWapf from './assets/cpt-wapf.webp';
import cptWapfAvif from './assets/cpt-wapf.avif';
import cptBarrys from './assets/cpt-barrys.webp';
import cptBarrysAvif from './assets/cpt-barrys.avif';
import cptWooster from './assets/cpt-wooster.webp';
import cptWoosterAvif from './assets/cpt-wooster.avif';
import cptS1xteen from './assets/cpt-s1xteen.webp';
import cptS1xteenAvif from './assets/cpt-s1xteen.avif';
import cptIopa from './assets/cpt-iopa.webp';
import cptIopaAvif from './assets/cpt-iopa.avif';

const ALL_CONCEPTS = '/Portfolio?filter=concept';

const CONCEPTS = [
  {
    key: 'wapf',
    name: 'WA Police Force',
    standing: 'Unofficial concept. Not affiliated with WA Police.',
    line: 'A front door for WA Police services. Every number and link on it was taken from the official pages.',
    img: cptWapf,
    avif: cptWapfAvif,
    live: 'https://wapf-concept.vercel.app',
    caseStudy: null,
    alt: 'The unofficial WA Police Force concept: the concept banner and the force’s crest above a police motorcyclist at a street event, beside the line “Every way in, on one page.”',
  },
  {
    key: 'barrys',
    name: 'Barry’s Drink',
    /* Straight apostrophe: the tag is set in B612 Mono, whose curly one
       reads as a backtick at this size. */
    standing: "Unofficial concept. Not affiliated with Barry's Drink.",
    line: 'In Barry’s own campaign look: the founders up front, the logo as a giant sticker, one can in your hand at a time.',
    img: cptBarrys,
    avif: cptBarrysAvif,
    live: 'https://barrys-drink-concept.vercel.app',
    caseStudy: '/CaseStudy/barrys-drink',
    alt: 'The unofficial Barry’s Drink concept: three founders cut by white slashes, beside a cyan field and the Barry logo as a sticker.',
  },
  {
    key: 'wooster',
    name: 'Wooster Core',
    /* Arty Design makes the Wooster Core handle (the case study entry). */
    standing: 'Unofficial concept. Not affiliated with Arty Design.',
    line: 'A storefront built as the product’s own box. The lid is the hero, and a live 3D print is its line drawing.',
    img: cptWooster,
    avif: cptWoosterAvif,
    live: 'https://wooster-henna.vercel.app',
    caseStudy: '/CaseStudy/wooster-core',
    alt: 'The unofficial Wooster Core concept storefront: the kitesurf handle drawn as a 3D print in white lines on a charcoal box lid.',
  },
  {
    key: 's1xteen',
    name: 'S1XTEEN',
    standing: 'Unofficial concept. Not made with or for S1XTEEN.',
    line: 'A home for The S1XTEEN Show. A black-and-white cut of their own sessions and concert reels runs under the name.',
    img: cptS1xteen,
    avif: cptS1xteenAvif,
    live: 'https://s1xteen-concept.vercel.app',
    caseStudy: null,
    alt: 'The unofficial S1XTEEN concept: the S1XTEEN name over a black-and-white shot of a performer with both arms raised.',
  },
  {
    key: 'iopa',
    name: 'IOPA Apparel',
    standing: 'Unofficial concept. Not affiliated with IOPA.',
    line: 'Streetwear staged as a live broadcast. A tuner along the bottom edge scrubs the whole site like a radio dial.',
    img: cptIopa,
    avif: cptIopaAvif,
    live: 'https://iopa-apparel.vercel.app',
    caseStudy: '/CaseStudy/iopa',
    alt: 'The unofficial IOPA Apparel concept: “CHOP LIFE.” in bone type over a dithered transmission orb.',
  },
];

/* The five concepts and the "And more…" face. */
const FACES = CONCEPTS.length + 1;
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
  return (
    <div className="lv-cpt-card">
      <picture className="lv-cpt-shot">
        <source type="image/avif" srcSet={item.avif} />
        <img src={item.img} width={800} height={500} loading="lazy" decoding="async" alt={item.alt} />
      </picture>
      <span className="lv-cpt-meta">
        <span className="lv-cpt-name">{item.name}</span>
        <span className="lv-cpt-line">{item.line}</span>
        <span className="lv-cpt-tag">{item.standing}</span>
        <span className="lv-cpt-actions">
          <a
            className="lv-cpt-act lv-cpt-act--live"
            href={item.live}
            target="_blank"
            rel="noopener noreferrer"
            draggable="false"
            data-cpt-link
            aria-label={`Open the live ${item.name} concept in a new tab`}
          >
            Live site
            <ExtIcon />
          </a>
          {item.caseStudy && (
            <Link
              className="lv-cpt-act lv-cpt-act--folio"
              to={item.caseStudy}
              draggable="false"
              data-cpt-link
              aria-label={`Read the ${item.name} case study`}
            >
              Case study
              <ArrowIcon />
            </Link>
          )}
        </span>
      </span>
    </div>
  );
}

/* The sixth face: no screenshot, a hand-over to the full list. */
function MoreCard() {
  return (
    <div className="lv-cpt-card lv-cpt-card--more">
      <span className="lv-cpt-more">
        <span className="lv-cpt-more-word">And more…</span>
      </span>
      <span className="lv-cpt-meta">
        <span className="lv-cpt-name">More concepts</span>
        <span className="lv-cpt-line">The rest of the self-initiated builds are on the portfolio page, each with a case study.</span>
        <span className="lv-cpt-actions">
          <Link className="lv-cpt-act lv-cpt-act--live" to={ALL_CONCEPTS} draggable="false" data-cpt-link>
            Browse all concepts
            <ArrowIcon />
          </Link>
        </span>
      </span>
    </div>
  );
}

const renderFaces = (wrap) => [
  ...CONCEPTS.map((item) => wrap(<FaceCard item={item} />, item.key)),
  wrap(<MoreCard />, 'more'),
];

export default function ConceptCarousel({ staticMode = false }) {
  const wrapRef = useRef(null);
  const cylRef = useRef(null);
  const [hinted, setHinted] = useState(false);
  /* On phones the drum can't work — 78vw faces on a ~110px radius
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

    /* Geometry, from the cards outward. The drum's radius is whatever
       keeps neighbouring faces a gap apart at the rim, so faces never
       intersect; the stage height is the tallest face at its front-facing
       perspective scale plus the floor reflection, so the drum never rises
       into the heading or drops onto the note. Re-measured on resize. */
    const PERSPECTIVE = 1600;
    const GAP = 44;
    let radius = 300;
    let shift = 0;
    const cards = faces.map((f) => f.querySelector('.lv-cpt-card')).filter(Boolean);
    const measure = () => {
      /* Every face as tall as the tallest, so the drum reads as one
         object and the buttons sit on one line round it. */
      cards.forEach((c) => {
        c.style.height = '';
      });
      const ch = Math.max(...cards.map((c) => c.offsetHeight), 0);
      cards.forEach((c) => {
        c.style.height = `${ch}px`;
      });
      const card = cards[0];
      const cw = card?.offsetWidth || 300;
      radius = (cw + GAP) / (2 * Math.sin(Math.PI / FACES));
      const fh = Math.max(...faces.map((f) => f.offsetHeight || 0), 320);
      const frontScale = PERSPECTIVE / (PERSPECTIVE - radius);
      const reflection = 14 + fh * 0.32;
      shift = -Math.round((reflection * frontScale) / 2);
      wrap.style.height = `${Math.round((fh + reflection) * frontScale + 28)}px`;
      faces.forEach((face, i) => {
        face.style.transform = `translate(-50%, -50%) rotateY(${i * STEP}deg) translateZ(${radius}px)`;
      });
    };
    measure();
    /* Archivo landing late can rewrap a line; measure again once it has. */
    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => alive && measure()).catch(() => {});
    }

    let rot = 0;
    let vel = 0;
    let dragging = false;
    let hovering = false;
    let focused = false;
    let dragMoved = 0;
    let lastX = 0;
    let lastT = 0;
    let raf = 0;
    let prev = 0;
    /* After any touch the drum holds still for a beat, so the action
       links are easy to hit on a phone (no hover to pause the drift). */
    let holdUntil = 0;
    /* A face turned to the front by the keyboard eases there. */
    let target = null;

    const tick = (t) => {
      const dt = prev ? Math.min(0.05, (t - prev) / 1000) : 0.016;
      prev = t;
      if (!dragging) {
        if (target !== null) {
          const d = target - rot;
          rot += d * Math.min(1, dt * 9);
          if (Math.abs(d) < 0.05) {
            rot = target;
            target = null;
          }
        } else if (Math.abs(vel) > 0.02) {
          rot += vel;
          vel *= 0.945; /* inertia decay */
        } else if (!hovering && !focused && t > holdUntil) {
          rot += 3 * dt; /* idle drift, °/s */
        }
      }
      cyl.style.transform = `translateY(${shift}px) rotate3d(0, 1, 0, ${rot}deg)`;
      /* Depth grading: the face turned toward the camera brightens and
         steps forward; the ones turning away dim — one style write per face. */
      faces.forEach((face, i) => {
        const facing = Math.cos(((rot + i * STEP) * Math.PI) / 180);
        face.style.setProperty('--facing', ((facing + 1) / 2).toFixed(3));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* The rotation that puts face i at the front, nearest the current one. */
    const frontFor = (i) => {
      const base = -i * STEP;
      return base + 360 * Math.round((rot - base) / 360);
    };

    const onDown = (e) => {
      dragging = true;
      target = null;
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
        target = (target ?? rot) + STEP;
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        vel = 0;
        target = (target ?? rot) - STEP;
        e.preventDefault();
      }
    };
    /* Tab into a face and it turns to the front, then holds there. */
    const onFocusIn = (e) => {
      focused = true;
      const face = e.target.closest('.lv-cyl-face');
      if (!face) return;
      const i = faces.indexOf(face);
      if (i < 0) return;
      vel = 0;
      target = frontFor(i);
    };
    const onFocusOut = (e) => {
      if (!wrap.contains(e.relatedTarget)) {
        focused = false;
        holdUntil = performance.now() + 1500;
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
    wrap.addEventListener('focusin', onFocusIn);
    wrap.addEventListener('focusout', onFocusOut);
    window.addEventListener('resize', measure);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerup', onUp);
      wrap.removeEventListener('pointercancel', onUp);
      wrap.removeEventListener('click', onClickCapture, true);
      wrap.removeEventListener('pointerenter', onEnter);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('keydown', onKey);
      wrap.removeEventListener('focusin', onFocusIn);
      wrap.removeEventListener('focusout', onFocusOut);
      window.removeEventListener('resize', measure);
    };
  }, [staticMode, mobile]);

  if (staticMode) {
    return <div className="lv-cyl-flat">{renderFaces((card, key) => <React.Fragment key={key}>{card}</React.Fragment>)}</div>;
  }

  if (mobile) {
    return (
      <div className="lv-rail" role="group" aria-label="Concept builds. Swipe through the shelf">
        {/* Tab onto a card's link and the whole card slides into the
            middle; the browser alone only nudged the link's own edge in. */}
        <div
          className="lv-rail-track"
          onFocus={(e) => {
            const slide = e.target.closest('.lv-rail-slide');
            if (slide) slide.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
          }}
        >
          {renderFaces((card, key) => (
            <div className="lv-rail-slide" key={key}>
              {card}
            </div>
          ))}
        </div>
        <p className="lv-rail-hint" aria-hidden="true">Swipe through the shelf</p>
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
      aria-label="Concept builds. Drag to turn the shelf, or use the arrow keys"
    >
      <div className="lv-cyl" ref={cylRef}>
        {renderFaces((card, key) => (
          <div className="lv-cyl-face" key={key}>
            {card}
          </div>
        ))}
      </div>
      <span className={`lv-cyl-hint${hinted ? ' is-done' : ''}`} aria-hidden="true">
        Drag to turn the shelf
      </span>
    </div>
  );
}
