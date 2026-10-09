import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Suspense, lazy, useEffect } from 'react';
import { trackEvent } from './lib/track';
import PageNotFound from './lib/PageNotFound';
import SeoPage from './pages/SeoPage';
import { liveSeoPages } from './content/seo/registry';
import { createPageUrl } from './utils';
import WelcomeReturnButton from './components/welcome/WelcomeReturnButton';
// SEO & copywriting (2 Oct 2026). Imported eagerly: as a lazy() chunk behind
// a null Suspense fallback, a prerendered page blanks while the chunk arrives
// (CLS 0.81 measured at 1280 on the old C4Site previews page, 24 Sep 2026).
import SeoCopy from './pages/SeoCopy';

// Networking-card landing — explicit, chrome-free route (no NavHeader/Footer)
// so the post-scan experience stays focused and fast. Lazy so it stays out of
// the main bundle.
const Welcome = lazy(() => import('./pages/Welcome'));

// C4i, /private-ai, /ServiceAI, /lead-engine and the AI & automation pages
// moved to C4Site (c4site.com.au) with C4i on 9 Oct 2026. public/_redirects
// sends their old paths there. The page files stay in src/ unimported until
// a later cleanup deletes them.

// How we use AI — the published position statement (flat slug).
const HowWeUseAI = lazy(() => import('./pages/HowWeUseAI'));
const Unsubscribed = lazy(() => import('./pages/Unsubscribed'));
const OptOut = lazy(() => import('./pages/OptOut'));

// Insights — index for the editorial articles. The articles themselves are
// registry-driven and live at flat root slugs; this is their hub.
const Insights = lazy(() => import('./pages/Insights'));

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : () => <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout
  ? <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

function LegacyStartProjectRedirect() {
  const location = useLocation();

  return <Navigate to={`${createPageUrl('StartProject')}${location.search}${location.hash}`} replace />;
}

/* First-party page_view on every SPA route change (and the landing render).
   trackEvent itself refuses to fire under the prerender UA, so the
   prerendered pages don't log a deploy's worth of phantom views. */
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackEvent('page_view', {
      path: location.pathname,
      referrer: document.referrer || null,
    });
  }, [location.pathname]);

  return null;
}

/* /CaseStudy/<slug> is the REAL route: it is
   what the sitemap lists, what the prerenderer writes real HTML to, and what
   each page now declares as its canonical.

   These used to be aliases that redirected to the ?slug= query form, which
   inverted the whole thing: the sitemap advertised the pretty path while the
   page declared ?slug= canonical, and ?slug= has no static file, so the
   _redirects catch-all served the homepage to any crawler that does not run
   JavaScript. The pages themselves now handle a legacy ?slug= arrival by
   redirecting up to the canonical path. */

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      {/* Honour prefers-reduced-motion for every framer-motion animation. */}
      <MotionConfig reducedMotion="user">
      <Router>
        <PageViewTracker />
        <Routes>
          {/* Networking-card landing — no Layout chrome, lazy-loaded */}
          <Route
            path="/welcome"
            element={
              <Suspense fallback={null}>
                <Welcome />
              </Suspense>
            }
          />
          <Route path="/" element={
            <LayoutWrapper currentPageName={mainPageKey}>
              <MainPage />
            </LayoutWrapper>
          } />
          {Object.entries(Pages).map(([path, Page]) => {
            const routePath = createPageUrl(path);

            return (
              <Route
                key={path}
                path={routePath}
                element={
                  <LayoutWrapper currentPageName={path}>
                    <Page />
                  </LayoutWrapper>
                }
              />
            );
          })}
          {/* Programmatic SEO pages — explicit route per LIVE registry entry,
              so unknown slugs still fall through to the 404 catch-all. */}
          {liveSeoPages().map((entry) => (
            <Route
              key={entry.slug}
              path={`/${entry.slug}`}
              element={
                <LayoutWrapper currentPageName={entry.slug}>
                  <SeoPage slug={entry.slug} />
                </LayoutWrapper>
              }
            />
          ))}
          {/* Logo Design (/logo-design, 9 Oct 2026) needs no line here: it's
              in pages.config.js, eagerly imported, and the Pages map above
              gives it its route through PAGE_URLS. */}
          {/* SEO & copywriting — service page (flat slug) */}
          <Route path="/seo-and-copywriting" element={
            <LayoutWrapper currentPageName="SeoCopy">
              <SeoCopy />
            </LayoutWrapper>
          } />
          {/* How we use AI — the published position statement (flat slug) */}
          <Route path="/how-we-use-ai" element={
            <LayoutWrapper currentPageName="HowWeUseAI">
              <Suspense fallback={null}>
                <HowWeUseAI />
              </Suspense>
            </LayoutWrapper>
          } />
          {/* Generic opt-out form, for the link in Caleb's email signature.
              NOT at /unsubscribe — that path is consumed by the _redirects rule
              carrying the tokenised links. */}
          <Route path="/opt-out" element={
            <LayoutWrapper currentPageName="OptOut">
              <Suspense fallback={null}>
                <OptOut />
              </Suspense>
            </LayoutWrapper>
          } />
          {/* Where the unsubscribe link in outreach emails lands. noindex. */}
          <Route path="/unsubscribed" element={
            <LayoutWrapper currentPageName="Unsubscribed">
              <Suspense fallback={null}>
                <Unsubscribed />
              </Suspense>
            </LayoutWrapper>
          } />
          {/* Insights — article index (flat slug) */}
          <Route path="/insights" element={
            <LayoutWrapper currentPageName="Insights">
              <Suspense fallback={null}>
                <Insights />
              </Suspense>
            </LayoutWrapper>
          } />
          {/* The canonical, prerendered, sitemap-listed detail URLs */}
          <Route path="/CaseStudy/:slug" element={
            <LayoutWrapper currentPageName="CaseStudy">
              <Pages.CaseStudy />
            </LayoutWrapper>
          } />
          <Route path="/StartProject" element={<LegacyStartProjectRedirect />} />
          {/* /Services retired: the services live as individual pages reached
              via the nav dropdown. Old links land on home. */}
          <Route path="/Services" element={<Navigate to="/" replace />} />
          {/* The old brand service page. Brand work sat under C4 Lens until
              logo design became its own arm on 9 Oct 2026, so it lands on
              Logo Design now (public/_redirects mirrors this). */}
          <Route path="/ServiceBrand" element={<Navigate to={createPageUrl('LogoDesign')} replace />} />
          {/* Initiatives retired: Ventures and Rebuild are no longer offered. */}
          <Route path="/Ventures" element={<Navigate to="/" replace />} />
          <Route path="/Rebuild" element={<Navigate to="/" replace />} />
          {/* The Ventures-specific Terms are gone; point old links at the ToS. */}
          <Route path="/Terms" element={<Navigate to="/terms-of-service" replace />} />
          <Route path="*" element={
            <LayoutWrapper currentPageName="NotFound">
              <PageNotFound />
            </LayoutWrapper>
          } />
        </Routes>
        <WelcomeReturnButton />
      </Router>
      </MotionConfig>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
