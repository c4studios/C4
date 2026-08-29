/**
 * Article — Microsoft 365 Copilot data residency versus where inference runs.
 *
 * Verified 29 August 2026, entirely from Microsoft's own documents. No
 * secondary sources carry any load-bearing claim in this piece.
 *
 * SOURCE 1 — Microsoft Learn, "Data, Privacy, and Security for Microsoft
 * Copilot". Page metadata read today shows updated_at 2026-08-18, so this is
 * current documentation and not an archived page. Verbatim:
 *   · "Customers outside the EU may have their queries processed in the US,
 *     EU, or other regions."
 *   · "Microsoft Copilot calls to the LLM are routed to the closest data
 *     centers in the region, but also can call into other regions where
 *     capacity is available during high utilization periods."
 *   · "EU traffic stays within the EU Data Boundary while worldwide traffic
 *     can be sent to the EU and other countries or regions for LLM
 *     processing."
 *   · "Prompts, responses, and data accessed through Microsoft Graph aren't
 *     used to train foundation LLMs, including those used by Microsoft
 *     Copilot."
 *   · "While abuse monitoring, which includes human review of content, is
 *     available in Azure OpenAI, Microsoft Copilot services have opted out of
 *     it."
 *   · "Microsoft Copilot was added as a covered workload in the data residency
 *     commitments in Microsoft Product Terms on March 1, 2024."
 *
 * SOURCE 2 — Microsoft 365 Blog, 4 November 2025, "Microsoft offers in-country
 * data processing to 15 countries...". Verbatim:
 *   · "Local data inferencing for Copilot interactions in Microsoft 365 Copilot
 *     is expected to become available in Australia, India, the United Arab
 *     Emirates, United Kingdom and the United States by the end of 2026, with
 *     support for Canada to follow in 2027 and Japan in 2028."
 *   · Editor's note dated 3 April 2026: "Since our November announcement, we've
 *     made meaningful progress while taking a careful, deliberate approach to
 *     how these new capabilities are delivered. To ensure local inferencing
 *     meets customer needs, we're refining our timeline and scope."
 *
 * That April note is why the article tells the reader to verify on their own
 * tenant rather than to plan around the end-2026 date. The date is a target
 * that Microsoft has already said it is revisiting.
 *
 * Do NOT add:
 *   - Any per-seat price. Microsoft repriced AU list on 1 July 2026 and is
 *     running a promo to 30 September 2026. A price here would be wrong within
 *     weeks and this article has to stay true for longer than that.
 *   - Any claim about what Copilot will do after local inferencing ships. It
 *     has not shipped and Microsoft is revising the timeline.
 *   - Any legal advice about APP 8, CPS 234 or AFSL obligations. Caleb is
 *     partway through a law degree and that is the only claim he makes. Flag
 *     the question, never answer it.
 *   - Anything suggesting Microsoft is being evasive. They documented all of
 *     this themselves, plainly, on a public page. The market misreads it.
 *
 * This article WILL age when local inferencing ships in Australia. It is
 * written with the date in the text so that is obvious to a reader.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['Stored here,', 'processed elsewhere'],
    intro: [
      'Microsoft will keep your Copilot data in Australia. Whether it does the thinking in Australia is a different question with a different answer, and the two get treated as one thing constantly.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'Microsoft 365 Copilot has offered Australian data residency since March 2024, and it is real. Your content sits in the Australian geo. What residency covers is storage. Where the model actually runs when someone types a prompt is a separate matter, and Microsoft\'s own current documentation says that customers outside the EU may have their queries processed in the US, the EU, or other regions. Australia sits outside the EU. Microsoft has committed to bringing local inferencing to Australia and has said it is revising the timeline. So if you are about to tell a client that their Copilot prompts are processed in Australia, check it on your own tenant first, because at the time of writing that is not something you can assume.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Two different questions',
      body: [
        'When a firm asks whether their data stays in Australia, they are usually asking one question and hearing the answer to another.',
        'Data residency answers where information is kept. Copilot became a covered workload in Microsoft\'s data residency commitments on 1 March 2024, and with Advanced Data Residency an Australian tenant\'s content at rest sits in the Australian geo. That commitment is contractual and it holds.',
        'Inference answers where the model runs. Someone types a prompt, it goes to a large language model somewhere, and that somewhere is a physical data centre in a particular country. Residency commitments have never covered this, and the distinction is easy to miss because nobody selling Copilot has any reason to raise it.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What Microsoft says about where the thinking happens',
      body: [
        'This is documented plainly on Microsoft Learn, on the page covering data, privacy and security for Copilot. The version read for this article was updated on 18 August 2026, so it is current rather than historical.',
        'On routing, Microsoft says calls to the model go to the closest data centres in the region, and can also call into other regions where capacity is available during high utilisation periods. So even ordinary demand can move where your prompt is processed.',
        'On regions, the language is more direct.',
      ],
    },

    {
      kind: 'quote',
      quote: 'Customers outside the EU may have their queries processed in the US, EU, or other regions.',
      attribution: 'Microsoft Learn, Data, Privacy, and Security for Microsoft Copilot, updated 18 August 2026',
    },

    {
      kind: 'prose',
      body: [
        'European customers have something Australia does not. The EU Data Boundary keeps EU traffic inside the EU, and Microsoft states that worldwide traffic can be sent to the EU and other countries or regions for model processing. Australian traffic is worldwide traffic.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What is coming, and why you cannot plan around it yet',
      body: [
        'Microsoft announced in November 2025 that local data inferencing for Copilot is expected to become available in Australia, India, the United Arab Emirates, the United Kingdom and the United States by the end of 2026, with Canada in 2027 and Japan in 2028.',
        'That is a genuine commitment and it will land. The catch is in an editor\'s note added to the same announcement on 3 April 2026, saying Microsoft has taken a careful and deliberate approach and is refining its timeline and scope.',
        'A target that has already been revised once is not something to build a client representation on. Treat local inferencing in Australia as switched off until somebody at Microsoft or your provider confirms in writing that it is switched on for your tenant.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What Copilot genuinely does get right',
      body: [
        'It would be unfair to leave this as a warning, because the rest of Copilot\'s data handling is better than most of what it competes with.',
        'Prompts, responses and data reached through Microsoft Graph are not used to train the underlying models, and Microsoft states that plainly rather than burying it. Copilot only surfaces content the user already had permission to see, so it inherits your existing access controls instead of building a new pile of data beside them. Interactions are encrypted, discoverable through Purview, and subject to your retention policies.',
        'There is one more that deserves more attention than it gets. Microsoft says that abuse monitoring, which includes human review of content, is available in Azure OpenAI, and that Copilot services have opted out of it. If you build your own tool on raw Azure OpenAI instead, that human review is on by default and getting it turned off is an application process. Copilot has already made that decision for you, in the direction you would have wanted.',
      ],
    },

    {
      kind: 'list',
      heading: 'Before you tell a client their data stays in Australia',
      items: [
        'Ask your provider, in writing, whether local inferencing is live on your specific tenant today. A roadmap date is not an answer.',
        'Separate the two questions when you write it down. Storage in Australia and processing in Australia are different commitments and only one of them is currently guaranteed.',
        'Check whether web grounding is on. If it is, Copilot sends a short search query out to Bing, which sits outside the arrangement covering the rest of your data.',
        'Work out which of your matters genuinely cannot tolerate offshore processing, rather than applying one answer to everything. Most firms have a small set that cannot and a large set that can.',
        'If the answer has to be Australia today, that is a question about architecture rather than a question about Copilot, and it is worth getting advice on before committing either way.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'None of this is hidden. Microsoft documented all of it on a public page and kept it current. The gap is that almost nobody reselling Copilot reads past the residency headline, so firms end up believing something their own vendor never actually claimed.',
        'If you hold a financial services licence, or you are sitting on privileged material, the difference between where a file is kept and where it is read matters enough to check rather than assume. We would rather hand you the quote and the link than an opinion.',
        'We are partway through a law degree and that is the only claim we make here. What your obligations are is a question for someone qualified to answer it. What Microsoft has written down is a question of fact, and the fact is above.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'Data, Privacy, and Security for Microsoft Copilot',
          publisher: 'Microsoft Learn. Page read 29 August 2026; last updated 18 August 2026.',
          year: '2026',
          url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy',
        },
        {
          title: 'Microsoft offers in-country data processing to 15 countries to strengthen sovereign controls for Microsoft 365 Copilot',
          publisher: 'Microsoft 365 Blog, published 4 November 2025, with an editor\'s note added 3 April 2026 refining the timeline and scope.',
          year: '2025',
          url: 'https://www.microsoft.com/en-us/microsoft-365/blog/2025/11/04/microsoft-offers-in-country-data-processing-to-15-countries-to-strengthen-sovereign-controls-for-microsoft-365-copilot/',
        },
      ],
    },
  ],
};
