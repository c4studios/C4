/*
 * /ai-training-for-business — C4Site for office and business teams.
 *
 * Rebuilt 24 Sep 2026 around the page's own material rather than a shared
 * template. The centrepiece is the first thing the room fixes together: a
 * weak prompt and the same job asked well, marked up in red pen with the
 * lever each line pulls, then the next message in the same chat.
 *
 * SOURCES. The weak and better prompts, the follow-up, the six jobs and the
 * checking habit are verbatim from the office-and-business prompt pack
 * (c4sight-schools/deliverables/take-homes/content.mjs). They were written for
 * the pack as templates; the freight company is an invented example and reads
 * as one. The run-of-day notes trace to c4sight-workshop-curriculum.md
 * (blocks 0 to 8 and the office module swap). What stays out is the pack's
 * data-safety one-pager.
 *
 * DO NOT ADD: time-saved figures or promises ("a third of the time",
 * "a fraction of the time"). The curriculum's figures are session goals, not
 * measured results. No named AI products as recommendations.
 */
import { Link } from '@/components/c4/SiteLink';
import {
  BoardHero, CrossList, DayPlan, JobList, KeepSheets, QuoteClose, RulesBlock, enquiryUrlFor, useSectorHead,
} from '@/components/sight/SectorPage';
import { ChalkDefs, MarkArrow, MarkTick, useForceDark } from '@/components/sight-arm/kit';

const DATA = {
  sector: 'Office and business',
  sectorKey: 'business',
  path: '/ai-training-for-business',
  serviceType: 'AI literacy training for business teams',
  meta: {
    title: 'AI training for business teams in Perth',
    description:
      'In-person AI workshops for office and business teams in Perth. Faster emails, documents, summaries and spreadsheets, with client and company data kept safe.',
  },
};

/* The prompt pack's worked example, split at its sentences so each line can
   carry the lever it pulls. Joined, the lines are the pack's text exactly. */
const WEAK = 'Write an email to a client about the delay.';
const BETTER = [
  { text: 'I look after accounts at a small freight company.', lever: 'Context', why: 'who is asking' },
  {
    text: 'Write a short email to a long-standing client telling them their delivery will arrive Thursday instead of Monday because a supplier was late.',
    lever: 'Context',
    why: 'who reads it, and what went wrong',
  },
  { text: 'Apologise once, offer to call them, and keep it under 120 words.', lever: 'Specificity', why: 'what to do, how long' },
];
const FOLLOW_UP = 'Good. Make it a little warmer, and do not name the supplier.';
const HABIT =
  'Check every fact, figure, date and name against the original before you use it. The tool writes with the same confidence whether it is right or wrong.';

const JOBS = [
  { title: 'Reply to an email', for: 'Replies that need care: a complaint, a delay, a no.' },
  { title: 'Rough notes into a document', for: 'Meeting notes, a brain dump, a procedure nobody has written down.' },
  { title: 'Summarise a long thread or report', for: 'The forty-email chain, the report you were copied into.' },
  { title: 'A spreadsheet formula', for: 'The formula you would otherwise search for twenty minutes.' },
  { title: 'Explain something before you act on it', for: 'A policy, a supplier’s terms, a technical note.' },
  { title: 'Tighten your own draft', for: 'Anything you wrote in a hurry.' },
];

const STAYS_OUT = [
  'Company confidential material',
  'Client and customer personal information',
  'Commercial-in-confidence material: contracts, pricing, tenders',
  'Logins, passwords and anything that opens a system',
];

const TEST = ['Does it name or describe a real person?', 'Is it confidential to the company or a client?'];

const DAY_NOTES = {
  Setup: 'Devices, wifi and tool access, then a sentence each on what the room uses AI for now.',
  'What these tools are': 'Prediction, not a search engine. What it is good at, and where it is confidently wrong.',
  'First hands-on': 'One real task each from this week’s work: an email, a set of notes, a summary.',
  'Prompting that works': 'A weak prompt from the room, fixed together. Everyone rewrites one of their own and keeps it.',
  'Data safety': 'Company confidential, client data and commercial-in-confidence. Your own policy wins.',
  'Making it stick': 'One or two weekly tasks to use it on, tied to a habit you already have.',
  'Your own tasks': 'Bring a recurring task from your role. We build the prompts against it with you.',
  'Build a workflow you keep': 'A drafting template or a summarise-then-check routine, written up in your own words.',
  'Your questions': 'Your real situations and the edge cases.',
  'The pack': 'The prompts, the one-pager and the workflows you built.',
};

const SHEETS = [
  {
    src: '/c4site-art/pack-business-cover.webp',
    name: 'The prompt pack',
    caption: 'Six prompts to copy and adapt, each with the check that goes with it, and a page for their own.',
    alt: 'Cover of the C4Site prompt pack for office and business: Prompts for the everyday work week.',
  },
  {
    src: '/c4site-art/pack-business-levers.webp',
    name: 'Inside the pack',
    caption: 'The four levers and the worked example above, on paper.',
    alt: 'A page of the prompt pack showing the four levers, a weak prompt beside the same job done better, and the next message in the chat.',
  },
  {
    src: '/c4site-art/onepager-business.webp',
    name: 'The data-safety one-pager',
    caption: 'Four rules and a two-question test, for next to the screen.',
    alt: 'The C4Site data-safety one-pager for office and business: Before you paste anything in, with four rules and a quick test.',
  },
];

export default function ForesightBusiness() {
  useForceDark();
  useSectorHead(DATA);
  const enquiryUrl = enquiryUrlFor(DATA.sectorKey);

  return (
    <div className="sg-root">
      <ChalkDefs />

      <BoardHero
        crumb={DATA.sector}
        heading="Practical AI for the everyday work week."
        mark="work week."
        intro="Hands-on training for office and business teams. Your people learn to use AI on the real work in front of them, with company and client information kept safe."
        by="Half day or full day, at your office, anywhere in Perth."
        trace="week"
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

      {/* The first thing the room fixes together, marked up in red pen. */}
      <section className="sg-section">
        <div className="sg-wrap">
          <h2 className="sg-h2">The same email, asked two ways.</h2>
          <p className="sg-sub">
            Most of us start with a prompt like the first one. The room fixes it together, then
            everyone does the same to one of their own. This page is in the pack they keep.
          </p>
          <div className="sg-paper sg-markup">
            <div className="sg-paper-head">
              <span className="sg-paper-brand">From the prompt pack</span>
              <span className="sg-paper-note">Office and business</span>
            </div>

            <div className="sg-mk-block">
              <p className="sg-mk-label">A weak prompt</p>
              <div className="sg-mk-line">
                <p className="sg-mk-text sg-mk-text--struck">{WEAK}</p>
                <p className="sg-pen">Which client? What delay? How long?</p>
              </div>
            </div>

            <div className="sg-mk-block">
              <p className="sg-mk-label">The same job, better</p>
              <ol className="sg-mk-lines">
                {BETTER.map((line) => (
                  <li key={line.text} className="sg-mk-line">
                    <p className="sg-mk-text">{line.text}</p>
                    <p className="sg-pen">
                      <b>{line.lever}</b> {line.why}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="sg-mk-block">
              <p className="sg-mk-label">Then, in the same chat</p>
              <div className="sg-mk-line">
                <p className="sg-mk-text sg-mk-text--reply">{FOLLOW_UP}</p>
                <p className="sg-pen">
                  <b>Iteration</b> say what is wrong, ask again
                </p>
              </div>
            </div>

            <div className="sg-mk-habit">
              <MarkTick />
              <p>
                <strong>Before it goes anywhere.</strong> {HABIT}
              </p>
            </div>
          </div>
          <p className="sg-keep-note">
            The fourth lever is examples. Paste in a good email you wrote before and ask for one like
            it.
          </p>
        </div>
      </section>

      <JobList
        heading="The jobs we practise on."
        sub="Your team brings its own. These six are the prompts in the pack, for the week after."
        jobs={JOBS}
      />

      <RulesBlock
        heading="Two questions before anything goes in."
        aside={
          <>
            <ol className="sg-test">
              {TEST.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
            <p className="sg-rules-copy">
              If the answer to either is yes, leave it out, or take the details out first. Swap names for
              roles: “the client”, “Supplier 2”, “the account manager”.
            </p>
          </>
        }
      >
        <h3 className="sg-rules-h3">What stays out</h3>
        <CrossList items={STAYS_OUT} />
        <p className="sg-rules-small">
          Depending on the tool and your account settings, what you type may be kept by the provider or
          used to train its models. Where your workplace restricts a tool, that beats anything from the
          session.
        </p>
      </RulesBlock>

      <DayPlan
        heading="How the day runs."
        aim="What we aim for: one task your team does every week, sped up, with nothing sensitive put at risk."
        notes={DAY_NOTES}
      />

      <KeepSheets
        heading="What your team keeps."
        sub="Printed and handed out on the day. Nobody leaves with just notes."
        sheets={SHEETS}
        note="On a full day they also keep the workflows they built, written up in their own words."
      />

      <QuoteClose heading="Bring practical AI to your team, safely." mark="safely." enquiryUrl={enquiryUrl} />
    </div>
  );
}
