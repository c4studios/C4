/**
 * Article — advertised context window against usable context window.
 *
 * Assembled 31 August 2026 from an evidence pack, then re-verified against
 * primary sources rather than trusting the pack. Every figure below was fetched
 * again for this file.
 *
 * SOURCE 1 — Hsieh, Sun, Kriman, Acharya, Rekesh, Jia, Zhang & Ginsburg,
 * "RULER: What's the Real Context Size of Your Long-Context Language Models?",
 * arXiv:2404.06654. Abstract verified verbatim 31 Aug 2026:
 *   · "We evaluate 17 long-context LMs with 13 representative tasks in RULER."
 *   · "Despite achieving nearly perfect accuracy in the vanilla NIAH test,
 *     almost all models exhibit large performance drops as the context length
 *     increases."
 *   · "While these models all claim context sizes of 32K tokens or greater,
 *     only half of them can maintain satisfactory performance at the length of
 *     32K."
 *   COI: authored at NVIDIA. Mitigating fact, and the article does not need to
 *   raise it: no NVIDIA model appears in the paper's results, and the two
 *   strongest models are Google's and OpenAI's.
 *
 * SOURCE 2 — Modarressi, Deilamsalehy, Dernoncourt, Bui, Rossi, Yoon &
 * Schütze, "NoLiMa: Long-Context Evaluation Beyond Literal Matching",
 * arXiv:2502.05167, submitted 7 Feb 2025. Abstract verified verbatim:
 *   · "We evaluate 13 popular LLMs that claim to support contexts of at least
 *     128K tokens."
 *   · "At 32K, for instance, 11 models drop below 50% of their strong
 *     short-length baselines."
 *   · "Even GPT-4o, one of the top-performing exceptions, experiences a
 *     reduction from an almost-perfect baseline of 99.3% to 69.7%."
 *   Claimed-vs-effective table verified from the project README, 31 Aug 2026.
 *   Definitions verbatim: base score is "a model's accuracy on the task at
 *   short contexts (250, 500, and 1K)"; effective length is "the longest
 *   context where a model maintains at least 85% of its base score".
 *   GPT-4.1 1M/16K, GPT-4o 128K/8K, Gemini 1.5 Pro 2M/2K, Llama 3.3 70B
 *   128K/2K.
 *   COI: Adobe Research co-authorship, with LMU Munich. Adobe sells document
 *   tooling.
 *   CRITICAL FRAMING: NoLiMa deliberately minimises lexical overlap between
 *   question and needle. These are effective lengths on a test built to defeat
 *   literal matching, NOT general-purpose effective lengths. The article says
 *   so immediately before the table. Without that sentence the table overstates.
 *
 * SOURCE 3 — Liu, Lin, Hewitt, Paranjape, Bevilacqua, Petroni & Liang,
 * "Lost in the Middle: How Language Models Use Long Contexts",
 * arXiv:2307.03172. Abstract verified verbatim: "performance is often highest
 * when relevant information occurs at the beginning or end of the input
 * context, and significantly degrades when models must access relevant
 * information in the middle of long contexts, even for explicitly long-context
 * models."
 *
 * SOURCE 4 — OpenAI, "Introducing GPT-4.1 in the API". openai.com returned 403
 * to a direct fetch, so the quote was confirmed by search against the page:
 * "Few real-world tasks are as straightforward as retrieving a single, obvious
 * needle answer." Context confirmed: OpenAI open-sourced the OpenAI-MRCR eval
 * precisely because single-needle retrieval is not representative.
 *
 * Do NOT add:
 *   - OpenAI's MRCR or Graphwalks percentages. I could not read them off the
 *     page myself, and the evidence pack noted the MRCR dataset was bug-fixed
 *     after those figures were published (roughly 10% of datapoints had too
 *     many target needles, roughly 5% had incorrect ground truth). The
 *     qualitative point stands without them and is stronger.
 *   - The widely-quoted "GPT-4.1 drops from 80% to around 50%". That phrasing
 *     appears nowhere in OpenAI's own text. It exists only in secondary
 *     coverage. Attributing it to OpenAI would be exactly the error this
 *     library exists to avoid.
 *   - Any exact percentage from Chroma's "Context Rot" report. Its numbers live
 *     inside plot images rather than in text, so they cannot be quoted to this
 *     standard. Chroma is also a vector-database company, which sells the
 *     remedy for the problem it reports.
 *   - Any 2026 flagship degradation figure. None is independently published.
 *     That absence is in the article as a finding.
 *
 * Page-to-token conversion is stated as an assumption in the article rather
 * than asserted: OpenAI's own guidance is roughly 0.75 words per token, and a
 * single-spaced page runs about 500 words.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['What the window', 'actually holds'],
    intro: [
      'Vendors now advertise context windows of a million tokens and more. The published research on what those models can reliably find in a long document tells a different story, and the gap is large enough to change how you use them.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'A context window is how much text you can hand a model at once. The advertised figure describes what it will accept. It does not describe how much it can reliably work with, and the difference is not small. On one published benchmark designed to test retrieval where the question does not share wording with the answer, GPT-4o held its accuracy to about 8,000 tokens against a claimed 128,000, and Gemini 1.5 Pro held to about 2,000 against a claimed two million. Models score near-perfectly on the simple version of this test, which is exactly why the simple version misleads. If you are planning to drop a long file into a model and trust what comes back, this is the thing to understand first.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The test everybody passes',
      body: [
        'The standard way to test long-context ability is called needle in a haystack. You hide one distinctive sentence inside a large body of text and ask the model to find it. It is easy to run, easy to explain, and it produces the near-perfect scores that appear in launch announcements.',
        'Almost every current model passes it comfortably. That is the problem. A test everything passes cannot tell you which thing to use, and it does not resemble the work you actually want done.',
        'Finding one planted sentence is not what you need when you hand over a contract. You need the model to hold several facts at once, connect them, notice the one that contradicts the others, and tell you where each came from.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What happens on a harder test',
      body: [
        'A team at NVIDIA built a benchmark called RULER to test exactly that. Instead of one needle, it runs thirteen task types across four categories: retrieval with multiple needles and distractors, tracing a chain of references through the text, aggregating information spread across the whole document, and answering questions with deliberate distracting material added.',
        'They ran seventeen models that all claimed to handle 32,000 tokens or more.',
      ],
    },

    {
      kind: 'quote',
      quote: 'Despite achieving nearly perfect accuracy in the vanilla NIAH test, almost all models exhibit large performance drops as the context length increases. While these models all claim context sizes of 32K tokens or greater, only half of them can maintain satisfactory performance at the length of 32K.',
      attribution: 'Hsieh et al., RULER, arXiv:2404.06654',
    },

    {
      kind: 'prose',
      body: [
        'Half of them, at a length every one of them advertised.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The test that is harder still',
      body: [
        'A second group, from Adobe Research and LMU Munich, noticed something about how these tests are usually built. If the planted sentence shares words with the question, a model can find it by matching words rather than by understanding anything. So they built a benchmark called NoLiMa where the question and the answer deliberately share almost no wording, and the model has to work out the connection.',
        'They measured each model twice. A base score on short inputs of 250 to 1,000 tokens, and then the longest input at which it still held 85% of that base score. They called the second figure the effective length.',
        'Read the next table with one thing in mind, because it matters. This is a test built specifically to defeat word matching, so these are not general-purpose limits. They are the point at which a model stops reliably making a connection it cannot make by matching words. That is a hard test on purpose, and plenty of real work is easier than it.',
      ],
    },

    {
      kind: 'table',
      heading: 'Claimed against measured, on NoLiMa',
      head: ['Model', 'Claimed window', 'Effective length', 'Base score'],
      rows: [
        ['GPT-4.1', '1M', '16K', '97.0'],
        ['GPT-4o', '128K', '8K', '99.3'],
        ['Gemini 1.5 Pro', '2M', '2K', '92.6'],
        ['Llama 3.3 70B', '128K', '2K', '97.3'],
      ],
    },

    {
      kind: 'prose',
      body: [
        'The paper reports that at 32,000 tokens, eleven of the thirteen models tested fell below half of their own short-context baseline. GPT-4o was named as one of the better performers and still went from 99.3% to 69.7%.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The vendors are not hiding this',
      body: [
        'It would be easy to write this up as marketing against reality. That is not quite what is happening.',
        'When OpenAI announced GPT-4.1 and its million-token window, the same page said plainly that few real-world tasks are as straightforward as retrieving a single, obvious needle answer. They then released a harder evaluation of their own, built around finding and telling apart several buried items rather than one, precisely because the simple test does not represent real use.',
        'So the caveat is published. It is just published underneath the headline number, and the headline number is the one that travels.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Where it sits in the file also matters',
      body: [
        'One more finding, and it is the oldest of them. Researchers at Stanford established that performance is often highest when the relevant information sits at the beginning or the end of the input, and degrades significantly when the model has to reach into the middle.',
        'This has a practical consequence people rarely act on. If the clause that matters is on page 200 of 400, it is sitting in the worst part of the window. Putting the important material at the top of what you send is not a trick. It is working with a documented property of the tool.',
      ],
    },

    {
      kind: 'prose',
      heading: 'So what about the 400-page file',
      body: [
        'Take an administration file, a discovery bundle, or a long contract with its schedules. Four hundred single-spaced pages runs to roughly 200,000 words. On OpenAI\'s own rule of thumb of about three quarters of a word per token, that is somewhere near 267,000 tokens.',
        'That is comfortably inside a million-token window and a long way outside every effective length measured above.',
        'Which does not mean a model cannot help you with it. It means handing over the whole thing and trusting a multi-fact answer is not supported by the evidence. Retrieve the relevant sections and reason over those. Ask for the passage each claim came from. Put what matters most near the front. None of that is exotic and all of it is cheaper than being confidently wrong about a file you are responsible for.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What we could not establish',
      body: [
        'The figures above come from models of 2024 and 2025. We went looking for equivalent independent measurements of the current flagship models and could not find any.',
        'What exists for the newest models is vendor self-reporting, and third-party articles that aggregate vendor self-reporting. There is no neutral, reproducible, published benchmark covering the current generation in the way RULER and NoLiMa covered the last one.',
        'So treat the degradation as a structural property of how these systems work rather than as a current spec sheet. The newest models are very likely better than the table above. Nobody has published the evidence of how much better, and until somebody does, the honest position is that we do not know.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'The million-token window is the single most repeated selling point in this market, and it is the one clients most often repeat back to us as a reason a project will be simple.',
        'We would rather set the expectation correctly at the start than explain a wrong answer later. A model that has been given the right 20,000 tokens will beat one that has been given the wrong 400,000, and building the first thing is most of the work we actually do.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'RULER: What\'s the Real Context Size of Your Long-Context Language Models?',
          publisher: 'Hsieh, Sun, Kriman, Acharya, Rekesh, Jia, Zhang & Ginsburg (NVIDIA) — arXiv:2404.06654',
          year: '2024',
          url: 'https://arxiv.org/abs/2404.06654',
        },
        {
          title: 'NoLiMa: Long-Context Evaluation Beyond Literal Matching',
          publisher: 'Modarressi, Deilamsalehy, Dernoncourt, Bui, Rossi, Yoon & Schütze (Adobe Research and LMU Munich) — arXiv:2502.05167. Claimed-against-effective figures from the project README.',
          year: '2025',
          url: 'https://arxiv.org/abs/2502.05167',
        },
        {
          title: 'Lost in the Middle: How Language Models Use Long Contexts',
          publisher: 'Liu, Lin, Hewitt, Paranjape, Bevilacqua, Petroni & Liang (Stanford) — arXiv:2307.03172',
          year: '2023',
          url: 'https://arxiv.org/abs/2307.03172',
        },
        {
          title: 'Introducing GPT-4.1 in the API',
          publisher: 'OpenAI. Source of the statement that few real-world tasks are as straightforward as retrieving a single, obvious needle answer.',
          year: '2025',
          url: 'https://openai.com/index/gpt-4-1/',
        },
      ],
    },
  ],
};
