export const FSRS_OPTIMIZATION_STATE = {
  NeverRun: 0,
  Pending: 1,
  Running: 2,
  Completed: 3,
  Failed: 4,
} as const;

export type FsrsOptimizationState =
  (typeof FSRS_OPTIMIZATION_STATE)[keyof typeof FSRS_OPTIMIZATION_STATE];
