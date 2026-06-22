import React, { useState } from 'react';

/* A representative sample project — the kind of thing Handover scans. */
const SCAN = {
  project: 'Riverside Dental',
  stack: 'Static site · Vite · Tailwind',
  hosting: 'Vercel (under the studio’s account)',
  domain: 'riversidedental.com.au — registrar: Netregistry',
  services: ['Resend — email delivery', 'Stripe — deposit payments', 'Google Fonts'],
  envVars: ['RESEND_API_KEY', 'STRIPE_SECRET_KEY'],
};

const DELIVERABLES = [
  ["Owner’s Manual", 'Plain-English, for a non-technical client (HTML + PDF)'],
  ['Developer Notes', 'Stack, commands, services, outstanding items'],
  ['Handover Checklist', 'Ownership decisions + go-live steps'],
  ['Credentials Ledger', 'Every account, who holds it, what transfers'],
  ['Source archive', 'A clean, verified copy of the code'],
];

const LEDGER = [
  ['Domain — riversidedental.com.au', 'Client', 'The web address itself'],
  ['Hosting — Vercel', 'Studio → transfer', 'Where the site runs'],
  ['Resend — email', 'Confirm + transfer', 'Holds RESEND_API_KEY · most-overlooked'],
  ['Stripe — payments', 'Client', 'Holds the payment keys'],
  ['Email inbox', 'Client', 'Where enquiries land'],
];

export default function HandoverDemo() {
  const [leak, setLeak] = useState(false);

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      {/* LEFT — the scan */}
      <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--c4-border)' }}>
          <span className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-text-subtle)' }}>What Handover scanned</span>
        </div>
        <div className="p-4 flex flex-col gap-3 text-[12.5px]" style={{ color: 'var(--c4-text-muted)' }}>
          {[['Project', SCAN.project], ['Stack', SCAN.stack], ['Hosting', SCAN.hosting], ['Domain', SCAN.domain]].map(([k, v]) => (
            <div key={k}>
              <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--c4-text-faint)' }}>{k}</p>
              <p className="mt-0.5" style={{ color: 'var(--c4-text)' }}>{v}</p>
            </div>
          ))}
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--c4-text-faint)' }}>Services detected</p>
            <ul className="mt-1 flex flex-col gap-0.5">
              {SCAN.services.map((s) => <li key={s}>· {s}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--c4-text-faint)' }}>Secrets (set in hosting, not the code)</p>
            <ul className="mt-1 flex flex-col gap-0.5">
              {SCAN.envVars.map((s) => <li key={s} style={{ fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: 11.5 }}>{s}</li>)}
            </ul>
          </div>
          <label className="mt-1 flex items-center gap-2.5 cursor-pointer select-none rounded-[5px] px-3 py-2.5" style={{ border: `1px solid ${leak ? '#e6c6bd' : 'var(--c4-border)'}`, backgroundColor: leak ? 'rgba(180,69,47,0.06)' : 'var(--c4-bg)' }}>
            <input type="checkbox" checked={leak} onChange={(e) => setLeak(e.target.checked)} />
            <span className="text-[12px]" style={{ color: leak ? '#b4452f' : 'var(--c4-text)' }}>Pretend a live API key got committed to the code</span>
          </label>
        </div>
      </div>

      {/* RIGHT — the generated pack (or the secret-gate block) */}
      <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid var(--c4-border)', backgroundColor: 'var(--c4-card-bg)' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--c4-border)' }}>
          <span className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: 'var(--c4-accent)' }}>What Handover generates</span>
          <span className="text-[10px] uppercase tracking-[0.1em] font-semibold px-2 py-[3px] rounded-full" style={{ color: leak ? 'var(--c4-bg)' : 'var(--c4-accent)', backgroundColor: leak ? '#b4452f' : 'rgba(0,0,0,0.04)', border: leak ? 'none' : '1px solid var(--c4-accent)' }}>
            {leak ? 'Blocked' : 'Pack ready'}
          </span>
        </div>

        {leak ? (
          <div className="p-6 flex flex-col gap-3" style={{ minHeight: 300 }}>
            <p className="text-[13px] font-semibold" style={{ color: '#b4452f' }}>✖ Generation blocked — a live secret is committed</p>
            <p className="text-[13px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
              Handover found a <code style={{ fontFamily: 'ui-monospace, monospace' }}>RESEND_API_KEY</code> hard-coded in a tracked file and refused to build the pack — so a working secret never ships to the client by accident. Remove or rotate it, and the pack generates.
            </p>
            <p className="text-[12px] leading-[1.6] mt-2 pt-3" style={{ borderTop: '1px solid var(--c4-border)', color: 'var(--c4-text-subtle)' }}>
              This gate is the difference between “zip and pray” and a handover you’d put your name on.
            </p>
          </div>
        ) : (
          <div className="p-5 grid gap-5 md:grid-cols-2" style={{ minHeight: 300 }}>
            <div>
              <p className="text-[10.5px] uppercase tracking-[0.13em] font-semibold mb-2.5" style={{ color: 'var(--c4-text-subtle)' }}>The pack</p>
              <ul className="flex flex-col gap-2.5">
                {DELIVERABLES.map(([name, desc]) => (
                  <li key={name} className="flex gap-2.5">
                    <span style={{ color: 'var(--c4-accent)' }}>✓</span>
                    <span>
                      <span className="text-[13px] font-medium" style={{ color: 'var(--c4-text)' }}>{name}</span>
                      <span className="block text-[11.5px] leading-[1.4]" style={{ color: 'var(--c4-text-subtle)' }}>{desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10.5px] uppercase tracking-[0.13em] font-semibold mb-2.5" style={{ color: 'var(--c4-text-subtle)' }}>Credentials ledger</p>
              <div className="rounded-[5px] overflow-hidden" style={{ border: '1px solid var(--c4-border)' }}>
                {LEDGER.map(([acct, who, note], i) => (
                  <div key={acct} className="px-3 py-2" style={{ borderTop: i ? '1px solid var(--c4-border)' : 'none', backgroundColor: 'var(--c4-bg)' }}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11.5px] font-medium truncate" style={{ color: 'var(--c4-text)' }}>{acct}</span>
                      <span className="text-[9.5px] uppercase tracking-[0.05em] shrink-0 px-1.5 py-[2px] rounded-[3px]" style={{ color: 'var(--c4-text-subtle)', backgroundColor: 'rgba(0,0,0,0.04)' }}>{who}</span>
                    </div>
                    <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--c4-text-subtle)' }}>{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="px-4 py-2 text-[10.5px]" style={{ borderTop: '1px solid var(--c4-border)', color: 'var(--c4-text-subtle)' }}>
          A preview of a generated pack. The real tool runs on any git repo and writes the manual, notes, ledger and a verified zip.
        </div>
      </div>
    </div>
  );
}
