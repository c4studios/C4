import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

const sections = [
  {
    title: '1. Definitions',
    items: [
      { term: 'C4 Studios / we / us / our', def: 'means the digital design and development studio operating under the C4 Studios brand.' },
      { term: 'Submitter / you / your', def: 'means any individual or entity submitting an Idea.' },
      { term: 'Idea', def: 'means any concept, description, files, screenshots, prototypes, business plan, copy, or other materials you submit through the Programme.' },
      { term: 'Submission', def: 'means the act of submitting an Idea.' },
      { term: 'Build', def: 'means C4 Studios deciding (in our discretion) to develop a product or service based on, inspired by, or related to an Idea.' },
      { term: 'Agreement', def: 'means a separate written agreement signed by both parties that sets out commercial terms for any Build.' },
    ],
  },
  {
    title: '2. Programme overview and no obligation',
    intro: 'By submitting an Idea, you acknowledge and agree that:',
    list: [
      'Submission does not create any obligation for C4 Studios to review, respond to, negotiate, or Build;',
      'We may evaluate Ideas using internal criteria (including feasibility, market, scope, timing, alignment, and risk);',
      'We may contact you for clarification, but we are not required to do so.',
    ],
  },
  {
    title: '3. Eligibility',
    content: 'You must be legally able to enter into these terms. If you submit on behalf of a company or group, you confirm you have authority to bind that entity.',
  },
  {
    title: '4. Your responsibility for what you submit',
    intro: 'You represent and warrant that:',
    list: [
      'you own the Idea as submitted or you have permission to submit it;',
      'your Submission does not infringe anyone else\'s intellectual property, confidentiality, privacy, or other rights;',
      'your Submission does not include unlawfully obtained content, trade secrets, or confidential information that you do not have the right to disclose;',
      'your Submission is accurate to the best of your knowledge (and does not intentionally mislead).',
    ],
  },
  {
    title: '5. Confidentiality and NDAs',
    list: [
      'No confidentiality by default. Submissions are not treated as confidential unless we both sign a separate NDA before you disclose confidential details.',
      'If you want confidentiality, you should not submit confidential information through the form. Instead, request an NDA discussion first.',
      'We may choose (but are not obliged) to enter into an NDA.',
    ],
    numbered: true,
  },
  {
    title: '6. Intellectual property and licence to evaluate',
    list: [
      'You retain ownership of your Idea as submitted.',
      'You grant C4 Studios a non-exclusive, worldwide, royalty-free licence to use your Submission solely to receive it, review it, evaluate it, discuss it internally, and communicate with you about it.',
      'No transfer of IP happens under these terms. If a Build proceeds, IP ownership/licensing (including any assignment) will be handled under a separate Agreement.',
    ],
    numbered: true,
  },
  {
    title: '7. Similar ideas and independent development',
    list: [
      'You acknowledge that we may already be working on, may later work on, or may independently develop products or concepts that are similar to your Submission.',
      'Your Submission does not restrict us from developing similar ideas unless you and we enter into a separate Agreement that explicitly says otherwise.',
      'Similarity alone does not prove misuse. If you believe your rights were actually infringed, you may contact us with supporting detail.',
    ],
    numbered: true,
  },
  {
    title: '8. Selection, build pathway, and commercial terms',
    intro: 'If we decide to explore a Build, we may propose a separate Agreement covering (as applicable):',
    list: [
      'scope and milestones;',
      'roles and responsibilities;',
      'IP ownership/licensing;',
      'commercial terms (equity, profit share, revenue share, fees, or other consideration);',
      'governance and decision-making;',
      'confidentiality and publication permissions.',
    ],
    outro: 'No commercial terms are promised by these Programme terms. Any stake/profit share is only created if agreed in writing.\n\nWhere a Build proceeds, we may (at our discretion) discuss a profit-share arrangement, which in some cases may be up to 25% of net profits from that specific venture, subject to a signed Agreement and clear definitions.',
  },
  {
    title: '9. No partnership or fiduciary duty',
    content: 'Nothing in these terms creates a partnership, joint venture, employment relationship, fiduciary duty, or agency relationship. Any such relationship must be documented in a separate Agreement.',
  },
  {
    title: '10. Prohibited submissions',
    intro: 'You must not submit:',
    list: [
      'illegal content or content that encourages wrongdoing;',
      'personal data about others without consent;',
      'confidential information you do not have the right to share;',
      'malware, exploit code, or instructions intended to enable hacking or harm.',
    ],
    outro: 'We may reject or delete submissions that breach this section.',
  },
  {
    title: '11. Liability and consumer law',
    list: [
      'To the maximum extent permitted by law, C4 Studios is not liable for any indirect, consequential, special, or incidental loss arising out of the Programme or any Submission (including non-selection).',
      'Our total liability for any claim relating to the Programme is limited to the extent permitted by law.',
      'Australian Consumer Law: Nothing in these terms excludes, restricts, or modifies any consumer guarantees or rights that cannot legally be excluded.',
    ],
    numbered: true,
  },
  {
    title: '12. Indemnity',
    content: 'You agree to indemnify C4 Studios for losses, claims, or damages arising from your breach of these terms, including if your Submission infringes a third party\'s rights.',
  },
  {
    title: '13. Privacy',
    content: 'We handle personal information submitted through the Programme in accordance with our privacy practices.',
  },
  {
    title: '14. Changes to these terms',
    content: 'We may update these terms from time to time by publishing an updated version on our website. The "Effective date" will change when updates are made. Continued use of the Programme after changes take effect means you accept the updated terms.',
  },
  {
    title: '15. Governing law',
    content: 'These terms are governed by the laws of Western Australia, and the courts of Western Australia have exclusive jurisdiction.',
  },
  {
    title: '16. Contact',
    content: 'CONTACT_LINK',
  },
];

function SectionBlock({ section, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: 0.03 * index, ease }}
    >
      <h2 className="text-[14px] font-semibold tracking-[-0.01em] mb-3" style={{ color: 'var(--c4-text)' }}>
        {section.title}
      </h2>

      {/* Definition list style */}
      {section.items && (
        <dl className="space-y-2">
          {section.items.map((item, i) => (
            <div key={i} className="flex flex-col">
              <dt className="text-[13px] font-medium" style={{ color: 'var(--c4-text)' }}>{item.term}</dt>
              <dd className="text-[13.5px] leading-[1.75] ml-4" style={{ color: 'var(--c4-text-muted)' }}>{item.def}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Plain paragraph */}
      {section.content && section.content !== 'CONTACT_LINK' && (
        <p className="text-[13.5px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>{section.content}</p>
      )}

      {/* Contact link special case */}
      {section.content === 'CONTACT_LINK' && (
        <p className="text-[13.5px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
          Questions about these terms? Contact us via our{' '}
          <Link to={createPageUrl('Support')} className="underline underline-offset-2 transition-colors duration-300" style={{ color: 'var(--c4-text)', textDecorationColor: 'var(--c4-border)' }}>
            support page
          </Link>.
        </p>
      )}

      {/* Intro text before list */}
      {section.intro && (
        <p className="text-[13.5px] leading-[1.75] mb-2" style={{ color: 'var(--c4-text-muted)' }}>{section.intro}</p>
      )}

      {/* Bullet or numbered list */}
      {section.list && (
        <ul className={`space-y-1.5 ml-4 ${section.numbered ? 'list-decimal' : 'list-disc'}`}>
          {section.list.map((item, i) => (
            <li key={i} className="text-[13.5px] leading-[1.75] pl-1" style={{ color: 'var(--c4-text-muted)' }}>{item}</li>
          ))}
        </ul>
      )}

      {/* Outro text after list */}
      {section.outro && (
        <div className="mt-3 space-y-2">
          {section.outro.split('\n\n').map((p, i) => (
            <p key={i} className="text-[13.5px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>{p}</p>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function Terms() {
  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="max-w-[720px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--c4-accent)' }} />
            <span className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
              Legal
            </span>
          </div>
          <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-[-0.035em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
            C4 Studios Ventures Terms
          </h1>
          <p className="mt-4 text-[14px] leading-[1.7] max-w-[520px]" style={{ color: 'var(--c4-text-muted)' }}>
            These terms govern your use of the C4 Studios Ventures programme (the "Programme"), including submitting ideas and any follow-up discussions.
          </p>
          <p className="mt-2 text-[11px]" style={{ color: 'var(--c4-text-faint)' }}>
            Effective date: 6 March 2026
          </p>
        </motion.div>

        {/* Sections */}
        <div className="mt-12 space-y-8">
          {sections.map((s, i) => (
            <SectionBlock key={i} section={s} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}