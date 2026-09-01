/**
 * Article — why multi-step agents fail more than the arithmetic suggests.
 *
 * Assembled 1 September 2026 from a research pack, then re-verified.
 *
 * SOURCE 1 — Yao, Shinn, Razavi & Narasimhan (Sierra), "τ-bench: A Benchmark
 * for Tool-Agent-User Interaction in Real-World Domains", arXiv:2406.12045.
 * Abstract verified verbatim 1 Sep 2026:
 *   · "We also propose a new metric (pass^k) to evaluate the reliability of
 *     agent behavior over multiple trials."
 *   · "Our experiments show that even state-of-the-art function calling agents
 *     (like gpt-4o) succeed on <50% of the tasks, and are quite inconsistent
 *     (pass^8 <25% in retail)."
 *   COI, stated in the article: Sierra sells customer-service AI agents and the
 *   benchmark measures customer-service agent tasks. Mitigating: the finding is
 *   adverse to the category they sell into.
 *   Strongest published disagreement, and the article carries it: a later
 *   log-analysis paper found flawed tasks in the airline split, and that
 *   correcting them roughly doubled pass^5. Some of the measured inconsistency
 *   is benchmark artefact.
 *
 * SOURCE 2 — Sinha, Arun, Goel, Staab & Geiping, "The Illusion of Diminishing
 * Returns: Measuring Long Horizon Execution in LLMs", arXiv:2509.09677,
 * submitted 11 Sep 2025. Comments field verified: "Published at ICLR 2026", so
 * peer reviewed. Abstract verified verbatim:
 *   · "the per-step accuracy of models degrades as the number of steps
 *     increases"
 *   · "we observe a self-conditioning effect -- models become more likely to
 *     make mistakes when the context contains their errors from prior turns"
 *   · "Self-conditioning does not reduce by just scaling the model size."
 *   · "we find that thinking mitigates self-conditioning"
 *   · "even marginal gains in single-step accuracy can compound into
 *     exponential improvements in the length of tasks a model can successfully
 *     complete"
 *
 * READ THE TITLE OF SOURCE 2 BEFORE EDITING THIS ARTICLE. It is called "The
 * Illusion of Diminishing Returns" and its headline argument is OPTIMISTIC:
 * short-task benchmarks understate progress. Using it only for the
 * self-conditioning finding would misrepresent the paper. The article carries
 * both halves and says which is the authors' headline. Do not cut that section.
 *
 * Do NOT add:
 *   - Any current τ-bench or τ²-bench leaderboard score. Every current figure
 *     in circulation is a vendor self-report, several run with modified
 *     scaffolds (raised step caps, policy addenda, extended thinking). The
 *     benchmark authors' own board stops at late-2024 models.
 *   - The exact self-conditioning effect sizes. They live in a figure image in
 *     the paper, not in the running text, so they are not quotable to this
 *     standard. Direction and the "below 50% within 15 turns" figure are.
 *   - Any GAIA number without naming the board and the scaffold. Scores range
 *     from about 45% for a bare model to over 90% for a scaffolded system, so a
 *     single unqualified GAIA figure is meaningless.
 *   - METR time-horizon figures as though precise. The confidence intervals are
 *     very wide, and the measure is software tasks only.
 *
 * The arithmetic needs no source. It is multiplication, and it is checked:
 * 0.95^20 = 0.3585, 0.99^20 = 0.8179, 0.99^100 = 0.366.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['Twenty steps at', 'ninety-five per cent'],
    intro: [
      'An AI agent that gets each step right 95% of the time finishes a twenty-step job about a third of the time. That is just multiplication. The measured evidence says the real number is worse, and for a reason worth understanding.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'Multiply it out. Ninety-five per cent per step, over twenty steps that each depend on the last, is 0.95 to the power of twenty, which is about 36%. Push per-step reliability to 99% and you get about 82%. That is the optimistic version, because it assumes each step fails independently of the others. Peer-reviewed work published this year shows they do not: a model that has made a mistake becomes more likely to make the next one, an effect the researchers call self-conditioning, and it does not go away by using a bigger model. So the honest planning number for a long chain of dependent steps sits below what the multiplication suggests. None of which means agents are useless. It means the number of steps between checks is the thing that decides whether one works.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The arithmetic, and why it surprises people',
      body: [
        'Nobody disputes this part. If a step succeeds with probability p, and every step has to succeed for the job to be done, the chance of finishing is p multiplied by itself once per step.',
        'What catches people out is how fast it falls. Ninety-five per cent sounds like a system that works. Across twenty dependent steps it finishes about a third of the time. Even 99% per step, which nothing currently achieves reliably, gives you about four jobs in five at twenty steps, and roughly a one in three chance of getting through a hundred steps clean.',
        'This is why a demo is a poor guide. A demo is one run of a short chain. Production is many runs of a long one.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What the measurement shows',
      body: [
        'Researchers at Sierra built a benchmark called τ-bench to test agents on realistic customer-service work: real tools, a policy to follow, and a simulated user to talk to. Sierra sells customer-service AI agents, which is worth knowing, though it makes the finding more notable rather than less, because the result is unflattering to the category they sell into.',
        'The useful thing they added was a metric. Most benchmarks report whether a model got a task right once. Sierra proposed measuring whether it gets the same task right every time across repeated attempts.',
      ],
    },

    {
      kind: 'quote',
      quote: 'Our experiments show that even state-of-the-art function calling agents (like gpt-4o) succeed on <50% of the tasks, and are quite inconsistent (pass^8 <25% in retail).',
      attribution: 'Yao, Shinn, Razavi and Narasimhan, τ-bench, arXiv:2406.12045',
    },

    {
      kind: 'prose',
      body: [
        'Succeeding on a task better than half the time, while succeeding on it eight times out of eight less than a quarter of the time, is the whole problem in one line. The agent can do the job. It cannot be relied on to do the job.',
        'One caveat belongs here. A later paper examining the benchmark logs found genuine flaws in some of the airline tasks, and reported that correcting them roughly doubled the consistency score. So some of the measured inconsistency is the benchmark rather than the agent. The gap is smaller than the headline. It has not closed.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The part that makes it worse than the multiplication',
      body: [
        'The arithmetic assumes each step is a fresh roll of the dice. Work published at ICLR this year says otherwise.',
        'The researchers separated out execution from reasoning by handing models the knowledge and the plan, so the only thing being tested was carrying out a long sequence correctly. They found accuracy on each individual step falling as the sequence got longer, which is unsurprising. Then they tested why, by injecting artificial histories containing errors the model had not actually made, and measuring what happened next.',
      ],
    },

    {
      kind: 'quote',
      quote: 'This is not just due to long-context limitations — curiously, we observe a self-conditioning effect — models become more likely to make mistakes when the context contains their errors from prior turns. Self-conditioning does not reduce by just scaling the model size.',
      attribution: 'Sinha, Arun, Goel, Staab and Geiping, ICLR 2026, arXiv:2509.09677',
    },

    {
      kind: 'prose',
      body: [
        'A mistake in the transcript makes the next mistake more likely. Errors are correlated rather than independent, which means real failure over a long chain is worse than p to the power n, not better. And a bigger model does not fix it.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The same paper argues the opposite, and that matters',
      body: [
        'It would be easy to quote only the pessimistic half of that study. Its title is "The Illusion of Diminishing Returns", and its headline argument runs the other way.',
        'The authors say short benchmarks make progress look like it is slowing when it is not, because small improvements in per-step accuracy compound into large increases in the length of task a model can finish. The same multiplication that punishes you at 95% rewards you enormously as you approach 99%. They also found that models which reason before acting are less prone to self-conditioning, and can sustain far longer sequences in one go.',
        'So the fair reading is narrower than either camp wants. Long chains fail faster than people expect, the mechanism is real and is not solved by scale, and the trajectory is genuinely improving.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The measurement nobody publishes',
      body: [
        'Here is the thing worth carrying into a vendor meeting.',
        'Every improvement figure you will be shown is a single-attempt number. Did it solve the task, once. That is what benchmark scores, resolve rates and time-horizon measures all report, and by those measures capability really is rising quickly.',
        'The metric that matters for a chain of dependent steps is consistency, whether it solves the same task every time. That metric exists, it was defined by the people who built the benchmark, and it collapses. We went looking for a current frontier model with a published consistency figure and could not find one.',
        'A vendor showing you a rising single-attempt score has not answered the question you need answered.',
      ],
    },

    {
      kind: 'list',
      heading: 'What to do with this',
      items: [
        'Count the steps between human checks. That number, more than the model, predicts whether the thing works.',
        'Put a gate where an error becomes expensive rather than at the end. A wrong figure caught at step three costs a minute. Caught after it has gone to a client it costs the relationship.',
        'Ask a vendor for consistency, not accuracy. Run the same task ten times and count how many times it is right. That is a morning of work and it answers more than any benchmark.',
        'Prefer short chains that run often over long chains that run once. Five reliable three-step jobs beat one fragile fifteen-step one, and they fail in ways you can see.',
        'Watch for a mistake early in a run. The evidence says the next one is more likely, so a run that has gone wrong once is worth restarting rather than nursing.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'We build these systems, and the most common thing a client asks for is the longest possible chain. Take the enquiry, check the file, draft the response, update the record, send it. Every step added feels like more value.',
        'The arithmetic says otherwise, and it is one line of multiplication that anyone can check. We would rather hand it over at the quoting stage than explain later why a system that demonstrated beautifully is wrong one time in three.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains',
          publisher: 'Yao, Shinn, Razavi & Narasimhan (Sierra) — arXiv:2406.12045. Source of the pass^k metric and the consistency figures.',
          year: '2024',
          url: 'https://arxiv.org/abs/2406.12045',
        },
        {
          title: 'The Illusion of Diminishing Returns: Measuring Long Horizon Execution in LLMs',
          publisher: 'Sinha, Arun, Goel, Staab & Geiping — arXiv:2509.09677, published at ICLR 2026. Source of the self-conditioning finding and of the compounding-gains argument.',
          year: '2026',
          url: 'https://arxiv.org/abs/2509.09677',
        },
      ],
    },
  ],
};
