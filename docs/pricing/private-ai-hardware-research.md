# C4 Private AI — Supplied Hardware Research (Australia, verified 17 July 2026)

> Basis for the two-axis /private-ai pricing. All prices AUD inc GST as displayed
> by AU retail. VERIFIED = read from the live retailer page on 2026-07-17.
> Market context: mid-2026 DRAM/NAND supercycle — RAM-heavy configs are at
> multi-year highs and volatile; supplied-hardware quotes carry 14-day validity.

## Category A — Compact Windows/NVIDIA workstations (default supplied box)

| Tier | Config | Price | Source | LLM read |
|---|---|---|---|---|
| Budget | Aftershock RAPID LVL 6 — Ryzen 5 7500F, 32GB DDR5, RTX 5060 Ti 16GB, 1TB, Win 11 Home | $2,295 VERIFIED | aftershockpc.com.au ready-to-ship | Gemma-4-e4b fully in VRAM; 13B Q4 ~53 tok/s, 7B ~90 tok/s |
| Mid | Aftershock NIMBUS LVL 8 — Ryzen 7 7700, 32GB, RTX 5070 Ti 16GB, 2TB, Win 11 Home | $3,595 VERIFIED | same | ~896GB/s: ~1.8-2x the 5060 Ti tokens/sec |
| Mid (Perth) | PLE "Blizzard" BTO — 7800X3D, 32GB, RTX 5070 Ti 16GB, 1TB | $4,652 VERIFIED | ple.com.au | Perth-built: 4 metro stores, onsite-warranty option |
| High | PLE "Quantum" — 7800X3D, 32GB, RTX 5090 32GB, 1TB | $8,999 VERIFIED | ple.com.au (WA stock) | 27-32B dense Q4 on-GPU 45-60 tok/s; multi-user headroom |
| High alt | PLE "Phantom" — 9850X3D, 64GB, RTX 5090, 2TB Gen5 | $11,999 VERIFIED | ple.com.au | The no-compromise SKU |
| OEM compare | HP Z2 Tower G1i — RTX 2000 Ada 16GB, 48GB, Win 11 Pro, 3yr onsite | $7,781 VERIFIED | hp.com/au-en | SLOWER than the $2,295 box for inference — pay OEM only for NBD-onsite/fleet needs |

Appliance notes: integrator boxes ship Win 11 HOME — every supplied unit needs a
Pro upgrade (~$60-100) for BitLocker/domain join. Both integrators do non-RGB
cases + business branding on request. Warranty: Aftershock 3yr courier RTB;
PLE 24mo RTB + purchasable 3yr onsite; only HP gives true NBD onsite.

## Category B — Unified-memory "AI mini" boxes

| Model | Config | Price | Channel | Read |
|---|---|---|---|---|
| ASUS Ascent GX10 (DGX Spark) | GB10, 128GB unified (273GB/s), 1TB, DGX OS | $7,799 promo (RRP $9,649) VERIFIED, in stock | Scorptec / JW | gpt-oss-20b ~80 tok/s, 120b ~53 tok/s; superb prefill. **ARM64 Linux — breaks the verified-Windows story; integration work required** |
| MSI EdgeXpert (Spark) | GB10, 128GB, 4TB | $8,299 VERIFIED | Scorptec | Same silicon |
| **HP Z2 Mini G1a (Strix Halo)** | Ryzen AI Max PRO 390, 64GB unified, Win 11 Pro, 3yr onsite | **$5,729 VERIFIED** (HP direct $7,635) | JW / hp.com | MoE 30B-class ~100 tok/s; dense 27B Q4 ~10 tok/s. **Runs the verified Windows stack — the strategic big-model pick** (AMD ROCm/Vulkan via Ollama: test before selling) |
| Framework Desktop | Max+ 395, 128GB barebones | $6,069 VERIFIED (+~$500 parts) | frame.work/au | DIY/consumer warranty — internal use, weak client-appliance story |
| GMKtec EVO-X2 | Max+ 395, 128GB, 2TB, Win 11 Pro | $6,515 VERIFIED | Amazon AU marketplace | Cheapest 128GB Windows box; marketplace warranty risk |

Framing: a $2,295 RTX 5060 Ti box out-generates all of these on ≤14B models.
Unified memory wins only when clients want 30-120B-class (MoE) models on one
quiet box. Bandwidth: Spark 273GB/s, Strix 256GB/s vs 5060 Ti 448GB/s /
5070 Ti ~896GB/s / 5090 ~1.8TB/s.

## Category C — Apple (apple.com/au, verified 17 Jul 2026)

Mac mini M4 $1,299 · **mini M4 Pro 24GB $2,499** · **mini M4 Pro 48GB $2,799** ·
Studio M4 Max 36GB $4,299 · Studio M4 Max 48GB $5,799 · Studio M3 Ultra 96GB
$9,099. No M5 desktops yet. macOS remains supported-but-unverified for the C4
stack — Mac stays one option, never the flagship, until bench-verified.

## Category D — BYO published spec (validated)

- Working set for gemma4:e4b (~10GB) + embedder + Postgres + app + Windows ≈
  18-22GB → **32GB minimum is right; 16GB is not viable**; 64GB comfortable.
- **Published minimum:** Windows 11, 8-core CPU (2021+, AVX2), 32GB RAM, 150GB
  free NVMe. No GPU required.
- **Published recommended:** 64GB RAM, 16GB-VRAM NVIDIA GPU (5060 Ti 16GB is the
  value floor), Windows 11 Pro.
- Honest perf framing: CPU-only desktop ~8-12 tok/s on 8B-dense (e4b ~15-25 SOFT)
  — fine for search/short answers, slow for drafting; long-context prefill is the
  hidden CPU cost. A 16GB GPU lifts 7-13B to ~50-90 tok/s and cuts prefill 10x.
  Correct claim: "a GPU speeds up drafting and long documents; search and short
  answers run fine without one."

## Recommended supplied lineup (adopted in tiers.ts)

| Rung | Tier | Primary (Windows) | Cost basis | Mac option |
|---|---|---|---|---|
| Good | Lite/Solo | RTX 5060 Ti 16GB (32GB RAM Lite / 64GB Solo) + Win Pro | ~$2,400-2,800 | mini M4 Pro 24GB $2,499 / 48GB $2,799 |
| Better | Foundations | RTX 5070 Ti 16GB / 64GB / 2TB (PLE Perth-built option) | ~$3,900-5,000 | Studio M4 Max 36GB $4,299 |
| Best | Practice | RTX 5090 32GB / 64GB (PLE) | ~$9,000-12,000 | Studio M3 Ultra 96GB $9,099 |
| Wildcard | Practice option | HP Z2 Mini G1a 64GB (big-model, quiet, 3yr onsite) | $5,729-7,635 | — |

Concurrency at this scale is mostly queueing (Ollama serialises by default);
rungs buy faster single-stream speed, VRAM headroom for parallel slots and
context, and RAM headroom for Postgres as the corpus grows.

## Watch items

1. RTX 50 SUPER refresh dead/indefinitely delayed — don't wait for 24GB mid-cards.
2. DRAM supercycle: expect $200-600 swings on 64-128GB configs quarter to quarter
   → 14-day quote validity (now in the supplied fine print).
3. DGX Spark promo pricing suggests channel clearing; second-gen plausible within
   6-12 months (SOFT).
4. AMD Ollama path (ROCm/Vulkan) on the HP G1a: bench-verify before first sale.
5. Perth logistics: PLE is the only researched vendor with Perth stores.

Full source URLs and benchmark citations are preserved in the research agent's
deliverable (2026-07-17); key ones: aftershockpc.com.au, ple.com.au,
scorptec.com.au (120181, 122104), jw.com.au, hp.com/au-en, frame.work/au,
apple.com/au, ggml-org/llama.cpp#16578, jetsonhacks spark bench, kyuz0
strix-halo grids, runaihome/modelfit 5060 Ti benches.
