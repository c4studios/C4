/*
 * The board parts the C4Site pages around the hub build from: the sector
 * pages (office and business, law), the schools page, the free packs page and
 * the enquiry form. Same world as the hub (/Foresight): the board, chalk
 * headings with one yellow underline, the frame that never gets rubbed out,
 * paper held to the board by a magnet.
 *
 * 24 Sep 2026: the single sector template is gone. Business and law were one
 * page with the words swapped (hero, ticked list, rules, a sentence), and it
 * read cheaply beside the hub. Each is now its own page built around its own
 * material: the prompt the room fixes together, the AI draft checked the way
 * the session teaches, that sector's run of the day, the sheets the team
 * keeps. This file holds only the parts they share.
 *
 * Nothing here animates. The prerendered HTML is the whole page, so crawlers
 * that skip JavaScript read everything and useStaticMode has nothing to gate.
 */
import { Fragment } from 'react';
import { Link } from '@/components/c4/SiteLink';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import { C4SITE_QUOTE_FACTORS, C4SIGHT_PRICING_NOTE } from '@/data/pricing';
import { FORMATS, RUN_OF_DAY } from '@/data/c4siteDay';
import {
  ChalkHeading, MarkArrow, MarkCross, MarkTick, MarkUnderline, RulesFrame, VRule,
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

/* The top of a board page: where you are, the heading, what it is, what to do.
   `trace` picks what the last class left half-erased on the right of the
   board (sight-arm.css): a week planner for business, a struck citation for
   law, picture cards for schools. Every page gets its own. */
export function BoardHero({ crumb, heading, mark, intro, by, trace, children }) {
  return (
    <header className={`sg-hero sg-sp-hero${trace ? ` sg-hero--${trace}` : ''}`}>
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
        {by && <p className="sg-hero-by">{by}</p>}
        <div className="sg-tray" aria-hidden="true">
          <span className="sg-tray-ledge" />
          <span className="sg-tray-chalk" />
          <span className="sg-tray-marker" />
        </div>
      </div>
    </header>
  );
}

/* The rules in the frame that never gets rubbed out. A point is a sentence,
   or { lead, body }. Pass `children` instead of `points` to write the right
   column by hand. */
export function RulesBlock({ heading, intro, points, id, children, aside }) {
  return (
    <section className="sg-section sg-govern" id={id}>
      <div className="sg-wrap">
        <div className="sg-rules sg-rules--roomy">
          <RulesFrame />
          <div className="sg-rules-grid sg-rules-grid--split">
            <div>
              <h2 className="sg-h2">{heading}</h2>
              {intro && <p className="sg-rules-copy">{intro}</p>}
              {aside}
            </div>
            <div>
              {children ??
                points.map((point) => {
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

/* What stays out of the tool: crossed, never ticked. */
export function CrossList({ items, className = '' }) {
  return (
    <ul className={`sg-crosslist ${className}`}>
      {items.map((item) => (
        <li key={item}>
          <MarkCross />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* The six prompts in a sector's pack, as the jobs the room practises on.
   Each is a title and the line saying when you would reach for it. */
export function JobList({ heading, sub, jobs }) {
  return (
    <section className="sg-section">
      <div className="sg-wrap">
        <h2 className="sg-h2">{heading}</h2>
        {sub && <p className="sg-sub">{sub}</p>}
        <ul className="sg-jobs">
          {jobs.map((job) => (
            <li key={job.title}>
              <h3>{job.title}</h3>
              <p>{job.for}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* The run of a day, block by block, from src/data/c4siteDay.js, with what
   this sector does in each block. `notes` is keyed by block label; the
   wording traces to c4sight-workshop-curriculum.md (the block outlines and
   the sector module swaps). */
export function DayPlan({ id = 'day', heading, aim, notes }) {
  const parts = [
    { key: 'am', format: FORMATS[0], lead: 'The morning, and the whole of a half day' },
    { key: 'pm', format: FORMATS[1], lead: 'After lunch, on a full day' },
  ];
  return (
    <section className="sg-section sg-day" id={id}>
      <div className="sg-wrap">
        <h2 className="sg-h2">{heading}</h2>
        {aim && <p className="sg-sub">{aim}</p>}
        <div className="sg-day-grid">
          {parts.map((part, i) => (
            <Fragment key={part.key}>
              <div>
                <div className="sg-format-top">
                  <h3>{part.format.label}</h3>
                  <span className="sg-format-duration">{part.format.duration}</span>
                </div>
                <p className="sg-plan-lead">{part.lead}</p>
                <ol className={part.key === 'am' ? 'sg-plan sg-plan--notes' : 'sg-plan sg-plan--pm sg-plan--notes'}>
                  {RUN_OF_DAY.filter((b) => b.part === part.key).map((b, k) => (
                    <li key={`${b.label}-${k}`} className={b.rest ? 'sg-plan-row sg-plan-row--rest' : 'sg-plan-row'}>
                      <span className="sg-plan-name">{b.label}</span>
                      <span className="sg-plan-min">{b.min} min</span>
                      {!b.rest && notes[b.label] && <span className="sg-plan-note">{notes[b.label]}</span>}
                    </li>
                  ))}
                </ol>
              </div>
              {i === 0 && <VRule />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* The sheets the team takes home, pinned to the board. Real renders of the
   printed take-homes (c4sight-schools/scripts/build-take-homes.mjs), stored
   in public/c4site-art/. */
export function KeepSheets({ heading, sub, sheets, note }) {
  return (
    <section className="sg-section sg-keep">
      <div className="sg-wrap">
        <h2 className="sg-h2">{heading}</h2>
        {sub && <p className="sg-sub">{sub}</p>}
        <div className="sg-sheets">
          {sheets.map((sheet) => (
            <figure key={sheet.src} className="sg-sheet">
              <div className="sg-sheet-img">
                <img src={sheet.src} alt={sheet.alt} width="640" height="905" loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <strong>{sheet.name}</strong>
                <span>{sheet.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        {note && <p className="sg-keep-note">{note}</p>}
      </div>
    </section>
  );
}

/* The end of a workplace sector page: the line, how a quote is set, the one
   button, the small print. The quote working is the hub's, drawn from
   C4SITE_QUOTE_FACTORS, so the two pages can never disagree. */
export function QuoteClose({ heading, mark, enquiryUrl, disclaimer }) {
  return (
    <section className="sg-close sg-close--quote">
      <div className="sg-wrap">
        <ChalkHeading as="h2" text={heading} mark={mark} className="sg-h2" />
        <p className="sg-hand sg-cost-sum">
          <span className="sg-sr">
            A workplace quote depends on {C4SITE_QUOTE_FACTORS.join(', ')}. It comes to one fixed price.
          </span>
          <span aria-hidden="true">
            {C4SITE_QUOTE_FACTORS.map((factor, i) => (
              <Fragment key={factor}>
                {i > 0 && <span className="sg-cost-op"> + </span>}
                <span className="sg-cost-term">{factor}</span>
              </Fragment>
            ))}
            <span className="sg-cost-op"> = </span>
            <span className="sg-hand-em">
              one fixed price
              <MarkUnderline />
            </span>
          </span>
        </p>
        <p className="sg-sub">
          Workplace training is quoted per team. A morning for six people down the road is a different
          job from a full day for forty across two sites, so there is no list price. Tell us about your
          team and you will have one fixed price after a short call.
        </p>
        <div className="sg-close-cta">
          <Link to={enquiryUrl} className="sg-btn">
            Request a workshop
            <MarkArrow />
          </Link>
        </div>
        <p className="sg-disclaimer">
          {disclaimer ? `${disclaimer} ` : ''}
          {C4SIGHT_PRICING_NOTE}
        </p>
      </div>
    </section>
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
