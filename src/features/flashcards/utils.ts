import {
  FLASHCARD_COLLAPSED_SECTIONS_STORAGE_KEY,
  FLASHCARD_FILTERS_STATE_STORAGE_KEY,
  PRACTICE_MODE,
} from "./constants";
import type {
  Direction,
  FlashcardCollapsedSections,
  FlashcardParams,
  FlashcardQueue,
  PracticeMode,
} from "./types";
import {
  flashcardCollapsedSectionsSchema,
  flashcardParamsSchema,
  flashcardQueueSchema,
} from "./types";

export const parseFlashcardQueue = (data: unknown): FlashcardQueue =>
  flashcardQueueSchema.parse(data);

export const getRemainingCount = (
  counts: Pick<FlashcardQueue, "newCount" | "existingCount">,
  practiceMode: PracticeMode,
) => {
  if (practiceMode === PRACTICE_MODE.New) return counts.newCount;
  if (practiceMode === PRACTICE_MODE.Existing) return counts.existingCount;
  return counts.newCount + counts.existingCount;
};

export const getStoredFlashcardFilters = (): FlashcardParams | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(
      FLASHCARD_FILTERS_STATE_STORAGE_KEY,
    );

    if (!stored) return null;

    const result = flashcardParamsSchema.safeParse(JSON.parse(stored));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const storeFlashcardFilters = (params: FlashcardParams) => {
  try {
    window.localStorage.setItem(
      FLASHCARD_FILTERS_STATE_STORAGE_KEY,
      JSON.stringify(params),
    );
  } catch {
    // storage unavailable
  }
};

export const getStoredCollapsedSections = (): FlashcardCollapsedSections => {
  try {
    const stored = window.localStorage.getItem(
      FLASHCARD_COLLAPSED_SECTIONS_STORAGE_KEY,
    );

    if (!stored) return {};

    const result = flashcardCollapsedSectionsSchema.safeParse(
      JSON.parse(stored),
    );
    return result.success ? result.data : {};
  } catch {
    return {};
  }
};

export const storeCollapsedSections = (
  sections: FlashcardCollapsedSections,
) => {
  try {
    window.localStorage.setItem(
      FLASHCARD_COLLAPSED_SECTIONS_STORAGE_KEY,
      JSON.stringify(sections),
    );
  } catch {
    // storage unavailable
  }
};

export const getCardAnimation = (
  flipped: boolean,
  swipeAnimationDirection: Direction | null,
) => {
  if (swipeAnimationDirection === "left") {
    return {
      opacity: 0,
      rotateY: flipped ? 180 : 0,
      rotateZ: flipped ? 5 : -5,
      scale: 0.98,
      x: -384,
      y: 16,
    };
  }

  if (swipeAnimationDirection === "right") {
    return {
      opacity: 0,
      rotateY: flipped ? 180 : 0,
      rotateZ: flipped ? -5 : 5,
      scale: 0.98,
      x: 384,
      y: 16,
    };
  }

  if (swipeAnimationDirection === "down") {
    return {
      opacity: 0,
      rotateY: flipped ? 180 : 0,
      rotateZ: 0,
      scale: 0.98,
      x: 0,
      y: 184,
    };
  }

  if (swipeAnimationDirection === "up") {
    return {
      opacity: 0,
      rotateY: flipped ? 180 : 0,
      rotateZ: 0,
      scale: 0.98,
      x: 0,
      y: -184,
    };
  }

  return {
    opacity: 1,
    rotateY: flipped ? 180 : 0,
    rotateZ: 0,
    scale: 1,
    x: 0,
    y: 0,
  };
};
