import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Visual breadcrumb trail for SEO pages. The matching BreadcrumbList
 * JSON-LD is emitted by SeoPage via lib/schema.js — keep the two in sync
 * by passing the same crumbs array to both.
 */
export default function SeoBreadcrumbs({ crumbs = [] }) {
  if (crumbs.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.02em]">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" style={{ color: 'var(--c4-text-faint)' }}>/</span>
              )}
              {isLast ? (
                <span aria-current="page" style={{ color: 'var(--c4-text-muted)' }}>{crumb.name}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="transition-colors duration-300 hover:brightness-125"
                  style={{ color: 'var(--c4-text-subtle)' }}
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
