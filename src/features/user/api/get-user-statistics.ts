import { queryOptions, useQuery } from "@tanstack/react-query";

import { type UserStatistics } from "@/features/user/interfaces/user-statistics.interface";
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
      const { data } = await apiClient.get<UserStatistics>("/users/me/stats", {
        params,
      });
      return data;
    },
  });

export const useUserStatistics = (params: GetUserStatisticsParams) =>
  useQuery(getUserStatisticsQueryOptions(params));
