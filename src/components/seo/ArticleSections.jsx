import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Article section renderer.
 *
 * Separate from SeoSections deliberately. That component speaks a
 * landing-page vocabulary — three-column card grids, proof tiles, pricing
 * tables — and an article rendered through it inherits all of it: the three
 * load-bearing claims of an essay become cards, and the reading column runs
 * to ~97 characters because 680px was sized for two-sentence marketing copy.
 *
 * Here every kind renders for sequential reading instead of scanning.
 * Styling lives in article.css so paragraph rhythm and heading spacing can
 * be expressed as relationships rather than per-element utility classes.
 *
 * No section carries an eyebrow. A small uppercase tracked label above every
 * heading is scaffolding, and at 10-11px in --c4-text-subtle it also failed
 * contrast. Headings carry themselves.
 */

/**
 * Inline links, written in content modules as [label](/path).
 *
 * Parsed into real React elements rather than injected as HTML — content
 * modules are data, and data should never reach the DOM as markup.
 *
 * These matter more than they look: contextual links inside the prose pass
 * authority and tell search engines what the page is about, which a footer
 * "related reading" block does far more weakly. The first version of this
 * article referred to "the pricing page" and "the cost guide" in body copy
 * and linked to neither.
 */
const INLINE_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

function inline(text) {
  if (typeof text !== 'string' || !text.includes('](')) return text;
  const out = [];
  let last = 0;
  for (const m of text.matchAll(INLINE_LINK)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, label, href] = m;
    out.push(
      href.startsWith('/')
        ? <Link key={`${href}-${m.index}`} to={href}>{label}</Link>
        : <a key={`${href}-${m.index}`} href={href} target="_blank" rel="noopener">{label}</a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Heading({ children }) {
  return children ? <h2>{children}</h2> : null;
}

function Paras({ body = [] }) {
  return body.map((p, i) => <p key={i}>{inline(p)}</p>);
}

/* The short answer up top. Set larger and in full ink — a standfirst, not a
   callout box with a coloured stripe down its side. */
function Answer({ section }) {
  return (
    <div className="article__answer">
      <Paras body={section.body} />
    </div>
  );
}

function Prose({ section }) {
  return (
    <>
      <Heading>{section.heading}</Heading>
      <Paras body={section.body} />
    </>
  );
}

/* A definition list, because that is what these are: a term and its
   explanation. Bold term over body-size explanation reads correctly in
   running text; the same content as a card grid stops the eye going down
   the page. */
function List({ section }) {
  return (
    <>
      <Heading>{section.heading}</Heading>
      {section.intro && <p>{inline(section.intro)}</p>}
      <dl className="article__list">
        {(section.items || []).map((item, i) => (
          <div key={i}>
            <dt>{item.title}</dt>
            <dd>{item.text}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

/* Real ordinals — these steps are a sequence and the order carries meaning.
   Numbering comes from a CSS counter so the markup stays semantic and the
   numerals can never drift out of step with the content. */
function Process({ section }) {
  return (
    <>
      <Heading>{section.heading}</Heading>
      <ol className="article__steps">
        {(section.steps || []).map((step, i) => (
          <li key={i}>
            <div>
              <b>{step.title}</b>
              <span>{inline(step.text)}</span>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function Quote({ section }) {
  return (
    <figure className="article__quotefig">
      <blockquote className="article__quote">{section.quote}</blockquote>
      {section.attribution && <figcaption>{section.attribution}</figcaption>}
    </figure>
  );
}

function Table({ section }) {
  return (
    <>
      <Heading>{section.heading}</Heading>
      <div className="article__tablewrap">
        <table className="article__table">
          {section.head && (
            <thead>
              <tr>{section.head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr>
            </thead>
          )}
          <tbody>
            {(section.rows || []).map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* Citations are a first-class section, not a footnote. Outbound links are
   rel="noopener" but deliberately NOT nofollow — citing real research is
   exactly the outbound linking search engines want to see. */
function Sources({ section }) {
  const items = section.items || [];
  if (!items.length) return null;
  return (
    <>
      <Heading>{section.heading || 'Sources'}</Heading>
      <ol className="article__sources">
        {items.map((s, i) => (
          <li key={i}>
            <span>
              {s.url
                ? <a href={s.url} target="_blank" rel="noopener">{s.title}</a>
                : s.title}
              {s.publisher && <> — {s.publisher}</>}
              {s.year && <> ({s.year})</>}
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}

const KINDS = {
  answer: Answer,
  prose: Prose,
  list: List,
  process: Process,
  quote: Quote,
  table: Table,
  sources: Sources,
};

export default function ArticleSections({ sections = [] }) {
  return sections.map((section, i) => {
    const Kind = KINDS[section.kind];
    if (!Kind) return null;
    // Quotes break the measure; everything else stays in the reading column.
    const wide = section.kind === 'quote' || section.kind === 'table';
    return (
      <div key={i} className={wide ? 'article__col article__col--wide' : 'article__col'}>
        <Kind section={section} />
      </div>
    );
  });
}
