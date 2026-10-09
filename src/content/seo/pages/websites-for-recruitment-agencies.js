/**
 * Industry — Websites for Recruitment Agencies.
 * Unique detail: the dual-audience (candidates AND clients) structure.
 *
 * 9 Oct 2026: Lead Engine moved to the sister company, C4Site, with C4i.
 * Out came the Lead Engine pitch, its FAQ entry (the FAQ schema is built
 * from `faqs`, so it went from there too) with its $1,950 setup and $250 a
 * month, the "tell you straight if Lead Engine fits" CTA line, and both
 * "automation from $750" prices, since pricing.js no longer carries one.
 * What stays is one pointer to C4Site's Lead Engine page, with no price.
 * Do NOT add any of it back.
 *
 * Also 9 Oct 2026: Caleb answered the open question this note used to
 * carry. All automation is C4Site's, with or without AI (answer 3B, brain
 * site_issue 149). Out came "and automation" from the intro, "plus
 * automation" from the registry description, the "Where automation pays in
 * an agency" table, and the "Candidates complain they never hear back" FAQ,
 * so the FAQPage schema now lists the same three questions the page shows.
 * The Lead Engine pointer stays (answer 6A). No figure was added. Do NOT
 * add the automation back either.
 */
export default {
  hero: {
    label: 'Websites for Recruitment Agencies',
    title: ['Recruitment websites that work', 'both sides of the desk.'],
    intro: [
      'C4 Studios builds websites for recruitment agencies — sites that convince candidates to apply and clients to brief, without one audience drowning out the other. Sites from $1,500, with job boards and portal features scoped from the $2,500–$4,500 tiers.',
    ],
  },
  sections: [
    {
      kind: 'prose',
      label: 'The structural problem',
      heading: 'Why are recruitment websites so hard to get right?',
      body: [
        'Because they’re two websites wearing one domain. Candidates want jobs, fast search and a painless application. Clients want proof you can fill roles: sectors, process, results, a confident brief-us path. Most agency sites pick one audience by accident — usually candidates, because jobs are the easy content — and then wonder why the site never produces a client lead.',
        'The fix is structural, not cosmetic: two clear front doors from the first screen, each leading to a path built for that audience, with the jobs board doing candidate work and the client side selling capability like the professional-services firm you actually are.',
      ],
    },
    {
      kind: 'list',
      label: 'What we build',
      heading: 'The agency site, done properly',
      items: [
        { title: 'Two front doors', text: '“Find a role” and “Find people” from the first screen — each audience routed to a path built for them.' },
        { title: 'A jobs board that’s current', text: 'Fed from your ATS where possible, manageable in minutes where not. Stale listings cost more credibility than no listings.' },
        { title: 'Painless applications', text: 'Apply in under two minutes on a phone. Every extra field costs you the candidates worth having.' },
        { title: 'Sector pages for clients', text: 'One page per specialism with real numbers — time-to-fill, roles placed — because clients hire specialists, not generalists.' },
        { title: 'Consultant profiles', text: 'Candidates google the consultant before returning the call. Give them something better than a LinkedIn ghost.' },
        { title: 'Brief-us path', text: 'A client enquiry form that captures role, urgency and salary band — qualified before the first call.' },
      ],
    },
    {
      kind: 'prose',
      label: 'Beyond the site',
      heading: 'What about the outbound side?',
      body: [
        'A website converts the demand that finds you. Recruitment mostly runs on demand you go and find, and for that side our sister company, C4Site, runs [Lead Engine](https://c4site.com.au/lead-engine/).',
      ],
    },
    {
      kind: 'pricing',
      label: 'Pricing',
      heading: 'What does a recruitment website cost?',
      mode: 'anchor',
      note: 'A dual-audience agency site typically lands at $1,500–$2,500; ATS integration and portal features are scoped on top.',
    },
  ],
  faqs: [
    {
      q: 'How much does a recruitment agency website cost?',
      a: 'From $1,500 for a dual-audience site with a managed jobs board, sector pages and brief-us path. ATS integration and candidate portals move builds into the $2,500–$4,500 range depending on your system. Everything is quoted fixed against written scope.',
    },
    {
      q: 'Can you integrate our ATS or job multi-poster?',
      a: 'Usually — most modern ATS platforms expose feeds or APIs we can pull listings from, so the website stays current without double entry. Where integration isn’t possible, we build the board to be updated in minutes, because a stale board is worse than none.',
    },
    {
      q: 'How long does an agency site take?',
      a: 'Four to six weeks for the dual-audience build including sector pages; ATS integration adds a week or two of testing. The pacing item is usually sector copy and consultant photos — we front-load both, and C4 Lens can shoot the team in a morning.',
    },
  ],
  cta: {
    heading: 'Fill your own funnel for once.',
    text: 'Tell us your sectors, your ATS and where new business comes from today, and we’ll scope the site.',
  },
};
