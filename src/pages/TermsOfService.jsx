import React, { useMemo } from 'react';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';
import LegalDocument from '@/components/legal/LegalDocument';

const EFFECTIVE_DATE = '3 July 2026';

const sections = [
  {
    title: '1. About these terms',
    content: [
      'These Terms of Service ("Terms") govern your use of c4studios.com.au (the "Site") and the services offered through it by C4 Studios ("C4 Studios", "we", "us", "our"), a design and development studio based in Perth, Western Australia.',
      'By using the Site or engaging us, you agree to these Terms. If you do not agree, please do not use the Site.',
    ],
  },
  {
    title: '2. Engagement documents come first',
    content:
      'These Terms are the general terms for the Site and our services. Where we agree a specific project with you, that work is governed by a written proposal, quote or statement of work signed or accepted by both parties. If anything in a signed engagement document conflicts with these Terms, the engagement document prevails for that work. Some programmes, such as C4 Studios Ventures, have their own separate terms.',
  },
  {
    title: '3. Using the Site',
    intro: 'When you use the Site, you agree not to:',
    list: [
      'use it for any unlawful purpose or in breach of these Terms;',
      'attempt to gain unauthorised access to, interfere with, or disrupt the Site or its infrastructure;',
      'introduce malware or attempt to probe, scan or test the vulnerability of any system; or',
      'copy, scrape or reproduce Site content beyond normal personal or evaluation use without our permission.',
    ],
  },
  {
    title: '4. Services, quotes and scope',
    content: [
      'Prices shown on the Site are indicative starting points based on a defined scope. The final price, timeline and deliverables for your project are set out in a written quote or proposal after we understand what you need.',
      'A quote is valid for the period stated in it. Work begins once you accept the quote and, where applicable, pay the deposit. Changes to scope after work begins may affect the price and timeline and will be agreed in writing.',
    ],
  },
  {
    title: '5. Fees, deposits and payment',
    content: [
      'Unless your engagement document says otherwise, most projects require a deposit to book the work, with the balance payable at agreed milestones or before launch. Invoices are payable by the date stated on them.',
      'Prices are in Australian dollars. Third-party costs such as domains, hosting or platform subscriptions, paid plugins, stock assets and payment processing fees are your responsibility unless we expressly include them.',
    ],
  },
  {
    title: '6. Monthly plans and care',
    content: [
      'Some services are offered on a monthly basis, including subscription website plans and ongoing care plans. Where you choose a monthly website plan, we build, host and maintain the site while you pay monthly, with ownership timing based on the plan and monthly price (generally around twice the outright price), or you may buy out early.',
      'Monthly website plans have a minimum term of six months and then continue until cancelled with 30 days notice. If you cancel a build-and-host plan before ownership transfers, the site and its hosting arrangement end unless we agree otherwise in writing. Care plans can be cancelled with 30 days notice.',
    ],
  },
  {
    title: '7. Intellectual property',
    content: [
      'All content on the Site, including text, design, graphics and code, is owned by C4 Studios or its licensors and is protected by law. You may not reuse it beyond normal personal or evaluation use without our permission.',
      'For project work, we retain ownership of deliverables until we have been paid in full. On full payment, ownership of the final deliverables produced specifically for you transfers to you, except for third-party or open-source components (which remain under their own licences) and our pre-existing tools, frameworks and know-how, which we license to you only as needed to use your deliverable.',
    ],
  },
  {
    title: '8. Third-party services and links',
    content:
      'Our services often rely on third-party platforms and tools, and the Site may link to third-party websites. We are not responsible for the content, availability or practices of third parties, and your use of them is subject to their own terms.',
  },
  {
    title: '9. Australian Consumer Law',
    content:
      'Our services come with guarantees that cannot be excluded under the Australian Consumer Law. Nothing in these Terms excludes, restricts or modifies any right or remedy, or any guarantee, warranty or other term or condition, that the law says cannot be excluded or limited.',
  },
  {
    title: '10. Warranties and disclaimers',
    content:
      'Except for rights you have under the Australian Consumer Law and any warranty in a signed engagement document, the Site and its content are provided "as is". To the extent permitted by law, we do not warrant that the Site will be uninterrupted, error free, or free of harmful components.',
  },
  {
    title: '11. Limitation of liability',
    content: [
      'To the maximum extent permitted by law, C4 Studios is not liable for any indirect, incidental, special or consequential loss, or loss of profits, revenue or data, arising out of your use of the Site or our services.',
      'Where our liability cannot be excluded but can be limited, our liability is limited, at our option, to resupplying the relevant service or paying the cost of having it resupplied. Nothing in this section limits rights that cannot be limited under the Australian Consumer Law.',
    ],
  },
  {
    title: '12. Privacy',
    link: {
      before: 'We handle personal information in accordance with our ',
      to: '/privacy-policy',
      label: 'Privacy Policy',
      after: ', which forms part of these Terms.',
    },
  },
  {
    title: '13. Changes to these terms',
    content:
      'We may update these Terms from time to time by publishing a revised version on the Site. The "Effective date" above will change when we do. Your continued use of the Site after an update takes effect means you accept the revised Terms.',
  },
  {
    title: '14. Governing law',
    content:
      'These Terms are governed by the laws of Western Australia. You and we submit to the non-exclusive jurisdiction of the courts of Western Australia.',
  },
  {
    title: '15. Contact us',
    email: {
      before: 'Questions about these Terms? Email ',
      address: 'caleb@c4studios.com.au',
      after: '.',
    },
  },
];

export default function TermsOfService() {
  const jsonLd = useMemo(
    () =>
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Terms of Service', path: '/terms-of-service' },
      ]),
    [],
  );

  useDocumentHead({
    title: 'Terms of Service — C4 Studios',
    description:
      'The terms governing use of the C4 Studios website and services, including quotes, payment, ownership, and your rights under the Australian Consumer Law.',
    path: '/terms-of-service',
    jsonLd,
  });

  return (
    <LegalDocument
      label="Legal"
      title="Terms of Service"
      intro="The terms that apply when you use our website and engage C4 Studios."
      effectiveDate={EFFECTIVE_DATE}
      sections={sections}
    />
  );
}
