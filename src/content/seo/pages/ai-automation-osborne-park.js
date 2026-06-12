/**
 * Suburb — AI & Automation in Osborne Park.
 * Local grounding: the quote-to-invoice chain for trade suppliers and
 * wholesalers; B2B reorder rhythm; stock-enquiry triage.
 */
export default {
  hero: {
    label: 'AI & Automation — Osborne Park',
    title: ['AI & automation in Osborne Park'],
    intro: [
      'The businesses around Scarborough Beach Road run on quotes, accounts and reorders — paperwork-dense B2B where the admin scales faster than the headcount. That’s automation’s home ground. C4 Studios builds the workflows from $750: quotes that follow themselves up, invoices that chase politely, account customers who reorder without a phone call.',
    ],
  },
  sections: [
    {
      kind: 'prose',
      label: 'The chain',
      heading: 'Where does the strip’s admin time actually go?',
      body: [
        'The quote-to-cash chain, almost every time. A wholesaler or showroom quotes daily; most quotes need a follow-up nobody has time to send; won jobs become invoices someone retypes from the quote; and a third of invoices need chasing. Each step is rule-based, repetitive and already digital — which is the exact profile of work that should never touch a human keyboard twice.',
        'Automating that chain end to end is usually a $1,500–$3,500 engagement that gives a counter team back hours every single day — and quote follow-up alone routinely lifts win rates, because the supplier who circles back wins the ones that just needed a nudge.',
      ],
    },
    {
      kind: 'list',
      label: 'Where it lands',
      heading: 'What strip businesses automate first',
      items: [
        { title: 'Quote follow-ups', text: 'Every quote chased on schedule until answered — the cheapest sales lift in B2B.' },
        { title: 'Quote-to-invoice handover', text: 'Won quotes become invoices without retyping — errors and double-handling gone.' },
        { title: 'Invoice chasing', text: 'Overdue accounts nudged politely and persistently, with the awkwardness outsourced to software.' },
        { title: 'Reorder prompts', text: 'Account customers reminded when their usual order cycle comes around — recurring revenue on autopilot.' },
        { title: 'Stock and price enquiries', text: 'The twenty-times-a-day questions answered instantly from your actual data, while staff serve the counter.' },
      ],
    },
    {
      kind: 'prose',
      label: 'Fit and pricing',
      heading: 'Does it work with the systems you already run?',
      body: [
        'That’s the design constraint we start from: Xero and the accounting stack, Square and point-of-sale, inventory systems, plain inboxes — automation wires together what’s already on the counter rather than demanding new software. We’ve migrated a 499-product Square catalogue for a parts business, so the strip’s data realities don’t scare us.',
        'Pricing holds the published line: $750 for one workflow, $1,500–$3,500 for the quote-to-cash chain done properly, custom builds from $5,000 where B2B portals enter the picture. The audit prices your chain against your volumes first.',
      ],
    },
  ],
  faqs: [
    {
      q: 'What pays back fastest for a wholesaler or showroom?',
      a: 'Quote follow-up automation, usually within the first month — recovered wins show up immediately and the workflow costs $750. Invoice chasing runs second on pure cash-flow recovery. The full chain is where the daily hours come back.',
    },
    {
      q: 'Can it connect to our accounting and POS?',
      a: 'Almost certainly — Xero, MYOB, Square and most inventory systems expose what automation needs. Where something’s genuinely closed, the workflow runs alongside it through email and structured documents rather than forcing a system change. The audit confirms fit before you spend.',
    },
    {
      q: 'Our account customers reorder the same stock monthly — automatable?',
      a: 'Textbook case: reorder prompts timed to each customer’s real cycle, pre-filled with their usuals, one click to confirm. Customers experience it as good service; you experience it as recurring revenue that stopped depending on someone remembering to call.',
    },
    {
      q: 'Is AI involved, or is this just plumbing?',
      a: 'Mostly excellent plumbing — quote chains and reorders are pure logic, nothing to hallucinate. AI earns a seat for drafting replies to messy enquiries and summarising long email threads, always as a draft for your counter staff to approve. Boring on purpose; it’s your revenue.',
    },
  ],
  cta: {
    heading: 'Make the paperwork run itself.',
    text: 'Tell us your quoting volume and what you run on — Xero, Square, whatever it is. The audit maps the chain and the payback.',
  },
};
