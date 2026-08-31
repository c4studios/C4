# Research prompts, batch 1 — six articles, ready to send

Written 29 Aug 2026. For **regular Claude chat agents with web search**, not
Claude Code. Each block below is complete and standalone: the standing brief is
merged into every one, because a chat agent cannot read this repo or
`~/.claude/CLAUDE.md`.

**One article per fresh conversation.** Do not run two in one thread; the
standing rules stop being followed about halfway down a long chat.

**Send them in parallel.** These are independent. Six agents at once builds six
weeks of buffer in an afternoon.

**What comes back is an evidence pack, not an article.** I assemble and verify
against primary sources before anything is written. Expect roughly one material
error per pack — that was the rate across the seven research modules this week.

Covers weeks 8 to 14 of `ARTICLE-PIPELINE.md`, skipping week 12, which needs
your own measurements rather than research.

---

## 1 — Context windows

> **Research brief for C4 Studios. Return an evidence pack, never prose.**
>
> You are gathering evidence for an article published under Caleb Scott's name
> at c4studios.com.au. He runs a Perth studio selling AI work to Australian
> professional and financial services firms. His entire market position is that
> every figure he publishes traces to a primary source, and that he says plainly
> what he could not establish.
>
> **Do not write the article.** No paragraphs, no headlines, no suggested
> openings. Someone else writes. Hand over checkable material.
>
> **The rule that governs everything.** A claim you cannot trace to a primary
> source is unusable no matter how interesting. Tag every claim `[CONFIRMED]`
> (you fetched the primary source and quoted it), `[SECONDARY]` (reputable third
> party reporting a primary source), `[REPORTED]` (single source, unverified),
> `[CONTESTED]` (sources disagree — say how), or `[UNKNOWN]`. For every figure
> give the **exact wording**, the **URL**, and the **date you read it**. Never
> paraphrase a number into your own words.
>
> **Quote the document, not coverage of it.** If a paper is discussed in a blog,
> fetch the paper. If you can only reach the coverage, say so and mark it
> `[SECONDARY]`.
>
> **Check the denominator.** For any percentage: a percentage of what, over what
> period, measured how.
>
> **Be adversarial about your own sources.** For each key claim find the
> strongest published disagreement and cite it. Flag conflicts of interest — a
> vendor benchmark on the vendor's own corpus is not neutral evidence.
>
> ---
>
> **The subject.** How retrieval accuracy degrades as input length grows, and
> what that means for someone who wants to load a 400-page file into a model.
>
> **What to establish.**
>
> 1. The RULER benchmark (Hsieh et al.). Fetch the paper. What it tests beyond
>    simple single-needle retrieval, and the published degradation figures with
>    the token lengths they were measured at. Name the models and note their
>    generation.
> 2. The Chroma Research "Context Rot" work. Fetch it. How many models tested,
>    what was measured, and the exact degradation figures.
> 3. The gap between single-needle and multi-needle results. This is the crux:
>    models score near-perfect on the easy test, which is why the easy test
>    misleads. Get exact figures for both.
> 4. Whether any standardised published degradation figures exist for **current**
>    flagship models. If they do not, say so plainly — that absence is itself
>    part of the article.
> 5. Any counter-evidence. Is there a model or a study showing degradation is
>    smaller than the above suggests?
>
> **Do not gather:** any model's advertised context window as a headline figure,
> current pricing per token, or current model names as though durable. This
> article must stay true for a year.
>
> **End with:** (a) every claim strong enough to carry the article, tagged;
> (b) what you could not establish, and why. The second list gets published.

---

## 2 — The arithmetic of agents

> **Research brief for C4 Studios. Return an evidence pack, never prose.**
>
> [Paste the same standing block as prompt 1 — from "You are gathering
> evidence" through "Flag conflicts of interest".]
>
> ---
>
> **The subject.** Why multi-step AI agents fail more than people expect, and
> the arithmetic that explains it. If each step succeeds 95% of the time, twenty
> dependent steps succeed about 36% of the time.
>
> **What to establish.**
>
> 1. τ-bench and τ²-bench. Fetch the papers. What they test, and the published
>    pass rates. Distinguish carefully between the frozen official leaderboard
>    and **vendor self-reported** entries — say which each figure is.
> 2. GAIA. What it measures, best published results, and the human baseline.
> 3. METR's time-horizon work on task length against success rate. Fetch it.
>    Get the doubling-time figure and its stated confidence.
> 4. **The most important one.** Find the primary source for the claim that
>    errors are *positively correlated* across steps rather than independent —
>    meaning real-world multi-step failure is worse than the p^n arithmetic. If
>    it is preprint-only with no peer-reviewed venue, say so explicitly.
> 5. Any published claim that agent reliability has materially improved. Look
>    for it honestly rather than only gathering the pessimistic case.
>
> **Note:** the core arithmetic needs no source. It is multiplication. Your job
> is the benchmark context around it, and separating what was measured
> independently from what a vendor reported about itself.
>
> **End with:** (a) claims tagged; (b) what you could not establish.

---

## 3 — The privacy policy deadline

> **Research brief for C4 Studios. Return an evidence pack, never prose.**
>
> [Paste the same standing block as prompt 1.]
>
> **Additional rule for this one — the legal boundary.** Caleb is partway
> through a law degree and that is the only credential he claims. **Report what
> the regulator and the legislation say. Never characterise what a firm should
> do, whether it complies, or what its obligations are.** If you find yourself
> writing "businesses must", rewrite it as "the OAIC states that".
>
> ---
>
> **The subject.** A hard commencement date most Australian small firms have not
> heard of, and the fact that it is a disclosure duty rather than a ban.
>
> **What to establish.** Work from the OAIC and Federal Register of Legislation
> directly. Australian sources only; do not import GDPR or US material.
>
> 1. The commencement date for the new automated decision-making transparency
>    requirements in the Australian Privacy Principles (APP 1.7, 1.8, 1.9), and
>    the amending Act that inserted them, by exact title.
> 2. The **exact statutory wording** of what triggers the disclosure obligation.
>    Quote it. The trigger language about decisions that could reasonably be
>    expected to significantly affect an individual matters and is often
>    paraphrased wrongly.
> 3. Whether a human being involved in the decision takes it outside the rule.
>    This is the question every firm will ask.
> 4. Whether it applies to systems built before commencement, and to data
>    collected before it.
> 5. Whether the OAIC has published guidance yet. If not, say so.
> 6. Current maximum civil penalty tiers for privacy breaches, and the current
>    penalty unit value with its indexation date.
> 7. **Flag explicitly:** a $2.22 million maximum penalty figure still circulates
>    widely and is out of date. Establish what superseded it and when.
>
> **End with:** (a) claims tagged; (b) what you could not establish. Flag
> anything where sources disagree on the corporate penalty multiples — that is
> known to be inconsistently reported.

---

## 4 — Who actually regulates a non-bank lender

> **Research brief for C4 Studios. Return an evidence pack, never prose.**
>
> [Paste the same standing block as prompt 1, plus the legal boundary rule from
> prompt 3.]
>
> ---
>
> **The subject.** Firms holding an Australian Financial Services Licence or a
> credit licence, that are not banks, are routinely sold compliance products
> built for APRA-regulated entities. APRA does not regulate them.
>
> **What to establish.** Australian primary sources only.
>
> 1. From APRA's own site: the definitive list of entity types APRA regulates,
>    and the Acts its powers come from. Quote it.
> 2. Whether a non-deposit-taking lender holding an AFSL or an Australian Credit
>    Licence, that is not an insurer or superannuation trustee, falls inside or
>    outside that list.
> 3. Which regulator does cover such a firm's conduct and licensing.
> 4. Prudential standards CPS 230 and CPS 234 — who they bind, their
>    commencement dates, and any transitional deadline for pre-existing
>    contracts. Establish clearly that they bind APRA-regulated entities only.
> 5. ASIC Regulatory Guide 104 on outsourcing. Quote verbatim what it says about
>    outsourcing functions against outsourcing responsibility.
> 6. Whether non-APRA-regulated firms nonetheless get held to these standards
>    contractually by counterparties. If this is real, is it documented anywhere
>    citable, or only asserted by consultants?
>
> **End with:** (a) claims tagged; (b) what you could not establish.

---

## 5 — What zero retention actually retains

> **Research brief for C4 Studios. Return an evidence pack, never prose.**
>
> [Paste the same standing block as prompt 1.]
>
> ---
>
> **The subject.** "Zero data retention" is sold as nothing being kept. Read the
> clauses and something is always kept. This article is the clause-by-clause
> version.
>
> **What to establish.** Work from vendor policy, terms and documentation pages
> directly — never from a comparison blog. Cover Anthropic, OpenAI, Microsoft
> (Azure OpenAI and Copilot separately, they differ) and Google.
>
> For each provider:
>
> 1. Default retention on the commercial or enterprise tier when no special
>    arrangement is in place. How long, and for what stated purpose.
> 2. Whether that retained content sits inside the customer's own tenant or
>    outside it, and whether the customer can delete it themselves.
> 3. Whether human review of content is possible by default, and whether any
>    product has opted out of it.
> 4. **The core question:** under a zero-retention arrangement, what is still
>    retained. Look specifically for safety or trust-and-safety classifier
>    outputs, scores, or flags, and for how long those are kept.
> 5. What happens to content flagged as violating a usage policy, and how long
>    that is retained. This is usually much longer.
> 6. How zero retention is obtained — self-service toggle, application, or
>    account-tier gated — and any stated approval timeframe.
> 7. Whether any legal process or preservation order has overridden a stated
>    deletion policy. If so, which jurisdiction, and whether it still applies.
>
> **Quote every retention period verbatim.** Paraphrasing a retention clause is
> how this gets reported wrongly.
>
> **End with:** (a) claims tagged, organised per provider so a comparison table
> can be built; (b) what you could not establish.

---

## 6 — Australia decided not to have an AI Act

> **Research brief for C4 Studios. Return an evidence pack, never prose.**
>
> [Paste the same standing block as prompt 1, plus the legal boundary rule from
> prompt 3.]
>
> ---
>
> **The subject.** Much of the Australian market is still selling readiness for
> AI-specific legislation that the government has decided not to introduce.
>
> **What to establish.** This one lives or dies on reaching the primary
> document. **A previous attempt to fetch industry.gov.au timed out. Persist.**
> If it will not load, try the Department's newsroom, the responsible Minister's
> media releases, and the Parliamentary Library. Law-firm summaries are a last
> resort and must be tagged `[SECONDARY]`.
>
> 1. The National AI Plan. Exact title, publication date, publishing department,
>    and a direct link to the document itself.
> 2. What it says about the mandatory AI guardrails proposed in the September
>    2024 proposals paper. Quote the operative wording. Establish whether they
>    were abandoned, paused, or deferred — the distinction matters and gets
>    reported loosely.
> 3. What the government said it will rely on instead. Quote it.
> 4. The 2024 consultation: how many submissions, and what the main objection
>    was.
> 5. The Australian AI Safety Institute — establishing department, funding,
>    when it became operational, and whether it is advisory or regulatory.
> 6. The July 2026 announcement about standards for AI and large data centres.
>    Establish its scope, and specifically whether it makes any existing
>    voluntary guidance mandatory. **Do not let a data-centre measure be reported
>    as a general AI law.**
> 7. Whether the government has left the door open to future AI-specific
>    legislation, and under what stated conditions.
> 8. What existing law is said to apply in the meantime.
>
> **End with:** (a) claims tagged, with a clear statement of which came from the
> primary document and which from summaries; (b) what you could not establish.

---

## Assembling the rest yourself

The pattern is: the standing block from prompt 1, plus the legal boundary rule
where the subject touches regulators or courts, plus the numbered "what to
establish" list from that article's entry in `ARTICLE-PIPELINE.md` Part 3.

Come back for batch 2 rather than assembling weeks 15 onward now. What those
articles need will shift depending on what these six turn up, and a prompt
written six months early is a prompt written without knowing what the library
already says.
