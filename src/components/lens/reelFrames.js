/* The frames in the Lens reel: the full-screen "Flick through the pictures"
   overlay that opens from the head of the work section on /Lens
   (LensReel.jsx). 17 October 2026, a prototype for Caleb; redesigned on
   18 October 2026 with every frame full bleed, and its frames reworked the
   same day so none is soft and nothing that matters sits under the card.

   What's in it. Only C4 Lens's own photography and film, from the four film
   and photography studies (WORK_FILM in lensStudies.js): Sharp's stills, the
   four HVN coach portraits, a frame of the DS Racing reel and one of the
   Aqua-Safe film. Every frame was looked at, full screen, before it went in.

   What's left out, and why.
   - The "Built into the site" studies (WORK_SITE). Their recordings show the
     clients' own photos and videos.
   - The screen recordings inside the film studies: the HVN chin-up game, the
     Sharp loading screen, and the DS Racing game and tachometer. They're web
     builds, not photography or film.
   - Any frame with a client-supplied photo: Sharp's current hero photos, and
     the seconds of the Aqua-Safe film that show the client's website (16 to
     35 s), where their van photo is.
   - The HVN film's frames: the building and its sign, and the gym inside. The
     film is 720 px wide, the same file the HVN site serves, so no sharper
     master is on file, and at 1440 wide both read soft next to the stills.
     The building frame was looked at full screen at 1440 x 900 before it
     went; its sign's edges are visibly blurred.
   - The two Sharp drone-film posters (464 px wide, soft at full screen, and
     the aerial stills show the same jobs), and the old posters in
     public/lens-posters (blurred or scaled up). Three more Sharp stills stay
     in their study, so no job has more than four frames.
   - The DS Racing header film (dsr-header-desktop.mp4, 1280 x 720) and
     Predator chassis clip (dsr-chassis-desktop.mp4, 1024 x 576). Each logo
     comes with a line of words under it: "The Original & The Best", 64 to
     68% down the frame, and "DSR PREDATOR", 57 to 70% down as the camera
     moves. On a laptop the card's top edge falls about 60 to 64% down
     (1366 x 768 and 1440 x 900), so the line was cut in half or hidden.
     Each line arrives with its logo, so neither film has a moment with one
     and not the other, and a 16:9 frame already fills a 16:10 screen's
     height, so no crop lifts a line clear without enlarging the film past
     what holds up. Both were looked at full screen before they went. (The
     header film also opens on a speedometer; nothing on file says whether
     that footage was made or licensed for it.)
   - Moments of the films that carry a claim, a figure or someone else's
     words: in the DS Racing reel the parts count and the lines of code (8 to
     10 s, 18 to 20 s), the star rating and the client's quote (21 to 31 s),
     and the site screenshots (5 to 8 s); in the Aqua-Safe film the suburb
     count (39 to 42 s), the licence and warranty lines (44 to 48 s) and the
     named Google review (48 to 52 s).

   The film frames. Each is a frame of the repo's own cut, taken at native
   size with ffmpeg on 18 Oct 2026 and encoded with the settings in
   scripts/lens-work.mjs (AVIF q52, WebP q76), its origin written into the
   file's EXIF ImageDescription. Each moment was chosen so the logo or the
   words sit in the upper part of the frame, clear of the card, which is in
   the same place on every frame; sharpness is the variance of a Laplacian
   over the frame, against the frames either side.
   - DS Racing reel, 17.0 s of dsr-reel-9x16.mp4 (1080 x 1920): "FOUR
     TRACKS.", 18 to 35% down, over the game's track. The opening title
     card's lettering (DS RACING KARTS) runs from 19 to 69% of the frame,
     too tall to clear the card on a wide screen, where only a third of a
     tall frame shows.
   - Aqua-Safe, 13.0 s of both cuts (1920 x 1080 and 1080 x 1920): "Who do
     you call at 5:30 pm?" beside the phone they animated, 39 to 57% down the
     wide cut and 20 to 30% down the phone cut. The opening line, "It always
     starts small.", sits 42 to 60% down and its second line went under the
     card. 13.0 s is before the number starts to dial in.

   Words. Names, places, captions and alt text come from lensStudies.js and
   motionFilms.js, read at build time, so a change there reaches the reel. The
   film frames' alt text describes only what is on screen, and the Aqua-Safe
   frame takes its words from the film's own `words` list at that second. No
   person is named as the one who made anything, nothing says "shot", and
   there are no results, opinions or production times.

   Years. Only where a file in this repo dates that piece of work: the HVN
   coach portraits ("shot 2026", scripts/lens-work.mjs), the Sharp stills
   (April 2026 masters, same script), and the Aqua-Safe film and the DS Racing
   reel (their schema upload dates in motionFilms.js). Every frame now in the
   reel has one; a frame without one would give the kind of work and the
   place only.

   Kinds are the service names in "Five ways to be unforgettable" (Lens.jsx).

   Order. Each job's frames stay together, so the card's client line holds
   still while you're inside a job. Sharp opens because its masters are the
   sharpest at full screen (2048 and 1152 px wide).

   Tones. Each frame's `tone` is its file averaged to one colour (sharp's
   channel means, 18 Oct 2026), the way the film players' strips average each
   frame to a column. While its file loads, the frame shows that tone with the
   colour taken out, a grey of the picture's brightness (LensReel.jsx), so a
   frame never opens on black or on a block of colour. Re-measure if a frame's
   file changes.

   Focus. Every frame fills the screen and is cropped to it, and the window
   on the card crops it the same way, so `focus` is the point of the picture
   the crop keeps: an object-position, x then y. On a wide screen a tall frame
   is cropped top and bottom and the card sits in the lower part of the
   screen, so the y puts the subject above it (each coach's face, the reel's
   words, which sit between the top edge and the card on 16:9 and 16:10
   screens alike). On a phone a frame is cropped at the sides, so the x keeps
   the subject; the Aqua-Safe words and the reel's start near the left edge,
   so their x holds that edge. On a phone or a tablet held upright the window
   on the card is wider than the tall cut, so there the y keeps the film's
   words in the window too. A phone on its side has a strip across two fifths
   of its height, so a frame can carry a `focusShort` for screens under 500
   px tall: the Aqua-Safe wide cut's lowest crop lifts its words clear of the
   strip at 812 x 375, and each coach's whole head sits between the top edge
   and the strip. The DS Racing reel's tall frame can't quite clear it: at
   812 x 375 its lettering is about 220 px tall, the whole height above the
   strip, and the frame's width sets that scale, so no crop helps; about
   14 px of "TRACKS." sits behind the strip there. Checked full screen at
   1280 x 720, 1280 x 800, 1366 x 768, 1440 x 900, 768 x 1024, 375 x 812,
   812 x 375 and 667 x 375. */
import { HVN, SHARP, DSR, AQUA } from './lensStudies';
import { MOTION_FILMS } from './motionFilms';

const DSR_REEL = MOTION_FILMS.find((f) => f.id === 'dsr');
const AQUASAFE = AQUA.film;

const PHOTO = 'Photography';
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

/* A frame with a wide cut and a tall one: the wide one in a landscape window,
   the tall one in a portrait window. */
const artStills = (wide, tall, alt) => ({
  type: 'art-stills',
  wide: still({ ...wide, alt }),
  tall: still({ ...tall, alt }),
  ratio: tall.width / tall.height,
  alt,
});

const sharpStill = (key) => SHARP.bricks[key].still;
const coach = (i) => still(HVN.coaches.stills[i]);
/* The kind of work already says from the air or on the ground. */
const forGallery = 'For the gallery on their site.';
const AQUA_AT = 13;

export const REEL_FRAMES = [
  { id: 'sharp-oblique', study: SHARP, kind: AERIAL, year: '2026', tone: '#786c5b', focus: '45% 50%', note: forGallery, picture: still(sharpStill('oblique')) },
  { id: 'sharp-corner', study: SHARP, kind: PHOTO, year: '2026', tone: '#766461', focus: '40% 40%', note: forGallery, picture: still(sharpStill('corner')) },
  { id: 'sharp-plan', study: SHARP, kind: AERIAL, year: '2026', tone: '#827264', focus: '50% 50%', note: forGallery, picture: still(sharpStill('plan')) },
  { id: 'sharp-dusk', study: SHARP, kind: PHOTO, year: '2026', tone: '#785b48', focus: '45% 18%', note: forGallery, picture: still(sharpStill('dusk')) },
  { id: 'hvn-coach-a', study: HVN, kind: PHOTO, year: '2026', tone: '#322f28', focus: '50% 33%', focusShort: '50% 26%', note: HVN.coaches.caption, picture: coach(0) },
  { id: 'hvn-coach-b', study: HVN, kind: PHOTO, year: '2026', tone: '#211d18', focus: '48% 35%', focusShort: '48% 28%', note: HVN.coaches.caption, picture: coach(1) },
  { id: 'hvn-coach-c', study: HVN, kind: PHOTO, year: '2026', tone: '#171815', focus: '49% 37%', focusShort: '49% 30%', note: HVN.coaches.caption, picture: coach(2) },
  { id: 'hvn-coach-d', study: HVN, kind: PHOTO, year: '2026', tone: '#2c2a26', focus: '56% 29%', focusShort: '56% 22%', note: HVN.coaches.caption, picture: coach(3) },
  {
    id: 'dsr-reel',
    study: DSR,
    kind: MOTION,
    year: yearOf(DSR_REEL),
    tone: '#2c6a26',
    focus: '15% 22%',
    note: firstSentence(DSR_REEL.description),
    picture: still({
      base: '/lens-work/dsr/reel-tracks', width: 1080, height: 1920, widths: [540, 1080],
      alt: 'The words Four tracks. on green, above two karts racing round the racing game’s Campbelltown GP track, the four tracks drawn small beneath.',
    }),
  },
  {
    id: 'aquasafe-call',
    study: AQUA,
    kind: MOTION,
    year: yearOf(AQUASAFE),
    tone: '#3f6778',
    focus: '6% 22%',
    focusShort: '6% 100%',
    note: firstSentence(AQUASAFE.description),
    picture: artStills(
      { base: '/lens-work/aquasafe/call-wide', width: 1920, height: 1080, widths: [960, 1920] },
      { base: '/lens-work/aquasafe/call-tall', width: 1080, height: 1920, widths: [540, 1080] },
      `${lastAt(AQUASAFE, 'scene', AQUA_AT)} On screen: “${lastAt(AQUASAFE, 'say', AQUA_AT)}”`,
    ),
  },
];
