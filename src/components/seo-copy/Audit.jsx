/*
 * What the audit turns up, shown as one: an inspector's read-out for the
 * example business, before the work and after it. It's the climb's first
 * two steps made concrete.
 *
 * Every finding is invented and the panel says so. The words in it are the
 * example's own (examples.js), so the title and description it flags are
 * the ones the climb's listing starts with. Which package does each fix is
 * read from the packages' feature lines in pricing.js; a check whose
 * feature line disappears loses its package names, and a check nobody
 * lists is dropped.
 *
 * Both states are in the HTML. The switch only changes which one shows,
 * and under reduced motion it changes without the strike.
 */
import { useState } from 'react';
import { seoPackages } from '@/data/pricing';
import { EXAMPLES, YOU, YOU_SITE } from './examples';
import { list } from './plans';

const EX = EXAMPLES[0];

const CHECKS = [
  {
    key: 'title', check: 'Page title', re: /meta titles/i,
    was: EX.before.title, why: 'Says nothing about the job or the suburb.',
    now: EX.after.title,
  },
  {
    key: 'desc', check: 'Description', re: /descriptions/i,
    was: EX.before.desc, why: 'Could be any business, anywhere.',
    now: EX.after.desc,
  },
  {
    key: 'address', check: 'Page address', re: /on-page optimisation/i,
    was: `/${EX.before.path}`, why: 'A number where the words should be.',
    now: `/${EX.after.path}`,
  },
  {
    key: 'console', check: 'Search Console', re: /search console/i,
    was: 'Not set up', why: 'Google has no way to tell you what it sees.',
    now: 'Set up and verified',
  },
  {
    key: 'sitemap', check: 'Sitemap', re: /sitemap/i,
    was: 'Never submitted', why: 'Google has to find every page by following links.',
    now: 'Submitted',
  },
  {
    key: 'robots', check: 'robots.txt', re: /robots\.txt/i,
    was: 'Missing', why: 'No file telling crawlers what to skip or where the sitemap is.',
    now: 'Configured',
  },
  {
    key: 'schema', check: 'Structured data', re: /schema markup/i,
    was: 'None found', why: 'Your trade and area aren’t stated anywhere a machine reads.',
    now: 'Local business markup',
  },
  {
    key: 'analytics', check: 'Analytics', re: /analytics/i,
    was: 'Not installed', why: 'No record of who visits or what they do.',
    now: 'Installed',
  },
].map((c) => ({ ...c, who: seoPackages.filter((p) => !/\/mo/.test(p.priceLabel || '')).filter((p) => (p.features || []).some((f) => c.re.test(f))).map((p) => p.name) }))
  .filter((c) => c.who.length);

export default function Audit() {
  const [after, setAfter] = useState(false);
  const n = CHECKS.length;
  return (
    <section className="sc-sec sc-audit" aria-labelledby="sc-audit-h">
      <div className="sc-frame sc-audit-grid">
        <div className="sc-audit-text">
          <h2 className="sc-h2" id="sc-audit-h">What the audit turns up</h2>
          <p className="sc-say">
            The audit is a list of what&rsquo;s holding the site back, written so you can read it, with who fixes each
            thing. This is one for the example business, before the work and after it.
          </p>
          <p className="sc-say">
            None of it is clever. A page title that says Home, or a sitemap nobody sent to Google, is easy to fix once
            someone has looked.
          </p>
          <p className="sc-fine">An example with made-up findings. Yours lists what&rsquo;s actually wrong with your site.</p>
        </div>

        <div className={`sc-inspect${after ? ' is-after' : ''}`} data-nosnippet="">
          <div className="sc-inspect-head">
            <p className="sc-inspect-site">
              <span className="sc-inspect-tag">Example audit</span>
              {YOU_SITE}
            </p>
            <div className="sc-switch" role="group" aria-label="Show the audit">
              <button type="button" aria-pressed={!after} onClick={() => setAfter(false)}>Before the work</button>
              <button type="button" aria-pressed={after} onClick={() => setAfter(true)}>After</button>
            </div>
          </div>
          <table className="sc-inspect-table">
            <caption className="sr-only">
              {`An example audit of ${YOU}'s site: ${n} checks, what each found before the work and after it, and which package does the fix.`}
            </caption>
            <thead>
              <tr>
                <th scope="col">Check</th>
                <th scope="col">Found</th>
                <th scope="col">Fixed in</th>
              </tr>
            </thead>
            <tbody>
              {CHECKS.map((c) => (
                <tr key={c.key}>
                  <th scope="row" className="sc-inspect-check">{c.check}</th>
                  <td className="sc-inspect-found">
                    <span className="sc-inspect-was">
                      <span className="sc-inspect-state">Fault<span className="sr-only"> before the work:</span></span>
                      <span className="sc-inspect-val">{c.was}</span>
                      <span className="sc-inspect-why">{c.why}</span>
                    </span>
                    <span className="sc-inspect-now">
                      <span className="sc-inspect-state">Fixed<span className="sr-only"> after the work:</span></span>
                      <span className="sc-inspect-val">{c.now}</span>
                    </span>
                  </td>
                  <td className="sc-inspect-who">{list(c.who)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="sc-inspect-foot" aria-live="polite">
            {after ? `${n} of ${n} fixed.` : `${n} of ${n} checks failed.`}
          </p>
        </div>
      </div>
    </section>
  );
}
