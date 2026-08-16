import { queryOptions, useQuery } from "@tanstack/react-query";

import { fsrsOptimizationStatusSchema } from "@/features/settings/types";
import { isFsrsOptimizationInProgress } from "@/features/settings/utils";
import { apiClient } from "@/lib/api-client";

export const fsrsOptimizationStatusQueryKey = ["fsrs-optimization-status"];

export const getFsrsOptimizationStatusQueryOptions = () =>
  queryOptions({
    queryKey: fsrsOptimizationStatusQueryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<unknown>(
        "/users/me/fsrs-optimization-status",
      );
      return fsrsOptimizationStatusSchema.parse(data);
    },
    refetchInterval: (query) =>
      isFsrsOptimizationInProgress(query.state.data) ? 5000 : false,
  });

export const useGetFsrsOptimizationStatus = () =>
  useQuery(getFsrsOptimizationStatusQueryOptions());
