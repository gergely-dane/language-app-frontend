import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

import type { FlashcardParams } from "../types";
import { parseFlashcardQueue } from "../utils";
import { getFlashcardQueueQueryKey } from "./get-flashcard";

interface UndoFlashcardReviewRequest {
  flashcardId: number;
  flashcardIndex: number;
  request: {
    nextCardQuery: FlashcardParams | null;
  };
}

export const useUndoFlashcardReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ flashcardId, request }: UndoFlashcardReviewRequest) =>
      parseFlashcardQueue(
        (
          await apiClient.post<unknown>(
            `/flashcards/${flashcardId}/undo-review`,
            request,
          )
        ).data,
      ),
    onError: (error) => {
      console.error("Failed to undo flashcard review:", error);
    },
    onSuccess: (queue, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["statistics"] });
      void queryClient.invalidateQueries({ queryKey: ["translations"] });

      queryClient.setQueryData(
        getFlashcardQueueQueryKey(
          variables.request.nextCardQuery,
          variables.flashcardIndex + 1,
        ),
        queue,
      );
    },
  });
};
