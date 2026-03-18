import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect legacy Contact page to the new Support page so old links keep working.
export default function Contact() {
  const nav = useNavigate();

  useEffect(() => {
    // replace so back-button doesn't create a loop
    nav('/Support', { replace: true });
  }, [nav]);

  return null;
}
