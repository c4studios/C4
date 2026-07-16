# C4i Private AI — Pricing Sheet (AUD, ex-GST)

> Source of truth for on-site pricing is `src/components/private-ai/tiers.ts`, which drives the live `/private-ai` Explorer. All prices ex-GST (C4 convention). No em dashes, Australian spelling.
>
> **Firm/live:** the own-hardware ladder (Lite newly added; Solo/Foundations/Practice/Enterprise existing). The $6,900 / $245 Solo anchor is intact.
> **Approved, building on a review branch:** Managed subscription (Own outright / Managed monthly toggle).
> **Parked:** Private cloud (shelved, does not pencil) and Shared-cloud Starter (documented proposal).

---

# PART A — What the client sees

## Own-hardware ladder (live on /private-ai)

The client buys and owns the machine. Upfront covers hardware, install, configuration, training and a 30-day tuning period. Monthly covers monitoring, updates, model upgrades and support.

| Tier | Suited to | Hardware | Upfront | Monthly |
|------|-----------|----------|---------|---------|
| **Lite** | Sole practitioners on a budget, single user, small models only | Mac mini, M4 Pro, 24GB | **from $4,900** | **$145** |
| Solo | Sole practitioners, 1 to 2 people | Mac Studio, M4 Max, 36GB | from $6,900 (anchor) | $245 |
| Foundations | Small teams, 3 to 10 people | Mac Studio, M4 Max, 64GB | from $11,500 | $395 |
| Practice | Established practices, 10 to 40 people | Mac Studio, M3 Ultra, 96GB | from $22,000 | $795 |
| Enterprise | Larger or high-stakes environments | Paired units or GPU system, scoped | from $40,000 | from $1,500 |

**Why Lite is 24GB, not 48GB (confirmed on Apple AU, 16 July 2026):** the Mac mini M4 Pro base (24GB / 512GB) is A$2,499, and the 48GB upgrade is +A$900, so a 48GB mini is A$3,399. That is A$900 cheaper than the 36GB Mac Studio (A$4,299) used for Solo, and has more memory, so a 48GB mini is a legitimate option. Lite uses 24GB purely on margin: at the $4,900 price a 24GB box clears ~23% while a 48GB box clears only ~6% (a 48GB Lite would need ~$5,600 to hold margin, which crowds Solo). For more headroom the client steps up to Solo.

## Managed subscription (approved, building on a review branch)

We own the hardware; the client pays monthly over a 36-month term with no capital outlay. Delivered on /private-ai as an "Own outright / Managed monthly" toggle on the tier cards.

| Tier | Setup | Monthly (36-month term) |
|------|-------|-------------------------|
| Lite | $1,000 | $295 |
| Solo | $1,500 | $460 |
| Foundations | $2,500 | $745 |
| Practice | $3,900 | $1,465 |
| Enterprise | from $5,900 | from $2,760 (scoped) |

## Parked models

- **Private cloud:** shelved. Real always-on AU GPU costs more than the drafted sell prices (see Part B), so dedicated private cloud loses money. If a cloud option is wanted, pursue shared-cloud instead.
- **Shared-cloud Starter:** $195/mo per tenant, isolated per client on shared compute, positioned as "private and isolated to you, never sent to a public AI service." Documented proposal only, off the /private-ai page, not built.
- **Pilot:** from $2,900 fixed, 2 to 3 weeks on a loaner or private cloud, credited toward a build within 60 days. Proposed.

## What is included in every own-hardware option

- The platform: open-weight LLMs via Ollama, pgvector retrieval over the client's own documents, a Fastify and Next.js application.
- Data stays put: nothing leaves the client's environment, enforced by the egress guard.
- Governance: hash-chained tamper-evident audit log, role-scoped access.
- Setup and people: install and configuration, document ingestion, use-case and prompt configuration, staff training, documentation.
- Care term: model and security updates, monitoring, and a support channel.

## Recommended package and quotable number

A single Mac Studio serves concurrent users in the low tens, not hundreds, so a firm of 50 to 200 staff is Practice-to-Enterprise territory.

- 3 to 10 users: Foundations, from $11,500 + $395/mo.
- 10 to 40 users: Practice, from $22,000 + $795/mo.
- 50 to 200 users: Enterprise, scoped from $40,000 + from $1,500/mo.
- Budget single-user: Lite, from $4,900 + $145/mo.

---

# PART B — What you see (internal cost and margin)

"Profit after labour" charges build time at $150/hr as a cost. "Effective $/hr" is cash left after hardware divided by build hours.

## Hardware reference (Apple AU, confirmed live 16 July 2026)

| Tier | Config | Apple AU inc GST | Your cost ex GST |
|------|--------|------------------|------------------|
| Lite | Mac mini M4 Pro 24GB / 512GB | $2,499 | $2,272 |
| Solo | Mac Studio M4 Max 36GB | $4,299 | $3,908 |
| Foundations | Mac Studio M4 Max 64GB | ~$5,450 (confirm exact 64GB delta) | ~$4,955 |
| Practice | Mac Studio M3 Ultra 96GB | from $9,099 | ~$8,272 |
| Enterprise | Paired Studios or GPU system | ~$18,000+ (scoped) | ~$16,500+ |

Note: earlier drafts understated the Studio prices. Corrected here from the live Apple AU configurator. For reference a 48GB Mac mini is $3,399 inc (base $2,499 plus $900), which is A$900 under the Solo Studio, not equal to it as an earlier note wrongly said.

## Own-hardware margins (at real hardware costs, firm sell prices)

| Tier | Hardware | Build hrs | Labour @ $150 | Total cost | Sell (from) | Profit after labour | Margin | Effective $/hr |
|------|----------|-----------|---------------|-----------|-------------|---------------------|--------|----------------|
| Lite | $2,272 | 10 | $1,500 | $3,772 | $4,900 | $1,128 | 23% | $263 |
| Solo | $3,908 | 16 | $2,400 | $6,308 | $6,900 | $592 | 9% | $187 |
| Foundations | $4,955 | 28 | $4,200 | $9,155 | $11,500 | $2,345 | 20% | $234 |
| Practice | $8,272 | 40 | $6,000 | $14,272 | $22,000 | $7,728 | 35% | $343 |
| Enterprise | ~$16,500 | ~80 | ~$12,000 | ~$28,500 | $40,000 | ~$11,500 | ~29% | ~$294 |

At real hardware costs the Solo anchor is thin (~9% after labour, $187/hr) because its $6,900 has to absorb a $4,299 machine, and margin fattens up the range (Foundations 20%, Practice 35%). The sell ladder is firm; this is just the honest internal view. Lite is actually a better-margin product than Solo.

## Managed subscription, margin over the term

Monthly built as: own-hardware 36-month total (upfront plus 36 months care) times a ~1.12 to 1.15 premium, minus setup, over 36. Lite managed is newly derived on the same method for toggle consistency.

| Tier | Own-hardware 36-mo total | Premium | Setup | Monthly | Term margin |
|------|--------------------------|---------|-------|---------|-------------|
| Lite | $10,120 | 1.15 | $1,000 | $295 | ~35% |
| Solo | $15,720 | 1.15 | $1,500 | $460 | ~35% |
| Foundations | $25,720 | 1.14 | $2,500 | $745 | ~40% |
| Practice | $50,620 | 1.12 | $3,900 | $1,465 | ~43% |
| Enterprise | $94,000 | 1.12 | from $5,900 | from $2,760 | scoped |

## Private cloud (shelved, does not pencil)

Real always-on GPU in an Australian region (hyperscaler, for data residency): roughly $1,150/mo (L4-class), $1,700 to $2,800 (A10-class), ~$5,500 (A100-class), versus drafted sells of $990 / $2,200 / $4,900. Dedicated always-on private cloud is a loss at these prices. It only works if priced far above a one-off on-prem box (uncompetitive) or on shared / on-demand compute, which is the shared-cloud model. Parked. Sources: AWS G6 and Azure NC A100 AU-region pricing, 2026.

## Shared-cloud Starter economics (proposed, not built)

Baseline one always-on GPU node (~$1,200/mo AU) plus app/orchestration (~$300/mo), then ~one node per 40 light tenants, plus ~$10/tenant storage, plus operational time.

| Tenants | GPU nodes | Infra/mo | Ops overhead/mo | Total cost | Revenue @ $195 | Profit | Margin |
|---------|-----------|----------|-----------------|-----------|----------------|--------|--------|
| 25 | 1 | $1,750 | $550 | $2,300 | $4,875 | $2,575 | 53% |
| 50 | 2 | $3,300 | $1,000 | $4,300 | $9,750 | $5,450 | 56% |
| 100 | 3 | $5,200 | $1,600 | $6,800 | $19,500 | $12,700 | 65% |

Break-even ~10 tenants; below that it runs at a loss. Adds 24/7 uptime, a multi-tenant security surface, capacity planning, onboarding at volume, and shared-infrastructure blast radius.

## Assumptions

| # | Assumption | Value | Status |
|---|------------|-------|--------|
| A1 | Solo anchor | from $6,900 + $245/mo | Firm |
| A2 | Prices ex-GST | ex-GST | Firm |
| A3 | Blended build/training rate | $150/hr | Proposed |
| A4 | Lite hardware, Mac mini M4 Pro 24GB | $2,499 inc | Confirmed |
| A5 | Solo / Practice hardware | $4,299 / from $9,099 inc | Confirmed (live) |
| A6 | Foundations hardware, M4 Max 64GB | ~$5,450 inc | Confirm exact 64GB delta |
| A7 | Setup hours: Lite 10, Solo 16, Foundations 28, Practice 40 | as listed | Proposed |
| A8 | Managed premiums / setup / Lite managed | as tabled | Approved, building |
| A9 | Private-cloud figures | shelved | Does not pencil |
| A10 | Shared-cloud model | $195/tenant | Proposed, not built |

**GST:** all prices ex-GST. Multiply by 1.10 for an inc-GST figure.
