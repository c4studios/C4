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

const REVIEWED = '12 August 2026';

export default function HowWeUseAI() {
  const staticMode = useStaticMode();

  useDocumentHead({
    title: 'How we use AI — C4 Studios',
    description:
      'The full C4 Studios position on AI: where the founder stands personally, the parenting rule the studio runs by, and six checkable commitments. Judgement stays human, AI use is disclosed, and students never touch a tool.',
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
          'The published position of C4 Studios on where AI is used, where it stops, and what stays human — including the founder’s personal stance in full.',
        author: { '@type': 'Person', name: ORG_INFO.founder, url: SITE_URL },
        publisher: { '@id': `${SITE_URL}/#localbusiness` },
        dateModified: '2026-08-12',
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

      {/* The personal position, added 12 Aug 2026 when the nine-part stance
          went public on socials. First person on purpose: the rules further
          down are the studio's, this part is Caleb's. Set as a reading
          column, wider type than the rules, one inset for the allegory. */}
      <section className="pb-14 md:pb-20" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-[860px]">
            <motion.h2
              {...reveal(0)}
              className="text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold tracking-[-0.03em] leading-[1.15]"
              style={{ color: 'var(--c4-text)' }}
            >
              Where I stand.
            </motion.h2>

            <motion.div {...reveal(1)} className="mt-7 space-y-6 max-w-[64ch]">
              <p className="text-[15.5px] leading-[1.85]" style={{ color: 'var(--c4-text-muted)' }}>
                I don&rsquo;t love AI, which tends to surprise people given what this studio does all
                day. I use it most of the working week and I&rsquo;d still call it a drill rather than
                a colleague. What I won&rsquo;t do is depend on it.{' '}
                <strong style={{ color: 'var(--c4-text)', fontWeight: 640 }}>
                  The moment a tool starts doing your thinking instead of your work, it stops being a
                  tool. And you start becoming one.
                </strong>
              </p>
              <p className="text-[15.5px] leading-[1.85]" style={{ color: 'var(--c4-text-muted)' }}>
                Two things stay off the table no matter how good the models get: creativity and
                judgement. Grunt work I&rsquo;ll hand over gladly. The deciding I keep, because every
                call you outsource makes you slightly worse at the next one.
              </p>
              <p className="text-[15.5px] leading-[1.85]" style={{ color: 'var(--c4-text-muted)' }}>
                I also don&rsquo;t think people hate AI. They hate how people use it. Nobody&rsquo;s
                angry at a nurse who summarises notes and spends the spare hour with patients. They&rsquo;re
                angry at the mate whose birthday message was obviously written by his phone. The anger
                tracks the use, and honestly it should. And if surgery
                were safer with AI, we&rsquo;d take it, the way we already board planes flown mostly on
                autopilot. The harder question sits at the other end: the jobs where quicker was never
                the point. Nobody wants the optimised eulogy.
              </p>
            </motion.div>

            {/* The allegory that settled how the studio operates. Two voices,
                side by side, echoing the published carousel spread. */}
            <motion.div
              {...reveal(2)}
              className="mt-10 md:mt-12 px-7 py-8 md:px-10 md:py-10"
              style={{ backgroundColor: 'var(--c4-bg-alt)' }}
            >
              <p
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: 'var(--c4-text-muted)' }}
              >
                Two parents, one question
              </p>
              <div className="mt-6 grid gap-7 md:grid-cols-2 md:gap-10">
                <div>
                  <p className="text-[14.5px] leading-[1.8]" style={{ color: 'var(--c4-text-muted)' }}>
                    The teenager asks about drinking at a party. One parent answers fast:{' '}
                    <em style={{ color: 'var(--c4-text)' }}>not in this house.</em> Door shut, subject
                    closed. They mean it, and they mean well.
                  </p>
                </div>
                <div>
                  <p className="text-[14.5px] leading-[1.8]" style={{ color: 'var(--c4-text-muted)' }}>
                    The other goes quiet, because they remember being sixteen and they remember what a
                    flat no achieved. So they say the harder thing:{' '}
                    <em style={{ color: 'var(--c4-text)' }}>
                      I don&rsquo;t think this is a good idea. But if you&rsquo;re going to try it
                      anyway, do it here, where I can see you.
                    </em>
                  </p>
                </div>
              </div>
              <p
                className="mt-7 pt-6 border-t text-[14.5px] leading-[1.8] max-w-[62ch]"
                style={{ borderColor: 'var(--c4-border)', color: 'var(--c4-text-muted)' }}
              >
                Neither of them is wrong. They&rsquo;re two honest answers to the same change, and when
                AI turned up, every business had to pick one.{' '}
                <strong style={{ color: 'var(--c4-text)', fontWeight: 640 }}>
                  C4 is the second parent.
                </strong>{' '}
                It gets used here at the table, in the open, where we can watch what it does and catch
                it when it lies.
              </p>
            </motion.div>

            <motion.div {...reveal(3)} className="mt-10 space-y-6 max-w-[64ch]">
              <p className="text-[15.5px] leading-[1.85]" style={{ color: 'var(--c4-text-muted)' }}>
                Two things about it genuinely worry me. Kids getting to skip the struggle, when the
                struggle was the point of school. And the question of who answers for it when work done
                with AI hurts someone, because right now everyone in that chain points at the next
                link. That second one is a large part of why I&rsquo;m partway through a law degree.
              </p>
              <p className="text-[15.5px] leading-[1.85]" style={{ color: 'var(--c4-text-muted)' }}>
                I don&rsquo;t believe we end up governed by machines, for what it&rsquo;s worth. Cars
                didn&rsquo;t get banned, they got seatbelts and speed limits, and AI will walk the same
                road. I&rsquo;d rather those rules get written by people who understand the thing, so I
                stay close to it and write about what I find as I go.
              </p>
            </motion.div>

            <motion.div {...reveal(4)}>
              <Link
                to="/insights"
                className="mt-7 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-70"
                style={{ color: 'var(--c4-accent)' }}
              >
                The writing, as it lands
                <ArrowUpRight size={12} strokeWidth={2.4} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The pledge, as a ruled document rather than a grid of cards. */}
      <section className="pb-12 md:pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-[860px]">
            <motion.h2
              {...reveal(0)}
              className="text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold tracking-[-0.03em] leading-[1.15]"
              style={{ color: 'var(--c4-text)' }}
            >
              The house rules.
            </motion.h2>
            <motion.p
              {...reveal(1)}
              className="mt-4 mb-10 md:mb-12 max-w-[62ch] text-[14px] leading-[1.75]"
              style={{ color: 'var(--c4-text-muted)' }}
            >
              Being the second parent only works if the rules are on the wall. Everything below is
              something we already do. If a line here stopped being true, it would come off this page
              rather than stay up as an aspiration.
            </motion.p>
            {PLEDGES.map((p, i) => (
              <motion.article
                key={p.claim}
                {...reveal(i)}
                className="border-t py-8 md:py-10"
                style={{ borderColor: 'var(--c4-border)' }}
              >
                <h3
                  className="text-[clamp(1.15rem,2.4vw,1.55rem)] font-semibold tracking-[-0.025em] leading-[1.25]"
                  style={{ color: 'var(--c4-text)' }}
                >
                  {p.claim}
                </h3>
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
