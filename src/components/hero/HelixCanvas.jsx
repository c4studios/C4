/**
 * HelixCanvas — the heavy 3D part of the /welcome hero, split into its own
 * chunk so the page can lazy-load it AFTER first paint (the scan page must feel
 * alive in 3s on 4G — text paints instantly, this streams in behind).
 *
 * A procedural red+green double helix (one particle simulation). It spins on its
 * own axis, the cursor imparts its velocity to the few particles it slices
 * through (they spring back to the spinning home), and scrolling glides the
 * camera down the strand. onKnock(speed) fires when particles are struck.
 *
 * PERFORMANCE — this page is opened almost entirely from phones (QR/NFC), so the
 * render budget is tuned hard for mobile:
 *   • DESKTOP: two canvases — back (bloom) + a front depth-fade layer that
 *     crosses OVER the copy — full particle count, DPR up to 2.
 *   • MOBILE: ONE lean canvas — a single WebGL context, NO post-processing bloom
 *     (the biggest mobile cost), NO second context/front layer, fewer particles,
 *     DPR capped low, MSAA off. Bigger additive points + the CSS brand glow keep
 *     it looking alive without the GPU load that made it stutter.
 *
 * Raw three.js (not R3F) so the two-canvas depth split is expressible. Renderers,
 * listeners and RAF are torn down on unmount.
 */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const THETA = -0.35;
const cosT = Math.cos(THETA);
const sinT = Math.sin(THETA);

function makeDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.72)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/* Tall double helix in RAW coords (tilt + spin applied live each frame). */
function makeField(S) {
  const turns = 13, Hh = 20, R = 1.7;
  const h0 = [], cols = [];
  const red = new THREE.Color('#ff5038'), grn = new THREE.Color('#2fe07c'), rung = new THREE.Color('#c4cfdd');
  const put = (x, y, z, c) => { h0.push(x, y, z); cols.push(c.r, c.g, c.b); };
  for (let i = 0; i < S; i++) {
    const t = i / (S - 1); const a = t * turns * Math.PI * 2; const y = (t - 0.5) * Hh;
    const ax = Math.cos(a) * R, az = Math.sin(a) * R, bx = Math.cos(a + Math.PI) * R, bz = Math.sin(a + Math.PI) * R;
    put(ax, y, az, red); put(bx, y, bz, grn);
    if (i % 3 === 0) for (const m of [0.4, 0.6]) put(ax + (bx - ax) * m, y, az + (bz - az) * m, rung);
  }
  const home0 = new Float32Array(h0), pos = new Float32Array(home0.length), vel = new Float32Array(home0.length);
  for (let i = 0; i < home0.length; i += 3) {
    pos[i] = home0[i] * cosT - home0[i + 1] * sinT;
    pos[i + 1] = home0[i] * sinT + home0[i + 1] * cosT;
    pos[i + 2] = home0[i + 2];
  }
  return { home0, pos, vel, cols: new Float32Array(cols) };
}

export default function HelixCanvas({ reduced = false, inView = true, onKnock }) {
  const bgRef = useRef(null);
  const fgRef = useRef(null);
  const inViewRef = useRef(inView);
  const onKnockRef = useRef(onKnock);
  useEffect(() => { inViewRef.current = inView; }, [inView]);
  useEffect(() => { onKnockRef.current = onKnock; }, [onKnock]);

  useEffect(() => {
    if (reduced) return undefined;
    const bg = bgRef.current, fg = fgRef.current;
    if (!bg) return undefined;

    // Touch phones/tablets (no hover) get the lean path; anything with a mouse (incl. touch
    // laptops/desktops, which report hover) stays on the full rich desktop version.
    const MOBILE = (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) || window.innerWidth < 760;
    const PR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.1 : 2);
    const TEX = makeDotTexture();
    const field = makeField(MOBILE ? 550 : 950);
    const { home0: hm, pos, vel: v } = field;

    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8.0); camera.lookAt(0, 0, 0);

    const mkRenderer = (canvas) => {
      const r = new THREE.WebGLRenderer({ canvas, antialias: !MOBILE, alpha: true, powerPreference: 'high-performance' });
      r.setPixelRatio(PR); r.outputColorSpace = THREE.SRGBColorSpace;
      r.toneMapping = MOBILE ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.12;
      r.setClearColor(0x000000, 0);
      return r;
    };

    // BACK — the helix. Bloom only on desktop (post-processing is the #1 mobile cost).
    const rB = mkRenderer(bg);
    const sB = new THREE.Scene(); sB.fog = new THREE.FogExp2(0x07080a, 0.016);
    const geoB = new THREE.BufferGeometry();
    geoB.setAttribute('position', new THREE.BufferAttribute(field.pos, 3));
    geoB.setAttribute('color', new THREE.BufferAttribute(field.cols, 3));
    const matB = new THREE.PointsMaterial({ size: MOBILE ? 0.135 : 0.1, vertexColors: true, map: TEX, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: true });
    sB.add(new THREE.Points(geoB, matB));
    let comp = null, bloom = null;
    if (!MOBILE) {
      comp = new EffectComposer(rB);
      comp.addPass(new RenderPass(sB, camera));
      bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.95, 0.55, 0.18);
      comp.addPass(bloom);
      comp.addPass(new OutputPass());
    }

    // FRONT (over-text depth layer) — DESKTOP ONLY. A second WebGL context is too
    // heavy on mobile, and dropping it also clears the copy (better mobile readability).
    let rF = null, geoF = null, frontMat = null, sF = null;
    if (!MOBILE && fg) {
      rF = mkRenderer(fg);
      sF = new THREE.Scene();
      geoF = new THREE.BufferGeometry();
      geoF.setAttribute('position', new THREE.BufferAttribute(field.pos, 3));
      geoF.setAttribute('color', new THREE.BufferAttribute(field.cols, 3));
      frontMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: {
          uMap: { value: TEX }, uSize: { value: window.innerHeight * PR * 0.16 },
          uNear: { value: 6.5 }, uFar: { value: 8.1 }, uOp: { value: 0.6 },
          uZone: { value: new THREE.Vector4(0, 0.26, 0.5, 0.78) }, uZoneMin: { value: 0.24 },
        },
        vertexShader: 'attribute vec3 color; varying vec3 vC; varying float vA; varying vec2 vU; uniform float uSize,uNear,uFar; void main(){ vC=color; vec4 mv=modelViewMatrix*vec4(position,1.0); float d=-mv.z; vA=1.0-smoothstep(uNear,uFar,d); gl_PointSize=uSize/d; gl_Position=projectionMatrix*mv; vU=(gl_Position.xy/gl_Position.w)*0.5+0.5; }',
        fragmentShader: 'uniform sampler2D uMap; uniform float uOp,uZoneMin; uniform vec4 uZone; varying vec3 vC; varying float vA; varying vec2 vU; void main(){ if(vA<=0.01) discard; vec4 t=texture2D(uMap,gl_PointCoord); float ix=smoothstep(uZone.x-0.05,uZone.x+0.05,vU.x)*(1.0-smoothstep(uZone.z-0.05,uZone.z+0.05,vU.x)); float iy=smoothstep(uZone.y-0.05,uZone.y+0.05,vU.y)*(1.0-smoothstep(uZone.w-0.05,uZone.w+0.05,vU.y)); float zf=mix(1.0,uZoneMin,ix*iy); gl_FragColor=vec4(vC, t.a*vA*uOp*zf); }',
      });
      sF.add(new THREE.Points(geoF, frontMat));
    }

    const setZone = () => {
      if (!frontMat) return;
      if (window.innerWidth < 760) frontMat.uniforms.uZone.value.set(0, 0.04, 1, 0.54);
      else frontMat.uniforms.uZone.value.set(0, 0.26, 0.5, 0.78);
    };
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      rB.setSize(w, h); if (comp) comp.setSize(w, h);
      if (rF) { rF.setSize(w, h); frontMat.uniforms.uSize.value = h * PR * 0.16; }
      setZone();
    };
    resize();

    // pointer (NDC) + scroll progress
    const ndc = { x: 0, y: 0, active: false };
    let scrollT = 0;
    const setP = (x, y) => { ndc.x = x / window.innerWidth * 2 - 1; ndc.y = -(y / window.innerHeight * 2 - 1); ndc.active = true; };
    const onMouse = (e) => setP(e.clientX, e.clientY);
    const onTouch = (e) => { if (e.touches[0]) setP(e.touches[0].clientX, e.touches[0].clientY); };
    const onScroll = () => { const max = document.body.scrollHeight - window.innerHeight; scrollT = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0; };
    onScroll();
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    const O = new THREE.Vector3(), D = new THREE.Vector3(), cur = new THREE.Vector3();
    const AX = new THREE.Vector3(-sinT, cosT, 0).normalize(); // "up the helix" on screen
    const TRAVEL = MOBILE ? 8 : 12; // gentler scroll-journey on mobile → less sensitive to viewport jitter
    let camS = 0.5 * TRAVEL, pNdcX = 0, pNdcY = 0, havePrev = false, last = performance.now(), lastKnock = 0, raf = 0;

    // spinning, springy home + surgical cursor momentum-transfer (small bubble)
    const step = (dt, cs, sn, cvx, cvy, cvz, on) => {
      const hitR = 0.31, transfer = 0.92, springK = 5.0, maxV = 36, damp = Math.pow(0.88, dt * 60);
      const ox = O.x, oy = O.y, oz = O.z, dx = D.x, dy = D.y, dz = D.z;
      const cvm = cvx * cvx + cvy * cvy + cvz * cvz; let hits = 0;
      for (let i = 0; i < pos.length; i += 3) {
        const hx = hm[i], hy = hm[i + 1], hz = hm[i + 2];
        const rx = hx * cs + hz * sn, rz = -hx * sn + hz * cs;
        const tx = rx * cosT - hy * sinT, ty = rx * sinT + hy * cosT, tz = rz;
        v[i] += (tx - pos[i]) * springK * dt; v[i + 1] += (ty - pos[i + 1]) * springK * dt; v[i + 2] += (tz - pos[i + 2]) * springK * dt;
        if (on) {
          const px = pos[i] - ox, py = pos[i + 1] - oy, pz = pos[i + 2] - oz;
          let tt = px * dx + py * dy + pz * dz; if (tt < 0) tt = 0;
          const axp = px - dx * tt, ayp = py - dy * tt, azp = pz - dz * tt;
          const perp = Math.hypot(axp, ayp, azp);
          if (perp < hitR) { const fo = (hitR - perp) / hitR; v[i] += cvx * transfer * fo; v[i + 1] += cvy * transfer * fo; v[i + 2] += cvz * transfer * fo; if (cvm > 4.0) hits++; }
        }
        v[i] *= damp; v[i + 1] *= damp; v[i + 2] *= damp;
        const sp = Math.hypot(v[i], v[i + 1], v[i + 2]); if (sp > maxV) { const s = maxV / sp; v[i] *= s; v[i + 1] *= s; v[i + 2] *= s; }
        pos[i] += v[i] * dt; pos[i + 1] += v[i + 1] * dt; pos[i + 2] += v[i + 2] * dt;
      }
      return hits;
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!inViewRef.current) { last = now; return; } // pause sim when scrolled away / tab hidden
      let dt = Math.min((now - last) / 1000, 0.033); last = now;
      const tgt = (0.5 - scrollT) * TRAVEL; camS += (tgt - camS) * Math.min(1, dt * (MOBILE ? 3.5 : 5));
      camera.position.set(AX.x * camS, AX.y * camS, 8.0); camera.lookAt(AX.x * camS, AX.y * camS, 0); O.copy(camera.position);
      const spin = now / 1000 * 0.32, cs = Math.cos(spin), sn = Math.sin(spin);
      cur.set(ndc.x, ndc.y, 0.5).unproject(camera); D.copy(cur).sub(camera.position).normalize();
      const halfH = Math.tan(44 * Math.PI / 360) * 8.0, halfW = halfH * (window.innerWidth / window.innerHeight);
      let cvx = 0, cvy = 0, cvz = 0;
      if (havePrev && ndc.active && dt > 0) { cvx = (ndc.x - pNdcX) * halfW / dt; cvy = (ndc.y - pNdcY) * halfH / dt; const m = Math.hypot(cvx, cvy); if (m > 36) { const s = 36 / m; cvx *= s; cvy *= s; } }
      pNdcX = ndc.x; pNdcY = ndc.y; havePrev = true;
      const hits = step(dt, cs, sn, cvx, cvy, cvz, ndc.active);
      if (hits > 0 && onKnockRef.current && now - lastKnock > 70) { lastKnock = now; onKnockRef.current(Math.hypot(cvx, cvy)); }
      geoB.attributes.position.needsUpdate = true; if (geoF) geoF.attributes.position.needsUpdate = true;
      if (comp) comp.render(); else rB.render(sB, camera);
      if (rF) rF.render(sF, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      geoB.dispose(); matB.dispose(); TEX.dispose();
      if (geoF) geoF.dispose(); if (frontMat) frontMat.dispose(); if (comp) comp.dispose();
      rB.dispose(); if (rF) rF.dispose();
      try { rB.forceContextLoss(); if (rF) rF.forceContextLoss(); } catch { /* */ }
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <>
      <canvas ref={bgRef} className="hx-bg" aria-hidden="true" />
      <canvas ref={fgRef} className="hx-fg" aria-hidden="true" />
    </>
  );
}
