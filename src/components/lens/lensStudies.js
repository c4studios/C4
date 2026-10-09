/* The case studies on /Lens (LensWork.jsx), and the VideoObjects the page's
   JSON-LD builds from them. 9 October 2026.

   Who made it. Caleb confirmed on 9 Oct 2026 that all of this is C4 Lens work:
   the Sharp Bricklaying aerials, films and site photos, the HVN film and
   coach portraits, and the DS Racing header film and chassis clip, which he
   says were made from scratch. His instruction was to stay broad and name no
   one: "these are examples of what c4 lens can do". So no line here, no
   caption and no schema names a person as the one who shot or made anything.
   "We" and "C4 Lens" are the studio.

   What may not be added. No figures about results (views, enquiries, "x%
   more"). No client opinion except The Rocks' published review, quoted word
   for word with the cut marked. Nothing about how long anything took. The
   Rocks' intro sting is not C4's to show (its maker is unknown), the recording
   never plays it, and nothing here may describe it. Client photos stay out of
   the film and photography studies, where they could pass for C4 Lens work:
   Sharp's loader is cut at 3.1 s, before the hero photo the client supplied in
   September comes up behind it. The recordings in the second section show
   each site as it stands, its own photos included (Brady's hero, The Rocks'
   own videos as tiles), and the words say what C4 made. The Aqua-Safe film
   (8 Oct) shows the site's van photo for a few seconds and is unchanged.

   Where each piece runs was checked on 9 Oct 2026: the DS Racing header film,
   game and tachometer on its home page and the chassis clip on /predator-chassis
   and /services (live HTML); the Sharp stills and both films in the
   site's gallery (gallery/index.html in the site repo, by file name); the HVN
   portraits on its About page (src/app/about/page.tsx in the site repo). The
   Aqua-Safe film was made for the owner (brain commitment 79) and nothing on
   file shows it published anywhere else, so it says it plays here.

   Files: scripts/lens-work.mjs makes every cut, poster and still below from
   masters kept outside the repo, and prints the numbers used here (`posterAt`,
   durations, sizes). The Aqua-Safe film and the DS Racing reel come from
   scripts/lens-motion.mjs and live in motionFilms.js. */
import { MOTION_FILMS } from './motionFilms';

const WIDE = '(min-width: 768px)';
const M = '/lens-motion/';

/* A silent clip with a desktop cut and a phone cut, or one cut for both. */
function clip(id, label, posterAt, duration, desktop, phone) {
  const cuts = phone
    ? [
        { media: WIDE, src: `${M}${id}-desktop.mp4`, poster: `${M}${id}-desktop.webp`, width: desktop[0], height: desktop[1] },
        { src: `${M}${id}-phone.mp4`, poster: `${M}${id}-phone.webp`, width: phone[0], height: phone[1] },
      ]
    : [{ src: `${M}${id}.mp4`, poster: `${M}${id}.webp`, width: desktop[0], height: desktop[1] }];
  return { id, label, posterAt, duration, cuts };
}

/* A still at several widths, AVIF first and WebP behind it. */
function still(study, name, width, height, widths, alt) {
  return { base: `/lens-work/${study}/${name}`, width, height, widths, alt };
}

const AQUASAFE = MOTION_FILMS.find((f) => f.id === 'aquasafe');
const DSR_REEL = MOTION_FILMS.find((f) => f.id === 'dsr');

/* ── Film and photography ─────────────────────────────────────────────── */
export const HVN = {
  id: 'hvn',
  client: 'HVN CrossFit',
  place: 'Port Kennedy, WA',
  site: { href: 'https://thehvncrossfit.com', label: 'thehvncrossfit.com' },
  caseStudy: '/CaseStudy/hvn-gym',
  made: 'A 30-second film for the top of their home page. It starts above the building and walks you through the gym before the logo lands. We also shot the coach portraits for their site, and built the chin-up game on the home page.',
  runs: 'The film and the game are on the home page at {site}. The portraits are on their About page.',
  fits: 'A gym sells the room and the people in it, so the site shows both before anyone books a class.',
  film: {
    id: 'hvn-film',
    client: 'HVN CrossFit',
    short: 'HVN',
    kind: 'Home page film',
    place: 'Port Kennedy',
    duration: 30.32,
    posterTime: 1.4,
    cuts: [{ src: `${M}hvn-film.mp4`, poster: `${M}hvn-film.webp`, strip: `${M}hvn-film-strip.webp`, width: 720, height: 1280 }],
  },
  coaches: {
    caption: 'Coach portraits for their About page.',
    stills: [
      still('hvn', 'coach-a', 1286, 1607, [360, 720, 1080], 'An HVN coach in glasses and the black team shirt, arms folded, against a dark wall.'),
      still('hvn', 'coach-b', 1250, 1563, [360, 720, 1080], 'An HVN coach smiling, arms folded, in the black team shirt.'),
      still('hvn', 'coach-c', 1638, 2048, [360, 720, 1080], 'An HVN coach smiling with hands relaxed, in the black team shirt.'),
      still('hvn', 'coach-d', 1455, 1819, [360, 720, 1080], 'An HVN coach with arms folded and a wide smile, in the black team shirt.'),
    ],
  },
  game: {
    caption: 'The chin-up game. Scrolling does the reps, and it keeps your best.',
    clip: clip('hvn-chinup', 'the HVN chin-up game', 5.4, 10, [1280, 800], [640, 720]),
  },
};

export const SHARP = {
  id: 'sharp',
  client: 'Sharp Bricklaying',
  place: 'Perth, WA',
  site: { href: 'https://www.sharpbricklaying.com.au', label: 'sharpbricklaying.com.au' },
  caseStudy: '/CaseStudy/sharp-bricklaying',
  made: 'Photos of their jobs from the air and on the ground, and footage of two sites cut into short films. We also built the loading screen, which lays a wall of bricks while the site opens.',
  runs: 'The photos and films are in the gallery at {site}, and the loading screen plays the first time you visit.',
  fits: 'Brickwork is easiest to judge from above, where you see the whole house laid out, and up close, where you see the joints.',
  loader: {
    caption: 'The loading screen, laying the wall a course at a time.',
    clip: clip('sharp-loader', 'the Sharp Bricklaying loading screen', 1.8, 3.1, [1280, 800], [720, 720]),
  },
  /* The wall: every brick is a photo or a film at its own aspect, laid in
     courses so no two joints line up. `bricks` is the order on a wide screen
     (the Rhonda Ave film stands as a pier through both courses); `phone` is the
     order in pairs. */
  bricks: {
    rhonda: { kind: 'clip', ratio: 464 / 832, caption: 'Rhonda Ave, Willetton.', clip: clip('sharp-drone-rhonda', 'drone film over Rhonda Ave, Willetton', 7, 45.1, [464, 832]) },
    huon: { kind: 'clip', ratio: 464 / 832, caption: 'Huon St, Willetton.', clip: clip('sharp-drone-huon', 'film of Huon St, Willetton, from the ground and the air', 12.5, 20.77, [464, 832]) },
    oblique: { kind: 'still', ratio: 2048 / 1152, still: still('sharp', 'aerial-oblique', 2048, 1152, [640, 1280, 2048], 'A brick house shell from the air, walls up, late sun throwing long shadows.') },
    plan: { kind: 'still', ratio: 1152 / 2048, still: still('sharp', 'aerial-plan', 1152, 2048, [480, 960, 1152], 'Looking straight down on a long brick shell, every room laid out like a floor plan.') },
    corner: { kind: 'still', ratio: 2048 / 1536, still: still('sharp', 'corner', 2048, 1536, [640, 1280, 2048], 'A face-brick corner in low sun, with a shadow cut across it.') },
    wallSun: { kind: 'still', ratio: 1536 / 2048, still: still('sharp', 'wall-sun', 1536, 2048, [480, 960, 1536], 'A tall brick wall running away from the camera into the sun.') },
    aerialWide: { kind: 'still', ratio: 1152 / 2048, still: still('sharp', 'aerial-rhonda', 1152, 2048, [480, 960, 1152], 'A brick house shell on Rhonda Ave, Willetton, from the air, its rooms laid out between the neighbours’ roofs.') },
    aerialTall: { kind: 'still', ratio: 1152 / 2048, still: still('sharp', 'aerial-rhonda-close', 1152, 2048, [480, 960, 1152], 'Brick walls on Rhonda Ave from just above, with blue conduit running over the top course.') },
    dusk: { kind: 'still', ratio: 1152 / 2048, still: still('sharp', 'dusk', 1152, 2048, [480, 960, 1152], 'A block wall at dusk under an orange sky.') },
  },
  wall: {
    pier: 'rhonda',
    courses: [['oblique', 'corner', 'aerialWide'], ['plan', 'aerialTall', 'dusk', 'huon', 'wallSun']],
    phone: [['oblique', 'plan'], ['rhonda', 'corner'], ['aerialWide', 'aerialTall'], ['wallSun', 'huon', 'dusk']],
  },
};

export const DSR = {
  id: 'dsr',
  client: 'DS Racing Karts',
  place: 'Sydney',
  site: { href: 'https://www.dsracingkarts.com.au', label: 'dsracingkarts.com.au' },
  caseStudy: '/CaseStudy/ds-racing-karts',
  made: 'The film that opens their home page, made from scratch as a motion graphic, and a second one for their Predator chassis. We also built the racing game on the home page, and the tachometer that revs as you scroll.',
  runs: 'The header film and the game are on the home page at {site}, with the tachometer further down. The chassis clip plays on their Predator chassis and services pages.',
  fits: 'Their customers race karts, so the home page opens at speed and the game gives them a reason to stay.',
  header: { caption: 'The header film, from the dial to the logo.', clip: clip('dsr-header', 'the DS Racing Karts header film', 6.4, 7.1, [1280, 720], [640, 360]) },
  chassis: { caption: 'The Predator chassis clip.', clip: clip('dsr-chassis', 'the DS Racing Karts Predator chassis clip', 5.6, 7.93, [1024, 576], [640, 360]) },
  game: { caption: 'The racing game, with both karts driven by its AI.', clip: clip('dsr-game', 'the DS Racing Karts racing game', 3.1, 8.77, [1280, 746], [720, 420]) },
  tacho: { caption: 'The tachometer. Scroll down and it revs, scroll back and it drops.', clip: clip('dsr-tacho', 'the DS Racing Karts tachometer', 1.9, 5, [720, 700]) },
  /* The pit board: every piece with its running time, read off the cuts. */
  board: [
    { name: 'Header film', time: '0:07.10' },
    { name: 'Chassis clip', time: '0:07.93' },
    { name: 'Racing game', time: 'Live' },
    { name: 'Tachometer', time: 'On scroll' },
    { name: 'Reel', time: '0:39.30' },
  ],
  /* The reel, re-cut on 9 Oct 2026 with the end card "Websites and software,
     built in Perth." Set this to null to take it off the page again; the board
     line above goes with it. */
  reel: DSR_REEL,
};

export const AQUA = {
  id: 'aquasafe',
  client: 'Aqua-Safe Plumbing & Maintenance',
  place: 'Perth',
  site: { href: 'https://aquasafeplumbing.com.au/', label: 'aquasafeplumbing.com.au' },
  caseStudy: '/CaseStudy/aqua-safe-plumbing',
  made: AQUASAFE.description,
  runs: 'It plays here, in a wide cut for screens and a tall cut for phones. The site it’s made from is {site}, which we built.',
  fits: 'Most people look up a plumber once something’s already leaking, so the film starts with the leak.',
  film: AQUASAFE,
};

/* ── Motion built into the sites ──────────────────────────────────────── */
export const EA = {
  id: 'ea',
  client: 'Evidence Advisory',
  place: 'Perth, WA',
  site: { href: 'https://evidenceadvisory.com.au', label: 'evidenceadvisory.com.au' },
  caseStudy: '/CaseStudy/evidence-advisory',
  made: 'The animation at the top of their home page. As you scroll, a phone breaks apart and the pieces come back together.',
  runs: 'On the home page at {site}.',
  fits: 'Phones are what this firm examines for court, and the first thing you see is one coming back together.',
  label: [
    { k: 'Item', v: 'Home page animation' },
    { k: 'Found at', v: 'evidenceadvisory.com.au' },
    { k: 'Recorded', v: '9 Oct 2026, live site' },
  ],
  clip: clip('ea-phone', 'the Evidence Advisory home page animation', 1.2, 9.5, [1280, 800], [640, 800]),
};

export const TIDY = {
  id: 'tidy',
  client: 'Tidy Gardens Australia',
  place: 'Perth, WA',
  site: { href: 'https://tidygardens.com.au', label: 'tidygardens.com.au' },
  caseStudy: '/CaseStudy/tidy-gardens-australia',
  made: 'A piece of garden drawn down the margin of three of their pages. Each one grows or moves as you scroll.',
  runs: 'All three are live on {site}.',
  fits: 'Each margin shows the job its page sells. On the reticulation page, you watch the sprinklers come on before you ring about yours.',
  stakes: [
    { name: 'Vine', page: 'Home page', clip: clip('tidy-vine', 'the vine on the Tidy Gardens home page', 19, 26.9, [104, 848]) },
    { name: 'Poly pipe', page: 'Reticulation', clip: clip('tidy-pipe', 'the poly pipe and pop-up sprinklers on the Tidy Gardens reticulation page', 22.5, 38.5, [104, 848]) },
    { name: 'Mower', page: 'Lawn care', clip: clip('tidy-mower', 'the mower on the Tidy Gardens lawn care page', 7, 30.4, [104, 848]) },
  ],
};

export const BRADY = {
  id: 'brady',
  client: 'Brady Electrical',
  place: 'Neerabup, WA',
  site: { href: 'https://bradyelectrical.com.au', label: 'bradyelectrical.com.au' },
  caseStudy: '/CaseStudy/brady-electrical',
  made: 'A single-line diagram of Perth that powers up as the home page loads, with feeders running out from their depot in Neerabup to each suburb. Throw the main switch and it runs again.',
  runs: 'At the top of the home page at {site}.',
  fits: 'An electrician’s home page should show power reaching people, and this one sends it across the metro area they cover.',
  block: [
    { k: 'Project', v: 'Brady Electrical home page' },
    { k: 'Drawing', v: 'Perth metro, single line' },
    { k: 'Status', v: 'Live' },
  ],
  clip: clip('brady-sld', 'the Brady Electrical single-line diagram', 6.2, 15.6, [1280, 800], [560, 720]),
};

export const GROVERZ = {
  id: 'groverz',
  client: 'Groverz Tax & Accounting',
  place: 'East Cannington, WA',
  site: { href: 'https://groverztax.com.au', label: 'groverztax.com.au' },
  caseStudy: '/CaseStudy/groverz-tax',
  made: 'Tax symbols that drift behind the headline on their home page, moved by a small physics simulation in the browser.',
  runs: 'Behind the headline at {site}.',
  fits: 'It’s faint on purpose. The symbols sit behind the headline and never compete with it.',
  /* Six of the symbols their home page draws: the animation's own pool,
     sampled with seed 42 (FloatingMathBackground.jsx in the Groverz repo,
     checked 9 Oct 2026). The summation sign is ∑ there, not the Greek Σ. */
  tape: ['$', '%', '∑', 'π', 'ABN', '∞'],
  clip: clip('groverz-symbols', 'the Groverz Tax drifting symbols', 4, 10, [640, 540]),
};

export const ROCKS = {
  id: 'rocks',
  client: 'The Rocks Church',
  place: 'Cannington and Baldivis, WA',
  site: null,
  caseStudy: '/CaseStudy/rocksstream',
  made: 'Motion graphics for their At the Movies series, set out like a streaming service. It signs itself in with the password No Perfect People Allowed, after one wrong try. Then it asks which campus is watching and opens that campus’s line-up.',
  runs: 'It’s made to play on the screens before the service at both campuses. It runs offline, so there’s no public link to it.',
  fits: 'For a series called At the Movies, the screen before the service looks like the start of a film night.',
  /* testimonialData.jsx, id 7, verbatim. Only the first sentence is quoted and
     the cut is marked. The rest names a person, and this page names no one. */
  quote: { text: 'C4 Studios helped our church create amazing motion graphics for our At The Movies series.', cut: true, by: 'The Rocks Church' },
  clip: clip('rocks-stream', 'The Rocks Church At the Movies screen', 6.6, 24, [1280, 800], [720, 720]),
};

export const WORK_FILM = [HVN, SHARP, DSR, AQUA];
export const WORK_SITE = [EA, TIDY, BRADY, GROVERZ, ROCKS];

/* ── VideoObjects ─────────────────────────────────────────────────────────
   One per video on the page, from the same entries the page renders, so the
   schema can't describe a file that isn't there. Each points at the desktop
   cut and its poster. */
const iso = (s) => `PT${Math.round(s)}S`;
const lead = (c) => c.cuts[0];
const video = (c, name, description) => ({
  name,
  description,
  thumbnailUrl: lead(c).poster,
  contentUrl: lead(c).src,
  uploadDate: '2026-10-09',
  duration: iso(c.duration),
});

export const WORK_VIDEOS = [
  video({ ...HVN.film, cuts: HVN.film.cuts }, 'HVN CrossFit home page film',
    'A 30-second film for the HVN CrossFit home page in Port Kennedy. It starts above the building and walks through the gym before the logo lands. Made by C4 Lens.'),
  video(HVN.game.clip, 'HVN CrossFit chin-up game',
    'A recording of the chin-up game C4 Studios built into the HVN CrossFit home page. Scrolling does the reps.'),
  video(SHARP.bricks.rhonda.clip, 'Sharp Bricklaying: Rhonda Ave, Willetton',
    'Drone footage over a Sharp Bricklaying job on Rhonda Ave, Willetton, cut into a short film by C4 Lens.'),
  video(SHARP.bricks.huon.clip, 'Sharp Bricklaying: Huon St, Willetton',
    'Footage of a Sharp Bricklaying job on Huon St, Willetton, from the ground and the air, cut into a short film by C4 Lens.'),
  video(SHARP.loader.clip, 'Sharp Bricklaying loading screen',
    'A recording of the loading screen C4 Studios built for the Sharp Bricklaying website, which lays a wall of bricks while the site opens.'),
  video(DSR.header.clip, 'DS Racing Karts header film',
    'The seven-second film that opens the DS Racing Karts home page, made from scratch as a motion graphic by C4 Lens.'),
  video(DSR.chassis.clip, 'DS Racing Karts Predator chassis clip',
    'A short motion graphic for the DS Racing Karts Predator chassis, made by C4 Lens.'),
  video(DSR.game.clip, 'DS Racing Karts racing game',
    'A recording of the racing game C4 Studios built into the DS Racing Karts home page.'),
  video(DSR.tacho.clip, 'DS Racing Karts tachometer',
    'A recording of the tachometer on the DS Racing Karts home page, which revs as the visitor scrolls. Built by C4 Studios.'),
  video(EA.clip, 'Evidence Advisory home page animation',
    'A recording of the scroll animation C4 Studios built for the Evidence Advisory home page, where a phone breaks apart and comes back together.'),
  video(TIDY.stakes[0].clip, 'Tidy Gardens: the vine',
    'A recording of the vine that grows down the margin of the Tidy Gardens home page as the visitor scrolls. Built by C4 Studios.'),
  video(TIDY.stakes[1].clip, 'Tidy Gardens: the poly pipe',
    'A recording of the poly pipe and pop-up sprinklers in the margin of the Tidy Gardens reticulation page. Built by C4 Studios.'),
  video(TIDY.stakes[2].clip, 'Tidy Gardens: the mower',
    'A recording of the mower that mows stripes down the margin of the Tidy Gardens lawn care page. Built by C4 Studios.'),
  video(BRADY.clip, 'Brady Electrical single-line diagram',
    'A recording of the animated single-line diagram of Perth on the Brady Electrical home page. Built by C4 Studios.'),
  video(GROVERZ.clip, 'Groverz Tax drifting symbols',
    'A recording of the tax symbols that drift behind the headline on the Groverz Tax home page. Built by C4 Studios.'),
  video(ROCKS.clip, 'The Rocks Church: At the Movies screen',
    'A recording of the streaming-style screen C4 Studios made for The Rocks Church’s At the Movies series, which plays before the service.'),
];
