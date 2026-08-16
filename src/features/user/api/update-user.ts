import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userSchema } from "@/features/user/types";
import { apiClient } from "@/lib/api-client";

interface UpdateUser {
  firstName: string;
  lastName: string;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UpdateUser) => {
      const { data } = await apiClient.put<unknown>("/users/me", userData);
      return userSchema.parse(data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });
};
