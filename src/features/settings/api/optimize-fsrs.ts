import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fsrsOptimizationStatusQueryKey } from "@/features/settings/api/get-fsrs-optimization-status";
import { type FsrsOptimizationStatus } from "@/features/settings/interfaces/fsrs-optimization.interface";
import { apiClient } from "@/lib/api-client";

export const useOptimizeFsrs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<FsrsOptimizationStatus>(
        "/users/me/optimize-fsrs",
      );
      return data;
    },
    onSuccess: (status) => {
      queryClient.setQueryData(fsrsOptimizationStatusQueryKey, status);
      void queryClient.invalidateQueries({
        queryKey: fsrsOptimizationStatusQueryKey,
      });
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: fsrsOptimizationStatusQueryKey,
      });
    },
  });
};
