/*
 * Prices in the instrument face.
 *
 * B612 Mono gives every glyph the same 0.65em cell, the comma included. Its
 * ink sits at the left of that cell (0.07em to 0.23em at 400, 0.05em to
 * 0.25em at 700, measured in Chromium on 15 Oct 2026), so it trails a hole
 * about as wide as a space and "$1,500" reads as "$1, 500". `tightFigure`
 * wraps each comma in a span that marks.css pulls in (`.c4-comma`), leaving
 * the comma about as close to its digits as a proportional face would.
 *
 * Use it wherever a price is set in B612. The string itself never changes:
 * copy, aria labels and clipboard text keep the plain figure.
 *
 * The logo and SEO pages tuned their own margins for their display sizes
 * before this existed; they pass their class names and keep them.
 */
export function tightFigure(figure, commaClass = 'c4-comma') {
  const text = String(figure ?? '');
  if (!text.includes(',')) return text;
  return text.split(',').map((part, i) => (
    i === 0 ? part : <span key={i}><span className={commaClass}>,</span>{part}</span>
  ));
}

/* Whole dollars, Australian grouping: 1500 -> "$1,500". */
export const money = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;
