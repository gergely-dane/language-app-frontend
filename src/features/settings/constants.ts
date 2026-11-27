export const FSRS_OPTIMIZATION_STATE = {
  NeverRun: 0,
  Pending: 1,
  Running: 2,
  Completed: 3,
  Failed: 4,
} as const;

export const CARD_SHUFFLE_POOL_SIZE_MIN = 2;

export const CARD_SHUFFLE_POOL_SIZE_MAX = 25;

export const FSRS_DESIRED_RETENTION_MIN = 0.8;

export const FSRS_DESIRED_RETENTION_MAX = 0.95;

export const FSRS_DESIRED_RETENTION_STEP = 0.01;

export const FSRS_MAXIMUM_INTERVAL_PRESETS = [
  { days: 30, label: "maximumIntervalPreset1Month" },
  { days: 90, label: "maximumIntervalPreset3Months" },
  { days: 180, label: "maximumIntervalPreset6Months" },
  { days: 365, label: "maximumIntervalPreset1Year" },
  { days: 730, label: "maximumIntervalPreset2Years" },
  { days: 1825, label: "maximumIntervalPreset5Years" },
  { days: 3650, label: "maximumIntervalPreset10Years" },
] as const;

export const TTS_SPEAKING_RATE_MIN = 0.5;

export const TTS_SPEAKING_RATE_MAX = 1.5;

export const TTS_SPEAKING_RATE_STEP = 0.05;

export const USER_SETTING_SLIDER_SAVE_DELAY_MS = 600;

export type FsrsOptimizationState =
  (typeof FSRS_OPTIMIZATION_STATE)[keyof typeof FSRS_OPTIMIZATION_STATE];
