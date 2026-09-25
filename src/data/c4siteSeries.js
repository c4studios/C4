/*
 * The five C4Site series, in age order. One source for the schools page
 * (/ai-training-for-schools) and the free packs page (/c4sight-previews), so
 * the two never drift. Lines are drawn from the preview packs in
 * c4sight-schools/deliverables/previews (read 21 Sep 2026); the PDFs are the
 * published editions in public/downloads/c4sight.
 *
 * `group` maps the email deep links (#primary, #secondary, #staff) onto a
 * pre-selection on the free packs page.
 */
export const C4SITE_SERIES = [
  {
    key: 'S1',
    group: 'primary',
    band: 'Pre-primary to Year 2',
    name: 'The Computer Puppy',
    line: 'A computer starts out knowing nothing. We teach it, it gets things wrong, and the class works out who is really in charge.',
    file: '/downloads/c4sight/Series-1-The-Computer-Puppy-Preview.pdf',
  },
  {
    key: 'S2',
    group: 'primary',
    band: 'Years 3 to 6',
    name: 'Who Taught the Machine?',
    line: 'How a machine learns from the examples people give it, why it can be confidently wrong, and why that comes back to the people who taught it.',
    file: '/downloads/c4sight/Series-2-Who-Taught-The-Machine-Preview.pdf',
  },
  {
    key: 'S3',
    group: 'secondary',
    band: 'Years 7 to 9',
    name: 'Can You Trust It?',
    line: 'What counts as evidence when a machine can invent a fact or fake a face, and how to check before you believe it.',
    file: '/downloads/c4sight/Series-3-Can-You-Trust-It-Preview.pdf',
  },
  {
    key: 'S4',
    group: 'secondary',
    band: 'Years 10 to 12',
    name: 'Your Move',
    line: 'Using AI for study without handing it the thinking, and why AI detectors do not reliably work. It ends on what AI means for the work they are heading into.',
    file: '/downloads/c4sight/Series-4-Your-Move-Preview.pdf',
  },
  {
    key: 'S5',
    group: 'staff',
    band: 'Staff PD',
    name: 'Monday Morning AI',
    line: 'Real time-savers your staff can use that week, then the honest conversation about assessment integrity and where your school stands.',
    file: '/downloads/c4sight/Series-5-Monday-Morning-AI-Preview.pdf',
  },
];
