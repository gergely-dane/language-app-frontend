import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

import { parseFlashcardResponse } from "../utils";
import type { FlashcardParams } from "./get-flashcard";

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
      parseFlashcardResponse(
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
    onSuccess: (nextFlashcard, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["statistics"] });

      if (flashcardIndex === undefined) {
        return;
      }

      queryClient.setQueryData(
        ["flashcards", variables.response.nextCardQuery, flashcardIndex + 1],
        nextFlashcard,
      );
    },
  });
};
