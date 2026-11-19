/*
 * "Four logos we've handed over": the finished logo jobs on a turning ring,
 * between the shapes plate and the prices (19 Nov 2026, Caleb: "Wanted to add
 * this component somewhere to the site. was thinking maybe on the logo page
 * with case studies i've completed").
 *
 * The ring is the Warp Carousel (src/components/ui/warp-carousel.jsx, by
 * Louis Studios via 21st.dev), with each card painted from the job's own
 * logo file and colour codes. Every fact on it is in logoJobs.js with its
 * source.
 *
 * The words are in the DOM, not only on the canvas: the list under the ring
 * names each job, says what was handed over, gives the colour codes, and
 * turns the ring when picked. The prerendered page (and anyone without
 * JavaScript) gets the same list with the four logos laid flat on their own
 * grounds, in a box the same height as the ring, so nothing moves when the
 * ring takes over. A browser without WebGL2 gets the component's own 2D ring.
 *
 * Motion rules: the ring turns on its own every 4.5 seconds, holds while a
 * pointer is over it or focus is inside the section, stops for good once the
 * visitor turns it, and has a pause button (WCAG 2.2.2). Under reduced
 * motion it never turns on its own and a pick cross-fades.
 */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { Link } from '@/components/c4/SiteLink';
import { createPageUrl } from '@/utils';
import { PRERENDER, useHydrated } from '@/lib/hydration';
import { CARDS, JOBS } from './logoJobs';

/* The ring is fetched only when it mounts (after hydration, on this page), so
   it stays out of the main bundle every other page downloads. Until it
   arrives the flat plates hold its place. */
const WarpCarousel = lazy(() => import('@/components/ui/warp-carousel'));

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduced;
}

/* The ring paints its own ground, so it reads the section's: the bench in
   either theme, followed when the theme switch flips the class on <html>. */
function useGround(ref) {
  const [ground, setGround] = useState('#F7F5F2');
  useEffect(() => {
    const read = () => {
      if (!ref.current) return;
      const c = getComputedStyle(ref.current).backgroundColor;
      if (c && c !== 'rgba(0, 0, 0, 0)') setGround(c);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, [ref]);
  return ground;
}

/* The four logos laid flat on their own grounds: the prerendered page, a
   browser without JavaScript, and the moment before the ring arrives. */
function FlatPlates() {
  return (
    <ul className="ld-work-flat" aria-hidden="true">
      {JOBS.map((j) => (
        <li key={j.slug} className="ld-work-plate" style={{ background: j.ground }}>
          <img src={j.logo} alt="" width="200" height="120" loading="lazy" decoding="async" />
        </li>
      ))}
    </ul>
  );
}

export default function Work() {
  const hydrated = useHydrated();
  const live = hydrated && !PRERENDER;
  const sectionRef = useRef(null);
  const ground = useGround(sectionRef);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false); // the visitor has turned it
  const [paused, setPaused] = useState(false); // the pause button
  const [held, setHeld] = useState(false); // pointer over the ring, or focus inside

  const autoplay = live && !reduced && !paused && !touched && !held;
  const stageRef = useRef(null);
  const pick = (i) => {
    setTouched(true);
    setIndex(i);
    /* On a phone the list sits below the ring, and the ring stops turning while it's off
       screen. A pick is a wish to see that logo, so bring the ring back into view. */
    const stage = stageRef.current;
    if (stage) {
      const r = stage.getBoundingClientRect();
      const seen = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (seen < r.height * 0.6) stage.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    }
  };
  const onIndexChange = (i, cause) => {
    if (cause !== 'auto') setTouched(true);
    setIndex(i);
  };

  return (
    <section
      ref={sectionRef}
      className="ld-sec ld-work"
      id="work"
      aria-labelledby="ld-work-h"
      onFocus={() => setHeld(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false); }}
    >
      <div className="ld-frame">
        <div className="ld-work-head">
          <h2 className="ld-h2" id="ld-work-h">Four logos we’ve handed over</h2>
          <p className="ld-say">
            Each one started as a logo its owner already had. We redrew it as vector, so it stays sharp at any size,
            and handed over every version they’ll use.
          </p>
        </div>
      </div>

      <div
        ref={stageRef}
        className="ld-work-stage"
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHeld(true); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHeld(false); }}
      >
        {live ? (
          <Suspense fallback={<FlatPlates />}>
            <WarpCarousel
              cards={CARDS}
              index={index}
              onIndexChange={onIndexChange}
              autoplay={autoplay}
              interval={4.5}
              step={1}
              background={ground}
              ariaLabel="Four logo jobs on a turning ring. The left and right arrow keys turn it."
              announce={touched}
              className="ld-work-ring"
              style={{ minHeight: 0, aspectRatio: 'auto' }}
            />
          </Suspense>
        ) : (
          <FlatPlates />
        )}
      </div>

      <div className="ld-frame">
        <div className="ld-jobs-bar">
          <p className="ld-jobs-hint">{live ? 'Drag the ring, or pick one.' : 'Every logo here was handed over as vector files the owner keeps.'}</p>
          {live && !reduced && !touched ? (
            <button type="button" className="ld-jobs-pause" onClick={() => setPaused((p) => !p)}>
              {paused ? <Play size={14} strokeWidth={2} aria-hidden="true" /> : <Pause size={14} strokeWidth={2} aria-hidden="true" />}
              {paused ? 'Play' : 'Pause'}
            </button>
          ) : null}
        </div>
        <ol className="ld-jobs">
          {JOBS.map((j, i) => (
            <li key={j.slug} className={`ld-job${i === index ? ' is-front' : ''}`}>
              {/* only the name is the button, so it's a short thing to hear; the details follow it */}
              <button
                type="button"
                className="ld-job-pick"
                aria-current={i === index ? 'true' : undefined}
                onClick={() => pick(i)}
              >
                <span className="ld-job-name">{j.name}</span>
              </button>
              <p className="ld-job-what">{j.what}</p>
              <p className="ld-job-meta" data-fig="">{`${j.versions} versions · ${j.monthLong}`}</p>
              <p className="ld-job-colours" data-fig="">
                {j.swatches.map((s) => (
                  <span key={s.hex} className="ld-job-colour">
                    <span className="ld-job-chip" style={{ background: s.hex }} aria-hidden="true" />
                    <span className="sr-only">{`${s.name} `}</span>
                    {s.hex}
                  </span>
                ))}
              </p>
              {j.caseStudy ? (
                <Link className="ld-job-link" to={createPageUrl(`CaseStudy/${j.caseStudy}`)}>
                  Read the case study
                  <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                </Link>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
