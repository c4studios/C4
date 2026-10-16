/**
 * Comparison — How much does a website cost in Perth? (2026 guide)
 *
 * Rewritten 16 Oct 2026 to the article standard, at the same address. Caleb
 * chose that day to rewrite the older comparison pages rather than only cut
 * their numbers. The straight-numbers opening stays. Every price was checked
 * against src/data/pricing.js that day, and the market comparisons came out
 * because none of them had a source (see DO NOT ADD).
 *
 * The answer block's first paragraph is also shown word for word on
 * /seo-and-copywriting: src/components/seo-copy/sections.jsx imports this file
 * and prints it under "How much does a website cost in Perth?". Keep it a
 * complete answer on its own, with its numbers in it.
 *
 * SOURCES, read 16 Oct 2026. Every price is from src/data/pricing.js:
 *  - webDesignPackages: Landing Page $500 ($49/mo, "Client-supplied copy and
 *    images"); Brochure Site $800 ($69/mo, "2-5 simple brochure pages");
 *    Business Website $1,500 ($99/mo, "Up to 6 pages"); Custom Website $2,500
 *    ($149/mo, "Up to 8 pages", "Blog or CMS foundation"); Ecommerce Store
 *    $3,500 ($199/mo, "Up to 20 products loaded"); Web App Starter $4,500
 *    ($249/mo, "One core app workflow"); Growth Build $7,500 ($399/mo, "Up to
 *    12 pages or key screens"); Custom Platform "$10,000+" ($499/mo,
 *    "Proposal-scoped platform build"). Revision rounds run from 1 (Landing
 *    Page) to 5 (Custom Platform), launch warranties from 14 to 90 days.
 *  - webPricingGuides and ASTERISK_CLAUSE, printed by the `pricing` section
 *    straight from the file.
 *  - webScopeNotes: "$100 additional page pricing means a simple matching
 *    content page. New custom layouts or complex sections are quoted
 *    separately." "$500 landing pages and $800 brochure sites assume approved
 *    copy, images, and brand assets are supplied before build." "POS sync,
 *    subscriptions, memberships, advanced shipping, large catalogues, or custom
 *    product logic move into add-ons or larger tiers." Third-party costs:
 *    "Domain renewals, hosting/platform subscriptions, paid plugins/apps,
 *    payment processing fees, stock assets, email hosting, and ad spend".
 *  - webDesignAddOns: Additional page $100, 3-page pack $250, 5-page pack $400,
 *    Copywriting package $500, Online booking / appointments $400, Payment
 *    gateway setup $600, Client portal / login area $1,000, Custom API
 *    integration $1,000+, Inventory or POS sync $1,200+, Extra product batch
 *    (up to 25) $300.
 *  - subscriptionInfo: "We build, host, and maintain your site while you pay
 *    monthly."; whatsIncluded "Hosting, SSL, security, uptime monitoring, 1
 *    content update/month."; ownership "generally around 2x the outright price.
 *    Or buy out early."; "6-month minimum, then 30 days notice.";
 *    monthsToOwnership.business 31 (the home quote builder prints "Own it after
 *    about 31 months."). 31 x $99 = $3,069.
 *  - supportPlans: Basic Care $99/mo ("Hosting monitoring", "Security patches",
 *    "1 minor update/month (15 min)", "Email support"), Standard Care $179/mo,
 *    Premium Care $299/mo.
 *  - supportTickets: "Minor update (text/image swap, < 15 min)" $75.
 *    boosterPacks: "Page Add" $250, "1 new page designed and built to match
 *    existing site". Neither list renders on any other page, so this guide is
 *    the only place they're published.
 *  - INDUSTRY_SURCHARGE_NOTE, quoted whole (it also prints on /ServiceWeb):
 *    "Professional services industries (legal, financial, medical) may incur a
 *    15–20% surcharge due to compliance and regulatory requirements. This will
 *    be discussed during your discovery call."
 *  - GST_NOTE: "All prices in AUD. No GST is added, as C4 Studios isn’t
 *    registered for GST."
 * And /About: "C4 Studios is Caleb Scott, founder and sole operator" and "The
 * person you brief is the person who builds."
 *
 * DO NOT ADD:
 *  - Any market price. The old "$300–$800" marketplace jobs, "$10,000–$50,000"
 *    agencies, "$8,000 for the same site" and quotes "$7,000 apart" had no
 *    source. Searched 16 Oct 2026: every Australian figure found came from
 *    agencies or quote-comparison sites with work to sell, and none from
 *    government or published research.
 *  - A domain or hosting price. The old "$20–$40 a year", "a few dollars to
 *    $50-plus a month" and "$60–$500 a year" had no source. pricing.js lists
 *    both as third-party costs.
 *  - $79 a month, under any name, and above all as a "care plan". The June
 *    page offered it twice, as maintenance. It is
 *    subscriptionInfo.maintenanceRate, which sits with the pay-monthly terms
 *    (we build, host and maintain while you pay), so it isn't a care plan:
 *    the published care plans start at $99 (Basic Care). It renders on no page, and pricing.js
 *    doesn't say how it relates to the per-package monthly prices this page
 *    quotes ($49 to $499, the ones /ServiceWeb shows). Brain site_issues 38.
 *    Ask Caleb before it comes back.
 *  - A bundle saving, or any "cheaper than buying separately" line. Caleb
 *    dropped the bundle "Save" badges on 16 Oct 2026, and two of the three
 *    savings didn't add up from published prices (brain site_issues 173). If
 *    bundles are ever added here, give their prices only.
 *  - "Our most popular package". `popular: true` in pricing.js is a display
 *    flag, not a count of sales.
 *  - "usually carry a 15–20% surcharge". The published note says "may incur".
 *  - "about $100" a page, inventory "around $1,000", "around $250" a page and
 *    "well past $10,000". The prices are $100, $1,200+, $250 and "$10,000+".
 *  - "every invoice says so" about GST. Brain site_issue 39 found invoices
 *    without the statement.
 *  - A chatbot or any other AI add-on. It came off C4 Studios on 9 Oct 2026
 *    (Caleb's answer 2A, brain site_issue 148).
 */
export default {
  hero: {
    title: 'How much does a website cost in Perth in 2026?',
    intro: [
      'Straight numbers, from our own price list. A one-page landing site is $500, and a brochure site of two to five pages is $800. A business website is $1,500, or $2,500 for a custom site. Online stores start at $3,500 and web apps at $4,500. A custom platform starts at $10,000 and is scoped by proposal.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'With us, a business website of up to six pages is $1,500, and a custom site of up to eight is $2,500. A one-page site is $500 if you supply the words and photos. If paying upfront is the hard part, the business website is also $99 a month with hosting and maintenance included, and it’s yours after about 31 months.',
      ],
    },

    {
      kind: 'pricing',
      heading: 'Our prices in three brackets',
      mode: 'range',
    },

    {
      kind: 'table',
      heading: 'Every package, every price',
      /* "Outright" rather than "Price": the column header's width is what
         keeps "$10,000+" on one line at 390px, and it names the price the
         monthly section is set against. The soft hyphen lets "Ecommerce"
         break as Ecom-merce in the narrow first column instead of being
         split at an arbitrary letter (article.css breaks table cells
         anywhere). Both checked at 390 and 1440 on 16 Oct 2026. */
      head: ['Package', 'Outright', 'What it covers'],
      rows: [
        ['Landing Page', '$500', 'One focused page for a new offer or a simple service business. You supply the copy and images.'],
        ['Brochure Site', '$800', 'Two to five simple pages sharing one design. You supply the copy and images.'],
        ['Business Website', '$1,500', 'Up to six pages built around getting enquiries, with enquiry routing and analytics.'],
        ['Custom Website', '$2,500', 'Up to eight pages, with custom sections and a blog or CMS foundation.'],
        ['Ecom­merce Store', '$3,500', 'A starter store with up to 20 products loaded, standard checkout, basic shipping and tax rules, and order emails.'],
        ['Web App Starter', '$4,500', 'A first version of a web app built around one core workflow, such as a customer portal or a dashboard.'],
        ['Growth Build', '$7,500', 'A larger store or web app with more integrations, up to 12 pages or key screens.'],
        ['Custom Platform', '$10,000+', 'Large stores and SaaS-style products, scoped by proposal.'],
      ],
      caption: 'Checked against our price list on 16 October 2026. All prices in AUD. No GST is added, as C4 Studios isn’t registered for GST.',
    },

    {
      kind: 'prose',
      heading: 'What changes the price',
      body: [
        'Every extra page adds to it. While we’re building, a page that matches the design is $100, and packs of three or five pages are $250 and $400. A new custom layout gets its own quote.',
        'So do features. Online booking adds $400 and a payment gateway adds $600. A client login area is $1,000.',
        'Our $500 and $800 sites assume you hand over approved copy and images before we start. If you’d rather we wrote the words, copywriting is $500.',
        'Connecting your site to other software costs more, because two systems have to be made to agree. A custom API integration starts at $1,000, and syncing your inventory or point-of-sale system starts at $1,200.',
        'Some industries may pay a surcharge. Here’s our published note on it, word for word.',
      ],
    },

    {
      kind: 'quote',
      quote: 'Professional services industries (legal, financial, medical) may incur a 15–20% surcharge due to compliance and regulatory requirements. This will be discussed during your discovery call.',
      attribution: 'C4 Studios pricing note, as published on our web design page',
    },

    {
      kind: 'list',
      heading: 'What it costs after launch',
      items: [
        { title: 'Domain', text: 'You renew it through a domain registrar, and the fee is theirs. Make sure it’s registered in your name.' },
        { title: 'Hosting', text: 'If you own the site outright, the host bills you for it. On a pay-monthly plan, it’s included while you pay.' },
        { title: 'Care plans', text: 'If you’d like us looking after the site, plans run from $99 to $299 a month. Basic Care at $99 covers hosting monitoring, security patches, one minor update a month and email support.' },
        { title: 'Other tools', text: 'Paid apps, payment processing fees, stock photos and email hosting are billed by whoever provides them.' },
        { title: 'Changes', text: 'A small one-off update is $75. A new page added after launch, built to match, is $250, against $100 a page while we’re building, so it pays to plan your pages up front.' },
      ],
    },

    {
      kind: 'prose',
      heading: 'Can you pay for a website monthly?',
      body: [
        'Yes. Every package can be paid monthly instead, from $49 a month for a landing page to $499 for a custom platform. The business website is $99. We host and look after the site while you pay, and it’s yours once you’ve paid roughly twice the outright price. You can buy it out earlier if you like. There’s a six-month minimum, then 30 days’ notice.',
        'It costs more over the full term. The business website comes to about $3,069 over the roughly 31 months it takes to own, against $1,500 upfront, with hosting and maintenance included along the way. For a tight launch it can still be the right call. Ask us for both totals and compare them.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why do website quotes vary so much?',
      body: [
        'Two quotes for “the same site” are often priced on different jobs. One includes copywriting and photography, and the other assumes you’ll supply both. Revision rounds and launch warranties move the number too. Ours are listed with each package, from one round and a 14-day warranty on a landing page to five rounds and 90 days on a custom platform.',
        'Ask each studio to put in writing what’s excluded, and compare those lists. Our piece on [why web designers hide their prices](/why-web-designers-hide-their-prices) goes through comparing quotes when one of them won’t give a number.',
        'With us, the person who quotes is the person who builds. C4 Studios is one person, so there’s no account manager to pay for.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What we couldn’t establish',
      body: [
        'We looked for an independent figure for what a website costs in Perth, or anywhere in Australia. Every one we found came from web agencies or quote-comparison sites, which sell or broker the work. We didn’t find one from government or published research, so the only prices in this guide are ours.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        { title: 'Web design packages, monthly prices and pricing notes', publisher: 'C4 Studios', year: 'Read 16 October 2026', url: 'https://c4studios.com.au/ServiceWeb/' },
        { title: 'Quote builder, with the add-ons, care plans and months to ownership', publisher: 'C4 Studios home page', year: 'Read 16 October 2026', url: 'https://c4studios.com.au/' },
        { title: 'About C4 Studios', publisher: 'C4 Studios', year: 'Read 16 October 2026', url: 'https://c4studios.com.au/About/' },
        { title: 'Our price list, the file those pages are built from', publisher: 'C4 Studios', year: 'Read 16 October 2026' },
      ],
    },
  ],

  faqs: [
    {
      q: 'Is a $500 website worth it?',
      a: 'If one page covers what you need and you can supply the words and photos, yes. You get one focused page with a contact form, basic SEO setup, analytics and a revision round. If you actually need six pages and a booking system, start with the business website, because pages added after launch cost more than pages built in.',
    },
    {
      q: 'Why do two quotes for the same site differ so much?',
      a: 'They’re usually priced on different scope. Ask each studio to list what’s excluded. Copywriting and photography are the usual gaps, and so is loading the content.',
    },
    {
      q: 'Do these prices include GST?',
      a: 'There’s no GST to add. C4 Studios isn’t registered for GST, so the prices here, in Australian dollars, are what you pay.',
    },
    {
      q: 'How much does an online store cost in Perth?',
      a: 'With us, from $3,500 for a starter store with up to 20 products loaded, standard checkout and basic shipping and tax rules. More products are $300 for each batch of up to 25. Bigger catalogues, POS sync, subscriptions or custom product logic move into add-ons or the larger tiers, such as the $7,500 growth build.',
    },
    {
      q: 'What does a website cost to run each year?',
      a: 'Your domain and hosting are billed by whoever provides them, so we haven’t put a number on them. If you’d like us looking after the site, care plans start at $99 a month. On a pay-monthly plan, hosting and maintenance are included while you pay.',
    },
    {
      q: 'Are pay-monthly websites a rip-off?',
      a: 'They cost more over the full term, roughly twice the outright price with ours. In return you start without the upfront cost, with hosting and maintenance included while you pay. The thing to check with anyone is whether you ever own the site. Ours is yours once the term is paid, or earlier if you buy it out.',
    },
    {
      q: 'How accurate is this guide?',
      a: 'Every price here was checked against our own price list on 16 October 2026, the same list our web design page is built from. They’re starting prices for the scope each package lists. Other studios will charge differently.',
    },
  ],

  cta: {
    heading: 'Want a number for your actual project?',
    text: 'Describe it in a couple of sentences and we’ll send back a range. You won’t need a call to find out what it costs.',
  },
};
