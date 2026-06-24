/* eslint-disable react/no-unknown-property */
/**
 * HelixHero — alternative "Digital Experiential" hero for /welcome.
 *
 * A double-helix made of ~1k glowing particles in C4's two brand colours
 * (red strand + green strand). Run the cursor through it and the particles
 * scatter / suspend, then spring back into formation — the helix's answer to
 * "it reacts to you", minus any character. Brand-coloured, light, fast.
 *
 * No persona/talking (there's no creature) — the voice here is the studio's.
 * three / @react-three/fiber + bloom. Pointer-repulsion runs on the CPU over
 * ~1k points (cheap). Reduced-motion → still helix, no auto-spin/scatter.
 */
import React, { useRef, useMemo, useState, useEffect, Suspense, lazy } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import './companion.css';

const BookingSheet = lazy(() => import('@/components/welcome/BookingSheet'));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const HEADLINE = {
  tap: 'That tap was just the beginning.',
  scan: 'So you found the card.',
  neutral: "Welcome — glad you're here.",
};
const SUBLINE = {
  idle: 'This is what we’re built from. Run your cursor through it.',
  call: 'A call? Let’s build something.',
  save: 'Take the studio with you.',
  folio: 'See what we’ve made.',
};

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
  const group = useRef();
  const cur = useRef(new THREE.Vector3());

  const { home, colors, tex, count } = useMemo(() => {
    const S = 520; const turns = 4, Hh = 6, R = 1.1;
    const pts = []; const cols = [];
    const red = new THREE.Color('#ff4133'); const grn = new THREE.Color('#37d27e'); const rung = new THREE.Color('#aeb6bf');
    for (let i = 0; i < S; i++) {
      const t = i / (S - 1); const a = t * turns * Math.PI * 2; const y = (t - 0.5) * Hh;
      const ax = Math.cos(a) * R, az = Math.sin(a) * R;
      const bx = Math.cos(a + Math.PI) * R, bz = Math.sin(a + Math.PI) * R;
      pts.push(ax, y, az); cols.push(red.r, red.g, red.b);
      pts.push(bx, y, bz); cols.push(grn.r, grn.g, grn.b);
      if (i % 4 === 0) {
        for (const m of [0.35, 0.65]) { pts.push(ax + (bx - ax) * m, y, az + (bz - az) * m); cols.push(rung.r, rung.g, rung.b); }
      }
    }
    const home = new Float32Array(pts); const colors = new Float32Array(cols);
    return { home, colors, tex: makeDot(), count: home.length / 3 };
  }, []);

  const dyn = useRef(home.slice());
  const vel = useRef(new Float32Array(home.length));
  const prev = useRef(new THREE.Vector3());
  const havePrev = useRef(false);

  useFrame((state, dt) => {
    if (!pointsRef.current) return;
    if (reduced) return; // reduced-motion: stays a static helix
    dt = Math.min(dt, 0.033);

    // pointer → world point on the z=0 plane (group has no transform)
    const cam = state.camera; const p = state.pointer;
    cur.current.set(p.x, p.y, 0.5).unproject(cam);
    const dir = cur.current.sub(cam.position).normalize();
    const tHit = dir.z !== 0 ? -cam.position.z / dir.z : 0;
    cur.current.copy(cam.position).add(dir.multiplyScalar(tHit));

    // cursor velocity = how hard it's striking this frame
    let cvx = 0, cvy = 0, cvz = 0, speed = 0;
    if (havePrev.current) { cvx = (cur.current.x - prev.current.x) / dt; cvy = (cur.current.y - prev.current.y) / dt; cvz = (cur.current.z - prev.current.z) / dt; speed = Math.hypot(cvx, cvy, cvz); }
    prev.current.copy(cur.current); havePrev.current = true;

    const pos = dyn.current, v = vel.current, hm = home;
    const R = 1.45, minSpeed = 0.25, transfer = 0.55, radialK = 0.32, springK = 5.5, maxV = 10;
    const damp = Math.pow(0.9, dt * 60); // frame-rate-stable, slow settle
    const striking = speed > minSpeed;
    const ag = agitate.current;
    for (let i = 0; i < pos.length; i += 3) {
      // gentle spring toward home — slow, graceful return
      v[i] += (hm[i] - pos[i]) * springK * dt;
      v[i + 1] += (hm[i + 1] - pos[i + 1]) * springK * dt;
      v[i + 2] += (hm[i + 2] - pos[i + 2]) * springK * dt;
      // impulse only when actually struck — flies off at the ferocity of the strike
      if (striking) {
        const dx = pos[i] - cur.current.x, dy = pos[i + 1] - cur.current.y, dz = pos[i + 2] - cur.current.z;
        const dist = Math.hypot(dx, dy, dz) || 0.001;
        if (dist < R) {
          const prox = (R - dist) / R;
          const rk = speed * radialK * prox / dist;
          v[i] += cvx * transfer * prox + dx * rk;
          v[i + 1] += cvy * transfer * prox + dy * rk;
          v[i + 2] += cvz * transfer * prox + dz * rk;
        }
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
    <group ref={group}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={home.slice()} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} vertexColors map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </group>
  );
}

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; }
}

export default function HelixHero() {
  const [params] = useSearchParams();
  const variant = useMemo(() => {
    const ref = params.get('ref');
    if (!ref) return 'neutral';
    if (ref.endsWith('-nfc') || ref === 'phone-tap') return 'tap';
    if (ref.endsWith('-qr')) return 'scan';
    return 'neutral';
  }, [params]);

  const [sub, setSub] = useState('idle');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [inView, setInView] = useState(true);
  const agitate = useRef(0);
  const gestured = useRef(false);
  const stageRef = useRef(null);
  const webgl = useMemo(hasWebGL, []);
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  const buzz = (p) => { try { if (gestured.current && navigator.vibrate) navigator.vibrate(p); } catch (e) { /* */ } };
  const enter = (m) => () => { setSub(m); agitate.current = clamp(agitate.current + 0.5, 0, 1); buzz(5); };
  const leave = () => setSub('idle');

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ctaBase = { display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', padding: '12px 16px', borderRadius: 12, cursor: 'pointer', textDecoration: 'none' };

  return (
    <div className="c4-companion" ref={stageRef} onPointerDown={() => { gestured.current = true; }}>
      <div className="c4-companion__stage">
        {webgl ? (
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
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(243,242,239,0.5)' }}>C4 Studios</div>
        )}
      </div>

      <div className="c4-companion__copy">
        <div style={{ fontSize: 12, letterSpacing: '0.26em', color: 'rgba(243,242,239,0.5)' }}>c4 studios · perth</div>
        <h1 style={{ margin: '12px 0 6px', fontSize: 30, lineHeight: 1.08, fontWeight: 500, letterSpacing: '-0.03em', color: '#f4f2ef' }}>
          {HEADLINE[variant]}
        </h1>
        <p style={{ margin: '0 0 20px', fontSize: 15, lineHeight: 1.5, color: 'rgba(243,242,239,0.72)', minHeight: 44 }}>
          {SUBLINE[sub]}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 330 }}>
          <button type="button" onClick={() => { setBookingOpen(true); buzz([14]); }}
            onMouseEnter={enter('call')} onMouseLeave={leave} onFocus={enter('call')} onBlur={leave}
            style={{ ...ctaBase, border: 'none', background: '#f3f2ef', color: '#15161a' }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>Book a call</span>
          </button>
          <a href="/caleb.vcf" download="Caleb Scott - C4 Studios.vcf" onClick={() => buzz([10, 30, 10])}
            onMouseEnter={enter('save')} onMouseLeave={leave} onFocus={enter('save')} onBlur={leave}
            style={{ ...ctaBase, border: '0.5px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.04)', color: '#f3f2ef' }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>Save my contact</span>
          </a>
          <Link to="/Portfolio" onMouseEnter={enter('folio')} onMouseLeave={leave} onFocus={enter('folio')} onBlur={leave}
            style={{ ...ctaBase, gap: 8, padding: '10px 16px', border: 'none', background: 'transparent', color: 'rgba(243,242,239,0.62)' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>See the portfolio</span>
          </Link>
        </div>
      </div>

      {bookingOpen && (
        <Suspense fallback={null}>
          <BookingSheet open={bookingOpen} onClose={() => setBookingOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
