import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroSequence from '../components/c4/IntroSequence';
import HeroSection from '../components/home/HeroSection';
import ServicesPreview from '../components/home/ServicesPreview';
import PortfolioPreview from '../components/home/PortfolioPreview';
import VisionSection from '../components/home/VisionSection';
import TestimonialsProof from '../components/home/TestimonialsProof';
import VenturesPreview from '../components/home/VenturesPreview';
import FinalCTA from '../components/home/FinalCTA';

export default function Home() {
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
          <ServicesPreview />
          <PortfolioPreview />
          <VisionSection />
          <TestimonialsProof />
          <VenturesPreview />
          <FinalCTA />
        </div>
      )}
    </>
  );
}