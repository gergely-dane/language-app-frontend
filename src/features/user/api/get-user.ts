import { queryOptions, useQuery } from "@tanstack/react-query";

import { userSchema } from "@/features/user/types";
import { apiClient } from "@/lib/api-client";

export const getUserQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiClient.get<unknown>("/users/me");
      return userSchema.parse(data);
    },
  });

export const useGetUser = () => useQuery(getUserQueryOptions());
