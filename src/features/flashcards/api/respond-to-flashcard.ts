import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

interface RespondToFlashcardRequest {
  flashcardId: number;
  response: {
    knewIt: boolean;
  };
}

export const useRespondToFlashcard = () =>
  useMutation({
    mutationFn: async ({
      flashcardId,
      response,
    }: RespondToFlashcardRequest) => {
      await apiClient.post(`/flashcards/${flashcardId}/respond`, response);
    },
    onError: (error) => {
      console.error("Failed to respond to flashcard:", error);
    },
  });
