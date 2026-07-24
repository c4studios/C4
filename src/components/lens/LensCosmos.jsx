/**
 * LensCosmos — "§ 00 · THE WIDEST SHOT."
 *
 * A scroll interlude seen through a rear lens element: a field of
 * drifting dots that are not dust but WORLDS. As you scroll, the
 * camera commits to one of them — it grows, resolves, and turns out
 * to be Earth; a marker lands on Perth. The page's whole practice in
 * one move: every frame C4 Lens has ever shot was taken on that dot.
 *
 * Implementation
 *   · Self-contained canvas piece — own scroll math (sticky section,
 *     progress from getBoundingClientRect), own rAF, IO-gated so it
 *     only draws while on screen. No GSAP, no globals, no page ids.
 *   · The starfield: ~230 particles with z-depth; a handful are
 *     larger, tinted "planets". Idle = slow parallax drift + twinkle.
 *     Scroll = the field radiates outward past the camera while the
 *     chosen dot swells into the planet.
 *   · EARTH: if /lens/earth.webp (or .png) exists it is drawn inside
 *     a circular clip with atmosphere + terminator — drop a real
 *     blue-marble render there (Australia facing camera) any time.
 *     Until then a procedural Earth paints from a seeded offscreen
 *     texture: ocean, continents (an unmistakable Australia mid-disc),
 *     polar ice, cloud wisps, atmosphere rim.
 *   · Perth: a pulsing red marker on Australia's west coast +
 *     coordinates caption, landing in the final tenth of the scroll.
 *   · staticMode (prerender / prefers-reduced-motion): the final
 *     frame renders once — Earth, marker, caption. Nothing animates.
 */
import React, { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;

/* Deterministic PRNG so every visit shows the same sky. */
function mulberry32(a) {
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Build the star/planet field once. z ∈ (0.25, 1] — bigger z = nearer. */
function makeField() {
  const rng = mulberry32(20260724);
  const stars = [];
  for (let i = 0; i < 230; i += 1) {
    const planet = i < 12; /* a scattering of true worlds among the dust */
    stars.push({
      /* polar placement around centre keeps the zoom radial */
      a: rng() * TAU,
      r: 0.06 + Math.pow(rng(), 0.72) * 0.62,
      z: 0.25 + rng() * 0.75,
      size: planet ? 1.6 + rng() * 2.2 : 0.5 + rng() * 1.1,
      tw: rng() * TAU,
      hue: planet
        ? [14, 32, 205, 268, 12, 40, 195, 20, 210, 30, 8, 220][i]
        : 0,
      planet,
    });
  }
  return stars;
}

/* Procedural Earth texture, painted once at 512px. Deliberately puts
   Australia centre-right so the Perth marker lands honestly. */
function paintEarth(size) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d');
  const R = size / 2;
  const rng = mulberry32(31951186);

  /* Ocean. */
  const ocean = g.createRadialGradient(R * 0.82, R * 0.78, R * 0.1, R, R, R);
  ocean.addColorStop(0, '#2c6aa8');
  ocean.addColorStop(0.55, '#1c4e82');
  ocean.addColorStop(1, '#0b2848');
  g.fillStyle = ocean;
  g.beginPath();
  g.arc(R, R, R, 0, TAU);
  g.fill();

  /* Land — soft blob chains. One blob is unmistakably Australia. */
  const land = (cx, cy, base, n, tone) => {
    g.fillStyle = tone;
    for (let i = 0; i < n; i += 1) {
      const a = rng() * TAU;
      const d = rng() * base * 0.9;
      const s = base * (0.35 + rng() * 0.5);
      g.beginPath();
      g.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d, s, s * (0.6 + rng() * 0.5), rng() * TAU, 0, TAU);
      g.fill();
    }
  };
  /* Africa/Eurasia hint upper-left, Americas sliver on the limb. */
  land(R * 0.62, R * 0.55, R * 0.16, 9, '#3e6b3a');
  land(R * 0.5, R * 0.38, R * 0.13, 7, '#46703c');
  land(R * 0.24, R * 0.72, R * 0.09, 5, '#3c6538');
  /* AUSTRALIA — centre-right, ochre heart with green rim. */
  g.save();
  g.translate(R * 1.24, R * 1.18);
  g.rotate(-0.12);
  g.fillStyle = '#8a6a37';
  g.beginPath();
  g.ellipse(0, 0, R * 0.21, R * 0.155, 0, 0, TAU);
  g.fill();
  g.fillStyle = '#a07c40';
  g.beginPath();
  g.ellipse(-R * 0.02, -R * 0.01, R * 0.13, R * 0.09, 0.2, 0, TAU);
  g.fill();
  g.restore();
  /* Polar ice. */
  g.fillStyle = 'rgba(235, 244, 250, 0.85)';
  g.beginPath();
  g.ellipse(R, R * 0.06, R * 0.34, R * 0.1, 0, 0, TAU);
  g.fill();
  g.beginPath();
  g.ellipse(R * 0.9, R * 1.96, R * 0.4, R * 0.12, 0, 0, TAU);
  g.fill();

  /* Cloud wisps. */
  g.fillStyle = 'rgba(255,255,255,0.16)';
  for (let i = 0; i < 26; i += 1) {
    const a = rng() * TAU;
    const d = rng() * R * 0.92;
    g.beginPath();
    g.ellipse(
      R + Math.cos(a) * d,
      R + Math.sin(a) * d,
      R * (0.06 + rng() * 0.16),
      R * (0.015 + rng() * 0.03),
      rng() * TAU,
      0,
      TAU,
    );
    g.fill();
  }

  /* Clip everything back to the disc. */
  g.globalCompositeOperation = 'destination-in';
  g.beginPath();
  g.arc(R, R, R, 0, TAU);
  g.fill();
  g.globalCompositeOperation = 'source-over';
  return c;
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);

export default function LensCosmos() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const capRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const staticMode =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      /Prerender/i.test(navigator.userAgent);

    const stars = makeField();
    let earthTex = paintEarth(512);
    /* The real-asset slot: drop public/lens/earth.webp (or .png) and
       it replaces the procedural texture on next load. */
    const tryAsset = (src) => {
      const img = new Image();
      img.onload = () => {
        earthTex = img;
      };
      img.src = src;
    };
    tryAsset('/lens/earth.webp');

    let raf = 0;
    let running = false;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let t0 = performance.now();

    const resize = () => {
      const host = canvas.parentElement;
      const r = host.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(2, Math.round(r.width));
      H = Math.max(2, Math.round(r.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const progress = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      return total > 0 ? clamp01(-r.top / total) : 1;
    };

    const draw = (now) => {
      const p = staticMode ? 1 : progress();
      const t = (now - t0) / 1000;
      const cx = W / 2;
      const cy = H / 2;
      const minDim = Math.min(W, H);

      ctx.clearRect(0, 0, W, H);

      /* Space. */
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.72);
      bg.addColorStop(0, '#0a0c12');
      bg.addColorStop(1, '#040507');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* Zoom: the field radiates past the camera as p grows. */
      const zoom = 1 + smooth(clamp01(p / 0.78)) * 7.5;
      const fieldAlpha = 1 - smooth(clamp01((p - 0.62) / 0.3)) * 0.92;

      stars.forEach((s) => {
        const drift = staticMode ? 0 : t * 0.008 * (1.3 - s.z);
        const a = s.a + drift;
        const rr = s.r * zoom * (0.6 + s.z * 0.55) * minDim;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr * 0.82;
        if (x < -30 || x > W + 30 || y < -30 || y > H + 30) return;
        const tw = staticMode ? 0.75 : 0.55 + 0.45 * Math.sin(s.tw + t * (s.planet ? 0.6 : 1.7));
        const size = s.size * (0.75 + s.z * 0.6) * (1 + (zoom - 1) * 0.06);
        ctx.globalAlpha = fieldAlpha * tw * (s.planet ? 0.95 : 0.8);
        ctx.fillStyle = s.planet ? `hsl(${s.hue} 48% 66%)` : '#dfe6ef';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, TAU);
        ctx.fill();
        if (s.planet) {
          ctx.globalAlpha = fieldAlpha * 0.2;
          ctx.beginPath();
          ctx.arc(x, y, size * 2.4, 0, TAU);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      /* The chosen world: a dot until ~p 0.3, then Earth arriving. */
      const grow = smooth(clamp01((p - 0.3) / 0.62));
      const eR = (2.5 + Math.pow(grow, 1.55) * (minDim * 0.335 - 2.5));
      if (p > 0.02) {
        /* Atmosphere. */
        const glow = ctx.createRadialGradient(cx, cy, eR * 0.7, cx, cy, eR * 1.5 + 6);
        glow.addColorStop(0, 'rgba(110, 180, 255, 0)');
        glow.addColorStop(0.72, `rgba(110, 180, 255, ${0.22 * grow})`);
        glow.addColorStop(1, 'rgba(110, 180, 255, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, eR * 1.5 + 6, 0, TAU);
        ctx.fill();

        if (grow < 0.04) {
          /* Still just a promising dot. */
          ctx.fillStyle = '#9fc4e8';
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(1.4, eR), 0, TAU);
          ctx.fill();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, eR, 0, TAU);
          ctx.clip();
          ctx.drawImage(earthTex, cx - eR, cy - eR, eR * 2, eR * 2);
          /* Terminator — night falls on the limb. */
          const term = ctx.createRadialGradient(cx - eR * 0.55, cy - eR * 0.45, eR * 0.2, cx, cy, eR * 1.35);
          term.addColorStop(0, 'rgba(0,0,0,0)');
          term.addColorStop(0.72, 'rgba(0,0,0,0)');
          term.addColorStop(1, 'rgba(2,6,14,0.88)');
          ctx.fillStyle = term;
          ctx.fillRect(cx - eR, cy - eR, eR * 2, eR * 2);
          ctx.restore();
          /* Limb line. */
          ctx.strokeStyle = `rgba(150, 200, 255, ${0.35 * grow})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, eR, 0, TAU);
          ctx.stroke();
        }

        /* Perth — west coast of the Australia mass (centre-right,
           lower). Pulses in over the final tenth. */
        const mark = smooth(clamp01((p - 0.88) / 0.1));
        if (mark > 0.01 && grow > 0.6) {
          const mx = cx + eR * 0.485;
          const my = cy + eR * 0.52;
          const pulse = staticMode ? 0.5 : 0.5 + 0.5 * Math.sin(t * 2.6);
          ctx.globalAlpha = mark;
          ctx.strokeStyle = 'rgba(224, 30, 38, 0.85)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(mx, my, 4 + pulse * 5, 0, TAU);
          ctx.stroke();
          ctx.fillStyle = '#e01e26';
          ctx.beginPath();
          ctx.arc(mx, my, 2.2, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        if (capRef.current) {
          capRef.current.style.opacity = String(mark);
        }
      }
    };

    const loop = (now) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (staticMode) {
      /* One final frame; re-drawn only on resize. */
      draw(performance.now());
      const onR = () => {
        resize();
        draw(performance.now());
      };
      window.addEventListener('resize', onR);
      return () => window.removeEventListener('resize', onR);
    }

    const io = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting);
        if (on && !running) {
          running = true;
          t0 = performance.now();
          raf = requestAnimationFrame(loop);
        } else if (!on && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: '15% 0px' },
    );
    io.observe(section);
    window.addEventListener('resize', resize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="cosmos" ref={sectionRef} aria-label="The widest shot — from the stars down to Perth">
      <div className="cosmos-sticky">
        <div className="cosmos-head">
          <div className="sec-num"><span className="bar"></span>§ 00 — THE WIDEST SHOT</div>
          <h2 className="cosmos-title">EVERY DOT IS <em>a world.</em></h2>
          <p className="cosmos-sub">We shoot on the third one from the sun. Keep scrolling.</p>
        </div>
        <div className="cosmos-ring">
          <canvas ref={canvasRef} className="cosmos-canvas" aria-hidden="true" />
          <span className="cosmos-ticks" aria-hidden="true" />
        </div>
        <p className="cosmos-cap" ref={capRef}>
          One planet. Every frame on it.&ensp;·&ensp;PERTH, WA — 31.95° S · 115.86° E
        </p>
      </div>
    </section>
  );
}
