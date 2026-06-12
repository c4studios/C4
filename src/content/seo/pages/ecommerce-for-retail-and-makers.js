/**
 * Industry — E-commerce for Retail & Makers.
 * Proof: Arty Design (maker/engraving studio, per brief) + DS Racing
 * Karts (499 Square products). Unique detail: the product-data-readiness
 * truth — the spreadsheet is the real project.
 */
export default {
  hero: {
    label: 'E-commerce for Retail & Makers',
    title: ['Online stores for makers', 'and retailers who actually ship.'],
    intro: [
      'C4 Studios builds ecommerce for Perth retailers and makers — engravers, craftspeople, boutiques, parts sellers and producers taking real products online. Stores start at $3,500 with checkout, shipping and tax rules done properly, and we’ve handled everything from a maker’s engraving studio to a 499-product Square catalogue migration.',
    ],
  },
  sections: [
    {
      kind: 'prose',
      label: 'The honest bit',
      heading: 'What’s the hardest part of launching a store?',
      body: [
        'Not the website — the spreadsheet. Photos, descriptions, variants, weights, prices and stock counts for every product is the work that decides whether a store launches in five weeks or five months, and nobody warns you. We do, on day one, and we hand you a clean template so the data lands right the first time.',
        'Markets-and-Instagram sellers feel this hardest: the products are brilliant, the records are a notes app. The store build is genuinely the easy half — and once the data exists, it powers your POS, your socials and your accounting too.',
      ],
    },
    {
      kind: 'list',
      label: 'What we build',
      heading: 'What a small store actually needs',
      items: [
        { title: 'Checkout that finishes', text: 'Cards, wallets, clear shipping at the cart — abandonment lives in surprise costs and clunky payment screens.' },
        { title: 'Variants done right', text: 'Sizes, colours, materials, personalisation fields — engraving text included — without a separate listing for every combination.' },
        { title: 'Shipping and tax rules', text: 'Flat-rate, weight-based, local pickup, GST handled. The unglamorous plumbing that decides your margins.' },
        { title: 'Product photography', text: 'Through C4 Lens — products shot consistently, because the photo is the product until the parcel arrives.' },
        { title: 'POS and inventory sync', text: 'Square and friends kept in step with the store from $1,200, so the market stall and the website never argue about stock.' },
        { title: 'Email capture from day one', text: 'Your list is the only sales channel you’ll ever own outright. The store should feed it from launch.' },
      ],
    },
    {
      kind: 'proof',
      label: 'Proof',
      heading: 'Stores and product work we can point to',
      cases: [
        { name: 'Arty Design', summary: 'Ecommerce work for a maker and engraving studio — personalised products with the variant and customisation handling that makers actually need.', tag: 'Maker store' },
        { name: 'DS Racing Karts', summary: 'A 499-product store migrated from a Square catalogue with full checkout — proof the data-heavy version is a solved problem here.', href: '/CaseStudy?slug=ds-racing-karts', tag: 'Catalogue migration' },
      ],
    },
    {
      kind: 'table',
      label: 'Scope',
      heading: 'Starter store or growth build?',
      head: ['', 'Starter store ($3,500)', 'Growth build ($7,500)'],
      rows: [
        ['Products', 'Up to 20 loaded for you', 'Expanded catalogues and bulk imports'],
        ['Checkout', 'Standard cards and wallets', 'Plus subscriptions, bundles, custom logic'],
        ['Shipping', 'Standard rules and pickup', 'Carrier integration, complex zones'],
        ['Integrations', 'Order notification emails', 'POS sync, accounting, custom APIs'],
        ['Right for', 'Makers and first stores', 'Established retail going serious online'],
      ],
    },
    {
      kind: 'pricing',
      label: 'Pricing',
      heading: 'What does an online store cost?',
      mode: 'anchor',
      note: 'Stores start at $3,500 with up to 20 products loaded; extra product batches are $300 per 25, POS sync from $1,200. Marketing-site pricing applies if you sell in person and just need to be found.',
    },
  ],
  faqs: [
    {
      q: 'How much does an ecommerce website cost in Perth?',
      a: 'From $3,500 for a practical store: up to 20 products loaded, standard checkout, shipping and tax rules, order emails. Larger catalogues, subscriptions and POS sync move into the $7,500 growth tier. Product batches beyond the first 20 are $300 per 25.',
    },
    {
      q: 'Can you handle personalised and custom products?',
      a: 'Yes — personalisation fields, engraving text, made-to-order flags and variant pricing are standard maker territory for us. The Arty Design work was exactly this: products where every order carries customer input, captured cleanly at checkout.',
    },
    {
      q: 'We sell at markets with Square — can the store sync?',
      a: 'That’s the ideal setup: your Square catalogue becomes the source of truth, the website sells from it, and stock stays honest across stall and store. We’ve migrated a 499-product Square catalogue, so yours is unlikely to scare us.',
    },
    {
      q: 'Shopify or custom — what do you build on?',
      a: 'We build custom storefronts because they’re faster, fee-light and genuinely yours — no monthly platform creep. But we’ll say honestly when a hosted platform fits better; a maker testing demand sometimes should start simpler and graduate. The answer comes from your numbers, not our preference.',
    },
    {
      q: 'What about the product photos?',
      a: 'C4 Lens shoots product properly — consistent lighting, clean backgrounds, lifestyle shots for the hero spots. Phone photos can carry a launch if they’re honest, but the conversion difference on maker products is real: people buy the photograph.',
    },
  ],
  cta: {
    heading: 'The products are ready. Let’s do the spreadsheet.',
    text: 'Tell us what you make or stock, roughly how many products, and how you take payment today. Honest scope back within a day.',
  },
};
