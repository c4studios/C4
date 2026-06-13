import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import SeoPage from './pages/SeoPage';
import LeadEngine from './pages/LeadEngine';
import { liveSeoPages } from './content/seo/registry';
import { createPageUrl } from './utils';

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
          <Route path="/StartProject" element={<LegacyStartProjectRedirect />} />
          <Route path="*" element={
            <LayoutWrapper currentPageName="NotFound">
              <PageNotFound />
            </LayoutWrapper>
          } />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
