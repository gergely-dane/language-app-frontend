export type Direction = "left" | "down" | "right";

export type FlashcardCompHandle = {
  flip: () => void;
  respond: (direction: Direction) => void;
  reset: () => void;
};
