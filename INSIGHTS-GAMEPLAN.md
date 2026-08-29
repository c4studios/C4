# Insights — turning the site into somewhere people learn about AI

Written 29 Aug 2026. The plan for going from five articles to a library, and
what has to be true for it to be worth reading.

---

## 1. The position, before anything else

There is no shortage of AI explainer content. There is almost none of it you can
check.

Search anything about AI adoption and you get the same unsourced statistics
recycled endlessly: what percentage of businesses use AI, how much productivity
it adds, how many staff are secretly pasting client data into ChatGPT. Trace one
of those figures and it usually dies in a vendor blog post citing another vendor
blog post.

**The differentiator is not that we explain AI well. It is that every claim
carries its source, its date, and its confidence — and that we publish what we
could not verify.**

That is already how you work. The pricing page publishes the number. The AI
stance page says what the tools cannot do. The research that started this
already marks claims `[CONFIRMED]` / `[SECONDARY]` / `[REPORTED]` /
`[CONTESTED]` / `[UNKNOWN]`. Nobody surfaces that marking to readers. Doing so
is the whole product.

It also happens to solve the design brief. See §3.

---

## 2. Structure — what a reader picks when they arrive

Your instinct was "pick your degree of expertise", plus "Start here" and
"Latest news". Those are two different axes and both are right.

### Axis one: why you are here

- **Start here** — a sequenced path, no assumed knowledge, read in order.
- **Latest** — what changed, newest first, every entry date-stamped.
- **By topic** — cost, risk and governance, buying and vendors, how it works,
  schools.

### Axis two: who you are

Avoid beginner / intermediate / advanced. People will not click "beginner", and
it tells them nothing about whether the piece is for them. Sort by **what you
are responsible for** instead:

| Track | Who | Example |
|---|---|---|
| **Start here** | No assumed knowledge | What AI actually is, in plain terms |
| **Running a business** | Owners, managers | What it costs, what to buy, what to ask |
| **Regulated work** | Legal, financial, health, schools | Data, obligations, what the regulator has published |
| **Under the hood** | Technical readers | Context windows, retrieval, on-prem |

Four tracks map to your four arms and to the Tang channel. A reader self-selects
by their job, not by admitting what they do not know.

**Every article declares one track and one topic in the registry.** That is the
only new field needed and the filtering falls out of it.

---

## 3. Design — the comic-book instinct is right, the mechanism is not

You floated pages that flip like a comic or an e-book. The instinct behind it is
correct: these should feel like objects you were handed, not blog posts. Worth
saying plainly what the literal version costs, then how to keep the feel.

**What a real page-flip costs you:**

- **Accessibility.** Your own checklist mandates WCAG 2.2 AA. Page-turn
  interactions run straight into 2.5.7 Dragging Movements (needs a
  single-pointer alternative) and 2.4.11 Focus Not Obscured. Achievable, but it
  is real work on every article forever.
- **The AI-search push, which is the point.** Content behind pagination is
  harder for crawlers, and AI crawlers will not click through a flip. You would
  be building a library optimised to be unreadable by the exact systems you are
  trying to be cited in.
- **Mobile.** Flip interactions are fiddly on a phone, and most of this traffic
  will be on a phone.
- **Reading behaviour.** People scan first and read second. Pagination fights
  scanning.

**How to keep the feel without paying for it.** Scroll-driven sequencing, panel
layouts, a grid that reads as spreads, and set-piece moments that arrive as you
move down the page. You already do this well: the DS Racing history timeline and
the Lens scroll stages are exactly this technique, and they stay crawlable and
keyboard-operable because the content is all present in the DOM.

**If you want a flip, make it one deliberate set piece inside one article** —
where the metaphor earns it — rather than the reading mode for everything.

### Components worth building, in order of payoff

1. **Confidence badge.** Inline marker on any claim: confirmed, reported,
   contested, unverified. Hover or tap gives the source and the date read. This
   is the signature element and nothing else on the Australian web does it.
2. **Source panel.** Sources already exist as a section kind. Make them
   collapsible inline anchors so a claim links to its own source without
   leaving the paragraph.
3. **Freshness stamp.** Every article shows when it was last verified, and goes
   visibly stale after a set period. Honest, and it forces the maintenance.
4. **Compare table.** Sortable, for the pieces that genuinely compare things.
5. **Scrollytelling figure.** One diagram that builds as you scroll. Reserve it
   for articles where a process needs showing, not decoration.
6. **"What we could not establish."** A standing end-section. The most
   distinctive thing you can publish, and it costs nothing but honesty.

---

## 4. Cadence and what is realistic

You have five articles: three live, two draft. Seventeen weeks remain in 2026.

- **One a week** gives 17 more and is not sustainable alongside client work.
- **Two a month** gives 8 more, so **13 by 31 December**. Sustainable, and a
  genuine library.
- Batch the research. One research pass should yield three or four articles, not
  one, because the verification cost is mostly per-source rather than
  per-article.

**Do not publish on a schedule you cannot verify to.** A stale unsourced library
is worse than a small sourced one, and it would undo the exact positioning that
makes it worth building.

---

## 5. The backlog

Ready to write from research already done:

| Article | Track | Status |
|---|---|---|
| The AI indemnity you already have | Regulated work | **written, draft** |
| When the model has seen the test | Running a business | **written, draft** |
| Where your data actually goes | Regulated work | next — sources are vendor terms, verifies fast |
| What a context window really holds | Under the hood | needs a primary source; currently rests on one secondary site |

Worth commissioning research for:

- What AI actually costs a ten-person firm, modelled end to end
- On-premise versus cloud, honestly, including where on-prem is the wrong answer
- What the regulator has actually published (ASIC REP 798, OAIC, TPB), no advice
- Retrieval versus long context, in plain terms
- What to do the day it gets something wrong
- Schools: what the evidence says about AI detectors

Deliberately not writing:

- Anything that ranks current model prices, uptime or benchmark scores. It
  decays within a quarter and you would own the maintenance forever.
- Third-party criticism of Anthropic sourced to trackers we cannot verify. You
  build on Claude; publishing unverifiable criticism of your own primary vendor
  is an unforced risk.
- The "Project Glasswing" claim. An unverifiable allegation about a named
  company's safety practices. Criticism is fine when it is cited. That one is
  not cited, which makes it a rumour rather than a criticism.

---

## 6. Research prompt for the next round

Paste this into a fresh research session. The change from the first prompt is
the bias toward findings that stay true.

> **Research brief — [TOPIC], for C4 Studios**
>
> You are producing research that will become published articles under Caleb
> Scott's name at c4studios.com.au. He is a Perth studio owner selling AI work
> to Australian professional-services firms, and his entire market position is
> that every figure he publishes traces to a primary source.
>
> **The rule that governs everything:** a claim I cannot trace to a primary
> source is not usable, no matter how interesting. Mark every claim
> `[CONFIRMED]` (primary source, fetched and quoted), `[SECONDARY]` (reputable
> third party), `[REPORTED]` (single source, unverified), `[CONTESTED]`
> (sources disagree) or `[UNKNOWN]`. Quote the exact wording of any figure and
> give the URL and the date you read it. Where a number appears in an abstract
> or a document body, quote it verbatim rather than paraphrasing it.
>
> **Bias hard toward durable findings.** Prefer peer-reviewed papers,
> regulator publications, legislation, and vendors' own contractual and policy
> documents. Avoid anything that will be wrong in three months: current model
> prices, current benchmark scores, current uptime, current model names. If a
> finding only holds this quarter, say so explicitly and expect it to be cut.
>
> **Be adversarial about your own sources.** For each key claim, look for the
> strongest published disagreement and cite it. A finding with a credible
> counter-argument reported alongside it is more useful than one without.
>
> **The audience is not technical.** Australian business owners and
> professional-services partners. Explain what a finding means for a
> ten-to-fifty-person firm, in plain terms.
>
> **Do not include:** vendor marketing claims presented as fact, statistics
> about AI adoption rates or productivity gains that cannot be traced to a
> primary study, or any allegation about a named company that you cannot cite.
>
> **End with:** (a) three to five article angles, each naming which claims
> carry it and their confidence, and (b) an explicit list of what you could not
> establish and why.

---

## 7. Build order

1. Add `track` and `topic` to the registry schema. One line per entry.
2. Build the confidence badge component. It is the signature and everything
   else can wait behind it.
3. Rebuild `/insights` around the two axes: Start here, Latest, By track.
4. Make the two draft articles' images and set both live.
5. Write "Where your data actually goes".
6. Then the freshness stamp, then compare tables, then a scrollytelling figure
   on the first article that genuinely needs one.

Steps 1 to 4 make the library legible. Everything after is craft on top.
