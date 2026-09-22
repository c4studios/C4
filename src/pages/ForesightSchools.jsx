/*
 * /ai-training-for-schools — C4Site for schools, on the board.
 *
 * Built around the one published training price, the 90-minute incursion,
 * and the five series (one per age band, plus staff PD). The session steps
 * and the safety rules are from the incursion run sheet
 * (c4sight-schools/deliverables/lessons/90-minute-incursion-run-sheet.md);
 * the staff PD detail is from the Series 5 pack. Rebuilt 21 Sep 2026.
 *
 * Do not market the 90 as "two presenters, one a registered teacher". The
 * run sheet reserves that line for the longer formats; the 90's honest line
 * is one presenter with the school's own teacher in the room.
 */
import { Link } from '@/components/c4/SiteLink';
import { createPageUrl } from '@/utils';
import { c4SiteIncursion, C4SIGHT_PRICING_NOTE } from '@/data/pricing';
import { C4SITE_SERIES } from '@/data/c4siteSeries';
import {
  BoardClose, BoardHero, RulesBlock, TaskList, enquiryUrlFor, useSectorHead,
} from '@/components/sight/SectorPage';
import {
  ChalkDefs, MarkArrow, MarkRing, MarkTick, VRule, useForceDark,
} from '@/components/sight-arm/kit';

const DATA = {
  sector: 'Schools',
  path: '/ai-training-for-schools',
  serviceType: 'AI literacy incursions for schools',
  meta: {
    title: 'AI incursions and staff PD for Perth schools',
    description:
      'A 90-minute AI incursion for Perth schools, Pre-primary to Year 12, for $650. No student devices and no student data. Free classroom packs for every year level.',
  },
};

/* The session, minute by minute. Names and order from the run sheet; the
   lines are plain summaries of what it says happens. */
const STEPS = [
  { from: 0, to: 8, name: 'The cold open', line: 'No introductions and no slides. We teach the machine one picture of a cat, and it calls the next card a cat, 100% sure.' },
  { from: 8, to: 30, name: 'We teach it', line: 'The class supplies the examples and watches it learn. Students call the next example and keep the score.' },
  { from: 30, to: 40, name: 'We break it', hinge: true, line: 'We show it the one thing nobody taught it. It gets it wrong, and it is sure of itself. The class works out why before we say a word.' },
  { from: 40, to: 55, name: 'On your feet', line: 'An activity with no screens. Every student has a job, and the jobs swap halfway.' },
  { from: 55, to: 75, name: 'So what', line: 'The big question for their age, run as a whole-room argument. Students pick a side, then vote again to see who moved.' },
  { from: 75, to: 86, name: 'The line', line: 'Your teacher can lead this part. Each pair agrees one rule for the room in a single sentence.' },
  { from: 86, to: 90, name: 'One sentence', line: 'A student says the takeaway, and the room says it back.' },
];

const SAFETY = [
  { lead: 'No student devices.', body: 'The tool runs on our laptop and your projector. Students hold cards, write and vote.' },
  { lead: 'No student data.', body: 'Nothing about a student goes into anything we use, not even a name.' },
  { lead: 'No student images.', body: 'The camera points at the cards students hold up, never at faces, and nothing is saved.' },
  { lead: 'Your teacher stays in the room.', body: 'For the whole session, so there are always two adults present.' },
  { lead: 'Your policies win.', body: 'School and Department policy overrides anything taught in the room.' },
];

/* What staff build live in the first half of Monday Morning AI (Series 5 pack). */
const STAFF_BUILDS = [
  'A rubric built from a task description',
  'Report comments, differentiated by achievement level',
  'One passage rewritten at three reading levels',
  'A quiz with its answer key',
];

export default function ForesightSchools() {
  useForceDark();
  useSectorHead(DATA, [
    { name: c4SiteIncursion.name, price: c4SiteIncursion.price, url: DATA.path },
  ]);
  const incursionUrl = enquiryUrlFor('school', '&format=incursion-90');
  const staffUrl = enquiryUrlFor('school', '&format=staff-pd');

  return (
    <div className="sg-root">
      <ChalkDefs />

      <BoardHero
        crumb="Schools"
        heading="Ninety minutes with a machine that gets it wrong."
        mark="gets it wrong."
        intro="An AI incursion for Perth schools, from Pre-primary to Year 12. Your class watches the machine learn, then watches it get something confidently wrong, and spends the rest of the session working out why. Nobody needs a device."
      >
        <div className="sg-hero-cta sg-hero-cta--pair">
          <Link to={incursionUrl} className="sg-btn">
            Ask about a date
            <MarkArrow />
          </Link>
          <Link to={createPageUrl('C4SitePreviews')} className="sg-btn sg-btn--ghost">
            Free classroom packs
          </Link>
        </div>
      </BoardHero>

      {/* ── The incursion: the price, then the ninety minutes in order ── */}
      <section className="sg-section" id="incursion">
        <div className="sg-wrap">
          <h2 className="sg-h2">The 90-minute incursion</h2>
          <div className="sg-offer">
            <div>
              <p className="sg-offer-price">
                {c4SiteIncursion.priceLabel}
                <span>for {c4SiteIncursion.minutes} minutes</span>
              </p>
              <p className="sg-offer-note">{C4SIGHT_PRICING_NOTE}</p>
              <p className="sg-format-body">
                It is presenter-led and projected, so students need no devices. We need a projector
                and some clear floor.
              </p>
              <ul className="sg-cost-facts">
                {c4SiteIncursion.facts.map((fact) => (
                  <li key={fact}>
                    <MarkTick />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
              <div className="sg-offer-cta">
                <Link to={incursionUrl} className="sg-btn">
                  Ask about a date
                  <MarkArrow />
                </Link>
              </div>
            </div>
            <VRule />
            <div>
              <p className="sg-plan-lead sg-plan-lead--top">The ninety minutes, in order</p>
              <ol className="sg-steps">
                {STEPS.map((step) => (
                  <li key={step.name} className={step.hinge ? 'sg-step sg-step--hinge' : 'sg-step'}>
                    <span className="sg-step-at">
                      <span className="sg-sr">Minutes </span>
                      {step.from}–{step.to}
                    </span>
                    <div>
                      <span className="sg-step-name">
                        {step.hinge ? (
                          <span className="sg-ringed">
                            {step.name}
                            <MarkRing />
                          </span>
                        ) : (
                          step.name
                        )}
                      </span>
                      <span className="sg-step-line">{step.line}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── The five series ── */}
      <section className="sg-section" id="series">
        <div className="sg-wrap">
          <h2 className="sg-h2">A series for every year level, and one for staff</h2>
          <p className="sg-sub">
            The storyline stays the same at every age. What changes is the activity and the question
            the room argues about. Each series has a free pack with a complete activity you can run
            without us.
          </p>
          <ul className="sg-series">
            {C4SITE_SERIES.map((s) => (
              <li key={s.key} className="sg-series-row">
                <span className="sg-series-band">{s.band}</span>
                <div>
                  <h3>{s.name}</h3>
                  <p>{s.line}</p>
                </div>
                <a className="sg-series-get" href={s.file} target="_blank" rel="noopener noreferrer">
                  Free pack
                  <span className="sg-sr"> for {s.name} (PDF, opens in a new tab)</span>
                  <MarkArrow />
                </a>
              </li>
            ))}
          </ul>
          <p className="sg-series-more">
            Want several at once? Pick them on the{' '}
            <Link to={createPageUrl('C4SitePreviews')}>free packs page</Link> and they download
            together.
          </p>
        </div>
      </section>

      <RulesBlock
        id="safety"
        lead="The same in every session"
        heading="Built around a teacher's caution"
        intro="Teachers are right to be careful with this. These rules hold at every year level."
        points={SAFETY}
      />

      {/* ── Staff PD ── */}
      <section className="sg-section" id="staff">
        <div className="sg-wrap">
          <div className="sg-split">
            <div>
              <h2 className="sg-h2">Staff PD: Monday Morning AI</h2>
              <p className="sg-sub">
                The staff session comes in two halves. First your teachers bring real tasks and we
                build one live at the front. The tool gets the draft most of the way, and a teacher
                finishes it.
              </p>
              <p className="sg-sub">
                Then the harder conversation about assessment, including{' '}
                <Link to="/ai-detectors-dont-work/" className="sg-inline-link">
                  why AI detectors don&rsquo;t reliably work
                </Link>{' '}
                and where your school stands. It runs for 90 minutes with up to 60 staff.
              </p>
              <div className="sg-hero-cta">
                <Link to={staffUrl} className="sg-btn sg-btn--ghost">
                  Ask about staff PD
                  <MarkArrow />
                </Link>
              </div>
            </div>
            <div>
              <p className="sg-plan-lead sg-plan-lead--top">Built live in the first half</p>
              <TaskList items={STAFF_BUILDS} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section className="sg-section" id="curriculum">
        <div className="sg-wrap">
          <h2 className="sg-h2">Mapped to the WA curriculum</h2>
          <p className="sg-curric">
            WA schools teach SCSA&rsquo;s Western Australian Curriculum, which has its own codes.
            Each pack lists the WA content descriptions its series supports, quoted from SCSA, next
            to the Australian Curriculum v9 that WA&rsquo;s is adapted from.
          </p>
          <blockquote className="sg-quote">
            <p>Evaluate the authenticity, accuracy and timeliness of acquired data</p>
            <cite>
              SCSA, Year 8 Digital Technologies, WA8DIGAD2. SCSA&rsquo;s own examples for it name
              deepfakes. Series 3 supports it.
            </cite>
          </blockquote>
        </div>
      </section>

      <BoardClose
        heading="Tell us the year level and a week that suits."
        mark="a week that suits."
        sub="We reply within one business day."
        cta="Ask about a date"
        to={incursionUrl}
      />
    </div>
  );
}
