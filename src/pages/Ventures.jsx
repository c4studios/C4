import React from 'react';
import VenturesHero from '../components/ventures/VenturesHero';
import HowItWorks from '../components/ventures/HowItWorks';
import StrongSubmission from '../components/ventures/StrongSubmission';
import VentureForm from '../components/ventures/VentureForm';
import VenturesBoundaries from '../components/ventures/VenturesBoundaries';
import VenturesServiceCTA from '../components/ventures/VenturesServiceCTA';

export default function Ventures() {
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