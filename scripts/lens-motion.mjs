/* Web cuts of the two motion films on /Lens, which play in their case studies
   (src/components/lens/LensWork.jsx; the other case-study media comes from
   scripts/lens-work.mjs).
   The masters live outside the repo and are never committed. Pass their paths:
     node scripts/lens-motion.mjs --dsr <dsr-reel-1080x1920.mp4> \
       --aquasafe-16x9 <aquasafe-promo-16x9.mp4> --aquasafe-9x16 <aquasafe-promo-9x16.mp4>
   Pass only the flags for what changed: after a re-render, run that film alone.
   Needs ffmpeg and ffprobe on PATH (or FFMPEG / FFPROBE set to their paths).

   For each film, into public/lens-motion/ (beside lens-tex and lens-posters;
   never public/lens/, which a Windows build would merge with the prerendered
   /Lens/ page):
     <id>.mp4        H.264 High@4.0 at the master's own size, x264 slow with
                     tune animation, CRF 28, a keyframe every 2 s so the scrubber
                     seeks quickly, BT.709 tags, faststart. The master's AAC
                     stream is copied untouched, so the sync measured on the
                     master survives. Metadata is stripped.
     <id>.webp       the poster: frame POSTER_FRAME of the master, WebP q84. The
                     section starts its muted loop on this same frame, so the
                     poster hands over to the film without a jump.
     <id>-strip.webp the colour strip the scrubber runs over: the film sampled
                     ten times a second, each frame averaged down to a 1 x 48 px
                     column, the columns laid side by side. Lossless WebP.
   It prints each film's duration and file size for src/components/lens/motionFilms.js.
   Tested 8 Oct 2026 with ffmpeg 8.1 (gyan.dev full build). */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const FFPROBE = process.env.FFPROBE || 'ffprobe';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'lens-motion');

/* POSTER_FRAME is a frame number at the master's 30 fps. Keep it in step with
   posterTime in motionFilms.js (frame / 30). */
const FILMS = {
  dsr: { id: 'dsr-reel-9x16', POSTER_FRAME: 100 }, //            3.33 s: the red DS RACING KARTS card
  'aquasafe-16x9': { id: 'aquasafe-promo-16x9', POSTER_FRAME: 120 }, // 4.00 s: "It always starts small."
  'aquasafe-9x16': { id: 'aquasafe-promo-9x16', POSTER_FRAME: 120 },
};

function run(bin, args) {
  const r = spawnSync(bin, args, { encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.error) throw new Error(`${bin} failed to start: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${bin} ${args.join(' ')}\n${r.stderr}`);
  return r;
}

function probe(file) {
  const r = run(FFPROBE, ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file]);
  return JSON.parse(r.stdout);
}

/* The moov box must come before mdat or the browser has to fetch the tail of
   the file before it can start. Walk the top-level boxes to prove faststart. */
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

function encode(key, master) {
  const film = FILMS[key];
  const info = probe(master);
  const v = info.streams.find((s) => s.codec_type === 'video');
  const a = info.streams.find((s) => s.codec_type === 'audio');
  if (!v) throw new Error(`${master} has no video stream`);
  const mp4 = path.join(OUT, `${film.id}.mp4`);
  const poster = path.join(OUT, `${film.id}.webp`);
  const strip = path.join(OUT, `${film.id}-strip.webp`);

  run(FFMPEG, [
    '-v', 'error', '-y', '-i', master,
    '-map', '0:v:0', ...(a ? ['-map', '0:a:0'] : []),
    '-map_metadata', '-1', '-map_chapters', '-1',
    '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '28',
    '-g', '60', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    ...(a ? ['-c:a', 'copy'] : ['-an']),
    '-movflags', '+faststart', mp4,
  ]);

  // RGB conversion states the master's matrix, so the WebP colours match the film.
  const toRgb = 'scale=in_color_matrix=bt709:in_range=tv:out_range=pc,format=rgb24';
  run(FFMPEG, [
    '-v', 'error', '-y', '-i', master,
    '-vf', `select=eq(n\\,${film.POSTER_FRAME}),${toRgb},format=bgra`,
    '-frames:v', '1', '-fps_mode', 'passthrough',
    '-c:v', 'libwebp', '-quality', '84', '-compression_level', '6', poster,
  ]);

  // Count the samples first so the strip has no padded columns at the end.
  const count = run(FFMPEG, ['-v', 'info', '-i', master, '-map', '0:v:0', '-vf', 'fps=10', '-f', 'null', '-']);
  const frames = [...count.stderr.matchAll(/frame=\s*(\d+)/g)].pop();
  const n = frames ? Number(frames[1]) : 0;
  if (!n) throw new Error(`could not count frames in ${master}`);
  run(FFMPEG, [
    '-v', 'error', '-y', '-i', master,
    '-vf', `fps=10,${toRgb},scale=1:48:flags=area,tile=${n}x1,format=bgra`,
    '-frames:v', '1', '-c:v', 'libwebp', '-lossless', '1', '-compression_level', '6', strip,
  ]);

  const out = probe(mp4);
  const ov = out.streams.find((s) => s.codec_type === 'video');
  const oa = out.streams.find((s) => s.codec_type === 'audio');
  const mb = (f) => (fs.statSync(f).size / 1e6).toFixed(2);
  console.log(
    `${film.id}: ${ov.width}x${ov.height} ${ov.codec_name} ${ov.profile}, ` +
    `${oa ? `${oa.codec_name} ${oa.sample_rate} Hz, ` : 'no audio, '}` +
    `${Number(out.format.duration).toFixed(3)} s, ${mb(mp4)} MB, moov first: ${moovFirst(mp4)}; ` +
    `poster ${(fs.statSync(poster).size / 1e3).toFixed(0)} KB; strip ${n} columns, ${(fs.statSync(strip).size / 1e3).toFixed(1)} KB`,
  );
}

const args = process.argv.slice(2);
const jobs = [];
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace(/^--/, '');
  if (!FILMS[key] || !args[i + 1]) {
    console.error(`Unknown flag or missing path: ${args[i]}. Flags: ${Object.keys(FILMS).map((k) => `--${k}`).join(', ')}`);
    process.exit(1);
  }
  if (!fs.existsSync(args[i + 1])) {
    console.error(`No such file: ${args[i + 1]}`);
    process.exit(1);
  }
  jobs.push([key, args[i + 1]]);
}
if (!jobs.length) {
  console.error('Nothing to do. Pass at least one of --dsr, --aquasafe-16x9, --aquasafe-9x16 with a master path.');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });
for (const [key, master] of jobs) encode(key, master);
