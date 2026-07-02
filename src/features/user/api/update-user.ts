import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type User } from "@/features/user/interfaces/user.interface";
import { apiClient } from "@/lib/api-client";

interface UpdateUser {
  firstName: string;
  lastName: string;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UpdateUser) => {
      const { data } = await apiClient.put<User>("/users/me", userData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });
};
