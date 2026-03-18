import {
  C4_WORDMARK_ITALIC_GROUP_OFFSET,
  C4_WORDMARK_LETTERS,
  C4_WORDMARK_HINGE_ORIGINS,
  C4_WORDMARK_ITALIC_PATHS,
  C4_WORDMARK_UPRIGHT_PATHS,
  RAW_C4_WORDMARK_MORPH_PAIRS,
} from './c4WordmarkMorphSource.js';
import { C4_WORDMARK_NORMALIZED_PAIRS } from './c4WordmarkMorphNormalized.js';

export {
  C4_WORDMARK_ITALIC_GROUP_OFFSET,
  C4_WORDMARK_LETTERS,
  C4_WORDMARK_HINGE_ORIGINS,
  C4_WORDMARK_ITALIC_PATHS,
  C4_WORDMARK_UPRIGHT_PATHS,
};

export const C4_WORDMARK_MORPH_PAIRS = RAW_C4_WORDMARK_MORPH_PAIRS.map((pair) => {
  const normalized = C4_WORDMARK_NORMALIZED_PAIRS[pair.morphPrep.normalizedPairId] || {
    status: pair.morphPrep.status,
    normalizedPaths: null,
    normalization: null,
    blockingReason: null,
  };

  return {
    ...pair,
    raw: {
      uprightPath: pair.uprightPath,
      italicPath: pair.italicPath,
      italicGroupOffset: C4_WORDMARK_ITALIC_GROUP_OFFSET,
    },
    normalized,
    readinessStatus: normalized.status,
  };
});
