import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentHead from '@/hooks/useDocumentHead';

// Redirect legacy Contact page to the new Support page so old links keep working.
export default function Contact() {
  const nav = useNavigate();

  useDocumentHead({
    title: 'Contact — C4 Studios',
    description: 'Contact C4 Studios. Redirecting to support and project enquiries.',
    path: '/Contact',
    noIndex: true,
  });

  useEffect(() => {
    // replace so back-button doesn't create a loop
    nav('/Support', { replace: true });
  }, [nav]);

  return null;
}
