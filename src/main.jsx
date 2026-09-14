import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/styles/fonts.css'
import '@/index.css'
import '@/globals.css'
import '@/styles/marks.css'

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
