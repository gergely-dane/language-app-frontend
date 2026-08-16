import { z } from "zod";

import { baseEntitySchema } from "@/types";

export type LanguageFilterValue = {
  sourceLanguageId: number | null;
  targetLanguageId: number | null;
};

export const languageSchema = baseEntitySchema.extend({
  englishName: z.string(),
  nativeName: z.string(),
  code: z.string(),
});

export const languagePairSchema = z.object({
  sourceLanguageId: z.number().nullable(),
  targetLanguageId: z.number().nullable(),
  count: z.number(),
});

export type Language = z.infer<typeof languageSchema>;

export type LanguagePair = z.infer<typeof languagePairSchema>;
