import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ease = [0.22, 1, 0.36, 1];

const PRODUCTS = [
  {
    slug: 'quotr',
    name: 'Quotr',
    logo: '/Software/quotr-icon.jpeg',
    logoBg: '#000000',
    status: 'Live',
    statusColor: '#22c55e',
    tagline: 'Instant quote calculators for service businesses.',
    detail: 'Embed on any website in minutes. Stripe billing built in.',
    ctaLabel: 'quotr.us',
    ctaHref: 'https://quotr.us',
    external: true,
  },
  {
    slug: 'returndesk',
    name: 'ReturnDesk',
    logo: '/Software/returndesk-minimal.png',
    logoBg: '#ffffff',
    status: 'Beta',
    statusColor: 'var(--c4-accent)',
    tagline: 'Priority inbox for service businesses.',
    detail: 'Manual-first, explainable priority scoring, reply templates.',
    ctaLabel: 'Request access',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=ReturnDesk beta access',
    external: false,
  },
  {
    slug: 'reviewloop',
    name: 'ReviewLoop',
    logo: '/Software/reviewloop-minimal.png',
    logoBg: '#ffffff',
    status: 'Coming Soon',
    statusColor: 'var(--c4-text-muted)',
    tagline: 'Turn happy jobs into Google reviews.',
    detail: 'Automated review requests with Google Business Profile integration.',
    ctaLabel: 'Join waitlist',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=ReviewLoop waitlist',
    external: false,
  },
  {
    slug: 'complia',
    name: 'Complia',
    logo: '/Software/Complia.png',
    logoBg: '#ffffff',
    status: 'Coming Soon',
    statusColor: 'var(--c4-text-muted)',
    tagline: 'Australian compliance calendar and assistant.',
    detail: 'BAS, super, ASIC — preparation checklists and reminder system.',
    ctaLabel: 'Join waitlist',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=Complia waitlist',
    external: false,
  },
  {
    slug: 'firmflow',
    name: 'FirmFlow',
    logo: '/Software/FirmFlow.png',
    logoBg: '#ffffff',
    status: 'Coming Soon',
    statusColor: 'var(--c4-text-muted)',
    tagline: 'AI content engine for professional services.',
    detail: 'LinkedIn posts, newsletters and client emails — source-first generation.',
    ctaLabel: 'Join waitlist',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=FirmFlow waitlist',
    external: false,
  },
  {
    slug: 'c4-command',
    name: 'C4 Command',
    logo: '/Software/C4Command.png',
    logoBg: '#ffffff',
    status: 'Studio',
    statusColor: 'var(--c4-text-subtle)',
    tagline: 'Operational hub for the C4 Studio.',
    detail: 'Lead pipeline, automation health, projects and client notes.',
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:caleb@c4studios.com.au?subject=C4 Command',
    external: false,
  },
];

function ProductCard({ product, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex-shrink-0 flex flex-col p-6 rounded-[3px] transition-[transform,box-shadow] duration-400"
      style={{
        width: 260,
        backgroundColor: 'var(--c4-bg-alt)',
        border: '1px solid var(--c4-border)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 50px -20px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      {/* Logo + status row */}
      <div className="flex items-center justify-between mb-5">
        <div
          className="flex items-center justify-center rounded-[4px] overflow-hidden flex-shrink-0"
          style={{
            width: 48,
            height: 48,
            backgroundColor: product.logoBg,
            border: '1px solid var(--c4-border)',
          }}
        >
          <img
            src={product.logo}
            alt={`${product.name} logo`}
            loading="lazy"
            className="h-full w-full"
            style={{ objectFit: 'contain', padding: 6 }}
            draggable="false"
          />
        </div>
        <div className="inline-flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: product.statusColor }}
          />
          <span
            className="text-[9.5px] uppercase tracking-[0.16em] font-medium"
            style={{ color: product.statusColor }}
          >
            {product.status}
          </span>
        </div>
      </div>

      {/* Name → product detail page */}
      <Link
        to={`${createPageUrl('SoftwareProduct')}?slug=${product.slug}`}
        className="group/name inline-flex items-center gap-1.5 mb-2 self-start"
      >
        <h3
          className="text-[1.25rem] font-semibold tracking-[-0.025em]"
          style={{ color: 'var(--c4-text)' }}
        >
          {product.name}
        </h3>
        <ArrowRight
          size={13}
          strokeWidth={2}
          className="opacity-0 -translate-x-1 transition-all duration-300 group-hover/name:opacity-100 group-hover/name:translate-x-0"
          style={{ color: 'var(--c4-accent)' }}
        />
      </Link>

      {/* Tagline */}
      <p
        className="text-[13px] leading-[1.6] mb-2"
        style={{ color: 'var(--c4-text-muted)' }}
      >
        {product.tagline}
      </p>

      {/* Detail */}
      <p
        className="text-[12px] leading-[1.55] mb-6 flex-1"
        style={{ color: 'var(--c4-text-faint)' }}
      >
        {product.detail}
      </p>

      {/* CTA */}
      {product.external ? (
        <a
          href={product.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-200"
          style={{ color: hovered ? 'var(--c4-text)' : 'var(--c4-text-subtle)' }}
        >
          {product.ctaLabel}
          <ArrowUpRight size={11} strokeWidth={2} />
        </a>
      ) : (
        <a
          href={product.ctaHref}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-200"
          style={{ color: hovered ? 'var(--c4-text)' : 'var(--c4-text-subtle)' }}
        >
          {product.ctaLabel}
          <ArrowRight size={11} strokeWidth={2} />
        </a>
      )}
    </motion.div>
  );
}

export default function C4Originals() {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const onMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.pageX, scrollLeft: scrollRef.current.scrollLeft };
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.pageX - dragStart.current.x;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  };
  const onMouseUp = () => setIsDragging(false);

  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-10 md:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] font-medium mb-1" style={{ color: 'var(--c4-text-subtle)' }}>
              C4 Originals
            </p>
            <h2
              className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.025em]"
              style={{ color: 'var(--c4-text)' }}
            >
              Software we built ourselves.
            </h2>
            <p className="mt-2 text-[13.5px]" style={{ color: 'var(--c4-text-muted)' }}>
              Every product started as something we needed — or something a client couldn't find.
            </p>
          </div>
          <Link
            to={createPageUrl('Software')}
            className="hidden md:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-200 flex-shrink-0 ml-8"
            style={{ color: 'var(--c4-text-subtle)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--c4-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--c4-text-subtle)'}
          >
            All products →
          </Link>
        </motion.div>
      </div>

      {/* Drag-to-scroll card row */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10"
          style={{ background: 'linear-gradient(to right, var(--c4-bg), transparent)' }}
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10"
          style={{ background: 'linear-gradient(to left, var(--c4-bg), transparent)' }}
        />

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-6 px-6 md:px-12"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>
      </div>

      {/* Mobile "All products" link */}
      <div className="md:hidden mt-4 px-6">
        <Link
          to={createPageUrl('Software')}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-medium"
          style={{ color: 'var(--c4-text-subtle)' }}
        >
          All products →
        </Link>
      </div>
    </section>
  );
}
