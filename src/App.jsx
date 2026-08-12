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
import LeadEngine from './pages/LeadEngine';
import { liveSeoPages } from './content/seo/registry';
import { createPageUrl } from './utils';
import WelcomeReturnButton from './components/welcome/WelcomeReturnButton';

// Networking-card landing — explicit, chrome-free route (no NavHeader/Footer)
// so the post-scan experience stays focused and fast. Lazy so it stays out of
// the main bundle.
const Welcome = lazy(() => import('./pages/Welcome'));
const HeroLab = lazy(() => import('./pages/HeroLab'));
const HelixLab = lazy(() => import('./pages/HelixLab'));

// Private AI — offering landing page (flat slug). Lazy so GSAP-heavy page
// code stays out of the main bundle.
const PrivateAI = lazy(() => import('./pages/PrivateAI'));

// C4Sight previews — the tracked lead-magnet download page (flat slug).
const C4SightPreviews = lazy(() => import('./pages/C4SightPreviews'));

// How we use AI — the published position statement (flat slug).
const HowWeUseAI = lazy(() => import('./pages/HowWeUseAI'));
const Unsubscribed = lazy(() => import('./pages/Unsubscribed'));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'));

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
   trackEvent itself refuses to fire under the prerender UA, so the 113
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

/* /CaseStudy/<slug> and /SoftwareProduct/<slug> are the REAL routes: they are
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
          {/* Internal design-lab experiments — dev-only, never shipped to
              production (unlinked, absent from the sitemap; no back chrome). */}
          {import.meta.env.DEV && (
            <>
              <Route
                path="/hero-lab"
                element={
                  <Suspense fallback={null}>
                    <HeroLab />
                  </Suspense>
                }
              />
              <Route
                path="/helix-lab"
                element={
                  <Suspense fallback={null}>
                    <HelixLab />
                  </Suspense>
                }
              />
            </>
          )}
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
          {/* Lead Engine — standalone product landing page (flat slug) */}
          <Route path="/lead-engine" element={
            <LayoutWrapper currentPageName="LeadEngine">
              <LeadEngine />
            </LayoutWrapper>
          } />
          {/* Private AI — offering landing page (flat slug) */}
          <Route path="/private-ai" element={
            <LayoutWrapper currentPageName="PrivateAI">
              <Suspense fallback={null}>
                <PrivateAI />
              </Suspense>
            </LayoutWrapper>
          } />
          {/* C4Sight previews — tracked lead-magnet download page (flat slug) */}
          <Route path="/c4sight-previews" element={
            <LayoutWrapper currentPageName="C4SightPreviews">
              <Suspense fallback={null}>
                <C4SightPreviews />
              </Suspense>
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
          {/* Generic opt-out form, for the link in Caleb's email signature. */}
          <Route path="/unsubscribe" element={
            <LayoutWrapper currentPageName="Unsubscribe">
              <Suspense fallback={null}>
                <Unsubscribe />
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
          <Route path="/SoftwareProduct/:slug" element={
            <LayoutWrapper currentPageName="SoftwareProduct">
              <Pages.SoftwareProduct />
            </LayoutWrapper>
          } />
          <Route path="/StartProject" element={<LegacyStartProjectRedirect />} />
          {/* /Services retired: the services live as individual pages reached
              via the nav dropdown. Old links land on home. */}
          <Route path="/Services" element={<Navigate to="/" replace />} />
          {/* Brand & Growth folded into C4 Lens (the brand & visual pillar). */}
          <Route path="/ServiceBrand" element={<Navigate to={createPageUrl('Lens')} replace />} />
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
