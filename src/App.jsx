import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Suspense, lazy } from 'react';
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

/* Path-style aliases for the URLs the sitemap/llms.txt publish
   (/CaseStudy/<slug>, /SoftwareProduct/<slug>). The prerenderer writes real
   HTML at those paths for crawlers, but the SPA only routes the ?slug= form —
   without these, hydration replaced the content with a 404. */
function CaseStudyPathAlias() {
  const { slug } = useParams();
  return <Navigate to={`/CaseStudy?slug=${encodeURIComponent(slug)}`} replace />;
}

function SoftwareProductPathAlias() {
  const { slug } = useParams();
  return <Navigate to={`/SoftwareProduct?slug=${encodeURIComponent(slug)}`} replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      {/* Honour prefers-reduced-motion for every framer-motion animation. */}
      <MotionConfig reducedMotion="user">
      <Router>
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
          {/* Path-style deep links from the sitemap/llms.txt */}
          <Route path="/CaseStudy/:slug" element={<CaseStudyPathAlias />} />
          <Route path="/SoftwareProduct/:slug" element={<SoftwareProductPathAlias />} />
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
