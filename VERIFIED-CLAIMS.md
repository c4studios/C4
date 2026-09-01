# Verified claims — the only facts cleared for publication

Read this alongside `ARTICLE-DRAFTER-BRIEF.md`. Last updated 30 August 2026.

**How to use it.** Everything in Part 1 was read at its primary source on the
date shown and can go into an article as written. Everything in Part 2 failed
verification, or is widely repeated and wrong, and must never appear.

**Anything not in this file has not been checked.** If a research pack hands
you a claim that is not here, verify it at the primary source yourself or cut
it. Do not assume a plausible-sounding number is safe because it appeared in a
research document.

**The recurring failure mode to watch for.** Across seven research modules the
pattern was consistent: real paper, roughly correct figures, **invented
publication venue**. Three separate papers were attributed to conferences that
their arXiv listings do not mention. Never state a venue, journal or conference
unless it appears verbatim on the page you read. If it is not there, say
nothing about where it was published.

---

# PART 1 — Cleared for publication

## 1. Microsoft Customer Copyright Commitment
Source: Microsoft Learn, "Customer Copyright Commitment Required Mitigations".
Read 29 Aug 2026; page last updated 13 July 2026.
https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/customer-copyright-commitment

- The CCC is "a provision in the Microsoft Product Terms that describes
  Microsoft's obligation to defend customers against certain third-party
  intellectual property claims relating to Output Content."
- The required mitigations "apply only to customers using Azure OpenAI in
  Microsoft Foundry Models ... and other Covered Products with configurable
  Metaprompts or other safety systems ("Configurable GAI Services"). **They do
  not apply to customers using other Covered Products including Copilots with
  safety systems that are fixed.**"
- "The only Configurable GAI Services are Microsoft Copilot Studio and GitHub
  Copilot."
- Two universal required mitigations, both effective 1 December 2023: a
  metaprompt directing the model to prevent copyright infringement, and a
  testing and evaluation report retained by the customer and provided to
  Microsoft in the event of a claim.
- Azure OpenAI per use case, effective 1 December 2023. Code generation: the
  protected material code model on in annotate or filter mode, plus Prompt
  Shield in filter mode. Text generation: the protected material text model on
  in filter mode, plus Prompt Shield in filter mode. Image generation,
  transcription and all other use cases: no additional requirements.
- Asynchronous filter caveat, effective 21 May 2024: output retroactively
  flagged as protected material is not covered.
- GitHub Offerings, effective 3 April 2026: no additional required mitigations.
  The Duplicate Detection filter is no longer required and remains optional.
- Copilot Studio, effective 1 June 2025: output from a model hosted outside
  Copilot Studio is not covered unless that model runs in Azure OpenAI and meets
  the required mitigations.
- Customers have six months from publication of a new mitigation to implement it.

**Do not claim** what Microsoft pays. The page says "defend". The financial
terms are in the Product Terms, which has not been read.

## 2. Microsoft 365 Copilot — Australian processing
Source: Microsoft 365 Blog, 4 November 2025. Verified 30 Aug 2026.

- Local data **inferencing** for Copilot interactions is expected to become
  available in Australia, India, the UAE, the UK and the US **by the end of
  2026**.
- The original plan was Australia, India, Japan and the UK by end of 2025.
- **Microsoft revised the timeline and scope on 3 April 2026.**
- Therefore: Australian data **residency** (storage) is available. In-country
  **processing** is not confirmed and must be verified per tenant.

## 3. Privacy Act — automated decision-making
Source: OAIC, APP 1 guidelines. Read 29 Aug 2026.

- APP 1.7, 1.8 and 1.9 commence **10 December 2026**, introduced by the
  *Privacy and Other Legislation Amendment Act 2024* (Cth).
- The obligation arises where an entity "arrange[s] for a computer program to
  use personal information to make a decision that could reasonably be expected
  to significantly affect the rights or interests of an individual."
- APP 1.8 requires the privacy policy to address "the kinds of personal
  information used in the operation of computer programs", "the kinds of
  decisions made solely by the operation of computer programs", and "the kinds
  of decisions for which a thing, that is substantially and directly related to
  making the decision, is done by the operation of such computer programs".
- APP 1.9: making a decision includes "refusing or failing to make a decision",
  and applies whether outcomes benefit or harm the individual.
- It is a **transparency obligation, not a prohibition**.

## 4. Australia has no AI Act coming
Source: National AI Plan, 2 December 2025; ABC News same-day reporting plus
multiple law-firm summaries. Verified 30 Aug 2026.

- The government abandoned the ten mandatory AI guardrails proposed in 2024.
- AI is to be regulated through existing technology-neutral law.
- The Productivity Commission had called for a pause on economy-wide AI
  regulation in August 2025.

## 5. Model licences

**Gemma Terms of Use.** https://ai.google.dev/gemma/terms — read 29 Aug 2026.
- §3.2 verbatim: "To the maximum extent permitted by law, Google reserves the
  right to restrict (remotely or otherwise) usage of any of the Gemma Services
  that Google reasonably believes are in violation of this Agreement."
- "Gemma Services" is defined as "using, reproducing, modifying, distributing,
  performing or displaying any portion or element of Gemma, Model Derivatives
  including via any Hosted Service" — so it covers plain use, not only hosted use.
- §1.1(c) defines "Gemma" as the models, weights and parameters "regardless of
  the source that you obtained it from" — locally downloaded weights are in scope.
- §3.1(1) verbatim: "You must include the use restrictions referenced in
  Section 3.2 as an enforceable provision in any agreement...governing the use
  and/or distribution of Gemma or Model Derivatives and you must provide notice
  to subsequent users you Distribute to that Gemma or Model Derivatives are
  subject to the use restrictions in Section 3.2."
- §3.2(1) incorporates the Gemma Prohibited Use Policy by reference.

**Llama 4 Community License.** https://developer.meta.com/ai/llama4/license/ —
read 29 Aug 2026.
- 700 million monthly active user threshold, above which "you must request a
  license from Meta, which Meta may grant to you in its sole discretion".
- "Built with Llama" must be prominently displayed.
- Any AI model created using Llama Materials must have a name beginning with
  "Llama".
- **There is no EU restriction in this licence.** See Part 2.

## 6. NIST CAISI evaluation of DeepSeek
Source: NIST Center for AI Standards and Innovation, September 2025.
https://www.nist.gov/news-events/news/2025/09/caisi-evaluation-deepseek-ai-models-finds-shortcomings-and-risks

- Three DeepSeek models (R1, R1-0528, V3.1) evaluated against four US models
  (GPT-5, GPT-5-mini, gpt-oss, Claude Opus 4) across 19 benchmarks.
- Agents based on R1-0528 were "on average, 12 times more likely than evaluated
  U.S. frontier models to follow malicious instructions designed to derail them
  from user tasks."
- "Hijacked agents sent phishing emails, downloaded and ran malware, and
  exfiltrated user login credentials, all in a simulated environment."
- R1-0528 "responded to 94% of overtly malicious requests when a common
  jailbreaking technique was used, compared with 8% of requests for U.S.
  reference models."

## 7. Open-weight capability gap
Source: Epoch AI, "Open models lag state-of-the-art closed models by 4 months".
https://epoch.ai/data-insights/open-closed-eci-gap

- Since January 2026, the most capable open-weight models have lagged frontier
  closed models by an average of four months, or 8 ECI points.
- Epoch describes that gap as similar to the gap between GPT-5 and GPT-5.5.
- Epoch's earlier October 2025 report measured a three-month average across
  January 2023 to October 2025.

## 8. Benchmarks — three papers, all read on arXiv 29 Aug 2026

**"The SWE-Bench Illusion: When State-of-the-Art LLMs Remember Instead of
Reason"** — Liang, Garg & Zilouchian Moghaddam. arXiv:2506.12286. Submitted
14 June 2025, last revised 1 December 2025. **No venue stated.**
- Models "achieve up to 76% accuracy in identifying buggy file paths using only
  issue descriptions, without access to repository structure."
- "This performance is merely up to 53% on tasks from repositories not included
  in SWE-Bench."
- "up to 35% consecutive 5-gram accuracy on SWE-Bench Verified and Full, but
  only up to 18% for tasks in other benchmarks."

**"Measuring what Matters: Construct Validity in Large Language Model
Benchmarks"** — Bean, Kearns, Romanou, Hafner, Mayne et al. arXiv:2511.04703.
Submitted 3 November 2025. **No venue stated.** 445 benchmarks, 29 expert
reviewers.
- "Once the responses were scored, 16.0% used uncertainty estimates or
  statistical tests to compare the results."
- 78.2% provided phenomenon definitions; of those, 52.2% used widely agreed-upon
  definitions.
- 47.8% addressed contested or unclear phenomena.
- 40.7% employed constructed rather than real-world tasks.
- 81.3% relied on exact matching for scoring.
- 53.4% presented evidence for construct validity.
- 61.2% treated phenomena as composite.

**"When AI Benchmarks Plateau: A Systematic Study of Benchmark Saturation"** —
Akhtar, Reuel, Soni, Ahuja and 33 co-authors. arXiv:2602.16763. Submitted
18 February 2026. **No venue stated.**
- Analysed "across 60 language model benchmarks using 14 properties that relate
  to saturation".
- "nearly half of our benchmarks exhibit saturation, with rates increasing with
  age".
- "resilience to saturation is impacted by expert-curation, not by public test
  data".

## 9. METR developer productivity trial
Source: arXiv:2507.09089, "Measuring the Impact of Early-2025 AI on Experienced
Open-Source Developer Productivity". Becker, Rush, Barnes, Rein. Submitted
12 July 2025, v2 25 July 2025. Read 30 Aug 2026. **No venue stated.**

- Randomised controlled trial. 16 developers, 246 tasks, mature projects on
  which they averaged five years of prior experience.
- Tools used when AI was allowed: primarily Cursor Pro and Claude 3.5/3.7 Sonnet.
- Developers forecast AI would reduce completion time by **24%**.
- After completing the study they estimated it had reduced completion time by
  **20%**.
- Measured result: allowing AI **increased completion time by 19%**.
- Economists predicted 39% shorter; ML experts predicted 38% shorter.

## 10. LLM price decline, historical
Source: a16z, "LLMflation", Guido Appenzeller, 12 November 2024.
**Note the date. This describes 2021–2024 and must not be presented as current.**

- For MMLU 42 capability: $60 per million tokens in November 2021 (GPT-3) down
  to $0.06 per million tokens by late 2024 (Llama 3.2 3B) — a 1,000× decline
  over three years.
- For MMLU 83 capability: roughly 62× decline since the GPT-4 launch.
- "For an LLM of equivalent performance, the cost is decreasing by 10x every
  year."
- The author explicitly caveats uncertainty about whether the rate is sustainable.

## 11. Deloitte Australia
Source: primary reporting (AP, Guardian, Fortune, CFO Dive), verified 30 Aug 2026.

- The contract with the Department of Employment and Workplace Relations was
  worth approximately **A$440,000**.
- The refund was approximately **A$97,587** — the final contract instalment.
  **The refund was NOT A$440,000.**
- The report was the "Targeted Compliance Framework Assurance Review".
- Errors were identified by Chris Rudge, Deputy Director of Health Law at the
  University of Sydney.
- The report contained a fabricated quote from a Federal Court judgment and
  references to non-existent academic papers, including papers attributed to
  Lisa Burton Crawford, a real academic at the University of Sydney law school.
- The revised version disclosed use of "a generative artificial intelligence
  (AI) large language model (Azure OpenAI GPT-4o) based tool chain".

## 12. Australian competitor pricing
Source: aiadvancements.com.au/ai-training/, read 29 Aug 2026.

| Course | Duration | Price |
|---|---|---|
| ChatGPT Workshop | 2 hours | $2,000 |
| Copilot Workshop | 3 hours | $3,000 |
| Claude Workshop | 3 hours | $3,000 |
| AI Fundamentals | 4 hours | $3,500 |
| AI for Leaders | 4 hours | $6,000 |

- No maximum group size is stated on the page.
- The **City of Canning** case study states the session produced "15
  ready-to-act AI use cases" and "a $100K+ roadmap engagement".

## 13. Australian construction lending market
Source: Stamford Capital Debt Capital Markets Survey 2026, conducted March–April
2026 across 110 lenders. Reported via The Urban Developer. Verified 30 Aug 2026.

- 37% of construction lenders now require zero presales, up from 29% in 2025
  and 18% in 2023.
- The 60–100% presale bracket has fallen from roughly 45% of lenders in 2021 to
  8.1%.
- 62% of respondents expect the major banks to increase construction lending
  activity, up from 46% in 2025 and 13% in 2023.
- Presale requirements are the lowest since the survey began in 2018.

---

# PART 2 — Never publish these

Each one was checked and failed, or is widely repeated and wrong.

| Claim | What is actually true |
|---|---|
| Llama 4 restricts EU-domiciled users | **Not in the Llama 4 licence.** A comparable clause applied to earlier multimodal Llama releases. Do not carry it forward. |
| The saturation paper appeared at ICML 2026 | No venue is stated on the arXiv listing. |
| The construct-validity paper appeared at NeurIPS 2025 | No venue is stated on the arXiv listing. |
| "Of the 60 benchmarks analyzed, 29 exhibit high or very high saturation (Sindex ≥0.7)..." | This sentence is not in the abstract. Use the paper's own "nearly half" language. |
| Deloitte refunded A$440,000 | The refund was ~A$97,587. A$440,000 was the contract value. |
| "95% of AI projects fail" (MIT NANDA) | Does not survive tracing. Preliminary, not peer reviewed, and about sustained P&L impact on custom tools rather than pilot failure. A Wharton academic said publicly he could not reconstruct its derivation. Use S&P Global's survey instead: 42% abandoned most AI initiatives in 2025, up from 17%; 46% of proofs-of-concept never reach production. |
| RAND found 80% of AI projects fail | RAND was quoting a pre-existing estimate ("by some estimates"), not measuring one. Cite RAND for causes, never for the rate. |
| OpenAI stopped reporting its SWE-bench Verified score | Widely repeated, not verified against a primary source. |
| "Mythos 5", "Project Glasswing", safety classifiers lifted | Unverified extraordinary claim about a named company. Do not publish. |
| APRA regulates AFSL holders | APRA regulates ADIs, insurers and super trustees. A non-ADI lender holding an AFSL is regulated by ASIC. CPS 230 and CPS 234 do not bind them. |
| An AI Act is coming to Australia | The mandatory guardrails were abandoned in the National AI Plan, 2 December 2025. |
| Maximum privacy penalty is $2.22 million | Out of date. The current maximum for a serious interference is the greater of $50 million, three times the benefit, or 30% of adjusted turnover. |
| AI Advancements' session produced "20+ use cases" | The City of Canning case study says 15. |
| Any current market pricing sourced to Holden Capital's 2014 guide | Twelve years old. Its structural material is still useful; its numbers are not. |
| Caleb is a "first-year JD student" | The only credential claim permitted is "partway through a law degree". |
| Any Australian regulator requires on-premise AI | None does. The honest grounds are confidentiality obligations and APP 11 security. |

---

# PART 3 — Article angles these support

Ranked by how defensible they are and how few people are saying them.

1. **The AI indemnity you already have** — Microsoft CCC. The counterintuitive
   finding: the more you customise, the more you owe. *Published.*
2. **What benchmark scores do not tell you** — the three papers in §8.
   *Published.*
3. **Open weight is not open source** — the Gemma clause plus NIST on DeepSeek.
   *Published.*
4. **Storage is not processing** — §2. You cannot tell an Australian client
   Copilot processing stays in Australia. Nobody local is saying this.
5. **Australia decided not to regulate AI** — §4. Half the market is still
   selling "get ready for the AI Act".
6. **The 95% statistic does not survive being checked** — Part 2, plus the S&P
   figure that does hold.
7. **Developers thought AI made them 20% faster; it made them 19% slower** —
   §9. The argument for measuring rather than surveying.
8. **AI will not make your experts better** — §9 combined with the finding that
   measured gains concentrate in novices and narrow tasks. A small firm of
   experienced people is not short of judgement, it is short of hours on the
   repeated work around the judgement. Two independent lines of evidence, and
   the opposite of what every vendor sells.
9. **The AI report that cost Deloitte a refund** — §11. Australian, government,
   Big Four, recent. The strongest local argument for buying verification.
10. **Your privacy policy has a deadline of 10 December 2026** — §3. A
    disclosure duty, not a ban, and a human in the loop does not automatically
    exempt you.
