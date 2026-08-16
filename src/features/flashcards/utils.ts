import type { Direction, Flashcard } from "./types";
import { flashcardSchema } from "./types";

export const parseFlashcardResponse = (data: unknown): Flashcard | null =>
  data ? flashcardSchema.parse(data) : null;

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
