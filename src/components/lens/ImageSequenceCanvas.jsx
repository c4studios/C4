/**
 * ImageSequenceCanvas — Scroll-driven morph animation
 *
 * Camera lens → Glasses → Human eye
 * Uses GSAP ScrollTrigger for scroll progress (Lenis-safe).
 *
 * Supports two modes:
 * 1. Procedural (default) — Canvas 2D drawing functions
 * 2. Image sequence — Drop PNG frames in /public/lens-frames/ and pass frameCount prop
 */
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Helpers ── */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smoothstep = (lo, hi, t) => {
  const x = clamp((t - lo) / (hi - lo), 0, 1);
  return x * x * (3 - 2 * x);
};

/* ══════════════════════════════════════════════════════════
   DRAWING FUNCTIONS — Photorealistic procedural renders
   ══════════════════════════════════════════════════════════ */

function drawCameraLens(ctx, cx, cy, r, alpha) {
  if (alpha <= 0) return;
  ctx.globalAlpha = alpha;

  // ── Outer barrel (machined aluminium) ──
  const barrelW = r * 0.08;
  for (let i = 0; i < 3; i++) {
    const ringR = r - i * barrelW * 0.4;
    const grad = ctx.createLinearGradient(cx - ringR, cy - ringR, cx + ringR, cy + ringR);
    grad.addColorStop(0, '#4a4d56');
    grad.addColorStop(0.25, '#6a6d76');
    grad.addColorStop(0.45, '#8a8d96');
    grad.addColorStop(0.55, '#6a6d76');
    grad.addColorStop(0.75, '#4a4d56');
    grad.addColorStop(1, '#3a3d46');
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = grad;
    ctx.lineWidth = barrelW;
    ctx.stroke();
  }

  // Focus ring knurling
  const knurlR = r * 0.96;
  for (let i = 0; i < 80; i++) {
    const a = (i / 80) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (knurlR - 3), cy + Math.sin(a) * (knurlR - 3));
    ctx.lineTo(cx + Math.cos(a) * (knurlR + 3), cy + Math.sin(a) * (knurlR + 3));
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(20,22,28,0.4)' : 'rgba(80,82,88,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // ── Glass element ──
  const glassR = r * 0.76;
  const glassGrad = ctx.createRadialGradient(cx - glassR * 0.2, cy - glassR * 0.2, 0, cx, cy, glassR);
  glassGrad.addColorStop(0, '#1a1430');
  glassGrad.addColorStop(0.3, '#12102a');
  glassGrad.addColorStop(0.6, '#0d0b22');
  glassGrad.addColorStop(1, '#08061a');
  ctx.beginPath();
  ctx.arc(cx, cy, glassR, 0, Math.PI * 2);
  ctx.fillStyle = glassGrad;
  ctx.fill();

  // Inner barrel rim
  ctx.beginPath();
  ctx.arc(cx, cy, glassR, 0, Math.PI * 2);
  ctx.strokeStyle = '#1a1c22';
  ctx.lineWidth = 3;
  ctx.stroke();

  // ── Aperture blades ──
  const bladeCount = 9;
  const apertureR = glassR * 0.35;
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < bladeCount; i++) {
    const a1 = (i / bladeCount) * Math.PI * 2 - 0.12;
    const a2 = ((i + 0.82) / bladeCount) * Math.PI * 2 - 0.12;
    const outerR = glassR * 0.7;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a1) * apertureR, Math.sin(a1) * apertureR);
    ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
    ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
    ctx.lineTo(Math.cos(a2) * apertureR, Math.sin(a2) * apertureR);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? '#0a0812' : '#0e0c18';
    ctx.fill();
    ctx.strokeStyle = 'rgba(60,55,80,0.25)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  ctx.restore();

  // Aperture center glow
  const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, apertureR * 1.2);
  centerGlow.addColorStop(0, 'rgba(30,20,50,0.8)');
  centerGlow.addColorStop(0.5, 'rgba(15,10,30,0.6)');
  centerGlow.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(cx, cy, apertureR * 1.2, 0, Math.PI * 2);
  ctx.fillStyle = centerGlow;
  ctx.fill();

  // ── Lens coatings (multi-coloured reflections) ──
  // Blue-purple coating — brighter for visibility
  const coat1 = ctx.createRadialGradient(cx - glassR * 0.3, cy - glassR * 0.25, 0, cx - glassR * 0.3, cy - glassR * 0.25, glassR * 0.7);
  coat1.addColorStop(0, 'rgba(80,120,255,0.22)');
  coat1.addColorStop(0.4, 'rgba(140,80,220,0.12)');
  coat1.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(cx, cy, glassR, 0, Math.PI * 2);
  ctx.fillStyle = coat1;
  ctx.fill();

  // Warm coating bottom-right
  const coat2 = ctx.createRadialGradient(cx + glassR * 0.25, cy + glassR * 0.2, 0, cx + glassR * 0.25, cy + glassR * 0.2, glassR * 0.5);
  coat2.addColorStop(0, 'rgba(255,160,80,0.14)');
  coat2.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(cx, cy, glassR, 0, Math.PI * 2);
  ctx.fillStyle = coat2;
  ctx.fill();

  // ── Specular highlight ──
  const specX = cx - glassR * 0.28;
  const specY = cy - glassR * 0.32;
  const specR = glassR * 0.18;
  const specGrad = ctx.createRadialGradient(specX, specY, 0, specX, specY, specR);
  specGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
  specGrad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
  specGrad.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(specX, specY, specR, 0, Math.PI * 2);
  ctx.fillStyle = specGrad;
  ctx.fill();

  // Barrel text
  ctx.font = `500 ${Math.max(9, r * 0.04)}px "Inter", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(160,162,168,0.35)`;
  ctx.fillText('C4 LENS  50mm  ƒ/1.4', cx, cy + r * 1.15);

  ctx.globalAlpha = 1;
}

function drawGlasses(ctx, cx, cy, r, alpha) {
  if (alpha <= 0) return;
  ctx.globalAlpha = alpha;

  const sep = r * 1.15;
  const lensW = r * 0.55;
  const lensH = r * 0.5;
  const rad = lensW * 0.35;
  const thick = Math.max(2.5, r * 0.04);

  const frameCol = '#3a3842';
  const frameLite = '#5a5762';

  // Draw each lens
  [-1, 1].forEach((side) => {
    const lx = cx + side * sep * 0.5;

    // Frame outline
    ctx.beginPath();
    roundedRect(ctx, lx - lensW, cy - lensH, lensW * 2, lensH * 2, rad);
    ctx.strokeStyle = frameCol;
    ctx.lineWidth = thick;
    ctx.stroke();

    // Top highlight
    ctx.beginPath();
    ctx.moveTo(lx - lensW + rad, cy - lensH);
    ctx.lineTo(lx + lensW - rad, cy - lensH);
    ctx.strokeStyle = frameLite;
    ctx.lineWidth = thick * 0.4;
    ctx.stroke();

    // Glass fill — subtle blue tint, slightly brighter
    const gGrad = ctx.createRadialGradient(lx - lensW * 0.15, cy - lensH * 0.2, 0, lx, cy, lensW * 1.1);
    gGrad.addColorStop(0, 'rgba(160,180,210,0.14)');
    gGrad.addColorStop(0.5, 'rgba(100,120,150,0.08)');
    gGrad.addColorStop(1, 'rgba(60,70,90,0.04)');
    ctx.beginPath();
    roundedRect(ctx, lx - lensW, cy - lensH, lensW * 2, lensH * 2, rad);
    ctx.fillStyle = gGrad;
    ctx.fill();

    // Reflection streak
    ctx.save();
    ctx.beginPath();
    roundedRect(ctx, lx - lensW, cy - lensH, lensW * 2, lensH * 2, rad);
    ctx.clip();
    const streak = ctx.createLinearGradient(lx - lensW, cy - lensH, lx + lensW * 0.6, cy + lensH);
    streak.addColorStop(0, 'rgba(255,255,255,0.04)');
    streak.addColorStop(0.35, 'rgba(255,255,255,0.1)');
    streak.addColorStop(0.4, 'rgba(255,255,255,0.02)');
    streak.addColorStop(1, 'transparent');
    ctx.fillStyle = streak;
    ctx.fillRect(lx - lensW, cy - lensH, lensW * 2, lensH * 2);
    ctx.restore();
  });

  // Bridge
  ctx.beginPath();
  const bridgeL = cx - sep * 0.5 + lensW;
  const bridgeR = cx + sep * 0.5 - lensW;
  ctx.moveTo(bridgeL, cy - lensH * 0.15);
  ctx.bezierCurveTo(
    lerp(bridgeL, bridgeR, 0.3), cy - lensH * 0.5,
    lerp(bridgeL, bridgeR, 0.7), cy - lensH * 0.5,
    bridgeR, cy - lensH * 0.15
  );
  ctx.strokeStyle = frameCol;
  ctx.lineWidth = thick;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Temple arms
  const armLen = r * 1.2;
  [-1, 1].forEach((side) => {
    const startX = cx + side * (sep * 0.5 + lensW);
    ctx.beginPath();
    ctx.moveTo(startX, cy - lensH * 0.2);
    ctx.bezierCurveTo(
      startX + side * armLen * 0.35, cy - lensH * 0.1,
      startX + side * armLen * 0.7, cy + lensH * 0.05,
      startX + side * armLen, cy + lensH * 0.2
    );
    ctx.strokeStyle = frameCol;
    ctx.lineWidth = thick * 0.8;
    ctx.stroke();

    // Arm tip (thicker)
    const tipX = startX + side * armLen;
    const tipY = cy + lensH * 0.2;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX + side * armLen * 0.12, tipY + lensH * 0.15);
    ctx.strokeStyle = frameCol;
    ctx.lineWidth = thick * 1.2;
    ctx.lineCap = 'round';
    ctx.stroke();
  });

  // Nose pads
  [-1, 1].forEach((side) => {
    ctx.beginPath();
    ctx.ellipse(cx + side * sep * 0.08, cy + lensH * 0.2, r * 0.02, r * 0.035, side * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(190,188,195,0.4)';
    ctx.fill();
  });

  ctx.globalAlpha = 1;
}

function drawEye(ctx, cx, cy, r, alpha) {
  if (alpha <= 0) return;
  ctx.globalAlpha = alpha;

  const eyeW = r * 1.4;
  const eyeH = r * 0.55;

  // ── Skin around the eye ──
  const skinGrad = ctx.createRadialGradient(cx, cy, eyeW * 0.5, cx, cy, eyeW * 2);
  skinGrad.addColorStop(0, 'rgba(70,55,45,0.18)');
  skinGrad.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.ellipse(cx, cy, eyeW * 1.6, eyeH * 2.8, 0, 0, Math.PI * 2);
  ctx.fillStyle = skinGrad;
  ctx.fill();

  // Upper eyelid crease
  ctx.beginPath();
  ctx.moveTo(cx - eyeW * 1.05, cy - eyeH * 0.15);
  ctx.bezierCurveTo(cx - eyeW * 0.4, cy - eyeH * 1.9, cx + eyeW * 0.4, cy - eyeH * 1.9, cx + eyeW * 1.05, cy - eyeH * 0.15);
  ctx.strokeStyle = `rgba(55,42,35,0.3)`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ── Eye shape (almond) — clip ──
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - eyeW, cy);
  ctx.bezierCurveTo(cx - eyeW * 0.45, cy - eyeH * 1.45, cx + eyeW * 0.45, cy - eyeH * 1.45, cx + eyeW, cy);
  ctx.bezierCurveTo(cx + eyeW * 0.45, cy + eyeH * 1.45, cx - eyeW * 0.45, cy + eyeH * 1.45, cx - eyeW, cy);
  ctx.closePath();
  ctx.clip();

  // Sclera
  const scGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeW);
  scGrad.addColorStop(0, '#f5f0eb');
  scGrad.addColorStop(0.5, '#eae2da');
  scGrad.addColorStop(1, '#d2c8be');
  ctx.fillStyle = scGrad;
  ctx.fillRect(cx - eyeW, cy - eyeH * 1.5, eyeW * 2, eyeH * 3);

  // Faint blood vessels (deterministic)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const startDist = eyeW * 0.7;
    const sx = cx + Math.cos(angle) * startDist;
    const sy = cy + Math.sin(angle) * startDist * 0.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(
      sx - Math.cos(angle) * 12 + Math.sin(i) * 5, sy - Math.sin(angle) * 6,
      sx - Math.cos(angle) * 20 + Math.cos(i * 2) * 8, sy - Math.sin(angle) * 10,
      sx - Math.cos(angle) * 28, sy - Math.sin(angle) * 14
    );
    ctx.strokeStyle = `rgba(190,85,75,0.06)`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  // ── Iris ──
  const irisR = r * 0.36;

  // Outer iris
  const irisGrad = ctx.createRadialGradient(cx, cy, irisR * 0.25, cx, cy, irisR);
  irisGrad.addColorStop(0, '#6a4825');
  irisGrad.addColorStop(0.3, '#7a5830');
  irisGrad.addColorStop(0.55, '#5a3d1e');
  irisGrad.addColorStop(0.8, '#3a2812');
  irisGrad.addColorStop(1, '#1e160a');
  ctx.beginPath();
  ctx.arc(cx, cy, irisR, 0, Math.PI * 2);
  ctx.fillStyle = irisGrad;
  ctx.fill();

  // Iris fibres
  for (let i = 0; i < 80; i++) {
    const a = (i / 80) * Math.PI * 2;
    const innerDist = irisR * 0.25;
    const outerDist = irisR * (0.82 + Math.sin(i * 4.3) * 0.08);
    const wobble = Math.sin(i * 3.1) * irisR * 0.02;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * innerDist, cy + Math.sin(a) * innerDist);
    ctx.lineTo(cx + Math.cos(a + 0.015) * outerDist + wobble, cy + Math.sin(a + 0.015) * outerDist);
    const b = 55 + (i * 7) % 45;
    ctx.strokeStyle = `rgba(${b + 35},${b + 10},${b - 15},0.13)`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  // Colour ring
  const colRing = ctx.createRadialGradient(cx, cy, irisR * 0.3, cx, cy, irisR * 0.65);
  colRing.addColorStop(0, 'rgba(150,110,55,0.2)');
  colRing.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(cx, cy, irisR * 0.65, 0, Math.PI * 2);
  ctx.fillStyle = colRing;
  ctx.fill();

  // Limbal ring (dark edge)
  ctx.beginPath();
  ctx.arc(cx, cy, irisR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(15,10,5,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // ── Pupil ──
  const pupilR = irisR * 0.36;
  const pupilGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pupilR);
  pupilGrad.addColorStop(0, '#030208');
  pupilGrad.addColorStop(0.85, '#050310');
  pupilGrad.addColorStop(1, '#0a0818');
  ctx.beginPath();
  ctx.arc(cx, cy, pupilR, 0, Math.PI * 2);
  ctx.fillStyle = pupilGrad;
  ctx.fill();

  // ── Catchlights ──
  // Primary — window reflection
  ctx.beginPath();
  ctx.ellipse(cx - pupilR * 0.4, cy - pupilR * 0.5, pupilR * 0.38, pupilR * 0.28, -0.15, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.78)';
  ctx.fill();

  // Secondary
  ctx.beginPath();
  ctx.arc(cx + pupilR * 0.45, cy + pupilR * 0.35, pupilR * 0.13, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fill();

  ctx.restore(); // un-clip the eye shape

  // ── Eyelid outlines ──
  // Upper lid
  ctx.beginPath();
  ctx.moveTo(cx - eyeW, cy);
  ctx.bezierCurveTo(cx - eyeW * 0.45, cy - eyeH * 1.45, cx + eyeW * 0.45, cy - eyeH * 1.45, cx + eyeW, cy);
  ctx.strokeStyle = `rgba(35,28,22,0.65)`;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Lower lid
  ctx.beginPath();
  ctx.moveTo(cx - eyeW, cy);
  ctx.bezierCurveTo(cx - eyeW * 0.45, cy + eyeH * 1.45, cx + eyeW * 0.45, cy + eyeH * 1.45, cx + eyeW, cy);
  ctx.strokeStyle = `rgba(35,28,22,0.4)`;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // ── Eyelashes (upper) ──
  for (let i = 0; i < 24; i++) {
    const t = i / 23;
    const lx = lerp(cx - eyeW * 0.88, cx + eyeW * 0.88, t);
    const ly = cy - eyeH * 1.38 * Math.sin(t * Math.PI);
    const angle = -Math.PI / 2 + (t - 0.5) * 0.7;
    const len = r * 0.055 * (0.5 + Math.sin(t * Math.PI) * 0.5);
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.quadraticCurveTo(
      lx + Math.cos(angle) * len * 0.6, ly + Math.sin(angle) * len * 0.6,
      lx + Math.cos(angle - 0.15) * len, ly + Math.sin(angle - 0.15) * len
    );
    ctx.strokeStyle = `rgba(20,15,10,0.55)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

/* ── Rounded rect helper ── */
function roundedRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ══════════════════════════════════════════════════════════
   MASTER DRAW — Composites all three objects with crossfade
   ══════════════════════════════════════════════════════════ */
function drawFrame(ctx, w, h, progress) {
  const cx = w / 2;
  const cy = h / 2;
  const baseR = Math.min(w, h) * 0.32; // Larger — fills more of the viewport

  ctx.clearRect(0, 0, w, h);

  // Ambient glow that shifts hue with progress
  const hue = lerp(240, 25, progress);
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 3);
  glow.addColorStop(0, `hsla(${hue}, 30%, 16%, 0.25)`);
  glow.addColorStop(0.3, `hsla(${hue}, 20%, 10%, 0.12)`);
  glow.addColorStop(0.6, `hsla(${hue}, 15%, 8%, 0.04)`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // ── Phase alphas using smoothstep — NO GAPS ──
  // Lens:    full 0-0.25, fade out 0.25-0.42
  // Glasses: fade in 0.2-0.38, full 0.38-0.58, fade out 0.58-0.75
  // Eye:     fade in 0.55-0.72, full 0.72-1.0
  const lensAlpha = 1 - smoothstep(0.25, 0.42, progress);
  const glassAlpha = smoothstep(0.2, 0.38, progress) * (1 - smoothstep(0.58, 0.75, progress));
  const eyeAlpha = smoothstep(0.55, 0.72, progress);

  // Scale animation — each object grows in and shrinks out
  const lensScale = lerp(1, 0.85, smoothstep(0.25, 0.42, progress));
  const glassScale = lerp(0.85, 1, smoothstep(0.2, 0.38, progress)) * lerp(1, 0.85, smoothstep(0.58, 0.75, progress));
  const eyeScale = lerp(0.85, 1, smoothstep(0.55, 0.72, progress));

  if (lensAlpha > 0.01) {
    drawCameraLens(ctx, cx, cy, baseR * lensScale, lensAlpha);
  }
  if (glassAlpha > 0.01) {
    drawGlasses(ctx, cx, cy, baseR * glassScale, glassAlpha);
  }
  if (eyeAlpha > 0.01) {
    drawEye(ctx, cx, cy, baseR * eyeScale, eyeAlpha);
  }

  // ── Phase label ──
  let label, labelAlpha;
  if (progress < 0.32) {
    label = 'THE LENS';
    labelAlpha = progress < 0.04 ? progress / 0.04 : progress > 0.25 ? 1 - (progress - 0.25) / 0.07 : 1;
  } else if (progress < 0.65) {
    label = 'THE VISION';
    labelAlpha = progress < 0.38 ? (progress - 0.32) / 0.06 : progress > 0.58 ? 1 - (progress - 0.58) / 0.07 : 1;
  } else {
    label = 'THE PERSPECTIVE';
    labelAlpha = progress < 0.72 ? (progress - 0.65) / 0.07 : 1;
  }

  ctx.globalAlpha = clamp(labelAlpha, 0, 1) * 0.5;
  ctx.font = `300 ${Math.max(11, w * 0.011)}px "Inter", sans-serif`;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '0.3em';
  ctx.fillStyle = '#ECE7DE';
  ctx.fillText(label, cx, cy + baseR * 1.45);
  ctx.globalAlpha = 1;
}

/* ══════════════════════════════════════════════════════════
   COMPONENT — Uses GSAP ScrollTrigger for Lenis-safe progress
   ══════════════════════════════════════════════════════════ */
export default function ImageSequenceCanvas({ scrollContainerRef, frameCount = 0, framePath = '/lens-frames/frame-', frameExt = '.jpg' }) {
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const rafRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const framesRef = useRef([]);

  // ── Preload image sequence if framePath provided ──
  useEffect(() => {
    if (frameCount <= 0) return;

    const images = [];
    let loaded = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const num = String(i).padStart(3, '0');
      img.src = `${framePath}${num}${frameExt}`;
      img.onload = () => {
        loaded++;
        if (loaded === frameCount) {
          framesRef.current = images;
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loaded++;
        // Still mark as loaded, just with a null frame
      };
      images.push(img);
    }
  }, [frameCount, framePath, frameExt]);

  const useImageSequence = frameCount > 0 && imagesLoaded;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    if (useImageSequence && framesRef.current.length > 0) {
      // Image sequence mode — draw the right frame
      const frameIndex = Math.min(
        Math.floor(progressRef.current * (framesRef.current.length - 1)),
        framesRef.current.length - 1
      );
      const img = framesRef.current[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.clearRect(0, 0, rect.width, rect.height);
        // Cover-fit the frame
        const scale = Math.max(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
        const sw = img.naturalWidth * scale;
        const sh = img.naturalHeight * scale;
        ctx.drawImage(img, (rect.width - sw) / 2, (rect.height - sh) / 2, sw, sh);
      }
    } else {
      // Procedural mode — draw the morph animation
      drawFrame(ctx, rect.width, rect.height, progressRef.current);
    }

    ctx.restore();
  }, [useImageSequence]);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    draw(); // initial frame at progress 0

    // Use GSAP ScrollTrigger — syncs with Lenis automatically
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0,
      onUpdate: (self) => {
        const p = clamp(self.progress, 0, 1);
        if (Math.abs(p - progressRef.current) > 0.0005) {
          progressRef.current = p;
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(draw);
        }
      },
    });

    // Also listen for native scroll as a fallback
    const updateFromScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;
      const scrollable = rect.height - window.innerHeight;
      const p = scrollable > 0 ? clamp(scrolled / scrollable, 0, 1) : 0;

      if (Math.abs(p - progressRef.current) > 0.001) {
        progressRef.current = p;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('scroll', updateFromScroll, { passive: true });

    const resizeObs = new ResizeObserver(() => {
      ScrollTrigger.refresh();
      draw();
    });
    resizeObs.observe(canvas);

    return () => {
      st.kill();
      window.removeEventListener('scroll', updateFromScroll);
      resizeObs.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw, scrollContainerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  );
}
