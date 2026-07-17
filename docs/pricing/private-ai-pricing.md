# C4i Private AI — Pricing Sheet (AUD, ex-GST)

> Source of truth for on-site pricing is `src/components/private-ai/tiers.ts`,
> which drives the live /private-ai Explorer. Hardware cost basis:
> `private-ai-hardware-research.md` (AU retail verified 17 Jul 2026).
> This version reflects the TWO-AXIS offer approved by Caleb on 2026-07-17,
> grounded in the field report from the first real engagement ($80/hr T&M,
> Windows/BYO client, no completed deployment yet). No em dashes, Australian
> spelling. All prices ex GST.

---

# PART A — What the client sees (live)

Two axes on every tier: **supply** (your hardware / we supply it) and, under
supplied only, **payment** (own outright / managed monthly over 36 months).

## BYO — installed on the client's own machine

| Tier | Install (from) | Monthly care (software only) | Basis |
|------|----------------|------------------------------|-------|
| Lite | $1,600 | $95 | ~20h at the $80/hr field rate |
| Solo | $2,400 | $145 | ~30h |
| Foundations | $3,600 | $245 | ~45h, team config + shared-folder indexing |
| Practice | $7,900 | $495 | includes the custom front-end |
| Enterprise | Scoped | from $995 | per environment |

Published machine spec (shown on the switch): minimum Windows 11, 8-core CPU
(2021+), 32GB RAM, 150GB free NVMe. Recommended 64GB RAM + 16GB NVIDIA GPU.
BYO care covers the C4 software only; the machine and OS stay under the
client's vendor warranty. Machine checked plainly and free in the first call;
a RAM upgrade at cost is often the whole fix.

## Supplied — hardware choice per tier, Windows first

| Tier | Upfront (from) | Care | Managed (36 mo) | Setup | Hardware options |
|------|----------------|------|-----------------|-------|------------------|
| Lite | $4,400 | $145 | $280 | $1,000 | RTX 5060 Ti 16GB / 32GB PC · Mac mini M4 Pro 24GB |
| Solo | $5,900 | $245 | $430 | $1,500 | RTX 5060 Ti 16GB / 64GB PC · Mac mini M4 Pro 48GB |
| Foundations | $8,900 | $395 | $665 | $2,500 | RTX 5070 Ti 16GB / 64GB (Perth-built option) · Mac Studio M4 Max 36GB |
| Practice | $16,500 | $795 | $1,295 | $3,900 | RTX 5090 32GB · HP Z2 Mini G1a 64GB (big-model) · Mac Studio M3 Ultra 96GB |
| Enterprise | from $40,000 | from $1,500 | from $2,760 | from $5,900 | Paired units / purpose-built GPU system, scoped |

Supplied fine print carries a 14-day quote validity (DRAM supercycle). Every
supplied Windows unit ships with a Win 11 Pro upgrade included in the basis.
Mac is one option, never the flagship, and stays "supported, unverified" until
the stack is bench-verified on macOS.

## Superseded (2026-07-17)

The Apple-only ladder (Lite $4,900 / Solo $6,900 / Foundations $11,500 /
Practice $22,000) is retired. The $6,900 Solo anchor dropped to $5,900 with
Caleb's approval: the primary hardware changed from a $4,299 Mac Studio to a
~$2,500 RTX 5060 Ti box that benchmarks faster for the shipped models.

---

# PART B — Internal cost and margin (approved figures)

Labour at the real $80/hr field rate. Hardware ex GST = AU retail / 1.1.

## BYO margins

Pure labour products: margin is schedule risk, not COGS. Lite $1,600 vs ~20h
($1,600 cost at rate) prices the floor at breakeven-on-rate; the care line and
upsell carry it. Solo $2,400/30h, Foundations $3,600/45h, Practice $7,900
(~60h + front-end scope) all sit on the field agent's 20-40h+ pilot reality.
Treat overruns as scope conversations, not discounts.

## Supplied margins (after hardware + labour)

| Tier | Hardware ex | Setup hrs | Labour | Cost | Sell | Profit | Margin |
|------|-------------|-----------|--------|------|------|--------|--------|
| Lite | ~$2,150 (5060 Ti/32GB + Pro) | 12 | $960 | $3,110 | $4,400 | $1,290 | 29% |
| Solo | ~$2,500 (5060 Ti/64GB) | 20 | $1,600 | $4,100 | $5,900 | $1,800 | 31% |
| Foundations | ~$3,900-4,600 | 28 | $2,240 | $6,140-6,840 | $8,900 | $2,060-2,760 | 23-31% |
| Practice | ~$8,300 (5090/64GB) | 40 | $3,200 | $11,500 | $16,500 | $5,000 | 30% |

Mac options land within a few hundred dollars of the Windows basis at each rung
(mini 48GB $2,545 ex, Studio 36GB $3,908 ex, Ultra 96GB $8,272 ex) so one sell
price covers the choice. The HP G1a option on Practice ($5,208-6,941 ex) is
margin-accretive.

## Managed (36-month term, C4 owns hardware)

Derivation: own-hardware 36-mo total x ~1.12-1.15 premium, minus setup, over 36.
Lite $280 (+$1,000) · Solo $430 (+$1,500) · Foundations $665 (+$2,500) ·
Practice $1,295 (+$3,900) · Enterprise from $2,760 (+from $5,900). Managed has
no BYO form: it requires C4-owned hardware.

## Field-truth constraints (do not drift)

- No completed deployment exists yet; every timeline reads "scoped to go live",
  never "typically".
- Capability claims are limited to what is built: RAG with citations, folder
  search, drafting, audit log, client isolation, egress guard. No transcription,
  OCR, xlsx/docx, overlays, monitoring tooling until they exist.
- Bench-verify before first sale: macOS (any Mac option), AMD ROCm/Vulkan via
  Ollama (HP G1a option).
- Parked: private cloud (does not pencil at AU GPU rates), shared-cloud Starter
  ($195/mo/tenant proposal), Pilot ($2,900 concept).
