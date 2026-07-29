import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { createPageUrl } from '@/utils';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema } from '@/lib/schema';
import { PRODUCTS } from '../components/software/productData';
import { Barcode, StatusStamp, LogoChip, Model, CtaLink } from '../components/software/RegisterUI';
import { modelFor } from '../components/software/skus';
import useRegisterMotion from '../components/software/useRegisterMotion';
import '../components/software/software.css';

// Lowest monthly tier, used as the register's "price from" column. Products
// still in preview carry no tiers and show no price (the stamp says PREVIEW).
function priceFrom(product) {
  if (!product.tiers?.length) return null;
  return Math.min(...product.tiers.map((t) => t.price));
}

// One register row = one manufactured unit. Closed row carries model, name,
// price and CTA; the drawer (in the DOM at rest, OPEN under prerender / reduced
// motion) reveals the feature spec and the lifetime line.
function RegisterRow({ product }) {
  const [open, setOpen] = useState(false);
  const detailHref = `${createPageUrl('SoftwareProduct')}/${product.slug}`;
  const from = priceFrom(product);
  const CtaIcon = product.ctaExternal ? ArrowUpRight : ArrowRight;

  return (
    <div className="sw-row" data-open={open ? 'true' : 'false'}>
      <div className="sw-row-head">
        <LogoChip product={product} className="sw-row-chip" />

        <div className="sw-row-ident">
          <div className="sw-row-model">
            <Model slug={product.slug} />
            <Barcode slug={product.slug} width={46} height={13} className="sw-row-barcode" />
          </div>
          <Link to={detailHref} className="sw-row-name">
            {product.name}
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
          <p className="sw-row-one">{product.oneLiner}</p>
        </div>

        <div className="sw-row-meta">
          {from != null && (
            <span className="sw-row-price">
              from <b>${from}</b>
              <small>/mo</small>
            </span>
          )}
          <StatusStamp status={product.status} className="sw-row-stamp" />
        </div>

        <div className="sw-row-actions">
          <CtaLink product={product} className="sw-textlink">
            {product.ctaLabel}
            <CtaIcon size={13} strokeWidth={2} aria-hidden="true" />
          </CtaLink>
          <button
            type="button"
            className="sw-row-toggle"
            aria-expanded={open}
            aria-label={open ? `Hide ${product.name} details` : `Show ${product.name} details`}
            onClick={() => setOpen((o) => !o)}
          >
            <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="sw-drawer">
        <div className="sw-drawer-inner">
          <div className="sw-drawer-body">
            <ul className="sw-feat">
              {product.features.map((feat, i) => (
                <li key={feat}>
                  <span className="sw-feat-no">{String(i + 1).padStart(2, '0')}</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <div className="sw-drawer-side">
              <p className="sw-reassure">{product.pricing}</p>
              {product.lifetime && (
                <a
                  href={product.lifetime.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sw-lifetime"
                >
                  <span>
                    Own it forever — <b>${product.lifetime.price}</b> lifetime
                  </span>
                  <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterGroup({ tag, title, blurb, products }) {
  if (!products.length) return null;
  return (
    <section className="sw-register" data-reveal>
      <div className="sw-grouphead">
        <div className="sw-gh-title">
          <h2 className="sw-h2">{title}</h2>
          <span className="sw-gh-no">
            {tag} · {String(products.length).padStart(2, '0')}
          </span>
        </div>
        <p className="sw-gh-blurb">{blurb}</p>
      </div>
      {products.map((product) => (
        <RegisterRow key={product.slug} product={product} />
      ))}
    </section>
  );
}

export default function Software() {
  useDocumentHead({
    title: 'C4 Software — Tools for Service Businesses',
    description:
      'Every product in the C4 suite started as something we needed ourselves or built for a client. Studio pricing for C4 Studios visitors — early access at below-market rates.',
    path: '/software',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Software', path: '/software' },
    ]),
  });

  const rootRef = useRegisterMotion('software');

  // Group the catalogue. Hide the internal Studio tool from the public buying
  // list (it gets an honest footnote row below); split the rest into tiers.
  const publicProducts = PRODUCTS.filter((p) => p.status !== 'Studio');
  const live = publicProducts.filter((p) => p.status === 'Live');
  const earlyAccess = publicProducts.filter((p) => p.status === 'Early access');
  const preview = publicProducts.filter((p) => p.status === 'Preview');
  const studio = PRODUCTS.find((p) => p.status === 'Studio');

  return (
    <div ref={rootRef} className="sw-root min-h-screen">
      {/* MASTHEAD */}
      <header className="sw-masthead">
        <div className="sw-wrap">
          <div className="sw-mast-bar">
            <span className="sw-mast-title">C4 · Works Register</span>
            <span className="sw-mast-meta">
              <span>
                <b>{publicProducts.length}</b> units
              </span>
              <span>Perth · AU</span>
              <span>AUD</span>
            </span>
          </div>
          <div className="sw-rule sw-rule--ticks" aria-hidden="true" />

          <h1 className="sw-h1 sw-mast-head" data-reveal>
            Tools built for the businesses we serve.
          </h1>
          <p className="sw-lede sw-mast-lede" data-reveal style={{ '--d': '60ms' }}>
            Every product in the C4 suite started as something we needed ourselves or built for a
            client. Most are free to start — pick one, try it, and only pay when it earns its place.
          </p>
        </div>
      </header>

      {/* SUITE ORDER-LINE */}
      <section className="sw-section--tight">
        <div className="sw-wrap">
          <div className="sw-suite" data-reveal>
            <div>
              <span className="sw-suite-tag">
                <span className="sw-reg" aria-hidden="true">
                  <i />
                </span>
                <span className="sw-label">C4 Suite</span>
              </span>
              <h2 className="sw-h2">Everything. One subscription.</h2>
              <p className="sw-prose" style={{ marginTop: 12, fontSize: 14 }}>
                All eight C4 modules at Pro level — ReturnDesk, ReviewLoop, Rebook, CrewCheck,
                SafeDraft, Nudge, Complia, and FirmFlow — for under half the price of buying them
                separately.
              </p>
            </div>
            <div className="sw-suite-buy">
              <p className="sw-suite-price">
                $149<small>/mo · AUD</small>
              </p>
              <Link to={createPageUrl('StartProject')} className="sw-btn">
                Talk to us
                <ArrowUpRight size={13} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* THE REGISTER */}
      <div className="sw-wrap" style={{ paddingBottom: 'clamp(48px, 7vw, 96px)' }}>
        <RegisterGroup
          tag="Live"
          title="Ready to use today"
          blurb="Standalone apps you can start free right now — no sales call, no setup fee."
          products={live}
        />
        <RegisterGroup
          tag="Early access"
          title="Coming soon — get in first"
          blurb="Relaunching as standalone apps. Register interest and we onboard you personally at early-bird pricing."
          products={earlyAccess}
        />
        <RegisterGroup
          tag="Preview"
          title="In the workshop"
          blurb="Tools we are actively building and using on live C4 work. Take a look, or try the interactive demos on each page."
          products={preview}
        />

        {/* C4 Command — studio-internal, kept crawlable and honest */}
        {studio && (
          <Link
            to={`${createPageUrl('SoftwareProduct')}/${studio.slug}`}
            className="sw-footnote"
          >
            <span className="sw-fn-model">{modelFor(studio.slug)}</span>
            <span>
              <b>{studio.name}</b> — the studio&rsquo;s own operational hub. Studio internal, not for
              sale.
            </span>
            <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* COLOPHON */}
      <section className="sw-colophon">
        <div className="sw-wrap">
          <p className="sw-prose" data-reveal style={{ fontSize: 15 }}>
            All C4 software is built on the same stack used for client work — Next.js, Supabase,
            TypeScript. No vendor lock-in. No inflated SaaS markups.
          </p>
          <Link
            to={createPageUrl('StartProject')}
            className="sw-textlink"
            style={{ marginTop: 8 }}
          >
            Work with C4 Studios
            <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
