/* The projects in the Lens reel: the full-screen "Flick through the pictures"
   overlay that opens from the head of the work section on /Lens
   (LensReel.jsx). Built 17 October 2026 as a prototype for Caleb, and
   rebuilt on 18 October as one slide per project, each slide moving through
   that project's best pictures.

   Caleb, 18 Oct 2026: "one slide per project, and find a fancy way to trickle
   through multiple images within each slide (so each project is still
   getting it's best contents displayed)", and on photos the clients took:
   "put photos up, but just specify in small fine print that they're client
   supplied but still evidence of what good photography does for a brand".

   So a picture is either C4's own (`client: false`: C4 Lens photography, or
   a frame of a film C4 made) or one the client supplied (`client: true`).
   While a client's picture is on screen, the card shows one line of fine
   print saying so (CLIENT_PHOTO below). C4's own pictures carry none.
   Nothing else on the card is about credit.

   The projects. Six with the strongest pictures, each with a study on /Lens
   so "Read about this job" lands somewhere (#work-<id>): Sharp Bricklaying,
   HVN CrossFit, Tidy Gardens Australia, Aqua-Safe, DS Racing Karts and Brady
   Electrical. Every photo fills a 1440 x 900 screen without being enlarged
   more than 1.25 times, and the film frames, drawn flat, 1.33 times.
   - C4's own: Sharp's aerial, corner and dusk stills (scripts/lens-work.mjs,
     April 2026), one HVN coach portrait (the coach-c master whole), a frame
     of the Aqua-Safe film and two of the DS Racing reel.
   - The clients': Sharp's breeze-block wall (one of the hero photos it
     supplied in September), three of HVN's gym photos (its own gallery), Tidy
     Gardens' lawn job and its dog, Aqua-Safe's vans, a bathroom and a gas fit,
     DS Racing's kart and car photos, and four of Brady Electrical's job
     photos. Each was cut with the settings in scripts/lens-work.mjs, its EXIF
     saying it was supplied by the client.
   People appear only in photos already on that client's own site (HVN's
   gallery and its About page, Tidy Gardens' lawn job, DS Racing's karts), or
   seen from behind where nobody could be recognised (Brady's electrician on
   the platform), and nobody is named.

   Left out. ZaZa Silks has the strongest studio photos on file, but its site
   isn't launched (30 Oct 2026, brain work_log 898), the people in them aren't
   public yet, and it has no study. Jurassic PT's photos aren't on this
   computer. Transform Fremantle and Transform Hakea have no photos on file
   big enough to fill a screen, and The Rocks, Evidence Advisory and Groverz
   are screen recordings and motion, not photographs. Stock and press photos,
   mock-ups, site screenshots and generated images never go in.

   Words. Clients and study places come from lensStudies.js; each project's
   kind of work, place, year and caption are written here, the alt text with
   each picture. The kind is what C4 made for that client. No person is
   named as the one who made anything, nothing says "shot", and there are no
   results, opinions or production times. Years come from each case study
   (caseStudyData.jsx).

   Order. Sharp opens on C4's own aerial, the sharpest master. Warm projects
   take turns with cool ones: Sharp's brick and late sun, HVN's dark gym,
   Tidy Gardens' grass, Aqua-Safe's blue, DS Racing's red and green, then
   Brady's sky and steel. Inside a project, a wide picture takes turns with a
   close one, and Tidy Gardens' lawn goes in the order it was done.

   Tones. Each picture's `tone` is its file averaged to one colour (sharp's
   channel means, 18 Oct 2026). While a picture loads, its layer shows that
   tone with the colour taken out (LensReel.jsx), so nothing opens on black.

   Focus. Every picture fills the screen and is cropped to it, and the
   window's strip crops it the same way, so `focus` is the point the crop
   keeps: an object-position, x then y. On a wide screen the y puts the
   subject above the card; on a phone the x keeps it. `focusShort` is for
   screens under 500 px tall, where the card is a strip across two fifths of
   the height. */
import { HVN, SHARP, DSR, AQUA, TIDY, BRADY } from './lensStudies';

const AQUASAFE = AQUA.film;

/* The fine print, shown on the card only while a client's picture is. */
export const CLIENT_PHOTO = 'Photo supplied by the client. It’s here because it shows what good photography does for a brand.';

/* The last line a film puts on screen, and the last scene it describes, at or
   before second `t` (motionFilms.js `words`). */
const lastAt = (film, key, t) => film.words.filter((w) => w.t <= t && w[key]).pop()?.[key];

/* A still at several widths, AVIF first and WebP behind it, as cut by
   scripts/lens-work.mjs into public/lens-work/<study>/<name>-<width>. */
const still = (study, name, width, height, widths, alt) => ({
  type: 'still', base: `/lens-work/${study}/${name}`, width, height, widths, ratio: width / height, alt,
});

/* A film frame with a wide cut and a tall one: the wide one in a landscape
   window, the tall one in a portrait window. */
const artStills = (study, name, alt) => {
  const wide = { type: 'still', base: `/lens-work/${study}/${name}-wide`, width: 1920, height: 1080, widths: [960, 1920], ratio: 16 / 9, alt };
  const tall = { type: 'still', base: `/lens-work/${study}/${name}-tall`, width: 1080, height: 1920, widths: [540, 1080], ratio: 9 / 16, alt };
  return { type: 'art-stills', wide, tall, ratio: tall.ratio, alt };
};

const ours = (id, picture, tone, focus, focusShort) => ({ id, picture, tone, focus, focusShort, client: false });
const theirs = (id, picture, tone, focus, focusShort) => ({ id, picture, tone, focus, focusShort, client: true });

const sharpStill = (key) => SHARP.bricks[key].still;
const fromStudy = (s) => still(s.base.split('/')[2], s.base.split('/')[3], s.width, s.height, s.widths, s.alt);

export const REEL_PROJECTS = [
  {
    id: 'sharp',
    study: SHARP,
    kind: 'Photography and drone',
    year: '2026',
    note: 'Their jobs from the air and on the ground.',
    images: [
      ours('sharp-oblique', fromStudy(sharpStill('oblique')), '#786d5b', '45% 50%'),
      theirs('sharp-breeze-block', still('sharp', 'breeze-block', 2048, 1152, [640, 1440, 2048],
        'A wall of white breeze blocks running along the top of a brick wall, under a blue sky.'), '#83949a', '30% 50%'),
      ours('sharp-corner', fromStudy(sharpStill('corner')), '#766461', '40% 40%'),
      ours('sharp-dusk', fromStudy(sharpStill('dusk')), '#785b48', '45% 18%'),
    ],
  },
  {
    id: 'hvn',
    study: HVN,
    kind: 'Portraits and film',
    year: '2026',
    note: 'The coaches and the gym floor, for their site.',
    images: [
      ours('hvn-coach', still('hvn', 'coach-full', 1819, 2048, [720, 1440, 1819], HVN.coaches.stills[2].alt), '#161715', '50% 18%', '50% 24%'),
      theirs('hvn-gym-team', still('hvn', 'gym-team', 1600, 1066, [640, 1440, 1600],
        'Four members smiling together after a workout.'), '#393937', '50% 30%'),
      theirs('hvn-gym-lift', still('hvn', 'gym-lift', 1286, 1600, [640, 1286],
        'A member holding a barbell overhead at the bottom of a squat.'), '#494743', '45% 22%', '45% 18%'),
      theirs('hvn-gym-coach', still('hvn', 'gym-coach', 1600, 1200, [640, 1440, 1600],
        'A coach in an HVN shirt talking with a member.'), '#3b3b37', '45% 30%'),
    ],
  },
  {
    id: 'tidy',
    study: TIDY,
    kind: 'Website and motion',
    year: '2026',
    note: 'A lawn from bare ground to grass.',
    images: [
      theirs('tidy-lawn-before', still('tidy', 'lawn-before', 4032, 3024, [640, 1440, 1920],
        'A backyard dug over into mounds of soil, before the new lawn.'), '#68665e', '50% 55%'),
      theirs('tidy-lawn-during', still('tidy', 'lawn-during', 3024, 4032, [640, 1440, 1920],
        'A mini loader levelling the same yard, with a worker behind it.'), '#80817d', '55% 38%'),
      theirs('tidy-lawn-after', still('tidy', 'lawn-after', 4032, 3024, [640, 1440, 1920],
        'The finished yard: a new green lawn, with a gazebo in the corner.'), '#5e6b63', '45% 50%'),
      theirs('tidy-site-manager', still('tidy', 'site-manager', 4032, 3024, [640, 1440, 1920],
        'A dog in a harness resting on a tree stump on site.'), '#7a7f74', '28% 40%'),
    ],
  },
  {
    id: 'aquasafe',
    study: AQUA,
    kind: 'Website and promo film',
    year: '2026',
    note: 'The photos on their site, and the film we made from it.',
    images: [
      theirs('aquasafe-fleet', still('aquasafe', 'fleet', 1672, 941, [640, 1440, 1672],
        'A row of Aqua-Safe vans parked above the beach.'), '#767b80', '30% 50%'),
      theirs('aquasafe-bathroom', still('aquasafe', 'bathroom', 4032, 3024, [640, 1440, 1920],
        'A finished bathroom with a timber vanity, two round mirrors and a walk-in shower.'), '#85837a', '55% 40%'),
      theirs('aquasafe-gas', still('aquasafe', 'gas', 3024, 4032, [640, 1440, 1920],
        'A gas burner lit blue in the middle of a black cooktop grate.'), '#83827d', '50% 45%'),
      ours('aquasafe-call', artStills('aquasafe', 'call',
        `${lastAt(AQUASAFE, 'scene', 13)} On screen: “${lastAt(AQUASAFE, 'say', 13)}”`), '#3f6778', '6% 22%', '6% 100%'),
    ],
  },
  {
    id: 'dsr',
    study: DSR,
    kind: 'Online shop and films',
    year: '2025–2026',
    note: 'Race days, and the reel we made about their online shop.',
    images: [
      ours('dsr-lights', still('dsr', 'reel-lights', 1080, 1920, [540, 1080],
        'Five red start lights from their racing game, all lit.'), '#250c0d', '50% 59%'),
      theirs('dsr-kart-333', still('dsr', 'kart-333', 3642, 2869, [640, 1440, 1920],
        'A driver in a red and black kart numbered 333, waiting in the pits.'), '#645953', '45% 40%'),
      theirs('dsr-kart-blur', still('dsr', 'kart-blur', 1600, 1066, [640, 1440, 1600],
        'A kart at speed, the tyre wall a blur behind it.'), '#4b5440', '60% 50%'),
      theirs('dsr-car-49', still('dsr', 'car-49', 1600, 1066, [640, 1440, 1600],
        'Car 49, a white and black sedan, leaning through a corner.'), '#6a6b47', '35% 50%'),
      ours('dsr-tracks', still('dsr', 'reel-tracks', 1080, 1920, [540, 1080],
        'The words Four tracks. on green, above two karts racing round the racing game’s Campbelltown GP track, the four tracks drawn small beneath.'), '#2c6a26', '15% 22%'),
    ],
  },
  {
    id: 'brady',
    study: BRADY,
    kind: 'Website and motion',
    year: '2026',
    note: 'Their jobs, for the site we built them.',
    images: [
      theirs('brady-conveyor', still('brady', 'conveyor', 1900, 1425, [640, 1440, 1900],
        'A long conveyor stacker on a dirt site under a blue sky, a ute parked beside it.'), '#546472', '35% 50%'),
      theirs('brady-underground', still('brady', 'underground', 1350, 1800, [640, 1350],
        'A switchboard lit up on the rock wall of an underground tunnel.'), '#4f4142', '50% 45%'),
      theirs('brady-workshop', still('brady', 'workshop', 5712, 4284, [640, 1440, 1920],
        'Red machinery on stands in a big workshop.'), '#644d45', '45% 50%'),
      theirs('brady-platform', still('brady', 'platform', 3024, 4032, [640, 1440, 1920],
        'An electrician in hi-vis on a steel platform high on a plant, under a blue sky.'), '#75727e', '50% 32%'),
    ],
  },
];
