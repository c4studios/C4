/* Web cuts of the case-study media on /Lens (src/components/lens/LensWork.jsx,
   copy and file names in src/components/lens/lensStudies.js). The sibling of
   scripts/lens-motion.mjs, which still makes the Aqua-Safe film and the
   DS Racing reel.

   The masters live outside the repo and are never committed. Pass the folders
   that hold them; every flag is optional, and a job whose folder isn't passed
   is skipped, so after a re-capture you can remake one study alone:

     node scripts/lens-work.mjs \
       --captures <lens-masters/captures> \
       --hvn <hvn-website/frontend/public> \
       --sharp "<Sharp Bricklaying/images>" \
       --dsr <dsracingkarts/public> \
       [--only hvn-film,sharp-aerial-plan]

   Where each folder is on Caleb's PC (9 Oct 2026):
     --captures  C4-Internal/lens-masters/captures: the purpose-made recordings
                 of each live site (1440 x 900 at 60 fps, headless Chrome on
                 Playwright's paused clock), one folder per client with
                 raw/<name>-master.mp4 and the recording scripts in _tools/.
     --hvn       the HVN site repo's frontend/public (videos/hero-1.mp4, the
                 home page film; Coaches/DSC*.jpg, the coach portraits).
     --sharp     the Sharp Bricklaying site repo's images/ folder. Only the
                 21 to 27 April 2026 media is used, and only files the site's own
                 gallery shows (gallery/index.html), so every still is live there.
     --dsr       the DS Racing Karts site repo's public/ folder (the header
                 film and the Predator chassis clip).

   What it writes:
     public/lens-motion/<id>[-desktop|-phone].mp4
                 H.264 High@4.0, x264 slow, CRF 26 to 30 by source, a keyframe
                 every 2 s, BT.709 tags, faststart, no audio track (every one
                 of these plays muted, and none of their soundtracks has a
                 source on file), metadata stripped. Screen captures are cut
                 from 60 fps to 30. Where a capture's subject is small, the
                 phone gets its own crop instead of the whole desktop frame,
                 and each device fetches only its own cut (lensStudies.js says
                 which query picks which).
     public/lens-motion/<id>[...].webp
                 the poster, the frame at `poster` seconds into the cut, WebP
                 q82. The player starts the loop on that same frame, so the
                 still hands over without a jump. Keep `posterAt` in
                 lensStudies.js equal to what this prints.
     public/lens-motion/<id>-strip.webp
                 for the films with a scrubber only: the colour strip, sampled
                 ten times a second, each frame averaged to a 1 x 48 column
                 (the same recipe as lens-motion.mjs). Lossless WebP.
     public/lens-work/<study>/<name>-<w>.avif and .webp
                 stills, resized with sharp (Lanczos), AVIF q52 and WebP q76,
                 at each width in `widths` that the source can fill. The
                 provenance goes into the file's EXIF ImageDescription.
   Never public/lens/: on a Windows build that folder merges with the
   prerendered /Lens/ page (DESIGN.md).

   It prints each output's size and duration. Needs ffmpeg and ffprobe on PATH
   (or FFMPEG / FFPROBE set). Tested 9 Oct 2026 with ffmpeg 8.1 (gyan.dev full
   build) and sharp 0.34. */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const FFPROBE = process.env.FFPROBE || 'ffprobe';
const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const MOTION = path.join(PUBLIC, 'lens-motion');
const WORK = path.join(PUBLIC, 'lens-work');

/* ── The jobs ────────────────────────────────────────────────────────────
   Video:  { id, root, src, range?: [from, to] s of the master, poster: s into
           the cut, strip?, crf, tune, cuts: [{ suffix, vf }], pingpong? }
   Still:  { id, study, name, root, src, widths, crop?: { x, w } as fractions
           of the source width (full height), about } */
const JOBS = [
  /* HVN CrossFit: the home page film, four coach portraits, the chin-up game. */
  { id: 'hvn-film', root: 'hvn', src: 'videos/hero-1.mp4', poster: 1.4, strip: true, crf: 29, tune: 'film',
    cuts: [{ suffix: '', vf: '' }] },
  { id: 'hvn-chinup', root: 'captures', src: 'hvn-crossfit/raw/desktop-master.mp4', range: [7.6, 17.6], poster: 5.4, crf: 30, tune: 'animation',
    cuts: [{ suffix: '-desktop', vf: 'scale=1280:-2:flags=lanczos' }, { suffix: '-phone', vf: 'crop=640:720:400:80' }] },
  { kind: 'still', id: 'hvn-coach-a', study: 'hvn', name: 'coach-a', root: 'hvn', src: 'Coaches/DSC07544.jpg', widths: [360, 720, 1080], crop: { x: 0.51, aspect: 4 / 5 }, about: 'HVN CrossFit coach portrait, shot 2026. C4 Lens.' },
  { kind: 'still', id: 'hvn-coach-b', study: 'hvn', name: 'coach-b', root: 'hvn', src: 'Coaches/DSC07557.jpg', widths: [360, 720, 1080], crop: { x: 0.53, aspect: 4 / 5 }, about: 'HVN CrossFit coach portrait, shot 2026. C4 Lens.' },
  { kind: 'still', id: 'hvn-coach-c', study: 'hvn', name: 'coach-c', root: 'hvn', src: 'Coaches/DSC07563.jpg', widths: [360, 720, 1080], crop: { x: 0.52, aspect: 4 / 5 }, about: 'HVN CrossFit coach portrait, shot 2026. C4 Lens.' },
  { kind: 'still', id: 'hvn-coach-d', study: 'hvn', name: 'coach-d', root: 'hvn', src: 'Coaches/DSC09590.jpg', widths: [360, 720, 1080], crop: { x: 0.52, aspect: 4 / 5 }, about: 'HVN CrossFit coach portrait, shot 2026. C4 Lens.' },

  /* Sharp Bricklaying: two films, seven stills from April 2026, the loader
     (cut at 3.1 s, before the site's hero photo, which the client supplied in
     September, comes up behind it).
     The stills are files the site's own gallery shows, so every one is live. */
  { id: 'sharp-drone-rhonda', root: 'sharp', src: 'Additional photos for rhonda/WhatsApp Video 2026-04-27 at 12.02.58 AM.mp4', poster: 7, crf: 30, tune: 'film',
    cuts: [{ suffix: '', vf: 'fps=30' }] },
  { id: 'sharp-drone-huon', root: 'sharp', src: 'additional huon/WhatsApp Video 2026-04-27 at 12.03.33 AM.mp4', poster: 12.5, crf: 29, tune: 'film',
    cuts: [{ suffix: '', vf: 'fps=30' }] },
  { id: 'sharp-loader', root: 'captures', src: 'sharp-bricklaying/raw/desktop-master.mp4', range: [0, 3.1], poster: 1.8, crf: 29, tune: 'animation',
    cuts: [{ suffix: '-desktop', vf: 'scale=1280:-2:flags=lanczos' }, { suffix: '-phone', vf: 'crop=800:800:320:50,scale=720:720:flags=lanczos' }] },
  { kind: 'still', id: 'sharp-aerial-oblique', study: 'sharp', name: 'aerial-oblique', root: 'sharp', src: 'number 5/WhatsApp Image 2026-04-26 at 1.44.27 AM (1).jpeg', widths: [640, 1280, 2048], about: 'Sharp Bricklaying job site from the air, April 2026. C4 Lens.' },
  { kind: 'still', id: 'sharp-aerial-plan', study: 'sharp', name: 'aerial-plan', root: 'sharp', src: 'number 5/WhatsApp Image 2026-04-26 at 1.44.28 AM.jpeg', widths: [480, 960, 1152], about: 'Sharp Bricklaying job site, straight down from the air, April 2026. C4 Lens.' },
  { kind: 'still', id: 'sharp-corner', study: 'sharp', name: 'corner', root: 'sharp', src: 'number 4/WhatsApp Image 2026-04-26 at 1.41.25 AM.jpeg', widths: [640, 1280, 2048], about: 'Sharp Bricklaying brickwork in late light, April 2026. C4 Lens.' },
  { kind: 'still', id: 'sharp-wall-sun', study: 'sharp', name: 'wall-sun', root: 'sharp', src: 'number 4/WhatsApp Image 2026-04-26 at 1.41.24 AM.jpeg', widths: [480, 960, 1536], about: 'Sharp Bricklaying wall in the sun, April 2026. C4 Lens.' },
  /* The two aerials the site has shown since April (the files that were
     public/captures/sharpbricklaying-com-au/sharp-aerial-wide.jpeg and -tall.jpeg). */
  { kind: 'still', id: 'sharp-aerial-rhonda', study: 'sharp', name: 'aerial-rhonda', root: 'sharp', src: 'Additional photos for rhonda/WhatsApp Image 2026-04-26 at 11.55.12 PM.jpeg', widths: [480, 960, 1152], about: 'Sharp Bricklaying job on Rhonda Ave, Willetton, from the air, April 2026. C4 Lens.' },
  { kind: 'still', id: 'sharp-aerial-rhonda-close', study: 'sharp', name: 'aerial-rhonda-close', root: 'sharp', src: 'Additional photos for rhonda/WhatsApp Image 2026-04-26 at 11.55.10 PM.jpeg', widths: [480, 960, 1152], about: 'Sharp Bricklaying walls on Rhonda Ave, Willetton, from just above, April 2026. C4 Lens.' },
  { kind: 'still', id: 'sharp-dusk', study: 'sharp', name: 'dusk', root: 'sharp', src: 'number 5/WhatsApp Image 2026-04-26 at 1.44.26 AM.jpeg', widths: [480, 960, 1152], about: 'Sharp Bricklaying block wall at dusk, April 2026. C4 Lens.' },

  /* DS Racing Karts: the header film, the chassis clip, the game, the tachometer. */
  { id: 'dsr-header', root: 'dsr', src: 'videos/Site Header.mp4', poster: 6.4, crf: 30, tune: 'film',
    cuts: [{ suffix: '-desktop', vf: '' }, { suffix: '-phone', vf: 'scale=640:-2:flags=lanczos' }] },
  { id: 'dsr-chassis', root: 'dsr', src: 'images/history/chasis.mp4', poster: 5.6, crf: 27, tune: 'film',
    cuts: [{ suffix: '-desktop', vf: 'fps=30' }, { suffix: '-phone', vf: 'fps=30,scale=640:-2:flags=lanczos' }] },
  { id: 'dsr-game', root: 'captures', src: 'ds-racing-karts/raw/game-master.mp4', range: [0.5, 9.25], poster: 3.1, crf: 28, tune: 'animation',
    cuts: [{ suffix: '-desktop', vf: 'scale=1280:-2:flags=lanczos' }, { suffix: '-phone', vf: 'scale=720:-2:flags=lanczos' }] },
  /* The needle is scrubbed by the page's scroll, so the capture scrolls past it.
     The cut is the stretch where the dial is in frame, run forward and then
     back, which is what the page does when you scroll down and up again. */
  { id: 'dsr-tacho', root: 'captures', src: 'ds-racing-karts/raw/tacho-desktop-master.mp4', range: [8.2, 10.7], pingpong: true, poster: 1.9, crf: 28, tune: 'animation',
    cuts: [{ suffix: '', vf: 'crop=720:700:360:200' }] },

  /* Evidence Advisory: the phone that breaks apart and comes back together. */
  { id: 'ea-phone', root: 'captures', src: 'evidence-advisory/raw/desktop-master.mp4', range: [6, 15.5], poster: 1.2, crf: 29, tune: 'animation',
    cuts: [{ suffix: '-desktop', vf: 'scale=1280:-2:flags=lanczos' }, { suffix: '-phone', vf: 'crop=640:800:780:60' }] },

  /* Tidy Gardens: the margin of three pages, where the motion lives. */
  { id: 'tidy-vine', root: 'captures', src: 'tidy-gardens/raw/vine-desktop-master.mp4', range: [2.5, 29.4], poster: 19, crf: 28, tune: 'animation',
    cuts: [{ suffix: '', vf: 'crop=104:848:0:52' }] },
  { id: 'tidy-pipe', root: 'captures', src: 'tidy-gardens/raw/pipe-desktop-master.mp4', range: [3, 41.5], poster: 22.5, crf: 28, tune: 'animation',
    cuts: [{ suffix: '', vf: 'crop=104:848:0:52' }] },
  { id: 'tidy-mower', root: 'captures', src: 'tidy-gardens/raw/mower-desktop-master.mp4', range: [3, 33.4], poster: 7, crf: 28, tune: 'animation',
    cuts: [{ suffix: '', vf: 'crop=104:848:0:52' }] },

  /* Brady Electrical: the single-line diagram energising, then a replay. */
  { id: 'brady-sld', root: 'captures', src: 'brady-electrical/raw/desktop-master.mp4', range: [0, 15.6], poster: 6.2, crf: 29, tune: 'animation',
    cuts: [{ suffix: '-desktop', vf: 'scale=1280:-2:flags=lanczos' }, { suffix: '-phone', vf: 'crop=560:720:800:120' }] },

  /* Groverz Tax: the drifting symbols, cropped clear of the headline. */
  { id: 'groverz-symbols', root: 'captures', src: 'groverz-tax/raw/desktop-master.mp4', range: [3, 13], poster: 4, crf: 28, tune: 'animation',
    cuts: [{ suffix: '', vf: 'crop=640:540:800:110' }] },

  /* The Rocks, At the Movies: the scripted sign-in, the campus picker and the
     browse screen. The intro sting was never played in the recording. */
  { id: 'rocks-stream', root: 'captures', src: 'the-rocks/raw/desktop-master.mp4', range: [7, 31], poster: 6.6, crf: 30, tune: 'animation',
    cuts: [{ suffix: '-desktop', vf: 'scale=1280:-2:flags=lanczos' }, { suffix: '-phone', vf: 'crop=900:900:270:0,scale=720:720:flags=lanczos' }] },
];

/* ── Helpers ─────────────────────────────────────────────────────────── */
function run(bin, args) {
  const r = spawnSync(bin, args, { encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.error) throw new Error(`${bin} failed to start: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${bin} ${args.join(' ')}\n${r.stderr}`);
  return r;
}
const probe = (file) => JSON.parse(run(FFPROBE, ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file]).stdout);
const kb = (f) => `${(fs.statSync(f).size / 1024).toFixed(0)} KB`;

/* The moov box must come before mdat or the browser fetches the file's tail
   before it can start. Walk the top-level boxes to prove faststart. */
function moovFirst(file) {
  const fd = fs.openSync(file, 'r');
  const head = Buffer.alloc(8);
  let pos = 0;
  try {
    for (let i = 0; i < 16; i++) {
      if (fs.readSync(fd, head, 0, 8, pos) < 8) return false;
      let size = head.readUInt32BE(0);
      const type = head.toString('latin1', 4, 8);
      if (type === 'moov') return true;
      if (type === 'mdat') return false;
      if (size === 1) {
        const big = Buffer.alloc(8);
        fs.readSync(fd, big, 0, 8, pos + 8);
        size = Number(big.readBigUInt64BE(0));
      }
      if (size < 8) return false;
      pos += size;
    }
    return false;
  } finally {
    fs.closeSync(fd);
  }
}

function videoJob(job, master) {
  const info = probe(master);
  const v = info.streams.find((s) => s.codec_type === 'video');
  if (!v) throw new Error(`${master} has no video stream`);
  const [rate, per] = String(v.r_frame_rate || '30/1').split('/').map(Number);
  const srcFps = per ? rate / per : rate;
  const outFps = srcFps > 31 ? 30 : srcFps;
  const gop = Math.round(outFps * 2);
  const trim = job.range ? ['-ss', String(job.range[0]), '-to', String(job.range[1])] : [];
  const toRgb = 'scale=in_color_matrix=bt709:in_range=tv:out_range=pc,format=rgb24';

  for (const cut of job.cuts) {
    const base = `${job.id}${cut.suffix}`;
    const mp4 = path.join(MOTION, `${base}.mp4`);
    const poster = path.join(MOTION, `${base}.webp`);
    const shape = [srcFps > 31 && !/fps=/.test(cut.vf) ? 'fps=30' : '', cut.vf].filter(Boolean).join(',');
    const vfChain = [shape, 'format=yuv420p'].filter(Boolean).join(',');
    const filter = job.pingpong
      ? ['-filter_complex', `[0:v]${shape ? `${shape},` : ''}split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[out]`, '-map', '[out]']
      : ['-map', '0:v:0', '-vf', vfChain];

    run(FFMPEG, [
      '-v', 'error', '-y', ...trim, '-i', master, ...filter,
      '-map_metadata', '-1', '-map_chapters', '-1', '-an',
      '-c:v', 'libx264', '-preset', 'slow', '-tune', job.tune || 'film', '-crf', String(job.crf || 28),
      '-g', String(gop), '-keyint_min', String(gop), '-sc_threshold', '0',
      '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0',
      '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
      '-movflags', '+faststart', mp4,
    ]);

    /* The poster is taken from the finished cut, so it is exactly the frame
       the player seeks to before it starts. */
    run(FFMPEG, [
      '-v', 'error', '-y', '-ss', String(job.poster), '-i', mp4,
      '-frames:v', '1', '-vf', `${toRgb},format=bgra`,
      '-c:v', 'libwebp', '-quality', '82', '-compression_level', '6', poster,
    ]);

    let stripNote = '';
    if (job.strip) {
      const strip = path.join(MOTION, `${base}-strip.webp`);
      const count = run(FFMPEG, ['-v', 'info', '-i', mp4, '-map', '0:v:0', '-vf', 'fps=10', '-f', 'null', '-']);
      const frames = [...count.stderr.matchAll(/frame=\s*(\d+)/g)].pop();
      const n = frames ? Number(frames[1]) : 0;
      if (!n) throw new Error(`could not count frames in ${mp4}`);
      run(FFMPEG, [
        '-v', 'error', '-y', '-i', mp4,
        '-vf', `fps=10,${toRgb},scale=1:48:flags=area,tile=${n}x1,format=bgra`,
        '-frames:v', '1', '-c:v', 'libwebp', '-lossless', '1', '-compression_level', '6', strip,
      ]);
      stripNote = `; strip ${n} columns, ${kb(strip)}`;
    }

    const out = probe(mp4);
    const ov = out.streams.find((s) => s.codec_type === 'video');
    console.log(
      `${base}.mp4: ${ov.width}x${ov.height} ${ov.codec_name} ${ov.profile} ${ov.r_frame_rate} fps, ` +
      `${Number(out.format.duration).toFixed(2)} s, ${kb(mp4)}, moov first: ${moovFirst(mp4)}; poster @${job.poster}s ${kb(poster)}${stripNote}`,
    );
  }
}

async function stillJob(job, master) {
  const dir = path.join(WORK, job.study);
  fs.mkdirSync(dir, { recursive: true });
  let img = sharp(master).rotate();
  const meta = await sharp(master).rotate().metadata();
  let width = meta.autoOrient ? meta.autoOrient.width : meta.width;
  let height = meta.autoOrient ? meta.autoOrient.height : meta.height;
  if (job.crop) {
    /* A full-height crop to `aspect`, centred on `x` (a fraction of the width)
       and kept inside the frame: the portraits stand at 4:5. */
    const cw = Math.min(width, Math.round(height * job.crop.aspect));
    const left = Math.max(0, Math.min(width - cw, Math.round(width * job.crop.x - cw / 2)));
    img = img.extract({ left, top: 0, width: cw, height });
    width = cw;
  }
  const buf = await img.toBuffer();
  const exif = { IFD0: { ImageDescription: `${job.about} Web cut by scripts/lens-work.mjs.` } };
  const made = [];
  for (const w of job.widths) {
    if (w > width) continue;
    const base = path.join(dir, `${job.name}-${w}`);
    const resized = sharp(buf).resize({ width: w, kernel: 'lanczos3' });
    await resized.clone().withExif(exif).avif({ quality: 52, effort: 6 }).toFile(`${base}.avif`);
    await resized.clone().withExif(exif).webp({ quality: 76, effort: 6 }).toFile(`${base}.webp`);
    made.push(`${w} (${kb(`${base}.avif`)} avif, ${kb(`${base}.webp`)} webp)`);
  }
  console.log(`lens-work/${job.study}/${job.name}: ${width}x${height} source; ${made.join(', ')}`);
}

/* ── Arguments ───────────────────────────────────────────────────────── */
const args = process.argv.slice(2);
const roots = {};
let only = null;
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace(/^--/, '');
  const value = args[i + 1];
  if (!value) { console.error(`Missing value for ${args[i]}`); process.exit(1); }
  if (key === 'only') { only = new Set(value.split(',')); continue; }
  if (!['captures', 'hvn', 'sharp', 'dsr'].includes(key)) { console.error(`Unknown flag ${args[i]}. Flags: --captures --hvn --sharp --dsr --only`); process.exit(1); }
  if (!fs.existsSync(value)) { console.error(`No such folder: ${value}`); process.exit(1); }
  roots[key] = value;
}
const todo = JOBS.filter((j) => roots[j.root] && (!only || only.has(j.id)));
if (!todo.length) {
  console.error('Nothing to do. Pass at least one of --captures, --hvn, --sharp, --dsr (and check --only).');
  process.exit(1);
}
fs.mkdirSync(MOTION, { recursive: true });
fs.mkdirSync(WORK, { recursive: true });
for (const job of todo) {
  const master = path.join(roots[job.root], job.src);
  if (!fs.existsSync(master)) { console.error(`Missing master for ${job.id}: ${master}`); process.exit(1); }
  if (job.kind === 'still') await stillJob(job, master);
  else videoJob(job, master);
}
