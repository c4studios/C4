import React from 'react';
import SectorPage from '@/components/sight/SectorPage';

const DATA = {
  sector: 'Office and business',
  sectorKey: 'business',
  path: '/ai-training-for-business',
  serviceType: 'AI literacy training for business teams',
  meta: {
    title: 'AI training for business teams in Perth',
    description:
      'In-person AI workshops for office and business teams in Perth. Faster emails, documents, summaries and spreadsheets, with client and company data kept safe.',
  },
  heroLines: ['Practical AI for the', 'everyday work week.'],
  heroIntro:
    'Hands-on training for office and business teams. Your people learn to use AI on the real work in front of them, with company and client information kept safe.',
  tasks: {
    heading: 'What your team will actually do',
    items: [
      'Draft and reply to emails faster',
      'Turn rough notes into structured documents',
      'Summarise long threads, meetings and reports',
      'Build and explain spreadsheet formulas',
      'Speed up the repetitive parts of the week',
    ],
  },
  risk: {
    heading: 'Keeping company and client information safe',
    intro:
      'The time saved is only worth it if confidentiality holds. The data-safety module is built around your obligations.',
    points: [
      'Company confidential and commercial-in-confidence material stays out of public tools',
      'Client data is handled in line with your agreements and privacy obligations',
      'A clear rule for what is safe to paste, and what is not',
    ],
  },
  credibility: null,
  win: 'A task your team does every week, done in a fraction of the time, without putting sensitive information at risk.',
  governanceNote:
    'Every session includes the data-safety module, so the team leaves knowing exactly what is and is not safe to put into these tools.',
  disclaimer: null,
  ctaHeading: 'Bring practical AI to your team, safely.',
};

export default function ForesightBusiness() {
  return <SectorPage data={DATA} />;
}
