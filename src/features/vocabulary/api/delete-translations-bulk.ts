import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      queryClient.invalidateQueries({ queryKey: ["language-pairs"] });
    },
    onError: (error) => {
      console.error("Failed to delete translation:", error);
    },
  });
};
