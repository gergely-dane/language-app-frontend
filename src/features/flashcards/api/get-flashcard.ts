import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { apiClient } from "@/lib/api-client";

import type { FlashcardParams } from "../types";
import { parseFlashcardQueue } from "../utils";

const getFlashcardQueue = async (params?: FlashcardParams | null) => {
  const { data } = await apiClient.get<unknown>("/flashcards/next", {
    params,
  });
  return parseFlashcardQueue(data);
};

export const getFlashcardQueueQueryKey = (
  params?: FlashcardParams | null,
  index?: number,
) => ["flashcards", params, index] as const;

export const useFlashcardQueue = (
  params?: FlashcardParams | null,
  index?: number,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (index === undefined) return;

    queryClient.removeQueries({
      queryKey: ["flashcards"],
      predicate: (query) => {
        const queryIndex = query.queryKey[2];
        return typeof queryIndex === "number" && queryIndex < index;
      },
    });
  }, [index, queryClient]);

  return useQuery({
    queryKey: getFlashcardQueueQueryKey(params, index),
    queryFn: () => getFlashcardQueue(params),
    // The next card is seeded by the review response, refetching it would only race that response.
    staleTime: Infinity,
    refetchOnMount: "always",
  });
};
