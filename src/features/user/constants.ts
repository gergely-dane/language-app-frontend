export const TIME_PERIODS = [
  { value: "30", label: "timePeriod.30d" },
  { value: "90", label: "timePeriod.90d", className: "hidden md:inline-flex" },
  {
    value: "180",
    label: "timePeriod.180d",
    className: "inline-flex md:hidden",
  },
  { value: "365", label: "timePeriod.1y", className: "hidden md:inline-flex" },
] as const;

export const CELL_SIZE = 12;
export const CELL_GAP = 3;
export const TOTAL_CELL = CELL_SIZE + CELL_GAP;
export const WEEKS = 53;
export const DAYS_IN_WEEK = 7;
