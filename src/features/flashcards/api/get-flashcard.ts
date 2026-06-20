import { useQuery } from "@tanstack/react-query";

import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";

const getFlashcard = async (params?: LanguagePair | null) => {
  const { data } = await apiClient.get<Translation>(
    "/translations/next-review",
    {
      params,
    },
  );
  return data;
};

export const useFlashcard = (params?: LanguagePair | null, index?: number) =>
  useQuery({
    queryKey: ["flashcards", params, index],
    queryFn: () => getFlashcard(params),
  });

export const prefetchFlashcard = (
  params?: LanguagePair | null,
  index?: number,
) =>
  queryClient.prefetchQuery({
    queryKey: ["flashcards", params, index],
    queryFn: () => getFlashcard(params),
  });
