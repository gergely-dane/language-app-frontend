import { useQuery } from "@tanstack/react-query";

import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";

import type { Flashcard } from "../interfaces/flashcard.interface";
export interface FlashcardParams extends Partial<LanguagePair> {
  isReverse?: boolean;
}

const getFlashcard = async (params?: FlashcardParams | null) => {
  const { data } = await apiClient.get<Flashcard>("/flashcards/next", {
    params,
  });
  return data;
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
