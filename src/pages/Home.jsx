import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroSequence from '../components/c4/IntroSequence';
import HeroSection from '../components/home/HeroSection';
import FourDoors from '../components/home/FourDoors';
import C4Originals from '../components/home/C4Originals';
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
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem('c4_intro_seen');
    if (!seen) {
      setShowIntro(true);
      setIntroComplete(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setIntroComplete(true);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroSequence onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {introComplete && (
        <div className="hm-root" style={{ backgroundColor: 'var(--c4-bg)' }}>
          {/* Hero carries the live CraftHeatmap work-proof surface. */}
          <HeroSection />
          <FourDoors />
          {/* Software surface — untouched by law; clean air only. */}
          <C4Originals />
          <TestimonialsProof />
          <FinalCTA />
        </div>
      )}
    </>
  );
}
