import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

interface RespondToFlashcardRequest {
  flashcardId: number;
  response: {
    knewIt: boolean;
  };
}

export const useRespondToFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      flashcardId,
      response,
    }: RespondToFlashcardRequest) => {
      await apiClient.post(`/flashcards/${flashcardId}/respond`, response);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["flashcards"],
      });
    },
    onError: (error) => {
      console.error("Failed to respond to flashcard:", error);
    },
  });
};
