/**
 * Article — Wix or Squarespace, or a custom-built website?
 *
 * Rewritten 16 Oct 2026 at the same address, when Caleb chose a rewrite over
 * cutting the numbers. The June page (live since 13 June 2026) ran its
 * five-year maths on a "$40-a-month plan" nobody had read at either platform,
 * padded it to "$60–$80 in practice", and set it against a $79 care plan the
 * site doesn't sell. Its keep-or-switch idea survives. Its unsourced lines
 * don't (see DO NOT ADD).
 *
 * Search phrase: "wix vs custom website", also "squarespace vs custom
 * website". The <title> carries both names; the /insights dek carries the hook.
 *
 * SOURCES, each read at the document on 16 Oct 2026 in the in-app browser,
 * from Perth (Cloudflare's trace that afternoon: loc=AU, colo=PER), with the
 * words relied on:
 *  1. Wix, "Plans", wix.com/plans. The page first rendered US dollar prices
 *     ("USD prices displayed for reference only"), then switched itself to
 *     Australian dollars. As shown in Australia: Light "AU$21/mo", Core
 *     "AU$42/mo", Business "AU$55/mo", Business Elite "AU$199/mo", each marked
 *     "Price includes GST"; Free "AU$0". "Displayed prices are for yearly
 *     subscriptions, paid in full at the time of purchase." Its "All plans
 *     include" list has "Reliable web hosting". The comparison
 *     table puts "Remove Wix branding from your site" in Light, and has
 *     "Accept payments" as "Not included in Light plan" but included in Core.
 *     Every paid plan lists "Free domain for 1 year". The page counts "+2000
 *     templates", and its AI builder lets you "Create your site from a single
 *     prompt". (The US reference prices before the switch: Light $17, Core
 *     $29, Business $39, Business Elite $159.)
 *  2. Wix Help Center, "Exporting or Embedding Your Wix Site Elsewhere": the
 *     site "needs to be hosted and operated on Wix's servers"; "the content
 *     you build on Wix belongs to you"; a domain can be bought and managed
 *     "with another provider".
 *  3. Wix Help Center, "Canceling a Wix Premium or Studio Plan": after
 *     cancelling, the address "reverts to the free Wix URL" and "Wix ads
 *     appear on your site"; "canceling your plan does not delete your site
 *     content".
 *  4. Squarespace, "Pricing", squarespace.com/pricing, currency shown as
 *     "$ AUD". Pay annually: Basic "A$17/mo", Core "A$28/mo", Plus "A$49/mo",
 *     Advanced "A$109/mo". Pay monthly: A$24, A$39, A$69 and A$149. Basic
 *     lists "Online store transaction fee of 2%". FAQ: "Squarespace doesn't
 *     offer a free plan"; "All Squarespace plans include our fully-managed
 *     cloud hosting"; an annual plan includes "a free custom domain for one
 *     year". A banner offered 50% off with a code, "Expires October 18,
 *     2026", that "applies to the first payment" of a new subscription only.
 *     The totals leave it out.
 *  5. Squarespace Help Center, "Taxes and Squarespace billing" (last updated
 *     7 Jan 2026): "Prices listed on our pricing page don't include tax." In
 *     Australia, "Goods & Services Tax (GST) will be applied".
 *  6. Squarespace Help Center, "Export your site content" (last updated
 *     10 Oct 2026): "You can export certain content"; "some content doesn't
 *     export". Its list of content that doesn't export includes store pages,
 *     portfolio pages, style settings and custom CSS. The exported file "can
 *     only be in a WordPress format".
 *  7. Squarespace Help Center, "Cancel your website subscription" (last
 *     updated 16 Oct 2026): visitors see a "Website expired" message; "search
 *     engines stop indexing your content"; "Your domain subscription stays
 *     active", and it can be transferred.
 *  8. Cloudflare Docs, "Limits" for Pages (last updated 5 Sep 2026): "Below
 *     are limits observed by the Cloudflare Free plan."
 *  9. Google Search Central, "Mobile site and mobile-first indexing best
 *     practices" (last updated 10 Dec 2025): "Google uses the mobile version
 *     of a site's content ... for indexing and ranking."
 *
 * The five-year sums, at those prices, on yearly billing:
 *   Wix Light 21 x 60 = $1,260, Core 42 x 60 = $2,520, Business 55 x 60 =
 *   $3,300, all GST included. Squarespace Basic 17 x 60 = $1,020 and Core
 *   28 x 60 = $1,680, both before GST. Domain renewals after the free first
 *   year aren't in them.
 * Our side, from src/data/pricing.js: Business Website $1,500, up to 6 pages;
 * Brochure Site $800, 2-5 pages, client-supplied copy and images; Landing Page
 * $500; monthly $49, $69 and $99, the business site owned after about 31
 * months (subscriptionInfo: "generally around 2x the outright price", a
 * six-month minimum, hosting and one content update a month included while
 * paying); care plans from $99/mo with one minor update a month
 * (supportPlans), so $99 x 60 = $5,940 over five years; Blog/CMS add-on $500
 * (webDesignAddOns). Domain renewals and hosting are third-party costs
 * (webScopeNotes). Ownership passing on full payment, and a monthly plan's
 * site ending if it's cancelled before ownership: src/pages/TermsOfService.jsx.
 * "The eight things" is the count of the checklist in
 * diy-website-vs-hiring-a-designer.js; change one and check the other.
 *
 * DO NOT ADD:
 *  - The June page's "$40-a-month plan", "$25–$60+ per month", "$60–$80 in
 *    practice", or a five-year cost "within a few hundred dollars of a custom
 *    build". None was read at either platform, and the real cheapest plans
 *    come in under our $1,500 build over five years.
 *  - A $79 care plan. Published care plans start at $99 a month
 *    (supportPlans); 79 is pricing.js's maintenanceRate, which no page shows.
 *  - "Stop paying, it's gone" for Wix, or "you own nothing". Wix's help pages
 *    say the site stays up on a wixsite.com address and the content is yours.
 *  - "Also 10,000 other businesses' template". Nobody counted that.
 *  - That builder sites load slower or rank lower than custom ones. No fair
 *    measurement was found, so the article tells readers how to test instead.
 *  - Monthly costs for apps or add-ons on top of a plan. None was read.
 *  - "Most of our $1,500 builds replace a builder site", or "we meet
 *    businesses at exactly that day more often than any other". Nothing on
 *    file counts either.
 *  - "Agencies quote $10,000." No source.
 *  - A conversion of Wix's US reference prices. Wix's Australian prices aren't
 *    a straight conversion, so quote what the page shows in Australia.
 *  - A hosting price for a custom site, or what C4 charges to host one.
 *    pricing.js publishes neither.
 */
export default {
  hero: {
    title: 'Wix or Squarespace, or a custom-built website?',
    intro: [
      'For a simple site, Wix or Squarespace is usually the cheaper choice, and often the right one. Pay for a custom build when you want a site you own outright and can move to any host, which neither builder gives you.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'We added up five years on each platform at the Australian prices their own pages showed on 16 October 2026. The cheapest paid plans come in under our $1,500 business website: $1,260 on Wix, and $1,020 plus GST on Squarespace. A site we build also needs hosting and a domain, paid separately. It’s a different story on Wix’s dearer plans. Core, the cheapest one that takes payments, comes to $2,520.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Five years at today’s prices',
      body: [
        'These are each company’s own prices, read from Perth on 16 October 2026, in Australian dollars. Wix’s page first loaded US prices marked as for reference only, then switched to Australian ones. The totals assume yearly billing, and that the prices don’t change for five years.',
      ],
    },

    {
      kind: 'table',
      head: ['Plan', 'Five years'],
      rows: [
        ['Wix Light, $21 a month incl. GST', '$1,260'],
        ['Wix Core, $42 a month incl. GST', '$2,520'],
        ['Wix Business, $55 a month incl. GST', '$3,300'],
        ['Squarespace Basic, $17 a month plus GST', '$1,020 plus GST'],
        ['Squarespace Core, $28 a month plus GST', '$1,680 plus GST'],
      ],
      caption: 'Billed yearly. From wix.com/plans and squarespace.com/pricing, read on 16 October 2026. Wix says its prices and currency vary by location.',
    },

    {
      kind: 'prose',
      body: [
        'Every plan includes hosting. Both companies give you the domain free for the first year on these yearly plans. After that the domain renews at a cost that isn’t in these totals. Squarespace adds GST at checkout, and its help centre says the prices on its pricing page don’t include tax.',
        'Light is the cheapest Wix plan that drops the Wix branding and connects your own domain, but it can’t take payments. Squarespace’s Basic plan can, with a 2% fee on online store sales. Wix also has a free plan, with Wix branding and a Wix web address.',
        'When we looked, Squarespace was offering half off the first payment with a code that expires on 18 October 2026. It only applies once, so we left it out.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What a custom site costs over the same five years',
      body: [
        'Our [business website](/web-design-perth) is $1,500, paid once, for up to six pages. Hosting and the domain are separate bills, paid to those companies. Most of a small custom site is plain files, and Cloudflare, which runs this site, has a free plan for hosting them.',
        'Changes are the other running cost. On Wix or Squarespace you make them yourself, whenever you like. On a custom site they go through a developer unless a content manager is built in, and on ours that’s a $500 add-on. Our care plans start at $99 a month and include one small update each month. Over five years that’s $5,940, which is more than any Wix plan in the table.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Paying monthly for a custom site',
      body: [
        'If you’d rather pay monthly, the way you would for a builder, we do that too. A business website is $99 a month, with hosting and a content update each month included, and it’s yours after about 31 months. That comes to roughly twice the pay-once price. There’s a six-month minimum.',
        'Until the site is yours, it works a lot like a builder. Our terms say that if you cancel before ownership passes to you, the site and its hosting end.',
      ],
    },

    {
      kind: 'list',
      heading: 'What happens when you stop paying',
      items: [
        { title: 'Wix', text: 'The site stays up, on a free wixsite.com address with Wix ads on it. Wix says your content isn’t deleted.' },
        { title: 'Squarespace', text: 'Visitors get a “Website expired” message and search engines stop indexing the site. Your domain stays registered, and you can move it.' },
        { title: 'A custom site you’ve paid for', text: 'There’s no platform fee to stop. You pay a host, and if you leave that host the files go with you.' },
      ],
    },

    {
      kind: 'prose',
      heading: 'Taking your site somewhere else',
      body: [
        'A Wix site can’t leave Wix. Its help centre says the site “needs to be hosted and operated on Wix’s servers”. The same page says the content you build there belongs to you, and that you can buy and manage your domain with another provider.',
        'Squarespace lets you export some of your content as a file made for WordPress. Its own list of what doesn’t export includes store pages, portfolio pages, style settings and custom CSS.',
        'Under our terms, the work we make for you becomes yours once it’s paid in full, so another developer can pick it up from there.',
      ],
    },

    {
      kind: 'prose',
      heading: 'When a builder is the right call',
      body: [
        'Choose a builder when the site is small and you’d like to make changes yourself. It’s also the sensible way to test an idea before you spend real money on it. Over five years the cheapest plans cost less than our business website, and they include hosting.',
        'If that’s where you’ve landed, do it properly. Our [DIY checklist](/diy-website-vs-hiring-a-designer) covers the eight things we’d sort out first.',
      ],
    },

    {
      kind: 'prose',
      heading: 'When custom is worth paying for',
      body: [
        'Go custom when owning the site matters to you, because you can’t take a Wix site with you and only some of a Squarespace site exports. It also makes sense if you’d be on a dearer plan anyway. Five years of Wix Business comes to $3,300, more than twice our business website before its hosting and domain.',
        'Custom is also the way to get a design made for your business. On a builder you start from a template or an AI-generated draft and adjust it from there. Wix lists more than 2,000 templates.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What we couldn’t establish',
      body: [
        'We didn’t find a fair, measured comparison of how quickly builder sites load or how well they rank against custom ones, so this article doesn’t claim either. If speed matters to you, test it. Put any site you like through Google’s [PageSpeed Insights](https://pagespeed.web.dev/), ours included.',
        'We haven’t priced the apps people add to builder sites, or what hosting and a domain will cost for your particular site. Both platforms can change their prices, which is why every price here carries the date we read it.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        { title: 'Plans', publisher: 'Wix', year: 'Read 16 October 2026, from Perth', url: 'https://www.wix.com/plans' },
        { title: 'Pricing', publisher: 'Squarespace', year: 'Read 16 October 2026, from Perth', url: 'https://www.squarespace.com/pricing' },
        { title: 'Taxes and Squarespace billing', publisher: 'Squarespace Help Center', year: 'Updated 7 January 2026', url: 'https://support.squarespace.com/hc/en-us/articles/41973437309709-Taxes-and-Squarespace-billing' },
        { title: 'Exporting or Embedding Your Wix Site Elsewhere', publisher: 'Wix Help Center', year: 'Read 16 October 2026', url: 'https://support.wix.com/en/article/exporting-or-embedding-your-wix-site-elsewhere' },
        { title: 'Canceling a Wix Premium or Studio Plan', publisher: 'Wix Help Center', year: 'Read 16 October 2026', url: 'https://support.wix.com/en/article/canceling-a-wix-premium-or-studio-plan' },
        { title: 'Export your site content', publisher: 'Squarespace Help Center', year: 'Updated 10 October 2026', url: 'https://support.squarespace.com/hc/en-us/articles/206566687-Export-your-site-content' },
        { title: 'Cancel your website subscription', publisher: 'Squarespace Help Center', year: 'Updated 16 October 2026', url: 'https://support.squarespace.com/hc/en-us/articles/205810508-Cancel-your-website-subscription' },
        { title: 'Limits (Cloudflare Pages)', publisher: 'Cloudflare Docs', year: 'Updated 5 September 2026', url: 'https://developers.cloudflare.com/pages/platform/limits/' },
        { title: 'Mobile site and mobile-first indexing best practices', publisher: 'Google Search Central', year: 'Updated 10 December 2025', url: 'https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing' },
      ],
    },
  ],

  faqs: [
    {
      q: 'Is Wix or Squarespace cheaper?',
      a: 'At the prices we read on 16 October 2026, Squarespace Basic was $17 a month billed yearly, plus GST, and Wix Light was $21 with GST included. Light can’t take payments and Basic can, with a 2% fee on online store sales. Wix also has a free plan, and Squarespace doesn’t.',
    },
    {
      q: 'Can a Wix site rank on Google?',
      a: 'Yes, builder sites can rank. We haven’t found a fair measurement of how they rank against custom sites, so we won’t tell you custom ranks better. Google does say it uses the mobile version of a site for indexing and ranking, so check yours on a phone whichever way you build.',
    },
    {
      q: 'Can you move my Wix or Squarespace site to a custom one?',
      a: 'We’d rebuild it, because a Wix site only runs on Wix and Squarespace only exports part of a site. We keep your content and your domain, and set up permanent redirects from your old page addresses to the new ones.',
    },
    {
      q: 'Can I pay for a custom site monthly?',
      a: 'Yes. A business website is $99 a month with hosting and a monthly content update included, and it’s yours after about 31 months. That’s roughly twice the pay-once price, with a six-month minimum.',
    },
    {
      q: 'What if $1,500 is too much right now?',
      a: 'Our brochure site is $800 for two to five pages, if you can supply the words and photos. A single landing page is $500. Both can be paid monthly as well, from $49 a month.',
    },
  ],

  cta: {
    heading: 'On the fence between them?',
    text: 'Tell us what the site needs to do and what you pay for it now. If a builder still makes more sense, we’ll say so.',
  },
};
