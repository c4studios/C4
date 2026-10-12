#!/usr/bin/env node
/**
 * Draw public/favicon.png: the 4 on its own, from the real mark's points.
 *
 * The shapes are read out of src/components/logo-design/geometry.js
 * (MARK_SOURCE.fourBody and .fourArm, copied there from C4Logo.jsx), so the
 * icon can't drift from the logo. Colours are the lockup's deep pair, the
 * ones the old favicon used: red #A30000, green #22632F, on transparent.
 *
 * The 4 fills the square top to bottom with a hairline margin (1.5% a side),
 * so in a real 16-pixel tab it draws about 15.5 pixels tall, which is what
 * /logo-design says ("sixteen pixels"). The old file was 2850 x 2260 with
 * wide padding, so a tab squeezed it to about 9 pixels.
 *
 * usage: node scripts/draw-favicon.mjs   (writes public/favicon.png, 512 x 512)
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SIZE = 512;
const MARGIN = 0.015;
const RED = '#A30000';
const GREEN = '#22632F';

const geo = fs.readFileSync(path.resolve('src/components/logo-design/geometry.js'), 'utf8');
const grab = (key) => {
  const m = geo.match(new RegExp(`${key}: '([^']+)'`));
  if (!m) throw new Error(`${key} not found in geometry.js`);
  return m[1].trim().split(/\s+/).map(Number);
};
const body = grab('fourBody');
const arm = grab('fourArm');

const all = [...body, ...arm];
const xs = all.filter((_, i) => i % 2 === 0);
const ys = all.filter((_, i) => i % 2 === 1);
const box = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };

const s = (SIZE * (1 - 2 * MARGIN)) / Math.max(box.w, box.h);
const ox = (SIZE - box.w * s) / 2 - box.x * s;
const oy = (SIZE - box.h * s) / 2 - box.y * s;
const pts = (n) => {
  const out = [];
  for (let i = 0; i < n.length; i += 2) out.push(`${(n[i] * s + ox).toFixed(3)},${(n[i + 1] * s + oy).toFixed(3)}`);
  return out.join(' ');
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<polygon fill="${RED}" points="${pts(body)}"/>
<polygon fill="${GREEN}" points="${pts(arm)}"/>
</svg>`;

const out = path.resolve('public/favicon.png');
await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: false }).toFile(out);
console.log(`favicon.png ${SIZE}x${SIZE}: 4 is ${(box.h * s).toFixed(1)} of ${SIZE} tall (${((box.h * s) / SIZE * 16).toFixed(2)} px at 16)`);
