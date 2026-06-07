import { useQuery } from "@tanstack/react-query";

import { type UserStatistics } from "@/features/user/interfaces/user-statistics.interface";
import { apiClient } from "@/lib/api-client";

interface GetUserStatisticsParams {
  previousDays: number;
}

export const useUserStatistics = (params: GetUserStatisticsParams) =>
  useQuery({
    queryKey: ["statistics", params],
    queryFn: async () => {
      const { data } = await apiClient.get<UserStatistics>("/users/me/stats", {
        params,
      });
      return data;
    },
  });
