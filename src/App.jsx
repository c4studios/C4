import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
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

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
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
          <Route path="/StartProject" element={<LegacyStartProjectRedirect />} />
          {/* /Services retired: the services live as individual pages reached
              via the nav dropdown. Old links land on home. */}
          <Route path="/Services" element={<Navigate to="/" replace />} />
          <Route path="*" element={
            <LayoutWrapper currentPageName="NotFound">
              <PageNotFound />
            </LayoutWrapper>
          } />
        </Routes>
        <WelcomeReturnButton />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
