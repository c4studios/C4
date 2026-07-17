/**
 * tiers.ts — single source of truth for the /private-ai page.
 *
 * Two-axis offer, grounded in the July 2026 field report + AU hardware
 * research (verified 17 Jul 2026):
 *   Axis 1 (supply): BYO — installed on the client's own machine — or
 *   supplied hardware, with a hardware CHOICE per tier. Windows/NVIDIA
 *   leads (the platform is verified on Windows 11); Mac is one option,
 *   never the flagship, until bench-verified on macOS.
 *   Axis 2 (payment, supplied only): own outright or managed monthly.
 *
 * All copy is field-verified capability only: no transcription, no OCR,
 * no overlays. Australian spelling, no em dashes anywhere. Prices ex GST.
 * Every price here is a Caleb-approved figure; change nothing without him.
 */

export type TierId = 'lite' | 'solo' | 'foundations' | 'practice' | 'enterprise';
export type SupplyMode = 'byo' | 'supplied';

export type ConsoleStepType =
  | 'status'
  | 'user'
  | 'stream'
  | 'chip'
  | 'tick'
  | 'queue'
  | 'audit'
  | 'metric';

export interface ConsoleStep {
  type: ConsoleStepType;
  text: string;
  /** Milliseconds of pause before this step begins. Renderer supplies defaults per type. */
  delay?: number;
}

export interface HardwareOption {
  key: string;
  /** Picker chip label, short. */
  label: string;
  /** Slab badge. */
  badge: string;
  /** Full hardware line under the unit. */
  line: string;
  /** Slabs drawn (Enterprise pairs). */
  unitCount: number;
}

export const tiers = [
  {
    id: 'lite',
    name: 'Lite',
    suitedTo: 'Sole practitioners on a budget, single user, small models only',
    byo: {
      upfront: 'from $1,600',
      monthly: '$95',
      goLive: 'Scoped to go live within 1 to 2 weeks of acceptance.',
    },
    supplied: {
      upfront: 'from $4,400',
      monthly: '$145',
      managedMonthly: '$280',
      managedSetup: '$1,000',
      goLive: 'Scoped to go live within about 2 weeks of acceptance.',
      hardware: [
        {
          key: 'win',
          label: 'Compact PC',
          badge: '16GB VRAM',
          line: 'Supplied unit: compact Windows 11 Pro PC, NVIDIA RTX 5060 Ti 16GB, 32GB RAM, 1TB NVMe. New, 3-year warranty.',
          unitCount: 1,
        },
        {
          key: 'mac',
          label: 'Mac mini',
          badge: '24GB',
          line: 'Supplied unit: Mac mini, M4 Pro, 24GB unified memory. New, with AppleCare+.',
          unitCount: 1,
        },
      ],
    },
    includes: [
      'Private assistant over your own documents, with sources',
      'One core use case, configured around your work',
      'Answers cite the source document, every time',
      'Local audit log of every query',
      'Installation, a light training session and a 30-day tuning period',
    ],
  },
  {
    id: 'solo',
    name: 'Solo',
    suitedTo: 'Sole practitioners, 1 to 2 people',
    byo: {
      upfront: 'from $2,400',
      monthly: '$145',
      goLive: 'Scoped to go live within 1 to 2 weeks of acceptance.',
    },
    supplied: {
      upfront: 'from $5,900',
      monthly: '$245',
      managedMonthly: '$430',
      managedSetup: '$1,500',
      goLive: 'Scoped to go live within 2 to 3 weeks of acceptance.',
      hardware: [
        {
          key: 'win',
          label: 'Compact PC',
          badge: '64GB RAM',
          line: 'Supplied unit: compact Windows 11 Pro PC, NVIDIA RTX 5060 Ti 16GB, 64GB RAM, 2TB NVMe. New, 3-year warranty.',
          unitCount: 1,
        },
        {
          key: 'mac',
          label: 'Mac mini',
          badge: '48GB',
          line: 'Supplied unit: Mac mini, M4 Pro, 48GB unified memory. New, with AppleCare+.',
          unitCount: 1,
        },
      ],
    },
    includes: [
      'Private assistant over your own documents, with sources',
      'Search across your files and matters, with citations',
      'Drafting of correspondence and file notes',
      'Local audit log of every query',
      'Installation, training and a 30-day tuning period',
    ],
  },
  {
    id: 'foundations',
    name: 'Foundations',
    suitedTo: 'Small teams, 3 to 10 people',
    byo: {
      upfront: 'from $3,600',
      monthly: '$245',
      goLive: 'Scoped to go live within 2 to 3 weeks of acceptance.',
    },
    supplied: {
      upfront: 'from $8,900',
      monthly: '$395',
      managedMonthly: '$665',
      managedSetup: '$2,500',
      goLive: 'Scoped to go live within 2 to 3 weeks of acceptance. Mac configs can add build-to-order lead time.',
      hardware: [
        {
          key: 'win',
          label: 'Workstation',
          badge: '5070 Ti',
          line: 'Supplied unit: Windows 11 Pro workstation, NVIDIA RTX 5070 Ti 16GB, 64GB RAM, 2TB NVMe. New, 3-year warranty, Perth-built option.',
          unitCount: 1,
        },
        {
          key: 'mac',
          label: 'Mac Studio',
          badge: '36GB',
          line: 'Supplied unit: Mac Studio, M4 Max, 36GB unified memory. New, with AppleCare+.',
          unitCount: 1,
        },
      ],
    },
    includes: [
      'Everything in Solo, for the whole team',
      'Automatic indexing of shared folders as they change',
      'Longer documents and bigger matters in one pass',
      'Per-person usage in the audit log',
      'Installation, training and a 30-day tuning period',
    ],
  },
  {
    id: 'practice',
    name: 'Practice',
    suitedTo: 'Established practices, 10 to 40 people',
    byo: {
      upfront: 'from $7,900',
      monthly: '$495',
      goLive: 'Scoped to go live within 3 to 4 weeks of acceptance.',
    },
    supplied: {
      upfront: 'from $16,500',
      monthly: '$795',
      managedMonthly: '$1,295',
      managedSetup: '$3,900',
      goLive: 'Scoped to go live within 3 to 5 weeks of acceptance.',
      hardware: [
        {
          key: 'win',
          label: 'GPU tower',
          badge: '32GB VRAM',
          line: 'Supplied unit: Windows 11 Pro tower, NVIDIA RTX 5090 32GB, 64GB RAM, 2TB NVMe. New, 3-year warranty, Perth-built option.',
          unitCount: 1,
        },
        {
          key: 'bigmodel',
          label: 'Quiet mini',
          badge: '64GB UNIFIED',
          line: 'Supplied unit: HP Z2 Mini G1a, Ryzen AI Max PRO, 64GB unified memory, Windows 11 Pro, 3-year onsite warranty. Runs bigger models, quietly.',
          unitCount: 1,
        },
        {
          key: 'mac',
          label: 'Mac Studio',
          badge: '96GB',
          line: 'Supplied unit: Mac Studio, M3 Ultra, 96GB unified memory. New, with AppleCare+.',
          unitCount: 1,
        },
      ],
    },
    includes: [
      'A custom front-end built for your practice and matters',
      'Whole-office document search with citations',
      'Queued multi-user access with per-person history',
      'Practice-wide audit trail for oversight',
      'Installation, training and a 30-day tuning period',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    suitedTo: 'Larger or high-stakes environments',
    byo: {
      upfront: 'Scoped per environment',
      monthly: 'from $995',
      goLive: 'Scoped and quoted per environment.',
    },
    supplied: {
      upfront: 'from $40,000',
      monthly: 'from $1,500',
      managedMonthly: 'from $2,760',
      managedSetup: 'from $5,900',
      goLive: 'Scoped and quoted per environment.',
      hardware: [
        {
          key: 'win',
          label: 'Paired units',
          badge: 'PAIRED',
          line: 'Paired units or a purpose-built GPU system, scoped to the environment.',
          unitCount: 2,
        },
      ],
    },
    includes: [
      'Redundant hardware with failover',
      'Workflows built around your highest-value processes',
      'Service levels agreed in writing',
      'Everything in Practice',
      'Installation, training and a 30-day tuning period',
    ],
  },
] as const;

export type Tier = (typeof tiers)[number];

export const DEFAULT_TIER: TierId = 'solo';
export const DEFAULT_SUPPLY: SupplyMode = 'supplied';

export function isTierId(value: string | null | undefined): value is TierId {
  return tiers.some((t) => t.id === value);
}

export function isSupplyMode(value: string | null | undefined): value is SupplyMode {
  return value === 'byo' || value === 'supplied';
}

/** Published BYO machine spec (field-validated floor + research-validated).
    Shown when the switch is on "your hardware". */
export const BYO_SPEC = {
  heading: 'Runs on your machine',
  minimum:
    'Minimum: Windows 11, 8-core CPU (2021 or newer), 32GB RAM, 150GB free NVMe storage.',
  recommended:
    'Recommended: 64GB RAM and an NVIDIA GPU with 16GB of memory. The GPU speeds up drafting and long documents; search and short answers run fine without one.',
  note: 'We check your machine in the first call, plainly and for free. If it is not up to it, we say so, and a RAM upgrade at cost is often the whole fix.',
};

export const FINE_PRINT_BYO =
  'Pricing in AUD ex GST, quoted to fit each practice. On your own hardware the fee covers installation, configuration, training and the 30-day tuning period. Your machine and its operating system stay under your existing vendor warranty and support. Monthly care covers the C4 software: monitoring, updates and model upgrades. Cancel anytime: your system keeps working, you simply stop receiving updates and support.';

export const FINE_PRINT_SUPPLIED =
  'Pricing in AUD ex GST, quoted to fit each practice. Upfront covers the hardware (yours to keep), installation, configuration, team training and a 30-day tuning period. Monthly care covers monitoring, updates, model upgrades and support. Hardware pricing moves with the memory market, so supplied-hardware quotes are held for 14 days. Cancel anytime: your system keeps working, you simply stop receiving updates and support.';

export const FINE_PRINT_MANAGED =
  'Managed pricing in AUD ex GST, over a 36-month term. We own and maintain the hardware, so there is no capital outlay; the monthly covers the machine, monitoring, updates, model upgrades and support. A one-off setup fee covers install, configuration and training. At the end of the term you can renew, refresh the hardware, or buy the unit out.';

/* ── Console scripts ─────────────────────────────────────────────────
   Data-driven steps for the scripted software demos. One renderer
   (ConsoleWindow) plays every script, hero and tiers alike. */

/** Hero console: two exchanges, looped with a soft wipe between them. */
export const heroScript: ConsoleStep[][] = [
  [
    { type: 'status', text: 'LOCAL NETWORK · NO EXTERNAL CONNECTION' },
    { type: 'user', text: 'What did we agree on notice periods in the Harker engagement?' },
    {
      type: 'stream',
      text: "Four weeks' notice either side, agreed 12 March. Clause 8.2 sets out the detail.",
    },
    { type: 'chip', text: 'Harker_Engagement.docx · p.4' },
    { type: 'chip', text: 'File_note_0312.md' },
    { type: 'status', text: '0 bytes sent outside this network', delay: 800 },
  ],
  [
    { type: 'user', text: 'Summarise everything we hold on the Meadows matter.' },
    {
      type: 'stream',
      text: 'Seven documents found. Key dates, amounts and the one unresolved query summarised below.',
    },
    { type: 'chip', text: 'Meadows_Deed_2025.pdf · p.3' },
  ],
];

export const tierScripts: Record<TierId, ConsoleStep[]> = {
  lite: [
    { type: 'status', text: 'LOCAL NETWORK · NO EXTERNAL CONNECTION' },
    { type: 'user', text: 'Draft a short follow-up to the client about Tuesday.' },
    {
      type: 'stream',
      text: 'Drafted from your last two letters to this client, kept to your usual form.',
    },
    { type: 'chip', text: 'Client_letters_2026 · 2 sources' },
    { type: 'status', text: '0 bytes sent outside this network', delay: 800 },
  ],
  solo: [
    { type: 'status', text: 'LOCAL NETWORK · NO EXTERNAL CONNECTION' },
    { type: 'user', text: "Draft a letter confirming Thursday's settlement time." },
    {
      type: 'stream',
      text: 'Drafted. Based on your two prior letters to this client, kept to your usual form.',
    },
    { type: 'chip', text: 'Settlement_letters_2026 · 2 sources' },
    { type: 'status', text: '0 bytes sent outside this network', delay: 800 },
  ],
  foundations: [
    { type: 'status', text: 'WATCHING: /Shared/Matters · LOCAL ONLY' },
    { type: 'tick', text: '142 documents indexed' },
    { type: 'tick', text: '+3 new this morning' },
    { type: 'user', text: 'Summarise everything we hold on the Aldgate lease.' },
    {
      type: 'stream',
      text: 'Six documents found. Key terms, dates and the unresolved rent review clause summarised below.',
    },
    { type: 'chip', text: 'Aldgate_Lease_v4.pdf · p.11' },
    { type: 'chip', text: 'Email_thread_0219.eml' },
  ],
  practice: [
    { type: 'status', text: '4 PEOPLE CONNECTED · QUERIES QUEUE LOCALLY' },
    { type: 'queue', text: 'RM · precedent search: easement access' },
    { type: 'queue', text: 'JT · summarise discovery bundle 7' },
    { type: 'user', text: 'Who touched the Keller matter this week?' },
    { type: 'stream', text: 'Three people. Full trail below, times local.' },
    { type: 'audit', text: 'TUE 09:14 · RM · document search · Keller' },
    { type: 'audit', text: 'TUE 11:02 · JT · draft engagement letter · Keller' },
  ],
  enterprise: [
    { type: 'status', text: 'NODE A ACTIVE · NODE B STANDBY' },
    { type: 'metric', text: 'UPTIME 99.98% · 31 DAYS' },
    { type: 'tick', text: 'Failover test passed · 14:00 · 38 seconds' },
    { type: 'user', text: 'Route all conveyancing intake through the checklist workflow.' },
    {
      type: 'stream',
      text: 'Done. New intake now lands in the checklist queue with a completeness score.',
    },
  ],
};

/* ── Visually hidden summaries ───────────────────────────────────────
   The consoles are decorative (aria-hidden). These plain sentences tell
   the same story to screen readers. */

export const heroConsoleSummary =
  'Demonstration: the assistant answers a contract question with cited sources, entirely on the local network. Nothing is sent outside the building.';

export const tierConsoleSummaries: Record<TierId, string> = {
  lite: 'Demonstration: a short client letter drafted from prior correspondence, entirely on the local machine.',
  solo: 'Demonstration: a settlement letter drafted from your prior letters, every answer cited to its source document.',
  foundations:
    'Demonstration: shared folders indexed locally as they change, a lease summarised with cited sources.',
  practice:
    'Demonstration: team queries queue locally, with a per-person audit trail of who touched a matter.',
  enterprise:
    'Demonstration: paired units with failover, and intake routed through a custom checklist workflow.',
};
