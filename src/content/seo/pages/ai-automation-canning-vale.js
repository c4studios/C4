/**
 * Suburb — AI & Automation in Canning Vale.
 * Local grounding: the dispatch-and-delivery communication chain;
 * "where's my order" load; PO and supplier chasing in estate businesses.
 */
export default {
  hero: {
    label: 'AI & Automation — Canning Vale',
    title: ['AI & automation in Canning Vale'],
    intro: [
      'Every warehouse and distributor in the estate fields the same call all day: “where’s my order?” Multiply it by purchase orders to chase, dispatch updates to send and pick confirmations to relay, and Canning Vale runs on communication that should send itself. C4 Studios automates the chain from $750 — updates out, chasing handled, phones quieter.',
    ],
  },
  sections: [
    {
      kind: 'prose',
      label: 'The chain',
      heading: 'What does dispatch communication cost a distributor?',
      body: [
        'Count the touches: order confirmed, picked, dispatched, delayed, delivered — five moments customers want to know about, times every order, every day. Handled manually that’s a staff member’s whole job done badly at peak; handled automatically it’s zero touches and fewer inbound calls, because the update arrived before the customer wondered. The “where’s my order” call is not a service feature — it’s a notification that didn’t send.',
        'The same logic runs upstream: purchase orders acknowledged, suppliers chased on promised dates, and exceptions — the late line, the short pick — flagged to a human early, which is the only time exceptions are cheap.',
      ],
    },
    {
      kind: 'list',
      label: 'Where it lands',
      heading: 'What estate businesses automate first',
      items: [
        { title: 'Order status updates', text: 'Confirmed, dispatched, delivered — pushed automatically at each stage, killing the call volume at its source.' },
        { title: 'Supplier and PO chasing', text: 'Promised dates followed up on schedule, exceptions surfaced before they become outages.' },
        { title: 'Account-customer reordering', text: 'Regular lines prompted on each customer’s real cycle — recurring B2B revenue without a rep’s reminder.' },
        { title: 'Invoice and statement runs', text: 'Billing chased politely and persistently, the estate’s cash flow defended by software.' },
        { title: 'Induction and compliance paperwork', text: 'Site inductions, licences and expiry chasing — collected and current without a clipboard.' },
      ],
    },
    {
      kind: 'prose',
      label: 'Pricing',
      heading: 'What does it cost?',
      body: [
        'The published ladder: $750 for a single workflow — order-status updates are the usual first win, felt within a week — and $1,500–$3,500 to automate the dispatch chain end to end with monitoring included. Integration runs through what you already operate: inventory and WMS exports, accounting, Square or POS where retail exists; we’ve imported a 499-line catalogue before, so estate-scale data is familiar ground.',
      ],
    },
  ],
  faqs: [
    {
      q: 'What pays back fastest for a warehouse or distributor?',
      a: 'Order-status automation — the call volume drops within days and the counter gets its hours back. PO chasing runs second by protecting stock availability, which protects everything else. The audit ranks your chain by actual touch counts.',
    },
    {
      q: 'Can it talk to our inventory or warehouse system?',
      a: 'Usually — most systems expose exports, emails or APIs the workflows can act on, and where one is sealed shut, automation runs off the documents and notifications it already produces. The audit answers your stack specifically before you spend.',
    },
    {
      q: 'Our customers are businesses — do they accept automated updates?',
      a: 'They prefer them: a B2B customer wants the dispatch email at 2:14pm, not a callback at five. Updates carry your wording and a human reply path, so the experience reads as a well-run operation — because by then it is one.',
    },
    {
      q: 'Is this AI, or scheduling?',
      a: 'Mostly disciplined plumbing — status chains and chasing are pure logic, deliberately boring. AI earns its keep summarising messy supplier email threads and drafting exception replies for a human to approve. Nothing creative touches your stock numbers.',
    },
  ],
  cta: {
    heading: 'Let the updates send themselves.',
    text: 'Tell us your order volume and what system runs the floor. The audit counts the touches and prices the chain.',
  },
};
