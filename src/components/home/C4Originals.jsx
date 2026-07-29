import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
// Single source of truth — same data the /software page and detail pages use,
// so the home register can never drift out of date (statuses, CTAs, products).
import { PRODUCTS } from '../software/productData';
import { Barcode, StatusStamp, LogoChip, Model, CtaLink } from '../software/RegisterUI';
import { modelFor } from '../software/skus';
import useRegisterMotion from '../software/useRegisterMotion';
import '../software/software.css';

function priceFrom(product) {
  if (!product.tiers?.length) return null;
  return Math.min(...product.tiers.map((t) => t.price));
}

export default function C4Originals() {
  const rootRef = useRegisterMotion('home-register');

  // Match the /software page: hide the internal Studio tool. Feature the lead
  // unit; every remaining public unit runs as a register row, so the home page
  // links each product's detail page directly (full crawl parity) while "All
  // products →" still carries through to the complete register.
  const publicProducts = PRODUCTS.filter((p) => p.status !== 'Studio');
  const featured = publicProducts[0];
  const rows = publicProducts.slice(1);
  const featuredFrom = priceFrom(featured);
  const detailFor = (p) => `${createPageUrl('SoftwareProduct')}/${p.slug}`;

  return (
    <section ref={rootRef} className="sw-root sw-home">
      <div className="sw-wrap">
        <div className="sw-home-bar">
          <span className="sw-home-kicker">C4 Originals · Works Register</span>
          <span className="sw-home-count">
            <b>{publicProducts.length}</b> units
          </span>
        </div>

        <div className="sw-home-head">
          <div>
            <h2 className="sw-h2">Software we built ourselves.</h2>
            <p className="sw-home-lede">
              Every product started as something we needed — or something a client couldn&rsquo;t
              find.
            </p>
          </div>
          <Link to={createPageUrl('Software')} className="sw-textlink">
            All products
            <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <div className="sw-home-grid">
          {/* FEATURED UNIT */}
          {featured && (
            <article className="sw-featured" data-reveal>
              <div className="sw-featured-top">
                <LogoChip product={featured} className="sw-featured-chip" />
                <StatusStamp status={featured.status} />
              </div>
              <div className="sw-featured-model">
                <Model slug={featured.slug} />
                <Barcode
                  slug={featured.slug}
                  width={108}
                  height={24}
                  className="sw-featured-barcode"
                  scan
                />
              </div>
              <Link to={detailFor(featured)} className="sw-featured-name">
                {featured.name}
              </Link>
              <p className="sw-featured-one">{featured.oneLiner}</p>
              <div className="sw-featured-foot">
                {featuredFrom != null && (
                  <span className="sw-featured-price">
                    from <b>${featuredFrom}</b>
                    <small>/mo</small>
                  </span>
                )}
                <CtaLink product={featured} className="sw-textlink">
                  {featured.ctaLabel}
                  <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
                </CtaLink>
              </div>
            </article>
          )}

          {/* COMPACT REGISTER */}
          <div className="sw-mini" data-reveal style={{ '--d': '80ms' }}>
            {rows.map((p) => {
              const from = priceFrom(p);
              return (
                <Link key={p.slug} to={detailFor(p)} className="sw-mini-row">
                  <span className="sw-mini-model">{modelFor(p.slug)}</span>
                  <span className="sw-mini-name">
                    <span>{p.name}</span>
                  </span>
                  <span className="sw-mini-price">
                    {from != null ? `from $${from}/mo` : p.status}
                  </span>
                  <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
