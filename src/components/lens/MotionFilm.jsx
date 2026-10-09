/**
 * MotionFilm: one film in the motion section of /Lens.
 *
 * The film plays muted, on loop, while at least half of it is on screen, and
 * pauses when it leaves. The loop starts on the poster's own frame, so the
 * still hands over to the film without a jump. "Watch with sound" starts it
 * again from the top with sound, and so does a click or tap on the playing
 * film; while it is being watched, a click pauses it. One film has sound at a
 * time, and a film with sound pauses when it leaves the screen instead of
 * playing on unseen. While it waits for frames the picture goes soft, the way
 * a lens hunts before it locks; the corners lock on in amber once it plays.
 *
 * Under reduced motion, the prerenderer or Save-Data nothing plays by itself:
 * the poster stands with a play button, and every control still works.
 *
 * The scrubber runs over the film's colour strip (scripts/lens-motion.mjs):
 * every frame of the film averaged to one column. The part already played
 * shows at full colour and the rest waits under a shade, so the strip is a
 * progress bar made of the film itself.
 *
 * Two switches for the case studies (LensWork.jsx, 9 Oct 2026). `bare` drops
 * the slate, because the study around the film carries its own words; the
 * film's "What's on screen" list stays unless `showWords` is false. `silent`
 * is for a cut with no soundtrack: no sound button, and a click on the
 * playing film pauses it. The poster and the strip are only given their
 * files once the film is a screen away, so nothing here loads with the top of
 * the page. The prerendered HTML carries neither: a browser parsing that HTML
 * fetched a lazy poster near the top before the app took over (9 Oct 2026).
 */
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Link } from '@/components/c4/SiteLink';
import useStaticMode from '@/hooks/useStaticMode';


/* One film with sound at a time. Taking the sound mutes and pauses the others;
   letting it go lets them pick up again if they are still on screen. */
const soundBus = typeof window !== 'undefined' ? new EventTarget() : null;
const shout = (type, id) => { if (soundBus) soundBus.dispatchEvent(new CustomEvent(type, { detail: id })); };

export function clock(t) {
  const s = Math.max(0, Math.floor(t || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function pickCut(cuts) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 0;
  const i = cuts.findIndex((c) => !c.media || window.matchMedia(c.media).matches);
  return i < 0 ? cuts.length - 1 : i;
}

function wantsLessData() {
  try { return Boolean(navigator.connection && navigator.connection.saveData); } catch { return false; }
}

/* The film's text alternative: every word it shows, in order, with the second
   it lands. Closed by default, and in the static HTML either way. Exported so
   a study can set it beside the film instead of under it. */
export function FilmWords({ film, className = '' }) {
  if (!film.words || film.words.length === 0) return null;
  return (
    <details className={`mo-words ${className}`.trim()}>
      <summary>
        What&rsquo;s on screen<span className="lens-sr-only">: {film.short} film</span>
      </summary>
      <ol>
        {film.words.map((w) => (
          <li key={`${w.t}-${w.say || w.scene}`} className={w.scene ? 'is-scene' : undefined}>
            <span className="mo-tc">{clock(w.t)}</span>
            <span className="mo-line">{w.scene ? `[${w.scene}]` : w.say}</span>
          </li>
        ))}
      </ol>
    </details>
  );
}

const STEP = 2;   // seconds per arrow key on the scrubber
const PAGE = 10;  // seconds per Page Up / Page Down

export default function MotionFilm({ film, layout = 'wide', bare = false, silent = false, showWords = true, label, describedBy }) {
  const staticMode = useStaticMode();
  const noAuto = useMemo(() => staticMode || wantsLessData(), [staticMode]);
  const [near, setNear] = useState(false);           // within a screen: the poster and strip may load
  const [cutIndex, setCutIndex] = useState(() => pickCut(film.cuts));
  const cut = film.cuts[cutIndex] || film.cuts[0];
  const fallbackCut = film.cuts[film.cuts.length - 1];

  const [mode, setMode] = useState('ambient');      // 'ambient' (muted loop) | 'watch' (sound)
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);    // a real frame is on screen; the poster can go
  const [userPaused, setUserPaused] = useState(false);
  const [blocked, setBlocked] = useState(false);    // the browser refused to autoplay
  const [waiting, setWaiting] = useState(false);    // asked to play, no frames yet: the lens hunts
  const [failed, setFailed] = useState(false);
  const [duration, setDuration] = useState(film.duration);

  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const transportRef = useRef(null);
  const rangeRef = useRef(null);
  const timeRef = useRef(null);
  /* Live state for listeners, so none of them reads a stale render. */
  const st = useRef({
    mode: 'ambient', inView: false, manual: false, held: false, started: false,
    dragging: false, tabPaused: false, raf: 0, lastSec: -1, switchFrom: null,
  });

  const uid = useId();
  const titleId = `mo-title-${uid}`;
  const descId = `mo-desc-${uid}`;

  /* ── Draw the playhead, the shade, the clock and the slider's value ── */
  const paint = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const s = st.current;
    const d = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : film.duration;
    const t = v.currentTime || 0;
    if (transportRef.current) transportRef.current.style.setProperty('--mo-t', Math.min(1, t / d).toFixed(4));
    if (rangeRef.current && !s.dragging) rangeRef.current.value = String(t);
    const sec = Math.floor(t);
    if (sec !== s.lastSec) {
      s.lastSec = sec;
      /* Write into React's own text node rather than replacing it. */
      const clockText = timeRef.current && timeRef.current.firstChild;
      if (clockText) clockText.nodeValue = clock(t);
      if (rangeRef.current) rangeRef.current.setAttribute('aria-valuetext', `${clock(t)} of ${clock(d)}`);
    }
  }, [film.duration]);

  const startLoop = useCallback(() => {
    const s = st.current;
    if (s.raf) return;
    const tick = () => { paint(); s.raf = requestAnimationFrame(tick); };
    s.raf = requestAnimationFrame(tick);
  }, [paint]);

  const stopLoop = useCallback(() => {
    const s = st.current;
    cancelAnimationFrame(s.raf);
    s.raf = 0;
    paint();
  }, [paint]);

  /* ── Playing, in either mode ── */
  const play = useCallback((fromUser = false) => {
    const v = videoRef.current;
    if (!v) return;
    const s = st.current;
    if (s.mode === 'ambient') {
      v.muted = true;
      v.loop = !noAuto;
      if (!s.started && v.currentTime < 0.05) {
        /* The muted loop picks up on the poster's frame; a visitor who presses
           play gets the film from the top. */
        try { v.currentTime = fromUser ? 0 : film.posterTime || 0; } catch { /* not seekable yet */ }
      }
    }
    if (v.paused) setWaiting(true);
    const p = v.play();
    if (p && p.catch) {
      p.catch((err) => {
        setWaiting(false);
        if (err && err.name === 'NotAllowedError') setBlocked(true);
      });
    }
  }, [film.posterTime, noAuto]);

  const enterWatch = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const s = st.current;
    shout('take', film.id);
    s.mode = 'watch';
    s.manual = false;
    s.held = false;
    setMode('watch');
    setUserPaused(false);
    v.loop = false;
    v.muted = false;
    try { v.currentTime = 0; } catch { /* not seekable yet */ }
    play(true);
  }, [film.id, play]);

  const leaveWatch = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    st.current.mode = 'ambient';
    setMode('ambient');
    v.muted = true;
    v.loop = !noAuto;
    shout('release', film.id);
  }, [film.id, noAuto]);

  /* ── The element: muted from the start, and every event it fires ── */
  useEffect(() => {
    const v = videoRef.current;
    const stage = stageRef.current;
    if (!v || !stage) return undefined;
    const s = st.current;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');

    const markStarted = () => {
      if (!s.started) { s.started = true; setStarted(true); }
    };
    const onPlaying = () => { setPlaying(true); setBlocked(false); setWaiting(false); markStarted(); startLoop(); };
    const onPause = () => { setPlaying(false); setWaiting(false); stopLoop(); };
    /* Out of data mid-play: the picture softens until frames arrive again. */
    const onWaiting = () => { if (!v.paused) setWaiting(true); };
    const onSeeked = () => { if (v.readyState >= 2) markStarted(); paint(); };
    const onMeta = () => {
      if (Number.isFinite(v.duration) && v.duration > 0) setDuration(v.duration);
      s.lastSec = -1;
      if (s.switchFrom) {
        const { t, wasPlaying } = s.switchFrom;
        s.switchFrom = null;
        try { v.currentTime = t; } catch { /* ignore */ }
        if (wasPlaying) play();
      }
      paint();
    };
    const onEnded = () => {
      if (s.mode === 'watch') {
        s.mode = 'ambient';
        setMode('ambient');
        v.muted = true;
        v.loop = !noAuto;
        shout('release', film.id);
        if (!noAuto && s.inView && !s.manual) {
          try { v.currentTime = 0; } catch { /* ignore */ }
          play();
        }
      }
      paint();
    };
    /* Native controls in full screen can unmute or mute the film; follow them. */
    const onVolume = () => {
      if (!v.muted && s.mode === 'ambient') {
        s.mode = 'watch';
        setMode('watch');
        v.loop = false;
        shout('take', film.id);
      } else if (v.muted && s.mode === 'watch') {
        s.mode = 'ambient';
        setMode('ambient');
        v.loop = !noAuto;
        shout('release', film.id);
      }
    };
    const onError = () => { if (v.error) { setFailed(true); setWaiting(false); } };

    v.addEventListener('playing', onPlaying);
    v.addEventListener('pause', onPause);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('seeked', onSeeked);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('ended', onEnded);
    v.addEventListener('volumechange', onVolume);
    v.addEventListener('error', onError);

    /* Another film took the sound, or gave it back. */
    const onTake = (e) => {
      if (e.detail === film.id) return;
      if (s.mode === 'watch') {
        s.mode = 'ambient';
        setMode('ambient');
        v.muted = true;
        v.loop = !noAuto;
      }
      if (!v.paused) { s.held = true; v.pause(); }
    };
    const onRelease = (e) => {
      if (e.detail === film.id || !s.held) return;
      s.held = false;
      if (s.inView && !s.manual && !noAuto && s.mode === 'ambient') play();
    };
    if (soundBus) {
      soundBus.addEventListener('take', onTake);
      soundBus.addEventListener('release', onRelease);
    }

    /* Plays while half of it is on screen; fetches its header a screen early. */
    let near = null;
    const io = new IntersectionObserver(([entry]) => {
      /* A fast jump can land here before the near observer has fired, so the
         view observer hands over the poster file too. */
      if (entry.isIntersecting) setNear(true);
      const vis = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      if (vis === s.inView) return;
      s.inView = vis;
      if (vis) {
        if (s.mode === 'ambient' && !s.manual && !s.held && !noAuto && !document.hidden) play();
      } else {
        s.held = false;
        if (!v.paused) v.pause();
      }
    }, { threshold: [0, 0.5, 1] });
    io.observe(stage);
    near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setNear(true);
      if (!noAuto && v.preload === 'none') v.preload = 'metadata';
      near.disconnect();
    }, { rootMargin: '100% 0px' });
    near.observe(stage);

    /* A hidden tab pauses the muted loop; a film being watched keeps playing. */
    const onVisibility = () => {
      if (document.hidden) {
        if (!v.paused && s.mode === 'ambient') { s.tabPaused = true; v.pause(); }
      } else if (s.tabPaused) {
        s.tabPaused = false;
        if (s.inView && !s.manual && !s.held && !noAuto) play();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    /* Full screen hands over to the browser's own controls. */
    const onFullscreen = () => { v.controls = document.fullscreenElement === v || document.webkitFullscreenElement === v; };
    const onBeginIos = () => { v.controls = true; };
    const onEndIos = () => { v.controls = false; };
    document.addEventListener('fullscreenchange', onFullscreen);
    document.addEventListener('webkitfullscreenchange', onFullscreen);
    v.addEventListener('webkitbeginfullscreen', onBeginIos);
    v.addEventListener('webkitendfullscreen', onEndIos);

    paint();

    return () => {
      io.disconnect();
      if (near) near.disconnect();
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('seeked', onSeeked);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('volumechange', onVolume);
      v.removeEventListener('error', onError);
      v.removeEventListener('webkitbeginfullscreen', onBeginIos);
      v.removeEventListener('webkitendfullscreen', onEndIos);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('fullscreenchange', onFullscreen);
      document.removeEventListener('webkitfullscreenchange', onFullscreen);
      if (soundBus) {
        soundBus.removeEventListener('take', onTake);
        soundBus.removeEventListener('release', onRelease);
      }
      if (s.mode === 'watch') shout('release', film.id);
      try { v.pause(); } catch { /* ignore */ }
    };
  }, [film.id, noAuto, paint, play, startLoop, stopLoop]);

  /* ── A window that crosses the breakpoint swaps the cut and keeps its place ── */
  useEffect(() => {
    if (film.cuts.length < 2 || typeof window.matchMedia !== 'function') return undefined;
    const queries = film.cuts.filter((c) => c.media).map((c) => window.matchMedia(c.media));
    const onChange = () => {
      const next = pickCut(film.cuts);
      setCutIndex((prev) => {
        if (prev === next) return prev;
        const v = videoRef.current;
        if (v && st.current.started) st.current.switchFrom = { t: v.currentTime, wasPlaying: !v.paused };
        return next;
      });
    };
    queries.forEach((q) => q.addEventListener('change', onChange));
    return () => queries.forEach((q) => q.removeEventListener('change', onChange));
  }, [film.cuts]);

  /* ── Controls ── */
  const onPlayPause = () => {
    const v = videoRef.current;
    if (!v || failed) return;
    const s = st.current;
    if (!v.paused) {
      s.manual = true;
      setUserPaused(true);
      v.pause();
    } else {
      s.manual = false;
      s.held = false;
      setUserPaused(false);
      play(true);
    }
  };

  const onSound = () => {
    if (failed) return;
    if (st.current.mode === 'watch') leaveWatch(); else enterWatch();
  };

  /* A click or tap on the playing film: the muted loop takes the sound from
     the top, and a film being watched pauses. A silent cut just pauses.
     Keyboards use the transport. */
  const onStageClick = () => {
    if (failed) return;
    if (silent || st.current.mode === 'watch') onPlayPause(); else enterWatch();
  };

  const onFullscreen = () => {
    const v = videoRef.current;
    if (!v || failed) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      return;
    }
    const enter = v.requestFullscreen || v.webkitRequestFullscreen;
    if (enter) {
      const p = enter.call(v);
      if (p && p.catch) p.catch(() => {});
    } else if (v.webkitEnterFullscreen) {
      v.webkitEnterFullscreen();
    }
    if (v.paused) {
      st.current.manual = false;
      setUserPaused(false);
      play(true);
    }
  };

  const seekTo = (t) => {
    const v = videoRef.current;
    if (!v || failed) return;
    const d = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : film.duration;
    const to = Math.max(0, Math.min(d - 0.05, t));
    if (v.readyState === 0 && v.networkState !== 2) {
      v.preload = 'auto';
      try { v.load(); } catch { /* ignore */ }
    }
    try { v.currentTime = to; } catch { /* ignore */ }
    paint();
  };

  const onKeyDown = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const t = v.currentTime || 0;
    const d = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : film.duration;
    const jumps = {
      ArrowRight: t + STEP, ArrowUp: t + STEP, ArrowLeft: t - STEP, ArrowDown: t - STEP,
      PageUp: t + PAGE, PageDown: t - PAGE, Home: 0, End: d,
    };
    if (!(e.key in jumps)) return;
    e.preventDefault();
    seekTo(jumps[e.key]);
  };

  const showPlay = !playing && !failed && (noAuto || userPaused || blocked || mode === 'watch');
  const watching = mode === 'watch';
  const stageClass = [
    'mo-stage',
    started ? 'is-started' : '',
    playing ? 'is-playing' : '',
    watching ? 'is-sound' : '',
    waiting ? 'is-waiting' : '',
  ].filter(Boolean).join(' ');

  const deck = (
    <div className="mo-deck">
      <div className={stageClass} ref={stageRef}>
        <video
          ref={videoRef}
          className="mo-video"
          src={cut.src}
          preload="none"
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-label={label || `${film.client}, ${film.kind.toLowerCase()}`}
          aria-describedby={bare ? describedBy : descId}
        />
        <picture className="mo-poster" aria-hidden="true">
          {film.cuts.filter((c) => c.media).map((c) => (
            <source key={c.poster} media={c.media} srcSet={near ? c.poster : undefined} width={c.width} height={c.height} />
          ))}
          <img src={near ? fallbackCut.poster : undefined} width={fallbackCut.width} height={fallbackCut.height} alt="" loading="lazy" decoding="async" />
        </picture>
        <span className="mo-corner mo-corner--tl" aria-hidden="true" />
        <span className="mo-corner mo-corner--tr" aria-hidden="true" />
        <span className="mo-corner mo-corner--bl" aria-hidden="true" />
        <span className="mo-corner mo-corner--br" aria-hidden="true" />
        {/* Big targets for a pointer or a finger: the whole film while it
            plays, and the play mark while it is still. Keyboards and screen
            readers use the transport under the strip, so these stay out of
            the tab order. The play mark sits inside the viewfinder's own
            four corners. */}
        {playing && !failed && (
          <button type="button" className="mo-hit" onClick={onStageClick} tabIndex={-1} aria-hidden="true" />
        )}
        {showPlay && (
          <button type="button" className="mo-play" onClick={onPlayPause} tabIndex={-1} aria-hidden="true">
            <svg viewBox="0 0 72 72" width="72" height="72" fill="none" focusable="false">
              <path d="M1 17V1h16M55 1h16v16M71 55v16H55M17 71H1V55" stroke="currentColor" strokeWidth="1.5" />
              <path d="M29 23.5 50 36 29 48.5Z" fill="currentColor" />
            </svg>
          </button>
        )}
      </div>

      <div className="mo-transport" ref={transportRef} style={{ '--mo-t': 0 }}>
        <div className="mo-strip">
          <picture className="mo-strip-film" aria-hidden="true">
            {film.cuts.filter((c) => c.media).map((c) => (
              <source key={c.strip} media={c.media} srcSet={near ? c.strip : undefined} />
            ))}
            <img src={near ? fallbackCut.strip : undefined} alt="" loading="lazy" decoding="async" />
          </picture>
          <span className="mo-shade" aria-hidden="true" />
          <input
            ref={rangeRef}
            className="mo-range"
            type="range"
            min="0"
            max={duration}
            step="any"
            defaultValue="0"
            disabled={failed}
            aria-label={`${film.short} film timeline`}
            aria-valuetext={`0:00 of ${clock(duration)}`}
            onInput={(e) => seekTo(Number(e.currentTarget.value))}
            onKeyDown={onKeyDown}
            onPointerDown={() => { st.current.dragging = true; }}
            onPointerUp={() => { st.current.dragging = false; paint(); }}
            onPointerCancel={() => { st.current.dragging = false; }}
          />
        </div>
        <div className="mo-controls">
          <button
            type="button"
            className="mo-btn mo-btn--icon"
            onClick={onPlayPause}
            disabled={failed}
            aria-label={playing ? `Pause the ${film.short} film` : `Play the ${film.short} film`}
          >
            {playing
              ? <Pause aria-hidden="true" size={16} strokeWidth={1.5} fill="currentColor" />
              : <Play aria-hidden="true" size={16} strokeWidth={1.5} fill="currentColor" />}
          </button>
          <span className="mo-time" aria-hidden="true">
            <span ref={timeRef}>0:00</span>
            <span className="mo-total">{` / ${clock(duration)}`}</span>
          </span>
          <span className="mo-gap" />
          {!silent && (
            <button
              type="button"
              className={`mo-btn mo-btn--sound${watching ? ' is-on' : ''}`}
              onClick={onSound}
              disabled={failed}
            >
              {watching
                ? <VolumeX aria-hidden="true" size={16} strokeWidth={1.5} />
                : <Volume2 aria-hidden="true" size={16} strokeWidth={1.5} />}
              <span>{watching ? 'Sound off' : 'Watch with sound'}</span>
              <span className="lens-sr-only">: {film.short}</span>
            </button>
          )}
          <button
            type="button"
            className="mo-btn mo-btn--icon"
            onClick={onFullscreen}
            disabled={failed}
            aria-label={`Watch the ${film.short} film full screen`}
          >
            <Maximize aria-hidden="true" size={16} strokeWidth={1.5} />
          </button>
        </div>
        {failed && (
          <p className="mo-error" role="status">The film didn’t load. Refresh the page to try again.</p>
        )}
      </div>
    </div>
  );

  const words = showWords && <FilmWords film={film} />;

  if (bare) {
    return (
      <div
        className="mo-film mo-film--bare"
        data-cuts={film.cuts.length > 1 ? 'dual' : 'tall'}
        role="group"
        aria-label={label || `${film.client}, ${film.kind.toLowerCase()}`}
      >
        {deck}
        {words}
      </div>
    );
  }

  return (
    <article
      className={`mo-film mo-film--${layout}`}
      data-cuts={film.cuts.length > 1 ? 'dual' : 'tall'}
      aria-labelledby={titleId}
    >
      {deck}

      <div className="mo-slate">
        <div className="mo-id">
          <h3 id={titleId}>{film.client}</h3>
          <p className="mo-kind">
            {film.kind} · {film.place} · <span className="mo-num">{clock(film.duration)}</span>
          </p>
        </div>
        <p className="mo-desc" id={descId}>{film.description}</p>
        <ul className="mo-credits">
          {film.credits.map((line) => <li key={line}>{line}</li>)}
        </ul>
        <Link to={film.caseStudy} className="mo-link">
          Read the case study<span className="lens-sr-only">: {film.client}</span>
          <span className="btn-arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      {words}
    </article>
  );
}
