/**
 * Article — what "zero data retention" actually retains.
 *
 * Assembled 1 September 2026 from an evidence pack, then re-verified. Only
 * quotes I fetched myself are in the article.
 *
 * READ THIS BEFORE EDITING. The article quotes Anthropic more than any other
 * vendor, and Anthropic is the vendor Caleb builds on. That is not a criticism
 * of Anthropic and the article says so explicitly in its own section. It is the
 * opposite: Anthropic is quotable because Anthropic publishes the detail. The
 * others were less quotable because their pages could not be read, not because
 * they retain less. Cutting that section would turn a fair piece into an unfair
 * one. Do not cut it.
 *
 * SOURCE 1 — Anthropic Privacy Center, "How long do you store my
 * organization's data?", last updated 1 July 2026. Verified verbatim
 * 1 Sep 2026:
 *   · "For Anthropic API users, we automatically delete inputs and outputs on
 *     our backend within 30 days of receipt or generation, except:"
 *   · "We retain inputs and outputs for up to 2 years and trust and safety
 *     classification scores for up to 7 years if your chat is flagged by our
 *     automated trust and safety systems as violating our Usage Policy."
 *
 * SOURCE 2 — Anthropic Privacy Center, the zero-data-retention article, last
 * updated 9 June 2026. Verified verbatim:
 *   · Under ZDR, Anthropic does not store inputs or outputs "except where
 *     needed to comply with law or combat misuse or harm".
 *   · "Anthropic still retains User Safety classifier results in order to
 *     enforce our Usage Policy."
 *
 * SOURCE 3 — Microsoft Learn, "Data, Privacy, and Security for Microsoft
 * Copilot". Verified verbatim on 29 August 2026 for the Copilot residency
 * article and reused here:
 *   · "While abuse monitoring, which includes human review of content, is
 *     available in Azure OpenAI, Microsoft Copilot services have opted out of
 *     it."
 *
 * COULD NOT VERIFY, and the article says so rather than borrowing the pack's
 * transcription:
 *   · OpenAI's zero-retention announcement, including the reported carve-out
 *     that images flagged for potential CSAM are still retained under ZDR.
 *     openai.com returned HTTP 403 to a direct fetch.
 *   · Google's abuse-monitoring pages. The research reported a genuine
 *     contradiction between two live Google pages, one stating up to 30 days
 *     and another up to 90 days. Both URLs returned only navigation structure
 *     with no body content on fetch, so neither figure could be confirmed and
 *     neither appears in the article.
 *
 * Do NOT add:
 *   - Any OpenAI or Google retention period until someone has read it at the
 *     source. The pack's transcriptions are probably right. Probably is not the
 *     standard this library runs on.
 *   - The "7-day Anthropic API default" that circulates on several blogs. The
 *     pack flagged it and Anthropic's own page says 30 days.
 *   - Any DPA claim. No DPA document was fetched for any vendor.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['What zero', 'retention keeps'],
    intro: [
      'Zero data retention is sold as nothing being kept. Read the clauses and something is always kept. Here is what one vendor says it retains, in its own words, and why it is the only one we can quote precisely.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'On the ordinary commercial tier of most AI services, prompts and responses are held for about thirty days so the vendor can detect misuse, then deleted. Zero data retention is an arrangement you apply for that removes that window. What it does not remove is everything. Anthropic, whose documentation is the clearest of any vendor we checked, states that under a zero-retention arrangement it still keeps the results its safety classifiers produce about your content. Separately it states that content flagged as breaching its usage policy is kept for up to two years, and the classification scores for up to seven. None of that is hidden. It is on their published pages. It is simply not what most people picture when a salesperson says nothing is stored.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What the default actually is',
      body: [
        'Start with the ordinary arrangement, because most firms are on it and think they are on something else.',
        'Anthropic states that for API users it automatically deletes inputs and outputs on its backend within thirty days of receipt or generation, with exceptions. Roughly thirty days is the industry pattern rather than an Anthropic quirk, and the stated purpose is the same everywhere: to detect abuse of the service.',
        'That window is not a filing cabinet you can search. It is a period during which your content exists on someone else\'s infrastructure for a purpose that is theirs rather than yours.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What zero retention removes, and what it does not',
      body: [
        'Zero data retention closes that window. You apply for it, the vendor approves it per organisation, and prompts stop being stored after processing.',
        'Anthropic is unusually direct about the limit of that promise.',
      ],
    },

    {
      kind: 'quote',
      quote: 'Anthropic still retains User Safety classifier results in order to enforce our Usage Policy.',
      attribution: 'Anthropic Privacy Center, zero data retention, updated 9 June 2026',
    },

    {
      kind: 'prose',
      body: [
        'The same page says the arrangement means content is not stored "except where needed to comply with law or combat misuse or harm".',
        'So under zero retention the text goes. What a classifier concluded about the text stays. That is a much smaller thing than the content itself, and it is not nothing, and the distinction is worth understanding before you tell a client nothing is kept.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The numbers that apply when something is flagged',
      body: [
        'The other figure people rarely see sits on the ordinary retention page.',
      ],
    },

    {
      kind: 'quote',
      quote: 'We retain inputs and outputs for up to 2 years and trust and safety classification scores for up to 7 years if your chat is flagged by our automated trust and safety systems as violating our Usage Policy.',
      attribution: 'Anthropic Privacy Center, updated 1 July 2026',
    },

    {
      kind: 'prose',
      body: [
        'Two years and seven years, against a default of thirty days. The trigger is an automated system deciding something looks like a policy breach.',
        'Most professional work will never trip it. But a firm that has satisfied itself on the strength of a thirty-day number has satisfied itself on the wrong number, because the thirty days describes the ordinary case and says nothing about the exception.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why one vendor gets quoted here more than the others',
      body: [
        'Anthropic appears throughout this article. That needs saying plainly, because the natural reading is that Anthropic keeps more than everyone else, and there is no evidence of that.',
        'Anthropic appears because Anthropic publishes the detail. Their pages carry specific periods, name what survives a zero-retention arrangement, and are dated. We could quote them because they wrote it down.',
        'We tried to do the same for the others and could not. OpenAI\'s zero-retention announcement refused our request outright. Two of Google\'s abuse-monitoring pages returned nothing but their own navigation menus. The research behind this article reported that those two Google pages state different retention periods to each other, one saying thirty days and the other ninety, and we could not confirm either figure because neither page would render.',
        'So the honest summary is uncomfortable and worth publishing. The vendor easiest to quote about retention is the one that documents it best. Silence in a competitor\'s documentation is not evidence that they keep less.',
      ],
    },

    {
      kind: 'prose',
      heading: 'One structural difference that does matter',
      body: [
        'There is a distinction between products that is worth more than any single retention figure, and it is about where the retained material sits.',
        'Microsoft states that abuse monitoring, which includes human review of content, is available in Azure OpenAI, and that Microsoft Copilot services have opted out of it. So a firm using Copilot and a firm building its own tool on Azure OpenAI are in materially different positions on the same vendor, and the one that built its own tool is in the weaker one.',
        'That is the opposite of what most people assume, since building your own usually feels like the more private option.',
      ],
    },

    {
      kind: 'list',
      heading: 'What to ask before you accept the phrase',
      items: [
        'Ask what is retained under the zero-retention arrangement, rather than whether content is retained. The answer is rarely nothing and a good vendor will tell you.',
        'Ask what happens to content an automated system flags, and for how long. This is where the long periods live.',
        'Ask whether the retained material sits inside your own tenant or on the vendor\'s infrastructure, and whether you can delete it yourself.',
        'Ask whether human review of content is on by default, and whether the specific product you are buying has opted out of it.',
        'Ask them to point at the page. Every figure in this article came off a vendor\'s own published documentation, and a vendor who cannot show you theirs has told you something.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What we could not establish',
      body: [
        'We could not read OpenAI\'s zero-retention announcement. Their site refused the request.',
        'We could not read either of Google\'s abuse-monitoring pages. Both returned navigation structure with no body, so the reported disagreement between them about whether the period is thirty days or ninety is neither confirmed nor dismissed here.',
        'We did not read any vendor\'s data processing addendum, which is the contract that actually binds them. Everything above comes from published help and documentation pages, which is a lower tier of source than the agreement you would sign.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'We build on Anthropic\'s models, so quoting their retention periods at length is an odd thing for us to do.',
        'We do it because the alternative is worse. A client who has been told nothing is kept, and later finds out what a classifier result is, will not be reassured by us having technically never said otherwise.',
        'The phrase means something real and useful. It means the content stops being stored. It does not mean nothing about the content survives, and the gap between those two is exactly the size of the conversation worth having before anything sensitive goes near a model.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'How long do you store my organization\'s data?',
          publisher: 'Anthropic Privacy Center, last updated 1 July 2026. Source of the thirty-day default and the two-year and seven-year figures.',
          year: '2026',
          url: 'https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data',
        },
        {
          title: 'I have a zero data retention agreement with Anthropic. What products does it apply to?',
          publisher: 'Anthropic Privacy Center, last updated 9 June 2026. Source of the User Safety classifier results statement.',
          year: '2026',
          url: 'https://privacy.claude.com/en/articles/8956058-i-have-a-zero-data-retention-agreement-with-anthropic-what-products-does-it-apply-to',
        },
        {
          title: 'Data, Privacy, and Security for Microsoft Copilot',
          publisher: 'Microsoft Learn. Source of the abuse monitoring opt-out statement.',
          year: '2026',
          url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy',
        },
      ],
    },
  ],
};
