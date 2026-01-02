import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      queryClient.invalidateQueries({
        queryKey: ["flashcards"],
      });
    },
    onError: (error) => {
      console.error("Failed to respond to flashcard:", error);
    },
  });
};
