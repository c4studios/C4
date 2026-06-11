/**
 * Shared C4 Originals product data.
 * Consumed by the Software list page, the per-product detail page,
 * and the home C4Originals preview.
 *
 * ReviewLoop, Complia and FirmFlow run inside the C4 suite app —
 * accounts and paid plans are managed in-app so purchases grant
 * access directly. Lifetime one-time purchases use live Stripe links.
 */

export const SUITE_APP_URL = 'https://c4-saas-suite.vercel.app';

/* Lifetime one-time payment links (live Stripe). */
export const LIFETIME_LINKS = {
  quotr: 'https://buy.stripe.com/4gM5kDbdm1sU2stcmQ3ZK0f',
  returndesk: 'https://buy.stripe.com/dRmbJ16X68Vmfff4Uo3ZK0h',
  reviewloop: 'https://buy.stripe.com/00w28r6X60oQaYZeuY3ZK0i',
  complia: 'https://buy.stripe.com/cNibJ1a9i7Ri1op72w3ZK0j',
  firmflow: 'https://buy.stripe.com/00w4gz1CMdbC4ABgD63ZK0k',
};

export const PRODUCTS = [
  {
    slug: 'quotr',
    name: 'Quotr',
    status: 'Live',
    logo: '/Software/quotr-icon.jpeg',
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
    tiers: [
      { label: 'Starter', price: 29 },
      { label: 'Pro', price: 59 },
      { label: 'Agency', price: 99 },
    ],
    lifetime: { price: 1899, href: LIFETIME_LINKS.quotr },
    pricing: 'From $29/mo — use code C4HALF for 50% off your first 3 months.',
    ctaLabel: 'Start free at quotr.us',
    ctaHref: 'https://quotr.us',
    ctaExternal: true,
  },
  {
    slug: 'returndesk',
    name: 'ReturnDesk',
    status: 'Beta',
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
    tiers: [
      { label: 'Early bird', price: 49, note: 'locked in forever' },
      { label: 'Pro at launch', price: 99 },
    ],
    lifetime: { price: 1199, href: LIFETIME_LINKS.returndesk },
    pricing: '$49/mo early bird — locks in forever. Start free, upgrade in the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: SUITE_APP_URL,
    ctaExternal: true,
  },
  {
    slug: 'reviewloop',
    name: 'ReviewLoop',
    status: 'Live',
    logo: '/Software/reviewloop-minimal.png',
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
    tiers: [
      { label: 'Starter', price: 29 },
      { label: 'Pro', price: 79 },
    ],
    lifetime: { price: 699, href: SUITE_APP_URL },
    pricing: 'Starter $29/mo · Pro $79/mo. Start free — paid plans unlock inside the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: SUITE_APP_URL,
    ctaExternal: true,
  },
  {
    slug: 'complia',
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
      'Compliance deadlines are non-negotiable and easy to miss. A late BAS or ASIC review means penalties that dwarf the cost of staying organised.',
    solution:
      'Complia maps your obligations to the Australian calendar, reminds you before each one, and walks you through exactly what to prepare.',
    tiers: [
      { label: 'Pro', price: 49 },
      { label: 'Business', price: 99 },
    ],
    lifetime: { price: 1199, href: SUITE_APP_URL },
    pricing: 'Pro $49/mo · Business $99/mo. Start free — paid plans unlock inside the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: SUITE_APP_URL,
    ctaExternal: true,
  },
  {
    slug: 'rebook',
    name: 'Rebook',
    status: 'Live',
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
    tiers: [
      { label: 'Starter', price: 29 },
      { label: 'Pro', price: 79 },
    ],
    lifetime: { price: 699, href: SUITE_APP_URL },
    pricing: 'Starter $29/mo · Pro $79/mo. Start free — paid plans unlock inside the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: SUITE_APP_URL,
    ctaExternal: true,
  },
  {
    slug: 'crewcheck',
    name: 'CrewCheck',
    status: 'Live',
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
      'An expired ticket or lapsed insurance discovered on site is a compliance breach, a liability, and a job delay — and spreadsheets never warn you in time.',
    solution:
      'CrewCheck tracks every credential’s expiry, alerts you at 30, 14 and 3 days out, and nudges the crew member directly so renewals happen before they bite.',
    tiers: [
      { label: 'Starter', price: 49 },
      { label: 'Pro', price: 99 },
    ],
    lifetime: { price: 1199, href: SUITE_APP_URL },
    pricing: 'Starter $49/mo · Pro $99/mo. Start free — paid plans unlock inside the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: SUITE_APP_URL,
    ctaExternal: true,
  },
  {
    slug: 'safedraft',
    name: 'SafeDraft',
    status: 'Live',
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
    tiers: [
      { label: 'Starter', price: 49 },
      { label: 'Pro', price: 99 },
    ],
    lifetime: { price: 1199, href: SUITE_APP_URL },
    pricing: 'Starter $49/mo · Pro $99/mo. Start free — paid plans unlock inside the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: SUITE_APP_URL,
    ctaExternal: true,
  },
  {
    slug: 'nudge',
    name: 'Nudge',
    status: 'Live',
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
    tiers: [
      { label: 'Starter', price: 29 },
      { label: 'Pro', price: 59 },
    ],
    lifetime: { price: 699, href: SUITE_APP_URL },
    pricing: 'Starter $29/mo · Pro $59/mo. Start free — paid plans unlock inside the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: SUITE_APP_URL,
    ctaExternal: true,
  },
  {
    slug: 'firmflow',
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
    tiers: [
      { label: 'Pro', price: 79 },
      { label: 'Agency', price: 199 },
    ],
    lifetime: { price: 1899, href: SUITE_APP_URL },
    pricing: 'Pro $79/mo · Agency $199/mo. Start free — paid plans unlock inside the app.',
    ctaLabel: 'Start free in the app',
    ctaHref: SUITE_APP_URL,
    ctaExternal: true,
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
  if (status === 'Studio') return 'var(--c4-text-subtle)';
  return 'var(--c4-text-muted)';
}
