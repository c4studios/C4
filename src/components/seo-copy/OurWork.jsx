/*
 * Real work, shown only for what's true and visible: three sites C4 Studios
 * built, each with the title and description its home page gives Google.
 *
 * The titles and descriptions are word for word from each live home page's
 * <title> and <meta name="description">, read on 10 October 2026 (the date
 * is on the page). The case studies record the metadata as part of each
 * build: "SEO foundation — metadata, sitemap, robots, Open Graph images"
 * (Tidy Gardens), "Local SEO structure — metadata, sitemap and structured
 * data" (Aqua-Safe), "Every page is statically rendered with its own
 * metadata and structured data" (Brady), all in
 * src/components/portfolio/caseStudyData.jsx.
 *
 * Nothing here says or implies where any of these sites ranks, or what
 * traffic or work it brings in. The figures inside the descriptions are the
 * clients' own words about themselves, quoted. If a client changes their
 * title or description, re-read it from the live page and change it here,
 * with the date.
 *
 * The screenshots are the portfolio's own captures in public/captures/.
 */
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/components/c4/SiteLink';

export const CHECKED = '10 October 2026';

export const OUR_WORK = [
  {
    name: 'Brady Electrical',
    site: 'bradyelectrical.com.au',
    url: 'https://bradyelectrical.com.au/',
    slug: 'brady-electrical',
    img: '/captures/bradyelectrical-com-au/desktop/01-hero-800.webp',
    title: 'Brady Electrical | Perth Electrician & Air Conditioning',
    desc: 'Perth electrician for homes, split-system air conditioning, property maintenance and mining-grade industrial work. 15+ years, 5-year workmanship warranty, fully licensed and insured. Free quotes. Call 0400 141 347.',
  },
  {
    name: 'Aqua-Safe Plumbing',
    site: 'aquasafeplumbing.com.au',
    url: 'https://aquasafeplumbing.com.au/',
    slug: 'aqua-safe-plumbing',
    img: '/captures/aquasafeplumbing-com-au/desktop/01-hero-800.webp',
    title: 'Aqua-Safe Plumbing & Maintenance, Perth | Plumbing, done properly',
    desc: 'Perth maintenance plumbers and gas fitters. Blocked drains, hot water, gas fitting and water filtration, done properly. Licensed, insured, upfront.',
  },
  {
    name: 'Tidy Gardens Australia',
    site: 'tidygardens.com.au',
    url: 'https://tidygardens.com.au/',
    slug: 'tidy-gardens-australia',
    img: '/captures/tidygardens-com-au/desktop/01-hero-800.webp',
    title: 'Tidy Gardens Australia | Reticulation, Lawns & Garden Care, Perth',
    desc: 'Perth’s one-stop garden and reticulation specialists. Reticulation repairs, smart controllers, mowing, garden maintenance and full clean-ups. Waterwise accredited, 20+ years, full warranty.',
  },
];

export default function OurWork() {
  return (
    <section className="sc-sec sc-work" aria-labelledby="sc-work-h">
      <div className="sc-frame sc-work-grid">
        <div className="sc-work-head">
          <h2 className="sc-h2" id="sc-work-h">From sites we&rsquo;ve built</h2>
          <p className="sc-say">
            Every page we build gets its own title and description. Here&rsquo;s what three of them give Google today,
            and each one names the trade and the city.
          </p>
          <p className="sc-fine">
            Read from each live home page on {CHECKED}. The descriptions are the businesses&rsquo; own words about
            themselves, quoted as published.
          </p>
        </div>
        <ul className="sc-work-list">
          {OUR_WORK.map((w) => (
            <li key={w.slug} className="sc-work-row">
              <Link to={`/CaseStudy/${w.slug}`} className="sc-work-shot" aria-label={`${w.name} case study`}>
                <img src={w.img} alt={`The ${w.name} home page.`} width={800} height={500} loading="lazy" decoding="async" />
              </Link>
              <div className="sc-work-snip">
                <p className="sc-work-site">
                  <a href={w.url} target="_blank" rel="noopener noreferrer">
                    {w.site}<ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </p>
                <p className="sc-work-title">{w.title}</p>
                <p className="sc-work-desc">{w.desc}</p>
                <p className="sc-work-more">
                  <Link to={`/CaseStudy/${w.slug}`}>How we built {w.name}</Link>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
