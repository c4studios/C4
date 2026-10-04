/**
 * Recapture configs — route-based, full-viewport targets.
 * Each target: { id, route, caption, anchor?, scrollTo?, settle?, action?, desktopOnly?, mobileOnly? }
 * `anchor` scrolls the first element containing that text to near the top.
 */

const ring = async (page) => {
  for (const zone of ['Bonnet and front bar', 'Off-side front wheel', "Driver's door"]) {
    const btn = page.locator('#condition-report button', { hasText: zone }).first();
    if ((await btn.textContent()).includes('Not marked')) { await btn.click(); await page.waitForTimeout(250); }
  }
};

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

  // Re-shot 4 Oct 2026 after the refinement shipped (c44a093): the condition
  // report became a carbon pad and the custody log one column. The pad shots
  // ring three zones with `ring` (only if unmarked: shots on one route share a
  // page); the sign-off shot rings them too, so stage 6 has marks to lay over.
  'sgr-prestige-concept-vercel-app': {
    site: 'https://sgr-prestige-concept.vercel.app',
    targets: [
      { id: '01-hero', route: '/', caption: 'Opening. A scroll-scrubbed night sequence: the trailer, the doors, the car coming down the ramp' },
      { id: '02-what-we-carry', route: '/', selector: '#what-we-carry', caption: 'What goes in the trailer, set out like a consignment docket: six kinds of car and the one thing to tell SGR about each' },
      { id: '03-condition', route: '/', selector: '#condition-report', action: ring, caption: 'The condition report. Ring damage on the car the way a driver does at pickup, or tick it off the list' },
      { id: '04-carbon-copy', route: '/', selector: '#condition-report', caption: 'Lift the top sheet and the customer copy underneath carries every mark in carbon', action: async (page) => {
        await ring(page);
        await page.locator('#condition-report button', { hasText: 'Lift the top sheet' }).first().click();
        await page.waitForTimeout(1600);
      } },
      { id: '05-insurance', route: '/', selector: '#insurance', caption: '“Fully insured” is not a number. Six transporters’ insurance claims quoted word for word, with the cover amount left blank where none is published' },
      { id: '06-custody-log', route: '/', selector: '#how-it-works', caption: 'The custody log. Six stages between the two doors, in order, and what you’re holding at the end of each' },
      { id: '07-sign-off', route: '/', selector: '#how-it-works', caption: 'Delivery and sign-off. The delivery sheet is laid over your pickup copy, carrying the marks you rang further up the page', action: async (page) => {
        await ring(page);
        const bottom = await page.evaluate(() => { const s = document.querySelector('#how-it-works').getBoundingClientRect(); return s.bottom + scrollY; });
        for (let y = bottom - 2400; y < bottom; y += 300) { await page.evaluate((yy) => scrollTo(0, yy), y); await page.waitForTimeout(120); }
        await page.evaluate((yy) => scrollTo(0, yy - innerHeight + 120), bottom);
        await page.waitForTimeout(1500);
      } },
      { id: '08-trailer', route: '/', selector: '#trailer', caption: 'The trailer. The same rig and the same driver from one driveway to the other' },
      { id: '09-who-we-are', route: '/', selector: '#who-we-are', caption: 'Who you’re dealing with. SGR’s own claims set large, each pointing to where the page backs it up' },
      { id: '10-gallery', route: '/', selector: '#gallery', caption: 'The work. Every photograph is SGR’s own, taken on the job' },
      { id: '11-quote', route: '/', selector: '#quote', caption: 'Quote, set as a consignment note: the two ends of the trip and the car. Everything else is a phone call' },
      { id: '12-transport', route: '/transport/enclosed-car-transport', caption: 'Enclosed car transport, one of six service pages, each written rather than templated' },
    ],
  },

  // JK Plumbing concept, re-shot 4 Oct 2026 after the letterpress redesign
  // shipped (50749bd). The second board shot opens another tab of its own.
  'jk-plumbing-tau-vercel-app': {
    site: 'https://jk-plumbing-tau.vercel.app',
    targets: [
      { id: '01-hero', route: '/', caption: 'The problems a customer arrives with, set in wood type to fill the page, and the phone number on a full-width red band' },
      { id: '02-problems', route: '/', selector: '#problems', caption: 'What’s playing up? Pick the problem and the board says what to do right now and what the plumber will do, citing Sydney Water where the fault is theirs' },
      { id: '03-problems-tab', route: '/', selector: '#problems', caption: 'Another tab, another problem: hot water gone cold, what to check first and what happens next', action: async (page) => {
        const tabs = page.locator('#problems [role="tab"]');
        if (await tabs.count() > 2) { await tabs.nth(2).click(); await page.waitForTimeout(500); }
      } },
      { id: '04-services', route: '/', selector: '#services', caption: 'What we do, set in wood type beside the business’s own photos, including camera footage from inside a line' },
      { id: '05-work', route: '/', selector: '#work', caption: 'Our work. The business’s own photos of the ute, the gear and finished jobs, printed in one ink until you hover' },
      { id: '06-areas', route: '/', selector: '#areas', caption: 'Where we work, billed like a poster: Campbelltown first, then the towns around it' },
      { id: '07-contact', route: '/', selector: '#contact', caption: 'Urgent jobs get the phone number. Planned jobs go on a yellow letterbox handbill with tear-off tabs' },
    ],
  },

  // Wooster Core concept, re-shot 4 Oct 2026 after "The Box and its Foam"
  // shipped (1fcf42c). The hero waits for the live print to build a while.
  'wooster-core-vercel-app': {
    site: 'https://wooster-henna.vercel.app',
    targets: [
      { id: '01-lid', route: '/', settle: 7000, caption: 'The lid. A live WebGL print stands in for the box’s line drawing, with the price and contents bottom-left as on the real lid, and the Woo Mount add-on beside the handle kit' },
      { id: '02-in-the-box', route: '/', selector: '#kit', caption: 'In the box. The real kraft tray, photographed from above, beside a packing list priced in Australian dollars' },
      { id: '03-part-lit', route: '/', selector: '#kit', caption: 'Point at a line in the packing list and that part lights up in the tray, with its part number', action: async (page) => {
        const items = page.locator('#kit li, #kit [role="listitem"], #kit button');
        if (await items.count() > 1) { await items.nth(1).hover(); await page.waitForTimeout(600); }
      } },
      { id: '04-specs', route: '/', selector: '#specs', caption: 'Specs, set beside real close-ups of the print: the 0.2 mm layer lines and the stainless washers' },
      { id: '05-ready', route: '/', anchor: 'Ready to ship', caption: 'Ready to ship. The real boxes, and the two kits to add from there' },
      { id: '06-cart', route: '/', caption: 'Add a kit and the cart slides in beside the lid', action: async (page) => {
        await page.evaluate(() => scrollTo(0, 0));
        await page.locator('button', { hasText: 'Add to cart' }).first().click();
        await page.waitForTimeout(900);
      } },
    ],
  },

  // Barry's Drink concept, re-shot 4 Oct 2026 after "The Barry Machine"
  // shipped (09df136). The drop shot presses two buttons so cans fall into the bay.
  // The site asks for 18+ first; captures answer with the site's own key, and the
  // last shot clears it to show the question itself.
  'barrys-drink-concept-vercel-app': {
    site: 'https://barrys-drink-concept.vercel.app',
    storage: { 'barry-concept-age': 'ok' },
    targets: [
      { id: '01-machine', route: '/', caption: 'The machine. Seven flavours and the Mixed 10-Pack lit behind the glass, each with its strength on a segment readout and a round lit button' },
      { id: '02-drop', route: '/', caption: 'Press a button and the can drops into the bay, where it tumbles and settles and can be picked up or thrown', action: async (page) => {
        await page.evaluate(() => scrollTo(0, 0));
        for (const can of ['Watermelon & Lemon', 'Strawberry Smash']) {
          await page.locator(`button[aria-label^="${can}. Drop one"]`).first().click();
          await page.waitForTimeout(900);
        }
        await page.waitForTimeout(1800);
      } },
      { id: '03-in-hand', route: '/', selector: '#in-hand', caption: 'Pick a can up and turn it over in 3D: its base, strength and sizes, with a placeholder where Barry’s publishes no price' },
      { id: '04-founders', route: '/', anchor: 'The Barry Boys, at your local footy club.', caption: 'The four founders on the side of the machine, as manga renders, bringing in Footy Loyals' },
      { id: '05-board', route: '/', anchor: 'Places to grab one, state by state.', caption: 'Stockists on an LED board, state by state, from Barry’s own stockist map on 2 October 2026' },
      { id: '06-shop', route: '/shop', caption: 'The shop as a bank of machines, one for each base: shochu, agave and whisky' },
      { id: '07-mixed-ten', route: '/shop', selector: '#mixed-ten', caption: 'The Mixed 10-Pack, Barry’s own fixed mix, with the one flavour that has no can art yet marked as such' },
      { id: '08-merch', route: '/shop', selector: '#merch', caption: 'Merch, the part of Barry’s store that does sell online, at its own prices as listed on 2 October 2026' },
      { id: '09-footy-loyals', route: '/promos', caption: 'Footy Loyals. Pick your club’s home-ground session, each one hosted by one of the four' },
      { id: '10-points', route: '/promos', anchor: 'How clubs rack up points', caption: 'How clubs rack up points, from 10 to 60, beside Barry’s own campaign poster' },
      { id: '11-who-is-barry', route: '/who-is-barry', caption: 'Who is Barry? The four founders and how it started, in Barry’s own words' },
      { id: '12-stockists', route: '/stockists', caption: 'Find Barry’s. Search a postcode or pick a state on the map' },
      { id: '13-contact', route: '/contact', caption: 'Contact. Pick what it’s about and the form changes to suit. The concept sends nothing, and says so' },
      { id: '14-age-gate', route: '/', caption: 'The first thing the machine asks', action: async (page) => {
        await page.evaluate(() => { sessionStorage.setItem('cm-no-seed', '1'); localStorage.removeItem('barry-concept-age'); });
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(2200);
        await page.evaluate(() => sessionStorage.removeItem('cm-no-seed'));
      } },
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
