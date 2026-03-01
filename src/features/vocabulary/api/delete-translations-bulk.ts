import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

export interface DeleteTranslationsBulkRequest {
  ids: number[];
}

export const useDeleteTranslationsBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: DeleteTranslationsBulkRequest) => {
      await apiClient.post(`/translations/delete-bulk`, body);
      return body;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["translations"] });
      void queryClient.invalidateQueries({ queryKey: ["language-pairs"] });
    },
    onError: (error) => {
      console.error("Failed to delete translation:", error);
    },
  });
};
