import React from 'react';
import AboutHero from '../components/about/AboutHero';

import FounderProfile from '../components/about/FounderProfile';
import FaithSection from '../components/about/FaithSection';
import WhyHireC4 from '../components/about/WhyHireC4';
import WorkWithUs from '../components/about/WorkWithUs';

export default function About() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <AboutHero />

      <FounderProfile />
      <FaithSection />
      <WhyHireC4 />
      <WorkWithUs />
    </div>
  );
}