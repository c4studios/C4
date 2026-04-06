/**
 * C4 Studios — Central Pricing Configuration
 * All prices in AUD, excluding GST where applicable.
 * Update prices here — all pages reference this file.
 */

/* ── Web Design Packages ── */
export const webDesignPackages = [
  {
    key: 'starter',
    name: 'Starter',
    price: 1500,
    priceLabel: '$1,500',
    monthlyPrice: 99,
    monthlyLabel: '$99/mo',
    popular: false,
    description: 'A single landing page to establish your online presence.',
    features: [
      'Single landing page',
      'Mobile responsive',
      'Basic SEO setup',
      'Contact form',
      'Google Analytics',
      '1 revision round',
      '3-month post-launch support',
    ],
  },
  {
    key: 'essentials',
    name: 'Essentials',
    price: 2500,
    priceLabel: '$2,500',
    monthlyPrice: 149,
    monthlyLabel: '$149/mo',
    popular: false,
    description: 'A clean multi-page site for growing businesses.',
    features: [
      'Up to 3 pages',
      'Mobile responsive',
      'Basic SEO',
      'Contact form',
      'Analytics + Search Console',
      'Social media links',
      '2 revision rounds',
      '3-month post-launch support',
    ],
  },
  {
    key: 'business',
    name: 'Business',
    price: 4000,
    priceLabel: '$4,000',
    monthlyPrice: 229,
    monthlyLabel: '$229/mo',
    popular: true,
    description: 'The complete package for serious local businesses.',
    features: [
      'Up to 5 pages',
      'Full on-page SEO',
      'Contact form + enquiry routing',
      'Analytics + Search Console',
      'Google Business Profile optimisation',
      'Blog/news section',
      '3 revision rounds',
      '3-month post-launch support',
    ],
  },
  {
    key: 'professional',
    name: 'Professional',
    price: 6500,
    priceLabel: '$6,500',
    monthlyPrice: 349,
    monthlyLabel: '$349/mo',
    popular: false,
    description: 'Advanced features and integrations for growing brands.',
    features: [
      'Up to 8 pages',
      'Custom animations',
      'Booking integration',
      'Newsletter integration',
      'Advanced SEO + local SEO',
      'Blog with categories',
      '4 revision rounds',
      '3-month post-launch support',
    ],
  },
  {
    key: 'premium',
    name: 'Premium',
    price: 10000,
    priceLabel: '$10,000+',
    monthlyPrice: 499,
    monthlyLabel: '$499/mo',
    popular: false,
    description: 'Full-scale digital platform with e-commerce and custom functionality.',
    features: [
      'Up to 15 pages',
      'E-commerce / payments',
      'Client portal',
      'Custom database',
      'Advanced animations (GSAP, 3D)',
      'Multi-language',
      'Priority build',
      '5 revision rounds',
      '3-month post-launch support',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: null,
    priceLabel: 'Custom Quote',
    monthlyPrice: null,
    monthlyLabel: 'Custom',
    popular: false,
    description: 'Bespoke web applications built entirely around your business.',
    features: [
      'Unlimited pages',
      'Full custom application',
      'API integrations',
      'Automation workflows',
      'Auth systems',
      'Admin dashboards',
      '3-month post-launch support',
    ],
  },
];

/* ── Subscription Info ── */
export const subscriptionInfo = {
  monthsToOwnership: {
    starter: 30,
    essentials: 34,
    business: 35,
    professional: 37,
    premium: 40,
  },
  maintenanceRate: 79,
  maintenanceLabel: '$79/mo',
  howItWorks: 'No large upfront cost. We build, host, and maintain your site. You pay monthly.',
  whatsIncluded: 'Hosting, SSL, security, uptime monitoring, 1 content update/month.',
  ownership: 'After paying 2\u00D7 the outright price, you own everything. Or buy out early.',
  cancellation: '6-month minimum, then 30 days notice.',
};

/* ── Web Design Add-Ons ── */
export const webDesignAddOns = [
  { name: 'Additional page', price: 250 },
  { name: 'Advanced form', price: 300 },
  { name: 'Scroll animation (per section)', price: 200 },
  { name: 'GSAP page transitions', price: 500 },
  { name: 'Parallax effect', price: 300 },
  { name: 'Payment integration', price: 600 },
  { name: 'Booking system', price: 400 },
  { name: 'Newsletter integration', price: 250 },
  { name: 'Blog/CMS', price: 400 },
  { name: 'Image gallery', price: 200 },
  { name: 'Testimonials section', price: 150 },
  { name: 'FAQ section', price: 150 },
  { name: 'Google Maps', price: 100 },
  { name: 'Live chat', price: 200 },
  { name: 'Social feed', price: 200 },
  { name: 'Video background', price: 250 },
  { name: 'Custom 404', price: 100 },
  { name: 'Cookie consent', price: 100 },
  { name: 'Accessibility (WCAG)', price: 500 },
  { name: 'Multi-language', price: 800, suffix: '+' },
  { name: 'Speed optimisation', price: 400 },
  { name: 'SSL setup', price: 100 },
  { name: 'Domain + DNS', price: 100 },
  { name: 'Business email setup', price: 150 },
  { name: 'Logo animation', price: 350 },
  { name: 'Copywriting (per page)', price: 200 },
];

/* ── Branding Packages ── */
export const brandingPackages = [
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
    price: 3200,
    priceLabel: '$3,200',
    savings: 'Save $800',
    popular: false,
    description: 'Everything you need to launch your online presence.',
    includes: [
      { service: 'Web Design', detail: 'Essentials website (3 pages)' },
      { service: 'Branding', detail: 'Logo Only' },
      { service: 'SEO', detail: 'SEO Foundation' },
      { service: 'Social', detail: '10 social media posts' },
      { service: 'Support', detail: '3-month post-launch support' },
    ],
  },
  {
    key: 'business-builder',
    name: 'The Business Builder',
    price: 6500,
    priceLabel: '$6,500',
    savings: 'Save $1,200',
    popular: true,
    description: 'A complete business package with branding and photography.',
    includes: [
      { service: 'Web Design', detail: 'Business website (5 pages)' },
      { service: 'Branding', detail: 'Brand Essentials' },
      { service: 'SEO', detail: 'SEO Foundation' },
      { service: 'C4 Lens', detail: 'Business Branding Shoot' },
      { service: 'Social', detail: '20 social media posts' },
      { service: 'Support', detail: '3-month post-launch support' },
    ],
  },
  {
    key: 'full-c4',
    name: 'The Full C4',
    price: 12000,
    priceLabel: '$12,000+',
    savings: 'Save $2,500+',
    popular: false,
    description: 'The complete C4 Studios experience for ambitious brands.',
    includes: [
      { service: 'Web Design', detail: 'Professional website (8 pages)' },
      { service: 'Branding', detail: 'Full Brand Identity' },
      { service: 'SEO', detail: 'SEO Growth (3 months)' },
      { service: 'C4 Lens', detail: 'Content Creation Package' },
      { service: 'Social', detail: 'Social Growth (3 months)' },
      { service: 'Support', detail: '3-month post-launch support' },
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
    title: 'Web Design & Development',
    description: 'Custom websites and web applications built with modern technology.',
    startingFrom: '$1,500',
    route: '/services/web-design',
    icon: 'globe',
  },
  {
    key: 'branding',
    title: 'Branding & Identity',
    description: 'Logos, brand systems, and visual identity that set you apart.',
    startingFrom: '$500',
    route: '/services/branding',
    icon: 'palette',
  },
  {
    key: 'c4-lens',
    title: 'C4 Lens',
    description: 'Professional photography and videography for your brand.',
    startingFrom: '$350',
    route: '/services/c4-lens',
    icon: 'camera',
  },
  {
    key: 'seo',
    title: 'SEO & Search',
    description: 'Technical SEO, content strategy, and search dominance.',
    startingFrom: '$800',
    route: '/services/seo',
    icon: 'search',
  },
  {
    key: 'automation',
    title: 'Automation & AI',
    description: 'Workflow automation, AI agents, and custom integrations.',
    startingFrom: '$1,500',
    route: '/services/automation',
    icon: 'zap',
  },
  {
    key: 'social-media',
    title: 'Social Media & Content',
    description: 'Content creation, community management, and social strategy.',
    startingFrom: '$600/mo',
    route: '/services/social-media',
    icon: 'share2',
  },
];

/* ── Shared Constants ── */
export const ASTERISK_CLAUSE = 'All prices are starting prices based on defined scope. If work exceeds the selected package scope, we\u2019ll communicate immediately and pause until we agree on revised pricing. No surprises, ever.';

export const GST_NOTE = 'All prices in AUD, excluding GST where applicable.';

export const INDUSTRY_SURCHARGE_NOTE = 'Professional services industries (legal, financial, medical) may incur a 15\u201320% surcharge due to compliance and regulatory requirements. This will be discussed during your discovery call.';

export const CTA_TEXT = 'Book a Free Discovery Call';
export const CTA_ROUTE = '/StartProject';
