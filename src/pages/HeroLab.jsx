/**
 * /hero-lab — scratch route for iterating on the CompanionHero concept.
 * Not linked anywhere, noindex; remove (or graduate to the Home hero) once
 * the look is locked.
 */
import React, { useEffect } from 'react';
import CompanionHero from '@/components/hero/CompanionHero';
import useDocumentHead from '@/hooks/useDocumentHead';

export default function HeroLab() {
  useDocumentHead({ title: 'Hero lab — C4 Studios', path: '/hero-lab', noIndex: true });

  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#08090b';
    return () => { document.body.style.backgroundColor = prev; };
  }, []);

  return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#08090b' }}>
      <div style={{ width: '100%', maxWidth: 980 }}>
        <CompanionHero />
      </div>
    </div>
  );
}
