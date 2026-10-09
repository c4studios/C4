/*
 * Every photograph on /logo-design, with where it came from.
 *
 * All nine are from Unsplash and free to use under the Unsplash License
 * (https://unsplash.com/license). On 10 Oct 2026 each photo's own page was
 * checked and showed "Free to use under the Unsplash License" (none is an
 * Unsplash+ photo), and the original file was downloaded from it. The
 * originals are kept outside the repo, in C4-Internal/logo-masters/.
 * scripts/logo-photos.mjs cuts them to AVIF and WebP and writes this record
 * into each file's EXIF ImageDescription.
 *
 * What the page may say about them: what's pictured, plainly. None of them
 * shows C4 Studios work, and nothing on the page says or implies it does. No
 * other business's name or logo is legible in any crop. No image model was
 * used.
 *
 * Plain data, so the cutting script can read it in Node as well.
 */
const LICENCE = 'Unsplash License';
const LICENCE_URL = 'https://unsplash.com/license';
const DOWNLOADED = '10 October 2026';

const base = (p) => ({ licence: LICENCE, licenceUrl: LICENCE_URL, downloaded: DOWNLOADED, ...p });

export const PHOTOS = [
  base({
    key: 'enamel',
    size: [4028, 3349], // after any crop
    id: 's0ikeJgiJpc',
    page: 'https://unsplash.com/photos/a-weathered-house-number-4-on-a-textured-wall-s0ikeJgiJpc',
    photographer: 'iridial',
    profile: 'https://unsplash.com/@iridial_',
    subject: 'A weathered house number 4 on an enamel plate, on a rendered wall.',
    use: 'the opening of "Most logos spend their life on things".',
    widths: [480, 720, 1080],
  }),
  base({
    key: 'engrave',
    size: [5709, 3806], // after any crop
    id: 'KOwn5ibC4ZI',
    page: 'https://unsplash.com/photos/a-person-is-working-on-a-piece-of-art-KOwn5ibC4ZI',
    photographer: 'Amo Journey',
    profile: 'https://unsplash.com/@amojourney',
    subject: 'A copper plate being engraved by hand with a hammer and chisel, in Mostar, Bosnia and Herzegovina (the photo page gives the place).',
    use: 'the run, "Cut into metal".',
    widths: [640, 960, 1440, 2000],
  }),
  base({
    key: 'foil',
    size: [5184, 3888], // after any crop
    id: 'gkpAyNvaB9w',
    page: 'https://unsplash.com/photos/black-and-white-floral-textile-gkpAyNvaB9w',
    photographer: 'Brett Jordan',
    profile: 'https://unsplash.com/@brett_jordan',
    subject: 'Gold foil printed on dark card (the back of a playing card, by the photo page\'s description).',
    use: 'the run, "Pressed in foil".',
    widths: [640, 960, 1440, 2000],
  }),
  base({
    key: 'screen',
    size: [4928, 2564], // after any crop
    id: '0y3DOYVP2bs',
    page: 'https://unsplash.com/photos/a-man-in-a-white-shirt-and-white-gloves-0y3DOYVP2bs',
    photographer: 'Deniz Demirci',
    profile: 'https://unsplash.com/@ddography',
    subject: 'Yellow ink being pulled through a screen with a squeegee.',
    use: 'the run, "Pulled through a screen".',
    /* from below the printer's chin */
    crop: { left: 0, top: 700, width: 4928, height: 2564 },
    widths: [640, 960, 1440, 2000],
  }),
  base({
    key: 'stitch',
    size: [4150, 3712], // after any crop
    id: 'oiKO6ae92gU',
    page: 'https://unsplash.com/photos/white-sewing-machine-on-white-table-oiKO6ae92gU',
    photographer: 'Omar Alrawi',
    profile: 'https://unsplash.com/@omaralrawi',
    subject: 'A sewing machine running a green decorative stitch across white fabric.',
    use: 'the run, "Stitched".',
    /* the left three quarters, short of the marking on the needle plate */
    crop: { left: 0, top: 0, width: 4150, height: 3712 },
    widths: [640, 960, 1440, 2000],
  }),
  base({
    key: 'sign',
    size: [4896, 2934], // after any crop
    id: '0wsnJWonXFs',
    page: 'https://unsplash.com/photos/free-delivery-glass-window-signage-0wsnJWonXFs',
    photographer: 'Drew Beamer',
    profile: 'https://unsplash.com/@dbeamer_jpg',
    subject: 'Hand-painted lettering on a shop window in Arcade Alley, Nashville (the photo page gives the place).',
    use: 'the run, "Painted on glass".',
    /* below the reflection of a street sign along the top */
    crop: { left: 0, top: 330, width: 4896, height: 2934 },
    widths: [640, 960, 1440, 2000],
  }),
  base({
    key: 'van',
    size: [5917, 3932], // after any crop
    id: 'J2CnXdOF2N8',
    page: 'https://unsplash.com/photos/yellow-and-orange-van-J2CnXdOF2N8',
    photographer: 'Andrew',
    profile: 'https://unsplash.com/@andrew_scullin',
    subject: 'Stripes painted along the side of a yellow van, running across the door gap.',
    use: 'the run, "Wrapped round a van".',
    widths: [640, 960, 1440, 2000],
  }),
  base({
    key: 'seal',
    size: [4000, 2350], // after any crop
    id: 'HC2R5chgLMw',
    page: 'https://unsplash.com/photos/round-gold-colored-coin-on-white-surface-HC2R5chgLMw',
    photographer: 'Aleksey Boev',
    profile: 'https://unsplash.com/@alanveob',
    subject: 'A brass seal stamp with the letter T, on white.',
    use: 'the run, "Stamped and sealed".',
    widths: [640, 960, 1440, 2000],
  }),
  base({
    key: 'loupe',
    size: [3840, 5760], // after any crop
    id: 'hqCEQTc5gZA',
    page: 'https://unsplash.com/photos/close-up-photo-of-black-camera-lens-hqCEQTc5gZA',
    photographer: 'Markus Spiske',
    profile: 'https://unsplash.com/@markusspiske',
    subject: 'A printer\'s loupe on a printed colour chart.',
    use: '"Red and green", beside the note on print and screen colour.',
    widths: [400, 640, 960],
  }),
];

export const photo = (key) => PHOTOS.find((p) => p.key === key);
