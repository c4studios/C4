import React, { useLayoutEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/styles/fonts.css'
import '@/index.css'
import '@/globals.css'
import '@/styles/marks.css'

import { preloadSeoContent } from '@/pages/SeoPage'
import { PRERENDER, beginHydration, canHydrate, endHydration } from '@/lib/hydration'

/* The page in #root is the prerendered one for this address, so React keeps
   it (hydrateRoot) instead of drawing it again (15 Oct 2026). Until then it
   used createRoot, which threw the prerendered DOM away and rebuilt it, and
   the boot overlay in index.html hid the swap until the whole bundle had
   run: phones saw the logo for 4 to 12 seconds (SEO audit H1). Pages with
   no prerendered HTML for their own address still get createRoot: the dev
   server, a 404 (404.html answers any unknown path), and /welcome and
   /CaseStudy, which _redirects serves with the home page's HTML.

   Hydration needs everything the first render shows to be loaded first:
   React can't wait for a lazy chunk without a Suspense boundary, and this
   HTML has none. Of the prerendered routes, only the SEO pages load
   anything on first paint (each page's content module), so that is loaded
   here before the first render. A failed load renders from scratch instead;
   SeoPage then loads the module itself. Anything lazy() added to a
   prerendered page later has to be preloaded here the same way. */
const root = document.getElementById('root')
const hydrate = !PRERENDER && canHydrate(root, window.location.pathname)

const path = window.location.pathname.replace(/^\/+|\/+$/g, '')
const firstContent = path && !path.includes('/')
  ? preloadSeoContent(path).then(() => true, () => false)
  : Promise.resolve(true)

/* Hydration ends with the first commit. From here on, components mount as
   they always did (see src/lib/hydration.js). */
function Mounted({ mode, children }) {
  useLayoutEffect(() => {
    endHydration()
    if (PRERENDER) return
    document.documentElement.dataset.c4Mount = mode
    try { performance.mark('c4:mounted') } catch { /* old browser */ }
  }, [mode])
  return children
}

firstContent.then((loaded) => {
  if (hydrate && loaded) {
    beginHydration()
    ReactDOM.hydrateRoot(root, <Mounted mode="hydrated"><App /></Mounted>)
    return
  }

  ReactDOM.createRoot(root).render(<Mounted mode="rendered"><App /></Mounted>)

  /* A page drawn from scratch replaces the HTML that was there, so the boot
     overlay covers the swap, as it always did: it lifts once the app has
     mounted and the fonts are in (index.html keeps a 5 s safety timer).
     Under the prerender UA the overlay stays put so the captured HTML
     carries it. A hydrated page never needed this: the overlay shows only
     on a visit's first load there, and lifts on its own. */
  if (!PRERENDER) {
    const ready = () => window.__c4BootReady?.()
    const fonts = document.fonts?.ready
    if (fonts) fonts.then(() => requestAnimationFrame(ready))
    else requestAnimationFrame(ready)
  }
})
