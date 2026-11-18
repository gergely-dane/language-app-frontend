import type { LanguagePair } from "@/features/languages/types";

import {
  FLASHCARD_COLLAPSED_SECTIONS_STORAGE_KEY,
  FLASHCARD_FILTERS_STATE_STORAGE_KEY,
  FLASHCARD_STACK_MAX_DEPTH,
  PRACTICE_MODE,
} from "./constants";
import type {
  FlashcardCollapsedSections,
  FlashcardDueCount,
  FlashcardParams,
  FlashcardQueue,
  FlashcardStackState,
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

export const getLanguagePairLeftCounts = (
  dueCounts: FlashcardDueCount[],
  practiceMode: PracticeMode,
): LanguagePair[] =>
  dueCounts.map(({ sourceLanguageId, targetLanguageId, ...counts }) => ({
    sourceLanguageId,
    targetLanguageId,
    count: getRemainingCount(counts, practiceMode),
  }));

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

export const getDealtFlashcardKey = (dealIndex: number, flashcardId: number) =>
  `${dealIndex}-${flashcardId}`;

export const getFlashcardStackDepth = (
  remainingCount: number,
  isAdvancing: boolean,
) =>
  Math.min(
    FLASHCARD_STACK_MAX_DEPTH,
    Math.max(0, remainingCount - (isAdvancing ? 2 : 1)),
  );

export const getFlashcardStackLayers = ({
  drawCount,
  depth,
  isLifted,
}: FlashcardStackState) =>
  Array.from({ length: depth + (isLifted ? 1 : 0) }, (_, index) => {
    const layerDepth = depth - index;

    return { id: drawCount + layerDepth, depth: layerDepth };
  });

export const isEditableTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
