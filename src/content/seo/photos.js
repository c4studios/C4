/*
 * Every photograph on /insights and the articles, with where it came from.
 *
 * Added 15 October 2026, when the articles got imagery (Caleb, that day:
 * "they also need to be engaging to read, so source imagery for them").
 *
 * Each one is a real photograph from Unsplash (https://unsplash.com/license)
 * or Pexels (https://www.pexels.com/license/). On 15 Oct 2026 each photo's own
 * page was read: the Unsplash ones showed "Free to use under the Unsplash
 * License" and none is an Unsplash+ photo; the Pexels ones showed the licence
 * as "Free". The original file was downloaded from each and is kept outside
 * the repo, in C4-Internal/article-masters/. scripts/article-photos.mjs cuts
 * them to AVIF and WebP and writes this record into every file's EXIF
 * ImageDescription, and builds each article's share card from its hero.
 *
 * What the pages may say about them: what's pictured, plainly. None of them
 * shows C4 Studios work or a C4 client, and nothing says or implies it does.
 * No face is the subject of any of them. Business names that were legible are
 * cropped out (the café and coffee-roaster names around the price board) or
 * blurred (the maker's name on the excavator boom, the brand on the props and
 * the power board). No image model was used anywhere.
 *
 * Plain data, so the cutting script can read it in Node as well. Crops and
 * blurs are in the original's pixels; `size` is the crop's.
 */
const DOWNLOADED = '15 October 2026';
const UNSPLASH = { source: 'Unsplash', licence: 'Unsplash License', licenceUrl: 'https://unsplash.com/license' };
const PEXELS = { source: 'Pexels', licence: 'Pexels License', licenceUrl: 'https://www.pexels.com/license/' };

const WIDTHS = [480, 800, 1200, 1600, 2000];

export const PHOTOS = [
  {
    ...UNSPLASH,
    key: 'demolition',
    master: 'unsplash-Y97fauNkNA8-koenig-demolition.jpg',
    page: 'https://unsplash.com/photos/a-building-being-demolished-with-a-crane-in-front-of-it-Y97fauNkNA8',
    photographer: 'Mark König',
    profile: 'https://unsplash.com/@markkoenig',
    subject: 'An older building being demolished in Berlin, beside old buildings that were renovated (the photo page gives the place and says so).',
    alt: 'A long-reach excavator pulling down the last walls of an old apartment block in Berlin, right beside a row of old buildings that were renovated instead.',
    crop: { left: 689, top: 0, width: 3711, height: 2474 },
    /* the demolition firm's name, on the boom and on the dipper arm */
    blur: [
      { poly: [[2160, 1225], [2262, 1240], [2165, 1650], [2060, 1625]], sigma: 14 },
      { poly: [[2388, 1540], [2442, 1540], [2434, 2000], [2386, 2000]], sigma: 12 },
    ],
    ogPosition: 'right',
    use: 'the hero of /website-redesign-vs-starting-again/',
  },
  {
    ...UNSPLASH,
    key: 'renovation',
    master: 'unsplash-biRt6RXejuk-lehner-renovation.jpg',
    page: 'https://unsplash.com/photos/room-renovation-with-metal-support-poles-biRt6RXejuk',
    photographer: 'Stefan Lehner',
    profile: 'https://unsplash.com/@st_lehner',
    subject: 'A room in Switzerland under renovation: steel props hold timber beams against the ceiling over a floor of rubble.',
    alt: 'A room stripped back to its walls for a renovation. Steel props hold timber beams up against the ceiling, broken tiles cover the floor and two shovels lean on the wall.',
    crop: { left: 0, top: 0, width: 4889, height: 3259 },
    /* the prop maker's name on three of the load labels */
    blur: [
      { poly: [[1305, 190], [1415, 190], [1415, 385], [1305, 385]], sigma: 7 },
      { poly: [[1828, 943], [1877, 943], [1877, 1017], [1828, 1017]], sigma: 5 },
      { poly: [[3555, 185], [3665, 185], [3665, 360], [3555, 360]], sigma: 7 },
    ],
    use: 'the redesign section of /website-redesign-vs-starting-again/',
  },
  {
    ...UNSPLASH,
    key: 'tags',
    master: 'unsplash-KaeaUITiWnc-kamp-tags.jpg',
    page: 'https://unsplash.com/photos/four-paper-card-tags-KaeaUITiWnc',
    photographer: 'Angèle Kamp',
    profile: 'https://unsplash.com/@angelekamp',
    subject: 'Four blank card swing tags hanging on strings.',
    alt: 'Four blank swing tags hanging on strings against a pale wall. None of them has a price on it.',
    crop: { left: 0, top: 0, width: 5184, height: 3456 },
    ogPosition: 'centre',
    use: 'the hero of /why-web-designers-hide-their-prices/',
  },
  {
    ...UNSPLASH,
    key: 'price-board',
    master: 'unsplash-QIXmEEzgu-M-croissant-priceboard.jpg',
    page: 'https://unsplash.com/photos/coffee-price-label-sign-QIXmEEzgu-M',
    photographer: 'Croissant',
    profile: 'https://unsplash.com/@getcroissant',
    subject: 'A felt letter board of coffee prices on a café counter in Brooklyn (the photo page names the café; the crop leaves its name, and a roaster\'s box, out of frame).',
    alt: 'A felt letter board on a café counter listing each drink with its price: espresso 3, cappuccino 4, latte 4.5.',
    crop: { left: 1700, top: 1400, width: 3800, height: 2533 },
    ogPosition: 'centre',
    use: 'the hero of /how-much-does-a-website-cost-perth/',
  },
  {
    ...UNSPLASH,
    key: 'estate',
    master: 'unsplash-zBHU08hdzhY-wheeler-houses.jpg',
    page: 'https://unsplash.com/photos/aerial-photography-houses-zBHU08hdzhY',
    photographer: 'Blake Wheeler',
    profile: 'https://unsplash.com/@blakesox',
    subject: 'An aerial view of a housing development in American Fork, Utah (the photo page gives the place).',
    alt: 'Looking straight down on a new housing estate: rows of near-identical houses with the same grey roofs, the same driveways and the same squares of lawn.',
    crop: { left: 0, top: 178, width: 3890, height: 2593 },
    ogPosition: 'centre',
    use: 'the hero of /wix-squarespace-vs-custom-website/',
  },
  {
    ...PEXELS,
    key: 'power-boards',
    master: 'pexels-5544612-mossholder-cables.jpg',
    page: 'https://www.pexels.com/photo/sockets-and-cables-5544612/',
    photographer: 'Tim Mossholder',
    profile: 'https://www.pexels.com/@timmossholder/',
    subject: 'Power boards and plug-in adaptors chained together and taped to a white wall.',
    alt: 'Power boards chained one into the next and held to a white wall with blue painter\'s tape, an adaptor in every socket and cables trailing down the wall.',
    crop: { left: 0, top: 300, width: 5137, height: 3425 },
    /* the brand on the power board */
    blur: [{ poly: [[2080, 2058], [2185, 2058], [2185, 2100], [2080, 2100]], sigma: 6 }],
    ogPosition: 'left',
    use: 'the hero of /wordpress-vs-nextjs/',
  },
  {
    ...UNSPLASH,
    key: 'table-saw',
    master: 'unsplash-ATDVWSSsqZU-mangano-tablesaw.jpg',
    page: 'https://unsplash.com/photos/person-holding-white-wooden-board-ATDVWSSsqZU',
    photographer: 'Jessica Mangano',
    profile: 'https://unsplash.com/@jfdelp',
    subject: 'A man using a portable table saw on a lawn in Connecticut (the photo page gives the place). Only his hands and forearms are in frame.',
    alt: 'Two hands feeding a pale timber board across a portable table saw set up on a lawn, with half-built plywood boxes lying in the grass behind.',
    crop: { left: 0, top: 2100, width: 3930, height: 2620 },
    ogPosition: 'centre',
    use: 'the hero of /diy-website-vs-hiring-a-designer/',
  },
  {
    ...PEXELS,
    key: 'calendar',
    master: 'pexels-9810172-barbhuiya-calendar.jpg',
    page: 'https://www.pexels.com/photo/close-up-photo-of-red-pins-on-a-calendar-9810172/',
    photographer: 'Towfiqu barbhuiya',
    profile: 'https://www.pexels.com/@towfiqu-barbhuiya-3440682/',
    subject: 'A printed month calendar with red push pins in four dates and the 30th circled.',
    alt: 'A printed month calendar with red push pins stuck into four of the dates and the 30th circled in red.',
    crop: { left: 0, top: 0, width: 4501, height: 3003 },
    ogPosition: 'right',
    use: 'the hero of /how-long-does-a-website-take/',
  },
  {
    ...PEXELS,
    key: 'dockets',
    master: 'pexels-37539842-ustun-dockets.jpg',
    page: 'https://www.pexels.com/photo/restaurant-kitchen-order-tickets-management-37539842/',
    photographer: 'Betül Üstün',
    profile: 'https://www.pexels.com/@betul-ustun-236006735/',
    subject: 'A hand taking an order docket from a rail of tickets in a restaurant kitchen. Only the hand is in frame.',
    alt: 'A hand pulling one order docket off a rail of tickets in a restaurant kitchen, under a shelf of stacked plates.',
    crop: { left: 0, top: 2000, width: 4672, height: 3115 },
    ogPosition: 'centre',
    use: 'the hero of /do-small-businesses-need-seo/',
  },
].map((p) => ({ downloaded: DOWNLOADED, widths: WIDTHS, size: [p.crop.width, p.crop.height], ...p }));

export function photo(key) {
  return PHOTOS.find((p) => p.key === key) || null;
}
