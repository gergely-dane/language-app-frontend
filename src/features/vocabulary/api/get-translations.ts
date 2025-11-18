import { Translation } from "@/interfaces/translation.interface";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useTranslations = (params: any) => {
  return useQuery({
    queryKey: ["translations", params],
    queryFn: async () => {
      const { data } = await apiClient.get<Translation[]>("/translations", {
        params,
      });
      return data;
    },
  });
};
