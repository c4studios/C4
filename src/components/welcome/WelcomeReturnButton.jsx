/**
 * WelcomeReturnButton — a floating "back to the card" button.
 *
 * Appears on ANY page ONLY when the visitor arrived there by following a link
 * from /welcome (the NFC/QR card landing). /welcome "arms" a per-tab
 * sessionStorage flag whenever an internal link is clicked; this button reads
 * it and offers a one-tap way back. Organic visitors (who never came from the
 * card) never see it, and it's cleared the moment they return to /welcome.
 *
 * Mounted once, app-wide, inside the Router (renders on every route; hides on
 * /welcome itself).
 */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const KEY = 'c4:welcomeReturn';

export default function WelcomeReturnButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const [target, setTarget] = useState(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // On the card itself, the journey's over — clear the flag and never show.
    if (location.pathname === '/welcome') {
      try { sessionStorage.removeItem(KEY); } catch { /* */ }
      setTarget(null); setShown(false);
      return undefined;
    }
    let t = null;
    try { t = sessionStorage.getItem(KEY); } catch { /* */ }
    setTarget(t);
    if (t) { const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id); }
    setShown(false);
    return undefined;
  }, [location]);

  if (!target) return null;

  const go = () => { try { sessionStorage.removeItem(KEY); } catch { /* */ } navigate(target); };

  return (
    <button
      type="button"
      onClick={go}
      aria-label="Back to the C4 card"
      style={{
        position: 'fixed', left: 16, bottom: 16, zIndex: 55,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 16px 10px 13px', borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.14)',
        background: 'rgba(16,18,22,0.92)', color: '#ECE7DE',
        fontWeight: 600, fontSize: 13.5, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        letterSpacing: '0.01em', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)',
        opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <ArrowLeft size={15} strokeWidth={2} color="#B33A3A" />
      Back to the card
    </button>
  );
}
