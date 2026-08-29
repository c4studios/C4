/**
 * Article — tracing the AI failure statistics everyone repeats.
 *
 * Verified 29 August 2026.
 *
 * MIT NANDA. "The GenAI Divide: State of AI in Business 2025", MIT Project
 * NANDA, July 2025. The report describes itself as "Preliminary Findings" and
 * is not peer reviewed; the original MIT-hosted link now redirects. The 95%
 * refers to organisations seeing no measurable P&L impact after a reported
 * $30–40B of enterprise spend, which is a claim about value realisation rather
 * than a technical pilot failure rate.
 *   Kevin Werbach, Wharton professor and Chair of Legal Studies & Business
 *   Ethics, verbatim: "If MIT Project NANDA stands behind the claims, it should
 *   release the full supporting data. If not, it should retract the report."
 *   NOTE: the report's own methodology section sits behind a form and was NOT
 *   read directly. Coverage disagrees on the sample (150 interviews / 350
 *   surveys versus 52 interviews / 153 surveys). The article therefore makes no
 *   claim about the sample size. Do not add one.
 *
 * RAND. "The Root Causes of Failure for Artificial Intelligence Projects and
 * How They Can Succeed: Avoiding the Anti-Patterns of AI", 2024, lead author
 * James Ryseff. Verbatim: "by some estimates, more than 80 percent of AI
 * projects fail—twice the rate of failure for information technology projects
 * that do not involve AI." That is RAND repeating a pre-existing estimate, not
 * measuring one. RAND's own method was interviews with 65 data scientists and
 * engineers each with 5+ years' experience, to identify causes.
 *   NOTE: rand.org returned 403 to a direct fetch, so this was verified through
 *   search results reporting the report page. The research this came from named
 *   the authors as "Ryseff and Narayanan"; the RAND listing gives Ryseff, De
 *   Bruhl and Newberry. Because of the 403 the article names only Ryseff as
 *   lead author rather than asserting a full list from a source I could not
 *   read directly.
 *
 * S&P GLOBAL. Market Intelligence, "Voice of the Enterprise: AI & Machine
 * Learning", 2025. 42% of firms abandoned most AI initiatives, up from 17% the
 * prior year; the average organisation scrapped 46% of proofs of concept before
 * production; 1,000+ respondents across North America and Europe; top obstacles
 * cost, data privacy and security.
 *
 * DELOITTE AUSTRALIA. Contract with the Department of Employment and Workplace
 * Relations signed December 2024, value about A$440,000, for a 237-page
 * assurance review of the Targeted Compliance Framework. The refund confirmed
 * by the department on 21 October 2025 was A$97,000, the final instalment; the
 * first three instalments were retained.
 *   CRITICAL: the research this came from said Deloitte "partially refunded"
 *   A$440,000, which reads as a A$440,000 refund. That is wrong and would be a
 *   factual error about a named firm. A$440,000 is the CONTRACT VALUE. The
 *   REFUND is A$97,000. Never conflate them.
 *   Flagged by Chris Rudge and Lisa Burton Crawford at Sydney University. The
 *   revised report disclosed use of Azure OpenAI GPT-4o. The department said
 *   the substance and recommendations were unchanged, and the article says so,
 *   because leaving it out would make the failure sound broader than it was.
 *
 * Do NOT add:
 *   - Either Gartner figure as though it were measured. Both are forecasts and
 *     the agentic one rests on a poll of webinar attendees.
 *   - The "$18B written off" figure. It is a secondary estimate not present in
 *     the S&P source.
 *   - The "85% of AI projects fail" or IDC "88% of pilots" figures. Neither
 *     traces to a primary document. Folklore.
 *   - Any sample size for the MIT NANDA report. See note above.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['Ninety-five per cent', 'of what?'],
    intro: [
      'You have heard that 95% of AI projects fail. It is the most repeated statistic in the industry and it moved markets. It is also not a failure rate, and the professor who went looking for how it was calculated could not find out.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'The 95% comes from a July 2025 report by MIT Project NANDA, which describes itself as preliminary findings and has not been peer reviewed. The figure is about organisations seeing no measurable profit-and-loss impact from custom enterprise AI tools within the study window. That is a claim about whether value showed up on the books, which is a different question from whether the technology worked. A Wharton professor who read the report looking for the derivation could not reconstruct it and said MIT should either release the underlying data or withdraw the report. There is a defensible abandonment figure and it comes from somewhere else entirely.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What the number actually measures',
      body: [
        'The distinction matters more than it sounds.',
        '"The pilot failed" means the thing did not work. "No measurable P&L impact within the window" means nobody could point at a line in the accounts and attribute a change to it. Those describe different situations, and the second one catches a great deal of software that is working perfectly well.',
        'A drafting tool that saves eleven people forty minutes a day has no line in the accounts. It has not failed. It is simply not measurable in the way the question demanded.',
        'The report is also, by its own description, preliminary and not peer reviewed, and the original link on MIT\'s own site now redirects elsewhere.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The part that should have stopped the number spreading',
      body: [
        'Kevin Werbach, a professor at Wharton and chair of its legal studies and business ethics department, read the report specifically to find where 95% came from. He could not work it out.',
        'His conclusion was not that the finding is wrong. It was narrower and harder to argue with.',
      ],
    },

    {
      kind: 'quote',
      quote: 'If MIT Project NANDA stands behind the claims, it should release the full supporting data. If not, it should retract the report.',
      attribution: 'Kevin Werbach, Wharton',
    },

    {
      kind: 'prose',
      heading: 'The same thing happened to the 80% figure',
      body: [
        'The other number in constant circulation is that more than 80% of AI projects fail, usually attributed to RAND.',
        'RAND\'s 2024 report on the root causes of AI project failure does contain that sentence. What it says is that "by some estimates, more than 80 percent of AI projects fail". That is a hedge, and it is RAND repeating a figure already in circulation to set up its own question.',
        'What RAND actually did was interview 65 data scientists and engineers, each with at least five years of experience, to work out why projects fail. That work is genuinely useful and almost nobody quotes it, because the causes are less quotable than the number. They are overwhelmingly organisational: no measurable problem definition, sponsors whose attention drifts, and data that was never good enough to start with.',
        'Cite RAND for what goes wrong. The rate was never theirs.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The figure that does survive',
      body: [
        'S&P Global Market Intelligence surveyed more than a thousand organisations across North America and Europe in 2025 and found that 42% had abandoned most of their AI initiatives, up from 17% the year before. The average organisation scrapped 46% of its proofs of concept before they reached production. The obstacles named most often were cost, data privacy and security.',
        'That is a real survey with a stated sample, a stated question and a stated population. It is still people reporting on themselves rather than observed data, and it covers North America and Europe rather than Australia. Those limits are worth carrying with the number.',
        'It is also less dramatic than 95%, which is presumably why you have not heard it.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The Australian one, with the figure people get wrong',
      body: [
        'Australia has its own case and it is worth getting right, because the numbers attached to it are routinely reported wrongly.',
        'Deloitte Australia was contracted by the Department of Employment and Workplace Relations in December 2024, for around A$440,000, to produce a 237-page assurance review. The report contained a quote attributed to a Federal Court judgment that the judgment did not contain, and references to academic papers that do not exist. Researchers at Sydney University found them. A revised version disclosed that a generative AI tool chain had been used.',
        'The refund was A$97,000, being the final instalment. The earlier instalments were retained. You will often see this written up as Deloitte refunding A$440,000, which is the contract value rather than the refund.',
        'One more thing belongs in an honest account. The department said the substance of the report and its recommendations were unchanged. What failed was the sourcing, not the analysis, and that is a smaller failure than the headlines suggest. It was still enough to cost a Big Four firm money and a great deal of public standing.',
      ],
    },

    {
      kind: 'list',
      heading: 'How to check a statistic before you repeat it',
      items: [
        'Ask what the denominator is. Ninety-five per cent of what, measured how, over what period. Most of these numbers dissolve at this question.',
        'Find out whether it was measured or predicted. Several of the most-quoted AI failure figures are forecasts about the future, quoted as though something has already happened.',
        'Check whether the organisation named actually produced the number, rather than quoting someone else\'s in passing.',
        'Look for the sample and the question wording. A survey that will not tell you what it asked is not evidence you can use.',
        'Notice who benefits. A report concluding that the answer is the approach its own authors are building deserves the same scepticism as a vendor benchmark.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'The 95% figure gets used in two opposite directions and both are sales pitches. It is used to argue that AI is a bubble, and it is used by consultants to argue that you need help avoiding the 95%. Neither is standing on anything solid.',
        'We would rather hand you the smaller true number than the large impressive one. Roughly four in ten organisations abandoned most of their AI work last year, and roughly half of proofs of concept never reached production. That is a serious finding and it does not need help.',
        'If we ever quote a figure at you that we cannot trace to a source you can open yourself, treat it the same way you should treat this one.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'The GenAI Divide: State of AI in Business 2025',
          publisher: 'MIT Project NANDA, July 2025. Self-described preliminary findings, not peer reviewed. The methodology section sits behind a form and was not read for this article.',
          year: '2025',
          url: 'https://www.futuriom.com/articles/news/why-we-dont-believe-mit-nandas-werid-ai-study/2025/08',
        },
        {
          title: 'The Root Causes of Failure for Artificial Intelligence Projects and How They Can Succeed',
          publisher: 'RAND Corporation, lead author James Ryseff. Source of the "by some estimates" wording and of the 65-interview method.',
          year: '2024',
          url: 'https://www.rand.org/pubs/research_reports/RRA2680-1.html',
        },
        {
          title: 'AI project failure rates are on the rise',
          publisher: 'CIO Dive, reporting S&P Global Market Intelligence, Voice of the Enterprise: AI & Machine Learning, 2025.',
          year: '2025',
          url: 'https://www.ciodive.com/news/AI-project-fail-data-SPGlobal/742590/',
        },
        {
          title: 'Deloitte to pay money back to Australian government after using AI in report',
          publisher: 'Fortune. Contract about A$440,000; refund A$97,000, the final instalment, confirmed 21 October 2025.',
          year: '2025',
          url: 'https://fortune.com/2025/10/07/deloitte-ai-australia-government-report-hallucinations-technology-290000-refund',
        },
      ],
    },
  ],
};
