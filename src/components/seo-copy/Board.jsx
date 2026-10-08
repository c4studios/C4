/*
 * The board: an example search's first page, laid out the way a paste-up
 * artist lays out a page. A white board ruled in non-repro blue, a strip of
 * paper for each result, the positions down the left edge, and a cut line
 * where page one ends. The visitor's listing is the one strip that moves.
 *
 * It's an illustration, so the board is aria-hidden; the steps beside it
 * carry every fact in words, including where the listing sits.
 *
 *   step     0 to 5. Where the listing sits comes from RANKS[step]; the
 *            copy on it changes as the work does (marked up at 1, a clean
 *            address from 2, rewritten from 3, mentioned by others at 5).
 *   still    true for a fixed picture: no transitions, no typing.
 *   skeleton the prerender gets grey bars in place of the example's words,
 *            so the static HTML never carries invented listings. The
 *            browser fills them in.
 *   focus    where the camera holds the listing in a window that can't
 *            show the whole board, as a fraction of the window's height.
 *
 * The pencil (pencil.jsx) is measured off the words it marks, so a ring
 * sits round "Home" and a wave under the filler at any width.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { RANKS, PAGE_SIZE, YOU, YOU_SITE } from './examples';
import { GRAPHITE, Graphite, ringPath, strikePath, wavePath } from './pencil';

const GAP = 8; // between strips
const OTHER_H = 50; // a pasted result: the site line and a title
const TOP = 14; // above the first strip
const FOLD = 34; // the cut between page one and page two
const TILT = [-0.35, 0.22, -0.16, 0.38, -0.26, 0.14, -0.4, 0.28, -0.12, 0.22];
const SKEL = [72, 58, 66, 80, 61, 70, 54, 76, 63, 68]; // bar widths, per cent
const FILTER = `url(#${GRAPHITE})`;

/* Where everything sits for a given position of the listing. */
function lay(rank, youH) {
  const slots = [];
  let y = TOP;
  let foldY = 0;
  for (let d = 0; d <= PAGE_SIZE; d += 1) {
    if (d === PAGE_SIZE) {
      foldY = y - GAP / 2 + FOLD / 2;
      y += FOLD;
    }
    const h = d === rank - 1 ? youH : OTHER_H;
    slots.push({ y, h });
    y += h + GAP;
  }
  return { slots, foldY, height: y - GAP + TOP };
}

const at = (rank, j) => (j < rank - 1 ? j : j + 1); // other j's slot

/* Split a line around a phrase so the phrase can be found and marked. */
function around(text, phrase, ref, cls) {
  const i = phrase ? text.indexOf(phrase) : -1;
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span ref={ref} className={cls}>{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  );
}

function useTyped(text, run) {
  const [n, setN] = useState(run ? 0 : text.length);
  useEffect(() => {
    if (!run) { setN(text.length); return undefined; }
    setN(0);
    let k = 0;
    let id = 0;
    const wait = setTimeout(() => {
      id = setInterval(() => {
        k += 1;
        setN(k);
        if (k >= text.length) clearInterval(id);
      }, 34);
    }, 380);
    return () => { clearTimeout(wait); clearInterval(id); };
  }, [text, run]);
  return text.slice(0, n);
}

export default function Board({ ex, step = 0, still = false, skeleton = false, focus = 0.5, className = '' }) {
  const rank = RANKS[step] ?? RANKS[0];
  const youRef = useRef(null);
  const winRef = useRef(null);
  const hotRef = useRef(null);
  const fluffRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const [youH, setYouH] = useState(96);
  const [winH, setWinH] = useState(0);
  const [marks, setMarks] = useState({ hot: null, fluff: [], title: [], desc: [] });

  /* The listing's own height (its description wraps differently at each
     width) and the window's, measured rather than assumed. */
  useLayoutEffect(() => {
    const you = youRef.current;
    const win = winRef.current;
    if (!you || !win) return undefined;
    const measure = () => {
      setYouH(Math.round(you.offsetHeight));
      setWinH(Math.round(win.clientHeight));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(you);
    ro.observe(win);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure, () => {});
    return () => ro.disconnect();
  }, []);

  /* The rewrite at step three: the pencil strikes the old words first, then
     the strip carries the new ones. Going back simply restores them. */
  const rewritten = step >= 3;
  const [shown, setShown] = useState(rewritten ? 'after' : 'before');
  const [striking, setStriking] = useState(false);
  useEffect(() => {
    if (still) { setShown(rewritten ? 'after' : 'before'); setStriking(false); return undefined; }
    if (!rewritten) { setShown('before'); setStriking(false); return undefined; }
    if (shown === 'after') return undefined;
    setStriking(true);
    const id = setTimeout(() => { setShown('after'); setStriking(false); }, 760);
    return () => clearTimeout(id);
  }, [rewritten, still]);

  /* The listing lifts while it's carried to its new place. */
  const [carried, setCarried] = useState(false);
  const lastRank = useRef(rank);
  useEffect(() => {
    if (still || lastRank.current === rank) { lastRank.current = rank; return undefined; }
    lastRank.current = rank;
    setCarried(true);
    const id = setTimeout(() => setCarried(false), 900);
    return () => clearTimeout(id);
  }, [rank, still]);

  /* Where the pencil goes: measured off the words, relative to the strip,
     and only while the strip is at rest (it tilts while it's carried). */
  useLayoutEffect(() => {
    const you = youRef.current;
    if (!you || skeleton) return undefined;
    const measure = () => {
      if (you.classList.contains('is-carried')) return;
      const b = you.getBoundingClientRect();
      const rel = (r) => ({ x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height });
      const lines = (el) => (el ? [...el.getClientRects()].filter((r) => r.width > 2).map(rel) : []);
      setMarks({
        hot: hotRef.current ? rel(hotRef.current.getBoundingClientRect()) : null,
        fluff: lines(fluffRef.current),
        title: lines(titleRef.current),
        desc: lines(descRef.current),
      });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(you);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure, () => {});
    return () => ro.disconnect();
  }, [shown, ex.key, carried, skeleton, step]);

  const query = useTyped(ex.query, !still && !skeleton);
  const typing = query.length < ex.query.length;

  const { slots, foldY, height } = useMemo(() => lay(rank, youH), [rank, youH]);
  const you = slots[rank - 1];
  let camera = winH && height > winH
    ? Math.max(0, Math.min(height - winH, you.y + you.h / 2 - winH * focus))
    : 0;
  /* Start the window on a whole strip rather than half of one under the
     search, as long as that leaves no more than a sliver of empty board
     below the last strip. Otherwise the top edge fades the cut strip. */
  if (camera > 0) {
    const first = slots.find((s) => s.y >= camera - 1);
    const aligned = first ? Math.max(0, first.y - TOP) : camera;
    if (aligned - (height - winH) <= 36) camera = aligned;
  }

  const copy = shown === 'after' ? ex.after : ex.before;
  const path = step >= 2 ? ex.after.path : ex.before.path;
  const marksOn = !skeleton && step >= 1 && shown === 'before';

  /* At the last step, two of the other listings point at this one. */
  const pointers = step >= 5 ? [0, 7].map((j) => slots[at(rank, j)]) : [];

  return (
    <div className={`sc-board${still ? ' is-still' : ''}${skeleton ? ' is-skeleton' : ''} ${className}`} data-nosnippet="" aria-hidden="true">
      <span className="sc-reg sc-reg--tl" />
      <span className="sc-reg sc-reg--tr" />
      <span className="sc-reg sc-reg--bl" />
      <span className="sc-reg sc-reg--br" />

      <div className="sc-query">
        <Search className="sc-query-icon" size={17} strokeWidth={1.8} aria-hidden="true" />
        <span className="sc-query-text">{skeleton ? <span className="sc-skel" style={{ width: '9.5em' }} /> : query}</span>
        <span className={`sc-caret${typing ? '' : ' is-idle'}`} />
      </div>

      <div
        className={`sc-window${camera > 1 ? ' cut-top' : ''}${winH && camera < height - winH - 1 ? ' cut-bottom' : ''}`}
        ref={winRef}
      >
        <div className="sc-results" style={{ height, transform: `translate3d(0, ${-camera}px, 0)` }}>
          <span className="sc-fold" style={{ transform: `translate3d(0, ${foldY}px, 0)` }}>
            <span className="sc-fold-line" />
            <span className="sc-fold-label">Page 2</span>
          </span>

          {slots.map((s, d) => (
            <span
              key={`n${d}`}
              className={`sc-pos${d === rank - 1 ? ' is-you' : ''}`}
              style={{ transform: `translate3d(0, ${s.y + Math.min(s.h, OTHER_H) / 2}px, 0)` }}
            >
              {d + 1}
              {d === rank - 1 ? (
                <svg className="sc-pos-ring" viewBox="0 0 34 24" focusable="false">
                  <g filter={FILTER}><Graphite d={ringPath(3, 3, 28, 18, 5)} /></g>
                </svg>
              ) : null}
            </span>
          ))}

          {ex.others.map((o, j) => {
            const s = slots[at(rank, j)];
            return (
              <div
                key={`${ex.key}-${j}`}
                className="sc-strip"
                style={{ transform: `translate3d(0, ${s.y}px, 0) rotate(${TILT[j]}deg)` }}
              >
                <span className="sc-strip-site">
                  <span className="sc-fav" />
                  {skeleton ? <span className="sc-skel" style={{ width: '34%' }} /> : (
                    <>
                      <span className="sc-strip-kind">{o.kind}</span>
                      <span className="sc-strip-path">/{o.path}</span>
                    </>
                  )}
                </span>
                <span className="sc-strip-title">
                  {skeleton ? <span className="sc-skel sc-skel--title" style={{ width: `${SKEL[j]}%` }} /> : o.title}
                </span>
              </div>
            );
          })}

          <div
            ref={youRef}
            className={`sc-you${carried ? ' is-carried' : ''}${striking ? ' is-striking' : ''}`}
            style={{ transform: `translate3d(0, ${you.y}px, 0)` }}
          >
            <span className="sc-strip-site">
              <span className="sc-fav sc-fav--you">Y</span>
              {skeleton ? <span className="sc-skel" style={{ width: '40%' }} /> : (
                <>
                  <span className="sc-strip-kind sc-you-name">{YOU}</span>
                  <span className="sc-strip-path">
                    {YOU_SITE} › <span key={path} className="sc-you-path">{path}</span>
                  </span>
                </>
              )}
            </span>
            {skeleton ? (
              <>
                <span className="sc-you-title"><span className="sc-skel sc-skel--title" style={{ width: '58%' }} /></span>
                <span className="sc-you-desc">
                  <span className="sc-skel" style={{ width: '92%' }} />
                  <span className="sc-skel" style={{ width: '64%' }} />
                </span>
              </>
            ) : (
              <span key={shown} className="sc-you-copy">
                <span className="sc-you-title">
                  <span ref={titleRef}>{shown === 'before' ? around(copy.title, copy.hot, hotRef) : copy.title}</span>
                </span>
                <span className="sc-you-desc">
                  <span ref={descRef}>{shown === 'before' ? around(copy.desc, copy.fluff, fluffRef) : copy.desc}</span>
                </span>
              </span>
            )}

            {!skeleton ? (
              <svg className="sc-you-marks" focusable="false">
                <g filter={FILTER}>
                  {marksOn && marks.hot ? (
                    <Graphite
                      className="sc-mark-ring"
                      d={ringPath(marks.hot.x - 6, marks.hot.y - 3, marks.hot.w + 12, marks.hot.h + 5, 11)}
                    />
                  ) : null}
                  {marksOn ? marks.fluff.map((r, i) => (
                    <Graphite
                      key={`w${i}`}
                      className="sc-mark-wave"
                      style={{ '--d': `${0.35 + i * 0.12}s` }}
                      d={wavePath(r.x, r.x + r.w, r.y + r.h - 1, 21 + i)}
                    />
                  )) : null}
                  {striking ? [...marks.title, ...marks.desc].map((r, i) => (
                    <Graphite
                      key={`s${i}`}
                      className="sc-mark-strike"
                      style={{ '--d': `${i * 0.09}s` }}
                      d={strikePath(r.x, r.x + r.w, r.y + r.h * 0.56, 31 + i)}
                    />
                  )) : null}
                </g>
              </svg>
            ) : null}
          </div>

          {pointers.length ? (
            <svg className="sc-pointers" width="100%" height={height} focusable="false">
              <g filter={FILTER}>
                {pointers.map((p, k) => {
                  const y0 = p.y + OTHER_H / 2;
                  const y1 = you.y + 20 + k * 16;
                  const bow = 20 + k * 9;
                  return (
                    <Graphite
                      key={k}
                      className="sc-mark-arrow"
                      style={{ '--d': `${0.2 + k * 0.35}s` }}
                      d={`M -8 ${y0} C ${bow} ${y0 - 4}, ${bow + 2} ${y1 + 6}, -1 ${y1} M 6 ${y1 - 5.5} L -1 ${y1} L 5 ${y1 + 5}`}
                    />
                  );
                })}
              </g>
            </svg>
          ) : null}
        </div>
      </div>

      <span className="sc-board-note">Example. Invented listings.</span>
    </div>
  );
}
