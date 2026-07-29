import React, { useMemo } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { getProduct, PRODUCTS } from '../components/software/productData';
import SweepDemo from '../components/software/demos/SweepDemo';
import PulseDemo from '../components/software/demos/PulseDemo';
import HandoverDemo from '../components/software/demos/HandoverDemo';
import CountUpStat from '../components/software/CountUpStat';
import HowItWorks from '../components/software/HowItWorks';
import { Barcode, StatusStamp, LogoChip, Model, CtaLink } from '../components/software/RegisterUI';
import useRegisterMotion from '../components/software/useRegisterMotion';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import '../components/software/software.css';

const DEMOS = { sweep: SweepDemo, pulse: PulseDemo, handover: HandoverDemo };
const DEMO_META = {
  sweep: {
    label: 'Try it',
    note: 'runs in your browser · sample files · nothing leaves this page',
    lead:
      'This is the real grouping engine, running live on a sample messy Downloads folder. Triage a few cards the way you would in the app — keep what matters, archive the rest, and watch the space add up.',
  },
  pulse: {
    label: 'Try it',
    note: 'runs in your browser · edit the commits live',
    lead:
      'On the left is a week of developer commits — the raw, jargon-filled history. On the right is what Pulse turns it into for your client. Edit the commits and watch the update rewrite itself.',
  },
  handover: {
    label: 'See it',
    note: 'sample project · toggle the secret to see the gate',
    lead:
      'Here’s what Handover makes from a finished project — the pack on the right, the accounts it hands over, and the safety gate that refuses to ship a live secret to a client. Flip the toggle to watch it block.',
  },
};

export default function SoftwareProduct() {
  /* /SoftwareProduct/<slug> is the real, canonical, prerendered URL; the ?slug=
     form is a legacy alias that redirects here. See CaseStudy.jsx for why this
     was inverted. */
  const { slug: pathSlug } = useParams();
  const [searchParams] = useSearchParams();
  const querySlug = searchParams.get('slug');
  const slug = pathSlug || querySlug;
  const product = getProduct(slug);
  const rootRef = useRegisterMotion(slug || 'not-found');

  const jsonLd = useMemo(() => {
    if (!product) return null;
    const crumbs = breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'C4 Originals', path: '/software' },
      { name: product.name, path: `/SoftwareProduct/${product.slug}` },
    ]);
    return product.faqs?.length ? [crumbs, faqSchema(product.faqs)] : crumbs;
  }, [product]);

  useDocumentHead(
    product
      ? {
          title: `${product.name} — ${product.oneLiner}`,
          description: product.summary,
          path: `/SoftwareProduct/${product.slug}`,
          jsonLd,
        }
      : {
          title: 'Product Not Found — C4 Originals',
          description: 'The requested product could not be found.',
          path: '/SoftwareProduct',
          noIndex: true,
        }
  );

  /* Legacy ?slug= arrivals move to the canonical path. */
  if (!pathSlug && querySlug && product) {
    return <Navigate to={`/SoftwareProduct/${encodeURIComponent(querySlug)}`} replace />;
  }

  if (!product) {
    return (
      <div ref={rootRef} className="sw-root min-h-screen">
        <div
          className="sw-wrap"
          style={{
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            textAlign: 'center',
          }}
        >
          <p className="sw-code" style={{ color: 'var(--sw-body)' }}>
            Unit not found
          </p>
          <Link to={createPageUrl('Software')} className="sw-btn sw-btn--ghost">
            Back to the register
            <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  const others = PRODUCTS.filter((p) => p.slug !== product.slug && p.status !== 'Studio').slice(0, 3);
  const CtaIcon = product.ctaExternal ? ArrowUpRight : ArrowRight;
  const Demo = DEMOS[product.slug];
  const demoMeta = DEMO_META[product.slug];

  // Truthful, per-product reassurance under the primary CTA.
  const reassurance = /start free/i.test(product.ctaLabel)
    ? 'Free to start · no card required · cancel anytime'
    : product.status === 'Early access'
      ? 'No obligation · we onboard you personally'
      : 'No pressure · just a friendly chat';

  return (
    <div ref={rootRef} className="sw-root min-h-screen">
      {/* ── DATASHEET HEADER / LABEL BLOCK ── */}
      <header className="sw-datasheet-head">
        <div className="sw-wrap">
          <div className="sw-ds-labelblock">
            <LogoChip product={product} className="sw-ds-chip" />
            <div>
              <div className="sw-ds-code">
                <Model slug={product.slug} />
                <StatusStamp status={product.status} />
                <Barcode
                  slug={product.slug}
                  width={132}
                  height={30}
                  className="sw-ds-barcode"
                  scan
                />
              </div>
              <h1 className="sw-h1" data-reveal>
                {product.name}
              </h1>
              <p className="sw-ds-one" data-reveal style={{ '--d': '50ms' }}>
                {product.oneLiner}
              </p>
              {product.siteUrl && (
                <p style={{ marginTop: 20 }}>
                  <a
                    href={product.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sw-btn"
                  >
                    Visit the {product.name} site
                    <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── SPEC STRIP (highlights, ruled table — not a hero-metric band) ── */}
      <section className="sw-section--tight">
        <div className="sw-wrap">
          <div className="sw-spec" data-reveal>
            {product.highlights.map((h) => (
              <div className="sw-spec-cell" key={h.label}>
                <CountUpStat className="sw-spec-val">{h.stat}</CountUpStat>
                <p className="sw-spec-lab">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUMMARY ── */}
      <section className="sw-section--tight">
        <div className="sw-wrap">
          <p className="sw-lede" data-reveal>
            {product.summary}
          </p>
        </div>
      </section>

      {/* ── FAULT → FIX ── */}
      <section className="sw-section--tight">
        <div className="sw-wrap">
          <div className="sw-ff" data-reveal>
            <div className="sw-ff-cell">
              <span className="sw-ff-tag is-fault">The problem</span>
              <p>{product.problem}</p>
            </div>
            <div className="sw-ff-cell">
              <span className="sw-ff-tag is-fix">How {product.name} fixes it</span>
              <p>{product.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      {product.howItWorks?.length ? (
        <section className="sw-section">
          <div className="sw-wrap">
            <div className="sw-section-head">
              <h2 className="sw-h2">How it works</h2>
            </div>
            <p className="sw-prose" style={{ marginTop: -12, marginBottom: 22 }}>
              Three steps from sign-up to something useful. No manual, no onboarding call.
            </p>
            <HowItWorks steps={product.howItWorks} />
          </div>
        </section>
      ) : null}

      {/* ── INTERACTIVE DEMO ── */}
      {Demo && demoMeta ? (
        <section className="sw-section">
          <div className="sw-wrap">
            <div className="sw-demo-note">
              <span className="sw-label">{demoMeta.label}</span>
              <span className="sw-code" style={{ fontSize: 11, color: 'var(--sw-body)' }}>
                {demoMeta.note}
              </span>
            </div>
            <p className="sw-prose" data-reveal style={{ marginBottom: 22 }}>
              {demoMeta.lead}
            </p>
            <Demo />
          </div>
        </section>
      ) : null}

      {/* ── FEATURES + PRICING ── */}
      <section className="sw-section">
        <div className="sw-wrap">
          <div className="sw-cols">
            <div>
              <div className="sw-section-head">
                <h2 className="sw-h2">What you get</h2>
              </div>
              <ul className="sw-feat" data-reveal>
                {product.features.map((feat, i) => (
                  <li key={feat}>
                    <span className="sw-feat-no">{String(i + 1).padStart(2, '0')}</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sw-order" data-reveal>
              <h3 className="sw-h3" style={{ marginBottom: 14 }}>
                Pricing
              </h3>
              {product.tiers && (
                <div>
                  {product.tiers.map((tier) => (
                    <div className="sw-order-tier" key={tier.label}>
                      <span>
                        {tier.label}
                        {tier.note ? (
                          <span style={{ color: 'var(--sw-body)' }}> — {tier.note}</span>
                        ) : null}
                      </span>
                      <span className="sw-ot-price">
                        ${tier.price}
                        <small>/mo</small>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="sw-order-note">{product.pricing}</p>
              <CtaLink product={product} className="sw-btn" style={{ width: '100%' }}>
                {product.ctaLabel}
                <CtaIcon size={13} strokeWidth={2} aria-hidden="true" />
              </CtaLink>
              <p className="sw-reassure" style={{ marginTop: 12, textAlign: 'center' }}>
                {reassurance}
              </p>
              {product.lifetime && (
                <a
                  href={product.lifetime.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sw-lifetime"
                  style={{ marginTop: 16 }}
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
      </section>

      {/* ── FAQ ── */}
      {product.faqs?.length ? (
        <section className="sw-section">
          <div className="sw-wrap" style={{ maxWidth: 820 }}>
            <div className="sw-section-head">
              <h2 className="sw-h2">Common questions</h2>
            </div>
            <div className="sw-faq" data-reveal>
              {product.faqs.map((f) => (
                <details key={f.q}>
                  <summary>
                    {f.q}
                    <Plus size={16} strokeWidth={2} aria-hidden="true" />
                  </summary>
                  <p className="sw-faq-a">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── OTHER PRODUCTS ── */}
      <section className="sw-section" style={{ background: 'var(--sw-fig)' }}>
        <div className="sw-wrap">
          <div className="sw-section-head">
            <h2 className="sw-h2">More from the register</h2>
          </div>
          <div className="sw-others">
            {others.map((p) => (
              <Link
                key={p.slug}
                to={`${createPageUrl('SoftwareProduct')}/${p.slug}`}
                className="sw-other"
              >
                <LogoChip product={p} className="sw-other-chip" />
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      color: 'var(--sw-ink)',
                      fontWeight: 640,
                      fontSize: '0.98rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {p.name}
                  </p>
                  <p className="sw-row-one" style={{ marginTop: 2 }}>
                    {p.oneLiner}
                  </p>
                </div>
                <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
