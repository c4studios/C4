/**
 * Article — Build it yourself, or hire a web designer?
 *
 * Rewritten 16 Oct 2026 at the same address, when Caleb chose a rewrite over
 * cutting the numbers. The June page (live since 13 June 2026) rested on "a
 * first DIY website honestly takes 40–60 hours", which nobody had measured,
 * multiplied it by a $50 hour into "$2,000–$3,000 of effort", and added
 * "$30–$60 a month" in platform fees that no pricing page had been read for.
 * Its idea survives: count your own time. Its figures don't (see DO NOT ADD).
 *
 * Search phrase: "diy website vs hiring a web designer", also "build my own
 * website or hire someone". The <title> keeps "Count Your Hours", which is now
 * exactly what the piece asks the reader to do.
 *
 * SOURCES, each read at the document on 16 Oct 2026 in the in-app browser,
 * from Perth (Cloudflare's trace that afternoon: loc=AU, colo=PER), with the
 * words relied on:
 *  1. Wix, "Plans", wix.com/plans. As shown in Australia: Free "AU$0"; Light
 *     "AU$21/mo", "Price includes GST". "Displayed prices are for yearly
 *     subscriptions, paid in full at the time of purchase." FAQ: "With a
 *     Premium plan you can connect your own domain, remove Wix branding".
 *     Every paid plan lists "Free domain for 1 year"; the "All plans include"
 *     list has "Reliable web hosting"; Light lists "24/7 customer care". The
 *     page first showed US prices "for reference only", then switched itself
 *     to Australian dollars.
 *  2. Squarespace, "Pricing", squarespace.com/pricing, in "$ AUD": "Free for
 *     14 days."; Basic "A$17/mo" paying annually. FAQ: "Squarespace doesn't
 *     offer a free plan"; "All Squarespace plans include our fully-managed
 *     cloud hosting"; an annual plan includes "a free custom domain for one
 *     year"; "You can also connect a domain you already own".
 *     A "24/7 Support" panel links its help centre.
 *  3. Squarespace Help Center, "Taxes and Squarespace billing" (last updated
 *     7 Jan 2026): "Prices listed on our pricing page don't include tax."
 *  4. Wix, "The Wix State of Websites Report in 2026",
 *     wix.com/data/state-of-websites: "the average time to publish a website
 *     dropped 50%, from 8 days to 4." The page gives no method.
 *  5. Wix Help Center, "Exporting or Embedding Your Wix Site Elsewhere": the
 *     site "needs to be hosted and operated on Wix's servers"; a domain can be
 *     bought and managed "with another provider"; "To connect a domain to your
 *     Wix site, you must upgrade your site with a plan."
 *  6. Google, "Google Business Profile", business.google.com/aunz: "creating a
 *     Business Profile and listing your business on Google is free"; the
 *     profile is how a business appears "on Google Search and Maps".
 *  7. Google Search Central, "Mobile site and mobile-first indexing best
 *     practices" (last updated 10 Dec 2025): "Google uses the mobile version
 *     of a site's content ... for indexing and ranking."
 *  8. Search Console Help, "About Search Console": "Google Search Console is a
 *     free service offered by Google"; it helps you monitor "your site's
 *     presence in Google Search results".
 * Our side, from src/data/pricing.js: Landing Page $500 or $49/mo, one page,
 * client-supplied copy and images, 1 revision round, 14-day warranty;
 * Brochure Site $800, 2-5 pages, client-supplied copy and images, 1 revision
 * round, 14-day warranty; Business Website $1,500 or $99/mo, up to 6 pages,
 * conversion-focused structure, contact form and enquiry routing, Analytics
 * and Search Console, Google Business Profile links, 2 revision rounds,
 * 30-day warranty; Copywriting package $500 and Photography + videography
 * add-on $750 (webDesignAddOns; webScopeNotes: copywriting and photography
 * "are separate unless they are added to the project"); care plans
 * from $99/mo (supportPlans); monthly plans come to "generally around 2x the
 * outright price" with a six-month minimum, hosting included while paying
 * (subscriptionInfo). Domain renewals and hosting are third-party costs
 * (webScopeNotes). Ownership on full payment: src/pages/TermsOfService.jsx.
 *
 * DO NOT ADD:
 *  - Any figure for how many hours a first DIY site takes, the June page's
 *    "40–60 hours" included. Searched 16 Oct 2026: nothing primary measures
 *    it. Wix's "8 days to 4" is calendar time, counted by Wix with no stated
 *    method, and may only be quoted as that.
 *  - An example hourly rate, or a dollar value for DIY time. The reader
 *    supplies both.
 *  - "$30–$60 a month" or "$0–$60/month" in platform fees. Quote the plans as
 *    read, with the date.
 *  - "A few hours of input, total" for a hired build. Nobody has timed a
 *    client's side of one.
 *  - "A hundred small judgment calls", "three websites of practice", or "half
 *    our favourite projects start as a brave Wix draft". Invented counts.
 *  - That a Google Business Profile "works harder than the website itself",
 *    or that daylight phone photos "beat every stock library". No source.
 *  - Schema markup as standard on every build. pricing.js lists it in SEO
 *    Foundation, not in the landing, brochure or business site.
 *  - That DIY sites convert worse or rank lower. No fair measurement found.
 */
export default {
  hero: {
    title: 'Build it yourself, or hire a web designer?',
    intro: [
      'Build it yourself if the budget really is zero or you’re still testing the idea. Hire someone when the site has to bring in work and your evenings are already spoken for. The cash side is easy to compare, so most of this piece is about your hours.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'Doing it yourself costs less in cash. Wix will host a basic site for free with its branding on it, and its cheapest paid plan was $21 a month on a yearly plan when we checked. Our cheapest site is a $500 landing page. What decides it is your time. We couldn’t find a trustworthy figure for how long a first site takes, so the sum that matters is your own hours multiplied by what an hour of your time is worth. If that comes to more than a quote, hiring is the cheaper option.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What doing it yourself costs in cash',
      body: [
        'Wix has a free plan. The site carries Wix branding and sits on a Wix web address, and connecting your own domain needs a paid plan. The cheapest paid plan, Light, was $21 a month on a yearly plan, GST included, when we read Wix’s pricing page from Perth on 16 October 2026. The page first showed US prices for reference, then switched to Australian dollars.',
        'Squarespace has no free plan, but it gives you 14 days to try it. Its Basic plan was $17 a month billed yearly, and Squarespace adds GST to that at checkout.',
        'Both include hosting, and both give you a domain free for the first year on a yearly plan. We added up five years of each against a custom build in [Wix or Squarespace vs a custom website](/wix-squarespace-vs-custom-website).',
      ],
    },

    {
      kind: 'list',
      heading: 'Count your hours',
      intro: 'Put your own estimate beside each of these jobs. Count the evenings as well as the weekends.',
      items: [
        { title: 'Learning the builder', text: 'Choosing a template and finding your way around the editor.' },
        { title: 'Writing every page', text: 'The words on every page. This job stays yours even if you hire us, unless you add copywriting.' },
        { title: 'Photos', text: 'Taking pictures of your own work and getting them onto the site.' },
        { title: 'Domain and email', text: 'Registering the domain and pointing it at the site, plus an email address on it if you want one.' },
        { title: 'Forms and bookings', text: 'Making sure an enquiry actually reaches you. Send a test from someone else’s phone.' },
        { title: 'Google Business Profile', text: 'Setting it up and making its details match the site.' },
        { title: 'The phone check', text: 'Going through every page on a phone and fixing what breaks.' },
      ],
    },

    {
      kind: 'prose',
      body: [
        'Add those up, then add the hours the site will need each year once it’s live. Multiply the total by what an hour of your time is worth to the business, and compare that with a quote.',
      ],
    },

    {
      kind: 'list',
      heading: 'What each road gets you',
      items: [
        { title: 'Cash up front', text: 'Yourself: nothing on Wix’s free plan, or a yearly plan fee. With us: from $500 for a landing page, or $1,500 for a business website.' },
        { title: 'After launch', text: 'Yourself: the plan fee, every year. With us: hosting and the domain, paid to those companies, plus a care plan from $99 a month if you want one.' },
        { title: 'Your time', text: 'Yourself: all of it. With us: supplying content and signing off the design.' },
        { title: 'Words and photos', text: 'Yours either way, unless you add copywriting ($500) or photography ($750) to a build with us.' },
        { title: 'Revisions', text: 'Yourself: as many as you like. With us: one round on landing pages and brochure sites, two on a business website.' },
        { title: 'When something goes wrong', text: 'Wix and Squarespace both list 24/7 support. Our builds come with a launch warranty of 14 or 30 days, depending on the package.' },
        { title: 'Leaving later', text: 'A Wix site can’t leave Wix. Work we build for you is yours once it’s paid for.' },
      ],
    },

    {
      kind: 'list',
      heading: 'Doing it yourself? Do these eight things',
      items: [
        { title: 'Register the domain yourself', text: 'In your business’s name, in an account you control. Wix and Squarespace both let you connect a domain you bought somewhere else.' },
        { title: 'Start with one page', text: 'Say what you do and how to reach you. Add pages when you’ve got something to put on them.' },
        { title: 'Put your phone number at the top', text: 'On every page, as a link that dials when someone taps it on a phone.' },
        { title: 'Use your own photos', text: 'Pictures of your actual work and premises, taken in daylight.' },
        { title: 'Write like you talk', text: 'Read every page aloud. If you wouldn’t say it to a customer, rewrite it.' },
        { title: 'Set up your Google Business Profile', text: 'It’s free, and it’s how your business appears on Google Search and Maps.' },
        { title: 'Check every page on a phone', text: 'Google ranks the mobile version of your site, so that’s the version to get right.' },
        { title: 'Set a launch date', text: 'Go live on it. Then connect Google Search Console, which is free and shows how your site is doing in Google Search.' },
      ],
    },

    {
      kind: 'prose',
      heading: 'When doing it yourself is the right call',
      body: [
        'If the budget really is zero, build it yourself and do it well. The same goes for an idea you’re still testing, or a side project that needs a public face before it earns anything.',
        'And if you enjoy the work, the hours stop being a cost, which changes the sum completely.',
      ],
    },

    {
      kind: 'prose',
      heading: 'When hiring someone is worth it',
      body: [
        'Hire when the site has to win work and your hours are worth more than the quote. It’s also worth it when the DIY version has been nearly finished for months.',
        'If the up-front cost is what’s stopping you, our monthly route spreads it out. A landing page is $49 a month and a business website $99, with hosting included while you pay. By the time the site is yours you’ll have paid about twice the pay-once price, and there’s a six-month minimum.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What we couldn’t establish',
      body: [
        'We looked for a measured figure on how long a first website takes to build yourself, and didn’t find one we’d trust. The closest is Wix’s own State of Websites report, which says the average time to publish a site fell from eight days to four between 2025 and 2026. That’s days on the calendar, counted by the company selling the builder, and the report doesn’t say how it was measured. It can’t tell you how many hours a first site will take you.',
        'We also didn’t find fair data comparing how DIY sites and professionally built ones work out for a business, so this piece doesn’t claim either way.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        { title: 'Plans', publisher: 'Wix', year: 'Read 16 October 2026, from Perth', url: 'https://www.wix.com/plans' },
        { title: 'Pricing', publisher: 'Squarespace', year: 'Read 16 October 2026, from Perth', url: 'https://www.squarespace.com/pricing' },
        { title: 'Taxes and Squarespace billing', publisher: 'Squarespace Help Center', year: 'Updated 7 January 2026', url: 'https://support.squarespace.com/hc/en-us/articles/41973437309709-Taxes-and-Squarespace-billing' },
        { title: 'The Wix State of Websites Report in 2026', publisher: 'Wix', year: 'Read 16 October 2026', url: 'https://www.wix.com/data/state-of-websites' },
        { title: 'Exporting or Embedding Your Wix Site Elsewhere', publisher: 'Wix Help Center', year: 'Read 16 October 2026', url: 'https://support.wix.com/en/article/exporting-or-embedding-your-wix-site-elsewhere' },
        { title: 'Google Business Profile', publisher: 'Google', year: 'Read 16 October 2026', url: 'https://business.google.com/aunz/business-profile/' },
        { title: 'Mobile site and mobile-first indexing best practices', publisher: 'Google Search Central', year: 'Updated 10 December 2025', url: 'https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing' },
        { title: 'About Search Console', publisher: 'Search Console Help, Google', year: 'Read 16 October 2026', url: 'https://support.google.com/webmasters/answer/9128668' },
      ],
    },
  ],

  faqs: [
    {
      q: 'Is it cheaper to build my own website?',
      a: 'In cash, yes. Wix has a free plan, and its cheapest paid plan was $21 a month on a yearly plan when we checked. Whether it’s cheaper overall depends on how many hours it takes you and what those hours are worth.',
    },
    {
      q: 'What do I get for $1,500 that I might not do myself?',
      a: 'Our business website is up to six pages, laid out to turn visitors into enquiries, with a contact form that routes to you. We set up Analytics and Search Console and link your Google Business Profile. It comes with two revision rounds and a 30-day launch warranty.',
    },
    {
      q: 'Can you take over my half-finished DIY site?',
      a: 'Yes. If it’s on Wix we can’t move the site itself, because Wix sites only run on Wix’s servers, so we’d rebuild it. We keep your content and your domain, and redirect any old page addresses that already get visits.',
    },
    {
      q: 'I enjoy doing it myself. Am I wasting my time?',
      a: 'Not if you enjoy it. Hours you’d happily spend anyway aren’t a cost. It only stops making sense when doing it yourself keeps the site from ever going live.',
    },
    {
      q: 'What’s the cheapest professional option?',
      a: 'Our $500 landing page: one page, built from words and photos you supply, with one revision round and a 14-day launch warranty. On the monthly route it’s $49 a month, with hosting included while you pay.',
    },
  ],

  cta: {
    heading: 'Want a quote to weigh it against?',
    text: 'If you build it yourself, the checklist above is yours to keep. If you’d rather hand it over, tell us what the site needs to do and we’ll send you a fixed written quote.',
  },
};
