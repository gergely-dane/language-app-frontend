import { useQuery } from "@tanstack/react-query";

import { type LanguagePair } from "@/features/languages/types";
import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";

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

export const useFlashcard = (params?: FlashcardParams | null, index?: number) =>
  useQuery({
    queryKey: ["flashcards", params, index],
    queryFn: () => getFlashcard(params),
    staleTime: 0,
    refetchOnMount: "always",
  });

export const prefetchFlashcard = (
  params?: FlashcardParams | null,
  index?: number,
) =>
  queryClient.prefetchQuery({
    queryKey: ["flashcards", params, index],
    queryFn: () => getFlashcard(params),
  });
