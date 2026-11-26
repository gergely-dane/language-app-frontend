export const FSRS_OPTIMIZATION_STATE = {
  NeverRun: 0,
  Pending: 1,
  Running: 2,
  Completed: 3,
  Failed: 4,
} as const;

export const CARD_SHUFFLE_POOL_SIZE_MIN = 2;

export const CARD_SHUFFLE_POOL_SIZE_MAX = 25;

export const CARD_SHUFFLE_POOL_SIZE_SAVE_DELAY_MS = 600;

export type FsrsOptimizationState =
  (typeof FSRS_OPTIMIZATION_STATE)[keyof typeof FSRS_OPTIMIZATION_STATE];
