import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const experiences = [
  { label: "Children's Ministry", detail: "Regular leader at Barnabas Christian Fellowship — planning lessons, leading groups, parent communication, and duty of care." },
  { label: 'Camp Kids Jam', detail: 'Volunteering with structured youth camp programs.' },
  { label: 'Leonora Community', detail: 'Remote community work in regional Western Australia.' },
  { label: 'Manila Outreach', detail: 'Short-term international aid project — on-the-ground community support.' },
  { label: 'Tutoring Initiatives', detail: 'Founded The Learning Frontier and ran private tutoring — advertising, website, bookings, and delivery.' },
];

export default function ServiceSection() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <h3 className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
              Community & Service
            </h3>
            <p className="mt-4 text-[14px] md:text-[15px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
              {"Outside of client work, a significant part of my time goes toward volunteering and community service. This isn't a side note — it's central to how I operate."}
            </p>
            <p className="mt-3 text-[14px] md:text-[15px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
              Working in high-trust environments — with children, in remote communities, across cultures — builds patience, sharpens empathy, and reinforces the belief that quality output matters most when it serves others.
            </p>
          </motion.div>

          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-5" style={{ color: 'var(--c4-text-subtle)' }}>
                Experience
              </div>
              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={exp.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.05 * i, ease }}
                    className="backdrop-blur-sm rounded-[3px] px-5 py-4"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--c4-card-bg) 60%, transparent)', border: '1px solid var(--c4-border)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-[3px] h-[3px] rounded-full mt-2 shrink-0" style={{ backgroundColor: 'var(--c4-accent)' }} />
                      <div>
                        <span className="text-[13px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                          {exp.label}
                        </span>
                        <p className="mt-1 text-[12.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
                          {exp.detail}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}