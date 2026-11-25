/* How the /Lens hero eye behaves: where it looks, when it blinks, what the
   aperture does, and the camera readouts. startEye(section) adds the canvas
   over the poster and returns a stop function: stop(true) freezes the eye on
   its last frame while the hero fades it out, stop() frees the GL context and
   removes the canvas. Never run for the prerenderer or reduced motion
   (LensHero decides); without WebGL2 it leaves the poster alone. */
import { createEyeRenderer, restState, REST_AP } from './eyeRenderer.js';
import { fireShutter, frameCount, watchPresses, REST_L, restR } from './shutter.js';

const DEG = Math.PI / 180;
const YAW_MAX = 24 * DEG;
const PITCH_UP = 14 * DEG;
const PITCH_DN = -18 * DEG;
const PLANE = 7; // the pointer is treated as a plane this many iris radii in front
const GAZE_W = 48; // critically damped, settles in about 120 ms
const STOPS = ['1.4', '2', '2.8', '4', '5.6', '8', '11', '16'];
const INTERACTIVE = 'a,button,[role="button"],summary,label,input,select,textarea';

// JS mirror of the shader's lids (open, looking ahead), for the press test.
const lidS = (x) => Math.min(1, Math.max(0, (x + 2.35) / 4.7));
function upperLid(x) {
  const s = lidS(x);
  return -0.28 + 0.2 * s + Math.pow(Math.max(Math.sin(Math.PI * Math.pow(s, 0.83)), 0), 0.62 + 0.33 * s);
}
function lowerLid(x) {
  const s = lidS(x);
  return -0.28 + 0.2 * s - 0.8 * Math.pow(Math.max(Math.sin(Math.PI * Math.pow(s, 1.12)), 0), 0.72 + 0.33 * s);
}

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const easeOut = (t) => 1 - (1 - t) * (1 - t) * (1 - t);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rand = (a, b) => a + Math.random() * (b - a);

/* Set once a device has shown it can't keep the eye moving smoothly. For the
   rest of the visit the colour look is its poster, so switching back to it
   doesn't bake the textures again. */
let tooSlow = false;
const SLOW_FRAMES = 20; // frames measured after the reveal
const SLOW_MS = 34; // an average gap above this is under about 30 frames a second

export function startEye(section) {
  const eyeEl = section.querySelector('.lh-eye');
  const probe = section.querySelector('.lh-probe');
  const outL = section.querySelector('.lh-readout-l');
  const outR = section.querySelector('.lh-readout-r');
  const title = section.querySelector('.lh-title');
  const pkg = section.querySelector('.lh-actions a[href="#packages"]');
  if (!eyeEl || !probe || tooSlow) return () => {};

  // Under the corner marks, so the viewfinder stays over the live eye.
  const canvas = document.createElement('canvas');
  canvas.className = 'lh-canvas';
  const layer = section.querySelector('.lh-layer-colour') || eyeEl;
  layer.insertBefore(canvas, layer.querySelector('.lh-mark'));
  const rd = createEyeRenderer(canvas);
  if (!rd) {
    canvas.remove();
    return () => {};
  }

  // ---- layout, read from the CSS custom properties through the probe ----
  let cssW = 1;
  let cssH = 1;
  let heroTop = 0;
  let heroLeft = 0;
  let heroH = 1;
  const st = restState(0, 0, 100);
  function layout() {
    const cs = getComputedStyle(probe);
    st.cx = parseFloat(cs.left) || 0;
    st.cy = parseFloat(cs.top) || 0;
    st.iris = parseFloat(cs.width) || 100;
    cssW = eyeEl.clientWidth || 1;
    cssH = eyeEl.clientHeight || 1;
    const r = section.getBoundingClientRect();
    heroTop = r.top + window.scrollY;
    heroLeft = r.left + window.scrollX;
    heroH = r.height || 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75, Math.sqrt(2.3e6 / (cssW * cssH)));
    rd.resize(cssW, cssH, dpr);
  }
  layout();

  // ---- input ----
  const now0 = performance.now();
  let px = 0;
  let py = 0;
  let pointerIn = false;
  let lastMove = -1e9;
  let over = false;
  let touchDown = false;
  let touchUpAt = -1e9;
  let focusEl = null;
  let focusX = 0;
  let focusY = 0;
  let shutterAt = -1e9;

  const ac = new AbortController();
  const opt = { passive: true, signal: ac.signal };
  const eyeX = () => heroLeft + st.cx - window.scrollX;
  const eyeY = () => heroTop + st.cy - window.scrollY;

  function onMove(e) {
    if (e.pointerType === 'touch') return;
    px = e.clientX;
    py = e.clientY;
    pointerIn = true;
    lastMove = performance.now();
    focusEl = null;
  }
  function onOver(e) {
    const t = e.target;
    over = !!(t && t.closest && t.closest(INTERACTIVE));
  }
  function onOut(e) {
    if (!e.relatedTarget && e.pointerType !== 'touch') {
      pointerIn = false;
      over = false;
    }
  }
  function onEye(cx, cy) {
    if (!live) return false;
    const x = (cx - eyeX()) / st.iris;
    const y = (eyeY() - cy) / st.iris;
    return Math.abs(x) < 2.3 && y < upperLid(x) && y > lowerLid(x);
  }
  function onPress() {
    shutterAt = performance.now();
    fireShutter(section);
  }
  function onTouch(e) {
    const t = e.touches && e.touches[0];
    if (t) {
      px = t.clientX;
      py = t.clientY;
      touchDown = true;
      lastMove = performance.now();
      focusEl = null;
    } else if (e.type === 'touchend' || e.type === 'touchcancel') {
      touchDown = false;
      touchUpAt = performance.now();
    }
  }
  function onFocusIn(e) {
    const t = e.target;
    if (!t || t === document.body || !t.getBoundingClientRect) return;
    let visible = false;
    try {
      visible = t.matches(':focus-visible');
    } catch {
      visible = false;
    }
    if (!visible) return;
    const r = t.getBoundingClientRect();
    focusEl = t;
    focusX = r.left + r.width / 2 + window.scrollX;
    focusY = r.top + r.height / 2 + window.scrollY;
  }
  function onFocusOut(e) {
    if (e.target === focusEl) focusEl = null;
  }

  document.addEventListener('pointermove', onMove, opt);
  document.addEventListener('pointerover', onOver, opt);
  document.addEventListener('pointerout', onOut, opt);
  watchPresses(section, ac.signal, { hit: onEye, press: onPress });
  document.addEventListener('touchstart', onTouch, opt);
  document.addEventListener('touchmove', onTouch, opt);
  document.addEventListener('touchend', onTouch, opt);
  document.addEventListener('touchcancel', onTouch, opt);
  document.addEventListener('focusin', onFocusIn, opt);
  document.addEventListener('focusout', onFocusOut, opt);

  // ---- motion state ----
  let yaw = 0;
  let pitch = 0;
  let vYaw = 0;
  let vPitch = 0;
  let tYaw = 0;
  let tPitch = 0;
  let ap = REST_AP;
  let vAp = 0;
  let ptrA = 0;
  let live = false;
  let liveAt = 0;
  let baked = false;
  let nextBlink = 0;
  let blinkAt = -1e9;
  let nextSacc = 0;
  let saccYaw = 0;
  let saccPitch = 0;
  let nextGlance = 0;
  let glanceUntil = 0;
  let glanceX = 0;
  let glanceY = 0;
  let readX0 = 0;
  let readX1 = 0;
  let readY = 0;
  let lastF = -1;
  let lastMode = ''; // write on the first live frame: the engraved eye may have held the readouts
  let lastFrames = 0;
  let stepV = 0;

  function aimAt(tx, ty) {
    const dx = (tx - eyeX()) / st.iris;
    const dy = (eyeY() - ty) / st.iris;
    tYaw = clamp(Math.atan2(dx, PLANE), -YAW_MAX, YAW_MAX);
    tPitch = clamp(Math.atan2(dy, Math.hypot(dx, PLANE)), PITCH_DN, PITCH_UP);
  }

  function step(v, vel, target, w, dt) {
    const y0 = v - target;
    const c = vel + w * y0;
    const e = Math.exp(-w * dt);
    stepV = (vel - w * c * dt) * e;
    return target + (y0 + c * dt) * e;
  }

  // Dev only: a handle so the still scripts can pose the eye.
  const dbg = import.meta.env && import.meta.env.DEV ? { pose: null, frames: 0, st, rd } : null;
  if (dbg) window.__lhEye = dbg;

  // ---- the loop ----
  let raf = 0;
  let running = false;
  let inView = true;
  let last = 0;
  let stopped = false;
  const want = () => !stopped && inView && !document.hidden && !rd.isLost();

  // Back to the poster: the canvas goes and the readouts return to rest.
  function fallback() {
    stopped = true;
    cancelAnimationFrame(raf);
    canvas.remove();
    if (outL) outL.textContent = REST_L;
    if (outR) outR.textContent = restR(frameCount(section));
  }
  // A context lost while the loop is paused (hero off screen, tab hidden)
  // falls back at once, not on a frame that never comes.
  canvas.addEventListener('webglcontextlost', fallback, opt);

  let slowN = 0;
  let slowSum = 0;

  function frame(now) {
    if (rd.isLost()) {
      fallback();
      return;
    }
    if (!want()) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
    const gap = now - last;
    const dt = clamp(gap / 1000, 0, 0.05);
    last = now;

    // Too slow for this device: from 300 ms after the reveal, the first 20
    // frames. A gap over a second is the loop resuming after a pause, not a
    // slow frame, so it isn't counted (review, 25 Nov 2026).
    if (live && slowN < SLOW_FRAMES && now - liveAt > 300 && gap < 1000) {
      slowN++;
      slowSum += gap;
      if (slowN === SLOW_FRAMES && slowSum / slowN > SLOW_MS) {
        tooSlow = true;
        fallback();
        return;
      }
    }
    if (dbg) dbg.frames++;

    if (!baked) {
      baked = rd.bakeStep();
      if (!baked) return;
      // First live frame matches the poster; reveal it, then the entrance runs.
      rd.render(st);
      canvas.classList.add('is-live');
      live = true;
      liveAt = now;
      nextBlink = now + 2600 + rand(4000, 9000);
      nextSacc = now + 2600;
      nextGlance = now + 2600 + rand(6000, 9000);
      if (title) {
        const r = title.getBoundingClientRect();
        readX0 = r.left + r.width * 0.06 + window.scrollX;
        readX1 = r.left + r.width * 0.94 + window.scrollX;
        readY = r.top + r.height * 0.5 + window.scrollY;
      }
      return;
    }

    const te = now - liveAt;
    const entrance = te < 2300;
    let open = 1;
    let apTarget = REST_AP;
    let bias = 0;
    let soft = 0;
    let apOverride = -1;
    const followTouch = touchDown || now - touchUpAt < 1000;
    const followPtr = pointerIn && now - lastMove < 2500;
    const scrollP = clamp((window.scrollY - heroTop) / (heroH * 0.85), 0, 1);

    if (entrance) {
      // blink over the swap, pupil wide and soft, then settle and read the headline
      if (te < 110) open = 1 - (te / 110) * (te / 110);
      else if (te < 150) open = 0;
      else if (te < 310) open = 1 - Math.pow(1 - (te - 150) / 160, 2);
      if (te >= 110) {
        const k = clamp((te - 310) / 700, 0, 1);
        apOverride = REST_AP * easeOut(k);
        const f = 1 - easeInOut(k);
        bias = 3.2 * f;
        soft = f;
      }
      if (te < 380) {
        tYaw = 0;
        tPitch = 0;
      } else if (te < 1560 && title) {
        const i = Math.min(4, Math.floor((te - 380) / 236));
        aimAt(readX0 + ((readX1 - readX0) * i) / 4 - window.scrollX, readY - window.scrollY);
      } else {
        tYaw = 0;
        tPitch = 0;
      }
    } else {
      // where to look
      if (focusEl) {
        aimAt(focusX - window.scrollX, focusY - window.scrollY);
      } else if (followTouch || followPtr) {
        aimAt(px, py);
      } else {
        // idle: straight at the visitor, small saccades, a glance at the packages button
        if (now > nextSacc) {
          const a = Math.random() * Math.PI * 2;
          const m = rand(0.3, 0.8) * DEG;
          saccYaw = Math.cos(a) * m;
          saccPitch = Math.sin(a) * m;
          nextSacc = now + rand(1000, 2000);
        }
        if (now > nextGlance && pkg) {
          const r = pkg.getBoundingClientRect();
          glanceX = r.left + r.width / 2 + window.scrollX;
          glanceY = r.top + r.height / 2 + window.scrollY;
          glanceUntil = now + 1000;
          nextGlance = now + rand(6000, 9000);
        }
        if (now < glanceUntil) aimAt(glanceX - window.scrollX, glanceY - window.scrollY);
        else {
          tYaw = saccYaw;
          tPitch = saccPitch;
        }
      }
      // blinks
      if (now > nextBlink && now - shutterAt > 400) {
        blinkAt = now;
        nextBlink = now + rand(4000, 9000);
      }
      const tb = now - blinkAt;
      if (tb < 110) open = 1 - (tb / 110) * (tb / 110);
      else if (tb < 270) open = 1 - Math.pow(1 - (tb - 110) / 160, 2);
      // interest opens the pupil a little
      const near = followPtr && Math.hypot(px - eyeX(), py - eyeY()) < st.iris;
      if (over || near || focusEl) apTarget -= 0.12;
    }

    // scrolling away: look down, stop down
    tPitch = tPitch * (1 - scrollP) + -14 * DEG * scrollP;
    apTarget = apTarget * (1 - scrollP) + scrollP;

    yaw = step(yaw, vYaw, tYaw, GAZE_W, dt);
    vYaw = stepV;
    pitch = step(pitch, vPitch, tPitch, GAZE_W, dt);
    vPitch = stepV;
    ap = step(ap, vAp, apTarget, 9, dt);
    vAp = stepV;
    let apOut = apOverride >= 0 ? apOverride : ap;
    if (apOverride >= 0) {
      ap = apOverride;
      vAp = 0;
    }
    // the shutter: a pinhole in 70 ms, open again in 220 ms
    const ts = now - shutterAt;
    if (ts < 70) apOut = apOut + (0.985 - apOut) * easeOut(ts / 70);
    else if (ts < 290) apOut = 0.985 + (apOut - 0.985) * easeInOut((ts - 70) / 220);

    const ptrOn = !entrance && (followPtr || touchDown) && !focusEl;
    ptrA = clamp(ptrA + (ptrOn ? dt : -dt) * 5, 0, 1);

    st.yaw = yaw;
    st.pitch = pitch;
    st.ap = apOut;
    st.breath = 1 + 0.015 * Math.sin((now - now0) * 0.0014);
    st.open = open;
    st.ptrX = (px - eyeX()) / st.iris;
    st.ptrY = (eyeY() - py) / st.iris;
    st.ptrA = ptrA;
    st.bias = bias;
    st.soft = soft;
    st.time = (now - now0) / 1000;

    if (dbg && dbg.pose) Object.assign(st, dbg.pose);
    rd.render(st);

    // readouts: the eye's real state
    const fi = clamp(Math.round(st.ap * 7), 0, 7);
    if (fi !== lastF && outL) {
      outL.textContent = `f/${STOPS[fi]} · 1/250 · ISO 400`;
      lastF = fi;
    }
    const frames = frameCount(section);
    const mode = focusEl || (over && followPtr) ? 'LOCKED' : followPtr || followTouch ? 'TRACKING' : 'AUTO';
    if (outR && (mode !== lastMode || frames !== lastFrames)) {
      outR.textContent = `FOCUS  ${mode} · FRAME ${String(frames).padStart(3, '0')}`;
      lastMode = mode;
      lastFrames = frames;
    }
  }

  function kick() {
    if (!running && want()) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  const io = new IntersectionObserver((entries) => {
    inView = entries[entries.length - 1].isIntersecting;
    kick();
  });
  io.observe(section);
  const ro = new ResizeObserver(() => {
    layout();
    if (live && !running) rd.render(st);
  });
  ro.observe(section);
  document.addEventListener('visibilitychange', kick, opt);
  kick();

  let halted = false;
  let disposed = false;
  return function stop(freeze) {
    if (!halted) {
      halted = true;
      stopped = true;
      cancelAnimationFrame(raf);
      ac.abort();
      io.disconnect();
      ro.disconnect();
      if (dbg && window.__lhEye === dbg) delete window.__lhEye;
    }
    // A frozen canvas keeps showing its last frame until it is disposed.
    if (freeze || disposed) return;
    disposed = true;
    const lose = rd.isLost() ? null : rd.gl.getExtension('WEBGL_lose_context');
    rd.dispose();
    if (lose) lose.loseContext(); // free the context now, not at garbage collection
    canvas.remove();
  };
}
