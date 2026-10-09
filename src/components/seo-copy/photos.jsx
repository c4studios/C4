/*
 * The photographs on /seo-and-copywriting, and where each one came from.
 *
 * All four are real photographs from Unsplash or Pexels, used under their
 * free licences (unsplash.com/license, pexels.com/license), downloaded from
 * the photo's own page on 10 October 2026. The originals live outside the
 * repo in C4-Internal/seo-masters/; scripts/seo-photos.mjs cuts them into
 * the AVIF and WebP files here and writes the same source into each file's
 * EXIF ImageDescription. No image model is involved, and no words are drawn
 * into a photo: anything legible shown with one is HTML on the page.
 *
 * Rules they were picked to: no face as the subject, no other business's
 * logo or name legible (the ute's number plate and maker's badge are
 * blurred), and each one shows the thing its section is about.
 */
import phone480a from './assets/photos/phone-480.avif';
import phone720a from './assets/photos/phone-720.avif';
import phone1080a from './assets/photos/phone-1080.avif';
import phone480w from './assets/photos/phone-480.webp';
import phone720w from './assets/photos/phone-720.webp';
import phone1080w from './assets/photos/phone-1080.webp';
import markup480a from './assets/photos/markup-480.avif';
import markup720a from './assets/photos/markup-720.avif';
import markup960a from './assets/photos/markup-960.avif';
import markup480w from './assets/photos/markup-480.webp';
import markup720w from './assets/photos/markup-720.webp';
import markup960w from './assets/photos/markup-960.webp';
import switch480a from './assets/photos/switchboard-480.avif';
import switch800a from './assets/photos/switchboard-800.avif';
import switch1200a from './assets/photos/switchboard-1200.avif';
import switch480w from './assets/photos/switchboard-480.webp';
import switch800w from './assets/photos/switchboard-800.webp';
import switch1200w from './assets/photos/switchboard-1200.webp';
import ute480a from './assets/photos/ute-480.avif';
import ute800a from './assets/photos/ute-800.avif';
import ute480w from './assets/photos/ute-480.webp';
import ute800w from './assets/photos/ute-800.webp';

const set = (pairs) => pairs.map(([src, w]) => `${src} ${w}w`).join(', ');

export const PHOTOS = {
  phone: {
    avif: set([[phone480a, 480], [phone720a, 720], [phone1080a, 1080]]),
    webp: set([[phone480w, 480], [phone720w, 720], [phone1080w, 1080]]),
    src: phone720w, width: 1940, height: 2160,
    alt: 'Two hands holding a phone over a wooden table, a thumb on the screen.',
    page: 'https://unsplash.com/photos/person-holding-a-smartphone-with-a-green-screen-RsVfsE3wOvw',
    by: 'Vitaly Gariev', site: 'Unsplash', licence: 'Unsplash License',
    use: 'OnPhone.jsx. The phone was shot with a green screen, keyed out so the example results show through it.',
  },
  markup: {
    avif: set([[markup480a, 480], [markup720a, 720], [markup960a, 960]]),
    webp: set([[markup480w, 480], [markup720w, 720], [markup960w, 960]]),
    src: markup720w, width: 4480, height: 5600,
    alt: 'A hand marking up a typed page in red pen: a line struck out, a passage bracketed.',
    page: 'https://www.pexels.com/photo/a-person-marking-a-composition-7968067/',
    by: 'Ron Lach', site: 'Pexels', licence: 'Pexels License',
    use: 'The writing section, beside the rules we write by.',
  },
  switchboard: {
    avif: set([[switch480a, 480], [switch800a, 800], [switch1200a, 1200]]),
    webp: set([[switch480w, 480], [switch800w, 800], [switch1200w, 1200]]),
    src: switch800w, width: 4000, height: 3000,
    alt: 'Gloved hands testing a switchboard with a multimeter.',
    page: 'https://unsplash.com/photos/electrician-testing-electrical-panel-with-multimeter-PkHf7BUWbtk',
    by: 'Toolmash Expo', site: 'Unsplash', licence: 'Unsplash License',
    use: 'The example home page in Rewrite.jsx, and a photo on the example profile in Profile.jsx.',
  },
  ute: {
    avif: set([[ute480a, 480], [ute800a, 800]]),
    webp: set([[ute480w, 480], [ute800w, 800]]),
    src: ute800w, width: 5760, height: 2880,
    alt: 'A white tray-back ute with a toolbox, parked on a building site behind safety bunting.',
    page: 'https://unsplash.com/photos/a-white-pick-up-truck-parked-on-a-dirt-road-3Ayc2Mwv07U',
    by: 'Troy Mortier', site: 'Unsplash', licence: 'Unsplash License',
    use: 'The cover photo on the example Google Business Profile in Profile.jsx.',
  },
};

/* "Photo: Vitaly Gariev, Unsplash" with the photo's page linked. */
export function Credit({ photo, className = 'sc-credit', label = 'Photo' }) {
  return (
    <p className={className}>
      {label}: <a href={photo.page} target="_blank" rel="noopener noreferrer">{photo.by}, {photo.site}</a>
    </p>
  );
}

/* A photograph with AVIF first, WebP behind it, lazy unless it's asked not
   to be. `sizes` is the width it's drawn at. */
export function Photo({ photo, sizes, className = '', eager = false, alt }) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={photo.avif} sizes={sizes} />
      <source type="image/webp" srcSet={photo.webp} sizes={sizes} />
      <img
        src={photo.src}
        alt={alt ?? photo.alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}
