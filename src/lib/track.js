/**
 * Site-wide event tracking — first-party, cookie-less, fire-and-forget.
 *
 * Mirrors the /private-ai pattern (src/api/submissions.js recordPrivateAiEvent)
 * but generalised: every event carries the current path plus a per-tab session
 * UUID so journeys can be sequenced server-side. sessionStorage (not local)
 * on purpose: the id dies with the tab, which is the privacy posture the site
 * already committed to on /welcome and /private-ai.
 *
 * The prerenderer must never emit events — 113 pages would each log a
 * page_view on every deploy. Same UA sniff as useStaticMode.
 */

const API_BASE = ''; // same-origin — Cloudflare Pages serves both SPA and Functions

function sessionId() {
  try {
    let id = sessionStorage.getItem('c4_sid');
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem('c4_sid', id);
    }
    return id;
  } catch {
    return null; // storage blocked — events still record, just unsequenced
  }
}

export function trackEvent(event, data = {}) {
  try {
    if (typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent)) return;
    fetch(`${API_BASE}/api/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        session: sessionId(),
        path: typeof location !== 'undefined' ? location.pathname : null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        ...data,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* tracking is best-effort — never surface to the user */
  }
}
