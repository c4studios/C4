import React from 'react';

/**
 * C4iWordmark — the C4i brand mark as inline text.
 *
 * Always italic (the lean lets the 4 read closer to an A, so the mark
 * says "CAi") and always its own case: `normal-case` survives uppercase
 * containers (eyebrows, buttons) so the lowercase i is never flattened
 * to "C4I". Use this everywhere the brand name appears in UI text;
 * plain-string contexts (meta tags, JSON-LD, form payloads) keep "C4i".
 */
export default function C4iWordmark({ className = '' }) {
  return <span className={`italic normal-case ${className}`.trim()}>C4i</span>;
}
