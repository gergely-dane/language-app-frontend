import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

import type { FlashcardParams } from "../types";
import { parseFlashcardQueue } from "../utils";

interface RespondToFlashcardRequest {
  flashcardId: number;
  response: {
    response: number;
    nextCardQuery: FlashcardParams | null;
  };
}

export const useRespondToFlashcard = (flashcardIndex?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ flashcardId, response }: RespondToFlashcardRequest) =>
      parseFlashcardQueue(
        (
          await apiClient.post<unknown>(
            `/flashcards/${flashcardId}/review`,
            response,
          )
        ).data,
      ),
    onError: (error) => {
      console.error("Failed to respond to flashcard:", error);
    },
    onSuccess: (nextQueue, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["statistics"] });

      if (flashcardIndex === undefined) {
        return;
      }

      queryClient.setQueryData(
        ["flashcards", variables.response.nextCardQuery, flashcardIndex + 1],
        nextQueue,
      );
    },
  });
};
