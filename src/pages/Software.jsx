import React from 'react';

export default function Software() {
  return (
    <main className="py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <span
          className="text-[10px] uppercase tracking-[0.25em] font-medium"
          style={{ color: 'var(--c4-text-subtle)' }}
        >
          Software
        </span>
        <h1
          className="mt-3 text-[1.6rem] font-semibold tracking-[-0.035em]
                     leading-[1.1] md:text-[2.2rem]"
          style={{ color: 'var(--c4-text)' }}
        >
          C4 Software Suite
        </h1>
        <p
          className="mt-4 text-[13.5px] leading-[1.65]"
          style={{ color: 'var(--c4-text-muted)' }}
        >
          Pricing and purchase options coming soon.
          Contact caleb@c4studios.com.au for early access.
        </p>
      </div>
    </main>
  );
}
