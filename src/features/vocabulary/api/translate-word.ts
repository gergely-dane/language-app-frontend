import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

interface TranslateWordRequest {
  word: string;
  sourceLanguageId: number;
  targetLanguageId: number;
}

interface TranslateWordResponse {
  translations: string[];
  sourceLanguageId: number;
  targetLanguageId: number;
}

export const useTranslateWord = () => {
  return useMutation({
    mutationFn: async (request: TranslateWordRequest) => {
      const { data } = await apiClient.post<TranslateWordResponse>(
        "/translations/translate",
        request,
      );
      return data;
    },
  });
};
