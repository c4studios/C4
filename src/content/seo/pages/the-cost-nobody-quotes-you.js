/**
 * Article — what on-premise AI actually costs, and why the usual comparison is
 * the wrong one.
 *
 * Verified 29 August 2026.
 *
 * CONFIRMED, from Synergy's own price-change page:
 *   Home Plan A1, from 1 July 2026 — usage 33.2621 c/kWh, supply 119.2419
 *   c/day. Previously 32.3719 and 116.0505. These are RESIDENTIAL rates and
 *   Synergy publishes business tariffs in a separate section. The article says
 *   so explicitly and does not present the residential rate as a business one.
 *   https://www.synergy.net.au/Global/Synergy-Price-Changes-2026
 *
 * The power arithmetic is an ESTIMATE built on that confirmed tariff. Every
 * assumption in it (0.8 kW under load, 3 h/day full-load-equivalent, 250 working
 * days, 100 W idle, 30% cooling uplift) is stated in the article so a reader can
 * substitute their own. It is presented as a worked illustration, never as a
 * measured result.
 *
 * Do NOT add:
 *   - Any GPU or workstation price. The 2026 GDDR7/DRAM shortage has these
 *     moving fast enough that any figure would be wrong within a quarter, and
 *     a wrong hardware price on a page arguing about cost is self-defeating.
 *   - Any API price per million tokens. Same reason, faster decay.
 *   - The "5 to 10 hours a month" maintenance figure from the research this
 *     came from. It is REPORTED only, sourced to vendor and practitioner
 *     estimates, and the researcher stated plainly that no rigorous survey
 *     exists. The absence of that number is a finding and the article says so
 *     rather than borrowing a number nobody has measured.
 *   - Any claim about what a specific competitor charges.
 *
 * The argument is structural on purpose: labour dominates, and that stays true
 * whichever way hardware and token prices move.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['The cost nobody', 'quotes you'],
    intro: [
      'Running AI on your own hardware is usually sold as the cheaper option. The hardware and the power bill are the easy numbers and they are the small ones. The cost that decides it is the one nobody puts in the quote.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'For a firm of five to fifty people, putting AI on your own hardware almost never comes out cheaper than paying for an API. The comparison that gets made — a one-off hardware price against a monthly token bill — leaves out the item that dominates the total, which is the labour to keep the thing running. Hardware is a number you can look up. Power, for a single machine, turns out to be a few hundred dollars a year. Maintenance is neither, and it does not stop. That does not make on-premise the wrong choice. It means the reason to choose it is that your files stay in the building, and it is worth being clear-eyed that you are paying for that rather than saving.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The comparison people make',
      body: [
        'Someone prices a capable machine, divides it over three years, adds a guess at electricity, and puts that next to what the same work would cost through an API. The machine looks competitive, sometimes dramatically so, and the decision gets made on that.',
        'Both halves of that sum are roughly right. The problem is what sits outside it.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Power is the question everyone asks, and it is the small one',
      body: [
        'It comes up in every conversation, so here is the arithmetic in full. Synergy raised the Home Plan A1 usage rate to 33.2621 cents per kilowatt-hour on 1 July 2026. That is the residential tariff and Synergy publishes business rates separately, so treat it as an anchor rather than as your rate.',
        'Take a serious single-GPU machine at roughly 800 watts under load including the host. Assume it runs three hours a day at full load across 250 working days, and idles at about 100 watts the rest of the time. Add thirty per cent for the cooling that has to remove the heat.',
      ],
    },

    {
      kind: 'table',
      heading: 'Worked example, on the assumptions above',
      head: ['Component', 'Energy', 'At 33.26 c/kWh'],
      rows: [
        ['Under load — 0.8 kW, 3 h/day, 250 days', '600 kWh', 'about $200'],
        ['Idle — 0.1 kW, the other 8,010 hours', 'about 801 kWh', 'about $266'],
        ['Cooling uplift, roughly 30%', '—', 'about $140'],
        ['Total, one machine, one year', '—', 'roughly $610'],
      ],
    },

    {
      kind: 'prose',
      body: [
        'Every assumption there is arguable and you should substitute your own. The point survives the argument: the electricity to run one of these is in the hundreds of dollars a year. It is not what decides the question, and any comparison that stops here has stopped too early.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The cost that actually decides it',
      body: [
        'The machine has to be set up, and then it has to keep working.',
        'Setting it up is the visible part. Choosing a model, sizing it to the hardware, getting the serving stack running, connecting it to whatever documents it needs, and testing it against real work before anyone relies on it.',
        'Keeping it running is the part that gets left out, because it is not a task with an end. A graphics driver updates and the serving software stops recognising the card. An operating system update lands and something in the stack no longer matches. The software underneath releases a version with a breaking change. A model that ran fine last month behaves differently after an update nobody initiated. None of these are exotic. They are the ordinary weather of running this software, and each one arrives as somebody in the office saying the AI has stopped working.',
        'Here is the honest part. We looked for a rigorous study putting a number on those hours for a small firm and could not find one. Every figure in circulation traces back to vendors and practitioners describing their own experience.',
        'So we are not going to quote you an hours-per-month figure dressed up as research, because there is not one. The absence is worth knowing on its own. This is the largest item in the total and it is the one nobody has measured properly.',
      ],
    },

    {
      kind: 'list',
      heading: 'How to run the sum honestly',
      items: [
        'Get a hardware quote dated today rather than a figure from an article. Memory prices moved sharply through 2026 and anything written down is already stale.',
        'Work out your own power cost from your actual tariff and your actual duty cycle, using the arithmetic above.',
        'Estimate the setup hours, then ask who specifically is doing them and what that person would otherwise be doing.',
        'Estimate the ongoing hours the same way. If the answer is that it should not need much, that is a guess, and it is the guess the whole decision rests on.',
        'Ask what happens when the person who understands the machine is on leave, or resigns. If one person can fix it, you have a production system with a single point of failure.',
        'Only now compare it against what the same work would cost through an API at your real volume.',
      ],
    },

    {
      kind: 'prose',
      heading: 'When your own hardware is the right answer',
      body: [
        'There is a real case for it and it has nothing to do with money.',
        'Some material cannot leave the building. Privileged files in an insolvency matter, client records held under a financial services licence, health information, anything where a third party processing the text is a problem regardless of what their contract promises. For that work the question is not what it costs. The question is whether the data moves, and on your own hardware it does not.',
        'The other case is volume. Sustained heavy use changes the arithmetic, because token costs scale with what you do while a machine costs the same whether you use it or not. That threshold sits well above what most firms of this size will reach.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'We sell on-premise systems. Saying that they usually cost more than the alternative is an odd thing to put on our own website.',
        'We publish it because the alternative is worse. A client who buys this expecting to save money finds out within a year that they have not, and then the whole thing was mis-sold regardless of how well it works. A client who buys it knowing they are paying for control gets exactly what they were told they would get.',
        'So when someone comes to us wanting to cut their AI spend, we tell them their own hardware is unlikely to do it, and we say what would. When someone comes to us because their files cannot leave the building, that is a job worth doing and we quote it as what it is.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'Synergy price changes 2026 — Home Plan A1 rates from 1 July 2026',
          publisher: 'Synergy (Western Australia). Residential tariff; business rates are published separately.',
          year: '2026',
          url: 'https://www.synergy.net.au/Global/Synergy-Price-Changes-2026',
        },
      ],
    },
  ],
};
