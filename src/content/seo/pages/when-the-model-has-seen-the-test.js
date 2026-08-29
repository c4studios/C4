/**
 * Article — benchmark contamination, and what to ask instead.
 *
 * Every external claim traces to a primary source. Verified 29 August 2026 by
 * fetching the arXiv abstract directly.
 *
 *   - Liang, Garg & Zilouchian Moghaddam, "The SWE-Bench Illusion: When
 *     State-of-the-Art LLMs Remember Instead of Reason", arXiv:2506.12286.
 *     Submitted 14 June 2025, last revised 1 December 2025.
 *     Abstract, verbatim figures:
 *       · "state-of-the-art models achieve up to 76% accuracy in identifying
 *         buggy file paths using only issue descriptions, without access to
 *         repository structure"
 *       · "This performance is merely up to 53% on tasks from repositories not
 *         included in SWE-Bench"
 *       · "up to 35% consecutive 5-gram accuracy on SWE-Bench Verified and
 *         Full, but only up to 18% for tasks in other benchmarks"
 *
 *   - Appenzeller, "Welcome to LLMflation", a16z, 12 November 2024. The
 *     cheapest model reaching MMLU 42 cost $60/MTok when GPT-3 shipped in
 *     November 2021 and $0.06/MTok by late 2024. Roughly 1,000x over three
 *     years. This is a HISTORICAL anchor from 2024 and the piece says so.
 *
 * Two corrections applied to the research this came from, both material:
 *   1. The 76% belongs to "state-of-the-art models" collectively. It is NOT
 *      attributed to o3 specifically. Do not name a model.
 *   2. The paper says "merely up to 53%", not "consistently below 53%". The
 *      second is a stronger claim than the authors made.
 *
 * Do NOT add:
 *   - The "16% of benchmark papers used statistical tests" figure. The paper it
 *     comes from is real (arXiv:2511.04703, 3 Nov 2025) but the statistic could
 *     not be extracted from the PDF and is not in the abstract.
 *   - Any claim that OpenAI stopped reporting SWE-bench Verified. Reported
 *     second-hand only, not confirmed against an OpenAI source.
 *   - Any current model's benchmark score, price or uptime figure. Those decay
 *     within a quarter and this piece is written to stay true.
 *
 * The argument deliberately needs no 2026 numbers at all.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['When the model', 'has seen the test'],
    intro: [
      'Every AI vendor leads with a benchmark score. There is a published paper showing those scores can be inflated by models having memorised the test, and it is worth understanding before you buy anything on the strength of a number.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'A benchmark score tells you how a model performed on a specific, public set of problems. Because those problems are public, they can end up in the data the model was trained on, and a model that has memorised an answer looks identical to one that worked it out. Researchers demonstrated this on the most-cited coding benchmark in the industry: models identified the correct buggy file in a repository up to 76% of the time from the issue description alone, without ever being shown the repository. On code from repositories outside the benchmark, the same approach managed merely up to 53%. The gap is memorisation. None of which makes benchmarks useless, but it does mean a vendor quoting one at you has told you almost nothing about whether the thing will work on your documents.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What the researchers actually did',
      body: [
        'SWE-bench is a collection of real software bugs taken from public code repositories. A model is given the bug report and asked to produce a fix. It is the benchmark most often quoted when a company claims its AI can write code, and it looks rigorous because the problems are real.',
        'Three researchers, Shanchao Liang, Spandan Garg and Roshanak Zilouchian Moghaddam, tried something simple. They gave models the bug description and withheld the repository entirely. No file list, no directory structure, nothing to search. If a model is reasoning about the problem, it cannot possibly know which file the bug lives in.',
        'It knew anyway. Up to 76% of the time.',
        'Then they ran the same test on bugs from repositories that are not in the benchmark. Same models, same method, same kind of problem. Accuracy fell to merely up to 53%.',
        'They also measured how closely models could reproduce the original code verbatim. On benchmark tasks, up to 35%. On tasks from elsewhere, up to 18%. The models are not just familiar with the problems. They are partly reciting the answers.',
      ],
    },

    {
      kind: 'quote',
      quote: 'State-of-the-art models achieve up to 76% accuracy in identifying buggy file paths using only issue descriptions, without access to repository structure.',
      attribution: 'Liang, Garg and Zilouchian Moghaddam, arXiv:2506.12286',
    },

    {
      kind: 'prose',
      heading: 'Why this is not a scandal',
      body: [
        'It is worth being careful here, because this finding gets overstated in both directions.',
        'The models are not fraudulent and the labs are not necessarily cheating. Training data is scraped from the public internet at enormous scale, and public benchmarks live on the public internet. Contamination is largely a consequence of how these systems are built rather than a deliberate act. It is also very hard to prove for any single score.',
        'What the paper establishes is narrower and more useful. A high score on a public benchmark is consistent with genuine capability and it is also consistent with memorisation, and from the outside you cannot tell which. That is enough to change how you should treat the number.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The part that matters for your business',
      body: [
        'You are almost certainly not choosing a model to fix bugs in open-source Python. You want to know whether it can read a contract, summarise a file, draft a first pass at something, or answer a question about a document nobody has time to read.',
        'No public benchmark measures that on your documents. It cannot, because your documents are not public, which is the entire reason you want the thing.',
        'So the benchmark and the job you are buying for have almost nothing to do with each other, and that is true even where the score is completely honest.',
      ],
    },

    {
      kind: 'list',
      heading: 'What to ask a vendor instead',
      items: [
        'Run it on our documents, redacted, in front of us. Thirty real files is enough to learn more than any leaderboard will tell you.',
        'Show me where it got that from. If the system cannot cite the passage it drew on, you cannot check its work, and unverifiable output is work you have to redo.',
        'What does it do when it does not know? Confident invention is the failure mode that costs you, not refusal.',
        'What happens on the day it is wrong? Who notices, who is accountable, and what does the client see.',
        'How is this scored six months from now? If nobody has defined what good looks like, nobody will notice it degrading.',
      ],
    },

    {
      kind: 'prose',
      heading: 'A number that is genuinely worth knowing',
      body: [
        'One piece of benchmark history does hold up, and it is more useful than any current score.',
        'In November 2024, a16z measured the price of the cheapest model capable of reaching a fixed capability threshold. When GPT-3 shipped in November 2021 that cost roughly $60 per million tokens. Three years later it was around $0.06. A thousandfold fall for the same measured capability.',
        'That is a historical figure from 2024 and it describes 2021 to 2024, not today. It is worth knowing for one reason: it explains why anything you were quoted more than a year ago is probably wrong now, in a direction that favours you. It is not a promise about next year.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What we do about it',
      body: [
        'We do not quote benchmark scores at clients, and when someone quotes one at us we ask which benchmark and when it was last refreshed.',
        'Before recommending a model for a specific job, we assemble a set of the client’s own real material, redacted, and score candidates on it ourselves. It takes an afternoon and it answers the actual question. Small differences between the leading models are usually noise; the differences that matter show up on your documents or not at all.',
        'None of this is a secret technique. It is just the difference between buying a number and testing a tool.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'The SWE-Bench Illusion: When State-of-the-Art LLMs Remember Instead of Reason',
          publisher: 'Shanchao Liang, Spandan Garg, Roshanak Zilouchian Moghaddam — arXiv:2506.12286',
          year: '2025',
          url: 'https://arxiv.org/abs/2506.12286',
        },
        {
          title: 'Welcome to LLMflation',
          publisher: 'Guido Appenzeller, a16z',
          year: '2024',
          url: 'https://a16z.com/llmflation-llm-inference-cost/',
        },
      ],
    },
  ],
};
