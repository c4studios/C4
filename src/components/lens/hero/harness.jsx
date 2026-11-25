/* Dev harness for the /Lens hero (not part of the site build). Mounts
   <LensHero /> on its own, inside .lens-page and a router, so the hero can be
   checked without the rest of the page. With ?poster it renders the two
   poster stills and leaves them on window.__posters for make-poster.mjs. */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@/styles/fonts.css';
import '@/index.css';
import '@/globals.css';
import '@/styles/marks.css';
import '@/components/lens/lens.css';
import LensHero from './LensHero.jsx';
import { renderPosterBlob } from './eyeRenderer.js';

const params = new URLSearchParams(window.location.search);

function toBase64(blob) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result).split(',')[1]);
    fr.readAsDataURL(blob);
  });
}

if (params.has('poster')) {
  const q = Number(params.get('q')) || 0.86;
  (async () => {
    const out = {};
    for (const w of [1600, 800]) out[w] = await toBase64(await renderPosterBlob(w, q));
    window.__posters = out;
  })().catch((e) => {
    window.__posterError = String(e);
  });
} else {
  createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <div className="lens-page">
        {params.has('nav') && <div className="lh-harness-nav" />}
        <LensHero />
        <div id="packages" style={{ height: '150vh', borderTop: '1px solid rgba(245,245,240,.08)' }} />
      </div>
    </BrowserRouter>
  );
}
