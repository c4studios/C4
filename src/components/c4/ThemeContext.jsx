import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({ mode: 'light', toggle: () => {}, isDark: false });

function getSystemPreference() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const DARK_TOKENS = {
  '--c4-bg': '#0F1115',
  '--c4-bg-alt': '#161A21',
  '--c4-card-bg': '#161A21',
  '--c4-tag-bg': '#1C2029',
  '--c4-nav-scrolled': 'rgba(15, 17, 21, 0.92)',
  '--c4-text': '#ECE7DE',
  '--c4-text-muted': '#A7ABB4',
  '--c4-text-subtle': '#7D8290',
  '--c4-text-faint': '#505665',
  '--c4-accent': '#B33A3A',
  '--c4-accent-hover': '#9E3232',
  '--c4-accent-secondary': 'transparent',
  '--c4-brand-accent': '#B33A3A',
  '--c4-brand-success': '#2C7A55',
  '--c4-border': 'rgba(236, 231, 222, 0.12)',
  '--c4-border-light': 'rgba(236, 231, 222, 0.07)',
  '--c4-link-hover': '#ECE7DE',
  '--c4-hover-intensity': '1',
  '--c4-footer-bg': '#0A0C10',
  '--c4-footer-text': '#7D8290',
  '--c4-footer-text-muted': '#505665',
  '--c4-footer-text-dim': '#606573',
  '--c4-inverted-bg': '#0A0C10',
  '--c4-inverted-text': '#ECE7DE',
  '--c4-inverted-text-muted': '#A7ABB4',
  '--c4-inverted-text-faint': '#505665',
  '--c4-inverted-border': 'rgba(236, 231, 222, 0.08)',
  '--c4-proof-bg': '#0B0E12',
  '--c4-proof-surface': 'rgba(236, 231, 222, 0.05)',
  '--c4-proof-border': 'rgba(236, 231, 222, 0.10)',
  '--c4-proof-text': '#ECE7DE',
  '--c4-proof-muted': '#A7ABB4',
  '--c4-proof-faint': '#6F7684',
  '--c4-proof-accent': '#C7665F',
  '--c4-ring': 'rgba(236, 231, 222, 0.35)',
  '--c4-lightbox-bg': 'rgba(10, 12, 16, 0.95)',
  '--c4-lightbox-control': 'rgba(236, 231, 222, 0.08)',
  '--c4-lightbox-control-hover': 'rgba(236, 231, 222, 0.15)',
  '--c4-lightbox-text': 'rgba(236, 231, 222, 0.8)',
  '--c4-lightbox-text-dim': '#7D8290',
  '--c4-lightbox-text-accent': '#A7ABB4',
  '--c4-lightbox-placeholder-bg': '#161A21',
  '--c4-lightbox-placeholder-icon': '#505665',
  '--c4-lightbox-placeholder-text': '#606573',
  '--c4-caption-from': 'rgba(15, 17, 21, 0.6)',
  '--c4-caption-via': 'rgba(15, 17, 21, 0.25)',
  '--c4-caption-text': 'rgba(236, 231, 222, 0.9)',
  // Shadcn token sync
  '--background': '225 20% 5%',
  '--foreground': '36 28% 90%',
  '--card': '222 18% 11%',
  '--card-foreground': '36 28% 90%',
  '--popover': '222 18% 11%',
  '--popover-foreground': '36 28% 90%',
  '--primary': '36 28% 90%',
  '--primary-foreground': '225 20% 5%',
  '--secondary': '222 18% 11%',
  '--secondary-foreground': '36 28% 90%',
  '--muted': '225 17% 10%',
  '--muted-foreground': '222 10% 57%',
  '--accent': '222 18% 11%',
  '--accent-foreground': '36 28% 90%',
  '--destructive': '0 50% 46%',
  '--destructive-foreground': '36 28% 90%',
  '--border': '36 28% 90% / 0.12',
  '--input': '36 28% 90% / 0.14',
  '--ring': '36 28% 90% / 0.35',
};

const LIGHT_TOKENS = {
  '--c4-bg': '#F7F5F2',
  '--c4-bg-alt': '#F0EDE8',
  '--c4-card-bg': '#FFFFFF',
  '--c4-tag-bg': '#F4F2EF',
  '--c4-nav-scrolled': 'rgba(247, 245, 242, 0.92)',
  '--c4-text': '#1A1A1A',
  '--c4-text-muted': '#76756F',
  '--c4-text-subtle': '#908E88',
  '--c4-text-faint': '#B0ADA8',
  '--c4-accent': '#C23030',
  '--c4-accent-hover': '#A82828',
  '--c4-accent-secondary': 'transparent',
  '--c4-brand-accent': '#B33A3A',
  '--c4-brand-success': '#2C7A55',
  '--c4-border': '#DDDBD7',
  '--c4-border-light': '#ECEAE6',
  '--c4-link-hover': '#1A1A1A',
  '--c4-hover-intensity': '1',
  '--c4-footer-bg': '#1A1A1A',
  '--c4-footer-text': '#9C9A94',
  '--c4-footer-text-muted': '#6B6963',
  '--c4-footer-text-dim': '#78766F',
  '--c4-inverted-bg': '#1A1A1A',
  '--c4-inverted-text': '#E5E3DE',
  '--c4-inverted-text-muted': '#A5A39E',
  '--c4-inverted-text-faint': '#5A5955',
  '--c4-inverted-border': 'rgba(255,255,255,0.06)',
  '--c4-proof-bg': '#F5EEE7',
  '--c4-proof-surface': '#FFF9F4',
  '--c4-proof-border': '#E8D9CC',
  '--c4-proof-text': '#211A17',
  '--c4-proof-muted': '#78675F',
  '--c4-proof-faint': '#A08C82',
  '--c4-proof-accent': '#B33A3A',
  '--c4-ring': 'rgba(26, 26, 26, 0.4)',
  '--c4-lightbox-bg': 'rgba(10, 10, 10, 0.92)',
  '--c4-lightbox-control': 'rgba(255, 255, 255, 0.07)',
  '--c4-lightbox-control-hover': 'rgba(255, 255, 255, 0.14)',
  '--c4-lightbox-text': 'rgba(255, 255, 255, 0.8)',
  '--c4-lightbox-text-dim': '#777',
  '--c4-lightbox-text-accent': '#999',
  '--c4-lightbox-placeholder-bg': '#1E1E1E',
  '--c4-lightbox-placeholder-icon': '#444',
  '--c4-lightbox-placeholder-text': '#555',
  '--c4-caption-from': 'rgba(26, 26, 26, 0.5)',
  '--c4-caption-via': 'rgba(26, 26, 26, 0.2)',
  '--c4-caption-text': 'rgba(255, 255, 255, 0.9)',
  // Shadcn token sync
  '--background': '40 20% 96.5%',
  '--foreground': '0 0% 10%',
  '--card': '40 15% 95%',
  '--card-foreground': '0 0% 10%',
  '--popover': '40 15% 95%',
  '--popover-foreground': '0 0% 10%',
  '--primary': '0 0% 10%',
  '--primary-foreground': '40 20% 97%',
  '--secondary': '40 10% 92%',
  '--secondary-foreground': '0 0% 10%',
  '--muted': '40 10% 92%',
  '--muted-foreground': '0 0% 45%',
  '--accent': '40 10% 92%',
  '--accent-foreground': '0 0% 10%',
  '--destructive': '0 66% 50%',
  '--destructive-foreground': '0 0% 100%',
  '--border': '0 0% 88%',
  '--input': '0 0% 88%',
  '--ring': '0 0% 10%',
};

function applyTokens(tokens) {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => {
    try {
      const stored = localStorage.getItem('c4-theme-pref');
      return stored || 'system';
    } catch {
      return 'system';
    }
  });

  const [resolvedMode, setResolvedMode] = useState(() => {
    if (preference === 'system') return getSystemPreference();
    return preference;
  });

  // Listen for OS preference changes when in 'system' mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (preference === 'system') {
        setResolvedMode(mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference]);

  // Resolve mode when preference changes
  useEffect(() => {
    if (preference === 'system') {
      setResolvedMode(getSystemPreference());
    } else {
      setResolvedMode(preference);
    }
  }, [preference]);

  // Apply class AND inline CSS variable tokens to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedMode === 'dark') {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
      applyTokens(DARK_TOKENS);
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
      applyTokens(LIGHT_TOKENS);
    }
  }, [resolvedMode]);

  // Persist preference
  useEffect(() => {
    try { localStorage.setItem('c4-theme-pref', preference); } catch {}
  }, [preference]);

  const toggle = useCallback(() => {
    setPreference(resolvedMode === 'light' ? 'dark' : 'light');
  }, [resolvedMode]);

  const isDark = resolvedMode === 'dark';

  return (
    <ThemeContext.Provider value={{ mode: resolvedMode, preference, toggle, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
