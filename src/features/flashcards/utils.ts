import type { z } from "zod";

import { FLASHCARD_FILTERS_STATE_STORAGE_KEY } from "./constants";
import type { Direction, Flashcard } from "./types";
import { flashcardParamsSchema, flashcardSchema } from "./types";

export const parseFlashcardResponse = (data: unknown): Flashcard | null =>
  data ? flashcardSchema.parse(data) : null;

export const getStoredFlashcardFilters = (): z.infer<
  typeof flashcardParamsSchema
> | null => {
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

export const storeFlashcardFilters = (
  params: z.infer<typeof flashcardParamsSchema>,
) => {
  try {
    window.localStorage.setItem(
      FLASHCARD_FILTERS_STATE_STORAGE_KEY,
      JSON.stringify(params),
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
