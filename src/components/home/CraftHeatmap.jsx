import React, { useEffect, useRef } from 'react';

// Premium, restrained interactive heatmap for hero background
// - Canvas-based for performance
// - Hover/touch responsive with smooth decay
// - Session-randomised neutral palette + subtle brand tint
export default function CraftHeatmap() {
  const canvasRef = useRef(null);
  const parentRef = useRef(null);
  const rafRef = useRef(0);
  const gridRef = useRef({ cols: 0, rows: 0, cell: 26, intensities: [], taus: [], baseColors: [] });
  const stateRef = useRef({ last: 0, isMobile: false, dpr: 1, width: 0, height: 0, driftT: 0, palette: null, seed: 0 });

  // Simple LCG deterministic RNG (seeded per session)
  function makeRNG(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  const lightPalettes = [
    { neutrals: ['#F7F5F2', '#F0EDE8', '#F4F2EF', '#EEECE8', '#EAE7E2'], accent: '#C23030' },
    { neutrals: ['#F9F8F6', '#F0EEEA', '#EFEDE8', '#EDEBE7', '#E9E6E1'], accent: '#B82C2C' },
    { neutrals: ['#F6F4F1', '#EFEBE6', '#F3F1ED', '#EDEAE5', '#E8E5E0'], accent: '#A82828' },
  ];
  const darkPalettes = [
    { neutrals: ['#0F1115', '#131720', '#161A21', '#121620', '#10141C'], accent: '#B33A3A' },
    { neutrals: ['#101318', '#14181F', '#151921', '#111520', '#0F131B'], accent: '#A83535' },
    { neutrals: ['#0E1014', '#12161E', '#141820', '#101419', '#0F1318'], accent: '#9E3232' },
  ];
  const isDark = () => document.documentElement.classList.contains('dark-mode');
  const getPalettes = () => isDark() ? darkPalettes : lightPalettes;

  const pick = (rng, arr) => arr[Math.floor(rng() * arr.length) % arr.length];

  const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 0, b: 0 };
  };

  const mix = (c1, c2, t) => ({ r: Math.round(c1.r + (c2.r - c1.r) * t), g: Math.round(c1.g + (c2.g - c1.g) * t), b: Math.round(c1.b + (c2.b - c1.b) * t) });

  function setupCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    stateRef.current.isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    stateRef.current.dpr = dpr;

    const rect = parent.getBoundingClientRect();
    stateRef.current.width = rect.width;
    stateRef.current.height = rect.height;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Grid sizing
    const cell = stateRef.current.isMobile ? 28 : 26;
    const cols = Math.ceil(rect.width / cell);
    const rows = Math.ceil(rect.height / cell);

    // Session seed + RNG
    let seed = Number(sessionStorage.getItem('c4_heatmap_seed'));
    if (!seed || Number.isNaN(seed)) {
      seed = Math.floor(Math.random() * 1e9);
      sessionStorage.setItem('c4_heatmap_seed', String(seed));
    }
    stateRef.current.seed = seed;
    const rng = makeRNG(seed);

    const currentPalettes = getPalettes();
    const palette = currentPalettes[Math.floor(rng() * currentPalettes.length) % currentPalettes.length];
    stateRef.current.palette = palette;

    const intensities = new Array(rows).fill(0).map(() => new Float32Array(cols));
    const taus = new Array(rows).fill(0).map(() => new Float32Array(cols));
    const baseColors = new Array(rows).fill(0).map(() => new Array(cols));

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        taus[y][x] = 0.6 + rng() * 0.6; // 0.6–1.2s decay
        const neutralHex = pick(rng, palette.neutrals);
        baseColors[y][x] = hexToRgb(neutralHex);
        intensities[y][x] = 0;
      }
    }

    gridRef.current = { cols, rows, cell, intensities, taus, baseColors };
  }

  function activateAt(clientX, clientY) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const { cell, cols, rows, intensities } = gridRef.current;
    const cx = Math.floor(x / cell);
    const cy = Math.floor(y / cell);
    const radius = 2.2; // include neighbours
    const sigma2 = 1.1 * 1.1;

    for (let j = -3; j <= 3; j++) {
      for (let i = -3; i <= 3; i++) {
        const tx = cx + i;
        const ty = cy + j;
        if (tx >= 0 && tx < cols && ty >= 0 && ty < rows) {
          const d2 = i * i + j * j;
          const boost = Math.exp(-d2 / (2 * sigma2)); // 0..1 bell curve
          const v = Math.max(intensities[ty][tx], boost);
          intensities[ty][tx] = Math.min(1, v);
        }
      }
    }
  }

  function loop(ts) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { dpr, isMobile, width, height } = stateRef.current;
    const grid = gridRef.current;

    if (!stateRef.current.last) stateRef.current.last = ts;
    const dt = Math.min(0.05, (ts - stateRef.current.last) / 1000); // clamp for stability
    stateRef.current.last = ts;

    // Ambient drift for mobile
    if (isMobile) {
      stateRef.current.driftT += dt;
      const t = stateRef.current.driftT;
      const ax = (grid.cols / 2) + Math.sin(t * 0.6) * (grid.cols * 0.25);
      const ay = (grid.rows / 2) + Math.cos(t * 0.45) * (grid.rows * 0.22);
      activateAt(ax * grid.cell, ay * grid.cell);
    }

    // Decay
    const { intensities, taus, baseColors, cols, rows, cell } = grid;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tau = taus[y][x];
        const v = intensities[y][x] * Math.exp(-dt / tau);
        intensities[y][x] = v < 0.001 ? 0 : v;
      }
    }

    // Draw
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const acc = hexToRgb(stateRef.current.palette.accent);
    const dark = isDark();
    const highlight = dark ? { r: 50, g: 50, b: 50 } : { r: 255, g: 255, b: 255 };
    const fadeStart = 0.55; // fade begins at 55% down

    for (let y = 0; y < rows; y++) {
      const yNorm = (y * cell) / height;
      const fade = yNorm <= fadeStart ? 0 : Math.min(1, (yNorm - fadeStart) / (1 - fadeStart));
      // Ease the fade for smoother transition
      const fadeCurve = fade * fade * (3 - 2 * fade); // smoothstep
      const rowAlpha = 1 - fadeCurve;

      if (rowAlpha <= 0.01) continue; // skip fully transparent rows

      for (let x = 0; x < cols; x++) {
        const v = intensities[y][x];
        const base = baseColors[y][x];
        const lightMix = mix(base, highlight, v * 0.12);
        ctx.globalAlpha = rowAlpha;
        ctx.fillStyle = `rgb(${lightMix.r}, ${lightMix.g}, ${lightMix.b})`;
        ctx.fillRect(Math.floor(x * cell), Math.floor(y * cell), cell + 0.5, cell + 0.5);
        if (v > 0) {
          ctx.fillStyle = `rgba(${acc.r}, ${acc.g}, ${acc.b}, ${Math.min(dark ? 0.18 : 0.12, v * (dark ? 0.18 : 0.12))})`;
          ctx.fillRect(Math.floor(x * cell), Math.floor(y * cell), cell + 0.5, cell + 0.5);
        }
      }
    }
    ctx.globalAlpha = 1;

    ctx.restore();
    rafRef.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setupCanvas();
    rafRef.current = requestAnimationFrame(loop);

    // Pointer interactions (desktop)
    const onPointerMove = (e) => {
      if (stateRef.current.isMobile) return;
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        activateAt(e.clientX, e.clientY);
      }
    };
    const onPointerDown = (e) => {
      // Touch ripple
      if (e.pointerType === 'touch') {
        activateAt(e.clientX, e.clientY);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerdown', onPointerDown);

    const onResize = () => {
      cancelAnimationFrame(rafRef.current);
      setupCanvas();
      rafRef.current = requestAnimationFrame(loop);
    };
    window.addEventListener('resize', onResize);

    // Watch for theme changes on <html> class list
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(rafRef.current);
      stateRef.current.last = 0;
      setupCanvas();
      rafRef.current = requestAnimationFrame(loop);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={parentRef} className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
    </div>
  );
}