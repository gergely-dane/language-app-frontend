import { z } from "zod";

export type Direction = "left" | "down" | "right" | "up";

export type FlashcardCompHandle = {
  flip: () => void;
  respond: (direction: Direction) => void;
  reset: () => void;
};

export const flashcardParamsSchema = z.object({
  sourceLanguageId: z.number().nullable().optional(),
  targetLanguageId: z.number().nullable().optional(),
  isReverse: z.boolean().optional(),
});
