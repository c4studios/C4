/**
 * Article — the one-page AI policy.
 *
 * Deliberately built so the only external claims are Australian privacy law,
 * each traced to the OAIC. Verified 4 August 2026:
 *
 *   - Privacy Act small business exemption: annual turnover of $3 million or
 *     less. Carve-outs that must comply regardless of turnover include health
 *     service providers, businesses trading in personal information,
 *     Commonwealth contractors, credit reporting bodies, AML/CTF reporting
 *     entities, residential tenancy database operators and CDR-accredited
 *     businesses. Source: oaic.gov.au small business page.
 *   - APPs 1.7, 1.8 and 1.9 were introduced by the Privacy and Other
 *     Legislation Amendment Act 2024 (Cth) and commence 10 December 2026.
 *     They require an APP entity's privacy policy to disclose automated
 *     decision-making where a computer program uses personal information to
 *     make a decision that could reasonably be expected to significantly
 *     affect an individual's rights or interests. OAIC guidance was flagged
 *     for release by September 2026.
 *
 * Do NOT add a figure for how many businesses use AI, how many have a policy,
 * or any "shadow AI" percentage. Several such stats circulate without a
 * traceable primary source and none is needed for the argument.
 *
 * The piece states it is not legal advice. Keep that line.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['The one-page', 'AI policy'],
    intro: [
      'Most AI policies are fourteen pages long and nobody has read one. Here is the version that fits on a single page, what each line is actually for, and whether the December deadline you are being emailed about applies to you at all.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'A small business does not need a governance framework. It needs five things written down: which tools are allowed, what must never be pasted into them, who checks the output before it leaves, when a client gets told, and who carries the responsibility. That fits on one page and takes an afternoon. The Privacy Act change commencing 10 December 2026 does not apply to most small businesses, because businesses turning over $3 million or less are generally exempt from the Act entirely — but health service providers are covered regardless of turnover, and that catches a lot of small practices.',
      ],
    },

    {
      kind: 'image',
      src: '/insights/one-page-ai-policy.jpg',
      width: 1360,
      height: 1700,
      alt: 'A single printed page titled "AI use at [business name]" listing five numbered clauses, lying on a desk. One clause is circled in blue biro and a line in the last clause is underlined twice.',
      caption: 'The whole policy. The circled clause is the one that prevents the incident.'
    },

    {
      kind: 'prose',
      heading: 'Why the enterprise template does not fit you',
      body: [
        'Nearly every AI policy template circulating right now was written for an organisation with a compliance function. It assigns responsibilities to a Data Governance Lead and a Risk Committee, and it refers decisions to an escalation path. In a business of twelve people those roles are all the same person, and that person is busy.',
        'The result is a document that gets adopted, filed and never opened. That is worse than having nothing, because it produces the appearance of control. If something goes wrong later, "we had a policy" is a weak position when nobody in the business can tell you what was in it.',
        'The test for whether your policy is the right length is simple. Can a new starter read it in two minutes and then correctly answer whether they may paste a client email into ChatGPT? If not, length is not your friend.',
      ],
    },

    {
      kind: 'list',
      label: 'The five clauses',
      heading: 'What actually has to be in it',
      intro: 'Everything else in a long template is either an elaboration of one of these or a description of a process you do not have.',
      items: [
        {
          title: 'Which tools are approved',
          text: 'Name them. Not "approved AI tools" — the actual products, and the actual accounts. A paid business account and a free consumer account of the same product are different things, because the free one usually has different defaults for how your input is handled. If a tool is not on the list, the rule is ask first.',
        },
        {
          title: 'What never gets pasted in',
          text: 'This is the clause that prevents the incident. Be specific to your business: client names and contact details, anything lifted from a client file, health information, payment details, credentials, staff records, anything covered by an NDA. Finish it with a default — if you are unsure, the answer is no.',
        },
        {
          title: 'Who reads it before it leaves',
          text: 'Nothing generated goes to a client, a regulator or the public until a person has read it end to end and is willing to put their name on it. Most of the public AI failures of the last two years were not tool failures. They were review failures.',
        },
        {
          title: 'When you tell the client',
          text: 'This one is genuinely industry-specific and you should not copy someone else’s. A design studio and a law firm owe their clients different things. Write the rule you would be comfortable reading aloud to the client it applies to.',
        },
        {
          title: 'Who owns the output',
          text: 'The person who sends the work is responsible for the work. Say it plainly, because the alternative gets tested exactly once — "the AI wrote it" is not a defence, and it should be clear in advance that it will not be treated as one.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'The template — take it',
      body: [
        'Copy this, fill the brackets, delete what does not apply. It is not legal advice, and if you are in a regulated profession you should check it against your own obligations before it goes on the wall.',
      ],
    },

    {
      kind: 'process',
      heading: 'AI use at [business name]',
      steps: [
        {
          title: 'Tools you can use',
          text: '[List the actual products and account types.] If it is not on this list, ask before using it for work. Free personal accounts are not on this list. If you want something added, say so — the list is meant to grow.',
        },
        {
          title: 'What never goes in',
          text: 'Client names or contact details, anything from a client file, health information, payment details, passwords, staff records, anything under an NDA. If you are not sure whether something counts, assume it does.',
        },
        {
          title: 'Someone reads it before it leaves',
          text: 'Nothing drafted with AI goes to a client, a regulator or the public until a person has read it in full and is happy to put their name to it. That person is responsible for it being right.',
        },
        {
          title: 'When we tell people',
          text: '[Your rule. For example: we tell a client when AI was used to draft something they will rely on, and we never use it to produce anything presented as personal advice.]',
        },
        {
          title: 'You own what you send',
          text: 'The person who sends the work owns the work. "The AI wrote it" is not an explanation we will accept, and knowing that in advance is the point of this line.',
        },
        {
          title: 'Questions',
          text: 'Anything unclear, or a tool you want on the list: [name, email]. Last updated [date]. Applies to everyone who does work for us, including contractors.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'The 10 December 2026 change, and whether it touches you',
      body: [
        'You are probably being emailed about this one. The Privacy and Other Legislation Amendment Act 2024 added three new provisions to Australian Privacy Principle 1 — APPs 1.7, 1.8 and 1.9 — and they commence on 10 December 2026.',
        'What they require is narrower than the emails suggest. If a computer program uses personal information to make a decision that could reasonably be expected to significantly affect someone’s rights or interests, your privacy policy has to say so, and say what kinds of information and decisions are involved. Drafting a newsletter with ChatGPT is not that. Automating who gets approved, ranked, priced or rejected might be.',
        'Then there is the part almost nobody selling you a policy mentions: the Privacy Act largely does not apply to small business at all. The exemption covers businesses with an annual turnover of $3 million or less, and most of the businesses being marketed to about this deadline are under that line.',
        'The exceptions are what matter. Turnover is irrelevant if you are a health service provider — which means physiotherapists, dentists, psychologists, allied health, a one-room practice, all of it. It is also irrelevant if you trade in personal information, hold a Commonwealth contract, are a credit reporting body, are a reporting entity under the AML/CTF Act, or are accredited under the Consumer Data Right. Those businesses are inside the Act at any size, and the December change applies to them.',
        'The OAIC flagged guidance for release by September 2026, ahead of commencement. If you are in one of those categories, that guidance is the thing to wait for rather than a vendor’s summary of it.',
      ],
    },

    {
      kind: 'quote',
      quote: 'Being outside the Privacy Act is not the same as being safe. It only means the consequence of a bad day is commercial and reputational rather than regulatory.',
    },

    {
      kind: 'process',
      heading: 'Rolling it out without a staff revolt',
      steps: [
        {
          title: 'Do not open with the ban',
          text: 'A policy that arrives as a list of prohibitions gets read as a signal that leadership has decided AI is a problem. Use is then hidden rather than reduced, which is the outcome you least want, because you lose visibility of it entirely.',
        },
        {
          title: 'Give people a sanctioned place to work first',
          text: 'The rule "do not paste client data into ChatGPT" is much easier to follow when there is an approved tool that does the job. A ban with no alternative is an instruction to be less effective, and it will be quietly ignored.',
        },
        {
          title: 'Write it with the people who will use it',
          text: 'Twenty minutes with the two or three people already using AI daily will produce a better banned-data clause than an afternoon of your own drafting. They know what they have been tempted to paste in.',
        },
        {
          title: 'Put a date on it and mean it',
          text: 'Tools and their defaults change. A policy naming a specific product needs revisiting, so set a review date and treat it as real. A policy nobody has updated in two years is read as one nobody is enforcing.',
        },
        {
          title: 'Say what happens when someone gets it wrong',
          text: 'If the answer is "tell me straight away and we will sort it," write that down. People conceal mistakes when the consequence is unclear, and a concealed mistake is the one that becomes expensive.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'We run [AI training for businesses](/ai-training-for-business), and a policy is usually the first thing a client asks for. We would rather hand this over than sell it, partly because a policy you wrote yourself is one you can actually enforce.',
        'Our own position on how we use AI in client work is published at [how we use AI](/how-we-use-ai). Where the banned-data clause is the hard part — because the work genuinely involves confidential material — the answer is sometimes a model that runs on hardware you own, which is what [private AI](/private-ai) is for.',
        'This is general information, not legal advice. The privacy law summarised above is linked to its source below, and if it changes this page changes.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'Privacy obligations for small business',
          publisher: 'Office of the Australian Information Commissioner',
          year: '2026',
          url: 'https://www.oaic.gov.au/privacy/privacy-for-organisations/small-business',
        },
        {
          title: 'Consultation on guidance for transparency in automated decision-making',
          publisher: 'Office of the Australian Information Commissioner',
          year: '2026',
          url: 'https://www.oaic.gov.au/engage-with-us/consultations/consultation-on-guidance-for-transparency-in-automated-decision-making',
        },
        {
          title: 'Chapter 1: APP 1 — Open and transparent management of personal information',
          publisher: 'Office of the Australian Information Commissioner',
          year: '2025',
          url: 'https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-1-app-1-open-and-transparent-management-of-personal-information',
        },
        {
          title: 'Privacy and Other Legislation Amendment Act 2024 (Cth)',
          publisher: 'Federal Register of Legislation',
          year: '2024',
          url: 'https://www.legislation.gov.au/C2024A00108/asmade/text',
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'Does my small business legally need an AI policy?',
      a: 'In most cases there is no law requiring one. Businesses turning over $3 million or less are generally exempt from the Privacy Act, and no Australian law currently mandates an AI policy by itself. The reason to have one is practical rather than legal: it is what stops client information being pasted into a tool nobody vetted.',
    },
    {
      q: 'What changes on 10 December 2026?',
      a: 'APPs 1.7, 1.8 and 1.9 commence. If you are covered by the Privacy Act and you use personal information in automated decision-making that could significantly affect someone’s rights or interests, your privacy policy must disclose it. It is a transparency obligation about automated decisions, not a rule about using AI to draft things.',
    },
    {
      q: 'I run a small health practice. Am I exempt?',
      a: 'No. Health service providers are covered by the Privacy Act regardless of turnover, so the small business exemption does not help you. If you use automated decision-making on personal information in the way the new provisions describe, the December change applies to your practice.',
    },
    {
      q: 'Should the policy ban AI outright?',
      a: 'Rarely, and it usually backfires. A ban with no sanctioned alternative pushes use underground, so you lose the visibility a policy exists to give you. Naming approved tools and being specific about what must never go into them tends to hold better than prohibition.',
    },
    {
      q: 'Can I just use a template I found online?',
      a: 'As a starting structure, yes — that is why ours is on this page. The two clauses you should not copy from anyone are the banned-data list and the disclosure rule, because both depend on what your business actually handles and what your clients would expect to be told.',
    },
  ],

  cta: {
    heading: 'We do the session that follows the policy',
    text: 'Half a day with your team on what the tools are actually for, using your own work. The policy is the easy part — the habits are the bit that needs a room.',
  },
};
