/**
 * CompanionHero — the "Digital Experiential" companion for /welcome.
 *
 * A real-time 3D companion (rigged .glb) that genuinely tracks the pointer
 * (unprojected through the camera from the head's real world position — not a
 * container-relative approximation), blinks, and reacts to each CTA it is asked
 * to look at: glances over, eyes change colour, plays an emote + facial morph,
 * leans/tilts, and pops a drawn-on speech bubble. three / R3F / drei + bloom.
 *
 * Model: /public/models/companion.glb (CC0 placeholder, re-skinned to charcoal
 * + brand accents). Swap that one file for a custom C4 robot later.
 *
 * Production: studio Environment + ContactShadows + Bloom + ACES; mobile
 * gyro-gaze; renders pause offscreen / for reduced-motion; static C4-mark
 * fallback when WebGL is unavailable.
 */
import React, { useRef, useMemo, useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useGLTF, useAnimations } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import C4Mark from '@/components/welcome/C4Mark';
import './companion.css';

const BookingSheet = lazy(() => import('@/components/welcome/BookingSheet'));

const MODEL_URL = '/models/companion.glb';
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const REACT = {
  call:  { eye: '#ff5a52', ei: 2.0, morph: 0.9, tilt: 0.04, lean: 0.28 },
  save:  { eye: '#57c98a', ei: 1.9, morph: 0.85, tilt: -0.04, lean: 0.12 },
  folio: { eye: '#e3c08a', ei: 1.5, morph: 0.0, tilt: 0.2, lean: 0.0 },
};
const EMOTE = { call: 'Wave', save: 'ThumbsUp', folio: 'Yes' };

function Robot({ gaze }) {
  const group = useRef();
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  const headBone = useMemo(() => scene.getObjectByName('Head'), [scene]);
  const baseHead = useMemo(
    () => (headBone ? { x: headBone.rotation.x, y: headBone.rotation.y, z: headBone.rotation.z } : { x: 0, y: 0, z: 0 }),
    [headBone],
  );
  const morphMesh = useMemo(() => {
    let m = null;
    scene.traverse((o) => { if (!m && o.morphTargetDictionary && 'Surprised' in o.morphTargetDictionary) m = o; });
    return m;
  }, [scene]);
  const eyeMat = useRef(null);

  const cur = useRef({ yaw: 0, pitch: 0, tilt: 0, lean: 0, ei: 1.1 });
  const sacc = useRef({ x: 0, y: 0, n: 60 });
  const blink = useRef({ state: 0, start: 0, dur: 160, next: 1400 });
  const lastMode = useRef('none');
  const tmpV = useRef(new THREE.Vector3());
  const tmpH = useRef(new THREE.Vector3());
  const tmpC = useRef(new THREE.Color());

  useEffect(() => {
    const recolor = (m) => {
      const nm = m.clone();
      if (nm.color) {
        const hsl = {}; nm.color.getHSL(hsl);
        if (hsl.s > 0.32 && hsl.h > 0.02 && hsl.h < 0.14) nm.color.set('#34373d');
        else if (hsl.l > 0.55 && hsl.s < 0.25) nm.color.set('#7c8088');
      }
      if ('metalness' in nm) nm.metalness = Math.min(1, (nm.metalness || 0.3) + 0.25);
      if ('roughness' in nm) nm.roughness = clamp((nm.roughness ?? 0.6) - 0.12, 0.1, 0.9);
      nm.envMapIntensity = 1.25;
      return nm;
    };
    scene.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true; o.frustumCulled = false;
      if (Array.isArray(o.material)) o.material = o.material.map(recolor);
      else if (o.material) o.material = recolor(o.material);
      if (o.material && !Array.isArray(o.material) && o.material.name === 'Black') {
        // Glossy clear-coat "lens" eyes — reflect the HDRI, glow softly.
        const em = new THREE.MeshPhysicalMaterial({
          color: '#0a0f0c',
          emissive: new THREE.Color('#4fae6a'),
          emissiveIntensity: 0.9,
          metalness: 0.0,
          roughness: 0.22,
          clearcoat: 1.0,
          clearcoatRoughness: 0.12,
          envMapIntensity: 1.8,
        });
        o.material = em;
        eyeMat.current = em;
      }
    });
    actions?.Idle?.reset().fadeIn(0.3).play();
    return () => { actions?.Idle?.fadeOut(0.2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, actions]);

  useFrame((state) => {
    const now = performance.now();
    const G = gaze.current || { sx: 0, sy: 0, mode: 'none', t: 0, gt: 0, gx: 0, gy: 0 };
    const R = REACT[G.mode];

    if (G.mode !== lastMode.current) {
      lastMode.current = G.mode;
      const a = EMOTE[G.mode] && actions ? actions[EMOTE[G.mode]] : null;
      if (a) { a.reset(); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.fadeIn(0.12).play(); }
    }

    // ── Resolve a target yaw/pitch the head should aim at ──
    let yaw, pitch;
    const gyroActive = G.mode === 'none' && now - (G.gt || 0) < 500;
    if (G.mode === 'none' && !gyroActive && now - (G.t || 0) > 2600) {
      const a = now / 1000 * 0.5; yaw = Math.cos(a) * 0.4; pitch = Math.sin(a * 0.8) * 0.16;
    } else if (gyroActive) {
      yaw = G.gx * 0.6; pitch = G.gy * 0.35;
    } else if (headBone) {
      // Unproject the real cursor through the camera, relative to the canvas.
      const rect = state.gl.domElement.getBoundingClientRect();
      const nx = (((G.sx - rect.left) / rect.width) * 2 - 1);
      const ny = -(((G.sy - rect.top) / rect.height) * 2 - 1);
      tmpV.current.set(clamp(nx, -2, 2), clamp(ny, -2, 2), 0.5).unproject(state.camera);
      headBone.getWorldPosition(tmpH.current);
      tmpV.current.sub(tmpH.current); // head → cursor direction
      yaw = Math.atan2(tmpV.current.x, tmpV.current.z);
      pitch = Math.atan2(tmpV.current.y, Math.hypot(tmpV.current.x, tmpV.current.z));
    } else { yaw = 0; pitch = 0; }

    if (G.mode === 'none' && !gyroActive) {
      sacc.current.n -= 1;
      if (sacc.current.n <= 0) {
        sacc.current.x = (Math.random() - 0.5) * 0.1; sacc.current.y = (Math.random() - 0.5) * 0.08;
        sacc.current.n = 40 + Math.random() * 70;
      }
      yaw += sacc.current.x; pitch += sacc.current.y;
    }

    cur.current.yaw += (clamp(yaw, -0.7, 0.7) - cur.current.yaw) * 0.12;
    cur.current.pitch += (clamp(pitch, -0.4, 0.4) - cur.current.pitch) * 0.12;
    cur.current.tilt += ((R ? R.tilt : 0) - cur.current.tilt) * 0.1;
    cur.current.lean += ((R ? R.lean : 0) - cur.current.lean) * 0.1;

    if (headBone) {
      headBone.rotation.y = baseHead.y + cur.current.yaw;
      headBone.rotation.x = baseHead.x - cur.current.pitch;
      headBone.rotation.z = baseHead.z + cur.current.tilt;
    }
    if (group.current) group.current.position.z = cur.current.lean;

    // ── Facial morph (surprise) for stronger reactions ──
    if (morphMesh?.morphTargetInfluences) {
      const idx = morphMesh.morphTargetDictionary.Surprised;
      if (idx !== undefined) {
        const target = R ? R.morph : 0;
        morphMesh.morphTargetInfluences[idx] += (target - morphMesh.morphTargetInfluences[idx]) * 0.18;
      }
    }

    // ── Eyes: colour + eased blink (glowing eyes "blink" by dimming) ──
    const b = blink.current;
    if (b.state === 0 && now >= b.next) { b.state = 1; b.start = now; b.dur = 150 + Math.random() * 70; }
    let bAmt = 0;
    if (b.state === 1) {
      const ph = (now - b.start) / b.dur;
      if (ph >= 1) { b.state = 0; b.next = now + (Math.random() < 0.16 ? 170 : 2800 + Math.random() * 3200); }
      else { let c; if (ph < 0.4) { c = ph / 0.4; c *= c; } else { c = 1 - (ph - 0.4) / 0.6; c = c * (2 - c); } bAmt = clamp(c, 0, 1); }
    }
    if (eyeMat.current) {
      tmpC.current.set(R ? R.eye : '#4fae6a');
      eyeMat.current.emissive.lerp(tmpC.current, 0.16);
      const eiTarget = (R ? R.ei : 1.1) * (1 - 0.92 * bAmt);
      cur.current.ei += (eiTarget - cur.current.ei) * 0.4;
      eyeMat.current.emissiveIntensity = cur.current.ei;
    }
  });

  return (
    <group ref={group} position={[0, -3.12, 0]} scale={1.0} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}
useGLTF.preload(MODEL_URL);

function Bubble({ mode }) {
  if (!REACT[mode]) return null;
  const c = REACT[mode].eye;
  let glyph;
  if (mode === 'call') {
    glyph = (<>
      <path className="c4b-draw" d="M30 17 L30 33" stroke="#fff" strokeWidth="5" strokeLinecap="round" pathLength="1" />
      <circle className="c4b-dot" cx="30" cy="41" r="3" fill="#fff" />
    </>);
  } else if (mode === 'save') {
    glyph = (<path className="c4b-draw" d="M21 29 L27 35 L39 21" fill="none" stroke="#0c2a18" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />);
  } else {
    glyph = (<>
      <path className="c4b-draw" d="M24 24 q0 -8 7 -8 q7 0 7 6 q0 5 -6 7 l0 3" fill="none" stroke="#3a2c08" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
      <circle className="c4b-dot" cx="31" cy="43" r="2.6" fill="#3a2c08" />
    </>);
  }
  return (
    <div className="c4-bubble" key={mode}>
      <svg width="60" height="74" viewBox="0 0 60 74" aria-hidden="true">
        <circle className="c4b-ring" cx="30" cy="28" r="18" fill="none" stroke={c} strokeWidth="2" />
        <rect x="6" y="6" width="48" height="44" rx="15" fill={c} />
        <path d="M24 49 L36 49 L30 61 Z" fill={c} />
        {glyph}
      </svg>
    </div>
  );
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) { return false; }
}

export default function CompanionHero() {
  const gaze = useRef({ sx: 0, sy: 0, mode: 'none', t: 0, gt: 0, gx: 0, gy: 0 });
  const [mode, setMode] = useState('none');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [inView, setInView] = useState(true);
  const stageRef = useRef(null);
  const webgl = useMemo(hasWebGL, []);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const onMove = (e) => {
    if (gaze.current.mode !== 'none') return;
    gaze.current.sx = e.clientX; gaze.current.sy = e.clientY; gaze.current.t = performance.now();
  };
  const enter = (m) => (e) => {
    const t = e.currentTarget.getBoundingClientRect();
    gaze.current.sx = t.left + t.width / 2; gaze.current.sy = t.top + t.height / 2;
    gaze.current.mode = m; gaze.current.t = performance.now();
    setMode(m);
  };
  const leave = () => { gaze.current.mode = 'none'; gaze.current.t = performance.now(); setMode('none'); };

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onOrient = (e) => {
      if (gaze.current.mode !== 'none') return;
      gaze.current.gx = clamp((e.gamma || 0) / 40, -1, 1);
      gaze.current.gy = -clamp(((e.beta || 45) - 45) / 40, -1, 1);
      gaze.current.gt = performance.now();
    };
    const needPerm = typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function';
    let added = false;
    const add = () => { if (!added) { added = true; window.addEventListener('deviceorientation', onOrient); } };
    const onFirstTouch = () => {
      DeviceOrientationEvent.requestPermission().then((s) => { if (s === 'granted') add(); }).catch(() => {});
      window.removeEventListener('touchstart', onFirstTouch);
    };
    if (needPerm) window.addEventListener('touchstart', onFirstTouch, { once: true });
    else if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) add();
    return () => { window.removeEventListener('deviceorientation', onOrient); window.removeEventListener('touchstart', onFirstTouch); };
  }, []);

  const ctaBase = { display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', padding: '12px 16px', borderRadius: 12, cursor: 'pointer', textDecoration: 'none' };

  return (
    <div className="c4-companion" ref={stageRef} onPointerMove={onMove}>
      <div className="c4-companion__stage">
        <Bubble mode={mode} />
        {webgl ? (
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0.35, 5.0], fov: 33 }}
            gl={{ antialias: true, alpha: true }}
            frameloop={inView && !reduced ? 'always' : 'demand'}
            style={{ position: 'absolute', inset: 0 }}
          >
            <ambientLight intensity={0.22} color="#3a3f48" />
            <directionalLight position={[3.5, 5, 5]} intensity={1.0} />
            <directionalLight position={[-4, 1.5, 3]} intensity={0.25} color="#9fb4c8" />
            <pointLight position={[-3, 0.6, 3]} intensity={0.6} color="#a30000" />
            <pointLight position={[3, -0.4, 3]} intensity={0.5} color="#22632f" />
            <Suspense fallback={null}>
              <Environment files="/hdri/studio.hdr" resolution={512} />
              <Robot gaze={gaze} />
            </Suspense>
            <ContactShadows position={[0, -3.12, 0]} opacity={0.5} scale={9} blur={2.8} far={4} color="#000000" />
            <EffectComposer disableNormalPass multisampling={8}>
              <Bloom intensity={0.45} luminanceThreshold={0.5} luminanceSmoothing={0.3} mipmapBlur radius={0.6} />
            </EffectComposer>
          </Canvas>
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <C4Mark size={120} />
          </div>
        )}
      </div>

      <div className="c4-companion__copy">
        <div style={{ fontSize: 12, letterSpacing: '0.26em', color: 'rgba(243,242,239,0.5)' }}>c4 studios · perth</div>
        <h1 style={{ margin: '12px 0 6px', fontSize: 30, lineHeight: 1.08, fontWeight: 500, letterSpacing: '-0.03em', color: '#f4f2ef' }}>
          What can we build?
        </h1>
        <p style={{ margin: '0 0 20px', fontSize: 15, lineHeight: 1.55, color: 'rgba(243,242,239,0.6)' }}>
          Hover a button — it watches, and reacts.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 330 }}>
          <button type="button" onClick={() => setBookingOpen(true)}
            onMouseEnter={enter('call')} onMouseLeave={leave} onFocus={enter('call')} onBlur={leave}
            style={{ ...ctaBase, border: 'none', background: '#f3f2ef', color: '#15161a' }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>Book a call</span>
          </button>
          <a href="/caleb.vcf" download="Caleb Scott - C4 Studios.vcf"
            onMouseEnter={enter('save')} onMouseLeave={leave} onFocus={enter('save')} onBlur={leave}
            style={{ ...ctaBase, border: '0.5px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.04)', color: '#f3f2ef' }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>Save my contact</span>
          </a>
          <Link to="/Portfolio"
            onMouseEnter={enter('folio')} onMouseLeave={leave} onFocus={enter('folio')} onBlur={leave}
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
