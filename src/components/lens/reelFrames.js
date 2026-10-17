/* The frames in the Lens reel: the full-screen "Flick through the pictures"
   overlay that opens from the head of the work section on /Lens
   (LensReel.jsx). 17 October 2026, a prototype for Caleb.

   What's in it. Only C4 Lens's own photography and film, from the four film
   and photography studies (WORK_FILM in lensStudies.js): their stills, coach
   portraits and film posters in public/lens-work, public/lens-posters and
   public/lens-motion. Every frame was looked at before it went in.

   What's left out, and why.
   - The "Built into the site" studies (WORK_SITE). Their recordings show the
     clients' own photos and videos.
   - The screen recordings inside the film studies: the HVN chin-up game, the
     Sharp loading screen, and the DS Racing game and tachometer. They're web
     builds, not photography or film.
   - Any frame with a client-supplied photo: Sharp's current hero photos and
     the seconds of the Aqua-Safe film that show the van photo. The Aqua-Safe
     frame here is the film's opening, the pipe it draws.
   - The two Sharp drone-film posters (464 px wide, soft at full screen, and the
     aerial stills show the same jobs), and the old DS Racing and Sharp posters
     in public/lens-posters (blurred, and the films' own posters show more).
     Coach portraits b and c and three more Sharp stills stay in their studies,
     to keep the reel to twelve frames.

   Words. Names, places, captions and alt text come from lensStudies.js and
   motionFilms.js, read at build time, so a change there reaches the reel. The
   film posters had no alt text, so the lines below describe only what is on
   screen, and the Aqua-Safe frame takes its words from the film's own `words`
   list at the poster's second. No person is named as the one who made
   anything, nothing says "shot", and there are no results, opinions or
   production times.

   Years. Only where a file in this repo dates that piece of work: the HVN
   coach portraits ("shot 2026", scripts/lens-work.mjs), the Sharp stills
   (April 2026 masters, same script), and the Aqua-Safe film and the DS Racing
   reel (their schema upload dates in motionFilms.js). Nothing on file dates
   the HVN film or the DS Racing header film and chassis clip, so those frames
   give the kind of work and the place only.

   Kinds are the service names in "Five ways to be unforgettable" (Lens.jsx).

   Tones. Each frame's `tone` is its file averaged to one colour (sharp's
   channel means, 17 Oct 2026), the way the film players' strips average each
   frame to a column. The card lays the twelve out as the reel's own strip.
   Re-measure if a frame's file changes. */
import { HVN, SHARP, DSR, AQUA } from './lensStudies';
import { MOTION_FILMS } from './motionFilms';

const DSR_REEL = MOTION_FILMS.find((f) => f.id === 'dsr');
const AQUASAFE = AQUA.film;

const PHOTO = 'Photography';
const VIDEO = 'Videography';
const AERIAL = 'Drone & Aerial';
const MOTION = 'Motion';

/* Up to the first full stop that ends a sentence (no lookbehind, which Safari
   before 16.4 can't parse). */
const firstSentence = (text) => text.match(/^.*?\.(?=\s|$)/)?.[0] ?? text;
const yearOf = (film) => film.schema.uploadDate.slice(0, 4);

/* The last line a film puts on screen, and the last scene it describes, at or
   before second `t` (motionFilms.js `words`). */
const lastAt = (film, key, t) => film.words.filter((w) => w.t <= t && w[key]).pop()?.[key];

/* A still at several widths, AVIF first and WebP behind it (lensStudies.js). */
const still = (s) => ({
  type: 'still',
  base: s.base,
  width: s.width,
  height: s.height,
  widths: s.widths,
  ratio: s.width / s.height,
  alt: s.alt,
});

/* A film's poster frame. Cuts at one aspect are the same frame at different
   sizes, so the browser picks by width. A film with a wide and a tall cut
   shows the wide one in a landscape window and the tall one in a portrait
   window. */
const poster = (cuts, alt) => {
  const files = cuts.map((c) => ({ src: c.poster || c.src, width: c.width, height: c.height }));
  const wide = files.find((f) => f.width > f.height);
  const tall = files.find((f) => f.height > f.width);
  if (wide && tall) {
    return { type: 'art', wide, tall, ratio: tall.width / tall.height, ratioWide: wide.width / wide.height, alt };
  }
  const largest = files.reduce((a, b) => (b.width > a.width ? b : a));
  return { type: 'poster', files, ratio: largest.width / largest.height, alt };
};

/* Inside the gym, a frame at 13.8 s of the HVN film: public/hvn.mp4, the same
   30-second home page film as the study's cut (both 720 x 1280 at 25 fps),
   and byte for byte the hero-1.mp4 the HVN site serves, so no sharper master
   is on file. Taken at native size with ffmpeg on 18 Oct 2026 and encoded with
   the settings in scripts/lens-work.mjs (AVIF q52, WebP q76). It replaced
   /lens-posters/hvn.jpg, a mid-move frame scaled up to 1280 wide, which read
   soft. 13.8 s was the sharpest steady frame of the walk-through (Laplacian
   variance 302, against 7 to 68 for the frames around 2 to 4 s). */
const HVN_INSIDE = {
  base: '/lens-work/hvn/inside',
  width: 720,
  height: 1280,
  widths: [360, 720],
  alt: 'Inside the HVN gym: pull-up rigs and rings along a black wall with a teal stripe, the bike row behind.',
};

const sharpStill = (key) => SHARP.bricks[key].still;
const fromAir = 'From the air, for the gallery on their site.';
const onGround = 'On the ground, for the gallery on their site.';

export const REEL_FRAMES = [
  {
    id: 'hvn-air',
    study: HVN,
    kind: VIDEO,
    tone: '#a2a4a9',
    note: firstSentence(HVN.made),
    picture: poster(HVN.film.cuts, 'HVN CrossFit’s building from the air, its name in teal across the front wall.'),
  },
  {
    id: 'hvn-coach-a',
    study: HVN,
    kind: PHOTO,
    year: '2026',
    tone: '#322f29',
    note: HVN.coaches.caption,
    picture: still(HVN.coaches.stills[0]),
  },
  {
    id: 'hvn-inside',
    study: HVN,
    kind: VIDEO,
    tone: '#434238',
    note: 'Inside the gym, from the same film.',
    picture: still(HVN_INSIDE),
  },
  {
    id: 'hvn-coach-d',
    study: HVN,
    kind: PHOTO,
    year: '2026',
    tone: '#2c2a26',
    note: HVN.coaches.caption,
    picture: still(HVN.coaches.stills[3]),
  },
  { id: 'sharp-oblique', study: SHARP, kind: AERIAL, year: '2026', tone: '#786c5b', note: fromAir, picture: still(sharpStill('oblique')) },
  { id: 'sharp-corner', study: SHARP, kind: PHOTO, year: '2026', tone: '#766461', note: onGround, picture: still(sharpStill('corner')) },
  { id: 'sharp-plan', study: SHARP, kind: AERIAL, year: '2026', tone: '#827264', note: fromAir, picture: still(sharpStill('plan')) },
  { id: 'sharp-dusk', study: SHARP, kind: PHOTO, year: '2026', tone: '#785b48', note: onGround, picture: still(sharpStill('dusk')) },
  {
    id: 'dsr-header',
    study: DSR,
    kind: MOTION,
    tone: '#852e3d',
    note: `${DSR.header.caption} It opens their home page.`,
    picture: poster(DSR.header.clip.cuts, 'The DSR logo and the line The Original & The Best, over red and blue lightning.'),
  },
  {
    id: 'dsr-chassis',
    study: DSR,
    kind: MOTION,
    tone: '#110c10',
    note: `${DSR.chassis.caption} It plays on their Predator chassis and services pages.`,
    picture: poster(DSR.chassis.clip.cuts, 'The DSR logo above the words DSR Predator, on black.'),
  },
  {
    id: 'dsr-reel',
    study: DSR,
    kind: MOTION,
    year: yearOf(DSR_REEL),
    tone: '#dd1828',
    note: firstSentence(DSR_REEL.description),
    picture: poster(DSR_REEL.cuts, 'The reel’s title card in DS Racing red: DS Racing Karts, Sydney’s go kart specialists.'),
  },
  {
    id: 'aquasafe-open',
    study: AQUA,
    kind: MOTION,
    year: yearOf(AQUASAFE),
    tone: '#0e2f3f',
    note: firstSentence(AQUASAFE.description),
    picture: poster(
      AQUASAFE.cuts,
      `${lastAt(AQUASAFE, 'scene', AQUASAFE.posterTime)} On screen: “${lastAt(AQUASAFE, 'say', AQUASAFE.posterTime)}”`,
    ),
  },
];
