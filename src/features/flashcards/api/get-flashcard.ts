import { Flashcard } from "@/interfaces/flashcard.interface";
import { LanguagePair } from "@/interfaces/language-pair.interface";
import { apiClient } from "@/lib/api-client";
import { useSuspenseQuery } from "@tanstack/react-query";

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
