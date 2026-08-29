/**
 * Article — what you actually agree to when you run AI on your own hardware.
 *
 * Every claim traced to a primary source and verified 29 August 2026.
 *
 * VERIFIED — Gemma Terms of Use, ai.google.dev/gemma/terms, read 29 Aug 2026:
 *   - §3.2 verbatim: "To the maximum extent permitted by law, Google reserves
 *     the right to restrict (remotely or otherwise) usage of any of the Gemma
 *     Services that Google reasonably believes are in violation of this
 *     Agreement."
 *   - "Gemma Services" is defined as "using, reproducing, modifying,
 *     distributing, performing or displaying any portion or element of Gemma,
 *     Model Derivatives including via any Hosted Service". So it covers plain
 *     use, not only Google-hosted use.
 *   - §1.1(c) defines "Gemma" as "the set of machine learning language models,
 *     trained model weights and parameters identified in the Appendix,
 *     regardless of the source that you obtained it from." Locally downloaded
 *     weights are therefore in scope.
 *   - §3.1(1) flow-down verbatim: "You must include the use restrictions
 *     referenced in Section 3.2 as an enforceable provision in any
 *     agreement...governing the use and/or distribution of Gemma or Model
 *     Derivatives and you must provide notice to subsequent users you
 *     Distribute to that Gemma or Model Derivatives are subject to the use
 *     restrictions in Section 3.2."
 *   - §3.2(1) incorporates the Gemma Prohibited Use Policy by reference.
 *
 * VERIFIED — Llama 4 Community License, developer.meta.com/ai/llama4/license/,
 * read 29 Aug 2026: 700 million monthly active user threshold, above which
 * "you must request a license from Meta, which Meta may grant to you in its
 * sole discretion"; "Built with Llama" must be prominently displayed; any AI
 * model created using Llama Materials must have a name beginning with "Llama".
 *
 * VERIFIED — CAISI Evaluation of DeepSeek AI Models, NIST Center for AI
 * Standards and Innovation, September 2025. Three DeepSeek models (R1,
 * R1-0528, V3.1) against four US models (GPT-5, GPT-5-mini, gpt-oss, Claude
 * Opus 4) across 19 benchmarks. Verbatim: agents based on R1-0528 were "on
 * average, 12 times more likely than evaluated U.S. frontier models to follow
 * malicious instructions designed to derail them from user tasks"; "Hijacked
 * agents sent phishing emails, downloaded and ran malware, and exfiltrated
 * user login credentials, all in a simulated environment"; R1-0528 "responded
 * to 94% of overtly malicious requests when a common jailbreaking technique
 * was used, compared with 8% of requests for U.S. reference models."
 *
 * VERIFIED — Epoch AI, "Open models lag state-of-the-art closed models by 4
 * months", epoch.ai/data-insights/open-closed-eci-gap. Since January 2026 the
 * most capable open-weight models have lagged frontier closed models by an
 * average of four months, or 8 ECI points, described as similar to the gap
 * between GPT-5 and GPT-5.5. Epoch's earlier October 2025 report measured a
 * three-month average across January 2023 to October 2025.
 *
 * Do NOT add:
 *   - Any claim that the Llama 4 licence restricts EU-domiciled users. This is
 *     widely repeated and it is NOT in the Llama 4 licence as read on
 *     29 Aug 2026. A comparable clause existed for earlier multimodal Llama
 *     releases; do not carry it forward.
 *   - Any claim that Gemma 4 moved to Apache 2.0. Unverified.
 *   - Any second NIST/CAISI DeepSeek report dated 2026. Unverified; only the
 *     September 2025 evaluation was confirmed.
 *   - Assertions that a specific Qwen or gpt-oss checkpoint is Apache 2.0.
 *     Licences vary between checkpoints. The article tells readers to open the
 *     LICENSE file themselves, which is the correct advice regardless.
 *   - Any cost or total-cost-of-ownership figure. That analysis rests on
 *     modelled assumptions and belongs in its own piece with the working shown.
 *
 * Not legal advice. Keep that line.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['Open weight is not', 'open source'],
    intro: [
      'Running AI on your own hardware is sold as ownership. The weights download for free, the box sits in your server room, and nothing leaves the building. Then you read the licence, and one of the popular models reserves the right to restrict your use of it remotely.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'A model you can download is not necessarily a model you are free to use. The licences differ enormously and several of the best-known ones are not open source in any recognised sense. Google\'s Gemma terms reserve the right to restrict use "remotely or otherwise", and they define the model as the weights "regardless of the source that you obtained it from", so that reservation is not limited to Google\'s own hosted service. Meta\'s Llama 4 licence requires you to display "Built with Llama" and to name any derivative model beginning with "Llama". Before you deploy anything on a client\'s hardware, open the LICENSE file and read it. It takes ten minutes and it is the step most people skip.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why this matters more on your own hardware, not less',
      body: [
        'When you call a hosted API, the commercial relationship is obvious. You have an account, you have terms, you pay a bill, and nobody is confused about who is providing what.',
        'On-premise feels different. You downloaded a file, you put it on a machine you bought, and the mental model is that you now own the thing. For a firm whose whole reason for going on-premise was control, that assumption is worth testing, because the licence travels with the weights.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The clause worth reading twice',
      body: [
        'Section 3.2 of the Gemma Terms of Use reads: "To the maximum extent permitted by law, Google reserves the right to restrict (remotely or otherwise) usage of any of the Gemma Services that Google reasonably believes are in violation of this Agreement."',
        'The natural reading of "Gemma Services" is Google\'s hosted product. The agreement does not define it that way. It defines it as "using, reproducing, modifying, distributing, performing or displaying any portion or element of Gemma, Model Derivatives including via any Hosted Service". Hosted service is one example inside the definition rather than the boundary of it. And "Gemma" itself is defined as the weights and parameters "regardless of the source that you obtained it from".',
        'So the reservation, on its own terms, reaches weights you downloaded and are running on a machine you own. What Google could do about it in practice on an isolated network is a separate question, and the agreement does not describe a mechanism. But a firm that believes it has bought independence should know that the agreement it accepted contains that reservation.',
        'There is a second obligation in the same terms that catches anyone building a product. Section 3.1(1) requires you to include the use restrictions "as an enforceable provision in any agreement" governing use or distribution, and to give notice to subsequent users. If you deploy a Gemma-based tool to your own clients, you are meant to be passing that chain down to them in writing.',
      ],
    },

    {
      kind: 'quote',
      quote: 'The licence travels with the weights. Buying the hardware does not change what you agreed to when you downloaded the model.',
    },

    {
      kind: 'prose',
      heading: 'Meta\'s version is milder, and still not open source',
      body: [
        'The Llama 4 Community License is more permissive in practice but it is not an open source licence either. Two obligations apply to essentially everyone.',
        'You have to display "Built with Llama" prominently on your website, interface, or product documentation. And any AI model you create using Llama materials has to have a name that begins with "Llama". For a firm building an internal tool that nobody outside sees, neither is burdensome. For anyone putting a product in front of clients, both are naming and branding decisions someone should make deliberately rather than discover later.',
        'There is also a threshold at 700 million monthly active users, above which "you must request a license from Meta, which Meta may grant to you in its sole discretion". No Australian professional services firm will ever reach it. It is worth knowing about anyway, because that single clause is the reason the licence cannot be called open source. An open source licence does not care how many users you have.',
        'One correction while we are here, because it circulates widely. You will read that Llama 4 cannot be used by companies domiciled in the European Union. That restriction is not in the Llama 4 licence as it stands. A comparable clause applied to earlier multimodal releases, and it has been carried forward by people summarising rather than reading.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The cheapest capable model carries a documented security finding',
      body: [
        'Licensing is not the only thing that differs. In September 2025 the Center for AI Standards and Innovation at the US National Institute of Standards and Technology published an evaluation of three DeepSeek models against four US models across 19 benchmarks.',
        'The finding that matters for anyone considering an agent is specific. Agents built on DeepSeek\'s most secure model in the evaluation were "on average, 12 times more likely than evaluated U.S. frontier models to follow malicious instructions designed to derail them from user tasks". In the test environment, "Hijacked agents sent phishing emails, downloaded and ran malware, and exfiltrated user login credentials".',
        'On jailbreaking, the same model "responded to 94% of overtly malicious requests when a common jailbreaking technique was used, compared with 8% of requests for U.S. reference models".',
        'DeepSeek models are genuinely capable and genuinely inexpensive, which is why they keep appearing in on-premise proposals. If the system will read untrusted material and take actions, that evaluation is a document your client should see before deciding, particularly if they are licensed.',
      ],
    },

    {
      kind: 'prose',
      heading: 'And the capability gap is real',
      body: [
        'Epoch AI tracks how far behind the open-weight models sit using a composite capability index. Since January 2026 the most capable open-weight models have lagged frontier closed models by an average of four months, or 8 index points, which Epoch describes as similar to the gap between GPT-5 and GPT-5.5.',
        'That gap has widened slightly. Epoch\'s earlier work measured a three-month average across January 2023 to October 2025. Four months is close enough that open models are now a serious option for retrieval, extraction, summarising and drafting. It is not close enough to pretend the choice is free.',
        'None of this is an argument against running models on your own hardware. There are good reasons to do it, and for some firms the reasons are decisive. It is an argument for going in with the licence read, the security evidence considered, and the capability trade-off stated out loud rather than glossed.',
      ],
    },

    {
      kind: 'process',
      heading: 'What to check before anything goes on a client\'s machine',
      steps: [
        {
          title: 'Open the LICENSE file on the exact checkpoint',
          text: 'Not the model family, the specific checkpoint you are deploying. Licences differ between releases within the same family and between a base model and its fine-tunes. What you want to see is Apache 2.0 or MIT. Anything else needs reading in full.',
        },
        {
          title: 'Look for a restriction or termination reservation',
          text: 'Search the text for "restrict", "terminate" and "sole discretion". You are looking for whether the licensor has reserved the ability to reach into your use after the fact, and on what grounds.',
        },
        {
          title: 'Look for flow-down obligations',
          text: 'If you are building something your client will give to their own staff or customers, check whether you are required to pass the restrictions on in writing. That obligation lands on them, so they should know about it before you build.',
        },
        {
          title: 'Check what has been incorporated by reference',
          text: 'Acceptable use and prohibited use policies are usually incorporated into the licence by a link. They are part of the agreement, they can be updated without you being told, and almost nobody opens them.',
        },
        {
          title: 'Check attribution and naming obligations',
          text: 'Some licences require a visible credit or a naming convention for anything you build. Both are cheap to comply with and awkward to retrofit once a product has a name and a logo.',
        },
        {
          title: 'Read the published security evaluations',
          text: 'Where an independent evaluation exists for a model you are considering, read it. For a firm that holds a licence of its own, having considered the evidence is worth more than having chosen the fastest model.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'We build [private AI](/private-ai) systems that run on a client\'s own hardware, so this is a question we have to answer honestly for every deployment. Choosing a model on capability alone and reading the licence afterwards is the wrong order, and we have seen it done that way.',
        'Publishing the checklist makes us easier to hold to it. If we deploy something on your hardware, you are entitled to ask which licence it carries and what it reserves.',
        'This is general information about publicly available licence terms and it is not legal advice. Every clause quoted here is linked to its source below. If a deployment matters to your business, have your own lawyer read the licence that applies to it.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'Gemma Terms of Use',
          publisher: 'Google',
          year: '2026',
          url: 'https://ai.google.dev/gemma/terms',
        },
        {
          title: 'Llama 4 Community License Agreement',
          publisher: 'Meta',
          year: '2026',
          url: 'https://developer.meta.com/ai/llama4/license/',
        },
        {
          title: 'CAISI Evaluation of DeepSeek AI Models Finds Shortcomings and Risks',
          publisher: 'National Institute of Standards and Technology, Center for AI Standards and Innovation',
          year: '2025',
          url: 'https://www.nist.gov/news-events/news/2025/09/caisi-evaluation-deepseek-ai-models-finds-shortcomings-and-risks',
        },
        {
          title: 'Open models lag state-of-the-art closed models by 4 months',
          publisher: 'Epoch AI',
          year: '2026',
          url: 'https://epoch.ai/data-insights/open-closed-eci-gap',
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'What is the difference between open weight and open source?',
      a: 'Open weight means you can download the model file. Open source is a licence category with recognised criteria, including no restrictions on who may use the software or for what purpose. Several popular downloadable models carry user thresholds, naming obligations, acceptable use policies or restriction reservations, so they are downloadable without being open source.',
    },
    {
      q: 'Can Google really disable a Gemma model running on my own server?',
      a: 'The terms reserve the right to restrict use "remotely or otherwise", and they define the model as the weights regardless of where you got them, so the reservation is not limited to Google\'s hosted service. The agreement does not describe how that would work on an isolated network, and we are not aware of it being tested. The point is that the reservation exists and you agreed to it.',
    },
    {
      q: 'Which licences are safe for a commercial on-premise deployment?',
      a: 'Apache 2.0 and MIT are the two to look for, because neither restricts who may use the software or for what. Rather than trusting a summary, open the LICENSE file on the specific checkpoint you intend to deploy. Licences vary between releases in the same family and between a base model and its fine-tunes.',
    },
    {
      q: 'Should we avoid DeepSeek models?',
      a: 'It depends on what the system does. The September 2025 NIST CAISI evaluation found agents built on DeepSeek\'s most secure model in that test were around 12 times more likely to follow malicious instructions than the US models evaluated. If your system reads untrusted content and takes actions, that finding is directly relevant. For an offline, non-agentic task it matters less.',
    },
    {
      q: 'How far behind are open models now?',
      a: 'Epoch AI measures an average lag of about four months, or 8 points on its capability index, since January 2026. That is close enough for retrieval, extraction, summarising and drafting to work well on your own hardware. It is not close enough to treat the choice as costless on complex reasoning.',
    },
  ],

  cta: {
    heading: 'We read the licence before we deploy it',
    text: 'If you are weighing AI that runs on your own hardware, we will go through the model options, the licences attached to them and what each one commits you to, before anything is installed.',
  },
};
