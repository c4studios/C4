/**
 * C4 Studios — Central Pricing Configuration
 * All prices in AUD, excluding GST where applicable.
 * Update prices here — all pages reference this file.
 */

/* ── Web Design Packages ── */
export const webDesignPackages = [
  {
    key: 'starter',
    name: 'Landing Page',
    price: 500,
    priceLabel: '$500',
    monthlyPrice: 49,
    monthlyLabel: '$49/mo',
    popular: false,
    description: 'A focused one-page website for new offers, campaigns, or simple service businesses.',
    features: [
      'Single focused landing page',
      'Client-supplied copy and images',
      'Mobile responsive',
      'Contact form',
      'Basic SEO setup',
      'Analytics setup',
      '1 revision round',
      '14-day launch warranty',
    ],
  },
  {
    key: 'brochure',
    name: 'Brochure Site',
    price: 800,
    priceLabel: '$800',
    monthlyPrice: 69,
    monthlyLabel: '$69/mo',
    popular: false,
    description: 'A straightforward 2-5 page website for small businesses that need the essentials online.',
    features: [
      '2-5 simple brochure pages',
      'Shared design system',
      'Client-supplied copy and images',
      'Mobile responsive',
      'Contact form',
      'Basic SEO setup',
      'Analytics + Search Console',
      '1 revision round',
      '14-day launch warranty',
    ],
  },
  {
    key: 'business',
    name: 'Business Website',
    price: 1500,
    priceLabel: '$1,500',
    monthlyPrice: 99,
    monthlyLabel: '$99/mo',
    popular: true,
    description: 'A stronger small-business site with more polish, content structure, and conversion focus.',
    features: [
      'Up to 6 pages',
      'Mobile responsive',
      'Conversion-focused page structure',
      'Contact form + enquiry routing',
      'Analytics + Search Console',
      'Google Business Profile links',
      '2 revision rounds',
      '30-day launch warranty',
    ],
  },
  {
    key: 'custom',
    name: 'Custom Website',
    price: 2500,
    priceLabel: '$2,500',
    monthlyPrice: 149,
    monthlyLabel: '$149/mo',
    popular: false,
    description: 'A more tailored marketing website with richer sections, stronger SEO, and flexible content.',
    features: [
      'Up to 8 pages',
      'Custom page sections',
      'Advanced on-page SEO',
      'Blog or CMS foundation',
      'Lead capture or newsletter setup',
      '3 revision rounds',
      '30-day launch warranty',
    ],
  },
  {
    key: 'commerce-starter',
    name: 'Ecommerce Store',
    price: 3500,
    priceLabel: '$3,500',
    monthlyPrice: 199,
    monthlyLabel: '$199/mo',
    popular: false,
    description: 'A practical online store starting point for simple catalogues and checkout flows.',
    features: [
      'Simple ecommerce storefront',
      'Up to 20 products loaded',
      'Standard checkout setup',
      'Basic shipping and tax rules',
      'Order notification emails',
      '2 revision rounds',
      '30-day launch warranty',
    ],
  },
  {
    key: 'web-application',
    name: 'Web App Starter',
    price: 4500,
    priceLabel: '$4,500',
    monthlyPrice: 249,
    monthlyLabel: '$249/mo',
    popular: false,
    description: 'An MVP-level web app starting point for one clear portal, dashboard, workflow, or tool.',
    features: [
      'One core app workflow',
      'Basic login or portal foundation',
      'Database/content model foundation',
      'Simple dashboard or user view',
      'API/integration planning',
      '3 revision rounds',
      '30-day launch warranty',
    ],
  },
  {
    key: 'growth',
    name: 'Growth Build',
    price: 7500,
    priceLabel: '$7,500',
    monthlyPrice: 399,
    monthlyLabel: '$399/mo',
    popular: false,
    description: 'A larger ecommerce, content, or web-app build with more integrations and moving parts.',
    features: [
      'Proposal-scoped ecommerce or app build',
      'Up to 12 pages or key screens',
      'Expanded catalogue or custom workflow',
      'API/integration allowance',
      'CMS/admin foundation',
      '4 revision rounds',
      '60-day launch warranty',
    ],
  },
  {
    key: 'platform',
    name: 'Custom Platform',
    price: 10000,
    priceLabel: '$10,000+',
    monthlyPrice: 499,
    monthlyLabel: '$499/mo',
    popular: false,
    description: 'A serious custom platform, advanced store, SaaS-style app, or rebuild with complex scope.',
    features: [
      'Proposal-scoped platform build',
      'Large product catalogues',
      'Advanced ecommerce or SaaS logic',
      'Client portals or login areas',
      'Inventory or POS sync',
      'Custom dashboards/admin tools',
      'Automation or AI integration',
      '5 revision rounds',
      '90-day launch warranty',
    ],
  },
];

export const webPricingGuides = [
  {
    key: 'base-websites',
    label: 'Base Websites',
    range: '$500-$2,500',
    description: '$500 landing pages and $800 brochure sites stay lean: supplied content, simple structure, and clearly defined revision rounds.',
  },
  {
    key: 'ecommerce',
    label: 'Ecommerce',
    range: 'From $3,500',
    description: 'Starter stores cover up to 20 products, standard checkout, basic shipping/tax rules, and order notifications.',
  },
  {
    key: 'web-applications',
    label: 'Web App Starters',
    range: 'From $4,500',
    description: 'MVP apps start with one core workflow. Portals, dashboards, roles, integrations, and admin tools scale from there.',
  },
];

export const webPackageSections = [
  {
    heading: 'Base Websites',
    description: 'Landing pages, brochure sites, and custom marketing sites for businesses that need a strong public-facing presence.',
    packages: webDesignPackages.filter((pkg) => ['starter', 'brochure', 'business', 'custom'].includes(pkg.key)),
  },
  {
    heading: 'Ecommerce',
    description: 'Online stores start simple, then scale with catalogue size, fulfilment rules, integrations, and custom shopping logic.',
    packages: webDesignPackages.filter((pkg) => pkg.key === 'commerce-starter'),
  },
  {
    heading: 'Apps & Larger Builds',
    description: 'MVP web apps, growth builds, and custom platforms for work that needs workflows, dashboards, portals, or complex systems.',
    packages: webDesignPackages.filter((pkg) => ['web-application', 'growth', 'platform'].includes(pkg.key)),
  },
];

export const webScopeNotes = [
  {
    title: 'Entry scope stays lean',
    points: [
      '$500 landing pages and $800 brochure sites assume approved copy, images, and brand assets are supplied before build.',
      '$100 additional page pricing means a simple matching content page. New custom layouts or complex sections are quoted separately.',
    ],
  },
  {
    title: 'Ecommerce starts simple',
    points: [
      '$3,500 stores cover up to 20 products, standard checkout, basic shipping/tax rules, and order notifications.',
      'POS sync, subscriptions, memberships, advanced shipping, large catalogues, or custom product logic move into add-ons or larger tiers.',
    ],
  },
  {
    title: 'Apps are MVP-first',
    points: [
      '$4,500 web apps are for one clear workflow with a defined data model and a simple dashboard, portal, or user area.',
      'Roles, permissions, client portals, admin tooling, AI, automations, and complex integrations are add-ons or proposal scope.',
    ],
  },
  {
    title: 'Usually not included',
    points: [
      'Domain renewals, hosting/platform subscriptions, paid plugins/apps, payment processing fees, stock assets, email hosting, and ad spend are third-party costs.',
      'Copywriting, branding, photography, and videography are separate unless they are added to the project or included in a bundle.',
    ],
  },
  {
    title: 'Project terms',
    points: [
      'Most projects use a deposit to book the work, then progress or final payment before launch.',
      'Launch warranties cover fixes to agreed scope. New content, new features, and ongoing changes move to support plans or add-ons.',
    ],
  },
];

/* ── Subscription Info ── */
export const subscriptionInfo = {
  monthsToOwnership: {
    starter: 21,
    brochure: 24,
    business: 31,
    custom: 34,
    'commerce-starter': 36,
    'web-application': 37,
    growth: 38,
    platform: 41,
  },
  maintenanceRate: 79,
  maintenanceLabel: '$79/mo',
  howItWorks: 'Lower upfront cost. We build, host, and maintain your site while you pay monthly.',
  whatsIncluded: 'Hosting, SSL, security, uptime monitoring, 1 content update/month.',
  ownership: 'Ownership timing is based on the package and monthly price, generally around 2x the outright price. Or buy out early.',
  cancellation: '6-month minimum, then 30 days notice.',
};

/* ── Web Design Add-Ons ── */
export const webDesignAddOns = [
  { name: 'Additional page', price: 100 },
  { name: '3-page pack', price: 250 },
  { name: '5-page pack', price: 400 },
  { name: 'Copywriting package', price: 500 },
  { name: 'Branding add-on', price: 400 },
  { name: 'Photography + videography add-on', price: 750 },
  { name: 'Online booking / appointments', price: 400 },
  { name: 'AI chatbot', price: 1500 },
  { name: 'Client portal / login area', price: 1000 },
  { name: 'Advanced form', price: 300 },
  { name: 'Newsletter integration', price: 250 },
  { name: 'Blog/CMS', price: 500 },
  { name: 'Product catalogue setup', price: 500 },
  { name: 'Extra product batch (up to 25)', price: 300 },
  { name: 'Shipping/tax rules', price: 300 },
  { name: 'Payment gateway setup', price: 600 },
  { name: 'Inventory or POS sync', price: 1200, suffix: '+' },
  { name: 'Custom API integration', price: 1000, suffix: '+' },
  { name: 'Admin dashboard', price: 1500, suffix: '+' },
  { name: 'Image gallery', price: 200 },
  { name: 'Testimonials section', price: 100 },
  { name: 'FAQ section', price: 100 },
  { name: 'Basic animation pass', price: 300 },
  { name: 'GSAP page transitions', price: 500 },
  { name: 'Parallax effect', price: 300 },
  { name: 'Google Maps', price: 100 },
  { name: 'Live chat', price: 200 },
  { name: 'Social feed', price: 200 },
  { name: 'Video background', price: 250 },
  { name: 'SEO foundations', price: 500 },
  { name: 'Google Business Profile setup', price: 200 },
  { name: 'Custom 404', price: 100 },
  { name: 'Cookie consent', price: 100 },
  { name: 'Accessibility (WCAG)', price: 500 },
  { name: 'Multi-language', price: 800, suffix: '+' },
  { name: 'Speed optimisation', price: 400 },
  { name: 'SSL setup', price: 100 },
  { name: 'Domain + DNS', price: 100 },
  { name: 'Business email setup', price: 150 },
  { name: 'Logo animation', price: 350 },
];

/* ── Branding Packages ── */
export const brandingPackages = [
  {
    key: 'brand-core',
    name: 'Core',
    price: 250,
    priceLabel: '$250',
    popular: false,
    description: 'A simple logo to get your brand started.',
    features: [
      '2 initial concepts',
      '1 revision round',
      'Final files: PNG + SVG',
      'Primary brand colour',
    ],
  },
  {
    key: 'logo-only',
    name: 'Logo Only',
    price: 500,
    priceLabel: '$500',
    popular: false,
    description: 'A professional logo to anchor your visual identity.',
    features: [
      '3 initial concepts',
      '2 revision rounds',
      'Final files: SVG, PNG, PDF (colour + mono)',
      'Brand colour palette (3\u20135 colours)',
    ],
  },
  {
    key: 'brand-essentials',
    name: 'Brand Essentials',
    price: 1200,
    priceLabel: '$1,200',
    popular: true,
    description: 'Everything you need to present a cohesive brand across print and digital.',
    features: [
      'Logo design (3 concepts, 3 revisions)',
      'Colour palette + typography selection',
      'Business card design',
      'Social media profile/cover templates',
      'Basic brand guidelines PDF (2\u20134 pages)',
    ],
  },
  {
    key: 'full-brand',
    name: 'Full Brand Identity',
    price: 2500,
    priceLabel: '$2,500+',
    popular: false,
    description: 'A complete identity system for brands that demand consistency at scale.',
    features: [
      'Logo design (5 concepts, 4 revisions)',
      'Complete colour system + typography hierarchy',
      'Business card + letterhead + email signature',
      'Social media template suite',
      'Brand guidelines document (10+ pages)',
      'Branded presentation template',
      'Signage/merch mockups',
    ],
  },
];

/* ── C4 Lens Packages ── */
export const c4LensPackages = [
  {
    key: 'mini-session',
    name: 'Core',
    price: 200,
    priceLabel: '$200',
    popular: false,
    description: 'A quick headshot or product shoot for essentials.',
    features: [
      '30-minute shoot',
      '1 location',
      '5 edited digital images',
      'Online gallery delivery',
    ],
  },
  {
    key: 'portrait',
    name: 'Portrait Session',
    price: 350,
    priceLabel: '$350',
    popular: false,
    description: 'Professional portraits for personal or business use.',
    features: [
      '1-hour shoot',
      '1 location',
      '15 edited digital images',
      'Online gallery delivery',
    ],
  },
  {
    key: 'business-branding',
    name: 'Business Branding',
    price: 650,
    priceLabel: '$650',
    popular: true,
    description: 'Headshots and workspace photography for your brand.',
    features: [
      '2-hour shoot',
      'Up to 2 locations',
      '30 edited digital images',
      'Headshots + workspace/lifestyle shots',
      'Online gallery delivery',
    ],
  },
  {
    key: 'content-creation',
    name: 'Content Creation',
    price: 1200,
    priceLabel: '$1,200',
    popular: false,
    description: 'Photo and video content for social media and marketing.',
    features: [
      'Half-day shoot (4 hours)',
      'Photo + video',
      '40 edited photos',
      '2 short-form videos (30\u201360s each)',
      'Online gallery + video file delivery',
    ],
  },
  {
    key: 'full-production',
    name: 'Full Production',
    price: 2500,
    priceLabel: '$2,500+',
    popular: false,
    description: 'Complete photo and video production for campaigns and launches.',
    features: [
      'Full-day shoot (8 hours)',
      'Photo + video',
      '60+ edited photos',
      '4 short-form + 1 long-form video (up to 3 min)',
      'Colour grading, sound design, motion graphics',
      'Online gallery + video file delivery',
    ],
  },
];

/* ── SEO Packages ── */
export const seoPackages = [
  {
    key: 'seo-core',
    name: 'Core',
    price: 400,
    priceLabel: '$400',
    priceSuffix: 'one-off',
    popular: false,
    description: 'Essential SEO checks and fixes to get found online.',
    features: [
      'Technical SEO health check',
      'Meta titles & descriptions (up to 3 pages)',
      'Google Search Console setup',
      'Sitemap submission',
    ],
  },
  {
    key: 'foundation',
    name: 'Foundation',
    price: 800,
    priceLabel: '$800',
    priceSuffix: 'one-off',
    popular: false,
    description: 'A solid technical SEO base for your website.',
    features: [
      'Technical SEO audit',
      'On-page optimisation (up to 5 pages)',
      'Meta titles, descriptions, schema markup',
      'Google Search Console + Analytics setup',
      'Sitemap + robots.txt configuration',
      'Keyword research report (20 keywords)',
    ],
  },
  {
    key: 'growth',
    name: 'Growth',
    price: 500,
    priceLabel: '$500/mo',
    priceSuffix: 'min. 3 months',
    popular: true,
    description: 'Ongoing SEO growth with content and monitoring.',
    features: [
      'Everything in Foundation',
      'Monthly keyword tracking + reporting',
      '2 new optimised blog posts/month',
      'Backlink opportunity identification',
      'Monthly performance report',
      'Ongoing technical SEO monitoring',
    ],
  },
  {
    key: 'dominate',
    name: 'Dominate',
    price: 1000,
    priceLabel: '$1,000/mo',
    priceSuffix: 'min. 6 months',
    popular: false,
    description: 'Aggressive SEO strategy to own your market.',
    features: [
      'Everything in Growth',
      '4 blog posts/month',
      'Active backlink building',
      'Competitor analysis (quarterly)',
      'Local SEO optimisation (GBP management)',
      'Bi-weekly strategy calls',
    ],
  },
];

/* ── Automation & AI Packages ── */
export const automationPackages = [
  {
    key: 'automation-core',
    name: 'Core',
    price: 750,
    priceLabel: '$750',
    popular: false,
    description: 'A single automation to streamline one key workflow.',
    features: [
      '1 automated workflow',
      'Integration of up to 2 tools',
      'Basic documentation',
      '14-day support window',
    ],
  },
  {
    key: 'workflow-starter',
    name: 'Workflow Starter',
    price: 1500,
    priceLabel: '$1,500',
    popular: false,
    description: 'A single automated workflow to eliminate repetitive tasks.',
    features: [
      '1 automated workflow (n8n or custom)',
      'Integration of up to 3 tools/platforms',
      'Documentation + training session',
      '30-day support window',
    ],
  },
  {
    key: 'workflow-pro',
    name: 'Workflow Pro',
    price: 3500,
    priceLabel: '$3,500',
    popular: true,
    description: 'Multiple workflows with monitoring and error handling.',
    features: [
      'Up to 3 automated workflows',
      'Integration of up to 8 tools/platforms',
      'Error handling + monitoring setup',
      'Documentation + 2 training sessions',
      '60-day support window',
    ],
  },
  {
    key: 'custom-ai',
    name: 'Custom AI',
    price: 5000,
    priceLabel: '$5,000+',
    popular: false,
    description: 'Bespoke AI agents, chatbots, and data pipelines.',
    features: [
      'Custom AI agent/chatbot',
      'Data pipeline setup',
      'API integrations',
      'Full documentation',
      '90-day support window',
      'Ongoing maintenance available',
    ],
  },
];

/* ── Social Media Packages ── */
export const socialMediaPackages = [
  {
    key: 'social-core',
    name: 'Core',
    price: 350,
    priceLabel: '$350/mo',
    popular: false,
    description: 'Basic social media presence to keep your brand visible.',
    features: [
      'Content calendar (8 posts/month)',
      'Graphic design for all posts',
      '1 platform managed',
      'Monthly summary report',
    ],
  },
  {
    key: 'social-starter',
    name: 'Social Starter',
    price: 600,
    priceLabel: '$600/mo',
    popular: false,
    description: 'Consistent content to keep your brand active on social.',
    features: [
      'Content calendar (12 posts/month)',
      'Graphic design for all posts',
      'Caption writing',
      '2 platforms managed',
      'Monthly analytics report',
    ],
  },
  {
    key: 'social-growth',
    name: 'Social Growth',
    price: 1200,
    priceLabel: '$1,200/mo',
    popular: true,
    description: 'Strategic content with video and community management.',
    features: [
      'Content calendar (20 posts/month)',
      'Graphic design + short-form video (4 reels/month)',
      'Caption writing + hashtag strategy',
      '3 platforms managed',
      'Community management',
      'Monthly analytics report + strategy review',
    ],
  },
  {
    key: 'full-presence',
    name: 'Full Online Presence',
    price: 2000,
    priceLabel: '$2,000/mo',
    popular: false,
    description: 'Complete online presence management across all channels.',
    features: [
      'Content calendar (30 posts/month)',
      'Graphic design + short-form video (8 reels/month)',
      'Caption writing + hashtag + content strategy',
      'All major platforms managed',
      'Community management',
      'GBP + review response management',
      'Monthly strategy call + detailed reporting',
    ],
  },
];

/* ── Bundle Deals ── */
export const bundlePackages = [
  {
    key: 'launch',
    name: 'The Launch Bundle',
    price: 2300,
    priceLabel: '$2,300',
    savings: 'Save $300',
    popular: false,
    description: 'Everything you need to launch your online presence.',
    includes: [
      { service: 'Web Design', detail: 'Brochure Site (2-5 pages)' },
      { service: 'Branding', detail: 'Logo Only' },
      { service: 'SEO', detail: 'SEO Foundation' },
      { service: 'Social', detail: '10 social media posts' },
      { service: 'Support', detail: '30-day launch warranty' },
    ],
  },
  {
    key: 'business-builder',
    name: 'The Business Builder',
    price: 4800,
    priceLabel: '$4,800',
    savings: 'Save $650+',
    popular: true,
    description: 'A complete business package with branding and photography.',
    includes: [
      { service: 'Web Design', detail: 'Business Website ($1,500 package)' },
      { service: 'Branding', detail: 'Brand Essentials' },
      { service: 'SEO', detail: 'SEO Foundation' },
      { service: 'C4 Lens', detail: 'Business Branding Shoot' },
      { service: 'Social', detail: '20 social media posts' },
      { service: 'Support', detail: '30-day launch warranty' },
    ],
  },
  {
    key: 'full-c4',
    name: 'The Full C4',
    price: 14000,
    priceLabel: '$14,000+',
    savings: 'Save $2,300+',
    popular: false,
    description: 'The complete C4 Studios experience for ambitious brands.',
    includes: [
      { service: 'Web Design', detail: 'Growth Build ($7,500 web/ecommerce/app scope)' },
      { service: 'Branding', detail: 'Full Brand Identity' },
      { service: 'SEO', detail: 'SEO Growth (3 months)' },
      { service: 'C4 Lens', detail: 'Content Creation Package' },
      { service: 'Social', detail: 'Social Growth (3 months)' },
      { service: 'Support', detail: '60-day launch warranty' },
    ],
  },
];

/* ── Support Plans ── */
export const supportPlans = [
  {
    key: 'basic-care',
    name: 'Basic Care',
    price: 99,
    priceLabel: '$99/mo',
    popular: false,
    description: 'Essential monitoring and maintenance.',
    features: [
      'Hosting monitoring',
      'Security patches',
      '1 minor update/month (15 min)',
      'Email support',
    ],
  },
  {
    key: 'standard-care',
    name: 'Standard Care',
    price: 179,
    priceLabel: '$179/mo',
    popular: true,
    description: 'Active support with regular updates.',
    features: [
      'Everything in Basic Care',
      '2 updates/month (30 min each)',
      'Phone support',
      'Monthly report',
    ],
  },
  {
    key: 'premium-care',
    name: 'Premium Care',
    price: 299,
    priceLabel: '$299/mo',
    popular: false,
    description: 'Priority support with strategic guidance.',
    features: [
      'Everything in Standard Care',
      'Priority response',
      '4 updates/month (30 min each)',
      'Quarterly strategy call',
    ],
  },
];

export const supportTickets = [
  { name: 'Minor update (text/image swap, < 15 min)', price: 75 },
  { name: 'Medium fix (form issue, layout tweak, 15\u201360 min)', price: 150 },
  { name: 'Major fix (functionality repair, 1\u20133 hrs)', price: 350 },
  { name: 'Domain/DNS/hosting troubleshooting', price: 100 },
  { name: 'Email setup/troubleshooting', price: 100 },
  { name: 'Emergency fix (site down, same-day)', price: 250 },
];

export const boosterPacks = [
  { name: 'Quick Fix', price: 150, detail: 'Up to 1 hour — minor tweaks, content updates, small bug fixes' },
  { name: 'Feature Add', price: 400, detail: 'Up to 3 hours — new section, form, integration, or small feature' },
  { name: 'Page Add', price: 250, detail: '1 new page designed and built to match existing site' },
  { name: 'Priority Support', price: 200, detail: 'Same-day response, 2 support requests/month (up to 1hr each)', suffix: '/mo' },
  { name: 'SEO Boost', price: 400, detail: 'One-off SEO audit + optimisation for up to 3 pages' },
  { name: 'Content Refresh', price: 350, detail: 'Full content update for up to 3 pages (copy + images)' },
  { name: 'Emergency Fix', price: 250, detail: 'Same-day critical fix (site down, broken functionality)' },
];

/* ── Service Categories (for overview page) ── */
export const serviceCategories = [
  {
    key: 'web-design',
    title: 'Websites & Ecommerce',
    description: 'Landing pages, brochure sites, ecommerce stores, and web app starters priced by scope.',
    startingFrom: '$500 / $3,500 ecommerce',
    route: '/WebDesignPricing',
    icon: 'globe',
  },
  {
    key: 'branding',
    title: 'Branding & Identity',
    description: 'Logos, brand systems, and visual identity that set you apart.',
    startingFrom: '$250',
    route: '/BrandingPricing',
    icon: 'palette',
  },
  {
    key: 'c4-lens',
    title: 'C4 Lens',
    description: 'Professional photography and videography for your brand.',
    startingFrom: '$200',
    route: '/C4LensPricing',
    icon: 'camera',
  },
  {
    key: 'seo',
    title: 'SEO & Search',
    description: 'Technical SEO, content strategy, and search dominance.',
    startingFrom: '$400',
    route: '/SEOPricing',
    icon: 'search',
  },
  {
    key: 'automation',
    title: 'Automation & AI',
    description: 'Workflow automation, AI agents, and custom integrations.',
    startingFrom: '$750',
    route: '/AutomationPricing',
    icon: 'zap',
  },
  {
    key: 'social-media',
    title: 'Social Media & Content',
    description: 'Content creation, community management, and social strategy.',
    startingFrom: '$350/mo',
    route: '/SocialMediaPricing',
    icon: 'share2',
  },
];

/* ── Shared Constants ── */
export const ASTERISK_CLAUSE = 'All prices are starting prices based on defined scope. Landing pages start at $500, brochure sites at $800, ecommerce stores at $3,500, and web app starters at $4,500. Larger builds scale with pages, catalogue size, integrations, content volume, and custom functionality.';

export const GST_NOTE = 'All prices in AUD, excluding GST where applicable.';

export const INDUSTRY_SURCHARGE_NOTE = 'Professional services industries (legal, financial, medical) may incur a 15\u201320% surcharge due to compliance and regulatory requirements. This will be discussed during your discovery call.';

export const CTA_TEXT = 'Book a Free Discovery Call';
export const CTA_ROUTE = '/start';
