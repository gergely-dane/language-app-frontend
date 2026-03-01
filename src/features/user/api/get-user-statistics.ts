import { useSuspenseQuery } from "@tanstack/react-query";

import { type UserStatistics } from "@/interfaces/user-statistics.interface";
import { apiClient } from "@/lib/api-client";

interface GetUserStatisticsParams {
  previousDays: number;
}

export const useUserStatisticsSuspense = (params: GetUserStatisticsParams) =>
  useSuspenseQuery({
    queryKey: ["statistics", params],
    queryFn: async () => {
      const { data } = await apiClient.get<UserStatistics>("/users/me/stats", {
        params,
      });
      return data;
    },
  });
