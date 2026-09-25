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
 *
 * 24 Sep 2026 (fact audit): the minute-by-minute steps are the Pre-primary to
 * Year 6 session (TEACH IT and the picture cards). From Year 7 the run sheet
 * swaps the tool and the activity, so the steps are labelled as primary and a
 * note says what changes. Do not describe BUILD IT or SHIP IT as a working
 * tool on this page; neither exists yet. Years 7 to 9 run the unplugged
 * Break the Bot (A.7), where a student plays the bot.
 */
import { Link } from '@/components/c4/SiteLink';
import { createPageUrl } from '@/utils';
import { c4SiteIncursion, C4SIGHT_PRICING_NOTE } from '@/data/pricing';
import { C4SITE_SERIES } from '@/data/c4siteSeries';
import {
  BoardClose, BoardHero, RulesBlock, enquiryUrlFor, useSectorHead,
} from '@/components/sight/SectorPage';
import {
  ChalkDefs, MarkArrow, MarkRing, MarkTick, VRule, useForceDark,
} from '@/components/sight-arm/kit';

/* What changes from Year 7, from the run sheet's band table. */
const SECONDARY_NOTE = [
  { band: 'Years 7 to 9', line: 'Break the Bot. The class writes a help-bot’s rules, a student plays the bot, and everyone else tries to talk it past them. Then, what counts as evidence when a face can be faked.' },
  { band: 'Years 10 to 12', line: 'An AI tool used live on the presenter’s laptop, on a task the room votes for. Then assessment, honestly, including why detectors do not reliably work.' },
];

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
  { lead: 'No student images.', body: 'In the primary session the camera points at the cards students hold up, never at faces, and nothing is saved.' },
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
        intro="An AI incursion for Perth schools, from Pre-primary to Year 12. Your class watches a machine get something confidently wrong, and spends the rest of the session working out why. Nobody needs a device."
        by="One presenter, with your own teacher in the room throughout."
        trace="cards"
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
              <p className="sg-plan-lead sg-plan-lead--top">The ninety minutes, Pre-primary to Year 6</p>
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
              <div className="sg-older">
                <p className="sg-plan-lead">From Year 7, the same shape with the presenter typing and the room deciding</p>
                <dl className="sg-older-list">
                  {SECONDARY_NOTE.map((row) => (
                    <div key={row.band}>
                      <dt>{row.band}</dt>
                      <dd>{row.line}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* The screen at "We break it": a real test run of TEACH IT, the
              classifier the presenter brings (c4sight-schools/tools/teach-it,
              tests/shots/5-rabbit-marked-wrong-1920x1080.png, 24 Sep 2026).
              The percentage is that run's; the README says the size of the
              number is not guaranteed, so the caption says "in this run". */}
          <figure className="sg-projected">
            <div className="sg-projected-screen">
              <img
                src="/c4site-art/teach-it-marked-wrong-1280.webp"
                srcSet="/c4site-art/teach-it-marked-wrong-800.webp 800w, /c4site-art/teach-it-marked-wrong-1280.webp 1280w"
                sizes="(min-width: 1160px) 1000px, 100vw"
                alt="The TEACH IT screen. A drawn rabbit is on camera. The tool says: I think this is a CAT, 95% sure. CAT is struck through in red pen, 95% sure is ringed, and underneath is written: Sure isn't the same as right."
                width="1280"
                height="720"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <strong>The screen at minute 30.</strong> Taught only cats and dogs, the machine meets a
              rabbit. In this test run it said cat, 95% sure, and the presenter marked it wrong in red.
              It runs offline on our laptop, and nothing is recorded or saved.
            </figcaption>
          </figure>
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
                <img
                  className="sg-series-cover"
                  src={`/c4site-art/series-${s.key.slice(1)}.webp`}
                  alt=""
                  width="160"
                  height="227"
                  loading="lazy"
                  decoding="async"
                />
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
                and where your school stands.
              </p>
              <div className="sg-hero-cta">
                <Link to={staffUrl} className="sg-btn sg-btn--ghost">
                  Ask about staff PD
                  <MarkArrow />
                </Link>
              </div>
            </div>
            <div className="sg-paper sg-staff-sheet">
              <div className="sg-paper-head">
                <span className="sg-paper-brand">Monday Morning AI</span>
                <span className="sg-paper-note">90 minutes, up to 60 staff</span>
              </div>
              <p className="sg-staff-lead">Built live at the front, in the first half</p>
              <ul className="sg-keep-list sg-keep-list--one">
                {STAFF_BUILDS.map((item) => (
                  <li key={item}>
                    <MarkTick />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="sg-staff-then">
                <strong>Then, the second half.</strong> Assessment, detectors and where your school stands.
              </p>
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
          <figure className="sg-paper sg-code-card">
            <div className="sg-paper-head">
              <span className="sg-paper-brand">WA8DIGAD2</span>
              <span className="sg-paper-note">SCSA, Year 8 Digital Technologies</span>
            </div>
            <blockquote>
              <p>&ldquo;Evaluate the authenticity, accuracy and timeliness of acquired data&rdquo;</p>
            </blockquote>
            <figcaption>
              SCSA&rsquo;s own examples for it name deepfakes. Series 3, <em>Can You Trust It?</em>,
              supports it.
            </figcaption>
          </figure>
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
