import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const SERVICE_KEYS = ['websites', 'apps', 'brand', 'growth', 'automation', 'rebuild', 'lens'];

const SERVICES = [
  {
    key: 'websites',
    title: 'Websites',
    portfolioFilter: 'web_design',
    summary: 'Custom websites designed to convert, built to perform, and impossible to ignore.',
    includes: [
      'Custom design & front-end build',
      'Responsive, performance-first code',
      'CMS & content architecture',
      'SEO-ready structure',
      'Redesigns & modernisation',
    ],
    forWho: 'Businesses that need a flagship site — not a template.',
    outcome: 'A fast, refined website that earns trust and drives action.',
    approach: 'Strategy first, then precision design and clean engineering.',
  },
  {
    key: 'apps',
    title: 'Web Applications',
    portfolioFilter: 'web_app',
    summary: 'Production-grade web apps — SaaS, portals, dashboards — built for real users.',
    includes: [
      'SaaS MVPs & full products',
      'Dashboards & internal tools',
      'Auth, roles & permissions',
      'Database architecture & APIs',
      'Third-party integrations',
    ],
    forWho: 'Founders and teams building serious digital products.',
    outcome: 'A maintainable, performant app with refined UX.',
    approach: 'Architect for scale, ship incrementally, avoid feature bloat.',
  },
  {
    key: 'brand',
    title: 'Brand Platforms',
    portfolioFilter: 'brand_platform',
    summary: 'Cohesive digital identity systems that make every touchpoint feel intentional.',
    includes: [
      'Visual direction for web',
      'Design systems & component libraries',
      'Brand-consistent interfaces',
      'Premium redesigns',
    ],
    forWho: 'Brands elevating quality and consistency across digital.',
    outcome: 'A unified brand experience with a scalable design language.',
    approach: 'Systems thinking — distinctiveness without disorder.',
  },
  {
    key: 'growth',
    title: 'Growth & Optimisation',
    portfolioFilter: null,
    summary: 'Evidence-based optimisation that turns traffic into measurable business results.',
    includes: [
      'Conversion-focused redesign',
      'SEO foundations & structure',
      'Performance & speed tuning',
      'Analytics & tracking setup',
      'A/B testing strategy',
    ],
    forWho: 'Teams that want measurable lift, not guesswork.',
    outcome: 'Higher conversion, faster load times, and data to prove it.',
    approach: 'Measure first, change with intent, iterate on evidence.',
  },
  {
    key: 'automation',
    title: 'Automation & AI',
    portfolioFilter: null,
    summary: 'Workflow automation and AI integrations that remove friction and free your team.',
    includes: [
      'AI-assisted workflows & agents',
      'Process automation & integrations',
      'Custom internal tools',
      'Data pipelines & sync',
      'LLM & API integrations',
    ],
    forWho: 'Teams ready to replace manual work with compounding systems.',
    outcome: 'Fewer steps, faster output, and tools that run without you.',
    approach: 'Practical AI and tight integration — built to compound.',
  },
  {
    key: 'rebuild',
    title: 'Software Rebuilds',
    portfolioFilter: 'rebuild',
    summary: 'Lean custom replacements for the bloated software your team has outgrown.',
    includes: [
      'Existing tool audit',
      'Rebuild strategy & scoping',
      'Custom lightweight alternative',
      'Migration & rollout',
    ],
    forWho: 'Teams overpaying for tools that no longer fit.',
    outcome: 'Lower cost, better performance, and a stack you actually own.',
    approach: 'Strip the noise, keep the essentials, build it clean.',
  },
  {
    key: 'lens',
    title: 'Videography',
    portfolioFilter: null,
    comingSoon: true,
    summary: 'C4 Lens, coming soon.',
    includes: [
      'Visual direction for launch moments',
      'Brand-led motion capture',
      'Editorial-grade story framing',
    ],
    forWho: 'Brands that want motion handled with the same design discipline as the rest of the system.',
    outcome: 'A tighter visual presence across web, campaigns, and brand storytelling.',
    approach: 'Built under the C4 Lens banner. Limited rollout, then broader availability.',
  },
];

const ease = [0.22, 1, 0.36, 1];

function ServiceListItem({ index, title, isActive, isComingSoon, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      tabIndex={0}
      role="tab"
      aria-selected={isActive}
      className="group w-full text-left relative outline-none rounded-sm"
      whileTap={{ scale: 0.995 }}
    >
      <div className="flex items-baseline justify-between gap-4 py-4 pl-3 pr-3 transition-all duration-300 -mx-3 rounded-sm"
        style={isActive ? { backgroundColor: 'var(--c4-text)' } : {}}
      >
        <div className="flex items-baseline gap-4 min-w-0">
          <span className="text-[11px] tabular-nums font-medium transition-colors duration-300"
            style={{ color: isActive ? 'color-mix(in srgb, var(--c4-bg) 50%, transparent)' : 'var(--c4-border)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-[1rem] md:text-[1.1rem] font-semibold tracking-[-0.01em] transition-all duration-300"
            style={{ color: isActive ? 'var(--c4-bg)' : 'var(--c4-text-faint)' }}
          >
            {title}
          </span>
        </div>
        {isComingSoon && (
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] font-semibold"
            style={{
              backgroundColor: isActive ? 'color-mix(in srgb, var(--c4-bg) 16%, transparent)' : 'var(--c4-tag-bg)',
              color: isActive ? 'var(--c4-bg)' : 'var(--c4-text-subtle)',
            }}
          >
            Coming soon
          </span>
        )}
      </div>
      {!isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: 'var(--c4-border-light)' }} />
      )}
    </motion.button>
  );
}

function DetailPanel({ service, onStartProject }) {
  return (
    <motion.div
      key={service.key}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease }}
      className="h-full"
    >
      {service.comingSoon && (
        <div className="inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold"
          style={{ backgroundColor: 'var(--c4-tag-bg)', color: 'var(--c4-text-subtle)' }}
        >
          Coming soon
        </div>
      )}

      <p className="text-[15px] md:text-[16px] leading-[1.65] max-w-[480px]" style={{ color: 'var(--c4-text-muted)' }}>
        {service.summary}
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3" style={{ color: 'var(--c4-text-subtle)' }}>Includes</div>
          <ul className="space-y-2">
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-[1.5]" style={{ color: 'var(--c4-text-muted)' }}>
                <div className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--c4-border)' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: 'var(--c4-text-subtle)' }}>Who it's for</div>
            <p className="text-[13.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>{service.forWho}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: 'var(--c4-text-subtle)' }}>Outcome</div>
            <p className="text-[13.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>{service.outcome}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: 'var(--c4-text-subtle)' }}>Our approach</div>
            <p className="text-[13.5px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>{service.approach}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t flex items-center gap-6" style={{ borderColor: 'var(--c4-border)' }}>
        {service.comingSoon ? (
          <p className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
            C4 Lens rollout in progress
          </p>
        ) : (
          <>
            <button
              onClick={onStartProject}
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
              style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
            >
              Start a Project
              <ArrowRight size={13} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
            </button>
            {service.portfolioFilter && (
              <Link
                to={createPageUrl('Portfolio') + '?filter=' + service.portfolioFilter}
                className="text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
                style={{ color: 'var(--c4-text-subtle)' }}
              >
                View Work
              </Link>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

function MobileServiceItem({ service, index, isOpen, onToggle, onStartProject }) {
  return (
    <div className="border-b" style={{ borderColor: 'var(--c4-border-light)' }}>
      <button
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        tabIndex={0}
        aria-expanded={isOpen}
        className="w-full text-left py-5 flex items-baseline justify-between gap-4 outline-none rounded-sm"
      >
        <div className="flex items-baseline gap-3">
          <span className="text-[11px] tabular-nums font-medium transition-colors duration-300"
            style={{ color: isOpen ? 'var(--c4-accent)' : 'var(--c4-border)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="text-[1.05rem] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c4-text)' }}>{service.title}</span>
            {service.comingSoon && (
              <span className="rounded-full px-2 py-0.5 text-[8.5px] uppercase tracking-[0.16em] font-semibold"
                style={{ backgroundColor: 'var(--c4-tag-bg)', color: 'var(--c4-text-subtle)' }}
              >
                Coming soon
              </span>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease }}
          className="shrink-0" style={{ color: 'var(--c4-text-faint)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="7" y1="2" x2="7" y2="12" />
            <line x1="2" y1="7" x2="12" y2="7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-8">
              <p className="text-[14px] leading-[1.6] mb-5" style={{ color: 'var(--c4-text-muted)' }}>{service.summary}</p>
              <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: 'var(--c4-text-subtle)' }}>Includes</div>
              <ul className="space-y-1.5 mb-5">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] leading-[1.5]" style={{ color: 'var(--c4-text-muted)' }}>
                    <div className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--c4-border)' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-5 mt-2">
                {service.comingSoon ? (
                  <p className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>
                    C4 Lens, coming soon
                  </p>
                ) : (
                  <>
                    <button
                      onClick={onStartProject}
                      className="group inline-flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
                      style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                    >
                      Start a Project
                      <ArrowRight size={12} strokeWidth={2} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                    </button>
                    {service.portfolioFilter && (
                      <Link
                        to={createPageUrl('Portfolio') + '?filter=' + service.portfolioFilter}
                        className="text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-300"
                        style={{ color: 'var(--c4-text-subtle)' }}
                      >
                        View Work
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServiceExplorer({ onStartProject }) {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');
  const initialIndex = serviceParam ? Math.max(0, SERVICE_KEYS.indexOf(serviceParam)) : 0;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [mobileOpen, setMobileOpen] = useState(serviceParam ? SERVICE_KEYS.indexOf(serviceParam) : null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (serviceParam && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, []);

  return (
    <section ref={sectionRef} className="pb-12 md:pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-baseline mb-8 md:mb-12"
        >
          <h3 className="text-[1.15rem] md:text-[1.4rem] font-semibold tracking-[-0.02em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>What We Do</h3>
          <span className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-text-faint)' }}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
          </span>
        </motion.div>

        <div className="hidden md:grid grid-cols-12 gap-10 lg:gap-14">
          <div className="col-span-4" role="tablist" aria-label="Services">
            <div className="border-t" style={{ borderColor: 'var(--c4-border-light)' }}>
              {SERVICES.map((s, i) => (
                <ServiceListItem
                  key={s.key}
                  index={i}
                  title={s.title}
                  isActive={activeIndex === i}
                  isComingSoon={Boolean(s.comingSoon)}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          </div>
          <div className="col-span-8" role="tabpanel">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                <DetailPanel service={SERVICES[activeIndex]} onStartProject={onStartProject} />
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="md:hidden border-t" style={{ borderColor: 'var(--c4-border-light)' }}>
          {SERVICES.map((s, i) => (
            <MobileServiceItem
              key={s.key}
              service={s}
              index={i}
              isOpen={mobileOpen === i}
              onToggle={() => setMobileOpen(mobileOpen === i ? null : i)}
              onStartProject={onStartProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
}