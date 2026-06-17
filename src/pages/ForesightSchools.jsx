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
};

export default function ForesightSchools() {
  return <SectorPage data={DATA} />;
}
