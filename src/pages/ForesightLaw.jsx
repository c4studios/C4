import React from 'react';
import SectorPage from '@/components/sight/SectorPage';

const DATA = {
  sector: 'Law firms',
  sectorKey: 'law',
  path: '/ai-training-for-law-firms',
  serviceType: 'AI literacy training for law firms',
  meta: {
    title: 'AI training for law firms in Perth',
    description:
      'Verification-first AI workshops for law firms, led by a JD student who understands the conduct obligations. Faster drafting and summarising. Nothing taught is legal advice.',
  },
  heroLines: ['AI for legal work,', 'verified by default.'],
  heroIntro:
    'Conservative, verification-heavy AI training for law firms. Faster drafting and summarising, with the habits that stop AI fabrications reaching a client or a court.',
  tasks: {
    heading: 'Where AI helps, used carefully',
    items: [
      'First-draft correspondence and documents',
      'Plain-English rewrites of dense material',
      'Summarising long documents',
      'Research starting points, never authority',
      'Checklists and process scaffolding',
    ],
  },
  risk: {
    heading: 'The fabricated citation problem, handled',
    intro:
      'AI will invent cases, quotes and authorities with total confidence. In legal work that is a professional risk, not a quirk. Verification is built into everything taught.',
    points: [
      'Legal professional privilege and client confidentiality stay protected',
      'No fact, citation or authority is relied on without checking it against a real source',
      'AI output is a starting point, never something filed or sent unverified',
    ],
  },
  credibility: {
    heading: 'Why a firm picks C4Sight',
    body: 'C4Sight is led by Caleb Scott, a JD student. The training speaks the language of practice and takes the conduct obligations seriously, which is the difference between a generic AI course and one built for a firm.',
  },
  win: 'A drafting or summarising task sped up, with a verification routine the team actually trusts.',
  governanceNote:
    'The data-safety and verification module runs every session and is the standard C4Sight stands behind.',
  disclaimer:
    'Nothing taught is legal advice. Practitioners remain bound by their professional conduct rules, and no AI output should be filed or relied on unverified.',
  ctaHeading: 'Bring AI into the firm without the risk.',
};

export default function ForesightLaw() {
  return <SectorPage data={DATA} />;
}
