import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

const steps = [
  { num: '01', label: 'Reach out', description: "Start a conversation about what you're looking to build. There's no pressure — just an open discussion." },
  { num: '02', label: 'Scope & plan', description: 'You receive a clear proposal with defined deliverables, realistic timelines, and transparent pricing.' },
  { num: '03', label: 'Design & build', description: 'The work progresses with regular updates and check-ins, so you always know where things are at.' },
  { num: '04', label: 'Launch & handover', description: 'Your project goes live with proper documentation and a support window to make sure everything lands well.' },
];

export default function WorkWithUs() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-12 md:mb-16"
        >
          <h3 className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            What Happens Next
          </h3>
          <p className="mt-3 text-[14px] leading-[1.6] max-w-[420px] mx-auto" style={{ color: 'var(--c4-text-muted)' }}>
            A simple, transparent process from first conversation to finished product.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * i, ease }}
              className="border-t pt-5"
              style={{ borderColor: 'var(--c4-border)' }}
            >
              <span className="text-[11px] font-semibold tabular-nums tracking-[0.1em]" style={{ color: 'var(--c4-accent)' }}>
                {step.num}
              </span>
              <h4 className="mt-2 text-[14px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                {step.label}
              </h4>
              <p className="mt-1.5 text-[12.5px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="w-full h-px mb-10" style={{ backgroundColor: 'var(--c4-border)' }} />
          <p className="text-[15px] md:text-[17px] font-semibold tracking-[-0.02em]" style={{ color: 'var(--c4-text)' }}>
            Ready to start?
          </p>
          <p className="mt-2 text-[13.5px] leading-[1.6] max-w-[400px] mx-auto" style={{ color: 'var(--c4-text-muted)' }}>
            {"I'd love to hear about your project. Let's start with a conversation."}
          </p>
          <Link
            to={createPageUrl('StartProject')}
            className="group inline-flex items-center gap-2 mt-6 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
            style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
          >
            Start a Project
            <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}