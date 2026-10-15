/**
 * Article — Website redesign or start again?
 *
 * Written 15 Oct 2026, the first of the fortnightly articles (Caleb, that
 * day: "we also need to get cracking with our next installment. id say a NEW
 * ARTICLE ONCE A FORTNIGHT"). It replaces, at the same address, the short
 * decision page that had been live here since 13 June 2026. The address stays
 * because keeping addresses is the article's own advice. The old page's
 * keep-or-rebuild idea survives; its unsourced lines don't (see DO NOT ADD).
 *
 * Search phrase: "website redesign or start again", also "redesign or rebuild
 * website". The <title> and the H1 carry it; the /insights dek carries the hook.
 *
 * SOURCES, each read at the document on 15 Oct 2026, with the words relied on:
 *  1. Google Search Central, "Site moves with URL changes" (last updated
 *     20 Aug 2026):
 *       "Expect temporary fluctuation in site ranking during the move."
 *       "301 and other permanent redirects don't cause a loss in PageRank."
 *       "Keep the redirects for as long as possible, generally at least 1 year."
 *       "a small to medium-sized website can take a few weeks for most pages to
 *        move, and larger sites take longer."
 *       "we recommend that you use HTTP permanent redirects if possible, such as
 *        301 and 308."  "Avoid chaining redirects."
 *       "make sure that you include URLs of embedded content in your site move
 *        plans: videos, images, JavaScript, and CSS files."
 *       "Change the internal links on the new site from the old URLs to the new URLs."
 *       "Submit the new sitemap in Search Console."
 *       "redirects are slow for users, so try to update your own links and any
 *        high-volume links from other websites to point to the new URLs."
 *  2. Google Search Central, "Redirects and Google Search" (last updated
 *     14 Apr 2026): "Use permanent redirects when you're sure that the redirect
 *     won't be reverted." HTTP 301 and 308 are both listed as permanent.
 *  3. Google Search Central, "Mobile site and mobile-first indexing best
 *     practices" (last updated 10 Dec 2025): "Google uses the mobile version of
 *     a site's content, crawled with the smartphone agent, for indexing and
 *     ranking."
 *  4. web.dev, "Web Vitals" (Google, last updated 31 Oct 2024): LCP "should
 *     occur within 2.5 seconds of when the page first starts loading"; "pages
 *     should have a INP of 200 milliseconds or less"; "pages should maintain a
 *     CLS of 0.1. or less"; "a good threshold to measure is the 75th percentile
 *     of page loads"; a page passes "if it meets the recommended targets at the
 *     75th percentile for all three".
 *  5. Google for Developers, "About PageSpeed Insights" (last updated
 *     21 Oct 2024): "Core Web Vitals, a subset of critical performance signals,
 *     includes LCP, CLS, and INP"; a page "might not have sufficient data if it
 *     has been recently published or has too few samples from real users";
 *     "Sometimes the origin may also have insufficient data, in which case PSI
 *     will be unable to show any real-user experience data."
 *  6. Search Console Help, "About Search Console": "Google Search Console is a
 *     free service offered by Google".
 *  7. Search Console Help, "Performance report (Search results)": the table's
 *     tabs are "Queries Pages Countries Devices Search appearance Dates"; the
 *     chart "displays total clicks, total impressions, average CTR, and average
 *     position".
 *  8. The PHP Group, "Supported Versions" (php.net, read 15 Oct 2026): 8.2 is
 *     the oldest supported branch, security support until 31 Dec 2026. End of
 *     life: "A release that is no longer supported. Users of this release should
 *     upgrade as soon as possible, as they may be exposed to unpatched security
 *     vulnerabilities."
 *  9. WordPress.org, "Requirements": "PHP version 8.3 or greater."
 * 10. WordPress.org Documentation, "Site Health Screen": "Site Health screen is
 *     located in your dashboard under Tools > Site Health > Info"; one of its
 *     results reads "Your site is running an outdated version of PHP, which
 *     requires an update".
 * 11. Our own redirects (public/_redirects, the block dated 9 Oct 2026). Checked
 *     live on 15 Oct 2026 with curl: all six old addresses, each with and
 *     without its slash (twelve requests), return 301 straight to their
 *     c4site.com.au/articles/ page in one hop; the two new pages named in the
 *     table return 200. Six articles moved that day (the block lists six).
 * Prices: src/data/pricing.js webDesignPackages. Business Website $1,500 (up to
 * 6 pages), Custom Website $2,500 (up to 8 pages). There is no redesign package
 * in pricing.js, so the article says so instead of naming one.
 *
 * The two example rows use neutral slugs on purpose. C4 Studios copy never
 * discredits AI systems, and a slug like /ai-detectors-dont-work/ read out on
 * this site would.
 *
 * DO NOT ADD:
 *  - Any percentage of traffic lost to redesigns or migrations. Searched
 *    15 Oct 2026: every figure found came from SEO companies or trade press
 *    measuring with third-party tools (the "60%" and "229 days" figures among
 *    them). None is from Google or from published research.
 *  - Any line that says a rebuild keeps or holds rankings outright. Google says
 *    to expect temporary fluctuation. The old page's "rebuilds typically hold
 *    their rankings and then climb" had no source.
 *  - A client result. The old page said the DS Racing Karts rebuild carried the
 *    business across "without dropping what it had earned". Nothing measured
 *    that. Its FAQ also claimed traffic recoveries "we've handled before",
 *    which nothing on file supports.
 *  - How long the fluctuation lasts, beyond Google's "a few weeks" for most
 *    pages of a small or medium site.
 *  - That Google treats old pages redirected to the home page as soft 404s.
 *    It's widely repeated and wasn't traced to a Google page in this pass.
 *  - How long the redirects took us to write. Nobody timed it.
 *  - Share-of-sites figures for WordPress or PHP versions. W3Techs and the like
 *    are third parties.
 *  - A redesign price, or an audit offer. pricing.js has neither.
 */
export default {
  hero: {
    title: 'Website redesign or start again?',
    intro: [
      'Most people asking this have a site that still works and looks its age. You can fix it where it stands or start again. Either way, Google knows your pages by their addresses, and it has published what it takes to carry them through a rebuild.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'Redesign if your site runs on software that still gets security updates and holds up on a phone. Start again if it fails either test, because fixing that means replacing most of the site anyway. Whichever you choose, point every old address at its new page with a permanent redirect. Google’s own guide says those redirects don’t cost you PageRank, and to keep them for at least a year.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Check what it runs on',
      body: [
        'If your site is WordPress, it runs on a programming language called PHP. WordPress recommends PHP 8.3 or newer. The PHP project only supports 8.2 and later, and 8.2 gets its last security fixes on 31 December 2026. Anything older has reached what PHP calls end of life, and PHP tells anyone still on it to upgrade as soon as possible.',
        'You can see where yours stands in the WordPress dashboard, under Tools, then Site Health. WordPress flags it there when the PHP version is out of date.',
        'Ask your host to move the site to a supported version. If the site breaks when they do, the theme or the plugins it leans on need replacing, and that’s rebuild work whatever it ends up being called.',
        'On Wix or Squarespace there’s no version to check. The question there is whether your content can come with you when you leave, which we went through in [Wix or Squarespace vs a custom website](/wix-squarespace-vs-custom-website).',
      ],
    },

    {
      kind: 'prose',
      heading: 'Then look at it on a phone',
      body: [
        'Google ranks your site on what it sees on a phone. Its documentation says it uses the mobile version of a site’s content for indexing and ranking.',
        'Put your home page through Google’s [PageSpeed Insights](https://pagespeed.web.dev/). It reports the three measures Google calls Core Web Vitals, and Google has published what counts as good for each one.',
      ],
    },

    {
      kind: 'table',
      head: ['Measure', 'What it tracks', 'Good'],
      rows: [
        ['Largest Contentful Paint', 'How long the main content takes to appear', 'Within 2.5 seconds'],
        ['Interaction to Next Paint', 'How quickly the page responds to a tap or a click', '200 milliseconds or less'],
        ['Cumulative Layout Shift', 'How much the page jumps around while it loads', '0.1 or less'],
      ],
      caption: 'Google’s thresholds for a good experience, from web.dev’s Web Vitals page.',
    },

    {
      kind: 'prose',
      body: [
        'Google measures these over real visits, and a page passes when at least three in four visits are good on each measure. If your site doesn’t get enough visits for that, PageSpeed Insights says it can’t show real-user data. The lab test underneath is still worth reading.',
        'A slow score on its own doesn’t decide anything. A heavy photo at the top of the home page is a redesign fix. If the layout itself falls apart on a narrow screen, the templates were built for a desktop, and new templates are most of a rebuild.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Find the pages people already find',
      body: [
        'Open Google Search Console and go to the Performance report. Its Pages tab lists the addresses on your site that turn up in Google, with the clicks each one gets. Those are the addresses to protect, whichever way you go.',
        'If you’ve never set up Search Console, do that before anything else. It’s a free service from Google, and the rest of this article leans on it.',
      ],
    },

    {
      kind: 'image',
      photo: 'renovation',
      caption: 'A renovation keeps the structure and replaces what’s around it. A redesign is the same job on a website.',
    },

    {
      kind: 'prose',
      heading: 'When a redesign is enough',
      body: [
        'If the software is supported and the site holds up on a phone, a redesign is usually the cheaper road. The addresses stay where they are, so there’s nothing to redirect, and the pages that already rank can keep what they say while the design around them changes.',
        'We don’t have a separate redesign price. A redesign is quoted against the same packages as a new build, because the work is close to the same: a [business website](/web-design-perth) of up to six pages is $1,500, and a custom website of up to eight is $2,500.',
      ],
    },

    {
      kind: 'prose',
      heading: 'When starting again is cheaper',
      body: [
        'Start again when the platform is out of support or the layout fails on phones at the template level. Fixing either means replacing most of what’s there. Patching it now and rebuilding a year later means paying twice for the same pages.',
        'Ownership is the other reason. If you can’t log in to your own site, or the domain sits in someone else’s account, a rebuild is the time to fix that. Setting up redirects needs control of both, so it has to be sorted before the move.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Will starting again lose our rankings?',
      body: [
        'Google has a guide for exactly this, called Site moves with URL changes. It doesn’t pretend nothing will move.',
      ],
    },

    {
      kind: 'quote',
      quote: 'Expect temporary fluctuation in site ranking during the move.',
      attribution: 'Google Search Central, “Site moves with URL changes”, last updated 20 August 2026',
    },

    {
      kind: 'prose',
      body: [
        'The same guide says permanent redirects, the 301 and 308 kinds, don’t cause a loss in PageRank. It gives a timescale too. For a small or medium site, most pages take a few weeks to move in Google’s index, and bigger sites take longer.',
        'So some movement while Google catches up is expected. A lot of the guide is about the map: a list of every old address and the new page it should go to.',
      ],
    },

    {
      kind: 'process',
      heading: 'How the move is done',
      steps: [
        {
          title: 'List every old address',
          text: 'Start with the pages Search Console shows getting clicks, then add the rest from your sitemap. Google’s guide counts images and other embedded files too.',
        },
        {
          title: 'Decide where each one goes',
          text: 'Match each old page to the new page that answers the same question. Where nothing does, pick the closest page a visitor would still find useful.',
        },
        {
          title: 'Redirect each one permanently, in one hop',
          text: 'Google recommends permanent redirects such as 301 and 308, set up on the server, and says to avoid chains of redirects.',
        },
        {
          title: 'Update your own links and your sitemap',
          text: 'Change the links inside the new site to the new addresses, then submit the new sitemap in Search Console.',
        },
        {
          title: 'Leave the redirects in place',
          text: 'Google’s guide says to keep them for as long as possible, and generally at least a year.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'When we moved six of our own pages',
      body: [
        'On 9 October 2026 we moved six articles from this site to our sister site, c4site.com.au. Each old address now sends a permanent redirect straight to its new page, in one hop. Here are two of them. Open either old address and you’ll land on the new one.',
      ],
    },

    {
      kind: 'table',
      head: ['Old address', 'Where it goes now'],
      rows: [
        ['c4studios.com.au/ai-indemnity-you-already-have/', 'c4site.com.au/articles/ai-indemnity-you-already-have/'],
        ['c4studios.com.au/one-page-ai-policy/', 'c4site.com.au/articles/one-page-ai-policy/'],
      ],
      caption: 'Both checked on 15 October 2026: each old address answers with a 301 and the new page with a 200.',
    },

    {
      kind: 'prose',
      body: [
        'Each one is in our redirect file twice, with the slash on the end and without it, so both spellings land in the same place.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What we couldn’t establish',
      body: [
        'We looked for a published figure on how often redesigns lose search traffic. Every one we found came from SEO companies or trade press, measured on other people’s sites with third-party tools. None came from Google or from published research, so there’s no percentage in this article.',
        'Google doesn’t say how long the ranking wobble lasts, only that most pages on a small or medium site take a few weeks to move, and we haven’t guessed. It’s also too soon to say how our own six pages are doing on their new site. They moved on 9 October 2026.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        { title: 'Site moves with URL changes', publisher: 'Google Search Central', year: 'Updated 20 August 2026', url: 'https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes' },
        { title: 'Redirects and Google Search', publisher: 'Google Search Central', year: 'Updated 14 April 2026', url: 'https://developers.google.com/search/docs/crawling-indexing/301-redirects' },
        { title: 'Mobile site and mobile-first indexing best practices', publisher: 'Google Search Central', year: 'Updated 10 December 2025', url: 'https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing' },
        { title: 'Web Vitals', publisher: 'web.dev, Google', year: 'Updated 31 October 2024', url: 'https://web.dev/articles/vitals' },
        { title: 'About PageSpeed Insights', publisher: 'Google for Developers', year: 'Updated 21 October 2024', url: 'https://developers.google.com/speed/docs/insights/v5/about' },
        { title: 'About Search Console', publisher: 'Search Console Help, Google', year: 'Read 15 October 2026', url: 'https://support.google.com/webmasters/answer/9128668' },
        { title: 'Performance report (Search results)', publisher: 'Search Console Help, Google', year: 'Read 15 October 2026', url: 'https://support.google.com/webmasters/answer/7576553' },
        { title: 'Supported Versions', publisher: 'The PHP Group, php.net', year: 'Read 15 October 2026', url: 'https://www.php.net/supported-versions.php' },
        { title: 'Requirements', publisher: 'WordPress.org', year: 'Read 15 October 2026', url: 'https://wordpress.org/about/requirements/' },
        { title: 'Site Health Screen', publisher: 'WordPress.org Documentation', year: 'Read 15 October 2026', url: 'https://wordpress.org/documentation/article/site-health-screen/' },
      ],
    },
  ],

  faqs: [
    {
      q: 'How much does a website redesign cost?',
      a: 'We quote a redesign against the same packages as a new build: $1,500 for a business website of up to six pages, or $2,500 for a custom website of up to eight. If only a few pages need work, we’ll quote just those.',
    },
    {
      q: 'Can we keep our domain name?',
      a: 'Yes. Your domain is separate from the website on it, so a new site can go up on the same domain. If your page addresses stay the same as well, there’s nothing to redirect.',
    },
    {
      q: 'How long do the redirects need to stay?',
      a: 'Google’s guide says as long as possible, and generally at least a year. It also notes that redirects are slow for visitors, so point your own links straight at the new addresses.',
    },
    {
      q: 'Will a redesign fix our Google rankings?',
      a: 'Not by itself. A site that loads quickly and works on a phone helps, but what your pages say and which other sites link to you count as well. If rankings are the real problem, our article on whether small businesses need SEO is a better place to start.',
    },
  ],

  cta: {
    heading: 'Want a second opinion on yours?',
    text: 'Our prices are on the site. Start a project with your current address and what’s bothering you about it, and we’ll tell you which way we’d go.',
  },
};
