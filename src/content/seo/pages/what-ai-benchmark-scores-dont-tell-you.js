/**
 * Article — why benchmark scores are a poor basis for buying AI.
 *
 * Three peer-reviewed sources, each read on arXiv and verified 29 August 2026.
 * No vendor claims, no leaderboard figures, no model comparisons.
 *
 * VERIFIED — Akhtar, Reuel, Soni, Ahuja et al., "When AI Benchmarks Plateau:
 * A Systematic Study of Benchmark Saturation", arXiv:2602.16763, submitted
 * 18 February 2026. Abstract verbatim: benchmarks were analysed "across 60
 * language model benchmarks using 14 properties that relate to saturation";
 * "nearly half of our benchmarks exhibit saturation, with rates increasing
 * with age"; "resilience to saturation is impacted by expert-curation, not by
 * public test data".
 *
 * VERIFIED — Bean, Kearns, Romanou, Hafner, Mayne et al., "Measuring what
 * Matters: Construct Validity in Large Language Model Benchmarks",
 * arXiv:2511.04703, submitted 3 November 2025. 445 benchmarks reviewed by 29
 * expert reviewers. Verbatim: "Once the responses were scored, 16.0% used
 * uncertainty estimates or statistical tests to compare the results." Also
 * verified from the paper body: 78.2% provided phenomenon definitions, of
 * which 52.2% used widely agreed-upon definitions; 47.8% addressed contested
 * or unclear phenomena; 40.7% used constructed rather than real-world tasks;
 * 81.3% relied on exact matching for scoring; 53.4% presented evidence for
 * construct validity; 61.2% treated phenomena as composite.
 *
 * VERIFIED — Liang, Garg & Zilouchian Moghaddam, "The SWE-Bench Illusion:
 * When State-of-the-Art LLMs Remember Instead of Reason", arXiv:2506.12286,
 * submitted 14 June 2025, last revised 1 December 2025. Abstract verbatim:
 * models "achieve up to 76% accuracy in identifying buggy file paths using
 * only issue descriptions, without access to repository structure. This
 * performance is merely up to 53% on tasks from repositories not included in
 * SWE-Bench". Function reproduction: "up to 35% consecutive 5-gram accuracy
 * on SWE-Bench Verified and Full, but only up to 18% for tasks in other
 * benchmarks".
 *
 * Do NOT add:
 *   - Publication venues. None of the three arXiv listings states a
 *     conference. Claims that these appeared at ICML or NeurIPS could not be
 *     substantiated and must not be repeated.
 *   - Author affiliations. Not listed on the arXiv abstract pages read.
 *   - The claim that OpenAI stopped reporting its SWE-bench Verified score.
 *     Widely repeated, not verified against a primary source.
 *   - Any Sindex threshold figures for the saturation paper. The commonly
 *     circulated "29 of 60 / 14 very high" sentence does not appear in the
 *     abstract. Use the paper's own "nearly half" language.
 *   - Any named model comparison or leaderboard position. The argument does
 *     not need one and it would date within weeks.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['What benchmark scores', 'do not tell you'],
    intro: [
      'Someone is going to show your board a chart where their AI scores 94 and the alternative scores 91. Three separate studies published since late 2025 explain why that chart cannot carry the weight being put on it, and what to do instead.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'Benchmark scores are a poor basis for choosing an AI system for your business. A review of 445 benchmarks found only 16% used any statistical test when comparing results, so most published gaps have no error bars. A study of 60 language model benchmarks found nearly half have saturated, meaning they no longer separate the leading systems. And at least one heavily cited benchmark has been shown to reward memorisation rather than reasoning. None of this makes the models bad. It makes the scores a weak reason to prefer one over another, and it means the only test that answers your question is one run on your own documents.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why this matters to a firm that is buying, not building',
      body: [
        'You are not going to read an evaluation paper. You are going to sit in a room while someone shows you a slide, and the slide will have numbers on it. The question worth answering is how much those numbers should move your decision.',
        'The short answer is less than the slide implies, and the reasons are now documented in the research rather than being a matter of opinion. That is a useful thing to know before you spend money, and it is a fair thing to raise with anyone selling to you.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Most published comparisons have no error bars',
      body: [
        'In November 2025 a group of researchers published a systematic review of 445 language model benchmarks, assessed by 29 expert reviewers. They were looking at construct validity, which is the question of whether a test measures the thing it claims to measure.',
        'The finding that matters most for a buyer is blunt. In the paper\'s own words: "Once the responses were scored, 16.0% used uncertainty estimates or statistical tests to compare the results."',
        'Six out of seven benchmark comparisons reported no statistical test at all. So when a chart shows 94 against 91, there is usually nothing in the underlying work telling you whether that three-point gap would survive being run again. It might be a real difference. It might be noise. The published result frequently does not say.',
        'The rest of the review is consistent with that. Only 53.4% presented any evidence for construct validity. 47.8% were measuring phenomena the field does not clearly agree on. 40.7% used constructed tasks rather than real-world ones, and 81.3% scored answers by exact matching, which is the crudest method available and punishes a correct answer phrased differently.',
      ],
    },

    {
      kind: 'quote',
      quote: 'Six out of seven benchmark comparisons report no statistical test. When someone shows you 94 against 91, the underlying work usually cannot tell you whether that gap is real.',
    },

    {
      kind: 'prose',
      heading: 'Nearly half of benchmarks have stopped discriminating',
      body: [
        'A second study, published in February 2026, looked at benchmark saturation across 60 language model benchmarks using 14 properties. Saturation is what happens when the leading systems all cluster near the ceiling. The test still produces a number, but the number stops telling you which system is better.',
        'The finding: "nearly half of our benchmarks exhibit saturation, with rates increasing with age." The older a benchmark is, the more likely it has stopped being useful, which is awkward because the older benchmarks are the ones with the most name recognition and therefore the ones most likely to appear on a slide.',
        'The same paper contains a result that runs against common sense and is worth carrying into a vendor conversation. The authors found that "resilience to saturation is impacted by expert-curation, not by public test data." Keeping the test set secret is not what protects a benchmark. Careful expert design is. That matters because "our test set is private" is a claim vendors make, and on this evidence it is not the reassurance it sounds like.',
      ],
    },

    {
      kind: 'prose',
      heading: 'At least one famous benchmark rewards memory',
      body: [
        'The third study is the most concrete, and it has an article of its own here. Researchers asked whether a model could name the file containing a bug when given only the issue description and no access to the repository. It should not be able to. It managed up to 76% accuracy anyway, falling to merely up to 53% on repositories outside the benchmark.',
        'The short version is that part of a headline score can reflect having seen the answer during training rather than working it out, and from outside you cannot tell which. "When the model has seen the test" walks through that study in full.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What benchmarks are still good for',
      body: [
        'This is not an argument that evaluation is worthless, and you should be suspicious of anyone who takes it that way. Benchmarks are how the field makes progress legible, and a model that scores badly across the board is genuinely worse than one that does not.',
        'The honest position is narrower. A benchmark tells you something useful when it matches the work you actually do, when it has not saturated, and when the result comes with some indication of variance. Most of the numbers put in front of buyers meet none of those conditions. A large gap between a leading system and a laggard is informative. A small gap between two leading systems usually is not.',
      ],
    },

    {
      kind: 'process',
      heading: 'What to do instead',
      steps: [
        {
          title: 'Build a test set out of your own work',
          text: 'Thirty to fifty real tasks, taken from documents your firm actually handles, redacted where needed. The point is that it looks like your work rather than someone else\'s benchmark. This is a morning\'s job and it outlasts every model release.',
        },
        {
          title: 'Write down the right answers first',
          text: 'Before you run anything, record what a good answer looks like for each task. Doing this afterwards means grading against whatever the machine produced, which is how firms talk themselves into being impressed.',
        },
        {
          title: 'Run every candidate on the same set',
          text: 'Same tasks, same order, same instructions. If two systems come out close, treat them as equivalent and choose on price, data handling and reliability instead. Those differ far more between vendors than capability does.',
        },
        {
          title: 'Run it more than once',
          text: 'These systems are not deterministic. Running each task twice will show you how much the output moves on its own, which is the variance the published comparisons mostly do not report.',
        },
        {
          title: 'Ask the vendor which benchmark and how old it is',
          text: 'A fair question, politely asked. If the score comes from a well-known benchmark several years old, saturation is a live possibility and it is reasonable to ask what a newer or task-matched evaluation shows.',
        },
        {
          title: 'Keep it and re-run it',
          text: 'When a new model appears, you already have the test. This is the difference between having an opinion about AI and having evidence about it, and it costs you one morning.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'We sell [AI training for businesses](/ai-training-for-business) and we get asked which model is best. The honest answer is that it depends on your documents, and that the way to find out takes a morning and produces a better answer than any chart.',
        'We would rather hand over the method than have clients choose on a number nobody has tested. It also makes us easier to check, because the same test that grades a vendor grades us.',
        'Where the deciding factor is confidentiality rather than capability, the comparison changes shape entirely, and that is what [private AI](/private-ai) is about. Our own position on using these tools in client work is at [how we use AI](/how-we-use-ai).',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'Measuring what Matters: Construct Validity in Large Language Model Benchmarks',
          publisher: 'Bean, Kearns, Romanou, Hafner, Mayne et al., arXiv:2511.04703',
          year: '2025',
          url: 'https://arxiv.org/abs/2511.04703',
        },
        {
          title: 'When AI Benchmarks Plateau: A Systematic Study of Benchmark Saturation',
          publisher: 'Akhtar, Reuel, Soni, Ahuja et al., arXiv:2602.16763',
          year: '2026',
          url: 'https://arxiv.org/abs/2602.16763',
        },
        {
          title: 'The SWE-Bench Illusion: When State-of-the-Art LLMs Remember Instead of Reason',
          publisher: 'Liang, Garg & Zilouchian Moghaddam, arXiv:2506.12286',
          year: '2025',
          url: 'https://arxiv.org/abs/2506.12286',
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'Are AI benchmarks useless?',
      a: 'No. They are how the field tracks progress, and a system that scores poorly across many benchmarks is genuinely weaker. The problem is using small differences between leading systems to make a purchasing decision. A large gap tells you something. A three-point gap usually does not, because most published comparisons report no statistical test.',
    },
    {
      q: 'What does benchmark saturation mean?',
      a: 'It means the leading systems have all clustered near the maximum score, so the test no longer separates them. A February 2026 study of 60 language model benchmarks found nearly half had saturated, and that older benchmarks saturate more. Those are also the benchmarks most likely to be quoted at you.',
    },
    {
      q: 'What is benchmark contamination?',
      a: 'It is when material from the test has appeared in the model\'s training data, so the model can partly recall the answer rather than work it out. Research on SWE-bench found models identifying the correct file from an issue description alone at up to 76% accuracy with no access to the repository, against up to 53% on repositories outside the benchmark.',
    },
    {
      q: 'How do I test AI properly for my own business?',
      a: 'Assemble thirty to fifty real tasks from your own work, write down what a good answer looks like before you start, then run every candidate on the same set and run it twice. If two systems come out close, decide on price, data handling and reliability instead. It takes a morning and it keeps working as new models appear.',
    },
    {
      q: 'A vendor told me their evaluation uses a private test set. Is that better?',
      a: 'Not necessarily. The February 2026 saturation study found that resilience to saturation came from expert curation rather than from keeping test data private. A privately held test set is also one you cannot inspect, so it is reasonable to ask how it was designed and what it contains.',
    },
  ],

  cta: {
    heading: 'We will build the test set with you',
    text: 'Half a day putting your own documents in front of the systems you are considering, with the answers written down first. You keep the test and re-run it whenever something new turns up.',
  },
};
