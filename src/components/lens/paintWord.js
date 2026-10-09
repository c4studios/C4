/*
 * The paint stage on /Lens: "We exist to capture the [word] of your brand."
 *
 * Seventh version, 9 Oct 2026. Caleb's notes on the sixth: the paint has to
 * spread across the page instead of stopping at the invisible box it sat in,
 * and the splatter has to look alive and behave like real paint, never
 * appear for its own sake.
 *
 * The field. The canvas fills the whole paint section, edge to edge, and the
 * word stays where it always was, in its stage inside the sentence. The fluid
 * runs over the whole section, so paint goes wherever the visitor takes it.
 * The section's edges are open: the solver lets the fluid flow out instead of
 * piling paint against a wall, and paint carried into the last few dozen
 * pixels thins out and fades.
 *
 * The fluid is the sixth version's: a WebGL2 stable-fluids solver (Stam's
 * method: advect, then project with a Jacobi pressure solve, plus a little
 * vorticity) on a coarse velocity grid, carrying a dye field that is the
 * paint. Thickness is height: the display cuts the paint at a thickness, so it
 * keeps a hard edge, and lights it from the top left for a wet sheen.
 *
 * The finger. The pointer is a fingertip on wet paint. It drags the fluid
 * along its path at its own speed (never faster, so the paint smears instead
 * of swirling), and the paint parts around it and bunches across its front.
 * It takes some of that paint on and lays it back down behind itself,
 * thinner and streakier as it runs dry, so a drag pulls a smear out of the
 * word and on across the section. A probe reads back the paint in the tip's
 * way (a frame or two late, so it never stalls the GPU), so what the finger
 * carries is real paint in real colours, and whatever it takes on is wiped
 * off the board: paint moves from the board to the finger, into the air and
 * back down, and is never made from nothing.
 *
 * The splatter is physics. Paint only leaves the finger when it carries some.
 *   A fast move sheds droplets off the front of the tip; a flick (a fast move
 *   that stops hard, or a lift at speed) throws what it carries forward. How
 *   many and how big come from the speed and the load.
 *   Each droplet flies a ballistic path under gravity and is drawn in flight.
 *   It lands as a splat stretched along its line of travel, with a teardrop
 *   ahead of it, and a fast heavy drop throws satellite droplets on ahead.
 *   The drop's momentum goes into the fluid, so a fresh splat slides a little
 *   and settles.
 *   Heavy paint runs. A landing that leaves the paint thick (the probe reads
 *   it back) starts a drip that runs down the section, thinning, and ends in
 *   a bead.
 * Nothing is thrown at random. The brush that paints the word in sheds a few
 * drops off its own speed the same way: the faster the stroke, the more drops.
 *
 * Cost. The canvas resolution is held to a pixel budget (lower on touch
 * devices) and at most twice the CSS size, and the velocity grid runs at a
 * sixth of that. It runs only while the section is on screen (Lens.jsx's
 * observer calls start and stop) and stops drawing when nothing is moving.
 * Without WebGL2 float render targets it returns null and the page shows the
 * static word; prerender and reduced motion never call it.
 */

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const FAMILY = "'Caveat', cursive";
const SQRT_PI = Math.sqrt(Math.PI);

/* The fluid, tuned by eye against real paint on a board. */
const VEL_DISSIPATION = 5.2;  // per second: thick paint stops when the finger does
const CURL = 0.45;            // a little vorticity, so pushed paint folds over itself without winding into whirlpools
const VISCOSITY = 0.45;       // per pass, two passes a step: how much each cell's velocity takes from its neighbours
const PRESSURE_ITERATIONS = 24;
const PUSH = 1.05;            // the fluid at the fingertip moves at about the finger's speed
const GRIP = 0.7;             // how hard the tip holds the paint under it to its own speed
const GLOW = 0.62;
const EDGE_LOSS = 2.6;        // per second, at the section's very edge

/* Paint in the air and running down. Lengths are CSS pixels, times seconds. */
const GRAVITY = 1500;         // down the screen
const FINGER_R = 12;          // the fingertip
const PICKUP = 20;            // what the tip takes on per px of travel through paint, per unit of thickness
const LOAD_MAX = 6000;        // the most a tip carries, in px² of full-thickness paint
const LOAD_MIN = 40;          // less than this and nothing leaves the finger
const CARRY_LEN = 280;        // travel over which the tip lays down about two thirds of what it carries
const SHED_SPEED = 1500;      // faster than this, the tip sheds droplets as it goes
const FLICK_SPEED = 850;      // a hard stop from this fast throws what the tip carries
const DRIP_THICK = 1.5;       // paint this thick runs
const MAX_AIR = 160;
const PROBES = 8;             // points the probe can read back in one pass

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

/* 1 inside the section, easing to 0 across a band at each edge. */
const EDGE = `
float edgeFade(vec2 uv) {
  vec2 d = clamp(min(uv, 1.0 - uv) / uBand, 0.0, 1.0);
  d = d * d * (3.0 - 2.0 * d);
  return d.x * d.y;
}`;

const FS = {
  /* A plain copy, or a remap (a resize keeps the paint where it sat). */
  copy: `${HEAD}uniform sampler2D uSrc; uniform float uMul; uniform vec4 uMap;
void main() {
  vec2 c = vUv * uMap.xy + uMap.zw;
  vec4 s = texture(uSrc, c);
  if (c.x < 0.0 || c.x > 1.0 || c.y < 0.0 || c.y > 1.0) s = vec4(0.0);
  o = s * uMul;
}`,

  /* Additive: drawn with blending into the target, scissored to the splat.
     uDry breaks a thin deposit into streaks along its path. */
  splat: `${HEAD}uniform vec2 uPoint; uniform vec4 uValue; uniform float uRadius; uniform float uAspect; uniform vec2 uDir; uniform float uStretch; uniform float uDry; uniform float uSeed;
${GAUSS}
float hash(float n) { return fract(sin(n * 91.3458 + uSeed) * 47453.5453); }
void main() {
  float m = 1.0;
  if (uDry > 0.0) {
    vec2 p = vUv - uPoint; p.x *= uAspect;
    float row = floor(dot(p, vec2(-uDir.y, uDir.x)) / sqrt(uRadius) * 4.5);
    m = mix(1.0, step(0.42, hash(row)) * (0.55 + 0.9 * hash(row + 17.0)), uDry);
  }
  o = uValue * gauss(uPoint, uAspect, uDir, uStretch, uRadius) * m;
}`,

  /* The tip dragging the paint: the fluid under it is pulled toward the
     tip's own velocity (drawn with src * a + dst * (1 - a)), so however
     many of these overlap along a path, the paint never outruns the finger. */
  drag: `${HEAD}uniform vec2 uPoint; uniform vec2 uVel; uniform float uGrip; uniform float uRadius; uniform float uAspect; uniform vec2 uDir; uniform float uStretch;
${GAUSS}
void main() { o = vec4(uVel, 0.0, clamp(uGrip * gauss(uPoint, uAspect, uDir, uStretch, uRadius), 0.0, 1.0)); }`,

  /* Paint taken off the board: drawn with dst * (1 - src.a). */
  erase: `${HEAD}uniform vec2 uPoint; uniform float uAmount; uniform float uRadius; uniform float uAspect; uniform vec2 uDir; uniform float uStretch;
${GAUSS}
void main() { o = vec4(0.0, 0.0, 0.0, clamp(uAmount * gauss(uPoint, uAspect, uDir, uStretch, uRadius), 0.0, 1.0)); }`,

  /* A droplet in the air, over the finished frame: a hard little bead
     smeared along its path by the frame's travel, with a faint halo of its
     own colour. */
  drop: `${HEAD}uniform vec2 uPoint; uniform vec3 uColor; uniform float uAlpha; uniform float uRadius; uniform float uAspect; uniform vec2 uDir; uniform float uStretch;
${GAUSS}
void main() {
  float g = gauss(uPoint, uAspect, uDir, uStretch, uRadius);
  float body = smoothstep(0.22, 0.62, g);
  float halo = pow(g, 0.25) * 0.26;
  float a = clamp(body + halo * (1.0 - body), 0.0, 1.0) * uAlpha;
  vec3 c = mix(uColor, vec3(1.0), smoothstep(0.82, 1.0, g) * 0.45);
  o = vec4(c * a, a);
}`,

  /* What's under a point, averaged over a fingertip, packed into a byte
     texture the CPU can read back: rgb the paint's colour, a its thickness / 2. */
  probe: `${HEAD}uniform sampler2D uSrc; uniform vec2 uAt; uniform vec2 uR;
void main() {
  vec4 s = texture(uSrc, uAt) * 0.2;
  s += (texture(uSrc, uAt + vec2(uR.x, 0.0)) + texture(uSrc, uAt - vec2(uR.x, 0.0))
      + texture(uSrc, uAt + vec2(0.0, uR.y)) + texture(uSrc, uAt - vec2(0.0, uR.y))) * 0.12;
  s += (texture(uSrc, uAt + uR * 0.7) + texture(uSrc, uAt - uR * 0.7)
      + texture(uSrc, uAt + vec2(uR.x, -uR.y) * 0.7) + texture(uSrc, uAt + vec2(-uR.x, uR.y) * 0.7)) * 0.08;
  o = vec4(clamp(s.rgb / max(s.a, 1e-3), 0.0, 1.0), clamp(s.a * 0.5, 0.0, 1.0));
}`,

  /* The brush: paint for every pixel the front passed since the last frame,
     and the same mask as a push in the velocity. The front is ragged by a
     row of bristles. The word's textures cover only its own box (uRect). */
  deposit: `${HEAD}uniform sampler2D uWord; uniform sampler2D uTime; uniform vec4 uRect; uniform float uPrev; uniform float uNow; uniform float uRows; uniform float uJitter; uniform float uSeed; uniform float uDye; uniform vec2 uPush;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec2 w2 = (vUv - uRect.xy) / uRect.zw;
  if (w2.x < 0.0 || w2.x > 1.0 || w2.y < 0.0 || w2.y > 1.0) { o = vec4(0.0); return; }
  vec4 w = texture(uWord, w2);
  float t = texture(uTime, w2).r + (hash(vec2(floor(vUv.y * uRows), uSeed)) - 0.5) * uJitter;
  float m = (t > uPrev && t <= uNow) ? w.a : 0.0;
  o = uDye > 0.5 ? vec4(w.rgb * m, m) : vec4(uPush * m, 0.0, 0.0);
}`,

  /* Nothing comes in from beyond the section, and paint near its edge thins. */
  advect: `${HEAD}uniform sampler2D uVel; uniform sampler2D uSrc; uniform vec2 uSimTexel; uniform float uDt; uniform float uDiss; uniform float uEdgeLoss; uniform vec2 uBand;
${EDGE}
void main() {
  vec2 c = vUv - uDt * texture(uVel, vUv).xy * uSimTexel;
  vec4 s = texture(uSrc, c);
  if (c.x < 0.0 || c.x > 1.0 || c.y < 0.0 || c.y > 1.0) s = vec4(0.0);
  float keep = (1.0 - uEdgeLoss * uDt * (1.0 - edgeFade(vUv))) / (1.0 + uDiss * uDt);
  o = s * max(keep, 0.0);
}`,

  /* Open edges: no wall to reflect off. */
  divergence: `${HEAD}uniform sampler2D uVel;
void main() {
  float L = texture(uVel, vL).x, R = texture(uVel, vR).x, T = texture(uVel, vT).y, B = texture(uVel, vB).y;
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

  /* Paint is thick: velocity spreads to its neighbours, so a fast jet slows
     and broadens instead of rolling up into whirlpools the way water does. */
  viscous: `${HEAD}uniform sampler2D uVel; uniform float uK;
void main() {
  vec2 c = texture(uVel, vUv).xy;
  vec2 n = (texture(uVel, vL).xy + texture(uVel, vR).xy + texture(uVel, vT).xy + texture(uVel, vB).xy) * 0.25;
  o = vec4(mix(c, n, uK), 0.0, 1.0);
}`,

  /* Pressure is zero beyond the section, so fluid can leave it. */
  pressure: `${HEAD}uniform sampler2D uP; uniform sampler2D uDiv;
float P(vec2 uv) { return (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) ? 0.0 : texture(uP, uv).x; }
void main() {
  o = vec4((P(vL) + P(vR) + P(vB) + P(vT) - texture(uDiv, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`,

  gradient: `${HEAD}uniform sampler2D uP; uniform sampler2D uVel;
float P(vec2 uv) { return (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) ? 0.0 : texture(uP, uv).x; }
void main() {
  o = vec4(texture(uVel, vUv).xy - vec2(P(vR) - P(vL), P(vT) - P(vB)), 0.0, 1.0);
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
     with a tight wet highlight. Thick paint rounds over instead of cliffing.
     Everything eases out across the band at the section's edges. */
  display: `${HEAD}uniform sampler2D uDye; uniform sampler2D uGlow; uniform vec2 uDyeTexel; uniform float uFade; uniform float uGlowK; uniform vec2 uBand;
${EDGE}
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
  o = vec4(lit * cover + glow * (1.0 - cover), cover + gmax * (1.0 - cover)) * uFade * edgeFade(vUv);
}`,
};

/* ── colour ──────────────────────────────────────────────────────────── */
function hexRgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function shade(hex, k) {
  const to = k > 0 ? 255 : 0, a = Math.abs(k);
  return `rgb(${hexRgb(hex).map((v) => Math.round(v + (to - v) * a)).join(',')})`;
}
function mix01(a, b, t) { const x = hexRgb(a), y = hexRgb(b); return x.map((v, i) => (v + (y[i] - v) * t) / 255); }
const smooth01 = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
/* What a drop of radius r leaves on the board, in the load's units. */
const dropVolume = (r) => 10 * r * r;

export function createPaintStage(host, { words, field = host, holdMs = 2400, sweepSec = 0.24, staggerSec = 0.11, fadeSec = 0.55, onFail } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'paint-gl';
  canvas.setAttribute('aria-hidden', 'true');
  field.appendChild(canvas);
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
  const bail = () => { canvas.remove(); return null; };
  if (!gl) return bail();
  if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) return bail();
  const coarse = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  const BUDGET = coarse ? 1.15e6 : 2.1e6;   // canvas pixels

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
    bytes: [gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE],
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

  function pass(prog, texel) {
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
  function scissorUv(w, h, x0, y0, x1, y1) {
    const ax = Math.max(0, Math.floor(x0 * w)), ay = Math.max(0, Math.floor(y0 * h));
    const bx = Math.min(w, Math.ceil(x1 * w) + 1), by = Math.min(h, Math.ceil(y1 * h) + 1);
    gl.scissor(ax, ay, Math.max(0, bx - ax), Math.max(0, by - ay));
  }
  /* 'add' lays paint on, 'erase' takes a share of it off, 'over' composites
     premultiplied colour on top. Each draw that blends is scissored. */
  function blend(mode) {
    if (mode === 'none') { gl.disable(gl.BLEND); gl.disable(gl.SCISSOR_TEST); return; }
    gl.enable(gl.BLEND);
    gl.enable(gl.SCISSOR_TEST);
    if (mode === 'add') gl.blendFunc(gl.ONE, gl.ONE);
    else if (mode === 'erase') gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
    else if (mode === 'lerp') gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  /* ── sizes and buffers ── */
  let cssW = 1, cssH = 1, scale = 1, dyeW = 0, dyeH = 0, simW = 0, simH = 0;
  let dye = null, vel = null, pres = null, div = null, curl = null, glow = null, probeT = null;
  let stageBox = { x: 0, y: 0, w: 1, h: 1 };
  let band = [0.05, 0.05];
  function stageRect() {
    const hr = host.getBoundingClientRect(), fr = field.getBoundingClientRect();
    return { x: hr.left - fr.left - field.clientLeft, y: hr.top - fr.top - field.clientTop, w: Math.max(1, hr.width), h: Math.max(1, hr.height) };
  }
  function measure() {
    const w = Math.max(1, field.clientWidth), h = Math.max(1, field.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const s = Math.min(dpr, Math.sqrt(BUDGET / (w * h)));
    return { w, h, s, dw: Math.max(64, Math.round(w * s)), dh: Math.max(32, Math.round(h * s)) };
  }
  function allocate() {
    const m = measure();
    const box = stageRect();
    if (dye && m.dw === dyeW && m.dh === dyeH) {
      cssW = m.w; cssH = m.h; scale = m.s; stageBox = box;
      return true;
    }
    const old = dye ? { dye, vel, pres, div, curl, glow, cssW, cssH, box: stageBox } : null;
    cssW = m.w; cssH = m.h; scale = m.s; dyeW = m.dw; dyeH = m.dh; stageBox = box;
    /* the soft band at the edges: wider on a big screen, never wider than a tenth */
    const bx = clamp(cssW * 0.05, 24, 72), by = clamp(cssH * 0.07, 32, 96);
    band = [Math.min(0.1, bx / cssW), Math.min(0.12, by / cssH)];
    simW = Math.max(48, Math.round(dyeW / 6)); simH = Math.max(16, Math.round(dyeH / 6));
    canvas.width = dyeW; canvas.height = dyeH;
    dye = pair(dyeW, dyeH, F.rgba);
    vel = pair(simW, simH, F.rg);
    pres = pair(simW, simH, F.r);
    div = target(simW, simH, F.r);
    curl = target(simW, simH, F.r);
    glow = pair(Math.max(16, Math.round(dyeW / 4)), Math.max(8, Math.round(dyeH / 4)), F.rgba);
    if (!probeT) probeT = target(PROBES, 1, F.bytes);
    if (!(dye.ok && vel.ok && pres.ok && div.ok && curl.ok && glow.ok && probeT.ok)) return false;
    if (old) {
      /* keep the paint where it sat against the word's stage: the stage may
         have moved or changed size inside a section that changed size */
      const k = old.box.w / box.w;
      blend('none');
      const u = pass(P.copy, dye.texel);
      tex(P.copy, 'uSrc', old.dye.read.tex, 0);
      gl.uniform1f(u.uMul, 1);
      gl.uniform4f(u.uMap, (cssW * k) / old.cssW, (cssH * k) / old.cssH, (old.box.x - box.x * k) / old.cssW, 1 - (old.box.y + (cssH - box.y) * k) / old.cssH);
      draw(dye.write);
      dye.swap();
      for (const key of ['dye', 'vel', 'pres', 'div', 'curl', 'glow']) old[key].free();
      dirty = [0, 0, 1, 1];
    }
    return true;
  }

  /* CSS px in the section to the field's uv (y up), and radii to the
     splat shader's units (canvas heights, squared). */
  const U = (x) => x / cssW;
  const V = (y) => 1 - y / cssH;
  const R2 = (r) => (r / cssH) * (r / cssH);

  /* Where paint can be, in uv. The section is big and the paint usually
     covers a small part of it, so the two full-size passes (moving the dye
     and drawing it) run only over this box. It starts as the word's box and
     grows with every splat, and round every push in the fluid by as far as
     paint there could coast once the push stops (the fluid slows at
     VEL_DISSIPATION a second, so from speed v it travels at most v / that;
     doubled, since the flow round a moving tip outruns the tip). Outside it
     both dye buffers stay empty. It starts again with each word. */
  let dirty = null;
  function grow(u0, v0, u1, v1) {
    if (!dirty) { dirty = [Math.max(0, u0), Math.max(0, v0), Math.min(1, u1), Math.min(1, v1)]; return; }
    dirty[0] = Math.max(0, Math.min(dirty[0], u0)); dirty[1] = Math.max(0, Math.min(dirty[1], v0));
    dirty[2] = Math.min(1, Math.max(dirty[2], u1)); dirty[3] = Math.min(1, Math.max(dirty[3], v1));
  }
  /* a push at speed v (px/s) over the CSS box x0..x1, y0..y1 */
  function growRound(x0, y0, x1, y1, v) {
    const m = FINGER_R * 6 + (2 * v) / VEL_DISSIPATION;
    grow(U(Math.min(x0, x1) - m), V(Math.max(y0, y1) + m), U(Math.max(x0, x1) + m), V(Math.min(y0, y1) - m));
  }

  /* ── splats ── */
  function splatDye(x, y, r, rgb, thick, dx = 1, dy = 0, stretch = 1, dry = 0) {
    if (thick <= 0) return;
    const u = pass(P.splat, dye.texel);
    const aspect = cssW / cssH;
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform2f(u.uPoint, U(x), V(y));
    gl.uniform4f(u.uValue, rgb[0] * thick, rgb[1] * thick, rgb[2] * thick, thick);
    gl.uniform1f(u.uRadius, R2(r));
    gl.uniform2f(u.uDir, dx, -dy);
    gl.uniform1f(u.uStretch, stretch);
    gl.uniform1f(u.uDry, dry);
    gl.uniform1f(u.uSeed, seed);
    const reach = (3.4 * r * stretch) / cssH;
    scissorUv(dyeW, dyeH, U(x) - reach / aspect, V(y) - reach, U(x) + reach / aspect, V(y) + reach);
    draw(dye.read);
    grow(U(x) - reach / aspect, V(y) - reach, U(x) + reach / aspect, V(y) + reach);
  }
  /* A push in the fluid, in CSS px per second. */
  function splatVel(x, y, r, vx, vy, dx = 1, dy = 0, stretch = 1) {
    const u = pass(P.splat, vel.texel);
    const aspect = cssW / cssH;
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform2f(u.uPoint, U(x), V(y));
    gl.uniform4f(u.uValue, vx * (simW / cssW) * PUSH, -vy * (simH / cssH) * PUSH, 0, 0);
    gl.uniform1f(u.uRadius, R2(r));
    gl.uniform2f(u.uDir, dx, -dy);
    gl.uniform1f(u.uStretch, stretch);
    gl.uniform1f(u.uDry, 0);
    const reach = (3.4 * r * stretch) / cssH;
    scissorUv(simW, simH, U(x) - reach / aspect, V(y) - reach, U(x) + reach / aspect, V(y) + reach);
    draw(vel.read);
  }
  /* Pull the fluid at a point toward a velocity, in CSS px per second. */
  function dragVel(x, y, r, vx, vy, grip, dx = 1, dy = 0, stretch = 1) {
    const u = pass(P.drag, vel.texel);
    const aspect = cssW / cssH;
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform2f(u.uPoint, U(x), V(y));
    gl.uniform2f(u.uVel, vx * (simW / cssW), -vy * (simH / cssH));
    gl.uniform1f(u.uGrip, grip);
    gl.uniform1f(u.uRadius, R2(r));
    gl.uniform2f(u.uDir, dx, -dy);
    gl.uniform1f(u.uStretch, stretch);
    const reach = (3.4 * r * stretch) / cssH;
    scissorUv(simW, simH, U(x) - reach / aspect, V(y) - reach, U(x) + reach / aspect, V(y) + reach);
    draw(vel.read);
  }
  function erase(x, y, r, amount, dx, dy, stretch) {
    const u = pass(P.erase, dye.texel);
    const aspect = cssW / cssH;
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform2f(u.uPoint, U(x), V(y));
    gl.uniform1f(u.uAmount, amount);
    gl.uniform1f(u.uRadius, R2(r));
    gl.uniform2f(u.uDir, dx, -dy);
    gl.uniform1f(u.uStretch, stretch);
    const reach = (3.4 * r * stretch) / cssH;
    scissorUv(dyeW, dyeH, U(x) - reach / aspect, V(y) - reach, U(x) + reach / aspect, V(y) + reach);
    draw(dye.read);
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
  let idx = 0, current = null, letters = [], total = 1, wordBox = null, wordRect = [0, 0, 1, 1], seed = 0, fontPx = 100, cycle = 0;
  let brushQueue = [];

  /* `from`: seconds into the stroke already painted (a resize mid-word lays
     the word out again without throwing its drops twice) */
  function layoutWord(from = 0) {
    current = words[idx];
    const c1 = current.col, c2 = current.col2 || current.col;
    const text = current.text;
    /* the stage, in canvas pixels; the word's textures cover it and a margin */
    const box = { x: stageBox.x * scale, y: stageBox.y * scale, w: stageBox.w * scale, h: stageBox.h * scale };
    const rx0 = Math.max(0, Math.floor(box.x - box.w * 0.08)), ry0 = Math.max(0, Math.floor(box.y - box.h * 0.2));
    const rx1 = Math.min(dyeW, Math.ceil(box.x + box.w * 1.08)), ry1 = Math.min(dyeH, Math.ceil(box.y + box.h * 1.2));
    const rw = Math.max(8, rx1 - rx0), rh = Math.max(8, ry1 - ry0);
    for (const c of [wordCanvas, timeCanvas]) { c.width = rw; c.height = rh; }
    const ctx = wordCanvas.getContext('2d');
    const tctx = timeCanvas.getContext('2d');
    const narrow = cssW < 560;
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

    ctx.clearRect(0, 0, rw, rh);
    tctx.clearRect(0, 0, rw, rh);
    for (const k of [ctx, tctx]) { k.save(); k.translate(-rx0, -ry0); }
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
    const streaks = Math.round((ink.y1 - ink.y0) / Math.max(3.6 * scale, fontPx * 0.034));
    for (let i = 0; i < streaks; i++) {
      const y = rand(ink.y0, ink.y1), tilt = rand(-0.04, 0.04) * (ink.x1 - ink.x0);
      ctx.strokeStyle = `rgba(0,0,0,${rand(0.05, 0.2).toFixed(2)})`;
      ctx.lineWidth = rand(0.4, 1.2) * scale;
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
    for (const k of [ctx, tctx]) k.restore();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    for (const [t, c] of [[wordTex, wordCanvas], [timeTex, timeCanvas]]) {
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    wordRect = [rx0 / dyeW, 1 - ry1 / dyeH, rw / dyeW, rh / dyeH];
    const pad = fontPx * 0.2;
    wordBox = { x0: (ink.x0 - pad) / dyeW, x1: (ink.x1 + pad) / dyeW, y0: 1 - (ink.y1 + pad) / dyeH, y1: 1 - (ink.y0 - pad) / dyeH };
    /* the brush nudges its fresh paint along as it goes (depositPaint) */
    growRound(ink.x0 / scale, ink.y0 / scale, ink.x1 / scale, ink.y1 / scale, 160);
    seed = Math.random() * 100;
    host.dataset.pwWord = text;
    planBrushDrops(c1, c2, from);
  }

  /* The brush sheds a few drops off its own speed. Each stroke is fast off
     the mark and eases out, so the paint on the bristles wants to keep going
     while the brush slows: a quick, wide letter throws a drop or two forward
     along the stroke, a slow narrow one throws none. In CSS px. */
  function planBrushDrops(c1, c2, from) {
    brushQueue = [];
    const sizeK = clamp(fontPx / scale / 230, 0.5, 1.4);
    for (const L of letters) {
      const w = (L.ink.x1 - L.ink.x0) / scale;
      const peak = (2 * w) / sweepSec;
      const n = clamp(Math.round((peak - 560) / 430), 0, 2);
      for (let i = 0; i < n; i++) {
        const p = 0.1 + 0.5 * ((i + 0.5) / n);
        if (L.t0 + sweepSec * p < from) continue;
        const front = (L.ink.x0 + (L.ink.x1 - L.ink.x0) * (1 - (1 - p) * (1 - p))) / scale;
        const speed = (w * 2 * (1 - p)) / sweepSec;
        const row = clamp((i + 1) / (n + 1) + rand(-0.12, 0.12), 0.08, 0.92);
        const y = (L.ink.y0 + (L.ink.y1 - L.ink.y0) * row + L.dy) / scale;
        brushQueue.push({
          at: L.t0 + sweepSec * p,
          x: front, y,
          vx: speed * rand(0.8, 1.1), vy: -speed * rand(0.02, 0.24),
          r: rand(0.9, 2.3) * sizeK,
          T: rand(0.07, 0.15),
          rgb: mix01(c1, c2, smooth01(0.32, 0.68, row)),
        });
      }
    }
    brushQueue.sort((a, b) => a.at - b.at);
  }

  /* ── paint in the air ── */
  let air = [];
  let drips = [];
  /* counts the page can be checked against (host.__paintStats) */
  const stats = { thrown: 0, landed: 0, satellites: 0, drips: 0, brush: 0, flicks: 0, probes: 0, probeTimeouts: 0 };
  host.__paintStats = stats;

  function launch(d) {
    if (air.length >= MAX_AIR) return false;
    air.push({ gen: 0, t: 0, ...d });
    stats.thrown++;
    return true;
  }

  function land(d, now) {
    const sp = Math.hypot(d.vx, d.vy) || 1;
    const ux = d.vx / sp, uy = d.vy / sp;
    stats.landed++;
    /* the drop flattens to a little under twice its size, longer the
       shallower and faster it came in */
    const stretch = 1 + Math.min(2.4, sp / 650);
    const R = d.r * (1.55 + 0.25 * Math.min(1, sp / 1500));
    const thick = 1.05 + d.r / 6;
    splatDye(d.x, d.y, R, d.rgb, thick, ux, uy, stretch);
    /* what kept going pulls a teardrop out ahead of the splat */
    if (sp > 320 && d.r > 0.9) {
      const off = R * stretch * 0.95;
      splatDye(d.x + ux * off, d.y + uy * off, R * 0.42, d.rgb, thick * 0.9, ux, uy, 1 + stretch * 0.45);
    }
    /* its momentum goes into the paint: the splat slides a little and stops */
    const push = Math.min(380, sp * 0.05 * Math.min(2.5, (d.r * d.r) / 6));
    growRound(d.x - R * 2, d.y - R * 2, d.x + R * 2, d.y + R * 2, push);
    blend('add');
    splatVel(d.x, d.y, R * 2, ux * push, uy * push, ux, uy, 1.4);
    /* a fast heavy drop throws satellites on ahead of it */
    if (d.gen === 0 && d.r > 1.5 && sp > 500) {
      const n = clamp(Math.floor((sp / 650) * (d.r / 2.2)), 0, 6);
      const a0 = Math.atan2(uy, ux);
      for (let k = 0; k < n; k++) {
        const a = a0 + rand(-0.55, 0.55);
        const v = sp * rand(0.22, 0.5);
        if (launch({ gen: 1, x: d.x + ux * R * 0.8, y: d.y + uy * R * 0.8, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: d.r * rand(0.18, 0.38), T: rand(0.025, 0.075), rgb: d.rgb })) stats.satellites++;
      }
    }
    /* heavy enough to run? ask the probe what is there now */
    if (d.r > 2.1 && d.gen === 0) probeQueue.push({ kind: 'land', x: d.x, y: d.y, r: R, after: now + 34 });
  }

  function stepAir(dt, now) {
    if (!air.length) return;
    const keep = [];
    blend('add');
    for (const d of air) {
      d.t += dt;
      const drag = Math.exp((-dt * 1.6) / Math.max(0.6, d.r));
      d.vx *= drag;
      d.vy = d.vy * drag + GRAVITY * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      if (d.t >= d.T) {
        if (d.x > -20 && d.x < cssW + 20 && d.y > -20 && d.y < cssH + 20) land(d, now);
      } else keep.push(d);
    }
    air = keep;
  }

  function drawAir() {
    if (!air.length) return;
    blend('over');
    const u = pass(P.drop, [1 / dyeW, 1 / dyeH]);
    const aspect = cssW / cssH;
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform1f(u.uAlpha, 0.95 * fade);
    for (const d of air) {
      const f = d.t / d.T, lift = 4 * f * (1 - f);
      const r = d.r * (1 + 0.3 * lift);
      const sp = Math.hypot(d.vx, d.vy) || 1;
      const stretch = 1 + Math.min(4, (sp * 0.011) / r);
      gl.uniform2f(u.uPoint, U(d.x), V(d.y));
      gl.uniform3f(u.uColor, d.rgb[0], d.rgb[1], d.rgb[2]);
      gl.uniform1f(u.uRadius, R2(r));
      gl.uniform2f(u.uDir, d.vx / sp, -d.vy / sp);
      gl.uniform1f(u.uStretch, stretch);
      const reach = (7 * r * stretch) / cssH;
      scissorUv(dyeW, dyeH, U(d.x) - reach / aspect, V(d.y) - reach, U(d.x) + reach / aspect, V(d.y) + reach);
      draw(null);
    }
  }

  /* ── drips: heavy paint runs down, thinning, and ends in a bead ── */
  function spawnDrip(x, y, load, rgb) {
    if (drips.length > 24 || load < 60) return;
    drips.push({ x, y, x0: x, y0: y, load, load0: load, rgb, w: clamp(1.2 + Math.sqrt(load) / 10, 1.3, 4), wait: rand(0.22, 0.5), v: 0, phase: rand(0, 6.283) });
    stats.drips++;
  }
  function stepDrips(dt) {
    if (!drips.length) return;
    const keep = [];
    blend('add');
    for (const d of drips) {
      if (d.wait > 0) { d.wait -= dt; keep.push(d); continue; }
      const left = Math.max(0, d.load / d.load0);
      /* a full run moves quickly and slows as it thins */
      const target = (20 + 52 * clamp(d.load0 / 520, 0.4, 1.4)) * (0.35 + 0.65 * Math.sqrt(left));
      d.v += (target - d.v) * Math.min(1, dt * 5);
      const dy = Math.max(0.2, d.v * dt);
      const w = d.w * (0.55 + 0.45 * Math.sqrt(left));
      /* no board is perfectly flat: the run wanders a pixel or so */
      const y = d.y + dy;
      const x = d.x0 + 1.1 * (Math.sin((y - d.y0) * 0.05 + d.phase) - Math.sin(d.phase));
      const T = 1.05;
      const stretch = 1 + dy / w;
      splatDye(x, y, w, d.rgb, (T * dy) / (SQRT_PI * w * stretch), 0, 1, stretch);
      d.load -= T * SQRT_PI * w * dy;
      d.x = x;
      d.y = y;
      if (d.load > 0 && d.y < cssH) keep.push(d);
      else splatDye(d.x, d.y + w * 0.6, w * 1.55, d.rgb, 1.3);
    }
    drips = keep;
  }

  /* ── the probe: what's under a point, read back a frame or two late ── */
  let probeQueue = [];
  let inflight = null;
  const probeBytes = new Uint8Array(PROBES * 4);
  /* two read buffers, taken in turn, so one is never written while the
     other's answer is still on its way back */
  const pbos = [gl.createBuffer(), gl.createBuffer()];
  let pboTurn = 0;
  for (const b of pbos) {
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, b);
    gl.bufferData(gl.PIXEL_PACK_BUFFER, PROBES * 4, gl.STREAM_READ);
  }
  gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

  function issueProbes(now) {
    if (inflight) return;
    const reqs = [];
    if (ptr && now - lastEventAt < 160) {
      /* A moving tip drives a bow wave: the paint ahead of it is pushed on
         before the tip arrives, and what's right under it is the channel it
         has already cleared. What it gathers is the paint in its way, so
         read a small fan across its path, beyond the wave; the heaviest
         reading counts. At rest, read under the tip. */
      const s = Math.hypot(fv.x, fv.y);
      const ux = s > 1 ? fv.x / s : 0, uy = s > 1 ? fv.y / s : 0;
      const reach = s > 1 ? clamp(FINGER_R * 2 + s * 0.035, FINGER_R * 2, 90) : 0;
      for (const [a, side] of [[0.65, 0], [1, 0], [0.85, 0.9], [0.85, -0.9]]) {
        const along = reach * a, across = FINGER_R * side;
        reqs.push({ kind: 'finger', x: ptr.x + ux * along - uy * across, y: ptr.y + uy * along + ux * across });
      }
    }
    const later = [];
    for (const q of probeQueue) {
      if (reqs.length < PROBES && q.after <= now) reqs.push(q); else later.push(q);
    }
    probeQueue = later;
    if (!reqs.length) return;
    gl.disable(gl.BLEND);
    gl.enable(gl.SCISSOR_TEST);
    const u = pass(P.probe, [1, 1]);
    tex(P.probe, 'uSrc', dye.read.tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, probeT.fb);
    gl.viewport(0, 0, PROBES, 1);
    reqs.forEach((q, i) => {
      /* a fingertip's width for the finger, the splat's own size for a landing */
      const rr = q.kind === 'finger' ? FINGER_R * 0.8 : Math.max(1.5, q.r * 0.6);
      gl.scissor(i, 0, 1, 1);
      gl.uniform2f(u.uR, rr / cssW, rr / cssH);
      gl.uniform2f(u.uAt, U(q.x), V(q.y));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    });
    gl.disable(gl.SCISSOR_TEST);
    const pbo = pbos[pboTurn];
    pboTurn = 1 - pboTurn;
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo);
    gl.readPixels(0, 0, PROBES, 1, gl.RGBA, gl.UNSIGNED_BYTE, 0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    inflight = { sync, reqs, at: now, cycle, pbo };
    stats.probes++;
  }
  function pollProbes(now) {
    if (!inflight) return;
    const { sync } = inflight;
    if (sync && gl.getSyncParameter(sync, gl.SYNC_STATUS) !== gl.SIGNALED) {
      if (now - inflight.at > 600) { gl.deleteSync(sync); inflight = null; stats.probeTimeouts++; }
      return;
    }
    if (sync) gl.deleteSync(sync);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, inflight.pbo);
    gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, probeBytes);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    const { reqs } = inflight;
    const stale = inflight.cycle !== cycle;
    inflight = null;
    if (stale) return;   /* asked about the last word's paint */
    let front = -1, frontRgb = null;
    reqs.forEach((q, i) => {
      const b = probeBytes.subarray(i * 4, i * 4 + 4);
      const thick = (b[3] / 255) * 2;
      const rgb = [b[0] / 255, b[1] / 255, b[2] / 255];
      if (q.kind === 'finger') {
        if (thick > front) { front = thick; frontRgb = rgb; }
      } else if (q.kind === 'land' && thick >= DRIP_THICK) {
        /* the landing left the paint thick enough to run */
        spawnDrip(q.x, q.y + q.r * 0.6, (thick - DRIP_THICK + 0.25) * 420, rgb);
      }
    });
    if (front >= 0) {
      finger.under = front;
      if (front > 0.05) finger.underRgb = frontRgb;
    }
  }

  /* ── the finger ── */
  let ptr = null, moves = [], lastInput = -1e9, lastEventAt = -1e9, lastFlickAt = -1e9;
  let fv = { x: 0, y: 0 }, peak = { s: 0, x: 0, y: 0, t: -1e9 };
  let shedDebt = 0;
  const finger = { load: 0, rgb: [1, 1, 1], under: 0, underRgb: [0, 0, 0] };

  function toField(ev, fr) { return { x: ev.clientX - fr.left - field.clientLeft, y: ev.clientY - fr.top - field.clientTop }; }
  function sample(p, t, now) {
    if (!ptr) { ptr = { x: p.x, y: p.y, t }; return; }
    const dt = (t - ptr.t) / 1000;
    const dx = p.x - ptr.x, dy = p.y - ptr.y;
    if (dt <= 0.0005) { ptr.x = p.x; ptr.y = p.y; return; }
    const step = Math.max(dt, 0.004);
    moves.push({ x0: ptr.x, y0: ptr.y, x1: p.x, y1: p.y, dt: step });
    const k = 1 - Math.exp(-dt / 0.028);
    fv.x += (dx / step - fv.x) * k;
    fv.y += (dy / step - fv.y) * k;
    const s = Math.hypot(fv.x, fv.y);
    if (s > peak.s || now - peak.t > 110) peak = { s, x: fv.x, y: fv.y, t: now };
    ptr = { x: p.x, y: p.y, t };
  }
  function onMove(e) {
    if (!running) { ptr = null; return; }
    if (e.pointerType !== 'mouse' && !(e.buttons & 1)) { ptr = null; return; }
    const fr = field.getBoundingClientRect();
    const now = performance.now();
    const list = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : null;
    for (const ev of (list && list.length ? list : [e])) sample(toField(ev, fr), ev.timeStamp, now);
    lastInput = now;
    lastEventAt = now;
    host.dataset.pwMoves = String((Number(host.dataset.pwMoves) || 0) + 1);
    wake();
  }
  function onLift(e) {
    if (e && e.type === 'pointerup' && e.pointerType === 'mouse') return;
    if (ptr && running) { flick(performance.now(), true); wake(); }
    /* what's still on the finger leaves with it */
    ptr = null;
    finger.load = 0;
  }
  /* The page scrolled under a still pointer: start the path again rather
     than read the jump as a strike. */
  function onScroll() { ptr = null; }

  /* The push, laid along the whole path so a fast strike leaves no gaps: the
     paint parts around the tip and bunches across its front. Then the tip
     lays down what it carries along the same path, thinner as it runs dry,
     so a drag pulls a smear out of the word and on across the section. */
  function pushAlong(mv) {
    const dx = mv.x1 - mv.x0, dy = mv.y1 - mv.y0;
    const len = Math.hypot(dx, dy);
    if (len < 0.05) return 0;
    const ux = dx / len, uy = dy / len;
    const speed = Math.min(len / mv.dt, 4300) * PUSH;
    growRound(mv.x0, mv.y0, mv.x1, mv.y1, speed);
    const r = FINGER_R;
    /* the drag can't overshoot, so the splats needn't pile up: one every
       0.8 of the tip's radius keeps the path unbroken */
    const steps = Math.min(16, Math.max(1, Math.ceil(len / (r * 0.8))));
    blend('lerp');
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      dragVel(mv.x0 + dx * t, mv.y0 + dy * t, r, ux * speed, uy * speed, GRIP, ux, uy, 1.25);
    }
    if (finger.load > LOAD_MIN) {
      const dV = finger.load * (1 - Math.exp(-len / CARRY_LEN));
      const w = r * 0.8;
      const thick = dV / (SQRT_PI * w * len);
      /* thin paint goes on in streaks, the way a nearly dry finger drags */
      const dry = clamp(1 - thick / 0.7, 0, 0.85);
      const A = (thick * (len / steps)) / (SQRT_PI * w);
      blend('add');
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        splatDye(mv.x0 + dx * t, mv.y0 + dy * t, w, finger.rgb, A, ux, uy, 1, dry);
      }
      finger.load -= dV;
    }
    return len;
  }

  function flick(now, lifted) {
    if (!ptr || now - lastFlickAt < 140) return;
    const fresh = now - peak.t < (lifted ? 90 : 160);
    if (!fresh || peak.s < FLICK_SPEED) return;
    lastFlickAt = now;
    const s = peak.s, ux = peak.x / s, uy = peak.y / s;
    peak = { s: 0, x: 0, y: 0, t: -1e9 };
    if (finger.load < LOAD_MIN) return;
    stats.flicks++;
    /* how many and how big: a heavier load throws more and bigger drops, a
       harder flick throws them further, in a tighter fan */
    const loadK = clamp(finger.load / 2400, 0, 1);
    const n = clamp(Math.round(2 + loadK * 6 + (s - FLICK_SPEED) / 900), 1, 11);
    const spread = clamp(0.55 - s / 9000, 0.16, 0.5);
    const rMain = clamp((1.5 + loadK * 3.5) * Math.pow(1200 / s, 0.3), 1.1, 5.4);
    const a0 = Math.atan2(uy, ux);
    let left = finger.load;
    for (let i = 0; i < n && left > LOAD_MIN * 0.5; i++) {
      const r = i === 0 ? rMain : rMain * rand(0.25, 0.7);
      const a = a0 + rand(-spread, spread) * (i === 0 ? 0.3 : 1);
      const v = s * rand(0.75, 1.25) * (i === 0 ? 0.9 : 1);
      if (!launch({ x: ptr.x + ux * FINGER_R * 0.9, y: ptr.y + uy * FINGER_R * 0.9, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r, T: rand(0.06, 0.18) * (i === 0 ? 0.85 : 1), rgb: finger.rgb.slice() })) break;
      left -= dropVolume(r);
    }
    finger.load = Math.max(0, left);
  }

  /* droplets come off the front of a fast tip, smaller the faster it goes */
  function shed(now, dt) {
    const s = Math.hypot(fv.x, fv.y);
    if (!ptr || s < SHED_SPEED || finger.load < LOAD_MIN || now - lastEventAt > 40) { shedDebt = 0; return; }
    shedDebt += dt * 34 * (s / SHED_SPEED - 1) * clamp(finger.load / 1500, 0.15, 1);
    const ux = fv.x / s, uy = fv.y / s;
    let thrown = 0;
    while (shedDebt >= 1 && finger.load - thrown > LOAD_MIN) {
      shedDebt -= 1;
      const side = rand(-0.6, 0.6) * FINGER_R;
      const a = Math.atan2(uy, ux) + rand(-0.4, 0.4);
      const v = s * rand(0.9, 1.3);
      const r = rand(0.7, 1.6) * clamp(1800 / s, 0.6, 1.2);
      if (!launch({ x: ptr.x + ux * FINGER_R * 0.9 - uy * side, y: ptr.y + uy * FINGER_R * 0.9 + ux * side, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r, T: rand(0.05, 0.14), rgb: finger.rgb.slice() })) break;
      thrown += dropVolume(r);
    }
    finger.load -= thrown;
  }

  /* The load is the paint on the tip. It takes on the paint in its way (what
     the probe last found across its front), and what it takes on comes off
     the board, from the lump at its front, so paint is never made from
     nothing: it moves from the board to the finger, into the air and back. */
  function applyFinger(now, dt) {
    let path = 0;
    if (moves.length) {
      for (const mv of moves) path += pushAlong(mv);
      moves = [];
    }
    if (path > 0 && ptr && finger.under > 0.08) {
      const before = finger.load;
      finger.load = Math.min(LOAD_MAX, finger.load + PICKUP * (finger.under - 0.05) * path);
      const got = finger.load - before;
      if (got > 0) {
        const t = got / Math.max(1, finger.load);
        finger.rgb = finger.rgb.map((c, i) => c + (finger.underRgb[i] - c) * t);
        const s = Math.hypot(fv.x, fv.y);
        const ux = s > 1 ? fv.x / s : 1, uy = s > 1 ? fv.y / s : 0;
        const R = FINGER_R * 1.3;
        const there = Math.PI * R * R * finger.under;
        blend('erase');
        erase(ptr.x + ux * FINGER_R * 1.1, ptr.y + uy * FINGER_R * 1.1, R, clamp(got / there, 0, 0.9), ux, uy, 1.2);
      }
    }
    if (!ptr) return;
    if (now - lastEventAt > 50 || Math.hypot(fv.x, fv.y) < peak.s * 0.4) flick(now, false);
    shed(now, dt);
  }

  /* ── one step of the fluid ── */
  function step(dt) {
    blend('none');
    let u = pass(P.curl, vel.texel);
    tex(P.curl, 'uVel', vel.read.tex, 0);
    draw(curl);
    u = pass(P.vorticity, vel.texel);
    tex(P.vorticity, 'uVel', vel.read.tex, 0);
    tex(P.vorticity, 'uCurl', curl.tex, 1);
    gl.uniform1f(u.uCurlK, CURL);
    gl.uniform1f(u.uDt, dt);
    draw(vel.write); vel.swap();
    u = pass(P.viscous, vel.texel);
    gl.uniform1f(u.uK, VISCOSITY);
    for (let i = 0; i < 2; i++) {
      tex(P.viscous, 'uVel', vel.read.tex, 0);
      draw(vel.write); vel.swap();
    }
    pass(P.divergence, vel.texel);
    tex(P.divergence, 'uVel', vel.read.tex, 0);
    draw(div);
    u = pass(P.copy, pres.texel);
    tex(P.copy, 'uSrc', pres.read.tex, 0);
    gl.uniform1f(u.uMul, 0.8);
    gl.uniform4f(u.uMap, 1, 1, 0, 0);
    draw(pres.write); pres.swap();
    pass(P.pressure, pres.texel);
    tex(P.pressure, 'uDiv', div.tex, 1);
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      tex(P.pressure, 'uP', pres.read.tex, 0);
      draw(pres.write); pres.swap();
    }
    pass(P.gradient, vel.texel);
    tex(P.gradient, 'uP', pres.read.tex, 0);
    tex(P.gradient, 'uVel', vel.read.tex, 1);
    draw(vel.write); vel.swap();
    u = pass(P.advect, vel.texel);
    tex(P.advect, 'uVel', vel.read.tex, 0);
    tex(P.advect, 'uSrc', vel.read.tex, 1);
    gl.uniform2f(u.uSimTexel, 1 / simW, 1 / simH);
    gl.uniform1f(u.uDt, dt);
    gl.uniform1f(u.uDiss, VEL_DISSIPATION);
    gl.uniform1f(u.uEdgeLoss, 0);
    gl.uniform2f(u.uBand, band[0], band[1]);
    draw(vel.write); vel.swap();
    if (!dirty) return;
    pass(P.advect, dye.texel);
    tex(P.advect, 'uVel', vel.read.tex, 0);
    tex(P.advect, 'uSrc', dye.read.tex, 1);
    gl.uniform1f(u.uDiss, 0);
    gl.uniform1f(u.uEdgeLoss, EDGE_LOSS);
    gl.enable(gl.SCISSOR_TEST);
    scissorUv(dyeW, dyeH, dirty[0], dirty[1], dirty[2], dirty[3]);
    draw(dye.write); dye.swap();
    gl.disable(gl.SCISSOR_TEST);
  }

  function render() {
    blend('none');
    pass(P.bright, glow.texel);
    tex(P.bright, 'uSrc', dye.read.tex, 0);
    draw(glow.write); glow.swap();
    const u = pass(P.blur, glow.texel);
    for (const [dx, dy] of [[1, 0], [0, 1], [2.2, 0], [0, 2.2]]) {
      tex(P.blur, 'uSrc', glow.read.tex, 0);
      gl.uniform2f(u.uDir, dx / glow.w, dy / glow.h);
      draw(glow.write); glow.swap();
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (dirty) {
      const d = pass(P.display, dye.texel);
      tex(P.display, 'uDye', dye.read.tex, 0);
      tex(P.display, 'uGlow', glow.read.tex, 1);
      gl.uniform2f(d.uDyeTexel, 1 / dyeW, 1 / dyeH);
      gl.uniform1f(d.uFade, fade);
      gl.uniform1f(d.uGlowK, GLOW);
      gl.uniform2f(d.uBand, band[0], band[1]);
      /* the paint, and the glow it throws onto the black around it */
      const gx = 72 / cssW, gy = 72 / cssH;
      gl.enable(gl.SCISSOR_TEST);
      scissorUv(dyeW, dyeH, dirty[0] - gx, dirty[1] - gy, dirty[2] + gx, dirty[3] + gy);
      draw(null);
      gl.disable(gl.SCISSOR_TEST);
    }
    drawAir();
    blend('none');
  }

  function depositPaint(prev, now) {
    blend('add');
    const u = pass(P.deposit, dye.texel);
    tex(P.deposit, 'uWord', wordTex, 0);
    tex(P.deposit, 'uTime', timeTex, 1);
    gl.uniform4f(u.uRect, wordRect[0], wordRect[1], wordRect[2], wordRect[3]);
    gl.uniform1f(u.uPrev, prev);
    gl.uniform1f(u.uNow, now);
    gl.uniform1f(u.uRows, dyeH / (2.5 * scale));
    gl.uniform1f(u.uJitter, 0.009);
    gl.uniform1f(u.uSeed, seed);
    gl.uniform1f(u.uDye, 1);
    gl.uniform2f(u.uPush, 0, 0);
    scissorUv(dyeW, dyeH, wordBox.x0, wordBox.y0, wordBox.x1, wordBox.y1);
    draw(dye.read);
    /* the brush drags its fresh paint a little the way it is going */
    const frontSpeed = ((letters.length ? (letters[0].ink.x1 - letters[0].ink.x0) : fontPx * 0.5) / dyeW) * simW / sweepSec;
    if (u.uTexel) gl.uniform2f(u.uTexel, vel.texel[0], vel.texel[1]);
    gl.uniform1f(u.uDye, 0);
    gl.uniform2f(u.uPush, frontSpeed * 0.14, -frontSpeed * 0.02);
    scissorUv(simW, simH, wordBox.x0, wordBox.y0, wordBox.x1, wordBox.y1);
    draw(vel.read);
  }
  function brushDrops(t) {
    while (brushQueue.length && brushQueue[0].at <= t) {
      const b = brushQueue.shift();
      if (launch({ x: b.x, y: b.y, vx: b.vx, vy: b.vy, r: b.r, T: b.T, rgb: b.rgb })) stats.brush++;
    }
  }

  /* ── the cycle: paint in, hold, wash out, next ── */
  let running = false, destroyed = false, raf = 0, timer = 0, started = false;
  let phase = 'idle', paintStart = 0, prevT = -1, holdUntil = 0, fadeStart = 0, fade = 1, lastFrame = 0, pausedAt = 0;

  function clearFields() { dye.clear(); vel.clear(); pres.clear(); }
  function nextWord() {
    cycle++;
    clearFields();
    dirty = null;
    layoutWord();
    air = [];
    drips = [];
    probeQueue = [];
    finger.load = 0;
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
    const dt = Math.min(1 / 30, Math.max(1 / 240, (now - lastFrame) / 1000));
    lastFrame = now;
    pollProbes(now);
    if (phase === 'painting') {
      const t = (now - paintStart) / 1000;
      const tn = Math.min(1.02, t / total);
      depositPaint(prevT, tn);
      prevT = tn;
      brushDrops(t);
      if (t >= total + 0.12) { phase = 'holding'; holdUntil = now + holdMs; }
    }
    /* read what's under the tip before the tip wipes it */
    issueProbes(now);
    applyFinger(now, dt);
    stepAir(dt, now);
    stepDrips(dt);
    step(dt);
    if (phase === 'holding' && now >= holdUntil && now - lastInput > 1500 && !air.length && !drips.length) { phase = 'fading'; fadeStart = now; }
    if (phase === 'fading') {
      fade = Math.max(0, 1 - (now - fadeStart) / (fadeSec * 1000));
      if (now - lastInput < 300) { phase = 'holding'; holdUntil = now + 1200; fade = 1; }
    }
    render();
    if (phase === 'fading' && fade <= 0) { idx = (idx + 1) % words.length; nextWord(); return; }
    const busy = phase === 'painting' || phase === 'fading' || air.length || drips.length || inflight || probeQueue.length || now - lastInput < 1800;
    if (busy) { raf = requestAnimationFrame(frame); return; }
    /* nothing moving: stop drawing, and come back when the hold is up */
    const wait = Math.max(holdUntil, lastInput + 1500) - now;
    timer = setTimeout(wake, Math.max(16, wait));
  }

  /* ── resize: keep the paint, follow the stage ── */
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
    if (destroyed || !started) return;
    if (!allocate()) { fail(); return; }
    if (phase === 'painting') layoutWord((performance.now() - paintStart) / 1000);
    if (!raf) render();
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
  field.addEventListener('pointermove', onMove);
  field.addEventListener('pointerdown', onMove);
  field.addEventListener('pointerleave', onLift);
  field.addEventListener('pointerup', onLift);
  field.addEventListener('pointercancel', onLift);
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!allocate()) {
    canvas.remove();
    return null;
  }
  if (ro) { ro.observe(field); if (host !== field) ro.observe(host); }

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
      ptr = null;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true; running = false;
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(timer);
      if (ro) ro.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      for (const [ev, fn] of [['pointermove', onMove], ['pointerdown', onMove], ['pointerleave', onLift], ['pointerup', onLift], ['pointercancel', onLift]]) field.removeEventListener(ev, fn);
      window.removeEventListener('scroll', onScroll);
      if (inflight && inflight.sync && !failed) gl.deleteSync(inflight.sync);
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose && !failed) lose.loseContext();
      delete host.__paintStats;
      canvas.remove();
    },
  };
  return api;
}
