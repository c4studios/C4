import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
// Single source of truth — same data the /software page and detail pages use,
// so the homepage grid can never drift out of date (statuses, CTAs, new products).
import { PRODUCTS, statusColor } from '../software/productData';

const ease = [0.22, 1, 0.36, 1];

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
            style={{ backgroundColor: statusColor(product.status) }}
          />
          <span
            className="text-[9.5px] uppercase tracking-[0.16em] font-medium"
            style={{ color: statusColor(product.status) }}
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
        {product.oneLiner}
      </p>

      {/* Detail — first feature from the shared product data */}
      <p
        className="text-[12px] leading-[1.55] mb-6 flex-1"
        style={{ color: 'var(--c4-text-faint)' }}
      >
        {product.features?.[0]}
      </p>

      {/* CTA */}
      {product.ctaExternal ? (
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
