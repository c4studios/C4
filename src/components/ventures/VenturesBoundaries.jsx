import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const items = [
  "We can't build everything — we select ideas based on fit, feasibility, and alignment with our capabilities.",
  "Submissions may overlap with ideas already under consideration. We'll handle this fairly.",
  "We treat submissions with reasonable confidentiality, but we recommend not sharing anything you're not comfortable disclosing.",
  'Submission does not create any obligation, partnership, or agreement.',
  'If your idea is selected, specific terms will be discussed at that stage — never assumed.',
];

export default function VenturesBoundaries() {
  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="max-w-[720px]"
        >
          <h3 className="text-[1.05rem] md:text-[1.15rem] font-semibold tracking-[-0.02em] leading-[1.1] mb-5" style={{ color: 'var(--c4-text)' }}>
            A Few Things to Know
          </h3>
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
                <div className="mt-[7px] w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--c4-border)' }} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}