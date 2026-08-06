import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fsrsOptimizationStatusQueryKey } from "@/features/user/api/get-fsrs-optimization-status";
import { apiClient } from "@/lib/api-client";

export const useResetFsrsWeights = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/users/me/reset-fsrs-weights");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: fsrsOptimizationStatusQueryKey,
      });
      void queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    },
  });
};
