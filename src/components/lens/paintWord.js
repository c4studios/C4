/*
 * The paint stage on /Lens: "We exist to capture the [word] of your brand."
 *
 * Sixth version, 2 Oct 2026. Caleb's brief: the word "painted in" quickly,
 * in neon paint against the black, with small splatters like real paint, and
 * a cursor or finger that strikes through it and mushes it around, with real
 * physics. It replaces the knife-and-crayon version (round eight in
 * DESIGN.md).
 *
 * So the word is paint in a fluid. A WebGL2 stable-fluids solver (Stam's
 * method: advect, then project with a Jacobi pressure solve, plus a little
 * vorticity) runs on a coarse velocity grid, and the paint is a dye field at
 * screen resolution that the velocity carries. The pointer pushes the
 * velocity; the paint goes where the fluid goes, parting around the finger
 * and piling ahead of it, and two colours that meet mix. Velocity dies off
 * fast, because paint is thick; the paint itself never fades.
 *
 * Painting in: each letter is one quick sweep of a brush loaded with two
 * neon colours (a split load, so the colour turns inside every stroke). The
 * word is rasterised once into a colour texture and a timing texture (the
 * moment the brush front passes each pixel), and each frame a deposit pass
 * adds the paint the front has just passed and nudges it the way the brush
 * travels. Flecks leave the brush as it goes and land as small drops. A fast
 * strike through wet paint throws drops of whatever colour it hit.
 *
 * The look: the dye's thickness is the paint's height. The display pass cuts
 * the paint at a thickness, so it keeps a hard edge however far it is pushed
 * and breaks into islands when dragged thin, lights it from the top left for
 * a wet sheen, and lays a soft glow of its own colour onto the black.
 *
 * It runs only while the section is on screen (Lens.jsx's observer calls
 * start and stop) and stops drawing altogether when nothing is moving.
 * Without WebGL2 float render targets it returns null and the page shows the
 * static word; prerender and reduced motion never call it.
 */

const rand = (a, b) => a + Math.random() * (b - a);
const FAMILY = "'Caveat', cursive";

/* The physics, tuned by eye against real paint on a board. */
const VEL_DISSIPATION = 5.2;  // per second: thick paint stops when the finger does
const CURL = 1.5;             // a little vorticity, so pushed paint folds over itself
const PRESSURE_ITERATIONS = 24;
const PUSH = 1.05;            // the fluid at the fingertip moves at about the finger's speed
const GLOW = 0.62;

/* ── shaders ─────────────────────────────────────────────────────────── */
const VS = `#version 300 es
in vec2 aPos;
uniform vec2 uTexel;
out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0); vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y); vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 o;
`;

const GAUSS = `
float gauss(vec2 point, float aspect, vec2 dir, float stretch, float radius) {
  vec2 p = vUv - point; p.x *= aspect;
  vec2 q = vec2(dot(p, dir), dot(p, vec2(-dir.y, dir.x)));
  q.x /= stretch;
  return exp(-dot(q, q) / radius);
}`;

const FS = {
  copy: `${HEAD}uniform sampler2D uSrc; uniform float uMul;
void main() { o = texture(uSrc, vUv) * uMul; }`,

  /* Additive: drawn with blending into the target, scissored to the splat. */
  splat: `${HEAD}uniform vec2 uPoint; uniform vec4 uValue; uniform float uRadius; uniform float uAspect; uniform vec2 uDir; uniform float uStretch;
${GAUSS}
void main() { o = uValue * gauss(uPoint, uAspect, uDir, uStretch, uRadius); }`,

  /* A drop of the paint the probe found under the pointer, at full body. */
  fling: `${HEAD}uniform sampler2D uProbe; uniform vec2 uPoint; uniform float uAmount; uniform float uRadius; uniform float uAspect; uniform vec2 uDir; uniform float uStretch;
${GAUSS}
void main() {
  vec4 s = texture(uProbe, vec2(0.5));
  vec4 drop = vec4(s.rgb / max(s.a, 1e-3), 1.0) * step(0.32, s.a) * uAmount;
  o = drop * gauss(uPoint, uAspect, uDir, uStretch, uRadius);
}`,

  probe: `${HEAD}uniform sampler2D uSrc; uniform vec2 uAt; uniform vec2 uSpread;
void main() {
  o = (texture(uSrc, uAt) * 2.0
    + texture(uSrc, uAt + vec2(uSpread.x, 0.0)) + texture(uSrc, uAt - vec2(uSpread.x, 0.0))
    + texture(uSrc, uAt + vec2(0.0, uSpread.y)) + texture(uSrc, uAt - vec2(0.0, uSpread.y))) / 6.0;
}`,

  /* The brush: paint for every pixel the front passed since the last frame,
     and the same mask as a push in the velocity. The front is ragged by a
     row of bristles. */
  deposit: `${HEAD}uniform sampler2D uWord; uniform sampler2D uTime; uniform float uPrev; uniform float uNow; uniform float uRows; uniform float uJitter; uniform float uSeed; uniform float uDye; uniform vec2 uPush;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec4 w = texture(uWord, vUv);
  float t = texture(uTime, vUv).r + (hash(vec2(floor(vUv.y * uRows), uSeed)) - 0.5) * uJitter;
  float m = (t > uPrev && t <= uNow) ? w.a : 0.0;
  o = uDye > 0.5 ? vec4(w.rgb * m, m) : vec4(uPush * m, 0.0, 0.0);
}`,

  advect: `${HEAD}uniform sampler2D uVel; uniform sampler2D uSrc; uniform vec2 uSimTexel; uniform float uDt; uniform float uDiss;
void main() {
  vec2 c = vUv - uDt * texture(uVel, vUv).xy * uSimTexel;
  o = texture(uSrc, c) / (1.0 + uDiss * uDt);
}`,

  divergence: `${HEAD}uniform sampler2D uVel;
void main() {
  float L = texture(uVel, vL).x, R = texture(uVel, vR).x, T = texture(uVel, vT).y, B = texture(uVel, vB).y;
  vec2 C = texture(uVel, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,

  curl: `${HEAD}uniform sampler2D uVel;
void main() {
  float L = texture(uVel, vL).y, R = texture(uVel, vR).y, T = texture(uVel, vT).x, B = texture(uVel, vB).x;
  o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,

  vorticity: `${HEAD}uniform sampler2D uVel; uniform sampler2D uCurl; uniform float uCurlK; uniform float uDt;
void main() {
  float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x, T = texture(uCurl, vT).x, B = texture(uCurl, vB).x, C = texture(uCurl, vUv).x;
  vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  f /= length(f) + 1e-4;
  f *= uCurlK * C;
  f.y *= -1.0;
  vec2 v = texture(uVel, vUv).xy + f * uDt;
  o = vec4(clamp(v, -1500.0, 1500.0), 0.0, 1.0);
}`,

  pressure: `${HEAD}uniform sampler2D uP; uniform sampler2D uDiv;
void main() {
  float L = texture(uP, vL).x, R = texture(uP, vR).x, T = texture(uP, vT).x, B = texture(uP, vB).x;
  o = vec4((L + R + B + T - texture(uDiv, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`,

  gradient: `${HEAD}uniform sampler2D uP; uniform sampler2D uVel;
void main() {
  float L = texture(uP, vL).x, R = texture(uP, vR).x, T = texture(uP, vT).x, B = texture(uP, vB).x;
  o = vec4(texture(uVel, vUv).xy - vec2(R - L, T - B), 0.0, 1.0);
}`,

  /* The glow: the paint's colour, low resolution, blurred out onto the black. */
  bright: `${HEAD}uniform sampler2D uSrc;
void main() {
  vec4 d = texture(uSrc, vUv);
  o = vec4(d.rgb / max(d.a, 1e-3) * smoothstep(0.2, 0.45, d.a), 1.0);
}`,

  blur: `${HEAD}uniform sampler2D uSrc; uniform vec2 uDir;
void main() {
  vec3 c = texture(uSrc, vUv).rgb * 0.227027;
  c += (texture(uSrc, vUv + uDir * 1.3846).rgb + texture(uSrc, vUv - uDir * 1.3846).rgb) * 0.316216;
  c += (texture(uSrc, vUv + uDir * 3.2308).rgb + texture(uSrc, vUv - uDir * 3.2308).rgb) * 0.070270;
  o = vec4(c, 1.0);
}`,

  /* Paint. Thickness is height: the surface normal comes from its slope, the
     edge is a cut at a thickness, the light is a soft key from the top left
     with a tight wet highlight. Thick paint rounds over instead of cliffing. */
  display: `${HEAD}uniform sampler2D uDye; uniform sampler2D uGlow; uniform vec2 uDyeTexel; uniform float uFade; uniform float uGlowK;
float h(vec2 uv) { float a = texture(uDye, uv).a; return a / (1.0 + 0.45 * a); }
void main() {
  vec4 d = texture(uDye, vUv);
  vec2 e = uDyeTexel * 1.6;
  vec3 n = normalize(vec3((h(vUv - vec2(e.x, 0.0)) - h(vUv + vec2(e.x, 0.0))) * 2.4,
                          (h(vUv - vec2(0.0, e.y)) - h(vUv + vec2(0.0, e.y))) * 2.4, 1.0));
  float cover = smoothstep(0.26, 0.36, d.a);
  vec3 col = d.rgb / max(d.a, 1e-3);
  vec3 L = normalize(vec3(-0.5, 0.62, 0.85));
  float diff = max(dot(n, L), 0.0);
  float spec = pow(max(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0), 64.0);
  vec3 lit = min(col * (0.34 + 0.8 * diff) + spec * 0.6, vec3(1.0));
  vec3 glow = texture(uGlow, vUv).rgb * uGlowK;
  float gmax = min(max(glow.r, max(glow.g, glow.b)), 1.0);
  o = vec4(lit * cover + glow * (1.0 - cover), cover + gmax * (1.0 - cover)) * uFade;
}`,
};

/* ── colour ──────────────────────────────────────────────────────────── */
function hexRgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function shade(hex, k) {
  const to = k > 0 ? 255 : 0, a = Math.abs(k);
  return `rgb(${hexRgb(hex).map((v) => Math.round(v + (to - v) * a)).join(',')})`;
}
function mix01(a, b, t) { const x = hexRgb(a), y = hexRgb(b); return x.map((v, i) => (v + (y[i] - v) * t) / 255); }

export function createPaintStage(host, { words, holdMs = 2400, sweepSec = 0.24, staggerSec = 0.11, fadeSec = 0.55, onFail } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'paint-gl';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
  const bail = () => { canvas.remove(); return null; };
  if (!gl) return bail();
  if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) return bail();

  /* programs */
  function shader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }
  const vs = shader(gl.VERTEX_SHADER, VS);
  const P = {};
  for (const [name, src] of Object.entries(FS)) {
    const fs = shader(gl.FRAGMENT_SHADER, src);
    if (!vs || !fs) return bail();
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return bail();
    const u = {};
    for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i < n; i++) {
      const info = gl.getActiveUniform(p, i);
      u[info.name] = gl.getUniformLocation(p, info.name);
    }
    P[name] = { p, u };
  }

  /* one big triangle covers any target */
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const F = {
    rgba: [gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT],
    rg: [gl.RG16F, gl.RG, gl.HALF_FLOAT],
    r: [gl.R16F, gl.RED, gl.HALF_FLOAT],
  };
  function target(w, h, [internal, format, type]) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fb, w, h, ok, texel: [1 / w, 1 / h], free() { gl.deleteTexture(tex); gl.deleteFramebuffer(fb); } };
  }
  function pair(w, h, fmt) {
    let a = target(w, h, fmt), b = target(w, h, fmt);
    return {
      w, h, texel: a.texel, ok: a.ok && b.ok,
      get read() { return a; },
      get write() { return b; },
      swap() { const t = a; a = b; b = t; },
      clear() { for (const t of [a, b]) { gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); } },
      free() { a.free(); b.free(); },
    };
  }

  function use(prog, texel) {
    gl.useProgram(prog.p);
    if (prog.u.uTexel) gl.uniform2f(prog.u.uTexel, texel[0], texel[1]);
    return prog.u;
  }
  function tex(prog, name, t, unit) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.uniform1i(prog.u[name], unit);
  }
  function draw(t) {
    if (t) { gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb); gl.viewport(0, 0, t.w, t.h); } else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function scissorUv(t, x0, y0, x1, y1) {
    const ax = Math.max(0, Math.floor(x0 * t.w)), ay = Math.max(0, Math.floor(y0 * t.h));
    const bx = Math.min(t.w, Math.ceil(x1 * t.w) + 1), by = Math.min(t.h, Math.ceil(y1 * t.h) + 1);
    gl.scissor(ax, ay, Math.max(0, bx - ax), Math.max(0, by - ay));
  }
  function additive(on) {
    if (on) { gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.enable(gl.SCISSOR_TEST); } else { gl.disable(gl.BLEND); gl.disable(gl.SCISSOR_TEST); }
  }

  /* ── sizes and buffers ── */
  let dyeW = 0, dyeH = 0, simW = 0, simH = 0, pxPerCss = 1;
  let dye = null, vel = null, pres = null, div = null, curl = null, glow = null, probeT = null;
  function measure() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = Math.max(64, Math.round(r.width * dpr)), h = Math.max(32, Math.round(r.height * dpr));
    if (w > 1800) { h = Math.round((h * 1800) / w); w = 1800; }
    return { w, h, cssW: Math.max(1, r.width) };
  }
  function allocate() {
    const m = measure();
    if (m.w === dyeW && m.h === dyeH && dye) return true;
    const old = dye ? { dye, vel, pres, div, curl, glow } : null;
    dyeW = m.w; dyeH = m.h; pxPerCss = dyeW / m.cssW;
    simW = Math.max(48, Math.round(dyeW / 6)); simH = Math.max(16, Math.round(dyeH / 6));
    canvas.width = dyeW; canvas.height = dyeH;
    dye = pair(dyeW, dyeH, F.rgba);
    vel = pair(simW, simH, F.rg);
    pres = pair(simW, simH, F.r);
    div = target(simW, simH, F.r);
    curl = target(simW, simH, F.r);
    glow = pair(Math.max(16, Math.round(dyeW / 4)), Math.max(8, Math.round(dyeH / 4)), F.rgba);
    if (!probeT) probeT = target(1, 1, F.rgba);
    if (!(dye.ok && vel.ok && pres.ok && div.ok && curl.ok && glow.ok && probeT.ok)) return false;
    if (old) {
      /* keep the paint through a resize: resample the old fields into the new */
      additive(false);
      for (const [from, to] of [[old.dye, dye], [old.vel, vel]]) {
        const u = use(P.copy, to.texel);
        tex(P.copy, 'uSrc', from.read.tex, 0);
        gl.uniform1f(u.uMul, 1);
        draw(to.write);
        to.swap();
      }
      for (const k of Object.keys(old)) old[k].free();
    }
    return true;
  }

  /* ── the word ── */
  const wordCanvas = document.createElement('canvas');
  const timeCanvas = document.createElement('canvas');
  const wordTex = gl.createTexture();
  const timeTex = gl.createTexture();
  for (const t of [wordTex, timeTex]) {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  let idx = 0, current = null, letters = [], total = 1, wordBox = null, seed = 0, fontPx = 100;

  function layoutWord() {
    current = words[idx];
    const c1 = current.col, c2 = current.col2 || current.col;
    const text = current.text;
    for (const c of [wordCanvas, timeCanvas]) { c.width = dyeW; c.height = dyeH; }
    const ctx = wordCanvas.getContext('2d');
    const tctx = timeCanvas.getContext('2d');
    /* the stage (the host) inside the canvas's bleed, in canvas pixels */
    const hr = host.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
    const s = dyeW / Math.max(1, cr.width);
    const box = { x: (hr.left - cr.left) * s, y: (hr.top - cr.top) * s, w: hr.width * s, h: hr.height * s };
    const narrow = cr.width < 560;
    ctx.font = `700 100px ${FAMILY}`;
    const m0 = ctx.measureText(text);
    const inkW0 = m0.actualBoundingBoxLeft + m0.actualBoundingBoxRight, inkH0 = m0.actualBoundingBoxAscent + m0.actualBoundingBoxDescent;
    fontPx = 100 * Math.min((box.w * (narrow ? 1.04 : 0.86)) / inkW0, (box.h * 0.84) / inkH0);
    const font = `700 ${fontPx}px ${FAMILY}`;
    ctx.font = font;
    tctx.font = font;
    const m = ctx.measureText(text);
    const left = box.x + (box.w - (m.actualBoundingBoxLeft + m.actualBoundingBoxRight)) / 2 + m.actualBoundingBoxLeft;
    const base = box.y + (box.h - (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent)) / 2 + m.actualBoundingBoxAscent;

    total = (text.length - 1) * staggerSec + sweepSec;
    letters = text.split('').map((ch, i) => {
      const x = left + ctx.measureText(text.slice(0, i)).width;
      const lm = ctx.measureText(ch);
      const ink = { x0: x - lm.actualBoundingBoxLeft, x1: x + lm.actualBoundingBoxRight, y0: base - lm.actualBoundingBoxAscent, y1: base + lm.actualBoundingBoxDescent };
      /* a fast hand: each letter a little off true and off the line */
      return { ch, x, ink, rot: (rand(-4, 4) * Math.PI) / 180, dy: rand(-0.03, 0.03) * fontPx, t0: i * staggerSec, t1: i * staggerSec + sweepSec };
    });

    ctx.clearRect(0, 0, dyeW, dyeH);
    tctx.clearRect(0, 0, dyeW, dyeH);
    for (const L of letters) {
      const cx = (L.ink.x0 + L.ink.x1) / 2, cy = (L.ink.y0 + L.ink.y1) / 2;
      for (const k of [ctx, tctx]) { k.save(); k.translate(cx, cy + L.dy); k.rotate(L.rot); k.translate(-cx, -cy); }
      /* the split load: one colour over the other, turning through the middle */
      const g = ctx.createLinearGradient(0, L.ink.y0, 0, L.ink.y1);
      g.addColorStop(0, shade(c1, rand(0.08, 0.16)));
      g.addColorStop(rand(0.32, 0.42), c1);
      g.addColorStop(rand(0.58, 0.68), c2);
      g.addColorStop(1, shade(c2, -rand(0.04, 0.12)));
      ctx.fillStyle = g;
      ctx.fillText(L.ch, L.x, base);
      /* when the front passes: fast off the mark, easing out (power2), in
         eight steps across the letter; the stroke widens the timing past the
         ink so no edge pixel is left without a time */
      const tg = tctx.createLinearGradient(L.ink.x0, 0, L.ink.x1, 0);
      for (let k = 0; k <= 8; k++) {
        const f = k / 8;
        const t = (L.t0 + sweepSec * (1 - Math.sqrt(1 - f))) / total;
        tg.addColorStop(f, `rgb(${Math.round(Math.min(1, t) * 255)},0,0)`);
      }
      tctx.fillStyle = tg;
      tctx.strokeStyle = tg;
      tctx.lineWidth = fontPx * 0.04;
      tctx.lineJoin = 'round';
      tctx.strokeText(L.ch, L.x, base);
      tctx.fillText(L.ch, L.x, base);
      for (const k of [ctx, tctx]) k.restore();
    }
    /* bristles: thin streaks along the sweep where the paint went on thinner,
       and each stroke running a little dry toward its end */
    const ink = {
      x0: Math.min(...letters.map((L) => L.ink.x0)), x1: Math.max(...letters.map((L) => L.ink.x1)),
      y0: Math.min(...letters.map((L) => L.ink.y0)) - fontPx * 0.06, y1: Math.max(...letters.map((L) => L.ink.y1)) + fontPx * 0.06,
    };
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    const streaks = Math.round((ink.y1 - ink.y0) / Math.max(3.6 * pxPerCss, fontPx * 0.034));
    for (let i = 0; i < streaks; i++) {
      const y = rand(ink.y0, ink.y1), tilt = rand(-0.04, 0.04) * (ink.x1 - ink.x0);
      ctx.strokeStyle = `rgba(0,0,0,${rand(0.05, 0.2).toFixed(2)})`;
      ctx.lineWidth = rand(0.4, 1.2) * pxPerCss;
      ctx.beginPath();
      ctx.moveTo(ink.x0 - 10, y - tilt / 2);
      ctx.lineTo(ink.x1 + 10, y + tilt / 2);
      ctx.stroke();
    }
    for (const L of letters) {
      const dry = ctx.createLinearGradient(L.ink.x0, 0, L.ink.x1, 0);
      dry.addColorStop(0, 'rgba(0,0,0,0)');
      dry.addColorStop(0.7, 'rgba(0,0,0,0.03)');
      dry.addColorStop(1, `rgba(0,0,0,${rand(0.08, 0.16).toFixed(2)})`);
      ctx.fillStyle = dry;
      ctx.fillRect(L.ink.x0, ink.y0, L.ink.x1 - L.ink.x0, ink.y1 - ink.y0);
    }
    ctx.globalCompositeOperation = 'source-over';

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    for (const [t, c] of [[wordTex, wordCanvas], [timeTex, timeCanvas]]) {
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    const pad = fontPx * 0.2;
    wordBox = { x0: (ink.x0 - pad) / dyeW, x1: (ink.x1 + pad) / dyeW, y0: 1 - (ink.y1 + pad) / dyeH, y1: 1 - (ink.y0 - pad) / dyeH };
    seed = Math.random() * 100;
    host.dataset.pwWord = text;
  }

  /* ── drops ── */
  let drops = [];
  const toUv = (x, y) => [x / dyeW, 1 - y / dyeH];
  /* Flecks off the brush while it moves: thrown forward and up, landing a
     moment later as small drops, a few of them big enough to throw their own
     satellites. */
  function brushFlecks(t, now) {
    const c1 = current.col, c2 = current.col2 || current.col;
    for (const L of letters) {
      if (t < L.t0 || t > L.t1 || Math.random() > 0.38) continue;
      const p = (t - L.t0) / sweepSec, f = 1 - (1 - p) * (1 - p);
      const fx = L.ink.x0 + (L.ink.x1 - L.ink.x0) * f, fy = rand(L.ink.y0, L.ink.y1) + L.dy;
      const big = Math.random() < 0.12;
      const n = big ? 3 : 1;
      const a0 = rand(-1.0, 0.35), dist0 = rand(10, 64) * pxPerCss;
      for (let k = 0; k < n; k++) {
        const a = a0 + (k ? rand(-0.35, 0.35) : 0), dist = dist0 * (k ? rand(1.05, 1.5) : 1);
        const r = (k ? rand(0.6, 1.3) : big ? rand(2.8, 4.2) : rand(1, 2.6)) * pxPerCss;
        const [x, y] = toUv(fx + Math.cos(a) * dist, fy + Math.sin(a) * dist);
        drops.push({ x, y, at: now + (dist / (rand(600, 1000) * pxPerCss)) * 1000, r: r / dyeH, dir: [Math.cos(a), -Math.sin(a)], stretch: rand(1, 1.6), rgb: mix01(c1, c2, Math.random()) });
      }
    }
  }
  function landDrops(now) {
    if (!drops.length) return;
    const keep = [];
    const u = use(P.splat, dye.texel);
    gl.uniform1f(u.uAspect, dyeW / dyeH);
    for (const d of drops) {
      if (d.at > now) { keep.push(d); continue; }
      const thick = 1.25;
      gl.uniform2f(u.uPoint, d.x, d.y);
      gl.uniform4f(u.uValue, d.rgb[0] * thick, d.rgb[1] * thick, d.rgb[2] * thick, thick);
      gl.uniform1f(u.uRadius, d.r * d.r);
      gl.uniform2f(u.uDir, d.dir[0], d.dir[1]);
      gl.uniform1f(u.uStretch, d.stretch);
      const reach = 3.4 * d.r * d.stretch;
      scissorUv(dye, d.x - reach * (dyeH / dyeW), d.y - reach, d.x + reach * (dyeH / dyeW), d.y + reach);
      draw(dye.read);
    }
    drops = keep;
  }

  /* ── the pointer ── */
  let moves = [], last = null, lastInput = -1e9;
  function onMove(e) {
    if (!running) { last = null; return; }
    if (e.pointerType !== 'mouse' && !(e.buttons & 1)) { last = null; return; }
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
    if (last) moves.push({ x0: last.x, y0: last.y, x1: x, y1: y, dt: Math.max(4, e.timeStamp - last.t) / 1000 });
    last = { x, y, t: e.timeStamp };
    lastInput = performance.now();
    host.dataset.pwMoves = String((Number(host.dataset.pwMoves) || 0) + 1);
    wake();
  }
  function onLift() { last = null; }
  function applyMoves() {
    if (!moves.length) return;
    const aspect = dyeW / dyeH;
    const rUv = Math.min(0.09, Math.max(0.03, (13 * pxPerCss) / dyeH));
    for (const mv of moves) {
      const dx = (mv.x1 - mv.x0) * aspect, dy = mv.y1 - mv.y0;
      const len = Math.hypot(dx, dy);
      if (len < 1e-5) continue;
      const ux = dx / len, uy = dy / len;
      const speed = Math.min(len / mv.dt, 9); // canvas heights a second
      const vx = ux * speed * simH * PUSH, vy = uy * speed * simH * PUSH;
      const steps = Math.min(16, Math.max(1, Math.ceil(len / (rUv * 0.45))));
      /* the push, laid along the whole path so a fast strike leaves no gaps */
      let u = use(P.splat, vel.texel);
      gl.uniform1f(u.uAspect, simW / simH);
      gl.uniform4f(u.uValue, vx, vy, 0, 0);
      gl.uniform1f(u.uRadius, rUv * rUv);
      gl.uniform2f(u.uDir, ux, uy);
      gl.uniform1f(u.uStretch, 1.25);
      for (let s = 1; s <= steps; s++) {
        const t = s / steps, px = mv.x0 + (mv.x1 - mv.x0) * t, py = mv.y0 + (mv.y1 - mv.y0) * t;
        gl.uniform2f(u.uPoint, px, py);
        const reach = 3.4 * rUv * 1.25;
        scissorUv(vel, px - reach / aspect, py - reach, px + reach / aspect, py + reach);
        draw(vel.read);
      }
      /* a hard strike through wet paint throws drops of whatever it hit */
      if (speed > 2.2 && Math.random() < 0.5) {
        additive(false);
        u = use(P.probe, [1, 1]);
        tex(P.probe, 'uSrc', dye.read.tex, 0);
        gl.uniform2f(u.uAt, mv.x1, mv.y1);
        gl.uniform2f(u.uSpread, 3 / dyeW, 3 / dyeH);
        draw(probeT);
        additive(true);
        u = use(P.fling, dye.texel);
        tex(P.fling, 'uProbe', probeT.tex, 0);
        gl.uniform1f(u.uAspect, aspect);
        gl.uniform1f(u.uAmount, 1.2);
        const n = 1 + Math.floor(Math.random() * 3);
        for (let k = 0; k < n; k++) {
          const a = Math.atan2(uy, ux) + rand(-0.5, 0.5), dist = rand(0.05, 0.2) * Math.min(1.6, speed / 3);
          const r = rand(0.006, 0.02), stretch = rand(1.3, 2.3);
          const px = mv.x1 + (Math.cos(a) * dist) / aspect, py = mv.y1 + Math.sin(a) * dist;
          gl.uniform2f(u.uPoint, px, py);
          gl.uniform1f(u.uRadius, r * r);
          gl.uniform2f(u.uDir, Math.cos(a), Math.sin(a));
          gl.uniform1f(u.uStretch, stretch);
          const reach = 3.4 * r * stretch;
          scissorUv(dye, px - reach / aspect, py - reach, px + reach / aspect, py + reach);
          draw(dye.read);
        }
      }
    }
    moves = [];
  }

  /* ── one step of the fluid ── */
  function step(dt) {
    additive(false);
    let u = use(P.curl, vel.texel);
    tex(P.curl, 'uVel', vel.read.tex, 0);
    draw(curl);
    u = use(P.vorticity, vel.texel);
    tex(P.vorticity, 'uVel', vel.read.tex, 0);
    tex(P.vorticity, 'uCurl', curl.tex, 1);
    gl.uniform1f(u.uCurlK, CURL);
    gl.uniform1f(u.uDt, dt);
    draw(vel.write); vel.swap();
    use(P.divergence, vel.texel);
    tex(P.divergence, 'uVel', vel.read.tex, 0);
    draw(div);
    u = use(P.copy, pres.texel);
    tex(P.copy, 'uSrc', pres.read.tex, 0);
    gl.uniform1f(u.uMul, 0.8);
    draw(pres.write); pres.swap();
    use(P.pressure, pres.texel);
    tex(P.pressure, 'uDiv', div.tex, 1);
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      tex(P.pressure, 'uP', pres.read.tex, 0);
      draw(pres.write); pres.swap();
    }
    use(P.gradient, vel.texel);
    tex(P.gradient, 'uP', pres.read.tex, 0);
    tex(P.gradient, 'uVel', vel.read.tex, 1);
    draw(vel.write); vel.swap();
    u = use(P.advect, vel.texel);
    tex(P.advect, 'uVel', vel.read.tex, 0);
    tex(P.advect, 'uSrc', vel.read.tex, 1);
    gl.uniform2f(u.uSimTexel, 1 / simW, 1 / simH);
    gl.uniform1f(u.uDt, dt);
    gl.uniform1f(u.uDiss, VEL_DISSIPATION);
    draw(vel.write); vel.swap();
    use(P.advect, dye.texel);
    tex(P.advect, 'uVel', vel.read.tex, 0);
    tex(P.advect, 'uSrc', dye.read.tex, 1);
    gl.uniform1f(u.uDiss, 0);
    draw(dye.write); dye.swap();
  }

  function render() {
    additive(false);
    use(P.bright, glow.texel);
    tex(P.bright, 'uSrc', dye.read.tex, 0);
    draw(glow.write); glow.swap();
    const u = use(P.blur, glow.texel);
    for (const [dx, dy] of [[1, 0], [0, 1], [2.2, 0], [0, 2.2]]) {
      tex(P.blur, 'uSrc', glow.read.tex, 0);
      gl.uniform2f(u.uDir, dx / glow.w, dy / glow.h);
      draw(glow.write); glow.swap();
    }
    const d = use(P.display, dye.texel);
    tex(P.display, 'uDye', dye.read.tex, 0);
    tex(P.display, 'uGlow', glow.read.tex, 1);
    gl.uniform2f(d.uDyeTexel, 1 / dyeW, 1 / dyeH);
    gl.uniform1f(d.uFade, fade);
    gl.uniform1f(d.uGlowK, GLOW);
    draw(null);
  }

  function depositPaint(prev, now) {
    additive(true);
    const u = use(P.deposit, dye.texel);
    tex(P.deposit, 'uWord', wordTex, 0);
    tex(P.deposit, 'uTime', timeTex, 1);
    gl.uniform1f(u.uPrev, prev);
    gl.uniform1f(u.uNow, now);
    gl.uniform1f(u.uRows, dyeH / (2.5 * pxPerCss));
    gl.uniform1f(u.uJitter, 0.009);
    gl.uniform1f(u.uSeed, seed);
    gl.uniform1f(u.uDye, 1);
    gl.uniform2f(u.uPush, 0, 0);
    scissorUv(dye, wordBox.x0, wordBox.y0, wordBox.x1, wordBox.y1);
    draw(dye.read);
    /* the brush drags its fresh paint a little the way it is going */
    const frontSpeed = ((letters.length ? (letters[0].ink.x1 - letters[0].ink.x0) : fontPx * 0.5) / dyeW) * simW / sweepSec;
    if (u.uTexel) gl.uniform2f(u.uTexel, vel.texel[0], vel.texel[1]);
    gl.uniform1f(u.uDye, 0);
    gl.uniform2f(u.uPush, frontSpeed * 0.14, -frontSpeed * 0.02);
    scissorUv(vel, wordBox.x0, wordBox.y0, wordBox.x1, wordBox.y1);
    draw(vel.read);
  }

  /* ── the cycle: paint in, hold, wash out, next ── */
  let running = false, destroyed = false, raf = 0, timer = 0, started = false;
  let phase = 'idle', paintStart = 0, prevT = -1, holdUntil = 0, fadeStart = 0, fade = 1, lastFrame = 0, pausedAt = 0;

  function clearFields() { dye.clear(); vel.clear(); pres.clear(); }
  function nextWord() {
    clearFields();
    layoutWord();
    drops = [];
    fade = 1;
    phase = 'painting';
    paintStart = performance.now();
    prevT = -1;
    wake();
  }
  function wake() {
    if (!running || destroyed || raf) return;
    clearTimeout(timer);
    lastFrame = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function frame(now) {
    raf = 0;
    if (!running || destroyed) return;
    const dt = Math.min(1 / 40, Math.max(1 / 240, (now - lastFrame) / 1000));
    lastFrame = now;
    if (phase === 'painting') {
      const t = (now - paintStart) / 1000;
      const tn = Math.min(1.02, t / total);
      depositPaint(prevT, tn);
      prevT = tn;
      brushFlecks(t, now);
      if (t >= total + 0.12) { phase = 'holding'; holdUntil = now + holdMs; }
    }
    additive(true);
    landDrops(now);
    applyMoves();
    step(dt);
    if (phase === 'holding' && now >= holdUntil && now - lastInput > 1500) { phase = 'fading'; fadeStart = now; }
    if (phase === 'fading') {
      fade = Math.max(0, 1 - (now - fadeStart) / (fadeSec * 1000));
      if (now - lastInput < 300) { phase = 'holding'; holdUntil = now + 1200; fade = 1; }
    }
    render();
    if (phase === 'fading' && fade <= 0) { idx = (idx + 1) % words.length; nextWord(); return; }
    const busy = phase === 'painting' || phase === 'fading' || drops.length || now - lastInput < 1800;
    if (busy) { raf = requestAnimationFrame(frame); return; }
    /* nothing moving: stop drawing, and come back when the hold is up */
    const wait = Math.max(holdUntil, lastInput + 1500) - now;
    timer = setTimeout(wake, Math.max(16, wait));
  }

  /* ── resize: keep the paint, follow the box ── */
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
    if (destroyed || !started) return;
    if (!allocate()) { fail(); return; }
    if (phase === 'painting') layoutWord();
    if (!raf) { render(); }
  }) : null;

  let failed = false;
  function fail() {
    if (failed) return;
    failed = true;
    api.destroy();
    if (onFail) onFail();
  }
  function onLost(e) { e.preventDefault(); fail(); }
  canvas.addEventListener('webglcontextlost', onLost);
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerdown', onMove);
  host.addEventListener('pointerleave', onLift);
  host.addEventListener('pointerup', onLift);
  host.addEventListener('pointercancel', onLift);

  if (!allocate()) {
    canvas.remove();
    return null;
  }
  if (ro) ro.observe(host);

  const api = {
    start() {
      if (destroyed) return;
      const go = () => {
        if (destroyed) return;
        running = true;
        if (!started) {
          started = true;
          if (!allocate()) { fail(); return; }
          nextWord();
          return;
        }
        if (pausedAt) {
          const gap = performance.now() - pausedAt;
          paintStart += gap; holdUntil += gap; fadeStart += gap; pausedAt = 0;
          drops.forEach((d) => { d.at += gap; });
        }
        wake();
      };
      if (document.fonts && document.fonts.load) document.fonts.load(`700 100px 'Caveat'`).then(go, go); else go();
    },
    stop() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      clearTimeout(timer);
      if (!pausedAt) pausedAt = performance.now();
      last = null;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true; running = false;
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(timer);
      if (ro) ro.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      for (const [ev, fn] of [['pointermove', onMove], ['pointerdown', onMove], ['pointerleave', onLift], ['pointerup', onLift], ['pointercancel', onLift]]) host.removeEventListener(ev, fn);
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose && !failed) lose.loseContext();
      canvas.remove();
    },
  };
  return api;
}
