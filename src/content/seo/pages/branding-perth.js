/**
 * Pillar — Branding Perth.
 * Unique detail: the honest line between a logo and a brand identity: when
 * the logo on its own is enough, and when the kit around it is worth paying
 * for.
 *
 * 9 Oct 2026: retitled to lead with logos, when Logo Design became C4
 * Studios' fourth arm with its own page at /logo-design (Caleb). This stays
 * the arm's search page. Slug and prices unchanged. The registry title,
 * description and name, the hero label, the h1 and the intro's first line
 * now say logo design, and one added sentence in "Honest tiers" links to
 * /logo-design. The rest of the copy is as it was.
 *
 * 16 Oct 2026: re-angled to branding and brand identity (SEO audit H4, brain
 * site_issues 167), because the 9 Oct retitle left this page and
 * /logo-design chasing the same search. Search Console (web, 27 Aug to
 * 13 Oct 2026) had this page at 466 impressions, average position 37.7, and
 * the branding searches outnumbered the logo ones; the registry entry has
 * the figures. So /logo-design owns "logo design Perth" and this page owns
 * branding, with Brand Essentials and Full Brand Identity as its subject.
 * Changed: the registry title, name, description and serviceType; the
 * hero; a new first section that links "logo design" to /logo-design (it
 * takes over from "Is a $250 logo any good?"); "What does a brand actually
 * buy you?", which lost its closing line and had its second paragraph
 * rewritten (it said "systems, not just marks"); the packages table, which
 * now holds the two brand packages (the logo packages are on /logo-design);
 * "Brand Essentials or Full Brand Identity?" in place of "What makes a logo
 * actually work?", whose 16-pixel test is what /logo-design is built on;
 * and three FAQs. Slug and prices unchanged, every price as in
 * src/data/pricing.js.
 *
 * The bundle FAQ names the two bundles and their prices and makes no saving
 * claim (Caleb, 16 Oct 2026: "drop the badges"; site_issues 173: the Launch
 * Bundle's priced parts add to $2,100 against its $2,300). Don't call a
 * bundle cheaper, better value or a saving.
 *
 * Keep "Do I own the logo outright?" word for word, question and answer.
 * /logo-design quotes it and finds it by the question
 * (src/components/logo-design/Commerce.jsx).
 */
export default {
  hero: {
    label: 'Branding Perth',
    // Three lines so it breaks cleanly from 375 to 1440 wide (measured 16 Oct).
    title: ['Branding in Perth:', 'the logo, and everything', 'that has to match it.'],
    intro: [
      'C4 Studios builds brand identities for Perth businesses: the logo, and the colours, type, templates and guidelines that make everything else match it. Brand Essentials is $1,200. Full Brand Identity starts at $2,500.',
      'Both are fixed scope, with the concepts and revision rounds written into the quote, and every file is yours once it’s paid for. There’s no strategy workshop to buy first. It starts with a short questionnaire and a call.',
    ],
  },
  sections: [
    {
      kind: 'prose',
      label: 'Logo or brand',
      heading: 'Do you need a brand identity, or just a logo?',
      body: [
        'If the business is new and still testing its name, the logo on its own is often enough. That’s [logo design](/logo-design), from $250, and its page sets out every logo package side by side.',
        'The rest of the kit starts to matter once the logo has to look the same on your van as it does on your invoice. That’s what the two brand packages below are for. We’ll tell you which one you need before you pay for either.',
      ],
    },
    {
      kind: 'prose',
      label: 'Straight talk',
      heading: 'What does a brand actually buy you?',
      body: [
        'Recognition and trust, mostly. A consistent identity makes a one-person operation look established and a ten-person operation look organised. It isn’t magic — a logo won’t fix a weak offer. What it fixes is the moment a customer compares your quote, your van, your invoice and your website against a competitor whose pieces all match.',
        'That’s why the brand packages go past the mark itself. They set the colour, type and templates, and the rules for using them, so everything you put out looks like it came from the same business.',
      ],
    },
    {
      kind: 'prose',
      label: 'Where it lives',
      heading: 'Print isn’t dead in Perth — it drives past you daily',
      body: [
        'For WA trades and local services, the brand gets more mileage on the ute than on the website. Vehicle wraps, site signage, embroidered hi-vis and the magnet on a fridge do years of unpaid advertising, which is exactly why the mono version of your logo matters as much as the full-colour one. A mark that only works as a glowing gradient on a dark website falls apart on a sign printed in one colour at the local shop.',
        'Every identity we ship is tested against those surfaces before you ever see it, and the file pack includes the formats signwriters and embroiderers actually ask for.',
      ],
    },
    {
      kind: 'table',
      label: 'Packages',
      heading: 'Branding packages and pricing',
      head: ['Package', 'Price', 'What’s in it'],
      rows: [
        ['Brand Essentials', '$1,200', 'A logo from three concepts and three revision rounds, a colour palette and typography, a business card, social media profile and cover templates, and a basic brand guidelines PDF of two to four pages.'],
        ['Full Brand Identity', '$2,500+', 'A logo from five concepts and four revision rounds, a complete colour system and type hierarchy, business card, letterhead and email signature, a social media template suite, brand guidelines of 10-plus pages, a presentation template, and signage and merchandise mockups.'],
      ],
    },
    {
      kind: 'prose',
      label: 'Choosing',
      heading: 'Brand Essentials or Full Brand Identity?',
      body: [
        'Brand Essentials fits a business getting its pieces to match for the first time. Full Brand Identity is for a brand that has to hold up in more places, like letterhead, presentations, signage and merchandise.',
        'The difference starts with the logo itself: five concepts and four revision rounds in Full Brand Identity, against three of each in Brand Essentials. Full Brand Identity’s guidelines run to 10-plus pages, where Essentials has a short PDF of two to four, so whoever works on the brand next has more to go on.',
      ],
    },
    {
      kind: 'prose',
      label: 'Existing artwork',
      heading: 'You’ve got a logo, and the signwriter said no',
      body: [
        'It happens a lot now. Someone makes a logo in an AI tool, likes it, sends it to the signwriter, and gets told it can’t be used. The tool gave them a flat image. Signage and embroidery both need vector.',
        'So we redraw it. Same mark, rebuilt properly, plus the versions each trade needs: full colour, one colour for the vehicle, and a simplified version that still reads stitched at chest size.',
        'There’s an ownership question underneath it too. Australian copyright needs a human author, and there’s case law that computer-generated work with no human author doesn’t attract copyright at all. A mark that came straight out of a tool may not be something you can stop a competitor using. Redrawing it puts real design decisions into it. If you want the name itself protected that’s a trade mark, and that’s a question for an IP lawyer rather than for us.',
        'Not every file is worth rebuilding. Send it through and we’ll tell you before you pay.',
      ],
    },
    {
      kind: 'list',
      label: 'Deliverables',
      heading: 'What lands in your inbox',
      items: [
        { title: 'Every file format', text: 'SVG, PNG and PDF, in colour and mono, sized for print, web and social. The files printers actually ask for.' },
        { title: 'Colour palette', text: 'Primary and supporting colours with exact codes for print and screen — no more “sort of blue”.' },
        { title: 'Typography', text: 'Heading and body typefaces chosen to pair with the mark, licensed sensibly.' },
        { title: 'Templates', text: 'Business cards, social profiles and covers — applied design, not just a logo on a white square.' },
        { title: 'Guidelines', text: 'A short document covering spacing, colour use and don’ts, so the next person who touches your brand keeps it straight.' },
      ],
    },
    {
      kind: 'prose',
      label: 'Timing',
      heading: 'When is it worth rebranding?',
      body: [
        'Three good reasons: the business has outgrown what the name and mark promise (the “& Sons” problem), the materials are so inconsistent that customers can’t tell your quote and your invoice came from the same company, or you’re about to spend real money — fit-out, fleet, campaign — pushing an identity you already know is weak.',
        'If none of those apply, keep your money. A brand that’s a bit dated but recognised is still worth keeping.',
      ],
    },
    {
      kind: 'process',
      label: 'Process',
      heading: 'How the design process works',
      steps: [
        { title: 'Brief', text: 'A short questionnaire and a call: who you serve, who you’re up against, and what it should feel like. Twenty minutes, not a workshop week.' },
        { title: 'Concepts', text: 'Two to five distinct directions depending on package — different ideas, not one idea in five colours.' },
        { title: 'Refine', text: 'You pick a direction and we work the feedback through the named revision rounds until it’s right.' },
        { title: 'Package and hand over', text: 'Full file set, palette, type and guidelines delivered together. You own the lot outright.' },
      ],
    },
  ],
  faqs: [
    {
      q: 'How much does branding cost in Perth?',
      a: 'With us, Brand Essentials is $1,200 and Full Brand Identity starts at $2,500. Both are fixed-price, with the concepts and revision rounds set in the quote. If you only need the logo, logo design starts at $250.',
    },
    {
      q: 'Can you fix a logo I made with AI?',
      a: 'Usually. The problem is nearly always the file itself. AI tools output flat images, and both signage and embroidery need vector. We redraw it as true vector and build the colour, one-colour and small-size versions, for $450. Some files aren’t worth rebuilding and we’ll say so before you pay.',
    },
    {
      q: 'How many concepts and revisions do I get?',
      a: 'Brand Essentials has three logo concepts and three revision rounds. Full Brand Identity has five concepts and four revision rounds. The counts are written into the quote, so feedback has a defined place to land and the project actually finishes.',
    },
    {
      q: 'Do I own the logo outright?',
      a: 'Yes. Once the project is paid, the identity and all working files are yours — use them anywhere, forever, no licensing fees. We just ask politely if we can show the work in our portfolio.',
    },
    {
      q: 'Can you refresh our brand without losing recognition?',
      a: 'Usually that’s exactly the right call. We keep the equity — the shape, the colour people already associate with you — and modernise the execution. A refresh is quoted like a redesign but starts from what works instead of a blank page.',
    },
    {
      q: 'Can you do the brand and website together?',
      a: 'Yes. The Launch Bundle is $2,300 and pairs a brochure site with the Logo Only package. The Business Builder is $4,800 and pairs a business website with Brand Essentials and a C4 Lens Brand Shoot. Both also include SEO Foundation and a 30-day launch warranty. A logo on its own can be added to any website build for $400.',
    },
  ],
  cta: {
    heading: 'Naming the business was hard enough.',
    text: 'Send us the name and what you do. We’ll recommend the package that fits, and say so if a smaller one will do.',
  },
};
