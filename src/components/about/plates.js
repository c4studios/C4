/*
 * Geometry of the bench's paper, shared by scripts/bench-plates.mjs (which
 * draws the rasters) and src/pages/About.jsx (which sets type on them), so
 * the notebook's words sit on its ruling and every page's text box fits its
 * sheet. Units are world pixels; the rasters are drawn at SCALE times that.
 */

export const NOTEBOOK = {
  w: 1040,
  h: 700,
  cover: 11, // the cover's edge showing round the pages
  fold: 520, // the spine, from the left edge
  ruleTop: 128, // the first rule
  pitch: 44, // rule to rule
  ruleEnd: 40, // no rule closer than this to the bottom edge
  scale: 1.25,
  file: '/bench/notebook-spread.jpg',
};

export const CARD = {
  w: 460,
  h: 600,
  scale: 1.25,
  file: '/bench/card-stock.jpg',
};

export const SHEET = {
  w: 880,
  h: 1250,
  folds: [0.34, 0.67], // letter-folded once it was printed
  scale: 1.25,
  file: '/bench/run-sheet.jpg',
};

export const BIBLE = {
  w: 1600,
  h: 1180,
  cover: 13,
  fold: 800,
  scale: 1.2,
  file: '/bench/bible-spread.jpg',
};
