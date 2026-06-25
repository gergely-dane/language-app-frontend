import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import { apiClient } from "@/lib/api-client";

import type { Flashcard } from "../interfaces/flashcard.interface";

interface RespondToFlashcardRequest {
  flashcardId: number;
  response: {
    response: number;
    nextCardQuery: LanguagePair | null;
  };
}

export const useRespondToFlashcard = (flashcardIndex?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ flashcardId, response }: RespondToFlashcardRequest) =>
      (
        await apiClient.post<Flashcard>(
          `/flashcards/${flashcardId}/review`,
          response,
        )
      ).data,
    onError: (error) => {
      console.error("Failed to respond to flashcard:", error);
    },
    onSuccess: (nextFlashcard, variables) => {
      if (flashcardIndex === undefined) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: [
          "flashcards",
          variables.response.nextCardQuery,
          flashcardIndex,
        ],
      });

      queryClient.setQueryData(
        ["flashcards", variables.response.nextCardQuery, flashcardIndex + 1],
        nextFlashcard,
      );
    },
  });
};
