import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ShieldCheck, Scale, Download } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PageHero from '@/components/c4/PageHero';
import useDocumentHead from '@/hooks/useDocumentHead';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';

const ease = [0.22, 1, 0.36, 1];
const eyebrowClass = 'text-[10px] uppercase tracking-[0.22em] font-medium';

/*
 * Shared renderer for the three C4Sight sector pages (office, schools, law).
 * Each page passes a `data` object; the per-sector copy lives in the page
 * file so it stays bespoke, while layout, schema and CTAs stay consistent
 * with the C4Sight hub.
 */
export default function SectorPage({ data }) {
  const enquiryUrl = createPageUrl('TrainingEnquiry') + (data.sectorKey ? `?sector=${data.sectorKey}` : '');
  const hubUrl = createPageUrl('Foresight');

  useDocumentHead({
    title: data.meta.title,
    description: data.meta.description,
    path: data.path,
    jsonLd: [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'C4Sight', path: '/Foresight' },
        { name: data.sector, path: data.path },
      ]),
      serviceSchema({
        name: data.meta.title,
        description: data.meta.description,
        url: data.path,
        serviceType: data.serviceType,
      }),
    ],
  });

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <PageHero
        label={`C4Sight · ${data.sector}`}
        titleLines={data.heroLines}
        description={data.heroIntro}
      >
        <div className="flex flex-wrap items-center gap-5">
          <Link
            to={enquiryUrl}
            className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
            style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            Request a workshop
            <ArrowRight size={12} strokeWidth={2} />
          </Link>
          <Link
            to={hubUrl}
            className="text-[11px] uppercase tracking-[0.14em] font-medium"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            C4Sight overview
          </Link>
        </div>
      </PageHero>

      {/* EXAMPLE TASKS */}
      <section className="py-16 md:py-24 border-t" style={{ borderColor: 'var(--c4-border)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease }}
            className="mb-10 md:mb-12"
          >
            <span className={eyebrowClass} style={{ color: 'var(--c4-text-subtle)' }}>
              On real work
            </span>
            <h2 className="mt-3 text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.025em]">
              {data.tasks.heading}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.tasks.items.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.05, ease }}
                className="flex items-start gap-3 rounded-[3px] p-5"
                style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
              >
                <Check size={15} strokeWidth={2.25} className="mt-0.5 shrink-0" style={{ color: 'var(--c4-accent)' }} />
                <p className="text-[13.5px] leading-[1.6]" style={{ color: 'var(--c4-text)' }}>{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RISK EMPHASIS — the sector differentiator */}
      <section className="py-16 md:py-24 border-t" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
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
                  Safety first
                </span>
              </div>
              <h2 className="mt-4 text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.025em] leading-[1.1]">
                {data.risk.heading}
              </h2>
              <p className="mt-5 max-w-[440px] text-[13.5px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                {data.risk.intro}
              </p>
            </motion.div>

            <div className="flex flex-col gap-4">
              {data.risk.points.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease }}
                  className="flex items-start gap-4 rounded-[3px] p-5 md:p-6"
                  style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}
                >
                  <Check size={15} strokeWidth={2.25} className="mt-0.5 shrink-0" style={{ color: 'var(--c4-accent)' }} />
                  <p className="text-[13.5px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CREDIBILITY (law) */}
      {data.credibility && (
        <section className="py-16 md:py-20 border-t" style={{ borderColor: 'var(--c4-border)' }}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease }}
              className="max-w-[760px] rounded-[3px] p-7 md:p-9"
              style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Scale size={18} strokeWidth={1.75} style={{ color: 'var(--c4-accent)' }} />
                <span className={eyebrowClass} style={{ color: 'var(--c4-text-subtle)' }}>
                  {data.credibility.heading}
                </span>
              </div>
              <p className="text-[14px] leading-[1.75]" style={{ color: 'var(--c4-text)' }}>
                {data.credibility.body}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* THE WIN + FORMATS LINK */}
      <section className="py-16 md:py-20 border-t" style={{ borderColor: 'var(--c4-border)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease }}
            className="max-w-[680px]"
          >
            <span className={eyebrowClass} style={{ color: 'var(--c4-text-subtle)' }}>
              What good looks like
            </span>
            <p className="mt-4 text-[clamp(1.15rem,2.4vw,1.5rem)] font-medium tracking-[-0.02em] leading-[1.4]" style={{ color: 'var(--c4-text)' }}>
              {data.win}
            </p>
            <p className="mt-6 text-[13.5px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
              {data.governanceNote} See the{' '}
              <Link to={hubUrl} className="underline underline-offset-2" style={{ color: 'var(--c4-text)' }}>
                C4Sight overview
              </Link>{' '}
              for the half-day and full-day formats, what your team keeps, and indicative pricing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FREE PREVIEW DOWNLOADS — rendered only when a page supplies them
          (schools). Additive: sectors without `data.downloads` are unchanged.
          Ungated static PDFs from public/downloads. */}
      {data.downloads && (
        <section className="py-16 md:py-24 border-t" style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-bg-alt)' }}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease }}
              className="max-w-[680px] mb-10 md:mb-12"
            >
              <div className="flex items-center gap-3">
                <Download size={18} strokeWidth={1.75} style={{ color: 'var(--c4-accent)' }} />
                <span className={eyebrowClass} style={{ color: 'var(--c4-text-subtle)' }}>
                  Free for teachers
                </span>
              </div>
              <h2 className="mt-4 text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.025em] leading-[1.1]">
                {data.downloads.heading}
              </h2>
              <p className="mt-5 text-[13.5px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                {data.downloads.intro}
              </p>
            </motion.div>

            <ul role="list" className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {data.downloads.items.map((d, i) => (
                <motion.li
                  key={d.file}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease }}
                >
                  <a
                    href={d.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full items-start gap-4 rounded-[3px] p-5 md:p-6 transition-colors duration-200"
                    style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-bg)' }}
                  >
                    <div className="min-w-0 flex-1">
                      <span
                        className="inline-block text-[10px] uppercase tracking-[0.18em] font-semibold"
                        style={{ color: 'var(--c4-accent)' }}
                      >
                        {d.band}
                      </span>
                      <h3 className="mt-2 text-[15px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                        {d.name}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
                        {d.line}
                      </p>
                    </div>
                    <span
                      className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-colors duration-200"
                      style={{ color: 'var(--c4-text-subtle)' }}
                    >
                      <Download size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-y-0.5" style={{ color: 'var(--c4-accent)' }} />
                      PDF
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>

            {data.downloads.note && (
              <p className="mt-8 max-w-[720px] text-[12px] leading-[1.7]" style={{ color: 'var(--c4-text-faint)' }}>
                {data.downloads.note}
              </p>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-28 border-t" style={{ borderColor: 'var(--c4-border)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <h2 className="text-[clamp(1.4rem,3.4vw,2rem)] font-semibold tracking-[-0.03em] max-w-[560px]">
              {data.ctaHeading}
            </h2>
            <Link
              to={enquiryUrl}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-[11px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              Request a workshop
              <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </motion.div>

          {data.disclaimer && (
            <p className="mt-10 max-w-[760px] text-[11.5px] leading-[1.6]" style={{ color: 'var(--c4-text-faint)' }}>
              {data.disclaimer}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
