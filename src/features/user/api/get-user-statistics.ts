import { UserStatistics } from "@/interfaces/user-statistics.interface";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface GetUserStatisticsParams {
  previousDays: number;
}

export const useUserStatistics = (params: GetUserStatisticsParams) => {
  return useQuery({
    queryKey: ["statistics", params],
    queryFn: async () => {
      const { data } = await apiClient.get<UserStatistics>("/users/me/stats", {
        params,
      });
      return data;
    },
  });
};
