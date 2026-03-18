import { useEffect, useRef } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export default function TurnstileWidget({ onToken, onExpire }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const callbacksRef = useRef({ onToken, onExpire });
  callbacksRef.current = { onToken, onExpire };

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;

    let cancelled = false;
    let timerId;

    function tryRender() {
      if (cancelled || !containerRef.current) return;
      if (!window.turnstile) {
        timerId = setTimeout(tryRender, 200);
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token) => callbacksRef.current.onToken?.(token),
        'expired-callback': () => callbacksRef.current.onExpire?.(),
        theme: 'auto',
      });
    }

    tryRender();

    return () => {
      cancelled = true;
      clearTimeout(timerId);
      if (widgetIdRef.current != null) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* noop */ }
        widgetIdRef.current = null;
      }
    };
  }, []);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} />;
}
