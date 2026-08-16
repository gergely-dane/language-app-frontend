import { queryOptions, useQuery } from "@tanstack/react-query";

import { userStatisticsSchema } from "@/features/statistics/types";
import { apiClient } from "@/lib/api-client";

export interface GetUserStatisticsParams {
  previousDays: number;
  languageId?: number;
}

export const getUserStatisticsQueryOptions = (
  params: GetUserStatisticsParams,
) =>
  queryOptions({
    queryKey: ["statistics", params] as const,
    queryFn: async () => {
      const { data } = await apiClient.get<unknown>("/users/me/stats", {
        params,
      });
      return userStatisticsSchema.parse(data);
    },
  });

export const useUserStatistics = (params: GetUserStatisticsParams) =>
  useQuery(getUserStatisticsQueryOptions(params));
