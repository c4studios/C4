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
};
