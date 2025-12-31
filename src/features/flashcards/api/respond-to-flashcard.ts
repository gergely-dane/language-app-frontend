import { LanguagePair } from "@/interfaces/language-pair.interface";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RespondToFlashcardRequest {
  flashcardId: number;
  response: {
    knewIt: boolean;
  };
}

export const useRespondToFlashcard = (
  paramsToInvalidate?: LanguagePair | null,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      flashcardId,
      response,
    }: RespondToFlashcardRequest) => {
      await apiClient.post(`/flashcards/${flashcardId}/respond`, response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "flashcards",
          paramsToInvalidate ? paramsToInvalidate : null,
        ],
      });
    },
    onError: (error) => {
      console.error("Failed to respond to flashcard:", error);
    },
  });
};
