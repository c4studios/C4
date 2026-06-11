import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';

const ease = [0.22, 1, 0.36, 1];

const WHAT_WE_COVER = [
  {
    title: 'AI Literacy Workshop',
    body: 'A half or full-day session covering what AI is, what it isn\'t, how to prompt effectively, and where it fits in your team\'s workflow. Practical exercises throughout — no slides full of buzzwords.',
  },
  {
    title: 'Tools Training',
    body: 'Hands-on training with ChatGPT, Claude, and industry-specific AI tools. Your team leaves knowing how to use these tools in their actual jobs — not in a hypothetical scenario.',
  },
  {
    title: 'Automation Readiness',
    body: 'We map your team\'s repetitive tasks and identify what can be automated, what should be automated, and what shouldn\'t be touched. Output: a clear, prioritised action plan.',
  },
  {
    title: 'Executive AI Briefing',
    body: 'A focused 90-minute session for leadership teams covering AI\'s strategic implications, risks, and opportunities for your specific industry. Designed for decision-makers, not developers.',
  },
];

const WHO_ITS_FOR = [
  'Professional services',
  'Law firms',
  'Accounting practices',
  'Healthcare teams',
  'Trades businesses',
  'Government teams',
  'Marketing and comms',
  'Any team asking "should we be using AI?"',
];

const PRICING = [
  {
    label: 'Half-day workshop',
    price: 'From $800',
    note: '3–4 hours on-site',
  },
  {
    label: 'Full-day workshop',
    price: 'From $1,400',
    note: '6–7 hours on-site',
  },
  {
    label: 'Custom package',
    price: 'Contact for quote',
    note: 'Ongoing support & multi-session programs',
  },
];

export default function Foresight() {
  useDocumentHead({
    title: 'C4Sight — Workplace AI Training & Workshops, Perth',
    description:
      'C4Sight teaches teams how to use AI practically — AI literacy workshops, hands-on tools training, automation readiness mapping and executive briefings. On-site in Perth, remote on request.',
    path: '/Foresight',
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c4-bg)' }}>
      {/* HERO — dark inverted */}
      <section
        className="pt-28 pb-20 md:pt-36 md:pb-24"
        style={{ backgroundColor: 'var(--c4-text)' }}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-medium"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              C4Sight
            </span>
            <h1
              className="mt-4 text-[2.4rem] font-semibold tracking-[-0.04em] leading-[1.05] md:text-[3.5rem]"
              style={{ color: 'var(--c4-bg)' }}
            >
              AI for people,<br className="hidden md:block" /> not just products.
            </h1>
            <p
              className="mt-6 max-w-[540px] text-[14px] leading-[1.75] md:text-[15px]"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              C4Sight goes into workplaces and teaches teams how to use AI practically — in their actual roles, with their actual tools. No theory. No slides full of buzzwords. Real capability, built fast.
            </p>
            <div className="mt-8">
              <Link
                to={createPageUrl('Contact')}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-semibold transition-all duration-300 hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--c4-bg)' }}
              >
                Book a workplace session
                <ArrowRight size={13} strokeWidth={2} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE COVER */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--c4-bg)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease }}
            className="mb-12 md:mb-16"
          >
            <span className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
              What we cover
            </span>
            <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] leading-[1.1] md:text-[2rem]" style={{ color: 'var(--c4-text)' }}>
              Practical sessions, real outcomes.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {WHAT_WE_COVER.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: i * 0.07, ease }}
                className="rounded-[3px] p-6 md:p-7"
                style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
              >
                <h3 className="mb-3 text-[15px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                  {item.title}
                </h3>
                <p className="text-[13px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
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
          >
            <span className="block text-[10px] uppercase tracking-[0.22em] font-medium mb-7" style={{ color: 'var(--c4-text-subtle)' }}>
              Who it's for
            </span>
            <div className="flex flex-wrap gap-3">
              {WHO_ITS_FOR.map((item) => (
                <span
                  key={item}
                  className="rounded-full px-4 py-2 text-[12.5px] font-medium"
                  style={{ border: '1px solid var(--c4-border)', color: 'var(--c4-text-subtle)', backgroundColor: 'var(--c4-bg)' }}
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--c4-text)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease }}
            className="mb-12"
          >
            <span className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Pricing
            </span>
            <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] md:text-[2rem]" style={{ color: 'var(--c4-bg)' }}>
              Transparent from day one.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {PRICING.map((tier, i) => (
              <motion.div
                key={tier.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.07, ease }}
                className="rounded-[3px] p-6 md:p-7"
                style={{ border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)' }}
              >
                <span className="block text-[9.5px] uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {tier.label}
                </span>
                <p className="text-[1.6rem] font-bold tracking-[-0.03em] leading-none mb-2" style={{ color: 'var(--c4-bg)' }}>
                  {tier.price}
                </p>
                <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {tier.note}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="mt-7 text-[12.5px]"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            All sessions delivered in Perth, WA. Remote delivery available on request.
          </motion.p>
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
                Ready to bring AI into your workplace?
              </h2>
              <p className="mt-2 text-[13.5px]" style={{ color: 'var(--c4-text-muted)' }}>
                Tell us about your team and we'll put together the right session.
              </p>
            </div>
            <Link
              to={createPageUrl('Contact')}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-[11px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              Get in touch
              <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
