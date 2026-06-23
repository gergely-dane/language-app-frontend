import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import { apiClient } from "@/lib/api-client";

import type { Flashcard } from "../interfaces/flashcard.interface";

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
        await apiClient.post<Flashcard>(
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
