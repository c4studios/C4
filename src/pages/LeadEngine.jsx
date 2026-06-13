import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MoonStar, Inbox, Check, ShieldCheck } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PageHero from '@/components/c4/PageHero';
import SectionLabel from '@/components/c4/SectionLabel';
import SeoBreadcrumbs from '@/components/seo/SeoBreadcrumbs';
import SeoFaq from '@/components/seo/SeoFaq';
import useDocumentHead from '@/hooks/useDocumentHead';
import { localBusinessSchema, serviceSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';

const ease = [0.22, 1, 0.36, 1];

/* ── Page content ──────────────────────────────────────────────────── */

const STEPS = [
  {
    icon: MoonStar,
    title: 'Overnight research',
    text: 'The engine finds and qualifies prospects matching your criteria, checking every one against your full contact history so nobody hears from you twice.',
  },
  {
    icon: Inbox,
    title: 'Drafted by 9am',
    text: 'A personalised email for each lead lands in your drafts folder, written in your voice, ready to go — before your first coffee.',
  },
  {
    icon: Check,
    title: 'You approve',
    text: 'Read, tweak, send. Nothing leaves your inbox without you. That approval step is the whole product, not a limitation.',
  },
];

const GETS = [
  'Your own private system — your data lives in an account you own, not ours.',
  'Runs inside your existing Outlook or Gmail, so replies land where you already work.',
  'Email templates written for your voice and your market, not a generic blast.',
  'Built-in opt-out handling and contact suppression, so you never email the wrong person twice.',
  'A monthly report on leads found, emails drafted, and replies that came back.',
];

const TRUST = [
  'Every email identifies you and your business.',
  'Every email includes a working opt-out, honoured automatically via your suppression list.',
  'Targeting uses conspicuously published business contact details relevant to the recipient’s role.',
  'A human — you — approves every single send before it leaves your inbox.',
];

const TIERS = [
  {
    name: 'Setup',
    price: '$1,950',
    cadence: 'one-off',
    popular: true,
    points: [
      'Discovery call — your ideal client, verticals and voice',
      'Engine deployed into an account you own',
      'Your Outlook or Gmail connected securely',
      'Three email templates written in your voice',
      'Suppression list seeded from your contacts',
      'A two-week tuning period to dial it in',
    ],
  },
  {
    name: 'Essential care',
    price: '$250',
    cadence: 'per month',
    popular: false,
    points: [
      'Keep-alive monitoring and error fixes',
      'Minor template tweaks as you go',
      'A monthly performance summary',
      'No lock-in — cancel any time',
    ],
  },
  {
    name: 'Growth care',
    price: '$400',
    cadence: 'per month',
    popular: false,
    points: [
      'Everything in Essential care',
      'A new vertical or territory each quarter',
      'Template A/B revisions',
      'A monthly 30-minute strategy call',
    ],
  },
];

const FAQS = [
  {
    q: 'Does it send emails automatically?',
    a: 'No — and that’s the point. The engine drafts every email into your own outbox and stops there. You read each one, tweak it if you like, and hit send yourself. Nothing ever leaves your inbox without your approval, which is exactly what keeps your name and your sending reputation safe.',
  },
  {
    q: 'Whose inbox and data does it use?',
    a: 'Yours, on both counts. The drafts appear in your own Outlook or Gmail, so replies land where you already work and you’re never the impersonal “noreply@”. The system itself runs in an account you own — your prospect data lives with you, not on our servers.',
  },
  {
    q: 'Is this compliant with spam laws?',
    a: 'It’s built with the Australian Spam Act in mind: every email identifies you, carries a working opt-out that’s honoured automatically, and targets published business contact details relevant to the recipient’s role — and a human approves every send. Those are deliberate design features. (Caleb’s a law student, so this part isn’t an afterthought.)',
  },
  {
    q: 'Who is it for?',
    a: 'Businesses that live on outbound. Recruitment agencies get the most out of it — outbound is their oxygen and the placement maths is obvious — followed by commercial services, B2B trades and agencies. If new business depends on you reaching out first, this is built for you.',
  },
  {
    q: 'What does it cost, really?',
    a: 'A flat $1,950 to set up, then from $250 a month, with no lock-in contract. For comparison, a junior business development rep costs around $5,000 a month before super — this costs $250 and never calls in sick.',
  },
  {
    q: 'How long does setup take?',
    a: 'About a week from the discovery call to your first morning of drafts, then a two-week tuning period where we refine the targeting and the templates against the real emails it produces. After that it just runs every weekday.',
  },
];

/* ── Building blocks ───────────────────────────────────────────────── */

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function LeadEngine() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'C4 Lead Engine', path: '/lead-engine' },
  ];

  useDocumentHead({
    title: 'C4 Lead Engine — Your 9am Pipeline | C4 Studios',
    description:
      'Qualified leads found overnight, personalised emails drafted into your own inbox by 9am — you just hit send. Done-for-you AI outbound from $1,950 setup, $250/mo.',
    path: '/lead-engine',
    jsonLd: [
      localBusinessSchema(),
      breadcrumbSchema(crumbs),
      serviceSchema({
        name: 'C4 Lead Engine',
        description:
          'Done-for-you AI outbound. The engine researches and qualifies prospects overnight and drafts a personalised email to each into the client’s own inbox by 9am; the client approves every send.',
        url: '/lead-engine',
        serviceType: 'AI outbound lead generation',
        areaServed: ['Perth', 'Western Australia', 'Australia'],
        offers: [
          { name: 'Setup', price: '1950', url: '/lead-engine' },
          { name: 'Essential care', price: '250', url: '/lead-engine' },
          { name: 'Growth care', price: '400', url: '/lead-engine' },
        ],
      }),
      faqSchema(FAQS),
    ],
  });

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <PageHero
        pretitle={<SeoBreadcrumbs crumbs={crumbs} />}
        label="C4 Lead Engine"
        titleLines={[
          <span key="1">Qualified leads found overnight.</span>,
          <span key="2">Drafted by 9am.</span>,
          <span key="3">You just hit send.</span>,
        ]}
        description="Every weekday morning, the Lead Engine researches businesses that match your ideal client, filters out everyone you’ve already contacted, and drafts a personalised email to each new lead — straight into your own outbox. Nothing sends without you."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={createPageUrl('StartProject')}
            className="group inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
            style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            Book a 15-minute demo
            <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>
          <a
            href="#pricing"
            className="inline-flex items-center px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-medium border transition-colors duration-300 hover:brightness-125"
            style={{ borderColor: 'var(--c4-border)', color: 'var(--c4-text-muted)' }}
          >
            See pricing
          </a>
        </div>
      </PageHero>

      {/* How it works */}
      <section className="py-10 md:py-14">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-9">
              <div className="mb-3"><SectionLabel text="How it works" /></div>
              <h2 className="text-[1.45rem] md:text-[1.85rem] font-semibold tracking-[-0.025em] leading-[1.15] max-w-[720px]" style={{ color: 'var(--c4-text)' }}>
                Three steps, and only one of them is yours.
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="h-full p-6 md:p-7 border" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
                    <div className="flex items-center justify-between mb-5">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full" style={{ backgroundColor: 'var(--c4-tag-bg)' }}>
                        <Icon size={16} strokeWidth={1.8} style={{ color: 'var(--c4-accent)' }} />
                      </span>
                      <span className="text-[12px] font-medium tabular-nums" style={{ color: 'var(--c4-text-subtle)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-semibold mb-2" style={{ color: 'var(--c4-text)' }}>{step.title}</h3>
                    <p className="text-[13.5px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>{step.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-10 md:py-14">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-8">
              <div className="mb-3"><SectionLabel text="What you get" /></div>
              <h2 className="text-[1.45rem] md:text-[1.85rem] font-semibold tracking-[-0.025em] leading-[1.15] max-w-[720px]" style={{ color: 'var(--c4-text)' }}>
                A pipeline that fills itself, inside the tools you already use.
              </h2>
            </div>
          </Reveal>
          <div className="max-w-[760px] border-t" style={{ borderColor: 'var(--c4-border)' }}>
            {GETS.map((line, i) => (
              <Reveal key={i}>
                <div className="flex gap-4 py-4 border-b" style={{ borderColor: 'var(--c4-border)' }}>
                  <Check size={17} strokeWidth={2.2} className="shrink-0 mt-0.5" style={{ color: 'var(--c4-accent)' }} />
                  <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>{line}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Built for trust */}
      <section className="py-10 md:py-14">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="max-w-[860px] p-7 md:p-10 border" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck size={20} strokeWidth={1.8} style={{ color: 'var(--c4-accent)' }} />
                <SectionLabel text="Built for trust" />
              </div>
              <h2 className="text-[1.3rem] md:text-[1.6rem] font-semibold tracking-[-0.02em] leading-[1.2] mb-6 max-w-[620px]" style={{ color: 'var(--c4-text)' }}>
                The approval step isn’t a feature. It’s the whole idea.
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {TRUST.map((line, i) => (
                  <div key={i} className="flex gap-3">
                    <Check size={16} strokeWidth={2.2} className="shrink-0 mt-0.5" style={{ color: 'var(--c4-accent)' }} />
                    <p className="text-[13.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>{line}</p>
                  </div>
                ))}
              </div>
              <p className="mt-7 pt-6 text-[13px] leading-[1.6] border-t" style={{ borderColor: 'var(--c4-border)', color: 'var(--c4-text-subtle)' }}>
                Built with the Australian Spam Act in mind — identification and opt-out designed in, not bolted on.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-10 md:py-14 scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-9">
              <div className="mb-3"><SectionLabel text="Pricing" /></div>
              <h2 className="text-[1.45rem] md:text-[1.85rem] font-semibold tracking-[-0.025em] leading-[1.15] max-w-[720px]" style={{ color: 'var(--c4-text)' }}>
                One setup fee, then a care plan. No lock-in.
              </h2>
              <p className="mt-4 text-[14px] leading-[1.7] max-w-[600px]" style={{ color: 'var(--c4-text-muted)' }}>
                A junior BDM costs around $5,000 a month before super. This costs $250 and never calls in sick.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {TIERS.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.08}>
                <div
                  className="h-full p-6 md:p-7 border flex flex-col"
                  style={{
                    borderColor: tier.popular ? 'var(--c4-accent)' : 'var(--c4-border)',
                    backgroundColor: 'var(--c4-card-bg)',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] uppercase tracking-[0.18em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>{tier.name}</span>
                    {tier.popular && (
                      <span className="text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-1" style={{ backgroundColor: 'color-mix(in srgb, var(--c4-accent) 16%, transparent)', color: 'var(--c4-accent)' }}>
                        Start here
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-5">
                    <span className="text-[2rem] font-semibold tracking-[-0.03em] leading-none" style={{ color: 'var(--c4-text)' }}>{tier.price}</span>
                    <span className="text-[12px]" style={{ color: 'var(--c4-text-subtle)' }}>{tier.cadence}</span>
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {tier.points.map((p, j) => (
                      <li key={j} className="flex gap-2.5">
                        <Check size={14} strokeWidth={2.2} className="shrink-0 mt-1" style={{ color: 'var(--c4-accent)' }} />
                        <span className="text-[12.5px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-5 text-[12.5px]" style={{ color: 'var(--c4-text-subtle)' }}>
              $1,950 setup · from $250/month · no lock-in contracts. All prices in AUD, ex GST.
            </p>
          </Reveal>
        </div>
      </section>

      <SeoFaq faqs={FAQS} heading="Questions, answered straight" />

      {/* Closing CTA */}
      <section className="pt-10 pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="h-px mb-12" style={{ backgroundColor: 'var(--c4-border)' }} />
          <Reveal>
            <div className="max-w-[560px]">
              <h2 className="text-[1.6rem] md:text-[2rem] font-semibold tracking-[-0.025em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
                Want to see this morning’s drafts?
              </h2>
              <p className="mt-4 text-[14px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
                Book a 15-minute demo and I’ll show you the actual emails the engine drafted me today — then we’ll talk about what it would draft for you.
              </p>
              <Link
                to={createPageUrl('StartProject')}
                className="group inline-flex items-center gap-2 mt-7 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
                style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
              >
                Book a 15-minute demo
                <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
              </Link>
              <p className="mt-8 text-[12px] leading-[1.6]" style={{ color: 'var(--c4-text-subtle)' }}>
                C4 Lead Engine is built and run by C4 Studios, a web design and automation studio in Perth, Western Australia — and yes, we use it on ourselves every weekday morning.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
