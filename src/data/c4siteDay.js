/*
 * The C4Site workplace day: the two formats and the run of a day, block by
 * block, in minutes. Moved unchanged from src/pages/Foresight.jsx on 24 Sep
 * 2026 so the hub and the sector pages read one source. The run of day is
 * verbatim from the delivery document, c4sight-workshop-curriculum.md.
 */
/* `hours` mirrors the duration already stated in each format's copy —
   it exists so the margin hand can derive its arithmetic from data
   instead of hardcoding figures (decision memo §1.4.4). */

export const FORMATS = [
  {
    label: 'Half day',
    duration: 'About 3.5 hours',
    hours: 3.5,
    popular: false,
    body: 'Foundations, hands-on work, prompting that produces useful output, and the data-safety module. One sector focus per session. The team leaves having done real work, with a prompt pack they keep.',
  },
  {
    label: 'Full day',
    duration: 'About 6 hours',
    hours: 6,
    popular: true,
    body: 'The half-day morning, plus an afternoon where attendees bring their own recurring tasks and build repeatable workflows they keep, written up in their own words.',
  },
];

/* The run of a day, block by block, in minutes. Verbatim from the delivery
   document (c4sight-workshop-curriculum.md): blocks 0 to 5 are the half day,
   6 to 8 and the close are the full-day afternoon. `rest` blocks are breaks.
   Lunch has no stated length there, so it is not listed. */
export const RUN_OF_DAY = [
  { part: 'am', label: 'Setup', min: 15 },
  { part: 'am', label: 'What these tools are', min: 30 },
  { part: 'am', label: 'First hands-on', min: 45 },
  { part: 'am', label: 'Break', min: 15, rest: true },
  { part: 'am', label: 'Prompting that works', min: 45 },
  { part: 'am', label: 'Data safety', min: 30 },
  { part: 'am', label: 'Making it stick', min: 20 },
  { part: 'pm', label: 'Your own tasks', min: 60 },
  { part: 'pm', label: 'Break', min: 15, rest: true },
  { part: 'pm', label: 'Build a workflow you keep', min: 45 },
  { part: 'pm', label: 'Your questions', min: 30 },
  { part: 'pm', label: 'The pack', min: 15 },
];
