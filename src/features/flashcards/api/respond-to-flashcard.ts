import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

interface RespondToFlashcardRequest {
  translationId: number;
  response: {
    response: number;
  };
}

export const useRespondToFlashcard = () =>
  useMutation({
    mutationFn: async ({
      translationId,
      response,
    }: RespondToFlashcardRequest) => {
      await apiClient.post(`/translations/${translationId}/review`, response);
    },
    onError: (error) => {
      console.error("Failed to respond to flashcard:", error);
    },
  });
