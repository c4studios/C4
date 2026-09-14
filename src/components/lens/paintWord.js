/*
 * The paint stage on /Lens: "We exist to capture the [word] of your brand."
 *
 * High-vis paint put down fast with a brush, with the original page's crayon
 * scribbles back behind it. Each letter arrives as one quick sweep of its
 * body behind a bristled leading edge, sitting a little off true the way a
 * fast hand leaves it. The body is thick paint: two shadow sides under a lit
 * fill, bristle streaks in two directions, grain, a wet highlight and a soft
 * glow. Where the paint went on thickest a drip runs. A crayon shape (star,
 * heart, flower, spiral, lightning, cloud, squiggle, circle, crown, sparkles)
 * draws itself around the word as the letters land. Flecks leave the brush
 * only while it moves; nothing lands after the last sweep. The word holds,
 * then washes out for the next.
 *
 * The visitor's cursor, or finger, is a palette knife through wet paint. The
 * blade carries a load: through the letters it pushes the paint forward (flat
 * copies of the word shifted along the drag, clipped to the blade's band),
 * raises a dark lip either side, scrapes a groove down to the black and
 * throws flecks; off the letters it lays the paint it picked up down on the
 * black in a thinning streak, and whatever is left on the blade when it lifts
 * stays where it was set down.
 *
 * Nothing the knife does invalidates the painted letters: the groove is the
 * backdrop's own black drawn over the top, not a mask, so a stroke costs one
 * clipped copy and a few paths rather than a re-render of the word.
 *
 * Under staticMode the page never calls this; the prerendered sentence uses
 * the static SVG word in Lens.jsx instead.
 */
import gsap from 'gsap';
import { makeScribble, nextShape } from './scribbles';

const NS = 'http://www.w3.org/2000/svg';
const rand = (a, b) => a + Math.random() * (b - a);
let uidCounter = 0;

function el(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const k of Object.keys(attrs)) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}
function trim(g, max) { while (g.childNodes.length > max) g.removeChild(g.firstChild); }
function hexToRgb(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function mix(hex, to, t) { const a = hexToRgb(hex), b = hexToRgb(to); return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; }

/* The leading edge of a loaded brush: a tall band whose right side is
   ragged, the way bristles land. Everything left of it is painted. */
function frontPath() {
  let d = 'M-4000 -1400 L0 -1400';
  for (let y = -1400; y <= 1000; y += 5) {
    const j = Math.sin(y * 0.37) * 4.5 + Math.sin(y * 1.9) * 2.6 + rand(-3.5, 3.5);
    d += ` L${j.toFixed(1)} ${y}`;
  }
  return d + ' L-4000 1000 Z';
}

export function createPaintStage(host, { words, holdMs = 2300, sweepSec = 0.26, staggerSec = 0.14, fadeSec = 0.6 } = {}) {
  const uid = `pw${++uidCounter}`;
  const svg = el('svg', { class: 'paint-svg', preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true' }, host);
  const defs = el('defs', {}, svg);

  /* Bristle streaks in two directions, and paint grain, the body is textured with. */
  const pat = el('pattern', { id: `${uid}-bristle`, width: '11', height: '11', patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-14)' }, defs);
  for (let i = 0; i < 9; i++) {
    el('line', { x1: '0', y1: (i * 1.25).toFixed(2), x2: '11', y2: (i * 1.25 + rand(-0.5, 0.5)).toFixed(2), stroke: i % 2 ? 'rgba(0,0,0,.42)' : 'rgba(255,255,255,.24)', 'stroke-width': rand(0.3, 1.1).toFixed(2) }, pat);
  }
  const pat2 = el('pattern', { id: `${uid}-bristle2`, width: '17', height: '17', patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(31)' }, defs);
  for (let i = 0; i < 6; i++) {
    el('line', { x1: '0', y1: (i * 2.9).toFixed(2), x2: '17', y2: (i * 2.9 + rand(-0.8, 0.8)).toFixed(2), stroke: i % 2 ? 'rgba(0,0,0,.3)' : 'rgba(255,255,255,.3)', 'stroke-width': rand(0.4, 1.4).toFixed(2) }, pat2);
  }
  const grain = el('pattern', { id: `${uid}-grain`, width: '14', height: '14', patternUnits: 'userSpaceOnUse' }, defs);
  for (let i = 0; i < 16; i++) {
    el('circle', { cx: rand(0, 14).toFixed(1), cy: rand(0, 14).toFixed(1), r: rand(0.25, 0.8).toFixed(2), fill: i % 3 ? 'rgba(0,0,0,.35)' : 'rgba(255,255,255,.35)' }, grain);
  }
  /* Wet paint: lit at the top, deep at the foot. */
  const hl = el('linearGradient', { id: `${uid}-wet`, gradientUnits: 'userSpaceOnUse', x1: '0', y1: '-140', x2: '0', y2: '50' }, defs);
  el('stop', { offset: '0', 'stop-color': 'rgba(255,255,255,.36)' }, hl);
  el('stop', { offset: '.45', 'stop-color': 'rgba(255,255,255,.04)' }, hl);
  el('stop', { offset: '1', 'stop-color': 'rgba(0,0,0,.22)' }, hl);
  /* The crayon texture for the scribbles, as on the original page, and the glow. */
  const crayon = el('filter', { id: `${uid}-crayon`, x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs);
  el('feTurbulence', { type: 'turbulence', baseFrequency: '0.035', numOctaves: '4', seed: String(Math.floor(rand(1, 999))), result: 'noise' }, crayon);
  el('feDisplacementMap', { in: 'SourceGraphic', in2: 'noise', scale: '3', xChannelSelector: 'R', yChannelSelector: 'G' }, crayon);
  const glowF = el('filter', { id: `${uid}-glow`, x: '-20%', y: '-40%', width: '140%', height: '180%' }, defs);
  el('feGaussianBlur', { stdDeviation: '11' }, glowF);
  /* A flat copy of the word for the knife to push, and the word's ink as a clip for the lip. */
  const flatG = el('g', { id: `${uid}-flat` }, defs);
  const inkClip = el('clipPath', { id: `${uid}-ink`, clipPathUnits: 'userSpaceOnUse' }, defs);

  const scribG = el('g', { class: 'pw-scribbles', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', filter: `url(#${uid}-crayon)` }, svg);
  const glowG = el('g', { class: 'pw-glow', filter: `url(#${uid}-glow)` }, svg);
  const trailG = el('g', { class: 'pw-trail', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
  const word = el('g', { class: 'pw-word' }, svg);
  const lettersG = el('g', { class: 'pw-letters', id: `${uid}-letters` }, word);
  const dripsG = el('g', { class: 'pw-drips' }, svg);
  const smearG = el('g', { class: 'pw-smear' }, svg);
  const lipG = el('g', { class: 'pw-lip', fill: 'none', 'stroke-linecap': 'round', 'clip-path': `url(#${uid}-ink)` }, svg);
  const grooveG = el('g', { class: 'pw-groove', fill: 'none', stroke: '#000', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
  const dropsG = el('g', { class: 'pw-drops' }, svg);
  const fadeSet = [word, scribG, glowG, dripsG, trailG, smearG, lipG, grooveG, dropsG];

  const FONT = 160;
  const FAMILY = "'Caveat', cursive";
  const measureCtx = document.createElement('canvas').getContext('2d');
  let idx = 0, tl = null, raf = 0, running = false, destroyed = false, painting = false;
  let letters = [], drops = [], smears = [];
  let wordStart = 0, current = null, last = null, maskCount = 0;
  let load = 0, pile = null, vbBottom = 0;

  function clearWord() {
    if (tl) { tl.kill(); tl = null; }
    for (const g of [lettersG, glowG, scribG, dripsG, trailG, smearG, lipG, grooveG, dropsG, flatG, inkClip]) while (g.firstChild) g.removeChild(g.firstChild);
    defs.querySelectorAll('.pw-tmp').forEach((m) => m.remove());
    drops = []; letters = []; smears = []; painting = false; load = 0; pile = null;
    for (const g of fadeSet) g.style.opacity = '';
  }

  function makeText(parent, text, x, extra = {}) {
    const t = el('text', { x: String(x), y: '0', 'font-family': FAMILY, 'font-weight': '700', 'font-size': String(FONT), ...extra }, parent);
    t.textContent = text;
    return t;
  }
  /* Where the ink of a glyph actually is (the SVG extent is the advance cell). */
  function inkBox(ch, x, cell) {
    measureCtx.font = `700 ${FONT}px ${FAMILY}`;
    const m = measureCtx.measureText(ch);
    if (!m || typeof m.actualBoundingBoxAscent !== 'number') return { x0: cell.x, x1: cell.x + cell.w, y0: cell.y, y1: cell.y + cell.h };
    return { x0: x - m.actualBoundingBoxLeft, x1: x + m.actualBoundingBoxRight, y0: -m.actualBoundingBoxAscent, y1: m.actualBoundingBoxDescent };
  }

  function buildWord() {
    current = words[idx];
    const text = current.text, col = current.col;
    svg.setAttribute('viewBox', '0 -200 2400 400');
    const m = makeText(lettersG, text, 0);
    const offsets = [], extents = [];
    for (let i = 0; i < text.length; i++) { offsets.push(i === 0 ? 0 : m.getSubStringLength(0, i)); const e = m.getExtentOfChar(i); extents.push({ x: e.x, y: e.y, w: e.width, h: e.height }); }
    lettersG.removeChild(m);
    /* The ink of each glyph: the SVG extent is the advance cell, most of it empty for lowercase. */
    const inks = text.split('').map((ch, i) => inkBox(ch, offsets[i], extents[i]));
    const ink0 = { x0: Math.min(...inks.map((k) => k.x0)), x1: Math.max(...inks.map((k) => k.x1)), y0: Math.min(...inks.map((k) => k.y0)), y1: Math.max(...inks.map((k) => k.y1)) };
    const iw = ink0.x1 - ink0.x0, ih = ink0.y1 - ink0.y0;
    /* Room around the ink for the scribble, and under it for the drips; the word takes most of the stage. */
    const padX = Math.max(50, iw * 0.19), padTop = Math.max(44, ih * 0.36), padBottom = Math.max(44, ih * 0.36) + 46;
    const vb = { x: ink0.x0 - padX, y: ink0.y0 - padTop, w: iw + padX * 2, h: ih + padTop + padBottom };
    vbBottom = vb.y + vb.h;
    svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);

    letters = text.split('').map((ch, i) => {
      const x = offsets[i], ink = inks[i];
      const cx = (ink.x0 + ink.x1) / 2, cy = (ink.y0 + ink.y1) / 2;
      const rot = rand(-4, 4), dy = rand(-5, 5);
      const tf = `translate(0 ${dy.toFixed(1)}) rotate(${rot.toFixed(2)} ${cx.toFixed(1)} ${cy.toFixed(1)})`;
      /* the fill: the colour, lit toward the top, mixed a little differently for each letter */
      const fillG = el('linearGradient', { id: `${uid}-fill-${++maskCount}`, class: 'pw-tmp', gradientUnits: 'userSpaceOnUse', x1: '0', y1: String(ink0.y0), x2: '0', y2: String(ink0.y1) }, defs);
      el('stop', { offset: '0', 'stop-color': mix(col, '#ffffff', rand(0.16, 0.3)) }, fillG);
      el('stop', { offset: '.55', 'stop-color': col }, fillG);
      el('stop', { offset: '1', 'stop-color': mix(col, '#000000', rand(0.08, 0.2)) }, fillG);
      const fill = `url(#${fillG.id})`;
      const mk = el('mask', { id: `${uid}-f${++maskCount}`, class: 'pw-tmp', maskUnits: 'userSpaceOnUse', x: '-10000', y: '-10000', width: '20000', height: '20000' }, defs);
      const front = el('path', { d: frontPath(), fill: '#fff' }, mk);
      const startX = ink.x0 - 24, endX = ink.x1 + 34;
      front.setAttribute('transform', `translate(${startX.toFixed(1)} 0)`);
      const g = el('g', { transform: tf, mask: `url(#${mk.id})` }, lettersG);
      /* thickness: two shadow sides, then the body, its textures and the wet light */
      makeText(g, ch, x, { fill: mix(col, '#000000', 0.62), opacity: '0.55', transform: 'translate(6.5 7.5)' });
      makeText(g, ch, x, { fill: mix(col, '#000000', 0.5), transform: 'translate(3.5 4)' });
      makeText(g, ch, x, { fill, stroke: mix(col, '#000000', 0.3), 'stroke-width': (FONT * 0.012).toFixed(2), 'paint-order': 'stroke fill', 'stroke-linejoin': 'round' });
      makeText(g, ch, x, { fill: `url(#${uid}-bristle)`, 'fill-opacity': '0.5' });
      makeText(g, ch, x, { fill: `url(#${uid}-bristle2)`, 'fill-opacity': '0.32' });
      makeText(g, ch, x, { fill: `url(#${uid}-grain)`, 'fill-opacity': '0.5' });
      makeText(g, ch, x, { fill: `url(#${uid}-wet)` });
      /* the glow, under everything, arriving with the letter */
      const glow = makeText(glowG, ch, x, { fill: col, opacity: '0', transform: tf });
      /* the flat copy the knife pushes, and the ink the lip is clipped to */
      const fg = el('g', { transform: tf }, flatG);
      makeText(fg, ch, x, { fill: mix(col, '#000000', 0.5), transform: 'translate(3 3.5)' });
      makeText(fg, ch, x, { fill, stroke: mix(col, '#000000', 0.3), 'stroke-width': (FONT * 0.012).toFixed(2), 'paint-order': 'stroke fill' });
      makeText(inkClip, ch, x, { transform: tf });
      return { ch, ink, dy, front, glow, tx: startX, startX, endX, start: i * staggerSec, end: i * staggerSec + sweepSec };
    });

    /* The scribble behind the word, in the word's colour, drawn as the letters land. */
    const shapePaths = makeScribble((ink0.x0 + ink0.x1) / 2, (ink0.y0 + ink0.y1) / 2, vb.w * 0.98, (ih + padTop * 2) * 0.98, nextShape());
    const scribbles = shapePaths.map((d) => {
      const p = el('path', { d, class: 'pw-scribble', stroke: col, 'stroke-width': rand(4.5, 9.5).toFixed(1), opacity: '0.6' }, scribG);
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
      return p;
    });

    tl = gsap.timeline({ paused: true });
    scribbles.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, duration: rand(0.5, 0.8), ease: 'power1.out' }, i * 0.08));
    letters.forEach((L) => {
      tl.to(L, { tx: L.endX, duration: sweepSec, ease: 'power2.out', onUpdate: () => L.front.setAttribute('transform', `translate(${L.tx.toFixed(1)} 0)`) }, L.start);
      tl.to(L.glow, { opacity: 0.6, duration: 0.5, ease: 'power2.out' }, L.start + sweepSec * 0.5);
    });
    /* Drips: where the paint went on thickest it runs, starting as the letter lands. */
    const dripFrom = letters.slice().sort(() => Math.random() - 0.5).slice(0, Math.max(1, Math.round(letters.length * 0.4)));
    dripFrom.forEach((L) => {
      const x = rand(L.ink.x0 + 8, L.ink.x1 - 8), top = L.ink.y1 + L.dy - rand(3, 12), w = rand(4, 8.5);
      const len = Math.min(rand(26, 80), vbBottom - 4 - top);
      if (len < 10) return;
      const line = el('line', { x1: x.toFixed(1), y1: top.toFixed(1), x2: x.toFixed(1), y2: top.toFixed(1), stroke: mix(col, '#000000', rand(0, 0.12)), 'stroke-width': w.toFixed(1), 'stroke-linecap': 'round' }, dripsG);
      const bead = el('ellipse', { cx: x.toFixed(1), cy: top.toFixed(1), rx: (w * 0.72).toFixed(2), ry: (w * 0.92).toFixed(2), fill: col }, dripsG);
      const hi = el('circle', { cx: (x - w * 0.22).toFixed(1), cy: top.toFixed(1), r: (w * 0.28).toFixed(2), fill: 'rgba(255,255,255,.4)' }, dripsG);
      const d = { y: top };
      tl.to(d, { y: top + len, duration: rand(1.3, 2.4), ease: 'power1.out', onUpdate: () => { const yy = d.y.toFixed(1); line.setAttribute('y2', yy); bead.setAttribute('cy', yy); hi.setAttribute('cy', yy); } }, L.end + rand(0.15, 0.55));
    });
    const paintEnd = letters.length ? letters[letters.length - 1].end + 0.15 : 0;
    tl.add(() => { painting = false; }, paintEnd);
    tl.to({}, { duration: holdMs / 1000 }, paintEnd);
    tl.to(fadeSet, { opacity: 0, duration: fadeSec, ease: 'power2.in' }, paintEnd + holdMs / 1000);
    tl.call(() => { idx = (idx + 1) % words.length; nextWord(); });
  }

  function nextWord() { clearWord(); buildWord(); painting = true; wordStart = performance.now(); host.dataset.pwWord = current.text; tl.play(0); }

  /* Flecks: from the brush while it moves, from the knife when it cuts. */
  function spawn(x, y, vx, vy, r, life) {
    const node = el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: r.toFixed(2), fill: current.col }, dropsG);
    drops.push({ x, y, vx, vy, r, life, node });
  }
  function tick() {
    if (!running || destroyed) { raf = 0; return; }
    const now = (performance.now() - wordStart) / 1000;
    if (painting && current) {
      for (const L of letters) {
        if (now < L.start || now > L.end) continue;
        if (Math.random() < 0.6) spawn(L.tx + rand(-4, 4), rand(L.ink.y0, L.ink.y1) + L.dy, rand(0.4, 3.6), rand(-2.8, 0.9), rand(0.5, 1.8), rand(4, 10));
      }
    }
    if (drops.length) {
      const keep = [];
      for (const d of drops) {
        d.x += d.vx; d.y += d.vy; d.vy += 0.24; d.life -= 1;
        if (d.life <= 0) {
          const sp = Math.hypot(d.vx, d.vy);
          if (sp > 2 && d.r > 0.8) {
            /* the faster it lands the longer it draws out */
            const a = Math.atan2(d.vy, d.vx) * 180 / Math.PI, k = Math.min(3, 1 + sp * 0.28);
            el('ellipse', { cx: d.x.toFixed(1), cy: d.y.toFixed(1), rx: (d.r * k).toFixed(2), ry: (d.r * 0.85).toFixed(2), fill: current.col, transform: `rotate(${a.toFixed(1)} ${d.x.toFixed(1)} ${d.y.toFixed(1)})` }, dropsG);
          } else {
            el('circle', { cx: d.x.toFixed(1), cy: d.y.toFixed(1), r: d.r.toFixed(2), fill: current.col }, dropsG);
          }
          d.node.remove();
          continue;
        }
        d.node.setAttribute('cx', d.x.toFixed(1)); d.node.setAttribute('cy', d.y.toFixed(1));
        keep.push(d);
      }
      drops = keep;
    }
    raf = requestAnimationFrame(tick);
  }

  /* The knife. */
  function toSvg(clientX, clientY) {
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: pt.x, y: pt.y };
  }
  function inInk(p) {
    return letters.some((L) => p.x >= L.ink.x0 - 6 && p.x <= L.ink.x1 + 6 && p.y - L.dy >= L.ink.y0 - 6 && p.y - L.dy <= L.ink.y1 + 6);
  }
  function seg(x0, y0, x1, y1) { return `M${x0.toFixed(1)},${y0.toFixed(1)} L${x1.toFixed(1)},${y1.toFixed(1)}`; }
  /* Through the paint: push it forward, raise the lip, open the groove, throw flecks. */
  function smear(x0, y0, x1, y1, w, ux, uy) {
    const col = current.col;
    const nx = -uy, ny = ux, hw = w * 1.3, ex = ux * w * 0.8, ey = uy * w * 0.8;
    const cp = el('clipPath', { id: `${uid}-c${++maskCount}`, class: 'pw-tmp', clipPathUnits: 'userSpaceOnUse' }, defs);
    el('path', { d: `M${(x0 - ex + nx * hw).toFixed(1)},${(y0 - ey + ny * hw).toFixed(1)} L${(x1 + ex + nx * hw).toFixed(1)},${(y1 + ey + ny * hw).toFixed(1)} L${(x1 + ex - nx * hw).toFixed(1)},${(y1 + ey - ny * hw).toFixed(1)} L${(x0 - ex - nx * hw).toFixed(1)},${(y0 - ey - ny * hw).toFixed(1)} Z` }, cp);
    const g = el('g', { 'clip-path': `url(#${cp.id})` }, smearG);
    for (const [k, o] of [[1.2, 1], [2.7, 0.55]]) {
      el('use', { href: `#${uid}-flat`, transform: `translate(${(ux * w * k).toFixed(1)} ${(uy * w * k).toFixed(1)})`, opacity: String(o) }, g);
    }
    smears.push({ g, cp });
    if (smears.length > 30) { const old = smears.shift(); old.g.remove(); old.cp.remove(); }
    /* the lip of paint the blade pushes up either side, then the groove down to the black */
    el('path', { d: seg(x0, y0, x1, y1), stroke: mix(col, '#000000', 0.45), 'stroke-width': (w * 1.2).toFixed(2), opacity: '0.9' }, lipG);
    trim(lipG, 90);
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), steps = Math.max(1, Math.round(len / 6));
    let d = `M${x0.toFixed(1)},${y0.toFixed(1)}`;
    for (let i = 1; i <= steps; i++) { const t = i / steps, j = rand(-w * 0.22, w * 0.22); d += ` L${(x0 + dx * t + nx * j).toFixed(1)},${(y0 + dy * t + ny * j).toFixed(1)}`; }
    el('path', { d, 'stroke-width': (w * 0.72).toFixed(2) }, grooveG);
    trim(grooveG, 90);
    /* the burst off the blade: most of it forward, some of it back over the shoulder */
    const n = drops.length > 160 ? 0 : 3 + Math.floor(rand(0, 4));
    for (let i = 0; i < n; i++) {
      const back = i % 3 === 0, big = Math.random() < 0.12;
      const a = Math.atan2(uy, ux) + (back ? Math.PI + rand(-0.7, 0.7) : rand(-0.8, 0.8));
      const v = back ? rand(1.5, 4) : rand(2.5, 9);
      spawn(x1 + rand(-3, 3), y1 + rand(-3, 3), Math.cos(a) * v, Math.sin(a) * v - rand(0.5, 3), big ? rand(3, 5) : rand(0.5, 2.8), rand(6, 20));
    }
    load = Math.min(1, load + 0.16);
  }
  /* Off the paint with a loaded blade: lay it down on the black, thinning. */
  function deposit(x0, y0, x1, y1) {
    const col = current.col, sw = 3 + load * 14;
    /* a thin blade runs dry: the streak breaks up as the load goes */
    const dry = load < 0.35 ? { 'stroke-dasharray': `${rand(2, 7).toFixed(1)} ${rand(1.5, 5).toFixed(1)}` } : {};
    el('path', { d: seg(x0 + 1.2, y0 + 1.8, x1 + 1.2, y1 + 1.8), stroke: mix(col, '#000000', 0.4), 'stroke-width': (sw * 1.2).toFixed(2), opacity: '0.6', ...dry }, trailG);
    el('path', { d: seg(x0, y0, x1, y1), stroke: col, 'stroke-width': sw.toFixed(2), ...dry }, trailG);
    el('path', { d: seg(x0 - 1, y0 - 1.5, x1 - 1, y1 - 1.5), stroke: 'rgba(255,255,255,.22)', 'stroke-width': (sw * 0.35).toFixed(2), ...dry }, trailG);
    trim(trailG, 240);
    if (load > 0.45 && Math.random() < 0.3 && drops.length < 160) spawn(x1, y1, rand(-1.5, 1.5), rand(-1, 0.5), rand(0.6, 2), rand(6, 14));
    load *= 0.9;
  }
  /* The paint riding ahead of the blade. */
  function movePile(x, y, ux, uy) {
    if (load < 0.05) { if (pile) { pile.remove(); pile = null; } return; }
    if (!pile) {
      pile = el('g', {}, smearG);
      el('ellipse', { fill: current.col }, pile);
      el('ellipse', { fill: 'rgba(255,255,255,.35)' }, pile);
    }
    const r = 3 + load * 10, a = Math.atan2(uy, ux) * 180 / Math.PI, px = x + ux * r * 0.7, py = y + uy * r * 0.7;
    const [body, hi] = pile.childNodes;
    body.setAttribute('cx', px.toFixed(1)); body.setAttribute('cy', py.toFixed(1)); body.setAttribute('rx', (r * 1.15).toFixed(2)); body.setAttribute('ry', (r * 0.8).toFixed(2)); body.setAttribute('transform', `rotate(${a.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})`);
    hi.setAttribute('cx', (px - r * 0.25).toFixed(1)); hi.setAttribute('cy', (py - r * 0.3).toFixed(1)); hi.setAttribute('rx', (r * 0.4).toFixed(2)); hi.setAttribute('ry', (r * 0.25).toFixed(2));
  }
  function liftBlade() {
    /* whatever is on the blade stays where it was set down */
    if (pile) { if (load > 0.15) trailG.appendChild(pile); else pile.remove(); pile = null; }
    load = 0; last = null;
  }
  function onMove(e) {
    host.dataset.pwMoves = String((Number(host.dataset.pwMoves) || 0) + 1);
    if (!running || !current) { last = null; return; }
    if (e.pointerType !== 'mouse' && !(e.buttons & 1)) { liftBlade(); return; }
    const p = toSvg(e.clientX, e.clientY);
    if (!p) return;
    if (last) {
      const dx = p.x - last.x, dy = p.y - last.y, len = Math.hypot(dx, dy);
      if (len > 1.5) {
        const ux = dx / len, uy = dy / len;
        const speed = len / Math.max(1, e.timeStamp - last.t);
        const w = Math.max(5, Math.min(17, 4 + speed * 8));
        if (inInk(p) || inInk(last)) smear(last.x, last.y, p.x, p.y, w, ux, uy);
        else if (load > 0.03) deposit(last.x, last.y, p.x, p.y);
        movePile(p.x, p.y, ux, uy);
      }
    }
    last = { x: p.x, y: p.y, t: e.timeStamp };
  }
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerdown', onMove);
  host.addEventListener('pointerleave', liftBlade);
  host.addEventListener('pointerup', liftBlade);
  host.addEventListener('pointercancel', liftBlade);

  return {
    start() {
      if (destroyed) return;
      const go = () => { if (destroyed) return; running = true; if (!tl) nextWord(); else tl.play(); if (!raf) raf = requestAnimationFrame(tick); };
      if (document.fonts && document.fonts.load) document.fonts.load(`700 ${FONT}px 'Caveat'`).then(go, go); else go();
    },
    stop() { running = false; if (tl) tl.pause(); if (raf) { cancelAnimationFrame(raf); raf = 0; } },
    destroy() {
      destroyed = true; running = false;
      if (raf) cancelAnimationFrame(raf);
      if (tl) tl.kill();
      for (const [ev, fn] of [['pointermove', onMove], ['pointerdown', onMove], ['pointerleave', liftBlade], ['pointerup', liftBlade], ['pointercancel', liftBlade]]) host.removeEventListener(ev, fn);
      svg.remove();
    },
  };
}
