import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/styles/fonts.css'
import '@/index.css'
import '@/globals.css'
import '@/styles/marks.css'

import { preloadSeoContent } from '@/pages/SeoPage'

/* An article's content is its own small module. Load the one for the page
   being opened before the first render, so the app replaces the prerendered
   article with the same article instead of a blank box (12 Oct 2026). Any
   other path resolves at once. A failed load still renders; SeoPage then
   loads the module itself. */
const path = window.location.pathname.replace(/^\/+|\/+$/g, '')
const firstContent = path && !path.includes('/') ? preloadSeoContent(path).catch(() => {}) : Promise.resolve()

firstContent.then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
  )

  /* Hand over from the boot overlay in index.html once the app has mounted and
     the fonts have arrived, so the page never shows half-loaded. The overlay
     keeps its own 5s safety timer. Under the prerender UA the overlay stays put
     so the captured HTML carries it for the next visitor. */
  if (typeof navigator !== 'undefined' && !/Prerender/i.test(navigator.userAgent)) {
    const ready = () => window.__c4BootReady?.();
    const fonts = typeof document !== 'undefined' && document.fonts?.ready;
    if (fonts) fonts.then(() => requestAnimationFrame(ready));
    else requestAnimationFrame(ready);
  }
})
