/* Sample the camera pose at every 60fps frame and look for the two things an
   eye reads as a stutter: a halt in the middle of a move (speed drops to ~0
   between moving frames) and a jump (speed changes by a large step in one
   frame). Speed is in screen px per frame: pan, zoom and roll all converted
   to how far a point at the edge of the stage moves. */
import { chromium } from 'playwright';
const [w, h] = (process.env.SIZE || '1920x1080').split('x').map(Number);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: h } });
const errs = [];
p.on('pageerror', (e) => errs.push(String(e).slice(0, 300)));
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
await p.goto(`${process.env.C4_BASE || 'http://localhost:5199'}/Foresight?mosaic=record`, { waitUntil: 'networkidle' });
await p.waitForFunction(() => window.__siteMosaic && window.__siteMosaic.duration > 0 && !document.getElementById('c4-boot'), null, { timeout: 20000 });
if (process.env.FULL) {
  await p.addStyleTag({ content: '.sg-mosaic { position: fixed !important; inset: 0 !important; height: 100vh !important; width: 100vw !important; z-index: 2147483000 !important; }' });
  await p.waitForTimeout(800);
}
const out = await p.evaluate(() => {
  const e = window.__siteMosaic;
  const dur = e.duration;
  const poses = [];
  for (let i = 0; i <= Math.round(dur * 60); i++) { e.seek(i / 60); const c = e.pose; poses.push([c.x, c.y, c.z, c.r]); }
  return { dur, poses, W: document.querySelector('.sg-mosaic').clientWidth, H: document.querySelector('.sg-mosaic').clientHeight };
});
const R = Math.hypot(out.W, out.H) / 2;
const v = [];
for (let i = 1; i < out.poses.length; i++) {
  const [x0, y0, z0, r0] = out.poses[i - 1];
  const [x1, y1, z1, r1] = out.poses[i];
  const z = (z0 + z1) / 2;
  v.push(Math.hypot((x1 - x0) * z, (y1 - y0) * z, Math.log(z1 / z0) * R, (r1 - r0) * R));
}
/* a halt: a near-still frame with clearly moving frames on both sides within 12 frames */
const halts = [];
for (let i = 12; i < v.length - 12; i++) {
  if (v[i] > 0.6) continue;
  const before = Math.max(...v.slice(i - 12, i));
  const after = Math.max(...v.slice(i + 1, i + 13));
  if (before > 6 && after > 6) halts.push(+(i / 60).toFixed(2));
}
const jumps = [];
for (let i = 1; i < v.length; i++) if (Math.abs(v[i] - v[i - 1]) > 6) jumps.push([+(i / 60).toFixed(2), +v[i - 1].toFixed(1), +v[i].toFixed(1)]);
const first4 = v.slice(0, 240).map((s) => s.toFixed(1)).join(' ');
console.log(JSON.stringify({ stage: `${out.W}x${out.H}`, duration: +out.dur.toFixed(2), maxSpeed: +Math.max(...v).toFixed(1), halts, jumps: jumps.slice(0, 20), errs }, null, 1));
console.log('speed px/frame, first 4s:\n' + first4);
await b.close();
