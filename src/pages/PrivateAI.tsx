/**
 * /private-ai — privately hosted AI systems for professional practices.
 *
 * The destination for warm replies to the Private AI cold-email campaign.
 * Single conversion goal: a 15-minute call (email CTA). Ink-on-white
 * editorial system matching the print collateral. All copy is final:
 * Australian spelling, no em dashes anywhere on the page.
 *
 * Motion: GSAP core + ScrollTrigger + Flip, Lenis smooth scroll scoped to
 * this route. Full prefers-reduced-motion pass: consoles render final
 * state, diagram static, floats and sheens off, tier switch is a
 * crossfade. The prerenderer is treated the same so crawlers see the
 * finished page.
 */
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import useDocumentHead from '@/hooks/useDocumentHead';
import { recordPrivateAiEvent } from '@/api/submissions';
import { absoluteUrl, SITE_URL } from '@/lib/seo';
import ConsoleWindow from '@/components/private-ai/ConsoleWindow';
import BoundaryDiagram from '@/components/private-ai/BoundaryDiagram';
import Explorer from '@/components/private-ai/Explorer';
import { tiers, heroScript, heroConsoleSummary } from '@/components/private-ai/tiers';
import '@/components/private-ai/private-ai.css';

gsap.registerPlugin(ScrollTrigger);

const MAILTO = 'mailto:caleb@c4studios.com.au?subject=Private%20AI%2C%2015%20minutes';

const META_DESCRIPTION =
  'Capable AI installed on your own hardware, in your own office. Document work, search and drafting with nothing sent to third-party AI providers. Built and supported in Perth.';

const PRIVACY_POINTS = [
  'A dedicated machine in your office, owned by you outright',
  'Runs on your local network; no internet connection required to operate',
  'No cloud AI accounts, no per-question fees, no data sharing',
  'Nothing is ever sent to a third-party AI provider',
];

const TEAM_POINTS = [
  'Ask questions across your own documents and get answers with sources',
  'Summarise and review documents before the detailed read',
  'Draft correspondence, file notes and first-pass documents',
  'Search whole folders of documents at once, not one file at a time',
  'Review a local audit log of every query: who asked what, and when',
];

const PROCESS_STEPS = [
  'A 15-minute call, then a written quote.',
  'Hardware ordered new through authorised channels.',
  'Built and tested on our bench before it ever reaches you.',
  'Installed on site, with your team trained the same day.',
  'A 30-day tuning period, then monthly care begins.',
];

/* Fire the view event exactly once per page load, like /welcome. */
let viewFired = false;

function PaLabel({ children }: { children: string }) {
  return <div className="pa-label">{children}</div>;
}

export default function PrivateAI() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const prerender = useMemo(
    () => typeof navigator !== 'undefined' && /Prerender/i.test(navigator.userAgent),
    [],
  );
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const staticMode = reduced || prerender;

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Private AI systems',
      serviceType: 'Private AI system supply, installation and support',
      description: META_DESCRIPTION,
      url: absoluteUrl('/private-ai'),
      provider: { '@type': 'Organization', name: 'C4 Studios', url: SITE_URL },
      areaServed: { '@type': 'Place', name: 'Perth, Western Australia' },
      offers: tiers.map((t) => ({
        '@type': 'Offer',
        name: `${t.name} system`,
        url: absoluteUrl(`/private-ai?tier=${t.id}`),
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: Number(t.upfront.replace(/[^0-9]/g, '')),
          priceCurrency: 'AUD',
        },
      })),
    }),
    [],
  );

  useDocumentHead({
    title: 'Private AI for your practice',
    description: META_DESCRIPTION,
    path: '/private-ai',
    image: '/og/private-ai.png',
    jsonLd,
  });

  /* Fonts, Lens-style: Instrument Sans + Geist Mono, swap display. */
  useEffect(() => {
    const els: HTMLLinkElement[] = [];
    const pc1 = document.createElement('link');
    pc1.rel = 'preconnect';
    pc1.href = 'https://fonts.googleapis.com';
    const pc2 = document.createElement('link');
    pc2.rel = 'preconnect';
    pc2.href = 'https://fonts.gstatic.com';
    pc2.crossOrigin = 'anonymous';
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href =
      'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;700&family=Geist+Mono:wght@400;700&display=swap';
    [pc1, pc2, font].forEach((el) => {
      document.head.appendChild(el);
      els.push(el);
    });
    return () => els.forEach((el) => el.remove());
  }, []);

  /* Lenis smooth scroll for this route, shared instance if one exists. */
  useEffect(() => {
    if (staticMode) return undefined;
    const w = window as typeof window & { __c4Lenis?: Lenis };
    if (w.__c4Lenis) {
      lenisRef.current = w.__c4Lenis;
      return undefined;
    }
    const lenis = new Lenis({ duration: 1.05 });
    w.__c4Lenis = lenis;
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      delete w.__c4Lenis;
      lenisRef.current = null;
    };
  }, [staticMode]);

  /* One view event per load, ref attribution included, never on prerender. */
  useEffect(() => {
    if (viewFired || prerender) return;
    viewFired = true;
    const ref = new URLSearchParams(window.location.search).get('ref') || '';
    recordPrivateAiEvent('pa_view', ref ? { ref } : {});
  }, [prerender]);

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -72 });
    else el.scrollIntoView({ behavior: staticMode ? 'auto' : 'smooth' });
  };

  /* Honour a #pricing deep link once the page has mounted. */
  useEffect(() => {
    if (window.location.hash !== '#pricing') return;
    const id = window.setTimeout(scrollToPricing, 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Entrances. Everything renders visible first (LCP), then animates from. */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || staticMode) return undefined;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from('[data-pa-hero-kicker]', { y: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out' })
        .from(
          '[data-pa-hero-h1]',
          { y: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.55',
        )
        .from(
          '[data-pa-hero-sub]',
          { y: 20, autoAlpha: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.5',
        )
        .from('[data-pa-hero-rule]', { scaleX: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .from(
          '[data-pa-hero-ctas]',
          { y: 16, autoAlpha: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.45',
        )
        .from(
          '[data-pa-hero-console]',
          { y: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out' },
          0.15,
        );

      // Two-column sections rise in at 70% viewport.
      root.querySelectorAll<HTMLElement>('[data-pa-rise]').forEach((section) => {
        gsap.from(section.querySelectorAll('[data-pa-rise-item]'), {
          y: 26,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: 'top 70%', once: true },
        });
      });

      // The process line draws while its steps appear.
      const processEl = root.querySelector('[data-pa-process]');
      if (processEl) {
        gsap
          .timeline({
            scrollTrigger: { trigger: processEl, start: 'top 75%', once: true },
          })
          .from('[data-pa-process-line]', {
            scaleX: (i, el) => ((el as HTMLElement).offsetWidth > (el as HTMLElement).offsetHeight ? 0 : 1),
            scaleY: (i, el) => ((el as HTMLElement).offsetWidth > (el as HTMLElement).offsetHeight ? 1 : 0),
            duration: 1.2,
            ease: 'power2.inOut',
          })
          .from(
            '[data-pa-step]',
            { y: 18, autoAlpha: 0, duration: 0.5, ease: 'power2.out', stagger: 0.2 },
            0.15,
          );
      }
    }, root);

    return () => ctx.revert();
  }, [staticMode]);

  return (
    <div ref={rootRef} className="pa-root">
      <div className="pa-topbar" aria-hidden="true" />

      {/* ── Hero: the unplugged demo ─────────────────────────────── */}
      <header className="pa-hero">
        <div className="pa-container pa-hero-grid">
          <div>
            <p className="pa-kicker" data-pa-hero-kicker>
              C4 STUDIOS · PRIVATE AI SYSTEMS
            </p>
            <h1 className="pa-h1" data-pa-hero-h1>
              Private AI for your practice.
            </h1>
            <p className="pa-hero-sub" data-pa-hero-sub>
              Capable AI running entirely on your own hardware, in your own office. Nothing leaves
              the building.
            </p>
            <div className="pa-hero-rule" data-pa-hero-rule />
            <div className="pa-hero-ctas" data-pa-hero-ctas>
              <a
                className="pa-btn"
                href={MAILTO}
                onClick={() => recordPrivateAiEvent('pa_cta_click', { location: 'hero' })}
              >
                Book a 15-minute call
              </a>
              <button
                type="button"
                className="pa-ghost"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToPricing();
                }}
              >
                See systems and pricing
              </button>
            </div>
          </div>
          <div data-pa-hero-console>
            <ConsoleWindow
              exchanges={heroScript}
              title="C4 CONSOLE"
              srSummary={heroConsoleSummary}
              staticMode={staticMode}
            />
          </div>
        </div>
      </header>

      {/* ── The problem, the answer ──────────────────────────────── */}
      <section className="pa-section" data-pa-rise>
        <div className="pa-container pa-cols">
          <div data-pa-rise-item>
            <PaLabel>The problem</PaLabel>
            <p className="pa-col-copy">
              Most AI tools work by sending your information to someone else&rsquo;s servers. For a
              practice holding client files, financial records or patient information, that sits
              awkwardly against confidentiality and privacy obligations. So most practices that
              would benefit simply hold back.
            </p>
          </div>
          <div data-pa-rise-item>
            <PaLabel>What we do</PaLabel>
            <p className="pa-col-copy">
              We supply, install and manage AI systems that run on a dedicated machine inside your
              office. Your documents are indexed locally and your questions are answered locally,
              by the strongest openly available models. Private by design, not by policy.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works: the boundary diagram ───────────────────── */}
      <section className="pa-section" style={{ paddingTop: 0 }}>
        <div className="pa-container">
          <PaLabel>How it works</PaLabel>
          <div style={{ marginTop: 44 }}>
            <BoundaryDiagram staticMode={staticMode} />
          </div>
        </div>
      </section>

      {/* ── Systems and pricing: the interactive explorer ────────── */}
      <Explorer staticMode={staticMode} />

      {/* ── Privacy and the honesty panel ────────────────────────── */}
      <section className="pa-section" style={{ paddingTop: 0 }}>
        <div className="pa-container">
          <div className="pa-cols" data-pa-rise>
            <div data-pa-rise-item>
              <PaLabel>How it stays private</PaLabel>
              <ul className="pa-list" style={{ marginTop: 26 }}>
                {PRIVACY_POINTS.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div data-pa-rise-item>
              <PaLabel>What your team can do</PaLabel>
              <ul className="pa-list" style={{ marginTop: 26 }}>
                {TEAM_POINTS.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          <div data-pa-rise>
            <div className="pa-honesty" style={{ marginTop: 72 }} data-pa-rise-item>
              <PaLabel>What it is, and what it isn&rsquo;t</PaLabel>
              <p>
                It is a capable private assistant for everyday document work. It is not a
                replacement for professional judgement, and it is not a frontier cloud model.
                It also does not move your existing files out of Microsoft's or Google's cloud,
                it simply adds no new exposure of its own. If your needs are better served
                another way, we will say so plainly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The process ──────────────────────────────────────────── */}
      <section className="pa-section" style={{ paddingTop: 0 }}>
        <div className="pa-container">
          <PaLabel>From yes to live</PaLabel>
          <div className="pa-process" data-pa-process>
            <div className="pa-process-line" data-pa-process-line />
            {PROCESS_STEPS.map((step, i) => (
              <div key={step} data-pa-step>
                <div className="pa-step-num">0{i + 1}</div>
                <p className="pa-step-text">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who is behind it ─────────────────────────────────────── */}
      <section className="pa-section" style={{ paddingTop: 0 }} data-pa-rise>
        <div className="pa-container">
          <div data-pa-rise-item>
            <PaLabel>Who is behind it</PaLabel>
            <p className="pa-col-copy" style={{ maxWidth: '58ch' }}>
              Caleb Scott, founder of C4 Studios, a Perth software studio, and a current JD
              candidate at UWA. Every system is built and supported locally in Perth. The first
              system is being built now for a Perth accounting practice with a 400-client book,
              running on the practice's own hardware.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer CTA band ──────────────────────────────────────── */}
      <section className="pa-band" data-pa-rise>
        <div className="pa-container">
          <div data-pa-rise-item>
            <h2 className="pa-band-h2">The next step is a 15-minute conversation.</h2>
            <p className="pa-band-sub">No obligation, and a straight answer either way.</p>
            <div style={{ marginTop: 34 }}>
              <a
                className="pa-btn pa-btn-outline"
                href={MAILTO}
                onClick={() => recordPrivateAiEvent('pa_cta_click', { location: 'footer' })}
              >
                caleb@c4studios.com.au
              </a>
            </div>
          </div>
          <div className="pa-band-mono">
            <span>CALEB@C4STUDIOS.COM.AU</span>
            <span>C4STUDIOS.COM.AU</span>
            <span>PERTH, WESTERN AUSTRALIA</span>
          </div>
        </div>
      </section>
    </div>
  );
}
