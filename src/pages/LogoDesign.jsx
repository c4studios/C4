/*
 * /logo-design: Logo Design, the fourth arm of C4 Studios from 9 Oct 2026.
 *
 * Rebuilt the same day to Caleb's brief, verbatim: "logo page needs some
 * ingenuity too it, as well. looking really basic so far. maybe lead with
 * the iconic '4'. include some phrasology like 'sometimes less is more' or
 * something like thjat. really dive into identity and use ours as an
 * example". The vinyl, the cutting mat, the weeding hook and the "Your
 * Business" stand-in are gone. The example is our own logo.
 *
 * DIRECTION CONTRACT
 *  THESIS   A logo has to read at every size it's used. The page puts our own
 *           mark through an eye test: the chart's top line is the 4, and
 *           stepping back reads the logo down to a 16-pixel browser tab,
 *           where the C drops away. It refuses the logo-page default (a wall
 *           of client logos over price cards) and the golden-circle grid.
 *  OWN-WORLD The exam room: a dim charcoal room, a backlit chart with its
 *           sizes in B612 in the margin and one line lit at a time, "one or
 *           two?", then the red and green duochrome. Apart from the site's
 *           start red on the buttons, the mark's own colours are the only
 *           colours in the room. The bench, proof stock and the start red
 *           carry the anatomy, the prices and the close.
 *  STORY    The visitor sees our 4, reads our mark down the chart, picks
 *           between two 16-pixel icons and sees them in real tabs, sees the
 *           mark hold on its own red and green, learns the three shapes, the
 *           gaps and the lockup, reads five published prices and starts a
 *           brief.
 *  FIRST VIEWPORT Left: the h1, the lede, the red start button and "See the
 *           prices". Right (below the words under 1024px): the 4 at the full
 *           height of the stage, on the dark chart.
 *  FORM     The eye test: candidate 7 of 7 on the ordered list, seed
 *           ff6c317a. Kept from the challengers: one line isolated at a time
 *           (the event display), literal labels (the quote grammar), the
 *           dark room (the neon circuit), the question before the answer
 *           (the treasure map), every version registered at one scale (the
 *           botanical folio), and the logo's own colours as the only inks
 *           (the risograph).
 *  FINISH   unreviewed and undocumented is unfinished; this build ends with
 *           the finish review, the verdict, DESIGN.md, and every shipping
 *           raster carrying its provenance. (The DESIGN.md entry for this
 *           world went with the report for Caleb's review, to be added when
 *           the branch is merged. Since 10 Oct 2026 the page ships
 *           photographs, each carrying its source in its EXIF.)
 *
 * 10 OCTOBER 2026, OUT OF THE EXAM ROOM
 * Caleb, verbatim: "logo site needs to be a little more engaging. you can
 * find real-life photos of etching, software and anything else relevant.
 * this will make it look more reputable. again, need to reach the standards
 * set by the web design page. doesnt need to be all about c4 studios logo."
 * The eye test stays as the opening. After "One or two?" the page leaves the
 * screen: "Most logos spend their life on things" (Run.jsx) is seven real
 * processes in real photographs (photos.js holds every source and licence),
 * each with our 4 drawn beside it the way that process would carry it.
 * "How a logo job runs" gains a drawing app's window (Workfile.jsx) where
 * our mark is built up from its real path data, step by step. The photos are
 * other people's, captioned plainly; nothing claims them as our work.
 *
 * Built from published facts only. Prices, package lines and the timeline
 * come from pricing.js, the ownership answer is imported from
 * branding-perth.js, and every shape is the real logo (geometry.js). What
 * the page says about the logo is what can be measured or seen in it: its
 * shapes, colours, sizes and uses. Nothing says what it means.
 */
import { useMemo } from 'react';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, serviceSchema } from '@/lib/schema';
import Exam from '@/components/logo-design/Exam';
import OneOrTwo from '@/components/logo-design/OneOrTwo';
import Run from '@/components/logo-design/Run';
import Shapes from '@/components/logo-design/Shapes';
import Colours from '@/components/logo-design/Colours';
import {
  Prices, Process, Close, PRICED, FROM, REBUILD, FULL, ADDON, START, money,
} from '@/components/logo-design/Commerce';
import { brandingPackages } from '@/data/pricing';
import '@/components/logo-design/logo-design.css';

const PATH = '/logo-design';
const TITLE = 'Logo Design in Perth — C4 Studios';
const ESSENTIALS = brandingPackages.find((p) => p.key === 'brand-essentials');

/* The chart's captions. Each one names where that line's size is used. */
const STEPS = [
  {
    key: 'top',
    title: 'Read it like an eye chart',
    say: 'The top line is the 4 on its own, the one part that’s in every version of our logo. It’s drawn as vector, so it stays this sharp at any size.',
  },
  {
    key: 'boot',
    title: 'Loading screen',
    say: 'Step back and the C is round it. That’s the whole mark: three shapes, the C and a 4 in two pieces. This is about the size it shows while our site loads.',
  },
  {
    key: 'nav',
    title: 'Nav bar',
    say: 'Thirty-two pixels tall, the size it sits at in the bar at the top of this page. All three shapes still read.',
  },
  {
    key: 'tab',
    title: 'Browser tab',
    say: 'Sixteen pixels. There’s no room for the C here, so it goes, and the 4 carries the logo on its own. It’s the icon on this page’s tab.',
  },
];

export default function LogoDesign() {
  const jsonLd = useMemo(() => [
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Logo Design', path: PATH },
    ]),
    serviceSchema({
      name: 'Logo design',
      description: 'Logo design for Perth businesses, from a single logo to a full brand identity, with fixed concepts and revision rounds and every file handed over.',
      url: PATH,
      serviceType: 'Logo design',
      offers: [
        ...PRICED.map((p) => ({ name: `${p.name} (${p.priceLabel})`, price: p.price })),
        ...(ADDON ? [{ name: `${ADDON.name}, with a website build`, price: ADDON.price }] : []),
      ],
    }),
  ], []);

  /* Every figure in the description is read from pricing.js, so it moves
     when a price does. */
  const parts = [
    `logos from ${money(FROM)}`,
    REBUILD ? `a redraw of the logo you have at ${money(REBUILD.price)}` : null,
    ESSENTIALS ? `brand essentials at ${money(ESSENTIALS.price)}` : null,
    FULL ? `full identities from ${money(FULL.price)}` : null,
  ].filter(Boolean);
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0];
  useDocumentHead({
    title: TITLE,
    description: `Logo design for Perth businesses at published prices: ${list}.`,
    path: PATH,
    jsonLd,
  });

  return (
    <div className="ld-page">
      <Exam
        from={money(FROM)}
        startHref={`${START}?service=logo_design`}
        tabTitle={TITLE}
        steps={STEPS}
      />
      <OneOrTwo />
      <Run />
      <Colours />
      <Shapes />
      <Prices />
      <Process />
      <Close />
    </div>
  );
}
