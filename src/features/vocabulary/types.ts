import { z } from "zod";

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

export type Word = z.infer<typeof wordSchema>;

export type Translation = z.infer<typeof translationSchema>;
