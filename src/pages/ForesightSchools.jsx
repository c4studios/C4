import React from 'react';
import SectorPage from '@/components/sight/SectorPage';

const DATA = {
  sector: 'Schools and teachers',
  sectorKey: 'school',
  path: '/ai-training-for-schools',
  serviceType: 'AI literacy training for schools',
  meta: {
    title: 'AI training for schools and teachers, Perth',
    description:
      'Careful, ethics-forward AI workshops for teachers. Lesson planning, differentiated materials and feedback, with student privacy and integrity front and centre.',
  },
  heroLines: ['AI for teachers,', 'handled with care.'],
  heroIntro:
    'Ethics-forward AI training for schools. Practical help with planning and marking, with student privacy and academic integrity treated as the starting point.',
  tasks: {
    heading: 'What teachers will actually do',
    items: [
      'Plan lessons and units faster',
      'Generate differentiated material for different levels',
      'Draft feedback and report comments',
      'Create practice questions and resources',
      'Summarise long curriculum documents',
    ],
  },
  risk: {
    heading: 'Student privacy and academic integrity first',
    intro:
      'Teachers are right to be cautious. The session is built around that caution, not against it.',
    points: [
      'No student names or identifying information goes into these tools, ever',
      'Academic integrity is addressed directly, for staff and students',
      'Your school and Department policies override anything taught in the room',
    ],
  },
  credibility: null,
  win: 'A planning task that normally eats the weekend, cut down, with no student data involved.',
  governanceNote:
    'For schools, the data-safety module expands to cover student-facing implications explicitly.',
  disclaimer: null,
  ctaHeading: 'Give your staff AI they can use responsibly.',
  downloads: {
    heading: 'Free classroom previews — take a lesson for a test drive',
    intro:
      'C4Sight incursions run as five series, one per age group. Each preview is a real, runnable classroom activity you can use tomorrow — no devices, no student data, curriculum-mapped — and a look at what the full incursion adds.',
    items: [
      {
        band: 'Pre-primary – Year 2',
        name: 'The Computer Puppy',
        line: 'A computer starts out knowing nothing. We teach it, it gets things wrong, and the class works out who is really in charge.',
        file: '/downloads/c4sight/Series-1-The-Computer-Puppy-Preview.pdf',
      },
      {
        band: 'Years 3 – 6',
        name: 'Who Taught the Machine?',
        line: 'How a machine learns from the examples people give it, why it can be confidently wrong, and why that is on the people, not the machine.',
        file: '/downloads/c4sight/Series-2-Who-Taught-The-Machine-Preview.pdf',
      },
      {
        band: 'Years 7 – 9',
        name: 'Can You Trust It?',
        line: 'Hallucinations, deepfakes, and what counts as evidence now. The half your students will not get in a free how-AI-works hour.',
        file: '/downloads/c4sight/Series-3-Can-You-Trust-It-Preview.pdf',
      },
      {
        band: 'Years 10 – 12',
        name: 'Your Move',
        line: 'Study, integrity and the future of work. Using AI to think, not to cheat — and why detectors do not work.',
        file: '/downloads/c4sight/Series-4-Your-Move-Preview.pdf',
      },
      {
        band: 'Staff PD',
        name: 'Monday Morning AI',
        line: 'Real time-savers your staff can use that week, then the honest conversation about assessment integrity and a whole-school position.',
        file: '/downloads/c4sight/Series-5-Monday-Morning-AI-Preview.pdf',
      },
    ],
    note:
      'Every preview opens in your browser to read or save — no sign-up. Each carries a complete activity, its curriculum links, and a plain safety note. The paid incursion adds the live demonstration, two presenters (a practitioner and a registered teacher), the full lesson arc, and a resource pack your teachers keep.',
  },
};

export default function ForesightSchools() {
  return <SectorPage data={DATA} />;
}
