/* The films in the motion section of /Lens (LensMotion.jsx), and the
   VideoObject entries the page's JSON-LD builds from them.

   The files are web cuts that scripts/lens-motion.mjs makes from masters kept
   outside this repo. After a master is re-rendered, re-run the script for that
   film and check `duration` against what it prints. `posterTime` is the
   script's POSTER_FRAME over 30 fps: the muted loop starts on that frame so the
   poster hands over to the film without a jump.

   The copy describes what is on screen and nothing else. Each line was checked
   against the film and its build notes on 8 Oct 2026. No result, view count or
   client opinion belongs here. The music in both films is AI-made, synthesised
   in code from the film's own timeline, and each film's credits say so. The
   Aqua-Safe film draws its Perth map from OpenStreetMap, whose licence (ODbL)
   asks for the credit line.

   `words` is the text alternative for each film: every word it puts on screen,
   verbatim, at the second it lands (frame / 30, from the film's own timeline),
   with the pictures that carry meaning in square brackets. A re-cut that moves
   or changes a line has to change it here too. */

export const MOTION_FILMS = [
  {
    id: 'aquasafe',
    client: 'Aqua-Safe Plumbing & Maintenance',
    short: 'Aqua-Safe',
    kind: 'Promo film',
    place: 'Perth',
    duration: 59.669,
    posterTime: 4,
    /* Widescreen from 768px, the phone cut below it. The poster, the strip and
       the stage's aspect ratio switch on the same query (MotionFilm.jsx and
       lens.css), and the player swaps the source if the window crosses it. */
    cuts: [
      {
        media: '(min-width: 768px)',
        src: '/lens-motion/aquasafe-promo-16x9.mp4',
        poster: '/lens-motion/aquasafe-promo-16x9.webp',
        strip: '/lens-motion/aquasafe-promo-16x9-strip.webp',
        width: 1920,
        height: 1080,
      },
      {
        src: '/lens-motion/aquasafe-promo-9x16.mp4',
        poster: '/lens-motion/aquasafe-promo-9x16.webp',
        strip: '/lens-motion/aquasafe-promo-9x16-strip.webp',
        width: 1080,
        height: 1920,
      },
    ],
    description:
      'A minute-long promo made from Aqua-Safe’s own website. It starts with a burst pipe at 5:30 pm and follows the call into the site, right through to a sent enquiry. It ends with their logo drawn in pipe.',
    credits: [
      'Two cuts, 16:9 and 9:16.',
      'AI-made music and effects, synthesised in code.',
      'Map data © OpenStreetMap contributors.',
    ],
    words: [
      { t: 0, scene: 'Night. A chrome pipe runs along a tiled wall and starts to drip.' },
      { t: 3, say: 'It always starts small.' },
      { t: 6, say: '05:30 PM' },
      { t: 7, say: 'BURST PIPE.' },
      { t: 9, say: 'Water through the ceiling.' },
      { t: 10, scene: 'Water rises over the picture.' },
      { t: 11, say: 'Who do you call at 5:30 pm?' },
      { t: 13, scene: 'A phone dials the number.' },
      { t: 14, say: '08 6109 9459' },
      { t: 14, say: 'Calling…' },
      { t: 15, scene: 'The call opens Aqua-Safe’s website.' },
      { t: 16, say: 'Plumbing. Done properly.' },
      { t: 20, say: 'Upfront pricing, before we start.' },
      { t: 27, say: 'Everything plumbing and gas.' },
      { t: 30, scene: 'Burst Pipes is chosen from the services.' },
      { t: 31, say: 'Burst Pipes.' },
      { t: 33, scene: 'The enquiry form is filled in and sent.' },
      { t: 36, say: 'Thanks, Sam, that’s with us.' },
      { t: 38, scene: 'A map of Perth lights up, region by region.' },
      { t: 40, say: '167+ suburbs, one number.' },
      { t: 42, say: 'Let’s get it sorted.' },
      { t: 44, say: 'Licensed & insured · PL10802 · GF22810' },
      { t: 46, say: '12-month workmanship warranty' },
      { t: 48, say: '“…Leak fixed without fuss.” Ian Cartwright · Google review' },
      { t: 52, scene: 'Pipes draw the Aqua-Safe logo.' },
      { t: 56, say: 'AQUASAFE · PLUMBING & MAINTENANCE' },
      { t: 56, say: 'All Perth metro · 08 6109 9459 · aquasafeplumbing.com.au' },
    ],
    caseStudy: '/CaseStudy/aqua-safe-plumbing',
    schema: {
      name: 'Aqua-Safe Plumbing & Maintenance — promo film',
      description:
        'A minute-long promo film for Aqua-Safe Plumbing & Maintenance in Perth, made from the company’s own website and colours, with AI-made music. Made by C4 Studios.',
      uploadDate: '2026-10-08',
      duration: 'PT1M',
    },
  },
  {
    id: 'dsr',
    client: 'DS Racing Karts',
    short: 'DS Racing Karts',
    kind: 'Portfolio reel',
    place: 'Sydney',
    duration: 39.3,
    posterTime: 100 / 30,
    cuts: [
      {
        src: '/lens-motion/dsr-reel-9x16.mp4',
        poster: '/lens-motion/dsr-reel-9x16.webp',
        strip: '/lens-motion/dsr-reel-9x16-strip.webp',
        width: 1080,
        height: 1920,
      },
    ],
    description:
      'A reel about the online shop we built them, cut in their own colours and fonts. The race footage is filmed from the racing game on their site, with both karts driven by its AI.',
    credits: ['Vertical, 9:16.', 'AI-made music and effects, synthesised in code.'],
    words: [
      { t: 0, scene: 'Five red start lights from their racing game come on, then go out.' },
      { t: 2, say: 'DS RACING KARTS · Sydney’s go kart specialists' },
      { t: 5, say: 'A NEW WEBSITE.' },
      { t: 5, scene: 'The site on a laptop and a phone.' },
      { t: 8, say: 'A SHOP WITH 8,332 PARTS. · LIVE COUNT, 4 OCT 2026' },
      { t: 11, say: 'AND A RACING GAME.' },
      { t: 13, say: 'LIGHTS OUT AND AWAY WE GO!' },
      { t: 13, scene: 'Two karts race on the game’s Campbelltown GP track.' },
      { t: 16, say: 'FOUR TRACKS.' },
      { t: 18, say: '4,863 LINES OF CODE. From scratch.' },
      { t: 21, scene: 'Five gold stars.' },
      { t: 22, say: 'C4 is behind our new website & is doing an excellent job in not only creating it but, maintaining & tweaking it.' },
      { t: 29, say: 'Couldn’t ask for better service - very happy & highly recommended. DS RACING KARTS · SYDNEY' },
      { t: 32, scene: 'A chequered flag, then the C4 Studios mark.' },
      { t: 35, say: 'DS Racing Karts. See the build.' },
      { t: 36, say: 'Websites and AI systems, built in Perth.' },
      { t: 36, say: 'Read the case study · c4studios.com.au/CaseStudy/ds-racing-karts' },
    ],
    caseStudy: '/CaseStudy/ds-racing-karts',
    schema: {
      name: 'DS Racing Karts — portfolio reel',
      description:
        'A 39-second reel about the DS Racing Karts online shop, cut in the client’s own colours and fonts, with race footage filmed from the racing game on their site and AI-made music. Made by C4 Studios.',
      uploadDate: '2026-10-08',
      duration: 'PT39S',
    },
  },
];
