import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

import type { FlashcardParams } from "../types";
import { parseFlashcardQueue } from "../utils";
import { getFlashcardQueueQueryKey } from "./get-flashcard";

interface RespondToFlashcardRequest {
  flashcardId: number;
  flashcardIndex: number;
  response: {
    response: number;
    nextCardQuery: FlashcardParams | null;
  };
}

export const useRespondToFlashcard = () => {
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
      void queryClient.invalidateQueries({ queryKey: ["translations"] });

      queryClient.setQueryData(
        getFlashcardQueueQueryKey(
          variables.response.nextCardQuery,
          variables.flashcardIndex + 1,
        ),
        nextQueue,
      );
    },
  });
};
