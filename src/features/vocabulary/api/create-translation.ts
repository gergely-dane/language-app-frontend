import { UpdateTranslationRequest } from "@/features/vocabulary/api/update-translation";
import { Translation } from "@/interfaces/translation.interface";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateTranslationRequest extends UpdateTranslationRequest {
  knowledgeLevel: number;
}

export const useCreateTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTranslation: CreateTranslationRequest) => {
      const { data } = await apiClient.post<Translation>(
        "/translations",
        newTranslation,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      queryClient.invalidateQueries({ queryKey: ["language-pairs"] });
    },
    onError: (error) => {
      console.error("Failed to create translation:", error);
    },
  });
};
