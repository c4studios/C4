import React from 'react';
import { motion } from 'framer-motion';
import { Code, BookOpen, Heart, Compass } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const cards = [
  {
    icon: Code,
    label: 'Work',
    text: 'Building full-stack web applications, marketing websites, AI-powered tools, and SaaS-style products. Responsible for the full arc — technical strategy, architecture, design, engineering, hosting, security, and ongoing maintenance.',
  },
  {
    icon: BookOpen,
    label: 'Study',
    text: 'Currently studying a Juris Doctor (JD) in Law — sharpening the same discipline, precision, and structured thinking that shapes every project.',
  },
  {
    icon: Heart,
    label: 'Service',
    text: "Regular children's ministry leader at Barnabas Christian Fellowship. Volunteering with Camp Kids Jam, remote community work in Leonora, and international outreach in Manila. Founded tutoring initiatives including The Learning Frontier.",
  },
  {
    icon: Compass,
    label: 'Approach',
    text: 'Direct collaboration, thoughtful architecture, and genuine care for the outcome. Strong finance and data modelling experience supporting churches and community organisations with dashboards and reporting.',
  },
];

export default function FounderProfile() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Left: bio */}
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <h3 className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
              Who I Am
            </h3>
            <div className="mt-5 space-y-4">
              <p className="text-[14px] md:text-[15px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                {"I'm the founder and sole operator of C4 Studios. Every conversation, every design decision, and every line of code comes directly from me. That's not a limitation — it's the model. It means the person you talk to is the person doing the work."}
              </p>
              <p className="text-[14px] md:text-[15px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                My background spans web development, product design, data modelling, and education. Outside of client work, I volunteer regularly with children and communities — locally and internationally. These experiences shape how I work: with patience, with care, and with a deep respect for the people on the other side of the screen.
              </p>
              <p className="text-[14px] md:text-[15px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                {"I'm currently completing a Juris Doctor (JD) in Law — the same structured thinking and attention to detail that legal study demands is the same standard I bring to every project."}
              </p>
            </div>
          </motion.div>

          {/* Right: at a glance cards */}
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-5" style={{ color: 'var(--c4-text-subtle)' }}>
                At a Glance
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.06 * i, ease }}
                      className="backdrop-blur-sm rounded-[3px] p-5"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--c4-card-bg) 60%, transparent)', border: '1px solid var(--c4-border)' }}
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <Icon size={15} style={{ color: 'var(--c4-accent)' }} strokeWidth={2} />
                        <span className="text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: 'var(--c4-text-subtle)' }}>
                          {card.label}
                        </span>
                      </div>
                      <p className="text-[12.5px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
                        {card.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}