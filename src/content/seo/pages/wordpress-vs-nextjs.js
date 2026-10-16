/**
 * Comparison — WordPress or Next.js for a business website?
 *
 * Rewritten 16 Oct 2026 to the article standard, at the same address as the
 * June 2026 page it replaces. Caleb chose that day to rewrite the older
 * comparison pages rather than only cut their numbers. The declared bias and
 * the "where WordPress still wins" idea survive. The old page's figures don't:
 * none of them had a source (see DO NOT ADD).
 *
 * Search phrase: "wordpress vs nextjs", also "wordpress or next.js for a
 * business website". The <title> carries the first, the H1 the second.
 *
 * SOURCES, each read at the document on 16 Oct 2026, with the words relied on:
 *  1. WordPress.org, "Plugins" (wordpress.org/plugins/): "Browse over 75,000
 *     free plugins."
 *  2. WordPress.org, "Requirements": "To run WordPress, it’s recommended your
 *     host supports: PHP version 8.3 or greater. MariaDB version 10.11 or
 *     greater OR MySQL version 8.0 or greater. HTTPS support". Also: "WordPress
 *     also works with PHP 7.4+ and MySQL 5.5.5+. However, these versions have
 *     reached their official End Of Life and may expose your site to security
 *     vulnerabilities."
 *  3. WordPress.org, "About": "licensed under the General Public License (GPLv2
 *     or later)"; "People with a limited tech experience can use it “out of the
 *     box”, and more tech-savvy folks can customize it in remarkable ways."
 *  4. WordPress.org, "Releases": "Only the most recent in the 7.1 series is safe
 *     to use and actively maintained." 7.1 released August 19, 2026; 7.1.3
 *     October 6, 2026.
 *  5. WordPress.org News, "WordPress 7.1.3 Maintenance and Security Release"
 *     (6 Oct 2026): "This security and maintenance release features 7 security
 *     fixes and 4 bug fixes." "Because this is a security release, it is
 *     recommended that you update your sites immediately."
 *  6. WordPress Developer Resources, "Upgrading WordPress", under Configuring
 *     Automatic Background Updates: "Automatic background updates were
 *     introduced in WordPress 3.7"; "By default, automatic updates of WordPress
 *     are enabled on most sites."
 *  7. WordPress.org Documentation, "Plugin and themes auto-updates": "Since
 *     WordPress 5.5, websites Administrators can manually opt-in for automatic
 *     updates theme by theme and plugin by plugin." "By default WordPress runs
 *     auto-updates twice per day." "Before enabling auto-updates on your
 *     plugins and themes, you may want to make sure you’re able to rollback to
 *     a previous version of your website in case things go wrong."
 *  8. WordPress.org Documentation, "Roles and Capabilities": Editor,
 *     "somebody who can publish and manage posts including the posts of other
 *     users"; Contributor, "somebody who can write and manage their own posts
 *     but cannot publish them".
 *  9. WordPress Developer Resources, "Plugin Developer FAQ": "Plugins are closed
 *     for guideline violations, security issues, or by author requests."
 *     "No one will be able to download the plugin via the website, nor will
 *     they be able to install it via the WordPress admin." Every plugin page
 *     in the directory shows "Last updated" and "Tested up to" (checked on
 *     three plugin pages that day).
 * 10. WordPress.org, "WordPress Playground": "lets you run WordPress instantly
 *     on any device without a host."
 * 11. Next.js home page: "Next.js by Vercel is the full-stack React framework
 *     for the web."
 * 12. Next.js Docs, "What is Next.js?": "Next.js is a React framework for
 *     building full-stack web applications." "Our documentation assumes some
 *     familiarity with web development", then HTML, CSS, JavaScript and React.
 * 13. Next.js Docs, "Deploying": "Next.js can be deployed as a Node.js server,
 *     Docker container, static export, or adapted to run on different
 *     platforms." Feature support: Node.js server "All", static export
 *     "Limited".
 * 14. Next.js Docs, "Static Exports" (last updated 9 Aug 2026): "When running
 *     next build, Next.js generates an HTML file per route." "it can be
 *     deployed and hosted on any web server that can serve HTML/CSS/JS static
 *     assets." "Features that require a Node.js server, or dynamic logic that
 *     cannot be computed during the build process, are not supported".
 * 15. Next.js, "Support Policy": Active LTS brings "security patches";
 *     Maintenance LTS "only critical bug fixes and essential security updates";
 *     "Each major version will remain in Maintenance LTS for two years
 *     following the initial release." 14.x (Oct. 26, 2023) is listed under
 *     "Unsupported Versions".
 * 16. Next.js Blog, "Security Advisory: CVE-2025-66478" (3 Dec 2025): "A
 *     critical vulnerability has been identified in the React Server Components
 *     (RSC) protocol." Affected: "Applications using React Server Components
 *     with the App Router". "All users should upgrade to a patched version
 *     immediately." "There is no workaround—upgrading to a patched version is
 *     required."
 * 17. Vercel Docs, "Hobby plan" (last updated 14 Sep 2026): "The Hobby plan is
 *     free and aimed at developers with personal projects". Vercel Docs, "Fair
 *     use guidelines" (last updated 14 Sep 2026): "Hobby teams are restricted to
 *     non-commercial personal use only. All commercial usage of the platform
 *     requires either a Pro or Enterprise plan."
 * 18. The Next.js repository, examples/cms-wordpress: "an example on how you can
 *     build a Next.js 14 project (with App Router), using WordPress as the data
 *     source."
 * Prices: src/data/pricing.js. Blog/CMS add-on $500 (webDesignAddOns); the
 * $2,500 Custom Website includes "Blog or CMS foundation"; Basic Care, $99/mo,
 * includes "Security patches" (supportPlans).
 * Our own stack: the brain's clients table on 16 Oct 2026 lists Next.js for six
 * client and internal builds and Vite + React for five, this site among them.
 * Hence "often with Next.js", and not "only".
 *
 * DO NOT ADD:
 *  - "60,000 plugins". The directory said "over 75,000" on 16 Oct 2026. Re-read
 *    wordpress.org/plugins/ before changing the number.
 *  - A hosting price for either. The old "$10–$50+/month" and "often near-zero"
 *    had no source, and Vercel's free plan is for non-commercial use only, so
 *    "near-zero" was wrong for a business hosting there.
 *  - A WordPress maintenance price. The old "$50–$150 a month" had no source.
 *  - Any figure for hacked WordPress sites or plugin vulnerabilities. Searched
 *    16 Oct 2026: the figures come from companies selling WordPress security
 *    (Patchstack, Wordfence) or blogs repeating them. None is from WordPress.org.
 *    The old "most hacked small-business sites are unpatched WordPress" went too.
 *  - WordPress's share of the web. WordPress.org's About page gives one without
 *    saying how it's measured, and the redesign article's header bars
 *    share-of-sites figures as third-party measurements.
 *  - That Next.js has "almost nothing to exploit" or needs "effectively zero"
 *    maintenance. Next.js published a critical advisory in Dec 2025 and
 *    supports each major version for two years.
 *  - That a static export was safe from that advisory. The advisory doesn't say.
 *  - That either one is faster or ranks better. Nothing here measured it.
 *  - "Smaller pool, generally stronger developers" and "Most Perth small
 *    businesses ... have been sold the second". No source for either.
 *  - "Monthly updates or it rots". WordPress sets no cadence; it says to update
 *    to the latest version.
 */
export default {
  hero: {
    title: 'WordPress or Next.js for a business website?',
    intro: [
      'We build sites in React, often with Next.js, so weigh what follows with that in mind. WordPress is still the better pick for some businesses, and here’s how to tell if you’re one of them.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'Choose WordPress if several people will write for the site, or you want to change pages yourself without calling a developer. Choose Next.js if the site changes now and then, or needs something built to fit, like a quote calculator or a customer login. Both need security updates, so plan for them whichever you pick.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What each one is',
      body: [
        'WordPress is free, open-source software for running a website. You install it on a web host, then write and edit your pages from its dashboard. WordPress.org says people with limited tech experience can use it out of the box.',
        'Next.js is a framework for building websites and web apps in React, made by a company called Vercel. A developer writes the site in code. The Next.js documentation assumes some familiarity with web development, and suggests being comfortable with HTML, CSS, JavaScript and React before you start.',
      ],
    },

    {
      kind: 'table',
      heading: 'Side by side',
      /* The first column has a header on purpose. With an empty one it had
         no minimum width, and article.css breaks table cells anywhere, so at
         390px the labels split mid-word ("Wh / at it is"), as the June
         version's did. "Question" holds the column open; checked at 390 and
         1440 on 16 Oct 2026. */
      head: ['Question', 'WordPress', 'Next.js'],
      rows: [
        ['What is it?', 'Free, open-source publishing software, licensed under the GPL', 'A React framework for building web apps and sites, from Vercel'],
        ['What does it run on?', 'A host with PHP 8.3 or newer and MySQL 8.0 or MariaDB 10.11 or newer, as WordPress.org recommends', 'A Node.js server for every feature, or any static web host for a static export'],
        ['Who edits it?', 'Anyone you give a login, with roles that control who can publish', 'A developer, in code, unless a content management system is added'],
        ['What can you add?', 'Over 75,000 free plugins from the WordPress.org directory', 'Features built into the site in code'],
        ['How is it patched?', 'Security releases install themselves on most sites, and plugins and themes can be set to update too', 'Each major version gets security fixes until two years after its release, and a developer applies them'],
      ],
      caption: 'From WordPress.org and the Next.js documentation, read 16 October 2026.',
    },

    {
      kind: 'list',
      heading: 'When WordPress is the better choice',
      items: [
        {
          title: 'Several people write for the site',
          text: 'WordPress has roles built in. A contributor can write posts but can’t publish them, so their work waits for someone with the editor role to put it live.',
        },
        {
          title: 'You want to make changes yourself',
          text: 'You can try the editor before you commit. WordPress Playground runs WordPress in your browser, with no host to set up.',
        },
        {
          title: 'A plugin already does the job',
          text: 'The WordPress.org directory lists over 75,000 free plugins. If a well-kept one does what you need, you may not need to pay anyone to build it.',
        },
        {
          title: 'Your WordPress site already works',
          text: 'If it’s on a supported version and doing its job, we’d usually tell you to keep it.',
        },
      ],
    },

    {
      kind: 'prose',
      body: [
        'Our article on [whether to redesign or start again](/website-redesign-vs-starting-again) shows how to check which version of PHP your WordPress site runs on, from inside its own dashboard.',
      ],
    },

    {
      kind: 'prose',
      heading: 'When Next.js is the better choice',
      body: [
        'Next.js suits a site that changes now and then, where you’re happy for a developer to make the changes. It also suits a site that needs something built for it, like a booking flow or a customer portal, because it’s made for web applications as much as pages.',
        'It doesn’t need a server of its own, either. Next.js can export a site as plain files, one HTML page per route, and any web host that serves files can serve them. You give up the features that need a server, but there’s no PHP or database to keep running.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Both need updates',
      body: [
        'WordPress can do a lot of this for itself. Automatic background updates arrived in version 3.7, and WordPress’s documentation says they’re on by default for most sites. Since version 5.5 you can switch on automatic updates for each plugin and theme as well, and WordPress runs them twice a day. Its guide to those updates suggests making sure you can roll the site back before you turn them on.',
        'The updates matter. WordPress 7.1.3, released on 6 October 2026, carried seven security fixes, and WordPress.org recommended updating immediately. Its release archive is blunt about anything older.',
      ],
    },

    {
      kind: 'quote',
      quote: 'Only the most recent in the 7.1 series is safe to use and actively maintained.',
      attribution: 'WordPress.org, “Releases”, read 16 October 2026',
    },

    {
      kind: 'prose',
      body: [
        'Plugins are the part to watch. Each plugin’s page in the directory shows when it was last updated and the WordPress version it was tested up to. WordPress.org closes plugins over security issues and guideline breaches, and once a plugin is closed, nobody can download or install it from there.',
        'Next.js needs updating too. Its support policy gives each major version security fixes until two years after its first release, and version 14, from October 2023, is already on the unsupported list. In December 2025 the Next.js team published a critical security advisory for apps using its App Router. It told all users to upgrade immediately, and said upgrading was the only fix.',
        'On a Next.js site, updates are a developer’s job. Someone has to install the new version and put the site live again. Our own care plans include security patches, starting at $99 a month.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Where each one lives',
      body: [
        'WordPress needs a host that runs PHP and a database. WordPress.org recommends PHP 8.3 or newer, with MySQL 8.0 or MariaDB 10.11 or newer. It still works on some older versions, but WordPress.org says those have reached end of life and may expose your site to security vulnerabilities.',
        'A Next.js site that uses every feature needs a Node.js server. A static export only needs a host that serves files. If you host with Vercel, the company behind Next.js, check the plan. Vercel’s free Hobby plan is for non-commercial personal use only, and a business site needs its Pro or Enterprise plan.',
        'We haven’t put a hosting price on either. Hosts set their own prices, and they change.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Editing a Next.js site',
      body: [
        'Out of the box, changing a Next.js page means changing code. If you’ll be publishing often, a content management system (CMS) gives you somewhere to write without touching it. We add one for $500, and our $2,500 custom website includes a blog or CMS foundation.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What we couldn’t establish',
      body: [
        'We looked for a figure on how often WordPress sites get hacked, and how often a plugin is the way in. The numbers we found came from companies that sell WordPress security products, or from blogs repeating them. We didn’t find one from WordPress.org, so there isn’t one here.',
        'We haven’t compared speed or search rankings either, because we haven’t measured the two side by side.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        { title: 'Plugins', publisher: 'WordPress.org', year: 'Read 16 October 2026', url: 'https://wordpress.org/plugins/' },
        { title: 'Requirements', publisher: 'WordPress.org', year: 'Read 16 October 2026', url: 'https://wordpress.org/about/requirements/' },
        { title: 'About', publisher: 'WordPress.org', year: 'Read 16 October 2026', url: 'https://wordpress.org/about/' },
        { title: 'Releases', publisher: 'WordPress.org', year: 'Read 16 October 2026', url: 'https://wordpress.org/download/releases/' },
        { title: 'WordPress 7.1.3 Maintenance and Security Release', publisher: 'WordPress.org News', year: '6 October 2026', url: 'https://wordpress.org/news/2026/10/wordpress-7-1-3-maintenance-and-security-release/' },
        { title: 'Upgrading WordPress', publisher: 'WordPress Developer Resources', year: 'Read 16 October 2026', url: 'https://developer.wordpress.org/advanced-administration/upgrade/upgrading/' },
        { title: 'Plugin and themes auto-updates', publisher: 'WordPress.org Documentation', year: 'Read 16 October 2026', url: 'https://wordpress.org/documentation/article/plugins-themes-auto-updates/' },
        { title: 'Roles and Capabilities', publisher: 'WordPress.org Documentation', year: 'Read 16 October 2026', url: 'https://wordpress.org/documentation/article/roles-and-capabilities/' },
        { title: 'Plugin Developer FAQ', publisher: 'WordPress Developer Resources', year: 'Read 16 October 2026', url: 'https://developer.wordpress.org/plugins/wordpress-org/plugin-developer-faq/' },
        { title: 'WordPress Playground', publisher: 'WordPress.org', year: 'Read 16 October 2026', url: 'https://wordpress.org/playground/' },
        { title: 'Next.js by Vercel', publisher: 'nextjs.org', year: 'Read 16 October 2026', url: 'https://nextjs.org/' },
        { title: 'What is Next.js?', publisher: 'Next.js Docs', year: 'Read 16 October 2026', url: 'https://nextjs.org/docs' },
        { title: 'Deploying', publisher: 'Next.js Docs', year: 'Read 16 October 2026', url: 'https://nextjs.org/docs/app/getting-started/deploying' },
        { title: 'Static Exports', publisher: 'Next.js Docs', year: 'Updated 9 August 2026', url: 'https://nextjs.org/docs/app/guides/static-exports' },
        { title: 'Support Policy', publisher: 'nextjs.org', year: 'Read 16 October 2026', url: 'https://nextjs.org/support-policy' },
        { title: 'Security Advisory: CVE-2025-66478', publisher: 'Next.js Blog', year: '3 December 2025', url: 'https://nextjs.org/blog/CVE-2025-66478' },
        { title: 'Hobby plan', publisher: 'Vercel Docs', year: 'Updated 14 September 2026', url: 'https://vercel.com/docs/plans/hobby' },
        { title: 'Fair use guidelines', publisher: 'Vercel Docs', year: 'Updated 14 September 2026', url: 'https://vercel.com/docs/limits/fair-use-guidelines' },
        { title: 'cms-wordpress example', publisher: 'The Next.js repository on GitHub', year: 'Read 16 October 2026', url: 'https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress' },
      ],
    },
  ],

  faqs: [
    {
      q: 'Is WordPress dying?',
      a: 'No. WordPress 7.1 came out on 19 August 2026, and its latest update, 7.1.3, on 6 October.',
    },
    {
      q: 'Is Next.js better for SEO than WordPress?',
      a: 'Not by itself, as far as we can tell. Either one can be fast or slow depending on how it’s built. Google’s PageSpeed Insights will show you how your own pages load.',
    },
    {
      q: 'Can I edit a Next.js site myself?',
      a: 'Not out of the box. Changes go through a developer unless a content management system is added. We add one for $500, and our $2,500 custom website includes a blog or CMS foundation.',
    },
    {
      q: 'Can WordPress and Next.js work together?',
      a: 'Yes. WordPress can hold the content while Next.js builds the pages people see, and the Next.js project publishes an example set up that way. You still have a WordPress install behind it to host and keep updated.',
    },
    {
      q: 'Can you move our WordPress site to Next.js?',
      a: 'Yes. The content comes across, and every old address gets a permanent redirect to its new page. Our article on whether to redesign or start again goes through how that move is done. If your WordPress site is up to date and doing its job, there may be no reason to move.',
    },
  ],

  cta: {
    heading: 'Not sure which one fits?',
    text: 'Tell us what the site needs to do and who’ll be updating it. We’ll recommend the one that fits, even if that’s WordPress.',
  },
};
