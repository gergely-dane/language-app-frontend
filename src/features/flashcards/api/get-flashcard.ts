import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { type LanguagePair } from "@/features/languages/types";
import { apiClient } from "@/lib/api-client";

import { parseFlashcardResponse } from "../utils";

export interface FlashcardParams extends Partial<LanguagePair> {
  isReverse?: boolean;
}

const getFlashcard = async (params?: FlashcardParams | null) => {
  const { data } = await apiClient.get<unknown>("/flashcards/next", {
    params,
  });
  return parseFlashcardResponse(data);
};

export const useFlashcard = (
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
    queryFn: () => getFlashcard(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
};
