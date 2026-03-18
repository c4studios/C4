import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const expectations = [
  { title: 'Clear communication', text: "You'll always know where your project stands — timelines, progress, and decisions are shared openly and honestly." },
  { title: 'Considered design', text: 'Every visual choice is made with intention. Typography, spacing, layout, and interaction quality that reflects the care behind your brand.' },
  { title: 'Solid engineering', text: 'Clean, well-structured code built for real-world performance — fast, responsive, and designed to last well beyond launch.' },
  { title: 'Direct collaboration', text: "You work with the person building your project. There are no layers between us — just straightforward, productive partnership." },
  { title: 'Thoughtful handover', text: 'Every project includes proper documentation, deployment support, and a transition window so you feel confident going forward.' },
];

export default function WhyHireC4() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-10 md:mb-14"
        >
          <h3 className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            What You Can Expect
          </h3>
          <p className="mt-3 text-[14px] leading-[1.65] max-w-[480px]" style={{ color: 'var(--c4-text-muted)' }}>
            Working with C4 Studios is a straightforward, personal experience. Here is what that looks like in practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {expectations.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.06 * i, ease }}
              className="border-t pt-5"
              style={{ borderColor: 'var(--c4-border)' }}
            >
              <h4 className="text-[13.5px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                {item.title}
              </h4>
              <p className="mt-2 text-[12.5px] leading-[1.65]" style={{ color: 'var(--c4-text-muted)' }}>
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}