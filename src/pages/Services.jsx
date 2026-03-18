import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import ServicesHero from '../components/services/ServicesHero';
import ServiceExplorer from '../components/services/ServiceExplorer';
import CompactStandards from '../components/services/CompactStandards';
import ClientChecklist from '../components/services/ClientChecklist';
import CompactProcess from '../components/services/CompactProcess';
import ServicesCTA from '../components/services/ServicesCTA';
import TestimonialSlider from '../components/testimonials/TestimonialSlider';
import { getAllTestimonials } from '../components/testimonials/testimonialData';

const ease = [0.22, 1, 0.36, 1];

export default function Services() {
  const alreadyComplete = typeof window !== 'undefined' && sessionStorage.getItem('c4_checklist_complete') === 'true';
  const [unlocked, setUnlocked] = useState(alreadyComplete);
  const checklistRef = useRef(null);

  const scrollToChecklist = useCallback(() => {
    if (checklistRef.current) {
      checklistRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleStartProject = useCallback(() => {
    if (!unlocked) {
      scrollToChecklist();
    }
    // Navigation to Contact is handled per-service in ServiceExplorer
  }, [unlocked, scrollToChecklist]);

  const handleUnlock = useCallback((isUnlocked) => {
    setUnlocked(isUnlocked);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <ServicesHero onStartProject={handleStartProject} />
      <ServiceExplorer onStartProject={handleStartProject} />
      <CompactStandards />
      <ClientChecklist onUnlock={handleUnlock} checklistRef={checklistRef} />

      {/* Gated lower section */}
      <motion.div
        initial={false}
        animate={{
          opacity: unlocked ? 1 : 0.25,
          filter: unlocked ? 'blur(0px)' : 'blur(4px)',
          pointerEvents: unlocked ? 'auto' : 'none',
        }}
        transition={{ duration: 0.8, ease }}
        aria-hidden={!unlocked}
      >
        <CompactProcess />
        <TestimonialSlider testimonials={getAllTestimonials()} label="Client feedback" />
        <ServicesCTA onStartProject={handleStartProject} />
      </motion.div>
    </div>
  );
}
