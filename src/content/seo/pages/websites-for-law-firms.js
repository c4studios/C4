/**
 * Industry — Websites for Law Firms.
 * Credibility: Caleb is a JD student at UWA. Proof: IPSI automation work
 * (per brief), FirmFlow (C4 Original, AI content engine for professional
 * services). Unique details: the JD-reads-your-drafts angle and the
 * published 15–20% compliance surcharge.
 */
export default {
  hero: {
    label: 'Websites for Law Firms',
    title: ['Law firm websites built by someone', 'who reads judgments for fun.'],
    intro: [
      'C4 Studios builds websites and automation for law firms — practice-area pages that answer what clients actually search, intake that filters matters before they reach a lawyer, and routine-work automation behind the scenes. The studio is run by Caleb Scott, a current JD student at UWA, which makes the briefing conversations unusually short.',
    ],
  },
  sections: [
    {
      kind: 'prose',
      label: 'The problem',
      heading: 'Why do law firm websites all look the same?',
      body: [
        'Scales of justice, a skyline at dusk, a handshake, and the words “tailored solutions”. Firms default to looking like other firms because it feels safe — but to a potential client comparing five tabs at 9pm, identical sites mean the decision falls to whoever ranks first or quotes cheapest. Sameness is a pricing strategy, just not in your favour.',
        'The firms that win online answer questions instead: what does a first consult cost, what happens in a settlement, how long does probate take in WA. People hire the firm that taught them something while the others were polishing their Latin.',
      ],
    },
    {
      kind: 'list',
      label: 'What we build',
      heading: 'What goes into a law firm website that works?',
      items: [
        { title: 'Practice-area pages that answer', text: 'One page per area, written around the questions clients actually type — not a comma-separated list of everything the firm has ever done.' },
        { title: 'Lawyer profiles with substance', text: 'Admissions, areas, approach and a decent photograph. Clients hire a person; the firm comes second.' },
        { title: 'Intake that filters', text: 'Forms that capture matter type, urgency and the other party’s name — so conflicts surface early and the wrong enquiries route politely elsewhere.' },
        { title: 'Costs transparency', text: 'Fixed-fee items published where you offer them, honest “from” ranges where you can’t. It pre-qualifies harder than any form.' },
        { title: 'Proof and reviews', text: 'Google reviews surfaced properly, presented conservatively — first-person bragging reads poorly in this profession.' },
        { title: 'Speed and structure', text: 'Fast pages with structured data, because “family lawyer perth” is a search you win on technical merit as much as reputation.' },
      ],
    },
    {
      kind: 'prose',
      label: 'The quiet win',
      heading: 'Where does automation fit in a law practice?',
      body: [
        'In the routine work nobody bills honestly: intake acknowledgments, appointment reminders, document collection chasing, file-opening checklists, the third email asking a client for their ID. We’ve done automation work for IPSI, and we build and run FirmFlow — our own AI content engine for professional services — so this isn’t theory bolted onto web design.',
        'The pattern for legal work is strict: AI and automation draft, route and remind; a human signs everything that matters. Nothing leaves the building unsupervised, and your professional obligations stay exactly where they belong — with the practitioners.',
      ],
    },
    {
      kind: 'table',
      label: 'Compared',
      heading: 'Template site vs a built one — for a firm',
      head: ['', 'Template + stock copy', 'Built and written properly'],
      rows: [
        ['First impression', 'Looks like the other four tabs', 'Looks like someone’s actual practice'],
        ['Search', 'Competes on nothing', 'Practice-area pages that rank for real questions'],
        ['Intake', 'A contact form named “Submit”', 'Filtered enquiries with matter type and urgency attached'],
        ['Maintenance', 'Plugin roulette every month', 'Hand-coded, nothing to patch'],
        ['Cost', '$300–$800 now, rebuilt within two years', 'From $1,500 plus the professional-services margin below'],
      ],
    },
    {
      kind: 'pricing',
      label: 'Pricing',
      heading: 'What does a law firm website cost?',
      mode: 'anchor',
      note: 'One thing we publish that most won’t: legal, financial and medical sites carry a 15–20% surcharge, because compliance review and careful wording take real hours. You’ll see it itemised in the quote, not discovered in an invoice.',
    },
  ],
  faqs: [
    {
      q: 'How much does a law firm website cost in Perth?',
      a: 'From $1,500 plus a 15–20% professional-services surcharge that covers compliance care in the wording and review cycles — itemised in the quote up front. A six-page firm site with practice areas, profiles and filtered intake typically lands around $2,000–$2,900 all-in.',
    },
    {
      q: 'Do you understand the rules around legal advertising?',
      a: 'We build conservatively for it: no outcome promises, no “best lawyer” claims, careful wording around specialisation. Final sign-off on claims and disclaimers stays with you — we make that review easy by drafting clean and flagging anything borderline rather than burying it.',
    },
    {
      q: 'Can AI write our practice-area content?',
      a: 'It can draft; it shouldn’t publish. We run FirmFlow, our own AI content engine for professional services, so we know exactly where the line sits: AI accelerates structure and first drafts, a human with legal literacy tightens them, and your practitioners approve anything that touches advice territory.',
    },
    {
      q: 'How do you handle confidentiality?',
      a: 'Comfortably — sign whatever NDA your firm requires. Build access runs on scoped credentials you can revoke, we never need client files to build a website or an intake workflow, and anything sensitive we do touch stays in your systems, not copies of them.',
    },
    {
      q: 'Why does the JD actually matter?',
      a: 'Because briefs go faster and drafts come back cleaner when your web designer can read a costs agreement, knows what a directions hearing is, and won’t write “no win no fee” somewhere it doesn’t belong. You’re not teaching law to your supplier on billable time.',
    },
  ],
  cta: {
    heading: 'A firm site that doesn’t look like the other four tabs.',
    text: 'Tell us your practice areas and what intake looks like today. You’ll get a scoped quote with the surcharge shown, not hidden.',
  },
};
