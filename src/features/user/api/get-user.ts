import { useQuery } from "@tanstack/react-query";

import { type User } from "@/features/user/interfaces/user.interface";
import { apiClient } from "@/lib/api-client";

export const useGetUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiClient.get<User>("/users/me");
      return data;
    },
  });
