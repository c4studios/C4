/* ──────────────────────────────────────────────────────────
   Quotr embed theme handshake (host side)

   Quotr calculators accept a theme handshake when the calculator's
   theme mode is set to "Auto" (or host-control is enabled) in the
   Quotr dashboard:

     - initial:  ?theme=<light|dark>&accent=<#hex>  on the iframe src
                 (set once, avoids a light flash; never changed after
                 mount so the iframe doesn't reload mid-form)
     - live:     postMessage({ type: 'quotr-theme', mode, accent })
                 to the iframe whenever the site theme toggles

   The brand accent is read from the live --c4-accent CSS variable so
   it always matches the resolved theme.
   ────────────────────────────────────────────────────────── */

const QUOTR_ORIGIN = 'https://quotr.us';

// Brand accent tokens, mirrored from ThemeContext (--c4-accent). Used
// directly rather than read via getComputedStyle so the value is correct
// even on the very first render, before the theme tokens are applied.
const ACCENT_LIGHT = '#C23030';
const ACCENT_DARK = '#B33A3A';

export function readAccent(isDark) {
  return isDark ? ACCENT_DARK : ACCENT_LIGHT;
}

export function buildQuotrSrc(slug, isDark) {
  const mode = isDark ? 'dark' : 'light';
  const accent = encodeURIComponent(readAccent(isDark));
  return `${QUOTR_ORIGIN}/q/${slug}?theme=${mode}&accent=${accent}`;
}

export function postQuotrTheme(iframeEl, isDark) {
  const win = iframeEl?.contentWindow;
  if (!win) return;
  win.postMessage(
    {
      type: 'quotr-theme',
      mode: isDark ? 'dark' : 'light',
      accent: readAccent(isDark),
    },
    QUOTR_ORIGIN,
  );
}
