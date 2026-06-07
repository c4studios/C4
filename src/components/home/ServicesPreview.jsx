import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

const services = [
  {
    number: 'C1',
    slug: 'web',
    title: 'Web Design & Development',
    brief: 'Custom websites, web apps, and full-stack builds — designed to convert, built to perform.',
  },
  {
    number: 'C2',
    slug: 'automation',
    title: 'AI Automation',
    brief: 'Lead pipelines, document automation, and workflow orchestration that runs while you sleep.',
  },
  {
    number: 'C3',
    slug: 'software',
    title: 'Software Products',
    brief: 'Off-the-shelf SaaS tools for Australian service businesses — from quote calculators to compliance calendars.',
  },
  {
    number: 'C4',
    slug: 'branding',
    title: 'Branding',
    brief: 'Logo design, brand systems, and visual identity built to work across web, print, and social.',
  },
  {
    number: 'C5',
    slug: 'seo',
    title: 'SEO',
    brief: 'Technical SEO, local search, and content strategy for Perth and Australian businesses.',
  },
  {
    number: 'C6',
    slug: 'lens',
    title: 'C4 Lens',
    brief: 'Commercial photography and videography for brands that want every visual handled with precision.',
  },
  {
    number: 'C7',
    slug: 'c4sight',
    title: 'C4Sight — AI Training',
    brief: 'Workplace AI literacy workshops — practical, hands-on, and built for your team\'s actual tools.',
  },
];

export default function ServicesPreview() {
  const [activeIndex, setActiveIndex] = useState(null);
  const servicesBase = createPageUrl('Services');

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease }}
          className="flex justify-between items-baseline mb-12 md:mb-16"
        >
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>Services</h2>
            <p className="mt-1 text-[12px] font-medium tracking-[-0.01em]" style={{ color: 'var(--c4-text-faint)' }}>Seven disciplines. One studio.</p>
          </div>
          <Link
            to={servicesBase}
            className="text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-300"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            All Services →
          </Link>
        </motion.div>

        <div role="list">
          {services.map((s, i) => (
            <motion.div
              key={s.number}
              role="listitem"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.55, delay: i * 0.05, ease }}
            >
              <Link
                to={`${servicesBase}#${s.slug}`}
                className="group relative block border-t"
                style={{ borderColor: 'var(--c4-border)' }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Hover background */}
                <motion.div
                  className="absolute -inset-x-3 md:-inset-x-6 inset-y-0 rounded-sm pointer-events-none"
                  style={{ backgroundColor: 'var(--c4-bg-alt)' }}
                  initial={false}
                  animate={{ opacity: activeIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative grid grid-cols-12 items-baseline gap-x-4 md:gap-x-6 py-6 md:py-8">
                  {/* Number */}
                  <motion.span
                    className="col-span-2 md:col-span-1 text-[11px] tabular-nums font-medium"
                    animate={{ color: activeIndex === i ? 'var(--c4-accent)' : 'var(--c4-text-faint)' }}
                    transition={{ duration: 0.25 }}
                  >
                    {s.number}
                  </motion.span>

                  {/* Title */}
                  <motion.h3
                    className="col-span-10 md:col-span-3 text-[1.05rem] md:text-[1.15rem] font-semibold tracking-[-0.01em]"
                    style={{ color: 'var(--c4-text)' }}
                    animate={{ x: activeIndex === i ? 3 : 0 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    {s.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="col-span-10 col-start-3 md:col-span-6 md:col-start-5 mt-1.5 md:mt-0 text-[13.5px] leading-[1.6]"
                    style={{ color: 'var(--c4-text-muted)' }}
                  >
                    {s.brief}
                  </motion.p>

                  {/* Arrow */}
                  <div className="hidden md:flex col-span-2 justify-end">
                    <motion.div
                      animate={{
                        x: activeIndex === i ? 4 : 0,
                        opacity: activeIndex === i ? 1 : 0.2,
                      }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <ArrowRight size={14} strokeWidth={1.5} style={{ color: 'var(--c4-text)' }} />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          {/* Closing rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="h-px origin-left"
            style={{ backgroundColor: 'var(--c4-border)' }}
          />
        </div>
      </div>
    </section>
  );
}
