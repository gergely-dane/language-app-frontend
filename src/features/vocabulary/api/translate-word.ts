import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { apiClient } from "@/lib/api-client";

interface TranslateWordRequest {
  word: string;
  sourceLanguageId: number;
  targetLanguageId: number;
}

const translateWordResponseSchema = z.object({
  translations: z.array(z.string()),
  sourceLanguageId: z.number(),
  targetLanguageId: z.number(),
});

export const useTranslateWord = () => {
  return useMutation({
    mutationFn: async (request: TranslateWordRequest) => {
      const { data } = await apiClient.post<unknown>(
        "/translations/translate",
        request,
      );
      return translateWordResponseSchema.parse(data);
    },
  });
};
