import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type UpdateTranslationRequest } from "@/features/vocabulary/api/update-translation";
import { translationSchema } from "@/features/vocabulary/types";
import { apiClient } from "@/lib/api-client";

interface CreateTranslationRequest extends UpdateTranslationRequest {
  knowledgeLevel: number;
}

export const useCreateTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTranslation: CreateTranslationRequest) => {
      const { data } = await apiClient.post<unknown>(
        "/translations",
        newTranslation,
      );
      return translationSchema.parse(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["translations"] });
      void queryClient.invalidateQueries({ queryKey: ["language-pairs"] });
      void queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      void queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
    onError: (error) => {
      console.error("Failed to create translation:", error);
    },
  });
};
