/**
 * /helix-lab — scratch route for the particle-helix hero concept. Noindex,
 * not linked. Graduate or delete once a direction is locked.
 */
import React, { useEffect } from 'react';
import HelixHero from '@/components/hero/HelixHero';
import useDocumentHead from '@/hooks/useDocumentHead';

export default function HelixLab() {
  useDocumentHead({ title: 'Helix lab — C4 Studios', path: '/helix-lab', noIndex: true });
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#07080a';
    return () => { document.body.style.backgroundColor = prev; };
  }, []);
  return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#07080a' }}>
      <div style={{ width: '100%', maxWidth: 980 }}>
        <HelixHero />
      </div>
    </div>
  );
}
