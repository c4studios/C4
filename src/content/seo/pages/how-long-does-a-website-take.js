/**
 * Comparison — How long does a website take to build?
 * Unique detail: the "delays are decisions, not code" breakdown and the
 * content-first scheduling rule.
 */
export default {
  hero: {
    label: 'Honest Answer',
    title: ['How long does a website', 'actually take to build?'],
    intro: [
      'Real numbers from a working Perth studio: a landing page takes one to two weeks, a business website three to five weeks, an online store or web app four to eight weeks, and custom platforms run two to four months. Those are calendar weeks, not effort weeks — and the gap between the two is almost never the code. Here’s where the time really goes and how to land at the fast end of every range.',
    ],
  },
  sections: [
    {
      kind: 'answer',
      body: [
        'Plan on three to five weeks for a typical business website, end to end. The build itself is days; the calendar is consumed by content arriving, feedback rounds, and decisions waiting on busy people. Projects where the content is ready on day one and one person can say yes routinely finish in half the time of identical projects without those two things.',
      ],
    },
    {
      kind: 'table',
      label: 'The ranges',
      heading: 'Honest timelines by project type',
      head: ['Project', 'Typical timeline', 'What stretches it'],
      rows: [
        ['Landing page ($500)', '1–2 weeks', 'Copy not ready; “one more tweak” loops'],
        ['Brochure site ($800)', '2–3 weeks', 'Photos and service descriptions arriving late'],
        ['Business website ($1,500)', '3–5 weeks', 'Feedback rounds spacing out; committee decisions'],
        ['Ecommerce store ($3,500+)', '4–8 weeks', 'Product data — photos, prices, variants — every time'],
        ['Web app ($4,500+)', '4–8 weeks', 'Workflow decisions surfacing mid-build'],
        ['Custom platform ($10,000+)', '2–4 months', 'Scope honesty; integration partners’ timelines'],
      ],
    },
    {
      kind: 'prose',
      label: 'Where time goes',
      heading: 'Why do websites run late?',
      body: [
        'In our experience the delays rank like this: content not ready (the runaway leader — copy, photos, product data), decisions queued behind busy owners, feedback arriving in instalments that contradict each other, and somewhere far down the list, actual technical surprises. Code is the predictable part; people are the schedule.',
        'That’s why we run content-first scheduling: the build doesn’t start until the critical content exists, because a build that starts “while the copy gets finished” is a build that parks for three weeks at 80% done. It feels slower to start; it’s dramatically faster to finish.',
      ],
    },
    {
      kind: 'list',
      label: 'Go faster',
      heading: 'How to hit the fast end of the range',
      items: [
        { title: 'Have content ready', text: 'Copy drafted, photos chosen, prices confirmed before kickoff. This alone is worth two weeks.' },
        { title: 'One decision-maker', text: 'Feedback from one voice, even if gathered from many. Committees double timelines reliably.' },
        { title: 'Batch your feedback', text: 'One considered list per round beats fourteen messages across nine days.' },
        { title: 'Trust the deadline trick', text: 'A real launch date — an event, a campaign — focuses everyone wonderfully. Manufacture one if needed.' },
        { title: 'Decide, then polish', text: 'Structure and copy first, pixel opinions last. Reversing that order is the classic stall.' },
      ],
    },
  ],
  faqs: [
    {
      q: 'Can you build a website in a week?',
      a: 'A landing page, yes — genuinely, if your content is ready and decisions come same-day. A full business site in a week means corners somewhere: ours is honest at three weeks when everything cooperates. Be wary of anyone promising large sites in days.',
    },
    {
      q: 'What slows projects down the most?',
      a: 'Content, by a distance — copy, photos and product data arriving late stall more builds than every technical issue combined. Second place is decision lag. Both are fixable before kickoff, which is why our process front-loads them deliberately.',
    },
    {
      q: 'When does the timeline officially start?',
      a: 'At kickoff: deposit paid, scope signed, and the critical content in hand. We don’t start the clock — or the build — on “the copy’s nearly done”, because that’s precisely the project that delivers in week eleven instead of week four.',
    },
    {
      q: 'Do revision rounds extend the timeline?',
      a: 'They’re already in it — every package includes its named rounds within the quoted range. What extends timelines is rounds spacing out: feedback that takes a fortnight to arrive adds a fortnight, which is the polite maths behind “websites take as long as their slowest reply”.',
    },
    {
      q: 'We need it live for a specific date — possible?',
      a: 'Usually, if the date is real and named early. We schedule backwards from it, tell you exactly what we need by when, and flag honestly if the scope can’t make it — better a trimmed launch on the day than a full site a fortnight after the event.',
    },
  ],
  cta: {
    heading: 'Got a date in mind?',
    text: 'Tell us the project and when it needs to exist. We’ll map the timeline backwards and tell you today if it’s achievable.',
  },
};
