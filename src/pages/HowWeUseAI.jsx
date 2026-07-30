import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PageHero from '@/components/c4/PageHero';
import useDocumentHead from '@/hooks/useDocumentHead';
import useStaticMode from '@/hooks/useStaticMode';
import { breadcrumbSchema } from '@/lib/schema';
import { ORG_INFO, SITE_URL } from '@/lib/seo';

const ease = [0.22, 1, 0.36, 1];

/* The pledge itself. Each entry is a commitment C4 already keeps, so every line
   here is verifiable against something already published on this site. Nothing
   aspirational: if it is not true today it does not belong on this page.

   Deliberately NOT a card grid. This is a signed position, so it is set as a
   ruled document: statement, then the plain-language detail underneath. */
const PLEDGES = [
  {
    claim: 'Judgement stays human.',
    body:
      'AI drafts, sorts, summarises and speeds things up. It does not decide. Every piece of client work is reviewed by a person before it leaves here, and the accountability for it is ours rather than a model’s.',
  },
  {
    claim: 'We tell you where AI was used.',
    body:
      'If AI wrote a first draft, built part of a workflow, or generated an image, we say so. You never have to guess, and you never have to ask.',
  },
  {
    claim: 'Your data stays yours.',
    body:
      'Our private AI systems run on your own hardware. Nothing is sent to a third party, nothing trains anyone else’s model, and the system keeps working with the internet switched off.',
    link: { label: 'How private AI works', to: '/private-ai' },
  },
  {
    claim: 'In classrooms, students never touch a tool.',
    body:
      'No student devices. No student data entered anywhere. No student images captured or generated. A staff member is present throughout, the camera only ever frames the objects children hold up rather than faces, and the tool runs offline on our own hotspot rather than the school network.',
    link: { label: 'The schools programme', to: '/ai-training-for-schools' },
  },
  {
    claim: 'We say the unpopular true things.',
    body:
      'AI detectors do not reliably work, and we will not tell your students otherwise. Most businesses do not need an AI strategy, they need three automations and a tidy website. We will talk you out of work we do not think you need.',
  },
  {
    claim: 'You can check all of it.',
    body:
      'Our prices are published rather than quoted on request. Every client testimonial is shown in full and uncurated. Every build in the portfolio links to the live site so you can judge the work yourself.',
    link: { label: 'See the portfolio', to: '/Portfolio' },
  },
];

const REVIEWED = '30 July 2026';

export default function HowWeUseAI() {
  const staticMode = useStaticMode();

  useDocumentHead({
    title: 'How we use AI — C4 Studios',
    description:
      'C4 Studios’ published position on AI: judgement stays human, we disclose where AI was used, your data stays on your hardware, and students never touch a tool. Every commitment is checkable.',
    path: '/how-we-use-ai',
    jsonLd: [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'How we use AI', path: '/how-we-use-ai' },
      ]),
      /* A genuine authored position statement, so Article is the honest type.
         Not FAQPage: the content is not question-and-answer shaped, and
         marking it up as such would breach Google's structured data policy. */
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'How we use AI',
        description:
          'The published position of C4 Studios on where AI is used, where it stops, and what stays human.',
        author: { '@type': 'Person', name: ORG_INFO.founder, url: SITE_URL },
        publisher: { '@id': `${SITE_URL}/#localbusiness` },
        dateModified: '2026-07-30',
        mainEntityOfPage: `${SITE_URL}/how-we-use-ai`,
        about: ['Responsible AI', 'AI ethics', 'AI transparency', 'Private AI'],
      },
    ],
  });

  /* Reveals must enhance an already visible default, never gate it: this page
     is written to be quoted by crawlers that do not run JavaScript. */
  const reveal = (i) =>
    staticMode
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-40px' },
          transition: { duration: 0.5, delay: Math.min(i, 4) * 0.05, ease },
        };

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <PageHero
        label="C4 Studios · Our position"
        titleLines={['How we use AI.']}
        description="We build AI systems for a living, and we teach people to use them. That makes it our job to be straight about what AI is for, and where it stops."
      />

      <section className="pb-4 md:pb-6" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-[760px]">
            <p className="text-[14px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
              Everything below is something we already do. If a line here stopped being true, it would
              come off this page rather than stay up as an aspiration.
            </p>
          </div>
        </div>
      </section>

      {/* The pledge, as a ruled document rather than a grid of cards. */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-[860px]">
            {PLEDGES.map((p, i) => (
              <motion.article
                key={p.claim}
                {...reveal(i)}
                className="border-t py-8 md:py-10"
                style={{ borderColor: 'var(--c4-border)' }}
              >
                <h2
                  className="text-[clamp(1.15rem,2.4vw,1.55rem)] font-semibold tracking-[-0.025em] leading-[1.25]"
                  style={{ color: 'var(--c4-text)' }}
                >
                  {p.claim}
                </h2>
                <p
                  className="mt-3 max-w-[62ch] text-[14.5px] leading-[1.75]"
                  style={{ color: 'var(--c4-text-muted)' }}
                >
                  {p.body}
                </p>
                {p.link && (
                  <Link
                    to={p.link.to}
                    className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-70"
                    style={{ color: 'var(--c4-accent)' }}
                  >
                    {p.link.label}
                    <ArrowUpRight size={12} strokeWidth={2.4} />
                  </Link>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Signed off, the way a real commitment is. */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div
            className="max-w-[860px] border-t pt-8"
            style={{ borderColor: 'var(--c4-text)' }}
          >
            <p className="text-[15px] font-semibold tracking-[-0.015em]" style={{ color: 'var(--c4-text)' }}>
              {ORG_INFO.founder}
            </p>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--c4-text-muted)' }}>
              Founder, C4 Studios · Perth, Western Australia
            </p>
            <p
              className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em]"
              style={{ color: 'var(--c4-text-faint)' }}
            >
              Last reviewed {REVIEWED}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link
                to={createPageUrl('StartProject')}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
                style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
              >
                Start a project
              </Link>
              <Link
                to={createPageUrl('Foresight')}
                className="text-[11px] uppercase tracking-[0.14em] font-medium transition-opacity hover:opacity-70"
                style={{ color: 'var(--c4-text-subtle)' }}
              >
                AI training
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
