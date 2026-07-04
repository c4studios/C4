import React, { useMemo } from 'react';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';
import LegalDocument from '@/components/legal/LegalDocument';

const EFFECTIVE_DATE = '3 July 2026';

const sections = [
  {
    title: '1. Who we are',
    content: [
      'C4 Studios ("C4 Studios", "we", "us", "our") is a design and development studio based in Perth, Western Australia, operated by its founder, Caleb Scott.',
      'This Privacy Policy explains how we collect, use, hold and disclose personal information when you visit c4studios.com.au (the "Site"), enquire about or engage our services, or otherwise deal with us. We handle personal information in line with the Australian Privacy Principles in the Privacy Act 1988 (Cth).',
    ],
  },
  {
    title: '2. Information we collect',
    intro: 'We only collect information we reasonably need to run the studio and deliver our services. This falls into two broad categories.',
    items: [
      {
        term: 'Information you give us',
        def: 'Your name, email address, business name, and the details you include when you submit an enquiry, project brief, support request, training enquiry, or venture idea; files or attachments you upload; and the contents of emails and messages you send us.',
      },
      {
        term: 'Information collected automatically',
        def: 'Basic technical and usage information such as your device and browser type, approximate location (country), the pages you view, and how you reached the Site, including any campaign or referral tag in a link you followed. Payments are handled by our payment processor, which collects the details needed to process a transaction; we do not store your full card number.',
      },
    ],
  },
  {
    title: '3. How we use your information',
    intro: 'We use personal information to:',
    list: [
      'respond to your enquiries, quotes and support requests;',
      'scope, deliver, support and improve our services;',
      'process payments and manage subscriptions or care plans;',
      'operate, secure and improve the Site and understand how it is used;',
      'protect against spam, fraud and misuse; and',
      'meet our legal, accounting and record-keeping obligations.',
    ],
    outro: 'We do not sell your personal information.',
  },
  {
    title: '4. Cookies and similar technologies',
    content: [
      'The Site uses a small number of cookies and similar technologies. Some are strictly necessary to keep the Site secure and working, including the anti-spam challenge on our forms. Others help us understand aggregate usage so we can improve the Site.',
      'You can control or delete cookies through your browser settings. Blocking strictly necessary cookies may stop parts of the Site, such as form submission, from working properly.',
    ],
  },
  {
    title: '5. Who we share it with',
    intro: 'We do not sell or trade personal information. We share it only where needed to run the studio, with trusted providers who process it on our behalf, including:',
    list: [
      'our hosting and infrastructure provider (Cloudflare), which serves the Site and provides spam protection;',
      'our payment processor (Stripe), where you buy a product or service;',
      'our database, file storage and email providers, used to receive and manage your enquiries and files; and',
      'professional advisers or authorities where we are required or permitted by law.',
    ],
    outro: 'Each provider is engaged to handle information only for the purposes we specify.',
  },
  {
    title: '6. Overseas disclosure',
    content:
      'Some of our service providers store or process information on servers outside Australia. Where that happens, we take reasonable steps to ensure the information is handled consistently with the Australian Privacy Principles and this policy.',
  },
  {
    title: '7. How we keep it safe',
    content:
      'We take reasonable steps to protect personal information from misuse, loss, and unauthorised access, modification or disclosure, including access controls, encryption in transit, and reputable infrastructure. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.',
  },
  {
    title: '8. How long we keep it',
    content:
      'We keep personal information only for as long as we reasonably need it for the purposes described in this policy, or as required by law (for example, tax and business records). When it is no longer needed, we take reasonable steps to delete or de-identify it.',
  },
  {
    title: '9. Accessing and correcting your information',
    content:
      'You can ask us for a copy of the personal information we hold about you, and ask us to correct it if it is inaccurate, out of date or incomplete. We will respond within a reasonable time. There is no charge to make a request, though we may need to verify your identity first.',
  },
  {
    title: '10. Direct marketing',
    content:
      'If we send you marketing communications, every message includes a way to opt out, and we will honour your request. You can also ask us at any time to stop sending you marketing.',
  },
  {
    title: '11. Complaints',
    content:
      'If you believe we have mishandled your personal information, please contact us first and we will work to resolve it. If you are not satisfied with our response, you can contact the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.',
  },
  {
    title: '12. Changes to this policy',
    content:
      'We may update this policy from time to time by publishing a revised version on the Site. The "Effective date" above will change when we do. Your continued use of the Site after an update takes effect means you accept the revised policy.',
  },
  {
    title: '13. Contact us',
    email: {
      before: 'Questions about this policy, or a request about your personal information? Email ',
      address: 'caleb@c4studios.com.au',
      after: ' and we will help.',
    },
  },
];

export default function PrivacyPolicy() {
  const jsonLd = useMemo(
    () =>
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy-policy' },
      ]),
    [],
  );

  useDocumentHead({
    title: 'Privacy Policy — C4 Studios',
    description:
      'How C4 Studios collects, uses, holds and discloses personal information, in line with the Australian Privacy Principles. Perth, Western Australia.',
    path: '/privacy-policy',
    jsonLd,
  });

  return (
    <LegalDocument
      label="Legal"
      title="Privacy Policy"
      intro="How we collect, use and protect your personal information when you use our website and services."
      effectiveDate={EFFECTIVE_DATE}
      sections={sections}
    />
  );
}
