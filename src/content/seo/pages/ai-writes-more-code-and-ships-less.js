/**
 * Article — the measurement problem in AI-assisted development.
 *
 * Two independent datasets, different methods, same direction. Both verified
 * 2 September 2026.
 *
 * VERIFIED — METR, "Measuring the Impact of Early-2025 AI on Experienced
 * Open-Source Developer Productivity", Becker, Rush, Barnes, Rein,
 * arXiv:2507.09089, submitted 12 July 2025, v2 25 July 2025. Randomised
 * controlled trial. 16 developers, 246 tasks, mature projects on which they
 * averaged five years of prior experience. Tools when AI was allowed: primarily
 * Cursor Pro and Claude 3.5/3.7 Sonnet. Verbatim from the abstract: developers
 * "forecast that allowing AI will reduce completion time by 24%"; "After
 * completing the study, developers estimate that allowing AI reduced completion
 * time by 20%"; "we find that allowing AI actually increases completion time by
 * 19%". Expert forecasts: economists 39% shorter, ML experts 38% shorter.
 * NO VENUE STATED on the arXiv listing.
 *
 * VERIFIED — LinearB, 2026 Software Engineering Benchmarks Report. 8.1 million
 * pull requests across 4,800 teams in 42 countries. Verified 2 September 2026:
 * AI-assisted pull requests merge at less than half the rate of human-authored
 * code, with bot-authored code landing 32.7% of the time against 84.4% for
 * human-authored; AI-assisted PRs wait 5.3 times longer for a reviewer to pick
 * them up; at the 75th percentile AI PRs run 408 lines against 157 for
 * unassisted work; AI code contains roughly 1.7x more issues per pull request;
 * 88.3% of developers now use AI regularly, up from just under 72% in early 2024.
 *
 * Do NOT add:
 *   - A publication venue for the METR paper. The arXiv listing states none.
 *   - Any claim that AI code is "worse" in a general sense. The measured claims
 *     are about merge rate, review latency, PR size and issues per PR. Nothing
 *     here measures correctness of shipped code.
 *   - The MIT NANDA 95% figure. It does not survive tracing. See VERIFIED-CLAIMS.
 *   - Any productivity multiplier from a vendor.
 *   - Author affiliations for the METR paper. Not listed on the abstract page.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['AI writes more code', 'and ships less of it'],
    intro: [
      'Two studies, different methods, no connection to each other. One measured what developers actually did against what they believed. The other counted 8.1 million pull requests. They point the same way, and it is not the way the sales pitch goes.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'AI assistance produces more code and a smaller share of it reaches production. In a randomised trial, experienced developers believed AI had made them 20% faster and measurement showed it made them 19% slower. Across 8.1 million pull requests, AI-authored code merged 32.7% of the time against 84.4% for human-authored code, and waited more than five times longer for a reviewer. Neither study says the tools do not work. Both say the bottleneck moved from writing code to reviewing it, and almost nobody has budgeted for that.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The trial where everyone guessed wrong',
      body: [
        'In 2025 a research group ran a randomised controlled trial on sixteen experienced open-source developers across 246 real tasks. These were not toy problems. They were jobs in mature codebases the developers had worked in for an average of five years. Each task was randomly assigned to allow or forbid AI tooling.',
        'Before starting, the developers forecast that being allowed to use AI would cut their completion time by 24%. After finishing, having lived through it, they estimated it had cut their time by 20%.',
        'Measured, allowing AI increased completion time by 19%.',
        'The gap between what they experienced and what happened is the finding. It was not a small error and it did not go in the direction of caution. Two independent expert groups were asked to predict the result beforehand: economists said 39% faster, machine learning researchers said 38% faster. Everyone was confidently wrong in the same direction.',
      ],
    },

    {
      kind: 'quote',
      quote: 'They believed it made them 20% faster. Measurement said 19% slower. Nobody in the study noticed while it was happening.',
    },

    {
      kind: 'prose',
      heading: 'What eight million pull requests show',
      body: [
        'The second study is much larger and asks a different question. It looked at 8.1 million pull requests across 4,800 teams in 42 countries, and compared what happened to AI-assisted code against human-authored code once it entered review.',
        'Adoption is not in question. Around 88% of developers in that dataset now use AI regularly, up from just under 72% in early 2024. The tools are in the building.',
        'What happens next is the interesting part. AI-authored pull requests merged 32.7% of the time. Human-authored ones merged 84.4% of the time. Fewer than half as often.',
        'They also waited 5.3 times longer before a reviewer picked them up, and they were substantially bigger, running 408 lines at the 75th percentile against 157 for unassisted work. The report also found roughly 1.7 times more issues per pull request in AI-authored code.',
        'Put plainly, more code is being written, it arrives in larger pieces, it sits in the queue longer, and a much smaller share of it survives review.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why the two studies agree without being about the same thing',
      body: [
        'One study measured individual task time under controlled conditions. The other counted outcomes across thousands of teams. They share no authors, no method and no dataset.',
        'What they share is a direction. Generation got faster and cheaper. Review did not. Every line an assistant produces still has to be read by someone who understands the system it is going into, and that person is the same person they were last year.',
        'That is the whole mechanism. The constraint was never typing.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What this does not say',
      body: [
        'It does not say the tools are useless. Both studies measure experienced people working in code they know well, which is the scenario where assistance helps least. Other research consistently finds the largest gains go to less experienced people on narrower, well-defined tasks.',
        'It does not say AI-written code is wrong. The measured claims are about merge rate, review latency, pull request size and issues raised in review. None of them measures the correctness of code that actually shipped.',
        'And it does not say the effect is permanent. Both studies describe tools at a moment in time, and that moment was 2025 into 2026.',
        'What it does say is that self-reported productivity is not evidence. The developers in the trial were not careless or dishonest. They were wrong about their own experience by 39 percentage points, and they had every reason to notice.',
      ],
    },

    {
      kind: 'process',
      heading: 'What to do with this if you run a team',
      steps: [
        {
          title: 'Stop surveying people about whether it helps',
          text: 'The trial is the clearest evidence available that asking produces a confident answer unrelated to what happened. If your only measurement is how the team feels, you do not have a measurement.',
        },
        {
          title: 'Measure the thing you actually care about',
          text: 'Not lines written or suggestions accepted. Time from work starting to work merged, and the share of work that merges at all. Both studies point at the same two numbers.',
        },
        {
          title: 'Look at your review queue before you look at your tooling',
          text: 'If AI-assisted work waits five times longer to be picked up, the constraint is reviewer capacity. Buying more generation makes that worse rather than better.',
        },
        {
          title: 'Watch the size of what arrives',
          text: 'Larger pull requests are harder to review properly and more likely to be waved through or abandoned. A 408-line change and a 157-line change are not the same object.',
        },
        {
          title: 'Expect gains where the evidence puts them',
          text: 'Newer people, narrower tasks, well-defined work, unfamiliar code. Not senior people doing complex work in systems they built.',
        },
        {
          title: 'Run it for a fortnight before you decide',
          text: 'Two weeks of merge-rate and cycle-time data on your own team beats any published figure, including these ones.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'We build software and we use these tools daily. We would rather say what the measurements show than repeat a productivity multiplier from a vendor deck.',
        'The same discipline applies to everything else we recommend. Our position on that is at [how we use AI](/how-we-use-ai), and where the honest answer is that a benchmark cannot support the claim being made from it, we have written about that too in [what benchmark scores do not tell you](/what-ai-benchmark-scores-dont-tell-you).',
        'If you are being sold a productivity figure for your development team, ask which study it came from and how it was measured. That question is usually enough.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity',
          publisher: 'Becker, Rush, Barnes & Rein, arXiv:2507.09089',
          year: '2025',
          url: 'https://arxiv.org/abs/2507.09089',
        },
        {
          title: '2026 Software Engineering Benchmarks Report',
          publisher: 'LinearB',
          year: '2026',
          url: 'https://linearb.io/resources/software-engineering-benchmarks-report',
        },
        {
          title: '8 million pull requests reveal where engineering productivity breaks down',
          publisher: 'LinearB',
          year: '2026',
          url: 'https://linearb.io/blog/8-million-prs-engineering-productivity',
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'Does this mean AI coding tools do not work?',
      a: 'No. It means the measured effect on experienced developers working in code they know well was negative, and that a smaller share of AI-authored code survives review. Other research consistently finds real gains for less experienced people on narrower, better-defined tasks. The tools work; the question is who benefits and where.',
    },
    {
      q: 'Why did the developers think they were faster?',
      a: 'The study does not settle that. What it establishes is the size of the gap: they forecast 24% faster, estimated 20% faster afterwards, and measurement showed 19% slower. Two expert groups predicted around 38% faster. The useful takeaway is that self-report is not evidence, however experienced the person reporting.',
    },
    {
      q: 'What does a 32.7% merge rate actually mean?',
      a: 'Of AI-authored pull requests raised across that dataset, roughly one in three was merged. For human-authored pull requests it was closer to five in six. It measures what survived review, not whether the code was correct.',
    },
    {
      q: 'How big was each study?',
      a: 'The randomised trial used 16 developers across 246 tasks, which is small but controlled and randomised. The benchmarks report covered 8.1 million pull requests across 4,800 teams in 42 countries, which is large but observational. Their weaknesses are different, which is part of why the agreement between them is interesting.',
    },
    {
      q: 'What should we measure instead of asking the team?',
      a: 'Time from work starting to work merged, and the proportion of work that merges at all. Track the size of pull requests and how long they wait for a reviewer. Two weeks of your own data is worth more than any published figure.',
    },
  ],

  cta: {
    heading: 'We measure before we recommend',
    text: 'If someone has quoted you a productivity figure for AI in your team, we will help you work out whether it holds on your own numbers. Usually that takes a fortnight of data and one conversation.',
  },
};
