import { z } from "zod";

import { translationSchema } from "@/features/vocabulary/types";

export type Direction = "left" | "down" | "right" | "up";

export type FlashcardRating = 1 | 2 | 3 | 4;

export type FlashcardTimeKey =
  | "dontKnowNextReviewMinutes"
  | "notSureNextReviewMinutes"
  | "knowItNextReviewMinutes"
  | "easyNextReviewMinutes";

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

export const flashcardSessionStateSchema = z.object({
  startedAt: z.number(),
  history: z.array(
    z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  ),
});

export type FlashcardSessionState = z.infer<typeof flashcardSessionStateSchema>;

export const flashcardSchema = z.object({
  id: z.number(),
  translation: translationSchema,
  dontKnowNextReviewMinutes: z.number(),
  notSureNextReviewMinutes: z.number(),
  knowItNextReviewMinutes: z.number(),
  easyNextReviewMinutes: z.number(),
  remainingCount: z.number(),
});

export type Flashcard = z.infer<typeof flashcardSchema>;
