import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { apiClient } from "@/lib/api-client";

export interface UpdateTranslationRequest {
  word: string;
  translations: string[];
  sourceLanguageId: number;
  translationLanguageId: number;
  definition?: string;
}

export const useUpdateTranslation = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedTranslation: UpdateTranslationRequest) => {
      const { data } = await apiClient.put<Translation>(
        `/translations/${id}`,
        updatedTranslation,
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["translations"] });
      void queryClient.invalidateQueries({ queryKey: ["language-pairs"] });
      void queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    },
  });
};
