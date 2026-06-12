/**
 * Comparison — How much does a website cost in Perth? (2026 guide)
 * The honest-range page: full pricing from src/data/pricing.js, what moves
 * the number, ongoing costs, and the pay-monthly path.
 * Unique details: the 15–20% professional-services compliance surcharge,
 * and the "why quotes vary" freelancer/studio/agency breakdown.
 */
export default {
  hero: {
    label: 'Cost Guide — 2026',
    title: ['How much does a website', 'cost in Perth in 2026?'],
    intro: [
      'Straight numbers: a single-page landing site costs about $500, a small brochure site $800, a proper business website $1,500 to $2,500, an online store from $3,500, and custom web apps from $4,500 to well past $10,000. Those are our actual published prices, not industry averages — and this guide breaks down what moves the number, what keeps costing money after launch, and why two quotes for “the same site” can be $7,000 apart.',
    ],
  },
  sections: [
    {
      kind: 'answer',
      body: [
        'Most Perth small businesses should budget $1,500–$2,500 for a website that earns its keep, plus a few hundred dollars a year to run it — or from $99 a month with hosting and maintenance handled. Pay much less and you’re usually buying a template with your name dropped in; pay much more only when the scope genuinely demands it.',
      ],
    },
    {
      kind: 'pricing',
      label: 'The ranges',
      heading: 'The honest version, in three brackets',
      mode: 'range',
    },
    {
      kind: 'table',
      label: 'Full price list',
      heading: 'Every package, every price',
      head: ['Package', 'Price', 'What it’s for'],
      rows: [
        ['Landing Page', '$500', 'One focused page for a new offer, campaign or simple service business. You supply the copy and images.'],
        ['Brochure Site', '$800', 'Two to five straightforward pages — the essentials online, done properly.'],
        ['Business Website', '$1,500', 'Up to six pages with conversion-focused structure, enquiry routing and analytics. Our most popular package.'],
        ['Custom Website', '$2,500', 'Up to eight pages, custom sections, stronger SEO and a blog or CMS foundation.'],
        ['Ecommerce Store', '$3,500', 'A practical storefront: up to 20 products, standard checkout, shipping and tax rules.'],
        ['Web App Starter', '$4,500', 'An MVP web application built around one core workflow — portal, dashboard or tool.'],
        ['Growth Build', '$7,500', 'Larger ecommerce, content or app builds with integrations and more moving parts.'],
        ['Custom Platform', '$10,000+', 'Serious platforms, advanced stores, SaaS-style products and complex rebuilds, scoped by proposal.'],
      ],
    },
    {
      kind: 'prose',
      label: 'Variables',
      heading: 'What actually moves the price?',
      body: [
        'Pages and layouts: a simple matching page adds about $100; a new custom layout is quoted separately. Features: online booking adds $400, payment gateways $600, client portals $1,000, AI chatbots $1,500. Content readiness matters more than people expect — entry prices assume you supply approved copy and images, and professional copywriting adds $500 if you’d rather hand us a rough doc.',
        'Integrations move numbers too: connecting accounting software, CRMs or inventory starts around $1,000 because someone has to make two systems agree. And one most guides won’t tell you: legal, financial and medical websites usually carry a 15–20% surcharge, because compliance review, disclaimers and regulatory wording take real hours.',
      ],
    },
    {
      kind: 'list',
      label: 'After launch',
      heading: 'The ongoing costs nobody mentions',
      items: [
        { title: 'Domain', text: 'Roughly $20–$40 a year for a .com.au through any registrar. Yours, not your developer’s — make sure of it.' },
        { title: 'Hosting', text: 'From a few dollars to $50-plus a month depending on the build. Fast static hosting for business sites costs very little.' },
        { title: 'Maintenance', text: 'Optional but sensible: $79 a month covers hosting, SSL, monitoring and a content update. DIY is fine if you’ll actually do it.' },
        { title: 'Care plans', text: 'Active support runs $99–$299 a month depending on response times and included updates.' },
        { title: 'Third-party tools', text: 'Booking systems, email platforms and payment processing carry their own subscriptions and fees — budget for them honestly.' },
        { title: 'Changes', text: 'One-off updates from $75, a new matching page around $250. Sites that never change slowly stop ranking and converting.' },
      ],
    },
    {
      kind: 'prose',
      label: 'Cashflow option',
      heading: 'Can you pay for a website monthly?',
      body: [
        'Yes — we offer every package as a subscription: $49 a month for a landing page, $99 for a business website, up to $499 for platform builds. We build, host and maintain the site while you pay monthly, you own it outright after a defined period (roughly twice the outright price, all-up), or buy it out early. Six-month minimum, then 30 days’ notice.',
        'It costs more over the full term — that’s the trade for starting at $99 instead of $1,500. For a cashflow-tight launch it’s often the right call, and we’ll show you both totals side by side so you’re choosing with your eyes open.',
      ],
    },
    {
      kind: 'prose',
      label: 'Context',
      heading: 'Why do Perth website quotes vary so wildly?',
      body: [
        'Because you’re quoting three different products. A $300–$800 marketplace job typically gets you a template filled in offshore — fine until you need a change and the seller has vanished. Studios like us sit in the $500–$10,000 range doing custom work with the person you spoke to. Larger agencies quote $10,000–$50,000 for similar builds plus account managers, meetings and overhead you’re also paying for.',
        'None of those are scams; they’re different cost structures. The question worth asking any quote: who actually does the work, and will they answer the phone in a year? Here, the person quoting is the person building — that’s most of why our overhead, and therefore our pricing, stays where it is.',
      ],
    },
  ],
  faqs: [
    {
      q: 'Is a $500 website worth it?',
      a: 'If you need one focused page, supply your own content, and want it done properly — yes, genuinely. It’s the same hand-coded quality as our larger builds, just tightly scoped. It’s not worth it if you actually need six pages and a booking system; underbuying costs more later.',
    },
    {
      q: 'Why did another agency quote $8,000 for the same site?',
      a: 'Probably account management, meetings and overhead rather than more website. Compare quotes on scope — pages, features, revisions, who does the work — not the headline number. Sometimes the $8,000 quote is justified by scope; often it’s the same six pages with more people invoicing around them.',
    },
    {
      q: 'Do these prices include GST?',
      a: 'Prices are in Australian dollars and exclude GST where applicable — standard for business services. Your written quote spells out the GST position before you commit, so the invoice never surprises you.',
    },
    {
      q: 'How much does an ecommerce website cost in Perth?',
      a: 'From $3,500 for a practical store with up to 20 products and standard checkout. Bigger catalogues, POS sync, subscriptions or custom product logic push into the $7,500 growth tier or platform territory. Product data readiness is the hidden cost — clean spreadsheets save real money.',
    },
    {
      q: 'What does a website cost to run per year?',
      a: 'Self-managed: roughly $60–$500 a year covering domain and hosting, depending on the build. Managed: $79 a month covers hosting, SSL, monitoring and a monthly content update. Add any third-party tools you choose — booking systems and email platforms bill separately.',
    },
    {
      q: 'Are pay-monthly websites a rip-off?',
      a: 'Not inherently — they’re financing plus a service bundle, and over the term you pay roughly double the outright price in exchange for starting near-free with maintenance included. The rip-off version is the one where you never own anything; ours converts to full ownership on a defined schedule.',
    },
    {
      q: 'How accurate is this guide?',
      a: 'These are our actual published prices as of 2026, pulled from the same data that renders our pricing pages — not estimates of what “the market” charges. Other providers will differ, but you can hold us to every number on this page.',
    },
  ],
  cta: {
    heading: 'Want a number for your actual project?',
    text: 'Describe it in two sentences. You’ll get a real range back — not a “book a strategy call to find out” runaround.',
  },
};
