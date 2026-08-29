/**
 * Article — the Microsoft Customer Copyright Commitment.
 *
 * Every external claim on this page traces to one primary source: Microsoft's
 * own "Customer Copyright Commitment Required Mitigations" page on Microsoft
 * Learn. Read and verified 29 August 2026; that page was last updated
 * 13 July 2026.
 *
 * Verified on that reading:
 *   - The CCC is "a provision in the Microsoft Product Terms that describes
 *     Microsoft's obligation to defend customers against certain third-party
 *     intellectual property claims relating to Output Content."
 *   - The required mitigations "apply only to customers using Azure OpenAI in
 *     Microsoft Foundry Models ... and other Covered Products with configurable
 *     Metaprompts or other safety systems ("Configurable GAI Services"). They
 *     do not apply to customers using other Covered Products including Copilots
 *     with safety systems that are fixed."
 *   - "The only Configurable GAI Services are Microsoft Copilot Studio and
 *     GitHub Copilot."
 *   - Two Universal Required Mitigations, both effective 1 December 2023: a
 *     metaprompt directing the model to prevent copyright infringement, and a
 *     testing and evaluation report retained by the customer and provided to
 *     Microsoft in the event of a claim.
 *   - Azure OpenAI per-use-case mitigations, effective 1 December 2023: code
 *     generation requires the protected material code model on in annotate or
 *     filter mode plus Prompt Shield in filter mode; text generation requires
 *     the protected material text model on in filter mode plus Prompt Shield
 *     in filter mode. Image generation, transcription and all other use cases
 *     have no additional requirements.
 *   - Asynchronous filter caveat effective 21 May 2024: output retroactively
 *     flagged as protected material is not covered.
 *   - GitHub Offerings, effective 3 April 2026: no additional required
 *     mitigations. The Duplicate Detection filter is no longer required for
 *     CCC coverage and remains optional.
 *   - Copilot Studio, effective 1 June 2025: output from a model hosted
 *     outside Copilot Studio is not covered unless that model runs in Azure
 *     OpenAI and meets the required mitigations.
 *   - Customers have six months from publication of a new mitigation to
 *     implement it, and must demonstrate compliance if they tender a claim.
 *
 * Do NOT add:
 *   - What Microsoft pays. The verified page says "defend". The financial
 *     terms live in the Product Terms, which has not been read for this piece.
 *   - Any comparison to OpenAI's Copyright Shield or Anthropic's indemnity.
 *     Neither was verified against its primary source on 29 August 2026.
 *   - Any figure for how many firms rely on this, or any claim about how
 *     often these claims are made. No traceable source exists.
 *
 * The piece states it is not legal advice. Keep that line.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['The AI indemnity', 'you already have'],
    intro: [
      'If your business runs on Microsoft 365, Microsoft has already agreed to defend you against certain copyright claims arising from what Copilot produces. Here is what that covers, the conditions that quietly switch it off, and why building your own tool moves the obligation onto you.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'Microsoft\'s Customer Copyright Commitment is a provision in the Microsoft Product Terms under which Microsoft agrees to defend customers against certain third-party intellectual property claims relating to AI output. If your people are using a Copilot whose safety systems are fixed, there is nothing you have to configure to keep that cover. If instead you have had something built on Azure OpenAI, the same commitment is available, but it carries conditions. One of those conditions is a testing and evaluation report that you have to produce, retain, and hand to Microsoft if a claim is ever made. Most firms that commissioned an Azure OpenAI build have never produced one.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why this is worth ten minutes of your time',
      body: [
        'Copyright exposure is one of the two or three questions that stops a professional services firm adopting AI. Someone in the room asks who is liable if the thing produces text that turns out to belong to somebody else, nobody has a confident answer, and the conversation moves on.',
        'The answer is often sitting in a contract the firm already signed. It is not sitting in the AI product you are being sold, and it is not something you need to negotiate separately. It is worth knowing which side of the line you are on before you spend money solving a problem you have already solved.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The line that matters: fixed or configurable',
      body: [
        'Microsoft splits its AI products into two groups, and the group you are in decides how much work you have to do.',
        'The first group is products whose safety systems are fixed. You cannot change how they behave, so Microsoft does not ask you to maintain anything. Microsoft states plainly that the required mitigations "do not apply to customers using other Covered Products including Copilots with safety systems that are fixed." For a firm using Copilot as it comes, that is the whole story.',
        'The second group is what Microsoft calls Configurable GAI Services, plus Azure OpenAI. Here you can change the metaprompt and the safety settings, so Microsoft makes coverage conditional on you configuring them properly. Microsoft is specific about the membership of this group: "The only Configurable GAI Services are Microsoft Copilot Studio and GitHub Copilot."',
        'The practical consequence runs against most people\'s instinct. The more you customise, the more you owe. A firm that buys Copilot off the shelf has no obligations to maintain. A firm that pays a developer to build something bespoke on Azure OpenAI has taken on a list of them, usually without being told.',
      ],
    },

    {
      kind: 'list',
      label: 'Azure OpenAI',
      heading: 'What you have to do if you built your own',
      intro: 'Two requirements apply to every Azure OpenAI deployment. Both took effect on 1 December 2023, so they are not new, and neither is optional if you want the cover to hold.',
      items: [
        {
          title: 'A metaprompt that addresses copyright',
          text: 'Your system message has to direct the model to prevent copyright infringement in its output. Microsoft publishes a sample component for this. If your developer wrote the system prompt without one, that box is not ticked.',
        },
        {
          title: 'A testing and evaluation report',
          text: 'You must have tested the system for reproduction of third-party content, using guided red teaming, systematic measurement or an equivalent approach. Significant ongoing reproduction found in testing has to be addressed. You keep the report, and you hand it to Microsoft if you ever make a claim. This is the requirement almost nobody has met, because it sounds like a compliance formality rather than the condition it is.',
        },
        {
          title: 'Filters matched to what you generate',
          text: 'If the system generates text, the protected material text model has to be on in filter mode, and Prompt Shield for jailbreak attacks has to be on in filter mode. If it generates code, the protected material code model has to be on in annotate or filter mode, with Prompt Shield again in filter mode. Image generation and transcription carry no additional requirements.',
        },
        {
          title: 'Care with asynchronous filtering',
          text: 'Since 21 May 2024, output that gets retroactively flagged as protected material by the asynchronous filter is not covered. For code, you keep cover only if you comply with the cited licence. This is a real gap and it is easy to miss when a developer turns on async filtering for speed.',
        },
      ],
    },

    {
      kind: 'quote',
      quote: 'A firm that buys Copilot as it comes has nothing to maintain. A firm that had something built has a list of conditions, and usually nobody told them.',
    },

    {
      kind: 'prose',
      heading: 'Two changes worth knowing about',
      body: [
        'Microsoft dropped a requirement in 2026. As of 3 April 2026, GitHub Offerings carry no additional required mitigations, and the Duplicate Detection filter is no longer needed to keep CCC coverage. It is still available if you want it. If your policy still mandates it because someone read the old page, that policy is out of date.',
        'The other change runs the other way. Since 1 June 2025, if you connect Copilot Studio to a model hosted outside Copilot Studio, the output of that model is not covered unless it runs in Azure OpenAI and meets the required mitigations. Bringing your own model is exactly the kind of decision made for good technical reasons by someone who has never read the Product Terms.',
        'Microsoft also gives you six months from the date a new mitigation is published to implement it. That is generous, and it means this is a page worth revisiting rather than reading once.',
      ],
    },

    {
      kind: 'process',
      heading: 'What to check',
      steps: [
        {
          title: 'Work out which products you are actually using',
          text: 'Copilot in Microsoft 365 is a different answer from Copilot Studio, which is a different answer again from something a developer built on Azure OpenAI. Firms often have all three and think of them as one thing called "our AI".',
        },
        {
          title: 'If anything was custom built, ask for the evaluation report',
          text: 'Ask whoever built it whether the required mitigations were implemented and whether the testing and evaluation report exists. If the answer is a pause, you have found the gap. It is fixable, and it is much cheaper to fix now than during a claim.',
        },
        {
          title: 'Read your own system prompt',
          text: 'Somebody wrote it. Check that it addresses copyright. This takes about a minute and it is one of the two universal requirements.',
        },
        {
          title: 'Check the filter settings against what you generate',
          text: 'Text and code have different requirements, and the filters must be in the right mode rather than merely switched on. Annotate mode is acceptable for code and carries a licence obligation. For text, filter mode is required.',
        },
        {
          title: 'Stop paying for a problem you have solved',
          text: 'If the copyright question was the blocker on a project and you are on Microsoft products with fixed safety systems, the blocker may already be gone. Confirm it before you buy anything to address it.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'What this does not do',
      body: [
        'It is an indemnity against certain third-party intellectual property claims about output. It is not a general warranty that the output is correct, and it does nothing about the other ways an AI deployment goes wrong. Wrong answers, invented citations, confidential material going somewhere it should not, and a system nobody can explain to a regulator are all still yours to manage.',
        'It also has real exclusions and conditions that live in the Product Terms rather than on the page summarised here. If you tender a claim, Microsoft requires you to demonstrate compliance with all the relevant requirements. That is worth knowing before you rely on it for anything consequential.',
        'This is general information and it is not legal advice. The source is linked below. If your business depends on the answer, have your own lawyer read the Product Terms as they apply to your agreement.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'We run [AI training for businesses](/ai-training-for-business) and the liability question comes up in almost every session. Handing over the answer is more useful than holding it back, and a firm that understands its own contract asks better questions of everyone selling to it.',
        'Where the harder problem is confidentiality rather than copyright, an indemnity does not help, because the exposure is the data going out at all. That is a different architecture, and it is what [private AI](/private-ai) is for.',
        'Our own position on how we use these tools in client work is at [how we use AI](/how-we-use-ai).',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'Customer Copyright Commitment Required Mitigations for Azure OpenAI in Foundry Models',
          publisher: 'Microsoft Learn',
          year: '2026',
          url: 'https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/customer-copyright-commitment',
        },
        {
          title: 'Safety system message templates',
          publisher: 'Microsoft Learn',
          year: '2026',
          url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/safety-system-message-templates',
        },
        {
          title: 'Red teaming large language models',
          publisher: 'Microsoft Learn',
          year: '2026',
          url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/red-teaming',
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'What is the Customer Copyright Commitment?',
      a: 'It is a provision in the Microsoft Product Terms under which Microsoft agrees to defend customers against certain third-party intellectual property claims relating to output produced by covered AI products. It applies to Copilot products and to Azure OpenAI, with different conditions attached to each.',
    },
    {
      q: 'Do I have to do anything to keep the cover?',
      a: 'It depends which product you use. For Copilots whose safety systems are fixed, Microsoft states the required mitigations do not apply, so there is nothing to configure. For Azure OpenAI, Microsoft Copilot Studio and GitHub Copilot, specific mitigations must be implemented and maintained.',
    },
    {
      q: 'We had something custom built on Azure OpenAI. What is the risk?',
      a: 'That the mitigations were never implemented, so the cover does not hold if it is ever needed. The two universal requirements are a metaprompt addressing copyright and a testing and evaluation report you retain. Ask your developer about both. If the report does not exist, that is the gap to close first.',
    },
    {
      q: 'Does this mean AI output is safe to use without checking?',
      a: 'No. It addresses third-party intellectual property claims about output and nothing else. Accuracy, confidentiality, disclosure to clients and the ability to explain a decision are all still your responsibility, and they are where most real incidents happen.',
    },
    {
      q: 'Is the GitHub Copilot duplicate detection filter still required?',
      a: 'Not since 3 April 2026. Microsoft removed it as a condition of CCC coverage for GitHub Offerings. The feature remains available if you want to use it, but it is no longer required.',
    },
  ],

  cta: {
    heading: 'We read the contracts you already signed',
    text: 'Half a day on what your firm is actually exposed to, using the tools and agreements you already have. Usually the first finding is that you are paying to solve something twice.',
  },
};
