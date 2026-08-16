import { IconCheck, IconHelp, IconStar, IconX } from "@tabler/icons-react";
import type { Transition } from "motion/react";

import type { Direction, FlashcardRating, FlashcardTimeKey } from "./types";

export const FLIP_TRANSITION = {
  duration: 0.6,
  ease: [0.22, 0.85, 0.1, 1],
} as const satisfies Transition;

export const SWIPE_TRANSITION = {
  duration: 0.55,
  ease: [0.3, 0.85, 0.1, 1],
} as const satisfies Transition;

export const MINUTES_IN_DAY = 1440;

export const FLASHCARD_FILTERS_STATE_STORAGE_KEY = "flashcardFiltersState";

export const FLASHCARD_SESSION_STATE_STORAGE_KEY = "flashcardSessionState";

export const FLASHCARD_SESSION_DURATION_MS = 60 * 60 * 1000;

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
