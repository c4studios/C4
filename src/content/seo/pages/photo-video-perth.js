/**
 * Pillar — Photo & Video Perth (C4 Lens).
 * Unique details: exact delivered-image counts per package, and The Rocks'
 * At the Movies motion graphics.
 *
 * Corrected 9 Oct 2026, with the /Lens case studies (no figure added):
 *   - The intro named a person ("It's led by Caleb Scott"). It now speaks
 *     for C4 Lens; Caleb asked that the Lens work name no one.
 *   - "Licensed" came off the drone line: no CASA licence is on file
 *     (brain gap 137). Do not add it back until one is.
 *   - The Rocks was "services captured, edited and published as a repeatable
 *     weekly pipeline", and the FAQ said weekly church media and full-show
 *     coverage were "regular work" with "a two-campus setup we run as an
 *     ongoing pipeline". Nothing backs either: C4 made the At the Movies
 *     motion graphics, and the church supplies its own videos
 *     (caseStudyData rocksstream). Do not add a pipeline claim back.
 *   - HVN was "Full-show coverage and drone work". The film shows aerial
 *     footage of the building and a walk through the gym, and that's all
 *     it says now.
 *   - DS Racing's header film was "shot". It was made, as a motion graphic.
 *   - The $650 package was renamed from "Business Branding" to "Brand Shoot"
 *     (pricing.js) so it can't be read as logo work. Same price and contents.
 *
 * 16 Oct 2026: made the plain buyer's page for "photographer" and
 * "videographer Perth" searches, distinct from /Lens, which is the brand and
 * the work (SEO audit H4; the registry entry has the Search Console
 * figures). Changed: the hero, whose intro had described C4 Lens the way
 * /Lens does; "Do you need video, or just photos?" in place of "Why does
 * real imagery outperform stock photos?", the argument /Lens opens on; and
 * "Where can you see the work?" in place of the three-card reel, which
 * repeated /Lens's case studies. It links /Lens and two shoots, with facts
 * from src/components/lens/lensStudies.js (confirmed as C4 Lens work by
 * Caleb on 9 Oct 2026).
 * Also: "full-show coverage" came out of "What we shoot", since the note
 * above and DESIGN.md say this file stopped claiming it. The $750 add-on
 * has its pricing.js name and lost "the cheapest way to get both done
 * properly", which nothing on file shows. The cost FAQ calls the $650
 * package Brand Shoot.
 * Still no person named, no "licensed", and no pipeline or coverage claim.
 */
export default {
  hero: {
    label: 'Photo & Video Perth',
    // Three lines so it breaks cleanly from 375 to 1440 wide (measured 16 Oct).
    title: ['Photography and video', 'in Perth, with the prices', 'on the page.'],
    intro: [
      'C4 Lens shoots photos and video for Perth businesses, mostly on site, and every package has a published price. A 30-minute shoot with five edited photos is $200. A full day of photo and video, with 60-plus edited photos and five finished videos, starts at $2,500.',
      'The edit is included in every package, and each one says how many files you’ll get back.',
    ],
  },
  sections: [
    {
      kind: 'prose',
      label: 'Photo or video',
      heading: 'Do you need video, or just photos?',
      body: [
        'If it’s photos for a website or a Google Business Profile, one of the first three packages will cover it. They’re photography only, from a 30-minute session at $200 to a two-hour Brand Shoot at $650 with 30 edited images.',
        'Video starts with Content Creation at $1,200: a half-day shoot with 40 edited photos and two short videos cut for social. For a longer film as well, Full Production is a full day from $2,500, with four short videos and a long-form film of up to three minutes.',
      ],
    },
    {
      kind: 'list',
      label: 'Shoot types',
      heading: 'What we shoot',
      items: [
        { title: 'Headshots and team', text: 'Individual and group portraits that make the “About” page feel like real people work here. Because they do.' },
        { title: 'Brand and workspace', text: 'Your premises, process and people, shot for websites, proposals and Google Business Profile.' },
        { title: 'Products', text: 'Clean catalogue shots through to styled lifestyle imagery for stores and socials.' },
        { title: 'Events and services', text: 'Launches, conferences, church services and other events — captured without getting in the way.' },
        { title: 'Short-form content', text: 'Reels and vertical video shot and cut for social, in batches that keep your feed alive for months.' },
        { title: 'Drone and aerial', text: 'Aerial photo and video — sites, venues, fleets and the establishing shot nothing on the ground can get.' },
      ],
    },
    {
      kind: 'table',
      label: 'Packages',
      heading: 'Packages and exactly what you receive',
      head: ['Package', 'Price', 'You receive'],
      rows: [
        ['Core', '$200', 'A 30-minute shoot at one location and 5 edited images, delivered by online gallery.'],
        ['Portrait Session', '$350', 'A one-hour shoot and 15 edited images — personal brand, professional profiles, team additions.'],
        ['Brand Shoot', '$650', 'Two hours across up to two locations: headshots plus workspace and lifestyle shots, 30 edited images.'],
        ['Content Creation', '$1,200', 'A half-day photo and video shoot: 40 edited photos plus two short-form videos cut for social.'],
        ['Full Production', '$2,500+', 'A full day: 60-plus edited photos, four short-form videos and one long-form film with grading, sound design and motion graphics.'],
      ],
    },
    {
      kind: 'prose',
      label: 'The work',
      heading: 'Where can you see the work?',
      body: [
        'The [C4 Lens page](/Lens) has it, films included, and links each case study.',
        'Two shoots to start with. For [HVN CrossFit](/CaseStudy/hvn-gym) we made the film at the top of their home page, which starts above the building and walks through the gym, and we shot their coach portraits. For [Sharp Bricklaying](/CaseStudy/sharp-bricklaying) we photographed their jobs from the air and on the ground, and cut footage of two sites into short films.',
      ],
    },
    {
      kind: 'process',
      label: 'Shoot day',
      heading: 'How a shoot runs, start to finish',
      steps: [
        { title: 'Plan', text: 'Shot list, locations and timing agreed up front, so the day is spent shooting rather than deciding.' },
        { title: 'Shoot', text: 'We direct. Nobody knows what to do with their hands — that’s our job, not yours.' },
        { title: 'Edit', text: 'Culling, colour grading and retouching on every delivered image; cutting, sound and graphics on video.' },
        { title: 'Deliver', text: 'A clean online gallery with download-ready files, licensed for your business use across web, print and social.' },
      ],
    },
    {
      kind: 'prose',
      label: 'Logistics',
      heading: 'Where do shoots happen — studio or on-site?',
      body: [
        'On-site, almost always, because the point is photographing your business, not a rented backdrop. Workplaces shoot better than owners expect: we bring lighting, find the angles, and tidy frames rather than premises. For headshots without a usable space, a clean wall and twenty minutes genuinely does it — and Perth itself is the backup studio, with parks, laneways and coastline that cost nothing and read unmistakably local.',
        'Timing is the one thing worth planning around: the hour after sunrise and before sunset flatters everything, and midday sun flatters nothing. We’ll schedule around it where the brief allows.',
      ],
    },
    {
      kind: 'prose',
      label: 'Cadence',
      heading: 'How often should a business refresh its content?',
      body: [
        'A useful rule: shoot properly once, then top up quarterly. The foundation shoot covers the site, profiles and signage — imagery with a shelf life of years. What expires fast is social content, which is why the half-day Content Creation format exists: forty photos and two cut-down videos every quarter keeps a feed alive for three months of posting without anyone on your team becoming the designated phone-camera person.',
        'Batching is the whole economy of it. One planned half-day out-produces twelve months of “quick, grab a photo before they leave” — and it looks like it.',
      ],
    },
    {
      kind: 'prose',
      label: 'Pair it',
      heading: 'Shot for the places it’ll live',
      body: [
        'Because the same studio builds websites and brands, Lens shoots are planned around where the images will actually sit — hero banners shot with space for headlines, team photos framed for the layouts they’ll fill, verticals cut for reels. A $750 photography and videography add-on can also ride along with any website build.',
      ],
    },
  ],
  faqs: [
    {
      q: 'What does commercial photography cost in Perth?',
      a: 'Lens packages run from $200 for a 30-minute session with 5 edited images, through $650 for a two-hour Brand Shoot with 30 images, up to full-day productions from $2,500. Every package lists exactly how many edited files you receive.',
    },
    {
      q: 'How many photos do we actually get?',
      a: 'Exact counts, in writing: 5 at Core, 15 at Portrait, 30 at Brand Shoot, 40 plus two videos at Content Creation, and 60-plus with five videos at Full Production. Extra selects can always be added from the gallery afterwards.',
    },
    {
      q: 'Do you shoot video for social media?',
      a: 'Yes — short-form vertical video is most of what businesses need now. Content Creation includes two cut-down reels from a half-day shoot; Full Production includes four plus a long-form film with grading, sound design and motion graphics.',
    },
    {
      q: 'Can you cover our event or church service?',
      a: 'Yes, and without getting in the way. Tell us the venue and the running order and we’ll quote it properly.',
    },
    {
      q: 'Who owns the photos and footage?',
      a: 'You receive a full business-use licence across web, print and social — use them as long as you like. Raw files stay archived with us, so when you need a forgotten shot two years later, it still exists.',
    },
    {
      q: 'How far ahead should we book, and what’s turnaround like?',
      a: 'A week or two of lead time usually gets a shoot scheduled; events obviously book to their date. Edited galleries land within five to ten business days depending on package size, with video edits at the longer end. If something’s urgent, say so — rush is sometimes possible.',
    },
  ],
  cta: {
    heading: 'Your work deserves better than stock.',
    text: 'Tell us what needs shooting and where it’ll be used. We’ll suggest the package that fits — and bring the drone if it earns its place.',
  },
};
