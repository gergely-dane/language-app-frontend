import { z } from "zod";

import type {
  EXPORT_FORMAT,
  EXPORT_SCOPE,
} from "@/features/vocabulary/constants";
import { baseEntitySchema } from "@/types";

export const wordSchema = z.object({
  id: z.number(),
  word: z.string(),
});

export const storedLanguageIdSchema = z.coerce.number().int().positive();

export const translationSchema = baseEntitySchema.extend({
  words: z.array(wordSchema),
  translations: z.array(wordSchema),
  sourceLanguageId: z.number(),
  targetLanguageId: z.number(),
  definition: z.string().nullish(),
});

export const translationListItemSchema = translationSchema.extend({
  nextReviewDate: z.string().nullish(),
  reverseNextReviewDate: z.string().nullish(),
});

export type Word = z.infer<typeof wordSchema>;

export type Translation = z.infer<typeof translationSchema>;

export type TranslationListItem = z.infer<typeof translationListItemSchema>;

export type ExportFormat = (typeof EXPORT_FORMAT)[keyof typeof EXPORT_FORMAT];

export type ExportScope = (typeof EXPORT_SCOPE)[keyof typeof EXPORT_SCOPE];

export type ExportFilter = {
  search: string;
  sourceLanguageId: number | null;
  targetLanguageId: number | null;
};
