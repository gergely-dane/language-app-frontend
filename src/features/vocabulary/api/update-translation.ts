import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type { Flashcard } from "@/features/flashcards/interfaces/flashcard.interface";
import { type Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { apiClient } from "@/lib/api-client";

export interface UpdateTranslationRequest {
  word: string;
  translations: string[];
  sourceLanguageId: number;
  targetLanguageId: number;
  definition?: string;
}

type UseUpdateTranslationOptions = {
  flashcardQueryKey?: QueryKey;
};

export const useUpdateTranslation = (
  id?: number,
  options: UseUpdateTranslationOptions = {},
) => {
  const queryClient = useQueryClient();
  const { flashcardQueryKey } = options;

  return useMutation({
    mutationFn: async (updatedTranslation: UpdateTranslationRequest) => {
      const { data } = await apiClient.put<Translation>(
        `/translations/${id}`,
        updatedTranslation,
      );
      return data;
    },
    onSuccess: (updatedTranslation) => {
      void queryClient.invalidateQueries({ queryKey: ["translations"] });
      void queryClient.invalidateQueries({ queryKey: ["language-pairs"] });

      if (flashcardQueryKey) {
        queryClient.setQueryData<Flashcard>(flashcardQueryKey, (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            translation: updatedTranslation,
          };
        });
      } else {
        void queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      }
    },
  });
};
