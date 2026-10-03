import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

export const useResetTranslationProgress = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post(`/translations/${id}/reset-progress`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      void queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });
};
