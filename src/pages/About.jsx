import React, { useMemo } from 'react';
import AboutHero from '../components/about/AboutHero';
import StudioStats from '../components/about/StudioStats';
import FounderProfile from '../components/about/FounderProfile';
import StudioTimeline from '../components/about/StudioTimeline';
import StudioValues from '../components/about/StudioValues';
import FaithSection from '../components/about/FaithSection';
import StudioProcess from '../components/about/StudioProcess';
import WhyHireC4 from '../components/about/WhyHireC4';
import WorkWithUs from '../components/about/WorkWithUs';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, organizationSchema, personSchema } from '@/lib/schema';

export default function About() {
  const jsonLd = useMemo(() => [
    organizationSchema(),
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/About' },
    ]),
  ], []);

  useDocumentHead({
    title: 'About — Small Studio, High Standards, Direct Contact',
    description:
      'C4 Studios is a small founder-led design and development studio in Perth. Direct contact with the people doing the work, and a high bar for craft.',
    path: '/About',
    jsonLd,
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <AboutHero />
      <StudioStats />
      <FounderProfile />
      <StudioTimeline />
      <StudioValues />
      <FaithSection />
      <StudioProcess />
      <WhyHireC4 />
      <WorkWithUs />
    </div>
  );
}