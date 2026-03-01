import { useSuspenseQuery } from "@tanstack/react-query";

import { type Flashcard } from "@/interfaces/flashcard.interface";
import { type LanguagePair } from "@/interfaces/language-pair.interface";
import { apiClient } from "@/lib/api-client";

export const useFlashcardSuspense = (params?: LanguagePair | null) =>
  useSuspenseQuery({
    queryKey: ["flashcards", params],
    queryFn: async () => {
      const { data } = await apiClient.get<Flashcard>("/flashcards", {
        params,
      });
      return data;
    },
  });
