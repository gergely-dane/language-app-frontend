import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Translation,
  TranslationsParams,
  TranslationsResponse,
} from "@/hooks/use-translations";

export interface Flashcard {
  createdAt: Date;
  translation: Translation;
  score: number;
}

export interface FlashcardParams {
  sourceLanguageCode: string;
  translationLanguageCode: string;
}

export interface FlashcardResponse extends Flashcard {}

export const useFlashcard = (params?: FlashcardParams) => {
  return useQuery({
    queryKey: ["flashcards", params],
    queryFn: async () => {
      const { data } = await apiClient.get<FlashcardResponse>("/flashcards", {
        params,
      });
      return data;
    },
  });
};
