import { useEffect, useState } from 'react';
import { PRERENDER, isHydrating } from '@/lib/hydration';

/**
 * usePrerenderOpen: open/closed state for an FAQ answer that a crawler must be
 * able to read in the static HTML, and that a visitor sees closed, as before.
 *
 * The prerenderer renders every answer open, so a crawler that reads the HTML
 * without running it gets each answer as visible text (SEO audit M9,
 * 15 Oct 2026). The browser hydrates that HTML, so its first render has to be
 * open too. Until the app has mounted, such an item is "held": it carries
 * data-faq-held, and a rule in globals.css draws a held item closed wherever
 * scripting is on. Then the item closes for real and lets go of the
 * attribute, which changes nothing on screen. A reader without JavaScript
 * never matches the rule and gets every answer open. An item that mounts
 * later (a page reached by a link inside the site) starts closed and is never
 * held.
 *
 *   const [open, setOpen, held] = usePrerenderOpen();
 *   <div data-faq-held={held ? '' : undefined}> … </div>
 */
export default function usePrerenderOpen() {
  const [held, setHeld] = useState(() => PRERENDER || isHydrating());
  const [open, setOpen] = useState(held);

  useEffect(() => {
    if (PRERENDER || !held) return;
    setOpen(false);
    setHeld(false);
  }, [held]);

  return [open, setOpen, held];
}
