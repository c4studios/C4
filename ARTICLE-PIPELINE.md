# The Insights pipeline — 30 articles, weekly

Written 29 Aug 2026. Supersedes the backlog section of `INSIGHTS-GAMEPLAN.md`;
everything else in that document (positioning, the two-axis structure, the
page-flip verdict) still stands.

This is a production system, not a wish list. Three agents do the gathering,
you approve, I assemble and verify. The standing prompts in Part 2 are written
once and reused every week. The per-article briefs in Part 3 are deliberately
short because they inherit those.

---

## Part 1 — How it runs

### The four roles

| Role | Who | Output |
|---|---|---|
| **Research** | Agent, fresh session per article | Evidence pack. Never prose. |
| **Design** | Agent, with the `impeccable` skill | Section plan against the real schema, plus any custom component |
| **Imagery** | Agent | `/insights/<slug>.jpg` and `<slug>-og.jpg`, plus in-article figures |
| **Assembly + verification** | Me | The article file, the registry entry, and the check that kills bad claims |

### The gate that cannot move

**I re-verify every load-bearing claim against its primary source before
assembly, regardless of what the research pack says.** This is not process
theatre. In one week, working from seven research modules, that gate caught:

- a 76% figure attributed to a specific model when the paper said "state-of-the-art models"
- a Llama 4 EU restriction clause that does not exist in the licence
- a GPT-4 legal hallucination baseline that two sources put at 43% and 58–82%
- Deloitte's refund reported as A$440,000 when A$440,000 was the contract and the refund was A$97,587
- a "free government AI assessment" that your actual clients are not eligible for

Every one of those was fluent, plausible and wrong. Five in seven modules is
the base rate you should assume, and it is why research agents return evidence
rather than paragraphs.

### Cadence, honestly

Weekly is achievable **because the gathering is delegated**. My earlier advice
of two a month assumed I was doing all of it. That changes with three agents
feeding the line.

The constraint that does not change is verification, which is roughly two hours
an article and cannot be parallelised away. Budget it.

**You already have seven weeks of runway.** Seven articles are written and sitting
in draft. Weeks 1 to 7 below are image-and-approval work only, which gives the
research pipeline seven weeks to get ahead before it has to deliver anything.

### The rule about your own numbers

Module 8 names it as the weakest joint in your whole position and it is right.
Every figure in every article so far belongs to someone else. Articles 12, 19
and 27 below are the ones that fix that, and each depends on you measuring
something first. They are scheduled far enough out to give you time. **Do not
let them slip into "someone else's numbers" versions — publish them late or not
at all.**

---

## Part 2 — The three standing prompts

Paste the relevant one verbatim at the top of every brief in Part 3.

### 2.1 Standing research prompt

> **Standing research brief — C4 Studios Insights**
>
> You are producing an evidence pack that will become a published article under
> Caleb Scott's name at c4studios.com.au. He is a Perth studio owner selling AI
> work to Australian professional and financial services firms. His entire
> market position is that every figure he publishes traces to a primary source
> and that he says plainly what he could not establish.
>
> **Return evidence, never prose.** Do not write the article, do not draft
> paragraphs, do not suggest headlines. Someone else writes. Your job is to hand
> over checkable material.
>
> **The rule that governs everything.** A claim you cannot trace to a primary
> source is not usable no matter how interesting. Mark every claim
> `[CONFIRMED]` (you fetched the primary source and quoted it), `[SECONDARY]`
> (reputable third party reporting a primary source), `[REPORTED]` (single
> source, unverified), `[CONTESTED]` (sources disagree — say how) or
> `[UNKNOWN]`. For every figure give the **exact wording**, the **URL**, and the
> **date you read it**. Never paraphrase a number into your own words.
>
> **Quote from the document, not from coverage of it.** If a study is discussed
> in a news article, fetch the study. If a licence is summarised in a blog,
> fetch the licence. If you can only reach the coverage, say so explicitly and
> mark it `[SECONDARY]`.
>
> **Distinguish measurement from forecast.** Several widely-quoted AI figures
> are predictions being repeated as though they describe something that already
> happened. Say which one you have.
>
> **Check the denominator.** For any percentage, state what it is a percentage
> of, over what period, measured how. Most weak statistics dissolve here.
>
> **Bias hard toward durable findings.** Prefer peer-reviewed papers, regulator
> publications, legislation, court judgments and vendors' own contractual
> documents. Avoid anything wrong in three months: current model prices, current
> benchmark scores, current model names, promotional pricing. If a finding only
> holds this quarter, say so and expect it to be cut.
>
> **Be adversarial about your own sources.** For each key claim, look for the
> strongest published disagreement and cite it. Note any conflict of interest —
> a report recommending the approach its own authors sell is not neutral.
>
> **Australian relevance.** Where the evidence is overseas, say so plainly and
> state whether an Australian equivalent exists. Never let a US figure read as
> though it describes an Australian product or obligation.
>
> **Legal boundary.** Caleb is partway through a law degree and that is the only
> credential he claims. Report what regulators, courts and legislation have
> published. Never characterise what a firm should do, whether it complies, or
> what its obligations are.
>
> **Do not include:** vendor marketing claims presented as fact, adoption or
> productivity statistics with no traceable primary study, any allegation about
> a named company you cannot cite, or any figure whose derivation you could not
> follow.
>
> **End with two lists.** (a) Every claim strong enough to carry an article,
> with its confidence tag. (b) **What you could not establish, and why.** The
> second list is not a failure. It gets published.

### 2.2 Standing design prompt

> **Standing design brief — C4 Studios Insights**
>
> You are planning the visual and structural treatment of one article on
> c4studios.com.au. **Invoke the `impeccable` skill first and follow its
> methodology.** Read `~/.claude/CLAUDE.md` before you choose anything.
>
> **Work within the real schema.** Articles are content modules at
> `src/content/seo/pages/<slug>.js` with a `hero` (label, a two-line `title`
> array, `intro`) and a `sections` array. Available section kinds, rendered by
> `src/components/seo/ArticleSections.jsx`:
>
> - `answer` — one opening block that answers the question outright
> - `prose` — `heading` plus a `body` array of paragraphs
> - `list` — `heading` plus `items`
> - `process` — numbered steps, each with a `title`
> - `figure` / `image`
> - `quote` — `quote` plus `attribution`
> - `table` — `head` array plus `rows` arrays
> - `sources` — items with `title`, `publisher`, `year`, `url`
>
> Propose a section plan using these. If the article genuinely needs something
> the schema cannot express, specify the new component precisely: markup,
> behaviour, keyboard operation, and how it degrades with JavaScript disabled.
>
> **Non-negotiable constraints.**
>
> - **WCAG 2.2 AA.** Manual keyboard pass and screen-reader pass required.
>   Automated tooling covers roughly 30% of criteria.
> - **Everything in the DOM.** The library exists to be cited by AI search.
>   Nothing load-bearing behind a click, a flip, a tab or a scroll trigger.
>   Progressive enhancement only.
> - **No horizontal page overflow at 375px.** Tables scroll inside their own
>   wrapper.
> - Must hold in light and dark.
>
> **Bans, from the global rules.** No Inter, Roboto, Arial, Open Sans, Space
> Grotesk, DM Sans, Plus Jakarta, Outfit, Poppins, Montserrat or system-ui as a
> display face. No serif italic to signal warmth or premium. No purple or violet
> gradients, no gradient text, no default Tailwind palette values, no
> sage/blush/muted-earth band. No identical card grids, no tiny uppercase
> tracked eyebrows above every section, no `01/02/03` scaffolding, no
> glassmorphism, no coloured side-stripe borders.
>
> **Match the house.** This is one article in a library, not a standalone
> showpiece. Read two or three existing articles in
> `src/content/seo/pages/` and `src/components/seo/article.css` first. Restraint
> is the register. One idea may own one screen; the rest is typography.
>
> **Return:** the section plan, one named design decision with its reasoning,
> any custom component fully specified, and what you would cut if it does not
> earn its place.

### 2.3 Standing imagery prompt

> **Standing imagery brief — C4 Studios Insights**
>
> You are producing imagery for one article on c4studios.com.au. Read
> `~/.claude/CLAUDE.md` before generating anything.
>
> **Deliverables, at these exact dimensions** — measured off the three images
> already in `public/insights/`, not guessed:
>
> - `public/insights/<slug>.jpg` — card image, **1360×1700, portrait**
> - `public/insights/<slug>-og.jpg` — social card, **1200×630, landscape**
>
> Plus any in-article figure named in the design brief. Where an article has no
> image the site falls back to the site-wide OG card, so a weak image is worse
> than none.
>
> **Generator.** Use the connected image MCP: `generate_image` for a single
> scene, `generate_image_batch` for up to twelve independent prompts. Call
> `models_explore` first to see the available models, their aspect ratios and
> their parameters. For photographic editorial scenes the realistic-portrait and
> general models are the right family; the marketing/product model is not.
>
> **Spend nothing without preflighting.** These generations cost Caleb credits.
> Run `get_cost: true` on one representative prompt and report the figure before
> generating a set. Do not pass `use_unlim` on your own initiative — that spends
> a different balance of his and it is his call, not yours.
>
> Crop and resize with the Adobe `image_crop_and_resize` tool or with Pillow.
> Composite any legible type in HTML and screenshot it in the browser.
>
> **The rule that is never bent: image models make the scene, never the words.**
> Any text that must be legible is composited in HTML and screenshotted. Never
> generated. Garbled type on a client-facing asset is unshippable.
>
> **Photoreal means photographable.** Prompt a scene that could actually have
> been taken with a camera: one named light source, an explicit imperfection,
> mundane out-of-focus context, a named real camera and a real camera flaw.
> Perth and Australian context where the subject allows.
>
> **Before placing type over a photograph, measure** the luminance and variance
> of the intended area. High variance means neither dark nor light type will
> hold — move the type. Do not add a scrim; a scrim is what makes a photo look
> like a template.
>
> **Banned:** soft-focus stock photography of hands or plants, glowing blue
> brains, circuit-board motifs, robot hands, humanoid robots, holographic
> interfaces, anything that reads as "AI stock imagery". If a viewer could name
> the tool that made it, it has failed.
>
> **Diagrams and charts** follow the `dataviz` skill. Inline SVG, theme-aware
> tokens, real labels, no decorative chart with invented data.
>
> **Never fabricate a document, screenshot, receipt or record** that could be
> mistaken for genuine. Where an article discusses a real document, link it
> rather than illustrating it.
>
> **Return:** the files, the exact prompt used for each generated scene, and the
> measured luminance figures for any area carrying type.

---

## Part 3 — The schedule

Weekly. Dates are suggestions; the order is not, because the early ones carry
the ones after them.

### Weeks 1–7: publish what already exists

Written, verified, sitting in draft. These need **your read plus imagery only**.
No research required. This is your runway.

| Wk | Date | Slug | Needs |
|---|---|---|---|
| 1 | 3 Sep | `stored-here-processed-elsewhere` | Your read (you will quote it to Harvis), imagery |
| 2 | 10 Sep | `the-citation-that-checks-out` | Your read (names two vendors, a regulator, a solicitor), imagery |
| 3 | 17 Sep | `ninety-five-per-cent-of-what` | Your read, imagery |
| 4 | 24 Sep | `the-cost-nobody-quotes-you` | **Your agreement** — it argues against how C4i is sold. Imagery |
| 5 | 1 Oct | `when-the-model-has-seen-the-test` | Imagery |
| 6 | 8 Oct | `open-weight-is-not-open-source` | Live already; add per-article imagery |
| 7 | 15 Oct | `ai-indemnity-you-already-have` | Live already; add per-article imagery |

Six articles are already live carrying the generic C4 social card. Fixing that
is the single highest-value imagery job on this list and it is seven articles'
worth of work with no research attached.

---

### Weeks 8–30: the pipeline

Each entry gives the thesis, then the three briefs. Prepend the matching
standing prompt from Part 2.

---

**W8 · 22 Oct · `your-context-window-is-a-marketing-number`**
*Thesis: what actually happens when you load a 400-page administration file.*

- **Research.** Establish, from primary sources, how retrieval accuracy degrades
  as input length grows. Target RULER (Hsieh et al.) and the Chroma "Context
  Rot" work — fetch the papers, not the write-ups. Get exact figures for
  multi-needle recall against single-needle, and the token counts at which
  degradation begins. Establish whether any standardised published numbers exist
  for current flagship models; the earlier figures are from older generations and
  the article must say so. Do not use any current model's advertised window as a
  headline figure.
- **Design.** The whole article turns on one comparison: advertised window
  against usable window. That wants a single honest chart, not a table. Consider
  a `figure` with an inline SVG built from real published figures only.
- **Imagery.** A physical analogue for "it is all in there and you cannot find
  it" — a real Perth office, a real stack of paper, real depth of field. No
  glowing data motifs.

---

**W9 · 29 Oct · `the-maths-of-agents`**
*Thesis: 95% reliable per step is 36% reliable over twenty steps.*

- **Research.** This one needs almost no sourcing because the core is
  arithmetic. Verify the benchmark context: τ-bench and τ²-bench pass rates from
  the primary papers, GAIA, and METR's time-horizon work. Establish which
  numbers are self-reported leaderboard entries against independent evaluation.
  Find the primary source for the claim that errors are positively correlated
  across steps rather than independent, and mark it honestly if it is preprint
  only.
- **Design.** The arithmetic is the article. A small interactive that lets the
  reader set per-step reliability and step count and see the end-to-end number
  would be the single most useful component in the library — **and it must
  render its default case as static text in the DOM** so a crawler and a
  no-JavaScript reader still get the argument.
- **Imagery.** A real chain of dependent physical steps photographed honestly.
  Avoid anything robotic.

---

**W10 · 5 Nov · `what-your-privacy-policy-has-to-say-by-december`**
*Thesis: a hard date most small firms have not heard of, and it is a disclosure
duty rather than a ban.*

- **Research.** OAIC primary only. Establish the commencement date for APP 1.7,
  1.8 and 1.9, the exact statutory wording of what triggers disclosure, and
  whether OAIC guidance has since been published. Establish whether a human in
  the loop takes a decision outside the rule. Get the current civil penalty
  tiers and the penalty unit value with its indexation date. **Flag explicitly
  that the widely-repeated $2.22m maximum is out of date.**
- **Design.** A date-anchored piece. It wants a visible "last verified" stamp,
  which is the first article that justifies building the freshness component
  from the gameplan.
- **Imagery.** Restrained. A calendar or a diary photographed plainly. Nothing
  legal-stock.

---

**W11 · 12 Nov · `if-you-hold-an-afsl-but-you-are-not-a-bank`**
*Thesis: APRA does not regulate you, and someone is selling you the wrong
compliance product.*

- **Research.** APRA's own "our functions" page for the definitive list of what
  it regulates. Establish that CPS 230 and CPS 234 bind APRA-regulated entities
  only. Establish which regulator does cover a non-ADI AFSL or credit licensee.
  Quote ASIC RG 104 on outsourcing verbatim. Do not characterise any firm's
  obligations.
- **Design.** A boundary article. One clean table of who covers whom will do
  more than any prose.
- **Imagery.** Minimal. This one is typography.

---

**W12 · 19 Nov · `what-one-c4i-box-actually-cost-us`** ⚠ **needs your data**
*Thesis: the first measured number in the library that is yours.*

- **Research.** None external. **This depends on you logging real hours and
  getting a real Australian reseller quote in AUD.** Every hardware figure in
  the modules is a US benchmark and Module 8 flags it as unquotable.
- **Design.** A worked ledger. Honest, plain, itemised.
- **Imagery.** Photograph your own machine. Real bench, real cables, real dust.
  This is the most credible image in the whole library and it costs one photo.

**If the numbers are not ready, do not substitute someone else's. Skip the week
and run W13 early.**

---

**W13 · 26 Nov · `zero-retention-does-not-mean-nothing-is-kept`**
*Thesis: read the clause before telling a client nothing is stored.*

- **Research.** Vendor policy documents only — Anthropic, OpenAI, Microsoft,
  Google. Establish what is retained under a zero-retention arrangement,
  including safety classifier results, what happens to flagged content, and for
  how long. Quote the clauses verbatim. Establish the default abuse-monitoring
  retention on each enterprise tier and whether it sits inside or outside the
  customer tenant.
- **Design.** A comparison table across providers, with a column for "what is
  still kept". The table is the article.
- **Imagery.** A safe with a window in it, photographed. Literal but honest.

---

**W14 · 3 Dec · `australia-decided-not-to-have-an-ai-act`**
*Thesis: everything you are waiting for already applies.*

- **Research.** The National AI Plan (2 December 2025) from industry.gov.au
  directly — **the primary document, not law-firm summaries.** A previous
  attempt timed out on that domain; retry properly. Establish that the September
  2024 mandatory guardrails proposal was not proceeded with, what replaced it,
  and what the government has said about revisiting. Establish the status of the
  July 2026 "Australian Standards for AI" announcement and whether it changes
  the general position.
- **Design.** A correction piece. It wants a clear before-and-after of what the
  market expected against what happened.
- **Imagery.** Parliament House or a real Australian civic building,
  photographed plainly. No flags, no gavels.

---

**W15 · 10 Dec · `your-firm-may-not-own-what-your-ai-wrote`**
*Thesis: Australian copyright needs a human author.*

- **Research.** The judgments themselves — Acohs v Ucorp [2012] FCAFC 16 and
  Telstra v Phone Directories [2010] FCAFC 149 — via AustLII, not academic
  summaries. Establish what each actually held about computer-generated material
  and human authorship. Establish the Attorney-General's October 2025 position on
  a text and data mining exception. **Report the cases; do not advise on
  ownership.**
- **Design.** Restrained. The two cases are the spine.
- **Imagery.** A real signature on real paper. Nothing courtroom-stock.

---

**W16 · 17 Dec · `the-copilot-seats-nobody-opens`**
*Thesis: the most common wasted AI spend in the Australian mid-market.*

- **Research.** Microsoft's own earnings disclosures for paid Copilot seat
  counts against total paid M365 commercial seats, with the exact call date.
  Establish current AU list pricing and flag any promotional period. Find the
  primary source for any "cannot show value" survey figure; if it is secondary,
  say so. **Do not claim an activation rate** — Microsoft discloses penetration,
  not activation, and the widely-quoted 20–30% weekly-active figure has no
  primary source.
- **Design.** Arithmetic the reader can do on their own seat count. A small
  calculator, statically rendered by default.
- **Imagery.** An empty desk with a logged-in screen. Real office, real
  afternoon light.

---

**W17 · 7 Jan · `ai-helps-your-juniors-and-can-harm-your-experts`**
*Thesis: the gains are real and they are not evenly distributed.*

- **Research.** Brynjolfsson, Li & Raymond in the Quarterly Journal of Economics
  — the published version, with volume, issue and pages. Dell'Acqua et al. on
  the jagged frontier, primary. Get the skill-level breakdown exactly: the
  novice gain, the experienced gain, and any measured quality decline among top
  performers. Establish what happened to performance on tasks outside the
  model's capability frontier.
- **Design.** One chart, by skill decile. This is the clearest data story in the
  library.
- **Imagery.** Two people at one desk, one clearly senior. Real, unposed.

---

**W18 · 14 Jan · `developers-thought-it-made-them-faster`*
*Thesis: measured against believed, and the follow-up nobody reports correctly.*

- **Research.** METR's July 2025 randomised trial, primary: sample, task count,
  the measured effect with its confidence interval, the forecast beforehand and
  the estimate afterwards. Then the February 2026 follow-up — **and read METR's
  own words on why they will not bank the more flattering result.** Most
  coverage gets the direction wrong in both directions. Establish the sign
  convention explicitly.
- **Design.** The perception gap is the visual: forecast, belief, measurement,
  three bars.
- **Imagery.** A stopwatch on a real desk. Nothing developer-stock.

---

**W19 · 21 Jan · `what-we-measured-on-a-client-file`** ⚠ **needs your data**
*Thesis: your own eval harness, run on real work.*

- **Research.** None external. **This requires you to have built the gold set —
  30 to 200 real queries with expert-verified answers — and run it.** Module 8
  names the absence of your own measurements as the weakest joint in your
  position. This article closes it.
- **Design.** Methodology first, results second. Show the harness.
- **Imagery.** Your actual screen, your actual output, redacted honestly.

---

**W20 · 28 Jan · `efficiently-honestly-and-fairly-when-a-model-did-the-work`**
*Thesis: ASIC already told licensees the rules apply, in October 2024.*

- **Research.** REP 798 itself from ASIC, plus media release 24-238MR. Quote the
  eight key findings in ASIC's own executive-summary wording. Get the scope
  right: the number of use cases, the number of licensees, the dates reviewed.
  Quote RG 104 on outsourcing. **Note that REP 798 does not print the string
  "s912A"** — it uses the operative phrase. Report; never advise.
- **Design.** ASIC's own words carry it. Heavy on `quote` blocks.
- **Imagery.** Restrained corporate Australia, photographed plainly.

---

**W21 · 4 Feb · `ollama-is-the-wrong-tool-the-moment-two-people-use-it`**
*Thesis: the easy default fails only after go-live.*

- **Research.** The peer-reviewed concurrency benchmark — get the journal,
  volume and article number, the hardware, the model and the exact latency and
  failure figures at each concurrency level. Establish what vLLM does
  differently. Narrow audience, high credibility payoff.
- **Design.** Two curves on one chart. Technical readers will check the axes.
- **Imagery.** A queue. Real, mundane, Australian.

---

**W22 · 11 Feb · `sovereign-ai-is-not-a-product-you-can-buy`**
*Thesis: it is a government and defence category, and there is nothing branded
sovereign a twenty-person firm can purchase.*

- **Research.** Vault Cloud and Firmus positioning from their own sites —
  certifications, target customers, whether any SMB offering exists. Establish
  what "sovereign" means under the Hosting Certification Framework and IRAP
  against what SMB marketing means by it. **Name no local competitor.**
- **Design.** A ladder from marketing usage to policy definition.
- **Imagery.** A real Australian data centre exterior, or nothing.

---

**W23 · 18 Feb · `the-shadow-ai-conversation`**
*Thesis: the largest exposure in most firms costs nothing to fix.*

- **Research.** Consumer tier terms for the major assistants, verbatim: training
  defaults, retention periods, and whether commercial terms differ. Establish
  the Samsung incidents from primary reporting. Treat DLP vendor telemetry as
  vendor figures and say so. Establish what Anthropic's consumer terms change of
  2025 did and did not apply to.
- **Design.** Pairs with `one-page-ai-policy`, already live. Cross-link.
- **Imagery.** A phone on a desk beside a client file. Says it without saying it.

---

**W24 · 25 Feb · `what-a-retrieval-system-actually-costs-to-get-right`**
*Thesis: retrieval is where it fails, and two choices carry most of the benefit.*

- **Research.** Establish, from primary sources, the proportion of RAG errors
  attributable to retrieval rather than generation. Get Anthropic's contextual
  retrieval figures and **mark them as vendor benchmarks on the vendor's own
  corpus.** Find the independent evaluation that disagrees. Establish whether
  chunk size and splitter choice have a universal winner; the honest answer
  appears to be no.
- **Design.** A pipeline diagram that shows where errors enter.
- **Imagery.** A filing system, real and imperfect.

---

**W25 · 4 Mar · `the-question-to-ask-before-you-sign`**
*Thesis: five questions, and what a good answer sounds like.*

- **Research.** Light. Assemble from articles already published; verify each
  cross-reference still holds and each cited figure is unchanged.
- **Design.** The most linkable page in the library. Five questions, each with
  good answer and bad answer, each linking to the article that establishes it.
  This is the hub the others point at.
- **Imagery.** A meeting room, empty, real.

---

**W26 · 11 Mar · `when-the-vendor-goes-down`**
*Thesis: a same-vendor fallback is not a fallback.*

- **Research.** Published status-page uptime for the major providers over a
  stated trailing window, with the date read. Establish any documented incident
  where one authentication failure took down every surface of one vendor at
  once. **Do not publish current uptime percentages as though durable** — state
  the window and the read date.
- **Design.** Timeline of a real incident.
- **Imagery.** A closed shopfront. Australian, ordinary.

---

**W27 · 18 Mar · `what-three-clients-actually-used-it-for`** ⚠ **needs your data**
*Thesis: measured adoption on real engagements, with the things that failed.*

- **Research.** None external. Requires consented client material and your own
  records. **Publish the failures or do not publish it.**
- **Design.** Three short cases, same structure.
- **Imagery.** Real client environments, with permission.

---

**W28 · 25 Mar · `the-agent-security-problem-nobody-mentions`**
*Thesis: every third-party tool server is untrusted by default.*

- **Research.** The OWASP MCP material and the NSA/CISA information sheet, both
  primary. Catalogued CVEs with their numbers. Establish tool poisoning as a
  documented class and how prevalent it is measured to be. Mark preprints as
  preprints.
- **Design.** Attack-path diagram. Accurate or omitted.
- **Imagery.** A key under a doormat. Photographed, not illustrated.

---

**W29 · 1 Apr · `what-we-got-wrong-this-year`**
*Thesis: every correction the library has made to itself.*

- **Research.** Internal. Every article's verification header already records
  what was corrected before publication. **Publish that list.**
- **Design.** A changelog that reads as an argument rather than an apology.
- **Imagery.** None. This one is text.

**This is the single most differentiating article on the list.** Nobody
publishes their own corrections. It is also the cheapest to produce, because the
material already exists in the file headers.

---

**W30 · 8 Apr · `start-here`**
*Thesis: the front door.*

- **Research.** None.
- **Design.** The sequenced entry path from the gameplan's two-axis structure.
  By this point there are roughly 30 articles and the library needs a way in.
- **Imagery.** Whatever the strongest existing article images allow.

---

## Part 4 — Held back deliberately

- **"The government will do your AI readiness assessment for free."** Checked
  the eligibility. The AI Adopt Centres serve SMEs in National Reconstruction
  Fund priority sectors that trade interstate or internationally — medical
  science, agriculture, manufacturing, renewables, forestry, fisheries. **A
  Perth law firm or accounting practice is not eligible.** Publishing it as
  written would send your own readers chasing something they cannot have.
  Publishable only as "here is the free help and here is exactly who can get
  it", which is a much smaller article.
- **Anything ranking current model prices, scores or uptime.** Decays within a
  quarter and becomes a maintenance liability on a site whose claim is that its
  numbers are traceable.
- **Unverifiable criticism of Anthropic.** You build on Claude. Cited criticism
  is fair; rumour is an unforced risk.
- **The 500× "AI strategy" price-spread piece.** It rests entirely on one
  competitor's arithmetic over AusTender values. Interesting, not yet checkable.
- **Anything naming a WA competitor.** The lane is open because nobody occupies
  it. Occupy it by publishing, not by pointing.
