import React from 'react';
import VenturesHero from '../components/ventures/VenturesHero';
import HowItWorks from '../components/ventures/HowItWorks';
import StrongSubmission from '../components/ventures/StrongSubmission';
import VentureForm from '../components/ventures/VentureForm';
import VenturesBoundaries from '../components/ventures/VenturesBoundaries';
import VenturesServiceCTA from '../components/ventures/VenturesServiceCTA';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';

export default function Ventures() {
  useDocumentHead({
    title: 'Ventures — Submit Your Idea',
    description:
      'C4 Ventures reviews idea submissions from founders and builders. If the fit is right, we explore building it together. Submission does not guarantee a build.',
    path: '/Ventures',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Ventures', path: '/Ventures' },
    ]),
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <VenturesHero />
      <HowItWorks />
      <StrongSubmission />
      <VentureForm />
      <VenturesBoundaries />
      <VenturesServiceCTA />
    </div>
  );
}