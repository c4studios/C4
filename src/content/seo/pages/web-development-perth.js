/**
 * Pillar — Web Development Perth. Different intent to web design:
 * stores, apps, portals, integrations.
 * Unique detail: we ship our own SaaS products (C4 Originals) on the same
 * stack we sell, and the named boring-stack rundown.
 */
export default {
  hero: {
    label: 'Web Development Perth',
    title: ['Web development in Perth', 'for jobs a template can’t do.'],
    intro: [
      'C4 Studios is a Perth web development studio for the builds that outgrow a brochure site: online stores, booking systems, customer portals, dashboards and custom web apps. Ecommerce starts at $3,500, web app starters at $4,500, and everything is scoped at a fixed price before we write a line of code.',
      'We’re not an agency reselling page builders. We ship our own software products on this exact stack — so when we build yours, it’s with tools and habits we bet our own revenue on.',
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
      heading: 'Built, launched, still running',
      cases: [
        { name: 'DS Racing Karts', summary: '499-plus go-kart parts imported from a Square catalogue, full checkout, and a custom Canvas mini-game in the header. Ecommerce with personality.', href: '/CaseStudy?slug=ds-racing-karts', tag: 'Ecommerce' },
        { name: 'People Power', summary: 'A full-stack social platform built from the ground up — real-time messaging, moderation infrastructure and governance tooling. One of our own.', href: '/CaseStudy?slug=people-power', tag: 'Web app' },
        { name: 'C4 Originals', summary: 'Quotr, ReviewLoop, Complia and the rest of the C4 software suite — products we build, run and support ourselves, in production right now.', href: '/software', tag: 'SaaS suite' },
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
        'Less than people fear, if it’s built sensibly. A marketing site on edge hosting runs for nearly nothing; a store or app adds database and service costs that typically land between $20 and $100 a month at small-business scale — we set everything up in your accounts, so you’re paying providers directly at cost rather than a marked-up “platform fee”.',
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
