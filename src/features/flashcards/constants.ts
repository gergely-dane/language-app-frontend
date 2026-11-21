import { IconCheck, IconHelp, IconStar, IconX } from "@tabler/icons-react";
import type { TargetAndTransition, Transition } from "motion/react";

import type {
  Direction,
  FlashcardRating,
  FlashcardTimeKey,
  PracticeMode,
} from "./types";

export const CARD_TRANSITION = {
  duration: 0.6,
  ease: [0.22, 0.85, 0.1, 1],
} as const satisfies Transition;

export const HOVER_TRANSITION = {
  duration: 0.2,
  ease: "easeOut",
} as const satisfies Transition;

export const FADE_TRANSITION = {
  duration: 0.25,
  ease: "easeOut",
} as const satisfies Transition;

export const STACK_COLOR_TRANSITION = `background-color ${CARD_TRANSITION.duration}s cubic-bezier(${CARD_TRANSITION.ease.join(", ")})`;

export const FLASHCARD_STACK_STAGGER = 0.075;

export const FLASHCARD_STACK_DEPTHS: readonly {
  target: TargetAndTransition;
  colorClass: string;
}[] = [
  { target: { y: 0, scaleX: 1 }, colorClass: "bg-primary" },
  {
    target: { y: 8, scaleX: 0.99 },
    colorClass: "bg-[oklch(from_var(--color-primary)_calc(l*1.1)_c_h)]",
  },
  {
    target: { y: 16, scaleX: 0.98 },
    colorClass: "bg-[oklch(from_var(--color-primary)_calc(l*1.2)_c_h)]",
  },
  {
    target: { y: 24, scaleX: 0.97 },
    colorClass: "bg-[oklch(from_var(--color-primary)_calc(l*1.3)_c_h)]",
  },
  {
    target: { y: 32, scaleX: 0.96 },
    colorClass: "bg-[oklch(from_var(--color-primary)_calc(l*1.4)_c_h)]",
  },
];

export const FLASHCARD_STACK_MAX_DEPTH = FLASHCARD_STACK_DEPTHS.length - 1;

export const FLASHCARD_STACK_HIDDEN_TARGET = {
  opacity: 0,
  y: 40,
  scaleX: 0.95,
} as const satisfies TargetAndTransition;

export const FLASHCARD_HOVER_LIFT = -4;

export const FLASHCARD_STACKED_TARGET = {
  opacity: 0,
  scale: 0.99,
  y: 8,
} as const satisfies TargetAndTransition;

export const FLASHCARD_HIDDEN_TARGET = {
  opacity: 0,
} as const satisfies TargetAndTransition;

export const FLASHCARD_DEALT_TARGET = {
  opacity: 1,
  scale: 1,
  x: 0,
  y: 0,
  rotateZ: 0,
} as const satisfies TargetAndTransition;

export const FLASHCARD_EXIT_TARGETS: Record<Direction, TargetAndTransition> = {
  left: { opacity: 0, scale: 0.98, x: -384, y: 16, rotateZ: -5 },
  right: { opacity: 0, scale: 0.98, x: 384, y: 16, rotateZ: 5 },
  down: { opacity: 0, scale: 0.98, y: 184 },
  up: { opacity: 0, scale: 0.98, y: -184 },
};

export const FLASHCARD_KEY_DIRECTIONS: Partial<Record<string, Direction>> = {
  ArrowLeft: "left",
  ArrowDown: "down",
  ArrowRight: "right",
  ArrowUp: "up",
};

export const FLASHCARD_SWIPE_THRESHOLD = 50;

export const MINUTES_IN_DAY = 1440;

export const FLASHCARD_FILTERS_STATE_STORAGE_KEY = "flashcardFiltersState";

export const FLASHCARD_SESSION_STATE_STORAGE_KEY = "flashcardSessionState";

export const FLASHCARD_COLLAPSED_SECTIONS_STORAGE_KEY =
  "flashcardCollapsedSectionsState";

// Keep in sync with the `short` custom variant in globals.css.
export const SHORT_SCREEN_MEDIA_QUERY = "(max-height: 820px)";

export const FLASHCARD_SESSION_IDLE_TIMEOUT_MS = 60 * 60 * 1000;

export const PRACTICE_MODE = {
  Both: 0,
  New: 1,
  Existing: 2,
} as const;

export const DEFAULT_PRACTICE_MODE: PracticeMode = PRACTICE_MODE.Existing;

export const PRACTICE_MODE_OPTIONS = [
  {
    value: PRACTICE_MODE.New,
    label: "practiceModeNew",
    tooltip: "practiceModeNewTooltip",
  },
  {
    value: PRACTICE_MODE.Existing,
    label: "practiceModeExisting",
    tooltip: "practiceModeExistingTooltip",
  },
  {
    value: PRACTICE_MODE.Both,
    label: "practiceModeBoth",
    tooltip: "practiceModeBothTooltip",
  },
] as const;

export const CARD_DIRECTION_OPTIONS = [
  {
    value: false,
    label: "cardDirectionNormal",
    tooltip: "cardDirectionNormalTooltip",
  },
  {
    value: true,
    label: "cardDirectionReverse",
    tooltip: "cardDirectionReverseTooltip",
  },
] as const;

export const FLASHCARD_DIRECTION_RATINGS: Record<Direction, FlashcardRating> = {
  left: 1,
  down: 2,
  right: 3,
  up: 4,
} as const;

export const FLASHCARD_DIRECTIONS: readonly Direction[] = [
  "left",
  "down",
  "right",
  "up",
];

export const FLASHCARD_RATING_META: Record<
  Direction,
  {
    icon: typeof IconX;
    iconClass: string;
    hoverClass: string;
    /* Mobile 2x2 grid: swipe-direction-matching order (up/down top, left/right bottom) */
    mobileOrderClass: string;
    timeKey: FlashcardTimeKey;
    kbd: string;
  }
> = {
  left: {
    icon: IconX,
    iconClass: "text-destructive",
    hoverClass: "hover:bg-destructive/10",
    mobileOrderClass: "max-sm:order-3",
    timeKey: "dontKnowNextReviewMinutes",
    kbd: "◀",
  },
  down: {
    icon: IconHelp,
    iconClass: "text-muted-foreground",
    hoverClass: "hover:bg-muted",
    mobileOrderClass: "max-sm:order-1",
    timeKey: "notSureNextReviewMinutes",
    kbd: "▼",
  },
  right: {
    icon: IconCheck,
    iconClass: "text-success",
    hoverClass: "hover:bg-success/10",
    mobileOrderClass: "max-sm:order-4",
    timeKey: "knowItNextReviewMinutes",
    kbd: "▶",
  },
  up: {
    icon: IconStar,
    iconClass: "text-amber-500",
    hoverClass: "hover:bg-amber-500/10",
    mobileOrderClass: "max-sm:order-2",
    timeKey: "easyNextReviewMinutes",
    kbd: "▲",
  },
};
