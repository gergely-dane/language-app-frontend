import { z } from "zod";

import { translationSchema } from "@/features/vocabulary/types";

import { PRACTICE_MODE } from "./constants";

export type Direction = "left" | "down" | "right" | "up";

export type FlashcardRating = 1 | 2 | 3 | 4;

export type FlashcardTimeKey =
  | "dontKnowNextReviewMinutes"
  | "notSureNextReviewMinutes"
  | "knowItNextReviewMinutes"
  | "easyNextReviewMinutes";

export type FlashcardExitDirections = Partial<Record<string, Direction>>;

export const practiceModeSchema = z.enum(PRACTICE_MODE);

export type PracticeMode = z.infer<typeof practiceModeSchema>;

export const flashcardParamsSchema = z.object({
  sourceLanguageId: z.number().nullable().optional(),
  targetLanguageId: z.number().nullable().optional(),
  isReverse: z.boolean().optional(),
  practiceMode: practiceModeSchema.optional(),
});

export type FlashcardParams = z.infer<typeof flashcardParamsSchema>;

export const flashcardSessionStateSchema = z.object({
  lastActivityAt: z.number(),
  history: z.array(
    z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  ),
});

export type FlashcardSessionState = z.infer<typeof flashcardSessionStateSchema>;

export const flashcardCollapsedSectionsSchema = z.object({
  deck: z.boolean().optional(),
  session: z.boolean().optional(),
});

export type FlashcardCollapsedSections = z.infer<
  typeof flashcardCollapsedSectionsSchema
>;

export type FlashcardSection = keyof FlashcardCollapsedSections;

export const flashcardSchema = z.object({
  id: z.number(),
  translation: translationSchema,
  dontKnowNextReviewMinutes: z.number(),
  notSureNextReviewMinutes: z.number(),
  knowItNextReviewMinutes: z.number(),
  easyNextReviewMinutes: z.number(),
});

export type Flashcard = z.infer<typeof flashcardSchema>;

export type DealtFlashcard = {
  key: string;
  flashcard: Flashcard;
  enterDirection?: Direction;
};

export type FlashcardStackState = {
  drawCount: number;
  depth: number;
  isLifted: boolean;
  isSinking: boolean;
};

export const flashcardQueueSchema = z.object({
  flashcard: flashcardSchema.nullable(),
  newCount: z.number(),
  existingCount: z.number(),
});

export type FlashcardQueue = z.infer<typeof flashcardQueueSchema>;

export const flashcardDueCountSchema = z.object({
  sourceLanguageId: z.number().nullable(),
  targetLanguageId: z.number().nullable(),
  newCount: z.number(),
  existingCount: z.number(),
});

export type FlashcardDueCount = z.infer<typeof flashcardDueCountSchema>;
