/**
 * The case studies on /Lens (9 Oct 2026). Copy, media and schema live in
 * lensStudies.js; the films play in MotionFilm, the short silent clips in
 * LensLoop. They replace the "Selected work" strip and take in the motion
 * section that sat here.
 *
 * Direction, as built:
 *   THESIS. The work arrives straight after the painted word, as proof of it.
 *   Nine studies in two movements, never a grid of matching cards: four that
 *   were shot or made as films, each owning a screen, then five pieces of
 *   motion built into client sites, set closer together.
 *   OWN-WORLD. Lens stays the camera: black ground, Bebas names, Geist for
 *   the account, Caveat for the one note on why it suits, amber viewfinder
 *   corners on every frame. Each client brings one object from its own world
 *   in its own colour: the teal stripe on HVN's gym wall, Sharp's photos laid
 *   in stretcher bond with mortar joints under a string line, DS Racing's five
 *   start lights and pit board, Aqua-Safe's water as a full field, an exhibit
 *   label for Evidence Advisory, garden stakes for Tidy Gardens, a drawing's
 *   title block for Brady, an adding-machine tape for Groverz, and a cinema
 *   ticket for The Rocks.
 *   STORY. A visitor sees what C4 Lens can do, where each piece runs, and why
 *   it suits that business, then goes and checks it on the live site.
 *   FIRST VIEWPORT of the section: the heading and the line "These are examples
 *   of what C4 Lens can do", the reel log beside it, and the HVN film rising
 *   into view below.
 *   FORM. Extension of the existing Lens world, no new faces.
 *   FINISH. Unreviewed and undocumented is unfinished; this build ends with
 *   the finish review, the verdict, DESIGN.md, and every shipping raster
 *   carrying its provenance.
 *
 * Static first. Every word is in the prerendered HTML and nothing hides
 * before a script runs: neither the studies nor the two section headings use a
 * reveal (the page's .lr held a heading at opacity 0 until an observer fired,
 * which a keyboard jump could outrun). Stills get their files a screen early, like
 * the posters, and the prerendered HTML carries their alt text but no file.
 *
 * Behind a button (9 Oct 2026). Caleb liked the studies but they took over the
 * page, so the section now shows its heading, the line "These are examples of
 * what C4 Lens can do." and a "See our case studies" button, and the nine
 * studies wait behind it. "Built into the site" sits behind the same button:
 * Caleb asked for all the entries to go behind one, and two folded sections in
 * a row would put two headings and two buttons between the paint and the
 * services. The studies stay in the HTML under hidden="until-found", so
 * crawlers read them and the browser's find-in-page opens them; nothing inside
 * is rendered, and no poster, still or video is fetched, until they open. The
 * nav's Our Work, a #work link (or a link to any one study) and find-in-page
 * all open them. Opening is a focus pull: the first frames arrive soft and
 * sharpen, the way the lens hunts and locks. "Hide case studies" at the foot
 * folds them away and hands the visitor back to the button.
 */
import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowDown, ArrowUp, ArrowUpRight } from 'lucide-react';
import { Link } from '@/components/c4/SiteLink';
import useStaticMode from '@/hooks/useStaticMode';
import MotionFilm, { FilmWords } from './MotionFilm';
import LensLoop from './LensLoop';
import { WORK_FILM, WORK_SITE, HVN, SHARP, DSR, AQUA, EA, TIDY, BRADY, GROVERZ, ROCKS } from './lensStudies';
import './lens-work.css';

const STUDIES_ID = 'work-studies';
/* A link that points into the studies: the section, one study, or the site group. */
const INTO_STUDIES = /^#(work|in-the-site)(-|$)/;
const askedForStudies = () => typeof window !== 'undefined' && INTO_STUDIES.test(window.location.hash);

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

/* True once the element is within a screen of the viewport. False in the
   prerendered HTML as well, so a browser parsing that HTML has no file to
   fetch early; the alt text is there either way. */
function useNear(ref) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near || !ref.current || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); io.disconnect(); }
    }, { rootMargin: '100% 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near, ref]);
  return near;
}

/* A media query as state. The prerenderer renders at 1280 wide, so it gets
   the wide layout; a phone re-renders on mount (the app renders from scratch). */
function useQuery(query) {
  const get = () => (typeof window === 'undefined' || typeof window.matchMedia !== 'function' ? true : window.matchMedia(query).matches);
  const [match, setMatch] = useState(get);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

function Still({ still, near, sizes, className }) {
  const set = (ext) => still.widths.filter((w) => w <= still.width).map((w) => `${still.base}-${w}.${ext} ${w}w`).join(', ');
  const mid = still.widths[Math.min(1, still.widths.length - 1)];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={near ? set('avif') : undefined} sizes={sizes} />
      <source type="image/webp" srcSet={near ? set('webp') : undefined} sizes={sizes} />
      <img src={near ? `${still.base}-${mid}.webp` : BLANK} width={still.width} height={still.height} alt={still.alt} loading="lazy" decoding="async" />
    </picture>
  );
}

function Out({ site }) {
  return (
    <a className="lw-out" href={site.href} target="_blank" rel="noopener noreferrer">
      {site.label}
      <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.75} />
      <span className="lens-sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/* The study's own words: who, where, what was made, where it runs, and the
   one note on why it suits. The live site is linked inside "where it runs". */
function Account({ study, nameId, madeId, children }) {
  const [before, after] = study.runs.split('{site}');
  return (
    <div className="lw-account">
      <h3 id={nameId} className="lw-name">{study.client}</h3>
      <p className="lw-place">{study.place}</p>
      <p className="lw-made" id={madeId}>{study.made}</p>
      <p className="lw-runs">
        {before}
        {study.site && after !== undefined && <Out site={study.site} />}
        {after}
      </p>
      <p className="lw-fits">{study.fits}</p>
      {children}
      <Link to={study.caseStudy} className="lw-case">
        Read the case study<span className="lens-sr-only">: {study.client}</span>
        <span className="btn-arrow" aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

function Clip({ item, className = '', fit, onPlayingChange, capClass = 'lw-cap' }) {
  return (
    <figure className={`lw-fig ${className}`}>
      <LensLoop clip={item.clip} fit={fit} onPlayingChange={onPlayingChange} />
      {item.caption && <figcaption className={capClass}>{item.caption}</figcaption>}
    </figure>
  );
}

function useStudy(study) {
  const ref = useRef(null);
  const near = useNear(ref);
  const ids = { article: `work-${study.id}`, name: `work-${study.id}-name`, made: `work-${study.id}-made` };
  return { ref, near, ids };
}

/* ── HVN CrossFit: the teal stripe that runs along the gym's walls ────── */
function HvnStudy() {
  const s = HVN;
  const { ref, near, ids } = useStudy(s);
  return (
    <article className="lw-study lw-hvn" id={ids.article} aria-labelledby={ids.name} ref={ref}>
      <div className="lw-hvn-film">
        <MotionFilm film={s.film} bare silent showWords={false} label="HVN CrossFit home page film" describedBy={ids.made} />
      </div>
      <Account study={s} nameId={ids.name} madeId={ids.made} />
      <Clip item={s.game} className="lw-hvn-game" />
      <figure className="lw-hvn-coaches">
        <ul className="lw-hvn-line">
          {s.coaches.stills.map((st) => (
            <li key={st.base}>
              <Still still={st} near={near} sizes="(min-width: 1025px) 300px, (min-width: 768px) 22vw, 44vw" />
            </li>
          ))}
        </ul>
        <figcaption className="lw-cap">{s.coaches.caption}</figcaption>
      </figure>
    </article>
  );
}

/* ── Sharp Bricklaying: laid in stretcher bond, under a string line ───── */
function SharpStudy() {
  const s = SHARP;
  const { ref, near, ids } = useStudy(s);
  const wide = useQuery('(min-width: 900px)');
  const sum = (keys) => keys.reduce((n, k) => n + s.bricks[k].ratio, 0);

  const brick = (key, share) => {
    const b = s.bricks[key];
    const sizes = `(min-width: 900px) ${Math.max(10, Math.round(share * 88))}vw, ${Math.max(20, Math.round(share * 94))}vw`;
    if (b.kind === 'clip') {
      return (
        <figure key={key} className="lw-brick lw-brick--clip">
          <LensLoop clip={b.clip} />
          <figcaption className="lw-brick-cap">{b.caption}</figcaption>
        </figure>
      );
    }
    return (
      <div key={key} className="lw-brick">
        <Still still={b.still} near={near} sizes={sizes} />
      </div>
    );
  };

  let wall;
  if (wide) {
    const pier = s.bricks[s.wall.pier];
    const avg = s.wall.courses.reduce((n, c) => n + sum(c), 0) / s.wall.courses.length;
    const pierShare = (2 * pier.ratio) / (2 * pier.ratio + avg);
    wall = (
      <div
        className="lw-wall lw-wall--pier"
        style={{ aspectRatio: `${(2 * pier.ratio + avg) / 2}`, gridTemplateColumns: `${2 * pier.ratio}fr ${avg}fr` }}
      >
        <div className="lw-pier">{brick(s.wall.pier, pierShare)}</div>
        <div className="lw-courses">
          {s.wall.courses.map((c) => (
            <div key={c.join('-')} className="lw-course" style={{ gridTemplateColumns: c.map((k) => `${s.bricks[k].ratio}fr`).join(' ') }}>
              {c.map((k) => brick(k, (s.bricks[k].ratio / sum(c)) * (1 - pierShare)))}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    wall = (
      <div className="lw-wall">
        {s.wall.phone.map((c) => (
          <div key={c.join('-')} className="lw-course" style={{ aspectRatio: `${sum(c)}`, gridTemplateColumns: c.map((k) => `${s.bricks[k].ratio}fr`).join(' ') }}>
            {c.map((k) => brick(k, s.bricks[k].ratio / sum(c)))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <article className="lw-study lw-sharp" id={ids.article} aria-labelledby={ids.name} ref={ref}>
      <div className="lw-sharp-head">
        <Account study={s} nameId={ids.name} madeId={ids.made} />
        <Clip item={s.loader} className="lw-sharp-loader" />
      </div>
      <div className="lw-sharp-line" aria-hidden="true"><span /><span /></div>
      {wall}
    </article>
  );
}

/* ── DS Racing Karts: five start lights and the pit board ─────────────── */
function DsrStudy() {
  const s = DSR;
  const { ref, ids } = useStudy(s);
  const [racing, setRacing] = useState(false);
  const reelNotes = useId();
  const board = s.reel ? s.board : s.board.filter((row) => row.name !== 'Reel');
  return (
    <article className="lw-study lw-dsr" id={ids.article} aria-labelledby={ids.name} ref={ref}>
      <div className="lw-dsr-headblock">
        {/* The lights stand lit while the header film waits and go out together
            when it runs: lights out, the way their own game starts a race. */}
        <div className={`lw-dsr-gantry${racing ? ' is-out' : ''}`} aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <Clip item={s.header} className="lw-dsr-header" onPlayingChange={setRacing} />
      </div>
      <div className="lw-dsr-side">
        <Account study={s} nameId={ids.name} madeId={ids.made} />
        <dl className="lw-dsr-board">
          {board.map((row) => (
            <div key={row.name}><dt>{row.name}</dt><dd>{row.time}</dd></div>
          ))}
        </dl>
      </div>
      <Clip item={s.chassis} className="lw-dsr-chassis" />
      <Clip item={s.game} className="lw-dsr-game" />
      <Clip item={s.tacho} className="lw-dsr-tacho" />
      {/* The reel slot. Set DSR.reel to null in lensStudies.js and this, its board
          line and its VideoObject all come off together. */}
      {s.reel && (
        <div className="lw-dsr-reel">
          <MotionFilm film={s.reel} bare showWords={false} label="DS Racing Karts reel" describedBy={reelNotes} />
          <div className="lw-dsr-reel-notes">
            <p className="lw-made" id={reelNotes}>{s.reel.description}</p>
            <ul className="mo-credits">{s.reel.credits.map((line) => <li key={line}>{line}</li>)}</ul>
            <FilmWords film={s.reel} />
          </div>
        </div>
      )}
    </article>
  );
}

/* ── Aqua-Safe: the water, as a full field ────────────────────────────── */
function AquaStudy() {
  const s = AQUA;
  const { ref, ids } = useStudy(s);
  return (
    <article className="lw-study lw-aqua" id={ids.article} aria-labelledby={ids.name} ref={ref}>
      <div className="lw-aqua-film">
        <MotionFilm film={s.film} bare label="Aqua-Safe Plumbing promo film" describedBy={ids.made} />
      </div>
      <Account study={s} nameId={ids.name} madeId={ids.made}>
        <ul className="mo-credits lw-credits">{s.film.credits.map((line) => <li key={line}>{line}</li>)}</ul>
      </Account>
    </article>
  );
}

/* ── Evidence Advisory: an exhibit label ──────────────────────────────── */
function EaStudy() {
  const s = EA;
  const { ref, ids } = useStudy(s);
  return (
    <article className="lw-study lw-ea" id={ids.article} aria-labelledby={ids.name} ref={ref}>
      <figure className="lw-fig lw-ea-media"><LensLoop clip={s.clip} /></figure>
      <div className="lw-ea-side">
        <div className="lw-exhibit">
          <p className="lw-exhibit-head" aria-hidden="true">Evidence</p>
          <dl>
            {s.label.map((row) => <div key={row.k}><dt>{row.k}</dt><dd>{row.v}</dd></div>)}
          </dl>
        </div>
        <Account study={s} nameId={ids.name} madeId={ids.made} />
      </div>
    </article>
  );
}

/* ── Tidy Gardens: three stakes in a bed, each with its plant tag ─────── */
function TidyStudy() {
  const s = TIDY;
  const { ref, ids } = useStudy(s);
  return (
    <article className="lw-study lw-tidy" id={ids.article} aria-labelledby={ids.name} ref={ref}>
      <Account study={s} nameId={ids.name} madeId={ids.made} />
      <ul className="lw-tidy-bed">
        {s.stakes.map((st) => (
          <li key={st.name} className="lw-stake">
            <LensLoop clip={st.clip} fit="contain" />
            <p className="lw-tag"><span className="lw-tag-name">{st.name}</span><span className="lw-tag-page">{st.page}</span></p>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ── Brady Electrical: a drawing sheet with its title block ───────────── */
function BradyStudy() {
  const s = BRADY;
  const { ref, ids } = useStudy(s);
  return (
    <article className="lw-study lw-brady" id={ids.article} aria-labelledby={ids.name} ref={ref}>
      <figure className="lw-fig lw-brady-media"><LensLoop clip={s.clip} /></figure>
      <div className="lw-brady-side">
        <Account study={s} nameId={ids.name} madeId={ids.made} />
        <dl className="lw-titleblock">
          {s.block.map((row) => <div key={row.k}><dt>{row.k}</dt><dd>{row.v}</dd></div>)}
        </dl>
      </div>
    </article>
  );
}

/* ── Groverz Tax: an adding-machine tape ──────────────────────────────── */
function GroverzStudy() {
  const s = GROVERZ;
  const { ref, ids } = useStudy(s);
  return (
    <article className="lw-study lw-groverz" id={ids.article} aria-labelledby={ids.name} ref={ref}>
      <Account study={s} nameId={ids.name} madeId={ids.made} />
      <div className="lw-tape">
        <ul aria-label="Some of the symbols it draws">
          {s.tape.map((sym) => <li key={sym}><span aria-hidden="true">+</span>{sym}</li>)}
        </ul>
        <p className="lw-tape-total"><span aria-hidden="true">=</span>groverztax.com.au</p>
      </div>
      <figure className="lw-fig lw-groverz-media"><LensLoop clip={s.clip} /></figure>
    </article>
  );
}

/* ── The Rocks: a ticket for the film night ───────────────────────────── */
function RocksStudy() {
  const s = ROCKS;
  const { ref, ids } = useStudy(s);
  return (
    <article className="lw-study lw-rocks" id={ids.article} aria-labelledby={ids.name} ref={ref}>
      <figure className="lw-fig lw-rocks-media"><LensLoop clip={s.clip} /></figure>
      <div className="lw-rocks-side">
        <Account study={s} nameId={ids.name} madeId={ids.made} />
        <div className="lw-ticket">
          <p className="lw-ticket-stub" aria-hidden="true">Admit one</p>
          <div className="lw-ticket-body">
            <p className="lw-ticket-title" aria-hidden="true">At the Movies</p>
            <blockquote className="lw-quote">
              <p>&ldquo;{s.quote.text}{s.quote.cut && <> <span aria-hidden="true">[&hellip;]</span><span className="lens-sr-only">(quote shortened)</span></>}&rdquo;</p>
              <footer>{s.quote.by}, in their review</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </article>
  );
}

const FILM_STUDIES = { hvn: HvnStudy, sharp: SharpStudy, dsr: DsrStudy, aquasafe: AquaStudy };
const SITE_STUDIES = { ea: EaStudy, tidy: TidyStudy, brady: BradyStudy, groverz: GroverzStudy, rocks: RocksStudy };

export default function LensWork() {
  const log = useMemo(() => [...WORK_FILM, ...WORK_SITE], []);
  const staticMode = useStaticMode();
  /* Open from the first render when the visitor arrived on #work, so the
     studies never flash shut; the prerenderer has no hash, so its HTML is shut. */
  const [open, setOpen] = useState(askedForStudies);
  const [pulling, setPulling] = useState(false);
  const openRef = useRef(open);
  const regionRef = useRef(null);
  const toggleRef = useRef(null);

  /* React 18 can only write `hidden` as a boolean, so until-found is set here,
     before the browser paints. */
  useLayoutEffect(() => {
    openRef.current = open;
    const el = regionRef.current;
    if (!el) return;
    if (open) el.removeAttribute('hidden');
    else el.setAttribute('hidden', 'until-found');
  }, [open]);

  /* Synchronous, so a link's own jump lands on studies that are already open. */
  const reveal = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;
    flushSync(() => {
      setOpen(true);
      setPulling(!staticMode);
    });
  }, [staticMode]);

  const fold = useCallback((handBack) => {
    openRef.current = false;
    flushSync(() => {
      setOpen(false);
      setPulling(false);
    });
    if (INTO_STUDIES.test(window.location.hash)) {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    }
    const btn = toggleRef.current;
    if (handBack && btn) {
      btn.scrollIntoView({ block: 'center', behavior: 'instant' });
      btn.focus({ preventScroll: true });
    }
  }, []);

  useEffect(() => {
    /* find-in-page, or a fragment link straight to a study, opened it */
    const region = regionRef.current;
    const onMatch = () => {
      if (openRef.current) return;
      openRef.current = true;
      setOpen(true);
    };
    if (region) region.addEventListener('beforematch', onMatch);
    /* The nav's Our Work, the reel log, any in-page link into the studies:
       open them first, then let the browser make its own jump. */
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      if (a && INTO_STUDIES.test(a.getAttribute('href'))) reveal();
    };
    /* the hash changed some other way (typed, or back and forward) */
    const onHash = () => {
      if (!INTO_STUDIES.test(window.location.hash)) return;
      reveal();
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ block: 'start' });
    };
    document.addEventListener('click', onClick, true);
    window.addEventListener('hashchange', onHash);
    return () => {
      if (region) region.removeEventListener('beforematch', onMatch);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('hashchange', onHash);
    };
  }, [reveal]);

  /* Arriving on /Lens#work is PageTransition's job since 10 Oct 2026: it lands
     on any fragment and holds it while the page settles. The studies open from
     the first render (useState above), so the target is already in place. */

  /* the focus pull runs once per opening */
  useEffect(() => {
    if (!pulling) return undefined;
    const t = setTimeout(() => setPulling(false), 1200);
    return () => clearTimeout(t);
  }, [pulling]);

  return (
    <section className="slab dark lw" id="work" aria-labelledby="work-title">
      <header className="lw-head">
        <h2 id="work-title">
          WHAT C4 LENS<br /><em>can do.</em>
        </h2>
        <div className="lw-head-side">
          <p className="lw-lede">These are examples of what C4 Lens can do. Each was made for a client, and each one says where it runs.</p>
          <button
            ref={toggleRef}
            type="button"
            className="lw-reveal"
            aria-expanded={open}
            aria-controls={STUDIES_ID}
            onClick={() => (open ? fold(false) : reveal())}
          >
            <span className="lw-reveal-label">{open ? 'Hide case studies' : 'See our case studies'}</span>
            {open
              ? <ArrowUp aria-hidden="true" size={16} strokeWidth={1.5} />
              : <ArrowDown aria-hidden="true" size={16} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      <div id={STUDIES_ID} ref={regionRef} className={`lw-studies${pulling ? ' is-pulling' : ''}`}>
        <nav className="lw-log" aria-label="The case studies">
          <ul>
            {log.map((s) => (
              <li key={s.id}><a href={`#work-${s.id}`}>{s.client}</a></li>
            ))}
          </ul>
        </nav>
        {WORK_FILM.map((s) => {
          const Study = FILM_STUDIES[s.id];
          return <Study key={s.id} />;
        })}

        <section className="lw-site" id="in-the-site" aria-labelledby="site-title">
          <header className="lw-head lw-head--site">
            <h2 id="site-title">
              BUILT INTO<br /><em>the site.</em>
            </h2>
            <p className="lw-lede">Some of the motion we make is built into a client&rsquo;s own website or screens, and runs live in code. The clips below are recordings of each one running.</p>
          </header>
          {WORK_SITE.map((s) => {
            const Study = SITE_STUDIES[s.id];
            return <Study key={s.id} />;
          })}
        </section>

        <div className="lw-foot">
          <button type="button" className="lw-reveal" aria-expanded="true" aria-controls={STUDIES_ID} onClick={() => fold(true)}>
            <span className="lw-reveal-label">Hide case studies</span>
            <ArrowUp aria-hidden="true" size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
