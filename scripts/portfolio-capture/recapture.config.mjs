/**
 * Recapture configs — route-based, full-viewport targets.
 * Each target: { id, route, caption, anchor?, scrollTo?, settle?, action?, desktopOnly?, mobileOnly? }
 * `anchor` scrolls the first element containing that text to near the top.
 */

export const CONFIGS = {
  // ── Transform Fremantle ────────────────────────────────────────────
  'transformfreo-com': {
    site: 'https://transformfreo.com',
    targets: [
      { id: '01-hero', route: '/', caption: 'Hero — harbour backdrop with mission statement and navigation' },
      { id: '02-schedule', route: '/', anchor: 'Prayer Meeting', caption: 'Prayer Meetings — weekly schedule across Fremantle churches' },
      { id: '03-vision', route: '/VisionAndAim', anchor: 'Our Aims', caption: 'Vision & Aim — numbered pillars of the movement' },
      { id: '04-connect', route: '/Connect', anchor: 'Get In Touch', caption: 'Connect — contact form and ways to reach the movement' },
      { id: '05-resources', route: '/Resources', anchor: 'Resources', caption: 'Resources — downloadable PDF library with branded cards' },
      { id: '06-statement', route: '/StatementOfFaith', anchor: 'Statement of Faith', caption: 'Statement of Faith — formatted creed and shared beliefs' },
    ],
  },

  // ── People Power (public surface only — rich features are auth-gated) ─
  'peoplepower-app': {
    site: 'https://peoplepower.app',
    targets: [
      // 01-intro (cinematic overlay) is kept from the existing capture — not re-shot.
      { id: '02-feed', route: '/', caption: 'Movement feed — discovery surface with sort tabs and sign-in to participate' },
      { id: '03-feed-scroll', route: '/', anchor: 'START MOVEMENT', caption: 'Feed — momentum / newest / impact / local sort tabs with live movement cards' },
      { id: '04-login', route: '/login', caption: 'Secure sign-in — email + password auth gating creation, messaging and reporting' },
    ],
  },

  // ── DS Racing — targeted clean re-captures (cookie banner + honest admin) ─
  'dsracingkarts-com-au': {
    site: 'https://www.dsracingkarts.com.au',
    targets: [
      { id: '15-confirmation', route: '/checkout/confirmation', desktopOnly: true, caption: 'Order confirmation — DSR-XXXXX number with 3-step "What happens next" guide' },
      { id: '27-admin-dashboard', route: '/admin', desktopOnly: true, caption: 'Admin portal — secured sign-in gate with role-based access (admin / super_admin)' },
    ],
  },
  // ── Aqua-Safe Plumbing — re-shot 19 Aug 2026. The site grew three sections
  //    since the Aug 9 capture (hot water, why-us, FAQ), so the old six-shot
  //    gallery no longer represented it.
  'aquasafeplumbing-com-au': {
    site: 'https://aquasafeplumbing.com.au',
    targets: [
      { id: '01-hero', route: '/', caption: 'Hero — the company’s own fleet at a Perth beach, behind a rotating three-panel headline and a service ticker' },
      { id: '02-services', route: '/', selector: '#services', caption: 'Services — every trade covered, with a Residential / Commercial toggle and each card linking to its own booking page' },
      { id: '03-hot-water', route: '/', selector: '#hot-water', caption: 'Hot water — a chooser that walks a customer to the right replacement system instead of listing brands' },
      { id: '04-filtration', route: '/', selector: '#filtration', caption: 'Whole-home filtration — a click-through diagram stepping the visitor through all three filter stages' },
      { id: '05-why', route: '/', selector: '#why', caption: 'Why Aqua-Safe — the promises that matter to someone letting a tradesperson into the house' },
      { id: '06-reviews', route: '/', selector: '#reviews', caption: 'Reviews — the business’s real Google reviews, with a direct link to leave one' },
      { id: '07-areas', route: '/', selector: '#areas', caption: 'Service areas — five Perth regions expanding to the suburbs, feeding the individual area pages' },
      { id: '08-faq', route: '/', selector: '#faq', caption: 'FAQ — the questions people actually ring to ask, answered before they have to' },
      { id: '09-book', route: '/', selector: '#book', caption: 'Book — call, online booking and enquiry side by side, with the call-out fee stated plainly' },
    ],
  },

  // ── Concepts (self-initiated pitch builds, 24 Aug 2026) ─────────────
  //    Each carries a permanent "unaffiliated concept" strip by design; it
  //    stays in the captures on purpose so the portfolio never implies these
  //    businesses are clients.
  'cmc-lawns-concept-vercel-app': {
    site: 'https://cmc-lawns-concept.vercel.app',
    targets: [
      { id: '01-hero', route: '/', caption: 'Home — the concept strip sits above everything, then the offer and the one action that matters' },
      { id: '02-program', route: '/lawn-care', caption: 'The program — what a maintained lawn actually involves, month by month' },
      { id: '03-services', route: '/services', caption: 'What we do — every service written in the owner’s own words, nothing invented' },
      { id: '04-work', route: '/work', caption: 'Before and after — a draggable comparison slider over the owner’s own job photos' },
      { id: '05-about', route: '/about', caption: 'Chris — the operator, rather than a stock photo of a generic tradesperson' },
      { id: '06-contact', route: '/contact', caption: 'Get a quote — the form keeps every keystroke in localStorage, so a reload never costs the customer their typing' },
    ],
  },

  'sgr-prestige-concept-vercel-app': {
    site: 'https://sgr-prestige-concept.vercel.app',
    targets: [
      { id: '01-hero', route: '/', caption: 'Opening a scroll-scrubbed night sequence: the trailer, the doors, the car coming down the ramp' },
      { id: '02-how-it-works', route: '/', selector: '#how-it-works', caption: 'How it works, written as the steps a customer actually goes through' },
      { id: '03-condition', route: '/', selector: '#condition-report', caption: 'The condition report, the document that settles arguments, shown rather than described' },
      { id: '04-insurance', route: '/', selector: '#insurance', caption: 'Insurance stated as facts, with visible ruled blanks where the owner still has to supply one' },
      { id: '05-gallery', route: '/', selector: '#gallery', caption: 'Gallery, every photograph the owner’s own, re-encoded rather than replaced with stock' },
      { id: '06-quote', route: '/', selector: '#quote', caption: 'Quote, protected by a honeypot and a time-to-submit check instead of the 804 KB of reCAPTCHA the current site ships' },
      { id: '07-transport', route: '/transport/enclosed-car-transport', caption: 'Enclosed car transport, one of six service pages, each written rather than templated' },
    ],
  },

  'eurochem-concept-vercel-app': {
    site: 'https://eurochem-concept.vercel.app',
    targets: [
      { id: '01-hero', route: '/', caption: 'Home — a chemical catalogue that opens with the two questions a grower actually arrives with' },
      { id: '02-products', route: '/products', caption: 'Products — the full range, filterable, with every word taken verbatim from EuroChem’s own labels' },
      { id: '03-fungicide', route: '/products/fungicide', caption: 'Fungicides — one category, with active constituent and pack size on every card' },
      { id: '04-crops', route: '/crops', caption: 'By crop — a navigation aid derived from EuroChem’s own use statements, and labelled as one' },
      { id: '05-product', route: '/product/cppu10-pgr', caption: 'CPPU 10 — the only product with verified APVMA data, because it is the only brochure with readable text' },
      { id: '06-contact', route: '/contact', caption: 'Contact — the real representatives and districts, sourced and dated in the config' },
    ],
  },
};
