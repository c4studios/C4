/**
 * tiers.ts — single source of truth for the /private-ai page.
 *
 * All tier content, console scripts and screen-reader summaries live here so
 * future price or copy edits are a single-file change. Copy is final and
 * matches the C4 Private AI print collateral. Australian spelling, no em
 * dashes anywhere.
 */

export type TierId = 'solo' | 'foundations' | 'practice' | 'enterprise';

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

export const tiers = [
  {
    id: 'solo',
    name: 'Solo',
    suitedTo: 'Sole practitioners, 1 to 2 people',
    upfront: 'from $6,900',
    monthly: '$245',
    hardwareLine:
      'Supplied unit: Mac Studio, M4 Max, 36GB unified memory. New, with AppleCare+.',
    unitCount: 1,
    unitBadge: '36GB',
    includes: [
      'Private assistant over your own documents, with sources',
      'On-site transcription of dictation and consults',
      'Drafting of correspondence and file notes',
      'Local audit log of every query',
      'Installation, training and a 30-day tuning period',
    ],
    goLive: 'Typically live within 2 to 3 weeks of acceptance.',
  },
  {
    id: 'foundations',
    name: 'Foundations',
    suitedTo: 'Small teams, 3 to 10 people',
    upfront: 'from $11,500',
    monthly: '$395',
    hardwareLine:
      'Supplied unit: Mac Studio, M4 Max, 64GB unified memory. New, with AppleCare+.',
    unitCount: 1,
    unitBadge: '64GB',
    includes: [
      'Everything in Solo, for the whole team',
      'Automatic indexing of shared folders as they change',
      'Longer documents and bigger matters in one pass',
      'Per-person usage in the audit log',
      'Installation, training and a 30-day tuning period',
    ],
    goLive: 'Built to order. Typically live within 7 to 11 weeks of acceptance.',
  },
  {
    id: 'practice',
    name: 'Practice',
    suitedTo: 'Established practices, 10 to 40 people',
    upfront: 'from $22,000',
    monthly: '$795',
    hardwareLine:
      'Supplied unit: Mac Studio, M3 Ultra, 96GB unified memory. New, with AppleCare+.',
    unitCount: 1,
    unitBadge: '96GB',
    includes: [
      'A custom front-end built for your practice and matters',
      'Whole-office document search with citations',
      'Queued multi-user access with per-person history',
      'Practice-wide audit trail for oversight',
      'Installation, training and a 30-day tuning period',
    ],
    goLive: 'Typically live within 2 to 3 weeks of acceptance.',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    suitedTo: 'Larger or high-stakes environments',
    upfront: 'from $40,000',
    monthly: 'from $1,500',
    hardwareLine: 'Paired units or a purpose-built GPU system, scoped to the environment.',
    unitCount: 2,
    unitBadge: 'PAIRED',
    includes: [
      'Redundant hardware with failover',
      'Workflows built around your highest-value processes',
      'Service levels agreed in writing',
      'Everything in Practice',
      'Installation, training and a 30-day tuning period',
    ],
    goLive: 'Scoped and quoted per environment.',
  },
] as const;

export type Tier = (typeof tiers)[number];

export const DEFAULT_TIER: TierId = 'solo';

export function isTierId(value: string | null | undefined): value is TierId {
  return tiers.some((t) => t.id === value);
}

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
    { type: 'user', text: "Summarise yesterday's consult recording." },
    {
      type: 'stream',
      text: 'Done. 14 minute consult transcribed on this machine. Draft note created.',
    },
    { type: 'chip', text: 'consult_0322.m4a · local' },
  ],
];

export const tierScripts: Record<TierId, ConsoleStep[]> = {
  solo: [
    { type: 'status', text: 'LOCAL NETWORK · NO EXTERNAL CONNECTION' },
    { type: 'user', text: "Draft a letter confirming Thursday's settlement time." },
    {
      type: 'stream',
      text: 'Drafted. Based on your two prior letters to this client, kept to your usual form.',
    },
    { type: 'chip', text: 'Settlement_letters_2026 · 2 sources' },
    {
      type: 'status',
      text: 'consult_0322.m4a transcribed on this machine · draft note created',
      delay: 800,
    },
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
  solo: 'Demonstration: a settlement letter drafted from your prior letters, transcription done on the machine itself.',
  foundations:
    'Demonstration: shared folders indexed locally as they change, a lease summarised with cited sources.',
  practice:
    'Demonstration: team queries queue locally, with a per-person audit trail of who touched a matter.',
  enterprise:
    'Demonstration: paired units with failover, and intake routed through a custom checklist workflow.',
};
