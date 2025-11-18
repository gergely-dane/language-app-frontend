import { Language } from "@/interfaces/language.interface";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useLanguages = () => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data } = await apiClient.get<Language[]>("/languages");
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
};
