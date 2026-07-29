/**
 * Industry — Websites for Gyms & Fitness Studios.
 * Proof: HVN Gym (full build per brief, plus Lens drone/full-show work),
 * Jurassic PT (Cannington studio, case study).
 * Unique detail: the timetable-as-screenshot pain and Jurassic PT's
 * dual timetable (image + structured weekly summary).
 */
export default {
  hero: {
    label: 'Websites for Gyms & Fitness Studios',
    title: ['Gym websites that fill classes,', 'not just feeds.'],
    intro: [
      'C4 Studios builds websites for Perth gyms and fitness studios — timetables people can actually read on a phone, membership pricing in the open, and booking wired in. We’ve built for fitness businesses from boutique studios to gyms, sites start at $1,500, and most are live within a month.',
    ],
  },
  sections: [
    {
      kind: 'list',
      label: 'The usual suspects',
      heading: 'Why do most gym websites lose members?',
      items: [
        { title: 'The timetable is a screenshot', text: 'Uploaded in January, wrong by March, unreadable on a phone all year. It’s the single most-visited thing on a gym site.' },
        { title: 'Pricing is hidden', text: '“Contact us for membership options” reads as “expensive”. People compare from the couch — absent pricing means you lose silently.' },
        { title: 'Booking lives somewhere else', text: 'The app handles bookings, but the website never hands visitors to it cleanly — so trials leak away at the exact moment of intent.' },
        { title: 'Stock photos of strangers', text: 'Visitors want your floor, your coaches, your 6am crew — not a fluorescent model gym in California.' },
        { title: 'No path for the nervous first-timer', text: 'Most prospects aren’t gym-confident. If the site doesn’t answer “what happens when I walk in?”, they don’t walk in.' },
      ],
    },
    {
      kind: 'prose',
      label: 'What we build',
      heading: 'What does a gym website actually need to do?',
      body: [
        'Three jobs, in order: show the timetable clearly, make joining or booking a trial effortless, and prove the community is real. Everything else is decoration. So we build timetables as structured, phone-first layouts — when we built Jurassic PT’s site we shipped the timetable two ways, the familiar image version and a responsive weekly summary, so it works for the regular glancing at tomorrow and the newcomer planning a first visit.',
        'Joining flows connect to whatever runs your floor — your booking app, your membership system, or a simple lead form that lands in your inbox with the trial request pre-qualified. And because half the battle is proof, the build is planned around real imagery: your space, your coaches, your members mid-session.',
      ],
    },
    {
      kind: 'proof',
      label: 'Proof',
      heading: 'Fitness work we can point to',
      cases: [
        { name: 'HVN Gym', summary: 'A full website build, plus drone and full-show event coverage through C4 Lens — site and content from the same studio, so they match.', tag: 'Build + content' },
        { name: 'Jurassic PT', summary: 'A Cannington fitness studio site covering memberships, classes, personal training and remedial massage — with direct booking and a dual-format timetable.', href: '/CaseStudy/jurassic-pt', tag: 'Live build' },
      ],
    },
    {
      kind: 'table',
      label: 'Features',
      heading: 'The features that earn their keep',
      head: ['Feature', 'Why it matters for a gym'],
      rows: [
        ['Phone-first timetable', 'It’s the page members hit weekly. Readable, current, and structured so Google can show your classes too.'],
        ['Trial and intro offers', 'A clear “first visit free” path converts the nervous majority that a “JOIN NOW” button scares off.'],
        ['Booking integration', 'Visitors land in your actual booking flow — no dead ends, no “download the app” mystery.'],
        ['Membership pricing', 'Published tiers filter tyre-kickers and pre-sell the serious — you only talk to people who know the price.'],
        ['Coach profiles', 'People join people. Faces and credentials beat slogans every time.'],
        ['Reviews up front', 'Your Google rating, on the site, near the join button — borrowed trust at the moment it counts.'],
      ],
    },
    {
      kind: 'pricing',
      label: 'Pricing',
      heading: 'What does a gym website cost?',
      mode: 'anchor',
      note: 'Most gym and studio sites land at the $1,500 business tier; add online booking from $400 if your system supports it. Class photography and video through C4 Lens can ride along with the build.',
    },
  ],
  faqs: [
    {
      q: 'How much does a gym website cost?',
      a: 'Typically $1,500 for a business-grade site with timetable, memberships and trial funnel. Booking integration adds from $400 depending on your system, and a content shoot through C4 Lens — your floor, coaches and classes — can be bundled from $650.',
    },
    {
      q: 'Can you connect our booking or membership system?',
      a: 'Almost always. If your platform offers embeds, links or an API, we wire the site into it so members book where they already book. If you’re still on paper and Messenger, a structured lead form is an honest, cheap first step.',
    },
    {
      q: 'Who keeps the timetable up to date?',
      a: 'Whoever you nominate — we build it so a coach can update times without touching code, or fold updates into a $79-a-month care plan. The screenshot-timetable era ends either way.',
    },
    {
      q: 'Can you shoot photos and video of our gym?',
      a: 'Yes — that’s C4 Lens, the studio’s photo and video arm. A two-hour business branding shoot delivers 30 edited images of your space and people; content days add reels cut for social. Real members beat stock models in every test that matters.',
    },
    {
      q: 'How fast can we launch?',
      a: 'A focused gym site is usually live in three to four weeks from kickoff. The pacing item is nearly always content — timetable, pricing and photos — so we front-load collecting it and the build follows quickly.',
    },
  ],
  cta: {
    heading: 'Got a gym that deserves better?',
    text: 'Tell us your setup — booking system, class count, what’s not working. We’ll reply with a straight scope and price.',
  },
};
