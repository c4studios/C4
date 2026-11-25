/* The hero's shutter and resting readouts, shared by both looks of the eye
   (eyeDirector.js for colour, engravedEye.js for the engraving). One frame
   count per visit: a press on either eye adds to the same roll. This file is
   in the page's own chunk, so neither eye's chunk duplicates it. */

/* What the readouts say while no eye is driving them: the colour eye's poster
   rests at REST_AP (eyeRenderer.js), which reads f/2.8. LensHero renders these. */
export const REST_L = 'f/2.8 · 1/250 · ISO 400';
export const restR = (n) => `FOCUS  AUTO · FRAME ${String(n).padStart(3, '0')}`;

const counts = new WeakMap();

export function frameCount(section) {
  return counts.get(section) || 0;
}

/* Presses on the eye, for both looks. A mouse fires as its button goes down,
   and release() runs when it comes up. A finger or a pen fires as it lifts,
   and only if it moved less than 10 px and the browser didn't take the touch
   for a scroll (pointercancel), so a swipe that starts on the eye scrolls the
   page and takes no picture (review, 25 Nov 2026). Nothing counts outside the
   hero or on a link, a button or the switch. hit(x, y) says whether a point
   in the window is on the eye. */
const CONTROLS = 'a,button,[role="button"],summary,label,input,select,textarea';
const SLOP = 10;

export function watchPresses(section, signal, { hit, press, release }) {
  const opt = { passive: true, signal };
  let id = null;
  let mouse = false;
  let x0 = 0;
  let y0 = 0;
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const t = e.target;
    if (!t || !t.closest || !section.contains(t) || t.closest(CONTROLS)) return;
    if (!hit(e.clientX, e.clientY)) return;
    id = e.pointerId;
    mouse = e.pointerType === 'mouse';
    x0 = e.clientX;
    y0 = e.clientY;
    if (mouse) press(true);
  }, opt);
  const end = (e) => {
    if (e.pointerId !== id) return;
    id = null;
    if (mouse) {
      if (release) release();
      return;
    }
    if (e.type === 'pointerup' && Math.hypot(e.clientX - x0, e.clientY - y0) < SLOP && hit(e.clientX, e.clientY)) press(false);
  };
  window.addEventListener('pointerup', end, opt);
  window.addEventListener('pointercancel', end, opt);
}

/* One frame: count it and fire the flash. */
export function fireShutter(section) {
  const n = frameCount(section) + 1;
  counts.set(section, n);
  const flash = section.querySelector('.lh-flash');
  if (flash && flash.animate) flash.animate([{ opacity: 0.25 }, { opacity: 0 }], { duration: 350, easing: 'ease-out' });
  return n;
}
