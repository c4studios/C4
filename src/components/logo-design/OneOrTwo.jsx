/*
 * "One or two?" The examiner's question, asked of a browser tab.
 *
 * The same 16-pixel square twice: one holds the whole mark, two holds the 4
 * on its own, the way public/favicon.png has it. Each is blown up pixel by
 * pixel: the browser's own canvas draws it into a real 16 x 16 bitmap on a
 * light tab's white, then it's scaled up with every pixel kept square, so
 * what's blown up is what a 16-pixel icon really is.
 *
 * Under them, both icons sit at real size in two tab bars, a light one and a
 * dark one, in the colours Chrome uses. Picking one drops its square into
 * both bars and makes it the open tab there, and the note answers the pick.
 * Everything the note says is already on the page, so nothing is gated on
 * the pick, and the prerender carries every fact.
 */
import { useEffect, useRef, useState } from 'react';
import useStaticMode from '@/hooks/useStaticMode';
import { MARK_SOURCE, BOX, DEEP, FACTS } from './geometry';
import { FourG, MarkG } from './Pieces';

const polygon = (points) => {
  const n = points.trim().split(/\s+/).map(Number);
  const p = new Path2D();
  for (let i = 0; i < n.length; i += 2) {
    if (i) p.lineTo(n[i], n[i + 1]);
    else p.moveTo(n[i], n[i + 1]);
  }
  p.closePath();
  return p;
};

/* where a box sits, centred, in a 16 x 16 square */
const place = (box) => {
  const s = 16 / Math.max(box.w, box.h);
  return { s, x: (16 - box.w * s) / 2, y: (16 - box.h * s) / 2 };
};

const word = (n) => ({ 10: 'ten', 16: 'sixteen' }[n] || String(n));

function Pixels({ whole, canvasRef }) {
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || typeof Path2D === 'undefined') return;
    const g = cv.getContext('2d');
    if (!g) return;
    const box = whole ? BOX.mark : BOX.four;
    const { s, x, y } = place(box);
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, 16, 16);
    g.setTransform(s, 0, 0, s, x - box.x * s, y - box.y * s);
    if (whole) {
      g.fillStyle = DEEP.c;
      g.fill(new Path2D(MARK_SOURCE.cArc));
    }
    g.fillStyle = DEEP.red;
    g.fill(polygon(MARK_SOURCE.fourBody));
    g.fillStyle = DEEP.green;
    g.fill(polygon(MARK_SOURCE.fourArm));
  }, [whole, canvasRef]);
  return <canvas ref={canvasRef} width="16" height="16" className="ld-px-canvas" />;
}

/* the icon at real size, drawn by the browser on whatever is behind it */
function Icon({ whole, iconRef }) {
  const box = whole ? BOX.mark : BOX.four;
  const { s, x, y } = place(box);
  const h = box.h * s;
  return (
    <svg ref={iconRef} className="ld-icon16" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {whole ? <MarkG x={x} y={y} h={h} pair={DEEP} /> : <FourG x={x} y={y} h={h} pair={DEEP} />}
    </svg>
  );
}

const OPTIONS = [
  { n: 1, whole: true, name: 'The whole mark', label: 'One: the whole mark in a sixteen-pixel square' },
  { n: 2, whole: false, name: 'The 4 on its own', label: 'Two: the 4 on its own in a sixteen-pixel square' },
];
const TONES = [
  { key: 'light', name: 'A light tab' },
  { key: 'dark', name: 'A dark tab' },
];

const NOTE = {
  1: `You picked one. In the tabs, its C all but vanishes on the light one, and its 4 is ${word(FACTS.fourTallWithC)} pixels tall in both.`,
  2: `You picked two, the one in our tab. Its 4 is ${word(FACTS.fourTallAlone)} pixels tall in both tabs.`,
};

export default function OneOrTwo() {
  const staticMode = useStaticMode();
  const [pick, setPick] = useState(null);
  const canvases = { 1: useRef(null), 2: useRef(null) };
  const icons = useRef({});

  /* drop the picked square into both tab bars, at real size */
  const drop = (n) => {
    const src = canvases[n].current;
    if (staticMode || !src || typeof src.animate !== 'function') return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const a = src.getBoundingClientRect();
    TONES.forEach(({ key }) => {
      const target = icons.current[`${key}-${n}`];
      if (!target) return;
      const b = target.getBoundingClientRect();
      const ghost = document.createElement('canvas');
      ghost.width = 16;
      ghost.height = 16;
      ghost.getContext('2d')?.drawImage(src, 0, 0);
      ghost.className = 'ld-px-ghost';
      ghost.setAttribute('aria-hidden', 'true');
      Object.assign(ghost.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
      document.body.appendChild(ghost);
      const to = `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${b.width / a.width})`;
      ghost.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 0.95 },
          { transform: to, opacity: 0.95, offset: 0.82 },
          { transform: to, opacity: 0 },
        ],
        { duration: 760, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      ).finished.finally(() => ghost.remove());
    });
  };

  const choose = (n) => {
    setPick(n);
    drop(n);
  };

  return (
    <section className="ld-one" aria-labelledby="ld-one-h">
      <div className="ld-frame ld-one-grid">
        <div className="ld-one-text">
          <h2 className="ld-h2" id="ld-one-h">One or two?</h2>
          <p className="ld-say">
            Here&rsquo;s the same sixteen-pixel square twice. One is the whole mark. Two is the 4 on its own.
            Which reads better?
          </p>
        </div>
        <div className="ld-one-test">
          <div className="ld-one-choices" role="group" aria-label="Pick the one that reads better">
            {OPTIONS.map((o) => (
              <button
                key={o.n}
                type="button"
                className="ld-choice"
                aria-pressed={pick === o.n}
                aria-label={o.label}
                onClick={() => choose(o.n)}
              >
                <span className="ld-choice-n" aria-hidden="true">{o.n}</span>
                <span className="ld-px" aria-hidden="true"><Pixels whole={o.whole} canvasRef={canvases[o.n]} /></span>
                <span className="ld-choice-name" aria-hidden="true">{o.name}</span>
              </button>
            ))}
          </div>
          <figure className="ld-tabs">
            {TONES.map((t) => (
              <div key={t.key} className={`ld-tabbar ld-tabbar--${t.key}`} aria-hidden="true">
                {OPTIONS.map((o) => (
                  <span key={o.n} className={`ld-tabchip${pick === o.n ? ' is-open' : ''}`}>
                    <Icon whole={o.whole} iconRef={(el) => { icons.current[`${t.key}-${o.n}`] = el; }} />
                    <span>{o.n === 1 ? 'One' : 'Two'}</span>
                  </span>
                ))}
                <span className="ld-tabbar-name">{t.name}</span>
              </div>
            ))}
            <figcaption className="ld-tabs-cap">Both at real size, in a light browser tab and a dark one.</figcaption>
          </figure>
          <p className="ld-choice-note" aria-live="polite">{pick ? NOTE[pick] : ''}</p>
        </div>
        <p className="ld-say ld-one-answer">
          We went with two. Sometimes less is more, and here you can measure it: without the C, the 4 fills the
          square, {word(FACTS.fourTallAlone)} pixels tall instead of {word(FACTS.fourTallWithC)}. On a light tab
          the C would all but vanish anyway.
        </p>
      </div>
    </section>
  );
}
