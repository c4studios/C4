/**
 * Comparison — WordPress vs Next.js for business websites.
 * Unique detail: the declared-bias move (we build Next/React and say so
 * in the first paragraph), and the plugin attack-surface framing.
 */
export default {
  hero: {
    label: 'Honest Comparison',
    title: ['WordPress vs Next.js', 'for business websites?'],
    intro: [
      'Declared bias first: C4 Studios builds in React and Next.js, so weigh what follows accordingly. The honest answer anyway: WordPress still makes sense for content-heavy sites run by non-technical teams who publish daily and want the world’s biggest plugin ecosystem. Next.js wins for business sites where speed, security and not-babysitting-the-website matter more than a familiar admin panel. Here’s the real trade-off.',
    ],
  },
  sections: [
    {
      kind: 'answer',
      body: [
        'For a typical small-business site — six to ten pages, a contact form, occasional updates — Next.js (or hand-coded React generally) produces a faster, safer site with nothing to patch monthly. For a publication-style site where several non-technical people write daily, WordPress’s editing experience still earns its overhead. Most Perth small businesses are the first case and have been sold the second.',
      ],
    },
    {
      kind: 'table',
      label: 'Side by side',
      heading: 'The trade-offs, plainly',
      head: ['', 'WordPress', 'Next.js / React'],
      rows: [
        ['Speed', 'Depends on theme and plugin load — usually middling', 'Fast by default; pages ship as pre-built HTML'],
        ['Security', 'Constant target: core, theme and every plugin need patching', 'No plugin attack surface; almost nothing to exploit'],
        ['Maintenance', 'Monthly updates or it rots — a real recurring cost', 'Effectively zero between feature changes'],
        ['Editing', 'Excellent for non-technical daily publishing', 'Content updates via developer or a lightweight CMS bolt-on'],
        ['Plugins', '60,000 of them — capability in minutes, quality roulette', 'Features are built, not installed — slower but owned'],
        ['Hosting cost', '$10–$50+/month for decent managed hosting', 'Often near-zero on modern edge platforms'],
        ['Finding help', 'Everywhere, wildly varying quality', 'Smaller pool, generally stronger developers'],
      ],
    },
    {
      kind: 'prose',
      label: 'The hidden ledger',
      heading: 'What does WordPress actually cost to keep?',
      body: [
        'The licence is free; the upkeep isn’t. A responsible WordPress site needs core, theme and plugin updates monthly, backups before each, and someone to untangle it when two plugins disagree — that’s a maintenance plan at $50–$150 a month or your own evenings. Skip it and the statistics find you: most hacked small-business sites are unpatched WordPress, usually via an abandoned plugin nobody remembered installing.',
        'A static-built Next.js site simply doesn’t carry that surface. There’s no admin login to brute-force, no plugin chain to exploit, nothing to patch on a schedule. For a site that changes occasionally, that’s not a technical nicety — it’s hundreds of dollars and several headaches a year that never happen.',
      ],
    },
    {
      kind: 'prose',
      label: 'The verdict',
      heading: 'Which is right for you?',
      body: [
        'Stay with (or choose) WordPress if: multiple non-technical people publish weekly or daily, you lean on specific plugins that genuinely earn their place, or you have an existing investment that works. It remains the right tool for publishing operations.',
        'Choose Next.js if: the site is a business asset that changes occasionally, speed and Google performance matter, and you’d rather pay for a build than a babysitting subscription. If you need regular content without the overhead, a lightweight CMS on top of Next.js — our $500 blog/CMS add-on — covers the realistic middle ground.',
      ],
    },
  ],
  faqs: [
    {
      q: 'Is WordPress dying?',
      a: 'No — it still runs a large slice of the web and isn’t going anywhere. What’s changed is that it stopped being the default answer: modern frameworks erased its convenience advantage for typical business sites, leaving it strongest where its editing model genuinely matters.',
    },
    {
      q: 'Is Next.js better for SEO than WordPress?',
      a: 'The ceiling is higher: pre-rendered HTML, faster loads and full structural control are exactly what Google measures. A well-tuned WordPress site can absolutely rank — it just needs ongoing effort to stay fast, where a static build starts there and stays there.',
    },
    {
      q: 'Can I edit a Next.js site myself?',
      a: 'Out of the box, no — content changes go through a developer, which suits sites that change occasionally. If you publish regularly, we add a lightweight CMS ($500) so you edit posts and pages in a clean interface without inheriting WordPress’s maintenance tail.',
    },
    {
      q: 'Can you migrate our WordPress site?',
      a: 'Yes — content comes across, design gets rebuilt properly, and every old URL is redirect-mapped so your search equity survives. We’ll also say honestly if your WordPress setup is actually fine; migration for its own sake is money we don’t need to take.',
    },
    {
      q: 'What about Webflow, Framer and the others?',
      a: 'Closer to the builder category — designer-friendly, subscription-priced, with platform lock-in similar to Squarespace. Capable tools, but the ownership and cost questions from our builder-versus-custom comparison apply to them too.',
    },
  ],
  cta: {
    heading: 'Stuck on a stack decision?',
    text: 'Tell us what the site does and who updates it. You’ll get a recommendation that fits the answer — even when it isn’t us.',
  },
};
