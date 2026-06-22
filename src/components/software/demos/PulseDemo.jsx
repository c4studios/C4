import React, { useMemo, useState } from 'react';
import { parseCommits, translate, SECTION_ORDER } from './pulseTranslate';

const SAMPLE = `feat: online booking with deposit payments
fix: contact form was not sending on Safari
feat(gallery): new project gallery with filters
chore: bump dependencies
fix: mobile menu overlapping the logo
perf: speed up image loading on the home page
refactor: tidy the booking module
feat: SEO meta tags and sitemap
docs: update README
style: format files
Update sponsor logos for 2026
fix: 404 on the old pricing link
wip
test: add booking tests`;

export default function PulseDemo() {
  const [text, setText] = useState(SAMPLE);
  const [client, setClient] = useState('Sam');
  const [project, setProject] = useState('your website');

  const model = useMemo(
    () => translate(parseCommits(text, { project })),
    [text, project]
  );

  const sections = SECTION_ORDER
    .map((s) => ({ ...s, items: model.buckets[s.key] }))
    .filter((s) => s.items.length);

  const inputStyle = {
    backgroundColor: 'var(--c4-bg)', border: '1px solid var(--c4-border)',
    color: 'var(--c4-text)', borderRadius: 3,
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* LEFT — the developer's commits */}
      <div className="rounded-[6px] overflow-hidden flex flex-col" style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--c4-border)' }}>
          <span className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>Your commits this week</span>
          <span className="text-[10.5px]" style={{ color: 'var(--c4-text-faint)' }}>{model.count} commits · editable</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="flex-1 w-full p-4 text-[12px] leading-[1.7] outline-none resize-none"
          style={{ backgroundColor: 'transparent', color: 'var(--c4-text-muted)', fontFamily: 'ui-monospace, Menlo, Consolas, monospace', minHeight: 320 }}
        />
        <div className="px-4 py-2 text-[10.5px]" style={{ borderTop: '1px solid var(--c4-border)', color: 'var(--c4-text-subtle)' }}>
          Edit these — the client update on the right updates live.
        </div>
      </div>

      {/* RIGHT — what the client sees */}
      <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
        <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: '1px solid var(--c4-border)' }}>
          <span className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-accent)' }}>What your client sees</span>
          <div className="flex items-center gap-1.5">
            <input value={client} onChange={(e) => setClient(e.target.value)} aria-label="Client name" className="text-[11px] px-2 py-1 w-[72px] outline-none" style={inputStyle} />
            <input value={project} onChange={(e) => setProject(e.target.value)} aria-label="Project name" className="text-[11px] px-2 py-1 w-[110px] outline-none" style={inputStyle} />
          </div>
        </div>

        <div className="p-5" style={{ minHeight: 320 }}>
          <p className="text-[13.5px]" style={{ color: 'var(--c4-text)' }}>Hi {client || 'there'},</p>
          {model.isQuiet ? (
            <p className="mt-3 text-[13px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
              This week was mostly behind-the-scenes work ({model.internalCount} tidy-ups, tests and tooling) — nothing visible changed, but the foundations are in good shape.
            </p>
          ) : (
            <>
              <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: 'var(--c4-text-muted)' }}>
                Here’s what got done on {project || 'your project'} this week:
              </p>
              <div className="mt-4 flex flex-col gap-4">
                {sections.map((s) => (
                  <div key={s.key}>
                    <p className="text-[10.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--c4-accent)' }}>{s.title}</p>
                    <ul className="flex flex-col gap-1">
                      {s.items.map((it, i) => (
                        <li key={i} className="flex gap-2 text-[13px] leading-[1.5]" style={{ color: 'var(--c4-text)' }}>
                          <span style={{ color: 'var(--c4-accent)' }}>•</span><span>{it.phrase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {model.buckets.breaking.length > 0 && (
                <p className="mt-4 text-[12px] leading-[1.6]" style={{ color: '#b4452f' }}>
                  Heads-up — {model.buckets.breaking.length} change{model.buckets.breaking.length > 1 ? 's' : ''} may need your attention.
                </p>
              )}
              {model.internalCount > 0 && (
                <p className="mt-4 pt-3 text-[12px] leading-[1.6]" style={{ borderTop: '1px solid var(--c4-border)', color: 'var(--c4-text-subtle)' }}>
                  Plus {model.internalCount} smaller behind-the-scenes {model.internalCount === 1 ? 'improvement' : 'improvements'} (tooling, tests, tidy-ups).
                </p>
              )}
            </>
          )}
          <p className="mt-4 text-[13px]" style={{ color: 'var(--c4-text-muted)' }}>Any questions, just reply.<br />— C4 Studios</p>
        </div>
        <div className="px-4 py-2 text-[10.5px]" style={{ borderTop: '1px solid var(--c4-border)', color: 'var(--c4-text-subtle)' }}>
          Drafted from the commits — jargon, hashes and internal noise stripped. You always review before sending.
        </div>
      </div>
    </div>
  );
}
