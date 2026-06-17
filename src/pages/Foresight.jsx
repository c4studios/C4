import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import { c4SightPackages, C4SIGHT_PRICING_NOTE } from '@/data/pricing';

const ease = [0.22, 1, 0.36, 1];

const FORMATS = [
  {
    label: 'Half day',
    duration: 'About 3.5 hours',
    popular: false,
    body: 'Foundations, hands-on work, prompting that produces useful output, and the data-safety module. One sector focus per session. The team leaves having done real work, with a prompt pack they keep.',
  },
  {
    label: 'Full day',
    duration: 'About 6 hours',
    popular: true,
    body: 'The half-day morning, plus an afternoon where attendees bring their own recurring tasks and build repeatable workflows they keep. The deeper option, and it closes with a short automation-readiness map.',
  },
];

const OUTCOMES = [
  'What these tools really are, and where they confidently get things wrong.',
  'Hands-on with your own real work inside the first hour.',
  'Prompting that actually produces useful output.',
  'What is and is not safe to put into AI tools.',
  'How to embed it so the team still uses it next month.',
];

const GOVERNANCE_POINTS = [
  'What stays out: confidential, personal, and privileged information never goes into these tools.',
  'The verification habit: no fact, number, name, or citation is trusted without checking it against a real source.',
  'Your policy wins: if your workplace restricts or bans a tool, that overrides anything taught in the room.',
];

const KEEP_ITEMS = [
  'A prompt pack relevant to your sector.',
  'The data-safety one-pager.',
  'For the full day, workflows documented in your own words.',
  'One clear next step, not a vague go use AI more.',
];

const SECTORS = [
  {
    page: 'ForesightBusiness',
    title: 'Office and business',
    body: 'Practical productivity. Emails, documents, summaries, spreadsheets, and the repetitive parts of the week, done faster. With company and client information kept safe.',
  },
  {
    page: 'ForesightSchools',
    title: 'Schools and teachers',
    body: 'Lesson planning, differentiated materials, feedback, and time back on the weekend. Careful and ethics-forward, with student privacy and academic integrity front and centre.',
  },
  {
    page: 'ForesightLaw',
    title: 'Law firms',
    body: 'Faster drafting, summarising, and research starting points, with verification built in. Led by someone who understands the conduct obligations and the risk of AI inventing citations.',
  },
];

const eyebrowClass = 'text-[10px] uppercase tracking-[0.22em] font-medium';

export default function Foresight() {
  const enquiryUrl = createPageUrl('TrainingEnquiry');

  useDocumentHead({
    title: 'C4Sight: workplace AI training for Perth teams',
    description:
      'In-person AI training for Perth workplaces. Your team learns to use AI on real work, safely, in half a day. Office, schools and law firm formats.',
    path: '/Foresight',
    jsonLd: [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'C4Sight', path: '/Foresight' },
      ]),
      serviceSchema({
        name: 'C4Sight workplace AI training',
        description:
          'In-person AI literacy workshops for Australian workplaces. Half-day and full-day formats with a data-safety module in every session.',
        url: '/Foresight',
        serviceType: 'AI literacy training',
        offers: c4SightPackages
          .filter((p) => p.price > 0)
          .map((p) => ({ name: p.name, price: p.price, url: '/Foresight' })),
      }),
    ],
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      {/* HERO — dark inverted */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-24" style={{ backgroundColor: 'var(--c4-text)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className={eyebrowClass} style={{ color: 'rgba(255,255,255,0.45)' }}>
              C4Sight
            </span>
            <h1
              className="mt-4 text-[2.4rem] font-semibold tracking-[-0.04em] leading-[1.05] md:text-[3.5rem]"
              style={{ color: 'var(--c4-bg)' }}
            >
              AI training that goes<br className="hidden md:block" /> into your workplace.
            </h1>
            <p
              className="mt-6 max-w-[560px] text-[14px] leading-[1.75] md:text-[15px]"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Your team learns to use AI tools on their actual work, safely, in about half a day. On-site across Perth, remote on request.
            </p>
            <div className="mt-8">
              <Link
                to={enquiryUrl}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-semibold transition-all duration-300 hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--c4-bg)' }}
              >
                Request a workshop
                <ArrowRight size={13} strokeWidth={2} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FORMATS */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease }}
            className="mb-12 md:mb-16"
          >
            <span className={eyebrowClass} style={{ color: 'var(--c4-text-subtle)' }}>
              Formats
            </span>
            <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] leading-[1.1] md:text-[2rem]" style={{ color: 'var(--c4-text)' }}>
              Two ways to run it.
            </h2>
            <p className="mt-4 max-w-[560px] text-[13.5px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
              Both formats are hands-on from the first hour and built around the real work your team already does.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {FORMATS.map((fmt, i) => (
              <motion.div
                key={fmt.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: i * 0.08, ease }}
                className="relative rounded-[3px] p-7 md:p-8"
                style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
              >
                {fmt.popular && (
                  <span
                    className="absolute -top-2.5 left-7 px-2.5 py-0.5 text-[8px] uppercase tracking-[0.2em] font-semibold rounded-sm"
                    style={{ backgroundColor: 'var(--c4-accent)', color: '#fff' }}
                  >
                    Most value
                  </span>
                )}
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>
                    {fmt.label}
                  </h3>
                  <span className="text-[11px] uppercase tracking-[0.12em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
                    {fmt.duration}
                  </span>
                </div>
                <p className="mt-4 text-[13.5px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
                  {fmt.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section
        className="py-20 md:py-28"
        style={{ borderTop: '1px solid var(--c4-border-light)', backgroundColor: 'var(--c4-bg-alt)' }}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease }}
            className="mb-12 md:mb-14"
          >
            <span className={eyebrowClass} style={{ color: 'var(--c4-text-subtle)' }}>
              What you will learn
            </span>
            <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] leading-[1.1] md:text-[2rem]" style={{ color: 'var(--c4-text)' }}>
              Five things your team walks out with.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[3px] border md:grid-cols-1" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-border)' }}>
            {OUTCOMES.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.05, ease }}
                className="flex items-start gap-5 px-6 py-5 md:px-8"
                style={{ backgroundColor: 'var(--c4-bg)' }}
              >
                <span className="mt-0.5 text-[12px] tabular-nums font-semibold w-6 shrink-0" style={{ color: 'var(--c4-accent)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--c4-text)' }}>
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GOVERNANCE — featured as a strength */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} strokeWidth={1.75} style={{ color: 'var(--c4-accent)' }} />
                <span className={eyebrowClass} style={{ color: 'var(--c4-text-subtle)' }}>
                  Built in, not bolted on
                </span>
              </div>
              <h2 className="mt-4 text-[1.6rem] font-semibold tracking-[-0.03em] leading-[1.1] md:text-[2rem]" style={{ color: 'var(--c4-text)' }}>
                Every session includes a data-safety module.
              </h2>
              <p className="mt-5 max-w-[440px] text-[13.5px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                Safe and responsible use is part of the curriculum, not the fine print. We treat it as the standard C4Sight stands behind.
              </p>
            </motion.div>

            <div className="flex flex-col gap-4">
              {GOVERNANCE_POINTS.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease }}
                  className="flex items-start gap-4 rounded-[3px] p-5 md:p-6"
                  style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
                >
                  <Check size={15} strokeWidth={2.25} className="mt-0.5 shrink-0" style={{ color: 'var(--c4-accent)' }} />
                  <p className="text-[13.5px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
                    {point}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU KEEP */}
      <section
        className="py-16 md:py-20"
        style={{ borderTop: '1px solid var(--c4-border-light)', borderBottom: '1px solid var(--c4-border-light)', backgroundColor: 'var(--c4-bg-alt)' }}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease }}
            className="mb-10"
          >
            <span className={eyebrowClass} style={{ color: 'var(--c4-text-subtle)' }}>
              What you keep
            </span>
            <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] leading-[1.1] md:text-[2rem]" style={{ color: 'var(--c4-text)' }}>
              Nobody leaves with just notes.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {KEEP_ITEMS.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.06, ease }}
                className="flex items-start gap-3"
              >
                <Check size={15} strokeWidth={2.25} className="mt-0.5 shrink-0" style={{ color: 'var(--c4-accent)' }} />
                <p className="text-[13.5px] leading-[1.6]" style={{ color: 'var(--c4-text)' }}>
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease }}
            className="mb-12 md:mb-16"
          >
            <span className={eyebrowClass} style={{ color: 'var(--c4-text-subtle)' }}>
              Who it is for
            </span>
            <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] leading-[1.1] md:text-[2rem]" style={{ color: 'var(--c4-text)' }}>
              Framed for your sector.
            </h2>
            <p className="mt-4 max-w-[560px] text-[13.5px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
              The core is constant. The examples, the risks, and the wins change to fit the room.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {SECTORS.map((sector, i) => (
              <motion.div
                key={sector.page}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: i * 0.07, ease }}
              >
                <Link
                  to={createPageUrl(sector.page)}
                  className="group flex h-full flex-col rounded-[3px] p-6 md:p-7 transition-colors duration-300"
                  style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
                >
                  <h3 className="mb-3 text-[15px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                    {sector.title}
                  </h3>
                  <p className="flex-1 text-[13px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
                    {sector.body}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.14em] font-semibold"
                    style={{ color: 'var(--c4-text)' }}
                  >
                    View {sector.title.toLowerCase()} training
                    <ArrowRight size={12} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — indicative */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--c4-text)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease }}
            className="mb-12"
          >
            <span className={eyebrowClass} style={{ color: 'rgba(255,255,255,0.4)' }}>
              Pricing
            </span>
            <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] md:text-[2rem]" style={{ color: 'var(--c4-bg)' }}>
              Indicative pricing.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {c4SightPackages.map((pkg, i) => (
              <motion.div
                key={pkg.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.07, ease }}
                className="relative flex flex-col rounded-[3px] p-6 md:p-7"
                style={{ border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)' }}
              >
                {pkg.popular && (
                  <span
                    className="absolute -top-2.5 left-6 px-2.5 py-0.5 text-[8px] uppercase tracking-[0.2em] font-semibold rounded-sm"
                    style={{ backgroundColor: 'var(--c4-accent)', color: '#fff' }}
                  >
                    Most value
                  </span>
                )}
                <span className="block text-[9.5px] uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {pkg.name}
                </span>
                <p className="text-[1.6rem] font-bold tracking-[-0.03em] leading-none mb-3" style={{ color: 'var(--c4-bg)' }}>
                  {pkg.priceLabel}
                </p>
                <p className="text-[12.5px] leading-[1.6] mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {pkg.description}
                </p>
                <ul className="space-y-2">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={13} strokeWidth={2} className="mt-[3px] shrink-0" style={{ color: 'var(--c4-accent)' }} />
                      <span className="text-[12px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="mt-7 max-w-[640px] text-[12px] leading-[1.6]"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {C4SIGHT_PRICING_NOTE}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="mt-8"
          >
            <Link
              to={enquiryUrl}
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-semibold transition-all duration-300 hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--c4-bg)' }}
            >
              Request a quote
              <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-20 md:py-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="text-[1.4rem] font-semibold tracking-[-0.03em] md:text-[1.8rem]" style={{ color: 'var(--c4-text)' }}>
                Bring AI into your workplace, safely.
              </h2>
              <p className="mt-2 text-[13.5px]" style={{ color: 'var(--c4-text-muted)' }}>
                Tell us about your team and we will put together the right session.
              </p>
            </div>
            <Link
              to={enquiryUrl}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-[11px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              Request a workshop
              <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
