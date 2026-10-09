/*
 * The example searches on /seo-and-copywriting's results page.
 *
 * Everything here is invented, and the page says so beside it. The other
 * results are stand-ins that name only their kind (a trade directory, a quote
 * site, a forum thread), never a title or a business: that's the kind of result
 * that fills page one for a soft local search, which is the point the SEO guide
 * makes. Their old made-up titles and paths went on 10 Oct 2026, since nothing
 * rendered them after the page was rebuilt.
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
      { kind: 'A trade directory' },
      { kind: 'A quote site' },
      { kind: 'A franchise' },
      { kind: 'A competitor' },
      { kind: 'A review site' },
      { kind: 'A business directory' },
      { kind: 'A competitor' },
      { kind: 'A forum thread' },
      { kind: 'A national chain' },
      { kind: 'A competitor' },
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
      { kind: 'A health directory' },
      { kind: 'A booking site' },
      { kind: 'A clinic chain' },
      { kind: 'A competitor' },
      { kind: 'A review site' },
      { kind: 'A business directory' },
      { kind: 'A competitor' },
      { kind: 'A forum thread' },
      { kind: 'A national chain' },
      { kind: 'A competitor' },
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
      { kind: 'A business directory' },
      { kind: 'A quote site' },
      { kind: 'A national firm' },
      { kind: 'A competitor' },
      { kind: 'A review site' },
      { kind: 'A business directory' },
      { kind: 'A competitor' },
      { kind: 'A forum thread' },
      { kind: 'A government register' },
      { kind: 'A competitor' },
    ],
  },
];

/*
 * The climb: where the example listing sits after each piece of work. Index
 * 0 is the board before any work. These are an illustration, never a
 * forecast; the page says so wherever they appear.
 */
export const RANKS = [11, 11, 8, 5, 3, 1];
