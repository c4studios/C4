/**
 * Pillar — Web Development Perth. Different intent to web design:
 * stores, apps, portals, integrations.
 * Unique detail: the proof is development work from the portfolio, and the
 * named boring-stack rundown.
 *
 * Verified 2 Oct 2026, when Caleb asked for the guide to be brought up to date:
 *   - Prices, the warranty (up to 90 days, on the Custom Platform tier), care
 *     plans from $99/mo, the $3,500 store's 20 products and the $1,000+ API
 *     add-on are all from src/data/pricing.js.
 *   - The build times match how-long-does-a-website-take.js.
 *   - Each proof card comes from its case study in caseStudyData.jsx:
 *     DS Racing (499+ products from Square, Square checkout, the Canvas racing
 *     game), Quotr (no-code calculator builder, one-snippet widget, Stripe
 *     monthly and lifetime plans), Aqua-Safe (eighteen service pages and
 *     thirty-seven service-area pages from one content model, ServiceM8
 *     booking), Groverz (refund estimator on the 2025-26 ATO resident rates,
 *     a rate-limited contact backend), The Rocks (a streaming-style interface,
 *     one offline file, no dependencies).
 * Do NOT add:
 *   - "We ship our own software products." The software line left the site on
 *     14 Sep 2026. Quotr is the one product, and the intro names it.
 *   - A monthly running-cost figure for hosting and services. The old
 *     "$20 and $100 a month" had no source.
 *   - People Power, until its case study is restored.
 */
export default {
  hero: {
    label: 'Web Development Perth',
    title: ['Web development in Perth', 'for jobs a template can’t do.'],
    intro: [
      'C4 Studios is a Perth web development studio for the builds that outgrow a brochure site: online stores, booking systems, customer portals, dashboards and custom web apps. Ecommerce starts at $3,500, web app starters at $4,500, and everything is scoped at a fixed price before we write a line of code.',
      'We’re not an agency reselling page builders. Everything below is custom code, and the same React and Next.js stack runs Quotr, the quoting software we built and run at quotr.us.',
    ],
  },
  sections: [
    {
      kind: 'prose',
      label: 'The distinction',
      heading: 'What’s the difference between web design and web development?',
      body: [
        'Web design is how a site looks and reads. Development is what it can do. If you need pages that inform and convert, that’s design — start there, it costs a third as much. The moment you need logins, payments, stock levels, calculators, dashboards or anything that talks to other software, you’re in development territory: the build gets engineered, not decorated.',
        'Plenty of projects are both. We do both, which keeps one team accountable for the whole thing instead of a designer and a dev pointing at each other.',
      ],
    },
    {
      kind: 'list',
      label: 'Capability',
      heading: 'What we build',
      items: [
        { title: 'Online stores', text: 'Catalogues, carts, checkout, shipping and tax rules — from a 20-product starter at $3,500 to large catalogues with POS sync.' },
        { title: 'Web applications', text: 'Portals, dashboards, calculators and internal tools. MVP starters from $4,500, built around one core workflow done properly.' },
        { title: 'Booking and payments', text: 'Appointments, deposits, Stripe and Square integration, automated confirmations and reminders.' },
        { title: 'Integrations and APIs', text: 'Making your site talk to the software you already run — accounting, CRM, inventory, email.' },
        { title: 'Custom platforms', text: 'SaaS-style products, client portals and multi-user systems, scoped by proposal from $10,000.' },
      ],
    },
    {
      kind: 'proof',
      label: 'Shipped',
      heading: 'Built and shipped',
      cases: [
        { name: 'DS Racing Karts', summary: '499-plus go-kart parts moved across from a Square catalogue, Square checkout, and a slot-car racing game written from scratch in Canvas.', href: '/CaseStudy/ds-racing-karts', tag: 'Ecommerce' },
        { name: 'Quotr', summary: 'Our own product: a no-code calculator builder, a quote widget that installs with one snippet, and Stripe billing with monthly and lifetime plans.', href: '/CaseStudy/quotr', tag: 'SaaS' },
        { name: 'Aqua-Safe Plumbing', summary: 'Eighteen service pages and thirty-seven service-area pages generated from one content model, with ServiceM8 online booking.', href: '/CaseStudy/aqua-safe-plumbing', tag: 'Content platform' },
        { name: 'Groverz Tax', summary: 'An interactive tax refund estimator on the 2025-26 ATO resident rates, and a contact backend with rate limiting and spam protection.', href: '/CaseStudy/groverz-tax', tag: 'Calculator' },
        { name: 'The Rocks', summary: 'A streaming-style interface for a church’s pre-service loops: sign-in, campus profiles, browse rows and inline playback, in one offline file with no dependencies.', href: '/CaseStudy/rocksstream', tag: 'Web app' },
        /* People Power came off while it is reworked (Caleb, 2 Oct 2026); restore it with the case study. */
      ],
    },
    {
      kind: 'process',
      label: 'Process',
      heading: 'How a development build runs',
      steps: [
        { title: 'Scope it properly', text: 'We map the workflows, screens and data before quoting. Ambiguity is where budgets die, so we kill it first.' },
        { title: 'Stand up the skeleton', text: 'The core workflow goes up first, end to end, so you’re clicking through something real early — not signing off on slideware.' },
        { title: 'Layer and test', text: 'Features land in passes, with progress links the whole way. You test on real devices with real data before launch, not after.' },
        { title: 'Launch and harden', text: 'Go-live, monitoring, and a warranty window of up to 90 days on agreed scope. Then it’s yours — code included.' },
      ],
    },
    {
      kind: 'pricing',
      label: 'Pricing',
      heading: 'Where the numbers start',
      mode: 'anchor',
      note: 'That anchor is for marketing sites. Development builds price by scope: ecommerce from $3,500, web app starters from $4,500, growth builds at $7,500 and custom platforms from $10,000 — each with a fixed written quote.',
    },
    {
      kind: 'prose',
      label: 'Stack',
      heading: 'What do you actually build with?',
      body: [
        'React and Next.js on the front end, Node services behind, a Postgres database when there’s data worth keeping, and Stripe or Square wherever money moves. Hosting lands on fast edge platforms like Cloudflare. Deliberately boring, proven choices — the cleverness goes into your product, not the toolchain.',
      ],
    },
    {
      kind: 'prose',
      label: 'No surprises',
      heading: 'How can custom software be fixed-price?',
      body: [
        'Because the risky part isn’t the coding — it’s the not-knowing. Most blowouts happen when a project is quoted off a two-line email and the real requirements surface mid-build, billed by the hour. We spend the effort up front instead: workflows mapped, screens listed, data sketched, edge cases asked about while they’re still cheap to answer. Then the quote is a document, not a guess.',
        'When something genuinely new emerges mid-project — it happens — it gets scoped and priced as a change, and you decide. That’s the deal: the number moves only when you move the scope, never because we underestimated on purpose to win the job.',
      ],
    },
    {
      kind: 'prose',
      label: 'After launch',
      heading: 'What does it cost to run once it’s live?',
      body: [
        'Less than people fear, if it’s built sensibly. A marketing site on edge hosting runs for nearly nothing. A store or app adds database and service costs, and we set everything up in your own accounts, so you pay the providers directly at cost rather than a marked-up “platform fee”.',
        'Support is the honest variable. Software needs occasional attention — dependency updates, a payment provider changing an API, a new feature you want. Care plans from $99 a month cover the routine; one-off work gets quoted as it comes. What you’ll never need is a retainer just to keep the lights on.',
      ],
    },
  ],
  faqs: [
    {
      q: 'How much does web development cost in Perth?',
      a: 'Ecommerce builds start at $3,500, web app starters at $4,500, growth builds at $7,500 and custom platforms from $10,000. Every project is quoted fixed-price against a written scope, so the number you sign is the number you pay unless the scope itself changes.',
    },
    {
      q: 'Can you take over an existing site or app?',
      a: 'Often, yes. We audit the codebase first and give you an honest read: some builds are worth rescuing, some cost more to untangle than to rebuild. If a rebuild is the cheaper path, we’ll show you the maths rather than bill the rescue.',
    },
    {
      q: 'Do I need a web app, or will a website do?',
      a: 'If the job is to inform visitors and convert them into enquiries, a website does it for a third of the price — don’t let anyone sell you an app for that. You need development when the site has to do work: accounts, payments, bookings, data, integrations.',
    },
    {
      q: 'Who owns the code?',
      a: 'You do, once it’s paid for. Repositories and credentials are handed over at completion, and there’s nothing proprietary locking you to us — any competent developer could pick the project up. We’d just rather you stay because the work is good.',
    },
    {
      q: 'Can you integrate with Xero, Square, or our CRM?',
      a: 'That’s most of the job. Custom API integrations start at $1,000, and we’ve done everything from full Square catalogue imports — 499 products for DS Racing Karts — to payment, booking and email wiring. If it has an API, it connects.',
    },
    {
      q: 'How long does a web app or store take to build?',
      a: 'A starter store or MVP app typically takes four to eight weeks once scope is signed; growth builds and platforms run two to four months. The honest variable is decisions — projects where one person can say yes move roughly twice as fast as projects with a committee.',
    },
  ],
  cta: {
    heading: 'Have something custom in mind?',
    text: 'Describe the workflow in a sentence or two. We’ll tell you what it takes, what it costs, and whether you actually need it.',
  },
};
