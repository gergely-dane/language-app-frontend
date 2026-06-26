import type { Transition } from "motion/react";

export const FLIP_TRANSITION = {
  duration: 0.85,
  ease: [0.22, 1, 0.36, 1],
} as const satisfies Transition;

export const SWIPE_TRANSITION = {
  duration: 1,
  ease: [0.32, 0.72, 0, 1],
} as const satisfies Transition;

export const MINUTES_IN_DAY = 1440;

export const FLASHCARD_FILTERS_STATE_STORAGE_KEY = "flashcardFiltersState";
