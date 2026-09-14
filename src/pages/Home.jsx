import React, { useMemo } from 'react';
import HeroSection from '../components/home/HeroSection';
import FourDoors from '../components/home/FourDoors';
import Quotr from '../components/home/Quotr';
import TestimonialsProof from '../components/home/TestimonialsProof';
import FinalCTA from '../components/home/FinalCTA';
import useDocumentHead from '@/hooks/useDocumentHead';
import { organizationSchema, localBusinessSchema, websiteSchema } from '@/lib/schema';
import '../components/home/home.css';

export default function Home() {
  const jsonLd = useMemo(() => [
    organizationSchema(),
    localBusinessSchema(),
    websiteSchema(),
  ], []);

  useDocumentHead({
    title: 'C4 Studios — Web Design, AI Automations & Photography in Perth',
    description:
      'Perth design and development studio building custom websites, AI automations, and professional photography for ambitious founders and brands.',
    path: '/',
    jsonLd,
  });
  /* The first-visit intro overlay (2.9s, no skip) retired on 9 September
     2026. index.html now carries a boot sheet that holds every page until
     the app has mounted and the fonts are in, then hands over; the home
     page gets nothing extra. */
  return (
    <>
      {(
        <div className="hm-root" style={{ backgroundColor: 'var(--c4-bg)' }}>
          {/* Hero carries the live CraftHeatmap work-proof surface. */}
          <HeroSection />
          <FourDoors />
          {/* Quotr: the studio's own estimator, every figure from pricing.js. */}
          <Quotr />
          <TestimonialsProof />
          <FinalCTA />
        </div>
      )}
    </>
  );
}
