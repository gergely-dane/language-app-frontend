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
    queryKey: ["flashcards", params, index],
    queryFn: () => getFlashcardQueue(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
};
