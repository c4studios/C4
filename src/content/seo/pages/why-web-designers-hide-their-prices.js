/**
 * Article — Why web designers hide their prices.
 *
 * Industry-practice piece. It deliberately does NOT try to rank for
 * "how much does a website cost" — that query belongs to
 * /how-much-does-a-website-cost-perth, which holds the actual numbers.
 * This one owns the "why won't anyone tell me" query and funnels there.
 *
 * Every figure quoted is a real published tier from src/data/pricing.js
 * (Landing $500, Brochure $800, Business $1,500, ecommerce from $3,500,
 * automation Core $750, C4Sight half day from $800, Private AI from $1,600).
 * No industry averages, no invented benchmarks.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['Why web designers', 'hide their prices'],
    intro: [
      'Ring five studios about the same website and you will get five versions of “it depends”, no numbers, and an invitation to a discovery call. There are real reasons for that, and only some of them are about you.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'Most agencies hide prices because knowing your budget first is worth money to them, because a public number invites comparison they would rather avoid, and because scope on a website genuinely is elastic. The first two are commercial choices dressed up as the third.',
      ],
    },

    {
      kind: 'image',
      src: '/insights/why-web-designers-hide-their-prices.jpg',
      width: 1360,
      height: 1699,
      alt: 'A printed invoice on an office desk. Every line item is readable but every figure in the amount column, and the total, has been scribbled out in blue biro.',
      caption: 'You can read every line. Just not what any of it costs.'
    },

    {
      kind: 'list',
      label: 'The reasons',
      heading: 'Three reasons the number is missing',
      intro: 'Having been on the inside of this, here they are in the order they actually matter.',
      items: [
        {
          title: 'They want your budget first',
          text: 'If you say the number before they do, the quote can be shaped to it. Two businesses asking for the same five-page site can be quoted thousands apart, entirely on what each one let slip in the first call.',
        },
        {
          title: 'A public price can be compared',
          text: 'A number on a page can sit next to somebody else’s number. Quote on request means every conversation starts fresh, with no reference point except the one they supply.',
        },
        {
          title: 'Scope really is elastic',
          text: 'This part is honest. A “website” can be one page or forty, with or without a booking system, a shop, a calculator. Pricing that range in one figure is genuinely difficult — which is why it makes such a convenient reason to publish nothing at all.',
        },
      ],
    },

    {
      kind: 'prose',
      label: 'The tell',
      heading: 'What “it depends” is protecting',
      body: [
        '“It depends” is true. It is also doing a job. Notice which direction the uncertainty runs: an agency that genuinely could not estimate would have no idea whether a job was worth taking, yet the same agency will happily tell you within ten minutes whether you are a fit for them. They can estimate. They have estimated. They have simply decided not to say.',
        'The tell is what happens when you ask for a range rather than a quote. Anyone who has done this work more than twice can give you a range in a sentence. If a studio will not put a floor and a ceiling on a project they have just spent half an hour scoping, the reticence is not about accuracy.',
      ],
    },

    {
      kind: 'quote',
      quote: 'A studio that cannot give you a range has either never done the job before, or has decided a range is not in their interest. Both are worth knowing.',
    },

    {
      kind: 'prose',
      label: 'Our side',
      heading: 'What happened when we published ours',
      body: [
        'We put every price on the site: landing pages at $500, a brochure site at $800, a business website at $1,500, online stores from $3,500. Automations start at $750, a half day of AI training from $800, [private AI](/private-ai) from $1,600 installed.',
        'Two things followed, and neither was the disaster the received wisdom predicts. Fewer enquiries arrived, and a much higher share of them were real. People who cannot spend $1,500 now find that out on the pricing page instead of on a call, which saves them an afternoon and saves us one. The enquiries that do come through open with what they want rather than what it might cost.',
        'The trade is genuine and worth stating plainly. Publishing a number means occasionally losing work to someone cheaper before ever getting to explain the difference. That has happened. It is still the better arrangement, because the alternative is spending the same hours on people who were never going to proceed.',
      ],
    },

    {
      kind: 'process',
      label: 'Practical',
      heading: 'Comparing quotes when one of them hides the number',
      steps: [
        {
          title: 'Ask for a range before you give yours',
          text: 'Say what you want built and ask what that usually lands between. Anyone experienced can answer — our own ranges are in the [cost guide](/how-much-does-a-website-cost-perth). Note who deflects and who asks for your budget again.',
        },
        {
          title: 'Ask what happens after launch',
          text: 'Hosting, updates, changes, who holds the domain. This is where an apparently cheap quote quietly becomes an expensive one, because the low build price is being subsidised by a plan you cannot leave.',
        },
        {
          title: 'Ask who owns the code',
          text: 'If the site lives inside their platform or their account, the price on the quote is not the price. Moving later means rebuilding from nothing.',
        },
        {
          title: 'Compare the exclusions, not the totals',
          text: 'Two quotes $4,000 apart are usually not the same job. Copywriting, photography, revision rounds and content loading are the line items that go missing.',
        },
        {
          title: 'Make them write the scope down',
          text: 'Page count, features, revisions, timeline, in writing. A studio that will not commit to scope in writing will not commit to a price either.',
        },
      ],
    },

    {
      kind: 'prose',
      label: 'Where ours live',
      heading: 'The numbers, if you want them',
      body: [
        'Every price we charge sits on the [web design](/web-design-perth) pages and in the [full cost guide](/how-much-does-a-website-cost-perth), including where each tier stops making sense. Nothing is gated behind a form and nothing changes based on who is asking.',
        'If a job does not fit a tier we will say so and work out a number with you. If it is smaller than the smallest package, we will say that too — we have talked people out of the bigger option before, usually because a one-page site was genuinely all they needed that year.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Is quote-on-request always a red flag?',
      a: 'No. Genuinely custom work — a web app, an integration, anything where the shape is unknown until someone digs in — reasonably resists a fixed price. The flag is a studio that will not even give a range for a standard brochure site, which is a job they have quoted a hundred times.',
    },
    {
      q: 'Why do two quotes for the same website differ by thousands?',
      a: 'Usually because they are not the same website. One includes copywriting, photography, content loading and revision rounds; the other assumes you supply all of it. Ask each quote to list what is excluded and the gap normally explains itself.',
    },
    {
      q: 'Should I tell a designer my budget?',
      a: 'Once they have given you a range, yes — it genuinely helps them shape scope. Before that, it mostly helps them shape the price. Ask what the work typically costs first, then talk about what you have.',
    },
    {
      q: 'Does a cheap website end up costing more?',
      a: 'Sometimes, and not for the reason people assume. The trap is rarely quality; it is ownership. A low build price attached to a platform you cannot export from means paying monthly forever and rebuilding if you leave. Ask who holds the code before worrying about the sticker.',
    },
  ],

  cta: {
    heading: 'Our prices are on the site',
    text: 'No form, no discovery call to find out whether you can afford us. Have a read, and get in touch if the numbers work for you.',
  },
};
