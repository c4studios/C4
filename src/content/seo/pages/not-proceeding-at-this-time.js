/**
 * Article — Australia's mandatory AI guardrails, and the sentence the market
 * is not reading.
 *
 * Assembled 1 September 2026 from an evidence pack, then re-verified. The
 * research persisted on industry.gov.au after an earlier timeout and reached
 * the primary documents, which is why this article exists at all.
 *
 * LEGAL BOUNDARY. Caleb is partway through a law degree and that is the only
 * credential he claims. This article reports what government documents say. It
 * does not tell any reader what applies to them or what they should do.
 *
 * SOURCE 1 — Department of Industry, Science and Resources, consultation
 * outcomes page for the mandatory guardrails proposals paper. Verified verbatim
 * 1 Sep 2026:
 *   · "The Australian Government will not proceed at this time with previous
 *     proposals to introduce mandatory guardrails for AI development and
 *     deployment."
 *   · "Feedback on this proposals paper informed development of the National AI
 *     Plan."
 *   THE QUALIFIER IS THE ARTICLE. "At this time" is on the face of the
 *   government's own document. Never write that the guardrails were abandoned,
 *   scrapped, killed or dropped. Those are commentary words. The government's
 *   word is "will not proceed at this time" and the article says so explicitly.
 *
 * SOURCE 2 — Prime Minister Anthony Albanese, "AI in Australia's interests",
 * University of Sydney, 15 July 2026, pm.gov.au. Verified verbatim:
 *   · "Today I announce that to seize and shape and share the generational
 *     opportunity that AI represents our Government will establish a set of
 *     Australian Standards for AI."
 *   · On large AI data centres, bringing them "into one regulatory framework.
 *     Clear, consistent and mandatory."
 *   · "We will aim to bring the legislation to Parliament early next year."
 *   · "Effective today, I am establishing The Office of AI in my own Department
 *     of the Prime Minister and Cabinet."
 *   · "It is not our goal to try and legislate for every possible eventuality
 *     or risk."
 *   The transcript carries "Check against delivery".
 *
 * Do NOT add:
 *   - A year to the data-centre expectations reference. The speech says "In
 *     March this year", which in a July 2026 speech means March 2026, but one
 *     fetch summary rendered it as 2024. The article says "in March" without a
 *     year rather than risk the wrong one.
 *   - The "we will not hesitate to intervene" sentence. The research flagged
 *     that it came from ABC quoting the Plan rather than from the PDF itself,
 *     and could not point to the page. Not usable as a Plan quote.
 *   - The AI Safety Institute funding figure. The primary Government Response
 *     says $29.8 million; secondary reporting near-uniformly says $29.9
 *     million. The discrepancy is real and the figure adds nothing to the
 *     argument, so it is out.
 *   - Any claim that the government adopted the Productivity Commission's
 *     recommendations. No document read states a position on that report.
 *   - Any submission count beyond what the government pages display. The pack
 *     noted the government's own 2023 page contradicts itself, saying 448 in
 *     the narrative and 447 in the count header.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['Not proceeding,', 'at this time'],
    intro: [
      'A great deal of Australian AI advice still tells firms to get ready for incoming AI legislation. The government published its position, in one sentence, and it is worth reading the sentence rather than the coverage of it.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'In September 2024 the Australian government proposed ten mandatory guardrails for AI in high-risk settings, and one of the three options it consulted on was a new cross-economy AI Act. It then decided not to go ahead. The wording it used, on its own consultation page, is that it "will not proceed at this time" with those proposals, and the feedback instead informed the National AI Plan published on 2 December 2025. What applies in the meantime is the existing body of Australian law, which the government describes as largely technology-neutral. There is no AI Act in front of Parliament and no mandatory AI guardrails in force. There is also a qualifier in that sentence that most coverage drops.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The sentence itself',
      body: [
        'This is the whole thing, from the Department of Industry, Science and Resources, on the outcomes page for its own consultation.',
      ],
    },

    {
      kind: 'quote',
      quote: 'The Australian Government will not proceed at this time with previous proposals to introduce mandatory guardrails for AI development and deployment.',
      attribution: 'Department of Industry, Science and Resources, consultation outcomes',
    },

    {
      kind: 'prose',
      body: [
        'Read the last four words before the full stop. "At this time" is not a journalist\'s hedge added afterwards. It is on the face of the government\'s own document, and it is doing work.',
        'You will see this described as the guardrails being abandoned, scrapped, killed off or dropped. None of those is the government\'s word. You will also see it described as a pause or a deferral, which reads more into the sentence than it says. The government said it will not proceed at this time, and left it there.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What was actually on the table',
      body: [
        'The September 2024 paper was titled "Safe and responsible AI in Australia: Proposals paper for introducing mandatory guardrails for AI in high-risk settings". It set out three regulatory options, the third of which was a whole-of-economy approach introducing a new cross-economy AI Act.',
        'So the thing a lot of vendors are still selling readiness for was a real proposal, formally consulted on, with a real prospect of becoming an Act. That is presumably why the framing stuck. It just is not what happened.',
        'The same department states that the feedback from that consultation "informed development of the National AI Plan", which the Department published on 2 December 2025.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What the government said applies instead',
      body: [
        'The National AI Plan sets out the replacement approach, and it is not a new statute.',
        'The Plan states that the government\'s regulatory approach "will continue to build on Australia\'s robust existing legal and regulatory frameworks, ensuring that established laws remain the foundation for addressing and mitigating AI-related risks", and that agencies and regulators keep responsibility for AI harms within their own domains.',
        'It describes those frameworks as "strong existing, largely technology-neutral legal frameworks" that can apply to AI, and lists the areas: privacy, administrative law, online safety, corporations law, intellectual property, workplace laws including work health and safety, competition and consumer protections, and anti-discrimination.',
        'The practical implication is the reverse of waiting. Nothing new is coming that you are waiting for, and the law that governs the work is the law that already governed it.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The body that watches, and does not regulate',
      body: [
        'The Plan pairs that approach with an Australian AI Safety Institute, and is explicit about what it is not.',
        'The government\'s response to the Senate Select Committee on Adopting AI states plainly that "The AI Safety Institute will not be a regulator". Its role is to monitor and test emerging AI capabilities and risks, and to share what it finds so ministers and existing regulators can act within the powers they already hold.',
        'So the institute is a set of eyes rather than a set of teeth, and that is by design.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The July 2026 announcement, and what it covers',
      body: [
        'On 15 July 2026 the Prime Minister announced at the University of Sydney that the government "will establish a set of Australian Standards for AI", with legislation to be brought to Parliament "early next year". He also established an Office of AI within his own department, effective that day.',
        'This gets reported as Australia finally regulating AI. Read the speech and the mandatory obligations described are narrower. They concern large-scale data centres, which are to be brought "into one regulatory framework. Clear, consistent and mandatory", covering their power supply, grid connection costs, energy contribution and water use, alongside protections for creators whose work is used to train AI.',
        'The same speech is direct about the limit of the ambition: "It is not our goal to try and legislate for every possible eventuality or risk."',
        'A framework for data centre infrastructure and copyright, announced as future legislation, is a different thing from a general AI statute governing how a firm uses a model. Both are real. Only one of them is what people mean when they say the AI Act is coming.',
      ],
    },

    {
      kind: 'list',
      heading: 'What this changes',
      items: [
        'A vendor selling readiness for AI-specific legislation is selling readiness for something the government has said it will not proceed with at this time.',
        'The obligations that do bite are the existing ones, and they are already enforced by the regulators who already had them.',
        'The qualifier is real. "At this time" means the position can change, and the Plan describes a government that will introduce targeted laws where it judges them needed.',
        'If you are being told to prepare, ask which instrument. A named Act, a named standard or a named commencement date is checkable. Incoming regulation is not.',
        'Watch the data centre framework separately. It is genuinely proposed legislation, targeted for early 2027, and it is about infrastructure rather than about how you use a model.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What we could not establish',
      body: [
        'The government has not published a summary of what submitters to the 2024 consultation actually objected to. There are 279 published responses and no official document drawing out the main objection, so any account of why the proposals did not proceed is inference rather than record.',
        'We also could not establish a single whole-of-economy review of existing law with a named owner and a deadline. What the documents describe is a set of separate reviews across portfolios, which is a different thing and harder to track.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'Coming regulation is one of the most effective things to sell against, and it does not require the regulation to arrive.',
        'We would rather point at the government\'s own sentence, which takes a minute to read and settles the question. It also carries its own qualifier, so nobody reading this can accuse us of promising nothing will ever change.',
        'On what any of this means for a particular firm, we are partway through a law degree and that is the only claim we make. What the government has published is quoted above with links. What follows from it is a question for someone qualified to answer it.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'Introducing mandatory guardrails for AI in high-risk settings: consultation outcomes',
          publisher: 'Department of Industry, Science and Resources. Source of the "will not proceed at this time" statement.',
          year: '2025',
          url: 'https://consult.industry.gov.au/ai-regulatory-guardrails',
        },
        {
          title: 'National AI Plan',
          publisher: 'Department of Industry, Science and Resources, published 2 December 2025.',
          year: '2025',
          url: 'https://www.industry.gov.au/publications/national-ai-plan',
        },
        {
          title: 'Australian Government response to the Senate Select Committee on Adopting Artificial Intelligence (AI) report',
          publisher: 'Department of Industry, Science and Resources, tabled 1 April 2026. Source of the statement that the AI Safety Institute will not be a regulator.',
          year: '2026',
          url: 'https://www.industry.gov.au/publications/australian-government-response-senate-select-committee-adopting-artificial-intelligence-ai-report',
        },
        {
          title: 'AI in Australia\'s interests',
          publisher: 'The Hon Anthony Albanese MP, Prime Minister, University of Sydney, 15 July 2026. Transcript marked "Check against delivery".',
          year: '2026',
          url: 'https://www.pm.gov.au/media/ai-australias-interests-0',
        },
      ],
    },
  ],
};
