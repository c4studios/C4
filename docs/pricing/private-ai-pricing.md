# C4i Private AI — Pricing Sheet (AUD, ex-GST)

> Source of truth for on-site pricing is `src/components/private-ai/tiers.ts`, which drives the live `/private-ai` Explorer. This doc mirrors that live ladder and adds internal costing plus proposed new models. All prices ex-GST (C4 convention). No em dashes, Australian spelling.
>
> **Firm/live:** the own-hardware ladder below (Lite is newly added; Solo/Foundations/Practice/Enterprise are the existing live numbers). The $6,900 / $245 Solo anchor is intact.
> **Proposed (not yet on the site):** Pilot, Managed subscription, Private cloud, and the Shared-cloud Starter. None are published.

---

# PART A — What the client sees

## Own-hardware ladder (live on /private-ai)

The client buys and owns the machine. Upfront covers hardware, install, configuration, training and a 30-day tuning period. Monthly covers monitoring, updates, model upgrades and support.

| Tier | Suited to | Hardware | Upfront | Monthly |
|------|-----------|----------|---------|---------|
| **Lite** (new) | Sole practitioners on a budget, single user, small models only | Mac mini, M4 Pro, 24GB | **from $4,900** | **$145** |
| Solo | Sole practitioners, 1 to 2 people | Mac Studio, M4 Max, 36GB | from $6,900 (anchor) | $245 |
| Foundations | Small teams, 3 to 10 people | Mac Studio, M4 Max, 64GB | from $11,500 | $395 |
| Practice | Established practices, 10 to 40 people | Mac Studio, M3 Ultra, 96GB | from $22,000 | $795 |
| Enterprise | Larger or high-stakes environments | Paired units or GPU system, scoped | from $40,000 | from $1,500 |

Lite is the new small-business entry, on a Mac mini rather than a Mac Studio: fine for a single user on small models, slower on large ones. What it trades against Solo: the smaller mini box (24GB); a stripped setup (one use case from a proven template, a light training session); a lower care tier ($145, roughly half the support hours, async, slower SLA); single-user and light concurrency.

**Why 24GB and not 48GB (confirmed on Apple AU, 15 July 2026):** the Mac mini M4 Pro base (24GB / 512GB) is A$2,499, and the 48GB memory upgrade is +A$900, so a 48GB mini is A$3,399, essentially the same as the far stronger Mac Studio M4 Max 36GB (A$3,499) used for Solo. At 48GB the mini has no cost advantage and a weaker chip, so the only mini config that delivers a genuine saving is 24GB. For more headroom the sensible step is Solo, not a pricier mini.

## Proposed additional models (not yet on the site)

### Pilot (fixed-price proof)
**from $2,900 fixed.** 2 to 3 weeks on a loaner machine or private cloud, one agreed use case, sample document set, findings report. The full fee credits toward any build started within 60 days. Excludes production hardware, integrations beyond the one use case, and ongoing support.

### Managed subscription (we own the hardware, 36-month term) — re-derived off the live ladder, NOT published
No capital outlay; hardware, support and updates included for the term. Derivation: take the own-hardware 36-month total (upfront plus 36 months of care), apply a modest premium for us financing the hardware and carrying refresh and failure risk, subtract a small onboarding setup fee, and divide by 36.

| Tier | Own-hardware 36-mo total | Premium | Setup | Monthly (36 mo) |
|------|--------------------------|---------|-------|-----------------|
| Solo | $15,720 | 1.15 | $1,500 | **$460** |
| Foundations | $25,720 | 1.14 | $2,500 | **$745** |
| Practice | $50,620 | 1.12 | $3,900 | **$1,465** |
| Enterprise | $94,000 | 1.12 | from $5,900 | from **$2,760** (scoped) |

Managed 36-month client totals land about 12 to 15% above buying outright (the premium for zero capital outlay and us carrying the asset). Internal margins over the term: Solo ~35%, Foundations ~40%, Practice ~43%. Do not publish until you approve these numbers.

### Private cloud (dedicated isolated instance) — ON HOLD
Held entirely pending real provider quotes. The figures below are soft placeholders and must not be published or quoted until re-costed against an actual Australian-region provider.

| Size | Setup (soft) | Monthly (soft) |
|------|--------------|----------------|
| Small | from $1,500 | from $990 |
| Medium | from $2,500 | from $2,200 |
| Large | from $3,900 | from $4,900 |

Note: this contradicts the /private-ai page thesis ("nothing leaves the building"), so it belongs as its own offering, not on that page.

### Shared-cloud Starter — proposed, do not build yet
**$195/mo per tenant, no setup.** Isolated per client (separate data store, per-tenant encryption, role-scoped access) on shared compute. Positioned honestly as "private and isolated to you, never sent to a public AI service," not as dedicated hardware, and not on the client's premises. Small models only, light concurrency, self-serve onboarding, lowest support tier. Belongs off the /private-ai page. Documented proposal only; not to be built or published yet. See economics in Part B.

## What is included in every own-hardware option

- The platform: open-weight LLMs via Ollama, pgvector retrieval over the client's own documents, a Fastify and Next.js application.
- Data stays put: nothing leaves the client's environment, enforced by the egress guard. No third-party AI provider ever sees their data.
- Governance: hash-chained tamper-evident audit log, role-scoped access.
- Setup and people: install and configuration, document ingestion, use-case and prompt configuration, staff training, documentation.
- Care term: model and security updates, monitoring, and a support channel.

## Recommended package and quotable number

A single Mac Studio realistically serves concurrent users in the low tens, not hundreds. So a firm of 50 to 200 staff is Practice-to-Enterprise territory, not the mid tier.

- 3 to 10 users: **Foundations, from $11,500 + $395/mo.**
- 10 to 40 users: **Practice, from $22,000 + $795/mo.**
- 50 to 200 users: **Enterprise, scoped from $40,000 + from $1,500/mo** (concurrency at that scale wants paired or GPU hardware).

Genuinely small or budget single-user buyers now have **Lite, from $4,900 + $145/mo.**

---

# PART B — What you see (internal cost and margin)

"Profit after labour" charges build time at $150/hr as a cost. "Effective $/hr" is cash left after hardware divided by build hours, the truer founder metric on a one-off.

## Hardware reference (Apple AU, confirmed 15 July 2026)

| Tier | Config | Apple AU inc GST | Your cost ex GST |
|------|--------|------------------|------------------|
| Lite | Mac mini M4 Pro 24GB / 512GB | $2,499 (confirmed) | $2,272 |
| Solo | Mac Studio M4 Max 36GB | $3,499 (confirmed) | $3,181 |
| Foundations | Mac Studio M4 Max 64GB | ~$4,499 (confirm BTO) | ~$4,090 |
| Practice | Mac Studio M3 Ultra 96GB | $6,999 (confirmed) | $6,363 |
| Enterprise | Paired Studios or GPU system | ~$14,000+ (scoped) | ~$12,700+ |

Reference: mac mini M4 Pro 48GB would be $3,399 inc (base $2,499 plus $900 for 48GB), which is why Lite uses 24GB.

## Own-hardware margins (at live prices)

| Tier | Hardware | Build hrs | Labour @ $150 | Total cost | Sell (from) | Profit after labour | Margin | Effective $/hr |
|------|----------|-----------|---------------|-----------|-------------|---------------------|--------|----------------|
| Lite | $2,272 | 10 | $1,500 | $3,772 | $4,900 | $1,128 | 23% | $263 |
| Solo | $3,181 | 16 | $2,400 | $5,581 | $6,900 | $1,319 | 19% | $232 |
| Foundations | $4,090 | 28 | $4,200 | $8,290 | $11,500 | $3,210 | 28% | $265 |
| Practice | $6,363 | 40 | $6,000 | $12,363 | $22,000 | $9,637 | 44% | $391 |
| Enterprise | ~$12,700 | ~80 | ~$12,000 | ~$24,700 | $40,000 | ~$15,300 | ~38% | ~$341 |

The live ladder is well-judged: margin fattens sharply up the range (Practice 44%, Enterprise 38%), which is the right shape and is why keeping the live numbers over the earlier under-priced draft was correct.

## Own-hardware monthly support

| Tier | Monthly | Basis | Est. cost | Profit | Margin |
|------|---------|-------|-----------|--------|--------|
| Lite | $145 | up to ~0.5 hr/mo plus updates | ~$95 | ~$50 | 34% |
| Solo | $245 | up to ~1 hr/mo plus updates | ~$170 | ~$75 | 31% |
| Foundations | $395 | up to ~2 hrs/mo plus updates | ~$260 | ~$135 | 34% |
| Practice | $795 | up to ~3 to 4 hrs/mo plus updates | ~$560 | ~$235 | 30% |
| Enterprise | from $1,500 | SLA-backed, scoped | scoped | scoped | scoped |

## Shared-cloud Starter economics (proposed model, not built)

Baseline: one always-on GPU node (~$1,200/mo, AU region) plus app and orchestration (~$300/mo), then about one more GPU node per ~40 light tenants, plus ~$10/tenant storage, plus operational time.

| Tenants | GPU nodes | Infra/mo | Ops overhead/mo | Total cost | Revenue @ $195 | Profit | Margin |
|---------|-----------|----------|-----------------|-----------|----------------|--------|--------|
| 25 | 1 | $1,750 | $550 | $2,300 | $4,875 | $2,575 | 53% |
| 50 | 2 | $3,300 | $1,000 | $4,300 | $9,750 | $5,450 | 56% |
| 100 | 3 | $5,200 | $1,600 | $6,800 | $19,500 | $12,700 | 65% |

Break-even is around 10 tenants; below that the fixed baseline is not covered and it runs at a loss. Operational overhead it adds: 24/7 uptime, a multi-tenant security surface, GPU capacity planning, per-tenant onboarding and support at volume, and shared-infrastructure blast radius.

## Pilot, internal

Sell from $2,900. About 14 hours plus ~$200 loaner or cloud cost. Cost ~$2,300, profit ~$600, margin ~21%, effective ~$193/hr. Slim by design: a paid sales tool that de-risks the client and credits back on conversion.

## Assumptions

| # | Assumption | Value | Status |
|---|------------|-------|--------|
| A1 | Solo anchor | from $6,900 + $245/mo | Firm |
| A2 | Prices ex-GST (add 10% on invoice) | ex-GST | Firm (C4 convention) |
| A3 | Blended build/training rate | $150/hr | Proposed |
| A4 | Lite hardware, Mac mini M4 Pro 24GB | $2,499 inc | Confirmed (Apple AU) |
| A5 | Foundations hardware, M4 Max 64GB BTO | ~$4,499 inc | Confirm exact BTO |
| A6 | Setup hours: Lite 10, Solo 16, Foundations 28, Practice 40 | as listed | Proposed |
| A7 | Lite sell / monthly | $4,900 / $145 | Proposed |
| A8 | Managed premiums / setup fees | as tabled | Proposed, not published |
| A9 | Private-cloud figures | soft | On hold pending provider quotes |
| A10 | Shared-cloud compute basis | $1,200/node, ~40 tenants/node | Soft, model not built |

**GST:** all prices ex-GST. Show clients ex-GST plus GST, or multiply by 1.10 for an inc-GST figure.
