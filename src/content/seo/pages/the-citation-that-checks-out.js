/**
 * Article — misgrounded citations: the real source that does not support the
 * claim, and what it has already cost in Australia.
 *
 * Verified 29 August 2026.
 *
 * SOURCE 1 — Magesh, Surani, Dahl, Suzgun, Manning & Ho, "Hallucination-Free?
 * Assessing the Reliability of Leading AI Legal Research Tools",
 * arXiv:2405.20362, submitted 30 May 2024. Abstract read directly. Verbatim:
 *   · "the AI research tools made by LexisNexis (Lexis+ AI) and Thomson
 *     Reuters (Westlaw AI-Assisted Research and Ask Practical Law AI) each
 *     hallucinate between 17% and 33% of the time"
 *   · The abstract itself quotes the vendor claims the study was testing:
 *     "eliminating" (Casetext, 2023), "avoid[ing]" hallucinations (Thomson
 *     Reuters, 2023), "hallucination-free" legal citations (LexisNexis, 2023).
 *
 * SOURCE 2 — Stanford HAI's write-up of the same study, by the authors' own
 * institution. This is where the two-part definition is stated plainly.
 * Verbatim:
 *   · "incorrect—it describes the law incorrectly or makes a factual error"
 *   · "misgrounded—the AI tool describes the law correctly, but cites a source
 *     which does not in fact support its claims"
 *   · "Given the critical importance of authoritative sources in legal
 *     research and writing, the second type of hallucination may be even more
 *     pernicious than the outright invention of legal cases."
 *
 * SOURCE 3 — Victorian Legal Services Board + Commissioner, statement on the
 * 'Mr Dayal' matter, read at lsbc.vic.gov.au. Verbatim: on 19 August 2025 the
 * Board varied the practitioner's practising certificate; he "tendered a list
 * and summary of authorities to the court that had been generated through the
 * use of artificial intelligence (AI) and provided inaccurate citations and
 * summaries". Restrictions confirmed verbatim: no longer entitled to practise
 * as a principal lawyer, no longer authorised to handle trust money, no longer
 * operating his own law practice, only practising as an employee solicitor,
 * supervised legal practice for two years, quarterly reporting by both him and
 * his supervisor. Underlying matter: Dayal [2024] FedCFamC2F 1166.
 *
 * ERROR FOUND IN THE RESEARCH THIS CAME FROM — do not reinstate:
 *   The research gave a GPT-4 legal hallucination baseline of "~43%", marked
 *   as derived from the study's Figure 1 rather than from prose. Stanford
 *   HAI's own write-up instead says general-purpose models hallucinated
 *   "between 58-82% on legal queries". Two different numbers for the same
 *   claim from sources that should agree, so neither is usable. The article
 *   carries no general-model baseline at all. It does not need one.
 *
 * Do NOT add:
 *   - Any verbatim quotation from the Supreme Court of Victoria murder-case
 *     judgment. The widely-repeated Justice Elliott wording reached me only
 *     through news reports, never the judgment itself. The case is described
 *     without quotation marks for that reason.
 *   - Any Australian measured hallucination rate. None exists. The research
 *     said so and searching confirmed it. The article states the gap instead
 *     of papering over it with the US figures.
 *   - Any advice about what a practitioner's obligations are. Caleb is partway
 *     through a law degree and that is the only claim he makes. Report what
 *     the regulator did; never advise on duties.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['The citation', 'that checks out'],
    intro: [
      'Everyone worries about AI inventing a source that does not exist. That one is easy to catch. The failure that actually gets people into trouble is a real source, correctly cited, that does not say what the sentence claims it says.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'Stanford researchers tested the legal research tools sold by LexisNexis and Thomson Reuters, the ones marketed on the promise of eliminating hallucinations, and found they hallucinate between 17% and 33% of the time. The more useful part of that study is how they counted. A wrong answer is one kind of failure. The other kind is an answer that is correct while pointing at a source that does not support it, and the researchers judged that second kind the more dangerous of the two, because a fabricated case falls over the moment you look it up while a real one does not. If you are buying anything that answers questions by citing your documents, this is the failure to design against.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What was actually tested',
      body: [
        'The study is "Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools", by Varun Magesh, Faiz Surani, Matthew Dahl, Mirac Suzgun, Christopher Manning and Daniel Ho.',
        'The title is pointed on purpose. Its abstract quotes the marketing it was testing: one provider claimed to be eliminating hallucinations, another to be avoiding them, a third promised hallucination-free legal citations. These were not vague gestures at accuracy. They were specific claims about a specific failure mode, made about products sold to people whose professional standing depends on getting citations right.',
        'The tools performed considerably better than a general chatbot. They did not perform as advertised.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Two ways to be wrong, and only one of them is obvious',
      body: [
        'The researchers split hallucination into two kinds, and the distinction is the most useful thing in the paper.',
        'The first is being incorrect. The tool describes the law wrongly or makes a factual error. Unpleasant, but at least it is wrong on the face of it.',
        'The second they call misgrounded. In their words, the tool describes the law correctly, but cites a source which does not in fact support its claims. The sentence is right. The citation is real. You can click it, and a genuine authority opens. It simply does not say what the sentence in front of you says it does.',
        'Nothing about that looks wrong. There is no missing case, no broken link, no obviously invented quote. The only way to catch it is to open the source and read enough of it to confirm it actually supports the proposition, which is exactly the work the tool was bought to save.',
      ],
    },

    {
      kind: 'quote',
      quote: 'Given the critical importance of authoritative sources in legal research and writing, the second type of hallucination may be even more pernicious than the outright invention of legal cases.',
      attribution: 'Stanford HAI, on Magesh et al., arXiv:2405.20362',
    },

    {
      kind: 'prose',
      heading: 'This is not only a legal problem',
      body: [
        'The study looked at legal research tools because that is where the marketing claims were loudest and the stakes are easy to demonstrate. The failure is not peculiar to law.',
        'Any system that answers a question by pointing at your own documents can do the same thing. An accountant asking what a client agreed to, a broker checking a term against a file note, anyone summarising a long document with references back to it. The system finds material that is genuinely about the topic, produces a sensible answer, and attaches the reference. The reference is real. Whether it supports the specific sentence is a separate question that nothing in the output signals.',
        'Confident invention is the failure mode people plan for. Confident attribution is the one that survives review.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What it has already cost in Australia',
      body: [
        'This has moved past the hypothetical here.',
        'On 19 August 2025 the Victorian Legal Services Board varied a solicitor\'s practising certificate. In the Board\'s own words, he had tendered a list and summary of authorities to the court that had been generated through the use of artificial intelligence and provided inaccurate citations and summaries.',
        'The consequences are worth reading slowly. He is no longer entitled to practise as a principal lawyer. He is no longer authorised to handle trust money. He no longer operates his own law practice. He may practise only as an employee solicitor, under supervision, for two years, with quarterly reporting from both him and his supervisor.',
        'That is a career materially reshaped by not opening the sources. Separately, in August 2025 senior counsel apologised to the Supreme Court of Victoria for submissions in a murder case that contained fabricated material, and Australian courts have since issued practice notes on the use of generative AI in litigation.',
        'One honest caveat. The measured figures above come from a study of US legal research tools. No equivalent Australian measurement exists for professional-services tools, and we looked. What Australia has is court incidents and regulator responses rather than a controlled study. The shape of the problem transfers. The exact percentages should not be quoted as though they describe an Australian product.',
      ],
    },

    {
      kind: 'list',
      heading: 'What to do about it',
      items: [
        'Treat a citation as a pointer to work you still have to do, rather than as evidence the work is done. The link opening is not the check.',
        'Insist the system quotes the passage it relied on, not just the document it came from. A tool that names a file has told you almost nothing; a tool that shows you the sentence lets you verify in seconds.',
        'Build the checking into the workflow rather than leaving it to conscientiousness. Anything that depends on a busy person choosing to verify will fail on the day they are busiest.',
        'When you test a system before buying it, deliberately check whether the cited source supports the claim, rather than only whether the source exists. Those are different tests and most buyers only run the first.',
        'Decide in advance which work is allowed to rely on this at all. The answer will not be the same for a first draft as for something going to a court, a regulator, or a client file.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'We build systems that answer questions from a client\'s own documents. This is the failure mode our own work has to be designed against, so it would be strange to leave it for someone else to raise.',
        'It also settles how we talk about these tools. A system that cites its sources is genuinely better than one that does not, because it gives you something to check. It is not the same thing as a system that is right, and any vendor collapsing that distinction is selling you the wrong idea.',
        'On what any of this means for a practitioner\'s professional obligations, we are partway through a law degree and that is the only claim we make. What the regulator did is a matter of public record and it is set out above. What you should do about it is a question for someone qualified to answer it.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools',
          publisher: 'Magesh, Surani, Dahl, Suzgun, Manning & Ho — arXiv:2405.20362, submitted 30 May 2024',
          year: '2024',
          url: 'https://arxiv.org/abs/2405.20362',
        },
        {
          title: 'AI on Trial: Legal Models Hallucinate in 1 out of 6 (or More) Benchmarking Queries',
          publisher: 'Stanford HAI. Source of the incorrect and misgrounded definitions quoted above.',
          year: '2024',
          url: 'https://hai.stanford.edu/news/ai-trial-legal-models-hallucinate-1-out-6-or-more-benchmarking-queries',
        },
        {
          title: 'Statement on the ‘Mr Dayal’ matter',
          publisher: 'Victorian Legal Services Board + Commissioner. Practising certificate varied 19 August 2025.',
          year: '2025',
          url: 'https://lsbc.vic.gov.au/news-updates/news/statement-mr-dayal-matter',
        },
      ],
    },
  ],
};
