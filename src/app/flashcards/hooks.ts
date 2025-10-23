import { Translation } from "@/app/vocabulary/hooks";
import { LanguagePair } from "@/hooks/languages-hooks";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Flashcard {
  id: number;
  createdAt: Date;
  translation: Translation;
  score: number;
}

export interface RespondToFlashcardRequest {
  flashcardId: number;
  response: {
    knewIt: boolean;
  };
}

export interface FlashcardResponse extends Flashcard {}

export const useFlashcard = (params?: LanguagePair) => {
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

export const useRespondToFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      flashcardId,
      response,
    }: RespondToFlashcardRequest) => {
      await apiClient.post(`/flashcards/${flashcardId}/respond`, response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    },
    onError: (error) => {
      console.error("Failed to respond to flashcard:", error);
    },
  });
};
