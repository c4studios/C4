import { useEffect } from 'react';

/* ──────────────────────────────────────────────────────────
   useHeatmapCanvas — reusable interactive heatmap renderer

   A compact, self-contained version of the hero CraftHeatmap
   algorithm: a seeded grid of cells that light up with an
   accent colour under the pointer and decay over time, plus a
   gentle idle "breathing" pulse. Designed to sit behind UI as
   a subtle decorative layer.

   usage:
     const canvasRef = useRef(null);
     useHeatmapCanvas(canvasRef, {
       accentColor: '#5B7FA6',
       cellSize: 8,
       opacity: 0.35,
     });

   The canvas sizes itself to its parent element and rebuilds
   on parent resize (ResizeObserver) and theme changes.
   ────────────────────────────────────────────────────────── */

const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : { r: 0, g: 0, b: 0 };
};

function makeRng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export default function useHeatmapCanvas(canvasRef, options = {}) {
  const {
    accentColor = '#5B7FA6',
    cellSize = 8,
    opacity = 0.35,
    maxAccentAlpha = 0.55,
    idle = true,
    mobileDisabled = true,
  } = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const parent = canvas.parentElement;
    if (!parent) return undefined;

    if (mobileDisabled && window.innerWidth < 768) {
      // Leave the canvas blank on mobile for performance.
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    let raf = 0;
    let grid = null;
    const state = { dpr: 1, width: 0, height: 0, idleT: 0, last: 0 };
    const acc = hexToRgb(accentColor);

    function setup() {
      const rect = parent.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.dpr = dpr;
      state.width = rect.width;
      state.height = rect.height;

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';

      const cols = Math.ceil(rect.width / cellSize);
      const rows = Math.ceil(rect.height / cellSize);

      const rng = makeRng(Math.floor((rect.width + rect.height) * 7919) + 13);
      const intensities = new Array(rows)
        .fill(0)
        .map(() => new Float32Array(cols));
      const taus = new Array(rows).fill(0).map(() => new Float32Array(cols));
      const activatedAt = new Array(rows)
        .fill(0)
        .map(() => new Float64Array(cols));

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          taus[y][x] = 0.6 + rng() * 0.6; // 0.6–1.2s decay
        }
      }

      grid = { cols, rows, intensities, taus, activatedAt };
    }

    function activateCell(tx, ty, boost) {
      if (!grid) return;
      const { cols, rows, intensities, taus, activatedAt } = grid;
      if (tx < 0 || tx >= cols || ty < 0 || ty >= rows) return;
      const now = performance.now();
      const fadeMs = taus[ty][tx] * 2200;
      const elapsed = now - activatedAt[ty][tx];
      const cur =
        elapsed >= fadeMs
          ? 0
          : intensities[ty][tx] * Math.max(0, 1 - elapsed / fadeMs);
      if (boost > cur) {
        intensities[ty][tx] = boost;
        activatedAt[ty][tx] = now;
      }
    }

    function activateAt(clientX, clientY) {
      if (!grid) return;
      const rect = canvas.getBoundingClientRect();
      const cx = Math.floor((clientX - rect.left) / cellSize);
      const cy = Math.floor((clientY - rect.top) / cellSize);
      const sigma2 = 2.0 * 2.0;
      const span = 4;
      for (let j = -span; j <= span; j++) {
        for (let i = -span; i <= span; i++) {
          const d2 = i * i + j * j;
          activateCell(cx + i, cy + j, Math.exp(-d2 / (2 * sigma2)));
        }
      }
    }

    function loop(ts) {
      if (!grid) {
        raf = requestAnimationFrame(loop);
        return;
      }
      if (!state.last) state.last = ts;
      const dt = Math.min(0.05, (ts - state.last) / 1000);
      state.last = ts;

      const { cols, rows, intensities, taus, activatedAt } = grid;

      // Gentle idle breathing pulse so it never looks fully dead.
      if (idle) {
        state.idleT += dt;
        const t = state.idleT;
        const breath = (Math.sin(t * 0.5) * 0.5 + 0.5) * 0.1;
        const bx = Math.floor(cols / 2 + Math.sin(t * 0.27) * (cols * 0.3));
        const by = Math.floor(rows / 2 + Math.cos(t * 0.21) * (rows * 0.4));
        for (let j = -2; j <= 2; j++) {
          for (let i = -2; i <= 2; i++) {
            const d2 = i * i + j * j;
            activateCell(bx + i, by + j, Math.exp(-d2 / 8) * breath);
          }
        }
      }

      const now = performance.now();
      ctx.save();
      ctx.scale(state.dpr, state.dpr);
      ctx.clearRect(0, 0, state.width, state.height);
      ctx.globalAlpha = opacity;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const fadeMs = taus[y][x] * 2200;
          const elapsed = now - activatedAt[y][x];
          const v =
            elapsed >= fadeMs
              ? 0
              : intensities[y][x] * Math.max(0, 1 - elapsed / fadeMs);
          if (v <= 0.002) continue;
          ctx.fillStyle = `rgba(${acc.r}, ${acc.g}, ${acc.b}, ${(
            v * maxAccentAlpha
          ).toFixed(3)})`;
          ctx.fillRect(
            Math.floor(x * cellSize),
            Math.floor(y * cellSize),
            cellSize + 0.5,
            cellSize + 0.5,
          );
        }
      }

      ctx.globalAlpha = 1;
      ctx.restore();
      raf = requestAnimationFrame(loop);
    }

    const onPointerMove = (e) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        state.idleT = 0;
        activateAt(e.clientX, e.clientY);
      }
    };

    // Defer one frame so layout is settled.
    const setupId = requestAnimationFrame(() => {
      setup();
      raf = requestAnimationFrame(loop);
    });

    parent.addEventListener('pointermove', onPointerMove);

    const ro = new ResizeObserver(() => setup());
    ro.observe(parent);

    const observer = new MutationObserver(() => setup());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      cancelAnimationFrame(setupId);
      cancelAnimationFrame(raf);
      parent.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, accentColor, cellSize, opacity, maxAccentAlpha, idle, mobileDisabled]);
}
