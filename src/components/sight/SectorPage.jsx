/*
 * The C4Site sector pages (office and business, law), and the board parts the
 * schools page builds from. Same world as the hub (/Foresight): the board,
 * chalk headings with one yellow underline, the rules frame that never gets
 * rubbed out, paper held to the board by a magnet. Replaced the generic C4
 * skin on 21 Sep 2026.
 *
 * Nothing here animates. The prerendered HTML is the whole page, so crawlers
 * that skip JavaScript read everything and useStaticMode has nothing to gate.
 * Per-sector copy lives in each page file so it stays bespoke.
 */
import { Link } from '@/components/c4/SiteLink';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import {
  ChalkDefs, ChalkHeading, MarkArrow, MarkTick, RulesFrame, useForceDark,
} from '@/components/sight-arm/kit';

export const enquiryUrlFor = (sectorKey, extra = '') =>
  createPageUrl('TrainingEnquiry') + (sectorKey ? `?sector=${sectorKey}${extra}` : '');

/* Head tags and schema for a sector page. `offers` is passed straight to
   serviceSchema (the schools page lists the incursion price). */
export function useSectorHead(data, offers) {
  useDocumentHead({
    title: data.meta.title,
    description: data.meta.description,
    path: data.path,
    jsonLd: [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'C4Site', path: '/Foresight' },
        { name: data.sector, path: data.path },
      ]),
      serviceSchema({
        name: data.meta.title,
        description: data.meta.description,
        url: data.path,
        serviceType: data.serviceType,
        offers,
      }),
    ],
  });
}

/* The top of a board page: where you are, the heading, what it is, what to do. */
export function BoardHero({ crumb, heading, mark, intro, children }) {
  return (
    <header className="sg-hero sg-sp-hero">
      <div className="sg-wrap">
        <nav aria-label="Breadcrumb">
          <ol className="sg-crumb">
            <li>
              <Link to={createPageUrl('Foresight')}>C4Site</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{crumb}</li>
          </ol>
        </nav>
        <ChalkHeading text={heading} mark={mark} className="sg-chalk-edge" />
        <p className="sg-lede">{intro}</p>
        {children}
        <div className="sg-tray" aria-hidden="true">
          <span className="sg-tray-ledge" />
          <span className="sg-tray-chalk" />
          <span className="sg-tray-marker" />
        </div>
      </div>
    </header>
  );
}

/* The rules in the frame. A point is a sentence, or { lead, body }. */
export function RulesBlock({ lead, heading, intro, points, id }) {
  return (
    <section className="sg-section sg-govern" id={id}>
      <div className="sg-wrap">
        <div className="sg-rules sg-rules--roomy">
          <RulesFrame />
          <div className="sg-rules-grid sg-rules-grid--split">
            <div>
              {lead && <p className="sg-rules-lead">{lead}</p>}
              <h2 className="sg-h2">{heading}</h2>
              {intro && <p className="sg-rules-copy">{intro}</p>}
            </div>
            <div>
              {points.map((point) => {
                const key = typeof point === 'string' ? point : point.lead;
                return (
                  <div key={key} className="sg-rule-item">
                    <MarkTick />
                    {typeof point === 'string' ? (
                      <p className="sg-rule-text">{point}</p>
                    ) : (
                      <div>
                        <strong>{point.lead}</strong>
                        <span>{point.body}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TaskList({ items }) {
  return (
    <ul className="sg-tasklist">
      {items.map((item) => (
        <li key={item}>
          <MarkTick />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* The last thing on the board: one line, one button, then the small print. */
export function BoardClose({ heading, mark, sub, cta, to, disclaimer }) {
  return (
    <section className="sg-close">
      <div className="sg-wrap">
        <ChalkHeading as="h2" text={heading} mark={mark} className="sg-h2" />
        {sub && <p className="sg-sub">{sub}</p>}
        <div className="sg-close-cta">
          <Link to={to} className="sg-btn">
            {cta}
            <MarkArrow />
          </Link>
        </div>
        {disclaimer && <p className="sg-disclaimer">{disclaimer}</p>}
      </div>
    </section>
  );
}

export default function SectorPage({ data }) {
  useForceDark();
  useSectorHead(data);
  const enquiryUrl = enquiryUrlFor(data.sectorKey);
  const hubUrl = createPageUrl('Foresight');

  return (
    <div className="sg-root">
      <ChalkDefs />

      <BoardHero crumb={data.sector} heading={data.heading} mark={data.mark} intro={data.heroIntro}>
        <div className="sg-hero-cta sg-hero-cta--pair">
          <Link to={enquiryUrl} className="sg-btn">
            Request a workshop
            <MarkArrow />
          </Link>
          <Link to={hubUrl} className="sg-btn sg-btn--ghost">
            How a day runs
          </Link>
        </div>
      </BoardHero>

      <section className="sg-section">
        <div className="sg-wrap">
          <h2 className="sg-h2">{data.tasks.heading}</h2>
          <TaskList items={data.tasks.items} />
        </div>
      </section>

      <RulesBlock
        lead="Safety first"
        heading={data.risk.heading}
        intro={data.risk.intro}
        points={data.risk.points}
      />

      {data.credibility && (
        <section className="sg-section">
          <div className="sg-wrap">
            <div className="sg-paper sg-paper--note">
              <h2>{data.credibility.heading}</h2>
              <p>{data.credibility.body}</p>
            </div>
          </div>
        </section>
      )}

      <section className="sg-section">
        <div className="sg-wrap">
          <h2 className="sg-h2">What good looks like</h2>
          <p className="sg-win">{data.win}</p>
          <p className="sg-win-note">
            {data.governanceNote} The <Link to={hubUrl}>C4Site page</Link> sets out the half-day
            and full-day formats block by block, and how a quote is worked out.
          </p>
        </div>
      </section>

      <BoardClose
        heading={data.ctaHeading}
        mark={data.ctaMark}
        sub="Tell us about your team and we will put together the right session."
        cta="Request a workshop"
        to={enquiryUrl}
        disclaimer={data.disclaimer}
      />
    </div>
  );
}
