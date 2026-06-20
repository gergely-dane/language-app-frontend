import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { apiClient } from "@/lib/api-client";

interface RespondToFlashcardRequest {
  translationId: number;
  response: {
    response: number;
    nextCardQuery: LanguagePair | null;
  };
}

export const useRespondToFlashcard = (translationIndex?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      translationId,
      response,
    }: RespondToFlashcardRequest) =>
      (
        await apiClient.post<Translation>(
          `/translations/${translationId}/review`,
          response,
        )
      ).data,
    onError: (error) => {
      console.error("Failed to respond to flashcard:", error);
    },
    onSuccess: (nextTranslation, variables) => {
      if (translationIndex === undefined) {
        return;
      }

      queryClient.setQueryData(
        ["flashcards", variables.response.nextCardQuery, translationIndex + 1],
        nextTranslation,
      );
    },
  });
};
