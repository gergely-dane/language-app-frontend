import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userSettingsQueryKey } from "@/features/settings/api/get-user-settings";
import {
  type UserSettings,
  userSettingsSchema,
} from "@/features/settings/types";
import { apiClient } from "@/lib/api-client";

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      const { data } = await apiClient.put<unknown>(
        "/users/me/settings",
        settings,
      );
      return userSettingsSchema.parse(data);
    },
    onSuccess: (settings) => {
      queryClient.setQueryData(userSettingsQueryKey, settings);
      // Previewed review intervals depend on the scheduler settings.
      void queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    },
  });
};
