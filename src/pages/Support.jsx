import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Headphones, MessageSquare, ShieldCheck } from 'lucide-react';
import { submitSupportRequest } from '@/api/submissions';
import SubmissionSuccess from '@/components/c4/SubmissionSuccess';
import TurnstileWidget from '@/components/c4/TurnstileWidget';
import SubmitButton from '@/components/c4/SubmitButton';

const ease = [0.22, 1, 0.36, 1];

/* ── Issue categories for the dropdown ── */
const ISSUE_CATEGORIES = [
  { key: '', label: 'Select a category…' },
  { key: 'website_support', label: 'Website Support Request' },
  { key: 'strategy_advice', label: 'Strategy or Advisory Question' },
  { key: 'proposal_followup', label: 'Proposal or Quote Follow-up' },
  { key: 'website_bug', label: 'Website Bug or Error' },
  { key: 'account', label: 'Account & Login' },
  { key: 'billing', label: 'Billing & Payments' },
  { key: 'project_status', label: 'Project Status Inquiry' },
  { key: 'feature_request', label: 'Feature Request or Feedback' },
  { key: 'partnership', label: 'Partnership & Collaboration' },
  { key: 'general', label: 'General Question' },
];

const PRIORITY_OPTIONS = [
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
  { key: 'urgent', label: 'Urgent' },
];

/* ── FAQ data ── */
const FAQ_ITEMS = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'How does the C4 Studios process work?',
        a: 'We start with a discovery call to understand your vision, then move through strategy, design, development, and launch. Each phase includes checkpoints so you\'re always in the loop.',
      },
      {
        q: 'What information do I need to start a project?',
        a: 'A rough idea of what you want to build, your target audience, timeline, and budget range. Don\'t worry if you\'re not sure about everything — our Start a Project brief helps guide you through it.',
      },
      {
        q: 'Do you work with clients internationally?',
        a: 'Yes. We work with clients worldwide. All communication and project management happens digitally, so location is never a barrier.',
      },
    ],
  },
  {
    category: 'Projects & Timelines',
    items: [
      {
        q: 'How long does a typical project take?',
        a: 'It depends on scope. A focused website build typically takes 4–8 weeks, while larger web applications or brand platforms can take 3–6 months. We\'ll give you a clear timeline upfront.',
      },
      {
        q: 'Can I check on my project\'s progress?',
        a: 'Absolutely. You\'ll receive regular updates and have access to staging previews throughout the build. You can also reach out anytime via this support page.',
      },
      {
        q: 'What happens after my project launches?',
        a: 'We offer post-launch support to squash any bugs and ensure everything runs smoothly. Ongoing retainers are available for continued development and maintenance.',
      },
    ],
  },
  {
    category: 'Pricing & Payments',
    items: [
      {
        q: 'How much does a project cost?',
        a: 'Every project is different. We offer transparent pricing based on scope. Use our Start a Project page to share your requirements and we\'ll provide a detailed quote within 24 hours.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept bank transfers, credit/debit cards, and can accommodate milestone-based payment schedules for larger projects.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'Refund eligibility depends on the project phase and agreement. Contact us through this page with your order or project details and we\'ll review your case promptly.',
      },
    ],
  },
  {
    category: 'Websites & Advisory',
    items: [
      {
        q: 'Can I get help after my website has launched?',
        a: 'Yes. If your site needs fixes, content updates, refinements, or technical support after launch, submit a request here and we\'ll route it to the right person quickly.',
      },
      {
        q: 'Can I book C4 for strategy, review, or advice only?',
        a: 'Yes. We also support clients who need direction before a build begins, including website audits, product thinking, growth advice, and technical guidance on what to do next.',
      },
      {
        q: 'How should I follow up on a proposal or quote?',
        a: 'Use this page and choose the proposal or quote follow-up category. Include your business name, any reference number if you have one, and the specific question so we can respond with context.',
      },
    ],
  },
  {
    category: 'Technical Support',
    items: [
      {
        q: 'The website isn\'t loading properly. What should I do?',
        a: 'Try clearing your browser cache and cookies, or opening the site in an incognito window. If the issue persists, submit a bug report above with your browser, device, and a screenshot.',
      },
      {
        q: 'I found a bug on the site. How do I report it?',
        a: 'Select "Website Bug or Error" in the support form above. Include the URL, what you expected to happen, and what actually happened. Screenshots are very helpful.',
      },
      {
        q: 'Do you provide ongoing website maintenance?',
        a: 'Yes. We offer maintenance retainers that include security updates, performance monitoring, content updates, and priority support.',
      },
    ],
  },
  {
    category: 'Ventures & Partnerships',
    items: [
      {
        q: 'What is C4 Ventures?',
        a: 'C4 Ventures is our initiative to co-build and invest in promising ideas. If you have a concept but need a technical partner, we may contribute development resources in exchange for equity or revenue share.',
      },
      {
        q: 'How do I submit a venture idea?',
        a: 'Head to the Ventures page and fill out the submission form. Include your concept, target market, and what makes it compelling. We review every submission.',
      },
      {
        q: 'Do you sign NDAs before I share my idea?',
        a: 'Yes. You can request an NDA directly through the Ventures form. We take intellectual property seriously and are happy to sign before any detailed discussion.',
      },
    ],
  },
];

const labelClass = 'block text-[11px] uppercase tracking-[0.15em] font-medium mb-2';
const fieldClass = 'w-full rounded-sm px-4 py-3 text-[14px] focus:outline-none transition-colors duration-300';

/* ── FAQ Accordion Item ── */
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b transition-colors duration-300"
      style={{ borderColor: 'var(--c4-border)' }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
      >
        <span
          className="text-[14px] md:text-[15px] font-medium leading-[1.5] transition-colors duration-300"
          style={{ color: open ? 'var(--c4-text)' : 'var(--c4-text-muted)' }}
        >
          {question}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className="shrink-0 transition-transform duration-300"
          style={{
            color: 'var(--c4-text-subtle)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <p
              className="pb-5 text-[13.5px] leading-[1.7] max-w-[560px]"
              style={{ color: 'var(--c4-text-muted)' }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Support page
   ═══════════════════════════════════════════ */
export default function Support() {
  const loadedAt = useRef(Date.now());
  const turnstileToken = useRef(null);

  /* ── form state ── */
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: '',
    priority: 'medium',
    order_number: '',
    subject: '',
    message: '',
    _gotcha: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  /* ── FAQ search ── */
  const [faqSearch, setFaqSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredFaq = useMemo(() => {
    if (!faqSearch.trim()) return FAQ_ITEMS;
    const q = faqSearch.toLowerCase();
    return FAQ_ITEMS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      ),
    })).filter((group) => group.items.length > 0);
  }, [faqSearch]);

  const totalResults = filteredFaq.reduce((s, g) => s + g.items.length, 0);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const showReferenceField = ['proposal_followup', 'billing', 'project_status'].includes(
    form.category
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await submitSupportRequest({
        name: form.name,
        email: form.email,
        category: form.category,
        priority: form.priority,
        order_number: form.order_number,
        subject: form.subject,
        message: form.message,
        _gotcha: form._gotcha,
        _loaded: loadedAt.current,
        turnstileToken: turnstileToken.current,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Support submission failed:', err);
      setFormError(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading / Success / Error state ── */
  if (submitting || submitted || formError) {
    return (
      <div
        className="min-h-screen pt-28 md:pt-36 pb-24"
        style={{ backgroundColor: 'var(--c4-bg)' }}
      >
        <SubmissionSuccess
          submitting={submitting}
          submitted={submitted}
          error={formError}
          onRetry={() => setFormError(null)}
          retryLabel="Back to Support"
          accentLabel="Support Centre"
          headline="Request received"
          message="Our team will review your message and get back to you within 24 hours. Check your email for a confirmation."
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-28 md:pt-36 pb-24"
      style={{ backgroundColor: 'var(--c4-bg)' }}
    >
      <div className="max-w-[960px] mx-auto px-6 md:px-12">
        {/* ━━━ Hero ━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center gap-3 mb-8 md:mb-10">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="w-8 h-px origin-left"
              style={{ backgroundColor: 'var(--c4-accent)' }}
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-[10px] uppercase tracking-[0.25em] font-medium"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              Support Centre
            </motion.span>
          </div>

          <h1
            className="text-[clamp(1.8rem,4.5vw,2.8rem)] font-semibold tracking-[-0.035em] leading-[1.08]"
            style={{ color: 'var(--c4-text)' }}
          >
            How can we help?
          </h1>
          <p
            className="mt-4 text-[14px] md:text-[15px] leading-[1.7] max-w-[520px]"
            style={{ color: 'var(--c4-text-muted)' }}
          >
            Search our knowledge base or submit a request below. We typically
            respond within 24 hours.
          </p>
        </motion.div>

        {/* ━━━ Quick-action cards ━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 md:mt-12"
        >
          {[
            {
              icon: MessageSquare,
              title: 'Submit a Request',
              desc: 'Describe your issue and we\'ll get on it.',
              action: () =>
                document
                  .getElementById('support-form')
                  ?.scrollIntoView({ behavior: 'smooth' }),
            },
            {
              icon: Search,
              title: 'Search FAQs',
              desc: 'Find instant answers to common questions.',
              action: () =>
                document
                  .getElementById('faq-section')
                  ?.scrollIntoView({ behavior: 'smooth' }),
            },
            {
              icon: Headphones,
              title: 'Live Assistance',
              desc: 'Priority support for active projects.',
              soon: true,
              action: () =>
                document
                  .getElementById('support-form')
                  ?.scrollIntoView({ behavior: 'smooth' }),
            },
          ].map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={card.action}
              className="relative text-left p-5 rounded-sm border transition-all duration-300 hover:translate-y-[-2px] group"
              style={{
                backgroundColor: 'var(--c4-card-bg)',
                borderColor: 'var(--c4-border)',
              }}
            >
              {card.soon && (
                <span
                  className="absolute top-4 right-4 px-2 py-1 text-[9px] uppercase tracking-[0.18em] font-semibold rounded-full"
                  style={{
                    color: 'var(--c4-accent)',
                    backgroundColor: 'var(--c4-bg-alt)',
                    border: '1px solid var(--c4-border)',
                  }}
                >
                  Coming Soon
                </span>
              )}
              <card.icon
                size={18}
                strokeWidth={1.6}
                className="mb-3 transition-colors duration-300"
                style={{ color: 'var(--c4-accent)' }}
              />
              <h3
                className="text-[13px] font-semibold tracking-[-0.01em] mb-1"
                style={{ color: 'var(--c4-text)' }}
              >
                {card.title}
              </h3>
              <p
                className="text-[12px] leading-[1.5]"
                style={{ color: 'var(--c4-text-muted)' }}
              >
                {card.desc}
              </p>
            </button>
          ))}
        </motion.div>

        {/* ━━━ FAQ Section ━━━ */}
        <motion.section
          id="faq-section"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease }}
          className="mt-16 md:mt-20"
        >
          <h2
            className="text-[1.3rem] md:text-[1.5rem] font-semibold tracking-[-0.025em] mb-2"
            style={{ color: 'var(--c4-text)' }}
          >
            Frequently Asked Questions
          </h2>
          <p
            className="text-[13.5px] leading-[1.6] mb-8"
            style={{ color: 'var(--c4-text-muted)' }}
          >
            Browse or search for answers before reaching out.
          </p>

          {/* Liquid glass search */}
          <div className="relative mb-10">
            <div
              className="c4-support-rail rounded-sm overflow-hidden transition-all duration-300"
              style={{
                boxShadow: searchFocused
                  ? '0 12px 40px rgba(42, 32, 28, 0.16)'
                  : undefined,
              }}
            >
              <div className="relative flex items-center">
                <Search
                  size={16}
                  strokeWidth={1.8}
                  className="absolute left-4 pointer-events-none"
                  style={{ color: 'var(--c4-text-subtle)' }}
                />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search for answers…"
                  className="w-full pl-11 pr-4 py-3.5 text-[14px] bg-transparent focus:outline-none"
                  style={{ color: 'var(--c4-text)' }}
                />
                {faqSearch && (
                  <span
                    className="absolute right-4 text-[11px] font-medium tracking-wide"
                    style={{ color: 'var(--c4-text-subtle)' }}
                  >
                    {totalResults} result{totalResults !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* FAQ accordion by category */}
          <div className="space-y-10">
            {filteredFaq.map((group) => (
              <div key={group.category}>
                <h3
                  className="text-[10.5px] uppercase tracking-[0.2em] font-medium mb-4"
                  style={{ color: 'var(--c4-text-subtle)' }}
                >
                  {group.category}
                </h3>
                <div>
                  {group.items.map((item) => (
                    <FaqItem
                      key={item.q}
                      question={item.q}
                      answer={item.a}
                    />
                  ))}
                </div>
              </div>
            ))}

            {filteredFaq.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <p
                  className="text-[14px]"
                  style={{ color: 'var(--c4-text-muted)' }}
                >
                  No matching questions found.
                </p>
                <p
                  className="text-[13px] mt-1"
                  style={{ color: 'var(--c4-text-subtle)' }}
                >
                  Try a different search, or submit a request below.
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* ━━━ Divider ━━━ */}
        <div
          className="my-16 md:my-20 h-px"
          style={{ backgroundColor: 'var(--c4-border)' }}
        />

        {/* ━━━ Support Form ━━━ */}
        <motion.section
          id="support-form"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease }}
        >
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck
              size={18}
              strokeWidth={1.6}
              style={{ color: 'var(--c4-accent)' }}
            />
            <h2
              className="text-[1.3rem] md:text-[1.5rem] font-semibold tracking-[-0.025em]"
              style={{ color: 'var(--c4-text)' }}
            >
              Submit a Support Request
            </h2>
          </div>
          <p
            className="text-[13.5px] leading-[1.6] mb-10 max-w-[480px]"
            style={{ color: 'var(--c4-text-muted)' }}
          >
            Fill in the details below and we&apos;ll route your request to the
            right team. The more context you provide, the faster we can help.
          </p>

          <form onSubmit={handleSubmit} className="max-w-[680px] space-y-7">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className={labelClass}
                  style={{ color: 'var(--c4-text-subtle)' }}
                >
                  Name *
                </label>
                <input
                  className={fieldClass}
                  style={{
                    backgroundColor: 'var(--c4-card-bg)',
                    border: '1px solid var(--c4-border)',
                    color: 'var(--c4-text)',
                  }}
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  className={labelClass}
                  style={{ color: 'var(--c4-text-subtle)' }}
                >
                  Email *
                </label>
                <input
                  className={fieldClass}
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    backgroundColor: 'var(--c4-card-bg)',
                    border: '1px solid var(--c4-border)',
                    color: 'var(--c4-text)',
                  }}
                />
              </div>
            </div>

            {/* Category + Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className={labelClass}
                  style={{ color: 'var(--c4-text-subtle)' }}
                >
                  Issue Category *
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  className={fieldClass + ' cursor-pointer appearance-none'}
                  style={{
                    backgroundColor: 'var(--c4-card-bg)',
                    border: '1px solid var(--c4-border)',
                    color: form.category
                      ? 'var(--c4-text)'
                      : 'var(--c4-text-faint)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23908E88' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: '2.5rem',
                  }}
                >
                  {ISSUE_CATEGORIES.map((cat) => (
                    <option key={cat.key} value={cat.key} disabled={!cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className={labelClass}
                  style={{ color: 'var(--c4-text-subtle)' }}
                >
                  Priority
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => update('priority', opt.key)}
                      className="px-4 py-2 text-[12.5px] font-medium border rounded-sm transition-all duration-300"
                      style={
                        form.priority === opt.key
                          ? {
                              backgroundColor: 'var(--c4-text)',
                              color: 'var(--c4-bg)',
                              borderColor: 'var(--c4-text)',
                            }
                          : {
                              backgroundColor: 'var(--c4-card-bg)',
                              color: 'var(--c4-text-muted)',
                              borderColor: 'var(--c4-border)',
                            }
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reference number — conditional */}
            <AnimatePresence>
              {showReferenceField && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                >
                  <label
                    className={labelClass}
                    style={{ color: 'var(--c4-text-subtle)' }}
                  >
                    Project / Invoice / Reference Number
                  </label>
                  <input
                    className={fieldClass}
                    style={{
                      backgroundColor: 'var(--c4-card-bg)',
                      border: '1px solid var(--c4-border)',
                      color: 'var(--c4-text)',
                    }}
                    value={form.order_number}
                    onChange={(e) => update('order_number', e.target.value)}
                    placeholder="e.g. C4-2026-014 or INV-1042"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subject */}
            <div>
              <label
                className={labelClass}
                style={{ color: 'var(--c4-text-subtle)' }}
              >
                Subject *
              </label>
              <input
                className={fieldClass}
                required
                value={form.subject}
                onChange={(e) => update('subject', e.target.value)}
                placeholder="Brief summary of your issue"
                style={{
                  backgroundColor: 'var(--c4-card-bg)',
                  border: '1px solid var(--c4-border)',
                  color: 'var(--c4-text)',
                }}
              />
            </div>

            {/* Message */}
            <div>
              <label
                className={labelClass}
                style={{ color: 'var(--c4-text-subtle)' }}
              >
                Message *
              </label>
              <textarea
                className={fieldClass + ' h-36 resize-none'}
                required
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="Describe your issue in detail. Include any steps to reproduce, error messages, or screenshots links."
                style={{
                  backgroundColor: 'var(--c4-card-bg)',
                  border: '1px solid var(--c4-border)',
                  color: 'var(--c4-text)',
                }}
              />
            </div>

            {/* Honeypot */}
            <div
              aria-hidden="true"
              tabIndex={-1}
              style={{ position: 'absolute', left: '-9999px' }}
            >
              <input
                type="text"
                name="_gotcha"
                value={form._gotcha}
                onChange={(e) => update('_gotcha', e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Turnstile */}
            <div className="pt-2">
              <TurnstileWidget
                onToken={(t) => { turnstileToken.current = t; }}
                onExpire={() => { turnstileToken.current = null; }}
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <SubmitButton
                submitting={submitting}
                label="Submit request"
                loadingLabel="Sending"
              />
            </div>
          </form>
        </motion.section>

        {/* ━━━ Response-time promise ━━━ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 md:mt-20 p-6 rounded-sm border text-center"
          style={{
            backgroundColor: 'var(--c4-card-bg)',
            borderColor: 'var(--c4-border)',
          }}
        >
          <p
            className="text-[13px] leading-[1.6]"
            style={{ color: 'var(--c4-text-muted)' }}
          >
            <span
              className="font-semibold"
              style={{ color: 'var(--c4-text)' }}
            >
              Response guarantee.
            </span>{' '}
            All support requests receive a human response within 24 hours.
            Urgent issues are escalated immediately.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
