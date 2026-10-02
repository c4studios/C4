/*
 * In motion: the client's real site on a laptop and a phone, scrolling in
 * step with the reader (Caleb, 2 Oct 2026). The screens show tall captures
 * of the live site (scroll strips from scripts/capture-motion.mjs); the stage
 * pins while the page moves through it, and each strip travels its own
 * length across that distance, so both devices reach the bottom together.
 *
 * "Try it live" swaps the phone's capture for the live site in a sandboxed
 * frame, scaled from a 390px phone viewport. It is offered only where the
 * site's own headers allow framing; otherwise there is the plain link out.
 *
 * Static first: under the prerender user agent or reduced motion nothing
 * pins or moves. The devices sit at the top of their captures and each
 * screen scrolls on its own.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useStaticMode from '@/hooks/useStaticMode';
import { hostOf, shortDate } from './portfolioMotion';
import './motion.css';

function LiveFrame({ url, name }) {
  const wrap = useRef(null);
  const [box, setBox] = useState({ scale: 0.5, height: 844 });
  const [loaded, setLoaded] = useState(false);
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const fit = () => {
      const scale = el.clientWidth / 390;
      setBox({ scale, height: Math.round(el.clientHeight / scale) });
    };
    fit();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    if (ro) ro.observe(el);
    return () => ro && ro.disconnect();
  }, []);
  return (
    <div ref={wrap} className="dv-live">
      {!loaded && <p className="dv-live-wait">Loading {hostOf(url)}…</p>}
      <iframe
        title={`${name}, the live site`}
        src={url}
        width="390"
        height={box.height}
        style={{ transform: `scale(${box.scale})` }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default function DeviceScroll({ study, motion }) {
  const staticMode = useStaticMode();
  const { desktop, mobile } = motion.scroll;
  const stageRef = useRef(null);
  const lapStrip = useRef(null);
  const lapScreen = useRef(null);
  const phoneStrip = useRef(null);
  const phoneScreen = useRef(null);
  const [live, setLive] = useState(false);
  const host = hostOf(motion.liveUrl);

  useEffect(() => {
    if (staticMode) return undefined;
    const stage = stageRef.current;
    if (!stage) return undefined;
    let raf = 0;
    let near = false;
    const pairs = [[lapStrip, lapScreen, desktop], [phoneStrip, phoneScreen, mobile]];
    const apply = () => {
      raf = 0;
      const r = stage.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
      for (const [stripRef, screenRef, meta] of pairs) {
        const strip = stripRef.current;
        const screen = screenRef.current;
        if (!strip || !screen) continue;
        /* What shows is the screen less any status band at its top. */
        const shown = screen.clientHeight - (parseFloat(getComputedStyle(screen).paddingTop) || 0);
        const run = Math.max(0, (screen.clientWidth * meta.h) / meta.w - shown);
        strip.style.transform = `translate3d(0, ${(-p * run).toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => { if (near && !raf) raf = requestAnimationFrame(apply); };
    /* Only listen while the stage is within a screen of the viewport. */
    const io = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) onScroll();
    }, { rootMargin: '100% 0px' });
    io.observe(stage);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    apply();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [staticMode, desktop, mobile, live]);

  return (
    <div ref={stageRef} className={`dv-stage${staticMode ? ' is-static' : ''}`}>
      <div className="dv-pin">
        <div className="dv-set">
          <figure className="dv-laptop">
            <div className="dv-lid">
              <span className="dv-cam" aria-hidden="true" />
              <div className="dv-screen" ref={lapScreen}>
                <img
                  ref={lapStrip}
                  className="dv-strip"
                  src={desktop.src}
                  width={desktop.w}
                  height={desktop.h}
                  alt={`${study.name}'s live site on a desktop screen, from the top of the home page down`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="dv-deck" aria-hidden="true"><span className="dv-notch" /></div>
          </figure>
          <figure className="dv-phone">
            <div className="dv-handset">
              <div className="dv-screen dv-screen--phone" ref={phoneScreen}>
                {live ? (
                  <LiveFrame url={motion.liveUrl} name={study.name} />
                ) : (
                  <img
                    ref={phoneStrip}
                    className="dv-strip"
                    src={mobile.src}
                    width={mobile.w}
                    height={mobile.h}
                    alt={`${study.name}'s live site on a phone, from the top of the home page down`}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <span className="dv-island" aria-hidden="true" />
            </div>
          </figure>
        </div>
        <div className="dv-meta">
          <p className="dv-note">Captured from {host} on {shortDate(motion.capturedOn)}</p>
          {motion.frameable ? (
            <button type="button" className="dv-try" aria-pressed={live} onClick={() => setLive((v) => !v)}>
              {live ? 'Back to the capture' : 'Try it live on the phone'}
            </button>
          ) : null}
          <a className="dv-open" href={motion.liveUrl} target="_blank" rel="noopener noreferrer">
            Open {host}<span aria-hidden="true"> ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
