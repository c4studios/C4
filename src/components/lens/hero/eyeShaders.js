/* GLSL for the /Lens hero eye (WebGL2, hand-written).
   Bake passes run once at start-up and write textures: noise, iris, sclera.
   Everything with loops or fbm lives in those. The per-frame shader (FS_EYE)
   does the geometry and the light with a handful of texture reads.
   Units: 1 = the iris radius. Seeds are fixed, so it is the same eye on
   every visit. */

export const VS = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const NOISE = `
vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
}
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float gn(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(hash33(i), f);
  float b = dot(hash33(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
  float c = dot(hash33(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
  float d = dot(hash33(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
  float e = dot(hash33(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
  float g = dot(hash33(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
  float h = dot(hash33(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
  float k = dot(hash33(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));
  return mix(mix(mix(a, b, u.x), mix(c, d, u.x), u.y), mix(mix(e, g, u.x), mix(h, k, u.x), u.y), u.z);
}
float fbm(vec3 p, int oct) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 8; i++) {
    if (i >= oct) break;
    s += a * gn(p);
    p = p * 2.03 + vec3(19.1, 7.3, 3.7);
    a *= 0.5;
  }
  return s;
}
`;

/* Tileable noise: R fine, G medium, B coarse, A very fine (pores). */
export const FS_NOISE = `#version 300 es
precision highp float;
uniform vec2 uSize;
out vec4 o;
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
}
float pn(vec2 p, float P) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 i0 = mod(i, P);
  vec2 i1 = mod(i + 1.0, P);
  float a = dot(hash22(i0 + 7.0), f);
  float b = dot(hash22(vec2(i1.x, i0.y) + 7.0), f - vec2(1.0, 0.0));
  float c = dot(hash22(vec2(i0.x, i1.y) + 7.0), f - vec2(0.0, 1.0));
  float d = dot(hash22(i1 + 7.0), f - 1.0);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float pfbm(vec2 p, float P, int oct) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= oct) break;
    s += a * pn(p, P);
    p *= 2.0;
    P *= 2.0;
    a *= 0.5;
  }
  return s;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  float r = pfbm(uv * 32.0, 32.0, 4);
  float g = pfbm(uv * 8.0, 8.0, 5);
  float b = pfbm(uv * 3.0, 3.0, 5);
  float a = pfbm(uv * 96.0, 96.0, 2);
  o = vec4(r, g, b, a) * 0.85 + 0.5;
}`;

/* The iris, 1024 x 1024. Cartesian storage, polar construction.
   RGB = linear colour (written to an sRGB texture), A = fibre height.
   The pupil edge sits at PR0 = 0.30; the per-frame shader remaps the radius
   so the fibres stretch and bunch as the aperture opens and closes. */
export const FS_IRIS = `#version 300 es
precision highp float;
uniform vec2 uSize;
out vec4 o;
const float E = 1.02;
const float PR0 = 0.30;
const float PI = 3.14159265;
const float TAU = 6.28318531;
const vec3 SEED = vec3(3.1, 17.7, 5.3);
${NOISE}
void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  vec2 p = (uv * 2.0 - 1.0) * E;
  float r = length(p);
  float th = atan(p.y, p.x);
  vec2 cs = vec2(cos(th), sin(th));

  // Slow noise warps the angle so the fibres wave.
  float warp = 0.11 * gn(vec3(cs * 1.7, r * 2.6) + SEED) + 0.045 * gn(vec3(cs * 4.1, r * 5.0) + SEED.yzx);
  float tw = th + warp;
  vec2 cw = vec2(cos(tw), sin(tw));

  // Fibres: ~90 around (fine) and ~28 around (bundles), stretched along the radius.
  float f1n = gn(vec3(cw * 14.3, r * 2.3) + SEED * 1.3);
  float f1 = pow(clamp(1.0 - abs(f1n) * 2.7, 0.0, 1.0), 2.4);
  float f1b = gn(vec3(cw * 22.0, r * 3.4) + SEED * 2.1);
  float f1c = pow(clamp(1.0 - abs(f1b) * 3.2, 0.0, 1.0), 3.0);
  float f2n = gn(vec3(cw * 4.46, r * 1.4) + SEED * 0.7);
  float f2 = smoothstep(-0.28, 0.42, f2n);
  float brk = smoothstep(-0.32, 0.28, gn(vec3(cw * 9.0, r * 7.5) + SEED.zxy));
  float grain = fbm(vec3(cw * 46.0, r * 14.0) + SEED, 3);
  float fib = (0.62 * f1 + 0.48 * f1c) * mix(0.5, 1.0, brk);
  fib = clamp(fib * mix(0.62, 1.2, f2), 0.0, 1.0);

  // Collarette: a wavy raised ring at about r = 0.44.
  float rc = 0.44 + 0.034 * gn(vec3(cs * 1.5, 0.5) + SEED) + 0.026 * gn(vec3(cs * 5.0, 1.7) + SEED) + 0.012 * gn(vec3(cs * 13.0, 3.1) + SEED);
  float dc = r - rc;
  float cwid = 0.011 + 0.009 * clamp(gn(vec3(cs * 4.0, 6.0) + SEED) + 0.5, 0.0, 1.0);
  float collB = smoothstep(-0.28, 0.3, gn(vec3(cs * 3.3, 9.5) + SEED.zyx));
  float coll = exp(-dc * dc / (cwid * cwid)) * (0.35 + 0.65 * collB);
  float shadowOut = exp(-(dc - 0.032) * (dc - 0.032) / (0.016 * 0.016));
  float inner = 1.0 - smoothstep(-0.012, 0.014, dc);

  // Crypts: almond-shaped holes just outside the collarette, and a few further out.
  float crypt = 0.0;
  for (int ring = 0; ring < 2; ring++) {
    float N = ring == 0 ? 17.0 : 23.0;
    float k0 = floor((th + PI) / TAU * N);
    for (int j = -1; j <= 1; j++) {
      float k = k0 + float(j);
      float kk = mod(k, N);
      float fr = float(ring);
      float hA = hash12(vec2(kk, 3.7 + fr * 11.0));
      float hB = hash12(vec2(kk, 9.1 + fr * 11.0));
      float hC = hash12(vec2(kk, 1.3 + fr * 11.0));
      float keep = ring == 0 ? 0.42 : 0.78;
      if (hA < keep) continue;
      float ca = (k + 0.5 + (hB - 0.5) * 0.7) / N * TAU - PI;
      float cr = ring == 0 ? rc + 0.05 + hC * 0.065 : 0.66 + hC * 0.13;
      float da = mod(th - ca + PI, TAU) - PI;
      vec2 lc = vec2(r - cr, da * r);
      float sz = ring == 0 ? 1.0 : 0.6;
      float hw = (0.020 + 0.018 * hB) * sz;
      float hl = (0.045 + 0.05 * hC) * sz;
      float d = abs(lc.x) / hw + (lc.y / hl) * (lc.y / hl) + 0.35 * gn(vec3(p * 38.0, fr + kk));
      crypt = max(crypt, (1.0 - smoothstep(0.62, 1.0, d)) * (0.6 + 0.4 * hB));
    }
  }

  // Contraction furrows: broken concentric rings toward the edge.
  float furrow = 0.0;
  float lip = 0.0;
  for (int k = 0; k < 4; k++) {
    float fk = float(k);
    float rk = 0.63 + fk * 0.064 + 0.009 * gn(vec3(cs * 3.0, fk * 4.1) + SEED);
    float present = smoothstep(-0.02, 0.22, gn(vec3(cs * 2.2, fk * 7.3) + SEED.yxz));
    float d = r - rk;
    furrow = max(furrow, present * exp(-d * d / (0.0048 * 0.0048)));
    lip = max(lip, present * exp(-(d + 0.009) * (d + 0.009) / (0.0055 * 0.0055)));
  }

  // A few pigment freckles.
  float frk = 0.0;
  for (int k = 0; k < 6; k++) {
    float fk = float(k);
    float a = hash12(vec2(fk, 41.0)) * TAU - PI;
    float rr = 0.54 + 0.27 * hash12(vec2(fk, 13.0));
    vec2 c = rr * vec2(cos(a), sin(a));
    float rad = 0.011 + 0.016 * hash12(vec2(fk, 77.0));
    float d = length(p - c) + 0.007 * gn(vec3(p * 70.0, fk));
    frk = max(frk, (1.0 - smoothstep(rad * 0.55, rad, d)) * step(0.3, hash12(vec2(fk, 5.0))));
  }

  // Colour, linear.
  vec3 AMBER = vec3(0.807, 0.381, 0.098);
  vec3 HONEY = vec3(0.92, 0.60, 0.25);
  vec3 OCHRE = vec3(0.36, 0.165, 0.032);
  vec3 BROWN = vec3(0.085, 0.032, 0.009);
  vec3 GREEN = vec3(0.105, 0.118, 0.062);
  vec3 LIMB = vec3(0.0055, 0.0085, 0.0085);
  vec3 RUFF = vec3(0.040, 0.015, 0.005);

  vec3 pupZ = mix(OCHRE, AMBER, fib);
  pupZ = mix(pupZ, HONEY, f1c * 0.55 * brk);
  vec3 cilIn = mix(BROWN * 1.7, mix(AMBER, OCHRE, 0.32), fib);
  vec3 cilOut = mix(GREEN * 0.55, mix(GREEN * 1.6, AMBER * 0.7, 0.45), fib);
  float z = smoothstep(0.6, 0.84, r);
  vec3 col = mix(cilIn, cilOut, z);
  col = mix(col, pupZ, inner);
  col = mix(col, HONEY * 0.85, coll * 0.2 * collB);
  col *= 1.0 - 0.3 * shadowOut;
  col = mix(col, BROWN * 0.45 + vec3(0.05, 0.02, 0.004) * fib, crypt * 0.7);
  col *= 1.0 - 0.55 * furrow;
  col += lip * 0.07 * AMBER;
  col = mix(col, vec3(0.045, 0.018, 0.005), frk * 0.85);
  col *= 0.84 + 0.32 * clamp(grain + 0.5, 0.0, 1.0);
  float lowf = gn(vec3(cs * 1.2, r * 1.5) + 9.0);
  col *= 0.9 + 0.22 * lowf;
  col = mix(col, col * vec3(0.9, 1.0, 0.9), smoothstep(0.0, 0.5, gn(vec3(cs * 0.9, 4.0) + SEED)) * z);

  // Limbal ring over the outer 14%: dark and cool.
  float limb = smoothstep(0.84, 0.985, r);
  col = mix(col, LIMB * (0.8 + 0.6 * fib), limb * 0.94);

  // Ruff: a narrow dark-brown crenellated band at the pupil margin.
  // organic, not a cog: tooth width and depth vary with noise, with gaps
  float dr = r - PR0;
  float cren = sin(th * 46.0 + 3.2 * gn(vec3(cs * 6.0, 0.0) + SEED) + 1.6 * gn(vec3(cs * 15.0, 2.0) + SEED));
  float depth = clamp(0.5 + gn(vec3(cs * 9.0, 5.0) + SEED.yzx), 0.0, 1.0) * smoothstep(-0.22, 0.12, gn(vec3(cs * 3.2, 8.0) + SEED.zxy));
  float teeth = smoothstep(-0.1, 0.95, cren) * depth;
  float ro = 0.010 + 0.016 * teeth;
  float ruff = 1.0 - smoothstep(ro - 0.0035, ro + 0.0035, dr);
  cren = teeth * 2.0 - 1.0;
  col = mix(col, RUFF * (0.8 + 0.4 * teeth), ruff * 0.93);
  col = mix(col, vec3(0.003), 1.0 - smoothstep(-0.03, -0.004, dr));

  float h = 0.34 + 0.46 * fib + 0.28 * coll - 0.42 * crypt - 0.36 * furrow + 0.12 * lip + 0.08 * frk + 0.12 * ruff * cren;
  h += 0.06 * grain;
  o = vec4(clamp(col, 0.0, 1.0), clamp(h, 0.0, 1.0));
}`;

/* The sclera, 1024 x 1024, in the eyeball's own frame (it turns with the
   gaze). RGB = albedo, A = wetness variation. Veins: few, fine, mostly toward
   the corners. */
export const FS_SCLERA = `#version 300 es
precision highp float;
uniform vec2 uSize;
out vec4 o;
const vec3 SEED = vec3(7.7, 2.9, 13.1);
${NOISE}
void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  vec2 s = uv * 2.0 - 1.0;
  float ax = abs(s.x);
  float t1 = fbm(vec3(s * 2.5, 1.0) + SEED, 4);
  vec3 base = vec3(0.86, 0.80, 0.71) * (1.0 + 0.07 * t1);
  base = mix(base, vec3(0.86, 0.66, 0.58), smoothstep(0.42, 1.0, ax) * 0.4);
  base = mix(base, vec3(0.82, 0.77, 0.6), smoothstep(0.25, 0.9, ax) * 0.25 * clamp(t1 + 0.5, 0.0, 1.0));

  vec2 wv = vec2(gn(vec3(s * 3.0, 4.0) + SEED), gn(vec3(s * 3.0, 9.0) + SEED));
  float n1 = gn(vec3(s.x * 2.6 + wv.x * 0.4, s.y * 6.0 + wv.y * 0.55, 2.3) + SEED);
  float w1 = mix(0.014, 0.04, smoothstep(0.3, 1.0, ax));
  float v1 = 1.0 - smoothstep(w1 * 0.35, w1, abs(n1));
  float n2 = gn(vec3(s.x * 7.0 + wv.y, s.y * 13.0 + wv.x, 7.1) + SEED);
  float v2 = 1.0 - smoothstep(0.004, 0.012, abs(n2));
  float corner = smoothstep(0.28, 0.8, ax);
  float patchy = smoothstep(0.0, 0.3, gn(vec3(s * 2.2, 11.0) + SEED)) * smoothstep(-0.1, 0.25, gn(vec3(s * 6.5, 3.0) + SEED.zxy));
  float vein = clamp(v1 * corner * patchy * 0.6 + v2 * corner * corner * patchy * 0.4, 0.0, 1.0);
  vec3 col = mix(base, base * vec3(0.62, 0.16, 0.12), vein * 0.4);
  o = vec4(clamp(col, 0.0, 1.0), clamp(0.5 + 0.6 * t1, 0.0, 1.0));
}`;

/* Per frame: one full-canvas pass. No loop longer than 8 iterations. */
export const FS_EYE = `#version 300 es
precision highp float;
uniform vec3 uEye;    // centre x, y (canvas px, GL origin), iris radius px
uniform vec3 uG;
uniform vec3 uU;
uniform vec3 uV;
uniform vec4 uPupil;  // radius, polygon mix, blade rotation, aperture 0..1
uniform vec4 uLid;    // open, upper shift, lower shift, -
uniform vec4 uPtr;    // direction to the pointer light (xyz), alpha
uniform vec4 uMisc;   // mip bias, softness 0..1, time, exposure
uniform sampler2D uIris;
uniform sampler2D uSclera;
uniform sampler2D uNoise;
out vec4 o;

const float R = 2.7;
const float PI = 3.14159265;
const float PR0 = 0.30;
const float SEG = 0.69813170;
const vec3 L = vec3(-0.55, 0.62, 0.56);

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float sq(float v) { return v * v; }
float lidS(float x) { return clamp((x + 2.35) / 4.7, 0.0, 1.0); }
float taper(float s) { return pow(max(sin(PI * s), 0.0), 0.7); }
float upperOpen(float x) {
  float s = lidS(x);
  float base = mix(-0.28, -0.08, s);
  float arch = pow(max(sin(PI * pow(s, 0.83)), 0.0), mix(0.62, 0.95, s));
  return base + 1.0 * arch + uLid.y * taper(s);
}
float lowerOpen(float x) {
  float s = lidS(x);
  float base = mix(-0.28, -0.08, s);
  float arch = pow(max(sin(PI * pow(s, 1.12)), 0.0), mix(0.72, 1.05, s));
  return base - 0.80 * arch + uLid.z * taper(s);
}
float sdBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
// Upper lashes as a comb in lid coordinates. t = height above the lid edge.
// x = alpha, y = a faint warm rim on a few lashes nearest the key light.
vec2 upperLashes(float x, float t, float s, float wMul, float pxU) {
  if (t < -0.06 || t > 0.48 || abs(x) > 2.3) return vec2(0.0);
  float lean = -0.3 + 1.6 * s * s;
  float lenK = mix(0.25, 1.0, smoothstep(0.04, 0.42, s)) * (1.0 - 0.45 * smoothstep(0.86, 1.0, s));
  float tt = t + 0.05;
  float bend = tt + 0.9 * tt * tt;
  float x0 = x - lean * bend;
  float sp = 0.026;
  float k0 = floor(x0 / sp);
  float a = 0.0;
  float rim = 0.0;
  for (int j = -2; j <= 2; j++) {
    float k = k0 + float(j);
    float h1 = hash12(vec2(k, 1.7));
    float h2 = hash12(vec2(k, 8.3));
    float h3 = hash12(vec2(k, 4.1));
    float rx = (k + 0.5 + (h1 - 0.5) * 0.9) * sp;
    float ln = (0.11 + 0.27 * h2 * h2) * lenK;
    float lj = lean + (h3 - 0.5) * 0.3;
    float xo = rx + lj * bend;
    float dx = (x - xo) * inversesqrt(1.0 + lj * lj * (1.0 + 1.8 * tt) * (1.0 + 1.8 * tt));
    float u = clamp(tt / ln, 0.0, 1.0);
    float w = mix(0.0085, 0.0022, u) * wMul;
    float on = step(tt, ln) * step(0.0, tt) * (1.0 - u * u * 0.5);
    a = max(a, on * (1.0 - smoothstep(w * 0.5, w * 0.5 + pxU * wMul, abs(dx))));
    rim = max(rim, step(0.72, h3) * (1.0 - smoothstep(-0.9, 0.3, x)) * on * exp(-sq((dx + w * 0.5) / (0.7 * pxU + 0.25 * w))));
  }
  return vec2(a, rim);
}
// Lashes whose tapered tips hang over the top of the eye, sweeping outward.
float overLashes(float x, float t, float s, float wMul, float pxU) {
  float d = 0.012 - t;
  if (d < 0.0 || d > 0.17 || s < 0.12 || s > 0.97) return 0.0;
  float lean = -0.5 + 2.1 * s;
  float bend = d * (1.0 + 3.0 * d);
  float x0 = x - lean * bend;
  float sp = 0.034;
  float k0 = floor(x0 / sp);
  float a = 0.0;
  for (int j = -2; j <= 2; j++) {
    float k = k0 + float(j);
    float h1 = hash12(vec2(k, 31.7));
    float h2 = hash12(vec2(k, 38.3));
    float h3 = hash12(vec2(k, 34.1));
    float rx = (k + 0.5 + (h1 - 0.5) * 0.9) * sp;
    float ln = (0.045 + 0.11 * h2) * smoothstep(0.12, 0.4, s) * (1.0 - 0.5 * smoothstep(0.85, 0.97, s));
    float lj = lean + (h3 - 0.5) * 0.5;
    float slope = lj * (1.0 + 6.0 * d);
    float dx = (x - rx - lj * bend) * inversesqrt(1.0 + slope * slope);
    float u = clamp(d / ln, 0.0, 1.0);
    float w = mix(0.0078, 0.0016, u) * wMul;
    float on = step(d, ln) * step(0.42, h1);
    a = max(a, on * (1.0 - smoothstep(w * 0.5, w * 0.5 + pxU * wMul, abs(dx))));
  }
  return a;
}
float lowerLashes(float x, float t, float s, float pxU) {
  if (t < -0.01 || t > 0.16 || s < 0.3) return 0.0;
  float lean = mix(-0.1, 0.9, s);
  float x0 = x - lean * t;
  float sp = 0.055;
  float k0 = floor(x0 / sp);
  float a = 0.0;
  for (int j = -1; j <= 1; j++) {
    float k = k0 + float(j);
    float h1 = hash12(vec2(k, 21.7));
    float h2 = hash12(vec2(k, 28.3));
    float rx = (k + 0.5 + (h1 - 0.5) * 0.8) * sp;
    float ln = (0.04 + 0.08 * h2) * smoothstep(0.3, 0.6, s);
    float xo = rx + lean * t;
    float dx = (x - xo) * inversesqrt(1.0 + lean * lean);
    float w = mix(0.007, 0.002, clamp(t / ln, 0.0, 1.0));
    float on = step(t, ln) * step(0.0, t) * step(0.5, h1);
    a = max(a, on * (1.0 - smoothstep(w * 0.5, w * 0.5 + pxU, abs(dx))));
  }
  return a;
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  float pxU = 1.0 / uEye.z;
  vec2 p = (fc - uEye.xy) * pxU;
  // Leave the eye's box by whole 2 x 2 pixel quads, so every quad that carries
  // on has all four pixels and the fwidth() and texture() calls below stay
  // defined on every GPU (review, 25 Nov 2026). Outside the box is black.
  vec2 pQuad = (floor(fc * 0.5) * 2.0 + 1.0 - uEye.xy) * pxU;
  if (abs(pQuad.x) > 3.7 || abs(pQuad.y + 0.05) > 2.35) { o = vec4(0.0, 0.0, 0.0, 1.0); return; }

  float s = lidS(p.x);
  float tp = taper(s);
  float lo = lowerOpen(p.x) + 0.10 * (1.0 - uLid.x) * tp;
  float up = mix(lo + 0.004, upperOpen(p.x), uLid.x);
  float upS = mix(lo + 0.004, upperOpen(p.x + 0.12), uLid.x);
  float dU = up - p.y;
  float dL = p.y - lo;
  float wU = fwidth(dU) * 0.75 + 1e-5;
  float wL = fwidth(dL) * 0.75 + 1e-5;
  float inEye = smoothstep(-wU, wU, dU) * smoothstep(-wL, wL, dL) * step(abs(p.x), 2.36);
  float soft = uMisc.y;

  // ---- eyeball surface ----
  float nzS = sqrt(max(0.0, 1.0 - dot(p, p) / (R * R)));
  vec3 n = vec3(p / R, nzS);
  float ng = dot(n, uG);
  vec2 sl = vec2(dot(n, uU), dot(n, uV));
  vec2 q = R * sl;
  float r = length(q);

  // sclera
  vec4 sc = texture(uSclera, sl * 0.5 + 0.5, uMisc.x * 0.5);
  vec4 nz0 = texture(uNoise, sl * 1.3);
  // lit as a sphere: brightest beside the iris on the key side, blue-grey shade
  // toward both corners and under the upper lid
  float key = max(0.0, dot(n, normalize(vec3(-0.5, 0.22, 0.84))));
  float outer = smoothstep(-0.2, 1.4, p.x);  // the outer side falls off more gently
  vec3 scl = sc.rgb * mix(vec3(0.05, 0.064, 0.088), vec3(0.6, 0.55, 0.48), pow(key, mix(3.0, 2.1, outer)));
  scl *= (0.93 + 0.14 * nz0.b) * (0.95 + 0.1 * texture(uNoise, sl * 2.0).a);
  scl *= mix(0.22, 1.0, smoothstep(0.0, 0.55, dU) * smoothstep(-0.02, 0.3, dL));
  scl *= mix(0.75, 1.0, smoothstep(1.0, 1.4, r));
  // wet, never matte: a broad sheen and a few fine glints in the tear film
  float shn = max(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0);
  float glint = smoothstep(0.84, 0.94, texture(uNoise, sl * 3.0 + 0.37).a);
  scl += (pow(shn, 10.0) * 0.1 + glint * pow(shn, 5.0) * 0.5) * (0.7 + 0.6 * sc.a) * smoothstep(0.04, 0.2, dU);

  // iris, with parallax under the cornea
  float hgt = 0.38 * max(0.0, 1.0 - r * r);
  vec2 qi = q - hgt * vec2(uU.z, uV.z) / max(uG.z, 0.25);
  float ri = max(length(qi), 1e-4);
  vec2 dir = qi / ri;
  float th = atan(qi.y, qi.x);
  float a = th - uPupil.z;
  float am = mod(a, SEG) - 0.5 * SEG;
  float polyR = 0.975 / cos(am);
  float Rp = uPupil.x * mix(1.0, polyR, uPupil.y);
  float rt = PR0 + (ri - Rp) * (1.0 - PR0) / (1.0 - Rp);
  vec2 tuv = dir * rt * (0.5 / 1.02) + 0.5;
  vec2 Lq = vec2(dot(L, uU), dot(L, uV));
  vec2 Lqn = Lq / max(length(Lq), 1e-4);
  vec4 it = texture(uIris, tuv, uMisc.x);
  vec4 it2 = texture(uIris, tuv + Lqn * 0.0024, uMisc.x);
  float emb = it.a - it2.a;
  float ndl = max(dot(uG, L), 0.0);
  vec3 ic = it.rgb * (0.55 + 0.8 * ndl) * clamp(1.0 + emb * 5.5, 0.4, 1.8);
  float cang = max(0.0, dot(dir, -Lqn));
  float caustic = cang * cang * smoothstep(0.25, 0.88, ri) * (1.0 - smoothstep(0.9, 1.0, ri));
  ic *= 1.0 + 2.1 * caustic;
  // faint seams from the blade corners
  float cornerA = abs(mod(a + 0.5 * SEG, SEG) - 0.5 * SEG);
  float seam = (1.0 - smoothstep(0.0022, 0.0055, cornerA * ri)) * (1.0 - smoothstep(0.0, 0.09, ri - Rp)) * step(Rp, ri) * uPupil.y;
  ic *= 1.0 - 0.18 * seam;
  // a thin bright line on the blade edges that face the light
  float midA = uPupil.z + (floor(a / SEG) + 0.5) * SEG;
  vec2 en = normalize(mix(dir, vec2(cos(midA), sin(midA)), uPupil.y));
  float facing = max(0.0, dot(en, -Lqn));
  float fwr = max(fwidth(ri), 0.0015);
  float dE = ri - Rp;
  ic += exp(-sq((dE - 0.7 * fwr) / (0.9 * fwr))) * facing * facing * vec3(0.95, 0.70, 0.42) * 0.5;
  // pupil
  float pm = 1.0 - smoothstep(Rp - 0.75 * fwr, Rp + 0.75 * fwr, ri);
  vec2 pq = qi / max(uPupil.x, 0.05);
  vec2 go = uG.xy * 1.6;
  float cres1 = (1.0 - smoothstep(0.58, 0.64, length(pq - vec2(-0.10, 0.12) + go))) * smoothstep(0.50, 0.57, length(pq - vec2(-0.01, 0.03) + go));
  float cres2 = (1.0 - smoothstep(0.40, 0.46, length(pq - vec2(0.18, -0.16) - go * 0.7))) * smoothstep(0.30, 0.36, length(pq - vec2(0.26, -0.23) - go * 0.7));
  vec3 pc = vec3(0.0032, 0.0034, 0.0038) + cres1 * vec3(0.0015, 0.0062, 0.0042) + cres2 * vec3(0.0085, 0.0052, 0.0025);
  ic = mix(ic, pc, pm);
  float irisM = (1.0 - smoothstep(0.975, 1.035, r)) * step(0.0, ng);
  vec3 eye = mix(scl, ic, irisM);

  vec4 nz = texture(uNoise, p * 0.45);
  // the plica: a faint pink fold before the inner corner
  eye *= mix(vec3(1.0), vec3(0.92, 0.72, 0.68), 1.0 - smoothstep(-1.9, -1.5, p.x));

  // the lids' shadows and the soft shadows of the lashes
  float lidSh = mix(0.06, 1.0, smoothstep(0.0, 0.55, upS - p.y));
  lidSh *= mix(0.45, 1.0, smoothstep(0.0, 0.08, dU));
  float lsh = upperLashes(p.x - 0.07, (p.y + 0.12) - up, s, 2.6, pxU).x;
  float osh = overLashes(p.x - 0.05, (p.y + 0.07) - up, s, 2.6, pxU);
  lidSh *= (1.0 - 0.3 * lsh) * (1.0 - 0.3 * osh);
  eye *= lidSh;
  eye *= mix(0.45, 1.0, smoothstep(0.0, 0.2, dL));

  // lower lid margin: a thin waterline with a broken line of tear
  float wl = 1.0 - smoothstep(0.022, 0.032 + 1.5 * pxU, dL);
  vec3 wcol = vec3(0.17, 0.068, 0.056) * (0.3 + 0.7 * (1.0 - smoothstep(-0.9, 1.9, abs(p.x + 0.4)))) * (0.8 + 0.4 * nz.g);
  eye = mix(eye, wcol, wl);
  // both corners sink into shadow (the whole opening, before the reflections)
  eye *= mix(mix(0.1, 0.15, outer), 1.0, 1.0 - smoothstep(0.9, 2.3, abs(p.x + 0.35) * mix(1.0, 0.67, outer)));
  // tear on the waterline: a few soft glints of different lengths, toward the
  // middle and the key-light side, nothing along the rest
  float tearB = 0.0;
  for (int k = 0; k < 4; k++) {
    float fk = float(k);
    float gc = -1.12 + 0.43 * fk + 0.06 * sin(fk * 2.7);
    float gl = 0.05 + 0.11 * hash12(vec2(fk, 61.0));
    float u = (p.x - gc) / gl;
    tearB = max(tearB, (1.0 - smoothstep(0.35, 1.0, abs(u))) * (0.55 + 0.45 * hash12(vec2(fk, 67.0))));
  }
  float tear = exp(-sq((dL - 0.029) / max(0.005, 1.1 * pxU))) * tearB;
  eye += tear * 0.95 * vec3(1.0, 0.97, 0.92);

  // the caruncle: a small, defined, wet pink form in the inner corner
  // its edge is defined toward the corner and melts into the plica toward the eye
  // tucked into the corner under the lids, irregular and soft, low contrast
  vec2 cc = (p - vec2(-2.21, -0.15)) / vec2(0.17, 0.15);
  float bump = texture(uNoise, p * 0.9).g;
  float cl = length(vec2(cc.x * (cc.x > 0.0 ? 0.55 : 1.0), cc.y)) + 0.3 * (bump - 0.5) + 0.05 * (texture(uNoise, p * 2.7).r - 0.5);
  float cwd = 4.5 * pxU / 0.15;
  float cz = 1.0 - smoothstep(1.0 - cwd - max(cc.x, 0.0) * 0.9, 1.0 + cwd, cl);
  vec3 cn = normalize(vec3(cc * 0.3, 1.0));
  float ck = max(0.0, dot(cn, normalize(vec3(-0.5, 0.6, 0.62))));
  vec3 car = vec3(0.3, 0.155, 0.145) * (0.85 + 0.3 * texture(uNoise, p * 4.5).a) * (0.13 + 0.17 * ck);
  eye = mix(eye, car, cz * 0.82);
  eye += (1.0 - smoothstep(0.0, 0.004 + 1.2 * pxU, length(p - vec2(-2.25, -0.1)))) * cz * vec3(0.16, 0.15, 0.14);

  // ---- reflections ----
  float sN = clamp(r / 1.32, 0.0, 1.0);
  vec3 tv = n - uG * ng;
  tv /= max(length(tv), 1e-5);
  vec3 nc = normalize(uG * sqrt(max(0.0, 1.0 - sN * sN)) + tv * sN);
  float cornea = (1.0 - smoothstep(0.9, 1.15, r)) * step(0.0, ng);
  vec3 N = normalize(mix(n, nc, cornea));
  vec3 Rv = vec3(0.0, 0.0, -1.0) + 2.0 * N.z * N;
  // key softbox
  vec3 T = normalize(vec3(L.z, 0.0, -L.x));
  vec3 B = cross(L, T);
  vec2 c = vec2(dot(Rv, T), dot(Rv, B)) / max(dot(Rv, L), 0.05);
  vec2 fwc = fwidth(c);
  float aaC = max(fwc.x, fwc.y) * 0.8;
  vec2 hs = vec2(0.105, 0.16);
  float sft = 0.02 + 0.12 * soft;
  float sb = 1.0 - smoothstep(-sft - aaC, sft + aaC, sdBox(c, hs, 0.045));
  float crw = 0.007;
  float crs = max(1.0 - smoothstep(crw, crw + aaC + sft * 0.4, abs(c.x)), 1.0 - smoothstep(crw, crw + aaC + sft * 0.4, abs(c.y + 0.02)));
  sb *= 1.0 - 0.62 * crs;
  sb *= 0.62 + 0.38 * smoothstep(-hs.y, hs.y * 0.6, c.y - c.x * 0.4);
  float cxl = c.x * 30.0;
  float ci = floor(cxl);
  float cf = fract(cxl) - 0.5;
  float lh = hash12(vec2(ci, 5.0));
  float tooth = (1.0 - smoothstep(0.12, 0.34, abs(cf + (hs.y - c.y) * 3.0 * (lh - 0.35)))) * step(hs.y - 0.025 - 0.075 * lh, c.y) * step(0.22, hash12(vec2(ci, 9.0)));
  sb *= 1.0 - 0.92 * tooth;
  // dim strip low on the other side
  vec3 L2 = normalize(vec3(0.62, -0.40, 0.67));
  vec3 T2 = normalize(vec3(L2.z, 0.0, -L2.x));
  vec3 B2 = cross(L2, T2);
  vec2 c2 = vec2(dot(Rv, T2), dot(Rv, B2)) / max(dot(Rv, L2), 0.05);
  vec2 fwc2 = fwidth(c2);
  float aa2 = max(fwc2.x, fwc2.y) * 0.8;
  float st = 1.0 - smoothstep(-sft * 2.5 - aa2, sft * 2.5 + aa2, sdBox(c2, vec2(0.16, 0.022), 0.02));
  // the visitor's pointer as a small round light
  float pd = length(Rv - uPtr.xyz);
  float aaP = fwidth(pd) * 0.8;
  float pdot = (1.0 - smoothstep(0.012, 0.023 + aaP + 0.008 + sft * 0.6, pd)) * uPtr.w;
  // on the wet sclera the softbox shows soft and broken where the turn exposes it
  float sbS = 1.0 - smoothstep(-0.07, 0.07, sdBox(c, hs * 1.1, 0.05));
  float brk = smoothstep(0.3, 0.75, nz0.g) * smoothstep(0.25, 0.65, texture(uNoise, sl * 1.4 + 0.11).r) * 0.75;
  float cor3 = cornea * cornea * cornea;
  float hiMask = smoothstep(0.0, 0.05, dU) * smoothstep(0.0, 0.02, dL);
  vec3 hi = (sb * 5.5 * vec3(1.0, 0.985, 0.95) + st * 0.28 * vec3(0.9, 0.95, 1.0)) * cor3
          + sbS * brk * 0.55 * (1.0 - cor3) * smoothstep(0.1, 0.3, dU) * vec3(0.95, 0.95, 0.92)
          + pdot * 2.25 * cornea;
  eye += hi * hiMask;

  // ---- skin: low key, only a suggestion ----
  float above = -dU;
  float below = -dL;
  float outD = max(max(above, below), 0.0);
  float cx = max(abs(p.x) - 2.25, 0.0);
  float dSk = length(vec2(outD, cx * 0.9));
  float fall = 1.0 - smoothstep(0.0, 1.3, dSk);
  fall *= fall;
  vec3 alb = vec3(0.27, 0.16, 0.115) * (0.78 + 0.44 * nz.a) * (0.85 + 0.3 * nz.g);
  float illum;
  float creaseH = 0.07 + 0.32 * tp;
  if (above > 0.0) {
    float crease = exp(-sq((above - creaseH) / 0.05));
    float lidBand = smoothstep(0.0, 0.04, above) * (1.0 - smoothstep(creaseH - 0.08, creaseH, above));
    float lidL = 0.15 * exp(-sq((p.x + 0.75) / 1.05)) * lidBand * (0.75 + 0.25 * (1.0 - smoothstep(0.0, creaseH, above)));
    float fold = 0.085 * exp(-sq((p.x + 0.95) / 1.1)) * smoothstep(creaseH, creaseH + 0.1, above) * (1.0 - smoothstep(creaseH + 0.08, creaseH + 0.75, above));
    illum = (lidL + fold) * (1.0 - 0.8 * crease);
    // during a blink the lid skin slides over the eyeball and catches the light
    float cover = smoothstep(0.0, 0.03, upperOpen(p.x) - p.y);
    float keyLid = max(0.0, dot(n, normalize(vec3(-0.4, 0.78, 0.48))));
    float lidOver = 0.075 * (0.25 + 0.75 * keyLid) * exp(-sq((p.x + 0.6) / 1.35)) * (0.6 + 0.4 * smoothstep(0.0, 0.08, above));
    illum = mix(illum, max(illum, lidOver), cover);
    fall = mix(fall, 1.0, cover);
  } else {
    float lb = smoothstep(0.0, 0.05, below) * (1.0 - smoothstep(0.06, 0.42, below));
    float rim = exp(-sq((below - 0.03) / 0.02));
    illum = (0.06 * lb + 0.045 * rim * tp) * exp(-sq((p.x + 0.35) / 1.4));
  }
  vec3 skin = alb * illum * fall;

  vec3 col = mix(skin, eye, inEye);

  // lashes over everything: distinct tapered strokes, a few warm rims
  float openK = smoothstep(0.0, 0.25, uLid.x + 0.1);
  vec2 ul = upperLashes(p.x, p.y - up, s, 1.0, pxU) * openK;
  float ol = overLashes(p.x, p.y - up, s, 1.0, pxU) * openK;
  vec3 LASH = vec3(0.006, 0.0045, 0.0035);
  col = mix(col, LASH, max(ul.x * 0.93, ol * 0.92));
  col += ul.y * vec3(0.03, 0.015, 0.006);
  float ll = lowerLashes(p.x, lo - p.y, s, pxU);
  col = mix(col, LASH, ll * 0.7);

  // whole-eye light falloff: brightest centre-left, corners sink
  float G = exp(-(sq((p.x + 0.45) / mix(1.95, 2.45, smoothstep(-0.45, 0.6, p.x))) + sq((p.y - 0.05) / 1.6)));
  col *= mix(0.22, 1.0, G);
  col *= uMisc.w;

  vec3 x = max(vec3(0.0), col - 0.004);
  vec3 tm = (x * (6.2 * x + 0.5)) / (x * (6.2 * x + 1.7) + 0.06);
  float dith = (hash12(fc + fract(uMisc.z) * 391.7) - 0.5) / 255.0;
  tm += dith * smoothstep(0.0, 0.02, tm.g);
  o = vec4(tm, 1.0);
}`;
