/*
 * /seo-and-copywriting: SEO and copywriting as a service (Caleb, 2 Oct 2026:
 * "now that i'm moving c4 site off the website once it's ready to go, i think
 * we need to start advertising seo and copywriting as a service"). In the
 * Services menu, and the SEO door on the home page.
 *
 * Rebuilt 8 Oct 2026 as the climb on a paste-up board, and rebuilt again on
 * 9 Oct 2026 from Caleb's note: "the seo page in it's entirety just doesn't
 * look good ... i like the idea that the seo page's 'gimmick' is that as we
 * scroll, we get to see the search result increasingly higher". The climb
 * stays; the board, the graph paper, the pencil and the invented listings go.
 *
 * DIRECTION CONTRACT
 *  THESIS   Ranking, shown as precise type. Your listing climbs an example
 *           results page, one piece of work at a time. It refuses the SEO
 *           page of graphs and promises, and a cloned Google screen.
 *  OWN-WORLD The bench: warm paper, ink, hairlines, one red (the caret and
 *           the start button), proof stock for prices and answers quoted
 *           word for word. The results are set on it like an annotated
 *           reference page: a rail of position keys, stand-in results as
 *           ruled lines, one horizon where page one ends. Your listing is
 *           the one sheet you could lift; the work marks its words.
 *  STORY    The visitor sees their business just off page one, watches each
 *           piece of work move it up, hears that nobody can promise first
 *           place, reads five published prices, and starts.
 *  FIRST VIEWPORT Left: the h1 at display size, the lede, the red start
 *           button, "See the prices", the example switch. Right (a band
 *           below 1024px): the results page, your listing 11th, under the
 *           horizon, its key struck.
 *  FORM     The brief's own climb. Seed 0cb90b57 dealt the AFL ladder, then
 *           the eye-level shelf; both failed on truth (invented points,
 *           bought placement), so the brief's direction is built, raised by
 *           the challengers below.
 *  FINISH   unreviewed and undocumented is unfinished; this build ends with
 *           the finish review, the verdict, DESIGN.md, and every shipping
 *           raster carrying its provenance.
 *
 * Raised by the dealt challengers (all declined, each kept for one thing):
 *   the centre-rail reference page: keys on a rail, hairlines at one pixel;
 *   the struck cathode stack: every position present as a ghost, yours struck;
 *   the plankton wake: the trail your listing leaves, ticked where it held;
 *   the weather-project sun: the end of page one as the page's one horizon;
 *   the phosphor terminal: state printed as words, never a badge;
 *   the VU meter: the listing moves with weight, never by jumps;
 *   the tensegrity column: each piece of work marks the exact words it changes.
 *
 * Built from published facts only: prices from pricing.js, answers imported
 * from the site's own articles, and an example search labelled as one.
 *
 * 10 Oct 2026, from Caleb's note: "seo and copywrite page looking better but
 * could also do with some imagery and overal more components/impressive
 * design". The climb stays the one moment. After it, the work is shown as
 * objects: the example listing first on a real phone (OnPhone), the audit
 * as a read-out (Audit), the rewrite on an example home page (Rewrite),
 * three real sites' titles as published (OurWork), an example Google
 * Business Profile (Profile) and six months of a plan (Months). Four real
 * photographs (Unsplash and Pexels, sources in seo-copy/photos.jsx and
 * each file's EXIF) and the portfolio's own captures; no generated images.
 * Every example says it's an example; every plan line is read from
 * pricing.js.
 */
import { useMemo } from 'react';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, serviceSchema } from '@/lib/schema';
import { seoPackages } from '@/data/pricing';
import Climb from '@/components/seo-copy/Climb';
import OnPhone from '@/components/seo-copy/OnPhone';
import Audit from '@/components/seo-copy/Audit';
import Rewrite from '@/components/seo-copy/Rewrite';
import OurWork from '@/components/seo-copy/OurWork';
import Profile from '@/components/seo-copy/Profile';
import Months from '@/components/seo-copy/Months';
import {
  Guarantee, Prices, Writing, Questions, Close, COPY_ADDON, FROM_ONE_OFF, FROM_MONTHLY,
} from '@/components/seo-copy/sections';
import '@/components/seo-copy/seo-copy.css';
import '@/components/seo-copy/seo-more.css';

const PATH = '/seo-and-copywriting';
const money = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;

export default function SeoCopy() {
  const jsonLd = useMemo(() => [
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'SEO & Copywriting', path: PATH },
    ]),
    serviceSchema({
      name: 'SEO',
      description: 'Technical SEO, on-page optimisation and monthly plans with articles, for Perth businesses.',
      url: PATH,
      serviceType: 'Search engine optimisation',
      offers: seoPackages
        .filter((p) => typeof p.price === 'number')
        .map((p) => ({ name: `SEO ${p.name} (${p.priceLabel}${p.priceSuffix ? `, ${p.priceSuffix}` : ''})`, price: p.price })),
    }),
    serviceSchema({
      name: 'Copywriting',
      description: 'Website copy and articles for Perth businesses, written plainly with every figure sourced.',
      url: PATH,
      serviceType: 'Copywriting',
      offers: COPY_ADDON ? [{ name: 'Copywriting package, with a website build', price: COPY_ADDON.price }] : [],
    }),
  ], []);

  /* Every figure in the description is read from pricing.js, so it moves
     when a price does. */
  const copyLine = COPY_ADDON ? `, website copy ${money(COPY_ADDON.price)} with a build` : '';
  useDocumentHead({
    title: 'SEO & Copywriting in Perth — C4 Studios',
    description: `SEO and copywriting for Perth businesses at published prices: one-off SEO from ${money(FROM_ONE_OFF)}, monthly plans from ${money(FROM_MONTHLY)}${copyLine}.`,
    path: PATH,
    jsonLd,
  });

  return (
    <div className="sc-page">
      <Climb />
      <Guarantee />
      <OnPhone />
      <Audit />
      <Writing />
      <Rewrite />
      <OurWork />
      <Profile />
      <Months />
      <Prices />
      <Questions />
      <Close />
    </div>
  );
}
