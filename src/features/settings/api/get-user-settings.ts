import { queryOptions, useQuery } from "@tanstack/react-query";

import { userSettingsSchema } from "@/features/settings/types";
import { apiClient } from "@/lib/api-client";

export const userSettingsQueryKey = ["user-settings"];

export const getUserSettingsQueryOptions = () =>
  queryOptions({
    queryKey: userSettingsQueryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<unknown>("/users/me/settings");
      return userSettingsSchema.parse(data);
    },
  });

export const useGetUserSettings = () => useQuery(getUserSettingsQueryOptions());
