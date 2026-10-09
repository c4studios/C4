/*
 * The results page on /seo-and-copywriting: an example search's first page,
 * set in the bench's own type. It's the page's one moving picture.
 *
 * What's on it. The search, typed once, with the red caret. Down the left, a
 * rail of positions, 1 to 11, every one of them always present as a ghost.
 * Ten stand-in results, set as type on hairline rules: each says only what
 * kind of result it is (a trade directory, a quote site, a competitor), in
 * ghost ink, and never carries an invented title. One hairline across the
 * page where page one ends. And your listing, the only object on the page
 * you could lift off it: a sheet with its position hung beside it at
 * display size, counting down as it climbs, and a trail down the rail with
 * a tick where it held.
 *
 * Each piece of work marks the exact words of the listing it changes, as a
 * text selection on proof stock (the site's selection colour): the faults at
 * the audit, the new address once Google can read the page, the rewritten
 * title and description. Old words are struck through before the listing
 * reprints. Arriving first gets a beat of its own: an ink rule locks round
 * the sheet and two other results draw pointers to it.
 *
 * It's an illustration, so it's aria-hidden and data-nosnippet; the steps
 * beside it say every fact in words. The prerender gets bars in place of the
 * example listing's words, so the static HTML never carries an invented
 * listing. The kinds of result are category words, not listings, so they
 * stay.
 *
 * Every length is in artboard units, and `--u` says how many pixels a unit
 * is. A still takes it from its own width in CSS (a container query unit),
 * so the static HTML lays out right at any width. Armed, the stage measures
 * its box and either shows the whole page or, when the box is too short to
 * do that at a readable size, a window that keeps your listing in view.
 *
 *   still     positions come from RANKS[step] at render. Nothing moves.
 *   armed     Climb calls ref.current.place(r) on every frame the rank
 *             changes, with your listing's rank as a continuous number from
 *             11 down to 1, and changes `step` only when its words change.
 *   windowH   a still's window onto the page, in units (0 shows it all).
 *   compact   the phone setting: a narrower page, so the type stays legible.
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { RANKS, YOU, YOU_SITE } from './examples';

const N = 10; // results on page one
const MAX_U = 1.02; // the page never draws bigger than this many px per unit
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/* Two settings of one page. `w` is the artboard's width, then the rail
   (where the positions run and your position hangs), the gutter on the
   right where the pointers run, the gap above the first result, a stand-in's
   height, the gap between results, the gap where page one ends, your
   listing's height (and, on a phone, its height while the old one-line
   title is on it), the search row and the foot. `num` is where the hanging
   position's right edge sits, `numSize` its size. */
export const GEOMETRY = {
  wide: { w: 660, rail: 96, gutter: 50, top: 16, h: 38, gap: 12, fold: 48, you: 150, youShort: 150, query: 72, foot: 40, num: 78, numSize: 48 },
  compact: { w: 420, rail: 44, gutter: 36, top: 14, h: 34, gap: 10, fold: 44, you: 200, youShort: 176, query: 62, foot: 36, num: 36, numSize: 27 },
};

export const canvasHeight = (g) => g.top + N * (g.h + g.gap) - g.gap + g.fold + g.you + g.top;

/* Where everything sits with your listing at rank r, a continuous number
   from 11 (the top of page two) to 1, and `you` units tall. A result it
   passes slides down one as it goes by. Values are y offsets in units. */
export function layout(g, r, you = g.you) {
  const pitch = g.h + g.gap;
  const tall = you - g.h; // how much further your listing pushes what's below it
  const turn = g.fold - g.gap; // the extra room where page one ends
  const at = (q) => g.top + (q - 1) * pitch + tall * clamp01(q - r) + turn * clamp01(q - N);
  return {
    you: g.top + (r - 1) * pitch + turn * clamp01(r - N),
    others: Array.from({ length: N }, (_, o) => at(o + 1 + clamp01(o + 2 - r))),
    keys: Array.from({ length: N + 1 }, (_, k) => at(k + 1)),
    fold: g.top + N * pitch - g.gap + tall * clamp01(N + 1 - r) + g.fold / 2,
  };
}

/* A window onto the page keeps your listing in view, a little above the
   middle, when the page is taller than the window. */
export function cameraFor(g, r, windowH, you = g.you, focus = 0.46) {
  const ch = canvasHeight(g);
  if (!windowH || windowH >= ch) return 0;
  const y = layout(g, r, you).you + you / 2 - windowH * focus;
  return Math.max(0, Math.min(ch - windowH, y));
}

export const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

/* The two results that point to yours at the last step (they sit 2nd and
   4th by then), where on your sheet each lands, and how far out into the
   gutter it runs. They nest and never cross: the one from 4th runs
   outside and lands higher, so it spans the inner one end to end. */
const POINTERS = [{ o: 0, at: 0.66, out: 0.42 }, { o: 2, at: 0.28, out: 0.84 }];
/* Ranks your listing holds between pieces of work; the trail ticks them. */
const HELD = [...new Set(RANKS)];

/* A ghost position hides while your listing lies beside it. */
const besideYou = (y, L, you) => y > L.you - 8 && y < L.you + you - 8;

/* Split a line around a phrase so the phrase can be marked. */
function marked(text, phrase, on) {
  const i = phrase ? text.indexOf(phrase) : -1;
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className={`sc-sel${on ? ' is-on' : ''}`}>{phrase}</mark>
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

/* The rewrite: the old words are struck through first, then the listing
   reprints with the new ones. Going back puts the old ones back at once. */
function useRewrite(rewritten, still) {
  const [shown, setShown] = useState(rewritten ? 'after' : 'before');
  const [striking, setStriking] = useState(false);
  const shownRef = useRef(shown);
  shownRef.current = shown;
  useEffect(() => {
    if (still || !rewritten) { setShown(rewritten ? 'after' : 'before'); setStriking(false); return undefined; }
    if (shownRef.current === 'after') return undefined;
    setStriking(true);
    const id = setTimeout(() => { setShown('after'); setStriking(false); }, 680);
    return () => clearTimeout(id);
  }, [rewritten, still]);
  return { shown, striking };
}

const unit = (v) => `calc(${v.toFixed(2)} * var(--u))`;
const yAt = (v) => `translate3d(0, ${unit(v)}, 0)`;

/* Armed writes go through here, so a value that hasn't changed since the
   last frame never touches the element again. */
const written = new WeakMap();
function put(el, prop, value) {
  if (!el) return;
  let seen = written.get(el);
  if (!seen) { seen = {}; written.set(el, seen); }
  if (seen[prop] === value) return;
  seen[prop] = value;
  if (prop.startsWith('--')) el.style.setProperty(prop, value);
  else el.style[prop] = value;
}

/* The pointers: two results at the last step, each with a hairline out into
   the gutter and back to its own height on your sheet, its arrowhead
   stopping clear of the sheet's edge. Measured off the finished page. */
function pointerPaths(g, you) {
  const L = layout(g, 1, you);
  const x0 = g.w - g.gutter;
  return POINTERS.map(({ o, at, out }) => {
    const y0 = L.others[o] + g.h * 0.55;
    const y1 = L.you + you * at;
    const xc = x0 + g.gutter * out;
    const tip = x0 + 7;
    return `M ${x0 + 4} ${y0} C ${xc} ${y0}, ${xc} ${y1}, ${tip} ${y1} M ${tip + 5} ${y1 - 3.5} L ${tip} ${y1} L ${tip + 5} ${y1 + 3.5}`;
  });
}

/* Your listing's words: the site, the title and the description. */
function SheetWords({ ex, shown, path, faults, step, skeleton }) {
  const copy = shown === 'after' ? ex.after : ex.before;
  return (
    <>
      <span className="sc-you-site">
        <span className="sc-fav">Y</span>
        {skeleton ? <span className="sc-bar" style={{ width: '46%' }} /> : (
          <span className="sc-you-names">
            <span className="sc-you-name">{YOU}</span>
            <span className="sc-you-url">
              {YOU_SITE} ›{' '}
              <mark key={path} className={`sc-sel${faults || step === 2 ? ' is-on' : ''}`}>{path}</mark>
            </span>
          </span>
        )}
      </span>
      {skeleton ? (
        <>
          <span className="sc-you-title"><span className="sc-bar sc-bar--title" style={{ width: '62%' }} /></span>
          <span className="sc-you-desc">
            <span className="sc-bar" style={{ width: '94%' }} />
            <span className="sc-bar" style={{ width: '71%' }} />
          </span>
        </>
      ) : (
        <span key={`${ex.key}-${shown}`} className="sc-you-copy">
          <span className="sc-you-title">
            <span className="sc-ink">
              {shown === 'before'
                ? marked(copy.title, copy.hot, faults)
                : <mark className={`sc-sel${step === 3 ? ' is-on' : ''}`}>{copy.title}</mark>}
            </span>
          </span>
          <span className="sc-you-desc">
            <span className="sc-ink">
              {shown === 'before'
                ? marked(copy.desc, copy.fluff, faults)
                : <mark className={`sc-sel${step === 3 ? ' is-on' : ''}`}>{copy.desc}</mark>}
            </span>
          </span>
        </span>
      )}
    </>
  );
}

const Results = forwardRef(function Results(
  { ex, step = 0, still = false, skeleton = false, compact = false, windowH = 0, query = true, foot = true, typing = false, className = '' },
  ref,
) {
  const g = compact ? GEOMETRY.compact : GEOMETRY.wide;
  const ch = canvasHeight(g);
  const rootRef = useRef(null);
  const artRef = useRef(null);
  const viewRef = useRef(null);
  const camRef = useRef(null);
  const youRef = useRef(null);
  const numRef = useRef(null);
  const foldRef = useRef(null);
  const trailRef = useRef(null);
  const pointersRef = useRef(null);
  const otherRefs = useRef([]);
  const ghostRefs = useRef([]);
  const tickRefs = useRef([]);
  const live = useRef({ r: RANKS[0], n: 0, u: 0, win: 0, you: 0 });

  const typed = useTyped(ex.query, typing && !still && !skeleton);
  const isTyping = typed.length < ex.query.length;

  const { shown, striking } = useRewrite(step >= 3, still);
  const path = step >= 2 ? ex.after.path : ex.before.path;
  /* the audit marks the faults; later steps mark only what they changed */
  const faults = step === 1 && shown === 'before' && !striking;
  /* on a phone the old title fits one line, the new one takes two */
  const cardH = shown === 'before' ? g.youShort : g.you;

  /* Armed: positions are written straight to the elements, and only when
     they change, so scrolling never re-renders the page. */
  const place = useCallback((r) => {
    const { u, win } = live.current;
    const you = live.current.you || g.you;
    live.current.r = r;
    if (!u) return;
    const L = layout(g, r, you);
    const px = (v) => `translate3d(0, ${(v * u).toFixed(1)}px, 0)`;
    const cam = cameraFor(g, r, win, you);
    put(camRef.current, 'transform', px(-cam));
    if (viewRef.current) {
      viewRef.current.classList.toggle('cut-top', cam > 0.5);
      viewRef.current.classList.toggle('cut-bottom', win < ch && cam < ch - win - 0.5);
    }
    put(youRef.current, 'transform', px(L.you));
    put(youRef.current, 'height', `${(you * u).toFixed(1)}px`);
    /* lifted while it's between places, settled when it holds one */
    put(youRef.current, '--lift', Math.min(1, Math.abs(r - Math.round(r)) * 3).toFixed(2));
    if (youRef.current) youRef.current.classList.toggle('is-first', r < 1.02);
    otherRefs.current.forEach((el, o) => put(el, 'transform', px(L.others[o])));
    ghostRefs.current.forEach((el, k) => {
      put(el, 'transform', px(L.keys[k]));
      put(el, 'opacity', besideYou(L.keys[k], L, you) ? '0' : '');
    });
    put(foldRef.current, 'transform', px(L.fold));
    const n = Math.round(r);
    if (numRef.current && n !== live.current.n) {
      numRef.current.textContent = String(n);
      live.current.n = n;
    }
    const from = L.keys[N] + g.h / 2;
    const to = L.you + 18;
    put(trailRef.current, 'transform', `${px(to)} scaleY(${Math.max(0, (from - to) * u).toFixed(1)})`);
    tickRefs.current.forEach((el, i) => {
      put(el, 'transform', px(L.keys[HELD[i] - 1] + g.h / 2));
      put(el, 'opacity', HELD[i] > r + 0.5 ? '1' : '0');
    });
    if (pointersRef.current) pointersRef.current.classList.toggle('is-on', r < 1.02);
  }, [g, ch]);

  useImperativeHandle(ref, () => ({ place }), [place]);

  /* Armed: measure the stage's box and choose the scale. The whole page
     when it fits at a readable size; otherwise full width and a window. */
  useLayoutEffect(() => {
    if (still) return undefined;
    const root = rootRef.current;
    const art = artRef.current;
    if (!root || !art) return undefined;
    if (!live.current.you) live.current.you = cardH;
    const head = (query ? g.query : 0) + (foot ? g.foot : 0);
    const measure = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      if (!w || !h) return;
      let u = Math.min(w / g.w, MAX_U);
      let win = h / u - head;
      if (win >= ch) {
        win = ch;
      } else {
        const all = h / (head + ch);
        if (all >= u * 0.86) { u = all; win = ch; }
      }
      live.current.u = u;
      live.current.win = win;
      art.style.setProperty('--u', `${u.toFixed(4)}px`);
      art.style.setProperty('--view-h', win.toFixed(2));
      place(live.current.r);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
    /* cardH only seeds the height here; the effect below follows it */
  }, [still, g, ch, query, foot, place]);

  /* Armed: when the listing's height changes (the reprint, on a phone), it
     eases to the new height and what's below it follows. */
  useEffect(() => {
    if (still) return undefined;
    const from = live.current.you || cardH;
    if (Math.abs(from - cardH) < 0.5) { live.current.you = cardH; place(live.current.r); return undefined; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / 420);
      live.current.you = from + (cardH - from) * (1 - (1 - k) ** 3);
      place(live.current.r);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cardH, still, place]);

  /* Still: everything set at render from the step. */
  const r = still ? (RANKS[step] ?? RANKS[0]) : null;
  const L = still ? layout(g, r, cardH) : null;
  const viewH = still ? (windowH ? Math.min(ch, windowH) : ch) : null;
  const cam = still ? cameraFor(g, r, viewH, cardH) : 0;
  const trailFrom = still ? L.keys[N] + g.h / 2 : 0;
  const trailTo = still ? L.you + 18 : 0;

  return (
    <div
      ref={rootRef}
      className={`sc-results${still ? ' is-still' : ' is-armed'}${skeleton ? ' is-skeleton' : ''}${compact ? ' is-compact' : ''} ${className}`}
      aria-hidden="true"
      data-nosnippet=""
    >
      <div
        className="sc-art"
        ref={artRef}
        style={{
          '--aw': g.w,
          '--ch': ch,
          '--rail': g.rail,
          '--gutter': g.gutter,
          '--h': g.h,
          '--you': cardH,
          '--num': g.num,
          '--num-size': g.numSize,
          '--q-h': query ? g.query : 0,
          '--foot-h': foot ? g.foot : 0,
          ...(still ? { '--view-h': viewH } : null),
        }}
      >
        {query ? (
          <div className="sc-q">
            <Search className="sc-q-glass" strokeWidth={1.6} aria-hidden="true" focusable="false" />
            <span className="sc-q-text">{skeleton ? <span className="sc-bar" style={{ width: '9em' }} /> : typed}</span>
            <span className={`sc-q-caret${isTyping ? '' : ' is-idle'}`} />
            <span className="sc-q-tag">Example</span>
          </div>
        ) : null}

        <div
          className={`sc-view${still && cam > 0.5 ? ' cut-top' : ''}${still && viewH < ch && cam < ch - viewH - 0.5 ? ' cut-bottom' : ''}`}
          ref={viewRef}
        >
          <div className="sc-cam" ref={camRef} style={still ? { transform: yAt(-cam) } : undefined}>
            <div className="sc-canvas">
              {/* the rail: every position, present as a ghost (a still
                  leaves out the one your listing lies over) */}
              {Array.from({ length: N + 1 }, (_, k) => (still && besideYou(L.keys[k], L, cardH) ? null : (
                <span
                  key={`k${k}`}
                  className="sc-ghost"
                  ref={(el) => { ghostRefs.current[k] = el; }}
                  style={still ? { transform: yAt(L.keys[k]) } : undefined}
                >
                  {k + 1}
                </span>
              )))}

              {/* the trail your listing leaves, and a tick where it held */}
              <span
                className="sc-trail"
                ref={trailRef}
                style={still ? { transform: yAt(trailTo), height: unit(Math.max(0, trailFrom - trailTo)) } : undefined}
              />
              {HELD.map((rank, i) => (still && rank <= r + 0.5 ? null : (
                <span
                  key={`t${rank}`}
                  className="sc-tick"
                  ref={(el) => { tickRefs.current[i] = el; }}
                  style={still ? { transform: yAt(L.keys[rank - 1] + g.h / 2) } : undefined}
                />
              )))}

              {/* where page one ends */}
              <span className="sc-fold" ref={foldRef} style={still ? { transform: yAt(L.fold) } : undefined}>
                <span className="sc-fold-label">Page 2</span>
              </span>

              {/* the stand-ins: what kind of result each is, never a title */}
              {ex.others.map((o, j) => (
                <span
                  key={`o${j}`}
                  className="sc-other"
                  ref={(el) => { otherRefs.current[j] = el; }}
                  style={still ? { transform: yAt(L.others[j]) } : undefined}
                >
                  <span className="sc-other-kind">{o.kind}</span>
                </span>
              ))}

              {step >= 5 ? (
                <svg
                  ref={pointersRef}
                  className={`sc-pointers${still ? ' is-on' : ''}`}
                  viewBox={`0 0 ${g.w} ${ch}`}
                  preserveAspectRatio="none"
                  focusable="false"
                >
                  {pointerPaths(g, cardH).map((d) => <path key={d} d={d} pathLength="1" />)}
                </svg>
              ) : null}

              <div
                className={`sc-you${striking ? ' is-striking' : ''}${still && r === 1 ? ' is-first' : ''}`}
                ref={youRef}
                style={still ? { transform: yAt(L.you) } : undefined}
              >
                {/* your position, hung in the rail at display size */}
                <span className="sc-num" ref={numRef}>{still ? r : null}</span>
                <SheetWords ex={ex} shown={shown} path={path} faults={faults} step={step} skeleton={skeleton} />
              </div>
            </div>
          </div>
        </div>

        {foot ? <span className="sc-foot">An example search. The other results are stand-ins.</span> : null}
      </div>
    </div>
  );
});

/* Your listing alone, finished: first, rewritten, the ink rule round it.
   The close sets it on the red. */
export function FirstSheet({ ex, skeleton = false }) {
  const g = GEOMETRY.wide;
  return (
    <div className="sc-results is-still is-solo" aria-hidden="true" data-nosnippet="">
      <div
        className="sc-art"
        style={{ '--aw': g.w, '--rail': g.rail, '--gutter': 8, '--you': g.you, '--num': g.num, '--num-size': g.numSize, '--q-h': 0, '--foot-h': 0, '--view-h': g.you, '--ch': g.you }}
      >
        <div className="sc-you is-first">
          <span className="sc-num">1</span>
          <SheetWords ex={ex} shown="after" path={ex.after.path} faults={false} step={5} skeleton={skeleton} />
        </div>
      </div>
    </div>
  );
}

export default Results;
