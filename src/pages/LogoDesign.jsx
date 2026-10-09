/*
 * /logo-design: Logo Design, the fourth arm of C4 Studios from 9 Oct 2026.
 * Caleb: "for c4 studios, we've been getting a lot of enquiries regarding
 * logo design. Please make that the 4 arms of c4 studios." The arm is called
 * Logo Design, it gets this page, and /branding-perth stays its search page.
 *
 * DIRECTION CONTRACT
 *  THESIS   A logo has to survive being used: cut in vinyl, stitched, shrunk
 *           to a 16-pixel tab. The page shows a stand-in mark passing those
 *           tests on a signwriter's mat. It refuses the logo-page default (a
 *           wall of client logos over three price cards) and the
 *           golden-circle construction grid.
 *  OWN-WORLD The bench, with its one red for start and proof stock for the
 *           prices and the verbatim answer. The arm's material: a green
 *           self-healing cutting mat with centimetre ruling and rulers in
 *           B612, an offcut of gloss black sign vinyl on white backing paper
 *           inside a weeding-box frame, the flap's matte underside, a
 *           yellow-handled weeding hook. Materials keep their colours in both
 *           themes.
 *  STORY    The visitor watches their stand-in logo weeded, sees it hold from
 *           a sign to a browser tab, sees a flat image redrawn as vector,
 *           reads five published prices, learns how a job runs and that the
 *           files are theirs, and starts a brief.
 *  FIRST VIEWPORT Left: the h1, a three-sentence lede, the red start button
 *           and a ghost "See the prices". Right (under the intro below
 *           1024px): the mat, the sheet mid-weed, its corner to pull, and the
 *           caption. The corner waits for the visitor; the clock takes it
 *           only after a real idle, and reduced motion keeps the pull.
 *  FORM     The redraw, seventh of seven structures; seed e8adeaff dealt 7, 2
 *           and 4, with 7 leading. The size run (2) is its proof section. The
 *           signwriter's docket counter (4) was declined, since proof stock
 *           already carries the prices. Every catalog challenger was
 *           declined; from the drawcord cape the page keeps one discipline:
 *           one pull moves the whole sheet.
 *  FINISH   unreviewed and undocumented is unfinished; this build ends with
 *           the finish review, the verdict, DESIGN.md, and every shipping
 *           raster carrying its provenance. The first review (9 Oct 2026)
 *           returned fix with eight points. The confirmation round passed six
 *           and called the stitching partial; the satin was rebuilt after it
 *           (DESIGN.md has the detail). The sixth point, the unsourced
 *           figures in the home page's lintel, is Caleb's call (brain
 *           site_issue 110), so the disposition stays fix until he decides.
 *
 * Built from published facts only: prices and package lines from pricing.js,
 * the ownership answer imported from branding-perth.js, and a mark that is a
 * labelled stand-in. No client logo appears: none was on record as delivered,
 * cleared and already named on /Portfolio when the page was built.
 */
import { useMemo } from 'react';
import { Link } from '@/components/c4/SiteLink';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, serviceSchema } from '@/lib/schema';
import { createPageUrl } from '@/utils';
import Sheet from '@/components/logo-design/Sheet';
import { MarkDefs } from '@/components/logo-design/Mark';
import {
  Family, Redraw, Prices, Process, Close, PRICED, FROM, REBUILD, FULL, ADDON,
} from '@/components/logo-design/sections';
import { brandingPackages } from '@/data/pricing';
import '@/components/logo-design/logo-design.css';

const PATH = '/logo-design';
const money = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;
const ESSENTIALS = brandingPackages.find((p) => p.key === 'brand-essentials');

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
    title: 'Logo Design in Perth — C4 Studios',
    description: `Logo design for Perth businesses at published prices: ${list}.`,
    path: PATH,
    jsonLd,
  });

  return (
    <div className="lg-page">
      {/* the stand-in's outlines, once, for every copy of it further down,
          and the thread for the stitched one */}
      <MarkDefs stitch />
      <section className="lg-hero" aria-labelledby="lg-h1">
        <div className="lg-frame lg-hero-grid">
          <header className="lg-intro">
            <h1 className="lg-h1" id="lg-h1">Logo design in Perth</h1>
            <p className="lg-lede">
              Your logo ends up on the sign, the shirts, the invoices and a browser tab sixteen pixels wide. We
              draw it to hold up in all of them, in colour and in one colour. Prices start at {money(FROM)}, fixed
              before the work begins.
            </p>
            <div className="lg-actions">
              <Link to={`${createPageUrl('StartProject')}?service=logo_design`} className="lg-btn-start">Start a logo brief</Link>
              <a href="#prices" className="lg-btn-ghost">See the prices</a>
            </div>
          </header>
          <figure className="lg-stage-col">
            <Sheet />
            <figcaption className="lg-stage-cap">
              A stand-in for your logo, cut from one colour of sign vinyl. Peeling off the spare is called weeding.
              The cutter follows vector lines, so a logo that only exists as an image has to be redrawn before it
              can be cut.
            </figcaption>
          </figure>
        </div>
      </section>
      <Family />
      <Redraw />
      <Prices />
      <Process />
      <Close />
    </div>
  );
}
