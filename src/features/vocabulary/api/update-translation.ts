import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type { FlashcardQueue } from "@/features/flashcards/types";
import { translationSchema } from "@/features/vocabulary/types";
import { apiClient } from "@/lib/api-client";

export interface UpdateTranslationRequest {
  words: string[];
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
      const { data } = await apiClient.put<unknown>(
        `/translations/${id}`,
        updatedTranslation,
      );
      return translationSchema.parse(data);
    },
    onSuccess: (updatedTranslation) => {
      void queryClient.invalidateQueries({ queryKey: ["translations"] });
      void queryClient.invalidateQueries({ queryKey: ["language-pairs"] });
      void queryClient.invalidateQueries({ queryKey: ["statistics"] });

      if (flashcardQueryKey) {
        queryClient.setQueryData<FlashcardQueue>(
          flashcardQueryKey,
          (oldData) => {
            if (!oldData?.flashcard) return oldData;

            return {
              ...oldData,
              flashcard: {
                ...oldData.flashcard,
                translation: updatedTranslation,
              },
            };
          },
        );
      } else {
        void queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      }
    },
  });
};
