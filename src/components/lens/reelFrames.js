/* The frames in the Lens reel: the full-screen "Flick through the pictures"
   overlay that opens from the head of the work section on /Lens
   (LensReel.jsx). 17 October 2026, a prototype for Caleb; redesigned on
   18 October with every frame full bleed, and widened the same day (v4) to
   eighteen frames after Caleb asked for more of the photography and one HVN
   portrait instead of four.

   The reel sits under "These are examples of what C4 Lens can do. Each was
   made for a client", so a frame goes in only on evidence that C4 Lens made
   it. Checked on 18 Oct 2026, photo by photo.

   The camera. The coach portraits that scripts/lens-work.mjs records as C4
   Lens work all carry the same camera: SONY ILCE-7M3 with the FE 50mm F1.8,
   exported from Adobe Lightroom 9.2 and 9.3 (Windows), shot on 25 Mar and
   24 Apr 2026 at +08:00. None carries a body serial. An EXIF scan of 12,064
   images (C4-Internal's c4-social and lens-masters, Downloads/
   C4-social-assets, every client folder and the Originals) found that pairing
   nowhere else, and no drone EXIF at all. The nearest, Third Wave BBQ's, is
   an A7 III with a 28-75mm, exported on a Mac and dated 2021 to 2024, years
   before any of the work here.

   What's in it, and on what evidence.
   - HVN CrossFit, one portrait: DSC07563, the coach-c master, whole. Its EXIF
     is that camera (25 Mar 2026, 11:43:30), and it is the photo the third
     coach card shows on HVN's About page (src/app/about/page.tsx in the site
     repo), so it was already public. The file is byte for byte the master in
     C4-Internal/c4-social/motion/public/hvn/src.
   - Sharp Bricklaying, twelve stills of two Willetton jobs, Rhonda Ave and
     Huon St, every one in the site's gallery (gallery/index.html, checked by
     file name). WhatsApp stripped their EXIF, so they rest on the record.
     Seven are the stills scripts/lens-work.mjs already cuts as C4 Lens work,
     which Caleb confirmed on 9 Oct 2026 (lensStudies.js). The other five came
     in the same WhatsApp batches on 26 Apr, by the files' timestamps: one in
     the same second as the Huon St aerial, two a second after the Rhonda Ave
     corner, and two from the Willeton folder, which holds the Rhonda Ave job
     whose aerials the case study lists as C4's drone photography
     (caseStudyData.jsx). None of the twelve matches a photo the client
     supplied.
   - The Aqua-Safe film and the DS Racing reel, three frames and two. Both
     films are C4's (motionFilms.js).

   What's left out, and why.
   - Sharp photos that match the client's own. Difference hashes compared
     every image in the site repo with every other. The feature-brickwork
     photo is one of the sixteen hero photos the client supplied on 6 Sep 2026
     (brain work_log 21), and a photo from the circular-window job is a near
     match for another, so neither set goes in, though the case study lists
     both as C4's. The 21 April "gallery images" batch, the number 6 folder,
     the before-and-after sets and the Branksome Gardens folder overlap, the
     same photos sent on 21 and 26 Apr and again on 11 May, and one of them
     is a near match for a client hero photo.
   - Sharp photos with no record: every later job folder (May to October),
     the current hero photos, Avonmore, Lathlain, the stairs, and the project
     and hero-bg files. The Header Aerial Shots batch looks like the Huon St
     flight (two of its files are the Huon St stills here), but the rest of it
     ran only in the old home page carousel, replaced on 6 Sep, so none of it
     is live and "For the gallery on their site." wouldn't be true of it.
   - Three Willeton photos 900 px wide, too soft to fill a screen.
   - The other HVN coach portraits (one portrait only, as Caleb asked), the
     one HVN took off its About page on 12 Oct (brain work_log 742), the HVN
     film's frames (720 px wide, soft at 1440), and the gym photos on HVN's
     site, which carry no EXIF and no record.
   - Aqua-Safe, Tidy Gardens, Brady Electrical, Jurassic PT and ZaZa Silks
     photos: none carries the camera above, and each traces to the client:
     iPhone EXIF, the client's Instagram or product shots, or a case study
     saying the client supplied them. DS Racing's site photos come from a
     Nikon D90 and several iPhones. Stock and press photos, mock-ups and site
     screenshots never go in.
   - The "Built into the site" studies (WORK_SITE): their recordings show the
     clients' own photos and videos. The screen recordings inside the film
     studies (the HVN chin-up game, the Sharp loading screen, the DS Racing
     game and tachometer): web builds, not photography or film.
   - The DS Racing header film and Predator chassis clip: each logo arrives
     with a line of words 57 to 70% down the frame, where the card's top edge
     falls on a laptop (checked full screen at 1366 x 768 and 1440 x 900).
   - Moments of the films that carry a claim, a figure or someone else's
     words: in the DS Racing reel the parts count and the lines of code (8 to
     10 s, 18 to 20 s), the star rating and the client's quote (21 to 31 s),
     and the site screenshots (5 to 8 s); in the Aqua-Safe film the website
     with the client's van photo (16 to 35 s), the suburb count (39 to 42 s),
     the licence and warranty lines (44 to 48 s) and the named Google review
     (48 to 52 s).

   The film frames. Each is a frame of the repo's own cut, taken at native
   size with ffmpeg on 18 Oct 2026 and encoded with the settings in
   scripts/lens-work.mjs (AVIF q52, WebP q76), its origin written into the
   file's EXIF ImageDescription. Each sits clear of the card.
   - Aqua-Safe, both cuts (1920 x 1080 and 1080 x 1920): 2.25 s, the pipe
     and its first drop falling, before any words, 10 to 44% down the wide
     cut; 6.2 s,
     "05:30 PM" alone, 42 to 57% down the wide cut and 38 to 45% down the
     tall one; 13.0 s, "Who do you call at 5:30 pm?" beside the phone, 39 to
     57% down, before the number dials in.
   - DS Racing reel (1080 x 1920): 2.0 s, the five start lights all lit, 44
     to 51% down, before the title lands; 17.0 s, "FOUR TRACKS.", 18 to 35%
     down. The title card's lettering runs 19 to 69% down, too tall to clear
     the card.

   Words. Clients, study places and most captions and alt text come from
   lensStudies.js and motionFilms.js, read at build time, so a change there
   reaches the reel. The alt text of the five Sharp stills cut for the reel,
   and the HVN portrait's caption, are written here. A frame's own `place` is
   narrower than its study's where the client's gallery names the suburb.
   The film frames' alt text describes only what is on screen, from the
   films' own `words` lists. No person is named as the one who made anything,
   nothing says "shot", and there are no results, opinions or production
   times.

   Years. Only from a dated file or a record: the HVN portrait's EXIF
   (2026-03-25), the Sharp stills (April 2026 in scripts/lens-work.mjs, and
   WhatsApp timestamps of 23 to 26 Apr), and the two films (their schema
   upload dates in motionFilms.js).

   Kinds are the service names in "Five ways to be unforgettable" (Lens.jsx).

   Order. Frames come in groups by client, so the client's name holds still
   inside a group, and no two groups of one client touch, the wrap from the
   last frame to the first included. Sharp has the most frames and needs
   another client between each of its groups, so with three other clients it
   gets three groups of four and no more. With the one HVN portrait and five
   frames from the films, that makes eighteen. Warm groups take turns with
   cool ones: Sharp's brick and late sun, the dark HVN portrait, Sharp, the
   Aqua-Safe film's night blue, Sharp at dusk, then the DS Racing reel's red
   lights and green track. Inside the Sharp groups a wide frame takes turns
   with a close one, and the reel opens on its sharpest masters (2048 px
   wide).

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
   screen, so the y puts the subject above it. On a phone a frame is cropped
   at the sides, so the x keeps the subject. A phone on its side has a strip
   across two fifths of its height, so a frame can carry a `focusShort` for
   screens under 500 px tall: the clock's lowest crop lifts "05:30 PM" clear
   of the strip, and the portrait keeps the eyes and the smile above it. The
   start lights' y keeps the game's timer off a tablet's top edge, half cut.
   Checked full screen at 1440 x 900, 1280 x 800, 768 x 1024, 375 x 812 and
   812 x 375. */
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

/* A film frame's two cuts in public/lens-work (scripts/lens-work.mjs sizes). */
const cuts = (study, name) => [
  { base: `/lens-work/${study}/${name}-wide`, width: 1920, height: 1080, widths: [960, 1920] },
  { base: `/lens-work/${study}/${name}-tall`, width: 1080, height: 1920, widths: [540, 1080] },
];

/* Sharp: the study's own stills, and five more cut for the reel. Both jobs
   are in Willetton, the suburb the gallery's Rhonda Ave and Huon St panels
   name. */
const fromStudy = (key) => SHARP.bricks[key].still;
const cutForReel = (name, width, height, widths, alt) => ({ base: `/lens-work/sharp/${name}`, width, height, widths, alt });
const WILLETTON = 'Willetton, WA';
const forGallery = 'For the gallery on their site.';
const sharp = (id, kind, tone, focus, picture) => ({
  id, study: SHARP, place: WILLETTON, kind, year: '2026', tone, focus, note: forGallery, picture: still(picture),
});

const AQUA_NOTE = firstSentence(AQUASAFE.description);
const DSR_NOTE = firstSentence(DSR_REEL.description);

export const REEL_FRAMES = [
  /* Sharp: Huon St from the air, Rhonda Ave from the ground, in late sun. */
  sharp('sharp-oblique', AERIAL, '#786d5b', '45% 50%', fromStudy('oblique')),
  sharp('sharp-corner', PHOTO, '#766461', '40% 40%', fromStudy('corner')),
  sharp('sharp-plan', AERIAL, '#827264', '50% 50%', fromStudy('plan')),
  sharp('sharp-wall-sun', PHOTO, '#7c7377', '50% 30%', fromStudy('wallSun')),

  {
    id: 'hvn-coach',
    study: HVN,
    kind: PHOTO,
    year: '2026',
    tone: '#161715',
    focus: '50% 18%',
    focusShort: '50% 24%',
    note: 'One of the coach portraits for their About page.',
    picture: still({ base: '/lens-work/hvn/coach-full', width: 1819, height: 2048, widths: [720, 1440, 1819], alt: HVN.coaches.stills[2].alt }),
  },

  /* Sharp: Rhonda Ave, the whole house, then closer. */
  sharp('sharp-granny-flat', AERIAL, '#6b6b68', '50% 50%', cutForReel('aerial-granny-flat', 1600, 900, [640, 1280, 1600],
    'A brick house and granny flat taking shape on Rhonda Ave, Willetton, seen from the air, with solar panels on the roof next door.')),
  sharp('sharp-rhonda-close', AERIAL, '#877059', '50% 40%', fromStudy('aerialTall')),
  sharp('sharp-rhonda', AERIAL, '#6f6b62', '50% 45%', fromStudy('aerialWide')),
  sharp('sharp-walls', PHOTO, '#7b7077', '50% 30%', cutForReel('walls-ground', 1200, 1600, [480, 960, 1200],
    'Tall brick walls with their ties standing up from the top course, a long shadow across the slab and blue sky above.')),

  /* The Aqua-Safe film, its first three beats. */
  {
    id: 'aquasafe-drip',
    study: AQUA,
    kind: MOTION,
    year: yearOf(AQUASAFE),
    tone: '#0b2d3c',
    focus: '70% 50%',
    note: AQUA_NOTE,
    picture: artStills(...cuts('aquasafe', 'drip'), lastAt(AQUASAFE, 'scene', 2.25)),
  },
  {
    id: 'aquasafe-clock',
    study: AQUA,
    kind: MOTION,
    year: yearOf(AQUASAFE),
    tone: '#0f2b38',
    focus: '50% 50%',
    focusShort: '50% 100%',
    note: AQUA_NOTE,
    picture: artStills(...cuts('aquasafe', 'clock'), `On screen, in big white figures on deep blue: “${lastAt(AQUASAFE, 'say', 6.2)}”`),
  },
  {
    id: 'aquasafe-call',
    study: AQUA,
    kind: MOTION,
    year: yearOf(AQUASAFE),
    tone: '#3f6778',
    focus: '6% 22%',
    focusShort: '6% 100%',
    note: AQUA_NOTE,
    picture: artStills(...cuts('aquasafe', 'call'), `${lastAt(AQUASAFE, 'scene', 13)} On screen: “${lastAt(AQUASAFE, 'say', 13)}”`),
  },

  /* Sharp: the back of Rhonda Ave, then Huon St as the light goes. */
  sharp('sharp-rear', AERIAL, '#817a74', '50% 40%', cutForReel('aerial-rear', 2048, 1152, [640, 1280, 2048],
    'The back of a brick shell from the air: window openings, scaffold frames and packs of bricks on the slab.')),
  sharp('sharp-rooms-top', AERIAL, '#977e6f', '50% 35%', cutForReel('rooms-top', 1152, 2048, [480, 960, 1152],
    'Looking down on brick rooms and the slab beside them, with packs of bricks and a barrow.')),
  sharp('sharp-rooms-evening', PHOTO, '#755046', '50% 30%', cutForReel('rooms-evening', 2048, 1152, [640, 1280, 2048],
    'Inside a brick shell at dusk: tall walls and a doorway through to the next room, under a pink sky.')),
  sharp('sharp-dusk', PHOTO, '#785b48', '45% 18%', fromStudy('dusk')),

  /* The DS Racing reel: the start lights, then the track. */
  {
    id: 'dsr-lights',
    study: DSR,
    kind: MOTION,
    year: yearOf(DSR_REEL),
    tone: '#250c0e',
    focus: '50% 59%',
    note: DSR_NOTE,
    picture: still({
      base: '/lens-work/dsr/reel-lights', width: 1080, height: 1920, widths: [540, 1080],
      alt: 'Five red start lights from their racing game, all lit.',
    }),
  },
  {
    id: 'dsr-reel',
    study: DSR,
    kind: MOTION,
    year: yearOf(DSR_REEL),
    tone: '#2c6a26',
    focus: '15% 22%',
    note: DSR_NOTE,
    picture: still({
      base: '/lens-work/dsr/reel-tracks', width: 1080, height: 1920, widths: [540, 1080],
      alt: 'The words Four tracks. on green, above two karts racing round the racing game’s Campbelltown GP track, the four tracks drawn small beneath.',
    }),
  },
];
