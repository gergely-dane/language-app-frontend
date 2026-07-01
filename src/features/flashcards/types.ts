export type Direction = "left" | "down" | "right" | "up";

export type FlashcardCompHandle = {
  flip: () => void;
  respond: (direction: Direction) => void;
  reset: () => void;
};
