export const TIME_PERIODS = [
  { value: "30", label: "timePeriod.30d" },
  { value: "90", label: "timePeriod.90d" },
  { value: "180", label: "timePeriod.180d" },
  { value: "365", label: "timePeriod.1y" },
] as const;

export const CELL_SIZE = 12;
export const CELL_GAP = 3;
export const TOTAL_CELL = CELL_SIZE + CELL_GAP;
export const WEEKS = 53;
export const DAYS_IN_WEEK = 7;
