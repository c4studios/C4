import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroSequence from '../components/c4/IntroSequence';
import HeroSection from '../components/home/HeroSection';
import SocialProof from '../components/home/SocialProof';
import ProductTrio from '../components/home/ProductTrio';
import C4Originals from '../components/home/C4Originals';
import PortfolioPreview from '../components/home/PortfolioPreview';
import TestimonialsProof from '../components/home/TestimonialsProof';
import FinalCTA from '../components/home/FinalCTA';
import useDocumentHead from '@/hooks/useDocumentHead';
import { organizationSchema, localBusinessSchema, websiteSchema } from '@/lib/schema';

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
        <div style={{ backgroundColor: 'var(--c4-bg)' }}>
          <HeroSection />
          <SocialProof />
          <ProductTrio />
          <C4Originals />
          <PortfolioPreview />
          <TestimonialsProof />
          <FinalCTA />
        </div>
      )}
    </>
  );
}