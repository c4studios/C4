/*
 * /ai-training-for-law-firms — C4Site for law firms.
 *
 * Rebuilt 24 Sep 2026 around the page's own material. The centrepiece is an
 * AI draft file note, checked the way the session teaches: two lines ticked
 * against the clause they cite, one wrong about what its clause says, one
 * opinion the prompt asked it not to give, and one case that does not exist.
 *
 * INVENTED FOR THIS PAGE, AND SAID SO ON IT: the lease, its clause numbers,
 * the draft and "Quenda Holdings Pty Ltd v Stirling Lane Traders". The case
 * name was searched on 24 Sep 2026 and matched nothing (an earlier choice,
 * "Harlow v Pinecrest", was already in use as a sample case elsewhere). It
 * carries no report citation or court number on purpose, so it can never
 * point at a real judgment.
 *
 * SOURCES. The prompt, the six jobs, the follow-up and the checks are from
 * the law firms prompt pack (c4sight-schools/deliverables/take-homes/
 * content.mjs). What stays out is that pack's data-safety one-pager. The
 * run-of-day notes trace to c4sight-workshop-curriculum.md (blocks 0 to 8
 * and the law module swap).
 *
 * CREDENTIAL. "Partway through a law degree" is the only credential line
 * permitted (c4-positioning). Not "JD student", not "understands the conduct
 * obligations": the fact audit of 24 Sep 2026 found both here and they came
 * out. Nothing on this page is legal advice, and it says so.
 */
import { Link } from '@/components/c4/SiteLink';
import {
  BoardHero, CrossList, DayPlan, JobList, KeepSheets, QuoteClose, RulesBlock, enquiryUrlFor, useSectorHead,
} from '@/components/sight/SectorPage';
import { ChalkDefs, MarkArrow, MarkCross, MarkTick, useForceDark } from '@/components/sight-arm/kit';

const DATA = {
  sector: 'Law firms',
  sectorKey: 'law',
  path: '/ai-training-for-law-firms',
  serviceType: 'AI literacy training for law firms',
  meta: {
    title: 'AI training for law firms in Perth',
    description:
      'Verification-first AI workshops for law firms in Perth. Faster drafting and summarising, with a checking routine built in. Nothing taught is legal advice.',
  },
};

const PROMPT =
  'Summarise the termination and notice clauses in this commercial lease for a file note. Give the clause number for every point and say what each clause requires. Do not interpret it.';

/* verdict: 'ok' is ticked, 'wrong' is crossed and corrected, 'out' is struck. */
const DRAFT = [
  {
    text: 'Either party may end the lease by giving three months’ written notice (cl 12.1).',
    verdict: 'ok',
    pen: 'Read cl 12.1. It says this.',
  },
  {
    text: 'Notice must be sent by registered post (cl 12.3).',
    verdict: 'wrong',
    pen: 'cl 12.3 says “in writing”. Nothing about post.',
  },
  {
    text: 'The Tenant has 14 days to fix a breach before the Landlord can end the lease (cl 14.2).',
    verdict: 'ok',
    pen: 'Checked at cl 14.2.',
  },
  {
    text: 'In our view, the Landlord’s position under cl 14 is strong.',
    verdict: 'out',
    pen: 'We asked for no opinion. Out.',
  },
  {
    text: 'This follows Quenda Holdings Pty Ltd v Stirling Lane Traders, a 2019 decision of the WA Supreme Court.',
    verdict: 'out',
    pen: 'Not in any authorised report. It does not exist. Out.',
  },
];

const VERDICT_LABEL = { ok: 'Checked, correct:', wrong: 'Wrong:', out: 'Struck out:' };

const ROUTINE = [
  {
    lead: 'Cases, quotes, sections and authorities.',
    body: 'Read it yourself in an authorised source before it goes into anything filed or sent.',
  },
  { lead: 'Summaries.', body: 'Check each point at the page or clause it names.' },
  { lead: 'Plain-English rewrites.', body: 'Compare line by line. If the meaning shifted, the original stands.' },
  { lead: 'Dates.', body: 'Check every date against its source document.' },
  { lead: 'Anything leaving the firm.', body: 'Reviewed by the responsible practitioner first.' },
];

const STAYS_OUT = [
  'Anything covered by legal professional privilege',
  'Client confidential information',
  'Matter details that identify a client or another party',
  'Logins, passwords and anything that opens a system',
];

const JOBS = [
  { title: 'A first-draft letter', for: 'Routine correspondence that still has to be right.' },
  { title: 'Plain English for a client', for: 'A clause or letter the client will not follow as written.' },
  { title: 'Summarise a long document', for: 'Discovery, a long contract, a bundle of correspondence.' },
  { title: 'A research starting point', for: 'The first hour on an unfamiliar issue. A lead, never an authority.' },
  { title: 'A process checklist', for: 'Opening a file, a settlement, anything with steps that get missed.' },
  { title: 'A chronology from notes', for: 'Turning a pile of notes into dates.' },
];

const DAY_NOTES = {
  Setup: 'Devices, wifi and tool access, then a sentence each on what the room uses AI for now.',
  'What these tools are': 'Prediction, not retrieval. Why it will produce a case that looks real and is not.',
  'First hands-on': 'One real task each: a letter, a clause, a summary, with names taken out first.',
  'Prompting that works': 'A weak prompt from the room, fixed together. Everyone rewrites one of their own and keeps it.',
  'Data safety': 'Privilege, client confidentiality and invented citations. Your conduct rules win.',
  'Making it stick': 'One or two recurring tasks to use it on, tied to a habit you already have.',
  'Your own tasks': 'Bring a recurring task from your practice. We build the prompts against it with you.',
  'Build a workflow you keep': 'A summarise-then-check routine or a review checklist, written up in your own words.',
  'Your questions': 'Your real situations and the edge cases.',
  'The pack': 'The prompts, the one-pager and the workflows you built.',
};

const SHEETS = [
  {
    src: '/c4site-art/pack-law-cover.webp',
    name: 'The prompt pack',
    caption: 'Six prompts for legal work, each with the check that goes with it. Not legal advice, and it says so on the cover.',
    alt: 'Cover of the C4Site prompt pack for law firms: Prompts for legal work, verified by default.',
  },
  {
    src: '/c4site-art/pack-law-prompts.webp',
    name: 'Inside the pack',
    caption: 'Six numbered prompts, each followed by the check to do before you use it.',
    alt: 'A page of the law firms prompt pack with numbered prompts, each followed by a check before you use it.',
  },
  {
    src: '/c4site-art/onepager-law.webp',
    name: 'The data-safety one-pager',
    caption: 'Four rules and a two-question test, for next to the screen.',
    alt: 'The C4Site data-safety one-pager for law firms: Before you paste anything in, with four rules and a quick test.',
  },
];

const DISCLAIMER =
  'Nothing taught is legal advice. Practitioners remain bound by their professional conduct rules, and no AI output should be filed or relied on unverified.';

function VerdictMark({ verdict }) {
  if (verdict === 'ok') return <MarkTick />;
  return <MarkCross />;
}

export default function ForesightLaw() {
  useForceDark();
  useSectorHead(DATA);
  const enquiryUrl = enquiryUrlFor(DATA.sectorKey);

  return (
    <div className="sg-root">
      <ChalkDefs />

      <BoardHero
        crumb={DATA.sector}
        heading="AI for legal work, verified by default."
        mark="verified by default."
        intro="Conservative, verification-heavy AI training for law firms. Faster drafting and summarising, with the habits that stop an invented case reaching a client or a court."
        by="Led by Caleb Scott, who is partway through a law degree."
        trace="cite"
      >
        <div className="sg-hero-cta sg-hero-cta--pair">
          <Link to={enquiryUrl} className="sg-btn">
            Request a workshop
            <MarkArrow />
          </Link>
          <a href="#day" className="sg-btn sg-btn--ghost">
            How the day runs
          </a>
        </div>
      </BoardHero>

      {/* An AI draft, marked up the way the session teaches. Invented, and
          captioned as invented. */}
      <section className="sg-section">
        <div className="sg-wrap">
          <h2 className="sg-h2">A draft file note, checked the way we teach it.</h2>
          <p className="sg-sub">
            It writes every line with the same confidence, and two of these five are right. You only
            find out which by checking each one against the lease.
          </p>
          <div className="sg-paper sg-markup">
            <div className="sg-paper-head">
              <span className="sg-paper-brand">Draft from the tool, marked up</span>
              <span className="sg-paper-note">Invented for this page</span>
            </div>

            <div className="sg-mk-block">
              <p className="sg-mk-label">What we asked</p>
              <p className="sg-mk-text sg-mk-text--asked">{PROMPT}</p>
            </div>

            <div className="sg-mk-block">
              <p className="sg-mk-label">What came back</p>
              <ol className="sg-mk-lines sg-draft">
                {DRAFT.map((line) => (
                  <li key={line.text} className={`sg-mk-line sg-draft-line sg-draft-line--${line.verdict}`}>
                    <span className="sg-draft-mark">
                      <VerdictMark verdict={line.verdict} />
                    </span>
                    <p className={line.verdict === 'out' ? 'sg-mk-text sg-mk-text--struck' : 'sg-mk-text'}>
                      <span className="sg-sr">{VERDICT_LABEL[line.verdict]} </span>
                      {line.text}
                    </p>
                    <p className="sg-pen">{line.pen}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="sg-mk-habit">
              <MarkTick />
              <p>
                <strong>Then it goes to the practitioner.</strong> Nothing leaves the firm without review by
                the responsible practitioner.
              </p>
            </div>
          </div>
          <p className="sg-keep-note">
            The lease, its clauses, the draft and Quenda Holdings Pty Ltd v Stirling Lane Traders are all
            invented for this page.
          </p>
        </div>
      </section>

      <RulesBlock
        heading="Five things get checked, every time."
        intro="Every prompt in the law pack comes with the check that goes with it. This is the routine the team takes back to their desks."
        points={ROUTINE}
      />

      <section className="sg-section sg-keepout">
        <div className="sg-wrap">
          <div className="sg-split">
            <div>
              <h2 className="sg-h2">What never goes in.</h2>
              <p className="sg-sub">
                Before anything is pasted in, two questions. Does it name or describe a client, a party or a
                witness? Is it privileged, or confidential to a client? If either answer is yes, it stays
                out, or the details come out first.
              </p>
              <p className="sg-sub">
                Names become roles: “the client”, “Party A”, “the Landlord”. Your firm’s policy and your
                conduct rules beat anything from the session.
              </p>
            </div>
            <CrossList items={STAYS_OUT} className="sg-crosslist--big" />
          </div>
        </div>
      </section>

      <JobList
        heading="Where it helps, used carefully."
        sub="The six prompts in the law pack. Each comes with the check you do before you rely on what it gives you."
        jobs={JOBS}
      />

      <DayPlan
        heading="How the day runs."
        aim="What we aim for: one drafting or summarising task sped up, with a checking routine the team trusts."
        notes={DAY_NOTES}
      />

      <KeepSheets
        heading="What the team keeps."
        sub="Printed and handed out on the day."
        sheets={SHEETS}
        note="On a full day they also keep the workflows they built, written up in their own words."
      />

      <QuoteClose
        heading="Bring AI into the firm, carefully."
        mark="carefully."
        enquiryUrl={enquiryUrl}
        disclaimer={DISCLAIMER}
      />
    </div>
  );
}
