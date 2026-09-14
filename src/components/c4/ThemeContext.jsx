import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({ mode: 'light', toggle: () => {}, isDark: false });

function getSystemPreference() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/* The palette lives in globals.css only: light on :root, dark on
   :root.dark-mode and on the OS-preference block. Until 9 September 2026 this
   file also wrote 66 tokens per theme inline on <html>, and the two copies had
   drifted in twelve values; the inline --c4-text-muted (#76756F, 4.25:1 on the
   page ground) was what production rendered while the stylesheet documented
   #6B6A64 (4.99:1). The class toggle below is the whole mechanism now. */

/* Re-apply the visitor's stored theme after a forced-chrome arm page unmounts.
   Arm pages (Foresight/Lens/ServiceAI/ServiceWeb) skew the theme CLASS and add a
   marker that CSS-pins the chrome tokens. They used to restore a stale className
   snapshot on unmount, which — because a child page's effect can run before
   ThemeProvider's — could strand the site with no theme class (the black-home
   bug). This restores the class from the stored preference and strips every arm
   marker. The --c4-* tokens come from globals.css by class, so nothing else
   needs re-applying. */
export function reassertStoredTheme() {
  const root = document.documentElement;
  root.classList.remove('sg-on-board', 'cw-on-board', 'lv-on-stage', 'wa-on-sheet', 'vivid');
  let pref = 'system';
  try { pref = localStorage.getItem('c4-theme-pref') || 'system'; } catch {}
  const dark = pref === 'dark' || (pref === 'system' && getSystemPreference() === 'dark');
  root.classList.toggle('dark-mode', dark);
  root.classList.toggle('light-mode', !dark);
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
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
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
