import { Translation } from "@/interfaces/translation.interface";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateTranslationRequest {
  word: string;
  translations: string[];
  sourceLanguageCode: string;
  translationLanguageCode: string;
  definition?: string;
}

export const useUpdateTranslation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedTranslation: UpdateTranslationRequest) => {
      const { data } = await apiClient.put<Translation>(
        `/translations/${id}`,
        updatedTranslation,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      queryClient.invalidateQueries({ queryKey: ["language-pairs"] });
    },
  });
};
