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
};
