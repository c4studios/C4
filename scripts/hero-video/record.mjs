/* Render the C4Site hero to MP4 with real motion blur and a sound track.
   Picture: each output frame is the average of SUB renders spread across a
   180 degree shutter (half the frame interval), seeked from the engine's own
   clock, so movement smears the way a camera records it.
   Sound: the engine lists its own events (landings, rings, camera moves);
   mosaic-audio.mjs turns that list into a WAV, and ffmpeg muxes the two.
   Outputs: <name>.mp4 (with sound) and <name>-silent.mp4. */
import fs from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { synth } from './audio.mjs';
import { chromium } from 'playwright';
const OUT = process.env.OUT || 'hero-video-out';
fs.mkdirSync(OUT, { recursive: true });
const JOBS = (process.env.JOBS || '1920x1080@60,1080x1920@30').split(',').map((j) => {
  const [size, fps] = j.split('@');
  const [w, h] = size.split('x').map(Number);
  return { w, h, fps: Number(fps) };
});
const HOLD = 2.0; /* seconds on the last frame */
const SHUTTER = 0.5; /* fraction of the frame interval the shutter is open */

const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--headless=new', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=d3d11'] });
for (const { w, h, fps } of JOBS) {
  const SUB = Number(process.env.SUB || (fps >= 50 ? 6 : 10));
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(`${process.env.C4_BASE || 'http://localhost:5199'}/Foresight?mosaic=record`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.__siteMosaic && window.__siteMosaic.duration > 0 && !document.getElementById('c4-boot'), null, { timeout: 20000 });
  await p.addStyleTag({ content: `
    .sg-mosaic { position: fixed !important; inset: 0 !important; height: 100vh !important; width: 100vw !important; z-index: 2147483000 !important; }
    .sg-mosaic::after, .sg-mosaic-replay { display: none !important; }
  ` });
  await p.waitForTimeout(800); /* the engine re-plans for the new stage size */
  const { dur, cues } = await p.evaluate(() => ({ dur: window.__siteMosaic.duration, cues: window.__siteMosaic.cues }));
  await p.evaluate(() => {
    const c = document.querySelector('.sg-mosaic-canvas');
    const acc = document.createElement('canvas');
    acc.width = c.width;
    acc.height = c.height;
    window.__acc = acc;
    window.__accCtx = acc.getContext('2d', { alpha: false });
  });
  const total = Math.round((dur + HOLD) * fps);
  const base = `${OUT}/C4Site-hero-${w}x${h}`;
  const silent = `${base}-silent.mp4`;
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-r', String(fps), silent]);
  let ffErr = '';
  ff.stderr.on('data', (d) => { ffErr += d; });
  const done = new Promise((res) => ff.on('close', res));
  const t0 = Date.now();
  for (let i = 0; i < total; i++) {
    const t = i / fps;
    const b64 = await p.evaluate(({ tt, sub, span, end }) => {
      const e = window.__siteMosaic;
      const c = document.querySelector('.sg-mosaic-canvas');
      const a = window.__accCtx;
      for (let k = 0; k < sub; k++) {
        e.seek(Math.min(end, tt + (k / sub) * span));
        a.globalAlpha = 1 / (k + 1);
        a.drawImage(c, 0, 0);
      }
      return window.__acc.toDataURL('image/jpeg', 0.95).split(',')[1];
    }, { tt: t, sub: SUB, span: SHUTTER / fps, end: dur });
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  const code = await done;

  /* sound */
  const wav = `${base}.wav`;
  const stats = synth({ cues, duration: dur + HOLD, end: dur, file: wav });
  fs.writeFileSync(`${base}-cues.json`, JSON.stringify({ duration: dur, cues }, null, 1));
  const mux = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', wav, '-c:v', 'copy', '-af', 'loudnorm=I=-18:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', `${base}.mp4`]);
  const size = fs.existsSync(`${base}.mp4`) ? fs.statSync(`${base}.mp4`).size : 0;
  console.log(JSON.stringify({ file: `${base}.mp4`, frames: total, fps, sub: SUB, seconds: +(total / fps).toFixed(2), exit: code, muxExit: mux.status, mb: +(size / 1048576).toFixed(2), renderSec: Math.round((Date.now() - t0) / 1000), cues: cues.length, audio: stats, ffErr: (ffErr + String(mux.stderr || '')).slice(0, 300) }));
  await ctx.close();
}
await b.close();
