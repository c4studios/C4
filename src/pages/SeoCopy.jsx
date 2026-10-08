/*
 * /seo-and-copywriting: SEO and copywriting as a service (Caleb, 2 Oct 2026:
 * "now that i'm moving c4 site off the website once it's ready to go, i think
 * we need to start advertising seo and copywriting as a service"). In the
 * Services menu, and the fourth door on the home page once C4Site moves off.
 *
 * Rebuilt 8 Oct 2026 from Caleb's brief: "the seo page needs to be a lot
 * more pretty to look at ... seo is all about ranking high on google, so
 * find a way to express that." The three trial openings (?layout=room |
 * answer | edit) are gone; this is the one page.
 *
 * DIRECTION CONTRACT
 *  THESIS   Ranking, shown happening. An example search's first page sits
 *           on the bench as a paste-up board, and the visitor's listing
 *           climbs from the top of page two to first as they read what each
 *           piece of work does. It refuses the service-page default (hero,
 *           three cards, price cards, call to action) and the SEO page of
 *           charts and promises.
 *  OWN-WORLD The bench (warm paper, ink, one red that means start, proof
 *           stock for prices and verbatim answers). The arm's own material
 *           is the paste-up board: white board ruled in non-repro blue,
 *           register marks, results as strips of card stock with the
 *           bench's contact shadow, positions in B612 down the edge, a cut
 *           line at page two, graphite pencil for the edits. The board stays
 *           paper in both themes.
 *  STORY    The visitor sees their business missing from page one, watches
 *           each piece of work move it up, is told plainly that nobody can
 *           promise first place, reads five published prices from $249 a
 *           month, sees how the writing works, and starts a project.
 *  FIRST VIEWPORT Left: the h1 at display size, a two-sentence lede, the
 *           red start button and a quiet "See the prices", then the example
 *           searches. Right (a band across the top below 1024px): the board,
 *           the query being typed with the red caret, ten results, the cut
 *           line, and the visitor's listing at 11th.
 *  FORM     The climb (ranked first of seven structures). Seed 573d879d dealt
 *           the question desk, page one month by month, and the crawler's
 *           view; the brief's idea outranked the roll. The month-by-month
 *           card gave the stills (each step keeps its own picture of the
 *           board) and the honesty about time; the question desk gave the
 *           verbatim answers; the crawler's view was declined (a reflex
 *           DESIGN.md refuses).
 *  FINISH   unreviewed and undocumented is unfinished; this build ends with
 *           the finish review, the verdict, DESIGN.md, and every shipping
 *           raster carrying its provenance.
 *
 * Built from published facts only: prices from pricing.js, answers imported
 * from the site's own articles, and an example board labelled as invented.
 */
import { useMemo } from 'react';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, serviceSchema } from '@/lib/schema';
import { seoPackages } from '@/data/pricing';
import Climb from '@/components/seo-copy/Climb';
import { GraphiteDefs } from '@/components/seo-copy/pencil';
import {
  Guarantee, Prices, Writing, Questions, Close, COPY_ADDON, FROM_ONE_OFF, FROM_MONTHLY,
} from '@/components/seo-copy/sections';
import '@/components/seo-copy/seo-copy.css';

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
      <GraphiteDefs />
      <Climb />
      <Guarantee />
      <Prices />
      <Writing />
      <Questions />
      <Close />
    </div>
  );
}
