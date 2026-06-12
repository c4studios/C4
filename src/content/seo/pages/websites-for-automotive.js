/**
 * Industry — Websites for Automotive & Motorsport.
 * Proof: DS Racing Karts (redesign, 499+ Square parts, Canvas mini-game,
 * header film). Unique detail: the playable racing game in a parts store.
 */
export default {
  hero: {
    label: 'Websites for Automotive & Motorsport',
    title: ['Automotive websites with', 'actual horsepower behind them.'],
    intro: [
      'C4 Studios builds websites for Perth’s automotive and motorsport businesses — workshops, parts suppliers, detailers, race teams and the trades around them. We rebuilt DS Racing Karts into a 499-part online store with Square integration, so we’ve already done the hard version. Sites from $1,500; stores from $3,500.',
    ],
  },
  sections: [
    {
      kind: 'prose',
      label: 'The opportunity',
      heading: 'Why do automotive businesses out-earn their websites?',
      body: [
        'Because the passion is real and the websites rarely show it. This is an industry where customers research obsessively, compare parts at midnight, and follow workshops on social like sports teams — then land on a site with a grainy logo, a dead gallery and a phone number from two owners ago. The gap between how good the work is and how good the site looks is wider in automotive than almost anywhere.',
        'That gap is the opportunity. A site that actually shows the builds, lists the parts, and books the work doesn’t just keep up with the big franchises — it reads as more credible than them, because it’s clearly real.',
      ],
    },
    {
      kind: 'list',
      label: 'Common failures',
      heading: 'Where the typical workshop site breaks down',
      items: [
        { title: 'The gallery died in 2021', text: 'Your best advertising is finished work. If the last photo is three years old, the site says you stopped trying.' },
        { title: 'Parts live in a shed spreadsheet', text: 'If customers can’t search and buy online, they buy from whoever lets them — usually interstate.' },
        { title: 'No booking path', text: '“Call for availability” at 10pm means the job goes to the workshop with a form.' },
        { title: 'Nothing loads on a ute’s reception', text: 'Heavy sliders and autoplay video fall over on regional 4G — exactly where your customers are.' },
      ],
    },
    {
      kind: 'proof',
      label: 'Proof',
      heading: 'The build we point everyone to',
      cases: [
        { name: 'DS Racing Karts', summary: 'A full redesign and rebuild for a WA karting supplier: 499-plus parts imported from their Square catalogue, proper checkout, content managed in-house — and a custom-coded racing mini-game in the header, because motorsport sites should be fun.', href: '/CaseStudy?slug=ds-racing-karts', tag: 'Redesign + store' },
        { name: 'Motorsport content', summary: 'The DSR header film and ongoing motorsport content through C4 Lens — shot to match a brand built around speed, not stock-photo chrome.', href: '/CaseStudy?slug=ds-racing-karts', tag: 'C4 Lens' },
      ],
    },
    {
      kind: 'table',
      label: 'Features',
      heading: 'What earns its keep on an automotive site',
      head: ['Feature', 'Why it matters here'],
      rows: [
        ['Parts catalogue + checkout', 'Your inventory working at midnight. Square or POS import means no double data entry — we’ve migrated 499 SKUs in one build.'],
        ['Booking and quote forms', 'Jobs requested with rego, model and photos attached — half the diagnostic before the car arrives.'],
        ['Build galleries', 'Finished work, organised and current. The page petrolheads actually share.'],
        ['Google reviews up front', 'Trust is everything when someone’s handing over their pride and joy.'],
        ['Fast on mobile data', 'Light pages that load at the track, in the shed, on site.'],
        ['Brand with attitude', 'Motorsport audiences reward personality — the mini-game on DSR exists because it fits the customer.'],
      ],
    },
    {
      kind: 'pricing',
      label: 'Pricing',
      heading: 'What does an automotive website cost?',
      mode: 'anchor',
      note: 'Workshop and detailer sites usually land at $1,500–$2,500; parts stores start at $3,500 including up to 20 products loaded, with bigger catalogues quoted by import scope. POS and inventory sync is available from $1,200 when you’re ready.',
    },
  ],
  faqs: [
    {
      q: 'How much does a workshop or parts store website cost?',
      a: 'A workshop site with booking and galleries lands around $1,500–$2,500. Online parts stores start at $3,500 with standard checkout and up to 20 products loaded; catalogue imports beyond that are quoted by scope — DS Racing Karts came across with 499 parts from Square.',
    },
    {
      q: 'Can you import our existing catalogue from Square or our POS?',
      a: 'Yes — that’s a solved problem here. We’ve done a full Square catalogue import including variants and pricing, and most modern POS systems expose enough data to migrate cleanly. The honest variable is how tidy your product data is, and we’ll tell you after one look.',
    },
    {
      q: 'Can customers book vehicles in through the site?',
      a: 'Yes. At minimum a structured booking form that captures rego, make, model and the problem — with photo upload, since a picture of the damage saves a phone call. Full calendar booking integrates from $400 if your workshop runs scheduling software.',
    },
    {
      q: 'Can you shoot our builds and the workshop?',
      a: 'That’s C4 Lens — workshop shoots, finished-build photography and event or track coverage, including drone. The DSR header film is ours. Real footage of real work is the entire game in this industry; nobody believes stock photos of engines.',
    },
    {
      q: 'We sponsor a race team — can the site handle that side too?',
      a: 'Absolutely: team pages, results, sponsor walls and event galleries sit happily alongside the commercial side. It’s often the most-visited part of the site and the cheapest brand-building you’ll ever do — lean into it.',
    },
  ],
  cta: {
    heading: 'Your work is fast. Your website should be.',
    text: 'Tell us what you run — workshop, parts, team, all three. We’ll scope it straight and price it fixed.',
  },
};
