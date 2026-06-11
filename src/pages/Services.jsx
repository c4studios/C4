import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import ServicesHero from '../components/services/ServicesHero';
import ServiceExplorer from '../components/services/ServiceExplorer';
import CompactStandards from '../components/services/CompactStandards';
import ClientChecklist from '../components/services/ClientChecklist';
import CompactProcess from '../components/services/CompactProcess';
import ServicesCTA from '../components/services/ServicesCTA';
import TestimonialSlider from '../components/testimonials/TestimonialSlider';
import { getAllTestimonials } from '../components/testimonials/testimonialData';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';

const ease = [0.22, 1, 0.36, 1];

const SERVICES_FAQ = [
  {
    q: 'What does C4 Studios actually build?',
    a: 'Custom websites, web apps and SaaS platforms; AI automations and internal tools; brand identity and SEO; and professional photography under the C4 Lens banner. Most clients start with one and expand.',
  },
  {
    q: 'How long does a typical website project take?',
    a: 'Marketing sites typically run 2–3 weeks, brand-platform builds 4–6 weeks, and SaaS or app projects scope-dependent. Each project starts with a brief and a fixed scope.',
  },
  {
    q: 'Do you work with clients outside Perth?',
    a: 'Yes. C4 Studios is Perth-based but works remotely with founders and teams across Australia and internationally. Photography is Perth-only.',
  },
  {
    q: 'Do I own the code, design files and assets?',
    a: 'Yes. Clients own their codebase, design source files and creative assets in full on delivery. No platform lock-in.',
  },
];

export default function Services() {
  const jsonLd = useMemo(() => [
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/Services' },
    ]),
    serviceSchema({
      name: 'Web design and development',
      description: 'Landing pages, brochure sites, ecommerce stores and web app starters priced by practical scope.',
      url: '/Services?service=web',
      serviceType: 'Web design',
      offers: [
        { name: 'Landing Page', price: 500, url: '/start?service=web_design&package=starter' },
        { name: 'Brochure Site', price: 800, url: '/start?service=web_design&package=brochure' },
        { name: 'Business Website', price: 1500, url: '/start?service=web_design&package=business' },
        { name: 'Custom Website', price: 2500, url: '/start?service=web_design&package=custom' },
        { name: 'Ecommerce Store', price: 3500, url: '/start?service=web_design&package=commerce-starter' },
        { name: 'Web App Starter', price: 4500, url: '/start?service=web_design&package=web-application' },
      ],
    }),
    serviceSchema({
      name: 'AI automations and custom software',
      description: 'Workflow automation, AI agents, custom integrations and lean software replacements that compound over time.',
      url: '/Services?service=ai',
      serviceType: 'Software automation',
      offers: [
        { name: 'Automation Core', price: 750, url: '/start?service=automation&package=automation-core' },
        { name: 'Workflow Starter', price: 1500, url: '/start?service=automation&package=workflow-starter' },
      ],
    }),
    serviceSchema({
      name: 'Brand identity, SEO and growth',
      description: 'Logo design, identity systems, SEO and content — everything a brand needs to look right and rank well.',
      url: '/Services?service=brand',
      serviceType: 'Brand strategy',
    }),
    serviceSchema({
      name: 'Photography and videography (C4 Lens)',
      description: 'Professional photography, headshots, product imagery and videography for brands ready to retire stock.',
      url: '/Lens',
      serviceType: 'Photography',
      offers: [
        { name: 'Mini Session', price: 200, url: '/start?service=lens&package=mini-session' },
        { name: 'Portrait Session', price: 350, url: '/start?service=lens&package=portrait' },
        { name: 'Business Branding', price: 650, url: '/start?service=lens&package=business-branding' },
      ],
    }),
    faqSchema(SERVICES_FAQ),
  ], []);

  useDocumentHead({
    title: 'Services — Web Design, AI Automations, Brand & Photography',
    description:
      'Four pillars from one Perth studio: custom websites and web apps, AI automations and software, brand and SEO, and professional photography. See pricing, scope and outcomes.',
    path: '/Services',
    jsonLd,
  });
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
