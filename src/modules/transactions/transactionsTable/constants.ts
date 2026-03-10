const ROW_HEIGHT = 48;
const TABLE_MIN_HEIGHT = 400;
/** Min height for loading/error/empty state row so body area is consistent (§5.1) */
const STATE_ROW_MIN_HEIGHT = TABLE_MIN_HEIGHT - ROW_HEIGHT;
const COLUMN_SIZES = [200, 100, 120, 140, 140, 80] as const;
const TABLE_WIDTH = COLUMN_SIZES.reduce((a, b) => a + b, 0);
/** Proportional columns so header and body fill 100% and stay aligned */
const GRID_TEMPLATE_FR = COLUMN_SIZES.map((s) => `${s}fr`).join(' ');

export {
  ROW_HEIGHT,
  TABLE_MIN_HEIGHT,
  STATE_ROW_MIN_HEIGHT,
  COLUMN_SIZES,
  TABLE_WIDTH,
  GRID_TEMPLATE_FR,
};
