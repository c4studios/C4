/**
 * HowItWorks — the "how you actually use it" sequence for the product
 * datasheet, rendered as a ruled register list. The step numbers are a REAL
 * ordered sequence (allowed numbering, not a section-kicker scaffold).
 *
 * No motion library: each step carries `data-reveal`, so it ships fully
 * visible and is enhanced by the register's one-shot reveal only in a real
 * interactive browser (prerender / reduced-motion render the finished list).
 * The caller owns the section heading; this renders just the ordered list.
 */
import React from 'react';

export default function HowItWorks({ steps }) {
  if (!steps?.length) return null;

  return (
    <ol className="sw-steps">
      {steps.map((step) => (
        <li className="sw-step" key={step.step} data-reveal>
          <span className="sw-step-no">{step.step}</span>
          <div className="sw-step-body">
            <h3 className="sw-h3">{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
