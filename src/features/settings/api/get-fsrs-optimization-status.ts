import { queryOptions, useQuery } from "@tanstack/react-query";

import { type FsrsOptimizationStatus } from "@/features/settings/interfaces/fsrs-optimization.interface";
import { isFsrsOptimizationInProgress } from "@/features/settings/utils";
import { apiClient } from "@/lib/api-client";

export const fsrsOptimizationStatusQueryKey = ["fsrs-optimization-status"];

export const getFsrsOptimizationStatusQueryOptions = () =>
  queryOptions({
    queryKey: fsrsOptimizationStatusQueryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<FsrsOptimizationStatus>(
        "/users/me/fsrs-optimization-status",
      );
      return data;
    },
    refetchInterval: (query) =>
      isFsrsOptimizationInProgress(query.state.data) ? 5000 : false,
  });

export const useGetFsrsOptimizationStatus = () =>
  useQuery(getFsrsOptimizationStatusQueryOptions());
