/**
 * Shared C4 Originals product data.
 * Consumed by the Software list page, the per-product detail page,
 * and the home C4Originals preview.
 *
 * Each live product runs as its own standalone app (app.<product>.
 * c4studios.com.au) with accounts and paid plans managed in-app.
 * Lifetime one-time purchases use live Stripe links. Products not yet
 * relaunched as standalone apps are listed as Early access and route
 * interest to the contact page.
 */

/* Lifetime one-time payment links (live Stripe, verified against the
   current Lifetime prices: RD $690 / RL $450 / Complia $690 / FF $890). */
export const LIFETIME_LINKS = {
  quotr: 'https://buy.stripe.com/00wbJ1ftC0oQ2st9aE3ZK0l',
  returndesk: 'https://buy.stripe.com/cNieVdftC6Ne7MN2Mg3ZK0m',
  reviewloop: 'https://buy.stripe.com/cNi6oH4OY0oQaYZeuY3ZK0n',
  complia: 'https://buy.stripe.com/7sY28rchqfjK9UV5Ys3ZK0o',
  firmflow: 'https://buy.stripe.com/cNibJ13KU5Ja9UVeuY3ZK0p',
};

export const PRODUCTS = [
  {
    slug: 'quotr',
    siteUrl: 'https://quotr.us',
    name: 'Quotr',
    status: 'Live',
    logo: '/Software/quotr-icon.png',
    logoBg: '#000000',
    oneLiner: 'Instant quote calculators for service businesses.',
    summary:
      'Quotr lets any service business put a real, instant price estimate on their website. Visitors answer a few questions, see a transparent range, and you get a qualified lead in your inbox — no back-and-forth, no quoting bottleneck.',
    features: [
      'Embed on any website in 5 minutes',
      'Stripe billing built in',
      'Email notification on every lead',
      'Fully themeable to match your brand',
    ],
    highlights: [
      { stat: '< 5 min', label: 'to embed on any site' },
      { stat: '24/7', label: 'quoting, even while you sleep' },
      { stat: '100%', label: 'transparent pricing to customers' },
    ],
    problem:
      'Most service businesses lose leads to slow quoting. A customer wants a number now; if they have to wait a day for a callback, they have already messaged three competitors.',
    solution:
      'Quotr turns your pricing logic into an interactive calculator. Customers self-qualify and see a range instantly, and you wake up to warm leads who already understand what they are paying for.',
    howItWorks: [
      { step: '01', title: 'Build your calculator', body: 'Add your services and pricing rules in a visual builder. No code — just describe what you charge for and how.' },
      { step: '02', title: 'Embed it on your site', body: 'Paste one line of code, or share a link. Visitors answer a few questions and see a transparent price range instantly.' },
      { step: '03', title: 'Get qualified leads', body: 'Every estimate lands in your inbox with the customer’s details and answers, so you follow up warm — not cold.' },
    ],
    faqs: [
      { q: 'Do I need a developer to set it up?', a: 'No. You build the calculator with a visual editor and embed it with a single snippet. Most businesses are live in under five minutes.' },
      { q: 'What if my pricing is complicated?', a: 'Quotr supports tiered rules, conditional questions and formula-based pricing, so you can model almost any service. Customers only ever see a clean range.' },
      { q: 'Can I try it before paying?', a: 'Yes. Start free at quotr.us; paid plans add billing, more calculators and branding.' },
      { q: 'Will it match my brand?', a: 'Fully. Colours, fonts and wording are all themeable, so the calculator looks like part of your own site.' },
    ],
    tiers: [
      { label: 'Starter', price: 29 },
      { label: 'Pro', price: 79 },
      { label: 'Agency', price: 199 },
    ],
    lifetime: { price: 690, href: 'https://quotr.us/pricing' },
    pricing: 'From $29/mo — use code C4HALF for 50% off your first 3 months. Lifetime plans from $690.',
    ctaLabel: 'Start free at quotr.us',
    ctaHref: 'https://quotr.us',
    ctaExternal: true,
  },
  {
    slug: 'returndesk',
    siteUrl: 'https://returndesk.c4studios.com.au',
    name: 'ReturnDesk',
    status: 'Live',
    logo: '/Software/returndesk-minimal.png',
    logoBg: '#ffffff',
    oneLiner: 'Priority inbox for service businesses.',
    summary:
      'ReturnDesk reads your incoming enquiries and surfaces the ones worth answering first — with a plain-English reason for every score, so you are never guessing why something is at the top.',
    features: [
      'Manual-first, works on day one',
      'Explainable priority scoring',
      'Reply templates for every category',
      'No risky automation until you trust it',
    ],
    highlights: [
      { stat: 'Day 1', label: 'value with zero setup' },
      { stat: 'Why?', label: 'every score is explainable' },
      { stat: '1 inbox', label: 'across all your channels' },
    ],
    problem:
      'High-volume inboxes bury the jobs that actually pay. The urgent quote request sits three pages below newsletters and spam.',
    solution:
      'ReturnDesk scores every message on intent and value, shows you why, and gives you a one-click templated reply — so the best leads get answered first, every time.',
    howItWorks: [
      { step: '01', title: 'Bring your enquiries in', body: 'Pull your incoming messages into one inbox. It works manually from day one — no risky automation required.' },
      { step: '02', title: 'See what matters first', body: 'Every message gets a priority score with a plain-English reason, so the jobs worth money rise to the top.' },
      { step: '03', title: 'Reply in one click', body: 'Pick a templated reply for the category and send. The best leads get answered first, every time.' },
    ],
    faqs: [
      { q: 'Does it reply to customers automatically?', a: 'Only if you want it to. ReturnDesk is manual-first — it scores and suggests, and you stay in control until you trust it.' },
      { q: 'Why is a message ranked highly?', a: 'Every score comes with a reason in plain English, so you’re never guessing why something is at the top.' },
      { q: 'Is it free to start?', a: 'Yes. Start free in the app and upgrade when you’re ready — early-bird pricing locks in forever.' },
    ],
    tiers: [
      { label: 'Early bird', price: 29, note: 'locked in forever' },
      { label: 'Pro at launch', price: 59 },
    ],
    lifetime: { price: 690, href: LIFETIME_LINKS.returndesk },
    pricing: 'Early bird $29/mo — locks in forever. Start free, upgrade in the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: 'https://returndesk.c4studios.com.au',
    ctaExternal: true,
  },
  {
    slug: 'reviewloop',
    siteUrl: 'https://reviewloop.c4studios.com.au',
    name: 'ReviewLoop',
    status: 'Live',
    logo: '/Software/reviewloop-mark.png',
    logoBg: '#ffffff',
    oneLiner: 'Turn happy jobs into Google reviews.',
    summary:
      'ReviewLoop closes the gap between a job well done and the review that proves it — with timed, templated requests and follow-ups that run themselves.',
    features: [
      'Templated review request emails',
      'Click-tracked review links',
      'AI replies to reviews (Pro)',
      'Automated follow-up reminders',
    ],
    highlights: [
      { stat: 'Auto', label: 'requests after every job' },
      { stat: '★★★★★', label: 'more reviews, less nagging' },
      { stat: 'Local', label: 'SEO that compounds' },
    ],
    problem:
      'Reviews are the single biggest local-SEO and trust signal — and the easiest thing to forget to ask for when you are busy doing the work.',
    solution:
      'ReviewLoop sends the right request at the right moment, follows up politely, and routes happy customers straight to your Google profile.',
    howItWorks: [
      { step: '01', title: 'Add a customer after each job', body: 'Drop in the customer and the job you just finished, or let it pull from your records.' },
      { step: '02', title: 'We send the request', body: 'ReviewLoop emails a templated, click-tracked review link at the right moment, then follows up politely if there’s no response.' },
      { step: '03', title: 'Watch reviews roll in', body: 'Happy customers go straight to your Google profile. On Pro, AI even drafts your replies.' },
    ],
    faqs: [
      { q: 'Will it annoy my customers?', a: 'No. Requests are timed and polite, with a single gentle follow-up, and you control the wording and the schedule.' },
      { q: 'Does it post fake reviews?', a: 'Never. ReviewLoop only invites real customers to leave a genuine review on your own Google profile.' },
      { q: 'What does Pro add?', a: 'Automated follow-up reminders and AI-drafted replies to the reviews you receive.' },
    ],
    tiers: [
      { label: 'Starter', price: 19 },
      { label: 'Pro', price: 45 },
    ],
    lifetime: { price: 450, href: LIFETIME_LINKS.reviewloop },
    pricing: 'Starter $19/mo · Pro $45/mo. Start free — paid plans unlock inside the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: 'https://app.reviewloop.c4studios.com.au/signup',
    ctaExternal: true,
  },
  {
    slug: 'complia',
    siteUrl: 'https://complia.c4studios.com.au',
    name: 'Complia',
    status: 'Live',
    logo: '/Software/Complia.png',
    logoBg: '#ffffff',
    oneLiner: 'Australian compliance calendar and assistant.',
    summary:
      'Complia keeps small Australian businesses ahead of every lodgement and obligation — BAS, super, ASIC — with checklists and reminders built around the real ATO calendar.',
    features: [
      'BAS, super, and ASIC annual review tracking',
      'Preparation checklists per obligation',
      'Email reminders before due dates',
      'Built for the Australian calendar',
    ],
    highlights: [
      { stat: '0', label: 'missed lodgement deadlines' },
      { stat: 'AU', label: 'built for local obligations' },
      { stat: 'Checklist', label: 'for every obligation' },
    ],
    problem:
      'Compliance deadlines are easy to lose track of when you are busy running the business. Staying a step ahead of each BAS, super and ASIC date is far simpler — and cheaper — than catching up after one slips.',
    solution:
      'Complia maps your obligations to the Australian calendar, reminds you before each one, and walks you through exactly what to prepare.',
    howItWorks: [
      { step: '01', title: 'Tell us your obligations', body: 'Pick the lodgements that apply to you — BAS, super, ASIC review and more — mapped to the real Australian calendar.' },
      { step: '02', title: 'Get reminded in time', body: 'Complia emails you before each due date, with enough lead time to actually prepare.' },
      { step: '03', title: 'Work the checklist', body: 'Each obligation comes with a preparation checklist, so you know exactly what to gather and lodge.' },
    ],
    faqs: [
      { q: 'Is this tax or legal advice?', a: 'No. Complia is an organisational tool that tracks dates and preparation steps — it doesn’t replace your accountant.' },
      { q: 'Is it specific to Australia?', a: 'Yes. Complia is built around the Australian ATO and ASIC calendar and obligations.' },
      { q: 'Can I add my own deadlines?', a: 'Yes. Alongside the standard obligations you can add custom ones with their own checklist and reminders.' },
    ],
    tiers: [
      { label: 'Starter', price: 29 },
      { label: 'Pro', price: 59 },
    ],
    lifetime: { price: 690, href: LIFETIME_LINKS.complia },
    pricing: 'Starter $29/mo · Pro $59/mo. Start free — paid plans unlock inside the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: 'https://complia.c4studios.com.au',
    ctaExternal: true,
  },
  {
    slug: 'rebook',
    name: 'Rebook',
    status: 'Early access',
    logo: '/Software/Rebook.svg',
    logoBg: '#ffffff',
    oneLiner: 'Automated service reminders that bring customers back.',
    summary:
      'Rebook watches when every customer last booked and reaches out when they fall due — with a tracked booking link in every email — so repeat work comes back without you chasing it.',
    features: [
      'Knows when every customer falls due',
      'Tracked booking links in every email',
      'Manual or fully automatic sending',
      'Built for recurring service businesses',
    ],
    highlights: [
      { stat: 'Auto', label: 'reminders when customers fall due' },
      { stat: '1-click', label: 'tracked booking links' },
      { stat: 'Repeat', label: 'revenue on autopilot' },
    ],
    problem:
      'Most service businesses rely on customers remembering to rebook. They don’t — and the follow-up messages never get sent once the week gets busy.',
    solution:
      'Rebook tracks every customer’s service cycle and sends the reminder at the right moment, with a tracked booking link so you can see exactly which messages turn into jobs.',
    howItWorks: [
      { step: '01', title: 'Add your customers', body: 'Record when each customer last booked and how often they’re due — for example every 6 or 12 months.' },
      { step: '02', title: 'Rebook watches the clock', body: 'When a customer falls due, Rebook drafts a reminder with a tracked booking link, ready to send.' },
      { step: '03', title: 'Repeat work comes back', body: 'Send manually or fully automatically, and see exactly which reminders turned into bookings.' },
    ],
    faqs: [
      { q: 'What kind of business is this for?', a: 'Any service that should repeat on a cycle: cleaning, servicing, inspections, dental, detailing and more.' },
      { q: 'Do I have to send each reminder myself?', a: 'Your choice. Run it manually for full control, or switch on automatic sending once you trust the timing.' },
      { q: 'How do I know it\'s working?', a: 'Every booking link is tracked, so you can see which reminders led to actual rebookings.' },
    ],
    tiers: [
      { label: 'Starter', price: 19 },
      { label: 'Pro', price: 45 },
    ],
    pricing: 'Starter $19/mo · Pro $45/mo at relaunch. Early access — register interest and we’ll onboard you personally.',
    ctaLabel: 'Register interest',
    ctaHref: '/Contact',
    ctaExternal: false,
  },
  {
    slug: 'crewcheck',
    name: 'CrewCheck',
    status: 'Early access',
    logo: '/Software/CrewCheck.svg',
    logoBg: '#ffffff',
    oneLiner: 'Licence and insurance expiry tracking for your crew.',
    summary:
      'CrewCheck keeps every licence, ticket and insurance certificate for your crew in one register — with automatic alerts before anything expires, and renewal nudges sent straight to the subbie.',
    features: [
      'Every credential and its days remaining',
      'Alerts at 30, 14, and 3 days before expiry',
      'Renewal nudges straight to the subbie',
      'One register for the whole crew',
    ],
    highlights: [
      { stat: '30/14/3', label: 'day alerts before expiry' },
      { stat: '0', label: 'expired tickets on site' },
      { stat: '1 register', label: 'for the whole crew' },
    ],
    problem:
      'Keeping every ticket and insurance certificate current across a crew is hard to do from a spreadsheet — it only tells you something has lapsed once you go looking. A little early warning keeps everyone site-ready without the last-minute scramble.',
    solution:
      'CrewCheck tracks every credential’s expiry, alerts you at 30, 14 and 3 days out, and nudges the crew member directly so renewals happen before they bite.',
    howItWorks: [
      { step: '01', title: 'Build your crew register', body: 'Add each worker and their licences, tickets and insurance certificates, with expiry dates.' },
      { step: '02', title: 'Get warned early', body: 'CrewCheck alerts you 30, 14 and 3 days before anything expires — no more surprises on site.' },
      { step: '03', title: 'Nudge the renewal', body: 'Send a renewal reminder straight to the crew member, so it’s handled before it becomes a problem.' },
    ],
    faqs: [
      { q: 'What can I track?', a: 'Any credential with an expiry — trade licences, white cards, high-risk tickets, insurances and more — all in one register.' },
      { q: 'Who gets the alerts?', a: 'You do, at 30, 14 and 3 days out. You can also nudge the individual crew member directly to renew.' },
      { q: 'Is it just for construction?', a: 'No. Any business with licensed or insured staff benefits — though it’s especially handy on site.' },
    ],
    tiers: [
      { label: 'Starter', price: 29 },
      { label: 'Pro', price: 59 },
    ],
    pricing: 'Starter $29/mo · Pro $59/mo at relaunch. Early access — register interest and we’ll onboard you personally.',
    ctaLabel: 'Register interest',
    ctaHref: '/Contact',
    ctaExternal: false,
  },
  {
    slug: 'safedraft',
    name: 'SafeDraft',
    status: 'Early access',
    logo: '/Software/SafeDraft.svg',
    logoBg: '#ffffff',
    oneLiner: 'AI-drafted Safe Work Method Statements.',
    summary:
      'SafeDraft turns a plain-English job description into a print-ready Safe Work Method Statement — hazards and controls mapped through the hierarchy of controls, with anything uncertain flagged for confirmation on site rather than invented.',
    features: [
      'Hazards + controls via the hierarchy of controls',
      'Unknowns marked [CONFIRM ON SITE] — never invented',
      'Print-ready with worker sign-off table',
      'Built for Australian site requirements',
    ],
    highlights: [
      { stat: 'Minutes', label: 'from job description to SWMS' },
      { stat: '[CONFIRM]', label: 'flags instead of guesses' },
      { stat: 'Print-ready', label: 'with sign-off table' },
    ],
    problem:
      'A SWMS is mandatory before high-risk work starts, but writing one properly takes hours — so they get copy-pasted from old jobs and stop reflecting the actual site.',
    solution:
      'SafeDraft drafts the document from your actual job description, applies the hierarchy of controls, and marks anything it can’t verify for on-site confirmation — a real starting point, not a template.',
    howItWorks: [
      { step: '01', title: 'Describe the job', body: 'Write the task in plain English: the trade, the work, and the site.' },
      { step: '02', title: 'SafeDraft writes the SWMS', body: 'It maps hazards and controls through the hierarchy of controls and flags anything uncertain as [CONFIRM ON SITE] instead of inventing it.' },
      { step: '03', title: 'Review, sign, print', body: 'Check the flagged items, then print a ready-to-use document with a worker sign-off table.' },
    ],
    faqs: [
      { q: 'Is the SWMS ready to use as-is?', a: 'It’s a real, structured starting point — not a blank template. You review the [CONFIRM ON SITE] flags and adjust for your actual site before use.' },
      { q: 'Does it make up hazards or controls?', a: 'No. Where it can’t verify something, it marks it [CONFIRM ON SITE] rather than guessing.' },
      { q: 'Is it built for Australia?', a: 'Yes. It follows the hierarchy of controls and Australian site-documentation expectations.' },
    ],
    tiers: [
      { label: 'Starter', price: 29 },
      { label: 'Pro', price: 59 },
    ],
    pricing: 'Starter $29/mo · Pro $59/mo at relaunch. Early access — register interest and we’ll onboard you personally.',
    ctaLabel: 'Register interest',
    ctaHref: '/Contact',
    ctaExternal: false,
  },
  {
    slug: 'nudge',
    name: 'Nudge',
    status: 'Early access',
    logo: '/Software/Nudge.svg',
    logoBg: '#ffffff',
    oneLiner: 'Polite, escalating invoice reminders.',
    summary:
      'Nudge chases outstanding invoices so you don’t have to — friendly at 3 days, firm at 10, final at 21 — and stops the moment you mark an invoice paid.',
    features: [
      'Friendly at 3 days, firm at 10, final at 21',
      'Stops the moment you mark it paid',
      'Rate-rise calculator + letter included',
      'Automatic chasing, zero awkwardness',
    ],
    highlights: [
      { stat: '3/10/21', label: 'day escalation sequence' },
      { stat: 'Auto-stop', label: 'when marked paid' },
      { stat: 'Faster', label: 'payment without the chase' },
    ],
    problem:
      'Late invoices are awkward to chase, so most small businesses just… don’t. The cash sits in someone else’s account while the follow-up email stays unwritten.',
    solution:
      'Nudge sends the reminders on a polite-but-firm schedule with payment details in every email, and backs off instantly when the invoice is settled.',
    howItWorks: [
      { step: '01', title: 'Add an unpaid invoice', body: 'Enter the invoice, the amount and the customer, or mark which ones are outstanding.' },
      { step: '02', title: 'Nudge chases for you', body: 'It sends a friendly reminder at 3 days, firmer at 10, and a final notice at 21 — with your payment details every time.' },
      { step: '03', title: 'It stops when you\'re paid', body: 'Mark the invoice paid and the reminders stop instantly. No awkward chasing on your part.' },
    ],
    faqs: [
      { q: 'Will it embarrass me with customers?', a: 'No. The tone is polite first and only escalates gradually, and you can edit the wording at every stage.' },
      { q: 'What happens when an invoice is paid?', a: 'The moment you mark it paid, Nudge stops all further reminders for that invoice automatically.' },
      { q: 'What\'s the rate-rise feature?', a: 'A built-in calculator and letter generator (RateRise) that helps you raise your prices and tell customers professionally.' },
    ],
    tiers: [
      { label: 'Starter', price: 19 },
      { label: 'Pro', price: 39 },
    ],
    pricing: 'Starter $19/mo · Pro $39/mo at relaunch. Early access — register interest and we’ll onboard you personally.',
    ctaLabel: 'Register interest',
    ctaHref: '/Contact',
    ctaExternal: false,
  },
  {
    slug: 'firmflow',
    siteUrl: 'https://firmflow.c4studios.com.au',
    name: 'FirmFlow',
    status: 'Live',
    logo: '/Software/FirmFlow.png',
    logoBg: '#ffffff',
    oneLiner: 'AI content engine for professional services.',
    summary:
      'FirmFlow helps accountants, lawyers and consultants stay visible — generating on-brand posts, newsletters and client emails from your own source material, with risk controls built in.',
    features: [
      'LinkedIn posts, newsletters, client emails',
      'Source-first content generation',
      'Built-in disclaimer and risk controls',
      'Trained on your firm’s voice',
    ],
    highlights: [
      { stat: 'Source', label: 'first — no hallucinated facts' },
      { stat: 'On-brand', label: 'in your firm’s voice' },
      { stat: 'Safe', label: 'disclaimers built in' },
    ],
    problem:
      'Professional-services firms know content drives trust, but partners do not have time to write it — and generic AI tools produce risky, off-brand fluff.',
    solution:
      'FirmFlow grounds every piece in your own approved material, keeps your voice, and bakes in the disclaimers your industry requires.',
    howItWorks: [
      { step: '01', title: 'Add your source material', body: 'Paste an article, update or note you want to talk about. FirmFlow only works from material you give it.' },
      { step: '02', title: 'Generate on-brand content', body: 'Get LinkedIn posts, newsletters and client emails in your firm’s voice — grounded in your source, not invented.' },
      { step: '03', title: 'Review and publish', body: 'Required disclaimers are built in. Check it, tweak it, and ship it.' },
    ],
    faqs: [
      { q: 'Will it make up facts or figures?', a: 'No. FirmFlow is source-first — it writes from the material you provide rather than hallucinating claims.' },
      { q: 'Is it safe for regulated industries?', a: 'It bakes in the disclaimers your industry requires and keeps to your approved source material, so output stays on-brand and lower-risk.' },
      { q: 'Who is it for?', a: 'Accountants, lawyers, consultants and other professional-services firms that need a steady stream of trustworthy content.' },
    ],
    tiers: [
      { label: 'Starter', price: 39 },
      { label: 'Pro', price: 89 },
    ],
    lifetime: { price: 890, href: LIFETIME_LINKS.firmflow },
    pricing: 'Starter $39/mo · Pro $89/mo. Start free — paid plans unlock inside the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: 'https://firmflow.c4studios.com.au',
    ctaExternal: true,
  },
  {
    slug: 'sweep',
    name: 'Sweep',
    status: 'Preview',
    logo: '/Software/Sweep.svg',
    logoBg: '#ffffff',
    oneLiner: 'Tidy your desktop and downloads in five minutes.',
    summary:
      'Sweep treats a cluttered folder as decision debt, not a storage problem. It groups the mess into a handful of decisions you triage with one key each — and everything you archive goes to a recoverable Holding Pen, so you move fast without fear.',
    features: [
      'Groups clutter into a handful of decisions',
      'Keyboard-first triage — keep, archive, undo',
      'Holding Pen — nothing is ever deleted',
      'Finds duplicates, stale downloads, dead installers',
    ],
    highlights: [
      { stat: '5 min', label: 'from landfill to tidy' },
      { stat: 'Undo', label: 'nothing is ever lost' },
      { stat: '1 key', label: 'per decision' },
    ],
    problem:
      'A cluttered desktop is not a storage problem, it is decision debt — every file is a decision someone postponed, and tidying means making hundreds of them one at a time. So nobody starts.',
    solution:
      'Sweep does the grouping for you and turns the pile into a short deck of obvious decisions. You triage with one key each; anything you archive lands in a recoverable Holding Pen, so a wrong call is never permanent.',
    howItWorks: [
      { step: '01', title: 'Scan a zone', body: 'Point Sweep at your Desktop or Downloads. Scanning is read-only — it never touches a file without your say-so.' },
      { step: '02', title: 'Triage the deck', body: 'Sweep deals the mess as group cards, biggest wins first. Keep, archive or open each with a single keystroke.' },
      { step: '03', title: 'Reclaim the space', body: 'Archived items move to the Holding Pen — recoverable with one tap, even after a restart. Nothing is ever deleted.' },
    ],
    faqs: [
      { q: 'Could it delete something I need?', a: 'No. Sweep never deletes — it moves items to a recoverable Holding Pen, and undo works even after the app restarts.' },
      { q: 'Does it touch my files without asking?', a: 'Scanning is read-only. Sweep only ever moves a file you have approved.' },
      { q: 'What does it run on?', a: 'Windows first, built on the same web stack as the rest of C4 so a Mac version can follow.' },
    ],
    pricing: 'In active development — preview access for C4 Studios clients.',
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=Sweep',
    ctaExternal: false,
  },
  {
    slug: 'handover',
    name: 'Handover',
    status: 'Preview',
    logo: '/Software/Handover.svg',
    logoBg: '#ffffff',
    oneLiner: 'Client-ready handoff packs for finished projects.',
    summary:
      'Point Handover at a finished project and get a client-ready handoff pack in minutes — a plain-English owner’s manual, developer notes, a credentials ledger of every account, and a verified, clean source archive.',
    features: [
      'Plain-English owner’s manual (and PDF)',
      'Credentials ledger — every account, who holds it',
      'Refuses to package if it finds live secrets',
      'Verified, clean source archive',
    ],
    highlights: [
      { stat: 'Minutes', label: 'not a lost day' },
      { stat: '0 secrets', label: 'shipped to clients' },
      { stat: 'Every account', label: 'mapped and handed over' },
    ],
    problem:
      'The handoff is the most-skipped deliverable in agency work — so clients end up unsure what they actually own, and developers keep fielding one-off questions long after a project wraps. A clear handover pack gives the client real independence and gives you a clean finish.',
    solution:
      'Handover scans the project for the hard facts, asks the handful of questions only a human knows, and generates a branded pack that makes the client genuinely independent — domain, hosting, code and accounts all accounted for.',
    howItWorks: [
      { step: '01', title: 'Scan the project', body: 'Handover reads the stack, services, deploy setup and env vars — and blocks if it finds a live secret committed in the code.' },
      { step: '02', title: 'Answer a few questions', body: 'About ten questions only a human knows: who the client is, who holds the domain and hosting, the support arrangement.' },
      { step: '03', title: 'Generate the pack', body: 'Owner’s manual, developer notes, handover checklist, credentials ledger and a clean source archive — branded and ready to send.' },
    ],
    faqs: [
      { q: 'Will my client actually understand it?', a: 'Yes. The owner’s manual assumes zero technical knowledge — every term is explained, with a quick-reference card to keep.' },
      { q: 'What if there is an API key in the code?', a: 'Handover refuses to build the pack until it is removed, so a live secret never ships to a client.' },
      { q: 'Does it work on any project?', a: 'Any git repository. It is stack-aware, so the notes and manual fit what the project actually is.' },
    ],
    pricing: 'In active development — used on live C4 client handovers.',
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=Handover',
    ctaExternal: false,
  },
  {
    slug: 'pulse',
    name: 'Pulse',
    status: 'Preview',
    logo: '/Software/Pulse.svg',
    logoBg: '#ffffff',
    oneLiner: 'Client updates that write themselves.',
    summary:
      'Pulse turns a project’s git activity into a plain-English weekly client update you review and send. It reads what actually happened, translates it out of developer-speak, and drafts the email — it never sends anything itself.',
    features: [
      'Turns commits into client-friendly language',
      'Groups work as New, Fixed and Improved',
      'Plain text or a branded HTML email',
      'Optional AI polish over the real facts',
    ],
    highlights: [
      { stat: 'Weekly', label: 'update in one command' },
      { stat: 'Plain English', label: 'no developer jargon' },
      { stat: 'You send', label: 'never auto-sent' },
    ],
    problem:
      'Freelancers and studios hate writing status updates, so they don’t — and client silence breeds “are you still working on this?” friction, scope anxiety and slow payment.',
    solution:
      'Pulse reads the week’s git history, strips the jargon, and drafts a warm, plain-English update grouped into what is new, what was fixed and what improved. You skim it, tweak it, and hit send.',
    howItWorks: [
      { step: '01', title: 'It reads the week’s work', body: 'Pulse looks at the project’s git activity over the period — no extra tracking, no timesheets.' },
      { step: '02', title: 'It translates to client language', body: 'Developer commits become plain-English bullets, with the hashes, file names and jargon stripped out.' },
      { step: '03', title: 'You review and send', body: 'Read the draft, adjust anything, and send. Pulse never emails a client on its own.' },
    ],
    faqs: [
      { q: 'Does it send emails on its own?', a: 'No. Pulse only ever drafts the update — you always review and send it yourself.' },
      { q: 'Will my client see commit jargon?', a: 'No. It strips commit hashes, file names and internal codenames, and rewrites the rest in plain English.' },
      { q: 'How does the optional AI polish work?', a: 'It rewrites the wording into a warmer client voice — but it is instructed never to invent changes, dates or numbers it was not given.' },
    ],
    pricing: 'In active development — preview access for C4 Studios clients.',
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=Pulse',
    ctaExternal: false,
  },
  {
    slug: 'c4-command',
    name: 'C4 Command',
    status: 'Studio',
    logo: '/Software/C4Command.png',
    logoBg: '#ffffff',
    oneLiner: 'Operational hub for the C4 Studio.',
    summary:
      'C4 Command is the internal system that runs the studio — the lead pipeline, automation health, projects, invoices and client notes, all in one place. It is the proof that we use what we build.',
    features: [
      'Lead pipeline and outreach monitoring',
      'Automation health dashboard',
      'Projects, invoices, and client notes',
      'Built on the same stack as client work',
    ],
    highlights: [
      { stat: '1 hub', label: 'for the whole studio' },
      { stat: 'Live', label: 'automation health checks' },
      { stat: 'Dogfood', label: 'we run on it daily' },
    ],
    problem:
      'Running a studio across a dozen disconnected tools means context lives everywhere and nowhere. Nothing talks to anything.',
    solution:
      'C4 Command unifies the pipeline, the projects and the automations into one operational picture — the same kind of system we build for clients.',
    howItWorks: [
      { step: '01', title: 'One operational picture', body: 'C4 Command pulls the lead pipeline, projects, invoices and client notes into a single hub.' },
      { step: '02', title: 'Automations stay healthy', body: 'Live health checks watch the studio’s automations, so nothing fails silently.' },
      { step: '03', title: 'We run on it daily', body: 'It’s built on the same stack we ship to clients — proof that we use what we build.' },
    ],
    faqs: [
      { q: 'Can I buy C4 Command?', a: 'It is an internal studio system, available to C4 Studios clients and partners rather than sold as a standalone product.' },
      { q: 'Why show it at all?', a: 'Because it is how we run the studio: the clearest proof that the tools we build hold up in daily use.' },
    ],
    pricing: 'Available to C4 Studios clients and partners.',
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=C4 Command',
    ctaExternal: false,
  },
];

export const PRODUCT_SLUGS = PRODUCTS.map((p) => p.slug);

export function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export function statusColor(status) {
  if (status === 'Live') return '#22c55e';
  if (status === 'Beta') return 'var(--c4-accent)';
  if (status === 'Preview') return '#d99a4e';
  if (status === 'Studio') return 'var(--c4-text-subtle)';
  return 'var(--c4-text-muted)';
}
