/**
 * Pillar — AI & Automation Perth.
 * Unique detail: the proof section names C4's own automation products
 * (ReviewLoop's AI reply writer, Nudge's rate-rise nudges, Quotr) running
 * in production, plus the C4Sight workshop tie-in.
 */
export default {
  hero: {
    label: 'AI & Automation Perth',
    title: ['AI and automation for businesses', 'with real workloads.'],
    intro: [
      'C4 Studios builds practical AI and workflow automation for Perth businesses — the kind that removes hours of admin each week, not the kind that writes your LinkedIn posts. A single automated workflow starts at $750, most clients land between $1,500 and $3,500, and custom AI agents are scoped from $5,000.',
      'We also build and run our own AI-powered software products, so anything we wire into your business is something we already trust with ours.',
    ],
  },
  sections: [
    {
      kind: 'prose',
      label: 'Start here',
      heading: 'What does automation actually look like?',
      body: [
        'A job finishes. The invoice generates itself from the quote, the client gets a payment link, an unpaid invoice chases itself twice before it ever reaches your to-do list, and a review request goes out once payment clears. Nobody typed anything. That’s one workflow — most businesses are carrying five or six like it without realising.',
        'The pattern to look for: anything you do more than ten times a week, the same way each time, using information that already exists somewhere. That’s a candidate.',
      ],
    },
    {
      kind: 'list',
      label: 'Where it lands',
      heading: 'What do Perth businesses automate first?',
      items: [
        { title: 'Quotes and invoicing', text: 'Quote accepted → invoice raised → payment link sent → overdue follow-ups handled. The classic, because it pays for itself fastest.' },
        { title: 'Lead handling', text: 'Enquiries acknowledged, qualified and booked within minutes — before a competitor calls back.' },
        { title: 'Review collection', text: 'Finished jobs turned into Google review requests automatically, timed when customers are happiest.' },
        { title: 'Reminders and follow-ups', text: 'Appointments confirmed, no-shows reduced, quiet clients re-engaged — without anyone keeping a list.' },
        { title: 'Reporting', text: 'The numbers you check weekly, assembled and delivered instead of hunted down across four logins.' },
        { title: 'Document drafting', text: 'AI-assisted first drafts of routine documents — letters, summaries, replies — for a human to approve, not replace.' },
      ],
    },
    {
      kind: 'process',
      label: 'Engagement',
      heading: 'How an automation project runs',
      steps: [
        { title: 'Audit', text: 'We map where the hours actually go. Usually two or three workflows are carrying most of the waste — we find them and put numbers on them.' },
        { title: 'Map and quote', text: 'Each workflow gets drawn end to end: triggers, steps, tools, edge cases. You see exactly what will happen before anything is built.' },
        { title: 'Build and wire', text: 'Built in n8n or custom code, connected to the tools you already use. Error handling and monitoring included from Workflow Pro up.' },
        { title: 'Handover', text: 'Documentation and a training session. You own the automation — no retainer required to keep it running.' },
      ],
    },
    {
      kind: 'table',
      label: 'Pricing',
      heading: 'Automation packages',
      head: ['Package', 'Price', 'What you get'],
      rows: [
        ['Core', '$750', 'One automated workflow connecting up to two tools, documented, with a 14-day support window.'],
        ['Workflow Starter', '$1,500', 'One workflow across up to three tools, documentation plus a training session, 30-day support.'],
        ['Workflow Pro', '$3,500', 'Up to three workflows across eight tools, error handling and monitoring, two training sessions, 60-day support.'],
        ['Custom AI', '$5,000+', 'Bespoke AI agents, chatbots and data pipelines, fully documented, 90-day support and ongoing maintenance available.'],
      ],
    },
    {
      kind: 'proof',
      label: 'In production',
      heading: 'We use this stuff daily',
      cases: [
        { name: 'ReviewLoop', summary: 'Our own product: turns finished jobs into Google reviews automatically, with an AI reply writer for the reviews that come back.', href: '/CaseStudy?slug=reviewloop', tag: 'C4 Original' },
        { name: 'Nudge', summary: 'Automated payment chasing and rate-rise nudges for service businesses — running in production, chasing real invoices.', href: '/software', tag: 'C4 Original' },
        { name: 'Quotr', summary: 'Instant quote calculators that turn “can you give me a ballpark?” emails into qualified, priced leads while you sleep.', href: '/CaseStudy?slug=quotr', tag: 'C4 Original' },
      ],
    },
    {
      kind: 'prose',
      label: 'Access & trust',
      heading: 'What do you need from us to build this?',
      body: [
        'Less than you’d think, and never more than the workflow requires. Automations run on scoped API keys — the invoice workflow can raise invoices, not read your payroll — and you create the credentials in your own accounts, so you can revoke our access the day the project ends. Where a platform supports it, we work read-only until the build is approved.',
        'Customer data stays in the tools you already use; the automation moves it between them rather than copying it somewhere new. And everything we wire up is documented well enough that any developer after us could maintain it — access without lock-in is the whole point.',
      ],
    },
    {
      kind: 'prose',
      label: 'Honest scoping',
      heading: 'Should you build custom or just buy a tool?',
      body: [
        'Sometimes the right answer is a $30-a-month off-the-shelf product, and we’ll tell you so — recommending one costs us a project and earns us a referrer. Buy when your need is generic and a mature tool nails it. Build when the workflow is genuinely yours: your rules, your systems wired together, your edge cases — or when you’re paying for three overlapping subscriptions that one custom workflow would replace.',
        'The audit settles it with numbers rather than vibes: hours saved, subscriptions replaced, payback period. If custom doesn’t clear the bar, you keep the audit and the recommendation anyway.',
      ],
    },
    {
      kind: 'prose',
      label: 'C4Sight',
      heading: 'Want your team trained, not just tooled?',
      body: [
        'Automation sticks when the team understands it. C4Sight is our workplace AI training arm: half-day workshops from $800 and full-day programs from $1,400, run on-site with your actual workflows. The full-day version ends with an automation readiness map — a prioritised list of what to automate next and what it would cost.',
      ],
    },
  ],
  faqs: [
    {
      q: 'How much does business automation cost?',
      a: 'A single automated workflow starts at $750. Most businesses invest $1,500 to $3,500 to cover their highest-waste processes, and custom AI work is scoped from $5,000. A workflow that saves three hours a week pays for itself inside a few months.',
    },
    {
      q: 'Which tools can you connect?',
      a: 'Xero, Square, Stripe, Google Workspace, Outlook, most CRMs and booking systems — anything with an API, plus the 400-odd integrations n8n supports out of the box. If your stack is unusual, the audit confirms what’s connectable before you commit.',
    },
    {
      q: 'Is my business too small for automation?',
      a: 'If you’re a one-person operation drowning in follow-ups, you’re the ideal candidate — automation gives you back the hours an assistant would cost $30 an hour to cover. The $750 single-workflow package exists precisely for this.',
    },
    {
      q: 'What about AI making things up?',
      a: 'We design around it. Anywhere money, clients or reputation are involved, AI drafts and a human approves — it never sends unsupervised. Pure logic automations (invoicing, reminders, routing) don’t use generative AI at all, so there’s nothing to hallucinate.',
    },
    {
      q: 'Do I need a new website first?',
      a: 'No. Automation bolts onto the systems you already run — your inbox, your accounting software, your booking tool. A website only enters the picture if the workflow starts there, like quote calculators or booking forms.',
    },
    {
      q: 'How long does an automation take to deliver?',
      a: 'A single workflow usually ships within one to two weeks of the audit; a Workflow Pro engagement with three workflows runs three to five weeks including testing against real data. The slowest step is almost always waiting on account access, so we ask for credentials early.',
    },
  ],
  cta: {
    heading: 'Sick of doing the same thing twice?',
    text: 'Tell us the task you hate most. If it can be automated, we’ll quote it. If it can’t, we’ll say so and save us both the meeting.',
  },
};
