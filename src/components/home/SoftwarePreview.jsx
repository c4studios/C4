import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

const products = [
  { slug: 'quotr', name: 'Quotr', status: 'Live', brief: 'Instant quote calculators for service businesses.', from: 'From $29/mo' },
  { slug: 'returndesk', name: 'ReturnDesk', status: 'Beta', brief: 'Priority inbox — know who to call back first.', from: 'From $49/mo' },
  { slug: 'reviewloop', name: 'ReviewLoop', status: 'Live', brief: 'Turn happy jobs into Google reviews.', from: 'From $29/mo' },
  { slug: 'rebook', name: 'Rebook', status: 'Live', brief: 'Automated service reminders that bring customers back.', from: 'From $29/mo' },
  { slug: 'crewcheck', name: 'CrewCheck', status: 'Live', brief: 'Licence and insurance expiry tracking for your crew.', from: 'From $49/mo' },
  { slug: 'complia', name: 'Complia', status: 'Live', brief: 'Australian compliance calendar and assistant.', from: 'From $49/mo' },
  { slug: 'firmflow', name: 'FirmFlow', status: 'Live', brief: 'AI content engine for professional services.', from: 'From $79/mo' },
];

function statusColor(status) {
  return status === 'Live' ? 'var(--c4-brand-success, #22c55e)' : 'var(--c4-accent)';
}

export default function SoftwarePreview() {
  const base = createPageUrl('Software');

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease }}
          className="flex justify-between items-baseline mb-12 md:mb-16"
        >
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>Software</h2>
            <p className="mt-1 text-[12px] font-medium tracking-[-0.01em]" style={{ color: 'var(--c4-text-faint)' }}>
              Seven products. Studio pricing. Free plans included.
            </p>
          </div>
          <Link
            to={base}
            className="text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-300"
            style={{ color: 'var(--c4-text-subtle)' }}
          >
            All Software →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
          {products.map((p, i) => (
            <motion.div
              key={p.slug}
              role="listitem"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease }}
              className="h-full"
            >
              <Link
                to={`${base}#${p.slug}`}
                className="group flex h-full flex-col rounded-[3px] border p-5 transition-colors duration-300"
                style={{ borderColor: 'var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--c4-accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--c4-border)'; }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-[7px] rounded-full"
                    style={{ backgroundColor: statusColor(p.status) }}
                  />
                  <span className="text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ color: 'var(--c4-text-faint)' }}>
                    {p.status}
                  </span>
                </div>
                <h3 className="text-[1.02rem] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>
                  {p.name}
                </h3>
                <p className="mt-2 flex-1 text-[12.5px] leading-[1.55]" style={{ color: 'var(--c4-text-muted)' }}>
                  {p.brief}
                </p>
                <span className="mt-4 flex items-center justify-between text-[11px] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
                  {p.from}
                  <ArrowUpRight
                    size={13}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
