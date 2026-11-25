/* WebGL2 renderer for the /Lens hero eye. Hand-written, no library.
   createEyeRenderer(canvas) compiles the programs and queues the bake passes
   (noise 512, iris 1024, sclera 1024). bakeStep() runs one strip of one
   texture per call so start-up never stalls a frame; bakeAll() runs them all
   at once (the poster script uses it). render(state) draws one frame.
   No allocations per frame: uniforms go up as scalars. */
import { VS, FS_NOISE, FS_IRIS, FS_SCLERA, FS_EYE } from './eyeShaders.js';

const R = 2.7;
export const REST_AP = 2 / 7;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function link(gl, fsSrc) {
  const p = gl.createProgram();
  const v = compile(gl, gl.VERTEX_SHADER, VS);
  const f = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  const ok = gl.getProgramParameter(p, gl.LINK_STATUS);
  if (!ok && import.meta.env && import.meta.env.DEV) {
    // Dev only: a shader that fails to compile should say why.
    console.error('[lens eye]', gl.getShaderInfoLog(f) || gl.getProgramInfoLog(p));
  }
  gl.deleteShader(v);
  gl.deleteShader(f);
  return ok ? p : null;
}

export function createEyeRenderer(canvas, { preserve = false } = {}) {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: preserve,
    powerPreference: 'high-performance',
  });
  if (!gl) return null;

  const progEye = link(gl, FS_EYE);
  const progNoise = link(gl, FS_NOISE);
  const progIris = link(gl, FS_IRIS);
  const progSclera = link(gl, FS_SCLERA);
  if (!progEye || !progNoise || !progIris || !progSclera) return null;

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);

  const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
  const maxAniso = aniso ? Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)) : 0;

  function target(size, srgb, repeat, useAniso) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const levels = Math.floor(Math.log2(size)) + 1;
    gl.texStorage2D(gl.TEXTURE_2D, levels, srgb ? gl.SRGB8_ALPHA8 : gl.RGBA8, size, size);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const wrap = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    if (useAniso && maxAniso > 1) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, maxAniso);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fb, size };
  }

  const texNoise = target(512, false, true, false);
  const texIris = target(1024, true, false, true);
  const texSclera = target(1024, true, false, true);

  // One job per strip: [program, target, y0, y1]
  const jobs = [];
  const strips = (prog, t, n) => {
    for (let i = 0; i < n; i++) jobs.push([prog, t, Math.round((i * t.size) / n), Math.round(((i + 1) * t.size) / n)]);
  };
  strips(progNoise, texNoise, 1);
  strips(progIris, texIris, 4);
  strips(progSclera, texSclera, 2);
  let jobIndex = 0;

  function bakeStep() {
    if (jobIndex >= jobs.length) return true;
    const [prog, t, y0, y1] = jobs[jobIndex++];
    gl.useProgram(prog);
    gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb);
    gl.viewport(0, 0, t.size, t.size);
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(0, y0, t.size, y1 - y0);
    gl.uniform2f(gl.getUniformLocation(prog, 'uSize'), t.size, t.size);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.SCISSOR_TEST);
    const last = jobIndex >= jobs.length || jobs[jobIndex][1] !== t;
    if (last) {
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.generateMipmap(gl.TEXTURE_2D);
    }
    if (jobIndex >= jobs.length) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      [texNoise, texIris, texSclera].forEach((x) => gl.deleteFramebuffer(x.fb));
      return true;
    }
    return false;
  }

  function bakeAll() {
    while (!bakeStep());
  }

  const U = {};
  ['uEye', 'uG', 'uU', 'uV', 'uPupil', 'uLid', 'uPtr', 'uMisc', 'uIris', 'uSclera', 'uNoise'].forEach((k) => {
    U[k] = gl.getUniformLocation(progEye, k);
  });
  gl.useProgram(progEye);
  gl.uniform1i(U.uIris, 0);
  gl.uniform1i(U.uSclera, 1);
  gl.uniform1i(U.uNoise, 2);

  let scale = 1;
  let cssH = 1;
  function resize(w, h, dpr) {
    const bw = Math.max(1, Math.round(w * dpr));
    const bh = Math.max(1, Math.round(h * dpr));
    if (canvas.width !== bw) canvas.width = bw;
    if (canvas.height !== bh) canvas.height = bh;
    scale = bw / Math.max(1, w);
    cssH = h;
  }

  /* state: cx, cy, iris (CSS px, top-left origin), yaw, pitch (radians),
     ap (0 wide .. 1 pinhole), breath, open, ptrX, ptrY (eye units, y up),
     ptrA, bias, soft, time, exposure */
  function render(st) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(progEye);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texIris.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texSclera.tex);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texNoise.tex);

    gl.uniform3f(U.uEye, st.cx * scale, (cssH - st.cy) * scale, st.iris * scale);

    const cp = Math.cos(st.pitch);
    const gx = Math.sin(st.yaw) * cp;
    const gy = Math.sin(st.pitch);
    const gz = Math.cos(st.yaw) * cp;
    const ul = Math.hypot(gz, gx) || 1;
    const ux = gz / ul;
    const uz = -gx / ul;
    const vx = gy * uz;
    const vy = gz * ux - gx * uz;
    const vz = -gy * ux;
    gl.uniform3f(U.uG, gx, gy, gz);
    gl.uniform3f(U.uU, ux, 0, uz);
    gl.uniform3f(U.uV, vx, vy, vz);

    const ap = Math.min(1, Math.max(0, st.ap));
    const pr = 0.6 * Math.pow(0.2, ap) * st.breath;
    const poly = 0.05 + 0.75 * Math.pow(ap, 0.75);
    const rot = 0.21 + ap * 0.14;
    gl.uniform4f(U.uPupil, pr, poly, rot, ap);

    // The lids follow the gaze: looking down lowers the upper lid.
    gl.uniform4f(U.uLid, st.open, 0.8 * R * gy, 0.28 * R * gy, 0);

    const pl = Math.hypot(st.ptrX, st.ptrY, 7);
    gl.uniform4f(U.uPtr, st.ptrX / pl, st.ptrY / pl, 7 / pl, st.ptrA);
    gl.uniform4f(U.uMisc, st.bias, st.soft, st.time, st.exposure);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let lost = false;
  function onLost(e) {
    e.preventDefault();
    lost = true;
  }
  canvas.addEventListener('webglcontextlost', onLost);

  function dispose() {
    canvas.removeEventListener('webglcontextlost', onLost);
    if (lost) return;
    [texNoise, texIris, texSclera].forEach((x) => gl.deleteTexture(x.tex));
    [progEye, progNoise, progIris, progSclera].forEach((p) => gl.deleteProgram(p));
    gl.deleteVertexArray(vao);
  }

  return { gl, bakeStep, bakeAll, render, resize, dispose, isLost: () => lost || gl.isContextLost() };
}

/* The poster still: the eye looking straight ahead, on black. The image
   covers x -3.6..3.6 and y -2.25..2.25 eye units, so the iris radius is
   width / 7.2 and the page positions it from --lh-cx, --lh-cy, --lh-iris. */
export const POSTER_SPAN_X = 3.6;
export const POSTER_SPAN_Y = 2.25;

export function restState(cx, cy, iris) {
  return {
    cx, cy, iris,
    yaw: 0, pitch: 0, ap: REST_AP, breath: 1, open: 1,
    ptrX: 0, ptrY: 0, ptrA: 0, bias: 0, soft: 0, time: 0, exposure: 1,
  };
}

export function renderPosterBlob(width, quality = 0.86) {
  const height = Math.round((width * POSTER_SPAN_Y) / POSTER_SPAN_X);
  const canvas = document.createElement('canvas');
  const rd = createEyeRenderer(canvas, { preserve: true });
  if (!rd) return Promise.reject(new Error('no webgl2'));
  rd.resize(width, height, 1);
  rd.bakeAll();
  rd.render(restState(width / 2, height / 2, width / (2 * POSTER_SPAN_X)));
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
}
