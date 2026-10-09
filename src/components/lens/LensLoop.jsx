/**
 * LensLoop: a short silent clip in a case study on /Lens (LensWork.jsx).
 *
 * The same viewfinder as MotionFilm, without the transport: four corners that
 * lock on in amber while it plays, and a picture that goes soft while it waits
 * for frames, the way a lens hunts before it locks. These clips are recordings
 * of motion running on a client's site, or a few seconds of film, so they have
 * no sound and no scrubber. One button pauses and plays it.
 *
 * Budget. The poster is given its file once the clip is a screen away, and the
 * video its file only when it is asked to play, so nothing loads with the top
 * of the page. The prerendered HTML carries neither (the words around each
 * clip carry its meaning, and the page's JSON-LD names every poster). It plays muted while half of it is on screen and pauses when it
 * leaves; it starts on the poster's own frame (`posterAt`, which
 * scripts/lens-work.mjs printed), so the still hands over without a jump. Each
 * device fetches only its own cut: the first cut whose `media` matches, else
 * the last.
 *
 * Under reduced motion, the prerenderer or Save-Data nothing plays by itself:
 * the poster stands with a play mark, and the button still works. A clip the
 * visitor paused stays paused. The video never takes focus; the button does.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import useStaticMode from '@/hooks/useStaticMode';

function pickCut(cuts) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return cuts.length - 1;
  const i = cuts.findIndex((c) => !c.media || window.matchMedia(c.media).matches);
  return i < 0 ? cuts.length - 1 : i;
}

function wantsLessData() {
  try { return Boolean(navigator.connection && navigator.connection.saveData); } catch { return false; }
}

export default function LensLoop({ clip, className = '', fit = 'cover', onPlayingChange }) {
  const staticMode = useStaticMode();
  const noAuto = useMemo(() => staticMode || wantsLessData(), [staticMode]);
  const [cutIndex, setCutIndex] = useState(() => pickCut(clip.cuts));
  const cut = clip.cuts[cutIndex] || clip.cuts[clip.cuts.length - 1];
  const fallback = clip.cuts[clip.cuts.length - 1];
  const wide = clip.cuts.find((c) => c.media) || fallback;

  /* False in the prerendered HTML too: a browser parsing that HTML fetched a
     lazy poster near the top before the app took over (measured 9 Oct 2026). */
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [paused, setPaused] = useState(false);     // the visitor paused it
  const [failed, setFailed] = useState(false);

  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const cutRef = useRef(cut);
  cutRef.current = cut;
  const st = useRef({ inView: false, manual: false, tabPaused: false });

  /* The video is given its file here, by hand, and never through a React prop:
     re-rendering a media element's src restarts it. */
  const play = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const src = cutRef.current.src;
    if (el.getAttribute('src') !== src) {
      el.setAttribute('src', src);
      /* Before metadata this sets where playback starts: the poster's frame. */
      if (clip.posterAt) { try { el.currentTime = clip.posterAt; } catch { /* set on loadedmetadata */ } }
    }
    if (el.paused) setWaiting(true);
    const p = el.play();
    if (p && p.catch) p.catch(() => setWaiting(false));
  }, [clip.posterAt]);

  useEffect(() => {
    const v = videoRef.current;
    const stage = stageRef.current;
    if (!v || !stage) return undefined;
    const s = st.current;
    v.muted = true;
    v.defaultMuted = true;

    const onPlaying = () => { setPlaying(true); setWaiting(false); setStarted(true); };
    const onPause = () => { setPlaying(false); setWaiting(false); };
    const onWaiting = () => { if (!v.paused) setWaiting(true); };
    const onLoadedMeta = () => {
      if (clip.posterAt && v.currentTime < 0.05) { try { v.currentTime = clip.posterAt; } catch { /* ignore */ } }
    };
    const onError = () => { if (v.error) { setFailed(true); setWaiting(false); } };
    v.addEventListener('playing', onPlaying);
    v.addEventListener('pause', onPause);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('loadedmetadata', onLoadedMeta);
    v.addEventListener('error', onError);

    const nearIO = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setNear(true);
      nearIO.disconnect();
    }, { rootMargin: '100% 0px' });
    nearIO.observe(stage);

    const viewIO = new IntersectionObserver(([entry]) => {
      /* A fast jump can land here before the near observer has fired, so the
         view observer hands over the poster file too. */
      if (entry.isIntersecting) setNear(true);
      const vis = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      if (vis === s.inView) return;
      s.inView = vis;
      if (vis) {
        if (!noAuto && !s.manual && !document.hidden) play();
      } else if (!v.paused) {
        v.pause();
      }
    }, { threshold: [0, 0.5, 1] });
    viewIO.observe(stage);

    const onVisibility = () => {
      if (document.hidden) {
        if (!v.paused) { s.tabPaused = true; v.pause(); }
      } else if (s.tabPaused) {
        s.tabPaused = false;
        if (s.inView && !s.manual && !noAuto) play();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      nearIO.disconnect();
      viewIO.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('loadedmetadata', onLoadedMeta);
      v.removeEventListener('error', onError);
      try { v.pause(); } catch { /* ignore */ }
    };
  }, [clip.posterAt, noAuto, play]);

  /* A window that crosses the breakpoint swaps the cut, and the poster with it.
     A clip that had a file gets the new one, and carries on if it was playing. */
  useEffect(() => {
    if (clip.cuts.length < 2 || typeof window.matchMedia !== 'function') return undefined;
    const queries = clip.cuts.filter((c) => c.media).map((c) => window.matchMedia(c.media));
    const onChange = () => {
      const next = pickCut(clip.cuts);
      const v = videoRef.current;
      setCutIndex(next);
      if (!v || !v.getAttribute('src')) return;
      const wasPlaying = !v.paused;
      cutRef.current = clip.cuts[next];
      setStarted(false);
      v.pause();
      v.removeAttribute('src');
      v.load();
      if (wasPlaying) play();
    };
    queries.forEach((q) => q.addEventListener('change', onChange));
    return () => queries.forEach((q) => q.removeEventListener('change', onChange));
  }, [clip.cuts, play]);

  /* A study can follow the clip's state (DS Racing's start lights do). */
  useEffect(() => { if (onPlayingChange) onPlayingChange(playing); }, [playing, onPlayingChange]);

  const onToggle = () => {
    const v = videoRef.current;
    if (!v || failed) return;
    if (!v.paused) {
      st.current.manual = true;
      setPaused(true);
      v.pause();
    } else {
      st.current.manual = false;
      setPaused(false);
      play();
    }
  };

  const showMark = !playing && !failed && (noAuto || paused);
  const stageClass = [
    'lw-stage',
    `lw-stage--${fit}`,
    started ? 'is-started' : '',
    playing ? 'is-playing' : '',
    waiting ? 'is-waiting' : '',
    className,
  ].filter(Boolean).join(' ');
  const ratio = {
    '--lw-ar': `${fallback.width} / ${fallback.height}`,
    '--lw-ar-wide': `${wide.width} / ${wide.height}`,
  };

  return (
    <div className={stageClass} ref={stageRef} style={ratio} data-cuts={clip.cuts.length > 1 ? 'dual' : 'one'}>
      <video
        ref={videoRef}
        className="lw-video"
        preload="none"
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        aria-hidden="true"
      />
      <picture className="lw-poster" aria-hidden="true">
        {clip.cuts.filter((c) => c.media).map((c) => (
          <source key={c.poster} media={c.media} srcSet={near ? c.poster : undefined} width={c.width} height={c.height} />
        ))}
        <img src={near ? fallback.poster : undefined} width={fallback.width} height={fallback.height} alt="" loading="lazy" decoding="async" />
      </picture>
      <span className="mo-corner mo-corner--tl" aria-hidden="true" />
      <span className="mo-corner mo-corner--tr" aria-hidden="true" />
      <span className="mo-corner mo-corner--bl" aria-hidden="true" />
      <span className="mo-corner mo-corner--br" aria-hidden="true" />
      {showMark && (
        <button type="button" className="mo-play lw-mark" onClick={onToggle} tabIndex={-1} aria-hidden="true">
          <svg viewBox="0 0 72 72" width="72" height="72" fill="none" focusable="false">
            <path d="M1 17V1h16M55 1h16v16M71 55v16H55M17 71H1V55" stroke="currentColor" strokeWidth="1.5" />
            <path d="M29 23.5 50 36 29 48.5Z" fill="currentColor" />
          </svg>
        </button>
      )}
      <button
        type="button"
        className="lw-toggle"
        onClick={onToggle}
        disabled={failed}
        aria-label={playing ? `Pause: ${clip.label}` : `Play: ${clip.label}`}
      >
        {playing
          ? <Pause aria-hidden="true" size={14} strokeWidth={1.5} fill="currentColor" />
          : <Play aria-hidden="true" size={14} strokeWidth={1.5} fill="currentColor" />}
      </button>
      {failed && <p className="lw-error" role="status">This clip didn’t load. Refresh the page to try again.</p>}
    </div>
  );
}
