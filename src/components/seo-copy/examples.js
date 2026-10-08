/*
 * The example searches on /seo-and-copywriting's board.
 *
 * Everything here is invented, and the page says so beside the board. No
 * other listing names a business, and no title is written like a trading
 * name (8 Oct 2026: three that read like one were reworded): each one is a kind of result that fills
 * page one for a local search (a directory, a quote site, a forum thread),
 * which is the point the SEO guide makes about soft Perth searches. Paths
 * are made up. Postcodes are the suburbs' real ones.
 *
 * The three queries are the shape of the examples in the site's own SEO
 * articles ("electrician joondalup" is word for word from /seo-perth/).
 * `before` is how a small-business result often reads; `after` is the same
 * result rewritten. Both are invented and belong to "Your Business", which
 * is the visitor.
 */

export const YOU = 'Your Business';
export const YOU_SITE = 'yourbusiness.com.au';

export const EXAMPLES = [
  {
    key: 'electrician',
    query: 'electrician joondalup',
    before: {
      path: '?page_id=7',
      title: `Home | ${YOU}`,
      hot: 'Home',
      desc: 'Welcome to our website. We are a leading provider of quality electrical services and solutions.',
      fluff: 'leading provider of quality',
    },
    after: {
      path: 'electrician-joondalup',
      title: `Electrician in Joondalup | ${YOU}`,
      desc: 'Switchboards, lighting and safety switches across Joondalup and the northern suburbs. Send a photo of the job for a quote.',
    },
    others: [
      { kind: 'A trade directory', path: 'electricians/joondalup', title: '10 Best Electricians in Joondalup (2026)' },
      { kind: 'A quote site', path: 'electrical/joondalup-wa', title: 'Joondalup Electricians: Compare 3 Quotes' },
      { kind: 'A franchise', path: 'locations/joondalup', title: 'Electrician Joondalup | Same-Day Callouts' },
      { kind: 'A competitor', path: 'joondalup', title: 'Electrical Work for Homes and Businesses, Joondalup' },
      { kind: 'A review site', path: 'wa/joondalup/electricians', title: 'The Best Electricians Near Joondalup WA' },
      { kind: 'A business directory', path: 'joondalup-wa-6027/electricians', title: 'Electricians in Joondalup WA 6027' },
      { kind: 'A competitor', path: 'services', title: 'Electrician Wanneroo and Joondalup | Solar, Lighting' },
      { kind: 'A forum thread', path: 't/sparky-joondalup', title: 'Anyone recommend a sparky in Joondalup?' },
      { kind: 'A national chain', path: 'find-an-electrician', title: 'Find a Local Electrician Near You' },
      { kind: 'A competitor', path: '', title: 'Home – Electrical Services' },
    ],
  },
  {
    key: 'physio',
    query: 'physio subiaco',
    before: {
      path: '?page_id=7',
      title: `Home | ${YOU}`,
      hot: 'Home',
      desc: 'Welcome to our clinic. We offer a wide range of quality physiotherapy services for all your needs.',
      fluff: 'wide range of quality',
    },
    after: {
      path: 'physio-subiaco',
      title: `Physio in Subiaco | ${YOU}`,
      desc: 'Sports injuries and back pain, treated a short walk from Subiaco station. Book online and see someone this week.',
    },
    others: [
      { kind: 'A health directory', path: 'physiotherapists/subiaco', title: 'Top 10 Physiotherapists in Subiaco (2026)' },
      { kind: 'A booking site', path: 'physio/subiaco-wa', title: 'Book a Physio in Subiaco Today' },
      { kind: 'A clinic chain', path: 'clinics/subiaco', title: 'Physio Subiaco | Open Saturdays' },
      { kind: 'A competitor', path: 'subiaco', title: 'Physiotherapy and Pilates in Subiaco' },
      { kind: 'A review site', path: 'wa/subiaco/physiotherapy', title: 'Best Physiotherapists Near Subiaco WA' },
      { kind: 'A business directory', path: 'subiaco-wa-6008/physiotherapists', title: 'Physiotherapists in Subiaco WA 6008' },
      { kind: 'A competitor', path: 'sports-physio', title: 'Sports Physio Perth | Subiaco and Leederville' },
      { kind: 'A forum thread', path: 't/physio-subiaco', title: 'Good physio around Subiaco for a knee?' },
      { kind: 'A national chain', path: 'find-a-physio', title: 'Find a Physio Near You' },
      { kind: 'A competitor', path: '', title: 'Home – Physiotherapy Clinic' },
    ],
  },
  {
    key: 'accountant',
    query: 'accountant osborne park',
    before: {
      path: '?page_id=7',
      title: `Home | ${YOU}`,
      hot: 'Home',
      desc: 'Welcome! We are a leading accounting firm offering quality financial solutions to meet all your needs.',
      fluff: 'leading accounting firm',
    },
    after: {
      path: 'accountant-osborne-park',
      title: `Accountant in Osborne Park | ${YOU}`,
      desc: 'Tax returns and BAS for small businesses in Osborne Park. Fixed fees, quoted before we start.',
    },
    others: [
      { kind: 'A business directory', path: 'accountants/osborne-park', title: '10 Best Accountants in Osborne Park (2026)' },
      { kind: 'A quote site', path: 'accounting/osborne-park-wa', title: 'Osborne Park Accountants: Compare Quotes' },
      { kind: 'A national firm', path: 'offices/perth', title: 'Accountants Perth | Tax and Advisory' },
      { kind: 'A competitor', path: 'osborne-park', title: 'Accounting and Tax Returns, Osborne Park' },
      { kind: 'A review site', path: 'wa/osborne-park/accountants', title: 'Best Accountants Near Osborne Park WA' },
      { kind: 'A business directory', path: 'osborne-park-wa-6017/accountants', title: 'Accountants in Osborne Park WA 6017' },
      { kind: 'A competitor', path: 'small-business', title: 'Small Business Accountant | Perth North' },
      { kind: 'A forum thread', path: 't/accountant-osborne-park', title: 'Recommendations for an accountant near Osborne Park?' },
      { kind: 'A government register', path: 'find-a-tax-agent', title: 'Find a Registered Tax Agent' },
      { kind: 'A competitor', path: '', title: 'Home – Accounting Services' },
    ],
  },
];

/*
 * The climb: where the example listing sits after each piece of work. Index
 * 0 is the board before any work. These are an illustration, never a
 * forecast; the page says so wherever they appear.
 */
export const RANKS = [11, 11, 8, 5, 3, 1];
export const PAGE_SIZE = 10;
