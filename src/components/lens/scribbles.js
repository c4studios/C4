/*
 * The crayon scribbles that sit behind the painted word on /Lens: ten shapes
 * (star, heart, flower, spiral, lightning, cloud, squiggle, circle, crown,
 * sparkles), each a few wobbly passes of a crayon, drawn from a shuffled
 * pool so the same shape never repeats twice in a row. Ported unchanged from
 * the original Lens page (before 10 Sep 2026) when the paint stage was
 * rebuilt, because they were part of the original's charm.
 */
export const SCRIBBLE_SHAPES = [
  'star', 'heart', 'flower', 'spiral', 'lightning',
  'cloud', 'squiggle', 'circle', 'crown', 'sparkles'
];
let shapePool = [];
export function nextShape() {
  if (!shapePool.length) {
    shapePool = [...SCRIBBLE_SHAPES];
    for (let i = shapePool.length - 1; i > 0; i--) {
      const k = Math.floor(Math.random() * (i + 1));
      [shapePool[i], shapePool[k]] = [shapePool[k], shapePool[i]];
    }
  }
  return shapePool.pop();
}

function wb(x, y, a) {
  return [x + (Math.random() - 0.5) * a, y + (Math.random() - 0.5) * a];
}

export function makeScribble(cx, cy, w, h, type) {
  const p = [];
  const j = 6;
  /* Use half-extents so shapes fill the space properly */
  const hw = w * 0.5, hh = h * 0.5;

  if (type === 'star') {
    const pts = 5, R = hh * 0.95, r = R * 0.38;
    const verts = [];
    const rot = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    for (let i = 0; i < pts * 2; i++) {
      const a = (Math.PI / pts) * i + rot;
      const rad = i % 2 === 0 ? R : r;
      /* Stretch horizontally to fill wide viewBox */
      verts.push(wb(cx + Math.cos(a) * rad * (hw / hh) * 0.7, cy + Math.sin(a) * rad, j));
    }
    verts.push(verts[0]);
    let d = '';
    verts.forEach(([x, y], i) => { d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`; });
    p.push(d);
  }

  else if (type === 'heart') {
    const sx = hw * 0.75, sy = hh * 0.85;
    const ty = cy - sy * 0.3, by = cy + sy * 0.6;
    for (let pass = 0; pass < 2; pass++) {
      const off = pass * 3;
      const [mx, my] = wb(cx, ty, j + off);
      const [bx, bby] = wb(cx, by, j + off);
      p.push(`M ${mx} ${my} C ${cx - sx * 0.95 + (Math.random() - 0.5) * j} ${ty - sy * 0.7 + (Math.random() - 0.5) * j} ${cx - sx * 1.1 + (Math.random() - 0.5) * j} ${ty + sy * 0.45 + (Math.random() - 0.5) * j} ${bx} ${bby}`);
      p.push(`M ${bx} ${bby} C ${cx + sx * 1.1 + (Math.random() - 0.5) * j} ${ty + sy * 0.45 + (Math.random() - 0.5) * j} ${cx + sx * 0.95 + (Math.random() - 0.5) * j} ${ty - sy * 0.7 + (Math.random() - 0.5) * j} ${mx} ${my}`);
    }
  }

  else if (type === 'flower') {
    /* Doodle flower: closed oval/leaf petals with pointed tips, center circle */
    const petals = 7;
    const petalLen = hh * 0.85;
    const petalW = hw * 0.22;
    for (let pass = 0; pass < 2; pass++) {
      const drift = pass * 3;
      for (let i = 0; i < petals; i++) {
        const a = (Math.PI * 2 / petals) * i + (Math.random() - 0.5) * 0.12;
        const tipX = cx + Math.cos(a) * petalLen * (hw / hh) * 0.6 + drift;
        const tipY = cy + Math.sin(a) * petalLen + drift;
        const perpA = a + Math.PI / 2;
        const bulge = petalW * 1.1;
        /* Closed oval petal: center → tip via left bulge, tip → center via right bulge */
        const [cx0, cy0] = wb(cx + drift, cy + drift, j * 0.3);
        const [tx, ty] = wb(tipX, tipY, j * 0.7);
        const midLen = petalLen * 0.5;
        const cL1x = cx + Math.cos(a) * midLen * (hw/hh) * 0.6 + Math.cos(perpA) * bulge + drift + (Math.random()-0.5)*j;
        const cL1y = cy + Math.sin(a) * midLen + Math.sin(perpA) * bulge + drift + (Math.random()-0.5)*j;
        const cL2x = tipX + Math.cos(perpA) * bulge * 0.3 + (Math.random()-0.5)*j;
        const cL2y = tipY + Math.sin(perpA) * bulge * 0.3 + (Math.random()-0.5)*j;
        const cR1x = tipX - Math.cos(perpA) * bulge * 0.3 + (Math.random()-0.5)*j;
        const cR1y = tipY - Math.sin(perpA) * bulge * 0.3 + (Math.random()-0.5)*j;
        const cR2x = cx + Math.cos(a) * midLen * (hw/hh) * 0.6 - Math.cos(perpA) * bulge + drift + (Math.random()-0.5)*j;
        const cR2y = cy + Math.sin(a) * midLen - Math.sin(perpA) * bulge + drift + (Math.random()-0.5)*j;
        p.push(`M ${cx0} ${cy0} C ${cL1x} ${cL1y} ${cL2x} ${cL2y} ${tx} ${ty} C ${cR1x} ${cR1y} ${cR2x} ${cR2y} ${cx0} ${cy0}`);
      }
    }
    /* Center circle */
    const cr = hh * 0.16;
    for (let pass = 0; pass < 2; pass++) {
      let cd = '';
      const segs = 12;
      for (let s = 0; s <= segs; s++) {
        const a = (Math.PI * 2 / segs) * s;
        const [fx, fy] = wb(cx + Math.cos(a) * cr * (hw/hh) * 0.5 + pass*2, cy + Math.sin(a) * cr + pass*2, 2.5);
        cd += s === 0 ? `M ${fx} ${fy}` : ` L ${fx} ${fy}`;
      }
      p.push(cd);
    }
  }

  else if (type === 'spiral') {
    const turns = 2.5;
    const steps = 55;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a = t * turns * Math.PI * 2;
      const rx = t * hw * 0.9;
      const ry = t * hh * 0.9;
      const [px, py] = wb(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, j * t * 0.6);
      d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
    }
    p.push(d);
  }

  else if (type === 'lightning') {
    /* Classic ⚡ bolt outline — angular Z-shape with horizontal notch through center */
    const bw = hw * 0.65, bh = hh * 0.95;
    /*
     * Traces the outline of a classic bolt:
     *   1 (top) → 2 (left-of-center) → 3 (notch sticks out right) →
     *   4 (bottom) → 5 (right-of-center) → 6 (notch sticks out left) → close
     *
     * The key is the horizontal notch across the middle is WIDE
     * and the bolt leans slightly left-to-right top-to-bottom
     */
    const bolt = [
      [cx + bw * 0.15, cy - bh],              /* 1: top point (slightly right) */
      [cx - bw * 0.65, cy - bh * 0.05],       /* 2: left edge at mid-height */
      [cx + bw * 0.1,  cy - bh * 0.15],       /* 3: notch juts RIGHT past center */
      [cx - bw * 0.15, cy + bh],              /* 4: bottom point (slightly left) */
      [cx + bw * 0.65, cy + bh * 0.05],       /* 5: right edge at mid-height */
      [cx - bw * 0.1,  cy + bh * 0.15],       /* 6: notch juts LEFT past center */
    ];
    for (let pass = 0; pass < 2; pass++) {
      let d = '';
      bolt.forEach(([x, y], i) => {
        const [wx, wy] = wb(x + pass * 4, y + pass * 3, j);
        d += i === 0 ? `M ${wx} ${wy}` : ` L ${wx} ${wy}`;
      });
      d += ' Z';
      p.push(d);
    }
  }

  else if (type === 'cloud') {
    /* Extra puffy cloud — big semicircle bumps using arcs */
    const cw2 = hw * 1.5, ch2 = hh * 1.0;
    const baseY = cy + ch2 * 0.2;
    /* 5 bumps with individual radii for puffiness */
    const bumps = [
      { x: -0.42, r: 0.38 }, { x: -0.2, r: 0.55 },
      { x: 0.02, r: 0.65 }, { x: 0.22, r: 0.5 }, { x: 0.42, r: 0.35 },
    ];
    for (let pass = 0; pass < 2; pass++) {
      const yo = pass * 4;
      let d = `M ${cx - cw2 * 0.55 + (Math.random()-0.5)*j} ${baseY + yo}`;
      bumps.forEach(b => {
        const bcx = cx + cw2 * b.x;
        const br = ch2 * b.r;
        /* Big puffy arc over each bump */
        const arcR = cw2 * 0.14;
        const left = bcx - arcR;
        const right = bcx + arcR;
        const peakY = baseY - br * 2.2 + yo;
        /* Two control points pushed high for rounder arc */
        const [c1x, c1y] = wb(left - arcR * 0.3, peakY - br * 0.5, j);
        const [c2x, c2y] = wb(right + arcR * 0.3, peakY - br * 0.5, j);
        d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${right + (Math.random()-0.5)*j} ${baseY + yo + (Math.random()-0.5)*3}`;
      });
      /* Flat bottom close */
      d += ` L ${cx - cw2 * 0.55 + (Math.random()-0.5)*j} ${baseY + yo}`;
      p.push(d);
    }
  }

  else if (type === 'squiggle') {
    const y0 = cy + hh * 0.6;
    const amp = hh * 0.25;
    const freq = 3 + Math.floor(Math.random() * 2);
    const lx = cx - hw * 0.95, rx = cx + hw * 0.95;
    for (let pass = 0; pass < 3; pass++) {
      const steps = 28;
      let d = '';
      const yOff = pass * 5;
      const phaseOff = pass * 0.7;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const px = lx + (rx - lx) * t + (Math.random() - 0.5) * 3;
        const py = y0 + yOff + Math.sin(t * Math.PI * 2 * freq + phaseOff) * amp + (Math.random() - 0.5) * j;
        d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
      }
      p.push(d);
    }
  }

  else if (type === 'circle') {
    for (let pass = 0; pass < 2; pass++) {
      const rx = hw * 0.85 + pass * 5;
      const ry = hh * 0.85 + pass * 5;
      const segs = 18;
      let d = '';
      const off = pass * 0.4;
      for (let i = 0; i <= segs + 2; i++) {
        const a = (Math.PI * 2 / segs) * i + off;
        const [px, py] = wb(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, j * 1.5);
        d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
      }
      p.push(d);
    }
  }

  else if (type === 'crown') {
    /* Crown matching reference: 3 pointed peaks, smooth concave U-valleys, flared base, ball tips */
    const cw2 = hw * 1.5, ch2 = hh * 1.0;
    const baseY = cy + ch2 * 0.4;
    const topY = cy - ch2 * 0.55;
    const valleyY = cy + ch2 * 0.12;  /* valleys dip well below center */
    /* Peak X positions */
    const lPeak = cx - cw2 * 0.36;
    const cPeak = cx;
    const rPeak = cx + cw2 * 0.36;
    /* Outer edges — wider than peaks (flared) */
    const lEdge = cx - cw2 * 0.56;
    const rEdge = cx + cw2 * 0.56;
    for (let pass = 0; pass < 2; pass++) {
      const d0 = pass * 3;
      const [bLx, bLy] = wb(lEdge + d0, baseY + d0, j);
      const [bRx, bRy] = wb(rEdge + d0, baseY + d0, j);
      /* Left side: base-left curves up to left peak */
      const [lPkx, lPky] = wb(lPeak + d0, topY + ch2 * 0.12 + d0, j);
      /* Valley 1: between left and center peaks — control point at bottom of valley */
      const v1x = (lPeak + cPeak) / 2 + d0 + (Math.random()-0.5)*j;
      const v1y = valleyY + d0 + (Math.random()-0.5)*j;
      /* Center peak */
      const [cPkx, cPky] = wb(cPeak + d0, topY + d0, j);
      /* Valley 2: between center and right peaks */
      const v2x = (cPeak + rPeak) / 2 + d0 + (Math.random()-0.5)*j;
      const v2y = valleyY + d0 + (Math.random()-0.5)*j;
      /* Right peak */
      const [rPkx, rPky] = wb(rPeak + d0, topY + ch2 * 0.12 + d0, j);

      /* Build with cubic beziers for smoother U-valleys */
      let d = `M ${bLx} ${bLy}`;
      /* Left edge curves inward then up to left peak */
      const lCtrl1x = lEdge - cw2*0.02 + d0 + (Math.random()-0.5)*j;
      const lCtrl1y = valleyY - ch2*0.1 + d0 + (Math.random()-0.5)*j;
      d += ` Q ${lCtrl1x} ${lCtrl1y} ${lPkx} ${lPky}`;
      /* Left peak → valley → center peak (cubic for smooth U) */
      d += ` C ${lPkx + (Math.random()-0.5)*j} ${valleyY - ch2*0.15 + d0} ${v1x - cw2*0.06} ${v1y} ${v1x} ${v1y}`;
      d += ` C ${v1x + cw2*0.06} ${v1y} ${cPkx + (Math.random()-0.5)*j} ${valleyY - ch2*0.15 + d0} ${cPkx} ${cPky}`;
      /* Center peak → valley → right peak */
      d += ` C ${cPkx + (Math.random()-0.5)*j} ${valleyY - ch2*0.15 + d0} ${v2x - cw2*0.06} ${v2y} ${v2x} ${v2y}`;
      d += ` C ${v2x + cw2*0.06} ${v2y} ${rPkx + (Math.random()-0.5)*j} ${valleyY - ch2*0.15 + d0} ${rPkx} ${rPky}`;
      /* Right peak down to base-right */
      const rCtrl1x = rEdge + cw2*0.02 + d0 + (Math.random()-0.5)*j;
      const rCtrl1y = valleyY - ch2*0.1 + d0 + (Math.random()-0.5)*j;
      d += ` Q ${rCtrl1x} ${rCtrl1y} ${bRx} ${bRy}`;
      /* Flat-ish base back to start */
      const [bMx, bMy] = wb(cx + d0, baseY + ch2 * 0.06 + d0, j * 0.3);
      d += ` Q ${bMx} ${bMy} ${bLx} ${bLy}`;
      p.push(d);
    }
    /* Circles on each peak tip */
    const peakXs = [lPeak, cPeak, rPeak];
    const peakYs = [topY + ch2*0.12, topY, topY + ch2*0.12];
    for (let i = 0; i < 3; i++) {
      const dr = ch2 * 0.09;
      let dd = '';
      for (let s = 0; s <= 12; s++) {
        const a = (Math.PI * 2 / 12) * s;
        const [fx, fy] = wb(peakXs[i] + Math.cos(a) * dr * (hw/hh) * 0.5, peakYs[i] - dr * 1.5 + Math.sin(a) * dr, 2);
        dd += s === 0 ? `M ${fx} ${fy}` : ` L ${fx} ${fy}`;
      }
      p.push(dd);
    }
    /* Band stripe near base */
    const bandY = baseY - ch2 * 0.07;
    for (let pass = 0; pass < 2; pass++) {
      const by = bandY + pass * (ch2 * 0.06);
      const [blx2, bly2] = wb(lEdge + cw2*0.03, by, 3);
      const [brx2, bry2] = wb(rEdge - cw2*0.03, by, 3);
      p.push(`M ${blx2} ${bly2} L ${brx2} ${bry2}`);
    }
  }

  else if (type === 'sparkles') {
    /* Random scatter of 4-6 sparkles across the word area */
    const count = 4 + Math.floor(Math.random() * 3); /* 4-6 */
    for (let i = 0; i < count; i++) {
      const sx = cx + (Math.random() - 0.5) * hw * 1.8;
      const sy = cy + (Math.random() - 0.5) * hh * 1.6;
      const sz = hh * (0.14 + Math.random() * 0.22);
      const szx = sz * (hw / hh) * 0.5;
      /* Vertical spike */
      p.push(`M ${sx} ${sy - sz} Q ${sx + (Math.random()-0.5)*5} ${sy} ${sx} ${sy + sz}`);
      /* Horizontal spike */
      p.push(`M ${sx - szx} ${sy} Q ${sx} ${sy + (Math.random()-0.5)*5} ${sx + szx} ${sy}`);
      /* Diagonal ticks */
      const d1 = sz * 0.4;
      const d1x = d1 * (hw / hh) * 0.4;
      p.push(`M ${sx - d1x} ${sy - d1} Q ${sx + (Math.random()-0.5)*3} ${sy + (Math.random()-0.5)*3} ${sx + d1x} ${sy + d1}`);
      p.push(`M ${sx + d1x} ${sy - d1} Q ${sx + (Math.random()-0.5)*3} ${sy + (Math.random()-0.5)*3} ${sx - d1x} ${sy + d1}`);
    }
  }

  return p;
}
