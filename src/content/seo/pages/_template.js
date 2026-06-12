/**
 * CONTENT MODULE TEMPLATE — not a real page (underscore prefix = excluded
 * from the route glob). Copy this file to `<slug>.js`, fill it in, then in
 * registry.js set the entry's title + description and flip status to 'live'.
 *
 * A content module is pure data. Templates render it; SeoPage builds the
 * JSON-LD (LocalBusiness + BreadcrumbList + Service/FAQPage) from it.
 *
 * Voice rules (non-negotiable):
 * - Plain Australian English, first person where natural.
 * - Banned: "in today's digital landscape", "elevate", "unlock", "seamless",
 *   "look no further", "cutting-edge".
 * - Vary section order and phrasing between pages; every page carries at
 *   least one detail no other page has.
 * - Suburb pages: minimum ~40% genuinely unique content, grounded in the
 *   area's real business character — no swap-the-name boilerplate.
 * - Answer the page's core question inside the first 100 words.
 */

export default {
  hero: {
    label: 'Web Design',            // small overline above the H1
    title: ['Web design in Perth', 'that earns its keep.'], // H1 lines (1–2)
    intro: [
      // Answer-first opening — 1–3 short paragraphs. The first paragraph
      // must directly answer the head query this page targets.
      'First paragraph…',
      'Second paragraph…',
    ],
  },

  // Ordered, flexible blocks. Vary the order between pages (doorway-page
  // safeguard). Available kinds:
  sections: [
    // Direct-answer box — comparisons lead with this.
    { kind: 'answer', body: ['The short answer, stated plainly in 2–4 sentences.'] },

    // Plain prose section.
    { kind: 'prose', label: 'Overline', heading: 'Question-style heading?', body: ['Paragraph…', 'Paragraph…'] },

    // Titled item grid — what's included / features / pain points.
    { kind: 'list', label: 'What you get', heading: 'What’s included', items: [
      { title: 'Item title', text: 'One or two sentences.' },
    ] },

    // Numbered process steps.
    { kind: 'process', label: 'Process', heading: 'How it works', steps: [
      { title: 'Step name', text: 'What happens.' },
    ] },

    // Real client proof — never fabricate. href can point at a case study.
    { kind: 'proof', label: 'Proof', heading: 'Work that backs this up', cases: [
      { name: 'Client / project', summary: 'What was built and what it did.', href: '/CaseStudy?slug=…', tag: 'Full build' },
    ] },

    // Pricing block. mode 'anchor' = the $1,500 business-site anchor with a
    // pointer to the cost guide; mode 'range' = honest full range pulled
    // live from src/data/pricing.js (cost-guide page uses this).
    { kind: 'pricing', label: 'Pricing', heading: 'What it costs', mode: 'anchor', note: 'Optional extra sentence.' },

    // Comparison table.
    { kind: 'table', label: 'Compared', heading: 'Side by side', head: ['', 'Option A', 'Option B'], rows: [
      ['Cost', '$x', '$y'],
    ] },
  ],

  // FAQ — rendered as an accordion AND emitted as FAQPage JSON-LD.
  // Pillars 5–6, suburbs 3–4, industries ~4–5. Unique per page.
  faqs: [
    { q: 'Question?', a: 'Answer in plain English.' },
  ],

  // Closing CTA — heading/text unique per page.
  cta: {
    heading: 'Tell me what needs building.',
    text: 'A short outline is enough. I reply within a business day.',
  },
};
