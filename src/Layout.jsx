import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import NavHeader from './components/c4/NavHeader';
import Footer from './components/c4/Footer';
import PageTransition from './components/c4/PageTransition';
import { ThemeProvider } from './components/c4/ThemeContext';

export default function Layout({ children, currentPageName }) {
  useEffect(() => {
    if (!currentPageName || currentPageName === 'Home') {
      document.title = 'C4 Studios — Web, Automation & Software';
      return;
    }
    const pretty = currentPageName
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (c) => c.toUpperCase());
    document.title = `${pretty} — C4 Studios`;
  }, [currentPageName]);

  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
        <NavHeader />
        <main>
          <AnimatePresence mode="wait">
            <PageTransition pageKey={currentPageName}>
              {children}
            </PageTransition>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}