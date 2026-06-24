/* eslint-disable react/no-unknown-property */
/**
 * HelixCanvas — the heavy R3F/three/bloom part of the helix hero, split into
 * its own chunk so /welcome can lazy-load it AFTER first paint (the scan page
 * must feel alive in 3s on 4G — text paints instantly, this streams in behind).
 *
 * Impulse-based particle physics: a moving cursor strikes the double helix and
 * particles fly off at the ferocity of the strike (cursor-velocity transfer),
 * then drift back on a soft spring — and stay knockable mid-return. A resting
 * cursor does nothing. Two strands in C4's red + green; faint rungs between.
 */
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function makeDot() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.7)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function HelixField({ agitate, reduced }) {
  const pointsRef = useRef();
  const { home, colors, tex, count } = useMemo(() => {
    const S = 520, turns = 4, Hh = 6, R = 1.1;
    const pts = [], cols = [];
    const red = new THREE.Color('#ff4133'), grn = new THREE.Color('#37d27e'), rung = new THREE.Color('#aeb6bf');
    for (let i = 0; i < S; i++) {
      const t = i / (S - 1); const a = t * turns * Math.PI * 2; const y = (t - 0.5) * Hh;
      const ax = Math.cos(a) * R, az = Math.sin(a) * R, bx = Math.cos(a + Math.PI) * R, bz = Math.sin(a + Math.PI) * R;
      pts.push(ax, y, az); cols.push(red.r, red.g, red.b);
      pts.push(bx, y, bz); cols.push(grn.r, grn.g, grn.b);
      if (i % 4 === 0) for (const m of [0.35, 0.65]) { pts.push(ax + (bx - ax) * m, y, az + (bz - az) * m); cols.push(rung.r, rung.g, rung.b); }
    }
    const home = new Float32Array(pts), colors = new Float32Array(cols);
    return { home, colors, tex: makeDot(), count: home.length / 3 };
  }, []);

  const dyn = useRef(home.slice());
  const vel = useRef(new Float32Array(home.length));
  const cur = useRef(new THREE.Vector3());
  const prev = useRef(new THREE.Vector3());
  const havePrev = useRef(false);

  useFrame((state, dt) => {
    if (!pointsRef.current || reduced) return;
    dt = Math.min(dt, 0.033);
    const cam = state.camera, p = state.pointer;
    cur.current.set(p.x, p.y, 0.5).unproject(cam);
    const dir = cur.current.sub(cam.position).normalize();
    const tHit = dir.z !== 0 ? -cam.position.z / dir.z : 0;
    cur.current.copy(cam.position).add(dir.multiplyScalar(tHit));

    let cvx = 0, cvy = 0, cvz = 0, speed = 0;
    if (havePrev.current) { cvx = (cur.current.x - prev.current.x) / dt; cvy = (cur.current.y - prev.current.y) / dt; cvz = (cur.current.z - prev.current.z) / dt; speed = Math.hypot(cvx, cvy, cvz); }
    prev.current.copy(cur.current); havePrev.current = true;

    const pos = dyn.current, v = vel.current, hm = home;
    const R = 1.45, minSpeed = 0.25, transfer = 0.55, radialK = 0.32, springK = 5.5, maxV = 10;
    const damp = Math.pow(0.9, dt * 60);
    const striking = speed > minSpeed;
    const ag = agitate.current;
    for (let i = 0; i < pos.length; i += 3) {
      v[i] += (hm[i] - pos[i]) * springK * dt; v[i + 1] += (hm[i + 1] - pos[i + 1]) * springK * dt; v[i + 2] += (hm[i + 2] - pos[i + 2]) * springK * dt;
      if (striking) {
        const dx = pos[i] - cur.current.x, dy = pos[i + 1] - cur.current.y, dz = pos[i + 2] - cur.current.z;
        const dist = Math.hypot(dx, dy, dz) || 0.001;
        if (dist < R) { const prox = (R - dist) / R, rk = speed * radialK * prox / dist; v[i] += cvx * transfer * prox + dx * rk; v[i + 1] += cvy * transfer * prox + dy * rk; v[i + 2] += cvz * transfer * prox + dz * rk; }
      }
      if (ag > 0) { v[i] += (Math.random() - 0.5) * ag * 7; v[i + 1] += (Math.random() - 0.5) * ag * 7; v[i + 2] += (Math.random() - 0.5) * ag * 7; }
      v[i] *= damp; v[i + 1] *= damp; v[i + 2] *= damp;
      const sp = Math.hypot(v[i], v[i + 1], v[i + 2]); if (sp > maxV) { const s = maxV / sp; v[i] *= s; v[i + 1] *= s; v[i + 2] *= s; }
      pos[i] += v[i] * dt; pos[i + 1] += v[i + 1] * dt; pos[i + 2] += v[i + 2] * dt;
    }
    const attr = pointsRef.current.geometry.attributes.position;
    attr.array.set(pos); attr.needsUpdate = true;
    if (ag > 0) agitate.current = Math.max(0, ag - dt * 1.6);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={home.slice()} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

export default function HelixCanvas({ agitate, reduced, inView }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={inView && !reduced ? 'always' : 'demand'}
      style={{ position: 'absolute', inset: 0 }}
    >
      <HelixField agitate={agitate} reduced={reduced} />
      <EffectComposer disableNormalPass multisampling={4}>
        <Bloom intensity={1.05} luminanceThreshold={0.12} luminanceSmoothing={0.3} mipmapBlur radius={0.72} />
      </EffectComposer>
    </Canvas>
  );
}
