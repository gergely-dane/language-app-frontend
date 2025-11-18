import { Flashcard } from "@/interfaces/flashcard.interface";
import { LanguagePair } from "@/interfaces/language-pair.interface";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useFlashcard = (params?: LanguagePair | null) => {
  return useQuery({
    queryKey: ["flashcards", params],
    queryFn: async () => {
      const { data } = await apiClient.get<Flashcard>("/flashcards", {
        params,
      });
      return data;
    },
  });
};
