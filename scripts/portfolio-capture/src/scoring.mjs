import { iou, round } from './utils.mjs';

/**
 * Score a single candidate based on content quality signals.
 */
function scoreCandidate(candidate, config, kind) {
  let score = 0;
  const warnings = [];

  // Positive signals
  if (candidate.label === 'hero') score += 24;
  if (candidate.headingText) score += 18;
  if (candidate.imageCount > 0) score += Math.min(16, candidate.imageCount * 3);
  if (candidate.hasBgImage) score += 6;
  if (candidate.cardCount > 1) score += Math.min(12, candidate.cardCount * 1.5);
  if (candidate.formCount > 0) score += 8;
  if (candidate.textLength > 80 && candidate.textLength < 1200) score += 12;
  if (candidate.viewportCoverage > 0.15 && candidate.viewportCoverage < 1.2) score += 10;
  if (['testimonials', 'portfolio', 'services', 'features', 'pricing'].includes(candidate.label)) score += 10;
  if (candidate.includeHit) score += 14;

  // Negative signals
  if (candidate.label === 'footer') score -= 30;
  if (candidate.whitespaceRisk > 0.95) { score -= 12; warnings.push('high-whitespace-risk'); }
  if (candidate.rect.height > (kind === 'mobile' ? 1800 : 2400)) { score -= 8; warnings.push('tall-section'); }
  if (candidate.rect.height < 200) { score -= 10; warnings.push('short-section'); }
  if (!candidate.headingText && candidate.textLength < 60 && candidate.imageCount < 2) {
    score -= 8; warnings.push('weak-structure');
  }
  if (candidate.textLength > 2400) { score -= 6; warnings.push('text-heavy'); }

  return { ...candidate, score: round(score, 2), warnings };
}

/**
 * Remove candidates that overlap significantly with already-chosen ones.
 * Uses IoU with label-aware thresholds.
 */
function dedupeCandidates(candidates) {
  const chosen = [];
  for (const cand of candidates) {
    const tooSimilar = chosen.some(existing => {
      const sameLabel = existing.label === cand.label;
      const overlap = iou(existing.rect, cand.rect);
      return overlap > 0.65 || (sameLabel && overlap > 0.35);
    });
    if (!tooSimilar) chosen.push(cand);
  }
  return chosen;
}

/**
 * Score, sort, deduplicate, and select the best candidates.
 * Hero is always first if present.
 */
export function scoreAndSelectCandidates(rawCandidates, config, kind) {
  const scored = rawCandidates
    .map(c => scoreCandidate(c, config, kind))
    .sort((a, b) => b.score - a.score);

  // Auto-promote the first large section near the top as hero if none was keyword-detected
  let hero = scored.find(c => c.label === 'hero');
  if (!hero) {
    const topCandidate = scored.find(c =>
      c.rect.y < 400 && c.rect.height > 300 && c.label !== 'footer',
    );
    if (topCandidate) {
      topCandidate.label = 'hero';
      topCandidate.score += 20;
      hero = topCandidate;
    }
  }

  const rest = scored.filter(c => c !== hero);
  const ordered = hero ? [hero, ...rest] : rest;

  const deduped = dedupeCandidates(ordered);
  return deduped.slice(0, config.maxPerDevice);
}
