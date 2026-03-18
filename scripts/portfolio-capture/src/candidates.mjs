import { round, safeLabel } from './utils.mjs';

/**
 * Expanded selector list covering common section patterns.
 */
const SECTION_SELECTORS = [
  'main > section', 'main section', 'section', 'article',
  '[role="main"] > div', 'main > div',
  '.hero, [class*="hero"], [data-testid*="hero"]',
  '.testimonial, [class*="testimonial"]',
  '.gallery, [class*="gallery"]',
  '.services, [class*="services"]',
  '.portfolio, [class*="portfolio"]',
  '.contact, [class*="contact"]',
  '.cta, [class*="cta"]',
  '.about, [class*="about"]',
  '.pricing, [class*="pricing"]',
  '.team, [class*="team"]',
  '.features, [class*="features"]',
  '.faq, [class*="faq"]',
  'div[id]', // many sites use id'd divs as sections
];

/**
 * Label inference map — expanded with more common section types.
 */
const LABEL_PAIRS = [
  ['hero', ['hero', 'welcome', 'banner', 'jumbotron']],
  ['services', ['services', 'service', 'what-we-do', 'offerings']],
  ['testimonials', ['testimonial', 'review', 'client feedback', 'what people say']],
  ['portfolio', ['portfolio', 'project', 'work', 'case stud']],
  ['gallery', ['gallery', 'showcase']],
  ['contact', ['contact', 'enquiry', 'inquiry', 'get in touch']],
  ['about', ['about', 'story', 'who we are', 'our mission']],
  ['cta', ['get started', 'book now', 'start project', 'call to action']],
  ['faq', ['faq', 'questions', 'frequently asked']],
  ['pricing', ['pricing', 'plans', 'packages']],
  ['team', ['team', 'people', 'our team', 'staff']],
  ['features', ['features', 'capabilities', 'what we offer']],
  ['footer', ['footer']],
];

/**
 * Collect candidate sections from the current page DOM.
 * Each candidate includes layout metrics, content stats, and a label.
 * Filtering removes hidden, excluded, tiny, and whitespace-heavy candidates.
 */
export async function collectCandidates(page, config, kind) {
  const candidates = await page.evaluate(({ include, exclude, kind, selectors, labelPairs }) => {
    const nodes = new Set();
    selectors.forEach(selector => {
      try { document.querySelectorAll(selector).forEach(node => nodes.add(node)); } catch { /* invalid selector */ }
    });

    // Fallback if nothing found
    if (!nodes.size) {
      Array.from(document.querySelectorAll('main > *')).forEach(node => nodes.add(node));
    }

    function inferLabel(node, headingText) {
      const haystack = `${node.className || ''} ${node.id || ''} ${headingText || ''}`.toLowerCase();
      for (const [label, keys] of labelPairs) {
        if (keys.some(key => haystack.includes(key))) return label;
      }
      return 'section';
    }

    function sectionMeta(node, index) {
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
      const heading = node.querySelector('h1,h2,h3,h4,h5,h6');
      const headingText = (heading?.textContent || '').replace(/\s+/g, ' ').trim();
      const images = node.querySelectorAll('img, picture, svg').length;
      const buttons = node.querySelectorAll('button, [role="button"], a').length;
      const cards = node.querySelectorAll('[class*="card"], article, li').length;
      const forms = node.querySelectorAll('form, input, textarea, select').length;
      const paragraphs = node.querySelectorAll('p').length;
      const hidden = style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0;
      const hasBgImage = style.backgroundImage && style.backgroundImage !== 'none';

      const viewportArea = window.innerWidth * window.innerHeight;
      const area = Math.max(0, rect.width) * Math.max(0, rect.height);
      const whitespaceRisk = area > 0
        ? Math.max(0, 1 - ((text.length * 2 + images * 4000 + cards * 500 + forms * 800) / area))
        : 1;

      const includeHit = !include.length || include.some(key =>
        `${headingText} ${node.id || ''} ${node.className || ''}`.toLowerCase().includes(key),
      );
      const excludeHit = exclude.some(key =>
        `${headingText} ${node.id || ''} ${node.className || ''}`.toLowerCase().includes(key),
      );

      return {
        id: `cand-${kind}-${index}`,
        selectorHint: node.tagName.toLowerCase(),
        label: inferLabel(node, headingText),
        headingText: headingText.slice(0, 140),
        textPreview: text.slice(0, 220),
        textLength: text.length,
        imageCount: images,
        buttonCount: buttons,
        cardCount: cards,
        formCount: forms,
        paragraphCount: paragraphs,
        hasBgImage,
        area,
        whitespaceRisk,
        includeHit,
        excludeHit,
        hidden,
        rect: {
          x: Math.round(rect.x + window.scrollX),
          y: Math.round(rect.y + window.scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        viewportCoverage: viewportArea > 0 ? area / viewportArea : 0,
      };
    }

    return Array.from(nodes).map(sectionMeta).filter(item => {
      if (item.hidden || item.excludeHit) return false;
      if (item.rect.width < 220 || item.rect.height < 100) return false;
      if (item.rect.y < 0) return false;
      if (item.label === 'section' && item.textLength < 20 && item.imageCount < 1 && item.cardCount < 1) return false;
      if (item.whitespaceRisk > 0.96 && item.imageCount === 0 && item.cardCount === 0 && !item.hasBgImage) return false;
      return true;
    });
  }, {
    include: (config.include || []).map(x => String(x).toLowerCase()),
    exclude: (config.exclude || []).map(x => String(x).toLowerCase()),
    kind,
    selectors: SECTION_SELECTORS,
    labelPairs: LABEL_PAIRS,
  });

  return candidates.map(c => ({
    ...c,
    area: round(c.area, 0),
    whitespaceRisk: round(c.whitespaceRisk, 3),
    viewportCoverage: round(c.viewportCoverage, 3),
    label: safeLabel(c.label, 'section'),
  }));
}
